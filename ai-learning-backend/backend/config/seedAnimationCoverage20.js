/**
 * seedAnimationCoverage20.js — GAP #1 animation, BIG batch 20 (~42).
 * COMPLETES three whole buckets: dynamic-programming (15), backtracking (13),
 * two-pointers (9), plus sorting (5). Existing renderers (grid / tree /
 * array-pointers), data-only. Verify: node config/auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const n = (id, v, x, y) => ({ id, v, x, y });
const cls = (...p) => Object.fromEntries(p);
const W = 380;

const A = {
  // ───────────────────────── dynamic-programming (completes → 30/30) ─────────────────────────
  java_m41_t2_ex_5: { kind: "array-pointers", label: "Min Cost Climbing Stairs (#746)", array: [10, 15, 20], steps: [
    { pointers: { i: 1 }, note: "dp[i] = cost[i] + min(dp[i−1], dp[i−2]); start free from step 0 or 1." },
    { pointers: { i: 2 }, mark: { 0: "match", 2: "match" }, note: "Answer = min(dp[n−1], dp[n−2]). O(1) rolling.", result: "15" } ] },
  java_m41_t2_ex_6: { kind: "array-pointers", label: "House Robber II (#213, circular)", array: [2, 3, 2], steps: [
    { pointers: { i: 0 }, note: "Houses in a ring → can't rob both first & last." },
    { mark: { 1: "match" }, note: "Run linear robber twice: [0..n−2] and [1..n−1]; take the max.", result: "3" } ] },
  java_m41_t3_ex_2: { kind: "grid", label: "Edit Distance (#72)", grid: [["", "", "h", "o", "s"], ["", 0, 1, 2, 3], ["r", 1, 1, 2, 3], ["o", 2, 2, 1, 2], ["s", 3, 3, 2, 2]], steps: [
    { cls: cls(["1,1", "source"]), note: "dp[i][j] = edits to turn first i of A into first j of B." },
    { cls: cls(["4,4", "path"]), note: "Match → diag; else 1 + min(insert, delete, replace).", result: "2" } ] },
  java_m41_t3_ex_3: { kind: "grid", label: "0/1 Knapsack", grid: [["", "0", "1", "2", "3"], ["∅", 0, 0, 0, 0], ["i1", 0, 0, 3, 3], ["i2", 0, 4, 4, 7]], steps: [
    { cls: cls(["1,1", "source"]), note: "dp[i][w] = best value using first i items within weight w." },
    { cls: cls(["3,4", "path"]), note: "Each item: skip it, or take it (value + dp[i−1][w−wt]).", result: "7" } ] },
  java_m41_t3_ex_4: { kind: "grid", label: "Longest Common Subsequence (#1143)", grid: [["", "", "a", "c", "e"], ["", 0, 0, 0, 0], ["a", 0, 1, 1, 1], ["b", 0, 1, 1, 1], ["e", 0, 1, 1, 2]], steps: [
    { cls: cls(["2,2", "frontier"]), note: "Match → dp[i−1][j−1]+1." },
    { cls: cls(["4,4", "path"]), note: "Mismatch → max(dp[i−1][j], dp[i][j−1]). LCS('abe','ace')=\"ae\".", result: "2" } ] },
  java_m41_t3_ex_5: { kind: "tree", label: "Triangle Min Path (#120)", W, H: 170, nodes: [n(0, 2, 190, 26), n(1, 3, 130, 80), n(2, 4, 250, 80), n(3, 6, 80, 136), n(4, 5, 190, 136), n(5, 7, 300, 136)], edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5]], steps: [
    { cls: cls(["3", "current"], ["4", "current"], ["5", "current"]), note: "Bottom-up: dp[i] = val + min(below-left, below-right)." },
    { cls: cls(["0", "match"], ["1", "match"], ["4", "match"]), note: "Collapse row by row → apex holds the min total.", result: "2+3+5 = 10" } ] },
  java_m41_t4_ex_1: { kind: "tree", label: "House Robber III (#337, tree DP)", W, H: 170, nodes: [n(0, 3, 190, 26), n(1, 2, 110, 86), n(2, 3, 270, 86), n(3, 3, 70, 146), n(4, 1, 270, 146)], edges: [[0, 1], [0, 2], [1, 3], [2, 4]], steps: [
    { cls: cls(["3", "current"], ["4", "current"]), note: "Each node returns {rob, skip}. rob = val + children.skip." },
    { cls: cls(["0", "match"], ["3", "match"], ["4", "match"]), note: "skip = Σ max(child.rob, child.skip). Answer = max at root.", result: "7" } ] },
  java_m41_t4_ex_2: { kind: "grid", label: "Burst Balloons (#312, interval DP)", grid: [["", "0", "1", "2"], ["0", 3, 0, 0], ["1", 0, 15, 0], ["2", 0, 0, 8]], steps: [
    { cls: cls(["1,1", "frontier"]), note: "dp[i][j] = max coins bursting (i..j); pick the LAST balloon k to pop." },
    { cls: cls(["1,3", "path"]), note: "dp[i][j] = max(dp[i][k−1] + L*k*R + dp[k+1][j]). Grow by interval length.", result: "max coins" } ] },
  java_m41_t4_ex_3: { kind: "grid", label: "Matrix Chain Multiplication", grid: [["", "1", "2", "3"], ["1", 0, 6, 18], ["2", 0, 0, 12], ["3", 0, 0, 0]], steps: [
    { cls: cls(["1,2", "frontier"]), note: "dp[i][j] = min scalar mults to multiply matrices i..j." },
    { cls: cls(["1,3", "path"]), note: "Try every split k: dp[i][k]+dp[k+1][j]+p[i-1]p[k]p[j].", result: "min cost" } ] },
  java_m41_t5_ex_1: { kind: "grid", label: "Partition Equal Subset Sum (#416)", grid: [["", "0", "5", "11"], ["∅", "T", "F", "F"], ["+5", "T", "T", "F"], ["+6", "T", "T", "T"]], steps: [
    { cls: cls(["1,1", "source"]), note: "Target = totalSum/2. dp[w] = can a subset sum to w?" },
    { cls: cls(["3,3", "path"]), note: "0/1 knapsack on booleans; reachable target → split exists.", result: "true" } ] },
  java_m31_t5_ex_12: { kind: "grid", label: "Min ASCII Delete Sum (#712)", grid: [["", "", "s", "e", "a"], ["", 0, "s", "se", "+"], ["e", "e", "·", "✓", "+"], ["a", "ea", "·", "·", "✓"]], steps: [
    { cls: cls(["1,1", "source"]), note: "Like edit distance, but cost = ASCII value of the deleted char." },
    { cls: cls(["3,4", "path"]), note: "Match → carry diag; else delete the cheaper char.", result: "min ASCII deletions" } ] },
  java_m31_t5_ex_13: { kind: "grid", label: "Interleaving String (#97)", grid: [["", "", "d", "b"], ["", "T", "T", "F"], ["a", "T", "F", "F"], ["b", "F", "F", "T"]], steps: [
    { cls: cls(["1,1", "source"]), note: "dp[i][j]: can s3[0..i+j] be formed by interleaving s1[0..i] & s2[0..j]?" },
    { cls: cls(["3,3", "path"]), note: "From top (s2 char matches) OR left (s1 char matches).", result: "true/false" } ] },
  java_m31_t5_ex_14: { kind: "array-pointers", label: "Edit Distance — O(n) space", array: ["prev[]", "curr[]"], steps: [
    { pointers: { i: 0 }, note: "Full table is O(mn); but each row needs only the row above." },
    { note: "Keep two 1-D arrays (prev, curr), swap each row → O(n) space.", result: "O(min(m,n)) space" } ] },
  java_m31_t5_ex_15: { kind: "grid", label: "String DP Synthesis", grid: [["", "B", "C"], ["A", 0, 0], ["B", 1, 0]], steps: [
    { cls: cls(["1,1", "frontier"]), note: "2-D table; match → diagonal, mismatch → neighbours." },
    { cls: cls(["2,1", "path"]), note: "LCS / edit distance / interleaving all share this skeleton.", result: "the template" } ] },
  java_m31_t5_ex_9: { kind: "grid", label: "Shortest Common Supersequence (#1092)", grid: [["", "", "a", "c"], ["", 0, 1, 2], ["a", 1, 1, 2], ["b", 2, 2, 2]], steps: [
    { cls: cls(["1,1", "source"]), note: "len(SCS) = len(s1)+len(s2)−len(LCS)." },
    { cls: cls(["3,3", "path"]), note: "Build LCS table, then walk back merging both strings.", result: "shortest superseq" } ] },

  // ───────────────────────── backtracking (completes → 16/16) ─────────────────────────
  java_m40_t1_ex_3: { kind: "tree", label: "Count Leaf Paths in a Decision Tree", W, H: 160, nodes: [n(0, "root", 190, 26), n(1, "L", 110, 86), n(2, "R", 270, 86), n(3, "·", 70, 146), n(4, "·", 150, 146), n(5, "·", 270, 146)], edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]], steps: [
    { cls: cls(["0", "current"]), note: "Each leaf = one complete decision path." },
    { cls: cls(["3", "match"], ["4", "match"], ["5", "match"]), note: "DFS, +1 at every leaf.", result: "3 paths" } ] },
  java_m40_t1_ex_4: { kind: "tree", label: "Generate Parentheses (#22)", W, H: 165, nodes: [n(0, "(", 190, 26), n(1, "((", 110, 86), n(2, "()", 270, 86), n(3, "(()", 110, 146), n(4, "()(", 270, 146)], edges: [[0, 1], [0, 2], [1, 3], [2, 4]], steps: [
    { cls: cls(["0", "current"]), note: "Add '(' while open < n; add ')' while close < open." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "Length 2n + balanced → valid. Catalan(n) results.", result: "well-formed" } ] },
  java_m40_t2_ex_2: { kind: "tree", label: "Combinations C(n,k) (#77)", W, H: 160, nodes: [n(0, "[ ]", 190, 26), n(1, "[1]", 90, 86), n(2, "[2]", 250, 86), n(3, "[1,2]", 60, 146), n(4, "[1,3]", 150, 146)], edges: [[0, 1], [0, 2], [1, 3], [1, 4]], steps: [
    { cls: cls(["0", "current"]), note: "Advance a START index so combos never repeat." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "Record when size == k. Prune when remaining < needed.", result: "k-combos" } ] },
  java_m40_t2_ex_4: { kind: "tree", label: "Subsets II — with dups (#90)", W, H: 160, nodes: [n(0, "[ ]", 190, 26), n(1, "[1]", 90, 86), n(2, "[2]", 250, 86), n(3, "[1,2]", 90, 146), n(4, "✗dup", 250, 146)], edges: [[0, 1], [0, 2], [1, 3], [2, 4]], steps: [
    { cls: cls(["4", "dropped"]), note: "Sort first; skip nums[i]==nums[i−1] at the SAME tree level." },
    { cls: cls(["1", "match"], ["2", "match"], ["3", "match"]), note: "Avoids duplicate subsets.", result: "unique subsets" } ] },
  java_m40_t2_ex_5: { kind: "tree", label: "Subsets II (#90)", W, H: 160, nodes: [n(0, "[ ]", 190, 26), n(1, "[1]", 90, 86), n(2, "[2]", 250, 86), n(3, "[1,2]", 90, 146), n(4, "✗dup", 250, 146)], edges: [[0, 1], [0, 2], [1, 3], [2, 4]], steps: [
    { cls: cls(["4", "dropped"]), note: "Same-level duplicate skip (i > start && nums[i]==nums[i−1])." },
    { cls: cls(["1", "match"], ["2", "match"], ["3", "match"]), note: "Powerset minus duplicates.", result: "[[],[1],[1,2],[2]]" } ] },
  java_m40_t3_ex_1: { kind: "tree", label: "N-Queens count, n=4 (#51)", W, H: 155, nodes: [n(0, "row0", 190, 26), n(1, "c1", 90, 86), n(2, "c2", 290, 86), n(3, "✓", 90, 146)], edges: [[0, 1], [0, 2], [1, 3]], steps: [
    { cls: cls(["0", "current"]), note: "One queen per row; track used cols + both diagonals." },
    { cls: cls(["3", "match"]), note: "Complete placement → +1. n=4 → 2 solutions.", result: "2" } ] },
  java_m40_t3_ex_2: { kind: "tree", label: "N-Queens count, n=8", W, H: 155, nodes: [n(0, "row0", 190, 26), n(1, "ok", 110, 86), n(2, "✗attack", 290, 86), n(3, "✓", 110, 146)], edges: [[0, 1], [0, 2], [1, 3]], steps: [
    { cls: cls(["2", "dropped"]), note: "Prune the instant a column/diagonal is attacked." },
    { cls: cls(["3", "match"]), note: "Count all complete boards. n=8 → 92 solutions.", result: "92" } ] },
  java_m40_t3_ex_3: { kind: "grid", label: "Sudoku Solver (#37)", grid: [[5, 3, ".", "."], [6, ".", ".", 1], [".", 9, 8, "."], [".", ".", ".", 4]], steps: [
    { cursor: [0, 2], cls: cls(["0,2", "frontier"]), note: "Find an empty cell; try 1–9 that don't break row/col/box." },
    { cls: cls(["0,2", "path"]), note: "Recurse; backtrack (reset cell) if no digit works.", result: "filled board" } ] },
  java_m40_t4_ex_2: { kind: "grid", label: "Word Search (#79)", grid: [["A", "B", "C"], ["S", "F", "C"], ["A", "D", "E"]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "DFS from each cell matching word[0]; mark visited." },
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["1,1", "path"]), note: "Explore 4 neighbours; un-mark on backtrack.", result: "true if path spells word" } ] },
  java_m40_t4_ex_3: { kind: "grid", label: "Count Paths in a Maze", grid: [[".", ".", "#"], ["#", ".", "."], [".", ".", "E"]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "DFS from start; '#' is a wall, mark cells on the current path." },
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["1,1", "path"], ["2,2", "path"]), note: "+1 each time E reached; un-mark on return.", result: "path count" } ] },
  java_m40_t5_ex_1: { kind: "tree", label: "Letter Combinations of a Phone Number (#17)", W, H: 160, nodes: [n(0, "''", 190, 26), n(1, "a", 90, 86), n(2, "b", 250, 86), n(3, "ad", 90, 146), n(4, "ae", 170, 146)], edges: [[0, 1], [0, 2], [1, 3], [1, 4]], steps: [
    { cls: cls(["0", "current"]), note: "Map each digit → its letters; recurse one digit deeper per level." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "Leaves = all combinations (∏ letters per digit).", result: "all combos" } ] },
  java_m40_t5_ex_2: { kind: "tree", label: "Palindrome Partitioning (#131)", W, H: 160, nodes: [n(0, "aab", 190, 26), n(1, "a|ab", 100, 86), n(2, "aa|b", 270, 86), n(3, "a|a|b", 100, 146)], edges: [[0, 1], [0, 2], [1, 3]], steps: [
    { cls: cls(["0", "current"]), note: "Cut after each prefix that IS a palindrome; recurse on the rest." },
    { cls: cls(["2", "match"], ["3", "match"]), note: "Reach end → one valid partition.", result: "[[aa,b],[a,a,b]]" } ] },
  java_m40_t5_ex_3: { kind: "tree", label: "Generate Parentheses (#22)", W, H: 165, nodes: [n(0, "(", 190, 26), n(1, "((", 110, 86), n(2, "()", 270, 86), n(3, "(())", 110, 146), n(4, "()()", 270, 146)], edges: [[0, 1], [0, 2], [1, 3], [2, 4]], steps: [
    { cls: cls(["0", "current"]), note: "Open '(' if open<n; close ')' if close<open." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "Balanced at length 2n → record. Catalan(n) total.", result: "(()) ()()" } ] },

  // ───────────────────────── two-pointers (completes → 25/25) ─────────────────────────
  java_m30_t1_ex_15: { kind: "array-pointers", label: "Two Pointers Synthesis", array: [1, 2, 3, 4, 5], steps: [
    { pointers: { L: 0, R: 4 }, note: "Opposite ends (sorted sums/palindrome) vs same-direction (fast/slow)." },
    { pointers: { L: 2, R: 2 }, note: "Move the pointer that improves the condition.", result: "the toolkit" } ] },
  java_m30_t1_ex_16: { kind: "array-pointers", label: "Merge Sorted Array (#88)", array: [1, 2, 3, 0, 0, 0], meta: { B: "[2,5,6]" }, steps: [
    { pointers: { i: 2, j: 2, w: 5 }, note: "Fill from the BACK: compare A[i], B[j], write the larger at w." },
    { array: [1, 2, 2, 3, 5, 6], mark: { 3: "match", 4: "match", 5: "match" }, note: "No overwrite risk — in-place O(m+n).", result: "[1,2,2,3,5,6]" } ] },
  java_m30_t4_ex_11: { kind: "array-pointers", label: "Move Negatives Left (stable)", array: [1, -2, 3, -4, 5], steps: [
    { pointers: { L: 0 }, note: "Stable order needed → a plain swap won't do (it reorders)." },
    { array: [-2, -4, 1, 3, 5], mark: { 0: "match", 1: "match" }, note: "Use an aux pass / rotations to keep relative order.", result: "[-2,-4,1,3,5]" } ] },
  java_m30_t4_ex_12: { kind: "array-pointers", label: "Find the Duplicate (#287, Floyd)", array: [1, 3, 4, 2, 2], steps: [
    { pointers: { slow: 1, fast: 2 }, note: "Treat value as a 'next' pointer → cycle detection finds the dup." },
    { mark: { 3: "match", 4: "match" }, note: "O(n) time, O(1) space, array unmodified.", result: "2" } ] },
  java_m30_t4_ex_13: { kind: "array-pointers", label: "Sort Array By Parity II (#922)", array: [4, 2, 5, 7], steps: [
    { pointers: { even: 0, odd: 1 }, note: "Two pointers: even indices want evens, odd indices want odds." },
    { array: [4, 5, 2, 7], mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "Swap a misplaced pair. O(n), O(1).", result: "even@even, odd@odd" } ] },
  java_m30_t4_ex_14: { kind: "array-pointers", label: "Minimum Swaps to Sort", array: [2, 4, 1, 3], steps: [
    { pointers: { i: 0 }, note: "Map values→target positions; count cycles in the permutation." },
    { note: "Each cycle of length L needs L−1 swaps. Σ(L−1).", result: "min swaps" } ] },
  java_m30_t4_ex_15: { kind: "array-pointers", label: "Dutch National Flag Synthesis", array: [2, 0, 2, 1, 1, 0], steps: [
    { pointers: { lo: 0, mid: 0, hi: 5 }, note: "Three regions: <pivot | ==pivot | >pivot, one pass." },
    { array: [0, 0, 1, 1, 2, 2], mark: { 0: "match", 5: "match" }, note: "0→swap lo & advance; 2→swap hi; 1→advance mid.", result: "[0,0,1,1,2,2]" } ] },
  java_m30_t4_ex_8: { kind: "array-pointers", label: "3-Way Quicksort (dups)", array: [3, 1, 3, 2, 3], meta: { pivot: 3 }, steps: [
    { pointers: { lt: 0, gt: 4 }, note: "Partition into <pivot, ==pivot, >pivot (Dutch flag)." },
    { array: [1, 2, 3, 3, 3], mark: { 2: "match", 3: "match", 4: "match" }, note: "Equal block is final → recurse only on the two ends.", result: "fast on duplicates" } ] },
  java_m30_t4_ex_9: { kind: "array-pointers", label: "Wiggle Sort II (#324)", array: [1, 5, 1, 1, 6, 4], steps: [
    { pointers: { i: 0 }, note: "Find median; place larges at odd indices, smalls at even (reverse order)." },
    { array: [1, 6, 1, 5, 1, 4], mark: { 1: "match", 3: "match" }, note: "nums[0]<nums[1]>nums[2]<… avoids equal-neighbour clashes.", result: "[1,6,1,5,1,4]" } ] },

  // ───────────────────────── sorting (5) ─────────────────────────
  java_m38_t1_ex_13: { kind: "array-pointers", label: "Bubble Sort (early-exit)", array: [5, 1, 4, 2], steps: [
    { pointers: { i: 0 }, mark: { 0: "dropped", 1: "kept" }, note: "Swap adjacent out-of-order pairs; biggest bubbles to the end each pass." },
    { array: [1, 2, 4, 5], note: "A pass with zero swaps → already sorted, stop early. Best case O(n).", result: "[1,2,4,5]" } ] },
  java_m38_t1_ex_15: { kind: "array-pointers", label: "Selection Sort", array: [5, 1, 4, 2], steps: [
    { pointers: { i: 0, min: 1 }, note: "Find the minimum of the unsorted part, swap it to the front." },
    { array: [1, 2, 4, 5], note: "Always O(n²) compares, but only O(n) swaps.", result: "[1,2,4,5]" } ] },
  java_m38_t1_ex_16: { kind: "array-pointers", label: "Insertion Sort (O(n) best)", array: [2, 4, 1, 5], steps: [
    { pointers: { i: 2 }, window: [0, 1], note: "Take next element, shift larger sorted ones right, insert it." },
    { array: [1, 2, 4, 5], note: "Nearly-sorted input → almost no shifts → O(n).", result: "[1,2,4,5]" } ] },
  java_m38_t1_ex_17: { kind: "array-pointers", label: "Shell Sort (gapped insertion)", array: [8, 3, 6, 1, 5], meta: { gap: 2 }, steps: [
    { pointers: { gap: 2 }, note: "Insertion-sort elements 'gap' apart, shrinking the gap to 1." },
    { array: [1, 3, 5, 6, 8], note: "Big early moves cut total shifts vs plain insertion sort.", result: "[1,3,5,6,8]" } ] },
  java_m38_t1_ex_5: { kind: "array-pointers", label: "Count Inversions (merge sort)", array: [2, 4, 1, 3, 5], steps: [
    { pointers: { L: 0, R: 2 }, note: "During merge, when right element is taken before left → it beats all remaining lefts." },
    { mark: { 0: "match", 1: "match", 2: "match" }, note: "Add (mid−i+1) to the count. O(n log n).", result: "inversion count" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-20: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
