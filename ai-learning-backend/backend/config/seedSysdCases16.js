/**
 * Seed — System Design module M21: Case Studies XV (more domain platforms):
 * Restaurant Reservation (OpenTable), Helpdesk/Ticketing, CRM, RSS/News
 * Aggregator, Photo Storage (Google Photos), Supply-Chain Track-and-Trace,
 * Insurance Claims, Crowdfunding. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases16.js   ·   npm: npm run seed:sysd-cases16
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m21";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 21,
  name: "Case Studies XV — Domain Platforms", slug: "case-studies-15",
  description: "Eight more domain-specific designs: a restaurant reservation system, a helpdesk/ticketing system, a CRM, a news/RSS aggregator, photo storage, supply-chain track-and-trace, insurance claims processing, and a crowdfunding platform.",
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
  T("sysd_m21_t1", 1, "Design Restaurant Reservation (OpenTable)", "design-restaurant-reservation",
    ["case-study", "inventory", "concurrency", "availability"],
    "Build OpenTable: diners search restaurants by time/party size and book a table, with no double-booking under concurrency. Restaurant inventory (tables) is small and time-sliced. What's the availability model and the booking guard?",
    "Availability = a restaurant's TABLES × time SLOTS minus existing reservations (an inventory-by-time problem). Search shows open slots for a party size; booking must ATOMICALLY claim a slot (unique constraint / transaction) so two diners can't grab the last table — the booking concurrency discipline. Handle party-size→table matching, turn times, and no-shows/waitlists. Search can be eventually consistent; booking is strongly consistent.",
    [
      { kind: "concept", heading: "Availability as time-sliced inventory",
        body: "A restaurant has limited TABLES (of various sizes), and a reservation occupies a table for a TIME SLICE (the seating + turn time). So availability is an inventory problem indexed by (restaurant, date, time slot, table): a slot is available if a suitable table isn't already reserved for an overlapping time. Searching 'tables for 4 at 7pm Friday' filters restaurants with an open, large-enough table at that slot. Precompute/cache availability for fast search." },
      { kind: "concept", heading: "Party size → table matching",
        body: "A reservation needs a table that fits the PARTY SIZE (a 2-top can't seat 6; ideally don't waste an 8-top on a couple). Allocation matches party size to suitable tables (and may combine tables). Turn TIME (how long a party occupies a table — varies by restaurant/party size) determines when the table frees for the next slot. This table-fitting + turn-time logic shapes what's bookable." },
      { kind: "concept", heading: "The booking concurrency guard",
        body: "Two diners booking the LAST suitable table for the same slot must not both succeed — the now-familiar double-booking race (hotel/appointment/calendar). Claim the slot ATOMICALLY: a transaction (or unique constraint on (restaurant, table, slot)) that re-checks availability and inserts, so exactly one wins; the other is told 'just taken' and re-picks. A short HOLD during checkout covers the booking flow. This atomic guard is the correctness crux." },
      { kind: "concept", heading: "Consistency, ops & follow-ups",
        body: "Like Airbnb, SEARCH availability can be slightly stale (eventually consistent — a just-booked slot may briefly show), but the BOOKING transaction is strongly consistent and authoritative. Operations: no-show handling, cancellations (free the slot), WAITLISTS, walk-ins (restaurant adjusts inventory), and POS/host-stand integration. Follow-ups: 'overbooking policy', 'special requests', 'notifications/reminders', 'peak-time spikes'. Signal: time-sliced table inventory + party-size/turn-time matching + atomic slot booking (no double-book) + eventually-consistent search vs strongly-consistent booking + no-show/waitlist ops.",
      },
    ],
    "Restaurant reservation tests time-sliced table inventory (tables × slots minus reservations), party-size/turn-time matching, and an atomic slot-booking guard (no double-book under concurrency — the hotel/calendar discipline), with eventually-consistent search but a strongly-consistent booking transaction. No-shows and waitlists are the ops layer.",
    ["Non-atomic booking that double-books the last table for a slot.",
     "Ignoring party-size/turn-time matching (which determines what's actually bookable).",
     "Requiring strong consistency for search instead of only for the booking transaction."],
    0.5, { type: "Reservation", description: "Availability = tables × time slots − reservations (matched to party size + turn time). Search: open slots for a party (eventually consistent). Book: atomic claim of (restaurant, table, slot) — one wins (no double-book), short hold during checkout. No-show/waitlist ops.", alt: "Restaurant reservation: time-sliced table inventory with atomic, party-size-aware slot booking." }),

  T("sysd_m21_t2", 2, "Design a Helpdesk / Ticketing System (Zendesk)", "design-helpdesk-ticketing",
    ["case-study", "workflow", "routing", "sla"],
    "Build Zendesk: customers submit support tickets via many channels (email, chat, web), agents work them through a lifecycle, with routing/assignment and SLA tracking. What carries a ticket, and how are SLAs enforced?",
    "A TICKET is the core entity with a STATUS lifecycle (NEW→OPEN→PENDING→RESOLVED→CLOSED — a State machine) and a thread of messages. Ingest from multiple CHANNELS into one ticket. ROUTE/assign tickets (by skill/queue/round-robin/priority). Enforce SLAs with timers + ESCALATION (breach → alert/reassign). It's a workflow + routing + SLA system; reporting/search and a knowledge base layer on top.",
    [
      { kind: "concept", heading: "The ticket & its lifecycle",
        body: "Everything centers on the TICKET: a request with a subject, requester, priority, tags, assignee, and a THREAD of messages/comments (customer + agent + internal notes). Its STATUS follows a lifecycle State machine: NEW → OPEN (assigned/being worked) → PENDING (waiting on customer) → ON_HOLD → RESOLVED → CLOSED, with reopen paths. The State pattern enforces valid transitions and triggers actions (notify on status change). This ticket-as-state-machine is the backbone." },
      { kind: "concept", heading: "Omnichannel ingestion",
        body: "Customers reach support via many CHANNELS — email, web form, live chat, social, phone — but it should all land as TICKETS in one system. Each channel adapter normalizes incoming messages into the ticket model (and threads replies into the existing ticket — e.g. matching email replies by ticket id in the subject). Unifying channels into one ticket + one history is a defining feature (vs scattered inboxes)." },
      { kind: "concept", heading: "Routing & assignment",
        body: "Tickets must reach the right AGENT: ROUTE by queue/group (billing vs technical), skill-based routing, round-robin/load-balancing across available agents, and PRIORITY (urgent tickets first). Automation rules (triggers) act on ticket events (auto-tag, auto-assign, auto-respond). This routing/assignment layer (a rules engine over ticket events) determines throughput and fairness." },
      { kind: "concept", heading: "SLAs, reporting & follow-ups",
        body: "SLAs (Service Level Agreements) promise response/resolution within target times by priority. Track SLA TIMERS per ticket (first-response time, resolution time, pausing during PENDING-on-customer), and ESCALATE on approaching/breaching a target (alert, reassign, raise priority). Reporting (volume, response times, CSAT) and a searchable knowledge base / macros round it out. Follow-ups: 'business hours/calendars for SLAs', 'merge/split tickets', 'spam filtering', 'multi-tenant (each company's helpdesk)'. Signal: ticket State machine + omnichannel ingestion into one ticket + rule-based routing/assignment + SLA timers with escalation + reporting/KB.",
      },
    ],
    "A helpdesk tests a ticket State machine (new→open→pending→resolved→closed) fed by omnichannel ingestion into one ticket, rule-based routing/assignment (queue/skill/round-robin/priority), and SLA timers with escalation on breach, plus reporting and a knowledge base. The ticket lifecycle + SLA tracking are the core.",
    ["No ticket State machine / status lifecycle (ad-hoc flags, illegal transitions).",
     "Scattered per-channel inboxes instead of unifying channels into one ticket + history.",
     "No SLA timers/escalation, or ignoring business-hours when computing SLA deadlines."],
    0.5, { type: "Ticketing", description: "Channels (email/chat/web) → normalize into a TICKET. Ticket status: NEW → OPEN → PENDING → RESOLVED → CLOSED (State machine). Route/assign by queue/skill/priority (rules). SLA timers per ticket → escalate on breach. Reporting + knowledge base.", alt: "Helpdesk: omnichannel tickets in a status lifecycle with routing and SLA escalation." }),

  T("sysd_m21_t3", 3, "Design a CRM (Salesforce)", "design-crm",
    ["case-study", "data-model", "customization", "multi-tenant"],
    "Build a CRM: manage customers/contacts, sales pipelines (deals through stages), activities, and reports — for thousands of businesses each wanting custom fields and workflows. What's the data challenge, and how do you support per-tenant customization?",
    "Core entities: Accounts, Contacts, Leads, OPPORTUNITIES (deals moving through pipeline STAGES — a State machine), and Activities (calls/emails/tasks). The hard part is per-customer CUSTOMIZATION — businesses add custom fields/objects/workflows — so use a flexible/metadata-driven schema (schema-as-data) on a MULTI-TENANT platform. Plus relationship-heavy queries, reporting/analytics, and automation/workflow rules.",
    [
      { kind: "concept", heading: "The relationship-rich data model",
        body: "A CRM models the customer relationship graph: ACCOUNTS (companies), CONTACTS (people, linked to accounts), LEADS (prospects), OPPORTUNITIES/DEALS, and ACTIVITIES (calls, emails, meetings, tasks) linked to all of the above. It's RELATIONSHIP-heavy — a contact relates to an account, deals, activities, owners. Queries traverse these relationships ('all open deals for accounts in this region with no activity in 30 days'). Modeling these entities + relationships cleanly is the foundation." },
      { kind: "concept", heading: "Sales pipeline as a state machine",
        body: "An OPPORTUNITY (deal) moves through PIPELINE STAGES (Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost) — a State machine with a value, probability, and close date. Pipeline reporting (forecast, conversion rates, velocity) derives from deals' stages and history. Tracking stage TRANSITIONS over time enables forecasting and funnel analytics — a central CRM value." },
      { kind: "concept", heading: "Customization (the hard part)",
        body: "The defining challenge: every business wants DIFFERENT fields, objects, and processes (a custom 'Region' field, a custom object for 'Properties', a unique sales process). Hardcoding a fixed schema fails. Salesforce-style platforms use a METADATA-DRIVEN model — custom fields/objects are stored as DATA (schema-as-data, like the forms platform), and the app renders/validates from metadata. This lets each tenant customize without code changes — but makes the underlying storage and querying generic and complex." },
      { kind: "concept", heading: "Multi-tenancy, automation & follow-ups",
        body: "It's MULTI-TENANT (the multi-tenant-SaaS design): thousands of companies share infrastructure with strict tenant data isolation (every query scoped to the org). WORKFLOW automation (rules: when a deal hits a stage, create a task / send an email — the rules-engine idea) and REPORTING/dashboards (analytics over the data, often a separate OLAP path) are major features. Integrations (email, calendar) sync activities. Follow-ups: 'reporting performance on custom data', 'API/extensibility', 'permissions/sharing rules'. Signal: relationship-rich entities + pipeline-stage State machine + metadata-driven customization (schema-as-data) on a multi-tenant platform + workflow automation + reporting.",
      },
    ],
    "A CRM tests a relationship-rich data model (accounts/contacts/leads/opportunities/activities) with a sales-pipeline State machine, and — the hard part — per-tenant CUSTOMIZATION via a metadata-driven (schema-as-data) model on a multi-tenant platform, plus workflow automation and reporting. Supporting custom fields/objects without code changes is the defining challenge.",
    ["A fixed hardcoded schema instead of metadata-driven customization (custom fields/objects as data).",
     "Ignoring multi-tenancy/tenant isolation for thousands of businesses.",
     "Modeling deals as a flat status flag instead of a pipeline-stage State machine (no forecasting)."],
    0.6, { type: "CRM", description: "Entities: Accounts ↔ Contacts ↔ Leads ↔ Opportunities (pipeline stages, State machine) ↔ Activities. Custom fields/objects stored as metadata (schema-as-data) → per-tenant customization without code. Multi-tenant (isolated). Workflow automation + reporting/analytics.", alt: "CRM: relationship-rich entities with a pipeline state machine and metadata-driven customization." }),

  T("sysd_m21_t4", 4, "Design a News / RSS Aggregator", "design-news-aggregator",
    ["case-study", "ingestion", "dedup", "ranking"],
    "Build a news aggregator (Google News / Feedly): pull articles from thousands of sources, deduplicate the same story reported by many outlets, and present a ranked, personalized feed. What's the ingestion shape, and the dedup/clustering challenge?",
    "POLL/ingest thousands of feeds (RSS/APIs/crawl) on a schedule into a normalized article store. The crux: the SAME story appears across many outlets — CLUSTER/dedup near-duplicate articles (text similarity / fingerprinting) into one story. RANK stories (freshness + popularity + source quality + personalization — the recommender/hot-ranking ideas) into a feed. Read-heavy → cache feeds. Handle polling efficiency and source reliability.",
    [
      { kind: "concept", heading: "Ingestion from many sources",
        body: "An aggregator pulls content from thousands of SOURCES — RSS/Atom feeds, publisher APIs, or crawling (the web-crawler design). Ingestion is typically POLLING on a schedule (respecting each source's update frequency + politeness/rate limits; conditional GETs / ETags to avoid re-fetching unchanged feeds). Parse each into a normalized ARTICLE (title, body/summary, url, source, timestamp). Efficient, scalable polling of many sources is the input challenge." },
      { kind: "concept", heading: "Deduplication / clustering (the crux)",
        body: "The defining problem: the SAME news story is reported by MANY outlets with different wording — you don't want 50 near-identical entries. CLUSTER articles that cover the same story using text SIMILARITY (TF-IDF / embeddings / fingerprinting — the plagiarism-detection and vector-DB ideas) and signals (entities, time proximity). Each cluster becomes ONE 'story' with multiple sources. This near-duplicate clustering is what makes the feed coherent and is the hardest part." },
      { kind: "concept", heading: "Ranking & personalization",
        body: "Present a RANKED feed: combine FRESHNESS (time decay — the hot-ranking design), POPULARITY/trending, SOURCE quality/credibility, and PERSONALIZATION (topics/sources the user follows — the recommender funnel). Editorial/topic categorization (sports/tech) groups stories. Ranking decides what surfaces — balancing recency, importance, and relevance to the user." },
      { kind: "concept", heading: "Serving & follow-ups",
        body: "It's READ-heavy (many readers, fewer ingestion events) → cache rendered feeds (per-topic / per-user), serve via CDN for popular feeds. Store articles + cluster assignments + user preferences. Follow-ups: 'real-time breaking news (push)', 'paywall/snippet handling + copyright', 'misinformation/source trust', 'full-text search (inverted index)', 'feed pagination'. Signal: scheduled multi-source ingestion (efficient polling) + near-duplicate clustering into stories (similarity) + ranking (freshness + popularity + quality + personalization) + cached read-heavy feeds.",
      },
    ],
    "A news aggregator tests scheduled multi-source ingestion (efficient polling of thousands of feeds), near-duplicate CLUSTERING of the same story across outlets (text similarity — the crux), and ranking (freshness + popularity + source quality + personalization) into a cached, read-heavy feed. Deduplication into coherent stories is the hardest part.",
    ["Showing the same story 50× because near-duplicate articles aren't clustered/deduped.",
     "Inefficient polling (re-fetching unchanged feeds; ignoring rate limits/conditional GETs).",
     "Chronological-only feed with no ranking (freshness + popularity + quality + personalization)."],
    0.5, { type: "News aggregator", description: "Sources (RSS/API/crawl) → scheduled polling → normalized articles. Cluster near-duplicate articles into ONE story (text similarity). Rank stories (freshness + popularity + source quality + personalization). Read-heavy → cache feeds (CDN).", alt: "News aggregator: polled multi-source ingestion, story clustering, and ranked cached feeds." }),

  T("sysd_m21_t5", 5, "Design Photo Storage & Sharing (Google Photos)", "design-photo-storage",
    ["case-study", "object-storage", "dedup", "ml-tagging"],
    "Build Google Photos: users upload billions of photos/videos, view them fast anywhere, share albums, and SEARCH by content ('beach', 'dog') without manual tags. How are photos stored and made instantly viewable + searchable?",
    "Store originals in object storage; generate multiple THUMBNAIL/preview sizes (the media-pipeline design) served via CDN for instant browsing. DEDUPLICATE identical uploads (content hash) to save space. Metadata (albums, EXIF, owners) in databases. The standout: ML CONTENT TAGGING (vision models label objects/faces/scenes) + an index enabling SEARCH BY CONTENT. Read-heavy; sync across devices.",
    [
      { kind: "concept", heading: "Upload & storage",
        body: "Photos/videos upload DIRECTLY to object storage (pre-signed URLs, multipart for big videos — the media-pipeline design), not through app servers. Store the ORIGINAL once; DEDUPLICATE identical files via content hash (the same photo uploaded twice / shared = stored once — big savings at billions of photos). Metadata (owner, EXIF: date/location/camera, album membership) lives in databases. Originals are durable (replicated/erasure-coded — object storage)." },
      { kind: "concept", heading: "Fast viewing (thumbnails + CDN)",
        body: "You can't send full-resolution originals for browsing a grid of thousands of photos. Generate multiple PREVIEW/THUMBNAIL sizes on upload (async transcode — the media pipeline) and serve them via CDN for instant, smooth scrolling on any device/bandwidth. Originals are fetched only on full-view/download. This thumbnail tier + CDN is what makes the gallery feel instant." },
      { kind: "concept", heading: "Content search via ML tagging (the standout)",
        body: "The killer feature: SEARCH BY CONTENT without manual tags. On upload, ML VISION models analyze each photo — object detection (dog, beach, food), scene classification, OCR (text in images), and FACE clustering (group the same person) — producing labels/embeddings. Index these (an inverted index on labels, and/or embeddings in a vector DB — the semantic-search design) so a query 'beach' or a face returns matching photos. This async ML enrichment pipeline + searchable index is the distinguishing design." },
      { kind: "concept", heading: "Sharing, sync & follow-ups",
        body: "ALBUMS and SHARING (share links / shared albums with permissions). SYNC across a user's devices (the offline-sync ideas — backup new photos, reflect deletes). It's READ-heavy (view far more than upload). Follow-ups: 'privacy of ML analysis + faces', 'storage tiering (move old photos to cold storage)', 'editing/versions', 'live/video handling', 'quota/billing'. Signal: direct-to-object-storage originals + content-hash dedup + thumbnail tiers via CDN (fast viewing) + async ML tagging/face-clustering → searchable index (content search) + albums/sharing + device sync.",
      },
    ],
    "Photo storage tests object-stored originals (deduped by content hash) with thumbnail tiers served via CDN for instant viewing, plus the standout: async ML content tagging + face clustering feeding a searchable index for content search ('beach', 'dog') without manual tags. It composes the media-pipeline, semantic-search, and sync designs; read-heavy.",
    ["Serving full-resolution originals for browsing instead of CDN-served thumbnail tiers.",
     "No content-hash dedup (storing identical/shared photos many times).",
     "No ML tagging/index — can't offer content search without manual tags."],
    0.5, { type: "Photo storage", description: "Upload → object storage (originals, deduped by content hash) + thumbnail tiers (async) → CDN (fast viewing). Metadata/albums in DBs. Async ML: object/scene tagging + OCR + face clustering → searchable index (content search). Albums/sharing; device sync.", alt: "Photo storage: deduped originals + CDN thumbnails + ML tagging enabling content search." }),

  T("sysd_m21_t6", 6, "Design Supply-Chain Track-and-Trace", "design-supply-chain-tracking",
    ["case-study", "events", "provenance", "tracking"],
    "Build a system to track goods through a supply chain (manufacture → warehouse → transport → retail): know where each item/shipment is, its history, and prove provenance, across many independent organizations. What's the data model, and the cross-org trust challenge?",
    "Model the journey as an append-only stream of EVENTS (each scan/handoff: item/shipment id, location, timestamp, actor, status) — the current state and full HISTORY/provenance are derived from the event log (event sourcing). Aggregate scans from IoT/barcode/RFID across many ORGANIZATIONS (each emits events) into a shared view. The challenge is cross-org data sharing + trust (immutable, tamper-evident — sometimes a shared/blockchain ledger).",
    [
      { kind: "concept", heading: "Events are the model",
        body: "Track-and-trace is fundamentally EVENT-driven: as an item or shipment moves, each step generates an EVENT (manufactured, packed, scanned at warehouse, loaded, in transit, delivered) with id, location, timestamp, actor, and status. The current LOCATION/state and the full HISTORY (provenance) are DERIVED from the append-only event stream — event sourcing. Don't model just 'current location'; the immutable event log is the source of truth and gives the complete trace." },
      { kind: "concept", heading: "Ingesting scans at scale",
        body: "Events come from many SOURCES: barcode/QR SCANS, RFID readers, IoT sensors (temperature/location for cold chain), and partner systems. Ingest this high-volume event stream (Kafka — the IoT/CDC patterns) into the trace store. Identifiers (serialized item ids, shipment/container ids, with hierarchy: items in cases in pallets in containers) let you aggregate and roll up status. Handle out-of-order/duplicate scans (idempotent by event id)." },
      { kind: "concept", heading: "Cross-organization trust (the crux)",
        body: "Goods pass through MANY independent ORGANIZATIONS (manufacturer, carriers, distributors, retailers) that don't fully trust each other — yet provenance must be verifiable across all of them (e.g. for food safety, pharma anti-counterfeiting, ethical sourcing). The challenge is sharing data across orgs while ensuring it's TAMPER-EVIDENT and authentic. Solutions: a shared platform with cryptographic signing + an immutable/audit ledger (the audit-log design), or a permissioned BLOCKCHAIN/distributed ledger so no single party can forge history. This cross-org trust is the distinguishing problem." },
      { kind: "concept", heading: "Queries & follow-ups",
        body: "Support trace queries: 'where is shipment X now?', 'full history of item Y', and RECALL queries ('which units came from batch Z / supplier W?' — trace backward and forward). Real-time visibility dashboards + alerts (delayed shipment, cold-chain breach). Follow-ups: 'standards (GS1/EPCIS)', 'IoT scale', 'analytics on the event stream', 'privacy of commercial data'. Signal: append-only event stream (event sourcing) as source of truth + multi-source scan/IoT ingestion + derived location/provenance + cross-org tamper-evident sharing (audit ledger / blockchain) + trace/recall queries.",
      },
    ],
    "Supply-chain track-and-trace tests event-sourced tracking: an append-only event stream (scans/handoffs) as the source of truth from which current location + full provenance are derived, ingested from multi-source scans/IoT across organizations, with the distinguishing challenge of cross-org tamper-evident data sharing (audit ledger / blockchain). Trace and recall queries are the payoff.",
    ["Storing only 'current location' instead of an append-only event log (losing history/provenance).",
     "Ignoring the cross-org trust problem (tamper-evident sharing across untrusting organizations).",
     "Not handling out-of-order/duplicate scans (idempotency) at IoT scale."],
    0.6, { type: "Track-and-trace", description: "Each scan/handoff → append-only EVENT (item/shipment id, location, time, actor, status). Multi-source ingest (barcode/RFID/IoT) across orgs → event log = source of truth; location + provenance DERIVED. Cross-org tamper-evidence: signed/audit ledger or blockchain. Trace + recall queries.", alt: "Supply-chain track-and-trace: an append-only event log with cross-org tamper-evident sharing." }),

  T("sysd_m21_t7", 7, "Design Insurance Claims Processing", "design-insurance-claims",
    ["case-study", "workflow", "fraud", "human-in-loop"],
    "Build a claims system: a policyholder files a claim, it's validated and assessed, fraud is checked, and a payout is decided — across many steps and parties. Why is this a long-running workflow, and where do automation and humans fit?",
    "A claim flows through a multi-step WORKFLOW (intake → validate policy/coverage → assess damage → FRAUD check → decision → payout) — long-running, with persisted state (the workflow-engine + saga ideas). AUTOMATE clear cases (straight-through processing) and route AMBIGUOUS/large/suspicious ones to human ADJUSTERS (human-in-the-loop). Fraud detection scores claims; payout uses a ledger. Audit every step (regulated).",
    [
      { kind: "concept", heading: "A long-running, multi-step workflow",
        body: "Claims processing is a WORKFLOW spanning days/weeks and many steps: INTAKE (file the claim + documents/photos) → VALIDATE (policy active? incident covered? within limits?) → ASSESS (estimate damage/loss — may need an adjuster, repair estimates, medical records) → FRAUD review → DECISION (approve/deny/partial) → PAYOUT → close. It's long-running with external waits (documents, third-party reports), so model it as a durable WORKFLOW with persisted state that resumes across waits (the workflow-engine/saga designs) — not a single request." },
      { kind: "concept", heading: "Automation vs human adjusters",
        body: "The key design lever: STRAIGHT-THROUGH PROCESSING for simple, clear, low-value claims — auto-validate and auto-approve to cut cost and time. But complex, large, ambiguous, or suspicious claims route to human ADJUSTERS (human-in-the-loop) who investigate and decide. So a routing/triage step (rules + risk scoring) decides automate vs assign-to-human — balancing efficiency against the cost of wrong automated payouts. This human-in-the-loop split mirrors fraud/moderation/KYC designs." },
      { kind: "concept", heading: "Fraud detection",
        body: "Insurance FRAUD is huge, so a FRAUD-detection stage scores each claim (the fraud-detection design): rules + ML over claim features (history, patterns, inconsistencies, network links between claimants/providers — graph analysis), flagging suspicious claims for special investigation (SIU). False positives delay legitimate claimants; false negatives pay fraud — the familiar trade. Fraud scoring feeds the automate-vs-human routing." },
      { kind: "concept", heading: "Payout, compliance & follow-ups",
        body: "Approved claims trigger PAYMENT (via a ledger — the payment/wallet discipline: accurate, auditable; reserve liability when a claim opens). The whole process is REGULATED → immutable AUDIT trail of every decision/document (the audit-log design), and secure PII/medical data handling. Follow-ups: 'reserving (estimate liability)', 'subrogation/recovery', 'document/image AI (damage estimation from photos)', 'reinsurance', 'SLAs/customer comms'. Signal: durable multi-step claims workflow (persisted, long-running) + straight-through automation vs human adjuster routing + fraud scoring + ledger payout + audit trail/compliance.",
      },
    ],
    "Insurance claims tests a durable, long-running multi-step workflow (intake→validate→assess→fraud→decide→pay) with persisted state, straight-through automation for clear cases vs human-adjuster routing for complex/suspicious ones (human-in-the-loop), fraud scoring, ledger-based payout, and a compliance audit trail. It composes the workflow, fraud, and payment designs.",
    ["Treating it as a single synchronous request instead of a durable long-running workflow.",
     "Fully automating all claims with no human adjuster path for complex/suspicious/large ones.",
     "Skipping fraud detection, or non-auditable/insecure handling of regulated claim data."],
    0.6, { type: "Claims workflow", description: "Claim → intake → validate (policy/coverage) → assess → FRAUD score → route: straight-through auto-approve (clear cases) vs human adjuster (complex/suspicious) → decision → payout (ledger) → close. Durable workflow (persisted, long-running). Immutable audit; secure PII.", alt: "Insurance claims: a durable workflow with automation, fraud scoring, and human-adjuster routing." }),

  T("sysd_m21_t8", 8, "Design a Crowdfunding Platform (Kickstarter)", "design-crowdfunding",
    ["case-study", "payments", "all-or-nothing", "concurrency"],
    "Build Kickstarter: creators launch campaigns with a funding goal + deadline; backers pledge money; if the goal is met by the deadline, backers are charged and the creator funded ('all-or-nothing'). What's the payment subtlety, and the campaign lifecycle?",
    "A CAMPAIGN has a goal, deadline, and reward tiers; it's a State machine (DRAFT→LIVE→[SUCCESSFUL|FAILED]→FULFILLING). The 'ALL-OR-NOTHING' rule means you AUTHORIZE pledges but only CAPTURE (charge) them IF the goal is met at the deadline — so payment is deferred/conditional. Track the running pledge total accurately (concurrency on the counter), process the batch capture at deadline, and handle failed cards. Payments via a ledger.",
    [
      { kind: "concept", heading: "Campaign model & lifecycle",
        body: "A CAMPAIGN has a creator, a funding GOAL, a DEADLINE, a description, and REWARD TIERS (pledge $X → get reward Y, often limited quantity). It's a State machine: DRAFT → LIVE (accepting pledges) → at deadline → SUCCESSFUL (goal met) or FAILED (goal not met) → FULFILLING (creator delivers rewards). Backers PLEDGE (choosing a tier). The lifecycle + deadline drive the conditional payment logic." },
      { kind: "concept", heading: "All-or-nothing payments (the subtlety)",
        body: "The defining feature: backers are charged ONLY IF the campaign succeeds. So when a backer pledges, you DON'T charge immediately — you AUTHORIZE/record the pledge (or hold a payment authorization). At the DEADLINE, if the goal is MET, you CAPTURE (charge) all the pledges and fund the creator; if NOT met, you charge nothing (release authorizations). This deferred/conditional capture is the payment crux — different from immediate-charge e-commerce." },
      { kind: "concept", heading: "Concurrency & the running total",
        body: "The running PLEDGE TOTAL is read constantly (progress bar) and updated on every pledge — under high concurrency near a viral campaign, this is a hot counter (the distributed-counter/wallet discipline): increment atomically so the total is accurate. Limited-quantity reward TIERS are inventory (atomic claim, no overselling a tier — the flash-sale/booking discipline). Accuracy matters because the total determines success/failure and what's charged." },
      { kind: "concept", heading: "Deadline processing & follow-ups",
        body: "At the deadline, a BATCH process (scheduler) evaluates each campaign: if successful, CAPTURE all pledges (asynchronously, via the payment system — handle FAILED cards: a backer's card may decline at capture, slightly reducing the funded amount; retry/dunning). Use a LEDGER for money (auditable, the platform fee). Follow-ups: 'fraud (fake campaigns/backers)', 'refunds/disputes', 'fulfillment tracking', 'flexible vs all-or-nothing funding'. Signal: campaign State machine (goal/deadline/tiers) + all-or-nothing deferred capture (authorize on pledge, capture at deadline only if goal met) + atomic running total + limited-tier inventory + batch deadline capture (handle failed cards) + ledger.",
      },
    ],
    "Crowdfunding tests deferred/conditional payments: a campaign State machine (goal/deadline/tiers) with all-or-nothing funding — authorize pledges but capture them only at the deadline IF the goal is met — plus an atomic running total (hot counter), limited-tier inventory, and a batch deadline-capture handling failed cards, all via a ledger. The all-or-nothing deferred capture is the distinguishing crux.",
    ["Charging backers immediately instead of deferred, conditional capture at the deadline (all-or-nothing).",
     "A non-atomic running pledge total (inaccurate progress → wrong success/failure determination).",
     "Not handling cards that decline at capture time, or overselling limited reward tiers."],
    0.6, { type: "Crowdfunding", description: "Campaign (goal + deadline + reward tiers): DRAFT → LIVE → SUCCESSFUL/FAILED → FULFILLING. Pledge → authorize (don't charge yet) + atomically bump total; limited tiers = inventory. At deadline: goal met → batch-CAPTURE all pledges (handle declines) via ledger; else charge nothing.", alt: "Crowdfunding: a campaign lifecycle with all-or-nothing deferred payment capture at the deadline." }),
];

const EXERCISES = [
  // Restaurant reservation
  pm({ topicId: "sysd_m21_t1", exerciseId: "sysd_m21_t1_pm_1", position: 1, level: "medium", title: "Availability",
    scenario: "Restaurant availability is modeled as…",
    options: ["Time-sliced table inventory (tables × slots − reservations, matched to party size)", "Unlimited capacity", "One table for everyone", "A queue only"], correct: "Time-sliced table inventory (tables × slots − reservations, matched to party size)",
    explanation: "A slot is available if a suitable table isn't reserved for an overlapping time; match party size + turn time." }),
  pm({ topicId: "sysd_m21_t1", exerciseId: "sysd_m21_t1_pm_2", position: 2, level: "hard", title: "No double-book",
    scenario: "Two diners book the last suitable table for a slot. Prevent it with…",
    options: ["An atomic claim of (restaurant, table, slot) — one wins", "An in-memory availability check then save", "Trusting the UI", "A bigger DB"], correct: "An atomic claim of (restaurant, table, slot) — one wins",
    explanation: "Atomic booking (transaction/unique constraint) lets exactly one succeed — the double-booking discipline." }),
  pm({ topicId: "sysd_m21_t1", exerciseId: "sysd_m21_t1_pm_3", position: 3, level: "medium", title: "Consistency",
    scenario: "Search availability vs the booking transaction…",
    options: ["Search can be eventually consistent; booking must be strongly consistent", "Both strongly consistent", "Both eventually consistent", "Neither matters"], correct: "Search can be eventually consistent; booking must be strongly consistent",
    explanation: "Slightly-stale search is fine; the final booking re-validates atomically and authoritatively (like Airbnb)." }),
  // Helpdesk
  pm({ topicId: "sysd_m21_t2", exerciseId: "sysd_m21_t2_pm_1", position: 1, level: "medium", title: "Ticket lifecycle",
    scenario: "A support ticket's status (new/open/pending/resolved/closed) is…",
    options: ["A State machine enforcing valid transitions", "A free-text field", "Computed from messages", "Random"], correct: "A State machine enforcing valid transitions",
    explanation: "The ticket State machine governs the lifecycle and triggers actions on transitions." }),
  pm({ topicId: "sysd_m21_t2", exerciseId: "sysd_m21_t2_pm_2", position: 2, level: "medium", title: "Omnichannel",
    scenario: "Email, chat, and web requests should…",
    options: ["All become tickets in one system (threaded into one ticket)", "Stay in separate inboxes", "Be handled by different teams with no link", "Be ignored"], correct: "All become tickets in one system (threaded into one ticket)",
    explanation: "Channel adapters normalize messages into one unified ticket + history (vs scattered inboxes)." }),
  pm({ topicId: "sysd_m21_t2", exerciseId: "sysd_m21_t2_pm_3", position: 3, level: "hard", title: "SLAs",
    scenario: "SLAs are enforced with…",
    options: ["Per-ticket timers + escalation on approaching/breaching the target", "A nightly report only", "Agent memory", "Nothing"], correct: "Per-ticket timers + escalation on approaching/breaching the target",
    explanation: "Track response/resolution timers (pausing on customer-wait, respecting business hours) and escalate on breach." }),
  // CRM
  pm({ topicId: "sysd_m21_t3", exerciseId: "sysd_m21_t3_pm_1", position: 1, level: "hard", title: "The hard part",
    scenario: "Supporting each business's custom fields/objects/workflows requires…",
    options: ["A metadata-driven model (schema-as-data), not a fixed hardcoded schema", "A separate codebase per customer", "Ignoring customization", "One rigid table"], correct: "A metadata-driven model (schema-as-data), not a fixed hardcoded schema",
    explanation: "Custom fields/objects stored as metadata let tenants customize without code changes (Salesforce-style)." }),
  pm({ topicId: "sysd_m21_t3", exerciseId: "sysd_m21_t3_pm_2", position: 2, level: "medium", title: "Pipeline",
    scenario: "A sales deal moving through stages is modeled as…",
    options: ["A pipeline-stage State machine (enables forecasting)", "A boolean won/lost", "A free-text note", "A counter"], correct: "A pipeline-stage State machine (enables forecasting)",
    explanation: "Opportunity stages + transition history drive funnel analytics and forecasting." }),
  pm({ topicId: "sysd_m21_t3", exerciseId: "sysd_m21_t3_pm_3", position: 3, level: "medium", title: "Many businesses",
    scenario: "Thousands of companies on one CRM platform requires…",
    options: ["Multi-tenancy with strict tenant data isolation", "One shared dataset", "A copy per company manually", "No isolation"], correct: "Multi-tenancy with strict tenant data isolation",
    explanation: "It's a multi-tenant SaaS; every query is scoped to the org (the multi-tenant-SaaS design)." }),
  // News aggregator
  pm({ topicId: "sysd_m21_t4", exerciseId: "sysd_m21_t4_pm_1", position: 1, level: "hard", title: "The crux",
    scenario: "The hardest part of a news aggregator is…",
    options: ["Clustering the same story reported by many outlets into one (dedup via similarity)", "Storing articles", "Showing a list", "Counting words"], correct: "Clustering the same story reported by many outlets into one (dedup via similarity)",
    explanation: "Near-duplicate clustering (text similarity) turns 50 versions of a story into one coherent entry." }),
  pm({ topicId: "sysd_m21_t4", exerciseId: "sysd_m21_t4_pm_2", position: 2, level: "medium", title: "Ingestion",
    scenario: "Pulling from thousands of feeds efficiently uses…",
    options: ["Scheduled polling with conditional GETs/ETags + rate limits", "Re-downloading every feed every second", "Manual entry", "A single fetch at launch"], correct: "Scheduled polling with conditional GETs/ETags + rate limits",
    explanation: "Poll on a schedule, skip unchanged feeds (ETags), and respect source rate limits/politeness." }),
  pm({ topicId: "sysd_m21_t4", exerciseId: "sysd_m21_t4_pm_3", position: 3, level: "medium", title: "Ranking",
    scenario: "The feed is ranked by…",
    options: ["Freshness + popularity + source quality + personalization", "Alphabetical order", "Source name", "Random"], correct: "Freshness + popularity + source quality + personalization",
    explanation: "Combine time-decay, trending, credibility, and user interests (hot-ranking + recommender ideas)." }),
  // Photo storage
  pm({ topicId: "sysd_m21_t5", exerciseId: "sysd_m21_t5_pm_1", position: 1, level: "hard", title: "Content search",
    scenario: "Searching photos by content ('beach', 'dog') without manual tags uses…",
    options: ["Async ML vision tagging/face clustering → a searchable index", "Filename matching", "EXIF date only", "Manual tags required"], correct: "Async ML vision tagging/face clustering → a searchable index",
    explanation: "Vision models label objects/scenes/faces on upload; an index (labels/embeddings) enables content search." }),
  pm({ topicId: "sysd_m21_t5", exerciseId: "sysd_m21_t5_pm_2", position: 2, level: "medium", title: "Fast viewing",
    scenario: "Browsing thousands of photos quickly is enabled by…",
    options: ["Pre-generated thumbnail/preview tiers served via CDN", "Sending full-resolution originals", "A database BLOB per view", "Re-uploading"], correct: "Pre-generated thumbnail/preview tiers served via CDN",
    explanation: "Thumbnails (async-generated) + CDN make the gallery instant; originals fetched only on full view." }),
  pm({ topicId: "sysd_m21_t5", exerciseId: "sysd_m21_t5_pm_3", position: 3, level: "medium", title: "Save space",
    scenario: "Identical photos uploaded/shared multiple times should be…",
    options: ["Deduplicated by content hash (stored once)", "Stored every time", "Compressed only", "Deleted"], correct: "Deduplicated by content hash (stored once)",
    explanation: "Content-hash dedup stores the same bytes once — big savings at billions of photos." }),
  // Supply chain
  pm({ topicId: "sysd_m21_t6", exerciseId: "sysd_m21_t6_pm_1", position: 1, level: "hard", title: "Data model",
    scenario: "Track-and-trace is best modeled as…",
    options: ["An append-only event stream (location/provenance derived) — event sourcing", "A single 'current location' field", "A nightly snapshot", "A cache"], correct: "An append-only event stream (location/provenance derived) — event sourcing",
    explanation: "Each scan/handoff is an immutable event; current state + full history derive from the log." }),
  pm({ topicId: "sysd_m21_t6", exerciseId: "sysd_m21_t6_pm_2", position: 2, level: "hard", title: "Cross-org trust",
    scenario: "Proving provenance across many untrusting organizations needs…",
    options: ["Tamper-evident shared data (signed/audit ledger or blockchain)", "Each org's private spreadsheet", "Trusting everyone", "A single company's database only"], correct: "Tamper-evident shared data (signed/audit ledger or blockchain)",
    explanation: "Cross-org provenance requires tamper-evidence so no party can forge history (audit ledger / permissioned blockchain)." }),
  pm({ topicId: "sysd_m21_t6", exerciseId: "sysd_m21_t6_pm_3", position: 3, level: "medium", title: "Recall",
    scenario: "A recall query ('which units came from batch Z?') is answered by…",
    options: ["Tracing the event log forward/backward by batch/lot ids", "Guessing", "Checking only current locations", "A full re-scan"], correct: "Tracing the event log forward/backward by batch/lot ids",
    explanation: "The event history + hierarchical ids enable forward/backward trace for recalls." }),
  // Insurance claims
  pm({ topicId: "sysd_m21_t7", exerciseId: "sysd_m21_t7_pm_1", position: 1, level: "medium", title: "Why a workflow",
    scenario: "Claims processing is modeled as…",
    options: ["A durable long-running workflow (persisted state, external waits)", "A single synchronous request", "A cron job", "A cache lookup"], correct: "A durable long-running workflow (persisted state, external waits)",
    explanation: "It spans days/weeks with external waits; a durable workflow persists state and resumes across steps." }),
  pm({ topicId: "sysd_m21_t7", exerciseId: "sysd_m21_t7_pm_2", position: 2, level: "hard", title: "Automate vs human",
    scenario: "The key efficiency lever is…",
    options: ["Straight-through auto-processing for clear cases; humans for complex/suspicious ones", "Humans handle everything", "Automate everything blindly", "Reject all claims"], correct: "Straight-through auto-processing for clear cases; humans for complex/suspicious ones",
    explanation: "Triage routes simple claims to automation and complex/suspicious ones to adjusters (human-in-the-loop)." }),
  pm({ topicId: "sysd_m21_t7", exerciseId: "sysd_m21_t7_pm_3", position: 3, level: "medium", title: "Fraud + payout",
    scenario: "Claims include a fraud-scoring stage and pay approved claims via…",
    options: ["A ledger (auditable, accurate money), with reserves when the claim opens", "A mutable balance field", "Cash", "No tracking"], correct: "A ledger (auditable, accurate money), with reserves when the claim opens",
    explanation: "Fraud scoring routes suspicious claims; payouts use the ledger discipline (auditable, reserve liability)." }),
  // Crowdfunding
  pm({ topicId: "sysd_m21_t8", exerciseId: "sysd_m21_t8_pm_1", position: 1, level: "hard", title: "All-or-nothing",
    scenario: "In all-or-nothing crowdfunding, backers are charged…",
    options: ["Only at the deadline IF the goal is met (authorize on pledge, capture later)", "Immediately on pledge", "Never", "Monthly"], correct: "Only at the deadline IF the goal is met (authorize on pledge, capture later)",
    explanation: "Deferred/conditional capture: authorize pledges, capture them at the deadline only if the goal is reached." }),
  pm({ topicId: "sysd_m21_t8", exerciseId: "sysd_m21_t8_pm_2", position: 2, level: "hard", title: "Running total",
    scenario: "The pledge total (which determines success) must be…",
    options: ["Updated atomically (hot counter) for accuracy under concurrency", "Estimated", "Computed nightly", "Ignored"], correct: "Updated atomically (hot counter) for accuracy under concurrency",
    explanation: "The total decides success/failure and what's charged, so it must be accurate (atomic increments)." }),
  pm({ topicId: "sysd_m21_t8", exerciseId: "sysd_m21_t8_pm_3", position: 3, level: "medium", title: "At capture",
    scenario: "When capturing pledges at a successful deadline, you must handle…",
    options: ["Cards that decline at capture time (retry; funded amount may dip)", "Nothing — all cards always work", "Refunding everyone", "Re-running the campaign"], correct: "Cards that decline at capture time (retry; funded amount may dip)",
    explanation: "A backer's card can decline at capture (it wasn't charged at pledge); retry/dunning, and the funded total may reduce." }),
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
  console.log(`\nDone — M21 Case Studies XV seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
