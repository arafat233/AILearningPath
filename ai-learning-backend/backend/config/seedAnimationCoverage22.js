/**
 * seedAnimationCoverage22.js — GAP #1 animation, BIG batch 22 (~45).
 * COMPLETES four whole buckets: heap (17), pattern-matching (10), stack (9),
 * stack-queue (9). Existing renderers (tree / array-pointers / stack /
 * linked-list), data-only. Verify: node config/auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const cls = (...p) => Object.fromEntries(p);
const W = 380;
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
  // ───────────────────────── heap (completes → 30/30) ─────────────────────────
  java_m36_t1_ex_10: { kind: "array-pointers", label: "Kth Smallest in Sorted Matrix (#378)", array: [1, 5, 9, 10, 11, 13], meta: { k: 8 }, steps: [
    { pointers: { lo: 1, hi: 15 }, note: "Binary-search the value; count entries ≤ mid (each row is sorted)." },
    { mark: { 2: "match" }, note: "Or a min-heap of row fronts, pop k times. Heap = O(k log n).", result: "13" } ] },
  java_m36_t1_ex_11: { kind: "tree", label: "Heap Synthesis — K largest / median", ...btree([2, 4, 8, 5, 7]), steps: [
    { cls: cls(["0", "current"]), note: "Min-heap of size k → K largest; two heaps → running median." },
    { cls: cls(["0", "match"]), note: "Top is always the min (min-heap) in O(1); push/pop O(log n).", result: "the toolkit" } ] },
  java_m36_t1_ex_12: { kind: "tree", label: "M36 T1 Heap Synthesis", ...btree([1, 3, 6, 5, 9, 8]), steps: [
    { cls: cls(["0", "current"]), note: "Heap = complete binary tree in an array; parent (i−1)/2, children 2i+1, 2i+2." },
    { cls: cls(["0", "match"]), note: "Heapify in O(n); sort by popping in O(n log n).", result: "heap mastery" } ] },
  java_m36_t2_ex_10: { kind: "tree", label: "Heap Patterns Synthesis", ...btree([1, 4, 3, 7, 5]), steps: [
    { cls: cls(["0", "current"]), note: "'Top K', 'Kth', 'merge K', 'scheduling' → reach for a heap." },
    { cls: cls(["0", "match"]), note: "Custom comparator picks min- vs max-heap & ordering key.", result: "patterns" } ] },
  java_m36_t2_ex_11: { kind: "tree", label: "M36 T2 Synthesis", ...btree([2, 5, 4, 9, 7]), steps: [
    { cls: cls(["0", "current"]), note: "Lazy deletion, two-heap median, k-way merge — all variations." },
    { cls: cls(["0", "match"]), note: "Keep the heap small (size k) to bound time & space.", result: "synthesis" } ] },
  java_m36_t2_ex_2: { kind: "tree", label: "Find Median from Data Stream", ...btree([5, 3, 8]), steps: [
    { cls: cls(["0", "current"]), note: "Max-heap (low half) + min-heap (high half), kept balanced ±1." },
    { cls: cls(["0", "match"]), note: "Median = top of larger heap, or average of both tops.", result: "O(log n) add, O(1) median" } ] },
  java_m36_t2_ex_9: { kind: "array-pointers", label: "Furthest Building (#1642)", array: [4, 12, 2, 7, 3, 18, 20], meta: { bricks: 10, ladders: 2 }, steps: [
    { pointers: { i: 4 }, note: "Use ladders for the LARGEST climbs; min-heap holds the climbs ladders cover." },
    { mark: { 1: "match", 5: "match" }, note: "When over ladders, the smallest climb falls back to bricks.", result: "furthest index" } ] },
  java_m36_t3_ex_2: { kind: "tree", label: "Design a Binary Max-Heap", ...btree([9, 7, 8, 3, 5]), steps: [
    { cls: cls(["3", "current"]), note: "Insert at end, sift-UP while parent < child." },
    { cls: cls(["0", "match"]), note: "extractMax: swap root with last, remove, sift-DOWN. Both O(log n).", result: "array-backed heap" } ] },
  java_m36_t3_ex_3: { kind: "tree", label: "PriorityQueue with Comparator", ...btree([3, 3, 1, 7, 5]), steps: [
    { cls: cls(["0", "current"]), note: "Comparator decides order: by frequency, by distance, by deadline…" },
    { cls: cls(["0", "match"]), note: "Reverse it for a max-heap. Ties broken by a secondary key.", result: "ordered by rule" } ] },
  java_m36_t3_ex_4: { kind: "array-pointers", label: "K Pairs with Smallest Sums (#373)", array: [1, 7, 11], meta: { B: "[2,4,6]", k: 3 }, steps: [
    { pointers: { i: 0 }, note: "Min-heap seeded with (a[i], b[0]); pop smallest, push its (i, j+1) neighbour." },
    { mark: { 0: "match" }, note: "Pop k times → k smallest pair sums. O(k log k).", result: "[(1,2),(1,4),(1,6)]" } ] },
  java_m36_t3_ex_5: { kind: "tree", label: "Heap with Lazy Deletion", ...btree([4, 6, 5, 9, 8]), steps: [
    { cls: cls(["0", "current"]), note: "remove(x): mark x deleted in a HashMap, don't touch the heap yet." },
    { cls: cls(["0", "dropped"]), note: "On peek/poll, discard tops that are marked deleted. Amortised O(log n).", result: "remove(x) support" } ] },
  java_m36_t4_ex_2: { kind: "array-pointers", label: "Merge K Sorted Arrays", array: [1, 3, 5, 2, 4, 6], steps: [
    { pointers: { i: 0 }, note: "Min-heap of (value, whichArray, idx); pop smallest, push next from that array." },
    { array: [1, 2, 3, 4, 5, 6], mark: { 0: "match", 1: "match" }, note: "O(N log k) total.", result: "[1,2,3,4,5,6]" } ] },
  java_m36_t4_ex_3: { kind: "array-pointers", label: "Ugly Number II (#264)", array: [1, 2, 3, 4, 5, 6], steps: [
    { pointers: { i: 5 }, note: "Min-heap (or 3 pointers) of multiples 2/3/5; pop smallest, push ×2,×3,×5." },
    { mark: { 5: "match" }, note: "Dedup; nth pop = nth ugly number.", result: "6" } ] },
  java_m36_t4_ex_4: { kind: "array-pointers", label: "K Closest Elements (#658)", array: [1, 2, 3, 4, 5], meta: { x: 3, k: 2 }, steps: [
    { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Binary-search the best window START so window of size k is closest to x." },
    { mark: { 1: "match", 2: "match" }, note: "Compare a[mid] vs a[mid+k] distance to x. O(log n + k).", result: "[2,3]" } ] },
  java_m36_t5_ex_2: { kind: "array-pointers", label: "Min Cost to Connect Sticks (#1167)", array: [2, 4, 3], steps: [
    { pointers: { i: 0 }, note: "Greedy + min-heap: always combine the two smallest sticks." },
    { mark: { 0: "match", 2: "match" }, note: "Cost accumulates (Huffman-style). 2+3=5, 5+4=9 → 14.", result: "14" } ] },
  java_m36_t5_ex_3: { kind: "array-pointers", label: "Min Refueling Stops (#871)", array: [10, 20, 30, 60], meta: { target: 100, start: 10 }, steps: [
    { pointers: { i: 2 }, note: "Drive as far as fuel allows; bank passed stations' fuel in a max-heap." },
    { mark: { 3: "match" }, note: "When stuck, refuel from the largest banked station. Greedy.", result: "fewest stops" } ] },
  java_m36_t5_ex_4: { kind: "array-pointers", label: "Max Events Attended (#1353)", array: [1, 2, 3, 3, 4], steps: [
    { pointers: { i: 0 }, note: "Sort by start; each day, add events starting today, min-heap on END day." },
    { mark: { 0: "match", 1: "match" }, note: "Attend the soonest-ending available event; drop expired ones.", result: "max events" } ] },

  // ───────────────────────── pattern-matching (completes → 12/12) ─────────────────────────
  java_m31_t2_ex_5: { kind: "array-pointers", label: "Find ALL occurrences with KMP", array: ["a", "b", "a", "b", "a", "b"], meta: { pat: "abab" }, steps: [
    { pointers: { i: 3 }, note: "On a full match, don't reset to 0 — jump j to lps[j−1] to find overlaps." },
    { mark: { 0: "match", 2: "match" }, note: "Reports indices 0 and 2 (overlapping).", result: "[0, 2]" } ] },
  java_m31_t2_ex_6: { kind: "array-pointers", label: "Repeated Substring Pattern (#459)", array: ["a", "b", "a", "b"], steps: [
    { pointers: { i: 3 }, note: "lps[n−1] = longest border; if n % (n − border) == 0 it tiles." },
    { mark: { 0: "match", 1: "match" }, note: "\"abab\" = \"ab\"×2.", result: "true" } ] },
  java_m31_t2_ex_7: { kind: "array-pointers", label: "strStr — KMP vs built-in (#28)", array: ["h", "e", "l", "l", "o"], meta: { needle: "ll" }, steps: [
    { pointers: { i: 2 }, note: "KMP precomputes lps → O(n+m), never backtracks the text pointer." },
    { mark: { 2: "match", 3: "match" }, note: "indexOf is fine for small inputs; KMP wins worst-case.", result: "2" } ] },
  java_m31_t2_ex_8: { kind: "array-pointers", label: "Shortest Palindrome (#214)", array: ["a", "a", "c", "e", "c", "a", "a"], steps: [
    { pointers: { i: 0 }, note: "Find longest palindromic PREFIX via KMP on s + '#' + reverse(s)." },
    { mark: { 0: "match", 1: "match" }, note: "Prepend the reversed remaining suffix.", result: "shortest palindrome" } ] },
  java_m31_t2_ex_9: { kind: "array-pointers", label: "Rabin–Karp (rolling hash)", array: ["a", "b", "c", "d", "a", "b", "c"], meta: { pat: "abc" }, steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Hash the window; slide by removing left, adding right in O(1)." },
    { pointers: { L: 4, R: 6 }, window: [4, 6], mark: { 4: "match", 5: "match", 6: "match" }, note: "Hash match → verify chars (guard collisions). Avg O(n+m).", result: "[0, 4]" } ] },
  java_m31_t2_ex_11: { kind: "array-pointers", label: "String Rotation Check (KMP)", array: ["c", "d", "a", "b"], meta: { orig: "abcd" }, steps: [
    { pointers: { i: 0 }, note: "B is a rotation of A ⇔ B is a substring of A+A and |A|==|B|." },
    { mark: { 0: "match", 1: "match" }, note: "Run KMP search of B inside A+A.", result: "true" } ] },
  java_m31_t2_ex_12: { kind: "array-pointers", label: "Count Pattern Occurrences (KMP)", array: ["a", "a", "a", "a"], meta: { pat: "aa" }, steps: [
    { pointers: { i: 2 }, note: "Count++ on each match, then j = lps[j−1] to allow overlaps." },
    { mark: { 0: "match", 1: "match", 2: "match" }, note: "\"aa\" occurs 3× in \"aaaa\".", result: "3" } ] },
  java_m31_t2_ex_13: { kind: "array-pointers", label: "KMP — LPS edge cases", array: ["a", "b", "a", "b", "c"], steps: [
    { pointers: { i: 3 }, note: "lps[i] = longest proper prefix that is also a suffix of pat[0..i]." },
    { array: [0, 0, 1, 2, 0], note: "On mismatch fall back to lps[len−1], never below 0.", result: "[0,0,1,2,0]" } ] },
  java_m31_t2_ex_14: { kind: "grid", label: "String Matching in 2D Matrix (KMP)", grid: [["a", "b", "c"], ["d", "a", "b"], ["c", "x", "y"]], steps: [
    { cls: cls(["0,0", "frontier"]), note: "Run KMP along each row (and/or column) as a 1-D string." },
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"]), note: "Report (row, col) where the pattern starts.", result: "matches" } ] },
  java_m31_t2_ex_15: { kind: "array-pointers", label: "Pattern Matching Synthesis", array: ["K", "M", "P", "+", "R", "K"], steps: [
    { pointers: { i: 0 }, note: "KMP (lps, no text backtrack) vs Rabin–Karp (rolling hash, multi-pattern)." },
    { note: "Both beat naïve O(nm) for large texts.", result: "the toolkit" } ] },

  // ───────────────────────── stack (completes → 18/18) ─────────────────────────
  java_m33_t1_ex_3: { kind: "stack", label: "Stack via ArrayDeque", array: ["push 1", "push 2", "pop"], outLabel: "stack", steps: [
    { cursor: 1, stack: [1, 2], note: "ArrayDeque: push = addFirst, pop = removeFirst — faster than legacy Stack." },
    { cursor: 2, stack: [1], note: "LIFO: last in, first out.", result: "top = 1" } ] },
  java_m33_t1_ex_8: { kind: "stack", label: "Decode String (#394)", array: ["3", "[", "a", "]", "2", "[", "bc", "]"], outLabel: "stack", steps: [
    { cursor: 3, stack: ["", 3], note: "Push (current string, repeat count) on '['; on ']' pop and expand." },
    { cursor: 7, stack: [], note: "\"3[a]2[bc]\" → \"aaabcbc\".", result: "aaabcbc" } ] },
  java_m33_t1_ex_10: { kind: "stack", label: "Basic Calculator II (#227)", array: ["3", "+", "2", "*", "2"], outLabel: "stack", steps: [
    { cursor: 2, stack: [3, 2], note: "Push numbers; on * or / pop & combine immediately (precedence)." },
    { cursor: 4, stack: [3, 4], note: "Sum the stack at the end. 3 + 2*2 = 7.", result: "7" } ] },
  java_m33_t1_ex_11: { kind: "array-pointers", label: "Largest Rectangle in Histogram (#84)", array: [2, 1, 5, 6, 2, 3], steps: [
    { pointers: { i: 4 }, note: "Monotonic increasing stack of bar indices; pop when a shorter bar arrives." },
    { mark: { 2: "match", 3: "match" }, note: "Popped bar's area = height × (right − left − 1). O(n).", result: "10" } ] },
  java_m33_t1_ex_12: { kind: "array-pointers", label: "Trapping Rain Water (#42, stack)", array: [0, 1, 0, 2, 1, 0, 3], steps: [
    { pointers: { i: 3 }, note: "Stack of decreasing bars; pop a valley, water = min(left,right)−bottom width." },
    { mark: { 1: "match", 2: "match", 4: "match", 5: "match" }, note: "Add trapped water per popped level. O(n).", result: "trapped units" } ] },
  java_m33_t1_ex_13: { kind: "stack", label: "Stack Synthesis — classics", array: ["()", "next>", "decode", "calc"], outLabel: "stack", steps: [
    { cursor: 0, stack: ["valid?"], note: "Balanced brackets, next-greater (monotonic), expression eval, decode." },
    { cursor: 3, stack: [], note: "All use LIFO to defer/undo work.", result: "patterns" } ] },
  java_m33_t1_ex_14: { kind: "stack", label: "M33 T1 Stack Synthesis", array: ["push", "push", "pop", "peek"], outLabel: "stack", steps: [
    { cursor: 1, stack: ["a", "b"], note: "O(1) push/pop/peek; great for matching, backtracking, undo." },
    { cursor: 3, stack: ["a"], note: "Monotonic stack solves next-greater/smaller in O(n).", result: "mastery" } ] },
  java_m33_t1_ex_16: { kind: "stack", label: "Sort a Stack using a Temp Stack", array: [3, 1, 4, 2], outLabel: "temp (sorted)", steps: [
    { cursor: 0, stack: [1, 3], note: "Pop from input; insert into temp keeping it sorted (pop temp back if needed)." },
    { cursor: 3, stack: [1, 2, 3, 4], note: "O(n²), only two stacks, no other structure.", result: "[4,3,2,1] sorted" } ] },
  java_m33_t1_ex_17: { kind: "stack", label: "Reverse a Stack using Recursion", array: [1, 2, 3], outLabel: "stack", steps: [
    { cursor: 0, stack: [1, 2, 3], note: "Recursively pop all, then insertAtBottom each on the way back." },
    { cursor: 2, stack: [3, 2, 1], note: "No extra data structure — uses the call stack.", result: "[3,2,1]" } ] },

  // ───────────────────────── stack-queue (completes → 11/11) ─────────────────────────
  java_m33_t5_ex_1: { kind: "linked-list", label: "LRU Cache (#146)", list: ["head", "C", "B", "A", "tail"], steps: [
    { pointers: { mru: 1, lru: 3 }, note: "HashMap key→node + doubly-linked list ordered by recency." },
    { list: ["head", "B", "C", "A", "tail"], mark: { 1: "match" }, note: "Access → move node to head; full → evict node before tail. O(1).", result: "O(1) get & put" } ] },
  java_m33_t5_ex_2: { kind: "array-pointers", label: "Task Scheduler (#621)", array: ["A", "A", "A", "B", "B", "B"], meta: { n: 2 }, steps: [
    { pointers: { i: 0 }, note: "Most frequent task sets the frame: (maxCount−1)*(n+1) + #maxFreqTasks." },
    { mark: { 0: "match", 3: "match" }, note: "Idle slots fill if not enough other tasks. Max-heap greedy alternative.", result: "min intervals" } ] },
  java_m33_t5_ex_3: { kind: "linked-list", label: "Design Twitter (#355)", list: ["t9", "t7", "t5", "t3"], steps: [
    { pointers: { newest: 0 }, note: "Per-user tweet lists (with timestamps); follow-set per user." },
    { mark: { 0: "match", 1: "match" }, note: "getFeed = merge followees' lists via a max-heap, take 10 newest.", result: "10 latest tweets" } ] },
  java_m33_t5_ex_5: { kind: "array-pointers", label: "Decode Ways (#91)", array: ["2", "2", "6"], steps: [
    { pointers: { i: 2 }, note: "dp[i] = ways to decode prefix; +dp[i−1] if 1 digit valid, +dp[i−2] if 2 digits 10–26." },
    { mark: { 0: "match", 1: "match", 2: "match" }, note: "\"226\" → 2|2|6, 22|6, 2|26 = 3.", result: "3" } ] },
  java_m33_t5_ex_6: { kind: "array-pointers", label: "LFU Cache (#460)", array: ["freq1", "freq2", "freq3"], steps: [
    { pointers: { i: 0 }, note: "HashMap key→node + freq→DLL of nodes at that frequency + minFreq tracker." },
    { mark: { 0: "dropped" }, note: "Evict least-frequent; tie → least-recently-used in that bucket. O(1).", result: "O(1) LFU" } ] },
  java_m33_t5_ex_7: { kind: "array-pointers", label: "Stock Price Fluctuation (#2034)", array: [10, 20, 15, 25], steps: [
    { pointers: { i: 3 }, note: "TreeMap of price→count for min/max; HashMap time→price; track latest time." },
    { mark: { 3: "match" }, note: "Corrections update both maps. max/min = TreeMap ends.", result: "current/max/min" } ] },
  java_m33_t5_ex_9: { kind: "stack", label: "Min Stack (auxiliary)", array: [5, 2, 7, 1], outLabel: "min stack", steps: [
    { cursor: 1, stack: [5, 2], note: "Second stack mirrors the running minimum at each push." },
    { cursor: 3, stack: [5, 2, 2, 1], note: "getMin() = top of min stack, O(1).", result: "O(1) getMin" } ] },
  java_m33_t5_ex_10: { kind: "stack", label: "Synthesis — LRU + Calc + Scheduler", array: ["LRU", "calc", "tasks"], outLabel: "structures", steps: [
    { cursor: 0, stack: ["map+DLL"], note: "Pick the structure the access pattern demands: recency, precedence, frequency." },
    { cursor: 2, stack: ["heap"], note: "Compose maps + lists + heaps for O(1)/O(log n) designs.", result: "design toolkit" } ] },
  java_m33_t5_ex_11: { kind: "stack", label: "M33 T5 Synthesis — all patterns", array: ["stack", "queue", "deque"], outLabel: "ADTs", steps: [
    { cursor: 0, stack: ["LIFO"], note: "Stack (LIFO), Queue (FIFO), Deque (both), PriorityQueue (ordered)." },
    { cursor: 2, stack: ["both ends"], note: "Match the ADT to the access pattern.", result: "mastery" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-22: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
