/**
 * seedAnimationCoverage3.js — GAP #1 animation coverage, batch 3
 * (arrays / prefix-sum / greedy / intervals). Existing "array-pointers"
 * renderer; pure step-data, no frontend change. Idempotent ($set by id).
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // #53 Kadane's — running max; reset when running sum goes negative.
  java_m30_t5_ex_3: {
    kind: "array-pointers", label: "Kadane's Maximum Subarray",
    array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    steps: [
      { pointers: { i: 1 }, note: "cur = max(x, cur+x). Drop the prefix when it hurts.", caption: "cur 1 · best 1" },
      { pointers: { i: 3 }, note: "cur+x=-2 < 4, so restart at 4.", caption: "cur 4 · best 4", mark: { 3: "kept" } },
      { pointers: { i: 5 }, note: "Keep extending while it helps.", caption: "cur 5 · best 5", mark: { 3: "kept", 4: "kept", 5: "kept" } },
      { pointers: { i: 6 }, note: "Best contiguous sum so far.", caption: "cur 6 · best 6 ← max", mark: { 3: "match", 4: "match", 5: "match", 6: "match" } },
      { pointers: { i: 8 }, note: "Later negatives can't beat it.", result: "6  ([4,-1,2,1])" },
    ],
  },

  // #169 Boyer-Moore Majority Voting — candidate + count.
  java_m30_t5_ex_4: {
    kind: "array-pointers", label: "Majority Element (Boyer-Moore)",
    array: [2, 2, 1, 1, 1, 2, 2],
    steps: [
      { pointers: { i: 0 }, note: "Pick a candidate, count = 1.", caption: "cand 2 · count 1" },
      { pointers: { i: 1 }, note: "Same as candidate → count up.", caption: "cand 2 · count 2" },
      { pointers: { i: 3 }, note: "Different → count down; at 0 the candidate is up for grabs.", caption: "cand 2 · count 0" },
      { pointers: { i: 4 }, note: "count was 0 → adopt the new value as candidate.", caption: "cand 1 · count 1" },
      { pointers: { i: 6 }, note: "The majority survives the cancellations.", result: "2", mark: { 0: "match", 1: "match", 5: "match", 6: "match" } },
    ],
  },

  // #189 Rotate Array — three reversals (array mutates per step).
  java_m30_t5_ex_7: {
    kind: "array-pointers", label: "Rotate Array (3 reversals, k=3)", meta: { k: 3 },
    array: [1, 2, 3, 4, 5, 6, 7],
    steps: [
      { array: [1, 2, 3, 4, 5, 6, 7], pointers: { L: 0, R: 6 }, note: "Step 1 — reverse the WHOLE array.", caption: "before" },
      { array: [7, 6, 5, 4, 3, 2, 1], pointers: { L: 0, R: 2 }, note: "Step 2 — reverse the first k elements.", caption: "whole reversed" },
      { array: [5, 6, 7, 4, 3, 2, 1], pointers: { L: 3, R: 6 }, note: "Step 3 — reverse the remaining n−k.", caption: "first k fixed", mark: { 0: "kept", 1: "kept", 2: "kept" } },
      { array: [5, 6, 7, 1, 2, 3, 4], note: "Rotated right by k, in O(1) space.", result: "[5,6,7,1,2,3,4]" },
    ],
  },

  // #55 Jump Game — greedy farthest reach.
  java_m30_t5_ex_8: {
    kind: "array-pointers", label: "Jump Game (greedy reach)",
    array: [2, 3, 1, 1, 4],
    steps: [
      { pointers: { i: 0 }, window: [0, 2], note: "From index 0 we can reach up to 0+2 = 2.", caption: "reach = 2" },
      { pointers: { i: 1 }, window: [0, 4], note: "At 1, 1+3 = 4 extends reach to the last index.", caption: "reach = 4 ≥ 4 ✓" },
      { pointers: { i: 4 }, note: "Reach covers the end at every step → reachable.", result: "true", mark: { 4: "match" } },
    ],
  },

  // #121 Best Time to Buy and Sell Stock — min-so-far + max profit.
  java_m30_t5_ex_16: {
    kind: "array-pointers", label: "Best Time to Buy/Sell",
    array: [7, 1, 5, 3, 6, 4],
    steps: [
      { pointers: { i: 1 }, note: "Track the lowest price seen (best buy day).", caption: "min = 1" },
      { pointers: { i: 2 }, note: "Profit = price − min.", caption: "5 − 1 = 4" },
      { pointers: { i: 4 }, note: "Best sell day after the cheapest buy.", caption: "6 − 1 = 5 ← max", mark: { 1: "match", 4: "match" } },
      { pointers: { i: 5 }, note: "One pass, buy-low/sell-high.", result: "5" },
    ],
  },

  // #724 Find Pivot Index — prefix sums, left == right.
  java_m30_t3_ex_6: {
    kind: "array-pointers", label: "Find Pivot Index",
    array: [1, 7, 3, 6, 5, 6],
    steps: [
      { pointers: { i: 0 }, note: "total = 28. Walk i; right = total − left − a[i].", caption: "left 0 · right 27" },
      { pointers: { i: 2 }, note: "Accumulate left as you go.", caption: "left 8 · right 17" },
      { pointers: { i: 3 }, note: "Left equals right → pivot found.", caption: "left 11 · right 11 ✓", mark: { 3: "match" }, result: "index 3" },
    ],
  },

  // #1480 Running Sum of 1D Array — prefix accumulation.
  java_m30_t3_ex_16: {
    kind: "array-pointers", label: "Running Sum (prefix)",
    array: [1, 2, 3, 4],
    steps: [
      { pointers: { i: 1 }, note: "Each cell becomes the sum of all before it (inclusive).", caption: "a[1] += a[0] → 3", mark: { 0: "kept" } },
      { pointers: { i: 2 }, note: "Carry the running total forward.", caption: "a[2] += a[1] → 6", mark: { 0: "kept", 1: "kept" } },
      { pointers: { i: 3 }, note: "In-place prefix sum.", caption: "a[3] += a[2] → 10", mark: { 0: "kept", 1: "kept", 2: "kept" } },
      { array: [1, 3, 6, 10], note: "Running sum complete.", result: "[1, 3, 6, 10]" },
    ],
  },

  // #455 Assign Cookies — sort both, greedy two pointers.
  java_m41_5_t1_ex_3: {
    kind: "array-pointers", label: "Assign Cookies (greedy)", meta: { greed: "[1,2]" },
    array: [1, 2, 3],
    steps: [
      { pointers: { child: 0, cookie: 0 }, note: "Sort both. Smallest cookie (1) satisfies greed 1.", caption: "cookie 1 ≥ greed 1 ✓ → child 0 happy", mark: { 0: "match" } },
      { pointers: { child: 1, cookie: 1 }, note: "Next cookie (2) satisfies greed 2.", caption: "cookie 2 ≥ greed 2 ✓ → child 1 happy", mark: { 1: "match" } },
      { pointers: { cookie: 2 }, note: "Give each child the smallest cookie that works.", result: "2 children satisfied" },
    ],
  },

  // #860 Lemonade Change — greedy, prefer giving a $10 first.
  java_m41_5_t1_ex_4: {
    kind: "array-pointers", label: "Lemonade Change (greedy)",
    array: [5, 5, 5, 10, 20],
    steps: [
      { pointers: { i: 2 }, note: "Collect $5 bills (drink costs $5).", caption: "$5×3 in till" },
      { pointers: { i: 3 }, note: "Pay with $10 → give one $5 back.", caption: "till: $5×2, $10×1", mark: { 3: "kept" } },
      { pointers: { i: 4 }, note: "$20 → prefer $10+$5 (keep small bills flexible).", caption: "give $10 + $5 ✓", mark: { 4: "match" } },
      { pointers: { i: 4 }, note: "Always had change available.", result: "true" },
    ],
  },

  // #56 Merge Intervals — sort by start, merge overlaps.
  java_m41_5_t2_ex_4: {
    kind: "array-pointers", label: "Merge Intervals",
    array: ["1-3", "2-6", "8-10", "15-18"],
    steps: [
      { pointers: { cur: 0 }, note: "Sorted by start. Compare each interval to the current merge.", caption: "current = [1,3]" },
      { pointers: { cur: 1 }, note: "2 ≤ 3 → they overlap → extend the end to 6.", caption: "[1,3] ∪ [2,6] = [1,6]", mark: { 0: "match", 1: "match" } },
      { pointers: { cur: 2 }, note: "8 > 6 → no overlap → start a new interval.", caption: "emit [1,6], current = [8,10]" },
      { pointers: { cur: 3 }, note: "15 > 10 → another separate interval.", result: "[[1,6], [8,10], [15,18]]" },
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
  console.log(`\n✅ coverage-3 (arrays/prefix/greedy/intervals): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
