/**
 * Seed — System Design module M17: Case Studies XII (more large-scale designs):
 * Service Discovery, Schema Registry, Audit Log/Compliance Trail, GDPR
 * Data-Deletion, Image Processing CDN, Q&A Platform, E-Signature Platform,
 * Status/Uptime Monitoring. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases12.js   ·   npm: npm run seed:sysd-cases12
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m17";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 17,
  name: "Case Studies XII — More Systems", slug: "case-studies-12",
  description: "Eight more large-scale designs: service discovery, a schema registry, an audit-log / compliance trail, GDPR data-deletion, an image-processing CDN, a Q&A platform, an e-signature platform, and uptime monitoring.",
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
  T("sysd_m17_t1", 1, "Design a Service Discovery System", "design-service-discovery",
    ["case-study", "registry", "health-check", "dynamic"],
    "In a microservices fleet, instances come and go (autoscaling, crashes, deploys) with changing IPs. How does service A find a healthy instance of service B without hardcoded addresses? What tracks who's alive?",
    "A service REGISTRY holds the live instances (address+port) of each service; instances REGISTER on startup and are removed when they fail HEALTH CHECKS / heartbeats. Clients DISCOVER instances by querying the registry (client-side) or via a load balancer that does (server-side). The registry must be highly available + consistent. Caching + TTL handle staleness. It decouples callers from instance locations.",
    [
      { kind: "concept", heading: "The problem: dynamic instances",
        body: "In microservices/cloud, service instances are EPHEMERAL — autoscaling adds/removes them, deploys replace them, crashes kill them, and IPs change constantly. Hardcoding addresses or static config breaks immediately. SERVICE DISCOVERY provides a dynamic 'phone book': given a service NAME, return the current set of healthy instance ADDRESSES. This decouples callers from where instances actually run." },
      { kind: "concept", heading: "The registry + registration",
        body: "A central (replicated) SERVICE REGISTRY maps service name → list of live instances (host:port, metadata). Instances REGISTER themselves on startup (self-registration) or an agent/orchestrator registers them. The registry is the source of truth for 'what's running'. It must be HIGHLY AVAILABLE and reasonably consistent (often a consensus-backed store — etcd/Consul/ZooKeeper, the distributed-lock substrate)." },
      { kind: "concept", heading: "Health checks (the critical part)",
        body: "Instances FAIL — so the registry must continuously verify liveness via HEALTH CHECKS: instances send HEARTBEATS (and the registry expires them if heartbeats stop, via a TTL), or the registry/load-balancer actively probes a /health endpoint. UNHEALTHY instances are removed so traffic never routes to dead ones. Getting health detection right (and fast) is what makes discovery trustworthy — a stale registry routes to dead nodes." },
      { kind: "concept", heading: "Discovery modes & follow-ups",
        body: "CLIENT-SIDE discovery: the client queries the registry and load-balances across instances itself (flexible, no extra hop). SERVER-SIDE discovery: clients hit a load balancer / API gateway that consults the registry and forwards (clients stay dumb). Clients CACHE the instance list (with TTL) to avoid hitting the registry per call (and to survive a registry blip). Follow-ups: 'DNS-based discovery', 'discovery vs service mesh (the sidecar does it)', 'registry consistency'. Signal: registry of instances + self-register/deregister + health checks/heartbeats (remove dead) + client-side vs server-side discovery + cached instance lists with TTL.",
      },
    ],
    "Service discovery tests a dynamic registry of live instances (self-registered, health-checked/heartbeated so dead ones are removed) that clients query — client-side (client load-balances) or server-side (a load balancer does) — with cached instance lists. It decouples callers from ephemeral instance locations; a service mesh's sidecar does this automatically.",
    ["Hardcoding instance addresses / static config in a dynamic, autoscaling fleet.",
     "A registry without health checks/heartbeats — routing traffic to dead instances.",
     "Querying the registry on every call instead of caching the instance list with a TTL."],
    0.5, { type: "Service discovery", description: "Instances self-register (name→host:port) in a replicated registry; heartbeats/health-checks expire dead ones. Clients discover: client-side (query registry + LB themselves) or server-side (LB/gateway consults registry). Instance lists cached with TTL.", alt: "Service discovery: a health-checked registry of instances queried client- or server-side." }),

  T("sysd_m17_t2", 2, "Design a Schema Registry", "design-schema-registry",
    ["case-study", "schema-evolution", "compatibility", "events"],
    "In an event-driven system, producers and consumers exchange messages — but producers evolve their message format independently. How do you let schemas change WITHOUT breaking existing consumers? What governs compatible evolution?",
    "A central SCHEMA REGISTRY stores versioned schemas (Avro/Protobuf/JSON-Schema) for each topic/subject; producers register a schema and embed only its ID in each message (compact); consumers fetch the schema by ID to deserialize. The registry ENFORCES COMPATIBILITY rules (backward/forward/full) on new versions, REJECTING breaking changes — so schemas evolve safely without coordinated lockstep deploys.",
    [
      { kind: "concept", heading: "Why a registry",
        body: "In a decoupled event system (Kafka), producers and consumers don't talk directly and deploy on their own schedules. If a producer changes the message format, consumers expecting the old format BREAK. A SCHEMA REGISTRY is the central authority for message SCHEMAS: it stores the agreed structure for each topic/subject, versioned, so both sides share a contract and can evolve it safely without breaking each other." },
      { kind: "concept", heading: "Schema-by-ID (compact messages)",
        body: "Producers REGISTER their schema with the registry and get a SCHEMA ID; each message carries only that small ID (not the full schema) plus the encoded payload (Avro/Protobuf — compact binary). Consumers read the ID, FETCH the schema from the registry (cached locally), and use it to DESERIALIZE. This avoids embedding the verbose schema in every message while guaranteeing the consumer decodes with the exact schema the producer used." },
      { kind: "concept", heading: "Compatibility enforcement (the core)",
        body: "The registry's key job: when a producer tries to register a NEW schema version, it CHECKS it against compatibility rules and REJECTS breaking changes. BACKWARD compatible = new schema can read old data (consumers upgrade first; safe to add optional/defaulted fields, remove fields). FORWARD = old schema can read new data (producers upgrade first). FULL = both. Enforcing the chosen mode means schema evolution can't silently break running consumers — the registry is the gatekeeper." },
      { kind: "concept", heading: "Evolution & follow-ups",
        body: "Safe evolution rules (for backward compat): add fields WITH DEFAULTS, don't remove required fields, don't change types incompatibly, don't rename without aliases. The registry lets producers and consumers deploy INDEPENDENTLY as long as changes stay compatible. Follow-ups: 'which compatibility mode to pick', 'subject naming strategies', 'registry HA/caching', 'migrating incompatible changes (new topic/version)'. Signal: central versioned schema store + schema-ID-in-message (compact, fetch+cache to deserialize) + compatibility enforcement (backward/forward/full, reject breaking changes) enabling independent producer/consumer evolution.",
      },
    ],
    "A schema registry tests safe schema evolution in event systems: a central versioned schema store, messages carrying a compact schema ID (consumers fetch+cache to deserialize), and — the core — compatibility enforcement (backward/forward/full) that rejects breaking changes, letting producers and consumers evolve independently without lockstep deploys.",
    ["Letting producers change message format freely (breaks consumers) — no compatibility enforcement.",
     "Embedding the full schema in every message instead of a compact schema ID + registry lookup.",
     "Not understanding backward (consumer-first) vs forward (producer-first) compatibility for safe changes."],
    0.5, { type: "Schema registry", description: "Producer registers schema → gets ID; message = schema ID + encoded payload. Consumer fetches schema by ID (cached) → deserializes. New version registration checked for compatibility (backward/forward/full) — breaking changes rejected.", alt: "Schema registry: versioned schemas, schema-ID messages, and compatibility-enforced evolution." }),

  T("sysd_m17_t3", 3, "Design an Audit Log / Compliance Trail", "design-audit-log",
    ["case-study", "append-only", "tamper-evidence", "compliance"],
    "Build an audit log recording who did what, when, for compliance (SOX/HIPAA/GDPR): every sensitive action captured, queryable, and — critically — TAMPER-EVIDENT so a malicious admin can't quietly alter history. What guarantees integrity?",
    "An APPEND-ONLY, immutable log of structured events (who, what, when, where, outcome) — never updated or deleted. Make it TAMPER-EVIDENT by HASH-CHAINING entries (each entry includes the hash of the previous → any alteration breaks the chain) and/or write-once (WORM) storage. Store separately from the app DB (so app compromise ≠ log compromise), retain per policy, and index for querying. Integrity + completeness are the point.",
    [
      { kind: "concept", heading: "Append-only, immutable events",
        body: "An audit log records every sensitive ACTION as a structured event: WHO (actor/identity), WHAT (action + affected resource, before/after where relevant), WHEN (timestamp), WHERE (IP/session), and the OUTCOME. The defining property: it's APPEND-ONLY and IMMUTABLE — entries are never updated or deleted (unlike normal app data). This permanence is what makes it trustworthy for compliance and forensic investigation." },
      { kind: "concept", heading: "Tamper-evidence (the core)",
        body: "Compliance demands you can prove the log wasn't ALTERED — even by an insider/admin. Make it TAMPER-EVIDENT: HASH-CHAIN entries (each entry stores a hash of (its content + the previous entry's hash), like a blockchain) so changing or removing any past entry breaks every subsequent hash — detectable. Reinforce with WORM (write-once-read-many) / immutable storage, periodic signed checkpoints, and writing to append-only media. You may not prevent tampering, but you make it DETECTABLE, which is the compliance requirement." },
      { kind: "concept", heading: "Isolation & completeness",
        body: "Store the audit log SEPARATELY from the application database, with restricted/different access (so compromising the app doesn't let an attacker edit the audit trail — separation of duties). COMPLETENESS matters as much as integrity: every auditable action must reliably produce an entry — emit audit events on the critical path or via a guaranteed pipeline (don't lose events). Often events stream to the log asynchronously but durably (at-least-once)." },
      { kind: "concept", heading: "Retention, query & follow-ups",
        body: "Audit logs are write-heavy and grow forever → RETENTION policies (keep N years per regulation, then archive to cheap immutable storage). They must be QUERYABLE ('all actions by user X on resource Y last quarter') → index by actor/resource/time (an inverted index / time-partitioned store, like the log-aggregation design but immutable + integrity-protected). Follow-ups: 'PII in logs (redaction)', 'access to the audit log is itself audited', 'real-time alerting on suspicious actions'. Signal: append-only immutable structured events + tamper-evidence (hash-chaining / WORM / signing) + storage isolation + completeness + retention + queryable indexing.",
      },
    ],
    "An audit log tests an append-only, immutable, tamper-evident record (hash-chaining and/or WORM storage so any alteration is detectable) of who-did-what-when, stored isolated from the app DB, complete (no lost events), retained per policy, and queryable. Detectability of tampering — not just storage — is the compliance core.",
    ["A mutable log (or stored in the app DB) an admin could quietly alter — no tamper-evidence/isolation.",
     "Missing actions (incomplete trail) — auditable events must reliably be recorded.",
     "No retention policy or queryability for compliance investigations."],
    0.5, { type: "Audit trail", description: "Every sensitive action → append-only immutable event (who/what/when/where/outcome). Tamper-evident via hash-chaining (each entry hashes the previous) + WORM storage + signed checkpoints. Stored isolated from app DB; retained per policy; indexed for query.", alt: "Audit log: append-only hash-chained immutable events, isolated and queryable." }),

  T("sysd_m17_t4", 4, "Design GDPR Data Deletion (Right to be Forgotten)", "design-gdpr-deletion",
    ["case-study", "data-governance", "distributed-delete", "compliance"],
    "A user invokes their right to be forgotten — you must delete ALL their personal data across every system: primary DB, caches, search indexes, data warehouse, logs, backups, and third parties. Why is 'DELETE FROM users' nowhere near enough?",
    "Personal data is SCATTERED across many stores (DBs, caches, search, warehouse/lake, logs, message queues, third-party processors, backups) — so deletion must be a COORDINATED, tracked workflow that fans a delete request to every system holding the user's data, verifies completion, and produces an audit record. Backups (can't surgically edit) and analytics need special handling (crypto-shredding, expiry, or anonymization). It's a distributed data-governance problem.",
    [
      { kind: "concept", heading: "Why one DELETE isn't enough",
        body: "A user's personal data lives in FAR more places than the primary users table: caches (Redis), SEARCH indexes (Elasticsearch), the DATA WAREHOUSE / lake, LOGS, message queues / event streams (CDC events), derived/aggregated datasets, ML training sets, and THIRD-PARTY processors (payment, email, analytics). 'DELETE FROM users' leaves the data everywhere else. GDPR requires erasing it ACROSS ALL of them — making this a distributed, cross-system problem, not a single query." },
      { kind: "concept", heading: "A coordinated, tracked deletion workflow",
        body: "Model it as a workflow/SAGA (the workflow-engine idea): a deletion REQUEST fans out delete tasks to EVERY system holding the user's data, each system deletes its copy, and the orchestrator TRACKS completion across all of them (with retries — systems may be temporarily down) until verified done within the legal deadline (e.g. 30 days). A central DATA INVENTORY / map of 'where does personal data live and how is it keyed' is essential — you can't delete what you haven't catalogued. Producing proof of deletion (audit) is required." },
      { kind: "concept", heading: "The backup problem",
        body: "BACKUPS are the hard case: they're immutable snapshots — you can't surgically delete one user from a backup without restoring and rewriting it (impractical). Standard approaches: (1) let the user's data EXPIRE naturally as old backups age out (and document the retention window — often acceptable to regulators if backups aren't used operationally and expire reasonably); (2) CRYPTO-SHREDDING — encrypt each user's data with a per-user key and DELETE THE KEY, rendering all copies (including backups) permanently unreadable instantly. Crypto-shredding elegantly solves the distributed + backup deletion problem at once." },
      { kind: "concept", heading: "Analytics, third parties & follow-ups",
        body: "ANALYTICS/warehouse data is often ANONYMIZED rather than deleted (strip PII so aggregates survive but the person isn't identifiable). THIRD-PARTY processors must be sent deletion requests via their APIs (and tracked). Distinguish hard delete vs anonymization per dataset. Follow-ups: 'data discovery/inventory', 'soft-delete then purge', 'legal holds (some data must be retained — exceptions)', 'verifying/auditing completion'. Signal: data lives everywhere → coordinated tracked deletion workflow across all stores (driven by a data inventory) + backup handling (expiry / crypto-shredding) + anonymize analytics + propagate to third parties + audit proof.",
      },
    ],
    "GDPR deletion tests distributed data governance: personal data is scattered across DBs, caches, search, warehouse, logs, backups, and third parties, so deletion is a coordinated, tracked workflow over all of them (driven by a data inventory), with backups handled by natural expiry or crypto-shredding (per-user key deletion), analytics anonymized, third parties notified, and proof audited. One DELETE is nowhere near enough.",
    ["Treating it as a single DELETE on the primary DB — ignoring caches, search, warehouse, logs, third parties.",
     "No plan for backups (you can't surgically edit them) — use expiry or crypto-shredding.",
     "No data inventory / tracked workflow / proof of completion within the legal deadline."],
    0.6, { type: "Distributed deletion", description: "Erasure request → orchestrated workflow fans deletes to ALL stores holding the user's data (DB, cache, search, warehouse, logs, 3rd parties) — driven by a data inventory, tracked to completion + audited. Backups: expiry or crypto-shredding (delete per-user key). Analytics anonymized.", alt: "GDPR deletion: a coordinated workflow erasing personal data across all systems, with crypto-shredding for backups." }),

  T("sysd_m17_t5", 5, "Design an Image Processing CDN", "design-image-cdn",
    ["case-study", "transform", "cache", "cdn"],
    "Build an image service that delivers any image in any size/format/quality on demand (example.com/img/cat.jpg?w=300&format=webp), fast and globally. Pre-generating every variant is wasteful; regenerating every request is slow. What's the balance?",
    "Transform images ON DEMAND but CACHE aggressively: the transform parameters (size/format/quality) are part of the cache KEY, so a CDN edge serves a previously-generated variant on a HIT, and on a MISS an origin transform service generates it (from the original in object storage), caches it, and serves it. Derivative-on-first-request + CDN caching balances storage vs compute; protect against abuse (param whitelisting) + stampede.",
    [
      { kind: "concept", heading: "On-demand vs pre-generated",
        body: "Clients request images with TRANSFORM params (width, height, crop, format like WebP/AVIF, quality). Two bad extremes: PRE-GENERATE every possible variant (combinatorial explosion — huge wasted storage for variants no one requests) or REGENERATE on every request (slow + expensive CPU per view). The right balance: generate a variant ON ITS FIRST REQUEST, then CACHE it so subsequent requests are cheap — derivative-on-demand with caching." },
      { kind: "concept", heading: "Transform params in the cache key",
        body: "The key insight: the requested transformation (w=300&format=webp&q=80) is part of the CACHE KEY. So /cat.jpg?w=300 and /cat.jpg?w=600 are distinct cached objects. A CDN edge (the CDN design) serves a HIT directly; on a MISS it forwards to an origin TRANSFORM service that loads the ORIGINAL from object storage, applies the transformations, returns + caches the result. Most traffic hits the CDN; only first-time variants hit the transform service." },
      { kind: "concept", heading: "The transform service",
        body: "A stateless, horizontally-scaled service that fetches the original image (object storage), decodes it, applies the requested ops (resize, crop, recompress, format-convert, strip metadata), and returns the derivative. It's CPU-intensive, so cache results hard and consider async pre-warming for known-hot variants. Originals are stored once; derivatives are cache artifacts (regenerable, so they can be evicted)." },
      { kind: "concept", heading: "Abuse, optimization & follow-ups",
        body: "DANGER: arbitrary transform params are an attack surface — an attacker requesting millions of unique sizes fills your cache and hammers the transform service (cache-busting DoS). Defend by WHITELISTING allowed dimensions/params (or signing URLs). Optimize: serve modern formats by content negotiation (WebP/AVIF via Accept header), responsive sizes, and guard the transform-on-miss stampede (coalescing). Follow-ups: 'smart cropping (focal point/face detection)', 'cost of compute vs storage', 'cache eviction of cold derivatives'. Signal: on-demand transform + transform-params-in-cache-key + CDN edge caching (hit) / origin transform service (miss, from object-store originals) + param whitelisting/signing against abuse.",
      },
    ],
    "An image CDN tests derivative-on-demand + caching: transform params are part of the cache key, a CDN edge serves hits and a stateless transform service generates+caches misses from object-store originals — balancing storage (don't pre-gen all) vs compute (don't regen every time). Whitelisting/signing params guards against cache-busting DoS.",
    ["Pre-generating every variant (storage explosion) or regenerating every request (slow/expensive).",
     "Allowing arbitrary transform params unwhitelisted (cache-busting DoS / unbounded cache).",
     "Not making transform params part of the cache key (wrong variant served) or skipping CDN caching."],
    0.5, { type: "Image transform", description: "Request /img.jpg?w=300&format=webp → cache key includes params. CDN edge hit → serve. Miss → transform service loads original (object storage) → resize/crop/recompress → cache + serve. Params whitelisted/signed (anti-DoS).", alt: "Image CDN: on-demand transforms keyed by params, CDN-cached, generated from object-store originals." }),

  T("sysd_m17_t6", 6, "Design a Q&A Platform (Quora / StackOverflow)", "design-qa-platform",
    ["case-study", "feed", "ranking", "search"],
    "Build StackOverflow/Quora at scale: users post questions and answers, vote, comment, tag, and search — with the best answers surfaced and millions of read-heavy page views. What ranks answers, and how is it served fast?",
    "Questions/Answers/Comments are content with VOTES; ANSWERS are ranked by a quality score (votes, acceptance, age — Wilson score, not raw votes) so the best surface to the top. Heavily READ-DOMINATED → cache rendered Q&A pages + denormalized counts. Full-text + tag SEARCH via an inverted index. Vote counts use the distributed-counter pattern. Reputation/gamification and moderation layer on top.",
    [
      { kind: "concept", heading: "Content model & relationships",
        body: "Core entities: QUESTION (title, body, tags, author), ANSWERS (many per question, one possibly ACCEPTED), COMMENTS, VOTES (up/down on questions and answers), and TAGS. Denormalize counts (answer count, vote score, view count) onto the question for cheap list rendering. This is read-heavy content with a voting/ranking layer — similar to the comment-system and hot-ranking designs combined." },
      { kind: "concept", heading: "Ranking answers",
        body: "The defining feature: surface the BEST answer, not just the newest. Rank answers by a quality SCORE combining upvotes minus downvotes, the accepted-answer flag, and sometimes age — but use a confidence-weighted score (WILSON score, like the comment system) so an answer with 50/52 votes outranks one with 5/5, rather than raw vote count which is noisy at low volume. Questions in lists rank by activity/votes/recency depending on the view (newest/active/hot — the hot-ranking design)." },
      { kind: "concept", heading: "Read-heavy serving + search",
        body: "Reads vastly outnumber writes (millions view a popular answer; few post). So CACHE aggressively: rendered question pages (CDN/edge for the most popular, since old Q&A is static), and serve denormalized counts. SEARCH (by keywords + tags) is essential and uses an INVERTED INDEX (Elasticsearch — the search-engine design) over questions/answers, updated as content is posted. Tag pages and 'related questions' are precomputed/indexed." },
      { kind: "concept", heading: "Reputation, moderation & follow-ups",
        body: "REPUTATION/gamification (points for upvotes/accepted answers, badges) drives engagement and unlocks privileges — computed from vote events (async aggregation). MODERATION (flagging, the content-moderation design) and edit history/versioning handle quality. Vote counts on hot content are high-write → the distributed-counter pattern (sharded/approximate). Follow-ups: 'duplicate-question detection (similarity search)', 'spam', 'notifications', 'personalized feed'. Signal: Q/A/vote/tag model with denormalized counts + Wilson-score answer ranking + read-heavy caching (CDN for static Q&A) + inverted-index search + reputation (async) + sharded vote counters + moderation.",
      },
    ],
    "A Q&A platform tests read-heavy content with a ranking layer: Q/A/vote/tag model with denormalized counts, Wilson-score answer ranking (best answer surfaces, not just most votes), aggressive caching (CDN for static Q&A), inverted-index search, async-computed reputation, and sharded vote counters. It composes the comment-system, hot-ranking, and search designs.",
    ["Ranking answers by raw vote count instead of a confidence-weighted (Wilson) quality score.",
     "Not caching for a read-dominated workload (recomputing/rendering every view).",
     "No inverted-index search, or naive hot-row vote counting instead of sharded counters."],
    0.5, { type: "Q&A platform", description: "Question → Answers (one accepted) + votes + tags; denormalized counts. Answers ranked by Wilson-score quality (not raw votes). Read-heavy → cache pages (CDN for static Q&A) + inverted-index search. Reputation computed async from vote events; sharded vote counters.", alt: "Q&A platform: voted Q/A content with Wilson-score ranking, caching, and inverted-index search." }),

  T("sysd_m17_t7", 7, "Design an E-Signature Platform (DocuSign)", "design-esignature",
    ["case-study", "workflow", "tamper-evidence", "audit"],
    "Build DocuSign: a sender uploads a document, designates signers and fields, the document routes to each signer in order, and the final signed document is legally binding and tamper-evident. What drives the routing, and what makes a signature trustworthy in court?",
    "An envelope (document + signers + fields) progresses through a SIGNING WORKFLOW / state machine (routed to signers in order, async, with reminders). Trust comes from CRYPTOGRAPHIC signing — hash the document, sign with certificates (PKI / digital signatures) so any later change is DETECTABLE — plus a tamper-evident AUDIT TRAIL (who signed, when, IP, identity verification). Documents in object storage; immutable once completed.",
    [
      { kind: "concept", heading: "The envelope & signing workflow",
        body: "A sender creates an ENVELOPE: the document(s) + designated SIGNERS + the FIELDS each must fill/sign + the ROUTING ORDER. The envelope then progresses through a WORKFLOW (state machine): SENT → routed to signer 1 → (signs) → signer 2 → … → COMPLETED, or DECLINED/VOIDED/EXPIRED. Signing is ASYNCHRONOUS and long-running (signers act over days) with reminders/notifications — much like the workflow-engine + order-state-machine designs. Sequential vs parallel routing is configurable." },
      { kind: "concept", heading: "Cryptographic integrity (the legal core)",
        body: "A signature is only legally meaningful if the signed document can't be ALTERED afterward undetectably. Achieve this with DIGITAL SIGNATURES: hash the (final) document and sign the hash with a cryptographic certificate/key (PKI) — any subsequent change to the document changes its hash, breaking signature verification (TAMPER-EVIDENT). The platform may use its own signing certificate and/or signer certificates; the completed PDF embeds the signature(s) so anyone can verify integrity. This cryptographic binding is what makes it hold up legally (eIDAS/ESIGN)." },
      { kind: "concept", heading: "Audit trail & identity",
        body: "Legal validity also requires PROOF of the signing event: a tamper-evident AUDIT TRAIL recording who signed, WHEN (trusted timestamps), from what IP/device, and how their IDENTITY was verified (email + access code, SMS OTP — the OTP design, ID check). This certificate of completion accompanies the document. Identity assurance + the audit trail establish intent and authenticity (the same append-only/tamper-evident discipline as the audit-log design)." },
      { kind: "concept", heading: "Storage, security & follow-ups",
        body: "Documents (often sensitive) are stored ENCRYPTED in object storage; the completed, signed document is IMMUTABLE. Access is authorized per envelope. Follow-ups: 'multiple signers / parallel routing', 'templates', 'webhooks on completion (the webhook design)', 'long-term signature validation (certificate expiry/timestamping)', 'compliance (eIDAS levels, HIPAA)'. Signal: envelope + signer-routing workflow (state machine, async, reminders) + cryptographic signing (hash + PKI → tamper-evident) + identity verification + tamper-evident audit trail/certificate + encrypted immutable storage.",
      },
    ],
    "An e-signature platform tests a signer-routing workflow (state machine, async, reminders) plus the legal core: cryptographic signing (hash + PKI digital signatures → tamper-evident, alteration detectable), identity verification (OTP/access codes), and a tamper-evident audit trail/certificate of completion, with documents stored encrypted and immutable. Cryptographic integrity is what makes it binding.",
    ["Treating it as a simple file upload without cryptographic signing/tamper-evidence (not legally binding).",
     "No audit trail / identity verification (can't prove who signed, when, with intent).",
     "Routing/signing synchronously instead of an async multi-signer workflow with reminders."],
    0.6, { type: "Signing workflow", description: "Envelope (doc + signers + fields + order) → workflow: SENT → signer 1 signs → signer 2 → … → COMPLETED (or declined/voided/expired). Each signature = hash + PKI digital signature (tamper-evident). Identity verified (OTP); tamper-evident audit trail; doc encrypted, immutable when done.", alt: "E-signature: a signer-routing workflow with cryptographic signing and a tamper-evident audit trail." }),

  T("sysd_m17_t8", 8, "Design an Uptime / Status Monitoring Service", "design-uptime-monitoring",
    ["case-study", "probing", "alerting", "distributed"],
    "Build Pingdom/StatusPage: monitor whether websites/services are up, from multiple locations, and alert + show a public status page when something's down. How do you avoid false alarms from one flaky probe, and not alert-spam during an outage?",
    "Distributed PROBES in multiple regions periodically check each monitored target (HTTP/TCP/ping); a result is only an outage if CONFIRMED by multiple probes/locations (avoid false positives from one network blip or a single bad probe). Down events open an INCIDENT, deduplicated/grouped to avoid alert storms, escalated via on-call. A status page reflects current state. Store check history (time-series) for uptime % / latency trends.",
    [
      { kind: "concept", heading: "Distributed probing",
        body: "The service runs PROBES (checkers) in MULTIPLE geographic regions that periodically (every N seconds/minutes) check each monitored target — HTTP(S) request (expect 2xx + content/latency), TCP connect, ping, or a scripted transaction. Multiple locations matter: a site may be reachable from the US but not Europe, and a single probe's network hiccup shouldn't be trusted. Probes report results to a central system." },
      { kind: "concept", heading: "Avoiding false positives (confirmation)",
        body: "The key reliability concern: a SINGLE failed check is often a transient network blip or a flaky probe, not a real outage — alerting on it causes false alarms (alert fatigue). So CONFIRM before declaring down: require multiple consecutive failures and/or failures from MULTIPLE probe locations before opening an incident (consensus across probes distinguishes 'the target is down' from 'one probe's path is bad'). This confirmation logic is what makes monitoring trustworthy." },
      { kind: "concept", heading: "Incidents & alerting (no spam)",
        body: "A confirmed failure opens an INCIDENT. Alerting must avoid STORMS: DEDUPLICATE (one incident per target, not one alert per failed check), GROUP related failures, and ESCALATE via on-call schedules (notify, then escalate if unacknowledged — like PagerDuty) across channels (the notification system). When checks succeed again, auto-RESOLVE the incident. Throttle/snooze to prevent flooding responders during a big outage." },
      { kind: "concept", heading: "History, status page & follow-ups",
        body: "Store check results as TIME-SERIES (the TSDB/metrics design) to compute UPTIME % (SLA), latency trends, and dashboards. A public STATUS PAGE reflects current component states + incident history (often statically served / heavily cached so it stays up even when your infra doesn't — host it independently!). Follow-ups: 'monitoring the monitor (who watches the watchdog)', 'check frequency vs cost', 'synthetic transactions', 'maintenance windows'. Signal: distributed multi-region probes + confirmation across probes (no false positives) + incident dedup/grouping + escalation/on-call + time-series history (uptime/latency) + independently-hosted status page.",
      },
    ],
    "An uptime monitor tests distributed multi-region probing with confirmation across probes before declaring down (avoiding false positives from a single blip), incident deduplication/grouping + on-call escalation (no alert storms), time-series history for uptime%/latency, and an independently-hosted status page. Multi-probe confirmation is the reliability crux.",
    ["Alerting on a single failed check (false positives) instead of confirming across multiple probes/locations.",
     "Alert-spamming (one alert per failed check) instead of deduplicated incidents + escalation.",
     "Hosting the status page on the same infra being monitored (it goes down with you); no uptime history."],
    0.5, { type: "Monitoring flow", description: "Multi-region probes check targets periodically → report results. Down only if CONFIRMED by multiple probes/consecutive failures (no false positives) → open incident (dedup/group) → escalate via on-call. Results stored as time-series (uptime%/latency). Independently-hosted status page.", alt: "Uptime monitoring: multi-region probes with confirmation, incident escalation, and a status page." }),
];

const EXERCISES = [
  // Service discovery
  pm({ topicId: "sysd_m17_t1", exerciseId: "sysd_m17_t1_pm_1", position: 1, level: "medium", title: "The problem",
    scenario: "Service A finds healthy instances of Service B (with changing IPs) via…",
    options: ["A service registry queried dynamically", "Hardcoded IP addresses", "A config file edited per deploy", "DNS only, never updated"], correct: "A service registry queried dynamically",
    explanation: "A dynamic registry maps service name → live instances, decoupling callers from ephemeral addresses." }),
  pm({ topicId: "sysd_m17_t1", exerciseId: "sysd_m17_t1_pm_2", position: 2, level: "hard", title: "Stay accurate",
    scenario: "What keeps the registry from routing to dead instances?",
    options: ["Health checks / heartbeats that expire unhealthy instances", "Trusting registrations forever", "A bigger registry", "Manual cleanup"], correct: "Health checks / heartbeats that expire unhealthy instances",
    explanation: "Continuous health checks/heartbeats remove failed instances so traffic only goes to live ones." }),
  pm({ topicId: "sysd_m17_t1", exerciseId: "sysd_m17_t1_pm_3", position: 3, level: "medium", title: "Discovery modes",
    scenario: "Client-side vs server-side discovery differ in…",
    options: ["Whether the client queries the registry+LBs itself or a gateway/LB does it", "The programming language", "Whether health checks exist", "The storage engine"], correct: "Whether the client queries the registry+LBs itself or a gateway/LB does it",
    explanation: "Client-side: client picks an instance; server-side: a load balancer/gateway consults the registry and forwards." }),
  // Schema registry
  pm({ topicId: "sysd_m17_t2", exerciseId: "sysd_m17_t2_pm_1", position: 1, level: "hard", title: "Core job",
    scenario: "A schema registry's key job is to…",
    options: ["Enforce compatibility on new schema versions (reject breaking changes)", "Store the messages themselves", "Route messages", "Encrypt payloads"], correct: "Enforce compatibility on new schema versions (reject breaking changes)",
    explanation: "It gatekeeps schema evolution so producers can't break consumers; messages live in Kafka, not the registry." }),
  pm({ topicId: "sysd_m17_t2", exerciseId: "sysd_m17_t2_pm_2", position: 2, level: "medium", title: "Compact messages",
    scenario: "To avoid bloating every message, producers embed…",
    options: ["A small schema ID (consumers fetch the schema by ID)", "The full schema each time", "Nothing about the schema", "The whole registry"], correct: "A small schema ID (consumers fetch the schema by ID)",
    explanation: "Messages carry a schema ID + encoded payload; consumers fetch (and cache) the schema to deserialize." }),
  pm({ topicId: "sysd_m17_t2", exerciseId: "sysd_m17_t2_pm_3", position: 3, level: "hard", title: "Compatibility",
    scenario: "BACKWARD compatibility means…",
    options: ["The new schema can read data written with the old (consumers upgrade first; add optional/defaulted fields)", "Old code reads new data", "No changes allowed", "Messages are encrypted"], correct: "The new schema can read data written with the old (consumers upgrade first; add optional/defaulted fields)",
    explanation: "Backward = new reads old (safe to add defaulted fields / remove); forward = old reads new (producers first)." }),
  // Audit log
  pm({ topicId: "sysd_m17_t3", exerciseId: "sysd_m17_t3_pm_1", position: 1, level: "medium", title: "Core property",
    scenario: "An audit log must be…",
    options: ["Append-only and immutable (never updated/deleted)", "Editable to fix mistakes", "Stored in the app DB for convenience", "Overwritten daily"], correct: "Append-only and immutable (never updated/deleted)",
    explanation: "Immutability is what makes it trustworthy for compliance and forensics." }),
  pm({ topicId: "sysd_m17_t3", exerciseId: "sysd_m17_t3_pm_2", position: 2, level: "hard", title: "Tamper-evidence",
    scenario: "To detect if a malicious admin altered past entries, use…",
    options: ["Hash-chaining (each entry hashes the previous) + WORM storage", "Trusting admins", "A password on the log", "Frequent backups only"], correct: "Hash-chaining (each entry hashes the previous) + WORM storage",
    explanation: "Hash-chaining makes any alteration break subsequent hashes — detectable; WORM/signing reinforces it." }),
  pm({ topicId: "sysd_m17_t3", exerciseId: "sysd_m17_t3_pm_3", position: 3, level: "medium", title: "Isolation",
    scenario: "The audit log should be stored…",
    options: ["Separately from the app DB, with restricted access", "In the same table as user data", "On the client", "Nowhere — logs are temporary"], correct: "Separately from the app DB, with restricted access",
    explanation: "Separation of duties: compromising the app shouldn't let an attacker edit the audit trail." }),
  // GDPR deletion
  pm({ topicId: "sysd_m17_t4", exerciseId: "sysd_m17_t4_pm_1", position: 1, level: "hard", title: "Why not one DELETE",
    scenario: "Why is 'DELETE FROM users' insufficient for right-to-be-forgotten?",
    options: ["Personal data is scattered across caches, search, warehouse, logs, backups, third parties", "DELETE is too slow", "The row might be locked", "SQL can't delete"], correct: "Personal data is scattered across caches, search, warehouse, logs, backups, third parties",
    explanation: "Data lives in many systems; deletion must be coordinated across all of them, not one query." }),
  pm({ topicId: "sysd_m17_t4", exerciseId: "sysd_m17_t4_pm_2", position: 2, level: "hard", title: "Backups",
    scenario: "You can't surgically delete one user from immutable backups. Solutions include…",
    options: ["Natural expiry of old backups, or crypto-shredding (delete the per-user key)", "Restoring and rewriting every backup per request", "Ignoring backups", "Deleting all backups"], correct: "Natural expiry of old backups, or crypto-shredding (delete the per-user key)",
    explanation: "Crypto-shredding (per-user encryption key, then delete the key) renders all copies unreadable instantly." }),
  pm({ topicId: "sysd_m17_t4", exerciseId: "sysd_m17_t4_pm_3", position: 3, level: "medium", title: "Coordination",
    scenario: "Erasure across many systems is best run as…",
    options: ["A coordinated, tracked workflow driven by a data inventory (+ audit proof)", "Fire-and-forget deletes", "A manual checklist", "A single transaction"], correct: "A coordinated, tracked workflow driven by a data inventory (+ audit proof)",
    explanation: "A workflow fans deletes to every store (per a data inventory), tracks completion within the deadline, and proves it." }),
  // Image CDN
  pm({ topicId: "sysd_m17_t5", exerciseId: "sysd_m17_t5_pm_1", position: 1, level: "hard", title: "The balance",
    scenario: "Delivering arbitrary image sizes/formats efficiently is done by…",
    options: ["Transforming on first request, then caching (params in the cache key)", "Pre-generating every possible variant", "Regenerating on every request", "Storing one size only"], correct: "Transforming on first request, then caching (params in the cache key)",
    explanation: "Derivative-on-demand + caching balances storage (don't pre-gen all) vs compute (don't regen every view)." }),
  pm({ topicId: "sysd_m17_t5", exerciseId: "sysd_m17_t5_pm_2", position: 2, level: "medium", title: "Serving",
    scenario: "A cache miss for ?w=300&format=webp is handled by…",
    options: ["A transform service loading the original (object storage), generating + caching the variant", "Returning the original unchanged", "A 404", "Generating it on the client"], correct: "A transform service loading the original (object storage), generating + caching the variant",
    explanation: "On a CDN miss, the origin transform service derives the variant from the stored original and caches it." }),
  pm({ topicId: "sysd_m17_t5", exerciseId: "sysd_m17_t5_pm_3", position: 3, level: "hard", title: "Abuse",
    scenario: "Arbitrary transform params are dangerous because…",
    options: ["An attacker can request millions of unique variants (cache-busting DoS) — whitelist/sign params", "They're hard to parse", "They slow DNS", "They break HTTPS"], correct: "An attacker can request millions of unique variants (cache-busting DoS) — whitelist/sign params",
    explanation: "Unbounded params fill the cache and hammer the transform service; whitelist allowed sizes or sign URLs." }),
  // Q&A platform
  pm({ topicId: "sysd_m17_t6", exerciseId: "sysd_m17_t6_pm_1", position: 1, level: "hard", title: "Rank answers",
    scenario: "The BEST answer should surface via…",
    options: ["A confidence-weighted (Wilson) quality score, not raw vote count", "Newest first", "Alphabetical", "The longest answer"], correct: "A confidence-weighted (Wilson) quality score, not raw vote count",
    explanation: "Wilson score handles low-volume noise so 50/52 outranks 5/5; acceptance + age also factor in." }),
  pm({ topicId: "sysd_m17_t6", exerciseId: "sysd_m17_t6_pm_2", position: 2, level: "medium", title: "Read-heavy",
    scenario: "Q&A is read-dominated, so you…",
    options: ["Cache rendered pages (CDN for static Q&A) + denormalized counts", "Recompute every page per view", "Disable caching for freshness", "Store everything in one row"], correct: "Cache rendered pages (CDN for static Q&A) + denormalized counts",
    explanation: "Popular Q&A is largely static and viewed millions of times — cache hard, denormalize counts." }),
  pm({ topicId: "sysd_m17_t6", exerciseId: "sysd_m17_t6_pm_3", position: 3, level: "medium", title: "Search",
    scenario: "Keyword + tag search over questions/answers uses…",
    options: ["An inverted index (Elasticsearch)", "A LIKE query per request", "A full scan", "The vote table"], correct: "An inverted index (Elasticsearch)",
    explanation: "An inverted index makes full-text + tag search fast — the search-engine design applied to Q&A." }),
  // E-signature
  pm({ topicId: "sysd_m17_t7", exerciseId: "sysd_m17_t7_pm_1", position: 1, level: "hard", title: "Legally binding",
    scenario: "What makes a signed document trustworthy / tamper-evident in court?",
    options: ["Cryptographic signing (hash + PKI digital signature) — alteration breaks verification", "A scanned signature image", "Storing it in a database", "A password on the PDF"], correct: "Cryptographic signing (hash + PKI digital signature) — alteration breaks verification",
    explanation: "Digitally signing the document's hash makes any later change detectable — the legal core." }),
  pm({ topicId: "sysd_m17_t7", exerciseId: "sysd_m17_t7_pm_2", position: 2, level: "medium", title: "Routing",
    scenario: "An envelope routed to multiple signers in order over days is modelled as…",
    options: ["An async signing workflow / state machine (with reminders)", "A single synchronous request", "A cron job", "A cache"], correct: "An async signing workflow / state machine (with reminders)",
    explanation: "Signing is long-running and multi-step — a workflow/state machine routes to each signer with reminders." }),
  pm({ topicId: "sysd_m17_t7", exerciseId: "sysd_m17_t7_pm_3", position: 3, level: "medium", title: "Proof",
    scenario: "Legal validity also requires…",
    options: ["A tamper-evident audit trail + identity verification (who signed, when, how verified)", "Just the signed file", "The sender's word", "A screenshot"], correct: "A tamper-evident audit trail + identity verification (who signed, when, how verified)",
    explanation: "A certificate of completion (audit trail) + identity assurance (OTP/access codes) establishes intent and authenticity." }),
  // Uptime monitoring
  pm({ topicId: "sysd_m17_t8", exerciseId: "sysd_m17_t8_pm_1", position: 1, level: "hard", title: "Avoid false alarms",
    scenario: "Before declaring a target DOWN, you should…",
    options: ["Confirm via multiple probes/locations or consecutive failures (not one check)", "Alert on the first failed check", "Wait an hour always", "Trust a single probe"], correct: "Confirm via multiple probes/locations or consecutive failures (not one check)",
    explanation: "A single failure is often a transient blip; confirmation across probes distinguishes a real outage from noise." }),
  pm({ topicId: "sysd_m17_t8", exerciseId: "sysd_m17_t8_pm_2", position: 2, level: "medium", title: "No alert storm",
    scenario: "During an outage, to avoid flooding responders you…",
    options: ["Deduplicate/group into one incident + escalate via on-call", "Send an alert per failed check", "Disable alerting", "Email everyone repeatedly"], correct: "Deduplicate/group into one incident + escalate via on-call",
    explanation: "One incident per target, grouped, with on-call escalation (and auto-resolve on recovery) prevents alert fatigue." }),
  pm({ topicId: "sysd_m17_t8", exerciseId: "sysd_m17_t8_pm_3", position: 3, level: "medium", title: "Status page",
    scenario: "The public status page should be…",
    options: ["Hosted independently of the monitored infra (so it survives your outage)", "On the same servers being monitored", "Updated manually only", "Behind your main app login"], correct: "Hosted independently of the monitored infra (so it survives your outage)",
    explanation: "If the status page shares infra with what's down, it goes down too — host it separately and cache it." }),
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
  console.log(`\nDone — M17 Case Studies XII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
