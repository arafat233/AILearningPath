/**
 * seedAnimationSlidingWindow.js — Track-2 step-by-step animation, PATTERN 2 of N
 * (sliding-window). DSA_ANIMATOR_GAP_CHECKLIST.md Track-2.
 *
 * Reuses the <StepPlayer> "array-pointers" renderer (window shading + L/R
 * pointers) — pure step-data, no frontend change. Covers the fixed window and
 * three variable-window flavors (sum target, distinct chars, ≤k zeros).
 * Additive & idempotent (updateOne $set by exerciseId).
 *
 * Usage: node config/seedAnimationSlidingWindow.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // #643 Maximum Average Subarray I — FIXED window of size k.
  java_m30_t2_ex_16: {
    kind: "array-pointers", label: "Max Average Subarray (fixed window)", meta: { k: 4 },
    array: [1, 12, -5, -6, 50, 3],
    steps: [
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Fixed window of size k=4 — compute the first window sum.", caption: "sum = 1+12-5-6 = 2" },
      { pointers: { L: 1, R: 4 }, window: [1, 4], note: "Slide right by one: add the entering element, drop the leaving one.", caption: "sum = 2 - 1 + 50 = 51  ← best" },
      { pointers: { L: 2, R: 5 }, window: [2, 5], note: "Slide again — the window size never changes.", caption: "sum = 51 - 12 + 3 = 42" },
      { pointers: { L: 1, R: 4 }, window: [1, 4], note: "Best window sum is 51 → average = 51 / 4.", mark: { 1: "match", 2: "match", 3: "match", 4: "match" }, result: "12.75" },
    ],
  },

  // #209 Minimum Size Subarray Sum — VARIABLE window, shrink once valid.
  java_m30_t2_ex_6: {
    kind: "array-pointers", label: "Min Size Subarray Sum", meta: { target: 7 },
    array: [2, 3, 1, 2, 4, 3],
    steps: [
      { pointers: { L: 0, R: 0 }, window: [0, 0], note: "Variable window — expand R, adding to the running sum.", caption: "sum = 2  < 7" },
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Expanded until sum ≥ target — record the length, then try to shrink.", caption: "sum = 2+3+1+2 = 8 ≥ 7 · len 4" },
      { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Shrink from the left; when it drops below target, expand again.", caption: "drop 2 → sum 6 < 7" },
      { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Expand to 4, then shrink: a shorter valid window.", caption: "sum = 1+2+4 = 7 ≥ 7 · len 3" },
      { pointers: { L: 4, R: 5 }, window: [4, 5], note: "The tightest valid window.", caption: "sum = 4+3 = 7 ≥ 7 · len 2", mark: { 4: "match", 5: "match" } },
      { pointers: { L: 4, R: 5 }, note: "No shorter subarray reaches the target.", result: "2" },
    ],
  },

  // #3 Longest Substring Without Repeating Characters — window of unique chars.
  java_m30_t2_ex_4: {
    kind: "array-pointers", label: "Longest Substring w/o Repeat",
    array: ["a", "b", "c", "a", "b", "c", "b", "b"],
    steps: [
      { pointers: { L: 0, R: 0 }, window: [0, 0], note: "Grow R; keep every character in the window unique.", caption: "\"a\" · len 1" },
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "All unique so far — this is the best length yet.", caption: "\"abc\" · len 3  ← best", mark: { 0: "kept", 1: "kept", 2: "kept" } },
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "'a' repeats inside the window → shrink L past the old 'a'.", caption: "\"abca\" has duplicate 'a'", mark: { 3: "dropped" } },
      { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Window is unique again — R never moves backward.", caption: "\"bca\" · len 3" },
      { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Each repeat just slides L forward by the minimum needed.", caption: "\"cab\" · len 3" },
      { pointers: { L: 2, R: 4 }, note: "Longest window of distinct characters has length 3.", result: "3  (\"abc\")", mark: { 2: "match", 3: "match", 4: "match" } },
    ],
  },

  // #1004 Max Consecutive Ones III — window with at most k zeros.
  java_m30_t2_ex_17: {
    kind: "array-pointers", label: "Max Consecutive Ones III", meta: { k: 2 },
    array: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
    steps: [
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Expand R; count the zeros inside the window.", caption: "zeros 0 · len 3" },
      { pointers: { L: 0, R: 4 }, window: [0, 4], note: "Two zeros is exactly the limit (k=2).", caption: "zeros 2 · len 5" },
      { pointers: { L: 0, R: 5 }, window: [0, 5], note: "A third zero exceeds k → shrink from the left until one zero leaves.", caption: "zeros 3 > 2 · shrink", mark: { 5: "dropped" } },
      { pointers: { L: 4, R: 5 }, window: [4, 5], note: "Shrank past the first run of zeros; window valid again.", caption: "zeros 2 · len 2" },
      { pointers: { L: 4, R: 9 }, window: [4, 9], note: "Expand freely — flipping the 2 zeros yields six 1s.", caption: "zeros 2 · len 6  ← best", mark: { 4: "match", 5: "match", 6: "match", 7: "match", 8: "match", 9: "match" } },
      { pointers: { L: 4, R: 9 }, note: "Longest window with ≤ k zeros has length 6.", result: "6" },
    ],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    if (!exerciseId.startsWith("java_m30_t2_")) { console.error(`✗ out of lane: ${exerciseId}`); continue; }
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ exercise not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ sliding-window animations: ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
