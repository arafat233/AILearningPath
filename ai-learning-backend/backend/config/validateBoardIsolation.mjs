/**
 * Board Isolation Validator
 *
 * Catches the exact bug that happened with ICSE ch19-25:
 * seed script tagged questions with examBoard:"CBSE" even though
 * the topicId prefix clearly says ICSE.
 *
 * Checks:
 *   1. Questions where topicId prefix implies board X but examBoard = Y
 *   2. Topic docs where topicId prefix implies board X but examBoard = Y
 *
 * Usage:
 *   node config/validateBoardIsolation.mjs           # report only
 *   node config/validateBoardIsolation.mjs --fix      # auto-fix mismatches
 *   node config/validateBoardIsolation.mjs --board=ICSE  # scope to one board
 *
 * Exit code: 0 = clean, 1 = mismatches found (use in CI to block bad seeds)
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const shouldFix  = process.argv.includes("--fix");
const boardScope = (process.argv.find(a => a.startsWith("--board=")) || "").replace("--board=", "").toUpperCase() || null;

// ── Same prefix rules as boardFilter.js ──────────────────────────────────────
const BOARD_PREFIX_RULES = [
  { regex: /^icse[_\d]/, board: "ICSE" },
  { regex: /^ssc_/,      board: "SSC"  },
  { regex: /^ib_/,       board: "IB"   },
];

function boardFromTopicId(topicId) {
  if (!topicId) return null;
  for (const rule of BOARD_PREFIX_RULES) {
    if (rule.regex.test(topicId)) return rule.board;
  }
  return null;
}

await mongoose.connect(process.env.MONGO_URI);
const { Question, Topic } = await import("../models/index.js");

let totalMismatches = 0;

async function checkCollection(Model, collName) {
  // Find all docs that have a topicId we can derive a board from
  const docs = await Model.find(
    { topicId: { $exists: true, $ne: null } },
    { topicId: 1, examBoard: 1 }
  ).lean();

  const mismatches = [];
  for (const doc of docs) {
    const expectedBoard = boardFromTopicId(doc.topicId);
    if (!expectedBoard) continue; // CBSE or unknown — skip
    if (boardScope && expectedBoard !== boardScope) continue;
    const actual = (doc.examBoard || "").toUpperCase();
    if (actual !== expectedBoard) {
      mismatches.push({ _id: doc._id, topicId: doc.topicId, actual, expected: expectedBoard });
    }
  }

  if (mismatches.length === 0) {
    console.log(`  ✓  ${collName}: no mismatches`);
    return 0;
  }

  console.log(`  ✗  ${collName}: ${mismatches.length} mismatch${mismatches.length > 1 ? "es" : ""}`);
  for (const m of mismatches.slice(0, 20)) {
    console.log(`       ${m.topicId}  →  examBoard="${m.actual}" (should be "${m.expected}")`);
  }
  if (mismatches.length > 20) console.log(`       ... and ${mismatches.length - 20} more`);

  if (shouldFix) {
    // Group by expected board for efficient bulk update
    const byBoard = {};
    for (const m of mismatches) {
      if (!byBoard[m.expected]) byBoard[m.expected] = [];
      byBoard[m.expected].push(m._id);
    }
    for (const [board, ids] of Object.entries(byBoard)) {
      const result = await Model.updateMany({ _id: { $in: ids } }, { $set: { examBoard: board } });
      console.log(`       ↳ Fixed ${result.modifiedCount} docs → examBoard="${board}"`);
    }
  }

  return mismatches.length;
}

console.log("\n═══════════════════════════════════════════════");
console.log("  BOARD ISOLATION VALIDATION");
if (boardScope) console.log(`  Scope: ${boardScope} only`);
if (shouldFix)  console.log("  Mode: AUTO-FIX enabled");
console.log("═══════════════════════════════════════════════");

totalMismatches += await checkCollection(Question, "questions");
totalMismatches += await checkCollection(Topic,    "topics   ");

console.log("═══════════════════════════════════════════════");
if (totalMismatches === 0) {
  console.log("  RESULT: ✓ PASS — all examBoard fields match topicId prefixes");
} else if (shouldFix) {
  console.log(`  RESULT: fixed ${totalMismatches} mismatch${totalMismatches > 1 ? "es" : ""}`);
} else {
  console.log(`  RESULT: ✗ FAIL — ${totalMismatches} mismatch${totalMismatches > 1 ? "es" : ""}`);
  console.log("  Run with --fix to auto-correct, or fix the seed script.");
}
console.log("═══════════════════════════════════════════════\n");

await mongoose.disconnect();
process.exit(totalMismatches === 0 || shouldFix ? 0 : 1);
