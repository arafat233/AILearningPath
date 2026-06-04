/**
 * seedEdgeCases9.js — GAP #6 edge-case catalog, batch 9 (~56).
 * COMPLETES heap (33) + sorting (23). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── heap (33) ─────────────────────────
  java_m36_t1_ex_1: [
    c("Empty heap", "peek/poll must guard against null."),
    c("Min vs max", "Default is min-heap; reverse the comparator for max."),
    c("Duplicates", "Allowed — heap keeps all copies."),
  ],
  java_m36_t1_ex_10: [
    c("k = 1 / k = n²", "Smallest / largest element."),
    c("Duplicates", "Min-heap of row fronts handles repeats."),
    c("Binary-search alternative", "Counting ≤ mid avoids storing the heap."),
  ],
  java_m36_t1_ex_11: [
    c("Empty input", "Identity result per sub-task."),
    c("k larger than n", "Clamp k to n."),
    c("Heap choice", "Size-k min-heap for K-largest; two heaps for median."),
  ],
  java_m36_t1_ex_12: [
    c("Empty input", "Guard before polling."),
    c("Comparator direction", "Decide min/max up front."),
    c("Bounded heap", "Keep size k to bound time and space."),
  ],
  java_m36_t1_ex_2: [
    c("k = 1", "The maximum."),
    c("k = n", "The minimum."),
    c("Duplicates", "Size-k min-heap; counts toward k normally."),
  ],
  java_m36_t1_ex_3: [
    c("Empty / single element", "Already sorted."),
    c("In-place", "Build a max-heap, repeatedly swap root to the end."),
    c("Duplicates", "Stable order is NOT guaranteed by heap sort."),
  ],
  java_m36_t1_ex_4: [
    c("k larger than distinct values", "Return all distinct values."),
    c("Frequency ties", "Any order among equal-frequency items is acceptable."),
    c("Bucket vs heap", "Bucket sort by count gives O(n); heap gives O(n log k)."),
  ],
  java_m36_t1_ex_5: [
    c("k ≥ number of points", "Return all points."),
    c("Distance ties", "Any of the equally-close points is acceptable."),
    c("Avoid sqrt", "Compare squared distances."),
  ],
  java_m36_t1_ex_6: [
    c("One stone left", "Return it."),
    c("All stones equal pairs", "Could reduce to 0."),
    c("Two stones collide", "Push back the positive difference (if any)."),
  ],
  java_m36_t1_ex_7: [
    c("Single element", "Median is that element."),
    c("Even vs odd count", "Average the two heap tops, or take the larger heap's top."),
    c("Rebalance", "Keep the two heaps within size 1 of each other."),
  ],
  java_m36_t1_ex_8: [
    c("All meetings overlap", "Rooms needed = meeting count."),
    c("No overlaps", "1 room."),
    c("End == next start", "Decide if a room frees exactly at the boundary."),
  ],
  java_m36_t1_ex_9: [
    c("Cooldown 0", "No idle; answer is the task count."),
    c("One task type", "Idle frame = (count−1)*(n+1)+1."),
    c("Many distinct tasks", "No idling needed."),
  ],
  java_m36_t2_ex_1: [
    c("Stream shorter than k", "Until k elements arrive, the kth-largest is undefined/added lazily."),
    c("Duplicates", "Counted toward k normally."),
    c("Size-k min-heap", "Top is always the kth largest."),
  ],
  java_m36_t2_ex_10: [
    c("Empty input", "Identity per sub-problem."),
    c("Min vs max vs two-heap", "Choose by the metric (K-th, median, scheduling)."),
    c("Bounded size", "Keep the heap at size k."),
  ],
  java_m36_t2_ex_11: [
    c("Empty input", "Guard polls."),
    c("Lazy deletion", "Discard stale tops on peek/poll."),
    c("Two-heap median", "Balance the halves."),
  ],
  java_m36_t2_ex_2: [
    c("Single element", "Median is that element."),
    c("Even count", "Average the two middle values."),
    c("Rebalancing", "Move a top across heaps to keep sizes within 1."),
  ],
  java_m36_t2_ex_3: [
    c("Most frequent char > (n+1)/2", "Impossible to reorganize → return \"\"."),
    c("Single char string", "Already valid."),
    c("Greedy", "Always place the highest-remaining char that differs from the last."),
  ],
  java_m36_t2_ex_4: [
    c("Single list", "Range is that list's [min,max] span shrunk to one element."),
    c("Lists of different lengths", "Stop when the shortest list is exhausted."),
    c("Min-heap of fronts", "Advance the list holding the current minimum."),
  ],
  java_m36_t2_ex_5: [
    c("Not enough capital for any project", "Return current capital unchanged."),
    c("k larger than project count", "Do all affordable projects."),
    c("Two heaps", "Min-heap by capital to unlock, max-heap by profit to pick."),
  ],
  java_m36_t2_ex_6: [
    c("Window size 1", "Median is the single element."),
    c("Even window", "Average the two middle values (mind int overflow → use double/long)."),
    c("Removing from a heap", "Lazy deletion / balanced two-heap with a delete map."),
  ],
  java_m36_t2_ex_7: [
    c("Some lists empty", "Skip null heads when seeding the heap."),
    c("All lists empty", "Return null."),
    c("Heap size", "≤ k entries → O(N log k)."),
  ],
  java_m36_t2_ex_8: [
    c("Capacity always sufficient", "Never need to drop passengers → true."),
    c("Single trip exceeds capacity", "Immediately false."),
    c("Sort by start / diff array", "Process pickups and drop-offs in order."),
  ],
  java_m36_t2_ex_9: [
    c("Ladders cover all big climbs", "Bricks may be untouched."),
    c("No climbs (all descents)", "Reach the end for free."),
    c("Min-heap of climbs", "Smallest covered climb falls back to bricks when over ladders."),
  ],
  java_m36_t3_ex_2: [
    c("Insert into empty heap", "New element is the root."),
    c("extractMax on one element", "Returns it, heap becomes empty."),
    c("Sift up/down bounds", "Stop at the root / last index."),
  ],
  java_m36_t3_ex_3: [
    c("Comparator ties", "Add a stable secondary key if order matters."),
    c("Reverse for max-heap", "Negate or use reverseOrder()."),
    c("Empty heap", "Guard poll/peek."),
  ],
  java_m36_t3_ex_4: [
    c("k larger than all pairs", "Return all m*n pairs."),
    c("One list empty", "No pairs."),
    c("Seed smartly", "Push (a[i], b[0]); expand to (i, j+1) to bound the heap."),
  ],
  java_m36_t3_ex_5: [
    c("remove a non-existent value", "No-op (or guard)."),
    c("Lazy marks pile up", "Purge marked tops on peek/poll."),
    c("Empty after removals", "peek returns null/guard."),
  ],
  java_m36_t4_ex_2: [
    c("Some arrays empty", "Skip them when seeding."),
    c("All empty", "Return empty."),
    c("Heap of (val, arrayIdx, idx)", "Advance the popped array's pointer."),
  ],
  java_m36_t4_ex_3: [
    c("n = 1", "First ugly number is 1."),
    c("Dedup multiples", "A value reachable via 2/3/5 must not be counted twice."),
    c("Overflow", "Multiples can overflow int — use long."),
  ],
  java_m36_t4_ex_4: [
    c("k = array length", "Return the whole array."),
    c("x outside the range", "Window clamps to one end."),
    c("Ties on distance", "Prefer the smaller value."),
  ],
  java_m36_t5_ex_2: [
    c("Single stick", "Cost 0 (nothing to connect)."),
    c("Two sticks", "Cost is their sum."),
    c("Greedy", "Always combine the two smallest (min-heap)."),
  ],
  java_m36_t5_ex_3: [
    c("Start tank reaches target", "0 stops."),
    c("Unreachable even with all fuel", "Return −1."),
    c("Max-heap of passed stations", "Refuel from the largest when stuck."),
  ],
  java_m36_t5_ex_4: [
    c("Overlapping events on one day", "Attend the soonest-ending available one."),
    c("Single event", "Attend it on any day in its range."),
    c("Expired events", "Drop events whose end day has passed."),
  ],

  // ───────────────────────── sorting (23) ─────────────────────────
  java_m38_t1_ex_1: [
    c("Empty / single element", "Already sorted (base case)."),
    c("Duplicates", "Use ≤ in merge to stay stable."),
    c("Extra space", "Needs O(n) auxiliary array."),
  ],
  java_m38_t1_ex_13: [
    c("Already sorted", "Early-exit on a swap-free pass → O(n)."),
    c("Reverse sorted", "Worst case O(n²)."),
    c("Duplicates", "Stable (adjacent equal elements never swap)."),
  ],
  java_m38_t1_ex_15: [
    c("Already sorted", "Still O(n²) comparisons."),
    c("Duplicates", "Not stable (a swap can reorder equals)."),
    c("Few swaps", "Only O(n) swaps total."),
  ],
  java_m38_t1_ex_16: [
    c("Nearly sorted", "O(n) best case (few shifts)."),
    c("Reverse sorted", "O(n²) worst case."),
    c("Stable", "Shift, don't swap, to preserve order."),
  ],
  java_m38_t1_ex_17: [
    c("Gap sequence choice", "Affects performance; shrink to 1 at the end."),
    c("Already sorted", "Few shifts per gap."),
    c("Not stable", "Gapped moves can reorder equals."),
  ],
  java_m38_t1_ex_2: [
    c("Already sorted", "Lomuto picks a bad pivot → O(n²); randomize."),
    c("Many duplicates", "Degrades unless 3-way partition used."),
    c("Single element / empty", "Base case."),
  ],
  java_m38_t1_ex_3: [
    c("Empty / single element", "Already sorted."),
    c("In-place", "Max-heapify then extract to the end."),
    c("Not stable", "Heap operations reorder equal keys."),
  ],
  java_m38_t1_ex_4: [
    c("Many duplicates", "Equal block is skipped — the win case."),
    c("Already sorted", "Pivot choice matters; randomize."),
    c("All equal", "One pass, no recursion needed."),
  ],
  java_m38_t1_ex_5: [
    c("Sorted ascending", "0 inversions."),
    c("Sorted descending", "Maximum inversions n(n−1)/2."),
    c("Count during merge", "Add (mid−i+1) when a right element is taken first."),
  ],
  java_m38_t2_ex_1: [
    c("Negative values", "Offset by min, or handle a separate negative range."),
    c("Large value range", "Memory ∝ range — only good when range is small."),
    c("Stable variant", "Process from the end using prefix counts."),
  ],
  java_m38_t2_ex_2: [
    c("Negative numbers", "Handle sign separately or bias the digits."),
    c("Varying digit counts", "Pad shorter numbers with leading zeros."),
    c("Stable per digit", "LSD radix relies on a stable counting pass."),
  ],
  java_m38_t2_ex_3: [
    c("Uneven distribution", "Worst case O(n²) if all land in one bucket."),
    c("Empty buckets", "Skipped when concatenating."),
    c("Value range", "Bucket index from value range; guard divide-by-zero."),
  ],
  java_m38_t3_ex_1: [
    c("Single interval", "Returned unchanged."),
    c("Fully nested intervals", "Outer absorbs inner."),
    c("Touching intervals", "Merge if [1,2],[2,3] count as overlapping."),
  ],
  java_m38_t3_ex_2: [
    c("All overlap", "Rooms = meeting count."),
    c("No overlaps", "1 room."),
    c("End == next start", "Decide boundary reuse policy."),
  ],
  java_m38_t3_ex_3: [
    c("All zeros", "Result is \"0\", not \"000\"."),
    c("Single number", "Return it as a string."),
    c("Comparator", "Order by (a+b) vs (b+a) string concatenation."),
  ],
  java_m38_t3_ex_4: [
    c("Values not in arr2", "Append them in ascending order."),
    c("Duplicates", "Counting preserves multiplicities."),
    c("arr2 empty", "Just sort arr1 ascending."),
  ],
  java_m38_t3_ex_5: [
    c("All even or all odd", "One group is empty; still valid."),
    c("Stability", "Within each parity, ascending order."),
    c("Empty array", "Return empty."),
  ],
  java_m38_t4_ex_1: [
    c("Use boxed type", "Comparators need Integer[], not int[]."),
    c("Duplicates", "Equal values keep relative order (stable)."),
    c("Empty array", "No-op."),
  ],
  java_m38_t4_ex_2: [
    c("Equal lengths", "Tie-break alphabetically."),
    c("Equal strings", "Order is stable."),
    c("Empty input", "No-op."),
  ],
  java_m38_t4_ex_3: [
    c("Equal keys", "Original order preserved (TimSort is stable)."),
    c("Primitive arrays", "Arrays.sort(int[]) is NOT guaranteed stable — use objects."),
    c("Single element", "Trivially stable."),
  ],
  java_m38_t4_ex_4: [
    c("Column out of range", "Guard the chosen index."),
    c("Equal key rows", "Stable order keeps original row sequence."),
    c("Empty matrix", "No-op."),
  ],
  java_m38_t4_ex_5: [
    c("Mixed directions", "comparing(key1).thenComparing(key2, reverseOrder())."),
    c("All keys equal", "Order is stable."),
    c("Null fields", "Use nullsFirst/nullsLast to avoid NPE."),
  ],
  java_m38_t5_ex_4: [
    c("Nearly sorted", "Insertion sort hits its O(n) best case."),
    c("Reverse sorted", "Insertion sort degrades to O(n²)."),
    c("TimSort link", "Java's sort exploits existing runs similarly."),
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
  console.log(`✅ edge-cases-9: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
