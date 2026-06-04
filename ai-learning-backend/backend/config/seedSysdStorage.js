/**
 * Seed — System Design module M6: Storage, Big Data & Scale Structures (breadth
 * parity with AlgoMaster's Storage Systems + Big Data + Data-Structures-for-Scale).
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdStorage.js   ·   npm: npm run seed:sysd-storage
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m6";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 6,
  name: "Storage, Big Data & Scale Structures", slug: "storage-bigdata",
  description: "How bytes are stored and processed at scale: block/file/object storage, distributed file systems & replication, batch vs stream processing, MapReduce & data pipelines, lambda/kappa architectures, and the probabilistic data structures that make scale possible.",
  estimatedHours: 4, prerequisites: ["sysd_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 30, difficulty: 3, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 30, difficulty: diff, xpReward: 55, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("sysd_m6_t1", 1, "Block vs File vs Object Storage", "sysd-storage-types",
    ["storage", "block", "file", "object"],
    "A database, a shared document folder, and a billion user photos — should they sit on the same kind of storage? No. What are the three kinds and when does each fit?",
    "Block storage = raw fixed-size blocks (a virtual disk) — lowest latency, what databases and VMs run on. File storage = a hierarchy of files/folders over a shared protocol (NFS) — for shared application files. Object storage = flat keyed blobs with metadata over HTTP (S3) — near-infinite, cheap, for media/backups/static assets.",
    [
      { kind: "concept", heading: "Block storage",
        body: "Exposes raw, fixed-size blocks the OS formats into a filesystem — essentially a virtual hard disk (AWS EBS, SAN). Lowest latency and highest IOPS, so it's what DATABASES and VM boot volumes use. Downsides: tied to one machine at a time, more expensive, doesn't scale to web-scale on its own." },
      { kind: "concept", heading: "File storage",
        body: "A shared hierarchical filesystem (directories + files) accessed over a network protocol like NFS/SMB (AWS EFS). Multiple machines can mount it and share files. Good for shared application data, home directories, and legacy apps that expect a filesystem. Scales less elastically than object storage and can become a bottleneck." },
      { kind: "concept", heading: "Object storage",
        body: "Flat namespace of objects (a blob + metadata) addressed by key over an HTTP API (AWS S3, GCS). Effectively infinite, very cheap, highly durable (11 nines), and built for the web — but higher latency, no in-place edits (replace the whole object), no filesystem semantics. It's THE place for images/video/backups/logs/static assets, almost always fronted by a CDN." },
      { kind: "concept", heading: "Choosing in a design",
        body: "Database / low-latency disk → block. Shared files across servers → file. User uploads, media, backups, big static blobs → object storage (S3) + CDN. The recurring LLD/SD rule: store large media in object storage and keep only its URL/metadata in your database — never the bytes in the DB." },
    ],
    "Storage-type choice appears in any media-heavy or data design. The signal is 'DB on block, media on object storage + CDN, never blobs in the database' and knowing object storage trades latency/edit-in-place for infinite cheap durability.",
    ["Storing large media as DB blobs instead of object storage + a URL.",
     "Confusing object storage (flat, keyed, HTTP) with a network filesystem.",
     "Putting a latency-sensitive database on object storage instead of block."],
    0.4, null),

  T("sysd_m6_t2", 2, "Distributed File Systems & Durability", "sysd-distributed-storage",
    ["storage", "replication", "erasure-coding", "durability"],
    "A disk dies every day in a big cluster. How does object storage promise '11 nines' of durability and never lose your file?",
    "By never trusting one disk: data is split and spread across many nodes with redundancy — either full REPLICATION (N copies) or ERASURE CODING (data + parity fragments that can rebuild lost pieces). Distributed file systems (GFS/HDFS) chunk files, replicate the chunks, and track them via a metadata master.",
    [
      { kind: "concept", heading: "Chunk + replicate (GFS/HDFS model)",
        body: "Large files are split into fixed chunks (e.g. 64–128 MB); each chunk is stored on multiple data nodes (commonly 3 replicas), and a metadata/name node tracks which chunks live where. Reads can come from any replica (parallelism); a lost node's chunks are re-replicated from survivors. This is how Hadoop HDFS and Google's GFS achieve durability + throughput on commodity disks." },
      { kind: "concept", heading: "Replication vs erasure coding",
        body: "Replication (3 copies) is simple and fast to read/recover but costs 3× storage. Erasure coding splits data into k data + m parity fragments (e.g. 10+4): any k of the (k+m) fragments rebuild the original, surviving m failures — at only ~1.4× storage instead of 3×. The trade: erasure coding saves a LOT of space but costs CPU to encode/decode and is slower to repair. Hot data → replication; cold/archival → erasure coding." },
      { kind: "concept", heading: "Durability vs availability",
        body: "Durability = 'will my data still exist?' (achieved by redundancy across failure domains — disks, racks, datacenters). Availability = 'can I reach it right now?'. Object stores like S3 are extremely durable (11 nines) by spreading copies/fragments across AZs. Don't conflate them: a system can be durable but briefly unavailable during a partition (CAP)." },
    ],
    "Durability mechanics come up for storage-heavy designs. The signal is chunk+replicate (or erasure-code) across failure domains, and the replication-vs-erasure-coding space/CPU trade-off (hot→replicate, cold→erasure).",
    ["Thinking durability comes from one reliable disk rather than redundancy across nodes.",
     "Not knowing erasure coding trades CPU for ~2× less storage than 3-replication.",
     "Conflating durability (data survives) with availability (reachable now)."],
    0.5, null),

  T("sysd_m6_t3", 3, "Batch vs Stream Processing", "sysd-batch-stream",
    ["big-data", "batch", "stream", "processing"],
    "Compute yesterday's sales report vs flag a fraudulent transaction in 200ms. Same data tooling? No — one is batch, one is stream.",
    "Batch processing runs over a large, bounded dataset on a schedule (high throughput, high latency) — reports, ETL, model training. Stream processing runs continuously over unbounded events as they arrive (low latency, per-event) — fraud detection, live dashboards, alerting.",
    [
      { kind: "concept", heading: "Batch",
        body: "Process a large, FINITE dataset at once, usually on a schedule (nightly). Optimised for throughput, not latency — results are minutes-to-hours old. Tools: Hadoop MapReduce, Spark (batch mode). Use for analytics/reports, ETL into a warehouse, ML training, and recompute-everything jobs where freshness isn't critical." },
      { kind: "concept", heading: "Stream",
        body: "Process UNBOUNDED events continuously as they arrive, with sub-second latency. You reason about time windows (tumbling/sliding), watermarks (handling late events), and per-event or per-window aggregates. Tools: Kafka Streams, Flink, Spark Streaming. Use for fraud detection, real-time dashboards, anomaly alerts, live recommendations." },
      { kind: "concept", heading: "The trade & how they combine",
        body: "Batch is simpler, cheaper, and easy to reprocess (just re-run), but stale. Streaming is fresh but harder (state, ordering, late/duplicate events, exactly-once). Many systems run BOTH: a fast streaming path for live numbers + a batch path for accurate, reprocessable history — which is exactly the Lambda/Kappa architecture debate (next topic)." },
    ],
    "Batch-vs-stream is a core data-pipeline question. Map them to latency needs (batch=throughput/stale, stream=low-latency/fresh) and mention windowing + late events for streaming depth.",
    ["Using batch where sub-second freshness is required (or vice versa).",
     "Ignoring streaming's hard parts: windows, late/out-of-order events, exactly-once.",
     "Not realising real systems often run both paths."],
    0.4, { type: "Lambda data flow", description: "Two paths: Events → Stream Processor → real-time view; and Events → Storage → Batch Processor → accurate view. A serving layer merges both.", alt: "Events split into a streaming path and a batch path, merged at a serving layer." }),

  T("sysd_m6_t4", 4, "MapReduce & Data Pipelines", "sysd-mapreduce",
    ["big-data", "mapreduce", "etl", "data-lake"],
    "How do you count word frequencies across a petabyte of text on 1000 machines? You can't fit it on one box — so you Map, then Reduce.",
    "MapReduce splits a huge job into parallel MAP tasks (transform each input split into key-value pairs) and REDUCE tasks (aggregate all values per key), with a shuffle in between. It's the foundation of big-data pipelines that ETL raw data into data lakes/warehouses.",
    [
      { kind: "concept", heading: "Map → Shuffle → Reduce",
        body: "MAP: each worker processes a split of the input and emits key-value pairs (e.g. (word, 1)). SHUFFLE: the framework groups all pairs by key and routes them to reducers. REDUCE: each reducer aggregates the values for its keys (e.g. sum the 1s → word counts). Massively parallel, fault-tolerant (re-run a failed task), and moves compute to the data. Spark generalises this with in-memory DAGs (far faster than disk-based Hadoop MapReduce)." },
      { kind: "concept", heading: "ETL / ELT and the pipeline",
        body: "Data pipelines Extract from sources, Transform (clean/join/aggregate), and Load into a destination (ETL). Modern 'ELT' loads raw first, then transforms in the warehouse. Orchestrated by tools like Airflow as a DAG of steps. The output feeds analytics, dashboards, and ML." },
      { kind: "concept", heading: "Data lake vs warehouse",
        body: "A DATA LAKE stores raw data in any format cheaply (object storage) — schema-on-read, flexible, for data science/ML. A DATA WAREHOUSE stores cleaned, structured, schema-on-write data optimised for analytical SQL queries (Snowflake, BigQuery, Redshift). Common pattern: land raw in the lake → transform → load curated tables into the warehouse for BI." },
    ],
    "MapReduce + pipelines appear in analytics and big-data designs. Know the map→shuffle→reduce flow, ETL vs ELT, and lake (raw, schema-on-read) vs warehouse (curated, schema-on-write).",
    ["Not being able to explain the shuffle step between map and reduce.",
     "Confusing a data lake (raw, cheap, flexible) with a warehouse (curated, query-optimised).",
     "Forgetting MapReduce moves compute to the data and re-runs failed tasks."],
    0.5, null),

  T("sysd_m6_t5", 5, "Lambda vs Kappa Architecture", "sysd-lambda-kappa",
    ["big-data", "lambda", "kappa", "architecture"],
    "You want both real-time numbers AND accurate, reprocessable history. Do you run two pipelines (Lambda) or one (Kappa)?",
    "Lambda architecture runs a batch layer (accurate, reprocessable) AND a speed/streaming layer (fresh, approximate) and merges them at a serving layer — robust but you maintain two codebases. Kappa drops the batch layer: treat everything as a stream, reprocess by replaying the log — simpler, one codebase.",
    [
      { kind: "concept", heading: "Lambda — batch + speed layers",
        body: "Lambda has THREE parts: a batch layer recomputing accurate views from all historical data, a speed layer producing low-latency (approximate) views from recent events, and a serving layer that merges them to answer queries. Strength: accurate AND fresh, and you can reprocess history. Weakness: you implement and keep in sync the SAME logic twice (batch + stream code) — a real maintenance tax." },
      { kind: "concept", heading: "Kappa — stream only",
        body: "Kappa removes the batch layer: everything is a stream, and 'reprocessing' means replaying the immutable event log (e.g. Kafka with long retention) through the streaming job again. One codebase, simpler ops. It relies on a durable, replayable log as the source of truth. Weakness: very large historical reprocessing over a stream can be heavy, and not every problem maps cleanly to streaming." },
      { kind: "concept", heading: "Choosing",
        body: "Kappa is the modern default when your stream processor + a replayable log can handle reprocessing — less code, less drift. Lambda still fits when batch and real-time genuinely need different engines/optimisations, or when you must reconcile an approximate live view against a precise nightly recompute. The interview-grade summary: Lambda = two paths merged (robust, duplicated); Kappa = one stream + replay (simpler)." },
    ],
    "Lambda-vs-Kappa is a senior big-data topic. State Lambda = batch+speed+serving (duplicated logic) vs Kappa = stream-only with log replay (one codebase), and that Kappa is the modern lean default.",
    ["Describing Lambda without the serving layer that merges the two views.",
     "Not knowing Kappa relies on replaying a durable log to reprocess.",
     "Assuming you always need both paths — Kappa often suffices."],
    0.6, null),

  T("sysd_m6_t6", 6, "Probabilistic Structures for Scale", "sysd-scale-structures",
    ["data-structures", "bloom-filter", "hyperloglog", "merkle", "geohash"],
    "Count unique visitors to a site with billions of hits using a few KB. Check 'have I seen this?' without storing every key. At scale, exact often loses to approximate.",
    "A toolbox of space-efficient structures: Bloom filters (probabilistic set membership), HyperLogLog (approximate distinct counts in ~KB), Merkle trees (efficient diff/verification), Count-Min Sketch (approximate frequencies), and geohash/quadtrees (spatial). They trade a little accuracy for enormous memory savings.",
    [
      { kind: "concept", heading: "Bloom filter — 'definitely not / probably yes'",
        body: "A bit array + k hashes answering set membership with NO false negatives and a tunable false-positive rate, in tiny memory. Use as a cheap pre-check before an expensive lookup: 'is this key on disk?' (LSM stores skip SSTable reads), 'have we crawled this URL?', 'is this username taken (fast no)?'. (Full topic in M2.)" },
      { kind: "concept", heading: "HyperLogLog — count distinct in KB",
        body: "Estimates the number of DISTINCT elements in a huge stream using ~1.5 KB with ~2% error — instead of a set that would need gigabytes. It exploits the statistics of hash-value leading zeros. Redis ships it (PFADD/PFCOUNT). Use for unique-visitor/unique-IP counts, cardinality dashboards — anywhere exact distinct-count is too expensive and approximate is fine." },
      { kind: "concept", heading: "Merkle trees & Count-Min Sketch",
        body: "MERKLE TREE: a tree of hashes where each parent hashes its children, so two replicas can find exactly which data differs by comparing root→down in O(log n) — used for anti-entropy sync (Cassandra/Dynamo) and in Git/blockchains. COUNT-MIN SKETCH: approximate frequency counts (how many times has this item appeared?) in fixed memory — for heavy-hitter detection, rate stats." },
      { kind: "concept", heading: "Spatial: geohash & quadtree",
        body: "To answer 'what's near me?' without scanning everything, encode 2-D coordinates so nearby points share structure: a GEOHASH turns lat/lng into a string where shared prefixes ≈ proximity; a QUADTREE recursively subdivides space into cells. 'Find drivers near X' becomes a cell lookup, not a full scan (Uber/maps — see the ride-sharing case study)." },
    ],
    "Probabilistic structures are the 'how is this possible in so little memory?' answers (unique counts, dedup, sync, geo). Naming HyperLogLog for distinct-count and Merkle trees for replica sync are strong, specific signals.",
    ["Proposing an exact set/DB where a Bloom filter or HyperLogLog would do.",
     "Not knowing Merkle trees pinpoint replica differences in O(log n).",
     "Scanning all points for proximity instead of geohash/quadtree cells."],
    0.5, null),
];

const EXERCISES = [
  // T1
  pm({ topicId: "sysd_m6_t1", exerciseId: "sysd_m6_t1_pm_1", position: 1, level: "easy",
    title: "Where do user photos go?",
    scenario: "You're storing a billion user-uploaded photos cheaply and durably, served globally. Which storage?",
    options: ["Object storage (S3) + CDN", "Block storage (EBS)", "A network file share (NFS)", "The relational database"], correct: "Object storage (S3) + CDN",
    explanation: "Object storage is near-infinite, cheap, durable, and HTTP-native — ideal for media, fronted by a CDN. Never blobs in the DB." }),
  pm({ topicId: "sysd_m6_t1", exerciseId: "sysd_m6_t1_pm_2", position: 2, level: "medium",
    title: "Where does a database's disk live?",
    scenario: "A latency-sensitive relational database needs its underlying disk. Which storage type?",
    options: ["Block storage", "Object storage", "File storage", "A CDN"], correct: "Block storage",
    explanation: "Databases need low-latency, high-IOPS raw block devices (EBS/SAN), not object storage." }),
  pm({ topicId: "sysd_m6_t1", exerciseId: "sysd_m6_t1_pm_3", position: 3, level: "medium",
    title: "Object storage limitation",
    scenario: "Which is TRUE of object storage?",
    options: ["No in-place edits — you replace the whole object; higher latency but near-infinite & cheap", "Lowest latency, ideal for DB disks", "Provides a POSIX filesystem", "Limited to a few GB"], correct: "No in-place edits — you replace the whole object; higher latency but near-infinite & cheap",
    explanation: "Object stores trade filesystem semantics + low latency for infinite, cheap, durable HTTP-addressed blobs." }),
  // T2
  pm({ topicId: "sysd_m6_t2", exerciseId: "sysd_m6_t2_pm_1", position: 1, level: "medium",
    title: "Where does durability come from?",
    scenario: "Object storage promises ~11 nines of durability. How?",
    options: ["Redundancy: copies/erasure-coded fragments spread across failure domains", "One very reliable disk", "Frequent fsync", "Encryption"], correct: "Redundancy: copies/erasure-coded fragments spread across failure domains",
    explanation: "Durability comes from spreading redundant data across disks/racks/AZs, not from any single reliable disk." }),
  pm({ topicId: "sysd_m6_t2", exerciseId: "sysd_m6_t2_pm_2", position: 2, level: "hard",
    title: "Save space on cold data",
    scenario: "For rarely-read archival data you want durability at far less than 3× storage cost. Which technique?",
    options: ["Erasure coding (k data + m parity)", "3× replication", "A bigger single disk", "Caching"], correct: "Erasure coding (k data + m parity)",
    explanation: "Erasure coding (e.g. 10+4) survives m failures at ~1.4× storage vs 3× for replication — at the cost of CPU/repair time." }),
  pm({ topicId: "sysd_m6_t2", exerciseId: "sysd_m6_t2_pm_3", position: 3, level: "medium",
    title: "Durable but unreachable?",
    scenario: "During a network partition your data still exists on disk but you can't read it. Which property is affected?",
    options: ["Availability (durability is intact)", "Durability", "Both equally", "Neither"], correct: "Availability (durability is intact)",
    explanation: "Durability = data survives; availability = reachable now. A partition can hurt availability while durability holds." }),
  // T3
  pm({ topicId: "sysd_m6_t3", exerciseId: "sysd_m6_t3_pm_1", position: 1, level: "easy",
    title: "Nightly sales report",
    scenario: "Computing an accurate report over all of yesterday's data, run once per night. Which processing model?",
    options: ["Batch", "Stream", "Neither", "Real-time only"], correct: "Batch",
    explanation: "A scheduled job over a bounded dataset optimised for throughput is batch processing." }),
  pm({ topicId: "sysd_m6_t3", exerciseId: "sysd_m6_t3_pm_2", position: 2, level: "medium",
    title: "Flag fraud in 200ms",
    scenario: "Detecting a fraudulent transaction the instant it happens needs which model?",
    options: ["Stream processing", "Batch processing", "A nightly job", "A data warehouse query"], correct: "Stream processing",
    explanation: "Per-event, sub-second processing of unbounded events is stream processing (Flink/Kafka Streams)." }),
  pm({ topicId: "sysd_m6_t3", exerciseId: "sysd_m6_t3_pm_3", position: 3, level: "hard",
    title: "Streaming's hard part",
    scenario: "Which challenge is unique to stream (not batch) processing?",
    options: ["Windows + late/out-of-order events", "Reading from disk", "Running on a schedule", "Joining two tables"], correct: "Windows + late/out-of-order events",
    explanation: "Unbounded streams force time-windowing and handling late/out-of-order events (watermarks) — batch sees all data at once." }),
  // T4
  pm({ topicId: "sysd_m6_t4", exerciseId: "sysd_m6_t4_pm_1", position: 1, level: "medium",
    title: "The step between map and reduce",
    scenario: "In MapReduce, what happens between Map and Reduce?",
    options: ["Shuffle — group all values by key and route to reducers", "Compile", "Encrypt", "Cache"], correct: "Shuffle — group all values by key and route to reducers",
    explanation: "The shuffle groups map output by key so each reducer receives all values for its keys." }),
  pm({ topicId: "sysd_m6_t4", exerciseId: "sysd_m6_t4_pm_2", position: 2, level: "medium",
    title: "Lake vs warehouse",
    scenario: "Cheap raw storage of any-format data for data scientists, schema applied at read time. That's a…",
    options: ["Data lake", "Data warehouse", "Block volume", "Message queue"], correct: "Data lake",
    explanation: "A data lake stores raw data cheaply (schema-on-read); a warehouse stores curated, structured data (schema-on-write) for SQL analytics." }),
  pm({ topicId: "sysd_m6_t4", exerciseId: "sysd_m6_t4_pm_3", position: 3, level: "medium",
    title: "Faster than Hadoop MapReduce",
    scenario: "Which engine generalises MapReduce with in-memory DAGs for much faster jobs?",
    options: ["Apache Spark", "NFS", "Redis", "nginx"], correct: "Apache Spark",
    explanation: "Spark keeps intermediate data in memory across a DAG of stages, far faster than disk-based Hadoop MapReduce." }),
  // T5
  pm({ topicId: "sysd_m6_t5", exerciseId: "sysd_m6_t5_pm_1", position: 1, level: "hard",
    title: "Two pipelines merged",
    scenario: "An architecture with a batch layer (accurate), a speed layer (fresh), and a serving layer merging them is…",
    options: ["Lambda architecture", "Kappa architecture", "Microservices", "CQRS"], correct: "Lambda architecture",
    explanation: "Lambda = batch + speed + serving layers; its cost is maintaining the same logic in two codebases." }),
  pm({ topicId: "sysd_m6_t5", exerciseId: "sysd_m6_t5_pm_2", position: 2, level: "hard",
    title: "One stream, replay to reprocess",
    scenario: "An architecture that drops the batch layer and reprocesses by replaying a durable event log is…",
    options: ["Kappa architecture", "Lambda architecture", "Lambda + CQRS", "Star schema"], correct: "Kappa architecture",
    explanation: "Kappa treats everything as a stream; reprocessing = replaying the log (e.g. Kafka) — one codebase, simpler ops." }),
  pm({ topicId: "sysd_m6_t5", exerciseId: "sysd_m6_t5_pm_3", position: 3, level: "medium",
    title: "Lambda's main downside",
    scenario: "What's the chief drawback of Lambda architecture?",
    options: ["Maintaining the same logic twice (batch + stream)", "It can't be accurate", "It has no real-time view", "It needs no storage"], correct: "Maintaining the same logic twice (batch + stream)",
    explanation: "Lambda duplicates business logic across the batch and speed layers, which drift and double the maintenance." }),
  // T6
  pm({ topicId: "sysd_m6_t6", exerciseId: "sysd_m6_t6_pm_1", position: 1, level: "medium",
    title: "Count uniques in KB",
    scenario: "Estimate the number of distinct visitors over billions of events using ~1.5KB with small error. Which structure?",
    options: ["HyperLogLog", "A HashSet of all visitors", "A Bloom filter", "A B-tree"], correct: "HyperLogLog",
    explanation: "HyperLogLog estimates distinct cardinality in ~KB with ~2% error — a HashSet would need gigabytes." }),
  pm({ topicId: "sysd_m6_t6", exerciseId: "sysd_m6_t6_pm_2", position: 2, level: "hard",
    title: "Find which replicas differ",
    scenario: "Two replicas need to find exactly which data diverged, cheaply. Which structure?",
    options: ["Merkle tree (compare hashes top-down, O(log n))", "Bloom filter", "Skip list", "Quadtree"], correct: "Merkle tree (compare hashes top-down, O(log n))",
    explanation: "Merkle trees let replicas pinpoint differing ranges by comparing hashes from the root down — used in Cassandra/Dynamo anti-entropy." }),
  pm({ topicId: "sysd_m6_t6", exerciseId: "sysd_m6_t6_pm_3", position: 3, level: "medium",
    title: "Nearby search without scanning",
    scenario: "'Find points near me' without scanning all points uses which encoding?",
    options: ["Geohash / quadtree", "HyperLogLog", "Merkle tree", "Count-Min Sketch"], correct: "Geohash / quadtree",
    explanation: "Geohash/quadtree map 2-D space so proximity → shared cells, turning nearby-search into a cell lookup." }),
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
  console.log(`\nDone — M6 Storage/BigData seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
