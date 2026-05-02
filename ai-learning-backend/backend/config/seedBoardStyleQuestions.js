/**
 * Seed: CBSE board-style supplementary questions (40 questions)
 * Source: cbse_board_style_questions.json
 * Inspired by 2024/2025 CBSE board paper patterns — free_text and mcq types.
 * Safe to re-run — upserts on { questionId }.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedBoardStyleQuestions.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join } from "path";
import { Question } from "../models/index.js";

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

const DIFF_SCORE   = { easy: 0.25, medium: 0.5, hard: 0.75 };
const DEFAULT_TIME = { easy: 30,   medium: 75,  hard: 150  };

function chapterFromTopicId(topicId) {
  const m = topicId?.match(/^ch(\d+)_/);
  return m ? parseInt(m[1], 10) : null;
}

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

function mapQuestion(q) {
  const chapterNumber = chapterFromTopicId(q.topic_id);
  const isMcq = q.question_type === "mcq";
  return {
    questionId:      q.id,
    topicId:         q.topic_id,
    chapterNumber,
    topic:           CHAPTER_NAMES[chapterNumber] || q.topic_name,
    subtopic:        q.topic_name,
    subject:         "Mathematics",
    grade:           "10",
    examBoard:       "CBSE",
    questionText:    q.question_template,
    questionType:    isMcq ? "mcq" : "free_text",
    difficulty:      q.difficulty,
    difficultyScore: DIFF_SCORE[q.difficulty] ?? 0.5,
    expectedTime:    DEFAULT_TIME[q.difficulty] ?? 75,
    marks:           q.marks ?? 1,
    correctAnswer:   isMcq ? null : cleanAnswer(q.correct_answer),
    options:         buildOptions(q),
    solutionSteps:   Array.isArray(q.step_by_step_solution) ? q.step_by_step_solution : [],
    isPYQ:           false,
    isAIGenerated:   false,
  };
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");

  const raw  = JSON.parse(readFileSync(join(DATA_DIR, "cbse_board_style_questions.json"), "utf8"));
  const docs = raw.questions.map(mapQuestion);

  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { questionId: doc.questionId },
      update: { $setOnInsert: doc },
      upsert: true,
    },
  }));

  const result   = await Question.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount ?? 0;
  const skipped  = docs.length - inserted;
  console.log(`Board-style questions: +${inserted} inserted, ${skipped} already existed`);
  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
