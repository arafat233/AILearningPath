/**
 * Seed — System Design module M15: Case Studies X (more large-scale designs):
 * Social Graph/PYMK, Shopping Cart & Checkout, Subscription Billing,
 * API Gateway, Container Orchestrator, Calendar/Scheduling (Calendly),
 * Stream Processing, Distributed Web Cache/Reverse Proxy. Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases10.js   ·   npm: npm run seed:sysd-cases10
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m15";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 15,
  name: "Case Studies X — More Systems", slug: "case-studies-10",
  description: "Eight more large-scale designs: a social graph / people-you-may-know, a shopping cart & checkout, a subscription-billing system, an API gateway, a container orchestrator, a calendar/scheduling service, a stream-processing system, and a distributed web cache / reverse proxy.",
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
  T("sysd_m15_t1", 1, "Design a Social Graph (People You May Know)", "design-social-graph",
    ["case-study", "graph", "recommendation", "scale"],
    "Build the friend/follow graph for a billion-user network, plus 'People You May Know'. Storing edges and computing friends-of-friends naively explodes. How do you store the graph and generate suggestions at scale?",
    "Store the graph as an adjacency representation in a partitioned graph/KV store; reads (a user's friends) are direct lookups. 'People You May Know' is mostly FRIENDS-OF-FRIENDS ranked by mutual-connection count — computed OFFLINE/batch (graph processing) and cached per user, not live per request. Sharding the graph + precomputed recommendations is the crux.",
    [
      { kind: "concept", heading: "Storing the graph",
        body: "Model users as nodes and friendships/follows as EDGES. Store adjacency lists (user → list of connections) in a horizontally-sharded store (a graph DB, or a KV/wide-column store keyed by user). A user's direct connections are then a fast lookup. Friendships are bidirectional (store both directions) or follows are directed (separate followers/following lists). At a billion users with hundreds of edges each, the graph is huge → must be sharded." },
      { kind: "concept", heading: "Sharding & the cross-shard problem",
        body: "Partition the graph across machines (by user id). The hard part: a user's friends live on OTHER shards, so multi-hop queries (friends-of-friends) fan out across shards — expensive. Real systems accept this and push heavy graph computation OFFLINE rather than doing live multi-hop traversals on the request path. Hot/celebrity nodes (millions of edges) need special handling (like the Twitter-fanout problem)." },
      { kind: "concept", heading: "People You May Know = FoF, offline",
        body: "PYMK is largely FRIENDS-OF-FRIENDS: people you're not connected to but who share many MUTUAL connections with you (plus signals like same school/company/location). Computing this live (2-hop traversal per request over a sharded billion-node graph) is infeasible. So PRECOMPUTE it in BATCH (offline graph processing — e.g. Spark/graph framework counting mutual connections), rank candidates by mutual-count + signals, and CACHE the top suggestions per user for instant serving. It's a recommendation pipeline (offline compute / online serve)." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Real-time updates' (a new friendship slightly changes suggestions — refresh periodically, not instantly). 'Ranking' (ML over mutual-count, interaction, shared attributes — the recommender). 'Privacy' (don't suggest blocked users). 'Mutual-friends display' (intersect two adjacency lists). 'Degrees of separation'. Signal: sharded adjacency-list graph + direct-friend lookups + offline-batch friends-of-friends ranked by mutual connections, cached per user (don't traverse live).",
      },
    ],
    "A social graph tests sharded adjacency-list storage (direct-friend lookups fast, multi-hop cross-shard expensive) and PYMK as friends-of-friends ranked by mutual connections — computed offline/batch and cached per user, not traversed live. It composes graph storage + a recommendation pipeline; celebrity nodes are the fanout edge case.",
    ["Computing friends-of-friends live per request via multi-hop traversal over a sharded billion-node graph.",
     "Ignoring sharding / the cross-shard multi-hop cost (and celebrity high-degree nodes).",
     "Not precomputing + caching PYMK suggestions offline."],
    0.6, { type: "Social graph", description: "Users=nodes, friendships=edges in a sharded adjacency store (direct friends = fast lookup). PYMK = friends-of-friends ranked by mutual connections, computed OFFLINE/batch and cached per user. Don't traverse live.", alt: "Social graph: sharded adjacency lists with offline-computed friends-of-friends recommendations." }),

  T("sysd_m15_t2", 2, "Design a Shopping Cart & Checkout", "design-shopping-cart-checkout",
    ["case-study", "cart", "inventory", "saga"],
    "Build e-commerce cart + checkout at scale: users add items to a cart (persisted across devices), then check out — reserving stock, taking payment, and creating an order, without overselling or charging for unavailable items. What's the cart store and the checkout flow?",
    "Cart is per-user mutable state in a fast store (Redis/KV), merged across devices/sessions. Checkout is a multi-step SAGA: validate cart → RESERVE inventory (atomic, with a timed hold) → take PAYMENT (idempotent) → create the ORDER → confirm; each step has a compensating action on failure (release the hold, refund). Prices snapshot at checkout; idempotency throughout.",
    [
      { kind: "concept", heading: "The cart",
        body: "A cart is per-user (or per-session for guests) MUTABLE state: line items + quantities, persisted so it survives across devices and sessions (store in a fast KV/Redis, keyed by user/session; merge a guest cart into the user's on login). It's read/written frequently and is NOT the order — it's a draft. Prices/availability shown are indicative; the source of truth is re-checked at checkout (prices and stock change)." },
      { kind: "concept", heading: "Checkout is a multi-step transaction",
        body: "Checkout coordinates several services that can each fail: validate the cart (items still available, prices current — SNAPSHOT prices into the order so they can't change mid-checkout), RESERVE inventory, charge PAYMENT, create the ORDER, send confirmation. A distributed transaction (2PC) across these is impractical, so use a SAGA: a sequence of steps each with a COMPENSATING action — if payment fails after reserving stock, RELEASE the reservation; if order creation fails after payment, refund. Model it as a state machine that can resume." },
      { kind: "concept", heading: "Inventory & no overselling",
        body: "Reserving stock must be ATOMIC (decrement available count / create a reservation under a constraint) so two checkouts don't both claim the last unit — the inventory/flash-sale discipline. Use a timed HOLD: stock is reserved during checkout and auto-released if payment doesn't complete in time (so abandoned checkouts don't lock inventory forever). Decouple 'available' from 'reserved' from 'sold'." },
      { kind: "concept", heading: "Idempotency & follow-ups",
        body: "Networks retry — every step needs IDEMPOTENCY (an idempotency key on payment so a retry doesn't double-charge; creating an order is keyed so a retry doesn't make two orders). Follow-ups: 'cart abandonment / recovery', 'multiple warehouses', 'coupons/taxes/shipping (pricing)', 'guest vs logged-in', 'high-traffic sale' (the flash-sale design). Signal: fast per-user cart store (cross-device merge, price re-check) + checkout SAGA (reserve→pay→order with compensations) + atomic timed inventory hold + idempotency.",
      },
    ],
    "Cart & checkout tests a fast per-user cart store (cross-device, prices re-checked) plus a checkout SAGA (validate → reserve inventory → pay → create order, each with compensating actions), atomic timed inventory holds (no oversell), and idempotency throughout. Prices snapshot at checkout; 2PC across services is impractical.",
    ["Treating the cart as the order, or not re-checking prices/stock at checkout (snapshot prices).",
     "Non-atomic inventory reservation (overselling) or no timed hold (abandoned carts lock stock).",
     "Using 2PC instead of a saga with compensations; no idempotency (double-charge / duplicate orders)."],
    0.6, { type: "Checkout saga", description: "Cart (per-user KV, cross-device, price re-check) → checkout: validate → reserve inventory (atomic, timed hold) → payment (idempotent) → create order → confirm. Any step fails → compensate (release hold / refund).", alt: "Shopping checkout as a saga: reserve, pay, create order, with compensating actions on failure." }),

  T("sysd_m15_t3", 3, "Design a Subscription Billing System", "design-subscription-billing",
    ["case-study", "billing", "scheduler", "idempotency"],
    "Build recurring billing (SaaS subscriptions): charge customers every cycle, handle plan changes mid-cycle (proration), retry failed payments, and never double-bill or lose money. What drives the recurring charges, and how do you handle a card that declines?",
    "A scheduler/billing engine generates INVOICES at each cycle from subscription state, then charges them via the payment system (idempotent). Mid-cycle plan changes are PRORATED. Failed charges enter DUNNING (retry with backoff over days, then suspend). A double-entry LEDGER records everything. It's a scheduled, idempotent, money-correct system built on a recurring-charge engine.",
    [
      { kind: "concept", heading: "Subscriptions, plans, invoices",
        body: "Model: a Plan (price, billing interval — monthly/annual, features), a Subscription (customer + plan + current period + status: active/past_due/canceled), and INVOICES generated per billing cycle. The billing engine, on each cycle boundary, creates an invoice for what's owed and attempts to collect it. Separating the subscription (the agreement) from invoices (the periodic bills) keeps history clean." },
      { kind: "concept", heading: "Driving recurring charges",
        body: "A SCHEDULER (the job-scheduler design) advances each subscription's billing cycle: at the period end, generate the next invoice and charge it. This must be RELIABLE and EXACTLY-ONCE per cycle — a crash or retry must not bill twice. Use idempotency: an invoice for a (subscription, period) is created once (keyed), and charging it carries an idempotency key. Processing is often async (queue of due charges)." },
      { kind: "concept", heading: "Proration & plan changes",
        body: "Plan changes mid-cycle need PRORATION: upgrading partway through charges the difference for the remaining days; downgrading credits unused time. Compute prorated amounts based on time remaining in the period. Add-ons, usage-based billing (metered), trials, coupons, and tax all feed the invoice total. This proration math is a defining complexity of billing." },
      { kind: "concept", heading: "Dunning, ledger & follow-ups",
        body: "A charge FAILS (card declined/expired) → DUNNING: retry on a schedule (e.g. day 1, 3, 5, 7 with backoff), notify the customer to update payment, and after retries exhaust, suspend/cancel (grace period). A double-entry LEDGER (the payment-system discipline — integer money, immutable entries) records charges, credits, refunds for audit and reconciliation. Follow-ups: 'webhooks from the payment processor (async, out-of-order)', 'refunds/credits', 'currency', 'invoicing/receipts', 'revenue recognition'. Signal: subscription/plan/invoice model + scheduler-driven cycles (idempotent, exactly-once) + proration on changes + dunning retries on failure + double-entry ledger.",
      },
    ],
    "Subscription billing tests scheduler-driven recurring charges that are idempotent/exactly-once per cycle, proration on mid-cycle plan changes, dunning (retry-with-backoff then suspend) for failed payments, and a double-entry ledger for money correctness. It builds on the job-scheduler and payment-system designs.",
    ["Charging on a timer without idempotency/exactly-once guarantees (double-billing on retry/crash).",
     "Ignoring proration for mid-cycle plan changes.",
     "No dunning flow for declined cards, or mutable balances instead of an audited ledger."],
    0.6, { type: "Billing cycle", description: "Scheduler hits cycle end → generate invoice (idempotent per period) → charge via payment system (idempotency key) → success: ledger entry, advance period. Fail → dunning (retry schedule → suspend). Plan change → prorate.", alt: "Subscription billing: scheduler-driven idempotent invoicing with proration and dunning." }),

  T("sysd_m15_t4", 4, "Design an API Gateway", "design-api-gateway",
    ["case-study", "gateway", "cross-cutting", "routing"],
    "Build the API gateway in front of many microservices: a single entry point that routes requests, authenticates, rate-limits, and more — so each service doesn't re-implement these. What does it handle, and what must it NOT become?",
    "A reverse-proxy entry point that ROUTES each request to the right backend service and centralizes CROSS-CUTTING concerns: authentication/authorization, rate limiting, TLS termination, request/response transformation, caching, and observability. It must stay STATELESS and thin (no business logic — or it becomes a monolith/bottleneck). Optionally aggregates calls (BFF). High-availability is critical (it's a SPOF).",
    [
      { kind: "concept", heading: "Single entry point",
        body: "Clients hit ONE endpoint (the gateway) instead of dozens of services directly. The gateway ROUTES each request to the appropriate backend (by path/host/version), often integrating with service discovery and load balancing. This decouples clients from the internal service topology (services can move/split without clients knowing) and gives one place to enforce policy." },
      { kind: "concept", heading: "Cross-cutting concerns",
        body: "The gateway's value is centralizing concerns every service would otherwise duplicate: AUTHENTICATION/authorization (validate tokens once at the edge), RATE LIMITING / throttling, TLS termination, request/response TRANSFORMATION (protocol translation, header injection), response CACHING, and observability (logging, metrics, tracing — inject/propagate trace ids). Do these once at the edge, keeping backend services focused on business logic." },
      { kind: "concept", heading: "What it must NOT become",
        body: "The critical anti-pattern: don't put BUSINESS LOGIC in the gateway. It must stay a thin, generic policy/routing layer — otherwise it becomes a distributed MONOLITH and a development bottleneck (every team waits on gateway changes). Keep it STATELESS (so it scales horizontally and any instance handles any request) and fast (it's on every request's hot path — minimize added latency)." },
      { kind: "concept", heading: "Aggregation, HA & follow-ups",
        body: "A BFF (Backend-For-Frontend) variant AGGREGATES multiple service calls into one client response (reducing round-trips for mobile). The gateway is a SPOF and on the critical path, so it must be highly available (multiple instances behind a load balancer) and resilient (timeouts, circuit breakers to backends). Follow-ups: 'versioning/canary routing', 'gateway vs service mesh (north-south vs east-west)', 'plugin model for policies', 'avoiding it as a bottleneck'. Signal: stateless reverse-proxy routing + centralized cross-cutting concerns (auth/rate-limit/TLS/observability) + NO business logic + HA + optional BFF aggregation.",
      },
    ],
    "An API gateway is a stateless reverse-proxy entry point that routes to backends and centralizes cross-cutting concerns (auth, rate-limiting, TLS, transformation, caching, observability) — explicitly WITHOUT business logic (which would make it a monolith/bottleneck). It's a SPOF on the hot path, so HA + resilience are essential; BFF aggregation is a variant.",
    ["Putting business logic in the gateway (turns it into a distributed monolith/bottleneck).",
     "Making it stateful (can't scale horizontally) or ignoring it's a SPOF on the hot path (needs HA).",
     "Having each service re-implement auth/rate-limiting instead of centralizing at the edge."],
    0.5, { type: "API gateway", description: "Clients → API Gateway (stateless): route to backend (discovery/LB) + auth + rate-limit + TLS + transform + cache + observability. NO business logic. HA behind a LB; resilient (timeouts/circuit breakers). BFF may aggregate calls.", alt: "API gateway: a stateless edge routing to services and handling cross-cutting concerns." }),

  T("sysd_m15_t5", 5, "Design a Container Orchestrator", "design-container-orchestrator",
    ["case-study", "scheduling", "control-loop", "desired-state"],
    "Build a Kubernetes-like orchestrator: run containerized workloads across a fleet of machines, keep the requested number of replicas alive, reschedule on node failure, and scale. What's the core control model, and how does it decide where things run?",
    "Users declare DESIRED STATE (e.g. '5 replicas of service X'); the system continuously RECONCILES actual toward desired via CONTROL LOOPS (controllers watch state, act on drift). A SCHEDULER places containers (pods) onto nodes by resource fit + constraints. A central state store (etcd) holds the truth; node agents run/report containers. Declarative + control loops + scheduling is the essence.",
    [
      { kind: "concept", heading: "Declarative desired state",
        body: "The defining model: users DECLARE what they want (a spec: '5 replicas of this image, 2 CPU each, these env vars'), not imperative steps. The system's job is to make reality MATCH that desired state and keep it matching. This declarative approach is what makes orchestration self-healing — you describe the goal, the system figures out how to achieve and maintain it." },
      { kind: "concept", heading: "Control loops (reconciliation)",
        body: "The engine is a set of CONTROLLERS, each running a CONTROL LOOP: observe the current state, compare to desired, and take ACTIONS to close the gap — forever. If a node dies and replicas drop from 5 to 3, the controller notices the drift and schedules 2 new ones; if you change desired to 10, it creates 5 more. This continuous reconcile-toward-desired loop (not one-shot commands) is the heart of Kubernetes-style orchestration and gives self-healing." },
      { kind: "concept", heading: "Scheduling onto nodes",
        body: "A SCHEDULER decides WHICH node runs each container (pod): filter nodes that have enough free resources (CPU/memory) and satisfy CONSTRAINTS (affinity/anti-affinity, taints, node selectors), then score/rank the feasible ones (spread load, bin-packing) and assign. Node AGENTS (kubelets) on each machine pull their assigned workloads, run the containers (via a container runtime), and report health back. Bin-packing vs spreading is a real trade." },
      { kind: "concept", heading: "State store & follow-ups",
        body: "A central, consistent STATE STORE (etcd — Raft-backed) holds the desired + observed state; the control plane (API server) is the single front door, and controllers/scheduler watch it. Networking (service discovery + load balancing across replicas), storage volumes, health checks (restart unhealthy), and autoscaling (add replicas/nodes on load) round it out. Follow-ups: 'rolling updates/rollbacks', 'multi-tenancy/quotas', 'control-plane HA'. Signal: declarative desired state + reconciling control loops (self-healing) + resource/constraint-based scheduler + node agents + consistent state store (etcd).",
      },
    ],
    "A container orchestrator tests the declarative + control-loop model: users declare desired state, controllers continuously reconcile actual toward it (self-healing on node failure / scaling), a scheduler places workloads by resource fit + constraints, node agents run them, and a consistent state store (etcd) holds the truth. Declarative reconciliation, not imperative commands, is the key.",
    ["An imperative 'run these containers' model instead of declarative desired-state + reconciliation.",
     "No control loop — not detecting/healing drift when a node dies or replicas change.",
     "Ignoring the scheduler's resource/constraint placement or the consistent state store."],
    0.6, { type: "Orchestrator control loop", description: "User declares desired state → state store (etcd). Controllers watch + reconcile actual→desired (self-heal). Scheduler places pods on nodes by resources+constraints. Node agents run containers + report health.", alt: "Container orchestrator: declarative desired state reconciled by control loops, with a scheduler." }),

  T("sysd_m15_t6", 6, "Design a Calendar / Scheduling Service", "design-calendar-scheduling",
    ["case-study", "availability", "concurrency", "timezones"],
    "Build a Calendly-style scheduling service: an organizer publishes availability, invitees book a slot, and the same slot can't be double-booked under concurrent requests — across time zones. What computes free slots, and what guards the booking?",
    "Compute AVAILABLE slots = the organizer's availability rules MINUS existing busy events (interval subtraction), in the right time zone. Booking a slot must be ATOMIC (unique constraint on (organizer, slot) / transaction) so concurrent invitees can't double-book. Store times in UTC + zone, convert for display. It's availability computation + interval logic + a booking concurrency guard.",
    [
      { kind: "concept", heading: "Computing available slots",
        body: "Availability = the organizer's defined WORKING HOURS / availability rules (possibly recurring — the RRULE idea), broken into bookable slots (e.g. 30-min), MINUS times already taken by existing events (and buffers, min-notice, max-per-day). This is INTERVAL subtraction: take the availability windows and remove overlapping busy intervals. The result is the free slots shown to invitees. Recompute against current events (don't show a stale slot)." },
      { kind: "concept", heading: "The booking concurrency guard",
        body: "Two invitees viewing the same free slot must not BOTH book it. The naive 'show free → invitee picks → save' has a race. Make the booking ATOMIC: insert the booking under a UNIQUE constraint on (organizer, time slot) or a transaction that re-checks no overlapping event exists — so exactly one succeeds and the other gets 'slot just taken' and re-picks. Same double-booking discipline as hotel/appointment systems." },
      { kind: "concept", heading: "Time zones (the classic trap)",
        body: "Organizer and invitee are often in DIFFERENT time zones. Store all event times in UTC plus the relevant time zone; CONVERT for display per viewer. Compute availability in the organizer's local zone (their 9–5), present slots in the invitee's zone. Handle DST transitions (an offset isn't constant — store the zone id, not a fixed offset). Mishandling time zones/DST is the #1 calendar bug." },
      { kind: "concept", heading: "Integrations & follow-ups",
        body: "Often syncs with external calendars (Google/Outlook) to read busy times and write the booked event (two-way sync — eventual consistency, conflicts). On booking: create the event, send invites/reminders (notification/scheduler), generate a meeting link. Follow-ups: 'group/round-robin scheduling', 'rescheduling/cancellation', 'recurring availability (RRULE)', 'buffers & min-notice'. Signal: availability = rules minus busy (interval subtraction) + atomic booking guard (no double-book) + UTC+zone storage with per-viewer conversion (DST-safe) + external-calendar sync.",
      },
    ],
    "A scheduling service tests availability computation (rules minus busy events — interval subtraction), an atomic booking guard against double-booking under concurrency, and correct time-zone handling (store UTC + zone, convert per viewer, DST-safe — the classic trap). External-calendar two-way sync is the integration follow-up.",
    ["Non-atomic booking that double-books a slot under concurrent invitees.",
     "Storing local times / fixed offsets instead of UTC + zone id (breaks across time zones and DST).",
     "Showing stale availability not recomputed against current busy events."],
    0.5, { type: "Slot booking", description: "Available slots = availability rules − busy events (interval subtraction), in organizer's zone. Invitee books → atomic insert under unique (organizer, slot) → one wins. Times stored UTC+zone, converted per viewer (DST-safe).", alt: "Scheduling service: availability via interval subtraction with an atomic, timezone-correct booking guard." }),

  T("sysd_m15_t7", 7, "Design a Stream Processing System", "design-stream-processing",
    ["case-study", "streaming", "windowing", "exactly-once"],
    "Build a system to process unbounded event streams in near-real-time (Flink/Kafka-Streams style): transform, aggregate over time windows, and join streams — with stateful operators that survive failures. What makes stateful streaming correct?",
    "A dataflow of OPERATORS (map/filter/aggregate/join) consuming partitioned streams; stateful operators (windowed aggregations, joins) keep STATE that must be CHECKPOINTED durably for fault tolerance (recover state + replay from offsets). WINDOWING (tumbling/sliding/session) bounds aggregation over time, with WATERMARKS handling late/out-of-order events. Exactly-once via checkpoints + idempotent/transactional sinks.",
    [
      { kind: "concept", heading: "Dataflow of operators",
        body: "A streaming job is a DATAFLOW graph (DAG) of OPERATORS: sources (read from Kafka), transformations (map, filter, aggregate, join), and sinks (write out). Records flow through continuously (unbounded). Operators are PARTITIONED and run in parallel across the stream's partitions (keyed by a partition key so related records go to the same operator instance — needed for correct per-key aggregation)." },
      { kind: "concept", heading: "State + fault-tolerant checkpointing",
        body: "Aggregations and joins are STATEFUL (a running count, a window's buffer, a join's seen-records). On failure, that in-memory state would be lost — so the system periodically CHECKPOINTS operator state durably (to a state backend/object storage) and records the input OFFSETS at the checkpoint. Recovery restores the last checkpoint's state and REPLAYS the stream from those offsets — so no data is lost and state is consistent. This checkpoint-and-replay is the core of fault-tolerant stateful streaming." },
      { kind: "concept", heading: "Windowing & watermarks",
        body: "Aggregating an unbounded stream needs WINDOWS that bound it over time: TUMBLING (fixed, non-overlapping), SLIDING (overlapping), SESSION (gap-based). But events arrive LATE / OUT OF ORDER (network delays, the ad-click problem) — WATERMARKS track 'event time progress' and decide when a window is complete enough to emit (with an allowed-lateness for stragglers). Event-time (when it happened) vs processing-time (when seen) is a key distinction." },
      { kind: "concept", heading: "Delivery semantics & follow-ups",
        body: "EXACTLY-ONCE processing (each event affects results once despite failures/retries) is achieved by aligning checkpoints with offset commits and using IDEMPOTENT or TRANSACTIONAL sinks — vs at-least-once (duplicates possible, cheaper). Backpressure propagates upstream when a slow operator can't keep up. Follow-ups: 'state too big for memory (RocksDB-backed)', 'stream-stream / stream-table joins', 'reprocessing (Kappa)', 'scaling/rebalancing partitions'. Signal: partitioned operator dataflow + checkpointed state for fault tolerance (replay from offsets) + event-time windowing with watermarks + exactly-once via checkpoints + idempotent/transactional sinks.",
      },
    ],
    "Stream processing tests stateful real-time dataflow: partitioned operators, fault tolerance via checkpointing state + replaying from offsets, event-time windowing (tumbling/sliding/session) with watermarks for late data, and exactly-once via checkpoint-aligned offsets + idempotent/transactional sinks. Event-time vs processing-time is the key distinction.",
    ["Treating it as stateless — ignoring how stateful operators survive failure (checkpoint + replay).",
     "Aggregating without time windows, or ignoring late/out-of-order events (watermarks, event-time).",
     "Assuming exactly-once for free instead of checkpoint-aligned offsets + idempotent/transactional sinks."],
    0.6, { type: "Streaming dataflow", description: "Source (Kafka, partitioned) → operators (map/filter/window-aggregate/join, stateful) → sink. State checkpointed durably + offsets recorded → recover by restoring state + replaying. Event-time windows w/ watermarks. Exactly-once via checkpoint + transactional sink.", alt: "Stream processing: partitioned stateful operators with checkpointing, windowing, and watermarks." }),

  T("sysd_m15_t8", 8, "Design a Distributed Web Cache / Reverse Proxy", "design-reverse-proxy-cache",
    ["case-study", "caching", "reverse-proxy", "invalidation"],
    "Build a caching reverse proxy (Varnish/nginx-style) in front of your origin: cache responses so most requests never hit the backend, while staying correct. What can be cached, what's the cache key, and how do you avoid a stampede when an item expires?",
    "A reverse proxy that CACHES responses keyed by request (method + URL + varying headers), serving cacheable responses from memory and forwarding misses to the origin. Respects HTTP cache semantics (Cache-Control, TTL, only cacheable methods/responses). Prevent thundering-herd on expiry via REQUEST COALESCING; invalidate via TTL/purge. It's an HTTP-aware cache layer offloading the origin.",
    [
      { kind: "concept", heading: "Reverse proxy + caching",
        body: "A reverse proxy sits in FRONT of origin servers, receiving client requests and forwarding them — and CACHES responses so repeat requests are served from the proxy without touching the backend. This offloads the origin (huge for read-heavy traffic), reduces latency, and absorbs spikes. It's similar to a CDN but typically in your own datacenter in front of your app/origin (Varnish/nginx)." },
      { kind: "concept", heading: "What's cacheable & the cache key",
        body: "Only certain responses are cacheable: typically safe methods (GET/HEAD), success responses, and per HTTP CACHE-CONTROL directives (no-store, max-age, private vs public). The CACHE KEY identifies equivalent requests — usually method + full URL, plus any headers the response VARYs on (Vary: Accept-Encoding, etc.). Authenticated/personalized responses usually shouldn't be shared-cached. Getting the key right (not too coarse → wrong content; not too fine → no hits) is essential." },
      { kind: "concept", heading: "Stampede on expiry",
        body: "When a popular cached item EXPIRES, many concurrent requests miss simultaneously and all hit the origin at once — a thundering herd that can overwhelm the backend. Mitigate with REQUEST COALESCING (only ONE request goes to origin to refill; the others wait for it — Varnish's 'request coalescing'/grace mode), serving STALE-WHILE-REVALIDATE (serve the old copy while refreshing in the background), and staggered TTLs. Same cache-stampede problem as the distributed cache / CDN." },
      { kind: "concept", heading: "Invalidation & follow-ups",
        body: "Freshness via TTL (max-age) is the simplest; explicit PURGE/ban invalidates entries when underlying data changes; conditional requests (ETag/If-None-Match → 304) revalidate cheaply. Follow-ups: 'cache hit ratio / sizing + eviction (LRU)', 'caching partial/personalized content (edge-side includes)', 'tiered caches', 'cache poisoning security'. Signal: HTTP-aware reverse-proxy cache keyed by request (+Vary) honoring Cache-Control, serving hits & forwarding misses, with request-coalescing/stale-while-revalidate against stampede and TTL/purge invalidation.",
      },
    ],
    "A caching reverse proxy tests HTTP-aware caching: cache responses keyed by request (+Vary) honoring Cache-Control (cacheable methods/responses only), serve hits and forward misses to origin, prevent expiry stampedes via request coalescing / stale-while-revalidate, and invalidate via TTL/purge/ETag. It offloads the origin — same stampede concern as the CDN.",
    ["Caching everything (including personalized/non-cacheable responses) or a wrong cache key (Vary).",
     "No protection against the thundering-herd on expiry (request coalescing / stale-while-revalidate).",
     "Ignoring HTTP cache semantics (Cache-Control/ETag) and a sane invalidation strategy."],
    0.5, { type: "Reverse-proxy cache", description: "Client → reverse proxy: cache key = method+URL(+Vary). Hit (fresh, per Cache-Control) → serve. Miss/expired → ONE request to origin (coalesce others / serve stale-while-revalidate) → cache → serve. Invalidate via TTL/purge/ETag.", alt: "Caching reverse proxy serving hits and coalescing misses to origin with HTTP cache semantics." }),
];

const EXERCISES = [
  // Social graph
  pm({ topicId: "sysd_m15_t1", exerciseId: "sysd_m15_t1_pm_1", position: 1, level: "hard", title: "PYMK compute",
    scenario: "'People You May Know' (friends-of-friends) at a billion users should be…",
    options: ["Precomputed offline/batch and cached per user", "Computed live per request via 2-hop traversal", "Random users", "Only direct friends"], correct: "Precomputed offline/batch and cached per user",
    explanation: "Live multi-hop traversal over a sharded billion-node graph is infeasible; batch-compute FoF and cache suggestions." }),
  pm({ topicId: "sysd_m15_t1", exerciseId: "sysd_m15_t1_pm_2", position: 2, level: "medium", title: "Storage",
    scenario: "The friend graph at scale is stored as…",
    options: ["Sharded adjacency lists (user → connections)", "One giant in-memory matrix", "A single relational table scanned per query", "A search index"], correct: "Sharded adjacency lists (user → connections)",
    explanation: "Adjacency lists in a partitioned store make direct-friend lookups fast; the graph must be sharded at scale." }),
  pm({ topicId: "sysd_m15_t1", exerciseId: "sysd_m15_t1_pm_3", position: 3, level: "medium", title: "Ranking signal",
    scenario: "PYMK candidates are primarily ranked by…",
    options: ["Number of mutual connections (+ signals like school/company)", "Alphabetical order", "Account age", "Random"], correct: "Number of mutual connections (+ signals like school/company)",
    explanation: "Mutual-connection count is the core friends-of-friends signal, blended with shared attributes." }),
  // Cart & checkout
  pm({ topicId: "sysd_m15_t2", exerciseId: "sysd_m15_t2_pm_1", position: 1, level: "hard", title: "Checkout coordination",
    scenario: "Checkout spans validate→reserve→pay→order across services. Coordinate it with…",
    options: ["A saga with compensating actions per step", "2PC across all services and the bank", "One giant DB transaction", "Fire-and-forget calls"], correct: "A saga with compensating actions per step",
    explanation: "2PC across external payment is impractical; a saga sequences steps with compensations (release hold, refund)." }),
  pm({ topicId: "sysd_m15_t2", exerciseId: "sysd_m15_t2_pm_2", position: 2, level: "hard", title: "No oversell",
    scenario: "Reserving the last unit during checkout requires…",
    options: ["Atomic reservation + a timed hold (released if payment lapses)", "An in-memory availability check then save", "Trusting the cart count", "A bigger DB pool"], correct: "Atomic reservation + a timed hold (released if payment lapses)",
    explanation: "Atomic reserve prevents two checkouts claiming the last unit; a timed hold frees stock from abandoned carts." }),
  pm({ topicId: "sysd_m15_t2", exerciseId: "sysd_m15_t2_pm_3", position: 3, level: "medium", title: "The cart",
    scenario: "The cart should be…",
    options: ["Per-user state in a fast store, merged across devices, prices re-checked at checkout", "The same as the final order", "Stored only in the browser", "Immutable"], correct: "Per-user state in a fast store, merged across devices, prices re-checked at checkout",
    explanation: "A cart is a mutable draft (Redis/KV), cross-device; prices/stock are authoritative only at checkout (snapshot then)." }),
  // Subscription billing
  pm({ topicId: "sysd_m15_t3", exerciseId: "sysd_m15_t3_pm_1", position: 1, level: "hard", title: "No double-bill",
    scenario: "Recurring charges must be exactly-once per cycle despite crashes/retries. Ensure this with…",
    options: ["Idempotency (invoice per (sub, period) keyed; charge with idempotency key)", "Charging on a simple timer", "Retrying blindly", "A faster scheduler"], correct: "Idempotency (invoice per (sub, period) keyed; charge with idempotency key)",
    explanation: "Keying the invoice per period and the charge with an idempotency key makes billing exactly-once." }),
  pm({ topicId: "sysd_m15_t3", exerciseId: "sysd_m15_t3_pm_2", position: 2, level: "medium", title: "Mid-cycle change",
    scenario: "A customer upgrades plans mid-cycle. You must…",
    options: ["Prorate (charge the difference for remaining days)", "Charge a full new cycle immediately", "Ignore until next cycle", "Refund everything"], correct: "Prorate (charge the difference for remaining days)",
    explanation: "Proration charges/credits based on time remaining in the period — a defining billing complexity." }),
  pm({ topicId: "sysd_m15_t3", exerciseId: "sysd_m15_t3_pm_3", position: 3, level: "medium", title: "Card declines",
    scenario: "A subscription charge fails (declined card). The system should…",
    options: ["Enter dunning: retry on a schedule, notify, then suspend", "Cancel immediately", "Keep charging instantly in a loop", "Give the service free"], correct: "Enter dunning: retry on a schedule, notify, then suspend",
    explanation: "Dunning retries over days with backoff and customer notification, suspending only after retries exhaust." }),
  // API gateway
  pm({ topicId: "sysd_m15_t4", exerciseId: "sysd_m15_t4_pm_1", position: 1, level: "medium", title: "Its job",
    scenario: "An API gateway primarily…",
    options: ["Routes requests + centralizes cross-cutting concerns (auth, rate-limit, TLS, observability)", "Stores the main database", "Runs business logic", "Renders the UI"], correct: "Routes requests + centralizes cross-cutting concerns (auth, rate-limit, TLS, observability)",
    explanation: "It's a single entry point doing routing + edge concerns so services don't each re-implement them." }),
  pm({ topicId: "sysd_m15_t4", exerciseId: "sysd_m15_t4_pm_2", position: 2, level: "hard", title: "Anti-pattern",
    scenario: "What must an API gateway NOT become?",
    options: ["A place for business logic (turns it into a distributed monolith/bottleneck)", "Stateless", "Highly available", "A reverse proxy"], correct: "A place for business logic (turns it into a distributed monolith/bottleneck)",
    explanation: "Business logic in the gateway makes it a monolith and a team bottleneck; keep it thin and generic." }),
  pm({ topicId: "sysd_m15_t4", exerciseId: "sysd_m15_t4_pm_3", position: 3, level: "medium", title: "Scale + reliability",
    scenario: "Because it's on every request's hot path, the gateway should be…",
    options: ["Stateless + highly available (multiple instances behind an LB)", "A single stateful server", "Optional", "Synchronous-only"], correct: "Stateless + highly available (multiple instances behind an LB)",
    explanation: "Statelessness enables horizontal scaling; HA is essential since the gateway is a SPOF on the critical path." }),
  // Orchestrator
  pm({ topicId: "sysd_m15_t5", exerciseId: "sysd_m15_t5_pm_1", position: 1, level: "hard", title: "Core model",
    scenario: "A Kubernetes-style orchestrator is built on…",
    options: ["Declarative desired state + control loops reconciling actual toward it", "Imperative 'run this now' commands", "Manual placement per container", "A cron job per service"], correct: "Declarative desired state + control loops reconciling actual toward it",
    explanation: "You declare desired state; controllers continuously reconcile reality toward it — giving self-healing." }),
  pm({ topicId: "sysd_m15_t5", exerciseId: "sysd_m15_t5_pm_2", position: 2, level: "hard", title: "Node dies",
    scenario: "A node hosting 2 replicas dies. What restores them?",
    options: ["A control loop detects the drift and reschedules the lost replicas", "Manual operator intervention", "Nothing — they're lost", "The client retries"], correct: "A control loop detects the drift and reschedules the lost replicas",
    explanation: "The reconciling controller notices actual < desired and schedules replacements — self-healing." }),
  pm({ topicId: "sysd_m15_t5", exerciseId: "sysd_m15_t5_pm_3", position: 3, level: "medium", title: "Placement",
    scenario: "Deciding which node runs a container is done by…",
    options: ["A scheduler filtering by resource fit + constraints, then ranking", "Random assignment", "Always the first node", "The client choosing"], correct: "A scheduler filtering by resource fit + constraints, then ranking",
    explanation: "The scheduler filters feasible nodes (resources, affinity/taints) and scores them (spread/bin-pack)." }),
  // Calendar/scheduling
  pm({ topicId: "sysd_m15_t6", exerciseId: "sysd_m15_t6_pm_1", position: 1, level: "medium", title: "Free slots",
    scenario: "Available booking slots are computed by…",
    options: ["Availability rules MINUS existing busy events (interval subtraction)", "Listing all of the day's hours", "The invitee's guess", "Random times"], correct: "Availability rules MINUS existing busy events (interval subtraction)",
    explanation: "Subtract busy intervals (and buffers) from the organizer's availability windows to get free slots." }),
  pm({ topicId: "sysd_m15_t6", exerciseId: "sysd_m15_t6_pm_2", position: 2, level: "hard", title: "No double-book",
    scenario: "Two invitees book the same slot concurrently. Prevent it with…",
    options: ["An atomic insert under a unique (organizer, slot) constraint", "Showing fewer slots", "Trusting the UI", "A longer session"], correct: "An atomic insert under a unique (organizer, slot) constraint",
    explanation: "Atomic booking under a uniqueness constraint lets exactly one succeed; the other re-picks." }),
  pm({ topicId: "sysd_m15_t6", exerciseId: "sysd_m15_t6_pm_3", position: 3, level: "hard", title: "Time zones",
    scenario: "Organizer and invitee are in different zones. Store times as…",
    options: ["UTC + a time-zone id, converting per viewer (DST-safe)", "The organizer's local string", "A fixed offset", "Whatever the browser sends"], correct: "UTC + a time-zone id, converting per viewer (DST-safe)",
    explanation: "Store UTC + zone id (not a fixed offset, which breaks on DST); convert for each viewer's display." }),
  // Stream processing
  pm({ topicId: "sysd_m15_t7", exerciseId: "sysd_m15_t7_pm_1", position: 1, level: "hard", title: "Survive failure",
    scenario: "A stateful aggregation operator's state must survive a crash. This needs…",
    options: ["Periodic checkpointing of state + offsets, then replay on recovery", "Keeping state only in memory", "Restarting from the beginning of time", "No state at all"], correct: "Periodic checkpointing of state + offsets, then replay on recovery",
    explanation: "Checkpoint state durably with input offsets; recovery restores state and replays from those offsets." }),
  pm({ topicId: "sysd_m15_t7", exerciseId: "sysd_m15_t7_pm_2", position: 2, level: "hard", title: "Late events",
    scenario: "Events arrive out of order. Windowed aggregation handles this with…",
    options: ["Event-time windows + watermarks (allowed lateness)", "Processing-time only", "Ignoring late events always", "Sorting the entire stream first"], correct: "Event-time windows + watermarks (allowed lateness)",
    explanation: "Watermarks track event-time progress to decide when a window is complete, tolerating late stragglers." }),
  pm({ topicId: "sysd_m15_t7", exerciseId: "sysd_m15_t7_pm_3", position: 3, level: "hard", title: "Exactly-once",
    scenario: "Exactly-once processing is achieved by…",
    options: ["Checkpoint-aligned offsets + idempotent/transactional sinks", "Hoping there are no failures", "At-least-once with no dedupe", "Disabling retries"], correct: "Checkpoint-aligned offsets + idempotent/transactional sinks",
    explanation: "Aligning checkpoints with offset commits and using transactional/idempotent sinks gives exactly-once effects." }),
  // Reverse proxy cache
  pm({ topicId: "sysd_m15_t8", exerciseId: "sysd_m15_t8_pm_1", position: 1, level: "medium", title: "Cache key",
    scenario: "A caching reverse proxy keys cached responses by…",
    options: ["Method + URL (+ headers the response Varies on)", "The client's IP only", "A random id", "The response body"], correct: "Method + URL (+ headers the response Varies on)",
    explanation: "The key identifies equivalent requests; Vary headers ensure variants (e.g. encoding) aren't mixed up." }),
  pm({ topicId: "sysd_m15_t8", exerciseId: "sysd_m15_t8_pm_2", position: 2, level: "hard", title: "Expiry stampede",
    scenario: "A popular cached item expires and many requests miss at once. Mitigate with…",
    options: ["Request coalescing / stale-while-revalidate", "Letting all requests hit origin", "A bigger origin", "Disabling the cache"], correct: "Request coalescing / stale-while-revalidate",
    explanation: "Coalesce so only one request refills (others wait), or serve stale while refreshing — preventing the herd." }),
  pm({ topicId: "sysd_m15_t8", exerciseId: "sysd_m15_t8_pm_3", position: 3, level: "medium", title: "What to cache",
    scenario: "The proxy should cache…",
    options: ["Cacheable methods/responses per HTTP Cache-Control (not personalized/private)", "Every response including authenticated ones", "Only error responses", "Nothing dynamic ever"], correct: "Cacheable methods/responses per HTTP Cache-Control (not personalized/private)",
    explanation: "Honor HTTP cache semantics; don't shared-cache personalized/private responses (correctness/security)." }),
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
  console.log(`\nDone — M15 Case Studies X seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
