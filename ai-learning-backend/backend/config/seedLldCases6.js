/**
 * Seed — LLD module M12: Case Studies VI (more OOD problems):
 * Hospital Management, Airline Reservation, Spreadsheet, Collaborative
 * Whiteboard, Expression Evaluator (Interpreter), Object/Connection Pool,
 * Coupon/Discount Engine, Course Registration.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases6.js   ·   npm: npm run seed:lld-cases6
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m12";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 12,
  name: "Case Studies VI — More OOD", slug: "case-studies-6",
  description: "Eight more object-oriented designs: Hospital Management, Airline Reservation, a Spreadsheet, a Collaborative Whiteboard, an Expression Evaluator (Interpreter), an Object/Connection Pool, a Coupon/Discount Engine, and Course Registration.",
  estimatedHours: 5, prerequisites: ["lld_m1", "lld_m4"], status: "live",
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
  T("lld_m12_t1", 1, "Design a Hospital Management System", "design-hospital-management",
    ["case-study", "scheduling", "state", "rbac"],
    "Model a hospital: patients, doctors with schedules, appointments, admissions/beds, and prescriptions — with role-based access (doctor vs nurse vs admin). What carries an appointment's lifecycle and how do you book a slot without conflicts?",
    "Core entities Patient, Doctor (with availability slots), Appointment (a State machine BOOKED→CONFIRMED→COMPLETED/CANCELLED/NO_SHOW), Bed/Ward for admissions, Prescription. Booking is a slot-reservation problem (atomic, no double-book — like hotel). Access is role-based (RBAC). It's a scheduling + lifecycle + access-control design.",
    [
      { kind: "concept", heading: "Entities & relationships",
        body: "Patient (history, contact), Doctor (specialty, a schedule of available time SLOTS), Appointment (links patient↔doctor at a slot), and for in-patients a Bed in a Ward (admission). MedicalRecord, Prescription, and Bill hang off the patient. Keep an Appointment the aggregate owning the visit's lifecycle." },
      { kind: "concept", heading: "Booking without conflicts",
        body: "A doctor's time is divided into slots; booking an appointment reserves a free slot. Two patients booking the same slot concurrently is the now-familiar double-booking race → reserve ATOMICALLY (unique constraint on (doctor, slot) / transaction / lock). The same logic applies to assigning a limited resource like a bed or an operating room." },
      { kind: "concept", heading: "Appointment as a State machine",
        body: "Appointment status: REQUESTED/BOOKED → CONFIRMED → CHECKED_IN → COMPLETED, with CANCELLED and NO_SHOW branches (and rescheduled). State enforces legal transitions and triggers actions (reminders on BOOKED, billing on COMPLETED). Admissions have their own lifecycle (ADMITTED → DISCHARGED)." },
      { kind: "concept", heading: "Access control & follow-ups",
        body: "Different roles see/do different things: a doctor edits diagnoses, a nurse records vitals, an admin manages billing, a patient views their own records only. Model with ROLE-BASED ACCESS CONTROL (roles → permissions) checked before operations — don't scatter role checks ad hoc. Follow-ups: 'emergency walk-ins (priority)', 'recurring appointments', 'notifications', 'bed availability across wards'. Signal: slot-based atomic booking + Appointment State machine + RBAC + resource (bed) allocation." },
    ],
    "Hospital management tests slot-based scheduling (atomic, no double-book), an Appointment State machine, RBAC for multi-role access, and limited-resource (bed/OR) allocation. It reuses the booking concurrency discipline.",
    ["Non-atomic slot booking that double-books a doctor or bed.",
     "Scattering role checks ad hoc instead of a clean RBAC model.",
     "No appointment State machine (cancel/no-show/reschedule become flags)."],
    0.5),

  T("lld_m12_t2", 2, "Design an Airline Reservation System", "design-airline-reservation",
    ["case-study", "booking", "search", "state"],
    "Model flight booking: search flights between cities/dates, pick seats on a specific flight, and book without selling the same seat twice. How do you model flights vs seats, and guard seat selection under concurrency?",
    "Model Flight (route + schedule + aircraft) with a per-flight SeatMap of Seats; a Booking/Reservation reserves specific seats with a State machine (HELD→CONFIRMED→CHECKED_IN/CANCELLED) and a timed hold. Seat selection is an atomic check-and-reserve (no double-sell). Search is over flights/segments; pricing is a Strategy (fare classes).",
    [
      { kind: "concept", heading: "Flights vs seats",
        body: "An Aircraft has a seating layout; a Flight is a scheduled instance (route, date, aircraft) with its own SeatMap (Seat = number, class, status for THIS flight). Don't conflate the physical seat layout with per-flight availability. A multi-leg journey is a sequence of flight segments. Search returns flights (or segment combinations) matching origin/destination/date." },
      { kind: "concept", heading: "Seat reservation (atomic)",
        body: "Selecting seat 14C on flight X must not let two passengers book it. Each seat has availability per flight; reserve ATOMICALLY (compare-and-set the seat status / unique constraint on (flight, seat)). A HELD state with a timeout locks the seat during checkout and releases it if payment lapses — the same hold pattern as hotel/flash-sale. Whoever loses the race re-picks." },
      { kind: "concept", heading: "Booking lifecycle & pricing",
        body: "Reservation is a State machine: HELD (seats locked, awaiting payment) → CONFIRMED (ticketed) → CHECKED_IN → BOARDED; CANCELLED with a refund policy. Fare classes (economy/business; advance/flexible) are a pricing Strategy; dynamic pricing adjusts by demand. A PNR groups passengers + segments." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Overbooking strategy' (airlines deliberately oversell — a policy), 'connecting flights / multi-city', 'seat-class upgrades', 'cancellations & refunds', 'waitlist'. Signal: Flight + per-flight SeatMap + atomic seat reservation with timed hold + Reservation State machine + fare-class pricing Strategy. Mirrors hotel/movie booking with seat granularity." },
    ],
    "Airline reservation tests separating flights from per-flight seat maps, atomic seat reservation with timed holds (no double-sell), a Reservation State machine, and fare-class pricing. Overbooking is the classic twist.",
    ["Conflating the aircraft's physical layout with per-flight seat availability.",
     "Non-atomic seat selection that double-sells a seat.",
     "No timed hold during checkout, locking seats forever on abandoned carts."],
    0.5, { type: "Reservation state", description: "Reservation: HELD (seats locked, timed) → CONFIRMED → CHECKED_IN → BOARDED; CANCELLED w/ refund. Seat reserved via atomic check on (flight, seat).", alt: "Airline reservation state machine with timed seat holds." }),

  T("lld_m12_t3", 3, "Design a Spreadsheet", "design-spreadsheet",
    ["case-study", "dependency-graph", "observer", "topological-sort"],
    "Model a spreadsheet: cells holding values or FORMULAS referencing other cells (=A1+B2), recalculating dependents when an input changes, and detecting circular references. What structure captures dependencies and drives recalculation?",
    "Cells form a dependency GRAPH (an edge A→B means B's formula reads A). On a change, recompute only the affected dependents in topological order (or Observer-propagate). A cycle in the graph is a circular reference (detect and flag #CIRCULAR). Cells hold either a literal or a parsed formula expression.",
    [
      { kind: "concept", heading: "Cells, values, formulas",
        body: "A Cell holds either a literal (number/text) or a FORMULA — an expression that references other cells (=A1+SUM(B1:B3)). Parse the formula into an expression tree (the Interpreter idea) and record which cells it depends on. The grid is a sparse map of (row,col)→Cell." },
      { kind: "concept", heading: "The dependency graph",
        body: "Model dependencies as a directed graph: if C1's formula reads A1 and B1, add edges A1→C1 and B1→C1. This graph is the core structure: it tells you, when a cell changes, exactly which other cells must recompute. Build/maintain it as formulas are entered or edited." },
      { kind: "concept", heading: "Recalculation order",
        body: "When A1 changes, you must recompute its dependents — but a dependent might itself feed others, and recomputing in the wrong order gives stale results. So recompute in TOPOLOGICAL ORDER of the dependency subgraph reachable from the changed cell (dependencies before dependents). Equivalently, Observer-propagate along edges. Recompute only what's affected, not the whole sheet." },
      { kind: "concept", heading: "Cycles & follow-ups",
        body: "If A1 depends on B1 and B1 depends on A1, there's no valid order — a CIRCULAR REFERENCE. Detect cycles in the dependency graph (a topological sort that can't complete, or DFS back-edge detection) and flag the cells (#CIRCULAR) instead of looping forever. Follow-ups: 'ranges & functions', 'lazy vs eager recompute', 'undo' (Command), 'huge sheets' (only recompute dirty cells). Signal: dependency graph + topological recompute of affected cells + cycle detection + formula expression parsing." },
    ],
    "A spreadsheet tests a dependency graph driving topological-order recalculation of only affected cells, plus cycle detection for circular references and formula parsing (Interpreter). Observer propagation is the equivalent framing.",
    ["Recomputing the entire sheet on any change instead of only affected dependents.",
     "Recomputing in arbitrary order (stale results) instead of topological order.",
     "Not detecting circular references (infinite recompute loop)."],
    0.6, { type: "Dependency graph", description: "Cells = nodes; formula reference A1→C1 = edge. On change, recompute reachable dependents in topological order. A cycle = circular reference (#CIRCULAR).", alt: "Spreadsheet cells as a dependency graph recomputed in topological order, cycles flagged." }),

  T("lld_m12_t4", 4, "Design a Collaborative Whiteboard", "design-collaborative-whiteboard",
    ["case-study", "composite", "command", "realtime"],
    "Model a drawing whiteboard (Figma/Miro-style): shapes (lines, rectangles, groups), tools, undo/redo, and multiple users editing live. What patterns represent the shape tree, the tools, and editing?",
    "Shapes form a COMPOSITE tree (groups contain shapes/other groups, all drawable uniformly); each edit is a COMMAND (add/move/delete) enabling undo/redo; tools are a Strategy (pen/rect/select) deciding how input creates shapes; realtime sync broadcasts commands/ops to other users (the collaborative-editing idea).",
    [
      { kind: "concept", heading: "Shapes as a Composite",
        body: "A Shape has a common interface (draw, move, bounds, hit-test). Primitives (Line, Rectangle, Ellipse, Text) implement it; a GROUP is a composite that holds child shapes and implements the same interface — moving/drawing a group recurses to its children. This Composite tree lets the canvas treat one shape and a group of shapes uniformly (the canvas itself is the root group)." },
      { kind: "concept", heading: "Edits as Commands (undo/redo)",
        body: "Every action — add shape, move, resize, delete, change color — is a COMMAND with execute()/undo(). Push to an undo stack; undo/redo exactly as in the text-editor design. This gives unlimited history and is also the unit you SYNC to collaborators." },
      { kind: "concept", heading: "Tools as Strategy",
        body: "The active tool decides how pointer input becomes actions: the Rectangle tool turns a drag into an add-rectangle command; the Select tool turns a drag into move/resize; the Pen tool builds a freehand path. Model tools as a Strategy so adding a tool doesn't touch the canvas/event code." },
      { kind: "concept", heading: "Realtime collaboration & follow-ups",
        body: "Multiple editors: broadcast each user's commands/operations to others and apply them, converging the shared scene — the same OT/CRDT convergence concern as Google Docs (here over a shape tree; CRDTs for shapes avoid conflicts on concurrent edits to the same object). Presence shows others' cursors. Follow-ups: 'z-order/layers', 'hit-testing efficiently' (spatial index), 'large boards' (viewport culling). Signal: Composite shape tree + Command undo/redo + tool Strategy + op broadcast for realtime convergence." },
    ],
    "A whiteboard composes a Composite shape tree (groups treated like shapes), Command-based undo/redo, a tool Strategy, and op-broadcast realtime convergence (OT/CRDT). It ties together several patterns plus the collaborative-editing idea.",
    ["A flat shape list with special-case group handling instead of a Composite tree.",
     "Ad-hoc undo instead of Command objects (which are also the sync unit).",
     "Ignoring concurrent-edit convergence (OT/CRDT) for multi-user editing."],
    0.6, { type: "Shape composite", description: "Canvas (root group) → Groups → Shapes (Line/Rect/Text) — all share a Shape interface (Composite). Edits = Commands on an undo stack, broadcast to collaborators for convergence.", alt: "Whiteboard shapes as a Composite tree with Command-based edits broadcast to collaborators." }),

  T("lld_m12_t5", 5, "Design an Expression Evaluator", "design-expression-evaluator",
    ["case-study", "interpreter", "parsing", "tree"],
    "Build a calculator that evaluates strings like '3 + 4 * (2 - 1)' with correct operator precedence and parentheses. How do you turn the text into something evaluable, and which pattern represents the parsed expression?",
    "Tokenize the input, parse it into an Abstract Syntax Tree (AST) respecting precedence/associativity (shunting-yard or recursive descent), then EVALUATE the tree — the Interpreter pattern (each node knows how to evaluate itself). Nodes: NumberLiteral, BinaryOp(+,-,*,/), with parentheses handled during parsing.",
    [
      { kind: "concept", heading: "Three stages: tokenize → parse → evaluate",
        body: "Don't evaluate the raw string directly. (1) TOKENIZE: scan characters into tokens (numbers, operators, parens). (2) PARSE: build a structured representation respecting precedence and parentheses. (3) EVALUATE: walk that structure to compute the result. Separating these stages is what keeps the design clean and extensible." },
      { kind: "concept", heading: "The AST + Interpreter pattern",
        body: "Parse into an Abstract Syntax Tree: leaves are NumberLiteral nodes, internal nodes are operators (BinaryOp with left/right children). The tree's SHAPE encodes precedence — '3 + 4 * 2' puts * lower so it evaluates first. Each node implements evaluate() (a literal returns its value; a BinaryOp evaluates children then applies its operator). This is the INTERPRETER pattern: a class per grammar rule, each evaluating itself recursively." },
      { kind: "concept", heading: "Getting precedence right",
        body: "Two standard parsing approaches: the SHUNTING-YARD algorithm (operator + output stacks, popping by precedence) producing postfix/an AST, or RECURSIVE-DESCENT (a function per precedence level: parseExpression → parseTerm → parseFactor). Both encode that * / bind tighter than + -, and parentheses override precedence by forcing a sub-expression. Associativity (left vs right) matters for - and /." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Add functions/variables' (extend the grammar + node types — Interpreter scales well; a context holds variable bindings). 'Unary minus', 'exponent (right-assoc)', 'error handling' (mismatched parens). For very large grammars, a real parser generator beats hand-rolled Interpreter. Signal: tokenize → parse to AST (shunting-yard/recursive-descent for precedence) → Interpreter-pattern evaluate()." },
    ],
    "An expression evaluator is the textbook Interpreter-pattern problem: tokenize → parse into an AST whose shape encodes precedence (shunting-yard or recursive descent) → recursively evaluate(). It separates parsing from evaluation cleanly.",
    ["Evaluating the raw string left-to-right, ignoring precedence and parentheses.",
     "Not building an AST (so the structure can't encode precedence/associativity).",
     "Mixing tokenizing, parsing, and evaluation into one tangled pass."],
    0.6, { type: "Expression AST", description: "'3 + 4 * 2' → tokens → AST: (+ 3 (* 4 2)); tree shape encodes precedence. Each node evaluate()s itself recursively (Interpreter pattern).", alt: "Expression parsed into an AST whose shape encodes operator precedence, evaluated recursively." }),

  T("lld_m12_t6", 6, "Design an Object Pool / Connection Pool", "design-object-pool",
    ["case-study", "object-pool", "concurrency", "resource"],
    "Creating a DB connection (or thread, or large buffer) is expensive. Build a pool that reuses a bounded set of them safely across many threads, blocking or failing when exhausted. What's the acquire/release contract?",
    "The Object Pool pattern: pre-create a bounded set of reusable objects; acquire() hands out an idle one (blocking or timing out if none free), release() returns it to the pool (reset/validated). Thread-safe handout, a max size to cap resource use, idle eviction + health checks for connections. It trades creation cost for reuse.",
    [
      { kind: "concept", heading: "Why pool",
        body: "Some objects are EXPENSIVE to create/destroy (DB connections do a TCP+auth handshake; threads cost stack memory; big buffers cost allocation). Creating one per request is slow and can exhaust the resource (e.g. the DB's max connections). The Object Pool keeps a reusable set alive and lends them out — amortizing creation cost and bounding total usage." },
      { kind: "concept", heading: "Acquire / release contract",
        body: "acquire() returns an idle object from the pool (marking it in-use); the caller MUST release() it back when done (often via try-with-resources/RAII so it's returned even on exception). Released objects are validated/reset and returned to the idle set. Leaking (never releasing) starves the pool — the classic bug. A 'borrowed' object must not be used after release." },
      { kind: "concept", heading: "Bounding & exhaustion",
        body: "The pool has a MAX size (to cap resource consumption). When all are in use and acquire() is called: either BLOCK until one frees (with a timeout → fail), or grow up to max then block, or reject. This back-pressure is intentional — it protects the downstream resource. Min-idle keeps some warm; the pool must be thread-safe (a concurrent structure + condition/semaphore for waiters)." },
      { kind: "concept", heading: "Health & follow-ups",
        body: "Pooled connections can go STALE (DB closed it) → validate on borrow (test query) or evict idle ones past a TTL; remove and recreate broken ones. Follow-ups: 'sizing the pool' (too small → contention; too big → overwhelm the DB), 'fairness' (FIFO waiters), 'leak detection' (warn on long borrows). Signal: Object Pool pattern — bounded reusable set + thread-safe acquire/release + block-or-timeout on exhaustion + validation/eviction for connections." },
    ],
    "An object/connection pool is the Object Pool pattern: a bounded, thread-safe set of reusable resources with an acquire/release contract, block-or-timeout on exhaustion, and validation/idle-eviction for connections. Leaks (no release) are the classic failure.",
    ["Unbounded pool growth (overwhelming the downstream resource like the DB).",
     "Leaking objects by not releasing them (try/finally or RAII required).",
     "Not validating/evicting stale connections before handing them out."],
    0.6, { type: "Object pool", description: "Pool holds idle + in-use sets (≤ max). acquire(): take idle (or block/timeout if none). release(): validate/reset → return to idle. Thread-safe; evict stale.", alt: "Object pool lending bounded reusable resources with acquire/release and exhaustion handling." }),

  T("lld_m12_t7", 7, "Design a Coupon / Discount Engine", "design-coupon-engine",
    ["case-study", "strategy", "rules", "chain-of-responsibility"],
    "Model an e-commerce discount engine: percentage-off, flat-off, BOGO, free-shipping, with eligibility rules (min cart value, specific items, first-order) and rules for stacking. How do you keep many promo types and rules extensible?",
    "Each discount type is a Strategy (computes the discount for a cart); eligibility is a set of composable RULES/Specifications (min-value, category, user-segment) evaluated before applying; stacking/exclusivity and ordering of multiple coupons is a pipeline (Chain of Responsibility). New promo types/rules plug in without touching the engine (Open–Closed).",
    [
      { kind: "concept", heading: "Discount types as Strategy",
        body: "Percentage-off, flat-amount-off, buy-one-get-one, free-shipping, tiered (spend X get Y) — each computes a discount differently. Model each as a discount Strategy implementing apply(cart) → discount. Adding a new promo type is a new Strategy class, no changes to existing code (Open–Closed). The engine just runs the applicable strategies." },
      { kind: "concept", heading: "Eligibility as composable rules",
        body: "A coupon applies only if conditions hold: min cart value, contains specific items/categories, user is first-order or in a segment, within a date window, usage limit not exceeded. Model each condition as a RULE/Specification (the Specification pattern) that the cart is tested against; combine with AND/OR. This keeps eligibility declarative and reusable across coupons rather than buried in if-statements." },
      { kind: "concept", heading: "Stacking, exclusivity, ordering",
        body: "Multiple coupons raise questions: can they STACK? Is one EXCLUSIVE (can't combine)? In what ORDER do they apply (percentage before or after flat-off changes the total)? Model the application as a pipeline / Chain of Responsibility where each eligible discount is applied in a defined order, respecting exclusivity, and the engine picks the best combination (or the best single coupon) for the customer." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Best discount for the customer' (evaluate combinations, maximize savings), 'usage limits / per-user caps' (atomic counters — flash-sale-style), 'fraud/abuse', 'auto-apply vs code', 'audit why a discount applied'. Signal: discount Strategy per type + composable eligibility Rules/Specifications + a Chain/pipeline for stacking & ordering, all Open–Closed for new promos." },
    ],
    "A discount engine tests extensible rules: a Strategy per discount type, composable eligibility Rules/Specifications, and a Chain/pipeline for stacking, exclusivity, and application order — all Open–Closed so new promos plug in. Best-combination selection is the twist.",
    ["A giant if/else over promo types instead of a Strategy per type (Open–Closed).",
     "Hardcoding eligibility conditions instead of composable rules/specifications.",
     "Ignoring stacking/exclusivity/order (percentage-before-vs-after-flat changes totals)."],
    0.5),

  T("lld_m12_t8", 8, "Design a Course Registration System", "design-course-registration",
    ["case-study", "concurrency", "state", "waitlist"],
    "Model university course registration: students enroll in course sections with limited seats, must satisfy prerequisites, avoid time conflicts, and join a waitlist when full. What guards seat capacity under a registration rush, and how does the waitlist work?",
    "CourseSection has limited seats; enrollment ATOMICALLY decrements available seats (no over-enrollment under the rush — flash-sale discipline), after checking prerequisites and schedule conflicts. A full section adds students to an ordered WAITLIST (a queue); a drop promotes the next waitlisted student. Entities: Student, Course, Section, Enrollment.",
    [
      { kind: "concept", heading: "Entities",
        body: "Course (catalog entry, prerequisites) has Sections (a specific offering: time slot, room, instructor, seat capacity). A Student has completed courses (transcript) and current Enrollments. Enrollment links a Student to a Section. Prerequisites are a dependency relationship between courses (a DAG)." },
      { kind: "concept", heading: "Capacity under a rush",
        body: "Registration opens and everyone rushes the same popular sections — extreme contention on the seat count, exactly the flash-sale problem. Enroll by ATOMICALLY decrementing availableSeats (compare-and-set / conditional update) so you never exceed capacity; the one that drops it below zero is rejected → waitlist. Don't 'check seats then enroll' non-atomically." },
      { kind: "concept", heading: "Validation: prereqs & conflicts",
        body: "Before enrolling, validate: (1) PREREQUISITES met (the student's transcript satisfies the course's required courses — a check over the prereq DAG); (2) no TIME CONFLICT with the student's other sections (interval-overlap check, like the calendar); (3) not already enrolled / max credit hours. These are composable rules run before the seat reservation." },
      { kind: "concept", heading: "Waitlist & follow-ups",
        body: "When full, add the student to an ORDERED WAITLIST (FIFO queue) for that section. When someone DROPS, automatically promote the head of the waitlist (re-running their validations) and notify them (Observer). Enrollment has a small State (ENROLLED / WAITLISTED / DROPPED / COMPLETED). Follow-ups: 'priority registration (seniors first)', 'swap sections atomically', 'hold seats during a multi-course cart'. Signal: atomic seat capacity (no over-enroll) + prereq/conflict validation rules + ordered waitlist with auto-promotion on drop." },
    ],
    "Course registration tests atomic seat-capacity under a rush (flash-sale discipline, no over-enroll), composable validation (prerequisites over a DAG + time-conflict overlap), and an ordered waitlist auto-promoting on drops. Priority registration is the twist.",
    ["Non-atomic 'check seats then enroll' that over-enrolls during the rush.",
     "Skipping prerequisite/time-conflict validation before enrolling.",
     "A waitlist that isn't ordered or doesn't auto-promote (and re-validate) on a drop."],
    0.5, { type: "Enrollment flow", description: "Enroll: validate prereqs + no time-conflict → atomic decrement seats; if full → ordered waitlist (FIFO). Drop → promote head of waitlist (re-validate) + notify.", alt: "Course enrollment: validation, atomic seat capacity, and a waitlist promoted on drops." }),
];

const EXERCISES = [
  // Hospital
  pm({ topicId: "lld_m12_t1", exerciseId: "lld_m12_t1_pm_1", position: 1, level: "hard", title: "Slot booking",
    scenario: "Two patients book the same doctor slot at once. What prevents the double-booking?",
    options: ["Atomic reservation (unique constraint/transaction on (doctor, slot))", "An in-memory free-check then book", "First in the UI wins", "A longer session timeout"], correct: "Atomic reservation (unique constraint/transaction on (doctor, slot))",
    explanation: "Slot booking is the double-booking race; reserve atomically so only one patient gets the slot." }),
  pm({ topicId: "lld_m12_t1", exerciseId: "lld_m12_t1_pm_2", position: 2, level: "medium", title: "Multi-role access",
    scenario: "Doctors, nurses, admins, and patients each have different permissions. Model this with…",
    options: ["Role-based access control (roles → permissions)", "If-checks scattered everywhere", "One admin role for all", "No access control"], correct: "Role-based access control (roles → permissions)",
    explanation: "RBAC centralizes who-can-do-what; scattering role checks is error-prone and unmaintainable." }),
  pm({ topicId: "lld_m12_t1", exerciseId: "lld_m12_t1_pm_3", position: 3, level: "medium", title: "Appointment lifecycle",
    scenario: "Cancelled, no-show, completed, rescheduled — these are best modelled as…",
    options: ["An Appointment State machine", "Boolean flags", "Separate unrelated tables", "A status integer with no rules"], correct: "An Appointment State machine",
    explanation: "A State machine enforces legal transitions and triggers actions (reminders, billing)." }),
  // Airline
  pm({ topicId: "lld_m12_t2", exerciseId: "lld_m12_t2_pm_1", position: 1, level: "medium", title: "Flight vs seat",
    scenario: "Seat availability should be tracked…",
    options: ["Per flight (a per-flight SeatMap), not on the physical aircraft layout", "Once on the aircraft, shared by all flights", "Per passenger", "In the booking only"], correct: "Per flight (a per-flight SeatMap), not on the physical aircraft layout",
    explanation: "The aircraft defines the layout; each flight instance has its own seat availability." }),
  pm({ topicId: "lld_m12_t2", exerciseId: "lld_m12_t2_pm_2", position: 2, level: "hard", title: "Seat race",
    scenario: "Booking seat 14C on a flight must not double-sell. Use…",
    options: ["An atomic check on (flight, seat) + a timed HELD state during checkout", "A non-atomic availability check then save", "Trusting clients to pick unique seats", "A bigger DB pool"], correct: "An atomic check on (flight, seat) + a timed HELD state during checkout",
    explanation: "Atomic reservation prevents double-sell; a timed hold locks the seat while payment completes." }),
  pm({ topicId: "lld_m12_t2", exerciseId: "lld_m12_t2_pm_3", position: 3, level: "medium", title: "Fare classes",
    scenario: "Economy/business and advance/flexible pricing is best modelled as…",
    options: ["A pricing Strategy (fare classes)", "Hardcoded prices", "A Singleton", "A Memento"], correct: "A pricing Strategy (fare classes)",
    explanation: "A pricing Strategy isolates fare-class/dynamic pricing so it can change without touching booking." }),
  // Spreadsheet
  pm({ topicId: "lld_m12_t3", exerciseId: "lld_m12_t3_pm_1", position: 1, level: "hard", title: "Track dependencies",
    scenario: "What structure captures that C1=A1+B1 depends on A1 and B1?",
    options: ["A directed dependency graph (A1→C1, B1→C1)", "A flat list of cells", "A single formula string", "A hash of values"], correct: "A directed dependency graph (A1→C1, B1→C1)",
    explanation: "A dependency graph tells you exactly which cells to recompute when an input changes." }),
  pm({ topicId: "lld_m12_t3", exerciseId: "lld_m12_t3_pm_2", position: 2, level: "hard", title: "Recompute order",
    scenario: "When A1 changes, dependents must be recomputed in…",
    options: ["Topological order (dependencies before dependents)", "Random order", "Alphabetical cell order", "Reverse insertion order"], correct: "Topological order (dependencies before dependents)",
    explanation: "Topological order ensures each cell is recomputed only after the cells it depends on — no stale values." }),
  pm({ topicId: "lld_m12_t3", exerciseId: "lld_m12_t3_pm_3", position: 3, level: "medium", title: "A1 depends on A1",
    scenario: "A1 depends on B1 which depends on A1. This is detected as…",
    options: ["A cycle in the dependency graph → circular reference", "A valid formula", "A syntax error only", "A performance issue"], correct: "A cycle in the dependency graph → circular reference",
    explanation: "A cycle means no valid recompute order; detect it (failed topo-sort / back-edge) and flag #CIRCULAR." }),
  // Whiteboard
  pm({ topicId: "lld_m12_t4", exerciseId: "lld_m12_t4_pm_1", position: 1, level: "medium", title: "Groups of shapes",
    scenario: "Treating a single shape and a group of shapes uniformly (draw/move) uses…",
    options: ["The Composite pattern (a shape tree)", "A flat array with type checks", "A Singleton canvas", "A Visitor only"], correct: "The Composite pattern (a shape tree)",
    explanation: "Composite lets groups and primitives share a Shape interface; operations recurse into children." }),
  pm({ topicId: "lld_m12_t4", exerciseId: "lld_m12_t4_pm_2", position: 2, level: "medium", title: "Undo edits",
    scenario: "Add/move/delete with undo/redo (and these are also synced to others) are modelled as…",
    options: ["Command objects on an undo stack", "Snapshots of the whole canvas each edit", "Booleans", "A Memento per pixel"], correct: "Command objects on an undo stack",
    explanation: "Commands give undo/redo and are the unit broadcast to collaborators." }),
  pm({ topicId: "lld_m12_t4", exerciseId: "lld_m12_t4_pm_3", position: 3, level: "medium", title: "Pen vs select",
    scenario: "How input creates shapes (pen draws, rect tool drags a rectangle, select moves) is modelled as…",
    options: ["A tool Strategy", "A switch in the event handler per tool", "A Decorator", "A Factory only"], correct: "A tool Strategy",
    explanation: "A tool Strategy lets you add tools without modifying the canvas/event-handling code." }),
  // Expression evaluator
  pm({ topicId: "lld_m12_t5", exerciseId: "lld_m12_t5_pm_1", position: 1, level: "hard", title: "Represent the expression",
    scenario: "'3 + 4 * 2' should be parsed into…",
    options: ["An AST whose shape encodes precedence (Interpreter pattern)", "A left-to-right evaluated string", "A flat token list evaluated in order", "A single number"], correct: "An AST whose shape encodes precedence (Interpreter pattern)",
    explanation: "An AST puts * lower than +, so 4*2 evaluates first; each node evaluate()s itself (Interpreter)." }),
  pm({ topicId: "lld_m12_t5", exerciseId: "lld_m12_t5_pm_2", position: 2, level: "medium", title: "Stages",
    scenario: "The clean pipeline for evaluating an expression string is…",
    options: ["Tokenize → parse to AST → evaluate", "Evaluate the raw string directly", "Parse → tokenize → guess", "Just use eval()"], correct: "Tokenize → parse to AST → evaluate",
    explanation: "Separating tokenizing, parsing, and evaluation keeps it clean and extensible." }),
  pm({ topicId: "lld_m12_t5", exerciseId: "lld_m12_t5_pm_3", position: 3, level: "medium", title: "Precedence",
    scenario: "Which approach correctly handles operator precedence and parentheses while parsing?",
    options: ["Shunting-yard or recursive-descent parsing", "Reading left to right ignoring precedence", "Sorting the tokens", "Evaluating parentheses last"], correct: "Shunting-yard or recursive-descent parsing",
    explanation: "Both shunting-yard and recursive descent encode precedence/associativity and handle parentheses." }),
  // Object pool
  pm({ topicId: "lld_m12_t6", exerciseId: "lld_m12_t6_pm_1", position: 1, level: "medium", title: "Why pool",
    scenario: "Why pool DB connections instead of creating one per request?",
    options: ["Creation is expensive and the DB caps total connections", "Connections are immutable", "Pools are required by SQL", "To save disk"], correct: "Creation is expensive and the DB caps total connections",
    explanation: "Pooling amortizes the costly handshake and bounds total connections so the DB isn't overwhelmed." }),
  pm({ topicId: "lld_m12_t6", exerciseId: "lld_m12_t6_pm_2", position: 2, level: "hard", title: "Exhaustion",
    scenario: "All pooled connections are in use and acquire() is called. A good pool…",
    options: ["Blocks until one frees (with a timeout) — back-pressure", "Creates unlimited new connections", "Returns null silently", "Crashes"], correct: "Blocks until one frees (with a timeout) — back-pressure",
    explanation: "Bounding the pool and blocking/timing out protects the downstream resource; unbounded growth defeats the purpose." }),
  pm({ topicId: "lld_m12_t6", exerciseId: "lld_m12_t6_pm_3", position: 3, level: "medium", title: "Classic bug",
    scenario: "What's the classic object-pool bug?",
    options: ["Leaking — never calling release() (use try/finally or RAII)", "Releasing too often", "Pooling too few objects", "Validating on borrow"], correct: "Leaking — never calling release() (use try/finally or RAII)",
    explanation: "Not returning borrowed objects starves the pool; ensure release() runs even on exceptions." }),
  // Coupon engine
  pm({ topicId: "lld_m12_t7", exerciseId: "lld_m12_t7_pm_1", position: 1, level: "medium", title: "Many promo types",
    scenario: "Percentage-off, flat-off, BOGO, free-shipping — adding new types without touching existing code uses…",
    options: ["A Strategy per discount type (Open–Closed)", "A giant if/else over promo types", "A Singleton discounter", "A Memento"], correct: "A Strategy per discount type (Open–Closed)",
    explanation: "Each discount type is a Strategy; new promos are new classes, no edits to the engine." }),
  pm({ topicId: "lld_m12_t7", exerciseId: "lld_m12_t7_pm_2", position: 2, level: "medium", title: "Eligibility",
    scenario: "Conditions like 'min cart ₹500', 'first order', 'category=shoes' are best modelled as…",
    options: ["Composable rules / the Specification pattern", "Inline if-statements per coupon", "A single boolean", "Hardcoded constants"], correct: "Composable rules / the Specification pattern",
    explanation: "Specifications make eligibility declarative and combinable (AND/OR), reusable across coupons." }),
  pm({ topicId: "lld_m12_t7", exerciseId: "lld_m12_t7_pm_3", position: 3, level: "hard", title: "Multiple coupons",
    scenario: "When several coupons could apply, what must the engine handle?",
    options: ["Stacking/exclusivity and application order (a Chain/pipeline)", "Always apply all of them", "Apply a random one", "Reject all"], correct: "Stacking/exclusivity and application order (a Chain/pipeline)",
    explanation: "Order matters (percentage before/after flat), some are exclusive — model as an ordered pipeline picking the best." }),
  // Course registration
  pm({ topicId: "lld_m12_t8", exerciseId: "lld_m12_t8_pm_1", position: 1, level: "hard", title: "Capacity under rush",
    scenario: "Everyone rushes a popular section at registration open. To never over-enroll…",
    options: ["Atomically decrement available seats (reject when it hits 0)", "Check seats then enroll non-atomically", "Allow over-enrollment then trim later", "Add more DB connections"], correct: "Atomically decrement available seats (reject when it hits 0)",
    explanation: "It's the flash-sale problem; atomic seat decrement prevents exceeding capacity under contention." }),
  pm({ topicId: "lld_m12_t8", exerciseId: "lld_m12_t8_pm_2", position: 2, level: "medium", title: "Before enrolling",
    scenario: "What must be validated before enrolling a student?",
    options: ["Prerequisites met + no time conflict + not over credit limit", "Only that seats exist", "Only the student's name", "Nothing"], correct: "Prerequisites met + no time conflict + not over credit limit",
    explanation: "Prereqs (over the course DAG), schedule-overlap conflicts, and credit limits are composable pre-checks." }),
  pm({ topicId: "lld_m12_t8", exerciseId: "lld_m12_t8_pm_3", position: 3, level: "medium", title: "When full",
    scenario: "A full section should…",
    options: ["Add the student to an ordered waitlist; auto-promote on a drop", "Reject with no recourse", "Silently enroll anyway", "Randomly bump an enrolled student"], correct: "Add the student to an ordered waitlist; auto-promote on a drop",
    explanation: "A FIFO waitlist promotes (and re-validates) the next student when someone drops, notifying them." }),
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
  const totals = await recomputeLldTotals();
  console.log(`\nDone — M12 Case Studies VI seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
