/**
 * seedAnimationMonotonicStack.js — Track-2 step-by-step animation, PATTERN 3 of N
 * (monotonic-stack). DSA_ANIMATOR_GAP_CHECKLIST.md Track-2.
 *
 * Uses the new <StepPlayer> "stack" renderer (input row + cursor, a stack row,
 * an optional output row). Additive & idempotent (updateOne $set by exerciseId).
 *
 * Usage: node config/seedAnimationMonotonicStack.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // #496 Next Greater Element — decreasing stack of indices.
  java_m33_t2_ex_1: {
    kind: "stack", label: "Next Greater Element", outLabel: "next greater",
    array: [2, 1, 2, 4, 3],
    steps: [
      { cursor: 0, stack: [{ v: 2, i: 0 }], output: [null, null, null, null, null], note: "Keep a decreasing stack of indices waiting for a greater value. Push 0." },
      { cursor: 1, stack: [{ v: 2, i: 0 }, { v: 1, i: 1 }], output: [null, null, null, null, null], note: "1 < 2 → push index 1." },
      { cursor: 2, stack: [{ v: 2, i: 0 }, { v: 2, i: 2 }], output: [null, 2, null, null, null], note: "2 > 1 → pop 1, answer[1] = 2. 2 is not > 2 → push index 2." },
      { cursor: 3, stack: [{ v: 4, i: 3 }], output: [4, 2, 4, null, null], note: "4 is greater than both tops → pop them: answer[2] = 4, answer[0] = 4. Push index 3." },
      { cursor: 4, stack: [{ v: 4, i: 3 }, { v: 3, i: 4 }], output: [4, 2, 4, null, null], note: "3 < 4 → push index 4." },
      { stack: [{ v: 4, i: 3 }, { v: 3, i: 4 }], output: [4, 2, 4, -1, -1], note: "Indices left on the stack have no greater element → −1.", result: "[4, 2, 4, -1, -1]" },
    ],
  },

  // #739 Daily Temperatures — stack of days awaiting a warmer day.
  java_m33_t2_ex_5: {
    kind: "stack", label: "Daily Temperatures", outLabel: "days until warmer",
    array: [73, 74, 72, 76],
    steps: [
      { cursor: 0, stack: [{ v: 73, i: 0 }], output: [null, null, null, null], note: "Stack holds indices of days still waiting for a warmer one. Push 0." },
      { cursor: 1, stack: [{ v: 74, i: 1 }], output: [1, null, null, null], note: "74 > 73 → pop 0, answer[0] = 1 − 0 = 1. Push 1." },
      { cursor: 2, stack: [{ v: 74, i: 1 }, { v: 72, i: 2 }], output: [1, null, null, null], note: "72 < 74 → push 2." },
      { cursor: 3, stack: [{ v: 74, i: 1 }], output: [1, null, 1, null], note: "76 > 72 → pop 2, answer[2] = 3 − 2 = 1." },
      { cursor: 3, stack: [], output: [1, 2, 1, null], note: "76 > 74 → pop 1, answer[1] = 3 − 1 = 2." },
      { cursor: 3, stack: [{ v: 76, i: 3 }], output: [1, 2, 1, 0], note: "Push 3. Days left on the stack never get warmer → 0.", result: "[1, 2, 1, 0]" },
    ],
  },

  // #84 Largest Rectangle in Histogram — increasing stack; pop computes area.
  java_m33_t2_ex_3: {
    kind: "stack", label: "Largest Rectangle (histogram)",
    array: [2, 1, 5, 6, 2, 3],
    steps: [
      { cursor: 0, stack: [{ v: 2, i: 0 }], note: "Maintain an increasing stack of bar indices. Push bar 0 (h=2).", caption: "max area = 0" },
      { cursor: 1, stack: [{ v: 1, i: 1 }], note: "h=1 < 2 → pop bar 0: area = height 2 × width 1 = 2. Push bar 1.", caption: "max area = 2" },
      { cursor: 3, stack: [{ v: 1, i: 1 }, { v: 5, i: 2 }, { v: 6, i: 3 }], note: "Heights rising (1 → 5 → 6) → just push.", caption: "max area = 2" },
      { cursor: 4, stack: [{ v: 1, i: 1 }, { v: 5, i: 2 }], note: "h=2 < 6 → pop bar 3: area = 6 × 1 = 6.", caption: "max area = 6" },
      { cursor: 4, stack: [{ v: 1, i: 1 }], note: "Still 2 < 5 → pop bar 2: width spans bars 2–3, area = 5 × 2 = 10.", caption: "max area = 10  ←" },
      { cursor: 5, stack: [{ v: 1, i: 1 }, { v: 2, i: 4 }, { v: 3, i: 5 }], note: "Push the remaining bars; no later rectangle beats 10.", caption: "max area = 10" },
      { stack: [{ v: 1, i: 1 }, { v: 2, i: 4 }, { v: 3, i: 5 }], note: "Largest rectangle area in the histogram.", result: "10" },
    ],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    if (!exerciseId.startsWith("java_m33_t2_")) { console.error(`✗ out of lane: ${exerciseId}`); continue; }
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ exercise not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ monotonic-stack animations: ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
