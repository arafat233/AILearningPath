import { UserProfile, StudyPlan, Topic, User, Question, SeenQuestion } from "../models/index.js";
import { getRevisionTopics } from "./revisionService.js";
import { getStreakStatus } from "./streakService.js";
import { getContinueCard } from "./lessonsV2Service.js";

export const getDailyBrief = async (userId) => {
  const [profile, revisionDue, activePlan, userDoc] = await Promise.all([
    UserProfile.findOne({ userId }).lean(),
    getRevisionTopics(userId),
    StudyPlan.findOne({ userId, isActive: true }).sort({ createdAt: -1 }).lean(),
    User.findById(userId).select("examBoard").lean(),
  ]);
  const board = (userDoc?.examBoard || "CBSE").toUpperCase();

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

  // Enrich weak topics and revision items with subject names
  const allNames = [...weakTopics.map((t) => t.topic), ...revisionTop.map((t) => t.topic)];
  if (allNames.length > 0) {
    const docs = await Topic.find({ name: { $in: allNames }, examBoard: board }, "name subject").lean();
    const map  = {};
    docs.forEach((d) => { map[d.name] = d.subject; });
    weakTopics.forEach((t)   => { t.subject = map[t.topic]  || null; });
    revisionTop.forEach((t)  => { t.subject = map[t.topic]  || null; });
  }

  return { weakTopics, revisionDue: revisionTop, planProgress };
};

// Pick one playable, preferably-unseen question for a topic.
const pickQuestionFor = async (topicName, seenSet) => {
  const qs = await Question.find({
    topic: topicName,
    deletedAt: null,
    questionType: { $in: ["mcq", "assertion_reason", "case_based"] },
    "options.0": { $exists: true },
  })
    .select("_id")
    .limit(50)
    .lean();
  if (!qs.length) return null;
  const unseen = qs.filter((q) => !seenSet.has(String(q._id)));
  const pool = unseen.length ? unseen : qs;
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * The single "start today" payload: a sequenced queue of REAL question IDs
 * (3 weak-topic + 1 revision), streak summary, and the next lesson to
 * continue — one call, one obvious flow. The client launches the queue via
 * the existing POST /api/practice/start-bookmarks {questionIds}.
 */
export const getTodayPlan = async (userId) => {
  const [brief, streak, nextLesson, seen] = await Promise.all([
    getDailyBrief(userId),
    getStreakStatus(userId),
    getContinueCard(userId),
    SeenQuestion.find({ userId }).select("questionId").lean(),
  ]);
  const seenSet = new Set(seen.map((s) => s.questionId));

  const weakNames = brief.weakTopics.map((t) => t.topic);
  const revisionName = brief.revisionDue.find((r) => !weakNames.includes(r.topic))?.topic || null;

  const slots = [
    ...weakNames.map((topic) => ({ kind: "weak_topic", topic })),
    ...(revisionName ? [{ kind: "revision", topic: revisionName }] : []),
  ];
  const picks = await Promise.all(slots.map((s) => pickQuestionFor(s.topic, seenSet)));
  const queue = slots
    .map((s, i) => (picks[i] ? { ...s, questionId: String(picks[i]._id) } : null))
    .filter(Boolean);

  return { queue, streak, nextLesson, brief };
};
