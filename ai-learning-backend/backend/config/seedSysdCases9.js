/**
 * Seed — System Design module M14: Case Studies IX (more large-scale designs):
 * Reddit/HN hot-ranking, Real-Time Bidding/Ad Exchange, OTP/2FA Service,
 * Push Notification Gateway, Offline-First Sync, Matchmaking Service,
 * Bulk Email/Campaign Sender, Feature Store. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases9.js   ·   npm: npm run seed:sysd-cases9
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m14";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 14,
  name: "Case Studies IX — More Systems", slug: "case-studies-9",
  description: "Eight more large-scale designs: a Reddit/HN hot-ranking feed, a real-time bidding ad exchange, an OTP/2FA service, a push-notification gateway, offline-first sync, a matchmaking service, a bulk-email sender, and an ML feature store.",
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
  T("sysd_m14_t1", 1, "Design Reddit / Hacker News (Hot Ranking)", "design-hot-ranking-feed",
    ["case-study", "ranking", "score", "feed"],
    "Build a ranked feed where posts rise and fall by votes AND age (so fresh-but-good content beats old-popular content). A simple sort-by-votes makes the front page never change. What's the ranking, and how do you serve it fast?",
    "Each post gets a HOT SCORE combining votes and AGE (time-decay) — e.g. Reddit/HN formulas where score decays as the post ages, so newer content with the same votes ranks higher. Precompute/maintain the score (update on vote, or recompute periodically) and keep a ranked structure (sorted set / cached ranked list) so the feed is a fast read. Vote counts use the distributed-counter pattern.",
    [
      { kind: "concept", heading: "Why votes-alone fails",
        body: "Sorting purely by vote count freezes the front page — old viral posts dominate forever and new content never surfaces. A good ranking must blend POPULARITY with FRESHNESS so that, over time, posts decay and make room for new ones. This time-decay is the defining idea of a 'hot' feed (vs 'top' = all-time, or 'new' = pure recency)." },
      { kind: "concept", heading: "The hot-score formula",
        body: "Combine votes and age into a single HOT SCORE. Hacker News: score ≈ (votes−1) / (age_hours + 2)^gravity — gravity (~1.8) pulls posts down as they age. Reddit's 'hot': log10(votes) + (timestamp / 45000) — log dampens huge vote counts (the 10th vote matters more than the 1000th) and the time term steadily lifts newer posts. Either way: more votes ↑, more age ↓. This score is what you sort by." },
      { kind: "concept", heading: "Serving it fast (read-heavy)",
        body: "Feeds are read FAR more than posts are voted on, so don't recompute rankings per request. Maintain the score and keep posts in a RANKED structure (a sorted set — the leaderboard design — keyed by hot score, per subreddit/listing) so reading the top-N is O(log n + k). Update a post's score on each vote (or recompute scores for recent posts on a schedule, since age changes continuously — older posts barely move, so you only need to refresh the candidate window). Cache the rendered top pages." },
      { kind: "concept", heading: "Votes & follow-ups",
        body: "Vote counts on hot posts are high-write → the DISTRIBUTED-COUNTER pattern (sharded/approximate). Prevent vote manipulation (one vote per user, fraud detection). Follow-ups: 'personalized ranking' (blend ML — the recommender), 'pagination of a changing feed' (cursor by score), 'multiple listings (hot/new/top)', 'comment ranking' (Wilson score — the comment-system design). Signal: time-decay hot score (votes ↑, age ↓, log-dampened) + maintained sorted structure for fast top-N + sharded vote counters; not sort-by-votes.",
      },
    ],
    "A hot-ranking feed tests a time-decay score blending votes and age (so fresh content surfaces — not sort-by-votes), maintained in a sorted structure (leaderboard-style) for fast top-N reads, with sharded vote counters. Reddit/HN formulas (log-dampened votes ÷ age^gravity) are the canonical answer.",
    ["Sorting purely by votes (the front page never refreshes) instead of a time-decay hot score.",
     "Recomputing the ranking per request instead of a maintained sorted set / cached ranked list.",
     "Naive hot-row vote counting instead of the sharded-counter pattern."],
    0.5, { type: "Hot ranking", description: "hot_score = f(votes ↑, age ↓) e.g. log10(votes) + time/45000 (Reddit) or (votes−1)/(age+2)^1.8 (HN). Posts kept in a sorted set by score (fast top-N); score updated on vote / refreshed for recent posts.", alt: "Hot-ranking feed: a time-decay score of votes and age maintained in a sorted structure." }),

  T("sysd_m14_t2", 2, "Design a Real-Time Bidding Ad Exchange", "design-rtb-ad-exchange",
    ["case-study", "low-latency", "auction", "real-time"],
    "Build an ad exchange: when a user loads a page, run a real-time auction among advertisers and serve the winning ad — all within ~100 milliseconds. What makes this brutally hard, and how do you hit the latency budget?",
    "On each ad request, fan out a bid request to many advertisers (DSPs) IN PARALLEL with a hard TIMEOUT (~tens of ms), collect bids that arrive in time, pick the winner (highest bid, second-price auction), and serve — dropping slow bidders. Targeting uses a pre-built FEATURE/profile lookup; everything is precomputed and in-memory. The ~100ms end-to-end budget dominates every choice.",
    [
      { kind: "concept", heading: "The 100ms auction",
        body: "When a page loads, the publisher's ad slot triggers an auction: solicit bids from advertisers and serve the winner — but the whole thing must finish in ~100ms (or the page renders without the ad / a fallback shows). This HARD LATENCY BUDGET is the defining constraint; it rules out anything slow (synchronous DB lookups, sequential calls, heavy computation on the request path)." },
      { kind: "concept", heading: "Parallel bid requests with timeouts",
        body: "The exchange fans out a BID REQUEST to many demand-side platforms (DSPs/advertisers) IN PARALLEL (never sequentially — you can't afford the sum of latencies). Each bidder has a tight TIMEOUT (e.g. 50–80ms); bids that arrive in time are collected, late bidders are simply DROPPED (partial participation is fine — the resilience/timeout pattern). You take whatever bids returned in budget." },
      { kind: "concept", heading: "Auction & winner selection",
        body: "Among the received bids, run the AUCTION: typically a SECOND-PRICE auction (the highest bidder wins but pays the second-highest price + ε — incentivizes truthful bidding) with floor prices and eligibility filters. The winning ad's creative is returned to render. The auction logic itself must be fast (in-memory comparison of a handful of bids)." },
      { kind: "concept", heading: "Targeting, scale & follow-ups",
        body: "Bidders need USER/CONTEXT info to bid well (segments, interests) — served from a low-latency profile/FEATURE store (precomputed; no slow joins on the request path). Scale is enormous (millions of auctions/sec) → stateless, horizontally-scaled bidders + heavy caching; logging/billing/analytics happen ASYNC off the hot path (the ad-click aggregator handles impression/click counting). Follow-ups: 'budget pacing', 'fraud/invalid traffic', 'frequency capping', 'header bidding'. Signal: hard ~100ms budget → parallel bid requests with timeouts (drop slow) → second-price auction over received bids → precomputed targeting features → async logging/billing.",
      },
    ],
    "An RTB ad exchange is dominated by a ~100ms budget: fan out parallel bid requests with tight timeouts (drop slow bidders), run a second-price auction over whatever returned, using precomputed targeting features (no slow lookups on the hot path), with billing/analytics done async. Latency rules every decision.",
    ["Calling bidders sequentially (sum of latencies) instead of parallel with per-bidder timeouts.",
     "Slow lookups (DB joins) on the request path instead of precomputed in-memory features.",
     "Doing logging/billing synchronously on the hot path instead of async off it."],
    0.6, { type: "RTB auction", description: "Ad request → fan out bid requests to DSPs in PARALLEL (tight timeout, drop slow) → collect bids → second-price auction (+ floor/eligibility) → return winning creative. Targeting from precomputed feature store; billing/analytics async. All in ~100ms.", alt: "RTB exchange: parallel timed bid requests feeding a fast second-price auction within ~100ms." }),

  T("sysd_m14_t3", 3, "Design an OTP / 2FA Service", "design-otp-service",
    ["case-study", "security", "rate-limiting", "expiry"],
    "Build a one-time-password service: generate a code, deliver it (SMS/email/authenticator), and verify it — securely. What stops brute-force and replay, and how is the code stored?",
    "Generate a short random/HOTP/TOTP code, store it HASHED with a short EXPIRY (TTL) tied to the user+purpose, and deliver async via SMS/email (queued). Verification checks the hash, enforces EXPIRY, allows limited ATTEMPTS (rate-limit + lockout against brute force), and INVALIDATES the code on use (single-use, no replay). TOTP (authenticator apps) avoids delivery entirely.",
    [
      { kind: "concept", heading: "Generate & store safely",
        body: "Generate a code: a random N-digit number (delivered OTP) or a TOTP/HOTP value (RFC 6238/4226 — derived from a shared secret + time/counter, for authenticator apps). Store it HASHED (like a password — never plaintext) keyed by (user, purpose) with a short TTL (e.g. 5 min). For TOTP, you store only the per-user shared SECRET once (encrypted) and recompute the expected code at verify time — nothing per-code to store." },
      { kind: "concept", heading: "Deliver asynchronously",
        body: "For delivered OTPs, send via SMS/email/push through a provider — ASYNCHRONOUSLY (queue it; the SMS gateway can be slow) so the request returns fast. Handle delivery failures/retries and provider fallback. (TOTP needs no delivery — the user's app computes the same code — which is more secure since there's no interceptable channel.)" },
      { kind: "concept", heading: "Verify: expiry, attempts, single-use",
        body: "Verification is where security lives: (1) EXPIRY — reject codes past their TTL; (2) ATTEMPT LIMITING — only a few wrong tries before lockout/cooldown (a short 6-digit code is brute-forceable without this — the critical control); (3) SINGLE-USE — invalidate the code immediately after a successful verify (and on too many failures) so it can't be REPLAYED; (4) constant-time compare (avoid timing leaks). For TOTP, accept a small time window (±1 step) for clock skew." },
      { kind: "concept", heading: "Abuse & follow-ups",
        body: "RATE-LIMIT generation too (per user/phone/IP) — otherwise it's an SMS-bombing / cost-amplification vector. Log attempts for fraud detection. Follow-ups: 'backup codes', 'don't reveal whether the code or the account was wrong (enumeration)', 'WebAuthn/passkeys as a stronger factor', 'TOTP secret enrollment (QR)'. Signal: random/TOTP code + hashed + short TTL + async delivery + verify with expiry + attempt-limiting (anti-brute-force) + single-use (anti-replay) + generation rate-limiting.",
      },
    ],
    "An OTP service tests security controls: a random or TOTP code, stored hashed with a short TTL, delivered async; verification enforces expiry, attempt-limiting (anti-brute-force — critical for short codes), and single-use (anti-replay), plus generation rate-limiting (anti SMS-bombing). TOTP avoids the interceptable delivery channel.",
    ["No attempt-limiting/rate-limiting — a 6-digit code is trivially brute-forceable.",
     "Reusable codes (replay) or storing codes in plaintext instead of hashed + single-use.",
     "Synchronous SMS delivery on the request path; no expiry/TTL on codes."],
    0.5, { type: "OTP flow", description: "Generate code (random / TOTP) → store hashed + TTL → deliver async (SMS/email) or user's app computes it. Verify: check hash + expiry + attempt-limit (lockout) → success → invalidate (single-use). Generation rate-limited.", alt: "OTP service: hashed short-lived codes, async delivery, and verification with attempt-limiting and single-use." }),

  T("sysd_m14_t4", 4, "Design a Push Notification Gateway", "design-push-gateway",
    ["case-study", "fanout", "device-tokens", "third-party"],
    "Build a service that sends push notifications to millions of mobile devices via Apple (APNs) and Google (FCM). You don't control those providers and devices come and go. How do you fan out reliably and keep device tokens valid?",
    "Maintain a DEVICE TOKEN registry (user → device tokens + platform). To send, look up tokens, then fan out through a QUEUE to platform-specific workers that call APNs/FCM in batches, with retries/backoff and provider rate-limiting. Crucially, process provider FEEDBACK to prune INVALID/expired tokens. It's async fan-out to third-party providers + token hygiene.",
    [
      { kind: "concept", heading: "Device token registry",
        body: "Each device registers a PUSH TOKEN (APNs token / FCM registration id) tied to a user + platform; the gateway stores these (a user may have many devices). Tokens are the addresses you push to. They CHANGE/expire (app reinstall, OS updates), so the registry must be kept current — stale tokens are the #1 source of waste and errors." },
      { kind: "concept", heading: "Async fan-out via a queue",
        body: "A 'notify user X' (or a campaign to millions) request looks up the target tokens and ENQUEUES send jobs; platform-specific WORKERS (APNs sender, FCM sender) pull and call the provider APIs, ideally in BATCHES (providers accept multi-token sends). This async, queue-driven fan-out (Producer-Consumer) decouples your API from slow/rate-limited providers and lets you scale workers + smooth bursts (a big campaign)." },
      { kind: "concept", heading: "Reliability to third parties",
        body: "You depend on external providers (APNs/FCM) that can be slow, rate-limited, or briefly down — so RETRY with backoff on transient failures, respect each provider's RATE LIMITS, and use circuit breakers (the resilience patterns). Delivery is best-effort/at-least-once — push isn't guaranteed (device off/no network); providers queue and may collapse multiple. Don't promise exactly-once delivery." },
      { kind: "concept", heading: "Token hygiene & follow-ups",
        body: "Providers return FEEDBACK — 'this token is invalid/unregistered' — which you MUST process to PRUNE dead tokens, or you'll waste sends and get throttled. Follow-ups: 'priority (transactional vs marketing)', 'user preferences / quiet hours / opt-out', 'deduplication & collapse keys', 'delivery receipts/analytics' (async), 'web push'. Signal: device-token registry + async queue fan-out to platform workers (batched) + retries/backoff + invalid-token pruning from provider feedback; best-effort delivery.",
      },
    ],
    "A push gateway tests fan-out to uncontrolled third-party providers: a device-token registry, async queue → platform-specific batched senders (APNs/FCM) with retries/backoff and rate-limit respect, and — the key hygiene point — pruning invalid tokens from provider feedback. Delivery is best-effort, not guaranteed.",
    ["Calling APNs/FCM synchronously per device instead of async batched fan-out via a queue.",
     "Never pruning invalid/expired tokens (wasted sends, provider throttling).",
     "Assuming guaranteed/exactly-once delivery instead of best-effort with retries."],
    0.5, { type: "Push fan-out", description: "notify → look up device tokens (registry) → enqueue → platform workers (APNs/FCM) send in batches w/ retries+rate-limits → provider feedback prunes invalid tokens. Async, best-effort delivery.", alt: "Push notification gateway: token registry, async batched fan-out to APNs/FCM, and token pruning." }),

  T("sysd_m14_t5", 5, "Design Offline-First Sync", "design-offline-first-sync",
    ["case-study", "sync", "conflict-resolution", "mobile"],
    "Build sync for a mobile app that works fully OFFLINE (notes, tasks) and reconciles when back online — across a user's devices. Two devices edit the same item offline; both come online. What makes sync correct, and how are conflicts resolved?",
    "The device is the source of truth while offline: queue local CHANGES (an oplog), and on reconnect, SYNC deltas both ways using a cursor/version (sync token) so only changes since last sync transfer. Concurrent edits CONFLICT — resolve with last-write-wins (timestamps/versions), CRDTs (auto-merge), or app-specific merge. Idempotent, resumable, eventually consistent.",
    [
      { kind: "concept", heading: "Offline-first means local-first",
        body: "The app must work with NO network: reads/writes hit a LOCAL store (SQLite, etc.) immediately, and local changes are QUEUED as an operation log / dirty set. The UI never blocks on the server. Sync happens in the background when connectivity returns. This inverts the usual model — the server is a sync peer, not the primary the app talks to per action." },
      { kind: "concept", heading: "Delta sync with a cursor",
        body: "On reconnect, don't resend everything — sync DELTAS. The client sends its queued local changes and a SYNC TOKEN/version (a cursor marking 'what I last saw'); the server returns changes since that token. Both apply each other's deltas and advance the cursor. This must be IDEMPOTENT (a change may be sent twice on flaky networks → dedupe by change id) and RESUMABLE (interrupted sync continues). Tombstones represent deletes (so a delete propagates, not just 'missing')." },
      { kind: "concept", heading: "Conflict resolution (the crux)",
        body: "Two devices editing the same item offline both produce changes — a CONFLICT on reconnect. Strategies: LAST-WRITE-WINS (compare timestamps/version vectors — simple but can silently lose an edit; needs trustworthy clocks → logical clocks); CRDTs (Conflict-free Replicated Data Types — data structures that merge deterministically and commutatively with no central coordination — great for text/sets, the Google-Docs idea); or APP-SPECIFIC merge / surface the conflict to the user. Choosing the right strategy per data type is the key decision." },
      { kind: "concept", heading: "Consistency & follow-ups",
        body: "The model is EVENTUALLY CONSISTENT — devices converge after syncing, not instantly. Use version vectors/logical clocks (not wall-clock alone — devices have skewed clocks) to order/detect concurrency. Follow-ups: 'large datasets (partial/selective sync)', 'schema migrations across versions', 'security (per-user data)', 'sync efficiency (batching, compression)', 'real-time sync via push when online'. Signal: local-first store + queued oplog + delta sync with a cursor (idempotent/resumable, tombstones for deletes) + conflict resolution (LWW / CRDT / app-merge) + eventual consistency with logical clocks.",
      },
    ],
    "Offline-first sync tests local-first writes with a queued oplog, idempotent/resumable delta sync via a cursor (tombstones for deletes), and conflict resolution (last-write-wins / CRDTs / app-merge) under eventual consistency with logical clocks. Picking the right conflict strategy per data type is the crux.",
    ["Resending all data each sync instead of deltas via a cursor/version (and not idempotent on retries).",
     "Ignoring concurrent-edit conflicts, or trusting wall-clocks for last-write-wins (clock skew).",
     "Not handling deletes (need tombstones) — a deleted item reappears from the other device."],
    0.6, { type: "Sync flow", description: "Offline: writes → local store + queued oplog. Reconnect: send local changes + sync token → server returns deltas since token → both apply (idempotent, tombstones for deletes) → conflicts resolved (LWW / CRDT / merge). Eventually consistent.", alt: "Offline-first sync: local oplog, cursor-based delta sync, and conflict resolution." }),

  T("sysd_m14_t6", 6, "Design a Matchmaking Service", "design-matchmaking",
    ["case-study", "queue", "skill-based", "latency"],
    "Build matchmaking for an online game: group waiting players into fair, low-latency matches based on SKILL and region. Strict skill matching means long waits; loose matching means unfair games. How do you balance this, and structure the search?",
    "Players enter a QUEUE with attributes (skill rating, region, mode). A matcher groups compatible players — but it WIDENS the acceptance criteria over time: start with a tight skill/latency band and RELAX it the longer someone waits (trading match quality for wait time). Bucket by region/mode to bound the search; on a full match, hand off to a game server (the multiplayer-server design).",
    [
      { kind: "concept", heading: "The fundamental tension",
        body: "Matchmaking trades MATCH QUALITY against WAIT TIME. Tight criteria (near-identical skill, low ping) make fair, smooth matches but players wait a long time for enough compatible others; loose criteria fill matches fast but produce blowouts/laggy games. The whole design is managing this trade-off dynamically — there's no single right band." },
      { kind: "concept", heading: "Queue + widening criteria",
        body: "Players join a QUEUE carrying a SKILL rating (Elo/MMR/Glicko), region/latency, party, and mode. The matcher repeatedly tries to form valid groups. The key technique: the acceptance band WIDENS with wait time — a player who just queued only matches a narrow skill/ping range; the longer they wait, the more the allowed skill gap and ping tolerance EXPAND, so they eventually match rather than wait forever. This dynamic relaxation is the heart of good matchmaking." },
      { kind: "concept", heading: "Bounding the search",
        body: "Searching all waiting players globally is wasteful and produces high-latency matches. BUCKET/partition the pool by REGION (so matches are low-ping — players are matched near their datacenter), game MODE, and often skill brackets, so the matcher only compares within a relevant pool. Within a bucket, find compatible groups (e.g. of N players, balanced into teams). This keeps matching fast and matches geographically sensible." },
      { kind: "concept", heading: "Match formation & follow-ups",
        body: "When a valid group forms, RESERVE those players (remove from queue), allocate a game server in the right region (hand off to the multiplayer-server design), and notify clients to connect; handle a player declining/timing out (re-queue the rest). Follow-ups: 'party/group matchmaking (keep friends together, balance teams)', 'skill-rating updates after a match (Elo)', 'backfill (replace a leaver)', 'anti-smurf', 'estimated wait time'. Signal: skill+region+mode queue + region/mode bucketing + acceptance band that WIDENS with wait time (quality-vs-wait) + reserve→allocate-server→connect.",
      },
    ],
    "A matchmaking service tests balancing match quality vs wait time: a skill/region/mode queue, bucketing to bound the search, and an acceptance band that WIDENS the longer a player waits (so they eventually match fairly), then reserve players and allocate a regional game server. Region bucketing keeps latency low.",
    ["A fixed strictness band — either endless waits (too tight) or unfair matches (too loose); not widening over time.",
     "Searching the entire global pool instead of bucketing by region/mode (high-latency matches, slow search).",
     "Not reserving matched players (double-matching) or ignoring region for server allocation."],
    0.5, { type: "Matchmaking", description: "Players queue with skill+region+mode → bucketed by region/mode. Matcher forms balanced groups within a skill/ping band that WIDENS as wait time grows. Full match → reserve players → allocate regional game server → connect.", alt: "Matchmaking: bucketed skill queue with an acceptance band that widens over wait time." }),

  T("sysd_m14_t7", 7, "Design a Bulk Email / Campaign Sender", "design-bulk-email-sender",
    ["case-study", "throughput", "throttling", "deliverability"],
    "Build a system to send a marketing campaign to millions of recipients reliably, without getting your domain blacklisted. Blasting all of it at once will hurt deliverability and overwhelm things. How do you send at scale responsibly?",
    "Expand the campaign into per-recipient send jobs onto a QUEUE; a pool of workers sends through SMTP/providers at a THROTTLED rate (warm-up, per-provider limits) to protect deliverability/reputation. Personalize via templates, track bounces/complaints to SUPPRESS bad addresses, honor unsubscribes, and record opens/clicks async. It's high-throughput async sending governed by deliverability, not just speed.",
    [
      { kind: "concept", heading: "Fan out into a queue",
        body: "A campaign targets a huge recipient list. Expand it into per-recipient SEND JOBS (with the personalized content) onto a QUEUE; a pool of sender WORKERS pulls and delivers them. This async, queue-driven model (Producer-Consumer) decouples 'launch campaign' from the slow act of sending millions of emails, survives crashes (jobs persist), and lets you scale/pause workers. The list expansion itself may be batched to avoid a huge upfront write." },
      { kind: "concept", heading: "Throttling for deliverability",
        body: "The counter-intuitive core: you must NOT send as fast as possible. Blasting millions of emails suddenly trips spam filters and gets your sending IP/domain BLACKLISTED, tanking deliverability. So THROTTLE: respect per-provider rate limits (Gmail/Yahoo/Outlook each have limits), 'WARM UP' new sending IPs gradually (ramp volume over days to build reputation), and spread load across sending IPs. Deliverability/reputation — not raw throughput — governs the send rate." },
      { kind: "concept", heading: "Bounces, complaints, suppression",
        body: "Process FEEDBACK: hard BOUNCES (invalid address) and spam COMPLAINTS must add the address to a SUPPRESSION LIST and never be emailed again — continuing to hit dead addresses or complainers destroys your reputation. Honor UNSUBSCRIBES immediately (and legally — CAN-SPAM/GDPR). Authenticate mail (SPF/DKIM/DMARC) so providers trust you. This hygiene is as important as the sending itself." },
      { kind: "concept", heading: "Personalization, tracking & follow-ups",
        body: "Personalize each email via a TEMPLATE engine (merge recipient fields). Track opens (pixel) and clicks (wrapped links) ASYNC into analytics (the ad-click-aggregator style) — never on the send path. Retry transient (soft-bounce / 4xx) failures with backoff. Follow-ups: 'scheduling/time-zone send', 'A/B subject testing', 'rate-limit per recipient (don't over-email)', 'dedicated vs shared IPs'. Signal: queue fan-out + throttled async sending governed by deliverability (warm-up, per-provider limits, SPF/DKIM) + bounce/complaint suppression + unsubscribe honoring + async open/click tracking.",
      },
    ],
    "A bulk email sender tests deliverability-governed async sending: queue fan-out to throttled worker senders (warm-up, per-provider limits, SPF/DKIM — don't blast and get blacklisted), bounce/complaint suppression and unsubscribe honoring, with templated personalization and async open/click tracking. Reputation, not raw speed, sets the rate.",
    ["Blasting all email at once instead of throttled, warmed-up sending (blacklisting / poor deliverability).",
     "Not suppressing hard bounces/complaints or honoring unsubscribes (reputation + legal damage).",
     "Sending synchronously / tracking opens-clicks on the send path instead of async via a queue."],
    0.5, { type: "Campaign send", description: "Campaign → expand to per-recipient jobs → queue → sender workers deliver via SMTP, THROTTLED (warm-up, per-provider limits, SPF/DKIM). Bounces/complaints → suppression list; unsubscribes honored. Opens/clicks tracked async.", alt: "Bulk email: queue fan-out to throttled senders with suppression-list hygiene and async tracking." }),

  T("sysd_m14_t8", 8, "Design a Feature Store (ML)", "design-feature-store",
    ["case-study", "ml-infra", "offline-online", "consistency"],
    "Build a feature store for ML: serve the same features for model TRAINING (offline, on huge history) and real-time INFERENCE (online, low-latency), without them drifting apart. Why is one store not enough, and what's the dangerous bug?",
    "Two synchronized stores fed by shared feature pipelines: an OFFLINE store (warehouse/lake) holding full history for training, and an ONLINE store (low-latency KV like Redis) holding the latest feature values for inference. The danger is TRAINING/SERVING SKEW — features computed differently in the two paths; prevent it with shared definitions and POINT-IN-TIME-correct training joins.",
    [
      { kind: "concept", heading: "Why two stores",
        body: "ML features (e.g. 'user's avg order value last 30d', 'items viewed today') are needed in TWO very different settings: TRAINING reads HUGE history across all entities in batch (offline, throughput-oriented — a warehouse/lake), while INFERENCE needs the LATEST feature values for one entity in milliseconds (online, latency-oriented — a KV store like Redis). One store can't be both. So a feature store maintains an OFFLINE store (for training) and an ONLINE store (for serving), kept in sync." },
      { kind: "concept", heading: "Feature pipelines feed both",
        body: "Features are computed by PIPELINES from raw data: batch jobs (the warehouse/streaming aggregation — the ad-click pattern for real-time features) compute feature values and WRITE them to the offline store, and MATERIALIZE the latest values into the online store. A feature REGISTRY/definitions layer declares each feature once (name, entity, transformation, freshness) — the single source of truth both paths use." },
      { kind: "concept", heading: "Training/serving skew (the bug)",
        body: "The dangerous, classic ML-infra bug: TRAIN/SERVE SKEW — the feature value a model trains on differs from what it sees at inference (because the two paths compute it with different code/logic, or use stale data). The model then performs worse in production than in testing. The feature store's whole reason to exist is to KILL this: SHARED feature definitions/transformations used by both offline and online paths, and consistency between the stores." },
      { kind: "concept", heading: "Point-in-time correctness & follow-ups",
        body: "Training data must use feature values AS THEY WERE at the time of each historical event — a POINT-IN-TIME correct join (no leaking future data into the past, which would inflate offline accuracy and fail in prod — 'data leakage'). The store handles these time-travel joins. Follow-ups: 'feature freshness/TTL', 'online store scaling (it's read-heavy like a cache)', 'monitoring feature drift', 'reuse/sharing features across teams'. Signal: offline (training) + online (serving) stores fed by shared-definition pipelines + point-in-time-correct training joins + preventing train/serve skew.",
      },
    ],
    "A feature store tests ML serving infrastructure: an offline store (history, training) + an online store (latest values, low-latency inference) fed by shared-definition pipelines, with point-in-time-correct training joins. Its core purpose is preventing train/serve skew — features computed identically for both paths.",
    ["One store for both — can't serve both batch-training-over-history and low-latency inference.",
     "Computing features differently in training vs serving (train/serve skew degrades prod accuracy).",
     "Non-point-in-time training joins that leak future data (data leakage → inflated offline metrics)."],
    0.6, { type: "Feature store", description: "Feature pipelines (shared definitions) → OFFLINE store (full history → training, point-in-time joins) + ONLINE store (latest values → low-latency inference). Same definitions both paths → no train/serve skew.", alt: "Feature store: offline + online stores fed by shared pipelines, preventing train/serve skew." }),
];

const EXERCISES = [
  // Hot ranking
  pm({ topicId: "sysd_m14_t1", exerciseId: "sysd_m14_t1_pm_1", position: 1, level: "medium", title: "Why not votes alone",
    scenario: "Sorting a feed purely by vote count causes…",
    options: ["A frozen front page — old viral posts dominate, new content never surfaces", "Too much churn", "Unfair downvotes", "Slow reads"], correct: "A frozen front page — old viral posts dominate, new content never surfaces",
    explanation: "Without time-decay, accumulated votes lock the top; a hot score blends votes with age." }),
  pm({ topicId: "sysd_m14_t1", exerciseId: "sysd_m14_t1_pm_2", position: 2, level: "hard", title: "Hot score",
    scenario: "A hot-ranking score combines…",
    options: ["Votes (↑) and age (↓), often log-dampening votes", "Only the number of comments", "Alphabetical title order", "Random noise"], correct: "Votes (↑) and age (↓), often log-dampening votes",
    explanation: "Reddit/HN scores rise with votes and fall with age; log dampens huge vote counts." }),
  pm({ topicId: "sysd_m14_t1", exerciseId: "sysd_m14_t1_pm_3", position: 3, level: "medium", title: "Fast feed",
    scenario: "Serving the ranked feed quickly (read-heavy) uses…",
    options: ["A maintained sorted set keyed by hot score (+ cached pages)", "Recomputing all scores per request", "A full table scan sorted each read", "A random sample"], correct: "A maintained sorted set keyed by hot score (+ cached pages)",
    explanation: "Keep posts in a sorted structure by score (leaderboard-style) for O(log n + k) top-N reads." }),
  // RTB
  pm({ topicId: "sysd_m14_t2", exerciseId: "sysd_m14_t2_pm_1", position: 1, level: "hard", title: "The constraint",
    scenario: "What dominates every decision in an ad exchange?",
    options: ["A hard ~100ms end-to-end latency budget", "Storage cost", "Code readability", "The number of advertisers"], correct: "A hard ~100ms end-to-end latency budget",
    explanation: "The auction must finish in ~100ms or the ad slot renders without it — latency rules everything." }),
  pm({ topicId: "sysd_m14_t2", exerciseId: "sysd_m14_t2_pm_2", position: 2, level: "hard", title: "Soliciting bids",
    scenario: "Bid requests to advertisers are sent…",
    options: ["In parallel with tight timeouts; slow bidders are dropped", "Sequentially, waiting for each", "After the page loads fully", "Once per day in batch"], correct: "In parallel with tight timeouts; slow bidders are dropped",
    explanation: "Parallel requests with per-bidder timeouts keep within budget; late bids are simply excluded." }),
  pm({ topicId: "sysd_m14_t2", exerciseId: "sysd_m14_t2_pm_3", position: 3, level: "medium", title: "The auction",
    scenario: "RTB typically uses which auction?",
    options: ["Second-price (winner pays second-highest + ε)", "First-price always", "Random selection", "Lowest bid wins"], correct: "Second-price (winner pays second-highest + ε)",
    explanation: "Second-price auctions incentivize truthful bidding; the exchange picks the highest of the in-time bids." }),
  // OTP
  pm({ topicId: "sysd_m14_t3", exerciseId: "sysd_m14_t3_pm_1", position: 1, level: "hard", title: "Anti-brute-force",
    scenario: "A 6-digit OTP is brute-forceable. The critical control is…",
    options: ["Attempt-limiting/rate-limiting with lockout", "A longer delivery time", "Storing it in plaintext", "Sending it twice"], correct: "Attempt-limiting/rate-limiting with lockout",
    explanation: "Limiting verification attempts (and rate-limiting) makes a short code infeasible to brute-force." }),
  pm({ topicId: "sysd_m14_t3", exerciseId: "sysd_m14_t3_pm_2", position: 2, level: "medium", title: "Anti-replay",
    scenario: "After a code verifies successfully, it should be…",
    options: ["Invalidated (single-use) so it can't be replayed", "Kept valid until expiry", "Reused for convenience", "Logged in plaintext"], correct: "Invalidated (single-use) so it can't be replayed",
    explanation: "Single-use + short TTL prevents replay; codes are stored hashed, not plaintext." }),
  pm({ topicId: "sysd_m14_t3", exerciseId: "sysd_m14_t3_pm_3", position: 3, level: "medium", title: "Delivery",
    scenario: "SMS/email delivery of the code should be…",
    options: ["Async (queued) — the SMS gateway can be slow", "Synchronous, blocking the request", "Skipped", "Done by the client"], correct: "Async (queued) — the SMS gateway can be slow",
    explanation: "Queue delivery so the request returns fast; TOTP (authenticator) needs no delivery at all." }),
  // Push gateway
  pm({ topicId: "sysd_m14_t4", exerciseId: "sysd_m14_t4_pm_1", position: 1, level: "medium", title: "Fan-out model",
    scenario: "Sending to millions of devices via APNs/FCM should be…",
    options: ["Async, queue-driven, batched per platform", "Synchronous, one device at a time", "A single giant request", "Done on the client"], correct: "Async, queue-driven, batched per platform",
    explanation: "Queue + platform workers sending in batches decouples you from slow/rate-limited providers and scales." }),
  pm({ topicId: "sysd_m14_t4", exerciseId: "sysd_m14_t4_pm_2", position: 2, level: "hard", title: "Token hygiene",
    scenario: "Providers report some tokens as invalid/unregistered. You must…",
    options: ["Prune them from the registry (or waste sends + get throttled)", "Keep retrying them forever", "Ignore the feedback", "Delete the user"], correct: "Prune them from the registry (or waste sends + get throttled)",
    explanation: "Processing provider feedback to remove dead tokens is essential token hygiene." }),
  pm({ topicId: "sysd_m14_t4", exerciseId: "sysd_m14_t4_pm_3", position: 3, level: "medium", title: "Delivery guarantee",
    scenario: "Push delivery is…",
    options: ["Best-effort (device may be off/offline) — retry transient failures", "Guaranteed exactly-once", "Always instant", "Synchronous"], correct: "Best-effort (device may be off/offline) — retry transient failures",
    explanation: "Push isn't guaranteed; design for best-effort with retries, not exactly-once." }),
  // Offline sync
  pm({ topicId: "sysd_m14_t5", exerciseId: "sysd_m14_t5_pm_1", position: 1, level: "medium", title: "Offline-first",
    scenario: "In an offline-first app, reads/writes…",
    options: ["Hit a local store immediately; changes queue for later sync", "Always go to the server", "Are disabled offline", "Block until online"], correct: "Hit a local store immediately; changes queue for later sync",
    explanation: "Local-first: the UI never blocks on the network; a queued oplog syncs in the background." }),
  pm({ topicId: "sysd_m14_t5", exerciseId: "sysd_m14_t5_pm_2", position: 2, level: "hard", title: "Two devices edit",
    scenario: "Two devices edit the same item offline. On reconnect this is resolved by…",
    options: ["Conflict resolution (last-write-wins / CRDT / app-merge)", "Whichever synced first wins silently always being correct", "Crashing", "Deleting the item"], correct: "Conflict resolution (last-write-wins / CRDT / app-merge)",
    explanation: "Concurrent edits conflict; resolve via LWW (logical clocks), CRDTs (auto-merge), or app-specific merge." }),
  pm({ topicId: "sysd_m14_t5", exerciseId: "sysd_m14_t5_pm_3", position: 3, level: "medium", title: "Efficient sync",
    scenario: "On reconnect, the client should transfer…",
    options: ["Only deltas since its last sync token (idempotent, resumable)", "Its entire local database every time", "Nothing", "Only the newest record"], correct: "Only deltas since its last sync token (idempotent, resumable)",
    explanation: "A cursor/sync-token enables delta sync; idempotency + tombstones handle retries and deletes." }),
  // Matchmaking
  pm({ topicId: "sysd_m14_t6", exerciseId: "sysd_m14_t6_pm_1", position: 1, level: "hard", title: "The trade-off",
    scenario: "Matchmaking fundamentally balances…",
    options: ["Match quality (fairness/latency) vs wait time", "CPU vs memory", "Reads vs writes", "Storage vs network"], correct: "Match quality (fairness/latency) vs wait time",
    explanation: "Tight criteria = fair but slow to match; loose = fast but unfair — the core tension." }),
  pm({ topicId: "sysd_m14_t6", exerciseId: "sysd_m14_t6_pm_2", position: 2, level: "hard", title: "Avoid endless waits",
    scenario: "How do you ensure players eventually match without permanently sacrificing fairness?",
    options: ["Widen the acceptance band (skill/ping) the longer they wait", "Use a fixed strict band always", "Match everyone instantly regardless of skill", "Cap the queue size"], correct: "Widen the acceptance band (skill/ping) the longer they wait",
    explanation: "Dynamic relaxation: start strict, loosen with wait time, so players match fairly-ish without waiting forever." }),
  pm({ topicId: "sysd_m14_t6", exerciseId: "sysd_m14_t6_pm_3", position: 3, level: "medium", title: "Bound the search",
    scenario: "To keep matches low-latency and the search fast, the pool is…",
    options: ["Bucketed by region and mode (and skill brackets)", "Searched globally across all players", "Random", "One big FIFO"], correct: "Bucketed by region and mode (and skill brackets)",
    explanation: "Region/mode bucketing yields low-ping matches and limits the matcher's comparison set." }),
  // Bulk email
  pm({ topicId: "sysd_m14_t7", exerciseId: "sysd_m14_t7_pm_1", position: 1, level: "hard", title: "Don't blast",
    scenario: "Why not send a million-recipient campaign as fast as possible?",
    options: ["It trips spam filters and blacklists your IP/domain (deliverability)", "It's too cheap", "Recipients prefer slow email", "Queues can't handle it"], correct: "It trips spam filters and blacklists your IP/domain (deliverability)",
    explanation: "Throttle and warm up sending IPs; reputation/deliverability — not speed — governs the rate." }),
  pm({ topicId: "sysd_m14_t7", exerciseId: "sysd_m14_t7_pm_2", position: 2, level: "hard", title: "Hygiene",
    scenario: "Hard bounces and spam complaints must be…",
    options: ["Added to a suppression list and never emailed again", "Retried repeatedly", "Ignored", "Re-subscribed"], correct: "Added to a suppression list and never emailed again",
    explanation: "Suppressing bounces/complainers (and honoring unsubscribes) protects sender reputation and is legally required." }),
  pm({ topicId: "sysd_m14_t7", exerciseId: "sysd_m14_t7_pm_3", position: 3, level: "medium", title: "Architecture",
    scenario: "The send architecture is…",
    options: ["Expand to per-recipient jobs on a queue → throttled sender workers", "One synchronous loop sending all emails", "A nightly cron with no queue", "Client-side sending"], correct: "Expand to per-recipient jobs on a queue → throttled sender workers",
    explanation: "Async queue fan-out to throttled workers scales, survives crashes, and respects provider limits." }),
  // Feature store
  pm({ topicId: "sysd_m14_t8", exerciseId: "sysd_m14_t8_pm_1", position: 1, level: "hard", title: "Why two stores",
    scenario: "A feature store maintains an offline AND an online store because…",
    options: ["Training needs batch over history; inference needs latest values at low latency", "Redundancy only", "Offline is a backup", "One is for logs"], correct: "Training needs batch over history; inference needs latest values at low latency",
    explanation: "Training (offline, full history, throughput) and inference (online, latest, ms latency) have opposite needs." }),
  pm({ topicId: "sysd_m14_t8", exerciseId: "sysd_m14_t8_pm_2", position: 2, level: "hard", title: "The classic bug",
    scenario: "A feature store mainly exists to prevent…",
    options: ["Train/serve skew (features computed differently in training vs serving)", "Disk failure", "Slow training", "Too many features"], correct: "Train/serve skew (features computed differently in training vs serving)",
    explanation: "Shared feature definitions across both paths kill train/serve skew, which silently degrades production models." }),
  pm({ topicId: "sysd_m14_t8", exerciseId: "sysd_m14_t8_pm_3", position: 3, level: "hard", title: "Training joins",
    scenario: "Building a training set must use feature values…",
    options: ["As they were at each event's time (point-in-time correct, no future leakage)", "As they are right now", "Averaged over all time", "Randomly sampled"], correct: "As they were at each event's time (point-in-time correct, no future leakage)",
    explanation: "Point-in-time joins avoid data leakage (future info bleeding into the past) that inflates offline metrics." }),
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
  console.log(`\nDone — M14 Case Studies IX seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
