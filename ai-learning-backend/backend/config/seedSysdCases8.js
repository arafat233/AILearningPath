/**
 * Seed — System Design module M13: Case Studies VIII (more large-scale designs):
 * CDN, Log Aggregation (ELK), Time-Series DB, Workflow/Task Engine,
 * Data Warehouse/OLAP, Media Processing Pipeline, Secrets Manager,
 * Multi-Region Database. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases8.js   ·   npm: npm run seed:sysd-cases8
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m13";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 13,
  name: "Case Studies VIII — More Systems", slug: "case-studies-8",
  description: "Eight more large-scale designs: a CDN, a log-aggregation system, a time-series database, a workflow/task engine, a data warehouse, a media-processing pipeline, a secrets manager, and a multi-region database.",
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
  T("sysd_m13_t1", 1, "Design a CDN", "design-cdn",
    ["case-study", "edge-caching", "distribution", "invalidation"],
    "Build a Content Delivery Network: serve static assets (images, JS, video) to users worldwide with low latency, offloading the origin. How does a user reach the nearest copy, and how does content get there and get invalidated?",
    "Push content to EDGE servers (PoPs) geographically near users; route each user to the nearest healthy edge (via anycast / DNS-based routing). Edges CACHE content (pull-through on first miss, or pushed); a cache miss fetches from origin (with origin shielding to prevent stampedes). Invalidation (purge/versioned URLs) keeps content fresh. Latency comes from proximity + caching.",
    [
      { kind: "concept", heading: "Edge servers near users",
        body: "The core idea: replicate content to many EDGE servers (Points of Presence) spread across the globe, so a user fetches from a server physically NEAR them instead of a distant origin — cutting latency (speed of light is real) and offloading the origin. The CDN is essentially a globally-distributed cache layer in front of your origin." },
      { kind: "concept", heading: "Routing to the nearest edge",
        body: "Direct each user to the best edge: ANYCAST (the same IP announced from many PoPs; the network routes to the nearest) or DNS-based geo/latency routing (the DNS resolver returns the closest edge's IP). The routing also avoids unhealthy/overloaded edges (load + health aware). This 'find the closest healthy copy' step is what makes the CDN fast." },
      { kind: "concept", heading: "Populating the cache",
        body: "Two models: PULL (lazy) — on the first request for an asset, the edge has a cache MISS, fetches from origin, caches it (with a TTL), and serves subsequent hits locally; or PUSH — you proactively upload assets to edges. To stop a flash of misses all hitting origin at once (a stampede when something goes viral or a cache expires), use ORIGIN SHIELDING / tiered caches (a mid-tier the edges share) and request coalescing." },
      { kind: "concept", heading: "Freshness/invalidation & follow-ups",
        body: "Cached content can go stale. Control with TTLs/cache-control headers, explicit PURGE (invalidate an asset across edges — eventually consistent), and especially VERSIONED URLs / cache-busting (app.v2.js — a new URL is a new object, so you never need to invalidate; the standard for immutable assets). Follow-ups: 'dynamic content / edge compute', 'cache hit ratio', 'large video (range requests)', 'DDoS absorption'. Signal: geo-distributed edges + nearest-edge routing (anycast/DNS) + pull/push caching with origin shielding + invalidation via purge/versioned URLs." },
    ],
    "A CDN is a globally-distributed edge cache: replicate to PoPs near users, route to the nearest healthy edge (anycast/DNS), cache pull-through with origin shielding against stampedes, and keep fresh via TTL/purge/versioned URLs. Proximity + caching = low latency and origin offload.",
    ["Serving all users from origin (or one region) instead of geo-distributed edges.",
     "Ignoring cache stampede on misses (no origin shielding / request coalescing).",
     "No invalidation strategy — relying on manual purges instead of versioned/immutable URLs."],
    0.6, { type: "CDN flow", description: "User → routed (anycast/DNS) to nearest edge PoP. Edge hit → serve cached. Miss → fetch from origin (via shield tier) → cache (TTL) → serve. Invalidate via purge / versioned URLs.", alt: "CDN: nearest-edge routing with pull-through caching, origin shielding, and invalidation." }),

  T("sysd_m13_t2", 2, "Design a Log Aggregation System (ELK)", "design-log-aggregation",
    ["case-study", "ingestion", "inverted-index", "search"],
    "Build centralized logging: collect logs from thousands of services, store them, and let engineers search/filter across all of them quickly ('show errors for service X in the last hour'). Why not just SSH into boxes, and what makes search fast?",
    "Agents SHIP logs off each host into a buffered pipeline (queue/Kafka), which feeds an indexer that writes to a searchable store with an INVERTED INDEX (Elasticsearch-style) — making full-text + structured queries fast. Retention/rollover ages data out (hot→warm→cold→delete). It's high-volume write ingestion + indexed search; sampling/structured logging tame volume.",
    [
      { kind: "concept", heading: "Why centralize",
        body: "Logs scattered across thousands of ephemeral hosts/containers are useless for debugging a distributed request (which touches many services) — and a crashed/autoscaled-away host takes its logs with it. CENTRALIZE: ship logs off the hosts into one searchable system, so engineers query across all services in one place. This is the L+E parts of ELK/EFK (and pairs with tracing + metrics — the three pillars of observability)." },
      { kind: "concept", heading: "Ship → buffer → index",
        body: "A lightweight AGENT on each host (Filebeat/Fluentd) tails log files and SHIPS them to a pipeline. A buffer/queue (Kafka) absorbs spikes and decouples producers from the indexer (logs are bursty — an incident produces a flood). A processor parses/enriches (extract fields, add service/host/trace-id), then an INDEXER writes documents into the store. Backpressure here prevents the logging system from falling over under load." },
      { kind: "concept", heading: "Indexed search",
        body: "Fast querying needs an INVERTED INDEX (Elasticsearch — the same structure as the search engine): tokens → documents, so 'find ERROR in service=payments last 1h' is an index lookup, not a scan. Logs are indexed by time + structured fields (level, service, host, trace-id) and full text. Sharded by time/index so old data can be managed independently. STRUCTURED logging (JSON, not free text) makes fields queryable." },
      { kind: "concept", heading: "Volume, retention & follow-ups",
        body: "Log volume is enormous and write-heavy. Control it: RETENTION with index rollover and tiering (hot SSD for recent, warm/cold cheaper storage, then delete/archive to object storage), and SAMPLING / log-level filtering for noisy debug logs. Follow-ups: 'cardinality/cost', 'multi-tenant isolation', 'alerting on log patterns', 'correlate with traces (shared trace-id)', 'PII redaction'. Signal: host agents → buffered pipeline (Kafka) → indexer → inverted-index store (time + fields) + retention/tiering + structured logging; like a search engine for logs." },
    ],
    "Log aggregation centralizes logs via host agents → a buffered pipeline (Kafka) → an indexer → an inverted-index store (Elasticsearch) for fast time/field/full-text search, with retention tiering and structured logging to tame volume. It's a write-heavy ingest + search-engine design and one of the three observability pillars.",
    ["Leaving logs on hosts (SSH-to-debug) — useless for distributed requests and lost on host death.",
     "Scanning raw logs instead of an inverted index for search.",
     "Ignoring volume — no retention/tiering, sampling, or structured logging."],
    0.6, { type: "Logging pipeline", description: "Host agents (Filebeat/Fluentd) → buffer (Kafka) → parse/enrich → indexer → inverted-index store (time + fields + full text) → search UI. Retention tiers hot→warm→cold→archive.", alt: "Log aggregation: agents shipping to a buffered pipeline and an inverted-index search store." }),

  T("sysd_m13_t3", 3, "Design a Time-Series Database", "design-timeseries-db",
    ["case-study", "storage-engine", "compression", "lsm"],
    "Build the storage engine for time-series data (metrics, sensor readings): billions of timestamped points, ingested append-only at high rate, queried by time range + tags. What storage layout and compression make this efficient where a B-tree RDBMS fails?",
    "Organize data by (series = metric+tags) → time-ordered points, append-only. Use an LSM-tree-style write path (in-memory buffer → immutable sorted chunks flushed to disk) for high write throughput, with aggressive COMPRESSION (delta-of-delta timestamps, XOR float values — adjacent points are similar). Index series by tags; downsample + retention age data out. Reads are time-range scans.",
    [
      { kind: "concept", heading: "The workload shapes the design",
        body: "Time-series writes are APPEND-ONLY, ordered (mostly) by increasing time, at very high rate, and never updated; reads are TIME-RANGE scans over a series ('cpu for host X, last 6h') often with aggregation. A general B-tree RDBMS handles random read/write/update — the wrong fit. A TSDB is purpose-built around this append-heavy, time-ordered, range-read pattern (the consumer of this is the metrics/IoT systems)." },
      { kind: "concept", heading: "Write path: LSM-style",
        body: "To sustain high write throughput, buffer incoming points in memory (a memtable) and periodically FLUSH to immutable, time-sorted CHUNKS/blocks on disk (an LSM-tree approach — sequential writes, no in-place updates). Writes are cheap appends; background compaction merges chunks. A write-ahead log gives durability before the in-memory buffer is flushed. This beats B-tree random writes for this workload." },
      { kind: "concept", heading: "Compression is the superpower",
        body: "Time-series data compresses dramatically because adjacent points are similar. TIMESTAMPS: store deltas, even delta-of-delta (regular intervals → near-zero bytes). VALUES: XOR consecutive floats and store only the differing bits (Gorilla/Facebook's scheme). This shrinks storage ~10x+ and means more data fits in memory/cache — crucial at billions of points. Columnar layout (timestamps and values stored separately) aids this." },
      { kind: "concept", heading: "Indexing, retention & follow-ups",
        body: "Index SERIES by their tags/labels (an inverted index: tag → series) so a query resolves which series match (metric=cpu, host=web1) then scans their time blocks for the range. DOWNSAMPLE old data (raw → 1m → 1h rollups) and apply RETENTION (drop/archive) — you don't keep raw resolution forever. Follow-ups: 'high cardinality' (too many tag combos = too many series — the classic killer), 'out-of-order/late points', 'distributed sharding by series + time'. Signal: series-keyed append-only LSM writes + delta/XOR compression + tag inverted-index + downsampling/retention; built for time-range reads, not random updates.",
      },
    ],
    "A TSDB tests a workload-specific storage engine: append-only LSM-style writes, aggressive delta-of-delta + XOR compression (adjacent points are similar), tag-based series indexing, and downsampling/retention — all for time-ordered, range-read, never-updated data where a B-tree RDBMS is the wrong fit. High cardinality is the killer.",
    ["Using a general B-tree RDBMS for append-only, time-ordered, never-updated data.",
     "Ignoring compression (delta/XOR) — storage and cache efficiency collapse at billions of points.",
     "Missing the high-cardinality problem (unbounded tag combos explode the series count)."],
    0.6, { type: "TSDB engine", description: "Points by series (metric+tags). Write: memtable → flush to immutable time-sorted chunks (LSM), WAL for durability. Compress: delta-of-delta timestamps, XOR values. Tag inverted-index; downsample + retain.", alt: "Time-series DB: LSM append writes with delta/XOR compression and tag-indexed series." }),

  T("sysd_m13_t4", 4, "Design a Workflow / Task Engine", "design-workflow-engine",
    ["case-study", "orchestration", "durable-state", "dag"],
    "Build an engine that runs multi-step workflows reliably (Airflow/Temporal-style): steps with dependencies, retries on failure, and — critically — surviving a worker crash mid-workflow to RESUME exactly where it left off. What makes a long-running workflow durable?",
    "Persist workflow STATE durably after every step (which steps completed, their outputs) so a crash resumes from the last completed step — not from scratch. Model the workflow as a DAG of tasks; a scheduler dispatches ready tasks (deps satisfied) to workers via a queue; failed tasks retry with backoff. Steps must be IDEMPOTENT (they may re-run). It's durable, resumable orchestration.",
    [
      { kind: "concept", heading: "Workflow as a DAG of tasks",
        body: "A workflow is a set of TASKS with dependencies — a directed acyclic graph (e.g. extract → [transform_a, transform_b] → load). The engine runs a task only when its upstream dependencies have succeeded; independent tasks run in parallel. An orchestrator tracks each task's state and dispatches ready ones. This is the same dependency-DAG idea as CI/CD pipelines, generalized." },
      { kind: "concept", heading: "Durable state = resumability",
        body: "The defining requirement: workflows are long-running (minutes to days) and MUST survive crashes/restarts. So the engine PERSISTS progress durably — after each task completes, its result and the workflow's position are written to a store. If a worker dies, another picks up the workflow and RESUMES from the last completed task (using persisted outputs), never re-running completed work from scratch. This durable-state-machine is what separates a workflow engine from a simple script." },
      { kind: "concept", heading: "Scheduling, retries, idempotency",
        body: "A scheduler finds tasks whose dependencies are met and enqueues them; a pool of WORKERS pulls and executes (Producer-Consumer + the job-scheduler design). Failed tasks RETRY with backoff (transient failures), then dead-letter / mark the workflow failed after max attempts. Because a task may run more than once (retry, or re-dispatch after a worker crash), tasks must be IDEMPOTENT — or the engine guarantees exactly-once effects via deduplication." },
      { kind: "concept", heading: "Patterns & follow-ups",
        body: "Two styles: orchestration via explicit DAG definitions (Airflow — great for data pipelines/cron), or durable-execution code where the workflow is written as a normal function and the engine transparently checkpoints/replays it (Temporal/Cadence — event-sourced history). Follow-ups: 'timers/sleeps' (a workflow can wait days), 'human-in-the-loop steps', 'compensation/saga on failure', 'versioning running workflows', 'fan-out/fan-in'. Signal: task DAG + durable persisted state for crash-resume + scheduler/worker dispatch + retries with backoff + idempotent/exactly-once tasks.",
      },
    ],
    "A workflow engine tests durable orchestration: a task DAG, persisted state after every step so a crash RESUMES from the last completed task (not from scratch), scheduler/worker dispatch of ready tasks, and retries with idempotency. Durable execution (Temporal) vs DAG definitions (Airflow) is the design choice; saga compensation is the failure follow-up.",
    ["A workflow that restarts from scratch after a crash (no durable per-step state).",
     "Ignoring task idempotency when steps can re-run on retry/crash recovery.",
     "No dependency DAG / retry-with-backoff — just sequential best-effort execution."],
    0.6, { type: "Workflow engine", description: "Workflow = task DAG. Scheduler dispatches ready tasks (deps met) → worker pool. After each task: persist state + output (durable). Crash → resume from last completed task. Failures retry w/ backoff; tasks idempotent.", alt: "Workflow engine: a task DAG with durable per-step state enabling crash-resume, plus retries." }),

  T("sysd_m13_t5", 5, "Design a Data Warehouse / Analytics", "design-data-warehouse",
    ["case-study", "olap", "columnar", "etl"],
    "Build analytics over huge historical data: 'total revenue by region per month over 3 years', scanning billions of rows. Your transactional (OLTP) database can't do this without dying. What storage and pipeline power analytical (OLAP) queries?",
    "Separate analytics (OLAP) from transactions (OLTP): ETL/ELT pipelines load data from operational systems into a COLUMNAR warehouse (Redshift/BigQuery/Snowflake). Columnar storage + compression + partitioning + massively-parallel processing make big aggregations over few columns fast. It's read-heavy, scan-and-aggregate; don't run analytics on the OLTP DB.",
    [
      { kind: "concept", heading: "OLTP vs OLAP — separate them",
        body: "Your production database is OLTP — tuned for many small transactions (row reads/writes by key). Analytical queries are OLAP — scan billions of ROWS aggregating a FEW columns (sums, group-bys over years of history). Running OLAP on the OLTP DB competes for resources, locks, and is slow (row-stores read whole rows). So extract analytics into a separate WAREHOUSE built for it; never report off the live transactional DB at scale." },
      { kind: "concept", heading: "Columnar storage",
        body: "The key technique: store data COLUMN-wise, not row-wise. An aggregation like SUM(revenue) GROUP BY region reads only the revenue + region columns — a columnar store reads just those, skipping the rest of each row (vs a row store reading everything). Columns compress extremely well (similar values together — run-length, dictionary encoding). This is why columnar warehouses scan huge tables for analytics orders of magnitude faster." },
      { kind: "concept", heading: "ETL/ELT pipeline",
        body: "Data flows from operational sources (OLTP DBs, event streams, logs) into the warehouse via ETL (Extract, Transform, Load) or ELT (load raw, transform in-warehouse). It's typically BATCH (nightly/hourly) — or streaming for near-real-time. Often a DATA LAKE (raw files in object storage) feeds the warehouse, and dimensional modeling (star schema: fact + dimension tables) organizes it for queries. The pipeline is itself a workflow (the workflow-engine design)." },
      { kind: "concept", heading: "Performance & follow-ups",
        body: "Big analytical scans are sped up by PARTITIONING (by date/region — prune irrelevant partitions), massively-PARALLEL processing (MPP — split a query across many nodes), and pre-aggregated cubes/materialized views for common rollups. Follow-ups: 'real-time analytics' (streaming + the Lambda/Kappa idea, or the ad-click aggregator), 'data lake vs warehouse vs lakehouse', 'cost' (scan-based pricing), 'data quality/governance'. Signal: separate OLAP warehouse + columnar storage + ETL/ELT (often via a data lake) + partitioning/MPP/star-schema; don't analyze on the OLTP DB.",
      },
    ],
    "A data warehouse tests OLAP vs OLTP separation: ETL/ELT loads operational data into a COLUMNAR, partitioned, MPP warehouse where big aggregations over few columns are fast, organized by star schema. Never run analytics on the transactional DB; real-time analytics is the streaming follow-up.",
    ["Running heavy analytical queries on the OLTP production database.",
     "Row-oriented storage for analytics instead of columnar (reads whole rows for a few-column aggregate).",
     "No ETL/partitioning/MPP — expecting big scans to be fast without them."],
    0.6, { type: "Analytics pipeline", description: "Sources (OLTP, events, logs) → ETL/ELT (often via a data lake) → columnar warehouse (star schema, partitioned, MPP). Analytical queries scan few columns over partitions, parallelized. Separate from OLTP.", alt: "Data warehouse: ETL into a columnar, partitioned, MPP store separate from the OLTP database." }),

  T("sysd_m13_t6", 6, "Design a Media Processing Pipeline", "design-media-pipeline",
    ["case-study", "async", "transcoding", "object-storage"],
    "Build the upload-and-process pipeline for photos/videos (Instagram/YouTube ingest): a user uploads a large file, which must be transcoded into multiple formats/resolutions, thumbnailed, and made available — without the user waiting. How does the upload and processing flow?",
    "Upload large files DIRECTLY to object storage (pre-signed URL — bypassing your app servers); store metadata with status=PROCESSING. The upload event enqueues processing jobs; a worker pool TRANSCODES into multiple renditions, generates thumbnails, and writes outputs back to storage, then marks READY and serves via CDN. It's an async, queue-driven, worker-pool pipeline.",
    [
      { kind: "concept", heading: "Direct-to-storage upload",
        body: "A large media file shouldn't stream through your application servers (ties up connections, wastes bandwidth). Instead the client requests a PRE-SIGNED URL and uploads the file DIRECTLY to object storage (S3) — supporting multipart/resumable upload for big files (the object-store design). Your backend just records metadata (id, owner, status=PROCESSING) and the storage location." },
      { kind: "concept", heading: "Async, queue-driven processing",
        body: "Processing (transcoding) is slow and CPU-intensive — the user must NOT wait. The upload-complete event ENQUEUES processing jobs onto a queue; a pool of WORKERS pulls them. The client gets an immediate 'uploading/processing' response and is notified (or polls) when ready. This async fan-out (Producer-Consumer) decouples the fast upload from slow processing and lets you scale workers for the load." },
      { kind: "concept", heading: "Transcoding fan-out",
        body: "Workers generate the needed OUTPUTS: video → multiple resolutions/bitrates + formats (the adaptive-bitrate ladder, like live streaming but offline/VOD), HLS/DASH segments, thumbnails/poster frames, and possibly content checks (moderation — that pipeline). Large videos are SPLIT into chunks transcoded in PARALLEL then stitched (massive speedup). Outputs are written back to object storage. Steps may form a DAG (the workflow-engine idea)." },
      { kind: "concept", heading: "Delivery, status & follow-ups",
        body: "When all renditions are done, mark the asset READY and serve via CDN (edge-cached, range requests for video). Track per-job STATUS and handle failures (retry a failed transcode; partial outputs). Follow-ups: 'idempotency / dedupe identical uploads (content hash)', 'progress updates (WebSocket)', 'priority (premium users)', 'cost of transcoding', 'thumbnail-first for fast preview'. Signal: direct-to-object-storage upload (pre-signed, multipart) + async queue + transcode worker pool (parallel-chunk) + status tracking + CDN delivery.",
      },
    ],
    "A media pipeline tests async processing: upload direct to object storage (pre-signed, multipart), enqueue transcode jobs to a worker pool that fans out renditions/thumbnails (parallel-chunk for big video) and writes back to storage, with status tracking and CDN delivery. The user never waits on transcoding.",
    ["Streaming large uploads through app servers instead of direct-to-object-storage (pre-signed URLs).",
     "Transcoding synchronously in the upload request (the user waits) instead of async queue + workers.",
     "No status tracking / retry for failed transcodes; serving from origin instead of CDN."],
    0.5, { type: "Media pipeline", description: "Client → pre-signed direct upload to object storage (multipart); metadata status=PROCESSING → upload event enqueues jobs → worker pool transcodes (parallel chunks) renditions+thumbnails → write back → status=READY → serve via CDN.", alt: "Media pipeline: direct-to-storage upload, async transcode workers, then CDN delivery." }),

  T("sysd_m13_t7", 7, "Design a Secrets Manager", "design-secrets-manager",
    ["case-study", "security", "encryption", "access-control"],
    "Build a system to store and distribute secrets (DB passwords, API keys, certs) to applications securely — encrypted, access-controlled, audited, and rotatable. What protects the secrets at rest, and how do apps get them without hardcoding?",
    "Encrypt secrets at rest with ENVELOPE ENCRYPTION (a per-secret data key encrypts the secret; a master key in an HSM/KMS encrypts the data keys). Apps AUTHENTICATE (machine identity) and are authorized by fine-grained ACCESS POLICIES to fetch a secret over TLS — never hardcoded. Every access is AUDITED; secrets are ROTATED (ideally dynamic, short-lived). It's encryption + authz + audit + rotation.",
    [
      { kind: "concept", heading: "Encryption at rest (envelope)",
        body: "Secrets must be encrypted at rest so the storage being breached doesn't leak them. Use ENVELOPE ENCRYPTION: each secret is encrypted with a data encryption key (DEK); the DEKs are themselves encrypted by a MASTER key that lives in an HSM (Hardware Security Module) or KMS and never leaves it. This limits blast radius and enables key rotation without re-encrypting everything. The master key is the root of trust — protect it above all." },
      { kind: "concept", heading: "Authentication & authorization",
        body: "Apps shouldn't hardcode secrets (the very problem) — they AUTHENTICATE to the secrets manager using a machine IDENTITY (IAM role, service account, mTLS cert, or a bootstrap token) and then are authorized by fine-grained ACCESS POLICIES (this service may read THIS path's secrets only). Least privilege: each service gets only the secrets it needs. Secrets travel over TLS and are kept in memory, not written to disk/logs." },
      { kind: "concept", heading: "Audit & rotation",
        body: "Every read/write/access is logged to an AUDIT trail (who accessed what, when) — essential for compliance and breach forensics, and tamper-evident. ROTATION limits the damage of a leaked secret: rotate on a schedule, and ideally issue DYNAMIC secrets — short-lived, generated on demand (e.g. the manager creates a temporary DB credential that auto-expires), so a leaked secret is useless quickly. Static long-lived secrets are the weakest link." },
      { kind: "concept", heading: "Availability & follow-ups",
        body: "It's a critical dependency — apps can't start without their secrets — so it must be HIGHLY AVAILABLE (replicated) yet secure (sealed/unseal process, the master key split via Shamir's secret sharing so no one person holds it). Follow-ups: 'caching secrets safely (short TTL)', 'secret leasing/revocation', 'certificate issuance (PKI)', 'break-glass access', 'avoid the secret-zero bootstrap problem'. Signal: envelope encryption (master key in HSM/KMS) + machine-identity auth + least-privilege policies + audit log + rotation/dynamic short-lived secrets + HA.",
      },
    ],
    "A secrets manager tests security architecture: envelope encryption (data keys under a master key in an HSM/KMS), machine-identity authentication with least-privilege access policies, an audit trail of every access, and rotation/dynamic short-lived secrets — all highly available. Secrets are fetched over TLS, never hardcoded; the master key and the secret-zero bootstrap are the crux.",
    ["Storing secrets unencrypted (or with one key) instead of envelope encryption under an HSM/KMS master key.",
     "Apps hardcoding secrets instead of authenticating with a machine identity + least-privilege policy.",
     "No audit trail or rotation (long-lived static secrets); ignoring HA for a critical dependency."],
    0.6, { type: "Secrets flow", description: "Secret encrypted by a data key; data keys encrypted by an HSM/KMS master key (envelope). App authenticates (machine identity) → policy authz → fetch over TLS. Every access audited; secrets rotated / issued short-lived.", alt: "Secrets manager: envelope encryption, identity-based access policies, audit, and rotation." }),

  T("sysd_m13_t8", 8, "Design a Multi-Region Database", "design-multi-region-db",
    ["case-study", "replication", "consistency", "failover"],
    "Serve a database to users on multiple continents with low latency and survive a whole region going down. But replicating across regions means high latency between them — so what's the fundamental trade-off, and what are the topologies?",
    "Cross-region replication forces a CONSISTENCY vs LATENCY trade (a flavor of CAP/PACELC): SYNCHRONOUS replication = strong consistency but every write pays cross-region latency; ASYNCHRONOUS = fast local writes but replicas lag (stale reads, possible loss/conflicts on failover). Topologies: single-leader (one write region) vs multi-leader/active-active (write anywhere, must resolve conflicts). Choose per requirements.",
    [
      { kind: "concept", heading: "Why multi-region (and the cost)",
        body: "Two goals: low latency for globally-distributed users (read/write near them) and DISASTER RECOVERY (survive an entire region/datacenter outage). But regions are far apart (50–150ms+ RTT), so keeping copies in sync across them is expensive. This tension — you can't have low write latency AND strong cross-region consistency AND availability all at once — is the heart of the design (PACELC: even when there's no partition, you trade latency vs consistency)." },
      { kind: "concept", heading: "Sync vs async replication",
        body: "SYNCHRONOUS replication: a write isn't acknowledged until other regions confirm it → STRONG consistency and no data loss on failover, but every write eats the cross-region round-trip (slow). ASYNCHRONOUS replication: ack locally, propagate in the background → FAST writes and local reads, but replicas LAG (stale reads), and a failover can lose un-replicated writes or surface conflicts. This is the central knob; most systems pick async for latency and accept eventual consistency." },
      { kind: "concept", heading: "Topologies",
        body: "SINGLE-LEADER (one region accepts writes, others are read replicas): simple, no write conflicts, but writes are remote for far users and a leader-region failure needs FAILOVER (promote a replica — risk of lost async writes / split-brain). MULTI-LEADER / ACTIVE-ACTIVE (any region accepts writes): low write latency everywhere, but concurrent writes to the same data in different regions CONFLICT and must be resolved (last-write-wins, CRDTs, or app logic). Leaderless/quorum (Dynamo-style) is another option. Pick by whether you need local writes everywhere." },
      { kind: "concept", heading: "Conflicts, failover & follow-ups",
        body: "Multi-leader requires CONFLICT RESOLUTION (CRDTs for commutative merges, version vectors, or business rules). Failover needs health detection + leader election (the consensus/distributed-lock idea) and guarding against SPLIT-BRAIN (two leaders). Techniques: route users to their nearest region, pin a user's data to a home region (data residency/GDPR also forces this), read-your-writes via sticky routing. Follow-ups: 'global secondary indexes', 'clock skew (use logical clocks)', 'consensus across regions (slow)'. Signal: name the consistency-vs-latency (CAP/PACELC) trade + sync vs async replication + single- vs multi-leader topology + conflict resolution + failover/split-brain handling.",
      },
    ],
    "A multi-region DB tests the consistency-vs-latency trade (CAP/PACELC): synchronous (strong, slow) vs asynchronous (fast, stale/lossy) replication, single-leader (no conflicts, failover risk) vs multi-leader/active-active (local writes, must resolve conflicts via CRDTs/version vectors), plus failover with split-brain avoidance. Data residency often forces home-region pinning.",
    ["Not naming the consistency-vs-latency (CAP/PACELC) trade-off forced by cross-region distance.",
     "Assuming active-active 'just works' without a conflict-resolution strategy.",
     "Ignoring failover hazards — lost async writes and split-brain (two leaders)."],
    0.6, { type: "Replication topology", description: "Cross-region RTT forces consistency-vs-latency. Sync repl = strong but slow writes; async = fast but stale/lossy. Single-leader (writes in one region, failover) vs multi-leader/active-active (local writes + conflict resolution).", alt: "Multi-region DB: sync vs async replication and single- vs multi-leader topologies with their trade-offs." }),
];

const EXERCISES = [
  // CDN
  pm({ topicId: "sysd_m13_t1", exerciseId: "sysd_m13_t1_pm_1", position: 1, level: "medium", title: "Low latency how",
    scenario: "A CDN serves assets fast worldwide primarily by…",
    options: ["Caching copies on edge servers physically near users", "Upgrading the origin server", "Compressing harder", "Using a faster database"], correct: "Caching copies on edge servers physically near users",
    explanation: "Proximity (edge PoPs near users) + caching cuts latency and offloads the origin." }),
  pm({ topicId: "sysd_m13_t1", exerciseId: "sysd_m13_t1_pm_2", position: 2, level: "hard", title: "Miss stampede",
    scenario: "When a popular asset expires, many edges miss and hit origin at once. Mitigation?",
    options: ["Origin shielding / tiered cache + request coalescing", "Disable caching", "A bigger origin", "Random TTLs only"], correct: "Origin shielding / tiered cache + request coalescing",
    explanation: "A shield tier the edges share (plus coalescing) absorbs the misses so the origin isn't stampeded." }),
  pm({ topicId: "sysd_m13_t1", exerciseId: "sysd_m13_t1_pm_3", position: 3, level: "medium", title: "Fresh content",
    scenario: "The cleanest way to never serve stale immutable assets is…",
    options: ["Versioned URLs (app.v2.js) — a new URL is a new object", "Manually purging every edge constantly", "TTL of zero", "Never caching"], correct: "Versioned URLs (app.v2.js) — a new URL is a new object",
    explanation: "Cache-busting via versioned/immutable URLs avoids invalidation entirely; purge is for the rest." }),
  // Log aggregation
  pm({ topicId: "sysd_m13_t2", exerciseId: "sysd_m13_t2_pm_1", position: 1, level: "medium", title: "Why centralize",
    scenario: "Why ship logs off hosts into a central system?",
    options: ["Distributed requests span services + hosts vanish (autoscaling/crash) taking logs with them", "It's cheaper to store remotely", "Hosts can't write files", "To reduce log volume"], correct: "Distributed requests span services + hosts vanish (autoscaling/crash) taking logs with them",
    explanation: "Centralizing lets you query across services and survive ephemeral hosts disappearing." }),
  pm({ topicId: "sysd_m13_t2", exerciseId: "sysd_m13_t2_pm_2", position: 2, level: "hard", title: "Fast search",
    scenario: "Searching 'ERROR in service=payments last 1h' across billions of log lines is fast because of…",
    options: ["An inverted index (Elasticsearch) over time + fields", "Grepping the raw files", "A relational table scan", "Sorting logs alphabetically"], correct: "An inverted index (Elasticsearch) over time + fields",
    explanation: "An inverted index makes log search a lookup, not a scan — the same structure as a search engine." }),
  pm({ topicId: "sysd_m13_t2", exerciseId: "sysd_m13_t2_pm_3", position: 3, level: "medium", title: "Tame volume",
    scenario: "Log volume is huge. You control storage with…",
    options: ["Retention tiering (hot→warm→cold→delete) + structured logging/sampling", "Keeping everything on SSD forever", "Disabling logging", "One giant index"], correct: "Retention tiering (hot→warm→cold→delete) + structured logging/sampling",
    explanation: "Tier old data to cheaper storage and sample noisy logs; structured logs keep fields queryable." }),
  // TSDB
  pm({ topicId: "sysd_m13_t3", exerciseId: "sysd_m13_t3_pm_1", position: 1, level: "medium", title: "Wrong tool",
    scenario: "Why is a general B-tree RDBMS a poor fit for time-series?",
    options: ["TS is append-only, time-ordered, never-updated, range-read — not random read/write/update", "RDBMS can't store numbers", "RDBMS has no indexes", "TS needs no storage"], correct: "TS is append-only, time-ordered, never-updated, range-read — not random read/write/update",
    explanation: "A TSDB is built for the append-heavy, time-ordered, range-scan workload a B-tree RDBMS handles poorly." }),
  pm({ topicId: "sysd_m13_t3", exerciseId: "sysd_m13_t3_pm_2", position: 2, level: "hard", title: "Compression",
    scenario: "Time-series compresses dramatically using…",
    options: ["Delta-of-delta timestamps + XOR'd float values (adjacent points similar)", "Zipping the whole file once", "No compression", "Storing each point as JSON"], correct: "Delta-of-delta timestamps + XOR'd float values (adjacent points similar)",
    explanation: "Regular intervals → tiny timestamp deltas; similar values → small XOR diffs (Gorilla) — ~10x+ savings." }),
  pm({ topicId: "sysd_m13_t3", exerciseId: "sysd_m13_t3_pm_3", position: 3, level: "hard", title: "The killer",
    scenario: "What's the classic problem that blows up a TSDB?",
    options: ["High cardinality — too many tag/label combinations = too many series", "Too few metrics", "Reads being too fast", "Compression"], correct: "High cardinality — too many tag/label combinations = too many series",
    explanation: "Each unique tag combination is a series; unbounded tags (e.g. user id) explode series count and memory." }),
  // Workflow engine
  pm({ topicId: "sysd_m13_t4", exerciseId: "sysd_m13_t4_pm_1", position: 1, level: "hard", title: "Survive a crash",
    scenario: "A worker dies mid-workflow. To resume from where it left off (not restart), the engine must…",
    options: ["Persist workflow state/outputs durably after each step", "Keep everything in memory", "Restart the whole workflow", "Skip the remaining steps"], correct: "Persist workflow state/outputs durably after each step",
    explanation: "Durable per-step state lets another worker resume from the last completed task using persisted outputs." }),
  pm({ topicId: "sysd_m13_t4", exerciseId: "sysd_m13_t4_pm_2", position: 2, level: "medium", title: "Step dependencies",
    scenario: "Steps with dependencies (run B and C after A) are modelled as…",
    options: ["A DAG; run a task when its upstreams succeed", "A flat list run in order", "Random order", "All in parallel always"], correct: "A DAG; run a task when its upstreams succeed",
    explanation: "A task DAG runs ready tasks (deps met), parallelizing independent ones — like CI/CD pipelines." }),
  pm({ topicId: "sysd_m13_t4", exerciseId: "sysd_m13_t4_pm_3", position: 3, level: "medium", title: "Re-runs",
    scenario: "Since a task may run more than once (retry / crash recovery), tasks should be…",
    options: ["Idempotent (or effects deduplicated for exactly-once)", "Run at most once with no retry", "Allowed to double their effects", "Skipped on retry"], correct: "Idempotent (or effects deduplicated for exactly-once)",
    explanation: "Retries and re-dispatch mean tasks can re-run; idempotency (or dedupe) keeps effects correct." }),
  // Data warehouse
  pm({ topicId: "sysd_m13_t5", exerciseId: "sysd_m13_t5_pm_1", position: 1, level: "medium", title: "OLTP vs OLAP",
    scenario: "Heavy 'revenue by region per month over 3 years' analytics should run on…",
    options: ["A separate OLAP data warehouse, not the OLTP production DB", "The OLTP database directly", "A cache", "The application server"], correct: "A separate OLAP data warehouse, not the OLTP production DB",
    explanation: "Analytical scans compete with and overwhelm OLTP; extract data into a warehouse built for OLAP." }),
  pm({ topicId: "sysd_m13_t5", exerciseId: "sysd_m13_t5_pm_2", position: 2, level: "hard", title: "Storage layout",
    scenario: "What makes aggregating a few columns over billions of rows fast?",
    options: ["Columnar storage (read only the needed columns; compresses well)", "Row storage", "More indexes on every column", "Storing rows as JSON"], correct: "Columnar storage (read only the needed columns; compresses well)",
    explanation: "Columnar stores read just the queried columns and compress similar values — ideal for big aggregations." }),
  pm({ topicId: "sysd_m13_t5", exerciseId: "sysd_m13_t5_pm_3", position: 3, level: "medium", title: "Getting data in",
    scenario: "Operational data reaches the warehouse via…",
    options: ["ETL/ELT pipelines (often through a data lake), usually batch", "Direct user writes", "The CDN", "Manual CSV uploads only"], correct: "ETL/ELT pipelines (often through a data lake), usually batch",
    explanation: "ETL/ELT extracts/transforms/loads from sources into the warehouse, often via a data lake, typically batched." }),
  // Media pipeline
  pm({ topicId: "sysd_m13_t6", exerciseId: "sysd_m13_t6_pm_1", position: 1, level: "hard", title: "Big uploads",
    scenario: "A large video upload should go…",
    options: ["Directly to object storage via a pre-signed URL (multipart)", "Through the application servers", "Into the database", "Through the CDN"], correct: "Directly to object storage via a pre-signed URL (multipart)",
    explanation: "Direct-to-storage (pre-signed, multipart/resumable) avoids tying up app servers on large transfers." }),
  pm({ topicId: "sysd_m13_t6", exerciseId: "sysd_m13_t6_pm_2", position: 2, level: "hard", title: "Don't make users wait",
    scenario: "Transcoding is slow. So it's done…",
    options: ["Asynchronously — enqueue jobs to a worker pool; notify when ready", "Synchronously in the upload request", "On the client device only", "Never"], correct: "Asynchronously — enqueue jobs to a worker pool; notify when ready",
    explanation: "Async queue + worker pool decouples slow transcoding from the fast upload; the client is notified on completion." }),
  pm({ topicId: "sysd_m13_t6", exerciseId: "sysd_m13_t6_pm_3", position: 3, level: "medium", title: "Big video speed",
    scenario: "To transcode a long video faster, workers…",
    options: ["Split it into chunks transcoded in parallel, then stitch", "Process it on one thread", "Lower the quality", "Skip frames"], correct: "Split it into chunks transcoded in parallel, then stitch",
    explanation: "Parallel-chunk transcoding massively speeds up large videos; outputs (renditions/thumbnails) go back to storage." }),
  // Secrets manager
  pm({ topicId: "sysd_m13_t7", exerciseId: "sysd_m13_t7_pm_1", position: 1, level: "hard", title: "Encryption at rest",
    scenario: "Secrets are protected at rest using…",
    options: ["Envelope encryption (data keys under a master key in an HSM/KMS)", "Base64 encoding", "A single shared password", "Plaintext with file permissions"], correct: "Envelope encryption (data keys under a master key in an HSM/KMS)",
    explanation: "Per-secret data keys encrypted by an HSM/KMS master key limit blast radius and enable rotation." }),
  pm({ topicId: "sysd_m13_t7", exerciseId: "sysd_m13_t7_pm_2", position: 2, level: "medium", title: "How apps get secrets",
    scenario: "An app should obtain a secret by…",
    options: ["Authenticating with a machine identity → policy authz → fetch over TLS", "Hardcoding it in the code/config", "Reading it from a public endpoint", "Emailing an admin"], correct: "Authenticating with a machine identity → policy authz → fetch over TLS",
    explanation: "Machine-identity auth + least-privilege policies replace hardcoded secrets; fetched over TLS, kept in memory." }),
  pm({ topicId: "sysd_m13_t7", exerciseId: "sysd_m13_t7_pm_3", position: 3, level: "hard", title: "Limit leak damage",
    scenario: "What most limits the damage of a leaked secret?",
    options: ["Rotation / dynamic short-lived secrets (+ full audit trail)", "A longer secret", "Storing it twice", "Logging every secret value"], correct: "Rotation / dynamic short-lived secrets (+ full audit trail)",
    explanation: "Short-lived, auto-expiring (dynamic) secrets become useless quickly; audit logs enable forensics." }),
  // Multi-region DB
  pm({ topicId: "sysd_m13_t8", exerciseId: "sysd_m13_t8_pm_1", position: 1, level: "hard", title: "The trade-off",
    scenario: "Cross-region distance forces which fundamental trade-off?",
    options: ["Consistency vs latency (CAP/PACELC)", "Storage vs compute", "Reads vs writes only", "Cost vs color"], correct: "Consistency vs latency (CAP/PACELC)",
    explanation: "High inter-region RTT means you trade strong consistency against write latency (PACELC even without partitions)." }),
  pm({ topicId: "sysd_m13_t8", exerciseId: "sysd_m13_t8_pm_2", position: 2, level: "hard", title: "Sync vs async",
    scenario: "Asynchronous cross-region replication gives…",
    options: ["Fast local writes but stale replicas / possible loss on failover", "Strong consistency with slow writes", "No replication", "Zero latency everywhere"], correct: "Fast local writes but stale replicas / possible loss on failover",
    explanation: "Async acks locally and lags; sync is strongly consistent but pays the cross-region round-trip per write." }),
  pm({ topicId: "sysd_m13_t8", exerciseId: "sysd_m13_t8_pm_3", position: 3, level: "medium", title: "Active-active cost",
    scenario: "Multi-leader (active-active) writes give low local write latency but require…",
    options: ["Conflict resolution (CRDTs / version vectors / business rules)", "Nothing extra", "A single global lock per write", "Read-only replicas"], correct: "Conflict resolution (CRDTs / version vectors / business rules)",
    explanation: "Concurrent writes to the same data in different regions conflict and must be resolved deterministically." }),
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
  console.log(`\nDone — M13 Case Studies VIII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
