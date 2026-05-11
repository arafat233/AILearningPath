import { Attempt, User, UserProfile, Badge } from "../models/index.js";
import { MoodCheckin, ActiveSession, Certificate } from "../models/profileV2Models.js";
import { BookmarkReview } from "../models/bookmarkModels.js";
import { AppError } from "../utils/AppError.js";

// ── Activity heatmap (last 365 days) ──────────────────────────────────
export async function getActivityHeatmap(userId) {
  const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const attempts = await Attempt.aggregate([
    { $match: { userId, createdAt: { $gte: start } } },
    { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 },
    } },
  ]);
  const map = {};
  for (const row of attempts) map[row._id] = row.count;
  // produce a 53-week × 7-day grid
  const cells = [];
  for (let i = 365; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const count = map[key] || 0;
    cells.push({ date: key, count, weekday: d.getDay() });
  }
  return cells;
}

// ── Subject-by-subject performance ────────────────────────────────────
export async function getSubjectBreakdown(userId) {
  const attempts = await Attempt.aggregate([
    { $match: { userId } },
    { $lookup: {
      from: "questions",
      localField: "questionId",
      foreignField: "questionId",
      as: "q",
    } },
    { $unwind: { path: "$q", preserveNullAndEmptyArrays: true } },
    { $group: {
      _id: { $ifNull: ["$q.subject", "Math"] },
      total:   { $sum: 1 },
      correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
      avgTime: { $avg: "$timeTaken" },
    } },
    { $sort: { total: -1 } },
  ]);
  return attempts.map((a) => ({
    subject:  a._id || "Math",
    total:    a.total,
    correct:  a.correct,
    accuracy: a.total ? Math.round((a.correct / a.total) * 100) : 0,
    avgTime:  Math.round(a.avgTime || 0),
  }));
}

// ── Level / XP (aggregate from attempts + correct streak) ─────────────
export function computeLevel(totalAttempts, totalCorrect, badgeCount) {
  // 10 XP per correct, 2 XP per attempt, 50 XP per badge — tunable
  const xp = totalCorrect * 10 + totalAttempts * 2 + badgeCount * 50;
  // Level threshold: 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700 …
  let level = 1, threshold = 100, gain = 100;
  while (xp >= threshold) { level++; gain += 50; threshold += gain; }
  const prevThreshold = threshold - gain;
  return {
    level,
    xp,
    nextLevelXp: threshold,
    progress: Math.round(((xp - prevThreshold) / (threshold - prevThreshold)) * 100),
  };
}

export async function getLevelInfo(userId) {
  const [profile, badgeCount] = await Promise.all([
    UserProfile.findOne({ userId }).lean(),
    Badge.countDocuments({ userId }),
  ]);
  const totalAttempts = profile?.totalAttempts || 0;
  const totalCorrect  = Math.round(totalAttempts * (profile?.accuracy || 0));
  return computeLevel(totalAttempts, totalCorrect, badgeCount);
}

// ── Goal-progress diagnosis ──────────────────────────────────────────
export async function getGoalProgress(userId) {
  const user = await User.findById(userId).select("goal examDate").lean();
  if (!user) throw new AppError("User not found", 404);
  const profile = await UserProfile.findOne({ userId }).lean();
  const goalTarget = { pass: 33, distinction: 75, top: 90, scholarship: 95 }[user.goal] || 50;
  const currentAccuracy = Math.round((profile?.accuracy || 0) * 100);
  const gap = goalTarget - currentAccuracy;
  let status = "on_track";
  if (gap > 15)      status = "off_track";
  else if (gap > 5)  status = "behind";
  else               status = "on_track";
  // Estimated practice hours to close — assume ~3% accuracy gain per 10 hrs of focused practice
  const hoursToClose = gap > 0 ? Math.ceil((gap / 3) * 10) : 0;
  return {
    goal: user.goal,
    goalTarget,
    currentAccuracy,
    gap,
    status,
    hoursToClose,
    examDate: user.examDate,
  };
}

// ── Recent activity feed ─────────────────────────────────────────────
export async function getRecentActivity(userId, days = 7) {
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const attempts = await Attempt.aggregate([
    { $match: { userId, createdAt: { $gte: start } } },
    { $group: {
      _id: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        topic: "$topic",
      },
      count:   { $sum: 1 },
      correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
    } },
    { $sort: { "_id.date": -1 } },
    { $limit: 30 },
  ]);
  return attempts.map((a) => ({
    date: a._id.date,
    topic: a._id.topic,
    count: a.count,
    correct: a.correct,
    accuracy: a.count ? Math.round((a.correct / a.count) * 100) : 0,
  }));
}

// ── Next badge (closest unearned) ─────────────────────────────────────
export async function getNextBadge(userId) {
  const earned = (await Badge.find({ userId }).select("badgeType").lean()).map((b) => b.badgeType);
  const earnedSet = new Set(earned);
  const profile = await UserProfile.findOne({ userId }).lean();
  const totalAttempts = profile?.totalAttempts || 0;
  // Streak: best progress is current/longest from Streak model — but skip for now
  const candidates = [
    { type: "questions_100", label: "Deep Diver",  current: totalAttempts, target: 100 },
    { type: "questions_500", label: "500 Questions", current: totalAttempts, target: 500 },
    { type: "questions_1000", label: "1000 Questions", current: totalAttempts, target: 1000 },
  ].filter((c) => !earnedSet.has(c.type) && c.current < c.target);
  if (!candidates.length) return null;
  candidates.sort((a, b) => (b.current / b.target) - (a.current / a.target));
  return { ...candidates[0], remaining: candidates[0].target - candidates[0].current };
}

// ── Best learning window ─────────────────────────────────────────────
export async function getBestLearningWindow(userId) {
  const attempts = await Attempt.aggregate([
    { $match: { userId } },
    { $project: {
      hour: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } },
      isCorrect: 1,
    } },
    { $group: {
      _id: "$hour",
      count: { $sum: 1 },
      correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
    } },
  ]);
  if (!attempts.length || attempts.every((a) => a.count < 3)) return null;
  const buckets = attempts.map((a) => ({
    hour: a._id,
    accuracy: a.count >= 3 ? a.correct / a.count : 0,
    count: a.count,
  }));
  const best = buckets.reduce((b, a) => (a.accuracy > b.accuracy && a.count >= 3 ? a : b), buckets[0]);
  const overall = attempts.reduce((s, a) => s + a.correct, 0) / attempts.reduce((s, a) => s + a.count, 0);
  const lift = Math.round((best.accuracy - overall) * 100);
  return {
    bestHour: best.hour,
    bestAccuracy: Math.round(best.accuracy * 100),
    overallAccuracy: Math.round(overall * 100),
    lift,
  };
}

// ── Mood check-in ─────────────────────────────────────────────────────
export async function upsertMood(userId, mood, note = "") {
  const date = new Date().toISOString().slice(0, 10);
  return MoodCheckin.findOneAndUpdate(
    { userId, date },
    { $set: { mood, note: (note || "").slice(0, 200) }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true, new: true }
  ).lean();
}

export async function getMoodHistory(userId, days = 14) {
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await MoodCheckin.find({ userId, createdAt: { $gte: start } }).sort({ date: 1 }).lean();
  return rows.map((r) => ({ date: r.date, mood: r.mood, note: r.note }));
}

// ── Active sessions ──────────────────────────────────────────────────
export async function getActiveSessions(userId) {
  const rows = await ActiveSession.find({ userId }).sort({ lastSeenAt: -1 }).limit(10).lean();
  return rows.map((r) => ({
    id: String(r._id),
    device: r.device || parseDevice(r.ua),
    ua: r.ua,
    lastSeenAt: r.lastSeenAt,
    current: false,
  }));
}

export async function revokeSession(userId, sessionId) {
  await ActiveSession.deleteOne({ _id: sessionId, userId });
  return true;
}

function parseDevice(ua) {
  if (!ua) return "Unknown";
  if (/Windows/i.test(ua))  return "Windows";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Android/i.test(ua))   return "Android";
  if (/iPhone|iPad/i.test(ua)) return "iOS";
  return "Browser";
}

// ── Public profile ───────────────────────────────────────────────────
export async function getPublicProfile(slug) {
  const u = await User.findOne({ publicSlug: slug, publicProfileEnabled: true })
    .select("name avatarDataUrl manifesto grade subject createdAt").lean();
  if (!u) throw new AppError("Profile not found", 404);
  const [profile, badges] = await Promise.all([
    UserProfile.findOne({ userId: u._id.toString() }).select("accuracy totalAttempts thinkingProfile").lean(),
    Badge.find({ userId: u._id.toString() }).select("badgeType awardedAt").lean(),
  ]);
  const level = await getLevelInfo(u._id.toString());
  return {
    name: u.name,
    avatarDataUrl: u.avatarDataUrl,
    manifesto: u.manifesto,
    grade: u.grade,
    subject: u.subject,
    joinedAt: u.createdAt,
    accuracy: Math.round((profile?.accuracy || 0) * 100),
    totalAttempts: profile?.totalAttempts || 0,
    thinkingProfile: profile?.thinkingProfile,
    level: level.level,
    badgeCount: badges.length,
    badges: badges.slice(0, 12).map((b) => ({ type: b.badgeType, awardedAt: b.awardedAt })),
  };
}

export async function setPublicProfile(userId, { enabled, slug, manifesto }) {
  const update = {};
  if (enabled !== undefined) update.publicProfileEnabled = !!enabled;
  if (manifesto !== undefined) update.manifesto = (manifesto || "").slice(0, 200);
  if (slug !== undefined) {
    const cleaned = (slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 40);
    if (cleaned) {
      const taken = await User.findOne({ publicSlug: cleaned, _id: { $ne: userId } }).select("_id").lean();
      if (taken) throw new AppError("Slug already taken", 409);
      update.publicSlug = cleaned;
    }
  }
  await User.findByIdAndUpdate(userId, { $set: update });
  return User.findById(userId).select("publicProfileEnabled publicSlug manifesto").lean();
}

// ── Classmate compare ────────────────────────────────────────────────
export async function getClassmateCompare(userId) {
  const me = await User.findById(userId).select("schoolGroupId grade").lean();
  if (!me) throw new AppError("User not found", 404);
  const profile = await UserProfile.findOne({ userId }).lean();
  const myAcc = profile?.accuracy || 0;
  // Compare against same grade
  const peerProfiles = await UserProfile.aggregate([
    { $match: { userId: { $ne: userId } } },
    { $project: { accuracy: 1, totalAttempts: 1 } },
    { $match: { totalAttempts: { $gte: 5 } } },
    { $limit: 1000 },
  ]);
  if (!peerProfiles.length) return { rank: null, total: 0 };
  const better = peerProfiles.filter((p) => p.accuracy < myAcc).length;
  const total = peerProfiles.length + 1;
  const percentile = Math.round((better / total) * 100);
  return { percentile, peerCount: peerProfiles.length, myAccuracy: Math.round(myAcc * 100) };
}

// ── Certificates ─────────────────────────────────────────────────────
export async function listCertificates(userId) {
  return Certificate.find({ userId }).sort({ awardedAt: -1 }).lean();
}

// ── Achievement timeline (badges with dates) ─────────────────────────
export async function getAchievementTimeline(userId) {
  const badges = await Badge.find({ userId }).sort({ awardedAt: -1 }).lean();
  return badges.map((b) => ({ type: b.badgeType, awardedAt: b.awardedAt, meta: b.meta }));
}

// ── Settings updates ─────────────────────────────────────────────────
export async function updateSettings(userId, body) {
  const allow = ["avatarDataUrl", "manifesto", "locale", "timezone", "theme", "density", "notifPrefs", "twoFactorEnabled"];
  const update = {};
  for (const k of allow) if (body[k] !== undefined) update[k] = body[k];
  if (update.avatarDataUrl && update.avatarDataUrl.length > 100 * 1024) {
    throw new AppError("Avatar too large (max 100KB)", 422);
  }
  await User.findByIdAndUpdate(userId, { $set: update });
  return User.findById(userId).select("avatarDataUrl manifesto locale timezone theme density notifPrefs twoFactorEnabled").lean();
}

export async function updateParentVisibility(userId, parentId, visibility) {
  const path = `parentVisibility.${parentId}`;
  await User.findByIdAndUpdate(userId, { $set: { [path]: visibility } });
  return true;
}

// ── Data export (GDPR) ──────────────────────────────────────────────
export async function exportUserData(userId) {
  const [user, profile, attempts, badges, bookmarks] = await Promise.all([
    User.findById(userId).select("-password -passwordResetToken -pwdChangedAt").lean(),
    UserProfile.findOne({ userId }).lean(),
    Attempt.find({ userId }).limit(5000).lean(),
    Badge.find({ userId }).lean(),
    BookmarkReview.find({ userId }).lean(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    user, profile, attempts, badges, bookmarks,
  };
}
