/**
 * Seed — LLD module M16: Case Studies X (frameworks, utilities & games):
 * Event Bus/EventEmitter, Retry/Backoff Utility, Memoization Cache, CSV Parser,
 * State Machine Framework, Build System/Task Runner, Maze Generator+Solver,
 * Scrabble. Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases10.js   ·   npm: npm run seed:lld-cases10
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m16";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 16,
  name: "Case Studies X — Frameworks, Utilities & Games", slug: "case-studies-10",
  description: "Eight more designs: an in-process event bus, a retry/backoff utility, a memoization cache, a CSV parser, a generic state-machine framework, a build system/task runner, a maze generator & solver, and Scrabble.",
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
  T("lld_m16_t1", 1, "Design an In-Process Event Bus", "design-event-bus",
    ["case-study", "observer", "pub-sub", "decoupling"],
    "Build an in-process event bus / EventEmitter: components publish events by type and others subscribe, without knowing each other. How do you route events to handlers, and what happens when one handler throws?",
    "A registry mapping event TYPE → list of subscribed handlers; publish(event) looks up handlers for that type and invokes each. It's the Observer pattern generalized via a central broker (publishers/subscribers fully decoupled). Key concerns: ISOLATE handler errors (one throwing must not break others or the publisher), sync vs async dispatch, and subscribe/unsubscribe lifecycle.",
    [
      { kind: "concept", heading: "Decouple publishers and subscribers",
        body: "An event bus lets a component emit('orderPlaced', data) without knowing who (if anyone) reacts, and lets others subscribe('orderPlaced', handler) without knowing the emitter. The BUS is a central broker holding a map of event type → subscribed handlers. This is the Observer pattern with a mediator, removing direct references between modules (decoupling) — great for plugins, cross-cutting concerns, and reducing spaghetti dependencies." },
      { kind: "concept", heading: "Subscribe / publish / unsubscribe",
        body: "subscribe(type, handler) appends the handler to that type's list (returns a token/unsubscribe function); publish(type, payload) looks up the list and invokes each handler with the payload; unsubscribe removes it. Support once() (auto-unsubscribe after first fire) and wildcard/topic patterns if needed. Manage lifecycle carefully — forgetting to unsubscribe is a classic memory leak (handlers + their captured state never freed)." },
      { kind: "concept", heading: "Error isolation",
        body: "The critical robustness point: if one subscriber's handler THROWS, it must NOT prevent the other subscribers from running, nor crash the publisher. Wrap each handler invocation in a try/catch, collect/report errors (or route to an error channel), and continue. Without this, one buggy listener silently breaks unrelated features. Order of handler invocation is typically registration order (document it)." },
      { kind: "concept", heading: "Sync vs async & follow-ups",
        body: "Dispatch can be SYNCHRONOUS (handlers run inline before publish() returns — simple, ordered, but a slow handler blocks the publisher) or ASYNCHRONOUS (queue events, dispatch on another thread/microtask — non-blocking, but ordering/back-pressure to manage). Choose per use case. Follow-ups: 'typed events' (compile-time safety), 'priorities', 'back-pressure on async', 'distributed bus' (then it's the SD pub-sub/MQ design). Signal: type→handlers registry (Observer + broker) + subscribe/unsubscribe lifecycle + per-handler error isolation + sync/async dispatch choice.",
      },
    ],
    "An event bus generalizes Observer with a central broker: a type→handlers registry decouples publishers from subscribers, with subscribe/unsubscribe lifecycle, per-handler error isolation (one throwing must not break others), and a sync-vs-async dispatch choice. Forgetting to unsubscribe is the classic memory leak.",
    ["Direct references between modules instead of routing through the bus (no decoupling).",
     "One handler throwing breaking the others / the publisher (no error isolation).",
     "Leaking handlers by never unsubscribing (memory leak)."],
    0.4, { type: "Event bus", description: "Registry: event type → [handlers]. publish(type, payload) → look up handlers → invoke each (try/catch per handler — error isolation). subscribe/unsubscribe manage the lists. Sync or async dispatch.", alt: "In-process event bus routing events by type to subscribed handlers with error isolation." }),

  T("lld_m16_t2", 2, "Design a Retry / Backoff Utility", "design-retry-backoff",
    ["case-study", "resilience", "strategy", "backoff"],
    "Build a reusable retry utility: wrap an operation so transient failures are retried automatically with sensible delays. Retrying immediately and forever is harmful. What makes retries safe and effective?",
    "Retry only RETRYABLE (transient) errors, up to a MAX attempts, with EXPONENTIAL BACKOFF + JITTER between tries (not immediate/fixed) to avoid hammering a struggling dependency and synchronized retry storms. A retry Policy (max attempts, backoff, which errors) is configurable (Strategy). The operation should be IDEMPOTENT — retries may duplicate effects otherwise.",
    [
      { kind: "concept", heading: "What & how many to retry",
        body: "Wrap an operation and re-invoke it on failure — but only for TRANSIENT/retryable errors (timeouts, 503, connection reset), NOT for permanent ones (400 bad request, auth failure — retrying those is pointless and harmful). Cap at a MAX number of attempts; after that, give up and surface the error (or a fallback). A predicate decides which errors are retryable." },
      { kind: "concept", heading: "Backoff + jitter (the core)",
        body: "Don't retry immediately or at a fixed interval. Use EXPONENTIAL BACKOFF: wait increasing delays (e.g. 1s, 2s, 4s, 8s…) so a struggling dependency gets breathing room. Add JITTER (randomize the delay) — critical because without it, many clients that failed together retry in synchronized waves (a 'thundering herd' / retry storm) that re-overwhelms the recovering service. Cap the max delay. This backoff+jitter is the heart of safe retries." },
      { kind: "concept", heading: "Idempotency requirement",
        body: "Retrying means the operation may EXECUTE MORE THAN ONCE (e.g. the first attempt actually succeeded but the response was lost, so you retry and do it again). So retried operations must be IDEMPOTENT (safe to repeat — use idempotency keys for writes like payments). Blindly retrying a non-idempotent operation can double-charge/duplicate. This caveat is essential to state." },
      { kind: "concept", heading: "Composition & follow-ups",
        body: "Configure via a Policy (Strategy): max attempts, base/max delay, backoff type, retryable-error predicate. Compose with TIMEOUTS (each attempt) and a CIRCUIT BREAKER (stop retrying a consistently-failing dependency — the m14 design) so retries don't pile onto an outage. Follow-ups: 'budget/deadline across attempts', 'retry only safe HTTP methods', 'logging/metrics per attempt'. Signal: retryable-only + max attempts + exponential backoff WITH jitter + idempotency requirement + configurable Policy, composed with timeout/circuit-breaker.",
      },
    ],
    "A retry utility tests safe resilience: retry only transient errors up to a max, with exponential backoff + JITTER (jitter prevents synchronized retry storms — the key detail), a configurable Policy (Strategy), and the idempotency requirement since retries can duplicate effects. Compose with timeouts and a circuit breaker.",
    ["Retrying immediately / at a fixed interval without exponential backoff + jitter (retry storms).",
     "Retrying non-retryable (permanent) errors, or retrying a non-idempotent operation (duplicate effects).",
     "Unbounded retries with no max attempts / no circuit breaker during an outage."],
    0.5, { type: "Retry policy", description: "attempt op → success? done. Fail → retryable & attempts<max? wait (exponential backoff + jitter) → retry; else give up. Operation must be idempotent. Compose with timeout + circuit breaker.", alt: "Retry utility: retryable-only with exponential backoff and jitter up to a max attempts." }),

  T("lld_m16_t3", 3, "Design a Memoization / Function Cache", "design-memoization",
    ["case-study", "cache", "decorator", "proxy"],
    "Build memoization: wrap an expensive pure function so repeated calls with the same arguments return a cached result. How do you key the cache by arguments, bound its size, and stay correct for concurrent calls?",
    "Wrap the function (Decorator/Proxy) with a cache keyed by a canonical form of the ARGUMENTS; on call, return the cached value if present, else compute, store, and return. Bound memory with an eviction policy (LRU) + optional TTL. For concurrency, COALESCE in-flight calls for the same key (compute once). Only valid for PURE functions (same args → same result).",
    [
      { kind: "concept", heading: "Wrap with a cache (Decorator)",
        body: "Memoization adds caching around a function WITHOUT changing its code — the Decorator/Proxy pattern: memoize(fn) returns a new function with the same signature that consults a cache first. On a call: build a key from the arguments; if the key is cached, return the stored result (a HIT — skip computation); else compute fn(args), STORE the result under the key, and return it. Transparent to callers." },
      { kind: "concept", heading: "Keying by arguments",
        body: "The cache key must canonically represent the ARGUMENTS so equal calls collide and different calls don't. For primitives, a serialized tuple works; for objects, you need a stable canonical serialization (or structural hashing) — and beware reference vs value equality. Bad keying is the classic bug: either cache misses that should hit (over-specific keys) or wrong results from collisions (under-specific keys)." },
      { kind: "concept", heading: "Purity, bounds & invalidation",
        body: "Memoization is only CORRECT for PURE functions (no side effects; same inputs → same output). Caching an impure function returns stale/wrong results. Bound the cache (it can grow unboundedly otherwise) with an LRU eviction policy and/or TTL (the LRU-cache design). If the underlying data CAN change, you need invalidation/TTL — otherwise it stays the same forever (which is the point for pure functions)." },
      { kind: "concept", heading: "Concurrency & follow-ups",
        body: "Under concurrency, two threads calling the same uncached key would both compute it (wasteful, maybe expensive). COALESCE: store a future/placeholder so the second caller waits for the first's result (compute-once — the same cache-stampede idea as the concurrent cache). Follow-ups: 'weak references for GC', 'per-instance vs global cache', 'recursive memoization (DP — Fibonacci)'. Signal: Decorator wrapping + argument-keyed cache + purity requirement + bounded (LRU/TTL) + concurrent compute-once coalescing.",
      },
    ],
    "Memoization wraps a pure function (Decorator/Proxy) with an argument-keyed cache: hit → return cached, miss → compute+store. Correct only for pure functions; bound with LRU/TTL, and coalesce concurrent same-key calls (compute-once). Argument keying is the subtle correctness point.",
    ["Memoizing an impure function (stale/wrong results) — only pure functions are safe.",
     "Bad argument keying (over-specific = no hits; under-specific = wrong results from collisions).",
     "Unbounded cache growth (no LRU/TTL); concurrent calls both computing the same key."],
    0.4),

  T("lld_m16_t4", 4, "Design a CSV Parser", "design-csv-parser",
    ["case-study", "state-machine", "parsing", "streaming"],
    "Build a robust CSV parser. The naive split(',') and split('\\n') breaks the moment a field contains a comma, a newline, or a quote inside quotes. What correctly handles quoted fields, and how do you parse huge files?",
    "Parse character-by-character with a small STATE MACHINE (in-field / in-quoted-field / quote-in-quoted) — NOT split() — so commas and newlines INSIDE quoted fields are treated as data, and escaped quotes (\"\") become a literal quote. STREAM rows for large files (don't load all into memory). Handle the dialect (delimiter, quote char, header, line endings).",
    [
      { kind: "concept", heading: "Why split() fails",
        body: "CSV looks trivial but isn't: a field can be QUOTED (\"a,b\") to contain the delimiter, contain a NEWLINE inside quotes (a multi-line field), and represent a literal quote by DOUBLING it (\"\"). So line.split(',') and text.split('\\n') corrupt any file using these features (which real CSVs do). You can't tokenize by naive splitting — the meaning of a comma/newline depends on whether you're inside quotes." },
      { kind: "concept", heading: "A character-level state machine",
        body: "Parse one CHARACTER at a time with a STATE MACHINE. States like: START_FIELD, IN_UNQUOTED_FIELD, IN_QUOTED_FIELD, QUOTE_IN_QUOTED. Transitions: a comma in IN_UNQUOTED ends the field, but in IN_QUOTED it's just data; a quote enters/exits quoted mode; a quote while IN_QUOTED goes to QUOTE_IN_QUOTED (the next char decides: another quote = literal \", else end-of-quoted-field); a newline ends the record only when NOT in a quoted field. This state machine is the correct, robust core." },
      { kind: "concept", heading: "Streaming for large files",
        body: "A multi-GB CSV won't fit in memory. STREAM: read the input in chunks and EMIT rows as they complete (a row iterator / callback per row), so memory stays O(one row), not O(file). The state machine carries across chunk boundaries (a field/record may span chunks). This pull/push streaming model is essential for big data files." },
      { kind: "concept", heading: "Dialects & follow-ups",
        body: "Make the DIALECT configurable: delimiter (comma/tab/semicolon), quote char, escape rules, header row (map columns to field names), line endings (\\n vs \\r\\n), trimming. Validate row width (ragged rows). Follow-ups: 'type inference', 'malformed input handling (unterminated quote)', 'writing CSV (the inverse — quote fields that need it)'. Signal: character-level state machine (not split) handling quoted fields/embedded delimiters/newlines/escaped quotes + streaming rows for large files + configurable dialect.",
      },
    ],
    "A CSV parser tests robust tokenization: a character-level state machine (not split()) that correctly handles quoted fields containing commas/newlines and doubled-quote escapes, plus streaming rows for large files (O(one row) memory) and a configurable dialect. split(',') breaking on quoted fields is the gotcha.",
    ["Using split(',') / split('\\n') — breaks on commas, newlines, and quotes inside quoted fields.",
     "Loading the whole file into memory instead of streaming rows for large files.",
     "Mishandling escaped quotes (\"\") or a quoted field spanning chunk/line boundaries."],
    0.5, { type: "CSV state machine", description: "Char-by-char states: START_FIELD → IN_UNQUOTED / IN_QUOTED. In quotes, comma/newline = data; \"\" = literal quote. Newline ends record only when not quoted. Streamed row-by-row across chunks.", alt: "CSV parser as a character-level state machine handling quoted fields, streamed by row." }),

  T("lld_m16_t5", 5, "Design a State Machine Framework", "design-state-machine-framework",
    ["case-study", "state", "transitions", "guards"],
    "Build a reusable finite-state-machine engine: define states, events, and transitions, then drive an object through them — replacing scattered status flags and if/else. What's the model, and how do you enforce only-legal transitions plus run side-effects?",
    "Declare a TRANSITION TABLE: (currentState, event) → nextState, optionally with a GUARD (a condition that must hold) and an ACTION (side-effect on transition, plus onEnter/onExit hooks). The engine, on fire(event), looks up the current state's transition for that event, checks the guard, runs exit/action/enter, and moves — REJECTING undefined transitions. It generalizes the State pattern into config.",
    [
      { kind: "concept", heading: "Why a framework",
        body: "Status modeled as scattered booleans/strings + if/else (isShipped, isCancelled…) leads to illegal states and tangled logic — the exact problem the State pattern solves per-object. A reusable FSM FRAMEWORK lets you DECLARE the machine (states, events, transitions) as data/config and have a generic engine enforce it — reused across orders, documents, workflows, game entities, etc. Define once, drive many objects." },
      { kind: "concept", heading: "The transition table",
        body: "The core is a TRANSITION definition: for each (current state, event/trigger), the target state. Represent it as a table/map. fire(event): look up (currentState, event) → if a transition exists, take it; if NOT, REJECT (illegal transition — the whole point is preventing invalid moves). This declarative table makes the machine's behavior explicit and inspectable (you can even visualize it)." },
      { kind: "concept", heading: "Guards and actions",
        body: "Transitions often need more than state+event: a GUARD is a boolean condition that must hold for the transition to fire (e.g. 'cancel' allowed only if not yet shipped); an ACTION is a side-effect executed during the transition (send email, charge card). Plus onEXIT (leaving a state) and onENTER (arriving) hooks. So firing an event = find transition → check guard → run onExit + action + onEnter → update state. Keep side-effects in actions/hooks, not scattered." },
      { kind: "concept", heading: "Persistence & follow-ups",
        body: "For long-lived entities, the current state is PERSISTED (a field) so the machine resumes after a restart (ties to the workflow-engine). Follow-ups: 'hierarchical/nested states (statecharts)', 'parallel regions', 'timed transitions (after 5min → expire)', 'history states', 'auto-generated diagrams from the table'. Signal: declarative transition table (state×event→state) + guards + actions/onEnter/onExit + reject-undefined-transitions + persisted current state — the State pattern generalized into a configurable engine.",
      },
    ],
    "An FSM framework generalizes the State pattern into config: a declarative transition table (state×event→nextState) with guards (conditional) and actions/onEnter/onExit (side-effects), an engine that fires events and rejects undefined transitions, and a persisted current state. It replaces scattered status flags across many object types.",
    ["Scattered boolean flags + if/else instead of a declarative transition table.",
     "Allowing undefined transitions instead of rejecting illegal moves.",
     "Side-effects scattered through calling code rather than in transition actions / onEnter/onExit hooks."],
    0.5, { type: "FSM engine", description: "Transition table: (state, event) → nextState [+ guard, action]. fire(event): look up transition → check guard → onExit + action + onEnter → set state. Undefined transition → reject. Current state persisted.", alt: "State-machine framework: a declarative transition table with guards and actions." }),

  T("lld_m16_t6", 6, "Design a Build System / Task Runner", "design-build-system",
    ["case-study", "dependency-graph", "topological-sort", "caching"],
    "Build a Make/Gradle-style tool: tasks declare dependencies on other tasks, and running a task runs its prerequisites first, in the right order, without redoing up-to-date work. What structures the ordering, and how do you skip unchanged work?",
    "Model tasks as a DAG (task → its dependencies); run them in TOPOLOGICAL ORDER (dependencies before dependents), detecting CYCLES (invalid). Skip up-to-date tasks via INCREMENTAL builds — compare input/output timestamps or content HASHES, only re-running a task if its inputs changed. Independent tasks can run in PARALLEL. It's a dependency DAG + topological execution + caching.",
    [
      { kind: "concept", heading: "Tasks as a dependency DAG",
        body: "Each task (compile, test, package) declares the tasks it DEPENDS ON. This forms a directed acyclic graph: an edge A→B means A needs B done first. Running a target task means running all its transitive prerequisites first. The DAG is the core model (same as the workflow-engine / CI pipeline), here for build steps." },
      { kind: "concept", heading: "Topological order + cycle detection",
        body: "Execute tasks in TOPOLOGICAL ORDER so every task runs only after its dependencies complete. Compute it via topological sort (DFS or Kahn's algorithm). If there's a CYCLE (A depends on B depends on A), there's no valid order — DETECT it (a failed topo-sort / back-edge) and error, rather than looping forever. This is the same dependency-ordering problem as the spreadsheet recalc." },
      { kind: "concept", heading: "Incremental builds (skip up-to-date)",
        body: "The performance crux: don't rebuild everything every time. A task is UP-TO-DATE (skippable) if its inputs haven't changed since its outputs were produced — determine this by comparing INPUT vs OUTPUT timestamps (Make's approach) or, more robustly, by HASHING inputs and caching results keyed by that hash (Gradle/Bazel — content-based, reproducible). Only re-run tasks whose inputs changed (and their dependents). This makes incremental builds fast." },
      { kind: "concept", heading: "Parallelism & follow-ups",
        body: "Tasks with no dependency between them can run in PARALLEL (the DAG tells you which) — schedule ready tasks (deps done) onto a worker pool, bounded by available cores. Follow-ups: 'remote/distributed cache (share build outputs across machines)', 'sandboxing for reproducibility', 'incremental correctness (declare all inputs/outputs or caching is wrong)', 'watch mode'. Signal: task dependency DAG + topological execution + cycle detection + incremental skip via timestamps/hashes + parallel independent tasks.",
      },
    ],
    "A build system tests dependency-DAG execution: run tasks in topological order (with cycle detection), skip up-to-date work via incremental checks (timestamps or content hashes), and parallelize independent tasks. Content-hash caching (Bazel/Gradle) is more robust than timestamps; declaring all inputs/outputs is required for correctness.",
    ["Running tasks in declaration order instead of topological order of the dependency DAG.",
     "Rebuilding everything each run instead of incremental skip (timestamps/hashes).",
     "No cycle detection (infinite loop) / not parallelizing independent tasks."],
    0.5, { type: "Build DAG", description: "Tasks form a DAG (task → dependencies). Run in topological order (cycle → error). Each task skipped if up-to-date (inputs unchanged by timestamp/hash). Independent tasks run in parallel on a worker pool.", alt: "Build system: dependency DAG run in topological order with incremental skip and parallelism." }),

  T("lld_m16_t7", 7, "Design a Maze Generator & Solver", "design-maze",
    ["case-study", "graph", "dfs-bfs", "grid"],
    "Model a maze: generate a random solvable maze on a grid, then find a path from start to exit. How do you represent walls, generate a maze with exactly one path between cells, and pick the right search to solve it?",
    "Model the grid as a GRAPH (cells = nodes, removed walls = edges). GENERATE by carving passages — e.g. randomized DFS (recursive backtracker) or randomized Kruskal/Prim over a spanning tree — which guarantees a connected, loop-free maze (exactly one path between any two cells). SOLVE with BFS (shortest path, unweighted) or DFS (any path). Walls are the absence of an edge.",
    [
      { kind: "concept", heading: "Maze as a graph",
        body: "Represent the maze as a grid where each CELL is a node, and a removed WALL between adjacent cells is an EDGE connecting them. A wall present = no edge. So 'is there a passage from A to B?' is graph connectivity. This graph framing turns both generation and solving into standard graph algorithms — the key modeling insight (don't think in pixels; think in cells + edges)." },
      { kind: "concept", heading: "Generation = build a spanning tree",
        body: "A 'perfect' maze (exactly one path between any two cells, no loops, fully connected) is a SPANNING TREE of the grid graph. Generate it by carving: RANDOMIZED DFS (recursive backtracker) — from a cell, visit a random unvisited neighbor, removing the wall between them, recurse, backtrack when stuck; or randomized PRIM/KRUSKAL. All produce a connected, acyclic maze, guaranteeing it's solvable. The randomness gives variety." },
      { kind: "concept", heading: "Solving = graph search",
        body: "To find a path start→exit, run a graph search over the cell graph: BFS finds the SHORTEST path (the maze is unweighted, so BFS by layers is optimal) and is the usual choice; DFS finds A path (not necessarily shortest) with less memory. A* with a Manhattan-distance heuristic speeds it up on large mazes. Reconstruct the path by tracking parent pointers from the search." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Mazes with loops/multiple paths' (add some extra edges — no longer a tree). 'Weighted terrain' (Dijkstra/A*). 'Huge mazes' (memory — DFS generation is iterative to avoid stack overflow). 'Render/print'. 'Guarantee solvability' (the spanning-tree generation does, by construction). Signal: grid-as-graph (cells + wall-edges) + spanning-tree generation (randomized DFS/Prim/Kruskal → always solvable) + BFS for shortest-path solving (or DFS/A*).",
      },
    ],
    "A maze tests graph modeling: cells as nodes and removed walls as edges, generation as building a spanning tree (randomized DFS/Prim/Kruskal — guarantees a connected solvable maze), and solving via BFS (shortest path, unweighted) or DFS/A*. Thinking in cells+edges rather than pixels is the key.",
    ["Modeling the maze as pixels/walls instead of a graph of cells + edges.",
     "Generating walls randomly without guaranteeing connectivity/solvability (spanning tree does).",
     "Using DFS for the solver when the shortest path is required (BFS is optimal on unweighted grids)."],
    0.5, { type: "Maze graph", description: "Grid: cells = nodes, removed wall = edge. Generate: carve a spanning tree (randomized DFS/Prim) → connected, loop-free, solvable. Solve: BFS start→exit (shortest, unweighted) via parent pointers.", alt: "Maze as a grid graph: spanning-tree generation and BFS solving." }),

  T("lld_m16_t8", 8, "Design Scrabble", "design-scrabble",
    ["case-study", "board", "validation", "scoring"],
    "Model Scrabble: players place letter tiles on a 15×15 board to form words, score them (with letter values and premium squares), and validate against a dictionary. How do you model the board/tiles, validate a move, and score it including bonuses?",
    "A 15×15 Board of Squares (some PREMIUM: double/triple letter/word); a tile Bag (letter distribution + point values); each Player has a rack. A move places tiles forming words; VALIDATE: connects to existing tiles, forms valid DICTIONARY words (all words created), in a line. SCORE: sum letter values × letter-premiums, then × word-premiums, +50 for using all 7 (bingo). Dictionary lookup wants a Trie/set.",
    [
      { kind: "concept", heading: "Board, tiles, racks",
        body: "A 15×15 BOARD of Square objects, some marked as PREMIUM (double/triple letter score, double/triple word score) — premiums apply only the first time covered. A tile BAG holds the letter distribution (lots of E/A, few Q/Z) with each letter's POINT VALUE; blanks are wildcards. Each Player has a RACK of up to 7 tiles drawn from the bag. Model these as distinct entities; the board square knows its premium type and current tile." },
      { kind: "concept", heading: "Move validation",
        body: "Placing tiles must satisfy rules: tiles form a straight LINE (one row or column), CONNECT to existing tiles on the board (except the first move, which covers the center), leave no gaps, and — crucially — every WORD formed (the main word plus any perpendicular 'cross-words' created) must be a VALID dictionary word. Validation collects all words the placement creates and checks each. Reject if any isn't a word." },
      { kind: "concept", heading: "Dictionary lookup",
        body: "Word validation needs a fast dictionary — a hash SET for exact lookup, or a TRIE (the autocomplete structure) which also helps move GENERATION / AI (finding valid words playable from a rack by walking the trie). For a human game, a set suffices; for an AI opponent, a trie/DAWG (directed acyclic word graph) is the standard high-performance choice." },
      { kind: "concept", heading: "Scoring & follow-ups",
        body: "SCORE a move: for each new word, sum its tiles' letter values, applying LETTER premiums (×2/×3 on that tile) as you go, then multiply the word total by any WORD premiums covered; sum all words formed; add a +50 BINGO bonus for playing all 7 tiles. Premiums only count on the turn the square is first covered. Then refill the rack. Follow-ups: 'AI move generation (trie)', 'challenges', 'blank tiles', 'turn/State machine, end-game scoring'. Signal: board+premium squares + tile bag/values + rack; validate line/connectivity/all-words-in-dictionary (set/trie); score letter×letter-premium then ×word-premium + bingo bonus.",
      },
    ],
    "Scrabble tests board + validation + scoring: a 15×15 board with premium squares, a tile bag with letter values, move validation (line, connectivity, every formed word in a dictionary set/trie), and scoring (letter values × letter premiums, then × word premiums, +50 bingo). A trie powers AI move generation.",
    ["Validating only the main word, not the perpendicular cross-words a placement creates.",
     "Applying premium squares on every turn instead of only when first covered.",
     "Forgetting connectivity/line rules or the +50 bingo bonus for using all 7 tiles."],
    0.5),
];

const EXERCISES = [
  // Event bus
  pm({ topicId: "lld_m16_t1", exerciseId: "lld_m16_t1_pm_1", position: 1, level: "medium", title: "The pattern",
    scenario: "An in-process event bus decoupling publishers from subscribers is fundamentally…",
    options: ["The Observer pattern with a central broker", "A Singleton database", "The Adapter pattern", "A Visitor"], correct: "The Observer pattern with a central broker",
    explanation: "A type→handlers registry mediates publish/subscribe — Observer via a broker, removing direct references." }),
  pm({ topicId: "lld_m16_t1", exerciseId: "lld_m16_t1_pm_2", position: 2, level: "hard", title: "Handler throws",
    scenario: "One subscriber's handler throws during publish. A robust bus…",
    options: ["Isolates the error (try/catch per handler) so others still run", "Stops dispatching to remaining handlers", "Crashes the publisher", "Retries forever"], correct: "Isolates the error (try/catch per handler) so others still run",
    explanation: "Wrap each handler so one failure doesn't break other subscribers or the publisher." }),
  pm({ topicId: "lld_m16_t1", exerciseId: "lld_m16_t1_pm_3", position: 3, level: "medium", title: "Classic leak",
    scenario: "What's the classic memory leak with an event bus?",
    options: ["Subscribers that never unsubscribe (handlers + captured state never freed)", "Too many event types", "Publishing too fast", "Using strings as keys"], correct: "Subscribers that never unsubscribe (handlers + captured state never freed)",
    explanation: "Forgotten subscriptions keep handlers (and what they capture) alive — manage the unsubscribe lifecycle." }),
  // Retry
  pm({ topicId: "lld_m16_t2", exerciseId: "lld_m16_t2_pm_1", position: 1, level: "hard", title: "Backoff + jitter",
    scenario: "Why add JITTER to exponential backoff?",
    options: ["To desynchronize many clients' retries and avoid retry storms", "To make retries slower overall", "It's required by HTTP", "To improve logging"], correct: "To desynchronize many clients' retries and avoid retry storms",
    explanation: "Without jitter, clients that failed together retry in synchronized waves, re-overwhelming the recovering service." }),
  pm({ topicId: "lld_m16_t2", exerciseId: "lld_m16_t2_pm_2", position: 2, level: "medium", title: "What to retry",
    scenario: "You should retry…",
    options: ["Only transient/retryable errors, up to a max attempts", "Every error forever", "Permanent errors like 400 too", "Nothing"], correct: "Only transient/retryable errors, up to a max attempts",
    explanation: "Retrying permanent errors (400/auth) is pointless and harmful; cap attempts on transient ones." }),
  pm({ topicId: "lld_m16_t2", exerciseId: "lld_m16_t2_pm_3", position: 3, level: "hard", title: "Hidden requirement",
    scenario: "What must be true of an operation you auto-retry?",
    options: ["It should be idempotent (retries may execute it more than once)", "It must be fast", "It must return void", "It must be synchronous"], correct: "It should be idempotent (retries may execute it more than once)",
    explanation: "A lost response can cause a retry of an operation that already succeeded — non-idempotent ops then duplicate effects." }),
  // Memoization
  pm({ topicId: "lld_m16_t3", exerciseId: "lld_m16_t3_pm_1", position: 1, level: "medium", title: "When valid",
    scenario: "Memoization is only correct for…",
    options: ["Pure functions (same args → same result, no side effects)", "Any function", "Functions that write to a DB", "Random functions"], correct: "Pure functions (same args → same result, no side effects)",
    explanation: "Caching an impure function returns stale/wrong results; purity guarantees the cached value stays valid." }),
  pm({ topicId: "lld_m16_t3", exerciseId: "lld_m16_t3_pm_2", position: 2, level: "medium", title: "The wrapper",
    scenario: "Adding caching around a function without changing its code uses…",
    options: ["The Decorator/Proxy pattern", "Inheritance", "A Singleton", "A Visitor"], correct: "The Decorator/Proxy pattern",
    explanation: "memoize(fn) returns a same-signature wrapper that consults a cache first — Decorator/Proxy." }),
  pm({ topicId: "lld_m16_t3", exerciseId: "lld_m16_t3_pm_3", position: 3, level: "hard", title: "Concurrent miss",
    scenario: "Two threads call the same uncached key at once. A good cache…",
    options: ["Coalesces them (compute once; the other waits and reuses)", "Computes it in both", "Returns null to one", "Locks the whole cache forever"], correct: "Coalesces them (compute once; the other waits and reuses)",
    explanation: "Store a future/placeholder so the second caller reuses the first's computation (compute-once)." }),
  // CSV parser
  pm({ topicId: "lld_m16_t4", exerciseId: "lld_m16_t4_pm_1", position: 1, level: "hard", title: "Why not split",
    scenario: "Why is line.split(',') wrong for CSV?",
    options: ["A quoted field can contain commas/newlines and \"\" escapes — splitting corrupts them", "split is too slow", "CSV has no commas", "split can't read files"], correct: "A quoted field can contain commas/newlines and \"\" escapes — splitting corrupts them",
    explanation: "A comma's meaning depends on whether you're inside quotes — naive splitting breaks quoted fields." }),
  pm({ topicId: "lld_m16_t4", exerciseId: "lld_m16_t4_pm_2", position: 2, level: "hard", title: "Correct core",
    scenario: "The robust way to parse CSV is…",
    options: ["A character-level state machine (in-field / in-quoted / quote-in-quoted)", "Two nested splits", "A regex per line", "Reading fixed-width columns"], correct: "A character-level state machine (in-field / in-quoted / quote-in-quoted)",
    explanation: "A state machine correctly treats commas/newlines inside quotes as data and handles \"\" escapes." }),
  pm({ topicId: "lld_m16_t4", exerciseId: "lld_m16_t4_pm_3", position: 3, level: "medium", title: "Huge file",
    scenario: "Parsing a multi-GB CSV should…",
    options: ["Stream rows (O(one row) memory), carrying state across chunks", "Load the whole file into memory", "Split it into many files first", "Sample 1000 rows"], correct: "Stream rows (O(one row) memory), carrying state across chunks",
    explanation: "Emit rows as they complete while reading chunks; the state machine spans chunk boundaries." }),
  // State machine framework
  pm({ topicId: "lld_m16_t5", exerciseId: "lld_m16_t5_pm_1", position: 1, level: "medium", title: "Core model",
    scenario: "An FSM framework is driven by…",
    options: ["A declarative transition table: (state, event) → nextState", "Scattered boolean flags", "A list of all possible states only", "Random transitions"], correct: "A declarative transition table: (state, event) → nextState",
    explanation: "The transition table makes legal moves explicit; the engine looks them up on each event." }),
  pm({ topicId: "lld_m16_t5", exerciseId: "lld_m16_t5_pm_2", position: 2, level: "medium", title: "Illegal move",
    scenario: "An event with no defined transition from the current state should…",
    options: ["Be rejected (illegal transition)", "Pick a random next state", "Be ignored silently and proceed", "Reset the machine"], correct: "Be rejected (illegal transition)",
    explanation: "Rejecting undefined transitions is the whole point — preventing invalid state changes." }),
  pm({ topicId: "lld_m16_t5", exerciseId: "lld_m16_t5_pm_3", position: 3, level: "hard", title: "Conditional + effects",
    scenario: "A condition that must hold to transition, plus a side-effect run on transition, are the…",
    options: ["Guard and action (+ onEnter/onExit hooks)", "State and event", "Two separate machines", "A Singleton"], correct: "Guard and action (+ onEnter/onExit hooks)",
    explanation: "Guards gate transitions; actions/onEnter/onExit run side-effects — keeping them out of calling code." }),
  // Build system
  pm({ topicId: "lld_m16_t6", exerciseId: "lld_m16_t6_pm_1", position: 1, level: "medium", title: "Ordering",
    scenario: "Tasks with dependencies are run in…",
    options: ["Topological order of the dependency DAG", "Declaration order", "Alphabetical order", "Random order"], correct: "Topological order of the dependency DAG",
    explanation: "Topological sort ensures each task runs only after its prerequisites; cycles are detected and error." }),
  pm({ topicId: "lld_m16_t6", exerciseId: "lld_m16_t6_pm_2", position: 2, level: "hard", title: "Skip work",
    scenario: "To avoid rebuilding everything each run, a task is skipped when…",
    options: ["Its inputs are unchanged (by timestamp or content hash) since its outputs", "It ran before at all", "It has no dependencies", "The user says so"], correct: "Its inputs are unchanged (by timestamp or content hash) since its outputs",
    explanation: "Incremental builds compare input/output timestamps or hash inputs to skip up-to-date tasks." }),
  pm({ topicId: "lld_m16_t6", exerciseId: "lld_m16_t6_pm_3", position: 3, level: "medium", title: "Speed",
    scenario: "Independent tasks (no dependency between them) can be…",
    options: ["Run in parallel on a worker pool", "Only run sequentially", "Skipped", "Merged into one"], correct: "Run in parallel on a worker pool",
    explanation: "The DAG reveals which tasks are independent; schedule ready ones in parallel up to core count." }),
  // Maze
  pm({ topicId: "lld_m16_t7", exerciseId: "lld_m16_t7_pm_1", position: 1, level: "medium", title: "Model it",
    scenario: "A maze is best modeled as…",
    options: ["A graph: cells = nodes, removed walls = edges", "A 2D array of pixels", "A list of wall coordinates only", "A single string"], correct: "A graph: cells = nodes, removed walls = edges",
    explanation: "Cells+edges turn generation and solving into standard graph algorithms." }),
  pm({ topicId: "lld_m16_t7", exerciseId: "lld_m16_t7_pm_2", position: 2, level: "hard", title: "Generate solvable",
    scenario: "Generating a perfect maze (one path between any cells, always solvable) means building a…",
    options: ["Spanning tree (e.g. randomized DFS/Prim/Kruskal)", "Random set of walls", "Complete graph", "Sorted grid"], correct: "Spanning tree (e.g. randomized DFS/Prim/Kruskal)",
    explanation: "A spanning tree is connected and acyclic — exactly one path between cells, guaranteed solvable." }),
  pm({ topicId: "lld_m16_t7", exerciseId: "lld_m16_t7_pm_3", position: 3, level: "medium", title: "Shortest solve",
    scenario: "To find the SHORTEST path through the (unweighted) maze, use…",
    options: ["BFS", "DFS", "Sorting", "Random walk"], correct: "BFS",
    explanation: "BFS explores by layers, giving the shortest path on an unweighted graph; DFS finds any path." }),
  // Scrabble
  pm({ topicId: "lld_m16_t8", exerciseId: "lld_m16_t8_pm_1", position: 1, level: "hard", title: "Validate words",
    scenario: "Validating a tile placement must check…",
    options: ["Every word formed — main word AND perpendicular cross-words — is in the dictionary", "Only the longest word", "Just the main word", "Only the first letter"], correct: "Every word formed — main word AND perpendicular cross-words — is in the dictionary",
    explanation: "A placement can create perpendicular cross-words; all formed words must be valid." }),
  pm({ topicId: "lld_m16_t8", exerciseId: "lld_m16_t8_pm_2", position: 2, level: "medium", title: "Premiums",
    scenario: "Double/triple-letter and word premium squares apply…",
    options: ["Only the turn the square is first covered", "Every turn forever", "Never", "Only on the last move"], correct: "Only the turn the square is first covered",
    explanation: "Premiums count once, when first covered; later words over them don't re-apply the bonus." }),
  pm({ topicId: "lld_m16_t8", exerciseId: "lld_m16_t8_pm_3", position: 3, level: "medium", title: "Fast dictionary",
    scenario: "For an AI that generates valid moves from a rack, the dictionary is best stored as…",
    options: ["A trie / DAWG (walk it to find playable words)", "An unsorted list scanned each time", "A single string", "A stack"], correct: "A trie / DAWG (walk it to find playable words)",
    explanation: "A trie/DAWG lets you efficiently enumerate valid words playable from rack letters; a set suffices for plain validation." }),
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
  console.log(`\nDone — M16 Case Studies X seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
