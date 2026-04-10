import crypto from "crypto";
import express from "express";
import { studyAdvice, usageInfo, cacheStats, tutorChat } from "../controllers/aiController.js";
import { getChatResponse } from "../services/aiService.js";
import { getCached, setCache } from "../utils/cache.js";
import { AIResponseCache } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();
const EVAL_CACHE_TTL = 24 * 60 * 60 * 1000;

r.get("/advice",      auth, studyAdvice);
r.get("/usage",       auth, usageInfo);
r.get("/cache-stats", auth, cacheStats);
r.post("/chat",       auth, tutorChat);

// Evaluate a student's written explanation of a concept.
// Cache key: concept + first 80 chars of explanation (normalised).
// Same concept + essentially same explanation → return stored feedback instantly.
r.post("/evaluate-explanation", auth, async (req, res) => {
  try {
    const { concept, userExplanation } = req.body;
    if (!concept || !userExplanation) {
      return res.status(400).json({ error: "concept and userExplanation are required" });
    }

    const normalised = userExplanation.toLowerCase().trim().slice(0, 80);
    const cacheKey   = `eval::${crypto.createHash("md5")
      .update(`${concept.toLowerCase()}::${normalised}`)
      .digest("hex")}`;

    // RAM cache
    const memHit = getCached(cacheKey);
    if (memHit) return res.json({ feedback: memHit, fromCache: true });

    // DB cache — shared across all users who write a similar explanation
    const dbHit = await AIResponseCache.findOne({ cacheKey }).lean();
    if (dbHit?.response) {
      setCache(cacheKey, dbHit.response, EVAL_CACHE_TTL);
      AIResponseCache.findOneAndUpdate(
        { cacheKey },
        { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }
      ).catch(() => {});
      return res.json({ feedback: dbHit.response, fromCache: true });
    }

    // Not cached — call Claude once, store permanently
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
    res.status(500).json({ error: err.message });
  }
});

export default r;
