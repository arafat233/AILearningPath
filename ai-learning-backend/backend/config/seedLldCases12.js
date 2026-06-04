/**
 * Seed — LLD module M18: Case Studies XII (games & web-framework utilities):
 * Sliding Puzzle+solver, Othello/Reversi, Spell Checker, Package Dependency
 * Resolver, Cron Expression Scheduler, URL Router, Middleware Pipeline,
 * Serializer/Object Mapper. Extends pro_lld. Idempotent; recomputes totals.
 * Usage:  node config/seedLldCases12.js   ·   npm: npm run seed:lld-cases12
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m18";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 18,
  name: "Case Studies XII — Games & Web Frameworks", slug: "case-studies-12",
  description: "Eight more designs: a sliding puzzle + solver, Othello/Reversi, a spell checker, a package dependency resolver, a cron-expression scheduler, a URL router, a middleware pipeline, and a serializer / object mapper.",
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
  T("lld_m18_t1", 1, "Design a Sliding Puzzle (15-Puzzle) + Solver", "design-sliding-puzzle",
    ["case-study", "grid", "search", "a-star"],
    "Model the 15-puzzle: tiles slide into the single blank space; solve it from any (solvable) arrangement. How do you model a move, and which search finds the SHORTEST solution efficiently?",
    "State = the grid with one BLANK; a move slides a tile adjacent to the blank into it (swap tile↔blank). Solving = SHORTEST-PATH SEARCH over states: A* with an admissible HEURISTIC (Manhattan distance, sum of each tile's distance from its goal) finds the fewest-move solution far faster than BFS. Half of arrangements are UNSOLVABLE — check the inversion-count parity first.",
    [
      { kind: "concept", heading: "State and moves",
        body: "Represent the board as an N×N grid with one BLANK cell. A MOVE slides a tile ADJACENT to the blank into the blank's position — equivalently, swap the blank with an up/down/left/right neighbor. So from any state there are 2–4 legal moves. The goal state is tiles in order with the blank in the corner. The puzzle is a graph where nodes are board states and edges are single moves." },
      { kind: "concept", heading: "Solving = shortest path search",
        body: "Finding the minimum-move solution is a SHORTEST-PATH search from the start state to the goal state. Plain BFS works but the state space is enormous (16!/2 for the 15-puzzle) — it explores far too much. A* is the right tool: it prioritizes states by f = g (moves so far) + h (heuristic estimate to goal), focusing the search toward the goal and finding the optimal solution while exploring a fraction of the states." },
      { kind: "concept", heading: "The heuristic",
        body: "A* needs an ADMISSIBLE heuristic (never overestimates) to guarantee an optimal solution. MANHATTAN DISTANCE — sum over all tiles of |row−goalRow| + |col−goalCol| — is the standard choice (each tile needs at least that many moves). It's admissible and far stronger than 'number of misplaced tiles'. Better heuristics (linear conflict, pattern databases) prune even more. The heuristic quality is what makes the solver practical." },
      { kind: "concept", heading: "Solvability & follow-ups",
        body: "Critically, only HALF of all arrangements are SOLVABLE — reachability depends on the parity of the INVERSION count (and the blank's row for even-width boards). Check solvability up front (count inversions) rather than searching forever on an impossible board. Follow-ups: 'IDA* for memory' (A* can exhaust memory; iterative-deepening A* uses far less), 'larger boards (pattern DBs)', 'random solvable shuffle (apply random moves)'. Signal: state = grid+blank, move = swap-with-blank, solve via A* with the Manhattan-distance admissible heuristic (optimal), and a solvability (inversion-parity) check.",
      },
    ],
    "A sliding puzzle tests state-space search: state = grid with a blank, moves swap the blank with a neighbor, and the shortest solution comes from A* with an admissible heuristic (Manhattan distance — far better than BFS). Half of arrangements are unsolvable (inversion parity), so check first; IDA* tames memory.",
    ["Using plain BFS over the huge state space instead of A* with a heuristic.",
     "An inadmissible heuristic (or none), losing the optimal-solution guarantee.",
     "Not checking solvability (inversion parity) — searching forever on an impossible board."],
    0.6, { type: "Puzzle search", description: "State = grid + blank; move = swap blank with a neighbor. Solve: A* over states, priority f = g (moves) + h (Manhattan distance, admissible) → optimal solution. Check inversion-parity solvability first (half are unsolvable).", alt: "Sliding-puzzle solver: A* state-space search with the Manhattan-distance heuristic." }),

  T("lld_m18_t2", 2, "Design Othello / Reversi", "design-othello-reversi",
    ["case-study", "board", "rules", "validation"],
    "Model Othello: players place discs on an 8×8 board; a move must FLIP opponent discs by bracketing them between the new disc and an existing one of your color. What makes a move legal, and how do flips work?",
    "A legal move places a disc on an empty cell that BRACKETS one or more contiguous opponent discs in at least one of the 8 DIRECTIONS (ending at your own disc) — and FLIPS all bracketed discs. Generate legal moves by scanning the 8 directions from each empty cell. If a player has no legal move they pass; game ends when neither can move (most discs wins). Turn = State.",
    [
      { kind: "concept", heading: "The bracketing rule",
        body: "Othello's defining rule: a move is only legal if it FLANKS opponent discs. Placing your disc must, in at least one of the 8 DIRECTIONS (horizontal, vertical, diagonal), have a contiguous run of one-or-more OPPONENT discs immediately followed by one of YOUR discs — 'bracketing' them. That run then gets FLIPPED to your color. A move flipping nothing is illegal. This bracket-and-flip is the entire core mechanic." },
      { kind: "concept", heading: "Move generation & validation",
        body: "To find legal moves (or validate one): for each empty cell, scan outward in each of the 8 directions — step over consecutive opponent discs; if you then hit YOUR disc (with ≥1 opponent in between), that direction brackets and contributes flips. A cell is a legal move if ANY direction brackets. Generating all legal moves is needed because if you have none, you must PASS." },
      { kind: "concept", heading: "Applying flips",
        body: "When a move is played, place the disc, then for EVERY bracketing direction, FLIP all the bracketed opponent discs to the mover's color (a single move can flip in multiple directions at once). Update the board accordingly. This is more than placing a stone — the flip set must be computed and applied atomically." },
      { kind: "concept", heading: "Game flow & follow-ups",
        body: "Players alternate, but a player with NO legal move must PASS (turn skips). The game ends when NEITHER player can move (board full or both stuck); winner = most discs. Model turn/pass/end as a small State machine. Follow-ups: 'AI (minimax/alpha-beta with positional weights — corners are strong)', 'generalize to N×N', 'undo (store flipped sets)'. Signal: bracketing-in-8-directions legality + flip all bracketed discs + pass-when-no-move + most-discs-wins end; move generation scans the 8 directions.",
      },
    ],
    "Othello tests the bracketing rule: a legal move flanks opponent discs in ≥1 of 8 directions and flips all bracketed discs (multiple directions at once), with pass-when-no-legal-move and most-discs-wins ending. Move generation scans the 8 directions from each empty cell; AI uses minimax with corner-weighted heuristics.",
    ["Treating it as plain placement without the bracket-and-flip rule (the core mechanic).",
     "Flipping only one direction when a move can bracket in several at once.",
     "Forgetting the pass rule (no legal move) and the both-stuck end condition."],
    0.5),

  T("lld_m18_t3", 3, "Design a Spell Checker", "design-spell-checker",
    ["case-study", "edit-distance", "dictionary", "suggestions"],
    "Build a spell checker: flag words not in the dictionary and suggest corrections. Checking membership is easy; the hard part is suggesting the RIGHT fixes fast. What measures 'closeness', and how do you avoid scanning the whole dictionary?",
    "Membership: a fast dictionary (hash SET or TRIE). For SUGGESTIONS, rank candidates by EDIT DISTANCE (Levenshtein — min insert/delete/substitute/transpose to transform one word to another). Generating candidates naively against the whole dictionary is slow → use edits-of-the-word generation (Norvig) or a BK-tree / trie + bounded edit distance / SymSpell to fetch near words efficiently.",
    [
      { kind: "concept", heading: "Two problems: detect and suggest",
        body: "Spell checking is two tasks. DETECTION: is the word in the dictionary? — a fast membership check (hash SET, or a TRIE which also supports prefixes). SUGGESTION (the hard part): for a misspelled word, propose the most likely intended words. Detection is trivial; suggestion quality + speed is what the design is really about." },
      { kind: "concept", heading: "Edit distance = closeness",
        body: "Suggestions are ranked by EDIT (Levenshtein) DISTANCE — the minimum number of single-character INSERTIONS, DELETIONS, SUBSTITUTIONS (and optionally TRANSPOSITIONS — Damerau) to turn the typo into a candidate. 'teh'→'the' is distance 1 (transposition). Edit distance between two strings is a classic O(m·n) dynamic-programming computation. Lower distance = more likely correction; ties broken by word FREQUENCY (common words preferred)." },
      { kind: "concept", heading: "Finding candidates fast",
        body: "Computing edit distance against EVERY dictionary word per typo is too slow for a large dictionary. Faster approaches: (1) NORVIG'S method — generate all strings within edit distance 1–2 of the typo and intersect with the dictionary set (works well for small distances); (2) BK-TREE — a metric tree on edit distance that fetches all words within distance d efficiently; (3) SymSpell — precompute deletes for dictionary words for very fast lookup. These avoid the full O(dictionary) scan." },
      { kind: "concept", heading: "Ranking & follow-ups",
        body: "Rank candidates by edit distance, then by word FREQUENCY (and optionally a language model / context — 'their vs there'). Return top-K. Follow-ups: 'context-aware correction (n-grams/ML)', 'keyboard-distance weighting (adjacent keys more likely)', 'multilingual', 'phonetic matching (Soundex/Metaphone)'. Signal: dictionary set/trie for detection + edit (Levenshtein) distance for suggestion ranking + an efficient candidate-generation method (edits-generation / BK-tree / SymSpell) + frequency tie-breaking — not a full dictionary scan.",
      },
    ],
    "A spell checker tests detection (dictionary set/trie membership) plus suggestion via edit (Levenshtein) distance, with efficient candidate generation (edit-generation / BK-tree / SymSpell) instead of scanning the whole dictionary, ranked by distance then word frequency. Context/keyboard-aware ranking is the follow-up.",
    ["Scanning the entire dictionary computing edit distance per typo (too slow).",
     "Ranking suggestions without word frequency (returning rare words over common ones).",
     "Only doing detection (membership) and ignoring how to generate/rank suggestions."],
    0.5),

  T("lld_m18_t4", 4, "Design a Package Dependency Resolver", "design-dependency-resolver",
    ["case-study", "graph", "versioning", "constraint-solving"],
    "Build npm/pip-style dependency resolution: given a package's dependencies (each with version CONSTRAINTS), pick a consistent set of versions to install. Why is this genuinely hard, and how do you order the installs?",
    "Dependencies form a GRAPH; each edge carries a version CONSTRAINT (e.g. ^1.2.0). Resolution picks a version per package satisfying ALL constraints — a CONSTRAINT-SATISFACTION problem (backtracking / SAT-like) since two packages may demand conflicting versions (the diamond/conflict problem). Detect cycles. Install in TOPOLOGICAL order (dependencies before dependents). Lockfiles pin the resolved set for reproducibility.",
    [
      { kind: "concept", heading: "The dependency graph + constraints",
        body: "Each package declares DEPENDENCIES, each with a VERSION CONSTRAINT (exact, range, ^/~ semver). This forms a directed graph. Resolution must choose ONE concrete version for each needed package such that every constraint is satisfied. Semantic versioning (major.minor.patch) defines compatibility (^1.2.0 = '>=1.2.0 <2.0.0'). The graph + per-edge constraints is the model." },
      { kind: "concept", heading: "Why it's hard: conflicts",
        body: "The crux: package A needs lib@^1.0 and package B needs lib@^2.0 — there may be NO single version satisfying both (the 'diamond dependency' conflict). Resolution is a CONSTRAINT-SATISFACTION / SAT-like search: try versions, BACKTRACK when a choice leads to an unsatisfiable constraint, and either find a consistent assignment or report a conflict. (npm historically side-stepped this by allowing multiple versions in a tree; pip/Cargo solve it more strictly.) This NP-hard-flavored search is what makes resolvers genuinely complex." },
      { kind: "concept", heading: "Cycles & install order",
        body: "Dependency graphs can have CYCLES (A depends on B depends on A) — detect them (and decide policy; some ecosystems allow them, some error). Once a consistent version set is chosen, INSTALL in TOPOLOGICAL ORDER so each package's dependencies are present before it (the build-system/topological-sort idea). Shared dependencies are installed once (deduplication)." },
      { kind: "concept", heading: "Reproducibility & follow-ups",
        body: "A LOCKFILE pins the exact resolved versions (+ hashes) so every install reproduces the same tree — without it, ranges could resolve differently over time. Follow-ups: 'minimize the dependency tree / dedupe', 'handle conflicts (allow multiple versions vs error)', 'transitive constraints', 'security (integrity hashes, known-vuln versions)'. Signal: dependency graph + per-edge version constraints + constraint-satisfaction resolution with backtracking (conflict detection) + cycle detection + topological install order + lockfile for reproducibility.",
      },
    ],
    "A dependency resolver tests constraint satisfaction over a version-constrained dependency graph: pick a consistent version per package via backtracking search (the conflict/diamond problem makes it SAT-like), detect cycles, install in topological order, and pin results in a lockfile for reproducibility. Conflicts are why it's genuinely hard.",
    ["Treating it as a simple graph install without the version-constraint satisfaction (conflict) problem.",
     "No backtracking/conflict detection when two packages demand incompatible versions.",
     "Ignoring topological install order or a lockfile (non-reproducible installs)."],
    0.6, { type: "Resolution", description: "Packages + version constraints → dependency graph. Resolve: pick a version per package satisfying ALL constraints (backtracking search; conflicts → error). Detect cycles. Install in topological order; pin in a lockfile.", alt: "Dependency resolver: constraint-satisfaction over a version-constrained graph, installed topologically." }),

  T("lld_m18_t5", 5, "Design a Cron Expression Scheduler", "design-cron-scheduler",
    ["case-study", "parsing", "scheduling", "time"],
    "Build an in-process scheduler driven by cron expressions ('0 9 * * 1-5' = 9am on weekdays): parse the expression and run tasks at the right times. How do you compute the NEXT run time, and what drives execution efficiently?",
    "PARSE the cron fields (minute, hour, day-of-month, month, day-of-week — each a value/range/list/step) into matchers. Compute the NEXT-RUN time by finding the smallest future timestamp matching all fields. Keep scheduled jobs in a time-ordered structure (min-heap by next-run); a single timer sleeps until the EARLIEST next-run, fires it, reschedules — don't poll every second. Handle time zones / DST.",
    [
      { kind: "concept", heading: "Parsing the expression",
        body: "A cron expression has fields (classically 5: minute, hour, day-of-month, month, day-of-week). Each field is a SET of allowed values expressed as '*' (any), a number, a range (1-5), a list (1,3,5), or a step (*/15). PARSE each field into a matcher (e.g. a set of allowed values, or a predicate). Validate ranges. The parsed form lets you test 'does this time match?' field by field." },
      { kind: "concept", heading: "Computing the next run",
        body: "The core operation: given 'now', find the NEXT timestamp that satisfies all fields. Don't brute-force every minute forever — advance field by field (find the next matching minute, then hour, rolling over to the next day/month as needed; reconcile day-of-month vs day-of-week per cron's OR semantics). This yields the next fire time directly. (A simple correct version increments by a minute and tests the matcher, but the field-advancing approach is far faster for sparse schedules.)" },
      { kind: "concept", heading: "Driving execution efficiently",
        body: "Don't wake up every second/minute checking all jobs (wasteful). Instead, keep all scheduled jobs in a MIN-HEAP / time-ordered queue keyed by their NEXT-RUN time (the job-scheduler/heap idea). A single timer SLEEPS until the earliest next-run; on wake, run that job, compute its NEXT run, and re-insert it. This is event-driven and scales to many jobs cheaply (only ever waiting on the soonest one)." },
      { kind: "concept", heading: "Edge cases & follow-ups",
        body: "TIME ZONES / DST: '2:30am daily' may not exist or may repeat on DST-change days — decide policy (skip/run-once). Missed runs (process was down): catch up or skip. Overlapping runs (a job still running at its next fire): skip/queue/allow. Follow-ups: 'seconds field / non-standard cron', 'distributed cron' (the SD job-scheduler — only one node runs each job), 'jitter'. Signal: parse cron fields into matchers + compute next-run by advancing fields + a min-heap of jobs by next-run driven by a single sleep-until-earliest timer (not polling) + DST/missed-run handling.",
      },
    ],
    "A cron scheduler tests parsing cron fields into matchers, computing the next-run time (advance field-by-field, not brute force), and driving execution efficiently via a min-heap of jobs by next-run + a single sleep-until-earliest timer (not per-second polling). DST/missed-run/overlap policies are the edge cases; distributed cron is the SD follow-up.",
    ["Polling every second/minute over all jobs instead of a min-heap + sleep-until-earliest-next-run.",
     "Brute-forcing minute-by-minute to find the next run instead of advancing fields.",
     "Ignoring time zones / DST and missed-run / overlapping-run policies."],
    0.5, { type: "Cron scheduling", description: "Parse cron fields (min/hour/dom/month/dow) → matchers. Per job, compute next-run (advance fields). Jobs in a min-heap by next-run; one timer sleeps until the earliest, fires it, recomputes next-run, re-inserts. DST/missed-run handled.", alt: "Cron scheduler: parsed fields, next-run computation, and a min-heap driven by a single timer." }),

  T("lld_m18_t6", 6, "Design a URL Router", "design-url-router",
    ["case-study", "routing", "trie", "matching"],
    "Build a web framework's router: map an incoming HTTP method + path to a handler, supporting static paths (/users), PARAMETERS (/users/:id), and wildcards. How do you match efficiently and resolve conflicts between routes?",
    "Register routes (method + path pattern → handler); match an incoming request by walking a ROUTING TRIE / radix tree of path segments — static segments match exactly, PARAM segments (:id) capture values, wildcards match the rest. Static routes take PRIORITY over params over wildcards (specificity ordering). Extract path params + method dispatch. Trie gives fast matching independent of route count.",
    [
      { kind: "concept", heading: "Routes and the matching problem",
        body: "A router maps (HTTP METHOD + PATH) → a HANDLER. Routes include static paths (/health), PARAMETERIZED segments (/users/:id — capture id), and WILDCARDS (/files/*path). The job: given an incoming method+path, find the matching route, extract any path parameters, and dispatch to its handler (or 404 / 405 method-not-allowed). Naively testing each registered route in order works but is O(routes) per request and order-sensitive." },
      { kind: "concept", heading: "Trie / radix-tree matching",
        body: "Efficient routers store routes in a TRIE keyed by PATH SEGMENTS (split on '/'): each node is a segment; matching walks the trie segment by segment. Static segments are exact-match children; a PARAM child (:id) matches any single segment and captures it; a wildcard matches the remainder. This makes matching depend on the path's DEPTH, not the number of routes (fast at scale), and naturally groups shared prefixes. Radix-tree compression (httprouter/gin) optimizes memory." },
      { kind: "concept", heading: "Specificity & conflicts",
        body: "When multiple patterns could match (/users/me vs /users/:id), the router needs a PRIORITY rule: STATIC segments beat PARAM segments beat WILDCARDS (most specific wins) — so /users/me matches the literal route, not the param route. Define and apply this precedence consistently. Detect ambiguous/duplicate route registrations. Method is matched after path (path found but wrong method → 405)." },
      { kind: "concept", heading: "Params, middleware & follow-ups",
        body: "On a match, EXTRACT path parameters (id = '42') into the request, plus query-string parsing. Routers integrate with MIDDLEWARE (per-route or grouped — the middleware-pipeline design) and route GROUPS/prefixes. Follow-ups: 'trailing slashes / case', 'regex constraints on params (:id(\\d+))', 'route generation (reverse routing)', 'HTTP method dispatch (405 vs 404)'. Signal: routes in a segment trie/radix tree (match by depth, not route count) + param capture + wildcard + static>param>wildcard specificity ordering + method dispatch + param extraction.",
      },
    ],
    "A URL router tests fast path matching: store routes in a segment trie/radix tree (match by path depth, not route count), support static/param/wildcard segments with static>param>wildcard specificity ordering, extract path params, and dispatch by method (405 vs 404). It pairs with the middleware-pipeline design.",
    ["Testing every registered route in order (O(routes), order-sensitive) instead of a segment trie.",
     "No specificity rule, so /users/me wrongly hits /users/:id (or ambiguous matches).",
     "Conflating 'no path' (404) with 'path but wrong method' (405); not extracting path params."],
    0.5, { type: "Routing trie", description: "Routes stored in a segment trie (split path on '/'): static (exact) > param (:id, capture) > wildcard (*). Match request path segment-by-segment (depth, not route count), extract params, dispatch by method (405 vs 404).", alt: "URL router: a segment trie matching static/param/wildcard routes with specificity ordering." }),

  T("lld_m18_t7", 7, "Design a Middleware Pipeline", "design-middleware-pipeline",
    ["case-study", "chain-of-responsibility", "decorator", "composition"],
    "Build a web framework's middleware system: a request flows through a chain of middleware (logging, auth, parsing) before the handler, and responses flow back out. What pattern composes the chain, and how does a middleware short-circuit (e.g. reject unauthorized)?",
    "A pipeline of middleware functions, each receiving the request + a NEXT callback; it does work, then calls next() to pass control onward — or SHORT-CIRCUITS by responding without calling next (e.g. auth fails → 401). It's the CHAIN OF RESPONSIBILITY pattern (the 'onion' model): each layer wraps the inner ones, so code runs on the way IN and on the way OUT around next().",
    [
      { kind: "concept", heading: "The chain (onion) model",
        body: "Middleware is a sequence of functions a request passes through before reaching the handler, and that the response passes back through. Each middleware gets the request (and response) plus a NEXT function. Calling next() invokes the rest of the chain (eventually the handler); after next() returns, control comes BACK to this middleware — so code BEFORE next() runs on the way IN, code AFTER next() runs on the way OUT. This 'onion' wrapping is the mental model (Express/Koa/ASP.NET)." },
      { kind: "concept", heading: "Chain of Responsibility",
        body: "The composing pattern is CHAIN OF RESPONSIBILITY: each handler in the chain decides whether to handle/transform and whether to pass along. Build the chain by composing middleware so each holds a reference to the NEXT (often by folding the list into nested calls, or a Decorator-style wrap where each layer wraps the inner pipeline). Order MATTERS — auth before the handler, error-handling outermost, body-parsing before validation." },
      { kind: "concept", heading: "Short-circuiting",
        body: "A middleware can STOP the chain by NOT calling next() — instead producing a response directly. E.g. an auth middleware that sees an invalid token responds 401 and returns, so downstream middleware and the handler NEVER run. This short-circuit is essential (auth, rate-limiting, caching-hit, validation failure). Conversely, error-handling middleware catches exceptions bubbling back out and turns them into responses." },
      { kind: "concept", heading: "Cross-cutting use & follow-ups",
        body: "Middleware centralizes CROSS-CUTTING concerns — logging, auth, CORS, body parsing, compression, rate-limiting, error handling — outside the handlers (the same idea as the API gateway, at the framework level). Middleware can be global, per-route, or per-group (ties to the router). Follow-ups: 'async middleware / error propagation', 'ordering pitfalls', 'context passing between layers'. Signal: ordered chain of (req, next) functions, Chain of Responsibility / onion model (before + after next), short-circuit by not calling next, error-handling middleware around the chain.",
      },
    ],
    "A middleware pipeline tests Chain of Responsibility / the onion model: ordered (req, next) functions where code runs before and after next(), middleware can short-circuit by not calling next (auth 401), and error-handling wraps the chain. It centralizes cross-cutting concerns and pairs with the router; order matters.",
    ["Not modelling next()/the onion (code before AND after) — so responses can't be processed on the way out.",
     "No short-circuit path (a middleware that must reject still calls next and runs the handler).",
     "Ignoring ordering (auth must precede the handler; error-handling outermost)."],
    0.4, { type: "Middleware onion", description: "Request → MW1 (before) → next → MW2 (before) → next → … → Handler → (back out) → MW2 (after) → MW1 (after) → Response. A middleware can short-circuit (respond, skip next). Chain of Responsibility; order matters.", alt: "Middleware pipeline as an onion: each layer runs before and after next(), with short-circuiting." }),

  T("lld_m18_t8", 8, "Design a Serializer / Object Mapper", "design-serializer",
    ["case-study", "reflection", "strategy", "recursion"],
    "Build a serializer that converts objects to JSON (or binary) and back. Objects nest, reference each other, and have types the serializer didn't know at compile time. How do you serialize arbitrary objects, and what are the hard cases?",
    "Recursively WALK an object's fields (via reflection/metadata), converting each to its serialized form by TYPE (a per-type Strategy: primitives, collections, nested objects → recurse). Deserialization reverses it, reconstructing typed objects. Hard cases: CIRCULAR REFERENCES (track visited / use references), polymorphism (encode the type), and versioning/unknown fields. Custom (de)serializers handle special types.",
    [
      { kind: "concept", heading: "Recursive type-driven conversion",
        body: "Serialization WALKS the object graph: for a value, dispatch on its TYPE — primitives (number/string/bool) map directly; collections (lists/maps) serialize each element; a nested OBJECT recurses into its fields (discovered via reflection/metadata, or a declared schema). This recursive, type-dispatched traversal turns an arbitrary object tree into the target format (JSON text, or a binary byte stream). Deserialization is the inverse: parse the format and reconstruct typed objects field by field." },
      { kind: "concept", heading: "Per-type strategies",
        body: "Different types serialize differently (a Date → ISO string, a BigDecimal → string to avoid precision loss, an enum → name). Use a per-type STRATEGY / registry of (de)serializers the engine looks up by type, with custom serializers registered for special types. This keeps the core generic and extensible (Open–Closed) — add a type handler without touching the walker. It's the same Strategy-registry idea as the validation framework." },
      { kind: "concept", heading: "The hard case: circular references",
        body: "Object graphs often have CYCLES (A references B references A) or shared references — naive recursion would loop FOREVER (or duplicate shared objects). Handle by tracking VISITED objects (identity set) during the walk and, on revisiting, emit a REFERENCE/id instead of re-serializing (e.g. $ref / $id) — or error if the format can't represent cycles. This is the defining correctness pitfall." },
      { kind: "concept", heading: "Polymorphism, versioning & follow-ups",
        body: "POLYMORPHISM: when a field's static type is an interface/base, the concrete type must be encoded (a type discriminator field) so deserialization reconstructs the right subclass. VERSIONING/schema evolution: tolerate unknown/missing fields (ignore extras, default missing) so old and new code interoperate. Follow-ups: 'binary formats (Protobuf/Avro — schema-driven, compact)', 'security (don't deserialize untrusted types → RCE)', 'naming/field mapping', 'performance (codegen vs reflection)'. Signal: recursive type-dispatched walk + per-type Strategy registry + circular-reference handling (visited set / refs) + polymorphism (type tags) + version tolerance.",
      },
    ],
    "A serializer tests a recursive, type-dispatched walk of the object graph with a per-type Strategy registry (extensible), plus the hard cases: circular references (visited set / $ref — else infinite loop), polymorphism (type discriminator), and version tolerance (unknown/missing fields). Untrusted-type deserialization is a security pitfall.",
    ["Naive recursion that infinite-loops on circular/shared references (no visited tracking / refs).",
     "Not encoding the concrete type for polymorphic fields (can't reconstruct the right subclass).",
     "A closed design where adding a special type means editing the core (not a Strategy registry); deserializing untrusted types."],
    0.5, { type: "Serializer walk", description: "Serialize: recursively walk fields, dispatch by type (primitive→direct, collection→each, object→recurse) via a per-type Strategy registry. Track visited objects → emit $ref on cycles. Encode concrete type for polymorphism. Deserialize reverses; tolerate unknown/missing fields.", alt: "Serializer: recursive type-dispatched walk with strategies, circular-reference handling, and type tags." }),
];

const EXERCISES = [
  // Sliding puzzle
  pm({ topicId: "lld_m18_t1", exerciseId: "lld_m18_t1_pm_1", position: 1, level: "hard", title: "Solve optimally",
    scenario: "To find the SHORTEST solution to a sliding puzzle efficiently, use…",
    options: ["A* with an admissible heuristic", "Plain BFS over all states", "DFS", "Random moves until solved"], correct: "A* with an admissible heuristic",
    explanation: "A* (f = moves + heuristic) finds the optimal solution while exploring far fewer states than BFS on the huge space." }),
  pm({ topicId: "lld_m18_t1", exerciseId: "lld_m18_t1_pm_2", position: 2, level: "medium", title: "The heuristic",
    scenario: "The standard admissible heuristic is…",
    options: ["Manhattan distance (sum of each tile's distance from its goal)", "The number of moves made", "Random", "Always 0"], correct: "Manhattan distance (sum of each tile's distance from its goal)",
    explanation: "Manhattan distance never overestimates (admissible) and is much stronger than misplaced-tile count." }),
  pm({ topicId: "lld_m18_t1", exerciseId: "lld_m18_t1_pm_3", position: 3, level: "hard", title: "Solvability",
    scenario: "Before solving, you should check…",
    options: ["Inversion-count parity — only half of arrangements are solvable", "That the board is square", "The number of tiles", "Nothing — all are solvable"], correct: "Inversion-count parity — only half of arrangements are solvable",
    explanation: "Reachability depends on inversion parity (and blank row); checking avoids searching an impossible board." }),
  // Othello
  pm({ topicId: "lld_m18_t2", exerciseId: "lld_m18_t2_pm_1", position: 1, level: "hard", title: "Legal move",
    scenario: "An Othello move is legal only if it…",
    options: ["Brackets ≥1 opponent disc between the new disc and one of yours (in some direction)", "Lands on any empty cell", "Is adjacent to your disc", "Is in a corner"], correct: "Brackets ≥1 opponent disc between the new disc and one of yours (in some direction)",
    explanation: "The bracket-and-flip rule: a move must flank opponent discs in at least one of 8 directions." }),
  pm({ topicId: "lld_m18_t2", exerciseId: "lld_m18_t2_pm_2", position: 2, level: "medium", title: "Flips",
    scenario: "When a move is played, you flip…",
    options: ["All bracketed opponent discs in EVERY bracketing direction", "Only one disc", "Only the nearest disc", "Nothing"], correct: "All bracketed opponent discs in EVERY bracketing direction",
    explanation: "A single move can bracket in multiple directions; flip all bracketed runs to the mover's color." }),
  pm({ topicId: "lld_m18_t2", exerciseId: "lld_m18_t2_pm_3", position: 3, level: "medium", title: "No move",
    scenario: "If a player has no legal move, they…",
    options: ["Pass (turn skips); game ends when neither can move", "Lose immediately", "Place anywhere", "Flip a random disc"], correct: "Pass (turn skips); game ends when neither can move",
    explanation: "No legal move = pass; the game ends when both players are stuck (most discs wins)." }),
  // Spell checker
  pm({ topicId: "lld_m18_t3", exerciseId: "lld_m18_t3_pm_1", position: 1, level: "medium", title: "Closeness",
    scenario: "Suggestion candidates are ranked by…",
    options: ["Edit (Levenshtein) distance, then word frequency", "Alphabetical order", "String length", "Random"], correct: "Edit (Levenshtein) distance, then word frequency",
    explanation: "Fewer single-char edits = more likely correction; ties broken by preferring common words." }),
  pm({ topicId: "lld_m18_t3", exerciseId: "lld_m18_t3_pm_2", position: 2, level: "hard", title: "Find candidates fast",
    scenario: "Computing edit distance against every dictionary word per typo is too slow. Better:",
    options: ["Generate edits-of-the-word / use a BK-tree / SymSpell", "Scan the whole dictionary anyway", "Only check the first letter", "Use a hash of the word"], correct: "Generate edits-of-the-word / use a BK-tree / SymSpell",
    explanation: "These fetch near words within a small edit distance without an O(dictionary) scan." }),
  pm({ topicId: "lld_m18_t3", exerciseId: "lld_m18_t3_pm_3", position: 3, level: "easy", title: "Detection",
    scenario: "Checking if a word is misspelled uses…",
    options: ["A dictionary set/trie membership lookup", "Edit distance to every word", "A regex", "Sorting"], correct: "A dictionary set/trie membership lookup",
    explanation: "Detection is a fast membership check; suggestion (edit distance) is the harder part." }),
  // Dependency resolver
  pm({ topicId: "lld_m18_t4", exerciseId: "lld_m18_t4_pm_1", position: 1, level: "hard", title: "Why hard",
    scenario: "What makes dependency resolution genuinely hard?",
    options: ["Conflicting version constraints (a SAT-like constraint-satisfaction problem)", "Downloading files", "Sorting package names", "Reading JSON"], correct: "Conflicting version constraints (a SAT-like constraint-satisfaction problem)",
    explanation: "Two packages may demand incompatible versions; resolution is a backtracking constraint-satisfaction search." }),
  pm({ topicId: "lld_m18_t4", exerciseId: "lld_m18_t4_pm_2", position: 2, level: "medium", title: "Install order",
    scenario: "Once versions are chosen, packages are installed in…",
    options: ["Topological order (dependencies before dependents)", "Alphabetical order", "Random order", "Reverse order"], correct: "Topological order (dependencies before dependents)",
    explanation: "Topological order ensures each package's dependencies exist before it; detect cycles first." }),
  pm({ topicId: "lld_m18_t4", exerciseId: "lld_m18_t4_pm_3", position: 3, level: "medium", title: "Reproducibility",
    scenario: "Reproducible installs across machines are guaranteed by…",
    options: ["A lockfile pinning exact resolved versions (+ hashes)", "Re-resolving each time", "Using latest always", "Caching downloads"], correct: "A lockfile pinning exact resolved versions (+ hashes)",
    explanation: "A lockfile records the resolved set so every install reproduces the same tree." }),
  // Cron scheduler
  pm({ topicId: "lld_m18_t5", exerciseId: "lld_m18_t5_pm_1", position: 1, level: "hard", title: "Drive execution",
    scenario: "Efficiently firing scheduled jobs at the right time means…",
    options: ["A min-heap by next-run + one timer sleeping until the earliest", "Polling every second over all jobs", "A thread per job spinning", "Checking on each request"], correct: "A min-heap by next-run + one timer sleeping until the earliest",
    explanation: "Sleep until the soonest next-run, fire it, recompute and re-insert — event-driven, not polling." }),
  pm({ topicId: "lld_m18_t5", exerciseId: "lld_m18_t5_pm_2", position: 2, level: "medium", title: "Next run",
    scenario: "Computing a job's next run time is done by…",
    options: ["Advancing field by field to the next matching timestamp", "Trying every minute forever", "Random guessing", "Always +1 hour"], correct: "Advancing field by field to the next matching timestamp",
    explanation: "Advance minute→hour→day per the parsed cron fields (far faster than brute-forcing minutes for sparse schedules)." }),
  pm({ topicId: "lld_m18_t5", exerciseId: "lld_m18_t5_pm_3", position: 3, level: "medium", title: "Edge case",
    scenario: "A daily 2:30am job on a DST-change day must handle…",
    options: ["The time not existing or repeating (DST policy)", "Nothing special", "Running 24 times", "Being skipped permanently"], correct: "The time not existing or repeating (DST policy)",
    explanation: "DST transitions make a local time vanish or repeat; decide a skip/run-once policy (plus missed-run handling)." }),
  // URL router
  pm({ topicId: "lld_m18_t6", exerciseId: "lld_m18_t6_pm_1", position: 1, level: "medium", title: "Fast matching",
    scenario: "Matching a path to a route quickly (independent of route count) uses…",
    options: ["A segment trie / radix tree", "Testing each route in order", "A regex over all routes", "A hash of the full path only"], correct: "A segment trie / radix tree",
    explanation: "A trie keyed by path segments matches by path depth, not the number of registered routes." }),
  pm({ topicId: "lld_m18_t6", exerciseId: "lld_m18_t6_pm_2", position: 2, level: "hard", title: "Conflict",
    scenario: "Both /users/me and /users/:id could match /users/me. Which wins?",
    options: ["The static route (static > param > wildcard specificity)", "The param route", "Whichever was registered first", "Both, ambiguously"], correct: "The static route (static > param > wildcard specificity)",
    explanation: "Most-specific wins: static beats param beats wildcard." }),
  pm({ topicId: "lld_m18_t6", exerciseId: "lld_m18_t6_pm_3", position: 3, level: "medium", title: "Wrong method",
    scenario: "A path matches but the HTTP method doesn't. Return…",
    options: ["405 Method Not Allowed (vs 404 for no path)", "404 Not Found", "200 OK", "500 Error"], correct: "405 Method Not Allowed (vs 404 for no path)",
    explanation: "Path found + wrong method = 405; no matching path = 404. Also extract path params on a match." }),
  // Middleware
  pm({ topicId: "lld_m18_t7", exerciseId: "lld_m18_t7_pm_1", position: 1, level: "medium", title: "The pattern",
    scenario: "A request passing through ordered middleware before the handler is the…",
    options: ["Chain of Responsibility (onion model)", "Singleton", "Observer", "Factory"], correct: "Chain of Responsibility (onion model)",
    explanation: "Each middleware decides whether/how to handle and passes along via next() — Chain of Responsibility." }),
  pm({ topicId: "lld_m18_t7", exerciseId: "lld_m18_t7_pm_2", position: 2, level: "hard", title: "Short-circuit",
    scenario: "An auth middleware rejecting an unauthorized request should…",
    options: ["Respond (401) and NOT call next() — skipping downstream + handler", "Call next() and let the handler decide", "Throw and crash", "Log and continue"], correct: "Respond (401) and NOT call next() — skipping downstream + handler",
    explanation: "Not calling next() short-circuits the chain so the handler never runs — essential for auth/rate-limit." }),
  pm({ topicId: "lld_m18_t7", exerciseId: "lld_m18_t7_pm_3", position: 3, level: "medium", title: "Onion",
    scenario: "In the onion model, code AFTER next() runs…",
    options: ["On the way OUT (as the response bubbles back)", "Never", "Before the handler", "Only on errors"], correct: "On the way OUT (as the response bubbles back)",
    explanation: "Before-next runs inbound, after-next runs outbound — letting middleware process the response too." }),
  // Serializer
  pm({ topicId: "lld_m18_t8", exerciseId: "lld_m18_t8_pm_1", position: 1, level: "medium", title: "Core approach",
    scenario: "Serializing an arbitrary object works by…",
    options: ["Recursively walking fields, dispatching by type", "Calling toString() once", "Casting to a string", "Hashing the object"], correct: "Recursively walking fields, dispatching by type",
    explanation: "A type-dispatched recursive walk turns the object graph into the target format; deserialization reverses it." }),
  pm({ topicId: "lld_m18_t8", exerciseId: "lld_m18_t8_pm_2", position: 2, level: "hard", title: "The hard case",
    scenario: "A references B references A. Naive serialization would…",
    options: ["Infinite-loop — track visited and emit a reference ($ref)", "Work fine", "Skip both", "Throw a type error"], correct: "Infinite-loop — track visited and emit a reference ($ref)",
    explanation: "Circular references need a visited set; on revisit emit an id/reference instead of recursing forever." }),
  pm({ topicId: "lld_m18_t8", exerciseId: "lld_m18_t8_pm_3", position: 3, level: "hard", title: "Polymorphism",
    scenario: "Deserializing a field typed as an interface requires…",
    options: ["A type discriminator encoded so the concrete subclass is reconstructed", "Always using the base type", "Guessing the type", "Ignoring the field"], correct: "A type discriminator encoded so the concrete subclass is reconstructed",
    explanation: "Encode the concrete type (a discriminator) so deserialization builds the right subclass; also tolerate unknown fields." }),
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
  console.log(`\nDone — M18 Case Studies XII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
