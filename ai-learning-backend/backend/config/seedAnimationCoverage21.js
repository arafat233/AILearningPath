/**
 * seedAnimationCoverage21.js — GAP #1 animation, BIG batch 21 (~45).
 * COMPLETES six whole buckets: arrays (13), tree-dfs (11), tree-traversal (9),
 * bst (7), binary-search-on-answer (4), trie (1). Existing renderers
 * (array-pointers / tree), data-only. Verify: node config/auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const cls = (...p) => Object.fromEntries(p);
const W = 380;
// level-order array → binary tree {nodes, edges} (null = absent)
function btree(arr) {
  const nodes = [], edges = []; let mL = 0;
  arr.forEach((vv, i) => {
    if (vv == null) return;
    const L = Math.floor(Math.log2(i + 1)); mL = Math.max(mL, L);
    const il = i - (2 ** L - 1), c = 2 ** L;
    nodes.push({ id: i, v: vv, x: Math.round(W * (il + 0.5) / c), y: 24 + L * 46 });
    const p = Math.floor((i - 1) / 2);
    if (i > 0 && arr[p] != null) edges.push([p, i]);
  });
  return { nodes, edges, W, H: 24 + mL * 46 + 22 };
}

const A = {
  // ───────────────────────── arrays (completes → 18/18) ─────────────────────────
  java_m30_t5_ex_11: { kind: "array-pointers", label: "Max Sum Circular Subarray (#918)", array: [5, -3, 5], steps: [
    { pointers: { i: 2 }, note: "Answer = max(normal Kadane, total − minKadane) — the wrap case." },
    { mark: { 0: "match", 2: "match" }, note: "Edge: if all negative, use the plain Kadane max.", result: "10" } ] },
  java_m30_t5_ex_12: { kind: "array-pointers", label: "Jump Game II (#45)", array: [2, 3, 1, 1, 4], steps: [
    { pointers: { i: 0, end: 0, far: 2 }, note: "BFS-by-levels: 'far' = farthest reach in this jump; jump when i hits 'end'." },
    { pointers: { i: 4 }, mark: { 0: "match", 1: "match", 4: "match" }, note: "Increment jumps each level. O(n).", result: "2" } ] },
  java_m30_t5_ex_13: { kind: "array-pointers", label: "Maximum Gap (#164)", array: [3, 6, 9, 1], steps: [
    { pointers: { i: 0 }, note: "Bucket/pidgeonhole: bucket width = (max−min)/(n−1); gap lives BETWEEN buckets." },
    { mark: { 0: "match", 1: "match" }, note: "Max gap = max(nextBucketMin − prevBucketMax). O(n).", result: "3" } ] },
  java_m30_t5_ex_14: { kind: "array-pointers", label: "Subarray with Given XOR", array: [4, 2, 2, 6, 4], meta: { target: 6 }, steps: [
    { pointers: { i: 2 }, note: "Prefix XOR + map; need earlier prefix == (curXor ^ target)." },
    { mark: { 1: "match", 2: "match" }, note: "Each such earlier prefix = one valid subarray.", result: "count" } ] },
  java_m30_t5_ex_15: { kind: "array-pointers", label: "Array Patterns Synthesis", array: [3, 1, 4, 1, 5], steps: [
    { pointers: { L: 0, R: 4 }, note: "Two pointers, prefix sums, Kadane, sliding window, in-place rewrite." },
    { note: "Recognise which pattern the constraints point to.", result: "the toolkit" } ] },
  java_m30_t5_ex_17: { kind: "array-pointers", label: "Flipping an Image (#832)", array: [1, 0, 1], steps: [
    { pointers: { L: 0, R: 2 }, note: "Reverse each row, then invert bits — fuse both in one two-pointer pass." },
    { array: [0, 1, 0], mark: { 0: "match", 2: "match" }, note: "Swap ends with XOR 1 each. O(n).", result: "[0,1,0]" } ] },
  java_m30_t5_ex_18: { kind: "array-pointers", label: "Shuffle the Array (#1470)", array: [2, 5, 1, 3, 4, 7], meta: { n: 3 }, steps: [
    { pointers: { i: 0, j: 3 }, note: "Interleave: x1,y1,x2,y2,… reading from front half and back half." },
    { array: [2, 3, 5, 4, 1, 7], mark: { 0: "match", 1: "match" }, note: "Output index 2k=x[k], 2k+1=y[k].", result: "[2,3,5,4,1,7]" } ] },
  java_m30_t5_ex_19: { kind: "array-pointers", label: "Richest Customer Wealth (#1672)", array: [1, 5, 7], steps: [
    { pointers: { i: 2 }, note: "Each row = one customer; wealth = row sum." },
    { mark: { 2: "match" }, note: "Track the maximum row sum across customers.", result: "max wealth" } ] },
  java_m30_t5_ex_20: { kind: "array-pointers", label: "Concatenation of Array (#1929)", array: [1, 2, 1], steps: [
    { pointers: { i: 0 }, note: "Return ans where ans[i] = nums[i] and ans[i+n] = nums[i]." },
    { array: [1, 2, 1, 1, 2, 1], note: "Just copy nums twice. O(n).", result: "[1,2,1,1,2,1]" } ] },
  java_m30_t5_ex_21: { kind: "array-pointers", label: "Find Closest Number to Zero (#2239)", array: [-4, -2, 1, 4, 8], steps: [
    { pointers: { i: 2 }, mark: { 2: "match" }, note: "Track min |x|; tie → keep the LARGER (more positive) value." },
    { note: "Single pass, O(n).", result: "1" } ] },
  java_m30_t5_ex_5: { kind: "array-pointers", label: "Next Permutation (#31)", array: [1, 3, 5, 4, 2], steps: [
    { pointers: { pivot: 1 }, note: "Scan from right for first dip nums[i] < nums[i+1]." },
    { array: [1, 4, 2, 3, 5], mark: { 1: "match" }, note: "Swap pivot with next-larger to its right, then reverse the suffix.", result: "[1,4,2,3,5]" } ] },
  java_m30_t5_ex_6: { kind: "array-pointers", label: "Longest Consecutive Sequence (#128)", array: [100, 4, 200, 1, 3, 2], steps: [
    { pointers: { i: 3 }, note: "Put all in a HashSet; only start counting at x where x−1 is absent (a run start)." },
    { mark: { 3: "match", 5: "match", 4: "match", 1: "match" }, note: "Walk x, x+1, x+2… O(n) total.", result: "4" } ] },
  java_m30_t5_ex_9: { kind: "array-pointers", label: "Maximum Product Subarray (#152)", array: [2, 3, -2, 4], steps: [
    { pointers: { i: 1 }, note: "Track BOTH max and min products (a negative flips them)." },
    { mark: { 0: "match", 1: "match" }, note: "max = max(x, x*prevMax, x*prevMin).", result: "6" } ] },

  // ───────────────────────── tree-traversal (completes → 15/15) ─────────────────────────
  java_m35_t1_ex_10: { kind: "tree", label: "Flatten Binary Tree to List (#114)", ...btree([1, 2, 5, 3, 4, null, 6]), steps: [
    { cls: cls(["0", "current"]), note: "Pre-order order; rewire each node's right to the next pre-order node, left = null." },
    { cls: cls(["0", "match"], ["1", "match"], ["3", "match"], ["4", "match"], ["2", "match"], ["6", "match"]), note: "Morris-style: right-most of left subtree → current right.", result: "1→2→3→4→5→6" } ] },
  java_m35_t1_ex_11: { kind: "tree", label: "Traversal Synthesis", ...btree([1, 2, 3, 4, 5]), steps: [
    { cls: cls(["0", "current"]), note: "Pre/in/post differ only in WHEN you visit the node vs recurse children." },
    { cls: cls(["3", "match"], ["1", "match"], ["4", "match"], ["0", "match"]), note: "BFS uses a queue; DFS uses recursion/stack.", result: "the templates" } ] },
  java_m35_t1_ex_12: { kind: "tree", label: "M35 T1 Synthesis", ...btree([1, 2, 3, 4, 5, 6]), steps: [
    { cls: cls(["0", "current"]), note: "Recursive is concise; iterative (explicit stack) avoids stack overflow on deep trees." },
    { cls: cls(["3", "match"], ["1", "match"], ["0", "match"], ["2", "match"]), note: "Level-order via queue for breadth problems.", result: "all four orders" } ] },
  java_m35_t1_ex_13: { kind: "tree", label: "Preorder (recursive & iterative)", ...btree([1, 2, 3, 4, 5]), steps: [
    { cls: cls(["0", "match"], ["1", "current"]), note: "Pre-order = node, then left, then right." },
    { cls: cls(["0", "match"], ["1", "match"], ["3", "match"], ["4", "match"], ["2", "match"]), note: "Iterative: push right child first so left pops first.", result: "1,2,4,5,3" } ] },
  java_m35_t1_ex_15: { kind: "tree", label: "Postorder (recursive & iterative)", ...btree([1, 2, 3, 4, 5]), steps: [
    { cls: cls(["3", "match"], ["4", "current"]), note: "Post-order = left, right, then node." },
    { cls: cls(["3", "match"], ["4", "match"], ["1", "match"], ["2", "match"], ["0", "match"]), note: "Iterative: do a reversed pre-order (node,right,left) then reverse output.", result: "4,5,2,3,1" } ] },
  java_m35_t1_ex_17: { kind: "tree", label: "Average of Levels (#637)", ...btree([3, 9, 20, null, null, 15, 7]), steps: [
    { cls: cls(["0", "current"]), note: "Level-order BFS; for each level sum values / count." },
    { cls: cls(["1", "match"], ["2", "match"]), note: "Push averages per level.", result: "[3, 14.5, 11]" } ] },
  java_m35_t1_ex_2: { kind: "tree", label: "Inorder Iterative (stack)", ...btree([4, 2, 6, 1, 3, 5, 7]), steps: [
    { cls: cls(["1", "current"]), note: "Push all left children; pop → visit → go right." },
    { cls: cls(["3", "match"], ["1", "match"], ["4", "match"], ["0", "match"]), note: "Yields sorted order for a BST.", result: "1,2,3,4,5,6,7" } ] },
  java_m35_t1_ex_8: { kind: "tree", label: "Binary Tree Diameter (#543)", ...btree([1, 2, 3, 4, 5]), steps: [
    { cls: cls(["3", "current"], ["4", "current"]), note: "At each node, diameter = leftHeight + rightHeight." },
    { cls: cls(["3", "path"], ["1", "path"], ["4", "path"]), note: "Return height upward; track the global max path-through-node.", result: "longest path (edges)" } ] },
  java_m35_t1_ex_9: { kind: "tree", label: "All Traversals Comparison", ...btree([1, 2, 3]), steps: [
    { cls: cls(["0", "current"]), note: "Pre: 1,2,3 · In: 2,1,3 · Post: 2,3,1 · Level: 1,2,3." },
    { cls: cls(["1", "match"], ["0", "match"], ["2", "match"]), note: "Same tree, four visit orders.", result: "compare orders" } ] },

  // ───────────────────────── tree-dfs (completes → 25/25) ─────────────────────────
  java_m35_t2_ex_11: { kind: "tree", label: "Tree Problems Synthesis", ...btree([1, 2, 3, 4, 5]), steps: [
    { cls: cls(["0", "current"]), note: "Most tree problems = a DFS returning info upward (height, sum, count, bool)." },
    { cls: cls(["3", "match"], ["4", "match"], ["1", "match"]), note: "Combine children results at each node.", result: "the recipe" } ] },
  java_m35_t2_ex_12: { kind: "tree", label: "M35 T2 Synthesis", ...btree([5, 3, 8, 1, 4]), steps: [
    { cls: cls(["0", "current"]), note: "Post-order when a node needs its children's answers first." },
    { cls: cls(["3", "match"], ["4", "match"], ["1", "match"], ["0", "match"]), note: "Pass state down via params, bubble results up via return.", result: "bottom-up DFS" } ] },
  java_m35_t2_ex_13: { kind: "tree", label: "Build Tree from Preorder+Inorder (#105)", ...btree([3, 9, 20, null, null, 15, 7]), steps: [
    { cls: cls(["0", "match"]), note: "Pre-order[0] = root; find it in in-order to split left/right sizes." },
    { cls: cls(["1", "match"], ["2", "match"], ["5", "match"], ["6", "match"]), note: "Recurse on each side (HashMap of in-order indices → O(n)).", result: "reconstructed" } ] },
  java_m35_t4_ex_10: { kind: "tree", label: "Pseudo-Palindromic Paths (#1457)", ...btree([2, 3, 3, 1, 1, null, 1]), steps: [
    { cls: cls(["0", "current"]), note: "Track digit-parity bitmask down each root→leaf path (XOR each value's bit)." },
    { cls: cls(["3", "match"], ["4", "match"], ["6", "match"]), note: "Palindromic ⇔ at most one bit set at the leaf.", result: "count" } ] },
  java_m35_t4_ex_11: { kind: "tree", label: "Path Problems Synthesis", ...btree([1, 2, 3, 4, 5]), steps: [
    { cls: cls(["0", "current"]), note: "Root→leaf paths vs any-node→any-node (the 'through node' trick)." },
    { cls: cls(["3", "path"], ["1", "path"], ["4", "path"]), note: "Return one-side max upward; combine both sides for the answer.", result: "path patterns" } ] },
  java_m35_t4_ex_12: { kind: "tree", label: "M35 T4 Path Synthesis", ...btree([10, 5, -3, 3, 2]), steps: [
    { cls: cls(["0", "current"]), note: "Prefix-sum HashMap counts paths summing to target (downward only)." },
    { cls: cls(["1", "match"], ["3", "match"]), note: "Max-path-sum returns best single branch, considers both at the node.", result: "the toolkit" } ] },
  java_m35_t4_ex_3: { kind: "tree", label: "Max Path Sum (#124)", ...btree([1, 2, 3]), steps: [
    { cls: cls(["1", "current"], ["2", "current"]), note: "At each node: gain = max(0, child gain); candidate = node + leftGain + rightGain." },
    { cls: cls(["1", "path"], ["0", "path"], ["2", "path"]), note: "Return node + max(one side) upward. Track global best.", result: "6" } ] },
  java_m35_t4_ex_6: { kind: "tree", label: "Max Path Sum with Negatives", ...btree([-10, 9, 20, null, null, 15, 7]), steps: [
    { cls: cls(["5", "current"], ["6", "current"]), note: "Clamp negative child gains to 0 (don't include a hurtful branch)." },
    { cls: cls(["5", "path"], ["2", "path"], ["6", "path"]), note: "Best here = 15+20+7 = 42, beating any path through −10.", result: "42" } ] },
  java_m35_t4_ex_7: { kind: "tree", label: "Good Nodes (#1448)", ...btree([3, 1, 4, 3, null, 1, 5]), steps: [
    { cls: cls(["0", "current"]), note: "Carry the max-on-path downward; a node is 'good' if value ≥ that max." },
    { cls: cls(["0", "match"], ["2", "match"], ["3", "match"], ["6", "match"]), note: "Count good nodes during DFS.", result: "4" } ] },
  java_m35_t4_ex_8: { kind: "tree", label: "All Root→Leaf Paths with Sum", ...btree([5, 4, 8, 11, null, 13, 4]), steps: [
    { cls: cls(["0", "current"]), note: "DFS, subtract node value from the remaining target along the path." },
    { cls: cls(["0", "match"], ["1", "match"], ["3", "match"]), note: "At a leaf with remaining == 0 → record the path. Backtrack the list.", result: "matching paths" } ] },
  java_m35_t4_ex_9: { kind: "tree", label: "Path Sum III — any node to any (#437)", ...btree([10, 5, -3, 3, 2, null, 11]), steps: [
    { cls: cls(["0", "current"]), note: "Running prefix sum + HashMap of counts; paths needn't start at root." },
    { cls: cls(["1", "match"], ["3", "match"], ["6", "match"]), note: "At each node, add count of (prefix − target) seen above. O(n).", result: "path count" } ] },

  // ───────────────────────── bst (completes → 12/12) ─────────────────────────
  java_m35_t3_ex_6: { kind: "tree", label: "BST Delete (#450)", ...btree([5, 3, 8, 2, 4, null, 9]), steps: [
    { cls: cls(["0", "current"]), note: "Find node. 0/1 child → splice out. Two children → replace with in-order successor." },
    { cls: cls(["4", "match"]), note: "Then delete that successor (it has ≤ 1 child).", result: "BST preserved" } ] },
  java_m35_t3_ex_7: { kind: "tree", label: "Sorted Array → BST (#108)", ...btree([4, 2, 6, 1, 3, 5, 7]), steps: [
    { cls: cls(["0", "match"]), note: "Pick the MIDDLE element as root → balanced." },
    { cls: cls(["1", "match"], ["2", "match"]), note: "Recurse on left half and right half. Height-balanced, O(n).", result: "balanced BST" } ] },
  java_m35_t3_ex_8: { kind: "tree", label: "BST Iterator (#173)", ...btree([7, 3, 15, null, null, 9, 20]), steps: [
    { cls: cls(["1", "current"]), note: "Stack holds the leftmost spine; next() pops, then pushes its right subtree's left spine." },
    { cls: cls(["1", "match"], ["0", "match"], ["5", "match"]), note: "next()/hasNext() amortised O(1), O(h) space.", result: "sorted on demand" } ] },
  java_m35_t3_ex_9: { kind: "tree", label: "BST → Greater Sum Tree (#538)", ...btree([4, 1, 6, 0, 2, 5, 7]), steps: [
    { cls: cls(["6", "current"]), note: "Reverse in-order (right, node, left) with a running suffix sum." },
    { cls: cls(["2", "match"], ["0", "match"]), note: "Each node += sum of all greater keys.", result: "greater-sum tree" } ] },
  java_m35_t3_ex_10: { kind: "tree", label: "Recover BST (#99)", ...btree([3, 1, 4, null, null, 2]), steps: [
    { cls: cls(["2", "current"], ["5", "current"]), note: "In-order should be sorted; two swapped nodes create one or two 'dips'." },
    { cls: cls(["2", "match"], ["5", "match"]), note: "Find the two offenders, swap their values back. O(1) space (Morris).", result: "BST restored" } ] },
  java_m35_t3_ex_11: { kind: "tree", label: "BST Synthesis", ...btree([5, 3, 8, 2, 4, 7, 9]), steps: [
    { cls: cls(["0", "current"]), note: "BST invariant: left < node < right → in-order = sorted." },
    { cls: cls(["3", "match"], ["1", "match"], ["4", "match"], ["0", "match"]), note: "Search/insert/delete in O(h); validate via in-order.", result: "the toolkit" } ] },
  java_m35_t3_ex_12: { kind: "tree", label: "M35 T3 BST Synthesis", ...btree([6, 4, 8, 3, 5, 7, 9]), steps: [
    { cls: cls(["0", "current"]), note: "Use the ordering: kth-smallest = in-order index; range queries prune subtrees." },
    { cls: cls(["3", "match"], ["1", "match"], ["4", "match"]), note: "Balanced BST keeps h = O(log n).", result: "BST mastery" } ] },

  // ───────────────────────── trie (completes → 11/11) ─────────────────────────
  java_m35_t5_ex_11: { kind: "tree", label: "Trie Synthesis", nodes: [{ id: 0, v: "·", x: 190, y: 26 }, { id: 1, v: "c", x: 110, y: 86 }, { id: 2, v: "a", x: 110, y: 146 }, { id: 3, v: "t✓", x: 60, y: 200 }, { id: 4, v: "r✓", x: 160, y: 200 }], edges: [[0, 1], [1, 2], [2, 3], [2, 4]], W, H: 224, steps: [
    { cls: cls(["0", "current"]), note: "Each edge = a character; nodes share common prefixes (c-a-t, c-a-r)." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "'isEnd' flag marks a complete word. insert/search/startsWith = O(len).", result: "prefix tree" } ] },

  // ───────────────────────── binary-search-on-answer (completes → 7/7) ─────────────────────────
  java_m39_t2_ex_5: { kind: "array-pointers", label: "Median of Two Sorted Arrays (#4)", array: [1, 3, 8, 9, 15], meta: { B: "[7,11,18,19,21,25]" }, steps: [
    { pointers: { lo: 0, hi: 5 }, note: "Binary-search a partition of the SMALLER array so left halves = right halves in size." },
    { mark: { 2: "match" }, note: "Valid when maxLeftA ≤ minRightB and maxLeftB ≤ minRightA. O(log min(m,n)).", result: "median" } ] },
  java_m39_t2_ex_6: { kind: "array-pointers", label: "Median of Two Sorted Arrays (#4)", array: [1, 2, 3, 4, 5], meta: { B: "[6,7,8,9,10]" }, steps: [
    { pointers: { lo: 0, hi: 5 }, note: "Partition both so #left == #right (±1); shrink the search on A's cut." },
    { mark: { 4: "match" }, note: "Median from the boundary values once partition is valid.", result: "5.5" } ] },
  java_m39_t2_ex_8: { kind: "array-pointers", label: "Split Array Largest Sum (#410)", array: [7, 2, 5, 10, 8], meta: { k: 2 }, steps: [
    { pointers: { lo: 10, hi: 32 }, note: "Binary-search the ANSWER (max subarray sum) in [max, total]." },
    { mark: { 0: "match", 1: "match", 2: "match" }, note: "Feasible(mid)= can we split into ≤ k parts each ≤ mid? Greedy check.", result: "18" } ] },
  java_m39_t2_ex_9: { kind: "array-pointers", label: "Capacity to Ship in D Days (#1011)", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], meta: { days: 5 }, steps: [
    { pointers: { lo: 10, hi: 55 }, note: "Binary-search capacity in [max weight, total weight]." },
    { mark: { 8: "match", 9: "match" }, note: "Feasible(cap)= greedily count days needed ≤ D? Smallest feasible cap wins.", result: "15" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-21: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
