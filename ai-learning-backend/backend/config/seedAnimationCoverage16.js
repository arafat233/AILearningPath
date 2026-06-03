/**
 * seedAnimationCoverage16.js — GAP #1 animation, BIG batch 16 (~42).
 * Bespoke per-problem; reuses existing renderers (array-pointers, stack, tree).
 * Data-only. Idempotent. Verify: auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const n = (id, v, x, y) => ({ id, v, x, y });
const cls = (...p) => Object.fromEntries(p);

const A = {
  // intervals (completes pattern) — array-pointers, interval cells
  java_m41_5_t2_ex_1: { kind: "array-pointers", label: "Insert Interval (#57)", array: ["1-3", "6-9"], steps: [
    { pointers: { ins: 0 }, note: "Insert [2,5]: copy intervals ending before it, then merge overlaps." },
    { array: ["1-5", "6-9"], mark: { 0: "match" }, note: "[1,3]∪[2,5]=[1,5]; [6,9] is after.", result: "[1-5, 6-9]" } ] },
  java_m41_5_t2_ex_2: { kind: "array-pointers", label: "Non-overlapping Intervals (#435)", array: ["1-2", "2-3", "3-4", "1-3"], steps: [
    { pointers: { i: 3 }, note: "Sort by END; greedily keep the earliest-finishing, drop overlaps." },
    { mark: { 3: "dropped" }, note: "Removals = total − kept.", result: "remove 1" } ] },
  java_m41_5_t2_ex_3: { kind: "array-pointers", label: "Min Arrows to Burst Balloons (#452)", array: ["1-6", "2-8", "7-12", "10-16"], steps: [
    { pointers: { i: 1 }, note: "Sort by end; one arrow bursts all overlapping with the current end." },
    { mark: { 0: "match", 2: "match" }, note: "New arrow when an interval starts after the last arrow.", result: "2 arrows" } ] },
  java_m41_5_t2_ex_5: { kind: "array-pointers", label: "Meeting Rooms II (#253)", array: ["0-30", "5-10", "15-20"], steps: [
    { pointers: { i: 1 }, note: "Sort by start; min-heap of end times. Reuse a room if its end ≤ next start." },
    { mark: { 0: "match", 1: "match" }, note: "Peak heap size = rooms needed.", result: "2 rooms" } ] },
  // greedy (completes pattern)
  java_m41_5_t1_ex_1: { kind: "array-pointers", label: "Gas Station (#134)", array: [1, 2, 3, 4, 5], steps: [
    { pointers: { i: 0 }, note: "If total gas ≥ total cost, a solution exists. Track running tank." },
    { pointers: { start: 3 }, mark: { 3: "match" }, note: "When tank < 0, no station in [start..i] works → start = i+1.", result: "start = 3" } ] },
  java_m41_5_t1_ex_2: { kind: "array-pointers", label: "Candy (#135)", array: [1, 0, 2], steps: [
    { pointers: { i: 1 }, note: "Pass L→R: if rating>left, candy=left+1." },
    { pointers: { i: 1 }, note: "Pass R→L: max with right+1. Sum both passes.", result: "5 candies" } ] },

  // monotonic-stack
  java_m33_t2_ex_2: { kind: "stack", label: "Next Greater Element II (#503, circular)", array: [1, 2, 1], outLabel: "answer", steps: [
    { cursor: 1, stack: [{ v: 1, i: 0 }], output: [-1, -1, -1], note: "Decreasing stack of indices; iterate 2× for the circular wrap." },
    { cursor: 2, stack: [{ v: 2, i: 1 }], output: [2, -1, 2], note: "Pop while current > top → that's its next-greater.", result: "[2,-1,2]" } ] },
  java_m33_t2_ex_4: { kind: "stack", label: "Trapping Rain Water (#42, stack)", array: [0, 1, 0, 2, 1, 0, 1, 3], steps: [
    { cursor: 3, stack: [{ v: 1, i: 1 }], note: "When a taller bar arrives, pop and add water bounded by min(left,right)−floor." },
    { cursor: 7, stack: [], output: [6], note: "Sum trapped water across all pops.", result: "6" } ] },
  java_m33_t2_ex_7: { kind: "stack", label: "Sum of Subarray Minimums (#907)", array: [3, 1, 2, 4], steps: [
    { cursor: 1, stack: [{ v: 1, i: 1 }], note: "For each element, count subarrays where it is the min (prev-smaller / next-smaller spans)." },
    { cursor: 3, stack: [{ v: 1, i: 1 }, { v: 2, i: 2 }, { v: 4, i: 3 }], note: "contribution = a[i] × left × right.", result: "Σ contributions" } ] },
  java_m33_t2_ex_8: { kind: "stack", label: "Maximal Rectangle (#85)", array: [2, 1, 5, 6, 2, 3], steps: [
    { cursor: 3, stack: [{ v: 1, i: 1 }, { v: 5, i: 2 }, { v: 6, i: 3 }], note: "Reduce each row to a histogram; largest-rectangle-in-histogram per row." },
    { cursor: 4, stack: [{ v: 1, i: 1 }], output: [10], note: "Pop taller bars to measure widths.", result: "max area" } ] },
  java_m33_t2_ex_10: { kind: "stack", label: "Remove Duplicate Letters (#316)", array: ["b", "c", "a", "b", "c"], outLabel: "result", steps: [
    { cursor: 2, stack: ["a"], note: "Keep a monotonic-increasing stack; pop a larger char if it appears again later." },
    { cursor: 4, stack: ["a", "b", "c"], output: ["a", "b", "c"], note: "Each letter used once, smallest lexicographic order.", result: "\"abc\"" } ] },

  // two-pointers
  java_m30_t1_ex_11: { kind: "array-pointers", label: "Two Sum (#1, indices)", array: [2, 7, 11, 15], meta: { target: 9 }, steps: [
    { pointers: { i: 0 }, note: "Hash complements as you scan.", caption: "need 7" },
    { pointers: { i: 1 }, mark: { 0: "match", 1: "match" }, note: "7's complement 2 already seen.", result: "[0,1]" } ] },
  java_m30_t1_ex_13: { kind: "array-pointers", label: "Four Sum (#18)", array: [-2, -1, 0, 0, 1, 2], steps: [
    { pointers: { i: 0, j: 1, L: 2, R: 5 }, note: "Sort; fix two indices, two-pointer the rest. Skip duplicates." },
    { pointers: { i: 0, j: 1, L: 3, R: 4 }, mark: { 0: "match", 1: "match", 3: "match", 4: "match" }, note: "O(n³).", result: "quadruplets summing to target" } ] },
  java_m30_t1_ex_14: { kind: "array-pointers", label: "Min Window Substring setup (#76)", array: ["A", "D", "B", "E", "C"], steps: [
    { pointers: { L: 0, R: 4 }, window: [0, 4], note: "Expand R until window has all needed chars (have == need)." },
    { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Shrink L while valid → minimal window.", result: "minimal covering window" } ] },
  java_m30_t4_ex_5: { kind: "array-pointers", label: "Partition Around Pivot", array: [3, 7, 8, 5, 2, 1, 9, 5, 4], steps: [
    { pointers: { i: 0, j: 0, pivot: 8 }, note: "Lomuto: j scans; swap a[j]<pivot into the front region (i)." },
    { array: [3, 5, 2, 1, 4, 5, 9, 8, 7], pointers: { i: 5 }, note: "Everything before i < pivot.", result: "partitioned" } ] },
  java_m30_t4_ex_6: { kind: "array-pointers", label: "Sort Order Statuses (DNF)", array: [2, 0, 1, 2, 1, 0], steps: [
    { pointers: { low: 0, mid: 0, high: 5 }, note: "3-way partition: 0s | 1s | unknown | 2s." },
    { array: [0, 0, 1, 1, 2, 2], note: "One pass, O(1) space.", result: "grouped" } ] },

  // prefix-sum
  java_m30_t3_ex_3: { kind: "array-pointers", label: "Range Sum Query (#303)", array: [-2, 0, 3, -5, 2, -1], steps: [
    { pointers: { i: 5 }, note: "Precompute prefix[i]=sum of first i. Query(l,r)=prefix[r+1]−prefix[l]." },
    { pointers: { L: 0, R: 2 }, mark: { 0: "match", 1: "match", 2: "match" }, note: "O(1) per query after O(n) build.", result: "sum(0,2)=1" } ] },
  java_m30_t3_ex_4: { kind: "array-pointers", label: "Subarray Sum = K (#560)", array: [1, 1, 1], meta: { k: 2 }, steps: [
    { pointers: { i: 1 }, note: "prefix + map of counts; add count of (sum−k) seen so far." },
    { pointers: { i: 2 }, note: "Each match = a subarray summing to k.", result: "2" } ] },
  java_m30_t3_ex_5: { kind: "array-pointers", label: "Product Except Self (#238)", array: [1, 2, 3, 4], steps: [
    { pointers: { i: 0 }, note: "Prefix products L→R, then suffix products R→L, multiplied. No division." },
    { array: [24, 12, 8, 6], note: "ans[i] = (product of all left) × (all right).", result: "[24,12,8,6]" } ] },
  java_m30_t3_ex_7: { kind: "array-pointers", label: "Continuous Subarray Sum (#523)", array: [23, 2, 4, 6, 7], meta: { k: 6 }, steps: [
    { pointers: { i: 2 }, note: "Store first index of each prefix-sum MOD k." },
    { pointers: { i: 2 }, mark: { 1: "match", 2: "match" }, note: "Same remainder ≥2 apart → subarray sum divisible by k.", result: "true" } ] },
  java_m30_t3_ex_8: { kind: "grid", label: "2D Prefix Sums (#304)", grid: [[3, 0, 1], [5, 6, 3], [1, 2, 0]], steps: [
    { cursor: [1, 1], note: "P[r][c] = grid + P[r-1][c] + P[r][c-1] − P[r-1][c-1]." },
    { cls: cls(["1,1", "path"]), note: "Region sum via 4 lookups → O(1) per query.", result: "rectangle sums in O(1)" } ] },

  // bit-manipulation (array-pointers, bit cells)
  java_m47_t2_ex_1: { kind: "array-pointers", label: "getBit(n, i)", array: [1, 0, 1, 1], steps: [
    { pointers: { i: 1 }, note: "(n >> i) & 1 isolates bit i.", caption: "bit 1 = 0" },
    { pointers: { i: 0 }, mark: { 0: "match" }, note: "Shift the wanted bit to position 0, mask with 1.", result: "0 or 1" } ] },
  java_m47_t2_ex_2: { kind: "array-pointers", label: "setBit(n, i)", array: [1, 0, 0, 1], steps: [
    { pointers: { i: 1 }, note: "n | (1 << i) forces bit i to 1." },
    { array: [1, 1, 0, 1], mark: { 1: "match" }, note: "OR with a single-bit mask.", result: "bit set" } ] },
  java_m47_t3_ex_1: { kind: "array-pointers", label: "isPowerOfTwo", array: [1, 0, 0, 0], steps: [
    { array: [1, 0, 0, 0], note: "Power of two = exactly one set bit." },
    { array: [0, 0, 0, 0], note: "n & (n−1) == 0 (and n>0).", result: "true" } ] },
  java_m47_t4_ex_2: { kind: "array-pointers", label: "Missing Number (XOR)", array: [3, 0, 1], steps: [
    { pointers: { i: 2 }, note: "XOR all indices 0..n and all values; pairs cancel." },
    { mark: { 0: "match" }, note: "What's left is the missing number.", result: "2" } ] },
  java_m47_t5_ex_1: { kind: "array-pointers", label: "XOR Swap", array: ["a", "b"], steps: [
    { pointers: { i: 0, j: 1 }, note: "a^=b; b^=a; a^=b — swap without a temp variable." },
    { array: ["b", "a"], note: "XOR is its own inverse.", result: "swapped" } ] },
  java_m47_t5_ex_2: { kind: "array-pointers", label: "Bit Masks & Flags", array: [1, 1, 0, 1], steps: [
    { pointers: { i: 2 }, note: "Combine options with OR; test with AND; toggle with XOR." },
    { note: "One int packs up to 32 booleans.", result: "compact flag set" } ] },

  // graph-traversal (tree-renderer graphs)
  java_m37_t1_ex_2: { kind: "tree", label: "Build Adjacency List", W: 340, H: 150, nodes: [n(0, "0", 70, 60), n(1, "1", 200, 40), n(2, "2", 200, 120), n(3, "3", 310, 80)], edges: [[0, 1], [0, 2], [1, 3]], steps: [
    { cls: cls(["0", "current"]), note: "List<List<Integer>>: for edge (u,v) add v to adj[u] (and u to adj[v] if undirected)." },
    { cls: cls(["0", "visited"]), note: "O(V+E) space; neighbors in O(1).", result: "adj built" } ] },
  java_m37_t1_ex_3: { kind: "tree", label: "BFS Traversal Order", W: 340, H: 150, nodes: [n(0, "0", 70, 60), n(1, "1", 200, 40), n(2, "2", 200, 120), n(3, "3", 310, 80)], edges: [[0, 1], [0, 2], [1, 3]], outLabel: "order", steps: [
    { cls: cls(["0", "current"]), output: [0], note: "Queue + visited set; dequeue, enqueue unvisited neighbors." },
    { cls: cls(["0", "visited"], ["1", "visited"], ["2", "visited"], ["3", "match"]), output: [0, 1, 2, 3], note: "Level by level.", result: "0 1 2 3" } ] },
  java_m37_t1_ex_4: { kind: "tree", label: "DFS Recursive Order", W: 340, H: 150, nodes: [n(0, "0", 70, 60), n(1, "1", 200, 40), n(2, "2", 200, 120), n(3, "3", 310, 80)], edges: [[0, 1], [0, 2], [1, 3]], outLabel: "order", steps: [
    { cls: cls(["0", "current"]), output: [0], note: "Recurse into a neighbor fully before the next; mark visited." },
    { cls: cls(["0", "visited"], ["1", "visited"], ["3", "match"], ["2", "visited"]), output: [0, 1, 3, 2], note: "Go deep, then backtrack.", result: "0 1 3 2" } ] },
  java_m37_t1_ex_6: { kind: "tree", label: "Connected Components", W: 340, H: 150, nodes: [n(0, "0", 70, 50), n(1, "1", 70, 110), n(2, "2", 270, 50), n(3, "3", 270, 110)], edges: [[0, 1], [2, 3]], steps: [
    { cls: cls(["0", "current"], ["1", "current"]), note: "DFS/BFS from each unvisited node; each launch = one component." },
    { cls: cls(["0", "visited"], ["1", "visited"], ["2", "match"], ["3", "match"]), note: "Count the launches.", result: "2 components" } ] },

  // strings
  java_m31_t1_ex_5: { kind: "array-pointers", label: "Valid Anagram (#242)", array: ["a", "n", "a", "g", "r", "a", "m"], steps: [
    { pointers: { i: 6 }, note: "int[26]: ++ for s, −− for t; all zero ⇒ anagram." },
    { mark: { 0: "match", 2: "match", 5: "match" }, note: "O(n), O(1) space.", result: "true" } ] },
  java_m31_t1_ex_7: { kind: "array-pointers", label: "String to Integer / atoi (#8)", array: [" ", "-", "4", "2"], steps: [
    { pointers: { i: 1 }, note: "Skip spaces, read optional sign, accumulate digits, clamp to int range." },
    { pointers: { i: 3 }, note: "result = result*10 + digit, with overflow guard.", result: "-42" } ] },
  java_m31_t1_ex_8: { kind: "array-pointers", label: "Count and Say (#38)", array: ["1", "1"], steps: [
    { pointers: { i: 1 }, note: "Read the previous term as runs: \"11\" → one 1, one 1." },
    { array: ["2", "1"], note: "Describe counts → next term.", result: "\"21\"" } ] },
  java_m31_t1_ex_11: { kind: "stack", label: "Decode String (#394)", array: ["3", "[", "a", "]"], outLabel: "out", steps: [
    { cursor: 1, stack: [3, "["], note: "Push count + '['; on ']' pop and repeat the built string." },
    { cursor: 3, stack: [], output: ["a", "a", "a"], note: "Nested brackets handled by the stack.", result: "\"aaa\"" } ] },

  // binary-search
  java_m39_t1_ex_5: { kind: "array-pointers", label: "Integer Square Root (#69)", array: [0, 1, 2, 3, 4, 5, 6, 7, 8], steps: [
    { pointers: { lo: 0, mid: 4, hi: 8 }, note: "Search x where x² ≤ n < (x+1)². n=8: 4²=16>8 → go left." },
    { pointers: { lo: 0, mid: 2, hi: 3 }, mark: { 2: "match" }, note: "2²=4≤8, 3²=9>8.", result: "2" } ] },
  java_m39_t3_ex_4: { kind: "array-pointers", label: "Search Rotated II — dups (#81)", array: [2, 5, 6, 0, 0, 1, 2], steps: [
    { pointers: { lo: 0, mid: 3, hi: 6 }, note: "Like #33, but a[lo]==a[mid]==a[hi] is ambiguous → shrink both ends by 1." },
    { pointers: { lo: 4, mid: 5, hi: 6 }, mark: { 5: "match" }, note: "Worst case O(n) with many duplicates.", result: "found" } ] },
  java_m39_t3_ex_5: { kind: "array-pointers", label: "Find Peak Element (#162)", array: [1, 2, 1, 3, 5, 6, 4], steps: [
    { pointers: { lo: 0, mid: 3, hi: 6 }, note: "If a[mid] < a[mid+1], a peak lies to the right; else to the left." },
    { pointers: { lo: 4, mid: 5, hi: 6 }, mark: { 5: "match" }, note: "Always move toward the higher neighbor. O(log n).", result: "index 5" } ] },

  // palindrome
  java_m31_t3_ex_5: { kind: "array-pointers", label: "Valid Palindrome II (#680)", array: ["a", "b", "c", "a"], steps: [
    { pointers: { L: 0, R: 3 }, mark: { 0: "match", 3: "match" }, note: "Converge; on a mismatch, try skipping EITHER side once." },
    { pointers: { L: 1, R: 2 }, note: "Skip 'b' or 'c' → remaining is a palindrome.", result: "true (≤1 delete)" } ] },
  java_m31_t3_ex_6: { kind: "array-pointers", label: "Count Palindromic Substrings (#647)", array: ["a", "a", "a"], steps: [
    { pointers: { c: 1 }, window: [0, 2], note: "Expand around each of 2n−1 centers; count every palindrome found." },
    { note: "\"a\",\"a\",\"a\",\"aa\",\"aa\",\"aaa\".", result: "6" } ] },
  java_m31_t3_ex_7: { kind: "array-pointers", label: "Palindrome Partitioning (#131)", array: ["a", "a", "b"], steps: [
    { pointers: { i: 0 }, note: "Backtrack: cut at each index where the prefix is a palindrome, recurse on the rest." },
    { mark: { 0: "match", 1: "match", 2: "match" }, note: "Collect all valid partitions.", result: "[[a,a,b],[aa,b]]" } ] },
  java_m31_t3_ex_9: { kind: "array-pointers", label: "Longest Palindromic Subseq (#516)", array: ["b", "b", "b", "a", "b"], steps: [
    { pointers: { L: 0, R: 4 }, note: "Interval DP: s[i]==s[j] → 2+inner; else max(drop an end)." },
    { mark: { 0: "match", 1: "match", 2: "match", 4: "match" }, note: "\"bbbb\".", result: "4" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-16: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
