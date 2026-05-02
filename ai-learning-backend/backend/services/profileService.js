import { Attempt, UserProfile } from "../models/index.js";
import { classifyThinkingProfile } from "./analysisService.js";

const PROFILE_WINDOW = 500; // use the most recent 500 attempts for profile computation

export const updateUserProfile = async (userId) => {
  const attempts = await Attempt.find({ userId })
    .sort({ createdAt: -1 })
    .limit(PROFILE_WINDOW)
    .select("isCorrect timeTaken selectedType confidence topic")
    .lean();
  if (!attempts.length) return;

  const total = attempts.length;
  const correct = attempts.filter((a) => a.isCorrect).length;
  const accuracy = correct / total;
  const avgTime = attempts.reduce((s, a) => s + (a.timeTaken || 0), 0) / total;

  // Behavior frequency
  const behaviorStats = {};
  attempts.forEach((a) => {
    if (a.selectedType) {
      behaviorStats[a.selectedType] = (behaviorStats[a.selectedType] || 0) + 1;
    }
  });

  // Confidence analysis
  const highConfidenceWrong = attempts.filter(
    (a) => a.confidence === "high" && !a.isCorrect
  ).length;
  const lowConfidenceRight = attempts.filter(
    (a) => a.confidence === "low" && a.isCorrect
  ).length;

  // Topic breakdown
  const topicMap = {};
  attempts.forEach((a) => {
    if (!a.topic) return;
    if (!topicMap[a.topic]) topicMap[a.topic] = { correct: 0, total: 0 };
    topicMap[a.topic].total++;
    if (a.isCorrect) topicMap[a.topic].correct++;
  });

  const topicProgress = Object.entries(topicMap).map(([topic, stats]) => ({
    topic,
    accuracy: stats.correct / stats.total,
    attempts: stats.total,
    lastAttempted: new Date(),
  }));

  const weakAreas = topicProgress
    .filter((t) => t.accuracy < 0.5)
    .map((t) => t.topic);
  const strongAreas = topicProgress
    .filter((t) => t.accuracy >= 0.75)
    .map((t) => t.topic);

  const thinkingProfile = classifyThinkingProfile(behaviorStats, accuracy);

  // Difficulty level per topic (1=basic, 2=application, 3=tricky, 4=exam-level)
  const difficultyLevels = {};
  for (const tp of topicProgress) {
    if      (tp.accuracy >= 0.85) difficultyLevels[tp.topic] = 4;
    else if (tp.accuracy >= 0.70) difficultyLevels[tp.topic] = 3;
    else if (tp.accuracy >= 0.50) difficultyLevels[tp.topic] = 2;
    else                           difficultyLevels[tp.topic] = 1;
  }

  await UserProfile.findOneAndUpdate(
    { userId },
    {
      accuracy,
      avgTime,
      totalAttempts: total,
      thinkingProfile,
      weakAreas,
      strongAreas,
      behaviorStats,
      confidenceAccuracy: { highConfidenceWrong, lowConfidenceRight },
      topicProgress,
      difficultyLevels,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );
};
