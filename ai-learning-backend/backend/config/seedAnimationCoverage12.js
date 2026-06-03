/**
 * seedAnimationCoverage12.js — GAP #1 animation coverage, batch 12
 * (strings / pattern-matching / hashing / queue / graph). Reuses existing
 * renderers (array-pointers, stack, tree). Pure step-data, NO frontend change.
 * Idempotent. Tracked in COMPETITIVE_GAP_ANALYSIS.md §5.
 */
import "dotenv/config";
import mongoose from "mongoose";
const n = (id, v, x, y) => ({ id, v, x, y });

const ANIMATIONS = {
  // #242 Valid Anagram — frequency arrays must match.
  java_m31_t4_ex_3: {
    kind: "array-pointers", label: "Valid Anagram",
    array: ["a", "n", "a", "g", "r", "a", "m"],
    steps: [
      { pointers: { i: 0 }, note: "Count letters of s (++), then of t (−−). Or one int[26]." },
      { pointers: { i: 6 }, note: "If every count returns to 0, they're anagrams.", caption: "a:3 n:1 g:1 r:1 m:1 == \"nagaram\"" },
      { pointers: {}, mark: { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match", 5: "match", 6: "match" }, note: "All frequencies match. O(n).", result: "true" },
    ],
  },

  // Reverse a String — two pointers swap inward.
  java_m31_t1_ex_4: {
    kind: "array-pointers", label: "Reverse String (two pointers)",
    array: ["h", "e", "l", "l", "o"],
    steps: [
      { pointers: { L: 0, R: 4 }, note: "Swap the two ends, move inward." },
      { array: ["o", "e", "l", "l", "h"], pointers: { L: 1, R: 3 }, note: "Swapped 'h' ↔ 'o'.", mark: { 0: "kept", 4: "kept" } },
      { array: ["o", "l", "l", "e", "h"], pointers: { L: 2, R: 2 }, note: "Pointers meet → reversed in place.", result: "\"olleh\"" },
    ],
  },

  // #13 Roman to Integer — subtract when a smaller symbol precedes a larger.
  java_m31_t1_ex_6: {
    kind: "array-pointers", label: "Roman to Integer (MCMXCIV)",
    array: ["M", "C", "M", "X", "C", "I", "V"],
    steps: [
      { pointers: { i: 1 }, note: "Scan left→right. If value < next value, SUBTRACT it.", caption: "C(100) < M(1000) → −100" },
      { pointers: { i: 3 }, note: "Otherwise add it.", caption: "M:+1000  CM:+900 → 1900" },
      { pointers: { i: 6 }, note: "XC = 90, IV = 4.", caption: "1900 + 90 + 4", result: "1994" },
    ],
  },

  // #49 Group Anagrams — sorted chars as the bucket key.
  java_m31_t4_ex_5: {
    kind: "array-pointers", label: "Group Anagrams",
    array: ["eat", "tea", "tan", "ate"],
    steps: [
      { pointers: { i: 0 }, note: "Sort each word's letters → that's its bucket key.", caption: "eat → \"aet\"" },
      { pointers: { i: 3 }, mark: { 0: "match", 1: "match", 3: "match" }, note: "eat, tea, ate all share key \"aet\".", caption: "tan → \"ant\"" },
      { pointers: {}, note: "HashMap<sortedKey, List<word>> groups them.", result: "[[eat,tea,ate], [tan]]" },
    ],
  },

  // Build KMP LPS array.
  java_m31_t2_ex_3: {
    kind: "array-pointers", label: "KMP — build LPS array",
    array: ["A", "A", "B", "A", "A", "B"],
    steps: [
      { pointers: { i: 1 }, note: "lps[i] = length of the longest proper prefix that is also a suffix.", caption: "lps = [0, 1, …]" },
      { pointers: { i: 4 }, note: "Extend the match length when chars agree, else fall back via lps.", caption: "lps = [0,1,0,1,2,…]" },
      { pointers: { i: 5 }, note: "Done.", caption: "lps = [0,1,0,1,2,3]", result: "[0,1,0,1,2,3]" },
    ],
  },

  // KMP search — i never backtracks; j jumps via lps.
  java_m31_t2_ex_4: {
    kind: "array-pointers", label: "KMP Search (skip via LPS)",
    array: ["A", "A", "B", "A", "A", "B", "A", "A", "B"],
    steps: [
      { pointers: { i: 5 }, window: [0, 5], note: "Pattern AABAAB matched up to here against the text." },
      { pointers: { i: 5 }, note: "On a mismatch at j, jump j = lps[j−1] — the text pointer i never moves back." },
      { pointers: { i: 8 }, window: [3, 8], mark: { 3: "match", 4: "match", 5: "match", 6: "match", 7: "match", 8: "match" }, note: "Match found. Total O(n + m).", result: "found at index 3" },
    ],
  },

  // Queue basics — FIFO with front/rear.
  java_m33_t3_ex_1: {
    kind: "array-pointers", label: "Queue (FIFO)",
    array: ["A", "B", "C", "D"],
    steps: [
      { pointers: { front: 0, rear: 3 }, note: "offer() adds at the REAR; poll() removes from the FRONT." },
      { pointers: { front: 1, rear: 3 }, mark: { 0: "dropped" }, note: "poll() → returns A; front advances." },
      { pointers: { front: 1, rear: 3 }, note: "First in, first out — opposite of a stack.", result: "polled A" },
    ],
  },

  // #232 Implement Queue with Two Stacks.
  java_m33_t3_ex_2: {
    kind: "stack", label: "Queue from Two Stacks", outLabel: "out stack",
    array: ["push A", "push B", "pop"],
    steps: [
      { cursor: 1, stack: ["A", "B"], note: "push → 'in' stack." },
      { cursor: 2, stack: [], output: ["B", "A"], note: "pop with empty 'out' → pour 'in' into 'out' (reverses order)." },
      { cursor: 2, stack: [], output: ["B"], note: "Now pop from 'out' → A (FIFO). Amortized O(1).", result: "dequeued A" },
    ],
  },

  // Kahn's topological sort — process 0-indegree nodes.
  java_m37_t3_ex_2: {
    kind: "tree", label: "Topological Sort (Kahn's)", W: 360, H: 150,
    nodes: [n(0, "0", 60, 80), n(1, "1", 180, 40), n(2, "2", 180, 120), n(3, "3", 300, 80)],
    edges: [[0, 1], [0, 2], [1, 3], [2, 3]],
    steps: [
      { cls: { 0: "current" }, note: "Start from nodes with indegree 0 (no prerequisites)." },
      { cls: { 0: "visited", 1: "current", 2: "current" }, note: "Remove 0, decrement neighbors' indegrees → 1 and 2 become free." },
      { cls: { 0: "visited", 1: "visited", 2: "visited", 3: "match" }, note: "If all n nodes get processed → valid order (else a cycle).", result: "0, 1, 2, 3" },
    ],
  },

  // Dijkstra — relax via a min-priority-queue.
  java_m37_t4_ex_2: {
    kind: "tree", label: "Dijkstra (shortest path)", W: 360, H: 150,
    nodes: [n(0, "A:0", 50, 80), n(1, "B:4", 180, 40), n(2, "C:1", 180, 120), n(3, "D:?", 310, 80)],
    edges: [[0, 1], [0, 2], [1, 3], [2, 3]],
    steps: [
      { cls: { 0: "match" }, note: "dist[A]=0. Pop the closest unsettled node from the min-heap." },
      { cls: { 0: "visited", 2: "current" }, note: "Settle C (dist 1). Relax its edges: dist[v] = min(dist[v], dist[u]+w)." },
      { cls: { 0: "visited", 2: "visited", 1: "visited", 3: "match" }, note: "Each node settled once → O((V+E) log V). No negative edges.", result: "shortest dist to D" },
    ],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(ANIMATIONS)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ not found: ${exerciseId}`); missing++; }
    else { console.log(`✓ ${exerciseId} — ${animation.label} (${animation.steps.length} steps)`); updated++; }
  }
  console.log(`\n✅ coverage-12 (strings/kmp/hashing/queue/graph): ${updated} attached${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
