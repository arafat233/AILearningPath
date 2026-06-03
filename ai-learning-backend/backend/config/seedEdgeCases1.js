/**
 * seedEdgeCases1.js — GAP #6 edge-case catalog, batch 1 (~39).
 * COMPLETES two patterns: two-pointers (25) + sliding-window (14).
 * Each problem gets a curated [{case, handling}] list. Idempotent ($set).
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── two-pointers (25) ─────────────────────────
  java_m30_t1_ex_11: [
    c("Array shorter than 2", "No pair can exist — return early (empty result)."),
    c("Same element used twice", "Skip j === i; a value may only pair with a different index."),
    c("Multiple valid pairs", "Return the first found (problem guarantees exactly one) or all, per the spec."),
    c("Negative numbers / target", "Arithmetic is unaffected — the complement check still holds."),
  ],
  java_m30_t1_ex_12: [
    c("Empty or flat array", "No walls to trap water → return 0."),
    c("Strictly increasing or decreasing", "Water needs a higher bar on BOTH sides → 0."),
    c("Plateaus / equal heights", "Move the pointer on the smaller side; ties can move either."),
    c("Very tall single peak", "leftMax/rightMax track the bounding wall so no negative water is added."),
  ],
  java_m30_t1_ex_13: [
    c("Fewer than 4 elements", "Return an empty list — no quadruplet is possible."),
    c("Duplicate quadruplets", "Sort first, then skip equal values at every one of the four positions."),
    c("Sum overflows int", "Accumulate in a long before comparing to target."),
    c("All identical values", "Only [v,v,v,v] qualifies (if 4v === target); dedup prevents repeats."),
  ],
  java_m30_t1_ex_14: [
    c("t longer than s", "s can never cover t → return empty string."),
    c("No window covers t", "have-counter never reaches need → return \"\"."),
    c("Repeated chars in t", "Match by COUNT per char, not mere presence."),
    c("Whole string is the window", "Shrinking from the left simply never fires; return s."),
  ],
  java_m30_t1_ex_15: [
    c("Pointers cross", "Loop condition is L < R (or L <= R) — stop the moment they meet to avoid double-counting."),
    c("Off-by-one on bounds", "Decide inclusive vs exclusive ends up front and keep it consistent."),
    c("Which pointer to move", "Move the one that can improve the objective; moving the wrong one skips answers."),
  ],
  java_m30_t1_ex_16: [
    c("nums2 empty (n = 0)", "nums1 is already the answer — no work."),
    c("nums1 has no real elements (m = 0)", "Copy nums2 directly into nums1."),
    c("Overwrite risk", "Fill from the BACK (largest first) so unmerged nums1 values aren't clobbered."),
    c("Duplicates across arrays", "Use >= when choosing to keep it stable and correct."),
  ],
  java_m30_t1_ex_3: [
    c("No valid pair", "Pointers cross without a hit → return the 'not found' sentinel."),
    c("Duplicates", "Sorted input means equal values are adjacent; the sum check still decides direction."),
    c("1-indexed output", "Add 1 to both indices before returning (problem is 1-based)."),
    c("Negative values", "Works unchanged — sorted order is all the algorithm relies on."),
  ],
  java_m30_t1_ex_4: [
    c("Empty string", "Vacuously a palindrome → true."),
    c("Only non-alphanumeric chars", "All skipped → treated as empty → true."),
    c("Mixed case", "Lowercase (or uppercase) both sides before comparing."),
    c("Single character", "Trivially a palindrome → true."),
  ],
  java_m30_t1_ex_5: [
    c("Empty array", "Length 0 → return 0."),
    c("All elements equal", "Only one unique value survives → return 1."),
    c("No duplicates", "Every element kept → return n."),
    c("Return value vs array", "Return the new LENGTH; elements past it are don't-care."),
  ],
  java_m30_t1_ex_6: [
    c("Fewer than 2 lines", "No container possible → 0."),
    c("All equal heights", "Width dominates → widest pair wins."),
    c("Zero-height lines", "Contribute 0 area but still bound width; move the shorter (zero) side."),
    c("Which side to move", "Always move the shorter line — moving the taller can't increase area."),
  ],
  java_m30_t1_ex_7: [
    c("Fewer than 3 elements", "Return empty — no triplet."),
    c("Duplicate triplets", "Sort, then skip equal values for the fixed index AND both inner pointers."),
    c("All zeros", "[0,0,0] is the single valid triplet; dedup keeps it once."),
    c("No triplet sums to 0", "Pointers exhaust without a hit → empty list."),
  ],
  java_m30_t1_ex_8: [
    c("All zeros", "All move to the end; the write pointer stays at 0."),
    c("No zeros", "Every swap is a no-op (i === write); order preserved."),
    c("Order preservation", "Swap-forward (not overwrite) keeps non-zero relative order."),
    c("Single element", "Trivially already done."),
  ],
  java_m30_t1_ex_9: [
    c("All negatives", "Squares come out in DESCENDING magnitude → fill result from the back."),
    c("All non-negative", "Already sorted — squares stay sorted."),
    c("Contains zero", "Zero squares to 0, the smallest; the two-pointer merge handles it."),
    c("Mixed signs", "Compare |left| vs |right| from both ends; larger square goes to the tail."),
  ],
  java_m30_t4_ex_11: [
    c("All negative", "Whole array is the 'negative' region; order must be preserved."),
    c("All positive", "No negatives to move — array unchanged."),
    c("Stability required", "A plain swap reorders; use rotation/shift or an aux pass to keep relative order."),
    c("Empty array", "Nothing to partition."),
  ],
  java_m30_t4_ex_12: [
    c("Duplicate appears many times", "Floyd still converges on the value, regardless of copy count."),
    c("Duplicate at the boundaries (1 or n)", "Cycle detection is value-based, so position doesn't matter."),
    c("Read-only constraint", "Don't sort/modify — use slow/fast on value-as-next."),
    c("n+1 numbers in [1, n]", "Pigeonhole guarantees a cycle exists, so Floyd always terminates."),
  ],
  java_m30_t4_ex_13: [
    c("Already correctly placed", "No swaps fire; one pass confirms it."),
    c("Evens and odds equal in count", "Guaranteed by the problem; pointers always find a partner."),
    c("Size 2", "One even, one odd — at most a single swap."),
    c("Misplaced pair", "Advance even-ptr to a wrong-parity slot, odd-ptr likewise, then swap."),
  ],
  java_m30_t4_ex_14: [
    c("Already sorted", "Every cycle has length 1 → 0 swaps."),
    c("Reverse sorted", "Cycles of length 2 dominate → ~n/2 swaps."),
    c("Duplicate values", "Ambiguous targets — fix a tie-break (e.g., stable index) or it loops."),
    c("Self-cycle", "An element already home contributes 0 (length-1 cycle)."),
  ],
  java_m30_t4_ex_15: [
    c("Three-region invariant", "low/mid/high must always bound [<p | ==p | >p]; breaking it corrupts the partition."),
    c("Equal-to-pivot block", "Advance mid only; never swap, or you reshuffle settled equals."),
    c("Pivot at an extreme", "One region stays empty — still correct in a single pass."),
  ],
  java_m30_t4_ex_3: [
    c("All one color", "Two of the three regions stay empty; one pass still works."),
    c("Already sorted", "mid walks through; no harmful swaps."),
    c("mid meets high", "Loop must stop when mid > high, or it swaps past the boundary."),
    c("Empty array", "Nothing to sort."),
  ],
  java_m30_t4_ex_4: [
    c("All same value", "Single non-empty region; others empty."),
    c("Empty array", "Return immediately."),
    c("Boundary crossing", "Same mid/high stop condition as Sort Colors."),
  ],
  java_m30_t4_ex_5: [
    c("Pivot is the maximum", "Everything lands left of the pivot."),
    c("Pivot is the minimum", "Everything lands right; pivot ends at index 0."),
    c("Duplicates of the pivot", "Decide a consistent side (or 3-way) so equal keys don't thrash."),
  ],
  java_m30_t4_ex_6: [
    c("Unknown status value", "Map to a default bucket rather than dropping it."),
    c("Null / missing status", "Guard against NPE; treat as a defined 'unknown' group."),
    c("Stable ordering", "Within a status, preserve original arrival order."),
  ],
  java_m30_t4_ex_7: [
    c("All 0s", "Ones-region empty; pointer logic still terminates."),
    c("All 1s", "Zeros-region empty."),
    c("Empty array", "No-op."),
  ],
  java_m30_t4_ex_8: [
    c("Many duplicates", "This is the win — the equal block is skipped, not re-sorted."),
    c("Already sorted", "Poor pivot choice degrades to O(n²); randomize/median-of-three."),
    c("Single element / empty", "Base case returns immediately."),
  ],
  java_m30_t4_ex_9: [
    c("Duplicates at the median", "Interleave larges and smalls in REVERSE so equal neighbours don't touch."),
    c("Odd vs even length", "Index mapping (2i+1 then 2i) must cover both parities exactly."),
    c("All equal values", "No valid wiggle exists — recognise the impossible input."),
  ],

  // ───────────────────────── sliding-window (14) ─────────────────────────
  java_m30_t2_ex_11: [
    c("Negative numbers", "A pure shrinking window breaks; use prefix-sum + a count map instead."),
    c("k = 0", "Count subarrays summing to 0 (empty-prefix seeded as 1)."),
    c("Empty array", "Zero subarrays → 0."),
    c("Whole array sums to k", "The full-range prefix difference catches it."),
  ],
  java_m30_t2_ex_12: [
    c("Fewer than 2 fruit types", "Whole array fits in two baskets → return its length."),
    c("All one type", "Window never needs to shrink."),
    c("Shrink trigger", "When a 3rd type enters, advance left until one type's count hits 0."),
  ],
  java_m30_t2_ex_13: [
    c("Window larger than the array", "Clamp to n or return the whole-array aggregate."),
    c("Ties in the aggregate", "Define the tie-break (first/last) explicitly."),
    c("Single element", "Window of size 1 is the element itself."),
  ],
  java_m30_t2_ex_14: [
    c("All 1s", "You must still delete exactly one → answer is len − 1."),
    c("All 0s", "No 1s to keep → 0."),
    c("No zeros at all", "Same as all-1s: forced deletion gives len − 1."),
    c("Multiple zeros", "Window allows at most one 0; shrink past the older zero."),
  ],
  java_m30_t2_ex_15: [
    c("Fixed vs variable window", "Fixed: slide size k. Variable: expand right, shrink left on a condition."),
    c("Empty input", "Return the identity (0 / empty) before entering the loop."),
    c("Shrink invariant", "After each expand, restore validity before recording the answer."),
  ],
  java_m30_t2_ex_16: [
    c("k equals n", "The single window is the whole array."),
    c("Single element (k = 1)", "Each element is its own average."),
    c("Negative values", "Sum can decrease — comparison still finds the max."),
    c("Floating precision", "Compare sums (ints) and divide once at the end."),
  ],
  java_m30_t2_ex_17: [
    c("k ≥ number of zeros", "Entire array is flippable → return n."),
    c("k = 0", "No flips — longest existing run of 1s."),
    c("All ones", "Window spans everything regardless of k."),
    c("Shrink condition", "When zeros-in-window exceeds k, advance left past a zero."),
  ],
  java_m30_t2_ex_3: [
    c("k > n", "No window of size k exists → return 0 / sentinel."),
    c("k = n", "One window — the whole-array sum."),
    c("Negative values", "Running sum still slides correctly."),
    c("Empty array", "Return 0."),
  ],
  java_m30_t2_ex_4: [
    c("Empty string", "Longest substring length is 0."),
    c("All identical characters", "Window can hold only one → answer 1."),
    c("All unique characters", "Window grows to the full length n."),
    c("Repeat outside window", "Only jump left past the duplicate's LAST index inside the window."),
  ],
  java_m30_t2_ex_5: [
    c("Pattern longer than text", "No anagram possible → empty result."),
    c("No matches", "Frequency window never equals p's frequency."),
    c("Overlapping matches", "Slide by one; overlapping start indices are all valid."),
    c("Repeated chars in p", "Compare full 26-count frequency, not a set."),
  ],
  java_m30_t2_ex_6: [
    c("Target never reached", "No qualifying subarray → return 0."),
    c("Whole array needed", "Window grows to n before satisfying the sum."),
    c("Single element ≥ target", "Minimal length is 1."),
    c("All positive assumed", "Shrinking works only because values are positive."),
  ],
  java_m30_t2_ex_7: [
    c("Fewer than 2 distinct chars", "Whole string qualifies."),
    c("All same character", "One distinct type — never shrink."),
    c("Exactly 2 distinct", "Window holds both; a 3rd triggers a shrink."),
  ],
  java_m30_t2_ex_8: [
    c("k ≥ window length", "Everything can be replaced → window spans the string."),
    c("k = 0", "Longest run of a single repeated char."),
    c("All same character", "No replacements needed; answer is n."),
    c("Window validity", "Valid while (windowLen − maxFreq) ≤ k; else shrink."),
  ],
  java_m30_t2_ex_9: [
    c("k = 0", "A value can't be a duplicate of itself within distance 0 → false."),
    c("k ≥ n", "The window is the whole array — any duplicate counts."),
    c("No duplicates", "Set never reports a repeat → false."),
    c("Duplicate farther than k apart", "Evict indices leaving the window so stale dups don't false-positive."),
  ],
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, edge_cases] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { edge_cases } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ edge-cases-1: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
