/**
 * seedAnimationCoverage11.js — GAP #1 animation coverage, batch 11
 * (backtracking / recursion / trie / union-find). Reuses the "tree" renderer
 * (decision trees, prefix trees, DSU forests). Pure step-data, NO frontend change.
 * Idempotent. Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const W = 380;
// binary include/exclude tree from level-order labels
function btree(arr) {
  const nodes = [], edges = []; let maxL = 0;
  arr.forEach((v, i) => { if (v == null) return; const L = Math.floor(Math.log2(i + 1)); maxL = Math.max(maxL, L); const inL = i - (2 ** L - 1), cnt = 2 ** L; nodes.push({ id: i, v, x: Math.round(W * (inL + 0.5) / cnt), y: 26 + L * 50 }); const p = Math.floor((i - 1) / 2); if (i > 0 && arr[p] != null) edges.push([p, i]); });
  return { nodes, edges, W, H: 26 + maxL * 50 + 24 };
}
const n = (id, v, x, y) => ({ id, v, x, y });

const ANIMATIONS = {
  // Power Set [1,2] — include/exclude decision tree.
  java_m40_t1_ex_2: {
    kind: "tree", label: "Power Set [1,2] (include / exclude)",
    ...btree(["{}", "{1}", "{}", "{1,2}", "{1}", "{2}", "{}"]),
    steps: [
      { cls: { 0: "current" }, note: "At each element: branch into INCLUDE (left) or EXCLUDE (right)." },
      { cls: { 0: "visited", 1: "visited", 3: "path" }, note: "One full path = include 1, include 2 → {1,2}." },
      { cls: { 3: "match", 4: "match", 5: "match", 6: "match" }, note: "Every leaf is one subset → 2ⁿ leaves.", result: "[{1,2},{1},{2},{}]" },
    ],
  },

  // #46 Permutations [1,2,3] — pick an unused element at each level.
  java_m40_t2_ex_1: {
    kind: "tree", label: "Permutations [1,2,3]", W, H: 170,
    nodes: [n(0, "[ ]", 190, 26), n(1, "[1]", 70, 84), n(2, "[2]", 190, 84), n(3, "[3]", 310, 84), n(4, "[1,2]", 40, 142), n(5, "[1,3]", 110, 142)],
    edges: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]],
    steps: [
      { cls: { 0: "current" }, note: "Choose any element for the first slot (3 branches)." },
      { cls: { 0: "visited", 1: "current" }, note: "Then any UNUSED element for the next slot." },
      { cls: { 1: "visited", 4: "match", 5: "match" }, note: "Each root-to-leaf path is one permutation → n! leaves.", result: "6 permutations" },
    ],
  },

  // #39 Combination Sum — target shrinks; prune when negative.
  java_m40_t2_ex_3: {
    kind: "tree", label: "Combination Sum (target 7, [2,3,6])", W, H: 170,
    nodes: [n(0, "7", 190, 26), n(1, "5", 80, 84), n(2, "4", 190, 84), n(3, "1", 300, 84), n(4, "3", 40, 142), n(5, "0✓", 120, 142)],
    edges: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]],
    steps: [
      { cls: { 0: "current" }, note: "Subtract a candidate from the remaining target; recurse (reuse allowed)." },
      { cls: { 0: "visited", 1: "visited", 5: "match" }, note: "7 − 2 − 2 − 3 = 0 → a valid combination [2,2,3]." },
      { cls: { 3: "dropped" }, note: "Prune branches where the remainder goes negative.", result: "[[2,2,3],[7]…]" },
    ],
  },

  // Power set via recursion — same shape, different module.
  java_m48_t2_ex_1: {
    kind: "tree", label: "Power Set of [1,2] (recursion)",
    ...btree(["{}", "{1}", "{}", "{1,2}", "{1}", "{2}", "{}"]),
    steps: [
      { cls: { 0: "current" }, note: "subsets(i): take element i, or skip it, then recurse on i+1." },
      { cls: { 3: "match", 4: "match", 5: "match", 6: "match" }, note: "Base case (past the last index) emits one subset.", result: "2ⁿ = 4 subsets" },
    ],
  },

  // Trie basics — insert/search a prefix tree.
  java_m35_t5_ex_1: {
    kind: "tree", label: "Trie — insert cat/car/card", W: 360, H: 180,
    nodes: [n(0, "•", 60, 90), n(1, "c", 130, 90), n(2, "a", 200, 90), n(3, "t", 280, 50), n(4, "r", 280, 130), n(5, "d", 330, 130)],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]],
    steps: [
      { cls: { 0: "current" }, note: "Each edge is a character; shared prefixes share nodes." },
      { cls: { 0: "visited", 1: "visited", 2: "visited", 3: "match" }, note: "insert/search 'cat' → walk c→a→t, mark end. O(word length)." },
      { cls: { 0: "visited", 1: "visited", 2: "visited", 3: "match", 4: "match", 5: "match" }, note: "'car' and 'card' reuse the c→a prefix.", result: "3 words, shared prefix" },
    ],
  },

  // #208 Implement Trie — search vs startsWith.
  java_m35_t5_ex_2: {
    kind: "tree", label: "Implement Trie (search / startsWith)", W: 360, H: 180,
    nodes: [n(0, "•", 60, 90), n(1, "c", 130, 90), n(2, "a", 200, 90), n(3, "t", 280, 50), n(4, "r", 280, 130), n(5, "d", 330, 130)],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]],
    steps: [
      { cls: { 0: "visited", 1: "visited", 2: "visited", 4: "match" }, note: "search(\"car\") → reach node AND it is marked end → true." },
      { cls: { 0: "visited", 1: "visited" }, note: "startsWith(\"c\") → just need the path to exist (no end check) → true.", result: "O(m) each" },
    ],
  },

  // Union-Find — path compression flattens the forest.
  java_m37_t5_ex_2: {
    kind: "tree", label: "Union-Find (path compression)", W: 360, H: 180,
    nodes: [n(0, "0", 80, 40), n(1, "1", 80, 100), n(2, "2", 80, 160), n(3, "3", 250, 90)],
    edges: [[0, 1], [1, 2]],
    steps: [
      { cls: { 0: "current" }, note: "find(2) walks parent links up to the root (0)." },
      { nodes: [n(0, "0", 130, 50), n(1, "1", 70, 130), n(2, "2", 190, 130), n(3, "3", 290, 130)], edges: [[0, 1], [0, 2]], cls: { 0: "match" }, note: "Path compression re-points every node directly to the root → near-O(1)." },
    ],
  },

  // #547 Number of Provinces — union connected cities, count roots.
  java_m37_t5_ex_4: {
    kind: "tree", label: "Number of Provinces (#547)", W: 360, H: 150,
    nodes: [n(0, "0", 70, 60), n(1, "1", 70, 120), n(2, "2", 250, 60), n(3, "3", 250, 120)],
    edges: [[0, 1], [2, 3]],
    steps: [
      { cls: { 0: "current", 1: "current" }, note: "union(0,1) — they become one component." },
      { cls: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "union(2,3) — a second component. Count distinct roots.", result: "2 provinces" },
    ],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ coverage-11 (backtrack/trie/union-find): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
