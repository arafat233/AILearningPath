import { User, UserProfile, Streak, Badge, Attempt, Topic } from "../models/index.js";

const gradeFromAccuracy = (acc) => {
  if (acc >= 0.91) return { grade: "A1", range: "91-100" };
  if (acc >= 0.81) return { grade: "A2", range: "81-90" };
  if (acc >= 0.71) return { grade: "B1", range: "71-80" };
  if (acc >= 0.61) return { grade: "B2", range: "61-70" };
  if (acc >= 0.51) return { grade: "C1", range: "51-60" };
  if (acc >= 0.41) return { grade: "C2", range: "41-50" };
  return { grade: "D", range: "33-40" };
};

const timeAgoLabel = (ms) => {
  const min = Math.round(ms / 60000);
  if (min < 1)    return "just now";
  if (min < 60)   return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)    return `${hr}h ago`;
  return "yest.";
};

export const getStudentDashboard = async (studentId) => {
  const now         = new Date();
  const sevenDaysAgo = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const oneDayAgo    = new Date(now - 24 * 60 * 60 * 1000);
  const thirtyMinAgo = new Date(now - 30 * 60 * 1000);
  const oneWeekAgo   = new Date(now - 7  * 24 * 60 * 60 * 1000);

  const [student, profile, streak, badges, recentAttempts, topics] = await Promise.all([
    User.findById(studentId).select("name email grade subject goal createdAt").lean(),
    UserProfile.findOne({ userId: studentId }).lean(),
    Streak.findOne({ userId: studentId }).lean(),
    Badge.find({ userId: studentId }).sort({ awardedAt: -1 }).limit(10).lean(),
    Attempt.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } })
      .select("topic isCorrect timeTaken createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    Topic.find().select("name subject").lean(),
  ]);

  // topic → subject lookup
  const topicSubjectMap = {};
  topics.forEach((t) => { topicSubjectMap[t.name] = t.subject || "Mathematics"; });

  // ── Weekly practice: minutes per calendar day (last 7 days) ──
  const dayKeys = [];
  const dayBuckets = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayName = ["S","M","T","W","T","F","S"][d.getDay()];
    dayKeys.push(key);
    dayBuckets[key] = { key, dayName, minutes: 0, count: 0, isToday: i === 0 };
  }
  recentAttempts.forEach((a) => {
    const key = new Date(a.createdAt).toISOString().split("T")[0];
    if (dayBuckets[key]) {
      dayBuckets[key].minutes += Math.round((a.timeTaken || 30) / 60);
      dayBuckets[key].count++;
    }
  });
  const weeklyPractice = dayKeys.map((k) => dayBuckets[k]);
  const totalWeeklyMinutes = weeklyPractice.reduce((s, d) => s + d.minutes, 0);

  // ── Subject mastery from topicProgress ──
  const subjectAcc    = {};
  const subjectCounts = {};
  (profile?.topicProgress || []).forEach((tp) => {
    const sub = topicSubjectMap[tp.topic] || "Mathematics";
    if (!subjectAcc[sub]) { subjectAcc[sub] = 0; subjectCounts[sub] = 0; }
    subjectAcc[sub]    += (tp.accuracy || 0);
    subjectCounts[sub] += 1;
  });
  const SUBJECT_COLORS = {
    Mathematics:    "#007AFF",
    Math:           "#007AFF",
    Science:        "#34C759",
    English:        "#FF9500",
    "Social Science": "#AF52DE",
    "Social Std.":  "#AF52DE",
    Hindi:          "#FF3B30",
  };
  const subjectMastery = Object.keys(subjectAcc)
    .map((s) => ({
      subject:    s,
      accuracy:   Math.round((subjectAcc[s] / subjectCounts[s]) * 100),
      topicCount: subjectCounts[s],
      color:      SUBJECT_COLORS[s] || "#007AFF",
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  // ── Is learning right now (activity in last 30 min) ──
  const isLearningNow = recentAttempts.some(
    (a) => new Date(a.createdAt) > thirtyMinAgo
  );

  // ── Mastered this week (accuracy ≥ 75%, attempted in last 7 days) ──
  const masteredThisWeek = (profile?.topicProgress || [])
    .filter(
      (tp) =>
        (tp.accuracy || 0) >= 0.75 &&
        tp.lastAttempted &&
        new Date(tp.lastAttempted) > oneWeekAgo
    )
    .map((tp) => tp.topic)
    .slice(0, 8);

  // ── Today's activity feed: group today's attempts by topic ──
  const todayAttempts = recentAttempts.filter(
    (a) => new Date(a.createdAt) > oneDayAgo
  );
  const byTopic = {};
  todayAttempts.forEach((a) => {
    if (!byTopic[a.topic]) {
      byTopic[a.topic] = { correct: 0, wrong: 0, lastAt: a.createdAt };
    }
    a.isCorrect ? byTopic[a.topic].correct++ : byTopic[a.topic].wrong++;
    if (new Date(a.createdAt) > new Date(byTopic[a.topic].lastAt)) {
      byTopic[a.topic].lastAt = a.createdAt;
    }
  });

  const recentActivity = Object.entries(byTopic)
    .sort((a, b) => new Date(b[1].lastAt) - new Date(a[1].lastAt))
    .slice(0, 5)
    .map(([topic, stats]) => {
      const total    = stats.correct + stats.wrong;
      const acc      = total > 0 ? stats.correct / total : 0;
      const elapsed  = now - new Date(stats.lastAt);
      const timeAgo  = timeAgoLabel(elapsed);

      let type, text, detail;
      if (acc >= 0.8 && total >= 4) {
        type = "mastered";
        text = `Mastered ${topic}`;
        detail = `${stats.correct}/${total} correct · ${timeAgo}`;
      } else if (acc < 0.4 && total >= 3) {
        type = "struggling";
        text = `Struggling with ${topic}`;
        detail = `asked for hints · ${timeAgo}`;
      } else {
        type = "practiced";
        text = `Practiced ${topic}`;
        detail = `${stats.correct}/${total} correct · ${timeAgo}`;
      }
      return { type, text, detail };
    });

  // ── Predicted grade ──
  const predicted = gradeFromAccuracy(profile?.accuracy || 0);

  return {
    student: {
      id:       studentId,
      name:     student?.name    || "Student",
      grade:    student?.grade   || "10",
      subject:  student?.subject || "Mathematics",
      goal:     student?.goal    || "pass",
      createdAt: student?.createdAt,
    },
    accuracy:           Math.round((profile?.accuracy || 0) * 100),
    totalAttempts:      profile?.totalAttempts || 0,
    streak:             { current: streak?.currentStreak || 0, longest: streak?.longestStreak || 0 },
    predicted,
    weeklyPractice,
    totalWeeklyMinutes,
    subjectMastery,
    weakTopics:         (profile?.weakAreas  || []).slice(0, 6),
    masteredThisWeek,
    recentActivity,
    isLearningNow,
    badges,
  };
};
