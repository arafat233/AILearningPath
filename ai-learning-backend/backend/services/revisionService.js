import { UserProfile } from "../models/index.js";

const INTERVALS = [1, 3, 7, 15, 30];

export const getRevisionTopics = async (userId) => {
  const profile = await UserProfile.findOne({ userId });
  if (!profile?.topicProgress?.length) return [];

  const now = new Date();
  const due = [];

  for (const tp of profile.topicProgress) {
    if (!tp.lastAttempted) continue;
    const daysSince = Math.floor((now - new Date(tp.lastAttempted)) / (1000 * 60 * 60 * 24));
    const stageIndex = Math.min((tp.attempts || 1) - 1, INTERVALS.length - 1);
    const nextInterval = INTERVALS[stageIndex];
    if (daysSince >= nextInterval) {
      due.push({ topic: tp.topic, accuracy: Math.round(tp.accuracy * 100), daysSince, nextInterval, priority: daysSince / nextInterval });
    }
  }

  return due.sort((a, b) => b.priority - a.priority);
};

export const markRevised = async (userId, topic) => {
  await UserProfile.findOneAndUpdate(
    { userId, "topicProgress.topic": topic },
    { $set: { "topicProgress.$.lastAttempted": new Date() } }
  );
};
