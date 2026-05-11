import { Question, Topic, UserTopicMastery, Attempt, User } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { LessonProgress, Lesson } from "../models/lessonModel.js";
import { boardIdFilter, questionBoardFilter, isIcseTopicId } from "../utils/boardFilter.js";

async function getBoardForUser(userId) {
  if (!userId) return "CBSE";
  const u = await User.findById(userId).select("examBoard").lean();
  return (u?.examBoard || "CBSE").toUpperCase();
}

// Hardcoded CBSE Class-10 chapter exam weights (% of board paper marks).
// Source: CBSE published curriculum docs. For other grades/subjects, fallback to 100/N.
const EXAM_WEIGHTS = {
  Mathematics: {
    1: 6,  2: 10, 3: 6,  4: 6,  5: 8,  6: 8,  7: 6,
    8: 6,  9: 6,  10: 6, 11: 8, 12: 8, 13: 10, 14: 6,
  },
  Science: {
    1: 8, 2: 8, 3: 8, 4: 8, 5: 12, 6: 8, 7: 8, 8: 6, 9: 8, 10: 6, 11: 10, 12: 6, 13: 4,
  },
  "Social Science": {
    1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5, 11: 5, 12: 5,
    13: 5, 14: 6, 15: 6, 16: 5, 17: 5, 18: 4, 19: 4, 20: 4, 21: 5, 22: 5,
  },
};

const ncertSubject = (s) => (s === "Math" ? "Mathematics" : s);

// ── Continue where you left off (subject-scoped) ──────────────────────
export async function getContinueCard(userId, subject = null) {
  // First try to find a lesson that matches the requested subject
  let last = null;
  if (subject) {
    const subjectLessons = await Lesson.find({ subject }).select("topic").lean();
    const topicNames = subjectLessons.map((l) => l.topic);
    if (topicNames.length) {
      last = await LessonProgress.findOne({ userId, topic: { $in: topicNames } }).sort({ completedAt: -1 }).lean();
    }
  }
  // Fallback: any subject
  if (!last) last = await LessonProgress.findOne({ userId }).sort({ completedAt: -1 }).lean();
  if (!last) return null;
  const lesson = await Lesson.findOne({ topic: last.topic }).select("title tagline subject shortLesson longLesson").lean();
  // If we asked for a specific subject and the only progress is from another subject, return null
  if (subject && lesson?.subject && lesson.subject !== subject) return null;
  const totalSlides = lesson?.[`${last.mode}Lesson`]?.slides?.length || 1;
  return {
    topic: last.topic,
    title: lesson?.title || last.topic,
    tagline: lesson?.tagline || "",
    subject: lesson?.subject || "Math",
    mode: last.mode,
    slideIndex: last.slideIndex,
    totalSlides,
    percent: Math.round(((last.slideIndex + 1) / totalSlides) * 100),
    lastTouchedAt: last.completedAt,
  };
}

// ── Recently studied (last 5 distinct topics, subject-scoped) ─────────
export async function getRecentTopics(userId, subject = null, limit = 5) {
  // Restrict to lessons of this subject
  let topicFilter = null;
  if (subject) {
    const subjectLessons = await Lesson.find({ subject }).select("topic").lean();
    topicFilter = subjectLessons.map((l) => l.topic);
    if (!topicFilter.length) return [];
  }
  const match = { userId };
  if (topicFilter) match.topic = { $in: topicFilter };
  const rows = await LessonProgress.aggregate([
    { $match: match },
    { $sort: { completedAt: -1 } },
    { $group: { _id: "$topic", lastAt: { $first: "$completedAt" }, mode: { $first: "$mode" } } },
    { $sort: { lastAt: -1 } },
    { $limit: limit },
  ]);
  return rows.map((r) => ({ topic: r._id, lastTouchedAt: r.lastAt, mode: r.mode }));
}

// ── Per-topic mastery state for a user ───────────────────────────────
export async function getTopicMasteryMap(userId) {
  const rows = await UserTopicMastery.find({ userId }).select("topicId mastery attempts").lean();
  const map = {};
  for (const r of rows) {
    const m = r.mastery || {};
    let state = "not_started";
    if (m.hard) state = "mastered";
    else if (m.medium || m.easy) state = "in_progress";
    if (state === "in_progress" && (r.attempts || []).filter((a) => !a.correct).length >= 3) state = "wrong_repeat";
    map[r.topicId] = state;
  }
  return map;
}

// ── Recommended next (3 topics from adaptive engine) ─────────────────
export async function getRecommendedTopics(userId, subject = "Math", grade = "10") {
  const ncSubj = ncertSubject(subject);
  const userBoard = await getBoardForUser(userId);
  const masteryMap = await getTopicMasteryMap(userId);
  const allTopics = await NcertTopicContent.find({ subject: ncSubj, ...boardIdFilter(userBoard) }).select("topicId name chapterNumber prerequisite_knowledge").lean();
  if (!allTopics.length) return [];

  // Find topics user has wrong-attempts on (highest priority)
  const wrongTopicIds = Object.entries(masteryMap).filter(([, s]) => s === "wrong_repeat" || s === "in_progress").map(([id]) => id);
  const out = [];
  // 1. Wrong-repeat first
  for (const t of allTopics) {
    if (out.length >= 3) break;
    if (wrongTopicIds.includes(t.topicId)) {
      out.push({ topicId: t.topicId, name: t.name, chapterNumber: t.chapterNumber, reason: "Frequently wrong — worth a refresh" });
    }
  }
  // 2. First not-started chapter to push forward
  for (const t of allTopics) {
    if (out.length >= 3) break;
    if (!masteryMap[t.topicId] && !out.find((o) => o.topicId === t.topicId)) {
      out.push({ topicId: t.topicId, name: t.name, chapterNumber: t.chapterNumber, reason: "Next in your syllabus" });
    }
  }
  return out.slice(0, 3);
}

// ── Per-chapter meta (the big aggregator) ────────────────────────────
export async function getChaptersMeta(subject = "Math", grade = "10", userId = null) {
  const ncSubj = ncertSubject(subject);
  const userBoard = await getBoardForUser(userId);
  const topics = await NcertTopicContent.find({ subject: ncSubj, ...boardIdFilter(userBoard) }).select("topicId name chapterNumber prerequisite_knowledge teaching_content updatedAt").lean();
  if (!topics.length) return [];

  // Math grade filter (matches Lessons.jsx)
  const filtered = subject === "Math" && grade
    ? (() => {
        const prefix = `math${grade}_`;
        const isPrefixed = (t) => /^math\d+_/.test(t.topicId || "");
        if (userBoard === "ICSE") return topics; // ICSE topics already board-filtered above
        if (grade === "10") return topics.filter((t) => !isPrefixed(t));
        return topics.filter((t) => (t.topicId || "").startsWith(prefix));
      })()
    : topics;

  // PYQ count per chapter (board-scoped via examBoard field)
  const pyqRows = await Question.aggregate([
    { $match: { subject: ncSubj, grade, isPYQ: true, ...questionBoardFilter(userBoard) } },
    { $group: { _id: "$chapterNumber", count: { $sum: 1 } } },
  ]);
  const pyqMap = {};
  for (const r of pyqRows) pyqMap[r._id] = r.count;

  // User mastery map (only if userId provided)
  const masteryMap = userId ? await getTopicMasteryMap(userId) : {};
  // User-marked studied topics (counts as mastered for chapter progress)
  const studiedSet = userId
    ? new Set((await User.findById(userId).select("studiedNcertTopics").lean())?.studiedNcertTopics || [])
    : new Set();

  // Group topics by chapter
  const groups = {};
  for (const t of filtered) {
    if (!groups[t.chapterNumber]) groups[t.chapterNumber] = [];
    groups[t.chapterNumber].push(t);
  }

  const totalChapters = Object.keys(groups).length;
  const fallbackWeight = totalChapters ? Math.round(100 / totalChapters) : 0;
  const weights = EXAM_WEIGHTS[ncSubj] || {};

  return Object.entries(groups).map(([chNum, tps]) => {
    const ch = parseInt(chNum, 10);
    const topicCount = tps.length;
    let mastered = 0, inProgress = 0;
    const prereqs = new Set();
    let hasVideo = false, hasDiagram = false, hasFormula = false;
    let newestUpdate = null;

    for (const t of tps) {
      const state = masteryMap[t.topicId];
      const isStudied = studiedSet.has(t.topicId);
      if (state === "mastered" || isStudied) mastered++;
      else if (state === "in_progress" || state === "wrong_repeat") inProgress++;
      (t.prerequisite_knowledge || []).forEach((p) => prereqs.add(p));
      const tc = t.teaching_content || {};
      if (tc.video || tc.videoUrl)            hasVideo = true;
      if (tc.diagram || tc.diagrams || tc.diagram_description) hasDiagram = true;
      if (tc.formulas || tc.key_formulas)     hasFormula = true;
      if (t.updatedAt && (!newestUpdate || new Date(t.updatedAt) > new Date(newestUpdate))) newestUpdate = t.updatedAt;
    }

    // Difficulty heuristic — based on topic count + presence of derivations
    const difficulty = topicCount > 8 ? "hard" : topicCount > 4 ? "medium" : "easy";
    // Estimate ~5 min per topic (matches typical short-lesson estimate)
    const estimatedMinutes = topicCount * 5;
    const examWeight = weights[ch] || fallbackWeight;
    const pyqCount = pyqMap[ch] || 0;
    const isNew = newestUpdate && (Date.now() - new Date(newestUpdate).getTime()) < 30 * 24 * 60 * 60 * 1000;

    const progressPct = topicCount ? Math.round((mastered / topicCount) * 100) : 0;

    return {
      chapterNumber: ch,
      topicCount,
      mastered,
      inProgress,
      progressPct,
      estimatedMinutes,
      difficulty,
      examWeight,
      pyqCount,
      hasVideo, hasDiagram, hasFormula,
      prereqs: [...prereqs].slice(0, 3),
      isNew,
      lastUpdated: newestUpdate,
    };
  }).sort((a, b) => a.chapterNumber - b.chapterNumber);
}

// ── Quick pre-lesson diagnostic (3 questions) ─────────────────────────
export async function getDiagnostic(topicId, userId = null, limit = 3) {
  // Board access guard: ICSE topicId only for ICSE users, and vice versa
  const userBoard = await getBoardForUser(userId);
  const topicIsIcse = isIcseTopicId(topicId);
  if (topicIsIcse && userBoard !== "ICSE") return [];
  if (!topicIsIcse && userBoard === "ICSE") return [];

  const qs = await Question.find({ topicId, deletedAt: null, "options.0": { $exists: true } })
    .select("questionText options difficulty conceptTested")
    .limit(limit).lean();
  return qs.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    conceptTested: q.conceptTested,
    difficulty: q.difficulty,
    options: (q.options || []).map(({ text, logicTag }) => ({ text, logicTag })),
  }));
}

// ── Universal search across topics + chapters ────────────────────────
export async function searchTopics(q, subject = null, grade = null, userId = null, limit = 12) {
  if (!q || q.trim().length < 2) return [];
  const userBoard = await getBoardForUser(userId);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter = { name: { $regex: escaped, $options: "i" }, ...boardIdFilter(userBoard) };
  if (subject) filter.subject = ncertSubject(subject);
  const topics = await NcertTopicContent.find(filter).select("topicId name subject chapterNumber").limit(limit).lean();
  return topics.map((t) => ({ topicId: t.topicId, name: t.name, subject: t.subject, chapterNumber: t.chapterNumber }));
}

// ── Co-study link (just a token + creator) ──────────────────────────
import crypto from "crypto";
const coStudyTokens = new Map(); // in-memory, 1h TTL — good enough MVP
export function createCoStudyLink(userId, topicId, name) {
  const token = crypto.randomBytes(8).toString("base64url");
  coStudyTokens.set(token, { userId, topicId, name, createdAt: Date.now() });
  // purge old
  for (const [k, v] of coStudyTokens.entries()) {
    if (Date.now() - v.createdAt > 60 * 60 * 1000) coStudyTokens.delete(k);
  }
  return token;
}
export function readCoStudyLink(token) {
  return coStudyTokens.get(token) || null;
}
