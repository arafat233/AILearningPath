/**
 * Seed — LLD module M17: Data Structures (designing the classics):
 * Heap/Priority Queue, Disjoint Set (Union-Find), Skip List, Circular Buffer,
 * Bloom Filter, Graph, Balanced BST (AVL/Red-Black), Hash Map.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases11.js   ·   npm: npm run seed:lld-cases11
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m17";
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);

function pm(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const MODULE = {
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 17,
  name: "Data Structures — Designing the Classics", slug: "data-structures",
  description: "Design eight foundational data structures from an interface + invariant perspective: a heap/priority queue, disjoint set (union-find), skip list, circular buffer, bloom filter, graph, balanced BST, and hash map.",
  estimatedHours: 5, prerequisites: ["lld_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 40, difficulty: 4, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 40, difficulty: diff, xpReward: 60, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("lld_m17_t1", 1, "Design a Heap / Priority Queue", "design-heap-priority-queue",
    ["data-structure", "heap", "priority-queue", "array"],
    "Design a priority queue: always remove the highest-priority element next, with fast insert and extract. What structure gives O(log n) for both without keeping everything fully sorted?",
    "A BINARY HEAP — a complete binary tree stored in an ARRAY — maintaining the HEAP INVARIANT (each parent ≤ its children for a min-heap). insert appends then 'sifts up'; extract-min swaps root with last, removes it, then 'sifts down' — both O(log n). peek is O(1). Array layout: children of i are at 2i+1, 2i+2. It backs priority queues, schedulers, Dijkstra.",
    [
      { kind: "concept", heading: "The interface & why not sorting",
        body: "A priority queue needs: insert(x), peek() (highest priority), and extract() (remove highest priority). Keeping the whole collection fully SORTED gives O(1) peek but O(n) insert. A HEAP is the sweet spot: O(log n) insert and extract, O(1) peek — it keeps just enough order (a partial order) to know the extreme element, not a total order." },
      { kind: "concept", heading: "Binary heap + array layout",
        body: "A binary heap is a COMPLETE binary tree (filled left-to-right) satisfying the HEAP INVARIANT: in a min-heap, every parent ≤ both children (so the min is the root). Because it's complete, store it in an ARRAY (no pointers): for index i, children are at 2i+1 and 2i+2, parent at (i−1)/2. Compact and cache-friendly." },
      { kind: "concept", heading: "Sift up / sift down",
        body: "INSERT: append at the end, then SIFT UP — swap with parent while it violates the invariant (smaller than parent) until placed → O(log n). EXTRACT-MIN: the root is the min; move the last element to the root, shrink, then SIFT DOWN — swap with the smaller child while it violates the invariant. Both walk one path of height log n. buildHeap from an array is O(n) (sift-down from the middle up)." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Heaps back PRIORITY QUEUES (task schedulers, the job-scheduler/thread-pool designs), Dijkstra/Prim, top-K (with a size-K heap — the streaming top-K design), and heap sort. Follow-ups: 'min vs max heap (invert comparator)', 'decrease-key' (needs index tracking — used in Dijkstra), 'd-ary heaps', 'mergeable heaps (binomial/Fibonacci)'. Signal: complete binary tree + array layout (2i+1/2i+2) + heap invariant maintained by sift-up (insert) / sift-down (extract), O(log n).",
      },
    ],
    "A heap/priority queue tests the heap invariant in an array-backed complete binary tree: insert sifts up, extract-min sifts down (both O(log n), peek O(1)), with children at 2i+1/2i+2. It backs schedulers, Dijkstra, and top-K; decrease-key needs index tracking.",
    ["Keeping the collection fully sorted (O(n) insert) instead of a heap's partial order.",
     "Using pointers instead of the implicit array layout (children at 2i+1, 2i+2).",
     "Forgetting to sift up on insert / sift down on extract to restore the invariant."],
    0.5, { type: "Binary heap", description: "Complete binary tree in an array (children of i: 2i+1, 2i+2). Min-heap invariant: parent ≤ children → min at root. insert: append + sift up. extract-min: root↔last, remove, sift down. O(log n).", alt: "Binary heap stored in an array, maintained by sift-up and sift-down." }),

  T("lld_m17_t2", 2, "Design a Disjoint Set (Union-Find)", "design-union-find",
    ["data-structure", "union-find", "amortized", "connectivity"],
    "Design a structure to track a partition of elements into disjoint groups, supporting 'are these two in the same group?' and 'merge two groups' — both nearly O(1). What representation and two optimizations get there?",
    "Each element points to a PARENT; a group is a tree whose ROOT is its representative. find(x) follows parents to the root; union(a,b) links one root under the other. Two optimizations make it near-O(1) amortized: PATH COMPRESSION (find flattens the path to the root) and UNION BY RANK/SIZE (attach the smaller tree under the larger). It powers connectivity, Kruskal's MST, cycle detection.",
    [
      { kind: "concept", heading: "The interface",
        body: "Disjoint Set Union (DSU / Union-Find) maintains a partition of n elements into disjoint sets and supports: find(x) → the REPRESENTATIVE (canonical id) of x's set, and union(a, b) → merge the two sets containing a and b. 'Are a and b connected/in the same group?' = find(a) == find(b). It's the go-to structure for dynamic connectivity." },
      { kind: "concept", heading: "Forest of parent pointers",
        body: "Represent each set as a TREE: every element stores a PARENT; the set's representative is the tree's ROOT (which points to itself). find(x) follows parent pointers up to the root. union(a, b) finds both roots and makes one root the parent of the other — merging the trees in O(1) given the roots. Without optimizations, though, trees can become tall chains → find degrades to O(n)." },
      { kind: "concept", heading: "The two optimizations",
        body: "(1) UNION BY RANK/SIZE: always attach the SHORTER/smaller tree under the taller/larger root, keeping trees shallow. (2) PATH COMPRESSION: during find, re-point every node on the path directly to the root, flattening the tree for future queries. Together they give nearly CONSTANT amortized time per operation — O(α(n)), where α is the inverse-Ackermann function (≤ 4 for any practical n). Using both is essential to the structure's reputation." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Union-Find powers: KRUSKAL'S MST (union edges, skip those that would form a cycle), CYCLE DETECTION in undirected graphs, connected components, percolation, and grouping equivalences (e.g. account merging). Follow-ups: 'union by size vs rank', 'why not deletion' (basic DSU doesn't support splitting), 'offline dynamic connectivity'. Signal: parent-pointer forest + find/union via roots + path compression + union by rank/size → near-O(1) amortized; the Kruskal/cycle-detection workhorse.",
      },
    ],
    "Union-Find tests a parent-pointer forest with find (to the root) and union (link roots), made near-O(1) amortized by path compression + union by rank/size (inverse-Ackermann). It's the workhorse for dynamic connectivity, Kruskal's MST, and cycle detection.",
    ["Omitting path compression and/or union-by-rank (trees degrade to O(n) chains).",
     "Comparing elements directly instead of comparing their find() roots for 'same set'.",
     "Expecting it to support splitting a set (basic DSU only merges)."],
    0.5, { type: "Union-Find", description: "Each element → parent; root = set representative. find(x): follow parents to root (compress path). union(a,b): link smaller root under larger (by rank/size). same set ⇔ find(a)==find(b). Near-O(1) amortized.", alt: "Disjoint-set forest with find, union, path compression, and union by rank." }),

  T("lld_m17_t3", 3, "Design a Skip List", "design-skip-list",
    ["data-structure", "skip-list", "probabilistic", "ordered"],
    "Design an ordered structure with O(log n) search/insert/delete — but simpler than a balanced tree and no rotations. How do multiple 'express lane' levels give logarithmic search, and where's the randomness?",
    "A skip list is a sorted linked list with MULTIPLE LEVELS of 'express lanes': each node is promoted to higher levels with probability ~1/2 (RANDOMIZED). Search starts at the top level, moving right until the next node overshoots, then drops down a level — skipping large gaps, giving O(log n) expected time. No rotations; insert/delete just relink + randomly pick the new node's height. Used in Redis sorted sets.",
    [
      { kind: "concept", heading: "Sorted list + express lanes",
        body: "Start with a sorted linked list (search is O(n)). Add LEVELS above it: level 1 links every ~2nd node, level 2 every ~4th, etc. — 'express lanes' that skip ahead. A node exists at level 0 and is PROMOTED to higher levels probabilistically. The top levels let you traverse big jumps; lower levels refine. This layered structure is the whole idea." },
      { kind: "concept", heading: "Search: right then down",
        body: "To search for a key: start at the HIGHEST level of the head. Move RIGHT while the next node's key < target; when the next would overshoot, DROP DOWN one level and continue. Repeat until level 0. Because each level halves the remaining nodes (on average), search visits O(log n) nodes — the express lanes skip the rest. Insert/delete first do this search to find the position." },
      { kind: "concept", heading: "Randomized balancing (no rotations)",
        body: "The elegance: balance is PROBABILISTIC, not enforced. On insert, flip a coin to decide the new node's HEIGHT — promote it to the next level with probability p (~1/2) repeatedly until a tail. This gives the geometric level distribution that makes search O(log n) EXPECTED — no rotations, no rebalancing logic (unlike AVL/Red-Black trees). Simpler to implement correctly; performance is probabilistic (worst case O(n) but astronomically unlikely)." },
      { kind: "concept", heading: "vs balanced trees & follow-ups",
        body: "vs balanced BSTs: skip lists are simpler (no rotations), easy to make concurrent/lock-free, and naturally support range scans (level-0 is a sorted list) — that's why REDIS uses them for sorted sets (the leaderboard structure). Trade-off: expected (not guaranteed) bounds and extra pointers. Follow-ups: 'choice of p', 'memory overhead', 'concurrent skip list'. Signal: multi-level sorted linked list + search (right-then-down, O(log n) expected) + randomized node height for balance (no rotations); Redis sorted-set backbone.",
      },
    ],
    "A skip list tests probabilistic balancing: a multi-level sorted linked list where search goes right-then-down in O(log n) expected time, and balance comes from randomly choosing each node's height (no rotations — simpler than AVL/RB). Redis sorted sets use it; the trade is expected rather than guaranteed bounds.",
    ["Forgetting the randomized node height — without it there's no logarithmic level structure.",
     "Searching only one level instead of the right-then-down descent across levels.",
     "Claiming guaranteed O(log n) — it's expected (worst case O(n), but vanishingly rare)."],
    0.6, { type: "Skip list", description: "Sorted linked list with express-lane levels; node height chosen randomly (promote w/ p≈1/2). Search: from top level go RIGHT until overshoot, DROP down, repeat → O(log n) expected. No rotations.", alt: "Skip list: multi-level sorted linked list searched right-then-down with randomized heights." }),

  T("lld_m17_t4", 4, "Design a Circular Buffer (Ring Buffer)", "design-circular-buffer",
    ["data-structure", "ring-buffer", "fixed-size", "fifo"],
    "Design a fixed-size FIFO buffer that reuses its storage: writes wrap around to the front when they reach the end, with O(1) enqueue/dequeue and no shifting. How do head/tail wrap, and how do you tell full from empty?",
    "A fixed array with HEAD (read) and TAIL (write) indices that WRAP using modulo (index = (index+1) % capacity) — so enqueue/dequeue are O(1) with no element shifting. The classic ambiguity: head==tail means both full AND empty — resolve by keeping a COUNT (or size) field, or leaving one slot empty. On full, either reject or OVERWRITE the oldest.",
    [
      { kind: "concept", heading: "Fixed array + wrapping indices",
        body: "A ring buffer is a FIXED-SIZE array treated as circular. Two indices: HEAD (front, where you dequeue/read) and TAIL (where you enqueue/write). Advancing an index past the end WRAPS to 0 via modulo: next = (i + 1) % capacity. Because you only move indices (never shift elements), enqueue and dequeue are O(1). It reuses the same memory continuously — ideal for streaming/bounded queues." },
      { kind: "concept", heading: "Full vs empty (the classic trap)",
        body: "The notorious ambiguity: with just head and tail, head == tail means BOTH empty (nothing written) AND full (wrapped all the way around) — indistinguishable. Two standard fixes: (1) keep an explicit COUNT/size field (empty = count 0, full = count == capacity) — simplest; or (2) leave ONE SLOT EMPTY (full = (tail+1)%cap == head), sacrificing one slot. Getting this right is the core correctness point of the design." },
      { kind: "concept", heading: "Overflow policy",
        body: "When the buffer is FULL and you enqueue: either REJECT/block the write (bounded queue with back-pressure — like the blocking queue), or OVERWRITE the oldest element (advance head too — used for log buffers, audio/sensor streams where newest data matters and old data is discardable). The policy is a deliberate design choice driven by the use case." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Ring buffers back: bounded producer/consumer queues, streaming/audio/video buffers, log rotation (keep last N), and the LMAX Disruptor (high-perf inter-thread). Follow-ups: 'thread-safe / lock-free single-producer-single-consumer' (head/tail owned by separate threads), 'resizing' (usually fixed by design), 'batch read/write'. Signal: fixed array + wrapping head/tail (mod capacity) + count-or-empty-slot to disambiguate full/empty + overflow policy (reject vs overwrite); O(1), no shifting.",
      },
    ],
    "A circular buffer tests fixed-array FIFO with wrapping head/tail indices (mod capacity, O(1), no shifting), the classic full-vs-empty disambiguation (a count field or a sacrificed slot), and an overflow policy (reject vs overwrite-oldest). It backs bounded queues, streaming buffers, and log rotation.",
    ["The full/empty ambiguity when head==tail — not using a count or a reserved empty slot.",
     "Shifting elements (O(n)) instead of just advancing wrapping indices.",
     "No defined overflow policy (reject/block vs overwrite-oldest)."],
    0.4, { type: "Ring buffer", description: "Fixed array; head (read) + tail (write) advance via (i+1)%capacity (wrap). Disambiguate full vs empty with a count (or leave one slot empty). On full: reject/block OR overwrite oldest. O(1) enqueue/dequeue.", alt: "Circular buffer with wrapping head and tail indices over a fixed array." }),

  T("lld_m17_t5", 5, "Design a Bloom Filter", "design-bloom-filter",
    ["data-structure", "probabilistic", "membership", "hashing"],
    "Design a space-efficient structure that answers 'have I seen this element?' for billions of items, where a tiny false-positive rate is acceptable but a false NEGATIVE is not. How does it work, and what's the catch?",
    "A BIT ARRAY + k independent HASH functions. add(x): set the k bits at hash positions. mightContain(x): if ANY of its k bits is 0 → DEFINITELY NOT present; if all are 1 → PROBABLY present (could be a false positive). NO false negatives. Tiny memory vs storing items. Can't delete (standard) and can't enumerate. Used as a pre-filter to skip expensive lookups.",
    [
      { kind: "concept", heading: "The idea: bits + hashes",
        body: "A Bloom filter is an m-bit ARRAY (all 0 initially) plus k independent HASH functions. To ADD an element, hash it with all k functions and SET those k bits to 1. To TEST membership, hash it with the same k functions and check those bits: if any is 0, the element was definitely never added; if all are 1, it's probably present. It stores no elements — just bits — hence tiny memory." },
      { kind: "concept", heading: "No false negatives, possible false positives",
        body: "The asymmetry is the whole point. A '0' bit could only be 0 if the element was never added, so 'any bit 0 → DEFINITELY ABSENT' (NO false negatives — never says 'no' wrongly). But all-ones can happen by COINCIDENCE (other elements set those bits), so 'all bits 1 → PROBABLY present' (false positives possible). The false-positive RATE rises as the filter fills; tune m (bits) and k (hashes) for n items to hit a target rate." },
      { kind: "concept", heading: "Limitations",
        body: "You CANNOT delete from a standard Bloom filter (clearing a bit might unset bits shared with other elements → false negatives). Use a COUNTING Bloom filter (counters instead of bits) if deletion is needed. You also can't ENUMERATE the contents or get an exact count. It only answers approximate membership. Accept these to gain the space savings." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Bloom filters are PRE-FILTERS that avoid expensive work: 'is this key possibly in the DB/cache/disk?' — if the filter says no, skip the lookup entirely (e.g. LSM-tree/Cassandra SSTable lookups, the TSDB/Dynamo designs); 'has this user seen this article?'; URL/malware blocklists; dedup. Follow-ups: 'sizing for a target false-positive rate', 'counting Bloom (deletes)', 'scalable/cuckoo filters', 'why k hashes'. Signal: bit array + k hashes; any-bit-0 ⇒ absent (no false negatives), all-1 ⇒ maybe present (false positives); no delete/enumerate; space-efficient pre-filter.",
      },
    ],
    "A Bloom filter tests probabilistic membership: a bit array + k hash functions where any-zero-bit means definitely absent (NO false negatives) and all-ones means probably present (false positives possible). Tiny memory, no deletes (standard) or enumeration — it's a pre-filter to skip expensive lookups (LSM/SSTable, blocklists).",
    ["Claiming it can have false negatives — it can't; only false positives.",
     "Trying to delete from a standard Bloom filter (needs a counting variant).",
     "Expecting to enumerate or exactly count the contents (it only answers maybe/no)."],
    0.5, { type: "Bloom filter", description: "m-bit array + k hashes. add(x): set bits at the k hashes. test(x): any bit 0 → DEFINITELY absent; all 1 → PROBABLY present (false positive possible). No false negatives. No delete/enumerate. Pre-filter for expensive lookups.", alt: "Bloom filter: bit array set by k hashes, with no false negatives but possible false positives." }),

  T("lld_m17_t6", 6, "Design a Graph", "design-graph-adt",
    ["data-structure", "graph", "adjacency", "traversal"],
    "Design a general graph data type: add vertices/edges (directed or weighted), find a vertex's neighbors, and traverse it. What's the storage trade-off, and what are the two fundamental traversals?",
    "Two representations: ADJACENCY LIST (each vertex → list of neighbors) — O(V+E) space, great for SPARSE graphs and iterating neighbors; or ADJACENCY MATRIX (V×V) — O(V²) space, O(1) edge lookup, good for DENSE graphs. Expose addVertex/addEdge/neighbors. Traversals: BFS (queue, shortest unweighted path, level order) and DFS (stack/recursion, paths, cycle detection, topological sort).",
    [
      { kind: "concept", heading: "The two representations",
        body: "ADJACENCY LIST: each vertex stores a list of its neighbors (and weights for weighted graphs). Space O(V+E), iterating a vertex's neighbors is efficient — the default for most (sparse) real graphs. ADJACENCY MATRIX: a V×V grid where cell [i][j] marks an edge i→j. Space O(V²), but edge existence/lookup is O(1) — better only for DENSE graphs or when you query specific edges constantly. Choosing by density is the core trade-off." },
      { kind: "concept", heading: "The API & variants",
        body: "Core operations: addVertex, addEdge(u, v [, weight]), removeEdge, neighbors(v), hasEdge(u, v). Handle the VARIANTS explicitly: directed vs undirected (undirected = store the edge both ways), weighted vs unweighted, self-loops, multi-edges. A clean Graph type parameterizes these rather than hardcoding one kind." },
      { kind: "concept", heading: "BFS and DFS",
        body: "The two fundamental traversals. BFS uses a QUEUE, visiting in expanding layers from a source — gives the SHORTEST path in an unweighted graph and level order; mark visited to avoid revisiting. DFS uses a STACK (or recursion), going as deep as possible before backtracking — used for path existence, CYCLE detection, TOPOLOGICAL SORT (DAGs), connected components, and strongly-connected components. Both are O(V+E) on an adjacency list. A visited set prevents infinite loops on cycles." },
      { kind: "concept", heading: "Algorithms & follow-ups",
        body: "On top of the graph: shortest paths (Dijkstra with a heap for weighted, BFS for unweighted, Bellman-Ford for negatives), MST (Kruskal with union-find / Prim with a heap), topological sort, connectivity. Follow-ups: 'representation choice for the problem', 'huge graphs (the social-graph design — sharded/external)', 'edge/vertex attributes'. Signal: adjacency list (sparse) vs matrix (dense) trade-off + add/neighbor API handling directed/weighted variants + BFS (queue, shortest unweighted) and DFS (stack, cycles/topo-sort), both O(V+E) with a visited set.",
      },
    ],
    "A graph ADT tests representation trade-off (adjacency list O(V+E) for sparse / iterating neighbors vs matrix O(V²) for dense / O(1) edge lookup), a clean API handling directed/weighted variants, and the two traversals — BFS (queue, shortest unweighted) and DFS (stack, cycles/topo-sort) — both O(V+E) with a visited set.",
    ["Defaulting to an adjacency matrix for a large sparse graph (O(V²) waste).",
     "Forgetting a visited set, causing infinite loops on cycles during traversal.",
     "Not handling directed vs undirected / weighted variants explicitly."],
    0.5, { type: "Graph", description: "Adjacency list (vertex→neighbors, O(V+E), sparse) vs matrix (V×V, O(1) edge lookup, dense). API: addVertex/addEdge/neighbors. Traverse: BFS (queue→shortest unweighted) / DFS (stack→cycles, topo-sort). Visited set; O(V+E).", alt: "Graph ADT: adjacency-list vs matrix representations with BFS and DFS traversals." }),

  T("lld_m17_t7", 7, "Design a Balanced BST (AVL / Red-Black)", "design-balanced-bst",
    ["data-structure", "bst", "balancing", "rotations"],
    "Design an ordered map/set with guaranteed O(log n) search/insert/delete AND in-order iteration. A plain BST degrades to O(n) on sorted input. What keeps it balanced, and what's the mechanism?",
    "A self-balancing BST keeps height O(log n) so all operations stay O(log n). After each insert/delete, it detects imbalance and restores it via ROTATIONS (local O(1) restructurings). AVL tracks per-node HEIGHT/balance-factor (strictly balanced → faster lookups); RED-BLACK tracks node COLORS with invariants (looser balance → fewer rotations on writes). Backs ordered maps/sets (TreeMap), supporting range queries + in-order traversal.",
    [
      { kind: "concept", heading: "Why balance",
        body: "A binary SEARCH tree keeps keys ordered (left < node < right), giving O(height) search/insert/delete and free IN-ORDER traversal (sorted). But a PLAIN BST degrades: inserting already-sorted keys builds a linked-list-like chain → height n → O(n) operations. A SELF-BALANCING BST guarantees height stays O(log n) regardless of insertion order, preserving O(log n) operations." },
      { kind: "concept", heading: "Rotations restore balance",
        body: "After an insert/delete unbalances the tree, balance is restored by ROTATIONS — local O(1) restructurings (left/right rotation) that re-arrange a few nodes while PRESERVING the BST ordering. A subtree that's too tall on one side is rotated to redistribute height. Rotations are the universal mechanism both AVL and Red-Black trees use; the difference is WHEN/how often they trigger them." },
      { kind: "concept", heading: "AVL vs Red-Black",
        body: "AVL: each node stores its HEIGHT (or balance factor = height difference of subtrees); after a write, if any node's balance factor exceeds ±1, rotate to fix it. AVL is STRICTLY balanced → shorter trees → faster LOOKUPS, but more rotations on writes. RED-BLACK: each node is red/black with invariants (no two red in a row; equal black-height on all paths) that bound height to ~2log n — LOOSER balance → FEWER rotations on insert/delete (faster writes). RB is the common library choice (Java TreeMap, C++ std::map, Linux scheduler) for balanced read/write." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Backs ORDERED maps/sets where you need sorted iteration and RANGE queries (floor/ceiling/between) — things a hash map can't do. Follow-ups: 'why not a hash map?' (no ordering/range), 'AVL vs RB choice (read-heavy → AVL; write-heavy → RB)', 'B-trees for disk (high fan-out, the DB-index case)', 'deletion is the tricky case'. Signal: BST ordering + self-balancing via rotations to keep height O(log n) + AVL (height/strict, fast reads) vs Red-Black (color/looser, fewer write rotations); ordered-map backbone with range queries.",
      },
    ],
    "A balanced BST tests keeping height O(log n) via rotations after writes (preserving BST order), with AVL (height-tracked, strict, fast reads) vs Red-Black (color-invariant, looser, fewer write rotations — the common library choice). It backs ordered maps/sets with range queries and in-order iteration, unlike a hash map.",
    ["A plain BST that degrades to O(n) on sorted input (no balancing).",
     "Not knowing rotations are the balance-restoring mechanism (preserving ordering).",
     "Using a hash map when ordered iteration / range queries are needed."],
    0.6, { type: "Balanced BST", description: "BST order (left<node<right) + self-balancing: after insert/delete, rotations (O(1)) restore height O(log n). AVL: track height/balance-factor (strict → fast reads). Red-Black: node colors + invariants (looser → fewer write rotations). Ordered map/set, range queries.", alt: "Self-balancing BST kept at O(log n) height by rotations; AVL vs Red-Black." }),

  T("lld_m17_t8", 8, "Design a Hash Map", "design-hash-map",
    ["data-structure", "hashing", "collision", "resize"],
    "Design a hash map with average O(1) get/put. Two keys can hash to the same bucket, and the table fills up. How do you handle collisions, and how do you keep operations O(1) as it grows?",
    "An ARRAY of buckets indexed by hash(key) % capacity. COLLISIONS (different keys, same bucket) are resolved by SEPARATE CHAINING (each bucket is a list/tree of entries) or OPEN ADDRESSING (probe to the next free slot). As entries grow, the LOAD FACTOR rises → RESIZE (allocate a bigger array and REHASH all entries) to keep chains short and operations amortized O(1). Needs good hashCode + equals.",
    [
      { kind: "concept", heading: "Array + hash function",
        body: "A hash map stores key→value in an ARRAY of buckets. To put/get, compute hash(key) and map it to a bucket index (typically hash % capacity, or hash & (capacity−1) for power-of-two sizes). A GOOD hash function spreads keys uniformly across buckets (clustering kills performance). Keys need consistent hashCode + EQUALS (equal keys must hash equal). With a good hash and low load, get/put are average O(1)." },
      { kind: "concept", heading: "Collision resolution",
        body: "Different keys can map to the SAME bucket (collision — inevitable, pigeonhole). Two strategies: SEPARATE CHAINING — each bucket holds a LIST (or tree) of entries; put appends/updates, get scans the bucket for the matching key. OPEN ADDRESSING — store entries directly in the array; on collision, PROBE for the next open slot (linear/quadratic probing, double hashing); get probes the same sequence. Chaining is simpler and degrades gracefully; open addressing is more cache-friendly but sensitive to load." },
      { kind: "concept", heading: "Load factor & resizing",
        body: "As entries accumulate, the LOAD FACTOR (entries / buckets) rises; chains lengthen / probes increase, degrading toward O(n). When load exceeds a threshold (e.g. 0.75), RESIZE: allocate a larger array (usually 2×) and REHASH every entry into the new buckets (their index changes with the new capacity). Resizing is O(n) but amortized over many inserts → operations stay amortized O(1). This keep-it-sparse discipline is what preserves performance." },
      { kind: "concept", heading: "Worst case & follow-ups",
        body: "Worst case is O(n) if all keys collide (bad hash or adversarial input — a DoS vector). Mitigations: a strong/randomized hash, and treeify long chains into a balanced BST (Java 8+ turns chains >8 into red-black trees → O(log n) worst-case per bucket). Follow-ups: 'thread-safe / concurrent map (the concurrent-cache design)', 'open vs chaining trade', 'why power-of-two capacity', 'consistent hashing for distributed (the distributed-cache design)'. Signal: bucket array + hash%capacity + collision resolution (chaining vs open addressing) + load-factor-triggered resize/rehash → amortized O(1); good hashCode/equals.",
      },
    ],
    "A hash map tests average-O(1) get/put: a bucket array indexed by hash, collision resolution (separate chaining vs open addressing), and load-factor-triggered resize+rehash to keep operations amortized O(1). Worst case is O(n) on bad/adversarial hashing — mitigated by good hashes and treeifying long chains.",
    ["Ignoring collisions (different keys to one bucket) — no chaining/probing strategy.",
     "Never resizing as load grows, so chains/probes lengthen toward O(n).",
     "Forgetting the hashCode/equals contract or the O(n) adversarial worst case."],
    0.5, { type: "Hash map", description: "Bucket array; index = hash(key) % capacity. Collisions → separate chaining (bucket = list/tree) or open addressing (probe next slot). Load factor > threshold → resize (2×) + rehash all. Amortized O(1); worst O(n).", alt: "Hash map: bucket array with collision resolution and load-factor-triggered resize." }),
];

const EXERCISES = [
  // Heap
  pm({ topicId: "lld_m17_t1", exerciseId: "lld_m17_t1_pm_1", position: 1, level: "medium", title: "The structure",
    scenario: "A priority queue with O(log n) insert/extract and O(1) peek is backed by…",
    options: ["A binary heap (complete tree in an array)", "A fully sorted array", "A plain linked list", "A hash map"], correct: "A binary heap (complete tree in an array)",
    explanation: "A heap keeps just enough order (partial) for O(1) peek and O(log n) insert/extract; full sorting is O(n) insert." }),
  pm({ topicId: "lld_m17_t1", exerciseId: "lld_m17_t1_pm_2", position: 2, level: "medium", title: "Array layout",
    scenario: "In an array-backed heap, the children of index i are at…",
    options: ["2i+1 and 2i+2", "i-1 and i+1", "i/2 and i*2", "Random positions"], correct: "2i+1 and 2i+2",
    explanation: "A complete tree maps to an array: children at 2i+1, 2i+2; parent at (i-1)/2 — no pointers needed." }),
  pm({ topicId: "lld_m17_t1", exerciseId: "lld_m17_t1_pm_3", position: 3, level: "hard", title: "Extract-min",
    scenario: "To extract the min from a min-heap, you…",
    options: ["Swap root with the last element, remove it, then sift down", "Remove the last element", "Scan for the min and shift", "Re-sort the array"], correct: "Swap root with the last element, remove it, then sift down",
    explanation: "The root is the min; move the last element to the root, then sift it down to restore the invariant — O(log n)." }),
  // Union-Find
  pm({ topicId: "lld_m17_t2", exerciseId: "lld_m17_t2_pm_1", position: 1, level: "medium", title: "Same group?",
    scenario: "In Union-Find, 'are a and b in the same set?' is…",
    options: ["find(a) == find(b)", "a == b", "parent[a] == parent[b]", "a and b adjacent in an array"], correct: "find(a) == find(b)",
    explanation: "Compare the representatives (roots) found by following parent pointers, not the elements directly." }),
  pm({ topicId: "lld_m17_t2", exerciseId: "lld_m17_t2_pm_2", position: 2, level: "hard", title: "Near-O(1)",
    scenario: "What makes Union-Find operations nearly O(1) amortized?",
    options: ["Path compression + union by rank/size", "A balanced BST", "Sorting after each union", "A hash map of all pairs"], correct: "Path compression + union by rank/size",
    explanation: "Together they keep trees flat, giving inverse-Ackermann (≤4 practically) amortized time." }),
  pm({ topicId: "lld_m17_t2", exerciseId: "lld_m17_t2_pm_3", position: 3, level: "medium", title: "Classic use",
    scenario: "Union-Find is the workhorse for…",
    options: ["Kruskal's MST and cycle detection / connectivity", "Sorting", "Shortest paths with weights", "String matching"], correct: "Kruskal's MST and cycle detection / connectivity",
    explanation: "Union edges and skip any that would connect an already-connected pair (a cycle) — Kruskal/connectivity." }),
  // Skip list
  pm({ topicId: "lld_m17_t3", exerciseId: "lld_m17_t3_pm_1", position: 1, level: "hard", title: "Balance mechanism",
    scenario: "A skip list stays balanced (O(log n)) via…",
    options: ["Randomly choosing each node's height (no rotations)", "AVL-style rotations", "Re-sorting on insert", "A fixed number of levels"], correct: "Randomly choosing each node's height (no rotations)",
    explanation: "Probabilistic promotion gives the level distribution for O(log n) expected search — no rotation logic." }),
  pm({ topicId: "lld_m17_t3", exerciseId: "lld_m17_t3_pm_2", position: 2, level: "medium", title: "Search",
    scenario: "Skip-list search proceeds…",
    options: ["From the top level: right until overshoot, then drop down a level", "Linearly through level 0", "Bottom-up", "By binary search on an array"], correct: "From the top level: right until overshoot, then drop down a level",
    explanation: "Express lanes let you skip ahead at high levels, then refine downward — O(log n) expected." }),
  pm({ topicId: "lld_m17_t3", exerciseId: "lld_m17_t3_pm_3", position: 3, level: "medium", title: "Real use",
    scenario: "Skip lists famously back…",
    options: ["Redis sorted sets (ordered + range scans, easy concurrency)", "Hash tables", "Stacks", "Bloom filters"], correct: "Redis sorted sets (ordered + range scans, easy concurrency)",
    explanation: "Redis uses skip lists for sorted sets — simpler than balanced trees and great for range queries." }),
  // Circular buffer
  pm({ topicId: "lld_m17_t4", exerciseId: "lld_m17_t4_pm_1", position: 1, level: "medium", title: "Wrap",
    scenario: "Indices in a ring buffer advance via…",
    options: ["(i + 1) % capacity (modulo wrap)", "i + 1 then shifting elements", "Doubling each time", "Random jumps"], correct: "(i + 1) % capacity (modulo wrap)",
    explanation: "Modulo wraps head/tail to the front; only indices move, so enqueue/dequeue are O(1)." }),
  pm({ topicId: "lld_m17_t4", exerciseId: "lld_m17_t4_pm_2", position: 2, level: "hard", title: "Full vs empty",
    scenario: "head == tail is ambiguous (both full and empty). Resolve it by…",
    options: ["Keeping a count/size field (or leaving one slot empty)", "Ignoring it", "Using a larger array", "Sorting the buffer"], correct: "Keeping a count/size field (or leaving one slot empty)",
    explanation: "A count distinguishes empty (0) from full (capacity); alternatively sacrifice one slot." }),
  pm({ topicId: "lld_m17_t4", exerciseId: "lld_m17_t4_pm_3", position: 3, level: "medium", title: "On full",
    scenario: "When the buffer is full and you enqueue, the policy is to…",
    options: ["Reject/block, OR overwrite the oldest (a deliberate choice)", "Always grow the array", "Crash", "Drop the new and old both"], correct: "Reject/block, OR overwrite the oldest (a deliberate choice)",
    explanation: "Bounded queues reject/block (back-pressure); log/stream buffers overwrite the oldest." }),
  // Bloom filter
  pm({ topicId: "lld_m17_t5", exerciseId: "lld_m17_t5_pm_1", position: 1, level: "hard", title: "The guarantee",
    scenario: "A Bloom filter guarantees no…",
    options: ["False negatives (any 0 bit ⇒ definitely absent)", "False positives", "Collisions", "Memory use"], correct: "False negatives (any 0 bit ⇒ definitely absent)",
    explanation: "If a bit is 0 the element was never added; all-ones can be coincidental, so false positives are possible." }),
  pm({ topicId: "lld_m17_t5", exerciseId: "lld_m17_t5_pm_2", position: 2, level: "medium", title: "Delete",
    scenario: "Can you delete from a standard Bloom filter?",
    options: ["No — clearing a bit could cause false negatives (use a counting Bloom)", "Yes, clear its k bits", "Yes, rebuild each time", "Only the last added"], correct: "No — clearing a bit could cause false negatives (use a counting Bloom)",
    explanation: "Bits are shared between elements; a counting Bloom filter (counters) is needed for deletion." }),
  pm({ topicId: "lld_m17_t5", exerciseId: "lld_m17_t5_pm_3", position: 3, level: "medium", title: "Use",
    scenario: "Bloom filters are typically used as…",
    options: ["A pre-filter to skip expensive lookups (e.g. SSTable/disk/cache)", "The primary key-value store", "A sorting structure", "A cache eviction policy"], correct: "A pre-filter to skip expensive lookups (e.g. SSTable/disk/cache)",
    explanation: "'Is it possibly here?' — if the filter says no, skip the costly lookup entirely (LSM/Cassandra/Dynamo)." }),
  // Graph
  pm({ topicId: "lld_m17_t6", exerciseId: "lld_m17_t6_pm_1", position: 1, level: "medium", title: "Representation",
    scenario: "For a large SPARSE graph, the better representation is…",
    options: ["Adjacency list (O(V+E) space, efficient neighbor iteration)", "Adjacency matrix (O(V²))", "A single edge list scanned per query", "A hash of all vertex pairs"], correct: "Adjacency list (O(V+E) space, efficient neighbor iteration)",
    explanation: "Lists use O(V+E); a matrix wastes O(V²) on a sparse graph (matrices suit dense graphs / O(1) edge lookup)." }),
  pm({ topicId: "lld_m17_t6", exerciseId: "lld_m17_t6_pm_2", position: 2, level: "medium", title: "Shortest unweighted",
    scenario: "The shortest path in an UNWEIGHTED graph is found by…",
    options: ["BFS (queue, level order)", "DFS", "Sorting edges", "Random walk"], correct: "BFS (queue, level order)",
    explanation: "BFS explores in layers from the source, so the first time it reaches a node is via a shortest path." }),
  pm({ topicId: "lld_m17_t6", exerciseId: "lld_m17_t6_pm_3", position: 3, level: "hard", title: "DFS uses",
    scenario: "DFS is the basis for…",
    options: ["Cycle detection, topological sort, connected components", "Shortest unweighted paths", "Sorting numbers", "Hashing"], correct: "Cycle detection, topological sort, connected components",
    explanation: "DFS's deep-first backtracking underlies topo-sort, cycle detection, and component finding (with a visited set)." }),
  // Balanced BST
  pm({ topicId: "lld_m17_t7", exerciseId: "lld_m17_t7_pm_1", position: 1, level: "medium", title: "Why balance",
    scenario: "A plain BST given already-sorted inserts degrades to…",
    options: ["O(n) (a linked-list-like chain)", "O(log n) always", "O(1)", "O(n log n)"], correct: "O(n) (a linked-list-like chain)",
    explanation: "Sorted inserts make a degenerate chain of height n; self-balancing keeps height O(log n)." }),
  pm({ topicId: "lld_m17_t7", exerciseId: "lld_m17_t7_pm_2", position: 2, level: "hard", title: "Mechanism",
    scenario: "Both AVL and Red-Black trees restore balance using…",
    options: ["Rotations (local O(1) restructurings preserving BST order)", "Re-sorting the whole tree", "Rehashing", "Rebuilding from scratch"], correct: "Rotations (local O(1) restructurings preserving BST order)",
    explanation: "Rotations rearrange a few nodes to fix height while keeping the in-order (BST) property." }),
  pm({ topicId: "lld_m17_t7", exerciseId: "lld_m17_t7_pm_3", position: 3, level: "hard", title: "AVL vs RB",
    scenario: "Compared to AVL, a Red-Black tree…",
    options: ["Is more loosely balanced → fewer rotations on writes (common library map)", "Is more strictly balanced", "Has no rotations", "Can't do range queries"], correct: "Is more loosely balanced → fewer rotations on writes (common library map)",
    explanation: "RB's looser balance means faster writes (fewer rotations); AVL is stricter → faster reads. RB is the typical std map." }),
  // Hash map
  pm({ topicId: "lld_m17_t8", exerciseId: "lld_m17_t8_pm_1", position: 1, level: "medium", title: "Collisions",
    scenario: "Two keys hashing to the same bucket are handled by…",
    options: ["Separate chaining (bucket = list/tree) or open addressing (probe)", "Rejecting the second key", "Overwriting the first", "Resizing immediately"], correct: "Separate chaining (bucket = list/tree) or open addressing (probe)",
    explanation: "Collisions are inevitable; chaining stores a list per bucket, open addressing probes for a free slot." }),
  pm({ topicId: "lld_m17_t8", exerciseId: "lld_m17_t8_pm_2", position: 2, level: "hard", title: "Stay O(1)",
    scenario: "As entries grow and the load factor rises, you…",
    options: ["Resize (bigger array) and rehash all entries", "Let chains grow indefinitely", "Sort the buckets", "Delete old entries"], correct: "Resize (bigger array) and rehash all entries",
    explanation: "Resizing+rehashing past a load-factor threshold keeps chains short — amortized O(1) operations." }),
  pm({ topicId: "lld_m17_t8", exerciseId: "lld_m17_t8_pm_3", position: 3, level: "hard", title: "Worst case",
    scenario: "A hash map's worst-case get/put is…",
    options: ["O(n) if all keys collide (bad/adversarial hash) — mitigated by treeifying chains", "Always O(1)", "O(log n) always", "O(n²)"], correct: "O(n) if all keys collide (bad/adversarial hash) — mitigated by treeifying chains",
    explanation: "All-collisions degrade to O(n); Java 8+ treeifies long chains to red-black trees for O(log n) worst-case per bucket." }),
];

async function upsertOne(Model, filter, doc) { return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true }); }
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  await upsertOne(ProModule, { moduleId: MODULE.moduleId }, MODULE);
  console.log(`  ✓ ProModule: ${MODULE.moduleId} — ${MODULE.name}`);
  for (const t of TOPICS) await upsertOne(ProTopic, { topicId: t.topicId }, t);
  console.log(`  ✓ ProTopics: ${TOPICS.length}`);
  let inserted = 0, updated = 0;
  for (const ex of EXERCISES) {
    const before = await ProExercise.findOne({ exerciseId: ex.exerciseId }).select("_id").lean();
    await upsertOne(ProExercise, { exerciseId: ex.exerciseId }, ex);
    before ? updated++ : inserted++;
  }
  console.log(`  ✓ ProExercises: ${EXERCISES.length} (${inserted} inserted, ${updated} updated)`);
  const totals = await recomputeLldTotals();
  console.log(`\nDone — M17 Data Structures seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
