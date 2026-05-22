/**
 * Math Content Completeness Checklist — the canonical gate every board/grade
 * MUST pass before being considered "shipped".
 *
 * Per topic, requires:
 *  Top-level:
 *    1. key_formulas (non-empty)
 *    2. prerequisite_knowledge (non-empty)
 *  teaching_content (all 11 non-empty):
 *    3.  intuition (object with at least elevator_pitch)
 *    4.  derivation
 *    5.  worked_example
 *    6.  visual_description
 *    7.  svg_diagrams (≥ 1)
 *    8.  common_misconceptions (≥ 1)
 *    9.  shortcuts_and_tricks (≥ 1)
 *    10. when_to_use_this_method
 *    11. edge_cases (≥ 1)
 *    12. key_takeaway
 *    13. video_script_hooks
 *  Practice:
 *    14. ≥ 1 Question in DB matching the topicId
 *
 * Usage:
 *   node config/auditMathChecklist.mjs --board=CBSE --grade=10
 *   node config/auditMathChecklist.mjs --board=ICSE --grade=10
 *   node config/auditMathChecklist.mjs --prefix='^math9_'
 *   node config/auditMathChecklist.mjs --board=CBSE --grade=10 --verbose
 *
 * Exit code: 0 if all topics pass, 1 if any topic fails (CI-friendly).
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { Question } from "../models/index.js";
dotenv.config();

/* ── Arg parsing ─────────────────────────────────────────────────────────── */
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.length ? rest.join("=") : true];
  })
);
const board   = (args.board || "").toUpperCase();
const grade   = String(args.grade || "");
const prefix  = args.prefix;          // overrides board+grade
const verbose = !!args.verbose;

/* ── Resolve which topics to audit ───────────────────────────────────────── */
function buildTopicIdRegex() {
  if (prefix) return new RegExp(prefix);
  // Standardised board-prefixed convention: {board}_{subj}{grade}_ch{N}_{descriptor}
  // See SPEC_MATH_STANDARDIZATION.md §2.
  // Legacy prefixes (kept until migration completes):
  //   CBSE 1-8 — old `math{grade}_` (still v2 expansion; awaits standardization plow)
  //   ICSE 10  — old `icse10_` (awaits rename to icse_math10_)
  if (board === "CBSE" && grade === "9")  return /^cbse_math9_/;                       // ← standardised (pilot)
  if (board === "CBSE" && grade === "10") return /^cbse_math10_/;                      // ← standardised (re-keyed from ch\d+_)
  if (board === "ICSE" && grade === "10") return /^icse10_/;                           // legacy; flips to /^icse_math10_/ after standardization
  if (board === "CBSE" && /^[1-8]$/.test(grade)) return new RegExp(`^math${grade}_`);  // legacy v2
  throw new Error(`No topicId mapping for board=${board} grade=${grade}. Pass --prefix=<regex> instead.`);
}

/* ── Field checks ────────────────────────────────────────────────────────── */
function nonEmpty(v) {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return Boolean(v);
}

const CHECKLIST = [
  { key: "key_formulas",            path: ["key_formulas"] },
  { key: "prerequisite_knowledge",  path: ["prerequisite_knowledge"] },
  { key: "intuition",               path: ["teaching_content", "intuition"] },
  { key: "derivation",              path: ["teaching_content", "derivation"] },
  { key: "worked_example",          path: ["teaching_content", "worked_example"] },
  { key: "visual_description",      path: ["teaching_content", "visual_description"] },
  { key: "svg_diagrams",            path: ["teaching_content", "svg_diagrams"] },
  { key: "common_misconceptions",   path: ["teaching_content", "common_misconceptions"] },
  { key: "shortcuts_and_tricks",    path: ["teaching_content", "shortcuts_and_tricks"] },
  { key: "when_to_use_this_method", path: ["teaching_content", "when_to_use_this_method"] },
  { key: "edge_cases",              path: ["teaching_content", "edge_cases"] },
  { key: "key_takeaway",            path: ["teaching_content", "key_takeaway"] },
  { key: "video_script_hooks",      path: ["teaching_content", "video_script_hooks"] },
];

function getByPath(doc, path) {
  let v = doc;
  for (const p of path) v = v?.[p];
  return v;
}

/* ── Run ─────────────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const idRegex = buildTopicIdRegex();
  const scope = `${board || "—"} grade ${grade || "—"} (regex ${idRegex})`;

  const topics = await NcertTopicContent.find({
    subject: "Mathematics",
    topicId: { $regex: idRegex },
  }).lean();

  if (topics.length === 0) {
    console.log(`No topics found for ${scope}. Either nothing seeded yet, or the prefix is wrong.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // Question counts per topicId
  const qAgg = await Question.aggregate([
    { $match: { topicId: { $regex: idRegex } } },
    { $group: { _id: "$topicId", count: { $sum: 1 } } },
  ]);
  const qCount = new Map(qAgg.map((x) => [x._id, x.count]));

  const fieldFailCount = Object.fromEntries(CHECKLIST.map((c) => [c.key, 0]));
  let topicsWithGaps = 0;
  let topicsWithNoQs = 0;
  const failingTopics = [];

  for (const t of topics) {
    const failed = [];
    for (const c of CHECKLIST) {
      if (!nonEmpty(getByPath(t, c.path))) {
        failed.push(c.key);
        fieldFailCount[c.key]++;
      }
    }
    const qs = qCount.get(t.topicId) || 0;
    if (qs === 0) { failed.push("questions"); topicsWithNoQs++; }
    if (failed.length) {
      topicsWithGaps++;
      failingTopics.push({ topicId: t.topicId, name: t.name, failed, qs });
    }
  }

  const total = topics.length;
  const passing = total - topicsWithGaps;

  console.log("═".repeat(78));
  console.log(`MATH CONTENT CHECKLIST — ${scope}`);
  console.log("═".repeat(78));
  console.log(`Topics audited: ${total}`);
  console.log(`Passing all 14 checks: ${passing} / ${total}  (${Math.round(passing/total*100)}%)`);
  console.log(`Topics with at least one gap: ${topicsWithGaps}`);
  console.log(`Topics with 0 questions: ${topicsWithNoQs}`);
  console.log("");
  console.log("Per-check failure count:");
  console.log("─".repeat(78));
  for (const c of CHECKLIST) {
    const f = fieldFailCount[c.key];
    const mark = f === 0 ? "✓" : "✗";
    console.log(`  ${mark}  ${c.key.padEnd(28)} failing on ${String(f).padStart(3)} topic${f === 1 ? "" : "s"}`);
  }
  const qMark = topicsWithNoQs === 0 ? "✓" : "✗";
  console.log(`  ${qMark}  ${"questions (≥1)".padEnd(28)} failing on ${String(topicsWithNoQs).padStart(3)} topic${topicsWithNoQs === 1 ? "" : "s"}`);

  if (verbose && failingTopics.length) {
    console.log("\nFailing topics (detailed):");
    console.log("─".repeat(78));
    for (const f of failingTopics.slice(0, 100)) {
      console.log(`  ${f.topicId}  (${(f.name || "").slice(0, 50)})`);
      console.log(`    qs: ${f.qs}  ·  missing: ${f.failed.join(", ")}`);
    }
    if (failingTopics.length > 100) console.log(`  ... + ${failingTopics.length - 100} more`);
  }

  console.log("═".repeat(78));
  if (topicsWithGaps === 0) {
    console.log("RESULT: ✓ PASS — every topic clears all 14 checks.");
  } else {
    console.log(`RESULT: ✗ FAIL — ${topicsWithGaps} topic${topicsWithGaps === 1 ? "" : "s"} need${topicsWithGaps === 1 ? "s" : ""} content/questions before shipping.`);
    if (!verbose) console.log("Run with --verbose to see exactly which topics + fields.");
  }
  console.log("═".repeat(78));

  await mongoose.disconnect();
  process.exit(topicsWithGaps === 0 ? 0 : 1);
}

run().catch((err) => { console.error(err); process.exit(2); });
