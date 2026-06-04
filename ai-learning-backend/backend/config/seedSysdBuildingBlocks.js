/**
 * Seed — System Design module M2: Building Blocks & Distributed-Systems Patterns.
 * Extends pro_sysd (Fundamentals live in M1).
 *
 * Idempotent upsert-by-id; recomputes track totals. All exercises pattern_match.
 * Usage:  node config/seedSysdBuildingBlocks.js   ·   npm: npm run seed:sysd-blocks
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m2";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 2,
  name: "Building Blocks & Distributed Patterns", slug: "building-blocks-patterns",
  description: "The reusable components and distributed-systems patterns every large design assembles from: API design & gateways, CDNs, microservices, service discovery, idempotency, resilience patterns, consensus, distributed transactions, and probabilistic structures.",
  estimatedHours: 6, prerequisites: ["sysd_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 30, difficulty: 3, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 30, difficulty: diff, xpReward: 55, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("sysd_m2_t1", 1, "API Design — REST vs gRPC vs GraphQL", "sysd-api-design",
    ["api", "rest", "grpc", "graphql"],
    "Two services need to talk, or a mobile app needs exactly the fields it wants. REST, gRPC, or GraphQL — and why?",
    "REST is simple, cacheable, ubiquitous (public APIs). gRPC is fast, binary, strongly-typed (internal service-to-service). GraphQL lets clients request exactly the fields they need, avoiding over/under-fetching (flexible front-end APIs). Match the protocol to the caller.",
    [
      { kind: "concept", heading: "REST",
        body: "Resource-oriented over HTTP/JSON, stateless, cacheable, and universally supported. Great for public APIs and CRUD. Downsides: over-fetching (you get the whole resource) and under-fetching (N+1 round trips to assemble a view), and no built-in schema/typing." },
      { kind: "concept", heading: "gRPC",
        body: "Binary Protocol Buffers over HTTP/2 — compact, fast, strongly-typed via a schema (.proto), supports streaming. Ideal for INTERNAL service-to-service calls at scale. Downsides: not human-readable, weak browser support, harder to debug/cache than REST." },
      { kind: "concept", heading: "GraphQL",
        body: "A single endpoint where the client specifies exactly which fields it wants in one query — eliminates over/under-fetching, great for varied front-ends (mobile vs web). Downsides: caching is harder (one endpoint), complex queries can be expensive (need depth/cost limits), and server complexity rises." },
      { kind: "concept", heading: "Choosing",
        body: "Public/third-party API or simple CRUD → REST. High-throughput internal microservice calls → gRPC. Front-end that needs flexible, precise data shaping across devices → GraphQL. Many systems use all three at different layers (gRPC internally, REST/GraphQL at the edge)." },
      { kind: "concept", heading: "In the wild",
        body: "Stripe, GitHub, and Twilio expose REST (broad reach, easy to consume); Google, Netflix, and most service meshes use gRPC internally for low-latency typed calls; GitHub's v4 API, Shopify, and many mobile backends use GraphQL to let clients fetch exactly what they need. A common real architecture: GraphQL/REST at the edge (BFF) → gRPC between internal services. Match the protocol to the consumer, not to fashion." },
    ],
    "API-protocol choice opens many interviews. The signal is mapping each to its sweet spot (REST public, gRPC internal, GraphQL flexible front-ends) and naming the over/under-fetching trade-off.",
    ["Claiming one protocol is universally best instead of per-layer.",
     "Forgetting gRPC's weak browser/caching story or GraphQL's caching/cost challenges.",
     "Ignoring REST over/under-fetching, which is GraphQL's whole motivation."],
    0.4, null),

  T("sysd_m2_t2", 2, "API Gateway & BFF", "sysd-api-gateway",
    ["api-gateway", "bff", "edge"],
    "Fifty microservices, but clients shouldn't call them directly. What sits at the front door to authenticate, route, and rate-limit?",
    "An API Gateway is the single entry point that handles cross-cutting concerns — auth, rate limiting, routing, TLS termination, request aggregation — so individual services don't each reimplement them. A BFF (Backend-for-Frontend) is a gateway tailored per client type.",
    [
      { kind: "concept", heading: "What the gateway does",
        body: "It's the front door for all client traffic: authentication/authorization, rate limiting, request routing to the right service, TLS termination, response caching, request/response transformation, and aggregating multiple service calls into one client response. Centralising these keeps services focused on business logic." },
      { kind: "concept", heading: "Backend-for-Frontend (BFF)",
        body: "Different clients (web, iOS, Android) need different data shapes and aggregations. A BFF is a gateway dedicated to one client type, tailoring responses for it — avoiding a one-size-fits-all API that over-serves some clients and under-serves others." },
      { kind: "concept", heading: "Trade-offs",
        body: "A gateway decouples clients from the service topology and centralises policy — but it can become a bottleneck or single point of failure (run it redundant) and a deployment chokepoint if it accretes business logic. Keep it thin: cross-cutting concerns only, not domain logic." },
      { kind: "concept", heading: "In the wild",
        body: "Real gateways: AWS API Gateway, Kong, nginx, Apigee, Spring Cloud Gateway, and Netflix's Zuul. Netflix popularised the BFF (a tailored gateway per device type). The gateway typically also does auth/JWT validation, rate limiting, request/response logging, and TLS termination — so each of the dozens of services behind it doesn't reimplement them. Run it as a redundant fleet behind a load balancer so the front door isn't a SPOF." },
    ],
    "The API gateway appears in essentially every microservices design. Interviewers want the cross-cutting-concerns role, the BFF variant, and awareness of the 'don't put business logic in the gateway' / SPOF pitfalls.",
    ["Putting domain/business logic in the gateway instead of services.",
     "Treating the gateway as a SPOF rather than running it redundant.",
     "Letting clients call services directly, duplicating auth/rate-limiting everywhere."],
    0.4, { type: "API gateway", description: "Edge flow: Client → API Gateway → Service A, Service B, Service C. The gateway handles auth, rate limiting, and routing before requests reach internal services.", alt: "Client to API gateway to multiple internal services." }),

  T("sysd_m2_t3", 3, "CDN & Edge Caching", "sysd-cdn",
    ["cdn", "edge", "caching", "static"],
    "Users worldwide load your images and JS slowly because your origin is in one region. What serves bytes from near them?",
    "A CDN caches static/media content at edge locations near users, cutting latency and offloading the origin. The keys are what to cache (static vs dynamic), TTL/invalidation, and push vs pull distribution.",
    [
      { kind: "concept", heading: "Why a CDN",
        body: "A CDN replicates content to edge PoPs around the world; users fetch from the nearest one, slashing latency and origin load. It's the single biggest win for static assets (images, video, JS/CSS) and is essential for global, media-heavy products." },
      { kind: "concept", heading: "Pull vs push",
        body: "Pull CDN: the edge fetches from the origin on the first request for a URL, then caches it (lazy, simple, origin-driven). Push CDN: you upload content to the CDN proactively (good for large/rarely-changing files you know in advance). Pull is the common default for web assets." },
      { kind: "concept", heading: "Caching dynamic content + invalidation",
        body: "Static content caches easily with long TTLs. Dynamic/personalised content is harder — use short TTLs, cache-control headers, or edge compute. Invalidation (purging stale content after a deploy) is done via versioned URLs (fingerprinted filenames) or explicit cache purges. Versioned URLs are the cleanest." },
    ],
    "CDNs come up in any global or media-heavy design. The signal is reaching for one for static/media, plus knowing pull-vs-push and cache invalidation via versioned URLs.",
    ["Forgetting a CDN for global static/media delivery.",
     "Trying to cache personalised dynamic content with long TTLs.",
     "Invalidating via guesswork instead of versioned/fingerprinted URLs."],
    0.3, { type: "CDN delivery", description: "Asset path: User → CDN Edge → Origin Server. The edge serves cached assets directly; only cache misses reach the origin.", alt: "User to CDN edge to origin server." }),

  T("sysd_m2_t4", 4, "Microservices vs Monolith", "sysd-microservices",
    ["microservices", "monolith", "architecture"],
    "Split into 30 services or keep one deployable? The wrong call early can sink a team. What actually decides it?",
    "A monolith is simpler to build, deploy, and debug — the right default for small teams/early products. Microservices enable independent scaling and deployment per team but add network, data-consistency, and operational complexity. Split along bounded contexts, and usually only once the monolith hurts.",
    [
      { kind: "concept", heading: "Monolith strengths",
        body: "One codebase, one deploy, in-process calls (no network), easy transactions, simple local testing/debugging. It's the right default for small teams and early-stage products — premature microservices are a classic over-engineering mistake." },
      { kind: "concept", heading: "Microservices strengths",
        body: "Independent deployment and scaling per service, technology heterogeneity, team autonomy (one team per service), and fault isolation. They shine at organisational scale (many teams) and when different parts have very different scaling needs." },
      { kind: "concept", heading: "The costs",
        body: "Network calls (latency, partial failure), distributed data (no easy cross-service transactions → sagas), operational overhead (observability, deployment, service discovery), and harder end-to-end testing. Microservices trade development simplicity for operational complexity and scalability." },
      { kind: "concept", heading: "How to split",
        body: "Split along bounded contexts / business capabilities (Domain-Driven Design), not technical layers. Each service owns its data (no shared database). A common path is 'monolith first, extract services when a clear seam and a scaling/team reason appear'." },
      { kind: "concept", heading: "In the wild",
        body: "Amazon ('two-pizza teams', each owning a service end-to-end) and Netflix are the canonical microservices adopters; both moved FROM monoliths once team and scale pressure demanded it. The cautionary tale is equally instructive: many startups over-split early and drown in operational overhead (deploys, tracing, distributed-data bugs). The modern consensus — even from microservices advocates — is 'start with a well-structured monolith (a modular monolith), extract services when a real seam + scaling/team reason appears.'" },
    ],
    "The monolith-vs-microservices trade-off is a frequent senior discussion. Strong answers default to a monolith for small scale and justify microservices by team/scaling needs, splitting on bounded contexts with per-service data ownership.",
    ["Defaulting to microservices for a small team/product (premature complexity).",
     "Splitting by technical layer instead of bounded context.",
     "Sharing a database across services, defeating independence."],
    0.4, null),

  T("sysd_m2_t5", 5, "Service Discovery", "sysd-service-discovery",
    ["service-discovery", "registry", "service-mesh"],
    "Service A must call service B, but B's instances come and go and change IPs constantly. How does A find a healthy B?",
    "Service discovery lets services find each other dynamically via a registry of healthy instances. Client-side discovery has the caller query the registry; server-side has a load balancer do it. A service mesh (sidecars) externalises this plus retries, mTLS, and observability.",
    [
      { kind: "concept", heading: "The problem",
        body: "In dynamic environments (autoscaling, containers), instances are created/destroyed with changing IPs. Hard-coding addresses breaks. A service registry (Consul, etcd, Eureka) tracks healthy instances; services register on startup and deregister/health-check out, and callers look up current addresses." },
      { kind: "concept", heading: "Client-side vs server-side discovery",
        body: "Client-side: the caller queries the registry and load-balances itself (less infra, but logic in every client). Server-side: the caller hits a load balancer/router that consults the registry (simpler clients, the LB is the integration point). Most cloud setups use server-side via a managed LB/DNS." },
      { kind: "concept", heading: "Service mesh",
        body: "A service mesh (Istio, Linkerd) puts a sidecar proxy next to each service to handle discovery, load balancing, retries, timeouts, mTLS, and telemetry — moving these concerns out of application code into the platform. Powerful at scale, but adds operational complexity." },
    ],
    "Service discovery appears in any microservices design. The signal is naming a registry + health checks and the client-side/server-side split, with service mesh as the scale-up answer.",
    ["Hard-coding service addresses in a dynamic environment.",
     "Forgetting health checks so the registry serves dead instances.",
     "Reaching for a full service mesh before it's warranted."],
    0.4, null),

  T("sysd_m2_t6", 6, "Idempotency & Retries", "sysd-idempotency",
    ["idempotency", "retries", "exactly-once"],
    "A payment request times out. The client retries. How do you avoid charging the customer twice?",
    "Make the operation idempotent: a unique idempotency key lets the server detect and dedupe a retried request, so repeating it has the same effect as doing it once. This is the foundation for safe retries in unreliable networks.",
    [
      { kind: "concept", heading: "Why it matters",
        body: "Networks fail mid-request, so clients retry — and at-least-once delivery means duplicates. Without idempotency, a retried 'charge $100' or 'create order' executes twice. Idempotency makes a repeated request produce the same result as a single one (no double effect)." },
      { kind: "concept", heading: "Idempotency keys",
        body: "The client generates a unique key per logical operation and sends it (e.g. an Idempotency-Key header). The server records processed keys; if it sees the same key again, it returns the original result instead of re-executing. Stripe's API is the canonical example." },
      { kind: "concept", heading: "Naturally idempotent vs not",
        body: "GET/PUT/DELETE are naturally idempotent (setting x=5 twice = once). POST (create) is NOT — it's where keys are essential. Increments ('add 1') are not idempotent without a key. Design mutations to be idempotent wherever possible." },
      { kind: "concept", heading: "Retry safely",
        body: "Combine idempotency with exponential backoff + jitter (to avoid retry storms) and a retry budget/circuit breaker. 'Exactly-once' end-to-end is usually achieved as at-least-once delivery + idempotent processing — true exactly-once is very hard." },
      { kind: "concept", heading: "In the wild",
        body: "Stripe's API is the reference implementation: you send an Idempotency-Key header on a charge, and a retry with the same key returns the original result instead of double-charging. Payment processors, order-placement endpoints, and message consumers (Kafka, SQS — both at-least-once) all rely on this. Practical recipe: client generates a UUID per logical operation; server stores processed keys (Redis with a TTL) and short-circuits duplicates." },
    ],
    "Idempotency is asked wherever money or state-changing writes meet unreliable networks (payments, orders, messaging). The signal is the idempotency-key pattern and 'exactly-once = at-least-once + idempotency'.",
    ["Assuming the network is reliable and skipping idempotency on writes.",
     "Treating POST/create as idempotent without a key.",
     "Retrying without backoff+jitter, causing retry storms."],
    0.4, null),

  T("sysd_m2_t7", 7, "Resilience: Circuit Breaker, Bulkhead, Timeouts", "sysd-resilience",
    ["resilience", "circuit-breaker", "bulkhead", "timeout"],
    "One slow downstream service starts a chain reaction that takes down your whole system. How do you contain the blast?",
    "Resilience patterns stop cascading failures: timeouts bound how long you wait, circuit breakers stop hammering a failing dependency, bulkheads isolate resource pools so one failure can't drain everything, and fallbacks degrade gracefully.",
    [
      { kind: "concept", heading: "Timeouts",
        body: "Never wait indefinitely for a downstream call — a hung dependency ties up threads/connections until the caller exhausts its pool and fails too. Set aggressive timeouts on every remote call so failures surface fast instead of propagating as slowness." },
      { kind: "concept", heading: "Circuit breaker",
        body: "When a dependency fails repeatedly, the breaker 'opens' and fails fast (returns an error/fallback immediately) instead of sending doomed requests. After a cooldown it goes 'half-open' to test recovery, then 'closes' if healthy. This protects both the caller (frees resources) and the struggling dependency (stops the pile-on)." },
      { kind: "concept", heading: "Bulkhead",
        body: "Isolate resources (thread pools, connection pools) per dependency so a failure in one can't consume all capacity and sink the others — like watertight compartments in a ship. One slow integration then degrades only its own feature." },
      { kind: "concept", heading: "Fallbacks & graceful degradation",
        body: "When a dependency is down, return a sensible fallback (cached/stale data, a default, a reduced feature) instead of an error. Combined with timeouts + breakers + bulkheads, the system degrades gracefully under partial failure instead of collapsing." },
      { kind: "concept", heading: "In the wild",
        body: "Netflix pioneered this at scale with Hystrix (now succeeded by Resilience4j) — wrapping every remote call in a timeout + circuit breaker + bulkhead + fallback, so one failing recommendation service degrades to a generic row instead of a blank homepage. Service meshes (Istio/Envoy) and Spring Cloud provide these as config. The interview-grade summary: timeouts on every call, a breaker to stop cascades, bulkheads to isolate, and a fallback to degrade — that's how big systems stay up when parts fail." },
    ],
    "Resilience patterns are a senior signal — interviewers want timeouts on every remote call, a circuit breaker to stop cascades, and bulkheads to isolate failures, with graceful degradation.",
    ["No timeouts, so a hung dependency exhausts the caller's threads.",
     "Retrying into a failing service instead of opening a circuit breaker.",
     "Shared resource pools that let one failure starve everything (no bulkheads)."],
    0.5, null),

  T("sysd_m2_t8", 8, "Consensus & Leader Election", "sysd-consensus",
    ["consensus", "raft", "leader-election", "zookeeper"],
    "Five replicas must agree on one value (or one leader) despite crashes and network hiccups. How do they reach agreement?",
    "Consensus algorithms (Raft, Paxos) let a cluster agree on a single value/log even with failures, typically by electing a leader and requiring a majority (quorum) to commit. Coordination services (ZooKeeper, etcd) package this for leader election, config, and locks.",
    [
      { kind: "concept", heading: "The problem",
        body: "Distributed nodes must agree (on a leader, a committed log entry, a config value) despite crashes, restarts, and message delays — without a single coordinator that could fail. Consensus provides agreement + fault tolerance up to a point." },
      { kind: "concept", heading: "Quorum & majority",
        body: "Most consensus protocols require a majority (quorum) to make progress: with 2f+1 nodes you tolerate f failures (e.g. 5 nodes tolerate 2). A write is committed once a majority acknowledges it, guaranteeing any future majority overlaps and sees it. This is why clusters are odd-sized (3, 5)." },
      { kind: "concept", heading: "Raft (understandable consensus)",
        body: "Raft elects a leader; the leader takes all writes, appends them to a replicated log, and commits once a majority has stored them. If the leader dies, a new election (randomised timeouts) picks another. It's designed to be more understandable than Paxos and underlies etcd/Consul." },
      { kind: "concept", heading: "Coordination services",
        body: "You rarely implement Raft yourself — you use ZooKeeper/etcd for leader election, distributed locks, configuration, and membership. E.g. 'elect one primary among workers' or 'who owns this shard' is delegated to such a service." },
    ],
    "Consensus appears for leader election, distributed locks, and strongly-consistent metadata. Interviewers expect quorum/majority reasoning (2f+1), the leader-based model, and using ZooKeeper/etcd rather than rolling your own.",
    ["Even-sized clusters (no clear majority) or ignoring quorum.",
     "Implementing consensus by hand instead of using etcd/ZooKeeper.",
     "Assuming consensus is free — it costs latency (a majority round-trip per commit)."],
    0.6, null),

  T("sysd_m2_t9", 9, "Distributed Transactions: 2PC vs Saga", "sysd-distributed-tx",
    ["distributed-transactions", "2pc", "saga", "consistency"],
    "An order touches the order service, payment service, and inventory service — three databases. How do you keep them consistent without a single transaction?",
    "You can't use one ACID transaction across services. Two-Phase Commit (2PC) gives atomicity but blocks and doesn't scale; the Saga pattern uses a sequence of local transactions with compensating actions to undo on failure — favouring availability and eventual consistency.",
    [
      { kind: "concept", heading: "Why not one transaction",
        body: "Each microservice owns its own database, so a single ACID transaction can't span them. You need a way to coordinate a multi-step operation (order + payment + inventory) so it either fully completes or cleanly unwinds." },
      { kind: "concept", heading: "Two-Phase Commit (2PC)",
        body: "A coordinator asks all participants to 'prepare' (phase 1); if all vote yes, it tells them to 'commit' (phase 2), else 'abort'. It gives atomic consistency BUT is blocking (participants hold locks awaiting the coordinator), and a coordinator crash can stall everyone. Poor fit for high-scale microservices." },
      { kind: "concept", heading: "Saga pattern",
        body: "Break the operation into a sequence of local transactions, each publishing an event that triggers the next. If a step fails, run COMPENSATING transactions to undo the prior steps (e.g. refund the payment, restock inventory). Choreography (events) or orchestration (a central coordinator) drives it. Favours availability + eventual consistency." },
      { kind: "concept", heading: "Choosing",
        body: "2PC: strong consistency, low scale, tightly-coupled systems that can tolerate blocking. Saga: scalable, loosely-coupled microservices, accepting eventual consistency and the complexity of writing compensations. Most modern microservice systems choose sagas." },
      { kind: "concept", heading: "In the wild & the outbox pattern",
        body: "E-commerce checkout (order + payment + inventory + shipping across services) is the textbook saga; frameworks like Axon, Temporal, and Camunda orchestrate them. A crucial companion is the TRANSACTIONAL OUTBOX: write the business change and an 'event to publish' row in ONE local DB transaction, then a relay reliably publishes the event — avoiding the dual-write problem (DB committed but the event lost on crash). Saga + outbox is how real microservices keep data consistent without distributed locks." },
    ],
    "Distributed transactions come up whenever a workflow spans services. The signal is recognising you can't use one ACID transaction and reaching for sagas + compensating actions (and knowing 2PC's blocking downside).",
    ["Assuming a cross-service ACID transaction is possible.",
     "Choosing 2PC for high-scale microservices despite its blocking nature.",
     "Forgetting that sagas need compensating (undo) transactions for each step."],
    0.6, null),

  T("sysd_m2_t10", 10, "Bloom Filters & Probabilistic Structures", "sysd-bloom-filters",
    ["bloom-filter", "probabilistic", "memory"],
    "Before a costly DB/disk lookup, you want to cheaply ask 'is this key DEFINITELY not present?' using tiny memory. What structure does that?",
    "A Bloom filter is a compact, probabilistic set that answers membership with NO false negatives and a tunable false-positive rate — 'definitely not present' or 'probably present'. It saves expensive lookups for absent keys at a fraction of the memory of a real set.",
    [
      { kind: "concept", heading: "How it works",
        body: "A bit array + k hash functions. To add an item, set the k bits its hashes point to. To query, check those k bits: if ANY is 0 the item is DEFINITELY absent; if all are 1 it's PROBABLY present (could be a false positive from other items' bits). No false negatives — that's the key guarantee." },
      { kind: "concept", heading: "The trade-off",
        body: "You get huge memory savings (bits, not full keys) and O(k) lookups, in exchange for false positives (tunable via array size + k) and no deletion in the basic version (a 0→1 bit may be shared). Counting Bloom filters allow deletes at extra cost." },
      { kind: "concept", heading: "Where it's used",
        body: "As a cheap pre-check before an expensive operation: 'is this key in the DB/on disk?' (Cassandra/HBase/BigTable use them to skip SSTable reads), 'has this URL been crawled?', 'is this username taken?' (fast negative), CDN/cache 'have we seen this?'. The false positive just means an occasional unnecessary real lookup — never a missed one." },
    ],
    "Bloom filters are a favourite 'how do you save lookups at scale?' answer (web crawlers, DB read paths, caches). The signal is the no-false-negatives / tunable-false-positives property and a concrete use as a pre-check.",
    ["Thinking a Bloom filter can have false negatives (it can't).",
     "Trying to delete from a basic Bloom filter (use a counting variant).",
     "Using one where exact membership is required without a backing store for confirmation."],
    0.5, null),
];

const EXERCISES = [
  // T1 API Design
  pm({ topicId: "sysd_m2_t1", exerciseId: "sysd_m2_t1_pm_1", position: 1, level: "medium",
    title: "Internal service-to-service",
    scenario: "Two internal microservices exchange millions of strongly-typed messages with low latency. Which protocol fits best?",
    options: ["gRPC", "REST/JSON", "GraphQL", "SOAP"], correct: "gRPC",
    explanation: "Binary Protobuf over HTTP/2 is compact, fast, and strongly-typed — ideal for high-throughput internal calls." }),
  pm({ topicId: "sysd_m2_t1", exerciseId: "sysd_m2_t1_pm_2", position: 2, level: "medium",
    title: "Avoid over/under-fetching",
    scenario: "A mobile app and a web app need different subsets of fields and want them in one round trip. Which API style targets this directly?",
    options: ["GraphQL", "REST", "gRPC", "WebSockets"], correct: "GraphQL",
    explanation: "GraphQL lets each client request exactly the fields it needs in one query, eliminating over/under-fetching." }),
  pm({ topicId: "sysd_m2_t1", exerciseId: "sysd_m2_t1_pm_3", position: 3, level: "easy",
    title: "Public, cacheable API",
    scenario: "You're exposing a simple public CRUD API that should be easy to consume and HTTP-cacheable. Which fits best?",
    options: ["REST", "gRPC", "GraphQL", "A message queue"], correct: "REST",
    explanation: "REST over HTTP/JSON is simple, ubiquitous, and cacheable — the default for public CRUD APIs." }),

  // T2 API Gateway
  pm({ topicId: "sysd_m2_t2", exerciseId: "sysd_m2_t2_pm_1", position: 1, level: "easy",
    title: "Where do cross-cutting concerns live?",
    scenario: "Auth, rate limiting, TLS termination, and routing shouldn't be reimplemented in every microservice. Where do they belong?",
    options: ["The API gateway", "Each microservice", "The database", "The CDN"], correct: "The API gateway",
    explanation: "The gateway centralises cross-cutting concerns at the front door so services focus on business logic." }),
  pm({ topicId: "sysd_m2_t2", exerciseId: "sysd_m2_t2_pm_2", position: 2, level: "medium",
    title: "Per-client tailoring",
    scenario: "Web and mobile clients need different aggregations and data shapes. What pattern serves each optimally?",
    options: ["Backend-for-Frontend (BFF)", "One shared generic API", "A bigger database", "A CDN per client"], correct: "Backend-for-Frontend (BFF)",
    explanation: "A BFF is a gateway tailored to one client type, shaping responses for it instead of one-size-fits-all." }),
  pm({ topicId: "sysd_m2_t2", exerciseId: "sysd_m2_t2_pm_3", position: 3, level: "medium",
    title: "Gateway anti-pattern",
    scenario: "What should you NOT put in the API gateway?",
    options: ["Domain/business logic", "Authentication", "Rate limiting", "Request routing"], correct: "Domain/business logic",
    explanation: "Keep the gateway thin (cross-cutting concerns only); business logic belongs in services, or the gateway becomes a chokepoint." }),

  // T3 CDN
  pm({ topicId: "sysd_m2_t3", exerciseId: "sysd_m2_t3_pm_1", position: 1, level: "easy",
    title: "Global static delivery",
    scenario: "Images and JS load slowly for users far from your single-region origin. Biggest win?",
    options: ["A CDN caching assets at edge locations", "A faster origin CPU", "A bigger database", "More API gateways"], correct: "A CDN caching assets at edge locations",
    explanation: "A CDN serves content from edge PoPs near users, cutting latency and offloading the origin." }),
  pm({ topicId: "sysd_m2_t3", exerciseId: "sysd_m2_t3_pm_2", position: 2, level: "medium",
    title: "Invalidate cleanly",
    scenario: "After a deploy, users must get the new JS bundle, not a stale cached one. Cleanest approach?",
    options: ["Versioned/fingerprinted URLs (e.g. app.3f9a.js)", "Hope the TTL expires soon", "Disable the CDN", "Use a longer TTL"], correct: "Versioned/fingerprinted URLs (e.g. app.3f9a.js)",
    explanation: "A new content hash in the filename makes it a new URL, so caches fetch the new file — no purge guesswork." }),
  pm({ topicId: "sysd_m2_t3", exerciseId: "sysd_m2_t3_pm_3", position: 3, level: "medium",
    title: "Pull vs push CDN",
    scenario: "For typical web assets fetched on demand, which CDN distribution model is the simple default?",
    options: ["Pull (edge fetches from origin on first request)", "Push (you upload everything proactively)", "Neither — serve from origin", "Both simultaneously per file"], correct: "Pull (edge fetches from origin on first request)",
    explanation: "Pull CDNs lazily cache content on first request — simplest and origin-driven for web assets." }),

  // T4 Microservices
  pm({ topicId: "sysd_m2_t4", exerciseId: "sysd_m2_t4_pm_1", position: 1, level: "medium",
    title: "The right default early",
    scenario: "A 4-person team is building a new product. Which architecture is usually the right default?",
    options: ["A monolith", "30 microservices", "A service mesh", "Serverless-only"], correct: "A monolith",
    explanation: "A monolith is simpler to build/deploy/debug — premature microservices add operational complexity a small team can't absorb." }),
  pm({ topicId: "sysd_m2_t4", exerciseId: "sysd_m2_t4_pm_2", position: 2, level: "medium",
    title: "How to split",
    scenario: "When you do extract microservices, what should the boundaries follow?",
    options: ["Bounded contexts / business capabilities (each owns its data)", "Technical layers (UI/service/DAO)", "Programming language", "Team seating"], correct: "Bounded contexts / business capabilities (each owns its data)",
    explanation: "Split along DDD bounded contexts with per-service data ownership — not technical layers." }),
  pm({ topicId: "sysd_m2_t4", exerciseId: "sysd_m2_t4_pm_3", position: 3, level: "medium",
    title: "The main cost",
    scenario: "What do microservices primarily trade away compared to a monolith?",
    options: ["Development/operational simplicity (network, distributed data, ops)", "Scalability", "Team autonomy", "Independent deployment"], correct: "Development/operational simplicity (network, distributed data, ops)",
    explanation: "Microservices buy independent scaling/deploy at the cost of network calls, distributed data consistency, and operational overhead." }),

  // T5 Service Discovery
  pm({ topicId: "sysd_m2_t5", exerciseId: "sysd_m2_t5_pm_1", position: 1, level: "medium",
    title: "Find a moving target",
    scenario: "Service instances autoscale and change IPs constantly. How does a caller find a healthy instance?",
    options: ["A service registry with health checks (service discovery)", "Hard-coded IP addresses", "A static config file", "DNS with a 24-hour TTL"], correct: "A service registry with health checks (service discovery)",
    explanation: "A registry (Consul/etcd/Eureka) tracks healthy instances; services register/deregister and callers look up current addresses." }),
  pm({ topicId: "sysd_m2_t5", exerciseId: "sysd_m2_t5_pm_2", position: 2, level: "hard",
    title: "Externalize discovery + retries + mTLS",
    scenario: "You want discovery, load balancing, retries, timeouts, and mTLS handled OUTSIDE application code, via sidecars. What is this?",
    options: ["A service mesh (e.g. Istio/Linkerd)", "A monolith", "A CDN", "A message queue"], correct: "A service mesh (e.g. Istio/Linkerd)",
    explanation: "A service mesh uses sidecar proxies to move networking concerns out of app code into the platform." }),
  pm({ topicId: "sysd_m2_t5", exerciseId: "sysd_m2_t5_pm_3", position: 3, level: "medium",
    title: "Stale registry entries",
    scenario: "What keeps a service registry from handing out dead instances?",
    options: ["Health checks that deregister unhealthy instances", "A bigger registry database", "Longer DNS TTLs", "Client-side caching of IPs"], correct: "Health checks that deregister unhealthy instances",
    explanation: "Continuous health checks remove failed instances so callers only get live ones." }),

  // T6 Idempotency
  pm({ topicId: "sysd_m2_t6", exerciseId: "sysd_m2_t6_pm_1", position: 1, level: "medium",
    title: "Avoid the double charge",
    scenario: "A payment POST times out and the client retries. What prevents charging twice?",
    options: ["An idempotency key the server dedupes on", "A faster network", "Disabling retries", "A bigger database transaction"], correct: "An idempotency key the server dedupes on",
    explanation: "A unique per-operation key lets the server detect the retry and return the original result instead of re-executing." }),
  pm({ topicId: "sysd_m2_t6", exerciseId: "sysd_m2_t6_pm_2", position: 2, level: "medium",
    title: "Which is NOT naturally idempotent?",
    scenario: "Which HTTP operation is generally NOT idempotent and most needs an idempotency key?",
    options: ["POST (create)", "PUT (replace)", "DELETE", "GET"], correct: "POST (create)",
    explanation: "PUT/DELETE/GET are naturally idempotent; POST/create executes again on retry, so it needs a key." }),
  pm({ topicId: "sysd_m2_t6", exerciseId: "sysd_m2_t6_pm_3", position: 3, level: "hard",
    title: "How is exactly-once achieved?",
    scenario: "In practice, 'exactly-once' processing over an unreliable network is usually built as…",
    options: ["At-least-once delivery + idempotent processing", "True exactly-once delivery in the network", "At-most-once delivery", "Synchronous-only calls"], correct: "At-least-once delivery + idempotent processing",
    explanation: "Networks give at-least-once; idempotent consumers make duplicates harmless, yielding effectively exactly-once." }),

  // T7 Resilience
  pm({ topicId: "sysd_m2_t7", exerciseId: "sysd_m2_t7_pm_1", position: 1, level: "medium",
    title: "Stop hammering a failing dependency",
    scenario: "A downstream service is failing; you want to fail fast and stop sending it doomed requests, then test recovery later. Which pattern?",
    options: ["Circuit breaker", "Bulkhead", "Retry forever", "Bigger timeout"], correct: "Circuit breaker",
    explanation: "The breaker opens on repeated failures (fail fast), then half-opens to test recovery — protecting caller and dependency." }),
  pm({ topicId: "sysd_m2_t7", exerciseId: "sysd_m2_t7_pm_2", position: 2, level: "medium",
    title: "Isolate the blast radius",
    scenario: "You want one failing integration to consume only its own thread/connection pool, not starve every other feature. Which pattern?",
    options: ["Bulkhead", "Circuit breaker", "Retry", "Cache-aside"], correct: "Bulkhead",
    explanation: "Bulkheads isolate resource pools per dependency, like watertight compartments — one failure can't sink the rest." }),
  pm({ topicId: "sysd_m2_t7", exerciseId: "sysd_m2_t7_pm_3", position: 3, level: "easy",
    title: "The most basic guard",
    scenario: "What's the simplest must-have on every remote call to stop a hung dependency from exhausting your threads?",
    options: ["A timeout", "A bigger thread pool", "More replicas", "A second datacenter"], correct: "A timeout",
    explanation: "Timeouts bound how long you wait so failures surface fast instead of tying up resources indefinitely." }),

  // T8 Consensus
  pm({ topicId: "sysd_m2_t8", exerciseId: "sysd_m2_t8_pm_1", position: 1, level: "hard",
    title: "Fault tolerance math",
    scenario: "A consensus cluster needs to tolerate 2 node failures. How many nodes (2f+1) do you need?",
    options: ["5", "3", "4", "2"], correct: "5",
    explanation: "2f+1 with f=2 → 5 nodes, so a majority (3) is still available with 2 down. Clusters are odd-sized for clear majorities." }),
  pm({ topicId: "sysd_m2_t8", exerciseId: "sysd_m2_t8_pm_2", position: 2, level: "medium",
    title: "Don't roll your own",
    scenario: "You need leader election and a distributed lock for your services. What do you reach for?",
    options: ["A coordination service like ZooKeeper/etcd", "A hand-written Paxos implementation", "A single shared database row", "A CDN"], correct: "A coordination service like ZooKeeper/etcd",
    explanation: "Use battle-tested coordination services for election/locks/config rather than implementing consensus yourself." }),
  pm({ topicId: "sysd_m2_t8", exerciseId: "sysd_m2_t8_pm_3", position: 3, level: "medium",
    title: "Raft's model",
    scenario: "In Raft, how is a write committed?",
    options: ["The leader replicates it and commits once a majority has stored it", "Any node commits immediately", "All nodes must acknowledge", "The client writes to every node"], correct: "The leader replicates it and commits once a majority has stored it",
    explanation: "Raft funnels writes through a leader and commits on majority acknowledgement, guaranteeing durability across elections." }),

  // T9 Distributed Tx
  pm({ topicId: "sysd_m2_t9", exerciseId: "sysd_m2_t9_pm_1", position: 1, level: "hard",
    title: "Scalable cross-service workflow",
    scenario: "An order spans order/payment/inventory services (separate DBs) and you favour availability + scale. Which pattern coordinates it?",
    options: ["Saga (local transactions + compensations)", "Two-Phase Commit", "One ACID transaction across all DBs", "A global table lock"], correct: "Saga (local transactions + compensations)",
    explanation: "Sagas chain local transactions with compensating undo actions — scalable and loosely-coupled, accepting eventual consistency." }),
  pm({ topicId: "sysd_m2_t9", exerciseId: "sysd_m2_t9_pm_2", position: 2, level: "medium",
    title: "2PC's weakness",
    scenario: "Why is Two-Phase Commit a poor fit for high-scale microservices?",
    options: ["It's blocking — participants hold locks awaiting the coordinator", "It can't guarantee atomicity", "It's eventually consistent", "It needs no coordinator"], correct: "It's blocking — participants hold locks awaiting the coordinator",
    explanation: "2PC blocks participants (holding locks) until the coordinator decides; a coordinator stall stalls everyone — bad at scale." }),
  pm({ topicId: "sysd_m2_t9", exerciseId: "sysd_m2_t9_pm_3", position: 3, level: "medium",
    title: "Undo a failed saga step",
    scenario: "A saga's payment step succeeds but the inventory step fails. How is the payment undone?",
    options: ["A compensating transaction (e.g. refund)", "A database rollback across services", "Nothing — leave it", "A two-phase commit"], correct: "A compensating transaction (e.g. refund)",
    explanation: "Sagas undo prior steps with explicit compensating transactions, since there's no cross-service rollback." }),

  // T10 Bloom Filters
  pm({ topicId: "sysd_m2_t10", exerciseId: "sysd_m2_t10_pm_1", position: 1, level: "medium",
    title: "Cheap 'definitely not present' check",
    scenario: "Before an expensive disk/DB lookup you want a tiny-memory check that's never wrong about absence. Which structure?",
    options: ["A Bloom filter", "A hash set of all keys", "A B-tree", "A sorted array"], correct: "A Bloom filter",
    explanation: "A Bloom filter gives no-false-negative membership in minimal memory — perfect as a pre-check to skip absent-key lookups." }),
  pm({ topicId: "sysd_m2_t10", exerciseId: "sysd_m2_t10_pm_2", position: 2, level: "hard",
    title: "What can it get wrong?",
    scenario: "A Bloom filter says a key is 'probably present'. What error is possible, and which is impossible?",
    options: ["False positives possible; false negatives impossible", "False negatives possible; false positives impossible", "Both possible", "Neither possible"], correct: "False positives possible; false negatives impossible",
    explanation: "If any of the k bits is 0 the item is definitely absent (no false negatives); all-1 may be a false positive." }),
  pm({ topicId: "sysd_m2_t10", exerciseId: "sysd_m2_t10_pm_3", position: 3, level: "medium",
    title: "Real-world use",
    scenario: "Where is a Bloom filter classically used in a storage engine?",
    options: ["Skip reading an SSTable that definitely lacks a key (Cassandra/HBase)", "Sort the data on disk", "Encrypt the keys", "Replace the write-ahead log"], correct: "Skip reading an SSTable that definitely lacks a key (Cassandra/HBase)",
    explanation: "LSM-tree stores use Bloom filters to avoid disk reads for keys that are definitely not in an SSTable." }),
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
  console.log(`\nDone — M2 Building Blocks seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
