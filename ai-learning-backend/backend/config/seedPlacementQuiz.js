/**
 * Seed: Placement quiz — 20 diagnostic questions + one Exam document
 * Source: placement_quiz.json
 *
 * Each question is tagged with placementRole: "primary"|"secondary" and
 * chapterNumber so the scoring service can group them per chapter.
 *
 * The Exam document (isPlacementQuiz: true) stores the ordered questionIds
 * so GET /api/v1/placement-quiz can serve them in one query.
 *
 * Safe to re-run — questions upsert on { questionId }, exam on title.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedPlacementQuiz.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join } from "path";
import { Question, Exam } from "../models/index.js";

const DATA_DIR = process.env.QUESTIONS_DIR || "C:\\Users\\LENOVO\\Downloads\\Algo for question";

const CHAPTER_NAMES = {
  1:  "Real Numbers",
  2:  "Polynomials",
  3:  "Pair of Linear Equations in Two Variables",
  4:  "Quadratic Equations",
  5:  "Arithmetic Progressions",
  6:  "Triangles",
  7:  "Coordinate Geometry",
  8:  "Introduction to Trigonometry",
  9:  "Some Applications of Trigonometry",
  10: "Circles",
  11: "Areas Related to Circles",
  12: "Surface Areas and Volumes",
  13: "Statistics",
  14: "Probability",
};

function cleanAnswer(str) {
  if (!str && str !== 0) return "";
  const s = String(str).trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(q) {
  if (q.question_type !== "mcq") return [];
  const correct = { text: cleanAnswer(q.correct_answer), type: "correct", logicTag: null };
  const distractors = (q.distractors || []).map((d) => ({
    text:     cleanAnswer(d),
    type:     "concept_error",
    logicTag: null,
  }));
  return shuffle([correct, ...distractors]);
}

function chapterFromStr(chStr) {
  const m = chStr?.match(/^ch(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

function mapQuestion(q) {
  const chapterNumber = chapterFromStr(q.chapter);
  const isMcq = q.question_type === "mcq";
  return {
    questionId:      q.q_id,
    topicId:         q.topic_id,
    chapterNumber,
    topic:           CHAPTER_NAMES[chapterNumber] || q.chapter,
    subtopic:        `Ch${chapterNumber} Placement — ${q.role}`,
    subject:         "Mathematics",
    grade:           "10",
    examBoard:       "CBSE",
    questionText:    q.question_template,
    questionType:    isMcq ? "mcq" : "numeric",
    difficulty:      q.difficulty,
    difficultyScore: 0.5,
    expectedTime:    q.time_limit_sec ?? 90,
    marks:           1,
    correctAnswer:   isMcq ? null : cleanAnswer(q.correct_answer),
    options:         buildOptions(q),
    solutionSteps:   [],
    placementRole:   q.role,
    isPYQ:           false,
    isAIGenerated:   false,
  };
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");

  const raw = JSON.parse(readFileSync(join(DATA_DIR, "placement_quiz.json"), "utf8"));

  // Phase 1: seed questions
  const docs = raw.questions.map(mapQuestion);
  const ops  = docs.map((doc) => ({
    updateOne: {
      filter: { questionId: doc.questionId },
      update: { $setOnInsert: doc },
      upsert: true,
    },
  }));
  const result = await Question.bulkWrite(ops, { ordered: false });
  console.log(`Placement questions: +${result.upsertedCount} inserted, ${docs.length - result.upsertedCount} already existed`);

  // Phase 2: resolve DB _ids in original order
  const qIds = docs.map((d) => d.questionId);
  const dbQuestions = await Question.find(
    { questionId: { $in: qIds } },
    { _id: 1, questionId: 1 }
  ).lean();
  const dbMap     = new Map(dbQuestions.map((q) => [q.questionId, q._id]));
  const orderedIds = qIds.map((id) => dbMap.get(id)).filter(Boolean);

  // Phase 3: upsert the Exam document
  const examDoc = {
    title:           "Placement Quiz — CBSE Class 10 Math",
    subject:         "Mathematics",
    topic:           "All Chapters",
    totalQuestions:  raw.metadata.total_questions,
    duration:        raw.metadata.estimated_duration_minutes,
    isPlacementQuiz: true,
    questionIds:     orderedIds,
    isActive:        true,
  };

  const existing = await Exam.findOneAndUpdate(
    { title: examDoc.title },
    { $setOnInsert: examDoc },
    { upsert: true, new: false }
  );

  if (!existing) {
    console.log(`Placement quiz exam created (${orderedIds.length} questions linked)`);
  } else {
    console.log("Placement quiz exam already exists — skipped");
  }

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
