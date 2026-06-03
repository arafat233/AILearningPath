/**
 * seedAnimationCoverage1.js — GAP #1 (animation coverage) Phase 1.
 * Animates the remaining sliding-window problems using the EXISTING
 * <StepPlayer> "array-pointers" renderer (window shading + L/R pointers) —
 * pure step-data, no frontend change. Additive & idempotent ($set by id).
 *
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 * Usage: node config/seedAnimationCoverage1.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // Max Sum Subarray of Size K — fixed window.
  java_m30_t2_ex_3: {
    kind: "array-pointers", label: "Max Sum Subarray (fixed k=3)", meta: { k: 3 },
    array: [2, 1, 5, 1, 3, 2],
    steps: [
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "First window of size k=3 — sum it directly.", caption: "2+1+5 = 8" },
      { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Slide: add entering, drop leaving — never re-sum.", caption: "8 − 2 + 1 = 7" },
      { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Slide again.", caption: "7 − 1 + 3 = 9  ← best", mark: { 2: "kept", 3: "kept", 4: "kept" } },
      { pointers: { L: 3, R: 5 }, window: [3, 5], note: "Last window.", caption: "9 − 5 + 2 = 6" },
      { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Best fixed window sum.", mark: { 2: "match", 3: "match", 4: "match" }, result: "9" },
    ],
  },

  // #438 Find All Anagrams — fixed window, frequency match.
  java_m30_t2_ex_5: {
    kind: "array-pointers", label: "Find All Anagrams (p=\"abc\")", meta: { p: "abc" },
    array: ["c", "b", "a", "e", "b", "a", "b", "a", "c", "d"],
    steps: [
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Window size = |p| = 3. Compare its char counts to p's.", caption: "\"cba\" counts == \"abc\" ✓", mark: { 0: "match", 1: "match", 2: "match" }, result: "match at index 0" },
      { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Slide one: drop left count, add right count.", caption: "\"bae\" ≠ \"abc\"" },
      { pointers: { L: 4, R: 6 }, window: [4, 6], note: "Keep sliding…", caption: "\"bab\" ≠ \"abc\"" },
      { pointers: { L: 6, R: 8 }, window: [6, 8], note: "Counts match again.", caption: "\"bac\" counts == \"abc\" ✓", mark: { 6: "match", 7: "match", 8: "match" }, result: "match at index 6" },
      { pointers: { L: 6, R: 8 }, note: "All start indices whose window is an anagram of p.", result: "[0, 6]" },
    ],
  },

  // Longest Substring with At Most 2 Distinct — variable window.
  java_m30_t2_ex_7: {
    kind: "array-pointers", label: "≤ 2 Distinct Characters",
    array: ["e", "c", "e", "b", "a"],
    steps: [
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Expand R; track distinct chars in the window.", caption: "{e, c} · len 3  ← best", mark: { 0: "kept", 1: "kept", 2: "kept" } },
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "'b' makes 3 distinct — shrink L until ≤ 2.", caption: "{e, c, b} > 2", mark: { 3: "dropped" } },
      { pointers: { L: 2, R: 3 }, window: [2, 3], note: "Dropped 'e' and 'c'; window valid again.", caption: "{e, b} · len 2" },
      { pointers: { L: 3, R: 4 }, window: [3, 4], note: "'a' enters, 'e' leaves.", caption: "{b, a} · len 2" },
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Longest window with ≤ 2 distinct chars.", result: "3  (\"ece\")", mark: { 0: "match", 1: "match", 2: "match" } },
    ],
  },

  // #424 Longest Repeating Character Replacement — window where (len − maxFreq) ≤ k.
  java_m30_t2_ex_8: {
    kind: "array-pointers", label: "Char Replacement (k=1)", meta: { k: 1 },
    array: ["A", "A", "B", "A", "B", "B", "A"],
    steps: [
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Window valid while (len − maxFreq) ≤ k: replace the minority.", caption: "AAB: 3 − 2 = 1 ≤ 1 ✓ · len 3" },
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "maxFreq(A)=3, one B to replace.", caption: "AABA: 4 − 3 = 1 ≤ 1 ✓ · len 4  ← best", mark: { 0: "kept", 1: "kept", 2: "kept", 3: "kept" } },
      { pointers: { L: 0, R: 4 }, window: [0, 4], note: "Now 2 replacements needed — exceeds k, shrink L.", caption: "AABAB: 5 − 3 = 2 > 1", mark: { 4: "dropped" } },
      { pointers: { L: 1, R: 5 }, window: [1, 5], note: "Window slides keeping (len − maxFreq) ≤ k.", caption: "ABAB B: len 5, maxFreq(B)=3 → 5−3=2… still shrinking" },
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Longest window we can make uniform with ≤ k swaps.", result: "4", mark: { 0: "match", 1: "match", 2: "match", 3: "match" } },
    ],
  },

  // #904 Fruit Into Baskets — at most 2 types (variable window).
  java_m30_t2_ex_12: {
    kind: "array-pointers", label: "Fruit Into Baskets (≤ 2 types)",
    array: [1, 2, 1, 2, 3],
    steps: [
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Carry at most 2 fruit types; expand R.", caption: "{1, 2} · len 4  ← best", mark: { 0: "kept", 1: "kept", 2: "kept", 3: "kept" } },
      { pointers: { L: 0, R: 4 }, window: [0, 4], note: "Type 3 appears → 3 types, shrink from L.", caption: "{1, 2, 3} > 2", mark: { 4: "dropped" } },
      { pointers: { L: 4, R: 4 }, window: [4, 4], note: "Dropped all 1s and 2s; window holds only {3}.", caption: "{3} · len 1" },
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Most fruit collected with ≤ 2 baskets.", result: "4", mark: { 0: "match", 1: "match", 2: "match", 3: "match" } },
    ],
  },

  // #1493 Longest Subarray of 1s After Deleting One Element — window with ≤ 1 zero, answer = len − 1.
  java_m30_t2_ex_14: {
    kind: "array-pointers", label: "Longest 1s After One Deletion",
    array: [1, 1, 0, 1, 1, 1, 0, 1],
    steps: [
      { pointers: { L: 0, R: 5 }, window: [0, 5], note: "Allow at most ONE zero in the window (the deleted element).", caption: "one 0 · window len 6" },
      { pointers: { L: 0, R: 6 }, window: [0, 6], note: "A second zero exceeds the limit — shrink past the first zero.", caption: "two 0s · shrink", mark: { 6: "dropped" } },
      { pointers: { L: 3, R: 7 }, window: [3, 7], note: "One zero again; window valid.", caption: "one 0 · window len 5", mark: { 3: "kept", 4: "kept", 5: "kept", 6: "kept", 7: "kept" } },
      { pointers: { L: 0, R: 5 }, window: [0, 5], note: "Best window length is 6 → after deleting that one element, 5 ones remain.", result: "5  (len 6 − 1)" },
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
  console.log(`\n✅ coverage-1 (sliding-window): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
