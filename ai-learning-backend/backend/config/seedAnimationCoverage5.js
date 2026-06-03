/**
 * seedAnimationCoverage5.js — GAP #1 animation coverage, batch 5 (grid family).
 * Existing <StepPlayer> "grid" renderer (grid + cls {visited|frontier|source|
 * path|wall} + cursor). Pure step-data, no frontend change. Idempotent.
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const cls = (...pairs) => Object.fromEntries(pairs);
const v = (k) => ([k, "visited"]);

const ANIMATIONS = {
  // #200 Number of Islands — DFS sink each component.
  java_m37_t2_ex_2: {
    kind: "grid", label: "Number of Islands",
    grid: [[1, 1, 0], [0, 1, 0], [0, 0, 1]],
    steps: [
      { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "Scan for land. A 1 starts a new island → count = 1." },
      { cursor: [1, 1], cls: cls(v("0,0"), v("0,1"), v("1,1")), note: "DFS floods the whole connected component, marking it visited." },
      { cursor: [2, 2], cls: cls(v("0,0"), v("0,1"), v("1,1"), ["2,2", "source"]), note: "Next unvisited 1 → island 2, count = 2." },
      { cursor: [2, 2], cls: cls(v("0,0"), v("0,1"), v("1,1"), v("2,2")), note: "No more land. Each DFS launch = one island.", result: "2" },
    ],
  },

  // #695 Max Area of Island — DFS, count cells.
  java_m37_t2_ex_3: {
    kind: "grid", label: "Max Area of Island",
    grid: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    steps: [
      { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "DFS from each land cell, counting cells in the component." },
      { cursor: [1, 2], cls: cls(v("0,0"), v("0,1"), v("1,1"), v("1,2")), note: "This island has 4 connected cells." },
      { cursor: [1, 2], cls: cls(v("0,0"), v("0,1"), v("1,1"), v("1,2")), note: "Largest island area seen.", result: "4" },
    ],
  },

  // #733 Flood Fill — recolor the connected region.
  java_m37_t2_ex_5: {
    kind: "grid", label: "Flood Fill (start (1,1)→2)",
    grid: [[1, 1, 1], [1, 1, 0], [1, 0, 1]],
    palette: { 2: "rgba(48,209,88,0.3)" },
    steps: [
      { grid: [[1, 1, 1], [1, 1, 0], [1, 0, 1]], cursor: [1, 1], cls: cls(["1,1", "source"]), note: "Start pixel = 1; flood all 4-connected 1s with the new color." },
      { grid: [[2, 2, 2], [2, 2, 0], [2, 0, 1]], note: "Every 1 reachable from the start becomes 2. The isolated bottom-right 1 stays.", result: "recolored region" },
    ],
  },

  // #54 Spiral Order — cursor walks the spiral.
  java_m30_5_t1_ex_3: {
    kind: "grid", label: "Spiral Matrix Order",
    grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    steps: [
      { cursor: [0, 2], cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"]), note: "Walk the top row left→right." },
      { cursor: [2, 2], cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"], ["1,2", "path"], ["2,2", "path"]), note: "Then the right column top→bottom." },
      { cursor: [1, 0], cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"], ["1,2", "path"], ["2,2", "path"], ["2,1", "path"], ["2,0", "path"], ["1,0", "path"]), note: "Bottom row right→left, then left column up. Shrink the boundary and repeat." },
      { cursor: [1, 1], cls: cls(["1,1", "source"]), note: "Center last.", result: "1 2 3 6 9 8 7 4 5" },
    ],
  },

  // #1091 Shortest Path in Binary Matrix — BFS, 8-directional.
  java_m30_5_t2_ex_4: {
    kind: "grid", label: "Shortest Path (BFS, 8-dir)",
    grid: [[0, 0, 0], [1, 1, 0], [1, 1, 0]],
    palette: { 1: "rgba(120,120,128,0.28)" },
    steps: [
      { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "BFS from top-left; the wave expands one ring at a time = shortest distance." },
      { cursor: [1, 2], cls: cls(v("0,0"), v("0,1"), v("0,2"), ["1,2", "frontier"]), note: "Frontier advances through open (0) cells, around the walls." },
      { cursor: [2, 2], cls: cls(v("0,0"), v("0,1"), v("0,2"), v("1,2"), ["2,2", "path"]), note: "First time we pop the target = shortest path length.", result: "4 cells" },
    ],
  },

  // #286 Walls and Gates — multi-source BFS from every gate.
  java_m30_5_t5_ex_2: {
    kind: "grid", label: "Walls and Gates (multi-source BFS)",
    grid: [["∞", "∞", 0], ["W", "∞", "∞"], ["∞", "∞", "∞"]],
    palette: { W: "rgba(120,120,128,0.28)", 0: "rgba(191,90,242,0.2)" },
    steps: [
      { cursor: [0, 2], cls: cls(["0,2", "source"]), note: "Seed the queue with ALL gates (0) at once." },
      { grid: [["∞", 1, 0], ["W", 2, 1], ["∞", "∞", 2]], cls: cls(["1,2", "frontier"], ["0,1", "frontier"]), note: "Expand all fronts together — each cell gets its distance to the nearest gate." },
      { grid: [["∞", 1, 0], ["W", 2, 1], [4, 3, 2]], note: "Walls (W) block the flood; unreachable cells stay ∞.", result: "distances filled" },
    ],
  },

  // #79 Word Search — DFS path matching "ABCCED".
  java_m30_5_t2_ex_7: {
    kind: "grid", label: "Word Search \"ABCCED\"",
    grid: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
    steps: [
      { cursor: [0, 0], cls: cls(["0,0", "path"]), note: "Find the first letter, then DFS in 4 directions matching the word." },
      { cursor: [1, 2], cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"], ["1,2", "path"]), note: "Mark cells on the current path so they aren't reused." },
      { cursor: [2, 1], cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"], ["1,2", "path"], ["2,2", "path"], ["2,1", "path"]), note: "A-B-C-C-E-D matched. Backtrack (unmark) if a branch dead-ends.", result: "true" },
    ],
  },

  // #48 Rotate Matrix 90° clockwise — transpose then reverse rows.
  java_m30_5_t1_ex_4: {
    kind: "grid", label: "Rotate Matrix 90° CW",
    grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    steps: [
      { grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], note: "Original matrix." },
      { grid: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], note: "Step 1 — transpose (swap a[i][j] ↔ a[j][i])." },
      { grid: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], note: "Step 2 — reverse each row → rotated 90° clockwise, in place.", result: "rotated" },
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
  console.log(`\n✅ coverage-5 (grid family): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
