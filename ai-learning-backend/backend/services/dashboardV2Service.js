import { User, UserProfile, Streak, Attempt, Badge } from "../models/index.js";
import { DailyCommitment, TaskSnooze, WidgetOrder } from "../models/dashboardV2Models.js";
import { LessonProgress } from "../models/lessonModel.js";

const today = () => new Date().toISOString().slice(0, 10);

// ── Mini 7-day streak strip ──────────────────────────────────────────
export async function getStreakStrip(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  const ats = await Attempt.aggregate([
    { $match: { userId, createdAt: { $gte: start } } },
    { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 },
    } },
  ]);
  const map = {};
  for (const r of ats) map[r._id] = r.count;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: ["S","M","T","W","T","F","S"][d.getDay()],
      count: map[key] || 0,
      isToday: i === 0,
    });
  }
  return days;
}

// ── Daily commitment ─────────────────────────────────────────────────
export async function getCommitment(userId) {
  const date = today();
  const doc = await DailyCommitment.findOne({ userId, date }).lean();
  if (!doc) return null;
  // refresh doneMinutes from today's attempts
  const since = new Date(); since.setHours(0, 0, 0, 0);
  const ats = await Attempt.find({ userId, createdAt: { $gte: since } }).select("timeTaken").lean();
  const doneMinutes = Math.round(ats.reduce((s, a) => s + (a.timeTaken || 0), 0) / 60);
  return { goalMinutes: doc.goalMinutes, doneMinutes, percent: Math.min(100, Math.round((doneMinutes / doc.goalMinutes) * 100)) };
}

export async function setCommitment(userId, goalMinutes) {
  const date = today();
  await DailyCommitment.findOneAndUpdate(
    { userId, date },
    { $set: { goalMinutes }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  return getCommitment(userId);
}

// ── Streak risk (hours until reset + status) ─────────────────────────
export async function getStreakRisk(userId) {
  const streak = await Streak.findOne({ userId }).lean();
  if (!streak || streak.currentStreak === 0) return null;
  const since = new Date(); since.setHours(0, 0, 0, 0);
  const todayCount = await Attempt.countDocuments({ userId, createdAt: { $gte: since } });
  if (todayCount > 0) return { safe: true, currentStreak: streak.currentStreak };
  const now = new Date();
  const endOfDay = new Date(now); endOfDay.setHours(23, 59, 59, 999);
  const hoursLeft = Math.max(0, Math.round((endOfDay - now) / 3_600_000));
  return {
    safe: false,
    currentStreak: streak.currentStreak,
    hoursLeft,
    longestStreak: streak.longestStreak,
  };
}

// ── Peer activity (anonymized) ───────────────────────────────────────
export async function getPeerActivity(userId) {
  const since = new Date(Date.now() - 30 * 60_000);
  // Distinct users who attempted anything in last 30 min
  const me = await User.findById(userId).select("grade schoolGroupId").lean();
  const filter = { createdAt: { $gte: since }, userId: { $ne: userId } };
  const recent = await Attempt.distinct("userId", filter);
  // Class-cohort accuracy (same grade peers, last 7 days)
  let classAvg = null;
  if (me?.grade) {
    const gradeUsers = await User.find({ grade: me.grade, _id: { $ne: userId } }).select("_id").lean().limit(500);
    if (gradeUsers.length) {
      const userIds = gradeUsers.map((u) => u._id.toString());
      const since7 = new Date(Date.now() - 7 * 86400000);
      const ats = await Attempt.find({ userId: { $in: userIds }, createdAt: { $gte: since7 } }).select("isCorrect").lean();
      if (ats.length) classAvg = Math.round((ats.filter((a) => a.isCorrect).length / ats.length) * 100);
    }
  }
  return {
    online: recent.length,
    classAvg,
  };
}

// ── Leaderboard rank widget ─────────────────────────────────────────
export async function getRankWidget(userId) {
  const myProfile = await UserProfile.findOne({ userId }).lean();
  if (!myProfile || (myProfile.totalAttempts || 0) < 5) return null;
  const peers = await UserProfile.find({ totalAttempts: { $gte: 5 } }).select("accuracy userId").lean().limit(1000);
  const sorted = peers.sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));
  const myRank = sorted.findIndex((p) => p.userId === userId) + 1;
  return {
    rank: myRank,
    total: sorted.length,
    percentile: myRank ? Math.round(((sorted.length - myRank) / sorted.length) * 100) : null,
  };
}

// ── Friend activity (from linked users) ─────────────────────────────
export async function getFriendActivity(userId) {
  const me = await User.findById(userId).select("linkedStudents").lean();
  const ids = (me?.linkedStudents || []).slice(0, 10);
  if (!ids.length) return [];
  // Last badge per friend
  const recent = await Badge.find({ userId: { $in: ids } }).sort({ awardedAt: -1 }).limit(5).lean();
  const users = await User.find({ _id: { $in: recent.map((b) => b.userId) } }).select("_id name").lean();
  const nameMap = {};
  for (const u of users) nameMap[u._id.toString()] = u.name;
  return recent.map((b) => ({
    name: nameMap[b.userId] || "A friend",
    badge: b.badgeType.replace(/_/g, " "),
    when: b.awardedAt,
  }));
}

// ── Recent micro-feed (last 3 sessions) ──────────────────────────────
export async function getRecentSessions(userId) {
  const ats = await Attempt.aggregate([
    { $match: { userId } },
    { $sort: { createdAt: -1 } },
    { $limit: 50 },
    { $group: {
      _id: { $dateToString: { format: "%Y-%m-%dT%H", date: "$createdAt" } },
      topic: { $first: "$topic" },
      count: { $sum: 1 },
      correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
      at: { $first: "$createdAt" },
    } },
    { $sort: { at: -1 } },
    { $limit: 3 },
  ]);
  return ats.map((a) => ({
    topic: a.topic,
    count: a.count,
    accuracy: a.count ? Math.round((a.correct / a.count) * 100) : 0,
    at: a.at,
  }));
}

// ── Next-badge preview ───────────────────────────────────────────────
export async function getNextBadgePreview(userId) {
  const earned = (await Badge.find({ userId }).select("badgeType").lean()).map((b) => b.badgeType);
  const set = new Set(earned);
  const streak = await Streak.findOne({ userId }).lean();
  const profile = await UserProfile.findOne({ userId }).lean();
  const candidates = [];
  if (streak?.currentStreak >= 4 && !set.has("streak_7"))   candidates.push({ type: "streak_7", label: "Streak Spark", current: streak.currentStreak, target: 7 });
  if (streak?.currentStreak >= 24 && !set.has("streak_30")) candidates.push({ type: "streak_30", label: "Streak Master", current: streak.currentStreak, target: 30 });
  const ta = profile?.totalAttempts || 0;
  if (ta >= 50 && !set.has("questions_100")) candidates.push({ type: "questions_100", label: "Deep Diver", current: ta, target: 100 });
  if (ta >= 250 && !set.has("questions_500")) candidates.push({ type: "questions_500", label: "500 Questions", current: ta, target: 500 });
  if (!candidates.length) return null;
  candidates.sort((a, b) => (b.current / b.target) - (a.current / a.target));
  const top = candidates[0];
  return { ...top, remaining: top.target - top.current };
}

// ── Tomorrow preview (uses StudyPlan if available) ───────────────────
export async function getTomorrowPreview(userId) {
  // Lightweight: surface top 3 weak-area topics as "tomorrow's likely focus"
  const profile = await UserProfile.findOne({ userId }).select("weakAreas").lean();
  if (!profile?.weakAreas?.length) return null;
  return { topics: profile.weakAreas.slice(0, 3) };
}

// ── Snooze ──────────────────────────────────────────────────────────
export async function snoozeTask(userId, taskId, reason) {
  const map = { later_today: 4, tomorrow: 24, this_week: 24 * 7, not_relevant: 24 * 30 };
  const hours = map[reason] || 4;
  const snoozedUntil = new Date(Date.now() + hours * 3_600_000);
  await TaskSnooze.create({ userId, taskId, reason, snoozedUntil });
  return { ok: true, until: snoozedUntil };
}

export async function listActiveSnoozes(userId) {
  return TaskSnooze.find({ userId, snoozedUntil: { $gt: new Date() } }).select("taskId reason snoozedUntil").lean();
}

// ── Widget order ────────────────────────────────────────────────────
export async function getWidgetOrder(userId) {
  return WidgetOrder.findOne({ userId }).lean();
}
export async function setWidgetOrder(userId, body) {
  return WidgetOrder.findOneAndUpdate(
    { userId },
    { $set: { ...body, updatedAt: new Date() } },
    { upsert: true, new: true }
  ).lean();
}

// ── Next-best-action — pick the highest-value 5-min task right now ──
export async function getNBA(userId) {
  const since = new Date(); since.setHours(0, 0, 0, 0);
  const todayCount = await Attempt.countDocuments({ userId, createdAt: { $gte: since } });
  const profile = await UserProfile.findOne({ userId }).lean();
  const streak = await Streak.findOne({ userId }).lean();
  if (!todayCount) {
    if (streak?.currentStreak > 0) return { icon: "🔥", label: `Practice 5 questions to keep your ${streak.currentStreak}-day streak alive` };
    return { icon: "✨", label: "Start with 5 quick warmup questions" };
  }
  if (profile?.weakAreas?.length) {
    return { icon: "🎯", label: `Drill ${profile.weakAreas[0]} for 10 min — your weakest spot` };
  }
  return { icon: "📌", label: "Review 3 bookmarks · ~5 min" };
}
