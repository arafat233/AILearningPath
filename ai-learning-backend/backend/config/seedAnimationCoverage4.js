/**
 * seedAnimationCoverage4.js — GAP #1 animation coverage, batch 4 (stack family).
 * Existing <StepPlayer> "stack" renderer (input row + cursor, stack, output).
 * Pure step-data, no frontend change. Idempotent ($set by exerciseId).
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // #739 Daily Temperatures — monotonic-decreasing stack of indices.
  java_m33_t1_ex_4: {
    kind: "stack", label: "Daily Temperatures", outLabel: "days until warmer",
    array: [73, 74, 75, 71, 69, 72, 76],
    steps: [
      { cursor: 0, stack: [{ v: 73, i: 0 }], output: [0, 0, 0, 0, 0, 0, 0], note: "Stack holds indices of days still waiting for a warmer one." },
      { cursor: 1, stack: [{ v: 74, i: 1 }], output: [1, 0, 0, 0, 0, 0, 0], note: "74 > 73 → pop day 0, answer = 1−0 = 1." },
      { cursor: 4, stack: [{ v: 75, i: 2 }, { v: 71, i: 3 }, { v: 69, i: 4 }], output: [1, 1, 0, 0, 0, 0, 0], note: "Cooler days just stack up." },
      { cursor: 5, stack: [{ v: 75, i: 2 }, { v: 72, i: 5 }], output: [1, 1, 0, 2, 1, 0, 0], note: "72 pops 69 (1 day) and 71 (2 days)." },
      { cursor: 6, stack: [{ v: 76, i: 6 }], output: [1, 1, 4, 2, 1, 1, 0], note: "76 pops everything; day 2 waited 4 days. Day 6 never warms → 0.", result: "[1,1,4,2,1,1,0]" },
    ],
  },

  // Stock Span — consecutive prior days with price ≤ today.
  java_m33_t2_ex_6: {
    kind: "stack", label: "Stock Span", outLabel: "span",
    array: [100, 80, 60, 70, 60, 75, 85],
    steps: [
      { cursor: 2, stack: [{ v: 100, i: 0 }, { v: 80, i: 1 }, { v: 60, i: 2 }], output: [1, 1, 1, 0, 0, 0, 0], note: "Falling prices → span 1 each; stack keeps the taller days." },
      { cursor: 3, stack: [{ v: 100, i: 0 }, { v: 80, i: 1 }, { v: 70, i: 3 }], output: [1, 1, 1, 2, 0, 0, 0], note: "70 ≥ 60 → pop it; span = today − previous-greater index." },
      { cursor: 5, stack: [{ v: 100, i: 0 }, { v: 80, i: 1 }, { v: 75, i: 5 }], output: [1, 1, 1, 2, 1, 4, 0], note: "75 pops 60, 70, 60 → span 4." },
      { cursor: 6, stack: [{ v: 100, i: 0 }, { v: 85, i: 6 }], output: [1, 1, 1, 2, 1, 4, 6], note: "85 pops down to 100 → span 6.", result: "[1,1,1,2,1,4,6]" },
    ],
  },

  // Previous Smaller Element — monotonic-increasing stack.
  java_m33_t2_ex_9: {
    kind: "stack", label: "Previous Smaller Element", outLabel: "prev smaller",
    array: [4, 5, 2, 10, 8],
    steps: [
      { cursor: 1, stack: [{ v: 4, i: 0 }, { v: 5, i: 1 }], output: [-1, 4, null, null, null], note: "Stack top is the nearest smaller to the left." },
      { cursor: 2, stack: [{ v: 2, i: 2 }], output: [-1, 4, -1, null, null], note: "2 pops 5 and 4 (both ≥ 2) → no smaller to its left." },
      { cursor: 4, stack: [{ v: 2, i: 2 }, { v: 8, i: 4 }], output: [-1, 4, -1, 2, 2], note: "For 10 and 8, the nearest smaller-left is 2.", result: "[-1, 4, -1, 2, 2]" },
    ],
  },

  // #1047 Remove All Adjacent Duplicates — stack, cancel equal top.
  java_m33_t1_ex_6: {
    kind: "stack", label: "Remove Adjacent Duplicates", outLabel: "result",
    array: ["a", "b", "b", "a", "c", "a"],
    steps: [
      { cursor: 1, stack: ["a", "b"], note: "Push each char." },
      { cursor: 2, stack: ["a"], note: "'b' equals the top 'b' → pop both (they cancel)." },
      { cursor: 3, stack: [], note: "'a' equals top 'a' → pop. Stack empty." },
      { cursor: 5, stack: ["c", "a"], output: ["c", "a"], note: "Remaining chars have no adjacent equal pair.", result: "\"ca\"" },
    ],
  },

  // #735 Asteroid Collision — stack; negatives moving left collide with positives.
  java_m33_t1_ex_7: {
    kind: "stack", label: "Asteroid Collision", outLabel: "survivors",
    array: [10, 2, -5],
    steps: [
      { cursor: 1, stack: [10, 2], note: "Right-movers (positive) push onto the stack." },
      { cursor: 2, stack: [10], note: "−5 moves left, meets 2 → |5| > |2|, 2 explodes." },
      { cursor: 2, stack: [10], output: [10], note: "−5 meets 10 → |10| > |5|, the −5 explodes.", result: "[10]" },
    ],
  },

  // #402 Remove K Digits — monotonic-increasing stack, drop larger leading digits.
  java_m33_t1_ex_9: {
    kind: "stack", label: "Remove K Digits (k=3)", outLabel: "result", meta: { k: 3 },
    array: ["1", "4", "3", "2", "2", "1", "9"],
    steps: [
      { cursor: 1, stack: ["1", "4"], note: "Keep digits non-decreasing; drop a bigger digit when a smaller one arrives (k left)." },
      { cursor: 3, stack: ["1", "2"], note: "3 pops 4 (k:2). 2 pops 3 (k:1)." },
      { cursor: 5, stack: ["1", "2", "1"], note: "Next 2 keeps non-decreasing… 1 pops 2 (k:0). No removals left." },
      { cursor: 6, stack: ["1", "2", "1", "9"], output: ["1", "2", "1", "9"], note: "Append the rest; smallest number for k removals.", result: "\"1219\"" },
    ],
  },

  // #946 Validate Stack Sequences — simulate push/pop.
  java_m33_t1_ex_18: {
    kind: "stack", label: "Validate Stack Sequences", outLabel: "popped so far",
    array: [1, 2, 3, 4, 5],
    steps: [
      { cursor: 3, stack: [1, 2, 3, 4], note: "Push from 'pushed' until the top equals the next 'popped' value (4)." },
      { cursor: 4, stack: [1, 2, 3], output: [4], note: "Top is 4 → pop it (matches popped[0])." },
      { cursor: 4, stack: [1, 2, 3], output: [4, 5], note: "Push 5, pop 5; then top 3 matches → pop 3." },
      { cursor: 4, stack: [], output: [4, 5, 3, 2, 1], note: "Everything pops in the required order → valid.", result: "true" },
    ],
  },

  // Reverse a String using a Stack — push all, pop all.
  java_m33_t1_ex_15: {
    kind: "stack", label: "Reverse String via Stack", outLabel: "output",
    array: ["h", "e", "l", "l", "o"],
    steps: [
      { cursor: 4, stack: ["h", "e", "l", "l", "o"], note: "Push every character (LIFO)." },
      { cursor: 4, stack: ["h", "e", "l"], output: ["o", "l"], note: "Pop them back off — last in, first out." },
      { cursor: 4, stack: [], output: ["o", "l", "l", "e", "h"], note: "Popping a stack reverses the order.", result: "\"olleh\"" },
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
  console.log(`\n✅ coverage-4 (stack family): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
