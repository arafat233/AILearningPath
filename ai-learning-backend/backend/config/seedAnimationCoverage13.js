/**
 * seedAnimationCoverage13.js — GAP #1 animation coverage, batch 13.
 * Kills the 3 real ZERO-coverage patterns the audit flagged:
 *   tree-traversal (tree renderer), binary-search-on-answer (array-pointers),
 *   stack-queue (stack / array-pointers). Pure step-data, NO frontend change.
 * Idempotent. Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const W = 380;
function tree(arr) {
  const nodes = [], edges = []; let maxL = 0;
  arr.forEach((v, i) => { if (v == null) return; const L = Math.floor(Math.log2(i + 1)); maxL = Math.max(maxL, L); const inL = i - (2 ** L - 1), cnt = 2 ** L; nodes.push({ id: i, v, x: Math.round(W * (inL + 0.5) / cnt), y: 26 + L * 52 }); const p = Math.floor((i - 1) / 2); if (i > 0 && arr[p] != null) edges.push([p, i]); });
  return { nodes, edges, W, H: 26 + maxL * 52 + 24 };
}
const T7 = [1, 2, 3, 4, 5, 6, 7];

const ANIMATIONS = {
  // tree-traversal ---------------------------------------------------------
  java_m35_t1_ex_1: {
    kind: "tree", label: "Inorder Traversal (L, node, R)", outLabel: "inorder", ...tree(T7),
    steps: [
      { cls: { 3: "current" }, output: [4], note: "Go all the way left first." },
      { cls: { 3: "visited", 1: "current" }, output: [4, 2], note: "Visit a node AFTER its left subtree." },
      { cls: { 3: "visited", 1: "visited", 4: "visited", 0: "current" }, output: [4, 2, 5, 1], note: "Left done → visit root → go right." },
      { cls: { 0: "visited" }, output: [4, 2, 5, 1, 6, 3, 7], note: "Inorder of a BST = sorted order.", result: "4 2 5 1 6 3 7" },
    ],
  },
  java_m35_t1_ex_3: {
    kind: "tree", label: "Level-Order (BFS)", outLabel: "level order", ...tree(T7),
    steps: [
      { cls: { 0: "current" }, output: [1], note: "Queue-based BFS; snapshot the level size before each level." },
      { cls: { 0: "visited", 1: "current", 2: "current" }, output: [1, 2, 3], note: "Process all nodes of a level, enqueue their children." },
      { cls: { 0: "visited", 1: "visited", 2: "visited" }, output: [1, 2, 3, 4, 5, 6, 7], note: "Top-down, left-to-right.", result: "[[1],[2,3],[4,5,6,7]]" },
    ],
  },
  java_m35_t1_ex_4: {
    kind: "tree", label: "Maximum Depth (#104)", ...tree(T7),
    steps: [
      { cls: { 0: "current" }, note: "depth(node) = 1 + max(depth(left), depth(right))." },
      { cls: { 0: "path", 1: "path", 3: "path" }, note: "Longest root-to-leaf chain." },
      { cls: { 0: "path", 1: "path", 3: "match" }, note: "Height = number of levels.", result: "3" },
    ],
  },
  java_m35_t1_ex_5: {
    kind: "tree", label: "Right Side View (#199)", ...tree(T7),
    steps: [
      { cls: { 0: "match" }, note: "BFS each level; keep the LAST node seen per level." },
      { cls: { 0: "match", 2: "match", 6: "match" }, note: "Rightmost of levels 0,1,2.", result: "[1, 3, 7]" },
    ],
  },
  java_m35_t1_ex_6: {
    kind: "tree", label: "Zigzag Level Order (#103)", outLabel: "zigzag", ...tree(T7),
    steps: [
      { cls: { 0: "current" }, output: [1], note: "Level 0 left→right." },
      { cls: { 1: "current", 2: "current" }, output: [1, 3, 2], note: "Level 1 reversed (right→left)." },
      { cls: {}, output: [1, 3, 2, 4, 5, 6, 7], note: "Alternate direction each level.", result: "[[1],[3,2],[4,5,6,7]]" },
    ],
  },
  java_m35_t1_ex_7: {
    kind: "tree", label: "Symmetric Tree (#101)", ...tree([1, 2, 2, 3, 4, 4, 3]),
    steps: [
      { cls: { 1: "current", 2: "current" }, note: "Compare the two subtrees as mirror images." },
      { cls: { 3: "match", 6: "match", 4: "match", 5: "match" }, note: "left.left ↔ right.right, left.right ↔ right.left.", result: "true (symmetric)" },
    ],
  },

  // binary-search-on-answer ------------------------------------------------
  java_m39_t2_ex_2: {
    kind: "array-pointers", label: "Koko Eating Bananas (#875)", meta: { h: 8 },
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    steps: [
      { pointers: { lo: 0, mid: 5, hi: 10 }, note: "Search the ANSWER (eating speed), not the array. feasible = hours(speed) ≤ h." },
      { pointers: { lo: 0, mid: 2, hi: 4 }, window: [3, 10], note: "feasible(6)=true → try slower; monotonic, so go left.", mark: { 5: "kept" } },
      { pointers: { lo: 3, mid: 3, hi: 3 }, mark: { 3: "match" }, note: "speed 4: 1+2+2+3 = 8 ≤ 8 ✓, speed 3 = 10 > 8 ✗.", result: "min speed = 4" },
    ],
  },
  java_m39_t2_ex_3: {
    kind: "array-pointers", label: "Capacity to Ship in D Days (#1011)",
    array: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    steps: [
      { pointers: { lo: 0, mid: 4, hi: 9 }, note: "Binary-search the ship CAPACITY; feasible = days(cap) ≤ D." },
      { pointers: { lo: 0, mid: 1, hi: 3 }, window: [4, 9], note: "Bigger capacity ⇒ fewer days (monotonic) → shrink toward the minimum feasible." },
      { pointers: { lo: 1, mid: 1, hi: 1 }, mark: { 1: "match" }, note: "Smallest capacity that ships within D days.", result: "min capacity" },
    ],
  },
  java_m39_t2_ex_4: {
    kind: "array-pointers", label: "Split Array Largest Sum (#410)",
    array: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    steps: [
      { pointers: { lo: 0, mid: 4, hi: 8 }, note: "Search the largest-subarray-sum; feasible = #splits(limit) ≤ m." },
      { pointers: { lo: 2, mid: 3, hi: 4 }, window: [4, 8], note: "Greedy feasibility: walk left→right, cut when the running sum would exceed the limit." },
      { pointers: { lo: 3, mid: 3, hi: 3 }, mark: { 3: "match" }, note: "Minimum 'largest sum' achievable with m parts.", result: "min largest sum" },
    ],
  },

  // stack-queue ------------------------------------------------------------
  java_m33_t5_ex_4: {
    kind: "stack", label: "Basic Calculator \"1+(2-3)\"", outLabel: "result",
    array: ["1", "+", "(", "2", "-", "3", ")"],
    steps: [
      { cursor: 2, stack: [1, "+"], note: "On '(' push the running result and sign, then reset." },
      { cursor: 6, stack: [1, "+"], output: [-1], note: "Evaluate inside the parens: 2 − 3 = −1." },
      { cursor: 6, stack: [], output: [0], note: "On ')' pop and combine: 1 + (−1) = 0.", result: "0" },
    ],
  },
  java_m33_t5_ex_8: {
    kind: "array-pointers", label: "Browser History (#1472)",
    array: ["home", "a", "b", "c"],
    steps: [
      { pointers: { cur: 3 }, note: "visit(url) appends and moves 'cur' there; truncates any forward history." },
      { pointers: { cur: 1 }, mark: { 2: "dropped", 3: "dropped" }, note: "back(2): move cur left by 2 (clamped at 0)." },
      { pointers: { cur: 2 }, note: "forward(1): move cur right (clamped at the end).", result: "at \"b\"" },
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
  console.log(`\n✅ coverage-13 (ZERO patterns): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
