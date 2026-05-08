// Persistent streak — stored in DB, survives server restarts
import { Streak, Attempt } from "../models/index.js";

// Returns ISO week string like "2026-W19" for a given date
const isoWeek = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  dt.setDate(dt.getDate() + 3 - (dt.getDay() + 6) % 7);
  const week1 = new Date(dt.getFullYear(), 0, 4);
  return dt.getFullYear() + "-W" + String(1 + Math.round(((dt - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)).padStart(2, "0");
};

export const updateStreak = async (userId) => {
  const today     = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 864e5).toISOString().split("T")[0];
  const currentWeek = isoWeek(new Date());

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
  } else if (streak.lastActiveDate === twoDaysAgo) {
    // Missed exactly 1 day — check grace period
    if (streak.graceUsedWeek !== currentWeek) {
      // Grace available: extend streak without breaking it, mark grace used
      streak.currentStreak += 1;
      streak.graceUsedWeek = currentWeek;
    } else {
      // Grace already used this week — break streak
      streak.currentStreak = 1;
    }
  } else {
    // Missed 2+ days — break streak normally
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

export const getStreakStatus = async (userId) => {
  const s = await Streak.findOne({ userId });
  if (!s) return { streak: 0, longestStreak: 0, graceAvailable: true, graceUsedWeek: "" };
  const currentWeek = isoWeek(new Date());
  return {
    streak:        s.currentStreak,
    longestStreak: s.longestStreak,
    graceAvailable: s.graceUsedWeek !== currentWeek,
    graceUsedWeek:  s.graceUsedWeek,
  };
};
