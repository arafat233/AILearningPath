// Persistent streak — stored in DB, survives server restarts
import { Streak, Attempt } from "../models/index.js";

export const updateStreak = async (userId) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];

  let streak = await Streak.findOne({ userId });

  if (!streak) {
    streak = new Streak({ userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today });
    await streak.save();
    return { streak: 1, longestStreak: 1, isNew: true };
  }

  if (streak.lastActiveDate === today) {
    // Already counted today
    return { streak: streak.currentStreak, longestStreak: streak.longestStreak };
  }

  if (streak.lastActiveDate === yesterday) {
    // Consecutive day — extend
    streak.currentStreak += 1;
  } else {
    // Broke the streak
    streak.currentStreak = 1;
  }

  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastActiveDate = today;
  streak.updatedAt = new Date();
  await streak.save();

  return { streak: streak.currentStreak, longestStreak: streak.longestStreak };
};

export const getStreak = async (userId) => {
  const s = await Streak.findOne({ userId });
  if (!s) return { streak: 0, longestStreak: 0 };
  return { streak: s.currentStreak, longestStreak: s.longestStreak };
};
