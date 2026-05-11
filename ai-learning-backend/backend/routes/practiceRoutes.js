import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { getInterleavedQuestion } from "../services/adaptiveService.js";
import { Question, User, SeenQuestion, QuestionStats, Attempt } from "../models/index.js";
import { QuestionReport, SkipReason, ErrorLabel } from "../models/practiceFeedbackModels.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
import { sessionSet } from "../utils/redisClient.js";
import logger from "../utils/logger.js";

const r = express.Router();

// SEC-12: Per-user rate limit on flagging to prevent abuse
const flagLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many flag requests. Slow down." },
});

const startSchema = Joi.object({
  topicId: Joi.string().required(),
});

// Client sends selected option index; backend derives selectedType server-side
const submitSchema = Joi.object({
  selectedOptionIndex: Joi.number().integer().min(-1).max(10).required(),
  timeTaken:           Joi.number().min(1).max(600).optional(),
  confidence:          Joi.string().valid("low", "medium", "high").optional(),
});

const mixedSchema = Joi.object({
  topics: Joi.array().items(Joi.string()).min(1).required(),
});

const flagSchema = Joi.object({
  questionId: Joi.string().required(),
});

r.post("/start",   auth, validate(startSchema),  startTopic);
r.post("/submit",  auth, validate(submitSchema), submitAnswer);
r.get("/teacher",  auth, getTeacherMessage);

r.post("/mixed", auth, validate(mixedSchema), async (req, res, next) => {
  try {
    const { topics } = req.body;
    const question = await getInterleavedQuestion(req.user.id, topics);
    if (!question) return next(new AppError("No questions found", 404));

    // Store in session so /practice/submit can find the current question
    const { sessionSet } = await import("../utils/redisClient.js");
    const sessionKey = `practice:${req.user.id}`;
    const qObj = question.toObject?.() ?? question;
    await sessionSet(sessionKey, {
      topic: question.topic || topics[0],
      sessionCorrect: 0,
      sessionTotal: 0,
      currentQuestion: qObj,
    }, 7200);

    // Strip option types before sending to client
    const safeOpts = (qObj.options || []).map(({ text, logicTag }) => ({ text, logicTag }));
    res.json({ ...qObj, options: safeOpts });
  } catch (err) {
    next(err);
  }
});

// Start a practice session from bookmarked questions, a passed list of questionIds,
// OR a custom bookmark collection (collectionId).
r.post("/start-bookmarks", auth, async (req, res, next) => {
  try {
    const userId        = req.user.id;
    const passedIds     = Array.isArray(req.body?.questionIds) ? req.body.questionIds : null;
    const collectionId  = req.body?.collectionId;

    let pool;
    if (collectionId) {
      const { BookmarkCollection } = await import("../models/bookmarkModels.js");
      const col = await BookmarkCollection.findOne({ _id: collectionId, userId }).lean();
      if (!col) return next(new AppError("Collection not found", 404));
      pool = col.memberRefs.filter((m) => m.kind === "question").map((m) => m.refId);
      if (!pool.length) return next(new AppError("No questions in this collection", 404));
    } else if (passedIds?.length) {
      // Retry-wrong or any explicit ID list — use them directly
      pool = passedIds;
    } else {
      const user = await User.findById(userId).select("savedQuestions").lean();
      if (!user?.savedQuestions?.length) return next(new AppError("No bookmarked questions", 404));
      const savedIds = user.savedQuestions.map((id) => id.toString());

      // Prefer unseen bookmarks; fall back to any if all have been seen
      const seen = await SeenQuestion.find({ userId, questionId: { $in: savedIds } })
        .select("questionId").lean();
      const seenSet = new Set(seen.map((s) => s.questionId));
      const unseen  = savedIds.filter((id) => !seenSet.has(id));
      pool = unseen.length ? unseen : savedIds;
    }

    const pickedId = pool[Math.floor(Math.random() * pool.length)];
    const question = await Question.findOne({
      _id: pickedId,
      deletedAt: null,
      questionType: { $in: ["mcq", "assertion_reason", "case_based"] },
      "options.0": { $exists: true },
    }).lean();

    if (!question) return next(new AppError("No playable questions found", 404));

    // Store remaining IDs in session so next question can be drawn from the same set
    await sessionSet(`practice:${userId}`, {
      topic: question.topic,
      sessionCorrect: 0,
      sessionTotal: 0,
      currentQuestion: question,
      retryPool: passedIds ? pool.filter((id) => id !== String(pickedId)) : null,
    }, 7200);

    SeenQuestion.create({ userId, questionId: String(question._id), topic: question.topic }).catch(() => {});

    const safeOpts = (question.options || []).map(({ text, logicTag }) => ({ text, logicTag }));
    res.json({ ...question, options: safeOpts, fromBookmarks: !passedIds, fromRetry: !!passedIds });
  } catch (err) {
    next(err);
  }
});

r.post("/flag", auth, flagLimiter, validate(flagSchema), async (req, res, next) => {
  try {
    const { questionId } = req.body;
    await Question.findByIdAndUpdate(questionId, { $set: { isFlagged: true } });
    logger.info("Question flagged", { userId: req.user.id, questionId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Practice v2 endpoints ─────────────────────────────────────────────

// Question stats (i affordance — social proof)
r.get("/question-stats/:questionId", auth, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId.match(/^[0-9a-fA-F]{24}$/)) return next(new AppError("Invalid id", 400));
    const q = await Question.findById(questionId).select("questionId expectedTime").lean();
    if (!q) return next(new AppError("Question not found", 404));
    const s = await QuestionStats.findOne({ questionId: q.questionId || String(q._id) }).lean();
    if (!s) return res.json({ data: { attempts: 0, accuracy: null, avgTime: null, expectedTime: q.expectedTime || null } });
    res.json({
      data: {
        attempts: s.attempts || 0,
        accuracy: s.attempts ? Math.round((s.correct / s.attempts) * 100) : null,
        avgTime:  Math.round(s.avgTime || 0),
        expectedTime: q.expectedTime || null,
      },
    });
  } catch (err) { next(err); }
});

// Peer time (anonymized average for school group / all users)
r.get("/peer-time/:questionId", auth, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const myAttempts = await Attempt.find({ userId: req.user.id, questionId }).select("timeTaken").lean();
    const others = await Attempt.find({ questionId, userId: { $ne: req.user.id } }).select("timeTaken").limit(500).lean();
    const myAvg = myAttempts.length ? Math.round(myAttempts.reduce((a, x) => a + (x.timeTaken || 0), 0) / myAttempts.length) : null;
    const peerAvg = others.length ? Math.round(others.reduce((a, x) => a + (x.timeTaken || 0), 0) / others.length) : null;
    res.json({ data: { myAvg, peerAvg, peerCount: others.length } });
  } catch (err) { next(err); }
});

// Skip with reason
const skipReasonSchema = Joi.object({
  questionId: Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
  reason: Joi.string().valid("dont_know", "too_easy", "confusing", "bad_question", "no_time").required(),
});
r.post("/skip-reason", auth, validate(skipReasonSchema), async (req, res, next) => {
  try {
    const { questionId, reason } = req.body;
    await SkipReason.create({ userId: req.user.id, questionId, reason });
    res.json({ data: { ok: true } });
  } catch (err) { next(err); }
});

// Self-labeled error after wrong answer
const errLabelSchema = Joi.object({
  questionId: Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
  label: Joi.string().valid("misread", "calc_slip", "concept_gap", "stuck_step", "guessed", "other").required(),
});
r.post("/error-label", auth, validate(errLabelSchema), async (req, res, next) => {
  try {
    const { questionId, label } = req.body;
    await ErrorLabel.create({ userId: req.user.id, questionId, label });
    res.json({ data: { ok: true } });
  } catch (err) { next(err); }
});

// Report a question (distinct from flag)
const reportSchema = Joi.object({
  questionId: Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
  reason: Joi.string().valid("wrong_answer", "confusing_wording", "broken_image", "off_syllabus", "duplicate", "other").required(),
  note: Joi.string().allow("").max(500).optional(),
});
r.post("/report", auth, validate(reportSchema), async (req, res, next) => {
  try {
    const { questionId, reason, note } = req.body;
    await QuestionReport.create({ userId: req.user.id, questionId, reason, note: note || "" });
    logger.info("Question reported", { userId: req.user.id, questionId, reason });
    res.json({ data: { ok: true } });
  } catch (err) { next(err); }
});

// Concept lineage (prerequisites for a question's concept)
r.get("/lineage/:questionId", auth, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId.match(/^[0-9a-fA-F]{24}$/)) return next(new AppError("Invalid id", 400));
    const q = await Question.findById(questionId).select("prerequisites topic conceptTested").lean();
    if (!q) return next(new AppError("Question not found", 404));
    res.json({ data: { prerequisites: q.prerequisites || [], topic: q.topic, conceptTested: q.conceptTested } });
  } catch (err) { next(err); }
});

export default r;
