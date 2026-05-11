import { User, UserProfile, Attempt, Streak } from "../models/index.js";
import { MoodCheckin } from "../models/profileV2Models.js";
import { AppError } from "../utils/AppError.js";

const SUBJECTS = ["Math", "Science", "English", "Social Science", "Hindi"];

const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

async function ensureLinked(parentId, childId) {
  const parent = await User.findById(parentId).select("linkedStudents").lean();
  if (!parent?.linkedStudents?.map(String).includes(String(childId))) {
    throw new AppError("Not linked to this student", 403);
  }
}

// ── One-shot dashboard for the mockup view ───────────────────────────
export async function getParentDashboard(parentId, childId) {
  await ensureLinked(parentId, childId);
  const child = await User.findById(childId).select("name grade subject examDate examBoard parentalControls").lean();
  if (!child) throw new AppError("Student not found", 404);

  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 86400000);
  const twoWeeksAgo = new Date(now - 14 * 86400000);
  const eightWeeksAgo = new Date(now - 56 * 86400000);

  const [profile, weekAttempts, prevWeekAttempts, trendAttempts, mood, streak] = await Promise.all([
    UserProfile.findOne({ userId: childId }).lean(),
    Attempt.find({ userId: childId, createdAt: { $gte: oneWeekAgo } }).select("topic isCorrect timeTaken createdAt").lean(),
    Attempt.find({ userId: childId, createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } }).select("timeTaken").lean(),
    Attempt.find({ userId: childId, createdAt: { $gte: eightWeeksAgo } }).select("createdAt isCorrect").lean(),
    MoodCheckin.find({ userId: childId, createdAt: { $gte: oneWeekAgo } }).lean(),
    Streak.findOne({ userId: childId }).lean(),
  ]);

  // Hours this week (sum of timeTaken across attempts)
  const minThisWeek = weekAttempts.reduce((s, a) => s + (a.timeTaken || 0), 0) / 60;
  const minPrevWeek = prevWeekAttempts.reduce((s, a) => s + (a.timeTaken || 0), 0) / 60;
  const hoursThisWeek = parseFloat((minThisWeek / 60).toFixed(1));
  const hoursDelta    = parseFloat(((minThisWeek - minPrevWeek) / 60).toFixed(1));

  // Daily study time — last 7 days bar chart
  const dailyStudyTime = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    const dayMin = weekAttempts
      .filter((a) => new Date(a.createdAt).toISOString().slice(0, 10) === dayKey)
      .reduce((s, a) => s + (a.timeTaken || 0), 0) / 60;
    dailyStudyTime.push({
      date: dayKey,
      label: DAYS_SHORT[d.getDay()],
      minutes: Math.round(dayMin),
      isToday: i === 0,
    });
  }

  // Mastery by subject — from topicProgress
  const tp = profile?.topicProgress || [];
  const masteryBySubject = SUBJECTS.map((subj) => {
    // Heuristic: avg accuracy across all topics mapped to subject by topic name
    const subjTopics = tp.filter((t) => topicSubjectMatch(t.topic, subj));
    if (!subjTopics.length) return { subject: subj, pct: null };
    const pct = Math.round(subjTopics.reduce((s, t) => s + (t.accuracy || 0), 0) / subjTopics.length * 100);
    return { subject: subj, pct };
  });

  // Concept mastery — pct of topics where accuracy >= 70
  const masteredCount = tp.filter((t) => (t.accuracy || 0) >= 0.7).length;
  const conceptMasteryPct = tp.length ? Math.round((masteredCount / tp.length) * 100) : null;

  // Predicted score (rough — uses overall accuracy * 100, with margin)
  const overallAccuracy = profile?.accuracy || 0;
  const predictedScore = Math.round(overallAccuracy * 100);
  const predictedMargin = 4;

  // Concerns — system-flagged
  const concerns = [];
  if (overallAccuracy < 0.4 && (profile?.totalAttempts || 0) > 20) concerns.push({ id: "low_accuracy", message: `Overall accuracy is ${Math.round(overallAccuracy * 100)}%`, severity: "high" });
  if (streak?.currentStreak === 0 && (profile?.totalAttempts || 0) > 30) concerns.push({ id: "broken_streak", message: "Streak broken — no practice in 2+ days", severity: "medium" });
  const lowMoodCount = mood.filter((m) => m.mood === "low").length;
  if (lowMoodCount >= 3) concerns.push({ id: "mood_low", message: `Reported low mood ${lowMoodCount}× this week`, severity: "high" });
  const skippedDays = dailyStudyTime.filter((d) => d.minutes === 0 && !d.isToday).length;
  if (skippedDays >= 4) concerns.push({ id: "low_engagement", message: `${skippedDays} days with no study time this week`, severity: "medium" });

  // 8-week trend
  const trendByWeek = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(now - (i + 1) * 7 * 86400000);
    const end   = new Date(now - i * 7 * 86400000);
    const wk = trendAttempts.filter((a) => new Date(a.createdAt) >= start && new Date(a.createdAt) < end);
    const correct = wk.filter((a) => a.isCorrect).length;
    trendByWeek.push({
      weekStart: start.toISOString().slice(0, 10),
      accuracy: wk.length ? Math.round((correct / wk.length) * 100) : null,
      attempts: wk.length,
    });
  }

  // Time-of-day pattern
  const hourBuckets = {};
  for (const a of weekAttempts) {
    const h = new Date(a.createdAt).getHours();
    const bucket = Math.floor(h / 3) * 3;
    hourBuckets[bucket] = (hourBuckets[bucket] || 0) + (a.timeTaken || 0) / 60;
  }
  const timeOfDay = Object.entries(hourBuckets).map(([h, m]) => ({ hour: parseInt(h), minutes: Math.round(m) }));

  // Aria's week — top events with type + color hint
  const ariaNotes = await buildAriaNotes(childId, weekAttempts, profile);

  return {
    child: {
      _id: String(child._id),
      name: child.name,
      grade: child.grade,
      examBoard: child.examBoard,
      examDate: child.examDate,
    },
    hours: {
      thisWeek: hoursThisWeek,
      delta: hoursDelta,
    },
    predicted: {
      score: predictedScore,
      margin: predictedMargin,
    },
    conceptMastery: {
      pct: conceptMasteryPct,
      subjectCount: SUBJECTS.length,
    },
    concerns,
    dailyStudyTime,
    masteryBySubject,
    trendByWeek,
    timeOfDay,
    moodHistory: mood.map((m) => ({ date: m.date, mood: m.mood })),
    ariaNotes,
    parentalControls: child.parentalControls || {},
  };
}

function topicSubjectMatch(topic, subject) {
  if (!topic) return false;
  const s = topic.toLowerCase();
  if (subject === "Math")            return /math|polynomi|quadrati|trig|geometr|algebra|statisti|probabil|number|fraction|integer|equation|circle|coordinate|arithmetic/.test(s);
  if (subject === "Science")         return /scien|electr|chem|biolog|physic|reflect|light|reaction|life|magnet|energy|acid|base|metal|carbon/.test(s);
  if (subject === "English")         return /english|essay|tense|grammar|comprehens|reading|writing|story|verb|narrative/.test(s);
  if (subject === "Social Science")  return /social|civic|geogra|histor|economi|polit|nationalism|federali|democra|globali|resource/.test(s);
  if (subject === "Hindi")           return /hindi|vyakar|kavita|patra|nibandh/.test(s);
  return false;
}

async function buildAriaNotes(childId, weekAttempts, profile) {
  const notes = [];

  // Group attempts by day, topic
  const byDayTopic = {};
  for (const a of weekAttempts) {
    const key = `${new Date(a.createdAt).toISOString().slice(0, 10)}::${a.topic || "general"}`;
    if (!byDayTopic[key]) byDayTopic[key] = { at: a.createdAt, topic: a.topic, attempts: [], correct: 0, total: 0 };
    byDayTopic[key].attempts.push(a);
    byDayTopic[key].total++;
    if (a.isCorrect) byDayTopic[key].correct++;
  }

  for (const k of Object.keys(byDayTopic)) {
    const g = byDayTopic[k];
    if (g.total < 5) continue;
    const acc = g.correct / g.total;
    let dot = "blue", msg = "";
    if (acc >= 0.75) {
      dot = "green";
      msg = `Cleared ${g.correct}/${g.total} on ${g.topic}.${acc >= 0.9 ? "" : " Strong performance."}`;
    } else if (acc < 0.4) {
      dot = "red";
      msg = `Struggled on ${g.topic} — ${g.correct}/${g.total}. Worth a check-in.`;
    } else {
      dot = "orange";
      msg = `Mixed results on ${g.topic} — ${g.correct}/${g.total}.`;
    }
    notes.push({ at: g.at, dot, message: msg });
  }

  // Sort newest first, cap at 6
  notes.sort((a, b) => new Date(b.at) - new Date(a.at));
  return notes.slice(0, 6);
}

// ── Parental controls update ──────────────────────────────────────
export async function updateParentalControls(parentId, childId, patch) {
  await ensureLinked(parentId, childId);
  const set = {};
  if (patch.screenTimeCapMin   != null) set["parentalControls.screenTimeCapMin"]   = patch.screenTimeCapMin;
  if (patch.pauseAI            != null) set["parentalControls.pauseAI"]            = !!patch.pauseAI;
  if (patch.quietHours)                 set["parentalControls.quietHours"]         = patch.quietHours;
  if (patch.approveAIThreads   != null) set["parentalControls.approveAIThreads"]   = !!patch.approveAIThreads;
  if (patch.vacationMode       != null) set["parentalControls.vacationMode"]       = !!patch.vacationMode;
  await User.findByIdAndUpdate(childId, { $set: set });
  return User.findById(childId).select("parentalControls").lean();
}

// ── Parent message ────────────────────────────────────────────────
export async function sendParentMessage(parentId, childId, message) {
  await ensureLinked(parentId, childId);
  if (!message?.trim()) throw new AppError("Message required", 422);
  const cleaned = String(message).slice(0, 500);
  await User.findByIdAndUpdate(childId, {
    $push: { parentMessages: { from: parentId, message: cleaned, at: new Date() } },
  });
  return { ok: true };
}

// ── Co-sign goal ─────────────────────────────────────────────────
export async function cosignGoal(parentId, childId, goal) {
  await ensureLinked(parentId, childId);
  await User.findByIdAndUpdate(childId, {
    $set: {
      "cosignedGoal.goal": goal,
      "cosignedGoal.parentId": parentId,
      "cosignedGoal.at": new Date(),
    },
  });
  return { ok: true };
}
