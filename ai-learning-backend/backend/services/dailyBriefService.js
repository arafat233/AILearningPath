import { UserProfile, StudyPlan } from "../models/index.js";
import { getRevisionTopics } from "./revisionService.js";

export const getDailyBrief = async (userId) => {
  const [profile, revisionDue, activePlan] = await Promise.all([
    UserProfile.findOne({ userId }).lean(),
    getRevisionTopics(userId),
    StudyPlan.findOne({ userId, isActive: true }).sort({ createdAt: -1 }).lean(),
  ]);

  // Top 3 weakest topics by accuracy (must have at least 1 attempt)
  const weakTopics = (profile?.topicProgress || [])
    .filter((tp) => (tp.attempts || 0) > 0)
    .sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))
    .slice(0, 3)
    .map((tp) => ({
      topic:    tp.topic,
      accuracy: Math.round((tp.accuracy || 0) * 100),
      attempts: tp.attempts || 0,
    }));

  // Top 3 revision topics due today
  const revisionTop = revisionDue.slice(0, 3).map((r) => ({
    topic:     r.topic,
    daysSince: r.daysSince,
    accuracy:  r.accuracy,
  }));

  // Active plan progress
  let planProgress = null;
  if (activePlan?.dailyPlan?.length) {
    const today         = new Date().toISOString().split("T")[0];
    const totalDays     = activePlan.dailyPlan.length;
    const completedDays = activePlan.dailyPlan.filter((d) => d.completed).length;
    const todayEntry    = activePlan.dailyPlan.find(
      (d) => d.date && new Date(d.date).toISOString().split("T")[0] === today
    );
    planProgress = {
      name:           activePlan.name || "Study Plan",
      totalDays,
      completedDays,
      pct:            Math.round((completedDays / totalDays) * 100),
      todayTopics:    todayEntry?.topics    || [],
      todayPhase:     todayEntry?.phase     || null,
      todayCompleted: todayEntry?.completed || false,
    };
  }

  return { weakTopics, revisionDue: revisionTop, planProgress };
};
