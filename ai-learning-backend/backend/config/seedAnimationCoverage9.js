/**
 * seedAnimationCoverage9.js — GAP #1 animation coverage, batch 9 (DP tables).
 * Reuses the existing "grid" renderer (a DP table IS a grid; cls marks filled/
 * answer cells, cursor = current cell). Pure step-data, NO frontend change.
 * Idempotent. Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // Fibonacci — 1-D tabulation.
  java_m41_t1_ex_2: {
    kind: "grid", label: "Fibonacci (tabulation)",
    steps: [
      { grid: [[0, 1, "·", "·", "·", "·", "·"]], cursor: [0, 2], note: "dp[i] = dp[i-1] + dp[i-2]; base dp[0]=0, dp[1]=1." },
      { grid: [[0, 1, 1, 2, 3, "·", "·"]], cursor: [0, 5], note: "Fill left → right, each cell from the two before it." },
      { grid: [[0, 1, 1, 2, 3, 5, 8]], cls: { "0,6": "path" }, note: "O(n) time, O(1) space (keep two vars).", result: "fib(6) = 8" },
    ],
  },

  // #70 Climbing Stairs — ways[i] = ways[i-1] + ways[i-2].
  java_m41_t1_ex_3: {
    kind: "grid", label: "Climbing Stairs (#70)",
    steps: [
      { grid: [[1, 1, "·", "·", "·", "·"]], cursor: [0, 2], note: "Ways to reach step i = ways(i-1) + ways(i-2)." },
      { grid: [[1, 1, 2, 3, "·", "·"]], cursor: [0, 4], note: "Same recurrence as Fibonacci." },
      { grid: [[1, 1, 2, 3, 5, 8]], cls: { "0,5": "path" }, note: "Distinct ways to climb 5 steps.", result: "8" },
    ],
  },

  // #198 House Robber — dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
  java_m41_t2_ex_1: {
    kind: "grid", label: "House Robber (#198)",
    steps: [
      { grid: [[2, 7, 9, 3, 1], [2, 7, "·", "·", "·"]], cursor: [1, 2], note: "Row 1 = houses. dp[i] = max(skip dp[i-1], rob dp[i-2]+nums[i])." },
      { grid: [[2, 7, 9, 3, 1], [2, 7, 11, 11, "·"]], cursor: [1, 4], note: "max(7, 2+9)=11 … max(11, 7+3)=11." },
      { grid: [[2, 7, 9, 3, 1], [2, 7, 11, 11, 12]], cls: { "1,4": "path" }, note: "max(11, 11+1)=12.", result: "12" },
    ],
  },

  // #746 Min Cost Climbing Stairs — dp[i] = cost[i] + min(dp[i-1], dp[i-2]).
  java_m41_t1_ex_4: {
    kind: "grid", label: "Min Cost Climbing Stairs (#746)",
    steps: [
      { grid: [[10, 15, 20], [10, 15, "·"]], cursor: [1, 2], note: "cost row on top; dp[i] = cost[i] + min(dp[i-1], dp[i-2])." },
      { grid: [[10, 15, 20], [10, 15, 30]], cls: { "1,2": "visited" }, note: "dp[2] = 20 + min(15,10) = 30." },
      { grid: [[10, 15, 20], [10, 15, 30]], cls: { "1,1": "path", "1,2": "path" }, note: "Answer = min(last two) = reach the top cheaply.", result: "min(15, 30) = 15" },
    ],
  },

  // #1143 LCS — 2-D table; match → diag+1, else max(up,left).
  java_m31_t5_ex_3: {
    kind: "grid", label: "LCS  \"ABC\" × \"AC\"",
    steps: [
      { grid: [["·", "ε", "A", "C"], ["ε", 0, 0, 0], ["A", 0, 1, 1], ["B", 0, 1, 1], ["C", 0, 1, "·"]], cursor: [4, 3], note: "Match (C==C) → diagonal + 1. Mismatch → max(up, left)." },
      { grid: [["·", "ε", "A", "C"], ["ε", 0, 0, 0], ["A", 0, 1, 1], ["B", 0, 1, 1], ["C", 0, 1, 2]], cls: { "4,3": "path" }, note: "Bottom-right cell = LCS length.", result: "2  (\"AC\")" },
    ],
  },

  // #72 Edit Distance — match copy diag, else 1 + min(3 neighbors).
  java_m31_t5_ex_4: {
    kind: "grid", label: "Edit Distance  \"cat\" → \"cut\"",
    steps: [
      { grid: [["·", "ε", "c", "u", "t"], ["ε", 0, 1, 2, 3], ["c", 1, 0, 1, 2], ["a", 2, 1, 1, 2], ["t", 3, 2, 2, "·"]], cursor: [4, 4], note: "Match → copy ↖. Mismatch → 1 + min(↖ replace, ← insert, ↑ delete)." },
      { grid: [["·", "ε", "c", "u", "t"], ["ε", 0, 1, 2, 3], ["c", 1, 0, 1, 2], ["a", 2, 1, 1, 2], ["t", 3, 2, 2, 1]], cls: { "4,4": "path" }, note: "t==t → copy diagonal (1). One edit: a→u.", result: "1" },
    ],
  },

  // #516 Longest Palindromic Subsequence — interval DP on dp[i][j].
  java_m31_t5_ex_6: {
    kind: "grid", label: "Longest Palindromic Subseq \"bbbab\"",
    steps: [
      { grid: [[1, "·", "·", "·", "·"], [0, 1, "·", "·", "·"], [0, 0, 1, "·", "·"], [0, 0, 0, 1, "·"], [0, 0, 0, 0, 1]], cursor: [0, 1], note: "dp[i][j] over the substring i..j. Diagonal = single chars (length 1)." },
      { grid: [[1, 2, 3, 3, 4], [0, 1, 2, 2, 3], [0, 0, 1, 1, 3], [0, 0, 0, 1, 1], [0, 0, 0, 0, 1]], cls: { "0,4": "path" }, note: "s[i]==s[j] → dp[i+1][j-1]+2, else max(drop one end). Fill by length.", result: "4  (\"bbbb\")" },
    ],
  },

  // Longest Common Substring — like LCS but resets to 0 on mismatch.
  java_m31_t5_ex_5: {
    kind: "grid", label: "Longest Common Substring \"abcde\" × \"abfde\"",
    steps: [
      { grid: [["·", "a", "b", "f", "d", "e"], ["a", 1, 0, 0, 0, 0], ["b", 0, 2, 0, 0, 0], ["c", 0, 0, 0, 0, 0], ["d", 0, 0, 0, 1, 0], ["e", 0, 0, 0, 0, 2]], cls: { "2,2": "path" }, note: "Match → diag + 1; MISMATCH → 0 (substring must be contiguous)." },
      { grid: [["·", "a", "b", "f", "d", "e"], ["a", 1, 0, 0, 0, 0], ["b", 0, 2, 0, 0, 0], ["c", 0, 0, 0, 0, 0], ["d", 0, 0, 0, 1, 0], ["e", 0, 0, 0, 0, 2]], cls: { "2,2": "path", "5,5": "path" }, note: "Answer = the MAX cell anywhere (not the corner).", result: "2  (\"ab\" or \"de\")" },
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
  console.log(`\n✅ coverage-9 (DP tables): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
