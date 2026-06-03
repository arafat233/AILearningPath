/**
 * seedAnimationCoverage2.js — GAP #1 animation coverage, batch 2 (two-pointers
 * + DNF/partition). Existing <StepPlayer> "array-pointers" renderer; pure
 * step-data, no frontend change. Idempotent ($set by exerciseId).
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // #125 Valid Palindrome — converging pointers, compare ends inward.
  java_m30_t1_ex_4: {
    kind: "array-pointers", label: "Valid Palindrome",
    array: ["r", "a", "c", "e", "c", "a", "r"],
    steps: [
      { pointers: { L: 0, R: 6 }, note: "Compare the two ends; move inward while they match.", caption: "'r' == 'r' ✓", mark: { 0: "match", 6: "match" } },
      { pointers: { L: 1, R: 5 }, note: "Step both pointers toward the center.", caption: "'a' == 'a' ✓", mark: { 1: "match", 5: "match" } },
      { pointers: { L: 2, R: 4 }, note: "Still matching.", caption: "'c' == 'c' ✓", mark: { 2: "match", 4: "match" } },
      { pointers: { L: 3, R: 3 }, note: "Pointers met — every mirrored pair matched.", caption: "middle reached", result: "true (palindrome)" },
    ],
  },

  // #283 Move Zeroes — slow write pointer + fast scanner.
  java_m30_t1_ex_8: {
    kind: "array-pointers", label: "Move Zeroes",
    array: [0, 1, 0, 3, 12],
    steps: [
      { pointers: { write: 0, scan: 1 }, note: "'scan' finds the next non-zero; 'write' marks where it goes.", caption: "scan→1 (non-zero)" },
      { pointers: { write: 1, scan: 3 }, note: "Place 1 at write, advance write. Skip zeros.", caption: "array → [1, ?, 0, 3, 12]", mark: { 0: "match" } },
      { pointers: { write: 2, scan: 3 }, note: "Next non-zero is 3.", caption: "place 3 → [1, 3, ?, ?, 12]", mark: { 0: "match", 1: "match" } },
      { pointers: { write: 3, scan: 4 }, note: "Then 12.", caption: "place 12", mark: { 0: "match", 1: "match", 2: "match" } },
      { pointers: { write: 3 }, note: "Fill the rest with zeros — order of non-zeros preserved.", result: "[1, 3, 12, 0, 0]" },
    ],
  },

  // #977 Squares of a Sorted Array — biggest |value| sits at an end.
  java_m30_t1_ex_9: {
    kind: "array-pointers", label: "Squares of Sorted Array",
    array: [-4, -1, 0, 3, 10],
    steps: [
      { pointers: { L: 0, R: 4 }, note: "Largest square is at one of the ends — compare |L| vs |R|.", caption: "|−4|=4 vs |10|=10 → 100 goes last" },
      { pointers: { L: 0, R: 3 }, note: "Took the right; move R in. Result fills back-to-front.", caption: "|−4|=4 vs |3|=3 → 16 next", mark: { 4: "kept" } },
      { pointers: { L: 1, R: 3 }, note: "Took the left; move L in.", caption: "|−1|=1 vs |3|=3 → 9 next", mark: { 0: "kept" } },
      { pointers: { L: 1, R: 2 }, note: "Continue converging.", caption: "→ 1, then 0", mark: { 3: "kept" } },
      { pointers: { L: 2, R: 2 }, note: "Pointers meet — squares emitted in sorted order.", result: "[0, 1, 9, 16, 100]" },
    ],
  },

  // #15 Three Sum — fix i, then two-pointer L/R on the sorted remainder.
  java_m30_t1_ex_7: {
    kind: "array-pointers", label: "Three Sum (sorted + two pointers)",
    array: [-4, -1, -1, 0, 1, 2],
    steps: [
      { pointers: { i: 0, L: 1, R: 5 }, note: "Sort first. Fix i, search the rest with L/R for sum 0.", caption: "−4 + (−1) + 2 = −3 < 0 → L++" },
      { pointers: { i: 0, L: 4, R: 5 }, note: "Sum too small → move L right; too big → move R left.", caption: "−4 + 1 + 2 = −1 < 0 (no triplet for −4)" },
      { pointers: { i: 1, L: 2, R: 5 }, note: "Advance i to the next distinct value.", caption: "−1 + (−1) + 2 = 0 ✓", mark: { 1: "match", 2: "match", 5: "match" }, result: "[-1, -1, 2]" },
      { pointers: { i: 1, L: 3, R: 4 }, note: "Keep scanning the same i for more pairs.", caption: "−1 + 0 + 1 = 0 ✓", mark: { 1: "match", 3: "match", 4: "match" }, result: "[-1, 0, 1]" },
      { pointers: { i: 1 }, note: "All zero-sum triplets, no duplicates.", result: "[[-1,-1,2], [-1,0,1]]" },
    ],
  },

  // Sort array of -1,0,1 — Dutch National Flag (low/mid/high).
  java_m30_t4_ex_4: {
    kind: "array-pointers", label: "Sort {−1, 0, 1} (Dutch flag)",
    array: [1, 0, -1, 1, -1, 0],
    steps: [
      { pointers: { low: 0, mid: 0, high: 5 }, note: "Three regions: −1s | 0s | unknown | 1s.", caption: "a[mid]=1 → swap with high, high−−", mark: { 5: "kept" } },
      { pointers: { low: 0, mid: 0, high: 4 }, note: "Don't advance mid after a high-swap — recheck the new value.", caption: "a[mid]=0 → mid++ (0s region grows)", mark: { 0: "kept" } },
      { pointers: { low: 1, mid: 2, high: 4 }, note: "a[mid]=−1 → swap with low, both low++ and mid++.", caption: "−1 placed at front", mark: { 0: "match" } },
      { pointers: { low: 2, mid: 3, high: 3 }, note: "mid passes high → done.", caption: "regions complete" },
      { pointers: {}, note: "Single pass, O(1) extra space.", result: "[-1, -1, 0, 0, 1, 1]" },
    ],
  },

  // Segregate 0s and 1s — two-way partition.
  java_m30_t4_ex_7: {
    kind: "array-pointers", label: "Segregate 0s and 1s",
    array: [0, 1, 1, 0, 1, 0],
    steps: [
      { pointers: { L: 0, R: 5 }, note: "L seeks a 1 from the left; R seeks a 0 from the right.", caption: "L→1 (idx 1), R→0 (idx 5)" },
      { pointers: { L: 1, R: 5 }, note: "Swap them so the 0 moves left and the 1 moves right.", caption: "swap → [0,0,1,0,1,1]", mark: { 1: "match", 5: "match" } },
      { pointers: { L: 3, R: 3 }, note: "Continue until L and R cross.", caption: "L meets R" },
      { pointers: {}, note: "All 0s left, all 1s right — one pass.", result: "[0, 0, 0, 1, 1, 1]" },
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
  console.log(`\n✅ coverage-2 (two-pointers/DNF): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
