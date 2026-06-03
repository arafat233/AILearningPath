/**
 * seedAnimationCoverage7.js — GAP #1 animation coverage, batch 7 (tree / BST).
 * Uses the NEW <StepPlayer> "tree" renderer (SVG nodes+edges, cls highlighting,
 * traversal output). `tree(levelOrder)` lays out nodes/edges from a level-order
 * array (null = missing). Idempotent. Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const W = 380;
function tree(arr) {
  const nodes = [], edges = [];
  let maxLevel = 0;
  arr.forEach((v, i) => {
    if (v === null || v === undefined) return;
    const level = Math.floor(Math.log2(i + 1));
    maxLevel = Math.max(maxLevel, level);
    const inLevel = i - (2 ** level - 1), cnt = 2 ** level;
    nodes.push({ id: i, v, x: Math.round(W * (inLevel + 0.5) / cnt), y: 28 + level * 56 });
    const par = Math.floor((i - 1) / 2);
    if (i > 0 && arr[par] !== null && arr[par] !== undefined) edges.push([par, i]);
  });
  return { nodes, edges, W, H: 28 + maxLevel * 56 + 28 };
}

const BST = [8, 3, 10, 1, 6, null, 14];

const ANIMATIONS = {
  // BST search — walk down comparing.
  java_m35_t3_ex_1: {
    kind: "tree", label: "BST Search (6)", ...tree(BST),
    steps: [
      { cls: { 0: "current" }, note: "Search 6: 6 < 8 → go left." },
      { cls: { 0: "visited", 1: "current" }, note: "6 > 3 → go right." },
      { cls: { 0: "visited", 1: "visited", 4: "match" }, note: "Found 6 in O(h) — never touched the right subtree.", result: "found" },
    ],
  },

  // BST insert — walk to the insertion point.
  java_m35_t3_ex_2: {
    kind: "tree", label: "BST Insert (7)", ...tree(BST),
    steps: [
      { cls: { 0: "current" }, note: "Insert 7: 7 < 8 → left." },
      { cls: { 0: "visited", 1: "current" }, note: "7 > 3 → right." },
      { cls: { 0: "visited", 1: "visited", 4: "path" }, note: "7 > 6 and 6 has no right child → 7 becomes 6's right child.", result: "inserted under 6" },
    ],
  },

  // #98 Validate BST — pass a (lo,hi) range down.
  java_m35_t3_ex_3: {
    kind: "tree", label: "Validate BST (range method)", ...tree(BST),
    steps: [
      { cls: { 0: "current" }, note: "Root valid in (−∞, +∞)." },
      { cls: { 0: "visited", 1: "current" }, note: "Left subtree must be < 8 → range (−∞, 8). 3 ✓" },
      { cls: { 0: "visited", 1: "visited", 4: "current" }, note: "6 must be in (3, 8) — pass the range DOWN, don't just compare with the parent.", caption: "3 < 6 < 8 ✓" },
      { cls: { 0: "visited", 1: "visited", 2: "visited", 4: "visited", 3: "visited", 6: "visited" }, note: "Every node respects its inherited range.", result: "valid BST" },
    ],
  },

  // #230 Kth Smallest — inorder traversal, stop at k.
  java_m35_t3_ex_4: {
    kind: "tree", label: "Kth Smallest (inorder, k=3)", outLabel: "inorder", ...tree(BST),
    steps: [
      { cls: { 3: "current" }, output: [1], note: "Inorder visits the smallest first (leftmost)." },
      { cls: { 3: "visited", 1: "current" }, output: [1, 3], note: "Left, node, right → ascending order." },
      { cls: { 3: "visited", 1: "visited", 4: "match" }, output: [1, 3, 6], note: "Stop at the kth value popped.", result: "3rd smallest = 6" },
    ],
  },

  // #235 LCA of BST — use ordering.
  java_m35_t3_ex_5: {
    kind: "tree", label: "LCA in BST (1, 6)", ...tree(BST),
    steps: [
      { cls: { 0: "current", 3: "match", 4: "match" }, note: "Both 1 and 6 are < 8 → the split can't be here, go left." },
      { cls: { 0: "visited", 1: "path", 3: "match", 4: "match" }, note: "At 3: 1 ≤ 3 ≤ 6 → the targets split here.", result: "LCA = 3" },
    ],
  },

  // #226 Invert Binary Tree — mirror (per-step node values).
  java_m35_t2_ex_6: {
    kind: "tree", label: "Invert Binary Tree",
    ...tree([1, 2, 3, 4, 5, 6, 7]),
    steps: [
      { nodes: tree([1, 2, 3, 4, 5, 6, 7]).nodes, note: "Original tree." },
      { nodes: tree([1, 3, 2, 7, 6, 5, 4]).nodes, note: "Swap every node's left and right child (recursively).", result: "mirrored" },
    ],
  },

  // #112 Path Sum — subtract target descending; check at a leaf.
  java_m35_t2_ex_3: {
    kind: "tree", label: "Path Sum (target 20)", ...tree([5, 4, 8, 11, 2, 13, 4]),
    steps: [
      { cls: { 0: "path" }, note: "target 20 − 5 = 15 remaining." },
      { cls: { 0: "path", 1: "path" }, note: "15 − 4 = 11 remaining." },
      { cls: { 0: "path", 1: "path", 3: "match" }, note: "Leaf 11, remaining 11 − 11 = 0 → a root-to-leaf path sums to 20.", result: "true" },
    ],
  },

  // #236 LCA of Binary Tree — both subtrees return non-null.
  java_m35_t2_ex_1: {
    kind: "tree", label: "LCA of Binary Tree (6, 2)", ...tree([3, 5, 1, 6, 2, 0, 8]),
    steps: [
      { cls: { 1: "current", 3: "match", 4: "match" }, note: "Recurse: left finds 6, right finds 2." },
      { cls: { 1: "path", 3: "match", 4: "match" }, note: "Both children return non-null at node 5 → it's the LCA.", result: "LCA = 5" },
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
  console.log(`\n✅ coverage-7 (tree/BST): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
