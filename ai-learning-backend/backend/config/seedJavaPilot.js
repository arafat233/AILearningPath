/**
 * Pro-track Java pilot seed.
 *
 * Reads the single committed pilot topic at
 *   ai-learning-backend/backend/content/pro/java/m1_fundamentals/topics/t1_hello_world/
 * and idempotently upserts:
 *
 *   1 ProTrack         pro_java
 *   1 ProModule        java_m1            ("Java Fundamentals")
 *   1 ProTopic         java_m1_t1          ("Hello World & Setup")
 *   N ProExercises     from exercises.json
 *   1 ProProject       from project.json
 *
 * PRO_TRACK_PLAN.md §5 Step 4 — Day 1 acceptance: querying
 * `ProTopic.findOne({ topicId: "java_m1_t1" })` returns full content.
 *
 * Idempotent (upserts on the unique keys), safe to re-run.
 *
 * Usage:  node config/seedJavaPilot.js
 *  npm script:  npm run seed:pro-java-pilot
 */

import "dotenv/config";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ProTrack, ProModule, ProTopic, ProExercise, ProProject,
} from "../models/proModels.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPIC_DIR  = path.resolve(
  __dirname, "..", "content", "pro", "java", "m1_fundamentals", "topics", "t1_hello_world"
);

async function readJson(file) {
  const text = await fs.readFile(path.join(TOPIC_DIR, file), "utf8");
  return JSON.parse(text);
}

// ── snake_case → camelCase mapping for ProExercise ──────────────────────────
function mapExercise(raw, trackKey, moduleId, topicId) {
  return {
    trackKey,
    moduleId,
    topicId,
    exerciseId:       raw.id,
    level:            raw.level,
    type:             raw.type,
    title:            raw.title || "",
    scenario:         raw.scenario || "",
    instructions:     raw.instructions || "",
    starterCode:      raw.starter_code || "",
    expectedSolution: raw.expected_solution || "",
    blanks:           raw.blanks || [],
    testCases:        raw.test_cases || [],
    hints:            raw.hints || [],
    xpReward:         raw.xp_reward ?? defaultXpForLevel(raw.level),
    difficulty:       typeof raw.difficulty === "number" ? Math.min(1, raw.difficulty / 5) : 0.3,
  };
}

function defaultXpForLevel(level) {
  return { warmup: 5, easy: 10, medium: 20, hard: 40 }[level] ?? 10;
}

function flattenRequirements(raw) {
  // Project schema variant — requirements is an object keyed by category
  // (e.g. { core: [...], extras: [...] }). Flatten to a single array,
  // tagging the category onto the id so we don't collide on req_1 across
  // categories.
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const out = [];
    for (const [category, list] of Object.entries(raw)) {
      if (!Array.isArray(list)) continue;
      for (const r of list) {
        out.push({
          id:          r.id ? `${category}_${r.id}` : `${category}_${out.length + 1}`,
          description: r.description || (typeof r === "string" ? r : ""),
          weight:      typeof r.weight === "number" ? r.weight : 1,
        });
      }
    }
    return out;
  }
  return [];
}

function mapProject(raw, trackKey, moduleId, topicId) {
  return {
    trackKey,
    moduleId,
    topicId,
    projectId:        raw.project_id || raw.id || `${topicId}_project`,
    name:             raw.name || raw.title || "Project",
    scenario:         raw.scenario || "",
    description:      raw.description || "",
    requirements:     flattenRequirements(raw.requirements),
    estimatedMinutes: raw.estimated_minutes || raw.estimatedMinutes || 0,
    difficulty:       typeof raw.difficulty === "number" ? Math.min(1, raw.difficulty / 5) : 0.5,
  };
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Reading pilot content from:\n  ${TOPIC_DIR}\n`);

  const [topic, exercises, project] = await Promise.all([
    readJson("topic.json"),
    readJson("exercises.json"),
    readJson("project.json").catch(() => null),
  ]);

  const TRACK_KEY = "pro_java";
  const MODULE_ID = topic.module_id?.startsWith("java_") ? topic.module_id : `java_${topic.module_id || "m1"}`;
  const TOPIC_ID  = topic.topic_id;

  // ── 1. ProTrack ────────────────────────────────────────────────────────────
  const trackDoc = {
    key:         TRACK_KEY,
    slug:        "java",
    name:        "Java — From Zero to Job-Ready",
    description: "Industrial-strength Java for first jobs, internships, and interviews.",
    language:    "java",
    iconUrl:     null,
    coverUrl:    null,
    status:      "live",
  };
  await ProTrack.findOneAndUpdate({ key: TRACK_KEY }, trackDoc, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`✓ ProTrack: ${TRACK_KEY}`);

  // ── 2. ProModule ───────────────────────────────────────────────────────────
  const moduleDoc = {
    trackKey:       TRACK_KEY,
    moduleId:       MODULE_ID,
    moduleNumber:   1,
    name:           topic.module_name || "Java Fundamentals",
    slug:           "fundamentals",
    description:    "Setting up Java, writing your first program, and the building blocks every Java developer uses every day.",
    estimatedHours: 8,
    prerequisites:  [],
    status:         "live",
  };
  await ProModule.findOneAndUpdate({ moduleId: MODULE_ID }, moduleDoc, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`✓ ProModule: ${MODULE_ID}`);

  // ── 3. ProTopic ────────────────────────────────────────────────────────────
  const topicDoc = {
    trackKey:              TRACK_KEY,
    moduleId:              MODULE_ID,
    topicId:               TOPIC_ID,
    topicNumber:           topic.topic_number || 1,
    name:                  topic.name,
    slug:                  topic.slug || "",
    metadata:              topic.metadata || {},
    hook:                  topic.hook || {},
    teaching:              topic.teaching || {},
    industryApplications:  topic.industry_applications || {},
    interviewRelevance:    topic.interview_relevance || {},
    commonGaps:            topic.common_gaps || {},
    prerequisites:         topic.metadata?.prerequisites || [],
    estimatedMinutes:      topic.metadata?.estimated_minutes || 30,
    difficulty:            typeof topic.metadata?.difficulty === "number" ? Math.min(1, topic.metadata.difficulty / 5) : 0.2,
    xpReward:              50,
  };
  await ProTopic.findOneAndUpdate({ topicId: TOPIC_ID }, topicDoc, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`✓ ProTopic: ${TOPIC_ID}`);

  // ── 4. ProExercises ────────────────────────────────────────────────────────
  let exInserted = 0;
  for (const raw of exercises.exercises || []) {
    const doc = mapExercise(raw, TRACK_KEY, MODULE_ID, TOPIC_ID);
    await ProExercise.findOneAndUpdate({ exerciseId: doc.exerciseId }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
    exInserted++;
  }
  console.log(`✓ ProExercises: ${exInserted}`);

  // ── 5. ProProject ──────────────────────────────────────────────────────────
  if (project) {
    const doc = mapProject(project, TRACK_KEY, MODULE_ID, TOPIC_ID);
    await ProProject.findOneAndUpdate({ projectId: doc.projectId }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`✓ ProProject: ${doc.projectId}`);
  } else {
    console.log("· ProProject skipped (no project.json)");
  }

  // ── Update aggregate counts on ProTrack ────────────────────────────────────
  const [totalModules, totalTopics, totalExercises, exAgg] = await Promise.all([
    ProModule.countDocuments({ trackKey: TRACK_KEY }),
    ProTopic.countDocuments({ trackKey: TRACK_KEY }),
    ProExercise.countDocuments({ trackKey: TRACK_KEY }),
    ProExercise.aggregate([{ $match: { trackKey: TRACK_KEY } }, { $group: { _id: null, xp: { $sum: "$xpReward" } } }]),
  ]);
  const totalXp = (exAgg[0]?.xp || 0) + 50; // exercises + topic completion
  await ProTrack.updateOne({ key: TRACK_KEY }, { $set: { totalModules, totalTopics, totalExercises, totalXp } });
  console.log(`\nTrack aggregates updated: ${totalModules} modules / ${totalTopics} topics / ${totalExercises} exercises / ${totalXp} XP`);

  console.log("\n✓ Java pilot seed complete.");
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
