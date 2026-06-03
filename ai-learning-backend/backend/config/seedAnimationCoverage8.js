/**
 * seedAnimationCoverage8.js — GAP #1 animation coverage, batch 8 (heap).
 * Reuses the existing "tree" renderer (a heap IS a complete binary tree) — pure
 * step-data, NO frontend change. Idempotent. Tracked in COMPETITIVE_GAP_ANALYSIS §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const W = 360;
function tree(arr) {
  const nodes = [], edges = []; let maxLevel = 0;
  arr.forEach((v, i) => {
    if (v === null || v === undefined) return;
    const level = Math.floor(Math.log2(i + 1)); maxLevel = Math.max(maxLevel, level);
    const inLevel = i - (2 ** level - 1), cnt = 2 ** level;
    nodes.push({ id: i, v, x: Math.round(W * (inLevel + 0.5) / cnt), y: 28 + level * 54 });
    const par = Math.floor((i - 1) / 2);
    if (i > 0 && arr[par] != null) edges.push([par, i]);
  });
  return { nodes, edges, W, H: 28 + maxLevel * 54 + 26 };
}

const ANIMATIONS = {
  // PriorityQueue basics — insert + sift-up (min-heap).
  java_m36_t1_ex_1: {
    kind: "tree", label: "Min-heap insert (sift-up)",
    ...tree([3, 5, 8]),
    steps: [
      { nodes: tree([3, 5, 8, 1]).nodes, edges: tree([3, 5, 8, 1]).edges, cls: { 3: "current" }, note: "Insert 1 at the next open slot, then bubble it up." },
      { nodes: tree([3, 1, 8, 5]).nodes, edges: tree([3, 1, 8, 5]).edges, cls: { 1: "current" }, note: "1 < parent 5 → swap up." },
      { nodes: tree([1, 3, 8, 5]).nodes, edges: tree([1, 3, 8, 5]).edges, cls: { 0: "match" }, note: "1 < parent 3 → reaches the root. offer() is O(log n).", result: "min at root" },
    ],
  },

  // #215 Kth Largest — min-heap of size k keeps the k largest.
  java_m36_t1_ex_2: {
    kind: "tree", label: "Kth Largest (#215, k=2)",
    ...tree([5, 6]),
    steps: [
      { ...tree([5, 6]), cls: { 0: "current" }, note: "Min-heap of size k=2; its root is the smallest of the k largest." },
      { ...tree([5, 6]), cls: { 0: "dropped" }, note: "New value ≤ root → ignore. Value > root → poll root, push new." },
      { ...tree([5, 6]), cls: { 0: "match" }, note: "After the scan, the root is the kth largest.", result: "5 (2nd largest)" },
    ],
  },

  // Heap Sort — build max-heap, repeatedly extract max to the end.
  java_m36_t1_ex_3: {
    kind: "tree", label: "Heap Sort",
    ...tree([4, 10, 3, 5, 1]),
    steps: [
      { ...tree([4, 10, 3, 5, 1]), note: "Start: arbitrary array as a complete tree." },
      { ...tree([10, 5, 3, 4, 1]), cls: { 0: "match" }, note: "heapify → max-heap (largest at root), O(n)." },
      { ...tree([10, 5, 3, 4, 1]), cls: { 0: "dropped" }, note: "Swap root↔last, shrink the heap, sift down. Repeat n times.", result: "[1,3,4,5,10]" },
    ],
  },

  // #347 Top K Frequent — min-heap of size k by frequency.
  java_m36_t1_ex_4: {
    kind: "tree", label: "Top K Frequent (#347, k=2)",
    ...tree(["2:f2", "1:f3"]),
    steps: [
      { ...tree(["2:f2", "1:f3"]), note: "Count frequencies (1→3, 2→2, 3→1). Keep a min-heap of size k by frequency." },
      { ...tree(["2:f2", "1:f3"]), cls: { 0: "current" }, note: "Pushing 3 (freq 1) would exceed k → poll the smallest frequency." },
      { ...tree(["2:f2", "1:f3"]), cls: { 0: "match", 1: "match" }, note: "Heap holds the k most frequent → O(n log k).", result: "[1, 2]" },
    ],
  },

  // #1046 Last Stone Weight — max-heap, smash the two heaviest.
  java_m36_t1_ex_6: {
    kind: "tree", label: "Last Stone Weight (#1046)",
    ...tree([8, 7, 4, 1, 1, 2, 1]),
    steps: [
      { ...tree([8, 7, 4, 1, 1, 2, 1]), cls: { 0: "current", 1: "current" }, note: "Max-heap → poll the two heaviest (8, 7)." },
      { ...tree([4, 1, 2, 1, 1, 1]), cls: { 0: "current" }, note: "8 − 7 = 1 goes back in. Smash again with the next two heaviest." },
      { ...tree([1]), cls: { 0: "match" }, note: "Repeat until ≤ 1 stone remains.", result: "1" },
    ],
  },

  // #253 Meeting Rooms II — min-heap of end times.
  java_m36_t1_ex_8: {
    kind: "tree", label: "Meeting Rooms II (#253)",
    ...tree([10, 30]),
    steps: [
      { ...tree([10, 30]), cls: { 0: "current" }, note: "Sort by start. Heap holds end times of ongoing meetings." },
      { ...tree([15, 30]), cls: { 0: "current" }, note: "Next start ≥ heap min → reuse that room (replace its end time)." },
      { ...tree([15, 30, 25]), cls: { 0: "match", 1: "match", 2: "match" }, note: "Else add a room. Heap size = rooms needed.", result: "max concurrent = 3" },
    ],
  },

  // #703 Kth Largest in a Stream — fixed-size-k min-heap.
  java_m36_t2_ex_1: {
    kind: "tree", label: "Kth Largest in Stream (#703, k=3)",
    ...tree([4, 5, 8]),
    steps: [
      { ...tree([4, 5, 8]), cls: { 0: "current" }, note: "Keep a min-heap of size k; root = current kth largest." },
      { ...tree([5, 8]), cls: { 0: "current" }, note: "add(): push, then if size > k poll the smallest." },
      { ...tree([5, 8]), cls: { 0: "match" }, note: "Return the root after each add — O(log k) per element.", result: "peek() = kth largest" },
    ],
  },

  // #973 K Closest Points — max-heap of size k by distance², evict farthest.
  java_m36_t1_ex_5: {
    kind: "tree", label: "K Closest Points (#973, k=2)",
    ...tree(["d²=2", "d²=10"]),
    steps: [
      { ...tree(["d²=2", "d²=10"]), cls: { 0: "current" }, note: "Max-heap of size k by distance²; root = the farthest kept so far." },
      { ...tree(["d²=2", "d²=10"]), cls: { 0: "dropped" }, note: "New point closer than the root → evict the farthest, push the new." },
      { ...tree(["d²=2", "d²=8"]), cls: { 0: "match", 1: "match" }, note: "Heap ends holding the k nearest points → O(n log k).", result: "k closest" },
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
  console.log(`\n✅ coverage-8 (heap): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
