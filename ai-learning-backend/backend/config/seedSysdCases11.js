/**
 * Seed — System Design module M16: Case Studies XI (more large-scale designs):
 * SSO/Identity Provider, Change Data Capture, Service Mesh, Serverless/FaaS,
 * Distributed SQL DB (NewSQL), Multi-Tenant SaaS, Backup & DR,
 * Developer API Platform. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases11.js   ·   npm: npm run seed:sysd-cases11
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m16";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 16,
  name: "Case Studies XI — Platforms & Infra", slug: "case-studies-11",
  description: "Eight more large-scale designs: single sign-on / identity provider, change data capture, a service mesh, a serverless/FaaS platform, a distributed SQL database, a multi-tenant SaaS platform, backup & disaster recovery, and a developer API platform.",
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
  T("sysd_m16_t1", 1, "Design Single Sign-On (SSO / Identity Provider)", "design-sso-idp",
    ["case-study", "auth", "oauth", "tokens"],
    "Build SSO: a user logs in ONCE with a central identity provider and accesses many apps without re-entering credentials. How does an app trust a user it never authenticated, and what's in the token?",
    "A central IDENTITY PROVIDER (IdP) authenticates the user and issues signed TOKENS (OIDC/OAuth2 — JWT id/access tokens) that apps VERIFY via the IdP's public key — so each app trusts the token's signature, not the user directly. A central session at the IdP enables single sign-on across apps; standards (SAML/OIDC) define the redirect flow. Tokens carry claims, expire, and are refreshable/revocable.",
    [
      { kind: "concept", heading: "Central IdP + delegated trust",
        body: "Instead of every app storing passwords and authenticating users, a central IDENTITY PROVIDER does it once. Apps (relying parties) DELEGATE authentication to the IdP: they redirect the user to the IdP to log in, and the IdP returns a signed token asserting 'this is user X'. The app trusts the IdP's SIGNATURE (verified with the IdP's public key), not the user — so it can authenticate a user it never saw credentials for. This is the foundation of SSO and federated identity." },
      { kind: "concept", heading: "The OIDC/OAuth flow",
        body: "Standards define the dance: OAuth2 (authorization) + OIDC (authentication layer) — the Authorization Code flow: app redirects to IdP → user authenticates → IdP redirects back with a one-time CODE → app exchanges the code (server-to-server) for TOKENS. (SAML is the older XML-based equivalent.) The app never sees the password. PKCE protects public clients. The redirect-based flow is what enables cross-domain SSO." },
      { kind: "concept", heading: "Tokens: id, access, refresh",
        body: "The IdP issues: an ID TOKEN (a JWT with identity CLAIMS — sub, email, name — for authentication), an ACCESS TOKEN (a bearer credential for calling APIs, scoped), and a REFRESH TOKEN (to get new access tokens without re-login). JWTs are signed (verify with the IdP's public JWKS key) and SHORT-LIVED (limit blast radius if stolen). Access tokens are sent on each API call; APIs validate the signature + expiry + scope — stateless verification, no IdP round-trip per request." },
      { kind: "concept", heading: "Sessions, revocation & follow-ups",
        body: "SSO works because the IdP holds a central SESSION: once logged in there, other apps' redirects find an active session and skip re-login (and single LOGOUT propagates). Trade-off: stateless JWTs are hard to REVOKE before expiry → keep them short-lived + a refresh/revocation list, or use opaque tokens with introspection. Follow-ups: 'token theft/replay (use HTTPS, short TTL, audience binding)', 'MFA (the OTP design)', 'social login (federation)', 'scopes/RBAC'. Signal: central IdP + delegated trust via signed tokens (verify signature, not the user) + OIDC/OAuth redirect+code flow + id/access/refresh tokens (short-lived, stateless verify) + central session for SSO + revocation strategy.",
      },
    ],
    "SSO tests delegated authentication: a central IdP authenticates once and issues signed OIDC/OAuth tokens that apps verify by signature (trusting the IdP, not the user), via the redirect+code flow, with short-lived id/access tokens (stateless verify) + refresh tokens and a central session enabling cross-app SSO. JWT revocation is the key trade-off.",
    ["Each app storing passwords / authenticating directly instead of delegating to the IdP via signed tokens.",
     "Long-lived JWTs with no revocation strategy (can't invalidate a stolen token before expiry).",
     "Verifying tokens by calling the IdP per request instead of validating the signature statelessly."],
    0.6, { type: "SSO flow", description: "App redirects user → IdP authenticates (central session) → returns code → app exchanges code for signed tokens (id/access/refresh). App/API verify the JWT signature (IdP public key) + expiry + scope — no per-request IdP call. SSO across apps via the IdP session.", alt: "SSO: central IdP issuing signed tokens that apps verify, with a shared session for single sign-on." }),

  T("sysd_m16_t2", 2, "Design a Change Data Capture (CDC) Pipeline", "design-cdc-pipeline",
    ["case-study", "cdc", "log", "consistency"],
    "Build a pipeline that streams every change in a database to downstream consumers (search index, cache, data warehouse, other services) — reliably and in order, without dual-write bugs. How do you capture changes without missing any?",
    "Read the database's REPLICATION/WAL LOG (the ordered, durable record of every committed change) rather than polling or dual-writing. A CDC connector (Debezium-style) tails the log, publishes change events to a stream (Kafka) in commit order, and consumers apply them. This avoids the DUAL-WRITE problem (write to DB and Kafka separately → inconsistency) and gives an exact, ordered change stream.",
    [
      { kind: "concept", heading: "The dual-write problem it solves",
        body: "You often need a DB change reflected elsewhere (update the search index, invalidate a cache, notify a service). The naive 'write to the DB AND publish an event' (DUAL WRITE) is broken: the two can't be atomic without distributed transactions, so a crash between them leaves them INCONSISTENT (DB updated, event lost, or vice versa). CDC fixes this by deriving events FROM the database's own committed changes — single source of truth, no dual write." },
      { kind: "concept", heading: "Read the log, don't poll",
        body: "Databases keep a WRITE-AHEAD / REPLICATION LOG (MySQL binlog, Postgres WAL) — an ordered, durable record of every committed change, used for replication/recovery. CDC TAILS this log: a connector reads it and emits a change event per insert/update/delete, IN COMMIT ORDER. This is far better than polling a 'updated_at' column (misses deletes, adds load, can miss fast changes) — the log captures EVERY change exactly, in order, with low overhead." },
      { kind: "concept", heading: "Publish to a stream",
        body: "Change events are published to a partitioned log (Kafka — the MQ design), typically partitioned by primary key so all changes to one row stay ORDERED. Consumers (search indexer, cache invalidator, warehouse loader, dependent microservices) subscribe and apply changes at their own pace (offsets), can replay, and stay decoupled. The connector tracks its log POSITION durably so it resumes without gaps after a restart." },
      { kind: "concept", heading: "Semantics & follow-ups",
        body: "Delivery is AT-LEAST-ONCE (a restart may re-emit the last events) → consumers must be IDEMPOTENT. Ordering is per-key (per-partition). CDC underpins the Outbox pattern (write the event to an outbox table in the same DB transaction; CDC ships it — atomic event publishing), database replication, cache invalidation, and warehouse/lake ingestion (the data-warehouse design). Follow-ups: 'schema changes', 'initial snapshot + ongoing stream', 'exactly-once into sinks'. Signal: tail the DB replication/WAL log (not poll/dual-write) → ordered change events to Kafka (partition by key) → idempotent consumers; solves dual-write, powers index/cache/warehouse sync.",
      },
    ],
    "CDC tests deriving an ordered change stream from the DB's replication/WAL log (not polling or dual-writing — which causes inconsistency), publishing per-key-ordered events to Kafka for idempotent consumers (search index, cache, warehouse, services). It solves the dual-write problem and underpins the Outbox pattern.",
    ["Dual-writing to the DB and event stream separately (inconsistency on crash) instead of CDC from the log.",
     "Polling an updated_at column (misses deletes/fast changes) instead of tailing the WAL/binlog.",
     "Ignoring at-least-once semantics — consumers must be idempotent; ordering is per-key."],
    0.6, { type: "CDC pipeline", description: "DB commits → WAL/binlog (ordered, durable). CDC connector tails the log → emits change events (insert/update/delete) in commit order → Kafka (partition by key) → idempotent consumers (search/cache/warehouse). Connector tracks log position (resume, no gaps).", alt: "CDC: tail the DB log and stream ordered change events to downstream consumers." }),

  T("sysd_m16_t3", 3, "Design a Service Mesh", "design-service-mesh",
    ["case-study", "sidecar", "mtls", "observability"],
    "Microservices all need retries, timeouts, mTLS, load balancing, and tracing for their service-to-service calls. Re-implementing this in every service (and every language) is painful. How do you provide it uniformly without touching app code?",
    "Deploy a SIDECAR PROXY (e.g. Envoy) alongside each service instance; ALL service-to-service traffic flows through these proxies, which transparently handle mTLS, retries/timeouts, load balancing, circuit breaking, and telemetry — no app code change, any language. A central CONTROL PLANE configures the proxies (the data plane). It moves cross-cutting networking OUT of services into the infrastructure.",
    [
      { kind: "concept", heading: "The problem: per-service networking logic",
        body: "In microservices, every service-to-service call needs the same concerns: secure transport (mTLS), retries, timeouts, load balancing, circuit breaking, and tracing. Building this into every service means duplicated, inconsistent logic across teams and LANGUAGES (a library per language, all kept in sync). A service mesh extracts this 'east-west' (service-to-service) networking out of the apps entirely." },
      { kind: "concept", heading: "Sidecar proxy (data plane)",
        body: "Deploy a SIDECAR PROXY (Envoy) next to each service instance (same pod). The service talks to localhost; the sidecar intercepts ALL inbound/outbound traffic and handles the cross-cutting concerns transparently. Service A's sidecar talks to Service B's sidecar. Because it's a separate process, it's LANGUAGE-AGNOSTIC (no library in the app) and requires NO app code changes. The fleet of sidecars is the DATA PLANE (it moves the traffic)." },
      { kind: "concept", heading: "Control plane",
        body: "A central CONTROL PLANE (e.g. Istio's istiod) configures all the sidecars: it distributes service-discovery info, routing rules (canary/traffic-splitting), security policies (mTLS certs, who-can-call-whom), and retry/timeout config — and collects telemetry. Operators declare policy centrally; the control plane pushes it to the data-plane proxies. This separation (control configures, data plane enforces) mirrors the SDN model." },
      { kind: "concept", heading: "What you get & follow-ups",
        body: "Uniformly, with zero app changes: mutual TLS (encrypt + authenticate all internal traffic — zero-trust), smart load balancing, retries/timeouts/circuit breaking (the resilience patterns), fine-grained traffic routing (canary, mirroring), and automatic metrics/tracing (the observability pillars). Trade-offs: added LATENCY (an extra proxy hop each way) and operational complexity. Follow-ups: 'mesh vs API gateway (east-west vs north-south)', 'sidecar-less/eBPF meshes', 'mesh overhead'. Signal: sidecar proxies (data plane, language-agnostic, no app change) handling mTLS/retries/LB/telemetry + central control plane configuring them; moves cross-cutting networking into infra.",
      },
    ],
    "A service mesh tests offloading service-to-service networking to sidecar proxies (data plane — mTLS, retries, timeouts, LB, tracing, language-agnostic, no app code change) configured by a central control plane. It extracts cross-cutting east-west concerns into infrastructure; the trade-off is the extra proxy-hop latency. Mesh = east-west vs gateway = north-south.",
    ["Re-implementing retries/mTLS/tracing in every service/language instead of sidecar proxies.",
     "Conflating the data plane (sidecars move traffic) with the control plane (configures them).",
     "Ignoring the latency/complexity overhead of the extra proxy hops."],
    0.6, { type: "Service mesh", description: "Each service instance has a sidecar proxy (Envoy). All service↔service traffic flows proxy↔proxy: mTLS, retries, timeouts, LB, tracing — no app code, any language (data plane). Central control plane pushes config/policy/certs and collects telemetry.", alt: "Service mesh: sidecar proxies handling service-to-service networking, configured by a control plane." }),

  T("sysd_m16_t4", 4, "Design a Serverless / FaaS Platform", "design-serverless-faas",
    ["case-study", "faas", "autoscaling", "cold-start"],
    "Build AWS Lambda: users upload functions that run on demand in response to events, scaling from zero to thousands automatically, billed per execution. How do you run untrusted code on demand, scale instantly, and what's the infamous latency problem?",
    "An event SOURCE triggers an INVOKER that runs the function in an ISOLATED, ephemeral sandbox (microVM/container — Firecracker), scaling instances with concurrent requests (scale to ZERO when idle). The infamous COLD START (spinning up a fresh sandbox + runtime + code) adds latency on the first/scaled invocation — mitigated by warm pools / pre-provisioned concurrency. Stateless functions; pay-per-invocation.",
    [
      { kind: "concept", heading: "Event-driven, on-demand execution",
        body: "FaaS runs user FUNCTIONS in response to EVENTS (HTTP request, queue message, file upload, schedule). There's no always-on server; an event arrives, the platform finds/creates an execution environment, runs the function, returns the result, and can tear it down. Users write only the function (no server management) and pay PER INVOCATION (and duration/memory) — nothing when idle. Functions are STATELESS (any persistent state goes to external stores) so instances are interchangeable." },
      { kind: "concept", heading: "Isolation for untrusted multi-tenant code",
        body: "The platform runs MANY tenants' untrusted code on shared infrastructure, so each invocation must be strongly ISOLATED — lightweight microVMs (Firecracker) or containers with no access to other tenants, with CPU/memory/time limits (the code-judge sandbox concern at platform scale). Strong isolation + fast startup is the core engineering challenge (microVMs give VM-grade isolation with ~ms boot)." },
      { kind: "concept", heading: "Autoscaling (including to zero)",
        body: "Concurrency drives scaling: each concurrent request needs its own instance, so the platform spins up MORE sandboxes as load rises (potentially thousands in seconds) and tears them DOWN to ZERO when idle (no idle cost — the key economic win). A scheduler places executions on a fleet of workers, reusing warm instances when possible. This elastic, request-driven, scale-to-zero model is what defines serverless." },
      { kind: "concept", heading: "The cold-start problem & follow-ups",
        body: "COLD START: when no warm instance exists (first call, or scaling up), the platform must create a sandbox, start the language RUNTIME, load the function code, and init it — adding noticeable latency to that invocation. WARM instances (reused for subsequent calls) are fast. Mitigations: keep warm pools, pre-provisioned/reserved concurrency, lighter runtimes, snapshotting (Firecracker snapshots). Follow-ups: 'state (functions are stateless → external store)', 'execution time limits', 'cost model', 'orchestrating functions (step functions)'. Signal: event → invoker → isolated ephemeral sandbox (microVM, untrusted) + request-driven autoscaling incl. scale-to-zero + cold-start latency mitigated by warm pools/pre-provisioning; stateless, pay-per-invocation.",
      },
    ],
    "A FaaS platform tests on-demand execution: events trigger functions run in isolated ephemeral microVM sandboxes (untrusted multi-tenant code), request-driven autoscaling including scale-to-zero (the cost win), and the infamous cold-start latency on fresh instances (mitigated by warm pools / pre-provisioned concurrency). Functions are stateless, billed per invocation.",
    ["Ignoring isolation for untrusted multi-tenant code (microVMs/containers + limits).",
     "Not addressing cold starts (the defining latency problem) or scale-to-zero.",
     "Assuming functions hold state instead of being stateless with external storage."],
    0.6, { type: "FaaS execution", description: "Event (HTTP/queue/schedule) → invoker → run function in isolated ephemeral sandbox (microVM, limits). Warm instance reused (fast) or cold start (create sandbox+runtime+code = latency). Autoscale per concurrency, down to zero. Stateless, pay-per-invocation.", alt: "Serverless FaaS: events invoking isolated sandboxes with autoscaling and the cold-start path." }),

  T("sysd_m16_t5", 5, "Design a Distributed SQL Database (NewSQL)", "design-distributed-sql-db",
    ["case-study", "newsql", "consensus", "distributed-transactions"],
    "Build a Spanner/CockroachDB-style database: horizontal scalability of NoSQL PLUS SQL with ACID transactions across shards. NoSQL gave up transactions to scale; how do you get both, and what's the hard part?",
    "SHARD data into ranges across nodes; replicate each shard via CONSENSUS (Raft/Paxos) for strong consistency + fault tolerance. Distributed ACID transactions span shards using a transaction coordinator with 2PC over the consensus groups, ordered by carefully managed timestamps (Spanner's TrueTime / hybrid logical clocks). It delivers scale + SQL + ACID; the hard part is consistent ordering of distributed transactions.",
    [
      { kind: "concept", heading: "The goal: NoSQL scale + SQL/ACID",
        body: "Traditional SQL DBs are hard to scale horizontally; NoSQL scaled by DROPPING cross-shard transactions and strong consistency (eventual consistency, no joins). NewSQL (Spanner, CockroachDB, YugabyteDB) aims for BOTH: horizontal scalability AND SQL with ACID transactions and strong consistency. Achieving this across machines is the whole challenge — you can't just shard a single-node SQL DB and keep ACID for free." },
      { kind: "concept", heading: "Sharding + consensus replication",
        body: "Data is split into RANGES/shards by key, distributed across nodes (auto-rebalanced as data grows — like the distributed KV/Dynamo design but range-partitioned for ordered scans). Each shard is REPLICATED across nodes via a CONSENSUS protocol (Raft/Paxos): writes go to the shard's leader and are committed once a quorum of replicas agrees — giving strong consistency AND fault tolerance (survive node loss, no data loss). This per-shard consensus group is the building block." },
      { kind: "concept", heading: "Distributed ACID transactions",
        body: "A transaction touching keys in MULTIPLE shards must be atomic and isolated across them. Use a transaction coordinator running TWO-PHASE COMMIT across the involved shards' consensus groups (2PC for atomicity, layered on Raft for durability). ISOLATION (serializable) requires a consistent ORDERING of transactions globally — the hard part: Spanner uses TrueTime (GPS/atomic-clock-bounded timestamps) to order transactions across datacenters; CockroachDB uses hybrid logical clocks. Getting global ordering right without a single bottleneck is the core difficulty." },
      { kind: "concept", heading: "Trade-offs & follow-ups",
        body: "Strong consistency + distributed transactions cost LATENCY (consensus round-trips, cross-shard coordination, clock-uncertainty waits) — there's no free lunch (CAP/PACELC). Reads can use follower/stale reads for speed when allowed. Follow-ups: 'global vs regional tables (data residency)', 'why not just MySQL sharding (loses cross-shard ACID/joins)', 'clock skew handling', 'online schema changes'. Signal: range-sharded + per-shard consensus (Raft) replication for strong consistency + distributed ACID via 2PC over consensus groups + globally-ordered transactions (TrueTime/HLC); scale + SQL + ACID, traded against latency.",
      },
    ],
    "A distributed SQL DB tests combining NoSQL-style horizontal scale with SQL + ACID: range-sharding, per-shard consensus (Raft/Paxos) replication for strong consistency, and distributed transactions via 2PC over consensus groups with globally-ordered timestamps (TrueTime/HLC). The hard part is consistent global transaction ordering; the cost is latency.",
    ["Assuming you can shard a single-node SQL DB and keep cross-shard ACID/joins for free.",
     "Ignoring how distributed transactions stay atomic + ordered (2PC over consensus + clocks).",
     "Not acknowledging the latency cost of strong consistency / consensus round-trips."],
    0.7, { type: "NewSQL architecture", description: "Data range-sharded across nodes; each shard replicated by consensus (Raft) — write to leader, quorum-commit (strong consistency + fault tolerance). Cross-shard ACID txns via 2PC over consensus groups, globally ordered (TrueTime/HLC).", alt: "Distributed SQL: range shards replicated by consensus, with 2PC distributed transactions." }),

  T("sysd_m16_t6", 6, "Design a Multi-Tenant SaaS Platform", "design-multi-tenant-saas",
    ["case-study", "isolation", "tenancy", "noisy-neighbor"],
    "Build a SaaS used by thousands of customer organizations (tenants) on shared infrastructure: keep each tenant's data isolated and secure, prevent one heavy tenant from degrading others, and stay cost-efficient. What are the data-isolation models, and how do you stop noisy neighbors?",
    "Choose a tenant DATA-ISOLATION model along a spectrum: shared DB + tenant_id column (cheapest, weakest isolation), schema-per-tenant, or database-per-tenant (strongest isolation, costliest). EVERY query must filter by tenant (enforced centrally, not per-developer) to prevent cross-tenant leaks. Combat NOISY NEIGHBORS with per-tenant quotas/rate-limits + resource isolation. Tenant context flows through the whole request.",
    [
      { kind: "concept", heading: "The tenancy spectrum",
        body: "Multi-tenancy = many customer orgs (TENANTS) share one application/infrastructure. The central question is DATA ISOLATION, on a spectrum: (1) SHARED everything — one DB, a tenant_id column on every row (cheapest, highest density, but isolation depends entirely on query correctness); (2) SCHEMA-per-tenant — shared DB, separate schema each (more isolation); (3) DATABASE-per-tenant — separate DB per tenant (strongest isolation/security/compliance, easy per-tenant backup, but costly and hard to scale to thousands). Pick by isolation needs vs cost; large platforms often mix (pooled for small tenants, isolated for enterprise)." },
      { kind: "concept", heading: "Tenant context + leak prevention",
        body: "Every request carries a TENANT CONTEXT (from the auth token/subdomain). The cardinal rule: EVERY data access MUST be scoped to the tenant — a single missing tenant_id filter LEAKS another customer's data (a catastrophic breach). Enforce this CENTRALLY (a data-access layer/ORM filter, row-level security in the DB) rather than trusting each developer to remember — defense in depth. This is the multi-tenant equivalent of the board-isolation rule." },
      { kind: "concept", heading: "Noisy neighbors",
        body: "On shared resources, one tenant's heavy usage (a huge report, a traffic spike, an expensive query) can degrade EVERYONE — the NOISY NEIGHBOR problem. Mitigate with PER-TENANT QUOTAS and RATE LIMITS (cap requests/compute/storage per tenant), resource isolation (separate pools/queues, or dedicated infra for big tenants), and fair scheduling. Monitor per-tenant usage to detect and throttle abusers." },
      { kind: "concept", heading: "Operations & follow-ups",
        body: "Cross-cutting: per-tenant CONFIGURATION/customization (feature flags, branding — the config/feature-flag designs), tenant ONBOARDING/provisioning, per-tenant BACKUP/restore and data export (and deletion for GDPR), and tenant-aware observability (metrics/logs tagged by tenant). Follow-ups: 'tenant migration between tiers', 'per-tenant encryption keys', 'scaling to huge tenants (shard them out)'. Signal: data-isolation model choice (shared-column → schema → DB-per-tenant, isolation vs cost) + centrally-enforced tenant scoping (no leaks) + noisy-neighbor controls (per-tenant quotas/rate-limits/isolation) + per-tenant config/backup.",
      },
    ],
    "Multi-tenant SaaS tests the isolation-vs-cost spectrum (shared tenant_id column → schema-per-tenant → DB-per-tenant), CENTRALLY-enforced tenant scoping on every query (a missing filter leaks data — catastrophic), and noisy-neighbor controls (per-tenant quotas/rate-limits/resource isolation). Per-tenant config, backup, and tenant-aware observability round it out.",
    ["Relying on developers to remember the tenant filter instead of central enforcement (data-leak risk).",
     "Ignoring the noisy-neighbor problem (no per-tenant quotas/rate-limits/isolation).",
     "Treating isolation as one-size-fits-all instead of choosing along the shared→isolated spectrum."],
    0.6, { type: "Tenancy models", description: "Isolation spectrum: shared DB + tenant_id (cheap, weak) → schema-per-tenant → DB-per-tenant (strong, costly). Tenant context on every request; ALL queries scoped centrally (no leaks). Per-tenant quotas/rate-limits vs noisy neighbors. Per-tenant config/backup.", alt: "Multi-tenant SaaS: data-isolation spectrum with enforced tenant scoping and noisy-neighbor controls." }),

  T("sysd_m16_t7", 7, "Design a Backup & Disaster Recovery System", "design-backup-dr",
    ["case-study", "backup", "rpo-rto", "recovery"],
    "Design backup & DR for critical data: survive data loss, corruption, or a whole-region outage, and be able to RESTORE within defined limits. Two numbers drive every decision — what are they, and why is an untested backup worthless?",
    "Two targets drive the design: RPO (Recovery Point Objective — max acceptable DATA LOSS, i.e. backup frequency) and RTO (Recovery Time Objective — max acceptable DOWNTIME to restore). Use layered backups (full + incremental), store copies OFFSITE/cross-region and immutable (ransomware/region loss), and — critically — REGULARLY TEST RESTORES (an untested backup may not actually restore). DR strategies trade cost vs RTO/RPO.",
    [
      { kind: "concept", heading: "RPO and RTO drive everything",
        body: "Two objectives define the requirements: RPO (Recovery POINT Objective) = how much recent DATA you can afford to lose, which dictates how OFTEN you back up / replicate (RPO of 5 min ⇒ back up at least every 5 min, or continuous replication). RTO (Recovery TIME Objective) = how long you can be DOWN while restoring, which dictates the recovery approach (a cold restore takes hours; a hot standby fails over in seconds). Every design decision (backup frequency, replication, standby type) flows from these two numbers — establish them first." },
      { kind: "concept", heading: "Backup strategy",
        body: "Layer backups: FULL backups periodically + INCREMENTAL/differential backups in between (only changes — cheaper/faster, smaller RPO). Crucially, store copies OFFSITE and CROSS-REGION (a backup in the same datacenter dies with it) and make them IMMUTABLE/versioned (so ransomware or a bad actor can't delete/encrypt them — and you can restore to a point BEFORE corruption). The 3-2-1 rule: 3 copies, 2 media, 1 offsite. Retain multiple historical points (corruption may be discovered late)." },
      { kind: "concept", heading: "DR strategies (cost vs RTO)",
        body: "Disaster recovery for whole-region/site loss spans a cost↔RTO spectrum: BACKUP & RESTORE (cheapest, slow — restore from backups, high RTO), PILOT LIGHT (core minimal infra always running, scale up on failover), WARM STANDBY (a scaled-down running copy, faster failover), and HOT STANDBY / MULTI-SITE ACTIVE-ACTIVE (full running replica or active in multiple regions — near-zero RTO, most expensive — the multi-region design). Choose by how much downtime/data loss the business tolerates vs budget." },
      { kind: "concept", heading: "Test restores (the critical rule) & follow-ups",
        body: "The most-violated rule: an UNTESTED backup is not a backup. Backups silently fail, get corrupted, or restore incompletely — you only find out during a real disaster (the worst time). REGULARLY perform RESTORE DRILLS / failover tests to verify backups actually work and you meet your RTO. Follow-ups: 'database PITR (point-in-time recovery via logs)', 'backup of stateful services', 'failback after recovery', 'runbooks/automation', 'consistency of backups across services'. Signal: RPO/RTO targets drive design + full+incremental backups stored offsite/cross-region & immutable + DR strategy chosen by cost-vs-RTO (backup-restore → pilot-light → warm → hot/active-active) + REGULARLY TESTED restores.",
      },
    ],
    "Backup & DR tests deriving the design from RPO (tolerable data loss → backup frequency) and RTO (tolerable downtime → recovery approach): full+incremental backups stored offsite/cross-region and immutable (ransomware/region loss), a DR strategy on the cost-vs-RTO spectrum (backup-restore → pilot-light → warm → hot standby), and — the critical rule — regularly TESTED restores. An untested backup is worthless.",
    ["Not defining RPO/RTO first — they drive backup frequency and the recovery approach.",
     "Backups only in the same region/mutable (die with the datacenter or get ransomware-encrypted).",
     "Never testing restores — assuming backups work until a real disaster proves they don't."],
    0.5, { type: "Backup & DR", description: "RPO (data-loss limit → backup frequency) + RTO (downtime limit → recovery approach) drive design. Full + incremental backups, offsite/cross-region, immutable/versioned (3-2-1). DR spectrum: backup-restore → pilot-light → warm → hot standby (cost vs RTO). REGULARLY test restores.", alt: "Backup & DR driven by RPO/RTO, with offsite immutable backups and tested restores." }),

  T("sysd_m16_t8", 8, "Design a Developer API Platform", "design-developer-api-platform",
    ["case-study", "api-keys", "quotas", "metering"],
    "Build a platform that exposes your API to third-party developers (Stripe/Twilio-style): issue API keys, authenticate and rate-limit each developer, meter usage for billing, and version the API. What identifies a caller, and how do you fairly limit and bill them?",
    "Issue API KEYS / OAuth credentials per developer (stored hashed) to AUTHENTICATE each request and map it to an account + plan. RATE-LIMIT and QUOTA per key (token-bucket per plan tier) to ensure fair use and protect the backend. METER every call (async usage events → aggregation) for usage-based billing and analytics. Plus API VERSIONING, docs, and a developer portal for self-service.",
    [
      { kind: "concept", heading: "Authentication via API keys",
        body: "Each developer/app gets credentials — an API KEY (or OAuth client credentials) — sent on every request (header). The platform validates it (stored HASHED like a password), identifies the owning ACCOUNT and its PLAN, and checks permissions/scopes. Keys are revocable and rotatable; support multiple keys per account (and separate test vs live keys). This is who-is-calling, the basis for everything else (limiting, billing)." },
      { kind: "concept", heading: "Rate limiting & quotas",
        body: "Protect the backend and ensure FAIR use: RATE LIMIT per key (requests per second/minute — token-bucket, the rate-limiter design) and enforce QUOTAS (monthly call caps) per PLAN TIER (free vs paid get different limits). Exceeding returns 429 with Retry-After. Limits are per-key so one developer can't starve others (the noisy-neighbor problem). This must be fast and distributed (a shared counter store like Redis at the edge/gateway)." },
      { kind: "concept", heading: "Usage metering for billing",
        body: "For usage-based pricing (pay per API call / per unit), METER every request: emit a usage EVENT per call (async, off the hot path) into an aggregation pipeline (the ad-click-aggregator pattern) that rolls up per-account usage by period. This feeds BILLING (the subscription-billing design) and developer-facing usage dashboards. Metering must be accurate (it's money) but is eventually consistent — reconcile/dedupe events (idempotency)." },
      { kind: "concept", heading: "Versioning, portal & follow-ups",
        body: "APIs evolve, so VERSION them (URL /v1/ or headers) and never break existing integrations (backward compatibility, deprecation windows). Provide a self-service DEVELOPER PORTAL (sign up, generate keys, read docs, view usage, see billing), an API gateway front (auth/rate-limit/routing — the gateway design), and webhooks for events (the webhook design). Follow-ups: 'key security/leak detection', 'SDKs', 'sandbox/test mode', 'idempotency keys for clients'. Signal: per-developer API keys (hashed, authenticate→account/plan) + per-key rate-limit/quotas by tier (fair use) + async usage metering → billing + API versioning + self-service portal/gateway.",
      },
    ],
    "A developer API platform tests the third-party-API lifecycle: per-developer API keys (hashed, mapping a request to an account/plan), per-key rate-limits & quotas by tier (fair use, backend protection), async usage metering feeding usage-based billing, and API versioning + a self-service portal. It composes the gateway, rate-limiter, aggregator, and billing designs.",
    ["No per-key rate-limits/quotas (one developer can overwhelm the backend or others).",
     "Metering on the hot path / inaccurately instead of async usage events feeding billing.",
     "Breaking existing integrations by not versioning the API (no backward compatibility)."],
    0.5, { type: "API platform", description: "Request + API key → gateway: authenticate (hashed key → account/plan) → rate-limit + quota per key/tier → route to API. Each call emits an async usage event → aggregation → billing + dashboards. Versioned API; self-service developer portal.", alt: "Developer API platform: API-key auth, per-key rate-limits/quotas, usage metering, and billing." }),
];

const EXERCISES = [
  // SSO
  pm({ topicId: "sysd_m16_t1", exerciseId: "sysd_m16_t1_pm_1", position: 1, level: "hard", title: "Delegated trust",
    scenario: "How does an app authenticate a user it never saw credentials for?",
    options: ["It verifies a token signed by the trusted Identity Provider", "It asks the user to re-enter the password", "It stores all passwords too", "It trusts the client blindly"], correct: "It verifies a token signed by the trusted Identity Provider",
    explanation: "Apps delegate auth to the IdP and trust the token's signature (verified via the IdP's public key)." }),
  pm({ topicId: "sysd_m16_t1", exerciseId: "sysd_m16_t1_pm_2", position: 2, level: "medium", title: "Token types",
    scenario: "Which token lets a client get new access tokens without re-login?",
    options: ["A refresh token", "The id token", "The authorization code", "The CSRF token"], correct: "A refresh token",
    explanation: "Refresh tokens mint new short-lived access tokens; id tokens carry identity claims, access tokens call APIs." }),
  pm({ topicId: "sysd_m16_t1", exerciseId: "sysd_m16_t1_pm_3", position: 3, level: "hard", title: "JWT trade-off",
    scenario: "The main downside of stateless JWT access tokens is…",
    options: ["Hard to revoke before expiry (mitigate with short TTL + refresh/revocation)", "They can't carry claims", "They require a DB lookup per request", "They aren't signed"], correct: "Hard to revoke before expiry (mitigate with short TTL + refresh/revocation)",
    explanation: "Stateless tokens are valid until expiry; keep them short-lived and use refresh/revocation lists." }),
  // CDC
  pm({ topicId: "sysd_m16_t2", exerciseId: "sysd_m16_t2_pm_1", position: 1, level: "hard", title: "Capture changes",
    scenario: "CDC captures every DB change by…",
    options: ["Tailing the replication/WAL (commit) log", "Polling an updated_at column", "Dual-writing to the DB and Kafka", "Diffing snapshots nightly"], correct: "Tailing the replication/WAL (commit) log",
    explanation: "The WAL/binlog records every committed change in order; tailing it captures all changes (incl. deletes) with low overhead." }),
  pm({ topicId: "sysd_m16_t2", exerciseId: "sysd_m16_t2_pm_2", position: 2, level: "hard", title: "Why not dual-write",
    scenario: "Writing to the DB and publishing an event separately (dual write) is broken because…",
    options: ["They can't be atomic — a crash between leaves them inconsistent", "It's too slow", "Kafka can't store events", "Events arrive out of order"], correct: "They can't be atomic — a crash between leaves them inconsistent",
    explanation: "CDC derives events from committed DB changes (single source of truth), avoiding the dual-write inconsistency." }),
  pm({ topicId: "sysd_m16_t2", exerciseId: "sysd_m16_t2_pm_3", position: 3, level: "medium", title: "Consumer rule",
    scenario: "CDC delivery is at-least-once, so consumers must be…",
    options: ["Idempotent (and rely on per-key ordering)", "Exactly-once for free", "Stateless and orderless", "Single-threaded"], correct: "Idempotent (and rely on per-key ordering)",
    explanation: "A restart may re-emit events; idempotent consumers handle duplicates. Ordering holds per key/partition." }),
  // Service mesh
  pm({ topicId: "sysd_m16_t3", exerciseId: "sysd_m16_t3_pm_1", position: 1, level: "medium", title: "The mechanism",
    scenario: "A service mesh provides mTLS/retries/tracing without app changes via…",
    options: ["A sidecar proxy next to each service (all traffic flows through it)", "A shared library in every service", "Code generation per language", "The database"], correct: "A sidecar proxy next to each service (all traffic flows through it)",
    explanation: "Sidecars intercept all service-to-service traffic transparently — language-agnostic, no app code change." }),
  pm({ topicId: "sysd_m16_t3", exerciseId: "sysd_m16_t3_pm_2", position: 2, level: "hard", title: "Two planes",
    scenario: "In a service mesh, the control plane…",
    options: ["Configures the sidecars (data plane) with policy/routing/certs", "Moves the actual traffic", "Runs the business logic", "Stores the data"], correct: "Configures the sidecars (data plane) with policy/routing/certs",
    explanation: "Control plane configures; data plane (sidecars) enforces and moves traffic." }),
  pm({ topicId: "sysd_m16_t3", exerciseId: "sysd_m16_t3_pm_3", position: 3, level: "medium", title: "Trade-off",
    scenario: "A cost of the service mesh is…",
    options: ["Added latency from the extra proxy hops + operational complexity", "It only works in one language", "It can't do mTLS", "It removes observability"], correct: "Added latency from the extra proxy hops + operational complexity",
    explanation: "Every call goes through two extra proxies; the mesh adds latency and operational overhead." }),
  // FaaS
  pm({ topicId: "sysd_m16_t4", exerciseId: "sysd_m16_t4_pm_1", position: 1, level: "hard", title: "The latency problem",
    scenario: "The infamous serverless latency issue is…",
    options: ["Cold start — creating a sandbox + runtime + code on a fresh instance", "Slow databases", "DNS lookups", "Garbage collection only"], correct: "Cold start — creating a sandbox + runtime + code on a fresh instance",
    explanation: "First/scaled invocations pay cold-start latency; warm instances are fast. Mitigate with warm pools / provisioned concurrency." }),
  pm({ topicId: "sysd_m16_t4", exerciseId: "sysd_m16_t4_pm_2", position: 2, level: "hard", title: "Untrusted code",
    scenario: "Running many tenants' functions on shared infra requires…",
    options: ["Strong isolation (microVMs/containers + resource limits)", "Running them in one shared process", "Trusting the code", "A single VM for everyone"], correct: "Strong isolation (microVMs/containers + resource limits)",
    explanation: "MicroVMs (Firecracker) give VM-grade isolation with fast boot for untrusted multi-tenant code." }),
  pm({ topicId: "sysd_m16_t4", exerciseId: "sysd_m16_t4_pm_3", position: 3, level: "medium", title: "Scaling",
    scenario: "The defining serverless scaling property is…",
    options: ["Request-driven autoscaling including scale-to-zero (no idle cost)", "Fixed always-on capacity", "Manual scaling only", "Scaling only up, never down"], correct: "Request-driven autoscaling including scale-to-zero (no idle cost)",
    explanation: "Instances scale with concurrency and down to zero when idle — the core economic win of serverless." }),
  // Distributed SQL
  pm({ topicId: "sysd_m16_t5", exerciseId: "sysd_m16_t5_pm_1", position: 1, level: "hard", title: "The goal",
    scenario: "NewSQL (Spanner/CockroachDB) aims to provide…",
    options: ["Horizontal scale AND SQL with ACID transactions + strong consistency", "Eventual consistency only", "No transactions, max speed", "Single-node SQL only"], correct: "Horizontal scale AND SQL with ACID transactions + strong consistency",
    explanation: "NewSQL combines NoSQL-style scaling with SQL/ACID — what NoSQL gave up to scale." }),
  pm({ topicId: "sysd_m16_t5", exerciseId: "sysd_m16_t5_pm_2", position: 2, level: "hard", title: "Consistent shards",
    scenario: "Each shard achieves strong consistency + fault tolerance via…",
    options: ["Consensus replication (Raft/Paxos) — quorum-commit to a leader", "A single replica", "Async replication only", "No replication"], correct: "Consensus replication (Raft/Paxos) — quorum-commit to a leader",
    explanation: "Per-shard Raft/Paxos groups commit on a quorum, surviving node loss with strong consistency." }),
  pm({ topicId: "sysd_m16_t5", exerciseId: "sysd_m16_t5_pm_3", position: 3, level: "hard", title: "The hard part",
    scenario: "The hardest part of distributed ACID transactions is…",
    options: ["Globally ordering transactions (TrueTime / hybrid logical clocks) without a bottleneck", "Storing the data", "Reading data", "Choosing a primary key"], correct: "Globally ordering transactions (TrueTime / hybrid logical clocks) without a bottleneck",
    explanation: "Serializable isolation across shards needs consistent global ordering; Spanner uses TrueTime, CockroachDB uses HLC." }),
  // Multi-tenant SaaS
  pm({ topicId: "sysd_m16_t6", exerciseId: "sysd_m16_t6_pm_1", position: 1, level: "medium", title: "Isolation spectrum",
    scenario: "The strongest (but costliest) tenant data isolation is…",
    options: ["Database-per-tenant", "Shared DB with a tenant_id column", "Schema-per-tenant", "No isolation"], correct: "Database-per-tenant",
    explanation: "DB-per-tenant maximizes isolation/compliance/per-tenant backup but costs the most; shared-column is cheapest/weakest." }),
  pm({ topicId: "sysd_m16_t6", exerciseId: "sysd_m16_t6_pm_2", position: 2, level: "hard", title: "Leak prevention",
    scenario: "To prevent one tenant seeing another's data, tenant scoping must be…",
    options: ["Enforced centrally (data layer / row-level security), not per-developer", "Remembered by each developer per query", "Checked only in the UI", "Optional"], correct: "Enforced centrally (data layer / row-level security), not per-developer",
    explanation: "A single missing tenant filter leaks data; enforce scoping centrally as defense in depth." }),
  pm({ topicId: "sysd_m16_t6", exerciseId: "sysd_m16_t6_pm_3", position: 3, level: "medium", title: "Noisy neighbor",
    scenario: "One tenant's heavy usage degrading others is fixed by…",
    options: ["Per-tenant quotas/rate-limits + resource isolation", "Bigger servers only", "Ignoring it", "Giving everyone unlimited resources"], correct: "Per-tenant quotas/rate-limits + resource isolation",
    explanation: "Per-tenant limits and isolation (pools/dedicated infra) stop a noisy neighbor from starving others." }),
  // Backup & DR
  pm({ topicId: "sysd_m16_t7", exerciseId: "sysd_m16_t7_pm_1", position: 1, level: "hard", title: "Two numbers",
    scenario: "Which two objectives drive backup & DR design?",
    options: ["RPO (tolerable data loss) and RTO (tolerable downtime)", "CPU and memory", "Latency and throughput", "Cost and color"], correct: "RPO (tolerable data loss) and RTO (tolerable downtime)",
    explanation: "RPO sets backup frequency; RTO sets the recovery approach — establish both before designing." }),
  pm({ topicId: "sysd_m16_t7", exerciseId: "sysd_m16_t7_pm_2", position: 2, level: "medium", title: "Where to store",
    scenario: "Backups must be stored…",
    options: ["Offsite/cross-region and immutable/versioned", "In the same datacenter only", "On the same server, mutable", "Nowhere — replication is enough"], correct: "Offsite/cross-region and immutable/versioned",
    explanation: "Same-region backups die with the datacenter; immutable copies resist ransomware and let you restore pre-corruption." }),
  pm({ topicId: "sysd_m16_t7", exerciseId: "sysd_m16_t7_pm_3", position: 3, level: "hard", title: "Critical rule",
    scenario: "Why is an untested backup worthless?",
    options: ["Backups silently corrupt/fail; you must test restores to know they work + meet RTO", "Testing is just bureaucracy", "Backups never fail", "Restores are always instant"], correct: "Backups silently corrupt/fail; you must test restores to know they work + meet RTO",
    explanation: "Regular restore drills are the only proof a backup actually restores — don't discover failures during a real disaster." }),
  // Developer API platform
  pm({ topicId: "sysd_m16_t8", exerciseId: "sysd_m16_t8_pm_1", position: 1, level: "medium", title: "Identify the caller",
    scenario: "A third-party developer's request is authenticated and mapped to an account via…",
    options: ["An API key (stored hashed) or OAuth client credentials", "Their IP address", "A cookie", "No authentication"], correct: "An API key (stored hashed) or OAuth client credentials",
    explanation: "Per-developer API keys (hashed) identify the account + plan, the basis for limiting and billing." }),
  pm({ topicId: "sysd_m16_t8", exerciseId: "sysd_m16_t8_pm_2", position: 2, level: "hard", title: "Fair use",
    scenario: "To protect the backend and ensure fairness, the platform applies…",
    options: ["Per-key rate limits + quotas by plan tier (429 when exceeded)", "One global rate limit for everyone", "No limits", "Limits only on free users"], correct: "Per-key rate limits + quotas by plan tier (429 when exceeded)",
    explanation: "Per-key, per-tier rate limits/quotas stop one developer starving others and protect the backend." }),
  pm({ topicId: "sysd_m16_t8", exerciseId: "sysd_m16_t8_pm_3", position: 3, level: "medium", title: "Billing",
    scenario: "Usage-based billing relies on…",
    options: ["Async usage metering (events → aggregation per account/period)", "Counting on the synchronous hot path", "Estimating from logs monthly by hand", "Not tracking usage"], correct: "Async usage metering (events → aggregation per account/period)",
    explanation: "Emit a usage event per call off the hot path; aggregate per account/period to feed billing and dashboards." }),
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
  console.log(`\nDone — M16 Case Studies XI seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
