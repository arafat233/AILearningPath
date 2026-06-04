/**
 * Seed — System Design module M19: Case Studies XIII (more large-scale designs):
 * Saga/Transaction Orchestrator, Music Streaming (Spotify), Distributed File
 * System (GFS/HDFS), Survey/Forms Platform, Package Registry, Captcha/Bot
 * Detection, Two-Sided Marketplace, Real-Time OLAP (Druid/Pinot). Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases14.js   ·   npm: npm run seed:sysd-cases14
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m19";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 19,
  name: "Case Studies XIII — More Systems", slug: "case-studies-13",
  description: "Eight more large-scale designs: a saga/transaction orchestrator, music streaming, a distributed file system, a survey/forms platform, a package registry, captcha/bot detection, a two-sided marketplace, and real-time OLAP analytics.",
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
  T("sysd_m19_t1", 1, "Design a Saga / Transaction Orchestrator", "design-saga-orchestrator",
    ["case-study", "saga", "compensation", "distributed-transaction"],
    "Build a service that coordinates a business transaction across multiple microservices (place order → charge → reserve stock → ship) where a single distributed ACID transaction is impossible. How do you keep it consistent when a step fails midway?",
    "Use the SAGA pattern: a sequence of LOCAL transactions, each with a COMPENSATING action that undoes it. If a step fails, run the compensations for completed steps IN REVERSE (semantic rollback) — there's no global rollback. ORCHESTRATION (a central coordinator drives steps + compensations as a state machine) vs CHOREOGRAPHY (services react to events). Steps must be IDEMPOTENT; the saga state is persisted to resume.",
    [
      { kind: "concept", heading: "Why not a distributed ACID transaction",
        body: "A business operation spanning services (order, payment, inventory, shipping) can't use one ACID transaction — each service owns its own database, and 2PC across them (especially external ones) is impractical (blocking, poor availability, doesn't scale). So you give up atomicity-across-services and instead achieve EVENTUAL consistency via the SAGA pattern: break the operation into a sequence of LOCAL transactions, each committing in its own service." },
      { kind: "concept", heading: "Compensation (semantic rollback)",
        body: "The defining idea: there's no global rollback, so each step has a COMPENSATING transaction that semantically UNDOES it (refund a charge, release reserved stock, cancel a shipment). If step 4 fails, the saga runs the compensations for steps 3, 2, 1 IN REVERSE order. Compensation isn't a true rollback (the data was committed and others may have seen it) — it's a business-level reversal. Designing correct compensations is the hard, defining part." },
      { kind: "concept", heading: "Orchestration vs choreography",
        body: "Two coordination styles: ORCHESTRATION — a central ORCHESTRATOR (this service) explicitly drives the saga as a STATE MACHINE, calling each step and triggering compensations on failure (clear control flow, easy to monitor, but a central component). CHOREOGRAPHY — no central coordinator; each service emits EVENTS that trigger the next step (loosely coupled, but the flow is implicit and hard to trace/debug as it grows). Orchestration is usually preferred for complex sagas." },
      { kind: "concept", heading: "Durability, idempotency & follow-ups",
        body: "The orchestrator PERSISTS saga state (which steps done/compensated) so it RESUMES after a crash (the workflow-engine durability idea) and never loses a half-finished saga. Steps and compensations must be IDEMPOTENT (retries/replays happen) and ideally commutative. Watch for: a compensation that itself fails (retry/alert), and the lack of isolation (others can observe intermediate state — countermeasures: semantic locks, commutative updates). Follow-ups: 'saga vs 2PC', 'orchestration vs choreography trade', 'pivot transactions', 'observability'. Signal: sequence of local transactions + compensating actions (reverse-order semantic rollback) + orchestration (state machine) vs choreography (events) + persisted state + idempotency.",
      },
    ],
    "A saga orchestrator tests distributed-transaction coordination without 2PC: a sequence of local transactions each with a compensating action (reverse-order semantic rollback on failure), driven by orchestration (central state machine) or choreography (events), with persisted saga state for crash recovery and idempotent steps. Designing correct compensations and handling lack-of-isolation are the crux.",
    ["Assuming a single distributed ACID transaction / 2PC across services (impractical).",
     "No compensating actions / not running them in reverse on failure.",
     "No persisted saga state (can't resume after a crash) or non-idempotent steps."],
    0.6, { type: "Saga", description: "Operation = sequence of local transactions T1..Tn, each with a compensation C1..Cn. Orchestrator (state machine) runs steps; on failure at Ti, run C(i-1)..C1 in REVERSE (semantic rollback). State persisted (resume); steps idempotent. Orchestration vs choreography (events).", alt: "Saga: local transactions with reverse-order compensations, driven by an orchestrator state machine." }),

  T("sysd_m19_t2", 2, "Design Music Streaming (Spotify)", "design-music-streaming",
    ["case-study", "streaming", "cdn", "recommendation"],
    "Build Spotify's backend: stream tens of millions of songs to hundreds of millions of users with instant playback, plus playlists, search, and recommendations. How is audio delivered fast, and what powers Discover Weekly?",
    "Store audio files (transcoded to multiple bitrates) in object storage and deliver via CDN with ADAPTIVE BITRATE for instant, smooth playback (audio is small + cacheable — the popular catalog is heavily CDN-cached). Metadata (catalog, playlists, library) lives in databases; SEARCH uses an inverted index; RECOMMENDATIONS (Discover Weekly) use the two-stage candidate→rank funnel over listening data. Read-heavy; playback events stream to analytics.",
    [
      { kind: "concept", heading: "Audio delivery",
        body: "The core: stream audio to listeners with INSTANT start and no buffering. Pre-TRANSCODE each track into multiple bitrates/codecs, store in object storage, and serve via CDN (edge-cached near users — the CDN design). ADAPTIVE BITRATE streaming (like video, but audio is far smaller) adjusts quality to the listener's bandwidth. Because the popular catalog is small relative to video and highly cacheable, CDN hit rates are excellent → fast playback. Clients prefetch the next part/track for gapless play." },
      { kind: "concept", heading: "Catalog, metadata & search",
        body: "Beyond audio bytes: METADATA — tracks, albums, artists, and per-user PLAYLISTS + library + play history — lives in databases (relational for structured catalog, plus caches for hot data). SEARCH (songs/artists/albums) uses an INVERTED INDEX (the search-engine design) with typeahead. This is a read-heavy system (people listen far more than they create), so cache aggressively." },
      { kind: "concept", heading: "Recommendations (Discover Weekly)",
        body: "Personalized recommendations are a key differentiator. They use the two-stage RETRIEVAL → RANKING funnel (the recommender design) over massive LISTENING data: collaborative filtering ('users with similar taste'), audio/content features, and embeddings + ANN to generate candidates, then a model ranks them. Heavy computation is OFFLINE/batch (compute weekly playlists, embeddings); serving is fast lookup. Listening events feed the models (a feedback loop)." },
      { kind: "concept", heading: "Events, scale & follow-ups",
        body: "PLAYBACK events (plays, skips, likes) stream into an analytics pipeline (the ad-click-aggregator style) for royalties, charts, and recommendation training. Player state (current track/position) may sync across a user's devices. Follow-ups: 'royalty accounting (count plays accurately — a counting/ledger problem)', 'offline downloads (DRM)', 'social features', 'live lyrics sync'. Signal: transcoded audio in object storage delivered via CDN with adaptive bitrate (cacheable → instant playback) + metadata DBs + inverted-index search + offline-trained recommendation funnel + playback-event analytics; read-heavy.",
      },
    ],
    "Music streaming tests audio delivery (transcoded, object-stored, CDN-cached with adaptive bitrate → instant playback — the catalog is small and cacheable) plus metadata DBs, inverted-index search, an offline-trained recommendation funnel (Discover Weekly), and playback-event analytics for royalties/training. It's read-heavy and composes the CDN, search, and recommender designs.",
    ["Streaming audio from the origin instead of CDN edge caching (the catalog is highly cacheable).",
     "Treating recommendations as live computation instead of an offline-trained candidate→rank funnel.",
     "Ignoring playback-event analytics (royalties, charts, recommendation training)."],
    0.5, { type: "Music streaming", description: "Audio transcoded → object storage → CDN (adaptive bitrate, edge-cached → instant playback). Metadata/playlists in DBs (+cache); inverted-index search. Recommendations: offline candidate→rank funnel over listening data. Playback events → analytics (royalties/training).", alt: "Music streaming: CDN-delivered adaptive audio plus metadata, search, and a recommendation funnel." }),

  T("sysd_m19_t3", 3, "Design a Distributed File System (GFS/HDFS)", "design-distributed-file-system",
    ["case-study", "chunks", "replication", "metadata"],
    "Build GFS/HDFS: store huge files (terabytes) across thousands of commodge machines that frequently fail, with high-throughput reads/writes. How are files stored, and how does the system survive constant hardware failures?",
    "Split each file into large fixed-size CHUNKS/blocks (e.g. 64–128MB) spread across many DATA NODES; a MASTER/NameNode holds the METADATA (file → chunk locations, namespace) but never the data itself. Each chunk is REPLICATED (e.g. 3×) across nodes/racks for fault tolerance — failures are EXPECTED, so re-replicate lost chunks automatically. Optimized for large sequential reads/appends, not small random writes.",
    [
      { kind: "concept", heading: "Files as large chunks",
        body: "A huge file (terabytes) is SPLIT into large fixed-size CHUNKS (GFS 64MB, HDFS 128MB blocks) distributed across many DATA NODES (chunkservers). Large chunks suit big sequential reads (the target workload — analytics, the data-warehouse/MapReduce ideas) and reduce metadata overhead (fewer chunks to track). A file is reconstructed by reading its chunks in order. This chunked layout is what lets one file exceed any single disk." },
      { kind: "concept", heading: "Separate metadata (master) from data",
        body: "A single MASTER (GFS) / NameNode (HDFS) holds all METADATA: the namespace (directory tree), and the mapping of each file → its chunks → which data nodes hold them. Crucially the master holds NO file data — clients ask the master 'where are file X's chunks?', then read/write DIRECTLY from/to the data nodes (the master isn't a data bottleneck). Keeping metadata in memory on one master makes it fast but a scaling/SPOF concern (mitigated by checkpoints + a standby; HDFS HA NameNode)." },
      { kind: "concept", heading: "Replication & failure tolerance",
        body: "The design ASSUMES constant hardware failure (thousands of commodity machines). Each chunk is REPLICATED (default 3×) across different nodes and RACKS (rack-aware placement, so a rack failure doesn't lose all copies). Data nodes send HEARTBEATS to the master; when a node dies (missed heartbeats), the master detects under-replicated chunks and RE-REPLICATES them elsewhere — self-healing. This redundancy + auto-recovery is how it provides durability on unreliable hardware." },
      { kind: "concept", heading: "Workload & follow-ups",
        body: "Optimized for LARGE sequential reads and APPENDS (write-once, read-many; append-heavy), NOT small random writes or low-latency small files (the small-files problem — metadata overhead). Writes go to a primary replica that coordinates the others (consistency for appends). Follow-ups: 'NameNode HA / federation (scale metadata)', 'why huge blocks', 'rack awareness', 'consistency model', 'vs object storage (the m8 S3 design)'. Signal: file → large chunks on data nodes + master holds metadata only (clients read data nodes directly) + 3× rack-aware replication + heartbeat-driven re-replication (failures expected); large-sequential-read optimized.",
      },
    ],
    "A distributed file system tests big-data storage on unreliable hardware: files split into large chunks across data nodes, a master holding only metadata (clients read data nodes directly — not via the master), and 3× rack-aware replication with heartbeat-driven re-replication (failures are expected → self-healing). It's optimized for large sequential reads/appends, not small random writes.",
    ["Routing file data through the master instead of metadata-only (master would bottleneck).",
     "Small blocks / treating it as a low-latency small-file store (it's built for large sequential reads).",
     "No replication / re-replication — assuming hardware doesn't fail (it constantly does)."],
    0.6, { type: "Distributed FS", description: "File → large chunks (64–128MB) on data nodes. Master/NameNode holds METADATA only (file→chunks→nodes); clients fetch locations then read/write data nodes DIRECTLY. Each chunk replicated 3× (rack-aware). Heartbeats detect dead nodes → re-replicate. Large-sequential-read optimized.", alt: "Distributed file system: chunked files on data nodes, metadata-only master, 3× replication with re-replication." }),

  T("sysd_m19_t4", 4, "Design a Survey / Forms Platform", "design-forms-platform",
    ["case-study", "dynamic-schema", "write-spikes", "analytics"],
    "Build Google Forms / SurveyMonkey: users create forms with arbitrary fields, share them, collect responses (sometimes millions in a spike), and view analytics. How do you store responses to forms whose structure you don't know in advance?",
    "Store form DEFINITIONS as flexible schema (a list of typed questions — schema-on-read); store RESPONSES as documents keyed to the form + question ids (a document/NoSQL store fits the dynamic, varying shape). Handle viral WRITE SPIKES (a form going viral) with a queue/buffer + horizontal scaling. Pre-AGGREGATE results for analytics dashboards. It's a dynamic-schema, write-spiky, read-for-analytics system.",
    [
      { kind: "concept", heading: "Dynamic, user-defined schema",
        body: "The core challenge: users CREATE the form structure — arbitrary questions of varying types (text, multiple-choice, rating, file upload) — so you DON'T know the response schema in advance, and it differs per form. Store the form DEFINITION as data (an ordered list of typed question objects with ids, options, validation rules). Responses then reference those question ids. This 'schema-as-data' approach (vs a fixed table per form) is what makes a generic forms platform possible." },
      { kind: "concept", heading: "Storing responses",
        body: "Each RESPONSE maps question id → answer for one submission. Because the shape varies per form (and forms can be edited/versioned), a DOCUMENT/NoSQL store (or a flexible JSON column) fits naturally — store the response as a document keyed by form id. (A rigid relational table-per-form is brittle as forms change.) Version the form so responses are interpretable against the structure they were submitted under. Validate answers against the form definition on submit." },
      { kind: "concept", heading: "Write spikes",
        body: "Response volume is SPIKY and unpredictable: a form shared widely (a viral survey, an event registration, a class quiz) can get millions of submissions in minutes, then nothing. The submission path must absorb bursts: a QUEUE/buffer in front of persistence (the flash-sale/async idea), horizontally scalable stateless write servers, and idempotent submit (avoid duplicate responses on retry/double-click). Don't let a spike on one popular form degrade others (isolation)." },
      { kind: "concept", heading: "Analytics & follow-ups",
        body: "Form owners want real-time RESULTS/analytics (counts per option, charts, averages). Pre-AGGREGATE as responses arrive (increment per-option counters — the distributed-counter idea — and rollups) rather than scanning all responses per dashboard view; the response store remains the source of truth for raw export. Follow-ups: 'response limits / one-per-user', 'conditional logic (branching questions)', 'real-time collaboration on form editing', 'export (CSV)', 'access control / anonymous responses'. Signal: form definition as flexible schema (schema-as-data) + responses in a document store (dynamic shape, versioned) + queue-buffered write-spike handling (idempotent) + pre-aggregated analytics.",
      },
    ],
    "A forms platform tests dynamic-schema storage: form definitions as schema-as-data (typed questions with ids), responses as documents in a NoSQL/flexible store (varying shape, versioned), queue-buffered handling of viral write spikes (idempotent submit), and pre-aggregated analytics. Storing responses to a structure you don't know in advance is the crux.",
    ["A rigid table-per-form schema instead of schema-as-data + flexible document responses.",
     "No buffering for viral write spikes (a popular form overwhelms persistence / affects others).",
     "Scanning all responses per dashboard view instead of pre-aggregating results."],
    0.5, { type: "Forms platform", description: "Form definition = ordered typed questions (schema-as-data, versioned). Response = {questionId → answer} stored as a document (NoSQL, dynamic shape). Submit: validate vs definition → queue-buffer (absorb viral spikes, idempotent) → persist + increment per-option aggregates for analytics.", alt: "Forms platform: schema-as-data forms, document responses, buffered write spikes, pre-aggregated analytics." }),

  T("sysd_m19_t5", 5, "Design a Package Registry (npm / Docker)", "design-package-registry",
    ["case-study", "immutable-artifacts", "cdn", "versioning"],
    "Build npm / Docker Hub: developers PUBLISH versioned packages and the world DOWNLOADS them at massive scale. What's special about how versions are stored, and how do you serve huge download traffic?",
    "Store package ARTIFACTS (tarballs/image layers) in object storage; treat published versions as IMMUTABLE (a version, once published, never changes — reproducible builds; only new versions are added). Metadata (versions, dependencies, dist-tags) in a database. Serve the overwhelmingly READ-heavy downloads via CDN (cache immutable artifacts forever). Dedup content (Docker layers / content-addressing). Verify integrity (hashes) + security (signing, malware scanning).",
    [
      { kind: "concept", heading: "Immutable versioned artifacts",
        body: "The defining property: a published VERSION is IMMUTABLE — once package@1.2.3 (or an image with a given digest) is published, its content NEVER changes; you can only publish NEW versions. This guarantees REPRODUCIBLE builds (the dependency-resolver lockfile relies on it — the same version always yields the same bytes) and makes artifacts perfectly cacheable. (Unpublishing is restricted precisely because others depend on immutability — the famous left-pad incident.) Artifacts (tarballs, image layers) live in object storage; metadata (available versions, dependencies, tags) in a database." },
      { kind: "concept", heading: "Read-heavy → CDN",
        body: "Downloads vastly outnumber publishes (publish once, download millions of times — every CI build, every npm install). So it's extremely READ-heavy. Because artifacts are IMMUTABLE, they're cached FOREVER on a CDN (edge-cached near developers, no invalidation needed — the CDN design). The vast majority of download traffic is served from the CDN, never touching origin. Metadata (version lists) is cached too. This CDN-fronting is essential to handle the scale (npm serves billions of downloads)." },
      { kind: "concept", heading: "Content dedup & integrity",
        body: "Deduplication matters: Docker uses CONTENT-ADDRESSED layers (identified by content hash) so identical layers shared across images are stored/transferred ONCE; npm dedups via the dependency tree. Integrity: each artifact has a checksum/hash clients verify on download (detect corruption/tampering); modern registries add SIGNING (provenance) and MALWARE/vulnerability SCANNING on publish (supply-chain security — a major concern, the registry is a high-value attack target)." },
      { kind: "concept", heading: "Publish flow & follow-ups",
        body: "PUBLISH: authenticate the developer (scoped tokens), validate the package (name not taken / version is new / passes checks), store the artifact (object storage), update metadata, and invalidate/refresh version-list caches. Scoping/namespaces (@org/pkg) prevent name squatting. Follow-ups: 'private registries / access control', 'proxy/caching upstream registries (Artifactory)', 'yank/deprecate vs delete', 'rate limiting', 'typosquatting/supply-chain defenses'. Signal: immutable versioned artifacts in object storage + metadata DB + CDN for read-heavy downloads (cache immutable forever) + content dedup (content-addressing) + integrity/signing/scanning; authenticated publish.",
      },
    ],
    "A package registry tests immutable-artifact distribution: published versions are immutable (reproducible builds, cached forever), artifacts in object storage + metadata in a DB, downloads (read-heavy) served via CDN, content deduplicated (content-addressed Docker layers), with integrity hashes + signing + malware scanning (supply-chain security). Immutability + CDN are the keys.",
    ["Allowing a published version's content to change (breaks reproducibility; un-cacheable).",
     "Serving downloads from origin instead of CDN-caching immutable artifacts.",
     "Ignoring integrity/signing/scanning (the registry is a prime supply-chain attack target)."],
    0.5, { type: "Package registry", description: "Publish: auth → validate (new version) → store artifact (object storage) + metadata (DB) + scan/sign. Versions IMMUTABLE (reproducible, cacheable). Download (read-heavy): served via CDN (immutable → cache forever). Content-addressed dedup; clients verify hashes.", alt: "Package registry: immutable versioned artifacts in object storage, CDN-served downloads, signed + scanned." }),

  T("sysd_m19_t6", 6, "Design a Captcha / Bot Detection Service", "design-bot-detection",
    ["case-study", "abuse-prevention", "signals", "risk-scoring"],
    "Build a service that distinguishes humans from bots to protect signups/logins/forms from abuse — without annoying real users too much. Why is a static challenge not enough, and how do modern systems decide?",
    "Combine a RISK SCORE from many SIGNALS (behavioral: mouse/typing patterns, timing; environmental: IP reputation, device fingerprint, headers; historical: rate, past abuse) computed server-side, and only CHALLENGE (captcha) when risk is high — most real users pass invisibly. Challenges must resist automation (and adapt, since bots evolve — an arms race). Server-verified tokens prevent replay; ML models score and retrain on labeled abuse.",
    [
      { kind: "concept", heading: "Why not just a static captcha",
        body: "A fixed challenge (type these distorted letters) annoys real users AND is increasingly solvable by bots (OCR, ML, human solver farms). Worse, showing it to everyone hurts conversion. Modern bot detection is RISK-BASED: silently assess how likely each request is a bot from many signals, let the vast majority of legitimate users through INVISIBLY, and only escalate to a challenge when risk is high. It's adaptive, not a single static gate." },
      { kind: "concept", heading: "Signals → risk score",
        body: "Aggregate many SIGNALS into a risk score (server-side): BEHAVIORAL (mouse movement, typing cadence, interaction timing — bots are often too fast/too regular/absent), ENVIRONMENTAL (IP reputation/ASN, device fingerprint, browser/header consistency, TLS fingerprint), and HISTORICAL/velocity (requests per IP/account, prior abuse, account age — the rate-limiter/fraud signals). An ML model (or rules + ML) combines these into a probability the request is automated. This is essentially the fraud-detection pattern applied to bot traffic." },
      { kind: "concept", heading: "Decision: allow / challenge / block",
        body: "Use risk THRESHOLDS: low risk → ALLOW silently (no friction — most users); medium → CHALLENGE (a captcha / invisible proof-of-work / step-up) to gather more evidence; high → BLOCK or shadow-ban. This balances security vs user friction (the false-positive/false-negative trade — blocking real users vs letting bots in). A passed challenge issues a server-VERIFIED token (so the protected action checks it server-side, preventing replay/forgery — never trust client-only)." },
      { kind: "concept", heading: "Arms race & follow-ups",
        body: "It's an ADVERSARIAL ARMS RACE: bots adapt to any fixed defense, so the system must continuously RETRAIN on labeled abuse (caught bots, user reports — a feedback loop) and rotate/adapt challenges. Bots also use real-browser automation and human solver farms, so behavioral + reputation signals matter more than the puzzle itself. Follow-ups: 'privacy of signals', 'accessibility of challenges', 'invisible captcha / proof-of-work', 'don't leak the scoring logic (attackers probe it)'. Signal: multi-signal server-side risk scoring (behavioral/environmental/historical, ML) + allow/challenge/block by risk (invisible for most) + server-verified tokens + continuous retraining (arms race).",
      },
    ],
    "Bot detection tests risk-based, adversarial abuse prevention: aggregate behavioral/environmental/historical signals into a server-side risk score (ML), then allow silently / challenge / block by threshold (invisible for most users — balancing security vs friction), with server-verified tokens and continuous retraining (an arms race). A static captcha alone is insufficient — it's the fraud-detection pattern for bots.",
    ["Relying on a single static challenge shown to everyone (annoys users, solvable by bots).",
     "Scoring/deciding on the client (trivially bypassed) instead of server-side with verified tokens.",
     "No feedback loop / adaptation — bots evolve, so defenses must retrain (arms race)."],
    0.6, { type: "Bot detection", description: "Request → collect signals (behavioral: mouse/typing/timing; environmental: IP/fingerprint/headers; historical: velocity/abuse) → ML risk score (server-side). Low → allow silently; medium → challenge (verified token); high → block. Retrain on labeled abuse (arms race).", alt: "Bot detection: multi-signal server-side risk scoring driving allow/challenge/block decisions." }),

  T("sysd_m19_t7", 7, "Design a Two-Sided Marketplace", "design-two-sided-marketplace",
    ["case-study", "matching", "trust", "payments"],
    "Build a marketplace connecting buyers and sellers (Etsy/eBay/Airbnb-style): listings, search/discovery, transactions, and the TRUST that makes strangers transact. Beyond CRUD, what makes a marketplace actually work?",
    "Core: SELLERS create listings (catalog), BUYERS search/discover them (search + ranking), and TRANSACTIONS connect them with PAYMENTS held in ESCROW (release to seller on fulfillment — protecting both sides). The non-obvious crux is TRUST & SAFETY: ratings/reviews, identity verification, fraud/scam detection, and dispute resolution — without trust, strangers won't transact. Plus the cold-start / liquidity problem (need both sides).",
    [
      { kind: "concept", heading: "The two sides + listings & discovery",
        body: "A marketplace has two distinct user types: SUPPLY (sellers/hosts/providers) who create LISTINGS (a catalog of items/services with price, details, availability) and DEMAND (buyers) who DISCOVER them via SEARCH + ranking + recommendations (the search-engine/recommender designs — relevance, filters, personalization drive conversion). Modeling both sides' flows (onboarding, listing management vs browsing, checkout) is the foundation." },
      { kind: "concept", heading: "Transactions & escrow payments",
        body: "Connecting the sides is a TRANSACTION with PAYMENTS (the payment-system design): critically, marketplaces use ESCROW — hold the buyer's payment and RELEASE it to the seller only after fulfillment/confirmation (or a window passes), taking a platform fee/commission. Escrow protects BOTH sides (buyer isn't charged for nothing; seller is assured of payment) — the trust backbone of the money flow. Handle refunds, payouts, chargebacks, and the platform's cut (split payments)." },
      { kind: "concept", heading: "Trust & safety (the real crux)",
        body: "The non-obvious heart of a marketplace: strangers must TRUST each other enough to transact. Build trust with RATINGS & REVIEWS (reputation — bidirectional, like ride-sharing), identity/seller VERIFICATION, FRAUD & SCAM detection (the fraud/bot designs — fake listings, payment fraud, off-platform circumvention), and DISPUTE RESOLUTION (mediation, refunds). Without trust + safety, a technically-perfect marketplace fails — this is what separates marketplace design from a generic e-commerce CRUD app." },
      { kind: "concept", heading: "Liquidity & follow-ups",
        body: "The chicken-and-egg / COLD-START problem: buyers won't come without sellers and vice versa — achieving LIQUIDITY (enough of both sides for matches to happen) is the existential business+design challenge (seed one side, focus a niche/geo first). Follow-ups: 'matching/ranking to maximize successful transactions', 'preventing disintermediation (taking deals off-platform)', 'pricing/commission', 'reviews gaming', 'two-sided notifications'. Signal: supply (listings) + demand (search/discovery) + transactions with escrow payments + commission, all anchored by TRUST & SAFETY (ratings/verification/fraud/disputes) and the liquidity/cold-start problem.",
      },
    ],
    "A two-sided marketplace tests connecting supply (listings) and demand (search/discovery) via transactions with escrow payments + commission — but its real crux is TRUST & SAFETY (ratings/reviews, verification, fraud detection, dispute resolution) that lets strangers transact, plus the liquidity/cold-start problem. It's far more than e-commerce CRUD; it composes search, payments, fraud, and recommender designs.",
    ["Treating it as generic CRUD/e-commerce and ignoring trust & safety (the actual crux).",
     "Direct buyer→seller payment instead of escrow (no protection for either side / no commission).",
     "Ignoring the liquidity / cold-start (chicken-and-egg) problem of needing both sides."],
    0.6, { type: "Marketplace", description: "Supply: sellers create listings (catalog). Demand: buyers search/discover (rank/recommend). Transaction: payment held in ESCROW → released to seller on fulfillment (− commission). Trust & safety: ratings/reviews + verification + fraud detection + disputes. Liquidity (both sides) = the cold-start problem.", alt: "Two-sided marketplace: listings, discovery, escrow transactions, and trust & safety." }),

  T("sysd_m19_t8", 8, "Design Real-Time OLAP (Druid / Pinot)", "design-realtime-olap",
    ["case-study", "olap", "columnar", "low-latency"],
    "Build a system for SUB-SECOND analytical queries over FRESH, high-volume data (live dashboards: 'ad clicks by region in the last minute, sliced any way'). A batch data warehouse is too slow/stale. What makes real-time OLAP fast?",
    "Ingest streaming events (Kafka) into a COLUMNAR store kept QUERY-READY, combining real-time (recent, in-memory/streaming segments) + historical (older, optimized segments) — so queries see fresh data instantly. Pre-aggregate, index (bitmap indexes on dimensions), and partition by time for sub-second slice-and-dice. It's columnar OLAP (the warehouse idea) made LOW-LATENCY + REAL-TIME, distinct from batch warehouses.",
    [
      { kind: "concept", heading: "The gap it fills",
        body: "A batch DATA WAREHOUSE (the m13 design) does big analytical queries but on data loaded HOURS ago, and queries take seconds-to-minutes. Real-time OLAP (Druid, Pinot, ClickHouse) targets a different need: SUB-SECOND interactive analytical queries (group-by, filter, aggregate across many dimensions — slice and dice) over FRESH data (events available to query seconds after they happen). Think live operational dashboards, real-time ad analytics (the ad-click aggregator's serving layer), user-facing metrics. Low latency + freshness is the goal." },
      { kind: "concept", heading: "Columnar + indexed for speed",
        body: "Like a warehouse, it's COLUMNAR (analytical queries touch few columns; columns compress well — the m13 reasoning). But to hit SUB-SECOND latency it adds aggressive INDEXING: BITMAP INDEXES on dimension columns (fast filtering — which rows match region=US AND device=mobile), pre-aggregation/rollups at ingestion, and partitioning by TIME (prune to the relevant time range instantly). Data is stored in immutable SEGMENTS distributed across nodes; queries scatter-gather across segments in parallel (the search-engine pattern)." },
      { kind: "concept", heading: "Real-time + historical (lambda-ish)",
        body: "Freshness comes from a TWO-PART ingestion: a REAL-TIME path consumes the event stream (Kafka) and makes recent events queryable immediately (in memory / small recent segments), while a HISTORICAL path persists older data into optimized, compacted segments (handed off to deep storage). A query transparently merges results from BOTH (recent + historical) — so you see up-to-the-second data without waiting for batch loading. Segments are eventually compacted/optimized in the background." },
      { kind: "concept", heading: "Architecture & follow-ups",
        body: "Roles (Druid-style): ingestion nodes (real-time), historical nodes (serve segments from deep storage), a broker (scatter-gather a query across the relevant segments and merge), and a coordinator (segment placement/balancing). Data lives in cheap DEEP STORAGE (object storage) and is loaded onto historical nodes for serving. Follow-ups: 'high cardinality (the metrics-DB pitfall)', 'exact vs approximate (HLL for distinct counts)', 'vs warehouse vs stream processing', 'upserts/late data'. Signal: columnar + bitmap-indexed + time-partitioned segments + real-time(stream)+historical merge for freshness + scatter-gather brokers; low-latency real-time analytical queries, distinct from batch warehouses.",
      },
    ],
    "Real-time OLAP tests sub-second analytics on fresh data: a columnar, bitmap-indexed, time-partitioned segment store that merges a real-time (streaming) path with a historical path for freshness, queried via scatter-gather brokers. It's the warehouse's columnar idea made low-latency + real-time (Druid/Pinot) — distinct from batch warehouses and from stream processing.",
    ["Using a batch data warehouse for sub-second queries on fresh data (too slow/stale).",
     "Row storage / no bitmap indexing / no time partitioning (can't hit sub-second slice-and-dice).",
     "Only a batch path (stale) — missing the real-time stream + historical merge for freshness."],
    0.6, { type: "Real-time OLAP", description: "Events (Kafka) → real-time ingestion (recent, immediately queryable) + historical path (compacted segments in deep storage). Columnar + bitmap indexes + time-partitioned segments. Broker scatter-gathers a query across recent + historical segments → merge → sub-second result.", alt: "Real-time OLAP: columnar time-partitioned segments merging real-time and historical data via brokers." }),
];

const EXERCISES = [
  // Saga
  pm({ topicId: "sysd_m19_t1", exerciseId: "sysd_m19_t1_pm_1", position: 1, level: "hard", title: "No global rollback",
    scenario: "A multi-service transaction can't use one ACID transaction, so on a mid-way failure you…",
    options: ["Run compensating actions for completed steps in reverse (saga)", "Roll back the global transaction", "Leave it half-done", "Retry the whole thing forever"], correct: "Run compensating actions for completed steps in reverse (saga)",
    explanation: "Each local step has a compensation; failure triggers reverse-order semantic rollback — there's no global rollback." }),
  pm({ topicId: "sysd_m19_t1", exerciseId: "sysd_m19_t1_pm_2", position: 2, level: "medium", title: "Coordination",
    scenario: "Orchestration vs choreography for a saga:",
    options: ["Orchestration = central state-machine driver; choreography = services react to events", "They're identical", "Choreography needs a coordinator", "Orchestration uses no state"], correct: "Orchestration = central state-machine driver; choreography = services react to events",
    explanation: "Orchestration centralizes control (clear, monitorable); choreography is event-driven (loose, harder to trace)." }),
  pm({ topicId: "sysd_m19_t1", exerciseId: "sysd_m19_t1_pm_3", position: 3, level: "medium", title: "Resume + safety",
    scenario: "To survive crashes and retries, a saga needs…",
    options: ["Persisted saga state + idempotent steps/compensations", "Nothing special", "A single big lock", "All steps in memory"], correct: "Persisted saga state + idempotent steps/compensations",
    explanation: "Persisted state lets the orchestrator resume; idempotency handles replays/retries safely." }),
  // Music streaming
  pm({ topicId: "sysd_m19_t2", exerciseId: "sysd_m19_t2_pm_1", position: 1, level: "medium", title: "Instant playback",
    scenario: "Audio is delivered with instant playback by…",
    options: ["CDN edge caching of transcoded audio with adaptive bitrate", "Streaming from a single origin server", "Sending the whole library to the client", "A relational DB"], correct: "CDN edge caching of transcoded audio with adaptive bitrate",
    explanation: "The catalog is small + cacheable; CDN edges near users + adaptive bitrate give instant, smooth playback." }),
  pm({ topicId: "sysd_m19_t2", exerciseId: "sysd_m19_t2_pm_2", position: 2, level: "medium", title: "Discover Weekly",
    scenario: "Personalized recommendations use…",
    options: ["An offline-trained candidate→rank funnel over listening data", "Live full-catalog scoring per request", "Random songs", "Alphabetical order"], correct: "An offline-trained candidate→rank funnel over listening data",
    explanation: "The recommender funnel (CF/embeddings → ranking) is computed offline and served fast (Discover Weekly)." }),
  pm({ topicId: "sysd_m19_t2", exerciseId: "sysd_m19_t2_pm_3", position: 3, level: "medium", title: "Events",
    scenario: "Playback events (plays/skips) are streamed to analytics primarily for…",
    options: ["Royalties, charts, and recommendation training", "Nothing", "Slowing playback", "User login"], correct: "Royalties, charts, and recommendation training",
    explanation: "Play counts drive royalties + charts and feed the recommendation models (feedback loop)." }),
  // Distributed FS
  pm({ topicId: "sysd_m19_t3", exerciseId: "sysd_m19_t3_pm_1", position: 1, level: "hard", title: "Master role",
    scenario: "In GFS/HDFS, the master/NameNode holds…",
    options: ["Only metadata (file→chunks→nodes); clients read data nodes directly", "All the file data", "Half of each file", "Nothing"], correct: "Only metadata (file→chunks→nodes); clients read data nodes directly",
    explanation: "Separating metadata (master) from data (data nodes) keeps the master from being a data bottleneck." }),
  pm({ topicId: "sysd_m19_t3", exerciseId: "sysd_m19_t3_pm_2", position: 2, level: "medium", title: "Survive failures",
    scenario: "On thousands of commodity machines that constantly fail, durability comes from…",
    options: ["Replicating each chunk 3× (rack-aware) + re-replicating lost chunks", "Hoping disks don't fail", "A single backup", "RAID only"], correct: "Replicating each chunk 3× (rack-aware) + re-replicating lost chunks",
    explanation: "Rack-aware 3× replication + heartbeat-driven re-replication makes failures expected and self-healed." }),
  pm({ topicId: "sysd_m19_t3", exerciseId: "sysd_m19_t3_pm_3", position: 3, level: "medium", title: "Workload",
    scenario: "A distributed file system is optimized for…",
    options: ["Large sequential reads/appends (not small random writes)", "Low-latency small files", "Random in-place updates", "Transactions"], correct: "Large sequential reads/appends (not small random writes)",
    explanation: "Huge blocks + append-heavy design suit big sequential analytics reads; small files are a known weakness." }),
  // Forms platform
  pm({ topicId: "sysd_m19_t4", exerciseId: "sysd_m19_t4_pm_1", position: 1, level: "hard", title: "Unknown schema",
    scenario: "How do you store responses to forms whose structure users define?",
    options: ["Form definition as schema-as-data; responses as documents (NoSQL/flexible) keyed by question ids", "A fixed table per form", "One giant text column for everything", "Don't store responses"], correct: "Form definition as schema-as-data; responses as documents (NoSQL/flexible) keyed by question ids",
    explanation: "Schema-as-data + document responses handle arbitrary, varying, versioned form structures." }),
  pm({ topicId: "sysd_m19_t4", exerciseId: "sysd_m19_t4_pm_2", position: 2, level: "medium", title: "Viral form",
    scenario: "A form goes viral with millions of submissions in minutes. Handle it with…",
    options: ["A queue/buffer + horizontal scaling + idempotent submit", "A single DB connection", "Rejecting submissions", "Synchronous writes only"], correct: "A queue/buffer + horizontal scaling + idempotent submit",
    explanation: "Buffer the spike, scale stateless write servers, and dedupe submissions (idempotent) to absorb bursts." }),
  pm({ topicId: "sysd_m19_t4", exerciseId: "sysd_m19_t4_pm_3", position: 3, level: "medium", title: "Analytics",
    scenario: "Real-time result dashboards are served by…",
    options: ["Pre-aggregated counts/rollups updated as responses arrive", "Scanning all responses per view", "Exporting to Excel each time", "A nightly batch only"], correct: "Pre-aggregated counts/rollups updated as responses arrive",
    explanation: "Increment per-option counters/rollups on submit; the raw store remains the source of truth for export." }),
  // Package registry
  pm({ topicId: "sysd_m19_t5", exerciseId: "sysd_m19_t5_pm_1", position: 1, level: "hard", title: "Versions",
    scenario: "A published package version should be…",
    options: ["Immutable (never changes; only new versions added) — for reproducible builds", "Editable in place", "Overwritten on republish", "Deleted after download"], correct: "Immutable (never changes; only new versions added) — for reproducible builds",
    explanation: "Immutability guarantees the same version always yields the same bytes (lockfile reproducibility) and is cacheable." }),
  pm({ topicId: "sysd_m19_t5", exerciseId: "sysd_m19_t5_pm_2", position: 2, level: "medium", title: "Serve downloads",
    scenario: "Massive download traffic is served via…",
    options: ["A CDN (immutable artifacts cached forever)", "The origin database", "Email", "One server"], correct: "A CDN (immutable artifacts cached forever)",
    explanation: "Downloads are read-heavy and artifacts are immutable, so CDN edge caching serves nearly all traffic." }),
  pm({ topicId: "sysd_m19_t5", exerciseId: "sysd_m19_t5_pm_3", position: 3, level: "medium", title: "Security",
    scenario: "Because the registry is a supply-chain attack target, you add…",
    options: ["Integrity hashes + signing + malware/vuln scanning on publish", "Nothing — trust publishers", "Only a password", "Obfuscation"], correct: "Integrity hashes + signing + malware/vuln scanning on publish",
    explanation: "Clients verify hashes; signing proves provenance; scanning catches malicious packages (supply-chain defense)." }),
  // Bot detection
  pm({ topicId: "sysd_m19_t6", exerciseId: "sysd_m19_t6_pm_1", position: 1, level: "hard", title: "Beyond static captcha",
    scenario: "Modern bot detection primarily…",
    options: ["Risk-scores requests from many signals; challenges only when risk is high (invisible for most)", "Shows everyone a distorted-text captcha", "Blocks all new IPs", "Trusts the client's 'I am human' flag"], correct: "Risk-scores requests from many signals; challenges only when risk is high (invisible for most)",
    explanation: "Risk-based scoring lets most real users through invisibly and escalates only suspicious traffic." }),
  pm({ topicId: "sysd_m19_t6", exerciseId: "sysd_m19_t6_pm_2", position: 2, level: "medium", title: "Signals",
    scenario: "The risk score combines…",
    options: ["Behavioral + environmental + historical/velocity signals (ML, server-side)", "Only the IP address", "Only the password", "Only the time of day"], correct: "Behavioral + environmental + historical/velocity signals (ML, server-side)",
    explanation: "Mouse/typing patterns, IP/device fingerprint, and rate/abuse history combine into an ML risk score (like fraud detection)." }),
  pm({ topicId: "sysd_m19_t6", exerciseId: "sysd_m19_t6_pm_3", position: 3, level: "medium", title: "Why retrain",
    scenario: "Continuous retraining is needed because…",
    options: ["It's an adversarial arms race — bots adapt to any fixed defense", "Models get bored", "Hardware ages", "Users change passwords"], correct: "It's an adversarial arms race — bots adapt to any fixed defense",
    explanation: "Bots evolve to beat defenses, so the system retrains on labeled abuse and adapts (feedback loop)." }),
  // Marketplace
  pm({ topicId: "sysd_m19_t7", exerciseId: "sysd_m19_t7_pm_1", position: 1, level: "hard", title: "The real crux",
    scenario: "Beyond listings and search, what makes a marketplace actually work?",
    options: ["Trust & safety (ratings/reviews, verification, fraud detection, disputes)", "A faster database", "More buttons", "A bigger catalog only"], correct: "Trust & safety (ratings/reviews, verification, fraud detection, disputes)",
    explanation: "Strangers won't transact without trust; ratings, verification, fraud detection, and disputes are the crux." }),
  pm({ topicId: "sysd_m19_t7", exerciseId: "sysd_m19_t7_pm_2", position: 2, level: "medium", title: "Payments",
    scenario: "Marketplace payments typically use…",
    options: ["Escrow — hold the buyer's payment, release to seller on fulfillment (− commission)", "Direct buyer-to-seller transfer", "Cash only", "No payments"], correct: "Escrow — hold the buyer's payment, release to seller on fulfillment (− commission)",
    explanation: "Escrow protects both sides (buyer not charged for nothing; seller assured payment) and enables the platform fee." }),
  pm({ topicId: "sysd_m19_t7", exerciseId: "sysd_m19_t7_pm_3", position: 3, level: "medium", title: "Chicken-and-egg",
    scenario: "The existential marketplace problem is…",
    options: ["Liquidity / cold-start — needing enough of BOTH sides for matches", "Choosing a database", "Picking a logo", "Server costs"], correct: "Liquidity / cold-start — needing enough of BOTH sides for matches",
    explanation: "Buyers won't come without sellers and vice versa; achieving two-sided liquidity is the core challenge." }),
  // Real-time OLAP
  pm({ topicId: "sysd_m19_t8", exerciseId: "sysd_m19_t8_pm_1", position: 1, level: "hard", title: "vs warehouse",
    scenario: "Real-time OLAP (Druid/Pinot) differs from a batch warehouse in…",
    options: ["Sub-second queries on FRESH data (real-time + historical merged)", "It's slower", "It can't aggregate", "It's row-oriented"], correct: "Sub-second queries on FRESH data (real-time + historical merged)",
    explanation: "It targets interactive sub-second analytics on up-to-the-second data, vs the warehouse's batch-loaded, slower queries." }),
  pm({ topicId: "sysd_m19_t8", exerciseId: "sysd_m19_t8_pm_2", position: 2, level: "hard", title: "Speed",
    scenario: "Sub-second slice-and-dice comes from…",
    options: ["Columnar storage + bitmap indexes + time-partitioned segments (scatter-gather)", "Scanning rows", "A single big table", "Caching only"], correct: "Columnar storage + bitmap indexes + time-partitioned segments (scatter-gather)",
    explanation: "Columnar + bitmap indexes for fast filtering + time partitioning + parallel segment scans hit sub-second latency." }),
  pm({ topicId: "sysd_m19_t8", exerciseId: "sysd_m19_t8_pm_3", position: 3, level: "medium", title: "Freshness",
    scenario: "Data is fresh because the system…",
    options: ["Merges a real-time (streaming) path with a historical path at query time", "Only loads data nightly", "Ignores recent events", "Uses a single batch job"], correct: "Merges a real-time (streaming) path with a historical path at query time",
    explanation: "Recent events are queryable immediately via the real-time path; queries merge them with historical segments." }),
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
  console.log(`\nDone — M19 Case Studies XIII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
