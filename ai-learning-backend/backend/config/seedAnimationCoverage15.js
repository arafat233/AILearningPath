/**
 * seedAnimationCoverage15.js — GAP #1 animation coverage, BIG batch 15 (~40).
 * Bespoke per-problem across tree-dfs / sorting / heap / DP / hashing / linked-list.
 * Reuses existing renderers. Data-only. Idempotent. Verify: auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";

const Wt = 380;
function tree(arr) {
  const nodes = [], edges = []; let mL = 0;
  arr.forEach((vv, i) => { if (vv == null) return; const L = Math.floor(Math.log2(i + 1)); mL = Math.max(mL, L); const il = i - (2 ** L - 1), c = 2 ** L; nodes.push({ id: i, v: vv, x: Math.round(Wt * (il + 0.5) / c), y: 26 + L * 50 }); const p = Math.floor((i - 1) / 2); if (i > 0 && arr[p] != null) edges.push([p, i]); });
  return { nodes, edges, W: Wt, H: 26 + mL * 50 + 24 };
}
const cls = (...p) => Object.fromEntries(p);
const T7 = [1, 2, 3, 4, 5, 6, 7];

const A = {
  // ===== tree-dfs =====
  java_m35_t2_ex_2: { kind: "tree", label: "Balanced Binary Tree (#110)", ...tree([1, 2, 3, 4, 5, null, 6]), steps: [
    { cls: cls(["3", "current"], ["4", "current"]), note: "Post-order: get each subtree's height; bubble up." },
    { cls: cls(["1", "match"]), note: "If any node's |leftH − rightH| > 1, return −1 early → O(n).", result: "balanced" } ] },
  java_m35_t2_ex_4: { kind: "tree", label: "Max Path Sum (#124)", ...tree([1, 2, 3, 4, 5, 6, 7]), steps: [
    { cls: cls(["1", "current"]), note: "At each node: gain = node + max(0, leftGain) + max(0, rightGain)." },
    { cls: cls(["3", "match"], ["5", "match"], ["6", "match"]), note: "A path can 'turn' at one node; clip negative branches to 0.", result: "global max path" } ] },
  java_m35_t2_ex_8: { kind: "tree", label: "All Root-to-Leaf Paths (#257)", ...tree(T7), steps: [
    { cls: cls(["0", "path"], ["1", "path"], ["3", "match"]), note: "DFS, append each node to the current path; emit at a leaf." },
    { cls: cls(["0", "path"], ["2", "path"], ["6", "match"]), note: "Backtrack (pop) when returning.", result: "[1→2→4, …, 1→3→7]" } ] },
  java_m35_t2_ex_9: { kind: "tree", label: "LCA of BST (#235)", ...tree([6, 2, 8, 0, 4, 7, 9]), steps: [
    { cls: cls(["0", "current"], ["1", "match"], ["2", "match"]), note: "Both 2 and 8 split around 6 → 6 is the LCA (use BST ordering)." },
    { cls: cls(["0", "match"]), note: "If both < node go left; both > node go right; else this is it.", result: "LCA = 6" } ] },
  java_m35_t4_ex_2: { kind: "tree", label: "Path Sum II (#113)", ...tree([5, 4, 8, 11, null, 13, 4]), steps: [
    { cls: cls(["0", "path"], ["1", "path"], ["3", "match"]), note: "Track running sum + path; record path when leaf sum == target." },
    { cls: cls(["0", "path"], ["2", "path"]), note: "Backtrack the path list on the way back up.", result: "all matching paths" } ] },
  java_m35_t4_ex_1: { kind: "tree", label: "Path Sum (#112)", ...tree([5, 4, 8, 11, null, 13, 4]), steps: [
    { cls: cls(["0", "path"], ["1", "path"]), note: "Subtract node value from target as you descend." },
    { cls: cls(["3", "match"]), note: "At a leaf, check remaining == 0.", result: "true" } ] },
  java_m35_t2_ex_10: { kind: "tree", label: "Count Complete Tree Nodes", ...tree(T7), steps: [
    { cls: cls(["1", "current"]), note: "Measure left-most and right-most depths." },
    { cls: cls(["0", "match"]), note: "If equal → perfect subtree → 2^h−1 directly; else recurse. O(log²n).", result: "7" } ] },
  java_m35_t2_ex_7: { kind: "tree", label: "Serialize / Deserialize (#297)", ...tree([1, 2, 3, null, null, 4, 5]), steps: [
    { cls: cls(["0", "current"]), note: "Pre-order DFS, writing '#' for null children → a string." },
    { cls: cls(["0", "visited"], ["1", "visited"], ["2", "visited"]), note: "Deserialize by consuming tokens in the same order.", result: "\"1,2,#,#,3,4,5\"" } ] },

  // ===== sorting (array-pointers) =====
  java_m38_t2_ex_1: { kind: "array-pointers", label: "Counting Sort", array: [2, 5, 3, 0, 2, 3], steps: [
    { pointers: { i: 0 }, note: "Count occurrences of each value (values in [0,k])." , caption: "count[0..5]" },
    { array: [0, 2, 2, 3, 3, 5], mark: { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match", 5: "match" }, note: "Prefix-sum the counts → stable placement. O(n+k).", result: "[0,2,2,3,3,5]" } ] },
  java_m38_t2_ex_2: { kind: "array-pointers", label: "Radix Sort (LSD)", array: [170, 45, 75, 90, 2, 802], steps: [
    { array: [170, 90, 2, 802, 45, 75], note: "Pass 1 — stable sort by the ONES digit." },
    { array: [2, 45, 75, 90, 170, 802], note: "Repeat for each digit (LSD→MSD) using counting sort.", result: "sorted" } ] },
  java_m38_t2_ex_3: { kind: "array-pointers", label: "Bucket Sort", array: [29, 25, 3, 49, 9, 37], steps: [
    { pointers: { i: 0 }, note: "Scatter into buckets by range, sort each bucket, then concatenate." },
    { array: [3, 9, 25, 29, 37, 49], note: "O(n) average for uniformly-distributed keys.", result: "sorted" } ] },
  java_m38_t1_ex_3: { kind: "array-pointers", label: "Heap Sort", array: [4, 10, 3, 5, 1], steps: [
    { array: [10, 5, 3, 4, 1], note: "Build a max-heap (heapify) → largest at front." },
    { array: [1, 3, 4, 5, 10], note: "Swap root to the end, shrink, sift down; repeat. O(n log n), O(1) space.", result: "[1,3,4,5,10]" } ] },
  java_m38_t1_ex_4: { kind: "array-pointers", label: "3-Way Quick Sort (dups)", array: [2, 1, 2, 0, 2, 1], steps: [
    { pointers: { lt: 0, i: 0, gt: 5 }, note: "Partition into <pivot | =pivot | >pivot in one pass (Dutch flag)." },
    { array: [0, 1, 1, 2, 2, 2], note: "Equal-to-pivot region skipped in recursion → fast with many duplicates.", result: "sorted" } ] },
  java_m38_t3_ex_1: { kind: "array-pointers", label: "Merge Intervals (#56)", array: ["1-3", "2-6", "8-10", "15-18"], steps: [
    { pointers: { cur: 1 }, mark: { 0: "match", 1: "match" }, note: "Sort by start; merge when curr.start ≤ prev.end." },
    { pointers: { cur: 3 }, note: "8 > 6 → new interval.", result: "[1-6, 8-10, 15-18]" } ] },
  java_m38_t3_ex_3: { kind: "array-pointers", label: "Largest Number (#179)", array: [3, 30, 34, 5, 9], steps: [
    { pointers: { i: 0 }, note: "Custom comparator: order by (a+b) vs (b+a) as strings.", caption: "\"9\"+\"5\" > \"5\"+\"9\"" },
    { array: [9, 5, 34, 3, 30], note: "Concatenate in that order.", result: "\"9534330\"" } ] },
  java_m38_t3_ex_5: { kind: "array-pointers", label: "Sort Array By Parity", array: [3, 1, 2, 4], steps: [
    { pointers: { L: 0, R: 3 }, note: "Two pointers: evens to the left, odds to the right." },
    { array: [4, 2, 1, 3], note: "Swap odd-at-L with even-at-R.", result: "evens | odds" } ] },

  // ===== heap (tree) =====
  java_m36_t1_ex_7: { kind: "tree", label: "Median from Data Stream (#295)", ...tree([2, 1]), steps: [
    { ...tree([2, 1]), cls: cls(["0", "current"]), note: "Two heaps: max-heap of the lower half, min-heap of the upper half." },
    { ...tree([2, 1]), cls: cls(["0", "match"]), note: "Keep sizes balanced; median = a top (odd) or avg of both tops (even). O(log n) add.", result: "median in O(1)" } ] },
  java_m36_t2_ex_7: { kind: "tree", label: "Merge K Sorted Lists (#23)", ...tree([1, 2, 3]), steps: [
    { ...tree([1, 2, 3]), cls: cls(["0", "current"]), note: "Min-heap of the K list heads; pop the min, push its successor." },
    { ...tree([1, 2, 3]), cls: cls(["0", "match"]), note: "Each of N nodes does one O(log K) heap op → O(N log K).", result: "one sorted list" } ] },
  java_m36_t2_ex_3: { kind: "tree", label: "Reorganize String (#767)", ...tree([3, 2]), steps: [
    { ...tree([3, 2]), cls: cls(["0", "current"]), note: "Max-heap by frequency; always place the most frequent char not equal to last." },
    { ...tree([3, 2]), cls: cls(["0", "match"]), note: "Impossible iff maxFreq > (n+1)/2.", result: "no two adjacent equal" } ] },
  java_m36_t2_ex_5: { kind: "tree", label: "IPO (#502) — two heaps", ...tree([0, 1, 2]), steps: [
    { ...tree([0, 1, 2]), cls: cls(["0", "current"]), note: "Min-heap by capital unlocks projects; max-heap by profit picks the best affordable one." },
    { ...tree([0, 1, 2]), cls: cls(["0", "match"]), note: "Repeat k times, reinvesting profit as capital.", result: "max capital" } ] },
  java_m36_t2_ex_8: { kind: "tree", label: "Car Pooling (#1094)", ...tree([4, 6]), steps: [
    { ...tree([4, 6]), cls: cls(["0", "current"]), note: "Sort trips by start; min-heap of (dropoff, seats). Release seats whose dropoff ≤ now." },
    { ...tree([4, 6]), cls: cls(["0", "match"]), note: "If onboard ever exceeds capacity → false.", result: "fits capacity?" } ] },

  // ===== DP (grid) =====
  java_m41_t2_ex_2: { kind: "grid", label: "Coin Change (#322)", steps: [
    { grid: [[0, "∞", "∞", "∞", "∞", 1, "∞"]], cursor: [0, 2], note: "dp[a] = min coins for amount a; dp[a] = min(dp[a−coin]+1). coins {1,2,5}." },
    { grid: [[0, 1, 1, 2, 2, 1, 2]], cls: cls(["0,6", "path"]), note: "Build up; ∞ means unreachable.", result: "amount 11 → 3 coins" } ] },
  java_m41_t2_ex_3: { kind: "grid", label: "Longest Increasing Subsequence (#300)", steps: [
    { grid: [[10, 9, 2, 5, 3, 7, 101, 18]], cursor: [0, 5], note: "tails[] = smallest tail of an LIS of each length; binary-search the insert spot." },
    { grid: [[2, 3, 7, 18]], cls: cls(["0,3", "path"]), note: "Length of tails = LIS length. O(n log n).", result: "4" } ] },
  java_m41_t2_ex_4: { kind: "grid", label: "Jump Game (#55, DP/greedy)", steps: [
    { grid: [[2, 3, 1, 1, 4]], cursor: [0, 1], note: "Track the farthest reachable index." },
    { grid: [[2, 3, 1, 1, 4]], cls: cls(["0,4", "path"]), note: "reach ≥ last index → reachable.", result: "true" } ] },
  java_m41_t3_ex_1: { kind: "grid", label: "Unique Paths (#62)", grid: [[1, 1, 1], [1, 2, 3], [1, 3, 6]], steps: [
    { cursor: [1, 1], cls: cls(["0,1", "visited"], ["1,0", "visited"]), note: "dp[r][c] = dp[r-1][c] + dp[r][c-1]." },
    { cls: cls(["2,2", "path"]), note: "Bottom-right = path count.", result: "6" } ] },
  java_m31_t5_ex_8: { kind: "grid", label: "Distinct Subsequences (#115)", grid: [["·", "ε", "r", "a", "b", "b", "i", "t"], ["ε", 1, 1, 1, 1, 1, 1, 1], ["r", 0, 1, 1, 1, 1, 1, 1], ["a", 0, 0, 1, 1, 1, 1, 1]], steps: [
    { cursor: [3, 3], note: "dp[i][j] = ways to form s[..i] from t[..j]. Match → dp[i-1][j-1]+dp[i-1][j]; else dp[i-1][j]." },
    { cls: cls(["3,3", "path"]), note: "Count subsequence occurrences.", result: "ways to form \"rabbit\"" } ] },
  java_m31_t5_ex_11: { kind: "grid", label: "Wildcard Matching (#44)", grid: [["·", "ε", "a", "*", "b"], ["ε", 1, 0, 1, 0], ["a", 0, 1, 1, 0], ["b", 0, 0, 1, 1]], steps: [
    { cursor: [2, 2], note: "'*' matches empty (dp[i][j-1]) OR one-more char (dp[i-1][j]); '?'/equal → diagonal." },
    { cls: cls(["3,4", "path"]), note: "Bottom-right = full match.", result: "true" } ] },
  java_m31_t5_ex_7: { kind: "grid", label: "Min Insertions for Palindrome (#1312)", grid: [[0, 1, 1, 2, 2], [0, 0, 1, 1, 2], [0, 0, 0, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 0]], steps: [
    { cursor: [0, 4], note: "= n − LPS(s). Interval dp: s[i]==s[j] → dp[i+1][j-1]; else 1+min(drop an end)." },
    { cls: cls(["0,4", "path"]), note: "Insertions to make it a palindrome.", result: "answer at [0][n-1]" } ] },

  // ===== hashing (array-pointers) =====
  java_m34_t1_ex_7: { kind: "array-pointers", label: "Contiguous Array (#525)", array: [0, 1, 0, 1, 1, 0], steps: [
    { pointers: { i: 1 }, note: "Map 0→−1; track prefix sum; store first index of each sum." , caption: "sum 0 at idx 1" },
    { pointers: { i: 5 }, mark: { 0: "match", 1: "match" }, note: "Same prefix sum again → equal #0s and #1s between.", result: "longest balanced subarray" } ] },
  java_m34_t1_ex_9: { kind: "array-pointers", label: "Longest Consecutive (#128)", array: [100, 4, 200, 1, 3, 2], steps: [
    { pointers: { i: 3 }, note: "Put all in a set. Only START a count at n where n−1 is absent.", caption: "1 is a start" },
    { mark: { 1: "match", 3: "match", 4: "match", 5: "match" }, note: "Walk 1,2,3,4 → length 4. O(n) total.", result: "4" } ] },
  java_m34_t1_ex_10: { kind: "array-pointers", label: "4Sum Count II (#454)", array: ["A", "B", "C", "D"], steps: [
    { pointers: { i: 1 }, note: "Map all (a+b) sums from arrays A,B." },
    { pointers: { i: 3 }, note: "For each (c+d), add count of −(c+d) in the map. O(n²).", result: "tuple count" } ] },
  java_m34_t2_ex_1: { kind: "array-pointers", label: "Group Anagrams (#49)", array: ["eat", "tea", "tan", "ate"], steps: [
    { pointers: { i: 0 }, note: "Key = sorted letters (or 26-count signature).", caption: "eat→aet" },
    { mark: { 0: "match", 1: "match", 3: "match" }, note: "Bucket by key.", result: "[[eat,tea,ate],[tan]]" } ] },
  java_m34_t1_ex_6: { kind: "array-pointers", label: "First Non-Repeating", array: ["a", "a", "b", "c", "b", "d"], steps: [
    { pointers: { i: 5 }, note: "Count freq in pass 1.", caption: "{a:2,b:2,c:1,d:1}" },
    { pointers: { i: 3 }, mark: { 3: "match" }, note: "Pass 2: first char with count 1.", result: "'c'" } ] },

  // ===== linked-list =====
  java_m32_t3_ex_1: { kind: "linked-list", label: "Reverse Linked List (#206)", list: [1, 2, 3, 4], steps: [
    { pointers: { curr: 0 }, note: "prev = null. For each node: save next, point curr→prev, advance." },
    { list: [1, 2, 3, 4], links: ["←", "→", "→"], pointers: { prev: 0, curr: 1 }, note: "1.next = null; prev=1, curr=2." },
    { list: [1, 2, 3, 4], links: ["←", "←", "←"], pointers: { prev: 3 }, note: "Every link flipped; prev is the new head.", result: "4→3→2→1" } ] },
  java_m32_t3_ex_3: { kind: "linked-list", label: "Reverse — 3-pointer trace", list: [1, 2, 3], steps: [
    { pointers: { prev: 0, curr: 1, next: 2 }, links: ["←", "→"], note: "prev/curr/next march together; one link flips per step." },
    { list: [1, 2, 3], links: ["←", "←"], pointers: { prev: 2 }, note: "Return prev (the last node), NOT curr (which is null).", result: "3→2→1" } ] },
  java_m32_t2_ex_7: { kind: "linked-list", label: "Find Duplicate (#287, Floyd)", list: [1, 3, 4, 2, 2], links: ["→", "→", "→", "↺"], steps: [
    { pointers: { slow: 2, fast: 2 }, mark: { 2: "current" }, note: "Treat a[i] as a 'next' pointer → a cycle exists at the duplicate." },
    { pointers: { p: 0, q: 2 }, mark: { 2: "match" }, note: "Reset one to start; both +1 → meet at the duplicate value.", result: "2" } ] },
  java_m32_t1_ex_13: { kind: "linked-list", label: "Copy List w/ Random Ptr (#138)", list: ["A", "B", "C"], steps: [
    { pointers: { curr: 0 }, note: "Interleave copies: A→A'→B→B'→C→C'. Then random' = random.next." },
    { list: ["A'", "B'", "C'"], note: "Finally unweave into the cloned list. O(1) extra space.", result: "deep copy" } ] },
  java_m32_t1_ex_9: { kind: "linked-list", label: "Flatten Multilevel List (#430)", list: [1, 2, 3, 7, 8, 4, 5], steps: [
    { pointers: { curr: 1 }, note: "When a node has a child, splice the child list in BEFORE next." },
    { list: [1, 2, 3, 7, 8, 4, 5], note: "DFS/stack flattens all levels into one doubly-linked list.", result: "single level" } ] },
  java_m32_t1_ex_14: { kind: "linked-list", label: "Design Linked List (#707)", list: ["dmy", 1, 2, 3], steps: [
    { pointers: { head: 1 }, note: "addAtIndex/get/delete by walking k steps from a dummy head." },
    { pointers: { curr: 2 }, note: "Dummy head removes front-insert/delete special cases.", result: "O(index) ops" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-15: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
