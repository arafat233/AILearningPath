/**
 * Seed — LLD module M13: Case Studies VII (concurrency primitives, games,
 * parsers, frameworks): Bounded Blocking Queue, Read-Write Lock, Connect Four,
 * Sudoku Validator/Solver, JSON Parser, DI Container, Plugin System,
 * Configuration Manager.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases7.js   ·   npm: npm run seed:lld-cases7
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m13";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 13,
  name: "Case Studies VII — Concurrency, Games & Frameworks", slug: "case-studies-7",
  description: "Eight more designs: a Bounded Blocking Queue, a Read-Write Lock, Connect Four, a Sudoku validator/solver, a JSON parser, a Dependency-Injection container, a Plugin system, and a Configuration manager.",
  estimatedHours: 5, prerequisites: ["lld_m1", "lld_m7"], status: "live",
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
  T("lld_m13_t1", 1, "Design a Bounded Blocking Queue", "design-bounded-blocking-queue",
    ["case-study", "concurrency", "producer-consumer", "condition-variable"],
    "Build a thread-safe queue with a fixed capacity: producers BLOCK when it's full, consumers BLOCK when it's empty, and many threads use it safely. What primitive lets a thread wait and be woken, and why not just spin?",
    "Guard the queue with a lock and use CONDITION VARIABLES (notFull, notEmpty): put() waits on notFull while full then signals notEmpty; take() waits on notEmpty while empty then signals notFull. Waiting must use a WHILE loop (not if) to handle spurious wakeups. It's the Producer-Consumer pattern's core primitive.",
    [
      { kind: "concept", heading: "The contract",
        body: "A bounded blocking queue has a max capacity. put(x): if full, the calling thread BLOCKS (sleeps) until space frees; else enqueue. take(): if empty, BLOCK until an item arrives; else dequeue. Blocking (not failing or busy-waiting) gives natural back-pressure between producers and consumers — the foundation of the Producer-Consumer pattern and thread pools." },
      { kind: "concept", heading: "Lock + condition variables",
        body: "Protect the internal buffer + count with a LOCK (mutual exclusion). Use two CONDITION VARIABLES tied to that lock: notFull and notEmpty. put() acquires the lock, waits on notFull while the queue is full (releasing the lock while asleep), enqueues, then SIGNALS notEmpty. take() mirrors it: waits on notEmpty while empty, dequeues, signals notFull. Conditions let a thread sleep efficiently and be woken exactly when its condition might have changed — far better than spinning (which burns CPU)." },
      { kind: "concept", heading: "Why wait in a while loop",
        body: "ALWAYS re-check the predicate in a WHILE loop, not an if: a thread can wake spuriously (no real change) or another thread may have raced in and re-emptied/re-filled the queue between the signal and this thread re-acquiring the lock. Re-checking the condition on wake prevents acting on a stale assumption (e.g. dequeuing from an empty queue). This is the single most common bug in hand-rolled blocking queues." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Signal one vs all' (signal/notify wakes one waiter — efficient when any waiter can proceed; broadcast/notifyAll when conditions differ). 'Fairness' (FIFO waiters). 'timed offer/poll' (wait with a timeout). 'lock-free queue' (CAS-based, advanced). 'multiple producers/consumers' (the design already handles it). Signal: lock + notFull/notEmpty conditions + while-loop waits + signal on the opposite condition — the Producer-Consumer primitive." },
    ],
    "A bounded blocking queue tests core concurrency: a lock plus notFull/notEmpty condition variables, blocking (back-pressure) rather than spinning, and — critically — waiting in a WHILE loop to survive spurious wakeups/races. It's the Producer-Consumer building block.",
    ["Busy-waiting/spinning instead of blocking on a condition variable.",
     "Waiting in an `if` instead of a `while` (spurious wakeups / races dequeue from empty).",
     "Forgetting to signal the opposite condition after put()/take()."],
    0.6, { type: "Blocking queue", description: "put(): lock → while full wait(notFull) → enqueue → signal(notEmpty). take(): lock → while empty wait(notEmpty) → dequeue → signal(notFull). Capacity gives back-pressure.", alt: "Bounded blocking queue using a lock with notFull/notEmpty condition variables." }),

  T("lld_m13_t2", 2, "Design a Read-Write Lock", "design-read-write-lock",
    ["case-study", "concurrency", "lock", "reader-writer"],
    "Many threads read shared data; occasionally one writes. A plain mutex serializes even concurrent readers. Build a lock that lets readers share access but gives writers exclusivity. What's the rule, and the classic hazard?",
    "A read-write lock allows MANY concurrent readers OR ONE exclusive writer (never both). Track an active-reader count and writer state under a mutex + conditions: readers acquire if no writer active/waiting; a writer acquires only when zero readers and no writer. The classic hazard is WRITER STARVATION — a steady stream of readers blocks writers forever; fix with writer-preference.",
    [
      { kind: "concept", heading: "The invariant",
        body: "Concurrent reads don't conflict (no one mutates), so they can proceed in PARALLEL; a write must be EXCLUSIVE (no other reader or writer). So the lock permits either N readers OR 1 writer, never both. This beats a plain mutex for read-heavy workloads, where serializing readers needlessly is the bottleneck." },
      { kind: "concept", heading: "Implementation sketch",
        body: "Under a small internal mutex, track readerCount and a writerActive flag (and waiting counts). acquireRead: wait while a writer is active (or waiting, if writer-preferring), then readerCount++. releaseRead: readerCount--, and if it hits 0, signal a waiting writer. acquireWrite: wait until readerCount==0 and no writerActive, then set writerActive. releaseWrite: clear it and signal waiting readers/writers. Condition variables do the waiting/waking." },
      { kind: "concept", heading: "Starvation: the classic hazard",
        body: "With naive reader-preference, if readers keep arriving they never let readerCount reach 0, so a waiting WRITER STARVES indefinitely. Fixes: WRITER-PREFERENCE (once a writer is waiting, block new readers so existing readers drain and the writer gets in) — but that can starve readers; or a FAIR (FIFO) policy. The right choice depends on the workload; naming the starvation trade-off is the key interview signal." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Reentrancy' (can a thread that holds the read lock acquire it again / upgrade to write? upgrades risk deadlock if two readers both try). 'Upgrade/downgrade' (downgrade write→read is safe; upgrade read→write is dangerous). 'Lock-free / optimistic read' (StampedLock's optimistic mode — read without locking, validate after). Signal: N-readers-XOR-1-writer invariant + reader-count/writer-state under a mutex + the starvation/fairness trade-off." },
    ],
    "A read-write lock tests the N-readers-XOR-1-writer invariant via a reader count + writer state under a mutex/conditions, and — the key signal — recognizing writer starvation and the reader-preference vs writer-preference vs fair trade-off. Upgrade deadlock is the follow-up.",
    ["Allowing a reader and a writer (or two writers) concurrently — breaking the invariant.",
     "Ignoring writer starvation under continuous readers (no writer-preference/fairness).",
     "Naive read→write upgrade that deadlocks when two readers both upgrade."],
    0.6),

  T("lld_m13_t3", 3, "Design Connect Four", "design-connect-four",
    ["case-study", "grid", "win-detection", "state"],
    "Model Connect Four: a 7×6 grid where players drop discs into columns (gravity), and you must detect 4-in-a-row horizontally, vertically, or diagonally. How do you model the drop, and check for a win efficiently after each move?",
    "A 2D grid (columns with gravity — a disc falls to the lowest empty row); turn alternation is a small State. After a move, check only the FOUR DIRECTIONS through the just-placed disc (horizontal, vertical, two diagonals) for 4 consecutive — O(1)-ish per move, not a full-board scan. Track move count for a draw.",
    [
      { kind: "concept", heading: "Board & the drop",
        body: "Model a 7-column × 6-row grid. A move specifies a COLUMN; the disc falls to the lowest empty row in that column (gravity) — so a column is like a stack; reject a move into a full column. Track whose turn it is (alternating, a tiny State) and the total discs placed (for draw detection when the board fills)." },
      { kind: "concept", heading: "Efficient win detection",
        body: "After placing a disc at (r,c), you don't need to scan the whole board — a win must INVOLVE the just-placed disc. Check the four direction-axes through it: horizontal (←→), vertical (↑↓ — really just down), and the two diagonals (↙↗, ↖↘). For each axis, count consecutive same-color discs extending both ways from (r,c); if any axis reaches ≥4, that player wins. This is O(1) work per move (bounded by board size), far better than re-scanning everything." },
      { kind: "concept", heading: "Game state",
        body: "Game is a small State machine: IN_PROGRESS → WON (by a player) or DRAW (board full, no winner). The move handler validates (legal column, game not over), drops the disc, runs win-detection on the new disc, then either declares a result or switches turns. Keep board representation (2D array) separate from game rules." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Generalize to N-in-a-row / bigger board' (the direction-check generalizes). 'AI opponent' (minimax/alpha-beta over the grid — a Strategy). 'Undo a move' (Command/stack — pop the top disc of that column). 'Variants (gravity off = Tic-Tac-Toe-like)'. Signal: column-stack grid with gravity + alternating-turn State + win-detection limited to the four axes through the last move (not a full scan)." },
    ],
    "Connect Four tests grid modelling with gravity (column-as-stack) and — the key efficiency point — detecting a win by checking only the four axes through the just-placed disc, not scanning the whole board. The win-check generalizes to N-in-a-row.",
    ["Scanning the entire board for a win each move instead of the four axes through the last move.",
     "Forgetting gravity (a disc must fall to the lowest empty row) or rejecting full-column moves.",
     "No draw detection when the board fills with no winner."],
    0.4, { type: "Win detection", description: "Drop disc into a column (falls to lowest empty row). After placing at (r,c), check 4 axes through it — horizontal, vertical, both diagonals — for ≥4 consecutive. Win/Draw/continue.", alt: "Connect Four: gravity drop into columns, win checked along the four axes through the last disc." }),

  T("lld_m13_t4", 4, "Design a Sudoku Validator & Solver", "design-sudoku",
    ["case-study", "constraints", "backtracking", "validation"],
    "Model a 9×9 Sudoku: validate that a board has no rule violations, and solve an incomplete board. What's the rule check, and which algorithm fills the blanks?",
    "Validation checks the three CONSTRAINTS — each row, each column, and each 3×3 box has no duplicate digits (use sets). Solving fills empty cells by BACKTRACKING: try a valid digit in the next empty cell, recurse; if stuck, undo and try the next — pruning via the same constraint check. Track per-row/col/box sets for O(1) validity checks.",
    [
      { kind: "concept", heading: "The three constraints",
        body: "A valid Sudoku state requires: no digit repeats in any ROW, any COLUMN, or any 3×3 BOX. Validation scans the board maintaining a set per row, per column, and per box (the box index is (r/3)*3 + c/3); a duplicate insertion = invalid. This O(1)-per-cell check is also the engine the solver reuses to test candidate placements." },
      { kind: "concept", heading: "Solving with backtracking",
        body: "To fill blanks: find the next empty cell, TRY each digit 1–9 that doesn't violate the constraints, place it, and RECURSE to the next empty cell. If the recursion fails (some later cell has no valid digit), UNDO this placement (backtrack) and try the next digit. If a cell has no valid digit, return failure to the caller. Success when no empty cells remain. It's depth-first search over the placement tree with constraint pruning." },
      { kind: "concept", heading: "Make checks O(1)",
        body: "Re-scanning the row/col/box on every candidate is wasteful. Maintain the per-row, per-col, per-box SETS (or bitmasks) incrementally: placing a digit adds it to three sets; backtracking removes it from three sets. Checking 'is digit d valid at (r,c)?' is then three O(1) set lookups — turning a slow solver into a fast one." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Speed it up' (Most-Constrained-Variable heuristic: fill the cell with the fewest candidates first → prunes hugely; or model as exact-cover + Dancing Links). 'Validate a partial board' (just the constraint scan, ignoring blanks). 'Generate a puzzle / count solutions'. Signal: row/col/box constraint sets (O(1) checks) + backtracking DFS with undo + optional MRV heuristic." },
    ],
    "Sudoku tests constraint validation (no dup in row/col/box via sets) and backtracking DFS with constraint pruning + undo to solve. Maintaining incremental row/col/box sets for O(1) checks (and the MRV heuristic) is the efficiency signal.",
    ["Re-scanning the board for validity per candidate instead of incremental row/col/box sets.",
     "Solving by brute force without backtracking/undo (or without constraint pruning).",
     "Computing the 3×3 box index wrong (it's (r/3)*3 + c/3)."],
    0.5),

  T("lld_m13_t5", 5, "Design a JSON Parser", "design-json-parser",
    ["case-study", "parsing", "recursive-descent", "tokenizer"],
    "Build a parser that turns a JSON string into in-memory objects/arrays/values. JSON nests arbitrarily ({\"a\":[1,{\"b\":2}]}). What two stages, and which parsing technique naturally handles the nesting?",
    "Two stages: a LEXER/tokenizer scans characters into tokens ({ } [ ] : , string, number, true/false/null), then a RECURSIVE-DESCENT parser builds the value tree — parseValue dispatches on the token, with parseObject/parseArray calling parseValue recursively for nesting. The grammar's recursion maps directly to recursive functions.",
    [
      { kind: "concept", heading: "Two stages: lex then parse",
        body: "Don't parse raw characters and structure at once. (1) LEX: scan the input into a stream of TOKENS — structural ({ } [ ] : ,) and literals (string, number, true/false/null) — handling whitespace and escapes here. (2) PARSE: consume tokens to build the value tree. Separating lexing from parsing keeps each simple (the parser thinks in tokens, not characters)." },
      { kind: "concept", heading: "Recursive descent mirrors the grammar",
        body: "JSON's grammar is recursive (a value can be an object/array whose members are values). RECURSIVE-DESCENT parsing mirrors it with one function per rule: parseValue() looks at the current token and dispatches — '{' → parseObject(), '[' → parseArray(), a literal → return it. parseObject() loops reading string ':' parseValue() pairs; parseArray() loops reading parseValue() items. The recursion in the grammar becomes recursion in the code — nesting is handled for free." },
      { kind: "concept", heading: "Consuming tokens & errors",
        body: "The parser holds a position into the token stream; helpers peek() (look) and expect(type) (consume or error). After parsing the top-level value, expect EOF (trailing junk = error). Report errors with position/context ('expected ':' at line 3'). Malformed input (unclosed brace, missing comma, bad escape) must fail cleanly, not loop or crash." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Streaming/huge files' (a SAX-style event parser instead of building the whole tree in memory). 'Numbers/precision' (ints vs floats, big numbers). 'Duplicate keys', 'depth limits' (guard stack overflow on deeply nested input — a security concern). 'Pretty-print / serialize' (the inverse). Signal: lexer → recursive-descent parser (function per grammar rule) building a value tree, with peek/expect token consumption and clean error reporting." },
    ],
    "A JSON parser is the textbook lexer + recursive-descent design: tokenize, then one parse function per grammar rule (parseValue/Object/Array) whose recursion mirrors JSON's nesting. peek/expect token consumption and clean error handling are the craft.",
    ["Parsing characters and structure in one tangled pass instead of lex-then-parse.",
     "Hand-rolling nesting with manual stacks instead of recursive-descent matching the grammar.",
     "Not guarding against malformed input / unbounded nesting depth (stack overflow)."],
    0.6, { type: "Parse pipeline", description: "JSON string → Lexer → tokens ({ } [ ] : , string number bool null) → recursive-descent parser (parseValue → parseObject/parseArray → parseValue …) → value tree. Expect EOF.", alt: "JSON parsing: lexer producing tokens, recursive-descent parser building a nested value tree." }),

  T("lld_m13_t6", 6, "Design a Dependency-Injection Container", "design-di-container",
    ["case-study", "ioc", "lifecycle", "reflection"],
    "Build an IoC container: register how to create services, then RESOLVE one and have the container auto-construct it and all its dependencies. How does it know what to inject, and how does it avoid building a singleton twice?",
    "The container is a registry mapping a type/key → a binding (how to create it + a LIFETIME: singleton/transient/scoped). resolve(T) reads T's constructor dependencies, recursively resolves each, then constructs T — auto-wiring the graph. Singletons are cached. It must DETECT circular dependencies. This is Inversion of Control made concrete.",
    [
      { kind: "concept", heading: "Register then resolve",
        body: "Two phases. REGISTER: bind an abstraction to a creator — register(IRepo, SqlRepo) or register(ILogger, () => new FileLogger()), with a LIFETIME. RESOLVE: ask the container for an instance — container.resolve(OrderService) — and it builds the whole object graph. Inversion of Control: classes declare what they need (via constructor params) instead of newing their own dependencies, so wiring is centralized and swappable (great for testing — inject a mock)." },
      { kind: "concept", heading: "Auto-wiring the graph",
        body: "To construct a type, the container inspects its CONSTRUCTOR's parameter types (via reflection/metadata), RECURSIVELY resolves each one (building their dependencies too), then invokes the constructor with the resolved instances. So resolving the root of a deep graph constructs everything beneath it automatically. Constructor injection is preferred (dependencies are explicit and the object is fully initialized)." },
      { kind: "concept", heading: "Lifetimes & caching",
        body: "A binding's LIFETIME controls instance reuse: SINGLETON (one instance for the container's life — cache it after first creation, return the cache thereafter, thread-safely), TRANSIENT (a new instance every resolve), SCOPED (one per scope, e.g. per web request). The container holds the singleton cache and per-scope caches. Getting singleton creation thread-safe (don't build it twice under a race) reuses the lazy-Singleton discipline." },
      { kind: "concept", heading: "Cycles & follow-ups",
        body: "If A needs B and B needs A, recursive resolution would loop forever → DETECT the cycle (track the resolution stack; a type appearing twice = circular dependency) and fail with a clear error. Follow-ups: 'property/method injection', 'named/keyed bindings', 'open generics', 'disposal' (dispose scoped/singletons on scope/container end), 'lazy/factory injection to break cycles'. Signal: type→binding registry + constructor auto-wiring via recursive resolve + lifetime caching + circular-dependency detection." },
    ],
    "A DI container tests IoC: a type→binding registry, constructor auto-wiring by recursively resolving dependencies, lifetime management (singleton cache / transient / scoped), and circular-dependency detection. Thread-safe singleton creation reuses the lazy-Singleton idea.",
    ["Resolving without recursively building the dependency graph (no auto-wiring).",
     "Ignoring lifetimes — rebuilding singletons every resolve (or racing to build two).",
     "No circular-dependency detection (infinite recursion on A↔B)."],
    0.6, { type: "Resolve graph", description: "register(type → creator + lifetime). resolve(T): inspect T's ctor deps → recursively resolve each → construct T. Singletons cached; resolution stack detects cycles.", alt: "DI container resolving a type by recursively constructing its dependency graph, caching singletons." }),

  T("lld_m13_t7", 7, "Design a Plugin System", "design-plugin-system",
    ["case-study", "extensibility", "interface", "registry"],
    "Build a system third parties can EXTEND without modifying (or recompiling) the core — discovering, loading, and running plugins safely. What contract lets the core call code it's never seen, and how are plugins found?",
    "Define a stable plugin INTERFACE (the contract) the core calls against; plugins implement it and are DISCOVERED/loaded at runtime (from a directory/manifest), REGISTERED into a registry, and invoked via the interface (the core never references concrete plugins). Hooks/extension points define WHERE plugins act. It's the Open–Closed Principle + Strategy at architecture scale.",
    [
      { kind: "concept", heading: "Program to a contract",
        body: "The core defines a PLUGIN INTERFACE (e.g. Plugin { id(); init(context); execute(input) }) — a stable contract. The core only ever calls THIS interface, never any concrete plugin class. Plugins implement the interface. This lets the core invoke code that didn't exist when the core was built — extension without modification (Open–Closed). It's the Strategy pattern elevated to a whole subsystem." },
      { kind: "concept", heading: "Discovery & loading",
        body: "Plugins live outside the core (a /plugins folder, jars, packages) described by a MANIFEST (id, version, entry class, declared extension points). At startup (or on demand) the system DISCOVERS them (scan the directory / read manifests), LOADS each (often in its own class loader / module so versions don't clash), instantiates the entry class, and REGISTERS it. Dynamic loading is what makes the system extensible without recompiling the core." },
      { kind: "concept", heading: "Extension points / hooks",
        body: "Define WHERE plugins can plug in: named EXTENSION POINTS or HOOKS (events the core fires, menus to add to, filters in a pipeline). A plugin declares which hooks it handles; the core, at each hook, looks up registered plugins for that point and invokes them (often a Chain/pipeline or Observer-style broadcast). This bounds what plugins can do and keeps the core in control of ordering." },
      { kind: "concept", heading: "Safety, lifecycle & follow-ups",
        body: "Concerns: a plugin can crash/hang/misbehave → ISOLATE (sandbox, timeouts, catch exceptions so one bad plugin doesn't take down the host), VERSION the API (compatibility), manage LIFECYCLE (init/start/stop/unload), and resolve DEPENDENCIES/ordering between plugins. Provide a controlled CONTEXT/API surface (don't hand plugins the whole core). Follow-ups: 'hot reload', 'permissions/capabilities', 'inter-plugin communication'. Signal: stable interface contract + runtime discovery/loading + registry + extension-point hooks + isolation/versioning (Open–Closed at scale)." },
    ],
    "A plugin system tests extensibility architecture: a stable interface contract the core calls, runtime discovery/loading of plugins into a registry, named extension-point hooks for where they act, and isolation/versioning for safety. It's Open–Closed + Strategy at subsystem scale.",
    ["The core referencing concrete plugins instead of only a stable interface (defeats extension).",
     "No isolation — a crashing/hanging plugin takes down the host.",
     "Ignoring API versioning and a controlled context (handing plugins the whole core)."],
    0.5, { type: "Plugin architecture", description: "Core defines Plugin interface + extension-point hooks. Discover plugins (manifests/dir) → load (isolated) → register. At each hook, core invokes registered plugins via the interface.", alt: "Plugin system: stable interface, runtime discovery/registration, and extension-point hooks." }),

  T("lld_m13_t8", 8, "Design a Configuration Manager", "design-config-manager",
    ["case-study", "configuration", "precedence", "observer"],
    "Build app configuration: values from multiple sources (defaults, file, environment, command-line, remote), with a clear PRECEDENCE, type-safe access, and ideally live reload. How do you merge sources, and how do consumers react to a change?",
    "Layer the SOURCES with a defined PRECEDENCE (e.g. defaults < file < env < CLI < remote override) and merge into one effective view; expose typed, validated accessors (not raw strings). For live reload, watch sources and notify subscribers via Observer (or expose a reactive value). Centralize so the rest of the app reads config one way.",
    [
      { kind: "concept", heading: "Multiple sources, one view",
        body: "Real apps draw config from several places: built-in DEFAULTS, a config FILE (yaml/json), ENVIRONMENT variables, COMMAND-LINE args, and sometimes a REMOTE store (the feature-flag/config service). The manager's job is to merge these into ONE effective configuration the app reads from — consumers shouldn't care where a value came from." },
      { kind: "concept", heading: "Precedence is the core rule",
        body: "When the same key is set in multiple sources, a defined PRECEDENCE/override ORDER decides the winner — typically defaults < config file < environment < command-line < explicit remote/runtime override (later overrides earlier). Merging is layering: start from defaults and let higher-priority sources override. Document and enforce this order; ambiguity here is the classic source of 'why is this value not what I set?' bugs." },
      { kind: "concept", heading: "Type-safe, validated access",
        body: "Don't scatter raw string lookups (getConfig('timeout') parsed ad hoc everywhere). Provide TYPED accessors (getInt, getBool, getDuration) or bind config to a typed schema/object, VALIDATE at load (required keys present, values in range, enums valid) and fail fast on misconfiguration. This catches errors at startup, not at 3am in production." },
      { kind: "concept", heading: "Live reload & follow-ups",
        body: "For dynamic config (feature flags, log levels), WATCH the sources (file watcher / poll the remote) and, on change, re-merge and NOTIFY interested components via Observer (or expose a reactive/observable value they read). Components re-read affected settings without a restart. Follow-ups: 'secrets' (don't log them; pull from a secrets manager), 'per-environment configs', 'atomic swap on reload' (no half-applied config), 'audit who changed what'. Signal: layered sources + explicit precedence merge + typed/validated access + Observer-based live reload, centralized." },
    ],
    "A configuration manager tests merging layered sources by an explicit precedence (defaults < file < env < CLI < remote), typed/validated access (fail fast), and Observer-based live reload. Getting precedence clear and validation up-front is the signal; secrets handling is the follow-up.",
    ["No defined precedence when a key is set in multiple sources (nondeterministic winner).",
     "Scattered raw-string lookups instead of typed, validated, centralized access.",
     "Mutating config in place on reload (half-applied) instead of an atomic swap + notify."],
    0.4, { type: "Config layering", description: "Sources merged by precedence: defaults < file < env < CLI < remote override → one effective config. Typed/validated accessors; watch sources → re-merge → Observer notifies consumers (live reload).", alt: "Configuration manager layering sources by precedence with typed access and Observer reload." }),
];

const EXERCISES = [
  // Bounded blocking queue
  pm({ topicId: "lld_m13_t1", exerciseId: "lld_m13_t1_pm_1", position: 1, level: "hard", title: "Block, don't spin",
    scenario: "put() is called on a full queue. A good design makes the thread…",
    options: ["Block on a condition variable until space frees", "Spin in a loop checking the count", "Throw and lose the item", "Silently drop the item"], correct: "Block on a condition variable until space frees",
    explanation: "Blocking on notFull gives back-pressure and wastes no CPU; spinning burns cycles." }),
  pm({ topicId: "lld_m13_t1", exerciseId: "lld_m13_t1_pm_2", position: 2, level: "hard", title: "while vs if",
    scenario: "A waiting thread should re-check its condition in a…",
    options: ["while loop (handles spurious wakeups and races)", "single if (check once)", "for loop with a fixed count", "try/catch"], correct: "while loop (handles spurious wakeups and races)",
    explanation: "Spurious wakeups and races mean the predicate may still be false on wake — always re-check in a while." }),
  pm({ topicId: "lld_m13_t1", exerciseId: "lld_m13_t1_pm_3", position: 3, level: "medium", title: "After take()",
    scenario: "After take() removes an item, it should…",
    options: ["Signal notFull (a blocked producer can proceed)", "Signal notEmpty", "Signal nothing", "Acquire a second lock"], correct: "Signal notFull (a blocked producer can proceed)",
    explanation: "Removing an item frees space, so wake a producer waiting on notFull (put signals notEmpty, symmetrically)." }),
  // Read-write lock
  pm({ topicId: "lld_m13_t2", exerciseId: "lld_m13_t2_pm_1", position: 1, level: "medium", title: "The invariant",
    scenario: "A read-write lock permits…",
    options: ["Many concurrent readers OR one exclusive writer (never both)", "Many readers and many writers", "One reader and one writer together", "Only one thread ever"], correct: "Many concurrent readers OR one exclusive writer (never both)",
    explanation: "Reads share (no mutation conflicts); a write needs exclusivity — N readers XOR 1 writer." }),
  pm({ topicId: "lld_m13_t2", exerciseId: "lld_m13_t2_pm_2", position: 2, level: "hard", title: "Classic hazard",
    scenario: "With naive reader-preference and a steady stream of readers, what happens to writers?",
    options: ["Writer starvation — they may wait forever", "They get priority automatically", "They corrupt the data", "Nothing — it's fair"], correct: "Writer starvation — they may wait forever",
    explanation: "Continuous readers keep readerCount > 0, so a writer never acquires; fix with writer-preference or fairness." }),
  pm({ topicId: "lld_m13_t2", exerciseId: "lld_m13_t2_pm_3", position: 3, level: "hard", title: "Upgrade danger",
    scenario: "Which is dangerous and can deadlock?",
    options: ["Two readers both trying to upgrade their read lock to a write lock", "Downgrading a write lock to a read lock", "Releasing a read lock", "Acquiring a read lock"], correct: "Two readers both trying to upgrade their read lock to a write lock",
    explanation: "Each upgrader waits for the other to release its read lock — a deadlock; downgrade (write→read) is safe." }),
  // Connect Four
  pm({ topicId: "lld_m13_t3", exerciseId: "lld_m13_t3_pm_1", position: 1, level: "medium", title: "The drop",
    scenario: "A move picks a column. The disc lands…",
    options: ["In the lowest empty row of that column (gravity)", "Wherever the player clicks", "Always in the top row", "In a random row"], correct: "In the lowest empty row of that column (gravity)",
    explanation: "Gravity makes a column behave like a stack; reject moves into a full column." }),
  pm({ topicId: "lld_m13_t3", exerciseId: "lld_m13_t3_pm_2", position: 2, level: "hard", title: "Win check",
    scenario: "After placing a disc, the efficient win check is…",
    options: ["Check the 4 axes through the just-placed disc for ≥4 consecutive", "Scan the whole board every move", "Check only the top row", "Check only the placed column"], correct: "Check the 4 axes through the just-placed disc for ≥4 consecutive",
    explanation: "A win must involve the new disc; check horizontal, vertical, and both diagonals through it — not a full scan." }),
  pm({ topicId: "lld_m13_t3", exerciseId: "lld_m13_t3_pm_3", position: 3, level: "easy", title: "Draw",
    scenario: "A draw occurs when…",
    options: ["The board fills with no 4-in-a-row", "A player runs out of time", "Both players have 3 in a row", "Never"], correct: "The board fills with no 4-in-a-row",
    explanation: "Track placed discs; a full board with no winner is a draw." }),
  // Sudoku
  pm({ topicId: "lld_m13_t4", exerciseId: "lld_m13_t4_pm_1", position: 1, level: "medium", title: "Validity rule",
    scenario: "A Sudoku board is valid when…",
    options: ["No digit repeats in any row, column, or 3×3 box", "The numbers sum to 45 per row only", "It's completely filled", "Diagonals have no repeats"], correct: "No digit repeats in any row, column, or 3×3 box",
    explanation: "The three constraints — row, column, and 3×3 box uniqueness — define validity." }),
  pm({ topicId: "lld_m13_t4", exerciseId: "lld_m13_t4_pm_2", position: 2, level: "hard", title: "Solving",
    scenario: "Filling an incomplete board is done by…",
    options: ["Backtracking DFS with constraint pruning + undo", "Trying random digits until it works", "A single forward pass", "Sorting the cells"], correct: "Backtracking DFS with constraint pruning + undo",
    explanation: "Place a valid digit, recurse; on a dead end, undo and try the next — DFS with pruning." }),
  pm({ topicId: "lld_m13_t4", exerciseId: "lld_m13_t4_pm_3", position: 3, level: "hard", title: "O(1) checks",
    scenario: "To check 'is digit d valid at (r,c)?' in O(1), maintain…",
    options: ["Per-row, per-column, per-box sets/bitmasks updated incrementally", "A re-scan of the board each time", "A sorted list of placed digits", "Nothing — scan is fine"], correct: "Per-row, per-column, per-box sets/bitmasks updated incrementally",
    explanation: "Incremental sets make validity three O(1) lookups; add on place, remove on backtrack." }),
  // JSON parser
  pm({ topicId: "lld_m13_t5", exerciseId: "lld_m13_t5_pm_1", position: 1, level: "medium", title: "Two stages",
    scenario: "A clean JSON parser is structured as…",
    options: ["Lexer (chars → tokens) then parser (tokens → value tree)", "One pass over raw characters", "Parser then lexer", "Just a regex"], correct: "Lexer (chars → tokens) then parser (tokens → value tree)",
    explanation: "Lexing then parsing keeps each stage simple — the parser reasons about tokens, not characters." }),
  pm({ topicId: "lld_m13_t5", exerciseId: "lld_m13_t5_pm_2", position: 2, level: "hard", title: "Handling nesting",
    scenario: "JSON nests arbitrarily. The technique that handles this naturally is…",
    options: ["Recursive descent (parseValue calls parseObject/parseArray which call parseValue)", "A single while loop", "Sorting tokens", "Counting braces only"], correct: "Recursive descent (parseValue calls parseObject/parseArray which call parseValue)",
    explanation: "The grammar's recursion maps to recursive functions, so nested values are handled for free." }),
  pm({ topicId: "lld_m13_t5", exerciseId: "lld_m13_t5_pm_3", position: 3, level: "medium", title: "Bad input",
    scenario: "Deeply nested or malformed JSON should be handled by…",
    options: ["Clean errors + a depth guard (avoid stack overflow / infinite loop)", "Crashing", "Ignoring the rest", "Returning null silently"], correct: "Clean errors + a depth guard (avoid stack overflow / infinite loop)",
    explanation: "Report errors with position; cap nesting depth to prevent stack-overflow attacks on recursive descent." }),
  // DI container
  pm({ topicId: "lld_m13_t6", exerciseId: "lld_m13_t6_pm_1", position: 1, level: "hard", title: "Auto-wiring",
    scenario: "To construct OrderService, the container…",
    options: ["Inspects its constructor deps and recursively resolves each", "Asks OrderService to new its own deps", "Returns a blank instance", "Requires you to pass all deps manually"], correct: "Inspects its constructor deps and recursively resolves each",
    explanation: "Constructor injection + recursive resolution auto-wires the whole object graph." }),
  pm({ topicId: "lld_m13_t6", exerciseId: "lld_m13_t6_pm_2", position: 2, level: "medium", title: "Singleton lifetime",
    scenario: "A service registered as singleton should be…",
    options: ["Created once and cached (thread-safely), reused thereafter", "Created on every resolve", "Never created", "Created per request"], correct: "Created once and cached (thread-safely), reused thereafter",
    explanation: "Singletons are cached after first creation; transient = new each time, scoped = per scope." }),
  pm({ topicId: "lld_m13_t6", exerciseId: "lld_m13_t6_pm_3", position: 3, level: "hard", title: "A needs B needs A",
    scenario: "A depends on B and B depends on A. The container should…",
    options: ["Detect the circular dependency (resolution stack) and error", "Recurse forever", "Pick one arbitrarily", "Return null for both"], correct: "Detect the circular dependency (resolution stack) and error",
    explanation: "Tracking the resolution stack catches a type resolving itself transitively — fail with a clear error." }),
  // Plugin system
  pm({ topicId: "lld_m13_t7", exerciseId: "lld_m13_t7_pm_1", position: 1, level: "medium", title: "The contract",
    scenario: "How can the core call code that didn't exist when it was built?",
    options: ["The core calls a stable plugin interface; plugins implement it", "The core imports each plugin class directly", "It can't", "By recompiling the core per plugin"], correct: "The core calls a stable plugin interface; plugins implement it",
    explanation: "Programming to a stable interface (Open–Closed) lets the core invoke unknown implementations." }),
  pm({ topicId: "lld_m13_t7", exerciseId: "lld_m13_t7_pm_2", position: 2, level: "medium", title: "Finding plugins",
    scenario: "Plugins are typically…",
    options: ["Discovered at runtime (dir/manifests), loaded, and registered", "Hardcoded in the core", "Compiled into the core binary", "Entered by the user each run"], correct: "Discovered at runtime (dir/manifests), loaded, and registered",
    explanation: "Runtime discovery + dynamic loading into a registry is what makes the system extensible without recompiling." }),
  pm({ topicId: "lld_m13_t7", exerciseId: "lld_m13_t7_pm_3", position: 3, level: "hard", title: "Safety",
    scenario: "A plugin might crash or hang. The host should…",
    options: ["Isolate plugins (sandbox/timeouts/catch) so one can't take down the host", "Trust all plugins fully", "Run plugins on the UI thread", "Give plugins full core access"], correct: "Isolate plugins (sandbox/timeouts/catch) so one can't take down the host",
    explanation: "Isolation, timeouts, exception capture, and a controlled context protect the host from misbehaving plugins." }),
  // Config manager
  pm({ topicId: "lld_m13_t8", exerciseId: "lld_m13_t8_pm_1", position: 1, level: "hard", title: "Same key, many sources",
    scenario: "A key is set in both the env and the config file. Which wins?",
    options: ["Whichever the defined precedence ranks higher (e.g. env > file)", "Whichever was read first", "They're concatenated", "It's undefined"], correct: "Whichever the defined precedence ranks higher (e.g. env > file)",
    explanation: "An explicit precedence (defaults < file < env < CLI < remote) decides the winner deterministically." }),
  pm({ topicId: "lld_m13_t8", exerciseId: "lld_m13_t8_pm_2", position: 2, level: "medium", title: "Access",
    scenario: "Consumers should read config via…",
    options: ["Typed, validated accessors (validated at load, fail fast)", "Raw string lookups parsed ad hoc everywhere", "Global mutable variables", "Direct file reads"], correct: "Typed, validated accessors (validated at load, fail fast)",
    explanation: "Typed access + load-time validation catches misconfiguration at startup, not in production." }),
  pm({ topicId: "lld_m13_t8", exerciseId: "lld_m13_t8_pm_3", position: 3, level: "medium", title: "Live reload",
    scenario: "When a watched config source changes at runtime, consumers learn via…",
    options: ["Observer notification (re-merge then notify subscribers)", "Restarting the app only", "Polling each value constantly", "Nothing — config is static"], correct: "Observer notification (re-merge then notify subscribers)",
    explanation: "Watch sources, re-merge atomically, and notify subscribers via Observer so they re-read without a restart." }),
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
  console.log(`\nDone — M13 Case Studies VII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
