// ============================================================
// EXAM SCORE PREDICTION
// Weighs each topic by examMarks × examFrequency, applies
// time-to-exam adjustment, returns a score range + grade.
// ============================================================
import { UserProfile, Topic, User } from "../models/index.js";

const CBSE_GRADES = [
  { min: 91, grade: "A1", gpa: 10 },
  { min: 81, grade: "A2", gpa: 9  },
  { min: 71, grade: "B1", gpa: 8  },
  { min: 61, grade: "B2", gpa: 7  },
  { min: 51, grade: "C1", gpa: 6  },
  { min: 41, grade: "C2", gpa: 5  },
  { min: 33, grade: "D",  gpa: 4  },
  { min: 0,  grade: "E",  gpa: 0  },
];

const gradeFor = (pct) => CBSE_GRADES.find((g) => pct >= g.min) || CBSE_GRADES.at(-1);

export const predictExamScore = async (userId) => {
  const [profile, topics, user] = await Promise.all([
    UserProfile.findOne({ userId }).lean(),
    Topic.find().lean(),
    User.findById(userId).select("examDate goal subject").lean(),
  ]);

  if (!profile?.topicProgress?.length) {
    return {
      predictedMin: null,
      predictedMax: null,
      predictedGrade: null,
      confidence: "low",
      totalMarks: 80,
      message: "Practice more topics to unlock your score prediction.",
      breakdown: [],
    };
  }

  const daysLeft = user?.examDate
    ? Math.max(0, Math.ceil((new Date(user.examDate) - new Date()) / 864e5))
    : 60;

  // Build topic map for quick lookup
  const topicMap = {};
  topics.forEach((t) => { topicMap[t.name] = t; });

  let weightedSum = 0;
  let totalWeight = 0;
  const breakdown = [];

  profile.topicProgress.forEach((tp) => {
    const meta = topicMap[tp.topic];
    if (!meta) return;
    const weight = (meta.examMarks || 5) * (meta.examFrequency || 0.5);
    const contrib = (tp.accuracy || 0) * weight;
    weightedSum  += contrib;
    totalWeight  += weight;
    breakdown.push({
      topic:      tp.topic,
      accuracy:   Math.round((tp.accuracy || 0) * 100),
      examMarks:  meta.examMarks || 5,
      attempts:   tp.attempts || 0,
      contribution: parseFloat(contrib.toFixed(2)),
    });
  });

  const EXAM_MARKS = 80; // CBSE written paper (Theory only)
  const weightedAccuracy = totalWeight > 0 ? weightedSum / totalWeight : 0;
  let base = weightedAccuracy * EXAM_MARKS;

  // Time adjustment
  let adjustment = 0;
  if (daysLeft > 60) adjustment = +5;   // plenty of time — headroom
  if (daysLeft < 7)  adjustment = -5;   // exam pressure

  const raw     = Math.max(0, Math.min(EXAM_MARKS, base + adjustment));
  const margin  = 8;
  const predMin = Math.round(Math.max(0,           raw - margin));
  const predMax = Math.round(Math.min(EXAM_MARKS,  raw + margin));

  const pctMin = Math.round((predMin / EXAM_MARKS) * 100);
  const pctMax = Math.round((predMax / EXAM_MARKS) * 100);
  const pctMid = Math.round(((predMin + predMax) / 2 / EXAM_MARKS) * 100);

  const confidence =
    profile.topicProgress.length < 3  ? "low"    :
    profile.topicProgress.length < 8  ? "medium" : "high";

  return {
    predictedMin:   predMin,
    predictedMax:   predMax,
    predictedGrade: gradeFor(pctMid).grade,
    predictedGPA:   gradeFor(pctMid).gpa,
    confidence,
    daysLeft,
    totalMarks:     EXAM_MARKS,
    pctMin,
    pctMax,
    breakdown: breakdown.sort((a, b) => b.contribution - a.contribution),
    message: daysLeft < 7
      ? "Exam is very close — revise your strongest topics to maximise marks."
      : `Keep your current pace and you are on track for grade ${gradeFor(pctMid).grade}.`,
  };
};
