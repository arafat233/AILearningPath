/**
 * Seed — System Design track MVP (COMPETITIVE_GAP_ANALYSIS.md GAP #2).
 *
 * A NEW standalone professional track `pro_sysd` ("System Design — Scalability
 * & Architecture"), separate from pro_java / pro_lld. One module of
 * fundamentals + 3 case studies. The Pro stack is data-driven, so the live
 * track appears end-to-end with NO backend/frontend code change.
 *
 * Exercises are pattern_match (the natural modality for "which approach /
 * component / trade-off fits?") — reliably gradable, no sandbox. Architecture
 * topics carry a teaching.visual_aid whose `description` is an "A → B → C" flow
 * that components/pro/VisualAid.jsx auto-renders as a boxes-and-arrows diagram
 * (no authored SVG needed).
 *
 * Idempotent upsert-by-id; recomputes track totals from the DB.
 * Usage:  node config/seedSysdTrack.js   ·   npm: npm run seed:sysd
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTrack, ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m1";
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);

function pm(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const TRACK = {
  key: TRACK_KEY, slug: "system-design",
  name: "System Design — Scalability & Architecture",
  description: "Design large-scale systems for interviews and real engineering: estimation, scaling, load balancing, caching, data stores, replication & sharding, the CAP theorem, async messaging, and full case studies (URL shortener, rate limiter, news feed).",
  language: "system-design", status: "live",
};

const MODULE = {
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 1,
  name: "System Design Fundamentals", slug: "system-design-fundamentals",
  description: "The building blocks every design interview draws on — a repeatable framework, capacity estimation, the core scaling techniques and components — applied in three end-to-end case studies.",
  estimatedHours: 8, prerequisites: [], status: "live",
};

// T builds a topic; `flow` (optional) becomes a teaching.visual_aid the
// VisualAid component auto-renders as a boxes-and-arrows architecture diagram.
const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 35, difficulty: 3, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI },
    teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 35, difficulty: diff, xpReward: 55, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("sysd_m1_t1", 1, "The System Design Interview Framework", "sysd-framework",
    ["framework", "process", "interview"],
    "45 minutes, a vague prompt ('design Twitter'), and a blank whiteboard. What structure stops you from rambling and shows senior judgement?",
    "A repeatable framework: clarify requirements & scale, do capacity estimation, sketch a high-level design, deep-dive one or two components, then discuss bottlenecks and trade-offs. Driving this loop out loud is what's graded.",
    [
      { kind: "concept", heading: "The five steps",
        body: "1) Clarify functional + non-functional requirements and scope. 2) Estimate scale (users, QPS, storage, bandwidth). 3) Draw the high-level design (major components + data flow). 4) Deep-dive the 1–2 components the interviewer cares about. 5) Identify bottlenecks, single points of failure, and trade-offs. Narrate each step." },
      { kind: "concept", heading: "Functional vs non-functional",
        body: "Functional requirements are WHAT the system does (post a tweet, follow a user). Non-functional are the QUALITIES (high availability, low latency, eventual vs strong consistency, scale to 100M DAU). Non-functionals drive almost every architecture decision — pin them down early." },
      { kind: "concept", heading: "There is no single right answer",
        body: "System design is about trade-offs, not a canonical solution. Interviewers want to hear you weigh options ('SQL gives us transactions but is harder to shard; we'll start with Postgres and shard by user_id later'). State assumptions, justify choices, and acknowledge what you'd revisit at higher scale." },
      { kind: "concept", heading: "Drive the conversation",
        body: "Lead the discussion rather than waiting to be asked. Propose, then check in ('does that work, or should we optimise for write-heavy traffic?'). Manage time: don't spend 20 minutes on estimation. Senior signal = breadth first, then depth where it matters." },
    ],
    "This framework is the meta-skill the entire track builds on. Candidates who follow a visible, repeatable process consistently outscore those who improvise — even with equal knowledge.",
    ["Diving into components before clarifying requirements and scale.",
     "Treating it as a quiz with one right answer instead of a trade-off discussion.",
     "Spending too long on estimation and running out of time for the deep-dive."],
    0.3, null),

  T("sysd_m1_t2", 2, "Back-of-the-Envelope Estimation", "sysd-estimation",
    ["estimation", "capacity", "qps", "storage"],
    "The interviewer asks 'how many servers?' You need a number in 90 seconds. What quick math gets you there credibly?",
    "Estimate QPS, storage, and bandwidth from the user count with round numbers and powers of ten. The goal isn't precision — it's showing you can size a system and spot what dominates (reads vs writes, storage growth).",
    [
      { kind: "concept", heading: "Numbers worth memorising",
        body: "~86,400 seconds/day ≈ 10^5. So 1 request/user/day for 1M users ≈ 12 QPS; for 100M users ≈ 1,200 QPS. 1 byte → KB → MB → GB → TB are 10^3 steps. A char ≈ 1 byte; a typical row a few hundred bytes. Latency: memory ns, SSD µs, network within-DC ms, cross-continent ~100ms." },
      { kind: "concept", heading: "QPS: average vs peak",
        body: "Average QPS = daily requests / 86,400. Peak is typically 2–10× average (bursty traffic). Size capacity for peak, not average. Separate READ QPS from WRITE QPS — most systems are read-heavy (e.g. 100:1), which decides where caching and replicas go." },
      { kind: "concept", heading: "Storage growth",
        body: "Storage = (objects/day) × (bytes/object) × retention. Always project growth over 1–5 years — '5M tweets/day × 300 bytes × 365 × 5 ≈ 2.7 TB' tells you whether one DB suffices or you must shard. State the assumption behind every multiplier." },
      { kind: "concept", heading: "Use the estimate to drive design",
        body: "The point of estimation is the DECISION it unlocks: 1,200 QPS fits a handful of servers; 1.2M QPS needs aggressive caching, sharding, and a CDN. High read:write ratio → read replicas + cache. Large storage → sharding. Make the number lead somewhere." },
    ],
    "Estimation is asked in almost every senior interview to test whether you can size systems and reason about what dominates. The exact figure matters less than the method and the decisions it informs.",
    ["Aiming for false precision instead of round powers of ten.",
     "Sizing for average load and ignoring peak bursts.",
     "Computing numbers but never using them to justify a design choice."],
    0.4, null),

  T("sysd_m1_t3", 3, "Scaling: Vertical vs Horizontal", "sysd-scaling",
    ["scaling", "stateless", "horizontal", "vertical"],
    "Traffic 10×'d overnight. Do you buy a bigger server or add more servers — and what one property makes 'add more' actually work?",
    "Vertical scaling (bigger machine) is simple but capped and a single point of failure. Horizontal scaling (more machines behind a load balancer) is the path to large scale — and it requires STATELESS services so any request can hit any server.",
    [
      { kind: "concept", heading: "Vertical vs horizontal",
        body: "Vertical (scale up): add CPU/RAM to one machine — zero code change, but hard ceiling, expensive at the top, and a single point of failure. Horizontal (scale out): add more machines behind a load balancer — near-limitless and fault-tolerant, but requires the app to be stateless and adds distributed-systems complexity." },
      { kind: "concept", heading: "Statelessness is the enabler",
        body: "Horizontal scaling works only if any server can handle any request. That means NO per-user state stored locally on a server (no in-memory sessions). Push session/state to a shared store (Redis) or a signed token (JWT). Then you can add/remove servers freely and a server crash loses nothing." },
      { kind: "concept", heading: "Scale every tier",
        body: "App servers scale out easily once stateless. The DATABASE is usually the real bottleneck — it scales via read replicas (reads), caching, and eventually sharding (writes). 'Add more app servers' is necessary but rarely sufficient; the data tier needs its own plan." },
    ],
    "The vertical-vs-horizontal trade-off and the statelessness requirement are bread-and-butter. Interviewers expect you to default to horizontal scaling and immediately note 'so the services must be stateless'.",
    ["Forgetting that horizontal scaling requires stateless services (in-memory sessions break it).",
     "Scaling app servers while ignoring the database bottleneck.",
     "Treating vertical scaling as a long-term answer despite its ceiling and SPOF."],
    0.3, { type: "Horizontal scaling", description: "Request path: Client → Load Balancer → App Server 1, App Server 2, App Server 3 → Shared Cache → Database. Stateless servers let the load balancer route any request to any server.", alt: "Client to load balancer to a pool of stateless app servers to a shared cache and database." }),

  T("sysd_m1_t4", 4, "Load Balancing", "sysd-load-balancing",
    ["load-balancing", "round-robin", "l4", "l7"],
    "Ten app servers behind one address. Who decides which server each request hits, and how do you avoid sending traffic to a dead one?",
    "A load balancer distributes incoming requests across a pool using an algorithm (round-robin, least-connections, hashing), checks server health, and removes unhealthy ones. It's also where you terminate TLS and can route by content (L7).",
    [
      { kind: "concept", heading: "What a load balancer does",
        body: "It spreads traffic across healthy servers, performs health checks (removing failed nodes), and provides a single stable entry point. It improves both scalability (more servers) and availability (no single server is a SPOF — though the LB itself must be made redundant)." },
      { kind: "concept", heading: "Balancing algorithms",
        body: "Round-robin (even rotation) is the simple default. Least-connections routes to the least-busy server (better for long/uneven requests). Weighted variants favour bigger servers. IP/consistent hashing pins a client to a server (useful for sticky sessions or cache locality)." },
      { kind: "concept", heading: "L4 vs L7",
        body: "Layer-4 (transport) balances by IP/port — fast, protocol-agnostic, no payload inspection. Layer-7 (application) understands HTTP, so it can route by URL path/host/headers, terminate TLS, and do content-based routing (e.g. /api → service A, /img → service B). L7 is more flexible; L4 is faster." },
      { kind: "concept", heading: "Avoid the LB becoming a SPOF",
        body: "A single load balancer is itself a single point of failure. Run it in active-passive or active-active pairs with a floating/virtual IP and health checks, or use a managed LB (ELB/ALB) that's redundant by design." },
    ],
    "Load balancing appears in essentially every design. Interviewers probe the algorithm choice, L4-vs-L7, health checks, and 'isn't the LB itself a single point of failure?'.",
    ["Forgetting health checks, so traffic keeps going to dead servers.",
     "Treating the load balancer as a SPOF instead of making it redundant.",
     "Defaulting to sticky sessions (which fight statelessness) when a shared session store is cleaner."],
    0.4, { type: "Load balancing", description: "Traffic flow: Client → Load Balancer → Server Pool. The load balancer health-checks each server and routes only to healthy ones.", alt: "Client to load balancer to a pool of servers." }),

  T("sysd_m1_t5", 5, "Caching", "sysd-caching",
    ["caching", "cache-aside", "cdn", "eviction"],
    "Your database is melting under read traffic, but 90% of reads are the same hot rows. Where do you put a cache, and who keeps it correct?",
    "A cache stores hot data in fast memory to cut latency and offload the database. The key decisions are WHERE (client, CDN, app, dedicated cache like Redis), the read/write strategy (cache-aside, write-through, write-back), and how you handle eviction and staleness.",
    [
      { kind: "concept", heading: "Where to cache",
        body: "Layers, edge-to-core: browser cache, CDN (static assets near users), a load-balancer/reverse-proxy cache, an in-process cache, and a shared distributed cache (Redis/Memcached). Each cuts load on everything behind it. A CDN is the single biggest win for static/media content." },
      { kind: "concept", heading: "Read/write strategies",
        body: "Cache-aside (lazy): app checks cache, on miss reads DB and populates cache — the common default. Write-through: writes go to cache AND DB synchronously (consistent, slower writes). Write-back: writes hit cache and flush to DB later (fast, risk of loss). Read-through delegates the miss-fill to the cache layer." },
      { kind: "concept", heading: "Eviction + staleness",
        body: "Caches are bounded, so they evict (LRU/LFU/TTL). The hard part is invalidation — keeping the cache from serving stale data after a DB write. Use TTLs for acceptable staleness, or explicit invalidation on write. 'There are only two hard things in CS: cache invalidation and naming things.'" },
      { kind: "concept", heading: "Pitfalls: stampede & hot keys",
        body: "Cache stampede: a popular key expires and thousands of requests hit the DB at once — mitigate with locks/request-coalescing or staggered TTLs. Hot key: one key gets so much traffic it overwhelms a single cache node — mitigate by replicating or sharding that key." },
    ],
    "Caching is in every read-heavy design. Interviewers want the right placement (CDN for static, Redis for hot rows), a named strategy (usually cache-aside), and awareness of invalidation, stampede, and hot keys.",
    ["Ignoring cache invalidation, so users see stale data.",
     "Caching everything instead of the hot subset that actually benefits.",
     "Missing cache-stampede / hot-key failure modes under load."],
    0.4, { type: "Cache-aside read path", description: "Read path: Client → App Server → Cache → Database. On a cache hit the database is skipped; on a miss the app reads the database and populates the cache.", alt: "Client to app server to cache to database, cache-aside." }),

  T("sysd_m1_t6", 6, "SQL vs NoSQL — Choosing a Data Store", "sysd-sql-nosql",
    ["database", "sql", "nosql", "acid"],
    "Relational or not? The wrong call early makes everything downstream harder. What actually decides it?",
    "SQL gives you a fixed schema, strong (ACID) transactions, and rich joins — ideal when relationships and consistency matter. NoSQL trades joins/transactions for flexible schemas and easy horizontal scale — ideal for huge volume, simple access patterns, or evolving data. Match the store to the access pattern.",
    [
      { kind: "concept", heading: "SQL (relational)",
        body: "Structured rows with a fixed schema, ACID transactions, and powerful joins/queries (Postgres, MySQL). Best when data is relational, integrity/transactions matter (payments, orders), and query patterns vary. Scales up easily; scaling out (sharding) is harder because joins and transactions span shards." },
      { kind: "concept", heading: "NoSQL families",
        body: "Key-value (Redis, DynamoDB) — fastest, simplest lookups. Document (MongoDB) — flexible JSON, nested data. Wide-column (Cassandra, HBase) — massive write throughput, time-series. Graph (Neo4j) — relationship-heavy traversals. Each is built for a specific access pattern and shards horizontally by design." },
      { kind: "concept", heading: "How to choose",
        body: "Pick by ACCESS PATTERN and requirements, not hype. Need transactions, joins, ad-hoc queries → SQL. Need massive scale, simple key lookups, flexible/evolving schema, very high write volume → NoSQL. Polyglot persistence is normal: Postgres for orders, Redis for sessions, Cassandra for the activity feed." },
      { kind: "concept", heading: "The denormalization trade",
        body: "NoSQL often denormalizes (duplicates data) to avoid joins, trading storage and write-complexity for fast reads. SQL normalizes to avoid duplication, trading read joins for write simplicity and integrity. Your read:write ratio and consistency needs decide which trade fits." },
    ],
    "The SQL-vs-NoSQL decision opens most data-tier discussions. Strong answers justify the choice from the access pattern and requirements, and mention polyglot persistence rather than declaring one universally better.",
    ["Choosing by hype ('NoSQL scales') instead of the access pattern.",
     "Assuming NoSQL can't be consistent or SQL can't scale — both are nuanced.",
     "Forgetting that sharded SQL loses easy cross-shard joins and transactions."],
    0.4, null),

  T("sysd_m1_t7", 7, "Replication & Sharding", "sysd-replication-sharding",
    ["replication", "sharding", "partitioning", "consistent-hashing"],
    "One database can't hold the data or serve the traffic. Do you copy it or split it — and how do you split it without hot spots?",
    "Replication COPIES data across nodes (read scaling + availability); sharding SPLITS data across nodes (write + storage scaling). Replication is leader-follower or multi-leader; sharding needs a good partition key, and consistent hashing keeps re-sharding cheap.",
    [
      { kind: "concept", heading: "Replication — copy for reads & availability",
        body: "Keep full copies of the data on multiple nodes. Leader-follower (primary-replica): writes go to the leader, reads fan out to followers — great for read-heavy loads, but followers lag (replication lag → eventual consistency on reads). Multi-leader/leaderless (Cassandra) accepts writes anywhere, trading consistency for availability." },
      { kind: "concept", heading: "Sharding — split for writes & storage",
        body: "Partition the data so each shard holds a subset (e.g. users A–M on shard 1, N–Z on shard 2). This scales writes and storage beyond one machine. The partition KEY is critical: a bad key creates hot shards (celebrity user) and uneven load." },
      { kind: "concept", heading: "Partitioning strategies",
        body: "Range-based (by key range) — simple, supports range scans, but prone to hot spots. Hash-based (hash the key) — even distribution, but no range scans. Directory-based — a lookup service maps keys to shards (flexible, adds a hop). Pick by access pattern; hash is the common default for even spread." },
      { kind: "concept", heading: "Consistent hashing",
        body: "Naive hash(key) % N remaps almost every key when N changes (adding a node reshuffles everything). Consistent hashing places nodes and keys on a ring so adding/removing a node moves only ~1/N of keys. Virtual nodes smooth out imbalance. It's the standard way to shard caches and databases elastically." },
    ],
    "Replication and sharding are the core data-scaling tools. Interviewers expect replication-for-reads vs sharding-for-writes, a sensible partition key, the hot-shard problem, and consistent hashing for elastic re-sharding.",
    ["Confusing replication (copies) with sharding (splits).",
     "Choosing a partition key that creates hot shards (e.g. by celebrity user).",
     "Using modulo hashing where consistent hashing is needed for elastic scaling.",
     "Ignoring replication lag → stale reads from followers."],
    0.5, null),

  T("sysd_m1_t8", 8, "CAP Theorem & Consistency", "sysd-cap-consistency",
    ["cap", "consistency", "availability", "partition-tolerance"],
    "A network partition splits your cluster. A write lands on one side. Do you reject reads on the other side to stay correct, or serve possibly-stale data to stay up?",
    "CAP says that during a network Partition you must choose between Consistency (reject/err to avoid stale data) and Availability (serve possibly-stale data). Since partitions are unavoidable in distributed systems, real systems are effectively CP or AP, and most pick consistency MODELS along a spectrum.",
    [
      { kind: "concept", heading: "The theorem (stated correctly)",
        body: "Of Consistency, Availability, and Partition-tolerance, you can guarantee only two. Because networks WILL partition, P is non-negotiable in a distributed system — so the real choice during a partition is C vs A. CP systems sacrifice availability to stay consistent; AP systems stay available but may serve stale data." },
      { kind: "concept", heading: "Strong vs eventual consistency",
        body: "Strong consistency: every read sees the latest write (as if one copy) — simpler to reason about, costs latency/availability. Eventual consistency: replicas converge 'eventually'; reads may be briefly stale — higher availability and lower latency. Many systems offer tunable consistency (e.g. quorum reads/writes)." },
      { kind: "concept", heading: "Choosing per use-case",
        body: "Bank balance / inventory → strong consistency (CP) — stale data is unacceptable. Social feed / likes / DNS → eventual consistency (AP) — being briefly stale is fine and availability matters more. The right answer is usually per-feature, not whole-system." },
      { kind: "concept", heading: "PACELC — the fuller picture",
        body: "CAP only covers the partition case. PACELC adds: Else (no partition), you still trade Latency vs Consistency. Even in healthy operation, strong consistency costs round-trips. So the consistency choice affects normal-case latency too, not just partition behaviour." },
    ],
    "CAP is the most-misquoted topic in interviews — stating it correctly (P is given; choose C or A during a partition) and mapping use-cases to consistency models is a clear senior signal.",
    ["Misstating CAP as 'pick any 2' without noting P is mandatory in distributed systems.",
     "Treating consistency as all-or-nothing instead of a spectrum / per-feature choice.",
     "Choosing strong consistency everywhere and ignoring its latency/availability cost."],
    0.5, null),

  T("sysd_m1_t9", 9, "Message Queues & Async Processing", "sysd-message-queues",
    ["message-queue", "async", "kafka", "pub-sub"],
    "A user uploads a video; transcoding takes 2 minutes. Do you make them wait on the HTTP request, or is there a better shape?",
    "A message queue decouples producers from consumers: the request enqueues a job and returns immediately, while workers process asynchronously. This smooths traffic spikes, isolates failures, and enables event-driven, independently-scalable services.",
    [
      { kind: "concept", heading: "Why async + queues",
        body: "Move slow or spiky work off the request path: enqueue a job, return 202 immediately, let workers process it. Benefits: responsiveness (no long blocking requests), load-leveling (the queue buffers bursts), fault isolation (a slow consumer doesn't stall producers), and decoupling (producers don't know consumers)." },
      { kind: "concept", heading: "Queue vs pub-sub",
        body: "A work queue delivers each message to ONE consumer (competing consumers share the load — e.g. a task queue). Pub-sub broadcasts each message to ALL subscribers (fan-out — e.g. an event published to several services). Kafka topics with consumer groups give both: fan-out across groups, load-share within a group." },
      { kind: "concept", heading: "Delivery semantics",
        body: "At-most-once (may drop), at-least-once (may duplicate — the common default), exactly-once (hard, often emulated). Because at-least-once can redeliver, consumers should be IDEMPOTENT (processing the same message twice is safe). Dead-letter queues capture messages that repeatedly fail." },
      { kind: "concept", heading: "Trade-offs",
        body: "Async adds complexity: eventual completion (the user must be told later), ordering challenges, and the queue itself to operate/scale. Use it when work is slow, spiky, or must fan out — not for simple synchronous reads where it just adds latency and moving parts." },
    ],
    "Message queues appear whenever there's slow or spiky work (uploads, notifications, feeds). Interviewers probe queue-vs-pub-sub, at-least-once + idempotency, and when async is NOT worth the complexity.",
    ["Reaching for a queue when a simple synchronous call would do.",
     "Assuming exactly-once delivery instead of designing idempotent consumers for at-least-once.",
     "Ignoring ordering and dead-letter handling for failed messages."],
    0.4, { type: "Async processing", description: "Upload flow: Client → API Server → Message Queue → Worker → Database. The API enqueues the job and returns immediately; a worker processes it asynchronously.", alt: "Client to API to message queue to worker to database." }),

  T("sysd_m1_t10", 10, "Case Study: Design a URL Shortener", "sysd-url-shortener",
    ["case-study", "url-shortener", "tinyurl", "hashing"],
    "Turn a long URL into tinyurl.com/x7Gk2 and redirect on lookup. It sounds trivial — where's the actual system-design depth?",
    "The depth is in: generating short unique keys at scale, making redirects ultra-low-latency (read-heavy → cache + CDN), and storing billions of mappings (key-value store, sharded). It's the canonical 'read-heavy, simple-access-pattern' design.",
    [
      { kind: "concept", heading: "Requirements + estimation",
        body: "Functional: shorten(longUrl) → shortKey; redirect(shortKey) → 301/302 to longUrl. Non-functional: very high read:write ratio (~100:1), low-latency redirects, high availability. Estimate: 100M new URLs/month, billions of reads — this is overwhelmingly a READ system, which drives caching." },
      { kind: "concept", heading: "Generating the short key",
        body: "Options: (a) hash the URL (MD5/SHA) and take the first N base-62 chars — collisions possible, need a check/retry; (b) a global counter encoded in base-62 — no collisions, but the counter must be distributed (e.g. a key-range service / Zookeeper / DB ticket server). Base-62 (a–z A–Z 0–9): 7 chars ≈ 3.5 trillion keys." },
      { kind: "concept", heading: "Storage + read path",
        body: "Mapping shortKey → longUrl is a perfect key-value store (DynamoDB/Cassandra), sharded by shortKey via consistent hashing. The redirect path is cache-first: Client → CDN/LB → App → Cache (Redis) → KV store. Most reads never touch the database. Use 301 (permanent) sparingly — 302 keeps control for analytics." },
      { kind: "concept", heading: "Extras & edge cases",
        body: "Custom aliases (check uniqueness), expiration/TTL, analytics (click counts — fire async to a queue, don't block the redirect), and abuse/rate-limiting. Edge cases: duplicate long URLs (dedupe or allow many?), key exhaustion, and very hot links (hot-key caching)." },
    ],
    "The URL shortener is the most common warm-up design. The signal is recognising it's read-dominated (cache + CDN + KV store) and reasoning clearly about unique key generation at scale.",
    ["Designing it write-heavy and missing that redirects dominate (cache-first).",
     "Hand-waving key generation instead of addressing collisions or a distributed counter.",
     "Blocking the redirect on analytics writes instead of firing them async."],
    0.5, { type: "Redirect path", description: "Redirect path: Client → CDN → Load Balancer → App Server → Cache → Key-Value Store. Most redirects are served from cache and never reach the database.", alt: "Client to CDN to load balancer to app server to cache to key-value store." }),

  T("sysd_m1_t11", 11, "Case Study: Distributed Rate Limiter", "sysd-rate-limiter",
    ["case-study", "rate-limiter", "distributed", "token-bucket"],
    "Limit each user to 100 requests/minute — across 50 app servers that don't share memory. Where does the count live?",
    "A single-node counter won't do: with many servers the limit must be enforced on SHARED state (Redis) using an algorithm (token bucket / sliding window) with atomic operations. The design is about correctness under concurrency and keeping the check fast.",
    [
      { kind: "concept", heading: "Why it's a distributed problem",
        body: "With one server, an in-memory counter per user works. With N servers behind a load balancer, a user's requests hit different servers, so a local count under-counts. The limit must live in SHARED, fast storage (Redis) that every server reads/updates atomically." },
      { kind: "concept", heading: "Algorithms (recap from LLD)",
        body: "Fixed window — simple counter per time window, but allows ~2× bursts at boundaries. Sliding window — smooths boundaries, more state. Token bucket — refills tokens at a steady rate, allows bursts up to a capacity, O(1) — the common default. Leaky bucket — smooths output to a constant rate." },
      { kind: "concept", heading: "Atomicity in Redis",
        body: "The check-and-decrement must be atomic or concurrent requests race past the limit. Use Redis INCR with EXPIRE, or a Lua script / Redis function that does the read-modify-write in one round trip. This is the crux: a non-atomic check lets bursts slip through." },
      { kind: "concept", heading: "Where to enforce + failure mode",
        body: "Enforce at the API gateway / a middleware (LLD: Chain of Responsibility) before business logic. Return 429 with a Retry-After header. Decide the fail-open vs fail-closed policy if Redis is down (usually fail-open for availability). Per-user, per-IP, and per-endpoint limits often coexist." },
    ],
    "The distributed rate limiter bridges LLD and system design — interviewers want shared atomic state (Redis), the token-bucket default, the 429/Retry-After contract, and the fail-open/closed decision.",
    ["Using per-server in-memory counters that under-count across a fleet.",
     "A non-atomic check-and-increment that lets concurrent bursts exceed the limit.",
     "Not deciding what happens when the shared store (Redis) is unavailable."],
    0.5, { type: "Rate limiter placement", description: "Request flow: Client → API Gateway → Rate Limiter → Redis. The gateway checks the shared counter in Redis atomically before forwarding allowed requests.", alt: "Client to API gateway to rate limiter to Redis shared counter." }),

  T("sysd_m1_t12", 12, "Case Study: Design a News Feed", "sysd-news-feed",
    ["case-study", "news-feed", "fanout", "timeline"],
    "Open the app and see a feed of posts from everyone you follow, instantly. With millions of users and celebrities with 100M followers, how is that feed built?",
    "The core decision is fan-out on WRITE (push: precompute each follower's feed when you post) vs fan-out on READ (pull: assemble the feed at read time). Real systems use a HYBRID — push for normal users, pull for celebrities — to avoid the 'celebrity fan-out' explosion.",
    [
      { kind: "concept", heading: "Fan-out on write (push)",
        body: "When a user posts, immediately write that post's id into every follower's precomputed feed (in a cache like Redis). Reads are then trivially fast (just read your feed list). Cost: a post by someone with 100M followers triggers 100M writes — the 'celebrity problem' — and wastes work on inactive followers." },
      { kind: "concept", heading: "Fan-out on read (pull)",
        body: "Store each user's posts; at read time, fetch the latest posts from everyone you follow and merge them. Writes are cheap (just store the post). Cost: reads are expensive (fan-in across many followees), especially for users who follow thousands — slow feed loads." },
      { kind: "concept", heading: "The hybrid (what real systems do)",
        body: "Push for normal users (fast reads), but for celebrities/high-fan-out accounts, DON'T pre-push — instead pull their recent posts at read time and merge into the pushed feed. This caps the write explosion while keeping reads fast for the common case. Twitter/Instagram use variants of this." },
      { kind: "concept", heading: "Supporting pieces",
        body: "A fan-out service + message queue to do pushes async; a feed cache (Redis lists) per user; ranking (chronological vs ML-scored); pagination (cursor-based); and a CDN for media. Estimate read:write — feeds are extremely read-heavy, so the cache and fan-out strategy dominate the design." },
    ],
    "The news feed is a top-tier design question. The discriminating insight is the push/pull trade-off and the hybrid that solves celebrity fan-out — plus using a queue for async fan-out and a per-user feed cache.",
    ["Picking pure push and ignoring the celebrity fan-out explosion.",
     "Picking pure pull and ending up with slow reads for users following many.",
     "Doing fan-out synchronously on the post request instead of via a queue."],
    0.6, { type: "Feed fan-out", description: "Write path: Client → API → Fan-out Service → Message Queue → Worker → Feed Cache. Followers' feeds are precomputed asynchronously; reads hit the cache.", alt: "Client to API to fanout service to queue to worker to feed cache." }),
];

const EXERCISES = [
  // T1 Framework
  pm({ topicId: "sysd_m1_t1", exerciseId: "sysd_m1_t1_pm_1", position: 1, level: "easy",
    title: "First step of the framework",
    scenario: "The interviewer says 'design Twitter'. What should you do first?",
    options: ["Clarify functional + non-functional requirements and scope", "Draw the database schema", "Pick SQL vs NoSQL", "Estimate the number of servers"],
    correct: "Clarify functional + non-functional requirements and scope",
    explanation: "Always scope first. Requirements (functional + non-functional like scale/consistency) drive every later decision." }),
  pm({ topicId: "sysd_m1_t1", exerciseId: "sysd_m1_t1_pm_2", position: 2, level: "easy",
    title: "Functional vs non-functional",
    scenario: "Which of these is a NON-functional requirement?",
    options: ["The system must serve feeds with <200ms latency at 100M DAU", "A user can post a tweet", "A user can follow another user", "A user can like a tweet"],
    correct: "The system must serve feeds with <200ms latency at 100M DAU",
    explanation: "Latency/scale/availability are qualities → non-functional. The others describe behaviour → functional." }),
  pm({ topicId: "sysd_m1_t1", exerciseId: "sysd_m1_t1_pm_3", position: 3, level: "medium",
    title: "What are interviewers really grading?",
    scenario: "What most distinguishes a strong system-design candidate?",
    options: ["Reasoning about trade-offs out loud and driving a structured process", "Recalling the one correct architecture", "Naming as many technologies as possible", "Writing production code on the whiteboard"],
    correct: "Reasoning about trade-offs out loud and driving a structured process",
    explanation: "There's no single right answer — they grade structured reasoning and justified trade-offs." }),

  // T2 Estimation
  pm({ topicId: "sysd_m1_t2", exerciseId: "sysd_m1_t2_pm_1", position: 1, level: "medium",
    title: "Average QPS",
    scenario: "A service gets 100 million requests per day spread evenly. Roughly what is the average QPS? (A day ≈ 86,400 ≈ 10^5 seconds.)",
    options: ["~1,200 QPS", "~12,000 QPS", "~120 QPS", "~120,000 QPS"],
    correct: "~1,200 QPS",
    explanation: "100,000,000 / 86,400 ≈ 1,157 → ~1,200 QPS. Round powers of ten get you there fast." }),
  pm({ topicId: "sysd_m1_t2", exerciseId: "sysd_m1_t2_pm_2", position: 2, level: "medium",
    title: "Size for peak, not average",
    scenario: "You computed ~1,200 average QPS. What should you provision capacity for?",
    options: ["Peak QPS (typically 2–10× average)", "Exactly the average QPS", "Half the average to save cost", "The minimum nightly QPS"],
    correct: "Peak QPS (typically 2–10× average)",
    explanation: "Traffic is bursty; provision for peak (a multiple of average) or the system falls over at the worst moment." }),
  pm({ topicId: "sysd_m1_t2", exerciseId: "sysd_m1_t2_pm_3", position: 3, level: "medium",
    title: "What dominates?",
    scenario: "A system has a read:write ratio of about 100:1. Which design lever matters most?",
    options: ["Caching + read replicas for the read path", "Sharding writes aggressively", "A faster write-ahead log", "More message queues for writes"],
    correct: "Caching + read replicas for the read path",
    explanation: "Read-dominated systems are optimised on the read path — caching and read replicas give the biggest wins." }),

  // T3 Scaling
  pm({ topicId: "sysd_m1_t3", exerciseId: "sysd_m1_t3_pm_1", position: 1, level: "easy",
    title: "What enables horizontal scaling?",
    scenario: "To add app servers freely behind a load balancer, what property must the servers have?",
    options: ["Statelessness (no local per-user state)", "More RAM each", "A local in-memory session cache", "Sticky sessions pinned to one server"],
    correct: "Statelessness (no local per-user state)",
    explanation: "Any server must handle any request, so per-user state must live in a shared store (Redis) or a token — not on the server." }),
  pm({ topicId: "sysd_m1_t3", exerciseId: "sysd_m1_t3_pm_2", position: 2, level: "easy",
    title: "Vertical scaling's limit",
    scenario: "What is the main drawback of scaling vertically (a bigger machine)?",
    options: ["A hard ceiling + single point of failure", "It requires stateless services", "It needs a load balancer", "It always loses data"],
    correct: "A hard ceiling + single point of failure",
    explanation: "You can only make one box so big, and that one box failing takes everything down. Horizontal scaling avoids both." }),
  pm({ topicId: "sysd_m1_t3", exerciseId: "sysd_m1_t3_pm_3", position: 3, level: "medium",
    title: "The real bottleneck",
    scenario: "You've made app servers stateless and added more behind a load balancer, but the system is still slow. Where's the usual bottleneck?",
    options: ["The database tier", "The load balancer algorithm", "The number of app servers", "TLS termination"],
    correct: "The database tier",
    explanation: "App servers scale out easily; the database is typically the bottleneck and needs replicas, caching, and eventually sharding." }),

  // T4 Load Balancing
  pm({ topicId: "sysd_m1_t4", exerciseId: "sysd_m1_t4_pm_1", position: 1, level: "easy",
    title: "Route by URL path",
    scenario: "You need to send /api requests to one service and /images to another, based on the HTTP path. Which load balancer do you need?",
    options: ["Layer 7 (application)", "Layer 4 (transport)", "A DNS round-robin only", "A write-back cache"],
    correct: "Layer 7 (application)",
    explanation: "Content/path-based routing requires understanding HTTP → Layer 7. L4 only sees IP/port." }),
  pm({ topicId: "sysd_m1_t4", exerciseId: "sysd_m1_t4_pm_2", position: 2, level: "medium",
    title: "Uneven request times",
    scenario: "Requests vary wildly in duration, leaving some servers overloaded under round-robin. Which algorithm helps most?",
    options: ["Least-connections", "Round-robin", "Random", "First-come-first-served on one server"],
    correct: "Least-connections",
    explanation: "Least-connections routes to the least-busy server, balancing load better when request durations are uneven." }),
  pm({ topicId: "sysd_m1_t4", exerciseId: "sysd_m1_t4_pm_3", position: 3, level: "medium",
    title: "The LB itself",
    scenario: "A single load balancer in front of everything is a concern. Why, and what's the fix?",
    options: ["It's a single point of failure — run redundant LBs (active-passive/active-active)", "It's too fast — throttle it", "It can't do TLS — add a proxy", "It needs a bigger disk"],
    correct: "It's a single point of failure — run redundant LBs (active-passive/active-active)",
    explanation: "The LB must not be a SPOF; pair it (with a floating/virtual IP) or use a managed redundant LB." }),

  // T5 Caching
  pm({ topicId: "sysd_m1_t5", exerciseId: "sysd_m1_t5_pm_1", position: 1, level: "easy",
    title: "Name the strategy",
    scenario: "The app checks the cache; on a miss it reads the DB and then populates the cache. Which caching strategy is this?",
    options: ["Cache-aside (lazy loading)", "Write-through", "Write-back", "Write-around"],
    correct: "Cache-aside (lazy loading)",
    explanation: "Check cache → on miss read DB → populate cache. The common default for read-heavy systems." }),
  pm({ topicId: "sysd_m1_t5", exerciseId: "sysd_m1_t5_pm_2", position: 2, level: "medium",
    title: "Static assets near users",
    scenario: "Images and video are slow for users far from your origin. What's the single biggest win?",
    options: ["A CDN at the edge", "A bigger origin server", "Write-back caching in the DB", "More database replicas"],
    correct: "A CDN at the edge",
    explanation: "A CDN caches static/media content close to users, cutting latency and offloading the origin." }),
  pm({ topicId: "sysd_m1_t5", exerciseId: "sysd_m1_t5_pm_3", position: 3, level: "hard",
    title: "A hot key expires",
    scenario: "A very popular cached key expires and thousands of requests hit the database simultaneously. What is this, and a mitigation?",
    options: ["Cache stampede — use a lock / request-coalescing or staggered TTLs", "Hot shard — add range partitioning", "Replication lag — read from the leader", "Split brain — add a quorum"],
    correct: "Cache stampede — use a lock / request-coalescing or staggered TTLs",
    explanation: "A stampede (thundering herd) on expiry is mitigated by coalescing the recompute behind a lock or staggering TTLs." }),
  pm({ topicId: "sysd_m1_t5", exerciseId: "sysd_m1_t5_pm_4", position: 4, level: "medium",
    title: "The hard part",
    scenario: "Which caching problem is famously the hardest to get right?",
    options: ["Cache invalidation (avoiding stale data)", "Choosing the cache port", "Naming the cache keys uppercase", "Picking RAM size"],
    correct: "Cache invalidation (avoiding stale data)",
    explanation: "Keeping cached data from going stale after writes (invalidation) is the classic hard problem — use TTLs or explicit invalidation." }),

  // T6 SQL vs NoSQL
  pm({ topicId: "sysd_m1_t6", exerciseId: "sysd_m1_t6_pm_1", position: 1, level: "medium",
    title: "Pick the store (payments)",
    scenario: "You're storing financial transactions that need multi-row atomic updates and strong integrity. Which fits best?",
    options: ["A relational SQL database (ACID)", "A wide-column store", "A key-value cache", "A graph database"],
    correct: "A relational SQL database (ACID)",
    explanation: "Transactions + integrity + relationships → SQL with ACID guarantees." }),
  pm({ topicId: "sysd_m1_t6", exerciseId: "sysd_m1_t6_pm_2", position: 2, level: "medium",
    title: "Pick the store (huge write volume)",
    scenario: "You must ingest massive volumes of time-series/activity data with very high write throughput and simple queries. Which fits best?",
    options: ["A wide-column NoSQL store (e.g. Cassandra)", "A single relational DB with joins", "A graph database", "An in-memory cache as the system of record"],
    correct: "A wide-column NoSQL store (e.g. Cassandra)",
    explanation: "Wide-column stores are built for very high write throughput and horizontal scale with simple access patterns." }),
  pm({ topicId: "sysd_m1_t6", exerciseId: "sysd_m1_t6_pm_3", position: 3, level: "medium",
    title: "How to choose",
    scenario: "What should drive the SQL-vs-NoSQL decision?",
    options: ["The data's access pattern and consistency/transaction needs", "Whichever is newer", "NoSQL always, because it scales", "SQL always, because it's mature"],
    correct: "The data's access pattern and consistency/transaction needs",
    explanation: "Choose by access pattern and requirements; polyglot persistence (different stores per need) is normal." }),

  // T7 Replication & Sharding
  pm({ topicId: "sysd_m1_t7", exerciseId: "sysd_m1_t7_pm_1", position: 1, level: "medium",
    title: "Copy or split?",
    scenario: "Your read traffic overwhelms the database, but the data fits on one machine. What scales reads first?",
    options: ["Replication (read replicas)", "Sharding the data", "Consistent hashing", "A bigger partition key"],
    correct: "Replication (read replicas)",
    explanation: "Replication copies data so reads fan out to followers. Sharding is for write/storage scaling, not read-only relief." }),
  pm({ topicId: "sysd_m1_t7", exerciseId: "sysd_m1_t7_pm_2", position: 2, level: "hard",
    title: "Elastic re-sharding",
    scenario: "You shard a cache with hash(key) % N. Adding one node remaps almost every key. What fixes this?",
    options: ["Consistent hashing", "Range partitioning", "A bigger modulus", "Leader-follower replication"],
    correct: "Consistent hashing",
    explanation: "Consistent hashing moves only ~1/N of keys when a node is added/removed, vs modulo which reshuffles nearly all." }),
  pm({ topicId: "sysd_m1_t7", exerciseId: "sysd_m1_t7_pm_3", position: 3, level: "medium",
    title: "Hot shard",
    scenario: "After sharding by user, one celebrity's shard is overwhelmed while others idle. What's the root cause?",
    options: ["A poor partition key creating an uneven (hot) shard", "Too few replicas", "Eventual consistency", "Write-through caching"],
    correct: "A poor partition key creating an uneven (hot) shard",
    explanation: "The partition key must spread load evenly; keying by a celebrity user concentrates traffic on one shard." }),
  pm({ topicId: "sysd_m1_t7", exerciseId: "sysd_m1_t7_pm_4", position: 4, level: "medium",
    title: "Stale follower reads",
    scenario: "In leader-follower replication, a read right after a write sometimes returns old data. Why?",
    options: ["Replication lag — followers haven't caught up yet", "The leader crashed", "Consistent hashing misrouted it", "The cache was invalidated"],
    correct: "Replication lag — followers haven't caught up yet",
    explanation: "Followers apply the leader's writes asynchronously; until they catch up, follower reads can be stale (eventual consistency)." }),

  // T8 CAP
  pm({ topicId: "sysd_m1_t8", exerciseId: "sysd_m1_t8_pm_1", position: 1, level: "hard",
    title: "State CAP correctly",
    scenario: "In a distributed system, why is the real CAP choice between C and A?",
    options: ["Network partitions are unavoidable, so P is mandatory — leaving C vs A during a partition", "Because consistency is always more important", "Because availability is always more important", "Because you can freely pick any two of the three"],
    correct: "Network partitions are unavoidable, so P is mandatory — leaving C vs A during a partition",
    explanation: "P must be tolerated in any distributed system; during a partition you then choose consistency or availability." }),
  pm({ topicId: "sysd_m1_t8", exerciseId: "sysd_m1_t8_pm_2", position: 2, level: "medium",
    title: "Pick the consistency model",
    scenario: "For a bank account balance, which consistency model is appropriate?",
    options: ["Strong consistency", "Eventual consistency", "No consistency", "Whatever is fastest"],
    correct: "Strong consistency",
    explanation: "A stale balance is unacceptable, so reads must reflect the latest write — strong consistency (a CP choice)." }),
  pm({ topicId: "sysd_m1_t8", exerciseId: "sysd_m1_t8_pm_3", position: 3, level: "medium",
    title: "Where eventual is fine",
    scenario: "Which feature can comfortably use eventual consistency?",
    options: ["A social media like-count", "A bank transfer", "An inventory decrement at checkout", "A seat-booking confirmation"],
    correct: "A social media like-count",
    explanation: "A briefly-stale like count is harmless and favours availability/latency → eventual consistency (AP) is fine." }),

  // T9 Message Queues
  pm({ topicId: "sysd_m1_t9", exerciseId: "sysd_m1_t9_pm_1", position: 1, level: "easy",
    title: "Slow work off the request path",
    scenario: "Video transcoding takes minutes. What lets the upload request return immediately?",
    options: ["Enqueue a job on a message queue and process it asynchronously", "Run transcoding synchronously but faster", "Cache the video", "Add more load balancers"],
    correct: "Enqueue a job on a message queue and process it asynchronously",
    explanation: "A queue decouples the slow work: enqueue, return 202, let workers process it later." }),
  pm({ topicId: "sysd_m1_t9", exerciseId: "sysd_m1_t9_pm_2", position: 2, level: "medium",
    title: "Queue vs pub-sub",
    scenario: "One event must be delivered to ALL interested services (search index, notifications, analytics). Which model?",
    options: ["Publish-subscribe (fan-out to all subscribers)", "A work queue (one consumer per message)", "A single synchronous call", "A write-back cache"],
    correct: "Publish-subscribe (fan-out to all subscribers)",
    explanation: "Pub-sub broadcasts each message to all subscribers. A work queue would give it to only one consumer." }),
  pm({ topicId: "sysd_m1_t9", exerciseId: "sysd_m1_t9_pm_3", position: 3, level: "hard",
    title: "At-least-once delivery",
    scenario: "Your queue guarantees at-least-once delivery, so consumers may receive duplicates. What must consumers be?",
    options: ["Idempotent (processing the same message twice is safe)", "Single-threaded", "Stateful", "Synchronous"],
    correct: "Idempotent (processing the same message twice is safe)",
    explanation: "At-least-once can redeliver, so consumers must be idempotent to avoid double-processing effects." }),

  // T10 URL Shortener
  pm({ topicId: "sysd_m1_t10", exerciseId: "sysd_m1_t10_pm_1", position: 1, level: "medium",
    title: "What kind of system is it?",
    scenario: "A URL shortener has a ~100:1 read:write ratio. What dominates the design?",
    options: ["The read/redirect path — cache + CDN + KV store", "The write path — heavy sharding of writes", "Complex SQL joins", "A graph database for links"],
    correct: "The read/redirect path — cache + CDN + KV store",
    explanation: "Redirects vastly outnumber creations, so it's read-dominated: serve from cache/CDN over a key-value store." }),
  pm({ topicId: "sysd_m1_t10", exerciseId: "sysd_m1_t10_pm_2", position: 2, level: "medium",
    title: "Generate the short key",
    scenario: "Which approach generates short keys with NO collisions?",
    options: ["A distributed counter encoded in base-62", "MD5 hash truncated to 7 chars", "Random 7 chars with no check", "The first 7 chars of the long URL"],
    correct: "A distributed counter encoded in base-62",
    explanation: "An incrementing (distributed) counter in base-62 is collision-free. Hash-truncation needs collision checks/retries." }),
  pm({ topicId: "sysd_m1_t10", exerciseId: "sysd_m1_t10_pm_3", position: 3, level: "medium",
    title: "Don't block the redirect",
    scenario: "You want click analytics. How do you record them without slowing the redirect?",
    options: ["Fire the analytics event asynchronously (e.g. to a queue)", "Write to the DB synchronously before redirecting", "Skip analytics entirely", "Hold the redirect until analytics commit"],
    correct: "Fire the analytics event asynchronously (e.g. to a queue)",
    explanation: "Redirect latency is sacred — emit analytics async so the user isn't blocked on an analytics write." }),

  // T11 Rate Limiter
  pm({ topicId: "sysd_m1_t11", exerciseId: "sysd_m1_t11_pm_1", position: 1, level: "medium",
    title: "Where does the count live?",
    scenario: "You must enforce 100 req/min/user across 50 stateless app servers. Where does the counter live?",
    options: ["In shared fast storage (e.g. Redis)", "In each server's local memory", "In the load balancer's config", "In the client's cookie"],
    correct: "In shared fast storage (e.g. Redis)",
    explanation: "Per-server memory under-counts across a fleet; the limit needs shared, atomic state like Redis." }),
  pm({ topicId: "sysd_m1_t11", exerciseId: "sysd_m1_t11_pm_2", position: 2, level: "hard",
    title: "The concurrency crux",
    scenario: "Why must the check-and-decrement of the counter be atomic?",
    options: ["Otherwise concurrent requests race and exceed the limit", "Otherwise Redis runs out of memory", "Otherwise the load balancer fails", "Otherwise the TTL never expires"],
    correct: "Otherwise concurrent requests race and exceed the limit",
    explanation: "A non-atomic read-modify-write lets simultaneous requests both pass the check — use INCR/EXPIRE or a Lua script." }),
  pm({ topicId: "sysd_m1_t11", exerciseId: "sysd_m1_t11_pm_3", position: 3, level: "medium",
    title: "The limit response",
    scenario: "A request exceeds the limit. What's the conventional HTTP response?",
    options: ["429 Too Many Requests with a Retry-After header", "200 OK with an empty body", "500 Internal Server Error", "301 Moved Permanently"],
    correct: "429 Too Many Requests with a Retry-After header",
    explanation: "429 + Retry-After tells the client it's rate-limited and when to try again." }),

  // T12 News Feed
  pm({ topicId: "sysd_m1_t12", exerciseId: "sysd_m1_t12_pm_1", position: 1, level: "medium",
    title: "Fan-out on write",
    scenario: "Precomputing each follower's feed when a user posts (so reads are trivial) is which approach?",
    options: ["Fan-out on write (push)", "Fan-out on read (pull)", "Write-back caching", "Sharding"],
    correct: "Fan-out on write (push)",
    explanation: "Push writes a new post into every follower's feed at post time, making reads fast — at high write cost." }),
  pm({ topicId: "sysd_m1_t12", exerciseId: "sysd_m1_t12_pm_2", position: 2, level: "hard",
    title: "The celebrity problem",
    scenario: "Pure fan-out-on-write breaks when a user with 100M followers posts. What do real systems do?",
    options: ["Hybrid: push for normal users, pull for celebrities at read time", "Push to all 100M synchronously", "Switch the whole system to pull", "Shard the post text"],
    correct: "Hybrid: push for normal users, pull for celebrities at read time",
    explanation: "The hybrid avoids the 100M-write explosion: don't pre-push celebrity posts; merge them in at read time." }),
  pm({ topicId: "sysd_m1_t12", exerciseId: "sysd_m1_t12_pm_3", position: 3, level: "medium",
    title: "Don't fan out on the request",
    scenario: "How should the fan-out (writing into followers' feeds) be executed when a user posts?",
    options: ["Asynchronously via a message queue + workers", "Synchronously inside the post request", "On the client device", "In the load balancer"],
    correct: "Asynchronously via a message queue + workers",
    explanation: "Fan-out is heavy; do it async via a queue so the post request returns fast and bursts are buffered." }),
];

async function upsertOne(Model, filter, doc) {
  return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
}
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  await upsertOne(ProTrack, { key: TRACK.key }, TRACK);
  console.log(`  ✓ ProTrack:  ${TRACK.key} — ${TRACK.name}`);
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
  console.log(`\nDone — pro_sysd System Design track (MVP) seeded.`);
  console.log(`  Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
