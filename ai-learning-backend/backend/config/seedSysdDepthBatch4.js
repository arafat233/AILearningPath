/**
 * Seed — System Design DEPTH batch 4 (SD_DEPTH_STANDARD.md).
 *
 * Deepens 6 more case studies to full framework depth, each block `section`-
 * tagged, with an authored architecture SVG and 3 exercises.
 *
 *   sysd_m4_t3   File Sync (Dropbox/Drive)   (module sysd_m4)
 *   sysd_m8_t6   Unique ID Generator         (module sysd_m8)
 *   sysd_m8_t7   Object Store (S3)           (module sysd_m8)
 *   sysd_m8_t8   Proximity / Nearby Service  (module sysd_m8)
 *   sysd_m9_t4   Distributed Lock            (module sysd_m9)
 *   sysd_m8_t5   Distributed Job Scheduler   (module sysd_m8)
 *
 * Idempotent upsert by id; recomputes totals. Verify:
 *   node config/auditSysdDepth.mjs --require sysd_m4_t3,sysd_m8_t6,sysd_m8_t7,sysd_m8_t8,sysd_m9_t4,sysd_m8_t5
 * Usage: node config/seedSysdDepthBatch4.js  ·  npm run seed:sysd-depth-4
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";

const FONT = "system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function box(x, y, w, h, label, sub, fill = "#eff6ff") {
  const cy = sub ? y + h / 2 - 3 : y + h / 2 + 5;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="#94a3b8" stroke-width="1.5"/>`;
  s += `<text x="${x + w / 2}" y="${cy}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="600" fill="#0f172a">${esc(label)}</text>`;
  if (sub) s += `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="#475569">${esc(sub)}</text>`;
  return s;
}
function arrow(x1, y1, x2, y2, label, dashed) {
  const dash = dashed ? ` stroke-dasharray="5 4"` : "";
  let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="2"${dash} marker-end="url(#ah)"/>`;
  if (label) s += `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle" font-family="${FONT}" font-size="10.5" fill="#64748b">${esc(label)}</text>`;
  return s;
}
function note(x, y, text, anchor = "middle") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="11" fill="#64748b">${esc(text)}</text>`;
}
function svg(w, h, inner) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:${w}px;height:auto">` +
    `<defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#94a3b8"/></marker></defs>` +
    `<rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff"/>${inner}</svg>`;
}

const DIAG = {
  filesync: svg(820, 280,
    box(20, 100, 110, 60, "Client A", "chunk+diff") +
    box(20, 200, 110, 56, "Client B", "device 2") +
    box(180, 100, 130, 60, "Sync svc", "metadata", "#f0fdf4") +
    box(360, 30, 150, 56, "Metadata DB", "file->chunks", "#eff6ff") +
    box(360, 120, 150, 56, "Object store", "chunks (dedup)", "#fce7f3") +
    box(560, 120, 130, 56, "Notify", "push changes", "#ede9fe") +
    arrow(130, 125, 180, 125, "changed chunks") +
    arrow(310, 110, 360, 60, "version") + arrow(310, 135, 360, 145, "new chunks") +
    arrow(510, 148, 560, 148) + arrow(620, 176, 130, 220, "delta", true) +
    note(430, 270, "Chunk + hash -> upload only changed chunks; push deltas to devices")),
  uid: svg(820, 240,
    note(420, 30, "64-bit Snowflake ID (generated locally, no coordination)") +
    box(120, 55, 250, 56, "timestamp (41 bits)", "ms since epoch", "#fef9c3") +
    box(380, 55, 180, 56, "machine (10 bits)", "worker id", "#fce7f3") +
    box(570, 55, 150, 56, "sequence (12 bits)", "per-ms counter", "#ede9fe") +
    box(180, 150, 140, 52, "Node 1", "local gen", "#f0fdf4") +
    box(360, 150, 140, 52, "Node 2", "local gen", "#f0fdf4") +
    box(540, 150, 140, 52, "Node N", "local gen", "#f0fdf4") +
    note(420, 230, "Time-sortable + unique without a central counter; worker id keeps nodes distinct")),
  objstore: svg(820, 250,
    box(20, 95, 100, 56, "Client", "PUT/GET") +
    box(160, 95, 120, 56, "API / LB", "", "#f0fdf4") +
    box(330, 30, 150, 52, "Metadata svc", "key -> locations", "#eff6ff") +
    box(330, 150, 160, 52, "Storage nodes", "erasure / replicas", "#fce7f3") +
    box(540, 150, 130, 52, "Repair job", "re-replicate", "#ede9fe") +
    arrow(120, 123, 160, 123) +
    arrow(280, 110, 330, 60, "lookup") + arrow(280, 135, 330, 172, "data") +
    arrow(490, 176, 540, 176, "heal", true) +
    note(420, 240, "Metadata maps key->shards; erasure coding for 11 9s durability")),
  prox: svg(820, 240,
    box(20, 90, 100, 56, "Client", "lat,lng,r") +
    box(160, 90, 120, 56, "Nearby API", "", "#f0fdf4") +
    box(330, 30, 150, 52, "Geo index", "cells (geohash)", "#fce7f3") +
    box(330, 150, 150, 52, "Place store", "metadata", "#eff6ff") +
    box(540, 90, 150, 56, "Distance filter", "+ rank", "#ede9fe") +
    arrow(120, 118, 160, 118) +
    arrow(280, 105, 330, 60, "cover radius") + arrow(280, 130, 330, 172, "candidates") +
    arrow(480, 60, 540, 105, "ids") + arrow(480, 176, 540, 130) +
    note(420, 230, "Cover the radius with cells -> candidates -> exact distance filter -> rank")),
  lock: svg(820, 240,
    box(20, 40, 110, 52, "Client A", "") +
    box(20, 150, 110, 52, "Client B", "") +
    box(180, 90, 150, 60, "Lock service", "etcd/ZK (CP)", "#fce7f3") +
    box(380, 90, 160, 60, "lock key", "owner+token+TTL", "#fef9c3") +
    box(600, 90, 130, 60, "Resource", "checks token", "#f0fdf4") +
    arrow(130, 70, 180, 105, "acquire") + arrow(130, 175, 180, 135, "blocked") +
    arrow(330, 120, 380, 120) +
    arrow(540, 120, 600, 120, "fencing token") +
    note(430, 225, "CP store grants one holder; lease/TTL frees on crash; fencing token rejects stale")),
  sched: svg(820, 250,
    box(20, 95, 110, 56, "Scheduler", "jobs by next_run", "#f0fdf4") +
    box(180, 30, 150, 52, "Jobs store", "schedule+state", "#eff6ff") +
    box(180, 150, 150, 52, "Leader / lock", "no double-dispatch", "#fef9c3") +
    box(380, 95, 120, 56, "Queue", "due jobs", "#ede9fe") +
    box(540, 30, 120, 52, "Worker 1", "", "#fce7f3") +
    box(540, 150, 120, 52, "Worker N", "", "#fce7f3") +
    box(700, 95, 100, 56, "Status", "+ retries") +
    arrow(130, 110, 180, 60, "read due") + arrow(130, 135, 180, 170) +
    arrow(330, 110, 380, 120, "enqueue") +
    arrow(500, 110, 540, 60) + arrow(500, 130, 540, 165) +
    arrow(660, 60, 700, 110) + arrow(660, 176, 700, 130) +
    note(430, 240, "Dispatch due jobs once (leader/lock) -> queue -> workers -> status + retry")),
};

const TT = (moduleId, id, num, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, svgStr, vaType) => ({
  trackKey: TRACK_KEY, moduleId, topicId: id, topicNumber: num, name, slug,
  metadata: { estimated_minutes: 50, difficulty: 4, prerequisites: [], tags },
  hook: { question: hookQ, insight: hookI },
  teaching: { blocks, visual_aid: { type: vaType, svg: svgStr, alt_text: `${name} architecture diagram.` } },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: [], estimatedMinutes: 50, difficulty: diff, xpReward: 80, visualizer: null,
});
const C = (section, heading, body) => ({ kind: "concept", section, heading, body });
const K = (section, heading, body) => ({ kind: "code", section, heading, body });
const G = (id, w, r, d) => ({ gap_id: id, what_students_get_wrong: w, remediation: r, detection_pattern: d });

const TOPICS = [
  // ──────────────────────── FILE SYNC (DROPBOX) ────────────────────────────
  TT("sysd_m4", "sysd_m4_t3", 3, "Design File Sync (Dropbox/Drive)", "sysd-file-sync",
    ["case-study", "dropbox", "sync", "chunking"],
    "Edit a file on your laptop and it appears on your phone seconds later — without re-uploading the whole file when you change one line, and without losing data when two devices edit while offline. How does sync stay fast, cheap, and correct?",
    "Files are split into CHUNKS; only the chunks that actually changed are uploaded (delta sync), and identical chunks are stored once (content-hash dedup) in object storage. A METADATA service tracks each file's chunk list and versions; clients diff locally and sync metadata, then a notification service pushes changes to other devices. The substance is efficient delta sync, conflict handling, and durable chunk storage.",
    [
      C("requirements", "Requirements",
        "Functional: upload/download files; keep them synced across a user's devices in near-real-time; share files/folders with others; version history (restore an old version); and work with offline edits that reconcile on reconnect. Non-functional: durability (a file must never be lost), efficient sync (changing one byte must NOT re-upload a 1 GB file), low sync latency, scale to huge numbers of files/users, and consistency that handles concurrent edits sanely. Clarify scope: full file sync (Dropbox-style) vs collaborative real-time editing (Google Docs is a different, OT/CRDT problem). The defining challenges are moving the MINIMUM bytes when a file changes (you can't naively re-upload), storing petabytes durably and cheaply (dedup helps), and resolving conflicts when two devices edit the same file while disconnected. Sync is fundamentally a metadata problem layered over durable blob storage."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100M users, ~50 GB each -> ~5 EB of storage (object storage + dedup/tiering).\n  dedup across users (shared files, OS images) can cut this substantially\nChange rate: most edits touch a few chunks of a file, so upload volume <<\n  total file size -> delta sync is the big win.\nChunk size ~= 4 MB (typical): a 1 GB file = ~256 chunks; change 1 -> upload 1.\nMetadata: billions of files * chunk lists -> a large, sharded metadata store.\nTakeaway: storage is blob-dominated (dedup + tiering); sync cost is driven by\nchanged-chunk volume, not file size; metadata scale is its own problem."),
      C("hld", "High-level design",
        "A file is split into CHUNKS (fixed or content-defined), each identified by a content HASH. The client watches the filesystem, and on a change it computes which chunks differ, uploads ONLY those new chunks to object storage (skipping any whose hash already exists — dedup), and commits a new file VERSION (an ordered chunk list) to the METADATA service. The metadata service is the source of truth for 'what the file looks like'; a NOTIFICATION/sync service then tells the user's other devices that the file changed, and they pull the new metadata and fetch only the chunks they lack. Trace an edit: client diffs file -> uploads 2 changed chunks -> commits version v5 (chunk list) to metadata -> notify other devices -> device B pulls v5 metadata, downloads the 2 new chunks, reconstructs the file. Blobs live in durable object storage; metadata (small, transactional) lives in a separate scalable database; the two planes are decoupled."),
      K("api", "API design",
        "POST /api/v1/chunks { hash }      -> { needUpload: bool }   // dedup check\nPUT  /api/v1/chunks/{hash}         (upload chunk bytes if needed)\nPOST /api/v1/files/{id}/versions { chunkHashes:[...] } -> { version }\nGET  /api/v1/files/{id}            -> { version, chunkHashes }\nGET  /api/v1/changes?since=<cursor> -> { changed:[...], nextCursor }  // delta poll\nWS  push: { type:'CHANGED', fileId, version }   // notify other devices"),
      K("data_model", "Data model",
        "files:        file_id PK, owner_id, name, current_version, deleted\nversions:     (file_id, version) -> ordered [chunk_hash], created_at, device\nchunks:       chunk_hash PK -> storage_location, refcount   (content-addressed, dedup)\ndevice_cursor:(user_id, device_id) -> last_synced_version/cursor\nblobs:        chunks stored in object storage, keyed by hash (replicated/erasure)"),
      C("deep_dive", "Deep dive: chunking, dedup & delta sync",
        "The efficiency win is never moving more bytes than necessary. Split each file into CHUNKS and identify each by a content HASH (e.g. SHA-256). When a file changes, the client hashes its chunks and compares to the previous version's chunk list — only chunks whose hash changed are new, so it uploads just those (DELTA SYNC). Before uploading, it asks the server whether that hash already exists; if so, it skips the upload and just references it — DEDUPLICATION across versions AND across users (the same OS file or shared document is stored once, with a refcount). FIXED-size chunking is simple but a single inserted byte shifts every subsequent chunk's boundaries (cascading re-upload); CONTENT-DEFINED chunking (boundaries chosen by a rolling hash of the content) keeps most boundaries stable across inserts, so an insert only changes nearby chunks — far better dedup for edited files. This chunk-hash-dedup-delta pipeline is why changing one line of a huge file uploads kilobytes, not gigabytes."),
      C("deep_dive", "Deep dive: sync, versioning & conflict resolution",
        "Sync is coordinated through metadata, not by streaming files. Each device keeps a CURSOR (last version/sequence it has seen); to sync it asks 'what changed since my cursor?' and the metadata service returns the deltas, which the device applies by fetching missing chunks. A long-poll/WebSocket NOTIFICATION makes this near-real-time instead of periodic polling. VERSIONING falls out naturally: each commit is a new immutable version (chunk list), so history and restore are just pointing at an older version. CONFLICTS happen when two devices edit the same file while offline and both commit a new version from the same base — for file sync the pragmatic resolution is to keep both: accept one as the new version and save the other as a CONFLICTED COPY ('file (Device B's conflicted copy)'), letting the user merge, rather than silently losing an edit. (True real-time co-editing instead needs operational transforms/CRDTs — a different system.) Metadata-driven sync with explicit versions and conflict copies keeps it correct without losing data."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Metadata is the scaling pressure point — billions of files and chunk lists with frequent small updates need a sharded, write-capable store, and the 'what changed since X' query must be cheap (indexed by cursor). Many tiny chunks add metadata and request overhead — chunk size trades dedup granularity against overhead. Storage durability/cost at exabyte scale relies on object storage with erasure coding and tiering, plus dedup refcounting (don't delete a chunk another file references). Conflict handling must never lose data (conflicted copies). Trade-offs: fixed chunking (simple, poor dedup on inserts) vs content-defined (better dedup, more complex); aggressive dedup (cheap storage, refcount complexity) vs none; near-real-time push (responsive, more infra) vs periodic poll; keep-both conflict (safe, user merges) vs auto-merge (risky for arbitrary files). Closing signal: content-hashed chunks with dedup + delta sync, a metadata service of versions/cursors, push notifications, and conflict copies to avoid data loss."),
      C("deep_dive", "Deep dive: durability, sharing & operations",
        "Operationally the system must keep files safe and shareable. Durability: chunks live in object storage replicated across zones or erasure-coded (11 nines), with a background repair job re-replicating under-durable chunks; dedup means a chunk is shared, so deletion is refcounted (delete only when no version references it) and uses tombstones + garbage collection. Sharing & permissions: a sharing layer maps files/folders to users/groups with access control checked on every metadata and chunk request; a shared file is the same chunks referenced by multiple users (dedup again). Bandwidth/efficiency: on download, devices fetch only chunks they lack; LAN sync can copy chunks peer-to-peer to save WAN bandwidth. Integrity: content hashes double as checksums — a corrupted chunk is detected and re-fetched. Consistency: a committed version is the source of truth, so a device always converges to the latest metadata then fills chunks. Observability: sync latency, changed-chunk upload volume, dedup ratio, conflict rate, and durability/repair backlog are the SLOs. The spine holds: durable content-addressed chunks + a versioned metadata service + delta sync + conflict copies + access control."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How does one-byte change avoid re-upload?' content-defined chunking + hash diff uploads only changed chunks. 'Dedup across users?' content-addressed chunks with refcounts store shared data once. 'Conflicts from offline edits?' keep both via a conflicted copy; never silently lose an edit. 'Real-time co-editing?' that's OT/CRDT (Google Docs), a different design from file sync. 'Versioning/restore?' immutable per-commit chunk lists; restore points at an old version. 'Large files?' chunked + resumable upload. 'Bandwidth on slow links?' delta sync + LAN peer sync + compression. 'Sharing/permissions?' an ACL layer over metadata and chunk access. 'Deletion with dedup?' refcount + GC. Each returns to the spine: content-hashed chunks with dedup, delta sync driven by versioned metadata and device cursors, push notifications, and conflict copies for safety."),
    ],
    "File sync tests delta sync via content-hashed chunking + dedup (move only changed chunks, store shared chunks once), a metadata service of versions and device cursors driving sync, and conflict resolution that never loses data (conflicted copies). The signal is recognizing sync is a metadata problem over durable blob storage, not file streaming.",
    [
      G("reupload_whole", "Re-uploading the whole file on any change.", "Chunk + hash the file and upload only changed chunks (delta sync); dedup identical chunks.", "Upload sends the entire file on edit."),
      G("no_conflict", "No story for two devices editing the same file offline.", "Use versions + keep-both conflicted copies so no edit is lost.", "Last write silently overwrites the other."),
      G("blob_in_db", "Storing file bytes in the metadata database.", "Store chunks in object storage; keep only metadata/chunk lists in the DB.", "Schema stores file contents, not chunk references."),
    ],
    0.6, DIAG.filesync, "File sync (Dropbox) architecture"),

  // ──────────────────────── UNIQUE ID GENERATOR ────────────────────────────
  TT("sysd_m8", "sysd_m8_t6", 6, "Design a Unique ID Generator", "design-unique-id",
    ["case-study", "id-generation", "snowflake", "distributed"],
    "Many services across many machines all need to mint unique ids — billions per day — that are also roughly time-ordered, without coordinating on every single id. A central auto-increment can't keep up. How do independent machines generate globally-unique, sortable ids?",
    "The classic answer is SNOWFLAKE: pack a 64-bit id from a timestamp + a machine id + a per-millisecond sequence, so each node generates ids LOCALLY with no per-id coordination, ids are unique (machine id keeps nodes from colliding) and roughly time-sortable (timestamp is the high bits). Alternatives (UUID, DB ticket servers, range allocation) trade ordering, coordination, or size. The crux is uniqueness + ordering without a central bottleneck.",
    [
      C("requirements", "Requirements",
        "Functional: generate globally UNIQUE ids; high throughput (tens of thousands+ per second per node, billions/day total); ids should be roughly TIME-SORTABLE (useful as primary keys, for ordering, and for range scans); compact (ideally 64-bit so they fit a long and index well). Non-functional: no single-point coordination per id (that would bottleneck and add latency), high availability, and low latency (id generation must be near-instant and local). Clarify whether ordering matters (it usually does — sortable ids cluster well in indexes and give natural chronological order) and whether ids must be unpredictable (sequential ids leak volume/ordering). The core tension is uniqueness-at-scale vs coordination: a single global counter guarantees uniqueness but serializes every id behind one machine; the design's job is to get uniqueness and ordering while letting each node generate ids INDEPENDENTLY."),
      K("estimation", "Capacity estimation (with numbers)",
        "Target 100k ids/sec/node across, say, 100 nodes -> 10M ids/sec, ~860B/day.\nSnowflake 64-bit layout (typical):\n  41 bits timestamp (ms)  -> ~69 years of range\n  10 bits machine id      -> 1,024 nodes\n  12 bits sequence        -> 4,096 ids per ms PER node (= ~4M/sec/node)\n  4096 ids/ms easily covers 100k/sec/node with headroom.\nNo per-id network call -> generation is a few CPU instructions, fully local.\nTakeaway: bit-budget the id to your scale (nodes vs throughput vs lifespan);\nlocality is what delivers the throughput, not a faster central service."),
      C("hld", "High-level design",
        "Each application node runs an id generator that, on nextId(), reads the current millisecond timestamp, looks up its assigned machine id, and increments a per-millisecond sequence counter, then packs them into a 64-bit integer: [timestamp | machine_id | sequence]. No network call is involved — generation is purely local and lock-free per node — which is exactly why it scales. The only coordination is ONE-TIME: assigning each node a unique machine id at startup (via a coordination service like ZooKeeper/etcd, or config). Because the timestamp occupies the high bits, ids sort chronologically; because machine id differs per node and the sequence differs within a millisecond, ids never collide. Trace a generation: ts=now_ms, seq=next within this ms (wait for next ms if the 4096 sequence space is exhausted), id = (ts << 22) | (machine << 12) | seq. The system is essentially 'a good bit layout + one-time machine-id assignment + careful clock handling'."),
      K("api", "API / algorithm",
        "long nextId():\n  ts = currentMillis()\n  if ts == lastTs: seq = (seq + 1) & 0xFFF        // 12-bit sequence\n               if seq == 0: ts = waitNextMillis()   // sequence exhausted this ms\n  else:          seq = 0\n  lastTs = ts\n  return ((ts - EPOCH) << 22) | (machineId << 12) | seq\n// machineId assigned once at startup (ZooKeeper/etcd/config)"),
      K("data_model", "Bit layout",
        "64-bit id:\n  [ 1 unused ][ 41 bits timestamp ][ 10 bits machine ][ 12 bits sequence ]\n   sign        ms since custom epoch   worker id (<=1024)  per-ms counter (<=4096)\nmachine-id registry (coordination): node -> machine_id (unique, leased)\nNo per-id persistent state; only lastTs + seq held in memory per node."),
      C("deep_dive", "Deep dive: the Snowflake layout & clocks",
        "The 64 bits are budgeted deliberately. TIMESTAMP in the high bits (ms since a custom epoch, ~41 bits = ~69 years) makes ids monotonically increase over time, giving rough sortability and good index locality. MACHINE id (~10 bits = 1024 nodes) guarantees two nodes never produce the same id in the same millisecond. SEQUENCE (~12 bits = 4096) distinguishes ids generated within the same millisecond on one node; if a node exhausts 4096 ids in a millisecond, it busy-waits for the next millisecond. You can rebalance the bit budget (more machine bits for more nodes, more sequence bits for higher per-node throughput, fewer timestamp bits for shorter lifespan). The hard problem is CLOCKS: if a node's clock moves BACKWARD (NTP correction, leap second), it could regenerate timestamps it already used and produce duplicates — so the generator must DETECT backward movement and refuse/wait until the clock catches up to lastTs, never emitting an id with a smaller timestamp than one already issued. This clock discipline is the subtle correctness requirement."),
      C("deep_dive", "Deep dive: alternatives & trade-offs",
        "Know the options and why Snowflake usually wins. UUID v4 (random 128-bit): zero coordination and globally unique, but NOT time-sortable (random) and 128 bits, which fragments database indexes and hurts insert performance — fine for opacity, poor as a clustered key. (UUID v7 fixes ordering by embedding a timestamp, a modern alternative.) DB AUTO-INCREMENT: simple and ordered but a single-writer bottleneck and SPOF; doesn't scale across nodes. DB TICKET / RANGE allocation: a node grabs a block of ids (e.g. 1000–1999) from a central service and mints them locally, amortizing coordination to once-per-block — scalable and ordered-ish, but ranges can interleave across nodes and the allocator is a dependency. Snowflake: local generation, 64-bit, time-sortable, only one-time coordination — the common default when you want sortable ids at scale. The trade-off axes are coordination (per-id vs per-block vs one-time vs none), ordering (sortable vs random), and size (64 vs 128 bit)."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Clock skew is the real risk: a backward clock jump can cause duplicate ids, so generators must monitor the clock and stall on backward movement (and you must keep NTP healthy) — this is the correctness bottleneck, not throughput. Machine-id assignment must be coordinated so two nodes never share an id (a stale/duplicated machine id silently breaks uniqueness) — use leases from a coordination service and reclaim on node death. Sequence overflow within a millisecond forces a wait (rare at 4096/ms). Predictability: sequential timestamps leak creation time and volume — add randomness or encrypt if that matters. Trade-offs: Snowflake (sortable, 64-bit, one-time coord, clock-sensitive) vs UUIDv4 (no coord, unsortable, 128-bit) vs range allocation (scalable, allocator dependency) vs DB auto-inc (simple, bottleneck). Closing signal: a 64-bit timestamp+machine+sequence id generated locally, with one-time machine-id coordination and strict backward-clock handling."),
      C("deep_dive", "Deep dive: machine-id assignment & operations",
        "Operationally the only coordination — assigning machine ids — must be reliable. Assignment: a coordination service (ZooKeeper/etcd) hands each starting node a unique machine id via an ephemeral/leased node, so ids are reclaimed when a node dies and never duplicated; alternatively derive it from a stable host identity, but guard against collisions. Clock operations: run NTP, monitor clock drift, and have the generator refuse to emit ids while the clock is behind lastTs (alert if this persists). Throughput headroom: if one node needs more than 4096 ids/ms, rebalance bits toward sequence or shard generation across more machine ids. Availability: because generation is local, there's no central dependency on the hot path — a node keeps minting ids even if the coordination service is briefly down (it only needs its machine id at startup). Capacity planning: pick the epoch and bit split for your expected lifespan, node count, and per-node rate up front (changing the layout later is painful). Observability: ids/sec, sequence-exhaustion waits, and clock-skew events are the SLOs. The spine holds: local bit-packed generation, one-time machine-id leasing, and rigorous clock handling."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not a central counter / DB auto-increment?' it bottlenecks and is a SPOF — generate locally instead. 'Why not UUID?' v4 isn't sortable and is 128-bit (index-unfriendly); use Snowflake or UUIDv7 for ordering. 'What if the clock goes backward?' detect it and stall until caught up; never emit a smaller timestamp than already issued. 'How are machine ids assigned?' leased from ZooKeeper/etcd, reclaimed on death. 'Exhaust the sequence in a millisecond?' wait for the next ms (or widen sequence bits). 'Need unpredictable ids?' Snowflake leaks order/time — add randomness or encrypt. 'Need strict monotonicity, not just rough?' single-node or coordinated sequence (gives up some scale). Each returns to the spine: a bit-packed 64-bit id generated locally for uniqueness + sortability, with one-time machine-id coordination and disciplined clock handling."),
    ],
    "A unique ID generator tests Snowflake-style local generation: a 64-bit timestamp+machine+sequence layout that yields unique, time-sortable ids with no per-id coordination, the clock-skew correctness pitfall, and the trade-offs vs UUID/DB-auto-increment/range allocation. The signal is rejecting a central counter and handling backward clocks.",
    [
      G("central_counter", "Using a single DB auto-increment / central counter per id.", "Generate locally (Snowflake): timestamp+machine+sequence, no per-id coordination.", "Every id is a central INSERT/INCR."),
      G("ignore_clock", "Ignoring clock skew / backward time jumps (duplicate ids).", "Detect backward movement and stall until the clock passes lastTs.", "Uses wall-clock with no backward-jump handling."),
      G("uuid_as_key", "Using random UUIDv4 as a sortable primary key.", "Use a time-sortable id (Snowflake/UUIDv7) for ordering + index locality.", "Picks UUIDv4 then expects chronological ordering."),
    ],
    0.5, DIAG.uid, "Unique ID generator (Snowflake) layout"),

  // ───────────────────────────── OBJECT STORE (S3) ─────────────────────────
  TT("sysd_m8", "sysd_m8_t7", 7, "Design an Object Store (S3)", "design-object-store",
    ["case-study", "object-storage", "durability", "erasure-coding"],
    "Store an effectively unlimited number of objects by key — from tiny files to multi-GB blobs — with eleven nines of durability and high availability, across commodity disks that fail constantly. How do you never lose data while scaling to exabytes?",
    "Objects are stored across many commodity STORAGE NODES; a METADATA service maps each key to where its data lives. Durability comes from REPLICATION or, more efficiently, ERASURE CODING (split into k data + m parity shards across nodes/zones, survive m failures with far less overhead than 3x copies), maintained by a background REPAIR process. A flat bucket/key namespace and consistent-hash placement let it scale horizontally to exabytes.",
    [
      C("requirements", "Requirements",
        "Functional: PUT/GET/DELETE an object by key within a bucket; list objects; support objects from bytes to many GB (multipart upload); a flat key namespace (not a real filesystem hierarchy). Non-functional: extreme DURABILITY (the headline — ~11 nines, i.e. don't lose objects even as disks fail daily), high availability, effectively unlimited scalability (exabytes, trillions of objects), and good throughput. Clarify scope: object storage (immutable blobs by key) vs block/file storage (object storage is the web-scale blob case behind S3, image/video stores, backups, data lakes). The defining requirement is DURABILITY at massive scale on UNRELIABLE commodity hardware — disks and nodes fail constantly, so the system must store redundant data and continuously repair it, while a metadata layer keeps track of trillions of keys. Throughput and large-object handling matter but durability is the differentiator."),
      K("estimation", "Capacity estimation (with numbers)",
        "Target 1 EB usable, trillions of objects.\nDurability via 3x replication = 3 EB raw; via erasure coding (e.g. 10+4) =\n  1.4 EB raw -> ~2x less storage than replication for similar durability.\nDisk failure: at this scale disks fail every few minutes -> background repair\n  must outrun failures (re-replicate/reconstruct lost shards continuously).\nMetadata: trillions of keys * ~hundreds of bytes -> a large sharded index.\nTakeaway: durability technique (replication vs erasure coding) drives cost;\nrepair throughput must exceed failure rate; metadata is its own scaling problem."),
      C("hld", "High-level design",
        "An API/load-balancer tier accepts requests. On PUT, the data is written to multiple STORAGE NODES (replicas) or split into erasure-coded shards spread across nodes and failure domains (zones/racks), and the METADATA service records the mapping key -> {object info, shard/replica locations, etag}. On GET, the metadata service resolves the key to its locations and the data is read back (reconstructed from shards if needed). Placement uses consistent hashing so objects spread evenly and adding capacity moves little data. A background DURABILITY/REPAIR service constantly scans for under-replicated or lost shards (from failed disks) and rebuilds them. Trace a PUT: client PUTs key -> data erasure-coded into 10+4 shards across 14 nodes in different racks -> metadata records the 14 locations + etag -> ack. Trace a GET: resolve key -> read shards -> reconstruct -> return. Metadata (small, transactional) and data (huge, on storage nodes) are separate planes."),
      K("api", "API design",
        "PUT    /{bucket}/{key}            (body = object bytes)  -> 200 { etag }\nGET    /{bucket}/{key}            -> object bytes (+ etag)\nDELETE /{bucket}/{key}\nGET    /{bucket}?prefix=&marker=  -> list keys (paginated)\nMultipart (large objects):\n  POST /{bucket}/{key}?uploads -> uploadId\n  PUT  .../{partNumber}        (upload each part) ; POST complete -> assembles"),
      K("data_model", "Data model",
        "metadata (sharded index):\n  (bucket, key) PK -> { size, etag, created_at, locations:[node/shard ids], storage_class }\nstorage nodes:  hold replicas OR erasure shards of object data on local disks\nplacement:      consistent hashing (key -> set of nodes/failure domains)\nbuckets:        bucket -> owner, policy, region   (flat key namespace within)\n-- objects are immutable; overwrite = new version/etag"),
      C("deep_dive", "Deep dive: durability via replication vs erasure coding",
        "Durability is the whole point, achieved by storing redundant copies so that disk/node failures don't lose data. REPLICATION keeps N full copies (e.g. 3x) on different nodes/zones: simple, fast reads (any copy), survives N-1 failures, but costs Nx storage. ERASURE CODING is smarter: split an object into k DATA shards and compute m PARITY shards (e.g. 10+4), store all k+m on different failure domains, and you can reconstruct the object from ANY k of the k+m shards — so you survive m simultaneous failures while storing only (k+m)/k x the data (1.4x for 10+4 vs 3x for replication). The trade-off: erasure coding cuts storage cost dramatically (key at exabyte scale) but reconstructing an object requires reading several shards (more IO/CPU and higher small-object/latency overhead), so systems often replicate small/hot objects and erasure-code large/cold ones. Spreading shards across racks/zones/regions ensures a correlated failure (a rack or zone loss) doesn't take out enough shards to lose data. This redundancy + placement is how you reach eleven nines."),
      C("deep_dive", "Deep dive: metadata, placement & repair",
        "Beyond storing bytes, you must FIND them and KEEP them safe. Metadata: a key->locations index for trillions of objects is too big for one node, so it's sharded (by bucket/key hash) and itself replicated; it must support fast point lookups (GET) and prefix listing. Placement: consistent hashing maps a key to a set of nodes/failure domains so objects spread evenly and adding nodes rebalances minimally; placement deliberately spans racks/zones for failure independence. REPAIR (anti-entropy): a background process continuously verifies that every object still has its full redundancy — when a disk or node dies, the shards/replicas it held are reconstructed from the survivors and re-placed, and this repair must run FASTER than the failure rate or durability erodes. Scrubbing reads data periodically to catch silent corruption (bit rot) via checksums and re-heals it. Note the namespace is FLAT (bucket+key), not a directory tree — 'folders' are just key prefixes — which keeps listing and placement simple at scale. Metadata + consistent-hash placement + relentless repair is what operationalizes durability."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Metadata scale is a primary bottleneck — trillions of keys need a sharded, replicated index with fast lookup and listing. Repair throughput must exceed failure rate, or lost redundancy accumulates — provision repair bandwidth accordingly. Hot objects concentrate read load — replicate hot objects or front with a CDN. Large objects need multipart upload (parallel parts, resumable) and streaming. Small objects suffer under erasure coding's per-shard overhead — replicate them instead. Consistency: object stores are often read-after-write consistent for new keys but eventually consistent for overwrites/deletes (a tunable trade for availability). Trade-offs: replication (simple, fast reads, 3x cost) vs erasure coding (1.4x cost, reconstruction overhead); strong vs eventual consistency; tiering hot/cold for cost. Closing signal: data sharded across nodes with erasure coding + cross-failure-domain placement + background repair, fronted by a sharded metadata index, flat bucket/key namespace."),
      C("deep_dive", "Deep dive: consistency, tiering & operations",
        "Operationally the store balances durability, cost, and access. Consistency: new-object writes are typically read-after-write consistent (you can GET what you just PUT), while overwrites/deletes may be eventually consistent across replicas — be explicit, since clients build on these guarantees. Integrity: every shard/replica carries a checksum (etag); reads verify it and trigger repair on mismatch (silent corruption defense). Tiering: move cold objects to cheaper, slower storage classes (and archive/glacier tiers) automatically by access patterns/age — most data is rarely read, so tiering is a huge cost lever. Lifecycle: policies expire or transition objects; versioning keeps prior versions (overwrite = new etag) for recovery. Multi-region: replicate buckets across regions for disaster recovery and low-latency access, accepting async cross-region consistency. Large/parallel: multipart upload splits big objects into parts uploaded in parallel and assembled, with resumability. Observability: durability (lost/under-replicated objects — should be ~zero), repair backlog, request latency/availability, and storage-by-tier are the SLOs. The spine holds: erasure-coded, cross-domain-placed, checksummed, continuously-repaired data behind a sharded metadata index, with tiering for cost."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How do you get 11 nines?' redundancy (replication or erasure coding) across failure domains + continuous repair faster than failures + scrubbing for bit rot. 'Replication vs erasure coding?' replication for small/hot (simple, fast), erasure coding for large/cold (much cheaper). 'Huge objects?' multipart upload (parallel, resumable parts). 'Find an object among trillions?' a sharded, replicated metadata index. 'Consistency?' read-after-write for new keys, eventual for overwrites/deletes. 'Cut cost?' tiering hot/cold + erasure coding + dedup. 'Hot object?' replicate/CDN. 'Disaster recovery?' cross-region replication. 'Corruption?' checksums + scrubbing + repair. Each returns to the spine: redundant, cross-domain-placed, checksummed object data with relentless repair, indexed by a sharded metadata service over a flat bucket/key namespace."),
    ],
    "An object store tests durability at scale: redundancy via replication vs erasure coding (k+m shards across failure domains), a sharded metadata index mapping keys to locations, consistent-hash placement, and background repair that outpaces constant disk failure. The signal is erasure coding for cost-efficient 11-nines durability and treating repair as a first-class, always-on process.",
    [
      G("single_copy", "Storing one copy / ignoring how durability is achieved.", "Use replication or erasure coding across failure domains + background repair.", "No redundancy or repair story for disk failures."),
      G("replication_only", "Defaulting to 3x replication everywhere, ignoring cost.", "Erasure-code large/cold objects (e.g. 10+4 = 1.4x) for cheaper durability.", "Always 3x replication even at exabyte scale."),
      G("fs_namespace", "Modeling it as a hierarchical filesystem instead of flat keys.", "Use a flat bucket/key namespace; 'folders' are just key prefixes.", "Designs directories/inodes rather than a key->object index."),
    ],
    0.6, DIAG.objstore, "Object store (S3) architecture"),

  // ───────────────────────── PROXIMITY / NEARBY ────────────────────────────
  TT("sysd_m8", "sysd_m8_t8", 8, "Design a Proximity / Nearby Service", "design-proximity",
    ["case-study", "proximity", "geospatial", "geohash"],
    "Show me restaurants (or friends) within 2 km, nearest first — instantly, from a database of hundreds of millions of places. Scanning every place and computing distance per query is hopeless. What index makes 'near this point' fast?",
    "A GEOSPATIAL INDEX: encode each place's location into a grid/tree (geohash, quadtree, or S2 cells) where nearby points share a cell or prefix, so a radius query becomes 'fetch the few cells covering the radius' instead of scanning everything. Candidates from those cells are then filtered by exact distance and ranked. Cell size, dense-area handling, and boundary cases are the substance.",
    [
      C("requirements", "Requirements",
        "Functional: given a location and a radius (or 'top N nearest'), return nearby entities (places, drivers, friends) ranked by distance; support filters (open now, category); and handle updates (new/closed places, or moving entities). Non-functional: very low query latency (sub-100ms — this powers interactive maps/search), scale to hundreds of millions of entities and high query QPS, and freshness appropriate to the data (static places vs moving users). Clarify scope: mostly-STATIC entities (restaurants, ATMs — index once, query a lot) vs DYNAMIC entities (drivers, friends — high update rate, the ride-sharing problem). The core challenge is the same: you cannot scan all entities and compute distance per query, so you need a spatial index that turns 'find within radius' into touching only the cells that overlap the search area — converting an O(n) scan into an O(nearby) lookup."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100M places, 50k nearby-queries/sec at peak.\n  full scan per query = 100M * 50k = impossible -> need a spatial index\nWith a grid index, a 2 km query touches a handful of cells holding maybe\n  hundreds-thousands of candidates -> distance-filter those, return top N.\nIndex memory: 100M places * ~100 B ~= 10 GB -> in-memory across a few nodes.\nDynamic case (moving entities): updates dominate (like ride-sharing's ~1M/s).\nTakeaway: the spatial index bounds each query to nearby cells; static data is\nindexed once and read-heavy, dynamic data adds a high write/update rate."),
      C("hld", "High-level design",
        "Each entity's (lat, lng) is encoded into a spatial cell and stored in a GEO INDEX (cell_id -> the entities in that cell), kept in memory for speed (e.g. Redis geo/sorted sets, or a custom service), sharded by region. A nearby query: compute the set of cells that COVER the search radius around the query point, fetch the candidate entities in those cells, compute EXACT distance to each candidate, drop those outside the radius, and rank by distance (apply filters, paginate). Entity metadata (name, category, hours) lives in a separate store, joined for the result. Trace a query: point + 2 km -> determine covering cells (the query cell + neighbors) -> fetch candidates -> haversine distance filter -> sort -> top N. For static data the index is built/refreshed in batch; for dynamic data, entities update their cell as they move (re-bucket on movement), exactly like the ride-sharing geo index."),
      K("api", "API design",
        "GET /api/v1/nearby?lat=..&lng=..&radius_m=2000&category=restaurant&limit=20\n  200: { results: [ { id, name, distance_m, lat, lng } ] }  // sorted by distance\nInternal:\n  index.add(id, lat, lng)        // encode -> cell -> store\n  index.move(id, lat, lng)       // dynamic entities re-bucket\n  index.queryRadius(lat,lng,r) -> candidate ids in covering cells"),
      K("data_model", "Data model",
        "geo index (in-memory):  cell_id -> set of entity ids   (geohash prefix / quadtree / S2)\n  cell_id = geohash(lat, lng, precision)\nentity store:  id PK -> { lat, lng, name, category, hours, ... }\nsharding:      by region / cell range across nodes\n(dynamic) moving entities update their cell membership on location change"),
      C("deep_dive", "Deep dive: geospatial indexing techniques",
        "The index turns 2D proximity into something lookup-friendly. GEOHASH interleaves latitude/longitude bits into a base-32 string where a shared PREFIX means spatial closeness — so a cell is a prefix, and nearby points share prefixes; a radius query fetches the query's cell plus its 8 neighbors (to handle points just across a boundary). QUADTREE recursively subdivides space into four quadrants, going deeper only where entities are dense — so dense cities get fine cells and empty oceans stay coarse, balancing candidates per cell. S2 (Google) / H3 (Uber) map the sphere to hierarchical cells with nice neighbor/coverage properties and less distortion than lat/lng grids. All share the same idea: precompute a cell id per entity so 'find nearby' reads a bounded set of cells. The key tuning knob is CELL SIZE / precision: too coarse and a cell returns too many candidates to distance-filter; too fine and a radius spans many cells and boundary handling dominates — pick precision to match typical query radius and entity density."),
      C("deep_dive", "Deep dive: query, ranking, density & precision",
        "A radius query is two phases: a cheap CANDIDATE fetch from the covering cells, then an exact distance FILTER + rank. Covering the radius: from the query point, determine which cells the circle overlaps (the center cell and neighbors, or a quadtree/S2 region cover) and union their entities. Then compute true great-circle (haversine) distance to each candidate, discard those beyond the radius (cells are squares, the query is a circle — so candidates near corners may be outside), and sort ascending; apply attribute filters (open now, category) and paginate. DENSITY is the practical headache: a dense downtown cell can hold huge numbers of places, so either use an adaptive structure (quadtree subdivides dense areas) or cap/paginate candidates; sparse areas may need to expand the search to neighboring cells to find N results. For 'top N nearest' rather than fixed radius, start with a small cell and EXPAND outward until you have N candidates, then rank. Precision and density handling are what keep both latency and result quality good across cities and countryside."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Dense areas create hot cells with many candidates — adaptive cells (quadtree/S2), sharding, and caching popular query areas mitigate this. Boundary cases (points just outside the query cell) require checking neighbor cells, adding work — handled by the covering-set logic. For DYNAMIC entities, the update rate (re-bucketing as things move) becomes the bottleneck — an in-memory, region-sharded index like ride-sharing's. Cell-size choice is a fundamental trade: coarse (fewer cells per query, more candidates to filter) vs fine (fewer candidates, more cells + boundaries). Trade-offs: geohash (simple prefixes, fixed grid, boundary neighbors) vs quadtree (adaptive to density, more complex) vs S2/H3 (good sphere coverage, library needed); static (index once, read-heavy) vs dynamic (high update rate); fixed radius vs expanding top-N. Closing signal: a spatial index (geohash/quadtree/S2) that bounds queries to covering cells, a candidate-then-exact-distance two-phase query, region sharding, and density-aware cell sizing."),
      C("deep_dive", "Deep dive: static vs dynamic, scale & operations",
        "Operationally, the data's mutability shapes everything. STATIC entities (places): build the index in batch from the place database, refresh on changes (new/closed/edited places), replicate the in-memory index for read QPS, and cache hot query areas — it's a read-heavy serving system. DYNAMIC entities (drivers/friends): locations change constantly, so the index must support high-rate re-bucketing (move an entity between cells as it crosses a boundary), kept in memory and sharded by region so a city's updates stay local — the same machinery as ride-sharing. Scale: shard the index by geographic region so queries and updates are local and the system grows by adding regions; replicate shards for availability and read throughput. Joining metadata: keep heavy attributes (name, photos, hours) in a separate store and fetch them only for the final ranked candidates, keeping the index lean. Observability: query latency p99, candidates-per-query (a proxy for cell tuning), update lag (dynamic), and cache hit rate are the SLOs. The spine holds: a region-sharded spatial index bounding queries to covering cells, two-phase distance ranking, tuned for density and the static/dynamic nature of the data."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How do you avoid scanning all places?' a spatial index (geohash/quadtree/S2) so a query touches only covering cells. 'Boundary points?' include neighbor cells in the cover. 'Dense city cells?' adaptive quadtree/S2 or cap+paginate candidates. 'Top-N nearest vs radius?' expand the search outward until N candidates, then rank. 'Moving entities (drivers/friends)?' high-rate re-bucketing, in-memory region-sharded index (ride-sharing). 'Exact vs approximate distance?' filter candidates by true haversine distance after the cell fetch. 'Filters (open now)?' apply attribute filters on candidates. 'Global scale?' shard by region, replicate, cache. Each returns to the spine: a spatial index that bounds the query to nearby cells, candidate-then-exact-distance ranking, sharded by region and tuned for density."),
    ],
    "A proximity service tests geospatial indexing (geohash/quadtree/S2) to bound a radius query to covering cells instead of scanning, a two-phase candidate-then-exact-distance query, density-aware cell sizing, and region sharding — with the static-vs-dynamic distinction (places vs moving entities). The signal is never scanning all entities and tuning cell precision to radius/density.",
    [
      G("scan_all", "Scanning all entities and computing distance per query.", "Use a spatial index so a query touches only the cells covering the radius.", "Computes distance to every place per request."),
      G("ignore_boundary", "Querying only the point's single cell, missing nearby points across a boundary.", "Include neighbor cells (cover the radius) and exact-distance filter candidates.", "Returns only one cell's contents as 'nearby'."),
      G("cell_size", "No thought to cell size / dense-area handling.", "Tune precision to typical radius/density; use adaptive cells (quadtree/S2) for dense areas.", "Fixed coarse grid that returns huge candidate sets in cities."),
    ],
    0.5, DIAG.prox, "Proximity / nearby service architecture"),

  // ───────────────────────────── DISTRIBUTED LOCK ──────────────────────────
  TT("sysd_m9", "sysd_m9_t4", 4, "Design a Distributed Lock", "design-distributed-lock",
    ["case-study", "distributed-lock", "lease", "fencing"],
    "Across many processes on many machines, exactly one must do a critical action at a time (charge a card once, run a job once). There's no shared memory. How do you grant mutual exclusion that's still safe when the lock holder crashes or pauses?",
    "A LOCK SERVICE grants a key to one holder at a time. Two ideas make it correct: a LEASE/TTL so a crashed holder's lock auto-releases (no permanent deadlock), and a FENCING TOKEN (a monotonically increasing number issued with the lock) that the protected resource checks, so a stale holder whose lease expired can't still act. For real safety prefer a consensus store (ZooKeeper/etcd) over a single Redis; this is a CP problem.",
    [
      C("requirements", "Requirements",
        "Functional: acquire a named lock (block or fail if held), release it, and renew/extend it; only ONE holder at a time. Non-functional: SAFETY (never two holders simultaneously — the cardinal requirement), LIVENESS (a crashed holder must not block others forever), low latency, and availability of the lock service. Clarify what the lock protects and the cost of a violation: if two holders briefly acting is catastrophic (double-charge, data corruption), you need strong safety (a CP store + fencing); if it's merely an optimization (avoid duplicate work, usually fine if it occasionally runs twice), a lighter approach suffices. The deep challenge is that in a distributed system you cannot assume the holder is alive and well: it can CRASH (needs auto-release) or PAUSE (GC/network stall) past its lease while THINKING it still holds the lock — so the design must make a stale holder's actions harmless, which TTL alone cannot guarantee."),
      K("estimation", "Capacity estimation (with numbers)",
        "Lock ops are modest vs data ops -- maybe thousands/sec for a busy resource.\nLatency: an acquire is 1 round-trip to the lock service (single-digit ms).\nLease/TTL: pick > expected critical-section time but short enough to recover fast\n  (e.g. 10-30s) with renewal (heartbeat) for long sections.\nThe lock service is small but must be HIGHLY AVAILABLE and CORRECT -> a\n  replicated consensus cluster (3-5 nodes) for ZK/etcd.\nTakeaway: this isn't a throughput problem -- it's a correctness/availability\nproblem; the hard parts are crashes, pauses, and clocks, not scale."),
      C("hld", "High-level design",
        "Clients acquire a lock from a LOCK SERVICE keyed by a name (e.g. lock:account:123). The service grants the key to exactly one client and returns a lease with a TTL and a FENCING TOKEN (a number that increases on each successful grant). The holder does its critical work, optionally RENEWING the lease (heartbeat) for long operations, then RELEASES. If the holder crashes, the lease EXPIRES and the lock becomes available — no permanent deadlock. Crucially, the protected RESOURCE checks the fencing token: it remembers the highest token it has seen and REJECTS any operation carrying an older token, so a holder whose lease expired (but who thinks it still holds the lock) cannot corrupt state. Trace it: A acquires lock(token=33) -> A pauses (GC) past its TTL -> lease expires -> B acquires lock(token=34) -> A wakes and writes with token 33 -> the resource rejects 33 (< 34). Implementations: Redis (SET key val NX PX ttl) for the lightweight case, or ZooKeeper/etcd ephemeral nodes + consensus for strong safety."),
      K("api", "API design",
        "acquire(key, ttlMs) -> { acquired: bool, token: long }   // token = fencing token\nrenew(key, token, ttlMs) -> bool                          // extend lease (heartbeat)\nrelease(key, token) -> void                               // only holder releases\n// Protected resource enforces: reject op if op.token < lastSeenToken[key]\n// Redis-style: SET key owner NX PX ttl  (NX = only if absent)"),
      K("data_model", "Data model",
        "lock record (in the lock service):\n  key -> { owner_id, fencing_token (monotonic), expires_at }\nfencing state (at the resource):\n  key -> highest_token_seen   (reject writes with a lower token)\nZooKeeper/etcd variant: an EPHEMERAL node per lock (auto-deleted when the\n  client session dies = automatic release); sequence number = fencing token."),
      C("deep_dive", "Deep dive: leases, TTLs & fencing tokens",
        "Two mechanisms together give safety AND liveness. The LEASE/TTL solves liveness: the lock is granted for a bounded time and auto-expires, so a crashed holder doesn't deadlock everyone forever; long critical sections RENEW the lease via heartbeats. But TTL alone is NOT safe: a holder can be paused (a long GC pause or network partition) beyond its TTL without knowing it — the lock expires, someone else acquires it, and now the paused holder wakes up and acts, believing it still holds the lock = TWO holders. The FENCING TOKEN closes this hole: each grant carries a strictly increasing number, and every write to the protected resource includes its token; the resource tracks the highest token it has accepted and REJECTS anything lower. So even if a zombie holder acts after its lease expired, its old token is stale and refused — the lock's correctness no longer depends on perfect clocks or the holder noticing expiry. Fencing is the piece naive lock designs miss, and it's the one interviewers probe."),
      C("deep_dive", "Deep dive: implementations & safety (Redis vs consensus)",
        "Where the lock lives determines how safe it is. REDIS single-instance: SET key owner NX PX ttl is a cheap lock (atomic acquire-if-absent with TTL), fine for best-effort mutual exclusion, but if that Redis fails over to a replica that hadn't yet received the lock, two clients can hold it — not safe under failure. REDLOCK (acquire on a majority of N independent Redis nodes) was proposed to harden this, but it's CONTROVERSIAL: it leans on timing assumptions that GC pauses/clock skew can violate, so experts argue it's not truly safe without fencing tokens anyway. CONSENSUS stores (ZooKeeper, etcd) are the strong choice: they use a consensus protocol (ZAB/Raft) for a consistent, replicated lock state, and EPHEMERAL nodes tied to a client session auto-release on crash/disconnect, with a sequence number serving as the fencing token. The rule of thumb: if a double-hold is merely inefficient, Redis is fine; if it's catastrophic, use a CP consensus store AND fencing tokens. Safety comes from consensus + fencing, not from clever timing."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The classic failure is a GC pause or network stall making a holder a 'zombie' that acts after its lease expired — defended ONLY by fencing tokens, not TTLs. Clock dependence is dangerous: any design whose safety relies on synchronized clocks (some Redlock arguments) can break under skew — prefer logical fencing. The lock service is a dependency and potential SPOF/bottleneck — use a replicated consensus cluster (3-5 nodes) for availability, accepting consensus latency. Availability vs safety is the core CAP-flavored trade: a CP lock service may become unavailable during a partition (correct: better no lock than two holders) rather than risk a split-brain double-grant. Lock granularity matters — coarse locks serialize too much (throughput), fine locks add overhead/deadlock risk. Trade-offs: Redis lock (fast, not failure-safe) vs ZK/etcd (safe, heavier); TTL-only (deadlock-free, not safe) vs TTL+fencing (safe); availability vs consistency. Closing signal: a CP lock service granting one holder, lease/TTL for liveness, and fencing tokens checked by the resource for safety."),
      C("deep_dive", "Deep dive: failure modes & operations",
        "Operationally, the lock must fail safe. Crash of the holder: the lease expires (or the ephemeral node vanishes) and the lock frees automatically — liveness preserved. Pause/partition of the holder: TTL expires and another client acquires; the fencing token makes the zombie's late writes harmless — safety preserved. Lock-service partition: a CP service (ZK/etcd) on the minority side refuses to grant/renew (so it won't create a second holder), which means clients there lose the lock — the system favors correctness over availability. Renewal: long jobs heartbeat to extend the lease; if a heartbeat fails (the client suspects it lost the lock), it must STOP touching the resource. Avoiding deadlock: always use TTLs (never an indefinite lock), acquire multiple locks in a consistent order, and prefer short critical sections. Reentrancy/ownership: only the owner (matching token) may release, preventing one client from freeing another's lock. Observability: lock wait time, hold time, contention, expiry/steal events, and lock-service availability are the SLOs. The spine holds: consensus-backed grants, lease/TTL for liveness, fencing tokens for safety, fail-safe on partition."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'What if the holder crashes?' lease/TTL (or ephemeral node) auto-releases the lock. 'What if it pauses past the TTL?' a fencing token makes its late writes get rejected by the resource — TTL alone isn't safe. 'Is a single Redis lock safe?' no, failover can double-grant; use Redlock cautiously or a consensus store for real safety. 'ZooKeeper/etcd?' ephemeral nodes + consensus + sequence-number fencing = strong. 'Availability during a partition?' a CP lock prefers unavailability over split-brain. 'Long critical sections?' renew via heartbeat; stop work if renewal fails. 'Deadlocks?' TTLs + consistent lock ordering. 'Who can release?' only the token owner. Each returns to the spine: a CP lock service, lease/TTL for liveness, and fencing tokens for safety — correctness over availability when they conflict."),
    ],
    "A distributed lock tests safety vs liveness: a lease/TTL so a crashed holder auto-releases (liveness) AND a fencing token the resource checks so a paused/zombie holder can't act after expiry (safety), plus choosing a CP consensus store (ZooKeeper/etcd) over a single Redis when a double-hold is catastrophic. The signal is naming the GC-pause failure and fencing tokens, not relying on TTL/clocks alone.",
    [
      G("ttl_only", "Relying on TTL alone, ignoring the paused-holder (zombie) problem.", "Add fencing tokens the resource checks so stale holders' writes are rejected.", "TTL lock with no fencing; assumes holder notices expiry."),
      G("single_redis", "Assuming a single-instance Redis lock is safe under failure.", "Use a CP consensus store (ZK/etcd) for safety, or Redlock+fencing cautiously.", "Single Redis SET NX with no failover/safety consideration."),
      G("ignore_partition", "No availability-vs-safety decision for a lock-service partition.", "Favor safety: a CP lock refuses to grant on the minority side (no split-brain).", "Assumes the lock service is always available and consistent."),
    ],
    0.7, DIAG.lock, "Distributed lock architecture"),

  // ───────────────────── DISTRIBUTED JOB SCHEDULER ─────────────────────────
  TT("sysd_m8", "sysd_m8_t5", 5, "Design a Distributed Job Scheduler", "design-job-scheduler",
    ["case-study", "scheduler", "cron", "queue"],
    "Run millions of jobs at their scheduled times — cron-style recurring jobs, one-off delayed tasks (send this email in 3 days) — reliably, across a fleet of workers, without missing a run or executing the same job twice. What triggers a job at the right moment, and what guarantees it runs exactly once-ish?",
    "A scheduler stores jobs ordered by NEXT-RUN time; a dispatcher finds DUE jobs (by polling the sorted store, or a delay-queue/timing-wheel) and enqueues them; distributed WORKERS pull from the queue, execute, and report status, with RETRIES on failure. Leader election / locking ensures a due job is dispatched only ONCE, and idempotent jobs + at-least-once execution give effectively exactly-once. Reliable triggering and no-double-run are the substance.",
    [
      C("requirements", "Requirements",
        "Functional: schedule recurring (cron) and one-off/delayed jobs; execute them at (or near) their scheduled time across many workers; retry failures; report status/history; allow cancel/update. Non-functional: reliability (a scheduled job must RUN — no missed executions), no (or minimal) DUPLICATE executions, scale to millions of jobs and high schedule density, fault tolerance (a crashed scheduler/worker must not lose or duplicate work), and reasonable timing precision. Clarify the execution guarantee: true exactly-once is impossible across failures, so the realistic target is AT-LEAST-ONCE execution + idempotent jobs = exactly-once effect (or at-most-once if duplicates are worse than misses). The two hard problems are TRIGGERING — efficiently finding which of millions of jobs are due right now without scanning everything every second — and COORDINATION — making sure that when a job is due, exactly one worker runs it despite multiple schedulers/workers and crashes."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 10M scheduled jobs; bursts at popular times (00:00, top of the hour).\n  a midnight cron spike could make millions due in the same minute -> smear/queue\nDispatch: find due jobs each tick -> index jobs by next_run (sorted) so 'due now'\n  is a range read, not a scan of 10M.\nExecution: workers pull from a queue; scale workers to the due rate.\nStorage: jobs (definition + next_run + state) in a sharded DB; history appended.\nTakeaway: trigger via a sorted/next_run index (not polling all jobs), absorb\nspikes with a queue, and coordinate dispatch so each due job runs once."),
      C("hld", "High-level design",
        "Jobs are stored with their schedule and NEXT_RUN time. A DISPATCHER periodically finds jobs whose next_run <= now (a range query on a next_run index, NOT a scan) and enqueues each onto a work QUEUE; for a recurring job it also computes and stores the next occurrence. WORKERS pull jobs from the queue, execute them, and write status (success/failure); failures are RETRIED (re-enqueued with backoff, then dead-lettered). To prevent the same due job being dispatched twice by multiple scheduler instances, dispatch is COORDINATED — via leader election (one active dispatcher) or a per-job lock/atomic claim (compare-and-set the job to 'dispatched'). Trace a job: cron '0 0 * * *' stored with next_run=midnight -> at midnight the dispatcher claims it, enqueues it, sets next_run=next midnight -> a worker runs it -> records success (or retries on failure). Delayed one-offs are the same with a single future next_run. The store is the source of truth; the queue decouples dispatch from execution."),
      K("api", "API design",
        "POST /api/v1/jobs { type, payload, schedule: '0 0 * * *' | runAt: <ts>, maxRetries }\n  -> { jobId, nextRun }\nDELETE /api/v1/jobs/{id}            // cancel\nGET    /api/v1/jobs/{id}            -> { status, lastRun, nextRun, attempts }\nInternal: dispatcher.findDue(now) -> claim -> enqueue ; worker.poll() -> run -> report"),
      K("data_model", "Data model",
        "jobs:  job_id PK, type, payload, schedule|run_at, next_run (INDEXED), status,\n        attempts, max_retries, owner/lock, version\n  -- index on next_run so 'due now' is a range scan, not a full scan\nexecutions: (job_id, run_id) -> started_at, finished_at, status, error  (history/audit)\nqueue: due jobs handed to workers (the message-queue design)\nleader/lock: which dispatcher is active / per-job claim to avoid double-dispatch"),
      C("deep_dive", "Deep dive: triggering due jobs efficiently",
        "Scanning millions of jobs every second to find what's due is wasteful, so the trigger is index-driven. Store jobs SORTED by next_run (a DB index, or a priority queue / min-heap, or Redis sorted set scored by timestamp); finding due jobs is then a RANGE read of 'next_run <= now', which is cheap regardless of total job count. For high precision and scale, a TIMING WHEEL (buckets of upcoming time slots) or a DELAY QUEUE (a queue that only makes a message visible at its scheduled time) advances tick by tick and surfaces due jobs without re-querying everything. Recurring jobs are rescheduled by computing the next occurrence from the cron expression after dispatch and updating next_run. PARTITION jobs across multiple schedulers (by job id hash or time range) so one scheduler isn't responsible for all of them — each owns a shard and finds its due jobs independently. The principle: convert 'which of N jobs are due' from an O(N) scan into an O(due) lookup via a time-ordered structure."),
      C("deep_dive", "Deep dive: reliability & no double-execution",
        "Two failures to defend against: missing a run and running it twice. NO DOUBLE-DISPATCH: when a job becomes due, exactly one dispatcher must enqueue it — achieve this with LEADER ELECTION (only the elected dispatcher acts for a shard) or an ATOMIC CLAIM (compare-and-set the job's state from 'pending' to 'dispatched' with a version/lock, so only one instance wins). RELIABLE EXECUTION: the queue gives at-least-once delivery, so a worker that crashes mid-job leaves the message to be redelivered and retried — which means a job CAN run more than once, so jobs should be IDEMPOTENT (or dedupe by an execution id) to make at-least-once safe = exactly-once effect. RETRIES: failed jobs are re-enqueued with exponential backoff up to a max, then sent to a DEAD-LETTER queue for inspection. NO MISSED RUNS: persist the schedule durably, and on dispatcher restart, find jobs whose next_run already passed (overdue) and run them (catch-up). The combination — atomic claim + durable schedule + at-least-once queue + idempotent jobs + retries/DLQ — is what makes it reliable."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The THUNDERING HERD at popular times (midnight, top of the hour) makes millions of jobs due at once — smear execution (jitter start times), rate-limit dispatch, and let the queue + autoscaled workers absorb the spike rather than firing all at once. Dispatch coordination is a bottleneck and a correctness point — leader election adds failover latency; per-job atomic claims scale better but need a consistent store. Long-running jobs tie up workers and complicate retries (did it finish?) — track execution state and use idempotency. Clock issues affect timing precision across schedulers. Trade-offs: poll-a-sorted-index (simple, slight latency) vs timing-wheel/delay-queue (precise, more complex); leader election (simple correctness, single active dispatcher) vs atomic per-job claim (scalable, needs CAS); at-least-once + idempotent (no missed runs, possible dup) vs at-most-once (no dup, risk miss); precise timing vs throughput. Closing signal: jobs indexed by next_run, due-job dispatch coordinated to run-once, a queue to workers with retries/DLQ, and idempotent jobs for at-least-once safety."),
      C("deep_dive", "Deep dive: scaling, failure handling & operations",
        "Operationally the scheduler must be reliable and observable. Partitioning/scale: shard jobs across schedulers (by hash or time range) so the dispatch load and the next_run index are distributed; scale workers independently to the execution rate. Failure handling: if a scheduler dies, another takes over its shard (leader re-election) and runs overdue jobs (catch-up from the durable store) — no run is lost; if a worker dies mid-execution, the queue redelivers and idempotency makes the retry safe. Exactly-once-ish: combine an atomic 'claim before enqueue' with an execution id so duplicate deliveries are deduped at the worker. Visibility timeout: a claimed/in-flight job is hidden for a bounded time; if the worker doesn't ack, it reappears for retry. Time zones & DST: store schedules with explicit time zones and handle DST transitions for cron correctness. Backpressure: cap dispatch rate so a flood doesn't overwhelm workers/downstreams. Observability: missed-run count (should be zero), dispatch latency (scheduled vs actual), queue depth, retry/DLQ rates, and per-job success rate are the SLOs. The spine holds: a time-ordered job index, coordinated run-once dispatch, an at-least-once queue to workers, idempotency, retries/DLQ, and catch-up on restart."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How do you find due jobs without scanning millions?' index by next_run (sorted store / timing wheel / delay queue) and range-read 'due now'. 'How do you avoid running a job twice?' coordinate dispatch (leader election or atomic claim) + idempotent jobs + dedupe by execution id. 'What if a worker crashes mid-job?' the queue redelivers; idempotency makes the retry safe; visibility timeout reappears it. 'Midnight spike of millions?' smear/jitter + queue + autoscaling. 'Recurring jobs?' recompute next_run from cron after each dispatch. 'Missed runs after downtime?' catch-up overdue jobs from the durable store. 'Long jobs?' track state, heartbeat, idempotent retry. 'Scale?' shard jobs across schedulers. Each returns to the spine: a time-ordered job index, run-once coordinated dispatch, an at-least-once queue to workers, idempotency, and retries/DLQ."),
    ],
    "A job scheduler tests efficient time-based triggering (index by next_run / timing wheel, not scanning all jobs), run-once dispatch coordination (leader election or atomic claim), and reliable at-least-once execution with idempotent jobs + retries/DLQ + catch-up. The signal is avoiding both missed runs and double-runs, and absorbing the popular-time thundering herd.",
    [
      G("scan_all_jobs", "Scanning all jobs every tick to find what's due.", "Index jobs by next_run (sorted store / timing wheel / delay queue); range-read due jobs.", "Polls the whole jobs table each second."),
      G("double_dispatch", "Multiple schedulers dispatching the same due job.", "Coordinate with leader election or an atomic claim (CAS) so each due job runs once.", "No leader/claim; concurrent dispatchers double-fire."),
      G("no_idempotency", "Assuming exactly-once execution despite crashes/retries.", "Use at-least-once + idempotent jobs (dedupe by execution id) + retries/DLQ.", "No retry/idempotency; a crash loses or duplicates the run."),
    ],
    0.6, DIAG.sched, "Distributed job scheduler architecture"),
];

// ── 3 exercises per topic ────────────────────────────────────────────────────
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);
function pm(moduleId, o) {
  return { trackKey: TRACK_KEY, moduleId, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const EXERCISES = [
  // File sync
  pm("sysd_m4", { topicId: "sysd_m4_t3", exerciseId: "sysd_m4_t3_pm_d1", position: 11, level: "medium",
    title: "Avoiding full re-upload", scenario: "You change one line in a 1 GB file. How does sync avoid re-uploading the whole thing?",
    options: ["Chunk + hash the file; upload only changed chunks (delta sync)", "Compress the file and upload it", "Upload the whole file faster", "Re-upload nightly in a batch"],
    correct: "Chunk + hash the file; upload only changed chunks (delta sync)",
    explanation: "Files are split into content-hashed chunks; only chunks whose hash changed are uploaded, and identical chunks are deduped." }),
  pm("sysd_m4", { topicId: "sysd_m4_t3", exerciseId: "sysd_m4_t3_pm_d2", position: 12, level: "hard",
    title: "Two offline edits", scenario: "Two devices edit the same file offline and both commit from the same base version. What's the safe resolution?",
    options: ["Keep both: accept one version and save the other as a conflicted copy", "Last write wins; discard the other", "Merge bytes automatically", "Reject both edits"],
    correct: "Keep both: accept one version and save the other as a conflicted copy",
    explanation: "File sync must not lose data, so it keeps both via a conflicted copy for the user to reconcile (true co-editing needs OT/CRDT)." }),
  pm("sysd_m4", { topicId: "sysd_m4_t3", exerciseId: "sysd_m4_t3_pm_d3", position: 13, level: "medium",
    title: "Storing identical chunks once", scenario: "Many users store the same file. How do you avoid storing it many times?",
    options: ["Content-addressed chunks with refcounts (dedup)", "Store a copy per user", "Compress each copy", "Delete duplicates nightly"],
    correct: "Content-addressed chunks with refcounts (dedup)",
    explanation: "Chunks keyed by content hash are stored once and referenced (refcounted) by every file/user that contains them — dedup across versions and users." }),
  // Unique ID
  pm("sysd_m8", { topicId: "sysd_m8_t6", exerciseId: "sysd_m8_t6_pm_d1", position: 11, level: "medium",
    title: "Unique + sortable without coordination", scenario: "Many nodes must mint unique, time-sortable ids without coordinating per id. What approach?",
    options: ["Snowflake: timestamp + machine id + sequence, generated locally", "A single DB auto-increment", "Random UUIDv4", "A central counter service per id"],
    correct: "Snowflake: timestamp + machine id + sequence, generated locally",
    explanation: "Snowflake packs time (high bits, sortable) + machine id (uniqueness across nodes) + sequence, generated locally with no per-id coordination." }),
  pm("sysd_m8", { topicId: "sysd_m8_t6", exerciseId: "sysd_m8_t6_pm_d2", position: 12, level: "hard",
    title: "The clock pitfall", scenario: "What's the main correctness risk in a Snowflake-style generator?",
    options: ["A backward clock jump producing duplicate timestamps/ids", "Running out of UUID space", "Network latency to the counter", "Too many database writes"],
    correct: "A backward clock jump producing duplicate timestamps/ids",
    explanation: "If the clock moves backward (NTP/leap second), a node could reuse timestamps; the generator must detect this and stall until it passes lastTs." }),
  pm("sysd_m8", { topicId: "sysd_m8_t6", exerciseId: "sysd_m8_t6_pm_d3", position: 13, level: "medium",
    title: "Why not UUIDv4 as a key?", scenario: "Why is random UUIDv4 a poor choice for a sortable primary key?",
    options: ["It's not time-ordered and is 128-bit, hurting index locality", "It isn't unique", "It needs central coordination", "It can't be stored in a database"],
    correct: "It's not time-ordered and is 128-bit, hurting index locality",
    explanation: "UUIDv4 is random (no chronological order) and 128-bit, which fragments indexes; use Snowflake or UUIDv7 when you need ordering." }),
  // Object store
  pm("sysd_m8", { topicId: "sysd_m8_t7", exerciseId: "sysd_m8_t7_pm_d1", position: 11, level: "hard",
    title: "Durable storage cheaply", scenario: "How do you get ~11 nines durability at exabyte scale more cheaply than 3x replication?",
    options: ["Erasure coding (k data + m parity shards across failure domains)", "Keep one copy on RAID", "3x replication everywhere", "Back up to tape nightly"],
    correct: "Erasure coding (k data + m parity shards across failure domains)",
    explanation: "Erasure coding (e.g. 10+4) survives m failures with ~1.4x storage vs 3x for replication — much cheaper for similar durability." }),
  pm("sysd_m8", { topicId: "sysd_m8_t7", exerciseId: "sysd_m8_t7_pm_d2", position: 12, level: "medium",
    title: "Surviving constant disk failure", scenario: "Disks fail every few minutes at scale. What keeps objects durable over time?",
    options: ["A background repair process re-replicating/reconstructing lost shards", "Hoping disks don't fail", "Manual restores", "Storing everything on one big disk"],
    correct: "A background repair process re-replicating/reconstructing lost shards",
    explanation: "Continuous repair must outpace the failure rate, rebuilding lost replicas/shards from survivors; scrubbing catches silent corruption." }),
  pm("sysd_m8", { topicId: "sysd_m8_t7", exerciseId: "sysd_m8_t7_pm_d3", position: 13, level: "medium",
    title: "Finding an object", scenario: "How does the store locate one object among trillions of keys?",
    options: ["A sharded, replicated metadata index mapping key -> locations", "Scanning all storage nodes", "A single metadata server", "A directory tree on disk"],
    correct: "A sharded, replicated metadata index mapping key -> locations",
    explanation: "A sharded metadata index resolves key -> shard/replica locations; the namespace is flat (bucket/key), not a filesystem hierarchy." }),
  // Proximity
  pm("sysd_m8", { topicId: "sysd_m8_t8", exerciseId: "sysd_m8_t8_pm_d1", position: 11, level: "medium",
    title: "Finding nearby fast", scenario: "How do you find places within 2 km without scanning all 100M places?",
    options: ["A geospatial index (geohash/quadtree/S2) — query covering cells", "Compute distance to every place", "A SQL ORDER BY distance", "Random sampling"],
    correct: "A geospatial index (geohash/quadtree/S2) — query covering cells",
    explanation: "A spatial index buckets places into cells where neighbors are close, so a radius query fetches only the covering cells' candidates." }),
  pm("sysd_m8", { topicId: "sysd_m8_t8", exerciseId: "sysd_m8_t8_pm_d2", position: 12, level: "hard",
    title: "Boundary + exactness", scenario: "After fetching the query cell's entities, what two things must you still do?",
    options: ["Include neighbor cells and filter candidates by exact distance", "Nothing — the cell is the answer", "Sort by id", "Re-encode the geohash"],
    correct: "Include neighbor cells and filter candidates by exact distance",
    explanation: "Points just across a cell boundary live in neighbor cells, and cells are squares vs a circular radius — so include neighbors and exact-distance filter, then rank." }),
  pm("sysd_m8", { topicId: "sysd_m8_t8", exerciseId: "sysd_m8_t8_pm_d3", position: 13, level: "medium",
    title: "Dense cities", scenario: "A downtown cell holds a huge number of places. What helps?",
    options: ["Adaptive cells (quadtree/S2) or cap+paginate candidates", "Make all cells larger", "Ignore dense areas", "Scan the whole city"],
    correct: "Adaptive cells (quadtree/S2) or cap+paginate candidates",
    explanation: "Adaptive structures subdivide dense areas into finer cells (fewer candidates each); tuning precision to density keeps latency and quality good." }),
  // Distributed lock
  pm("sysd_m9", { topicId: "sysd_m9_t4", exerciseId: "sysd_m9_t4_pm_d1", position: 11, level: "hard",
    title: "The zombie holder", scenario: "A lock holder pauses (GC) past its TTL; the lock is reacquired by another. How do you keep the zombie from corrupting data?",
    options: ["Fencing tokens: the resource rejects writes with a stale (lower) token", "A longer TTL", "Trust the holder to notice", "Faster clocks"],
    correct: "Fencing tokens: the resource rejects writes with a stale (lower) token",
    explanation: "TTL alone isn't safe; a monotonic fencing token checked by the resource rejects a paused holder's late writes after its lease expired." }),
  pm("sysd_m9", { topicId: "sysd_m9_t4", exerciseId: "sysd_m9_t4_pm_d2", position: 12, level: "hard",
    title: "Crash without deadlock", scenario: "The lock holder crashes. How does the lock free without blocking everyone forever?",
    options: ["A lease/TTL (or ephemeral node) auto-expires the lock", "An admin manually clears it", "It stays locked permanently", "Other clients ignore the lock"],
    correct: "A lease/TTL (or ephemeral node) auto-expires the lock",
    explanation: "A lease/TTL (or a session-tied ephemeral node in ZK/etcd) auto-releases on crash, preserving liveness; renew via heartbeat for long sections." }),
  pm("sysd_m9", { topicId: "sysd_m9_t4", exerciseId: "sysd_m9_t4_pm_d3", position: 13, level: "medium",
    title: "Where should the lock live?", scenario: "A double-hold would be catastrophic (double-charge). Which lock backing is safest?",
    options: ["A CP consensus store (ZooKeeper/etcd) + fencing tokens", "A single Redis instance", "An in-memory map on one server", "A file on shared disk"],
    correct: "A CP consensus store (ZooKeeper/etcd) + fencing tokens",
    explanation: "For catastrophic double-holds use a consensus store (consistent, ephemeral auto-release, sequence-number fencing); a single Redis can double-grant on failover." }),
  // Job scheduler
  pm("sysd_m8", { topicId: "sysd_m8_t5", exerciseId: "sysd_m8_t5_pm_d1", position: 11, level: "medium",
    title: "Finding due jobs", scenario: "How do you find which of 10M jobs are due now without scanning them all each second?",
    options: ["Index jobs by next_run and range-read 'due now' (or use a timing wheel)", "Scan the whole jobs table every second", "Check jobs in random order", "Ask each worker to poll all jobs"],
    correct: "Index jobs by next_run and range-read 'due now' (or use a timing wheel)",
    explanation: "A time-ordered index (sorted store / timing wheel / delay queue) makes 'due now' an O(due) range read instead of an O(N) scan." }),
  pm("sysd_m8", { topicId: "sysd_m8_t5", exerciseId: "sysd_m8_t5_pm_d2", position: 12, level: "hard",
    title: "Run each job once", scenario: "Multiple scheduler instances run. How do you ensure a due job is dispatched only once?",
    options: ["Leader election or an atomic claim (CAS) on the job before enqueuing", "Let all schedulers enqueue it; dedupe never", "Run the newest scheduler only, manually", "Hope timing prevents overlap"],
    correct: "Leader election or an atomic claim (CAS) on the job before enqueuing",
    explanation: "Coordinate dispatch: an elected leader, or an atomic compare-and-set of the job to 'dispatched', ensures exactly one instance enqueues a due job." }),
  pm("sysd_m8", { topicId: "sysd_m8_t5", exerciseId: "sysd_m8_t5_pm_d3", position: 13, level: "medium",
    title: "Worker crashes mid-job", scenario: "A worker crashes while running a job. How do you avoid both losing and duplicating the work?",
    options: ["At-least-once redelivery + idempotent jobs (dedupe by execution id)", "Mark it done immediately on dispatch", "Never retry", "Run every job twice on purpose"],
    correct: "At-least-once redelivery + idempotent jobs (dedupe by execution id)",
    explanation: "The queue redelivers on crash (no lost run); idempotent jobs/dedupe make the retry safe, giving exactly-once effect with retries/DLQ for repeated failures." }),
];

// ── upsert + recompute ──────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const moduleIds = [...new Set(TOPICS.map((t) => t.moduleId))];
  for (const mid of moduleIds) {
    const m = await ProModule.findOne({ trackKey: TRACK_KEY, moduleId: mid }).lean();
    if (!m) throw new Error(`Module ${mid} not found — run the base SD seeds first.`);
  }
  let tUp = 0, eUp = 0;
  for (const t of TOPICS) { await ProTopic.updateOne({ trackKey: TRACK_KEY, topicId: t.topicId }, { $set: t }, { upsert: true }); tUp++; }
  for (const e of EXERCISES) { await ProExercise.updateOne({ trackKey: TRACK_KEY, exerciseId: e.exerciseId }, { $set: e }, { upsert: true }); eUp++; }
  const totals = await recomputeTrackTotals(TRACK_KEY);
  console.log(`✓ Depth batch 4 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
