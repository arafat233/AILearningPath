import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { getInterleavedQuestion } from "../services/adaptiveService.js";
import { Question } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
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
