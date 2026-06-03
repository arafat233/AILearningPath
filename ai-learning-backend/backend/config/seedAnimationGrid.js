/**
 * seedAnimationGrid.js — Track-2 step-by-step animation, PATTERN 4 of 4
 * (grid BFS/DFS). DSA_ANIMATOR_GAP_CHECKLIST.md Track-2.
 *
 * Uses the new <StepPlayer> "grid" renderer (2D cells, value palette + named
 * cell states visited/frontier/source/path, cursor highlight). Covers DFS
 * (islands, flood fill) and multi-source BFS (rotting oranges).
 * Additive & idempotent (updateOne $set by exerciseId).
 *
 * Usage: node config/seedAnimationGrid.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const LAND = "rgba(48,209,88,0.12)";
const WATER = "transparent";

const ANIMATIONS = {
  // #200 Number of Islands — DFS sinks each connected blob of '1's.
  java_m30_5_t2_ex_2: {
    kind: "grid", label: "Number of Islands", palette: { "1": LAND, "0": WATER },
    grid: [["1", "1", "0"], ["0", "1", "0"], ["0", "0", "1"]],
    steps: [
      { cursor: [0, 0], note: "Scan for land. '1' at (0,0) → a new island; count = 1. Start DFS.", caption: "islands = 1" },
      { cursor: [0, 0], cls: { "0,0": "visited" }, note: "DFS sinks (0,0) so it is never recounted." },
      { cursor: [0, 1], cls: { "0,0": "visited", "0,1": "visited" }, note: "DFS to the right neighbor (0,1)." },
      { cursor: [1, 1], cls: { "0,0": "visited", "0,1": "visited", "1,1": "visited" }, note: "DFS down to (1,1) — this island is fully sunk." },
      { cursor: [2, 2], cls: { "0,0": "visited", "0,1": "visited", "1,1": "visited", "2,2": "source" }, note: "Resume scanning. New unvisited '1' at (2,2) → count = 2.", caption: "islands = 2" },
      { cls: { "0,0": "visited", "0,1": "visited", "1,1": "visited", "2,2": "visited" }, note: "No more unvisited land remains.", result: "2" },
    ],
  },

  // #733 Flood Fill — DFS recolors the start cell's connected region.
  java_m30_5_t2_ex_3: {
    kind: "grid", label: "Flood Fill (start (1,1) → 2)",
    palette: { "2": "rgba(10,132,255,0.18)", "1": "rgba(48,209,88,0.12)", "0": "rgba(120,120,128,0.12)" },
    grid: [[1, 1, 1], [1, 1, 0], [1, 0, 1]],
    steps: [
      { grid: [[1, 1, 1], [1, 1, 0], [1, 0, 1]], cursor: [1, 1], note: "Flood fill from (1,1): recolor its connected region of 1s to 2.", caption: "start color = 1" },
      { grid: [[1, 1, 1], [2, 2, 0], [1, 0, 1]], cursor: [1, 0], note: "DFS recolors (1,1) then its neighbor (1,0)." },
      { grid: [[2, 2, 2], [2, 2, 0], [1, 0, 1]], note: "Spreads up into the whole top row." },
      { grid: [[2, 2, 2], [2, 2, 0], [2, 0, 1]], note: "And down-left to (2,0). The 0s block any further spread." },
      { grid: [[2, 2, 2], [2, 2, 0], [2, 0, 1]], note: "(2,2) is a 1 but separated by 0s, so it stays unchanged.", result: "[[2,2,2],[2,2,0],[2,0,1]]" },
    ],
  },

  // #994 Rotting Oranges — multi-source BFS; every minute spreads one ring.
  java_m37_t2_ex_4: {
    kind: "grid", label: "Rotting Oranges (multi-source BFS)",
    palette: { "2": "rgba(255,69,58,0.20)", "1": "rgba(48,209,88,0.14)", "0": "rgba(120,120,128,0.10)" },
    grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
    steps: [
      { grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]], note: "Minute 0 — start BFS from EVERY rotten orange (2) at once.", caption: "minute 0" },
      { grid: [[2, 2, 1], [2, 1, 0], [0, 1, 1]], note: "Minute 1 — fresh oranges (1) adjacent to a rotten one turn rotten.", caption: "minute 1" },
      { grid: [[2, 2, 2], [2, 2, 0], [0, 1, 1]], note: "Minute 2 — the rot front expands by one ring.", caption: "minute 2" },
      { grid: [[2, 2, 2], [2, 2, 0], [0, 2, 1]], note: "Minute 3.", caption: "minute 3" },
      { grid: [[2, 2, 2], [2, 2, 0], [0, 2, 2]], note: "Minute 4 — the last fresh orange rots.", caption: "minute 4" },
      { grid: [[2, 2, 2], [2, 2, 0], [0, 2, 2]], note: "No fresh oranges remain — answer is the minute count.", result: "4" },
    ],
  },
};

const ALLOWED = new Set(["java_m30_5_t2_ex_2", "java_m30_5_t2_ex_3", "java_m37_t2_ex_4"]);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    if (!ALLOWED.has(exerciseId)) { console.error(`✗ out of lane: ${exerciseId}`); continue; }
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ exercise not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ grid BFS/DFS animations: ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
