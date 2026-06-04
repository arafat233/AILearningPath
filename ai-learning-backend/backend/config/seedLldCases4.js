/**
 * Seed — LLD module M10: Case Studies IV (more OOD problems):
 * Hotel Booking, Food Delivery, Digital Wallet, Deck of Cards, Online
 * Auction, Calendar, Text Editor (undo/redo), Concurrent Cache.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases4.js   ·   npm: npm run seed:lld-cases4
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last),
 *       so visual_aids are not wiped.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m10";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 10,
  name: "Case Studies IV — More OOD", slug: "case-studies-4",
  description: "Eight more object-oriented design problems: Hotel Booking, Food Delivery, Digital Wallet, Deck of Cards, Online Auction, Calendar, a Text Editor with undo/redo, and a thread-safe Concurrent Cache.",
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
  T("lld_m10_t1", 1, "Design a Hotel Booking System", "design-hotel-booking",
    ["case-study", "booking", "state", "concurrency"],
    "Search rooms by date range, book one, and never double-book the same room for overlapping dates under concurrent requests. What's the object model and the concurrency guard?",
    "Model Hotel → RoomType → Room, and a Reservation with a date range + State machine (PENDING→CONFIRMED→CHECKED_IN→CHECKED_OUT / CANCELLED). Availability is 'no overlapping confirmed reservation for this room'; the double-booking guard is an atomic check-and-reserve (DB unique constraint / transaction / lock), not an in-memory check.",
    [
      { kind: "concept", heading: "Object model",
        body: "Hotel has RoomTypes (Deluxe, Suite — price, capacity, amenities) and Rooms (a physical room of a type). A Reservation links a Guest to a Room (or RoomType) over a date range [checkIn, checkOut) with a status. Payment and a pricing Strategy (seasonal/dynamic rates) hang off the booking. Search returns RoomTypes with ≥1 available room for the range." },
      { kind: "concept", heading: "Availability = no overlap",
        body: "A room is available for [in, out) if it has NO confirmed reservation whose range overlaps. Overlap test: existing.in < out AND existing.out > in. Searching availability is this overlap query per candidate room. Keep ranges half-open [in, out) so back-to-back bookings (checkout = next checkin) don't falsely overlap." },
      { kind: "concept", heading: "The double-booking guard",
        body: "The crux: two users booking the last matching room concurrently must not both succeed. An in-memory 'is it free?' then 'reserve' has a race. Make it ATOMIC: a DB transaction that re-checks overlap and inserts under a unique/exclusion constraint, optimistic locking (version), or a per-room lock. Whoever loses the race gets 'no longer available'." },
      { kind: "concept", heading: "Reservation lifecycle (State)",
        body: "Reservation is a State machine: PENDING (held, awaiting payment, with a timeout that releases the hold) → CONFIRMED → CHECKED_IN → CHECKED_OUT, or → CANCELLED (with a refund Strategy by cancellation policy). The hold-with-timeout prevents inventory being locked forever by abandoned carts. Follow-ups: overbooking strategy, waitlist, group bookings." },
    ],
    "Hotel booking tests an inventory + date-range model with a concurrency guard. The signal is the half-open overlap check, an ATOMIC check-and-reserve (not in-memory), and a Reservation State machine with timed holds.",
    ["Checking availability in memory then reserving — a race that double-books.",
     "Closed date ranges that make back-to-back bookings falsely overlap.",
     "No timed hold, so abandoned carts lock inventory forever."],
    0.5, { type: "Reservation state", description: "Reservation: PENDING (timed hold) → CONFIRMED → CHECKED_IN → CHECKED_OUT; any active state → CANCELLED. Booking guarded by an atomic no-overlap check.", alt: "Reservation state machine from pending hold through checkout, with cancel." }),

  T("lld_m10_t2", 2, "Design a Food Delivery System", "design-food-delivery",
    ["case-study", "state", "observer", "strategy"],
    "Model Swiggy/DoorDash: a customer orders from a restaurant, an order moves through states, and a delivery agent is assigned and tracked. What patterns carry the order and the assignment?",
    "An Order State machine (PLACED→ACCEPTED→PREPARING→READY→PICKED_UP→DELIVERED, + CANCELLED) drives the flow; Observer notifies customer/restaurant/agent on transitions; a Strategy assigns the best delivery agent (nearest/least-loaded). Core entities: Restaurant→Menu→MenuItem, Cart, Order, DeliveryAgent.",
    [
      { kind: "concept", heading: "Entities",
        body: "Restaurant owns a Menu of MenuItems (price, availability). A Customer builds a Cart (line items + quantities), which checks out into an Order (snapshot of items+prices, address, payment, totals via a pricing Strategy: fees, taxes, discounts/coupons). A DeliveryAgent fulfils it. Keep the Order a snapshot so later menu/price changes don't mutate placed orders." },
      { kind: "concept", heading: "Order as a State machine",
        body: "Order status: PLACED → ACCEPTED (restaurant confirms) → PREPARING → READY_FOR_PICKUP → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED; CANCELLED from early states only. Each state defines legal next states and who can trigger them — illegal transitions (e.g. deliver before pickup) are rejected. This is the same State pattern as the earlier order/restaurant studies." },
      { kind: "concept", heading: "Assignment & notifications",
        body: "When an order is READY, an assignment Strategy picks a DeliveryAgent — nearest available, least-loaded, or rating-weighted — pluggable so the algorithm can change. Observer/pub-sub pushes status changes to all interested parties (customer app, restaurant dashboard, agent app) without the Order knowing who's listening. Live location is a stream of agent-location updates." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Surge pricing' (a pricing Strategy). 'Agent declines / times out' (re-assign — Chain of Responsibility or retry). 'Batch multiple orders to one agent'. 'Restaurant out of an item mid-order'. 'Ratings'. Signal: Order State machine + Observer for notifications + Strategy for assignment & pricing; Order is an immutable snapshot." },
    ],
    "Food delivery composes State (order lifecycle), Observer (notify parties), and Strategy (agent assignment + pricing). The signal is the immutable order snapshot and legal-transition enforcement.",
    ["Mutating the order when the menu/price changes instead of snapshotting at checkout.",
     "Hardcoding agent-assignment logic instead of a pluggable Strategy.",
     "Letting any transition happen (no legal-next-state enforcement)."],
    0.5, { type: "Order state", description: "Order: PLACED → ACCEPTED → PREPARING → READY → PICKED_UP → DELIVERED; CANCELLED from early states. Observer notifies customer/restaurant/agent on each transition.", alt: "Food order state machine from placed to delivered, observers notified on transitions." }),

  T("lld_m10_t3", 3, "Design a Digital Wallet", "design-digital-wallet",
    ["case-study", "ledger", "transaction", "concurrency"],
    "Build a wallet: add money, pay a merchant, transfer to a friend — with balances that never go negative or lose money under concurrent operations. How do you model money correctly?",
    "Use a double-entry LEDGER: money is never edited in place; every operation appends immutable Transaction entries that sum to zero (debit one account, credit another). Balance is derived (or a cached running total). Concurrency uses atomic balance updates with an insufficient-funds check; idempotency keys prevent double-charges.",
    [
      { kind: "concept", heading: "Money is a ledger, not a number",
        body: "The classic mistake is storing balance as a mutable field and incrementing/decrementing it. Instead, model an append-only LEDGER of immutable Transactions. A transfer is two entries (debit A, credit B) that net to zero — double-entry bookkeeping. Balance = sum of an account's entries (or a maintained running balance reconciled against the ledger). This gives a full audit trail and makes lost-update bugs visible." },
      { kind: "concept", heading: "Represent money safely",
        body: "Never use float/double for money (rounding errors). Use integer minor units (paise/cents) or BigDecimal, and always carry a currency. A Money value object (amount + currency) with arithmetic that forbids mixing currencies prevents a whole class of bugs." },
      { kind: "concept", heading: "Atomicity & no-negative-balance",
        body: "A transfer must be all-or-nothing: debit and credit commit together in a transaction, or neither does. Under concurrency, two simultaneous withdrawals must not both pass the balance check then overdraw — guard with an atomic conditional update (UPDATE ... WHERE balance >= amount) or row lock / optimistic version. The loser fails with insufficient funds." },
      { kind: "concept", heading: "Idempotency & follow-ups",
        body: "A retried 'pay' request must not charge twice — require a client IDEMPOTENCY KEY; a duplicate returns the original result. Follow-ups: 'reverse a transaction' (append a compensating entry, never delete), 'cross-currency' (exchange-rate entry), 'holds/authorizations' (pending entries), 'reconciliation'. Signal: append-only double-entry ledger + integer money + atomic guarded updates + idempotency." },
    ],
    "A digital wallet tests modelling money correctly: an append-only double-entry ledger, integer/Money types (never float), atomic no-overdraw updates, and idempotency keys. Reversals are compensating entries.",
    ["Storing a mutable balance field and editing it instead of an append-only ledger.",
     "Using float/double for money (rounding loss).",
     "No idempotency key, so a retried payment double-charges; non-atomic debit+credit."],
    0.6, { type: "Double-entry transfer", description: "Transfer A→B = two immutable ledger entries that net to zero: debit A, credit B, committed atomically. Balance = sum of entries.", alt: "A transfer recorded as a debit and a credit ledger entry netting to zero." }),

  T("lld_m10_t4", 4, "Design a Deck of Cards (Card Game)", "design-deck-of-cards",
    ["case-study", "enum", "composition", "strategy"],
    "Model a standard 52-card deck and a game like Blackjack: cards, deck, shuffle, deal, and game rules. How do you keep cards reusable while game-specific scoring stays separate?",
    "Card = (Suit, Rank) as enums/value objects (immutable, reusable). Deck holds the 52 Cards with shuffle() and dealCard(). Game-specific value/scoring lives OUTSIDE the Card (e.g. a Blackjack hand-evaluator) so the deck is reusable across Poker/Blackjack/Rummy. Composition: Game has Deck, Players, each with a Hand.",
    [
      { kind: "concept", heading: "Card & Deck",
        body: "Card is an immutable value object of Suit (4 enum values) × Rank (13 enum values) → 52 distinct cards. Deck holds a List<Card>, initialised to all 52, with shuffle() (Fisher–Yates) and dealCard() (pop from top, track dealt vs remaining). Keep Card free of game rules so it's reusable." },
      { kind: "concept", heading: "Keep scoring out of the Card",
        body: "An Ace is 1 or 11 in Blackjack, 14 in some Poker contexts, 1 in others — so a card's 'value' is GAME-SPECIFIC. Don't put getValue() on Card. Instead a game supplies a scoring Strategy / hand-evaluator that interprets ranks. This keeps the same Deck/Card usable across Blackjack, Poker, Rummy without modification (Open–Closed)." },
      { kind: "concept", heading: "Game structure (Blackjack)",
        body: "Composition: BlackjackGame has a Deck, a Dealer, and Players, each holding a Hand (List<Card>). Game loop: deal → players hit/stand (could be a turn State or Strategy for dealer's fixed rules) → evaluate hands → settle bets. A HandEvaluator computes the best total (Aces flexible). The game rules, not the cards, own the logic." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Support multiple games' (reusable Deck + per-game evaluator — the whole point). 'Multiple decks / shoe' (Blackjack uses 6–8 decks). 'Jokers' (extend Rank). 'Fair shuffle' (Fisher–Yates, seeded for testing). Signal: immutable Card value objects, a reusable Deck, and game-specific scoring kept out of the card via a Strategy/evaluator." },
    ],
    "Deck of cards tests enums/value objects + composition + keeping game rules out of reusable entities. The signal is an immutable Card, a reusable Deck, and game-specific scoring via a Strategy/evaluator (Ace = 1 or 11).",
    ["Putting getValue() on Card, baking one game's rules into the reusable card.",
     "Mutable cards or a non-uniform shuffle.",
     "Coupling Deck to a specific game instead of composing Game → Deck."],
    0.4),

  T("lld_m10_t5", 5, "Design an Online Auction System", "design-online-auction",
    ["case-study", "observer", "state", "concurrency"],
    "Build eBay-style auctions: an item has a timed auction, users place increasing bids, others are notified, and a winner is settled at close. What patterns and the concurrency guard?",
    "Auction is a State machine (DRAFT→ACTIVE→CLOSED→SETTLED); bids must beat the current highest by a min increment, validated atomically to avoid two equal 'winning' bids; Observer notifies watchers/outbid bidders; a timer/Strategy closes the auction (fixed end, or anti-snipe extension).",
    [
      { kind: "concept", heading: "Entities & state",
        body: "Auction wraps an Item, a start/reserve price, a min bid increment, a start/end time, the current highest Bid, and a list of Bids. Auction is a State machine: DRAFT → ACTIVE (accepting bids) → CLOSED (time up, no more bids) → SETTLED (winner pays, item transfers) — or CANCELLED. Bids are only legal in ACTIVE." },
      { kind: "concept", heading: "Bid validation (atomic)",
        body: "A valid bid must exceed currentHighest + minIncrement and meet the reserve. The race: two bidders read the same currentHighest and both 'win'. Validate-and-apply ATOMICALLY (lock the auction row / optimistic version / atomic compare-and-set on highest) so exactly one becomes the new highest and the other is told to bid higher. This is the same concurrency discipline as inventory/wallet." },
      { kind: "concept", heading: "Notifications via Observer",
        body: "Bidders WATCH an auction; on a new highest bid, Observer/pub-sub notifies watchers and the just-outbid bidder ('you've been outbid'). The Auction publishes events; it doesn't know its subscribers. At close, the winner and seller are notified. Decoupled and easy to add channels (email/push)." },
      { kind: "concept", heading: "Closing & follow-ups",
        body: "A scheduler closes auctions at end-time (see the job-scheduler design). Anti-snipe: a bid in the final seconds extends the end time (a closing Strategy). Proxy/auto-bid: the system bids up to a user's max automatically. Follow-ups: reserve not met (no sale), payment failure (offer to next bidder), fraud. Signal: State machine + atomic bid guard + Observer + timed close." },
    ],
    "Online auction composes State (auction lifecycle), atomic bid validation (concurrency), Observer (outbid/watch notifications), and a timed/anti-snipe close. The signal is the atomic 'beat the highest' guard.",
    ["Non-atomic bid validation letting two bids tie as 'winning'.",
     "Polling for outbid status instead of Observer/event notifications.",
     "Ignoring the close mechanism (scheduler) and anti-snipe extension."],
    0.5, { type: "Auction state", description: "Auction: DRAFT → ACTIVE (bids beat highest+increment, atomically) → CLOSED (timer) → SETTLED; observers notified on new-highest and close.", alt: "Auction state machine with atomic bid validation and observer notifications." }),

  T("lld_m10_t6", 6, "Design a Calendar Application", "design-calendar-app",
    ["case-study", "recurrence", "interval", "strategy"],
    "Model Google Calendar: events (one-off and recurring), invitations with RSVP, and detecting scheduling conflicts. How do you represent 'every Tue until June' without storing infinite rows?",
    "Store a recurrence RULE (RRULE: frequency, interval, until/count, by-day) on the event and EXPAND occurrences on demand for a queried window — never materialise infinite instances. Exceptions (edited/deleted single occurrences) are overrides. Conflict detection is interval overlap across a user's busy times.",
    [
      { kind: "concept", heading: "Event model",
        body: "An Event has title, [start, end) (interval), an organizer, and Attendees each with an RSVP status (ACCEPTED/DECLINED/TENTATIVE — a small State per attendee). One-off events are a single interval. The hard part is recurrence." },
      { kind: "concept", heading: "Recurrence as a rule, not rows",
        body: "Don't pre-create a row per occurrence (a 'daily forever' event is infinite). Store a RECURRENCE RULE (RRULE — frequency DAILY/WEEKLY/MONTHLY, interval, until/count, byDay) plus a start. To show a date range, EXPAND the rule into concrete occurrences only for that window. This keeps storage O(1) per series and queries bounded." },
      { kind: "concept", heading: "Exceptions / overrides",
        body: "'Move just next Tuesday's meeting' or 'delete this one occurrence' → store an EXCEPTION/override keyed by the original occurrence date (a modified instance or a cancellation), layered over the expanded series. 'Edit this and following' splits the series. This override list is small and avoids materialising everything." },
      { kind: "concept", heading: "Conflicts & follow-ups",
        body: "Conflict detection = interval-overlap check (existing.start < new.end && existing.end > new.start) across the user's events in the window (after expanding recurrences) — the same overlap logic as hotel booking and the interval-scheduling DSA pattern. Follow-ups: time zones (store UTC + tz, expand in local tz), reminders (scheduler), free/busy across attendees, shared calendars. Signal: RRULE + on-demand expansion + overrides + interval-overlap conflicts." },
    ],
    "A calendar tests recurrence-rule modelling (expand on demand, not infinite rows), per-occurrence overrides, and interval-overlap conflict detection. Time zones (store UTC) are the classic follow-up.",
    ["Pre-materialising a row per recurring occurrence (infinite for 'daily forever').",
     "No override mechanism for editing/deleting a single occurrence.",
     "Storing local times without UTC + timezone, breaking DST and travel."],
    0.5),

  T("lld_m10_t7", 7, "Design a Text Editor with Undo/Redo", "design-text-editor-undo",
    ["case-study", "command", "memento", "stack"],
    "Build an editor supporting type, delete, and unlimited undo/redo. Snapshotting the whole document on every keystroke is wasteful. What pattern gives cheap, reversible operations?",
    "Model each edit as a COMMAND object that knows how to execute() and undo() (or carries a Memento of just the changed region). Push executed commands on an UNDO stack; undo() pops and reverses, pushing onto a REDO stack; a new edit clears redo. This is the canonical Command + (optionally) Memento undo design.",
    [
      { kind: "concept", heading: "Edits as Command objects",
        body: "Each user action (InsertText, DeleteRange, Replace) is a Command capturing what changed and where — enough to execute() it and undo() it (e.g. DeleteCommand stores the removed text + position so undo re-inserts it). Commands encapsulate the change as a first-class object — the heart of the Command pattern." },
      { kind: "concept", heading: "Two stacks",
        body: "Maintain an UNDO stack and a REDO stack. Doing an edit: execute() it and push onto undo. Undo: pop the undo stack, call its undo(), push it onto redo. Redo: pop redo, execute() again, push back onto undo. A NEW edit after an undo CLEARS the redo stack (you've branched history). This gives unlimited, O(1)-per-step undo/redo." },
      { kind: "concept", heading: "Command vs Memento",
        body: "Command stores the inverse operation (compact — store just the delta). Memento stores a SNAPSHOT of state to restore (simpler but heavier if you snapshot the whole doc). The efficient editor uses Command/delta; Memento suits coarse-grained state (a small object). Don't snapshot the entire document per keystroke — store only the affected region/delta." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Coalesce keystrokes' (group a burst of typing into one undo unit — a CompositeCommand / transaction). 'Limit memory' (cap the undo stack / drop oldest). 'Efficient text storage' (gap buffer / piece table / rope so inserts aren't O(n)). 'Collaborative editing' → OT/CRDT (see the Google Docs system design). Signal: Command (execute/undo) + undo & redo stacks + clear-redo-on-new-edit." },
    ],
    "Undo/redo is the Command-pattern design: edits as command objects with execute()/undo(), an undo stack and a redo stack, redo cleared on a new edit. Store deltas, not full-document snapshots.",
    ["Snapshotting the whole document each keystroke instead of storing per-edit deltas.",
     "Forgetting to clear the redo stack when a new edit branches history.",
     "Treating undo as a single 'previous state' rather than a stack (no multi-level undo)."],
    0.5, { type: "Undo/redo stacks", description: "Edit → execute() + push to UNDO. Undo: pop UNDO, run undo(), push to REDO. Redo: pop REDO, execute(), push to UNDO. New edit clears REDO.", alt: "Undo and redo stacks driven by Command objects with execute and undo." }),

  T("lld_m10_t8", 8, "Design a Thread-Safe Concurrent Cache", "design-concurrent-cache",
    ["case-study", "concurrency", "lru", "thread-safe"],
    "Take the LRU cache and make it safe and fast under many threads, with per-key TTL and a way to load a missing value without a stampede. What goes beyond a plain lock?",
    "Make get/put atomic with locking, but avoid one global lock: use a concurrent map / lock striping (per-bucket locks) for parallel access. Add TTL expiry, and for cache-miss loading use compute-if-absent so concurrent misses for the same key load it ONCE (no stampede). It's the LRU cache hardened for concurrency.",
    [
      { kind: "concept", heading: "From LRU to thread-safe",
        body: "The single-threaded LRU cache (HashMap + doubly-linked list, O(1) get/put) breaks under concurrency: two threads mutating the linked list corrupt it. The naive fix — one global lock around every get/put — is correct but serializes ALL access, killing throughput. We want correctness without that bottleneck." },
      { kind: "concept", heading: "Reduce contention",
        body: "Use a concurrent map (e.g. ConcurrentHashMap) and/or LOCK STRIPING: partition keys into N segments, each with its own lock, so operations on different keys proceed in parallel (only same-segment ops contend). The recency/eviction structure still needs careful synchronization — many real caches (Caffeine) use approximate-LRU / sampled eviction or per-segment LRU to avoid a globally-locked list." },
      { kind: "concept", heading: "Stampede-free loading",
        body: "On a miss, multiple threads requesting the same absent key shouldn't all hit the backing store. Use computeIfAbsent / a per-key load lock (or a future placeholder) so the value is computed ONCE and the others wait and reuse it. This is request coalescing — the same cache-stampede fix as the distributed cache, applied in-process." },
      { kind: "concept", heading: "TTL & follow-ups",
        body: "Per-entry TTL: store an expiry; treat expired entries as misses (lazy) and/or sweep them (active). Follow-ups: 'size-based eviction under concurrency' (atomic size accounting), 'write-through vs write-back', 'weak/soft references for memory pressure'. Signal: concurrent map + lock striping (not one global lock) + computeIfAbsent for stampede-free loads + TTL." },
    ],
    "A concurrent cache hardens the LRU design for threads: lock striping / a concurrent map (not one global lock) for parallel access, computeIfAbsent to coalesce concurrent misses, and per-entry TTL. It links the LRU LLD and cache-stampede ideas.",
    ["A single global lock around get/put (correct but serializes all access).",
     "Concurrent misses all loading the same key (no computeIfAbsent coalescing).",
     "Ignoring that the eviction/recency structure itself needs synchronization."],
    0.6),
];

const EXERCISES = [
  // Hotel
  pm({ topicId: "lld_m10_t1", exerciseId: "lld_m10_t1_pm_1", position: 1, level: "hard", title: "Double-booking guard",
    scenario: "Two users book the last matching room for overlapping dates at the same time. What prevents a double-booking?",
    options: ["An atomic check-and-reserve (transaction/unique constraint/lock)", "An in-memory 'is it free?' check then reserve", "First-come UI ordering", "A bigger thread pool"], correct: "An atomic check-and-reserve (transaction/unique constraint/lock)",
    explanation: "Check-then-reserve in memory races; the no-overlap check and insert must be atomic so only one wins." }),
  pm({ topicId: "lld_m10_t1", exerciseId: "lld_m10_t1_pm_2", position: 2, level: "medium", title: "Range semantics",
    scenario: "To let checkout-day = next guest's checkin-day without a false overlap, use…",
    options: ["Half-open ranges [checkIn, checkOut)", "Closed ranges [checkIn, checkOut]", "Single dates only", "Ignore time zones"], correct: "Half-open ranges [checkIn, checkOut)",
    explanation: "Half-open intervals make back-to-back bookings not overlap (existing.in < out AND existing.out > in)." }),
  pm({ topicId: "lld_m10_t1", exerciseId: "lld_m10_t1_pm_3", position: 3, level: "medium", title: "Abandoned carts",
    scenario: "A reservation is created but payment never completes. What keeps inventory from being locked forever?",
    options: ["A PENDING hold with a timeout that releases it", "Manual admin cleanup", "Never holding inventory", "A longer TTL on the session"], correct: "A PENDING hold with a timeout that releases it",
    explanation: "A timed PENDING hold releases the room if payment isn't completed, freeing inventory automatically." }),
  // Food delivery
  pm({ topicId: "lld_m10_t2", exerciseId: "lld_m10_t2_pm_1", position: 1, level: "medium", title: "Order lifecycle",
    scenario: "What enforces that an order can't be DELIVERED before it's PICKED_UP?",
    options: ["A State machine defining legal transitions", "A boolean flag", "Sorting orders by time", "The UI"], correct: "A State machine defining legal transitions",
    explanation: "The State pattern defines each status's legal next states, rejecting illegal jumps like deliver-before-pickup." }),
  pm({ topicId: "lld_m10_t2", exerciseId: "lld_m10_t2_pm_2", position: 2, level: "medium", title: "Notify everyone",
    scenario: "Customer, restaurant, and agent must all be updated on status changes without the Order knowing who listens. Use…",
    options: ["Observer / pub-sub", "A giant if-else per party", "Polling the DB", "A Singleton notifier hardcoding recipients"], correct: "Observer / pub-sub",
    explanation: "Observer lets the Order publish status events while subscribers (apps/dashboards) react, fully decoupled." }),
  pm({ topicId: "lld_m10_t2", exerciseId: "lld_m10_t2_pm_3", position: 3, level: "medium", title: "Pick an agent",
    scenario: "Assigning the nearest / least-loaded delivery agent, with the algorithm swappable, is best modelled as a…",
    options: ["Strategy", "Singleton", "Memento", "Flyweight"], correct: "Strategy",
    explanation: "A pluggable assignment Strategy lets you swap nearest/least-loaded/rating-weighted without touching the order flow." }),
  // Wallet
  pm({ topicId: "lld_m10_t3", exerciseId: "lld_m10_t3_pm_1", position: 1, level: "hard", title: "Model money",
    scenario: "How should balances be modelled to be auditable and lossless?",
    options: ["An append-only double-entry ledger; balance is derived", "A mutable balance field you increment/decrement", "A float updated in place", "A single counter per user"], correct: "An append-only double-entry ledger; balance is derived",
    explanation: "Immutable ledger entries (debit+credit netting to zero) give an audit trail and avoid lost-update bugs." }),
  pm({ topicId: "lld_m10_t3", exerciseId: "lld_m10_t3_pm_2", position: 2, level: "medium", title: "Money type",
    scenario: "Which is the right representation for monetary amounts?",
    options: ["Integer minor units (cents) or BigDecimal, with a currency", "double", "float", "A formatted string"], correct: "Integer minor units (cents) or BigDecimal, with a currency",
    explanation: "Floating point loses precision; use integer minor units or BigDecimal and always carry the currency." }),
  pm({ topicId: "lld_m10_t3", exerciseId: "lld_m10_t3_pm_3", position: 3, level: "hard", title: "Retry safety",
    scenario: "A client retries a 'pay' request after a timeout. What stops a double charge?",
    options: ["An idempotency key — duplicates return the original result", "Charging again to be safe", "A unique timestamp", "A bigger DB lock"], correct: "An idempotency key — duplicates return the original result",
    explanation: "An idempotency key dedupes retried requests so the operation applies exactly once." }),
  // Deck of cards
  pm({ topicId: "lld_m10_t4", exerciseId: "lld_m10_t4_pm_1", position: 1, level: "medium", title: "Where does value live?",
    scenario: "An Ace is 1 or 11 in Blackjack but different elsewhere. Where should card 'value' logic go?",
    options: ["In a game-specific scoring Strategy/evaluator, not on Card", "As getValue() on Card", "In the Deck", "In a global constant"], correct: "In a game-specific scoring Strategy/evaluator, not on Card",
    explanation: "Card value is game-specific; keeping it out of Card makes the Deck reusable across Blackjack/Poker/Rummy." }),
  pm({ topicId: "lld_m10_t4", exerciseId: "lld_m10_t4_pm_2", position: 2, level: "easy", title: "Model a card",
    scenario: "A Card is best modelled as…",
    options: ["An immutable value object of Suit × Rank (enums)", "A mutable string", "An integer 0–51 only", "A subclass per card"], correct: "An immutable value object of Suit × Rank (enums)",
    explanation: "Suit and Rank enums combine into 52 immutable Card value objects — reusable and type-safe." }),
  pm({ topicId: "lld_m10_t4", exerciseId: "lld_m10_t4_pm_3", position: 3, level: "easy", title: "Shuffle",
    scenario: "For a uniformly random shuffle of the deck, use…",
    options: ["Fisher–Yates", "Sort by a random key (biased/ok) — but Fisher–Yates is standard", "Reverse the list", "Swap the first and last card"], correct: "Fisher–Yates",
    explanation: "Fisher–Yates produces a uniform permutation in O(n); seed it for reproducible tests." }),
  // Auction
  pm({ topicId: "lld_m10_t5", exerciseId: "lld_m10_t5_pm_1", position: 1, level: "hard", title: "Bid race",
    scenario: "Two bidders read the same highest bid and both submit a 'winning' bid. The fix?",
    options: ["Validate-and-apply the bid atomically (lock/optimistic version/CAS)", "Accept both and pick later", "Trust client timestamps", "Add a queue with no locking"], correct: "Validate-and-apply the bid atomically (lock/optimistic version/CAS)",
    explanation: "Only an atomic compare-and-set on the highest bid lets exactly one win; the other is told to bid higher." }),
  pm({ topicId: "lld_m10_t5", exerciseId: "lld_m10_t5_pm_2", position: 2, level: "medium", title: "Outbid alerts",
    scenario: "Notifying watchers and the just-outbid bidder of a new highest bid uses…",
    options: ["Observer / pub-sub on auction events", "Polling every second", "A cron job", "A Singleton"], correct: "Observer / pub-sub on auction events",
    explanation: "The auction publishes new-highest events; watchers/outbid bidders subscribe — decoupled notification." }),
  pm({ topicId: "lld_m10_t5", exerciseId: "lld_m10_t5_pm_3", position: 3, level: "medium", title: "Last-second bids",
    scenario: "A bid in the final seconds extends the end time to prevent sniping. This is best modelled as…",
    options: ["A pluggable closing Strategy (anti-snipe)", "A hardcoded if in the bid handler", "Disabling late bids", "A Memento"], correct: "A pluggable closing Strategy (anti-snipe)",
    explanation: "Anti-snipe extension is a closing Strategy so the close policy can vary without touching bid logic." }),
  // Calendar
  pm({ topicId: "lld_m10_t6", exerciseId: "lld_m10_t6_pm_1", position: 1, level: "hard", title: "Recurring events",
    scenario: "How do you store 'every weekday, forever' without infinite rows?",
    options: ["A recurrence rule (RRULE) expanded on demand for a window", "One row per occurrence", "A row per day for the next 100 years", "A boolean isRecurring only"], correct: "A recurrence rule (RRULE) expanded on demand for a window",
    explanation: "Store the rule and expand concrete occurrences only for the queried date range — O(1) storage per series." }),
  pm({ topicId: "lld_m10_t6", exerciseId: "lld_m10_t6_pm_2", position: 2, level: "medium", title: "Edit one occurrence",
    scenario: "Moving just next Tuesday's instance of a weekly meeting is handled by…",
    options: ["An exception/override for that occurrence layered over the series", "Splitting into 52 separate events", "Editing the whole series", "Deleting and recreating everything"], correct: "An exception/override for that occurrence layered over the series",
    explanation: "Per-occurrence overrides (modified/cancelled instances) layer over the expanded rule — small and precise." }),
  pm({ topicId: "lld_m10_t6", exerciseId: "lld_m10_t6_pm_3", position: 3, level: "medium", title: "Conflict check",
    scenario: "Detecting whether a new event clashes with existing ones is…",
    options: ["An interval-overlap test across the user's busy times", "A string compare of titles", "Checking only the start time", "Sorting events alphabetically"], correct: "An interval-overlap test across the user's busy times",
    explanation: "Overlap = existing.start < new.end && existing.end > new.start, across expanded events in the window." }),
  // Text editor
  pm({ topicId: "lld_m10_t7", exerciseId: "lld_m10_t7_pm_1", position: 1, level: "hard", title: "Undo mechanism",
    scenario: "Unlimited undo/redo of edits is most cleanly built with…",
    options: ["Command objects (execute/undo) on undo & redo stacks", "Snapshotting the whole document each keystroke", "A single 'previous state' variable", "Re-reading the file from disk"], correct: "Command objects (execute/undo) on undo & redo stacks",
    explanation: "Each edit is a Command storing its inverse; an undo stack and redo stack give multi-level undo/redo." }),
  pm({ topicId: "lld_m10_t7", exerciseId: "lld_m10_t7_pm_2", position: 2, level: "medium", title: "After an undo",
    scenario: "The user undoes twice, then types something new. What happens to the redo stack?",
    options: ["It's cleared (history branched)", "It's preserved", "It's merged into undo", "It's swapped with undo"], correct: "It's cleared (history branched)",
    explanation: "A new edit after undo branches history, so the redo stack is discarded." }),
  pm({ topicId: "lld_m10_t7", exerciseId: "lld_m10_t7_pm_3", position: 3, level: "medium", title: "Command vs Memento",
    scenario: "Storing just the changed region's delta (vs a full-state snapshot) corresponds to…",
    options: ["Command storing the inverse op (delta)", "Memento snapshotting full state", "Observer", "Flyweight"], correct: "Command storing the inverse op (delta)",
    explanation: "Command stores a compact inverse/delta; Memento snapshots whole state (heavier for big documents)." }),
  // Concurrent cache
  pm({ topicId: "lld_m10_t8", exerciseId: "lld_m10_t8_pm_1", position: 1, level: "hard", title: "Beyond a global lock",
    scenario: "A single global lock around get/put is correct but slow. What improves concurrency?",
    options: ["Lock striping / a concurrent map (per-segment locks)", "Removing all locks", "A bigger global lock", "Sleeping between ops"], correct: "Lock striping / a concurrent map (per-segment locks)",
    explanation: "Partitioning keys into independently-locked segments lets different-key operations run in parallel." }),
  pm({ topicId: "lld_m10_t8", exerciseId: "lld_m10_t8_pm_2", position: 2, level: "hard", title: "Miss stampede",
    scenario: "Many threads miss on the same absent key at once. How do you avoid all of them loading it?",
    options: ["computeIfAbsent / per-key load lock — compute once, others reuse", "Let every thread load it", "Return null to all", "Disable caching for that key"], correct: "computeIfAbsent / per-key load lock — compute once, others reuse",
    explanation: "Coalesce concurrent misses so the value loads once and the rest wait and reuse it (in-process stampede fix)." }),
  pm({ topicId: "lld_m10_t8", exerciseId: "lld_m10_t8_pm_3", position: 3, level: "medium", title: "Base structure",
    scenario: "The concurrent cache is fundamentally a hardened version of which structure?",
    options: ["The LRU cache (HashMap + doubly-linked list)", "A binary search tree", "A priority queue", "A trie"], correct: "The LRU cache (HashMap + doubly-linked list)",
    explanation: "It's the O(1) LRU cache made thread-safe with striping/concurrent maps and stampede-free loading." }),
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
  console.log(`\nDone — M10 Case Studies IV seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
