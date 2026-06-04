/**
 * Seed — LLD module M19: Advanced Data Structures:
 * B+Tree, LSM-Tree, Consistent Hashing Ring, Quadtree, Segment Tree,
 * Fenwick Tree (BIT), Interval Tree, Rope.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases13.js   ·   npm: npm run seed:lld-cases13
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m19";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 19,
  name: "Advanced Data Structures", slug: "advanced-data-structures",
  description: "Design eight advanced data structures behind real databases and systems: B+Tree, LSM-Tree, consistent-hashing ring, quadtree, segment tree, Fenwick tree (BIT), interval tree, and rope.",
  estimatedHours: 5, prerequisites: ["lld_m1", "lld_m17"], status: "live",
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
  T("lld_m19_t1", 1, "Design a B+Tree (Database Index)", "design-bplus-tree",
    ["data-structure", "btree", "index", "disk"],
    "Design the index structure behind relational databases. Why do DBs use B+Trees instead of binary search trees, and what makes them efficient for DISK and RANGE queries?",
    "A B+Tree is a balanced, HIGH-FAN-OUT tree (each node holds many keys/children) so its height is tiny — minimizing DISK reads (each node = one disk page). All VALUES live in the LEAVES, which are LINKED in sorted order, making RANGE scans (and ordered iteration) fast. Internal nodes hold only keys for routing. It's the workhorse index for B-Tree-based databases.",
    [
      { kind: "concept", heading: "Why not a BST — disk matters",
        body: "A binary search tree has fan-out 2, so height ≈ log₂(n) — and each step is potentially a DISK SEEK (slow). Databases store indexes on disk in PAGES (e.g. 4–16KB). A B+Tree packs MANY keys per node (high fan-out, matching a page), so height is log_b(n) with large b — often just 3–4 levels for billions of rows. Fewer levels = fewer disk reads per lookup. Minimizing disk I/O, not comparisons, is the goal." },
      { kind: "concept", heading: "B+Tree structure",
        body: "INTERNAL nodes hold only keys + child pointers (they ROUTE searches, no values). All actual VALUES (or row pointers) live in the LEAF level. Each node is kept between half-full and full; it stays BALANCED via splits (on insert overflow) and merges/borrows (on delete underflow) — like a generalized balanced tree but with many keys per node. The tree grows/shrinks from the root to keep all leaves at the same depth." },
      { kind: "concept", heading: "Linked leaves → range queries",
        body: "The B+Tree's signature feature: LEAVES are LINKED in sorted order (a linked list). So a RANGE query (WHERE age BETWEEN 20 AND 30) descends once to the start key, then walks the leaf links sequentially — no re-traversal per row. This makes range scans and ordered iteration very efficient, which is why B+Trees (not plain B-Trees, which store values in internal nodes too) dominate database indexes." },
      { kind: "concept", heading: "vs LSM & follow-ups",
        body: "B+Trees are READ-optimized (in-place updates → great for reads + range scans, the default for OLTP indexes), whereas LSM-Trees are WRITE-optimized (the next topic). Follow-ups: 'page splits/merges', 'clustered vs secondary index', 'why fan-out ≈ page size', 'fill factor / fragmentation', 'concurrency (latch coupling)'. Signal: high-fan-out balanced tree (height minimizes disk pages read) + values in linked sorted leaves (fast range scans) + internal nodes route only; the read-optimized DB index.",
      },
    ],
    "A B+Tree tests disk-aware indexing: high fan-out (node = page) minimizes the tree height and thus disk reads (vs a fan-out-2 BST), values live in sorted LINKED leaves for fast range scans, and internal nodes only route. It's the read-optimized database index; LSM-Trees are the write-optimized counterpart.",
    ["Treating it like a binary tree — missing that high fan-out minimizes disk-page reads.",
     "Forgetting the linked sorted leaves that make range queries efficient.",
     "Putting values in internal nodes (that's a B-Tree); B+Trees keep values only in leaves."],
    0.6, { type: "B+Tree", description: "High-fan-out balanced tree; each node ≈ a disk page → tiny height (few disk reads). Internal nodes route by key only; all values in LEAVES, which are LINKED in sorted order → fast range scans. Splits/merges keep it balanced.", alt: "B+Tree: high-fan-out internal routing nodes over sorted linked leaves for range queries." }),

  T("lld_m19_t2", 2, "Design an LSM-Tree", "design-lsm-tree",
    ["data-structure", "lsm", "write-optimized", "compaction"],
    "Design the write-optimized storage engine behind Cassandra/RocksDB/LevelDB. Random disk writes are slow — how does an LSM-Tree make writes fast, and what's the cost on reads?",
    "Buffer writes in an in-memory MEMTABLE (sorted); when full, FLUSH it as an immutable, sorted SSTable file (a SEQUENTIAL write — fast). Reads check the memtable then SSTables newest-to-oldest (slower — may touch many files; BLOOM FILTERS skip files that lack the key). Background COMPACTION merges SSTables to bound read amplification + reclaim space. It trades read amplification for fast sequential writes.",
    [
      { kind: "concept", heading: "Writes: buffer then sequential flush",
        body: "Random in-place writes (B+Tree style) cause scattered disk seeks — slow for write-heavy loads. An LSM-Tree instead BUFFERS writes in an in-memory sorted structure (the MEMTABLE — e.g. a skip list / balanced tree), making each write a fast memory op (preceded by an append to a write-ahead log for durability). When the memtable fills, it's FLUSHED to disk as an immutable, sorted SSTable file in ONE SEQUENTIAL write (fast — no seeks). Writes never modify existing files." },
      { kind: "concept", heading: "Reads + the SSTable problem",
        body: "Because data is spread across the memtable + many immutable SSTables (newest has the latest value; deletes are tombstones), a READ must check the memtable, then SSTables NEWEST→OLDEST until it finds the key — potentially touching many files (READ AMPLIFICATION, the LSM cost). Mitigations: a BLOOM FILTER per SSTable (skip files that definitely don't contain the key — the bloom-filter design) and sparse in-SSTable indexes. Reads are slower than a B+Tree's; the trade is deliberate." },
      { kind: "concept", heading: "Compaction",
        body: "Without cleanup, SSTables pile up (read amplification grows, and obsolete/overwritten/deleted values waste space — SPACE amplification). COMPACTION runs in the background: merge multiple SSTables into fewer, keeping only the latest value per key and dropping tombstoned/expired entries (a merge of sorted runs). Strategies (size-tiered vs leveled) trade write amplification vs read/space amplification. Compaction is what keeps reads bounded and reclaims space." },
      { kind: "concept", heading: "vs B+Tree & follow-ups",
        body: "LSM = WRITE-optimized (sequential writes, great for write-heavy / time-series — the TSDB engine, Cassandra, RocksDB, the metrics DB); B+Tree = READ-optimized. The three amplifications (write/read/space) are the LSM tuning knobs. Follow-ups: 'leveled vs size-tiered compaction', 'why bloom filters', 'write-ahead log for crash recovery', 'tombstones for deletes'. Signal: memtable (buffer) → sequential-flush immutable SSTables → reads merge newest-first (read amplification, bloom filters help) → background compaction; write-optimized, the B+Tree's counterpart.",
      },
    ],
    "An LSM-Tree tests write-optimized storage: buffer in a memtable, flush sequentially to immutable sorted SSTables (fast writes), read newest-SSTable-first (read amplification, mitigated by per-SSTable bloom filters), and compact in the background to bound reads + reclaim space. It's the write-optimized counterpart to the read-optimized B+Tree (Cassandra/RocksDB/TSDBs).",
    ["Thinking it does in-place updates — LSM only appends/flushes immutable SSTables.",
     "Ignoring read amplification (and that bloom filters mitigate it) or compaction's role.",
     "Not contrasting it with the B+Tree (write- vs read-optimized) trade-off."],
    0.6, { type: "LSM-Tree", description: "Write → WAL + in-memory memtable (sorted). Memtable full → flush as immutable sorted SSTable (sequential, fast). Read: memtable → SSTables newest→oldest (bloom filter skips misses). Background compaction merges SSTables, drops tombstones. Write-optimized.", alt: "LSM-Tree: memtable buffering, sequential SSTable flushes, bloom-filtered reads, and compaction." }),

  T("lld_m19_t3", 3, "Design a Consistent Hashing Ring", "design-consistent-hashing",
    ["data-structure", "consistent-hashing", "sharding", "virtual-nodes"],
    "Design the structure that maps keys to servers so that ADDING or REMOVING a server moves as few keys as possible. Why does plain hash(key) % N fail, and what fixes the imbalance?",
    "Map both servers and keys onto a hash RING (circular hash space); a key belongs to the first server CLOCKWISE from its position. Adding/removing a node only remaps the keys between it and its neighbor — ~1/N of keys, not all. Plain hash%N remaps NEARLY EVERYTHING when N changes. VIRTUAL NODES (each server placed at many ring points) fix uneven key distribution and smooth rebalancing.",
    [
      { kind: "concept", heading: "Why hash(key) % N fails",
        body: "The naive way to shard keys across N servers is hash(key) % N. The fatal flaw: when N CHANGES (add/remove a server), the modulus changes, so ALMOST EVERY key remaps to a different server — a massive reshuffle (cache misses everywhere, huge data movement). For elastic systems (caches, distributed stores) that scale up/down, this is unacceptable. You need a scheme where membership changes move only a small fraction of keys." },
      { kind: "concept", heading: "The ring",
        body: "CONSISTENT HASHING places both SERVERS and KEYS onto a circular hash space (a 'ring', e.g. hash values 0..2³²−1 wrapping around). A key is owned by the first server found going CLOCKWISE from the key's position on the ring. Lookups use a sorted structure of server positions + binary search for the successor. The ring is the core idea — keys and nodes share one hash space." },
      { kind: "concept", heading: "Minimal remapping",
        body: "The payoff: when you ADD a server, it inserts at one ring position and takes over only the keys between it and the PREVIOUS server (clockwise) — about 1/N of keys; all other keys stay put. REMOVING a server hands its keys to its clockwise successor — again only its slice moves. So membership changes move ~1/N of keys instead of nearly all. This is exactly what makes distributed caches (the distributed-cache design), Dynamo, and shard maps able to scale elastically." },
      { kind: "concept", heading: "Virtual nodes & follow-ups",
        body: "Problem: with few servers placed once each, the ring is uneven — one server may own a huge arc (load imbalance), and removing a node dumps all its load onto one neighbor. Fix with VIRTUAL NODES: place each physical server at MANY points on the ring (replicas). This evens out key distribution and spreads a departing node's keys across many remaining nodes. More vnodes = smoother balance. Follow-ups: 'replication (next K nodes on the ring)', 'weighted nodes', 'bounded-load consistent hashing'. Signal: hash ring + clockwise-successor ownership (only ~1/N keys move on change) + virtual nodes for balanced distribution; the elastic-sharding workhorse.",
      },
    ],
    "Consistent hashing tests elastic sharding: place servers and keys on a hash ring with clockwise-successor ownership, so adding/removing a node moves only ~1/N keys (vs hash%N reshuffling nearly all), and use virtual nodes to balance the distribution. It underpins distributed caches, Dynamo, and shard maps.",
    ["Using hash(key) % N (remaps nearly all keys when N changes) instead of a ring.",
     "Omitting virtual nodes, leaving uneven load and a neighbor overloaded when a node leaves.",
     "Not knowing only the keys between a node and its predecessor move on a membership change."],
    0.6, { type: "Hash ring", description: "Servers + keys hashed onto a circular space. A key → first server clockwise. Add/remove a node → only the keys between it and its neighbor move (~1/N), not all (unlike hash%N). Virtual nodes (many points per server) balance the load.", alt: "Consistent-hashing ring with clockwise key ownership and virtual nodes." }),

  T("lld_m19_t4", 4, "Design a Quadtree (Spatial Index)", "design-quadtree",
    ["data-structure", "spatial", "quadtree", "recursion"],
    "Design a structure to index 2D points so 'find everything in this region / near this point' is fast. Why not a list, and how does a quadtree adapt to uneven density (crowded cities vs empty oceans)?",
    "A quadtree recursively SUBDIVIDES 2D space into FOUR quadrants; a node splits into 4 children once it holds more than a capacity of points. Range/nearest queries descend only into quadrants that INTERSECT the query region — skipping empty/irrelevant space (vs scanning all points). It ADAPTS to density: crowded areas subdivide deeply, sparse areas stay coarse. Powers maps, collision detection, the proximity service.",
    [
      { kind: "concept", heading: "Why not a flat list",
        body: "Storing points in a list means a spatial query ('points within this rectangle' or 'nearest to (x,y)') must scan ALL points computing distance — O(n) per query, infeasible at scale (the proximity/maps problem). A SPATIAL INDEX organizes points by location so a query only examines the relevant region. The quadtree is one such index (the proximity service mentioned geohash as another)." },
      { kind: "concept", heading: "Recursive 4-way subdivision",
        body: "A quadtree node represents a square region. It holds up to CAPACITY points; when it overflows, it SUBDIVIDES into FOUR equal child quadrants (NW, NE, SW, SE) and distributes its points among them. This recurses: dense regions keep subdividing into smaller cells, sparse regions stay as one big cell. Inserting a point descends to the leaf quadrant containing it (splitting if needed)." },
      { kind: "concept", heading: "Spatial queries by pruning",
        body: "A RANGE query (points in a rectangle) recursively visits only child quadrants that INTERSECT the query rectangle, skipping quadrants entirely outside it — pruning huge swaths of empty space. A NEAREST-neighbor query descends toward the point and checks nearby quadrants. So query cost depends on the relevant region's point density, not the total point count — the whole win." },
      { kind: "concept", heading: "Adaptivity & follow-ups",
        body: "The quadtree's strength over a fixed grid: it ADAPTS to non-uniform density — a city subdivides into fine cells while an ocean stays one coarse cell (the proximity-service trade-off: quadtree vs fixed-precision geohash). Follow-ups: 'octree (3D)', 'k-d tree / R-tree (rectangles, the DB spatial index)', 'moving points (rebuild/update)', 'point quadtree vs region quadtree'. Signal: recursive 4-quadrant subdivision (split on capacity) + query by descending into intersecting quadrants only (prune empty space) + density-adaptive; spatial index for maps/collision/proximity.",
      },
    ],
    "A quadtree tests spatial indexing: recursively subdivide 2D space into 4 quadrants (split on capacity), and answer range/nearest queries by descending only into intersecting quadrants (pruning empty space) instead of scanning all points. It adapts to density (dense regions subdivide deeply) — used in maps, collision detection, and the proximity service.",
    ["Scanning all points per spatial query instead of pruning via the tree.",
     "A fixed uniform grid that wastes cells on empty regions / overloads dense ones (quadtree adapts).",
     "Not subdividing on capacity, or querying all quadrants instead of only intersecting ones."],
    0.5, { type: "Quadtree", description: "Node = a square region holding ≤ capacity points; overflow → split into 4 quadrants (NW/NE/SW/SE), recursively. Dense areas subdivide deeply, sparse stay coarse. Range query descends only into quadrants intersecting the query region (prune empty space).", alt: "Quadtree: recursive 4-way spatial subdivision with density-adaptive cells and pruned queries." }),

  T("lld_m19_t5", 5, "Design a Segment Tree", "design-segment-tree",
    ["data-structure", "range-query", "tree", "lazy-propagation"],
    "Design a structure for an array that answers RANGE queries (sum/min/max over [l,r]) AND supports UPDATES, both in O(log n). A prefix-sum array gives O(1) queries but O(n) updates — what gives both fast?",
    "A binary tree where each node stores an AGGREGATE (sum/min/max) over a RANGE of the array; leaves are single elements, internal nodes combine their children's ranges. A range query combines O(log n) node ranges that tile [l,r]; a point update walks one root-to-leaf path (O(log n)) refreshing aggregates. RANGE updates use LAZY PROPAGATION. Best when both queries AND updates are frequent.",
    [
      { kind: "concept", heading: "The query+update problem",
        body: "Given an array, you want RANGE aggregate queries (sum/min/max over [l,r]) and the ability to UPDATE elements — both fast. A PREFIX-SUM array does O(1) range-sum queries but an update forces recomputing prefixes → O(n). Scanning the range is O(n) per query. A SEGMENT TREE gives BOTH query and update in O(log n) — the right tool when updates AND range queries are both frequent (e.g. live dashboards, range stats)." },
      { kind: "concept", heading: "Tree of range aggregates",
        body: "Build a binary tree over the array: each LEAF is a single element; each INTERNAL node stores the AGGREGATE (e.g. sum) of its two children's ranges — so the root covers the whole array, and a node covers [lo,hi] split at the midpoint into two children. Building is O(n). The tree has O(n) nodes and height O(log n). The aggregate function must be ASSOCIATIVE (sum, min, max, gcd) so partial results combine." },
      { kind: "concept", heading: "Query and point-update in O(log n)",
        body: "A RANGE query [l,r] recursively combines the O(log n) nodes whose ranges exactly TILE [l,r] (fully-covered nodes return their stored aggregate; partial nodes recurse) — visiting O(log n) nodes. A POINT UPDATE changes a leaf and walks back up the single root-to-leaf path, recomputing each ancestor's aggregate — O(log n). So both operations are logarithmic, the structure's defining advantage." },
      { kind: "concept", heading: "Lazy propagation & follow-ups",
        body: "For RANGE updates (add x to all of [l,r]), updating each leaf would be O(n). LAZY PROPAGATION defers the work: mark a covering node with a pending update and PUSH it DOWN to children only when later traversals reach them — keeping range updates O(log n) too. Follow-ups: 'segment tree vs Fenwick tree (BIT)' (Fenwick is simpler/smaller for prefix sums; segment tree is more general — min/max/range-update), 'persistent segment trees', '2D segment trees'. Signal: tree of associative range aggregates + O(log n) range query (tile with O(log n) nodes) + O(log n) point update (one path) + lazy propagation for range updates.",
      },
    ],
    "A segment tree tests fast range-query + update: a tree of associative range aggregates giving O(log n) range queries (tiling [l,r] with O(log n) nodes) and O(log n) point updates (one root-to-leaf path), with lazy propagation for O(log n) range updates. It beats prefix sums when both queries AND updates are frequent; Fenwick is the lighter prefix-sum-only alternative.",
    ["Using prefix sums (O(n) updates) when updates are frequent — a segment tree gives O(log n) both.",
     "Forgetting lazy propagation, making range updates O(n) instead of O(log n).",
     "Assuming any aggregate works — it must be associative to combine partial node results."],
    0.6, { type: "Segment tree", description: "Binary tree over the array: leaf = element, internal node = aggregate (sum/min/max) of its range. Range query combines O(log n) nodes tiling [l,r]; point update walks one root→leaf path (O(log n)). Range update via lazy propagation (defer, push down).", alt: "Segment tree: nodes hold range aggregates for O(log n) range queries and updates." }),

  T("lld_m19_t6", 6, "Design a Fenwick Tree (Binary Indexed Tree)", "design-fenwick-tree",
    ["data-structure", "prefix-sum", "bit", "binary"],
    "Design a compact structure for PREFIX SUMS with point updates, both in O(log n) — simpler and smaller than a segment tree. What clever trick using the BINARY representation of indices makes this work?",
    "A Fenwick tree (BIT) is just an ARRAY where index i stores the sum of a range of elements determined by i's LOWEST SET BIT. update(i): add to i, then jump to i += (i & -i) (move to the next responsible index). prefixSum(i): accumulate while jumping i -= (i & -i). Both O(log n), O(n) space, tiny constant factor. It's the lightweight choice for prefix-sum + point-update (range sums = difference of two prefix sums).",
    [
      { kind: "concept", heading: "The goal & the trade vs segment tree",
        body: "A Fenwick tree (Binary Indexed Tree) supports PREFIX SUM queries (sum of [1..i]) and POINT UPDATES, both in O(log n), using just an O(n) ARRAY — far simpler and smaller (lower constant factor, less code) than a segment tree. The trade: it's specialized for invertible aggregates like SUM (range sum [l,r] = prefix(r) − prefix(l−1)); a segment tree is more general (min/max, range updates) but heavier. For prefix/range SUMS with updates, the Fenwick tree is the lightweight winner." },
      { kind: "concept", heading: "The low-bit trick",
        body: "The cleverness: index i (1-based) is 'responsible' for a range of elements whose LENGTH equals i's LOWEST SET BIT, i & -i (the lowest power of two dividing i). So tree[i] stores the sum of that range. This binary-indexing means each element is covered by O(log n) responsible indices, and prefix sums decompose along the binary representation of i — no explicit tree nodes/pointers, just an array + bit arithmetic." },
      { kind: "concept", heading: "Update and query via bit jumps",
        body: "UPDATE(i, delta): add delta to tree[i], then move to the next index responsible for i by i += (i & -i), repeating until past n — touching O(log n) entries (the indices whose ranges include i). PREFIX_SUM(i): accumulate tree[i], then jump DOWN by i -= (i & -i) (strip the lowest set bit), repeating until i==0 — summing O(log n) ranges that exactly partition [1..i]. Both walk along the bits of i, hence O(log n). Range sum [l,r] = prefixSum(r) − prefixSum(l−1)." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Used wherever you need running/range sums with updates: counting inversions, order statistics, range-sum dashboards, frequency tables. Follow-ups: 'Fenwick vs segment tree' (Fenwick = simpler/smaller, sum-like only; segment tree = general, range-update via lazy), '2D Fenwick', 'range-update point-query (store deltas)', 'why 1-based indexing'. Signal: array + low-bit (i & -i) responsibility ranges + O(log n) update (i += lowbit) and prefix sum (i −= lowbit) + range sum via prefix difference; the compact prefix-sum-with-updates structure.",
      },
    ],
    "A Fenwick tree (BIT) tests the low-bit trick: an array where index i covers a range of length (i & -i), giving O(log n) point updates (i += lowbit) and prefix sums (i −= lowbit) along i's binary representation — far simpler/smaller than a segment tree. It's the lightweight choice for prefix/range SUMS with updates; segment trees generalize to min/max/range-updates.",
    ["Not knowing the lowest-set-bit (i & -i) responsibility trick that makes it O(log n) without tree nodes.",
     "Using it for min/max/range-updates — it's specialized for invertible aggregates (sum); use a segment tree.",
     "Forgetting range sum is prefix(r) − prefix(l−1), or off-by-one with 1-based indexing."],
    0.6),

  T("lld_m19_t7", 7, "Design an Interval Tree", "design-interval-tree",
    ["data-structure", "intervals", "overlap", "augmented-bst"],
    "Design a structure to store intervals (e.g. [start,end] bookings) and quickly answer 'which stored intervals OVERLAP this query interval?' — faster than checking every interval. What augmentation makes overlap search efficient?",
    "A balanced BST ordered by interval START, AUGMENTED so each node stores the MAX END value in its subtree. To find overlaps, search the tree: at each node, use the subtree's max-end to PRUNE branches that can't possibly overlap the query — so search visits O(log n + k) nodes (k = matches) instead of all n. Powers calendar conflict checks, scheduling, genomics, and range-overlap queries.",
    [
      { kind: "concept", heading: "The problem",
        body: "You store many INTERVALS ([start, end]) — bookings, time ranges, genomic regions — and need to find all stored intervals that OVERLAP a query interval (or point). Checking every interval is O(n) per query (the calendar/hotel conflict check done naively). An INTERVAL TREE answers overlap queries in O(log n + k) where k is the number of matches — much faster when overlaps are sparse." },
      { kind: "concept", heading: "Augmented BST (the key trick)",
        body: "Build a balanced BST keyed by each interval's START point. Then AUGMENT each node with one extra field: the MAXIMUM END value found anywhere in that node's subtree. This max-end augmentation (maintained on insert/delete/rotation, like any balanced-tree augmentation) is what enables efficient pruning — it lets you know whether a whole subtree could contain an overlapping interval without visiting it." },
      { kind: "concept", heading: "Overlap search via pruning",
        body: "Two intervals [a,b] and [c,d] overlap iff a ≤ d AND c ≤ b. To find overlaps with query [lo,hi], recurse from the root: check the current node for overlap; then — using the subtree max-end — PRUNE: if the LEFT subtree's max-end < lo, no interval there can overlap (skip it); otherwise recurse left; recurse right when the node's start ≤ hi. This pruning skips entire branches, giving O(log n + k) instead of scanning everything." },
      { kind: "concept", heading: "Alternatives & follow-ups",
        body: "Related structures: a SEGMENT TREE can also do interval/stabbing queries (different construction); for STATIC interval sets, sorting + sweep-line or merging is simpler; geometric R-trees handle multi-dimensional ranges. Follow-ups: 'find ALL overlaps vs ANY overlap', 'point stabbing query', 'dynamic vs static intervals', 'why augmentation must be maintained on rotation'. Signal: balanced BST keyed by start + subtree-max-end augmentation + overlap search that prunes subtrees by max-end → O(log n + k); the structure for fast interval-overlap (calendar/scheduling conflicts).",
      },
    ],
    "An interval tree tests an augmented balanced BST (keyed by start, each node storing its subtree's max-end) that answers overlap queries in O(log n + k) by pruning subtrees whose max-end can't reach the query — vs O(n) scanning. It powers calendar/scheduling conflict checks; the max-end augmentation is the key insight.",
    ["Scanning all intervals per overlap query instead of pruning via subtree max-end.",
     "Forgetting the max-end augmentation (or not maintaining it on insert/delete/rotation).",
     "Getting the overlap condition wrong (a ≤ d AND c ≤ b)."],
    0.6, { type: "Interval tree", description: "Balanced BST keyed by interval START; each node augmented with the MAX END in its subtree. Overlap search: check node, then prune a subtree if its max-end < query.lo, else recurse → O(log n + k). Overlap iff a ≤ d AND c ≤ b.", alt: "Interval tree: a start-keyed BST augmented with subtree max-end for pruned overlap queries." }),

  T("lld_m19_t8", 8, "Design a Rope (Text Buffer)", "design-rope",
    ["data-structure", "text", "tree", "editor"],
    "Design the string structure behind a text editor handling huge documents. A plain string/array makes inserting or deleting in the middle O(n) (shift everything). What tree-based structure makes edits O(log n)?",
    "A ROPE is a balanced BINARY TREE whose LEAVES hold short string chunks and whose INTERNAL nodes store the total LENGTH (weight) of their LEFT subtree — so indexing/splitting navigates by length in O(log n). Insert/delete/concat become SPLIT + JOIN of subtrees (O(log n)) instead of shifting characters. It avoids the O(n) cost of array-backed strings for large documents; alternative is a gap buffer / piece table.",
    [
      { kind: "concept", heading: "Why not a plain string",
        body: "An editor backed by a contiguous string/char array makes a middle INSERT or DELETE O(n) — you must shift all following characters. For a small string that's fine, but for a large document with frequent edits it's too slow. The ROPE represents the text as a TREE of small pieces so edits don't shift the whole buffer — they restructure a few tree nodes." },
      { kind: "concept", heading: "Tree of chunks + weights",
        body: "A rope is a balanced binary tree: LEAVES hold short substrings (chunks) of the document; the document is the in-order concatenation of the leaves. Each INTERNAL node stores a WEIGHT = the total length of its LEFT subtree. To find the character at index i (or the leaf containing it), navigate from the root: if i < left weight go left, else subtract the weight and go right — O(log n) by length, never scanning characters." },
      { kind: "concept", heading: "Edits as split + concat",
        body: "The two primitives are SPLIT (divide the rope at index i into two ropes) and CONCAT/JOIN (combine two ropes under a new root). INSERT at i = split at i, concat [left, newText, right]. DELETE [i,j] = split out the middle and concat the ends. CONCAT is O(1)-ish (new root) but rebalancing/splits are O(log n). So edits are O(log n) regardless of document size — the whole point. Keeping the tree balanced keeps operations logarithmic." },
      { kind: "concept", heading: "Alternatives & follow-ups",
        body: "Other editor buffers: GAP BUFFER (a char array with a movable gap at the cursor — O(1) edits near the cursor, simple, used by Emacs) and PIECE TABLE (the original text + an append buffer + a list of pieces — efficient edits + easy undo, used by VS Code). Ropes excel for very large documents and concatenation-heavy workloads. Follow-ups: 'rope vs gap buffer vs piece table trade-offs', 'storing line counts for line navigation (augment nodes)', 'undo/redo (immutable/persistent ropes share structure)'. Signal: balanced tree of string chunks + left-subtree-length weights (navigate by index in O(log n)) + insert/delete via split+concat (O(log n), no char shifting); the big-document editor buffer.",
      },
    ],
    "A rope tests text-buffer design: a balanced tree of string chunks with left-subtree-length weights for O(log n) index navigation, where insert/delete/concat are split+join of subtrees (O(log n), no character shifting) — avoiding the O(n) cost of array-backed strings for huge documents. Gap buffers and piece tables are the alternatives.",
    ["Backing the editor with a flat char array (O(n) middle insert/delete by shifting).",
     "Not storing left-subtree length weights — losing O(log n) index navigation.",
     "Letting the tree become unbalanced (operations degrade) — or not knowing gap-buffer/piece-table alternatives."],
    0.6, { type: "Rope", description: "Balanced binary tree: leaves = short string chunks (document = in-order concat); internal node weight = length of its LEFT subtree. Index by navigating weights (O(log n)). Insert/delete/concat = split + join subtrees (O(log n), no char shifting).", alt: "Rope: a balanced tree of string chunks with subtree-length weights for O(log n) edits." }),
];

const EXERCISES = [
  // B+Tree
  pm({ topicId: "lld_m19_t1", exerciseId: "lld_m19_t1_pm_1", position: 1, level: "hard", title: "Why not a BST",
    scenario: "Databases use B+Trees over binary search trees because…",
    options: ["High fan-out minimizes tree height → fewer disk-page reads", "BSTs can't store keys", "B+Trees use less memory always", "BSTs aren't sorted"], correct: "High fan-out minimizes tree height → fewer disk-page reads",
    explanation: "Each node ≈ a disk page; high fan-out keeps height tiny (3–4 levels for billions of rows), minimizing disk I/O." }),
  pm({ topicId: "lld_m19_t1", exerciseId: "lld_m19_t1_pm_2", position: 2, level: "medium", title: "Range queries",
    scenario: "What makes range queries fast in a B+Tree?",
    options: ["Values live in sorted, LINKED leaves (walk the links)", "Values in every node", "A hash index", "Binary search on the root only"], correct: "Values live in sorted, LINKED leaves (walk the links)",
    explanation: "Descend once to the start key, then walk the linked leaves in order — no re-traversal per row." }),
  pm({ topicId: "lld_m19_t1", exerciseId: "lld_m19_t1_pm_3", position: 3, level: "medium", title: "vs LSM",
    scenario: "Compared to an LSM-Tree, a B+Tree is…",
    options: ["Read-optimized (in-place, great for reads + range scans)", "Write-optimized", "Only for in-memory data", "Unbalanced"], correct: "Read-optimized (in-place, great for reads + range scans)",
    explanation: "B+Trees favor reads/range scans (OLTP indexes); LSM-Trees favor writes." }),
  // LSM-Tree
  pm({ topicId: "lld_m19_t2", exerciseId: "lld_m19_t2_pm_1", position: 1, level: "hard", title: "Fast writes",
    scenario: "An LSM-Tree makes writes fast by…",
    options: ["Buffering in a memtable, then flushing sequentially as immutable SSTables", "Updating records in place on disk", "Sorting the whole file per write", "Writing to a B+Tree"], correct: "Buffering in a memtable, then flushing sequentially as immutable SSTables",
    explanation: "In-memory buffering + sequential flushes avoid slow random disk seeks." }),
  pm({ topicId: "lld_m19_t2", exerciseId: "lld_m19_t2_pm_2", position: 2, level: "hard", title: "Read cost",
    scenario: "Reads in an LSM-Tree can be slow (read amplification) because a key may be in many SSTables. This is mitigated by…",
    options: ["A bloom filter per SSTable (skip files lacking the key)", "Reading all files always", "A single SSTable", "Disabling compaction"], correct: "A bloom filter per SSTable (skip files lacking the key)",
    explanation: "Bloom filters let reads skip SSTables that definitely don't contain the key, cutting read amplification." }),
  pm({ topicId: "lld_m19_t2", exerciseId: "lld_m19_t2_pm_3", position: 3, level: "medium", title: "Compaction",
    scenario: "Background compaction…",
    options: ["Merges SSTables, keeping latest values + dropping tombstones (bounds reads + reclaims space)", "Deletes the memtable", "Sorts reads", "Encrypts files"], correct: "Merges SSTables, keeping latest values + dropping tombstones (bounds reads + reclaims space)",
    explanation: "Compaction merges sorted SSTables to limit read amplification and reclaim space from obsolete entries." }),
  // Consistent hashing
  pm({ topicId: "lld_m19_t3", exerciseId: "lld_m19_t3_pm_1", position: 1, level: "hard", title: "Why not modulo",
    scenario: "hash(key) % N is bad for elastic systems because…",
    options: ["Changing N remaps nearly every key (massive reshuffle)", "It's not random", "It can't hash strings", "It's too slow"], correct: "Changing N remaps nearly every key (massive reshuffle)",
    explanation: "The modulus changes with N, so almost all keys move — unacceptable when scaling up/down." }),
  pm({ topicId: "lld_m19_t3", exerciseId: "lld_m19_t3_pm_2", position: 2, level: "medium", title: "On a ring",
    scenario: "Adding a server to a consistent-hash ring moves…",
    options: ["Only the keys between it and its predecessor (~1/N)", "All keys", "Half the keys", "No keys"], correct: "Only the keys between it and its predecessor (~1/N)",
    explanation: "A new node takes over only its arc of the ring; other keys stay put — minimal remapping." }),
  pm({ topicId: "lld_m19_t3", exerciseId: "lld_m19_t3_pm_3", position: 3, level: "hard", title: "Balance",
    scenario: "Virtual nodes are used to…",
    options: ["Even out key distribution and spread a departing node's load", "Encrypt keys", "Reduce memory", "Speed up hashing"], correct: "Even out key distribution and spread a departing node's load",
    explanation: "Placing each server at many ring points balances load and spreads a leaving node's keys across many nodes." }),
  // Quadtree
  pm({ topicId: "lld_m19_t4", exerciseId: "lld_m19_t4_pm_1", position: 1, level: "medium", title: "The idea",
    scenario: "A quadtree indexes 2D points by…",
    options: ["Recursively subdividing space into 4 quadrants (split on capacity)", "Sorting points by x only", "Hashing coordinates", "A single grid cell"], correct: "Recursively subdividing space into 4 quadrants (split on capacity)",
    explanation: "Overfull nodes split into NW/NE/SW/SE; dense areas subdivide deeply, sparse stay coarse." }),
  pm({ topicId: "lld_m19_t4", exerciseId: "lld_m19_t4_pm_2", position: 2, level: "medium", title: "Range query",
    scenario: "A range query is fast because it…",
    options: ["Descends only into quadrants intersecting the query region (prunes empty space)", "Checks every point", "Visits all quadrants", "Sorts the points first"], correct: "Descends only into quadrants intersecting the query region (prunes empty space)",
    explanation: "Pruning non-intersecting quadrants makes cost depend on the relevant region, not total point count." }),
  pm({ topicId: "lld_m19_t4", exerciseId: "lld_m19_t4_pm_3", position: 3, level: "medium", title: "vs fixed grid",
    scenario: "A quadtree beats a fixed uniform grid when…",
    options: ["Density is uneven (it adapts; the grid wastes/overloads cells)", "All points are evenly spread", "There are very few points", "Points never move"], correct: "Density is uneven (it adapts; the grid wastes/overloads cells)",
    explanation: "The quadtree subdivides only dense regions, adapting to skew (the proximity-service trade-off)." }),
  // Segment tree
  pm({ topicId: "lld_m19_t5", exerciseId: "lld_m19_t5_pm_1", position: 1, level: "hard", title: "Why not prefix sums",
    scenario: "When both range queries AND updates are frequent, prefix sums fail because…",
    options: ["An update is O(n) (recompute prefixes); a segment tree gives O(log n) both", "Queries are O(n)", "They can't store sums", "They use too much memory"], correct: "An update is O(n) (recompute prefixes); a segment tree gives O(log n) both",
    explanation: "Prefix sums: O(1) query but O(n) update. Segment tree: O(log n) query AND update." }),
  pm({ topicId: "lld_m19_t5", exerciseId: "lld_m19_t5_pm_2", position: 2, level: "medium", title: "Range update",
    scenario: "To make RANGE updates (add x to [l,r]) O(log n), use…",
    options: ["Lazy propagation (defer, push down to children when traversed)", "Update each leaf (O(n))", "Rebuild the tree", "A prefix array"], correct: "Lazy propagation (defer, push down to children when traversed)",
    explanation: "Lazy propagation marks covering nodes and pushes pending updates down only when needed — O(log n)." }),
  pm({ topicId: "lld_m19_t5", exerciseId: "lld_m19_t5_pm_3", position: 3, level: "medium", title: "Requirement",
    scenario: "The aggregate stored at each node must be…",
    options: ["Associative (so partial results combine: sum/min/max/gcd)", "Always a sum", "Random", "Sorted"], correct: "Associative (so partial results combine: sum/min/max/gcd)",
    explanation: "Combining child ranges requires an associative operation; sum, min, max, gcd all qualify." }),
  // Fenwick
  pm({ topicId: "lld_m19_t6", exerciseId: "lld_m19_t6_pm_1", position: 1, level: "hard", title: "The trick",
    scenario: "A Fenwick tree's O(log n) operations rely on…",
    options: ["The lowest-set-bit (i & -i) defining each index's responsibility range", "A separate tree of pointers", "Sorting indices", "Hashing"], correct: "The lowest-set-bit (i & -i) defining each index's responsibility range",
    explanation: "Index i covers a range of length (i & -i); update/query jump along i's bits in O(log n) — just an array." }),
  pm({ topicId: "lld_m19_t6", exerciseId: "lld_m19_t6_pm_2", position: 2, level: "medium", title: "vs segment tree",
    scenario: "Compared to a segment tree, a Fenwick tree is…",
    options: ["Simpler/smaller but specialized for sum-like (invertible) aggregates", "More general (min/max/range-update)", "Slower", "Unable to update"], correct: "Simpler/smaller but specialized for sum-like (invertible) aggregates",
    explanation: "Fenwick is compact and great for prefix/range sums; segment trees handle min/max and range updates." }),
  pm({ topicId: "lld_m19_t6", exerciseId: "lld_m19_t6_pm_3", position: 3, level: "medium", title: "Range sum",
    scenario: "A range sum [l,r] from a Fenwick tree is computed as…",
    options: ["prefixSum(r) − prefixSum(l−1)", "prefixSum(r) + prefixSum(l)", "A separate tree", "Scanning [l,r]"], correct: "prefixSum(r) − prefixSum(l−1)",
    explanation: "Subtract the prefix before l from the prefix through r — exploiting sum's invertibility." }),
  // Interval tree
  pm({ topicId: "lld_m19_t7", exerciseId: "lld_m19_t7_pm_1", position: 1, level: "hard", title: "The augmentation",
    scenario: "An interval tree augments a start-keyed BST with…",
    options: ["The MAX END value in each node's subtree (for pruning)", "The count of nodes", "The interval lengths", "A hash of the interval"], correct: "The MAX END value in each node's subtree (for pruning)",
    explanation: "Subtree max-end lets you prune branches that can't overlap the query — enabling O(log n + k) search." }),
  pm({ topicId: "lld_m19_t7", exerciseId: "lld_m19_t7_pm_2", position: 2, level: "medium", title: "Pruning",
    scenario: "During overlap search you skip the left subtree when…",
    options: ["Its max-end < query.lo (nothing there can reach the query)", "It's non-empty", "Its start > query.hi", "Always"], correct: "Its max-end < query.lo (nothing there can reach the query)",
    explanation: "If the largest end in the left subtree is before the query starts, no interval there overlaps — skip it." }),
  pm({ topicId: "lld_m19_t7", exerciseId: "lld_m19_t7_pm_3", position: 3, level: "medium", title: "Overlap condition",
    scenario: "Intervals [a,b] and [c,d] overlap iff…",
    options: ["a ≤ d AND c ≤ b", "a == c", "b < c", "a > d"], correct: "a ≤ d AND c ≤ b",
    explanation: "They overlap when each starts at or before the other ends — the standard overlap test (used in calendars too)." }),
  // Rope
  pm({ topicId: "lld_m19_t8", exerciseId: "lld_m19_t8_pm_1", position: 1, level: "hard", title: "Why a rope",
    scenario: "A rope is used over a flat string because…",
    options: ["Middle insert/delete is O(log n) (no shifting) vs O(n) for an array", "It uses less memory", "Strings can't be large", "It sorts the text"], correct: "Middle insert/delete is O(log n) (no shifting) vs O(n) for an array",
    explanation: "A tree of chunks restructures a few nodes per edit instead of shifting all following characters." }),
  pm({ topicId: "lld_m19_t8", exerciseId: "lld_m19_t8_pm_2", position: 2, level: "medium", title: "Navigation",
    scenario: "To index into a rope by character position, each internal node stores…",
    options: ["The total length (weight) of its LEFT subtree", "The full substring", "A hash", "The depth"], correct: "The total length (weight) of its LEFT subtree",
    explanation: "Compare the index to the left weight to go left/right — O(log n) index navigation, no char scan." }),
  pm({ topicId: "lld_m19_t8", exerciseId: "lld_m19_t8_pm_3", position: 3, level: "medium", title: "Edits",
    scenario: "Insert/delete in a rope are implemented via…",
    options: ["Split + concat (join) of subtrees", "Shifting characters", "Re-sorting leaves", "Rebuilding the whole tree"], correct: "Split + concat (join) of subtrees",
    explanation: "Split the rope at the edit point and concat the pieces (with the new/remaining text) — O(log n)." }),
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
  console.log(`\nDone — M19 Advanced Data Structures seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
