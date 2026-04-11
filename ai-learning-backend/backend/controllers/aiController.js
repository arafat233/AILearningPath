import crypto from "crypto";
import { getChatResponse } from "../services/aiService.js";
import { smartStudyAdvice, getUsageCount, getCacheStats } from "../services/aiRouter.js";
import { getCached, setCache } from "../utils/cache.js";
import { UserProfile, AIResponseCache } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

const CHAT_CACHE_TTL = 24 * 60 * 60 * 1000;

export const studyAdvice = async (req, res, next) => {
  try {
    const userId  = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.json({ advice: "Complete some practice questions first to get personalised advice." });
    }
    const advice = await smartStudyAdvice(userId, profile);
    const usage  = await getUsageCount(userId);
    res.json({ advice, usage });
  } catch (err) {
    next(err);
  }
};

export const usageInfo = async (req, res, next) => {
  try {
    const usage = await getUsageCount(req.user.id);
    res.json(usage);
  } catch (err) {
    next(err);
  }
};

export const tutorChat = async (req, res, next) => {
  try {
    const { message, history = [], topic } = req.body;
    const cleanHistory = history.map((m) => ({ role: m.role, content: m.content }));
    const isFirstTurn  = cleanHistory.length === 0;

    if (isFirstTurn) {
      const cacheKey = `chat::${crypto.createHash("md5")
        .update(`${topic || "general"}::${message.toLowerCase().trim()}`)
        .digest("hex")}`;

      const memHit = getCached(cacheKey);
      if (memHit) return res.json({ reply: memHit, fromCache: true });

      const dbHit = await AIResponseCache.findOne({ cacheKey }).lean();
      if (dbHit?.response) {
        setCache(cacheKey, dbHit.response, CHAT_CACHE_TTL);
        AIResponseCache.findOneAndUpdate(
          { cacheKey },
          { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }
        ).catch(() => {});
        return res.json({ reply: dbHit.response, fromCache: true });
      }

      const reply = await getChatResponse([], message, topic);
      if (reply) {
        const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        AIResponseCache.findOneAndUpdate(
          { cacheKey },
          { cacheKey, questionSnippet: message.slice(0, 120), mistakeType: "chat", response: reply, expiresAt },
          { upsert: true }
        ).catch(() => {});
        setCache(cacheKey, reply, CHAT_CACHE_TTL);
      }
      return res.json({ reply: reply || "I'm here to help! Could you rephrase that?" });
    }

    const reply = await getChatResponse(cleanHistory, message, topic);
    res.json({ reply: reply || "I'm here to help! Could you rephrase that?" });
  } catch (err) {
    next(err);
  }
};

export const cacheStats = async (req, res, next) => {
  try {
    const stats = await getCacheStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
