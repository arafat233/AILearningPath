import { UserProfile, Topic } from "../models/index.js";
import { getCachedBoard } from "./adaptiveService.js";

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

export const generateStudyPlan = async (userId, opts) => {
  const {
    examDate,
    goal             = "distinction",
    customTopicOrder = [],
    subjects         = ["Math"],
    grade            = "10",
    hoursPerDay      = 2,
    offDays          = [],
    topicFilter      = [],
  } = opts;

  const subjectList = Array.isArray(subjects) ? subjects : [subjects];
  const [board, profile] = await Promise.all([
    getCachedBoard(userId),
    UserProfile.findOne({ userId }).lean(),
  ]);
  const allTopics = await Topic.find({ subject: { $in: subjectList }, grade, examBoard: board }).lean();
  const topics      = topicFilter.length > 0
    ? allTopics.filter(t => topicFilter.includes(t.name))
    : allTopics;

  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const examDt = new Date(examDate);
  const daysLeft = Math.max(1, Math.ceil((examDt - today) / 86400000));

  // Build study dates, skipping off-days
  const offDayKeys = new Set((offDays || []).map(d => new Date(d).toISOString().split("T")[0]));
  const studyDates = [];
  for (let i = 0; i < daysLeft; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    if (!offDayKeys.has(d.toISOString().split("T")[0])) studyDates.push(d);
  }
  const totalStudyDays = studyDates.length;

  const weakAreas = profile?.weakAreas || [];
  const w = GOAL_WEIGHTS[goal] || GOAL_WEIGHTS.distinction;

  const scored = topics.map(t => {
    const isWeak   = weakAreas.includes(t.name);
    const tp       = profile?.topicProgress?.find(p => p.topic === t.name);
    const accuracy = tp?.accuracy || 0;
    const freq     = t.examFrequency || 0.5;
    const priority = w.freq * freq + w.weak * (isWeak ? 1 : 0) + w.accuracy * (1 - accuracy);
    return { topic: t.name, priority: parseFloat(priority.toFixed(3)), examFrequency: freq, estimatedHours: t.estimatedHours || 2, examMarks: t.examMarks || 5, isWeak, accuracy };
  });

  scored.sort((a, b) => b.priority - a.priority);

  if (customTopicOrder.length > 0) {
    const idxMap = new Map(customTopicOrder.map((n, i) => [n, i]));
    scored.sort((a, b) => {
      const ai = idxMap.has(a.topic) ? idxMap.get(a.topic) : Infinity;
      const bi = idxMap.has(b.topic) ? idxMap.get(b.topic) : Infinity;
      return ai !== bi ? ai - bi : b.priority - a.priority;
    });
  }

  // Mock test day indices: every 14 study days after foundation phase
  const foundationEnd = Math.floor(totalStudyDays * 0.4);
  const mockDaySet = new Set();
  for (let i = foundationEnd + 13; i < totalStudyDays; i += 14) mockDaySet.add(i);

  const dailyPlan = [];
  let topicPtr = 0, dayNum = 1;

  for (let i = 0; i < studyDates.length; i++) {
    const phase = phaseOf(i, totalStudyDays);
    if (mockDaySet.has(i)) {
      dailyPlan.push({ day: dayNum++, date: studyDates[i], topics: ["Mock Test"], estimatedHours: hoursPerDay, completed: false, isMockTest: true, phase, note: "" });
      continue;
    }
    const dayTopics = [];
    let hoursUsed   = 0;
    while (topicPtr < scored.length && hoursUsed < hoursPerDay) {
      dayTopics.push(scored[topicPtr].topic);
      hoursUsed += scored[topicPtr].estimatedHours;
      topicPtr++;
    }
    if (dayTopics.length === 0) break;
    dailyPlan.push({ day: dayNum++, date: studyDates[i], topics: dayTopics, estimatedHours: parseFloat(Math.min(hoursUsed, hoursPerDay + 2).toFixed(1)), completed: false, isMockTest: false, phase, note: "" });
  }

  const priorityTopics = scored.slice(0, 10).map(t => ({
    topic: t.topic, priority: t.priority, isWeak: t.isWeak,
    reason: t.isWeak ? "Weak area" : t.examFrequency > 0.7 ? "High exam frequency" : "Priority topic",
  }));

  const canSkip = goal === "pass" || goal === "distinction";
  const skipSuggestions = canSkip
    ? scored.filter(t => t.examFrequency < 0.3 && !t.isWeak && t.estimatedHours > 3).slice(0, 5).map(t => ({
        topic: t.topic, effort: `~${t.estimatedHours}h`, marksLost: Math.round(t.examFrequency * 15),
        reason: "Low exam weight + high effort. Consider skipping to save time.",
      }))
    : [];

  const topicAccuracy = {};
  (profile?.topicProgress || []).forEach(tp => { topicAccuracy[tp.topic] = Math.round((tp.accuracy || 0) * 100); });

  return { dailyPlan, priorityTopics, skipSuggestions, topicAccuracy, daysLeft, goal };
};
