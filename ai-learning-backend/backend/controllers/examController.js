import { Exam, ExamAttempt, Question } from "../models/index.js";
import { calculateExamScore, normalizeScores, assignRanks } from "../services/scoringService.js";

const activeExams = {};

export const listExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true });
    res.json(exams);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const startExam = async (req, res) => {
  try {
    const { examId } = req.body;
    const userId = req.user.id;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const [easy, medium, hard] = await Promise.all([
      Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $lt: 0.4 }, isFlagged: { $ne: true } } }, { $sample: { size: exam.questionDistribution.easy } }]),
      Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $gte: 0.4, $lt: 0.7 }, isFlagged: { $ne: true } } }, { $sample: { size: exam.questionDistribution.medium } }]),
      Question.aggregate([{ $match: { topic: exam.topic, difficultyScore: { $gte: 0.7 }, isFlagged: { $ne: true } } }, { $sample: { size: exam.questionDistribution.hard } }]),
    ]);

    // Send only display fields to client — never send correct answer during exam
    const questions = [...easy, ...medium, ...hard].map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map((o) => ({ text: o.text, type: o.type })),
      expectedTime: q.expectedTime,
      difficultyScore: q.difficultyScore,
      marks: q.marks || 1,
    }));

    // Store full question data server-side for validation
    activeExams[userId] = {
      examId,
      negativeMarking: exam.negativeMarking,
      negativeValue: exam.negativeValue || 0.25,
      questions: [...easy, ...medium, ...hard],
    };

    res.json({ questions, duration: exam.duration, title: exam.title, total: questions.length, negativeMarking: exam.negativeMarking });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;
    const session = activeExams[userId];
    if (!session) return res.status(400).json({ error: "No active exam session" });

    // Validate answers server-side and build detailed review
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
    delete activeExams[userId];

    res.json({
      rawScore,
      normalizedScore: userResult?.normalizedScore,
      rank:            userResult?.rank,
      percentile:      userResult?.percentile,
      totalParticipants: ranked.length,
      // Full review data — correct answers + solution steps
      review: evaluated,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getExamReview = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await ExamAttempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.userId !== req.user.id) return res.status(403).json({ error: "Not your attempt" });
    res.json(attempt);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { examId } = req.params;
    const data = await ExamAttempt.find({ examId }).sort({ rank: 1 }).limit(100).select("userId rank percentile normalizedScore rawScore createdAt");
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
