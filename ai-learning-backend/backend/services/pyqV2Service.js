import { Question, User, Attempt } from "../models/index.js";

// ── High-frequency topics — appears in N of last 5 (or N) papers ──
export async function getHighFrequencyTopics({ subject = "Mathematics", grade = "10", lastN = 5 } = {}) {
  // Get distinct years (PYQ only)
  const yearsAgg = await Question.aggregate([
    { $match: { subject, grade, isPYQ: true, deletedAt: null, pyqYear: { $exists: true, $ne: null } } },
    { $group: { _id: "$pyqYear" } },
    { $sort: { _id: -1 } },
    { $limit: lastN },
  ]);
  const years = yearsAgg.map((y) => y._id);
  if (!years.length) return { topics: [], yearCount: 0 };

  // Topic appearances
  const rows = await Question.aggregate([
    { $match: { subject, grade, isPYQ: true, deletedAt: null, pyqYear: { $in: years } } },
    { $group: { _id: { topic: "$topic", year: "$pyqYear" } } },
    { $group: { _id: "$_id.topic", years: { $addToSet: "$_id.year" }, count: { $sum: 1 } } },
    { $project: { topic: "$_id", _id: 0, yearsAppeared: { $size: "$years" }, totalCount: "$count" } },
    { $sort: { yearsAppeared: -1, totalCount: -1 } },
    { $limit: 8 },
  ]);
  return { topics: rows, yearCount: years.length };
}

// ── Repeat likelihood per question (heuristic) ────────────────────
export function repeatLikelihood({ pyqYear, topicAppearances, yearCount }) {
  if (!pyqYear) return null;
  // Topic frequency factor: if topic appeared in >50% of recent papers, base 60% likely
  const topicFactor = topicAppearances / Math.max(yearCount, 1);
  // Recency factor: recent questions less likely to repeat verbatim
  const yearsSince = new Date().getFullYear() - pyqYear;
  const recencyFactor = yearsSince < 2 ? 0.4 : yearsSince < 4 ? 0.7 : 1.0;
  const score = Math.round(topicFactor * recencyFactor * 100);
  return Math.min(85, Math.max(10, score));
}

// ── Solve rate per question (% of attempts that were correct) ──────
export async function getSolveRates(questionIds) {
  if (!questionIds?.length) return {};
  const rows = await Attempt.aggregate([
    { $match: { questionId: { $in: questionIds.map(String) } } },
    { $group: {
      _id: "$questionId",
      total: { $sum: 1 },
      correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
    } },
  ]);
  const out = {};
  for (const r of rows) {
    out[r._id] = r.total > 0 ? Math.round((r.correct / r.total) * 100) : null;
  }
  return out;
}

// ── User's solved status per question (from Attempt) ──────────────
export async function getSolvedStatus(userId, questionIds) {
  if (!userId || !questionIds?.length) return {};
  const ids = questionIds.map(String);
  const rows = await Attempt.find({ userId, questionId: { $in: ids } })
    .select("questionId isCorrect").lean();
  const out = {};
  for (const r of rows) {
    if (!out[r.questionId]) out[r.questionId] = { attempted: true, correct: false };
    if (r.isCorrect) out[r.questionId].correct = true;
  }
  return out;
}

// ── Topic appearance map (used for repeat-likelihood) ──────────────
export async function getTopicAppearances({ subject = "Mathematics", grade = "10" } = {}) {
  const rows = await Question.aggregate([
    { $match: { subject, grade, isPYQ: true, deletedAt: null } },
    { $group: { _id: { topic: "$topic", year: "$pyqYear" } } },
    { $group: { _id: "$_id.topic", years: { $addToSet: "$_id.year" } } },
    { $project: { topic: "$_id", _id: 0, count: { $size: "$years" } } },
  ]);
  const map = {};
  for (const r of rows) map[r.topic] = r.count;
  return map;
}

// ── Mock paper from filters — picks a balanced set ─────────────────
export async function buildMockFromFilters({ subject = "Mathematics", grade = "10", year, years = [], topics = [], chapters = [], limit = 20 } = {}) {
  const filter = { subject, grade, isPYQ: true, deletedAt: null };
  // Year support: array or single
  if (years.length === 1) filter.pyqYear = parseInt(years[0]);
  else if (years.length > 1) filter.pyqYear = { $in: years.map(Number) };
  else if (year) filter.pyqYear = parseInt(year);
  if (topics.length) filter.topic = { $in: topics };
  if (chapters.length) filter.chapterNumber = { $in: chapters.map(Number) };
  const all = await Question.find(filter).select("_id questionText topic marks questionType pyqYear").limit(200).lean();
  // Pick a balanced sample by topic
  const byTopic = {};
  for (const q of all) {
    if (!byTopic[q.topic]) byTopic[q.topic] = [];
    byTopic[q.topic].push(q);
  }
  const picked = [];
  const topicNames = Object.keys(byTopic).sort(() => Math.random() - 0.5);
  let i = 0;
  while (picked.length < limit && i < limit * 2) {
    const t = topicNames[i % topicNames.length];
    if (byTopic[t]?.length) picked.push(byTopic[t].shift());
    i++;
  }
  return {
    questions: picked.slice(0, limit),
    totalMarks: picked.reduce((s, q) => s + (q.marks || 1), 0),
    estimatedMinutes: picked.reduce((s, q) => s + (q.marks || 1) * 3, 0),
  };
}

// ── Per-topic progress (X solved of Y total) ───────────────────────
export async function getTopicProgress(userId, { subject = "Mathematics", grade = "10" } = {}) {
  // All PYQ topics
  const topics = await Question.aggregate([
    { $match: { subject, grade, isPYQ: true, deletedAt: null } },
    { $group: { _id: "$topic", total: { $sum: 1 } } },
    { $project: { topic: "$_id", _id: 0, total: 1 } },
  ]);
  if (!topics.length) return [];
  // User attempts
  const attempts = await Attempt.find({ userId, topic: { $in: topics.map((t) => t.topic) } })
    .select("topic isCorrect").lean();
  const solvedByTopic = {};
  for (const a of attempts) {
    if (!solvedByTopic[a.topic]) solvedByTopic[a.topic] = new Set();
    if (a.isCorrect) solvedByTopic[a.topic].add(a.questionId);
  }
  return topics.map((t) => ({
    topic: t.topic,
    total: t.total,
    solved: solvedByTopic[t.topic]?.size || 0,
  }));
}
