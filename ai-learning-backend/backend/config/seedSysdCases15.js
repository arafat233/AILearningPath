/**
 * Seed — System Design module M20: Case Studies XIV (domain platforms):
 * Online Learning Platform, Plagiarism Detection, Credit Scoring, Stock Market
 * Data Feed, Last-Mile Routing, Loyalty/Rewards, KYC/Identity Verification,
 * Sportsbook/Live Betting. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases15.js   ·   npm: npm run seed:sysd-cases15
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m20";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 20,
  name: "Case Studies XIV — Domain Platforms", slug: "case-studies-14",
  description: "Eight more domain-specific large-scale designs: an online learning platform, plagiarism detection, credit scoring, a stock-market data feed, last-mile delivery routing, a loyalty/rewards system, KYC/identity verification, and a sportsbook.",
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
  T("sysd_m20_t1", 1, "Design an Online Learning Platform", "design-online-learning",
    ["case-study", "video", "progress", "scale"],
    "Build Coursera/Udemy: host courses (video lessons, quizzes), serve millions of learners with smooth video, track each learner's progress, and grade assessments. What carries the video at scale, and how is progress stored?",
    "Course content (videos transcoded to a bitrate ladder) is delivered via CDN with adaptive bitrate (read-heavy, cacheable — the streaming design); metadata (courses, lessons, enrollments) in databases. Per-learner PROGRESS (completed lessons, position, quiz scores) is high-write per-user state. QUIZZES auto-grade (objective) or use peer/async grading (subjective). It composes video streaming + progress tracking + assessment.",
    [
      { kind: "concept", heading: "Content delivery",
        body: "The bulk of an e-learning platform is VIDEO. Pre-transcode lessons into a bitrate ladder, store in object storage, and deliver via CDN with ADAPTIVE BITRATE streaming (HLS/DASH — the video-streaming design) for smooth playback on any connection. Course content is largely STATIC and read-heavy (watched far more than uploaded) → heavily CDN-cached. Documents/slides also via CDN. This makes video delivery scale to millions of concurrent learners." },
      { kind: "concept", heading: "Catalog & enrollment",
        body: "METADATA — courses, modules, lessons, instructors, and ENROLLMENTS (who's taking what) — lives in databases (relational for the structured catalog + enrollments; caches for hot course pages). Search/discovery uses an inverted index (the search design). This is the structured-data backbone separate from the heavy video bytes." },
      { kind: "concept", heading: "Progress tracking",
        body: "Each learner has PROGRESS state: lessons completed, current video position (resume where you left off), quiz attempts/scores, certificates earned. This is per-user, WRITE-heavy (frequent position/completion updates as people watch) — store keyed by (user, course) in a fast store; batch/throttle position updates (don't write every second). Progress drives the dashboard, resume, and completion/certificates." },
      { kind: "concept", heading: "Assessments & follow-ups",
        body: "QUIZZES: objective questions (MCQ) AUTO-GRADE instantly; programming assignments use a sandboxed judge (the code-judge design); subjective work uses PEER GRADING or async instructor grading. Certificates issue on completion. Follow-ups: 'live classes (the conferencing design)', 'discussion forums (Q&A design)', 'recommendations (next course)', 'DRM for paid content', 'spikes when a course launches'. Signal: CDN-delivered adaptive video (read-heavy, cacheable) + catalog/enrollment DBs + per-user write-heavy progress (throttled) + auto/peer-graded assessments; composes streaming + progress + judge designs.",
      },
    ],
    "An online learning platform tests composing CDN-delivered adaptive video (read-heavy, cacheable), catalog/enrollment databases, per-user write-heavy progress tracking (throttled position/completion updates), and assessments (auto-graded MCQ, sandboxed code judge, peer grading). It reuses the video-streaming, search, and code-judge designs.",
    ["Serving video from origin instead of CDN adaptive-bitrate (the bulk of the load).",
     "Writing progress on every second of playback instead of throttling/batching updates.",
     "Assuming all assessments auto-grade — subjective work needs peer/async grading."],
    0.5, { type: "Learning platform", description: "Videos → transcode ladder → CDN (adaptive bitrate, read-heavy/cacheable). Catalog/enrollments in DBs (+search). Per-user progress (completed lessons, position, scores) write-heavy → fast store, throttled. Quizzes auto-grade; code via sandbox judge; subjective via peer grading.", alt: "Online learning platform: CDN video, catalog DBs, throttled progress tracking, and graded assessments." }),

  T("sysd_m20_t2", 2, "Design a Plagiarism Detection System", "design-plagiarism-detection",
    ["case-study", "fingerprinting", "similarity", "indexing"],
    "Build a system that detects copied content across a huge corpus of documents (student papers, code, web). Comparing every pair of documents is O(n²) and exact-match misses paraphrasing. What makes similarity detection scalable?",
    "FINGERPRINT each document into a set of hashes of overlapping token sequences (k-grams/shingles), reduced via WINSNOWING / MinHash so similar docs share fingerprints. Build an INVERTED INDEX (fingerprint → documents) so checking a doc looks up only documents sharing fingerprints — avoiding O(n²). Similarity = shared-fingerprint overlap (Jaccard). Catches partial/reordered copying; for code, normalize first (tokens, not whitespace).",
    [
      { kind: "concept", heading: "Why exact match / all-pairs fails",
        body: "Naive plagiarism detection has two problems: comparing EVERY document pair is O(n²) (intractable for millions of docs), and EXACT string matching misses paraphrasing, reordering, or partial copying. You need (1) a way to detect PARTIAL/fuzzy overlap and (2) a way to avoid all-pairs comparison. Fingerprinting + indexing solves both." },
      { kind: "concept", heading: "Fingerprinting (k-grams + selection)",
        body: "Break each document into overlapping K-GRAMS (shingles) — sequences of k consecutive tokens/words — and HASH each. Two documents sharing many k-gram hashes have copied passages, even if the rest differs (catches partial copying). To bound the number of fingerprints stored, SELECT a subset deterministically (WINNOWING — keep the min hash in each window) or use MinHash; this keeps fingerprints comparable while shrinking storage. The fingerprint SET represents the document's content." },
      { kind: "concept", heading: "Inverted index → avoid O(n²)",
        body: "Build an INVERTED INDEX mapping each fingerprint → the documents containing it (the search-engine structure). To check a document, look up its fingerprints in the index and find which OTHER documents share many of them — examining only candidates with overlap, not all documents. This turns O(n²) all-pairs into index lookups. SIMILARITY between two docs = overlap of their fingerprint sets (Jaccard similarity), highlighting the matched passages." },
      { kind: "concept", heading: "Normalization, sources & follow-ups",
        body: "NORMALIZE before fingerprinting to defeat trivial obfuscation: lowercase, strip punctuation/whitespace; for CODE, tokenize and normalize identifiers/formatting (compare structure, not variable names — defeats rename-based copying). Compare against multiple SOURCES (the submission corpus + web/crawl + prior years). Follow-ups: 'paraphrase/AI-generated detection (semantic embeddings — the vector-DB design)', 'thresholds + human review (false positives)', 'incremental indexing'. Signal: k-gram fingerprints (winnowing/MinHash) + inverted index (avoid O(n²)) + Jaccard similarity on shared fingerprints + normalization (esp. code) to catch partial/reordered copying.",
      },
    ],
    "Plagiarism detection tests scalable fuzzy similarity: fingerprint documents into k-gram hash sets (winnowing/MinHash), index fingerprint→documents (inverted index) to avoid O(n²) all-pairs, and score similarity by shared-fingerprint overlap (Jaccard) — catching partial/reordered copying. Normalization (especially for code) defeats trivial obfuscation; semantic embeddings catch paraphrase.",
    ["Comparing all document pairs (O(n²)) instead of fingerprint + inverted-index lookup.",
     "Exact-match only — missing partial/reordered/paraphrased copying (need k-gram fingerprints).",
     "Not normalizing (esp. code: compare tokens/structure, not whitespace/variable names)."],
    0.6, { type: "Plagiarism detection", description: "Doc → k-gram (shingle) hashes → select subset (winnowing/MinHash) = fingerprint set. Inverted index: fingerprint → docs. Check a doc by looking up its fingerprints → candidates sharing many → Jaccard similarity (highlight passages). Normalize (esp. code) first.", alt: "Plagiarism detection: k-gram fingerprints indexed for fast shared-overlap similarity." }),

  T("sysd_m20_t3", 3, "Design a Credit Scoring System", "design-credit-scoring",
    ["case-study", "data-aggregation", "ml", "decisioning"],
    "Build a system that decides whether to approve a loan/credit and at what terms, by scoring an applicant's creditworthiness. What data feeds the score, and why must the decision be explainable and consistent?",
    "AGGREGATE data about the applicant (credit bureau history, income, existing debts, transaction behavior) into FEATURES, score them with a model (the feature-store + ML-serving designs) producing a risk score, then a DECISIONING layer (rules + thresholds) approves/declines/sets terms. Crucially the decision must be EXPLAINABLE (regulation: reasons for denial), AUDITABLE, fair (no illegal bias), and reproducible. It's data aggregation + scoring + governed decisioning.",
    [
      { kind: "concept", heading: "Data aggregation → features",
        body: "Credit scoring starts by gathering data about the applicant from many sources: credit BUREAU reports (payment history, existing accounts, defaults), declared/verified INCOME, existing DEBT, and behavioral/transaction signals (for alternative scoring). Aggregate and transform these into FEATURES (the feature-store design — consistent features for training and scoring). Data quality + completeness directly drive score accuracy." },
      { kind: "concept", heading: "Scoring model",
        body: "A MODEL (traditional scorecards / logistic regression, or ML — served via the ML-serving design) computes a risk score / probability of default from the features. Models are trained offline on historical outcomes (who repaid vs defaulted) and must be MONITORED for drift (the MLOps design — the population shifts). The score quantifies creditworthiness but isn't the final answer by itself." },
      { kind: "concept", heading: "Decisioning + explainability (the crux)",
        body: "A DECISIONING layer turns the score into an action: approve/decline, credit limit, interest rate — via business RULES + thresholds + policy (and possibly manual review for edge cases). Critically, credit decisions are REGULATED: you must be able to EXPLAIN a decision (give specific reasons for a denial — adverse action notices), prove the model doesn't use prohibited attributes or proxy-discriminate (FAIRNESS), and keep an AUDIT trail. So interpretability/explainability and governance are first-class, not optional — distinguishing this from a generic ML system." },
      { kind: "concept", heading: "Consistency, real-time & follow-ups",
        body: "Decisions must be REPRODUCIBLE/consistent (same inputs → same decision; version the model + rules — MLOps). Scoring may be real-time (instant approval at application) or batch (portfolio re-scoring). Follow-ups: 'explainable AI (SHAP / reason codes)', 'bias detection & fairness constraints', 'fraud check integration (the fraud design)', 'feedback loop on actual repayment to retrain', 'alternative data scoring'. Signal: aggregate data → features → model risk score → governed decisioning (rules/thresholds) with EXPLAINABILITY + fairness + auditability + reproducibility (regulated); composes feature-store + ML-serving + MLOps.",
      },
    ],
    "Credit scoring tests data aggregation → features → a risk-scoring model → a governed decisioning layer (rules/thresholds), where the distinguishing requirements are EXPLAINABILITY (regulated reasons for denial), fairness (no prohibited/proxy bias), auditability, and reproducibility (versioned model + rules). It composes the feature-store, ML-serving, and MLOps designs.",
    ["Treating it as a black-box ML score without explainability/reason codes (regulated decisions need them).",
     "Ignoring fairness/bias and auditability/reproducibility (versioned model + rules).",
     "No feedback loop on actual repayment outcomes / drift monitoring."],
    0.6, { type: "Credit scoring", description: "Sources (bureau/income/debt/behavior) → aggregate → features (feature store) → risk-scoring model (offline-trained, drift-monitored) → decisioning (rules/thresholds → approve/decline/terms). Explainable (reason codes), fair, auditable, reproducible (versioned). Repayment feeds back.", alt: "Credit scoring: data aggregation, a risk model, and governed, explainable decisioning." }),

  T("sysd_m20_t4", 4, "Design a Stock Market Data Feed", "design-market-data-feed",
    ["case-study", "fan-out", "low-latency", "real-time"],
    "Build the system that distributes real-time market data (quotes, trades) from exchanges to millions of clients (trading apps, dashboards) with minimal latency. The exchange firehose is enormous — how do you fan it out fast?",
    "Ingest the exchange's high-rate feed, then FAN OUT updates to millions of subscribers via a pub/sub layer + streaming connections (WebSocket) over many edge/gateway servers (read-heavy broadcast). For latency: conflate/throttle per client (don't send every tick to a phone), keep the latest price in memory, and let low-latency clients subscribe to raw feeds. Subscriptions are per-symbol; it's a massive real-time fan-out problem.",
    [
      { kind: "concept", heading: "The firehose + fan-out",
        body: "Exchanges emit an enormous, high-frequency stream of market data (every quote change and trade across thousands of symbols — potentially millions of messages/sec). The system's job is to DISTRIBUTE this to many consumers (trading apps, charts, algos, dashboards) in real time. This is fundamentally a read-heavy BROADCAST / FAN-OUT problem: one source, millions of subscribers (the live-feed/brokerage pattern at extreme rate)." },
      { kind: "concept", heading: "Distribution architecture",
        body: "Ingest the exchange feed at gateway(s), then propagate through a PUB/SUB backbone to a fleet of edge/gateway servers holding clients' STREAMING connections (WebSocket / multicast for internal low-latency). Clients SUBSCRIBE to specific symbols (you only push what each client watches, not everything). Keep the LATEST price/quote per symbol in memory (a fast in-memory store) so new subscribers get an immediate snapshot, then deltas. Horizontal scale of the edge tier handles millions of connections." },
      { kind: "concept", heading: "Latency & conflation",
        body: "Latency is the differentiator. A phone app doesn't need every microsecond tick (and can't render them) — CONFLATE/throttle updates per client (e.g. send the latest value every 100ms), drastically cutting bandwidth and load. Conversely, low-latency professional clients subscribe to RAW, uncon­flated feeds (and may colocate). So offer tiered delivery: conflated for retail, raw for pros. Use efficient binary encoding and avoid unnecessary hops." },
      { kind: "concept", heading: "Ordering, reliability & follow-ups",
        body: "Market data needs correct per-symbol ORDERING (updates applied in sequence — sequence numbers detect gaps; clients can request a snapshot to recover after a gap). It's typically best-effort/at-most-latest (you want the freshest, not every historical tick re-sent). Follow-ups: 'snapshot + incremental (recover from gaps)', 'multicast for internal distribution', 'historical/tick storage (the TSDB design)', 'fair distribution (no client gets data first)'. Signal: ingest firehose → pub/sub fan-out to edge WebSocket servers (per-symbol subscriptions) + latest-in-memory snapshots + per-client conflation (retail) vs raw (pros) + sequence numbers for ordering/gap recovery; massive real-time broadcast.",
      },
    ],
    "A market data feed tests massive real-time fan-out: ingest the exchange firehose, broadcast via pub/sub to edge WebSocket servers with per-symbol subscriptions, keep latest-in-memory snapshots, and conflate/throttle per client (retail) vs raw feeds (pros), with sequence numbers for per-symbol ordering and gap recovery. It's the live-feed/brokerage pattern at extreme rate, latency-dominated.",
    ["Pushing every tick to every client instead of per-symbol subscriptions + conflation for retail.",
     "Serving from a single source instead of pub/sub fan-out across edge servers.",
     "Ignoring per-symbol ordering / gap recovery (sequence numbers + snapshots)."],
    0.6, { type: "Market data fan-out", description: "Exchange firehose → ingest → pub/sub backbone → edge WebSocket servers (per-symbol subscriptions) → millions of clients. Latest price in memory (snapshot on subscribe). Conflate/throttle per retail client; raw feed for pros. Sequence numbers → ordering + gap recovery.", alt: "Stock market data feed: firehose ingested and fanned out via pub/sub to edge servers with conflation." }),

  T("sysd_m20_t5", 5, "Design Last-Mile Delivery Routing", "design-last-mile-routing",
    ["case-study", "routing", "optimization", "real-time"],
    "Build the routing system for delivery (packages, food, groceries): assign orders to drivers and compute efficient routes for multiple stops, adapting to real-time conditions. Why is this computationally hard, and how do you make it practical?",
    "Assigning many stops to drivers and ordering each driver's stops is the VEHICLE ROUTING PROBLEM (VRP) — NP-hard, so use HEURISTICS / approximation (nearest-neighbor + 2-opt, or metaheuristics) plus constraints (time windows, capacity). Compute travel times from a road graph (the Maps design); ETAs from live traffic. Re-optimize as orders/conditions change. Real-time tracking + dispatch round it out. It's optimization under constraints + geo + real-time adaptation.",
    [
      { kind: "concept", heading: "The core: it's the VRP",
        body: "Last-mile routing is the VEHICLE ROUTING PROBLEM (VRP) — assign a set of delivery STOPS to vehicles/drivers and determine the ORDER each visits its stops to minimize total time/distance/cost. It generalizes the Traveling Salesman Problem and is NP-HARD — you can't find the exact optimum for many stops in reasonable time. Plus real-world CONSTRAINTS: delivery time windows, vehicle capacity, driver shifts, pickup-before-dropoff. Recognizing it as a constrained VRP is the key framing." },
      { kind: "concept", heading: "Heuristics & approximation",
        body: "Since exact VRP is intractable at scale, use HEURISTICS / approximation: construction heuristics (nearest-neighbor, savings algorithm) for an initial route, then local-search improvement (2-opt / or-opt swaps) and metaheuristics (simulated annealing, genetic, OR-Tools solvers) to refine within a time budget. The goal is a GOOD route fast, not the perfect one. Travel times between stops come from a road-graph / Maps service (the routing design), not straight-line distance." },
      { kind: "concept", heading: "Assignment / dispatch",
        body: "Beyond ordering one driver's stops, you must ASSIGN orders to drivers — batching nearby orders to the same driver (and, for food/grocery, matching against the proximity/dispatch idea: nearest available driver, accounting for prep time). This dispatch + batching decision interacts with routing (which orders together, in what order). Real-time: new orders arrive continuously, so assignment is ongoing, not one-shot." },
      { kind: "concept", heading: "Real-time adaptation & follow-ups",
        body: "Conditions change: traffic, new orders, a delayed/failed delivery, a driver going offline. So RE-OPTIMIZE routes dynamically (recompute affected routes incrementally) and recompute ETAs from LIVE traffic. Customers get real-time tracking (the live-location design); drivers get turn-by-turn nav. Follow-ups: 'ETA accuracy', 'batching trade-offs (efficiency vs speed)', 'capacity/time-window constraints', 'surge/driver supply'. Signal: model as a constrained VRP (NP-hard → heuristics/approximation within a time budget) + travel times from a road graph + order-to-driver assignment/batching + real-time re-optimization & ETAs; optimization + geo + real-time.",
      },
    ],
    "Last-mile routing tests recognizing the constrained Vehicle Routing Problem (NP-hard → heuristics/approximation within a time budget, not exact optimum), using road-graph travel times (the Maps design), order-to-driver assignment/batching, and real-time re-optimization + live-traffic ETAs. It's optimization under constraints combined with geo and real-time adaptation.",
    ["Not recognizing it as an NP-hard VRP — expecting an exact optimal multi-stop route.",
     "Using straight-line distance instead of road-graph travel times (and live traffic for ETAs).",
     "One-shot static routing instead of real-time re-optimization as orders/conditions change."],
    0.6, { type: "Routing", description: "Stops + constraints (time windows, capacity) = constrained VRP (NP-hard). Assign orders to drivers (batch nearby) → build routes via heuristics (nearest-neighbor + 2-opt / solver) within a time budget, using road-graph travel times. Re-optimize + recompute ETAs on new orders/traffic.", alt: "Last-mile routing: a constrained VRP solved heuristically over a road graph, re-optimized in real time." }),

  T("sysd_m20_t6", 6, "Design a Loyalty / Rewards System", "design-loyalty-rewards",
    ["case-study", "ledger", "ledger", "consistency"],
    "Build a points/rewards system: users EARN points on purchases and BURN them on redemptions, with tiers and expiry, and the balance must always be correct (no negative, no lost points) under concurrency. What's the right model?",
    "Model points like money: an append-only LEDGER of EARN and BURN transactions; balance is derived (or a maintained running total). Redemptions atomically check sufficient balance (no negative) — the wallet/double-entry discipline. Handle EXPIRY (points expire FIFO — oldest first), TIERS (status from activity), and idempotency (don't double-credit). Earn is often async (after purchase settles); accuracy is paramount.",
    [
      { kind: "concept", heading: "Points are money — use a ledger",
        body: "The core insight: loyalty points are essentially a CURRENCY, so model them like the digital-wallet design — an append-only LEDGER of transactions (EARN +points, BURN −points, ADJUST, EXPIRE) rather than a mutable balance field. Balance = sum of ledger entries (or a maintained running total reconciled against the ledger). This gives an audit trail, prevents lost-update bugs, and makes corrections explicit (a compensating entry, never editing history)." },
      { kind: "concept", heading: "Earn / burn correctness",
        body: "EARNING is usually triggered by a qualifying event (purchase) and is often ASYNC — credit points only after the purchase SETTLES (and reverse them on a refund/chargeback — a compensating entry). Make earning IDEMPOTENT (a retried purchase event mustn't double-credit — key by transaction id). BURNING (redemption) must ATOMICALLY check sufficient balance and deduct — under concurrency, two redemptions can't both spend the same points (no negative balance), the same atomic-guard discipline as the wallet." },
      { kind: "concept", heading: "Expiry & tiers",
        body: "EXPIRY: points typically expire after a period; the standard rule is FIFO — oldest points are spent/expire first. Track points in dated lots (or compute expiry from earn dates) so you can expire the right ones and burn oldest-first. TIERS (Silver/Gold) are derived from activity (spend/points over a window) and grant benefits — recompute on relevant events. These rules layer on top of the ledger." },
      { kind: "concept", heading: "Scale & follow-ups",
        body: "Accuracy and consistency dominate (it's money-like — users notice missing points and exploit double-credits). Reconcile the ledger against the source-of-truth (orders) periodically. Follow-ups: 'promotions / bonus multipliers (a rules/strategy engine — the coupon design)', 'partner points / transfers', 'fraud (gaming earn rules)', 'real-time balance display (cache)', 'high-volume earn events (sale day)'. Signal: append-only points ledger (balance derived) + idempotent async earn (reverse on refund) + atomic burn (no negative) + FIFO expiry + activity-derived tiers; correctness/consistency paramount.",
      },
    ],
    "A loyalty system tests treating points as money: an append-only ledger (balance derived, audit trail), idempotent async earn (credited on settle, reversed on refund), atomic burn (no negative balance under concurrency), FIFO expiry, and activity-derived tiers. Accuracy/consistency dominate — it reuses the digital-wallet/double-entry discipline.",
    ["A mutable balance field instead of an append-only ledger (lost updates, no audit trail).",
     "Non-idempotent earn (double-crediting retries) or non-atomic burn (negative balance / double-spend).",
     "Ignoring FIFO expiry and reversing points on refunds/chargebacks."],
    0.5, { type: "Loyalty ledger", description: "Points = currency → append-only ledger (EARN/BURN/EXPIRE/ADJUST); balance derived. Earn: async on purchase settle, idempotent, reversed on refund. Burn: atomic balance check (no negative). Expire FIFO (oldest first). Tiers from activity. Reconcile vs orders.", alt: "Loyalty/rewards: an append-only points ledger with idempotent earn, atomic burn, and FIFO expiry." }),

  T("sysd_m20_t7", 7, "Design a KYC / Identity Verification Pipeline", "design-kyc-identity",
    ["case-study", "verification", "async", "compliance"],
    "Build 'Know Your Customer' identity verification for onboarding (fintech/banking): verify a user's identity from documents + selfie + data checks, decide pass/fail/review, and stay compliant. Why is this an async pipeline, and what's the human role?",
    "An async PIPELINE of checks: document verification (is the ID real/unaltered — OCR + forgery detection), BIOMETRIC match (selfie ↔ ID photo — liveness + face match), and data checks (sanctions/PEP/watchlist screening, address/identity database lookups). Each is slow / uses third-party providers, so it's async (submit → process → decision). A RISK decision routes pass/fail/MANUAL REVIEW. Audit everything (regulated).",
    [
      { kind: "concept", heading: "The checks",
        body: "KYC verifies a person is who they claim, combining several CHECKS: DOCUMENT verification (extract data via OCR, detect tampering/forgery, validate the ID is genuine), BIOMETRIC verification (a selfie matched to the ID photo + LIVENESS detection to defeat photos/masks), and DATA/screening checks — sanctions lists, PEP (politically exposed persons), AML watchlists, and identity/address database lookups. Each addresses a different fraud/compliance angle; together they establish identity + eligibility." },
      { kind: "concept", heading: "Why an async pipeline",
        body: "These checks are SLOW (OCR + ML forgery detection, face matching, external watchlist/data-provider API calls that can take seconds to minutes), and rely on THIRD-PARTY providers (document vendors, biometric, screening services). So verification is an ASYNCHRONOUS PIPELINE: the user SUBMITS documents/selfie → the system runs the checks (often in parallel, via a workflow/queue — the workflow-engine design) → produces a result later (notify the user). The submission returns immediately with a 'pending' status." },
      { kind: "concept", heading: "Decisioning + human review",
        body: "Each check yields a signal; a DECISIONING layer combines them into APPROVE / REJECT / MANUAL REVIEW (using thresholds + rules — like the fraud/credit designs). Clear passes auto-approve, clear fails reject, but AMBIGUOUS cases (low-confidence match, a possible watchlist hit) go to a HUMAN reviewer queue (prioritized) — the human-in-the-loop pattern, since wrongly rejecting real users or approving fraud both have serious costs (the false-positive/false-negative trade). Reviewers see the evidence and decide." },
      { kind: "concept", heading: "Compliance & follow-ups",
        body: "KYC is heavily REGULATED: keep an immutable AUDIT trail of what was checked and why a decision was made (the audit-log design), handle PII securely (encryption, the PII/secrets designs), and support ongoing monitoring (re-screening against updated watchlists). Follow-ups: 'document/biometric provider integration & fallback', 'fraud (synthetic identities)', 'data retention/privacy (GDPR)', 'step-up verification'. Signal: async pipeline of document + biometric + screening checks (third-party, parallel) → risk decisioning (pass/fail/REVIEW with human-in-the-loop) + audit trail + secure PII; regulated, false-positive/negative sensitive.",
      },
    ],
    "KYC tests an async verification pipeline: document (OCR + forgery), biometric (selfie↔ID + liveness), and screening (sanctions/PEP/watchlist) checks — slow, third-party, run in parallel — feeding a risk decision (pass/fail/manual review with human-in-the-loop), with an immutable audit trail and secure PII (regulated). It reuses the workflow, fraud, audit-log, and PII designs.",
    ["Treating it as a synchronous single check instead of an async multi-provider pipeline.",
     "Fully auto-deciding without a human-review queue for ambiguous cases (FP/FN costs are high).",
     "No audit trail / insecure PII handling (it's heavily regulated)."],
    0.6, { type: "KYC pipeline", description: "Submit (docs + selfie) → async pipeline (parallel): document verify (OCR + forgery) + biometric (face match + liveness) + screening (sanctions/PEP/watchlist). Combine signals → decision: approve / reject / MANUAL REVIEW (human-in-the-loop). Immutable audit; PII encrypted.", alt: "KYC: async document/biometric/screening checks feeding a risk decision with human review." }),

  T("sysd_m20_t8", 8, "Design a Sportsbook / Live Betting Platform", "design-sportsbook",
    ["case-study", "real-time", "odds", "settlement"],
    "Build a sports betting platform: publish live ODDS, accept bets (including in-play), update odds in real time as events unfold, and settle bets when results are final — handling money correctly. What's the core risk, and how is correctness ensured?",
    "An ODDS engine sets/updates prices in real time (from event data + risk/exposure models); bets are placed against the CURRENT odds, validated atomically (balance, odds still valid, limits) and recorded immutably with the odds AT PLACEMENT. Live odds fan out to clients (real-time broadcast). On a final result, SETTLEMENT pays winners via a ledger (wallet discipline). The core risk is stale-odds/race exploitation and money correctness.",
    [
      { kind: "concept", heading: "Odds engine",
        body: "The heart is the ODDS engine: it sets prices (odds) for outcomes and UPDATES them continuously — pre-match from models, and live/in-play from real-time event data (score, time) plus the book's RISK/EXPOSURE (adjust odds to balance liability across outcomes so the book profits regardless). Odds change fast during live events. These odds drive everything: what's offered, what bets pay, and the book's risk." },
      { kind: "concept", heading: "Placing a bet (the race risk)",
        body: "A bet is placed against the CURRENT odds for an outcome with a stake. The critical risk: odds CHANGE between when a user sees them and when they submit — and a savvy bettor (or one with faster data) could exploit STALE odds. So placement validates ATOMICALLY: the odds are still valid (within tolerance, or the bet is rejected/re-quoted), the user has sufficient balance, and bet/market limits aren't exceeded — then records the bet IMMUTABLY with the odds AT PLACEMENT (so settlement uses the locked-in price). Suspend a market when odds are mid-update or an event moment is uncertain (e.g. a goal)." },
      { kind: "concept", heading: "Real-time distribution",
        body: "Live odds + event updates must reach many clients FAST (a real-time BROADCAST / fan-out problem — the market-data-feed pattern): push odds changes via pub/sub + WebSocket to all viewers of a market. Latency matters (stale odds shown = exploitable + bad UX). The system also ingests real-time SPORTS DATA feeds (scores/events) that drive both odds and settlement." },
      { kind: "concept", heading: "Settlement & follow-ups",
        body: "When an event reaches a final RESULT, SETTLE all bets on its markets: determine winners/losers, and PAY OUT winners (stake × odds) via a double-entry LEDGER (the wallet/payment discipline — money correctness, idempotent, auditable; reserve the stake at placement). Handle voids/pushes (refund), cash-out (settle early at current odds), and disputes. Follow-ups: 'responsible gambling limits', 'fraud/bonus abuse (the fraud design)', 'regulatory compliance/geo-fencing', 'exposure management'. Signal: real-time odds engine (risk-adjusted) + atomic bet placement (validate stale odds/balance/limits, lock odds, immutable) + real-time odds fan-out + result-driven settlement via a ledger; core risks are stale-odds exploitation and money correctness.",
      },
    ],
    "A sportsbook tests real-time + money correctness: an odds engine that updates prices from event data + risk/exposure, atomic bet placement (validate odds still valid — anti-stale-odds — plus balance/limits, lock the odds, record immutably), real-time odds fan-out (market-data pattern), and result-driven settlement via a double-entry ledger. Stale-odds exploitation and money accuracy are the core risks.",
    ["Accepting bets without re-validating odds at placement (stale-odds exploitation).",
     "Mutable balances/floats instead of a double-entry ledger for stakes and payouts (money correctness).",
     "Not locking the odds-at-placement / suspending markets during odds updates or key moments."],
    0.6, { type: "Sportsbook", description: "Odds engine sets/updates prices (event data + risk/exposure). Place bet: validate odds-still-valid (anti-stale) + balance + limits → reserve stake → record immutably with odds-at-placement. Live odds fan out (pub/sub + WebSocket). Result → settle: pay winners (stake × odds) via ledger.", alt: "Sportsbook: real-time odds engine, atomic bet placement, odds fan-out, and ledger settlement." }),
];

const EXERCISES = [
  // Online learning
  pm({ topicId: "sysd_m20_t1", exerciseId: "sysd_m20_t1_pm_1", position: 1, level: "medium", title: "Video at scale",
    scenario: "Course video is delivered to millions of learners via…",
    options: ["CDN with adaptive bitrate (read-heavy, cacheable)", "Streaming from one origin server", "Email attachments", "A relational DB"], correct: "CDN with adaptive bitrate (read-heavy, cacheable)",
    explanation: "Pre-transcoded video on a CDN with adaptive bitrate scales to millions — content is static and cacheable." }),
  pm({ topicId: "sysd_m20_t1", exerciseId: "sysd_m20_t1_pm_2", position: 2, level: "medium", title: "Progress",
    scenario: "Per-learner progress (position, completion) is…",
    options: ["Write-heavy per-user state — store keyed by (user,course), throttle updates", "Computed from video each time", "Stored once at enrollment", "Not tracked"], correct: "Write-heavy per-user state — store keyed by (user,course), throttle updates",
    explanation: "Frequent position/completion writes per user; throttle/batch them and key by (user, course)." }),
  pm({ topicId: "sysd_m20_t1", exerciseId: "sysd_m20_t1_pm_3", position: 3, level: "medium", title: "Grading",
    scenario: "Assessments are graded by…",
    options: ["Auto-grade MCQ, sandboxed judge for code, peer/async for subjective", "Always manually", "Never graded", "Only auto-grade everything"], correct: "Auto-grade MCQ, sandboxed judge for code, peer/async for subjective",
    explanation: "Objective questions auto-grade; code uses a sandbox judge; subjective work uses peer/instructor grading." }),
  // Plagiarism
  pm({ topicId: "sysd_m20_t2", exerciseId: "sysd_m20_t2_pm_1", position: 1, level: "hard", title: "Avoid O(n²)",
    scenario: "Detecting copying across millions of docs without comparing every pair uses…",
    options: ["Fingerprints + an inverted index (fingerprint → docs)", "All-pairs comparison", "Sorting documents", "Exact string equality"], correct: "Fingerprints + an inverted index (fingerprint → docs)",
    explanation: "Index fingerprints so checking a doc only examines candidates that share fingerprints — not all-pairs." }),
  pm({ topicId: "sysd_m20_t2", exerciseId: "sysd_m20_t2_pm_2", position: 2, level: "hard", title: "Catch partial copying",
    scenario: "To catch partial/reordered copying (not just exact matches), fingerprint via…",
    options: ["k-grams (shingles) hashed, reduced with winnowing/MinHash", "A single hash of the whole document", "Document length", "The title"], correct: "k-grams (shingles) hashed, reduced with winnowing/MinHash",
    explanation: "Shared k-gram hashes reveal copied passages even amid different surrounding text; winnowing bounds storage." }),
  pm({ topicId: "sysd_m20_t2", exerciseId: "sysd_m20_t2_pm_3", position: 3, level: "medium", title: "Code",
    scenario: "For code plagiarism, before fingerprinting you should…",
    options: ["Normalize (tokenize; ignore whitespace/identifier names — compare structure)", "Compare raw text only", "Sort the lines", "Hash the filename"], correct: "Normalize (tokenize; ignore whitespace/identifier names — compare structure)",
    explanation: "Normalizing defeats rename/reformat obfuscation by comparing token structure, not surface text." }),
  // Credit scoring
  pm({ topicId: "sysd_m20_t3", exerciseId: "sysd_m20_t3_pm_1", position: 1, level: "hard", title: "The crux",
    scenario: "Beyond a risk score, credit decisions must be…",
    options: ["Explainable, fair (no prohibited bias), auditable, reproducible (regulated)", "As fast as possible only", "Black-box", "Random"], correct: "Explainable, fair (no prohibited bias), auditable, reproducible (regulated)",
    explanation: "Regulation requires reason codes for denials, fairness, audit trails, and reproducible (versioned) decisions." }),
  pm({ topicId: "sysd_m20_t3", exerciseId: "sysd_m20_t3_pm_2", position: 2, level: "medium", title: "Inputs",
    scenario: "The score is computed from…",
    options: ["Aggregated features (bureau history, income, debt, behavior)", "The applicant's name", "A coin flip", "The time of day"], correct: "Aggregated features (bureau history, income, debt, behavior)",
    explanation: "Data from many sources is aggregated into features (feature store) feeding the scoring model." }),
  pm({ topicId: "sysd_m20_t3", exerciseId: "sysd_m20_t3_pm_3", position: 3, level: "medium", title: "Score → action",
    scenario: "The score is turned into approve/decline/terms by…",
    options: ["A decisioning layer (rules + thresholds + policy)", "The raw score alone", "The applicant", "Random assignment"], correct: "A decisioning layer (rules + thresholds + policy)",
    explanation: "Decisioning applies business rules/thresholds (and manual review) to the score; the score isn't the final decision." }),
  // Market data feed
  pm({ topicId: "sysd_m20_t4", exerciseId: "sysd_m20_t4_pm_1", position: 1, level: "medium", title: "Core shape",
    scenario: "Distributing exchange data to millions of clients is fundamentally…",
    options: ["A real-time broadcast / fan-out problem", "A write-heavy transaction problem", "A batch job", "A search problem"], correct: "A real-time broadcast / fan-out problem",
    explanation: "One firehose source, millions of subscribers — fan out via pub/sub + streaming connections." }),
  pm({ topicId: "sysd_m20_t4", exerciseId: "sysd_m20_t4_pm_2", position: 2, level: "hard", title: "Retail latency/load",
    scenario: "A phone app doesn't need every tick. Reduce load by…",
    options: ["Conflating/throttling updates per client (latest value every N ms)", "Sending every tick anyway", "Disconnecting the client", "Batching once a day"], correct: "Conflating/throttling updates per client (latest value every N ms)",
    explanation: "Conflation sends the freshest value at intervals; pros subscribe to raw uncon­flated feeds." }),
  pm({ topicId: "sysd_m20_t4", exerciseId: "sysd_m20_t4_pm_3", position: 3, level: "medium", title: "Ordering",
    scenario: "Correct per-symbol ordering and recovery after a dropped message use…",
    options: ["Sequence numbers (detect gaps) + snapshot to recover", "Hope", "Timestamps only", "Re-sending all history"], correct: "Sequence numbers (detect gaps) + snapshot to recover",
    explanation: "Sequence numbers let clients detect gaps and request a fresh snapshot to resync." }),
  // Last-mile routing
  pm({ topicId: "sysd_m20_t5", exerciseId: "sysd_m20_t5_pm_1", position: 1, level: "hard", title: "What problem",
    scenario: "Assigning stops to drivers and ordering them is…",
    options: ["The Vehicle Routing Problem (NP-hard) — use heuristics/approximation", "Trivially solvable exactly", "A sorting problem", "A hashing problem"], correct: "The Vehicle Routing Problem (NP-hard) — use heuristics/approximation",
    explanation: "VRP generalizes TSP and is NP-hard; use heuristics/metaheuristics within a time budget for a good route." }),
  pm({ topicId: "sysd_m20_t5", exerciseId: "sysd_m20_t5_pm_2", position: 2, level: "medium", title: "Distances",
    scenario: "Travel times between stops should come from…",
    options: ["A road graph / Maps service (with live traffic for ETAs)", "Straight-line distance", "A guess", "Alphabetical order"], correct: "A road graph / Maps service (with live traffic for ETAs)",
    explanation: "Real routing uses road-network travel times (the Maps design) and live traffic for accurate ETAs." }),
  pm({ topicId: "sysd_m20_t5", exerciseId: "sysd_m20_t5_pm_3", position: 3, level: "medium", title: "Real-time",
    scenario: "As new orders arrive and traffic changes, routes are…",
    options: ["Re-optimized dynamically (and ETAs recomputed)", "Fixed once at the start of the day", "Ignored", "Randomized"], correct: "Re-optimized dynamically (and ETAs recomputed)",
    explanation: "Conditions change continuously; recompute affected routes and ETAs in real time." }),
  // Loyalty
  pm({ topicId: "sysd_m20_t6", exerciseId: "sysd_m20_t6_pm_1", position: 1, level: "hard", title: "Model points",
    scenario: "Points balances should be modelled as…",
    options: ["An append-only ledger (earn/burn entries); balance derived", "A mutable integer field", "A float", "A cache only"], correct: "An append-only ledger (earn/burn entries); balance derived",
    explanation: "Points are money-like; a ledger gives an audit trail and avoids lost-update bugs (the wallet discipline)." }),
  pm({ topicId: "sysd_m20_t6", exerciseId: "sysd_m20_t6_pm_2", position: 2, level: "hard", title: "Earn safety",
    scenario: "Crediting points on a purchase must be…",
    options: ["Idempotent (no double-credit on retry) and reversed on refund", "Done multiple times to be safe", "Synchronous always", "Never reversed"], correct: "Idempotent (no double-credit on retry) and reversed on refund",
    explanation: "Key earn by transaction id (idempotent), credit after settlement, and reverse via a compensating entry on refund." }),
  pm({ topicId: "sysd_m20_t6", exerciseId: "sysd_m20_t6_pm_3", position: 3, level: "medium", title: "Expiry",
    scenario: "Points expiry typically follows…",
    options: ["FIFO (oldest points expire/spend first)", "LIFO", "Random", "Never expire"], correct: "FIFO (oldest points expire/spend first)",
    explanation: "Track dated lots and expire/burn oldest first; tiers derive from activity over a window." }),
  // KYC
  pm({ topicId: "sysd_m20_t7", exerciseId: "sysd_m20_t7_pm_1", position: 1, level: "medium", title: "The checks",
    scenario: "KYC combines which checks?",
    options: ["Document verification + biometric (selfie↔ID + liveness) + sanctions/watchlist screening", "Only an email confirmation", "Just a password", "A captcha"], correct: "Document verification + biometric (selfie↔ID + liveness) + sanctions/watchlist screening",
    explanation: "Multiple checks establish identity + eligibility: real ID, matching live face, and not on watchlists." }),
  pm({ topicId: "sysd_m20_t7", exerciseId: "sysd_m20_t7_pm_2", position: 2, level: "hard", title: "Why async",
    scenario: "Verification is an async pipeline because…",
    options: ["Checks are slow and use third-party providers (OCR, biometrics, screening APIs)", "It's simpler to code", "Users prefer waiting", "Databases are slow"], correct: "Checks are slow and use third-party providers (OCR, biometrics, screening APIs)",
    explanation: "Slow, provider-dependent checks run async (submit → process → decide later), often in parallel via a workflow." }),
  pm({ topicId: "sysd_m20_t7", exerciseId: "sysd_m20_t7_pm_3", position: 3, level: "medium", title: "Ambiguous cases",
    scenario: "Low-confidence or possible-watchlist-hit cases should…",
    options: ["Go to a human review queue (human-in-the-loop)", "Auto-approve", "Auto-reject", "Be ignored"], correct: "Go to a human review queue (human-in-the-loop)",
    explanation: "Clear cases auto-decide; ambiguous ones go to human reviewers (FP/FN costs are high) — all audited." }),
  // Sportsbook
  pm({ topicId: "sysd_m20_t8", exerciseId: "sysd_m20_t8_pm_1", position: 1, level: "hard", title: "Bet placement risk",
    scenario: "The key risk when accepting a bet is…",
    options: ["Stale odds — re-validate odds are still valid at placement (or re-quote/reject)", "The user's name", "Slow rendering", "Database size"], correct: "Stale odds — re-validate odds are still valid at placement (or re-quote/reject)",
    explanation: "Odds change fast; validate them atomically at placement and lock the odds-at-placement to prevent exploitation." }),
  pm({ topicId: "sysd_m20_t8", exerciseId: "sysd_m20_t8_pm_2", position: 2, level: "medium", title: "Live odds",
    scenario: "Distributing fast-changing live odds to many clients is…",
    options: ["A real-time fan-out (pub/sub + WebSocket — the market-data pattern)", "A batch job", "A search query", "Email"], correct: "A real-time fan-out (pub/sub + WebSocket — the market-data pattern)",
    explanation: "Live odds must reach all viewers fast; stale shown odds are exploitable and bad UX." }),
  pm({ topicId: "sysd_m20_t8", exerciseId: "sysd_m20_t8_pm_3", position: 3, level: "medium", title: "Settlement",
    scenario: "When a result is final, winners are paid via…",
    options: ["A double-entry ledger (idempotent, auditable — money correctness)", "A mutable balance field", "A spreadsheet", "Best effort"], correct: "A double-entry ledger (idempotent, auditable — money correctness)",
    explanation: "Settlement pays stake × odds via a ledger (the wallet/payment discipline); stakes reserved at placement." }),
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
  console.log(`\nDone — M20 Case Studies XIV seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
