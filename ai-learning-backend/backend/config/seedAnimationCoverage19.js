/**
 * seedAnimationCoverage19.js — GAP #1 animation, BIG batch 19 (~42).
 * Hammers the three largest buckets: hashing (18), linked-list (16), queue (8).
 * Existing renderers (array-pointers / stack / linked-list), data-only.
 * Verify: node config/auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";

const A = {
  // ───────────────────────── hashing (18) ─────────────────────────
  java_m31_t4_ex_6: { kind: "array-pointers", label: "Find All Anagrams (#438)", array: ["c", "b", "a", "e", "b", "a"], meta: { p: "abc" }, steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Fixed window = len(p); compare its freq[26] to p's freq." },
    { pointers: { L: 3, R: 5 }, window: [3, 5], mark: { 3: "match", 4: "match", 5: "match" }, note: "Slide: add right char, drop left char; equal freqs → record start.", result: "[0, 3]" } ] },
  java_m31_t4_ex_16: { kind: "array-pointers", label: "Permutation in String (#567)", array: ["e", "i", "d", "b", "a", "o", "o"], meta: { p: "ab" }, steps: [
    { pointers: { L: 0, R: 1 }, window: [0, 1], note: "Window size = len(p); track a 'matches' counter of the 26 freq buckets." },
    { pointers: { L: 3, R: 4 }, window: [3, 4], mark: { 3: "match", 4: "match" }, note: "All 26 buckets match → s2 contains a permutation of s1.", result: "true" } ] },
  java_m31_t4_ex_17: { kind: "array-pointers", label: "Max Number of 'balloon' (#1189)", array: ["b", "a", "l", "o", "o", "n", "l"], steps: [
    { pointers: { i: 6 }, note: "Count text letters; 'balloon' needs b,a,n ×1 and l,o ×2." },
    { note: "Answer = min(cnt[b], cnt[a], cnt[l]/2, cnt[o]/2, cnt[n]).", result: "min over letters" } ] },
  java_m31_t4_ex_15: { kind: "array-pointers", label: "Anagram & Frequency Synthesis", array: ["freq[26]", "vs", "HashMap"], steps: [
    { pointers: { i: 0 }, note: "Lowercase-only → int[26] is faster than a HashMap." },
    { note: "Sliding window + a match-counter beats re-comparing every step.", result: "the toolkit" } ] },
  java_m34_t1_ex_11: { kind: "array-pointers", label: "Random Pick Index (#398)", array: [1, 2, 3, 3, 3], meta: { target: 3 }, steps: [
    { pointers: { i: 4 }, mark: { 2: "match", 3: "match", 4: "match" }, note: "Reservoir sampling: kth match replaces the pick with probability 1/k." },
    { note: "O(1) space, O(n) per pick — no precomputed index lists.", result: "uniform random index" } ] },
  java_m34_t1_ex_14: { kind: "array-pointers", label: "Two Sum — ALL pairs", array: [3, 1, 3, 2, 1], meta: { target: 4 }, steps: [
    { pointers: { i: 3 }, note: "Map value → list of indices; for each x, look up (target − x)." },
    { mark: { 0: "match", 3: "match", 2: "match" }, note: "Emit every index pair, not just the first.", result: "all (i,j)" } ] },
  java_m34_t2_ex_2: { kind: "array-pointers", label: "Top K Frequent Elements (#347)", array: [1, 1, 1, 2, 2, 3], meta: { k: 2 }, steps: [
    { pointers: { i: 5 }, note: "Count freqs in a HashMap, then bucket-sort by frequency (index = count)." },
    { mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "Read buckets high→low until k taken. O(n).", result: "[1, 2]" } ] },
  java_m34_t2_ex_3: { kind: "array-pointers", label: "Word Pattern (#290)", array: ["a→dog", "b→cat", "a→dog"], steps: [
    { pointers: { i: 1 }, note: "TWO maps: char→word AND word→char must stay consistent (bijection)." },
    { mark: { 2: "match" }, note: "Any conflicting mapping → false.", result: "true" } ] },
  java_m34_t2_ex_4: { kind: "array-pointers", label: "Isomorphic Strings (#205)", array: ["e→a", "g→d", "g→d"], steps: [
    { pointers: { i: 1 }, note: "Same idea as Word Pattern: two maps enforce a one-to-one char mapping." },
    { mark: { 2: "match" }, note: "'egg' ↔ 'add' is isomorphic.", result: "true" } ] },
  java_m34_t2_ex_6: { kind: "array-pointers", label: "Brick Wall (#554)", array: [1, 2, 2, 1, 3], steps: [
    { pointers: { i: 4 }, note: "Map each running edge-position → count; the most common edge is where fewest bricks are cut." },
    { note: "Answer = totalRows − maxEdgeCount.", result: "fewest crossed bricks" } ] },
  java_m34_t2_ex_7: { kind: "array-pointers", label: "Minimum Window Substring (#76)", array: ["A", "D", "O", "B", "E", "C", "A"], meta: { t: "ABC" }, steps: [
    { pointers: { L: 0, R: 5 }, window: [0, 5], note: "Expand R until window covers t's freq; then shrink L while still valid." },
    { pointers: { L: 5, R: 6 }, window: [5, 6], mark: { 5: "match", 6: "match" }, note: "Track the smallest valid window seen.", result: "\"BANC\"-style min" } ] },
  java_m34_t3_ex_2: { kind: "array-pointers", label: "Contains Duplicate (#217)", array: [1, 2, 3, 1], steps: [
    { pointers: { i: 3 }, note: "Add each value to a HashSet; if add() fails it's already present." },
    { mark: { 0: "match", 3: "match" }, note: "O(n) time, O(n) space.", result: "true" } ] },
  java_m34_t3_ex_4: { kind: "array-pointers", label: "Jewels and Stones (#771)", array: ["a", "A", "b", "a", "A"], meta: { jewels: "aA" }, steps: [
    { pointers: { i: 4 }, note: "Put jewel chars in a HashSet; scan stones, count set hits." },
    { mark: { 0: "match", 1: "match", 3: "match", 4: "match" }, note: "O(J + S).", result: "4" } ] },
  java_m34_t3_ex_11: { kind: "array-pointers", label: "Happy Number (HashSet)", array: [19, 82, 68, 100, 1], steps: [
    { pointers: { i: 0 }, note: "Repeatedly sum squares of digits; store each seen value in a HashSet." },
    { mark: { 4: "match" }, note: "Reach 1 → happy; revisit a value → cycle → not happy.", result: "true" } ] },
  java_m34_t4_ex_2: { kind: "array-pointers", label: "Anagram Key: freq vs sort", array: ["eat", "tea", "ate"], steps: [
    { pointers: { i: 0 }, note: "Group anagrams by a canonical key." },
    { note: "Key = sorted chars O(k log k), or a 26-count signature O(k). Both map to one bucket.", result: "same group" } ] },
  java_m34_t5_ex_1: { kind: "array-pointers", label: "Insert Delete GetRandom O(1) (#380)", array: [10, 20, 30], steps: [
    { pointers: { i: 2 }, note: "ArrayList + HashMap(value→index). Insert appends; GetRandom picks a random index." },
    { mark: { 1: "dropped", 2: "match" }, note: "Delete: swap target with last, pop, fix the moved element's index. All O(1).", result: "O(1) all ops" } ] },
  java_m34_t5_ex_2: { kind: "linked-list", label: "LRU Cache (HashMap + DLL)", list: ["head", "C", "B", "A", "tail"], steps: [
    { pointers: { mru: 1, lru: 3 }, note: "HashMap key→node; doubly-linked list orders by recency (MRU at head)." },
    { list: ["head", "B", "C", "A", "tail"], pointers: { mru: 1 }, mark: { 1: "match" }, note: "get/put: unlink node, move to head. Capacity full → evict node before tail.", result: "O(1) get & put" } ] },
  java_m34_t5_ex_5: { kind: "array-pointers", label: "Word Frequency + Top K", array: ["the", "the", "day", "the", "day"], meta: { k: 1 }, steps: [
    { pointers: { i: 4 }, note: "HashMap counts words; a size-k min-heap (or bucket sort) keeps the most frequent." },
    { mark: { 0: "match", 1: "match", 3: "match" }, note: "Heap evicts the smallest when over k.", result: "[\"the\"]" } ] },

  // ───────────────────────── linked-list (16) ─────────────────────────
  java_m32_t2_ex_8: { kind: "linked-list", label: "Intersection of Two Lists (#160)", list: [4, 1, 8, 4, 5], list2: [5, 6, 1, 8, 4, 5], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Two pointers; when one hits null, jump it to the OTHER head." },
    { pointers: { a: 2 }, pointers2: { b: 3 }, mark: { 2: "match" }, mark2: { 3: "match" }, note: "After ≤ m+n steps they meet at the join (or both null).", result: "node '8'" } ] },
  java_m32_t3_ex_2: { kind: "linked-list", label: "Reverse: return prev, not curr", list: [1, 2, 3], steps: [
    { pointers: { prev: -1, curr: 0 }, note: "Loop ends when curr == null." },
    { list: [3, 2, 1], links: ["←", "←"], pointers: { prev: 0 }, note: "prev is the new head; curr is null. So return prev.", result: "new head = prev" } ] },
  java_m32_t3_ex_4: { kind: "linked-list", label: "Reverse Between (#92)", list: [1, 2, 3, 4, 5], meta: { left: 2, right: 4 }, steps: [
    { pointers: { left: 1, right: 3 }, mark: { 1: "current", 2: "current", 3: "current" }, note: "Reverse only nodes left..right using the head-insertion trick." },
    { list: [1, 4, 3, 2, 5], links: [undefined, "←", "←"], mark: { 1: "match", 3: "match" }, note: "Stitch the reversed segment back to its neighbours.", result: "[1,4,3,2,5]" } ] },
  java_m32_t3_ex_5: { kind: "linked-list", label: "Reverse Nodes in k-Group (#25)", list: [1, 2, 3, 4, 5], meta: { k: 2 }, steps: [
    { mark: { 0: "current", 1: "current" }, note: "Check k nodes remain; reverse exactly k, then recurse/loop on the rest." },
    { list: [2, 1, 4, 3, 5], links: ["←", undefined, "←"], mark: { 4: "dropped" }, note: "Leftover (< k) stays as-is.", result: "[2,1,4,3,5]" } ] },
  java_m32_t3_ex_6: { kind: "linked-list", label: "Palindrome LL, O(1) space", list: [1, 2, 2, 1], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "Find mid with slow/fast, reverse the second half." },
    { list: [1, 2, 1, 2], pointers: { p: 0, q: 2 }, mark: { 0: "match", 2: "match" }, note: "Walk halves inward comparing; restore if needed.", result: "true" } ] },
  java_m32_t3_ex_7: { kind: "linked-list", label: "Swap Pairs (#24)", list: [1, 2, 3, 4], steps: [
    { mark: { 0: "current", 1: "current" }, note: "Swap adjacent pairs by relinking (not by copying values)." },
    { list: [2, 1, 4, 3], mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "A dummy head simplifies the first swap.", result: "[2,1,4,3]" } ] },
  java_m32_t3_ex_8: { kind: "linked-list", label: "Odd Even List (#328)", list: [1, 2, 3, 4, 5], steps: [
    { mark: { 0: "current", 2: "current", 4: "current" }, note: "Thread odd-position nodes into one chain, even into another." },
    { list: [1, 3, 5, 2, 4], mark: { 0: "match", 1: "match", 2: "match" }, note: "Append the even chain after the odd chain.", result: "[1,3,5,2,4]" } ] },
  java_m32_t3_ex_9: { kind: "linked-list", label: "Reverse Recursively", list: [1, 2, 3], steps: [
    { pointers: { head: 0 }, note: "Recurse to the tail; it becomes the new head." },
    { list: [3, 2, 1], links: ["←", "←"], note: "Unwinding: head.next.next = head; head.next = null.", result: "reversed" } ] },
  java_m32_t3_ex_10: { kind: "linked-list", label: "Rotate List (#61)", list: [1, 2, 3, 4, 5], meta: { k: 2 }, steps: [
    { pointers: { tail: 4 }, links: [undefined, undefined, undefined, undefined, "↺"], note: "Close into a ring; new tail = (len − k%len − 1)th node." },
    { list: [4, 5, 1, 2, 3], mark: { 0: "match", 1: "match" }, note: "Break the ring after the new tail.", result: "[4,5,1,2,3]" } ] },
  java_m32_t4_ex_1: { kind: "linked-list", label: "Floyd's Cycle Detection", list: [3, 2, 0, 4], links: [undefined, undefined, undefined, "↺"], steps: [
    { pointers: { slow: 0, fast: 0 }, note: "slow +1, fast +2 each step." },
    { pointers: { slow: 2, fast: 2 }, mark: { 2: "match" }, note: "If they ever meet, a cycle exists; if fast hits null, none.", result: "cycle = true" } ] },
  java_m32_t4_ex_3: { kind: "linked-list", label: "Cycle Entry (Phase 2)", list: [1, 2, 3, 4], links: [undefined, undefined, undefined, "↺"], steps: [
    { pointers: { slow: 2 }, note: "After the meeting, reset one pointer to head." },
    { pointers: { p: 0, q: 1 }, mark: { 1: "match" }, note: "Advance both +1; they meet AT the cycle's entry node.", result: "entry node" } ] },
  java_m32_t5_ex_1: { kind: "linked-list", label: "Merge Two Sorted Lists", list: [1, 2, 4], list2: [1, 3, 4], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Dummy head; always splice the smaller front node." },
    { list: [1, 1, 2, 3, 4, 4], mark: { 0: "match", 1: "match" }, note: "Append the leftover tail. O(m+n).", result: "[1,1,2,3,4,4]" } ] },
  java_m32_t5_ex_5: { kind: "linked-list", label: "Merge K Sorted Lists (#23)", list: [1, 4, 5], list2: [1, 3, 4], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Min-heap of the K current heads; pop smallest, push its next." },
    { list: [1, 1, 3, 4, 4, 5], mark: { 0: "match" }, note: "O(N log k). (Or pairwise-merge in log k rounds.)", result: "fully merged" } ] },
  java_m32_t5_ex_6: { kind: "linked-list", label: "Add Two Numbers (#2)", list: [2, 4, 3], list2: [5, 6, 4], steps: [
    { pointers: { a: 0 }, pointers2: { b: 0 }, note: "Digits stored reversed; add per node with a carry." },
    { list: [7, 0, 8], mark: { 0: "match", 1: "match", 2: "match" }, note: "342 + 465 = 807. Carry can extend the result.", result: "[7,0,8]" } ] },
  java_m32_t5_ex_7: { kind: "linked-list", label: "Reorder List", list: [1, 2, 3, 4], steps: [
    { pointers: { slow: 1 }, note: "Find mid, reverse second half, then weave the two halves." },
    { list: [1, 4, 2, 3], mark: { 0: "match", 1: "match" }, note: "L0→Ln→L1→Ln-1→… in O(1) space.", result: "[1,4,2,3]" } ] },
  java_m32_t5_ex_3: { kind: "linked-list", label: "Sort List — split trick", list: [4, 2, 1, 3], steps: [
    { pointers: { slow: 1, fast: 3 }, note: "fast=head.next so even lists split evenly; cut at slow.next." },
    { list: [1, 2, 3, 4], mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "Merge-sort each half. O(n log n), O(1) extra (bottom-up).", result: "sorted" } ] },

  // ───────────────────────── queue (8) ─────────────────────────
  java_m33_t3_ex_12: { kind: "stack", label: "First Non-Repeating in Stream (#387)", array: ["a", "a", "b", "c"], outLabel: "queue front", steps: [
    { cursor: 1, stack: [], note: "Queue holds candidate non-repeaters; a freq map tracks counts." },
    { cursor: 3, stack: ["b", "c"], note: "On each char, pop fronts whose count > 1; front = current answer.", result: "'b'" } ] },
  java_m33_t3_ex_13: { kind: "stack", label: "Reverse First K of a Queue", array: [1, 2, 3, 4, 5], meta: { k: 3 }, outLabel: "queue", steps: [
    { cursor: 2, stack: [3, 2, 1], note: "Dequeue first k into a STACK (reverses them)." },
    { cursor: 4, stack: [3, 2, 1, 4, 5], note: "Enqueue the stack back, then rotate the remaining (n−k) to the rear.", result: "[3,2,1,4,5]" } ] },
  java_m33_t3_ex_14: { kind: "stack", label: "Generate Binary Numbers 1..N", array: ["1", "10", "11"], outLabel: "BFS queue", steps: [
    { cursor: 0, stack: ["1"], note: "Start queue with \"1\". Pop front, print it." },
    { cursor: 2, stack: ["100", "101"], note: "Enqueue front+\"0\" and front+\"1\". Level-order yields 1,10,11,100…", result: "1,10,11,…" } ] },
  java_m33_t3_ex_16: { kind: "stack", label: "Interleave Two Halves of a Queue", array: [1, 2, 3, 4, 5, 6], outLabel: "queue", steps: [
    { cursor: 2, stack: [1, 2, 3], note: "Push first half to a stack/aux queue, keep second half." },
    { cursor: 5, stack: [1, 4, 2, 5, 3, 6], note: "Alternately dequeue one from each half.", result: "[1,4,2,5,3,6]" } ] },
  java_m33_t4_ex_1: { kind: "stack", label: "Deque — both-ends demo", array: ["A", "B", "C"], outLabel: "deque", steps: [
    { cursor: 0, stack: ["A", "B", "C"], note: "ArrayDeque: O(1) addFirst/addLast, pollFirst/pollLast." },
    { cursor: 2, stack: ["B"], note: "One structure does stack (one end) OR queue (both ends).", result: "O(1) both ends" } ] },
  java_m33_t4_ex_6: { kind: "array-pointers", label: "Sliding Window Maximum — why O(n)", array: [1, 3, -1, -3, 5, 3], meta: { k: 3 }, steps: [
    { pointers: { L: 0, R: 2 }, window: [0, 2], note: "Monotonic-decreasing deque of INDICES; front is the window max." },
    { pointers: { L: 3, R: 5 }, window: [3, 5], mark: { 4: "match" }, note: "Each index pushed & popped once → O(n) total, not O(nk).", result: "[3,3,5,5]" } ] },
  java_m33_t4_ex_7: { kind: "array-pointers", label: "Longest Subarray, |diff| ≤ limit (#1438)", array: [8, 2, 4, 7], meta: { limit: 4 }, steps: [
    { pointers: { L: 0, R: 1 }, window: [0, 1], note: "Two monotonic deques track window max AND min." },
    { pointers: { L: 1, R: 2 }, window: [1, 2], mark: { 1: "match", 2: "match" }, note: "Shrink L while max−min > limit; track longest valid window.", result: "2" } ] },
  java_m33_t4_ex_8: { kind: "array-pointers", label: "Shortest Subarray Sum ≥ K (#862)", array: [2, -1, 2, 3], meta: { k: 3 }, steps: [
    { pointers: { L: 0, R: 3 }, note: "Prefix sums + a monotonic deque of indices (handles negatives)." },
    { pointers: { L: 2, R: 3 }, mark: { 2: "match", 3: "match" }, note: "Pop front when prefix[R]−prefix[front] ≥ k; pop back if not increasing.", result: "shortest len" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-19: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
