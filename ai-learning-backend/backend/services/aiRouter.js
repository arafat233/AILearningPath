// ============================================================
// AI SMART ROUTER — 5-layer system, minimises Claude calls
//
// Layer 1: Correct answer      → return null immediately (0 cost)
// Layer 2: Has solution steps  → return steps + static tip (0 cost)
// Layer 3: Simple mistake type → return static message (0 cost)
// Layer 4: DB cache hit        → return stored response (0 cost, shared across ALL users)
// Layer 5: In-memory cache hit → return RAM response (0 cost, fast)
// Layer 6: Daily limit check   → enforce free/pro quota
// Layer 7: Call Claude         → store in DB + RAM cache for future users
//
// Result: Claude is only called when a question+mistakeType combo
// has NEVER been seen by ANY user before. After the first call,
// all future users get the cached response instantly.
// ============================================================
import crypto from "crypto";
import { getCached, setCache } from "../utils/cache.js";
import logger from "../utils/logger.js";
import { getAIExplanation, getStudyAdvice } from "./aiService.js";

import { User, AIResponseCache, AIUsageStats } from "../models/index.js";

const FREE_DAILY_LIMIT    = 10;
const PRO_DAILY_LIMIT     = 100;
const PREMIUM_DAILY_LIMIT = 500;
const CACHE_TTL_MS        = 24 * 60 * 60 * 1000; // 24h in-memory TTL

const PLAN_LIMITS = {
  free:    FREE_DAILY_LIMIT,
  pro:     PRO_DAILY_LIMIT,
  premium: PREMIUM_DAILY_LIMIT,
};

// ── Helpers ───────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];

// Deterministic cache key: hash of question text + mistake type + subject
// Same question answered wrong the same way in the same subject → same key
const makeCacheKey = (questionText, mistakeType, subject = "Math") => {
  const raw = `${questionText.toLowerCase().trim()}::${mistakeType}::${subject}`;
  return crypto.createHash("md5").update(raw).digest("hex");
};

// Static zero-cost responses for common simple mistakes
const STATIC_RESPONSES = {
  calculation_error: "Your approach was correct but the arithmetic went wrong. Redo each calculation step carefully — write out every number, don't do it in your head.",
  sign_error:        "You made a sign error. When moving a term to the other side of an equation, always flip its sign. Positive becomes negative and vice versa.",
  guessing:          "This looks like a guess — you answered very quickly. Read every option before choosing. In exams, eliminating wrong options is as powerful as knowing the right one.",
  partial_logic:     "You started correctly but didn't finish all the steps. Break every problem into small steps and don't skip any, even if they seem obvious.",
  misinterpretation: "You misread the question. Always read the question twice — once to understand it, once to confirm before solving.",
};

// ── Daily usage check + increment (atomic — no race condition) ────
export async function checkAndIncrementUsage(userId) {
  const today = todayStr();

  // First read plan to determine limit (plan doesn't change mid-session)
  const planDoc = await User.findById(userId).select("isPaid plan trialExpiry").lean();
  if (!planDoc) return false;

  const trialActive = !planDoc.isPaid && planDoc.trialExpiry && planDoc.trialExpiry > new Date();
  const planKey = planDoc.isPaid ? (planDoc.plan || "pro") : trialActive ? "pro" : "free";
  const limit   = PLAN_LIMITS[planKey] ?? FREE_DAILY_LIMIT;

  // Atomic conditional increment — only succeeds if currently under the limit
  const updated = await User.findOneAndUpdate(
    {
      _id: userId,
      $or: [
        { aiCallsDate: { $ne: today } },
        { aiCallsToday: { $lt: limit } },
      ],
    },
    [{
      $set: {
        aiCallsToday: {
          $cond: [{ $eq: ["$aiCallsDate", today] }, { $add: ["$aiCallsToday", 1] }, 1],
        },
        aiCallsDate: today,
      },
    }],
    { new: true, select: "aiCallsToday" }
  );

  return !!updated;
}

// Track cache saves (non-blocking)
async function recordCacheHit(cacheKey, userId) {
  // Update DB cache hit counter
  AIResponseCache.findOneAndUpdate(
    { cacheKey },
    { $inc: { hitCount: 1, savedCalls: 1 }, lastHitAt: new Date() }
  ).catch(() => {});

  // Update user stats
  const today = todayStr();
  AIUsageStats.findOneAndUpdate(
    { userId, date: today },
    { $inc: { callsSaved: 1 } },
    { upsert: true }
  ).catch(() => {});
}

// Store Claude response in DB permanently + in-memory
async function storeCacheResult(cacheKey, questionSnippet, mistakeType, response) {
  // DB — permanent, survives restarts, shared across all users
  try {
    await AIResponseCache.findOneAndUpdate(
      { cacheKey },
      {
        cacheKey,
        questionSnippet: questionSnippet.slice(0, 120),
        mistakeType,
        response,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        lastHitAt: new Date(),
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    // Duplicate key on race condition — harmless
    if (err.code !== 11000) logger.warn("DB cache store error", { err: err.message, cacheKey });
  }

  // RAM — fast lookup for hot questions
  setCache(cacheKey, response, CACHE_TTL_MS);
}

// ── MAIN: Smart explanation router ───────────────────────────────
export const smartAIExplanation = async (
  userId, questionText, selectedType, correctAnswer, solutionSteps = [], subject = "Math"
) => {
  // Layer 1: Correct answer — nothing to explain
  if (selectedType === "correct") return null;

  // Layer 2: Question has pre-written solution steps → use them (best quality, zero cost)
  if (solutionSteps?.length > 0) {
    const staticTip = STATIC_RESPONSES[selectedType]
      ? `${STATIC_RESPONSES[selectedType]}\n\n`
      : "";
    return `${staticTip}Step-by-step solution:\n${solutionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
  }

  // Layer 3: Simple mistake type → static response (zero cost)
  if (STATIC_RESPONSES[selectedType]) return STATIC_RESPONSES[selectedType];

  // Layer 4 & 5: Check caches before hitting Claude
  const cacheKey = makeCacheKey(questionText, selectedType, subject);

  // Layer 4: In-memory cache (fastest — microseconds)
  const memCached = getCached(cacheKey);
  if (memCached) {
    recordCacheHit(cacheKey, userId);
    return memCached;
  }

  // Layer 5: Permanent DB cache (shared across all users, survives restarts)
  try {
    const dbCached = await AIResponseCache.findOne({ cacheKey }).lean();
    if (dbCached?.response) {
      // Warm the memory cache so next request is even faster
      setCache(cacheKey, dbCached.response, CACHE_TTL_MS);
      recordCacheHit(cacheKey, userId);
      return dbCached.response;
    }
  } catch (err) {
    logger.warn("DB cache lookup error", { err: err.message, cacheKey });
  }

  // Layer 6: Daily limit check
  const allowed = await checkAndIncrementUsage(userId);
  if (!allowed) {
    return `You've used your daily AI explanation limit. Upgrade to Pro (100/day) or Premium (500/day) for more.`;
  }

  // Layer 7: Call Claude — this only happens for brand-new question+mistake combos
  const response = await getAIExplanation(questionText, selectedType, correctAnswer, subject);

  if (response) {
    // Store permanently — next student who gets this wrong pays nothing
    await storeCacheResult(cacheKey, questionText, selectedType, response);

    // Track actual Claude call in usage stats
    const today = todayStr();
    AIUsageStats.findOneAndUpdate(
      { userId, date: today },
      { $inc: { callsMade: 1 } },
      { upsert: true }
    ).catch(() => {});
  }

  return response || "Review this concept carefully and try a similar question.";
};

// ── Study advice (cached per profile state, not per user) ─────────
// Key is based on profile state — same profile = same advice = no repeat call
export const smartStudyAdvice = async (userId, profile, subject = "Math") => {
  // Key based on what matters in the profile — not userId
  const profileKey = `advice::${subject}::${profile.thinkingProfile}::${Math.round((profile.accuracy || 0) * 10)}::${(profile.weakAreas || []).slice(0, 2).join(",")}`;
  const cacheKey = crypto.createHash("md5").update(profileKey).digest("hex");

  // Check memory cache first (30-min TTL for advice)
  const memCached = getCached(`adv:${cacheKey}`);
  if (memCached) return memCached;

  // Check DB cache
  try {
    const dbCached = await AIResponseCache.findOne({ cacheKey: `adv:${cacheKey}` }).lean();
    if (dbCached?.response) {
      setCache(`adv:${cacheKey}`, dbCached.response, 30 * 60 * 1000);
      return dbCached.response;
    }
  } catch { /* fallthrough */ }

  // Check daily limit
  const allowed = await checkAndIncrementUsage(userId);
  if (!allowed) return "Focus on your weak areas with 30 minutes of practice daily. Consistency beats cramming.";

  const advice = await getStudyAdvice(profile, subject);
  if (advice) {
    storeCacheResult(`adv:${cacheKey}`, profileKey, "study_advice", advice);
    setCache(`adv:${cacheKey}`, advice, 30 * 60 * 1000);
  }
  return advice || "Focus on your weakest topics first and practice at least one timed test per week.";
};

// ── Usage info (for frontend display) ─────────────────────────────
export const getUsageCount = async (userId) => {
  const user = await User.findById(userId).select("aiCallsToday aiCallsDate isPaid plan trialExpiry").lean();
  if (!user) return { used: 0, limit: FREE_DAILY_LIMIT, remaining: FREE_DAILY_LIMIT };
  const today       = todayStr();
  const used        = user.aiCallsDate === today ? (user.aiCallsToday || 0) : 0;
  const trialActive = !user.isPaid && user.trialExpiry && user.trialExpiry > new Date();
  const planKey     = user.isPaid ? (user.plan || "pro") : trialActive ? "pro" : "free";
  const limit       = PLAN_LIMITS[planKey] ?? FREE_DAILY_LIMIT;
  return { used, limit, remaining: limit - used };
};

// ── Cache stats (for admin/debugging) ─────────────────────────────
export const getCacheStats = async () => {
  const [totalCached, totalHits, totalSaved] = await Promise.all([
    AIResponseCache.countDocuments(),
    AIResponseCache.aggregate([{ $group: { _id: null, total: { $sum: "$hitCount" } } }]),
    AIResponseCache.aggregate([{ $group: { _id: null, total: { $sum: "$savedCalls" } } }]),
  ]);
  return {
    totalCachedResponses: totalCached,
    totalCacheHits:       totalHits[0]?.total || 0,
    totalClaudeCallsSaved: totalSaved[0]?.total || 0,
  };
};
