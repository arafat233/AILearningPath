import { UserProfile, Topic } from "../models/index.js";

export const generateStudyPlan = async (userId, examDate) => {
  const profile = await UserProfile.findOne({ userId });
  const topics = await Topic.find();

  const daysLeft = Math.max(
    1,
    Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
  );

  const weakAreas = profile?.weakAreas || [];

  // Score each topic by priority
  const prioritized = topics.map((t) => {
    const isWeak = weakAreas.includes(t.name);
    const topicProgress = profile?.topicProgress?.find((p) => p.topic === t.name);
    const accuracy = topicProgress?.accuracy || 0;

    const priority =
      t.examFrequency * 0.5 +
      (isWeak ? 0.3 : 0) +
      (1 - accuracy) * 0.2;

    return {
      topic: t.name,
      priority: parseFloat(priority.toFixed(3)),
      examFrequency: t.examFrequency,
      estimatedHours: t.estimatedHours,
      isWeak,
      accuracy,
    };
  });

  prioritized.sort((a, b) => b.priority - a.priority);

  // Skip suggestions: low exam frequency, user is weak, would take a long time
  const skipSuggestions = prioritized
    .filter((t) => t.examFrequency < 0.3 && t.isWeak && t.estimatedHours > 3)
    .map((t) => ({
      topic: t.topic,
      effort: `~${t.estimatedHours} hours`,
      marksLost: Math.round(t.examFrequency * 15), // estimated marks
      reason: "Low exam weight + high effort. Consider skipping to save time.",
    }));

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
    dailyPlan: dailyPlan.slice(0, 30), // cap at 30 days
    priorityTopics: prioritized.slice(0, 5),
    skipSuggestions,
  };
};
