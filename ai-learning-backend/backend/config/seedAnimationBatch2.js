/**
 * seedAnimationBatch2.js — Track-2 animation expansion (DSA_ANIMATOR_GAP_CHECKLIST.md).
 * 8 more flagship problems on the EXISTING three <StepPlayer> renderers
 * (array-pointers / stack / grid) — pure step-data, no frontend change.
 * Additive & idempotent. Brings animated coverage from 13 → 21 problems.
 *
 * Usage: node config/seedAnimationBatch2.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // ── array-pointers ──────────────────────────────────────────────────────────
  // #75 Sort Colors — Dutch National Flag (low / mid / high).
  java_m30_t4_ex_3: {
    kind: "array-pointers", label: "Sort Colors (Dutch flag)",
    array: [2, 0, 2, 1, 1, 0],
    steps: [
      { array: [2, 0, 2, 1, 1, 0], pointers: { low: 0, mid: 0, high: 5 }, note: "low = next 0 slot, high = next 2 slot, mid scans.", caption: "mid=2 → swap mid,high; high--" },
      { array: [0, 0, 2, 1, 1, 2], pointers: { low: 0, mid: 0, high: 4 }, note: "After the swap, mid now holds 0.", caption: "mid=0 → swap low,mid; low++ mid++" },
      { array: [0, 0, 2, 1, 1, 2], pointers: { low: 1, mid: 1, high: 4 }, note: "Another 0 at mid.", caption: "mid=0 → swap low,mid; low++ mid++" },
      { array: [0, 0, 2, 1, 1, 2], pointers: { low: 2, mid: 2, high: 4 }, note: "mid holds 2.", caption: "mid=2 → swap mid,high; high--" },
      { array: [0, 0, 1, 1, 2, 2], pointers: { low: 2, mid: 2, high: 3 }, note: "After swap, mid holds 1.", caption: "mid=1 → mid++ (1s stay put)" },
      { array: [0, 0, 1, 1, 2, 2], pointers: { low: 2, mid: 3, high: 3 }, note: "mid=1 again; mid passes high next → done.", caption: "mid=1 → mid++" },
      { array: [0, 0, 1, 1, 2, 2], note: "Sorted in one pass, O(1) space.", result: "[0, 0, 1, 1, 2, 2]", mark: { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match", 5: "match" } },
    ],
  },
  // #42 Trapping Rain Water — two pointers bounded by the running max walls.
  java_m30_t1_ex_12: {
    kind: "array-pointers", label: "Trapping Rain Water", meta: { rule: "process the shorter side" },
    array: [4, 2, 0, 3, 2, 5],
    steps: [
      { pointers: { L: 0, R: 5 }, window: [0, 5], note: "maxL=4, maxR=5. Left wall is shorter → water on the left is bounded by maxL.", caption: "water += 4-4 = 0 · total 0" },
      { pointers: { L: 1, R: 5 }, window: [1, 5], note: "Water above a cell = maxL − height.", caption: "water += 4-2 = 2 · total 2" },
      { pointers: { L: 2, R: 5 }, window: [2, 5], note: "Deepest cell traps the most.", caption: "water += 4-0 = 4 · total 6" },
      { pointers: { L: 3, R: 5 }, window: [3, 5], note: "Keep going while the left wall is the shorter side.", caption: "water += 4-3 = 1 · total 7" },
      { pointers: { L: 4, R: 5 }, window: [4, 5], note: "L meets R after this.", caption: "water += 4-2 = 2 · total 9" },
      { pointers: { L: 5, R: 5 }, note: "All cells processed.", result: "9" },
    ],
  },
  // #35 Search Insert Position — classic binary search (lo / mid / hi).
  java_m39_t1_ex_4: {
    kind: "array-pointers", label: "Search Insert Position", meta: { target: 5 },
    array: [1, 3, 5, 6],
    steps: [
      { pointers: { lo: 0, mid: 1, hi: 3 }, window: [0, 3], note: "Binary search for the target (or where it would go).", caption: "mid=3 < 5 → discard left half" },
      { pointers: { lo: 2, mid: 2, hi: 3 }, window: [2, 3], note: "Check the middle of the remaining half.", caption: "mid=5 = 5 → found", mark: { 2: "match" } },
      { pointers: { lo: 2, hi: 3 }, note: "Target located at index 2.", result: "2" },
    ],
  },

  // ── stack ────────────────────────────────────────────────────────────────────
  // #20 Valid Parentheses.
  java_m33_t1_ex_1: {
    kind: "stack", label: "Valid Parentheses",
    array: ["(", "[", "{", "}", "]", ")"],
    steps: [
      { cursor: 0, stack: ["("], note: "Opening bracket → push." },
      { cursor: 1, stack: ["(", "["], note: "Opening → push." },
      { cursor: 2, stack: ["(", "[", "{"], note: "Opening → push." },
      { cursor: 3, stack: ["(", "["], note: "'}' matches the top '{' → pop." },
      { cursor: 4, stack: ["("], note: "']' matches the top '[' → pop." },
      { cursor: 5, stack: [], note: "')' matches the top '(' → pop." },
      { stack: [], note: "Stack empty at the end → all brackets matched.", result: "true" },
    ],
  },
  // #150 Evaluate Reverse Polish Notation.
  java_m33_t1_ex_5: {
    kind: "stack", label: "Evaluate RPN",
    array: ["2", "1", "+", "3", "*"],
    steps: [
      { cursor: 0, stack: [2], note: "Number → push." },
      { cursor: 1, stack: [2, 1], note: "Number → push." },
      { cursor: 2, stack: [3], note: "'+' → pop 1 and 2, push 2 + 1 = 3." },
      { cursor: 3, stack: [3, 3], note: "Number → push." },
      { cursor: 4, stack: [9], note: "'*' → pop 3 and 3, push 3 * 3 = 9.", result: "9" },
    ],
  },
  // #155 Min Stack — each cell carries (value, min-so-far) shown as v / sub.
  java_m33_t1_ex_2: {
    kind: "stack", label: "Min Stack — cell = (value, min)",
    steps: [
      { stack: [{ v: -2, i: -2 }], note: "push(-2). Each cell stores the value and the running min.", caption: "getMin() = -2" },
      { stack: [{ v: -2, i: -2 }, { v: 0, i: -2 }], note: "push(0). Min stays -2.", caption: "getMin() = -2" },
      { stack: [{ v: -2, i: -2 }, { v: 0, i: -2 }, { v: -3, i: -3 }], note: "push(-3). New min is -3.", caption: "getMin() = -3" },
      { stack: [{ v: -2, i: -2 }, { v: 0, i: -2 }], note: "pop() removes (-3); the stored min reverts automatically — getMin is O(1).", caption: "getMin() = -2", result: "getMin → -2" },
    ],
  },

  // ── grid ──────────────────────────────────────────────────────────────────────
  // #542 01 Matrix — multi-source BFS distance to nearest 0 (rings fill outward).
  java_m30_5_t5_ex_4: {
    kind: "grid", label: "01 Matrix (multi-source BFS)",
    palette: { "0": "rgba(120,120,128,0.12)" },
    steps: [
      { grid: [[0, 0, 0], [0, "·", 0], ["·", "·", "·"]], note: "Every 0 starts at distance 0; unknowns are blank.", caption: "ring 0" },
      { grid: [[0, 0, 0], [0, 1, 0], [1, "·", 1]], cls: { "1,1": "frontier", "2,0": "frontier", "2,2": "frontier" }, note: "Ring 1 — cells touching a 0 get distance 1.", caption: "ring 1" },
      { grid: [[0, 0, 0], [0, 1, 0], [1, 2, 1]], cls: { "2,1": "frontier" }, note: "Ring 2 — the last cell is 2 steps from the nearest 0.", caption: "ring 2", result: "[[0,0,0],[0,1,0],[1,2,1]]" },
    ],
  },
  // #130 Surrounded Regions — border-connected O's are safe; the rest flip to X.
  java_m30_5_t2_ex_6: {
    kind: "grid", label: "Surrounded Regions",
    palette: { O: "rgba(48,209,88,0.14)", X: "rgba(120,120,128,0.12)" },
    steps: [
      { grid: [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]], cls: { "3,1": "source" }, note: "Find O's connected to the BORDER — only those survive. The single border O is (3,1).", caption: "mark from the border" },
      { grid: [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]], cls: { "3,1": "path" }, note: "DFS from border O's marks them safe; (3,1) reaches no interior O.", caption: "the inner region is fully surrounded" },
      { grid: [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]], cls: { "3,1": "path" }, note: "Every unmarked O is captured → flipped to X. The safe border O stays.", result: "inner region captured" },
    ],
  },
};

const ALLOWED = new Set(Object.keys(ANIMATIONS));

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    if (!ALLOWED.has(exerciseId)) continue;
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.kind}, ${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ batch-2 animations: ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
