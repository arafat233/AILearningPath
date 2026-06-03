/**
 * seedAnimationCoverage14.js — GAP #1 animation coverage, BIG batch 14 (~40).
 * Bespoke per-problem animations across hashing / linked-list / matrix / queue,
 * reusing existing renderers (array-pointers, linked-list, grid, stack, tree).
 * Pure step-data, NO frontend change. Idempotent.
 * Tracked in COMPETITIVE_GAP_ANALYSIS.md §5. Verify with auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";

const cls = (...p) => Object.fromEntries(p);
const v = (k) => [k, "visited"];

const A = {
  // ===== HASHING (array-pointers; map state in notes/captions) =====
  java_m34_t1_ex_3: { kind: "array-pointers", label: "Two Sum (#1, hash map)", array: [2, 7, 11, 15], meta: { target: 9 }, steps: [
    { pointers: { i: 0 }, note: "Store seen values in a map; look up target − current.", caption: "need 9−2=7 · map {2:0}" },
    { pointers: { i: 1 }, mark: { 0: "match", 1: "match" }, note: "7 is the complement of 2 → found.", caption: "7 in map → [0,1]", result: "[0, 1]" } ] },
  java_m34_t1_ex_4: { kind: "array-pointers", label: "Subarray Sum = K (#560, prefix+map)", array: [1, 2, 3, -3, 3], meta: { k: 3 }, steps: [
    { pointers: { i: 1 }, note: "Running prefix sum; count how many earlier prefixes equal sum−k.", caption: "sum=3 · seen{0:1,1:1,3:1}" },
    { pointers: { i: 4 }, note: "Each match = a subarray summing to k.", caption: "sum−k seen → count++", result: "4 subarrays" } ] },
  java_m34_t1_ex_1: { kind: "array-pointers", label: "HashMap basic ops", array: ["put", "get", "containsKey", "remove"], steps: [
    { pointers: { i: 0 }, note: "put/get/containsKey/remove are all O(1) average via hashing." },
    { pointers: { i: 1 }, note: "Key's hashCode → bucket index; equals() resolves collisions.", result: "O(1) avg" } ] },
  java_m34_t1_ex_2: { kind: "array-pointers", label: "Frequency count", array: [1, 1, 2, 3, 1, 2], steps: [
    { pointers: { i: 2 }, note: "map.merge(x, 1, Integer::sum) counts occurrences in one pass.", caption: "{1:2, 2:1}" },
    { pointers: { i: 5 }, note: "Final counts.", caption: "{1:3, 2:2, 3:1}", result: "freq map" } ] },
  java_m31_t4_ex_4: { kind: "array-pointers", label: "Ransom Note (#383)", array: ["a", "a", "b"], steps: [
    { pointers: { i: 0 }, note: "Count magazine letters; decrement per ransom letter.", caption: "magazine {a:3,b:1}" },
    { pointers: { i: 2 }, mark: { 0: "match", 1: "match", 2: "match" }, note: "Every needed letter has stock ≥ 0 → constructible.", result: "true" } ] },
  java_m31_t4_ex_7: { kind: "array-pointers", label: "First Unique Char (#387)", array: ["l", "e", "e", "t", "c", "o", "d", "e"], steps: [
    { pointers: { i: 0 }, note: "Pass 1: count each char. Pass 2: first with count 1.", caption: "{l:1,e:3,t:1,c:1,o:1,d:1}" },
    { pointers: { i: 0 }, mark: { 0: "match" }, note: "'l' has count 1 and appears first.", result: "index 0" } ] },
  java_m31_t4_ex_9: { kind: "array-pointers", label: "Sort Chars By Frequency (#451)", array: ["t", "r", "e", "e"], steps: [
    { pointers: { i: 3 }, note: "Count freq, then emit chars most-frequent first.", caption: "{e:2, t:1, r:1}" },
    { pointers: {}, note: "Bucket/heap by frequency.", result: "\"eert\" / \"eetr\"" } ] },
  java_m31_t4_ex_11: { kind: "array-pointers", label: "Min Steps to Anagram (#1347)", array: ["b", "a", "b"], steps: [
    { pointers: { i: 2 }, note: "Count letters of both; sum the positive differences." },
    { pointers: {}, note: "Each surplus letter in t is one replacement.", result: "Σ max(0, t[c]−s[c])" } ] },
  java_m31_t4_ex_13: { kind: "array-pointers", label: "≤ K Distinct Chars", array: ["e", "c", "e", "b", "a"], meta: { k: 2 }, steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Sliding window + count map; shrink when distinct > k.", caption: "{e,c} ≤ 2 · len 3" },
    { pointers: { L: 2, R: 3 }, window: [2, 3], note: "'b' makes 3 distinct → advance L until ≤ k.", result: "longest ≤ k distinct" } ] },
  java_m31_t4_ex_8: { kind: "array-pointers", label: "Min Window Substring (#76)", array: ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], steps: [
    { pointers: { L: 0, R: 5 }, window: [0, 5], note: "Expand R until the window covers all needed chars (have == need)." },
    { pointers: { L: 5, R: 5 }, window: [5, 5], note: "Then shrink L while still valid → minimal window.", result: "\"BANC\"" } ] },
  java_m31_t4_ex_12: { kind: "array-pointers", label: "Top K Frequent (#692)", array: ["i", "love", "leetcode", "i", "love", "coding"], steps: [
    { pointers: { i: 5 }, note: "Count freq, then a heap/bucket by (freq desc, lexicographic).", caption: "{i:2, love:2, …}" },
    { pointers: {}, note: "k most frequent words.", result: "[\"i\", \"love\"]" } ] },
  java_m31_t4_ex_14: { kind: "array-pointers", label: "Number of Good Substrings (#1876)", array: ["x", "y", "z", "z", "a", "z"], steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Fixed window of 3; count windows with all-distinct chars.", caption: "\"xyz\" distinct ✓" },
    { pointers: { L: 1, R: 3 }, window: [1, 3], note: "\"yzz\" has a repeat → not good.", result: "count good windows" } ] },

  // ===== LINKED-LIST =====
  java_m32_t1_ex_6: { kind: "linked-list", label: "Add Two Numbers (#2)", list: [2, 4, 3], list2: [5, 6, 4], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Digits are reversed; add node-by-node with a carry.", caption: "2+5=7, carry 0" },
    { pointers: { a: 2 }, pointers2: { b: 2 }, note: "4+6=10 → write 0 carry 1; 3+4+1=8.", result: "7→0→8  (342+465=807)" } ] },
  java_m32_t1_ex_8: { kind: "linked-list", label: "Intersection of Two Lists (#160)", list: [4, 1, 8, 4, 5], list2: [5, 6, 1, 8, 4, 5], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Two pointers; when one ends, redirect it to the OTHER head." },
    { pointers: { a: 2 }, pointers2: { b: 3 }, mark: { 2: "match" }, mark2: { 3: "match" }, note: "After swapping, both travel a+b+c and meet at the shared node 8.", result: "node 8" } ] },
  java_m32_t2_ex_6: { kind: "linked-list", label: "Find Cycle Start (#142)", list: [3, 2, 0, 4], links: ["→", "→", "→", "↺"], steps: [
    { pointers: { slow: 2, fast: 2 }, mark: { 2: "current" }, note: "Phase 1: slow/fast meet inside the cycle." },
    { pointers: { p: 0, q: 1 }, note: "Phase 2: reset one pointer to head; advance both by 1." },
    { pointers: { p: 1 }, mark: { 1: "match" }, note: "They meet exactly at the cycle entrance.", result: "entry = node 2" } ] },
  java_m32_t2_ex_10: { kind: "linked-list", label: "Reorder List (#143)", list: [1, 2, 3, 4, 5], steps: [
    { pointers: { mid: 2 }, note: "1) find middle (slow/fast)." },
    { list: [1, 2, 3, 4, 5], links: ["→", "→", "→", "←", "←"], note: "2) reverse the second half." },
    { list: [1, 5, 2, 4, 3], note: "3) merge the two halves alternately.", result: "1→5→2→4→3" } ] },
  java_m32_t2_ex_11: { kind: "linked-list", label: "Nth Node from End", list: [1, 2, 3, 4, 5], meta: { n: 2 }, steps: [
    { pointers: { fast: 1 }, note: "Advance fast n nodes first." },
    { pointers: { fast: 4, slow: 2 }, note: "Move both until fast hits the end.", mark: { 3: "match" }, result: "value 4" } ] },
  java_m32_t2_ex_9: { kind: "linked-list", label: "Happy Number (#202)", list: [19, 82, 68, 100, 1], steps: [
    { pointers: { slow: 0 }, note: "Treat 'sum of squared digits' as a linked list; detect a cycle.", caption: "19→82→68→100→1" },
    { pointers: { slow: 4 }, mark: { 4: "match" }, note: "Reaches 1 (no cycle) → happy. Floyd's catches the unhappy loop.", result: "true" } ] },
  java_m32_t1_ex_3: { kind: "linked-list", label: "Linked List from Scratch", list: ["dmy", 1, 2, 3], steps: [
    { pointers: { head: 1 }, note: "Each node holds a value + next pointer; a dummy head simplifies edge cases." },
    { pointers: { curr: 2 }, note: "Traverse by following next until null.", result: "node {val, next}" } ] },
  java_m32_t2_ex_12: { kind: "linked-list", label: "Cycle Length", list: [1, 2, 3, 4, 5], links: ["→", "→", "→", "→", "↺"], steps: [
    { pointers: { slow: 3, fast: 3 }, mark: { 3: "current" }, note: "After slow/fast meet inside the cycle, keep one fixed." },
    { pointers: { slow: 3 }, note: "Advance the other until it returns → count the steps = cycle length.", result: "length 3" } ] },

  // ===== MATRIX (grid) =====
  java_m30_5_t1_ex_5: { kind: "grid", label: "Set Matrix Zeroes (#73)", grid: [[1, 1, 1], [1, 0, 1], [1, 1, 1]], steps: [
    { cursor: [1, 1], cls: cls(["1,1", "source"]), note: "Find zeros first (use first row/col as markers — O(1) space)." },
    { grid: [[1, 0, 1], [0, 0, 0], [1, 0, 1]], note: "Then blank each marked row and column.", result: "row 1 & col 1 zeroed" } ] },
  java_m30_5_t1_ex_6: { kind: "grid", label: "Diagonal Traverse (#498)", grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], steps: [
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["1,0", "path"]), note: "Walk anti-diagonals, alternating up-right and down-left." },
    { cls: cls(["2,2", "path"]), note: "Direction flips at each boundary.", result: "1 2 4 7 5 3 6 8 9" } ] },
  java_m30_5_t1_ex_7: { kind: "grid", label: "Search a 2D Matrix (#74)", grid: [[1, 3, 5], [7, 9, 11], [13, 15, 17]], steps: [
    { cursor: [1, 1], cls: cls(["1,1", "frontier"]), note: "Row-major sorted → treat as one array; binary search. mid = 9." },
    { cursor: [0, 2], cls: cls(["0,2", "path"]), note: "target 5 < 9 → search the left half. Found.", result: "true" } ] },
  java_m30_5_t1_ex_9: { kind: "grid", label: "Rotate Image (in place)", grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], steps: [
    { grid: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], note: "Transpose (swap across the diagonal)." },
    { grid: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], note: "Reverse each row → rotated 90° CW.", result: "rotated" } ] },
  java_m30_5_t2_ex_5: { kind: "grid", label: "Max Area of Island (#695)", grid: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "DFS each land cell, counting connected cells." },
    { cursor: [1, 2], cls: cls(v("0,0"), v("0,1"), v("1,1"), v("1,2")), note: "Track the max component size.", result: "4" } ] },
  java_m30_5_t3_ex_2: { kind: "grid", label: "Unique Paths (#62)", grid: [[1, 1, 1], [1, 2, 3], [1, 3, 6]], steps: [
    { cursor: [1, 1], cls: cls(["0,1", "visited"], ["1,0", "visited"]), note: "dp[r][c] = dp[r-1][c] + dp[r][c-1]; first row/col = 1." },
    { cls: cls(["2,2", "path"]), note: "Bottom-right = number of paths.", result: "6" } ] },
  java_m30_5_t3_ex_3: { kind: "grid", label: "Minimum Path Sum (#64)", grid: [[1, 3, 1], [1, 5, 1], [4, 2, 1]], steps: [
    { cursor: [1, 1], note: "dp[r][c] = grid[r][c] + min(up, left)." },
    { grid: [[1, 4, 5], [2, 7, 6], [6, 8, 7]], cls: cls(["2,2", "path"]), note: "Accumulate cheapest path; answer at bottom-right.", result: "7" } ] },
  java_m30_5_t3_ex_4: { kind: "grid", label: "Unique Paths II — obstacles (#63)", grid: [[0, 0, 0], [0, 1, 0], [0, 0, 0]], palette: { 1: "rgba(120,120,128,0.3)" }, steps: [
    { cursor: [1, 1], cls: cls(["1,1", "wall"]), note: "Obstacle cell → dp = 0 (no path through it)." },
    { grid: [[1, 1, 1], [1, 0, 1], [2, 2, 2]], cls: cls(["2,2", "path"]), note: "Routes detour around the wall.", result: "2" } ] },
  java_m30_5_t3_ex_7: { kind: "grid", label: "Maximal Square (#221)", grid: [[1, 0, 1], [1, 1, 1], [1, 1, 1]], steps: [
    { cursor: [2, 2], note: "dp[r][c] = 1 + min(up, left, up-left) if cell is 1." },
    { grid: [[1, 0, 1], [1, 1, 1], [1, 1, 2]], cls: cls(["2,2", "path"]), note: "Largest dp value = side; area = side².", result: "side 2 → area 4" } ] },
  java_m30_5_t4_ex_4: { kind: "grid", label: "Search 2D Matrix II (#240)", grid: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], steps: [
    { cursor: [0, 2], cls: cls(["0,2", "frontier"]), note: "Start TOP-RIGHT. target 5 < 7 → move left." },
    { cursor: [1, 1], cls: cls(["1,1", "path"]), note: "5 found. Each step drops a row or column → O(m+n).", result: "true" } ] },

  // ===== QUEUE / DEQUE / BFS =====
  java_m33_t3_ex_4: { kind: "grid", label: "BFS Level-Order (grid)", grid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "Queue starts with the source; each pop enqueues its neighbors." },
    { cls: cls(v("0,0"), ["0,1", "frontier"], ["1,0", "frontier"]), note: "The frontier expands one ring per level = BFS distance.", result: "level by level" } ] },
  java_m33_t3_ex_5: { kind: "grid", label: "Number of Islands — BFS (#200)", grid: [[1, 1, 0], [0, 1, 0], [0, 0, 1]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "BFS-flood each unvisited 1, marking the whole island." },
    { cls: cls(v("0,0"), v("0,1"), v("1,1"), ["2,2", "source"]), note: "Each BFS launch = one island.", result: "2" } ] },
  java_m33_t3_ex_7: { kind: "grid", label: "Rotting Oranges (#994)", grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]], palette: { 2: "rgba(255,159,10,0.3)" }, steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "Multi-source BFS: all rotten oranges spread simultaneously each minute." },
    { grid: [[2, 2, 1], [2, 1, 0], [0, 1, 1]], cls: cls(["0,1", "frontier"], ["1,0", "frontier"]), note: "Minutes = number of BFS levels until none fresh remain.", result: "minutes to rot all" } ] },
  java_m33_t3_ex_6: { kind: "grid", label: "Walls and Gates (BFS)", grid: [["∞", "∞", 0], ["W", "∞", "∞"], ["∞", "∞", "∞"]], palette: { W: "rgba(120,120,128,0.3)", 0: "rgba(191,90,242,0.2)" }, steps: [
    { cursor: [0, 2], cls: cls(["0,2", "source"]), note: "Seed BFS from every gate at once." },
    { grid: [["∞", 1, 0], ["W", 2, 1], [4, 3, 2]], note: "Each cell gets its distance to the nearest gate.", result: "distances filled" } ] },
  java_m33_t3_ex_8: { kind: "grid", label: "Perfect Squares — BFS (#279)", grid: [[0, 1, 2], [3, 4, 5], [6, 7, 8]], steps: [
    { cls: cls(["0,0", "source"]), note: "BFS over n: each level subtracts a perfect square (1,4,9…)." },
    { cls: cls(["1,1", "path"]), note: "First time we reach 0 = fewest squares.", result: "min count" } ] },
  java_m33_t3_ex_3: { kind: "stack", label: "Stack from Queues (#225)", outLabel: "top", array: ["push 1", "push 2", "top"], steps: [
    { cursor: 1, stack: [1, 2], note: "push: enqueue, then rotate the queue so the new item is at the front." },
    { cursor: 2, stack: [2, 1], output: [2], note: "Front of the queue acts as the stack's top → LIFO.", result: "top = 2" } ] },
  java_m33_t4_ex_2: { kind: "array-pointers", label: "Sliding Window Maximum (#239)", array: [1, 3, -1, -3, 5, 3, 6, 7], meta: { k: 3 }, steps: [
    { pointers: { i: 2 }, window: [0, 2], note: "Monotonic-decreasing deque of indices; front = window max.", caption: "deque front = 3" },
    { pointers: { i: 4 }, window: [2, 4], note: "Pop smaller values off the back; pop the front if it left the window.", caption: "5 clears the deque" },
    { pointers: { i: 7 }, window: [5, 7], mark: { 7: "match" }, note: "Each index enters/leaves once → O(n).", result: "[3,3,5,5,6,7]" } ] },
  java_m33_t4_ex_3: { kind: "array-pointers", label: "Sliding Window Minimum", array: [4, 2, 12, 11, -5], meta: { k: 2 }, steps: [
    { pointers: { i: 1 }, window: [0, 1], note: "Monotonic-INCREASING deque; front = window min.", caption: "min 2" },
    { pointers: { i: 4 }, window: [3, 4], mark: { 4: "match" }, note: "Same mechanic, flipped comparison.", result: "[2,2,11,-5]" } ] },
  java_m33_t4_ex_4: { kind: "array-pointers", label: "Jump Game I (#55)", array: [2, 3, 1, 1, 4], steps: [
    { pointers: { i: 0 }, window: [0, 2], note: "Track the farthest index reachable so far." },
    { pointers: { i: 1 }, window: [0, 4], note: "reach ≥ last index at every step → reachable.", result: "true" } ] },
  java_m33_t4_ex_5: { kind: "array-pointers", label: "Jump Game II (#45, min jumps)", array: [2, 3, 1, 1, 4], steps: [
    { pointers: { i: 0 }, window: [0, 2], note: "Greedy BFS-by-levels: current jump reaches [1..2]." },
    { pointers: { i: 2 }, window: [1, 4], note: "From that range the next jump reaches the end → 2 jumps.", result: "2" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ not found: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-14: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
