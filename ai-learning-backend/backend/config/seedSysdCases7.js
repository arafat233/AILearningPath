/**
 * Seed — System Design module M12: Case Studies VII (more large-scale designs):
 * Feature-Flag/Config Service, Video Conferencing, IoT Platform, Multiplayer
 * Game Server, Stock Brokerage, Content Moderation, Live Location Sharing,
 * Price-Comparison Aggregator. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases7.js   ·   npm: npm run seed:sysd-cases7
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m12";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 12,
  name: "Case Studies VII — More Systems", slug: "case-studies-7",
  description: "Eight more large-scale designs: a feature-flag/config service, video conferencing, an IoT platform, a multiplayer game server, a stock brokerage, a content-moderation system, live location sharing, and a price-comparison aggregator.",
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
  T("sysd_m12_t1", 1, "Design a Feature-Flag / Config Service", "design-feature-flag-service",
    ["case-study", "config", "low-latency", "targeting"],
    "Build a service that lets teams toggle features and roll them out to % of users in real time — evaluated on every request at huge scale without adding latency. Where is a flag actually evaluated, and how do changes propagate fast?",
    "Evaluate flags LOCALLY in the client SDK (in-process, sub-microsecond) against rules cached on the host — never an RPC per check. A control plane stores flag definitions + targeting rules; changes propagate to SDKs via streaming/poll so they take effect in seconds. Assignment uses deterministic hashing (like A/B). It's read-dominated config distribution.",
    [
      { kind: "concept", heading: "Evaluate locally, not over the network",
        body: "A flag check (isEnabled('new-checkout', user)) happens on basically every request — if each were a network call to a flag service, you'd add latency and a hard dependency to every request. Instead the SDK evaluates flags IN-PROCESS against a locally-cached rule set. The flag service's job is to DISTRIBUTE the rules to SDKs, not to answer per-check RPCs. This local-evaluation model is the central design decision." },
      { kind: "concept", heading: "Control plane + distribution",
        body: "A control plane (dashboard + store) holds flag definitions: on/off, rollout percentage, targeting rules (this segment, region, plan), variants. Changes must reach all SDK instances quickly: SDKs either POLL periodically or hold a STREAMING connection (SSE/websocket) that pushes updates — so a flip in the dashboard takes effect in seconds across the fleet. Serve the ruleset from CDN/edge for scale; SDKs keep a last-known-good cache to survive the service being down (fail-safe)." },
      { kind: "concept", heading: "Deterministic targeting",
        body: "Percentage rollouts and variant assignment use the same trick as A/B testing: deterministically HASH (flagKey + userId) → bucket, so a given user consistently sees the same state (no flicker) and '10% of users' is stable and unbiased. Targeting rules layer on (e.g. 'always on for internal users; 10% of everyone else'). Evaluation is pure and fast — no I/O." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Kill switch' (instant off for a broken feature — why fast propagation matters). 'Consistency' (brief window where SDKs differ — acceptable). 'Audit/who-changed-what', 'flag lifecycle/cleanup of stale flags', 'experiment integration' (overlaps A/B), 'offline default'. Signal: in-SDK local evaluation + control-plane rule distribution via poll/stream (+ CDN, last-known-good) + deterministic hash targeting. Don't do an RPC per flag check." },
    ],
    "A feature-flag service tests read-dominated config distribution: evaluate flags LOCALLY in the SDK (no per-check RPC), propagate rule changes from a control plane via poll/stream (CDN + last-known-good cache), and assign via deterministic hashing. Fast propagation enables the kill switch.",
    ["An RPC to the flag service on every flag check (latency + hard dependency on every request).",
     "No fast propagation/streaming, so a kill switch takes minutes to take effect.",
     "Non-deterministic assignment causing a user to flicker between flag states."],
    0.5, { type: "Flag distribution", description: "Control plane (defs + targeting) → distribute rules (poll/stream + CDN) → SDK caches them → evaluates LOCALLY per request (deterministic hash for % rollout). Last-known-good on outage.", alt: "Feature-flag service distributing rules to SDKs that evaluate flags locally." }),

  T("sysd_m12_t2", 2, "Design Video Conferencing (Zoom)", "design-video-conferencing",
    ["case-study", "webrtc", "sfu", "realtime-media"],
    "Build group video calls: many participants exchange live audio/video with low latency. If everyone sent their stream to everyone else directly, the math explodes. What server topology fixes that, and what carries the media?",
    "Use WebRTC for low-latency peer media, but route through a SELECTIVE FORWARDING UNIT (SFU): each participant uploads ONE stream to the SFU, which forwards it to the others — O(n) uploads instead of O(n²) mesh. A signaling server sets up connections; UDP/RTP carries media; simulcast + adaptive quality handle varying bandwidth.",
    [
      { kind: "concept", heading: "Why not a full mesh",
        body: "In a peer-to-peer MESH, each of n participants sends their stream to the other n−1 → O(n²) connections and each client uploads n−1 copies of its video. That collapses beyond ~3–4 people (uplink bandwidth + CPU). Group calls need a server in the middle to cut the per-client cost." },
      { kind: "concept", heading: "SFU (the standard) vs MCU",
        body: "A SELECTIVE FORWARDING UNIT (SFU): each client uploads its single stream to the SFU, which FORWARDS each stream to the other participants. Client uploads 1, downloads n−1 — server does the fan-out (scales well, keeps streams separate so each client can choose layouts/quality). Alternative MCU (Multipoint Control Unit) MIXES all streams into one composite server-side (client up/downloads 1 — light client, but heavy server CPU and less flexible). SFU is the common modern choice." },
      { kind: "concept", heading: "Signaling vs media",
        body: "Two planes. SIGNALING (over WebSocket) negotiates the call: who's in the room, SDP offer/answer (codecs/capabilities), and ICE candidates for NAT traversal (STUN/TURN to connect through firewalls). MEDIA flows separately over UDP/RTP (real-time; you prefer dropping a late packet over waiting — TCP's retransmits would add latency). Keep these planes distinct." },
      { kind: "concept", heading: "Quality, scale & follow-ups",
        body: "Bandwidth varies per participant → SIMULCAST (each client uploads a few quality layers; the SFU forwards the layer each receiver can handle) and adaptive bitrate, like streaming. Scale: rooms are sharded across SFUs by region (put the SFU near participants to cut latency); huge webinars switch toward a broadcast/CDN model. Follow-ups: 'recording' (an extra subscriber), 'screen share', 'active-speaker detection', 'E2E encryption', 'echo cancellation'. Signal: WebRTC + SFU forwarding (O(n) not O(n²)) + separate signaling/media planes + UDP/RTP + simulcast for adaptive quality." },
    ],
    "Video conferencing tests real-time media topology: WebRTC media routed through an SFU (each peer uploads once, server forwards — O(n) vs the O(n²) mesh), a separate signaling plane (SDP/ICE over WebSocket), UDP/RTP for media, and simulcast for adaptive quality. SFU-vs-MCU is the key trade.",
    ["A full peer-to-peer mesh (O(n²)) that collapses beyond a few participants.",
     "Conflating signaling (negotiation) with the media plane, or sending media over TCP.",
     "Ignoring varying bandwidth (no simulcast/adaptive layers)."],
    0.6, { type: "SFU topology", description: "Each participant ⇄ SFU: uploads 1 stream, downloads others. SFU forwards streams (O(n), not O(n²) mesh). Signaling (SDP/ICE over WebSocket) separate from media (UDP/RTP); simulcast for quality.", alt: "Video conferencing via an SFU forwarding each participant's single uploaded stream." }),

  T("sysd_m12_t3", 3, "Design an IoT Platform", "design-iot-platform",
    ["case-study", "ingestion", "time-series", "mqtt"],
    "Build a platform for millions of devices (sensors, trackers) sending frequent small readings, plus commands back to devices. The connection model and write volume differ from web apps. What protocol and storage fit, and how do you talk back to a device behind a firewall?",
    "Devices connect over a lightweight, long-lived protocol (MQTT) to a scalable ingestion/broker layer; the firehose of readings streams (Kafka) into a TIME-SERIES store + processing. Commands flow back over the SAME persistent connection (the device subscribes to its command topic — you can't dial in to a device behind NAT). Device registry + auth manage identity.",
    [
      { kind: "concept", heading: "Connectivity: MQTT, not HTTP-per-reading",
        body: "Devices are numerous, constrained (low power/CPU/bandwidth), often on flaky networks and behind NAT/firewalls. HTTP request-per-reading is too heavy. Use a lightweight pub/sub protocol — MQTT (or CoAP) — over a LONG-LIVED connection: small overhead, QoS levels, and last-will messages for detecting disconnects. Devices PUBLISH telemetry to topics and SUBSCRIBE to their command topic." },
      { kind: "concept", heading: "Ingestion at massive write volume",
        body: "Millions of devices × frequent readings = an enormous write-heavy stream (like the ad-click/metrics designs). A scalable broker/ingestion tier accepts the connections and pushes data into a streaming log (Kafka) that buffers and decouples ingestion from processing. Backpressure and horizontal scaling of brokers are essential. Validate/authenticate per message." },
      { kind: "concept", heading: "Storage & processing",
        body: "Readings are TIME-SERIES (deviceId+metric → (timestamp, value)) → store in a TSDB (compressed, append-optimized; downsample/retain old data — exactly the metrics-system design). Stream processing computes aggregates, detects anomalies/thresholds, and fires alerts (rules engine). Raw data may also archive to object storage / a data lake for analytics and ML." },
      { kind: "concept", heading: "Commands, device mgmt & follow-ups",
        body: "Talking BACK to a device: you can't open a connection TO a device behind NAT, so the device's persistent subscription is used — publish a command to the device's command topic and the broker delivers it down the existing connection. A DEVICE REGISTRY holds identity, credentials, state (online/offline via last-will), and firmware version; per-device AUTH (certs/tokens) is critical (compromised devices are a real threat). Follow-ups: 'OTA firmware updates', 'offline buffering on the device', 'digital twins/shadows', 'scale to billions'. Signal: MQTT long-lived pub/sub + scalable broker + streaming into a TSDB + commands via the device's subscription + a secured device registry." },
    ],
    "An IoT platform tests constrained-device design: MQTT pub/sub over long-lived connections (not HTTP-per-reading), a scalable broker streaming into a TSDB, downstream stream-processing/alerting, and — the key insight — commands delivered down the device's existing subscription (you can't dial into a NAT'd device). Device registry + per-device auth secure it.",
    ["HTTP request-per-reading instead of a lightweight long-lived MQTT connection.",
     "Trying to open a connection TO a device behind NAT instead of using its subscription for commands.",
     "Storing high-volume telemetry in a relational DB instead of a TSDB; weak per-device auth."],
    0.6, { type: "IoT pipeline", description: "Devices ⇄ MQTT broker (long-lived). Telemetry → Kafka → TSDB + stream processing/alerts. Commands → publish to device's command topic → delivered down its subscription. Device registry + per-device auth.", alt: "IoT platform: MQTT ingestion into a time-series store, with commands sent via device subscriptions." }),

  T("sysd_m12_t4", 4, "Design a Multiplayer Game Server", "design-multiplayer-game-server",
    ["case-study", "realtime", "authoritative-server", "state-sync"],
    "Build the server for a fast real-time multiplayer game: players' actions and the world state stay in sync across everyone with minimal lag, and cheating is prevented. Who decides the 'truth' of the game state, and how is lag hidden?",
    "An AUTHORITATIVE SERVER owns the true game state and runs a fixed-rate TICK/simulation loop; clients send inputs (not state), the server simulates and broadcasts authoritative snapshots. Clients hide latency with prediction + interpolation, reconciling against server state. UDP for low-latency state sync. Authoritative-server is what prevents cheating.",
    [
      { kind: "concept", heading: "Authoritative server (anti-cheat + truth)",
        body: "The SERVER is the single source of truth for game state. Clients send their INPUTS/intents ('move left', 'fire'), NOT authoritative state ('my health is 100, I hit you'). The server validates inputs, runs the simulation, and tells clients the result. This prevents cheating (a hacked client can't just claim state) and resolves conflicts deterministically. Trusting the client is the cardinal sin in multiplayer design." },
      { kind: "concept", heading: "The tick / game loop",
        body: "The server runs a fixed-rate SIMULATION TICK (e.g. 20–60 Hz): each tick it gathers queued player inputs, advances the world (physics, collisions, rules — the Game Loop pattern at scale), and produces a new authoritative state. State updates are broadcast as snapshots or deltas. A fixed tick keeps the simulation deterministic and fair across players." },
      { kind: "concept", heading: "Hiding latency",
        body: "Network lag (50–200ms) would make controls feel sluggish if clients just waited for the server. Techniques: CLIENT-SIDE PREDICTION (the client simulates its own input immediately, then RECONCILES when the authoritative state arrives — snapping/correcting if it diverged); ENTITY INTERPOLATION (render other players slightly in the past, smoothly between received snapshots); and for shooters, LAG COMPENSATION (the server rewinds to the shooter's view-time to judge a hit). These make a laggy network feel responsive." },
      { kind: "concept", heading: "Transport, scale & follow-ups",
        body: "Use UDP (or QUIC/reliable-UDP) — for fast-paced games dropping a stale positional packet beats waiting for a TCP retransmit; send small frequent state deltas. Scale: players are grouped into ROOMS/MATCHES/zones, each handled by a server instance; matchmaking assigns players; sharding is by match. Follow-ups: 'matchmaking', 'reconnection', 'spectators', 'area-of-interest management' (only send nearby entities), 'dedicated vs P2P'. Signal: authoritative server + fixed tick simulation + client prediction/interpolation/lag-compensation + UDP state sync + room-based sharding." },
    ],
    "A multiplayer game server tests real-time authoritative design: the server owns truth and runs a fixed tick (clients send inputs, not state — anti-cheat), clients hide lag via prediction/interpolation/lag-compensation, UDP carries frequent state deltas, and matches shard across instances. Never trust the client.",
    ["A client-authoritative model (trusting client-reported state) — opens the door to cheating.",
     "No lag-hiding (waiting on the server makes controls feel sluggish).",
     "Using TCP for fast-paced state sync (head-of-line blocking/retransmit lag) instead of UDP."],
    0.6, { type: "Authoritative sync", description: "Clients send INPUTS → authoritative server runs fixed-tick simulation → broadcasts state snapshots/deltas (UDP). Clients predict locally + interpolate others + reconcile to server truth. Matches sharded across servers.", alt: "Multiplayer: authoritative server tick simulation with client prediction and reconciliation." }),

  T("sysd_m12_t5", 5, "Design a Stock Brokerage Platform", "design-stock-brokerage",
    ["case-study", "trading", "order-routing", "market-data"],
    "Build Robinhood: show live prices to millions, let users place orders that route to exchanges, and track each user's portfolio accurately. This is the CLIENT side of trading (not the exchange's matching engine). What are the distinct data flows?",
    "Three flows: (1) MARKET DATA — fan out a high-rate price feed to millions of clients (read-heavy broadcast); (2) ORDER MANAGEMENT — validate (funds, risk), route orders to the exchange, track their lifecycle as a State machine, handle fills via callbacks; (3) PORTFOLIO/LEDGER — a double-entry ledger of cash + holdings updated on fills (correctness-critical). Idempotency throughout.",
    [
      { kind: "concept", heading: "Brokerage ≠ exchange",
        body: "The exchange (matching engine, covered separately) matches buyers and sellers. A BROKERAGE is the client-facing intermediary: it shows prices, accepts user orders, routes them to exchanges/market-makers, and maintains user accounts/portfolios. Three fairly independent concerns — market data (read), order management (write + external), and accounting (correctness) — with very different characteristics." },
      { kind: "concept", heading: "Market data fan-out",
        body: "Live quotes update many times per second; millions of users want them in near-real-time. This is a read-heavy BROADCAST/fan-out problem (like a live feed): ingest the exchange's market-data feed, then push updates to clients via WebSocket/streaming, fanned out through a pub/sub layer + edge servers. Conflate/throttle updates per client (you don't need every tick on a phone). Caching the latest price is cheap; the firehose is the challenge." },
      { kind: "concept", heading: "Order management (OMS)",
        body: "Placing an order: VALIDATE (sufficient buying power, risk/compliance checks, valid symbol), then ROUTE to an exchange/market-maker, and track it as a State machine (NEW → SUBMITTED → PARTIALLY_FILLED → FILLED / CANCELLED / REJECTED) updated by exchange callbacks (async, possibly out-of-order). IDEMPOTENCY is essential — a retried 'buy' must not place two orders. Reserve buying power on submit so the user can't double-spend across concurrent orders." },
      { kind: "concept", heading: "Portfolio/ledger & follow-ups",
        body: "Accounting must be exact: a double-entry LEDGER tracks cash and each holding; a FILL updates it atomically (debit cash, credit shares) — the payment-system/wallet discipline (integer money, append-only, reconciliation against the clearing house). Positions/P&L derive from the ledger + live prices. Follow-ups: 'order types' (market/limit/stop), 'after-hours', 'fractional shares', 'settlement (T+1)', 'corporate actions (splits/dividends)', 'audit/regulatory'. Signal: separate market-data fan-out (read) + OMS (validate/route/lifecycle + idempotency + buying-power reservation) + double-entry portfolio ledger (correctness/reconciliation)." },
    ],
    "A brokerage tests three distinct flows: read-heavy market-data fan-out (broadcast), an order-management system (validate → route → state-machine lifecycle with idempotency + buying-power reservation), and a correctness-critical double-entry portfolio ledger reconciled against the clearing house. It composes live-feed + payment-system patterns.",
    ["Treating it as the matching engine instead of the client-side broker (market data + OMS + ledger).",
     "No idempotency/buying-power reservation — retried or concurrent orders double-spend.",
     "Mutable balances/floats for the portfolio instead of an audited double-entry ledger."],
    0.6, { type: "Brokerage flows", description: "Market data: exchange feed → pub/sub fan-out → millions of clients (read). Orders: validate (funds/risk) → route to exchange → state machine (fills via callback, idempotent). Portfolio: double-entry ledger updated on fills, reconciled.", alt: "Stock brokerage: market-data fan-out, order management system, and a portfolio ledger." }),

  T("sysd_m12_t6", 6, "Design a Content Moderation System", "design-content-moderation",
    ["case-study", "pipeline", "ml", "human-review"],
    "Moderate user-generated content (text, images, video) at scale: block clearly-violating content fast, catch the subtle stuff, and stay accurate — across millions of uploads. Can you moderate everything synchronously, and who makes the final call on edge cases?",
    "A multi-stage PIPELINE: fast automated classifiers (ML + hash-matching against known-bad like CSAM/PhotoDNA) score content; clear cases are auto-allowed/blocked, ambiguous ones go to a HUMAN-REVIEW queue (prioritized). Sync pre-checks for the worst; async deep analysis for the rest. Reviewer decisions feed back to retrain. It's a streaming + ML + human-in-the-loop system.",
    [
      { kind: "concept", heading: "Automated first pass",
        body: "You can't human-review millions of uploads, so AUTOMATED classifiers do the first pass: ML models (text toxicity/spam, image/video classifiers — nudity, violence) produce a score/labels, plus HASH MATCHING against databases of known-bad content (e.g. PhotoDNA for CSAM, hashes of previously-removed media) for exact/near-duplicate detection. This handles the bulk cheaply." },
      { kind: "concept", heading: "Confidence thresholds route the decision",
        body: "Use thresholds on the classifier's confidence: HIGH-confidence violating → auto-block (and for illegal content, report); HIGH-confidence safe → auto-allow; the AMBIGUOUS middle band → send to a HUMAN-REVIEW queue. This focuses scarce human attention on the genuinely hard cases and keeps precision/recall tunable (the false-positive vs false-negative trade from fraud detection — over-blocking censors, under-blocking harms)." },
      { kind: "concept", heading: "Sync vs async + the review queue",
        body: "Egregious categories (CSAM, gore) often need a SYNCHRONOUS pre-publish check to block before the content is ever visible; most content is moderated ASYNCHRONOUSLY (post-publish, off a queue — the code-judge/webhook async pattern) to avoid adding latency to every upload. The human-review queue is PRIORITIZED (severity, virality, reports) so the most harmful/most-seen content is reviewed first; reviewer tooling shows context and records the decision." },
      { kind: "concept", heading: "Feedback, reports & follow-ups",
        body: "Reviewer decisions + user REPORTS become labeled training data — a FEEDBACK LOOP that retrains the models (adversaries adapt, like fraud). Track appeals (users contest a removal). Follow-ups: 'scale video' (sample frames, expensive), 'multi-language', 'reviewer wellbeing/escalation', 'explainability/transparency', 'regional legal differences'. Signal: automated classifiers + hash-matching → confidence-threshold routing → sync for the worst / async for the rest + prioritized human-review queue + feedback-loop retraining." },
    ],
    "Content moderation tests an ML + human-in-the-loop pipeline: automated classifiers + hash-matching score content, confidence thresholds auto-allow/block the clear cases and route the ambiguous middle to a prioritized human-review queue (sync for the worst, async otherwise), with decisions/reports retraining the models. False-positive vs false-negative is the core trade.",
    ["Trying to human-review everything (impossible at scale) or auto-deciding every case with no human-in-the-loop.",
     "Synchronous moderation on every upload (latency) instead of sync-only-for-the-worst + async otherwise.",
     "No feedback loop from reviewer decisions/reports to retrain as bad actors adapt."],
    0.6, { type: "Moderation pipeline", description: "Upload → automated classifiers + hash-match → confidence thresholds: high-bad auto-block, high-safe auto-allow, ambiguous → prioritized human-review queue. Worst categories sync; rest async. Decisions/reports → retrain.", alt: "Content moderation: automated classifiers routing ambiguous cases to a prioritized human-review queue." }),

  T("sysd_m12_t7", 7, "Design Live Location Sharing", "design-live-location-sharing",
    ["case-study", "geo", "realtime", "fanout"],
    "Build 'share my live location' (Find My Friends / live trip sharing): a user's position updates continuously and a set of authorized viewers see it move in near-real-time, with geofence alerts. What's the write/fan-out shape, and how do you avoid storing a firehose of points?",
    "Devices PUSH frequent location updates (write-heavy); the server fans each update out to that user's authorized viewers in real time via pub/sub over persistent connections. Store only the LATEST position (current state) cheaply — not every historical point (unless trip history is needed). Geofencing checks the point against zones; privacy/authorization gates who can see whom.",
    [
      { kind: "concept", heading: "Write-heavy updates, real-time fan-out",
        body: "Each sharing device sends a location ping every few seconds → high write volume. Each update must reach that user's authorized VIEWERS quickly. So it's a real-time fan-out: ingest the update, then push it to subscribers (viewers) via persistent connections (WebSocket) routed through a pub/sub layer (the Slack/presence pattern). Fan-out is bounded (a user shares with a handful of people), so push-on-write is fine." },
      { kind: "concept", heading: "Store latest, not the firehose",
        body: "You usually only need the CURRENT location, so store the latest position per user in a fast store (Redis) — cheap, O(1) read/overwrite — rather than persisting every ping (which would be a massive write/storage cost for data you'll never read). Only if 'trip history / breadcrumb trail' is a feature do you persist a downsampled track (write to a time-series/geo store, thin the points). This 'keep current state, drop the stream' choice is the key efficiency call." },
      { kind: "concept", heading: "Geofencing & presence",
        body: "Geofence alerts ('notify when Dad arrives home') compare each incoming point against the user's defined ZONES (point-in-polygon / radius check) and fire a notification on enter/exit transitions. Doing this efficiently for many zones uses a spatial index (geohash) and tracking previous in/out state to detect the transition (not just 'is inside'). Stale/old positions and 'last seen' are presence concerns (TTL on the latest position)." },
      { kind: "concept", heading: "Privacy & follow-ups",
        body: "AUTHORIZATION is first-class: only explicitly-permitted viewers (and only while sharing is on, possibly time-boxed) receive a user's location — leaking location is a serious harm. Battery/bandwidth: adapt ping frequency (slower when stationary). Follow-ups: 'offline/last-known', 'ETA to a destination' (routing), 'group/event sharing', 'accuracy/jitter smoothing'. Signal: write-heavy pings + bounded real-time fan-out to authorized viewers + store-latest-only (Redis) + geofence transition checks + strict privacy/authorization." },
    ],
    "Live location sharing tests write-heavy pings fanned out in real time to a bounded set of authorized viewers (pub/sub over WebSocket), storing only the latest position (not the firehose of points), with geofence transition checks and strict privacy/authorization. Trip history is an opt-in downsampled track.",
    ["Persisting every location ping (huge write/storage cost) instead of storing only the latest position.",
     "Polling for others' locations instead of real-time push to authorized viewers.",
     "Weak authorization (leaking location) or geofencing on 'is inside' rather than enter/exit transitions."],
    0.5, { type: "Location fan-out", description: "Device → frequent location pings → server stores LATEST (Redis) + fans out to authorized viewers via pub/sub (WebSocket). Each point checked against geofence zones (enter/exit → alert). Sharing gated by authorization.", alt: "Live location: pings stored as latest-only and fanned out to authorized viewers, with geofencing." }),

  T("sysd_m12_t8", 8, "Design a Price-Comparison Aggregator", "design-price-aggregator",
    ["case-study", "aggregation", "caching", "freshness"],
    "Build Kayak / Google Shopping: search across many third-party providers (airlines, hotels, stores) and show combined, ranked results fast — when each provider's API is slow, rate-limited, or sometimes down. How do you stay fast and fresh despite slow upstreams?",
    "Don't call all providers live on every search. Maintain a CACHE / pre-fetched index of provider data (refreshed on a freshness schedule), serve searches from it (fast), and fan out live calls only when needed — in PARALLEL with per-provider timeouts, returning partial results if some are slow/down. Normalize + rank merged results. Freshness vs latency is the central trade.",
    [
      { kind: "concept", heading: "The upstream problem",
        body: "Results come from many EXTERNAL providers you don't control — their APIs are slow, rate-limited, inconsistent in format, and sometimes down. Calling all of them synchronously on every user search would be slow and fragile (as slow as the slowest, failing if one fails). The whole design is about decoupling the user's fast experience from unreliable upstreams." },
      { kind: "concept", heading: "Cache / pre-fetch, don't call live every time",
        body: "Maintain a local CACHE or pre-fetched INDEX of provider offerings, populated by background crawlers/feeds and refreshed on a schedule (more frequent for volatile prices). Most searches are served from this cache → fast and resilient. The freshness of cached prices is the trade-off: too stale → users see wrong prices (bad UX, the 'price changed at checkout' problem); too fresh → hammering providers + cost. Tune TTL per data volatility (flight prices vs hotel descriptions)." },
      { kind: "concept", heading: "Live calls: parallel, timeout, partial",
        body: "When you DO need live data (e.g. final price confirmation, or a long-tail query not cached), fan out to providers in PARALLEL (not sequentially), each with a strict TIMEOUT; collect whatever returns in time and show PARTIAL results rather than blocking on a slow/dead provider (graceful degradation). Per-provider rate limiting + circuit breakers (skip a failing provider) keep you within limits and resilient — the resilience patterns." },
      { kind: "concept", heading: "Normalize, rank & follow-ups",
        body: "Each provider's data format differs → NORMALIZE into a common schema (adapter per provider) before merging. DEDUPE (the same hotel from two sources) and RANK the merged results (price, relevance, rating, sponsored). Heavily read-cached; search index for filtering. Follow-ups: 'price accuracy at booking' (re-verify live before purchase), 'affiliate tracking', 'provider onboarding' (adapters), 'personalization'. Signal: cached/pre-fetched index served fast + parallel live calls with timeouts/partial results + per-provider adapters (normalize) + dedupe/rank + freshness-vs-latency TTL tuning." },
    ],
    "A price aggregator tests insulating a fast UX from slow/unreliable third-party providers: serve from a refreshed cache/index (freshness-vs-latency TTL trade), make live calls in parallel with timeouts + partial/degraded results + circuit breakers, and normalize (per-provider adapters) + dedupe + rank. Re-verify price at booking is the classic follow-up.",
    ["Calling all providers synchronously per search (as slow as the slowest; fails if one fails).",
     "No caching/pre-fetch, or ignoring the freshness-vs-latency (stale-price) trade-off.",
     "No per-provider timeouts/circuit breakers or partial-result degradation; not normalizing differing formats."],
    0.6, { type: "Aggregator flow", description: "Search → serve from cached/pre-fetched index (fast). Refresh cache on a freshness schedule. Live needs → parallel provider calls w/ timeouts → partial results + circuit breakers. Normalize (adapters) → dedupe → rank.", alt: "Price aggregator: cache-served searches plus parallel timed live provider calls, normalized and ranked." }),
];

const EXERCISES = [
  // Feature flag service
  pm({ topicId: "sysd_m12_t1", exerciseId: "sysd_m12_t1_pm_1", position: 1, level: "hard", title: "Where to evaluate",
    scenario: "isEnabled(flag, user) runs on nearly every request. Where should it be evaluated?",
    options: ["Locally in the SDK against cached rules (no per-check RPC)", "An RPC to the flag service each time", "In the database", "At the load balancer"], correct: "Locally in the SDK against cached rules (no per-check RPC)",
    explanation: "Per-check RPCs add latency + a hard dependency; evaluate in-process against locally-cached rules." }),
  pm({ topicId: "sysd_m12_t1", exerciseId: "sysd_m12_t1_pm_2", position: 2, level: "medium", title: "Kill switch",
    scenario: "A flipped flag must take effect across the fleet in seconds. This needs…",
    options: ["Fast rule propagation (streaming/poll) to SDK caches", "A nightly config rebuild", "Restarting all servers", "Manual SDK updates"], correct: "Fast rule propagation (streaming/poll) to SDK caches",
    explanation: "Streaming/poll propagation lets a dashboard change (and the kill switch) reach SDKs in seconds." }),
  pm({ topicId: "sysd_m12_t1", exerciseId: "sysd_m12_t1_pm_3", position: 3, level: "medium", title: "Stable rollout",
    scenario: "'10% of users' should be assigned by…",
    options: ["Deterministically hashing (flagKey + userId)", "A random roll per request", "The first 10% to log in", "Round-robin"], correct: "Deterministically hashing (flagKey + userId)",
    explanation: "Deterministic hashing gives a stable, unbiased 10% with no per-user flicker (same as A/B assignment)." }),
  // Video conferencing
  pm({ topicId: "sysd_m12_t2", exerciseId: "sysd_m12_t2_pm_1", position: 1, level: "hard", title: "Topology",
    scenario: "Why route group-call media through an SFU instead of a full mesh?",
    options: ["Mesh is O(n²) and each client uploads n−1 copies; the SFU makes it O(n)", "SFU is cheaper to build", "Mesh can't do video", "SFU encrypts better"], correct: "Mesh is O(n²) and each client uploads n−1 copies; the SFU makes it O(n)",
    explanation: "With an SFU each client uploads one stream and the server forwards it — scaling far past a mesh's limits." }),
  pm({ topicId: "sysd_m12_t2", exerciseId: "sysd_m12_t2_pm_2", position: 2, level: "medium", title: "Media transport",
    scenario: "Real-time call media is carried over…",
    options: ["UDP/RTP (drop a late packet rather than wait)", "TCP (retransmit everything)", "HTTP polling", "The signaling channel"], correct: "UDP/RTP (drop a late packet rather than wait)",
    explanation: "For real-time media, TCP retransmits add latency; UDP/RTP prefers dropping stale packets. Signaling is separate." }),
  pm({ topicId: "sysd_m12_t2", exerciseId: "sysd_m12_t2_pm_3", position: 3, level: "medium", title: "Varying bandwidth",
    scenario: "Participants have different bandwidth. The SFU handles this with…",
    options: ["Simulcast (clients send layers; SFU forwards the right one per receiver)", "One fixed quality for all", "Pausing slow users", "Dropping video entirely"], correct: "Simulcast (clients send layers; SFU forwards the right one per receiver)",
    explanation: "Simulcast lets the SFU forward each receiver the quality layer their connection can handle." }),
  // IoT
  pm({ topicId: "sysd_m12_t3", exerciseId: "sysd_m12_t3_pm_1", position: 1, level: "medium", title: "Device protocol",
    scenario: "Millions of constrained devices behind NAT should connect via…",
    options: ["A lightweight long-lived pub/sub protocol (MQTT)", "HTTP request per reading", "FTP", "A new TCP connection per reading"], correct: "A lightweight long-lived pub/sub protocol (MQTT)",
    explanation: "MQTT's small overhead, persistent connection, and pub/sub fit constrained, flaky, NAT'd devices." }),
  pm({ topicId: "sysd_m12_t3", exerciseId: "sysd_m12_t3_pm_2", position: 2, level: "hard", title: "Talk back to a device",
    scenario: "How do you send a command to a device behind a firewall/NAT?",
    options: ["Publish to its command topic — delivered down its existing subscription", "Open a new connection to the device's IP", "Email the device", "Poll the device over HTTP"], correct: "Publish to its command topic — delivered down its existing subscription",
    explanation: "You can't dial into a NAT'd device; use the persistent subscription it already holds for commands." }),
  pm({ topicId: "sysd_m12_t3", exerciseId: "sysd_m12_t3_pm_3", position: 3, level: "medium", title: "Store readings",
    scenario: "High-volume sensor readings should be stored in…",
    options: ["A time-series database (downsampled/retained)", "A relational DB with a row per reading forever", "A cache only", "A search index"], correct: "A time-series database (downsampled/retained)",
    explanation: "Readings are time-series; a TSDB handles the append-heavy writes and time-range queries (downsample old data)." }),
  // Multiplayer
  pm({ topicId: "sysd_m12_t4", exerciseId: "sysd_m12_t4_pm_1", position: 1, level: "hard", title: "Source of truth",
    scenario: "To prevent cheating, the true game state is owned by…",
    options: ["An authoritative server; clients send inputs, not state", "Each client for itself", "Whichever client has lowest ping", "A shared database clients write to"], correct: "An authoritative server; clients send inputs, not state",
    explanation: "Server-authoritative simulation validates inputs and prevents clients from claiming state — the anti-cheat foundation." }),
  pm({ topicId: "sysd_m12_t4", exerciseId: "sysd_m12_t4_pm_2", position: 2, level: "hard", title: "Hide lag",
    scenario: "How does the game feel responsive despite 100ms latency?",
    options: ["Client-side prediction + interpolation, reconciled to server state", "Lowering the tick rate", "Waiting for the server every frame", "Disabling other players"], correct: "Client-side prediction + interpolation, reconciled to server state",
    explanation: "The client predicts its own input immediately and interpolates others, correcting when authoritative state arrives." }),
  pm({ topicId: "sysd_m12_t4", exerciseId: "sysd_m12_t4_pm_3", position: 3, level: "medium", title: "Transport",
    scenario: "Fast-paced state sync uses…",
    options: ["UDP (frequent small deltas; drop stale packets)", "TCP for guaranteed ordering", "HTTP long-polling", "MQTT"], correct: "UDP (frequent small deltas; drop stale packets)",
    explanation: "UDP avoids TCP's head-of-line blocking/retransmit lag; stale positional packets are better dropped." }),
  // Brokerage
  pm({ topicId: "sysd_m12_t5", exerciseId: "sysd_m12_t5_pm_1", position: 1, level: "medium", title: "Three flows",
    scenario: "A brokerage's three fairly independent concerns are…",
    options: ["Market-data fan-out, order management, and the portfolio ledger", "Matching, clearing, and settlement only", "UI, database, and cache", "Login, search, and chat"], correct: "Market-data fan-out, order management, and the portfolio ledger",
    explanation: "Read-heavy market data, order routing/lifecycle, and correctness-critical accounting are distinct concerns." }),
  pm({ topicId: "sysd_m12_t5", exerciseId: "sysd_m12_t5_pm_2", position: 2, level: "hard", title: "Order safety",
    scenario: "A retried or concurrent 'buy' must not double-spend buying power. Use…",
    options: ["Idempotency keys + reserve buying power on submit", "A bigger DB pool", "Trusting the client", "Processing orders nightly"], correct: "Idempotency keys + reserve buying power on submit",
    explanation: "Idempotency dedupes retries; reserving buying power prevents concurrent orders from over-spending." }),
  pm({ topicId: "sysd_m12_t5", exerciseId: "sysd_m12_t5_pm_3", position: 3, level: "medium", title: "Live prices",
    scenario: "Pushing live quotes to millions of users is a…",
    options: ["Read-heavy broadcast/fan-out problem (pub/sub + WebSocket)", "Write-heavy transaction problem", "Batch job", "Single-server task"], correct: "Read-heavy broadcast/fan-out problem (pub/sub + WebSocket)",
    explanation: "Market data is a high-rate read broadcast; fan out via pub/sub and stream to clients (throttle per client)." }),
  // Content moderation
  pm({ topicId: "sysd_m12_t6", exerciseId: "sysd_m12_t6_pm_1", position: 1, level: "medium", title: "First pass",
    scenario: "At millions of uploads, the first moderation pass is…",
    options: ["Automated classifiers + hash-matching against known-bad content", "Human reviewers on everything", "Random sampling only", "User reports only"], correct: "Automated classifiers + hash-matching against known-bad content",
    explanation: "ML classifiers + hash-matching (e.g. PhotoDNA) handle the bulk; humans can't review everything." }),
  pm({ topicId: "sysd_m12_t6", exerciseId: "sysd_m12_t6_pm_2", position: 2, level: "hard", title: "Edge cases",
    scenario: "Ambiguous, mid-confidence content should…",
    options: ["Go to a prioritized human-review queue", "Be auto-blocked always", "Be auto-allowed always", "Be deleted"], correct: "Go to a prioritized human-review queue",
    explanation: "Confidence thresholds auto-decide clear cases; the ambiguous middle goes to humans, prioritized by severity/virality." }),
  pm({ topicId: "sysd_m12_t6", exerciseId: "sysd_m12_t6_pm_3", position: 3, level: "medium", title: "Improve over time",
    scenario: "How do the models keep up as bad actors adapt?",
    options: ["A feedback loop: reviewer decisions + reports retrain them", "They're trained once", "By blocking more aggressively", "They can't"], correct: "A feedback loop: reviewer decisions + reports retrain them",
    explanation: "Human decisions and user reports are labeled data feeding continuous retraining (like fraud detection)." }),
  // Live location
  pm({ topicId: "sysd_m12_t7", exerciseId: "sysd_m12_t7_pm_1", position: 1, level: "hard", title: "Store what",
    scenario: "For continuous location updates where viewers only need the current spot, store…",
    options: ["Only the latest position (overwrite, e.g. in Redis)", "Every ping forever", "Nothing", "A full history by default"], correct: "Only the latest position (overwrite, e.g. in Redis)",
    explanation: "Persisting the firehose of pings is wasteful; keep the latest position cheaply (history only if it's a feature)." }),
  pm({ topicId: "sysd_m12_t7", exerciseId: "sysd_m12_t7_pm_2", position: 2, level: "medium", title: "Reach viewers",
    scenario: "Authorized viewers see the location move via…",
    options: ["Real-time fan-out (pub/sub over WebSocket)", "Polling a DB every minute", "Email updates", "A nightly report"], correct: "Real-time fan-out (pub/sub over WebSocket)",
    explanation: "Each update is pushed to the (bounded) set of authorized viewers over persistent connections via pub/sub." }),
  pm({ topicId: "sysd_m12_t7", exerciseId: "sysd_m12_t7_pm_3", position: 3, level: "medium", title: "Geofence alert",
    scenario: "'Notify when they arrive home' is implemented by…",
    options: ["Checking each point for enter/exit transitions of a zone", "Checking only if currently inside", "A daily location summary", "Asking the user"], correct: "Checking each point for enter/exit transitions of a zone",
    explanation: "Track previous in/out state so you fire on the transition (enter/exit), not on every 'is inside' check." }),
  // Price aggregator
  pm({ topicId: "sysd_m12_t8", exerciseId: "sysd_m12_t8_pm_1", position: 1, level: "hard", title: "Slow upstreams",
    scenario: "Providers' APIs are slow/flaky. To keep search fast you should…",
    options: ["Serve from a refreshed cache/pre-fetched index, not live calls every time", "Call all providers synchronously per search", "Cache nothing", "Only show one provider"], correct: "Serve from a refreshed cache/pre-fetched index, not live calls every time",
    explanation: "A cached index served fast (refreshed on a freshness schedule) insulates the UX from slow/unreliable upstreams." }),
  pm({ topicId: "sysd_m12_t8", exerciseId: "sysd_m12_t8_pm_2", position: 2, level: "hard", title: "When calling live",
    scenario: "When live provider calls are needed, do them…",
    options: ["In parallel, with per-provider timeouts + partial results + circuit breakers", "Sequentially, waiting for each", "All-or-nothing (fail if any fails)", "Without timeouts"], correct: "In parallel, with per-provider timeouts + partial results + circuit breakers",
    explanation: "Parallel calls with timeouts and graceful partial results stop a slow/dead provider from blocking the whole search." }),
  pm({ topicId: "sysd_m12_t8", exerciseId: "sysd_m12_t8_pm_3", position: 3, level: "medium", title: "Different formats",
    scenario: "Each provider returns a different data shape. Before merging/ranking you must…",
    options: ["Normalize to a common schema via per-provider adapters (and dedupe)", "Show each format separately", "Pick one provider's format and ignore others", "Store raw responses only"], correct: "Normalize to a common schema via per-provider adapters (and dedupe)",
    explanation: "A per-provider adapter normalizes formats into one schema so results can be deduped and ranked together." }),
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
  console.log(`\nDone — M12 Case Studies VII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
