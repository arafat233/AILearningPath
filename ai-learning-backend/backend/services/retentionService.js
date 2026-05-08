import mongoose from "mongoose";
import { User, Attempt, AICallLog } from "../models/index.js";

const REAL_USERS = { email: { $not: /stellar\.child$/ } };

// ─── Cohort retention ────────────────────────────────────────────────────────
// For users who signed up at least `dayAfterSignup` days ago (sampled over a
// 30-day signup window), what fraction had ≥1 practice Attempt on day N?

async function computeRetentionRate(dayAfterSignup) {
  const now         = new Date();
  // Cohort window: users who signed up between [now-day-30d, now-day]
  // so every user in the cohort has had at least dayAfterSignup days to return
  const cohortEnd   = new Date(now.getTime() - dayAfterSignup * 86_400_000);
  const cohortStart = new Date(cohortEnd.getTime() - 30 * 86_400_000);

  const cohort = await User.find({
    ...REAL_USERS,
    createdAt: { $gte: cohortStart, $lt: cohortEnd },
  }).select("_id createdAt").lean();

  if (!cohort.length) return { cohortSize: 0, retained: 0, rate: 0 };

  const userIds = cohort.map((u) => u._id.toString());

  // Fetch all attempts by these users in a broad window around the target day
  const attemptWindowStart = cohortStart;
  const attemptWindowEnd   = new Date(cohortEnd.getTime() + (dayAfterSignup + 2) * 86_400_000);

  const attempts = await Attempt.find({
    userId:    { $in: userIds },
    createdAt: { $gte: attemptWindowStart, $lte: attemptWindowEnd },
  }).select("userId createdAt").lean();

  // Group by userId for O(1) lookup
  const attemptsByUser = new Map();
  for (const a of attempts) {
    if (!attemptsByUser.has(a.userId)) attemptsByUser.set(a.userId, []);
    attemptsByUser.get(a.userId).push(a.createdAt);
  }

  // Retention window: [signup + day - 12h, signup + day + 36h]  (generous window)
  let retained = 0;
  for (const user of cohort) {
    const winStart = new Date(user.createdAt.getTime() + (dayAfterSignup - 0.5) * 86_400_000);
    const winEnd   = new Date(user.createdAt.getTime() + (dayAfterSignup + 1.5) * 86_400_000);
    const list     = attemptsByUser.get(user._id.toString()) || [];
    if (list.some((a) => a >= winStart && a <= winEnd)) retained++;
  }

  return {
    cohortSize: cohort.length,
    retained,
    rate: parseFloat(((retained / cohort.length) * 100).toFixed(1)),
  };
}

// ─── Conversion funnel ────────────────────────────────────────────────────────
// For real users who signed up in the last 30 days, measure each funnel step.

export async function getConversionFunnel() {
  const d30 = new Date(Date.now() - 30 * 86_400_000);

  const signups = await User.find({
    ...REAL_USERS,
    createdAt: { $gte: d30 },
  }).select("_id isPaid").lean();

  if (!signups.length) {
    return { signups: 0, activated: 0, aiEngaged: 0, converted: 0,
             activationRate: 0, aiEngagementRate: 0, conversionRate: 0 };
  }

  const signupIds = signups.map((u) => u._id.toString());

  // Step 2 — Activated: made ≥1 practice attempt
  const activatedIds = await Attempt.distinct("userId", {
    userId:    { $in: signupIds },
    createdAt: { $gte: d30 },
  });

  // Step 3 — AI engaged: received ≥1 AI explanation
  const aiEngagedIds = await AICallLog.distinct("userId", {
    userId:    { $in: activatedIds },
    aiType:    "explanation",
    createdAt: { $gte: d30 },
  });

  // Step 4 — Converted: paid plan
  const converted = signups.filter((u) => u.isPaid).length;

  const total = signups.length;
  return {
    signups:          total,
    activated:        activatedIds.length,
    aiEngaged:        aiEngagedIds.length,
    converted,
    activationRate:   total > 0 ? parseFloat(((activatedIds.length  / total)               * 100).toFixed(1)) : 0,
    aiEngagementRate: activatedIds.length > 0
      ? parseFloat(((aiEngagedIds.length / activatedIds.length) * 100).toFixed(1)) : 0,
    conversionRate:   total > 0 ? parseFloat(((converted           / total)               * 100).toFixed(1)) : 0,
  };
}

// ─── Top practiced topics (last 30 days) ─────────────────────────────────────

export async function getTopTopics() {
  const d30 = new Date(Date.now() - 30 * 86_400_000);
  return Attempt.aggregate([
    { $match: { createdAt: { $gte: d30 } } },
    { $group: {
      _id:      "$topic",
      attempts: { $sum: 1 },
      correct:  { $sum: { $cond: ["$isCorrect", 1, 0] } },
    }},
    { $sort: { attempts: -1 } },
    { $limit: 10 },
    { $project: {
      _id:      0,
      topic:    "$_id",
      attempts: 1,
      accuracy: { $round: [{ $multiply: [{ $divide: ["$correct", "$attempts"] }, 100] }, 1] },
    }},
  ]);
}

// ─── AI tutor effectiveness — retry rate ─────────────────────────────────────
// Among students who got an AI explanation on topic X, what fraction practiced
// topic X again within the next 24 hours?

export async function getAIRetryRate() {
  const d30    = new Date(Date.now() - 30 * 86_400_000);
  const events = await (await import("../models/index.js")).AnalyticsEvent
    .find({ event: "explanation_shown", createdAt: { $gte: d30 } })
    .select("userId topicId createdAt")
    .lean();

  if (!events.length) return { explanations: 0, retried: 0, rate: 0 };

  let retried = 0;
  for (const ev of events) {
    const within24h = new Date(ev.createdAt.getTime() + 24 * 3600_000);
    const retryAttempt = await Attempt.exists({
      userId:    ev.userId,
      topic:     ev.topicId,
      createdAt: { $gt: ev.createdAt, $lte: within24h },
    });
    if (retryAttempt) retried++;
  }

  return {
    explanations: events.length,
    retried,
    rate: parseFloat(((retried / events.length) * 100).toFixed(1)),
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function getRetentionMetrics() {
  const [d1, d7, d30, funnel, topTopics, aiRetry] = await Promise.all([
    computeRetentionRate(1),
    computeRetentionRate(7),
    computeRetentionRate(30),
    getConversionFunnel(),
    getTopTopics(),
    getAIRetryRate(),
  ]);

  return { retention: { d1, d7, d30 }, funnel, topTopics, aiRetry };
}
