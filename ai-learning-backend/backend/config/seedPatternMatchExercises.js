/**
 * seedPatternMatchExercises — seed 20 pattern_match exercises across
 * M30 (arrays), M33 (stacks/queues), M37 (graphs), M41 (DP).
 *
 * Exercise shape for pattern_match:
 *   blanks:    [{ options: [patternId, ...] }]   — returned to client
 *   testCases: [{ type: "pattern_match",
 *                 correct: patternId,
 *                 explanation: "..." }]           — server-only
 *
 * The learner picks from blanks[0].options; backend compares to testCases[0].correct.
 *
 * Usage: node config/seedPatternMatchExercises.js
 * npm:   npm run seed:pattern-match
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProExercise } from "../models/proModels.js";

const TRACK = "pro_java";

function pm({ exerciseId, topicId, moduleId, level = "easy", title, scenario, instructions = "", hints = [], options, correct, explanation, xpReward = 15 }) {
  return {
    trackKey:  TRACK,
    moduleId,
    topicId,
    exerciseId,
    position:  99,
    level,
    type:      "pattern_match",
    title,
    scenario,
    instructions,
    starterCode: "",
    expectedSolution: correct,
    hints,
    blanks:    [{ options }],
    testCases: [{ type: "pattern_match", correct, explanation }],
    xpReward,
    difficulty: level === "warmup" ? 0.1 : level === "easy" ? 0.2 : level === "medium" ? 0.4 : 0.6,
  };
}

const EXERCISES = [
  // ── M30: DSA2 — Array Patterns ─────────────────────────────────────────────
  pm({
    exerciseId: "java_m30_t1_pm_1",
    topicId:    "java_m30_t1",
    moduleId:   "java_m30",
    level:      "warmup",
    title:      "Two-sum on a sorted array",
    scenario:   "Given a sorted array of integers and a target value, determine if any two distinct elements sum to the target. O(n) time, O(1) space required.",
    hints:      ["Start with one pointer at each end of the array."],
    options:    ["two_pointer", "sliding_window", "hash_map", "binary_search"],
    correct:    "two_pointer",
    explanation: "Two sorted pointers (left and right) close in based on whether the current sum is too low or too high — O(n) time, O(1) space. A hash map also works but costs O(n) extra space.",
  }),
  pm({
    exerciseId: "java_m30_t2_pm_1",
    topicId:    "java_m30_t2",
    moduleId:   "java_m30",
    level:      "easy",
    title:      "Max sum subarray of size K",
    scenario:   "Given an integer array and a number K, find the maximum sum of any contiguous subarray of exactly K elements.",
    hints:      ["Maintain a running sum — add the incoming element and drop the outgoing one."],
    options:    ["sliding_window", "prefix_sum", "two_pointer", "dynamic_programming"],
    correct:    "sliding_window",
    explanation: "A fixed-size window slides across the array: subtract the element leaving the left and add the element entering the right — O(n) with O(1) space.",
  }),
  pm({
    exerciseId: "java_m30_t3_pm_1",
    topicId:    "java_m30_t3",
    moduleId:   "java_m30",
    level:      "medium",
    title:      "Count subarrays summing to K",
    scenario:   "Given an integer array (can contain negatives) and integer K, count the total number of contiguous subarrays whose elements sum to K.",
    hints:      ["Track how many times each running sum has been seen."],
    options:    ["prefix_sum", "sliding_window", "two_pointer", "hash_map"],
    correct:    "prefix_sum",
    explanation: "Build a running prefix sum. For each index i, the count of subarrays ending at i with sum K equals the frequency of (prefixSum[i] - K) in a hash map of previous prefix sums — O(n).",
  }),
  pm({
    exerciseId: "java_m30_t1_pm_2",
    topicId:    "java_m30_t1",
    moduleId:   "java_m30",
    level:      "easy",
    title:      "Remove duplicates in-place",
    scenario:   "Given a sorted array, remove duplicates in-place so each element appears only once and return the new length. You must not allocate extra space for another array.",
    hints:      ["One pointer marks where the next unique element should go."],
    options:    ["two_pointer", "hash_map", "sliding_window", "binary_search"],
    correct:    "two_pointer",
    explanation: "A slow pointer marks the write position; a fast pointer scans for the next unique value. When found, write it at the slow pointer and advance both — O(n) time, O(1) space.",
  }),
  pm({
    exerciseId: "java_m30_t4_pm_1",
    topicId:    "java_m30_t4",
    moduleId:   "java_m30",
    level:      "easy",
    title:      "Move zeros to the end",
    scenario:   "Given an array, move all zeros to the end while maintaining the relative order of non-zero elements. Do it in-place with O(1) extra space.",
    hints:      ["Track the next position a non-zero element should occupy."],
    options:    ["two_pointer", "sliding_window", "prefix_sum", "greedy"],
    correct:    "two_pointer",
    explanation: "One pointer scans for non-zeros; another marks the next write slot. Swap non-zeros to the front — O(n) time, O(1) space.",
  }),

  // ── M33: DSA5 — Stacks & Queues ────────────────────────────────────────────
  pm({
    exerciseId: "java_m33_t1_pm_1",
    topicId:    "java_m33_t1",
    moduleId:   "java_m33",
    level:      "easy",
    title:      "Next greater element",
    scenario:   "For each element in an unsorted array, find the next element to its right that is strictly greater. Return -1 if no such element exists.",
    hints:      ["Maintain a stack of 'waiting' elements — ones that haven't found their answer yet."],
    options:    ["monotonic_stack", "two_pointer", "bfs", "hash_map"],
    correct:    "monotonic_stack",
    explanation: "Maintain a decreasing stack. When you encounter a larger element, pop and record 'next greater' for each popped element — O(n) time, O(n) space.",
  }),
  pm({
    exerciseId: "java_m33_t2_pm_1",
    topicId:    "java_m33_t2",
    moduleId:   "java_m33",
    level:      "medium",
    title:      "Sliding window maximum",
    scenario:   "Given an array and window size K, return an array of the maximum element in each sliding window as the window moves one step at a time.",
    hints:      ["You need O(n) — a heap gives O(n log n). Think deque."],
    options:    ["monotonic_stack", "sliding_window", "two_pointer", "binary_search"],
    correct:    "monotonic_stack",
    explanation: "Use a monotonic deque (decreasing). Remove elements out of the window from the front; remove elements smaller than the new element from the back. The front always holds the window max — O(n).",
  }),
  pm({
    exerciseId: "java_m33_t3_pm_1",
    topicId:    "java_m33_t3",
    moduleId:   "java_m33",
    level:      "easy",
    title:      "Shortest path in unweighted grid",
    scenario:   "Given a 2D grid where 0=open and 1=blocked, find the minimum number of steps from the top-left cell to the bottom-right cell. Return -1 if no path exists.",
    hints:      ["You need the shortest path, not just any path."],
    options:    ["bfs", "dfs", "dynamic_programming", "greedy"],
    correct:    "bfs",
    explanation: "BFS explores all cells at distance d before moving to d+1, guaranteeing the first time you reach the destination is via the shortest path — O(m×n).",
  }),
  pm({
    exerciseId: "java_m33_t1_pm_2",
    topicId:    "java_m33_t1",
    moduleId:   "java_m33",
    level:      "easy",
    title:      "Valid parentheses",
    scenario:   "Given a string containing only '(', ')', '{', '}', '[', ']', determine if it is valid. A string is valid if every opening bracket has a corresponding closing bracket in correct order.",
    hints:      ["You need to remember the most recently opened bracket."],
    options:    ["monotonic_stack", "two_pointer", "hash_map", "greedy"],
    correct:    "monotonic_stack",
    explanation: "Use a plain stack — push on '(' / '{' / '[', pop and compare on ')' / '}' / ']'. The stack naturally tracks nesting order — O(n).",
  }),
  pm({
    exerciseId: "java_m33_t4_pm_1",
    topicId:    "java_m33_t4",
    moduleId:   "java_m33",
    level:      "medium",
    title:      "Level-order tree traversal",
    scenario:   "Given the root of a binary tree, return all node values level by level (left to right). Each level's values should be in their own sublist.",
    hints:      ["You need to process nodes in the order they were discovered."],
    options:    ["bfs", "dfs", "monotonic_stack", "divide_and_conquer"],
    correct:    "bfs",
    explanation: "BFS via a queue processes nodes level by level. After processing one level, all nodes of the next level are already queued — O(n).",
  }),

  // ── M37: DSA9 — Graphs ─────────────────────────────────────────────────────
  pm({
    exerciseId: "java_m37_t1_pm_1",
    topicId:    "java_m37_t1",
    moduleId:   "java_m37",
    level:      "easy",
    title:      "Count islands",
    scenario:   "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent land cells horizontally or vertically.",
    hints:      ["Sink each island as you discover it so you don't count it twice."],
    options:    ["dfs", "union_find", "bfs", "dynamic_programming"],
    correct:    "dfs",
    explanation: "For each unvisited '1', DFS to mark all connected land as visited and count +1 island. Both DFS and BFS work — DFS is typically simpler to write recursively — O(m×n).",
  }),
  pm({
    exerciseId: "java_m37_t3_pm_1",
    topicId:    "java_m37_t3",
    moduleId:   "java_m37",
    level:      "medium",
    title:      "Course schedule feasibility",
    scenario:   "There are n courses (0 to n-1). Some courses have prerequisites. Determine if it is possible to finish all courses (i.e., no circular dependencies exist).",
    hints:      ["Model courses as nodes and prerequisites as directed edges."],
    options:    ["topological_sort", "dfs", "union_find", "bfs"],
    correct:    "topological_sort",
    explanation: "Model as a directed graph. Apply Kahn's algorithm (BFS) or DFS with cycle detection. A cycle means you can never satisfy all prerequisites — O(V+E).",
  }),
  pm({
    exerciseId: "java_m37_t4_pm_1",
    topicId:    "java_m37_t4",
    moduleId:   "java_m37",
    level:      "medium",
    title:      "Cheapest flights within K stops",
    scenario:   "Find the cheapest price to fly from source to destination with at most K stops. Return -1 if no such route exists. (Edges have weights — flight costs.)",
    hints:      ["Standard shortest-path algorithms don't enforce a 'max stops' constraint easily."],
    options:    ["dynamic_programming", "bfs", "greedy", "union_find"],
    correct:    "dynamic_programming",
    explanation: "Modified Bellman-Ford: dp[k][v] = cheapest cost to reach v using at most k edges. Run K+1 relaxation rounds — O(K × E). Dijkstra's greedy choice doesn't directly handle the stop constraint.",
  }),
  pm({
    exerciseId: "java_m37_t5_pm_1",
    topicId:    "java_m37_t5",
    moduleId:   "java_m37",
    level:      "easy",
    title:      "Detect redundant connection",
    scenario:   "Given a list of edges added one by one to an undirected graph of n nodes, return the edge that causes a cycle to form (the redundant connection).",
    hints:      ["You need to know, for each edge, whether its two endpoints are already connected."],
    options:    ["union_find", "dfs", "bfs", "topological_sort"],
    correct:    "union_find",
    explanation: "Union-Find: for each edge (u, v), find both roots. If they share a root, this edge creates a cycle — return it. Otherwise, union them. O(α(n)) per operation with path compression.",
  }),
  pm({
    exerciseId: "java_m37_t2_pm_1",
    topicId:    "java_m37_t2",
    moduleId:   "java_m37",
    level:      "easy",
    title:      "All nodes within K hops",
    scenario:   "Given an undirected graph and a source node, return all nodes that are reachable in exactly K hops from the source.",
    hints:      ["You need to track distance from the source precisely."],
    options:    ["bfs", "dfs", "topological_sort", "two_pointer"],
    correct:    "bfs",
    explanation: "BFS naturally tracks distance level by level. Stop expanding once you've processed all nodes at depth K — O(V+E).",
  }),

  // ── M41: DSA13 — Dynamic Programming ──────────────────────────────────────
  pm({
    exerciseId: "java_m41_t1_pm_1",
    topicId:    "java_m41_t1",
    moduleId:   "java_m41",
    level:      "easy",
    title:      "Longest increasing subsequence",
    scenario:   "Given an unsorted array, find the length of the longest strictly increasing subsequence. The subsequence does not need to be contiguous.",
    hints:      ["For each element, what's the longest increasing subsequence that ends here?"],
    options:    ["dynamic_programming", "greedy", "two_pointer", "divide_and_conquer"],
    correct:    "dynamic_programming",
    explanation: "dp[i] = length of LIS ending at index i. For each i, check all j < i with nums[j] < nums[i]. O(n²) basic DP, or O(n log n) with binary search on a patience-sort array.",
  }),
  pm({
    exerciseId: "java_m41_t2_pm_1",
    topicId:    "java_m41_t2",
    moduleId:   "java_m41",
    level:      "medium",
    title:      "Minimum edit distance",
    scenario:   "Given two strings, find the minimum number of single-character operations (insert, delete, replace) to transform one string into the other.",
    hints:      ["The answer for strings of length i and j depends on answers for shorter prefixes."],
    options:    ["dynamic_programming", "two_pointer", "greedy", "divide_and_conquer"],
    correct:    "dynamic_programming",
    explanation: "2D DP table where dp[i][j] = edit distance between the first i chars of s1 and j chars of s2. Fill using recurrence: match (no cost), insert, delete, or replace — O(m×n).",
  }),
  pm({
    exerciseId: "java_m41_t3_pm_1",
    topicId:    "java_m41_t3",
    moduleId:   "java_m41",
    level:      "medium",
    title:      "Combination sum",
    scenario:   "Given an array of distinct positive integers and a target, find all unique combinations that sum to the target. Each number may be used an unlimited number of times.",
    hints:      ["You need to explore ALL valid combinations — there's no single greedy choice."],
    options:    ["backtracking", "dynamic_programming", "greedy", "bfs"],
    correct:    "backtracking",
    explanation: "Explore the decision tree: include the current number (possibly multiple times) or skip to the next. Prune when the running sum exceeds the target — exponential worst case but pruning makes it practical.",
  }),
  pm({
    exerciseId: "java_m41_t4_pm_1",
    topicId:    "java_m41_t4",
    moduleId:   "java_m41",
    level:      "easy",
    title:      "Jump game (can you reach the end?)",
    scenario:   "Given an array where each element represents the maximum jump distance from that position, determine if you can reach the last index starting from index 0.",
    hints:      ["You only need to know whether you CAN reach the end, not the exact path."],
    options:    ["greedy", "dynamic_programming", "two_pointer", "bfs"],
    correct:    "greedy",
    explanation: "Track the farthest reachable index as you scan left to right. If you reach an index beyond the current max, you're stuck. No need to explore all paths — O(n), O(1) space.",
  }),
  pm({
    exerciseId: "java_m41_t5_pm_1",
    topicId:    "java_m41_t5",
    moduleId:   "java_m41",
    level:      "medium",
    title:      "K-th largest element",
    scenario:   "Find the k-th largest element in an unsorted array WITHOUT sorting the entire array. Aim for O(n) average time complexity.",
    hints:      ["You don't need to sort everything — just find where the k-th largest 'ends up'."],
    options:    ["divide_and_conquer", "dynamic_programming", "binary_search", "greedy"],
    correct:    "divide_and_conquer",
    explanation: "QuickSelect (divide-and-conquer): pick a pivot, partition like QuickSort, but only recurse into the partition that contains the k-th position. O(n) average, O(n²) worst — much faster than full sort in practice.",
  }),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Seeding ${EXERCISES.length} pattern_match exercises…`);
  let inserted = 0, updated = 0;
  for (const ex of EXERCISES) {
    const r = await ProExercise.findOneAndUpdate(
      { exerciseId: ex.exerciseId },
      ex,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (r.__v === undefined || r.isNew) inserted++; else updated++;
  }
  console.log(`Done — ${inserted} inserted, ${updated} updated.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err.message); process.exit(1); });
