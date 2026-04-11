import { Exam, ExamAttempt, Question, WeeklyLeaderboard } from "../models/index.js";
import { calculateExamScore, normalizeScores, assignRanks } from "../services/scoringService.js";
import { AppError } from "../utils/AppError.js";

function currentWeekStr() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

const activeExams = {};

export const listExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ isActive: true });
    res.json(exams);
  } catch (err) { next(err); }
};

export const startExam = async (req, res, next) => {
  try {
    const { examId } = req.body;
    const userId = req.user.id;
    const exam = await Exam.findById(examId);
    if (!exam) return next(new AppError("Exam not found", 404));

    const [easy, medium, hard] = await Promise.all([
      Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $lt: 0.4 }, isFlagged: { $ne: true } } }, { $sample: { size: exam.questionDistribution.easy } }]),
      Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $gte: 0.4, $lt: 0.7 }, isFlagged: { $ne: true } } }, { $sample: { size: exam.questionDistribution.medium } }]),
      Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $gte: 0.7 }, isFlagged: { $ne: true } } }, { $sample: { size: exam.questionDistribution.hard } }]),
    ]);

    const questions = [...easy, ...medium, ...hard].map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map((o) => ({ text: o.text, type: o.type })),
      expectedTime: q.expectedTime,
      difficultyScore: q.difficultyScore,
      marks: q.marks || 1,
    }));

    activeExams[userId] = {
      examId,
      topic: exam.topic,
      negativeMarking: exam.negativeMarking,
      negativeValue: exam.negativeValue || 0.25,
      questions: [...easy, ...medium, ...hard],
    };

    res.json({ questions, duration: exam.duration, title: exam.title, total: questions.length, negativeMarking: exam.negativeMarking });
  } catch (err) { next(err); }
};

export const submitExam = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;
    const session = activeExams[userId];
    if (!session) return next(new AppError("No active exam session", 400));

    const evaluated = answers.map((a) => {
      const fullQ = session.questions.find((q) => q._id.toString() === a.questionId);
      if (!fullQ) return null;

      const correctOpt = fullQ.options.find((o) => o.type === "correct");
      const selectedOpt = fullQ.options.find((o) => o.type === a.selectedType);
      const isCorrect = a.selectedType === "correct";
      const marks = fullQ.marks || 1;

      let marksAwarded = 0;
      if (isCorrect) {
        marksAwarded = marks;
      } else if (a.selectedType && session.negativeMarking) {
        marksAwarded = -(session.negativeValue || 0.25);
      }

      return {
        questionId:    a.questionId,
        questionText:  fullQ.questionText,
        isCorrect,
        difficulty:    fullQ.difficultyScore,
        selectedType:  a.selectedType,
        selectedText:  selectedOpt?.text || "Not answered",
        correctText:   correctOpt?.text || "",
        solutionSteps: fullQ.solutionSteps || [],
        shortcut:      fullQ.shortcut || null,
        timeTaken:     a.timeTaken || 0,
        marksAwarded,
      };
    }).filter(Boolean);

    const rawScore = calculateExamScore(evaluated);
    await ExamAttempt.create({ userId, examId: session.examId, answers: evaluated, rawScore });

    const allAttempts = await ExamAttempt.find({ examId: session.examId });
    const normalized  = normalizeScores(allAttempts);
    const ranked      = assignRanks(normalized);

    for (const r of ranked) {
      await ExamAttempt.findByIdAndUpdate(r._id, { normalizedScore: r.normalizedScore, rank: r.rank, percentile: r.percentile });
    }

    const userResult = ranked.find((r) => r.userId === userId);

    if (userResult) {
      const week = currentWeekStr();
      await WeeklyLeaderboard.findOneAndUpdate(
        { userId, week },
        {
          $max: { score: rawScore },
          $set: {
            topic:     session.topic || "General",
            accuracy:  parseFloat((evaluated.filter((e) => e.isCorrect).length / evaluated.length).toFixed(3)),
            rank:      userResult.rank,
            percentile: userResult.percentile,
          },
        },
        { upsert: true }
      ).catch(() => {});
    }

    delete activeExams[userId];

    res.json({
      rawScore,
      normalizedScore: userResult?.normalizedScore,
      rank:            userResult?.rank,
      percentile:      userResult?.percentile,
      totalParticipants: ranked.length,
      review: evaluated,
    });
  } catch (err) { next(err); }
};

export const getExamReview = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt) return next(new AppError("Attempt not found", 404));
    if (attempt.userId !== req.user.id) return next(new AppError("Not your attempt", 403));
    res.json(attempt);
  } catch (err) { next(err); }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const data = await ExamAttempt.find({ examId }).sort({ rank: 1 }).limit(100).select("userId rank percentile normalizedScore rawScore createdAt");
    res.json(data);
  } catch (err) { next(err); }
};
