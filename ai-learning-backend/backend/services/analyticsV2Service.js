import { Attempt, Question, User, UserProfile, ErrorMemory, UserTopicMastery } from "../models/index.js";
import { ExamAttempt } from "../models/index.js";
import { ErrorLabel, SkipReason } from "../models/practiceFeedbackModels.js";
import { BookmarkReview } from "../models/bookmarkModels.js";
import { LessonProgress } from "../models/lessonModel.js";

// Persona name + tagline based on UserProfile.thinkingProfile
const PERSONA = {
  "Deep Thinker":     { name: "The Deep Thinker.",   tagline: "You linger over each question. You're rarely wrong because of speed — but you sometimes second-guess answers you got right the first time." },
  "Pattern Recognizer":{ name: "The Pattern Spotter.", tagline: "You see structure fast and exploit it. You move quick and trust your instincts — sometimes too soon." },
  "Surface Learner":  { name: "The Surface Learner.", tagline: "You hit the basics well, but tricky variations catch you out. Depth, not breadth, is what's missing." },
  "Overthinker":      { name: "The Overthinker.",     tagline: "You know more than you give yourself credit for. Your accuracy on 'unsure' answers is high — trust your gut sooner." },
  "Guesser":          { name: "The Guesser.",         tagline: "You move fast, sometimes faster than the math. Slow down on the parts you 'kind of remember.'" },
  "Unclassified":     { name: "Just getting started.","tagline": "Practice 10+ questions to unlock your thinking persona." },
};

// ── Subject scope helper ───────────────────────────────────────────
async function attemptsFor(userId, subject = null, days = null) {
  const filter = { userId };
  if (days) filter.createdAt = { $gte: new Date(Date.now() - days * 86400000) };

  if (subject) {
    // Lookup question subjects
    const ats = await Attempt.find(filter).lean();
    if (!ats.length) return [];
    const qIds = [...new Set(ats.map((a) => a.questionId).filter(Boolean))];
    const qs = await Question.find({ $or: [
      { _id: { $in: qIds.filter((x) => /^[a-f\d]{24}$/i.test(x)) } },
      { questionId: { $in: qIds } },
    ] }).select("_id questionId subject chapterNumber topicId topic difficulty questionType isPYQ").lean();
    const qMap = {};
    for (const q of qs) {
      if (q.questionId) qMap[q.questionId] = q;
      if (q._id) qMap[String(q._id)] = q;
    }
    return ats.filter((a) => qMap[a.questionId]?.subject === subject)
      .map((a) => ({ ...a, q: qMap[a.questionId] || {} }));
  }
  return Attempt.find(filter).lean();
}

// ── 1. Radar (5 axes) + peer band ─────────────────────────────────
export async function getRadar(userId, subject = null) {
  const profile = await UserProfile.findOne({ userId }).lean() || {};
  const ats = await attemptsFor(userId, subject);
  if (!ats.length) return null;

  const correct = ats.filter((a) => a.isCorrect).length;
  const accuracy = correct / ats.length;
  const avgTime = ats.reduce((s, a) => s + (a.timeTaken || 0), 0) / ats.length;

  // Depth: accuracy on hard questions
  const hard = ats.filter((a) => (a.q?.difficulty === "hard") || (a.difficulty || 0) > 0.7);
  const depth = hard.length ? Math.round((hard.filter((a) => a.isCorrect).length / hard.length) * 100) : Math.round(accuracy * 80);

  // Speed: inverse-normalized avg time vs expected; faster than 60s = high
  const speed = Math.max(20, Math.min(100, Math.round((60 / Math.max(avgTime, 5)) * 80)));

  // Pattern: streak of consecutive correct (max recent run / 5 normalized)
  let maxRun = 0, run = 0;
  for (const a of ats) { if (a.isCorrect) { run++; maxRun = Math.max(maxRun, run); } else run = 0; }
  const pattern = Math.min(100, Math.round((maxRun / 8) * 100));

  // Recall: revisit accuracy — accuracy on questions seen >once
  const seen = {};
  for (const a of ats) seen[a.questionId] = (seen[a.questionId] || 0) + 1;
  const repeats = ats.filter((a) => seen[a.questionId] > 1);
  const recall = repeats.length
    ? Math.round((repeats.filter((a) => a.isCorrect).length / repeats.length) * 100)
    : Math.round(accuracy * 100);

  // Calibration: overconfidence vs underconfidence balance
  const cha = profile.confidenceAccuracy || {};
  const total = ats.length;
  const overconf = (cha.highConfidenceWrong || 0) / Math.max(total, 1);
  const underconf = (cha.lowConfidenceRight || 0) / Math.max(total, 1);
  const calibration = Math.max(20, Math.round(100 - (overconf + underconf) * 100));

  const me = { depth, speed, pattern, recall, calibration };

  // Peer band: median across all profiles for the same grade
  const me2 = await User.findById(userId).select("grade").lean();
  const peers = await UserProfile.aggregate([
    { $match: { userId: { $ne: userId }, totalAttempts: { $gte: 10 } } },
    { $project: { accuracy: 1 } },
    { $limit: 500 },
  ]);
  const peerAcc = peers.length ? peers.reduce((s, p) => s + (p.accuracy || 0), 0) / peers.length : 0.6;
  const peer = {
    depth: Math.round(peerAcc * 70),
    speed: 60,
    pattern: 55,
    recall: Math.round(peerAcc * 100),
    calibration: 70,
  };

  return { me, peer };
}

// ── Persona ────────────────────────────────────────────────────────
export async function getPersona(userId) {
  const p = await UserProfile.findOne({ userId }).lean();
  const tp = p?.thinkingProfile || "Unclassified";
  return { thinkingProfile: tp, ...PERSONA[tp] };
}

// ── 2. Predicted score — chapter breakdown + counterfactual ────────
export async function getPredictedBreakdown(userId, subject = "Math") {
  const user = await User.findById(userId).select("grade examDate goal").lean();
  const ats = await attemptsFor(userId, subject);
  if (!ats.length) return { byChapter: [], counterfactual: null };

  const byChap = {};
  for (const a of ats) {
    const ch = a.q?.chapterNumber || 0;
    if (!byChap[ch]) byChap[ch] = { chapter: ch, total: 0, correct: 0, topic: a.topic };
    byChap[ch].total++;
    if (a.isCorrect) byChap[ch].correct++;
  }
  const arr = Object.values(byChap).map((c) => ({
    chapter: c.chapter,
    topic: c.topic,
    accuracy: c.total ? Math.round((c.correct / c.total) * 100) : 0,
    attempts: c.total,
    contribution: c.total ? Math.round(((c.correct / c.total) - 0.6) * 5) : 0, // marks above/below baseline
  }));

  // Counterfactual: top 3 weakest chapters → what if mastered
  const weakest = [...arr].filter((c) => c.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const lift = weakest.reduce((s, w) => s + (90 - w.accuracy) * 0.1, 0); // ~3-4 marks per chapter
  const currentScore = Math.round(arr.reduce((s, c) => s + c.contribution, 0) * 5 + 60);
  const counterfactual = weakest.length ? {
    weakest: weakest.map((w) => w.topic || `Ch ${w.chapter}`),
    currentScore,
    projectedScore: Math.min(100, Math.round(currentScore + lift)),
    hoursNeeded: Math.ceil(lift * 1.2),
  } : null;

  return { byChapter: arr.sort((a, b) => a.chapter - b.chapter), counterfactual };
}

// ── 3. Per-topic mistake fingerprint ───────────────────────────────
export async function getMistakeByTopic(userId, subject = null) {
  const ats = await attemptsFor(userId, subject);
  const wrongByTopic = {};
  for (const a of ats) {
    if (a.isCorrect) continue;
    const topic = a.topic || "Unknown";
    const type = a.selectedType || "concept_error";
    if (!wrongByTopic[topic]) wrongByTopic[topic] = { topic, total: 0, types: {} };
    wrongByTopic[topic].total++;
    wrongByTopic[topic].types[type] = (wrongByTopic[topic].types[type] || 0) + 1;
  }
  return Object.values(wrongByTopic)
    .filter((t) => t.total >= 2)
    .map((t) => ({
      topic: t.topic,
      total: t.total,
      breakdown: Object.entries(t.types)
        .map(([type, count]) => ({ type, count, pct: Math.round((count / t.total) * 100) }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

// ── 4. Time-of-day correlation ────────────────────────────────────
export async function getTimeOfDayCorrelation(userId, subject = null) {
  const ats = await attemptsFor(userId, subject);
  if (ats.length < 10) return null;
  const buckets = {};
  for (const a of ats) {
    const hour = new Date(a.createdAt).getHours();
    const bucket = Math.floor(hour / 3) * 3; // 0-2, 3-5, etc.
    if (!buckets[bucket]) buckets[bucket] = { hour: bucket, total: 0, correct: 0, mistakes: {} };
    buckets[bucket].total++;
    if (a.isCorrect) buckets[bucket].correct++;
    else {
      const t = a.selectedType || "concept_error";
      buckets[bucket].mistakes[t] = (buckets[bucket].mistakes[t] || 0) + 1;
    }
  }
  return Object.values(buckets).map((b) => ({
    hour: b.hour,
    total: b.total,
    accuracy: b.total ? Math.round((b.correct / b.total) * 100) : 0,
    topMistake: Object.entries(b.mistakes).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
  })).sort((a, b) => a.hour - b.hour);
}

// ── 5. Calibration curve ──────────────────────────────────────────
export async function getCalibrationCurve(userId, subject = null) {
  const ats = await attemptsFor(userId, subject);
  if (ats.length < 5) return null;
  const buckets = { low: { stated: 33, total: 0, correct: 0 }, medium: { stated: 67, total: 0, correct: 0 }, high: { stated: 95, total: 0, correct: 0 } };
  for (const a of ats) {
    const c = a.confidence || "medium";
    if (!buckets[c]) continue;
    buckets[c].total++;
    if (a.isCorrect) buckets[c].correct++;
  }
  return Object.entries(buckets).map(([k, b]) => ({
    confidence: k,
    stated: b.stated,
    actual: b.total ? Math.round((b.correct / b.total) * 100) : null,
    count: b.total,
  })).filter((b) => b.actual != null);
}

// ── 6. This week chart (matches mockup) ───────────────────────────
export async function getThisWeek(userId, subject = null) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  const ats = await attemptsFor(userId, subject, 7);
  const byDay = Array(7).fill(null).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, dayLabel: ["S","M","T","W","T","F","S"][d.getDay()], count: 0, minutes: 0 };
  });
  for (const a of ats) {
    const key = new Date(a.createdAt).toISOString().slice(0, 10);
    const cell = byDay.find((b) => b.date === key);
    if (cell) { cell.count++; cell.minutes += Math.round((a.timeTaken || 60) / 60); }
  }
  const activeDays = byDay.filter((b) => b.count > 0).length;
  const totalMinutes = byDay.reduce((s, b) => s + b.minutes, 0);

  // WoW change vs prior 7 days
  const priorAts = (await Attempt.find({
    userId,
    createdAt: { $gte: new Date(Date.now() - 14 * 86400000), $lt: new Date(Date.now() - 7 * 86400000) },
  }).lean()).length;
  const wow = priorAts ? Math.round(((ats.length - priorAts) / priorAts) * 100) : null;

  return { byDay, activeDays, totalMinutes, wow };
}

// ── 7. Topic mastery heatmap ──────────────────────────────────────
export async function getTopicHeatmap(userId, subject = null) {
  const masteryRows = await UserTopicMastery.find({ userId }).lean();
  const map = masteryRows.map((r) => ({
    topicId: r.topicId,
    chapterNumber: r.chapterNumber,
    state: r.mastery?.hard ? "mastered" : r.mastery?.medium || r.mastery?.easy ? "in_progress" : "not_started",
  }));
  return map;
}

// ── 8. Question-type breakdown ────────────────────────────────────
export async function getQuestionTypeBreakdown(userId, subject = null) {
  const ats = await attemptsFor(userId, subject);
  const types = {};
  for (const a of ats) {
    const qt = a.q?.questionType || "mcq";
    if (!types[qt]) types[qt] = { total: 0, correct: 0 };
    types[qt].total++;
    if (a.isCorrect) types[qt].correct++;
  }
  return Object.entries(types).map(([type, t]) => ({
    type,
    total: t.total,
    accuracy: t.total ? Math.round((t.correct / t.total) * 100) : 0,
  })).sort((a, b) => b.total - a.total);
}

// ── 9. Difficulty distribution ────────────────────────────────────
export async function getDifficultyDistribution(userId, subject = null, days = 30) {
  const ats = await attemptsFor(userId, subject, days);
  const buckets = { easy: { total: 0, correct: 0 }, medium: { total: 0, correct: 0 }, hard: { total: 0, correct: 0 } };
  for (const a of ats) {
    const d = a.q?.difficulty || (a.difficulty < 0.4 ? "easy" : a.difficulty < 0.7 ? "medium" : "hard");
    if (!buckets[d]) continue;
    buckets[d].total++;
    if (a.isCorrect) buckets[d].correct++;
  }
  return Object.entries(buckets).map(([level, b]) => ({
    level,
    total: b.total,
    accuracy: b.total ? Math.round((b.correct / b.total) * 100) : 0,
  }));
}

// ── 10. Re-test recommendations (SM-2 due) ────────────────────────
export async function getRetestRecs(userId) {
  const due = await BookmarkReview.find({ userId, mastered: false, dueAt: { $lte: new Date() } })
    .sort({ dueAt: 1 }).limit(5).lean();
  return due.map((r) => ({
    questionId: r.questionId,
    lastReviewedAt: r.lastReviewedAt,
    intervalDays: r.intervalDays,
    wrongCount: r.wrongCount,
  }));
}

// ── 11. Mock-paper readiness ──────────────────────────────────────
export async function getMockPaperReadiness(userId) {
  const exams = await ExamAttempt.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
  if (!exams.length) return null;
  const last = exams[0];
  const sectionScores = {
    "VSA":   { correct: 0, total: 0 },
    "SA-I":  { correct: 0, total: 0 },
    "SA-II": { correct: 0, total: 0 },
    "LA":    { correct: 0, total: 0 },
    "Case":  { correct: 0, total: 0 },
  };
  // Mock data — distribute attempts across sections
  for (const ans of last.answers || []) {
    const section = ans.marksAwarded > 4 ? "LA" : ans.marksAwarded > 2 ? "SA-II" : ans.marksAwarded > 1 ? "SA-I" : "VSA";
    sectionScores[section].total++;
    if (ans.isCorrect) sectionScores[section].correct++;
  }
  return {
    lastScore: last.normalizedScore,
    history: exams.slice(0, 10).reverse().map((e) => ({ score: e.normalizedScore, date: e.createdAt })),
    sections: Object.entries(sectionScores).map(([name, s]) => ({
      name,
      readiness: s.total ? Math.round((s.correct / s.total) * 100) : 0,
    })),
  };
}

// ── 12. Anomaly + intervention detector ───────────────────────────
export async function getAnomalies(userId) {
  const last24 = await Attempt.find({ userId, createdAt: { $gte: new Date(Date.now() - 24 * 86400000 / 24) } }).lean();
  const all = await Attempt.find({ userId }).lean();
  const anomalies = [];
  if (last24.length >= 5 && all.length >= 50) {
    const myAvg = last24.reduce((s, a) => s + (a.timeTaken || 0), 0) / last24.length;
    const histAvg = all.reduce((s, a) => s + (a.timeTaken || 0), 0) / all.length;
    if (myAvg > histAvg * 2.5) {
      anomalies.push({ type: "slow_session", message: `Today's pace is ${Math.round(myAvg / histAvg)}× your usual — distracted? Take a break.` });
    }
    const myAcc = last24.filter((a) => a.isCorrect).length / last24.length;
    const histAcc = all.filter((a) => a.isCorrect).length / all.length;
    if (myAcc < histAcc - 0.2) {
      anomalies.push({ type: "low_accuracy", message: `Accuracy dropped ${Math.round((histAcc - myAcc) * 100)}% today — pause and revisit.` });
    }
  }
  // Intervention triggers — repeated wrong on a topic
  const errs = await ErrorMemory.find({ userId, count: { $gte: 3 } }).sort({ count: -1 }).limit(3).lean();
  for (const e of errs) {
    anomalies.push({ type: "repeat_wrong", message: `${e.count}× ${e.mistakeType.replace(/_/g, " ")} on ${e.topic} — ready for a 10-min refresher?`, topic: e.topic });
  }
  return anomalies;
}

// ── 13. Smart insights feed (Aria-narrated) ───────────────────────
export async function getInsights(userId, subject = null) {
  const insights = [];
  const ats = await attemptsFor(userId, subject);
  const profile = await UserProfile.findOne({ userId }).lean();

  if (ats.length < 10) {
    insights.push({ icon: "✨", text: "Keep practicing — your insights will get sharper after 10+ attempts." });
    return insights;
  }

  // Time-of-day insight
  const byHour = {};
  for (const a of ats) {
    const h = new Date(a.createdAt).getHours();
    if (!byHour[h]) byHour[h] = { total: 0, correct: 0 };
    byHour[h].total++;
    if (a.isCorrect) byHour[h].correct++;
  }
  const hours = Object.entries(byHour).filter(([, b]) => b.total >= 3).map(([h, b]) => ({ h: parseInt(h), acc: b.correct / b.total }));
  if (hours.length >= 2) {
    const best = hours.reduce((a, b) => a.acc > b.acc ? a : b);
    const overall = ats.filter((a) => a.isCorrect).length / ats.length;
    if (best.acc > overall + 0.1) {
      insights.push({ icon: "⏰", text: `Your accuracy peaks at ${best.h}:00 (${Math.round(best.acc * 100)}% vs ${Math.round(overall * 100)}% overall). Schedule hard work then.` });
    }
  }

  // Question-length insight
  const longQ = ats.filter((a) => (a.timeTaken || 0) > 90);
  if (longQ.length > 5) {
    const longAcc = longQ.filter((a) => a.isCorrect).length / longQ.length;
    insights.push({ icon: "🐢", text: `On questions taking >1.5 min, you're ${Math.round(longAcc * 100)}% accurate. ${longAcc > 0.7 ? "Worth the patience." : "Try eliminating wrong options first."}` });
  }

  // Bookmark review rate
  const bms = await BookmarkReview.find({ userId }).lean();
  if (bms.length > 5) {
    const reviewed = bms.filter((b) => b.reviewCount > 0).length;
    const rate = Math.round((reviewed / bms.length) * 100);
    insights.push({ icon: "📌", text: `You've reviewed ${rate}% of your saved questions. ${rate < 40 ? "Bookmarks compound when revisited." : "Keep that loop going."}` });
  }

  // Skip-reason insight
  const skips = await SkipReason.find({ userId }).limit(50).lean();
  if (skips.length > 5) {
    const counts = {};
    for (const s of skips) counts[s.reason] = (counts[s.reason] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (top) insights.push({ icon: "⏭", text: `Most common skip reason: ${top[0].replace(/_/g, " ")}. ${top[0] === "dont_know" ? "Foundation gaps showing — try the Brief lesson mode." : ""}` });
  }

  // Confidence calibration
  const cha = profile?.confidenceAccuracy;
  if (cha) {
    if (cha.lowConfidenceRight > 5) insights.push({ icon: "🎯", text: `You got ${cha.lowConfidenceRight} questions right while saying "Unsure" — trust your gut more.` });
    if (cha.highConfidenceWrong > 3) insights.push({ icon: "⚠️", text: `${cha.highConfidenceWrong} questions wrong while highly confident — those are the dangerous ones.` });
  }

  return insights.slice(0, 6);
}

// ── 14. Behaviour fingerprint (matches mockup) ────────────────────
export async function getBehaviourFingerprint(userId, subject = null) {
  const ats = await attemptsFor(userId, subject);
  if (!ats.length) return null;
  const profile = await UserProfile.findOne({ userId }).lean();
  const avgTime = ats.reduce((s, a) => s + (a.timeTaken || 0), 0) / ats.length;
  // Consistency: stddev of accuracy across last 5 sessions
  const sessions = {};
  for (const a of ats) {
    const day = new Date(a.createdAt).toISOString().slice(0, 10);
    if (!sessions[day]) sessions[day] = { total: 0, correct: 0 };
    sessions[day].total++;
    if (a.isCorrect) sessions[day].correct++;
  }
  const accs = Object.values(sessions).filter((s) => s.total >= 3).map((s) => s.correct / s.total);
  const mean = accs.length ? accs.reduce((a, b) => a + b, 0) / accs.length : 0;
  const variance = accs.length ? accs.reduce((s, a) => s + (a - mean) ** 2, 0) / accs.length : 0;
  const consistency = Math.max(0, Math.min(1, 1 - Math.sqrt(variance) * 2));

  const cha = profile?.confidenceAccuracy || {};
  const overconfidence = ats.length ? Math.round((cha.highConfidenceWrong || 0) / ats.length * 100) : 0;
  const underconfidence = ats.length ? Math.round((cha.lowConfidenceRight || 0) / ats.length * 100) : 0;

  return {
    avgTimeSeconds: Math.round(avgTime),
    consistency: Math.round(consistency * 100) / 100,
    overconfidence,
    underconfidence,
  };
}
