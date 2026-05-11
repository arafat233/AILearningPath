import { StudyPlan, UserProfile, Topic, User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

const GOAL_WEIGHTS = {
  pass:        { freq: 0.65, weak: 0.25, accuracy: 0.10 },
  distinction: { freq: 0.50, weak: 0.30, accuracy: 0.20 },
  top:         { freq: 0.30, weak: 0.30, accuracy: 0.40 },
  scholarship: { freq: 0.20, weak: 0.40, accuracy: 0.40 },
};

const phaseOf = (idx, total) => {
  const p = total > 1 ? idx / (total - 1) : 0;
  if (p < 0.40) return "foundation";
  if (p < 0.70) return "practice";
  if (p < 0.90) return "revision";
  return "mock";
};

// ── Smart redistribute (replaces dumb reschedule) ─────────────────
// Re-scores remaining topics with current weak-areas + accuracy data,
// preserves completed days + pinned topics, schedules mock papers,
// and packs days respecting hoursPerDay.
export async function smartRedistribute(userId, { pinnedTopics = [] } = {}) {
  const plan = await StudyPlan.findOne({ userId, isActive: true })
            || await StudyPlan.findOne({ userId }).sort({ createdAt: -1 });
  if (!plan) throw new AppError("No active plan to redistribute", 404);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const examDt = new Date(plan.examDate);
  if (today >= examDt) throw new AppError("Exam date has already passed", 422);

  // Preserve completed days verbatim
  const completedDays = plan.dailyPlan.filter((d) => d.completed);
  // Pull all incomplete topics (excluding mock test placeholders)
  const incompleteTopics = plan.dailyPlan
    .filter((d) => !d.completed)
    .flatMap((d) => (d.topics || []).filter((t) => t !== "Mock Test"));
  const incompleteSet = new Set(incompleteTopics);

  if (incompleteSet.size === 0) {
    return { plan, message: "Nothing to redistribute — all days complete." };
  }

  // Current profile for weak-area + accuracy re-scoring
  const profile = await UserProfile.findOne({ userId }).lean();
  const subjectList = plan.subjects?.length ? plan.subjects : ["Math"];
  const allTopics   = await Topic.find({ name: { $in: [...incompleteSet] } }).lean();

  const weakAreas = new Set(profile?.weakAreas || []);
  const w = GOAL_WEIGHTS[plan.goal] || GOAL_WEIGHTS.distinction;

  const scored = [...incompleteSet].map((name) => {
    const t = allTopics.find((x) => x.name === name) || {};
    const isWeak = weakAreas.has(name);
    const tp = profile?.topicProgress?.find((p) => p.topic === name);
    const accuracy = tp?.accuracy || 0;
    const freq = t.examFrequency ?? 0.5;
    const isPinned = pinnedTopics.includes(name);
    const priority = w.freq * freq + w.weak * (isWeak ? 1 : 0) + w.accuracy * (1 - accuracy) + (isPinned ? 0.5 : 0);
    return {
      topic: name,
      priority: parseFloat(priority.toFixed(3)),
      estimatedHours: t.estimatedHours ?? 2,
      isWeak, isPinned, accuracy,
    };
  });

  // Pinned first (preserve user's manual decisions), then by priority
  scored.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return b.priority - a.priority;
  });

  // Build study dates from tomorrow → exam date, skipping off-days
  const offDayKeys = new Set((plan.offDays || []).map((d) => new Date(d).toISOString().split("T")[0]));
  const studyDates = [];
  for (let i = 1; ; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    if (d >= examDt) break;
    if (!offDayKeys.has(d.toISOString().split("T")[0])) studyDates.push(d);
    if (studyDates.length > 365) break;
  }
  const totalRemainingDays = studyDates.length;
  if (totalRemainingDays === 0) throw new AppError("No study days left before exam", 422);

  // Mock paper schedule — one every 14 days in the last 60% of remaining time
  const mockStartIdx = Math.floor(totalRemainingDays * 0.4);
  const mockDaySet = new Set();
  for (let i = mockStartIdx + 13; i < totalRemainingDays; i += 14) mockDaySet.add(i);

  const hoursPerDay = plan.hoursPerDay || 2;
  let topicPtr = 0;
  const maxCompletedDay = completedDays.length ? Math.max(...completedDays.map((d) => d.day)) : 0;
  let dayNum = maxCompletedDay + 1;
  const newDays = [];

  for (let i = 0; i < studyDates.length && topicPtr < scored.length; i++) {
    const phase = phaseOf(i, totalRemainingDays);
    if (mockDaySet.has(i)) {
      newDays.push({ day: dayNum++, date: studyDates[i], topics: ["Mock Test"], estimatedHours: hoursPerDay, completed: false, isMockTest: true, phase, note: "" });
      continue;
    }
    const dayTopics = [];
    let hours = 0;
    while (topicPtr < scored.length && hours < hoursPerDay) {
      const t = scored[topicPtr];
      dayTopics.push(t.topic);
      hours += t.estimatedHours;
      topicPtr++;
    }
    if (!dayTopics.length) break;
    newDays.push({
      day: dayNum++, date: studyDates[i], topics: dayTopics,
      estimatedHours: parseFloat(Math.min(hours, hoursPerDay + 2).toFixed(1)),
      completed: false, isMockTest: false, phase, note: "",
    });
  }

  // Concat: completed days + new redistributed days
  plan.dailyPlan = [...completedDays.sort((a, b) => a.day - b.day), ...newDays];
  await plan.save();

  // Stats
  const weakIncluded = newDays.flatMap((d) => d.topics).filter((t) => weakAreas.has(t)).length;
  const mockCount    = newDays.filter((d) => d.isMockTest).length;

  return {
    plan,
    message: `Redistributed ${incompleteTopics.length} topics across ${newDays.length} days · prioritized ${weakIncluded} weak-area topics · scheduled ${mockCount} mock papers.`,
    stats: { topicsRedistributed: incompleteTopics.length, weakAreasPrioritized: weakIncluded, mockPapersScheduled: mockCount, daysRemaining: totalRemainingDays },
  };
}

// ── Class stats (real numbers vs hardcoded 2.3) ───────────────────
export async function getClassStats(userId) {
  const me = await User.findById(userId).select("grade").lean();
  if (!me) throw new AppError("User not found", 404);
  // Pull other users' active plans of the same grade
  const peerPlans = await StudyPlan.find({
    userId: { $ne: userId }, grade: me.grade, isActive: true,
  }).select("hoursPerDay dailyPlan").limit(500).lean();

  if (!peerPlans.length) return { peerCount: 0, avgHoursPerDay: null, avgCompletionPct: null };

  const avgHpd = peerPlans.reduce((s, p) => s + (p.hoursPerDay || 2), 0) / peerPlans.length;
  // Per-plan completion rate
  const compRates = peerPlans.map((p) => {
    const days = p.dailyPlan || [];
    const past = days.filter((d) => d.date && new Date(d.date) <= new Date());
    return past.length ? past.filter((d) => d.completed).length / past.length : 0;
  });
  const avgComp = compRates.reduce((a, b) => a + b, 0) / compRates.length;

  return {
    peerCount: peerPlans.length,
    avgHoursPerDay: parseFloat(avgHpd.toFixed(1)),
    avgCompletionPct: Math.round(avgComp * 100),
  };
}
