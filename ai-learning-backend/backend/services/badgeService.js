// ============================================================
// BADGE SERVICE — awards achievements server-side
// Called after practice submit, exam submit, leaderboard update
// Unique index on {userId, badgeType} prevents double-awarding
// ============================================================
import { Badge, Streak, UserProfile } from "../models/index.js";
import logger from "../utils/logger.js";

const BADGE_LABELS = {
  streak_7:           "7-Day Streak",
  streak_30:          "30-Day Streak",
  streak_100:         "100-Day Streak",
  first_perfect_exam: "Perfect Exam",
  questions_100:      "100 Questions",
  questions_500:      "500 Questions",
  top10_leaderboard:  "Top 10 This Week",
};

const award = async (userId, badgeType, meta = {}) => {
  try {
    const result = await Badge.findOneAndUpdate(
      { userId, badgeType },
      { $setOnInsert: { userId, badgeType, meta, awardedAt: new Date() } },
      { upsert: true, new: true, rawResult: true }
    );
    // upserted means it's brand new
    return result.lastErrorObject?.updatedExisting === false ? badgeType : null;
  } catch (err) {
    if (err.code === 11000) return null; // already exists, fine
    logger.error("Badge award error", { err: err.message, userId, badgeType });
    return null;
  }
};

// context = { streak, totalAttempts, examScore, rank, topic, topicAccuracy, topicAttempts }
export const checkAndAwardBadges = async (userId, context = {}) => {
  const { streak = 0, totalAttempts = 0, examScore, rank, topic, topicAccuracy, topicAttempts } = context;
  const newBadges = [];

  const tasks = [];

  // Streak badges
  if (streak >= 7)   tasks.push(award(userId, "streak_7"));
  if (streak >= 30)  tasks.push(award(userId, "streak_30"));
  if (streak >= 100) tasks.push(award(userId, "streak_100"));

  // Question volume badges
  if (totalAttempts >= 100) tasks.push(award(userId, "questions_100"));
  if (totalAttempts >= 500) tasks.push(award(userId, "questions_500"));

  // Exam badges
  if (examScore === 100) tasks.push(award(userId, "first_perfect_exam"));

  // Leaderboard badge
  if (rank && rank <= 10) tasks.push(award(userId, "top10_leaderboard"));

  // Concept master — per topic, 90%+ accuracy with 20+ attempts
  if (topic && topicAccuracy >= 0.9 && topicAttempts >= 20) {
    tasks.push(award(userId, `concept_master_${topic}`, { topic }));
  }

  const results = await Promise.allSettled(tasks);
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value) newBadges.push(r.value);
  });

  return newBadges; // array of newly awarded badgeType strings
};

export const getUserBadges = async (userId) => {
  const badges = await Badge.find({ userId }).sort({ awardedAt: -1 }).lean();
  return badges.map((b) => ({
    ...b,
    label: BADGE_LABELS[b.badgeType] || b.badgeType.replace(/_/g, " "),
  }));
};
