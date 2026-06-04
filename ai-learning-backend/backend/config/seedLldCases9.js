/**
 * Seed — LLD module M15: Case Studies IX (more OOD problems):
 * Thread Pool/Executor, ORM/Data Mapper, SQL Query Builder, Diff Tool (LCS),
 * Template Engine, Regex Matcher, Monopoly, 2048.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases9.js   ·   npm: npm run seed:lld-cases9
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m15";
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
  name: "Case Studies IX — Systems & Games", slug: "case-studies-9",
  description: "Eight more designs: a thread pool/executor, an ORM/data mapper, a SQL query builder, a diff tool, a template engine, a regex matcher, Monopoly, and 2048.",
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
  T("lld_m15_t1", 1, "Design a Thread Pool / Executor", "design-thread-pool-executor",
    ["case-study", "concurrency", "producer-consumer", "future"],
    "Build a thread pool: submit tasks and have a FIXED set of worker threads run them, returning a handle for the result. Why reuse threads, and what happens when tasks arrive faster than they finish?",
    "A bounded set of WORKER threads pull tasks from a shared BLOCKING QUEUE (Producer-Consumer); submit(task) enqueues and returns a FUTURE for the eventual result. When the queue is full, a REJECTION POLICY decides (block/caller-runs/discard). Graceful SHUTDOWN drains or interrupts workers. It composes the worker pool + blocking queue + Future.",
    [
      { kind: "concept", heading: "Why pool threads",
        body: "Creating a thread per task is expensive (stack memory, OS scheduling) and unbounded thread creation can exhaust the machine. A THREAD POOL pre-creates a fixed number of worker threads and REUSES them across many tasks — amortizing creation cost and BOUNDING concurrency (you control how many run at once). It's the Thread Pool pattern made concrete." },
      { kind: "concept", heading: "Workers + task queue",
        body: "Tasks submitted go onto a shared task QUEUE (a bounded blocking queue — the m13 design); each WORKER thread loops: take a task (blocking when none), run it, repeat. This is Producer-Consumer: submitters produce, workers consume. The queue decouples submission rate from processing rate and provides natural back-pressure." },
      { kind: "concept", heading: "Futures for results",
        body: "submit(task) can't return the result immediately (the task runs later on a worker), so it returns a FUTURE/Promise — a handle the caller can poll, block on (get()), or attach a callback to. The worker, on finishing, completes the future with the result or exception. This decouples 'when you submit' from 'when you get the result'." },
      { kind: "concept", heading: "Saturation & shutdown — follow-ups",
        body: "When the queue is full (tasks arrive faster than they complete), a REJECTION/SATURATION policy decides: block the submitter, run the task on the caller's thread (back-pressure), or discard (oldest/newest). SHUTDOWN must be graceful: stop accepting new tasks, let queued ones finish (or interrupt for shutdownNow), and join the workers. Follow-ups: 'fixed vs cached vs scheduled pools', 'sizing (CPU-bound ≈ #cores; IO-bound higher)', 'handling task exceptions so a worker doesn't die'. Signal: fixed workers + blocking task queue (Producer-Consumer) + Future results + rejection policy on saturation + graceful shutdown.",
      },
    ],
    "A thread pool composes a fixed worker set pulling from a bounded blocking queue (Producer-Consumer), submit() returning a Future, a rejection policy on saturation, and graceful shutdown. It reuses threads to bound concurrency and amortize cost; pool sizing and per-task exception handling are the craft.",
    ["Creating a new thread per task (unbounded — exhausts the machine) instead of reusing a fixed pool.",
     "No rejection/saturation policy when the queue fills (silent unbounded growth or dropped tasks).",
     "A worker thread dying on an unhandled task exception; no graceful shutdown."],
    0.6, { type: "Executor", description: "submit(task) → enqueue on bounded blocking queue + return Future. Fixed worker threads loop: take → run → complete the Future. Queue full → rejection policy. Shutdown drains/interrupts workers.", alt: "Thread pool: submit returns a Future; fixed workers pull tasks from a bounded blocking queue." }),

  T("lld_m15_t2", 2, "Design an ORM / Data Mapper", "design-orm-data-mapper",
    ["case-study", "data-mapper", "identity-map", "unit-of-work"],
    "Build an ORM: map domain objects to database rows so code works with objects, not SQL. Two classic problems: loading the same row twice gives two different objects, and you want to batch all changes into one transaction. What patterns solve these?",
    "A DATA MAPPER moves data between objects and rows (keeping the domain DB-ignorant). An IDENTITY MAP caches loaded objects by id so the same row → the same object instance (no duplicates/inconsistency). A UNIT OF WORK tracks new/dirty/removed objects and flushes them in one transaction. LAZY LOADING defers related-object fetches. These are the core ORM patterns.",
    [
      { kind: "concept", heading: "Data Mapper: objects ↔ rows",
        body: "The DATA MAPPER pattern moves data between the database and in-memory domain objects while keeping them INDEPENDENT — the domain class knows nothing about SQL or the DB, and the mapper handles toRow/fromRow translation and CRUD. (Contrast Active Record, where the object holds its own persistence methods.) This separation keeps domain logic testable and DB-agnostic." },
      { kind: "concept", heading: "Identity Map: one object per row",
        body: "If you load user #5 twice, naively you get TWO separate User objects — edits to one don't reflect in the other, and equality breaks. An IDENTITY MAP is a per-session cache keyed by (type, id): on load, check the map first; if present, return the SAME instance; else load and store it. This guarantees one in-memory object per database row (consistency) and avoids redundant queries." },
      { kind: "concept", heading: "Unit of Work: batch the transaction",
        body: "You don't want a DB write on every object mutation. A UNIT OF WORK tracks objects that are NEW (insert), DIRTY (update), and REMOVED (delete) during a business transaction, then on commit() FLUSHES them all in the correct order inside ONE database transaction. This batches writes, minimizes round-trips, and gives atomicity. It also orders operations to respect foreign keys." },
      { kind: "concept", heading: "Lazy loading & follow-ups",
        body: "Loading an object shouldn't eagerly pull its entire object graph. LAZY LOADING defers a related object/collection until it's actually accessed (via a proxy/placeholder that fetches on first use). Beware the N+1 query problem (lazy-loading in a loop) — solve with eager fetch/joins/batching. Follow-ups: 'mapping inheritance', 'optimistic locking (version column)', 'caching', 'migrations'. Signal: Data Mapper (DB-ignorant domain) + Identity Map (one object per row) + Unit of Work (batched transactional flush) + lazy loading (mind N+1).",
      },
    ],
    "An ORM tests the core persistence patterns: Data Mapper (domain stays DB-ignorant), Identity Map (one in-memory object per row — consistency), Unit of Work (track new/dirty/removed, flush in one transaction), and lazy loading (with the N+1 caveat). Active Record vs Data Mapper is the framing choice.",
    ["No Identity Map — loading a row twice yields divergent objects.",
     "Writing to the DB on every mutation instead of a Unit of Work batching one transaction.",
     "Eager-loading the whole object graph, or lazy-loading in a loop (N+1 queries)."],
    0.6, { type: "ORM patterns", description: "Domain object ⇄ Data Mapper ⇄ rows. Identity Map caches by id (same row → same object). Unit of Work tracks new/dirty/removed → flush in one transaction. Relations lazy-loaded via proxies.", alt: "ORM: Data Mapper with an Identity Map and a Unit of Work batching a single transaction." }),

  T("lld_m15_t3", 3, "Design a SQL Query Builder", "design-sql-query-builder",
    ["case-study", "builder", "fluent-api", "composition"],
    "Build a fluent query builder: query().select('name').from('users').where('age', '>', 18).orderBy('name').limit(10) → safe parameterized SQL. What pattern fits the chained API, and how do you avoid SQL injection?",
    "The BUILDER pattern with a FLUENT (method-chaining) interface: each method (select/from/where/join/orderBy/limit) accumulates clause state and returns `this` for chaining; build()/toSQL() assembles the final string. Crucially, values become PARAMETERIZED placeholders (?), collected separately — never string-concatenated — to prevent SQL injection. It's Builder for incremental, validated construction.",
    [
      { kind: "concept", heading: "Builder + fluent interface",
        body: "Constructing a query has many optional parts (where, joins, group by, order, limit). The BUILDER pattern fits: a QueryBuilder accumulates the pieces. A FLUENT interface — each method returns `this` — enables readable chaining: select(...).from(...).where(...). Internally each call appends to clause collections (selects[], wheres[], joins[]…); the object holds partial state until built." },
      { kind: "concept", heading: "Assembling SQL in the right order",
        body: "build()/toSQL() composes the clauses in correct SQL order (SELECT … FROM … JOIN … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT), regardless of the order methods were called. The builder validates (e.g. a query needs a FROM) and can produce dialect-specific SQL (a Strategy per database for LIMIT vs TOP, quoting). Keeping assembly separate from accumulation is what makes the API flexible." },
      { kind: "concept", heading: "Parameterization (no injection)",
        body: "The critical correctness/security point: VALUES must NEVER be concatenated into the SQL string (where('name','=', userInput) → \"...name = '\"+input+\"'\" is an injection hole). Instead emit a PLACEHOLDER (? or $1) in the SQL and collect the actual value into a separate PARAMETERS list passed to the driver, which binds them safely. The builder returns { sql, params }. Identifiers (table/column names) are validated/quoted, not parameterized." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Subqueries / nested builders' (a where value that is itself a builder). 'Composing/reusing partial queries' (clone the builder — immutability helps). 'Joins with conditions', 'aggregate functions', 'returning typed results' (ties to the ORM). 'Preventing accidental full-table updates' (require a where on UPDATE/DELETE). Signal: Builder + fluent chaining (return this) + ordered clause assembly in build() + parameterized values (no concatenation → no SQL injection) + validated/quoted identifiers.",
      },
    ],
    "A query builder is the Builder pattern with a fluent (return-this) interface: methods accumulate clause state, build() assembles SQL in the correct order, and — critically — values become parameterized placeholders with a separate params list (never concatenated) to prevent SQL injection. Dialect handling is a Strategy.",
    ["Concatenating user values into the SQL string (SQL injection) instead of parameterized placeholders.",
     "Assembling clauses in call order rather than correct SQL order in build().",
     "Parameterizing identifiers (table/column names) instead of validating/quoting them."],
    0.5, { type: "Query builder", description: "select().from().where().orderBy().limit() — each appends clause state, returns this (fluent). build() assembles SQL in correct order, emitting ? placeholders + a separate params list (no concatenation → no injection).", alt: "Fluent SQL query builder accumulating clauses, assembling parameterized SQL safely." }),

  T("lld_m15_t4", 4, "Design a Diff Tool", "design-diff-tool",
    ["case-study", "lcs", "dynamic-programming", "algorithm"],
    "Build a tool that compares two versions of a text file and outputs the minimal set of line insertions/deletions to turn one into the other (like git diff). What's the underlying algorithm, and how do you turn it into a diff?",
    "Find the LONGEST COMMON SUBSEQUENCE (LCS) of the two line sequences — the lines that stayed the same — then everything NOT in the LCS is a deletion (in old, not common) or insertion (in new, not common). LCS is a classic dynamic-programming problem; backtracking the DP table yields the diff. (Real tools use Myers' diff, an optimization.)",
    [
      { kind: "concept", heading: "Diff = what stayed the same",
        body: "Treat each file as a SEQUENCE OF LINES. The key insight: the minimal edit between them is defined by the lines they SHARE in order — the LONGEST COMMON SUBSEQUENCE. Lines in the old file but not in the LCS were DELETED; lines in the new file but not in the LCS were INSERTED; LCS lines are UNCHANGED. So computing the LCS gives you the diff directly." },
      { kind: "concept", heading: "LCS via dynamic programming",
        body: "LCS is a textbook DP: build a table dp[i][j] = LCS length of old[0..i] and new[0..j]; if lines match, dp[i][j] = dp[i-1][j-1] + 1, else max(dp[i-1][j], dp[i][j-1]). O(n·m) time/space. Then BACKTRACK from dp[n][m]: a match → unchanged line (move diagonally); otherwise move in the direction of the larger neighbor, emitting a delete or insert. This reconstructs the edit script." },
      { kind: "concept", heading: "Producing readable output",
        body: "From the backtrack, emit a sequence of operations: ' line' (unchanged), '-line' (deleted), '+line' (added). Group consecutive changes into HUNKS with context lines (the @@ -a,b +c,d @@ format git shows) so the diff is readable. Often lines are HASHED for fast equality comparison rather than comparing strings repeatedly." },
      { kind: "concept", heading: "Myers & follow-ups",
        body: "Real diff tools use MYERS' algorithm — it finds the shortest edit script in O((n+m)·D) where D is the edit distance (much faster when files are similar, the common case) by searching the edit graph rather than filling the full LCS table. Follow-ups: 'word/char-level diff', 'three-way merge', 'huge files', 'minimal vs human-friendly diffs'. Signal: model files as line sequences → LCS (DP) identifies unchanged lines → non-LCS lines are inserts/deletes → backtrack to an edit script → hunks; Myers optimizes it.",
      },
    ],
    "A diff tool tests the LCS insight: the longest common subsequence of lines is what's unchanged, so non-LCS lines are inserts/deletes; compute LCS via DP and backtrack to an edit script, grouped into hunks. Myers' algorithm is the production-grade optimization (shortest edit script).",
    ["Comparing files line-by-line positionally instead of finding the longest common subsequence.",
     "Computing the LCS length but not backtracking to reconstruct the actual edit script.",
     "Not knowing real tools use Myers' diff (O((n+m)·D)) over the O(n·m) full DP table."],
    0.6),

  T("lld_m15_t5", 5, "Design a Template Engine", "design-template-engine",
    ["case-study", "parsing", "interpreter", "ast"],
    "Build a template engine: render 'Hello {{name}}, you have {{count}} messages' (plus loops and conditionals) against a data context. How do you avoid re-parsing on every render, and what represents the parsed template?",
    "PARSE the template ONCE into an AST of nodes (Text, Variable {{x}}, If, For), then RENDER the AST against a data context (the Interpreter pattern — each node renders itself). Parse-once/render-many caches the compiled template. Variables resolve from the context; output is escaped by default (prevent XSS). Loops/conditionals are control-flow nodes.",
    [
      { kind: "concept", heading: "Parse once into an AST",
        body: "Don't re-scan the template string on every render. PARSE it ONCE into an Abstract Syntax Tree of nodes: TextNode (literal chunks), VariableNode ({{name}}), and control nodes (IfNode, ForNode with children). Tokenize the template (split literal text from {{…}}/{%…%} tags), then build the tree (control tags nest children — recursive, like the JSON/expression parsers). The compiled AST is cached and reused." },
      { kind: "concept", heading: "Render = Interpreter over the AST",
        body: "RENDER walks the AST against a DATA CONTEXT (a map of variables): a TextNode emits its literal; a VariableNode looks up its key in the context and emits the value; an IfNode evaluates its condition and renders its branch; a ForNode iterates a collection, rendering its children per item (with the loop variable added to a child scope). Each node knows how to render itself — the Interpreter pattern. Output is concatenated." },
      { kind: "concept", heading: "Context, scoping & escaping",
        body: "Variable resolution looks up dotted paths (user.name) in the context; nested scopes (loop variables, block locals) layer over the parent context. SECURITY: by DEFAULT, ESCAPE interpolated values (HTML-escape) to prevent XSS from user data — provide an explicit 'raw/safe' opt-out. Missing variables resolve to empty/error per policy." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Filters/helpers' ({{ name | upper }} — a pipeline/Strategy of transforms). 'Partials/includes & inheritance' (compose templates). 'Custom tags'. 'Compile to a function' (for speed, generate code instead of tree-walking — what fast engines do). 'Sandboxing' (don't let templates run arbitrary code). Signal: parse-once into an AST (Text/Variable/If/For) + Interpreter render against a scoped context + default output escaping (XSS) + caching the compiled template.",
      },
    ],
    "A template engine tests parse-once/render-many: tokenize + parse into an AST (Text/Variable/If/For), then Interpreter-render against a scoped data context, with default output escaping for XSS safety and the compiled template cached. Filters, partials, and compile-to-function are the follow-ups.",
    ["Re-parsing the template string on every render instead of caching a compiled AST.",
     "Not escaping interpolated values by default (XSS hole).",
     "A flat string-replace approach that can't handle nested loops/conditionals (needs an AST)."],
    0.5, { type: "Template pipeline", description: "Template string → parse ONCE → AST (Text / Variable {{x}} / If / For nodes). Render: Interpreter walks AST against a scoped context; variables escaped by default. Compiled AST cached for reuse.", alt: "Template engine: parse once into an AST, then Interpreter-render against a data context." }),

  T("lld_m15_t6", 6, "Design a Regular Expression Matcher", "design-regex-matcher",
    ["case-study", "automaton", "nfa", "state-machine"],
    "Build a regex matcher supporting literals, '.', '*', and grouping — deciding if a pattern matches a string. The naive backtracking approach can blow up exponentially. What's the robust model, and the performance trap?",
    "Compile the pattern into a FINITE AUTOMATON: parse to an AST, build an NFA (Thompson's construction — states + epsilon transitions for *, |, concatenation), then match by simulating the NFA (tracking the SET of possible states as you consume characters) in O(n·m). Naive backtracking is simpler but can be EXPONENTIAL (catastrophic backtracking) on adversarial inputs.",
    [
      { kind: "concept", heading: "Two approaches",
        body: "(1) BACKTRACKING (recursive): try to match the pattern against the string, recursing/backtracking on '*' and alternation. Simple and what many language regex libs use — but it can be EXPONENTIAL on patterns like (a*)*b against 'aaaa…' (catastrophic backtracking — a real DoS vector, ReDoS). (2) AUTOMATON-based (Thompson NFA): compile to a state machine and simulate it — guaranteed LINEAR time. The automaton approach is the robust answer." },
      { kind: "concept", heading: "Parse then build an NFA",
        body: "First PARSE the regex into an AST (concatenation, alternation |, repetition *, groups — recursive descent, like the expression parser, respecting precedence). Then THOMPSON'S CONSTRUCTION builds an NFA from the AST: each construct maps to a small sub-automaton with states and transitions, including EPSILON (empty) transitions to express choice (|), repetition (*), and skips. The NFA has at most O(m) states for a pattern of length m." },
      { kind: "concept", heading: "Simulating the NFA",
        body: "An NFA can be in MULTIPLE states at once. To match: start in the start state's epsilon-closure (all states reachable via empty moves), then for each input character, compute the next set of states (transitions on that char, then epsilon-closure). The string matches if, after consuming it, the state set includes an ACCEPT state. Tracking a SET of states (not backtracking) gives O(n·m) — linear in the string length. (DFA conversion makes it O(n) but risks state explosion.)" },
      { kind: "concept", heading: "Follow-ups",
        body: "'Add +, ?, character classes, anchors' (more AST node types / NFA gadgets). 'Capture groups' (harder with pure NFA simulation — needs tagged automata or a hybrid). 'NFA → DFA' (faster matching, possible exponential state blowup — trade memory). 'Avoid ReDoS' (use the automaton engine, like RE2, for untrusted patterns). Signal: parse to AST → Thompson NFA (epsilon transitions for */|) → simulate tracking a state set (linear) — vs simple-but-exponential backtracking.",
      },
    ],
    "A regex matcher tests automata: parse the pattern to an AST, build an NFA (Thompson's construction with epsilon transitions for */|), and simulate it by tracking the set of active states for linear-time matching — versus the simpler backtracking approach that can blow up exponentially (catastrophic backtracking / ReDoS).",
    ["Only the backtracking approach, unaware of its exponential/catastrophic-backtracking (ReDoS) risk.",
     "Not modelling repetition/alternation as NFA states with epsilon transitions.",
     "Backtracking the NFA instead of tracking a set of states (losing the linear-time guarantee)."],
    0.6, { type: "Regex automaton", description: "Pattern → parse to AST (concat / | / *) → Thompson NFA (states + epsilon transitions). Match: track the SET of active states, advancing on each char (epsilon-closure). Accept-state reached ⇒ match. O(n·m), linear in input.", alt: "Regex compiled to an NFA, matched by simulating the set of active states (linear time)." }),

  T("lld_m15_t7", 7, "Design Monopoly", "design-monopoly",
    ["case-study", "state", "strategy", "composition"],
    "Model the Monopoly board game: players move around a board of squares by dice rolls, and each square does something different (buy property, pay rent, draw a card, go to jail, tax). How do you model the varied squares and a player's turn cleanly?",
    "A circular Board of Square objects, each a POLYMORPHIC type (Property, Tax, Chance, GoToJail, FreeParking…) with a landedOn(player) behavior — so the turn logic doesn't branch on square type. A Player has money, position, and owned properties; a turn is roll → move → square.landedOn(). Game state + jail/bankruptcy are State machines. Composition + polymorphism over a switch.",
    [
      { kind: "concept", heading: "Board of polymorphic squares",
        body: "The board is a circular sequence of ~40 Squares. The key design choice: each square TYPE is a polymorphic class — Property, RailRoad, Utility, Tax, Chance/CommunityChest, GoToJail, Jail, FreeParking, Go — each implementing a common interface, e.g. onLandedOn(player, game). When a player lands, you call square.onLandedOn(...) and the square does its thing. This avoids a giant switch on square type in the turn logic (Open–Closed — add a square type without touching the engine)." },
      { kind: "concept", heading: "Player and a turn",
        body: "A Player has money, current position, owned properties, jail status. A TURN: roll two dice → advance position (wrapping around the board, collecting $200 passing Go) → invoke the landed square's behavior (buy/auction a property, pay rent to its owner, draw a card, go to jail). Doubles grant another roll (three doubles → jail). Keep the turn flow generic, delegating specifics to the square." },
      { kind: "concept", heading: "Properties, rent & cards",
        body: "A Property tracks owner, price, rent schedule (rent rises with houses/hotels and monopolies of a color group). Landing on an owned property → pay rent (a rent Strategy by development level). Chance/Community cards are a deck (the deck-of-cards design) of Command-like actions (move, pay, collect). Money transfers must handle insufficient funds → mortgaging/selling, then bankruptcy." },
      { kind: "concept", heading: "Game flow & follow-ups",
        body: "Game and sub-states are State machines: a player can be ACTIVE / IN_JAIL / BANKRUPT; the game ends when one player remains. Jail has its own rules (roll doubles / pay / card to leave). Follow-ups: 'auctions', 'trading between players', 'AI players' (Strategy), 'house/hotel building limits'. Signal: circular board of polymorphic Square types (onLandedOn — no type switch) + Player composition + dice-driven turn delegating to squares + rent Strategy + card deck + jail/bankruptcy State machines.",
      },
    ],
    "Monopoly tests polymorphism over branching: a board of polymorphic Square types each handling onLandedOn (no giant type switch — Open–Closed), Player composition, a dice-driven turn that delegates to the landed square, a rent Strategy, a card deck, and jail/bankruptcy State machines.",
    ["A giant switch on square type in the turn loop instead of polymorphic squares (onLandedOn).",
     "Hardcoding rent instead of a Strategy that accounts for houses/monopolies.",
     "Not modelling jail/bankruptcy as states with their own rules."],
    0.5, { type: "Turn flow", description: "Turn: roll dice → move (wrap board, +$200 past Go) → square.onLandedOn(player): Property→buy/pay-rent, Tax→pay, Chance→draw card, GoToJail→jail. Player ACTIVE/IN_JAIL/BANKRUPT states. Polymorphic squares, no type switch.", alt: "Monopoly turn delegating to polymorphic square behaviors, with player state machine." }),

  T("lld_m15_t8", 8, "Design the 2048 Game", "design-2048",
    ["case-study", "grid", "merge", "state"],
    "Model the 2048 game: a 4×4 grid of number tiles; a swipe slides all tiles one direction, merging equal adjacent tiles (2+2→4), then a new tile spawns. The merge rule has a subtle bug. How do you implement a move correctly?",
    "A move in a direction: for each row/column, COMPACT (slide tiles to remove gaps), then MERGE equal adjacent pairs ONCE (a tile that merged can't merge again this move), then compact again. Implement one direction (e.g. left) and reuse it by rotating/reflecting the grid for the others. If anything moved, spawn a random new tile (2 or 4) on an empty cell. State: playing / won (2048) / over.",
    [
      { kind: "concept", heading: "Grid and a move",
        body: "A 4×4 grid of tile values (0 = empty). A swipe (left/right/up/down) processes each line (row or column) in the swipe direction: tiles SLIDE toward that edge, and equal adjacent tiles MERGE into their sum. After processing, if the board changed, a new tile (90% '2', 10% '4') spawns on a random EMPTY cell. The whole game is these line operations + spawn." },
      { kind: "concept", heading: "The merge rule (the subtle bug)",
        body: "Process a line in three steps: (1) COMPACT — remove gaps, sliding tiles toward the edge; (2) MERGE — scan adjacent pairs; equal pairs combine into one doubled tile; (3) COMPACT again (merging created a gap). The SUBTLE BUG: a tile that JUST merged must NOT merge again in the same move — [2,2,4] left → [4,4], NOT [8]; and [4,4,4] → [8,4] (only the first pair merges). Track which tiles already merged this move (or process left-to-right consuming pairs) to get this right." },
      { kind: "concept", heading: "One direction, reuse for the rest",
        body: "Don't write four near-duplicate move functions. Implement ONE (e.g. move-left on a row), then transform the grid so the others reduce to it: move-right = reverse each row, move-left, reverse back; move-up/down = transpose, move-left/right, transpose back. This keeps the tricky merge logic in one place — DRY and far less error-prone." },
      { kind: "concept", heading: "State, scoring & follow-ups",
        body: "Game State: PLAYING → WON (a 2048 tile appears — optionally keep going) → GAME_OVER (no empty cells AND no possible merges in any direction — must check both!). Score increases by merged tile values. A move that changes NOTHING shouldn't spawn a tile or count. Follow-ups: 'undo', 'larger boards / different targets', 'AI (expectimax)', 'animations'. Signal: per-line compact→merge-once→compact + spawn-on-change + implement-one-direction-and-rotate + state machine + correct game-over (no moves possible).",
      },
    ],
    "2048 tests careful grid mechanics: per-line compact→merge-once→compact (the 'a merged tile can't merge again' rule is the classic bug), implement one direction and rotate/reflect for the rest (DRY), spawn only when the board changed, and a game-over check that no move is possible. Score on merges.",
    ["Merging a tile twice in one move ([2,2,4] → [8] instead of [4,4]) — the classic bug.",
     "Four duplicated move functions instead of one direction + grid rotation/reflection.",
     "Declaring game over on a full board without checking whether any merge is still possible (or spawning a tile after a no-op move)."],
    0.5, { type: "2048 move", description: "Move(dir): per line → compact (slide) → merge equal adjacent pairs ONCE → compact again. If board changed → spawn a 2/4 on a random empty cell. Implement left; rotate/reflect for other dirs. Over = no empty + no merges.", alt: "2048 move: compact, merge-once, compact per line, then spawn a new tile if the board changed." }),
];

const EXERCISES = [
  // Thread pool
  pm({ topicId: "lld_m15_t1", exerciseId: "lld_m15_t1_pm_1", position: 1, level: "medium", title: "Why pool",
    scenario: "Why use a fixed thread pool instead of a new thread per task?",
    options: ["Reuse amortizes creation cost and bounds concurrency", "Threads can't be reused", "It's required by the JVM", "To use more memory"], correct: "Reuse amortizes creation cost and bounds concurrency",
    explanation: "A fixed pool reuses workers (cheap) and caps how many tasks run at once (bounded resource use)." }),
  pm({ topicId: "lld_m15_t1", exerciseId: "lld_m15_t1_pm_2", position: 2, level: "medium", title: "Get the result",
    scenario: "submit(task) returns immediately. How does the caller get the eventual result?",
    options: ["A Future/Promise it can poll, block on, or attach a callback to", "The result directly (blocking the submit)", "By polling the queue", "It can't"], correct: "A Future/Promise it can poll, block on, or attach a callback to",
    explanation: "A Future decouples submission from completion; the worker completes it with the result/exception." }),
  pm({ topicId: "lld_m15_t1", exerciseId: "lld_m15_t1_pm_3", position: 3, level: "hard", title: "Queue full",
    scenario: "Tasks arrive faster than they finish and the queue is full. A good pool…",
    options: ["Applies a rejection policy (block / caller-runs / discard)", "Creates unlimited new threads", "Silently drops all tasks", "Crashes"], correct: "Applies a rejection policy (block / caller-runs / discard)",
    explanation: "A saturation/rejection policy provides back-pressure; unbounded thread/queue growth defeats the pool." }),
  // ORM
  pm({ topicId: "lld_m15_t2", exerciseId: "lld_m15_t2_pm_1", position: 1, level: "hard", title: "Same row twice",
    scenario: "Loading user #5 twice should return the same object instance. This is ensured by…",
    options: ["An Identity Map (cache by type+id)", "Loading it fresh each time", "A Singleton User", "A static variable"], correct: "An Identity Map (cache by type+id)",
    explanation: "An Identity Map returns the same in-memory object per row, avoiding divergent duplicates." }),
  pm({ topicId: "lld_m15_t2", exerciseId: "lld_m15_t2_pm_2", position: 2, level: "hard", title: "Batch writes",
    scenario: "Tracking new/dirty/removed objects and flushing them in one transaction is the…",
    options: ["Unit of Work pattern", "Identity Map", "Active Record", "Lazy loading"], correct: "Unit of Work pattern",
    explanation: "A Unit of Work batches all changes into one ordered, atomic transaction at commit." }),
  pm({ topicId: "lld_m15_t2", exerciseId: "lld_m15_t2_pm_3", position: 3, level: "medium", title: "Lazy loading trap",
    scenario: "Lazy-loading a related object inside a loop causes…",
    options: ["The N+1 query problem", "A deadlock", "A memory leak always", "Faster queries"], correct: "The N+1 query problem",
    explanation: "One query per loop iteration (N+1) — fix with eager fetch/joins/batching." }),
  // Query builder
  pm({ topicId: "lld_m15_t3", exerciseId: "lld_m15_t3_pm_1", position: 1, level: "medium", title: "The pattern",
    scenario: "select().from().where() chaining is enabled by…",
    options: ["The Builder pattern with a fluent interface (each method returns this)", "A Singleton", "A Visitor", "Inheritance"], correct: "The Builder pattern with a fluent interface (each method returns this)",
    explanation: "A Builder accumulates clause state; returning `this` enables fluent chaining." }),
  pm({ topicId: "lld_m15_t3", exerciseId: "lld_m15_t3_pm_2", position: 2, level: "hard", title: "Stop injection",
    scenario: "How does the builder prevent SQL injection from where('name','=', userInput)?",
    options: ["Emit a ? placeholder and pass the value in a separate params list", "Escape quotes in the input", "Validate the input is alphanumeric", "Concatenate carefully"], correct: "Emit a ? placeholder and pass the value in a separate params list",
    explanation: "Parameterized placeholders bound by the driver — never concatenating values — prevent injection." }),
  pm({ topicId: "lld_m15_t3", exerciseId: "lld_m15_t3_pm_3", position: 3, level: "medium", title: "Assembly order",
    scenario: "Clauses should be assembled in build() in…",
    options: ["Correct SQL order (SELECT…FROM…WHERE…ORDER BY…), regardless of call order", "The order methods were called", "Alphabetical order", "Reverse order"], correct: "Correct SQL order (SELECT…FROM…WHERE…ORDER BY…), regardless of call order",
    explanation: "build() composes clauses in valid SQL order independent of how the fluent methods were chained." }),
  // Diff
  pm({ topicId: "lld_m15_t4", exerciseId: "lld_m15_t4_pm_1", position: 1, level: "hard", title: "Core algorithm",
    scenario: "The minimal line diff between two files is derived from their…",
    options: ["Longest Common Subsequence (LCS) of lines", "Sorted line lists", "Character counts", "Hash of each file"], correct: "Longest Common Subsequence (LCS) of lines",
    explanation: "LCS lines are unchanged; lines not in the LCS are deletions (old) or insertions (new)." }),
  pm({ topicId: "lld_m15_t4", exerciseId: "lld_m15_t4_pm_2", position: 2, level: "medium", title: "From LCS to diff",
    scenario: "After computing the LCS DP table, you get the actual edit script by…",
    options: ["Backtracking through the table", "Sorting the result", "Re-running it forward", "Hashing the table"], correct: "Backtracking through the table",
    explanation: "Backtracking from dp[n][m] emits unchanged/delete/insert ops — the edit script." }),
  pm({ topicId: "lld_m15_t4", exerciseId: "lld_m15_t4_pm_3", position: 3, level: "medium", title: "Real tools",
    scenario: "Production diff tools (git) typically use…",
    options: ["Myers' algorithm — O((n+m)·D), fast when files are similar", "The full O(n·m) LCS table always", "Random sampling", "A regex"], correct: "Myers' algorithm — O((n+m)·D), fast when files are similar",
    explanation: "Myers finds the shortest edit script efficiently by searching the edit graph (D = edit distance)." }),
  // Template engine
  pm({ topicId: "lld_m15_t5", exerciseId: "lld_m15_t5_pm_1", position: 1, level: "hard", title: "Parse once",
    scenario: "To render the same template many times efficiently, you should…",
    options: ["Parse once into a cached AST, then render the AST per request", "Re-scan the template string every render", "Use string replace each time", "Recompile on every variable"], correct: "Parse once into a cached AST, then render the AST per request",
    explanation: "Parse-once/render-many: compile to an AST and cache it; rendering walks the tree against the context." }),
  pm({ topicId: "lld_m15_t5", exerciseId: "lld_m15_t5_pm_2", position: 2, level: "medium", title: "Render model",
    scenario: "Each node (Text/Variable/If/For) rendering itself against the context is the…",
    options: ["Interpreter pattern over the AST", "Observer pattern", "Singleton", "Adapter"], correct: "Interpreter pattern over the AST",
    explanation: "Interpreter: each AST node knows how to render itself, recursing for control nodes." }),
  pm({ topicId: "lld_m15_t5", exerciseId: "lld_m15_t5_pm_3", position: 3, level: "hard", title: "Safety",
    scenario: "Interpolated user values should, by default, be…",
    options: ["HTML-escaped (to prevent XSS), with an explicit raw opt-out", "Rendered raw", "Stripped entirely", "Uppercased"], correct: "HTML-escaped (to prevent XSS), with an explicit raw opt-out",
    explanation: "Default escaping prevents XSS from user data; a 'safe/raw' marker is the explicit exception." }),
  // Regex
  pm({ topicId: "lld_m15_t6", exerciseId: "lld_m15_t6_pm_1", position: 1, level: "hard", title: "Robust model",
    scenario: "The robust, linear-time way to match a regex is to…",
    options: ["Compile to an NFA and simulate it (track a set of states)", "Recursive backtracking only", "Sort the pattern", "Hash the string"], correct: "Compile to an NFA and simulate it (track a set of states)",
    explanation: "An NFA simulation (Thompson) runs in O(n·m); backtracking can blow up exponentially." }),
  pm({ topicId: "lld_m15_t6", exerciseId: "lld_m15_t6_pm_2", position: 2, level: "hard", title: "The trap",
    scenario: "The danger of the naive backtracking approach is…",
    options: ["Catastrophic backtracking — exponential time (ReDoS)", "It's too accurate", "It uses no memory", "It only matches prefixes"], correct: "Catastrophic backtracking — exponential time (ReDoS)",
    explanation: "Patterns like (a*)*b can take exponential time on some inputs — a real denial-of-service vector." }),
  pm({ topicId: "lld_m15_t6", exerciseId: "lld_m15_t6_pm_3", position: 3, level: "medium", title: "Building the NFA",
    scenario: "Repetition (*) and alternation (|) are expressed in the NFA via…",
    options: ["Epsilon (empty) transitions (Thompson's construction)", "Extra characters", "Sorting states", "A hash map"], correct: "Epsilon (empty) transitions (Thompson's construction)",
    explanation: "Thompson's construction wires */| using epsilon transitions between sub-automata." }),
  // Monopoly
  pm({ topicId: "lld_m15_t7", exerciseId: "lld_m15_t7_pm_1", position: 1, level: "hard", title: "Varied squares",
    scenario: "Squares do very different things on landing. The clean design is…",
    options: ["Polymorphic Square types with onLandedOn() (no type switch)", "A giant switch on square type in the turn loop", "A flag per square", "One Square class with if-chains"], correct: "Polymorphic Square types with onLandedOn() (no type switch)",
    explanation: "Each square type implements onLandedOn; the turn delegates to it — Open–Closed, no central switch." }),
  pm({ topicId: "lld_m15_t7", exerciseId: "lld_m15_t7_pm_2", position: 2, level: "medium", title: "Rent",
    scenario: "Rent that rises with houses/hotels and color-group monopolies is modelled as…",
    options: ["A rent Strategy by development level", "A constant", "A random amount", "Hardcoded per square"], correct: "A rent Strategy by development level",
    explanation: "A rent Strategy computes rent from the property's development and ownership — swappable and testable." }),
  pm({ topicId: "lld_m15_t7", exerciseId: "lld_m15_t7_pm_3", position: 3, level: "medium", title: "Player states",
    scenario: "A player being in jail or bankrupt is best modelled as…",
    options: ["State (ACTIVE/IN_JAIL/BANKRUPT) with state-specific rules", "Two booleans", "Separate player classes", "Ignored"], correct: "State (ACTIVE/IN_JAIL/BANKRUPT) with state-specific rules",
    explanation: "A State machine captures jail/bankruptcy rules cleanly (e.g. jail-exit conditions)." }),
  // 2048
  pm({ topicId: "lld_m15_t8", exerciseId: "lld_m15_t8_pm_1", position: 1, level: "hard", title: "The merge bug",
    scenario: "Swiping left on [2,2,4] should produce…",
    options: ["[4,4] — a just-merged tile can't merge again this move", "[8] — merge everything equal", "[2,2,4] unchanged", "[4,2,2]"], correct: "[4,4] — a just-merged tile can't merge again this move",
    explanation: "Only one merge per tile per move: 2+2→4, the existing 4 stays separate ([4,4]), not 8." }),
  pm({ topicId: "lld_m15_t8", exerciseId: "lld_m15_t8_pm_2", position: 2, level: "medium", title: "DRY moves",
    scenario: "To implement all four directions without duplicating merge logic…",
    options: ["Implement one direction, rotate/reflect the grid for the others", "Write four separate functions", "Use random directions", "Only support left"], correct: "Implement one direction, rotate/reflect the grid for the others",
    explanation: "Transform the grid (reverse/transpose) so every move reduces to the single implemented direction." }),
  pm({ topicId: "lld_m15_t8", exerciseId: "lld_m15_t8_pm_3", position: 3, level: "medium", title: "Game over",
    scenario: "The game is over when…",
    options: ["No empty cells AND no adjacent equal tiles (no move possible)", "The board is full (any full board)", "A 2048 tile appears", "After 100 moves"], correct: "No empty cells AND no adjacent equal tiles (no move possible)",
    explanation: "A full board isn't over if a merge is still possible; check that no move would change anything." }),
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
  console.log(`\nDone — M15 Case Studies IX seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
