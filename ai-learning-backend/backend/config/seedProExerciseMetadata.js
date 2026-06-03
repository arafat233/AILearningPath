/**
 * seedProExerciseMetadata.js — Track-2 quick wins (DSA_ANIMATOR_GAP_CHECKLIST.md).
 *
 * Backfills three interview-prep fields on the DSA modules' ProExercise docs:
 *   leetcodeId — parsed from "#<N>" in the title (recognizability / search)
 *   pattern    — cross-cutting DSA pattern (two-pointers, sliding-window, graphs…)
 *   priority   — P1 must-do / P2 important / P3 good-to-know
 *                P1 = LC number in the curated high-frequency interview set
 *                P2 = has an LC number but not in the P1 set
 *                P3 = no LC number (concept/skill exercise)
 *
 * Idempotent: pure updateOne($set) keyed by exerciseId. Re-run safe. Only touches
 * DSA modules (m29..m41, m30_5, m41_5, m47, m48); non-DSA modules are left null.
 *
 * Usage: node config/seedProExerciseMetadata.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const TRACK = "pro_java";

// DSA modules only — pattern/priority are interview-DSA concepts.
const DSA_MODULES = [
  "java_m29", "java_m30", "java_m30_5", "java_m31", "java_m32", "java_m33",
  "java_m34", "java_m35", "java_m36", "java_m37", "java_m38", "java_m39",
  "java_m40", "java_m41", "java_m41_5", "java_m47", "java_m48",
];

// Default pattern per module; topic-level overrides below win when present.
const MODULE_PATTERN = {
  java_m29: "complexity-analysis", java_m30: "arrays", java_m30_5: "matrix",
  java_m31: "strings", java_m32: "linked-list", java_m33: "stack-queue",
  java_m34: "hashing", java_m35: "trees", java_m36: "heap", java_m37: "graphs",
  java_m38: "sorting", java_m39: "binary-search", java_m40: "backtracking",
  java_m41: "dynamic-programming", java_m41_5: "greedy-intervals",
  java_m47: "bit-manipulation", java_m48: "recursion",
};
const TOPIC_PATTERN = {
  java_m30_t1: "two-pointers", java_m30_t2: "sliding-window", java_m30_t3: "prefix-sum", java_m30_t4: "two-pointers",
  java_m31_t2: "pattern-matching", java_m31_t3: "palindrome", java_m31_t4: "hashing", java_m31_t5: "dynamic-programming",
  java_m33_t1: "stack", java_m33_t2: "monotonic-stack", java_m33_t3: "queue", java_m33_t4: "queue",
  java_m35_t1: "tree-traversal", java_m35_t2: "tree-dfs", java_m35_t3: "bst", java_m35_t4: "tree-dfs", java_m35_t5: "trie",
  java_m37_t1: "graph-traversal", java_m37_t2: "graph-traversal", java_m37_t3: "topological-sort", java_m37_t4: "shortest-path", java_m37_t5: "union-find",
  java_m39_t2: "binary-search-on-answer", java_m39_t3: "binary-search",
  java_m41_5_t1: "greedy", java_m41_5_t2: "intervals",
};

// P1 = high-frequency interview problems (the dsaanimator.com curated ~165 set,
// i.e. Blind-75 / NeetCode-150 territory). Anything LC-tagged outside this is P2.
const P1_LEETCODE = new Set([
  1, 2, 3, 4, 5, 11, 13, 14, 15, 17, 19, 20, 21, 22, 23, 25, 26, 33, 34, 35, 36,
  37, 39, 41, 42, 45, 46, 48, 49, 51, 53, 54, 55, 56, 57, 59, 62, 63, 70, 72, 73,
  74, 75, 76, 77, 78, 79, 81, 83, 84, 85, 88, 90, 91, 92, 98, 101, 102, 103, 104,
  105, 108, 110, 112, 113, 114, 120, 121, 124, 125, 128, 129, 133, 134, 135, 137,
  138, 141, 143, 150, 152, 153, 155, 162, 167, 169, 189, 191, 198, 199, 200, 202,
  205, 206, 207, 209, 210, 213, 215, 217, 224, 226, 230, 231, 234, 236, 238, 240,
  242, 253, 260, 268, 271, 287, 295, 297, 300, 322, 338, 344, 347, 371, 383, 389,
  399, 410, 417, 424, 435, 438, 452, 496, 509, 543, 560, 567, 621, 637, 643, 647,
  680, 739, 743, 746, 787, 875, 876, 973, 977, 994, 1004, 1011, 1046, 1143, 1189,
  1971,
]);

function patternFor(topicId, moduleId) {
  return TOPIC_PATTERN[topicId] || MODULE_PATTERN[moduleId] || null;
}
function leetcodeFrom(title) {
  const m = (title || "").match(/#(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}
function priorityFor(lc) {
  if (lc == null) return "P3";
  return P1_LEETCODE.has(lc) ? "P1" : "P2";
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  const docs = await Exr.find({ trackKey: TRACK, moduleId: { $in: DSA_MODULES } })
    .project({ exerciseId: 1, topicId: 1, moduleId: 1, title: 1 }).toArray();

  const tally = { P1: 0, P2: 0, P3: 0, withLc: 0, withPattern: 0 };
  let updated = 0;
  for (const d of docs) {
    const leetcodeId = leetcodeFrom(d.title);
    const pattern = patternFor(d.topicId, d.moduleId);
    const priority = priorityFor(leetcodeId);
    await Exr.updateOne({ exerciseId: d.exerciseId }, { $set: { leetcodeId, pattern, priority } });
    updated++;
    tally[priority]++;
    if (leetcodeId != null) tally.withLc++;
    if (pattern) tally.withPattern++;
  }

  console.log(`✓ tagged ${updated} DSA exercises`);
  console.log(`   priority: P1=${tally.P1}  P2=${tally.P2}  P3=${tally.P3}`);
  console.log(`   leetcodeId set: ${tally.withLc}  | pattern set: ${tally.withPattern}`);
  const patterns = await Exr.distinct("pattern", { trackKey: TRACK, pattern: { $ne: null } });
  console.log(`   distinct patterns (${patterns.length}): ${patterns.sort().join(", ")}`);
  console.log(`\n✅ Track-2 metadata backfill complete.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
