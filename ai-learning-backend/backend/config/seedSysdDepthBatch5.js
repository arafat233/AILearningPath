/**
 * Seed — System Design DEPTH batch 5 (SD_DEPTH_STANDARD.md).
 *
 *   sysd_m10_t2  Distributed Counter            (module sysd_m10)
 *   sysd_m11_t6  Top-K / Trending System        (module sysd_m11)
 *   sysd_m13_t1  CDN                            (module sysd_m13)
 *   sysd_m13_t2  Log Aggregation (ELK)          (module sysd_m13)
 *   sysd_m11_t4  Metrics / Monitoring System    (module sysd_m11)
 *   sysd_m19_t1  Saga / Transaction Orchestrator(module sysd_m19)
 *
 * Idempotent upsert by id; recomputes totals. Verify:
 *   node config/auditSysdDepth.mjs --require sysd_m10_t2,sysd_m11_t6,sysd_m13_t1,sysd_m13_t2,sysd_m11_t4,sysd_m19_t1
 * Usage: node config/seedSysdDepthBatch5.js  ·  npm run seed:sysd-depth-5
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
  counter: svg(820, 240,
    box(20, 95, 110, 56, "Writers", "increments") +
    box(180, 95, 120, 56, "Hash / route", "spread", "#f0fdf4") +
    box(350, 25, 120, 44, "shard 0", "+1", "#fce7f3") +
    box(350, 92, 120, 44, "shard 1", "+1", "#fce7f3") +
    box(350, 159, 120, 44, "shard N", "+1", "#fce7f3") +
    box(540, 92, 130, 56, "Read = SUM", "of shards", "#ede9fe") +
    arrow(130, 123, 180, 123) +
    arrow(300, 110, 350, 47) + arrow(300, 123, 350, 114) + arrow(300, 136, 350, 181) +
    arrow(470, 47, 540, 110) + arrow(470, 181, 540, 130) +
    note(420, 230, "Spread increments across shards (no single hot row); sum on read")),
  topk: svg(820, 240,
    box(20, 95, 100, 56, "Event stream", "items") +
    box(170, 30, 170, 50, "shard: CMS + heap", "", "#fce7f3") +
    box(170, 100, 170, 50, "shard: CMS + heap", "", "#fce7f3") +
    box(170, 170, 170, 50, "shard: CMS + heap", "", "#fce7f3") +
    box(400, 95, 130, 56, "Merge", "local top-k", "#ede9fe") +
    box(580, 95, 130, 56, "Top-K result", "approx", "#f0fdf4") +
    arrow(120, 110, 170, 55) + arrow(120, 123, 170, 125) + arrow(120, 136, 170, 195) +
    arrow(340, 55, 400, 110) + arrow(340, 195, 400, 140) +
    arrow(530, 123, 580, 123) +
    note(420, 232, "Count-Min Sketch estimates freq in fixed memory; heap keeps top-k; merge shards")),
  cdn: svg(820, 230,
    box(20, 90, 90, 50, "User", "(geo)") +
    box(160, 90, 120, 50, "Edge POP", "cache", "#fce7f3") +
    box(330, 30, 130, 50, "Regional", "parent cache", "#fef9c3") +
    box(330, 150, 130, 50, "Origin", "source", "#f0fdf4") +
    box(540, 90, 150, 50, "Hit -> serve local", "", "#ede9fe") +
    arrow(110, 115, 160, 115, "anycast/DNS") +
    arrow(280, 105, 330, 60, "miss") + arrow(460, 55, 330, 165, "fill from origin", true) +
    arrow(280, 120, 540, 115, "hit") +
    note(420, 222, "Route to nearest edge; serve from cache; miss pulls from regional/origin")),
  logagg: svg(820, 240,
    box(20, 95, 100, 56, "Services", "+ agents") +
    box(170, 95, 120, 56, "Buffer", "Kafka", "#fef9c3") +
    box(320, 95, 130, 56, "Processors", "parse/enrich", "#f0fdf4") +
    box(490, 95, 140, 56, "Search index", "inverted (ES)", "#fce7f3") +
    box(670, 95, 120, 56, "Kibana", "query/alert", "#ede9fe") +
    arrow(120, 123, 170, 123, "ship") + arrow(290, 123, 320, 123) +
    arrow(450, 123, 490, 123, "index") + arrow(630, 123, 670, 123) +
    note(420, 215, "Collect -> buffer -> parse -> index (full-text) -> search; time-tiered retention")),
  metrics: svg(820, 240,
    box(20, 95, 100, 56, "Sources", "exporters") +
    box(170, 95, 130, 56, "Ingest", "scrape/push", "#f0fdf4") +
    box(340, 95, 150, 56, "TSDB", "append + rollups", "#fce7f3") +
    box(540, 30, 130, 50, "Dashboards", "range queries", "#ede9fe") +
    box(540, 150, 130, 50, "Alerting", "rules", "#fef9c3") +
    arrow(120, 123, 170, 123) + arrow(300, 123, 340, 123) +
    arrow(490, 110, 540, 60, "query") + arrow(490, 135, 540, 170, "eval") +
    note(420, 222, "Time-series writes -> TSDB (compressed, downsampled) -> queries + alerts; watch cardinality")),
  saga: svg(820, 250,
    box(20, 100, 120, 56, "Orchestrator", "saga state", "#f0fdf4") +
    box(190, 30, 120, 50, "Step 1", "reserve", "#fce7f3") +
    box(360, 30, 120, 50, "Step 2", "pay", "#fce7f3") +
    box(530, 30, 120, 50, "Step 3", "ship", "#fce7f3") +
    box(360, 150, 120, 50, "Compensate", "refund", "#fef9c3") +
    box(190, 150, 120, 50, "Compensate", "release", "#fef9c3") +
    arrow(140, 110, 190, 60, "start") +
    arrow(310, 55, 360, 55) + arrow(480, 55, 530, 55) +
    arrow(420, 80, 420, 150, "fail") + arrow(360, 175, 310, 175, "undo") +
    note(420, 240, "Each step has a compensating action; on failure, undo completed steps in reverse")),
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
  // ─────────────────────────── DISTRIBUTED COUNTER ─────────────────────────
  TT("sysd_m10", "sysd_m10_t2", 2, "Design a Distributed Counter", "design-distributed-counter",
    ["case-study", "counter", "sharding", "hotspot"],
    "A viral post needs its like/view count incremented hundreds of thousands of times per second and read constantly. A single UPDATE on one row serializes every increment behind one lock. How do you count at that write rate without a hotspot?",
    "Don't funnel all increments into one row. SHARD the counter into N sub-counters, route each increment to one shard (so writes spread across N rows/nodes), and SUM the shards on read. For even more throughput, BUFFER/coalesce increments in memory and flush periodically. When exact counts aren't required (unique views), use probabilistic structures (HyperLogLog). The crux is removing the single-row write hotspot while keeping reads cheap enough.",
    [
      C("requirements", "Requirements",
        "Functional: increment a counter for a key (likes, views, reactions) and read its current value; support many counters (one per post/video). Non-functional: very high WRITE throughput (a viral item can take 100k+ increments/sec on ONE key), low-latency reads, scalability across keys and within a hot key, durability (don't lose counts on a crash), and a stated accuracy requirement. Clarify exact vs approximate: a like count usually must be exact-ish, while 'unique viewers' can be approximate. The defining problem is the HOT KEY: a naive counter is a single row/cell, and concurrent increments serialize on its lock, capping throughput at one machine's write rate and creating contention. The whole design is about spreading that write load so a single popular counter doesn't become a bottleneck, while keeping reads (which now must combine the spread state) fast."),
      K("estimation", "Capacity estimation (with numbers)",
        "Hot key: a viral post ~= 100k increments/sec on ONE counter.\n  one row can do maybe ~1k-10k writes/sec -> a single row is 10-100x too slow\n  shard into N=100 sub-counters -> ~1k/sec each (comfortable)\nReads: a read now sums N shards -> cache the total (compute every ~1s) so reads\n  don't fan-in to 100 shards on every view.\nMany counters: most are cold (few writes) -> only HOT keys need sharding.\nTakeaway: shard the hot key across N to spread writes; cache the summed read;\ncold keys stay a single row. Accuracy requirement picks exact vs probabilistic."),
      C("hld", "High-level design",
        "Each counter is split into N SHARDS (sub-counters), e.g. counter:{key}:{shard}. An increment picks a shard (random or by writer id) and increments just that shard — so 100k increments/sec spread across N shards become ~100k/N per shard, eliminating the single-row hotspot. A read SUMS the N shards to get the total; because summing N shards per read is wasteful for a hot, frequently-read key, the total is periodically computed and CACHED (so reads return the cached value, eventually consistent within a second or two). To push write throughput even higher, application nodes can BUFFER increments locally and flush an aggregated delta periodically (coalescing). State is persisted durably (and replicated). Trace an increment: like event -> pick shard h -> INCR counter:post123:h -> (async) the cached total refreshes from the sum. Cold counters skip sharding entirely (one row). The pattern is fan-out writes + cached fan-in reads."),
      K("api", "API design",
        "increment(key, delta=1)   // routed to one of N shards for `key`\nget(key) -> value             // returns the cached sum of shards (eventually consistent)\n\nStorage ops (Redis-style):\n  INCRBY counter:{key}:{shard} delta        // shard = rand() % N  (writes spread)\n  read: SUM(GET counter:{key}:0..N-1)  -> cache as total:{key} (refresh ~1s)"),
      K("data_model", "Data model",
        "sharded counter:  counter:{key}:{shard} -> integer   (shard in 0..N-1)\ncached total:     total:{key} -> integer   (periodic sum of shards, for fast reads)\nshard count:      per-key N (hot keys get many shards; cold keys N=1)\ndurability:       persist counters (Redis AOF/replicas, or a durable store) + flush buffers\n(approximate variant) HyperLogLog per key for unique-count cardinality"),
      C("deep_dive", "Deep dive: sharded counters & write coalescing",
        "The core technique is removing the single point of contention. Instead of one row everyone increments (lock contention, serialized), keep N sub-counters and send each increment to ONE of them (chosen at random or by the writer's id), so writes are distributed across N rows/nodes and throughput scales ~N times. The total is just the SUM of the shards — you've traded a cheap read (one row) for a slightly more expensive read (sum N), which is the right trade because reads can be CACHED (compute the sum every second and serve that) while writes can't easily be. A second lever is WRITE COALESCING / batching: each app server keeps a local in-memory delta for a key and flushes the aggregate periodically (e.g. +500 once/sec instead of 500 individual increments), collapsing many increments into one storage write — hugely effective for the hottest keys, at the cost of a small delay and risk of losing un-flushed deltas on a crash (bounded, acceptable for counts). N is tunable per key: cold keys use N=1, hot keys scale N up."),
      C("deep_dive", "Deep dive: exact vs approximate & consistency",
        "Match the technique to the accuracy requirement. EXACT counts (likes, sales): sum the shards (or a durable atomic counter for cold keys); the count is accurate but eventually consistent if you cache the read or buffer writes (the displayed number lags reality by seconds — universally acceptable for social counters). APPROXIMATE counts trade accuracy for huge memory/throughput savings: HyperLogLog estimates the number of UNIQUE items (unique viewers of a video) in a tiny fixed amount of memory (a few KB for billions of items, ~2% error) instead of storing every viewer id; Count-Min Sketch estimates per-item frequencies in fixed memory. These probabilistic structures are the right call when 'about 4.2M views' is fine and storing exact membership would be prohibitively expensive. The consistency stance is the recurring theme: counters relax to EVENTUAL consistency (cached totals, buffered writes, probabilistic estimates) because a counter being off by a few for a second is harmless, and that relaxation is exactly what unlocks the write throughput."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The hot key is the entire bottleneck — solved by sharding (spread writes) + caching the summed read; without it a single popular counter caps at one machine's write rate. Read fan-in (summing N shards) is the cost of sharding — mitigated by caching the total, accepting eventual consistency. Buffering increments boosts throughput but risks losing un-flushed deltas on a crash (bounded loss, fine for counts; not for money). Durability: in-memory counters need persistence/replication or you lose counts on failure. Trade-offs: more shards (more write throughput, costlier reads) vs fewer; exact (sum shards, eventually consistent) vs approximate (HLL/CMS — tiny memory, small error); buffered writes (max throughput, slight loss/lag) vs write-through (durable, slower); cache total (fast reads, stale by seconds) vs read-time sum (fresh, expensive). Closing signal: shard the hot counter across N sub-counters, sum-and-cache on read, coalesce writes, and use probabilistic structures when approximate is acceptable."),
      C("deep_dive", "Deep dive: durability, scale & operations",
        "Operationally a counter must not silently lose counts and must scale per-key. Durability: if counters live in memory (Redis), enable persistence (AOF) and replicas so a failover doesn't reset to zero; or back them with a durable store and use the cache as an accelerator. Buffered/coalesced increments must flush before too much accumulates (bounded loss window) and on graceful shutdown. Adaptive sharding: detect hot keys (a counter taking heavy write traffic) and dynamically increase its shard count, while leaving the long tail of cold counters as single rows — most counters are cold, so don't pay sharding overhead everywhere. Read path: serve the cached total; refresh it on a short interval or on read-with-staleness-budget. Multi-region: per-region shard sets summed for a global view, accepting cross-region eventual consistency. Reset/windowed counters (e.g. likes today) use time-bucketed counter keys with TTL. Observability: write throughput per hot key, read staleness, flush lag, and shard balance are the SLOs. The spine holds: spread writes across shards, cache the summed read, coalesce, persist, and scale shards to the heat of each key."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'A single counter can't keep up with a viral post — fix it.' shard into N sub-counters; sum on read. 'Reads now sum N shards — too slow?' cache the total, refresh every ~1s (eventual consistency). 'Push write throughput further?' coalesce increments in app memory and flush aggregated deltas. 'Count UNIQUE viewers cheaply?' HyperLogLog (approximate cardinality in KB). 'Top item frequencies?' Count-Min Sketch (the top-k design). 'Don't lose counts on crash?' persist/replicate + bounded flush windows. 'Counts per day/window?' time-bucketed counter keys with TTL. 'Most counters are cold?' only shard hot keys; keep cold ones as one row. Each returns to the spine: spread writes across shards (no hot row), cache the summed read, coalesce writes, and go probabilistic when approximate is acceptable."),
    ],
    "A distributed counter tests removing the single-row write hotspot: shard the counter into N sub-counters (spread writes), sum-and-cache on read (eventual consistency), coalesce increments, and use probabilistic structures (HyperLogLog/Count-Min) when approximate counts suffice. The signal is recognizing the hot key and trading exactness/freshness for write throughput.",
    [
      G("single_row", "Incrementing one shared row/counter for a hot key.", "Shard into N sub-counters, route each increment to one, sum on read.", "A single UPDATE/INCR on one row for all increments."),
      G("read_fanin", "Summing N shards on every read of a hot, frequently-read counter.", "Cache the summed total and refresh periodically (eventual consistency).", "Reads fan-in across all shards each time."),
      G("exact_when_approx_ok", "Storing every viewer id to count unique views exactly.", "Use HyperLogLog for approximate cardinality in tiny fixed memory.", "Keeps a set of all viewer ids for a unique-count."),
    ],
    0.5, DIAG.counter, "Distributed counter architecture"),

  // ─────────────────────────── TOP-K / TRENDING ────────────────────────────
  TT("sysd_m11", "sysd_m11_t6", 6, "Design a Top-K / Trending System", "design-topk-trending",
    ["case-study", "top-k", "count-min-sketch", "streaming"],
    "From a firehose of billions of events (hashtags, searches, product views), continuously show the top 10 trending items over the last hour. Keeping an exact count for every distinct item would need impossible memory. How do you find the most frequent items approximately, in bounded memory?",
    "You can't store a counter for billions of distinct items, so estimate frequencies with a PROBABILISTIC SKETCH — a Count-Min Sketch counts any item's frequency in fixed memory (with small over-estimation) — and keep a HEAP of the current top-k candidates. Per-shard sketches are merged for a global view, and a sliding TIME WINDOW (time buckets) makes it 'trending now'. It's an approximate, streaming, bounded-memory design.",
    [
      C("requirements", "Requirements",
        "Functional: ingest a high-rate stream of item events and continuously report the top-k most frequent items, typically over a recent time WINDOW (last hour/day) so it reflects 'trending now', not all-time. Non-functional: very high ingest throughput (billions of events), bounded/sublinear MEMORY (you cannot keep an exact counter per distinct item when there are billions of them), low-latency top-k reads, and approximate results are acceptable (the exact 9th-vs-10th ranking rarely matters). Clarify exact vs approximate and the window (sliding vs tumbling). The defining constraint is MEMORY versus CARDINALITY: an exact solution (a hashmap of item->count plus a sort) is simple but needs memory proportional to the number of DISTINCT items, which is prohibitive at billions; so the design trades a little accuracy for fixed memory using probabilistic sketches, and adds windowing to make it about current trends."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 1B events/day, ~10M distinct items.\n  exact: 10M items * (key + count) ~= GBs and a sort -> heavy, grows with cardinality\n  Count-Min Sketch: fixed size (e.g. width 2^20 * depth 5 * 4 B ~= 20 MB) regardless\n    of cardinality -> estimates any item's frequency in ~constant memory\nTop-k heap: only k entries (e.g. 100 candidates).\nWindowed: keep per-time-bucket sketches (e.g. 60 one-minute sketches for an hour).\nTakeaway: sketch memory is FIXED (independent of distinct count); the trade is a\nsmall over-estimate; windowing multiplies by the number of buckets."),
      C("hld", "High-level design",
        "Events flow from the stream into processors. Each maintains a COUNT-MIN SKETCH (a fixed 2D array of counters) to estimate item frequencies and a MIN-HEAP of size k holding the current top candidates (with their estimated counts); on each event it updates the sketch and, if the item's estimated count exceeds the heap's minimum, updates the heap. At scale this runs SHARDED — events partitioned across processors, each with its own sketch+heap — and a merge step combines per-shard sketches/heaps into a global top-k. WINDOWING uses time buckets: maintain a sketch per recent interval and combine the last W buckets for 'trending in the last hour', expiring old buckets (sliding window). Reads return the merged heap. Trace an event: item arrives -> sketch.add(item) -> est = sketch.estimate(item) -> if est > heap.min: heap.update(item, est). The exact heavy lifting (counting) is approximated in fixed memory; only k results are kept precisely."),
      K("api", "API design",
        "record(item)                 // update sketch + maybe the top-k heap\ntopK(k, window='1h') -> [ { item, estCount } ]   // merged, approximate, ranked\n\nCore structures:\n  CountMinSketch.add(item): for each of d hash fns, counters[i][h_i(item)] += 1\n  CountMinSketch.estimate(item): min over d of counters[i][h_i(item)]  (over-estimates)\n  heap: min-heap of size k by estCount"),
      K("data_model", "Data model",
        "count-min sketch:  d x w array of counters (fixed memory), d independent hashes\n  estimate(x) = min_i counters[i][hash_i(x)]   // never under-counts; may over-count\ntop-k heap:        min-heap of (item, estCount), size k\nwindowed:          one sketch (+heap) per time bucket; combine last W buckets\nsharding:          events partitioned across processors; merge sketches/heaps"),
      C("deep_dive", "Deep dive: Count-Min Sketch + heap",
        "The key data structure is the COUNT-MIN SKETCH: a 2D array of counters with d rows, each row having its own hash function mapping an item to a column. To ADD an item, increment counters[i][hash_i(item)] for every row i; to ESTIMATE its count, take the MINIMUM of those d counters. Hash collisions can only ADD to a counter (different items landing on the same cell), so the sketch NEVER under-counts and the minimum across rows cancels most collision inflation — giving a frequency estimate that's correct or a slight over-estimate, in FIXED memory regardless of how many distinct items exist. Pair it with a MIN-HEAP of size k: as you process events, whenever an item's estimated count beats the smallest in the heap, insert/update it and evict the minimum — so the heap always holds the current top-k. Together: the sketch answers 'how frequent is X' cheaply, and the heap tracks 'which are the top k' — the canonical heavy-hitters solution in bounded memory."),
      C("deep_dive", "Deep dive: distributed merge & windowing",
        "Two extensions make it production-scale and 'trending'. DISTRIBUTED: partition the event stream across many processors, each keeping its own sketch + top-k heap; Count-Min Sketches are MERGEABLE (add corresponding cells) and per-shard top-k candidates are combined, so a coordinator periodically merges shard sketches into a global sketch and recomputes the global top-k — linear scaling with no single processor seeing the whole firehose. WINDOWING makes it about RECENT trends rather than all-time: keep a separate sketch per time bucket (e.g. one per minute) and, for 'last hour', combine the most recent 60 buckets; as time advances, drop the oldest bucket and start a new one (a sliding window of sketches). This expires stale popularity so yesterday's viral item doesn't dominate today. The combination — sharded mergeable sketches + a heap + windowed buckets — yields approximate, real-time, memory-bounded trending at firehose scale."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Memory vs accuracy is the fundamental knob: a bigger sketch (more width/depth) reduces over-estimation error but uses more memory — size it to the acceptable error. Heavy hitters (extremely hot items) are estimated well; rare items have relatively more error (collision noise) — fine since you only care about the top. Windowing multiplies memory by the number of buckets and adds bucket-management overhead. The merge step is periodic coordination — frequency trades freshness vs cost. Trade-offs: Count-Min Sketch (fixed memory, over-estimates, no item list) vs exact hashmap (precise, memory grows with cardinality); approximate top-k (cheap, ~right) vs exact (expensive at billions of items); sliding window (fresh, more buckets) vs tumbling (cheaper, coarser); per-shard local top-k + merge (scalable, approximate) vs global exact (impossible). Closing signal: Count-Min Sketch for fixed-memory frequency estimates + a min-heap for top-k, sharded with mergeable sketches and time-bucketed windows."),
      C("deep_dive", "Deep dive: accuracy tuning, decay & operations",
        "Operationally you tune accuracy and keep trends current. Sizing: the sketch's width controls collision rate (error magnitude) and depth controls the probability the estimate is within bounds — pick them from the target error and confidence; widen the sketch if top-k results look noisy. Decay: instead of hard windows you can apply exponential time decay (periodically halve all counters) so recent events weigh more and old popularity fades smoothly — cheaper than many buckets. Hot-item handling: the true heavy hitters dominate and are estimated accurately, which is exactly what trending needs; thresholding (only track items above a frequency floor) trims noise. Distribution: shard by item hash so the same item lands on the same processor (better local accuracy), or shard arbitrarily and rely on mergeability. Validation: periodically reconcile against an exact count on a sample to monitor error. Observability: ingest rate, estimated error, heap churn, and merge lag are the SLOs. The spine holds: fixed-memory mergeable sketches + a top-k heap + windowing/decay, sized to an accuracy budget, sharded for throughput."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not a hashmap of counts?' memory grows with distinct items (billions) — use a fixed-size Count-Min Sketch instead. 'How does the sketch avoid undercounting?' collisions only add, and taking the min across rows cancels most inflation (never under-counts). 'Make it trending, not all-time?' time-bucketed sketches (sliding window) or exponential decay. 'Scale past one machine?' shard the stream; sketches are mergeable, combine per-shard top-k. 'Track the actual items, not just counts?' keep the heap of top-k candidates alongside the sketch. 'Tune accuracy?' widen/deepen the sketch for less error. 'Unique counts instead of frequency?' HyperLogLog (cardinality). Each returns to the spine: estimate frequencies with a fixed-memory sketch, keep top-k in a heap, shard+merge, and window/decay for recency."),
    ],
    "A top-k/trending system tests probabilistic streaming: a Count-Min Sketch to estimate item frequencies in fixed memory (no per-item counter at billion-cardinality) plus a min-heap for the top-k, made distributed via mergeable sketches and 'trending' via time-bucketed windows/decay. The signal is choosing bounded-memory approximation over an exact hashmap and naming the sketch+heap pattern.",
    [
      G("exact_hashmap", "Keeping an exact count per distinct item then sorting.", "Use a Count-Min Sketch (fixed memory) + a heap; memory shouldn't grow with cardinality.", "hashmap item->count for billions of items."),
      G("no_window", "Reporting all-time frequencies instead of recent trends.", "Use time-bucketed sketches (sliding window) or exponential decay for recency.", "No windowing; old viral items dominate forever."),
      G("not_distributed", "Assuming one processor can see the whole firehose.", "Shard the stream; exploit mergeable sketches + per-shard top-k merge.", "Single-node counting of a billion-event stream."),
    ],
    0.6, DIAG.topk, "Top-K / trending architecture"),

  // ─────────────────────────────────── CDN ─────────────────────────────────
  TT("sysd_m13", "sysd_m13_t1", 1, "Design a CDN", "design-cdn",
    ["case-study", "cdn", "edge-cache", "routing"],
    "Users worldwide must load your images, video, and static assets fast — but your origin servers are in one region. Serving every byte from origin means high latency for distant users and a crushed origin. How do you deliver content quickly everywhere while protecting the origin?",
    "Cache content at EDGE locations (points of presence) physically near users worldwide; route each user to their NEAREST edge (anycast / geo-DNS); a cache HIT serves locally with low latency, a MISS pulls from a parent/regional cache or the origin and then caches it. A cache HIERARCHY and origin shielding protect the origin, while TTLs and purge handle freshness. It's geographically distributed caching with smart routing.",
    [
      C("requirements", "Requirements",
        "Functional: serve content (static assets, images, video segments, downloads) to globally distributed users; pull from an origin on a miss; support cache invalidation/purge and configurable freshness (TTLs). Non-functional: LOW LATENCY for users everywhere (serve from nearby), high CACHE HIT RATE (so the origin sees little traffic), massive throughput/bandwidth, high availability, and origin protection (a traffic spike must not melt the origin). Clarify scope: primarily static/cacheable content (the CDN's sweet spot), with dynamic content handled by pass-through or edge compute. The defining idea is GEOGRAPHIC distribution of cache: latency is largely distance/speed-of-light bound, so the win is putting copies of content physically close to users at many edge locations, and the design problems are routing users to the nearest healthy edge, maximizing hit rate, and shielding the origin from the misses."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100 edge POPs, 500M users, mostly cacheable assets.\n  hit rate 95% -> origin sees only 5% of requests (a 20x reduction)\n  each 1% of hit rate matters: 90%->95% halves origin load again\nBandwidth is the dominant resource and is served at the EDGE, near users.\nEdge cache size: hold the working set of popular objects per region (long-tail\n  pulls from origin/parent on first hit, then caches).\nTakeaway: hit rate drives origin load and cost; edges absorb bandwidth; routing\nusers to the nearest edge drives latency. Optimize hit rate + nearest-edge routing."),
      C("hld", "High-level design",
        "Content is cached at many EDGE POPs (points of presence) distributed globally. A user's request is routed to the NEAREST/healthiest edge via ANYCAST (the same IP announced from all POPs; BGP routes to the closest) or GEO-DNS (DNS resolves to a nearby POP). At the edge: a cache HIT serves the object immediately (low latency, no origin contact); a MISS triggers a pull from a higher tier — a regional/parent cache, then the ORIGIN — after which the object is cached at the edge (and intermediate tiers) for subsequent requests. A multi-tier CACHE HIERARCHY (edge -> regional -> origin) means most misses are absorbed by a regional cache rather than hitting the origin (origin shielding). Freshness is governed by TTLs / Cache-Control headers, with explicit PURGE/invalidation for updates. Trace a request: user -> nearest edge (hit -> serve; miss -> regional -> origin -> fill caches -> serve). The origin becomes a low-traffic source of truth behind layers of caching."),
      K("api", "API / protocol",
        "GET https://cdn.example.com/assets/app.js   (HTTP; client unaware of edge)\n  Response cached per Cache-Control: max-age / s-maxage; ETag for revalidation\nInvalidation:\n  PURGE /assets/app.js              (evict at edges)  -- or version the URL:\n  /assets/app.<contenthash>.js      (immutable; new content = new URL, no purge)\nOrigin pull: edge -> origin GET with conditional headers (If-None-Match)"),
      K("data_model", "Data model / state",
        "edge cache:   object_key -> { bytes, headers, expires_at }  (LRU per POP)\nrouting:      anycast IP (BGP) or geo-DNS map (region -> POP)\nhierarchy:    edge POPs -> regional/parent caches -> origin\norigin:       source of truth for content; sees only misses\nfreshness:    TTL / Cache-Control per object; ETag for revalidation; purge list"),
      C("deep_dive", "Deep dive: request routing to the nearest edge",
        "Getting the user to a NEARBY edge is half the latency win. ANYCAST: the same IP address is announced from every POP, and the internet's routing (BGP) naturally delivers the user's packets to the topologically closest POP — simple for clients (one IP) and resilient (if a POP fails, routes shift to the next). GEO-DNS: the CDN's DNS resolver returns the IP of a POP chosen by the user's (resolver's) location and current POP health/load — more control (can steer by load, do health checks) but depends on DNS and resolver locality. Both aim to minimize round-trip distance (latency is largely speed-of-light bound) while load-balancing across POPs and routing around failures. Real CDNs combine them with real-time health/latency measurements. The result: a user in Tokyo hits a Tokyo POP, not your US origin — turning a 200ms cross-ocean fetch into a few-ms local one for cached content."),
      C("deep_dive", "Deep dive: caching, hierarchy, invalidation & freshness",
        "Maximizing hit rate and protecting the origin is the other half. CACHE HIERARCHY: edges don't all pull from the origin on a miss; they pull from a regional/parent cache, which pulls from the origin only if IT misses — so the origin sees a tiny fraction of misses (ORIGIN SHIELDING), and popular content fills caches once per region. FRESHNESS: each object carries a TTL (Cache-Control max-age); within TTL the edge serves without contacting origin; after TTL it REVALIDATES (conditional GET with ETag — origin replies 304 if unchanged, cheap). INVALIDATION: when content changes before its TTL, either PURGE it from edges (push an eviction) or, better, use CONTENT-VERSIONED URLs (app.<hash>.js) so new content has a new URL and old caches simply age out — sidestepping the hard cache-invalidation problem entirely (immutable assets). Cold-cache/long-tail: the first request for an unpopular object misses and pulls through, then caches. Tuning TTLs and using immutable versioned URLs is how you push hit rate toward 99%."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "A low hit rate punishes the origin and latency — maximize it with hierarchy/shielding, long TTLs, and versioned-immutable URLs. The thundering herd on a popular cold/expired object can stampede the origin — use request coalescing at the edge (one origin fetch fills all waiters) and staggered TTLs. Invalidation is the classic hard problem — prefer immutable versioned URLs over purges where possible. Dynamic/personalized content is uncacheable — pass it through or use edge compute, accepting it won't get the cache win. POP failures must reroute (anycast/DNS health) without dropping users. Trade-offs: anycast (simple, resilient, less steering control) vs geo-DNS (controllable, DNS-dependent); long TTL (high hit rate, staler) vs short TTL (fresher, more origin load); purge (immediate, complex at scale) vs versioned URLs (simple, immutable); deep hierarchy (great shielding, more hops) vs flat. Closing signal: nearest-edge routing + a cache hierarchy with origin shielding + TTL/versioned-URL freshness, maximizing hit rate."),
      C("deep_dive", "Deep dive: origin protection, dynamic content & operations",
        "Operationally a CDN must protect the origin, handle the uncacheable, and stay available. Origin shielding: a designated parent cache per origin absorbs misses so the origin sees near-zero traffic; request coalescing prevents many simultaneous misses from stampeding it. Dynamic content: truly dynamic/personalized responses can't be cached, so the CDN either passes them through (still benefiting from optimized, persistent origin connections and TLS termination at the edge) or runs EDGE COMPUTE/functions to assemble/personalize near the user; some responses are cacheable with short TTLs or cache keys that vary on a few headers. Security: CDNs also absorb DDoS (huge distributed capacity), terminate TLS at the edge, and enforce WAF rules — a side benefit of sitting in front of everything. Pre-warming: push hot content (a launch, a viral video) to edges before demand. Availability: health-checked routing fails over POPs; stale-while-revalidate serves slightly old content if the origin is down. Observability: cache hit ratio (the headline), edge latency, origin offload %, and error rates per POP are the SLOs. The spine holds: nearest-edge serving, hierarchical caching with shielding, freshness via TTL/versioning, and graceful failover."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How are users routed to a nearby edge?' anycast (BGP) or geo-DNS, with health/load awareness. 'How is the origin protected?' a cache hierarchy + origin shielding + request coalescing so it sees few misses. 'How do you invalidate content?' purge, or (better) immutable content-versioned URLs that age out. 'Freshness?' TTL/Cache-Control + ETag revalidation; stale-while-revalidate for resilience. 'Dynamic/personalized content?' pass-through or edge compute; can't be cached normally. 'Thundering herd on a hot expiry?' coalesce origin fetches + jittered TTLs. 'DDoS?' the CDN's distributed capacity absorbs it. 'Push content before a launch?' pre-warm edges. Each returns to the spine: route to the nearest edge, serve from a hierarchical cache that shields the origin, and manage freshness with TTLs/versioned URLs to keep hit rate high."),
    ],
    "A CDN tests geographically distributed caching: nearest-edge routing (anycast/geo-DNS), a multi-tier cache hierarchy with origin shielding, and freshness via TTLs and immutable versioned URLs — all to maximize hit rate and protect the origin. The signal is putting content physically near users and keeping misses off the origin, not just 'add a cache'.",
    [
      G("origin_serve", "Serving all content from a single origin/region.", "Cache at edge POPs near users; route to the nearest edge (anycast/geo-DNS).", "No edge tier; users far from origin get high latency."),
      G("no_shielding", "Every edge miss hitting the origin directly.", "Use a cache hierarchy (edge->regional->origin) + request coalescing to shield the origin.", "Origin receives all cache misses; stampedes on hot content."),
      G("invalidation_handwave", "No story for updating cached content / freshness.", "Use TTL/Cache-Control + ETag revalidation, and versioned-immutable URLs over purges.", "Assumes content never changes or 'just clear the cache'."),
    ],
    0.5, DIAG.cdn, "CDN architecture"),

  // ─────────────────────── LOG AGGREGATION (ELK) ───────────────────────────
  TT("sysd_m13", "sysd_m13_t2", 2, "Design a Log Aggregation System (ELK)", "design-log-aggregation",
    ["case-study", "logging", "elk", "ingestion"],
    "Thousands of services on thousands of hosts each emit logs. When something breaks at 3am you need to search across all of them in seconds. How do you collect, store, and make searchable a firehose of logs without losing them or going bankrupt on storage?",
    "Ship logs off each host with lightweight AGENTS into a durable BUFFER (Kafka) that absorbs spikes; PROCESSORS parse/enrich them; they're stored in a searchable INDEX (an inverted index, e.g. Elasticsearch) partitioned by time; and a UI (Kibana) queries and alerts. The pipeline is collect -> buffer -> parse -> index -> search, with time-based tiering (hot/warm/cold) and retention to control cost. High ingest, full-text search, and retention economics are the substance.",
    [
      C("requirements", "Requirements",
        "Functional: collect logs from thousands of services/hosts; centralize them; allow fast SEARCH and filtering (by service, time, text, fields); build dashboards; and alert on patterns (error spikes). Non-functional: very high INGEST throughput (logs are a firehose), low search latency over recent data, reliability (don't silently drop logs, absorb bursts), scalable storage with RETENTION policies (you can't keep everything forever — cost), and resilience (a logging outage must not take down the apps emitting logs). Clarify scope: this is observability logs (the 'L' in ELK), distinct from metrics (numeric time series) and traces. The defining tensions are INGEST at scale (bursty, must not lose or block producers), making huge volumes SEARCHABLE (full-text indexing isn't free), and the ECONOMICS of retention (log volume is enormous, so tiering/retention is mandatory)."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 10k hosts, each ~100 log lines/sec, ~500 B/line:\n  ingest = 10k * 100 = 1M lines/sec = ~0.5 GB/sec -> ~43 TB/day raw\n  the full-text INDEX adds overhead (often ~1x the raw) -> plan ~2x storage\nRetention 30 days at 43 TB/day -> ~1.3 PB (x index x replicas) -> tiering is mandatory\nSearch: recent data hot (fast), old data warm/cold (slower, cheaper).\nTakeaway: ingest is bursty and huge (buffer it), full-text indexing doubles\nstorage, and retention/tiering is the cost lever -- you cannot keep it all hot."),
      C("hld", "High-level design",
        "Lightweight AGENTS (log shippers) on each host tail log files and ship lines to a durable BUFFER — a message queue (Kafka) that decouples producers from the rest, absorbs ingest spikes, and ensures a downstream slowdown never blocks or loses application logs. PROCESSORS consume from the buffer, PARSE unstructured lines into structured fields, enrich (add service/host/trace ids), and write them into a search INDEX — an inverted-index store (Elasticsearch) that makes logs full-text searchable. Indices are TIME-PARTITIONED (e.g. daily) so old data can be aged out or moved to cheaper tiers. A UI (Kibana) runs queries, builds dashboards, and an alerting component evaluates rules over the logs. Trace a log line: app writes log -> agent ships it -> Kafka -> processor parses/enriches -> indexed into today's index -> searchable in Kibana within seconds; an alert rule fires if error count spikes. The pipeline is collect -> buffer -> parse -> index -> search, each stage independently scalable."),
      K("api", "API / pipeline",
        "ingest (agent -> buffer):  ship({ ts, host, service, level, message, fields })\nsearch:  GET /logs/_search { query: 'service:auth AND level:ERROR', range: last 1h }\n         -> matching log docs (ranked/filtered), aggregations for dashboards\nalert rule:  count(level:ERROR by service) over 5m > threshold -> notify\npipeline: agents -> Kafka -> processors(parse/enrich) -> index(time-partitioned)"),
      K("data_model", "Data model",
        "log document:  { @timestamp, host, service, level, message, trace_id, ...fields }\nindex:         inverted index over message + fields; time-partitioned (logs-YYYY.MM.DD)\nbuffer:        Kafka topic(s) partitioned by service/host (durable, replayable)\ntiers:         hot (recent, fast SSD) -> warm -> cold (cheap) -> delete (retention)\nretention:     rollover by age/size; close/archive/delete old indices"),
      C("deep_dive", "Deep dive: the ingest pipeline & reliability",
        "Ingest must be high-throughput AND must never harm the apps producing logs. AGENTS are deliberately lightweight (low CPU/memory) since they run on every host; they tail files and forward, with local buffering so a brief network blip doesn't lose lines. The crucial component is the durable BUFFER (Kafka): it decouples producers from processors and the index, so (a) a spike in logging or a slow/over-loaded index applies BACKPRESSURE to the buffer, not to the applications — apps keep running and logs queue up rather than blocking or dropping; (b) the buffer is replayable, so if a processor or the index fails, logs aren't lost — they're reprocessed from the buffer; (c) it smooths bursts (a deploy or incident causing a log storm is absorbed). Processors then parse free-form lines into structured fields (grok/regex/JSON), enrich with metadata, and batch-write to the index. This buffered, decoupled pipeline is what gives reliability at firehose scale — the alternative (agents writing straight to the index) collapses under spikes and couples app health to index health."),
      C("deep_dive", "Deep dive: storage, search & retention economics",
        "Making huge log volumes searchable affordably is the other half. SEARCH: logs are stored in an INVERTED INDEX (term -> documents) so full-text and field queries are fast — the same structure as a search engine — which is why you can grep across thousands of services in seconds, but indexing is CPU/storage-intensive (the index can be as large as the raw logs). TIME PARTITIONING: create a new index per time period (e.g. daily) so queries can target only relevant periods and old data can be managed as a unit. TIERING: recent logs go on HOT nodes (fast SSD, heavily queried), older logs roll to WARM then COLD tiers (cheaper, slower storage, rarely queried), and beyond the RETENTION window they're archived (e.g. to object storage) or deleted — this hot/warm/cold lifecycle is essential because keeping petabytes on fast storage is unaffordable. SAMPLING/filtering at ingest (drop debug logs, sample high-volume noisy logs) further controls cost. The economics — index overhead + tiering + retention — are as central to this design as the search itself, because log volume is effectively unbounded."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Ingest spikes (deploys, incidents, log storms) are the classic stressor — the Kafka buffer absorbs them and backpressures the index, not the apps. Index storage/cost grows relentlessly — control it with tiering, retention, and ingest-time sampling/filtering. Full-text indexing is expensive — index only the fields you'll query, and consider structured logging to avoid heavy parsing. High-cardinality fields bloat the index — be selective. Long-range queries over cold data are slow/costly — keep recent data hot, accept slower cold queries. A logging outage must not cascade to apps — the decoupled buffer ensures it doesn't. Trade-offs: index everything (powerful search, huge cost) vs selective indexing/sampling (cheaper, less complete); hot-everything (fast, expensive) vs tiering (cheap, slower old queries); buffer (reliable, absorbs spikes, adds a hop) vs direct-to-index (simple, fragile); long retention (more history, more cost) vs short. Closing signal: agents -> durable buffer (Kafka) -> parse/enrich processors -> time-partitioned inverted index, with hot/warm/cold tiering, retention, and ingest sampling for cost."),
      C("deep_dive", "Deep dive: scaling, alerting & operations",
        "Operationally the system must scale each stage and surface problems. Scaling: agents scale with hosts; the buffer scales by partitions; processors scale horizontally (stateless consumers); the index scales by sharding indices across nodes and replicating shards for availability and query throughput. Alerting: rules run as scheduled queries/aggregations over recent logs (e.g. error rate per service over 5 minutes) and fire notifications — integrating with the notification system; anomaly detection can flag unusual patterns. Structured logging: encouraging apps to emit structured (JSON) logs with consistent fields (service, trace_id, level) makes parsing cheap and search precise, and ties logs to distributed traces. Correlation: a shared trace_id lets you pivot from a metric/alert to the exact logs of a request across services (the observability trio: logs, metrics, traces). Backpressure & loss policy: under extreme overload, decide whether to drop low-priority logs or grow the buffer — and alert on ingest lag. Observability of the logger itself: ingest rate, buffer lag, index latency, and storage by tier are the SLOs. The spine holds: a buffered, decoupled, horizontally-scalable pipeline into a tiered, time-partitioned search index, with rule-based alerting and trace correlation."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How do you not lose logs or block apps during a spike?' a durable buffer (Kafka) decouples producers and backpressures the index, not the apps; it's replayable. 'How is search fast over so much data?' an inverted index (full-text), time-partitioned. 'How do you afford the storage?' hot/warm/cold tiering + retention + ingest sampling/filtering. 'Alerting?' scheduled queries/aggregations over recent logs firing notifications. 'Correlate logs across services?' structured logging + a shared trace_id (logs+metrics+traces). 'High-cardinality/noisy logs?' selective indexing + sampling. 'Old data queries?' served from warm/cold tiers (slower, cheaper). 'Metrics vs logs?' metrics are numeric time series (a TSDB), logs are searchable events — different systems. Each returns to the spine: collect via agents -> durable buffer -> parse/enrich -> time-partitioned inverted index, tiered and retained for cost, with alerting and trace correlation."),
    ],
    "Log aggregation tests a reliable high-throughput pipeline (agents -> durable Kafka buffer -> parse/enrich processors -> inverted-index store) plus the economics of search at scale (time-partitioned indices, hot/warm/cold tiering, retention, sampling). The signal is decoupling ingest with a buffer so spikes don't lose logs or block apps, and treating retention/tiering as first-class cost control.",
    [
      G("agents_to_index", "Agents writing logs straight to the index with no buffer.", "Insert a durable buffer (Kafka) to absorb spikes, backpressure, and replay.", "Direct agent->Elasticsearch; collapses on log storms."),
      G("keep_everything_hot", "Keeping all logs on fast storage forever.", "Tier hot/warm/cold + retention + ingest sampling to control cost.", "No retention/tiering; petabytes on SSD."),
      G("no_search_structure", "Storing logs in a plain DB / files without a search index.", "Index logs in an inverted index (full-text), time-partitioned, for fast search.", "Greps flat files or scans a relational table."),
    ],
    0.6, DIAG.logagg, "Log aggregation (ELK) architecture"),

  // ─────────────────────── METRICS / MONITORING ────────────────────────────
  TT("sysd_m11", "sysd_m11_t4", 4, "Design a Metrics / Monitoring System", "design-metrics-monitoring",
    ["case-study", "metrics", "tsdb", "time-series"],
    "Thousands of servers emit numeric metrics every few seconds — CPU, latency, request rates, business KPIs — and you need to graph them over time and alert when they go bad. Storing every data point in a regular database would explode. What storage and collection model fits time-series at this scale?",
    "Metrics are TIME SERIES — (metric+labels) -> a stream of (timestamp, value) — so they go into a TIME-SERIES DATABASE (TSDB) optimized for append-heavy writes, compression, fast range/aggregation queries, and downsampling. Collection is by PULL (scrape, e.g. Prometheus) or PUSH; a query/dashboard layer and an ALERTING engine sit on top. The headline pitfall is CARDINALITY: too many label combinations explode the number of series. Efficient time-series storage + cardinality control are the substance.",
    [
      C("requirements", "Requirements",
        "Functional: collect numeric metrics from many sources (infra + application + business); store them as time series; query and AGGREGATE over time ranges (avg latency last hour, request rate by endpoint); render dashboards; and ALERT when metrics breach thresholds. Non-functional: very high WRITE throughput (thousands of sources * many metrics * frequent intervals = millions of points/sec), efficient STORAGE (naive row-per-point is far too costly), fast range/aggregation QUERIES, configurable RETENTION, and reliability. Clarify scope: metrics (numeric time series — this) vs logs (searchable events) vs traces — different systems with a shared goal (observability). The defining realities are that the data is APPEND-ONLY time series (write-once, query-by-range, never updated), which a purpose-built TSDB exploits for compression and speed, and that CARDINALITY (the number of distinct metric+label series) is the silent scaling killer — far more so than raw point volume."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 10k hosts * 200 metrics each, scraped every 15s:\n  series = 10k * 200 = 2M active series\n  writes = 2M / 15s ~= 133k points/sec\nNaive storage (16 B/point) = 133k * 16 B ~= 2 MB/sec, but TSDB COMPRESSION\n  (delta-of-delta + XOR, e.g. Gorilla) cuts points to ~1-2 BYTES each -> ~10x less.\nCardinality blow-up: adding a high-cardinality label (user_id) to one metric\n  can turn 1 series into millions -> the real cost driver.\nRetention: raw at high res for days, DOWNSAMPLED rollups for months/years.\nTakeaway: compression + downsampling make storage tractable; cardinality is the\nthing to control, not point count."),
      C("hld", "High-level design",
        "Sources expose or emit metrics. Collection is either PULL — a server (Prometheus-style) periodically SCRAPES each source's metrics endpoint — or PUSH — sources/agents send metrics to an ingestion gateway (better for short-lived jobs). Ingestion writes points into a TIME-SERIES DATABASE optimized for the workload: append-heavy writes, heavy COMPRESSION, and fast range scans by series. A query layer answers range/aggregation queries (a query language like PromQL) for DASHBOARDS, and an ALERTING engine periodically evaluates rules (expressions over queries) and fires notifications when thresholds/anomalies trigger. DOWNSAMPLING jobs roll up high-resolution data into coarser resolutions for long-term retention. Trace a metric: host exposes http_requests_total{service=auth} -> scraper pulls it every 15s -> appended to the TSDB (compressed) -> a dashboard queries rate() over 1h -> an alert rule fires if error rate > threshold. The control plane (scrape config, rules) is small; the data plane (time-series writes + range queries) is the scaling challenge."),
      K("api", "API / model",
        "write:  metric{label1=v1,label2=v2} value @timestamp   // e.g. latency_ms{svc=api}=37\nquery (PromQL-like):\n  rate(http_requests_total{service='auth'}[5m])              // per-sec rate\n  histogram_quantile(0.99, latency_bucket)                   // p99\nalert rule:  avg(error_rate{service='auth'}) > 0.05 for 5m -> notify\ncollection:  PULL scrape /metrics every 15s  |  PUSH to ingest gateway"),
      K("data_model", "Data model",
        "time series:  (metric_name + sorted labels) -> series id -> [ (ts, value), ... ]\n  series key example: http_requests_total{service=auth,method=GET,code=200}\nstorage:      append-only, columnar-ish; per-series chunks, heavily compressed\n  (delta-of-delta timestamps + XOR float compression -> ~1-2 bytes/point)\ndownsampled:  rollup series at coarser resolution (1m -> 5m -> 1h) for retention\nindex:        label -> series (inverted index) to resolve queries by label"),
      C("deep_dive", "Deep dive: time-series storage & compression",
        "A TSDB beats a general database here because the access pattern is narrow and exploitable. Metrics are APPEND-ONLY (new points at increasing timestamps, never updated) and queried by RANGE over a series, so the TSDB stores each series' points together in time order as compressed chunks. COMPRESSION is dramatic: timestamps are regular (every 15s), so delta-of-delta encoding stores them in a few bits; values change slowly, so XOR-based float compression (Gorilla) stores each value in ~1-2 bytes instead of 16 — often a 10x+ reduction, which is what makes storing millions of series affordable. Old data is DOWNSAMPLED: you don't need per-15s resolution for last year, so background rollups aggregate raw points into coarser resolutions (5m, 1h) and the high-res data is dropped after a retention window — keeping storage bounded while preserving long-term trends. A label INDEX (inverted index: label->series) resolves queries like 'all series where service=auth' quickly. The design is purpose-built around append + range-query + compress + downsample."),
      C("deep_dive", "Deep dive: collection, cardinality & alerting",
        "Three operational pillars. COLLECTION — PULL (scrape): the monitoring server periodically fetches each target's /metrics endpoint, which gives it control (it knows what's up/down via scrape success) and works well for long-running services; PUSH: sources send metrics to a gateway, better for short-lived/batch jobs that may not be around to be scraped. CARDINALITY is the defining pitfall: a 'series' is a unique metric+label combination, and adding a high-cardinality label (user_id, request_id, email) multiplies series counts explosively — one metric can balloon into millions of series, blowing up memory and storage — so you must keep labels LOW-cardinality (bounded sets like service, region, status code) and never put unbounded ids in labels. ALERTING: rules are expressions over queries evaluated on a schedule (e.g. p99 latency > 500ms for 5m, or error rate spiking); when a rule's condition holds, it fires to the notification system, with grouping/silencing to avoid alert storms. These three — how you collect, controlling cardinality, and rule-based alerting — are what interviewers probe beyond 'store time series'."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "CARDINALITY explosion is the number-one bottleneck — high-cardinality labels turn millions of points into billions of series, exhausting memory; enforce low-cardinality labels and drop/aggregate offenders. Write throughput is high but compresses well; long-range queries over many series are expensive — serve them from downsampled rollups. Retention cost is controlled by downsampling + dropping high-res old data. Push vs pull each have failure modes (pull misses short-lived jobs; push can overwhelm the gateway and hides liveness). Trade-offs: TSDB (compressed, fast range queries, append-only) vs general DB (flexible, far costlier for this); pull (liveness signal, control) vs push (short jobs, decoupled); high resolution/retention (detailed, expensive) vs downsampling (cheap, lossy detail); rich labels (powerful queries, cardinality risk) vs minimal labels. Closing signal: time series in a compressed TSDB, pull/push collection, strict cardinality control, downsampling for retention, and rule-based alerting over queries."),
      C("deep_dive", "Deep dive: scale, retention & operations",
        "Operationally the system scales by series and must stay queryable and reliable. Scaling: shard the TSDB by series (hash of the series key) across nodes so writes and queries distribute, and replicate for availability; a query layer fans out to shards and merges. Retention tiers: keep raw high-resolution data for a short window (days) on fast storage, downsampled rollups for medium/long term, and delete beyond retention — a lifecycle exactly analogous to logs. High availability: redundant scrapers/ingesters and replicated storage so a node loss doesn't blind you (monitoring must stay up precisely when things are failing). Federation/global view: per-region monitoring with a global aggregation layer for cross-region dashboards. Cardinality governance: monitor your own series count, alert on cardinality spikes, and reject/relabel metrics with runaway labels. Alert hygiene: dedupe, group, and silence alerts (route through the notification system) to avoid storms during incidents. Observability of the monitor: ingest rate, active series count (cardinality), query latency, and scrape success are its own SLOs. The spine holds: a sharded, compressed, downsampled TSDB fed by pull/push collection, with strict cardinality control and rule-based alerting."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not a regular database?' metrics are append-only time series queried by range — a TSDB compresses (delta-of-delta + XOR) and range-scans far better. 'What blows up the system?' high-cardinality labels (user_id etc.) exploding series count — keep labels low-cardinality. 'Pull or push?' pull (scrape) for long-running services + liveness; push for short-lived jobs. 'Store years of data cheaply?' downsample into rollups + retention tiers; drop high-res old data. 'Alerting?' rules as scheduled queries firing to notifications, with grouping/silencing. 'Long-range queries slow?' query downsampled rollups. 'Logs vs metrics vs traces?' searchable events vs numeric series vs request timelines — separate systems, correlated by ids. 'Scale?' shard by series, replicate, federate per region. Each returns to the spine: a compressed, downsampled, sharded TSDB fed by pull/push, cardinality-controlled, with rule-based alerting."),
    ],
    "A metrics system tests modeling data as time series in a purpose-built TSDB (append-only, compressed via delta-of-delta + XOR, downsampled for retention), pull-vs-push collection, the cardinality pitfall (label combinations exploding series), and rule-based alerting. The signal is choosing a TSDB over a general DB and naming cardinality as the real scaling killer.",
    [
      G("general_db", "Storing each metric point as a row in a general-purpose database.", "Use a TSDB: append-only, compressed (delta-of-delta + XOR), range-query optimized.", "Row-per-datapoint in SQL; no compression/downsampling."),
      G("cardinality", "Putting high-cardinality values (user_id, request_id) in labels.", "Keep labels low-cardinality; never embed unbounded ids — it explodes series count.", "Labels include per-user/per-request identifiers."),
      G("no_downsampling", "Keeping full-resolution metrics forever.", "Downsample into rollups + retention tiers; drop high-res old data.", "No rollups/retention; long-range queries scan raw points."),
    ],
    0.6, DIAG.metrics, "Metrics / monitoring architecture"),

  // ─────────────────── SAGA / TRANSACTION ORCHESTRATOR ─────────────────────
  TT("sysd_m19", "sysd_m19_t1", 1, "Design a Saga / Transaction Orchestrator", "design-saga-orchestrator",
    ["case-study", "saga", "compensation", "microservices"],
    "A single business action — place an order — spans payment, inventory, and shipping services, each with its own database. You can't wrap them in one ACID transaction. If payment succeeds but inventory fails, how do you keep the system consistent without a distributed commit?",
    "Use a SAGA: model the transaction as a sequence of LOCAL transactions, each with a COMPENSATING action that undoes it. If any step fails, run the compensations for the completed steps in reverse to restore consistency. Drive it with an ORCHESTRATOR (a durable state machine that sequences steps and compensations) — easier to reason about and monitor than event choreography. Steps must be idempotent, and the saga state persisted so it survives crashes. It's eventual consistency via compensations, not 2PC.",
    [
      C("requirements", "Requirements",
        "Functional: execute a multi-step business transaction spanning several microservices (each with its own database); ensure the overall transaction is CONSISTENT — either all steps effectively complete, or completed steps are undone — and make it reliable, recoverable after crashes, and observable (where is each in-flight transaction?). Non-functional: reliability (no transaction left in a half-done state), eventual consistency (brief inconsistency between steps is acceptable), idempotency (steps may be retried), and scalability. Clarify scope: distributed transaction COORDINATION across services that can't share a database. The fundamental constraint: there is NO distributed ACID transaction available (2PC across independent service databases is impractical and blocks/locks across services, hurting availability), so you cannot atomically commit across them. The design must instead achieve consistency through a sequence of local commits plus explicit UNDO logic, accepting that the system passes through intermediate inconsistent states before converging."),
      K("estimation", "Capacity estimation (with numbers)",
        "Saga rate tracks business transactions -- e.g. 10k orders/sec at peak.\n  each saga = a handful of steps (3-6 local transactions + possible compensations)\nOrchestrator state must be PERSISTED per saga instance (durable, recoverable).\nLatency: a saga spans multiple service calls -> hundreds of ms to seconds\n  (it's a workflow, not a single request) -- often async.\nTakeaway: it's not a raw-throughput problem; the hard requirements are\nrecoverability (survive a crash mid-saga) and correctness (compensate on failure)\n-- so durable saga state + idempotent steps dominate the design."),
      C("hld", "High-level design",
        "A SAGA is a sequence of steps, each a LOCAL transaction in one service (commit independently), and each paired with a COMPENSATING transaction that semantically undoes it (refund a payment, release reserved inventory). An ORCHESTRATOR service drives the saga: it persists the saga instance as a STATE MACHINE (current step, status, data), invokes step 1, waits for success, invokes step 2, and so on; if a step FAILS, it stops advancing and invokes the COMPENSATIONS for the already-completed steps in REVERSE order, then marks the saga failed/rolled-back. Because the orchestrator's state is durable, a crash mid-saga is recoverable — on restart it reads in-flight sagas and resumes (re-invoking the current step or compensations). Steps are invoked via calls or messages and must be IDEMPOTENT so retries are safe. Trace an order saga: reserve inventory (ok) -> charge payment (ok) -> create shipment (FAILS) -> compensate: refund payment -> release inventory -> saga failed. The orchestrator is the explicit brain sequencing forward progress and rollback."),
      K("api", "API / model",
        "startSaga(type='placeOrder', data) -> sagaId   // begins the workflow\nsaga definition (per step):\n  step:        action(service call/message)         // local transaction\n  compensation:undo(service call/message)           // semantic rollback\n  e.g. [ {reserveInventory / releaseInventory},\n         {chargePayment   / refundPayment},\n         {createShipment  / cancelShipment} ]\nGET /sagas/{id} -> { state, currentStep, status: running|completed|compensating|failed }"),
      K("data_model", "Data model",
        "saga instance:  saga_id PK, type, status (running|completed|compensating|failed),\n                current_step, payload, created_at, updated_at   (DURABLE)\nstep log:       (saga_id, step) -> status (done|failed|compensated), attempts, result\n  -- persisted so the orchestrator can resume/compensate after a crash\nidempotency:    per (saga_id, step) key so retries don't double-apply a step\n(choreography variant) events on a bus instead of a central orchestrator"),
      C("deep_dive", "Deep dive: orchestration vs choreography",
        "There are two ways to coordinate a saga. ORCHESTRATION: a central ORCHESTRATOR explicitly drives the sequence — it calls each service, awaits the result, decides the next step or triggers compensations, and holds the saga state. Pros: the flow is explicit and centralized, easy to understand, monitor ('saga 123 is on step 2'), modify, and debug; failure handling/compensation logic lives in one place. Cons: the orchestrator is a component to build and operate (and must not become a SPOF — make it replicated and its state durable). CHOREOGRAPHY: no central coordinator — each service listens for events and emits its own; completing a step publishes an event that triggers the next service, and failures publish events that trigger compensations. Pros: decoupled, no central component. Cons: the overall flow is IMPLICIT and emergent (spread across services), making it hard to understand, monitor, and reason about, and easy to create cyclic event dependencies. The common recommendation: use ORCHESTRATION for non-trivial sagas (most interview scenarios) because the explicit, observable, centrally-managed flow is far easier to get right and operate; choreography suits very simple, loosely-coupled flows."),
      C("deep_dive", "Deep dive: compensations, idempotency & recovery",
        "Correctness rests on three ideas. COMPENSATIONS: every step needs a semantic UNDO, because you can't roll back an already-committed local transaction — you issue a counter-action (refund the charge, release the reservation, cancel the shipment). Compensations may themselves fail and must be retried; some actions are hard to truly undo (an email was sent) — handle with semantic compensation (send a correction) or design steps so non-compensatable actions come LAST. IDEMPOTENCY: because steps and compensations are retried (after timeouts, crashes, or duplicate messages), each must be idempotent — applying it twice equals once — typically via an idempotency key per (saga, step), the same discipline as payments. RECOVERY: the orchestrator PERSISTS saga state after every transition, so a crash is survivable — on restart it loads all in-flight sagas and resumes: re-invoke the current step (idempotent, so safe) or continue compensating. There are two recovery directions: BACKWARD recovery (compensate and abort — the default) and FORWARD recovery (retry the failed step until it succeeds, for steps that must eventually complete). This trio — compensations, idempotency, durable resumable state — is what turns a multi-service workflow into a consistent transaction without 2PC."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The core trade-off vs a real transaction is EVENTUAL consistency: the system is observably inconsistent BETWEEN steps (payment taken, inventory not yet reserved) until the saga completes or compensates — acceptable for most business flows but must be designed for (e.g. don't ship before all steps confirm). Compensations are tricky: some actions are hard to undo (order non-compensatable steps last, or use semantic compensation), and a failing compensation needs retries/escalation. The orchestrator is a coordination point and potential SPOF — replicate it and persist state. Lack of isolation: concurrent sagas can interleave (no transaction isolation), so you may need semantic locks/versioning to prevent anomalies. Idempotency is mandatory or retries corrupt state. Trade-offs: orchestration (explicit, observable, central component) vs choreography (decoupled, implicit/hard to trace); saga/eventual-consistency (available, no cross-service locks) vs 2PC (atomic, blocking, impractical); backward (compensate) vs forward (retry) recovery. Closing signal: a saga of local transactions with compensations, driven by a durable, idempotent, resumable orchestrator — eventual consistency in place of distributed ACID."),
      C("deep_dive", "Deep dive: failure handling, isolation & operations",
        "Operationally the orchestrator must be reliable and its sagas observable. Durability & resume: persist every state transition (often the orchestrator itself is built on a durable workflow engine / event-sourced log) so any crash resumes exactly where it left off; in-flight sagas are never lost. Timeouts: each step has a timeout; a stuck step triggers retry, compensation, or human escalation rather than hanging forever. Retries & DLQ: transient step failures retry with backoff; permanently failed sagas are flagged for investigation. Isolation anomalies: because there's no global transaction, design for concurrent sagas — use semantic locks (mark a resource 'pending'), versioning, or commutative operations to avoid lost-update/dirty-read style problems. Monitoring: expose per-saga state and dashboards of running/compensating/failed counts and step latencies — 'stuck saga' detection is essential operationally. Availability: run multiple orchestrator instances with shared durable state (one leader per saga or partitioned ownership) so it's not a SPOF. Observability: saga completion rate, compensation rate, stuck-saga count, and step latency are the SLOs. The spine holds: durable resumable orchestration of local transactions with idempotent steps, compensations for rollback, timeouts/retries, and isolation handling — consistency without 2PC."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not 2PC / a distributed transaction?' it blocks and locks across independent service databases, hurting availability and often unsupported — use a saga instead. 'How do you roll back a committed step?' you can't; run its compensating action (semantic undo). 'Orchestration vs choreography?' orchestration (central, explicit, observable) for non-trivial sagas; choreography (events) for simple decoupled ones. 'Crash mid-saga?' durable saga state + resume; idempotent steps make re-invocation safe. 'A compensation fails?' retry/escalate; order non-undoable steps last. 'Concurrent sagas interfering?' semantic locks/versioning (no isolation by default). 'Forward vs backward recovery?' retry-to-success vs compensate-and-abort. 'Build it?' often on a durable workflow engine. Each returns to the spine: local transactions + compensations, driven by a durable, idempotent, resumable orchestrator — eventual consistency instead of distributed ACID."),
    ],
    "A saga orchestrator tests distributed-transaction coordination without 2PC: a sequence of local transactions each with a compensating action, driven by a durable, resumable orchestrator (vs implicit choreography), with idempotent steps and compensation-based rollback. The signal is rejecting 2PC for eventual consistency via compensations and naming durability/idempotency/recovery.",
    [
      G("uses_2pc", "Trying to wrap cross-service steps in one ACID transaction / 2PC.", "Use a saga: local transactions + compensating actions; accept eventual consistency.", "Assumes a distributed commit across service databases."),
      G("no_compensation", "No undo path when a later step fails.", "Define a compensating action per step; on failure compensate completed steps in reverse.", "Failure leaves payment taken / inventory reserved with no rollback."),
      G("no_durable_state", "Orchestrator state in memory, lost on crash; non-idempotent steps.", "Persist saga state (resumable) and make steps idempotent for safe retries.", "A crash mid-saga loses progress or double-applies steps."),
    ],
    0.7, DIAG.saga, "Saga orchestrator architecture"),
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
  // Distributed counter
  pm("sysd_m10", { topicId: "sysd_m10_t2", exerciseId: "sysd_m10_t2_pm_d1", position: 11, level: "medium",
    title: "Removing the hotspot", scenario: "A viral post takes 100k like-increments/sec on one counter. A single row can't keep up. Fix?",
    options: ["Shard the counter into N sub-counters; sum on read", "Add a bigger database server", "Lock the row per increment", "Cache the write"],
    correct: "Shard the counter into N sub-counters; sum on read",
    explanation: "Spreading increments across N sub-counters removes the single-row contention; the total is the sum of shards (cached for fast reads)." }),
  pm("sysd_m10", { topicId: "sysd_m10_t2", exerciseId: "sysd_m10_t2_pm_d2", position: 12, level: "medium",
    title: "Cheap reads after sharding", scenario: "Summing N shards on every read of a hot counter is wasteful. What helps?",
    options: ["Cache the summed total, refresh periodically (eventual consistency)", "Read only one shard", "Re-sum on every request", "Drop the shards"],
    correct: "Cache the summed total, refresh periodically (eventual consistency)",
    explanation: "Compute the sum every ~1s and serve the cached total; a like count lagging a second is fine, and it avoids fanning in on every read." }),
  pm("sysd_m10", { topicId: "sysd_m10_t2", exerciseId: "sysd_m10_t2_pm_d3", position: 13, level: "hard",
    title: "Counting unique viewers cheaply", scenario: "You need the count of UNIQUE viewers of a viral video without storing every viewer id. What fits?",
    options: ["HyperLogLog (approximate cardinality in tiny fixed memory)", "A set of all viewer ids", "A SQL COUNT(DISTINCT)", "One integer counter"],
    correct: "HyperLogLog (approximate cardinality in tiny fixed memory)",
    explanation: "HyperLogLog estimates distinct counts in a few KB (~2% error) for billions of items — far cheaper than storing every id for an exact unique count." }),
  // Top-K
  pm("sysd_m11", { topicId: "sysd_m11_t6", exerciseId: "sysd_m11_t6_pm_d1", position: 11, level: "hard",
    title: "Frequencies in bounded memory", scenario: "You can't store a counter per item for billions of distinct items. What estimates frequencies in fixed memory?",
    options: ["A Count-Min Sketch", "A hashmap of item->count", "A sorted array", "A B-tree"],
    correct: "A Count-Min Sketch",
    explanation: "A Count-Min Sketch estimates any item's frequency in fixed memory (never under-counts; slight over-count), independent of the number of distinct items." }),
  pm("sysd_m11", { topicId: "sysd_m11_t6", exerciseId: "sysd_m11_t6_pm_d2", position: 12, level: "medium",
    title: "Tracking the top items", scenario: "Alongside the frequency sketch, what keeps the current top-k items?",
    options: ["A min-heap of size k updated as estimates change", "A full sort every event", "A queue of all items", "Nothing — the sketch returns top-k"],
    correct: "A min-heap of size k updated as estimates change",
    explanation: "The sketch estimates frequencies; a size-k min-heap holds the current top candidates, evicting the minimum when a higher-count item appears." }),
  pm("sysd_m11", { topicId: "sysd_m11_t6", exerciseId: "sysd_m11_t6_pm_d3", position: 13, level: "medium",
    title: "Trending vs all-time", scenario: "How do you make it 'trending in the last hour' rather than all-time?",
    options: ["Time-bucketed sketches (sliding window) or exponential decay", "A bigger sketch", "Sort by id", "Reset the system hourly by hand"],
    correct: "Time-bucketed sketches (sliding window) or exponential decay",
    explanation: "Keep a sketch per time bucket and combine the recent W buckets (sliding window), or decay counters over time, so recent popularity wins." }),
  // CDN
  pm("sysd_m13", { topicId: "sysd_m13_t1", exerciseId: "sysd_m13_t1_pm_d1", position: 11, level: "medium",
    title: "Low latency worldwide", scenario: "How does a CDN make content load fast for users far from your origin?",
    options: ["Cache content at edge POPs near users; route to the nearest", "Use a faster origin server", "Compress everything", "Add more origin replicas in one region"],
    correct: "Cache content at edge POPs near users; route to the nearest",
    explanation: "Latency is largely distance-bound; caching copies at many edge locations and routing each user to the nearest (anycast/geo-DNS) cuts round-trip time." }),
  pm("sysd_m13", { topicId: "sysd_m13_t1", exerciseId: "sysd_m13_t1_pm_d2", position: 12, level: "hard",
    title: "Protecting the origin", scenario: "How do you keep cache misses from overwhelming the origin?",
    options: ["A cache hierarchy (edge->regional->origin) + origin shielding + request coalescing", "Scale the origin vertically", "Disable caching on miss", "Serve errors on miss"],
    correct: "A cache hierarchy (edge->regional->origin) + origin shielding + request coalescing",
    explanation: "Misses pull from a regional/parent cache first (shielding), and coalescing collapses simultaneous misses into one origin fetch — the origin sees few requests." }),
  pm("sysd_m13", { topicId: "sysd_m13_t1", exerciseId: "sysd_m13_t1_pm_d3", position: 13, level: "medium",
    title: "Updating cached content", scenario: "You deployed a new app.js. How do you avoid stale caches without complex purges?",
    options: ["Content-versioned immutable URLs (app.<hash>.js)", "Wait for caches to expire someday", "Purge every edge for every change always", "Disable caching"],
    correct: "Content-versioned immutable URLs (app.<hash>.js)",
    explanation: "New content gets a new URL, so caches never serve stale bytes and old versions age out — sidestepping the hard invalidation problem; use TTL/purge for the rest." }),
  // Log aggregation
  pm("sysd_m13", { topicId: "sysd_m13_t2", exerciseId: "sysd_m13_t2_pm_d1", position: 11, level: "medium",
    title: "Surviving log storms", scenario: "A deploy causes a log spike. How do you avoid losing logs or blocking the apps?",
    options: ["A durable buffer (Kafka) decouples producers and backpressures the index", "Write straight to the index faster", "Drop logs during spikes", "Block the app until logs flush"],
    correct: "A durable buffer (Kafka) decouples producers and backpressures the index",
    explanation: "The buffer absorbs bursts and replays on failure; backpressure hits the buffer, not the apps, so logs aren't lost and producers aren't blocked." }),
  pm("sysd_m13", { topicId: "sysd_m13_t2", exerciseId: "sysd_m13_t2_pm_d2", position: 12, level: "medium",
    title: "Fast search over huge logs", scenario: "How do you search across thousands of services' logs in seconds?",
    options: ["Store them in an inverted index (full-text), time-partitioned", "Grep flat files on each host", "Scan a relational table", "Keep logs only in memory"],
    correct: "Store them in an inverted index (full-text), time-partitioned",
    explanation: "An inverted index makes full-text/field queries fast; time-partitioning lets queries target relevant periods and old data be aged out." }),
  pm("sysd_m13", { topicId: "sysd_m13_t2", exerciseId: "sysd_m13_t2_pm_d3", position: 13, level: "hard",
    title: "Affording the storage", scenario: "Log volume is petabytes. How do you control storage cost?",
    options: ["Hot/warm/cold tiering + retention + ingest sampling", "Keep everything on SSD forever", "Never delete logs", "Index every field at full resolution indefinitely"],
    correct: "Hot/warm/cold tiering + retention + ingest sampling",
    explanation: "Recent logs stay hot; older roll to cheaper warm/cold tiers; beyond retention they're archived/deleted, and sampling trims noisy logs at ingest." }),
  // Metrics
  pm("sysd_m11", { topicId: "sysd_m11_t4", exerciseId: "sysd_m11_t4_pm_d1", position: 11, level: "medium",
    title: "Storing metrics efficiently", scenario: "Millions of numeric points/sec, queried by time range. What storage fits?",
    options: ["A time-series database (append-only, compressed, range-optimized)", "A general relational table, row per point", "A document store", "A graph database"],
    correct: "A time-series database (append-only, compressed, range-optimized)",
    explanation: "Metrics are append-only series queried by range; a TSDB compresses heavily (delta-of-delta + XOR) and serves range/aggregation queries efficiently." }),
  pm("sysd_m11", { topicId: "sysd_m11_t4", exerciseId: "sysd_m11_t4_pm_d2", position: 12, level: "hard",
    title: "The silent scaling killer", scenario: "Adding which kind of label to a metric can explode the system?",
    options: ["A high-cardinality label like user_id or request_id", "A region label with 5 values", "A status_code label", "A service-name label"],
    correct: "A high-cardinality label like user_id or request_id",
    explanation: "Each unique metric+label combo is a series; an unbounded label (user_id) multiplies series into millions — cardinality, not point count, is the killer." }),
  pm("sysd_m11", { topicId: "sysd_m11_t4", exerciseId: "sysd_m11_t4_pm_d3", position: 13, level: "medium",
    title: "Keeping years of data cheaply", scenario: "You want long-term trends without storing full resolution forever. What helps?",
    options: ["Downsample into coarser rollups + retention tiers", "Keep every 15s point forever", "Delete all old data immediately", "Store raw points twice"],
    correct: "Downsample into coarser rollups + retention tiers",
    explanation: "Background rollups aggregate raw points to coarser resolution for long-term retention; high-res data is dropped after a window, bounding storage." }),
  // Saga
  pm("sysd_m19", { topicId: "sysd_m19_t1", exerciseId: "sysd_m19_t1_pm_d1", position: 11, level: "hard",
    title: "Consistency without 2PC", scenario: "Place-order spans payment, inventory, shipping (separate DBs). How do you stay consistent without a distributed ACID transaction?",
    options: ["A saga: local transactions each with a compensating action", "Two-phase commit across all services", "One giant database transaction", "Ignore partial failures"],
    correct: "A saga: local transactions each with a compensating action",
    explanation: "2PC blocks/locks across independent service DBs; a saga runs local commits and, on failure, compensates completed steps — eventual consistency." }),
  pm("sysd_m19", { topicId: "sysd_m19_t1", exerciseId: "sysd_m19_t1_pm_d2", position: 12, level: "medium",
    title: "Undoing a committed step", scenario: "Payment committed, then shipping failed. How do you roll back the payment?",
    options: ["Run its compensating action (refund) — you can't un-commit it", "Delete the payment row", "Roll back the database transaction", "Leave it and hope"],
    correct: "Run its compensating action (refund) — you can't un-commit it",
    explanation: "A committed local transaction can't be rolled back; the saga issues a semantic compensation (refund) for each completed step, in reverse order." }),
  pm("sysd_m19", { topicId: "sysd_m19_t1", exerciseId: "sysd_m19_t1_pm_d3", position: 13, level: "hard",
    title: "Surviving a crash mid-saga", scenario: "The orchestrator crashes while a saga is half-done. How is it recovered safely?",
    options: ["Persist saga state (resumable) + idempotent steps so re-invocation is safe", "Restart the saga from scratch always", "Mark it complete", "Drop it"],
    correct: "Persist saga state (resumable) + idempotent steps so re-invocation is safe",
    explanation: "Durable saga state lets the orchestrator resume in-flight sagas on restart; idempotent steps make re-invoking the current step (or compensating) safe." }),
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
  console.log(`✓ Depth batch 5 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
