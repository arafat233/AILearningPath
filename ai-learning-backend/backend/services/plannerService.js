import { UserProfile, Topic } from "../models/index.js";

// Goal-based priority weights:
// pass        → heavily favour high-frequency topics, skip hard low-freq ones
// distinction → balanced (default)
// top         → push accuracy improvement, cover everything
// scholarship → maximise all areas, no skipping
const GOAL_WEIGHTS = {
  pass:        { freq: 0.65, weak: 0.25, accuracy: 0.10 },
  distinction: { freq: 0.50, weak: 0.30, accuracy: 0.20 },
  top:         { freq: 0.30, weak: 0.30, accuracy: 0.40 },
  scholarship: { freq: 0.20, weak: 0.40, accuracy: 0.40 },
};

export const generateStudyPlan = async (userId, examDate, goal = "distinction", customTopicOrder = []) => {
  const profile = await UserProfile.findOne({ userId });
  const topics = await Topic.find();

  const daysLeft = Math.max(
    1,
    Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
  );

  const weakAreas = profile?.weakAreas || [];
  const w = GOAL_WEIGHTS[goal] || GOAL_WEIGHTS.distinction;

  // Score each topic by priority
  const prioritized = topics.map((t) => {
    const isWeak = weakAreas.includes(t.name);
    const topicProgress = profile?.topicProgress?.find((p) => p.topic === t.name);
    const accuracy = topicProgress?.accuracy || 0;

    const priority =
      t.examFrequency * w.freq +
      (isWeak ? w.weak : 0) +
      (1 - accuracy) * w.accuracy;

    return {
      topic: t.name,
      priority: parseFloat(priority.toFixed(3)),
      examFrequency: t.examFrequency,
      estimatedHours: t.estimatedHours,
      examMarks: t.examMarks || 5,
      whyMatters: t.whyMatters || "",
      isWeak,
      accuracy,
    };
  });

  prioritized.sort((a, b) => b.priority - a.priority);

  // Apply custom topic order if the user has set one
  if (customTopicOrder.length > 0) {
    const orderMap = new Map(customTopicOrder.map((t, i) => [t, i]));
    prioritized.sort((a, b) => {
      const ai = orderMap.has(a.topic) ? orderMap.get(a.topic) : Infinity;
      const bi = orderMap.has(b.topic) ? orderMap.get(b.topic) : Infinity;
      if (ai !== bi) return ai - bi;
      return b.priority - a.priority; // tie-break by AI score
    });
  }

  // Skip suggestions — suppressed for top/scholarship goals (cover everything)
  const canSkip = goal === "pass" || goal === "distinction";
  const skipSuggestions = canSkip
    ? prioritized
        .filter((t) => t.examFrequency < 0.3 && t.isWeak && t.estimatedHours > 3)
        .map((t) => ({
          topic: t.topic,
          effort: `~${t.estimatedHours} hours`,
          marksLost: Math.round(t.examFrequency * 15),
          reason: "Low exam weight + high effort. Consider skipping to save time.",
        }))
    : [];

  // Build daily plan
  const dailyPlan = [];
  const topicsToStudy = prioritized.filter(
    (t) => !skipSuggestions.find((s) => s.topic === t.topic)
  );

  let day = 1;
  let hoursToday = 0;
  let todayTopics = [];

  for (const t of topicsToStudy) {
    if (day > daysLeft) break;
    if (hoursToday + t.estimatedHours > 4) {
      if (todayTopics.length) {
        dailyPlan.push({ day, topics: [...todayTopics], estimatedHours: hoursToday });
      }
      day++;
      hoursToday = 0;
      todayTopics = [];
    }
    todayTopics.push(t.topic);
    hoursToday += t.estimatedHours;
  }
  if (todayTopics.length) {
    dailyPlan.push({ day, topics: todayTopics, estimatedHours: hoursToday });
  }

  return {
    daysLeft,
    goal,
    dailyPlan: dailyPlan.slice(0, 30), // cap at 30 days
    priorityTopics: prioritized.slice(0, 5),
    skipSuggestions,
  };
};
