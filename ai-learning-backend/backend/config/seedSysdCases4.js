/**
 * Seed — System Design module M9: Case Studies IV (more large-scale designs):
 * Google Docs (collaborative editing), Payment System, Google Maps,
 * Distributed Lock, Recommendation System, Stock Exchange / Matching Engine,
 * Email Service, Flash Sale. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases4.js   ·   npm: npm run seed:sysd-cases4
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m9";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 9,
  name: "Case Studies IV — More Systems", slug: "case-studies-4",
  description: "Eight more large-scale designs: Google Docs collaborative editing, a payment system, Google Maps, a distributed lock service, a recommendation system, a stock-exchange matching engine, an email service, and a flash-sale system.",
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
  T("sysd_m9_t1", 1, "Design Google Docs (Collaborative Editing)", "design-google-docs",
    ["case-study", "collaboration", "ot", "crdt"],
    "Many people edit the same document at the same time and everyone converges to the same result with no lost keystrokes. How do concurrent edits merge without a central lock?",
    "Concurrent edits are merged with Operational Transformation (OT) or CRDTs, not locks. Edits are small operations (insert/delete at a position); OT transforms an incoming op against ops it didn't see so intents are preserved and all replicas converge. A central server (or peer sync) orders/relays ops; presence + cursors ride alongside.",
    [
      { kind: "concept", heading: "Why not lock or last-write-wins",
        body: "Locking a doc kills collaboration; last-write-wins loses keystrokes. Real-time co-editing must MERGE concurrent edits so every user ends at the same document (convergence) and each edit's intent is preserved. The unit isn't 'the whole doc' — it's small operations." },
      { kind: "concept", heading: "Operational Transformation (OT)",
        body: "Each edit is an operation: insert(pos, char) / delete(pos). When Bob's op arrives but Alice already applied her own op at an earlier position, applying Bob's raw position would land in the wrong place. OT TRANSFORMS the incoming op against the ops the receiver applied that the sender hadn't seen (e.g. shift its index) so the result is consistent everywhere. A server relays and orders ops; this is the classic Google Docs approach." },
      { kind: "concept", heading: "CRDTs (the alternative)",
        body: "Conflict-free Replicated Data Types give each character a unique, ordered identity (not a mutable integer index), so concurrent inserts/deletes commute and merge deterministically WITHOUT transformation or a central authority — great for offline/peer-to-peer. Trade-off: metadata overhead per character. OT is server-centric and compact; CRDT is decentralized and robust to disconnection." },
      { kind: "concept", heading: "The rest of the system & follow-ups",
        body: "A WebSocket connection streams ops bidirectionally; the server persists the op log (so late joiners replay to current state) and periodically snapshots. Presence/cursors are ephemeral pub-sub. Follow-ups: 'offline edits then reconnect' (CRDT shines / OT needs careful reconciliation), 'undo in a shared doc', 'huge docs' (chunking). Signal: ops + OT or CRDT for convergence, an op log, and a realtime channel." },
    ],
    "Google Docs tests concurrent-edit convergence: edits as operations merged via OT (server-ordered, transform against unseen ops) or CRDTs (decentralized, commutative), an op log for late joiners, and a realtime channel — never a lock or last-write-wins.",
    ["Proposing a document lock or last-write-wins (kills collaboration / loses edits).",
     "Sending whole-document diffs instead of small operations.",
     "Not knowing OT/CRDT exist to make concurrent edits converge."],
    0.6, { type: "Collaborative editing", description: "Each client sends ops (insert/delete) over WebSocket → server orders + transforms (OT) against concurrent ops → broadcasts → all replicas converge. Op log persists state.", alt: "Clients exchange edit operations transformed via OT so all replicas converge." }),

  T("sysd_m9_t2", 2, "Design a Payment System", "design-payment-system",
    ["case-study", "ledger", "idempotency", "saga"],
    "Process payments (card, wallet) reliably: money must never be lost or double-charged, even with network failures and retries across multiple services. What guarantees correctness?",
    "A double-entry LEDGER as the source of truth (immutable entries, balances derived), IDEMPOTENCY keys so retries don't double-charge, and a SAGA / state machine to coordinate the multi-step flow (authorize → capture → settle) across the payment gateway and accounts with compensating actions on failure. Reconciliation catches drift.",
    [
      { kind: "concept", heading: "Ledger is the source of truth",
        body: "Like the wallet LLD, money lives in an append-only DOUBLE-ENTRY ledger: every movement is balanced debit+credit entries; you never overwrite a balance. This gives a complete audit trail, makes discrepancies detectable, and supports reversals as compensating entries. Use integer minor units, never floats." },
      { kind: "concept", heading: "Idempotency everywhere",
        body: "Networks fail mid-request; clients and services retry. EVERY payment operation takes an idempotency key so a retried 'charge' returns the original outcome instead of charging again. The gateway, your API, and internal steps all dedupe on it. This is the single most important property of a correct payment system." },
      { kind: "concept", heading: "Multi-step flow as a Saga",
        body: "A payment touches several services (fraud check, payment gateway authorize, capture, update ledger, notify). A distributed transaction (2PC) across external gateways is impractical, so use a SAGA: a sequence of local steps each with a COMPENSATING action (e.g. if capture fails after authorize, void the authorization). Model it as a state machine (INITIATED→AUTHORIZED→CAPTURED→SETTLED / FAILED→REFUNDED) so a crashed flow resumes from its last durable state." },
      { kind: "concept", heading: "Async, reconciliation & follow-ups",
        body: "Settlement with banks is asynchronous (webhooks/callbacks) — handle out-of-order, duplicate, and late notifications idempotently. Periodic RECONCILIATION compares your ledger against the gateway/bank statements to catch drift. Follow-ups: 'exactly-once charge' (idempotency + ledger), 'refunds/chargebacks' (compensating entries), 'PCI / don't store raw card data' (tokenize), 'multi-currency'. Signal: ledger + idempotency + saga/state-machine + reconciliation." },
    ],
    "A payment system is the correctness-critical design: double-entry ledger as truth, idempotency keys against double-charge, a saga/state-machine for the multi-service flow with compensations, and reconciliation. PCI tokenization is the security follow-up.",
    ["No idempotency keys — retries double-charge.",
     "Using 2PC across external gateways instead of a saga with compensations.",
     "Mutable balances/floats and no reconciliation against the bank/gateway."],
    0.6, { type: "Payment saga", description: "Flow: INITIATED → fraud check → AUTHORIZED → CAPTURED → ledger entry → SETTLED; failures trigger compensating actions (void/refund). Idempotency keys dedupe retries.", alt: "Payment saga from initiation to settlement with compensating actions on failure." }),

  T("sysd_m9_t3", 3, "Design Google Maps (Routing)", "design-google-maps",
    ["case-study", "graph", "routing", "geo"],
    "Find the fastest route between two points on a planet-scale road network, in milliseconds, accounting for live traffic. Plain Dijkstra over the whole graph is too slow. What makes it fast?",
    "Model roads as a weighted GRAPH (intersections = nodes, roads = edges weighted by travel time). Shortest path is a graph search, but at planet scale you PRECOMPUTE (contraction hierarchies / hierarchical routing on the highway network) so queries are milliseconds. Live traffic updates edge weights; tiles + geocoding handle rendering and address↔coordinate.",
    [
      { kind: "concept", heading: "Roads as a weighted graph",
        body: "Intersections are nodes; road segments are directed edges weighted by travel time (length / speed, adjusted for road type, turns, one-ways). Routing = shortest path. Dijkstra/A* (with a geographic distance heuristic) work, but running them over hundreds of millions of edges per request is far too slow." },
      { kind: "concept", heading: "Precompute for speed",
        body: "The key trick is PRECOMPUTATION on the (slowly-changing) road graph: Contraction Hierarchies / highway hierarchies precompute shortcut edges so a query explores a tiny fraction of the graph — turning a continental route into a millisecond lookup. Long routes mostly use highways, so a hierarchical graph (local roads → arterials → highways) prunes massively. This precompute is offline; queries are online." },
      { kind: "concept", heading: "Live traffic = dynamic weights",
        body: "Real-time traffic (from aggregated phone/GPS speeds — a streaming aggregation like the ad-click design) updates edge weights. Since heavy precomputation assumes static weights, systems use customizable route planning (separate the slow topology precompute from a fast weight-customization phase) so traffic changes don't force a full recompute. ETA is the path's summed (traffic-adjusted) weights." },
      { kind: "concept", heading: "Tiles, geocoding & follow-ups",
        body: "Map rendering uses precomputed map TILES served via CDN at zoom levels. GEOCODING converts an address ↔ lat/lng (and a spatial index — geohash/quadtree, like the proximity design — finds nearby POIs). Follow-ups: 'alternative routes', 'multi-stop', 'avoid tolls' (edge filters/weights), 'ETA accuracy' (traffic + historical). Signal: weighted road graph + heavy precompute (contraction hierarchies) for ms queries + dynamic weights for traffic + tiles/geocoding." },
    ],
    "Google Maps routing is the planet-scale shortest-path design. The signal is rejecting plain Dijkstra-per-request for precomputed contraction/hierarchies (ms queries), dynamic edge weights for live traffic, plus tiles + geocoding + a spatial index.",
    ["Running Dijkstra over the full graph per request (far too slow at scale).",
     "Ignoring precomputation (contraction hierarchies / highway hierarchy).",
     "Not handling live traffic as dynamic edge-weight updates."],
    0.6, { type: "Map routing", description: "Roads → weighted graph (precomputed contraction hierarchies) → ms shortest-path query; live traffic updates edge weights; tiles + geocoding for rendering/search.", alt: "Road network as a weighted graph with precomputed shortcuts for fast routing." }),

  T("sysd_m9_t4", 4, "Design a Distributed Lock", "design-distributed-lock",
    ["case-study", "coordination", "consensus", "lease"],
    "Many processes across machines need a mutex so only one runs a critical section (e.g. one leader, one job runner). There's no shared memory. How do you build a safe distributed lock?",
    "A lock is a key in a strongly-consistent store with an atomic acquire (set-if-not-exists) and a LEASE/TTL so a crashed holder's lock auto-releases. Safety needs a consensus-backed store (ZooKeeper/etcd) and a FENCING TOKEN to stop a paused-then-resumed holder from acting. Redlock/Redis is common but weaker.",
    [
      { kind: "concept", heading: "Acquire = atomic set-if-absent + TTL",
        body: "A lock is a well-known key. Acquiring = atomically create it only if it doesn't exist (SET key owner NX) so exactly one process wins. Crucially attach a LEASE/TTL: if the holder crashes, the lock expires and others can acquire — otherwise a dead holder deadlocks everyone. The holder must renew (heartbeat) the lease while it still needs the lock." },
      { kind: "concept", heading: "Why a consensus store",
        body: "The lock store must agree on the single owner even under network partitions and node failures — that's a CONSENSUS problem (Paxos/Raft). ZooKeeper (ephemeral znodes) and etcd (Raft) are purpose-built: ephemeral nodes auto-delete when the client session dies (built-in lease), and watches notify waiters. A single Redis instance is fast but a SPOF; Redlock spans several but its safety under timing assumptions is debated." },
      { kind: "concept", heading: "The fencing-token problem",
        body: "Subtle but critical: holder A acquires, then PAUSES (GC/STW) past its lease; the lock expires, B acquires; A resumes thinking it still holds the lock — now TWO writers. Defense: each acquisition returns a monotonically increasing FENCING TOKEN; the protected resource rejects any write with a token lower than the highest it has seen, so the stale holder A is fenced off. A lease alone isn't enough for correctness." },
      { kind: "concept", heading: "Patterns & follow-ups",
        body: "Leader election is a distributed lock (whoever holds it leads; lease + re-election on loss). Use locks sparingly — prefer idempotency / optimistic concurrency where possible. Follow-ups: 'lock holder crashes' (lease expiry), 'split brain' (fencing tokens + consensus), 'reentrant/fair locks', 'thundering herd on release' (queued waiters via Zk sequential nodes). Signal: atomic acquire + lease/TTL + consensus store + FENCING TOKEN for safety." },
    ],
    "A distributed lock tests coordination: atomic set-if-absent + lease/TTL, a consensus-backed store (ZooKeeper/etcd), and — the key insight — fencing tokens so a paused-then-resumed holder can't corrupt the resource. Leader election is the same mechanism.",
    ["A lock with no lease/TTL — a crashed holder deadlocks everyone.",
     "Assuming a lease alone is safe (missing fencing tokens for paused holders).",
     "Using a single Redis instance (SPOF) and treating Redlock as unconditionally safe."],
    0.6),

  T("sysd_m9_t5", 5, "Design a Recommendation System", "design-recommendation-system",
    ["case-study", "ml", "candidate-ranking", "offline-online"],
    "Recommend the next videos/products for hundreds of millions of users from a catalog of millions, in tens of milliseconds. You can't score every item per user at request time. What's the architecture?",
    "A two-stage CANDIDATE-GENERATION → RANKING pipeline: cheap retrieval narrows millions of items to a few hundred candidates (collaborative filtering / embeddings + ANN), then a heavier ML model ranks those few. Heavy work (training, embeddings, precomputed recs) is OFFLINE/batch; serving is a fast online lookup + rank. Feedback loops retrain.",
    [
      { kind: "concept", heading: "You can't score everything",
        body: "Scoring all millions of items with a rich model for every request is impossible in tens of ms. The standard solution is a FUNNEL: drastically reduce the candidate set cheaply, then spend model budget only on the survivors. This two-stage shape (retrieval then ranking) is how YouTube/Netflix/Amazon recommenders work." },
      { kind: "concept", heading: "Stage 1 — candidate generation",
        body: "Retrieval cheaply produces a few hundred plausible candidates from millions: collaborative filtering ('users like you watched…'), content-based similarity, and especially EMBEDDINGS + approximate nearest neighbour (ANN) search — map user and items into a vector space and fetch the nearest items fast. Multiple sources are merged. Recall over precision here." },
      { kind: "concept", heading: "Stage 2 — ranking",
        body: "A heavier ML model scores the few hundred candidates using rich features (user history, context, item features, freshness) to predict engagement (click/watch probability), then sorts. Because the set is small, an expensive model is affordable. Business rules/filters (diversity, already-seen, region) apply on top." },
      { kind: "concept", heading: "Offline vs online & feedback",
        body: "Split work: OFFLINE/batch trains models, computes embeddings, and may precompute recs for popular contexts (stored for O(1) lookup); ONLINE serving does fast retrieval + ranking. A feature store serves features at low latency. User interactions stream back (the ad-click-style pipeline) as training data — a feedback loop. Follow-ups: 'cold start' (popular/content-based fallback), 'real-time signals', 'A/B testing', 'filter bubbles/diversity'. Signal: two-stage retrieval+ranking funnel, embeddings+ANN, offline training / online serving, feedback loop." },
    ],
    "A recommender is the two-stage retrieval→ranking funnel: cheap candidate generation (CF/embeddings+ANN) then heavy ranking of a few hundred, with offline training/precompute and online serving plus a feedback loop. Cold start is the classic follow-up.",
    ["Trying to score the whole catalog per request instead of a candidate→rank funnel.",
     "Conflating offline training with online serving (no split, no precompute).",
     "Ignoring cold start and the interaction feedback loop."],
    0.6, { type: "Recommendation funnel", description: "Millions of items → candidate generation (CF / embeddings + ANN) → few hundred → ranking model (rich features) → top-N. Offline trains; online serves; interactions feed back.", alt: "Two-stage recommendation funnel: candidate generation then ranking, with a feedback loop." }),

  T("sysd_m9_t6", 6, "Design a Stock Exchange (Matching Engine)", "design-stock-exchange",
    ["case-study", "matching-engine", "order-book", "low-latency"],
    "Build the core of an exchange: match buy and sell orders fairly, with correct price-time priority, at very high throughput and microsecond latency. What's the core data structure and why single-threaded?",
    "The heart is an in-memory ORDER BOOK per symbol (bids and asks as price levels, each a time-ordered queue) and a MATCHING ENGINE enforcing price-time priority. For determinism and latency, match SINGLE-THREADED per symbol over an in-memory book, with an append-only event log for durability/replay. Sharding is by symbol.",
    [
      { kind: "concept", heading: "The order book",
        body: "Per symbol, maintain two sides: bids (buyers, highest price first) and asks (sellers, lowest price first), organized by PRICE LEVEL; within a level, orders queue by arrival time (FIFO). This is typically a sorted structure of price levels (e.g. a tree/heap or array keyed by price) plus a queue per level. Best bid and best ask sit at the top — O(1) to read." },
      { kind: "concept", heading: "Matching with price-time priority",
        body: "A new order matches against the opposite side: a buy fills against the lowest asks first (best price), and at the same price the EARLIEST order fills first (time priority) — fairness. Matches generate trades; partial fills leave the remainder resting on the book. Order types (market, limit, IOC, stop) are variations on this matching logic." },
      { kind: "concept", heading: "Why single-threaded + in-memory",
        body: "Correctness demands a deterministic total order of events (no two threads racing to match the same price level), and latency demands no lock contention or disk in the hot path. So the matching engine runs SINGLE-THREADED per symbol over an IN-MEMORY book (think LMAX Disruptor) — astonishingly fast and deterministic. Throughput scales by SHARDING symbols across engines (independent books)." },
      { kind: "concept", heading: "Durability & follow-ups",
        body: "Durability without slowing the hot path: an append-only EVENT LOG (every order/cancel/trade) is written sequentially and replicated; on crash, replay the log to rebuild the in-memory book (event sourcing). Market-data feeds publish book/trade updates (pub-sub, like the MQ design). Follow-ups: 'fairness/anti-gaming', 'risk checks pre-trade', 'multiple order types', 'replay/audit'. Signal: in-memory order book + price-time matching + single-threaded determinism + event-log durability + shard-by-symbol." },
    ],
    "A matching engine tests low-latency deterministic design: an in-memory order book with price-time priority, single-threaded per-symbol matching for determinism + speed, an append-only event log for durability/replay, and sharding by symbol.",
    ["Multi-threaded matching on one book — nondeterministic and racy.",
     "Putting the DB/disk in the matching hot path instead of in-memory + event log.",
     "Ignoring price-time priority (fairness) or how to recover the book after a crash."],
    0.6, { type: "Order book", description: "Per symbol: Bids (high→low) and Asks (low→high) by price level, FIFO within a level. Matching engine fills against best price, earliest-first; trades + remainders logged.", alt: "Order book with bid and ask price levels matched by price-time priority." }),

  T("sysd_m9_t7", 7, "Design an Email Service (Gmail)", "design-email-service",
    ["case-study", "storage", "search", "fanout"],
    "Build Gmail: send/receive email, store billions of messages, search a user's mailbox instantly, and filter spam — at huge scale. How are messages stored and made searchable?",
    "Separate the SMTP send/receive path (queued, retried — email delivery is async + at-least-once) from mailbox STORAGE (messages in a scalable store, sharded by user; large attachments in object storage). A per-user inverted INDEX powers instant search. Spam filtering is an ML stage in the receive pipeline.",
    [
      { kind: "concept", heading: "Send/receive (SMTP) is async",
        body: "Outbound mail goes through SMTP to other providers, which can be slow/unavailable — so sending is QUEUED with retries and backoff (at-least-once delivery; bounces handled). Inbound mail arrives via SMTP, passes through a receiving pipeline (auth checks SPF/DKIM/DMARC, spam/virus scan, filters/rules) before landing in the mailbox. Decouple delivery from the user-facing store with a queue." },
      { kind: "concept", heading: "Storage at scale",
        body: "Billions of messages → shard mailbox storage by user (a user's mail co-located for fast mailbox reads). Message metadata (from, subject, labels, read/unread, thread) in a queryable store; large bodies/ATTACHMENTS in object storage (S3-style) referenced by id, deduplicated (the same attachment sent to many recipients stored once). Threads/conversations group related messages." },
      { kind: "concept", heading: "Instant search = inverted index",
        body: "Searching a mailbox by keyword can't scan messages — build a per-user INVERTED INDEX (term → message ids), like a mini search engine (Lucene/Elasticsearch-style), updated as mail arrives. Searches hit the index for the user's shard. Labels/folders are just indexed attributes." },
      { kind: "concept", heading: "Spam, push & follow-ups",
        body: "Spam filtering is an ML classifier in the receive pipeline (features + a feedback loop from 'mark as spam'). New-mail PUSH uses long-lived connections / notifications (real-time, like presence). Read-heavy (you read far more than you send) → caching. Follow-ups: 'dedup attachments', 'threading', 'quota', 'IMAP/POP sync', 'priority inbox'. Signal: async queued SMTP path + sharded mailbox storage + object-store attachments + per-user inverted index for search + ML spam stage." },
    ],
    "An email service tests separating an async, retried SMTP delivery path from sharded mailbox storage, object-stored deduped attachments, a per-user inverted index for instant search, and an ML spam stage. It's read-heavy → cache.",
    ["Treating email send as synchronous instead of queued + retried (at-least-once).",
     "Scanning messages for search instead of a per-user inverted index.",
     "Storing large attachments inline instead of object storage (and deduping them)."],
    0.6),

  T("sysd_m9_t8", 8, "Design a Flash Sale System", "design-flash-sale",
    ["case-study", "high-contention", "concurrency", "queue"],
    "1 million users hit 'buy' at noon for 1,000 phones in seconds. Don't oversell, don't crash, and stay fair. A naive 'check stock then decrement' in the DB melts under this contention. What architecture survives?",
    "Treat inventory as a scarce atomic counter (in Redis) decremented ATOMICALLY so you never oversell, shed almost all traffic BEFORE the DB (CDN/cache for the page, rate limiting, a virtual waiting room/queue), and process actual orders ASYNCHRONOUSLY off a queue. Idempotency + per-user limits keep it fair.",
    [
      { kind: "concept", heading: "The problem: extreme contention on tiny stock",
        body: "Demand massively exceeds supply for a few seconds. A relational 'SELECT stock; if >0 decrement' is a row hotspot — thousands of transactions contending on one row → lock pileups, timeouts, oversell from races, and a melted DB. The whole design is about protecting that one number and shedding the flood before it reaches the database." },
      { kind: "concept", heading: "Inventory as an atomic counter",
        body: "Hold the limited stock as a counter in a fast in-memory store (Redis) and decrement it ATOMICALLY (DECR / Lua script / atomic conditional) — the operation that returns ≥0 wins a unit; once it hits 0, instantly reject the rest. This prevents overselling at memory speed without DB row locks. The durable DB is reconciled asynchronously as the source of record." },
      { kind: "concept", heading: "Shed load before the DB",
        body: "Most requests must never reach your core: serve the product page from CDN/cache (static), apply aggressive RATE LIMITING, and use a VIRTUAL WAITING ROOM / queue that admits users in controlled batches. Many designs pre-issue a limited number of 'tokens'/eligibility so only ~stock-sized traffic competes. Reject early and cheaply — protect the scarce resource." },
      { kind: "concept", heading: "Async order processing & fairness",
        body: "A winning decrement enqueues an ORDER request; actual order creation/payment is processed ASYNCHRONOUSLY off a queue at a sustainable rate (smoothing the spike), with a reserved-stock HOLD + timeout (release if unpaid). Fairness: IDEMPOTENCY (one click ≠ many orders on retry) and per-user purchase limits. Follow-ups: 'bots' (CAPTCHA/limits), 'restock on payment failure', 'hot-key on the counter' (shard the stock across keys). Signal: atomic counter (no oversell) + heavy pre-DB load shedding (cache/rate-limit/waiting-room) + async queue + idempotency/limits." },
    ],
    "A flash sale tests surviving extreme write contention on scarce stock: an atomic in-memory counter (no oversell), aggressive load-shedding before the DB (CDN, rate-limit, waiting room), async order processing off a queue, and idempotency + per-user limits for fairness.",
    ["A DB 'check stock then decrement' under the spike (hotspot, oversell races, meltdown).",
     "Letting all traffic hit the core instead of shedding it (CDN/rate-limit/waiting room).",
     "Synchronous order+payment in the request path instead of an async queue; no idempotency."],
    0.6, { type: "Flash sale flow", description: "Users → CDN/cache + rate-limit + waiting room (shed most) → atomic Redis DECR stock (no oversell) → enqueue order → async worker creates order/payment with hold+timeout.", alt: "Flash-sale flow: load shedding, atomic stock counter, async order queue." }),
];

const EXERCISES = [
  // Google Docs
  pm({ topicId: "sysd_m9_t1", exerciseId: "sysd_m9_t1_pm_1", position: 1, level: "hard", title: "Merge concurrent edits",
    scenario: "Many users edit one doc simultaneously and must converge. The right approach is…",
    options: ["Operational Transformation or CRDTs over edit operations", "A document-level lock", "Last-write-wins on the whole doc", "Periodic full-document diffs"], correct: "Operational Transformation or CRDTs over edit operations",
    explanation: "OT/CRDTs merge concurrent ops so all replicas converge with intents preserved — no lock, no lost edits." }),
  pm({ topicId: "sysd_m9_t1", exerciseId: "sysd_m9_t1_pm_2", position: 2, level: "medium", title: "Edit unit",
    scenario: "What is the unit exchanged between collaborators?",
    options: ["Small operations (insert/delete at a position)", "The entire document each time", "A screenshot", "A lock token"], correct: "Small operations (insert/delete at a position)",
    explanation: "Edits are fine-grained operations; OT transforms their positions against concurrent ops." }),
  pm({ topicId: "sysd_m9_t1", exerciseId: "sysd_m9_t1_pm_3", position: 3, level: "medium", title: "Late joiner",
    scenario: "A user opens the doc an hour late. What lets them reach the current state?",
    options: ["Replaying the persisted op log (+ snapshots)", "Asking other users to retype", "A lock", "Nothing — they start blank"], correct: "Replaying the persisted op log (+ snapshots)",
    explanation: "The server persists the operation log (with periodic snapshots) so a late client replays to current state." }),
  // Payment
  pm({ topicId: "sysd_m9_t2", exerciseId: "sysd_m9_t2_pm_1", position: 1, level: "hard", title: "No double charge",
    scenario: "A retried charge request must not charge twice. The mechanism is…",
    options: ["An idempotency key per operation", "A retry counter", "A unique timestamp", "A bigger DB lock"], correct: "An idempotency key per operation",
    explanation: "Idempotency keys dedupe retries so a charge applies exactly once — the core payment-correctness property." }),
  pm({ topicId: "sysd_m9_t2", exerciseId: "sysd_m9_t2_pm_2", position: 2, level: "hard", title: "Multi-service flow",
    scenario: "Coordinating authorize→capture→ledger→notify across services (external gateway included) is best done with…",
    options: ["A saga (local steps + compensating actions)", "2PC across all services and the bank", "A single giant transaction", "Fire-and-forget calls"], correct: "A saga (local steps + compensating actions)",
    explanation: "2PC across external gateways is impractical; a saga sequences steps with compensations (e.g. void on failure)." }),
  pm({ topicId: "sysd_m9_t2", exerciseId: "sysd_m9_t2_pm_3", position: 3, level: "medium", title: "Catch drift",
    scenario: "What detects discrepancies between your records and the bank/gateway?",
    options: ["Periodic reconciliation against statements", "Hoping the ledger is right", "Bigger logs", "More retries"], correct: "Periodic reconciliation against statements",
    explanation: "Reconciliation compares the ledger to gateway/bank statements to catch and correct drift." }),
  // Maps
  pm({ topicId: "sysd_m9_t3", exerciseId: "sysd_m9_t3_pm_1", position: 1, level: "medium", title: "Model the roads",
    scenario: "Routing models the road network as…",
    options: ["A weighted graph (intersections=nodes, roads=edges by travel time)", "A relational table of streets", "A key-value store", "A grid of pixels"], correct: "A weighted graph (intersections=nodes, roads=edges by travel time)",
    explanation: "Shortest-path routing needs a weighted graph; edge weights are travel times." }),
  pm({ topicId: "sysd_m9_t3", exerciseId: "sysd_m9_t3_pm_2", position: 2, level: "hard", title: "Millisecond routes",
    scenario: "Why isn't plain Dijkstra-per-request enough at planet scale, and what fixes it?",
    options: ["Precomputation (contraction hierarchies / highway hierarchy)", "A faster CPU only", "Caching the whole graph in RAM", "Sharding by user"], correct: "Precomputation (contraction hierarchies / highway hierarchy)",
    explanation: "Precomputed shortcuts let a query explore a tiny fraction of the graph — ms responses for long routes." }),
  pm({ topicId: "sysd_m9_t3", exerciseId: "sysd_m9_t3_pm_3", position: 3, level: "medium", title: "Live traffic",
    scenario: "How is real-time traffic incorporated into routing?",
    options: ["As dynamic updates to edge weights (travel times)", "By rebuilding the entire graph each minute", "It can't be", "By caching old routes"], correct: "As dynamic updates to edge weights (travel times)",
    explanation: "Aggregated live speeds update edge weights; ETA is the summed traffic-adjusted path weight." }),
  // Distributed lock
  pm({ topicId: "sysd_m9_t4", exerciseId: "sysd_m9_t4_pm_1", position: 1, level: "hard", title: "Crashed holder",
    scenario: "A lock holder crashes while holding the lock. What prevents a permanent deadlock?",
    options: ["A lease/TTL so the lock auto-expires", "Manual admin intervention", "An infinite wait", "A bigger timeout on clients"], correct: "A lease/TTL so the lock auto-expires",
    explanation: "A lease/TTL releases the lock if the holder dies; the holder heartbeats to renew while still working." }),
  pm({ topicId: "sysd_m9_t4", exerciseId: "sysd_m9_t4_pm_2", position: 2, level: "hard", title: "The subtle bug",
    scenario: "A holder pauses (GC) past its lease, the lock expires, another acquires, then the first resumes and writes. What stops the resulting two-writer corruption?",
    options: ["A monotonic fencing token the resource checks", "A longer lease", "Faster GC", "Retrying the write"], correct: "A monotonic fencing token the resource checks",
    explanation: "Fencing tokens let the resource reject writes from a stale holder with an older token — a lease alone isn't safe." }),
  pm({ topicId: "sysd_m9_t4", exerciseId: "sysd_m9_t4_pm_3", position: 3, level: "medium", title: "Where to store it",
    scenario: "For safety under partitions/failures, the lock state should live in…",
    options: ["A consensus-backed store (ZooKeeper/etcd)", "A single Redis instance only", "An in-memory map on one server", "A client's local disk"], correct: "A consensus-backed store (ZooKeeper/etcd)",
    explanation: "Consensus (Raft/Paxos) agrees on the single owner under failure; a single Redis is a SPOF." }),
  // Recommendation
  pm({ topicId: "sysd_m9_t5", exerciseId: "sysd_m9_t5_pm_1", position: 1, level: "hard", title: "Two stages",
    scenario: "Recommending from millions of items in ms uses which architecture?",
    options: ["Candidate generation (retrieval) → ranking funnel", "Score every item per request", "A single SQL ORDER BY", "Random sampling only"], correct: "Candidate generation (retrieval) → ranking funnel",
    explanation: "Cheap retrieval narrows millions to a few hundred; a heavy model ranks only those." }),
  pm({ topicId: "sysd_m9_t5", exerciseId: "sysd_m9_t5_pm_2", position: 2, level: "medium", title: "Fast retrieval",
    scenario: "What cheaply fetches a few hundred candidate items from millions?",
    options: ["Embeddings + approximate nearest neighbour (ANN) / collaborative filtering", "Scanning the catalog", "The ranking model", "A relational join"], correct: "Embeddings + approximate nearest neighbour (ANN) / collaborative filtering",
    explanation: "Embeddings + ANN (and CF) retrieve nearby candidates fast; recall matters more than precision here." }),
  pm({ topicId: "sysd_m9_t5", exerciseId: "sysd_m9_t5_pm_3", position: 3, level: "medium", title: "Work split",
    scenario: "How is heavy model work kept off the request path?",
    options: ["Train/compute embeddings offline (batch); serve fast online", "Train on every request", "Never train", "Compute everything online"], correct: "Train/compute embeddings offline (batch); serve fast online",
    explanation: "Offline training/precompute + online retrieval+ranking; interactions feed back as training data." }),
  // Matching engine
  pm({ topicId: "sysd_m9_t6", exerciseId: "sysd_m9_t6_pm_1", position: 1, level: "hard", title: "Core structure",
    scenario: "The core of an exchange's matching engine is…",
    options: ["An in-memory order book (price levels, FIFO within a level)", "A relational orders table", "A message queue", "A hash map of users"], correct: "An in-memory order book (price levels, FIFO within a level)",
    explanation: "Bids/asks organized by price level with time-ordered queues — the order book." }),
  pm({ topicId: "sysd_m9_t6", exerciseId: "sysd_m9_t6_pm_2", position: 2, level: "hard", title: "Why single-threaded",
    scenario: "Why match single-threaded per symbol over an in-memory book?",
    options: ["Deterministic ordering + no lock contention/disk in the hot path", "Single-threaded is always simpler to write", "To save memory", "Because threads aren't available"], correct: "Deterministic ordering + no lock contention/disk in the hot path",
    explanation: "A single thread gives a deterministic total event order and microsecond latency; scale by sharding symbols." }),
  pm({ topicId: "sysd_m9_t6", exerciseId: "sysd_m9_t6_pm_3", position: 3, level: "medium", title: "Fairness rule",
    scenario: "Orders match by which priority?",
    options: ["Price first, then time (price-time priority)", "Largest order first", "Random", "Newest first"], correct: "Price first, then time (price-time priority)",
    explanation: "Best price fills first; ties broken by earliest arrival — price-time priority ensures fairness." }),
  // Email
  pm({ topicId: "sysd_m9_t7", exerciseId: "sysd_m9_t7_pm_1", position: 1, level: "medium", title: "Sending mail",
    scenario: "Outbound email (other providers can be slow/down) should be…",
    options: ["Queued with retries/backoff (async, at-least-once)", "A synchronous blocking call", "Dropped if the first attempt fails", "Sent only in batches at night"], correct: "Queued with retries/backoff (async, at-least-once)",
    explanation: "SMTP delivery is unreliable/slow, so queue and retry; handle bounces — at-least-once." }),
  pm({ topicId: "sysd_m9_t7", exerciseId: "sysd_m9_t7_pm_2", position: 2, level: "hard", title: "Instant search",
    scenario: "Searching a mailbox by keyword instantly needs…",
    options: ["A per-user inverted index", "A full scan of the user's messages", "A LIKE query on a SQL table", "Grepping object storage"], correct: "A per-user inverted index",
    explanation: "An inverted index (term→message ids), updated on arrival, makes mailbox search instant." }),
  pm({ topicId: "sysd_m9_t7", exerciseId: "sysd_m9_t7_pm_3", position: 3, level: "medium", title: "Attachments",
    scenario: "Large attachments are best stored…",
    options: ["In object storage, referenced by id and deduplicated", "Inline in the message metadata DB", "In the search index", "On the SMTP server"], correct: "In object storage, referenced by id and deduplicated",
    explanation: "Object storage holds big blobs; dedup the same attachment sent to many recipients to one copy." }),
  // Flash sale
  pm({ topicId: "sysd_m9_t8", exerciseId: "sysd_m9_t8_pm_1", position: 1, level: "hard", title: "Don't oversell",
    scenario: "Under a million concurrent buyers for 1,000 units, what prevents overselling without melting the DB?",
    options: ["An atomic in-memory counter (e.g. Redis DECR)", "A SQL 'check stock then decrement' transaction", "A bigger DB connection pool", "Optimistic UI only"], correct: "An atomic in-memory counter (e.g. Redis DECR)",
    explanation: "Atomic decrement of an in-memory counter prevents oversell at memory speed; the DB row would be a hotspot." }),
  pm({ topicId: "sysd_m9_t8", exerciseId: "sysd_m9_t8_pm_2", position: 2, level: "hard", title: "Protect the core",
    scenario: "How do you keep the flood of traffic off your core services?",
    options: ["Shed load early: CDN/cache + rate limiting + a virtual waiting room", "Scale the DB vertically", "Let everything through and queue at the DB", "Disable caching"], correct: "Shed load early: CDN/cache + rate limiting + a virtual waiting room",
    explanation: "Serve static from CDN, rate-limit, and admit users in controlled batches so only ~stock-sized traffic competes." }),
  pm({ topicId: "sysd_m9_t8", exerciseId: "sysd_m9_t8_pm_3", position: 3, level: "medium", title: "Process orders",
    scenario: "After a user wins a unit, the order/payment should be…",
    options: ["Enqueued and processed asynchronously (with a hold + timeout)", "Created synchronously in the buy request", "Skipped", "Batched until midnight"], correct: "Enqueued and processed asynchronously (with a hold + timeout)",
    explanation: "Async order processing off a queue smooths the spike; a stock hold with timeout releases unpaid reservations." }),
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
  console.log(`\nDone — M9 Case Studies IV seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
