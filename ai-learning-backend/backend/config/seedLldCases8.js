/**
 * Seed — LLD module M14: Case Studies VIII (more OOD problems):
 * URL Shortener (LLD), Circuit Breaker, Tetris, Poker Hand Evaluator,
 * Conway's Game of Life, CLI Argument Parser, Validation Framework, Battleship.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases8.js   ·   npm: npm run seed:lld-cases8
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m14";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 14,
  name: "Case Studies VIII — More OOD", slug: "case-studies-8",
  description: "Eight more designs: a URL shortener, a circuit breaker, Tetris, a poker hand evaluator, Conway's Game of Life, a command-line argument parser, a validation framework, and Battleship.",
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
  T("lld_m14_t1", 1, "Design a URL Shortener (OOD)", "design-url-shortener-ood",
    ["case-study", "encoding", "base62", "object-model"],
    "Model the object design of a URL shortener: turn a long URL into a short unique code and back. What generates the code, and how do you map short↔long without collisions?",
    "Map a unique numeric ID per URL to a short string via BASE62 encoding (a–z A–Z 0–9 → 7 chars covers ~3.5 trillion). A UrlService creates a Mapping(id, shortCode, longUrl, createdAt, expiry); lookup decodes/looks up the code → long URL → redirect. Code generation = ID-then-encode (no collisions) rather than random-and-check.",
    [
      { kind: "concept", heading: "Core entities",
        body: "A UrlMapping holds the long URL, its short code, creation time, optional expiry, owner, and click count. A UrlService exposes shorten(longUrl) → shortCode and resolve(shortCode) → longUrl. Two indexed lookups: by shortCode (for redirects, the hot path) and optionally by longUrl (to dedupe). Keep the encoding logic in its own component." },
      { kind: "concept", heading: "Base62 encoding",
        body: "The short code should be compact and URL-safe. Assign each URL a unique numeric ID, then BASE62-encode it (digits 0-9, a-z, A-Z = 62 symbols). 62^7 ≈ 3.5 trillion codes in just 7 characters. Decoding base62 back to the ID lets you look the mapping up. Base62 (vs hex) maximizes density per character." },
      { kind: "concept", heading: "Avoiding collisions — ID then encode",
        body: "Two strategies: (a) RANDOM code then check-if-taken — simple but collisions grow as the space fills, needing retries (and a race-safe uniqueness check); (b) UNIQUE ID then encode — a monotonic counter / ID generator (the Snowflake idea) gives a guaranteed-unique number, base62 of which is collision-free BY CONSTRUCTION. The ID-then-encode approach is cleaner and avoids the check-and-retry race. Custom aliases are checked for uniqueness separately." },
      { kind: "concept", heading: "Redirect, expiry & follow-ups",
        body: "resolve(code) decodes → fetches the mapping → returns an HTTP 301/302 redirect to the long URL (302 if you want to keep counting clicks). Handle expiry (TTL → 404/410) and analytics (increment click count — the distributed-counter idea at scale). Follow-ups: 'custom aliases', 'collision under concurrency', 'analytics', 'rate limiting'. Signal: UrlMapping + base62 encode/decode + unique-ID-then-encode (collision-free) + redirect + expiry. (System-scale concerns — sharding, caching the hot redirects — are the [[design-url-shortener]] system-design view.)" },
    ],
    "A URL shortener's OOD tests clean encoding: a UrlMapping entity, base62 encode/decode for compact codes, and unique-ID-then-encode for collision-free generation (vs random-and-retry). Redirect + expiry round it out; sharding/caching is the system-design layer.",
    ["Random-code-and-check that races/retries as the space fills, instead of unique-ID-then-encode.",
     "Using hex or long hashes instead of compact base62.",
     "Tangling encoding, storage, and redirect concerns instead of a clean UrlService + Mapping."],
    0.4, { type: "Shorten/resolve", description: "shorten(longUrl): assign unique ID → base62 encode → store UrlMapping → return code. resolve(code): base62 decode / lookup → longUrl → 301/302 redirect. Expiry → 404.", alt: "URL shortener: unique-ID base62 encoding to a short code, resolved back via lookup and redirect." }),

  T("lld_m14_t2", 2, "Design a Circuit Breaker", "design-circuit-breaker-lld",
    ["case-study", "state-machine", "resilience", "fault-tolerance"],
    "Build a circuit breaker that stops calling a failing dependency (so you fail fast instead of piling up), then automatically tests if it has recovered. What are its states, and what triggers each transition?",
    "A three-state State machine: CLOSED (calls pass; count failures) → trips to OPEN when failures exceed a threshold (calls fail fast immediately, no call made) → after a cooldown timer, HALF_OPEN (allow a trial call) → success closes it, failure re-opens it. It wraps a call and protects against cascading failures.",
    [
      { kind: "concept", heading: "Why a breaker",
        body: "When a downstream dependency is failing or slow, naively retrying piles up requests, exhausts threads/connections, and cascades the failure upstream. A CIRCUIT BREAKER (like an electrical one) detects sustained failure and 'trips' — short-circuiting further calls so you FAIL FAST (return an error/fallback instantly) instead of waiting on a dead service. It gives the dependency time to recover and protects the caller." },
      { kind: "concept", heading: "Three states",
        body: "CLOSED: normal — calls pass through, and the breaker tracks failures (a rolling count/rate). OPEN: tripped — calls are rejected immediately (fail fast / fallback) without touching the dependency; a cooldown timer runs. HALF_OPEN: after the cooldown, the breaker lets a LIMITED trial call (or few) through to test recovery. It's a classic State machine with three states and clear transitions." },
      { kind: "concept", heading: "Transitions",
        body: "CLOSED → OPEN when the failure threshold is exceeded (e.g. ≥50% failures over a window, or N consecutive failures). OPEN → HALF_OPEN automatically when the cooldown timer elapses. HALF_OPEN → CLOSED if the trial call SUCCEEDS (dependency recovered, reset counters); HALF_OPEN → OPEN if it FAILS (not recovered, restart the cooldown). The State pattern routes each call and outcome to the current state's behaviour." },
      { kind: "concept", heading: "Details & follow-ups",
        body: "Configurable: failure threshold, window, cooldown duration, half-open trial count. Provide a FALLBACK (cached value, default, queue) for when open. Make it THREAD-SAFE (the failure counters and state are shared). Often combined with timeouts + retries + bulkheads (the resilience patterns). Follow-ups: 'count slow calls as failures', 'per-endpoint breakers', 'metrics/observability', 'sliding-window vs count-based'. Signal: CLOSED/OPEN/HALF_OPEN State machine + threshold-trips-open + cooldown→half-open + trial-call decides close/re-open + fail-fast fallback + thread-safety." },
    ],
    "A circuit breaker is the canonical three-state State machine: CLOSED (pass, count failures) → OPEN (fail fast on threshold, cooldown) → HALF_OPEN (trial call) → close on success or re-open on failure. It prevents cascading failures; thread-safety and a fallback are the craft.",
    ["Modelling it with booleans instead of a CLOSED/OPEN/HALF_OPEN State machine.",
     "No HALF_OPEN trial state — never automatically testing recovery.",
     "Ignoring thread-safety of the shared state/counters, or providing no fail-fast fallback."],
    0.5, { type: "Breaker states", description: "CLOSED (calls pass, count failures) →[threshold exceeded]→ OPEN (fail fast, cooldown timer) →[timer elapses]→ HALF_OPEN (trial call) →success→ CLOSED / →failure→ OPEN.", alt: "Circuit breaker state machine: closed, open, and half-open with their transitions." }),

  T("lld_m14_t3", 3, "Design Tetris", "design-tetris",
    ["case-study", "grid", "rotation", "game-loop"],
    "Model Tetris: tetromino pieces fall on a grid, can be moved/rotated, lock when they land, and full rows clear. How do you represent pieces and rotation, and detect a valid move or a line clear?",
    "The board is a 2D grid; each of the 7 TETROMINOES is a set of cell offsets with rotation states. A move/rotate is valid if the piece's resulting cells are in-bounds and don't collide with locked cells. On landing, the piece's cells LOCK into the grid; full rows are cleared (remove + shift down). A tick/game-loop drives gravity; State machine for play/over.",
    [
      { kind: "concept", heading: "Board and pieces",
        body: "The board is a fixed grid (e.g. 10×20) of cells (empty or a locked color). There are 7 tetromino shapes (I, O, T, S, Z, J, L); represent each as a set of relative CELL OFFSETS from a pivot, with its rotation states (either precomputed per rotation, or rotated via coordinate transform). The active piece has a position (pivot on the grid) + current rotation." },
      { kind: "concept", heading: "Valid moves & collision",
        body: "To move left/right/down or rotate: compute the piece's resulting absolute cells, then VALIDATE — every cell must be in-bounds AND not overlap a locked cell. If valid, apply; if not, reject (e.g. a downward move that's invalid means the piece has LANDED). Rotation near a wall may need 'wall kicks' (nudge the piece to fit). This collision check is the core mechanic." },
      { kind: "concept", heading: "Locking and line clears",
        body: "When a piece can't move down further, LOCK its cells into the grid (mark them filled with its color) and spawn the next piece. Then check for COMPLETED ROWS (a row fully filled): remove each full row and shift everything above it down by one (gravity for the stack). Multiple simultaneous clears score more (Tetris = 4 lines). Game over if a new piece can't spawn (the stack reached the top)." },
      { kind: "concept", heading: "Game loop & follow-ups",
        body: "A fixed-interval TICK (the Game Loop pattern) moves the active piece down by gravity (speeding up by level); player input moves/rotates between ticks. State machine: PLAYING / PAUSED / GAME_OVER. Follow-ups: 'next-piece preview / hold', 'scoring & levels', 'soft/hard drop', 'ghost piece', 'wall kicks (SRS)'. Signal: grid + tetromino-as-offsets with rotation + in-bounds/collision validation + lock-then-clear-full-rows + tick-driven gravity + State machine." },
    ],
    "Tetris tests grid + piece modelling: tetrominoes as rotatable cell-offset sets, move/rotate validity via in-bounds + collision checks, lock-on-landing then clear-and-shift full rows, all driven by a tick game loop with a play/over State machine.",
    ["No clean collision/in-bounds validation for moves and rotations (the core mechanic).",
     "Forgetting to shift rows down after clearing a full line.",
     "Driving the game ad hoc instead of a fixed-tick game loop; not detecting game-over on spawn."],
    0.5, { type: "Tetris mechanics", description: "Active piece (offsets + rotation) on a grid. Move/rotate → validate in-bounds + no collision. Can't fall → lock cells → clear full rows (shift down) → spawn next. Tick = gravity. Game over if spawn blocked.", alt: "Tetris: piece movement/rotation validated against the grid, then lock and clear full rows." }),

  T("lld_m14_t4", 4, "Design a Poker Hand Evaluator", "design-poker-evaluator",
    ["case-study", "ranking", "enum", "comparison"],
    "Given 5 cards, determine the poker hand (pair, flush, straight, full house…) and compare two hands to pick the winner. How do you classify a hand and break ties correctly?",
    "Reuse the Card (Suit×Rank) value objects; classify a hand by checking categories from STRONGEST to weakest (straight flush → four of a kind → full house → … → high card) using rank-count groupings and flush/straight detection. Represent the result as (HandRank enum + tiebreaker ranks) so comparison is: compare category, then compare kickers in order.",
    [
      { kind: "concept", heading: "Reuse Card; compute hand features",
        body: "Cards are the Suit×Rank value objects from the deck design. To evaluate 5 cards, compute features: the COUNT of each rank (pairs/trips/quads), whether all suits match (FLUSH), and whether ranks are consecutive (STRAIGHT, with the wheel A-2-3-4-5 special case). These features drive classification — don't write a tangle of nested ifs; derive the rank-count distribution first." },
      { kind: "concept", heading: "Classify strongest-first",
        body: "Hand categories, in rank order: Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a Kind > Two Pair > One Pair > High Card. Check from the TOP down (or compute all features and map the rank-count signature + flush/straight flags to a category). E.g. counts {4,1} → four of a kind; {3,2} → full house; {3,1,1} → trips; {2,2,1} → two pair. A HandRank enum captures the category." },
      { kind: "concept", heading: "Comparison & tie-breaking",
        body: "Two hands compare FIRST by category (enum ordinal). If equal category, break ties by the relevant ranks IN ORDER: e.g. two pairs → higher pair, then lower pair, then kicker; full house → the trip rank, then the pair. So represent a result as (category, [ordered tiebreaker ranks]) and compare lexicographically. Getting the tiebreaker ordering right is the subtle part." },
      { kind: "concept", heading: "Follow-ups",
        body: "'7-card hands (Texas Hold'em)' — choose the best 5 of 7 (evaluate all C(7,5)=21 combos, or a smarter algorithm). 'Performance' (precomputed lookup tables / perfect-hash evaluators rank a hand in O(1) — used in poker engines). 'Wild cards/jokers'. Signal: reuse Card value objects + rank-count + flush/straight detection → HandRank enum + ordered tiebreakers → lexicographic comparison; best-5-of-7 for Hold'em." },
    ],
    "A poker evaluator tests classification + comparison: derive rank-count + flush/straight features, map to a HandRank enum (checked strongest-first), and represent results as (category, ordered kickers) for lexicographic tie-breaking. Best-5-of-7 and lookup-table speedups are the follow-ups.",
    ["A tangle of nested ifs instead of deriving the rank-count signature first.",
     "Getting tie-breaking wrong (not comparing kickers in the correct order).",
     "Forgetting the A-2-3-4-5 'wheel' straight edge case."],
    0.5),

  T("lld_m14_t5", 5, "Design Conway's Game of Life", "design-game-of-life",
    ["case-study", "grid", "simulation", "rules"],
    "Model Conway's Game of Life: a grid of cells where each generation, a cell lives or dies based on its 8 neighbors. The classic bug is updating cells in place. How do you compute a generation correctly?",
    "Compute the NEXT generation from a SNAPSHOT of the current one — never mutate in place (a cell's fate depends on neighbors' CURRENT state). For each cell, count live neighbors (8-connected) and apply the rules (underpopulation/survival/overpopulation/reproduction) to decide its next state, writing into a new grid (double-buffering). For huge/sparse grids, track only live cells.",
    [
      { kind: "concept", heading: "The rules",
        body: "Each cell is alive or dead. Per generation, based on its 8 NEIGHBORS' current states: a live cell with <2 live neighbors DIES (underpopulation); with 2 or 3 SURVIVES; with >3 DIES (overpopulation); a dead cell with EXACTLY 3 live neighbors becomes ALIVE (reproduction). Simple local rules → complex emergent patterns (gliders, oscillators)." },
      { kind: "concept", heading: "The in-place bug (double-buffering)",
        body: "The classic mistake: updating cells one-by-one in the SAME grid — then a cell you already flipped corrupts the neighbor count for cells processed later. A cell's next state must depend on the CURRENT generation's state of all its neighbors. Fix: read from the current grid, WRITE the results into a SEPARATE next grid (double-buffering), then swap. (Alternatively compute all changes first, then apply.) This is the key correctness insight." },
      { kind: "concept", heading: "Counting neighbors & edges",
        body: "For each cell, sum the 8 surrounding cells' live states. Decide the EDGE policy: bounded grid (out-of-bounds = dead) or TOROIDAL wrap-around (edges connect). A small helper that safely reads a neighbor (respecting the policy) keeps the rule application clean. Straightforward grid is O(rows×cols) per generation." },
      { kind: "concept", heading: "Scale & follow-ups",
        body: "'Infinite / very large sparse grids' — don't store dead cells; track only LIVE cell coordinates in a set, and only consider live cells + their neighbors when computing the next generation (huge speedup for sparse boards; Hashlife is the advanced version). Follow-ups: 'custom rulesets (B/S notation)', 'parallelize' (each cell independent → easy to parallelize), 'detect stable/oscillating patterns'. Signal: apply rules from a snapshot into a new grid (double-buffer, no in-place) + 8-neighbor count + edge policy + sparse-set representation for big boards." },
    ],
    "Game of Life tests simulation correctness: compute the next generation from a snapshot into a separate grid (double-buffering — never in place), with 8-neighbor counting and an edge policy. Tracking only live cells (sparse set) is the scale follow-up; it's embarrassingly parallel.",
    ["Updating cells in place, corrupting neighbor counts for later cells (the classic bug).",
     "Not defining an edge policy (bounded vs toroidal wrap-around).",
     "Storing a dense grid for an enormous sparse board instead of tracking live cells only."],
    0.4, { type: "Generation step", description: "For each cell: count 8 live neighbors from the CURRENT grid → apply rules (die <2, survive 2–3, die >3, born at exactly 3) → write to a NEW grid. Swap (double-buffer). No in-place mutation.", alt: "Game of Life: rules applied from a snapshot into a new grid via double-buffering." }),

  T("lld_m14_t6", 6, "Design a Command-Line Argument Parser", "design-cli-arg-parser",
    ["case-study", "parsing", "builder", "validation"],
    "Build an argparse-style library: define a program's flags (--verbose), options (--output file), and positional args, then parse argv into typed values with help text and error messages. How do you declare the spec and parse against it?",
    "A fluent/Builder spec declares each argument (name, short/long, type, required, default, help); parse() tokenizes argv against the spec — matching flags/options/positionals, coercing TYPES, applying defaults, and VALIDATING (required present, valid choices). Errors and an auto-generated --help come from the same spec. It's declarative spec + a parsing pass.",
    [
      { kind: "concept", heading: "Declare the spec",
        body: "First DEFINE what the program accepts: a parser to which you ADD arguments — a Builder/fluent API: addFlag('--verbose', '-v'), addOption('--output', type=String, required, default), addPositional('file', type=Path). Each Argument captures name(s), type, whether it's a flag (boolean, no value) vs option (takes a value) vs positional, required-ness, default, allowed choices, and help text. The spec is data the parser interprets." },
      { kind: "concept", heading: "Parse argv against the spec",
        body: "parse(argv) walks the token list: a token starting with '--'/'-' is matched to a defined flag/option (flags set true; options consume the next token as their value — or support --key=value); leftover tokens fill POSITIONALS in order. Support combined short flags (-abc), '--' end-of-options, and aliases. Unknown arguments → error. The result is a typed map/object of values." },
      { kind: "concept", heading: "Types, defaults, validation",
        body: "COERCE each value to its declared type (string→int/bool/path/enum), failing clearly on bad input ('--port expects an integer'). Apply DEFAULTS for absent optional args. VALIDATE: required args present, values within allowed choices, mutually-exclusive groups respected. Collect errors and report them with usage — fail before the program runs on bad input (fail fast, like the config manager)." },
      { kind: "concept", heading: "Help & follow-ups",
        body: "The same spec AUTO-GENERATES --help/usage text (no separate maintenance) — list each argument with its help string. Follow-ups: 'subcommands' (git-style — nested parsers, a command per ProTopic), 'variadic args (nargs)', 'environment-variable fallback', 'config-file merge'. Signal: declarative Builder spec of Arguments + a parse pass (match flags/options/positionals, type-coerce, default, validate) + spec-derived help; fail fast on errors." },
    ],
    "A CLI parser tests a declarative spec + parsing pass: a Builder declares typed arguments (flag/option/positional, required/default/choices/help), parse() matches argv and coerces types, validation fails fast, and the spec auto-generates help. Subcommands are the classic extension.",
    ["Ad-hoc argv index-fiddling instead of a declarative argument spec the parser interprets.",
     "No type coercion/validation (or not failing fast with clear usage errors).",
     "Hand-maintaining help text separately instead of generating it from the spec."],
    0.4),

  T("lld_m14_t7", 7, "Design a Validation Framework", "design-validation-framework",
    ["case-study", "composite", "strategy", "rules"],
    "Build a reusable validation framework: declare rules for an object's fields (required, length, range, email, custom), run them, and return ALL failures (not just the first) with clear messages. How do you compose rules and aggregate errors?",
    "Each rule is a Validator (Strategy) implementing validate(value) → ok | error. Compose them — per field and combinators (AND/OR/not) — often as a Composite. Run ALL rules collecting a list of errors (don't stop at the first) into a Result(valid, errors[]). Declarative, extensible (add a rule = a new Validator), reusable across the app.",
    [
      { kind: "concept", heading: "A rule is a Strategy",
        body: "Model each validation rule as a small Validator with a uniform interface: validate(value, context) → Ok or an Error(message). Required, MinLength, Range, Pattern/Regex, Email, custom lambda — each is one implementation. This Strategy approach makes rules interchangeable and lets you ADD a new rule type without touching existing ones (Open–Closed). Rules are reusable across fields and objects." },
      { kind: "concept", heading: "Compose rules",
        body: "Real validation combines rules: a field has multiple (required AND maxLength AND pattern); you may need OR / NOT / conditional rules. Compose Validators — a composite Validator that holds children and applies AND/OR semantics (the Composite pattern), and per-FIELD rule sets bound to an object schema. The schema (field → rules) is declarative configuration, not hardcoded if-checks scattered through the code." },
      { kind: "concept", heading: "Aggregate ALL errors",
        body: "A good validator reports EVERY failure at once (so a user fixes all fields in one pass), not just the first. So running the rules COLLECTS errors into a list rather than throwing/returning on the first failure. The output is a Result { valid: boolean, errors: [{field, message}] }. (Short-circuit only where it makes sense, e.g. skip further rules on a field that's required-but-missing.)" },
      { kind: "concept", heading: "Follow-ups",
        body: "'Nested objects / collections' (recurse the validator into sub-objects and array elements). 'Cross-field rules' (password == confirmPassword — needs the whole object as context). 'i18n messages', 'async validators' (uniqueness check hitting a DB). 'Declarative annotations/decorators' (like Bean Validation @NotNull). Signal: Validator-per-rule (Strategy) + Composite/field-schema composition + run-all + aggregated Result(errors[]); extensible and reusable." },
    ],
    "A validation framework tests composable rules: a Validator-per-rule (Strategy) composed per field and with AND/OR (Composite), running ALL rules to aggregate every error into a Result — declarative, extensible, reusable. Cross-field and nested-object validation are the follow-ups.",
    ["Scattering ad-hoc if-checks instead of reusable Validator rules + a declarative field schema.",
     "Stopping at the first error instead of aggregating all failures.",
     "A closed design where adding a rule type means editing the core (not Open–Closed)."],
    0.4),

  T("lld_m14_t8", 8, "Design Battleship", "design-battleship",
    ["case-study", "grid", "state", "placement"],
    "Model the Battleship game: two players place ships on hidden grids, then take turns firing at coordinates, scoring hits/misses/sinks until one fleet is destroyed. How do you model boards and ships, and validate placement and fire?",
    "Each player has a grid plus Ships (each occupying a set of cells, tracking hits). Placement validates: in-bounds, no overlap, valid orientation. Firing a coordinate checks the opponent's grid → MISS, HIT (mark the ship cell; if all its cells hit → SUNK), already-fired (reject). Game is a State machine (SETUP → PLAYING → turns → OVER when a fleet is sunk).",
    [
      { kind: "concept", heading: "Boards and ships",
        body: "Each player owns a GRID (e.g. 10×10) and a fleet of SHIPS (Carrier=5, Battleship=4, … each a length). A Ship occupies a set of CELLS (its placed coordinates, orientation H/V) and tracks which of its cells have been HIT. The grid maps a coordinate → empty / ship-segment / already-fired. Each player effectively has two views: their own board (ships visible) and their tracking of shots at the opponent." },
      { kind: "concept", heading: "Placement validation",
        body: "When placing a ship, VALIDATE: all its cells are in-bounds, the orientation/length fits, and it doesn't OVERLAP an already-placed ship (and optionally isn't adjacent, per variant). Reject invalid placements. This is a constraint check similar to other grid games. Random placement (for AI) repeatedly tries until valid." },
      { kind: "concept", heading: "Firing logic",
        body: "On a player's turn they fire at a coordinate on the OPPONENT's grid: if it's empty → MISS; if it's a ship segment → HIT, mark that ship cell hit, and if ALL the ship's cells are now hit → SUNK (announce it). Firing an already-targeted cell is illegal → reject/re-prompt. Track the result on the firing player's tracking grid. Win = the opponent's entire fleet is sunk." },
      { kind: "concept", heading: "Game flow & follow-ups",
        body: "Game State machine: SETUP (both place fleets) → PLAYING (alternating turns; the move handler validates and applies fire) → GAME_OVER (a fleet fully sunk). Turn alternation; hidden information (you never see the opponent's board, only your shot results). Follow-ups: 'AI targeting' (hunt/target Strategy after a hit), 'salvo/variant rules', 'networked play' (don't leak the opponent's board). Signal: per-player grid + Ships-as-cell-sets tracking hits + placement validation (in-bounds/no-overlap) + fire→miss/hit/sunk + State machine + hidden info.",
      },
    ],
    "Battleship tests grid + hidden-state modelling: per-player boards with Ships as cell-sets tracking hits, placement validation (in-bounds, no overlap), fire resolution (miss/hit/sunk when all a ship's cells are hit), and a SETUP→PLAYING→OVER State machine. AI targeting and not leaking the opponent's board are the follow-ups.",
    ["Not validating placement (overlapping or out-of-bounds ships).",
     "Tracking hits on the grid only, so you can't tell when a whole ship is SUNK (track per-ship cells).",
     "Leaking the opponent's board / allowing fire at an already-targeted cell."],
    0.4, { type: "Battleship flow", description: "SETUP: place Ships (validate in-bounds + no overlap). PLAYING: fire at opponent coord → MISS / HIT (mark ship cell; all cells hit → SUNK) / reject repeat. OVER when a fleet is fully sunk.", alt: "Battleship: ship placement validation and fire resolution into miss/hit/sunk over a state machine." }),
];

const EXERCISES = [
  // URL shortener
  pm({ topicId: "lld_m14_t1", exerciseId: "lld_m14_t1_pm_1", position: 1, level: "medium", title: "Generate the code",
    scenario: "The collision-free way to generate a short code is…",
    options: ["Assign a unique ID, then base62-encode it", "Random string, check if taken, retry", "Hash the URL and truncate", "Use a timestamp string"], correct: "Assign a unique ID, then base62-encode it",
    explanation: "A unique numeric ID base62-encoded is collision-free by construction; random-and-check races as the space fills." }),
  pm({ topicId: "lld_m14_t1", exerciseId: "lld_m14_t1_pm_2", position: 2, level: "easy", title: "Why base62",
    scenario: "Codes use base62 (a–z A–Z 0–9) rather than hex because…",
    options: ["It packs more values per character (62^7 ≈ 3.5T in 7 chars)", "Hex isn't URL-safe", "Base62 is easier to hash", "It's required by HTTP"], correct: "It packs more values per character (62^7 ≈ 3.5T in 7 chars)",
    explanation: "62 symbols per char maximizes density, keeping codes short while covering a huge space." }),
  pm({ topicId: "lld_m14_t1", exerciseId: "lld_m14_t1_pm_3", position: 3, level: "medium", title: "Resolve",
    scenario: "Resolving a short code returns…",
    options: ["An HTTP redirect (301/302) to the long URL", "The long URL as plain text always", "A new short code", "The numeric ID"], correct: "An HTTP redirect (301/302) to the long URL",
    explanation: "Look up the mapping and redirect; 302 keeps the request flowing through you (for click counting)." }),
  // Circuit breaker
  pm({ topicId: "lld_m14_t2", exerciseId: "lld_m14_t2_pm_1", position: 1, level: "medium", title: "Three states",
    scenario: "A circuit breaker's three states are…",
    options: ["CLOSED, OPEN, HALF_OPEN", "ON, OFF, BROKEN", "START, RUN, STOP", "LOW, MEDIUM, HIGH"], correct: "CLOSED, OPEN, HALF_OPEN",
    explanation: "CLOSED passes calls, OPEN fails fast, HALF_OPEN trials a call to test recovery." }),
  pm({ topicId: "lld_m14_t2", exerciseId: "lld_m14_t2_pm_2", position: 2, level: "hard", title: "Trip open",
    scenario: "The breaker moves CLOSED → OPEN when…",
    options: ["Failures exceed a threshold over a window", "A single call succeeds", "The cooldown timer elapses", "It's manually reset"], correct: "Failures exceed a threshold over a window",
    explanation: "Sustained failures (count/rate over a window) trip the breaker open so calls fail fast." }),
  pm({ topicId: "lld_m14_t2", exerciseId: "lld_m14_t2_pm_3", position: 3, level: "hard", title: "Testing recovery",
    scenario: "After the cooldown, the breaker goes HALF_OPEN and…",
    options: ["Allows a trial call — success closes it, failure re-opens it", "Immediately closes", "Stays open forever", "Fails all calls permanently"], correct: "Allows a trial call — success closes it, failure re-opens it",
    explanation: "A trial call probes recovery: success resets to CLOSED, failure re-opens and restarts the cooldown." }),
  // Tetris
  pm({ topicId: "lld_m14_t3", exerciseId: "lld_m14_t3_pm_1", position: 1, level: "hard", title: "Valid move",
    scenario: "A move or rotation is valid only if the piece's resulting cells…",
    options: ["Are in-bounds and don't collide with locked cells", "Are in the top half", "Form a straight line", "Match the piece's color"], correct: "Are in-bounds and don't collide with locked cells",
    explanation: "Collision + bounds checking on the resulting cells is the core mechanic; an invalid down-move means it landed." }),
  pm({ topicId: "lld_m14_t3", exerciseId: "lld_m14_t3_pm_2", position: 2, level: "medium", title: "Line clear",
    scenario: "After a piece locks, a fully-filled row is…",
    options: ["Removed, and rows above shift down", "Left in place", "Cleared only at game over", "Turned a different color"], correct: "Removed, and rows above shift down",
    explanation: "Full rows clear and everything above shifts down by one — the stack 'falls'." }),
  pm({ topicId: "lld_m14_t3", exerciseId: "lld_m14_t3_pm_3", position: 3, level: "medium", title: "Gravity",
    scenario: "The active piece falls because of…",
    options: ["A fixed-interval game-loop tick moving it down", "Player input only", "Random chance", "A recursive call per cell"], correct: "A fixed-interval game-loop tick moving it down",
    explanation: "A tick (Game Loop pattern) applies gravity, speeding up by level; input moves/rotates between ticks." }),
  // Poker
  pm({ topicId: "lld_m14_t4", exerciseId: "lld_m14_t4_pm_1", position: 1, level: "medium", title: "Classify cleanly",
    scenario: "Hand classification is driven by…",
    options: ["Rank-count groupings + flush/straight detection", "The order cards were dealt", "Card colors", "A random label"], correct: "Rank-count groupings + flush/straight detection",
    explanation: "Counts like {4,1}=quads, {3,2}=full house, plus flush/straight flags map to the category cleanly." }),
  pm({ topicId: "lld_m14_t4", exerciseId: "lld_m14_t4_pm_2", position: 2, level: "hard", title: "Tie-break",
    scenario: "Two hands of the same category are compared by…",
    options: ["The relevant ranks in order (category, then ordered kickers)", "Number of cards", "Suit priority", "Who was dealt first"], correct: "The relevant ranks in order (category, then ordered kickers)",
    explanation: "Represent a hand as (category, ordered tiebreaker ranks) and compare lexicographically." }),
  pm({ topicId: "lld_m14_t4", exerciseId: "lld_m14_t4_pm_3", position: 3, level: "medium", title: "Edge case",
    scenario: "Which straight is the classic edge case?",
    options: ["A-2-3-4-5 (the 'wheel', where Ace is low)", "10-J-Q-K-A", "All same suit", "Three of a kind"], correct: "A-2-3-4-5 (the 'wheel', where Ace is low)",
    explanation: "The Ace can be low in A-2-3-4-5; straight detection must handle this wheel case." }),
  // Game of Life
  pm({ topicId: "lld_m14_t5", exerciseId: "lld_m14_t5_pm_1", position: 1, level: "hard", title: "The classic bug",
    scenario: "Why must you NOT update cells in place?",
    options: ["A cell's next state depends on neighbors' CURRENT state; in-place edits corrupt later counts", "It's slower", "Cells can't be mutated", "It uses more memory"], correct: "A cell's next state depends on neighbors' CURRENT state; in-place edits corrupt later counts",
    explanation: "Use double-buffering: read the current grid, write the next grid, then swap." }),
  pm({ topicId: "lld_m14_t5", exerciseId: "lld_m14_t5_pm_2", position: 2, level: "medium", title: "Born rule",
    scenario: "A dead cell becomes alive when it has exactly…",
    options: ["3 live neighbors", "2 live neighbors", "4 live neighbors", "1 live neighbor"], correct: "3 live neighbors",
    explanation: "Reproduction: a dead cell with exactly 3 live neighbors becomes alive." }),
  pm({ topicId: "lld_m14_t5", exerciseId: "lld_m14_t5_pm_3", position: 3, level: "medium", title: "Huge sparse board",
    scenario: "For an enormous, mostly-empty board, you should…",
    options: ["Track only live cells (a set) + their neighbors", "Allocate the full dense grid", "Skip generations", "Only simulate the center"], correct: "Track only live cells (a set) + their neighbors",
    explanation: "A sparse live-cell set avoids storing/processing vast empty space (Hashlife is the advanced form)." }),
  // CLI parser
  pm({ topicId: "lld_m14_t6", exerciseId: "lld_m14_t6_pm_1", position: 1, level: "medium", title: "Declare arguments",
    scenario: "Arguments should be…",
    options: ["Declared in a spec (Builder) the parser interprets", "Read by argv index everywhere in the code", "Hardcoded as constants", "Inferred at runtime randomly"], correct: "Declared in a spec (Builder) the parser interprets",
    explanation: "A declarative Argument spec (name/type/required/default/help) drives parsing, validation, and help generation." }),
  pm({ topicId: "lld_m14_t6", exerciseId: "lld_m14_t6_pm_2", position: 2, level: "medium", title: "Bad input",
    scenario: "`--port abc` (expects an integer) should…",
    options: ["Fail fast with a clear usage error", "Default silently to 0", "Crash with a stack trace", "Be ignored"], correct: "Fail fast with a clear usage error",
    explanation: "Type coercion + validation should fail before the program runs, with a clear message." }),
  pm({ topicId: "lld_m14_t6", exerciseId: "lld_m14_t6_pm_3", position: 3, level: "easy", title: "Help text",
    scenario: "The --help/usage text should be…",
    options: ["Auto-generated from the same argument spec", "Maintained by hand separately", "Omitted", "Printed only on crash"], correct: "Auto-generated from the same argument spec",
    explanation: "Generating help from the spec keeps it in sync with the actual arguments." }),
  // Validation framework
  pm({ topicId: "lld_m14_t7", exerciseId: "lld_m14_t7_pm_1", position: 1, level: "medium", title: "A rule is…",
    scenario: "Each validation rule (required, range, email) is best modelled as…",
    options: ["A Validator with a uniform validate() interface (Strategy)", "An if-statement inline at each call site", "A subclass of the entity", "A database constraint only"], correct: "A Validator with a uniform validate() interface (Strategy)",
    explanation: "A Validator-per-rule (Strategy) makes rules interchangeable, reusable, and Open–Closed for new rules." }),
  pm({ topicId: "lld_m14_t7", exerciseId: "lld_m14_t7_pm_2", position: 2, level: "hard", title: "Report errors",
    scenario: "A good validator returns…",
    options: ["ALL failures aggregated (so the user fixes everything at once)", "Only the first failure", "A single boolean", "An exception per field"], correct: "ALL failures aggregated (so the user fixes everything at once)",
    explanation: "Collect every error into a Result(valid, errors[]) rather than stopping at the first." }),
  pm({ topicId: "lld_m14_t7", exerciseId: "lld_m14_t7_pm_3", position: 3, level: "medium", title: "Combine rules",
    scenario: "Multiple rules per field, with AND/OR, are composed using…",
    options: ["Composite validators + a declarative field schema", "Copy-pasting checks", "A giant switch", "Inheritance only"], correct: "Composite validators + a declarative field schema",
    explanation: "Composite validators combine rules (AND/OR); a field→rules schema declares them per object." }),
  // Battleship
  pm({ topicId: "lld_m14_t8", exerciseId: "lld_m14_t8_pm_1", position: 1, level: "medium", title: "Placement",
    scenario: "Placing a ship must validate…",
    options: ["In-bounds, correct length/orientation, and no overlap", "Only that it's a ship", "Only the color", "Nothing"], correct: "In-bounds, correct length/orientation, and no overlap",
    explanation: "Placement is a constraint check: fit on the grid and don't overlap other ships." }),
  pm({ topicId: "lld_m14_t8", exerciseId: "lld_m14_t8_pm_2", position: 2, level: "hard", title: "Sunk detection",
    scenario: "To know when a ship is SUNK, you must…",
    options: ["Track hits per ship (all its cells hit → sunk)", "Count total hits on the grid", "Wait until the game ends", "Ask the opponent"], correct: "Track hits per ship (all its cells hit → sunk)",
    explanation: "A ship sinks when all its cells are hit; tracking per-ship cell hits (not just grid marks) detects it." }),
  pm({ topicId: "lld_m14_t8", exerciseId: "lld_m14_t8_pm_3", position: 3, level: "medium", title: "Game over",
    scenario: "A player wins when…",
    options: ["The opponent's entire fleet is sunk", "They get one hit", "They fire 10 shots", "Their own fleet is sunk"], correct: "The opponent's entire fleet is sunk",
    explanation: "Victory is destroying all opponent ships; the game State machine ends at GAME_OVER." }),
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
  console.log(`\nDone — M14 Case Studies VIII seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
