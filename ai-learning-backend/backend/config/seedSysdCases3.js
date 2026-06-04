/**
 * Seed — System Design module M8: Case Studies III (more infra designs):
 * Distributed Cache, Distributed Message Queue, Leaderboard, Ad-Click
 * Aggregator, Distributed Job Scheduler, Distributed Unique-ID Generator,
 * Object Store (S3), Proximity/Nearby service. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases3.js   ·   npm: npm run seed:sysd-cases3
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m8";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 8,
  name: "Case Studies III — Infrastructure", slug: "case-studies-3",
  description: "Eight more infrastructure-grade designs: distributed cache, distributed message queue, leaderboard, ad-click aggregator, distributed job scheduler, unique-ID generator, object store, and a proximity service.",
  estimatedHours: 5, prerequisites: ["sysd_m1", "sysd_m2"], status: "live",
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
  T("sysd_m8_t1", 1, "Design a Distributed Cache", "design-distributed-cache",
    ["case-study", "cache", "consistent-hashing", "redis"],
    "Build a cache too big for one machine, serving millions of reads/sec with O(1) get/put. How do you spread keys, evict, and survive a node loss?",
    "Shard keys across nodes with CONSISTENT HASHING (elastic scaling), evict with LRU per node, replicate for availability, and handle the cache-aside write path + invalidation. It's the LRU-cache LLD problem made distributed.",
    [
      { kind: "concept", heading: "Partition with consistent hashing",
        body: "One node can't hold the data or the traffic, so shard: each key maps to a node via consistent hashing on a ring (with virtual nodes for balance). Adding/removing a node moves only ~1/N of keys — essential for elastic scaling without a mass re-shuffle. Clients (or a proxy) hash the key to find its node." },
      { kind: "concept", heading: "Per-node store + eviction",
        body: "Each node is essentially the LRU cache (HashMap + doubly-linked list) from the LLD track, giving O(1) get/put and LRU eviction when memory is full. TTLs expire stale entries. Other policies (LFU, random) are pluggable. Size each node to hold its share of the hot working set." },
      { kind: "concept", heading: "Replication & consistency",
        body: "Replicate each shard (e.g. a primary + replica) so a node loss doesn't lose its slice and reads can fan out. Cache consistency with the DB is the hard part: cache-aside (lazy fill, invalidate on write) is the default; accept brief staleness via TTLs. Watch the thundering-herd on a hot-key expiry (request coalescing / staggered TTLs)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Hot key overwhelms one node' (replicate/duplicate that key, or client-side caching). 'Cache stampede' (lock + recompute-once, or staggered TTLs). 'Write-through vs write-back'. 'Multi-region' (per-region cache). This is Redis Cluster / Memcached in essence: consistent hashing + per-node LRU + replication." },
    ],
    "A distributed cache combines consistent hashing (partition), the LRU-cache structure (per node), and replication. The signal is naming all three plus cache-aside + stampede/hot-key handling.",
    ["Using modulo hashing (mass re-shuffle on scaling) instead of consistent hashing.",
     "Forgetting replication, so a node loss drops its keys.",
     "Ignoring cache-stampede / hot-key failure modes."],
    0.6, { type: "Distributed cache", description: "Lookup: Client → (hash key) → Cache Node on the ring → replica. Consistent hashing maps keys to nodes; each node is an LRU store.", alt: "Client hashes a key to a cache node on a consistent-hash ring with replicas." }),

  T("sysd_m8_t2", 2, "Design a Distributed Message Queue", "design-distributed-mq",
    ["case-study", "message-queue", "kafka", "log"],
    "Build a Kafka-like queue: producers append, consumers read at their own pace, messages survive crashes and can be replayed. What's the core abstraction?",
    "An append-only, partitioned, replicated COMMIT LOG. Each topic is split into partitions (ordered logs) spread across brokers; producers append, consumers track their own OFFSET (so they read at their pace and can replay). Ordering is per-partition; replication gives durability.",
    [
      { kind: "concept", heading: "The log + partitions",
        body: "The core data structure is an append-only log: messages are appended and assigned increasing offsets. A topic is split into PARTITIONS (each an independent ordered log) so throughput scales horizontally across brokers. A message's partition is chosen by key-hash (same key → same partition → ordered). Ordering is guaranteed within a partition, not across." },
      { kind: "concept", heading: "Consumer offsets & replay",
        body: "Unlike a work-queue that deletes on consume, the log RETAINS messages; each consumer (group) tracks its own OFFSET — where it has read to. This lets consumers read at their own pace, multiple independent consumers read the same data, and anyone replay from an old offset (reprocessing). Consumer groups load-balance partitions among members." },
      { kind: "concept", heading: "Durability & delivery",
        body: "Each partition is REPLICATED across brokers (leader + followers); a write is acked after replicas persist it (quorum), surviving broker loss. Delivery is typically at-least-once (consumers commit offsets after processing) → consumers must be IDEMPOTENT. Retention is time/size-based; compaction keeps the latest per key." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Guarantee ordering' (per-partition only; key→partition). 'Exactly-once' (idempotent producer + transactional offsets, or at-least-once + idempotent consumer). 'Scale consumers' (more partitions; a group member per partition). 'Backpressure' (consumers pull at their pace). This IS Kafka: partitioned replicated log + consumer offsets." },
    ],
    "A distributed MQ is the Kafka design: a partitioned, replicated append-only log with consumer-tracked offsets. The signal is the log abstraction, per-partition ordering, offset-based replay, and at-least-once + idempotency.",
    ["Modelling it as a delete-on-read queue instead of a retained, replayable log.",
     "Claiming global ordering — it's per-partition only.",
     "Forgetting consumers track offsets (pull at their pace) and must be idempotent."],
    0.6, { type: "Commit log", description: "Flow: Producer → append to Topic Partition (ordered log, replicated across brokers) → Consumer reads at its own Offset. Offsets enable replay.", alt: "Producer appends to a partitioned replicated log; consumers read at their own offset." }),

  T("sysd_m8_t3", 3, "Design a Leaderboard", "design-leaderboard",
    ["case-study", "leaderboard", "ranking", "sorted-set"],
    "Show the top-10 players AND any player's rank, updated live for millions of players. A SQL ORDER BY ... LIMIT on every read won't scale. What will?",
    "A sorted set (Redis ZSET) keyed by score: O(log n) to update a score, O(log n + k) to read the top-K, and O(log n) to get a player's rank — all without re-sorting. For huge scale, shard by score range or use approximate ranks; persist to a DB as the source of truth.",
    [
      { kind: "concept", heading: "Why not ORDER BY",
        body: "A relational ORDER BY score DESC LIMIT 10 re-sorts (or scans an index) on every read, and computing an arbitrary player's RANK means counting everyone above them — expensive at millions of updates/reads. You need a structure that maintains sorted order incrementally." },
      { kind: "concept", heading: "Sorted set (the core)",
        body: "Redis Sorted Sets (ZSET, a skip-list + hash) are purpose-built: ZADD updates a player's score in O(log n); ZREVRANGE 0 9 returns the top-10 in O(log n + k); ZREVRANK gives a player's rank in O(log n). All maintained without re-sorting. This is the standard leaderboard backbone." },
      { kind: "concept", heading: "Scaling & persistence",
        body: "Single-ZSET works to surprising scale, but for tens of millions: shard by score band (each shard a ZSET; route reads to the right band) or accept APPROXIMATE ranks (exact top-K, bucketed rank for the long tail). Redis holds the live leaderboard; a durable DB is the source of truth (rebuild the ZSET on restart). Time-windowed boards (daily/weekly) use separate keys with TTLs." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Get my rank among millions' (ZREVRANK; or approximate buckets at extreme scale). 'Daily/weekly/all-time' (separate ZSETs + TTL, merge for all-time). 'Ties' (secondary sort by timestamp encoded in the score). 'Regional boards' (per-region ZSETs). Signal: a sorted set for O(log n) updates + top-K + rank, persisted to a DB." },
    ],
    "A leaderboard is the sorted-set design. The signal is rejecting per-read ORDER BY for a ZSET (O(log n) update/rank, O(log n+k) top-K), plus sharding/approximation at extreme scale and time-windowed keys.",
    ["Using SQL ORDER BY ... LIMIT on every read (re-sorts; rank is O(n)).",
     "Not knowing a sorted set gives O(log n) update + rank and O(log n+k) top-K.",
     "Keeping only the in-memory ZSET with no durable source of truth."],
    0.5),

  T("sysd_m8_t4", 4, "Design an Ad-Click Aggregator", "design-ad-aggregator",
    ["case-study", "analytics", "stream", "aggregation"],
    "Ingest millions of ad-click events/sec and answer 'clicks for ad X in the last hour' with low latency. Counting rows on read is impossible. How?",
    "Ingest events into a stream (Kafka), aggregate them in time WINDOWS with a stream processor (Flink), and store rolled-up counts for fast queries — plus a batch path to correct for late/duplicate events (Lambda-style). It's a high-volume write + pre-aggregated read system.",
    [
      { kind: "concept", heading: "Ingest → stream → pre-aggregate",
        body: "Clicks are a firehose of write-heavy events. Buffer them into a partitioned log (Kafka) for durability + backpressure, then a stream processor (Flink/Spark Streaming) aggregates per (ad, time-window) — e.g. tumbling 1-minute windows — and writes rolled-up counts to a fast store. Reads hit the pre-aggregated counts, never raw events (counting raw on read is impossible at this volume)." },
      { kind: "concept", heading: "Windows, late & duplicate events",
        body: "Aggregation is per time window; you must handle LATE events (a click reported seconds late — watermarks decide when to close a window) and DUPLICATES (dedup by event id — idempotency). Pre-aggregate at multiple granularities (minute→hour→day) so queries pick the cheapest rollup." },
      { kind: "concept", heading: "Accuracy: Lambda/Kappa",
        body: "The streaming path gives low-latency approximate counts; a BATCH path reprocesses the raw event log periodically for exact, corrected numbers (Lambda architecture) — or Kappa replays the log if streaming alone suffices. For unique-user counts, HyperLogLog gives cardinality in KB. Idempotent processing prevents double-counting on retries." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Exactly-once counts' (idempotent dedup by event id + transactional offsets). 'Fraud/bot filtering' (a stream stage). 'Query arbitrary ranges' (sum pre-aggregated buckets). 'Unique users' (HyperLogLog). 'Late data' (watermarks + the batch correction path). Signal: Kafka ingest + windowed stream aggregation + multi-granularity rollups + batch correction." },
    ],
    "The ad-click aggregator is the canonical streaming-analytics design. The signal is Kafka ingest + windowed stream aggregation into rollups (read pre-aggregated, never raw), with late/duplicate handling and a batch correction path.",
    ["Counting raw events on read instead of pre-aggregating into windows.",
     "Ignoring late and duplicate events (watermarks + idempotent dedup).",
     "No batch path to correct the approximate streaming counts."],
    0.6, { type: "Aggregation pipeline", description: "Flow: Click events → Kafka → Stream Processor (windowed aggregation) → Rollup Store; a Batch job reprocesses raw events for exact counts. Queries read rollups.", alt: "Clicks to Kafka to stream processor to rollup store, with a batch correction path." }),

  T("sysd_m8_t5", 5, "Design a Distributed Job Scheduler", "design-job-scheduler",
    ["case-study", "scheduler", "cron", "queue"],
    "Run millions of scheduled/recurring jobs (cron-like) reliably across a fleet — at the right time, exactly once, surviving worker crashes. How?",
    "A persistent job store (with next-run-time), a scheduler that polls/uses a time-ordered structure to enqueue due jobs onto a queue, and a worker pool that pulls and executes them. Reliability (exactly-once-ish, retries, no missed jobs) and distribution (no duplicate execution) are the crux.",
    [
      { kind: "concept", heading: "Store + scheduler + workers",
        body: "Three parts: (1) a durable JOB STORE (job def, schedule/cron, next_run_time, status); (2) a SCHEDULER that finds jobs whose next_run_time ≤ now and enqueues them onto a task QUEUE; (3) a WORKER POOL that pulls from the queue and executes (Producer-Consumer). Recurring jobs reschedule their next_run_time after running." },
      { kind: "concept", heading: "Finding due jobs efficiently",
        body: "Scanning all jobs every tick is wasteful at millions. Index by next_run_time (a sorted store / DB index / a time-bucketed structure) so the scheduler pulls only the due ones. For sub-second precision, a hierarchical timing wheel; for typical cron, an indexed poll every few seconds suffices." },
      { kind: "concept", heading: "Reliability & no double-execution",
        body: "Distributed crux: multiple scheduler/worker instances must NOT run the same job twice. Use atomic claim (a job is leased/locked when picked, with a visibility timeout) so only one worker owns it; if a worker dies, the lease expires and another retakes it (at-least-once + idempotent jobs). Persist status so a scheduler restart doesn't miss or re-run jobs. Retries with backoff + a dead-letter for permanent failures." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Exactly-once execution' (atomic lease + idempotent job + dedup). 'Job dependencies / DAGs' (Airflow-style — run after upstreams). 'Sub-second precision' (timing wheel). 'Scale to millions' (shard jobs across schedulers; partition the store). 'Missed jobs after downtime' (catch-up policy). Signal: durable store indexed by next-run + queue + worker pool + atomic lease for exactly-once-ish." },
    ],
    "A distributed scheduler is store + scheduler + worker-pool (Producer-Consumer). The signal is indexing by next-run-time, atomic job leasing to avoid double-execution, and at-least-once + idempotent jobs with retries.",
    ["Scanning all jobs every tick instead of indexing by next-run-time.",
     "No atomic lease, so multiple workers run the same job twice.",
     "Assuming exactly-once for free instead of lease + idempotency + dedup."],
    0.6),

  T("sysd_m8_t6", 6, "Design a Unique ID Generator", "design-unique-id",
    ["case-study", "id-generation", "snowflake", "distributed"],
    "Generate billions of unique 64-bit IDs/sec across many servers — no collisions, roughly time-sortable, no central bottleneck. How (without a single DB sequence)?",
    "Snowflake-style IDs: pack a 64-bit integer from [timestamp | machine-id | per-ms sequence]. Each machine generates locally (no coordination, no central bottleneck), IDs are unique (machine-id partitions the space) and roughly time-ordered (timestamp leads). Alternatives: UUIDs, DB ticket servers, range allocation.",
    [
      { kind: "concept", heading: "Why not the obvious options",
        body: "A single DB auto-increment is a central bottleneck + SPOF. Random UUIDs (128-bit) are unique and decentralized but big and NOT sortable (bad as a DB primary key — random index inserts). We want 64-bit, decentralized, collision-free, and roughly time-sortable. Hence Snowflake." },
      { kind: "concept", heading: "Snowflake structure",
        body: "A 64-bit ID = [1 sign bit | ~41 bits timestamp (ms since an epoch) | ~10 bits machine/worker id | ~12 bits sequence per ms]. The timestamp makes IDs roughly time-ordered (good index locality); the machine id partitions the space so different machines never collide; the 12-bit sequence allows 4096 IDs per ms per machine. Each server generates locally — zero coordination." },
      { kind: "concept", heading: "Edge cases",
        body: "Clock skew / clock going backward (NTP adjustment) can produce duplicate or out-of-order IDs — handle by waiting or refusing to go back. Sequence overflow within a ms → wait for the next ms. Machine-id assignment needs coordination (ZooKeeper/config) so two servers don't share an id. ~41 timestamp bits last ~69 years from the epoch." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Why not UUID?' (size + not sortable). 'Handle clock drift' (wait/refuse on backward clock). 'Assign machine ids' (coordination service). 'Need strict monotonicity' (harder; per-machine is monotone). Alternatives: a ticket server handing out ranges (DB sequence batched), or UUIDv7 (time-ordered UUID). Signal: time | machine | sequence packing, generated locally." },
    ],
    "Unique-ID generation is the Snowflake design. The signal is the timestamp|machine-id|sequence packing for decentralized, collision-free, time-sortable 64-bit IDs, plus the clock-skew and machine-id-assignment edge cases.",
    ["Proposing a single DB sequence (bottleneck/SPOF) or plain random UUIDs (big, unsortable) without trade-offs.",
     "Ignoring clock-backward / clock-skew handling.",
     "Forgetting machine-id assignment needs coordination."],
    0.5),

  T("sysd_m8_t7", 7, "Design an Object Store (S3)", "design-object-store",
    ["case-study", "object-store", "s3", "storage"],
    "Build S3: store trillions of objects via a key, durable to 11 nines, infinitely scalable, over an HTTP API. How are objects stored, found, and kept safe?",
    "A flat key→object namespace with two planes: a METADATA service (key → which storage nodes hold the object's chunks) and a DATA plane (objects chunked, spread across nodes with replication or erasure coding). Consistent hashing places data; the metadata index makes lookup O(1). Durability via redundancy across failure domains.",
    [
      { kind: "concept", heading: "Flat namespace, two planes",
        body: "Object storage is a flat map: bucket + key → object (blob + metadata), via an HTTP API (PUT/GET/DELETE). No directories (the '/' in keys is convention). Split into: a METADATA plane (an index: key → object location/chunks, size, version) and a DATA plane (the actual bytes on storage nodes). Separating them lets metadata stay queryable while data scales massively." },
      { kind: "concept", heading: "Placement & durability",
        body: "Objects (or large-object chunks) are placed on storage nodes via consistent hashing, then made durable by REPLICATION (3 copies) for hot data or ERASURE CODING (k+m fragments) for cold/archival — both spread across racks/AZs so no single failure loses data (11 nines). Background scrubbing + re-replication repair lost copies." },
      { kind: "concept", heading: "Large objects, versioning, consistency",
        body: "Large uploads use MULTIPART upload (chunk, upload in parallel, assemble) and resumability. Versioning keeps prior versions (immutable objects — overwrite = new version). S3 now offers strong read-after-write consistency; historically it was eventually consistent. A GET resolves the key via metadata → fetches chunks from data nodes (often via a CDN for hot/static)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Upload a 5 TB file' (multipart + resumable). 'Durability math' (replication vs erasure-coding trade). 'Hot object' (CDN in front). 'Lifecycle/tiering' (move cold objects to cheaper storage). 'Strong vs eventual consistency'. Signal: flat key namespace + metadata/data plane split + consistent-hashing placement + redundancy for durability." },
    ],
    "An object store (S3) is a flat key→blob system with a metadata/data-plane split, consistent-hashing placement, and replication/erasure-coding for 11-nines durability. Multipart upload and versioning are common follow-ups.",
    ["Modelling it as a hierarchical filesystem instead of a flat key→object map.",
     "Not separating the metadata index from the data plane.",
     "Forgetting durability comes from redundancy across failure domains (replication/erasure coding)."],
    0.6),

  T("sysd_m8_t8", 8, "Design a Proximity / Nearby Service", "design-proximity",
    ["case-study", "geospatial", "geohash", "quadtree"],
    "Yelp / 'find restaurants within 2km of me', for millions of places and queries. A full scan computing distance to every place is impossible. What indexes location?",
    "A geospatial index — geohash or quadtree — so 'nearby' becomes a lookup of the user's cell + neighbours, not a全 scan. Places are bucketed by location; a query reads the relevant cells and filters/sorts by exact distance. The spatial index + cell-based search is the crux.",
    [
      { kind: "concept", heading: "Don't scan — index by location",
        body: "Computing distance to every place per query is O(all places) — impossible at scale. Encode each place's lat/lng into a spatial bucket so nearby places share a bucket, then a query only examines its own + adjacent buckets. Two standard approaches: geohash and quadtree." },
      { kind: "concept", heading: "Geohash vs quadtree",
        body: "GEOHASH encodes (lat,lng) into a base-32 string where a shared prefix ≈ proximity; index places by geohash prefix → 'nearby' = same/adjacent prefixes (a B-tree/DB index works, e.g. Redis GEO). QUADTREE recursively subdivides space into 4 cells until each holds ≤K points → denser areas get finer cells (adaptive); great for skewed density (cities). Both turn proximity into a cell lookup." },
      { kind: "concept", heading: "Query flow & ranking",
        body: "Find the user's cell(s) for the radius, gather candidate places from those cells (+ adjacent, since a radius spans cell borders), compute EXACT haversine distance for candidates, filter by radius, sort by distance (+ rating). Reads are heavy → cache popular areas; place data updates are relatively rare (good read:write ratio)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Dense vs sparse areas' (quadtree adapts; fixed geohash precision struggles). 'Radius spans cell borders' (also query neighbour cells). 'Moving objects (Uber drivers)' (frequent location updates → in-memory geo index; see ride-sharing). 'Rank by rating + distance' (scoring). Signal: geohash/quadtree spatial index + cell-based candidate gather + exact-distance refine." },
    ],
    "A proximity service is the geospatial-index design (Yelp/nearby). The signal is geohash or quadtree to make 'nearby' a cell lookup (not a scan), gather candidates from the user's + adjacent cells, then refine by exact distance.",
    ["Scanning all places computing distance per query instead of a spatial index.",
     "Querying only the user's cell and missing places just across a cell border.",
     "Using fixed-precision geohash for highly skewed density where a quadtree adapts better."],
    0.6, { type: "Proximity query", description: "Flow: User location → Spatial Index (geohash/quadtree) → candidate places in nearby cells → filter+sort by exact distance.", alt: "User location to a geospatial index returning candidates from nearby cells, refined by exact distance." }),
];

const EXERCISES = [
  // Distributed cache
  pm({ topicId: "sysd_m8_t1", exerciseId: "sysd_m8_t1_pm_1", position: 1, level: "medium", title: "Partition the keys",
    scenario: "To spread cache keys across nodes so adding a node moves minimal data, use…",
    options: ["Consistent hashing", "hash(key) % N", "Range by alphabet", "One big node"], correct: "Consistent hashing",
    explanation: "Consistent hashing moves only ~1/N keys when membership changes — essential for elastic cache scaling." }),
  pm({ topicId: "sysd_m8_t1", exerciseId: "sysd_m8_t1_pm_2", position: 2, level: "medium", title: "Per-node structure",
    scenario: "Each cache node providing O(1) get/put with LRU eviction is essentially…",
    options: ["The LRU cache (HashMap + doubly-linked list)", "A B-tree", "A sorted array", "A bloom filter"], correct: "The LRU cache (HashMap + doubly-linked list)",
    explanation: "A node is the LRU-cache structure from LLD — O(1) get/put and LRU eviction." }),
  pm({ topicId: "sysd_m8_t1", exerciseId: "sysd_m8_t1_pm_3", position: 3, level: "hard", title: "Hot-key expiry",
    scenario: "A popular key expires and thousands of requests stampede the DB. Mitigation?",
    options: ["Request coalescing / staggered TTLs (cache stampede)", "Bigger keys", "Modulo hashing", "Disable the cache"], correct: "Request coalescing / staggered TTLs (cache stampede)",
    explanation: "Coalesce the recompute behind a lock or stagger TTLs to avoid the thundering herd on expiry." }),
  // Distributed MQ
  pm({ topicId: "sysd_m8_t2", exerciseId: "sysd_m8_t2_pm_1", position: 1, level: "hard", title: "Core abstraction",
    scenario: "A Kafka-like distributed queue's core data structure is…",
    options: ["A partitioned, replicated append-only log", "A delete-on-read FIFO queue", "A hash map", "A B-tree"], correct: "A partitioned, replicated append-only log",
    explanation: "It's an append-only commit log split into partitions and replicated — retained, not deleted on read." }),
  pm({ topicId: "sysd_m8_t2", exerciseId: "sysd_m8_t2_pm_2", position: 2, level: "medium", title: "Ordering guarantee",
    scenario: "In a partitioned log, ordering is guaranteed…",
    options: ["Within a partition (not across)", "Globally across all partitions", "Never", "Only for one consumer"], correct: "Within a partition (not across)",
    explanation: "Order holds per partition; route a key to a fixed partition for per-key ordering. No global order." }),
  pm({ topicId: "sysd_m8_t2", exerciseId: "sysd_m8_t2_pm_3", position: 3, level: "medium", title: "Read at your pace + replay",
    scenario: "What lets consumers read at their own speed and replay old messages?",
    options: ["Consumer-tracked offsets over a retained log", "Deleting messages on consume", "A single shared cursor", "TTL on every message"], correct: "Consumer-tracked offsets over a retained log",
    explanation: "Each consumer group tracks its offset; the log retains messages, enabling independent pace + replay." }),
  // Leaderboard
  pm({ topicId: "sysd_m8_t3", exerciseId: "sysd_m8_t3_pm_1", position: 1, level: "medium", title: "Core structure",
    scenario: "Top-K, plus any player's rank, updated live at scale is best backed by…",
    options: ["A sorted set (Redis ZSET / skip list)", "SQL ORDER BY ... LIMIT per read", "A plain HashMap", "A queue"], correct: "A sorted set (Redis ZSET / skip list)",
    explanation: "A sorted set gives O(log n) score update, O(log n) rank, O(log n+k) top-K without re-sorting." }),
  pm({ topicId: "sysd_m8_t3", exerciseId: "sysd_m8_t3_pm_2", position: 2, level: "medium", title: "Why not ORDER BY",
    scenario: "Why is SQL ORDER BY score LIMIT 10 + a rank query a poor fit at millions of updates/reads?",
    options: ["It re-sorts per read and rank is O(n) (count those above)", "It's not durable", "It can't store scores", "It uses too little memory"], correct: "It re-sorts per read and rank is O(n) (count those above)",
    explanation: "Per-read sorting and O(n) rank counting don't scale; a sorted set maintains order incrementally." }),
  pm({ topicId: "sysd_m8_t3", exerciseId: "sysd_m8_t3_pm_3", position: 3, level: "medium", title: "Daily + all-time",
    scenario: "Supporting daily, weekly, and all-time boards is done by…",
    options: ["Separate sorted-set keys (with TTLs), merged as needed", "One global key only", "Recomputing from logs each read", "A bloom filter"], correct: "Separate sorted-set keys (with TTLs), merged as needed",
    explanation: "Time-windowed boards are separate ZSETs (TTL on daily/weekly); all-time is its own or a merge." }),
  // Ad aggregator
  pm({ topicId: "sysd_m8_t4", exerciseId: "sysd_m8_t4_pm_1", position: 1, level: "hard", title: "Read path",
    scenario: "To answer 'clicks for ad X in the last hour' fast at millions of events/sec, reads should hit…",
    options: ["Pre-aggregated windowed rollups (not raw events)", "A scan of raw click rows", "The CDN", "A bloom filter"], correct: "Pre-aggregated windowed rollups (not raw events)",
    explanation: "Stream-aggregate into per-window rollups; queries sum rollups — counting raw events on read is infeasible." }),
  pm({ topicId: "sysd_m8_t4", exerciseId: "sysd_m8_t4_pm_2", position: 2, level: "medium", title: "Ingest layer",
    scenario: "What buffers the firehose of click events durably with backpressure before aggregation?",
    options: ["A partitioned log (Kafka)", "A relational DB", "A cache", "The CDN"], correct: "A partitioned log (Kafka)",
    explanation: "Kafka ingests the high-volume stream durably and provides backpressure into the stream processor." }),
  pm({ topicId: "sysd_m8_t4", exerciseId: "sysd_m8_t4_pm_3", position: 3, level: "hard", title: "Exact counts",
    scenario: "The streaming counts are approximate. How do you get exact, corrected numbers?",
    options: ["A batch path reprocessing the raw log (Lambda)", "Trust the stream only", "Count on read", "Drop late events"], correct: "A batch path reprocessing the raw log (Lambda)",
    explanation: "A batch layer reprocesses raw events for exact counts (Lambda); idempotent dedup avoids double-counting." }),
  // Job scheduler
  pm({ topicId: "sysd_m8_t5", exerciseId: "sysd_m8_t5_pm_1", position: 1, level: "medium", title: "Find due jobs",
    scenario: "Avoiding a full scan every tick to find jobs to run requires…",
    options: ["Indexing jobs by next_run_time (sorted/bucketed)", "Scanning all jobs each second", "A random pick", "A bloom filter"], correct: "Indexing jobs by next_run_time (sorted/bucketed)",
    explanation: "Index/sort by next-run-time (or a timing wheel) so only due jobs are pulled — not a full scan." }),
  pm({ topicId: "sysd_m8_t5", exerciseId: "sysd_m8_t5_pm_2", position: 2, level: "hard", title: "No double-execution",
    scenario: "Many workers share the queue. What stops two from running the same job?",
    options: ["An atomic lease/lock with a visibility timeout", "Hope", "Running every job on every worker", "A bigger queue"], correct: "An atomic lease/lock with a visibility timeout",
    explanation: "A job is atomically leased when claimed; if the worker dies the lease expires and another retakes it (at-least-once + idempotent)." }),
  pm({ topicId: "sysd_m8_t5", exerciseId: "sysd_m8_t5_pm_3", position: 3, level: "medium", title: "Architecture",
    scenario: "The scheduler enqueues due jobs; workers pull and execute. This is which pattern?",
    options: ["Producer-Consumer (queue + worker pool)", "Singleton", "Observer", "Visitor"], correct: "Producer-Consumer (queue + worker pool)",
    explanation: "Scheduler produces due tasks onto a queue; a worker pool consumes them — Producer-Consumer." }),
  // Unique ID
  pm({ topicId: "sysd_m8_t6", exerciseId: "sysd_m8_t6_pm_1", position: 1, level: "hard", title: "Snowflake layout",
    scenario: "A Snowflake 64-bit ID packs which fields?",
    options: ["Timestamp | machine-id | per-ms sequence", "Random 64 bits", "A DB auto-increment", "Hash of the row"], correct: "Timestamp | machine-id | per-ms sequence",
    explanation: "Time leads (sortable), machine-id partitions the space (no collision), sequence allows many IDs per ms — generated locally." }),
  pm({ topicId: "sysd_m8_t6", exerciseId: "sysd_m8_t6_pm_2", position: 2, level: "medium", title: "Why not a DB sequence",
    scenario: "Why avoid a single DB auto-increment for IDs at scale?",
    options: ["Central bottleneck + single point of failure", "IDs would be too small", "It's not unique", "It's not numeric"], correct: "Central bottleneck + single point of failure",
    explanation: "One central sequence serializes all ID generation — a bottleneck and SPOF; Snowflake decentralizes it." }),
  pm({ topicId: "sysd_m8_t6", exerciseId: "sysd_m8_t6_pm_3", position: 3, level: "hard", title: "The edge case",
    scenario: "Which problem must a Snowflake generator handle carefully?",
    options: ["Clock moving backward (skew) causing duplicate/out-of-order IDs", "Running out of RAM", "Network partitions", "TLS handshakes"], correct: "Clock moving backward (skew) causing duplicate/out-of-order IDs",
    explanation: "Since the timestamp leads, a backward clock can repeat IDs — wait or refuse until the clock catches up." }),
  // Object store
  pm({ topicId: "sysd_m8_t7", exerciseId: "sysd_m8_t7_pm_1", position: 1, level: "medium", title: "Namespace",
    scenario: "S3-style object storage organizes data as…",
    options: ["A flat bucket+key → object map (no real directories)", "A hierarchical filesystem", "A relational schema", "A graph"], correct: "A flat bucket+key → object map (no real directories)",
    explanation: "Object storage is a flat key→blob namespace over HTTP; '/' in keys is just convention, not folders." }),
  pm({ topicId: "sysd_m8_t7", exerciseId: "sysd_m8_t7_pm_2", position: 2, level: "hard", title: "Two planes",
    scenario: "An object store separates which two planes?",
    options: ["Metadata (key→location index) and data (the bytes on storage nodes)", "Read and write", "Cache and DB", "Auth and billing"], correct: "Metadata (key→location index) and data (the bytes on storage nodes)",
    explanation: "A metadata service maps keys to chunk locations; the data plane stores the bytes — separated so each scales." }),
  pm({ topicId: "sysd_m8_t7", exerciseId: "sysd_m8_t7_pm_3", position: 3, level: "medium", title: "Upload 5TB",
    scenario: "How do you upload a very large object reliably?",
    options: ["Multipart upload (chunk, parallel, resumable)", "One giant PUT", "Inline in the metadata DB", "Through the CDN"], correct: "Multipart upload (chunk, parallel, resumable)",
    explanation: "Multipart splits the object into parts uploaded in parallel and assembled — resumable on failure." }),
  // Proximity
  pm({ topicId: "sysd_m8_t8", exerciseId: "sysd_m8_t8_pm_1", position: 1, level: "medium", title: "Index location",
    scenario: "'Find places within 2km' without scanning all places uses…",
    options: ["A geospatial index (geohash / quadtree)", "A full table scan with distance", "A bloom filter", "A sorted set by name"], correct: "A geospatial index (geohash / quadtree)",
    explanation: "Geohash/quadtree bucket by location so 'nearby' is a cell lookup, not an O(all-places) scan." }),
  pm({ topicId: "sysd_m8_t8", exerciseId: "sysd_m8_t8_pm_2", position: 2, level: "hard", title: "Skewed density",
    scenario: "For very uneven density (dense cities, empty rural areas), which adapts better?",
    options: ["Quadtree (subdivides dense cells finer)", "Fixed-precision geohash everywhere", "A single cell", "Random sharding"], correct: "Quadtree (subdivides dense cells finer)",
    explanation: "A quadtree recursively splits only dense cells, adapting to skew; fixed geohash precision struggles." }),
  pm({ topicId: "sysd_m8_t8", exerciseId: "sysd_m8_t8_pm_3", position: 3, level: "medium", title: "Radius crosses a border",
    scenario: "A 2km radius can extend beyond the user's cell. What must the query also check?",
    options: ["Adjacent/neighbour cells", "Only the user's exact cell", "The whole country", "Nothing"], correct: "Adjacent/neighbour cells",
    explanation: "Gather candidates from the user's cell AND neighbours (the radius spans borders), then refine by exact distance." }),
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
  const totals = await recomputeTrackTotals(TRACK_KEY);
  console.log(`\nDone — M8 Case Studies III seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
