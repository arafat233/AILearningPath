/**
 * seedDsaGapsB.js — DSA Gap Checklist, SESSION B (DSA_GAP_CHECKLIST.md).
 *
 * Additive & idempotent. Fills 9 missing DSA items (14 exercise docs incl. the
 * predict_output traces the checklist calls for) across FOUR existing modules:
 *   M34 HashMap  — Two Sum all-pairs (T1), Simple cache pre-LRU (T5)
 *   M35 Binary Tree — Preorder + Postorder dedicated, each with a trace (T1)
 *   M37 Graph    — Bellman-Ford + Dijkstra-contrast trace (T4 Shortest Path)
 *   M38 Sorting  — Bubble/Selection/Insertion/Shell + 2 traces (T1 Comparison Sorts)
 *
 * Stays in Session B's lane: NEVER touches java_m33 (Session A). Creates NO new
 * modules/topics — only appends ProExercise docs onto existing topics, after the
 * current max(position) so nothing collides.
 *
 * Convention mirrored from existing M34–M38 content (verified 2026-06-02):
 *   - code_scratch  → expectedSolution is a COMPLETE runnable program that prints
 *                     its result; testCases assert stdout contains the result
 *                     (Arrays.toString / List.toString "[a, b, c]" format) + a
 *                     complexity tagline string the program prints.
 *   - predict_output→ testCases:[{type:"text_match", expected:"..."}], no compiler.
 *   exerciseId: ^[a-z][a-z0-9_]*_m\d+_t\d+_(ex|pm)_\d+$  (_pm_ only for pattern_match;
 *   all items here are _ex_).
 *
 * Usage: node config/seedDsaGapsB.js
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
  // ════════════════ M34 HashMap ════════════════
  mk({
    exerciseId: "java_m34_t1_ex_14", position: 14, level: "medium", type: "code_scratch",
    title: "Two Sum — ALL pairs (every index pair, not just the first)",
    instructions: "Two Sum (#1) stops at the first pair. Here, return EVERY pair of indices [i, j] (i < j) whose values sum to target. Use a HashMap from value → list of earlier indices; for each j, emit a pair for each earlier index holding (target - nums[j]). Order: by j ascending, then i ascending.",
    expectedSolution: `import java.util.*;
public class TwoSumAllPairs {
    static List<int[]> twoSumAll(int[] nums, int target) {
        Map<Integer,List<Integer>> seen = new HashMap<>();  // value -> earlier indices
        List<int[]> res = new ArrayList<>();
        for (int j = 0; j < nums.length; j++) {
            int need = target - nums[j];
            if (seen.containsKey(need))
                for (int i : seen.get(need)) res.add(new int[]{i, j});
            seen.computeIfAbsent(nums[j], k -> new ArrayList<>()).add(j);
        }
        return res;
    }
    public static void main(String[] a) {
        List<int[]> p = twoSumAll(new int[]{3,3,3}, 6);
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < p.size(); i++) {
            sb.append(Arrays.toString(p.get(i)));
            if (i < p.size() - 1) sb.append(", ");
        }
        sb.append("]");
        System.out.println(sb);   // [[0, 1], [0, 2], [1, 2]]
        System.out.println("O(n) one pass — HashMap value -> list of indices; returns all pairs not just first");
    }
}`,
    hints: ["Map each value to a LIST of indices, not a single index", "For each j, every earlier index with value (target-nums[j]) forms a pair", "O(n) average time, O(n) space"],
    testCases: exec("[[0, 1], [0, 2], [1, 2]]", "all pairs not just first"),
  }),
  mk({
    exerciseId: "java_m34_t5_ex_13", position: 13, level: "easy", type: "code_scratch",
    title: "Simple cache (HashMap-backed, no eviction) — the pre-LRU step",
    instructions: "Before LRU, build the simplest possible cache: a HashMap wrapper with get(key) returning the value or -1 on a miss, and put(key, value) that overwrites. No capacity, no eviction. This is the foundation LRU then extends by adding a doubly-linked list to evict the least-recently-used entry at capacity.",
    expectedSolution: `import java.util.*;
public class SimpleCacheDemo {
    static class SimpleCache {
        private final Map<Integer,Integer> map = new HashMap<>();
        int get(int key)            { return map.getOrDefault(key, -1); }
        void put(int key, int val)  { map.put(key, val); }
    }
    public static void main(String[] a) {
        SimpleCache c = new SimpleCache();
        c.put(1, 10); c.put(2, 20);
        System.out.println(c.get(1));   // 10  (hit)
        System.out.println(c.get(3));   // -1  (miss)
        c.put(1, 100);
        System.out.println(c.get(1));   // 100 (overwrite)
        System.out.println("O(1) get+put, no eviction — the pre-LRU step; LRU adds a DLL to evict at capacity");
    }
}`,
    hints: ["getOrDefault(key, -1) handles the miss in one line", "put overwrites automatically — HashMap keys are unique", "No eviction here; LRU's extra machinery is purely to choose what to drop at capacity"],
    testCases: exec("10", "-1", "100", "no eviction"),
  }),

  // ════════════════ M35 Binary Tree ════════════════
  mk({
    exerciseId: "java_m35_t1_ex_13", position: 13, level: "easy", type: "code_scratch",
    title: "Preorder traversal — recursive AND iterative (stack)",
    instructions: "Preorder = Node → Left → Right. Implement it both recursively and iteratively. For the iterative version use an explicit stack and push RIGHT before LEFT, so the left child is popped (and processed) first.",
    expectedSolution: `import java.util.*;
public class Preorder {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }
    // Iterative: stack, push right then left
    static List<Integer> preorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        if (root != null) st.push(root);
        while (!st.isEmpty()) {
            TreeNode n = st.pop();
            res.add(n.val);
            if (n.right != null) st.push(n.right);   // push right FIRST
            if (n.left  != null) st.push(n.left);    // so left pops first
        }
        return res;
    }
    // Recursive: Node-Left-Right
    static void rec(TreeNode n, List<Integer> l) {
        if (n == null) return;
        l.add(n.val); rec(n.left, l); rec(n.right, l);
    }
    public static void main(String[] a) {
        TreeNode r = new TreeNode(1);
        r.left = new TreeNode(2); r.right = new TreeNode(3);
        r.left.left = new TreeNode(4); r.left.right = new TreeNode(5);
        System.out.println(preorder(r));               // [1, 2, 4, 5, 3]
        List<Integer> l = new ArrayList<>(); rec(r, l);
        System.out.println(l);                          // [1, 2, 4, 5, 3]
        System.out.println("Preorder = Node-Left-Right. Iterative: push RIGHT then LEFT. O(n) time, O(h) space");
    }
}`,
    hints: ["Preorder visits the node BEFORE its children", "Iterative: a stack reverses order, so push right before left", "Recursion depth / stack size is O(h), the tree height"],
    testCases: exec("[1, 2, 4, 5, 3]", "Node-Left-Right"),
  }),
  mk({
    exerciseId: "java_m35_t1_ex_14", position: 14, level: "warmup", type: "predict_output",
    title: "Trace: preorder traversal order",
    instructions: "Give the PREORDER traversal (Node-Left-Right) of this tree:\n```\n        1\n       / \\\n      2   3\n     / \\\n    4   5\n```\nList the node values in the order they are visited.",
    expectedSolution: `Preorder = visit Node, then Left subtree, then Right subtree.

Visit 1            -> go left
  Visit 2          -> go left
    Visit 4 (leaf) -> back up, go right
    Visit 5 (leaf) -> back up to 1, go right
  Visit 3 (leaf)

Preorder: [1, 2, 4, 5, 3]`,
    hints: ["Always record the node the moment you arrive, before descending", "Fully finish the left subtree before touching the right"],
    testCases: txt("[1, 2, 4, 5, 3]"),
  }),
  mk({
    exerciseId: "java_m35_t1_ex_15", position: 15, level: "easy", type: "code_scratch",
    title: "Postorder traversal — recursive AND iterative",
    instructions: "Postorder = Left → Right → Node. Implement recursively, and iteratively using the reverse trick: do a modified preorder (Node-Right-Left) with a stack but PREPEND each popped value, which reverses it into Left-Right-Node.",
    expectedSolution: `import java.util.*;
public class Postorder {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){ val = v; } }
    // Iterative: reverse of (Node-Right-Left) == Left-Right-Node
    static List<Integer> postorder(TreeNode root) {
        LinkedList<Integer> res = new LinkedList<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        if (root != null) st.push(root);
        while (!st.isEmpty()) {
            TreeNode n = st.pop();
            res.addFirst(n.val);                      // prepend -> reverses N-R-L into L-R-N
            if (n.left  != null) st.push(n.left);
            if (n.right != null) st.push(n.right);
        }
        return res;
    }
    // Recursive: Left-Right-Node
    static void rec(TreeNode n, List<Integer> l) {
        if (n == null) return;
        rec(n.left, l); rec(n.right, l); l.add(n.val);
    }
    public static void main(String[] a) {
        TreeNode r = new TreeNode(1);
        r.left = new TreeNode(2); r.right = new TreeNode(3);
        r.left.left = new TreeNode(4); r.left.right = new TreeNode(5);
        System.out.println(postorder(r));              // [4, 5, 2, 3, 1]
        List<Integer> l = new ArrayList<>(); rec(r, l);
        System.out.println(l);                          // [4, 5, 2, 3, 1]
        System.out.println("Postorder = Left-Right-Node. Iterative: push LEFT then RIGHT, prepend each pop. O(n) time, O(h) space");
    }
}`,
    hints: ["Postorder visits the node AFTER both children (root last)", "Iterative trick: preorder variant Node-Right-Left, then reverse", "addFirst on a LinkedList prepends, giving the reversal for free"],
    testCases: exec("[4, 5, 2, 3, 1]", "Left-Right-Node"),
  }),
  mk({
    exerciseId: "java_m35_t1_ex_16", position: 16, level: "warmup", type: "predict_output",
    title: "Trace: postorder traversal order",
    instructions: "Give the POSTORDER traversal (Left-Right-Node) of this tree:\n```\n        1\n       / \\\n      2   3\n     / \\\n    4   5\n```\nList the node values in the order they are visited.",
    expectedSolution: `Postorder = Left subtree, then Right subtree, then the Node itself (root comes LAST).

Subtree of 2: left 4, right 5, then 2   -> 4, 5, 2
Right child of 1: 3                      -> 3
Root 1 last                              -> 1

Postorder: [4, 5, 2, 3, 1]`,
    hints: ["A node is emitted only after BOTH its subtrees are done", "The root is always the last node in postorder"],
    testCases: txt("[4, 5, 2, 3, 1]"),
  }),

  // ════════════════ M37 Graph — T4 Shortest Path ════════════════
  mk({
    exerciseId: "java_m37_t4_ex_13", position: 13, level: "medium", type: "code_scratch",
    title: "Bellman-Ford — shortest paths with negative edges + cycle detection",
    instructions: "Implement Bellman-Ford for single-source shortest paths on a DIRECTED graph that may contain negative-weight edges (which Dijkstra cannot handle). Relax all edges V-1 times. Then run one more pass: if any edge can still be relaxed, a negative-weight cycle is reachable — return null. Otherwise return the distance array.",
    expectedSolution: `import java.util.*;
public class BellmanFord {
    // Shortest distances from src; null if a reachable negative-weight cycle exists.
    static int[] bellmanFord(int n, int[][] edges, int src) {
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[src] = 0;
        for (int i = 0; i < n - 1; i++)                  // relax all edges V-1 times
            for (int[] e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != Long.MAX_VALUE && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
            }
        for (int[] e : edges) {                          // Vth pass: still relaxes => negative cycle
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Long.MAX_VALUE && dist[u] + w < dist[v]) return null;
        }
        int[] res = new int[n];
        for (int i = 0; i < n; i++)
            res[i] = dist[i] == Long.MAX_VALUE ? Integer.MAX_VALUE : (int) dist[i];
        return res;
    }
    public static void main(String[] a) {
        int[][] g1 = {{0,1,4},{0,2,5},{1,2,-3},{2,3,2}};        // 0->1->2 (4-3=1) beats 0->2 (5)
        System.out.println(Arrays.toString(bellmanFord(4, g1, 0)));   // [0, 4, 1, 3]
        int[][] g2 = {{0,1,1},{1,2,-1},{2,0,-1}};               // cycle weight = -1
        System.out.println(bellmanFord(3, g2, 0) == null ? "negative cycle" : "ok");
        System.out.println("Bellman-Ford O(V*E): handles negative edges (Dijkstra cannot); Vth-pass relaxation = negative cycle");
    }
}`,
    hints: ["Relax every edge V-1 times — a shortest path has at most V-1 edges", "Use a long for distances so MAX_VALUE + w can't overflow", "If a Vth relaxation still improves something, a negative cycle is reachable"],
    testCases: exec("[0, 4, 1, 3]", "negative cycle", "handles negative edges"),
  }),
  mk({
    exerciseId: "java_m37_t4_ex_14", position: 14, level: "medium", type: "predict_output",
    title: "Trace: why Dijkstra fails on a negative edge (vs Bellman-Ford)",
    instructions: "Directed graph, source 0:\n```\n0 -> 1  weight 4\n0 -> 2  weight 5\n1 -> 2  weight -3\n```\nDijkstra finalizes a node the moment it is popped and never revisits it. Bellman-Ford relaxes all edges repeatedly. Give the CORRECT shortest distances [d0, d1, d2] from node 0 (what Bellman-Ford computes), and note what Dijkstra would wrongly report for d2.",
    expectedSolution: `Dijkstra (greedy, finalizes on pop):
  pop 0 (d=0) -> relax: d1=4, d2=5
  pop 2 (d=5) -> FINALIZED at 5  <-- mistake: it commits before seeing 1->2
  pop 1 (d=4) -> 1->2 gives 4+(-3)=1 < 5, but 2 is already finalized -> stays 5  (WRONG)

Bellman-Ford (relaxes all edges repeatedly):
  d2 improves to 4 + (-3) = 1  (CORRECT)

Correct distances: [0, 4, 1]
Dijkstra wrongly reports d2 = 5; Bellman-Ford gives d2 = 1.`,
    hints: ["Dijkstra's greedy 'finalize on pop' assumes edge weights are non-negative", "A later negative edge can lower a distance Dijkstra already locked in"],
    testCases: txt("[0, 4, 1]"),
  }),

  // ════════════════ M38 Sorting — T1 Comparison Sorts (elementary O(n^2) sorts) ════════════════
  mk({
    exerciseId: "java_m38_t1_ex_13", position: 13, level: "easy", type: "code_scratch",
    title: "Bubble sort — with early-exit optimisation",
    instructions: "Implement bubble sort: repeatedly walk the array swapping adjacent out-of-order pairs, so the largest element 'bubbles' to the end each pass. Add the early-exit optimisation: if a full pass makes no swaps, the array is already sorted — stop (best case O(n)).",
    expectedSolution: `import java.util.*;
public class BubbleSort {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++)              // last i elements already in place
                if (arr[j] > arr[j+1]) {
                    int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                    swapped = true;
                }
            if (!swapped) break;                              // no swaps => sorted => O(n) best case
        }
    }
    public static void main(String[] a) {
        int[] arr = {5, 1, 4, 2, 8};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));   // [1, 2, 4, 5, 8]
        System.out.println("Bubble sort O(n^2) worst, O(n) best (early-exit when no swaps). Stable, in-place");
    }
}`,
    hints: ["Inner loop shrinks by i each pass — the tail is already sorted", "The 'swapped' flag enables the O(n) best case on sorted input", "Only swap adjacent elements — that keeps it stable"],
    testCases: exec("[1, 2, 4, 5, 8]", "early-exit"),
  }),
  mk({
    exerciseId: "java_m38_t1_ex_14", position: 14, level: "warmup", type: "predict_output",
    title: "Trace: one pass of bubble sort",
    instructions: "Array: `[5, 1, 4, 2, 8]`. Show the array after the FIRST full pass of bubble sort (comparing each adjacent pair left to right, swapping when the left is larger).",
    expectedSolution: `Pass 1 (compare adjacent, swap if left > right):
  5,1 -> swap -> [1, 5, 4, 2, 8]
  5,4 -> swap -> [1, 4, 5, 2, 8]
  5,2 -> swap -> [1, 4, 2, 5, 8]
  5,8 -> ok    -> [1, 4, 2, 5, 8]

After pass 1: [1, 4, 2, 5, 8]
The largest value (8) was already at the end; 5 bubbled up one slot toward it.`,
    hints: ["Carry the larger value rightward as you compare each pair", "After pass k, the k largest elements are parked at the end"],
    testCases: txt("[1, 4, 2, 5, 8]"),
  }),
  mk({
    exerciseId: "java_m38_t1_ex_15", position: 15, level: "easy", type: "code_scratch",
    title: "Selection sort",
    instructions: "Implement selection sort: for each position i, scan the unsorted suffix to find the index of the minimum element, then swap it into position i. Always O(n^2) comparisons regardless of input, but it does the fewest swaps of the elementary sorts (at most n-1).",
    expectedSolution: `import java.util.*;
public class SelectionSort {
    static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int min = i;
            for (int j = i + 1; j < n; j++)
                if (arr[j] < arr[min]) min = j;          // find min of unsorted suffix
            int t = arr[i]; arr[i] = arr[min]; arr[min] = t;
        }
    }
    public static void main(String[] a) {
        int[] arr = {64, 25, 12, 22, 11};
        selectionSort(arr);
        System.out.println(Arrays.toString(arr));   // [11, 12, 22, 25, 64]
        System.out.println("Selection sort O(n^2) comparisons always; O(n) swaps (fewest). In-place, not stable");
    }
}`,
    hints: ["Track the index of the minimum, swap once per outer iteration", "Comparison count is fixed: n(n-1)/2 — no best case", "Not stable: a swap can leap an equal element past another"],
    testCases: exec("[11, 12, 22, 25, 64]", "fewest"),
  }),
  mk({
    exerciseId: "java_m38_t1_ex_16", position: 16, level: "easy", type: "code_scratch",
    title: "Insertion sort — with the O(n) best case",
    instructions: "Implement insertion sort: grow a sorted prefix by taking each next element as a 'key' and shifting larger prefix elements one slot right until the key's spot is found. On already-sorted input the inner shift never runs, giving the O(n) best case — the reason it's preferred for small or nearly-sorted arrays.",
    expectedSolution: `import java.util.*;
public class InsertionSort {
    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i], j = i - 1;
            while (j >= 0 && arr[j] > key) {             // shift larger elements right
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;                            // drop key into its slot
        }
    }
    public static void main(String[] a) {
        int[] arr = {12, 11, 13, 5, 6};
        insertionSort(arr);
        System.out.println(Arrays.toString(arr));   // [5, 6, 11, 12, 13]
        System.out.println("Insertion sort O(n^2) worst, O(n) best (sorted input -> inner loop never runs). Stable, in-place");
    }
}`,
    hints: ["The prefix arr[0..i-1] stays sorted as you go", "Shift, don't swap — move larger elements right, then place the key once", "Already sorted => the while condition is false immediately => O(n)"],
    testCases: exec("[5, 6, 11, 12, 13]", "O(n) best"),
  }),
  mk({
    exerciseId: "java_m38_t1_ex_17", position: 17, level: "medium", type: "code_scratch",
    title: "Shell sort — gapped insertion sort",
    instructions: "Implement Shell sort: run insertion sort on elements that are 'gap' apart, shrinking the gap each round (start gap = n/2, halve down to 1). Large early gaps move elements long distances cheaply; the final gap=1 pass is ordinary insertion sort on an already nearly-sorted array.",
    expectedSolution: `import java.util.*;
public class ShellSort {
    static void shellSort(int[] arr) {
        int n = arr.length;
        for (int gap = n / 2; gap > 0; gap /= 2)             // shrinking gap sequence
            for (int i = gap; i < n; i++) {                   // gapped insertion sort
                int key = arr[i], j = i;
                while (j >= gap && arr[j - gap] > key) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }
                arr[j] = key;
            }
    }
    public static void main(String[] a) {
        int[] arr = {23, 12, 1, 8, 34, 54, 2, 3};
        shellSort(arr);
        System.out.println(Arrays.toString(arr));   // [1, 2, 3, 8, 12, 23, 34, 54]
        System.out.println("Shell sort = gapped insertion sort. Gap halves each round (n/2..1). ~O(n^1.5) here; in-place, not stable");
    }
}`,
    hints: ["It's insertion sort where 'adjacent' means 'gap apart'", "Shrink the gap each round; the last round (gap=1) finishes the job", "Big early gaps let small values travel far in few moves"],
    testCases: exec("[1, 2, 3, 8, 12, 23, 34, 54]", "gapped insertion"),
  }),
  mk({
    exerciseId: "java_m38_t1_ex_18", position: 18, level: "warmup", type: "predict_output",
    title: "Trace: Shell sort first gap pass",
    instructions: "Array: `[23, 12, 1, 8, 34, 54, 2, 3]` (n = 8). Shell sort starts with gap = n/2 = 4. Show the array AFTER the first gap=4 pass (gapped insertion sort comparing indices 4 apart).",
    expectedSolution: `Gap = 4. Compare elements 4 apart (gapped insertion), i = 4..7:
  i=4: 34 vs arr[0]=23 -> 23 < 34, no shift
  i=5: 54 vs arr[1]=12 -> no shift
  i=6: 2  vs arr[2]=1  -> no shift
  i=7: 3  vs arr[3]=8  -> 8 > 3, shift 8 right; j=3 < gap so stop, place 3 at index 3

After gap=4 pass: [23, 12, 1, 3, 34, 54, 2, 8]
Next gap = 2, then gap = 1 (ordinary insertion sort) finishes the sort.`,
    hints: ["Each i compares arr[i] with arr[i-gap], shifting by gap", "Only the (8,3) pair is out of order at gap=4"],
    testCases: txt("[23, 12, 1, 3, 34, 54, 2, 8]"),
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED — additive: only upserts ProExercise docs onto EXISTING topics.
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");

  const ALLOWED = /^java_m3[4578]_/;   // Session B lane only — never m33
  let seeded = 0, skipped = 0;
  for (const e of EXERCISES) {
    if (!ALLOWED.test(e.exerciseId)) { console.error(`✗ OUT OF LANE, refusing: ${e.exerciseId}`); skipped++; continue; }
    const topic = await Top.findOne({ topicId: e.topicId });
    if (!topic) { console.error(`✗ topic ${e.topicId} missing — skipping ${e.exerciseId} (this seed never creates topics)`); skipped++; continue; }
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    seeded++;
  }

  // Report current counts per touched topic
  console.log(`\n✓ seeded/updated ${seeded} exercises${skipped ? `, skipped ${skipped}` : ""}`);
  for (const t of ["java_m34_t1", "java_m34_t5", "java_m35_t1", "java_m37_t4", "java_m38_t1"]) {
    const n = await Exr.countDocuments({ topicId: t });
    console.log(`   ${t}: ${n} exercises`);
  }

  // Idempotency / validity sanity
  const mine = EXERCISES.map(e => e.exerciseId);
  const bad = await Exr.find({ exerciseId: { $in: mine }, $or: [{ level: { $nin: ["warmup", "easy", "medium", "hard"] } }, { type: { $nin: ["code_scratch", "predict_output", "pattern_match", "text_match", "fill_blank"] } }] }).toArray();
  console.log(`   invalid level/type among new docs: ${bad.length}`);
  const missing = mine.length - await Exr.countDocuments({ exerciseId: { $in: mine } });
  console.log(`\n✅ Session B DSA gaps: ${mine.length} exercise docs, ${missing} missing.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
