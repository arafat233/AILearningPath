/**
 * Seed — System Design module M3: Case Studies — Social & Communication.
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCasesSocial.js   ·   npm: npm run seed:sysd-social
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m3";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 3,
  name: "Case Studies — Social & Communication", slug: "case-studies-social",
  description: "End-to-end designs for real-time and social products: chat, search autocomplete, notifications at scale, photo sharing, live presence, and document sharing — applying the fundamentals and building blocks.",
  estimatedHours: 5, prerequisites: ["sysd_m1", "sysd_m2"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 40, difficulty: 3, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 40, difficulty: diff, xpReward: 60, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("sysd_m3_t1", 1, "Design a Chat System (WhatsApp/Messenger)", "sysd-chat",
    ["case-study", "chat", "websocket", "presence"],
    "Messages must arrive in real time, show delivered/read ticks, work offline, and scale to billions. HTTP polling won't cut it — what will?",
    "Use persistent connections (WebSocket) via gateway servers for real-time push; a message service + durable store for history; presence via heartbeats; and queues for offline delivery. The core shift is push-over-persistent-connections, not request/response polling.",
    [
      { kind: "concept", heading: "Real-time transport",
        body: "Polling is wasteful and laggy. Use WebSocket (or long-poll fallback) for a persistent bidirectional connection. Clients connect to stateful gateway/connection servers; a connection registry maps user → which gateway holds their socket, so messages route to the right server." },
      { kind: "concept", heading: "Send path & delivery",
        body: "Sender → gateway → message service: persist the message, then push to the recipient's gateway if online, else enqueue for later. Delivery/read receipts are status updates flowing back. Messages need ordering per conversation (sequence numbers) and dedup (client message IDs)." },
      { kind: "concept", heading: "Storage",
        body: "Chat is write-heavy with huge volume → a wide-column store (Cassandra) keyed by conversation_id + timestamp scales writes and supports range reads for history. Hot/recent messages cache in Redis. Media goes to blob storage + CDN, with only a reference in the message." },
      { kind: "concept", heading: "Presence & offline",
        body: "Presence (online/last-seen) via periodic heartbeats over the socket, stored in a fast store and broadcast to contacts (often via pub-sub). Offline users get messages queued and delivered on reconnect; push notifications (APNs/FCM) alert them. Group chat fans out to each member's gateway." },
      { kind: "concept", heading: "Common interview follow-ups",
        body: "'Delivered/read receipts' (status events flow back through the same channel). 'Group chat with 1000s of members' (don't fan out per-message to all sockets — store once, pull on read for large groups, like the feed hybrid). 'End-to-end encryption' (keys on devices; the server relays ciphertext). 'Message ordering' (per-conversation sequence numbers; vector clocks for multi-device). 'Media' (upload to blob+CDN, send a reference). 'Scale the gateways' (the connection registry maps user→gateway so messages route without broadcast)." },
    ],
    "Chat is a top real-time design. The signal is WebSocket + connection registry, a durable wide-column message store, presence via heartbeats, and offline queue + push — not HTTP polling.",
    ["Using HTTP polling instead of persistent WebSocket connections.",
     "Forgetting the connection registry that maps user → gateway server.",
     "Ignoring per-conversation ordering, dedup, and offline delivery."],
    0.5, { type: "Message path", description: "Send path: Client → WebSocket Gateway → Message Service → Message Store, then push to recipient Gateway → Client. Offline recipients are queued and notified via push.", alt: "Client to websocket gateway to message service to store to recipient." }),

  T("sysd_m3_t2", 2, "Design Search Autocomplete (Typeahead)", "sysd-autocomplete",
    ["case-study", "autocomplete", "typeahead", "trie"],
    "As the user types 'sys', you must suggest the top completions in <100ms, from billions of queries. What data structure and pipeline?",
    "Serve suggestions from a precomputed prefix structure (trie with top-K stored per node) held in memory and cached, updated offline from query logs. The read path is latency-critical and read-heavy; the ranking is computed asynchronously, not per keystroke.",
    [
      { kind: "concept", heading: "The trie + top-K",
        body: "A trie (prefix tree) maps each prefix to its completions. To hit <100ms, store the top-K completions AT each trie node (precomputed) so a lookup is O(prefix length), not a subtree scan. The trie lives in memory (it's the hot read path) and is sharded by prefix for scale." },
      { kind: "concept", heading: "Ranking is offline",
        body: "Completions are ranked by popularity/recency. Don't compute this per keystroke — aggregate query frequencies from logs in a batch/stream pipeline (e.g. MapReduce/Flink) and periodically rebuild the trie's top-K. The serving layer just reads precomputed results." },
      { kind: "concept", heading: "Read path & caching",
        body: "Client debounces keystrokes (don't fire on every character); CDN/edge + an in-memory cache front the trie service. Because it's overwhelmingly read-heavy with a small hot set of prefixes, caching is extremely effective." },
      { kind: "concept", heading: "Updates & freshness",
        body: "Trending terms must appear without rebuilding the whole trie constantly. Use incremental updates or a fast-changing 'recent' layer merged with the stable trie. Accept slight staleness (eventual consistency) — autocomplete doesn't need real-time accuracy." },
      { kind: "concept", heading: "Common interview follow-ups",
        body: "'Personalized suggestions' (blend a global trie with a per-user recent-search layer). 'Typo tolerance / fuzzy match' (edit-distance, or an n-gram/Elasticsearch suggester rather than a pure trie). 'Trending now' (a fast-decaying counter feeding the recent layer). 'Huge vocabulary won't fit in memory' (shard the trie by prefix across nodes). 'Multi-language' (per-locale tries). The constant: keep the read path a precomputed top-K lookup, push all ranking work offline." },
    ],
    "Typeahead is a classic. The signal is a trie with precomputed top-K per node, offline popularity ranking from logs, aggressive caching, and client-side debouncing — separating the fast read path from slow ranking.",
    ["Computing ranking per keystroke instead of precomputing offline.",
     "Scanning a subtree at query time rather than storing top-K per node.",
     "Forgetting client-side debounce, hammering the service every character."],
    0.5, { type: "Autocomplete pipeline", description: "Serving: Client → CDN → Autocomplete Service → In-memory Trie. Offline: Query Logs → Aggregation Job → Trie rebuild. Ranking is precomputed, not per keystroke.", alt: "Client to CDN to autocomplete service to trie; offline logs aggregation rebuilds the trie." }),

  T("sysd_m3_t3", 3, "Design a Notification System at Scale", "sysd-notifications",
    ["case-study", "notifications", "fan-out", "multi-channel"],
    "Send millions of notifications across email, SMS, and push — respecting user preferences, deduping, and not double-sending when a worker retries. How?",
    "A notification service fronts pluggable channel adapters (email/SMS/push), driven by a message queue for async fan-out, with a preferences/templating layer and idempotency to prevent duplicates. It combines Strategy (channels), queues, and dedup.",
    [
      { kind: "concept", heading: "Pipeline",
        body: "Event → Notification Service → enqueue per recipient/channel → worker pool → channel adapter (Email/SMS/Push) → provider (SES/Twilio/APNs/FCM). The queue decouples producers from the slow, rate-limited external providers and absorbs bursts." },
      { kind: "concept", heading: "Channels & preferences",
        body: "Each channel is an adapter behind one interface (Strategy) so adding WhatsApp is a new adapter. A preferences service decides which channels a user opted into and rate/quiet-hours rules; templating renders content per channel/locale. Don't send what the user muted." },
      { kind: "concept", heading: "Dedup & idempotency",
        body: "At-least-once queues + worker retries can double-send. Use an idempotency key per (user, notification) so a redelivered job is suppressed. A dedup store (Redis with TTL) records sent notifications. Also collapse duplicate triggers ('3 likes' → one digest)." },
      { kind: "concept", heading: "Reliability & scale",
        body: "Per-provider rate limiting + backoff; dead-letter queue for permanent failures; priority queues (OTP > marketing); and analytics on delivery/open. Fan-out for broadcast notifications uses the same async queue model as a feed." },
      { kind: "concept", heading: "Common interview follow-ups",
        body: "'Don't double-send on worker retry' (idempotency key + dedup store — the crux). 'Respect quiet hours & opt-outs' (a preferences service gates every send). 'Broadcast to 10M users' (fan-out via a queue + worker pool, exactly like a feed push). 'OTP must beat marketing' (priority queues). 'A provider is down' (retry with backoff, then dead-letter; fail over to a second provider). 'Add a channel' (a new Channel adapter — Strategy). LLD patterns (Strategy/Factory/Observer) plus SD plumbing (queues, dedup)." },
    ],
    "Notification systems combine queues, Strategy channels, preferences, and idempotent dedup. Interviewers probe how you avoid double-sends on retry and respect user preferences at scale.",
    ["No idempotency/dedup, so retries double-send.",
     "Sending synchronously to slow providers instead of via a queue.",
     "Ignoring user preferences, quiet hours, and per-provider rate limits."],
    0.5, { type: "Notification pipeline", description: "Flow: Event → Notification Service → Message Queue → Worker → Channel Adapter → Provider. The queue enables async fan-out; idempotency keys dedupe retries.", alt: "Event to notification service to queue to worker to channel adapter to provider." }),

  T("sysd_m3_t4", 4, "Design Instagram (Photo Sharing)", "sysd-instagram",
    ["case-study", "instagram", "media", "feed"],
    "Users upload photos, follow others, and scroll an infinite feed of media. Where's the hard part — the photos, or the feed?",
    "Both: media needs blob storage + CDN + async processing (resize/thumbnails); the feed needs the push/pull fan-out trade-off from M1. Metadata (users, follows, posts) lives in a scalable store; images never live in the database.",
    [
      { kind: "concept", heading: "Upload & media pipeline",
        body: "Photo bytes go to BLOB storage (S3), NOT the database — the DB stores only a URL/metadata. Upload triggers async processing (resize into multiple resolutions, generate thumbnails, strip EXIF) via a queue + workers. Serve images through a CDN for global low latency." },
      { kind: "concept", heading: "Data model",
        body: "Users, Follows (a graph/edge table), Posts (id, user_id, media_url, caption, ts). Follows can be huge and skewed (celebrities) — store the social graph in a scalable store and design feed reads around it." },
      { kind: "concept", heading: "Feed (push/pull/hybrid)",
        body: "Reuse the news-feed trade-off: precompute (push) each user's feed into a cache for fast reads, but pull celebrity posts at read time to avoid fan-out explosion (the hybrid). Feeds are extremely read-heavy → per-user feed cache (Redis) dominates." },
      { kind: "concept", heading: "Stories & extras",
        body: "Stories are ephemeral (24h TTL) — a natural fit for a TTL cache/store. Likes/comments are high-volume counters (eventual consistency is fine). Ranking can be chronological or ML-scored. Pagination is cursor-based, not offset." },
      { kind: "concept", heading: "Common interview follow-ups",
        body: "'Celebrity with 100M followers posts' (hybrid feed: push for normal users, pull celebrities at read time). 'Process images at scale' (upload→blob, async workers resize to multiple resolutions, serve via CDN). 'Generate the feed ranking' (candidate generation + an ML scoring service). 'Counts for billions of likes' (sharded/approximate counters, eventual consistency). 'Stories expiry' (TTL store + cleanup). The two hard parts stay: media (blob+CDN+async) and the feed fan-out trade-off." },
    ],
    "Instagram tests media handling (blob + CDN + async processing) AND the feed fan-out trade-off together. The signal is 'images in blob storage not the DB' plus the hybrid push/pull feed.",
    ["Storing image bytes in the database instead of blob storage + CDN.",
     "Processing/resizing synchronously on the upload request.",
     "Pure push feed that breaks on celebrity fan-out."],
    0.6, { type: "Upload + serve", description: "Upload: Client → API → Blob Storage; then a Queue → Worker resizes images. Serve: Client → CDN → Blob Storage. The database holds only metadata and URLs.", alt: "Client uploads to API to blob storage, queue to worker for resize, served via CDN." }),

  T("sysd_m3_t5", 5, "Design Live Presence / Online Status", "sysd-presence",
    ["case-study", "presence", "heartbeat", "pub-sub"],
    "Show a green dot when a friend is online and 'last seen' otherwise, for millions of users, updating in near real-time. How without melting the system?",
    "Clients send periodic heartbeats over a persistent connection; a presence store (Redis with TTL) marks them online and auto-expires them offline. Status changes fan out to interested subscribers via pub-sub — but only to those actually viewing.",
    [
      { kind: "concept", heading: "Heartbeats + TTL",
        body: "An online client sends a heartbeat every N seconds (over its WebSocket). The presence service writes 'online' with a TTL slightly longer than N to Redis. If heartbeats stop, the key expires → the user is implicitly offline (no explicit 'I'm leaving' needed, which is unreliable). 'Last seen' = the last heartbeat time." },
      { kind: "concept", heading: "Don't broadcast to everyone",
        body: "Pushing every status change to all contacts is O(users × contacts) and wasteful. Only notify subscribers who are CURRENTLY viewing that user (e.g. have the chat/contact open) via pub-sub channels. This scopes fan-out to active interest, not the whole social graph." },
      { kind: "concept", heading: "Trade-offs",
        body: "Tune heartbeat interval: shorter = fresher presence but more load; longer = stale dots. Presence is inherently eventually-consistent and best-effort — a slightly stale green dot is acceptable, so favour availability and low cost over precision." },
      { kind: "concept", heading: "Common interview follow-ups",
        body: "'Millions of users — isn't heartbeat traffic huge?' (yes; widen the interval, batch heartbeats, and only fan out changes to active viewers). 'Last-seen timestamp' (store the last heartbeat time, show it when offline). 'Across multiple servers' (presence in a shared store like Redis with TTL; pub/sub to push changes). 'Typing indicators' (same model, very short TTL). The reusable trick stays: TTL expiry = implicit offline (don't rely on a clean 'logout')." },
    ],
    "Presence tests heartbeat + TTL-expiry design and scoping fan-out to active viewers. The signal is 'TTL auto-expires offline' and 'don't broadcast to the whole graph'.",
    ["Relying on an explicit 'going offline' signal (unreliable) instead of TTL expiry.",
     "Broadcasting every status change to all contacts (fan-out explosion).",
     "Treating presence as strongly consistent when best-effort is fine."],
    0.4, { type: "Presence flow", description: "Heartbeat: Client → Presence Service → Redis (TTL). Change: Presence Service → Pub-Sub → Subscribed Viewers. TTL expiry implies offline.", alt: "Client heartbeats to presence service to Redis with TTL; changes via pub-sub to viewers." }),

  T("sysd_m3_t6", 6, "Design Pastebin / Document Sharing", "sysd-pastebin",
    ["case-study", "pastebin", "blob", "expiry"],
    "Paste text, get a short shareable link, optionally expiring. It rhymes with the URL shortener — what's the same and what's new?",
    "Like the URL shortener it's read-heavy with a generated short key, but the PAYLOAD is large text/blobs (store in blob storage, not the DB) and it adds expiration (TTL) and access control. Metadata in a KV/SQL store; content in object storage + CDN.",
    [
      { kind: "concept", heading: "Key generation + metadata",
        body: "Generate a short unique key (base-62 counter or hashing, same as the URL shortener). Store metadata (key → blob location, owner, created/expiry, visibility) in a KV or relational store. The key goes in the URL: paste.io/x7Gk2." },
      { kind: "concept", heading: "Store content in blob storage",
        body: "Unlike a URL (tiny), a paste can be large text. Put the content in object/blob storage (S3) and keep only a pointer in metadata — DBs shouldn't hold big blobs. Serve reads via CDN/cache since it's read-heavy (one write, many reads)." },
      { kind: "concept", heading: "Expiration & cleanup",
        body: "Support TTL/expiry (e.g. 1 day, 1 week, never). Lazy-expire on read (check expiry, return 404 if past) plus a background job to purge expired blobs and metadata so storage doesn't grow unbounded. This expiry/cleanup is the main new piece vs the URL shortener." },
      { kind: "concept", heading: "Access control & abuse",
        body: "Private/unlisted pastes (only via link) vs public; optional passwords. Rate-limit creation and scan for abuse/malware. Analytics (view counts) fire async so they don't slow the read." },
      { kind: "concept", heading: "Common interview follow-ups",
        body: "'Syntax highlighting / huge pastes' (store raw in blob, render client-side; cap size). 'Expiry & cleanup at scale' (TTL on metadata + a background purge of orphaned blobs). 'Edit history / versions' (immutable blobs + a version list). 'Custom slugs' (reserve + uniqueness check). 'Hot paste goes viral' (it's read-heavy — CDN/cache the content). It rhymes with the URL shortener (short key, read-heavy) but the payload is large, so content lives in blob storage with expiry." },
    ],
    "Pastebin is a great 'extend the URL shortener' question. The signal is recognising the read-heavy + short-key parallel while moving large content to blob storage and adding TTL expiry + cleanup.",
    ["Storing large paste content in the database instead of blob storage.",
     "Forgetting expiry + a cleanup job, so storage grows forever.",
     "Missing the read-heavy nature (cache/CDN the content)."],
    0.4, { type: "Read path", description: "Read: Client → CDN → App Server → Metadata Store + Blob Storage. Metadata holds the key→blob pointer and expiry; content lives in object storage.", alt: "Client to CDN to app server to metadata store and blob storage." }),
];

const EXERCISES = [
  // T1 Chat
  pm({ topicId: "sysd_m3_t1", exerciseId: "sysd_m3_t1_pm_1", position: 1, level: "medium",
    title: "Real-time transport",
    scenario: "Messages must be pushed to clients instantly, bidirectionally. What's the right transport?",
    options: ["WebSocket (persistent connection)", "HTTP short polling", "Email", "A nightly batch job"], correct: "WebSocket (persistent connection)",
    explanation: "A persistent WebSocket pushes messages in real time, unlike wasteful, laggy polling." }),
  pm({ topicId: "sysd_m3_t1", exerciseId: "sysd_m3_t1_pm_2", position: 2, level: "hard",
    title: "Route to the right server",
    scenario: "User B is connected to one of many stateful gateway servers. How does a message for B reach the right gateway?",
    options: ["A connection registry mapping user → gateway", "Broadcast to all gateways", "DNS round-robin", "A bigger database"], correct: "A connection registry mapping user → gateway",
    explanation: "A registry tracks which gateway holds each user's socket so messages route directly, not by broadcast." }),
  pm({ topicId: "sysd_m3_t1", exerciseId: "sysd_m3_t1_pm_3", position: 3, level: "medium",
    title: "Message store",
    scenario: "Chat is write-heavy with massive volume and history reads by conversation+time. Which store fits?",
    options: ["A wide-column store (e.g. Cassandra)", "A single relational DB with joins", "An in-memory cache only", "A graph database"], correct: "A wide-column store (e.g. Cassandra)",
    explanation: "Wide-column stores handle very high write throughput and range reads keyed by conversation_id + timestamp." }),

  // T2 Autocomplete
  pm({ topicId: "sysd_m3_t2", exerciseId: "sysd_m3_t2_pm_1", position: 1, level: "medium",
    title: "Core data structure",
    scenario: "You need top completions for a typed prefix in <100ms. Which structure serves the prefix lookup?",
    options: ["A trie (prefix tree) with top-K per node", "A sorted array with binary search per query", "A relational table scan", "A graph database"], correct: "A trie (prefix tree) with top-K per node",
    explanation: "A trie maps prefixes to completions; storing top-K at each node makes lookup O(prefix length), not a subtree scan." }),
  pm({ topicId: "sysd_m3_t2", exerciseId: "sysd_m3_t2_pm_2", position: 2, level: "hard",
    title: "When to rank",
    scenario: "How should completions be ranked by popularity?",
    options: ["Precomputed offline from query logs, periodically rebuilt", "Computed per keystroke at query time", "Random each request", "Alphabetically only"], correct: "Precomputed offline from query logs, periodically rebuilt",
    explanation: "Ranking is aggregated offline from logs and baked into the trie's top-K; the read path just serves precomputed results." }),
  pm({ topicId: "sysd_m3_t2", exerciseId: "sysd_m3_t2_pm_3", position: 3, level: "easy",
    title: "Reduce request volume",
    scenario: "What client-side technique avoids firing a request on every single keystroke?",
    options: ["Debouncing", "Sharding", "Replication", "A bigger trie"], correct: "Debouncing",
    explanation: "Debouncing waits for a short pause in typing before querying, cutting request volume dramatically." }),

  // T3 Notifications
  pm({ topicId: "sysd_m3_t3", exerciseId: "sysd_m3_t3_pm_1", position: 1, level: "medium",
    title: "Decouple from slow providers",
    scenario: "External providers (SMS/email/push) are slow and rate-limited. What absorbs bursts and decouples them?",
    options: ["A message queue + worker pool", "Synchronous calls from the API", "A bigger database", "A CDN"], correct: "A message queue + worker pool",
    explanation: "Enqueue per recipient/channel and let workers call providers asynchronously, smoothing bursts and rate limits." }),
  pm({ topicId: "sysd_m3_t3", exerciseId: "sysd_m3_t3_pm_2", position: 2, level: "hard",
    title: "Avoid double-sends",
    scenario: "At-least-once queues + worker retries risk sending the same notification twice. What prevents that?",
    options: ["An idempotency key + dedup store per (user, notification)", "Disabling retries", "A faster queue", "More workers"], correct: "An idempotency key + dedup store per (user, notification)",
    explanation: "Recording a per-notification key (e.g. Redis with TTL) lets workers suppress redelivered duplicates." }),
  pm({ topicId: "sysd_m3_t3", exerciseId: "sysd_m3_t3_pm_3", position: 3, level: "medium",
    title: "Add a channel cleanly",
    scenario: "Adding WhatsApp as a new delivery channel should be a one-class change. Which pattern enables that?",
    options: ["Strategy (channel adapters behind one interface)", "Singleton", "Two-phase commit", "Bloom filter"], correct: "Strategy (channel adapters behind one interface)",
    explanation: "Each channel is an adapter implementing one send interface, so a new channel is a new adapter (Open/Closed)." }),

  // T4 Instagram
  pm({ topicId: "sysd_m3_t4", exerciseId: "sysd_m3_t4_pm_1", position: 1, level: "medium",
    title: "Where do photos go?",
    scenario: "Where should uploaded image bytes be stored?",
    options: ["Blob/object storage (S3) with a URL in the DB", "Inside the database as a BLOB column", "In Redis", "In the message queue"], correct: "Blob/object storage (S3) with a URL in the DB",
    explanation: "Large media belongs in object storage served via CDN; the database stores only metadata and the URL." }),
  pm({ topicId: "sysd_m3_t4", exerciseId: "sysd_m3_t4_pm_2", position: 2, level: "medium",
    title: "Resize off the request path",
    scenario: "Generating multiple resolutions/thumbnails on upload is slow. How should it run?",
    options: ["Asynchronously via a queue + workers", "Synchronously during the upload request", "On the client only", "In the database trigger"], correct: "Asynchronously via a queue + workers",
    explanation: "Offload image processing to async workers so the upload returns fast." }),
  pm({ topicId: "sysd_m3_t4", exerciseId: "sysd_m3_t4_pm_3", position: 3, level: "hard",
    title: "Feed at scale",
    scenario: "The feed must be fast to read but a celebrity has 100M followers. Which fan-out approach?",
    options: ["Hybrid: push for normal users, pull for celebrities", "Pure push to all followers", "Pure pull for everyone", "No feed cache at all"], correct: "Hybrid: push for normal users, pull for celebrities",
    explanation: "The hybrid avoids the celebrity write explosion while keeping reads fast for the common case." }),

  // T5 Presence
  pm({ topicId: "sysd_m3_t5", exerciseId: "sysd_m3_t5_pm_1", position: 1, level: "medium",
    title: "Detect offline reliably",
    scenario: "How do you mark a user offline without depending on an explicit 'logging off' signal?",
    options: ["Heartbeats + a TTL that expires when they stop", "An explicit logout event only", "A nightly batch", "Polling every contact"], correct: "Heartbeats + a TTL that expires when they stop",
    explanation: "A TTL slightly longer than the heartbeat interval auto-expires the 'online' key when heartbeats stop — no reliable explicit signal needed." }),
  pm({ topicId: "sysd_m3_t5", exerciseId: "sysd_m3_t5_pm_2", position: 2, level: "hard",
    title: "Scope the fan-out",
    scenario: "Broadcasting every status change to all of a user's contacts is too expensive. Who should actually be notified?",
    options: ["Only subscribers currently viewing that user (via pub-sub)", "Every contact, always", "All users on the platform", "No one — poll instead"], correct: "Only subscribers currently viewing that user (via pub-sub)",
    explanation: "Scope updates to active viewers via pub-sub channels, not the whole social graph." }),
  pm({ topicId: "sysd_m3_t5", exerciseId: "sysd_m3_t5_pm_3", position: 3, level: "easy",
    title: "Consistency of presence",
    scenario: "What consistency does a green-dot presence indicator need?",
    options: ["Best-effort / eventual — a slightly stale dot is fine", "Strong consistency", "Linearizability", "Serializable transactions"], correct: "Best-effort / eventual — a slightly stale dot is fine",
    explanation: "Presence is inherently best-effort; favour availability and low cost over precision." }),

  // T6 Pastebin
  pm({ topicId: "sysd_m3_t6", exerciseId: "sysd_m3_t6_pm_1", position: 1, level: "medium",
    title: "Where does paste content live?",
    scenario: "A paste can be large text. Where should the content be stored?",
    options: ["Blob/object storage, with a pointer in metadata", "Inline in the relational DB row", "In the URL itself", "In the load balancer"], correct: "Blob/object storage, with a pointer in metadata",
    explanation: "Large content belongs in blob storage; the metadata store keeps only key→blob pointer, owner, and expiry." }),
  pm({ topicId: "sysd_m3_t6", exerciseId: "sysd_m3_t6_pm_2", position: 2, level: "medium",
    title: "The new piece vs URL shortener",
    scenario: "What does Pastebin add that a URL shortener typically doesn't?",
    options: ["Expiration (TTL) + a cleanup job for expired content", "Short key generation", "Read-heavy caching", "A redirect"], correct: "Expiration (TTL) + a cleanup job for expired content",
    explanation: "Pastes expire; you need lazy-expiry on read plus a background purge so storage doesn't grow unbounded." }),
  pm({ topicId: "sysd_m3_t6", exerciseId: "sysd_m3_t6_pm_3", position: 3, level: "easy",
    title: "Generate the short key",
    scenario: "How do you create the short shareable key (same as the URL shortener)?",
    options: ["Base-62 encoding of a counter (or hashing with collision checks)", "The full paste text", "A random 64-char UUID in the URL", "The user's email"], correct: "Base-62 encoding of a counter (or hashing with collision checks)",
    explanation: "Base-62 of a (distributed) counter yields short, collision-free keys — reused from the URL shortener design." }),
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
  console.log(`\nDone — M3 Social case studies seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
