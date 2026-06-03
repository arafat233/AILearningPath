/**
 * seedAnimationCoverage6.js — GAP #1 animation coverage, batch 6 (linked-list).
 * Uses the NEW <StepPlayer> "linked-list" renderer (nodes + arrows + named
 * pointers; ← for reversed links, ↺ for a cycle; optional second list).
 * Idempotent ($set by exerciseId). Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // Find Middle — slow/fast.
  java_m32_t2_ex_3: {
    kind: "linked-list", label: "Find Middle (slow / fast)",
    list: [1, 2, 3, 4, 5],
    steps: [
      { pointers: { slow: 0, fast: 0 }, note: "slow advances 1, fast advances 2 each step." },
      { pointers: { slow: 1, fast: 2 }, note: "Fast moves twice as quickly." },
      { pointers: { slow: 2, fast: 4 }, note: "When fast reaches the end, slow sits on the middle." },
      { pointers: { slow: 2 }, mark: { 2: "match" }, note: "Middle node found in one pass.", result: "3" },
    ],
  },

  // #141 Linked List Cycle — Floyd's; pointers meet inside the loop.
  java_m32_t2_ex_4: {
    kind: "linked-list", label: "Cycle Detection (Floyd)",
    list: [3, 2, 0, 4], links: ["→", "→", "→", "↺"],
    steps: [
      { pointers: { slow: 0, fast: 0 }, note: "The last node links back into the list (↺)." },
      { pointers: { slow: 1, fast: 2 }, note: "slow +1, fast +2." },
      { pointers: { slow: 2, fast: 2 }, mark: { 2: "match" }, note: "Inside a cycle the fast pointer laps the slow → they collide." },
      { pointers: { slow: 2, fast: 2 }, note: "If fast ever reached null there'd be no cycle.", result: "cycle exists" },
    ],
  },

  // #234 Palindrome Linked List — reverse second half, compare.
  java_m32_t2_ex_5: {
    kind: "linked-list", label: "Palindrome Linked List",
    list: [1, 2, 3, 2, 1],
    steps: [
      { pointers: { mid: 2 }, note: "Find the middle (slow/fast)." },
      { list: [1, 2, 3, 2, 1], links: ["→", "→", "→", "←", "←"], pointers: { L: 0, R: 4 }, note: "Reverse the second half, then compare from both ends inward." },
      { pointers: { L: 1, R: 3 }, mark: { 0: "match", 4: "match" }, note: "1 == 1, 2 == 2…" },
      { pointers: { mid: 2 }, mark: { 0: "match", 1: "match", 3: "match", 4: "match" }, note: "All mirrored values match.", result: "true" },
    ],
  },

  // #21 Merge Two Sorted Lists — splice the smaller head.
  java_m32_t1_ex_5: {
    kind: "linked-list", label: "Merge Two Sorted Lists",
    list: [1, 3, 5], list2: [2, 4, 6],
    steps: [
      { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Compare the two heads; attach the smaller, advance that pointer." },
      { pointers: { a: 1 }, pointers2: { b: 0 }, mark: { 0: "kept" }, note: "1 < 2 → take 1." },
      { pointers: { a: 1 }, pointers2: { b: 1 }, mark: { 0: "kept", 1: "kept" }, mark2: { 0: "kept" }, note: "Then 2, then 3 … weaving in order." },
      { pointers: {}, note: "Append whatever list remains.", result: "1→2→3→4→5→6" },
    ],
  },

  // #19 Delete N-th Node from End — gap of n between two pointers.
  java_m32_t1_ex_4: {
    kind: "linked-list", label: "Delete N-th From End (n=2)", meta: { n: 2 },
    list: [1, 2, 3, 4, 5],
    steps: [
      { pointers: { fast: 1 }, note: "Advance fast n=2 nodes ahead first." },
      { pointers: { fast: 2, slow: 0 }, note: "Now move both until fast hits the last node." },
      { pointers: { fast: 4, slow: 2 }, note: "slow lands just BEFORE the target (the n-th from end)." },
      { pointers: { slow: 2 }, mark: { 3: "dropped" }, note: "slow.next = slow.next.next — unlink node 4.", result: "1→2→3→5" },
    ],
  },

  // #83 Remove Duplicates from Sorted List — skip equal next.
  java_m32_t1_ex_7: {
    kind: "linked-list", label: "Remove Duplicates (sorted)",
    list: [1, 1, 2, 3, 3],
    steps: [
      { pointers: { curr: 0 }, note: "If curr.val == curr.next.val, unlink the next node." },
      { pointers: { curr: 0 }, mark: { 1: "dropped" }, note: "1 == 1 → skip the duplicate." },
      { pointers: { curr: 3 }, mark: { 1: "dropped", 4: "dropped" }, note: "3 == 3 → skip." },
      { pointers: {}, note: "Sorted order means duplicates are adjacent.", result: "1→2→3" },
    ],
  },

  // #24 Swap Nodes in Pairs.
  java_m32_t1_ex_11: {
    kind: "linked-list", label: "Swap Nodes in Pairs",
    list: [1, 2, 3, 4],
    steps: [
      { list: [1, 2, 3, 4], pointers: { a: 0, b: 1 }, note: "Swap each adjacent pair by relinking pointers." },
      { list: [2, 1, 3, 4], mark: { 0: "match", 1: "match" }, note: "Pair (1,2) swapped." },
      { list: [2, 1, 4, 3], mark: { 2: "match", 3: "match" }, note: "Pair (3,4) swapped.", result: "2→1→4→3" },
    ],
  },

  // #328 Odd Even Linked List — group odd-index then even-index.
  java_m32_t1_ex_12: {
    kind: "linked-list", label: "Odd Even Linked List",
    list: [1, 2, 3, 4, 5],
    steps: [
      { list: [1, 2, 3, 4, 5], pointers: { odd: 0, even: 1 }, note: "Weave two chains: odd positions, then even positions." },
      { list: [1, 3, 5, 2, 4], note: "Odd-position nodes first (1,3,5), then even (2,4) appended.", result: "1→3→5→2→4" },
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
  console.log(`\n✅ coverage-6 (linked-list): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
