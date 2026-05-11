import { User, SchoolGroup, Attempt, Streak, UserProfile } from "../models/index.js";
import { ClassChallenge, TeacherPost, Kudos, SubjectFocus, ClassPreference, ClassReport, isoWeekKey } from "../models/schoolGroupV2Models.js";
import { AppError } from "../utils/AppError.js";

const initials = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

// ── One-shot class dashboard ──────────────────────────────────────
export async function getClassDashboard(userId) {
  const me = await User.findById(userId).select("name grade schoolGroupId").lean();
  if (!me?.schoolGroupId) {
    return { hasGroup: false };
  }
  const group = await SchoolGroup.findById(me.schoolGroupId).lean();
  if (!group) return { hasGroup: false };

  // All classmates including me
  const classmateIds = (group.enrolledStudentIds || []).map(String);
  const classmates = await User.find({ _id: { $in: classmateIds } })
    .select("_id name grade").lean();

  // Per-classmate stats for this week
  const sinceWeek = new Date(Date.now() - 7 * 86400000);
  const sinceMonth = new Date(Date.now() - 30 * 86400000);
  const sinceTerm  = new Date(Date.now() - 90 * 86400000);

  const [allAttemptsWeek, profiles, streaks, prefs] = await Promise.all([
    Attempt.find({ userId: { $in: classmateIds }, createdAt: { $gte: sinceTerm } })
      .select("userId isCorrect timeTaken createdAt").lean(),
    UserProfile.find({ userId: { $in: classmateIds } })
      .select("userId accuracy totalAttempts").lean(),
    Streak.find({ userId: { $in: classmateIds } })
      .select("userId currentStreak").lean(),
    ClassPreference.find({ userId: { $in: classmateIds } }).lean(),
  ]);

  const profileMap = {}; for (const p of profiles) profileMap[p.userId] = p;
  const streakMap  = {}; for (const s of streaks)  streakMap[s.userId]  = s;
  const prefMap    = {}; for (const p of prefs)    prefMap[p.userId]    = p;

  // Build leaderboard rows for week/month/term
  function buildRows(since, label) {
    return classmates.map((c) => {
      const id = String(c._id);
      const pref = prefMap[id] || {};
      const isMe = id === userId;
      const my = allAttemptsWeek.filter((a) => a.userId === id && new Date(a.createdAt) >= since);
      const score = my.length * 10 + my.filter((a) => a.isCorrect).length * 30 + (streakMap[id]?.currentStreak || 0) * 50;
      const correctThisWk = my.filter((a) => a.isCorrect).length;
      const pointsGained  = correctThisWk * 10 + (my.length - correctThisWk) * 2;
      return {
        userId:        id,
        name:          (pref.anonymousMode && !isMe) ? "Anonymous" : c.name,
        initials:      (pref.anonymousMode && !isMe) ? "AN" : initials(c.name),
        streak:        streakMap[id]?.currentStreak || 0,
        pointsGained,
        totalScore:    score,
        isMe,
        hideRank:      pref.hideRank && !isMe,
      };
    }).filter((r) => !r.hideRank);
  }

  const weekRows = buildRows(sinceWeek, "week")
    .map((r) => ({ ...r, totalScore: r.totalScore || 4000 })) // placeholder for empty
    .sort((a, b) => b.totalScore - a.totalScore);

  // Rank deltas vs last week — simple heuristic: random for now (real prod needs snapshot)
  weekRows.forEach((r, i) => { r.rank = i + 1; });

  const myRow = weekRows.find((r) => r.isMe);
  const myRank = myRow?.rank || null;

  // Active class challenge
  const challenge = await ClassChallenge.findOne({
    schoolGroupId: String(me.schoolGroupId), isActive: true, deadline: { $gt: new Date() },
  }).sort({ createdAt: -1 }).lean();
  let myContribution = 0;
  if (challenge) {
    const c = challenge.contributors?.find((x) => x.userId === userId);
    myContribution = c?.count || 0;
  }

  // Latest teacher post
  const teacherPost = await TeacherPost.findOne({ schoolGroupId: String(me.schoolGroupId) })
    .sort({ createdAt: -1 }).lean();

  // Studying now — heuristic: attempts in last 15 min
  const since15 = new Date(Date.now() - 15 * 60_000);
  const recentStudyIds = new Set(allAttemptsWeek.filter((a) => new Date(a.createdAt) >= since15).map((a) => a.userId));

  // Subject focus this week
  const focus = await SubjectFocus.findOne({ schoolGroupId: String(me.schoolGroupId), weekKey: isoWeekKey() }).lean();

  // Group questions today (all classmates combined)
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const todayQs = allAttemptsWeek.filter((a) => new Date(a.createdAt) >= startOfDay).length;

  // Kudos received this week
  const myKudos = await Kudos.find({ toId: userId, createdAt: { $gte: sinceWeek } }).lean();

  // Avatar cluster — 6 random classmates including me center
  const cluster = [];
  const others = classmates.filter((c) => String(c._id) !== userId).sort(() => Math.random() - 0.5).slice(0, 5);
  for (const o of others) {
    const id = String(o._id);
    cluster.push({ userId: id, name: o.name, initials: initials(o.name), studying: recentStudyIds.has(id), color: hashColor(id) });
  }

  return {
    hasGroup: true,
    school: {
      groupId:   String(me.schoolGroupId),
      name:      group.schoolName,
      classCode: `${me.grade || "10"}-${(group.schoolName?.[0] || "A")}`, // e.g. X-B (heuristic)
      classmateCount: classmateIds.length - 1, // excluding self
    },
    stats: {
      myRank,
      groupQuestionsToday: todayQs,
      myGainThisWeek: myRow?.pointsGained || 0,
    },
    leaderboard: { week: weekRows.slice(0, 12) },
    challenge: challenge ? {
      _id:           String(challenge._id),
      title:         challenge.title,
      rewardText:    challenge.rewardText,
      targetCount:   challenge.targetCount,
      currentCount:  challenge.currentCount,
      myContribution,
      deadline:      challenge.deadline,
      daysLeft:      Math.max(0, Math.ceil((new Date(challenge.deadline) - new Date()) / 86400000)),
    } : null,
    teacherPost: teacherPost ? {
      _id:         String(teacherPost._id),
      teacherName: teacherPost.teacherName,
      teacherRole: teacherPost.teacherRole,
      message:     teacherPost.message,
      at:          teacherPost.createdAt,
      readCount:   teacherPost.readBy?.length || 0,
      reactions:   Object.fromEntries((teacherPost.reactions || new Map()).entries?.() || []),
      myReaction:  null,
      commentCount: teacherPost.comments?.length || 0,
    } : null,
    cluster,
    subjectFocus: focus,
    inviteLink: `https://stellaredu.in/c/${(me.grade || "10").toLowerCase()}-${(group.schoolName?.[0] || "a").toLowerCase()}/${(me.name || "you").split(" ")[0].toLowerCase()}`,
    kudosReceivedThisWeek: myKudos.length,
  };
}

function hashColor(id) {
  const colors = ["#7c3aed","#f472b6","#fb923c","#34c759","#06b6d4","#a78bfa","#facc15"];
  let h = 0; for (const c of id) h = (h + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

// ── Kudos send ────────────────────────────────────────────────────
export async function sendKudos(fromId, toId, schoolGroupId, emoji, message) {
  if (fromId === toId) throw new AppError("Cannot send kudos to yourself", 422);
  // Check classmate
  const fromUser = await User.findById(fromId).select("schoolGroupId").lean();
  if (String(fromUser?.schoolGroupId) !== String(schoolGroupId)) throw new AppError("Not in this group", 403);
  await Kudos.create({ fromId, toId, schoolGroupId, emoji: emoji || "👏", message: (message || "").slice(0, 120) });
  return { ok: true };
}

// ── Challenge create (teacher) ────────────────────────────────────
export async function createChallenge(creatorId, schoolGroupId, body) {
  // For MVP — any user in the group can create; in prod restrict by role
  await ClassChallenge.updateMany({ schoolGroupId: String(schoolGroupId), isActive: true }, { $set: { isActive: false } });
  return ClassChallenge.create({
    schoolGroupId: String(schoolGroupId),
    title:         body.title,
    description:   body.description || "",
    targetCount:   body.targetCount,
    metric:        body.metric || "questions",
    subjectFocus:  body.subjectFocus || null,
    rewardText:    body.rewardText || "",
    createdBy:     creatorId,
    deadline:      body.deadline,
    contributors:  [],
    isActive:      true,
  });
}

// ── Challenge contribute (called when student solves a Q matching subject) ──
export async function contributeToChallenge(userId, schoolGroupId, count = 1) {
  const challenge = await ClassChallenge.findOne({ schoolGroupId: String(schoolGroupId), isActive: true, deadline: { $gt: new Date() } });
  if (!challenge) return null;
  const me = await User.findById(userId).select("name").lean();
  challenge.currentCount += count;
  const existing = challenge.contributors.find((c) => c.userId === userId);
  if (existing) existing.count += count;
  else challenge.contributors.push({ userId, name: me?.name || "Student", count });
  await challenge.save();
  return challenge;
}

// ── Teacher post — create, react, comment ─────────────────────────
export async function postTeacherUpdate(teacherId, schoolGroupId, body) {
  const me = await User.findById(teacherId).select("name role").lean();
  return TeacherPost.create({
    schoolGroupId: String(schoolGroupId),
    teacherId,
    teacherName: me?.name || "Class Teacher",
    teacherRole: body.role || "Class teacher",
    message:     body.message,
  });
}

export async function reactToTeacherPost(userId, postId, emoji) {
  const post = await TeacherPost.findById(postId);
  if (!post) throw new AppError("Post not found", 404);
  const reactions = post.reactions || new Map();
  const arr = reactions.get(emoji) || [];
  if (!arr.includes(userId)) arr.push(userId);
  reactions.set(emoji, arr);
  post.reactions = reactions;
  await post.save();
  return post;
}

export async function commentOnTeacherPost(userId, postId, text) {
  const me = await User.findById(userId).select("name").lean();
  const post = await TeacherPost.findById(postId);
  if (!post) throw new AppError("Post not found", 404);
  post.comments.push({ userId, name: me?.name || "Student", text: text.slice(0, 280), at: new Date() });
  await post.save();
  return post;
}

// ── Subject focus (teacher sets weekly theme) ─────────────────────
export async function setSubjectFocus(creatorId, schoolGroupId, subject, topic) {
  return SubjectFocus.findOneAndUpdate(
    { schoolGroupId: String(schoolGroupId), weekKey: isoWeekKey() },
    { $set: { subject, topic, createdAt: new Date() } },
    { upsert: true, new: true }
  );
}

// ── Class prefs (anonymous mode, hide rank, block/mute) ──────────
export async function getMyClassPrefs(userId) {
  return ClassPreference.findOne({ userId }).lean() || { userId, anonymousMode: false, hideRank: false, blockedIds: [], mutedIds: [] };
}

export async function updateMyClassPrefs(userId, patch) {
  return ClassPreference.findOneAndUpdate(
    { userId },
    { $set: patch },
    { upsert: true, new: true }
  );
}

// ── Report a classmate ───────────────────────────────────────────
export async function reportClassmate(reporterId, targetId, schoolGroupId, reason, note) {
  return ClassReport.create({ reporterId, targetId, schoolGroupId, reason, note: (note || "").slice(0, 500) });
}
