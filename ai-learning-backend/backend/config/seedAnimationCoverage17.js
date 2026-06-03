/**
 * seedAnimationCoverage17.js — GAP #1 animation, BIG batch 17 (~42).
 * Completes monotonic-stack / topo-sort / shortest-path / graph / trie /
 * binary-search; chips matrix/heap/tree-dfs. Existing renderers, data-only.
 * Idempotent. Verify: auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const n = (id, v, x, y) => ({ id, v, x, y });
const cls = (...p) => Object.fromEntries(p);
// hand-placed 4-node graph
const G4 = { W: 340, H: 150, nodes: [n(0, "0", 70, 60), n(1, "1", 200, 40), n(2, "2", 200, 120), n(3, "3", 310, 80)], edges: [[0, 1], [0, 2], [1, 3], [2, 3]] };
// hand-placed trie cat/car/card
const TRIE = { W: 360, H: 180, nodes: [n(0, "•", 60, 90), n(1, "c", 130, 90), n(2, "a", 200, 90), n(3, "t", 280, 50), n(4, "r", 280, 130), n(5, "d", 330, 130)], edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]] };

const A = {
  // monotonic-stack (completes)
  java_m33_t2_ex_13: { kind: "stack", label: "132 Pattern (#456)", array: [3, 1, 4, 2], steps: [
    { cursor: 2, stack: [{ v: 4, i: 2 }], note: "Scan right→left; stack of potential '2's; track the max '2' popped (the '3' candidate)." },
    { cursor: 0, stack: [{ v: 4, i: 2 }], note: "If a current value < that max-popped → found i<j<k with a[i]<a[k]<a[j].", result: "true" } ] },
  java_m33_t2_ex_11: { kind: "stack", label: "Monotonic-Stack Recap", array: [2, 1, 4, 3], outLabel: "next greater", steps: [
    { cursor: 2, stack: [{ v: 1, i: 1 }], note: "One mechanic powers them all: keep a monotonic stack, pop on the triggering comparison." },
    { cursor: 3, stack: [{ v: 3, i: 3 }], output: [4, 4, -1, -1], note: "Next-Greater, Histogram, Trapping Rain, Stock Span — same skeleton.", result: "pattern" } ] },
  java_m33_t2_ex_12: { kind: "stack", label: "Monotonic-Stack Synthesis", array: [73, 74, 75, 71, 76], outLabel: "days", steps: [
    { cursor: 1, stack: [{ v: 74, i: 1 }], output: [1, 0, 0, 0, 0], note: "Pick increasing vs decreasing stack by what you're searching for." },
    { cursor: 4, stack: [{ v: 76, i: 4 }], output: [1, 1, 1, 1, 0], note: "Each index pushed/popped once → O(n).", result: "O(n)" } ] },

  // topological-sort (completes)
  java_m37_t3_ex_3: { kind: "tree", label: "Topo Sort — DFS post-order", ...G4, steps: [
    { cls: cls(["0", "current"]), note: "DFS; push a node to a stack AFTER all its descendants finish." },
    { cls: cls(["3", "visited"], ["1", "visited"], ["2", "visited"], ["0", "match"]), note: "Reverse the finish stack = topological order.", result: "0 1 2 3" } ] },
  java_m37_t3_ex_4: { kind: "tree", label: "Course Schedule (#207)", ...G4, steps: [
    { cls: cls(["0", "current"]), note: "Kahn's: queue 0-indegree, process, decrement neighbors." },
    { cls: cls(["0", "visited"], ["1", "visited"], ["2", "visited"], ["3", "match"]), note: "canFinish = processed count == n (no cycle).", result: "true" } ] },
  java_m37_t3_ex_5: { kind: "tree", label: "Course Schedule II (#210)", ...G4, outLabel: "order", steps: [
    { cls: cls(["0", "current"]), output: [0], note: "Same Kahn's BFS, but record the processing order." },
    { cls: cls(["3", "match"]), output: [0, 1, 2, 3], note: "Empty if a cycle exists.", result: "[0,1,2,3]" } ] },
  java_m37_t3_ex_6: { kind: "tree", label: "Topo Sort Synthesis", ...G4, steps: [
    { cls: cls(["0", "current"]), note: "Kahn's (BFS, indegree) or DFS post-order — both O(V+E)." },
    { cls: cls(["0", "match"]), note: "Cycle ⇒ no valid ordering. Used in build systems, scheduling.", result: "DAG order" } ] },

  // shortest-path (completes)
  java_m37_t4_ex_3: { kind: "tree", label: "Floyd-Warshall (all-pairs)", ...G4, steps: [
    { cls: cls(["0", "current"]), note: "dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]) over every intermediate k." },
    { cls: cls(["3", "match"]), note: "Triple loop → O(V³); handles negative edges (no negative cycles).", result: "all-pairs distances" } ] },
  java_m37_t4_ex_4: { kind: "tree", label: "Network Delay Time (#743)", ...G4, steps: [
    { cls: cls(["0", "source"]), note: "Dijkstra from the source node." },
    { cls: cls(["1", "visited"], ["2", "visited"], ["3", "match"]), note: "Answer = max settled distance (time for all to receive).", result: "max dist" } ] },
  java_m37_t4_ex_5: { kind: "tree", label: "Path with Max Probability (#1514)", ...G4, steps: [
    { cls: cls(["0", "source"]), note: "Dijkstra variant: maximize product of edge probabilities (max-heap)." },
    { cls: cls(["3", "match"]), note: "Relax with prob[u]*w instead of dist[u]+w.", result: "max probability" } ] },
  java_m37_t4_ex_13: { kind: "tree", label: "Shortest Path Synthesis", ...G4, steps: [
    { cls: cls(["0", "source"]), note: "Dijkstra (no neg, O((V+E)logV)) · Bellman-Ford (neg ok) · Floyd (all-pairs)." },
    { cls: cls(["3", "match"]), note: "Pick by graph properties.", result: "choose the right one" } ] },

  // graph-traversal (completes)
  java_m37_t1_ex_5: { kind: "tree", label: "DFS Iterative (explicit stack)", ...G4, outLabel: "order", steps: [
    { cls: cls(["0", "current"]), output: [0], note: "Push start; pop, mark visited, push unvisited neighbors." },
    { cls: cls(["3", "match"]), output: [0, 2, 3, 1], note: "Stack replaces recursion (avoids overflow).", result: "DFS order" } ] },
  java_m37_t1_ex_7: { kind: "tree", label: "Cycle Detection (undirected)", ...G4, steps: [
    { cls: cls(["0", "current"]), note: "DFS tracking the parent; a visited neighbor that isn't the parent = cycle." },
    { cls: cls(["1", "match"], ["3", "match"], ["2", "match"]), note: "0-1-3-2-0 forms a cycle.", result: "cycle found" } ] },
  java_m37_t2_ex_6: { kind: "tree", label: "Clone Graph (#133)", ...G4, steps: [
    { cls: cls(["0", "current"]), note: "DFS/BFS; map original→clone to avoid re-cloning and handle cycles." },
    { cls: cls(["0", "visited"], ["1", "visited"], ["2", "visited"], ["3", "match"]), note: "Wire clone neighbors from the map.", result: "deep copy" } ] },
  java_m37_t1_ex_8: { kind: "tree", label: "Path Exists in Graph (#1971)", ...G4, steps: [
    { cls: cls(["0", "source"]), note: "BFS/DFS (or union-find) from source; stop when target is reached." },
    { cls: cls(["0", "visited"], ["2", "visited"], ["3", "match"]), note: "Reachable ⇒ true.", result: "true" } ] },
  java_m37_t2_ex_7: { kind: "tree", label: "Evaluate Division (#399)", ...G4, steps: [
    { cls: cls(["0", "source"]), note: "Weighted graph: a/b is an edge of weight a/b. DFS multiplying weights along the path." },
    { cls: cls(["3", "match"]), note: "Product along path = the query; −1 if disconnected.", result: "ratio" } ] },
  java_m37_t2_ex_8: { kind: "grid", label: "Pacific Atlantic Water Flow (#417)", grid: [[1, 2, 2], [3, 2, 3], [2, 4, 5]], steps: [
    { cls: cls(["0,0", "source"]), note: "DFS inward from BOTH oceans' borders (uphill: neighbor ≥ current)." },
    { cls: cls(["1,2", "path"], ["2,1", "path"], ["2,2", "path"]), note: "Cells reachable from both oceans = answer.", result: "both-ocean cells" } ] },

  // trie (completes; hand-placed prefix tree)
  java_m35_t5_ex_3: { kind: "tree", label: "Trie Autocomplete (prefix)", ...TRIE, steps: [
    { cls: cls(["0", "visited"], ["1", "visited"], ["2", "visited"]), note: "Walk to the prefix node, then DFS to collect all words below it." },
    { cls: cls(["3", "match"], ["4", "match"], ["5", "match"]), note: "Prefix \"ca\" → cat, car, card.", result: "suggestions" } ] },
  java_m35_t5_ex_4: { kind: "tree", label: "Replace Words (#648)", ...TRIE, steps: [
    { cls: cls(["1", "visited"], ["2", "visited"], ["4", "match"]), note: "For each word, walk the trie and stop at the first root (end node)." },
    { note: "Replace with the shortest matching prefix.", result: "shortened sentence" } ] },
  java_m35_t5_ex_5: { kind: "tree", label: "Word Search II (#212)", ...TRIE, steps: [
    { cls: cls(["0", "current"]), note: "Build a trie of all words; DFS the grid, walking the trie in lockstep." },
    { cls: cls(["3", "match"]), note: "Prune branches not present in the trie → far faster than per-word search.", result: "found words" } ] },
  java_m35_t5_ex_6: { kind: "tree", label: "Add & Search Word (#211)", ...TRIE, steps: [
    { cls: cls(["1", "visited"], ["2", "visited"]), note: "'.' wildcard → try ALL children at that level (DFS branch)." },
    { cls: cls(["3", "match"], ["4", "match"]), note: "Regular chars walk one path.", result: "match with wildcards" } ] },
  java_m35_t5_ex_7: { kind: "tree", label: "Longest Word in Dictionary (#720)", ...TRIE, steps: [
    { cls: cls(["1", "visited"], ["2", "visited"], ["4", "visited"], ["5", "match"]), note: "DFS only through nodes that are themselves word-ends (buildable one char at a time)." },
    { note: "Track the longest (lexicographically smallest on ties).", result: "longest buildable word" } ] },
  java_m35_t5_ex_8: { kind: "tree", label: "Map Sum Pairs (#677)", ...TRIE, steps: [
    { cls: cls(["1", "visited"], ["2", "visited"]), note: "Store values at end nodes; sum all values under a prefix." },
    { cls: cls(["3", "match"], ["4", "match"], ["5", "match"]), note: "DFS from the prefix node, accumulating.", result: "prefix sum" } ] },
  java_m35_t5_ex_9: { kind: "tree", label: "Maximum XOR (#421, bit-trie)", ...TRIE, steps: [
    { cls: cls(["0", "current"]), note: "Insert numbers as 32-bit paths; for each, greedily go the OPPOSITE bit to maximize XOR." },
    { cls: cls(["3", "match"]), note: "O(n·32).", result: "max pairwise XOR" } ] },
  java_m35_t5_ex_10: { kind: "tree", label: "Trie Synthesis", ...TRIE, steps: [
    { cls: cls(["1", "visited"], ["2", "visited"]), note: "Trie = children[26] + isEnd. insert/search/startsWith all O(word length)." },
    { cls: cls(["3", "match"], ["4", "match"], ["5", "match"]), note: "Autocomplete, word search, XOR — same structure.", result: "prefix power" } ] },

  // binary-search (completes)
  java_m39_t4_ex_2: { kind: "grid", label: "Search a 2D Matrix (#74)", grid: [[1, 3, 5], [7, 9, 11], [13, 15, 17]], steps: [
    { cursor: [1, 1], cls: cls(["1,1", "frontier"]), note: "Row-major sorted → binary search as if flattened; mid via /cols, %cols." },
    { cursor: [0, 2], cls: cls(["0,2", "path"]), note: "Found.", result: "true" } ] },
  java_m39_t4_ex_3: { kind: "grid", label: "Search 2D Matrix II (#240)", grid: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], steps: [
    { cursor: [0, 2], cls: cls(["0,2", "frontier"]), note: "Start top-right: smaller → left, larger → down." },
    { cursor: [1, 1], cls: cls(["1,1", "path"]), note: "O(m+n).", result: "true" } ] },
  java_m39_t4_ex_4: { kind: "array-pointers", label: "Kth Smallest in Matrix (#378)", array: [1, 5, 9, 10, 11, 12, 13, 13, 15], steps: [
    { pointers: { lo: 0, mid: 4, hi: 8 }, note: "Binary search on the VALUE range; count elements ≤ mid (matrix is row/col sorted)." },
    { pointers: { lo: 2, mid: 3, hi: 4 }, mark: { 3: "match" }, note: "Shrink to the smallest value with count ≥ k.", result: "kth smallest" } ] },
  java_m39_t5_ex_2: { kind: "array-pointers", label: "Binary Search Synthesis", array: [1, 3, 5, 7, 9, 11], steps: [
    { pointers: { lo: 0, mid: 2, hi: 5 }, note: "Classic · first/last · search-on-answer · rotated · 2D — all are 'halve a monotone space'." },
    { pointers: { lo: 3, mid: 3, hi: 3 }, mark: { 3: "match" }, note: "Define the predicate, then bisect.", result: "O(log n)" } ] },
  java_m39_t1_ex_6: { kind: "array-pointers", label: "First & Last Position (#34)", array: [5, 7, 7, 8, 8, 10], steps: [
    { pointers: { lo: 3 }, mark: { 3: "match" }, note: "Leftmost: on match go left." },
    { pointers: { hi: 4 }, mark: { 3: "match", 4: "match" }, note: "Rightmost: on match go right.", result: "[3,4]" } ] },

  // matrix (chip)
  java_m30_5_t3_ex_5: { kind: "grid", label: "Edit Distance (#72)", grid: [["·", "ε", "c", "u", "t"], ["ε", 0, 1, 2, 3], ["c", 1, 0, 1, 2], ["a", 2, 1, 1, 2], ["t", 3, 2, 2, 1]], steps: [
    { cursor: [4, 4], note: "Match → copy diagonal; else 1 + min(insert ←, delete ↑, replace ↖)." },
    { cls: cls(["4,4", "path"]), note: "Bottom-right = min edits.", result: "1" } ] },
  java_m30_5_t3_ex_6: { kind: "grid", label: "LCS (#1143)", grid: [["·", "ε", "a", "c"], ["ε", 0, 0, 0], ["a", 0, 1, 1], ["b", 0, 1, 1], ["c", 0, 1, 2]], steps: [
    { cursor: [4, 3], note: "Match → diag+1; else max(up, left)." },
    { cls: cls(["4,3", "path"]), note: "Corner = LCS length.", result: "2" } ] },
  java_m30_5_t5_ex_3: { kind: "grid", label: "Game of Life (#289)", grid: [[0, 1, 0], [0, 1, 0], [0, 1, 0]], steps: [
    { cls: cls(["1,1", "current"]), note: "Each cell's next state from its 8 neighbors; encode old→new in-place (2 bits)." },
    { grid: [[0, 0, 0], [1, 1, 1], [0, 0, 0]], note: "Apply all simultaneously, then decode.", result: "blinker flips" } ] },
  java_m30_5_t4_ex_3: { kind: "grid", label: "Search 2D Matrix — flattened (#74)", grid: [[1, 3, 5], [7, 9, 11]], steps: [
    { cursor: [1, 0], cls: cls(["1,0", "frontier"]), note: "Treat the fully-sorted matrix as one array of length m·n." },
    { cls: cls(["1,0", "path"]), note: "idx → (idx/cols, idx%cols).", result: "binary search" } ] },

  // heap (chip)
  java_m36_t1_ex_9: { kind: "tree", label: "Task Scheduler (#621)", ...{ W: 300, H: 120, nodes: [n(0, "A:3", 80, 50), n(1, "B:1", 200, 50)], edges: [] }, steps: [
    { cls: cls(["0", "current"]), note: "Max-heap by remaining count; run the most frequent task, then cool down." },
    { cls: cls(["0", "match"]), note: "Or compute idle = (maxFreq−1)*(n+1)+maxCount directly.", result: "min intervals" } ] },
  java_m36_t2_ex_6: { kind: "tree", label: "Sliding Window Median (#480)", ...{ W: 300, H: 120, nodes: [n(0, "2", 100, 50), n(1, "1", 200, 50)], edges: [] }, steps: [
    { cls: cls(["0", "current"]), note: "Two heaps over the window; lazily delete elements leaving the window." },
    { cls: cls(["0", "match"]), note: "Median from the heap tops as the window slides.", result: "medians" } ] },
  java_m36_t2_ex_4: { kind: "tree", label: "Smallest Range K Lists (#632)", ...{ W: 300, H: 120, nodes: [n(0, "1", 80, 50), n(1, "2", 160, 50), n(2, "3", 240, 50)], edges: [] }, steps: [
    { cls: cls(["0", "current"]), note: "Min-heap of one element per list + track current max; pop min, push that list's next." },
    { cls: cls(["0", "match"]), note: "Range = max − heap.min; minimize across steps.", result: "smallest range" } ] },

  // tree-dfs (chip)
  java_m35_t4_ex_4: { kind: "tree", label: "Sum Root to Leaf Numbers (#129)", ...{ W: 360, H: 150, nodes: [n(0, "1", 180, 30), n(1, "2", 100, 90), n(2, "3", 260, 90)], edges: [[0, 1], [0, 2]] }, steps: [
    { cls: cls(["0", "path"], ["1", "match"]), note: "Carry the number built so far: num = num*10 + node.val." },
    { cls: cls(["0", "path"], ["2", "match"]), note: "Sum at each leaf: 12 + 13 = 25.", result: "25" } ] },
  java_m35_t4_ex_5: { kind: "tree", label: "Path Sum III (#437)", ...{ W: 360, H: 150, nodes: [n(0, "10", 180, 30), n(1, "5", 100, 90), n(2, "-3", 260, 90)], edges: [[0, 1], [0, 2]] }, steps: [
    { cls: cls(["0", "current"]), note: "Prefix-sum map during DFS: count how many earlier prefixes equal (current − target)." },
    { cls: cls(["1", "match"]), note: "Paths need not start at root; undo the map entry on the way back.", result: "path count" } ] },
  java_m35_t2_ex_5: { kind: "tree", label: "Binary Tree Cameras (#968)", ...{ W: 360, H: 150, nodes: [n(0, "0", 180, 30), n(1, "0", 100, 90), n(2, "0", 260, 90)], edges: [[0, 1], [0, 2]] }, steps: [
    { cls: cls(["1", "match"], ["2", "match"]), note: "Greedy post-order: place a camera at a parent of any uncovered leaf." },
    { cls: cls(["0", "current"]), note: "States: needs-cover / has-camera / covered.", result: "min cameras" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-17: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
