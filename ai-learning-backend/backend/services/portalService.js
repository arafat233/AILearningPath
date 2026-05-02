import { User, UserProfile, Streak, Badge, Attempt, Topic, ExamAttempt, DoubtThread } from "../models/index.js";
import { LessonProgress } from "../models/lessonModel.js";

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
  if (min < 1)  return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)  return `${hr}h ago`;
  if (hr < 48)  return "yest.";
  return `${Math.floor(hr / 24)}d ago`;
};

export const getStudentDashboard = async (studentId) => {
  const now             = new Date();
  const sevenDaysAgo    = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const twentyEightDaysAgo = new Date(now - 28 * 24 * 60 * 60 * 1000);
  const twoDaysAgo      = new Date(now - 48 * 60 * 60 * 1000);
  const thirtyMinAgo    = new Date(now - 30 * 60 * 1000);
  const oneWeekAgo      = sevenDaysAgo;

  const [student, profile, streak, badges, recentAttempts, allFourWeekAttempts, topics, recentDoubts, recentExams, recentLessons] =
    await Promise.all([
      User.findById(studentId).select("name email grade subject goal createdAt").lean(),
      UserProfile.findOne({ userId: studentId }).lean(),
      Streak.findOne({ userId: studentId }).lean(),
      Badge.find({ userId: studentId }).sort({ awardedAt: -1 }).limit(10).lean(),
      Attempt.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } })
        .select("topic isCorrect timeTaken createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Attempt.find({ userId: studentId, createdAt: { $gte: twentyEightDaysAgo } })
        .select("isCorrect createdAt")
        .lean(),
      Topic.find().select("name subject").lean(),
      DoubtThread.find({ userId: studentId, updatedAt: { $gte: twoDaysAgo } })
        .select("topic subject updatedAt messages")
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      ExamAttempt.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } })
        .select("rawScore normalizedScore rank createdAt answers")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      LessonProgress.find({ userId: studentId, completedAt: { $gte: twoDaysAgo } })
        .select("topic completedAt")
        .sort({ completedAt: -1 })
        .limit(5)
        .lean(),
    ]);

  // topic → subject lookup
  const topicSubjectMap = {};
  topics.forEach((t) => { topicSubjectMap[t.name] = t.subject || "Mathematics"; });

  // ── Weekly practice bars ──────────────────────────────────────────────────
  const dayKeys    = [];
  const dayBuckets = {};
  for (let i = 6; i >= 0; i--) {
    const d    = new Date(now);
    d.setDate(d.getDate() - i);
    const key     = d.toISOString().split("T")[0];
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
  const weeklyPractice      = dayKeys.map((k) => dayBuckets[k]);
  const totalWeeklyMinutes  = weeklyPractice.reduce((s, d) => s + d.minutes, 0);

  // ── Subject mastery ───────────────────────────────────────────────────────
  const CBSE_SUBJECTS = [
    { name: "Mathematics",    color: "#007AFF" },
    { name: "Science",        color: "#34C759" },
    { name: "English",        color: "#FF9500" },
    { name: "Social Science", color: "#AF52DE" },
  ];
  const SUBJECT_ALIAS = { Math: "Mathematics", "Social Std.": "Social Science" };
  const subjectAcc    = {};
  const subjectCounts = {};
  CBSE_SUBJECTS.forEach(({ name }) => { subjectAcc[name] = 0; subjectCounts[name] = 0; });

  (profile?.topicProgress || []).forEach((tp) => {
    const raw = topicSubjectMap[tp.topic] || "Mathematics";
    const sub = SUBJECT_ALIAS[raw] || raw;
    if (subjectAcc[sub] === undefined) { subjectAcc[sub] = 0; subjectCounts[sub] = 0; }
    subjectAcc[sub]    += (tp.accuracy || 0);
    subjectCounts[sub] += 1;
  });

  const subjectMastery = CBSE_SUBJECTS.map(({ name, color }) => ({
    subject:    name,
    accuracy:   subjectCounts[name] > 0 ? Math.round((subjectAcc[name] / subjectCounts[name]) * 100) : 0,
    topicCount: subjectCounts[name],
    color,
  }));

  // ── Is learning now ───────────────────────────────────────────────────────
  const isLearningNow = recentAttempts.some(
    (a) => new Date(a.createdAt) > thirtyMinAgo
  );

  // ── Mastered this week ────────────────────────────────────────────────────
  const masteredThisWeek = (profile?.topicProgress || [])
    .filter(
      (tp) => (tp.accuracy || 0) >= 0.75 &&
               tp.lastAttempted &&
               new Date(tp.lastAttempted) > oneWeekAgo
    )
    .map((tp) => tp.topic)
    .slice(0, 8);

  // ── Today's Activity feed — merged from 4 sources ────────────────────────
  const rawItems = [];

  // 1. Practice attempts → group by topic (last 48 h)
  const recentPractice = recentAttempts.filter(
    (a) => new Date(a.createdAt) > twoDaysAgo
  );
  const byTopic = {};
  recentPractice.forEach((a) => {
    if (!byTopic[a.topic]) {
      byTopic[a.topic] = { correct: 0, wrong: 0, lastAt: a.createdAt, timeTaken: 0 };
    }
    a.isCorrect ? byTopic[a.topic].correct++ : byTopic[a.topic].wrong++;
    byTopic[a.topic].timeTaken += (a.timeTaken || 0);
    if (new Date(a.createdAt) > new Date(byTopic[a.topic].lastAt))
      byTopic[a.topic].lastAt = a.createdAt;
  });
  Object.entries(byTopic).forEach(([topic, stats]) => {
    const total   = stats.correct + stats.wrong;
    const acc     = total > 0 ? stats.correct / total : 0;
    const elapsed = now - new Date(stats.lastAt);
    const timeAgo = timeAgoLabel(elapsed);
    const mins    = Math.round(stats.timeTaken / 60);
    const detail  = mins > 0 ? `${stats.correct}/${total} correct · ${mins}m · ${timeAgo}` : `${stats.correct}/${total} correct · ${timeAgo}`;

    let type, text;
    if (acc >= 0.8 && total >= 4) {
      type = "mastered";
      text = `Mastered ${topic}`;
    } else if (acc < 0.4 && total >= 3) {
      type = "struggling";
      text = `Struggling with ${topic}`;
    } else {
      type = "practiced";
      text = `Practiced ${topic}`;
    }
    rawItems.push({ type, text, detail, ts: new Date(stats.lastAt) });
  });

  // 2. Doubt / tutor sessions
  recentDoubts.forEach((d) => {
    const topic   = d.topic || d.subject || "a topic";
    const elapsed = now - new Date(d.updatedAt);
    rawItems.push({
      type:   "doubt",
      text:   `Asked tutor about ${topic}`,
      detail: `${d.messages?.length || 1} message${(d.messages?.length || 1) !== 1 ? "s" : ""} · ${timeAgoLabel(elapsed)}`,
      ts:     new Date(d.updatedAt),
    });
  });

  // 3. Exam attempts
  recentExams.forEach((e) => {
    const score   = Math.round(e.normalizedScore || e.rawScore || 0);
    const elapsed = now - new Date(e.createdAt);
    rawItems.push({
      type:   "exam",
      text:   `Completed a practice exam`,
      detail: `Score: ${score}% · ${e.rank ? `Rank #${e.rank} · ` : ""}${timeAgoLabel(elapsed)}`,
      ts:     new Date(e.createdAt),
    });
  });

  // 4. Lesson completions
  recentLessons.forEach((l) => {
    const elapsed = now - new Date(l.completedAt);
    rawItems.push({
      type:   "lesson",
      text:   `Finished lesson on ${l.topic}`,
      detail: timeAgoLabel(elapsed),
      ts:     new Date(l.completedAt),
    });
  });

  // Sort by most recent and cap at 6
  const recentActivity = rawItems
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 6)
    .map(({ ts, ...rest }) => rest);

  // ── 4-week accuracy trend (weekly buckets, most recent last) ─────────────
  const weeklyTrend = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd   = new Date(now - i       * 7 * 24 * 60 * 60 * 1000);
    const label     = `W${4 - i}`;
    const bucket    = allFourWeekAttempts.filter((a) => {
      const t = new Date(a.createdAt);
      return t >= weekStart && t < weekEnd;
    });
    const total    = bucket.length;
    const correct  = bucket.filter((a) => a.isCorrect).length;
    weeklyTrend.push({
      label,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
      sessions: total,
    });
  }

  // ── Predicted grade ───────────────────────────────────────────────────────
  const predicted = gradeFromAccuracy(profile?.accuracy || 0);

  return {
    student: {
      id:        studentId,
      name:      student?.name    || "Student",
      grade:     student?.grade   || "10",
      subject:   student?.subject || "Mathematics",
      goal:      student?.goal    || "pass",
      createdAt: student?.createdAt,
    },
    accuracy:          Math.round((profile?.accuracy || 0) * 100),
    totalAttempts:     profile?.totalAttempts || 0,
    streak:            { current: streak?.currentStreak || 0, longest: streak?.longestStreak || 0 },
    predicted,
    weeklyPractice,
    totalWeeklyMinutes,
    subjectMastery,
    weakTopics:        (profile?.weakAreas  || []).slice(0, 6),
    masteredThisWeek,
    recentActivity,
    isLearningNow,
    badges,
    weeklyTrend,
  };
};
