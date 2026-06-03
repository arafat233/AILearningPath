/**
 * seedAnimationCoverage10.js — GAP #1 animation coverage, batch 10
 * (sort / binary-search / bits / palindrome). Reuses the "array-pointers"
 * renderer; pure step-data, NO frontend change. Idempotent.
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // Merge Sort — divide, sort halves, merge.
  java_m38_t1_ex_1: {
    kind: "array-pointers", label: "Merge Sort",
    array: [5, 2, 8, 1],
    steps: [
      { array: [5, 2, 8, 1], note: "Divide into halves recursively until single elements." },
      { array: [2, 5, 1, 8], window: [0, 1], note: "Sort each half: [2,5] and [1,8]." },
      { array: [1, 2, 5, 8], mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "Merge the two sorted halves with two pointers. O(n log n), stable.", result: "[1,2,5,8]" },
    ],
  },

  // Quick Sort (Lomuto) — pivot = last; i = boundary of the smaller region.
  java_m38_t1_ex_2: {
    kind: "array-pointers", label: "Quick Sort (Lomuto partition)",
    array: [3, 7, 2, 1, 5],
    steps: [
      { array: [3, 7, 2, 1, 5], pointers: { pivot: 4, i: 0, j: 0 }, note: "pivot = last (5). j scans; swap into the 'smaller' region when a[j] < pivot." },
      { array: [3, 2, 1, 7, 5], pointers: { pivot: 4, i: 2, j: 3 }, note: "After the scan, everything before i is < pivot.", mark: { 0: "kept", 1: "kept", 2: "kept" } },
      { array: [3, 2, 1, 5, 7], pointers: { pivot: 3 }, note: "Swap pivot into place; recurse on the two sides.", mark: { 3: "match" }, result: "pivot 5 fixed" },
    ],
  },

  // Classic Binary Search — lo/mid/hi.
  java_m39_t1_ex_2: {
    kind: "array-pointers", label: "Binary Search (target 7)",
    array: [1, 3, 5, 7, 9, 11],
    steps: [
      { pointers: { lo: 0, mid: 2, hi: 5 }, note: "mid = 5 < 7 → discard the left half, lo = mid+1." },
      { pointers: { lo: 3, mid: 4, hi: 5 }, note: "mid = 9 > 7 → discard the right half, hi = mid−1." },
      { pointers: { lo: 3, mid: 3, hi: 3 }, mark: { 3: "match" }, note: "mid = 7 → found. O(log n).", result: "index 3" },
    ],
  },

  // First & Last Occurrence — two biased binary searches.
  java_m39_t1_ex_3: {
    kind: "array-pointers", label: "First & Last Occurrence (8)",
    array: [5, 7, 7, 8, 8, 8, 10],
    steps: [
      { pointers: { lo: 3 }, mark: { 3: "match" }, note: "Leftmost: on a match keep going LEFT (hi = mid−1)." },
      { pointers: { hi: 5 }, mark: { 5: "match" }, note: "Rightmost: on a match keep going RIGHT (lo = mid+1)." },
      { pointers: { lo: 3, hi: 5 }, mark: { 3: "match", 4: "match", 5: "match" }, note: "Two searches → the value's range.", result: "[3, 5]" },
    ],
  },

  // #33 Search in Rotated Sorted Array — one half is always sorted.
  java_m39_t3_ex_2: {
    kind: "array-pointers", label: "Search Rotated (target 0)",
    array: [4, 5, 6, 7, 0, 1, 2],
    steps: [
      { pointers: { lo: 0, mid: 3, hi: 6 }, window: [0, 3], note: "a[lo]≤a[mid] → left half [4..7] is sorted. 0 ∉ [4,7] → go right." },
      { pointers: { lo: 4, mid: 5, hi: 6 }, window: [4, 5], note: "Left half [0,1] sorted; 0 ∈ [0,1] → go left." },
      { pointers: { lo: 4, mid: 4, hi: 4 }, mark: { 4: "match" }, note: "Found. Decide which sorted half holds the target each step.", result: "index 4" },
    ],
  },

  // #153 Find Minimum in Rotated Sorted Array — compare mid to hi.
  java_m39_t3_ex_3: {
    kind: "array-pointers", label: "Find Min in Rotated",
    array: [4, 5, 6, 7, 0, 1, 2],
    steps: [
      { pointers: { lo: 0, mid: 3, hi: 6 }, note: "a[mid]=7 > a[hi]=2 → the min is to the RIGHT, lo = mid+1." },
      { pointers: { lo: 4, mid: 5, hi: 6 }, note: "a[mid]=1 < a[hi]=2 → min is at mid or left, hi = mid." },
      { pointers: { lo: 4, hi: 4 }, mark: { 4: "match" }, note: "lo meets hi at the rotation point.", result: "min = 0" },
    ],
  },

  // Count Set Bits — Brian Kernighan: n &= (n-1).
  java_m47_t3_ex_2: {
    kind: "array-pointers", label: "Count Set Bits (n=12)", meta: { n: 12 },
    array: [1, 1, 0, 0],
    steps: [
      { array: [1, 1, 0, 0], note: "12 = 1100. n & (n−1) clears the LOWEST set bit each time." },
      { array: [1, 0, 0, 0], note: "1100 & 1011 = 1000  (count 1).", mark: { 1: "dropped" } },
      { array: [0, 0, 0, 0], note: "1000 & 0111 = 0000  (count 2). Loops exactly popcount(n) times.", mark: { 0: "dropped" }, result: "2" },
    ],
  },

  // Single Number — XOR all; pairs cancel.
  java_m47_t4_ex_1: {
    kind: "array-pointers", label: "Single Number (XOR)",
    array: [4, 1, 2, 1, 2],
    steps: [
      { pointers: { i: 0 }, note: "XOR everything. a ^ a = 0, a ^ 0 = a.", caption: "acc = 4" },
      { pointers: { i: 2 }, note: "Running XOR…", caption: "4^1^2 = 7" },
      { pointers: { i: 4 }, note: "Each pair cancels, leaving the unique value.", caption: "…^1^2 = 4", mark: { 0: "match" }, result: "4" },
    ],
  },

  // #125 Valid Palindrome — converging pointers.
  java_m31_t3_ex_3: {
    kind: "array-pointers", label: "Valid Palindrome",
    array: ["a", "b", "c", "c", "b", "a"],
    steps: [
      { pointers: { L: 0, R: 5 }, mark: { 0: "match", 5: "match" }, note: "Compare ends, move inward." },
      { pointers: { L: 1, R: 4 }, mark: { 1: "match", 4: "match" }, note: "'b' == 'b' ✓" },
      { pointers: { L: 2, R: 3 }, mark: { 2: "match", 3: "match" }, note: "All mirrored pairs match.", result: "true" },
    ],
  },

  // #5 Longest Palindromic Substring — expand around center.
  java_m31_t3_ex_4: {
    kind: "array-pointers", label: "Longest Palindromic Substring",
    array: ["b", "a", "b", "a", "d"],
    steps: [
      { pointers: { c: 1 }, window: [1, 1], note: "Try each index as a center; expand outward while it stays a palindrome." },
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "From center 'a': 'b'…'b' match → \"bab\".", mark: { 0: "match", 1: "match", 2: "match" } },
      { pointers: { L: 0, R: 2 }, note: "Expanding hits the boundary; longest palindrome found.", result: "\"bab\"" },
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
  console.log(`\n✅ coverage-10 (sort/bsearch/bits/palindrome): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
