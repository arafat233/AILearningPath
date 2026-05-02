import crypto from "crypto";
import express from "express";
import rateLimit from "express-rate-limit";
import Joi from "joi";
import { studyAdvice, usageInfo, cacheStats, tutorChat } from "../controllers/aiController.js";
import { getChatResponse, generateHint } from "../services/aiService.js";
import { getCached, setCache } from "../utils/cache.js";
import { AIResponseCache } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { sessionGet, sessionSet, sessionDel } from "../utils/redisClient.js";

const voiceHistoryKey = (userId) => `voice:${userId}`;
const VOICE_HISTORY_TTL = 7 * 24 * 60 * 60;  // 7 days
const HISTORY_CAP = 50;                         // max messages stored

const r = express.Router();
const EVAL_CACHE_TTL = 24 * 60 * 60 * 1000;

// Per-user rate limit for endpoints that call Claude — 50 calls/hour
// Separate from the global 300/15min — stops one user exhausting quota
const perUserAILimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (_req, res) =>
    res.status(429).json({ error: "AI rate limit exceeded — try again in an hour" }),
  standardHeaders: true,
  legacyHeaders: false,
});

const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required(),
  history: Joi.array().max(20).optional(),
  topic:   Joi.string().max(200).optional().allow(""),
});

const voiceSchema = Joi.object({
  transcript: Joi.string().trim().min(1).max(3000).required(),
  topic:      Joi.string().max(200).optional().allow(""),
  subject:    Joi.string().max(100).optional().allow(""),
});

const evalSchema = Joi.object({
  concept:         Joi.string().min(1).max(500).required(),
  userExplanation: Joi.string().min(1).max(2000).required(),
});

const hintSchema = Joi.object({
  questionText: Joi.string().required(),
  topic:        Joi.string().optional().allow(""),
});

r.get("/advice",      auth,      studyAdvice);
r.get("/usage",       auth,      usageInfo);
r.get("/cache-stats", adminAuth, cacheStats); // admin only — business metrics
r.post("/chat",       auth, perUserAILimit, validate(chatSchema), tutorChat);

// Admin: invalidate cached AI responses by cacheKey prefix or mistakeType
r.delete("/cache", adminAuth, async (req, res, next) => {
  try {
    const { cacheKey, mistakeType } = req.query;
    const filter = cacheKey
      ? { cacheKey }
      : mistakeType
      ? { mistakeType }
      : null;
    if (!filter) return res.status(400).json({ error: "Provide cacheKey or mistakeType query param" });
    const result = await AIResponseCache.deleteMany(filter);
    res.json({ data: { deleted: result.deletedCount } });
  } catch (err) { next(err); }
});

// Voice history CRUD
r.get("/voice-history", auth, async (req, res, next) => {
  try {
    const history = await sessionGet(voiceHistoryKey(req.user.id));
    res.json({ history: history || [] });
  } catch (err) { next(err); }
});

r.delete("/voice-history", auth, async (req, res, next) => {
  try {
    await sessionDel(voiceHistoryKey(req.user.id));
    res.json({ data: { message: "History cleared." } });
  } catch (err) { next(err); }
});

// VoiceTutor endpoint — uses + persists per-user history
r.post("/voice-answer", auth, perUserAILimit, validate(voiceSchema), async (req, res, next) => {
  try {
    const { transcript, topic, subject } = req.body;
    const userId = req.user.id;
    logger.info("AI voice call", { userId, topic, subject });

    // Load existing history to maintain context across sessions
    const existing = (await sessionGet(voiceHistoryKey(userId))) || [];
    const history  = Array.isArray(existing) ? existing : [];

    const reply = await getChatResponse(history, transcript, topic || `General ${subject || "Math"}`, subject || "Math");
    const answer = reply || "Could not generate a response. Please try rephrasing your question.";

    // Append exchange and persist (cap oldest messages to avoid unbounded growth)
    const updated = [...history, { role: "user", content: transcript }, { role: "assistant", content: answer }];
    const capped  = updated.length > HISTORY_CAP ? updated.slice(updated.length - HISTORY_CAP) : updated;
    sessionSet(voiceHistoryKey(userId), capped, VOICE_HISTORY_TTL).catch(() => {});

    res.json({ answer });
  } catch (err) { next(err); }
});

// Evaluate a student's written explanation — DB-cached by concept+explanation hash
r.post("/evaluate-explanation", auth, perUserAILimit, validate(evalSchema), async (req, res, next) => {
  try {
    const { concept, userExplanation } = req.body;

    const normalised = userExplanation.toLowerCase().trim().slice(0, 80);
    const cacheKey   = `eval::${crypto.createHash("md5")
      .update(`${concept.toLowerCase()}::${normalised}`)
      .digest("hex")}`;

    const memHit = getCached(cacheKey);
    if (memHit) {
      logger.info("AI eval cache hit (memory)", { userId: req.user.id, concept });
      return res.json({ feedback: memHit, fromCache: true });
    }

    const dbHit = await AIResponseCache.findOne({ cacheKey }).lean();
    if (dbHit?.response) {
      setCache(cacheKey, dbHit.response, EVAL_CACHE_TTL);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }
      ).catch(() => {});
      logger.info("AI eval cache hit (DB)", { userId: req.user.id, concept });
      return res.json({ feedback: dbHit.response, fromCache: true });
    }

    logger.info("AI eval — calling Claude", { userId: req.user.id, concept });
    const prompt = `A student is explaining "${concept}" in their own words. Evaluate if they understood it correctly.
Their explanation: "${userExplanation}"

In 2-3 sentences: (1) Did they get it right? (2) What's missing or wrong? (3) One improvement.
Be encouraging but honest.`;

    const reply = await getChatResponse([], prompt, concept);
    if (reply) {
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { cacheKey, questionSnippet: concept.slice(0, 120), mistakeType: "eval", response: reply, expiresAt },
        { upsert: true }
      ).catch(() => {});
      setCache(cacheKey, reply, EVAL_CACHE_TTL);
    }

    res.json({ feedback: reply || "Good effort! Review the concept and try explaining it again." });
  } catch (err) {
    next(err);
  }
});

// Hint for a stuck student — DB-cached by question text hash
const HINT_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

r.post("/hint", auth, perUserAILimit, validate(hintSchema), async (req, res, next) => {
  try {
    const { questionText, topic } = req.body;

    const cacheKey = `hint::${crypto.createHash("md5")
      .update(questionText.toLowerCase().trim())
      .digest("hex")}`;

    const memHit = getCached(cacheKey);
    if (memHit) {
      logger.info("AI hint cache hit (memory)", { userId: req.user.id });
      return res.json({ hint: memHit, fromCache: true });
    }

    const dbHit = await AIResponseCache.findOne({ cacheKey }).lean();
    if (dbHit?.response) {
      setCache(cacheKey, dbHit.response, HINT_CACHE_TTL);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }
      ).catch(() => {});
      logger.info("AI hint cache hit (DB)", { userId: req.user.id });
      return res.json({ hint: dbHit.response, fromCache: true });
    }

    logger.info("AI hint — calling Claude", { userId: req.user.id, topic });
    const hint = await generateHint(questionText, topic || "Math");
    if (hint) {
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { cacheKey, questionSnippet: questionText.slice(0, 120), mistakeType: "hint", response: hint, expiresAt },
        { upsert: true }
      ).catch(() => {});
      setCache(cacheKey, hint, HINT_CACHE_TTL);
    }

    res.json({ hint: hint || "Think about which formula applies here. Review the concept and try again!" });
  } catch (err) {
    next(err);
  }
});

export default r;
