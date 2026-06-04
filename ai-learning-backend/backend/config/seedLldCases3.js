/**
 * Seed — LLD module M9: Case Studies III (more of AlgoMaster's catalog):
 * Minesweeper, Traffic Signal Control, Coffee Vending Machine, Task Management,
 * Inventory Management, Library Management, Restaurant Management, Pub-Sub.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases3.js   ·   npm: npm run seed:lld-cases3
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m9";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 9,
  name: "Case Studies III", slug: "case-studies-3",
  description: "Eight more machine-coding case studies: Minesweeper, Traffic Signal Control, Coffee Vending Machine, Task Management, Inventory, Library, Restaurant Management, and a Pub-Sub system.",
  estimatedHours: 5, prerequisites: ["lld_m1", "lld_m4"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff) => ({
  trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
  metadata: { estimated_minutes: 40, difficulty: 3, prerequisites: [], tags },
  hook: { question: hookQ, insight: hookI }, teaching: { blocks },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: [], estimatedMinutes: 40, difficulty: diff, xpReward: 60, visualizer: null,
});

const TOPICS = [
  T("lld_m9_t1", 1, "Design Minesweeper", "design-minesweeper",
    ["case-study", "minesweeper", "grid", "flood-fill"],
    "Click a cell: if it's a mine you lose; if it's empty with no adjacent mines, a whole region reveals at once. What models the board and the cascade?",
    "A grid of Cells (isMine, isRevealed, isFlagged, adjacentMines). Reveal uses flood-fill (BFS/DFS): revealing a 0-adjacent cell recursively reveals its neighbours. Game tracks state (Playing/Won/Lost). Mine placement + adjacency counts are setup; the reveal cascade is the core algorithm.",
    [
      { kind: "concept", heading: "Entities",
        body: "Board (grid of Cells, rows×cols, mineCount), Cell (isMine, isRevealed, isFlagged, adjacentMines), Game (board, state, cells-remaining). Adjacency counts are precomputed after mine placement: each non-mine cell stores how many of its ≤8 neighbours are mines." },
      { kind: "concept", heading: "Reveal = flood fill",
        body: "Clicking a cell: if mine → game over; if adjacentMines > 0 → reveal just that cell (shows the number); if adjacentMines == 0 → flood-fill: reveal it AND recursively reveal all neighbours (BFS/DFS), stopping at numbered cells. This cascade is the defining algorithm — the same flood-fill as number-of-islands." },
      { kind: "concept", heading: "Win/lose & flags",
        body: "Lose: reveal a mine. Win: all non-mine cells revealed (track a counter). Flagging marks suspected mines (toggle, doesn't reveal). First-click-safe (regenerate mines so the first click is never a mine) is a common refinement." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'First click never a mine' (place mines after the first click). 'Generalize the board size / mine density' (config). 'Chord click' (reveal neighbours of a satisfied number). 'Solver/auto-play' (constraint propagation). The signal stays: grid of Cells + flood-fill reveal + win-counter." },
    ],
    "Minesweeper tests grid modelling + the flood-fill reveal cascade (same as number-of-islands) + win/lose state. Recognising reveal-empty-region as flood fill is the key.",
    ["Not using flood-fill for the empty-region reveal cascade.",
     "Recomputing adjacency on every click instead of precomputing.",
     "Forgetting the win condition (all non-mine cells revealed)."],
    0.4),

  T("lld_m9_t2", 2, "Design a Traffic Signal Control System", "design-traffic-control",
    ["case-study", "traffic", "state", "scheduling"],
    "An intersection cycles its lights Red→Green→Yellow→Red per direction, never allowing conflicting greens. What models the safe cycling?",
    "Each signal is a State machine (Red→Green→Yellow→Red) with timed transitions; an intersection Controller coordinates directions so conflicting movements are never green together. It's State + a scheduler/timer, with safety as the invariant.",
    [
      { kind: "concept", heading: "Entities & State",
        body: "TrafficLight (current State: Red/Green/Yellow, duration per state), Direction/Approach, IntersectionController (owns the lights + the phase schedule), Timer. Each light is a State machine with timed transitions (Green→Yellow→Red→Green) — State pattern keeps each phase's behaviour + next-phase local." },
      { kind: "concept", heading: "Safety invariant: no conflicting greens",
        body: "The controller's core rule: never let conflicting directions (e.g. N-S and E-W) be green simultaneously. Model phases (a set of compatible movements that are green together) and cycle through phases; only one phase is active at a time. A yellow buffer separates phases. This safety constraint is what's graded." },
      { kind: "concept", heading: "Scheduling & adaptivity",
        body: "Fixed-time: each phase has a set duration, cycled by a timer. Adaptive: phase durations vary by sensed traffic (a Strategy — fixed vs adaptive vs emergency-preemption). Pedestrian signals and turn arrows add phases. Emergency vehicle preemption forces a phase." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Adaptive timing by traffic load' (a TimingStrategy). 'Pedestrian crossing requests' (extra phase + button). 'Emergency preemption' (override to a safe phase). 'Multiple coordinated intersections' (a green wave). The signal: State machine per light + a controller enforcing non-conflicting phases + pluggable timing." },
    ],
    "Traffic control is a State + scheduling design. The signal is per-light State machines coordinated by a controller that enforces the no-conflicting-greens safety invariant, with pluggable (fixed/adaptive) timing.",
    ["Modelling lights without the no-conflicting-greens safety invariant.",
     "A status enum + switch instead of State per light.",
     "Hard-coding fixed timing instead of a swappable strategy."],
    0.4),

  T("lld_m9_t3", 3, "Design a Coffee Vending Machine", "design-coffee-machine",
    ["case-study", "vending", "state", "inventory"],
    "Select a drink, pay, dispense — but only if there are enough ingredients (water, beans, milk). How is this different from the soda vending machine?",
    "Like the vending machine it's a State machine (Idle→Paid→Dispensing), but with a recipe-and-ingredient twist: each drink consumes quantities of shared ingredients, so availability = 'enough of every ingredient', and dispensing decrements them. Inventory of ingredients (not just slots) is the new modelling.",
    [
      { kind: "concept", heading: "Entities",
        body: "CoffeeMachine (State + balance), Recipe (drink → required ingredient quantities, e.g. espresso = 30 water + 18 beans), IngredientInventory (water/beans/milk levels), Payment. Unlike a soda machine with discrete cans, a coffee machine consumes shared, divisible ingredients across drinks." },
      { kind: "concept", heading: "Availability = recipe vs inventory",
        body: "A drink is available iff the inventory has ≥ every ingredient its recipe needs. Dispensing decrements each ingredient by the recipe amount (atomically, so two near-simultaneous orders can't both pass the check and over-consume). This recipe→ingredient consumption is the core difference from slot-based vending." },
      { kind: "concept", heading: "State + change-making",
        body: "States: Idle (await selection), Paid (await/confirm payment), Dispensing, OutOfIngredients. Reuse the vending-machine State pattern + change-making for cash. Refuse a drink (and refund) if any ingredient is short or change can't be made." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Low-ingredient alerts / refill mode' (Observer + admin state). 'Customizations (extra shot, oat milk)' (modify the recipe → more ingredient consumption — Decorator over a base recipe). 'Multiple sizes' (scaled recipes). The signal: State machine + recipe-to-ingredient inventory with atomic decrement." },
    ],
    "The coffee machine extends the vending-machine State design with recipe→ingredient consumption. The signal is availability as 'enough of every ingredient' + atomic multi-ingredient decrement, and Decorator for customizations.",
    ["Modelling discrete slots instead of shared divisible ingredients.",
     "Non-atomic ingredient decrement allowing over-consumption.",
     "Not reusing the State pattern from the basic vending machine."],
    0.4),

  T("lld_m9_t4", 4, "Design a Task Management System", "design-task-management",
    ["case-study", "task-management", "jira", "state"],
    "Jira/Trello: tasks with status (Todo→In-Progress→Done), assignees, priorities, due dates, comments, and boards. What's the model?",
    "Task is the core entity with a status State machine (workflow), assignee, priority, labels, and subtasks. Projects/Boards group tasks; users get notified on changes (Observer). Filtering/sorting (by assignee, status, due) is a Specification or query. The workflow state machine + notifications are the heart.",
    [
      { kind: "concept", heading: "Entities",
        body: "Task (title, description, status, priority, assignee, dueDate, labels, subtasks, comments), User, Project (has Tasks), Board/Sprint (a view/grouping of tasks), Comment, Activity log. A Task may have subtasks (Composite) and dependencies (blocks/blocked-by)." },
      { kind: "concept", heading: "Workflow as a State machine",
        body: "Status transitions (Todo→InProgress→InReview→Done, with Blocked/Cancelled) form a State machine — configurable per project (custom workflows). Each transition can have rules (only the assignee can move to InReview) and side effects (notify watchers). State keeps the workflow explicit and customizable." },
      { kind: "concept", heading: "Notifications, filtering, history",
        body: "Watchers are notified on changes (Observer / notification service). Filtering/searching tasks by assignee/status/label/due is a query (or composable Specification). An activity log (Command/event history) records every change for audit and undo." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Custom workflows per project' (configurable State machine). 'Task dependencies' (blocked-by graph; detect cycles). 'Sprints/velocity' (aggregations). 'Real-time board updates' (push). 'Permissions' (who can transition/assign). Signal: configurable status State machine + Observer notifications + Specification filtering." },
    ],
    "Task management exercises a configurable workflow State machine, Observer notifications, Composite subtasks, and Specification filtering — a combine-the-patterns design with a customizable workflow.",
    ["A fixed status field instead of a (configurable) State machine workflow.",
     "No notification mechanism on task changes.",
     "Ignoring task dependencies / cycle detection."],
    0.5),

  T("lld_m9_t5", 5, "Design an Inventory Management System", "design-inventory-management",
    ["case-study", "inventory", "stock", "observer"],
    "Track products and stock across warehouses, reorder when low, prevent overselling. What models stock and the reorder trigger?",
    "Product, Warehouse, and StockItem (product × warehouse → quantity) are the core; stock changes are transactions (receipt/sale/transfer). A low-stock threshold triggers reorder (Observer). Concurrency on stock (atomic decrement) prevents overselling — the recurring inventory crux.",
    [
      { kind: "concept", heading: "Entities",
        body: "Product (sku, name, price), Warehouse/Location, StockItem (product + warehouse + quantity + reorder threshold), StockTransaction (type: receipt/sale/transfer/adjustment, qty, timestamp). Stock lives per (product, warehouse); the transaction log makes every change auditable and reconstructable." },
      { kind: "concept", heading: "Reorder via Observer",
        body: "When a stock level crosses below its reorder threshold, raise a low-stock event → a reorder service places a purchase order (Observer / event-driven). This keeps the reorder rule decoupled from the stock-update code and auditable." },
      { kind: "concept", heading: "Concurrency: don't oversell",
        body: "Concurrent sales of the last units must not drive stock negative. Decrement atomically (conditional update WHERE quantity ≥ requested) so only valid decrements succeed. Transfers between warehouses are two-step (decrement source, increment dest) and should be transactional/compensating." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Multi-warehouse availability' (sum across locations, allocate by proximity). 'Reservations during checkout' (hold + TTL). 'Audit & reconciliation' (the transaction log). 'Batch/expiry tracking' (FIFO/FEFO). Signal: per-location stock + transaction log + atomic decrement + Observer reorder." },
    ],
    "Inventory management exercises stock-per-location modelling, an auditable transaction log, atomic decrement (no overselling), and Observer-driven reordering.",
    ["Storing a single global stock number instead of per-warehouse with a transaction log.",
     "Non-atomic decrement allowing negative stock / overselling.",
     "Hard-coding reorder logic into the sale path instead of event-driven."],
    0.5),

  T("lld_m9_t6", 6, "Design a Library Management System", "design-library-management",
    ["case-study", "library", "reservation", "state"],
    "Members borrow books, return them, reserve unavailable ones, and pay late fines. What models copies, loans, and the borrow lifecycle?",
    "Book (the title) vs BookCopy (a physical instance) is the key distinction; a Loan links a copy to a member with due dates; a copy has a state (Available/Loaned/Reserved/Lost). Reservations queue for unavailable titles; fines compute from overdue days (a Strategy).",
    [
      { kind: "concept", heading: "Book vs BookCopy (the key model)",
        body: "A Book is the catalog title (ISBN, author); a BookCopy is a physical copy with its own barcode + state. The library has N copies of a title; you loan a COPY, not the title. This title-vs-copy distinction is the modelling signal — conflating them is the classic mistake." },
      { kind: "concept", heading: "Loan lifecycle & reservations",
        body: "A BookCopy state machine: Available→Loaned (on checkout, with due date)→Available (on return) / Reserved / Lost. A Loan records member, copy, checkout/due/return dates. If all copies of a title are out, a member joins a Reservation queue (FIFO); when a copy returns, the next reserver is notified (Observer)." },
      { kind: "concept", heading: "Fines & limits",
        body: "Overdue → a fine computed from days-late × rate (a FineStrategy — flat, tiered, capped). Members have borrow limits (max copies). Pay fines before borrowing more. Renewal extends the due date if no one has reserved the title." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Reservation priority' (FIFO queue + notify). 'Different fine policies' (Strategy). 'Search the catalog' (by title/author/subject — index). 'E-books vs physical' (different copy types). Signal: Book/BookCopy split + copy State machine + reservation queue + FineStrategy." },
    ],
    "Library management hinges on the Book-vs-BookCopy distinction plus a copy State machine, a reservation queue (Observer notify), and a FineStrategy. The title/copy split is the key signal.",
    ["Conflating Book (title) with BookCopy (physical instance).",
     "No state machine for a copy's borrow lifecycle.",
     "Hard-coding the fine calculation instead of a strategy."],
    0.4),

  T("lld_m9_t7", 7, "Design a Restaurant Management System", "design-restaurant-management",
    ["case-study", "restaurant", "order", "state"],
    "Seat guests, take orders, route them to the kitchen, bill the table. Lots of moving parts — what are the entities and the order lifecycle?",
    "Table, Reservation, Menu/MenuItem, Order (with OrderItems and a status State machine: Placed→Preparing→Served→Paid), Bill, and Staff roles. The kitchen gets order events (Observer); billing aggregates the order. The order State machine + table/reservation management are the core.",
    [
      { kind: "concept", heading: "Entities",
        body: "Table (seats, status), Reservation, Menu (Categories → MenuItems with price), Order (table, items, status), OrderItem (menu item, qty, customizations), Bill (order total, tax, tip, split), Staff (waiter/chef/manager roles). An Order belongs to a table/session." },
      { kind: "concept", heading: "Order lifecycle & kitchen routing",
        body: "Order status is a State machine: Placed→Preparing→Ready→Served→Paid (with Cancelled). Placing/updating an order emits events to the kitchen display (Observer / a queue) — the waiter and kitchen are decoupled. Items can be added through the meal (state stays open until billing)." },
      { kind: "concept", heading: "Tables, reservations & billing",
        body: "Table management: assign/seat/free tables, handle reservations (time-slot booking — interval overlap, like meeting scheduler). Billing aggregates served items + tax/tip, supports split bills (per-person or per-item). Pricing/discounts via a Strategy (happy hour, combos)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Split the bill' (per person/item). 'Reservations with overlap' (interval check). 'Kitchen queue priority' (by order time / VIP). 'Inventory deduction per dish' (link to inventory). 'Multiple locations' (chain). Signal: Order State machine + Observer kitchen routing + table/reservation + billing aggregation." },
    ],
    "Restaurant management combines an Order State machine, Observer kitchen routing, interval-based reservations, and billing aggregation — a broad combine-the-patterns design.",
    ["No state machine for the order lifecycle.",
     "Coupling the waiter directly to the kitchen instead of event-driven routing.",
     "Ignoring reservation time-slot overlaps."],
    0.5),

  T("lld_m9_t8", 8, "Design a Pub-Sub System", "design-pubsub",
    ["case-study", "pub-sub", "observer", "messaging"],
    "Publishers send messages to topics; any number of subscribers to a topic receive them — and publishers don't know who's listening. What's the in-process design?",
    "A Topic-based publish-subscribe broker: publishers publish to a named Topic; the broker fans out each message to all current Subscribers of that topic. It's the Observer pattern generalized with topics + a broker — decoupling producers from consumers, the foundation of event systems.",
    [
      { kind: "concept", heading: "Entities",
        body: "Broker (manages topics + subscriptions), Topic (named channel), Publisher (publishes Messages to a topic), Subscriber (a callback/handler registered to a topic). The broker holds Map<Topic, Set<Subscriber>>; publish(topic, msg) delivers msg to every subscriber of that topic. Publishers and subscribers never reference each other." },
      { kind: "concept", heading: "It's Observer, generalized",
        body: "Pub-Sub is Observer with a broker and topics in between: instead of a subject holding its observers directly, a broker routes by topic, so many publishers and many subscribers interact only through the broker (full decoupling, many-to-many). subscribe/unsubscribe manage membership; lifecycle hygiene (unsubscribe to avoid leaks) is the same concern as Observer." },
      { kind: "concept", heading: "Delivery & concurrency",
        body: "Decide delivery semantics: synchronous (publish blocks until all subscribers handle) vs asynchronous (queue per subscriber + worker — slow subscribers don't block the publisher). Thread-safety: copy the subscriber set before iterating (a subscriber may unsubscribe during delivery — same CME concern as Observer). At scale this becomes Kafka/RabbitMQ (the distributed version)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Async, non-blocking delivery' (per-subscriber queue + workers). 'Wildcard/hierarchical topics' (a/b/* matching). 'Message persistence / replay' (durable log — Kafka). 'At-least-once + idempotent subscribers'. 'Backpressure for slow subscribers'. Signal: broker + Topic→Subscribers map (Observer generalized), and the in-process cousin of Kafka/RabbitMQ." },
    ],
    "In-process Pub-Sub is Observer generalized with a broker + topics. The signal is the broker routing by topic (many-to-many decoupling), safe iteration, async delivery options, and that it scales out to Kafka/RabbitMQ.",
    ["Coupling publishers to subscribers instead of routing through a broker/topic.",
     "Iterating subscribers without a copy (CME when one unsubscribes during delivery).",
     "Synchronous delivery letting one slow subscriber block the publisher."],
    0.5),
];

const EXERCISES = [
  // Minesweeper
  pm({ topicId: "lld_m9_t1", exerciseId: "lld_m9_t1_pm_1", position: 1, level: "medium", title: "The reveal cascade",
    scenario: "Clicking an empty cell with zero adjacent mines reveals a whole region. Which algorithm?",
    options: ["Flood fill (BFS/DFS)", "Binary search", "Dijkstra", "Quicksort"], correct: "Flood fill (BFS/DFS)",
    explanation: "Revealing a 0-adjacent cell recursively reveals neighbours — flood fill, the same as number-of-islands." }),
  pm({ topicId: "lld_m9_t1", exerciseId: "lld_m9_t1_pm_2", position: 2, level: "medium", title: "Adjacency counts",
    scenario: "When should each cell's adjacent-mine count be computed?",
    options: ["Once after mine placement (precomputed)", "On every click", "Never", "Only on win"], correct: "Once after mine placement (precomputed)",
    explanation: "Precompute adjacency once; recomputing per click is wasteful." }),
  pm({ topicId: "lld_m9_t1", exerciseId: "lld_m9_t1_pm_3", position: 3, level: "easy", title: "Win condition",
    scenario: "The player wins Minesweeper when…",
    options: ["All non-mine cells are revealed", "All cells are flagged", "Half the board is revealed", "Time runs out"], correct: "All non-mine cells are revealed",
    explanation: "Win = every safe cell revealed; track a counter of remaining non-mine cells." }),
  // Traffic
  pm({ topicId: "lld_m9_t2", exerciseId: "lld_m9_t2_pm_1", position: 1, level: "medium", title: "Per-light model",
    scenario: "A light cycling Red→Green→Yellow→Red with timed transitions is modelled as…",
    options: ["A State machine", "A Singleton", "A Visitor", "A Bloom filter"], correct: "A State machine",
    explanation: "Timed phase transitions with per-phase behaviour is the State pattern." }),
  pm({ topicId: "lld_m9_t2", exerciseId: "lld_m9_t2_pm_2", position: 2, level: "hard", title: "Safety invariant",
    scenario: "What invariant must the intersection controller enforce?",
    options: ["Conflicting directions are never green at the same time", "All lights are green together", "Yellow is skipped", "Each light is independent"], correct: "Conflicting directions are never green at the same time",
    explanation: "Model compatible phases; only one phase is active, with a yellow buffer — no conflicting greens." }),
  pm({ topicId: "lld_m9_t2", exerciseId: "lld_m9_t2_pm_3", position: 3, level: "medium", title: "Adaptive timing",
    scenario: "Switching between fixed-time and traffic-adaptive phase durations without changing the controller uses…",
    options: ["A Strategy (TimingStrategy)", "A Memento", "A Composite", "A Proxy"], correct: "A Strategy (TimingStrategy)",
    explanation: "Interchangeable timing policies behind one interface is the Strategy pattern." }),
  // Coffee
  pm({ topicId: "lld_m9_t3", exerciseId: "lld_m9_t3_pm_1", position: 1, level: "medium", title: "What's different from soda vending?",
    scenario: "A coffee machine differs from a slot-based soda machine because…",
    options: ["Drinks consume shared, divisible ingredients via recipes", "It has no states", "It needs no payment", "It can't run out"], correct: "Drinks consume shared, divisible ingredients via recipes",
    explanation: "Availability = enough of every ingredient a recipe needs (not discrete cans in slots)." }),
  pm({ topicId: "lld_m9_t3", exerciseId: "lld_m9_t3_pm_2", position: 2, level: "medium", title: "Availability check",
    scenario: "A drink is available when…",
    options: ["The inventory has ≥ every ingredient its recipe requires", "Any one ingredient is present", "The machine is idle", "Payment was made"], correct: "The inventory has ≥ every ingredient its recipe requires",
    explanation: "All recipe ingredients must be sufficiently stocked; dispensing decrements each atomically." }),
  pm({ topicId: "lld_m9_t3", exerciseId: "lld_m9_t3_pm_3", position: 3, level: "medium", title: "Customizations",
    scenario: "Adding 'extra shot' / 'oat milk' options that modify a base recipe fits which pattern?",
    options: ["Decorator", "Singleton", "Visitor", "Proxy"], correct: "Decorator",
    explanation: "Wrapping a base recipe to add ingredient cost/consumption is Decorator (like the beverage example)." }),
  // Task mgmt
  pm({ topicId: "lld_m9_t4", exerciseId: "lld_m9_t4_pm_1", position: 1, level: "medium", title: "Task workflow",
    scenario: "Todo→InProgress→InReview→Done (configurable per project) is best modelled as…",
    options: ["A (configurable) State machine", "A fixed enum field", "A Singleton", "A Bloom filter"], correct: "A (configurable) State machine",
    explanation: "Customizable status transitions with rules/side-effects are a State machine workflow." }),
  pm({ topicId: "lld_m9_t4", exerciseId: "lld_m9_t4_pm_2", position: 2, level: "medium", title: "Notify watchers",
    scenario: "Notifying watchers when a task changes uses which pattern?",
    options: ["Observer", "Strategy", "Adapter", "Flyweight"], correct: "Observer",
    explanation: "Watchers subscribe to a task; changes notify them — Observer (or a notification service)." }),
  pm({ topicId: "lld_m9_t4", exerciseId: "lld_m9_t4_pm_3", position: 3, level: "medium", title: "Filter tasks",
    scenario: "Composable filters (assignee AND status AND due-before) over tasks fit which pattern?",
    options: ["Specification", "Singleton", "Memento", "Bridge"], correct: "Specification",
    explanation: "Composable isSatisfiedBy rules combined with and/or are the Specification pattern." }),
  // Inventory
  pm({ topicId: "lld_m9_t5", exerciseId: "lld_m9_t5_pm_1", position: 1, level: "medium", title: "Model stock",
    scenario: "Stock should be modelled as…",
    options: ["Per (product, warehouse) with a transaction log", "A single global number per product", "A field on the order", "A cache only"], correct: "Per (product, warehouse) with a transaction log",
    explanation: "Stock is per location; a transaction log makes every change auditable and reconstructable." }),
  pm({ topicId: "lld_m9_t5", exerciseId: "lld_m9_t5_pm_2", position: 2, level: "hard", title: "Don't oversell",
    scenario: "Concurrent sales of the last units must not go negative. The decrement must be…",
    options: ["Atomic conditional (decrement WHERE quantity ≥ requested)", "A read then separate write", "Cached", "Eventually consistent"], correct: "Atomic conditional (decrement WHERE quantity ≥ requested)",
    explanation: "An atomic conditional decrement prevents negative stock under concurrency." }),
  pm({ topicId: "lld_m9_t5", exerciseId: "lld_m9_t5_pm_3", position: 3, level: "medium", title: "Reorder trigger",
    scenario: "Placing a purchase order when stock crosses below threshold is best done…",
    options: ["Event-driven (Observer) on a low-stock event", "Inside the sale code path", "On a manual check only", "Never"], correct: "Event-driven (Observer) on a low-stock event",
    explanation: "A low-stock event triggers reorder via Observer — decoupled from and not blocking the sale path." }),
  // Library
  pm({ topicId: "lld_m9_t6", exerciseId: "lld_m9_t6_pm_1", position: 1, level: "medium", title: "The key distinction",
    scenario: "What's the crucial entity distinction in a library system?",
    options: ["Book (title) vs BookCopy (physical instance)", "Member vs User", "Shelf vs Room", "Fine vs Fee"], correct: "Book (title) vs BookCopy (physical instance)",
    explanation: "You loan a physical BookCopy, not the title — modelling N copies per Book is the signal." }),
  pm({ topicId: "lld_m9_t6", exerciseId: "lld_m9_t6_pm_2", position: 2, level: "medium", title: "All copies out",
    scenario: "When every copy of a title is borrowed, a member who wants it…",
    options: ["Joins a reservation queue, notified when a copy returns", "Is rejected forever", "Gets a random other book", "Pays a fine"], correct: "Joins a reservation queue, notified when a copy returns",
    explanation: "A FIFO reservation queue holds waiters; returning a copy notifies the next (Observer)." }),
  pm({ topicId: "lld_m9_t6", exerciseId: "lld_m9_t6_pm_3", position: 3, level: "medium", title: "Fine policy",
    scenario: "Supporting flat vs tiered vs capped overdue fines without changing the loan code uses…",
    options: ["A FineStrategy", "A Singleton", "A Visitor", "A Proxy"], correct: "A FineStrategy",
    explanation: "Interchangeable fine-calculation policies behind one interface is Strategy." }),
  // Restaurant
  pm({ topicId: "lld_m9_t7", exerciseId: "lld_m9_t7_pm_1", position: 1, level: "medium", title: "Order lifecycle",
    scenario: "Placed→Preparing→Ready→Served→Paid is modelled as…",
    options: ["A State machine", "A Strategy", "A Singleton", "A Bloom filter"], correct: "A State machine",
    explanation: "The order's lifecycle with defined transitions is a State machine." }),
  pm({ topicId: "lld_m9_t7", exerciseId: "lld_m9_t7_pm_2", position: 2, level: "medium", title: "Kitchen routing",
    scenario: "How should placing an order reach the kitchen display without coupling waiter↔kitchen?",
    options: ["Emit an event (Observer / queue)", "Direct method call into the kitchen object", "A shared global variable", "A Singleton kitchen"], correct: "Emit an event (Observer / queue)",
    explanation: "Order events are pushed to the kitchen via Observer/queue — decoupled and async-friendly." }),
  pm({ topicId: "lld_m9_t7", exerciseId: "lld_m9_t7_pm_3", position: 3, level: "medium", title: "Reservations",
    scenario: "Booking a table for a time slot without double-booking is an instance of…",
    options: ["Interval-overlap checking (like meeting scheduler)", "Flood fill", "Binary search", "Hashing"], correct: "Interval-overlap checking (like meeting scheduler)",
    explanation: "Table reservations are time intervals; avoid overlaps — same as the meeting scheduler." }),
  // Pub-Sub
  pm({ topicId: "lld_m9_t8", exerciseId: "lld_m9_t8_pm_1", position: 1, level: "medium", title: "Core structure",
    scenario: "Publishers publish to topics; subscribers register per topic; a broker fans out. This generalizes which pattern?",
    options: ["Observer (with a broker + topics)", "Singleton", "Adapter", "Composite"], correct: "Observer (with a broker + topics)",
    explanation: "Pub-Sub is Observer generalized: a broker routes by topic for many-to-many decoupling." }),
  pm({ topicId: "lld_m9_t8", exerciseId: "lld_m9_t8_pm_2", position: 2, level: "hard", title: "Slow subscriber",
    scenario: "How do you stop one slow subscriber from blocking the publisher?",
    options: ["Asynchronous delivery (per-subscriber queue + workers)", "Synchronous delivery", "Remove all subscribers", "A bigger broker"], correct: "Asynchronous delivery (per-subscriber queue + workers)",
    explanation: "Async per-subscriber queues decouple delivery so a slow consumer doesn't block publishing." }),
  pm({ topicId: "lld_m9_t8", exerciseId: "lld_m9_t8_pm_3", position: 3, level: "medium", title: "Scales out to…",
    scenario: "The distributed, durable version of an in-process pub-sub broker is…",
    options: ["Kafka / RabbitMQ", "A bigger HashMap", "A CDN", "A thread pool"], correct: "Kafka / RabbitMQ",
    explanation: "At system scale, pub-sub becomes a message broker (Kafka/RabbitMQ) — same intent, network + durability added." }),
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
  console.log(`\nDone — M9 Case Studies III seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
