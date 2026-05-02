import { UserProfile } from "../models/index.js";

const INTERVALS = [1, 3, 7, 15, 30]; // days between revisions

export const getRevisionTopics = async (userId) => {
  const profile = await UserProfile.findOne({ userId });
  if (!profile?.topicProgress?.length) return [];

  const now = new Date();
  const due = [];

  for (const tp of profile.topicProgress) {
    if (!tp.lastAttempted) continue;

    // Use persisted nextRevision if available, otherwise fall back to legacy logic
    if (tp.nextRevision) {
      if (now >= new Date(tp.nextRevision)) {
        const daysSince = Math.floor((now - new Date(tp.lastAttempted)) / (1000 * 60 * 60 * 24));
        due.push({
          topic: tp.topic,
          accuracy: Math.round((tp.accuracy || 0) * 100),
          daysSince,
          nextInterval: INTERVALS[tp.revisionStage ?? 0],
          revisionStage: tp.revisionStage ?? 0,
          priority: daysSince / Math.max(1, INTERVALS[tp.revisionStage ?? 0]),
        });
      }
    } else {
      // Legacy fallback for topics without nextRevision yet
      const daysSince = Math.floor((now - new Date(tp.lastAttempted)) / (1000 * 60 * 60 * 24));
      const stageIndex = Math.min((tp.attempts || 1) - 1, INTERVALS.length - 1);
      const nextInterval = INTERVALS[stageIndex];
      if (daysSince >= nextInterval) {
        due.push({
          topic: tp.topic,
          accuracy: Math.round((tp.accuracy || 0) * 100),
          daysSince,
          nextInterval,
          revisionStage: stageIndex,
          priority: daysSince / nextInterval,
        });
      }
    }
  }

  return due.sort((a, b) => b.priority - a.priority);
};

// Accuracy threshold: below 50% the student hasn't mastered this topic yet — demote.
const MASTERY_THRESHOLD = 0.5;

export const markRevised = async (userId, topic, accuracy = null) => {
  const profile = await UserProfile.findOne({ userId });
  const tp = profile?.topicProgress?.find((t) => t.topic === topic);
  const currentStage = tp?.revisionStage ?? 0;

  // Promote if accuracy meets threshold (or unknown); demote one stage if struggling
  const topicAccuracy = accuracy ?? tp?.accuracy ?? 1;
  let nextStage;
  if (topicAccuracy >= MASTERY_THRESHOLD) {
    nextStage = Math.min(currentStage + 1, INTERVALS.length - 1);
  } else {
    nextStage = Math.max(currentStage - 1, 0); // demote — revisit sooner
  }

  const nextRevision = new Date(Date.now() + INTERVALS[nextStage] * 864e5);

  await UserProfile.findOneAndUpdate(
    { userId, "topicProgress.topic": topic },
    {
      $set: {
        "topicProgress.$.lastAttempted": new Date(),
        "topicProgress.$.nextRevision":  nextRevision,
        "topicProgress.$.revisionStage": nextStage,
      },
    }
  );

  return { nextRevision, nextStage, nextInterval: INTERVALS[nextStage] };
};
