/**
 * Seed — System Design module M23: Data & Platform Infrastructure:
 * Data Lake/Lakehouse, Collaborative Whiteboard at scale (Figma), Geospatial
 * DB, Blockchain/Distributed Ledger, ETL Orchestration, Quota/Metering,
 * Anomaly Detection, Inbound Webhook Ingestion. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases18.js   ·   npm: npm run seed:sysd-cases18
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m23";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 23,
  name: "Data & Platform Infrastructure", slug: "data-platform-infra",
  description: "Eight data and platform infrastructure designs: a data lake/lakehouse, a real-time collaborative whiteboard, a geospatial database, a blockchain/distributed ledger, an ETL orchestration platform, a quota/metering service, an anomaly-detection system, and an inbound webhook-ingestion gateway.",
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
  T("sysd_m23_t1", 1, "Design a Data Lake / Lakehouse", "design-data-lake",
    ["case-study", "object-storage", "schema-on-read", "table-formats"],
    "Build a data lake: store ALL of an organization's raw data (structured, semi-structured, unstructured) cheaply at massive scale, then run analytics/ML on it. How does it differ from a data warehouse, and what's the modern 'lakehouse'?",
    "A data lake stores raw data of ANY format in cheap OBJECT STORAGE (S3) with SCHEMA-ON-READ (impose structure when you query, not when you write) — flexible and cheap, but risks becoming a 'data swamp' without governance. A LAKEHOUSE adds warehouse-like reliability on the lake via open TABLE FORMATS (Iceberg/Delta/Hudi) giving ACID transactions, schema evolution, and time travel — combining the lake's flexibility/cost with warehouse query reliability.",
    [
      { kind: "concept", heading: "Lake vs warehouse",
        body: "A data WAREHOUSE (the m13 design) stores STRUCTURED data with a predefined schema (schema-on-WRITE), optimized for SQL analytics — but it's rigid and costly for huge raw/varied data. A data LAKE stores ALL data — structured, semi-structured (JSON/logs), unstructured (images, video) — in raw form in cheap OBJECT STORAGE, with SCHEMA-ON-READ (you decide the structure when you query, not when you ingest). The lake is flexible and cheap (store everything now, decide later); the warehouse is reliable and fast for known queries. They're complementary." },
      { kind: "concept", heading: "Object storage + schema-on-read",
        body: "The lake's foundation is cheap, durable, infinitely-scalable OBJECT STORAGE (S3/the object-store design) holding files (Parquet, JSON, CSV, media). SCHEMA-ON-READ means no upfront modeling — ingest raw, and apply structure at query time (engines like Spark/Trino/Presto read the files and impose a schema). This decouples storage (cheap, in the lake) from compute (run engines on demand) — a key cost/flexibility win over the warehouse's coupled, pre-modeled approach." },
      { kind: "concept", heading: "The data swamp problem → lakehouse",
        body: "The lake's flexibility is also its weakness: with no schema enforcement, no transactions, and poor governance, a lake degrades into a DATA SWAMP — unreliable, undiscoverable, inconsistent data. The LAKEHOUSE fixes this: open TABLE FORMATS (Apache ICEBERG, Delta Lake, Hudi) layer a metadata/transaction log over the object-storage files, providing ACID transactions, schema enforcement + evolution, time travel (query past versions), and efficient updates/deletes — warehouse-grade RELIABILITY on the lake's cheap flexible storage. Lakehouse = lake economics + warehouse reliability." },
      { kind: "concept", heading: "Architecture & follow-ups",
        body: "Typical layering: ingest raw → BRONZE (raw) → SILVER (cleaned/conformed) → GOLD (aggregated/business — the medallion architecture). A CATALOG (metadata: tables, schemas, lineage — governance) makes data discoverable and prevents the swamp. Compute engines (Spark/Trino) query the lakehouse tables; BI tools sit on the gold layer. Follow-ups: 'lake vs warehouse vs lakehouse', 'Parquet columnar files', 'partitioning/file sizing', 'governance/catalog', 'compute-storage separation'. Signal: cheap object storage + schema-on-read (flexible, all data types) + open table formats (Iceberg/Delta → ACID, schema evolution, time travel) for lakehouse reliability + catalog/governance (avoid the swamp); separates cheap storage from on-demand compute.",
      },
    ],
    "A data lake tests storing all raw data cheaply in object storage with schema-on-read (flexible, all formats, storage/compute separation) — vs the warehouse's rigid schema-on-write — and the lakehouse upgrade: open table formats (Iceberg/Delta) adding ACID transactions, schema evolution, and time travel for warehouse-grade reliability, plus a catalog/governance to avoid the 'data swamp'.",
    ["Confusing it with a warehouse — the lake is schema-on-read over cheap object storage (all data types).",
     "Ignoring governance/table formats — an ungoverned lake becomes an unusable 'data swamp'.",
     "Not knowing the lakehouse (Iceberg/Delta) adds ACID + schema evolution + time travel on the lake."],
    0.6, { type: "Data lake / lakehouse", description: "All raw data (structured/semi/unstructured) → cheap object storage (S3), schema-on-read. Lakehouse: open table format (Iceberg/Delta) adds ACID, schema evolution, time travel over the files. Medallion: bronze→silver→gold. Catalog/governance avoids the swamp. Compute (Spark/Trino) separate from storage.", alt: "Data lakehouse: schema-on-read object storage with open table formats for ACID and time travel." }),

  T("sysd_m23_t2", 2, "Design a Collaborative Whiteboard at Scale (Figma/Miro)", "design-collab-whiteboard-scale",
    ["case-study", "crdt", "realtime", "canvas"],
    "Build Figma/Miro: thousands of users editing the same infinite canvas in real time, seeing each other's cursors and edits instantly, converging with no conflicts. How do concurrent edits merge, and how does it stay fast with huge boards?",
    "Concurrent edits to canvas OBJECTS are merged with CRDTs (or OT) so all clients converge without conflicts or a central lock — each client applies local edits instantly (optimistic) and syncs operations via a realtime server (WebSocket). Presence (live cursors) is ephemeral pub-sub. For huge boards, only sync/render objects in the VIEWPORT (spatial culling). Persist the document; the multiplayer convergence + viewport scaling are the crux.",
    [
      { kind: "concept", heading: "Real-time multiplayer convergence",
        body: "Like Google Docs but for a CANVAS of objects (shapes, text, frames), many users edit simultaneously and must all converge to the same board with no lost edits or conflicts — without locking. Use CRDTs (Conflict-free Replicated Data Types) or OT (the Google-Docs design) over the document's objects: each edit is an OPERATION (create/move/style/delete an object); operations merge commutatively/deterministically so every client reaches the same state. Figma famously uses a CRDT-like model. This convergence is the heart of the system." },
      { kind: "concept", heading: "Optimistic local edits + sync",
        body: "For responsiveness, edits apply LOCALLY and INSTANTLY (optimistic — no round-trip wait), then sync to a realtime server (WebSocket) that relays them to other clients (and resolves order). The server is the sync hub + source of truth for persistence. Each client merges incoming remote operations into its local state. Low latency matters (it should feel instant), so the local-first + async-sync model is essential." },
      { kind: "concept", heading: "Presence (cursors)",
        body: "Beyond document edits, users see each other's LIVE CURSORS, selections, and who's online — PRESENCE. This is high-frequency, EPHEMERAL state (don't persist every cursor move): broadcast via pub-sub to others viewing the board (the Slack/presence pattern), throttled. Presence makes collaboration feel alive but is separate from the durable document state." },
      { kind: "concept", heading: "Scaling huge boards & follow-ups",
        body: "An infinite canvas can have thousands of objects — you can't sync/render them all. VIEWPORT culling: only load, sync deltas for, and render objects in (or near) the user's current VIEWPORT (spatial indexing — quadtree-like). Large boards are chunked/lazy-loaded. Rendering is GPU-accelerated client-side. Persist the document (object storage + an operation log for history/recovery). Follow-ups: 'CRDT vs OT trade-offs', 'offline editing then sync', 'undo in a shared doc', 'comments/branching'. Signal: CRDT/OT convergence of object operations (no lock) + optimistic local edits synced via WebSocket + ephemeral presence (cursors) pub-sub + viewport culling/spatial indexing for huge boards + persisted document+op-log.",
      },
    ],
    "A scaled collaborative whiteboard tests CRDT/OT convergence of canvas-object operations (no lock, no lost edits) with optimistic local edits synced via WebSocket, ephemeral presence (live cursors) over pub-sub, and viewport culling/spatial indexing to handle huge boards. It extends the Google-Docs design to a canvas; convergence + viewport scaling are the crux.",
    ["Using a lock / last-write-wins instead of CRDT/OT convergence of concurrent object edits.",
     "Waiting for a server round-trip per edit instead of optimistic local-first edits.",
     "Loading/syncing all objects on a huge board instead of viewport culling/spatial indexing."],
    0.6, { type: "Collaborative canvas", description: "Edits = operations on canvas objects → applied LOCALLY instantly (optimistic) → synced via WebSocket → merged via CRDT/OT (converge, no lock/no lost edits). Presence (live cursors) = ephemeral pub-sub (throttled). Huge boards: viewport culling + spatial index. Document + op-log persisted.", alt: "Collaborative whiteboard: CRDT-merged object edits, optimistic local-first, with presence and viewport culling." }),

  T("sysd_m23_t3", 3, "Design a Geospatial Database", "design-geospatial-database",
    ["case-study", "spatial-index", "r-tree", "geohash"],
    "Build a database engine specialized for LOCATION data: store points/lines/polygons and answer 'what's within this area?', 'nearest to me?', 'does this region intersect that one?' efficiently. Why do normal indexes fail, and what indexes space?",
    "Spatial queries (range/nearest/intersection over 2D coordinates) can't use a normal B-tree index (it orders one dimension; nearby points in 2D aren't adjacent in a 1D sort). Use SPATIAL INDEXES: R-TREES (bounding-box hierarchy — prune to overlapping regions), or GEOHASH/space-filling curves (encode 2D→1D preserving locality, usable in a standard index). These make spatial queries log-scale instead of full scans. Handle the earth's curvature for accurate distances.",
    [
      { kind: "concept", heading: "Why normal indexes fail",
        body: "Location data is inherently 2D (lat, lng) — sometimes more (lines, polygons). A normal B-TREE index orders ONE dimension; it can't efficiently answer 'points within this rectangle' or 'nearest neighbors' because points close in 2D space are NOT adjacent in a 1D sort (two nearby points can have very different latitudes). So spatial queries would degrade to full scans. You need an index that understands SPACE — the defining requirement of a geospatial DB." },
      { kind: "concept", heading: "R-trees (bounding-box hierarchy)",
        body: "An R-TREE indexes spatial objects by their bounding boxes, grouped hierarchically: each node covers a minimum bounding rectangle (MBR) enclosing its children. A query (e.g. 'within this area' or 'intersects this polygon') descends only into nodes whose MBR OVERLAPS the query region — pruning the rest (like the quadtree/interval-tree pruning idea). This gives log-scale spatial queries (range, intersection, nearest) and handles arbitrary shapes (lines, polygons), not just points. R-trees back PostGIS, spatial DBs." },
      { kind: "concept", heading: "Geohash / space-filling curves",
        body: "An alternative: encode 2D coordinates into a 1D key that PRESERVES LOCALITY — GEOHASH (base-32 prefix encoding where shared prefix ≈ proximity, the proximity-service idea) or space-filling curves (Hilbert/Z-order). Now nearby points have similar keys, so a STANDARD B-tree/sorted index works: 'nearby' = a key-range/prefix scan. Trade-off vs R-tree: simpler (uses ordinary indexes, great for KV stores like Redis GEO) but boundary cells and fixed precision need care. Both turn spatial queries into pruned/range lookups." },
      { kind: "concept", heading: "Distance, scale & follow-ups",
        body: "Accurate distance/area on the EARTH requires accounting for curvature (haversine / geodesic, not flat-plane Euclidean) and coordinate systems (WGS84). Common query types: range (within polygon/radius), k-nearest-neighbor, intersection/containment. Scale via sharding by region (and the proximity/Maps designs build on this). Follow-ups: 'R-tree vs geohash trade-offs', 'k-NN queries', 'moving objects (frequent updates)', 'PostGIS / spatial extensions'. Signal: spatial indexes (R-tree bounding-box hierarchy, or geohash/space-filling-curve over a normal index) make 2D range/nearest/intersection queries log-scale (normal B-trees can't) + earth-curvature distance; the engine behind maps/proximity/GIS.",
    },
    ],
    "A geospatial DB tests indexing 2D location data: normal B-trees fail (1D ordering doesn't preserve 2D proximity), so use R-trees (bounding-box hierarchy, prune to overlapping regions — handles polygons) or geohash/space-filling curves (encode 2D→1D preserving locality, usable in a normal index) to make range/nearest/intersection queries log-scale, plus earth-curvature distance. It underpins maps/proximity/GIS.",
    ["Using a normal B-tree for 2D location data (it can't preserve 2D proximity in a 1D order).",
     "Not knowing R-trees (bounding-box hierarchy) or geohash/space-filling curves as the spatial indexes.",
     "Using flat Euclidean distance instead of earth-curvature (haversine/geodesic) for accuracy."],
    0.6, { type: "Spatial index", description: "Normal B-tree fails (1D order ≠ 2D proximity). Spatial indexes: R-TREE = bounding-box hierarchy, query descends only into overlapping MBRs (range/nearest/intersection, handles polygons). GEOHASH / space-filling curve = encode 2D→1D preserving locality → use a normal index (prefix/range scan). Earth-curvature distance.", alt: "Geospatial DB: R-tree bounding-box hierarchy and geohash encoding for log-scale spatial queries." }),

  T("sysd_m23_t4", 4, "Design a Blockchain / Distributed Ledger", "design-blockchain",
    ["case-study", "consensus", "immutability", "decentralization"],
    "Design a decentralized ledger (blockchain) where many mutually-distrusting parties agree on a shared, tamper-proof transaction history with NO central authority. What makes it tamper-evident, and how do strangers agree on the truth?",
    "Transactions are grouped into BLOCKS, each containing the HASH of the previous block — forming a CHAIN where altering any past block breaks all subsequent hashes (tamper-evident immutability). With no central authority, distributed nodes reach agreement via a CONSENSUS mechanism (Proof of Work / Proof of Stake) on which block extends the chain — making it expensive to rewrite history. It's decentralized + immutable + consensus, trading efficiency for trustless agreement.",
    [
      { kind: "concept", heading: "The chain of blocks (immutability)",
        body: "Transactions are batched into BLOCKS. Each block stores the cryptographic HASH of the PREVIOUS block (plus its own transactions, via a Merkle tree). This creates a CHAIN: because each block's hash depends on the prior, changing any historical transaction changes that block's hash, which invalidates the next block's stored hash, and every block after — so tampering is immediately DETECTABLE (and requires redoing all subsequent blocks). This hash-chaining gives tamper-evident immutability — the same idea as the audit-log's hash chain, applied to a shared ledger." },
      { kind: "concept", heading: "Decentralization (no central authority)",
        body: "The defining property: there's NO central server/authority. Many independent NODES each hold a copy of the ledger and validate transactions. Mutually-distrusting parties must agree on a single shared truth without a trusted coordinator. This is what makes it fundamentally different from (and far more complex/expensive than) a normal database — and the reason consensus is needed. (For most systems, a normal database is the right answer; blockchain is for trustless, decentralized scenarios.)" },
      { kind: "concept", heading: "Consensus (agreeing on truth)",
        body: "Without a leader, nodes use a CONSENSUS mechanism to agree on which new block extends the chain and prevent double-spending. PROOF OF WORK (Bitcoin): nodes ('miners') expend large computation to find a valid block; the longest valid chain wins — rewriting history would require out-computing the whole network (economically infeasible). PROOF OF STAKE (Ethereum): validators stake collateral and are chosen to propose/attest blocks; misbehavior is slashed (energy-efficient). Both make it costly to attack and let strangers converge on one history. This is the heart — Byzantine fault-tolerant agreement among untrusting parties." },
      { kind: "concept", heading: "Trade-offs & follow-ups",
        body: "Blockchain trades EFFICIENCY for trustless decentralization: low throughput, high latency, and (PoW) huge energy cost vs a centralized DB. The 'blockchain trilemma' balances decentralization, security, scalability. Public (permissionless) vs PRIVATE/permissioned (known participants, faster consensus — for supply-chain/enterprise, the track-and-trace design). Smart contracts add programmable logic. Follow-ups: 'when NOT to use blockchain (usually — a DB suffices)', 'PoW vs PoS', '51% attack', 'scalability (L2/sharding)', 'public vs permissioned'. Signal: hash-chained blocks (tamper-evident immutability) + decentralized nodes (no authority) + consensus (PoW/PoS) for trustless agreement among distrusting parties; trades efficiency for decentralization (use a DB unless you truly need trustlessness).",
      },
    ],
    "A blockchain tests trustless decentralization: hash-chained blocks (altering history breaks all subsequent hashes — tamper-evident immutability), decentralized nodes with no central authority, and a consensus mechanism (PoW/PoS) so mutually-distrusting parties agree on one history (making rewrites economically infeasible). It trades efficiency for trustlessness — a normal DB is right unless you genuinely need decentralization.",
    ["Treating it as a faster database — blockchain trades efficiency for trustless decentralization (usually a DB is better).",
     "Missing hash-chaining (each block references the prior) as the immutability/tamper-evidence mechanism.",
     "Ignoring consensus (PoW/PoS) as how distrusting nodes agree on history without a central authority."],
    0.7, { type: "Blockchain", description: "Transactions → blocks; each block stores the HASH of the previous (chain) → altering history breaks all later hashes (tamper-evident). No central authority: distributed nodes agree via CONSENSUS (Proof of Work / Proof of Stake) on the next block → trustless agreement, rewriting history is infeasible. Trades efficiency for decentralization.", alt: "Blockchain: hash-chained blocks agreed by decentralized consensus (PoW/PoS), tamper-evident." }),

  T("sysd_m23_t5", 5, "Design an ETL / Data Pipeline Orchestration Platform", "design-etl-orchestration",
    ["case-study", "dag", "scheduling", "lineage"],
    "Build Airflow/Dagster: define, schedule, and reliably run complex data pipelines (many interdependent jobs that extract, transform, and load data) across a fleet of workers. What structures a pipeline, and how do you make runs reliable and observable?",
    "A pipeline is a DAG of TASKS with dependencies; a SCHEDULER triggers runs (on a schedule or event) and dispatches ready tasks (deps satisfied) to a pool of WORKERS, in topological order. Reliability: persist run STATE (resume/retry on failure — idempotent tasks), backfills, and SLAs. Observability: track each run's status, logs, and DATA LINEAGE. It's the workflow-engine pattern specialized for data, with scheduling + lineage + backfills.",
    [
      { kind: "concept", heading: "Pipeline as a DAG of tasks",
        body: "A data pipeline is modeled as a DIRECTED ACYCLIC GRAPH of TASKS: extract from sources → transform/clean → load to warehouse/lake, with dependencies (a task runs only after its upstreams complete). This is the workflow-engine / build-system DAG idea specialized for DATA workflows. The platform lets you DEFINE pipelines as code (declarative DAGs) and the engine handles ordering, parallelism, and execution." },
      { kind: "concept", heading: "Scheduling & dispatch",
        body: "A SCHEDULER triggers pipeline runs — on a CRON schedule (nightly ETL — the cron design), or event-driven (data arrived, upstream finished). For each run, it computes which tasks are READY (dependencies satisfied) and dispatches them to a pool of WORKERS (executors — local, Celery, Kubernetes pods), running independent tasks in PARALLEL and respecting the DAG order. This scheduler + worker-pool (Producer-Consumer) is the execution core, scaling out across the fleet." },
      { kind: "concept", heading: "Reliability: state, retries, backfills",
        body: "Pipelines fail (bad data, transient errors, worker death), so reliability is central: PERSIST each run's task STATE so a failure RESUMES from the failed task (not from scratch — the workflow-engine durability), RETRY failed tasks with backoff, and make tasks IDEMPOTENT (a re-run mustn't double-load data). BACKFILLS re-run a pipeline over historical date ranges (e.g. reprocess last month). Watch for the data-specific concern: a task processing a date 'partition' should be idempotent so reruns/backfills are safe." },
      { kind: "concept", heading: "Observability & lineage — follow-ups",
        body: "Operators need VISIBILITY: per-run/per-task STATUS (success/failed/running), LOGS, durations, and ALERTS on failure/SLA miss. Crucially, DATA LINEAGE — which datasets a pipeline reads/writes and how data flows — for debugging, impact analysis, and governance (ties to the catalog/data-lake). Follow-ups: 'Airflow (task-centric) vs Dagster (asset/data-centric)', 'idempotency & backfills', 'sensors/event triggers', 'data quality checks in-pipeline'. Signal: pipeline = task DAG + scheduler (cron/event) dispatching ready tasks to a worker pool (topological, parallel) + reliability (persisted state/resume, retries, idempotent tasks, backfills) + observability (status/logs/lineage); the workflow engine for data.",
      },
    ],
    "An ETL orchestration platform tests the workflow-engine pattern for data: pipelines as task DAGs, a scheduler (cron/event) dispatching ready tasks to a worker pool in topological order, reliability (persisted run state for resume, retries, idempotent tasks, backfills over historical ranges), and observability (status/logs/data lineage). Idempotency + backfills + lineage are the data-specific concerns.",
    ["No DAG/dependency model or scheduler — just ad-hoc scripts that can't resume or parallelize.",
     "Non-idempotent tasks that double-load data on retries/backfills.",
     "Ignoring observability/lineage — can't debug failures or trace data flow."],
    0.5, { type: "Data orchestration", description: "Pipeline = task DAG (extract → transform → load). Scheduler (cron/event) → dispatch ready tasks to worker pool (topological, parallel). Persist run state → resume/retry on failure; idempotent tasks → safe backfills over date ranges. Track status/logs/data lineage.", alt: "ETL orchestration: a task DAG scheduled to a worker pool with resumable state and lineage." }),

  T("sysd_m23_t6", 6, "Design a Quota / Usage-Metering Service", "design-quota-metering",
    ["case-study", "counters", "rate-limiting", "billing"],
    "Build the service that enforces usage quotas/limits and meters consumption for billing across a platform (API calls, storage, compute) for millions of accounts. How do you check limits fast on the hot path AND meter accurately for billing?",
    "Split fast ENFORCEMENT from accurate METERING. ENFORCE limits on the hot path with a fast distributed counter store (Redis — atomic increment + check, like the rate-limiter) for low-latency allow/deny per account. METER every usage event accurately into a durable, aggregated pipeline (the ad-click-aggregator style) for billing — eventually consistent but exact (idempotent, reconciled). Enforcement favors speed/availability; metering favors accuracy. Tiers/plans define limits.",
    [
      { kind: "concept", heading: "Two different jobs",
        body: "A quota/metering service does two things with different requirements: (1) ENFORCEMENT — on the request hot path, quickly decide 'is this account within its quota?' (allow/deny) with LOW LATENCY; (2) METERING — accurately record consumption for BILLING and reporting, where correctness matters most (it's money) but latency doesn't. Conflating them is the mistake; they're optimized oppositely (speed vs accuracy), so design them as separate (but reconciled) paths." },
      { kind: "concept", heading: "Fast enforcement",
        body: "Enforcement must be fast and not block requests. Use a fast distributed counter store (Redis) keyed per account+resource+window: atomically INCREMENT and check against the account's limit (the rate-limiter / distributed-counter designs) — allow if under, deny (429/quota-exceeded) if over. It must be highly available (a quota check shouldn't take down the API) — favor availability/speed, accepting slight over/under-counting at the edges (fail-open or fail-closed per policy). Limits come from the account's PLAN/tier." },
      { kind: "concept", heading: "Accurate metering for billing",
        body: "Separately, every usage EVENT (API call, bytes stored, compute-seconds) is METERED into a durable pipeline: emit events → aggregate per account per period (the ad-click-aggregator / streaming pattern) → rollups that feed BILLING (the subscription-billing design). This path prioritizes ACCURACY (idempotent/deduped events — you're charging real money; reconcile against source-of-truth) over latency; it's eventually consistent. Customer usage dashboards read these aggregates." },
      { kind: "concept", heading: "Plans, reset & follow-ups",
        body: "Quotas are defined by PLANS/entitlements (free: 1000 calls/day; pro: 1M) and reset per window (daily/monthly) or are soft (overage billing) vs hard (block). Handle multi-resource quotas, burst allowances (token bucket), and grace. Follow-ups: 'enforcement consistency vs availability (distributed counter sync)', 'metering accuracy/dedup', 'soft vs hard limits', 'integration with billing'. Signal: separate fast enforcement (distributed counter, allow/deny, available) from accurate async metering (event aggregation → billing, idempotent/reconciled) + plan-defined limits; speed vs accuracy split.",
      },
    ],
    "A quota/metering service tests splitting fast ENFORCEMENT (distributed counter — atomic allow/deny on the hot path, favors availability/speed) from accurate METERING (async usage-event aggregation feeding billing, favors correctness, idempotent/reconciled). Plans define limits; conflating the two paths is the mistake. It composes the rate-limiter, distributed-counter, and billing designs.",
    ["Using one path for both — enforcement needs speed/availability, metering needs accuracy (split them).",
     "Slow/blocking quota checks on the hot path instead of a fast distributed counter.",
     "Inaccurate/non-idempotent metering feeding billing (it's real money — must be exact + reconciled)."],
    0.5, { type: "Quota + metering", description: "ENFORCE (hot path): fast distributed counter (Redis) per account/resource → atomic increment + check vs plan limit → allow/deny (available, low-latency). METER (async): every usage event → aggregate per account/period → rollups → billing (accurate, idempotent, reconciled). Plans define limits.", alt: "Quota/metering: fast distributed-counter enforcement plus accurate async usage metering for billing." }),

  T("sysd_m23_t7", 7, "Design an Anomaly Detection System", "design-anomaly-detection",
    ["case-study", "streaming", "baselines", "alerting"],
    "Build a system that detects anomalies in real-time metrics/streams (fraud spikes, outages, unusual behavior) and alerts — across thousands of signals. Why are static thresholds insufficient, and how do you avoid alert fatigue?",
    "Stream metrics/events through a processing layer that compares each against a learned BASELINE of 'normal' (statistical: moving average + standard deviation / seasonality models / ML), flagging significant DEVIATIONS — adaptive, not static thresholds (which miss context and cause noise). Detection feeds an ALERTING layer that DEDUPLICATES/groups and prioritizes to avoid fatigue. Balance sensitivity (catch real anomalies) vs false positives. It's streaming + baselines + smart alerting.",
    [
      { kind: "concept", heading: "Why static thresholds fail",
        body: "A naive 'alert if metric > X' STATIC threshold is brittle: it ignores normal variation (traffic is high at noon, low at night — SEASONALITY), differs per signal (one threshold won't fit thousands of metrics), and produces both false alarms (normal spikes) and misses (a 'within threshold' value that's abnormal for that context). Real anomaly detection needs to learn what's NORMAL for each signal and flag deviations from THAT — adaptive, context-aware detection." },
      { kind: "concept", heading: "Streaming + baselines",
        body: "Ingest the metric/event STREAM (the streaming/metrics designs — Kafka + stream processor) and, per signal, maintain a BASELINE of normal behavior: statistical (moving average + standard deviation → flag values N sigma out), seasonal models (account for daily/weekly patterns — Holt-Winters/Prophet), or ML (forecasting / clustering / autoencoders for complex patterns). Compare each new value to its expected range; a significant DEVIATION = a candidate anomaly. Baselines update over time (concept drift — the MLOps idea). This per-signal adaptive comparison is the detection core." },
      { kind: "concept", heading: "Alerting without fatigue (the crux)",
        body: "Detecting anomalies is only useful if alerts are ACTIONABLE. With thousands of signals, naive alerting causes ALERT FATIGUE (responders ignore a flood). So the alerting layer must: DEDUPLICATE and GROUP related anomalies (one incident, not 50 alerts — the monitoring design), CORRELATE (a root cause manifests across many metrics), suppress during known maintenance, and PRIORITIZE by severity. Require sustained/confirmed deviation (not a single blip) before alerting. This is the same false-positive-vs-negative trade as monitoring/fraud — tune sensitivity." },
      { kind: "concept", heading: "Feedback & follow-ups",
        body: "A FEEDBACK loop improves it: operators mark alerts as true/false → retrain/tune thresholds (reduce noise over time). Detection runs real-time (streaming) and/or batch. Follow-ups: 'univariate vs multivariate anomalies', 'seasonality handling', 'cold start (new signal, no baseline)', 'root-cause correlation', 'detection vs alerting separation'. Signal: stream signals → per-signal adaptive baselines (statistical/seasonal/ML, not static thresholds) → flag deviations → alerting with dedup/grouping/correlation/prioritization (anti-fatigue) + feedback loop; sensitivity vs false-positive trade.",
      },
    ],
    "Anomaly detection tests adaptive, per-signal baselines (statistical/seasonal/ML — not brittle static thresholds) over a streaming pipeline to flag deviations, feeding an alerting layer that deduplicates/groups/correlates/prioritizes to avoid fatigue, with a feedback loop to tune. The sensitivity-vs-false-positive balance is the crux; it composes the streaming, metrics, and fraud designs.",
    ["Static per-metric thresholds (ignore seasonality/context — false alarms + misses) instead of learned baselines.",
     "Alerting on every deviation/blip — alert fatigue; must dedup/group/correlate/prioritize.",
     "No feedback loop or baseline updates (concept drift) to reduce noise over time."],
    0.6, { type: "Anomaly detection", description: "Signals stream → per-signal BASELINE of normal (moving avg + stddev / seasonal / ML, adaptive) → flag significant deviations (not static thresholds). → Alerting: dedup/group/correlate/prioritize (anti-fatigue), require sustained deviation. Feedback (true/false) tunes sensitivity.", alt: "Anomaly detection: adaptive per-signal baselines flagging deviations into deduplicated, prioritized alerts." }),

  T("sysd_m23_t8", 8, "Design an Inbound Webhook Ingestion Gateway", "design-webhook-ingestion",
    ["case-study", "ingestion", "verification", "async"],
    "Build the system that RECEIVES webhooks from many third parties (Stripe, GitHub, etc.) — verifying authenticity, never losing events, and absorbing bursts — then routes them to internal consumers. This is the inbound counterpart to webhook DELIVERY. What are the receiving-end challenges?",
    "Expose endpoints that VERIFY each incoming webhook (HMAC signature → reject forgeries) and quickly ACK (200) after durably ENQUEUEING it — process ASYNCHRONOUSLY (don't do work in the request, or you'll time out / drop events under bursts). Because senders retry, expect DUPLICATES → DEDUPLICATE by event id (idempotency). Absorb bursts with a queue, handle ordering/out-of-order, and route events to internal consumers. It's verify + durable-enqueue + async-process + dedupe.",
    [
      { kind: "concept", heading: "Receive, verify, ack-fast",
        body: "You expose HTTP endpoints that third parties POST webhooks to (events: payment succeeded, PR opened). First, VERIFY authenticity: check the HMAC SIGNATURE (using the shared secret) so an attacker can't forge events — reject invalid ones (this is the receiving counterpart to the webhook-delivery design's signing). Then ACKNOWLEDGE quickly (return 200) — but ONLY after durably storing the event. Senders impose tight timeouts and treat slow/non-200 as failure (and retry), so you must respond fast." },
      { kind: "concept", heading: "Durable enqueue + async processing (the crux)",
        body: "The cardinal rule: DON'T do real processing inside the webhook request. Instead, immediately and DURABLY ENQUEUE the raw event (to a queue/log — the MQ design) and return 200; process it ASYNCHRONOUSLY with workers. Why: processing might be slow (timeout → sender thinks it failed → retries → duplicates/load) or fail (you'd lose the event). Durable-enqueue-then-ack guarantees you never lose an accepted event and can absorb processing spikes. This receive-fast / process-async split is the heart of inbound webhook handling." },
      { kind: "concept", heading: "Idempotency (duplicates are guaranteed)",
        body: "Senders RETRY on any perceived failure (timeout, 5xx, network blip) and many guarantee only at-least-once — so you WILL receive DUPLICATE events. Every consumer must be IDEMPOTENT: dedupe by the event's unique ID (track processed ids; ignore repeats). Don't assume exactly-once. (Also: a duplicate can arrive even after you processed it but your 200 was lost.) Idempotent processing is non-negotiable on the receiving end." },
      { kind: "concept", heading: "Bursts, ordering & follow-ups",
        body: "Webhooks arrive in BURSTS (a sender replays its backlog, or a mass event) — the queue + horizontally-scaled stateless receivers absorb this. Events may arrive OUT OF ORDER (don't assume order; use event timestamps/versions, or process per-entity ordering if needed). Route validated events to the right internal consumers (a topic/pub-sub fan-out). Follow-ups: 'replay/dead-letter for failed processing', 'per-source rate handling', 'storing raw payloads for audit/reprocessing', 'ordering guarantees'. Signal: signature verification (reject forgeries) + durable enqueue then fast 200 ack + async worker processing + idempotent dedup by event id (at-least-once) + queue to absorb bursts + handle out-of-order; the inbound counterpart to webhook delivery.",
      },
    ],
    "An inbound webhook gateway tests the receiving end: verify each event's HMAC signature (reject forgeries), durably ENQUEUE then ack 200 FAST (never process in-request — timeouts cause retries/loss), process async with workers, and dedupe by event id (senders retry → at-least-once → duplicates guaranteed). A queue absorbs bursts; expect out-of-order. It's the inbound counterpart to webhook delivery.",
    ["Processing the webhook inside the request (timeouts → sender retries → duplicates / lost events).",
     "Not verifying the signature (accepting forged events) or not deduping by event id (at-least-once → duplicates).",
     "Assuming exactly-once / in-order delivery, or no queue to absorb sender retry bursts."],
    0.5, { type: "Webhook ingestion", description: "3rd party → POST webhook → VERIFY HMAC signature (reject forgeries) → durably ENQUEUE raw event → return 200 FAST. Async workers process (idempotent — dedupe by event id, since senders retry = at-least-once). Queue absorbs bursts; expect out-of-order; route to internal consumers; dead-letter on failure.", alt: "Inbound webhook gateway: verify, durably enqueue, fast-ack, then async idempotent processing." }),
];

const EXERCISES = [
  // Data lake
  pm({ topicId: "sysd_m23_t1", exerciseId: "sysd_m23_t1_pm_1", position: 1, level: "medium", title: "Lake vs warehouse",
    scenario: "A data lake differs from a warehouse in that it…",
    options: ["Stores all raw data (any format) in cheap object storage with schema-on-read", "Requires a rigid schema upfront", "Only stores structured tables", "Can't scale"], correct: "Stores all raw data (any format) in cheap object storage with schema-on-read",
    explanation: "Schema-on-read over cheap object storage is flexible (all data types, decide structure at query time)." }),
  pm({ topicId: "sysd_m23_t1", exerciseId: "sysd_m23_t1_pm_2", position: 2, level: "hard", title: "Lakehouse",
    scenario: "A lakehouse adds warehouse-grade reliability to the lake via…",
    options: ["Open table formats (Iceberg/Delta) — ACID, schema evolution, time travel", "A bigger server", "Deleting the lake", "Schema-on-write"], correct: "Open table formats (Iceberg/Delta) — ACID, schema evolution, time travel",
    explanation: "Table formats layer a transaction/metadata log over the files for ACID, evolution, and time travel." }),
  pm({ topicId: "sysd_m23_t1", exerciseId: "sysd_m23_t1_pm_3", position: 3, level: "medium", title: "The risk",
    scenario: "Without governance, a data lake becomes…",
    options: ["A 'data swamp' (unreliable, undiscoverable) — needs a catalog/governance", "A warehouse", "Faster", "Read-only"], correct: "A 'data swamp' (unreliable, undiscoverable) — needs a catalog/governance",
    explanation: "No schema enforcement/catalog → an unusable swamp; a catalog + table formats prevent it." }),
  // Collaborative whiteboard
  pm({ topicId: "sysd_m23_t2", exerciseId: "sysd_m23_t2_pm_1", position: 1, level: "hard", title: "Converge edits",
    scenario: "Concurrent edits to the canvas converge without conflicts via…",
    options: ["CRDTs (or OT) merging object operations — no lock", "A document lock", "Last-write-wins on the whole board", "Manual conflict resolution"], correct: "CRDTs (or OT) merging object operations — no lock",
    explanation: "CRDT/OT merge concurrent operations deterministically so all clients converge (the Google-Docs idea for a canvas)." }),
  pm({ topicId: "sysd_m23_t2", exerciseId: "sysd_m23_t2_pm_2", position: 2, level: "medium", title: "Feel instant",
    scenario: "To feel instant, edits are…",
    options: ["Applied locally immediately (optimistic), then synced via WebSocket", "Sent to the server and awaited each time", "Batched nightly", "Polled"], correct: "Applied locally immediately (optimistic), then synced via WebSocket",
    explanation: "Optimistic local-first edits avoid round-trip latency; sync/merge happens asynchronously." }),
  pm({ topicId: "sysd_m23_t2", exerciseId: "sysd_m23_t2_pm_3", position: 3, level: "medium", title: "Huge boards",
    scenario: "A board with thousands of objects stays fast by…",
    options: ["Viewport culling / spatial indexing (only sync+render visible objects)", "Loading everything", "Limiting boards to 10 objects", "Rendering on the server"], correct: "Viewport culling / spatial indexing (only sync+render visible objects)",
    explanation: "Only objects in/near the viewport are loaded, synced, and rendered (spatial index over the canvas)." }),
  // Geospatial DB
  pm({ topicId: "sysd_m23_t3", exerciseId: "sysd_m23_t3_pm_1", position: 1, level: "hard", title: "Why normal index fails",
    scenario: "A normal B-tree can't index 2D location data well because…",
    options: ["1D ordering doesn't preserve 2D proximity (nearby points aren't adjacent in the sort)", "It can't store numbers", "It's too slow to write", "Coordinates are strings"], correct: "1D ordering doesn't preserve 2D proximity (nearby points aren't adjacent in the sort)",
    explanation: "Spatial queries need an index that understands space; a 1D B-tree order separates nearby 2D points." }),
  pm({ topicId: "sysd_m23_t3", exerciseId: "sysd_m23_t3_pm_2", position: 2, level: "hard", title: "Spatial indexes",
    scenario: "Spatial queries are made log-scale by…",
    options: ["R-trees (bounding-box hierarchy) or geohash/space-filling curves", "Sorting by latitude only", "A hash of coordinates", "Full scans"], correct: "R-trees (bounding-box hierarchy) or geohash/space-filling curves",
    explanation: "R-trees prune by overlapping bounding boxes; geohash encodes 2D→1D preserving locality for a normal index." }),
  pm({ topicId: "sysd_m23_t3", exerciseId: "sysd_m23_t3_pm_3", position: 3, level: "medium", title: "Distance",
    scenario: "Accurate distance over the earth uses…",
    options: ["Curvature-aware (haversine/geodesic), not flat Euclidean", "Flat-plane Euclidean only", "Pixel distance", "Manhattan distance"], correct: "Curvature-aware (haversine/geodesic), not flat Euclidean",
    explanation: "The earth is curved; haversine/geodesic gives correct distances (and use the right coordinate system)." }),
  // Blockchain
  pm({ topicId: "sysd_m23_t4", exerciseId: "sysd_m23_t4_pm_1", position: 1, level: "hard", title: "Tamper-evidence",
    scenario: "A blockchain is tamper-evident because…",
    options: ["Each block stores the hash of the previous → altering history breaks all later hashes", "It's encrypted", "It's stored offline", "It uses a password"], correct: "Each block stores the hash of the previous → altering history breaks all later hashes",
    explanation: "Hash-chaining means changing any past block invalidates every subsequent block's hash — detectable." }),
  pm({ topicId: "sysd_m23_t4", exerciseId: "sysd_m23_t4_pm_2", position: 2, level: "hard", title: "Agree on truth",
    scenario: "With no central authority, distrusting nodes agree on the chain via…",
    options: ["A consensus mechanism (Proof of Work / Proof of Stake)", "A trusted server", "Voting by email", "First-come ordering"], correct: "A consensus mechanism (Proof of Work / Proof of Stake)",
    explanation: "PoW/PoS make extending the chain costly so attackers can't cheaply rewrite history; nodes converge on one truth." }),
  pm({ topicId: "sysd_m23_t4", exerciseId: "sysd_m23_t4_pm_3", position: 3, level: "medium", title: "When to use",
    scenario: "Blockchain is appropriate when…",
    options: ["You truly need trustless decentralization (else a normal DB is better — it's far more efficient)", "You want a faster database", "You need a cache", "Always"], correct: "You truly need trustless decentralization (else a normal DB is better — it's far more efficient)",
    explanation: "Blockchain trades efficiency for decentralization; for most systems a centralized DB is the right choice." }),
  // ETL orchestration
  pm({ topicId: "sysd_m23_t5", exerciseId: "sysd_m23_t5_pm_1", position: 1, level: "medium", title: "Pipeline shape",
    scenario: "A data pipeline is modeled as…",
    options: ["A DAG of tasks with dependencies, run in topological order", "A single script", "A random order", "A flat list always sequential"], correct: "A DAG of tasks with dependencies, run in topological order",
    explanation: "Extract→transform→load tasks form a dependency DAG; the scheduler runs ready tasks in order (parallelizing)." }),
  pm({ topicId: "sysd_m23_t5", exerciseId: "sysd_m23_t5_pm_2", position: 2, level: "hard", title: "Survive failure",
    scenario: "A pipeline failure should…",
    options: ["Resume from the failed task (persisted run state) with retries; tasks idempotent", "Restart from scratch", "Be ignored", "Skip the rest silently"], correct: "Resume from the failed task (persisted run state) with retries; tasks idempotent",
    explanation: "Persisted run state enables resume; idempotent tasks make retries/backfills safe (no double-load)." }),
  pm({ topicId: "sysd_m23_t5", exerciseId: "sysd_m23_t5_pm_3", position: 3, level: "medium", title: "Backfill safety",
    scenario: "Re-running a pipeline over historical dates (backfill) is safe only if tasks are…",
    options: ["Idempotent (a rerun doesn't duplicate data)", "Fast", "Stateless of data", "Run once ever"], correct: "Idempotent (a rerun doesn't duplicate data)",
    explanation: "Backfills/reruns require idempotent tasks so reprocessing a partition doesn't double-load it." }),
  // Quota / metering
  pm({ topicId: "sysd_m23_t6", exerciseId: "sysd_m23_t6_pm_1", position: 1, level: "hard", title: "Two paths",
    scenario: "Quota enforcement and usage metering should be…",
    options: ["Separated — enforcement favors speed/availability, metering favors accuracy", "The same single path", "Both done nightly", "Both on the client"], correct: "Separated — enforcement favors speed/availability, metering favors accuracy",
    explanation: "Enforcement is fast allow/deny (distributed counter); metering is accurate async aggregation for billing." }),
  pm({ topicId: "sysd_m23_t6", exerciseId: "sysd_m23_t6_pm_2", position: 2, level: "medium", title: "Fast check",
    scenario: "On the hot path, a quota check uses…",
    options: ["A fast distributed counter (atomic increment + check vs limit)", "A nightly batch", "A relational JOIN", "A full scan of usage"], correct: "A fast distributed counter (atomic increment + check vs limit)",
    explanation: "Redis-style atomic increment+check gives low-latency allow/deny (the rate-limiter/distributed-counter pattern)." }),
  pm({ topicId: "sysd_m23_t6", exerciseId: "sysd_m23_t6_pm_3", position: 3, level: "medium", title: "Metering for billing",
    scenario: "Usage metering for billing must be…",
    options: ["Accurate and idempotent (deduped, reconciled — it's real money)", "Approximate is fine always", "Done on the hot path synchronously", "Skipped"], correct: "Accurate and idempotent (deduped, reconciled — it's real money)",
    explanation: "Billing requires exact, deduplicated, reconciled usage aggregates (eventually consistent is fine, inaccurate isn't)." }),
  // Anomaly detection
  pm({ topicId: "sysd_m23_t7", exerciseId: "sysd_m23_t7_pm_1", position: 1, level: "hard", title: "Why not static",
    scenario: "Static thresholds are insufficient for anomaly detection because…",
    options: ["They ignore seasonality/context and don't fit thousands of varied signals (false alarms + misses)", "They're too slow", "They use too much memory", "They can't store numbers"], correct: "They ignore seasonality/context and don't fit thousands of varied signals (false alarms + misses)",
    explanation: "Normal varies by time/signal; adaptive per-signal baselines flag deviations from learned normal." }),
  pm({ topicId: "sysd_m23_t7", exerciseId: "sysd_m23_t7_pm_2", position: 2, level: "medium", title: "Detection",
    scenario: "Anomalies are detected by comparing each value to…",
    options: ["A learned baseline of normal (moving avg+stddev / seasonal / ML)", "A fixed number", "The previous value only", "Random chance"], correct: "A learned baseline of normal (moving avg+stddev / seasonal / ML)",
    explanation: "Per-signal adaptive baselines (statistical/seasonal/ML) flag significant deviations as candidate anomalies." }),
  pm({ topicId: "sysd_m23_t7", exerciseId: "sysd_m23_t7_pm_3", position: 3, level: "hard", title: "Avoid fatigue",
    scenario: "To avoid alert fatigue across thousands of signals, alerting must…",
    options: ["Deduplicate/group/correlate/prioritize (and require sustained deviation)", "Alert on every blip", "Disable alerts", "Email everyone"], correct: "Deduplicate/group/correlate/prioritize (and require sustained deviation)",
    explanation: "One incident not 50 alerts; correlate root causes, prioritize severity, and require confirmed deviation." }),
  // Webhook ingestion
  pm({ topicId: "sysd_m23_t8", exerciseId: "sysd_m23_t8_pm_1", position: 1, level: "hard", title: "The cardinal rule",
    scenario: "On receiving a webhook you should…",
    options: ["Verify signature, durably enqueue, then ack 200 FAST — process async", "Do all processing in the request before responding", "Return 200 immediately and forget it", "Process synchronously and hope it's fast"], correct: "Verify signature, durably enqueue, then ack 200 FAST — process async",
    explanation: "In-request processing risks timeouts (→ sender retries/duplicates) and loss; durable-enqueue-then-ack is safe." }),
  pm({ topicId: "sysd_m23_t8", exerciseId: "sysd_m23_t8_pm_2", position: 2, level: "medium", title: "Authenticity",
    scenario: "To ensure a webhook really came from the claimed sender, you…",
    options: ["Verify its HMAC signature (reject forgeries)", "Trust the source IP", "Trust the payload", "Check the time of day"], correct: "Verify its HMAC signature (reject forgeries)",
    explanation: "HMAC signature verification (shared secret) prevents accepting forged events." }),
  pm({ topicId: "sysd_m23_t8", exerciseId: "sysd_m23_t8_pm_3", position: 3, level: "medium", title: "Duplicates",
    scenario: "Because senders retry (at-least-once), consumers must…",
    options: ["Be idempotent — dedupe by event id", "Assume exactly-once", "Process duplicates fully", "Reject all retries"], correct: "Be idempotent — dedupe by event id",
    explanation: "Retries guarantee duplicate deliveries; dedupe by the event's unique id and process idempotently." }),
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
  console.log(`\nDone — M23 Data & Platform Infra seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
