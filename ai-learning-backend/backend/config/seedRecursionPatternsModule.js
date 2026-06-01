/**
 * Seed M48 — Recursion Interview Patterns
 *
 * Upserts one ProModule, 5 ProTopics, and 18 ProExercises into MongoDB.
 * Idempotent: safe to re-run.
 *
 * Usage:  node config/seedRecursionPatternsModule.js
 * npm:    npm run seed:recursion-patterns
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK_KEY = "pro_java";
const MODULE_ID = "java_m48";

// ── Helpers ──────────────────────────────────────────────────────────────────

function xpFor(level) {
  return level === "warmup" ? 5 : level === "easy" ? 10 : level === "medium" ? 15 : 20;
}

function diffFor(level) {
  return level === "warmup" ? 0.1 : level === "easy" ? 0.2 : level === "medium" ? 0.4 : 0.6;
}

function code(o) {
  return {
    trackKey:         TRACK_KEY,
    moduleId:         MODULE_ID,
    topicId:          o.topicId,
    exerciseId:       o.exerciseId,
    position:         o.position,
    level:            o.level,
    type:             "code_scratch",
    title:            o.title,
    scenario:         o.scenario,
    instructions:     o.instructions ?? "",
    starterCode:      o.starterCode ?? "",
    expectedSolution: o.expectedSolution ?? "",
    blanks:           [],
    testCases:        o.testCases,
    hints:            o.hints ?? [],
    xpReward:         xpFor(o.level),
    difficulty:       diffFor(o.level),
  };
}

function predict(o) {
  return {
    trackKey:         TRACK_KEY,
    moduleId:         MODULE_ID,
    topicId:          o.topicId,
    exerciseId:       o.exerciseId,
    position:         o.position,
    level:            o.level,
    type:             "predict_output",
    title:            o.title,
    scenario:         o.scenario,
    instructions:     o.instructions ?? "What does this code print?",
    starterCode:      o.starterCode,
    expectedSolution: o.expected,
    blanks:           [],
    testCases:        [{ type: "expected_output", expected: o.expected, explanation: o.explanation }],
    hints:            o.hints ?? [],
    xpReward:         xpFor(o.level),
    difficulty:       diffFor(o.level),
  };
}

function fill(o) {
  return {
    trackKey:         TRACK_KEY,
    moduleId:         MODULE_ID,
    topicId:          o.topicId,
    exerciseId:       o.exerciseId,
    position:         o.position,
    level:            o.level,
    type:             "fill_blank",
    title:            o.title,
    scenario:         o.scenario,
    instructions:     o.instructions ?? "Fill in the missing code.",
    starterCode:      o.starterCode,
    expectedSolution: o.expectedSolution,
    blanks:           o.blanks,
    testCases:        o.testCases,
    hints:            o.hints ?? [],
    xpReward:         xpFor(o.level),
    difficulty:       diffFor(o.level),
  };
}

function pm(o) {
  return {
    trackKey:         TRACK_KEY,
    moduleId:         MODULE_ID,
    topicId:          o.topicId,
    exerciseId:       o.exerciseId,
    position:         o.position,
    level:            o.level,
    type:             "pattern_match",
    title:            o.title,
    scenario:         o.scenario,
    instructions:     o.instructions ?? "",
    starterCode:      "",
    expectedSolution: o.correct,
    blanks:           [{ options: o.options }],
    testCases:        [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints:            o.hints ?? [],
    xpReward:         xpFor(o.level),
    difficulty:       diffFor(o.level),
  };
}

// ── Module ───────────────────────────────────────────────────────────────────

const MODULE = {
  trackKey:       TRACK_KEY,
  moduleId:       MODULE_ID,
  moduleNumber:   48,
  name:           "Recursion Interview Patterns",
  slug:           "recursion-interview-patterns",
  description:    "Master the universal backtracking template, generate subsets and permutations, apply divide-and-conquer, and learn tree-pruning techniques used in every technical interview.",
  estimatedHours: 4,
  prerequisites:  ["java_m2", "java_m29"],
  status:         "live",
};

// ── Topics ───────────────────────────────────────────────────────────────────

const TOPICS = [
  {
    trackKey:    TRACK_KEY,
    moduleId:    MODULE_ID,
    topicId:     "java_m48_t1",
    topicNumber: 1,
    name:        "The Backtracking Template",
    slug:        "backtracking-template",
    metadata: {
      estimated_minutes: 30,
      difficulty:        2,
      prerequisites:     ["java_m2_t5"],
      tags:              ["backtracking", "recursion", "template"],
    },
    hook: {
      question: "Why do most recursive interview solutions look almost identical under the hood?",
      insight:  "Almost every combination, subset, and path problem is solved with the same three-line skeleton: choose an option, recurse deeper, then undo the choice. Recognising the template lets you write solutions confidently under pressure.",
    },
    teaching: {
      blocks: [
        {
          kind:    "concept",
          heading: "The choose → explore → unchoose loop",
          body:    "Every backtracking solution follows one invariant: before recursing you add a candidate to the current path ('choose'), you recurse to explore what that choice enables, and after the recursive call returns you remove the candidate ('unchoose'). This restores the state so the next candidate can be tried cleanly.",
        },
        {
          kind:    "code",
          heading: "Template skeleton (Java)",
          body:    `void backtrack(List<Integer> path, /* other state */) {\n    if (isSolution(path)) {         // base case\n        results.add(new ArrayList<>(path));\n        return;\n    }\n    for (int candidate : getCandidates()) {\n        path.add(candidate);           // choose\n        backtrack(path);               // explore\n        path.remove(path.size() - 1); // unchoose\n    }\n}`,
        },
        {
          kind:    "concept",
          heading: "State that must be copied vs mutated",
          body:    "Primitive variables are passed by value so they undo themselves automatically. Collections (List, int[], boolean[]) are passed by reference — you must explicitly undo mutations after each recursive call, or take a defensive copy before the call. Forgetting this is the #1 backtracking bug.",
        },
        {
          kind:    "concept",
          heading: "Call-stack depth and the recursion visualizer",
          body:    "Each recursive call adds a frame to the JVM call stack. The CallStackVisualizer (D1.2) lets you step through exactly which frames are alive at each moment. Recognising the depth limit (default ~500 frames in Java) matters in interviews when n can be large.",
        },
      ],
    },
    interviewRelevance: "The backtracking template appears in at least 25% of Google, Meta, and Amazon medium/hard recursion problems. Interviewers want to see the template written confidently, not reconstructed from scratch.",
    commonGaps: {
      gaps: [
        "Forgetting to unchoose — path grows without bound and results are wrong.",
        "Passing `path` directly to results without copying — all results end up identical (the final empty list).",
        "Treating the for-loop candidates as a fixed set instead of computing them dynamically based on current state.",
      ],
    },
    prerequisites:    ["java_m2_t5"],
    estimatedMinutes: 30,
    difficulty:       0.33,
    xpReward:         50,
    visualizer:       { kind: "recursion", config: {} },
  },

  {
    trackKey:    TRACK_KEY,
    moduleId:    MODULE_ID,
    topicId:     "java_m48_t2",
    topicNumber: 2,
    name:        "Subsets & Power Set",
    slug:        "subsets-power-set",
    metadata: {
      estimated_minutes: 35,
      difficulty:        2,
      prerequisites:     ["java_m48_t1"],
      tags:              ["subsets", "power-set", "bitmask", "recursion"],
    },
    hook: {
      question: "How many subsets does a 3-element array have, and can you generate all of them in O(2^n) without duplicates?",
      insight:  "Every element has exactly two choices: be in the subset or not. That binary decision tree has 2^n leaves, each one a unique subset. Both the recursive approach and the bitmask approach map this tree directly.",
    },
    teaching: {
      blocks: [
        {
          kind:    "concept",
          heading: "Recursive subset generation",
          body:    "At each index i you make two choices: include nums[i] in the current subset, or skip it. Recurse for both branches. When i == nums.length you have a complete subset. This is the backtracking template with a 2-branch for-loop.",
        },
        {
          kind:    "code",
          heading: "Recursive implementation",
          body:    `void subsets(int[] nums, int i, List<Integer> cur, List<List<Integer>> res) {\n    if (i == nums.length) {\n        res.add(new ArrayList<>(cur));\n        return;\n    }\n    cur.add(nums[i]);    subsets(nums, i + 1, cur, res); // include\n    cur.remove(cur.size() - 1);\n                         subsets(nums, i + 1, cur, res); // exclude\n}`,
        },
        {
          kind:    "concept",
          heading: "Iterative bitmask approach",
          body:    "For n elements, iterate mask from 0 to 2^n - 1. Each bit j of mask says whether element j is in this subset. This is O(n * 2^n) and avoids the call stack entirely, useful when n ≤ 20.",
        },
        {
          kind:    "code",
          heading: "Bitmask implementation",
          body:    `List<List<Integer>> subsetsWithBitmask(int[] nums) {\n    int n = nums.length;\n    List<List<Integer>> res = new ArrayList<>();\n    for (int mask = 0; mask < (1 << n); mask++) {\n        List<Integer> cur = new ArrayList<>();\n        for (int j = 0; j < n; j++) {\n            if ((mask >> j & 1) == 1) cur.add(nums[j]);\n        }\n        res.add(cur);\n    }\n    return res;\n}`,
        },
        {
          kind:    "concept",
          heading: "Counting subsets with a target sum",
          body:    "A common variant asks how many subsets sum to a target T. The recursive tree is the same — at each index include or exclude — but instead of recording the subset, count when the running sum equals T at the leaf.",
        },
      ],
    },
    interviewRelevance: "Subset problems appear in Leetcode 78, 90 (with duplicates), and 416 (partition equal subset sum). Understanding both approaches lets you handle the bitmask follow-up question that appears in Google phone screens.",
    commonGaps: {
      gaps: [
        "Off-by-one: iterating mask to 2^n (inclusive) instead of < 2^n.",
        "Handling duplicates: when input has duplicates, sort first and skip nums[i] == nums[i-1] at the same depth to avoid duplicate subsets.",
        "Copy vs reference: adding `cur` directly instead of `new ArrayList<>(cur)`.",
      ],
    },
    prerequisites:    ["java_m48_t1"],
    estimatedMinutes: 35,
    difficulty:       0.4,
    xpReward:         50,
    visualizer:       null,
  },

  {
    trackKey:    TRACK_KEY,
    moduleId:    MODULE_ID,
    topicId:     "java_m48_t3",
    topicNumber: 3,
    name:        "Permutations & Combinations",
    slug:        "permutations-combinations",
    metadata: {
      estimated_minutes: 40,
      difficulty:        3,
      prerequisites:     ["java_m48_t1"],
      tags:              ["permutations", "combinations", "nPr", "nCr", "swap"],
    },
    hook: {
      question: "What is the difference between a permutation and a combination, and why does it change the recursion structure?",
      insight:  "Order matters for permutations (ABC ≠ BAC), not for combinations. Permutations use a 'swap' or a 'used[]' boolean array so every element can appear in every position. Combinations use a 'start index' so you only look forward, never revisit earlier elements.",
    },
    teaching: {
      blocks: [
        {
          kind:    "concept",
          heading: "Permutation via used[] array",
          body:    "Maintain a boolean used[] array. At each recursion depth, try every index that is not yet used. Mark it used before recursing, unmark it after. When path.size() == n you have a complete permutation.",
        },
        {
          kind:    "code",
          heading: "Permutation with used[] array",
          body:    `void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {\n    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }\n    for (int i = 0; i < nums.length; i++) {\n        if (used[i]) continue;\n        used[i] = true;\n        path.add(nums[i]);\n        permute(nums, used, path, res);\n        path.remove(path.size() - 1);\n        used[i] = false;\n    }\n}`,
        },
        {
          kind:    "concept",
          heading: "Permutation via in-place swap",
          body:    "An alternative avoids the extra boolean array by swapping elements within the array itself. At depth d, swap nums[d] with each nums[i] for i >= d, recurse, then swap back. Space is O(depth) for the call stack only.",
        },
        {
          kind:    "code",
          heading: "Permutation with swap",
          body:    `void permuteSwap(int[] nums, int d, List<List<Integer>> res) {\n    if (d == nums.length) {\n        List<Integer> p = new ArrayList<>();\n        for (int x : nums) p.add(x);\n        res.add(p);\n        return;\n    }\n    for (int i = d; i < nums.length; i++) {\n        swap(nums, d, i);\n        permuteSwap(nums, d + 1, res);\n        swap(nums, d, i); // restore\n    }\n}`,
        },
        {
          kind:    "concept",
          heading: "Combinations: C(n, k) via start index",
          body:    "To generate C(n, k) combinations, pass a `start` index into the recursion. Each recursive call only picks from indices >= start, ensuring no element is reused and no combination is generated in two different orders.",
        },
        {
          kind:    "concept",
          heading: "nPr and nCr formulas",
          body:    "nPr = n! / (n-r)! counts ordered arrangements. nCr = n! / (r! * (n-r)!) counts unordered selections. These formulas let you sanity-check the size of your output before running the recursion.",
        },
      ],
    },
    interviewRelevance: "Permutation problems appear at every FAANG company. The swap-based approach is preferred when the interviewer asks for O(1) extra space. Combination problems (Leetcode 77, 39, 40) test whether you correctly thread the start index.",
    commonGaps: {
      gaps: [
        "Using the used[] approach for combinations — it generates duplicates (ordering variants of the same combination).",
        "Forgetting to swap back after recursion in the swap approach.",
        "Not sorting before deduplication when input has duplicates (Leetcode 47).",
      ],
    },
    prerequisites:    ["java_m48_t1"],
    estimatedMinutes: 40,
    difficulty:       0.5,
    xpReward:         50,
    visualizer:       null,
  },

  {
    trackKey:    TRACK_KEY,
    moduleId:    MODULE_ID,
    topicId:     "java_m48_t4",
    topicNumber: 4,
    name:        "Divide & Conquer Patterns",
    slug:        "divide-and-conquer-patterns",
    metadata: {
      estimated_minutes: 40,
      difficulty:        3,
      prerequisites:     ["java_m48_t1"],
      tags:              ["divide-and-conquer", "merge-sort", "binary-search", "max-subarray"],
    },
    hook: {
      question: "What do merge sort, binary search, and maximum subarray have in common beyond the obvious?",
      insight:  "All three split the problem into non-overlapping halves, solve each half recursively, and combine results in O(1) or O(n) time. Once you see this frame, you can apply divide-and-conquer to any problem where independent subproblems can be merged cheaply.",
    },
    teaching: {
      blocks: [
        {
          kind:    "concept",
          heading: "The D&C skeleton",
          body:    "1) Base case: problem is trivially solvable (size 0 or 1). 2) Divide: split into two (or more) smaller subproblems. 3) Conquer: recurse on each. 4) Combine: merge the subproblem results. The total time complexity follows the Master Theorem: T(n) = aT(n/b) + f(n).",
        },
        {
          kind:    "concept",
          heading: "Merge sort as the canonical D&C example",
          body:    "Split array at mid. Sort left half recursively. Sort right half recursively. Merge the two sorted halves in O(n). Total: O(n log n). The merge step is the O(n) combine function. Space: O(n) for the temporary merge array.",
        },
        {
          kind:    "code",
          heading: "Merge sort",
          body:    `void mergeSort(int[] a, int lo, int hi) {\n    if (lo >= hi) return;\n    int mid = lo + (hi - lo) / 2;\n    mergeSort(a, lo, mid);\n    mergeSort(a, mid + 1, hi);\n    merge(a, lo, mid, hi);\n}\nvoid merge(int[] a, int lo, int mid, int hi) {\n    int[] tmp = Arrays.copyOfRange(a, lo, hi + 1);\n    int i = 0, j = mid - lo + 1, k = lo;\n    int len = hi - lo + 1;\n    while (i <= mid - lo && j < len) {\n        a[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];\n    }\n    while (i <= mid - lo) a[k++] = tmp[i++];\n    while (j < len)        a[k++] = tmp[j++];\n}`,
        },
        {
          kind:    "concept",
          heading: "Binary search as D&C",
          body:    "Binary search is D&C with a combine step of cost O(1): compare target to the midpoint, discard the half that cannot contain target, recurse into the other half. Recurrence: T(n) = T(n/2) + O(1) → O(log n).",
        },
        {
          kind:    "concept",
          heading: "Maximum subarray: Kadane's vs D&C",
          body:    "Kadane's greedy scan is O(n) and simpler. D&C maximum subarray is O(n log n) but demonstrates that the answer spans one of three regions: entirely in the left half, entirely in the right half, or crossing the midpoint. The crossing case is computed in O(n) by scanning outward from mid. Interviewers ask for D&C specifically to test Master Theorem reasoning.",
        },
      ],
    },
    interviewRelevance: "Merge sort is a required implementation in virtually every SDE-1 interview at FAANG. Binary search as D&C is the basis for 'search on answer' problems (Leetcode 875, 1011). D&C max subarray (Leetcode 53) appears as a follow-up question to test depth.",
    commonGaps: {
      gaps: [
        "Integer overflow in mid calculation: use `lo + (hi - lo) / 2`, not `(lo + hi) / 2`.",
        "Off-by-one in merge boundaries — passing wrong hi to the second half.",
        "Confusing D&C (independent subproblems) with DP (overlapping subproblems with memoization).",
      ],
    },
    prerequisites:    ["java_m48_t1"],
    estimatedMinutes: 40,
    difficulty:       0.5,
    xpReward:         50,
    visualizer:       null,
  },

  {
    trackKey:    TRACK_KEY,
    moduleId:    MODULE_ID,
    topicId:     "java_m48_t5",
    topicNumber: 5,
    name:        "Pruning & Early Termination",
    slug:        "pruning-early-termination",
    metadata: {
      estimated_minutes: 35,
      difficulty:        4,
      prerequisites:     ["java_m48_t1", "java_m48_t3"],
      tags:              ["pruning", "n-queens", "sudoku", "constraint-propagation"],
    },
    hook: {
      question: "If the brute-force recursion tree has 8^81 leaves for Sudoku, how does a solver run in milliseconds?",
      insight:  "Pruning cuts branches before they are fully explored. A single constraint check at each node can eliminate millions of downstream leaves. The difference between an exponential-looking algorithm and a fast one is almost always how aggressively it prunes.",
    },
    teaching: {
      blocks: [
        {
          kind:    "concept",
          heading: "What pruning means",
          body:    "Before recursing into a branch, check whether any valid solution can possibly exist in that branch. If not, return immediately without exploring further. This is called 'constraint checking' or 'bounding'. The tighter the bound, the fewer nodes visited.",
        },
        {
          kind:    "concept",
          heading: "N-Queens pruning",
          body:    "Place one queen per row. Before placing queen in column c of row r, check: (1) no previously placed queen is in column c, (2) no queen is on the same left diagonal (row - col is equal), (3) no queen is on the same right diagonal (row + col is equal). Maintain three boolean/set structures to do each check in O(1). This reduces the search space from O(n^n) to O(n!) with heavy pruning.",
        },
        {
          kind:    "code",
          heading: "N-Queens constraint check",
          body:    `boolean isSafe(int row, int col, boolean[] cols,\n               boolean[] diag1, boolean[] diag2, int n) {\n    return !cols[col]\n        && !diag1[row - col + n - 1]\n        && !diag2[row + col];\n}`,
        },
        {
          kind:    "concept",
          heading: "Sudoku solver sketch",
          body:    "Find the first empty cell. Try digits 1–9. For each digit, check row, column, and 3×3 box constraints in O(1) using three 9×9 boolean arrays. If no constraint is violated, place the digit and recurse. If recursion returns false, unplace (backtrack) and try the next digit. If all digits fail, return false to trigger backtracking in the caller.",
        },
        {
          kind:    "concept",
          heading: "General pruning heuristics",
          body:    "Fail fast: check the tightest constraint first. Order candidates by most-constrained-first (MCV heuristic) — try values with the fewest remaining options first. For numeric problems, sort input and break early when the running sum exceeds the target (used in combination sum).",
        },
      ],
    },
    interviewRelevance: "N-Queens (Leetcode 51/52) is a classic FAANG hard. Sudoku solver (Leetcode 37) appears at Google. Interviewers explicitly look for pruning — a brute-force solution without pruning is marked 'needs improvement'.",
    commonGaps: {
      gaps: [
        "Using O(n) column/diagonal scans instead of O(1) lookup sets — correct but too slow for large n.",
        "Not resetting the boolean arrays after backtracking (same bug as forgetting to unchoose).",
        "Placing queens in every cell instead of one per row — explodes the search space unnecessarily.",
      ],
    },
    prerequisites:    ["java_m48_t1", "java_m48_t3"],
    estimatedMinutes: 35,
    difficulty:       0.6,
    xpReward:         50,
    visualizer:       null,
  },
];

// ── Exercises ─────────────────────────────────────────────────────────────────

const EXERCISES = [

  // ── T1: The Backtracking Template ──────────────────────────────────────────

  predict({
    topicId:     "java_m48_t1",
    exerciseId:  "java_m48_t1_ex_1",
    position:    1,
    level:       "easy",
    title:       "Trace the backtracking call tree",
    scenario:    "What does the following code print? The grid is 2×2, origin (0,0), destination (1,1).",
    instructions: "Trace the recursive calls and determine the complete output.",
    starterCode: `import java.util.*;
public class Main {
    static List<String> paths = new ArrayList<>();
    static void dfs(int r, int c, String path) {
        if (r == 1 && c == 1) { paths.add(path + "(1,1)"); return; }
        if (r < 0 || r > 1 || c < 0 || c > 1) return;
        dfs(r + 1, c, path + "(" + r + "," + c + ")");
        dfs(r, c + 1, path + "(" + r + "," + c + ")");
    }
    public static void main(String[] args) {
        dfs(0, 0, "");
        for (String p : paths) System.out.println(p);
    }
}`,
    expected:    "(0,0)(1,0)(1,1)\n(0,0)(0,1)(1,1)",
    explanation: "From (0,0): go down to (1,0) then right to (1,1) = path 1. Back to (0,0): go right to (0,1) then down to (1,1) = path 2. Both paths printed in DFS order.",
    hints:       ["Trace the 'down first' branch completely before the 'right' branch."],
  }),

  fill({
    topicId:      "java_m48_t1",
    exerciseId:   "java_m48_t1_ex_2",
    position:     2,
    level:        "warmup",
    title:        "Complete the unchoose step",
    scenario:     "The backtracking method below generates subsets but forgets the unchoose step. Fill in the blank.",
    instructions: "Replace ___ with the single Java statement that completes the backtracking template.",
    starterCode: `void bt(int[] nums, int i, List<Integer> path, List<List<Integer>> res) {
    if (i == nums.length) { res.add(new ArrayList<>(path)); return; }
    path.add(nums[i]);          // choose
    bt(nums, i + 1, path, res); // explore
    ___;                        // unchoose  <-- fill this
    bt(nums, i + 1, path, res);
}`,
    expectedSolution: "path.remove(path.size() - 1)",
    blanks: [
      {
        placeholder: "___",
        answer:      "path.remove(path.size() - 1)",
        explanation: "Remove the last element added to undo the choose step and restore path to its previous state.",
      },
    ],
    testCases: [
      {
        type:        "fill_blank",
        correct:     "path.remove(path.size() - 1)",
        explanation: "List.remove(int index) with the last index removes the element added in the choose step.",
      },
    ],
    hints: ["You added nums[i] just before the first recursive call — you need to remove it before the second call."],
  }),

  code({
    topicId:     "java_m48_t1",
    exerciseId:  "java_m48_t1_ex_3",
    position:    3,
    level:       "medium",
    title:       "Generate all subsets using backtracking",
    scenario:    "Use the backtracking template to generate all subsets of [1,2,3]. Print each subset on one line as comma-separated values, sorted ascending, smallest subsets first. Print the empty subset as an empty line.",
    instructions: "Write a complete Java program. Subsets must appear in the order: [] [1] [1,2] [1,2,3] [1,3] [2] [2,3] [3].",
    starterCode: `import java.util.*;
public class Main {
    static void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        // TODO
    }
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        for (List<Integer> s : res) {
            System.out.println(String.join(",", s.stream().map(String::valueOf).toArray(String[]::new)));
        }
    }
}`,
    expectedSolution: `static void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "\n1\n1,2\n1,2,3\n1,3\n2\n2,3\n3",
      },
    ],
    hints: [
      "Record the current path at the start of each call (before the loop) — that gives you every subset, including the empty one.",
      "Pass i+1 as the new start so you only look forward and never repeat earlier elements.",
    ],
  }),

  // ── T2: Subsets & Power Set ─────────────────────────────────────────────────

  code({
    topicId:     "java_m48_t2",
    exerciseId:  "java_m48_t2_ex_1",
    position:    1,
    level:       "easy",
    title:       "Power set of [1,2] using recursion",
    scenario:    "Generate and print all subsets of [1,2] using the recursive include/exclude approach. Print one subset per line, comma-separated. Print subsets in the order they are produced by the recursion: both-included first.",
    instructions: "Write a complete Java program. Expected order: 1,2 then 1 then 2 then (empty line).",
    starterCode: `import java.util.*;
public class Main {
    static void subsets(int[] nums, int i, List<Integer> cur) {
        // TODO
    }
    public static void main(String[] args) {
        subsets(new int[]{1, 2}, 0, new ArrayList<>());
    }
}`,
    expectedSolution: `static void subsets(int[] nums, int i, List<Integer> cur) {
    if (i == nums.length) {
        System.out.println(String.join(",", cur.stream().map(String::valueOf).toArray(String[]::new)));
        return;
    }
    cur.add(nums[i]);
    subsets(nums, i + 1, cur);
    cur.remove(cur.size() - 1);
    subsets(nums, i + 1, cur);
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "1,2\n1\n2\n",
      },
    ],
    hints: [
      "Include nums[i], recurse, then remove nums[i] and recurse again for the exclude branch.",
      "The base case (i == nums.length) is where you print the current subset.",
    ],
  }),

  code({
    topicId:     "java_m48_t2",
    exerciseId:  "java_m48_t2_ex_2",
    position:    2,
    level:       "medium",
    title:       "Count subsets with target sum",
    scenario:    "Count how many subsets of [2,3,5,6,8,10] have elements that sum to exactly 10. Print just the count.",
    instructions: "Write a complete Java program that prints a single integer.",
    starterCode: `public class Main {
    static int count = 0;
    static void solve(int[] nums, int i, int remaining) {
        // TODO
    }
    public static void main(String[] args) {
        solve(new int[]{2, 3, 5, 6, 8, 10}, 0, 10);
        System.out.println(count);
    }
}`,
    expectedSolution: `static void solve(int[] nums, int i, int remaining) {
    if (remaining == 0) { count++; return; }
    if (i == nums.length || remaining < 0) return;
    solve(nums, i + 1, remaining - nums[i]); // include
    solve(nums, i + 1, remaining);            // exclude
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "3",
      },
    ],
    hints: [
      "The subsets that sum to 10 from {2,3,5,6,8,10} are: {2,8}, {2,3,5}, {10}.",
      "Prune early: if remaining < 0, return immediately.",
    ],
  }),

  // ── T3: Permutations & Combinations ────────────────────────────────────────

  code({
    topicId:     "java_m48_t3",
    exerciseId:  "java_m48_t3_ex_1",
    position:    1,
    level:       "medium",
    title:       "All permutations of [1,2,3]",
    scenario:    "Generate all permutations of [1,2,3] using the used[] array approach. Print each permutation on one line, comma-separated. Sort the output lines lexicographically before printing.",
    instructions: "Write a complete Java program.",
    starterCode: `import java.util.*;
public class Main {
    static void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        // TODO
    }
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        List<List<Integer>> res = new ArrayList<>();
        permute(nums, new boolean[nums.length], new ArrayList<>(), res);
        res.sort((a, b) -> {
            for (int i = 0; i < a.size(); i++) {
                int c = a.get(i) - b.get(i);
                if (c != 0) return c;
            }
            return 0;
        });
        for (List<Integer> p : res) {
            System.out.println(String.join(",", p.stream().map(String::valueOf).toArray(String[]::new)));
        }
    }
}`,
    expectedSolution: `static void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        permute(nums, used, path, res);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "1,2,3\n1,3,2\n2,1,3\n2,3,1\n3,1,2\n3,2,1",
      },
    ],
    hints: [
      "At each recursive depth, loop over all indices. Skip those already marked used.",
      "Mark used[i] = true before recursing, false after — this is the choose/unchoose pair.",
    ],
  }),

  fill({
    topicId:      "java_m48_t3",
    exerciseId:   "java_m48_t3_ex_2",
    position:     2,
    level:        "easy",
    title:        "Fill the swap positions in a permutation generator",
    scenario:     "The swap-based permutation generator below has two blank swap calls. Fill both blanks.",
    instructions: "Fill in the two index arguments for the swap calls so the generator correctly produces all permutations.",
    starterCode: `void permuteSwap(int[] nums, int d, List<List<Integer>> res) {
    if (d == nums.length) {
        List<Integer> p = new ArrayList<>();
        for (int x : nums) p.add(x);
        res.add(p);
        return;
    }
    for (int i = d; i < nums.length; i++) {
        swap(nums, _A_, _B_);          // choose
        permuteSwap(nums, d + 1, res); // explore
        swap(nums, _A_, _B_);          // unchoose
    }
}`,
    expectedSolution: "swap(nums, d, i)",
    blanks: [
      {
        placeholder: "_A_",
        answer:      "d",
        explanation: "The first argument is the current depth d — the position we are filling in this call.",
      },
      {
        placeholder: "_B_",
        answer:      "i",
        explanation: "The second argument is i — the candidate we are placing at position d.",
      },
    ],
    testCases: [
      {
        type:        "fill_blank",
        correct:     "d,i",
        explanation: "swap(nums, d, i) places candidate i at position d. The second swap restores the array.",
      },
    ],
    hints: ["You are placing one element at index d. The loop variable i points to the candidate."],
  }),

  // ── T4: Divide & Conquer Patterns ──────────────────────────────────────────

  code({
    topicId:     "java_m48_t4",
    exerciseId:  "java_m48_t4_ex_1",
    position:    1,
    level:       "hard",
    title:       "Merge sort implementation",
    scenario:    "Implement merge sort for an int array. Sort [5,3,8,1,9,2,7,4] and print the sorted array comma-separated.",
    instructions: "Write a complete Java program. Use the recursive mergeSort(arr, lo, hi) + merge helper pattern.",
    starterCode: `import java.util.*;
public class Main {
    static void mergeSort(int[] a, int lo, int hi) {
        // TODO
    }
    static void merge(int[] a, int lo, int mid, int hi) {
        // TODO
    }
    public static void main(String[] args) {
        int[] a = {5, 3, 8, 1, 9, 2, 7, 4};
        mergeSort(a, 0, a.length - 1);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(a[i]);
        }
        System.out.println(sb);
    }
}`,
    expectedSolution: `static void mergeSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid + 1, hi);
    merge(a, lo, mid, hi);
}
static void merge(int[] a, int lo, int mid, int hi) {
    int[] tmp = Arrays.copyOfRange(a, lo, hi + 1);
    int i = 0, j = mid - lo + 1, k = lo, len = hi - lo + 1;
    while (i <= mid - lo && j < len) a[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
    while (i <= mid - lo) a[k++] = tmp[i++];
    while (j < len) a[k++] = tmp[j++];
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "1,2,3,4,5,7,8,9",
      },
    ],
    hints: [
      "mid = lo + (hi - lo) / 2 avoids integer overflow.",
      "In merge, copy the range [lo..hi] to a temp array and merge back using three pointers.",
    ],
  }),

  predict({
    topicId:     "java_m48_t4",
    exerciseId:  "java_m48_t4_ex_2",
    position:    2,
    level:       "easy",
    title:       "Trace the divide step on [3,1,4,1]",
    scenario:    "What are the two halves produced by the first divide step of merge sort on the array [3,1,4,1]? The split uses mid = lo + (hi - lo) / 2 with lo=0, hi=3.",
    instructions: "State the left half and right half as comma-separated values, one half per line.",
    starterCode: "Array: [3, 1, 4, 1]  lo=0  hi=3  mid=?",
    expected:    "3,1\n4,1",
    explanation: "mid = 0 + (3-0)/2 = 1. Left half is indices 0..1 = [3,1]. Right half is indices 2..3 = [4,1].",
    hints:       ["Compute mid first: lo + (hi - lo) / 2."],
  }),

  pm({
    topicId:    "java_m48_t4",
    exerciseId: "java_m48_t4_pm_1",
    position:   3,
    level:      "easy",
    title:      "Find peak element efficiently",
    scenario:   "A peak element is an element strictly greater than its neighbours. Given an array where nums[i] != nums[i+1], find any peak element. The algorithm must run in O(log n).",
    hints:      ["If nums[mid] < nums[mid+1] the right half must contain a peak."],
    options:    ["divide_and_conquer", "two_pointer", "dynamic_programming", "greedy"],
    correct:    "divide_and_conquer",
    explanation: "Compare nums[mid] with nums[mid+1]. If nums[mid] < nums[mid+1] a peak exists in the right half; otherwise it exists in the left half. This binary divide gives O(log n) — Leetcode 162.",
  }),

  // ── T5: Pruning & Early Termination ────────────────────────────────────────

  code({
    topicId:     "java_m48_t5",
    exerciseId:  "java_m48_t5_ex_1",
    position:    1,
    level:       "hard",
    title:       "N-Queens — count solutions for n=4",
    scenario:    "Count the number of distinct solutions to the N-Queens problem for n=4. Print just the count.",
    instructions: "Write a complete Java program. Use column + diagonal boolean arrays for O(1) constraint checks.",
    starterCode: `public class Main {
    static int count = 0;
    static void solve(int row, int n, boolean[] cols, boolean[] d1, boolean[] d2) {
        // TODO
    }
    public static void main(String[] args) {
        int n = 4;
        solve(0, n, new boolean[n], new boolean[2 * n], new boolean[2 * n]);
        System.out.println(count);
    }
}`,
    expectedSolution: `static void solve(int row, int n, boolean[] cols, boolean[] d1, boolean[] d2) {
    if (row == n) { count++; return; }
    for (int col = 0; col < n; col++) {
        if (cols[col] || d1[row - col + n - 1] || d2[row + col]) continue;
        cols[col] = d1[row - col + n - 1] = d2[row + col] = true;
        solve(row + 1, n, cols, d1, d2);
        cols[col] = d1[row - col + n - 1] = d2[row + col] = false;
    }
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "2",
      },
    ],
    hints: [
      "d1 tracks row-col diagonals; use row - col + n - 1 as the index to keep it non-negative.",
      "d2 tracks row+col diagonals; row + col is always in [0, 2n-2].",
    ],
  }),

  pm({
    topicId:    "java_m48_t5",
    exerciseId: "java_m48_t5_pm_1",
    position:   2,
    level:      "easy",
    title:      "Generate all valid parentheses",
    scenario:   "Given n=3, generate all combinations of n pairs of well-formed parentheses. Every opening bracket must be closed in the correct order.",
    hints:      ["At each step you choose '(' or ')'. A constraint tells you which choices are valid right now."],
    options:    ["backtracking", "dynamic_programming", "bfs", "greedy"],
    correct:    "backtracking",
    explanation: "Use backtracking with two counters: open (brackets opened so far) and close (brackets closed so far). Add '(' if open < n; add ')' if close < open. This naturally prunes invalid states — Leetcode 22.",
  }),

  // ── Additional exercises ────────────────────────────────────────────────────

  code({
    topicId:     "java_m48_t3",
    exerciseId:  "java_m48_t3_ex_3",
    position:    3,
    level:       "medium",
    title:       "Combinations C(4,2)",
    scenario:    "Generate all combinations of 2 elements chosen from [1,2,3,4] using the start-index approach. Print each combination on one line comma-separated, in the order the recursion produces them.",
    instructions: "Write a complete Java program.",
    starterCode: `import java.util.*;
public class Main {
    static void combine(int[] nums, int start, int k, List<Integer> path, List<List<Integer>> res) {
        // TODO
    }
    public static void main(String[] args) {
        List<List<Integer>> res = new ArrayList<>();
        combine(new int[]{1,2,3,4}, 0, 2, new ArrayList<>(), res);
        for (List<Integer> c : res) {
            System.out.println(String.join(",", c.stream().map(String::valueOf).toArray(String[]::new)));
        }
    }
}`,
    expectedSolution: `static void combine(int[] nums, int start, int k, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == k) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        combine(nums, i + 1, k, path, res);
        path.remove(path.size() - 1);
    }
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "1,2\n1,3\n1,4\n2,3\n2,4\n3,4",
      },
    ],
    hints: [
      "Pass i+1 (not start+1) as the new start so you only move forward.",
      "Stop adding when path.size() == k.",
    ],
  }),

  code({
    topicId:     "java_m48_t2",
    exerciseId:  "java_m48_t2_ex_3",
    position:    3,
    level:       "easy",
    title:       "Bitmask power set of [1,2,3]",
    scenario:    "Use the iterative bitmask approach to print all subsets of [1,2,3]. Print each subset comma-separated on one line in mask order (mask 0 first). Print the empty subset as an empty line.",
    instructions: "Write a complete Java program without any recursion.",
    starterCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        int n = nums.length;
        // TODO: iterate mask 0..(1<<n)-1
    }
}`,
    expectedSolution: `int n = nums.length;
for (int mask = 0; mask < (1 << n); mask++) {
    List<String> cur = new ArrayList<>();
    for (int j = 0; j < n; j++) {
        if ((mask >> j & 1) == 1) cur.add(String.valueOf(nums[j]));
    }
    System.out.println(String.join(",", cur));
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "\n1\n2\n1,2\n3\n1,3\n2,3\n1,2,3",
      },
    ],
    hints: [
      "Outer loop: mask from 0 to (1 << n) - 1.",
      "Inner loop: check bit j with (mask >> j & 1) == 1.",
    ],
  }),

  code({
    topicId:     "java_m48_t5",
    exerciseId:  "java_m48_t5_ex_2",
    position:    3,
    level:       "medium",
    title:       "Combination sum with pruning",
    scenario:    "Find all unique combinations from [2,3,6,7] that sum to 7. Each number may be used unlimited times. Print each combination sorted, comma-separated, one per line. Print combinations in the order the recursion produces them.",
    instructions: "Write a complete Java program. Sort the input first and prune when the running sum exceeds the target.",
    starterCode: `import java.util.*;
public class Main {
    static void bt(int[] nums, int start, int target, List<Integer> path, List<List<Integer>> res) {
        // TODO
    }
    public static void main(String[] args) {
        int[] nums = {2, 3, 6, 7};
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, 7, new ArrayList<>(), res);
        for (List<Integer> c : res) {
            System.out.println(String.join(",", c.stream().map(String::valueOf).toArray(String[]::new)));
        }
    }
}`,
    expectedSolution: `static void bt(int[] nums, int start, int target, List<Integer> path, List<List<Integer>> res) {
    if (target == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < nums.length; i++) {
        if (nums[i] > target) break; // pruning
        path.add(nums[i]);
        bt(nums, i, target - nums[i], path, res); // i, not i+1 (reuse allowed)
        path.remove(path.size() - 1);
    }
}`,
    testCases: [
      {
        type:            "expected_stdout",
        stdin:           "",
        expected_stdout: "2,2,3\n7",
      },
    ],
    hints: [
      "Pass i (not i+1) to allow reusing the same element.",
      "Break (not continue) when nums[i] > target because the array is sorted — all later elements are also too large.",
    ],
  }),

  predict({
    topicId:     "java_m48_t4",
    exerciseId:  "java_m48_t4_ex_3",
    position:    4,
    level:       "easy",
    title:       "Trace binary search as D&C",
    scenario:    "Trace binary search for target=7 on sorted array [1,3,5,7,9,11]. How many comparisons (calls to the function) are made before returning the index? Count the initial call as comparison 1.",
    instructions: "Print just the integer count.",
    starterCode: "Array: [1,3,5,7,9,11]  target=7\nbinarySearch(arr, 0, 5, 7)",
    expected:    "3",
    explanation: "Call 1: lo=0 hi=5 mid=2 arr[2]=5 < 7 → go right. Call 2: lo=3 hi=5 mid=4 arr[4]=9 > 7 → go left. Call 3: lo=3 hi=3 mid=3 arr[3]=7 == 7 → found. Three comparisons total.",
    hints:       ["Track lo and hi at each step. mid = lo + (hi-lo)/2."],
  }),

  pm({
    topicId:    "java_m48_t1",
    exerciseId: "java_m48_t1_pm_1",
    position:   4,
    level:      "easy",
    title:      "Word search in a 2D grid",
    scenario:   "Given a 2D character grid and a word, determine if the word exists in the grid by following adjacent cells (up, down, left, right) without reusing the same cell.",
    hints:      ["You explore in 4 directions from each cell and undo your choice (mark visited) after exploring."],
    options:    ["backtracking", "dynamic_programming", "bfs", "greedy"],
    correct:    "backtracking",
    explanation: "At each cell that matches the current character, mark it visited (choose), recurse for the next character in all 4 directions (explore), then unmark it (unchoose). Classic choose-explore-unchoose — Leetcode 79.",
  }),

  pm({
    topicId:    "java_m48_t5",
    exerciseId: "java_m48_t5_pm_2",
    position:   4,
    level:      "medium",
    title:      "Palindrome partitioning",
    scenario:   "Given string 'aab', find all ways to partition it so that every substring is a palindrome. Before recursing into a partition, you check whether the current substring is a palindrome — if not, you skip it.",
    hints:      ["You cut at each possible position. The check before recursing eliminates non-palindrome branches instantly."],
    options:    ["backtracking", "dynamic_programming", "two_pointer", "greedy"],
    correct:    "backtracking",
    explanation: "Enumerate every prefix of the remaining string. If the prefix is a palindrome, add it to the current partition and recurse on the suffix. Otherwise skip — this is the pruning step. Leetcode 131.",
  }),
];

// ── Upsert helpers ────────────────────────────────────────────────────────────

async function upsertOne(Model, filter, doc) {
  const result = await Model.findOneAndUpdate(filter, doc, {
    upsert: true, new: true, setDefaultsOnInsert: true,
  });
  return result;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Module
  await upsertOne(ProModule, { moduleId: MODULE.moduleId }, MODULE);
  console.log(`  ✓ ProModule: ${MODULE.moduleId} — ${MODULE.name}`);

  // Topics
  for (const topic of TOPICS) {
    await upsertOne(ProTopic, { topicId: topic.topicId }, topic);
    console.log(`  ✓ ProTopic:  ${topic.topicId} — ${topic.name}`);
  }

  // Exercises
  let inserted = 0, updated = 0;
  for (const ex of EXERCISES) {
    const before = await ProExercise.findOne({ exerciseId: ex.exerciseId }).lean();
    await upsertOne(ProExercise, { exerciseId: ex.exerciseId }, ex);
    before ? updated++ : inserted++;
  }

  console.log(`\nDone — M48 Recursion Interview Patterns seeded.`);
  console.log(`  Topics:    ${TOPICS.length}`);
  console.log(`  Exercises: ${EXERCISES.length} (${inserted} inserted, ${updated} updated)`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

process.on("exit", () => process.exit(0));
