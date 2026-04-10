import { Attempt, UserProfile } from "../models/index.js";
import { smartStudyAdvice } from "../services/aiRouter.js";
import { getStreak } from "../services/streakService.js";

export const getReport = async (req, res) => {
  try {
    const userId  = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    const attempts = await Attempt.find({ userId }).sort({ createdAt: 1 });

    const accuracyHistory = buildAccuracyHistory(attempts);
    const topicStats = (profile?.topicProgress || []).map((t) => ({
      topic:    t.topic,
      accuracy: Math.round(t.accuracy * 100),
    }));
    const weakness = buildWeaknessMap(profile);

    // Cost-optimised AI advice (uses cache)
    const aiAdvice = profile ? await smartStudyAdvice(userId, profile).catch(() => null) : null;

    // Persistent streak from DB
    const { streak, longestStreak } = await getStreak(userId);

    res.json({
      score:           Math.round((profile?.accuracy || 0) * 100),
      thinkingProfile: profile?.thinkingProfile || "Surface Learner",
      totalAttempts:   profile?.totalAttempts   || 0,
      weakAreas:       profile?.weakAreas        || [],
      strongAreas:     profile?.strongAreas      || [],
      behaviorStats:   profile?.behaviorStats    || {},
      confidenceAccuracy: profile?.confidenceAccuracy || {},
      accuracyHistory,
      topicStats,
      weakness,
      aiAdvice,
      streak,
      longestStreak,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

function buildAccuracyHistory(attempts) {
  const grouped = {};
  attempts.forEach((a) => {
    const date = a.createdAt.toISOString().split("T")[0];
    if (!grouped[date]) grouped[date] = { correct: 0, total: 0 };
    grouped[date].total++;
    if (a.isCorrect) grouped[date].correct++;
  });
  return Object.entries(grouped).slice(-14).map(([date, v]) => ({
    date:     date.slice(5),
    accuracy: Math.round((v.correct / v.total) * 100),
  }));
}

function buildWeaknessMap(profile) {
  if (!profile) return [];
  const stats = profile.behaviorStats || {};
  const total = Object.values(stats).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(stats)
    .filter(([, v]) => v > 0)
    .map(([skill, count]) => ({
      skill: skill.replace(/_/g, " "),
      level: count / total > 0.4 ? "high" : count / total > 0.2 ? "medium" : "low",
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
