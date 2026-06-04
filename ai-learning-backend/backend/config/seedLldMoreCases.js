/**
 * Seed — LLD module M8: More Case Studies (breadth parity with AlgoMaster's
 * larger case-study catalog): ATM, Chess, Stack Overflow, Movie Booking,
 * Shopping Cart / e-commerce, Car Rental, Meeting Scheduler, In-Memory File System.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldMoreCases.js   ·   npm: npm run seed:lld-morecases
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m8";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 8,
  name: "More Case Studies", slug: "more-case-studies",
  description: "Eight more end-to-end LLD designs that combine the patterns and principles: ATM, Chess, Stack Overflow, Movie Booking, Shopping Cart, Car Rental, Meeting Scheduler, and an In-Memory File System.",
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
  T("lld_m8_t1", 1, "Design an ATM", "design-atm",
    ["case-study", "atm", "state"],
    "Insert card → PIN → pick withdraw → dispense cash → eject. Each step only allows certain actions and bad input must be rejected. What models the machine?",
    "An ATM is a State machine (NoCard → CardInserted → Authenticated → TransactionChoice → Dispensing), with a Bank/Account service for balance + auth, a CashDispenser that makes change, and a CardReader. State keeps each step's rules local instead of one giant switch.",
    [
      { kind: "concept", heading: "Requirements + entities",
        body: "Functional: authenticate (card + PIN), check balance, withdraw, deposit, eject card. Entities: ATM (current State + session), CardReader, Keypad, CashDispenser, Screen, and a BankService (validates PIN, debits/credits the Account). The ATM is a client of the bank — it doesn't own balances." },
      { kind: "concept", heading: "State pattern for the flow",
        body: "Each step is a State: NoCardState (only accept a card), HasCardState (only accept PIN), AuthenticatedState (allow transactions), DispensingState. Each state implements the operations and rejects illegal ones (you can't withdraw before authenticating). This replaces a tangled status-enum switch and makes transitions explicit (LLD M4 State)." },
      { kind: "concept", heading: "Cash dispensing & concurrency",
        body: "CashDispenser makes the amount from available denominations (greedy/DP), and refuses if it can't (exact-change problem) or the account/ATM lacks funds. Real ATMs are single-user at a time (the physical machine), but the BACKEND debit must be atomic + idempotent so a network retry doesn't double-debit." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Multiple transaction types' (a Transaction hierarchy or Command per operation, enabling a receipt/audit log). 'Wrong PIN 3 times' (lock the card — a state + counter). 'Hardware failure mid-dispense' (transaction rollback / reconciliation). 'Deposit checks/cash' (more states). The core signal stays: State for the flow + an atomic, idempotent backend debit." },
    ],
    "The ATM is a classic State-machine LLD prompt. The signal is modelling each step as a State (rejecting illegal actions), separating the ATM from the bank/account service, and atomic+idempotent debits.",
    ["Using a status-enum switch instead of the State pattern for the flow.",
     "Letting the ATM own account balances instead of delegating to a bank service.",
     "A non-atomic debit that a retry could double-apply."],
    0.4),

  T("lld_m8_t2", 2, "Design Chess", "design-chess",
    ["case-study", "chess", "polymorphism"],
    "8×8 board, six piece types each moving differently, turn alternation, check/checkmate. How do you model pieces so the engine isn't one giant switch on piece type?",
    "Polymorphism: an abstract Piece with isValidMove(from, to, board) overridden per type (Pawn/Knight/Bishop/Rook/Queen/King). A Board holds the 8×8 grid; a Game alternates turns, validates moves, and detects check/checkmate. New piece = new class, no engine edits (Open/Closed).",
    [
      { kind: "concept", heading: "Entities & the polymorphic Piece",
        body: "Board (8×8 of Cells, each holding 0..1 Piece), abstract Piece (color + abstract isValidMove(from,to,board)), concrete pieces overriding movement rules, Player, Move (from, to, captured?), and Game (board, players, current turn, status). The movement logic lives in each Piece subclass — the engine asks piece.isValidMove() rather than switching on type." },
      { kind: "concept", heading: "Move validation & game state",
        body: "A move is legal if: the piece's own rule allows it, the path is clear (sliding pieces), the destination isn't your own piece, AND it doesn't leave your king in check (simulate the move, test check, undo). Game tracks turn, check/checkmate/stalemate, and move history (enables undo via Memento/Command and special moves like castling/en-passant)." },
      { kind: "concept", heading: "Patterns in play",
        body: "Polymorphism + Open/Closed for pieces; Strategy could swap a human vs AI player (minimax); Memento/Command for undo and move history; a Factory to set up the initial board. The board-position evaluation for an AI is a separate concern from the rules engine." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Special moves' (castling, en-passant, promotion — handled in Game/Piece with history). 'Detect checkmate' (no legal move removes check). 'Add an AI' (Strategy: random vs minimax with alpha-beta). 'Undo' (Memento/Command stack). 'Network/2-player' (turn synchronization). The signal stays: polymorphic pieces own their movement; the Game owns turn + check rules." },
    ],
    "Chess tests polymorphic modelling (each piece owns its move rule, no type switch) plus game-state rules (check/checkmate, history). AI (Strategy) and undo (Memento) are common follow-ups.",
    ["A giant switch on piece type instead of polymorphic isValidMove per piece.",
     "Forgetting a move is illegal if it leaves your own king in check.",
     "Mixing AI evaluation into the rules engine."],
    0.5),

  T("lld_m8_t3", 3, "Design Stack Overflow", "design-stack-overflow",
    ["case-study", "stack-overflow", "qa"],
    "Questions, answers, comments, votes, tags, reputation, accept-an-answer. A content + reputation system — what are the entities and the tricky bits?",
    "Model Question/Answer/Comment as Posts (shared votable/commentable behaviour), Users with Reputation, Tags, and Votes. Reputation changes are driven by vote events (Observer); accepting an answer and badges are state on the question/user. It's a content platform: get the entity relationships and the vote→reputation flow right.",
    [
      { kind: "concept", heading: "Entities & relationships",
        body: "User (reputation, badges), Question (title, body, tags, author, status), Answer (body, author, accepted?), Comment, Tag, Vote (up/down, by whom). A Question has many Answers (1..*) and Tags (1..*); Answers and Questions are both votable + commentable — factor that into a Post base or a Votable/Commentable interface (composition). Vote stores the voter to prevent double-voting." },
      { kind: "concept", heading: "Reputation as event-driven",
        body: "Reputation isn't stored ad-hoc — it's derived from events: +10 for an upvoted answer, +15 for an accepted answer, −2 for a downvote, etc. Model votes/accepts as events that an observer applies to the author's reputation (Observer / an event handler). This keeps the rules in one place and makes reputation auditable/recomputable." },
      { kind: "concept", heading: "Voting, accepting, search",
        body: "Voting: dedup per (user, post) and update a denormalized score for cheap sorting. Accept: only the question's author can accept exactly one answer (state on the question). Search/feed: by tag, score, recency, or unanswered — backed by indexes (and Elasticsearch for full-text at scale). Permissions/privileges unlock with reputation thresholds." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Prevent double-voting' (store voters, unique per user). 'Badges' (rules triggered by events — Observer). 'Reputation privileges' (gate actions by threshold). 'Trending/feed' (sort by a score that decays with time). 'Full-text search' (Elasticsearch). The signal stays: shared votable/commentable Post behaviour + event-driven reputation.",
      },
    ],
    "Stack Overflow tests content-platform modelling: shared post behaviour (votable/commentable), event-driven reputation, dedup'd voting, and accept/badge state. It bridges LLD into light system design (search/feed).",
    ["Duplicating vote/comment logic across Question and Answer instead of sharing it.",
     "Computing reputation ad-hoc instead of from vote/accept events.",
     "Allowing double-voting (not storing the voter)."],
    0.5),

  T("lld_m8_t4", 4, "Design a Movie Booking System", "design-movie-booking",
    ["case-study", "booking", "concurrency"],
    "Pick a movie, a show, a theatre, then SEATS — and two users must never book the same seat. Where's the hard part?",
    "Like ticket booking (M5): the crux is concurrent seat reservation without double-booking — model a seat's state (Available→Held→Booked) and reserve atomically with a TTL hold. The entity model (Movie/Theatre/Screen/Show/Seat/Booking) supports browsing; the concurrency on seats is what's graded.",
    [
      { kind: "concept", heading: "Entities",
        body: "Movie, Theatre (has Screens), Screen (has Seats), Show (a Movie on a Screen at a time, with a seat-availability map), Seat (number, type, price), Booking (user, show, seats, status, payment), User. A Show owns the bookable seat instances for that screening — Seat availability is per-Show, not global." },
      { kind: "concept", heading: "The concurrency crux",
        body: "Thousands may want the same hot seat. Move a seat Available→Held only if currently Available, atomically (a conditional DB update / row lock / atomic Redis op), so only ONE concurrent request wins — no double-booking. Hold has a TTL (e.g. 10 min) for payment; expire → back to Available. Inventory needs STRONG consistency (overselling is unacceptable)." },
      { kind: "concept", heading: "Booking flow & pricing",
        body: "Browse (movie → city → theatre → show) reads availability; select seats → atomic hold → payment (async) → confirm (Held→Booked) or release on timeout/failure (a saga). Pricing varies by seat type/show time → a PricingStrategy. Searching shows by movie/city/date is a read-heavy query (cache it)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Hot release, 100k users' (a virtual waiting queue + atomic holds). 'Hold expiry' (TTL sweep / Redis TTL). 'Dynamic pricing' (Strategy). 'Payment fails after hold' (compensate: release seats — saga). 'Seat map must look consistent' (held seats show unavailable immediately). Mirrors the System-Design ticket-booking case — atomic check-and-set on inventory + strong consistency.",
      },
    ],
    "Movie booking is the LLD twin of the ticket-booking SD case. The signal is per-show seat state + an atomic conditional hold with TTL (no double-booking) on top of a clean Movie/Theatre/Show/Seat model, plus a PricingStrategy.",
    ["A non-atomic 'check then book' that lets two users grab the same seat.",
     "Modelling seat availability globally instead of per-Show.",
     "Holding seats forever (no TTL), starving other buyers."],
    0.5),

  T("lld_m8_t5", 5, "Design a Shopping Cart / E-commerce", "design-shopping-cart",
    ["case-study", "ecommerce", "cart", "strategy"],
    "Add items, apply a coupon, pick a payment method, check out, decrement stock. Lots of moving parts — which patterns keep it clean?",
    "Cart holds line items; pricing/discounts are Strategies (percentage, BOGO, coupon); payment methods are a Strategy + Factory; checkout orchestrates inventory + payment + order creation. The signal is decoupling pricing and payment behind interfaces, and getting inventory decrement right under concurrency.",
    [
      { kind: "concept", heading: "Entities",
        body: "Product (id, price, stock), Cart (LineItems = product + qty), Order (items, total, status, payment), User, Inventory, Coupon/Discount. The Cart computes a subtotal; discounts and taxes adjust it; the Order is the immutable record created at checkout. Stock lives in Inventory, not on the in-cart product snapshot." },
      { kind: "concept", heading: "Pricing & payment as Strategies",
        body: "Discounts vary (percentage off, buy-one-get-one, coupon code, member price) → a DiscountStrategy applied to the cart (composable, like the Specification pattern for eligibility). Payment methods (card, UPI, wallet, COD) → a PaymentStrategy chosen at checkout, created via a Factory. New discount or payment method = a new class, no checkout edits (OCP)." },
      { kind: "concept", heading: "Checkout flow & inventory",
        body: "Checkout: validate cart → reserve/decrement stock (atomically, so two buyers can't oversell the last unit) → charge payment (async) → create Order → on payment failure, release the reserved stock (a saga / compensating action). Inventory decrement under concurrency is the correctness crux (conditional update WHERE stock > 0)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Stack multiple coupons' (compose DiscountStrategies, define precedence). 'Reserve stock during checkout' (hold + TTL, like seat booking). 'Order state machine' (Placed→Paid→Shipped→Delivered/Cancelled — State). 'Save cart across devices' (persist per user). 'Recommendations' (separate service). Signal stays: Strategy for pricing/payment + atomic inventory + an Order state machine.",
      },
    ],
    "Shopping cart / e-commerce exercises Strategy (pricing + payment), Factory (payment creation), an Order state machine, and atomic inventory — a rich combine-the-patterns design.",
    ["Hard-coding discount/payment logic instead of swappable Strategies.",
     "Non-atomic stock decrement that allows overselling the last unit.",
     "Putting mutable stock on the cart's product snapshot instead of Inventory."],
    0.5),

  T("lld_m8_t6", 6, "Design a Car Rental System", "design-car-rental",
    ["case-study", "rental", "reservation", "inventory"],
    "Search available cars by location/dates, reserve one, pick it up, return it, charge for the period. What's the model and the booking conflict to avoid?",
    "Model Vehicle (type, location, status), VehicleInventory per location, Reservation (vehicle, user, date range), and a pricing Strategy by vehicle type/duration. The crux is availability over a DATE RANGE: don't double-book a car for overlapping dates — check for interval overlap atomically.",
    [
      { kind: "concept", heading: "Entities",
        body: "Vehicle (id, type, location, status), VehicleType (price/day, capacity), Location/Store (has an inventory), Reservation (vehicle, user, startDate, endDate, status), User, Payment. A Reservation is the booking of a specific vehicle for a date interval; availability is a function of existing reservations for that vehicle." },
      { kind: "concept", heading: "Availability over a date range",
        body: "Unlike seat booking (a single slot), a car is booked for an INTERVAL. 'Is this car available for [start,end]?' = no existing reservation overlaps that range (overlap if existing.start < end AND existing.end > start). Reserving must atomically re-check overlap and insert, so two requests can't both book overlapping ranges for the same car (a unique constraint or transactional check)." },
      { kind: "concept", heading: "Flow & pricing",
        body: "Search (location + date range + type) → list available vehicles → reserve (atomic overlap check) → pickup (status→Rented) → return (status→Available, compute final charge incl. late fees) → payment. Pricing = a Strategy over type × duration (+ insurance add-ons, seasonal surge). Vehicle lifecycle is a small State machine (Available/Reserved/Rented/Maintenance)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Late return fees / damage' (return logic + extra charges). 'One-way rentals' (pickup ≠ drop-off location — inventory transfer). 'Overbooking strategy' (deliberate, with reassignment). 'Search performance' (index by location + availability). 'Loyalty pricing' (Strategy). The interval-overlap availability check is the defining detail vs single-slot booking.",
      },
    ],
    "Car rental is a reservation-over-an-interval design — the twist vs seat/movie booking is date-RANGE overlap, not a single slot. The signal is the atomic overlap check + a pricing Strategy + a vehicle State machine.",
    ["Treating availability as a single slot instead of a date-range overlap check.",
     "A non-atomic reserve that allows overlapping bookings of the same car.",
     "Hard-coding pricing instead of a per-type/duration Strategy."],
    0.5),

  T("lld_m8_t7", 7, "Design a Meeting Scheduler", "design-meeting-scheduler",
    ["case-study", "calendar", "scheduling", "intervals"],
    "Book a meeting room for 2-3pm with 4 attendees — but only if the room AND everyone is free, and never double-book the room. What's the core algorithm?",
    "Model User/Room calendars as sets of time intervals; scheduling a meeting = checking no interval overlaps for the room and all attendees, then atomically inserting. 'Find a free slot for everyone' is interval intersection. Conflicts (double-booking) are prevented by an atomic overlap check, like other booking systems.",
    [
      { kind: "concept", heading: "Entities",
        body: "User, Room (capacity, location), Meeting (organizer, attendees, room, time interval, title), and a Calendar per User and per Room holding booked intervals. A Meeting is valid only if its interval doesn't overlap any existing interval on the Room's calendar or any attendee's calendar." },
      { kind: "concept", heading: "Interval overlap & free-slot search",
        body: "Two intervals [s1,e1] and [s2,e2] conflict if s1 < e2 AND s2 < e1. Booking checks the room + all attendees for any overlap. 'Suggest a free slot' for N people = merge everyone's busy intervals and find gaps of the needed length (interval merge / sweep line) within working hours — a classic intervals algorithm." },
      { kind: "concept", heading: "Concurrency & notifications",
        body: "Two organizers booking the same room/time race → make the insert atomic (re-check overlap inside a transaction, or a unique constraint on room+interval), so only one wins. On booking, notify attendees (Observer / notification service) and send invites; handle accept/decline, reschedule, and recurring meetings (expand the recurrence into intervals)." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Find the earliest slot that works for everyone' (interval merge across calendars). 'Recurring meetings' (a recurrence rule expanded to instances). 'Time zones' (store UTC, render local). 'Reschedule/cancel' (update intervals + notify). 'Room capacity' (reject if attendees > capacity). The signal stays: calendars as intervals + atomic overlap check + free-slot search.",
      },
    ],
    "Meeting scheduler is the intervals LLD problem: calendars as interval sets, booking = no-overlap check, free-slot = interval intersection/merge, with an atomic insert to avoid double-booking and Observer for notifications.",
    ["Not preventing concurrent double-booking of a room (no atomic overlap check).",
     "Getting the interval-overlap condition wrong (s1<e2 && s2<e1).",
     "Storing local times instead of UTC for cross-timezone scheduling."],
    0.5),

  T("lld_m8_t8", 8, "Design an In-Memory File System", "design-in-memory-fs",
    ["case-study", "filesystem", "composite", "tree"],
    "mkdir, create files, write/read, ls, navigate paths — all in memory. A directory contains files AND other directories. What pattern is screaming?",
    "A file system is the textbook Composite pattern: an abstract Node (Entry) with File (leaf) and Directory (composite holding children Nodes). Paths are resolved by walking the tree; ls/size recurse uniformly. It's the cleanest demonstration of treating leaves and containers through one interface.",
    [
      { kind: "concept", heading: "Composite structure",
        body: "Abstract Node/Entry (name, common ops); File (leaf — holds content/size); Directory (composite — holds a Map<name, Node> of children). A Directory's operations (size, list, search) recurse over its children, which may be Files or Directories — uniform treatment via the shared interface. This is Composite (LLD M3) in its purest form." },
      { kind: "concept", heading: "Path resolution & operations",
        body: "A path like /a/b/file.txt is resolved by splitting on '/' and walking from the root Directory, looking up each segment in the children map. Operations: mkdir (create Directory nodes along a path), create/write/read a File, ls (list a directory's children), rm, and search. Use a HashMap of children for O(1) name lookup at each level." },
      { kind: "concept", heading: "Design choices",
        body: "Track a current working directory for relative paths; decide create-intermediate-dirs behaviour (mkdir -p). Files store content (a String/byte buffer) and metadata (size, timestamps). The root is a Directory with no parent. Keep a parent pointer if you need '..' navigation. This is a common machine-coding round — clean Composite + map-based path walking scores well." },
      { kind: "concept", heading: "Common follow-ups",
        body: "'Wildcard/glob search' (recurse + pattern match — Visitor-like). 'Symlinks' (a node pointing to another path). 'Permissions' (per-node ACLs). 'Persist to disk' (serialize the tree). 'Apply to LeetCode 588/1166' (these ARE in-memory file system problems). The signal stays: Composite tree + HashMap children + path-walk resolution.",
      },
    ],
    "In-memory file system is a frequent machine-coding round and the purest Composite demonstration. The signal is Node→File(leaf)/Directory(composite) with map-based children and path-walking resolution.",
    ["Not recognising it as Composite (modelling files and dirs without a shared Node interface).",
     "Linear search for path segments instead of a HashMap of children.",
     "Forgetting recursion for size/ls over nested directories."],
    0.4),
];

const EXERCISES = [
  // ATM
  pm({ topicId: "lld_m8_t1", exerciseId: "lld_m8_t1_pm_1", position: 1, level: "medium", title: "Core pattern",
    scenario: "An ATM's NoCard→HasCard→Authenticated→Dispensing flow, where each step rejects illegal actions, is modelled with…",
    options: ["State pattern", "Singleton", "Visitor", "Flyweight"], correct: "State pattern",
    explanation: "Each step is a State owning its legal actions + transitions — far cleaner than a status switch." }),
  pm({ topicId: "lld_m8_t1", exerciseId: "lld_m8_t1_pm_2", position: 2, level: "medium", title: "Who owns the balance?",
    scenario: "In the ATM design, account balances and PIN validation belong to…",
    options: ["A bank/account service the ATM delegates to", "The ATM object itself", "The CashDispenser", "The CardReader"], correct: "A bank/account service the ATM delegates to",
    explanation: "The ATM is a client of the bank; it doesn't own balances — it requests auth and debits." }),
  pm({ topicId: "lld_m8_t1", exerciseId: "lld_m8_t1_pm_3", position: 3, level: "medium", title: "Avoid double-debit",
    scenario: "A network retry on a withdrawal must not debit twice. The backend debit must be…",
    options: ["Atomic + idempotent", "Cached", "Asynchronous only", "Eventually consistent"], correct: "Atomic + idempotent",
    explanation: "An idempotent, atomic debit ensures a retried request applies the withdrawal exactly once." }),
  // Chess
  pm({ topicId: "lld_m8_t2", exerciseId: "lld_m8_t2_pm_1", position: 1, level: "medium", title: "Modelling pieces",
    scenario: "Six piece types each move differently. How do you model them to avoid a giant switch?",
    options: ["Abstract Piece with isValidMove() overridden per type (polymorphism)", "An enum + switch on type", "One Piece class with a 'type' string", "A Singleton per piece"], correct: "Abstract Piece with isValidMove() overridden per type (polymorphism)",
    explanation: "Each piece subclass owns its movement rule; the engine calls piece.isValidMove() — Open/Closed for new pieces." }),
  pm({ topicId: "lld_m8_t2", exerciseId: "lld_m8_t2_pm_2", position: 2, level: "hard", title: "Move legality",
    scenario: "Besides matching the piece's movement rule, a move is illegal if…",
    options: ["It leaves your own king in check", "It captures any piece", "It moves toward the center", "It's the first move"], correct: "It leaves your own king in check",
    explanation: "You must simulate the move and reject it if your king is (still/now) in check." }),
  pm({ topicId: "lld_m8_t2", exerciseId: "lld_m8_t2_pm_3", position: 3, level: "medium", title: "Add an AI opponent",
    scenario: "Supporting a human OR an AI (minimax) player without changing the Game uses which pattern?",
    options: ["Strategy", "Memento", "Composite", "Singleton"], correct: "Strategy",
    explanation: "A PlayerStrategy (human input vs minimax) is swapped behind one interface — the Game is unchanged." }),
  // Stack Overflow
  pm({ topicId: "lld_m8_t3", exerciseId: "lld_m8_t3_pm_1", position: 1, level: "medium", title: "Shared behaviour",
    scenario: "Questions AND answers are both votable and commentable. How do you avoid duplicating that logic?",
    options: ["Share it via a Post base / Votable+Commentable interfaces (composition)", "Copy-paste into both classes", "Make Answer extend Question", "Use a Singleton"], correct: "Share it via a Post base / Votable+Commentable interfaces (composition)",
    explanation: "Factor the shared votable/commentable behaviour into a base/interfaces so both reuse it (DRY)." }),
  pm({ topicId: "lld_m8_t3", exerciseId: "lld_m8_t3_pm_2", position: 2, level: "medium", title: "Reputation",
    scenario: "How should a user's reputation be computed?",
    options: ["Driven by vote/accept events (Observer/event handler), in one place", "Stored as an arbitrary editable number", "Recomputed by scanning all posts on every read", "Hard-coded per user"], correct: "Driven by vote/accept events (Observer/event handler), in one place",
    explanation: "Vote/accept events apply reputation deltas via an observer — auditable, consistent, recomputable." }),
  pm({ topicId: "lld_m8_t3", exerciseId: "lld_m8_t3_pm_3", position: 3, level: "easy", title: "No double-voting",
    scenario: "To prevent a user voting twice on the same post, the Vote must…",
    options: ["Store the voter (unique per user+post)", "Be encrypted", "Use a queue", "Be cached"], correct: "Store the voter (unique per user+post)",
    explanation: "Recording who voted (unique per user+post) makes voting idempotent — no double counting." }),
  // Movie booking
  pm({ topicId: "lld_m8_t4", exerciseId: "lld_m8_t4_pm_1", position: 1, level: "medium", title: "Seat availability scope",
    scenario: "Seat availability should be tracked per…",
    options: ["Show (a movie on a screen at a time)", "Movie", "Theatre", "User"], correct: "Show (a movie on a screen at a time)",
    explanation: "The same physical seat is independently bookable for each Show — availability is per-Show." }),
  pm({ topicId: "lld_m8_t4", exerciseId: "lld_m8_t4_pm_2", position: 2, level: "hard", title: "No double-booking",
    scenario: "Two users grab the same seat at once. What guarantees one wins?",
    options: ["An atomic conditional hold (Available→Held only if Available)", "A two-step check-then-book", "Eventual consistency", "A bigger cache"], correct: "An atomic conditional hold (Available→Held only if Available)",
    explanation: "An atomic compare-and-set on the seat state lets only one concurrent request succeed — no oversell." }),
  pm({ topicId: "lld_m8_t4", exerciseId: "lld_m8_t4_pm_3", position: 3, level: "medium", title: "Pricing varies",
    scenario: "Seat price varies by type and show time. Which pattern?",
    options: ["Strategy (PricingStrategy)", "Singleton", "Memento", "Visitor"], correct: "Strategy (PricingStrategy)",
    explanation: "A swappable PricingStrategy keeps pricing rules out of the booking flow (Open/Closed)." }),
  // Shopping cart
  pm({ topicId: "lld_m8_t5", exerciseId: "lld_m8_t5_pm_1", position: 1, level: "medium", title: "Discounts & payments",
    scenario: "Percentage-off, BOGO, coupons, and card/UPI/wallet payments should each be…",
    options: ["A Strategy (swappable behind one interface), payments via a Factory", "Hard-coded if/else in checkout", "Subclasses of Cart", "Singletons"], correct: "A Strategy (swappable behind one interface), payments via a Factory",
    explanation: "DiscountStrategy + PaymentStrategy (created by a Factory) keep checkout closed to modification." }),
  pm({ topicId: "lld_m8_t5", exerciseId: "lld_m8_t5_pm_2", position: 2, level: "hard", title: "Don't oversell",
    scenario: "Two buyers race for the last unit in stock. The decrement must be…",
    options: ["Atomic conditional (decrement WHERE stock > 0)", "A read then a separate write", "Cached", "Eventually consistent"], correct: "Atomic conditional (decrement WHERE stock > 0)",
    explanation: "An atomic conditional decrement prevents overselling the last unit under concurrency." }),
  pm({ topicId: "lld_m8_t5", exerciseId: "lld_m8_t5_pm_3", position: 3, level: "medium", title: "Order lifecycle",
    scenario: "Placed→Paid→Shipped→Delivered/Cancelled is best modelled as…",
    options: ["A State machine", "A Strategy", "A Singleton", "A Bloom filter"], correct: "A State machine",
    explanation: "An order's lifecycle with defined transitions is a State machine." }),
  // Car rental
  pm({ topicId: "lld_m8_t6", exerciseId: "lld_m8_t6_pm_1", position: 1, level: "hard", title: "Availability check",
    scenario: "A car is booked for a DATE RANGE. 'Is it available for [start,end]?' means…",
    options: ["No existing reservation overlaps (existing.start < end AND existing.end > start)", "It has any free seat", "It's not currently rented right now", "It was returned today"], correct: "No existing reservation overlaps (existing.start < end AND existing.end > start)",
    explanation: "Interval-overlap: the requested range must not intersect any existing reservation for that vehicle." }),
  pm({ topicId: "lld_m8_t6", exerciseId: "lld_m8_t6_pm_2", position: 2, level: "medium", title: "Vs seat booking",
    scenario: "The key modelling difference from movie-seat booking is…",
    options: ["Booking spans a date RANGE (interval overlap), not a single slot", "There's no concurrency", "Pricing is fixed", "No inventory"], correct: "Booking spans a date RANGE (interval overlap), not a single slot",
    explanation: "Cars are reserved over intervals, so availability is an overlap check, not a single-slot grab." }),
  pm({ topicId: "lld_m8_t6", exerciseId: "lld_m8_t6_pm_3", position: 3, level: "medium", title: "Vehicle lifecycle",
    scenario: "Available/Reserved/Rented/Maintenance for a vehicle is modelled as…",
    options: ["A State machine", "A Factory", "A Visitor", "A Decorator"], correct: "A State machine",
    explanation: "The vehicle's status with defined transitions is a small State machine." }),
  // Meeting scheduler
  pm({ topicId: "lld_m8_t7", exerciseId: "lld_m8_t7_pm_1", position: 1, level: "medium", title: "Overlap condition",
    scenario: "Two time intervals [s1,e1] and [s2,e2] conflict when…",
    options: ["s1 < e2 AND s2 < e1", "s1 == s2", "e1 < s2", "they are on the same day"], correct: "s1 < e2 AND s2 < e1",
    explanation: "Intervals overlap iff each starts before the other ends — the standard overlap test." }),
  pm({ topicId: "lld_m8_t7", exerciseId: "lld_m8_t7_pm_2", position: 2, level: "hard", title: "Find a common slot",
    scenario: "Suggesting the earliest time that works for N attendees is solved by…",
    options: ["Merging everyone's busy intervals and finding a gap (interval merge)", "Picking a random time", "Asking each person sequentially", "Sharding the calendar"], correct: "Merging everyone's busy intervals and finding a gap (interval merge)",
    explanation: "Merge all attendees' busy intervals, then scan for a free gap of the needed length within working hours." }),
  pm({ topicId: "lld_m8_t7", exerciseId: "lld_m8_t7_pm_3", position: 3, level: "medium", title: "Notify attendees",
    scenario: "When a meeting is booked, attendees are notified. Which pattern fits the notification?",
    options: ["Observer (or a notification service)", "Singleton", "Flyweight", "Bridge"], correct: "Observer (or a notification service)",
    explanation: "Booking is an event; attendees are notified via Observer / a notification service." }),
  // In-memory FS
  pm({ topicId: "lld_m8_t8", exerciseId: "lld_m8_t8_pm_1", position: 1, level: "medium", title: "Core pattern",
    scenario: "A directory contains files AND other directories, treated uniformly. Which pattern?",
    options: ["Composite", "Decorator", "Proxy", "Strategy"], correct: "Composite",
    explanation: "Node→File(leaf)/Directory(composite) treating leaves and containers through one interface is Composite." }),
  pm({ topicId: "lld_m8_t8", exerciseId: "lld_m8_t8_pm_2", position: 2, level: "medium", title: "Path lookup",
    scenario: "For O(1) lookup of a child by name at each path level, a Directory stores children in…",
    options: ["A HashMap<name, Node>", "A sorted array", "A linked list", "A stack"], correct: "A HashMap<name, Node>",
    explanation: "A name→Node map gives O(1) lookup while walking a path's segments." }),
  pm({ topicId: "lld_m8_t8", exerciseId: "lld_m8_t8_pm_3", position: 3, level: "medium", title: "Directory size",
    scenario: "Computing the total size of a directory tree is naturally implemented with…",
    options: ["Recursion over children (uniform via the Node interface)", "A single loop", "A database query", "A bloom filter"], correct: "Recursion over children (uniform via the Node interface)",
    explanation: "A directory's size recurses over children (files return their size, dirs recurse) — Composite recursion." }),
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
  console.log(`\nDone — M8 More Case Studies seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
