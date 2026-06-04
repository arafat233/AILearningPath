/**
 * Seed — System Design module M11: Case Studies VI (more large-scale designs):
 * Airbnb/Booking, Distributed Search Engine, Comment System, Metrics/
 * Monitoring, A/B Testing, Top-K/Trending, Distributed Tracing, Tinder.
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases6.js   ·   npm: npm run seed:sysd-cases6
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m11";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 11,
  name: "Case Studies VI — More Systems", slug: "case-studies-6",
  description: "Eight more large-scale designs: Airbnb/Booking reservations at scale, a distributed search engine, a comment system, a metrics/monitoring system, an A/B-testing platform, a Top-K/trending service, distributed tracing, and Tinder.",
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
  T("sysd_m11_t1", 1, "Design Airbnb / Booking.com", "design-airbnb-booking",
    ["case-study", "reservation", "search", "concurrency"],
    "Build lodging reservations at scale: search listings by location/dates/filters, and book without ever double-booking a property for overlapping dates — across millions of listings and concurrent bookers. What's the search path and the booking guard?",
    "Search is a geo + availability + filter query (a search index / geospatial index, NOT a live scan), with availability often precomputed. Booking is the half-open date-overlap reservation with an ATOMIC guard (no double-book) and a timed hold — the hotel design at scale. Listings, calendars, and bookings are separate, sharded data.",
    [
      { kind: "concept", heading: "Two distinct problems: search vs book",
        body: "Searching ('places in Goa, Jun 10–14, 2 guests, pool') is a read-heavy query over millions of listings with geo + availability + many filters. Booking is a write needing strict correctness (no double-booking). Design them separately: a search/serving layer optimized for fast filtered reads, and a transactional booking path optimized for correctness." },
      { kind: "concept", heading: "Search at scale",
        body: "You can't scan all listings per query. Use a SEARCH INDEX (Elasticsearch-style) over listings with a geospatial component (geohash/quadtree — the proximity idea) plus filters; AVAILABILITY for the date range is the tricky filter — often precompute/cache per-listing availability calendars so the search can quickly exclude booked dates. Rank results (price, rating, relevance). Heavily cached; read-replicas." },
      { kind: "concept", heading: "Booking without double-booking",
        body: "The correctness crux: never confirm two overlapping bookings for the same property. Same as the hotel design — half-open date ranges [checkIn, checkOut), an overlap check, and an ATOMIC reserve (DB transaction with an exclusion constraint / lock / optimistic version) so concurrent bookers can't both win the same dates. A HELD state with timeout covers the payment window." },
      { kind: "concept", heading: "Consistency & follow-ups",
        body: "Search availability can be slightly stale (eventually consistent — a recently-booked place might briefly appear), but the BOOKING transaction must be strongly consistent and authoritative — it's fine for search to be optimistic and the final booking to re-validate atomically. Follow-ups: 'instant book vs request', 'pricing/dynamic rates', 'cancellations & refunds', 'reviews', 'host calendar sync'. Signal: separate search (index + geo + cached availability, eventually consistent) from booking (atomic overlap reserve + hold, strongly consistent)." },
    ],
    "Airbnb at scale tests separating an eventually-consistent search path (search + geo index + cached availability) from a strongly-consistent booking path (atomic date-overlap reserve + timed hold, no double-book). Search can be optimistic; the booking transaction is authoritative.",
    ["Scanning listings live for search instead of a search/geo index with cached availability.",
     "Non-atomic booking that double-books overlapping dates (closed ranges also cause false overlaps).",
     "Demanding strong consistency for search (vs accepting it only for the booking transaction)."],
    0.6, { type: "Search vs book", description: "Search: query → search index + geo + cached availability (eventually consistent) → ranked listings. Book: atomic date-overlap reserve + timed HELD state (strongly consistent, no double-book).", alt: "Airbnb split into an eventually-consistent search path and a strongly-consistent booking path." }),

  T("sysd_m11_t2", 2, "Design a Distributed Search Engine", "design-search-engine",
    ["case-study", "inverted-index", "ranking", "sharding"],
    "Build web search: crawl pages, index them, and return the most relevant ranked results for a query in milliseconds — over billions of documents. What structure makes 'which docs contain these words' instant, and how is it served at scale?",
    "An INVERTED INDEX (term → sorted list of doc ids) makes keyword lookup instant; the index is SHARDED across servers (by document or term), each shard returns top candidates, results are merged and RANKED (relevance + signals like PageRank). A separate crawling + indexing pipeline builds the index offline. Query: parse → per-shard lookup → merge/rank → fetch.",
    [
      { kind: "concept", heading: "The inverted index",
        body: "Scanning billions of documents per query is impossible. An INVERTED INDEX maps each term → a posting list of the documents containing it (often with positions + frequencies). A query 'cat food' intersects the posting lists for 'cat' and 'food' to find candidate docs — fast set operations on precomputed lists. This is the core structure of every search engine (and reused in the email/Slack search designs)." },
      { kind: "concept", heading: "Sharding the index",
        body: "The index is far too big for one machine, so SHARD it. Document-partitioned (each shard indexes a subset of docs; every query fans out to all shards, each returns its top-k, then merge) — the common choice, scales with corpus size. Or term-partitioned (each shard owns some terms). Each shard is replicated for availability + read throughput. A query scatters to shards and gathers." },
      { kind: "concept", heading: "Ranking",
        body: "Candidates must be ordered by RELEVANCE, not just 'contains the words'. Combine textual relevance (TF-IDF / BM25 — term frequency vs how rare the term is) with query-independent signals (PageRank/authority, freshness, click signals) and increasingly ML ranking models. Often a cheap first-pass ranks many candidates, then an expensive model re-ranks the top few — the retrieval→ranking funnel, like the recommender." },
      { kind: "concept", heading: "Crawling/indexing & follow-ups",
        body: "A separate offline pipeline CRAWLS the web (the web-crawler design), processes pages (parse, dedupe, extract links), and builds/updates the inverted index in batch — decoupled from low-latency serving. Heavily cached (popular queries). Follow-ups: 'typo tolerance / synonyms', 'autocomplete' (the typeahead design), 'personalization', 'index freshness'. Signal: inverted index + sharding (scatter-gather) + relevance ranking (BM25 + signals) + offline crawl/index pipeline." },
    ],
    "A search engine is the inverted-index design: term→posting-list for instant lookup, sharded with scatter-gather, ranked by relevance (BM25 + PageRank/ML), fed by an offline crawl/index pipeline. The two-pass cheap-then-expensive ranking mirrors the recommender funnel.",
    ["Scanning documents per query instead of an inverted index.",
     "Ignoring sharding/scatter-gather for a billion-doc index.",
     "Returning matches without relevance ranking (BM25 + authority signals)."],
    0.6, { type: "Search architecture", description: "Offline: crawl → index → inverted index (sharded). Query: parse → scatter to shards → each returns top-k from posting lists → merge → rank (BM25 + signals) → results.", alt: "Distributed search: sharded inverted index with scatter-gather and relevance ranking." }),

  T("sysd_m11_t3", 3, "Design a Comment System", "design-comment-system",
    ["case-study", "tree", "ranking", "read-heavy"],
    "Build comments for YouTube/Reddit: nested replies (threads), millions of comments on hot posts, ranked by best/top/new, with live updates. How do you store a reply tree and load it efficiently?",
    "Comments form a TREE (each has a parent); store with a parent pointer (+ a path/materialized-path or thread-root id for efficient subtree fetch). Load top-level comments paginated, lazy-load reply subtrees on demand. Ranking (top/best/new) sorts within a level. Read-heavy → cache hot threads; counts via the distributed-counter pattern.",
    [
      { kind: "concept", heading: "The comment tree",
        body: "A comment has a parent (null = top-level); replies nest arbitrarily deep → a TREE per post. Naive recursive fetching (a query per node) is N+1 death. Store a parent_id plus a MATERIALIZED PATH (e.g. '/root/c12/c45') or a thread-root id so you can fetch an entire subtree with one indexed range query and reconstruct the tree in memory. Deep nesting is usually flattened/capped in the UI." },
      { kind: "concept", heading: "Loading efficiently",
        body: "Hot posts have millions of comments — don't load all. PAGINATE top-level comments (cursor-based), and LAZY-LOAD reply subtrees only when expanded ('view 24 replies'). Each load is a bounded query. This keeps payloads small and matches how users actually read. Order within a level by the chosen ranking." },
      { kind: "concept", heading: "Ranking",
        body: "Sort options: NEW (timestamp), TOP (score = upvotes−downvotes), BEST (a confidence-weighted score, e.g. Wilson score, so a 5/5 doesn't beat 200/210 unfairly), CONTROVERSIAL. Vote counts are high-write on popular comments → use the distributed-counter pattern (sharded/approximate). Precompute/cached rank for hot threads." },
      { kind: "concept", heading: "Scale & follow-ups",
        body: "Read-heavy (far more reads than comments posted) → cache rendered hot threads (CDN/edge for the most popular). Live updates (new comments appearing) via the realtime fanout (Slack-like) or polling. Follow-ups: 'spam/moderation' (a pipeline + the fraud-style classifier), 'edit/delete', 'mentions/notifications', 'flat vs threaded'. Signal: comment tree (parent + materialized path) + paginated/lazy subtree loads + level ranking (Wilson/score) + sharded vote counters + caching." },
    ],
    "A comment system tests storing a reply tree (parent + materialized path) for one-query subtree fetch, paginated/lazy loading, level ranking (top/best via Wilson score), sharded vote counters, and heavy caching for read-heavy hot threads.",
    ["Recursive per-node fetching (N+1) instead of a materialized path / subtree range query.",
     "Loading an entire million-comment thread instead of paginating + lazy-loading replies.",
     "Naive upvote counts (a hot-row counter) instead of the sharded-counter pattern."],
    0.5),

  T("sysd_m11_t4", 4, "Design a Metrics / Monitoring System", "design-metrics-monitoring",
    ["case-study", "time-series", "ingestion", "alerting"],
    "Build Prometheus/Datadog: collect metrics from thousands of servers, store huge volumes of time-stamped numbers, answer 'CPU over the last hour' fast, and fire alerts. Why is a normal DB wrong here, and what stores time series?",
    "Metrics are TIME-SERIES (metric+labels → stream of (timestamp, value)); store in a purpose-built TIME-SERIES DB optimized for high-write append + time-range reads + downsampling/retention, not a relational DB. Ingest via push or pull (scrape); pre-aggregate/rollup older data; an alerting engine evaluates rules over the series. It's a high-write, append-heavy, time-windowed system.",
    [
      { kind: "concept", heading: "Why not a normal DB",
        body: "Monitoring generates a relentless, high-volume, append-only stream of numeric samples (millions of series × frequent samples). A relational DB chokes: the write rate, the storage of mostly-similar timestamped numbers, and time-range aggregations are all the wrong fit. You need a TIME-SERIES DATABASE (TSDB) built for exactly this." },
      { kind: "concept", heading: "The time-series model & TSDB",
        body: "A metric is identified by a name + LABELS (cpu_usage{host=web1,region=us}); its data is a sequence of (timestamp, value). A TSDB stores these append-only, COMPRESSES heavily (delta-of-delta on timestamps, XOR on values — adjacent samples are similar), and indexes by time + labels for fast range scans. Writes are appends (cheap); reads are time-window aggregations (avg/p99 over the last hour)." },
      { kind: "concept", heading: "Ingestion: push vs pull",
        body: "PULL (Prometheus scrapes targets' /metrics endpoints on an interval — the monitor controls load, easy service discovery) vs PUSH (agents send metrics to a collector — better for short-lived jobs / through firewalls). A queue/buffer absorbs ingestion spikes. High cardinality (too many label combinations) is the classic scaling pitfall — it explodes the series count." },
      { kind: "concept", heading: "Rollups, retention, alerting & follow-ups",
        body: "You can't keep raw high-resolution data forever → DOWNSAMPLE/rollup old data (1s → 1m → 1h averages) and apply RETENTION (drop or archive). An ALERTING engine periodically evaluates rules (PromQL-style queries: 'p99 latency > 500ms for 5m') and fires to a notifier (dedupe/group/route — the notification system). Dashboards query the TSDB. Follow-ups: 'high cardinality', 'long-term storage' (object store), 'distributed/HA TSDB'. Signal: time-series model + TSDB (compressed, append-heavy) + push/pull ingest + rollups/retention + rule-based alerting." },
    ],
    "A monitoring system tests time-series design: a purpose-built compressed TSDB (not a relational DB) for append-heavy writes + time-range reads, push/pull ingestion, downsampling/retention, and a rule-evaluation alerting engine. High cardinality is the key pitfall.",
    ["Using a relational DB for high-volume append-only time series.",
     "Ignoring downsampling/retention (keeping all raw high-resolution data forever).",
     "Missing the high-cardinality pitfall (label explosion blows up series count)."],
    0.6, { type: "Monitoring pipeline", description: "Targets → ingest (pull scrape / push) → TSDB (compressed time-series by name+labels) → queries/dashboards + alerting engine evaluates rules → notifier. Old data downsampled/retained.", alt: "Metrics pipeline: ingestion into a time-series DB with rollups, dashboards, and rule-based alerting." }),

  T("sysd_m11_t5", 5, "Design an A/B Testing Platform", "design-ab-testing",
    ["case-study", "assignment", "metrics", "experimentation"],
    "Build an experimentation platform: assign users to variants (control vs treatment) consistently, serve the right variant with low latency, and measure which performs better with statistical rigor. How do you assign users so it's stable, fast, and unbiased?",
    "Assign users to variants by HASHING a stable id (user id + experiment key) into buckets — deterministic (same user → same variant every time), low-latency (no lookup, computed locally), and random/unbiased across users. Config defines experiments + traffic split (served via a fast config service). Exposure + outcome events stream to an analysis pipeline computing metrics + significance.",
    [
      { kind: "concept", heading: "Consistent, fast assignment",
        body: "A user must get the SAME variant on every request (consistency — flipping would ruin the experiment and the UX) and assignment must be instant (it's on the request path). The trick: deterministically HASH (userId + experimentId) → a number → bucket by the configured split (e.g. hash%100 < 50 → control). No database lookup needed — it's computed locally and reproducibly. Hashing with the experiment id as salt makes assignments independent across experiments." },
      { kind: "concept", heading: "Experiment config",
        body: "Experiments are defined as config: variants, traffic allocation (50/50, or 5% ramp), targeting (only logged-in / region), start/end. This config is served by a low-latency CONFIG/feature-flag service (cached at the edge/SDK) so the app reads it cheaply. Ramping traffic up gradually (1%→50%) limits blast radius — overlaps with feature flags." },
      { kind: "concept", heading: "Measurement & rigor",
        body: "Log an EXPOSURE event when a user is assigned/sees a variant, and OUTCOME events (clicks, conversions, revenue) — these stream into an analytics pipeline (the ad-click-aggregator style). Compute per-variant metrics and STATISTICAL SIGNIFICANCE (don't declare a winner on noise — p-values / confidence intervals, adequate sample size). Guard against peeking (deciding early inflates false positives)." },
      { kind: "concept", heading: "Pitfalls & follow-ups",
        body: "'Sample ratio mismatch' (assignment is buggy if the 50/50 split isn't ~50/50 in data — a key sanity check). 'Overlapping experiments' (independent hashing / mutually-exclusive layers). 'Carryover/network effects'. 'Guardrail metrics' (don't ship a winner that tanks another metric). Follow-ups: 'multi-armed bandits' (adaptive allocation), 'holdouts'. Signal: deterministic hash-bucket assignment + config-driven splits + exposure/outcome event pipeline + statistical-significance analysis." },
    ],
    "An A/B platform tests deterministic hash-based assignment (consistent, fast, unbiased, salted by experiment), config-driven traffic splits, an exposure/outcome event pipeline, and statistically rigorous analysis. Sample-ratio-mismatch and peeking are the classic pitfalls.",
    ["Random per-request assignment (a user flips variants) or a DB lookup on the hot path instead of deterministic hashing.",
     "Declaring a winner without statistical significance / adequate sample size (peeking).",
     "Not salting the hash per experiment, so overlapping experiments correlate."],
    0.6, { type: "A/B assignment", description: "Request → hash(userId + experimentId) % 100 → bucket by configured split → variant (deterministic, no lookup). Exposure + outcome events → analytics → per-variant metrics + significance.", alt: "A/B testing: deterministic hash-bucket variant assignment feeding a metrics/significance pipeline." }),

  T("sysd_m11_t6", 6, "Design a Top-K / Trending System", "design-topk-trending",
    ["case-study", "heavy-hitters", "count-min-sketch", "streaming"],
    "Find the top-K trending items (hashtags, search terms, products) from a massive real-time event stream, where keeping an exact count for every distinct item won't fit in memory. How do you find heavy hitters approximately?",
    "Exact per-item counts over billions of distinct items don't fit, so use PROBABILISTIC structures: a Count-Min Sketch estimates each item's frequency in fixed memory, paired with a min-heap of the current top-K. Per time-window (trending = recent), with decay. Approximate but bounded-memory; a batch path can compute exact top-K for correction.",
    [
      { kind: "concept", heading: "Why exact counting fails",
        body: "The stream has a huge number of DISTINCT items (every hashtag, query, product). A hashmap of item→exact count would need memory proportional to the number of distinct items — too much at scale, especially per time window. Top-K / 'heavy hitters' is a classic streaming problem solved with APPROXIMATION in bounded memory." },
      { kind: "concept", heading: "Count-Min Sketch + heap",
        body: "A COUNT-MIN SKETCH is a 2D array of counters with several hash functions: to count an item, increment one counter per row (by its hashes); to estimate its frequency, take the MIN of those counters (collisions only ever overestimate, so min is the tightest). Fixed memory regardless of item count. Pair it with a MIN-HEAP of size K holding the current top items: on each event, update the sketch, and if the item's estimate exceeds the heap's minimum, insert/replace. Gives approximate top-K cheaply." },
      { kind: "concept", heading: "Time windows & decay",
        body: "'Trending' means RECENT popularity, not all-time — so count over a sliding/tumbling time WINDOW (e.g. last hour) and let old counts DECAY (or use windowed sketches, resetting/rolling per window). This is the streaming-aggregation idea (ad-click aggregator) applied to ranking; combine with the leaderboard's sorted-set thinking for serving." },
      { kind: "concept", heading: "Scale & follow-ups",
        body: "Distribute: each ingestion node keeps a local sketch + top-K; periodically MERGE sketches (they're additive) and top-K candidates at an aggregator for a global view. A batch path can compute exact top-K from the raw log to correct drift (Lambda-style). Follow-ups: 'exact counts for the few that matter', 'spam/bot inflation', 'per-region trending'. Signal: Count-Min Sketch (bounded-memory frequency) + min-heap top-K + time windows/decay + mergeable distributed sketches + optional batch correction." },
    ],
    "A Top-K/trending system tests approximate heavy-hitters: a Count-Min Sketch for bounded-memory frequency estimation + a min-heap for the running top-K, over decaying time windows, with mergeable per-node sketches and optional batch correction. Exact counting is the wrong baseline.",
    ["Keeping an exact count per distinct item (doesn't fit in memory at scale).",
     "Computing all-time popularity instead of windowed/decaying counts for 'trending'.",
     "Not knowing Count-Min Sketch (+ heap) is the standard heavy-hitters approach."],
    0.6, { type: "Top-K streaming", description: "Event stream → Count-Min Sketch (bounded-memory frequency estimate, take min over hashes) + min-heap of top-K. Windowed/decayed for 'trending'; per-node sketches merge for a global view.", alt: "Top-K via a Count-Min Sketch feeding a min-heap, over decaying time windows." }),

  T("sysd_m11_t7", 7, "Design Distributed Tracing", "design-distributed-tracing",
    ["case-study", "observability", "spans", "sampling"],
    "A single request flows through dozens of microservices; when it's slow, you need to see the whole path and where time went. How do you stitch one request's journey across services, at high volume without storing everything?",
    "Propagate a TRACE ID (+ span ids) through every service call; each service emits a SPAN (operation, start/end, parent span, tags). Spans sharing a trace id are assembled into a tree showing the end-to-end path + latency per hop. SAMPLE (keep a fraction, or tail-sample interesting traces) to control volume; collect → store → query/visualize (Jaeger/Zipkin).",
    [
      { kind: "concept", heading: "Trace context propagation",
        body: "The key idea: when a request enters the system, assign a unique TRACE ID; propagate it (plus the current SPAN ID) through every downstream call via headers (W3C Trace Context / B3). Each service reads the incoming context, creates child spans, and passes its span id onward. This is what lets you correlate work across process boundaries — without propagation, you just have disconnected per-service logs." },
      { kind: "concept", heading: "Spans form a tree",
        body: "A SPAN represents one unit of work (an operation in one service): trace id, span id, PARENT span id, operation name, start/end timestamps, and tags (status, db query, etc.). All spans with the same trace id, linked by parent ids, assemble into a TREE/DAG — the end-to-end timeline of the request, showing which service called which and how long each took (the critical path / where latency was spent)." },
      { kind: "concept", heading: "Sampling to control volume",
        body: "Tracing every request at scale is enormous data + overhead. SAMPLE: head-based (decide at the start to keep, e.g., 1% — simple, but may miss rare errors) or TAIL-based (buffer spans, decide after the trace completes to keep slow/error traces — captures the interesting ones at higher cost). Sampling is the central trade between observability coverage and cost/overhead." },
      { kind: "concept", heading: "Collection & follow-ups",
        body: "Services send spans (async, via an agent/collector + queue so tracing never blocks the request) to a backend that assembles traces, STORES them (often a columnar/search store, with retention), and serves a UI to visualize the trace tree and aggregate latencies. Follow-ups: 'correlate with logs/metrics' (the three pillars; share trace ids in logs), 'clock skew across hosts', 'high-cardinality'. Signal: trace-id propagation + parent-linked spans → trace tree + sampling (head/tail) + async collection/storage/visualization." },
    ],
    "Distributed tracing tests cross-service correlation: propagate a trace id, emit parent-linked spans that assemble into a per-request tree (latency per hop), and sample (head/tail) to control volume. Async collection keeps tracing off the critical path.",
    ["No trace-id propagation across services (just disconnected per-service logs).",
     "Tracing 100% of requests at scale instead of sampling (head/tail).",
     "Emitting spans synchronously, adding latency to the traced request."],
    0.6, { type: "Trace tree", description: "Request → trace id propagated via headers; each service emits a span (trace id, span id, parent). Same-trace spans assemble into a tree (latency per hop). Sampled, async-collected, stored, visualized.", alt: "Distributed tracing: propagated trace id and parent-linked spans forming a per-request tree." }),

  T("sysd_m11_t8", 8, "Design Tinder (Matching)", "design-tinder",
    ["case-study", "geo", "matching", "recommendation"],
    "Build Tinder: show nearby profiles to swipe on, record likes/passes, and create a MATCH when two users like each other — for millions of users. How do you find nearby candidates and detect mutual likes efficiently?",
    "Find nearby candidates with a GEOSPATIAL index (geohash/quadtree) plus preference filters, served as a pre-built recommendation queue (the candidate-generation idea). Record each swipe; a MATCH is a mutual like — check on a right-swipe whether the other user already liked you (a fast lookup), and if so create a match + notify. Swipes are high-write; matches are read on demand.",
    [
      { kind: "concept", heading: "Finding nearby candidates",
        body: "The feed is 'people near me matching my preferences (age, distance, gender)'. Use a GEOSPATIAL index (geohash/quadtree — the proximity design) to fetch nearby users, then filter by preferences and exclude already-swiped profiles. Because users swipe fast, PRE-BUILD a recommendation queue/deck per user (candidate generation, like the recommender) and serve from it, refilling in the background — rather than computing per swipe." },
      { kind: "concept", heading: "Recording swipes",
        body: "Every swipe (like/pass) is a write: store (swiper, swipee, decision). This is high-volume and write-heavy (billions of swipes). Store efficiently (sharded by user); passes can often be stored more cheaply or with TTL, likes must be durable (they create matches). Idempotency so a double-tap doesn't double-record." },
      { kind: "concept", heading: "Detecting a match",
        body: "A MATCH = mutual like. The crux: when user A swipes right on B, check whether B has ALREADY liked A — a fast point lookup on the likes store (e.g. does key (B,A) exist?). If yes → create a match record for both and NOTIFY them (the notification system). If no → just record A→B; the match will trigger later if B reciprocates. No expensive scanning — it's an O(1) reverse-lookup per right-swipe." },
      { kind: "concept", heading: "Scale & follow-ups",
        body: "Read the geo + recommendations to build decks; write the swipes; matches and chat (a messaging system) come after. Heavily sharded by user; caching for the active geo areas. Follow-ups: 'ranking the deck' (ELO/ML for desirability — recommendation), 'don't reshow passed profiles', 'location updates', 'fake accounts/abuse', 'undo swipe'. Signal: geospatial candidate retrieval + pre-built recommendation deck + write-heavy swipe store + O(1) reverse-lookup for mutual-like matches + notify." },
    ],
    "Tinder tests geospatial candidate retrieval into a pre-built recommendation deck, a write-heavy swipe store, and — the key insight — detecting a match via an O(1) reverse-lookup ('did they already like me?') on each right-swipe, not scanning. Deck ranking is the recommendation follow-up.",
    ["Computing candidates per swipe instead of a pre-built geo+preference recommendation deck.",
     "Scanning to find matches instead of an O(1) reverse-lookup on a right-swipe.",
     "Treating swipes as low-volume (they're billions, write-heavy) / re-showing already-swiped profiles."],
    0.5, { type: "Match detection", description: "Feed: geo index + preferences → pre-built deck. Swipe right A→B: check if B→A like already exists (O(1) reverse-lookup). If yes → create match + notify both; else record A→B.", alt: "Tinder: geospatial deck plus an O(1) reverse-lookup to detect mutual-like matches." }),
];

const EXERCISES = [
  // Airbnb
  pm({ topicId: "sysd_m11_t1", exerciseId: "sysd_m11_t1_pm_1", position: 1, level: "hard", title: "Search vs book consistency",
    scenario: "Which split correctly balances consistency for Airbnb?",
    options: ["Search can be eventually consistent; the booking transaction must be strongly consistent", "Both must be strongly consistent", "Both can be eventually consistent", "Neither needs consistency"], correct: "Search can be eventually consistent; the booking transaction must be strongly consistent",
    explanation: "It's fine for search to show slightly-stale availability; the final booking re-validates atomically and authoritatively." }),
  pm({ topicId: "sysd_m11_t1", exerciseId: "sysd_m11_t1_pm_2", position: 2, level: "hard", title: "No double-book",
    scenario: "Preventing two overlapping bookings for the same property requires…",
    options: ["An atomic date-overlap reserve (transaction/constraint) + half-open ranges", "An in-memory availability check then save", "Closed date ranges", "Trusting the search index"], correct: "An atomic date-overlap reserve (transaction/constraint) + half-open ranges",
    explanation: "Same as the hotel design: atomic overlap reservation with half-open [checkIn, checkOut) ranges." }),
  pm({ topicId: "sysd_m11_t1", exerciseId: "sysd_m11_t1_pm_3", position: 3, level: "medium", title: "Search at scale",
    scenario: "Searching millions of listings by location + dates + filters uses…",
    options: ["A search index + geo index + cached availability (not a live scan)", "A scan of all listings per query", "The booking table directly", "A single SQL LIKE"], correct: "A search index + geo index + cached availability (not a live scan)",
    explanation: "A search/geo index with cached per-listing availability serves fast filtered reads without scanning." }),
  // Search engine
  pm({ topicId: "sysd_m11_t2", exerciseId: "sysd_m11_t2_pm_1", position: 1, level: "hard", title: "Core structure",
    scenario: "Finding which documents contain a set of words instantly uses…",
    options: ["An inverted index (term → posting list of doc ids)", "A scan of all documents", "A relational join", "A hash of full documents"], correct: "An inverted index (term → posting list of doc ids)",
    explanation: "An inverted index maps terms to doc-id posting lists; queries intersect lists — the core of search." }),
  pm({ topicId: "sysd_m11_t2", exerciseId: "sysd_m11_t2_pm_2", position: 2, level: "hard", title: "Billion-doc index",
    scenario: "An index too big for one machine is served by…",
    options: ["Sharding the index + scatter-gather (each shard returns top-k, then merge)", "One huge server", "Caching only", "A single replica"], correct: "Sharding the index + scatter-gather (each shard returns top-k, then merge)",
    explanation: "Document-partitioned shards each return their top-k; results are merged — scales with corpus size." }),
  pm({ topicId: "sysd_m11_t2", exerciseId: "sysd_m11_t2_pm_3", position: 3, level: "medium", title: "Ordering",
    scenario: "Candidate documents are ordered by…",
    options: ["Relevance ranking (BM25/TF-IDF + signals like PageRank)", "Document id", "Insertion time only", "Random"], correct: "Relevance ranking (BM25/TF-IDF + signals like PageRank)",
    explanation: "Textual relevance (BM25) plus authority/freshness signals (and ML re-ranking) order results." }),
  // Comment system
  pm({ topicId: "sysd_m11_t3", exerciseId: "sysd_m11_t3_pm_1", position: 1, level: "hard", title: "Store the tree",
    scenario: "Fetching a comment's whole reply subtree in one query (not N+1) uses…",
    options: ["A materialized path / thread-root id (+ parent_id) with a range query", "A recursive query per node", "A flat list with no parent", "A separate table per comment"], correct: "A materialized path / thread-root id (+ parent_id) with a range query",
    explanation: "A materialized path lets one indexed range query fetch a subtree, rebuilt into a tree in memory." }),
  pm({ topicId: "sysd_m11_t3", exerciseId: "sysd_m11_t3_pm_2", position: 2, level: "medium", title: "Hot post",
    scenario: "A post has a million comments. How are they loaded?",
    options: ["Paginate top-level + lazy-load reply subtrees on expand", "Load all at once", "Only the newest one", "Randomly sampled"], correct: "Paginate top-level + lazy-load reply subtrees on expand",
    explanation: "Cursor-paginate top-level comments and lazy-load replies only when expanded — bounded payloads." }),
  pm({ topicId: "sysd_m11_t3", exerciseId: "sysd_m11_t3_pm_3", position: 3, level: "medium", title: "Vote counts",
    scenario: "Upvote counts on a viral comment should use…",
    options: ["The distributed-counter pattern (sharded/approximate)", "A single row UPDATE +1", "A new row per vote read on display", "No counting"], correct: "The distributed-counter pattern (sharded/approximate)",
    explanation: "Hot vote counts are a write hotspot; shard the counter (or approximate) as in the distributed-counter design." }),
  // Metrics
  pm({ topicId: "sysd_m11_t4", exerciseId: "sysd_m11_t4_pm_1", position: 1, level: "hard", title: "Right store",
    scenario: "High-volume timestamped metrics should be stored in…",
    options: ["A time-series database (TSDB), compressed + append-optimized", "A relational DB", "A graph database", "A cache only"], correct: "A time-series database (TSDB), compressed + append-optimized",
    explanation: "TSDBs handle the append-heavy writes, heavy compression, and time-range reads a relational DB can't." }),
  pm({ topicId: "sysd_m11_t4", exerciseId: "sysd_m11_t4_pm_2", position: 2, level: "medium", title: "Old data",
    scenario: "You can't keep raw high-resolution metrics forever. So you…",
    options: ["Downsample/rollup old data and apply retention", "Keep everything at full resolution", "Delete everything daily", "Store it twice"], correct: "Downsample/rollup old data and apply retention",
    explanation: "Roll up 1s→1m→1h as data ages and drop/archive past retention to bound storage." }),
  pm({ topicId: "sysd_m11_t4", exerciseId: "sysd_m11_t4_pm_3", position: 3, level: "hard", title: "Classic pitfall",
    scenario: "What's the classic scaling pitfall in a metrics system?",
    options: ["High cardinality — too many label combinations explode the series count", "Too few metrics", "Reads being too fast", "Using labels at all"], correct: "High cardinality — too many label combinations explode the series count",
    explanation: "Each unique label combination is a separate series; unbounded labels (e.g. user id) blow up the TSDB." }),
  // A/B testing
  pm({ topicId: "sysd_m11_t5", exerciseId: "sysd_m11_t5_pm_1", position: 1, level: "hard", title: "Stable assignment",
    scenario: "How do you assign a user to a variant consistently and with low latency?",
    options: ["Deterministically hash (userId + experimentId) into a bucket", "Random per request", "A DB lookup on every request", "Round-robin per request"], correct: "Deterministically hash (userId + experimentId) into a bucket",
    explanation: "Hashing a stable id is deterministic (same user → same variant), computed locally (fast), and unbiased." }),
  pm({ topicId: "sysd_m11_t5", exerciseId: "sysd_m11_t5_pm_2", position: 2, level: "medium", title: "Declaring a winner",
    scenario: "Before declaring a variant the winner, you need…",
    options: ["Statistical significance with adequate sample size (avoid peeking)", "A few hundred users for an hour", "Whichever is ahead right now", "The product manager's preference"], correct: "Statistical significance with adequate sample size (avoid peeking)",
    explanation: "Without significance and enough samples you're reading noise; early peeking inflates false positives." }),
  pm({ topicId: "sysd_m11_t5", exerciseId: "sysd_m11_t5_pm_3", position: 3, level: "medium", title: "Sanity check",
    scenario: "A 50/50 experiment shows 60/40 in the data. This signals…",
    options: ["Sample ratio mismatch — a bug in assignment/logging", "A successful test", "Statistical significance", "Nothing to worry about"], correct: "Sample ratio mismatch — a bug in assignment/logging",
    explanation: "If the observed split deviates from the configured split, assignment or logging is broken — results are untrustworthy." }),
  // Top-K
  pm({ topicId: "sysd_m11_t6", exerciseId: "sysd_m11_t6_pm_1", position: 1, level: "hard", title: "Bounded-memory frequency",
    scenario: "Estimating item frequencies over a huge-cardinality stream in fixed memory uses…",
    options: ["A Count-Min Sketch", "A hashmap of exact counts", "A sorted array", "A B-tree"], correct: "A Count-Min Sketch",
    explanation: "A Count-Min Sketch estimates frequencies in fixed memory (take the min over its hash counters)." }),
  pm({ topicId: "sysd_m11_t6", exerciseId: "sysd_m11_t6_pm_2", position: 2, level: "hard", title: "Keep the top-K",
    scenario: "Maintaining the current top-K alongside the sketch uses…",
    options: ["A min-heap of size K", "A max-heap of all items", "A full sort each event", "A queue"], correct: "A min-heap of size K",
    explanation: "A size-K min-heap lets you cheaply replace the smallest when a new estimate exceeds it." }),
  pm({ topicId: "sysd_m11_t6", exerciseId: "sysd_m11_t6_pm_3", position: 3, level: "medium", title: "Trending = recent",
    scenario: "'Trending' (not all-time popular) requires…",
    options: ["Counting over time windows with decay", "All-time cumulative counts", "A single snapshot", "Ignoring time"], correct: "Counting over time windows with decay",
    explanation: "Trending reflects recent surges, so count over sliding/tumbling windows and decay old counts." }),
  // Distributed tracing
  pm({ topicId: "sysd_m11_t7", exerciseId: "sysd_m11_t7_pm_1", position: 1, level: "hard", title: "Correlate across services",
    scenario: "What stitches one request's path across many microservices?",
    options: ["Propagating a trace id (+ span ids) through every call", "Per-service logs with no correlation", "A shared database", "Synchronized clocks alone"], correct: "Propagating a trace id (+ span ids) through every call",
    explanation: "A propagated trace id lets you correlate spans from every service into one request's journey." }),
  pm({ topicId: "sysd_m11_t7", exerciseId: "sysd_m11_t7_pm_2", position: 2, level: "medium", title: "Assemble the picture",
    scenario: "Spans sharing a trace id, linked by parent span ids, form…",
    options: ["A tree showing the end-to-end path + latency per hop", "A flat unordered list", "A single number", "A hash table"], correct: "A tree showing the end-to-end path + latency per hop",
    explanation: "Parent-linked spans assemble into a trace tree revealing the critical path and where time was spent." }),
  pm({ topicId: "sysd_m11_t7", exerciseId: "sysd_m11_t7_pm_3", position: 3, level: "hard", title: "Control volume",
    scenario: "Tracing every request at scale is too much data. So you…",
    options: ["Sample (head- or tail-based)", "Trace nothing", "Store traces forever", "Trace only successes"], correct: "Sample (head- or tail-based)",
    explanation: "Sampling keeps a fraction; tail-sampling can prioritize slow/error traces — the coverage-vs-cost trade." }),
  // Tinder
  pm({ topicId: "sysd_m11_t8", exerciseId: "sysd_m11_t8_pm_1", position: 1, level: "hard", title: "Detect a match",
    scenario: "When A swipes right on B, how do you detect a match efficiently?",
    options: ["O(1) reverse-lookup: does B's like on A already exist?", "Scan all of A's likes for reciprocation", "Recompute all matches nightly", "Ask B in real time"], correct: "O(1) reverse-lookup: does B's like on A already exist?",
    explanation: "Check the likes store for the reverse key (B→A) on each right-swipe — O(1), no scanning; if present, it's a match." }),
  pm({ topicId: "sysd_m11_t8", exerciseId: "sysd_m11_t8_pm_2", position: 2, level: "medium", title: "Nearby profiles",
    scenario: "Building the swipe deck of nearby, eligible profiles uses…",
    options: ["A geospatial index + preference filters, pre-built into a deck", "Scanning all users per swipe", "Random users globally", "Only users you've already swiped"], correct: "A geospatial index + preference filters, pre-built into a deck",
    explanation: "Geo index finds nearby users; filter by preferences and pre-build a recommendation deck served fast." }),
  pm({ topicId: "sysd_m11_t8", exerciseId: "sysd_m11_t8_pm_3", position: 3, level: "medium", title: "Swipe volume",
    scenario: "Swipes are…",
    options: ["High-volume, write-heavy (store efficiently, sharded, idempotent)", "Rare events", "Read-only", "Computed, not stored"], correct: "High-volume, write-heavy (store efficiently, sharded, idempotent)",
    explanation: "Billions of swipes are write-heavy; shard by user, store likes durably, and make recording idempotent." }),
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
  console.log(`\nDone — M11 Case Studies VI seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
