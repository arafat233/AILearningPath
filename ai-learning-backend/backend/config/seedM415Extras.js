/**
 * seedM415Extras.js — round out the M41.5 "DSA: Greedy & Intervals" module
 * (DSA_ANIMATOR_GAP_CHECKLIST.md, optional polish). Adds the canonical
 * Merge Intervals (#56) + Meeting Rooms II (#253) to the Intervals topic and
 * Assign Cookies (#455) + Lemonade Change (#860) to the Greedy topic, so the
 * module reads as a complete first-class section. Additive copies (the #56/#253
 * originals in M38/M36 are left untouched). Idempotent.
 *
 * Usage: node config/seedM415Extras.js
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
    hints: o.hints, difficulty: DIFF[o.level] ?? 0.5, xpReward: XP[o.level] ?? 15,
  };
}
const exec = (...subs) => [{ type: "execution", expected_stdout_contains: subs }];

const EXERCISES = [
  // ── Intervals (T2) ──
  mk({
    exerciseId: "java_m41_5_t2_ex_4", position: 4, level: "medium",
    title: "Merge Intervals (LeetCode #56)",
    instructions: "Merge all overlapping intervals. Sort by START, then walk: if the current interval overlaps the last kept one, extend its end; otherwise start a new one.",
    expectedSolution: `import java.util.*;
public class MergeIntervals {
    static int[][] merge(int[][] iv) {
        Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> res = new ArrayList<>();
        for (int[] x : iv) {
            if (res.isEmpty() || res.get(res.size() - 1)[1] < x[0]) res.add(x);
            else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], x[1]);
        }
        return res.toArray(new int[0][]);
    }
    public static void main(String[] a) {
        System.out.println(Arrays.deepToString(merge(new int[][]{{1,3},{2,6},{8,10},{15,18}})));
        // [[1, 6], [8, 10], [15, 18]]
        System.out.println("Sort by START; extend the last end on overlap. O(n log n)");
    }
}`,
    hints: ["Sort by start first", "Overlap when next.start <= last.end", "Extend with max(last.end, next.end)"],
    testCases: exec("[[1, 6], [8, 10], [15, 18]]", "Sort by START"),
  }),
  mk({
    exerciseId: "java_m41_5_t2_ex_5", position: 5, level: "medium",
    title: "Meeting Rooms II (LeetCode #253)",
    instructions: "Find the minimum number of conference rooms required. Sweep line: sort start times and end times separately; walk starts, freeing a room whenever an end time has passed. The peak concurrency is the answer.",
    expectedSolution: `import java.util.*;
public class MeetingRoomsII {
    static int minMeetingRooms(int[][] iv) {
        int n = iv.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = iv[i][0]; ends[i] = iv[i][1]; }
        Arrays.sort(starts); Arrays.sort(ends);
        int rooms = 0, best = 0, e = 0;
        for (int s = 0; s < n; s++) {
            while (e < n && ends[e] <= starts[s]) { rooms--; e++; }
            rooms++;
            best = Math.max(best, rooms);
        }
        return best;
    }
    public static void main(String[] a) {
        System.out.println(minMeetingRooms(new int[][]{{0,30},{5,10},{15,20}}));   // 2
        System.out.println(minMeetingRooms(new int[][]{{7,10},{2,4}}));            // 1
        System.out.println("Sweep line: sort starts & ends; +1 on a start, -1 on a freed end. Peak = rooms. O(n log n)");
    }
}`,
    hints: ["Decouple starts and ends into two sorted arrays", "Free a room when the earliest end <= current start", "Track the peak room count"],
    testCases: exec("2", "1", "Sweep line"),
  }),
  // ── Greedy (T1) ──
  mk({
    exerciseId: "java_m41_5_t1_ex_3", position: 3, level: "easy",
    title: "Assign Cookies (LeetCode #455)",
    instructions: "Each child i has greed g[i]; each cookie j has size s[j]. A child is content if a cookie's size ≥ their greed. Maximize content children. Sort both and greedily give the smallest adequate cookie to the least greedy remaining child.",
    expectedSolution: `import java.util.*;
public class AssignCookies {
    static int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g); Arrays.sort(s);
        int i = 0, j = 0;
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) i++;   // this cookie satisfies child i
            j++;
        }
        return i;
    }
    public static void main(String[] a) {
        System.out.println(findContentChildren(new int[]{1,2,3}, new int[]{1,1}));   // 1
        System.out.println(findContentChildren(new int[]{1,2}, new int[]{1,2,3}));   // 2
        System.out.println("Sort both; give the smallest adequate cookie to the least greedy child. O(n log n)");
    }
}`,
    hints: ["Sort greeds and sizes ascending", "Two pointers; advance the child only when satisfied", "Always advance the cookie pointer"],
    testCases: exec("1", "2", "least greedy"),
  }),
  mk({
    exerciseId: "java_m41_5_t1_ex_4", position: 4, level: "easy",
    title: "Lemonade Change (LeetCode #860)",
    instructions: "Each lemonade costs $5; customers pay with $5/$10/$20 in order. Can you give correct change to everyone (starting with none)? Greedy: when giving change for a $20, prefer using a $10 + $5 before three $5s (hoard $5s).",
    expectedSolution: `import java.util.*;
public class LemonadeChange {
    static boolean lemonadeChange(int[] bills) {
        int five = 0, ten = 0;
        for (int b : bills) {
            if (b == 5) five++;
            else if (b == 10) { if (five == 0) return false; five--; ten++; }
            else { // b == 20
                if (ten > 0 && five > 0) { ten--; five--; }
                else if (five >= 3) { five -= 3; }
                else return false;
            }
        }
        return true;
    }
    public static void main(String[] a) {
        System.out.println(lemonadeChange(new int[]{5,5,5,10,20}));    // true
        System.out.println(lemonadeChange(new int[]{5,5,10,10,20}));   // false
        System.out.println("Greedy: give a $10 as change before three $5s (keep $5s flexible). O(n)");
    }
}`,
    hints: ["Track only how many $5 and $10 bills you hold", "$20 change: prefer $10+$5 over three $5s", "Return false the moment you can't make change"],
    testCases: exec("true", "false", "before three $5s"),
  }),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");
  let seeded = 0, skipped = 0;
  for (const e of EXERCISES) {
    if (!/^java_m41_5_/.test(e.exerciseId)) { console.error(`✗ out of lane: ${e.exerciseId}`); skipped++; continue; }
    if (!(await Top.findOne({ topicId: e.topicId }))) { console.error(`✗ topic missing: ${e.topicId}`); skipped++; continue; }
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    seeded++;
  }
  console.log(`✓ M41.5 extras seeded: ${seeded}${skipped ? `, skipped ${skipped}` : ""}`);
  for (const t of ["java_m41_5_t1", "java_m41_5_t2"]) console.log(`   ${t}: ${await Exr.countDocuments({ topicId: t })} exercises`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
