/**
 * seedAnimationTwoPointers.js — Track-2 step-by-step animation, PATTERN 1 of N
 * (two-pointers). DSA_ANIMATOR_GAP_CHECKLIST.md Track-2.
 *
 * Attaches hand-authored, deterministic `animation` step-data (kind
 * "array-pointers") to three flagship two-pointers exercises so the frontend
 * <StepPlayer> can animate them. Additive & idempotent (updateOne $set by
 * exerciseId). One pattern at a time — next: sliding-window.
 *
 * Usage: node config/seedAnimationTwoPointers.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const ANIMATIONS = {
  // #167 Two Sum II — converging pointers on a sorted array.
  java_m30_t1_ex_3: {
    kind: "array-pointers", label: "Two Sum II", meta: { target: 9 },
    array: [2, 7, 11, 15],
    steps: [
      { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Start: L at the left, R at the right of the sorted array.", caption: "sum = 2 + 15 = 17  >  9  → move R left" },
      { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Sum is too big, so the right value must shrink.", caption: "sum = 2 + 11 = 13  >  9  → move R left" },
      { pointers: { L: 0, R: 1 }, window: [0, 1], note: "Sum equals the target — found the pair.", caption: "sum = 2 + 7 = 9  =  9 ✓", mark: { 0: "match", 1: "match" }, result: "[1, 2]  (1-indexed)" },
    ],
  },

  // #11 Container With Most Water — move the SHORTER wall inward.
  java_m30_t1_ex_6: {
    kind: "array-pointers", label: "Container With Most Water", meta: { rule: "move shorter wall" },
    array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    steps: [
      { pointers: { L: 0, R: 8 }, window: [0, 8], note: "Area = min(height) × width.", caption: "min(1,7) × 8 = 8   · left is shorter → move L" },
      { pointers: { L: 1, R: 8 }, window: [1, 8], note: "Widest tall pair — this is the best we will find.", caption: "min(8,7) × 7 = 49  ← best   · right shorter → move R", mark: { 1: "kept", 8: "kept" } },
      { pointers: { L: 1, R: 7 }, window: [1, 7], note: "Narrower and shorter — area drops.", caption: "min(8,3) × 6 = 18   · right shorter → move R" },
      { pointers: { L: 1, R: 6 }, window: [1, 6], note: "Still below 49; width keeps shrinking.", caption: "min(8,8) × 5 = 40   · tie → move either" },
      { pointers: { L: 1, R: 6 }, note: "Moving the shorter wall can only help; no later pair beats 49.", result: "49" },
    ],
  },

  // #26 Remove Duplicates from Sorted Array — slow (write) + fast (scan).
  java_m30_t1_ex_5: {
    kind: "array-pointers", label: "Remove Duplicates (in-place)", meta: { rule: "slow = last unique" },
    array: [1, 1, 2, 2, 3],
    steps: [
      { array: [1, 1, 2, 2, 3], pointers: { slow: 0, fast: 1 }, note: "slow marks the last unique value; fast scans ahead.", caption: "nums[fast]=1 == nums[slow]=1 → duplicate, advance fast only" },
      { array: [1, 1, 2, 2, 3], pointers: { slow: 0, fast: 2 }, note: "Found a new value at fast.", caption: "nums[fast]=2 ≠ nums[slow]=1 → slow++, write nums[slow]=2" },
      { array: [1, 2, 2, 2, 3], pointers: { slow: 1, fast: 3 }, note: "Wrote 2 into index 1.", caption: "nums[fast]=2 == nums[slow]=2 → duplicate, advance fast only", mark: { 1: "kept" } },
      { array: [1, 2, 2, 2, 3], pointers: { slow: 1, fast: 4 }, note: "Another new value at fast.", caption: "nums[fast]=3 ≠ nums[slow]=2 → slow++, write nums[slow]=3" },
      { array: [1, 2, 3, 2, 3], pointers: { slow: 2 }, note: "Unique prefix is nums[0..slow]. New length = slow + 1.", mark: { 0: "kept", 1: "kept", 2: "kept", 3: "dropped", 4: "dropped" }, result: "3   ([1, 2, 3])" },
    ],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    if (!exerciseId.startsWith("java_m30_t1_")) { console.error(`✗ out of lane: ${exerciseId}`); continue; }
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ exercise not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ two-pointers animations: ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
