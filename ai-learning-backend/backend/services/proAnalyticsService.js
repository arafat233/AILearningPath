/**
 * proAnalyticsService — analytics for pro-track users.
 *
 * Complements analyticsV2Service.js (school-track) with ProSubmission /
 * ProProgress / ProBookmark data. All functions take userId + optional
 * trackKey; when trackKey is omitted the user's first enrolled pro track
 * is used.
 */

import {
  ProSubmission, ProProgress, ProBookmark, ProCertificate,
  ProTrack, ProModule, ProTopic, ProExercise,
} from "../models/proModels.js";
import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// ── helpers ────────────────────────────────────────────────────────────

async function primaryTrackKey(userId) {
  const user = await User.findById(userId).select("tracks activeTrack").lean();
  if (!user) return null;
  const proTracks = (user.tracks || []).filter((t) => t.key.startsWith("pro_"));
  if (proTracks.length === 0) return null;
  return user.activeTrack?.startsWith("pro_")
    ? user.activeTrack
    : proTracks[0].key;
}

// Attempt-to-radar conversion constants
const AVG_TIME_EXPECTED = 90; // seconds — "slow" is anything above this

function radarFromSubmissions(ats) {
  if (!ats.length) return null;

  const correct = ats.filter((a) => a.passed).length;
  const accuracy = correct / ats.length;
  const avgTime = ats.reduce((s, a) => s + (a.sandboxResult?.timeMs || 0), 0) / ats.length / 1000;

  // Depth — accuracy on hard exercises (difficulty > 0.6)
  const hard = ats.filter((a) => {
    const d = a.ex?._?.difficulty ?? a.ex?.difficulty ?? 0;
    return d > 0.6;
  });
  const depth = hard.length
    ? Math.round((hard.filter((a) => a.passed).length / hard.length) * 100)
    : Math.round(accuracy * 80);

  // Speed — faster than expected
  const speed = Math.max(20, Math.min(100, Math.round((AVG_TIME_EXPECTED / Math.max(avgTime, 5)) * 80)));

  // Pattern — max consecutive correct
  let maxRun = 0, run = 0;
  for (const a of ats) { if (a.passed) { run++; maxRun = Math.max(maxRun, run); } else run = 0; }
  const pattern = Math.min(100, Math.round((maxRun / 5) * 100));

  // Recall — revisit accuracy (repeat exercise attempts)
  const seen = {};
  for (const a of ats) seen[a.exerciseId] = (seen[a.exerciseId] || 0) + 1;
  const repeats = ats.filter((a) => seen[a.exerciseId] > 1);
  const recall = repeats.length
    ? Math.round((repeats.filter((a) => a.passed).length / repeats.length) * 100)
    : Math.round(accuracy * 100);

  // Calibration — overconfidence: failed on first attempt vs not passed
  const firstAttempt = {};
  for (const a of ats) {
    if (!firstAttempt[a.exerciseId]) firstAttempt[a.exerciseId] = a;
  }
  const overconf = ats.filter((a) =>
    a.sandboxResult?.exitCode !== 0 &&
    a === firstAttempt[a.exerciseId]
  ).length / Math.max(ats.length, 1);
  const underconf = ats.filter((a) =>
    a.passed &&
    a === firstAttempt[a.exerciseId] &&
    (a.sandboxResult?.timeMs || 0) > AVG_TIME_EXPECTED * 1000
  ).length / Math.max(ats.length, 1);
  const calibration = Math.max(20, Math.round(100 - (overconf + underconf) * 100));

  return { depth, speed, pattern, recall, calibration };
}

// Peer band — median across all pro users with 5+ submissions
async function peerRadar(trackKey) {
  const peers = await ProSubmission.aggregate([
    { $match: { trackKey, passed: true } },
    { $group: { _id: "$userId", total: { $sum: 1 }, correct: { $sum: 1 } } },
    { $match: { total: { $gte: 3 } } },
    { $limit: 200 },
  ]);
  const peerAcc = peers.length ? peers.reduce((s, p) => s + (p.correct / p.total), 0) / peers.length : 0.65;
  return {
    depth:       Math.round(peerAcc * 70),
    speed:       60,
    pattern:     55,
    recall:      Math.round(peerAcc * 100),
    calibration: 70,
  };
}

// ── 1. Persona ──────────────────────────────────────────────────────────

const PRO_PERSONA = {
  "Architect": {
    name: "The Architect.",
    tagline: "You build from first principles. You prefer understanding over memorizing — and it shows in your code.",
  },
  "Speed Coder": {
    name: "The Speed Coder.",
    tagline: "You move fast and trust your instincts. Your first-pass accuracy is high — but don't skip the review.",
  },
  "Debugger": {
    name: "The Debugger.",
    tagline: "You learn by breaking things. Errors don't faze you — they guide you. That habit compounds fast.",
  },
  "Deep diver": {
    name: "The Deep Diver.",
    tagline: "You explore edge cases before they're edge cases. Patience with the problem is your unfair advantage.",
  },
  "Unclassified": {
    name: "Just getting started.",
    tagline: "Complete 3+ exercises to unlock your coding persona.",
  },
};

export async function getProPersona(userId, trackKey) {
  const prog = await ProProgress.findOne({ userId, trackKey }).lean();
  const subs = await ProSubmission.find({ userId, trackKey }).lean();

  let tag = "Unclassified";
  if (prog && prog.totalXp > 0) {
    const hard = subs.filter((s) => {
      const d = s.ex?._?.difficulty ?? s.ex?.difficulty ?? 0;
      return d > 0.6;
    });
    if (hard.length >= 3 && hard.filter((s) => s.passed).length / hard.length > 0.6) tag = "Architect";
    else if (subs.length > 10 && subs.slice(0, 5).filter((s) => s.passed).length >= 4) tag = "Speed Coder";
    else if (subs.filter((s) => !s.passed).length > subs.length * 0.3) tag = "Debugger";
    else if (subs.length > 5 && subs.reduce((acc, s) => acc + (s.sandboxResult?.timeMs || 0), 0) / subs.length > 120000) tag = "Deep Diver";
  }

  return { thinkingProfile: tag, ...PRO_PERSONA[tag] };
}

// ── 2. Radar ────────────────────────────────────────────────────────────

export async function getProRadar(userId, trackKey) {
  const subs = await ProSubmission.find({ userId, trackKey }).lean();
  if (!subs.length) return null;

  // Attach exercise difficulty (lean)
  const exIds = [...new Set(subs.map((s) => s.exerciseId))];
  const exercises = await ProExercise.find({ exerciseId: { $in: exIds } })
    .select("exerciseId difficulty").lean();
  const exMap = Object.fromEntries(exercises.map((e) => [e.exerciseId, e]));

  const enriched = subs.map((s) => ({ ...s, ex: exMap[s.exerciseId] || {} }));
  const me = radarFromSubmissions(enriched);
  const peer = await peerRadar(trackKey);

  return { me, peer };
}

// ── 3. Stats (XP, exercises, modules, streak) ─────────────────────────

export async function getProStats(userId, trackKey) {
  const [prog, track, modules, subs] = await Promise.all([
    ProProgress.findOne({ userId, trackKey }).lean(),
    ProTrack.findOne({ key: trackKey }).select("name language totalXp totalExercises totalModules totalTopics").lean(),
    ProModule.find({ trackKey, status: "live" }).select("moduleId").lean(),
    ProSubmission.find({ userId, trackKey }).lean(),
  ]);

  const totalXp       = prog?.totalXp ?? 0;
  const currentStreak = prog?.currentStreak ?? 0;
  const completedExercises = new Set(prog?.completedExercises || []).size;
  const totalExercises     = track?.totalExercises ?? 0;
  const completedModules   = new Set(
    (await ProTopic.find({ trackKey, status: "live" })
      .select("moduleId").lean())
      .filter((t) => (prog?.completedTopics || []).includes(t.topicId))
      .map((t) => t.moduleId)
  ).size;

  // Pass rate
  const passRate = subs.length
    ? Math.round((subs.filter((s) => s.passed).length / subs.length) * 100)
    : 0;

  return {
    totalXp,
    currentStreak,
    completedExercises,
    totalExercises,
    completedModules,
    totalModules:  modules.length,
    passRate,
    language: track?.language || "Java",
    trackName: track?.name || "Pro Track",
  };
}

// ── 4. This week ─────────────────────────────────────────────────────────

export async function getProThisWeek(userId, trackKey) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const subs = await ProSubmission.find({
    userId, trackKey,
    createdAt: { $gte: start },
  }).lean();

  const byDay = Array(7).fill(null).map((_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    return { date: d.toISOString().slice(0, 10), dayLabel: ["S","M","T","W","T","F","S"][d.getDay()], count: 0, xp: 0 };
  });

  for (const s of subs) {
    const key = new Date(s.createdAt).toISOString().slice(0, 10);
    const cell = byDay.find((b) => b.date === key);
    if (cell) { cell.count++; cell.xp += s.xpAwarded || 0; }
  }

  const activeDays = byDay.filter((b) => b.count > 0).length;
  const totalXp = byDay.reduce((s, b) => s + b.xp, 0);

  // WoW change
  const priorEnd = new Date(start); priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd); priorStart.setDate(priorStart.getDate() - 7);
  const prior = await ProSubmission.countDocuments({
    userId, trackKey,
    createdAt: { $gte: priorStart, $lt: priorEnd },
  });
  const wow = prior ? Math.round(((byDay.reduce((s, b) => s + b.count, 0) - prior) / prior) * 100) : null;

  return { byDay, activeDays, totalXp, wow };
}

// ── 5. Top skills / language areas ─────────────────────────────────────

export async function getProSkills(userId, trackKey) {
  const subs = await ProSubmission.find({ userId, trackKey }).lean();
  if (!subs.length) return [];

  const exIds = [...new Set(subs.map((s) => s.exerciseId))];
  const exercises = await ProExercise.find({ exerciseId: { $in: exIds } })
    .select("exerciseId topicId moduleId title level xpReward").lean();
  const exMap = Object.fromEntries(exercises.map((e) => [e.exerciseId, e]));

  const byModule = {};
  for (const s of subs) {
    const ex = exMap[s.exerciseId];
    if (!ex) continue;
    if (!byModule[ex.moduleId]) byModule[ex.moduleId] = { total: 0, correct: 0, xp: 0 };
    byModule[ex.moduleId].total++;
    if (s.passed) byModule[ex.moduleId].correct++;
    byModule[ex.moduleId].xp += s.xpAwarded || 0;
  }

  const mods = await ProModule.find({ trackKey })
    .select("moduleId moduleNumber name").lean();
  const modMap = Object.fromEntries(mods.map((m) => [m.moduleId, m]));

  return Object.entries(byModule)
    .map(([moduleId, data]) => ({
      moduleId,
      name: modMap[moduleId]?.name || moduleId,
      moduleNumber: modMap[moduleId]?.moduleNumber || 0,
      accuracy: data.total ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
      xp: data.xp,
    }))
    .sort((a, b) => a.moduleNumber - b.moduleNumber);
}

// ── 6. Insights ─────────────────────────────────────────────────────────

export async function getProInsights(userId, trackKey) {
  const insights = [];
  const subs = await ProSubmission.find({ userId, trackKey }).lean();

  if (subs.length < 3) {
    insights.push({ icon: "💻", text: "Complete 3+ exercises to get personalised insights about your coding style." });
    return insights;
  }

  // Accuracy trend
  const recent = subs.slice(-5);
  const recentAcc = recent.filter((s) => s.passed).length / recent.length;
  if (recentAcc > 0.8) insights.push({ icon: "🚀", text: `${Math.round(recentAcc * 100)}% pass rate on your last 5 submissions — keep this pace.` });
  else if (recentAcc < 0.4) insights.push({ icon: "🔁", text: `Only ${Math.round(recentAcc * 100)}% on recent 5. Revisit the theory before retrying these exercises.` });

  // Time-of-day
  const byHour = {};
  for (const s of subs) {
    const h = new Date(s.createdAt).getHours();
    if (!byHour[h]) byHour[h] = { total: 0, correct: 0 };
    byHour[h].total++;
    if (s.passed) byHour[h].correct++;
  }
  const hours = Object.entries(byHour).filter(([, b]) => b.total >= 2)
    .map(([h, b]) => ({ h: parseInt(h), acc: b.correct / b.total }));
  if (hours.length >= 2) {
    const best = hours.reduce((a, b) => a.acc > b.acc ? a : b);
    const overall = subs.filter((s) => s.passed).length / subs.length;
    if (best.acc > overall + 0.15) {
      insights.push({ icon: "⏰", text: `Peak performance at ${best.h}:00 (${Math.round(best.acc * 100)}% accuracy). Schedule deep work then.` });
    }
  }

  // Bookmarks review rate
  const bms = await ProBookmark.find({ userId, trackKey }).lean();
  if (bms.length >= 3) {
    insights.push({ icon: "📌", text: `${bms.length} saved items. Revisiting bookmarked exercises strengthens weak areas.` });
  }

  // Slow vs fast submissions
  const avgMs = subs.reduce((s, x) => s + (x.sandboxResult?.timeMs || 0), 0) / subs.length;
  if (avgMs < 30000) insights.push({ icon: "⚡", text: `Avg execution: ${Math.round(avgMs / 1000)}s — you're fast. Focus on edge cases.` });
  else if (avgMs > 90000) insights.push({ icon: "🐢", text: `Avg execution: ${Math.round(avgMs / 1000)}s — you're thorough. Consider pre-checking against known patterns.` });

  return insights.slice(0, 5);
}

// ── 7. Module progress breakdown ───────────────────────────────────────

export async function getProModuleProgress(userId, trackKey) {
  const prog = await ProProgress.findOne({ userId, trackKey }).lean();
  const modules = await ProModule.find({ trackKey, status: "live" })
    .select("moduleId moduleNumber name").sort({ moduleNumber: 1 }).lean();

  const topics = await ProTopic.find({ trackKey, status: "live" })
    .select("topicId moduleId").lean();

  const byModule = {};
  for (const m of modules) {
    byModule[m.moduleId] = {
      name: m.name,
      moduleNumber: m.moduleNumber,
      totalTopics: 0,
      completedTopics: 0,
      totalExercises: 0,
      completedExercises: new Set(),
    };
  }
  for (const t of topics) {
    if (byModule[t.moduleId]) byModule[t.moduleId].totalTopics++;
  }

  const exercises = await ProExercise.find({ trackKey }).select("exerciseId topicId").lean();
  for (const e of exercises) {
    const t = topics.find((t2) => t2.topicId === e.topicId);
    if (t && byModule[t.moduleId]) byModule[t.moduleId].totalExercises++;
  }

  const completedTopics = new Set(prog?.completedTopics || []);
  const completedExercises = new Set(prog?.completedExercises || []);
  for (const t of topics) {
    if (completedTopics.has(t.topicId) && byModule[t.moduleId]) {
      byModule[t.moduleId].completedTopics++;
    }
  }
  for (const e of exercises) {
    if (completedExercises.has(e.exerciseId)) {
      const t = topics.find((t2) => t2.topicId === e.topicId);
      if (t && byModule[t.moduleId]) byModule[t.moduleId].completedExercises.add(e.exerciseId);
    }
  }

  return Object.values(byModule).map((m) => ({
    moduleId: m.moduleId,
    name: m.name,
    moduleNumber: m.moduleNumber,
    totalTopics: m.totalTopics,
    completedTopics: m.completedTopics,
    totalExercises: m.totalExercises,
    completedExercises: m.completedExercises.size,
    pct: m.totalTopics ? Math.round((m.completedTopics / m.totalTopics) * 100) : 0,
  }));
}

// ── Dashboard (all-in-one) ───────────────────────────────────────────────

export async function getProAnalyticsDashboard(userId, trackKeyOverride) {
  const trackKey = trackKeyOverride || await primaryTrackKey(userId);
  if (!trackKey) return null;

  const [persona, radar, stats, thisWeek, skills, insights, moduleProgress] = await Promise.all([
    getProPersona(userId, trackKey),
    getProRadar(userId, trackKey),
    getProStats(userId, trackKey),
    getProThisWeek(userId, trackKey),
    getProSkills(userId, trackKey),
    getProInsights(userId, trackKey),
    getProModuleProgress(userId, trackKey),
  ]);

  return { persona, radar, stats, thisWeek, skills, insights, moduleProgress, trackKey };
}

// ── 8. Certificate data ────────────────────────────────────────────────────

export async function getProCertificate(userId, trackKey) {
  if (!trackKey) throw new AppError("trackKey required", 400);

  const [track, prog, modules, topics] = await Promise.all([
    ProTrack.findOne({ key: trackKey }).select("name language slug key").lean(),
    ProProgress.findOne({ userId, trackKey }).lean(),
    ProModule.find({ trackKey, status: "live" }).select("moduleId totalXp").lean(),
    ProTopic.find({ trackKey, status: "live" }).select("topicId moduleId").lean(),
  ]);

  if (!track) throw new AppError("Track not found.", 404);

  const completedTopics = new Set(prog?.completedTopics || []);
  const completedExercises = new Set(prog?.completedExercises || []);
  const totalTopics = topics.length;
  const totalExercises = (await ProExercise.find({ trackKey }).countDocuments().lean()) || 0;

  const completedModuleSet = new Set(
    topics.filter((t) => completedTopics.has(t.topicId)).map((t) => t.moduleId)
  );

  const pct = totalTopics > 0
    ? Math.round((completedTopics.size / totalTopics) * 100)
    : 0;

  const allModulesDone = modules.length > 0 && modules.every((m) => completedModuleSet.has(m.moduleId));

  return {
    trackName:    track.name,
    language:     track.language,
    trackKey:     track.key,
    totalXp:      prog?.totalXp ?? 0,
    totalTopics,
    completedTopics: completedTopics.size,
    totalExercises,
    completedExercises: completedExercises.size,
    pct,
    allModulesDone,
    currentStreak: prog?.currentStreak ?? 0,
    issuedAt:     new Date().toISOString(),
  };
}

// ── Certificates ────────────────────────────────────────────────────────────

export async function listUserCertificates(userId, trackKey) {
  // Service layer already enforces enrolment via proService.issueModuleCertificate
  // We just query and return certs for this user + track
  return ProCertificate.find({ userId, trackKey }).sort({ issuedAt: -1 }).lean();
}

export async function issueModuleCertificate(userId, trackKey, moduleId) {
  // Re-exported from proService for convenience
  // The actual logic lives in proService.js
  const { issueModuleCertificate: issue } = await import("./proService.js");
  return issue(userId, trackKey, moduleId);
}

// ── Leaderboard ─────────────────────────────────────────────────────────────

export async function getProLeaderboard(trackKey, limit = 20) {
  const rows = await ProProgress.find({ trackKey })
    .sort({ totalXp: -1 })
    .limit(limit)
    .lean();

  const userIds = rows.map((r) => r.userId);
  const users = await User.find({ _id: { $in: userIds } })
    .select("name avatar")
    .lean();
  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));

  return rows.map((r, i) => ({
    rank: i + 1,
    userId: r.userId,
    name: userMap[r.userId]?.name ?? "Anonymous",
    avatar: userMap[r.userId]?.avatar ?? null,
    totalXp: r.totalXp,
    completedExercises: (r.completedExercises || []).length,
    currentStreak: r.currentStreak || 0,
  }));
}