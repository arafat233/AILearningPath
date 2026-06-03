/**
 * seedEdgeCases2.js — GAP #6 edge-case catalog, batch 2 (~31).
 * COMPLETES two patterns: prefix-sum (13) + arrays (18). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── prefix-sum (13) ─────────────────────────
  java_m30_t3_ex_11: [
    c("All tiring or all non-tiring days", "Whole array or none — handle prefix > 0 directly (answer = n) vs the first-seen map."),
    c("Prefix never positive", "Look up the earliest index with prefix − 1 to extend the interval."),
    c("Empty input", "Longest interval is 0."),
  ],
  java_m30_t3_ex_12: [
    c("goal = 0", "Count subarrays summing to 0; seed the prefix map with {0:1}."),
    c("All zeros with goal 0", "Every subarray qualifies — combinatorial count via repeated prefix 0."),
    c("No subarray hits goal", "Map lookups never match → 0."),
    c("Binary values only", "Prefix sums grow by 0/1, but the count-map approach is value-agnostic."),
  ],
  java_m30_t3_ex_13: [
    c("Array already sums to zero", "Zero operations needed."),
    c("No achievable zero-sum", "Report impossible / minimal adjustment per the spec."),
    c("Negative values", "Prefix sums can repeat at non-adjacent indices — the map still pairs them."),
  ],
  java_m30_t3_ex_14: [
    c("Window radius k exceeds bounds", "Indices with fewer than k neighbours on a side → output −1."),
    c("k = 0", "Average of a single element is the element itself."),
    c("Whole array as one window", "When 2k+1 ≥ n only the center(s) get a real average."),
    c("Integer division", "Use the prefix sum then divide once to avoid rounding drift."),
  ],
  java_m30_t3_ex_15: [
    c("Range query at the edges", "pre[r] − pre[l−1] needs a guarded pre[−1] = 0 (use a 1-based prefix)."),
    c("Empty / single element", "Prefix array of length n+1 handles both without branches."),
    c("Sum == k with negatives", "Switch from a window to a prefix HashMap of counts."),
  ],
  java_m30_t3_ex_16: [
    c("Single element", "Running sum is the element itself."),
    c("Empty array", "Return an empty array."),
    c("In-place vs new array", "Accumulate left-to-right; in-place needs only the previous cell."),
  ],
  java_m30_t3_ex_3: [
    c("Query with left = 0", "Use pre[r+1] − pre[0]; the +1 offset avoids a special case."),
    c("Many queries", "Precompute once → each query is O(1)."),
    c("Empty range / single index", "left == right returns that single element."),
  ],
  java_m30_t3_ex_4: [
    c("k = 0", "Seed {0:1}; counts subarrays whose prefix repeats."),
    c("Negative numbers", "Exactly why prefix + map beats a sliding window here."),
    c("No matching subarray", "No prefix difference equals k → 0."),
    c("Whole-array match", "Captured by the final prefix minus the seeded 0."),
  ],
  java_m30_t3_ex_5: [
    c("Contains a zero", "Product-except-self stays correct via separate left/right passes (no division)."),
    c("Two or more zeros", "Every output is 0."),
    c("Single element", "Output is [1] (empty product)."),
    c("No-division constraint", "Use prefix and suffix product arrays."),
  ],
  java_m30_t3_ex_6: [
    c("Pivot at index 0", "Left sum is 0; check before iterating."),
    c("Pivot at the last index", "Right sum is 0."),
    c("No pivot exists", "Return −1."),
    c("Negative values", "Equality of left/right sums still holds with negatives."),
  ],
  java_m30_t3_ex_7: [
    c("k = 0 edge", "Mod by 0 is undefined — guard it; only the running-sum%k logic needs k≠0."),
    c("Subarray length ≥ 2 required", "Track the earliest index per remainder; need a gap of ≥ 2."),
    c("Remainder repeats", "Same prefix%k twice ⇒ the span between sums to a multiple of k."),
    c("Negative numbers", "Normalise the modulo to stay non-negative."),
  ],
  java_m30_t3_ex_8: [
    c("Single-cell submatrix", "Inclusion–exclusion still returns just that cell."),
    c("Query touching row/col 0", "1-based prefix matrix removes the boundary branch."),
    c("Empty matrix", "No queries possible — guard upfront."),
  ],
  java_m30_t3_ex_9: [
    c("All negative numbers", "Kadane must allow a single (largest) negative, not reset to 0."),
    c("Single element", "Answer is that element."),
    c("Reset condition", "Drop the running sum when it goes negative (start fresh)."),
    c("Empty array", "Define behaviour (0 or undefined) explicitly."),
  ],

  // ───────────────────────── arrays (18) ─────────────────────────
  java_m30_t5_ex_11: [
    c("All negative numbers", "The wrap case (total − minSubarray) would be empty — fall back to plain Kadane max."),
    c("Single element", "Answer is that element."),
    c("Entire array is the max", "Normal Kadane already covers the non-wrap case."),
  ],
  java_m30_t5_ex_12: [
    c("Single element", "Already at the end → 0 jumps."),
    c("A zero before the end", "Greedy reach must already cover it, or it's unreachable."),
    c("Large first jump", "far can reach the end immediately → 1 jump."),
    c("Reachability assumed", "Problem guarantees the end is reachable; otherwise return −1."),
  ],
  java_m30_t5_ex_13: [
    c("Fewer than 2 elements", "Max gap is 0 by definition."),
    c("All equal values", "Gap is 0."),
    c("Bucket with no elements", "Skip empty buckets; gap spans across them."),
    c("Negative / large range", "Bucket width uses (max−min)/(n−1); guard divide-by-zero when max==min."),
  ],
  java_m30_t5_ex_14: [
    c("target = 0", "Counts subarrays whose prefix XOR repeats; seed {0:1}."),
    c("No qualifying subarray", "Map never yields curXor ^ target → 0."),
    c("Whole array XOR equals target", "Caught by the final prefix vs the seeded 0."),
  ],
  java_m30_t5_ex_15: [
    c("Which pattern fits", "Match constraints to the tool: two-pointer (sorted), window (contiguous), prefix (range/negatives)."),
    c("Empty / single element", "Return the identity before the main loop."),
    c("In-place vs extra space", "Prefer a write-pointer rewrite when O(1) space is required."),
  ],
  java_m30_t5_ex_16: [
    c("Prices strictly decreasing", "No profitable trade → 0."),
    c("Single day", "No transaction possible → 0."),
    c("Tie at the minimum", "Track the lowest price seen so far; ties don't change profit."),
    c("Empty prices", "Return 0."),
  ],
  java_m30_t5_ex_17: [
    c("Single-column row", "Reversing is a no-op; just invert the bit."),
    c("Already-inverted values", "XOR 1 toggles correctly regardless of starting bit."),
    c("Middle element (odd width)", "When L == R, only invert (don't double-swap)."),
  ],
  java_m30_t5_ex_18: [
    c("n = 1", "Result is [x1, y1]."),
    c("Indices interleave correctly", "ans[2i] = x[i], ans[2i+1] = y[i] — verify the index math."),
    c("Input length is 2n", "Validate the array is exactly twice n."),
  ],
  java_m30_t5_ex_19: [
    c("Single customer", "Max wealth is that customer's row sum."),
    c("Empty accounts", "Define result (0) for no customers."),
    c("Ties in wealth", "Any max is fine — return the value, not the index."),
  ],
  java_m30_t5_ex_20: [
    c("Single element", "Result is [x, x]."),
    c("Empty array", "Result is empty."),
    c("Output length", "Exactly 2n; copy the array twice."),
  ],
  java_m30_t5_ex_21: [
    c("Tie between +d and −d", "Prefer the larger (more positive) value on equal distance."),
    c("Single element", "It is trivially the closest."),
    c("All negative or all positive", "Closest is the one nearest 0 by absolute value."),
  ],
  java_m30_t5_ex_3: [
    c("All negative numbers", "Allow a single negative max; don't reset to 0."),
    c("Single element", "Answer is that element."),
    c("Empty array", "Define behaviour explicitly."),
    c("Reset rule", "Restart the running sum when it dips below 0."),
  ],
  java_m30_t5_ex_4: [
    c("No strict majority", "Boyer–Moore assumes one exists; verify with a second count pass if not guaranteed."),
    c("All identical", "Trivially the majority."),
    c("Exactly n/2 occurrences", "Not a majority (> n/2 required) — the verify pass catches it."),
  ],
  java_m30_t5_ex_5: [
    c("Array in descending order", "No next permutation → reverse to the smallest (ascending)."),
    c("Single element", "Already the only permutation."),
    c("Duplicates near the pivot", "Swap with the rightmost value greater than the pivot to stay minimal."),
  ],
  java_m30_t5_ex_6: [
    c("Empty array", "Longest run is 0."),
    c("All duplicates", "Set collapses them → length 1."),
    c("Only count run starts", "Begin counting at x where x−1 is absent → keeps it O(n)."),
    c("Negative numbers", "HashSet membership is value-agnostic."),
  ],
  java_m30_t5_ex_7: [
    c("k larger than n", "Rotate by k % n."),
    c("k = 0 or k % n = 0", "Array is unchanged."),
    c("Single element", "Rotation is a no-op."),
    c("Three-reversal method", "Reverse whole, then first k, then the rest — all in place."),
  ],
  java_m30_t5_ex_8: [
    c("First element is 0", "If you can't move from index 0 (and n>1), it's unreachable → false."),
    c("Single element", "Already at the end → true."),
    c("Trailing zeros reachable", "Greedy maxReach must cover the last index."),
  ],
  java_m30_t5_ex_9: [
    c("Contains zero", "A zero resets both running max and min products to start fresh after it."),
    c("Negative numbers", "Track BOTH max and min — a negative swaps which is largest."),
    c("Single element", "Answer is that element."),
    c("All negatives, even count", "Their product can be the maximum."),
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
  console.log(`✅ edge-cases-2: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
