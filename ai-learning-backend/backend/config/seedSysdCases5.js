/**
 * Seed — System Design module M10: Case Studies V (more large-scale designs):
 * Twitter (fanout), Distributed Counter, Slack, Online Code Judge,
 * Live Video Streaming, Webhook Delivery, CI/CD Pipeline, Fraud Detection.
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases5.js   ·   npm: npm run seed:sysd-cases5
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m10";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 10,
  name: "Case Studies V — More Systems", slug: "case-studies-5",
  description: "Eight more large-scale designs: Twitter (timeline fanout), a distributed counter, Slack, an online code judge, live video streaming, a webhook-delivery system, a CI/CD pipeline, and a real-time fraud-detection system.",
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
  T("sysd_m10_t1", 1, "Design Twitter (Timeline Fanout)", "design-twitter-fanout",
    ["case-study", "fanout", "timeline", "feed"],
    "Build the home timeline: show each user a feed of recent tweets from everyone they follow, fast, at hundreds of millions of users. Do you build the feed when a tweet is posted, or when a user opens the app?",
    "The crux is FANOUT-ON-WRITE vs FANOUT-ON-READ. Push (write): on post, append the tweet to each follower's precomputed timeline → fast reads, but a celebrity's millions of followers make writes explode. Pull (read): build the timeline by querying followees at read time → cheap writes, slow reads. Real systems use a HYBRID: push for normal users, pull/merge for celebrities.",
    [
      { kind: "concept", heading: "The two approaches",
        body: "FANOUT-ON-WRITE (push): when you tweet, the system writes that tweet id into a precomputed timeline (cache/list) for every follower. Reading a timeline is then a cheap lookup. FANOUT-ON-READ (pull): store tweets once; when a user opens the app, fetch recent tweets from everyone they follow and merge. Reads are expensive, writes are cheap. This trade is the heart of the design." },
      { kind: "concept", heading: "The celebrity problem",
        body: "Pure push breaks for celebrities: one tweet from someone with 100M followers means 100M timeline writes (a 'fanout storm'), and most are wasteful (many followers are inactive). Pure pull breaks for normal reads (querying thousands of followees per app-open). Neither extreme scales alone." },
      { kind: "concept", heading: "The hybrid solution",
        body: "Use a HYBRID: fan-out-on-write for normal accounts (push tweets into followers' timelines), but for high-follower celebrities, DON'T fan out — instead, at read time, pull the celebrity's recent tweets and MERGE them into the precomputed timeline. This bounds write amplification while keeping reads fast. Timelines live in a fast store (Redis lists) capped to recent N." },
      { kind: "concept", heading: "Supporting pieces & follow-ups",
        body: "Tweets in a sharded store; the social graph (followers) in its own service; timelines cached. Reads dominate (read-heavy) → heavy caching + CDN for media. Follow-ups: 'ranking the timeline' (ML, not just chronological — like the recommender), 'inactive followers' (skip/lazy fanout), 'consistency' (a tweet may appear slightly late). Signal: name fanout-on-write vs read, the celebrity problem, and the hybrid." },
    ],
    "Twitter's timeline is the canonical fanout problem. The signal is articulating fanout-on-write (fast reads, write storms) vs fanout-on-read (cheap writes, slow reads), the celebrity edge case, and the hybrid (push for normal, pull-merge for celebrities).",
    ["Picking only push or only pull without naming the trade-off.",
     "Ignoring the celebrity fanout storm (the key edge case).",
     "Not landing on the hybrid (push for normal users, pull-merge for celebrities)."],
    0.6, { type: "Timeline fanout", description: "Push: tweet → write into each follower's cached timeline (fast read, write storm). Pull: read → query followees + merge. Hybrid: push for normal users, pull-merge celebrities.", alt: "Fanout-on-write vs fanout-on-read with a hybrid for celebrity accounts." }),

  T("sysd_m10_t2", 2, "Design a Distributed Counter", "design-distributed-counter",
    ["case-study", "counter", "sharding", "approximate"],
    "Count YouTube views / likes — billions of increments/sec on hot items, with reads that don't need to be perfectly exact instantly. A single row UPDATE +1 is a hotspot. How do you count at scale?",
    "Avoid a single contended row: SHARD the counter into N sub-counters (each incremented independently, summed on read) to spread write load, and/or buffer increments and flush in batches. For extreme scale, approximate counts (sampling / probabilistic) and accept eventual consistency. Reads sum the shards (cached).",
    [
      { kind: "concept", heading: "Why one counter fails",
        body: "A single 'views' row hammered by UPDATE count = count + 1 from millions of concurrent requests is a write HOTSPOT: every increment contends on the same row's lock, serializing everything and melting the DB. Counting is write-heavy and concentrated on hot items — the opposite of what a single row handles well." },
      { kind: "concept", heading: "Shard the counter",
        body: "Split one logical counter into N physical SUB-COUNTERS (e.g. counter_0..counter_N). Each increment hits a random/assigned shard, spreading contention N-fold. The true value = SUM of all shards, computed on read. This trades a tiny read cost (sum N small numbers, cacheable) for hugely parallel writes — the standard 'sharded counter' technique." },
      { kind: "concept", heading: "Buffer & batch",
        body: "Further reduce DB pressure by BUFFERING increments in memory (or a fast store like Redis INCR) and periodically FLUSHING the aggregate to the durable store — or stream increments through a queue and aggregate in windows (the ad-click-aggregator pattern). The view count you see can lag slightly; that's an acceptable trade for throughput." },
      { kind: "concept", heading: "Approximation & follow-ups",
        body: "Exactness often isn't required (does '1,000,234' vs '1,000,231' views matter?) — so SAMPLING (count 1 in K and multiply) or probabilistic structures (HyperLogLog for unique counts) cut work dramatically. Reads are eventually consistent. Follow-ups: 'exact counts where needed' (sharded + reconcile), 'unique viewers' (HyperLogLog), 'time-windowed counts'. Signal: shard the counter + buffer/batch + approximate/eventually-consistent reads." },
    ],
    "A distributed counter tests beating write contention on a hot value: shard into sub-counters (sum on read), buffer/batch increments, and accept approximate / eventually-consistent reads. HyperLogLog handles unique counts.",
    ["A single row UPDATE +1 (write hotspot that serializes and melts the DB).",
     "Insisting on strong consistency/exactness when approximate + eventual is fine.",
     "Not knowing the sharded-counter (sum-of-subcounters) technique."],
    0.5, { type: "Sharded counter", description: "Increment → random sub-counter (counter_0..N), spreading contention. Read → SUM all shards (cached). Buffer/batch flushes; approximate via sampling/HLL.", alt: "A counter sharded into sub-counters to spread write contention, summed on read." }),

  T("sysd_m10_t3", 3, "Design Slack (Team Messaging)", "design-slack",
    ["case-study", "websocket", "channels", "realtime"],
    "Build Slack: workspaces with many channels, real-time messages to all online members, threads, presence, and full history/search. How does a message reach everyone in a channel instantly?",
    "Persistent WebSocket connections per client (managed by gateway servers); a posted message is persisted then FANNED OUT to all connected channel members via a pub/sub layer routing across gateways. Messages stored per-channel (sharded), an inverted index powers search, presence is ephemeral pub-sub. It's channel-based group messaging.",
    [
      { kind: "concept", heading: "Real-time delivery",
        body: "Clients hold a long-lived WebSocket to a gateway server (a fleet — a user connects to one of many). When a message is posted to a channel, it's persisted, then DELIVERED in real time to every online member of that channel. Since members are spread across different gateway servers, a pub/sub backbone routes the message to the gateways holding those members' connections, which push it down the sockets." },
      { kind: "concept", heading: "Channels & fanout",
        body: "A channel is a group; delivery is fanout to its members (smaller and bounded vs Twitter — channels are tens/hundreds, not millions, so fanout-on-write to connected members is fine). Offline members get it from history on reconnect (catch-up by last-seen message id). Threads are messages parented to a root message. DMs are 2-person channels." },
      { kind: "concept", heading: "Storage & search",
        body: "Messages are stored per channel/workspace (sharded by workspace/channel), ordered by id/timestamp, retained as history. Full-text SEARCH uses an inverted index (Elasticsearch-style) scoped to a workspace — the same indexing idea as the email design. Read-heavy (scrolling history) → cache recent messages per channel." },
      { kind: "concept", heading: "Presence & follow-ups",
        body: "Presence (online/typing) is ephemeral, high-churn state broadcast via pub-sub to a channel's members (don't persist every heartbeat). Follow-ups: 'reconnect & catch-up' (sync since last id), 'read receipts/unread counts' (per-user cursors), 'notifications' for offline users (push), 'huge channels' (bounded fanout / read-path). Signal: WebSocket gateways + pub/sub routing for channel fanout + per-channel storage + inverted-index search + ephemeral presence." },
    ],
    "Slack tests real-time group messaging: WebSocket gateway fleet + a pub/sub backbone routing channel fanout across servers, per-channel sharded storage, inverted-index search, and ephemeral presence. Reconnect catch-up via last-seen id.",
    ["Forgetting members are on different gateway servers (need pub/sub routing between them).",
     "Persisting every presence/typing heartbeat instead of ephemeral pub-sub.",
     "No reconnect catch-up (sync since last-seen message id) for offline/dropped clients."],
    0.6, { type: "Realtime messaging", description: "Client ⇄ WebSocket Gateway (fleet). Post → persist → pub/sub routes to gateways holding member connections → push down sockets. History store + inverted index for search.", alt: "Slack: WebSocket gateways with a pub/sub backbone fanning channel messages to members." }),

  T("sysd_m10_t4", 4, "Design an Online Code Judge (LeetCode)", "design-code-judge",
    ["case-study", "sandbox", "queue", "isolation"],
    "Build LeetCode's judge: users submit code that you compile, run against test cases, and grade — safely (untrusted code!) and at scale during contests. How do you run arbitrary code without it harming you, and handle spikes?",
    "Submissions go onto a QUEUE; a pool of isolated SANDBOX workers (containers/VMs with no network, CPU/memory/time limits, dropped privileges) compile and run the code against test cases, returning a verdict (AC/WA/TLE/RTE). Async (poll/push result). Sandboxing untrusted code and queue-based scaling are the crux.",
    [
      { kind: "concept", heading: "Untrusted code = sandbox",
        body: "Submitted code is HOSTILE by assumption (infinite loops, fork bombs, network calls, filesystem attacks, trying to read other submissions). Each run must be ISOLATED: a container/microVM (Docker/gVisor/Firecracker) with NO network, a read-only filesystem, dropped privileges, and hard CPU/MEMORY/WALL-TIME limits (kill on timeout → TLE). Never run untrusted code in your app process. This isolation is the single most important requirement (the project already runs Judge0 this way)." },
      { kind: "concept", heading: "Async via a queue",
        body: "Judging is slow (compile + run many test cases) and bursty (contests cause spikes). So submission is ASYNCHRONOUS: the API validates and pushes the submission onto a QUEUE, returns a submission id immediately; a pool of judge WORKERS pulls jobs, runs them in sandboxes, and writes the verdict. The client polls or gets pushed the result. The queue smooths spikes (the producer-consumer pattern) and lets you scale workers independently." },
      { kind: "concept", heading: "Running test cases & verdicts",
        body: "A worker compiles (compile error → CE), then runs the binary against each test case, feeding stdin and comparing stdout to expected (within limits) → ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, MEMORY_LIMIT_EXCEEDED. Resource usage (time/memory) is measured per run. Test cases live in storage; large ones referenced, not inlined." },
      { kind: "concept", heading: "Scale & follow-ups",
        body: "Contest spikes → autoscale the worker pool; a priority queue can favor contest submissions. Follow-ups: 'fairness under load' (per-user rate limits/quotas), 'cheating/plagiarism detection', 'multiple languages' (per-language images), 'caching identical submissions', 'result push' (WebSocket). Signal: queue + isolated sandbox workers (no network, resource/time limits) + async verdict + autoscaling for spikes." },
    ],
    "An online judge tests safely executing untrusted code: isolated sandboxes (no network, dropped privileges, CPU/mem/time limits) run submissions pulled from a queue by a worker pool, async verdicts, autoscaled for contest spikes. Sandbox isolation is the non-negotiable.",
    ["Running untrusted submissions without strict sandbox isolation/resource limits.",
     "Judging synchronously in the request path instead of a queue + worker pool.",
     "Not planning for contest spikes (autoscaling workers / queue smoothing)."],
    0.6, { type: "Judge pipeline", description: "Submit → API validates → Queue → Sandbox Worker pool (isolated: no net, CPU/mem/time limits) compiles + runs test cases → verdict (AC/WA/TLE/RTE) → client polled/pushed.", alt: "Code judge: queue feeding isolated sandbox workers that run test cases and return verdicts." }),

  T("sysd_m10_t5", 5, "Design Live Video Streaming (Twitch)", "design-live-streaming",
    ["case-study", "video", "transcoding", "cdn"],
    "Build live streaming: a broadcaster's video reaches millions of viewers with low latency and adapts to each viewer's bandwidth. How does one live feed scale to millions, at different qualities?",
    "Ingest the broadcaster's stream (RTMP/WebRTC) → TRANSCODE into multiple bitrates/resolutions → segment into small chunks → distribute via a CDN using adaptive bitrate streaming (HLS/DASH) so players pick the quality their bandwidth allows. The CDN absorbs the millions of viewers; transcoding ladder + segmenting + ABR are the core.",
    [
      { kind: "concept", heading: "Ingest",
        body: "The broadcaster uploads a single live stream to an ingest server (RTMP, or WebRTC for ultra-low latency). This is one inbound stream per broadcaster — the scaling challenge is the OUTBOUND side (millions of viewers), not ingest. The ingest point hands the stream to the processing pipeline." },
      { kind: "concept", heading: "Transcode + segment",
        body: "Viewers have wildly different devices/bandwidth, so transcode the incoming stream into a LADDER of bitrates/resolutions (e.g. 1080p, 720p, 480p, 240p) in real time. Each rendition is SEGMENTED into small chunks (2–10s) plus a manifest/playlist. This is CPU-heavy and parallelized across encoder workers. The segments + manifest are what get served." },
      { kind: "concept", heading: "Distribute via CDN + ABR",
        body: "Push segments to a CDN; viewers' players fetch the manifest then pull segments over HTTP (HLS/DASH). The CDN's edge caches absorb millions of viewers (each segment cached once per edge, served many times) — this is how one feed reaches millions. ADAPTIVE BITRATE: the player monitors bandwidth and switches up/down the ladder per segment, so playback adapts without rebuffering. Latency vs scale is a trade (HLS chunks add delay; LL-HLS/WebRTC reduce it)." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Low latency' (smaller chunks / LL-HLS / WebRTC, at higher cost). 'VOD/replay' (store segments for later playback — the YouTube design). 'Live chat' (separate realtime system — Slack-like fanout). 'DRM/geo-blocking'. 'Thundering herd at stream start' (CDN + origin shielding). Signal: single ingest → transcode ladder → segment → CDN distribution with adaptive bitrate; CDN absorbs viewer scale." },
    ],
    "Live streaming tests one-to-millions video: ingest one stream, transcode into a bitrate ladder, segment, and distribute via CDN with adaptive bitrate (HLS/DASH). The CDN edge caching absorbs viewer scale; latency vs scale is the key trade.",
    ["Trying to serve all viewers from the origin instead of CDN edge caching.",
     "A single bitrate (no transcoding ladder / adaptive bitrate for varying bandwidth).",
     "Ignoring the latency-vs-scale trade (chunk size / LL-HLS / WebRTC)."],
    0.6, { type: "Streaming pipeline", description: "Broadcaster → Ingest (RTMP/WebRTC) → Transcode into bitrate ladder → segment + manifest → CDN edges → viewers' players adapt bitrate (HLS/DASH). CDN absorbs millions.", alt: "Live streaming pipeline: ingest, transcode ladder, segment, CDN distribution with ABR." }),

  T("sysd_m10_t6", 6, "Design a Webhook Delivery System", "design-webhook-delivery",
    ["case-study", "delivery", "retries", "reliability"],
    "Reliably deliver events to thousands of customers' HTTP endpoints — which may be slow, down, or flaky — without losing events, overwhelming a recovering endpoint, or blocking your core system. How?",
    "Decouple via a durable QUEUE: producers enqueue events; delivery workers POST to subscriber endpoints with RETRIES + exponential backoff, a dead-letter queue after max attempts, and a circuit breaker / per-endpoint rate limit so a slow consumer doesn't drown. At-least-once delivery → consumers dedupe via an event id; sign payloads.",
    [
      { kind: "concept", heading: "Decouple with a queue",
        body: "Never call customer endpoints synchronously from your core flow — a slow/down endpoint would block or fail your own operations. Instead, write the event to a durable QUEUE/log; dedicated delivery workers consume and POST to subscribers. Your core system is now insulated from endpoint behaviour, and events survive crashes (durability)." },
      { kind: "concept", heading: "Retries, backoff, dead-letter",
        body: "Endpoints are unreliable, so delivery is AT-LEAST-ONCE with RETRIES: on failure (timeout, 5xx), retry with EXPONENTIAL BACKOFF + jitter (don't hammer a struggling endpoint). After a max number of attempts, move the event to a DEAD-LETTER queue for inspection/manual replay and alert/disable the endpoint. Success requires a 2xx within a timeout." },
      { kind: "concept", heading: "Protect endpoints & yourself",
        body: "A slow consumer shouldn't drown: apply a PER-ENDPOINT RATE LIMIT / concurrency cap and a CIRCUIT BREAKER (stop sending to an endpoint that's persistently failing, retry later) so one bad subscriber doesn't consume all workers or bury the endpoint. Per-subscriber queues/partitions isolate noisy neighbors." },
      { kind: "concept", heading: "Correctness & follow-ups",
        body: "At-least-once means DUPLICATES happen → include a unique EVENT ID so consumers are idempotent. SIGN payloads (HMAC) so subscribers can verify authenticity. Follow-ups: 'ordering' (per-subscriber ordered partition if needed — usually best-effort), 'replay' (from the dead-letter / event log), 'observability' (delivery status per attempt), 'fan-out to many subscribers'. Signal: durable queue + retries/backoff + dead-letter + circuit breaker/rate-limit + event-id idempotency + signing." },
    ],
    "Webhook delivery tests reliable async delivery to unreliable endpoints: a durable queue decouples your core, at-least-once with exponential backoff + dead-letter, circuit breaker/rate-limit per endpoint, and event-id idempotency + HMAC signing. Duplicates are expected.",
    ["Calling subscriber endpoints synchronously, coupling your core to their uptime.",
     "Retrying without backoff/dead-letter (hammering a down endpoint forever).",
     "No event-id idempotency (at-least-once causes duplicates) or payload signing."],
    0.6, { type: "Webhook delivery", description: "Event → durable queue → delivery worker POSTs to endpoint; failure → retry w/ exponential backoff → after max attempts → dead-letter. Circuit breaker per endpoint; event-id for dedupe; HMAC sign.", alt: "Webhook delivery via a durable queue with retries, backoff, dead-letter, and circuit breaking." }),

  T("sysd_m10_t7", 7, "Design a CI/CD Pipeline", "design-cicd-pipeline",
    ["case-study", "pipeline", "workers", "orchestration"],
    "Build a CI/CD system: on every code push, run builds/tests in isolated environments and deploy on success — for thousands of repos and concurrent jobs. How are jobs triggered, isolated, scaled, and sequenced?",
    "A webhook from the VCS triggers a PIPELINE defined as a DAG of stages (build→test→deploy); a queue feeds a pool of ISOLATED runner workers (containers/VMs) that execute each step, stream logs, and cache artifacts/dependencies. Stages run with dependencies (a DAG, like the job scheduler); deploys use safe rollout strategies.",
    [
      { kind: "concept", heading: "Trigger → pipeline DAG",
        body: "A push/PR fires a WEBHOOK from the VCS (GitHub/GitLab) — the webhook-delivery pattern in reverse. That enqueues a pipeline run. A pipeline is a DAG of STAGES/jobs (e.g. lint + build → test (parallel shards) → deploy), where later stages depend on earlier ones succeeding — the same dependency-DAG idea as the distributed job scheduler. An orchestrator schedules ready jobs and tracks status." },
      { kind: "concept", heading: "Isolated runners",
        body: "Each job runs in a fresh, ISOLATED environment (container/VM) so builds are reproducible and can't interfere with each other or the host (untrusted-ish code, like the judge). Runners pull jobs from a QUEUE; a worker POOL executes them. Ephemeral runners are spun up per job and torn down for cleanliness." },
      { kind: "concept", heading: "Scale, caching, logs",
        body: "Concurrency is bursty (many pushes at once) → AUTOSCALE the runner pool; a queue absorbs spikes. CACHING is essential for speed: cache dependencies and build artifacts (and pass artifacts between stages) so you don't rebuild the world each run. Logs are STREAMED live from runners to the UI (and stored). Artifacts go to object storage." },
      { kind: "concept", heading: "Deploy & follow-ups",
        body: "On a green pipeline, DEPLOY using safe rollout strategies (blue-green, canary, rolling — the deployment-strategies building block) with health checks and rollback on failure. Follow-ups: 'flaky tests / retries', 'secrets management' (inject securely, never log), 'fan-in/fan-out stages', 'manual approval gates', 'fairness across repos' (quotas). Signal: VCS webhook trigger + pipeline DAG + isolated runner pool from a queue + autoscale + artifact/dep caching + streamed logs + safe deploy strategies." },
    ],
    "CI/CD tests orchestration: a VCS-webhook-triggered pipeline DAG, isolated runner workers pulled from a queue, autoscaling for bursts, dependency/artifact caching, streamed logs, and safe deploy strategies (canary/blue-green) with rollback.",
    ["Running jobs without isolation (non-reproducible builds, host interference).",
     "No pipeline DAG / dependency sequencing (stages just run ad-hoc).",
     "Ignoring caching (rebuilds everything) and safe rollout/rollback on deploy."],
    0.6, { type: "CI/CD pipeline", description: "Push → VCS webhook → enqueue → pipeline DAG (build → test → deploy) on isolated runner pool; cache deps/artifacts, stream logs; green → canary/blue-green deploy w/ rollback.", alt: "CI/CD: webhook-triggered pipeline DAG on isolated autoscaled runners with safe deploys." }),

  T("sysd_m10_t8", 8, "Design a Fraud Detection System", "design-fraud-detection",
    ["case-study", "stream", "rules", "ml"],
    "Flag fraudulent transactions in real time (block before money moves) while also catching patterns that only emerge over time — at high transaction volume. How do you combine instant decisions with deep analysis?",
    "A two-speed design: a low-latency ONLINE path scores each transaction synchronously against rules + a fast ML model (using features from a feature store) to allow/deny/challenge in milliseconds; an OFFLINE/streaming path aggregates events (the ad-click pattern) to detect slow patterns, retrain models, and update rules. Features, rules engine, ML model, and a feedback loop are the pieces.",
    [
      { kind: "concept", heading: "Real-time scoring path",
        body: "A transaction must be judged BEFORE it completes (to block fraud), so the online path is synchronous and low-latency (single-digit to tens of ms). It scores the transaction with a RULES ENGINE (velocity checks, blocklists, impossible-travel, amount thresholds) and a fast ML MODEL, producing allow / deny / step-up-challenge (OTP/3DS). Latency budget is tight — heavy computation is precomputed." },
      { kind: "concept", heading: "Features in a feature store",
        body: "Scoring needs features: 'transactions in the last hour for this card', 'distance from last location', 'device reputation', 'account age'. Real-time aggregates (velocity counters) are maintained via a streaming layer and served from a low-latency FEATURE STORE so the online model can read them in ms. This is the streaming-aggregation idea (ad-click aggregator) feeding decisions." },
      { kind: "concept", heading: "Offline / batch path",
        body: "Some fraud only shows up across many events over time (rings, slow-burn patterns). An OFFLINE path consumes the event stream (Kafka), aggregates, runs heavier models/graph analysis, and detects patterns the online path can't. It also RETRAINS the online model and updates rules/blocklists. This two-speed split (fast online + thorough offline) mirrors Lambda architecture." },
      { kind: "concept", heading: "Feedback loop & follow-ups",
        body: "Confirmed fraud + chargebacks + analyst labels feed back as TRAINING DATA and rule updates — a continuous feedback loop (like the recommender). Trade-off: false positives (block good users) vs false negatives (miss fraud) — tune thresholds, use step-up challenges for the middle. Follow-ups: 'adversaries adapt' (retrain often), 'explainability' (why blocked?), 'graph-based ring detection'. Signal: synchronous online rules+ML scoring on feature-store features + offline streaming aggregation/retraining + feedback loop." },
    ],
    "Fraud detection tests a two-speed architecture: a low-latency online path (rules + fast ML over feature-store features) decides allow/deny/challenge before money moves, while an offline streaming path catches slow patterns and retrains. A feedback loop closes it; false-positive vs false-negative is the key trade.",
    ["A single batch/offline path that can't block fraud in real time before the transaction completes.",
     "Scoring without precomputed features (a feature store) within the tight latency budget.",
     "No feedback loop to retrain as adversaries adapt; ignoring the false-positive/negative trade."],
    0.6, { type: "Fraud detection", description: "Online: transaction → rules engine + fast ML (features from a low-latency store) → allow/deny/challenge in ms. Offline: event stream → aggregate + heavy models → retrain + update rules. Confirmed fraud feeds back.", alt: "Two-speed fraud detection: real-time scoring path plus offline streaming analysis and retraining." }),
];

const EXERCISES = [
  // Twitter
  pm({ topicId: "sysd_m10_t1", exerciseId: "sysd_m10_t1_pm_1", position: 1, level: "hard", title: "The core trade-off",
    scenario: "Building home timelines comes down to which trade-off?",
    options: ["Fanout-on-write (fast reads, write storms) vs fanout-on-read (cheap writes, slow reads)", "SQL vs NoSQL", "REST vs gRPC", "Cache vs no cache"], correct: "Fanout-on-write (fast reads, write storms) vs fanout-on-read (cheap writes, slow reads)",
    explanation: "Push precomputes timelines (fast reads, expensive writes); pull builds them at read time (cheap writes, slow reads)." }),
  pm({ topicId: "sysd_m10_t1", exerciseId: "sysd_m10_t1_pm_2", position: 2, level: "hard", title: "Celebrity problem",
    scenario: "Why does pure fanout-on-write break for celebrities?",
    options: ["One tweet means millions of timeline writes (a fanout storm)", "Celebrities tweet too rarely", "Their tweets are larger", "Reads become slow"], correct: "One tweet means millions of timeline writes (a fanout storm)",
    explanation: "A 100M-follower account would trigger 100M writes per tweet — a write storm, mostly to inactive followers." }),
  pm({ topicId: "sysd_m10_t1", exerciseId: "sysd_m10_t1_pm_3", position: 3, level: "medium", title: "The fix",
    scenario: "The standard solution to the celebrity problem is…",
    options: ["A hybrid: push for normal users, pull-merge celebrities at read time", "Only ever pull", "Only ever push", "Limit celebrity followers"], correct: "A hybrid: push for normal users, pull-merge celebrities at read time",
    explanation: "Fan out normal accounts on write; for celebrities, pull their recent tweets and merge into the timeline at read." }),
  // Distributed counter
  pm({ topicId: "sysd_m10_t2", exerciseId: "sysd_m10_t2_pm_1", position: 1, level: "hard", title: "Hot counter",
    scenario: "Billions of increments on one 'views' value. A single row UPDATE +1 fails because…",
    options: ["It's a write hotspot — all increments contend on one row's lock", "Rows can't hold large numbers", "Reads are too slow", "It uses too much disk"], correct: "It's a write hotspot — all increments contend on one row's lock",
    explanation: "Concentrated contention on one row serializes increments and melts the DB." }),
  pm({ topicId: "sysd_m10_t2", exerciseId: "sysd_m10_t2_pm_2", position: 2, level: "hard", title: "Spread the load",
    scenario: "The standard technique to scale a hot counter is…",
    options: ["Shard into N sub-counters; sum them on read", "A bigger lock", "One counter with a cache", "A linked list of increments"], correct: "Shard into N sub-counters; sum them on read",
    explanation: "Sub-counters spread contention N-fold; the value is their sum, computed (and cached) on read." }),
  pm({ topicId: "sysd_m10_t2", exerciseId: "sysd_m10_t2_pm_3", position: 3, level: "medium", title: "Good enough",
    scenario: "For view counts, reads can usually be…",
    options: ["Approximate and eventually consistent", "Perfectly exact and strongly consistent instantly", "Computed only nightly", "Never shown"], correct: "Approximate and eventually consistent",
    explanation: "Exactness rarely matters for view counts; approximate + eventually-consistent reads buy huge throughput." }),
  // Slack
  pm({ topicId: "sysd_m10_t3", exerciseId: "sysd_m10_t3_pm_1", position: 1, level: "hard", title: "Cross-server delivery",
    scenario: "Channel members are connected to different gateway servers. How does a message reach all of them?",
    options: ["A pub/sub backbone routes it to the gateways holding those connections", "Each gateway stores all users", "Clients poll a DB", "A single server holds all WebSockets"], correct: "A pub/sub backbone routes it to the gateways holding those connections",
    explanation: "Pub/sub routes the message to whichever gateways host the channel's online members, which push it down sockets." }),
  pm({ topicId: "sysd_m10_t3", exerciseId: "sysd_m10_t3_pm_2", position: 2, level: "medium", title: "Presence",
    scenario: "Online/typing presence should be…",
    options: ["Ephemeral, broadcast via pub-sub (not persisted per heartbeat)", "Written to the DB on every heartbeat", "Computed from message history", "Ignored"], correct: "Ephemeral, broadcast via pub-sub (not persisted per heartbeat)",
    explanation: "Presence is high-churn ephemeral state; broadcast it via pub-sub rather than persisting every heartbeat." }),
  pm({ topicId: "sysd_m10_t3", exerciseId: "sysd_m10_t3_pm_3", position: 3, level: "medium", title: "Reconnect",
    scenario: "A client drops and reconnects. How does it catch up on missed messages?",
    options: ["Sync messages since its last-seen message id", "Reload the entire workspace history", "Nothing — it misses them", "Ask other clients"], correct: "Sync messages since its last-seen message id",
    explanation: "Catch-up fetches messages after the client's last-seen id from per-channel history." }),
  // Code judge
  pm({ topicId: "sysd_m10_t4", exerciseId: "sysd_m10_t4_pm_1", position: 1, level: "hard", title: "Untrusted code",
    scenario: "Submitted code is hostile. How must it run?",
    options: ["In an isolated sandbox (no network, dropped privileges, CPU/mem/time limits)", "In the API process for speed", "On the database server", "With full host access"], correct: "In an isolated sandbox (no network, dropped privileges, CPU/mem/time limits)",
    explanation: "Untrusted code needs strict isolation and hard resource/time limits — never in your app process." }),
  pm({ topicId: "sysd_m10_t4", exerciseId: "sysd_m10_t4_pm_2", position: 2, level: "medium", title: "Handle spikes",
    scenario: "Contest spikes are handled by…",
    options: ["A queue feeding an autoscaled pool of judge workers (async)", "Judging synchronously in the request", "Rejecting submissions during contests", "A single judge server"], correct: "A queue feeding an autoscaled pool of judge workers (async)",
    explanation: "Async submission onto a queue + an autoscaled worker pool smooths bursts and scales judging independently." }),
  pm({ topicId: "sysd_m10_t4", exerciseId: "sysd_m10_t4_pm_3", position: 3, level: "medium", title: "Timeout verdict",
    scenario: "A submission with an infinite loop should be…",
    options: ["Killed at the wall-time limit → TIME_LIMIT_EXCEEDED", "Allowed to run forever", "Marked ACCEPTED", "Retried indefinitely"], correct: "Killed at the wall-time limit → TIME_LIMIT_EXCEEDED",
    explanation: "A hard wall-time limit kills runaway code and returns TLE; resource limits are part of the sandbox." }),
  // Live streaming
  pm({ topicId: "sysd_m10_t5", exerciseId: "sysd_m10_t5_pm_1", position: 1, level: "hard", title: "Reach millions",
    scenario: "How does one live feed reach millions of viewers?",
    options: ["Segment + serve via CDN edge caches (each segment cached once, served many times)", "Stream directly from the origin to each viewer", "One unicast per viewer from the broadcaster", "Email the video"], correct: "Segment + serve via CDN edge caches (each segment cached once, served many times)",
    explanation: "CDN edges cache segments and absorb the viewer fanout; the origin only feeds the edges." }),
  pm({ topicId: "sysd_m10_t5", exerciseId: "sysd_m10_t5_pm_2", position: 2, level: "medium", title: "Varying bandwidth",
    scenario: "Viewers have different bandwidth. What handles this?",
    options: ["A transcoding ladder + adaptive bitrate (HLS/DASH)", "A single 1080p stream for all", "Pausing slow viewers", "Lowering quality for everyone"], correct: "A transcoding ladder + adaptive bitrate (HLS/DASH)",
    explanation: "Transcode into multiple renditions; the player adapts up/down the ladder per segment based on bandwidth." }),
  pm({ topicId: "sysd_m10_t5", exerciseId: "sysd_m10_t5_pm_3", position: 3, level: "medium", title: "Key trade-off",
    scenario: "Smaller HLS chunks reduce latency but…",
    options: ["Increase overhead/cost; latency vs scale is a trade (LL-HLS/WebRTC reduce latency)", "Make video higher quality", "Eliminate the CDN", "Remove the need to transcode"], correct: "Increase overhead/cost; latency vs scale is a trade (LL-HLS/WebRTC reduce latency)",
    explanation: "Chunk size trades latency against overhead; ultra-low latency uses LL-HLS or WebRTC at higher cost." }),
  // Webhook
  pm({ topicId: "sysd_m10_t6", exerciseId: "sysd_m10_t6_pm_1", position: 1, level: "hard", title: "Slow endpoint",
    scenario: "Why deliver webhooks via a queue + workers rather than synchronously from your core flow?",
    options: ["A slow/down endpoint would block or fail your own operations", "Queues are cheaper", "It's required by HTTP", "Synchronous calls can't send JSON"], correct: "A slow/down endpoint would block or fail your own operations",
    explanation: "Decoupling via a durable queue insulates your core from unreliable subscriber endpoints and survives crashes." }),
  pm({ topicId: "sysd_m10_t6", exerciseId: "sysd_m10_t6_pm_2", position: 2, level: "hard", title: "Failed deliveries",
    scenario: "An endpoint keeps failing. The right handling is…",
    options: ["Retry with exponential backoff, then dead-letter after max attempts", "Retry instantly forever", "Drop the event silently", "Block the whole queue"], correct: "Retry with exponential backoff, then dead-letter after max attempts",
    explanation: "Backoff avoids hammering; a dead-letter queue captures give-ups for inspection/replay (+ circuit breaker)." }),
  pm({ topicId: "sysd_m10_t6", exerciseId: "sysd_m10_t6_pm_3", position: 3, level: "medium", title: "Duplicates",
    scenario: "At-least-once delivery means duplicates happen. Consumers handle this via…",
    options: ["A unique event id for idempotency", "Trusting it won't happen", "Ordering timestamps", "A bigger timeout"], correct: "A unique event id for idempotency",
    explanation: "A unique event id lets consumers dedupe; payloads are also HMAC-signed for authenticity." }),
  // CI/CD
  pm({ topicId: "sysd_m10_t7", exerciseId: "sysd_m10_t7_pm_1", position: 1, level: "medium", title: "Sequencing stages",
    scenario: "build → test → deploy with dependencies between stages is modelled as…",
    options: ["A DAG of stages/jobs scheduled by an orchestrator", "A single script", "A random order", "One giant job"], correct: "A DAG of stages/jobs scheduled by an orchestrator",
    explanation: "A pipeline is a dependency DAG; later stages run only after their prerequisites succeed." }),
  pm({ topicId: "sysd_m10_t7", exerciseId: "sysd_m10_t7_pm_2", position: 2, level: "hard", title: "Reproducible builds",
    scenario: "How are jobs kept reproducible and isolated from each other/the host?",
    options: ["Run each in a fresh isolated container/VM (ephemeral runner)", "Run them all on one shared host", "In the orchestrator process", "Without any isolation"], correct: "Run each in a fresh isolated container/VM (ephemeral runner)",
    explanation: "Ephemeral isolated runners give clean, reproducible builds that can't interfere with each other or the host." }),
  pm({ topicId: "sysd_m10_t7", exerciseId: "sysd_m10_t7_pm_3", position: 3, level: "medium", title: "Safe deploy",
    scenario: "On a green pipeline, deploying safely uses…",
    options: ["Canary/blue-green/rolling with health checks + rollback", "Replace all servers at once with no checks", "Deploy only on Fridays", "Skip deploys"], correct: "Canary/blue-green/rolling with health checks + rollback",
    explanation: "Gradual rollout strategies with health checks let you catch problems and roll back before full impact." }),
  // Fraud detection
  pm({ topicId: "sysd_m10_t8", exerciseId: "sysd_m10_t8_pm_1", position: 1, level: "hard", title: "Block in time",
    scenario: "To block a fraudulent transaction before money moves, scoring must be…",
    options: ["A synchronous low-latency online path (rules + fast ML)", "A nightly batch job", "Done after settlement", "Manual review only"], correct: "A synchronous low-latency online path (rules + fast ML)",
    explanation: "Real-time blocking needs an online path that scores in ms with rules + a fast model before the transaction completes." }),
  pm({ topicId: "sysd_m10_t8", exerciseId: "sysd_m10_t8_pm_2", position: 2, level: "hard", title: "Fast features",
    scenario: "Scoring needs 'transactions in the last hour for this card' in ms. This comes from…",
    options: ["A low-latency feature store fed by streaming aggregation", "A full table scan per transaction", "The nightly batch", "The client request"], correct: "A low-latency feature store fed by streaming aggregation",
    explanation: "Real-time aggregates (velocity counters) are maintained by streaming and served from a feature store within the latency budget." }),
  pm({ topicId: "sysd_m10_t8", exerciseId: "sysd_m10_t8_pm_3", position: 3, level: "medium", title: "Two speeds",
    scenario: "Why also have an offline/streaming path alongside the real-time one?",
    options: ["To catch slow/cross-event patterns and retrain models", "To make real-time slower", "Because online scoring is optional", "To store logs only"], correct: "To catch slow/cross-event patterns and retrain models",
    explanation: "Some fraud emerges across many events over time; the offline path detects it and retrains the online model (feedback loop)." }),
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
  console.log(`\nDone — M10 Case Studies V seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
