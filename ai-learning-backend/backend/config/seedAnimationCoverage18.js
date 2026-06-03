/**
 * seedAnimationCoverage18.js — GAP #1 animation, BIG batch 18 (~40).
 * Completes recursion / prefix-sum / palindrome / bit / sliding-window /
 * union-find / strings. Existing renderers, data-only. Verify: auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const n = (id, v, x, y) => ({ id, v, x, y });
const cls = (...p) => Object.fromEntries(p);
const W = 380;
function btree(arr) { const nodes = [], edges = []; let mL = 0; arr.forEach((vv, i) => { if (vv == null) return; const L = Math.floor(Math.log2(i + 1)); mL = Math.max(mL, L); const il = i - (2 ** L - 1), c = 2 ** L; nodes.push({ id: i, v: vv, x: Math.round(W * (il + 0.5) / c), y: 24 + L * 46 }); const p = Math.floor((i - 1) / 2); if (i > 0 && arr[p] != null) edges.push([p, i]); }); return { nodes, edges, W, H: 24 + mL * 46 + 22 }; }
const SUB = ["{}", "{1}", "{}", "{1,2}", "{1}", "{2}", "{}"];

const A = {
  // recursion (completes) — decision/D&C trees
  java_m48_t1_ex_3: { kind: "tree", label: "Subsets via Backtracking", ...btree(SUB), steps: [
    { cls: cls(["0", "current"]), note: "choose → recurse → un-choose at each element." },
    { cls: cls(["3", "match"], ["4", "match"], ["5", "match"], ["6", "match"]), note: "2ⁿ leaves = all subsets.", result: "[{1,2},{1},{2},{}]" } ] },
  java_m48_t2_ex_2: { kind: "tree", label: "Count Subsets with Target Sum", ...btree(SUB), steps: [
    { cls: cls(["0", "current"]), note: "Include/exclude each item; count paths whose sum == target." },
    { cls: cls(["3", "match"]), note: "Base case: target reached at a leaf.", result: "count" } ] },
  java_m48_t2_ex_3: { kind: "tree", label: "Power Set (bit / recursion)", ...btree(SUB), steps: [
    { cls: cls(["0", "current"]), note: "Either iterate masks 0..2ⁿ−1, or recurse include/exclude." },
    { cls: cls(["3", "match"], ["4", "match"], ["5", "match"], ["6", "match"]), note: "Same 2ⁿ result.", result: "power set" } ] },
  java_m48_t3_ex_1: { kind: "tree", label: "Permutations of [1,2,3]", W, H: 160, nodes: [n(0, "[ ]", 190, 26), n(1, "[1]", 70, 84), n(2, "[2]", 190, 84), n(3, "[3]", 310, 84), n(4, "[1,2]", 40, 140), n(5, "[1,3]", 110, 140)], edges: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]], steps: [
    { cls: cls(["0", "current"]), note: "Pick any UNUSED element for each slot (used[] flags)." },
    { cls: cls(["4", "match"], ["5", "match"]), note: "n! leaves.", result: "6 permutations" } ] },
  java_m48_t3_ex_3: { kind: "tree", label: "Combinations C(n,k)", W, H: 160, nodes: [n(0, "[ ]", 190, 26), n(1, "[1]", 90, 84), n(2, "[2]", 250, 84), n(3, "[1,2]", 60, 140), n(4, "[1,3]", 140, 140)], edges: [[0, 1], [0, 2], [1, 3], [1, 4]], steps: [
    { cls: cls(["0", "current"]), note: "Advance a START index so combos don't repeat (order irrelevant)." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "C(n,k) leaves.", result: "k-combinations" } ] },
  java_m48_t4_ex_1: { kind: "tree", label: "Merge Sort (divide & conquer)", W, H: 160, nodes: [n(0, "[5,2,8,1]", 190, 30), n(1, "[5,2]", 90, 90), n(2, "[8,1]", 290, 90), n(3, "[1,2,5,8]", 190, 140)], edges: [[0, 1], [0, 2], [1, 3], [2, 3]], steps: [
    { cls: cls(["0", "current"]), note: "Split in half, sort each recursively." },
    { cls: cls(["3", "match"]), note: "Merge sorted halves. T(n)=2T(n/2)+n = O(n log n).", result: "sorted" } ] },
  java_m48_t5_ex_1: { kind: "tree", label: "N-Queens count (n=4)", W, H: 150, nodes: [n(0, "row0", 190, 30), n(1, "c1", 90, 90), n(2, "c3", 290, 90), n(3, "✓", 90, 140)], edges: [[0, 1], [0, 2], [1, 3]], steps: [
    { cls: cls(["0", "current"]), note: "Place one queen per row; prune columns/diagonals already attacked." },
    { cls: cls(["3", "match"]), note: "Count complete placements. n=4 → 2 solutions.", result: "2" } ] },
  java_m48_t5_ex_2: { kind: "tree", label: "Pruning & Early Termination", W, H: 150, nodes: [n(0, "root", 190, 30), n(1, "ok", 110, 90), n(2, "invalid", 290, 90), n(3, "✓", 110, 140)], edges: [[0, 1], [0, 2], [1, 3]], steps: [
    { cls: cls(["2", "dropped"]), note: "Cut a branch the moment a partial solution violates a constraint or can't beat the best." },
    { cls: cls(["3", "match"]), note: "Skips whole subtrees → tractable backtracking.", result: "pruned" } ] },

  // prefix-sum (completes)
  java_m30_t3_ex_9: { kind: "array-pointers", label: "Kadane via prefix", array: [-2, 1, -3, 4, -1, 2, 1], steps: [
    { pointers: { i: 3 }, note: "maxSub = prefix[j] − min(prefix[0..j−1]); track the running min prefix." },
    { pointers: { i: 6 }, mark: { 3: "match", 4: "match", 5: "match", 6: "match" }, note: "Equivalent to Kadane.", result: "6" } ] },
  java_m30_t3_ex_11: { kind: "array-pointers", label: "Longest Well-Performing Interval (#1124)", array: [9, 9, 6, 0, 6, 6, 9], steps: [
    { pointers: { i: 3 }, note: "+1 if >8 hrs else −1; find longest subarray with sum > 0 via prefix + first-seen map." },
    { pointers: { i: 6 }, note: "If prefix>0 → whole; else look for prefix−1 earliest.", result: "longest tiring streak" } ] },
  java_m30_t3_ex_12: { kind: "array-pointers", label: "Binary Subarrays With Sum (#930)", array: [1, 0, 1, 0, 1], meta: { goal: 2 }, steps: [
    { pointers: { i: 2 }, note: "Prefix sum + count map; add count of (sum − goal) seen." },
    { pointers: { i: 4 }, note: "Each match = a subarray summing to goal.", result: "count" } ] },
  java_m30_t3_ex_13: { kind: "array-pointers", label: "Min Ops to Make Sum Zero", array: [3, -1, -2, 4], steps: [
    { pointers: { i: 3 }, note: "Prefix sums; pair equal prefixes / target to find subarrays to adjust." },
    { pointers: {}, note: "Hash earliest prefix occurrences.", result: "min ops" } ] },
  java_m30_t3_ex_14: { kind: "array-pointers", label: "K Radius Subarray Averages (#2090)", array: [7, 4, 3, 9, 1, 8, 5, 2, 6], meta: { k: 3 }, steps: [
    { pointers: { L: 0, R: 6 }, window: [0, 6], note: "Window of size 2k+1; average = window sum / (2k+1)." },
    { pointers: { L: 1, R: 7 }, window: [1, 7], note: "Slide; edges (< k from a side) = −1.", result: "per-index averages" } ] },
  java_m30_t3_ex_15: { kind: "array-pointers", label: "Prefix-Sum Synthesis", array: [3, 1, 4, 1, 5], steps: [
    { pointers: { i: 4 }, note: "Range sums O(1); 'sum==k' / 'divisible by k' via a prefix HashMap." },
    { pointers: {}, note: "2D prefix for submatrix sums.", result: "the toolkit" } ] },

  // palindrome (completes)
  java_m31_t3_ex_8: { kind: "array-pointers", label: "Palindrome Partitioning II (#132)", array: ["a", "a", "b", "b"], steps: [
    { pointers: { i: 2 }, note: "dp[i] = min cuts for s[0..i]; dp[i]=0 if s[0..i] is a palindrome." },
    { pointers: { i: 3 }, note: "Else dp[i]=min(dp[j]+1) over palindromic s[j+1..i].", result: "min cuts" } ] },
  java_m31_t3_ex_11: { kind: "array-pointers", label: "Expand Around Center", array: ["b", "a", "b", "a"], steps: [
    { pointers: { c: 1 }, window: [0, 2], note: "2n−1 centers (chars + gaps); expand while s[L]==s[R]." },
    { pointers: { L: 0, R: 2 }, mark: { 0: "match", 1: "match", 2: "match" }, note: "O(n²), O(1) space.", result: "\"bab\"" } ] },
  java_m31_t3_ex_12: { kind: "array-pointers", label: "Palindrome Pairs (#336)", array: ["abcd", "dcba", "lls", "s"], steps: [
    { pointers: { i: 0 }, note: "For each word, split into prefix+suffix; check map for the reversed complement." },
    { mark: { 0: "match", 1: "match" }, note: "\"abcd\"+\"dcba\" is a palindrome.", result: "pair indices" } ] },
  java_m31_t3_ex_13: { kind: "array-pointers", label: "Longest Palindrome (build)", array: ["a", "b", "c", "c", "c", "c", "d", "d"], steps: [
    { pointers: { i: 7 }, note: "Count letters; use all even counts + one odd (the center)." },
    { note: "len = Σ(even parts) + (any odd ? 1 : 0).", result: "max length" } ] },
  java_m31_t3_ex_14: { kind: "array-pointers", label: "Valid Palindrome (alnum)", array: ["A", "1", "a"], steps: [
    { pointers: { L: 0, R: 2 }, note: "Two pointers; skip non-alphanumerics, compare case-insensitively." },
    { mark: { 0: "match", 2: "match" }, note: "'A' == 'a'.", result: "true" } ] },
  java_m31_t3_ex_15: { kind: "array-pointers", label: "Palindrome Synthesis", array: ["r", "a", "c", "e", "c", "a", "r"], steps: [
    { pointers: { L: 0, R: 6 }, note: "Two pointers (check) · expand-center (longest) · interval DP (subsequence)." },
    { pointers: { L: 3, R: 3 }, mark: { 0: "match", 6: "match" }, note: "Pick by what's asked.", result: "toolkit" } ] },

  // bit-manipulation (completes)
  java_m47_t2_ex_4: { kind: "array-pointers", label: "Sum of Two Integers (#371)", array: [0, 1, 0, 1], steps: [
    { pointers: { i: 0 }, note: "sum = a ^ b (no carry); carry = (a & b) << 1; loop until carry 0." },
    { array: [1, 1, 0, 0], note: "Add without '+'.", result: "a + b" } ] },
  java_m47_t2_ex_5: { kind: "array-pointers", label: "Find the Difference (#389)", array: ["a", "b", "c", "a", "b", "c", "d"], steps: [
    { pointers: { i: 6 }, note: "XOR all chars of both strings; pairs cancel." },
    { mark: { 6: "match" }, note: "The extra char remains.", result: "'d'" } ] },
  java_m47_t3_ex_4: { kind: "array-pointers", label: "Number of 1 Bits (#191)", array: [1, 1, 0, 1], steps: [
    { array: [1, 1, 0, 0], note: "n &= (n−1) clears the lowest set bit; count iterations." },
    { array: [1, 0, 0, 0], note: "Loops = popcount.", result: "3" } ] },
  java_m47_t3_ex_6: { kind: "array-pointers", label: "Power of Two (#231)", array: [1, 0, 0, 0], steps: [
    { array: [1, 0, 0, 0], note: "Exactly one set bit." },
    { array: [0, 0, 0, 0], note: "n>0 && (n & (n−1))==0.", result: "true" } ] },
  java_m47_t3_ex_7: { kind: "array-pointers", label: "Counting Bits (#338)", array: [0, 1, 1, 2, 1, 2], steps: [
    { pointers: { i: 4 }, note: "DP: bits[i] = bits[i >> 1] + (i & 1)." },
    { pointers: { i: 5 }, note: "Reuse the already-computed half.", result: "[0,1,1,2,1,2]" } ] },
  java_m47_t4_ex_3: { kind: "array-pointers", label: "Single Number II (#137)", array: [2, 2, 3, 2], steps: [
    { pointers: { i: 3 }, note: "Two-state mask (ones, twos): a bit resets after appearing 3×." },
    { mark: { 2: "match" }, note: "The non-tripled number survives.", result: "3" } ] },
  java_m47_t4_ex_4: { kind: "array-pointers", label: "Single Number III (#260)", array: [1, 2, 1, 3, 2, 5], steps: [
    { pointers: { i: 5 }, note: "XOR all → a^b. A differing bit splits the numbers into two groups." },
    { mark: { 3: "match", 5: "match" }, note: "XOR each group separately.", result: "[3, 5]" } ] },

  // sliding-window (completes)
  java_m30_t2_ex_9: { kind: "array-pointers", label: "Contains Duplicate II (#219)", array: [1, 2, 3, 1], meta: { k: 3 }, steps: [
    { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Sliding HashSet of the last k indices." },
    { mark: { 0: "match", 3: "match" }, note: "Duplicate within distance k → true.", result: "true" } ] },
  java_m30_t2_ex_11: { kind: "array-pointers", label: "Subarray Sum = K (#560, window+map)", array: [1, 2, 3], meta: { k: 3 }, steps: [
    { pointers: { i: 1 }, note: "Prefix sum + count map (handles negatives where a pure window can't)." },
    { pointers: { i: 2 }, note: "Add count of (sum−k).", result: "2" } ] },
  java_m30_t2_ex_13: { kind: "array-pointers", label: "Max Points (circular window)", array: [1, 2, 3, 4, 5], steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Treat array as circular (double it) and slide a fixed window." },
    { pointers: { L: 3, R: 0 }, note: "Window can wrap past the end.", result: "best wrap window" } ] },
  java_m30_t2_ex_15: { kind: "array-pointers", label: "Sliding-Window Synthesis", array: [2, 1, 5, 1, 3, 2], steps: [
    { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Fixed window (size k) vs variable (expand R, shrink L on a condition)." },
    { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Track a running aggregate + a count map.", result: "the template" } ] },

  // union-find (completes)
  java_m37_t5_ex_3: { kind: "tree", label: "Kruskal's MST", W: 360, H: 150, nodes: [n(0, "A", 70, 50), n(1, "B", 70, 120), n(2, "C", 270, 50), n(3, "D", 270, 120)], edges: [[0, 1], [2, 3], [1, 2]], steps: [
    { cls: cls(["0", "current"], ["1", "current"]), note: "Sort edges by weight; add an edge iff its ends aren't already connected (union-find)." },
    { cls: cls(["0", "match"], ["1", "match"], ["2", "match"], ["3", "match"]), note: "Skip cycle-forming edges. O(E log E).", result: "min spanning tree" } ] },
  java_m37_t5_ex_5: { kind: "tree", label: "Min Cost Connect Points (#1584)", W: 360, H: 150, nodes: [n(0, "P0", 70, 50), n(1, "P1", 70, 120), n(2, "P2", 270, 50), n(3, "P3", 270, 120)], edges: [[0, 1], [0, 2], [2, 3]], steps: [
    { cls: cls(["0", "current"]), note: "Complete graph with Manhattan-distance edges → MST (Kruskal/Prim)." },
    { cls: cls(["0", "match"], ["1", "match"], ["2", "match"], ["3", "match"]), note: "Connect all points at minimum total cost.", result: "min cost" } ] },

  // strings (completes)
  java_m31_t1_ex_3: { kind: "array-pointers", label: "String concat vs StringBuilder", array: ["+", "+", "+", "+"], steps: [
    { pointers: { i: 3 }, note: "String + in a loop = O(n²) (new object each time)." },
    { note: "StringBuilder appends into one growing buffer → O(n).", result: "use StringBuilder" } ] },
  java_m31_t1_ex_9: { kind: "array-pointers", label: "Count and Say (#38)", array: ["1", "1"], steps: [
    { pointers: { i: 1 }, note: "Read the previous term as runs: \"11\" = two 1s." },
    { array: ["2", "1"], note: "Describe → next term.", result: "\"21\"" } ] },
  java_m31_t1_ex_12: { kind: "array-pointers", label: "Zigzag Conversion (#6)", array: ["P", "A", "Y", "P", "A", "L"], meta: { rows: 3 }, steps: [
    { pointers: { i: 2 }, note: "Walk rows down then diagonally up; append each char to its row's buffer." },
    { note: "Concatenate rows top→bottom.", result: "row-major read" } ] },
  java_m31_t1_ex_13: { kind: "array-pointers", label: "String Compression (#443)", array: ["a", "a", "b", "b", "b", "c"], steps: [
    { pointers: { read: 4, write: 2 }, note: "Two pointers: count each run, write char + count in place." },
    { array: ["a", "2", "b", "3", "c"], note: "In-place, O(1) extra.", result: "a2b3c" } ] },
  java_m31_t1_ex_14: { kind: "stack", label: "Simplify Path (#71)", array: ["/a", "/./", "/b", "/../", "/c"], outLabel: "stack path", steps: [
    { cursor: 2, stack: ["a", "b"], note: "Split on '/'; push names, '.' is a no-op, '..' pops." },
    { cursor: 4, stack: ["a", "c"], note: "Join with '/'.", result: "\"/a/c\"" } ] },
  java_m31_t1_ex_15: { kind: "array-pointers", label: "String Synthesis", array: ["a", "b", "c"], steps: [
    { pointers: { L: 0, R: 2 }, note: "Two pointers, freq arrays (int[26]), StringBuilder, sliding windows." },
    { note: "The string-problem toolkit.", result: "patterns" } ] },
  java_m31_t1_ex_16: { kind: "array-pointers", label: "Encode and Decode Strings (#271)", array: ["4", "#", "c", "o", "d", "e"], steps: [
    { pointers: { i: 1 }, note: "Length-prefix each string: len + '#' + str." },
    { pointers: { i: 5 }, note: "Decode: read length, then exactly that many chars.", result: "lossless round-trip" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-18: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
