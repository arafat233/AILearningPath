import { Exam, ExamAttempt, Question, WeeklyLeaderboard } from "../models/index.js";
import { calculateExamScore, normalizeScores, assignRanks } from "../services/scoringService.js";
import { AppError } from "../utils/AppError.js";
import { sessionGet, sessionSet, sessionDel } from "../utils/redisClient.js";

const EXAM_TTL  = 10800; // 3 hours — max exam duration with buffer
const examKey   = (userId) => `exam:${userId}`;

function currentWeekStr() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const listExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ isActive: true }).limit(50);
    res.json(exams);
  } catch (err) { next(err); }
};

export const startExam = async (req, res, next) => {
  try {
    const { examId } = req.body;
    const userId = req.user.id;
    const exam = await Exam.findById(examId);
    if (!exam) return next(new AppError("Exam not found", 404));

    let allQuestions;

    if (exam.isMockPaper && exam.questionIds?.length) {
      // Mock paper: use the pre-defined ordered question set
      allQuestions = await Question.find(
        { _id: { $in: exam.questionIds }, deletedAt: null },
      ).lean();
      // Restore the order defined in questionIds
      const idMap = new Map(allQuestions.map((q) => [String(q._id), q]));
      allQuestions = exam.questionIds.map((id) => idMap.get(String(id))).filter(Boolean);
    } else {
      // Adaptive exam: sample questions by difficulty
      const [easy, medium, hard] = await Promise.all([
        Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $lt: 0.4 }, isFlagged: { $ne: true }, deletedAt: null } }, { $sample: { size: exam.questionDistribution.easy } }]),
        Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $gte: 0.4, $lt: 0.7 }, isFlagged: { $ne: true }, deletedAt: null } }, { $sample: { size: exam.questionDistribution.medium } }]),
        Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $gte: 0.7 }, isFlagged: { $ne: true }, deletedAt: null } }, { $sample: { size: exam.questionDistribution.hard } }]),
      ]);
      allQuestions = [...easy, ...medium, ...hard];
    }

    const questions = allQuestions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options?.map((o) => ({ text: o.text })) ?? [],
      expectedTime: q.expectedTime,
      difficultyScore: q.difficultyScore,
      marks: q.marks || 1,
    }));

    const startedAt = Date.now();
    await sessionSet(examKey(userId), {
      examId,
      topic: exam.topic,
      negativeMarking: exam.negativeMarking,
      negativeValue: exam.negativeValue || 0.25,
      questions: allQuestions,
      startedAt,
      durationSeconds: (exam.duration || 60) * 60,
    }, EXAM_TTL);

    res.json({
      questions,
      duration: exam.duration,
      startedAt,
      durationSeconds: (exam.duration || 60) * 60,
      title: exam.title,
      total: questions.length,
      negativeMarking: exam.negativeMarking,
    });
  } catch (err) { next(err); }
};

export const submitExam = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;
    const session = await sessionGet(examKey(userId));
    if (!session) return next(new AppError("No active exam session", 400));

    // Server-side time check: if exam duration has elapsed, mark remaining answers as blank
    const elapsed = session.startedAt ? Math.floor((Date.now() - session.startedAt) / 1000) : 0;
    const timeExpired = session.durationSeconds && elapsed > session.durationSeconds + 30; // 30s grace
    const submittedIds = new Set(answers.map((a) => a.questionId));
    const finalAnswers = timeExpired
      ? session.questions.map((q) => {
          const submitted = answers.find((a) => a.questionId === q._id.toString());
          return submitted || { questionId: q._id.toString(), selectedOptionIndex: null, timeTaken: 0 };
        })
      : answers;

    const evaluated = finalAnswers.map((a) => {
      const fullQ = session.questions.find((q) => q._id.toString() === a.questionId);
      if (!fullQ) return null;

      // Derive answer server-side from index — client never sends type
      const selectedOpt = (a.selectedOptionIndex != null) ? fullQ.options[a.selectedOptionIndex] : null;
      const selectedType = selectedOpt?.type || "";
      const correctOpt = fullQ.options.find((o) => o.type === "correct");
      const isCorrect = selectedType === "correct";
      const marks = fullQ.marks || 1;

      let marksAwarded = 0;
      if (isCorrect) {
        marksAwarded = marks;
      } else if (selectedType && session.negativeMarking) {
        marksAwarded = -(session.negativeValue || 0.25);
      }

      return {
        questionId:    a.questionId,
        questionText:  fullQ.questionText,
        isCorrect,
        difficulty:    fullQ.difficultyScore,
        selectedType,
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

    const allAttempts = await ExamAttempt.find({ examId: session.examId }).select("userId rawScore").lean();
    const normalized  = normalizeScores(allAttempts);
    const ranked      = assignRanks(normalized);

    if (ranked.length > 0) {
      await ExamAttempt.bulkWrite(
        ranked.map((r) => ({
          updateOne: {
            filter: { _id: r._id },
            update: { $set: { normalizedScore: r.normalizedScore, rank: r.rank, percentile: r.percentile } },
          },
        }))
      );
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

    await sessionDel(examKey(userId));

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
