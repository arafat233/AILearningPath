import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { getInterleavedQuestion } from "../services/adaptiveService.js";
import { Question, User, SeenQuestion } from "../models/index.js";
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

// Start a practice session from bookmarked questions OR a passed list of questionIds
// Body: { questionIds?: string[] } — if provided, uses those IDs; otherwise falls back to user bookmarks
r.post("/start-bookmarks", auth, async (req, res, next) => {
  try {
    const userId        = req.user.id;
    const passedIds     = Array.isArray(req.body?.questionIds) ? req.body.questionIds : null;

    let pool;
    if (passedIds?.length) {
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

export default r;
