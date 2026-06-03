/**
 * seedAnimationCoverage24.js — GAP #1 animation, FINAL batch 24 (~48).
 * COMPLETES the last two buckets: matrix (7) + hashing (41) → 598/598 (100%).
 * Existing renderers (grid / array-pointers / linked-list), data-only.
 * Verify: node config/auditAnimations.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const cls = (...p) => Object.fromEntries(p);

const A = {
  // ───────────────────────── matrix (completes → 30/30) ─────────────────────────
  java_m30_5_t1_ex_11: { kind: "grid", label: "Matrix Multiplication (#311)", grid: [[1, 0, 2], [0, 3, 0], [4, 0, 0]], steps: [
    { cls: cls(["0,0", "frontier"]), note: "C[i][j] = Σ A[i][k] * B[k][j] over the shared dimension." },
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"]), note: "Triple loop i,j,k → O(n³).", result: "product matrix" } ] },
  java_m30_5_t1_ex_12: { kind: "grid", label: "Sparse Matrix Multiplication (#311)", grid: [[1, 0, 0], [0, 0, 3], [0, 0, 0]], steps: [
    { cls: cls(["0,0", "source"], ["1,2", "source"]), note: "Skip zeros: only multiply non-zero A[i][k] against row k of B." },
    { cls: cls(["0,0", "path"], ["1,2", "path"]), note: "Store rows as (col,val) lists → work ∝ non-zeros, not n³.", result: "sparse product" } ] },
  java_m30_5_t1_ex_13: { kind: "grid", label: "Valid Sudoku (#36)", grid: [[5, 3, ".", 7], [6, ".", ".", 1], [".", 9, 8, "."], [".", 6, ".", "."]], steps: [
    { cls: cls(["0,0", "frontier"]), note: "Track seen digits per row, per column, per 3×3 box (9 sets each)." },
    { cls: cls(["0,0", "path"], ["0,1", "path"]), note: "A repeat in any set → invalid. One O(n²) pass.", result: "true / false" } ] },
  java_m30_5_t1_ex_14: { kind: "grid", label: "Spiral Matrix II (#59)", grid: [[1, 2, 3], [8, 9, 4], [7, 6, 5]], steps: [
    { cls: cls(["0,0", "source"]), note: "Walk right→down→left→up, shrinking the bounds after each edge." },
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["0,2", "path"], ["1,2", "path"]), note: "Fill 1..n² in spiral order.", result: "spiral filled" } ] },
  java_m30_5_t4_ex_5: { kind: "grid", label: "Kth Smallest in Sorted Matrix (#378)", grid: [[1, 5, 9], [10, 11, 13], [12, 13, 15]], steps: [
    { cls: cls(["0,0", "source"]), note: "Binary-search the value range; count entries ≤ mid (rows sorted)." },
    { cls: cls(["1,2", "path"]), note: "Smallest value with count ≥ k = the answer. O(n log range).", result: "13 (k=8)" } ] },
  java_m30_5_t5_ex_5: { kind: "grid", label: "Shortest Path w/ Obstacle Removal (#1293)", grid: [[0, 1, 0], [0, 1, 0], [0, 0, 0]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "BFS over state (row, col, eliminationsLeft); visited keyed by all three." },
    { cls: cls(["0,0", "path"], ["1,0", "path"], ["2,0", "path"], ["2,2", "path"]), note: "Spending a removal opens walls; first to reach end wins.", result: "min steps" } ] },
  java_m30_5_t5_ex_6: { kind: "grid", label: "Cherry Pickup II (#1463)", grid: [[3, 1, 1], [2, 5, 1], [1, 5, 5]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"], ["0,2", "source"]), note: "Two robots descend together; DP state = (row, col1, col2)." },
    { cls: cls(["0,0", "path"], ["1,1", "path"], ["2,2", "path"]), note: "Each row, both move; don't double-count if on the same cell.", result: "max cherries" } ] },

  // ───────────────────────── hashing (completes → 78/78) ─────────────────────────
  java_m34_t1_ex_5: { kind: "array-pointers", label: "HashMap Load Factor & Resizing", array: ["0.75", "→ resize", "×2"], steps: [
    { pointers: { i: 0 }, note: "When size / buckets > load factor (0.75), capacity doubles & entries rehash." },
    { note: "Amortised O(1) put; resizing is occasional O(n).", result: "stays O(1) avg" } ] },
  java_m34_t1_ex_8: { kind: "array-pointers", label: "HashMap vs TreeMap vs LinkedHashMap", array: ["Hash", "Tree", "Linked"], steps: [
    { pointers: { i: 0 }, note: "Hash: O(1), no order. Tree: O(log n), sorted keys. Linked: O(1), insertion order." },
    { note: "Pick by whether you need ordering / range queries.", result: "trade-offs" } ] },
  java_m34_t1_ex_12: { kind: "array-pointers", label: "HashMap Synthesis", array: [2, 7, 11, 15], meta: { target: 9 }, steps: [
    { pointers: { i: 1 }, note: "Two-sum (complement), subarray-sum (prefix counts), consecutive (set)." },
    { mark: { 0: "match", 1: "match" }, note: "One map turns O(n²) scans into O(n).", result: "the toolkit" } ] },
  java_m34_t1_ex_13: { kind: "array-pointers", label: "M34 T1 Hash Fundamentals Synthesis", array: ["key", "→hash", "→bucket"], steps: [
    { pointers: { i: 0 }, note: "hashCode → index; collisions chain in a bucket (treeify if long)." },
    { note: "Good hashCode + equals = O(1) average ops.", result: "fundamentals" } ] },
  java_m34_t2_ex_5: { kind: "array-pointers", label: "Subarrays with Bounded Max", array: [2, 1, 4, 3], meta: { L: 2, R: 3 }, steps: [
    { pointers: { i: 2 }, note: "count(max ≤ R) − count(max ≤ L−1) = subarrays with max in [L,R]." },
    { mark: { 2: "match", 3: "match" }, note: "Each count is a simple O(n) run-length scan.", result: "count" } ] },
  java_m34_t2_ex_8: { kind: "tree", label: "Alien Dictionary (topo via HashMap)", nodes: [{ id: 0, v: "w", x: 70, y: 40 }, { id: 1, v: "e", x: 200, y: 40 }, { id: 2, v: "r", x: 320, y: 40 }, { id: 3, v: "t", x: 200, y: 120 }], edges: [[0, 1], [1, 2], [0, 3]], W: 360, H: 150, steps: [
    { cls: cls(["0", "current"]), note: "Compare adjacent words → first differing char gives an edge u→v." },
    { cls: cls(["0", "match"], ["1", "match"], ["2", "match"]), note: "Topological sort the char graph (Kahn's) → letter order.", result: "alien order" } ] },
  java_m34_t2_ex_9: { kind: "grid", label: "Shortest Path in Binary Matrix (BFS)", grid: [[0, 0, 1], [1, 0, 1], [1, 0, 0]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "BFS from start; 'visited' set/grid prevents re-expansion." },
    { cls: cls(["0,0", "path"], ["0,1", "path"], ["1,1", "path"], ["2,2", "path"]), note: "8-directional; level = shortest length.", result: "min cells" } ] },
  java_m34_t2_ex_10: { kind: "array-pointers", label: "Max Points on a Line (#149)", array: [0, 1, 2, 3], steps: [
    { pointers: { i: 0 }, note: "For each anchor point, hash the SLOPE to every other point." },
    { mark: { 0: "match", 1: "match", 2: "match", 3: "match" }, note: "Largest slope-group +1 (the anchor) = collinear count.", result: "max collinear" } ] },
  java_m34_t2_ex_11: { kind: "array-pointers", label: "HashMap Patterns Synthesis", array: [1, 2, 3, 2, 1], steps: [
    { pointers: { i: 2 }, note: "Frequency, complement-lookup, grouping by key, first-unique." },
    { mark: { 1: "match", 3: "match" }, note: "A map collapses nested loops to one pass.", result: "patterns" } ] },
  java_m34_t2_ex_12: { kind: "array-pointers", label: "M34 T2 HashMap Patterns Synthesis", array: ["count", "group", "lookup"], steps: [
    { pointers: { i: 0 }, note: "getOrDefault / merge / computeIfAbsent express most map idioms." },
    { note: "Choose value type (count, list, index) per problem.", result: "mastery" } ] },
  java_m34_t3_ex_1: { kind: "array-pointers", label: "HashSet Basics — contains O(1)", array: [3, 1, 4, 1, 5], steps: [
    { pointers: { i: 3 }, note: "add returns false on a dup; contains is O(1) average." },
    { mark: { 1: "match", 3: "match" }, note: "Backed by a HashMap with dummy values.", result: "dedup / membership" } ] },
  java_m34_t3_ex_3: { kind: "array-pointers", label: "Intersection / Union of Arrays", array: [1, 2, 2, 3], meta: { B: "[2,3,4]" }, steps: [
    { pointers: { i: 1 }, note: "Set of A; scan B → intersection. Union = set of both." },
    { mark: { 1: "match", 3: "match" }, note: "O(m+n), duplicates collapse.", result: "{2,3}" } ] },
  java_m34_t3_ex_5: { kind: "array-pointers", label: "Contains Duplicate II (#219)", array: [1, 2, 3, 1], meta: { k: 3 }, steps: [
    { pointers: { L: 0, R: 3 }, window: [0, 3], note: "Sliding window of the last k indices in a HashSet." },
    { mark: { 0: "match", 3: "match" }, note: "Duplicate within distance k → true.", result: "true" } ] },
  java_m34_t3_ex_6: { kind: "array-pointers", label: "First Missing Positive (#41)", array: [3, 4, -1, 1], steps: [
    { pointers: { i: 0 }, note: "Index-as-hash: place value v at index v−1 (cyclic swaps)." },
    { array: [1, -1, 3, 4], mark: { 1: "match" }, note: "First index i where arr[i] != i+1 → answer i+1. O(n), O(1).", result: "2" } ] },
  java_m34_t3_ex_7: { kind: "array-pointers", label: "Longest Consecutive Sequence (HashSet)", array: [100, 4, 200, 1, 3, 2], steps: [
    { pointers: { i: 3 }, note: "Only start a count at x where x−1 is absent (a run's start)." },
    { mark: { 3: "match", 5: "match", 4: "match", 1: "match" }, note: "Walk x+1,x+2… O(n) total.", result: "4" } ] },
  java_m34_t3_ex_8: { kind: "linked-list", label: "Detect Cycle with HashSet", list: [1, 2, 3, 4], links: [undefined, undefined, undefined, "↺"], steps: [
    { pointers: { curr: 0 }, note: "Add each visited node to a HashSet." },
    { pointers: { curr: 1 }, mark: { 1: "match" }, note: "Re-seeing a node → cycle. O(n) time AND O(n) space (Floyd is O(1) space).", result: "cycle = true" } ] },
  java_m34_t3_ex_9: { kind: "tree", label: "Path Sum with HashSet (running sum)", nodes: [{ id: 0, v: 10, x: 190, y: 26 }, { id: 1, v: 5, x: 110, y: 86 }, { id: 2, v: 3, x: 110, y: 146 }], edges: [[0, 1], [1, 2]], W: 380, H: 168, steps: [
    { cls: cls(["0", "current"]), note: "DFS carrying a set of prefix sums seen on the current path." },
    { cls: cls(["1", "match"], ["2", "match"]), note: "If (curSum − target) is in the set, a downward path sums to target.", result: "path found" } ] },
  java_m34_t3_ex_10: { kind: "array-pointers", label: "Decode the Message (#2325)", array: ["t", "h", "e", " "], steps: [
    { pointers: { i: 0 }, note: "Build a substitution map from the key's first-seen letters → a,b,c…" },
    { note: "Map each message char; spaces pass through.", result: "decoded text" } ] },
  java_m34_t3_ex_12: { kind: "array-pointers", label: "HashSet Synthesis", array: [1, 2, 2, 3, 3, 3], steps: [
    { pointers: { i: 4 }, note: "Membership, dedup, set algebra, cycle/dup detection." },
    { mark: { 1: "match", 2: "match" }, note: "O(1) average lookups.", result: "the toolkit" } ] },
  java_m34_t3_ex_13: { kind: "array-pointers", label: "M34 T3 HashSet Synthesis", array: ["add", "contains", "remove"], steps: [
    { pointers: { i: 1 }, note: "Use a set when you only need presence, not counts or values." },
    { note: "LinkedHashSet preserves insertion order if needed.", result: "mastery" } ] },
  java_m34_t4_ex_1: { kind: "grid", label: "Grid Coordinate as String Key", grid: [[0, 1, 0], [0, 0, 0]], steps: [
    { cls: cls(["0,1", "frontier"]), note: "Key = \"r,c\" (or r*cols+c) to store cell state in a HashMap/Set." },
    { cls: cls(["0,1", "path"]), note: "Avoids a 2-D visited array for sparse grids.", result: "cell as key" } ] },
  java_m34_t4_ex_3: { kind: "array-pointers", label: "hashCode & equals Contract", array: ["equal", "⇒", "same hash"], steps: [
    { pointers: { i: 0 }, note: "equal objects MUST have equal hashCodes (the reverse needn't hold)." },
    { note: "Break it → lost keys in HashMap/HashSet. Override both together.", result: "the contract" } ] },
  java_m34_t4_ex_4: { kind: "grid", label: "Number of Distinct Islands", grid: [[1, 1, 0], [0, 0, 0], [0, 1, 1]], steps: [
    { cursor: [0, 0], cls: cls(["0,0", "source"]), note: "DFS each island, record its shape as a normalized path signature." },
    { cls: cls(["0,0", "visited"], ["0,1", "visited"], ["2,1", "frontier"]), note: "Put signatures in a HashSet → distinct shapes count.", result: "distinct shapes" } ] },
  java_m34_t4_ex_5: { kind: "array-pointers", label: "Java record as HashMap Key", array: ["Point(1,2)", "→", "key"], steps: [
    { pointers: { i: 0 }, note: "record auto-generates equals/hashCode from its components." },
    { note: "Immutable + correct hashing → safe map key out of the box.", result: "value-based key" } ] },
  java_m34_t4_ex_6: { kind: "array-pointers", label: "Detect Squares (point counts)", array: ["(x,y)", "count++"], steps: [
    { pointers: { i: 0 }, note: "HashMap of point→count; for a query, pick diagonal points sharing x/y." },
    { note: "Multiply counts of the other two corners to total squares.", result: "square count" } ] },
  java_m34_t4_ex_7: { kind: "array-pointers", label: "Design HashMap from Scratch (#706)", array: ["k", "→idx", "bucket"], steps: [
    { pointers: { i: 1 }, note: "Array of buckets; index = key % size; each bucket a linked list." },
    { note: "put/get/remove walk the short chain. O(1) average.", result: "custom HashMap" } ] },
  java_m34_t4_ex_8: { kind: "grid", label: "Custom Key for 2D Prefix Sums", grid: [[1, 2, 3], [4, 5, 6]], steps: [
    { cls: cls(["0,0", "source"]), note: "pre[i][j] = sum of the rectangle (0,0)..(i,j)." },
    { cls: cls(["1,2", "path"]), note: "Submatrix sum via inclusion–exclusion of four corners. O(1) query.", result: "range sum" } ] },
  java_m34_t4_ex_9: { kind: "array-pointers", label: "Mutable Key Danger", array: ["put", "mutate", "lost!"], steps: [
    { pointers: { i: 1 }, note: "Mutating a key after insertion changes its hashCode → wrong bucket." },
    { note: "The entry becomes unreachable. Use immutable keys.", result: "key lost" } ] },
  java_m34_t4_ex_10: { kind: "array-pointers", label: "Snapshot Array (#1146)", array: [0, 5, 0, 10], steps: [
    { pointers: { i: 1 }, note: "Per index store (snapId → value) history; snap() just bumps a counter." },
    { mark: { 1: "match" }, note: "get(i, snap) = binary-search the largest snapId ≤ snap.", result: "versioned reads" } ] },
  java_m34_t4_ex_11: { kind: "array-pointers", label: "Custom Hash Keys Synthesis", array: ["pair", "record", "string"], steps: [
    { pointers: { i: 0 }, note: "Encode composite state into one key: \"r,c\", record, or a long." },
    { note: "Ensure equals/hashCode reflect ALL fields.", result: "composite keys" } ] },
  java_m34_t4_ex_12: { kind: "array-pointers", label: "M34 T4 Custom Keys Synthesis", array: ["immutable", "+", "good hash"], steps: [
    { pointers: { i: 0 }, note: "Good keys: immutable, fast & well-distributed hashCode, matching equals." },
    { note: "records nail all three automatically.", result: "mastery" } ] },
  java_m34_t5_ex_3: { kind: "array-pointers", label: "HashSet with Manual Chaining", array: ["b0", "b1", "b2", "b3"], steps: [
    { pointers: { i: 2 }, note: "Bucket array; index = hash % n; collisions form a linked chain." },
    { note: "contains walks one chain. Resize when load high.", result: "chained set" } ] },
  java_m34_t5_ex_4: { kind: "array-pointers", label: "Insert Delete GetRandom O(1) (#380)", array: [10, 20, 30], steps: [
    { pointers: { i: 2 }, note: "ArrayList + HashMap(val→index); GetRandom = random list index." },
    { mark: { 1: "dropped", 2: "match" }, note: "Delete: swap with last, pop, fix moved index. All O(1).", result: "O(1) all ops" } ] },
  java_m34_t5_ex_6: { kind: "linked-list", label: "LFU Cache (#460)", list: ["f1:A", "f2:B", "f3:C"], steps: [
    { pointers: { minFreq: 0 }, note: "key→node + freq→DLL of nodes at that frequency + minFreq pointer." },
    { list: ["f1:A", "f3:C", "f3:B"], mark: { 0: "dropped" }, note: "Evict from the minFreq bucket's LRU end. O(1).", result: "O(1) LFU" } ] },
  java_m34_t5_ex_7: { kind: "array-pointers", label: "Snapshot Array (#1146) revisited", array: [0, 5, 0, 15], steps: [
    { pointers: { i: 3 }, note: "Sparse history per index: only record on set, keyed by snapId." },
    { mark: { 3: "match" }, note: "snap() is O(1); get does a binary search in that index's history.", result: "space-efficient" } ] },
  java_m34_t5_ex_8: { kind: "array-pointers", label: "Design HashMap with O(1) ops", array: ["k", "→idx", "→val"], steps: [
    { pointers: { i: 1 }, note: "Direct-address (small keys) or bucket+chain (general); index = hash%cap." },
    { note: "Resize past load factor to keep chains short.", result: "O(1) avg" } ] },
  java_m34_t5_ex_9: { kind: "array-pointers", label: "Encode/Decode TinyURL", array: ["long", "→id", "→short"], steps: [
    { pointers: { i: 1 }, note: "Two maps: short↔long. id = counter or hash, base62-encoded." },
    { note: "encode stores both directions; decode is an O(1) lookup.", result: "round-trip URL" } ] },
  java_m34_t5_ex_10: { kind: "array-pointers", label: "Time Based Key-Value Store (#981)", array: ["t1", "t2", "t3", "t5"], steps: [
    { pointers: { i: 2 }, note: "key → list of (timestamp, value), appended in increasing time." },
    { mark: { 2: "match" }, note: "get(key, t) = binary-search the largest timestamp ≤ t.", result: "O(log n) get" } ] },
  java_m34_t5_ex_11: { kind: "array-pointers", label: "Hash Synthesis — all designs", array: ["LRU", "LFU", "Random"], steps: [
    { pointers: { i: 0 }, note: "Compose HashMap with DLL (recency), freq buckets (LFU), or ArrayList (random)." },
    { note: "The map gives O(1) lookup; the partner structure gives ordering.", result: "design patterns" } ] },
  java_m34_t5_ex_12: { kind: "array-pointers", label: "M34 T5 Hash Synthesis", array: ["map", "+", "structure"], steps: [
    { pointers: { i: 0 }, note: "Hard designs = HashMap (find) + auxiliary structure (order/priority)." },
    { note: "Match the partner to the eviction/ordering rule.", result: "mastery" } ] },
  java_m34_t5_ex_13: { kind: "array-pointers", label: "Simple Cache (no eviction)", array: ["miss", "compute", "store"], steps: [
    { pointers: { i: 0 }, note: "computeIfAbsent: on miss, compute & cache; on hit, return stored." },
    { note: "Memoization in one line — unbounded (no eviction).", result: "the pattern" } ] },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, animation] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { animation } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ coverage-24: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
