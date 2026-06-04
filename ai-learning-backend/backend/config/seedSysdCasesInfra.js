/**
 * Seed — System Design module M4: Case Studies — Infrastructure & Scale.
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCasesInfra.js   ·   npm: npm run seed:sysd-infra
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m4";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 4,
  name: "Case Studies — Infrastructure & Scale", slug: "case-studies-infra",
  description: "Large-scale infrastructure designs: video streaming, ride-sharing geo-matching, file sync, a distributed web crawler, a distributed key-value store, and high-concurrency ticket booking.",
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
  T("sysd_m4_t1", 1, "Design Video Streaming (YouTube/Netflix)", "sysd-video-streaming",
    ["case-study", "video", "streaming", "cdn", "transcoding"],
    "Upload a 4K video; millions stream it worldwide at whatever quality their connection allows. Where does the heavy lifting happen?",
    "Uploads go to blob storage and are TRANSCODED asynchronously into multiple resolutions/bitrates and segmented; playback uses adaptive bitrate streaming served from a CDN. Metadata in a scalable store; the bytes never touch the app DB.",
    [
      { kind: "concept", heading: "Upload & transcoding pipeline",
        body: "Raw upload → blob storage → a transcoding pipeline (queue + worker farm) produces multiple resolutions (240p…4K) and bitrates, split into small segments (e.g. HLS/DASH chunks). This is heavy, async, and parallelizable. Metadata (title, owner, segment manifest URLs) goes to a DB; bytes go to object storage." },
      { kind: "concept", heading: "Adaptive bitrate streaming",
        body: "The player downloads a manifest listing quality variants, then fetches segments, switching quality up/down based on measured bandwidth (ABR). This delivers smooth playback across connections. Segments are static files — perfect for CDN caching." },
      { kind: "concept", heading: "CDN is the backbone",
        body: "Video is enormous and global; a CDN caches segments at edges near viewers so the origin/blob store isn't hammered. Popular content is widely replicated (push); the long tail is pulled on demand. The CDN, not the origin, serves the vast majority of bytes." },
      { kind: "concept", heading: "Scale characteristics",
        body: "Extremely read-heavy and bandwidth-dominated. Recommendations/search are separate read-heavy subsystems. View counts/likes are high-volume, eventually-consistent counters. The design is dominated by storage + CDN + the async transcoding farm." },
    ],
    "Video streaming tests async transcoding, adaptive-bitrate segments, and CDN-centric delivery. The signal is 'blob storage + transcoding pipeline + ABR over CDN', not streaming from an app server.",
    ["Transcoding synchronously or streaming bytes through the app server.",
     "Forgetting adaptive bitrate / segmentation for varied connections.",
     "Underusing the CDN for global, bandwidth-heavy delivery."],
    0.6, { type: "Streaming pipeline", description: "Upload: Client → Blob Storage → Queue → Transcoding Workers → segmented variants. Playback: Client → CDN → Blob Storage. The CDN serves most bytes.", alt: "Upload to blob storage, transcoding workers produce variants, playback via CDN." }),

  T("sysd_m4_t2", 2, "Design Ride-Sharing (Uber/Lyft)", "sysd-ride-sharing",
    ["case-study", "uber", "geo", "matching", "geohash"],
    "A rider requests a car; you must find nearby available drivers in milliseconds from millions moving in real time. How do you index location?",
    "Index drivers spatially with a geohash or quadtree so 'nearby' is a fast lookup, not a full scan; ingest frequent location updates into a fast store; and run a matching service to pair rider↔driver. Real-time location + spatial indexing is the crux.",
    [
      { kind: "concept", heading: "Spatial indexing",
        body: "You can't scan all drivers per request. Partition the map: geohash (encode lat/lng into a string prefix where nearby points share prefixes) or a quadtree (recursively subdivided cells). 'Find drivers near X' becomes 'look up X's cell + neighbours' — O(local), not O(all drivers)." },
      { kind: "concept", heading: "Location updates",
        body: "Drivers emit location every few seconds → a high write volume. Store current locations in a fast in-memory store (Redis geo / a dedicated location service) keyed by the spatial index, overwriting (you only need the latest). Don't write every ping to a slow disk DB." },
      { kind: "concept", heading: "Matching",
        body: "A matching/dispatch service queries nearby available drivers, ranks by ETA/distance, and offers the ride (with timeouts and fallbacks if a driver declines). This is latency-sensitive; the spatial index + in-memory locations make candidate lookup fast." },
      { kind: "concept", heading: "Other pieces",
        body: "Trip lifecycle as a state machine (requested → matched → en route → completed); pricing (surge) as a strategy; payments async; trip history in a durable store. The defining challenge remains real-time geo lookup at scale." },
    ],
    "Ride-sharing is defined by geospatial indexing (geohash/quadtree) + real-time location ingestion + matching. The signal is 'don't scan all drivers — index by location' and 'latest location in memory'.",
    ["Scanning all drivers per request instead of a spatial index.",
     "Persisting every location ping to a slow DB instead of an in-memory latest-location store.",
     "Ignoring the matching timeouts/fallbacks when a driver declines."],
    0.6, { type: "Match flow", description: "Flow: Rider → Matching Service → Location Index (geohash in Redis) → nearby Drivers. Drivers stream location updates into the index.", alt: "Rider to matching service to geo index to nearby drivers; drivers update location." }),

  T("sysd_m4_t3", 3, "Design File Sync (Dropbox/Drive)", "sysd-file-sync",
    ["case-study", "dropbox", "sync", "chunking", "dedup"],
    "Edit a 1GB file by changing one paragraph; the desktop client should upload only the change, sync to all your devices, and handle two devices editing at once. How?",
    "Split files into content-addressed CHUNKS so only changed chunks upload (and identical chunks dedupe globally); store chunks in blob storage and metadata (file tree, versions, chunk lists) separately; sync via a metadata service + notifications; resolve concurrent edits with versioning/conflict copies.",
    [
      { kind: "concept", heading: "Chunking + dedup",
        body: "Break each file into chunks (e.g. 4MB, ideally content-defined). Hash each chunk; upload only chunks the server doesn't already have. Editing one paragraph changes one chunk → tiny upload. Identical chunks across files/users are stored once (dedup) — huge storage savings." },
      { kind: "concept", heading: "Metadata vs content split",
        body: "Two stores: a metadata service (file/folder tree, versions, per-file ordered chunk list, permissions) in a database, and chunk content in blob storage. A file = its metadata + an ordered list of chunk hashes. This split lets metadata stay small/queryable while bytes scale in object storage." },
      { kind: "concept", heading: "Sync",
        body: "Clients hold a local copy + a sync engine. On change, upload new chunks + update metadata; the server notifies other devices (long-poll/websocket) that pull the new metadata and fetch only missing chunks. A watcher detects local changes; deltas keep bandwidth minimal." },
      { kind: "concept", heading: "Conflicts",
        body: "Two devices editing offline then syncing → conflict. Use version vectors / last-writer-wins with a 'conflicted copy' fallback (Dropbox creates 'file (conflicted copy)') rather than silently losing data. Strong consistency on metadata; content is immutable chunks (no in-place edits)." },
    ],
    "File sync tests chunking + content-addressed dedup, the metadata/content split, and conflict handling. The signal is 'upload only changed chunks' and 'metadata DB + blob chunk store', plus conflict copies.",
    ["Re-uploading whole files instead of changed chunks.",
     "Storing file bytes in the metadata DB instead of a chunk/blob store.",
     "Silently losing data on concurrent edits instead of conflict copies/versioning."],
    0.6, { type: "Sync flow", description: "Upload: Client → Chunker → Blob Storage (new chunks only) + Metadata Service. Sync: Metadata Service → Notify other Devices → pull changed chunks.", alt: "Client chunks file, uploads new chunks to blob storage and metadata, other devices notified." }),

  T("sysd_m4_t4", 4, "Design a Web Crawler", "sysd-web-crawler",
    ["case-study", "crawler", "frontier", "bloom-filter"],
    "Crawl billions of web pages: fetch, extract links, queue new URLs, and never get stuck re-crawling the same page or hammering one site. How?",
    "A distributed crawler with a URL frontier (priority queue of URLs to fetch), a SEEN set (Bloom filter) to avoid re-crawling, politeness (per-domain rate limits + robots.txt), and parallel fetcher/parser workers. Dedup and politeness are the crux.",
    [
      { kind: "concept", heading: "The crawl loop",
        body: "Pop a URL from the frontier → fetch the page → store content (blob) → parse out links → for each new link, check the SEEN set and enqueue if unseen. Repeat across many workers. The frontier prioritises (freshness, importance/PageRank) so you crawl the right pages first." },
      { kind: "concept", heading: "Dedup with a Bloom filter",
        body: "Billions of URLs make an exact 'have we seen this?' set huge. A Bloom filter answers 'definitely not seen' (enqueue) vs 'probably seen' (skip) in tiny memory — occasional false positives just skip a page, never re-crawl-forever. Normalize URLs first (canonicalize) to avoid trivial duplicates." },
      { kind: "concept", heading: "Politeness",
        body: "Respect robots.txt and don't overwhelm a single domain — rate-limit per host (partition the frontier by domain so one worker handles a domain at a controlled pace). Politeness avoids getting blocked and being a bad citizen; it's a hard requirement, not optional." },
      { kind: "concept", heading: "Distribution & traps",
        body: "Shard the frontier and workers across machines (by domain hash). Handle spider traps (infinite URL spaces), set depth limits, dedup near-duplicate content, and checkpoint state so a crash resumes. Content store + link graph feed downstream indexing." },
    ],
    "Web crawler is a favourite for the frontier + Bloom-filter dedup + politeness combo. The signal is 'priority frontier', 'Bloom filter for seen URLs', and 'per-domain rate limiting / robots.txt'.",
    ["No dedup (or an exact set that doesn't fit) → re-crawling forever; use a Bloom filter.",
     "Ignoring politeness/robots.txt and hammering single domains.",
     "Forgetting spider traps, URL normalization, and depth limits."],
    0.6, { type: "Crawl loop", description: "Loop: URL Frontier → Fetcher → Content Store, then Parser extracts links → Seen-set (Bloom filter) → back to Frontier. Per-domain rate limits enforce politeness.", alt: "Frontier to fetcher to content store, parser to bloom filter dedup back to frontier." }),

  T("sysd_m4_t5", 5, "Design a Distributed Key-Value Store (Dynamo)", "sysd-kv-store",
    ["case-study", "key-value", "dynamo", "consistent-hashing", "quorum"],
    "Build a key-value store that scales horizontally, survives node failures, and stays available even during network partitions. What are the core mechanisms?",
    "Partition keys across nodes with CONSISTENT HASHING, REPLICATE each key to N nodes, and use QUORUM reads/writes (R+W>N) for tunable consistency. Favour availability (AP), reconciling divergent replicas with vector clocks / last-writer-wins.",
    [
      { kind: "concept", heading: "Partitioning: consistent hashing",
        body: "Place nodes and keys on a hash ring; each key is owned by the next node clockwise. Adding/removing a node moves only ~1/N of keys (not a full reshuffle). Virtual nodes even out load and handle heterogeneous capacity. This gives elastic horizontal scaling." },
      { kind: "concept", heading: "Replication",
        body: "Each key is stored on N consecutive nodes on the ring (the 'preference list'). This gives fault tolerance — a key survives node failures — and lets reads be served by any replica. N is the replication factor (e.g. 3)." },
      { kind: "concept", heading: "Quorum consistency (R, W, N)",
        body: "A write succeeds when W replicas ack; a read queries R replicas. If R + W > N, reads and writes overlap on at least one node, giving strong-ish consistency. Tune for the workload: W=N (durable writes), R=1 (fast reads), or balanced. Lower R/W = higher availability, more staleness." },
      { kind: "concept", heading: "Conflict resolution",
        body: "With concurrent writes to different replicas (AP system), versions diverge. Vector clocks detect concurrent vs causal updates; conflicts are resolved by last-writer-wins (simple, can lose data) or application-level merge (e.g. shopping-cart union). Hinted handoff + read repair + anti-entropy (Merkle trees) re-sync replicas." },
    ],
    "The distributed KV store (Dynamo paper) is a deep favourite. The signal is consistent hashing + N-replication + quorum (R+W>N) + conflict resolution (vector clocks / LWW) — the AP design toolkit.",
    ["Using modulo hashing instead of consistent hashing (full reshuffle on scale).",
     "Not understanding the R+W>N quorum overlap for consistency tuning.",
     "Ignoring conflict resolution for concurrent writes in an AP system."],
    0.7, { type: "KV ring", description: "Write: Client → Coordinator Node → N replicas on the hash ring (ack after W). Read: Client → Coordinator → R replicas. R + W > N tunes consistency.", alt: "Client to coordinator node to N replicas on a consistent-hash ring with quorum reads and writes." }),

  T("sysd_m4_t6", 6, "Design Ticket Booking (Ticketmaster)", "sysd-ticket-booking",
    ["case-study", "booking", "concurrency", "reservation"],
    "10,000 fans hit 'buy' for the last 100 concert seats at the same instant. How do you sell each seat exactly once without overselling or locking everyone out?",
    "Model seats with explicit states (available → held → booked); on selection, atomically RESERVE a seat with a short TTL hold so others can't grab it; confirm on payment, release on timeout. The crux is concurrency control to prevent double-booking under a thundering herd.",
    [
      { kind: "concept", heading: "Seat state machine",
        body: "Each seat is Available → Held (reserved, TTL) → Booked, or back to Available if the hold expires. The hold gives the user time to pay without letting two users book the same seat. Modeling state explicitly (vs a bare boolean) is what makes the flow correct." },
      { kind: "concept", heading: "Atomic reservation",
        body: "Selecting a seat must atomically move it Available→Held only if currently Available — a conditional update / compare-and-set (a DB row lock, an atomic Redis op, or `UPDATE … WHERE status='available'`). This prevents two concurrent requests from both succeeding (no double-booking)." },
      { kind: "concept", heading: "Holds + expiry",
        body: "A held seat has a TTL (e.g. 10 min). If payment doesn't complete, a background job (or TTL) releases it back to Available so inventory isn't stuck. This balances giving users time to pay against not starving other buyers." },
      { kind: "concept", heading: "Thundering herd + fairness",
        body: "For hot events, a virtual WAITING QUEUE admits users in controlled batches (so the system isn't crushed and it's fair). Strong consistency on inventory is required (overselling is unacceptable) — this is a CP choice. Payments run async after the hold; on failure the hold is released." },
    ],
    "Ticket booking is the canonical high-concurrency, no-oversell design. The signal is the seat state machine + atomic conditional reservation + TTL holds + (for hot events) a waiting queue, with strong consistency on inventory.",
    ["A non-atomic 'check then book' that lets concurrent requests double-book.",
     "Holding seats forever (no TTL), starving other buyers.",
     "Choosing eventual consistency for inventory (overselling) instead of strong consistency."],
    0.6, { type: "Booking flow", description: "Flow: User → Booking Service → atomic reserve seat (Available→Held, TTL) → Payment → confirm (Held→Booked). Expired holds revert to Available.", alt: "User to booking service, atomic hold with TTL, then payment confirms booking." }),
];

const EXERCISES = [
  // T1 Video
  pm({ topicId: "sysd_m4_t1", exerciseId: "sysd_m4_t1_pm_1", position: 1, level: "medium",
    title: "Transcoding placement",
    scenario: "Producing multiple resolutions/bitrates from an uploaded video is heavy. How should it run?",
    options: ["Asynchronously in a transcoding worker farm (queue-driven)", "Synchronously during upload", "On the viewer's device", "In the database"], correct: "Asynchronously in a transcoding worker farm (queue-driven)",
    explanation: "Transcoding is heavy and parallelizable — offload it to async workers after the upload lands in blob storage." }),
  pm({ topicId: "sysd_m4_t1", exerciseId: "sysd_m4_t1_pm_2", position: 2, level: "medium",
    title: "Smooth playback on varied connections",
    scenario: "Viewers have wildly different bandwidth. What technique adjusts quality during playback?",
    options: ["Adaptive bitrate streaming (segmented variants)", "Always send 4K", "Always send 240p", "Download the whole file first"], correct: "Adaptive bitrate streaming (segmented variants)",
    explanation: "ABR serves a manifest of quality variants in segments; the player switches quality based on measured bandwidth." }),
  pm({ topicId: "sysd_m4_t1", exerciseId: "sysd_m4_t1_pm_3", position: 3, level: "easy",
    title: "Who serves the bytes?",
    scenario: "Video is bandwidth-dominated and global. What serves most of the bytes?",
    options: ["A CDN caching segments at the edge", "The origin app server", "The metadata database", "The message queue"], correct: "A CDN caching segments at the edge",
    explanation: "Video segments are static files; a CDN serves the vast majority from edges near viewers." }),

  // T2 Ride-sharing
  pm({ topicId: "sysd_m4_t2", exerciseId: "sysd_m4_t2_pm_1", position: 1, level: "hard",
    title: "Find nearby drivers fast",
    scenario: "You must find drivers near a rider without scanning all of them. What indexing approach?",
    options: ["Geospatial index (geohash / quadtree)", "A full table scan filtered by distance", "A B-tree on driver_id", "A Bloom filter of driver IDs"], correct: "Geospatial index (geohash / quadtree)",
    explanation: "Geohash/quadtree make 'nearby' a local cell lookup, turning O(all drivers) into O(local)." }),
  pm({ topicId: "sysd_m4_t2", exerciseId: "sysd_m4_t2_pm_2", position: 2, level: "medium",
    title: "Where do live locations go?",
    scenario: "Drivers emit location every few seconds (huge write volume); you only need the latest. Where to store it?",
    options: ["An in-memory store (e.g. Redis geo), overwriting latest", "A disk relational DB, appending every ping", "Blob storage", "A message queue only"], correct: "An in-memory store (e.g. Redis geo), overwriting latest",
    explanation: "Keep only the latest location in a fast in-memory geo store; persisting every ping to disk is needless load." }),
  pm({ topicId: "sysd_m4_t2", exerciseId: "sysd_m4_t2_pm_3", position: 3, level: "medium",
    title: "Driver declines",
    scenario: "The matched driver doesn't accept within the offer window. What should the matching service do?",
    options: ["Time out and offer the next-best driver (fallback)", "Wait indefinitely", "Cancel the rider's request", "Charge the rider"], correct: "Time out and offer the next-best driver (fallback)",
    explanation: "Matching needs offer timeouts and fallbacks to the next candidate so a non-responsive driver doesn't stall the rider." }),

  // T3 File sync
  pm({ topicId: "sysd_m4_t3", exerciseId: "sysd_m4_t3_pm_1", position: 1, level: "hard",
    title: "Upload only the change",
    scenario: "Changing one paragraph of a 1GB file should upload almost nothing. What enables that?",
    options: ["Chunking + uploading only changed chunks", "Re-uploading the whole file", "Compressing the file", "A bigger upload bandwidth"], correct: "Chunking + uploading only changed chunks",
    explanation: "Content-defined chunks mean only the modified chunk(s) change and upload; identical chunks dedupe." }),
  pm({ topicId: "sysd_m4_t3", exerciseId: "sysd_m4_t3_pm_2", position: 2, level: "medium",
    title: "Where do chunks live?",
    scenario: "How do you split storage of a synced file?",
    options: ["Metadata (tree, versions, chunk list) in a DB; chunk bytes in blob storage", "Everything in one relational table", "Everything in Redis", "Everything in the client only"], correct: "Metadata (tree, versions, chunk list) in a DB; chunk bytes in blob storage",
    explanation: "Small queryable metadata in a DB; large immutable chunks in blob storage — a file is metadata + an ordered chunk list." }),
  pm({ topicId: "sysd_m4_t3", exerciseId: "sysd_m4_t3_pm_3", position: 3, level: "medium",
    title: "Concurrent edits",
    scenario: "Two devices edit the same file offline, then both sync. What's the safe resolution?",
    options: ["Versioning + a conflicted copy (don't silently lose data)", "Last write silently overwrites", "Reject both edits", "Merge bytes blindly"], correct: "Versioning + a conflicted copy (don't silently lose data)",
    explanation: "Use version vectors and create a 'conflicted copy' so no edit is silently lost." }),

  // T4 Web crawler
  pm({ topicId: "sysd_m4_t4", exerciseId: "sysd_m4_t4_pm_1", position: 1, level: "hard",
    title: "Avoid re-crawling at scale",
    scenario: "With billions of URLs, how do you cheaply check 'have we already seen this URL?'",
    options: ["A Bloom filter (definitely-not-seen vs probably-seen)", "An exact in-memory hash set of all URLs", "A full DB scan per URL", "A sorted file on disk"], correct: "A Bloom filter (definitely-not-seen vs probably-seen)",
    explanation: "A Bloom filter gives tiny-memory dedup with no false negatives; a false positive just skips a page, never re-crawls forever." }),
  pm({ topicId: "sysd_m4_t4", exerciseId: "sysd_m4_t4_pm_2", position: 2, level: "medium",
    title: "Be a good citizen",
    scenario: "What must the crawler do to avoid overwhelming sites and getting blocked?",
    options: ["Respect robots.txt + per-domain rate limiting (politeness)", "Crawl each domain as fast as possible", "Ignore robots.txt for speed", "Only crawl at night"], correct: "Respect robots.txt + per-domain rate limiting (politeness)",
    explanation: "Politeness — robots.txt + per-host rate limits — is a hard requirement, often by partitioning the frontier per domain." }),
  pm({ topicId: "sysd_m4_t4", exerciseId: "sysd_m4_t4_pm_3", position: 3, level: "medium",
    title: "What to crawl next",
    scenario: "What component decides the order/priority of URLs to fetch?",
    options: ["The URL frontier (a priority queue)", "The Bloom filter", "The content store", "The DNS resolver"], correct: "The URL frontier (a priority queue)",
    explanation: "The frontier prioritises URLs (freshness/importance) and feeds fetchers; the Bloom filter only dedupes." }),

  // T5 KV store
  pm({ topicId: "sysd_m4_t5", exerciseId: "sysd_m4_t5_pm_1", position: 1, level: "hard",
    title: "Elastic partitioning",
    scenario: "Keys must spread across nodes and adding a node should move minimal data. Which technique?",
    options: ["Consistent hashing (with virtual nodes)", "hash(key) % N", "Range partitioning by key", "A single shard"], correct: "Consistent hashing (with virtual nodes)",
    explanation: "Consistent hashing moves only ~1/N of keys when membership changes; virtual nodes balance load." }),
  pm({ topicId: "sysd_m4_t5", exerciseId: "sysd_m4_t5_pm_2", position: 2, level: "hard",
    title: "Quorum consistency",
    scenario: "With replication factor N, which condition makes reads and writes overlap for consistency?",
    options: ["R + W > N", "R + W < N", "R = W = 1", "R = N, W = N always"], correct: "R + W > N",
    explanation: "If R + W > N, the read and write quorums share at least one node, so reads see the latest acked write." }),
  pm({ topicId: "sysd_m4_t5", exerciseId: "sysd_m4_t5_pm_3", position: 3, level: "hard",
    title: "Concurrent writes diverge",
    scenario: "In an AP store, two replicas take concurrent writes to the same key. What detects/resolves the conflict?",
    options: ["Vector clocks (then LWW or app-level merge)", "A global lock on the key", "Two-phase commit", "A Bloom filter"], correct: "Vector clocks (then LWW or app-level merge)",
    explanation: "Vector clocks distinguish concurrent vs causal updates; conflicts resolve via last-writer-wins or application merge." }),

  // T6 Ticket booking
  pm({ topicId: "sysd_m4_t6", exerciseId: "sysd_m4_t6_pm_1", position: 1, level: "hard",
    title: "Prevent double-booking",
    scenario: "Thousands try to buy the same seat at once. What guarantees it's sold exactly once?",
    options: ["An atomic conditional reserve (Available→Held only if Available)", "Check availability then book in two steps", "First-come email confirmation", "Eventual consistency on inventory"], correct: "An atomic conditional reserve (Available→Held only if Available)",
    explanation: "A compare-and-set / conditional UPDATE makes only one concurrent request succeed — no double-booking." }),
  pm({ topicId: "sysd_m4_t6", exerciseId: "sysd_m4_t6_pm_2", position: 2, level: "medium",
    title: "Don't starve other buyers",
    scenario: "A user reserves a seat but never pays. How do you free it?",
    options: ["A TTL hold that auto-releases the seat", "Hold it forever", "Immediately book it without payment", "Delete the seat"], correct: "A TTL hold that auto-releases the seat",
    explanation: "Holds have a TTL; if payment doesn't complete, the seat reverts to Available so inventory isn't stuck." }),
  pm({ topicId: "sysd_m4_t6", exerciseId: "sysd_m4_t6_pm_3", position: 3, level: "medium",
    title: "Inventory consistency",
    scenario: "What consistency model must seat inventory use?",
    options: ["Strong consistency (overselling is unacceptable)", "Eventual consistency", "No consistency", "Best-effort"], correct: "Strong consistency (overselling is unacceptable)",
    explanation: "Selling the same seat twice is unacceptable, so inventory needs strong consistency — a CP choice." }),
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
  console.log(`\nDone — M4 Infra case studies seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
