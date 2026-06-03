/**
 * seedDsaAnimatorEasies.js — the 6 trivial "easy" dsaanimator.com problems we
 * deliberately skipped earlier (beginner volume). Additive & idempotent.
 * All land in M30 (Array Patterns). DSA_ANIMATOR_GAP_CHECKLIST.md.
 *
 * Usage: node config/seedDsaAnimatorEasies.js
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
    position: o.position, level: o.level, type: "code_scratch", title: o.title,
    scenario: "", instructions: o.instructions, starterCode: "",
    expectedSolution: o.expectedSolution, blanks: [], testCases: o.testCases,
    hints: o.hints, difficulty: DIFF[o.level] ?? 0.4, xpReward: XP[o.level] ?? 15,
  };
}
const exec = (...subs) => [{ type: "execution", expected_stdout_contains: subs }];

const EXERCISES = [
  mk({
    exerciseId: "java_m30_t3_ex_16", position: 16, level: "warmup",
    title: "Running Sum of 1d Array (LeetCode #1480)",
    instructions: "Return the running (prefix) sum: result[i] = nums[0] + … + nums[i]. Do it in-place in one pass.",
    expectedSolution: `import java.util.*;
public class RunningSum {
    static int[] runningSum(int[] nums) {
        for (int i = 1; i < nums.length; i++) nums[i] += nums[i - 1];
        return nums;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.toString(runningSum(new int[]{1,2,3,4})));   // [1, 3, 6, 10]
        System.out.println("Prefix sum in-place — each element adds the one before it. O(n)");
    }
}`,
    hints: ["Each element becomes itself plus the previous (already-summed) element", "Start at index 1", "O(n) time, O(1) extra space"],
    testCases: exec("[1, 3, 6, 10]", "Prefix sum in-place"),
  }),
  mk({
    exerciseId: "java_m30_t5_ex_17", position: 17, level: "easy",
    title: "Flipping an Image (LeetCode #832)",
    instructions: "For each row: reverse it, then invert every bit (0↔1). Return the image.",
    expectedSolution: `import java.util.*;
public class FlippingImage {
    static int[][] flipAndInvertImage(int[][] image) {
        for (int[] row : image) {
            int l = 0, r = row.length - 1;
            while (l < r) { int t = row[l]; row[l] = row[r]; row[r] = t; l++; r--; }
            for (int i = 0; i < row.length; i++) row[i] ^= 1;
        }
        return image;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.deepToString(flipAndInvertImage(new int[][]{{1,1,0},{1,0,1},{0,0,0}})));
        // [[1, 0, 0], [0, 1, 0], [1, 1, 1]]
        System.out.println("Reverse each row (two pointers), then XOR ^1 to invert. O(rows*cols)");
    }
}`,
    hints: ["Reverse with two pointers from both ends", "x ^ 1 flips a 0/1 bit", "Do both passes per row"],
    testCases: exec("[[1, 0, 0], [0, 1, 0], [1, 1, 1]]", "XOR ^1 to invert"),
  }),
  mk({
    exerciseId: "java_m30_t5_ex_18", position: 18, level: "warmup",
    title: "Shuffle the Array (LeetCode #1470)",
    instructions: "Given nums = [x1..xn, y1..yn], return [x1,y1,x2,y2,…,xn,yn] by interleaving the two halves.",
    expectedSolution: `import java.util.*;
public class ShuffleArray {
    static int[] shuffle(int[] nums, int n) {
        int[] res = new int[2 * n];
        for (int i = 0; i < n; i++) { res[2*i] = nums[i]; res[2*i + 1] = nums[i + n]; }
        return res;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.toString(shuffle(new int[]{2,5,1,3,4,7}, 3)));   // [2, 3, 5, 4, 1, 7]
        System.out.println("Interleave x[i] (first half) and x[i+n] (second half). O(n)");
    }
}`,
    hints: ["First half is nums[0..n-1], second is nums[n..2n-1]", "res[2i] = x_i, res[2i+1] = y_i", "O(n)"],
    testCases: exec("[2, 3, 5, 4, 1, 7]", "Interleave"),
  }),
  mk({
    exerciseId: "java_m30_t5_ex_19", position: 19, level: "warmup",
    title: "Richest Customer Wealth (LeetCode #1672)",
    instructions: "Each row is one customer's bank accounts. Return the maximum total wealth (max row sum).",
    expectedSolution: `import java.util.*;
public class RichestCustomer {
    static int maximumWealth(int[][] accounts) {
        int best = 0;
        for (int[] customer : accounts) {
            int sum = 0;
            for (int x : customer) sum += x;
            best = Math.max(best, sum);
        }
        return best;
    }
    public static void main(String[] a) {
        System.out.println(maximumWealth(new int[][]{{1,2,3},{3,2,1}}));        // 6
        System.out.println(maximumWealth(new int[][]{{1,5},{7,3},{3,5}}));      // 10
        System.out.println("Sum each row, keep the maximum. O(rows*cols)");
    }
}`,
    hints: ["Wealth = sum of a customer's row", "Track the max as you scan rows", "O(rows*cols)"],
    testCases: exec("6", "10", "Sum each row"),
  }),
  mk({
    exerciseId: "java_m30_t5_ex_20", position: 20, level: "warmup",
    title: "Concatenation of Array (LeetCode #1929)",
    instructions: "Return ans of length 2n where ans[i] = ans[i+n] = nums[i] — i.e. nums concatenated with itself.",
    expectedSolution: `import java.util.*;
public class ConcatArray {
    static int[] getConcatenation(int[] nums) {
        int n = nums.length;
        int[] res = new int[2 * n];
        for (int i = 0; i < n; i++) { res[i] = nums[i]; res[i + n] = nums[i]; }
        return res;
    }
    public static void main(String[] a) {
        System.out.println(Arrays.toString(getConcatenation(new int[]{1,2,1})));   // [1, 2, 1, 1, 2, 1]
        System.out.println("ans[i] = ans[i+n] = nums[i]. O(n)");
    }
}`,
    hints: ["Allocate 2n", "Write each value at i and i+n", "O(n)"],
    testCases: exec("[1, 2, 1, 1, 2, 1]", "ans[i+n]"),
  }),
  mk({
    exerciseId: "java_m30_t5_ex_21", position: 21, level: "warmup",
    title: "Find Closest Number to Zero (LeetCode #2239)",
    instructions: "Return the array value with the smallest absolute value; if two tie (e.g. -3 and 3), return the larger (positive) one.",
    expectedSolution: `import java.util.*;
public class ClosestToZero {
    static int findClosestNumber(int[] nums) {
        int best = nums[0];
        for (int x : nums) {
            if (Math.abs(x) < Math.abs(best) || (Math.abs(x) == Math.abs(best) && x > best)) best = x;
        }
        return best;
    }
    public static void main(String[] a) {
        System.out.println(findClosestNumber(new int[]{-4,-2,1,4,8}));   // 1
        System.out.println(findClosestNumber(new int[]{2,-1,1}));        // 1  (|−1|==|1| → larger)
        System.out.println("Min |x|; on a tie prefer the larger (positive) value. O(n)");
    }
}`,
    hints: ["Compare absolute values", "Tie-break toward the larger (positive) number", "O(n)"],
    testCases: exec("1", "tie", "larger (positive)"),
  }),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");
  let seeded = 0, skipped = 0;
  for (const e of EXERCISES) {
    if (!/^java_m30_/.test(e.exerciseId)) { console.error(`✗ out of lane: ${e.exerciseId}`); skipped++; continue; }
    if (!(await Top.findOne({ topicId: e.topicId }))) { console.error(`✗ topic missing: ${e.topicId}`); skipped++; continue; }
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    seeded++;
  }
  console.log(`✓ easies seeded: ${seeded}${skipped ? `, skipped ${skipped}` : ""}`);
  const mine = EXERCISES.map((e) => e.exerciseId);
  console.log(`   missing: ${mine.length - await Exr.countDocuments({ exerciseId: { $in: mine } })}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
