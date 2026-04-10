// ============================================================
// AI SMART ROUTER — 70% cost reduction
// Correct → nothing  |  simple mistake → static
// cached → cache hit  |  complex → OpenAI (with DB limit)
// ============================================================
import { getCached, setCache } from "../utils/cache.js";
import { getAIExplanation, getStudyAdvice } from "./aiService.js";
import { User } from "../models/index.js";

const FREE_DAILY_LIMIT = 10;
const PRO_DAILY_LIMIT  = 100;

// Static explanations — zero cost
const STATIC = {
  calculation_error: "Your logic was right but the arithmetic went wrong. Redo the calculation step by step.",
  sign_error:        "You got a sign wrong. Always double-check signs when moving terms across the equals sign.",
  guessing:          "You answered too fast — this looks like a guess. Read the question fully before choosing.",
  partial_logic:     "You started correctly but missed a step. Break the problem into smaller pieces.",
  misinterpretation: "You misread the question. Read it twice before solving.",
};

const todayStr = () => new Date().toISOString().split("T")[0];

async function checkAndIncrementUsage(userId) {
  const user = await User.findById(userId).select("isPaid plan aiCallsToday aiCallsDate");
  if (!user) return false;

  const today = todayStr();
  if (user.aiCallsDate !== today) {
    user.aiCallsToday = 0;
    user.aiCallsDate  = today;
  }

  const limit = user.isPaid ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;
  if (user.aiCallsToday >= limit) return false;

  user.aiCallsToday += 1;
  await user.save();
  return true;
}

export const getUsageCount = async (userId) => {
  const user = await User.findById(userId).select("aiCallsToday aiCallsDate isPaid").lean();
  if (!user) return { used: 0, limit: FREE_DAILY_LIMIT };
  const today = todayStr();
  const used  = user.aiCallsDate === today ? (user.aiCallsToday || 0) : 0;
  const limit = user.isPaid ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;
  return { used, limit, remaining: limit - used };
};

// ── Main explanation router ────────────────────────────────
export const smartAIExplanation = async (userId, question, selectedType, correctAnswer, solutionSteps) => {
  if (selectedType === "correct") return null;

  // 1. Stored solution steps (zero cost)
  if (solutionSteps?.length > 0) {
    const prefix = STATIC[selectedType] ? `${STATIC[selectedType]}\n\n` : "";
    return `${prefix}Step-by-step:\n${solutionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
  }

  // 2. Static for simple errors (zero cost)
  if (STATIC[selectedType]) return STATIC[selectedType];

  // 3. Cache check (zero cost)
  const key = `ai:${question.slice(0, 60)}:${selectedType}`;
  const cached = getCached(key);
  if (cached) return cached;

  // 4. DB usage check + increment
  const allowed = await checkAndIncrementUsage(userId);
  if (!allowed) {
    return `You've reached your daily AI explanation limit (${FREE_DAILY_LIMIT}/day on the free plan). Upgrade to Pro for unlimited AI explanations.`;
  }

  // 5. Call OpenAI
  const result = await getAIExplanation(question, selectedType, correctAnswer).catch(() => null);
  if (result) setCache(key, result);
  return result;
};

// ── Study advice (cached per user) ────────────────────────
export const smartStudyAdvice = async (userId, profile) => {
  const key = `advice:${userId}:${(profile.accuracy || 0).toFixed(1)}`;
  const cached = getCached(key, 30 * 60 * 1000);
  if (cached) return cached;

  const allowed = await checkAndIncrementUsage(userId);
  if (!allowed) return "Focus on your weak areas and practice medium-difficulty questions daily.";

  const advice = await getStudyAdvice(profile).catch(() => null);
  if (advice) setCache(key, advice, 30 * 60 * 1000);
  return advice;
};
