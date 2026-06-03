/**
 * seedAnimationCoverage23.js — GAP #1 animation, BIG batch 23 (~45).
 * COMPLETES three whole buckets: linked-list (27), queue (10), sorting (8).
 * Existing renderers (linked-list / stack / array-pointers), data-only.
 * Verify: node config/auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";

const A = {
  // ───────────────────────── linked-list (completes → 65/65) ─────────────────────────
  java_m32_t1_ex_15: { kind: "linked-list", label: "LL Basics Synthesis", list: [1, 2, 3, 4], steps: [
    { pointers: { head: 0, tail: 3 }, note: "Node = {val, next}. A dummy head removes edge-cases on insert/delete." },
    { pointers: { curr: 2 }, note: "Traverse with a runner; track prev to splice. O(1) insert given the node.", result: "the basics" } ] },
  java_m32_t2_ex_13: { kind: "linked-list", label: "Floyd's Proof Demo", list: [1, 2, 3, 4], links: [undefined, undefined, undefined, "↺"], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "Inside the cycle the gap shrinks by 1 each step → they must meet." },
    { pointers: { slow: 2, fast: 2 }, mark: { 2: "match" }, note: "Distance head→entry = distance meeting→entry (mod cycle).", result: "meet proven" } ] },
  java_m32_t2_ex_14: { kind: "linked-list", label: "Two-Pointer Synthesis", list: [1, 2, 3, 4, 5], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "slow/fast finds the middle; n-ahead gap finds the nth-from-end." },
    { pointers: { slow: 2 }, mark: { 2: "match" }, note: "Fast 2× speed → slow lands on the mid when fast hits the end.", result: "mid / cycle / nth" } ] },
  java_m32_t2_ex_15: { kind: "linked-list", label: "T2 Two-Pointer Synthesis", list: [1, 2, 3, 4], steps: [
    { pointers: { slow: 0, fast: 1 }, note: "One pass, O(1) space: middle, nth-from-end, palindrome, cycle." },
    { pointers: { slow: 2, fast: 3 }, note: "Choose the speed/offset to match the target.", result: "mastery" } ] },
  java_m32_t3_ex_11: { kind: "linked-list", label: "Reversal Synthesis", list: [1, 2, 3], steps: [
    { pointers: { prev: -1, curr: 0 }, note: "Iterative: save next, point curr.next = prev, advance both." },
    { list: [3, 2, 1], links: ["←", "←"], note: "Reverse-between & reverse-k-group reuse this on a sublist.", result: "the pattern" } ] },
  java_m32_t3_ex_12: { kind: "linked-list", label: "T3 Reversal Synthesis", list: [1, 2, 3, 4], steps: [
    { pointers: { prev: -1, curr: 0 }, note: "Three pointers (prev, curr, next) flip each link in place." },
    { list: [4, 3, 2, 1], links: ["←", "←", "←"], note: "O(n) time, O(1) space; recursion costs O(n) stack.", result: "reversed" } ] },
  java_m32_t4_ex_10: { kind: "linked-list", label: "Cycle — all three phases", list: [1, 2, 3, 4], links: [undefined, "↺", undefined, "↺"], steps: [
    { pointers: { slow: 3, fast: 3 }, note: "Phase 1: detect (slow/fast meet). Phase 2: reset one to head → meet at entry." },
    { pointers: { p: 1 }, mark: { 1: "match" }, note: "Phase 3: walk the loop once to count its length.", result: "detect + entry + length" } ] },
  java_m32_t4_ex_11: { kind: "array-pointers", label: "Find Duplicate, no modify", array: [1, 3, 4, 2, 2], steps: [
    { pointers: { slow: 1, fast: 2 }, note: "Read-only constraint → treat values as 'next' links, run Floyd." },
    { mark: { 3: "match", 4: "match" }, note: "O(n) time, O(1) space, array untouched.", result: "2" } ] },
  java_m32_t4_ex_12: { kind: "array-pointers", label: "Floyd on Functional Sequences", array: [2, 0, 2, 1, 1, 0], steps: [
    { pointers: { slow: 0, fast: 1 }, note: "Any x→f(x) sequence eventually cycles (finite range)." },
    { mark: { 2: "match" }, note: "Floyd finds the cycle start = the repeated/fixed value.", result: "cycle entry" } ] },
  java_m32_t4_ex_13: { kind: "linked-list", label: "Cycle: entry + length, O(1)", list: [1, 2, 3, 4, 5], links: [undefined, undefined, "↺", undefined, "↺"], steps: [
    { pointers: { slow: 4, fast: 4 }, note: "Meet point → reset to head, advance both +1 → meet at entry." },
    { pointers: { p: 2 }, mark: { 2: "match" }, note: "From entry, loop back to itself to measure length. All O(1) space.", result: "entry & length" } ] },
  java_m32_t4_ex_14: { kind: "array-pointers", label: "Synthesis: Floyd everywhere", array: [3, 1, 3, 4, 2], steps: [
    { pointers: { slow: 0, fast: 1 }, note: "LL cycle, duplicate number, happy number — same tortoise & hare." },
    { mark: { 0: "match", 2: "match" }, note: "Map the problem to a 'next' function, then run Floyd.", result: "one technique" } ] },
  java_m32_t4_ex_15: { kind: "linked-list", label: "T4 Cycle Detection Synthesis", list: [1, 2, 3, 4], links: [undefined, undefined, undefined, "↺"], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "Detect with meeting; locate entry with the head-reset trick." },
    { pointers: { slow: 2, fast: 2 }, mark: { 2: "match" }, note: "O(n) time, O(1) space beats a HashSet's O(n) space.", result: "mastery" } ] },
  java_m32_t4_ex_2: { kind: "linked-list", label: "Why Floyd's Works", list: [1, 2, 3, 4], links: [undefined, "↺", undefined, "↺"], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "If there's a cycle, fast gains 1 step on slow each move." },
    { pointers: { slow: 3, fast: 3 }, mark: { 3: "match" }, note: "The gap is bounded by cycle length → guaranteed meeting.", result: "intuition" } ] },
  java_m32_t4_ex_4: { kind: "array-pointers", label: "Find the Duplicate (#287)", array: [3, 1, 3, 4, 2], steps: [
    { pointers: { slow: 0, fast: 1 }, note: "n+1 values in [1,n] → pigeonhole guarantees a duplicate = a cycle." },
    { mark: { 0: "match", 2: "match" }, note: "Floyd locates the cycle entry = the duplicate.", result: "3" } ] },
  java_m32_t4_ex_5: { kind: "linked-list", label: "Cycle Length", list: [1, 2, 3, 4], links: [undefined, undefined, undefined, "↺"], steps: [
    { pointers: { p: 1 }, note: "Once slow & fast meet, freeze one and step the other until it returns." },
    { pointers: { p: 1 }, mark: { 1: "match" }, note: "Count the steps = cycle length.", result: "length" } ] },
  java_m32_t4_ex_6: { kind: "array-pointers", label: "Happy Number (#202)", array: [19, 82, 68, 100, 1], steps: [
    { pointers: { slow: 0, fast: 1 }, note: "next(x) = sum of squared digits; sequence cycles or reaches 1." },
    { mark: { 4: "match" }, note: "Floyd (no HashSet): meet at 1 → happy; meet elsewhere → not.", result: "true" } ] },
  java_m32_t4_ex_7: { kind: "linked-list", label: "Intersection Node (#160)", list: [4, 1, 8, 4, 5], list2: [5, 6, 1, 8, 4, 5], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Switch each pointer to the other head at its end → equal total distance." },
    { pointers: { a: 2 }, pointers2: { b: 3 }, mark: { 2: "match" }, mark2: { 3: "match" }, note: "They align at the join node (or both null).", result: "node '8'" } ] },
  java_m32_t4_ex_8: { kind: "linked-list", label: "Prove Phase 2, Multiple Entries", list: [1, 2, 3, 4, 5], links: [undefined, undefined, "↺", undefined, "↺"], steps: [
    { pointers: { slow: 4, fast: 4 }, note: "Algebra: head→entry = (cycleLen − meet-offset) regardless of where the loop joins." },
    { pointers: { p: 2 }, mark: { 2: "match" }, note: "So head-reset always converges on the true entry.", result: "entry proven" } ] },
  java_m32_t4_ex_9: { kind: "tree", label: "Detect Cycle in Directed Graph", nodes: [{ id: 0, v: "A", x: 90, y: 40 }, { id: 1, v: "B", x: 250, y: 40 }, { id: 2, v: "C", x: 250, y: 130 }, { id: 3, v: "D", x: 90, y: 130 }], edges: [[0, 1], [1, 2], [2, 3], [3, 0]], W: 360, H: 165, steps: [
    { cls: { "0": "current" }, note: "DFS with 3 colours: white(unseen), grey(on stack), black(done)." },
    { cls: { "0": "match", "3": "dropped" }, note: "An edge to a GREY node = back edge = cycle.", result: "cycle = true" } ] },
  java_m32_t5_ex_10: { kind: "linked-list", label: "Add Two Numbers II (MSB first)", list: [7, 2, 4, 3], list2: [5, 6, 4], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Digits stored MSB-first → push to stacks (or reverse) to add from the back." },
    { list: [7, 8, 0, 7], mark: { 0: "match" }, note: "Carry flows toward the front. 7243 + 564 = 7807.", result: "[7,8,0,7]" } ] },
  java_m32_t5_ex_11: { kind: "linked-list", label: "Merge Sort: verify + timing", list: [4, 2, 1, 3], steps: [
    { pointers: { slow: 1 }, note: "Split (slow/fast), sort halves, merge. O(n log n), stable." },
    { list: [1, 2, 3, 4], mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "Verify sorted in one pass; timing matches n log n.", result: "sorted" } ] },
  java_m32_t5_ex_12: { kind: "linked-list", label: "Merge Sort Synthesis", list: [3, 1, 2], steps: [
    { pointers: { slow: 0, fast: 1 }, note: "Top-down (recursion) or bottom-up (O(1) space) merge sort." },
    { list: [1, 2, 3], note: "Merging two sorted lists is the core primitive.", result: "the recipe" } ] },
  java_m32_t5_ex_13: { kind: "linked-list", label: "T5 Sorting Synthesis", list: [2, 4, 1, 3], steps: [
    { pointers: { slow: 1 }, note: "Merge sort fits LL: no random access needed, stable, O(1) extra (bottom-up)." },
    { list: [1, 2, 3, 4], mark: { 0: "match", 3: "match" }, note: "Quicksort needs random access → poor on lists.", result: "mastery" } ] },
  java_m32_t5_ex_2: { kind: "linked-list", label: "Why Merge, not Quicksort, for LL", list: [3, 1, 4, 2], steps: [
    { pointers: { slow: 1 }, note: "Lists lack O(1) indexing → quicksort's partition is awkward & slow." },
    { list: [1, 2, 3, 4], note: "Merge sort only needs sequential access + splicing → ideal.", result: "merge sort wins" } ] },
  java_m32_t5_ex_4: { kind: "linked-list", label: "Sort Linked List (#148)", list: [4, 2, 1, 3], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "fast=head.next splits evenly; recurse, then merge." },
    { list: [1, 2, 3, 4], mark: { 0: "match", 3: "match" }, note: "O(n log n) time, O(log n) stack (or O(1) bottom-up).", result: "[1,2,3,4]" } ] },
  java_m32_t5_ex_8: { kind: "linked-list", label: "Sort LL with Duplicates", list: [3, 1, 3, 2], steps: [
    { pointers: { slow: 1 }, note: "Merge sort is stable → equal keys keep their original order." },
    { list: [1, 2, 3, 3], mark: { 2: "match", 3: "match" }, note: "Merge comparison uses ≤ to stay stable.", result: "[1,2,3,3]" } ] },
  java_m32_t5_ex_9: { kind: "linked-list", label: "Merge K Lists — min-heap detail", list: [1, 4, 5], list2: [1, 3, 4], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Heap holds the K current heads; poll min, push its next. Heap size ≤ k." },
    { list: [1, 1, 3, 4, 4, 5], mark: { 0: "match" }, note: "Total N nodes × log k pushes = O(N log k).", result: "merged" } ] },

  // ───────────────────────── queue (completes → 30/30) ─────────────────────────
  java_m33_t3_ex_9: { kind: "stack", label: "Queue vs PriorityQueue", array: ["enqueue", "dequeue", "peek"], outLabel: "queue (FIFO)", steps: [
    { cursor: 0, stack: ["a", "b", "c"], note: "Queue = strict FIFO; PriorityQueue = a heap, pops by priority not arrival." },
    { cursor: 1, stack: ["b", "c"], note: "Queue O(1) ops; PQ O(log n) push/pop.", result: "different orders" } ] },
  java_m33_t3_ex_10: { kind: "grid", label: "BFS Synthesis — islands / rotting", grid: [[1, 1, 0], [0, 1, 0], [0, 0, 1]], steps: [
    { cursor: [0, 0], cls: { "0,0": "source" }, note: "Multi-source BFS: seed all starts, expand level by level with a queue." },
    { cls: { "0,0": "visited", "0,1": "visited", "1,1": "frontier" }, note: "Level count = min time/distance. Islands = count BFS starts.", result: "levels / components" } ] },
  java_m33_t3_ex_11: { kind: "stack", label: "M33 T3 Queue Synthesis", array: ["BFS", "stream", "level"], outLabel: "queue", steps: [
    { cursor: 0, stack: ["seed"], note: "Queue powers BFS, level-order, stream windows, scheduling." },
    { cursor: 2, stack: ["next level"], note: "FIFO guarantees breadth-first / arrival order.", result: "mastery" } ] },
  java_m33_t3_ex_15: { kind: "stack", label: "Generate Patterns with Digits 1,2", array: ["1", "2", "11"], outLabel: "BFS queue", steps: [
    { cursor: 0, stack: ["1", "2"], note: "Seed queue with '1','2'; pop front, print." },
    { cursor: 2, stack: ["21", "22"], note: "Enqueue front+'1', front+'2' → all length-ordered patterns.", result: "1,2,11,12,21,22,…" } ] },
  java_m33_t3_ex_18: { kind: "stack", label: "Rotate Queue by Blocks of K", array: [1, 2, 3, 4, 5, 6], meta: { k: 2 }, outLabel: "queue", steps: [
    { cursor: 1, stack: [2, 1], note: "Dequeue K, reverse them (via stack), enqueue back." },
    { cursor: 5, stack: [2, 1, 4, 3, 6, 5], note: "Repeat per block.", result: "[2,1,4,3,6,5]" } ] },
  java_m33_t3_ex_19: { kind: "stack", label: "Reverse a Queue (recursion)", array: [1, 2, 3], outLabel: "queue", steps: [
    { cursor: 0, stack: [1, 2, 3], note: "Dequeue front, recurse on the rest, then enqueue the held front at the back." },
    { cursor: 2, stack: [3, 2, 1], note: "Call stack does the reversing — no explicit stack.", result: "[3,2,1]" } ] },
  java_m33_t4_ex_9: { kind: "stack", label: "Deque as Both Stack & Queue", array: ["addFirst", "addLast", "poll"], outLabel: "deque", steps: [
    { cursor: 0, stack: ["x", "y", "z"], note: "Use one end only → stack (LIFO); use both ends → queue (FIFO)." },
    { cursor: 2, stack: ["y", "z"], note: "ArrayDeque: all O(1), no capacity surprises.", result: "two ADTs, one class" } ] },
  java_m33_t4_ex_10: { kind: "stack", label: "Circular Deque Design", array: ["f", ".", ".", "r"], outLabel: "ring buffer", steps: [
    { cursor: 0, stack: ["front", "rear"], note: "Fixed array + head/tail indices that wrap with modulo." },
    { cursor: 3, stack: ["wrap →"], note: "Full when (tail+1)%n == head. All ends O(1).", result: "O(1) both ends" } ] },
  java_m33_t4_ex_11: { kind: "array-pointers", label: "Deque Synthesis — SW max / jump", array: [1, 3, -1, -3, 5], meta: { k: 3 }, steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Monotonic deque keeps candidates ordered; front = window's answer." },
    { pointers: { L: 2, R: 4 }, window: [2, 4], mark: { 4: "match" }, note: "Each index in/out once → O(n) for SW-max & jump-game reachability.", result: "O(n)" } ] },
  java_m33_t4_ex_12: { kind: "array-pointers", label: "M33 T4 Deque Synthesis", array: [2, 1, 5, 1, 3], steps: [
    { pointers: { L: 1, R: 3 }, window: [1, 3], note: "Monotonic deque solves next-greater & sliding extremes in O(n)." },
    { pointers: { L: 2, R: 4 }, window: [2, 4], note: "Push indices, pop dominated ones from the back.", result: "mastery" } ] },

  // ───────────────────────── sorting (completes → 23/23) ─────────────────────────
  java_m38_t3_ex_2: { kind: "array-pointers", label: "Meeting Rooms II (#253)", array: [0, 5, 15, 20, 30], steps: [
    { pointers: { i: 1 }, note: "Sort starts & ends separately; min-heap of end times = rooms in use." },
    { mark: { 0: "match", 2: "match" }, note: "New meeting reuses a room if earliest end ≤ its start. Peak = answer.", result: "min rooms" } ] },
  java_m38_t3_ex_4: { kind: "array-pointers", label: "Relative Sort Array (#1122)", array: [2, 3, 1, 3, 2, 4, 6], meta: { order: "[2,1,4,3]" }, steps: [
    { pointers: { i: 0 }, note: "Counting sort: count arr1; emit in arr2's order first." },
    { array: [2, 2, 1, 4, 3, 3, 6], mark: { 0: "match", 1: "match" }, note: "Leftover values appended in ascending order.", result: "[2,2,1,4,3,3,6]" } ] },
  java_m38_t4_ex_1: { kind: "array-pointers", label: "Sort Descending (Comparator)", array: [3, 1, 4, 1, 5], steps: [
    { pointers: { i: 0 }, note: "Comparator (a,b) -> b - a (or reverseOrder()) flips the order." },
    { array: [5, 4, 3, 1, 1], note: "Use Integer[], not int[] (comparators need objects).", result: "[5,4,3,1,1]" } ] },
  java_m38_t4_ex_2: { kind: "array-pointers", label: "Sort by Two Keys", array: ["bb", "a", "cc", "b"], steps: [
    { pointers: { i: 0 }, note: "comparingInt(length).thenComparing(natural) — primary then tie-breaker." },
    { array: ["a", "b", "bb", "cc"], note: "Length ascending, then alphabetical within equal lengths.", result: "[a,b,bb,cc]" } ] },
  java_m38_t4_ex_3: { kind: "array-pointers", label: "Stable Sort Demonstration", array: ["3a", "1x", "3b", "1y"], steps: [
    { pointers: { i: 0 }, note: "Stable = equal keys keep input order (3a before 3b)." },
    { array: ["1x", "1y", "3a", "3b"], mark: { 2: "match", 3: "match" }, note: "Java's Collections.sort / Arrays.sort(Object[]) is stable (TimSort).", result: "order preserved" } ] },
  java_m38_t4_ex_4: { kind: "grid", label: "Sort 2D Array by a Column", grid: [[3, 9], [1, 5], [2, 7]], steps: [
    { cls: { "0,0": "frontier" }, note: "Arrays.sort(rows, comparingInt(r -> r[col]))." },
    { cls: { "0,0": "path", "1,0": "path", "2,0": "path" }, note: "Sort by column 0 → rows reorder by that key.", result: "[[1,5],[2,7],[3,9]]" } ] },
  java_m38_t4_ex_5: { kind: "array-pointers", label: "Comparator Chaining (mixed)", array: ["A2", "A1", "B1"], steps: [
    { pointers: { i: 0 }, note: "comparing(group).thenComparing(value, reverseOrder()) — mixed directions." },
    { array: ["A2", "A1", "B1"], note: "Group ascending, value descending within a group.", result: "multi-key order" } ] },
  java_m38_t5_ex_4: { kind: "array-pointers", label: "Insertion Sort wins (nearly sorted)", array: [1, 2, 4, 3, 5], steps: [
    { pointers: { i: 3 }, note: "Each element is ~1 slot from home → one shift each." },
    { array: [1, 2, 3, 4, 5], mark: { 2: "match", 3: "match" }, note: "Near-sorted → O(n). TimSort exploits exactly this.", result: "[1,2,3,4,5]" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-23: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
