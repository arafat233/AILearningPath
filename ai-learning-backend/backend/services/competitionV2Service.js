import { ArenaRating, Room, Match, DailyQuest, MatchReport, makeRoomCode, tierFromRating, isoWeekKey } from "../models/competitionV2Models.js";
import { Question, User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// ── Arena ─────────────────────────────────────────────────────────
async function ensureRating(userId) {
  let r = await ArenaRating.findOne({ userId });
  if (!r) r = await ArenaRating.create({ userId });
  // Roll over weekly bucket
  const wk = isoWeekKey();
  if (r.weekKey !== wk) { r.weekKey = wk; r.weeklyPoints = 0; await r.save(); }
  return r;
}

export async function getArena(userId) {
  const r = await ensureRating(userId);
  const tier = tierFromRating(r.rating);
  // Compute rank (server-side)
  const better = await ArenaRating.countDocuments({ rating: { $gt: r.rating } });
  return {
    rating:        r.rating,
    tier,
    points:        r.points,
    weeklyPoints:  r.weeklyPoints,
    rank:          better + 1,
    wins:          r.wins,
    losses:        r.losses,
    matchesPlayed: r.matchesPlayed,
    accuracy:      r.totalAnswered ? Math.round((r.totalCorrect / r.totalAnswered) * 100) : null,
    winStreak:     r.winStreak,
    bestWinStreak: r.bestWinStreak,
    beginnerProtection: r.beginnerProtection,
  };
}

// ── Weekly leaderboard with rank deltas ───────────────────────────
const lastWeekRanks = new Map(); // in-memory cache for delta — refreshed weekly
export async function getWeeklyLeaderboard(userId, grade = null, limit = 10) {
  const wk = isoWeekKey();
  const filter = grade ? await (async () => {
    const ids = (await User.find({ grade }).select("_id").lean()).map((u) => u._id.toString());
    return { weekKey: wk, userId: { $in: ids } };
  })() : { weekKey: wk };
  const rows = await ArenaRating.find(filter).sort({ weeklyPoints: -1 }).limit(limit).lean();

  // Get names
  const ids = rows.map((r) => r.userId);
  const users = await User.find({ _id: { $in: ids } }).select("_id name").lean();
  const nameMap = {}; for (const u of users) nameMap[u._id.toString()] = u.name;

  // Compute rank deltas vs last week (from in-memory snapshot)
  const board = rows.map((r, i) => {
    const rank = i + 1;
    const prev = lastWeekRanks.get(r.userId);
    const delta = prev != null ? prev - rank : 0;
    return {
      rank,
      userId:        r.userId,
      name:          nameMap[r.userId] || "Anonymous",
      points:        r.weeklyPoints,
      matchesPlayed: r.matchesPlayed,
      delta,
      isYou:         r.userId === userId,
    };
  });

  // Snapshot ranks for next compare (real prod would do this on weekly cron)
  for (const b of board) lastWeekRanks.set(b.userId, b.rank);

  return board;
}

// ── Rooms ─────────────────────────────────────────────────────────
export async function listOpenRooms(limit = 20) {
  return Room.find({ status: "lobby", visibility: "public" })
    .sort({ createdAt: -1 }).limit(limit).lean();
}

export async function createRoom(userId, body) {
  const { topic, subject = "Math", difficulty = "medium", capacity = 4, visibility = "public" } = body;
  if (!topic) throw new AppError("Topic required", 422);
  const me = await User.findById(userId).select("name").lean();
  const r = await ensureRating(userId);
  const room = await Room.create({
    code: makeRoomCode(subject),
    topic, subject, difficulty, capacity, visibility,
    hostId: userId,
    participants: [{ userId, name: me?.name || "Player", rating: r.rating, ready: false }],
  });
  return room;
}

export async function joinRoom(userId, code) {
  const room = await Room.findOne({ code, status: "lobby" });
  if (!room) throw new AppError("Room not found or already started", 404);
  if (room.participants.length >= room.capacity) throw new AppError("Room full", 409);
  if (room.participants.find((p) => p.userId === userId)) return room;
  const me = await User.findById(userId).select("name").lean();
  const r = await ensureRating(userId);
  room.participants.push({ userId, name: me?.name || "Player", rating: r.rating });
  await room.save();
  return room;
}

export async function leaveRoom(userId, code) {
  const room = await Room.findOne({ code });
  if (!room) return null;
  room.participants = room.participants.filter((p) => p.userId !== userId);
  if (room.participants.length === 0) await Room.deleteOne({ _id: room._id });
  else await room.save();
  return room;
}

export async function readyUp(userId, code) {
  const room = await Room.findOne({ code });
  if (!room) throw new AppError("Room not found", 404);
  const p = room.participants.find((p) => p.userId === userId);
  if (p) p.ready = !p.ready;
  await room.save();
  return room;
}

export async function startMatch(userId, code) {
  const room = await Room.findOne({ code, status: "lobby" });
  if (!room) throw new AppError("Room not found", 404);
  if (room.hostId !== userId) throw new AppError("Only host can start", 403);
  if (room.participants.length < 2) throw new AppError("Need ≥ 2 players", 422);

  // Pick 10 questions
  const qs = await Question.find({
    topic: room.topic, deletedAt: null, "options.0": { $exists: true },
    questionType: { $in: ["mcq", "assertion_reason", "case_based"] },
  }).limit(20).lean();
  const picked = qs.sort(() => Math.random() - 0.5).slice(0, 10);
  if (picked.length < 5) throw new AppError("Not enough questions for this topic", 422);
  room.questionIds = picked.map((q) => String(q._id));
  room.status = "live";
  room.startedAt = new Date();
  await room.save();

  return {
    code: room.code,
    questions: picked.map((q) => ({ _id: q._id, questionText: q.questionText, options: (q.options || []).map(({ text, logicTag }) => ({ text, logicTag })), difficulty: q.difficulty })),
    durationSeconds: 600, // 10 min
  };
}

export async function getRoomLive(code) {
  return Room.findOne({ code }).lean();
}

// Update participant score during live match
export async function recordAnswer(userId, code, { questionId, isCorrect, timeTaken }) {
  const room = await Room.findOne({ code, status: "live" });
  if (!room) throw new AppError("Match not live", 404);
  const p = room.participants.find((p) => p.userId === userId);
  if (!p) throw new AppError("Not in match", 403);
  p.answered = (p.answered || 0) + 1;
  if (isCorrect) {
    p.correct = (p.correct || 0) + 1;
    // Score: +10 base, time bonus up to +5 (faster = more)
    const bonus = Math.max(0, Math.round((30 - Math.min(timeTaken || 30, 30)) / 6));
    p.score = (p.score || 0) + 10 + bonus;
  }
  await room.save();
  return p;
}

// ── Finish match: compute ranks, ratings, history ────────────────
export async function finishMatch(code) {
  const room = await Room.findOne({ code });
  if (!room || room.status === "finished") return null;
  // Sort by score desc
  const sorted = [...room.participants].sort((a, b) => (b.score || 0) - (a.score || 0));
  sorted.forEach((p, i) => { p.rank = i + 1; });

  // ELO updates: pairwise simple update
  const ratingChanges = {};
  for (let i = 0; i < sorted.length; i++) {
    const me = sorted[i];
    let delta = 0;
    for (let j = 0; j < sorted.length; j++) {
      if (i === j) continue;
      const opp = sorted[j];
      const expected = 1 / (1 + Math.pow(10, ((opp.rating || 1200) - (me.rating || 1200)) / 400));
      const score = me.rank < opp.rank ? 1 : me.rank > opp.rank ? 0 : 0.5;
      delta += 16 * (score - expected); // K = 16, divided across pairwise
    }
    ratingChanges[me.userId] = Math.round(delta / Math.max(1, sorted.length - 1));
  }

  // Persist ratings + counters
  for (const p of sorted) {
    const r = await ensureRating(p.userId);
    r.rating = Math.max(100, r.rating + (ratingChanges[p.userId] || 0));
    r.matchesPlayed += 1;
    r.points        += p.score || 0;
    r.weeklyPoints  += p.score || 0;
    r.totalCorrect  += p.correct || 0;
    r.totalAnswered += p.answered || 0;
    r.accuracy = r.totalAnswered ? r.totalCorrect / r.totalAnswered : 0;
    if (p.rank === 1) {
      r.wins += 1;
      r.winStreak += 1;
      if (r.winStreak > r.bestWinStreak) r.bestWinStreak = r.winStreak;
    } else if (p.rank === sorted.length) {
      r.losses += 1;
      r.winStreak = 0;
    } else {
      r.draws = (r.draws || 0) + 1;
    }
    if (r.matchesPlayed >= 10) r.beginnerProtection = false;
    r.updatedAt = new Date();
    await r.save();
  }

  room.status = "finished";
  room.endedAt = new Date();
  await room.save();

  const match = await Match.create({
    roomCode: room.code,
    topic: room.topic,
    subject: room.subject,
    difficulty: room.difficulty,
    startedAt: room.startedAt,
    endedAt: room.endedAt,
    durationSec: Math.round((room.endedAt - room.startedAt) / 1000),
    participants: sorted.map((p) => ({
      userId: p.userId, name: p.name, score: p.score, correct: p.correct, answered: p.answered, rank: p.rank,
      ratingChange: ratingChanges[p.userId] || 0,
    })),
  });

  return match;
}

// ── Match history ─────────────────────────────────────────────────
export async function getMatchHistory(userId, limit = 10) {
  return Match.find({ "participants.userId": userId }).sort({ endedAt: -1 }).limit(limit).lean();
}

// ── Quick match: simulate against bot or queue ───────────────────
export async function quickMatch(userId, subject = "Math") {
  // Find an existing lobby room with ≤ capacity−1 of similar rating
  const me = await ensureRating(userId);
  const open = await Room.find({ status: "lobby", visibility: "public", subject }).lean();
  const candidate = open.find((r) => r.participants.length < r.capacity && Math.abs((r.participants[0]?.rating || 1200) - me.rating) < 200);
  if (candidate) {
    return await joinRoom(userId, candidate.code);
  }
  // Otherwise create a new one
  // Pick a topic — first topic with enough questions in this subject
  const topicRow = await Question.aggregate([
    { $match: { subject, deletedAt: null } },
    { $group: { _id: "$topic", count: { $sum: 1 } } },
    { $match: { count: { $gte: 5 } } },
    { $sample: { size: 1 } },
  ]);
  const topic = topicRow[0]?._id || "General";
  return await createRoom(userId, { topic, subject, difficulty: "medium", capacity: 2 });
}

// ── Daily quests ──────────────────────────────────────────────────
const QUEST_TEMPLATES = [
  { id: "win1",          label: "Win 1 match today",                target: 1, rewardXP: 50 },
  { id: "play3",         label: "Play 3 matches",                   target: 3, rewardXP: 30 },
  { id: "hard_topic",    label: "Try a Hard-difficulty topic",      target: 1, rewardXP: 40 },
];
export async function getDailyQuests(userId) {
  const date = new Date().toISOString().slice(0, 10);
  let doc = await DailyQuest.findOne({ userId, date });
  if (!doc) doc = await DailyQuest.create({ userId, date, quests: QUEST_TEMPLATES.map((q) => ({ ...q })) });
  return doc.quests;
}

export async function bumpQuest(userId, questId, by = 1) {
  const date = new Date().toISOString().slice(0, 10);
  const doc = await DailyQuest.findOne({ userId, date });
  if (!doc) return null;
  const q = doc.quests.find((x) => x.id === questId);
  if (!q || q.completed) return null;
  q.progress = Math.min(q.target, q.progress + by);
  if (q.progress >= q.target) q.completed = true;
  await doc.save();
  return q;
}

// ── Champion of the day (yesterday's #1 by weeklyPoints) ────────
export async function getChampion() {
  const top = await ArenaRating.findOne({ weekKey: isoWeekKey() }).sort({ weeklyPoints: -1 }).lean();
  if (!top || !top.weeklyPoints) return null;
  const u = await User.findById(top.userId).select("name").lean();
  return { name: u?.name || "Champion", points: top.weeklyPoints, rating: top.rating };
}

// ── Match report ─────────────────────────────────────────────────
export async function reportOpponent(reporterId, targetId, matchId, reason, note) {
  await MatchReport.create({ reporterId, targetId, matchId, reason, note: (note || "").slice(0, 500) });
  return { ok: true };
}
