/**
 * Seed: New CBSE 10 Math content from Desktop folder
 * Source: C:\Users\LENOVO\OneDrive\Desktop\New folder (2)
 *
 * Imports in 4 phases:
 *   1. Questions from cbse10_math_ch*_questions.json   → Question collection
 *   2. Questions from mock_paper_ch*.json sections     → Question collection (new questions)
 *   3. Exam documents from mock_paper_ch*.json         → Exam collection
 *   4. Teaching content from *_teaching.json files     → NcertTopicContent collection
 *   5. Topic DAG from recommender_prerequisites.json   → Topic collection
 *
 * Skips: _answer_key.json, .html files (data already captured in JSON)
 * Safe to re-run — all phases use upsert logic.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedDesktopContent.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { Question, Exam, Topic } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const DATA_DIR = process.env.DESKTOP_DATA_DIR
  || "C:\\Users\\LENOVO\\OneDrive\\Desktop\\New folder (2)";

// ── Chapter name map ──────────────────────────────────────────────────────────
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

const DIFF_SCORE = { easy: 0.25, medium: 0.5, hard: 0.75 };

// ── Helpers ───────────────────────────────────────────────────────────────────
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
    step_by_step:     "free_text", // step_by_step maps to free_text
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

async function bulkUpsertQuestions(docs, label) {
  if (!docs.length) { console.log(`  ${label}: 0 questions — skipping`); return 0; }
  const ops = docs
    .filter((d) => d.questionId) // skip any without an ID
    .map((doc) => ({
      updateOne: {
        filter: { questionId: doc.questionId },
        update: { $setOnInsert: doc },
        upsert: true,
      },
    }));
  const result  = await Question.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount ?? 0;
  console.log(`  ${label}: +${inserted} inserted, ${ops.length - inserted} already existed`);
  return inserted;
}

// ── Phase 1: question bank files ──────────────────────────────────────────────
async function seedQuestionBanks() {
  console.log("\n── Phase 1: Question bank files ─────────────────────────────────");
  const files = readdirSync(DATA_DIR)
    .filter((f) => /^cbse10_math_ch\d+.*questions\.json$/.test(f))
    .sort();
  console.log(`Found ${files.length} question-bank files`);

  let total = 0;
  for (const file of files) {
    const raw  = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
    const topicId   = raw.metadata?.topic_id ?? raw.topic?.id ?? "";
    const topicName = raw.metadata?.topic_name ?? raw.topic?.name ?? file;
    const chNum = chapterFromTopicId(topicId);
    const docs = (raw.questions ?? []).map((q) => mapQuestion(q, topicName, chNum));
    total += await bulkUpsertQuestions(docs, file);
  }
  console.log(`Question banks total: +${total} new questions\n`);
}

// ── Phase 2 & 3: mock papers (seed questions + exam docs) ─────────────────────
async function seedMockPapers() {
  console.log("── Phase 2+3: Mock paper questions + Exam documents ─────────────");
  const files = readdirSync(DATA_DIR)
    .filter((f) => /^mock_paper_ch\d+\.json$/.test(f))
    .sort();
  console.log(`Found ${files.length} mock-paper files`);

  let qTotal   = 0;
  let examCreated = 0;
  let examSkipped = 0;

  for (const file of files) {
    const paper    = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
    const chapterNum = parseInt(paper.metadata?.chapter?.replace("ch", "") ?? "0", 10);
    const chapterName = CHAPTER_NAMES[chapterNum] ?? paper.metadata?.chapter_name ?? "Unknown";

    // Collect and upsert all questions in this paper's sections
    const sections = paper.sections ?? {};
    const allQDocs = [];
    const allQIds  = [];

    for (const section of Object.values(sections)) {
      for (const q of section.questions ?? []) {
        if (!q.id) continue;
        allQIds.push(q.id);
        // Derive topicId from question's topic_ids or _topic_id field
        const topicId   = q.topic_ids?.[0] ?? q._topic_id ?? "";
        const topicName = q._topic_name ?? q.concept_id ?? topicId;
        const chNum = chapterFromTopicId(topicId) || chapterNum;
        allQDocs.push(mapQuestion(q, topicName, chNum));
      }
    }

    qTotal += await bulkUpsertQuestions(allQDocs, `${file} (questions)`);

    // Now build Exam document
    const title = `Ch${chapterNum} Mock Paper — ${chapterName}`;
    const dbQuestions = await Question.find(
      { questionId: { $in: allQIds } },
      { _id: 1, questionId: 1 }
    ).lean();
    const dbMap      = new Map(dbQuestions.map((q) => [q.questionId, q._id]));
    const orderedIds = allQIds.map((id) => dbMap.get(id)).filter(Boolean);

    const diffDist = paper.difficulty_distribution ?? paper.metadata?.difficulty_distribution ?? {};
    const examDoc  = {
      title,
      subject:       "Mathematics",
      topic:         chapterName,
      chapterNumber: chapterNum,
      totalQuestions: paper.metadata?.total_questions ?? paper.metadata?.num_questions ?? orderedIds.length,
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

    const existing = await Exam.findOneAndUpdate(
      { title },
      { $setOnInsert: examDoc },
      { upsert: true, new: false }
    );
    if (!existing) {
      examCreated++;
      console.log(`  ${file}: created exam "${title}" (${orderedIds.length}/${allQIds.length} Qs linked)`);
    } else {
      examSkipped++;
      console.log(`  ${file}: exam "${title}" already exists — skipped`);
    }
  }
  console.log(`Mock papers: +${qTotal} new questions, ${examCreated} exams created, ${examSkipped} skipped\n`);
}

// ── Phase 4: teaching content ─────────────────────────────────────────────────
async function seedTeachingContent() {
  console.log("── Phase 4: Teaching content (NcertTopicContent) ────────────────");
  const files = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith("_teaching.json"))
    .sort();
  console.log(`Found ${files.length} teaching files`);

  let total = 0;
  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));

    // Determine format: single-topic vs complete-chapter
    const isComplete = raw.metadata?.type === "chapter_complete_teaching_content";
    const topicList  = isComplete
      ? (raw.topics ?? [])
      : (raw.topic ? [raw.topic] : []);

    for (const topic of topicList) {
      const topicId = topic.id;
      if (!topicId) { console.log(`  ${file}: topic missing id — skip`); continue; }
      const chapterNumber = chapterFromTopicId(topicId);

      await NcertTopicContent.findOneAndUpdate(
        { topicId },
        {
          topicId,
          chapterNumber,
          name:                   topic.name ?? "",
          prerequisite_knowledge: topic.prerequisite_knowledge ?? [],
          key_formulas:           topic.key_formulas ?? [],
          teaching_content:       topic.teaching_content ?? {},
        },
        { upsert: true, new: true }
      );
      total++;
      console.log(`  ${file}: upserted ${topicId}`);
    }
  }
  console.log(`Teaching content: ${total} topic(s) upserted\n`);
}

// ── Phase 5: topic DAG from recommender_prerequisites.json ────────────────────
async function seedTopicDAG() {
  console.log("── Phase 5: Topic DAG (recommender_prerequisites.json) ──────────");
  const raw = JSON.parse(readFileSync(join(DATA_DIR, "recommender_prerequisites.json"), "utf8"));
  const topics = raw.topics ?? {};

  const ops = Object.entries(topics).map(([topicId, data]) => ({
    updateOne: {
      filter: { topicId },
      update: {
        $setOnInsert: {
          topicId,
          name:          data.name,
          prerequisites: data.prerequisites,
          level:         data.level,
          subject:       "Mathematics",
          grade:         "10",
        },
      },
      upsert: true,
    },
  }));

  const result   = await Topic.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount ?? 0;
  console.log(`Topic DAG: +${inserted} inserted, ${ops.length - inserted} already existed (${ops.length} total nodes)\n`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected\nData dir: ${DATA_DIR}\n`);

  await seedQuestionBanks();
  await seedMockPapers();
  await seedTeachingContent();
  await seedTopicDAG();

  console.log("✓ All done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
