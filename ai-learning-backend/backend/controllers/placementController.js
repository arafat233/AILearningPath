import { Exam, Question, User } from "../models/index.js";
import { applyPlacementResults } from "../services/adaptiveRecommenderService.js";
import { AppError } from "../utils/AppError.js";

// GET /api/v1/placement-quiz
export const getPlacementQuiz = async (req, res, next) => {
  try {
    const exam = await Exam.findOne({ isPlacementQuiz: true }).lean();
    if (!exam) return next(new AppError("Placement quiz not found", 404));

    const questions = await Question.find({ _id: { $in: exam.questionIds } }).lean();
    const idMap     = new Map(questions.map((q) => [String(q._id), q]));
    const ordered   = exam.questionIds.map((id) => idMap.get(String(id))).filter(Boolean);

    res.json({
      questions: ordered.map((q) => ({
        _id:           q._id,
        questionText:  q.questionText,
        questionType:  q.questionType,
        options:       (q.options ?? []).map((o) => ({ text: o.text })),
        expectedTime:  q.expectedTime,
        marks:         q.marks,
        chapterNumber: q.chapterNumber,
        placementRole: q.placementRole,
      })),
      total:    ordered.length,
      duration: exam.duration,
    });
  } catch (err) { next(err); }
};

// GET /api/v1/placement-quiz/status
export const getPlacementStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("placementCompletedAt").lean();
    res.json({ taken: !!user?.placementCompletedAt, takenAt: user?.placementCompletedAt ?? null });
  } catch (err) { next(err); }
};

// POST /api/v1/placement-quiz/score
// Body: { answers: [{ questionId, selectedOptionIndex?, answer?, timeTaken }] }
export const scorePlacementQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return next(new AppError("answers array is required", 400));
    }

    const userId = req.user.id;

    // Check if already completed
    const user = await User.findById(userId).select("placementCompletedAt").lean();
    if (user?.placementCompletedAt) {
      return next(new AppError("Placement quiz already completed", 409));
    }

    // Fetch all questions
    const qIds      = answers.map((a) => String(a.questionId));
    const questions = await Question.find({ _id: { $in: qIds } }).lean();
    const qMap      = new Map(questions.map((q) => [String(q._id), q]));

    // Score per chapter
    const chResults = {};
    for (const answer of answers) {
      const q = qMap.get(String(answer.questionId));
      if (!q) continue;

      const ch = q.chapterNumber;
      if (!chResults[ch]) {
        chResults[ch] = { primary: { correct: 0, total: 0 }, secondary: { correct: 0, total: 0 } };
      }

      const role = q.placementRole || "primary";
      chResults[ch][role].total++;

      let isCorrect = false;
      if (q.questionType === "mcq" || q.questionType === "assertion_reason") {
        const idx = answer.selectedOptionIndex;
        if (idx != null) {
          const opt = q.options?.[idx];
          isCorrect = opt?.type === "correct";
        }
      } else {
        // numeric / free_text — compare trimmed strings
        const userAnswer = String(answer.answer ?? "").trim().toLowerCase();
        const correct    = String(q.correctAnswer ?? "").trim().toLowerCase();
        isCorrect = userAnswer !== "" && userAnswer === correct;
      }

      if (isCorrect) chResults[ch][role].correct++;
    }

    // Determine placement label per chapter
    // master: all questions correct → start at hard
    // intermediate: ≥1 correct, not all → start at medium
    // novice: 0 correct → start at easy
    const placement = {};
    for (const [ch, { primary, secondary }] of Object.entries(chResults)) {
      const totalCorrect = primary.correct + secondary.correct;
      const totalQ       = primary.total + secondary.total;
      const label =
        totalQ > 0 && totalCorrect === totalQ ? "master" :
        totalCorrect > 0                       ? "intermediate" :
                                                 "novice";

      placement[ch] = {
        label,
        totalCorrect,
        totalQ,
        startDifficulty: label === "master" ? "hard" : label === "intermediate" ? "medium" : "easy",
      };
    }

    // Initialise UserTopicMastery rows based on placement
    await applyPlacementResults(userId, placement);

    // Mark quiz as completed
    await User.findByIdAndUpdate(userId, { placementCompletedAt: new Date() });

    res.json({ placement, chapterCount: Object.keys(placement).length });
  } catch (err) { next(err); }
};
