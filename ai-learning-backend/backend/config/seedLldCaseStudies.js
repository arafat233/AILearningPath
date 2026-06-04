/**
 * Seed — LLD module M5: Case Studies (Elevator, Vending Machine, Splitwise,
 * Rate Limiter, Tic-Tac-Toe, Snake & Ladder, Notification Service, Logging
 * Framework). Each topic applies the patterns from M1–M4 to a full design.
 * (Parking Lot + LRU Cache live in M1.)
 *
 * Idempotent upsert-by-id; recomputes track totals. Test-case types follow the
 * proven grading convention. Java stays JDK-13-safe.
 *
 * Usage:  node config/seedLldCaseStudies.js   ·   npm: npm run seed:lld-cases
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m5";
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);

function code(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "code_scratch", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "", starterCode: o.starterCode ?? "", expectedSolution: o.expectedSolution ?? "",
    blanks: [], testCases: [{ type: "execution", must_compile: true, stdin: "", expected_stdout: o.expectedStdout }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}
function predict(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "predict_output", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "What does this code print?", starterCode: o.starterCode, expectedSolution: o.expected,
    blanks: [], testCases: [{ type: "text_match", expected: o.expected, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}
function pm(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const MODULE = {
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 5,
  name: "LLD Case Studies", slug: "lld-case-studies",
  description: "End-to-end designs that combine the patterns from M1–M4: Elevator, Vending Machine, Splitwise, Rate Limiter, Tic-Tac-Toe, Snake & Ladder, Notification Service, and a Logging Framework. (Parking Lot & LRU Cache live in M1.)",
  estimatedHours: 7, prerequisites: ["lld_m1", "lld_m4"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, prereq, diff) => ({
  trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
  metadata: { estimated_minutes: 40, difficulty: 3, prerequisites: prereq, tags },
  hook: { question: hookQ, insight: hookI },
  teaching: { blocks },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: prereq, estimatedMinutes: 40, difficulty: diff, xpReward: 60, visualizer: null,
});

const TOPICS = [
  T("lld_m5_t1", 1, "Design an Elevator System", "design-elevator",
    ["case-study", "elevator", "state", "strategy"],
    "Multiple elevators, many floor requests, and a scheduling policy you may want to change. Where do the patterns from M1–M4 actually land?",
    "An elevator is a state machine (Idle/Moving-Up/Moving-Down/Doors-Open) with a pluggable scheduling Strategy. Model the entities first, then layer State for the car's modes and Strategy for dispatching.",
    [
      { kind: "concept", heading: "Requirements + entities",
        body: "Clarify: N elevators, M floors, internal (in-car) vs external (hall) requests, capacity. Entities: ElevatorSystem (composes Elevators), Elevator (has current floor + direction + a request queue), Request (floor + direction), and a Scheduler. Multiplicities: system 1 ──◇ 1..* Elevator." },
      { kind: "concept", heading: "State for the car",
        body: "Each Elevator is a State machine: Idle, MovingUp, MovingDown, DoorsOpen. Behaviour (what a button press does) depends on the current state, and states define legal transitions — exactly the M4 State pattern, far cleaner than a status enum + switch." },
      { kind: "concept", heading: "Strategy for dispatching",
        body: "Which elevator serves a hall request is a policy that varies: nearest-car, scan/elevator algorithm (SCAN/LOOK), or load-balanced. Put it behind a SchedulingStrategy interface so you can swap policies without touching the elevators (OCP + Strategy)." },
      { kind: "concept", heading: "Key APIs + edge cases",
        body: "ElevatorSystem.requestElevator(floor, direction); Elevator.addStop(floor); step()/tick() to advance the simulation. Edge cases: request for the current floor, opposite-direction requests while moving, all cars busy, capacity full. Concurrency (real systems) is usually a stated non-functional — confirm scope." },
    ],
    "The elevator is a top-tier LLD prompt. Interviewers want State for the car and a pluggable Strategy for scheduling, on top of a clean entity model — not a giant if/else.",
    ["Modelling the car's modes with a status enum + switch instead of State.",
     "Hard-coding the dispatch policy instead of a Strategy.",
     "Designing concurrency that was never asked for."],
    ["lld_m4_t2", "lld_m1_t4"], 0.5),

  T("lld_m5_t2", 2, "Design a Vending Machine", "design-vending-machine",
    ["case-study", "vending-machine", "state"],
    "Insert coins, select an item, dispense, give change — and the machine must reject a selection before money is in. What keeps the rules straight as states multiply?",
    "The vending machine is the textbook State pattern: Idle → HasMoney → Dispensing → (back to Idle), with each state allowing only its legal actions. Inventory and change-making round out the design.",
    [
      { kind: "concept", heading: "States and transitions",
        body: "States: Idle (awaiting money), HasMoney (awaiting selection), Dispensing, OutOfStock. insertCoin/selectItem/dispense behave differently per state — selecting before paying is rejected by the Idle state, not by scattered checks. Each state class owns its transitions (M4 State)." },
      { kind: "concept", heading: "Entities",
        body: "VendingMachine (current State + balance), Inventory (Map<Slot, ItemStock>), Item (name, priceCents), CoinSlot/ChangeDispenser. The machine delegates behaviour to its current state object." },
      { kind: "concept", heading: "Change-making",
        body: "Returning change is a greedy (or DP) sub-problem over available denominations — itself a candidate for a Strategy if the policy (greedy vs exact-change-only) varies. Handle 'cannot make exact change' by refusing the sale up front." },
      { kind: "concept", heading: "Edge cases",
        body: "Insufficient funds, exact-change-unavailable, item out of stock, coin refund/cancel, concurrent purchases (usually out of scope). The State pattern makes each of these a method on the relevant state rather than a branch everywhere." },
    ],
    "Vending machine is the canonical State-pattern interview. The signal is one class per state owning its actions + transitions, plus a clean inventory/change model.",
    ["Using a status enum + switch instead of State classes.",
     "Allowing illegal actions (select before pay) because checks are scattered.",
     "Ignoring the exact-change-unavailable case."],
    ["lld_m4_t2"], 0.5),

  T("lld_m5_t3", 3, "Design Splitwise (Expense Sharing)", "design-splitwise",
    ["case-study", "splitwise", "strategy", "graph"],
    "A group shares expenses split equally, by exact amounts, or by percentage — and you must show who owes whom, ideally with the fewest transactions. What's the model?",
    "Split rules are a Strategy (equal/exact/percent); balances form a net-owed graph per user pair; simplifying debts is a greedy settle-up over those balances. Get the entities and the split strategy right first.",
    [
      { kind: "concept", heading: "Entities",
        body: "User, Group (has Users), Expense (payer, totalCents, list of splits), Split (user + owedCents). A BalanceSheet tracks net amounts: balance[a][b] = how much a owes b. Multiplicity: Group 1 ──◇ 1..* User; Expense 1 ──◇ 1..* Split." },
      { kind: "concept", heading: "Strategy for split types",
        body: "EQUAL, EXACT, and PERCENT are interchangeable algorithms that turn (total, participants) into per-user owed amounts → a SplitStrategy interface (M1 Strategy). Validate: exact splits must sum to the total; percentages must sum to 100." },
      { kind: "concept", heading: "Balances as a graph",
        body: "Each expense updates pairwise balances. To answer 'who owes whom', net the directed edges (if a owes b 10 and b owes a 4, collapse to a owes b 6). This is a directed weighted graph keyed by user pairs — store it as Map<UserPair, Integer> or a 2-D structure." },
      { kind: "concept", heading: "Simplify debts (settle-up)",
        body: "Minimizing the number of transactions is the 'optimal settlement' problem: compute each person's net balance (sum of credits − debits), then greedily match the largest creditor with the largest debtor until all nets are zero. It's a classic follow-up — greedy gives a good (not always provably minimal) result." },
    ],
    "Splitwise tests modelling money correctly (integer cents), a Strategy for split types, and reasoning about balances as a graph with a greedy settle-up. The settle-up follow-up separates strong candidates.",
    ["Storing money as floating-point instead of integer cents.",
     "Hard-coding split logic instead of a SplitStrategy.",
     "Not netting bidirectional balances before settling up."],
    ["lld_m1_t4"], 0.6),

  T("lld_m5_t4", 4, "Design a Rate Limiter", "design-rate-limiter",
    ["case-study", "rate-limiter", "strategy", "algorithm"],
    "An API must allow at most N requests per user per window. Fixed window? Sliding window? Token bucket? They behave differently at the boundaries — which do you pick and how do you model it?",
    "A rate limiter is an algorithm choice (fixed-window, sliding-window, token-bucket, leaky-bucket) behind one allow() interface — a Strategy. Token bucket is the usual default: it smooths bursts and is O(1).",
    [
      { kind: "concept", heading: "The interface",
        body: "One method drives everything: boolean allow(String key). The key is usually the userId or IP. Behind it sits a per-key counter/state. Different algorithms implement allow() differently → a RateLimiter Strategy interface so you can swap policies per route." },
      { kind: "concept", heading: "Fixed vs sliding window",
        body: "Fixed window counts requests per discrete window (e.g. per minute) — simple but allows a 2× burst at the boundary (many at 0:59 and again at 1:00). Sliding-window log/counter smooths this by considering a rolling interval, at higher memory/CPU cost." },
      { kind: "concept", heading: "Token bucket (the common default)",
        body: "A bucket holds up to `capacity` tokens and refills at a steady rate. Each request consumes a token; if the bucket is empty, reject. It permits short bursts (up to capacity) while bounding the long-run rate, and each check is O(1). Leaky bucket is the dual (smooths output to a constant drain rate)." },
      { kind: "concept", heading: "Distributed + edge cases",
        body: "Single-node uses in-memory counters; a distributed limiter needs shared state (Redis with atomic INCR/Lua) — usually a stated non-functional. Edge cases: clock skew, key cardinality (memory), and what to return on limit (429 + Retry-After)." },
    ],
    "Rate limiter is asked at both LLD and system-design depth. The signal is naming the algorithms, their boundary behaviour, and putting them behind a Strategy — with token bucket as a sensible default.",
    ["Picking fixed-window without mentioning its boundary-burst flaw.",
     "Hard-coding one algorithm instead of a swappable Strategy.",
     "Forgetting the distributed case needs shared atomic state."],
    ["lld_m1_t4"], 0.5),

  T("lld_m5_t5", 5, "Design Tic-Tac-Toe", "design-tic-tac-toe",
    ["case-study", "tic-tac-toe", "game", "state"],
    "Two players alternate marking a 3×3 grid; after each move you check for a win or draw. How do you model the board, turns, and win-detection cleanly (and generalize to N×N)?",
    "Model a Board (grid + move validation + win check), Players, and a Game that alternates turns. Win-detection is a row/column/diagonal scan; turn-alternation is a small state machine.",
    [
      { kind: "concept", heading: "Entities",
        body: "Board (char[][] or enum cells + place(row,col,mark) + isFull()), Player (mark X/O), Game (two players, current turn, board, status). The Game alternates the current player after each valid move and asks the Board to check for a winner." },
      { kind: "concept", heading: "Win detection",
        body: "After a move at (r,c), check that move's row, its column, and (if on a diagonal) the two diagonals for all-same-mark. O(n) per move beats rescanning the whole board O(n²). Generalizes to N×N / connect-K by scanning runs of length K." },
      { kind: "concept", heading: "Turns + status as state",
        body: "Game status (XTurn → OTurn → … → Won/Draw) is a small state machine; placing on an occupied cell or after game-over is rejected by the current state. Validation (in-bounds, empty cell, game not over) lives in the Board/Game, not the caller." },
      { kind: "concept", heading: "Extensions",
        body: "Generalize board size and win-length; add an AI player (Strategy: random vs minimax); support undo (Memento/Command). Interviewers often ask 'now make it N×N' or 'add an unbeatable AI' as follow-ups." },
    ],
    "Tic-Tac-Toe checks clean board modelling, efficient win-detection (scan the last move, not the whole board), and generalization to N×N. AI/undo are common follow-ups that map to Strategy/Memento.",
    ["Rescanning the whole board each move instead of checking the last move's lines.",
     "Letting the caller validate moves instead of the Board/Game.",
     "Hard-coding 3×3 so it can't generalize to N×N."],
    ["lld_m4_t2"], 0.4),

  T("lld_m5_t6", 6, "Design Snake & Ladder", "design-snake-and-ladder",
    ["case-study", "snake-and-ladder", "game", "data-structures"],
    "Players roll a die and move; landing on a snake's head or a ladder's bottom teleports them. What's the cleanest way to store the jumps and resolve a move?",
    "Model a Board with a Map of jumps (cell → destination) covering both snakes and ladders, a Dice (Strategy for fairness/sides), and a Game loop that moves players and applies any jump.",
    [
      { kind: "concept", heading: "Entities",
        body: "Board (size + Map<Integer,Integer> jumps where snakes map high→low and ladders low→high), Dice (roll()), Player (position), Game (player queue + board + dice). Snakes and ladders are the SAME structure — a jump from one cell to another — so one map handles both." },
      { kind: "concept", heading: "Resolving a move",
        body: "newPos = pos + dice.roll(); if newPos > size, stay (or bounce, per rules); else newPos = jumps.getOrDefault(newPos, newPos) to apply a snake/ladder. Win when a player reaches exactly the last cell." },
      { kind: "concept", heading: "Dice as a Strategy",
        body: "A standard 6-sided die, a loaded die, or multi-dice are interchangeable → a Dice/RollStrategy interface. This also makes the game testable: inject a deterministic die in tests instead of randomness." },
      { kind: "concept", heading: "Edge cases",
        body: "Overshooting the final cell, chained jumps (a ladder landing on a snake — usually disallowed by board design), multiple players on a cell, and turn rotation. Keep the jump map validated (no two jumps from the same cell)." },
    ],
    "Snake & Ladder tests recognising that snakes and ladders are one 'jump' abstraction stored in a Map, plus a testable Dice Strategy. It's a gentler game-design prompt than chess.",
    ["Modelling snakes and ladders as two separate structures instead of one jump map.",
     "Using real randomness everywhere, making the game untestable (inject a Dice Strategy).",
     "Mishandling overshoot of the final cell."],
    ["lld_m1_t4"], 0.4),

  T("lld_m5_t7", 7, "Design a Notification Service", "design-notification-service",
    ["case-study", "notification", "strategy", "factory", "observer"],
    "Send notifications over email, SMS, or push; users subscribe to event types; new channels get added often. Which patterns keep channels and delivery decoupled?",
    "Channels are a Strategy (one send() interface, one impl per channel), a Factory creates the right channel from a type, and Observer fans an event out to subscribers. Together they make adding a channel a one-class change.",
    [
      { kind: "concept", heading: "Entities",
        body: "Notification (recipient, content, channelType), Channel (send(Notification)), NotificationService (routes to channels), User (subscriptions). Keep the message and the transport separate." },
      { kind: "concept", heading: "Strategy + Factory for channels",
        body: "EmailChannel, SmsChannel, PushChannel all implement one Channel interface (Strategy). A ChannelFactory maps a channelType to the right implementation so callers never `new` a concrete channel (Factory). Adding WhatsApp = one new class + one factory line (OCP)." },
      { kind: "concept", heading: "Observer for subscriptions",
        body: "When an event occurs, the service notifies all subscribers interested in that event type (M1 Observer) — each subscriber's preferred channel(s) then deliver. This decouples 'something happened' from 'who gets told how'." },
      { kind: "concept", heading: "Reliability concerns",
        body: "Real systems add retries with backoff, a queue for async delivery, templating, rate limits per user, and delivery-status tracking. These are usually stated non-functionals — confirm scope before designing them, and consider a Decorator (M1) to add retry/logging around a Channel." },
    ],
    "Notification service is a favourite because it naturally combines Strategy (channels), Factory (creation), and Observer (subscriptions). Interviewers want each channel to be a one-class addition.",
    ["Branching on channel type with if/else instead of Strategy + Factory.",
     "Coupling the event source directly to channels instead of via Observer.",
     "Designing retries/queues that weren't in scope."],
    ["lld_m1_t4", "lld_m1_t5", "lld_m1_t6"], 0.5),

  T("lld_m5_t8", 8, "Design a Logging Framework", "design-logging-framework",
    ["case-study", "logging", "chain-of-responsibility", "strategy", "singleton"],
    "A logger must filter by level (DEBUG/INFO/ERROR), write to multiple destinations (console, file, network), and format consistently. Which patterns assemble this?",
    "Levels form a Chain of Responsibility (or threshold filter), destinations are pluggable Appenders (Strategy), formatting is a Strategy, and the root logger is often a (carefully-used) Singleton.",
    [
      { kind: "concept", heading: "Entities",
        body: "Logger (name + level threshold + appenders), LogLevel (ordered enum), LogEvent (level, message, timestamp), Appender (write(LogEvent)), Formatter (format(LogEvent)). A Logger forwards events at or above its threshold to its appenders." },
      { kind: "concept", heading: "Level handling — Chain or threshold",
        body: "Log levels are ordered (DEBUG < INFO < WARN < ERROR). You can model handlers in a Chain of Responsibility (each level handler decides to handle/forward) or, more simply, a threshold check. The chain shines when different levels route to different destinations." },
      { kind: "concept", heading: "Appenders + Formatters as Strategies",
        body: "ConsoleAppender, FileAppender, NetworkAppender implement one Appender interface (Strategy); a Logger can have several. PatternFormatter/JsonFormatter implement a Formatter Strategy. Add a destination or format = add a class. Wrap an Appender in a Decorator for async/buffering." },
      { kind: "concept", heading: "Singleton — use with care",
        body: "A root/global logger is the classic Singleton use, but remember M1's warning: global state hurts testability. Prefer per-class loggers obtained from a LoggerFactory (which may hold one shared registry). Concurrency (thread-safe appenders) is a key non-functional for real frameworks." },
    ],
    "A logging framework neatly combines Chain of Responsibility (levels), Strategy (appenders/formatters), and a judicious Singleton — mirroring Log4j/SLF4J. Interviewers probe the Singleton trade-off and pluggable appenders.",
    ["One monolithic logger that hard-codes destinations and formats.",
     "Overusing Singleton for mutable, hard-to-test global state.",
     "Ignoring thread-safety of shared appenders."],
    ["lld_m4_t4", "lld_m1_t4", "lld_m1_t7"], 0.5),
];

const EXERCISES = [
  // T1 Elevator
  pm({ topicId: "lld_m5_t1", exerciseId: "lld_m5_t1_pm_1", position: 1, level: "medium",
    title: "Model the car's modes",
    scenario: "An elevator car is Idle, MovingUp, MovingDown, or DoorsOpen, and a button press means different things in each mode. Which pattern models the car cleanly?",
    options: ["State", "Strategy", "Observer", "Composite"], correct: "State",
    explanation: "Mode-dependent behaviour with defined transitions is the State pattern — far cleaner than a status enum + switch." }),
  pm({ topicId: "lld_m5_t1", exerciseId: "lld_m5_t1_pm_2", position: 2, level: "medium",
    title: "Swappable dispatching",
    scenario: "You want to switch the elevator-selection policy between nearest-car, SCAN, and load-balanced without editing the elevators. Which pattern?",
    options: ["Strategy", "State", "Singleton", "Memento"], correct: "Strategy",
    explanation: "An interchangeable scheduling algorithm behind one interface is the Strategy pattern (Open/Closed for new policies)." }),
  pm({ topicId: "lld_m5_t1", exerciseId: "lld_m5_t1_pm_3", position: 3, level: "easy",
    title: "First step",
    scenario: "You're asked to design an elevator system. What's the correct first move before writing any class?",
    options: ["Clarify requirements (count, floors, request types, capacity)", "Write the Elevator class", "Choose State + Strategy immediately", "Pick a thread pool size"],
    correct: "Clarify requirements (count, floors, request types, capacity)",
    explanation: "Scope first: number of elevators/floors, internal vs external requests, capacity, concurrency. Patterns come after the entity model." }),

  // T2 Vending Machine
  pm({ topicId: "lld_m5_t2", exerciseId: "lld_m5_t2_pm_1", position: 1, level: "medium",
    title: "The core pattern",
    scenario: "Idle, HasMoney, Dispensing, OutOfStock — each allows only its legal actions and defines the next state. Selecting before paying is rejected by the Idle state itself. Which pattern?",
    options: ["State", "Command", "Strategy", "Facade"], correct: "State",
    explanation: "Vending machines are the textbook State pattern: one class per state owning its actions and transitions." }),
  predict({ topicId: "lld_m5_t2", exerciseId: "lld_m5_t2_ex_1", position: 2, level: "medium",
    title: "Reject selection before payment",
    scenario: "What does this program print (one line per action)?",
    starterCode: `public class Main {
    interface State { String select(); }
    static class Idle implements State { public String select(){ return "insert money first"; } }
    static class HasMoney implements State { public String select(){ return "dispensing"; } }
    static class Machine {
        State state = new Idle();
        void insertMoney(){ state = new HasMoney(); }
        String select(){ return state.select(); }
    }
    public static void main(String[] args) {
        Machine m = new Machine();
        System.out.println(m.select());
        m.insertMoney();
        System.out.println(m.select());
    }
}`,
    expected: "insert money first\ndispensing",
    explanation: "In Idle, select() refuses ('insert money first'). After insertMoney() the state is HasMoney, so select() returns 'dispensing'. The rule lives in the state, not in scattered checks.",
    hints: ["The Idle state rejects selection; HasMoney allows it."] }),
  pm({ topicId: "lld_m5_t2", exerciseId: "lld_m5_t2_pm_2", position: 3, level: "medium",
    title: "Easy-to-miss edge case",
    scenario: "Which case is most commonly forgotten in a vending-machine design and should refuse the sale up front?",
    options: ["Exact change cannot be made", "The user inserts a coin", "An item is selected", "The machine is powered on"],
    correct: "Exact change cannot be made",
    explanation: "If the machine can't return correct change, it should reject the purchase before dispensing — a classic overlooked edge case." }),

  // T3 Splitwise
  pm({ topicId: "lld_m5_t3", exerciseId: "lld_m5_t3_pm_1", position: 1, level: "medium",
    title: "Split rules",
    scenario: "Expenses can be split EQUALLY, by EXACT amounts, or by PERCENT, and more rules may come later. Which pattern isolates the split rule?",
    options: ["Strategy", "Observer", "Singleton", "Composite"], correct: "Strategy",
    explanation: "Interchangeable split algorithms behind one SplitStrategy interface — Strategy, Open/Closed for new rules." }),
  pm({ topicId: "lld_m5_t3", exerciseId: "lld_m5_t3_pm_2", position: 2, level: "hard",
    title: "Minimize transactions",
    scenario: "To settle all debts in a group with the FEWEST transactions, what's the standard approach over each person's net balance?",
    options: ["Greedily match the largest creditor with the largest debtor", "Sort names alphabetically and pay in order", "Everyone pays a central account in arbitrary order", "Use a min-heap of expenses by date"],
    correct: "Greedily match the largest creditor with the largest debtor",
    explanation: "Compute net balances, then repeatedly settle the biggest creditor against the biggest debtor — the greedy settle-up that minimizes transaction count in practice." }),
  pm({ topicId: "lld_m5_t3", exerciseId: "lld_m5_t3_pm_3", position: 3, level: "easy",
    title: "Money representation",
    scenario: "How should monetary amounts be stored to avoid rounding bugs in split calculations?",
    options: ["Integer cents (or BigDecimal)", "double", "float", "String"],
    correct: "Integer cents (or BigDecimal)",
    explanation: "Floating-point introduces rounding errors. Store money as integer cents (or BigDecimal) for exact arithmetic." }),

  // T4 Rate Limiter
  pm({ topicId: "lld_m5_t4", exerciseId: "lld_m5_t4_pm_1", position: 1, level: "medium",
    title: "Smooth bursts, O(1)",
    scenario: "You want to allow short bursts up to a capacity while bounding the long-run rate, with O(1) per-request checks. Which algorithm fits best?",
    options: ["Token bucket", "Fixed window", "Sorting requests", "Binary search"], correct: "Token bucket",
    explanation: "The token bucket refills at a steady rate and allows bursts up to capacity, with O(1) checks — the common default." }),
  pm({ topicId: "lld_m5_t4", exerciseId: "lld_m5_t4_pm_2", position: 2, level: "medium",
    title: "The fixed-window flaw",
    scenario: "Why can a fixed-window limiter allow up to ~2× the intended rate at a window boundary?",
    options: ["Requests can cluster at the end of one window and the start of the next", "It uses floating-point counters", "It forgets to reset the counter", "It is not thread-safe"],
    correct: "Requests can cluster at the end of one window and the start of the next",
    explanation: "A burst at 0:59 and another at 1:00 each fit a different window, permitting nearly double the limit across the boundary. Sliding window fixes this." }),
  code({ topicId: "lld_m5_t4", exerciseId: "lld_m5_t4_ex_1", position: 3, level: "medium",
    title: "Implement a fixed-window limiter",
    scenario: "Write a FixedWindowLimiter(limit) with `boolean allow()` that returns true for the first `limit` calls in the window and false after. Print the results of 4 calls with limit=2, comma-separated.",
    instructions: "Write a complete Java program (public class Main) printing exactly: true,true,false,false",
    starterCode: `public class Main {
    static class FixedWindowLimiter {
        // TODO: limit + count, allow()
    }
    public static void main(String[] args) {
        FixedWindowLimiter rl = new FixedWindowLimiter(2);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) sb.append(rl.allow()).append(i < 3 ? "," : "");
        System.out.println(sb);
    }
}`,
    expectedSolution: `public class Main {
    static class FixedWindowLimiter {
        private final int limit; private int count = 0;
        FixedWindowLimiter(int limit){ this.limit = limit; }
        boolean allow(){ if (count < limit){ count++; return true; } return false; }
    }
    public static void main(String[] args) {
        FixedWindowLimiter rl = new FixedWindowLimiter(2);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) sb.append(rl.allow()).append(i < 3 ? "," : "");
        System.out.println(sb);
    }
}`,
    expectedStdout: "true,true,false,false",
    hints: ["Track a count; allow while count < limit, incrementing on each allowed call.", "First 2 calls pass, the next 2 are rejected."] }),

  // T5 Tic-Tac-Toe
  pm({ topicId: "lld_m5_t5", exerciseId: "lld_m5_t5_pm_1", position: 1, level: "medium",
    title: "Efficient win-check",
    scenario: "After each move you check for a winner. What's the efficient approach (vs rescanning the whole board)?",
    options: ["Check only the last move's row, column, and diagonals", "Rescan all rows, columns, and diagonals every move", "Sort the board", "Check only the center cell"],
    correct: "Check only the last move's row, column, and diagonals",
    explanation: "A win must involve the cell just played, so checking that move's lines is O(n) vs O(n²) for a full rescan." }),
  code({ topicId: "lld_m5_t5", exerciseId: "lld_m5_t5_ex_1", position: 2, level: "medium",
    title: "Row-win detection",
    scenario: "Write rowWin(char[][] b, char p) returning true if any row of a 3×3 board is all `p`. Test it on a board whose top row is X,X,X and print the boolean.",
    instructions: "Write a complete Java program (public class Main) printing exactly: true",
    starterCode: `public class Main {
    static boolean rowWin(char[][] b, char p) {
        // TODO: true if any row is all p
        return false;
    }
    public static void main(String[] args) {
        char[][] b = {{'X','X','X'},{'O','O',' '},{' ',' ',' '}};
        System.out.println(rowWin(b, 'X'));
    }
}`,
    expectedSolution: `public class Main {
    static boolean rowWin(char[][] b, char p) {
        for (int r = 0; r < 3; r++)
            if (b[r][0] == p && b[r][1] == p && b[r][2] == p) return true;
        return false;
    }
    public static void main(String[] args) {
        char[][] b = {{'X','X','X'},{'O','O',' '},{' ',' ',' '}};
        System.out.println(rowWin(b, 'X'));
    }
}`,
    expectedStdout: "true",
    hints: ["Loop the 3 rows; a row wins if all three cells equal p.", "The top row is all X → true."] }),
  pm({ topicId: "lld_m5_t5", exerciseId: "lld_m5_t5_pm_2", position: 3, level: "medium",
    title: "Add an unbeatable AI",
    scenario: "A follow-up asks you to support both a random computer player and an unbeatable (minimax) one, swappable without changing the Game. Which pattern?",
    options: ["Strategy", "Memento", "Observer", "Facade"], correct: "Strategy",
    explanation: "Interchangeable move-selection algorithms (random vs minimax) behind one interface is the Strategy pattern." }),

  // T6 Snake & Ladder
  pm({ topicId: "lld_m5_t6", exerciseId: "lld_m5_t6_pm_1", position: 1, level: "medium",
    title: "Store snakes and ladders",
    scenario: "Snakes send you down, ladders send you up — both teleport from one cell to another. What's the cleanest single structure to store them?",
    options: ["One Map<Integer,Integer> of cell→destination", "Two separate lists with different node types", "A 2-D matrix of the whole board", "A stack of moves"],
    correct: "One Map<Integer,Integer> of cell→destination",
    explanation: "Snakes and ladders are the same 'jump' abstraction; one map from start-cell to destination-cell handles both." }),
  predict({ topicId: "lld_m5_t6", exerciseId: "lld_m5_t6_ex_1", position: 2, level: "medium",
    title: "Resolve a move with a jump",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Map<Integer,Integer> jumps = new HashMap<>();
        jumps.put(4, 14); // ladder
        jumps.put(17, 7); // snake
        int pos = 2;
        int roll = 2;
        int next = pos + roll;
        next = jumps.getOrDefault(next, next);
        System.out.println(next);
    }
}`,
    expected: "14",
    explanation: "pos 2 + roll 2 = 4; cell 4 is a ladder to 14, so getOrDefault(4) returns 14. The same map would resolve a snake the same way.",
    hints: ["Land on 4, then apply the jump map."] }),
  pm({ topicId: "lld_m5_t6", exerciseId: "lld_m5_t6_pm_2", position: 3, level: "easy",
    title: "Make the game testable",
    scenario: "Randomness makes the game hard to test deterministically. What lets you inject a fixed sequence of rolls in tests?",
    options: ["A Dice/Roll Strategy interface", "A Singleton random", "A Memento of the board", "An Observer on the player"],
    correct: "A Dice/Roll Strategy interface",
    explanation: "Putting rolling behind a Dice Strategy lets you inject a deterministic die in tests instead of real randomness." }),

  // T7 Notification Service
  pm({ topicId: "lld_m5_t7", exerciseId: "lld_m5_t7_pm_1", position: 1, level: "medium",
    title: "Pluggable channels",
    scenario: "Email, SMS, and Push each implement one Channel.send() interface; adding WhatsApp is a new class. Which pattern models the channels?",
    options: ["Strategy", "State", "Composite", "Memento"], correct: "Strategy",
    explanation: "Interchangeable delivery implementations behind one send() interface is the Strategy pattern." }),
  pm({ topicId: "lld_m5_t7", exerciseId: "lld_m5_t7_pm_2", position: 2, level: "medium",
    title: "Create channels without `new`",
    scenario: "Callers should get the right Channel from a channelType string without writing `new SmsChannel()` anywhere. Which pattern centralizes that creation?",
    options: ["Factory", "Observer", "Decorator", "Bridge"], correct: "Factory",
    explanation: "A ChannelFactory mapping a type to the concrete channel centralizes creation (Factory), so callers depend only on the Channel interface." }),
  pm({ topicId: "lld_m5_t7", exerciseId: "lld_m5_t7_pm_3", position: 3, level: "medium",
    title: "Fan out an event",
    scenario: "When an event occurs, every user subscribed to that event type must be notified, and subscribers come and go at runtime. Which pattern fans the event out?",
    options: ["Observer", "Strategy", "Adapter", "Singleton"], correct: "Observer",
    explanation: "Notifying a dynamic set of subscribers when an event occurs is the Observer pattern (decouples source from recipients)." }),

  // T8 Logging Framework
  pm({ topicId: "lld_m5_t8", exerciseId: "lld_m5_t8_pm_1", position: 1, level: "medium",
    title: "Route by level",
    scenario: "Different log levels can be handled and/or forwarded to different destinations, with the chain composed at runtime. Which pattern models level handling?",
    options: ["Chain of Responsibility", "Strategy", "Visitor", "Prototype"], correct: "Chain of Responsibility",
    explanation: "Passing a log event along handlers that each handle/forward is the Chain of Responsibility pattern (a threshold check is the simpler alternative)." }),
  pm({ topicId: "lld_m5_t8", exerciseId: "lld_m5_t8_pm_2", position: 2, level: "medium",
    title: "Pluggable destinations",
    scenario: "Console, File, and Network outputs each implement one Appender.write() interface, and a Logger can hold several. Which pattern are the appenders?",
    options: ["Strategy", "State", "Memento", "Mediator"], correct: "Strategy",
    explanation: "Interchangeable output implementations behind one Appender interface is the Strategy pattern; a Logger composes several appenders." }),
  pm({ topicId: "lld_m5_t8", exerciseId: "lld_m5_t8_pm_3", position: 3, level: "medium",
    title: "The Singleton caveat",
    scenario: "A global root logger is a classic Singleton, but what's the main downside to keep in mind (per the Singleton lesson)?",
    options: ["Global mutable state hurts testability — prefer a LoggerFactory/DI", "It uses too much memory", "It cannot be thread-safe", "It forces inheritance"],
    correct: "Global mutable state hurts testability — prefer a LoggerFactory/DI",
    explanation: "Singletons are global state that complicates testing; prefer per-class loggers from a factory/registry and inject dependencies." }),
];

async function upsertOne(Model, filter, doc) {
  return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
}
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
  console.log(`\nDone — M5 LLD Case Studies seeded.`);
  console.log(`  Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
