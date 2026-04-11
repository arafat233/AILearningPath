import crypto from "crypto";
import express from "express";
import Joi from "joi";
import { studyAdvice, usageInfo, cacheStats, tutorChat } from "../controllers/aiController.js";
import { getChatResponse, generateHint } from "../services/aiService.js";
import { getCached, setCache } from "../utils/cache.js";
import { AIResponseCache } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";

const r = express.Router();
const EVAL_CACHE_TTL = 24 * 60 * 60 * 1000;

const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).required(),
  history: Joi.array().optional(),
  topic:   Joi.string().optional().allow(""),
});

const voiceSchema = Joi.object({
  transcript: Joi.string().trim().min(1).required(),
  topic:      Joi.string().optional().allow(""),
  subject:    Joi.string().optional().allow(""),
});

const evalSchema = Joi.object({
  concept:         Joi.string().required(),
  userExplanation: Joi.string().required(),
});

const hintSchema = Joi.object({
  questionText: Joi.string().required(),
  topic:        Joi.string().optional().allow(""),
});

r.get("/advice",      auth, studyAdvice);
r.get("/usage",       auth, usageInfo);
r.get("/cache-stats", auth, cacheStats);
r.post("/chat",       auth, validate(chatSchema), tutorChat);

// VoiceTutor endpoint — accepts speech transcript, returns Claude answer
r.post("/voice-answer", auth, validate(voiceSchema), async (req, res, next) => {
  try {
    const { transcript, topic, subject } = req.body;
    const reply = await getChatResponse([], transcript, topic || `General ${subject || "Math"}`, subject || "Math");
    res.json({ answer: reply || "Could not generate a response. Please try rephrasing your question." });
  } catch (err) { next(err); }
});

// Evaluate a student's written explanation of a concept.
r.post("/evaluate-explanation", auth, validate(evalSchema), async (req, res, next) => {
  try {
    const { concept, userExplanation } = req.body;

    const normalised = userExplanation.toLowerCase().trim().slice(0, 80);
    const cacheKey   = `eval::${crypto.createHash("md5")
      .update(`${concept.toLowerCase()}::${normalised}`)
      .digest("hex")}`;

    const memHit = getCached(cacheKey);
    if (memHit) return res.json({ feedback: memHit, fromCache: true });

    const dbHit = await AIResponseCache.findOne({ cacheKey }).lean();
    if (dbHit?.response) {
      setCache(cacheKey, dbHit.response, EVAL_CACHE_TTL);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }
      ).catch(() => {});
      return res.json({ feedback: dbHit.response, fromCache: true });
    }

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

// Hint for a stuck student — DB-first cache by question text hash.
const HINT_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

r.post("/hint", auth, validate(hintSchema), async (req, res, next) => {
  try {
    const { questionText, topic } = req.body;

    const cacheKey = `hint::${crypto.createHash("md5")
      .update(questionText.toLowerCase().trim())
      .digest("hex")}`;

    const memHit = getCached(cacheKey);
    if (memHit) return res.json({ hint: memHit, fromCache: true });

    const dbHit = await AIResponseCache.findOne({ cacheKey }).lean();
    if (dbHit?.response) {
      setCache(cacheKey, dbHit.response, HINT_CACHE_TTL);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }
      ).catch(() => {});
      return res.json({ hint: dbHit.response, fromCache: true });
    }

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
