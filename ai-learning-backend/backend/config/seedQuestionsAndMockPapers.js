/**
 * Seed: CBSE Class 10 Math — 880 practice questions + 14 chapter mock papers
 *
 * Sources (C:\Users\LENOVO\Downloads\Algo for question\):
 *   43 question-bank JSON files  →  Question collection (880 questions)
 *   14 mock-paper JSON files     →  Exam collection (isMockPaper: true)
 *
 * Safe to re-run — questions upsert on { questionId }, exams upsert on title.
 * Duplicate files marked "(2)" are skipped automatically.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedQuestionsAndMockPapers.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { Question, Exam } from "../models/index.js";

const DATA_DIR = process.env.QUESTIONS_DIR || "C:\\Users\\LENOVO\\Downloads\\Algo for question";

// ── Chapter name map ─────────────────────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────────────────
const DIFF_SCORE = { easy: 0.25, medium: 0.5, hard: 0.75 };

function chapterFromTopicId(topicId) {
  const m = topicId?.match(/^ch(\d+)_/);
  return m ? parseInt(m[1], 10) : null;
}

function cleanFormula(str) {
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

function mapQuestionType(t) {
  const MAP = {
    mcq:              "mcq",
    free_text:        "free_text",
    numeric:          "numeric",
    numeric_range:    "numeric_range",
    fill_blank:       "fill_blank",
    assertion_reason: "assertion_reason",
    case_based:       "case_based",
  };
  return MAP[t] || "mcq";
}

function buildOptions(q) {
  if (!["mcq", "assertion_reason", "case_based"].includes(q.question_type)) return [];
  const correct = {
    text:     cleanFormula(q.correct_answer_formula),
    type:     "correct",
    logicTag: null,
  };
  const distractors = (q.distractors || []).map((d) => ({
    text:     cleanFormula(d.value_formula),
    type:     "concept_error",
    logicTag: d.misconception_id || null,
  }));
  return shuffle([correct, ...distractors]);
}

function mapQuestion(q, topicName, chapterNumber) {
  return {
    questionId:    q.id,
    topicId:       q.topic_ids?.[0] ?? null,
    chapterNumber,
    topic:         CHAPTER_NAMES[chapterNumber] || topicName,
    subtopic:      topicName,
    subject:       "Mathematics",
    grade:         "10",
    examBoard:     "CBSE",
    questionText:  q.question_template,
    questionType:  mapQuestionType(q.question_type),
    difficulty:    q.difficulty,
    difficultyScore: DIFF_SCORE[q.difficulty] ?? 0.5,
    expectedTime:  q.time_estimate_seconds ?? 60,
    marks:         q.marks ?? 1,
    bloomLevel:    q.bloom_level ?? null,
    conceptTested: q.skill_tested ?? null,
    approachTags:  q.approach_tags ?? [],
    hintLevels:    q.hint_levels ?? [],
    correctAnswer: ["mcq", "assertion_reason", "case_based"].includes(q.question_type)
      ? null
      : cleanFormula(q.correct_answer_formula),
    options:       buildOptions(q),
    solutionSteps: (q.step_by_step_solution ?? []).map((s) => s.clean).filter(Boolean),
    stepByStep:    (q.step_by_step_solution ?? []).map((s) => ({
      stepNumber: s.step_number,
      clean:      s.clean,
      voice:      s.voice,
    })),
    timeThresholds: q.time_thresholds ? {
      guessBelow:  q.time_thresholds.guess_below,
      expectedMin: q.time_thresholds.expected_min,
      expectedMax: q.time_thresholds.expected_max,
      stuckAbove:  q.time_thresholds.stuck_above,
    } : undefined,
    routing: q.routing ? {
      ifCorrect:       q.routing.if_correct ?? null,
      ifWrong:         q.routing.if_wrong ?? null,
      ifStuck:         q.routing.if_stuck ?? null,
      ifFlukeDetected: q.routing.if_fluke_detected ?? null,
    } : undefined,
    flukeCheckQuestionId: q.fluke_check_question_id ?? null,
    mixingType:    q.mixing_type ?? "single_topic",
    isAIGenerated: q.source === "anthropic_generated",
    isPYQ:         !!q.exam_year_if_real,
    pyqYear:       q.exam_year_if_real || null,
  };
}

// ── Phase 1: seed question bank ───────────────────────────────────────────────
async function seedQuestions() {
  const files = readdirSync(DATA_DIR)
    .filter((f) => f.match(/^cbse10_math_ch\d+_.*questions\.json$/) && !f.includes("(2)") && !f.includes("REFERENCE"))
    .sort();

  console.log(`\nFound ${files.length} question-bank files`);

  let totalInserted = 0;
  let totalSkipped  = 0;

  for (const file of files) {
    const raw  = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
    const topicId   = raw.metadata?.topic_id ?? raw.topic?.id ?? "";
    const topicName = raw.metadata?.topic_name ?? raw.topic?.name ?? file;
    const chapterNumber = chapterFromTopicId(topicId);

    const docs = (raw.questions ?? []).map((q) => mapQuestion(q, topicName, chapterNumber));

    if (!docs.length) { console.log(`  ${file}: 0 questions — skipping`); continue; }

    const ops = docs.map((doc) => ({
      updateOne: {
        filter: { questionId: doc.questionId },
        update: { $setOnInsert: doc },
        upsert: true,
      },
    }));

    const result = await Question.bulkWrite(ops, { ordered: false });
    const inserted = result.upsertedCount ?? 0;
    const skipped  = docs.length - inserted;
    totalInserted += inserted;
    totalSkipped  += skipped;
    console.log(`  ${file}: +${inserted} inserted, ${skipped} already existed`);
  }

  console.log(`\nQuestion bank: ${totalInserted} new questions inserted, ${totalSkipped} skipped (already in DB)\n`);
  return totalInserted + totalSkipped;
}

// ── Phase 2: collect all question IDs referenced in mock papers ──────────────
function collectMockPaperQuestionIds(paperData) {
  const ids = new Set();
  const sections = paperData.sections ?? {};
  for (const section of Object.values(sections)) {
    for (const q of section.questions ?? []) {
      if (q.id) ids.add(q.id);
    }
  }
  return [...ids];
}

// ── Phase 3: seed mock papers as Exam documents ──────────────────────────────
async function seedMockPapers() {
  const files = readdirSync(DATA_DIR)
    .filter((f) => f.match(/^mock_paper_ch\d+\.json$/))
    .sort();

  console.log(`Found ${files.length} mock-paper files`);

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const paper = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
    const chapterNum = parseInt(paper.metadata?.chapter?.replace("ch", "") ?? 0, 10);
    const chapterName = CHAPTER_NAMES[chapterNum] ?? paper.metadata?.chapter_name ?? "Unknown";
    const title = `Ch${chapterNum} Mock Paper — ${chapterName}`;

    // Gather all question IDs referenced in this paper
    const qIds = collectMockPaperQuestionIds(paper);

    // Look up their MongoDB _ids (only include questions that were actually seeded)
    const dbQuestions = await Question.find(
      { questionId: { $in: qIds } },
      { _id: 1, questionId: 1 }
    ).lean();

    // Build an ordered list matching paper section order
    const dbMap = new Map(dbQuestions.map((q) => [q.questionId, q._id]));
    const orderedIds = qIds.map((id) => dbMap.get(id)).filter(Boolean);

    const diffDist = paper.metadata?.difficulty_distribution ?? {};

    const examDoc = {
      title,
      subject:       "Mathematics",
      topic:         chapterName,
      chapterNumber: chapterNum,
      totalQuestions: paper.metadata?.num_questions ?? orderedIds.length,
      duration:      paper.metadata?.duration_minutes ?? 45,
      isMockPaper:   true,
      questionIds:   orderedIds,
      questionDistribution: {
        easy:   diffDist.easy   ?? 0,
        medium: diffDist.medium ?? 0,
        hard:   diffDist.hard   ?? 0,
      },
      isActive: true,
    };

    const result = await Exam.findOneAndUpdate(
      { title },
      { $setOnInsert: examDoc },
      { upsert: true, new: false }
    );

    if (!result) {
      created++;
      console.log(`  ${file}: created "${title}" (${orderedIds.length}/${qIds.length} questions linked)`);
    } else {
      skipped++;
      console.log(`  ${file}: "${title}" already exists — skipped`);
    }
  }

  console.log(`\nMock papers: ${created} created, ${skipped} already existed\n`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");

  await seedQuestions();
  await seedMockPapers();

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
