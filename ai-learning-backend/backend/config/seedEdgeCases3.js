/**
 * seedEdgeCases3.js — GAP #6 edge-case catalog, batch 3 (~50).
 * COMPLETES four patterns: bit-manipulation (15), binary-search (13),
 * monotonic-stack (13), recursion (9). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── bit-manipulation (15) ─────────────────────────
  java_m47_t2_ex_1: [
    c("i out of [0,31]", "Validate the bit index; shifting by ≥32 is undefined for int."),
    c("Sign bit (i = 31)", "Use the result of (n >> i) & 1; logical intent is the lowest bit."),
    c("Negative n", "Two's-complement bits are still well-defined for the mask."),
  ],
  java_m47_t2_ex_2: [
    c("Bit already set", "OR-ing is idempotent — no change."),
    c("i = 31 on an int", "1 << 31 is Integer.MIN_VALUE; works but mind the sign."),
    c("Clearing vs setting", "setBit uses |; clearBit needs & ~mask — don't confuse them."),
  ],
  java_m47_t2_ex_4: [
    c("Carry chain", "Loop: sum = a ^ b, carry = (a & b) << 1, until carry is 0."),
    c("Negative operands", "Two's-complement makes XOR/AND addition work for negatives too."),
    c("Overflow", "Wraps exactly like normal int addition (mod 2³²)."),
  ],
  java_m47_t2_ex_5: [
    c("Equal-length strings", "XOR all chars of both; the survivor is the added letter."),
    c("Repeated letters", "Counts cancel in pairs, so duplicates are fine."),
    c("Single added char", "Sum-difference or XOR both isolate it."),
  ],
  java_m47_t3_ex_1: [
    c("n = 0", "Not a power of two → false (n & (n−1) == 0 would wrongly pass without the n>0 guard)."),
    c("Negative n", "Powers of two are positive → guard n > 0."),
    c("n = 1", "2⁰ = 1 → true."),
  ],
  java_m47_t3_ex_2: [
    c("n = 0", "Zero set bits → loop runs 0 times → 0."),
    c("Negative n", "Treat as unsigned bits; Kernighan still counts correctly in two's complement."),
    c("All bits set", "Loop runs exactly popcount times (efficient: clears lowest set bit each step)."),
  ],
  java_m47_t3_ex_4: [
    c("n = 0", "Hamming weight 0."),
    c("Negative n (high bit set)", "Use >>> or mask to count all 32 bits, not arithmetic shift."),
    c("0xFFFFFFFF", "All 32 bits → 32."),
  ],
  java_m47_t3_ex_6: [
    c("n = 0 or negative", "Not a power of two → guard before n & (n−1)."),
    c("n = 1", "True (2⁰)."),
    c("Integer.MIN_VALUE", "Has one bit set but is negative → the n>0 guard rejects it."),
  ],
  java_m47_t3_ex_7: [
    c("i = 0", "bits[0] = 0 (base case)."),
    c("DP recurrence", "bits[i] = bits[i >> 1] + (i & 1) reuses the half already computed."),
    c("n = 0", "Return [0]."),
  ],
  java_m47_t4_ex_1: [
    c("Single lone element", "XOR of all cancels pairs, leaving the unique value."),
    c("All paired except one", "Required precondition; otherwise the result is meaningless."),
    c("Negative numbers", "XOR is bitwise — sign doesn't matter."),
  ],
  java_m47_t4_ex_2: [
    c("Missing 0", "XOR indices 0..n with values; 0 still participates via the index."),
    c("Missing n (last)", "Including n in the index XOR catches the top of the range."),
    c("Empty-ish array", "Single-element [0] → missing 1, or [1] → missing 0."),
  ],
  java_m47_t4_ex_3: [
    c("Number appears once among triples", "Two-state mask (ones/twos) resets a bit after 3 occurrences."),
    c("Negative values", "Bit logic is sign-agnostic."),
    c("Large counts", "Only the mod-3 state per bit matters, not the raw count."),
  ],
  java_m47_t4_ex_4: [
    c("Two unique numbers", "XOR-all gives a^b; a set bit in it splits the array into two groups."),
    c("Differing bit choice", "Use the lowest set bit (x & -x) to partition."),
    c("Duplicates of the pair", "Impossible by problem definition — each unique appears once."),
  ],
  java_m47_t5_ex_1: [
    c("Swapping a variable with itself", "XOR swap zeroes it out — guard a !== b (or by index)."),
    c("Equal values, different vars", "Works fine; only same-storage aliasing is the trap."),
    c("Readability", "Correct but cryptic — prefer a temp unless space is truly constrained."),
  ],
  java_m47_t5_ex_2: [
    c("target = 0", "The empty subset (XOR 0) counts — include it."),
    c("All zeros", "Every subset XORs to 0 → 2ⁿ subsets match target 0."),
    c("Unreachable target", "DP over XOR values returns 0 if target's bit-space is never hit."),
  ],

  // ───────────────────────── binary-search (13) ─────────────────────────
  java_m39_t1_ex_2: [
    c("Empty array", "lo > hi immediately → not found (−1)."),
    c("Target absent", "Pointers cross → return −1."),
    c("mid overflow", "Use lo + (hi − lo) / 2, not (lo + hi) / 2."),
    c("Target at the ends", "Inclusive bounds [lo, hi] reach index 0 and n−1."),
  ],
  java_m39_t1_ex_3: [
    c("Target not present", "Both first and last searches return −1."),
    c("All elements equal the target", "First = 0, last = n−1."),
    c("Single occurrence", "First == last."),
    c("Bias direction", "First-occurrence keeps searching left on a match; last keeps right."),
  ],
  java_m39_t1_ex_4: [
    c("Target smaller than all", "Insert at index 0."),
    c("Target larger than all", "Insert at n."),
    c("Target already present", "Return its (leftmost) index."),
    c("Empty array", "Insert at 0."),
  ],
  java_m39_t1_ex_5: [
    c("n = 0 or 1", "sqrt is n itself."),
    c("Perfect square", "Return the exact root."),
    c("mid*mid overflow", "Compare with division (mid <= n/mid) or use long."),
    c("Floor result", "Return the largest r with r² ≤ n."),
  ],
  java_m39_t1_ex_6: [
    c("Target absent", "Return [−1, −1]."),
    c("Single occurrence", "first == last index."),
    c("Whole array is the target", "[0, n−1]."),
    c("Two separate binary searches", "One biased left, one biased right."),
  ],
  java_m39_t3_ex_2: [
    c("No rotation", "Degenerates to ordinary binary search."),
    c("Target at the pivot", "Check mid directly before deciding the sorted half."),
    c("Single element", "Compare and return."),
    c("Which half is sorted", "Exactly one half is sorted each step; test target within it."),
  ],
  java_m39_t3_ex_3: [
    c("No rotation", "First element is the min."),
    c("Single element", "It is the min."),
    c("Pivot at the last index", "Compare mid with hi to decide the side holding the min."),
    c("Duplicates excluded", "This variant assumes distinct values."),
  ],
  java_m39_t3_ex_4: [
    c("Duplicates at lo/mid/hi", "When nums[lo]==nums[mid]==nums[hi], shrink both ends by one (O(n) worst case)."),
    c("Target absent", "Return false after the search collapses."),
    c("All identical", "Worst case degrades to linear — that's expected."),
  ],
  java_m39_t3_ex_5: [
    c("Single element", "It is a peak."),
    c("Strictly increasing", "Peak is the last element."),
    c("Strictly decreasing", "Peak is the first element."),
    c("Climb toward the larger neighbour", "Guarantees convergence to some peak in O(log n)."),
  ],
  java_m39_t4_ex_2: [
    c("Empty matrix / empty row", "Guard before computing flat indices."),
    c("Single cell", "lo == hi case."),
    c("Flat-index mapping", "row = mid / cols, col = mid % cols — verify dimensions."),
    c("Target out of range", "Below first or above last cell → not found."),
  ],
  java_m39_t4_ex_3: [
    c("Empty matrix", "Return false immediately."),
    c("Start corner", "Begin top-right (or bottom-left) so each step eliminates a row or column."),
    c("Target absent", "Walk off the grid → false."),
    c("Single row/column", "Staircase still works as a 1-D scan."),
  ],
  java_m39_t4_ex_4: [
    c("k = 1", "Smallest element (top-left)."),
    c("k = n²", "Largest element (bottom-right)."),
    c("Duplicates", "Count entries ≤ mid (counts duplicates) so k lands correctly."),
    c("Binary search on value, not index", "Search the value range [min, max], not positions."),
  ],
  java_m39_t5_ex_2: [
    c("All elements < target", "lower_bound returns n (past the end)."),
    c("Target smaller than all", "Returns 0."),
    c("Duplicates of target", "Returns the FIRST index not less than target."),
    c("Empty array", "Returns 0."),
  ],

  // ───────────────────────── monotonic-stack (13) ─────────────────────────
  java_m33_t2_ex_1: [
    c("No greater element", "Default to −1 for elements left on the stack."),
    c("Strictly decreasing input", "Nothing pops until the end → all −1."),
    c("Query subset (NGE I)", "Map results back only for the queried values via a HashMap."),
  ],
  java_m33_t2_ex_10: [
    c("All distinct letters", "No removals — output is the sorted-by-constraint string."),
    c("Repeated letters", "Only pop a larger letter if it appears again later (track last index)."),
    c("Already in result", "Skip letters already placed (a 'seen' set)."),
  ],
  java_m33_t2_ex_11: [
    c("Increasing vs decreasing stack", "Choose the monotonic direction by whether you want next-greater or next-smaller."),
    c("Empty input", "Return the identity result."),
    c("Each element pushed/popped once", "Guarantees O(n) — never re-scan."),
  ],
  java_m33_t2_ex_12: [
    c("Circular arrays", "Iterate 2n with modulo indexing."),
    c("Ties (equal neighbours)", "Decide < vs ≤ in the pop test to define strictness."),
    c("Indices vs values", "Store indices when you need distances/widths."),
  ],
  java_m33_t2_ex_13: [
    c("Fewer than 3 elements", "No 132 pattern possible → false."),
    c("Strictly increasing", "No '2' < '3' after a smaller '1' → false."),
    c("Track the '2' (max popped)", "Maintain min-prefix as '1' and a stack for the '2' candidate."),
  ],
  java_m33_t2_ex_2: [
    c("Circular wrap", "Scan 2n with index % n so the end can see the front."),
    c("No greater element anywhere", "Remain −1 after two passes."),
    c("All equal", "Strict > test leaves everything at −1."),
  ],
  java_m33_t2_ex_3: [
    c("Empty histogram", "Area 0."),
    c("Strictly increasing bars", "All pop at the end; widths extend to index 0."),
    c("Sentinel zero", "Append a trailing 0 to flush the stack cleanly."),
    c("Equal-height bars", "Either pop rule works as long as it's consistent."),
  ],
  java_m33_t2_ex_4: [
    c("Flat or empty", "No water trapped → 0."),
    c("Monotonic terrain", "Needs a higher bar on both sides → 0."),
    c("Wide basin", "Width spans from the popped valley to the new boundary."),
  ],
  java_m33_t2_ex_5: [
    c("Temperatures never rise", "Those days get 0."),
    c("Strictly increasing", "Each day waits exactly 1 (next day)."),
    c("Equal temperatures", "Use strict > so equal days don't count as warmer."),
  ],
  java_m33_t2_ex_6: [
    c("First day", "Span is always 1."),
    c("Strictly increasing prices", "Span grows each day."),
    c("Equal prices", "Use ≥ to include equal previous days in the span."),
  ],
  java_m33_t2_ex_7: [
    c("Duplicate minimums", "Use strict-vs-nonstrict on the two boundaries to avoid double counting."),
    c("All equal", "Each element is the min of many subarrays; counts via left*right spans."),
    c("Overflow", "Sum can be large → use long and modulo per the spec."),
  ],
  java_m33_t2_ex_8: [
    c("Empty matrix", "Area 0."),
    c("All zeros", "No rectangle → 0."),
    c("Row-by-row heights", "Build a histogram per row, reuse Largest-Rectangle."),
  ],
  java_m33_t2_ex_9: [
    c("No smaller element", "Default to −1."),
    c("Strictly increasing input", "Each element's previous-smaller is its immediate left."),
    c("Equal values", "Strictness decides whether equal counts as smaller."),
  ],

  // ───────────────────────── recursion (9) ─────────────────────────
  java_m48_t1_ex_3: [
    c("Empty set", "Base case yields the single empty subset."),
    c("Duplicates", "Sort + skip same-level repeats to avoid duplicate subsets."),
    c("2ⁿ growth", "Output size is exponential — fine for small n only."),
  ],
  java_m48_t2_ex_1: [
    c("Empty input", "Power set is [[]]."),
    c("Single element", "[[], [x]]."),
    c("Include/exclude recursion", "Each element doubles the result count."),
  ],
  java_m48_t2_ex_2: [
    c("target = 0", "The empty subset counts."),
    c("Negative numbers", "Pruning by remaining sum no longer valid — must explore both branches."),
    c("No subset reaches target", "Return 0."),
  ],
  java_m48_t2_ex_3: [
    c("Mask 0", "Represents the empty subset."),
    c("n bits", "Iterate masks 0..2ⁿ−1; check each set bit to include its element."),
    c("Large n", "2ⁿ masks — only feasible for small n."),
  ],
  java_m48_t3_ex_1: [
    c("Duplicate elements", "Use a 'used' set per level to avoid duplicate permutations."),
    c("Single element", "One permutation."),
    c("n! growth", "Factorial output — small n only."),
  ],
  java_m48_t3_ex_3: [
    c("k = 0", "One combination: the empty set."),
    c("k = n", "One combination: the whole set."),
    c("Advance start index", "Prevents reusing earlier elements (order-independent)."),
    c("k > n", "No combinations → empty."),
  ],
  java_m48_t4_ex_1: [
    c("Empty or single element", "Already sorted — base case."),
    c("Even split", "mid = (lo+hi)/2; recurse both halves then merge."),
    c("Duplicates", "Use ≤ in merge to stay stable."),
  ],
  java_m48_t5_ex_1: [
    c("n = 1", "Trivially 1 solution."),
    c("n = 2 or 3", "0 solutions — recursion bottoms out with no placement."),
    c("Diagonal conflicts", "Track both diagonals (r+c and r−c) plus columns."),
  ],
  java_m48_t5_ex_2: [
    c("No combination sums to target", "Return empty after pruning."),
    c("Reuse allowed vs not", "Pass the same or next start index accordingly."),
    c("Pruning", "Sort candidates; stop a branch when the remainder goes negative."),
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
  console.log(`✅ edge-cases-3: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
