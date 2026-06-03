/**
 * seedDsaAnimatorGapsB.js — DSA Animator Gap Checklist, SESSION B
 * (DSA_ANIMATOR_GAP_CHECKLIST.md).
 *
 * Additive & idempotent. Fills 16 missing dsaanimator.com problems (17 exercise
 * docs incl. 1 trace) across FOUR existing modules + ONE NEW module:
 *   M31   Strings        — #271 Encode/Decode (T1), #567 Permutation in String,
 *                          #1189 Max Balloons (T4)
 *   M37   Graphs         — #1971 Path Exists (T1), #399 Evaluate Division,
 *                          #417 Pacific Atlantic (T2)
 *   M40   Backtracking   — #22 Generate Parentheses (+trace) (T1), #90 Subsets II (T2)
 *   M41   DP             — #746 Min Cost Climbing, #213 House Robber II (T2),
 *                          #120 Triangle (T3)
 *   M41.5 NEW MODULE "DSA: Greedy & Intervals" — closes the structural gap
 *          (dsaanimator has Greedy + Intervals as first-class; we had neither):
 *          Greedy T1: #134 Gas Station, #135 Candy
 *          Intervals T2: #57 Insert Interval, #435 Non-overlapping, #452 Min Arrows
 *
 * Lane: ONLY java_m31 / m37 / m40 / m41 / m41_5. Never touches Session A's
 * modules (m30/m30_5/m35/m39/m47). For existing modules: appends after max(pos).
 * Creates the new module + 2 topics (mirrors seedM30_5_2dArrayModule.js) and
 * recomputes ProTrack totals.
 *
 * Convention (verified): code_scratch -> expectedSolution is a COMPLETE runnable
 * program that prints its result; testCases assert stdout contains the printed
 * result (Arrays/List "[a, b, c]" format) + a complexity tagline.
 * predict_output -> testCases:[{type:"text_match", expected:"..."}].
 *
 * Usage: node config/seedDsaAnimatorGapsB.js
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

// ─────────────────────────────────────────────────────────────────────────────
// NEW MODULE M41.5 — "DSA: Greedy & Intervals"
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_M415 = {
  moduleId: "java_m41_5", trackKey: TRACK, moduleNumber: 41.5,
  name: "DSA: Greedy & Intervals", slug: "dsa-greedy-intervals",
  description: "Greedy decision-making and interval scheduling — the patterns behind ride dispatch, meeting-room allocation, and resource packing. When a locally optimal choice provably yields the global optimum, and how sorting intervals (by start vs by end) unlocks merge, insert, and minimum-overlap problems.",
  estimatedHours: 5, prerequisites: ["java_m41"], status: "live",
};

const TOPICS_M415 = [
  {
    topicId: "java_m41_5_t1", moduleId: "java_m41_5", trackKey: TRACK, topicNumber: 1,
    name: "Greedy — Locally Optimal Choices", slug: "greedy-locally-optimal",
    difficulty: 0.6, estimatedMinutes: 55, xpReward: 50, freeAccess: false,
    prerequisites: ["java_m41_t2"],
    problemTitle: "Make the locally best choice — and know when it's globally optimal",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nRide dispatch at Uber:\nAssign the nearest free driver to each incoming request.\nThat's a GREEDY choice — locally optimal at each step.\n\nGreedy is fast (often O(n log n)) but only correct when the problem\nhas the 'greedy-choice property': a locally optimal pick is part of\nsome globally optimal solution. When it isn't, you need DP instead.\n```",
      what_you_will_build: "Gas Station (circular tank) and Candy (two-pass) — plus the mental test for WHEN greedy is provably correct vs when it silently fails.",
    },
    teaching: {
      concept_explanation: {
        when_greedy_works: `**Greedy works when BOTH hold:**

\`\`\`
1. Greedy-choice property: a locally optimal choice is contained in
   SOME globally optimal solution (prove with an exchange argument).
2. Optimal substructure: after the greedy choice, the remaining
   subproblem is an independent instance of the same problem.

Classic correct greedies:
  - Interval scheduling: pick earliest FINISH time.
  - Huffman coding: merge two least-frequent nodes.
  - Fractional knapsack: take highest value/weight first.
  - Gas Station: total >= 0 => the unique start is reachable.

When greedy FAILS (use DP instead):
  - 0/1 knapsack (can't take fractions).
  - Coin change with arbitrary denominations.
  - Longest increasing subsequence.
\`\`\``,
        two_pass_pattern: `**Two-pass greedy (Candy):**

\`\`\`
Some problems have TWO competing constraints (left neighbour AND
right neighbour). One pass can't satisfy both. Do two:
  L->R: enforce the left constraint.
  R->L: enforce the right constraint, taking max(existing, new).
The max of both passes satisfies both constraints simultaneously.
\`\`\``,
      },
      worked_example: {
        scenario: "Gas Station — can you drive the full circle?",
        problem_statement: "Stations in a circle; gas[i] at station i, cost[i] to reach i+1. Find the start index to complete the loop, or -1.",
        step_by_step_solution: [
          { step: 1, action: "If total gas < total cost, it's impossible", details: "Sum (gas[i]-cost[i]); if negative, return -1 immediately." },
          { step: 2, action: "Track a running tank; reset start when it goes negative", details: "If you can't reach station i+1 from the current start, no station in between works either — so the next viable start is i+1." },
        ],
        final_code: `int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        total += diff; tank += diff;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`,
        expected_output: "gas=[1,2,3,4,5], cost=[3,4,5,1,2] -> 3",
        things_to_notice: [
          "The 'reset start' jump is the greedy insight — it skips provably-bad starts.",
          "total>=0 guarantees the found start works; one pass, O(n).",
          "Candy needs TWO passes because each child depends on both neighbours.",
        ],
      },
      reflection: {
        key_takeaways: [
          "Greedy = locally optimal choice; correct only with the greedy-choice property + optimal substructure.",
          "Prove correctness with an exchange argument, or fall back to DP.",
          "Two competing constraints => two passes (L->R then R->L), take the max.",
          "Gas Station: total>=0 => unique start; reset start when tank<0.",
        ],
        self_check_questions: [
          { question: "Why does resetting start to i+1 (when the tank goes negative at i) never skip a valid answer?", answer: "If the tank goes negative arriving at i, then starting from the old start fails. Crucially, every station between the old start and i also fails as a start: each had a non-negative running sum up to that point (otherwise we'd have reset earlier), so starting later only removes positive prefix contributions — it can't help reach i. Hence the earliest possible new start is i+1." },
        ],
        next_topic_preview: "Next: Intervals — sort by start to merge/insert, sort by end to maximize non-overlap.",
      },
    },
  },
  {
    topicId: "java_m41_5_t2", moduleId: "java_m41_5", trackKey: TRACK, topicNumber: 2,
    name: "Intervals — Merge, Insert, Sweep Line", slug: "intervals-merge-insert",
    difficulty: 0.6, estimatedMinutes: 55, xpReward: 50, freeAccess: false,
    prerequisites: ["java_m41_5_t1"],
    problemTitle: "Sort intervals the right way, then sweep",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nMeeting-room booking at any office:\nGiven start/end times, how many rooms are needed? Which bookings\noverlap? Can a new booking be inserted?\n\nThe whole family reduces to ONE decision: sort by START or by END?\n  Sort by START  -> merge / insert overlapping intervals.\n  Sort by END    -> maximize non-overlapping picks / min 'arrows'.\n```",
      what_you_will_build: "Insert Interval (3-phase), Non-overlapping Intervals and Minimum Arrows (both 'sort by end' greedy).",
    },
    teaching: {
      concept_explanation: {
        sort_key_decides: `**The sort key decides the algorithm:**

\`\`\`
SORT BY START (a[0]):
  - Merge Intervals: walk sorted; extend current end on overlap.
  - Insert Interval: 3 phases (before / merge-overlap / after).
  Overlap test: next.start <= current.end.

SORT BY END (a[1]):  <- greedy "keep earliest finisher"
  - Non-overlapping Intervals (min removals): keep an interval if its
    start >= last kept end; else remove it.
  - Minimum Arrows: one arrow per group of overlapping balloons; new
    arrow when start > current end.
  Why end? Finishing earliest leaves the most room for the rest —
    the interval-scheduling greedy.
\`\`\``,
        sweep_line: `**Sweep line (counting overlaps / rooms):**

\`\`\`
Separate starts and ends, sort each. Sweep time left to right:
  +1 on a start, -1 on an end. The running max is the peak overlap
  (e.g. Meeting Rooms II = max concurrent meetings = rooms needed).
\`\`\``,
      },
      worked_example: {
        scenario: "Insert Interval — splice a new booking into a sorted schedule.",
        problem_statement: "Given non-overlapping intervals sorted by start and a newInterval, insert it and merge as needed.",
        step_by_step_solution: [
          { step: 1, action: "Copy all intervals ending before newInterval starts", details: "intervals[i].end < newInterval.start — no overlap, keep as-is." },
          { step: 2, action: "Merge every interval that overlaps newInterval", details: "While intervals[i].start <= newInterval.end, widen newInterval to the min start / max end." },
          { step: 3, action: "Append the merged newInterval, then the rest", details: "Everything after is already past newInterval — copy unchanged." },
        ],
        final_code: `int[][] insert(int[][] intervals, int[] ni) {
    List<int[]> res = new ArrayList<>();
    int i = 0, n = intervals.length;
    while (i < n && intervals[i][1] < ni[0]) res.add(intervals[i++]);
    while (i < n && intervals[i][0] <= ni[1]) {
        ni[0] = Math.min(ni[0], intervals[i][0]);
        ni[1] = Math.max(ni[1], intervals[i][1]); i++;
    }
    res.add(ni);
    while (i < n) res.add(intervals[i++]);
    return res.toArray(new int[0][]);
}`,
        expected_output: "intervals=[[1,3],[6,9]], new=[2,5] -> [[1,5],[6,9]]",
        things_to_notice: [
          "Insert/Merge => sort by START. Non-overlap/Arrows => sort by END.",
          "Overlap condition is a.start <= b.end (touching counts as overlap for merge).",
          "Sweep line turns 'how many overlap at once' into a running counter.",
        ],
      },
      reflection: {
        key_takeaways: [
          "Choose the sort key first: by start (merge/insert) vs by end (max non-overlap / min arrows).",
          "Greedy 'earliest finish' maximizes how many intervals you can keep.",
          "Insert Interval = before / merge / after, three linear phases.",
          "Sweep line (+1/-1) gives peak concurrency (rooms, overlaps).",
        ],
        self_check_questions: [
          { question: "For Non-overlapping Intervals and Minimum Arrows, why sort by END rather than by START?", answer: "Both are interval-scheduling problems: you want to keep (or pierce) as many compatible intervals as possible. The interval that FINISHES earliest leaves the maximum remaining room for the others, so greedily committing to the earliest-finishing interval is provably optimal (exchange argument). Sorting by start can commit you to a long interval that finishes late and blocks several shorter ones." },
        ],
        next_topic_preview: "You've now covered the greedy + interval interview canon. Next: full DP synthesis and interview strategy (M41 T5).",
      },
    },
  },
];

const EXERCISES = [
  // ════════════════ M31 — Strings ════════════════
  mk({
    exerciseId: "java_m31_t1_ex_16", position: 16, level: "medium", type: "code_scratch",
    title: "Encode and Decode Strings (LeetCode #271)",
    instructions: "Design encode(List<String>) -> String and decode(String) -> List<String> that round-trip ANY strings (including ones containing your delimiter). Use length-prefix framing: write each string as len + '#' + str; on decode, read the length, then slice exactly that many chars.",
    expectedSolution: `import java.util.*;
public class EncodeDecodeStrings {
    static String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) sb.append(s.length()).append('#').append(s);
        return sb.toString();
    }
    static List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (s.charAt(j) != '#') j++;          // read the length digits
            int len = Integer.parseInt(s.substring(i, j));
            res.add(s.substring(j + 1, j + 1 + len)); // slice exactly len chars
            i = j + 1 + len;
        }
        return res;
    }
    public static void main(String[] a) {
        List<String> in = Arrays.asList("lint", "code", "love you");
        System.out.println(decode(encode(in)));   // [lint, code, love you]
        System.out.println("Length-prefix encoding (len#str) — survives any delimiter inside strings. O(n)");
    }
}`,
    hints: ["A plain separator fails if the strings can contain it", "Prefix each string with its length and a marker", "Decoding reads the length, then takes exactly that many chars"],
    testCases: exec("[lint, code, love you]", "Length-prefix"),
  }),
  mk({
    exerciseId: "java_m31_t4_ex_16", position: 16, level: "medium", type: "code_scratch",
    title: "Permutation in String (LeetCode #567)",
    instructions: "Return true if s2 contains a permutation of s1 as a substring. Slide a fixed window of length s1.length() across s2, maintaining a 26-letter frequency count; it's a match whenever the window's counts equal s1's counts.",
    expectedSolution: `import java.util.*;
public class PermutationInString {
    static boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        int[] need = new int[26], win = new int[26];
        for (char c : s1.toCharArray()) need[c - 'a']++;
        for (int i = 0; i < s2.length(); i++) {
            win[s2.charAt(i) - 'a']++;
            if (i >= s1.length()) win[s2.charAt(i - s1.length()) - 'a']--;  // drop left
            if (Arrays.equals(need, win)) return true;
        }
        return false;
    }
    public static void main(String[] a) {
        System.out.println(checkInclusion("ab", "eidbaooo"));   // true  (contains "ba")
        System.out.println(checkInclusion("ab", "eidboaoo"));   // false
        System.out.println("Fixed-size sliding window over a 26-letter frequency count. O(n)");
    }
}`,
    hints: ["A permutation = same multiset of letters = same frequency array", "Window size is exactly s1.length(); add right, drop left", "Compare the two count arrays each step"],
    testCases: exec("true", "false", "frequency count"),
  }),
  mk({
    exerciseId: "java_m31_t4_ex_17", position: 17, level: "easy", type: "code_scratch",
    title: "Maximum Number of Balloons (LeetCode #1189)",
    instructions: "Given a string text, how many times can you spell \"balloon\" using its letters (each letter used once)? Count letter frequencies; 'l' and 'o' are needed twice, so halve those counts; the answer is the min across b, a, l/2, o/2, n.",
    expectedSolution: `import java.util.*;
public class MaxNumberOfBalloons {
    static int maxNumberOfBalloons(String text) {
        int[] cnt = new int[26];
        for (char c : text.toCharArray()) cnt[c - 'a']++;
        int l = cnt['l' - 'a'] / 2, o = cnt['o' - 'a'] / 2;     // needed twice
        return Math.min(Math.min(cnt['b' - 'a'], cnt['a' - 'a']),
                        Math.min(Math.min(l, o), cnt['n' - 'a']));
    }
    public static void main(String[] a) {
        System.out.println(maxNumberOfBalloons("loonbalxballpoon"));   // 2
        System.out.println(maxNumberOfBalloons("nlaebolko"));          // 1
        System.out.println("Char frequency; l and o are needed twice -> halve them, take the min. O(n)");
    }
}`,
    hints: ["Count every letter first", "\"balloon\" uses l twice and o twice", "Answer = min(b, a, l/2, o/2, n)"],
    testCases: exec("2", "1", "needed twice"),
  }),

  // ════════════════ M37 — Graphs ════════════════
  mk({
    exerciseId: "java_m37_t1_ex_8", position: 8, level: "easy", type: "code_scratch",
    title: "Find if Path Exists in Graph (LeetCode #1971)",
    instructions: "Given an undirected graph with n nodes and an edge list, determine whether a path exists from source to destination. Union-Find: union the endpoints of every edge, then check whether source and destination share a root.",
    expectedSolution: `import java.util.*;
public class FindPathExists {
    static int[] parent;
    static int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
    static boolean validPath(int n, int[][] edges, int source, int destination) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) parent[find(e[0])] = find(e[1]);
        return find(source) == find(destination);
    }
    public static void main(String[] a) {
        System.out.println(validPath(3, new int[][]{{0,1},{1,2},{2,0}}, 0, 2));            // true
        System.out.println(validPath(6, new int[][]{{0,1},{0,2},{3,5},{5,4},{4,3}}, 0, 5)); // false
        System.out.println("Union-Find with path compression — connected iff same root. ~O(E a(n))");
    }
}`,
    hints: ["Connectivity, not shortest path — Union-Find (or BFS/DFS) suffices", "Union both endpoints of each edge", "Path exists iff find(source) == find(destination)"],
    testCases: exec("true", "false", "Union-Find"),
  }),
  mk({
    exerciseId: "java_m37_t2_ex_7", position: 7, level: "medium", type: "code_scratch",
    title: "Evaluate Division (LeetCode #399)",
    instructions: "Equations like a/b = 2.0 define a weighted graph (edge a->b = 2.0, b->a = 0.5). For each query x/y, DFS from x to y multiplying edge weights along the path; return -1.0 if either variable is unknown or unreachable.",
    expectedSolution: `import java.util.*;
public class EvaluateDivision {
    static Map<String, Map<String, Double>> g;
    static double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
        g = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            String a = equations.get(i).get(0), b = equations.get(i).get(1);
            g.computeIfAbsent(a, k -> new HashMap<>()).put(b, values[i]);
            g.computeIfAbsent(b, k -> new HashMap<>()).put(a, 1.0 / values[i]);
        }
        double[] res = new double[queries.size()];
        for (int i = 0; i < queries.size(); i++)
            res[i] = dfs(queries.get(i).get(0), queries.get(i).get(1), new HashSet<>());
        return res;
    }
    static double dfs(String cur, String target, Set<String> seen) {
        if (!g.containsKey(cur) || !g.containsKey(target)) return -1.0;
        if (cur.equals(target)) return 1.0;
        seen.add(cur);
        for (Map.Entry<String, Double> e : g.get(cur).entrySet()) {
            if (seen.contains(e.getKey())) continue;
            double sub = dfs(e.getKey(), target, seen);
            if (sub != -1.0) return e.getValue() * sub;
        }
        return -1.0;
    }
    public static void main(String[] x) {
        List<List<String>> eq = Arrays.asList(Arrays.asList("a","b"), Arrays.asList("b","c"));
        List<List<String>> q  = Arrays.asList(Arrays.asList("a","c"), Arrays.asList("b","a"), Arrays.asList("a","e"));
        System.out.println(Arrays.toString(calcEquation(eq, new double[]{2.0, 3.0}, q)));
        // a/c = 6.0, b/a = 0.5, a/e = -1.0  ->  [6.0, 0.5, -1.0]
        System.out.println("Weighted graph: edge a->b = val, b->a = 1/val; DFS multiplies along the path");
    }
}`,
    hints: ["Build a bidirectional weighted graph (val and 1/val)", "Answer a query by DFS, multiplying weights on the path", "Unknown variable or no path => -1.0; use a visited set to avoid cycles"],
    testCases: exec("[6.0, 0.5, -1.0]", "DFS multiplies along the path"),
  }),
  mk({
    exerciseId: "java_m37_t2_ex_8", position: 8, level: "medium", type: "code_scratch",
    title: "Pacific Atlantic Water Flow (LeetCode #417)",
    instructions: "Water flows from a cell to equal-or-lower neighbours. Find cells from which water can reach BOTH the Pacific (top/left borders) and Atlantic (bottom/right borders). Reverse-DFS inward from each ocean's borders (moving to equal-or-HIGHER cells); answer = cells reachable from both.",
    expectedSolution: `import java.util.*;
public class PacificAtlantic {
    static int rows, cols; static int[][] h;
    static List<List<Integer>> pacificAtlantic(int[][] heights) {
        h = heights; rows = h.length; cols = h[0].length;
        boolean[][] pac = new boolean[rows][cols], atl = new boolean[rows][cols];
        for (int r = 0; r < rows; r++) { dfs(r, 0, pac); dfs(r, cols - 1, atl); }
        for (int c = 0; c < cols; c++) { dfs(0, c, pac); dfs(rows - 1, c, atl); }
        List<List<Integer>> res = new ArrayList<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (pac[r][c] && atl[r][c]) res.add(Arrays.asList(r, c));
        return res;
    }
    static void dfs(int r, int c, boolean[][] ocean) {
        ocean[r][c] = true;
        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr<0||nr>=rows||nc<0||nc>=cols||ocean[nr][nc]||h[nr][nc] < h[r][c]) continue;
            dfs(nr, nc, ocean);   // flow inward to equal-or-higher cells
        }
    }
    public static void main(String[] a) {
        int[][] heights = {{1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}};
        System.out.println(pacificAtlantic(heights).size());   // 7
        System.out.println("Reverse DFS from BOTH oceans' borders inward (uphill); intersect reachable sets");
    }
}`,
    hints: ["Don't DFS from every cell — DFS inward FROM the borders", "Reverse the flow: move to neighbours of equal-or-greater height", "A cell qualifies iff both ocean-reachable arrays are true"],
    testCases: exec("7", "intersect reachable sets"),
  }),

  // ════════════════ M40 — Backtracking ════════════════
  mk({
    exerciseId: "java_m40_t1_ex_4", position: 4, level: "medium", type: "code_scratch",
    title: "Generate Parentheses (LeetCode #22)",
    instructions: "Generate all combinations of n well-formed parenthesis pairs. Backtrack with two counters: you may add '(' while open < n, and ')' only while close < open (so it never becomes invalid).",
    expectedSolution: `import java.util.*;
public class GenerateParentheses {
    static List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(res, new StringBuilder(), 0, 0, n);
        return res;
    }
    static void backtrack(List<String> res, StringBuilder cur, int open, int close, int n) {
        if (cur.length() == 2 * n) { res.add(cur.toString()); return; }
        if (open < n)     { cur.append('('); backtrack(res, cur, open + 1, close, n); cur.deleteCharAt(cur.length() - 1); }
        if (close < open) { cur.append(')'); backtrack(res, cur, open, close + 1, n); cur.deleteCharAt(cur.length() - 1); }
    }
    public static void main(String[] a) {
        System.out.println(generateParenthesis(3));
        // [((())), (()()), (())(), ()(()), ()()()]
        System.out.println("Backtrack: add '(' while open<n, ')' while close<open. Catalan(n) results");
    }
}`,
    hints: ["Track counts of '(' and ')' used so far", "'(' allowed while open<n; ')' allowed only while close<open", "Undo the last char after recursing (backtrack)"],
    testCases: exec("[((())), (()()), (())(), ()(()), ()()()]", "close<open"),
  }),
  mk({
    exerciseId: "java_m40_t1_ex_5", position: 5, level: "warmup", type: "predict_output",
    title: "Trace: generate parentheses for n = 2",
    instructions: "Using the rule \"add '(' while open < n, add ')' while close < open\" with n = 2, list ALL valid combinations in the order they are generated.",
    expectedSolution: `n = 2, build left-to-right (prefer '(' first):
  ( -> (( -> (()  -> (())   [first complete]
                 back up
  ( -> () -> ()( -> ()()    [second complete]

Valid combinations: [(()), ()()]`,
    hints: ["'(' is tried before ')' at each step", "Each complete string has exactly n '(' and n ')'"],
    testCases: txt("[(()), ()()]"),
  }),
  mk({
    exerciseId: "java_m40_t2_ex_5", position: 5, level: "medium", type: "code_scratch",
    title: "Subsets II (LeetCode #90)",
    instructions: "Return all unique subsets of an array that may contain duplicates. Sort first, then in the backtracking loop skip a value equal to the previous one at the SAME depth (i > start && nums[i] == nums[i-1]) so duplicate subsets are never generated.",
    expectedSolution: `import java.util.*;
public class SubsetsII {
    static List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }
    static void backtrack(int[] nums, int start, List<Integer> cur, List<List<Integer>> res) {
        res.add(new ArrayList<>(cur));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;  // skip dup at same depth
            cur.add(nums[i]);
            backtrack(nums, i + 1, cur, res);
            cur.remove(cur.size() - 1);
        }
    }
    public static void main(String[] a) {
        System.out.println(subsetsWithDup(new int[]{1, 2, 2}));
        // [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
        System.out.println("Sort, then skip nums[i]==nums[i-1] at the same recursion depth. Avoids dup subsets");
    }
}`,
    hints: ["Sort so duplicates are adjacent", "Skip only when i > start (the first copy at a depth is allowed)", "Record a copy of cur at every node, not just leaves"],
    testCases: exec("[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]", "same recursion depth"),
  }),

  // ════════════════ M41 — Dynamic Programming ════════════════
  mk({
    exerciseId: "java_m41_t2_ex_5", position: 5, level: "easy", type: "code_scratch",
    title: "Min Cost Climbing Stairs (LeetCode #746)",
    instructions: "Each step has a cost; you may climb 1 or 2 steps, starting from index 0 or 1, and want the min cost to reach the top (past the last step). dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]); keep just two rolling variables for O(1) space.",
    expectedSolution: `import java.util.*;
public class MinCostClimbingStairs {
    static int minCostClimbingStairs(int[] cost) {
        int n = cost.length, a = 0, b = 0;   // min cost to reach steps i-2, i-1
        for (int i = 2; i <= n; i++) {
            int cur = Math.min(b + cost[i - 1], a + cost[i - 2]);
            a = b; b = cur;
        }
        return b;
    }
    public static void main(String[] x) {
        System.out.println(minCostClimbingStairs(new int[]{10, 15, 20}));                 // 15
        System.out.println(minCostClimbingStairs(new int[]{1,100,1,1,1,100,1,1,100,1}));  // 6
        System.out.println("dp[i] = min(dp[i-1]+cost[i-1], dp[i-2]+cost[i-2]); O(1) space");
    }
}`,
    hints: ["The 'top' is index n (one past the last step), cost 0 to stand on", "You arrive at i from i-1 or i-2, paying that step's cost", "Two rolling variables replace the dp array"],
    testCases: exec("15", "6", "O(1) space"),
  }),
  mk({
    exerciseId: "java_m41_t2_ex_6", position: 6, level: "medium", type: "code_scratch",
    title: "House Robber II (LeetCode #213)",
    instructions: "Houses are in a CIRCLE (first and last are adjacent), and you can't rob two adjacent houses. Reduce to linear House Robber twice: rob houses [0..n-2] OR [1..n-1], take the max (this excludes robbing both ends).",
    expectedSolution: `import java.util.*;
public class HouseRobberII {
    static int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
    }
    static int robLine(int[] nums, int lo, int hi) {
        int prev = 0, cur = 0;
        for (int i = lo; i <= hi; i++) {
            int t = Math.max(cur, prev + nums[i]);
            prev = cur; cur = t;
        }
        return cur;
    }
    public static void main(String[] a) {
        System.out.println(rob(new int[]{2, 3, 2}));     // 3
        System.out.println(rob(new int[]{1, 2, 3, 1}));  // 4
        System.out.println("Circular: max(rob houses 0..n-2, rob houses 1..n-1). O(n)");
    }
}`,
    hints: ["The circle forbids robbing the first and last together", "Run linear House Robber on [0..n-2] and on [1..n-1]", "Answer is the max of the two runs (handle n==1 separately)"],
    testCases: exec("3", "4", "Circular"),
  }),
  mk({
    exerciseId: "java_m41_t3_ex_5", position: 5, level: "medium", type: "code_scratch",
    title: "Triangle — Minimum Path Sum (LeetCode #120)",
    instructions: "From the top of a triangle, each step moves to an adjacent number on the row below; find the minimum total. Work bottom-up: start dp = last row, then for each higher row dp[c] = triangle[r][c] + min(dp[c], dp[c+1]); answer is dp[0]. O(n) extra space.",
    expectedSolution: `import java.util.*;
public class TriangleMinPath {
    static int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) dp[i] = triangle.get(n - 1).get(i);   // last row
        for (int r = n - 2; r >= 0; r--)
            for (int c = 0; c <= r; c++)
                dp[c] = triangle.get(r).get(c) + Math.min(dp[c], dp[c + 1]);
        return dp[0];
    }
    public static void main(String[] a) {
        List<List<Integer>> t = Arrays.asList(
            Arrays.asList(2), Arrays.asList(3, 4),
            Arrays.asList(6, 5, 7), Arrays.asList(4, 1, 8, 3));
        System.out.println(minimumTotal(t));   // 11  (2 + 3 + 5 + 1)
        System.out.println("Bottom-up DP in-place from the second-last row; dp[c]=val+min(dp[c],dp[c+1]). O(n^2)");
    }
}`,
    hints: ["Bottom-up avoids the branching of top-down", "dp starts as the last row, then collapses upward", "Each cell adds the cheaper of its two children below"],
    testCases: exec("11", "Bottom-up DP"),
  }),

  // ════════════════ M41.5 — Greedy (T1) ════════════════
  mk({
    exerciseId: "java_m41_5_t1_ex_1", position: 1, level: "medium", type: "code_scratch",
    title: "Gas Station (LeetCode #134)",
    instructions: "Stations on a circular route: gas[i] is gas at station i, cost[i] is gas to drive to i+1. Return the starting index to complete the loop once, or -1. Greedy: if total(gas-cost) >= 0 a solution exists; track a running tank and reset the start to i+1 whenever it drops below 0.",
    expectedSolution: `import java.util.*;
public class GasStation {
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff; tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }   // can't reach i+1 from current start
        }
        return total >= 0 ? start : -1;
    }
    public static void main(String[] a) {
        System.out.println(canCompleteCircuit(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2}));   // 3
        System.out.println(canCompleteCircuit(new int[]{2,3,4}, new int[]{3,4,3}));            // -1
        System.out.println("Greedy: total>=0 => a start exists; reset start when tank<0. O(n)");
    }
}`,
    hints: ["If sum(gas) < sum(cost), it's impossible -> -1", "Keep a running tank; when it goes negative, no start in [old..i] works", "So jump the candidate start to i+1 and reset the tank"],
    testCases: exec("3", "-1", "reset start when tank<0"),
  }),
  mk({
    exerciseId: "java_m41_5_t1_ex_2", position: 2, level: "hard", type: "code_scratch",
    title: "Candy (LeetCode #135)",
    instructions: "Children in a row each get >= 1 candy; a child with a higher rating than a neighbour must get more candy than that neighbour. Minimize total candy. Two greedy passes: left-to-right enforces the left neighbour, right-to-left enforces the right neighbour (take the max).",
    expectedSolution: `import java.util.*;
public class Candy {
    static int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        Arrays.fill(candies, 1);
        for (int i = 1; i < n; i++)
            if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
        for (int i = n - 2; i >= 0; i--)
            if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        int sum = 0; for (int c : candies) sum += c;
        return sum;
    }
    public static void main(String[] a) {
        System.out.println(candy(new int[]{1, 0, 2}));   // 5   ([2,1,2])
        System.out.println(candy(new int[]{1, 2, 2}));   // 4   ([1,2,1])
        System.out.println("Two greedy passes (L->R then R->L), take the max of both constraints. O(n)");
    }
}`,
    hints: ["Start everyone at 1 candy", "L->R pass: if rating rises, give one more than the left neighbour", "R->L pass: same for the right neighbour, but keep the max so both hold"],
    testCases: exec("5", "4", "Two greedy passes"),
  }),

  // ════════════════ M41.5 — Intervals (T2) ════════════════
  mk({
    exerciseId: "java_m41_5_t2_ex_1", position: 1, level: "medium", type: "code_scratch",
    title: "Insert Interval (LeetCode #57)",
    instructions: "Given non-overlapping intervals sorted by start, insert newInterval and merge overlaps. Three phases: copy all intervals ending before newInterval starts; merge every interval that overlaps newInterval (widen min-start/max-end); then append the merged interval and the rest.",
    expectedSolution: `import java.util.*;
public class InsertInterval {
    static int[][] insert(int[][] intervals, int[] ni) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < ni[0]) res.add(intervals[i++]);   // before
        while (i < n && intervals[i][0] <= ni[1]) {                          // overlap -> merge
            ni[0] = Math.min(ni[0], intervals[i][0]);
            ni[1] = Math.max(ni[1], intervals[i][1]);
            i++;
        }
        res.add(ni);
        while (i < n) res.add(intervals[i++]);                               // after
        return res.toArray(new int[0][]);
    }
    public static void main(String[] a) {
        System.out.println(Arrays.deepToString(insert(new int[][]{{1,3},{6,9}}, new int[]{2,5})));
        // [[1, 5], [6, 9]]
        System.out.println("Three phases: copy-before, merge-overlapping, copy-after. O(n)");
    }
}`,
    hints: ["Phase 1: intervals ending before ni.start are untouched", "Phase 2: overlap when interval.start <= ni.end; widen ni", "Phase 3: append ni, then the remaining intervals"],
    testCases: exec("[[1, 5], [6, 9]]", "Three phases"),
  }),
  mk({
    exerciseId: "java_m41_5_t2_ex_2", position: 2, level: "medium", type: "code_scratch",
    title: "Non-overlapping Intervals (LeetCode #435)",
    instructions: "Return the minimum number of intervals to remove so the rest don't overlap. Sort by END; greedily keep an interval if its start >= the last kept end, otherwise remove it. (Keeping the earliest finisher leaves the most room.)",
    expectedSolution: `import java.util.*;
public class NonOverlappingIntervals {
    static int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));   // by end
        int end = Integer.MIN_VALUE, removed = 0;
        for (int[] it : intervals) {
            if (it[0] >= end) end = it[1];   // keep (non-overlapping)
            else removed++;                  // overlaps the last kept -> remove
        }
        return removed;
    }
    public static void main(String[] a) {
        System.out.println(eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}}));   // 1
        System.out.println(eraseOverlapIntervals(new int[][]{{1,2},{1,2},{1,2}}));          // 2
        System.out.println("Greedy by earliest END: keep if start >= last end, else remove. O(n log n)");
    }
}`,
    hints: ["Sort by end time, not start", "Keep when current.start >= last kept end", "Count the rest as removals"],
    testCases: exec("1", "2", "earliest END"),
  }),
  mk({
    exerciseId: "java_m41_5_t2_ex_3", position: 3, level: "medium", type: "code_scratch",
    title: "Minimum Number of Arrows to Burst Balloons (LeetCode #452)",
    instructions: "Balloons are intervals [start,end]; one vertical arrow at x bursts every balloon spanning x. Find the minimum arrows. Sort by END; shoot at the first balloon's end, and only add a new arrow when a balloon's start is beyond the current arrow position.",
    expectedSolution: `import java.util.*;
public class MinArrowsBalloons {
    static int findMinArrowShots(int[][] points) {
        if (points.length == 0) return 0;
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));   // by end
        int arrows = 1, end = points[0][1];
        for (int[] p : points)
            if (p[0] > end) { arrows++; end = p[1]; }   // current arrow misses -> new arrow
        return arrows;
    }
    public static void main(String[] a) {
        System.out.println(findMinArrowShots(new int[][]{{10,16},{2,8},{1,6},{7,12}}));   // 2
        System.out.println(findMinArrowShots(new int[][]{{1,2},{3,4},{5,6},{7,8}}));       // 4
        System.out.println("Sort by end; one arrow per overlap group; new arrow when start > current end. O(n log n)");
    }
}`,
    hints: ["Same 'sort by end' greedy as interval scheduling", "An arrow at the current end bursts everything overlapping it", "Need a new arrow only when the next start exceeds that end"],
    testCases: exec("2", "4", "new arrow when start"),
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Mod = mongoose.connection.collection("promodules");
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");
  const Trk = mongoose.connection.collection("protracks");

  // 1) NEW module + topics (idempotent upsert)
  await Mod.updateOne({ moduleId: MODULE_M415.moduleId }, { $set: MODULE_M415 }, { upsert: true });
  console.log(`✓ module ${MODULE_M415.moduleId} — ${MODULE_M415.name}`);
  for (const t of TOPICS_M415) {
    await Top.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true });
    console.log(`  ✓ topic ${t.topicId} — ${t.name}`);
  }

  // 2) Exercises (lane-guarded)
  const ALLOWED = new Set(["java_m31", "java_m37", "java_m40", "java_m41", "java_m41_5"]);
  let seeded = 0, skipped = 0;
  for (const e of EXERCISES) {
    if (!ALLOWED.has(e.moduleId)) { console.error(`✗ OUT OF LANE, refusing: ${e.exerciseId}`); skipped++; continue; }
    const topic = await Top.findOne({ topicId: e.topicId });
    if (!topic) { console.error(`✗ topic ${e.topicId} missing — skipping ${e.exerciseId}`); skipped++; continue; }
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    seeded++;
  }
  console.log(`\n✓ seeded/updated ${seeded} exercises${skipped ? `, skipped ${skipped}` : ""}`);

  // 3) Report counts
  for (const t of ["java_m31_t1", "java_m31_t4", "java_m37_t1", "java_m37_t2", "java_m40_t1", "java_m40_t2", "java_m41_t2", "java_m41_t3", "java_m41_5_t1", "java_m41_5_t2"]) {
    console.log(`   ${t}: ${await Exr.countDocuments({ topicId: t })} exercises`);
  }

  // 4) Recompute ProTrack totals (new module changes the counts)
  const totalModules = await Mod.countDocuments({ trackKey: TRACK });
  const totalTopics = await Top.countDocuments({ trackKey: TRACK });
  const totalExercises = await Exr.countDocuments({ trackKey: TRACK });
  await Trk.updateOne({ key: TRACK }, { $set: { totalModules, totalTopics, totalExercises } });
  console.log(`\n   ProTrack recount -> modules:${totalModules} topics:${totalTopics} exercises:${totalExercises}`);

  // 5) Validity sanity
  const mine = EXERCISES.map(e => e.exerciseId);
  const bad = await Exr.find({ exerciseId: { $in: mine }, $or: [{ level: { $nin: ["warmup", "easy", "medium", "hard"] } }, { type: { $nin: ["code_scratch", "predict_output", "pattern_match", "text_match", "fill_blank"] } }] }).toArray();
  console.log(`   invalid level/type among new docs: ${bad.length}`);
  const missing = mine.length - await Exr.countDocuments({ exerciseId: { $in: mine } });
  console.log(`\n✅ Session B DSA Animator gaps: ${mine.length} exercise docs, ${missing} missing; module java_m41_5 + 2 topics live.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
