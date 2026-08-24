/**
 * Seed — System Design DEPTH batch 3 (SD_DEPTH_STANDARD.md).
 *
 * Deepens 6 more canonical case studies to full framework depth, each block
 * `section`-tagged (requirements/estimation/hld/api/data_model/deep_dive x>=2/
 * bottlenecks), with an authored architecture SVG and 3 exercises.
 *
 *   sysd_m11_t2  Distributed Search Engine   (module sysd_m11)
 *   sysd_m8_t2   Distributed Message Queue   (module sysd_m8)
 *   sysd_m8_t3   Leaderboard                 (module sysd_m8)
 *   sysd_m3_t3   Notification System         (module sysd_m3)
 *   sysd_m9_t2   Payment System              (module sysd_m9)
 *   sysd_m9_t3   Google Maps (Routing)       (module sysd_m9)
 *
 * Idempotent upsert by id; recomputes totals. Verify:
 *   node config/auditSysdDepth.mjs --require sysd_m11_t2,sysd_m8_t2,sysd_m8_t3,sysd_m3_t3,sysd_m9_t2,sysd_m9_t3
 * Usage: node config/seedSysdDepthBatch3.js  ·  npm run seed:sysd-depth-3
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";

// ── SVG builder (well-formed by construction) ────────────────────────────────
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
  search: svg(820, 280,
    box(20, 110, 90, 56, "Client", "query") +
    box(150, 110, 120, 56, "Query svc", "scatter-gather", "#f0fdf4") +
    box(320, 30, 130, 48, "Index shard 1", "", "#fce7f3") +
    box(320, 95, 130, 48, "Index shard 2", "", "#fce7f3") +
    box(320, 160, 130, 48, "Index shard N", "", "#fce7f3") +
    box(510, 95, 120, 56, "Rank + merge", "top-k", "#ede9fe") +
    box(680, 30, 120, 48, "Indexer", "build", "#fef9c3") +
    box(680, 110, 120, 48, "Doc corpus", "") +
    arrow(110, 138, 150, 138) +
    arrow(270, 125, 320, 54) + arrow(270, 138, 320, 119) + arrow(270, 150, 320, 184) +
    arrow(450, 54, 510, 110, "postings") + arrow(450, 184, 510, 140) +
    arrow(680, 134, 450, 175, "inverted index", true) +
    note(420, 270, "Scatter query to shards -> gather + rank -> merge top-k")),
  mq: svg(820, 270,
    box(20, 40, 100, 50, "Producer A", "") +
    box(20, 170, 100, 50, "Producer B", "") +
    box(170, 95, 150, 80, "Broker: topic", "partitions P0..P2", "#ede9fe") +
    box(360, 30, 120, 44, "P0 log", "append-only", "#fef9c3") +
    box(360, 95, 120, 44, "P1 log", "replicated", "#fef9c3") +
    box(360, 160, 120, 44, "P2 log", "", "#fef9c3") +
    box(540, 60, 130, 50, "Consumer grp 1", "offsets", "#f0fdf4") +
    box(540, 150, 130, 50, "Consumer grp 2", "offsets", "#f0fdf4") +
    arrow(120, 65, 170, 110, "key->partition") + arrow(120, 195, 170, 150) +
    arrow(320, 110, 360, 52) + arrow(320, 130, 360, 117) + arrow(320, 150, 360, 182) +
    arrow(480, 60, 540, 85, "poll") + arrow(480, 175, 540, 175) +
    note(430, 260, "Order within a partition; consumers track offsets; replicas for durability")),
  leader: svg(820, 230,
    box(20, 85, 100, 56, "Client", "score+1") +
    box(170, 85, 140, 56, "Leaderboard API", "", "#f0fdf4") +
    box(360, 30, 170, 60, "Redis Sorted Set", "ZADD / ZREVRANGE", "#fce7f3") +
    box(360, 140, 170, 56, "Backing DB", "durability", "#eff6ff") +
    box(580, 30, 130, 60, "Top-k / rank", "O(log n + k)", "#ede9fe") +
    arrow(120, 113, 170, 113) +
    arrow(310, 100, 360, 70, "update") +
    arrow(530, 60, 580, 60, "query") +
    arrow(445, 90, 445, 140, "persist", true) +
    note(430, 220, "Sorted set: O(log n) update, O(log n + k) rank/top-k")),
  notif: svg(820, 290,
    box(20, 110, 100, 56, "Event src", "") +
    box(150, 110, 130, 56, "Notif svc", "dedupe+prefs", "#f0fdf4") +
    box(320, 110, 110, 56, "Queue", "priority", "#fef9c3") +
    box(470, 25, 110, 46, "Push wkr", "", "#ede9fe") +
    box(470, 92, 110, 46, "Email wkr", "", "#ede9fe") +
    box(470, 159, 110, 46, "SMS wkr", "", "#ede9fe") +
    box(630, 25, 120, 46, "APNs/FCM", "", "#fce7f3") +
    box(630, 92, 120, 46, "Email gw", "", "#fce7f3") +
    box(630, 159, 120, 46, "SMS gw", "", "#fce7f3") +
    arrow(120, 138, 150, 138) + arrow(280, 138, 320, 138) +
    arrow(430, 120, 470, 48) + arrow(430, 138, 470, 115) + arrow(430, 155, 470, 182) +
    arrow(580, 48, 630, 48) + arrow(580, 115, 630, 115) + arrow(580, 182, 630, 182) +
    note(420, 280, "Fan out per channel via workers -> provider gateways; retries + DLQ")),
  pay: svg(820, 260,
    box(20, 100, 100, 56, "Client", "") +
    box(150, 100, 130, 56, "Payment svc", "", "#f0fdf4") +
    box(320, 30, 140, 48, "Idempotency", "key dedupe", "#fef9c3") +
    box(320, 100, 140, 48, "Ledger", "double-entry", "#fce7f3") +
    box(320, 170, 140, 48, "PSP adapter", "Stripe/bank", "#ede9fe") +
    box(520, 170, 120, 48, "PSP", "external") +
    box(520, 30, 130, 48, "Reconciliation", "job", "#eff6ff") +
    arrow(120, 128, 150, 128) +
    arrow(280, 115, 320, 54, "check") + arrow(280, 128, 320, 124) + arrow(280, 145, 320, 194) +
    arrow(460, 194, 520, 194, "charge") + arrow(520, 170, 460, 60, "webhook", true) +
    note(420, 250, "Idempotency key -> immutable double-entry ledger -> PSP; reconcile async")),
  maps: svg(820, 250,
    box(20, 95, 90, 56, "Client", "A -> B") +
    box(140, 95, 130, 56, "Routing svc", "Dijkstra/A*", "#f0fdf4") +
    box(310, 30, 160, 52, "Road graph", "nodes+edges", "#fce7f3") +
    box(310, 150, 160, 52, "Precompute", "CH / regions", "#ede9fe") +
    box(520, 30, 150, 52, "Edge weights", "= travel time", "#fef9c3") +
    box(520, 150, 150, 52, "Traffic pipeline", "GPS aggregates", "#eff6ff") +
    arrow(110, 123, 140, 123, "route?") +
    arrow(270, 110, 310, 60) + arrow(270, 135, 310, 175, "speedups") +
    arrow(470, 56, 520, 56, "weighted") +
    arrow(520, 176, 470, 70, "live update", true) +
    note(420, 240, "Graph + precomputation for fast queries; weights from live traffic")),
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
  // ─────────────────────────── SEARCH ENGINE ───────────────────────────────
  TT("sysd_m11", "sysd_m11_t2", 2, "Design a Distributed Search Engine", "design-search-engine",
    ["case-study", "search", "inverted-index", "ranking"],
    "A user types a few words and expects the most relevant documents out of billions, ranked, in well under a second. You can't scan billions of documents per query — so what data structure makes a keyword search instant, and how is it spread across machines?",
    "The core structure is an INVERTED INDEX: term -> a posting list of the documents containing it, so a query is a fast lookup-and-intersect instead of a scan. The index is sharded across machines; a query is SCATTERED to all shards, each returns its best matches, and the results are GATHERED, RANKED (BM25/TF-IDF + signals), and merged. Indexing is an offline pipeline; querying is read-optimized retrieval + ranking.",
    [
      C("requirements", "Requirements",
        "Functional: given a text query, return the most relevant documents ranked, with pagination; ingest and index a large corpus; keep results reasonably fresh as documents change; ideally support phrases, filters, and typo tolerance. Non-functional: very low query latency (sub-second p99), extremely read-heavy, scale to billions of documents and high query QPS, high availability, and good relevance (the quality bar — wrong-but-fast is useless). Clarify scope up front: web search vs a product/document catalog (changes ranking signals and freshness needs), and how fresh results must be (seconds vs hours). The two hard problems are retrieval at scale (you cannot scan billions of docs per query, so you need an index that turns a query into a bounded lookup) and ranking (choosing the best few from many candidates). Everything else — crawling, storage, serving — supports these two."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 10B documents, avg 1 KB of indexable text.\n  raw text   = 10B * 1 KB = 10 TB; the inverted index is a fraction of that\n  index size ~= a few TB -> must be SHARDED across many nodes\nQueries: 100k queries/sec at peak (read-dominated).\n  fan-out: each query scatters to all shards -> shard count drives tail latency\nFreshness: re-index changed docs continuously; full rebuilds are periodic.\nTakeaway: index is too big for one node (shard it), queries are high-QPS\n(replicate shards + cache), and tail latency is set by the slowest shard."),
      C("hld", "High-level design",
        "Two pipelines. Indexing (offline/continuous): a crawler/ingest feeds documents to an INDEXER that tokenizes text and builds the inverted index (term -> posting list of doc ids + positions), partitioned into shards and written to the serving fleet; document metadata goes to a doc store. Serving (online): a query service parses the query, then SCATTERS it to every index shard; each shard looks up the query terms in its inverted index, intersects/scores its local postings, and returns its top candidates; the query service GATHERS these, applies final ranking, merges to the global top-k, and fetches snippets from the doc store. A result cache fronts popular queries. Trace one search: parse -> scatter to N shards -> each returns local top matches -> gather -> rank/merge -> return page 1. The expensive relevance work is split between cheap per-shard retrieval and a focused final ranking over a small candidate set."),
      K("api", "API design",
        "GET /api/v1/search?q=<query>&page=0&size=10\n  200: { results: [ { docId, title, snippet, score } ], total, nextPage }\n\nInternal (indexing):\n  index(docId, text)   -> tokenize -> update postings on the owning shard\n  delete(docId)        -> tombstone in postings\nQuery flow: queryService.scatter(q) -> [shard.topK(q)] -> gather+rank -> page"),
      K("data_model", "Data model",
        "inverted index (per shard):\n  term -> postings: [ { doc_id, term_freq, positions[] } ]  (sorted by doc_id)\nterm dictionary:   term -> shard/offset (where its postings live)\ndoc store:         doc_id PK, url/title, stored fields, snippet source\nsharding:          by DOCUMENT (each shard indexes a subset of docs) -> scatter-gather\ncache:             query -> ranked result page (LRU, hot queries)"),
      C("deep_dive", "Deep dive: the inverted index & sharding",
        "A FORWARD index (doc -> its words) forces a full scan to answer 'which docs contain X'. The INVERTED index flips it: term -> the list of docs containing it (a posting list), so a multi-word query becomes: fetch each term's postings and INTERSECT them (AND) or union them (OR) — bounded by posting-list size, not corpus size. Postings are kept sorted by doc id for fast intersection and are compressed (delta/gap encoding) since they're huge. Sharding: at billions of docs the index can't live on one machine, so partition BY DOCUMENT — each shard holds the full inverted index for its subset of docs. A query must therefore SCATTER to all shards (each searches its own docs) and the results GATHER — this document-partitioning is simple and balances load, at the cost of every query touching every shard. (The alternative, term-partitioning, sends a query only to shards holding its terms but creates hot terms and complex multi-term queries — document-partitioning is the common choice.)"),
      C("deep_dive", "Deep dive: ranking & relevance",
        "Retrieval finds candidates; RANKING orders them, and relevance is what users judge. The classic scoring is TF-IDF / BM25: a term matters more if it appears often in a document (term frequency) but less if it's common across the corpus (inverse document frequency), with BM25 adding length normalization and saturation. Real systems run TWO PHASES: a cheap retrieval/first-pass score per shard to get a candidate set, then an expensive re-ranking of that small set in the query service using richer signals (popularity, freshness, click-through, personalization, and increasingly ML/learning-to-rank models). Splitting into a cheap wide pass and an expensive narrow pass is what keeps latency low while allowing sophisticated ranking. Phrase and proximity queries use the positions stored in postings; typo tolerance adds fuzzy/n-gram matching on the term dictionary."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Scatter-gather makes TAIL LATENCY the enemy: a query is only as fast as the slowest of N shards, so more shards means lower per-shard work but higher chance of a slow one — mitigate with shard replication (hedged/parallel requests to replicas, take the first) and capping shard count. Index size forces sharding and compression; replication multiplies storage but is needed for QPS and availability. Freshness vs cost: continuous incremental indexing keeps results current but adds write load; full rebuilds are cheaper to reason about but lag. Hot queries hammer the system — a result cache absorbs them. Trade-offs: document-partition (simple, every query scatters) vs term-partition (less fan-out, hot terms); BM25 (cheap, decent) vs ML re-ranking (better, costlier); fresh (incremental, complex) vs simple (batch, laggy). Closing signal: a sharded inverted index searched by scatter-gather, with two-phase ranking and replication for tail latency."),
      C("deep_dive", "Deep dive: serving, freshness & operations",
        "Operationally, search is a large read-serving system. Replication: each index shard has replicas both for availability and to spread query load; the query service load-balances and can issue hedged requests to beat tail latency. Caching: a result cache for popular queries and a posting-list cache for hot terms cut work dramatically given the heavy-tailed query distribution. Freshness: a continuous indexing path applies document changes to live shards (often as a small, frequently-merged 'fresh' segment layered over large static segments — the LSM-like idea), while periodic full rebuilds keep segments compact. Capacity: scale query throughput by adding shard replicas; scale corpus size by adding shards (and re-partitioning). Observability: query latency p50/p99, per-shard latency, cache hit rate, and relevance metrics (click-through, dwell) are the SLOs — note that relevance is measured, not assumed. Multi-region: replicate the index per region for latency and resilience. The throughline: cheap wide retrieval over a sharded inverted index, focused ranking, and aggressive replication/caching to hold latency under load."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How do you keep it fresh?' incremental indexing into a small fresh segment merged periodically (LSM-style), not a full rebuild per change. 'Phrase/proximity search?' use term positions stored in postings. 'Typos/fuzzy?' n-gram or edit-distance matching on the term dictionary. 'Autocomplete?' a separate trie/typeahead system. 'Personalized or ML ranking?' a learning-to-rank re-ranker over the candidate set with user/behavioral features. 'Reduce tail latency?' replicate shards and hedge requests. 'Huge OR queries / stopwords?' skip lists in postings and stopword handling. 'Multi-tenant/filters?' encode filters as additional posting lists intersected at query time. Each returns to the spine: an inverted index sharded by document, searched scatter-gather, with two-phase ranking and replication/caching for latency."),
    ],
    "A search engine tests the inverted index (term -> postings, intersect not scan), document-sharding with scatter-gather (and the tail-latency consequence), and two-phase ranking (cheap retrieval then focused BM25/ML re-rank). The signal is never scanning the corpus, recognizing tail latency as the scaling enemy, and separating retrieval from ranking.",
    [
      G("forward_scan", "Scanning documents (or a LIKE query) instead of using an inverted index.", "Build an inverted index (term -> postings) and intersect posting lists.", "Answers 'which docs contain X' by scanning docs."),
      G("ignore_tail", "Ignoring scatter-gather tail latency across shards.", "Replicate shards and hedge requests; cap shard count; cache hot queries.", "No mention that a query waits on the slowest shard."),
      G("retrieve_eq_rank", "Conflating retrieval with ranking / single-pass scoring of everything.", "Two phases: cheap per-shard retrieval, then focused re-ranking of candidates.", "Applies expensive ranking to all matches, not a candidate set."),
    ],
    0.6, DIAG.search, "Distributed search engine architecture"),

  // ────────────────────────── MESSAGE QUEUE ────────────────────────────────
  TT("sysd_m8", "sysd_m8_t2", 2, "Design a Distributed Message Queue", "design-distributed-mq",
    ["case-study", "message-queue", "kafka", "log"],
    "Producers fire millions of events per second; consumers must process them reliably, in order, even if they crash and restart — and you must be able to replay history. What underlying structure gives you durable, ordered, high-throughput messaging that decouples producers from consumers?",
    "An append-only, partitioned LOG (Kafka-style). A topic is split into PARTITIONS spread across brokers; producers append to a partition (chosen by key) and consumers read sequentially, tracking their OFFSET. Order is guaranteed within a partition; throughput scales by adding partitions; durability comes from replication; and because the log is retained, consumers can replay. Offsets + consumer groups give reliable, parallel, at-least-once delivery.",
    [
      C("requirements", "Requirements",
        "Functional: producers publish messages to a topic; consumers subscribe and process them; messages are durable (survive broker crashes); ordered (at least within a key/partition); replayable (a consumer can re-read from a past point); and consumers can scale out to share load. Non-functional: very high throughput (millions of msgs/sec), low end-to-end latency, horizontal scalability, fault tolerance (no data loss on a broker failure), and a clear delivery guarantee (at-least-once is the practical default). Clarify the delivery semantics expected (at-most / at-least / exactly-once) and ordering scope (global is impractical at scale; per-key/partition is the realistic guarantee). The purpose is DECOUPLING: producers and consumers don't call each other directly, the queue buffers spikes, and slow/failed consumers don't block producers. The design hinges on a durable, partitioned log plus offset tracking, and the recurring theme is that throughput, ordering, and parallelism are all governed by how you partition the topic and where you commit offsets."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 1M messages/sec, avg 1 KB each:\n  ingest = 1M * 1 KB = 1 GB/sec  -> ~86 TB/day before replication\n  with replication factor 3       -> ~260 TB/day of disk writes\nRetention 7 days at 1 GB/sec -> ~600 TB (x3 replicas) -> many broker disks\nPartitions: throughput / per-partition limit (~tens of MB/s) -> hundreds-thousands\nTakeaway: it's disk- and throughput-bound; sequential append + page cache make\ncommodity disks fast, and partitions are the unit of parallelism and ordering."),
      C("hld", "High-level design",
        "A topic is divided into PARTITIONS, each an append-only log file; partitions are distributed across BROKERS (and each partition is replicated to follower brokers). Producers pick a partition (by key hash for ordering, or round-robin for balance) and APPEND messages, which get a monotonically increasing offset. Consumers belong to a CONSUMER GROUP; the group's partitions are divided among its members so each partition is read by exactly one consumer in the group (parallelism), and each consumer tracks its committed OFFSET per partition so it can resume after a crash. A coordinator handles group membership and rebalancing. Trace a message: producer appends to partition P (key->P) on the leader broker -> replicated to followers -> a consumer in the group polls P from its last offset, processes, and commits the new offset. Reads and writes are sequential log operations, which is why it's fast. Note what the brokers deliberately do NOT do: there is no per-message acknowledgement bookkeeping or random-access deletion as in a traditional queue — the broker just appends and serves byte ranges, and the CONSUMER owns its position (the offset). Pushing the 'where am I' state to the consumer is what lets one log serve many independent readers, support replay, and scale to millions of messages per second on commodity disks. A coordinator service tracks broker/partition leadership and consumer-group membership, and a metadata store holds the topic-to-partition-to-broker map clients use to route. This separation — dumb, fast, append-only brokers plus smart consumers tracking offsets — is the architectural heart of the design."),
      K("api", "API design",
        "Producer:\n  send(topic, key, value)  -> appended to partition = hash(key) % numPartitions\n                              returns (partition, offset)\nConsumer:\n  subscribe(topic, groupId)\n  poll() -> [ {partition, offset, key, value} ]\n  commit(partition, offset)   // mark progress; resume here after restart\nAdmin: createTopic(name, partitions, replicationFactor)"),
      K("data_model", "Data model",
        "partition log:  append-only sequence  [ offset -> {key, value, timestamp} ]\n  - offset is per-partition, monotonically increasing (the message's id)\nreplicas:       each partition has 1 leader + R followers (in-sync replica set)\nconsumer offsets: (groupId, topic, partition) -> committed offset\nretention:      delete/compact segments older than N days or by size\ntopic metadata: name -> partition count, replication factor, leader assignments"),
      C("deep_dive", "Deep dive: the partitioned log & ordering",
        "The log is the whole trick. Each partition is an APPEND-ONLY file: producers only add to the end, consumers read forward — both SEQUENTIAL disk access, which is dramatically faster than random IO and lets the OS page cache do the heavy lifting (commodity disks sustain huge throughput this way). Ordering: messages within ONE partition are strictly ordered by offset, but there is NO global order across partitions — so to keep related messages ordered (e.g. all events for one user), route them to the same partition via a partition KEY (hash(key) % partitions). This is the central trade-off: ordering is per-key, and parallelism is per-partition, so you choose partition count and keys to balance the two. Offsets make the log replayable: a consumer just sets its offset back to re-read history, and different consumer groups read the same log independently at their own offsets (one log, many independent readers)."),
      C("deep_dive", "Deep dive: delivery semantics, groups & replication",
        "Consumer GROUPS give parallelism with ordering: the group's partitions are distributed so each partition is consumed by exactly one member, and adding members (up to the partition count) scales throughput; when a member joins/leaves, the group REBALANCES partition ownership. Delivery semantics hinge on WHEN you commit the offset: commit after processing = at-least-once (a crash before commit means reprocessing — so make consumers idempotent); commit before processing = at-most-once (risk loss); exactly-once needs idempotent producers + transactional commits binding the offset commit to the output. Durability: each partition is replicated to followers; writes are acknowledged once the IN-SYNC REPLICA set has them, and on leader failure a follower is promoted — so a single broker loss never loses committed data. The combination — replicated partitioned log + per-group offsets + idempotent consumers — is what delivers reliable, ordered, high-throughput messaging."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "A HOT PARTITION (skewed keys) becomes the throughput ceiling and serializes that key's load — choose partition keys to spread evenly, or increase partitions. Consumer LAG (consumers slower than producers) grows the backlog — scale consumers up to the partition count (beyond that, you must add partitions), and monitor lag as the key health metric. Rebalancing pauses consumption briefly and can thrash if membership flaps — tune session timeouts. Retention storage is large — set retention by time/size and use log COMPACTION (keep only the latest value per key) for changelog topics. Trade-offs: more partitions (more parallelism + ordering granularity, but more overhead and rebalancing cost) vs fewer; at-least-once + idempotent consumers (simple, practical) vs exactly-once (stronger, complex/slower); long retention/replay (powerful, costly) vs short. Closing signal: a replicated, partitioned append-only log with key-based ordering, consumer-group offsets, and idempotent at-least-once consumers."),
      C("deep_dive", "Deep dive: operations & failure handling",
        "Operationally the queue must never lose acknowledged data and must degrade gracefully. Replication & acks: producers can require acks from all in-sync replicas (durable, slower) or just the leader (faster, riskier) — a tunable durability/latency knob. Failure: a dead broker triggers leader election among in-sync followers for its partitions; under-replicated partitions are re-replicated to restore the factor. Backpressure: when consumers fall behind, the buffer is the log itself (bounded by retention) — producers aren't blocked, but you must alert on lag and add capacity before retention expiry drops unread data. Poison messages: a message that always fails should go to a DEAD-LETTER topic after N retries so one bad record doesn't stall a partition. Ordering on retry: in-partition retries must preserve order or be funneled to a DLQ. Observability: throughput, end-to-end latency, consumer lag per group, under-replicated partitions, and rebalance frequency are the SLOs. The spine holds: partitioned replicated log, offsets for progress/replay, groups for parallelism, idempotent consumers + DLQ for reliability."),
    ],
    "A message queue tests the append-only partitioned log: ordering per partition (via key), parallelism per partition (consumer groups), durability via replication, and replay via offsets. The signal is choosing per-key ordering over impractical global order, committing offsets for at-least-once with idempotent consumers, and naming hot partitions / consumer lag as the bottlenecks.",
    [
      G("global_order", "Promising global ordering across the whole topic.", "Guarantee order only within a partition; route related messages by key.", "Claims total ordering at high throughput."),
      G("no_offsets", "No offset tracking, so consumers can't resume or replay after a crash.", "Track committed offsets per (group, partition); resume from last commit.", "Consumers re-read from start or lose place on restart."),
      G("delivery_handwave", "Hand-waving delivery semantics / ignoring reprocessing.", "Commit after processing for at-least-once + make consumers idempotent.", "No mention of duplicates or commit timing."),
    ],
    0.6, DIAG.mq, "Distributed message queue architecture"),

  // ───────────────────────────── LEADERBOARD ───────────────────────────────
  TT("sysd_m8", "sysd_m8_t3", 3, "Design a Leaderboard", "design-leaderboard",
    ["case-study", "leaderboard", "sorted-set", "ranking"],
    "Millions of players, scores changing constantly, and everyone wants to see the top 100 and their own rank — live. Recomputing a global sort on every score change or query is hopeless. What structure gives you O(log n) updates AND fast rank/top-k reads?",
    "A SORTED SET (e.g. Redis ZSET), which keeps members ordered by score with O(log n) inserts/updates and O(log n + k) range and rank queries — backed by a skip list. Updates are ZADD/ZINCRBY; the top-k is ZREVRANGE; a user's rank is ZREVRANK. For durability it's backed by a database; for billions of entries or time windows it's sharded/approximated. It's a read+write-optimized ranking structure.",
    [
      C("requirements", "Requirements",
        "Functional: maintain scores for many players; return the top-k (e.g. top 100); return a given player's rank; update a score in real time; optionally support time-windowed boards (daily/weekly) and ranges around a player ('players near me'). Non-functional: low-latency updates and queries (scores change constantly and the board is viewed constantly), scale to millions or more players, high availability, and durability of scores. Clarify scope: exact vs approximate rank (exact rank at billions is expensive), global vs segmented (per-region/per-league) boards, and whether boards reset on a time window. The naive approaches both fail: a SQL ORDER BY on every query rescans, and recomputing rank on every score change is O(n). You need a structure that keeps order incrementally and answers rank/top-k cheaply — a sorted set."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 10M active players, scores updated ~1/min at peak:\n  updates = 10M / 60 ~= 167k updates/sec  -> needs O(log n) per update\n  rank/top-k queries: ~tens of thousands/sec\nMemory (Redis ZSET): ~ (member + score + skiplist overhead) ~= 60-100 B/entry\n  10M * ~80 B ~= 0.8 GB -> fits in memory on one node; billions -> shard\nTakeaway: in-memory sorted set handles millions easily; the scaling question\nis billions of entries and exact global rank, which need sharding/approximation."),
      C("hld", "High-level design",
        "The leaderboard service fronts an in-memory SORTED SET keyed by leaderboard id, storing member=playerId with score=points. A score change does ZINCRBY/ZADD (O(log n)); the top-k is ZREVRANGE 0 k (O(log n + k)); a player's rank is ZREVRANK (O(log n)); 'players near me' is ZREVRANGE around the player's rank. Scores also persist to a durable database (write-through or periodic snapshot) so the board can be rebuilt if the cache is lost. For huge or windowed boards, multiple sorted sets are used (e.g. one per time window, sharded by range). Trace an update: player scores points -> service ZINCRBYs the sorted set (instant new position) -> async persist to the DB -> any top-k/rank query reads the sorted set directly. The sorted set is the live source for reads; the DB is durability."),
      K("api", "API design",
        "POST /api/v1/leaderboards/{id}/scores { userId, delta }   // ZINCRBY\n  -> { newScore, newRank }\nGET  /api/v1/leaderboards/{id}/top?k=100   -> [ {userId, score, rank} ]\nGET  /api/v1/leaderboards/{id}/rank/{userId} -> { score, rank }\nGET  /api/v1/leaderboards/{id}/around/{userId}?range=5 -> neighbors\n(backed by ZADD/ZINCRBY, ZREVRANGE, ZREVRANK on a Redis sorted set)"),
      K("data_model", "Data model",
        "sorted set (Redis):  lb:{id} = ZSET { member: userId, score: points }\n  ZINCRBY lb:{id} delta userId   // update\n  ZREVRANGE lb:{id} 0 99 WITHSCORES  // top 100\n  ZREVRANK lb:{id} userId        // rank (0-based)\nbacking DB:   (leaderboard_id, user_id) -> score, updated_at  (durability)\nwindowed:     lb:{id}:2026-06-06 (daily), lb:{id}:weekly ...  (separate ZSETs)"),
      C("deep_dive", "Deep dive: the sorted set under the hood",
        "A sorted set keeps members ordered by score and supports the three operations a leaderboard needs in logarithmic time, which is the whole reason it fits. Internally (Redis) it's a SKIP LIST plus a hash map: the skip list maintains sorted order with O(log n) insert/delete/rank, and the hash map gives O(1) member->score lookup. ZADD/ZINCRBY update a member's score and reposition it in O(log n); ZREVRANGE walks the skip list from the top to return the top-k in O(log n + k); ZREVRANK computes a member's position using span counts in O(log n). Crucially, you never re-sort — each update incrementally maintains order — which is why 167k updates/sec is fine. Ties (equal scores) are broken by member order; if you need a deterministic tiebreak (e.g. who reached the score first) encode it into the score (score.timestamp) or a composite. This single structure replaces both 'sort on read' and 'recompute rank on write'."),
      C("deep_dive", "Deep dive: scaling to billions & windows",
        "One sorted set on one node handles millions; the hard cases are billions of entries and exact global rank. Options: (1) Segment the boards — most products don't need a single global ranking of a billion users; per-region, per-league, or top-N-only boards keep each sorted set small (a global top-1000 plus the player's local board covers the real UX). (2) Shard by score range across nodes (each node owns a score band); top-k reads the highest band, but a global rank must sum counts across bands. (3) APPROXIMATE rank for the long tail — exact rank matters near the top; for rank #4,212,889 an approximation (via histograms/percentiles of the score distribution) is fine and O(1). Time-windowed boards use a separate sorted set per window (daily key with TTL), and 'all-time' is its own set; resetting is just pointing at a new key. The trade-off is exactness vs cost: exact near the top (cheap, small set), approximate in the tail (cheap, good enough)."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Memory bounds a single sorted set — millions fit, billions need sharding or segmentation. Hot updates to one board concentrate writes on one node — shard or accept the single-node write ceiling (it's high). Exact global rank at billions is the expensive operation — segment or approximate it. A celebrity score change near the top causes many rank shifts — usually fine since the structure is incremental. Durability: the sorted set is in memory, so persist to a DB (write-through or snapshots) and rebuild on loss. Trade-offs: exact rank (precise, costly at scale) vs approximate (O(1), good enough in the tail); single global board (simple, doesn't scale to billions) vs segmented (scales, more pieces); in-memory speed vs durability (back it with a DB). Closing signal: an in-memory sorted set (O(log n) update, O(log n + k) top-k/rank) backed by a DB, segmented/approximated for billions and per-window for time-bounded boards."),
      C("deep_dive", "Deep dive: durability, windows & operations",
        "Operationally a leaderboard is an in-memory structure that must survive restarts and stay correct. Durability: persist every score change to a database (write-through for safety, or buffered/periodic snapshots for throughput) so the sorted set can be rebuilt after a crash or failover; Redis persistence (AOF/RDB) plus replicas reduces rebuild need. Availability: a replica of the sorted-set node takes over on failure; reads can be served from replicas. Time windows: daily/weekly boards are separate keyed sorted sets with TTLs, computed as scores arrive (write to both the all-time and the current-window set), so a reset is just rolling to a new window key — no expensive recompute. Anti-cheat/integrity: validate score deltas server-side (never trust the client) and rate-limit updates to stop score inflation. Observability: update latency, top-k/rank query latency, sorted-set memory/size, and persistence lag are the SLOs. The spine holds: a sorted set for live ranking, a DB for durability, segmentation/approximation for billions, and per-window keys for time-bounded boards."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'A user's exact rank among a billion?' segment (global top-N + local board) or approximate via score-distribution percentiles. 'Daily/weekly resets?' separate per-window sorted sets with TTL, written alongside the all-time set. 'Players near me?' ZREVRANGE a small range around the player's rank. 'Ties?' encode a tiebreak (timestamp) into the score. 'Durability / crash?' write-through to a DB + replicas; rebuild on loss. 'Anti-cheat?' server-side validation + rate limits on updates. 'Multi-region?' per-region boards merged for a global view, or a single authoritative region for the global set. 'Huge fan-in of updates?' batch/coalesce increments. Each returns to the spine: an in-memory sorted set for O(log n) ranking, backed by a DB, segmented/approximated and windowed as scale and product demand."),
    ],
    "A leaderboard tests knowing the right data structure: a sorted set (skip list) giving O(log n) updates and O(log n + k) rank/top-k, backed by a DB for durability, and segmented/approximated for billions plus per-window keys for resets. The signal is rejecting sort-on-read and recompute-on-write in favor of an incrementally-ordered structure.",
    [
      G("sort_on_read", "Running ORDER BY / re-sorting on every query or recomputing rank on every update.", "Use a sorted set (ZSET): incremental O(log n) updates, O(log n + k) reads.", "Sorts the whole set per query or scans to compute rank."),
      G("no_durability", "Keeping scores only in memory with no durable backing.", "Persist score changes to a DB (write-through/snapshots) and rebuild on loss.", "No database behind the in-memory structure."),
      G("exact_rank_billions", "Insisting on exact global rank for billions of players.", "Segment (global top-N + local) or approximate tail rank via percentiles.", "Computes exact rank across a billion entries per query."),
    ],
    0.5, DIAG.leader, "Leaderboard architecture"),

  // ──────────────────────── NOTIFICATION SYSTEM ────────────────────────────
  TT("sysd_m3", "sysd_m3_t3", 3, "Design a Notification System at Scale", "sysd-notifications",
    ["case-study", "notifications", "fan-out", "channels"],
    "One event ('your order shipped', or a breaking-news alert to 50M users) must reach people across push, email, SMS, and in-app — respecting their preferences, never duplicating, and not collapsing when a provider is slow. How do you fan out reliably across channels at scale?",
    "An event enters a notification service that resolves recipients and CHANNELS, applies preferences/dedupe/rate-limits, and enqueues per-channel jobs; CHANNEL WORKERS pull from queues and call third-party gateways (APNs/FCM, email, SMS) with retries and failover. A template service renders content; a delivery log tracks status. The substance is reliable multi-channel fan-out, respecting opt-outs, and absorbing provider failures asynchronously.",
    [
      C("requirements", "Requirements",
        "Functional: send notifications triggered by events across multiple CHANNELS (push, email, SMS, in-app); support templates/personalization; honor user PREFERENCES and opt-outs (and legal unsubscribe); deduplicate (don't send the same alert twice); rate-limit per user (no spam); and support priority (an OTP beats a marketing blast). Non-functional: high throughput with large fan-out (one event can target millions), reliable delivery with retries, low latency for urgent messages, and good deliverability (don't get marked spam). Clarify scope: transactional (OTP, receipts — must arrive, high priority) vs marketing/broadcast (huge fan-out, best-effort). The hard parts are fanning out reliably across third-party providers you don't control (they fail, throttle, and vary), and enforcing preferences/dedupe/rate-limits so users are reached appropriately, not spammed. A useful framing to state early: the system is a reliable, policy-gated fan-out pipe — it must deliver across heterogeneous, unreliable channels at bursty scale while respecting per-user rules, which means async queues, idempotency, and per-channel isolation are structural requirements, not afterthoughts."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100M users, avg 5 notifications/user/day -> 500M/day\n  avg = 500M / 86400 ~= 5,800/sec ; but BROADCASTS spike massively:\n  one alert to 50M users = 50M sends to fan out in minutes -> bursty\nPer send: a queued job + a gateway call (tens-hundreds of ms, provider-bound).\nProvider rate limits cap per-channel throughput -> shape with queues + workers.\nTakeaway: steady rate is modest, but broadcast fan-out is bursty -> a queue +\nscalable per-channel workers absorb spikes within provider rate limits."),
      C("hld", "High-level design",
        "Producers emit events to a NOTIFICATION SERVICE (often via a queue). It resolves the target users, looks up each user's channel PREFERENCES, checks DEDUPE (idempotency key) and RATE LIMITS, renders content via a TEMPLATE service, and enqueues a per-(user, channel) job onto channel-specific queues. CHANNEL WORKERS (push/email/SMS/in-app pools) pull jobs and call the corresponding third-party GATEWAY (APNs/FCM, an email provider, an SMS provider), with retries/backoff and provider failover; results update a DELIVERY LOG (sent/delivered/failed). Trace an event: event -> notification service (resolve recipients, apply prefs/dedupe/rate-limit, render) -> enqueue per-channel jobs -> workers call gateways with retries -> log delivery + receipts. The queue decouples the spiky fan-out from the rate-limited providers, and per-channel workers isolate one slow provider from the others. Two sub-systems support this: a PREFERENCE service (the user's per-channel, per-category opt-ins and quiet hours) consulted before every send, and a TEMPLATE service that renders channel-specific content (a push title, an email body, an SMS line) from a template id + data, so producers send structured events, not pre-formatted strings. A DELIVERY LOG records the status of each (notification, channel) so you can answer 'did it arrive?' and drive receipts. The recurring theme is separation of concerns: the service decides WHO/WHAT/WHETHER (recipients, content, preferences, dedupe), while per-channel workers handle the unreliable HOW (calling providers), connected by durable queues so neither a broadcast spike nor a provider outage can take the system down."),
      K("api", "API design",
        "POST /api/v1/notify\n  { userId | segment, type, data, channels?: ['push','email'], priority?, idempotencyKey }\n  -> 202 Accepted { notificationId }   (async; status via webhook/log)\nGET  /api/v1/notifications/{id}/status -> { perChannel: { push:'delivered', email:'sent' } }\nUser prefs:\n  PUT /api/v1/users/{id}/preferences { push:true, email:false, sms:true, categories:{...} }"),
      K("data_model", "Data model",
        "notifications:   id PK, user_id, type, payload, priority, idempotency_key, created_at\ndelivery_status: (notification_id, channel) -> sent|delivered|failed, attempts, provider_msg_id\npreferences:     user_id PK, channel flags, per-category opt-ins, quiet hours\ntemplates:       template_id -> per-channel rendering (subject/body/placeholders)\ndedupe:          idempotency_key -> notification_id (so retries don't double-send)"),
      C("deep_dive", "Deep dive: channel fan-out & provider reliability",
        "Each channel is a separate world with its own gateway, format, and failure modes, so model channels independently: per-channel queues and worker pools mean a slow SMS provider doesn't back up push. Workers call third-party gateways (APNs/FCM for push, an ESP for email, an SMS aggregator) which you DON'T control — they throttle, return transient errors, and occasionally go down. Handle this with retries + exponential backoff for transient failures, a DEAD-LETTER queue after N attempts, and PROVIDER FAILOVER (a secondary SMS/email provider you can switch to). Respect provider RATE LIMITS by pacing workers (token-bucket per provider) so you don't get blocked. Broadcast fan-out (one event -> millions) is expanded asynchronously: the service enqueues work in batches and workers drain it within rate limits, so a 50M-user alert spreads over minutes rather than overwhelming anything. Delivery receipts (where the channel supports them) flow back to update status."),
      C("deep_dive", "Deep dive: preferences, dedupe, rate-limiting & priority",
        "Reaching users correctly is as important as reaching them fast. PREFERENCES: before sending, check the user's per-channel and per-category opt-ins, quiet hours, and legal unsubscribe state — a suppressed channel is dropped early (cheap) rather than sent and bounced. DEDUPE: an idempotency key per logical notification ensures retries, duplicate events, or multiple triggers don't double-send — the service records the key and short-circuits repeats (the same idempotency discipline as payments). RATE LIMITING: cap notifications per user per window (the rate-limiter design) so a buggy producer or a flood of events doesn't spam someone; coalesce/bundle when appropriate ('3 new messages' instead of 3 pushes). PRIORITY: urgent transactional messages (OTP, security) use a high-priority queue/path that bypasses batching, while marketing flows through best-effort queues — so a broadcast never delays a login code. Together these turn a raw send-everything pipe into a respectful, reliable system."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Third-party providers are the binding constraint: their rate limits cap throughput (pace workers), their outages require failover (multi-provider), and their async receipts arrive out of order (treat status as eventually consistent). Broadcast fan-out is bursty — the queue + autoscaled workers absorb it, but a giant blast can starve other traffic, so isolate priorities. Dedupe and preference lookups are on the hot path — cache them. Deliverability (spam folder, carrier filtering) is a real failure mode beyond 'sent'. Trade-offs: per-channel isolation (resilient, more moving parts) vs one pipe (simpler, fragile); at-least-once + idempotency (no loss, possible dup suppressed by dedupe) vs at-most-once; immediate send (low latency, more sends) vs batching/coalescing (fewer, less spammy, slight delay); single provider (simple) vs multi-provider failover (resilient, complex). Closing signal: event -> service applying prefs/dedupe/rate-limit -> per-channel queues + workers -> gateways with retries/failover, status tracked. The discriminating insight is treating the channels and their providers as unreliable, rate-limited, and independent, so the architecture isolates them behind durable queues and gates every send through user policy before it ever reaches a provider."),
      C("deep_dive", "Deep dive: reliability, monitoring & operations",
        "Operationally the system must not silently drop notifications. Reliability: every send is a queued job with retries + backoff; exhausted jobs go to a DEAD-LETTER queue for inspection/replay rather than vanishing; idempotency keys make retries safe. Failure isolation: per-channel and per-provider queues mean one provider's outage degrades only that channel; circuit breakers stop hammering a dead provider and trip failover. Status & receipts: a delivery log records sent/delivered/failed per channel; provider webhooks update it asynchronously (out-of-order, so upserts keyed by provider message id). Quiet hours & batching: schedule non-urgent sends to respect time zones and bundle to reduce fatigue. Compliance: honor unsubscribe immediately and record consent (legal requirement for email/SMS). Observability: send rate, delivery rate per channel/provider, failure/bounce rate, queue depth (broadcast backlog), and time-to-deliver for urgent messages are the SLOs. The spine holds: async per-channel fan-out with retries/DLQ/failover, gated by preferences/dedupe/rate-limits, with delivery tracked end to end."),
    ],
    "A notification system tests reliable multi-channel fan-out: per-channel queues + workers calling third-party gateways with retries/failover, gated by preferences, dedupe (idempotency), rate-limiting, and priority. The signal is treating providers as unreliable and rate-limited, isolating channels, and respecting opt-outs/dedupe rather than blasting.",
    [
      G("sync_fanout", "Sending to all channels/recipients synchronously in the request.", "Enqueue per-channel jobs and fan out asynchronously with workers.", "Broadcast loops over recipients inline and calls gateways directly."),
      G("ignore_prefs_dedupe", "Ignoring user preferences/opt-outs and duplicate suppression.", "Check preferences and an idempotency key before sending; rate-limit per user.", "No preference check or dedupe; can double-send/spam."),
      G("provider_naive", "Assuming third-party gateways are reliable and unlimited.", "Add retries/backoff, dead-letter, provider failover, and rate pacing.", "No retry/failover; provider outage loses notifications."),
    ],
    0.6, DIAG.notif, "Notification system architecture"),

  // ───────────────────────────── PAYMENT SYSTEM ────────────────────────────
  TT("sysd_m9", "sysd_m9_t2", 2, "Design a Payment System", "design-payment-system",
    ["case-study", "payments", "ledger", "idempotency"],
    "Money is on the line: a network retry must never double-charge, every cent must be auditable, and you depend on external banks/processors that fail and respond out of order. How do you move money correctly across unreliable systems?",
    "Two non-negotiables: IDEMPOTENCY (an idempotency key so a retried request charges exactly once) and a double-entry LEDGER (immutable, balanced entries in integer money — the auditable source of truth). Payments integrate external processors (PSPs) asynchronously via webhooks, often as a SAGA with compensations, and a RECONCILIATION job continuously checks your ledger against the PSP. Correctness and auditability beat raw throughput here.",
    [
      C("requirements", "Requirements",
        "Functional: charge a customer, refund, and record every movement of money; integrate external payment processors / banks; handle multi-step flows (authorize -> capture); produce statements and support reconciliation/disputes. Non-functional: CORRECTNESS above all (no double-charge, no lost money), durability and auditability (an immutable record of every transaction), idempotency (safe retries), strong consistency for balances, and security/compliance (PCI). Throughput matters but is secondary to never being wrong about money. Clarify scope: are you the processor or integrating one (usually integrating a PSP like Stripe/bank rails)? This is a CP system by nature — when in doubt, reject or hold rather than risk an incorrect charge. The defining challenges are exactly-once money movement across unreliable external systems and a tamper-evident audit trail."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 10M payments/day:\n  avg = 10M / 86400 ~= 116 payments/sec ; peak (sales) ~ thousands/sec\nEach payment -> several immutable ledger entries (debit + credit, fees, tax).\nStorage is modest but RETAINED for years (audit/legal) and never mutated.\nLatency budget is generous (a charge taking ~1s is fine); CORRECTNESS is the\nhard requirement, not QPS. PSP calls dominate latency and are async/webhook-based.\nTakeaway: not a throughput problem — it's a correctness, idempotency, and\nconsistency problem on top of unreliable external processors."),
      C("hld", "High-level design",
        "A payment request hits the payment service with an IDEMPOTENCY KEY; the service first checks the key — if seen, it returns the prior result (no re-charge); otherwise it records the intent, writes a pending entry to the LEDGER, and calls the PSP adapter to move money. PSP results arrive asynchronously via WEBHOOKS (authorized/captured/failed), which advance the payment state and post the final balanced ledger entries. Multi-step flows (authorize then capture, or charge then create order) run as a SAGA: each step has a compensating action (void/refund) on failure. A RECONCILIATION job periodically compares the ledger against the PSP's records to catch drift. Trace a charge: request + idempotency key -> dedupe check -> pending ledger entry -> PSP charge -> webhook confirms -> post debit/credit entries, mark succeeded (or compensate on failure). The ledger is the source of truth; the PSP is the external mover; idempotency guards every step."),
      K("api", "API design",
        "POST /api/v1/payments\n  Header: Idempotency-Key: <uuid>     // REQUIRED — safe retries\n  { amount_minor: 4999, currency: 'USD', source, orderId }\n  -> 201 { paymentId, status: 'pending'|'succeeded' }   (same key => same result)\nPOST /api/v1/payments/{id}/refund { amount_minor, Idempotency-Key }\nPOST /webhooks/psp   // PSP -> us: { event, paymentId, status }  (verify signature)\nGET  /api/v1/payments/{id} -> { status, ledgerEntries }"),
      K("data_model", "Data model",
        "ledger (append-only, IMMUTABLE):\n  entry_id PK, account, direction(debit|credit), amount_minor (INTEGER cents),\n  currency, payment_id, created_at   // every payment = balanced debits == credits\npayments:   id PK, idempotency_key UNIQUE, amount_minor, currency, status, psp_ref\nidempotency: key UNIQUE -> payment_id + cached response\nwebhooks:   provider_event_id UNIQUE (dedupe), payload, processed_at\n-- money is INTEGER minor units (never floats); entries are never updated, only added"),
      C("deep_dive", "Deep dive: idempotency & exactly-once money",
        "Networks retry, users double-click, and webhooks redeliver — so the system must make repeats harmless. Every mutating request carries an IDEMPOTENCY KEY; the service stores it with the resulting payment and response, so a retry with the same key returns the original outcome instead of charging again (enforced by a UNIQUE constraint on the key, which atomically rejects concurrent duplicates). The same applies to incoming webhooks: dedupe on the provider's event id so a redelivered 'charge succeeded' isn't applied twice. Money is represented as INTEGER minor units (cents), never floating point, to avoid rounding errors. Because true exactly-once across a network is impossible, the real guarantee is at-least-once delivery + idempotent processing = exactly-once EFFECT. This discipline — idempotency keys on requests and webhooks, integer money, unique constraints — is what prevents the cardinal sin of double-charging."),
      C("deep_dive", "Deep dive: the double-entry ledger & reconciliation",
        "The LEDGER is the auditable source of truth, modeled on accounting: every transaction is recorded as balanced entries where total debits equal total credits (money moves between accounts, never appears or vanishes), and entries are IMMUTABLE — you never update a balance, you append a new entry; a 'correction' is a reversing entry. This append-only, balanced structure makes the system tamper-evident and auditable: a balance is the sum of entries, and any discrepancy is detectable. Because money also lives in EXTERNAL systems (the PSP/bank), RECONCILIATION continuously compares your ledger to the PSP's settlement reports and flags mismatches (a charge they show but you don't, or vice versa) for investigation — catching dropped webhooks, partial failures, and bugs. Webhooks arrive ASYNC and OUT OF ORDER (a 'captured' before you processed 'authorized'), so process them idempotently and by state, not by arrival order. Ledger + reconciliation is how you stay provably correct on top of systems you don't control."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "This is a CONSISTENCY-first (CP) system: when a partition or ambiguity arises, prefer to reject/hold rather than risk an incorrect charge — availability yields to correctness. External PSPs are the unreliable dependency: they time out, fail, and send out-of-order/duplicate webhooks, so everything is idempotent and reconciled. Distributed transactions across services use a SAGA with compensations (void/refund), since 2PC across a PSP is impossible. Fraud and disputes/chargebacks add asynchronous state changes long after the charge. Trade-offs: strong consistency/correctness (the whole point) vs availability/throughput; saga + compensations (works across external systems) vs 2PC (impossible here); synchronous charge (simple, blocks on PSP) vs async webhook-driven (resilient, more states); immediate vs eventual reconciliation. Closing signal: idempotency keys everywhere + an immutable integer double-entry ledger + async PSP integration with reconciliation, biased to correctness over availability."),
      C("deep_dive", "Deep dive: security, compliance & operations",
        "Operationally a payment system must be correct, auditable, and secure. Security/PCI: never store raw card data — tokenize via the PSP and keep only tokens/references, shrinking PCI scope; encrypt sensitive data and tightly control access. Audit: the immutable ledger plus an append-only event log give a complete, tamper-evident history for finance, disputes, and regulators — nothing is ever silently changed. Webhook integrity: verify signatures on incoming PSP webhooks (they're public endpoints) and dedupe by event id. Failure handling: a charge stuck 'pending' (no webhook) is resolved by polling the PSP and by reconciliation; compensations (refund/void) unwind partially-completed sagas. Disputes/chargebacks: model them as first-class asynchronous state transitions with their own ledger entries. Money correctness checks: periodic invariants (debits == credits, no orphan entries) run as audits. Observability: success/failure rate per PSP, pending-too-long count, reconciliation mismatches, and webhook lag are the SLOs. The spine holds: idempotent, ledgered, reconciled money movement with tokenized data and a complete audit trail."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How do you avoid double-charging on retry?' idempotency key with a unique constraint returning the original result. 'Out-of-order/duplicate webhooks?' dedupe by event id and process by state, not arrival. 'Multi-step (authorize then capture, or pay then ship)?' a saga with compensating actions. 'How do you know your numbers are right?' a double-entry immutable ledger plus reconciliation against the PSP. 'Refunds/partial refunds?' new ledger entries referencing the original, idempotent. 'Multiple currencies?' store currency per entry; never mix; handle FX explicitly. 'PCI/security?' tokenize cards via the PSP, store only tokens. 'Fraud/chargebacks?' async state transitions with their own entries. Each returns to the spine: idempotency + an immutable integer double-entry ledger + async PSP integration + reconciliation, with correctness prioritized over availability."),
    ],
    "A payment system tests correctness over throughput: idempotency keys for exactly-once-effect money movement, an immutable integer double-entry ledger as the auditable source of truth, async PSP integration via verified/deduped webhooks, sagas for multi-step flows, and reconciliation. The signal is preventing double-charges and modeling money as a balanced, append-only ledger, not a mutable balance.",
    [
      G("no_idempotency", "No idempotency, so a retry/double-click double-charges.", "Require an idempotency key (unique constraint) returning the original result; dedupe webhooks.", "Charges on each request with no dedupe key."),
      G("mutable_balance", "Storing a mutable account balance instead of a ledger.", "Use an immutable double-entry ledger (balanced debits=credits, integer money); balance = sum of entries.", "UPDATEs a balance column; uses floats for money."),
      G("sync_2pc", "Assuming a distributed transaction (2PC) across the PSP.", "Use a saga with compensations + async webhook-driven state + reconciliation.", "Commits across services/PSP in one transaction."),
    ],
    0.7, DIAG.pay, "Payment system architecture"),

  // ───────────────────────── GOOGLE MAPS (ROUTING) ─────────────────────────
  TT("sysd_m9", "sysd_m9_t3", 3, "Design Google Maps (Routing)", "design-google-maps",
    ["case-study", "maps", "graph", "shortest-path"],
    "Tap two points and instantly get the fastest route — accounting for live traffic — anywhere on a continent-sized road network with hundreds of millions of intersections. Running plain Dijkstra over that per request is far too slow. How is routing instant?",
    "Model roads as a weighted GRAPH (intersections = nodes, road segments = edges weighted by travel time). Plain shortest-path (Dijkstra/A*) is too slow on a continental graph per request, so PRECOMPUTE: contraction hierarchies or region partitioning collapse the graph into shortcuts so queries explore a tiny fraction of it. Edge weights are updated from LIVE TRAFFIC (aggregated GPS), giving fast, traffic-aware routes and ETAs.",
    [
      C("requirements", "Requirements",
        "Functional: given an origin and destination, return the fastest (or shortest) route and an ETA; account for live traffic; support rerouting when conditions change; ideally alternatives and turn-by-turn. Non-functional: very low query latency (a route in well under a second), global scale (continent-sized graphs, hundreds of millions of nodes/edges), high availability, and freshness (live traffic reflected quickly). Clarify scope: routing/ETA is the core (map rendering via tiles and search/geocoding are separate systems). The defining challenge is that the road network is an enormous graph and a naive shortest-path search (Dijkstra explores outward by distance) would touch millions of nodes per query — far too slow at scale — so the design is about PRECOMPUTATION that makes queries explore a tiny slice, plus keeping edge weights current with real-world traffic."),
      K("estimation", "Capacity estimation (with numbers)",
        "Graph: a continent ~ hundreds of millions of nodes (intersections) + edges (roads).\n  too large + too slow for per-request Dijkstra (could touch millions of nodes)\nQueries: millions of route requests/sec globally at peak (read-heavy).\nTraffic: tens of millions of devices reporting GPS -> aggregate into edge speeds.\nPrecompute (contraction hierarchies) is expensive to build but turns a query\ninto exploring thousands of nodes, not millions -> sub-second routes.\nTakeaway: precompute to make queries cheap; update weights from live traffic;\nshard the graph by region and cache popular routes."),
      C("hld", "High-level design",
        "The road network is loaded as a weighted GRAPH, partitioned by REGION/tiles so it scales and queries stay local for most trips. Offline PRECOMPUTATION (e.g. contraction hierarchies) augments the graph with shortcut edges that let queries skip vast unimportant areas. The routing service answers a request by running A*/bidirectional search over the precomputed graph with edge weights = current travel time, returning the path + ETA; popular routes are cached. A separate TRAFFIC PIPELINE ingests GPS speed reports, aggregates them per road segment, and updates edge WEIGHTS (blended with historical patterns), which feed both routing and ETAs. Trace a request: origin/dest -> snap to nearest nodes -> bidirectional A* over the contracted, traffic-weighted graph -> path + ETA -> (cache). The expensive graph preprocessing is offline; the online query is a fast, bounded search over a structure designed for speed."),
      K("api", "API design",
        "GET /api/v1/route?from=<lat,lng>&to=<lat,lng>&depart=now\n  200: { path: [ {lat,lng} ], distance_m, eta_sec, steps:[turn-by-turn], alternatives? }\nGET /api/v1/eta?from=...&to=...  -> { eta_sec }   (uses live edge weights)\nInternal (traffic):\n  ingest(deviceId, segmentSpeeds[])  -> aggregate -> update edge weights\n(routing runs bidirectional A* / contraction-hierarchy query over the graph)"),
      K("data_model", "Data model",
        "graph:\n  nodes: node_id -> {lat, lng}              (intersections)\n  edges: (from_node, to_node) -> {dist, base_time, road_class, current_time}\n  current_time = weight used for routing (= live travel time)\nprecompute:  contraction-hierarchy shortcuts / region boundary tables\ntraffic:     segment_id -> rolling aggregated speed (real-time + historical)\ntiles:       precomputed map render tiles (separate from routing)\ncache:       (from_region,to_region) popular routes -> cached paths"),
      C("deep_dive", "Deep dive: the graph & shortest path at scale",
        "Routing is shortest-path on a weighted graph, but the algorithm choice is dominated by scale. Plain DIJKSTRA explores outward by increasing cost and would visit a huge fraction of a continental graph — far too slow. A* adds a heuristic (straight-line distance to the goal) to bias the search toward the destination, and BIDIRECTIONAL search runs from both ends to meet in the middle — both prune the explored set. But the real unlock is PRECOMPUTATION: Contraction Hierarchies preprocess the graph by 'contracting' less-important nodes and adding SHORTCUT edges that summarize long stretches (highways), so a query mostly travels up into shortcuts, across, and down — exploring thousands of nodes instead of millions. Alternatively, partition the graph into REGIONS and precompute boundary-to-boundary distances, so a cross-country route stitches region paths rather than searching every street. The principle: pay a heavy offline preprocessing cost so each online query is cheap — the only way to hit sub-second routes at continental scale."),
      C("deep_dive", "Deep dive: live traffic & ETA",
        "A route is only useful if its weights reflect reality, so edge weights = TRAVEL TIME, not just distance, and they change with traffic. A traffic pipeline ingests anonymized GPS speed reports from millions of devices, MAP-MATCHES them to road segments, and aggregates them into current speeds per segment, blended with HISTORICAL patterns (rush hour is predictable) and incident data. These feed the graph's edge weights so routing naturally avoids congestion and ETAs are accurate; for trips departing later, time-dependent weights predict future traffic. REROUTING: as conditions change mid-trip (new congestion, a missed turn), the device re-queries and the route updates. ETA is essentially the cost of the chosen path under current/predicted weights. The subtlety is freshness vs stability: weights update continuously, but you don't want routes flapping, so updates are smoothed. Live, aggregated traffic over the same graph is what separates a real maps product from a static shortest-path toy."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Graph SIZE is the core challenge — a continent doesn't fit cheap per-query search, hence precomputation (contraction hierarchies/region partitioning) and regional sharding. Precompute COST: building the hierarchy is expensive and must be redone as the map (and significantly, traffic) changes — so weights update live while the structural preprocessing refreshes less often. Query latency depends on the search staying bounded — heuristics + precomputed shortcuts + caching popular routes keep it sub-second. Traffic update RATE is high — aggregate GPS efficiently and update weights in bulk. Trade-offs: precompute (fast queries, costly/staler structure) vs on-the-fly Dijkstra (no preprocessing, too slow at scale); A*/CH (fast, complex) vs plain Dijkstra (simple, slow); fresh weights (accurate, more churn) vs stable routes (smoother, slightly stale); exact optimal vs near-optimal-but-fast. Closing signal: a weighted road graph with offline precomputation (CH/regions) for fast queries, edge weights driven by aggregated live traffic, sharded by region and cached."),
      C("deep_dive", "Deep dive: freshness, scale & operations",
        "Operationally, routing is a massive read system over a graph that must stay current. Regional sharding: partition the graph by geography so most queries (local trips) hit one region's data and the service scales by adding regions; long cross-region routes stitch precomputed boundaries. Replication & caching: replicate regional graph servers for QPS and availability, and cache popular origin/destination route patterns (commutes repeat) to skip search entirely. Weight updates: the live-traffic pipeline pushes new edge weights frequently in bulk; the structural precomputation (contraction hierarchies) is rebuilt on a slower cadence since topology changes rarely — decoupling 'weights change often' from 'graph structure changes rarely' is key to keeping both fresh and fast. Snap-to-road: incoming coordinates are matched to the nearest graph node/edge before searching. Observability: route latency p99, ETA accuracy (predicted vs actual), traffic-pipeline lag, and cache hit rate are the SLOs — ETA accuracy is measured against reality, not assumed. The spine holds: a region-sharded precomputed weighted graph, live-traffic edge weights, replication/caching for scale, with structure and weights refreshed on different cadences."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not just Dijkstra?' it explores too much of a continental graph per query — precompute (contraction hierarchies/regions) to bound the search. 'How is traffic included?' edge weights = live travel time from aggregated GPS blended with historical patterns. 'Rerouting?' re-query as conditions/position change, with smoothing to avoid flapping. 'Alternative routes?' return several near-optimal paths. 'ETA for a future departure?' time-dependent weights predicting traffic. 'Multi-modal (transit/walk)?' separate graphs/weights combined. 'Map rendering?' precomputed tiles, a separate system from routing. 'Global scale?' shard by region, replicate, cache popular routes. Each returns to the spine: a weighted road graph with offline precomputation for fast queries and live-traffic edge weights, sharded and cached for scale."),
    ],
    "Maps routing tests modeling roads as a weighted graph and recognizing that naive Dijkstra is too slow at continental scale — so you precompute (contraction hierarchies / region partitioning) to make queries cheap, and drive edge weights from aggregated live traffic for accurate routes and ETAs. The signal is precomputation + traffic-weighted edges + regional sharding, not raw shortest-path.",
    [
      G("naive_dijkstra", "Running plain Dijkstra over the whole graph per request.", "Precompute (contraction hierarchies / region partitioning) so queries explore a tiny slice; use A*/bidirectional.", "Per-request shortest path over the full continental graph."),
      G("distance_only", "Weighting edges by distance only, ignoring live traffic.", "Weight edges by travel time updated from aggregated GPS + historical patterns.", "Shortest route ignores congestion / no traffic pipeline."),
      G("no_precompute_scale", "No precomputation or regional sharding for a huge graph.", "Shard the graph by region, precompute shortcuts, and cache popular routes.", "One global graph searched naively, no sharding/caching."),
    ],
    0.7, DIAG.maps, "Maps routing architecture"),
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
  // Search engine
  pm("sysd_m11", { topicId: "sysd_m11_t2", exerciseId: "sysd_m11_t2_pm_d1", position: 11, level: "medium",
    title: "The core structure", scenario: "What makes a keyword search instant over billions of documents?",
    options: ["An inverted index (term -> posting list of doc ids)", "A forward index scanned per query", "A SQL LIKE '%term%' query", "A B-tree on document length"],
    correct: "An inverted index (term -> posting list of doc ids)",
    explanation: "The inverted index turns a query into a bounded lookup-and-intersect of posting lists instead of scanning the corpus." }),
  pm("sysd_m11", { topicId: "sysd_m11_t2", exerciseId: "sysd_m11_t2_pm_d2", position: 12, level: "hard",
    title: "Querying a sharded index", scenario: "The index is sharded by document across many nodes. How is a query answered?",
    options: ["Scatter to all shards, gather their top matches, rank and merge", "Send only to the shard with the answer", "Broadcast and take the first reply", "Query a single primary shard"],
    correct: "Scatter to all shards, gather their top matches, rank and merge",
    explanation: "Document-partitioning means each shard holds different docs, so queries scatter to all shards and the results are gathered, ranked, and merged (tail latency is the cost)." }),
  pm("sysd_m11", { topicId: "sysd_m11_t2", exerciseId: "sysd_m11_t2_pm_d3", position: 13, level: "medium",
    title: "Keeping ranking fast", scenario: "How do search engines apply sophisticated ranking without scoring everything expensively?",
    options: ["Two phases: cheap retrieval then re-rank a small candidate set", "Score every matching document with the full model", "Rank only by document id", "Skip ranking and return any matches"],
    correct: "Two phases: cheap retrieval then re-rank a small candidate set",
    explanation: "A cheap per-shard retrieval narrows to candidates; an expensive re-ranker (BM25/ML) orders just that small set, keeping latency low." }),
  // Message queue
  pm("sysd_m8", { topicId: "sysd_m8_t2", exerciseId: "sysd_m8_t2_pm_d1", position: 11, level: "medium",
    title: "Ordering guarantee", scenario: "What ordering can a partitioned log realistically guarantee at high throughput?",
    options: ["Order within a partition (route related msgs by key)", "Total global order across the topic", "No ordering at all", "Order by message size"],
    correct: "Order within a partition (route related msgs by key)",
    explanation: "Global order doesn't scale; order holds within a partition, so related messages share a partition via a key. Parallelism is per-partition." }),
  pm("sysd_m8", { topicId: "sysd_m8_t2", exerciseId: "sysd_m8_t2_pm_d2", position: 12, level: "hard",
    title: "Resuming after a crash", scenario: "A consumer crashes and restarts. How does it continue without losing or skipping messages?",
    options: ["It resumes from its committed offset per partition", "It re-reads the entire topic from the start", "It starts from the newest message", "The broker resends everything"],
    correct: "It resumes from its committed offset per partition",
    explanation: "Consumers track a committed offset per partition; on restart they resume there. Committing after processing gives at-least-once (needs idempotent consumers)." }),
  pm("sysd_m8", { topicId: "sysd_m8_t2", exerciseId: "sysd_m8_t2_pm_d3", position: 13, level: "medium",
    title: "Scaling consumers", scenario: "Consumers can't keep up. What scales throughput, and what's the limit?",
    options: ["Add consumers in the group, up to the partition count", "Add consumers without limit", "Reduce the replication factor", "Increase message size"],
    correct: "Add consumers in the group, up to the partition count",
    explanation: "Each partition is read by one consumer in a group, so parallelism is capped at the partition count; beyond that you must add partitions." }),
  // Leaderboard
  pm("sysd_m8", { topicId: "sysd_m8_t3", exerciseId: "sysd_m8_t3_pm_d1", position: 11, level: "medium",
    title: "The right structure", scenario: "Which structure gives O(log n) score updates AND fast top-k / rank reads?",
    options: ["A sorted set (skip list), e.g. Redis ZSET", "A relational table with ORDER BY per query", "A hash map of user -> score", "An array re-sorted on each update"],
    correct: "A sorted set (skip list), e.g. Redis ZSET",
    explanation: "A sorted set keeps order incrementally: O(log n) ZADD/ZINCRBY and O(log n + k) ZREVRANGE/ZREVRANK — no re-sorting." }),
  pm("sysd_m8", { topicId: "sysd_m8_t3", exerciseId: "sysd_m8_t3_pm_d2", position: 12, level: "hard",
    title: "Exact rank among a billion", scenario: "Returning a tail user's exact global rank among a billion players is too costly. Practical approach?",
    options: ["Segment (global top-N + local) or approximate tail rank via percentiles", "Recompute exact rank by scanning all players", "Refuse to show rank", "Store every rank in a column and update all on each change"],
    correct: "Segment (global top-N + local) or approximate tail rank via percentiles",
    explanation: "Exact rank matters near the top; for the deep tail an approximation from the score distribution is fine and O(1), or you segment boards." }),
  pm("sysd_m8", { topicId: "sysd_m8_t3", exerciseId: "sysd_m8_t3_pm_d3", position: 13, level: "medium",
    title: "Surviving a restart", scenario: "The sorted set lives in memory. How do you avoid losing scores?",
    options: ["Persist changes to a DB (write-through/snapshots) and rebuild on loss", "Nothing — keep it only in RAM", "Recompute from game logs each query", "Email scores to users"],
    correct: "Persist changes to a DB (write-through/snapshots) and rebuild on loss",
    explanation: "Back the in-memory sorted set with a durable store (and replicas) so it can be rebuilt after a crash or failover." }),
  // Notifications
  pm("sysd_m3", { topicId: "sysd_m3_t3", exerciseId: "sysd_m3_t3_pm_d1", position: 11, level: "medium",
    title: "Fanning out a broadcast", scenario: "One alert targets 50M users across push/email/SMS. How should it be sent?",
    options: ["Enqueue per-channel jobs and fan out async with workers", "Loop over 50M users synchronously in the request", "Send all channels from one thread", "Email everyone, then push, then SMS, serially"],
    correct: "Enqueue per-channel jobs and fan out async with workers",
    explanation: "Async per-channel queues + worker pools absorb the bursty fan-out within provider rate limits and isolate a slow channel from the others." }),
  pm("sysd_m3", { topicId: "sysd_m3_t3", exerciseId: "sysd_m3_t3_pm_d2", position: 12, level: "hard",
    title: "Unreliable providers", scenario: "Third-party gateways (APNs, SMS) throttle and occasionally fail. How do you stay reliable?",
    options: ["Retries with backoff, dead-letter, and provider failover + rate pacing", "Assume they always succeed", "Send once and forget", "Block until the provider recovers"],
    correct: "Retries with backoff, dead-letter, and provider failover + rate pacing",
    explanation: "Providers are unreliable and rate-limited: retry transient failures, dead-letter exhausted ones, fail over to a backup provider, and pace to limits." }),
  pm("sysd_m3", { topicId: "sysd_m3_t3", exerciseId: "sysd_m3_t3_pm_d3", position: 13, level: "medium",
    title: "Not spamming users", scenario: "What must you check before sending so users aren't spammed or double-notified?",
    options: ["Preferences/opt-out, an idempotency key (dedupe), and per-user rate limits", "Only the message length", "Nothing — send everything", "The server's CPU load"],
    correct: "Preferences/opt-out, an idempotency key (dedupe), and per-user rate limits",
    explanation: "Honor preferences/opt-outs, dedupe via an idempotency key, and rate-limit per user; coalesce when possible and prioritize urgent messages." }),
  // Payments
  pm("sysd_m9", { topicId: "sysd_m9_t2", exerciseId: "sysd_m9_t2_pm_d1", position: 11, level: "hard",
    title: "No double-charge on retry", scenario: "A network timeout makes the client retry a charge. How do you ensure it charges only once?",
    options: ["An idempotency key with a unique constraint returning the original result", "Charge again; refund later if duplicated", "Hope the retry doesn't happen", "Lock the entire payments table"],
    correct: "An idempotency key with a unique constraint returning the original result",
    explanation: "The idempotency key (unique) makes a retry return the original outcome instead of charging again — at-least-once delivery + idempotent processing = exactly-once effect." }),
  pm("sysd_m9", { topicId: "sysd_m9_t2", exerciseId: "sysd_m9_t2_pm_d2", position: 12, level: "hard",
    title: "Recording money correctly", scenario: "How should balances and money movements be stored for auditability and correctness?",
    options: ["An immutable double-entry ledger in integer minor units", "A mutable balance column updated per transaction", "Floating-point balances", "Only the latest balance, no history"],
    correct: "An immutable double-entry ledger in integer minor units",
    explanation: "Append-only balanced entries (debits == credits) in integer cents give a tamper-evident, auditable source of truth; balance = sum of entries. Never floats, never UPDATE." }),
  pm("sysd_m9", { topicId: "sysd_m9_t2", exerciseId: "sysd_m9_t2_pm_d3", position: 13, level: "medium",
    title: "Multi-step across a PSP", scenario: "Reserve -> charge -> create order spans services and an external PSP. How do you coordinate?",
    options: ["A saga with compensating actions + async webhooks + reconciliation", "A 2PC distributed transaction across the PSP", "One big database transaction", "Fire all steps and ignore failures"],
    correct: "A saga with compensating actions + async webhooks + reconciliation",
    explanation: "2PC across an external PSP is impossible; a saga runs steps with compensations (void/refund), webhooks drive state, and reconciliation catches drift." }),
  // Maps
  pm("sysd_m9", { topicId: "sysd_m9_t3", exerciseId: "sysd_m9_t3_pm_d1", position: 11, level: "hard",
    title: "Why not plain Dijkstra?", scenario: "Why isn't per-request Dijkstra over the full road graph good enough?",
    options: ["It explores too much of a continental graph; precompute to bound the search", "It can't handle weighted edges", "It only works on trees", "It ignores the destination entirely"],
    correct: "It explores too much of a continental graph; precompute to bound the search",
    explanation: "Dijkstra expands outward and would touch millions of nodes; precomputation (contraction hierarchies / regions) + A* makes each query explore a tiny slice." }),
  pm("sysd_m9", { topicId: "sysd_m9_t3", exerciseId: "sysd_m9_t3_pm_d2", position: 12, level: "medium",
    title: "Traffic-aware routing", scenario: "How does routing account for live congestion?",
    options: ["Edge weights = travel time, updated from aggregated GPS + historical patterns", "It always uses the shortest distance", "It asks the user for traffic", "It reroutes randomly"],
    correct: "Edge weights = travel time, updated from aggregated GPS + historical patterns",
    explanation: "Weighting edges by current travel time (from aggregated device speeds blended with historical data) makes routes and ETAs traffic-aware." }),
  pm("sysd_m9", { topicId: "sysd_m9_t3", exerciseId: "sysd_m9_t3_pm_d3", position: 13, level: "medium",
    title: "Scaling the graph", scenario: "The graph is continent-sized. What keeps queries fast and the system scalable?",
    options: ["Region sharding + precomputed shortcuts + caching popular routes", "One global in-memory graph searched naively", "Recomputing the graph per request", "Storing routes in a relational table"],
    correct: "Region sharding + precomputed shortcuts + caching popular routes",
    explanation: "Partition by region (local trips stay local), precompute shortcuts (contraction hierarchies), replicate, and cache repeated routes — structure and weights refresh on different cadences." }),
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
  console.log(`✓ Depth batch 3 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
