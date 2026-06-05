/**
 * Seed — System Design DEPTH pilot (SD_DEPTH_STANDARD.md).
 *
 * Re-authors 5 flagship case-study topics to AlgoMaster-level depth: the full
 * interview framework (requirements → estimation with numbers → high-level
 * design → API → data model → ≥2 deep dives → bottlenecks), each block tagged
 * with a `section` key the depth audit checks, PLUS a real authored architecture
 * SVG and 3 extra graded exercises per topic.
 *
 *   sysd_m1_t10  URL Shortener        (module sysd_m1)
 *   sysd_m1_t11  Distributed Rate Limiter (module sysd_m1)
 *   sysd_m1_t12  News Feed            (module sysd_m1)
 *   sysd_m3_t1   Chat System          (module sysd_m3)
 *   sysd_m4_t5   Distributed KV Store (module sysd_m4)
 *
 * Idempotent: upserts topics by topicId and exercises by exerciseId, then
 * recomputes track totals. Verify: node config/auditSysdDepth.mjs --require
 * sysd_m1_t10,sysd_m1_t11,sysd_m1_t12,sysd_m3_t1,sysd_m4_t5
 *
 * Usage: node config/seedSysdDepthPilot.js  ·  npm run seed:sysd-depth-pilot
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";

// ── tiny SVG architecture-diagram builder (guaranteed well-formed) ───────────
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

// ── diagrams ────────────────────────────────────────────────────────────────
const DIAG = {
  url: svg(820, 250,
    box(20, 95, 110, 60, "Client", "browser") +
    box(170, 95, 110, 60, "CDN / LB", "edge", "#f0fdf4") +
    box(320, 95, 120, 60, "App Server", "stateless") +
    box(490, 30, 130, 60, "Cache", "Redis (hot)", "#fef9c3") +
    box(490, 160, 130, 60, "KV Store", "sharded", "#fce7f3") +
    box(680, 160, 120, 60, "Key-Gen", "counter/KGS", "#ede9fe") +
    arrow(130, 125, 170, 125) + arrow(280, 125, 320, 125) +
    arrow(440, 110, 490, 75, "read") + arrow(440, 140, 490, 185, "miss") +
    arrow(620, 190, 680, 190, "alloc") +
    note(555, 245, "Reads served from cache; DB on miss. 100:1 read:write")),
  rate: svg(820, 230,
    box(20, 85, 110, 60, "Client", "") +
    box(175, 85, 130, 60, "API Gateway", "edge") +
    box(350, 85, 150, 60, "Rate Limiter", "middleware", "#fef9c3") +
    box(560, 20, 120, 60, "Redis", "atomic INCR", "#fce7f3") +
    box(560, 150, 120, 60, "Service", "business", "#f0fdf4") +
    arrow(130, 115, 175, 115) + arrow(305, 115, 350, 115) +
    arrow(500, 100, 560, 60, "check+decr") +
    arrow(500, 130, 560, 180, "allow") +
    note(620, 120, "deny -> 429 Retry-After", "middle")),
  feed: svg(820, 300,
    note(120, 30, "WRITE (fan-out)") +
    box(20, 50, 100, 52, "Author", "") +
    box(150, 50, 110, 52, "Post Svc", "", "#f0fdf4") +
    box(290, 50, 110, 52, "Fan-out", "service", "#ede9fe") +
    box(430, 50, 100, 52, "Queue", "Kafka", "#fef9c3") +
    box(560, 50, 110, 52, "Workers", "async") +
    box(700, 50, 100, 52, "Feed Cache", "per-user", "#fce7f3") +
    arrow(120, 76, 150, 76) + arrow(260, 76, 290, 76) + arrow(400, 76, 430, 76) +
    arrow(530, 76, 560, 76) + arrow(670, 76, 700, 76) +
    note(120, 175, "READ (hybrid)") +
    box(20, 195, 100, 52, "Reader", "") +
    box(150, 195, 110, 52, "Feed Svc", "", "#f0fdf4") +
    box(290, 195, 120, 52, "Feed Cache", "pushed", "#fce7f3") +
    box(450, 195, 150, 52, "Celebrity posts", "pulled live", "#ede9fe") +
    box(640, 195, 110, 52, "Merge+rank", "") +
    arrow(120, 221, 150, 221) + arrow(260, 221, 290, 221) +
    arrow(410, 221, 450, 221, "pull") + arrow(600, 221, 640, 221) +
    note(410, 290, "Push for normal users; pull for celebrities -> hybrid")),
  chat: svg(820, 270,
    box(20, 40, 110, 56, "Client A", "") +
    box(20, 160, 110, 56, "Client B", "") +
    box(175, 95, 130, 60, "WS Gateway", "persistent conn", "#f0fdf4") +
    box(350, 95, 120, 60, "Chat Svc", "", "#eff6ff") +
    box(520, 30, 120, 56, "Queue", "per-user inbox", "#fef9c3") +
    box(520, 150, 120, 56, "Message Store", "Cassandra", "#fce7f3") +
    box(680, 95, 120, 56, "Presence", "Redis", "#ede9fe") +
    arrow(130, 80, 175, 110, "send") + arrow(175, 150, 130, 185, "deliver") +
    arrow(305, 125, 350, 125) +
    arrow(470, 110, 520, 70, "enqueue") + arrow(470, 140, 520, 175, "persist") +
    arrow(640, 110, 680, 120, "online?")),
  kv: svg(820, 290,
    box(20, 110, 110, 60, "Client", "") +
    box(170, 110, 130, 60, "Coordinator", "any node", "#f0fdf4") +
    box(360, 20, 120, 52, "Node A", "", "#fce7f3") +
    box(520, 20, 120, 52, "Node B", "", "#fce7f3") +
    box(680, 90, 120, 52, "Node C", "", "#fce7f3") +
    box(520, 175, 120, 52, "Node D", "", "#fce7f3") +
    box(360, 175, 120, 52, "Node E", "", "#fce7f3") +
    arrow(130, 140, 170, 140) +
    arrow(300, 120, 360, 60, "N replicas") +
    arrow(300, 135, 520, 60) +
    arrow(300, 150, 680, 110) +
    note(560, 275, "Consistent-hash ring; quorum W + R > N; gossip + vector clocks")),
};

// ── topic builder ───────────────────────────────────────────────────────────
// blocks: [{kind, section, heading, body}]. `section` is read by auditSysdDepth.
const TT = (moduleId, id, num, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, svgStr, vaType) => {
  const t = {
    trackKey: TRACK_KEY, moduleId, topicId: id, topicNumber: num, name, slug,
    metadata: { estimated_minutes: 50, difficulty: 4, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI },
    teaching: { blocks, visual_aid: { type: vaType, svg: svgStr, alt_text: `${name} architecture diagram.` } },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 50, difficulty: diff, xpReward: 80, visualizer: null,
  };
  return t;
};
const C = (section, heading, body) => ({ kind: "concept", section, heading, body });
const K = (section, heading, body) => ({ kind: "code", section, heading, body });

const TOPICS = [
  // ───────────────────────────── URL SHORTENER ─────────────────────────────
  TT("sysd_m1", "sysd_m1_t10", 10, "Case Study: Design a URL Shortener", "sysd-url-shortener",
    ["case-study", "url-shortener", "tinyurl", "hashing"],
    "Turn a long URL into tinyurl.com/x7Gk2 and redirect on lookup. It sounds trivial — where's the real system-design depth?",
    "The depth is in three places: generating short, unique keys at scale without collisions; making redirects ultra-low-latency for a read-dominated (~100:1) workload via cache + CDN; and storing billions of immutable mappings in a sharded key-value store. It is the canonical 'read-heavy, simple-access-pattern' design.",
    [
      C("requirements", "Requirements",
        "Start by separating what the system DOES from the qualities it must have. Functional: (1) shorten(longUrl) returns a short key; (2) GET /{key} redirects to the long URL; (3) optional custom/vanity alias; (4) optional expiry/TTL; (5) optional click analytics. Non-functional: a very high read:write ratio (~100:1 — every link is created once and clicked many times), redirects under ~10ms p99, extremely high availability (a dead shortener breaks every link ever published — old links must keep resolving for years), short and hard-to-guess keys, and durability (a stored mapping must never be lost). Clarify scope out loud: are URLs public or per-account? Is link editing allowed (it usually isn't — mappings are immutable, which simplifies caching enormously)? Pinning these non-functionals first is what justifies the cache/CDN-first read path; the write side is comparatively trivial."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100M new URLs/month.\n  writes  = 100M / (30 * 86400) ~= 40 writes/sec\n  reads   = 100:1 ratio          ~= 4,000 reads/sec (peak ~10k)\nStorage per mapping ~= 500 bytes (key + long URL + metadata).\n  5 yr  = 100M * 12 * 5 = 6B mappings\n  size  = 6B * 500 B    ~= 3 TB  (fits a sharded KV cluster easily)\nKey space: base62 (a-z A-Z 0-9). 62^7 ~= 3.5 trillion keys -> 7 chars is plenty.\nTakeaway: tiny write rate, huge read rate, modest storage -> optimize the READ path."),
      C("hld", "High-level design",
        "Write path: client -> app server -> allocate a unique key -> store {key -> longUrl} in the KV store, then warm the cache. Read path: client -> CDN -> load balancer -> stateless app server -> cache (Redis) -> KV store on miss -> 301/302 redirect. Because the data is immutable and read-dominated, most redirects are served from CDN/cache and never touch the database — the database is effectively a cold backstop. App servers are stateless (no session, no local data) so they scale horizontally behind the load balancer and any instance can serve any request; autoscaling tracks read QPS. The KV store is sharded by key so storage and write throughput scale by adding nodes. Keep the two paths mentally separate in the interview: the write path optimizes for collision-free unique-key allocation, the read path optimizes for latency via layered caching. Walk the interviewer through a single redirect end to end, naming where it is served from at each layer."),
      K("api", "API design",
        "POST /api/v1/urls\n  body: { \"longUrl\": \"https://...\", \"alias\"?: \"my-link\", \"ttlDays\"?: 30 }\n  201: { \"shortUrl\": \"https://sho.rt/x7Gk2\", \"key\": \"x7Gk2\" }\n  409: alias already taken\n\nGET /{key}\n  302 Found, Location: <longUrl>   (302 keeps control for analytics)\n  404 if unknown/expired\n\nGET /api/v1/urls/{key}/stats   -> { clicks, createdAt, ... }"),
      K("data_model", "Data model",
        "Mapping table (key-value store, e.g. DynamoDB/Cassandra):\n  PK  key        string (base62, 7 chars)   <- partition key\n      long_url   string\n      user_id    string (nullable)\n      created_at timestamp\n      expires_at timestamp (nullable, TTL index)\n      click_count counter (denormalized; real counts via analytics pipeline)\nSharded by `key` using consistent hashing. No joins, single-key lookups only — exactly what a KV store is best at."),
      C("deep_dive", "Deep dive: generating the short key",
        "This is the part interviewers actually probe, so reason through both families explicitly. (a) Hash: take MD5/SHA of the long URL, base62-encode the digest, and keep the first 7 chars. Pros: the same URL deterministically maps to the same key (free dedupe). Cons: two different URLs can collide on the first 7 chars, so you must check-and-retry (look up the key; on conflict, re-hash with a salt or take the next slice) — and under load those check-then-write steps must be safe against races. (b) Counter: a single global integer, auto-incremented and base62-encoded. Zero collisions, smallest possible keys, but the counter is now a coordination point. Never serialize every write on one row — that caps your write rate at one machine. Instead a key-generation service hands each app server a RANGE (say ids 1,000,000-1,000,999) which it then mints locally with no further coordination; when it runs low it grabs another range. This is the common production choice (ticket servers, ZooKeeper sequential nodes, or a sharded counter). One caveat: sequential keys are guessable/enumerable, so if unpredictability matters, either pre-generate a shuffled pool of keys offline or encrypt the counter before encoding."),
      C("deep_dive", "Deep dive: the read path and caching",
        "Redirects are the hot path, so optimize them in layers. CDN at the edge serves the hottest links closest to users; behind it an in-memory cache (Redis) fronts the KV store. With an ~100:1 read ratio and a heavy long tail of popular links, cache hit rates are very high (often 90%+), so the database sees only a trickle of cold lookups. Cache entries are simple {key -> longUrl}; because mappings are immutable, cache invalidation is a non-issue (the classic hard problem disappears) — entries only need a TTL for memory reclamation, not correctness. Choose 302 (temporary) over 301 (permanent) when you want to count clicks: browsers cache 301s and skip your server on subsequent visits, so you lose both the analytics and the ability to change behavior later. Size the cache from the working set (hot keys * entry size), and pre-warm a new key on creation so the first click is already a hit. Guard against the thundering-herd on a cold-but-popular key with request coalescing (single-flight) so one DB read fills the cache for all concurrent waiters."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Name the single points of failure and how each is mitigated. The key-generation service: mitigate with range pre-allocation so app servers keep minting ids through a brief outage, and replicate it. The cache: replicate it and fail through to the KV store on a miss/outage (slower, still correct). Hot keys: a viral link can hammer one cache shard or one KV partition — replicate hot entries, add a small app-local LRU, and let the CDN absorb the very hottest. Analytics must NEVER block the redirect: fire click events to a queue (Kafka) and aggregate offline; the denormalized click_count is therefore approximate and eventually consistent, which is fine. Abuse: rate-limit creation and scan destination URLs for malware/phishing. Now state the trade-offs crisply: hash (free dedupe, must handle collisions) vs counter (no collisions, needs distributed allocation); 301 (browser-cached, fewer server hits, but no per-click analytics) vs 302 (every click reaches you, enabling counting); key length trades shortness against exhaustion (7 base62 chars = 3.5T, decades of headroom); and strong vs eventual consistency — a freshly created link reaching all caches a second late is acceptable, so we bias to availability. Closing signal: it is a read-dominated, immutable-data problem solved with CDN+cache over a sharded KV store, with the only real subtlety being collision-free key generation at scale."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect these and have an answer ready. 'How long should the key be?' Do the base62 math out loud: 62^7 is ~3.5 trillion, so 7 chars covers decades at 100M/month — pick the smallest length that won't exhaust. 'Custom/vanity aliases?' Reserve them in the same keyspace with a uniqueness check, and keep them in a namespace that can't collide with generated keys. 'Analytics at billions of clicks?' Never inline it — emit a click event to Kafka and aggregate offline into per-link counts and time series; the number shown is eventually consistent. 'Expire and reclaim keys?' Store expires_at, let a TTL index or a background sweeper purge, and decide whether reclaimed keys can be reissued (usually no, to avoid stale links resolving to new targets). 'Prevent abuse?' Rate-limit creation per account/IP and scan destinations against a malware/phishing list. 'One DB or many?' Start with a single sharded KV store; geo-replicate read replicas near users for global low-latency redirects as you grow. The anchor never moves: read-dominated, immutable data, served from CDN+cache over a sharded KV store."),
    ],
    "The URL shortener is the most common warm-up. The signal is recognizing it is read-dominated (CDN + cache over a sharded KV store), reasoning crisply about collision-free key generation at scale, and keeping analytics off the redirect hot path.",
    [
      { gap_id: "write_heavy_mistake", what_students_get_wrong: "Designing it write-heavy and missing that redirects dominate.", remediation: "State the ~100:1 read:write ratio first and design the cache/CDN read path around it.", detection_pattern: "No mention of caching or read:write ratio." },
      { gap_id: "key_gen_handwave", what_students_get_wrong: "Hand-waving key generation with no collision or distribution story.", remediation: "Pick hash+retry or a range-allocated distributed counter and justify it.", detection_pattern: "Says 'just hash it' with no collision handling." },
      { gap_id: "analytics_blocking", what_students_get_wrong: "Counting clicks synchronously inside the redirect.", remediation: "Fire click events to a queue and aggregate offline; keep the redirect a pure cache lookup.", detection_pattern: "Increments a DB counter on the redirect path." },
    ],
    0.5, DIAG.url, "URL shortener architecture"),

  // ───────────────────────────── RATE LIMITER ──────────────────────────────
  TT("sysd_m1", "sysd_m1_t11", 11, "Case Study: Distributed Rate Limiter", "sysd-rate-limiter",
    ["case-study", "rate-limiter", "distributed", "token-bucket"],
    "Limit each user to 100 requests/minute — across 50 app servers that share no memory. Where does the count live, and how do you keep it correct under concurrency?",
    "A per-node in-memory counter under-counts because a user's requests land on different servers. The limit must live in shared, fast storage (Redis) and be updated ATOMICALLY with an algorithm (token bucket / sliding window). The design is about correctness under concurrency, a fast check on the hot path, and a sane failure policy when the shared store is down.",
    [
      C("requirements", "Requirements",
        "Functional: allow N requests per window per KEY, where the key can be a user id, IP, API key, or endpoint; reject excess with HTTP 429 + a Retry-After header; support multiple layered limits at once (e.g. per-user AND per-IP AND per-endpoint, each enforced independently); and ideally expose the remaining quota to clients. Non-functional: the check must add minimal latency (sub-millisecond — it runs on EVERY request), be correct under concurrency across the entire fleet (no bursts slipping past when requests fan out to many servers), be highly available, and scale horizontally with traffic. Two requirements are in tension and worth calling out: the limiter sits on the critical path of every request, yet it must not become a single point of failure — if its backing store is unavailable, the system needs a defined behavior rather than an outage. Clarify the limit semantics too: is it a hard cap or a smoothed rate, and are short bursts above the average acceptable?"),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 1M DAU, 100 requests/user/day -> 100M req/day.\n  avg = 100M / 86400 ~= 1,160 req/sec ; peak ~5-10k req/sec\nEach check = ~1-2 Redis ops. Redis does 100k+ ops/sec/node, so a small\nReplicated Redis (or a few shards by key) absorbs this comfortably.\nState per key ~= tens of bytes (counter + window or tokens + timestamp).\n  10M active keys * ~50 B ~= 500 MB -> fits in memory.\nBudget: the limiter must add < ~1 ms; a single Redis round trip does."),
      C("hld", "High-level design",
        "Place the limiter at the edge — API gateway or a middleware (the Chain-of-Responsibility pattern) — BEFORE business logic, so rejected traffic never reaches your services and never consumes their capacity. On each request it derives the key (user/IP/endpoint), runs an atomic check-and-update against shared Redis, and either forwards the request or returns 429 with Retry-After. Redis holds the counters/tokens; the limiter logic is stateless and replicated behind the gateway so any instance can handle any request, and it autoscales with traffic. Keep the data plane (the per-request check) on the hot path and push configuration (limits per plan/route) to a control plane that the limiter reads from cache, so changing a limit never requires a redeploy."),
      K("api", "API / contract",
        "Internal middleware contract (not a public API):\n  allow(key, limit, windowSec) -> { allowed: bool, remaining: int, resetSec: int }\n\nResponse headers on every request:\n  X-RateLimit-Limit: 100\n  X-RateLimit-Remaining: 42\n  X-RateLimit-Reset: 37\nOn reject:\n  HTTP 429 Too Many Requests\n  Retry-After: 37"),
      K("data_model", "State model (Redis)",
        "Token bucket per key:\n  key  = ratelimit:{scope}:{id}      e.g. ratelimit:user:123\n  value (hash) = { tokens: float, last_refill: epoch_ms }\n  TTL  = a few windows (auto-evict idle keys)\n\nFixed window (simpler):\n  key  = ratelimit:user:123:{minute_bucket}\n  INCR key ; if first, EXPIRE key 60 ; reject when value > limit"),
      C("deep_dive", "Deep dive: the algorithms",
        "Know four and their trade-offs. Fixed window — one counter per clock bucket (e.g. per minute); dead simple and cheap (one INCR), but allows up to ~2x bursts straddling a boundary: 100 requests at 0:00:59 and 100 more at 0:01:00 pass even though they're within the same 60-second span. Sliding-window log — store a timestamp per request and count those within the trailing window; exact, but memory grows with traffic. Sliding-window counter — approximate the sliding window by weighting the previous bucket's count by how far into the current bucket you are; near-exact with O(1) state, a great default for accuracy-sensitive limits. Token bucket — tokens refill at a steady rate up to a capacity; each request spends one; allows controlled bursts up to the bucket size, O(1) state (just tokens + last-refill timestamp), and maps cleanly to 'X sustained with bursts up to Y' — the most common production answer. Leaky bucket — processes at a constant rate via a queue, smoothing output (good for shaping traffic to a downstream). Pick token bucket by default and explicitly name the burst-vs-smoothness and accuracy-vs-memory trade-offs; the interviewer wants the reasoning, not just the name."),
      C("deep_dive", "Deep dive: atomicity & accuracy at scale",
        "The check-modify-write MUST be atomic, or concurrent requests racing on different app servers all read the same count, all decide they're under the limit, and all proceed — bursts slip past. The classic bug is two separate ops: GET the count, then SET it. Make it one atomic operation: a single Redis INCR + EXPIRE (the first request in a window sets the TTL), or for token bucket a small Lua script / Redis function that reads tokens, refills based on elapsed time, checks, decrements, and writes — all in ONE round trip while Redis executes it atomically. Beyond correctness, manage latency and load: shard counters by key across Redis nodes so no single node is the bottleneck, and keep the limiter logic stateless so it scales behind the gateway. For ultra-low latency or resilience you can do approximate LOCAL limiting — a token bucket per node that periodically syncs/borrows from a shared pool — trading a little global accuracy for speed and for surviving a store blip. State which you'd choose for the given limit: strict global accuracy (central atomic store) vs fast/approximate (local with sync)."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Redis is both the SPOF and the latency floor, so address it head-on: replicate it (primary + replicas, or a cluster), shard hot keys across nodes, and decide fail-open vs fail-closed when it's unreachable. Default to FAIL-OPEN — for most APIs, briefly allowing extra traffic beats a full outage — and reserve fail-closed for abuse-prevention or billing-critical limits where over-allowing is worse than rejecting. Global vs per-region is the other big axis: a single global store is accurate but adds cross-region round-trip latency to every request; per-region limiters are fast but looser (a user effectively gets ~N per region), so pick per the requirement (strict global quotas need the central store; loose protective limits can be regional). Hot keys — one abusive client or one popular endpoint — concentrate load on a single shard; mitigate with sharding, local caching, or a dedicated bucket. Summarize the trade-offs you navigated: accuracy (sliding-window log) vs cost (fixed window); strictness (fail-closed) vs availability (fail-open); global accuracy vs regional latency; and central atomic state vs fast local approximation. The closing signal is shared atomic state + token bucket + a clear failure policy."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Be ready for these. 'Make it correct across nodes' — the answer is shared atomic state (Redis INCR+EXPIRE or a Lua script), not per-node counters. 'Fix the fixed-window boundary burst' — move to a sliding-window counter or log. 'Layered limits' — enforce per-user AND per-IP AND per-endpoint by composing independent checks, each its own key; the strictest one wins. 'Global vs per-region' — a central store is accurate but adds cross-region latency, so for loose protective limits prefer per-region buckets and accept ~N-per-region. 'Token bucket specifics' — capacity is the burst allowance, refill rate is the sustained rate; tune them to the SLA. 'Distributed token bucket without a Redis hop per request' — keep a local bucket per node and periodically reconcile against a shared pool, accepting small overshoot for speed and resilience. 'Return useful errors' — 429 with Retry-After and X-RateLimit-* headers so good clients back off. 'What if Redis is down?' — fail-open for general APIs, fail-closed for abuse/billing-critical paths. Each follow-up comes back to the same trio: shared atomic state, the right algorithm for the burst tolerance, and an explicit failure policy."),
    ],
    "The distributed rate limiter bridges LLD and system design. Interviewers want shared atomic state (Redis), the token-bucket default with the burst trade-off named, the 429/Retry-After contract, and an explicit fail-open/closed decision.",
    [
      { gap_id: "local_counter", what_students_get_wrong: "Per-server in-memory counters that under-count across the fleet.", remediation: "Keep the count in shared Redis read/written by every node.", detection_pattern: "Counter described as living 'on the server'." },
      { gap_id: "non_atomic", what_students_get_wrong: "GET-then-SET check that lets concurrent bursts exceed the limit.", remediation: "Use INCR+EXPIRE or a Lua script so the check-and-update is atomic.", detection_pattern: "Two separate Redis ops for one decision." },
      { gap_id: "no_failure_policy", what_students_get_wrong: "No plan for when Redis is down.", remediation: "State fail-open vs fail-closed and why (usually fail-open).", detection_pattern: "No mention of the limiter store failing." },
    ],
    0.5, DIAG.rate, "Rate limiter architecture"),

  // ───────────────────────────── NEWS FEED ─────────────────────────────────
  TT("sysd_m1", "sysd_m1_t12", 12, "Case Study: Design a News Feed", "sysd-news-feed",
    ["case-study", "news-feed", "fanout", "timeline"],
    "Open the app and instantly see posts from everyone you follow. With millions of users and celebrities who have 100M followers, how is that feed built without melting on every post?",
    "The core decision is fan-out on WRITE (push: precompute each follower's feed when you post) vs fan-out on READ (pull: assemble at read time). Real systems use a HYBRID — push for normal users, pull for celebrities — to dodge the celebrity fan-out explosion, with async workers, a per-user feed cache, and a ranking stage.",
    [
      C("requirements", "Requirements",
        "Functional: create a post (text + media); view a feed of posts from accounts you follow, newest-first or ranked; follow/unfollow; support media; paginate the feed; and ideally near-real-time updates while the app is open. Non-functional: extremely read-heavy (people scroll far more than they post), feed loads under ~200ms p99, scale to ~100M+ DAU, high availability, and eventual consistency is acceptable — a post showing up a few seconds late, or feed ordering being approximate, is fine and is the lever that lets us cache aggressively. The defining tension to state up front is write amplification vs read latency: making reads instant by precomputing feeds pushes huge work onto the write path, and that tension — sharpened by celebrity accounts with tens of millions of followers — is the whole design. Clarify scope: chronological vs ranked feed, and whether 'real-time' means on-refresh or live-pushed."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100M DAU, each opens the feed ~10x/day -> feed reads ~1B/day.\n  reads ~= 1B / 86400 ~= 12,000 reads/sec (peak much higher)\nPosts: ~5% post 2x/day -> ~10M posts/day ~= 115 posts/sec.\nFan-out cost (pure push): avg 300 followers -> 115 * 300 ~= 35k feed-writes/sec.\nBut a celebrity with 100M followers = 100M writes for ONE post -> spikes.\nFeed cache: store ~500 post-ids/user * 100M users * ~16 B ~= 800 GB across a Redis cluster.\nTakeaway: reads dominate -> precompute + cache; celebrities break pure push."),
      C("hld", "High-level design",
        "Write path: author -> post service (store the post durably) -> fan-out service -> message queue -> async workers append the post id into each follower's feed list in the feed cache (Redis). Read path: feed service reads the viewer's precomputed feed from cache, and for the accounts they follow who are celebrities, PULLS those recent posts live and MERGES them, then ranks and paginates. Media is uploaded to object storage and served via a CDN; the feed carries only ids and lightweight metadata. The queue makes fan-out asynchronous so posting returns immediately and traffic spikes are absorbed. Keep the source-of-truth tables (posts, follows) separate from the derived feed cache: the cache is an optimization that can always be rebuilt from them, which is what makes losing it survivable rather than catastrophic."),
      K("api", "API design",
        "POST /api/v1/posts\n  body: { \"text\": \"...\", \"mediaId\"?: \"...\" }  -> 201 { postId }\n\nGET /api/v1/feed?cursor=<opaque>&limit=20\n  200: { items: [ { postId, author, text, ts } ], nextCursor }\n  (cursor-based — never OFFSET at scale)\n\nPOST /api/v1/follow { targetUserId }"),
      K("data_model", "Data model",
        "posts (KV/wide-column):  post_id PK, author_id, text, media_id, created_at\nfollows (wide-column):   user_id PK, followee_id  (who I follow)\n                         followee_id PK, follower_id (who follows me) -- both directions\nfeed cache (Redis):      feed:{user_id} = LIST/ZSET of post_ids (capped, e.g. 500)\nSorted by time or score; capped so memory is bounded."),
      C("deep_dive", "Deep dive: fan-out on write vs read",
        "This is the core decision, so weigh both honestly. Push (fan-out on write): the moment you post, write that post's id into every follower's precomputed feed list (in Redis) right now. Reads then become trivial — a user's feed is just their pre-built list, read in one shot — which is perfect for the common case and keeps the read path under 200ms. The costs: a single post by a 100M-follower account triggers 100M writes (the celebrity problem), it wastes enormous work pushing to inactive followers who may never log in, and it duplicates storage (each post id is copied into millions of lists). Pull (fan-out on read): just store the post once; at read time, fetch the recent posts from everyone the viewer follows and merge them on the fly. Writes are now cheap (one insert), but reads become expensive — a user following thousands of accounts triggers a large fan-in and merge on every feed open, blowing the latency budget. So neither pure strategy survives BOTH celebrities (which break push) and active readers who follow many (which break pull). That is exactly why production systems combine them."),
      C("deep_dive", "Deep dive: the hybrid + ranking",
        "The hybrid resolves the dilemma: push for normal accounts (so the 99% case has instant reads), but for high-fan-out accounts above a follower threshold (~10k-100k) do NOT pre-push their posts. Instead, at read time, pull those few celebrities' recent posts live and merge them into the viewer's pushed feed. Because a viewer follows only a handful of celebrities, this adds a small bounded fan-in while eliminating the million-write spike — capping write amplification and keeping reads fast simultaneously. The threshold is a tuning knob, not a constant. Layer in optimizations: only push to ACTIVE users (skip dormant accounts, backfill on their return) to cut wasted writes further. Ranking: a chronological feed is just a merge by timestamp, cheap and predictable; a ranked feed inserts an ML scoring service that scores candidate posts by engagement, recency, and viewer-author affinity, then orders them — far more engaging but it needs a feature pipeline and a candidate-generation step. Real-time: when the app is open, push new items to the client over WebSocket/SSE rather than waiting for a refresh. This active-user-aware hybrid with optional ranking is essentially what large Twitter/Instagram-style systems run in production."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Celebrity fan-out is the headline bottleneck — solved by the push/pull follower threshold so no single post triggers tens of millions of synchronous writes. Fan-out itself must be ASYNC through a queue and worker pool, or the post request would block on millions of writes; the queue also absorbs spikes (a celebrity posting during peak). The feed cache is hot and large, so cap each list length (e.g. last 500 ids), shard by user across the Redis cluster, and treat it as rebuildable — on cache loss you can reconstruct a feed from the posts + follows tables, so losing it is a latency event, not data loss. Pagination must be cursor-based on post id/timestamp; OFFSET/LIMIT scans everything before the page and collapses at billions of rows. The store sees a huge write rate from fan-out, so it must be write-optimized and partitioned. Now lay out the trade-offs you navigated: push (fast reads, costly writes, wasted storage for inactive users) vs pull (cheap writes, slow reads) vs hybrid (more moving parts but best overall); chronological (a cheap timestamp merge) vs ranked (engagement-maximizing but needs an ML scoring pipeline over candidate posts); and consistency relaxed to eventual in exchange for availability and cacheability. Closing signal: hybrid push/pull + async fan-out via a queue + a capped per-user cache + cursor pagination."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Anticipate these. 'Where's the celebrity threshold?' It's a tunable — accounts above ~10k-100k followers switch from push to pull; you can even tune it per-account by activity. 'Chronological or ranked?' Chronological is a cheap timestamp merge; ranked inserts an ML scoring service (engagement, recency, affinity) over a candidate set, which needs a feature store and candidate generation. 'Real-time updates?' Push new items to open clients over WebSocket/SSE instead of waiting for a pull-to-refresh. 'Pagination?' Cursor-based on (timestamp, post_id), never OFFSET. 'How stale can the feed be?' Eventual consistency is fine — bias to availability and cacheability. 'Posts from people you DON'T follow (recommendations)?' Blend a separate candidate source into the ranking stage. 'Deletes/edits?' Tombstone the post and filter at read time rather than chasing every cached copy. 'Media?' Store blobs in object storage, serve via CDN, keep only ids in the feed. Every answer routes back to the core idea: precompute with a hybrid push/pull to make reads instant while keeping write amplification bounded."),
    ],
    "The news feed is a top-tier question. The discriminating insight is the push/pull trade-off and the hybrid that defuses celebrity fan-out — plus async fan-out via a queue, a capped per-user feed cache, and cursor pagination.",
    [
      { gap_id: "pure_push", what_students_get_wrong: "Pure push, ignoring the celebrity fan-out explosion.", remediation: "Add a follower threshold above which you pull instead of push.", detection_pattern: "Every post writes to all followers, no celebrity case." },
      { gap_id: "sync_fanout", what_students_get_wrong: "Doing fan-out synchronously on the post request.", remediation: "Enqueue the post and fan out with async workers.", detection_pattern: "Post request waits for all follower writes." },
      { gap_id: "offset_pagination", what_students_get_wrong: "OFFSET/LIMIT pagination that degrades at scale.", remediation: "Use cursor-based pagination on id/timestamp.", detection_pattern: "Mentions page numbers / OFFSET." },
    ],
    0.6, DIAG.feed, "News feed fan-out architecture"),

  // ───────────────────────────── CHAT SYSTEM ───────────────────────────────
  TT("sysd_m3", "sysd_m3_t1", 1, "Design a Chat System (WhatsApp/Messenger)", "sysd-chat",
    ["case-study", "chat", "websocket", "messaging"],
    "Two people message in real time; messages must arrive in order, survive when the recipient is offline, and show delivered/read ticks — across hundreds of millions of users. What holds the live connection, and where do messages live?",
    "Clients hold a persistent connection (WebSocket) to a gateway; a chat service routes each message to the recipient's gateway if online, and ALWAYS persists it (so offline users get it on reconnect) via a per-user inbox + a durable message store. Delivery state (sent/delivered/read), ordering, and presence are the substance.",
    [
      C("requirements", "Requirements",
        "Functional: 1:1 and group messaging; real-time delivery when both parties are online; reliable offline delivery (the recipient gets everything on reconnect); delivery and read receipts (the ticks); presence (online / last-seen); and message history with scrollback. Non-functional: low latency (sub-second delivery), strict ordering within a conversation (messages must read back in send order), durability (a message that was acknowledged must NEVER be silently lost), scale to hundreds of millions of concurrent connections, and high availability. Two things make this harder than it looks. First, the connection layer is stateful — millions of long-lived sockets that must be held open and routed to — which is unlike a stateless request/response service. Second, delivery semantics: true exactly-once over a network is impossible, so the realistic target is at-least-once delivery plus client-side de-duplication, which together FEEL exactly-once. Clarify group size up front — small groups and giant channels are designed differently."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 500M DAU, 40 messages/user/day -> 20B messages/day.\n  avg = 20B / 86400 ~= 230k messages/sec ; peak ~1M/sec\nConnections: tens of millions concurrent WebSockets.\n  ~1M conns/gateway box -> dozens-to-hundreds of gateway servers.\nStorage: 20B msgs/day * ~300 B ~= 6 TB/day -> wide-column store + tiering.\nTakeaway: connection fan-out and write throughput dominate -> stateful\ngateways + a write-optimized store (Cassandra-style)."),
      C("hld", "High-level design",
        "Each client keeps a persistent WebSocket to a connection GATEWAY. To send, the message goes gateway -> chat service, which (1) persists it to the message store and the recipient's inbox, and (2) if the recipient is online (presence lookup), routes it to their gateway for instant push delivery; if offline, it waits in the inbox and is delivered on reconnect. A presence service (Redis) tracks who is online and which gateway holds each connection. A message queue between the chat service and the gateways decouples routing and absorbs spikes. Note the deliberate split: the gateway tier is STATEFUL (it owns sockets) while the chat service is stateless business logic — separating them lets each scale on its own axis (connections vs throughput) and lets a gateway fail without losing messages, since persistence already happened in the service tier."),
      K("api", "API / protocol",
        "WebSocket frames (client <-> gateway):\n  -> { type: 'SEND', convId, clientMsgId, text }\n  <- { type: 'ACK', clientMsgId, msgId, ts }      (server received+persisted)\n  <- { type: 'MESSAGE', msgId, convId, from, text, ts }\n  -> { type: 'READ', convId, upToMsgId }\n\nREST (history/setup):\n  GET /api/v1/conversations/{id}/messages?before=<msgId>&limit=50"),
      K("data_model", "Data model",
        "messages (wide-column, Cassandra-style):\n  PK (conv_id, msg_id)   -- msg_id = time-sortable (Snowflake) => ordering\n     sender_id, text, created_at, status\n  clustering by msg_id ASC -> efficient 'recent messages in a conversation'\ninbox / delivery (per recipient):\n  PK (user_id, msg_id)   status: sent|delivered|read\npresence (Redis):  user_id -> { gateway_id, last_seen }  (TTL heartbeat)"),
      C("deep_dive", "Deep dive: online vs offline delivery + receipts",
        "The presence store (Redis, refreshed by client heartbeats with a short TTL) answers two questions: is the recipient connected, and to WHICH gateway. The delivery flow always persists first: the chat service writes the message to the durable store and the recipient's inbox, THEN attempts delivery. Online path: it forwards the message to the gateway holding the recipient's socket, which pushes it down the wire; the recipient's client returns a DELIVERED ack, and later a READ ack when the chat is opened — these flip the message's status and notify the sender, which is exactly what the single/double/blue ticks render. Offline path: there is no socket, so the message simply waits in the inbox; when the recipient reconnects, the client sends its last-seen msg_id and pulls everything newer in order. Because persistence happens before delivery, a gateway crash or network drop mid-delivery never loses the message — worst case it's delivered again, and the client de-dupes by msg_id (and by the sender's clientMsgId for the sender's own retries). This persist-then-deliver discipline is what turns at-least-once into a no-loss, no-visible-duplicate experience."),
      C("deep_dive", "Deep dive: ordering, groups & connection scale",
        "Ordering: assign each message a time-sortable id (e.g. Snowflake: timestamp + machine + sequence) and cluster the message store by it, so a conversation reads back in send order without any cross-server coordination or reliance on fragile wall clocks. The client can also sort by this id when messages arrive slightly out of order over different paths. Groups: a small group is handled like a mini feed — fan the message out to each member's inbox (push), so each member's reads stay simple; but a huge group or broadcast channel (tens of thousands of members) would explode on push, so those lean toward fan-out-on-read, where members pull recent messages — the very same push/pull trade-off as the news feed, applied per group size. Connection scale: gateways are STATEFUL because they own live sockets, so you need a routing layer that maps user -> gateway (via the presence store) and sticky load balancing to keep a user on one gateway. Putting a message queue between the chat service and the gateways decouples them, smooths delivery bursts, and lets the gateway tier and the service tier scale independently."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The connection layer is the defining scaling challenge: millions of stateful, long-lived sockets. Gateways must scale horizontally, each owning a slice of connections, with the presence store mapping user -> gateway so the chat service can route, and graceful failover — when a gateway dies, its clients reconnect, re-resolve their gateway, and pull anything missed. Sticky routing or a connection-aware load balancer keeps a user pinned to their gateway. The message store must absorb an enormous ordered write rate (hundreds of thousands of msgs/sec), so use a write-optimized wide-column store partitioned by conversation, with hot/cold tiering so recent chats are fast while years-old history moves to cheaper storage. Spell out the trade-offs: WebSocket (true server push, but stateful and harder to scale) vs long-polling (simpler, statelessish, less efficient); strict ordering via sortable ids (cheap, no coordination) vs any cross-server locking (avoid it); group push to each member's inbox (fast reads, write amplification for big groups) vs group pull (cheap writes, heavier reads — used for huge channels); and at-least-once + client de-dupe vs chasing true exactly-once (impossible over a lossy network). Closing signal: stateful gateways + presence routing, persist-then-deliver durability, and sortable ids for ordering."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Have these ready. 'Group chat?' Small groups fan out to each member's inbox; large channels switch to fan-out-on-read — the same push/pull lever as feeds, chosen by group size. 'Read receipts and typing indicators?' Receipts update per-recipient message status and notify the sender; ephemeral signals like typing go over the socket and are NOT persisted. 'Media/attachments?' Upload to object storage, send a reference (id + thumbnail) in the message, serve via CDN — never push blobs through the message path. 'End-to-end encryption?' Encrypt on the client so the server stores only ciphertext; this constrains server-side search and requires device key management. 'Multi-device?' Each device is a separate endpoint with its own last-seen cursor; deliver to all of a user's devices and sync read state across them. 'Push notifications when the app is closed?' Hand off to APNs/FCM when there's no live socket. 'Scaling the socket tier?' Add gateways, keep presence-based routing, and reconnect-and-resync on failover. Each answer returns to the spine: stateful gateways with presence routing, persist-then-deliver durability, and time-sortable ids for ordering."),
    ],
    "Chat tests the persistent-connection layer (WebSocket gateways + presence routing), persist-then-deliver durability for offline users, time-sortable ids for ordering, and the receipts/state machine — with the group case echoing the feed push/pull trade-off.",
    [
      { gap_id: "no_persistence", what_students_get_wrong: "Routing live messages without persisting, so offline users lose them.", remediation: "Persist to store + inbox FIRST, then deliver; pull on reconnect.", detection_pattern: "Message goes straight socket-to-socket only." },
      { gap_id: "stateless_assumption", what_students_get_wrong: "Treating gateways as stateless and ignoring the connection-routing problem.", remediation: "Add presence mapping user -> gateway and sticky routing/failover.", detection_pattern: "No mention of which server holds the socket." },
      { gap_id: "ordering", what_students_get_wrong: "No ordering guarantee within a conversation.", remediation: "Use time-sortable ids (Snowflake) and cluster the store by them.", detection_pattern: "Relies on wall-clock timestamps or arrival order." },
    ],
    0.6, DIAG.chat, "Chat system architecture"),

  // ───────────────────────── DISTRIBUTED KV STORE ──────────────────────────
  TT("sysd_m4", "sysd_m4_t5", 5, "Design a Distributed Key-Value Store (Dynamo)", "sysd-kv-store",
    ["case-study", "key-value", "dynamo", "consistency"],
    "Build a key-value store that stays available and fast across many machines and even datacenter failures — a Dynamo/Cassandra-style system. With no single master, how do you place data, keep replicas in sync, and resolve conflicting writes?",
    "Partition keys across nodes with CONSISTENT HASHING (so adding/removing nodes moves minimal data), replicate each key to N nodes, and tune consistency with QUORUMS (W + R > N for strong-ish reads). With no master it is AP-leaning: accept writes during partitions and reconcile conflicts later via vector clocks / last-write-wins. Nodes find each other via gossip.",
    [
      C("requirements", "Requirements",
        "Functional: a tiny interface — get(key), put(key, value), delete(key) — with single-key operations only; deliberately NO cross-key joins or multi-key transactions, because that restriction is exactly what lets the store scale horizontally without distributed coordination. Non-functional: always-writable (an 'add to cart' should succeed even during failures), low and predictable latency, linear horizontal scalability, INCREMENTAL scaling (adding a node should move a small slice of data, not reshuffle everything), and tunable consistency so each workload picks its own point. The framing decision is CAP: when a network partition happens you must choose between staying consistent (reject writes on the minority side) and staying available (accept writes everywhere and reconcile later). Dynamo-style stores deliberately lean AP — favor availability and partition tolerance, accept temporary divergence, and resolve conflicts afterward — which is the right call for shopping carts, sessions, and similar always-on data. Say this trade-off out loud; it drives every later choice."),
      K("estimation", "Capacity estimation (with numbers)",
        "Target 100 TB of data, replication factor N = 3 -> 300 TB raw.\n  nodes: 300 TB / 4 TB per node ~= 75 nodes\nThroughput target 1M ops/sec; ~10k ops/sec/node -> ~100 nodes (use the larger).\nWith virtual nodes (vnodes), ~256 tokens/node spreads load evenly and makes\nrebalancing on add/remove smooth.\nTakeaway: scale is linear in nodes; the design problem is placement,\nreplication, and consistency — not raw capacity."),
      C("hld", "High-level design",
        "Keys are hashed onto a ring; each key is owned by the next node clockwise and replicated to the following N-1 distinct physical nodes (the preference list). Any node can act as COORDINATOR for a request: the client hits any node, which forwards to the N replicas and waits for W acks on writes / R responses on reads before answering. Nodes share membership and failure information via GOSSIP (no central registry to become a bottleneck or SPOF). There is no master — every node is symmetric and can take reads and writes — which removes the master as a single point of failure and is what enables always-on writes during node or network failures. Contrast this with a leader-based (CP) design, where losing the leader stalls writes until a new one is elected; the symmetric, masterless design trades some consistency for that availability."),
      K("api", "API",
        "get(key)            -> { value, context }   // context carries version info\nput(key, value, context)                          // pass back context on update\ndelete(key)\n\nTunables per operation or namespace:\n  N = replicas (e.g. 3)\n  W = write quorum (acks required)\n  R = read quorum (responses required)\n  W + R > N  => a read overlaps the latest write (strong-ish)."),
      K("data_model", "Placement model",
        "Consistent-hash ring with virtual nodes:\n  token = hash(key)\n  owner = first vnode clockwise of token\n  replicas = next N-1 distinct physical nodes (preference list)\nPer key the store keeps:\n  value + version metadata (vector clock OR last-write-wins timestamp)\nAdding a node: it claims tokens and only the affected key ranges move\n(not a full reshuffle) -> incremental scaling."),
      C("deep_dive", "Deep dive: replication & quorums (N, W, R)",
        "Each key is replicated to N nodes (its preference list). A write is acknowledged to the client once W replicas confirm it; a read returns once R replicas respond (the coordinator picks the freshest version among them). The key relation is W + R > N: it forces the write quorum and read quorum to overlap on at least one node, so any read is guaranteed to see at least one replica that has the latest acknowledged write — that's 'strong-ish' consistency without a master. Classic setting: N=3, W=2, R=2 (2+2 > 3). The knob is yours to turn per workload: W=1 makes writes fast and highly available but a reader might miss a very recent write; R=1 makes reads cheap but possibly stale; W=N makes writes durable but fragile to any node being down. So you literally dial consistency vs latency/availability by choosing N/W/R. Two supporting mechanisms keep writes flowing during trouble: hinted handoff — if a target replica is down, a healthy node temporarily stores the write with a 'hint' and forwards it when the owner returns, so the write still reaches W; and sloppy quorums, where the W/R nodes are the first N healthy ones on the ring rather than strictly the preferred ones, trading a little consistency for availability."),
      C("deep_dive", "Deep dive: conflict resolution & membership",
        "With concurrent writes during partitions, replicas can diverge. Resolve with VECTOR CLOCKS (track causality; if versions are concurrent, surface both for the app/client to merge — like a shopping cart) or LAST-WRITE-WINS by timestamp (simple, can drop a write). Anti-entropy keeps replicas converging: Merkle trees efficiently find which key ranges differ and sync only those; read-repair fixes stale replicas seen during a read. Membership and failure detection use GOSSIP — nodes periodically exchange state, so the cluster self-heals with no central coordinator."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The defining trade-off is CAP itself: leaning AP buys always-on writes and partition tolerance at the price of temporary inconsistency, which you then claw back with quorums, vector clocks, read-repair, and anti-entropy — choose a CP store instead only when stale or conflicting reads are genuinely unacceptable (e.g. ledgers). Hot keys and hot partitions overload a few nodes; virtual nodes plus a good hash spread both data and load evenly, and vnodes also make rebalancing on node add/remove smooth (only adjacent token ranges move). Wide rows and very large values strain a single node, so enforce size limits and keep values small. Operational cost is real: gossip, hinted handoff, and Merkle-tree anti-entropy all add steady background traffic and complexity — that's the price of having no master. The headline knobs let each table choose its point on the spectrum: W+R>N with vector clocks is safer but slower and pushes merge logic to the app; W=1 with last-write-wins is fastest and simplest but can silently drop a concurrent write. And remember the deliberate scope limit — single-key operations, no cross-key transactions — is precisely what keeps the whole thing horizontally scalable. Closing signal: consistent hashing + vnodes, N/W/R quorums as the consistency dial, vector-clock/LWW conflict resolution, and gossip + read-repair to converge."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect these. 'How do nodes find each other and detect failures?' Gossip — each node periodically exchanges membership and liveness with a few peers, so the cluster converges on who's up with no central registry. 'How do replicas re-sync after a partition heals?' Anti-entropy with Merkle trees: nodes compare range hashes and transfer only the differing keys, cheaply; read-repair fixes any stale replica noticed during a read. 'Vector clocks vs last-write-wins?' Vector clocks preserve causality and surface true conflicts for the app to merge (e.g. union a shopping cart) but add metadata and client complexity; LWW is simple and metadata-light but can silently drop a concurrent write — pick per how costly a lost write is. 'Adding/removing a node?' With virtual nodes only the neighboring token ranges move, so scaling is incremental and online. 'Strong consistency for some keys?' Raise W/R (or use W=N) for those, accepting lower availability there. 'Storage engine on each node?' An LSM-tree (write-optimized) suits the high write rate. 'Range scans?' Not a strength — it's a hash-partitioned KV store; use an ordered store if you need them. The spine holds: consistent hashing + vnodes, N/W/R quorums, conflict resolution, and gossip/anti-entropy convergence."),
    ],
    "The distributed KV store is the canonical 'no-master, AP' design. Signal: consistent hashing with vnodes for placement/rebalancing, N/W/R quorums (W+R>N) as the tunable consistency knob, conflict resolution via vector clocks or LWW, and gossip + Merkle-tree anti-entropy for membership and convergence.",
    [
      { gap_id: "no_consistent_hashing", what_students_get_wrong: "Hashing keys with modulo node-count, so adding a node reshuffles everything.", remediation: "Use a consistent-hash ring with virtual nodes; only adjacent ranges move.", detection_pattern: "key % N placement." },
      { gap_id: "ignores_quorum", what_students_get_wrong: "Replicating without explaining how reads stay consistent.", remediation: "Introduce N/W/R and the W+R>N rule as the consistency knob.", detection_pattern: "Says 'replicate to 3 nodes' with no read/write quorum." },
      { gap_id: "no_conflict_resolution", what_students_get_wrong: "No plan for concurrent writes during a partition.", remediation: "Use vector clocks (or LWW) plus read-repair / Merkle anti-entropy.", detection_pattern: "Assumes writes never conflict." },
    ],
    0.7, DIAG.kv, "Distributed key-value store ring"),
];

// ── extra deep exercises (3 per topic) ──────────────────────────────────────
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);
function pm(moduleId, o) {
  return { trackKey: TRACK_KEY, moduleId, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const EXERCISES = [
  // URL shortener
  pm("sysd_m1", { topicId: "sysd_m1_t10", exerciseId: "sysd_m1_t10_pm_d1", position: 11, level: "medium",
    title: "Why is it read-optimized?", scenario: "Given ~100M new URLs/month and a 100:1 read:write ratio, what dominates the design?",
    options: ["A cache/CDN-first read path over a sharded KV store", "A write-ahead log for durability of redirects", "A relational DB with joins for analytics", "A message queue on the redirect path"],
    correct: "A cache/CDN-first read path over a sharded KV store",
    explanation: "Reads dwarf writes (~4k vs ~40 / sec), so the redirect path is optimized with CDN + cache in front of a simple KV store." }),
  pm("sysd_m1", { topicId: "sysd_m1_t10", exerciseId: "sysd_m1_t10_pm_d2", position: 12, level: "medium",
    title: "Distributed counter without a bottleneck", scenario: "You use a counter to generate keys but don't want every app server serializing on one row. Best approach?",
    options: ["Hand each server a pre-allocated RANGE of ids from a key-gen service", "Lock the counter row per request", "Use the client's timestamp as the id", "Generate a random 32-char key each time"],
    correct: "Hand each server a pre-allocated RANGE of ids from a key-gen service",
    explanation: "Range allocation lets each server mint ids locally — no per-request coordination, no single-row hotspot, and it survives a brief key-gen outage." }),
  pm("sysd_m1", { topicId: "sysd_m1_t10", exerciseId: "sysd_m1_t10_pm_d3", position: 13, level: "hard",
    title: "301 vs 302 for analytics", scenario: "You want to count clicks on each short link. Which redirect, and why?",
    options: ["302, because browsers don't cache it so each click hits your server", "301, because it is permanent and faster", "301, because it is cached by the browser", "Either; redirect type doesn't affect analytics"],
    correct: "302, because browsers don't cache it so each click hits your server",
    explanation: "301 is cached by browsers and skips your server (no count). 302 keeps each click coming to you so you can record it (fire async, never block)." }),
  // Rate limiter
  pm("sysd_m1", { topicId: "sysd_m1_t11", exerciseId: "sysd_m1_t11_pm_d1", position: 11, level: "medium",
    title: "Atomicity bug", scenario: "Under load the limiter occasionally allows 120 requests when the limit is 100. The check does GET then SET. Root cause?",
    options: ["Non-atomic read-modify-write races across concurrent requests", "Redis is too slow", "The window is too long", "The 429 response is cached"],
    correct: "Non-atomic read-modify-write races across concurrent requests",
    explanation: "Two requests GET the same count, both decide they're under the limit, both SET — bursts slip past. Use INCR+EXPIRE or a Lua script for one atomic op." }),
  pm("sysd_m1", { topicId: "sysd_m1_t11", exerciseId: "sysd_m1_t11_pm_d2", position: 12, level: "medium",
    title: "Boundary burst", scenario: "A fixed-window limiter of 100/min lets a client send ~200 requests around the minute boundary. Best fix?",
    options: ["Sliding-window counter/log to smooth the boundary", "Double the limit", "Shorten the window to 1 second", "Switch to per-IP limiting"],
    correct: "Sliding-window counter/log to smooth the boundary",
    explanation: "Fixed windows allow ~2x bursts straddling the reset. A sliding window weights the prior window (or logs timestamps) to enforce the rate continuously." }),
  pm("sysd_m1", { topicId: "sysd_m1_t11", exerciseId: "sysd_m1_t11_pm_d3", position: 13, level: "hard",
    title: "Redis is down", scenario: "The shared rate-limit store becomes unreachable for a public content API. Most common policy?",
    options: ["Fail-open: allow requests so the API stays available", "Fail-closed: reject all requests", "Crash the gateway", "Switch every node to local-only strict limits"],
    correct: "Fail-open: allow requests so the API stays available",
    explanation: "For most APIs availability beats strictness, so you fail-open when the limiter store is down. Fail-closed is reserved for abuse/billing-critical limits." }),
  // News feed
  pm("sysd_m1", { topicId: "sysd_m1_t12", exerciseId: "sysd_m1_t12_pm_d1", position: 11, level: "medium",
    title: "Celebrity fan-out", scenario: "A user with 100M followers posts. Pure fan-out-on-write triggers 100M writes. Standard fix?",
    options: ["Hybrid: pull celebrity posts at read time instead of pushing", "Push faster with more workers", "Drop followers beyond 1M", "Store the feed in SQL"],
    correct: "Hybrid: pull celebrity posts at read time instead of pushing",
    explanation: "Above a follower threshold, don't pre-push. Pull those posts at read time and merge into the pushed feed — caps write amplification, keeps reads fast." }),
  pm("sysd_m1", { topicId: "sysd_m1_t12", exerciseId: "sysd_m1_t12_pm_d2", position: 12, level: "medium",
    title: "Async fan-out", scenario: "Why route fan-out through a message queue + workers instead of doing it in the post request?",
    options: ["So posting returns immediately and spikes are absorbed", "To make the feed strongly consistent", "To avoid using a cache", "Because queues are cheaper than databases"],
    correct: "So posting returns immediately and spikes are absorbed",
    explanation: "Fan-out can be thousands of writes; doing it synchronously stalls the post. A queue decouples it, returns fast, and smooths bursts." }),
  pm("sysd_m1", { topicId: "sysd_m1_t12", exerciseId: "sysd_m1_t12_pm_d3", position: 13, level: "hard",
    title: "Pagination at scale", scenario: "Feed pagination must stay fast at billions of rows. Which approach?",
    options: ["Cursor-based on post id/timestamp", "OFFSET/LIMIT with page numbers", "Load the whole feed then slice client-side", "Random sampling per page"],
    correct: "Cursor-based on post id/timestamp",
    explanation: "OFFSET scans everything before the page and collapses at scale. A cursor (last seen id/timestamp) jumps straight to the next slice." }),
  // Chat
  pm("sysd_m3", { topicId: "sysd_m3_t1", exerciseId: "sysd_m3_t1_pm_d1", position: 11, level: "medium",
    title: "Offline delivery", scenario: "The recipient is offline when a message is sent. How does it reach them later without loss?",
    options: ["Persist to store + inbox first; deliver on reconnect", "Hold it in the sender's RAM until they come online", "Drop it and ask the sender to retry", "Broadcast it to all gateways repeatedly"],
    correct: "Persist to store + inbox first; deliver on reconnect",
    explanation: "Messages are persisted before delivery, so an offline recipient pulls everything since their last seen id on reconnect — nothing is lost." }),
  pm("sysd_m3", { topicId: "sysd_m3_t1", exerciseId: "sysd_m3_t1_pm_d2", position: 12, level: "medium",
    title: "Which gateway holds the socket?", scenario: "Millions of clients hold WebSockets across many gateway servers. How does the chat service route a message to the right one?",
    options: ["A presence service maps user -> gateway", "It broadcasts to every gateway", "DNS round-robin", "The sender specifies the gateway"],
    correct: "A presence service maps user -> gateway",
    explanation: "Gateways are stateful; a presence store (Redis, heartbeat-refreshed) records which gateway holds each online user so messages route directly." }),
  pm("sysd_m3", { topicId: "sysd_m3_t1", exerciseId: "sysd_m3_t1_pm_d3", position: 13, level: "hard",
    title: "Ordering within a conversation", scenario: "Messages must read back in the order they were sent, across servers. Best mechanism?",
    options: ["Time-sortable ids (e.g. Snowflake), clustered in the store", "Sort by server arrival time", "Sort by the client's wall clock", "A global lock per conversation"],
    correct: "Time-sortable ids (e.g. Snowflake), clustered in the store",
    explanation: "A monotonic, time-sortable id per message plus clustering by it gives stable ordering without cross-server coordination or fragile wall clocks." }),
  // KV store
  pm("sysd_m4", { topicId: "sysd_m4_t5", exerciseId: "sysd_m4_t5_pm_d1", position: 11, level: "medium",
    title: "Placement that rebalances cheaply", scenario: "Adding a node must move minimal data. Which placement scheme?",
    options: ["Consistent hashing with virtual nodes", "key % number_of_nodes", "A central shard-map table", "Range partitioning by insert time"],
    correct: "Consistent hashing with virtual nodes",
    explanation: "Modulo placement reshuffles almost everything when N changes. A consistent-hash ring with vnodes moves only adjacent ranges and spreads load evenly." }),
  pm("sysd_m4", { topicId: "sysd_m4_t5", exerciseId: "sysd_m4_t5_pm_d2", position: 12, level: "hard",
    title: "Quorum for fresh reads", scenario: "With N=3 replicas, which W/R guarantees a read overlaps the latest acked write?",
    options: ["W=2, R=2 (W + R > N)", "W=1, R=1", "W=1, R=2", "W=3, R=0"],
    correct: "W=2, R=2 (W + R > N)",
    explanation: "W + R > N forces the read and write quorums to overlap on at least one replica, so reads see the latest acked value. 2+2 > 3 holds; 1+1 does not." }),
  pm("sysd_m4", { topicId: "sysd_m4_t5", exerciseId: "sysd_m4_t5_pm_d3", position: 13, level: "hard",
    title: "Concurrent writes during a partition", scenario: "Two clients write the same key on opposite sides of a network partition. How does a Dynamo-style store reconcile?",
    options: ["Vector clocks detect concurrency; resolve (merge) or LWW", "Reject both writes", "Whichever node has more CPU wins", "Block writes until the partition heals"],
    correct: "Vector clocks detect concurrency; resolve (merge) or LWW",
    explanation: "AP systems accept both writes; vector clocks mark them concurrent so the app merges (e.g. cart union) or last-write-wins by timestamp resolves it. Read-repair/Merkle anti-entropy then converge replicas." }),
];

// ── upsert + recompute ──────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  let tUp = 0, eUp = 0;

  // Sanity: the target modules must exist (we only deepen topics, not create modules).
  const moduleIds = [...new Set(TOPICS.map((t) => t.moduleId))];
  for (const mid of moduleIds) {
    const m = await ProModule.findOne({ trackKey: TRACK_KEY, moduleId: mid }).lean();
    if (!m) throw new Error(`Module ${mid} not found — run the base SD seeds first.`);
  }

  for (const t of TOPICS) {
    await ProTopic.updateOne({ trackKey: TRACK_KEY, topicId: t.topicId }, { $set: t }, { upsert: true });
    tUp++;
  }
  for (const e of EXERCISES) {
    await ProExercise.updateOne({ trackKey: TRACK_KEY, exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    eUp++;
  }

  const totals = await recomputeTrackTotals(TRACK_KEY);
  console.log(`✓ Deep pilot seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
