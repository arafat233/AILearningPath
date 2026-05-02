import { Exam, Question, Topic, User } from "../models/index.js";
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
//
// 4-label system (from placement_quiz_scorer.py):
//   mastered_through_medium — all chapter questions correct → start hard (easy+medium mastered)
//   mastered_easy           — specific topic question correct → start medium (easy mastered)
//   partial_familiarity     — some chapter correct but not this topic → start easy
//   novice                  — zero correct in chapter → start easy
export const scorePlacementQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return next(new AppError("answers array is required", 400));
    }

    const userId = req.user.id;

    // Guard: one-shot only
    const user = await User.findById(userId).select("placementCompletedAt").lean();
    if (user?.placementCompletedAt) {
      return next(new AppError("Placement quiz already completed", 409));
    }

    // Fetch all question documents
    const qIds      = answers.map((a) => String(a.questionId));
    const questions = await Question.find({ _id: { $in: qIds } }).lean();
    const qMap      = new Map(questions.map((q) => [String(q._id), q]));

    // Build per-chapter scores + track which topicIds were directly answered correctly
    const chData = {}; // ch -> { correct, total, topicsHit: Set }
    for (const answer of answers) {
      const q = qMap.get(String(answer.questionId));
      if (!q) continue;

      const ch = q.chapterNumber;
      if (!chData[ch]) chData[ch] = { correct: 0, total: 0, topicsHit: new Set() };
      chData[ch].total++;

      let isCorrect = false;
      if (q.questionType === "mcq" || q.questionType === "assertion_reason") {
        const opt = answer.selectedOptionIndex != null ? q.options?.[answer.selectedOptionIndex] : null;
        isCorrect = opt?.type === "correct";
      } else {
        const ua = String(answer.answer ?? "").trim().toLowerCase().replace(/^['"]|['"]$/g, "");
        const ca = String(q.correctAnswer ?? "").trim().toLowerCase().replace(/^['"]|['"]$/g, "");
        isCorrect = ua !== "" && ua === ca;
      }

      if (isCorrect) {
        chData[ch].correct++;
        if (q.topicId) chData[ch].topicsHit.add(q.topicId);
      }
    }

    // Load full topic DAG so we can map chapter → all topicIds
    const allTopics = await Topic.find({ topicId: { $ne: null } }).lean();

    // Assign per-topic placement label
    const placementByTopic = {};
    for (const [chStr, { correct, total, topicsHit }] of Object.entries(chData)) {
      const ch         = parseInt(chStr, 10);
      const chTopics   = allTopics.filter((t) => {
        const m = t.topicId?.match(/^ch(\d+)_/);
        return m && parseInt(m[1], 10) === ch;
      });
      const allCorrect = correct === total && total > 0;
      const anyCorrect = correct > 0;

      for (const t of chTopics) {
        if (allCorrect) {
          placementByTopic[t.topicId] = "mastered_through_medium";
        } else if (topicsHit.has(t.topicId)) {
          placementByTopic[t.topicId] = "mastered_easy";
        } else if (anyCorrect) {
          placementByTopic[t.topicId] = "partial_familiarity";
        } else {
          placementByTopic[t.topicId] = "novice";
        }
      }
    }

    // Initialise UserTopicMastery rows
    await applyPlacementResults(userId, placementByTopic);

    // Mark quiz complete
    await User.findByIdAndUpdate(userId, { placementCompletedAt: new Date() });

    // Build summary (mirrors placement_quiz_scorer.py output)
    const chaptersAced    = Object.keys(chData).filter((ch) => chData[ch].correct === chData[ch].total && chData[ch].total > 0);
    const chaptersStarted = Object.keys(chData).filter((ch) => chData[ch].correct > 0 && chData[ch].correct < chData[ch].total);
    const chaptersNovice  = Object.keys(chData).filter((ch) => chData[ch].correct === 0);

    // Recommend first topic: lowest-level novice/partial topic
    const weakTopics = allTopics
      .filter((t) => ["partial_familiarity", "novice"].includes(placementByTopic[t.topicId]))
      .sort((a, b) => (a.level ?? 99) - (b.level ?? 99));
    const recommendedFirstTopic = weakTopics[0]?.topicId ?? null;

    res.json({
      summary: {
        totalCorrect: Object.values(chData).reduce((s, d) => s + d.correct, 0),
        totalQuestions: Object.values(chData).reduce((s, d) => s + d.total, 0),
        chaptersAced,
        chaptersStarted,
        chaptersNovice,
        recommendedFirstTopic,
      },
      placementByTopic,
      chapterCount: Object.keys(chData).length,
    });
  } catch (err) { next(err); }
};
