/**
 * seedDsaAnimatorGapsA.js — DSA Animator Gap Checklist, SESSION A
 * (DSA_ANIMATOR_GAP_CHECKLIST.md).
 *
 * Additive & idempotent. Fills 19 missing dsaanimator.com problems (23 exercise
 * docs incl. 4 predict_output traces) across FIVE existing modules:
 *   M30  Array Patterns     — #88 Merge Sorted Array (T1), #643 Max Avg Subarray +
 *                             #1004 Max Consecutive Ones III (+trace) (T2),
 *                             #121 Best Time Buy/Sell Stock (T5)
 *   M30.5 2D Array / Matrix — #36 Valid Sudoku, #59 Spiral Matrix II (T1)
 *   M35  Trees & BST        — #637 Average of Levels (T1),
 *                             #105 Construct from Pre/Inorder (+trace) (T2)
 *   M39  Binary Search      — #34 First/Last Position (T1), #4 Median Two Sorted
 *                             (+trace), #410 Split Array, #1011 Ship Packages (T2)
 *   M47  Bit Manipulation   — #371 Sum Two Ints, #389 Find Difference (T2),
 *                             #191 Num 1 Bits (+trace), #231 Power of Two,
 *                             #338 Counting Bits (T3), #137 Single Number II,
 *                             #260 Single Number III (T4)
 *
 * Lane: ONLY java_m30 / m30_5 / m35 / m39 / m47. Never touches Session B's
 * modules (m31/m37/m40/m41/m41_5). Creates NO modules/topics — only appends
 * ProExercise docs after each topic's current max(position).
 *
 * Convention (this module family, verified): code_scratch -> expectedSolution is a
 * COMPLETE runnable program that prints its result; testCases assert stdout
 * contains the printed result (Arrays/List "[a, b, c]" format) + a complexity
 * tagline. predict_output -> testCases:[{type:"text_match", expected:"..."}].
 *
 * Usage: node config/seedDsaAnimatorGapsA.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const TRACK = "pro_java";
const DIFF = { warmup: 0.17, easy: 0.40, medium: 0.65, hard: 0.90 };
const XP = { warmup: 10, easy: 15, medium: 20, hard: 30 };

function mk(o) {
  const moduleId = o.exerciseId.replace(/_t\d+_(ex|pm)_\d+$/, "");
  const topicId = o.exerciseId.replace(/_(ex|pm)_\d+$/, "");
  return {
    exerciseId: o.exerciseId, topicId, moduleId, trackKey: TRACK,
    position: o.position, level: o.level, type: o.type, title: o.title,
    scenario: o.scenario || "", instructions: o.instructions,
    starterCode: o.starterCode || "", expectedSolution: o.expectedSolution,
    blanks: [], testCases: o.testCases, hints: o.hints,
    difficulty: DIFF[o.level] ?? 0.5, xpReward: XP[o.level] ?? 15,
  };
}
const exec = (...subs) => [{ type: "execution", expected_stdout_contains: subs }];
const txt = (expected) => [{ type: "text_match", expected }];

const EXERCISES = [
  // ════════════════ M30 — Array Patterns ════════════════
  mk({
    exerciseId: "java_m30_t1_ex_16", position: 16, level: "easy", type: "code_scratch",
    title: "Merge Sorted Array (LeetCode #88)",
    instructions: "nums1 has length m+n: the first m slots are sorted values, the last n are 0 placeholders. nums2 has n sorted values. Merge nums2 into nums1 in-place so nums1 is fully sorted. Trick: fill from the BACK (largest first) to avoid overwriting unmerged values.",
    expectedSolution: `import java.util.*;
public class MergeSortedArray {
    static void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;       // write pointer at the end
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
    public static void main(String[] a) {
        int[] nums1 = {1, 2, 3, 0, 0, 0};
        merge(nums1, 3, new int[]{2, 5, 6}, 3);
        System.out.println(Arrays.toString(nums1));   // [1, 2, 2, 3, 5, 6]
        System.out.println("Two pointers from the BACK — O(m+n), in-place, no extra array");
    }
}`,
    hints: ["Fill nums1 from index m+n-1 downward", "Compare the two largest unmerged tails", "Going front-to-back would overwrite values you still need"],
    testCases: exec("[1, 2, 2, 3, 5, 6]", "from the BACK"),
  }),
  mk({
    exerciseId: "java_m30_t2_ex_16", position: 16, level: "easy", type: "code_scratch",
    title: "Maximum Average Subarray I (LeetCode #643)",
    instructions: "Find the contiguous subarray of length exactly k with the maximum average and return that average. Use a fixed-size sliding window: keep a running sum, slide by adding the new element and subtracting the one that left.",
    expectedSolution: `import java.util.*;
public class MaxAverageSubarray {
    static double findMaxAverage(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];        // first window
        int best = sum;
        for (int i = k; i < nums.length; i++) {            // slide
            sum += nums[i] - nums[i - k];
            best = Math.max(best, sum);
        }
        return best / (double) k;
    }
    public static void main(String[] a) {
        System.out.println(findMaxAverage(new int[]{1, 12, -5, -6, 50, 3}, 4));   // 12.75
        System.out.println("Fixed-size sliding window — slide sum by +new -old. O(n)");
    }
}`,
    hints: ["Compute the first k-element sum once", "Slide: sum += nums[i] - nums[i-k]", "Track the max sum, divide by k at the end"],
    testCases: exec("12.75", "Fixed-size sliding window"),
  }),
  mk({
    exerciseId: "java_m30_t2_ex_17", position: 17, level: "medium", type: "code_scratch",
    title: "Max Consecutive Ones III (LeetCode #1004)",
    instructions: "Given a binary array and an integer k, return the longest run of 1s you can get by flipping at most k zeros. Use a VARIABLE sliding window: expand right; when the window holds more than k zeros, shrink from the left until it holds at most k.",
    expectedSolution: `import java.util.*;
public class MaxConsecutiveOnesIII {
    static int longestOnes(int[] nums, int k) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k) if (nums[left++] == 0) zeros--;   // shrink
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
    public static void main(String[] a) {
        System.out.println(longestOnes(new int[]{1,1,1,0,0,0,1,1,1,1,0}, 2));   // 6
        System.out.println("Variable sliding window — shrink when zeros exceed k. O(n)");
    }
}`,
    hints: ["Count zeros inside the window, not ones", "Shrink from the left only while zeros > k", "Window length = right - left + 1"],
    testCases: exec("6", "Variable sliding window"),
  }),
  mk({
    exerciseId: "java_m30_t2_ex_18", position: 18, level: "warmup", type: "predict_output",
    title: "Trace: max-ones sliding window (flip ≤1 zero)",
    instructions: "Array `[1, 1, 0, 0, 1, 1, 1, 0]`, k = 1 (you may flip at most ONE zero). What is the length of the longest window containing at most one zero?",
    expectedSolution: `Variable window, at most 1 zero allowed:

[1,1,0]            -> 1 zero, len 3
add 0 (idx3)       -> 2 zeros, shrink left past idx0,idx1,idx2 -> window {idx3}, len 1
extend 1,1,1 (idx4-6) -> window idx3..6 = [0,1,1,1], 1 zero, len 4
add 0 (idx7)       -> 2 zeros, shrink left past idx3 -> window idx4..7 = [1,1,1,0], len 4

Longest window length = 4`,
    hints: ["Only shrink when the window has more zeros than k", "Track the best window length as you slide"],
    testCases: txt("4"),
  }),
  mk({
    exerciseId: "java_m30_t5_ex_16", position: 16, level: "easy", type: "code_scratch",
    title: "Best Time to Buy and Sell Stock (LeetCode #121)",
    instructions: "Given daily prices, pick one buy day and a later sell day to maximize profit (or 0 if impossible). Single pass: track the minimum price seen so far and the best (current price - min) along the way.",
    expectedSolution: `import java.util.*;
public class BestTimeToBuySellStock {
    static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, best = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > best) best = p - minPrice;
        }
        return best;
    }
    public static void main(String[] a) {
        System.out.println(maxProfit(new int[]{7, 1, 5, 3, 6, 4}));   // 5
        System.out.println(maxProfit(new int[]{7, 6, 4, 3, 1}));      // 0
        System.out.println("Single pass — track min price so far, max (price - min). O(n)");
    }
}`,
    hints: ["You must buy before you sell — track the min to the left", "Profit candidate = current price - min so far", "Monotonically decreasing prices => profit 0"],
    testCases: exec("5", "0", "track min price"),
  }),

  // ════════════════ M30.5 — Matrix ════════════════
  mk({
    exerciseId: "java_m30_5_t1_ex_13", position: 13, level: "medium", type: "code_scratch",
    title: "Valid Sudoku (LeetCode #36)",
    instructions: "Check whether a partially filled 9×9 Sudoku board is valid: no digit repeats within any row, column, or 3×3 box. Empty cells are '.'. One pass with a single HashSet of tagged keys (row/col/box) — return false on the first duplicate.",
    expectedSolution: `import java.util.*;
public class ValidSudoku {
    static boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                char v = board[r][c];
                if (v == '.') continue;
                if (!seen.add("r" + r + v) || !seen.add("c" + c + v)
                        || !seen.add("b" + (r / 3) + (c / 3) + v))
                    return false;       // add() returns false if already present
            }
        return true;
    }
    public static void main(String[] a) {
        char[][] board = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
        System.out.println(isValidSudoku(board));   // true
        System.out.println("3 HashSets in one pass via tagged keys; box = (r/3,c/3). O(81)");
    }
}`,
    hints: ["Tag each key so row/col/box live in one set: \"r\"+r+v etc.", "Box index = (r/3, c/3)", "Set.add returns false when the value already exists"],
    testCases: exec("true", "box = (r/3,c/3)"),
  }),
  mk({
    exerciseId: "java_m30_5_t1_ex_14", position: 14, level: "medium", type: "code_scratch",
    title: "Spiral Matrix II (LeetCode #59)",
    instructions: "Generate an n×n matrix filled with 1..n² in spiral order (right → down → left → up, spiraling inward). Use four shrinking boundaries (top/bottom/left/right) and a running counter.",
    expectedSolution: `import java.util.*;
public class SpiralMatrixII {
    static int[][] generateMatrix(int n) {
        int[][] m = new int[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1, val = 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) m[top][c] = val++;  top++;
            for (int r = top; r <= bottom; r++) m[r][right] = val++; right--;
            if (top <= bottom) { for (int c = right; c >= left; c--) m[bottom][c] = val++; bottom--; }
            if (left <= right) { for (int r = bottom; r >= top; r--) m[r][left] = val++; left++; }
        }
        return m;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.deepToString(generateMatrix(3)));
        // [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
        System.out.println("Four shrinking boundaries, fill 1..n^2 inward. O(n^2)");
    }
}`,
    hints: ["Same boundary technique as reading a spiral, but you WRITE val++", "Shrink each boundary right after consuming that side", "Guard the bottom row / left col passes with top<=bottom / left<=right"],
    testCases: exec("[[1, 2, 3], [8, 9, 4], [7, 6, 5]]", "shrinking boundaries"),
  }),

  // ════════════════ M35 — Trees & BST ════════════════
  mk({
    exerciseId: "java_m35_t1_ex_17", position: 17, level: "easy", type: "code_scratch",
    title: "Average of Levels in Binary Tree (LeetCode #637)",
    instructions: "Return a list of the average value of the nodes on each level, top to bottom. Level-order BFS: process one level at a time, sum its values, divide by the level size. Use a long for the sum to avoid overflow.",
    expectedSolution: `import java.util.*;
public class AverageOfLevels {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }
    static List<Double> averageOfLevels(TreeNode root) {
        List<Double> res = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            int size = q.size(); long sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll(); sum += n.val;
                if (n.left  != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
            res.add(sum / (double) size);
        }
        return res;
    }
    public static void main(String[] a) {
        TreeNode r = new TreeNode(3);
        r.left = new TreeNode(9); r.right = new TreeNode(20);
        r.right.left = new TreeNode(15); r.right.right = new TreeNode(7);
        System.out.println(averageOfLevels(r));   // [3.0, 14.5, 11.0]
        System.out.println("Level-order BFS, average per level (use long for the sum). O(n)");
    }
}`,
    hints: ["Capture q.size() before draining the level", "Accumulate the level sum in a long", "Enqueue children as you poll each node"],
    testCases: exec("[3.0, 14.5, 11.0]", "average per level"),
  }),
  mk({
    exerciseId: "java_m35_t2_ex_13", position: 13, level: "medium", type: "code_scratch",
    title: "Construct Binary Tree from Preorder and Inorder (LeetCode #105)",
    instructions: "Rebuild a binary tree from its preorder and inorder traversals (values unique). preorder[0] is the root; its index in inorder splits the left subtree (before it) from the right (after it). Use a HashMap of value→inorder index for O(1) splits and a moving preorder pointer.",
    expectedSolution: `import java.util.*;
public class ConstructFromPreIn {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }
    static int pre;
    static Map<Integer,Integer> idx;
    static TreeNode buildTree(int[] preorder, int[] inorder) {
        pre = 0; idx = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }
    static TreeNode build(int[] preorder, int lo, int hi) {
        if (lo > hi) return null;
        int rootVal = preorder[pre++];
        TreeNode root = new TreeNode(rootVal);
        int mid = idx.get(rootVal);                 // split point in inorder
        root.left  = build(preorder, lo, mid - 1);
        root.right = build(preorder, mid + 1, hi);
        return root;
    }
    static List<Integer> level(TreeNode root) {
        List<Integer> r = new ArrayList<>(); Queue<TreeNode> q = new LinkedList<>();
        if (root != null) q.add(root);
        while (!q.isEmpty()) { TreeNode n = q.poll(); r.add(n.val);
            if (n.left != null) q.add(n.left); if (n.right != null) q.add(n.right); }
        return r;
    }
    public static void main(String[] a) {
        TreeNode root = buildTree(new int[]{3,9,20,15,7}, new int[]{9,3,15,20,7});
        System.out.println(level(root));   // [3, 9, 20, 15, 7]
        System.out.println("preorder[0]=root; inorder splits left/right; HashMap for O(1) index. O(n)");
    }
}`,
    hints: ["Consume preorder left-to-right with a single moving pointer", "Root's inorder index separates left (lo..mid-1) and right (mid+1..hi)", "Build LEFT before RIGHT to match preorder consumption order"],
    testCases: exec("[3, 9, 20, 15, 7]", "inorder splits left/right"),
  }),
  mk({
    exerciseId: "java_m35_t2_ex_14", position: 14, level: "medium", type: "predict_output",
    title: "Trace: reconstruct tree from preorder + inorder",
    instructions: "preorder = `[3, 9, 20, 15, 7]`, inorder = `[9, 3, 15, 20, 7]`. Identify the root and the left/right inorder partitions, then give the resulting tree's LEVEL-ORDER traversal.",
    expectedSolution: `Root = preorder[0] = 3.
In inorder [9, 3, 15, 20, 7], 3 is at index 1:
  left subtree inorder  = [9]
  right subtree inorder = [15, 20, 7]
Next preorder value 9 -> left child (leaf).
Next preorder value 20 -> root of right subtree; inorder [15 | 20 | 7] -> left 15, right 7.

Tree:        3
            / \\
           9   20
              /  \\
            15    7

Level-order: [3, 9, 20, 15, 7]`,
    hints: ["The first preorder value is always the current subtree's root", "Find that root inside inorder to split left vs right"],
    testCases: txt("[3, 9, 20, 15, 7]"),
  }),

  // ════════════════ M39 — Binary Search ════════════════
  mk({
    exerciseId: "java_m39_t1_ex_6", position: 6, level: "medium", type: "code_scratch",
    title: "Find First and Last Position of Element (LeetCode #34)",
    instructions: "In a sorted array with duplicates, return the first and last index of target, or [-1, -1] if absent. Run two binary searches: one biased left (keep moving hi after a match) for the first index, one biased right for the last — both O(log n).",
    expectedSolution: `import java.util.*;
public class FirstLastPosition {
    static int[] searchRange(int[] nums, int target) {
        return new int[]{ bound(nums, target, true), bound(nums, target, false) };
    }
    static int bound(int[] nums, int target, boolean first) {
        int lo = 0, hi = nums.length - 1, res = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) { res = mid; if (first) hi = mid - 1; else lo = mid + 1; }
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return res;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.toString(searchRange(new int[]{5,7,7,8,8,10}, 8)));   // [3, 4]
        System.out.println(Arrays.toString(searchRange(new int[]{5,7,7,8,8,10}, 6)));   // [-1, -1]
        System.out.println("Two binary searches: leftmost + rightmost match. O(log n)");
    }
}`,
    hints: ["On a match, don't stop — record it and keep searching the chosen side", "first=true biases hi=mid-1; first=false biases lo=mid+1", "Absent target leaves res = -1 for both"],
    testCases: exec("[3, 4]", "[-1, -1]", "leftmost + rightmost"),
  }),
  mk({
    exerciseId: "java_m39_t2_ex_6", position: 6, level: "hard", type: "code_scratch",
    title: "Median of Two Sorted Arrays (LeetCode #4)",
    instructions: "Return the median of two sorted arrays in O(log(min(m,n))). Binary-search a partition of the smaller array; the partition of the larger is forced by the half-count. A valid partition has every left element ≤ every right element.",
    expectedSolution: `import java.util.*;
public class MedianTwoSorted {
    static double findMedianSortedArrays(int[] A, int[] B) {
        if (A.length > B.length) return findMedianSortedArrays(B, A);   // search the smaller
        int m = A.length, n = B.length, lo = 0, hi = m, half = (m + n + 1) / 2;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;
            int aL = i == 0 ? Integer.MIN_VALUE : A[i - 1], aR = i == m ? Integer.MAX_VALUE : A[i];
            int bL = j == 0 ? Integer.MIN_VALUE : B[j - 1], bR = j == n ? Integer.MAX_VALUE : B[j];
            if (aL <= bR && bL <= aR) {
                if (((m + n) & 1) == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            } else if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        return 0.0;
    }
    public static void main(String[] a) {
        System.out.println(findMedianSortedArrays(new int[]{1, 3}, new int[]{2}));     // 2.0
        System.out.println(findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4}));   // 2.5
        System.out.println("Binary-search the partition on the smaller array. O(log min(m,n))");
    }
}`,
    hints: ["Always binary-search the shorter array to bound the work", "j = half - i forces the other partition", "Valid when aLeft <= bRight AND bLeft <= aRight; use ±INF at the ends"],
    testCases: exec("2.0", "2.5", "partition on the smaller array"),
  }),
  mk({
    exerciseId: "java_m39_t2_ex_7", position: 7, level: "medium", type: "predict_output",
    title: "Trace: median of two sorted arrays",
    instructions: "A = `[1, 3]`, B = `[2]`. Conceptually merge them into one sorted array and give the median (for an odd total length, the median is the single middle element).",
    expectedSolution: `Merged sorted view: [1, 2, 3]
Total length = 3 (odd) -> median is the middle element at index 1.

Median = 2.0`,
    hints: ["Odd total length -> middle element; even -> average of the two middles", "You don't actually merge in the real solution — but the value matches"],
    testCases: txt("2.0"),
  }),
  mk({
    exerciseId: "java_m39_t2_ex_8", position: 8, level: "hard", type: "code_scratch",
    title: "Split Array Largest Sum (LeetCode #410)",
    instructions: "Split the array into k non-empty contiguous subarrays so the largest subarray sum is minimized; return that minimized largest sum. Binary-search the ANSWER over [max element, total sum]; for a candidate cap, greedily count how many pieces are needed.",
    expectedSolution: `import java.util.*;
public class SplitArrayLargestSum {
    static int splitArray(int[] nums, int k) {
        int lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (pieces(nums, mid) <= k) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    static int pieces(int[] nums, int cap) {
        int count = 1, cur = 0;
        for (int x : nums) {
            if (cur + x > cap) { count++; cur = x; }
            else cur += x;
        }
        return count;
    }
    public static void main(String[] a) {
        System.out.println(splitArray(new int[]{7, 2, 5, 10, 8}, 2));   // 18
        System.out.println("Binary search on the answer (max subarray sum); greedy piece count. O(n log sum)");
    }
}`,
    hints: ["Answer lies in [max single element, sum of all]", "Feasibility(cap): greedily count pieces, feasible if pieces <= k", "Fewer-or-equal pieces => try smaller cap (hi = mid)"],
    testCases: exec("18", "Binary search on the answer"),
  }),
  mk({
    exerciseId: "java_m39_t2_ex_9", position: 9, level: "medium", type: "code_scratch",
    title: "Capacity to Ship Packages Within D Days (LeetCode #1011)",
    instructions: "Packages must ship in order within `days` days; find the minimum ship capacity. Same 'binary search on the answer' pattern as #410: search capacity over [max weight, total weight]; greedily count days needed for a candidate capacity.",
    expectedSolution: `import java.util.*;
public class ShipPackagesInDays {
    static int shipWithinDays(int[] weights, int days) {
        int lo = 0, hi = 0;
        for (int w : weights) { lo = Math.max(lo, w); hi += w; }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (daysNeeded(weights, mid) <= days) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    static int daysNeeded(int[] w, int cap) {
        int d = 1, cur = 0;
        for (int x : w) {
            if (cur + x > cap) { d++; cur = x; }
            else cur += x;
        }
        return d;
    }
    public static void main(String[] a) {
        System.out.println(shipWithinDays(new int[]{1,2,3,4,5,6,7,8,9,10}, 5));   // 15
        System.out.println("Binary search on capacity; greedy day count. O(n log sum)");
    }
}`,
    hints: ["Min capacity is the heaviest package; max is the total", "daysNeeded(cap): greedily pack in order, new day when over cap", "Same skeleton as Split Array Largest Sum (#410)"],
    testCases: exec("15", "Binary search on capacity"),
  }),

  // ════════════════ M47 — Bit Manipulation ════════════════
  mk({
    exerciseId: "java_m47_t2_ex_4", position: 4, level: "medium", type: "code_scratch",
    title: "Sum of Two Integers — no + or - (LeetCode #371)",
    instructions: "Add two integers without using + or -. XOR gives the sum without carries; (a & b) << 1 gives the carries. Repeat until there is no carry left.",
    expectedSolution: `public class SumOfTwoIntegers {
    static int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;   // bits that carry
            a = a ^ b;                  // sum without carry
            b = carry;                  // fold the carry back in
        }
        return a;
    }
    public static void main(String[] x) {
        System.out.println(getSum(2, 3));    // 5
        System.out.println(getSum(-2, 3));   // 1
        System.out.println("Add without + : XOR = sum-no-carry, (a&b)<<1 = carry; loop until carry 0");
    }
}`,
    hints: ["XOR adds bit-by-bit ignoring carry", "AND then shift-left locates the carry bits", "Two's complement makes this work for negatives too"],
    testCases: exec("5", "1", "XOR = sum-no-carry"),
  }),
  mk({
    exerciseId: "java_m47_t2_ex_5", position: 5, level: "easy", type: "code_scratch",
    title: "Find the Difference (LeetCode #389)",
    instructions: "String t is string s shuffled with one extra character added. Find the added character. XOR all characters of s and t together — every shared character cancels, leaving the extra one.",
    expectedSolution: `public class FindTheDifference {
    static char findTheDifference(String s, String t) {
        int x = 0;
        for (char c : s.toCharArray()) x ^= c;
        for (char c : t.toCharArray()) x ^= c;
        return (char) x;
    }
    public static void main(String[] a) {
        System.out.println(findTheDifference("abcd", "abcde"));   // e
        System.out.println("XOR all chars of both strings — pairs cancel, the added char remains. O(n)");
    }
}`,
    hints: ["x ^ x == 0, so duplicates vanish", "XOR is order-independent — shuffling doesn't matter", "Cast the final int back to char"],
    testCases: exec("e", "pairs cancel"),
  }),
  mk({
    exerciseId: "java_m47_t3_ex_4", position: 4, level: "easy", type: "code_scratch",
    title: "Number of 1 Bits — Hamming weight (LeetCode #191)",
    instructions: "Count the number of set bits (1s) in an integer. Use the trick n &= (n-1), which clears the lowest set bit each time — the loop runs exactly once per set bit.",
    expectedSolution: `public class NumberOf1Bits {
    static int hammingWeight(int n) {
        int count = 0;
        while (n != 0) { n &= (n - 1); count++; }   // clear lowest set bit
        return count;
    }
    public static void main(String[] a) {
        System.out.println(hammingWeight(11));    // 3   (1011)
        System.out.println(hammingWeight(128));   // 1   (10000000)
        System.out.println("n &= (n-1) clears the lowest set bit; count iterations. O(set bits)");
    }
}`,
    hints: ["n-1 flips the lowest set bit and everything below it", "ANDing clears exactly that lowest set bit", "Loops only as many times as there are 1s"],
    testCases: exec("3", "1", "clears the lowest set bit"),
  }),
  mk({
    exerciseId: "java_m47_t3_ex_5", position: 5, level: "warmup", type: "predict_output",
    title: "Trace: n &= (n-1) bit clearing",
    instructions: "n = 12 (binary 1100). Repeatedly apply `n &= (n - 1)` until n becomes 0. How many iterations does it take (i.e., how many set bits does 12 have)?",
    expectedSolution: `12 = 1100
  iter 1: 1100 & 1011 = 1000  (cleared lowest set bit; n=8), count 1
  iter 2: 1000 & 0111 = 0000  (n=0), count 2

Iterations = 2  (12 has two set bits)`,
    hints: ["Each iteration removes exactly one set bit", "Count = number of 1s in the binary form"],
    testCases: txt("2"),
  }),
  mk({
    exerciseId: "java_m47_t3_ex_6", position: 6, level: "easy", type: "code_scratch",
    title: "Power of Two (LeetCode #231)",
    instructions: "Return whether n is a power of two. A positive power of two has exactly ONE set bit, so n & (n-1) clears it to zero. Remember to reject n <= 0.",
    expectedSolution: `public class PowerOfTwo {
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
    public static void main(String[] a) {
        System.out.println(isPowerOfTwo(16));   // true
        System.out.println(isPowerOfTwo(6));    // false
        System.out.println("A power of two has exactly one set bit -> n & (n-1) == 0");
    }
}`,
    hints: ["Powers of two: 1, 10, 100, 1000 ... one bit only", "n & (n-1) clears the lowest set bit -> zero iff single bit", "Guard n > 0 (0 and negatives are not powers of two)"],
    testCases: exec("true", "false", "exactly one set bit"),
  }),
  mk({
    exerciseId: "java_m47_t3_ex_7", position: 7, level: "easy", type: "code_scratch",
    title: "Counting Bits (LeetCode #338)",
    instructions: "Return an array where ans[i] = number of set bits in i, for i in 0..n. Build it with DP: ans[i] = ans[i >> 1] + (i & 1) — drop the lowest bit and add it back.",
    expectedSolution: `import java.util.*;
public class CountingBits {
    static int[] countBits(int n) {
        int[] bits = new int[n + 1];
        for (int i = 1; i <= n; i++) bits[i] = bits[i >> 1] + (i & 1);
        return bits;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.toString(countBits(5)));   // [0, 1, 1, 2, 1, 2]
        System.out.println("DP: bits[i] = bits[i>>1] + (i&1). O(n)");
    }
}`,
    hints: ["i >> 1 is i with its lowest bit removed (already computed)", "(i & 1) is that lowest bit", "Avoids recounting from scratch for every i"],
    testCases: exec("[0, 1, 1, 2, 1, 2]", "bits[i>>1]"),
  }),
  mk({
    exerciseId: "java_m47_t4_ex_3", position: 3, level: "medium", type: "code_scratch",
    title: "Single Number II (LeetCode #137)",
    instructions: "Every element appears exactly three times except one, which appears once — find it in O(n) time and O(1) space. Use a two-state bitmask (ones/twos) so each bit resets to 0 after its third occurrence.",
    expectedSolution: `public class SingleNumberII {
    static int singleNumber(int[] nums) {
        int ones = 0, twos = 0;
        for (int x : nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
    public static void main(String[] a) {
        System.out.println(singleNumber(new int[]{2, 2, 3, 2}));           // 3
        System.out.println(singleNumber(new int[]{0, 1, 0, 1, 0, 1, 99})); // 99
        System.out.println("Two-state bitmask (ones/twos): each bit cancels on its 3rd occurrence. O(n), O(1)");
    }
}`,
    hints: ["Plain XOR fails because triples don't cancel", "ones holds bits seen once, twos bits seen twice", "After the 3rd time a bit appears, both states clear it"],
    testCases: exec("3", "99", "3rd occurrence"),
  }),
  mk({
    exerciseId: "java_m47_t4_ex_4", position: 4, level: "medium", type: "code_scratch",
    title: "Single Number III (LeetCode #260)",
    instructions: "Exactly two elements appear once; every other appears twice. Return the two singles. XOR everything to get a^b; isolate any set bit where they differ (lowest set bit), then partition the array by that bit and XOR each group.",
    expectedSolution: `import java.util.*;
public class SingleNumberIII {
    static int[] singleNumber(int[] nums) {
        int xor = 0;
        for (int x : nums) xor ^= x;        // = a ^ b
        int diff = xor & (-xor);            // lowest bit where a and b differ
        int a = 0, b = 0;
        for (int x : nums) {
            if ((x & diff) != 0) a ^= x;
            else b ^= x;
        }
        return new int[]{ Math.min(a, b), Math.max(a, b) };
    }
    public static void main(String[] x) {
        System.out.println(Arrays.toString(singleNumber(new int[]{1, 2, 1, 3, 2, 5})));   // [3, 5]
        System.out.println("XOR all -> a^b; isolate a differing bit; partition into two groups. O(n)");
    }
}`,
    hints: ["XOR of everything = a ^ b (pairs cancel)", "x & (-x) isolates the lowest set bit", "That bit differs between a and b, so it splits them into separate groups"],
    testCases: exec("[3, 5]", "isolate a differing bit"),
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED — additive: only upserts ProExercise docs onto EXISTING topics.
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");

  const ALLOWED = new Set(["java_m30", "java_m30_5", "java_m35", "java_m39", "java_m47"]);
  let seeded = 0, skipped = 0;
  for (const e of EXERCISES) {
    if (!ALLOWED.has(e.moduleId)) { console.error(`✗ OUT OF LANE, refusing: ${e.exerciseId}`); skipped++; continue; }
    const topic = await Top.findOne({ topicId: e.topicId });
    if (!topic) { console.error(`✗ topic ${e.topicId} missing — skipping ${e.exerciseId}`); skipped++; continue; }
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    seeded++;
  }

  console.log(`\n✓ seeded/updated ${seeded} exercises${skipped ? `, skipped ${skipped}` : ""}`);
  for (const t of ["java_m30_t1", "java_m30_t2", "java_m30_t5", "java_m30_5_t1", "java_m35_t1", "java_m35_t2", "java_m39_t1", "java_m39_t2", "java_m47_t2", "java_m47_t3", "java_m47_t4"]) {
    console.log(`   ${t}: ${await Exr.countDocuments({ topicId: t })} exercises`);
  }

  const mine = EXERCISES.map(e => e.exerciseId);
  const bad = await Exr.find({ exerciseId: { $in: mine }, $or: [{ level: { $nin: ["warmup", "easy", "medium", "hard"] } }, { type: { $nin: ["code_scratch", "predict_output", "pattern_match", "text_match", "fill_blank"] } }] }).toArray();
  console.log(`   invalid level/type among new docs: ${bad.length}`);
  const missing = mine.length - await Exr.countDocuments({ exerciseId: { $in: mine } });
  console.log(`\n✅ Session A DSA Animator gaps: ${mine.length} exercise docs, ${missing} missing.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
