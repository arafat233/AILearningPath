/**
 * Seed — LLD module M11: Case Studies V (more OOD problems):
 * Music Player, Ride-Sharing (OOD), Cricket Scoreboard, Snake Game,
 * LFU Cache, Bowling scoring, Trie Autocomplete, File Download Manager.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases5.js   ·   npm: npm run seed:lld-cases5
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m11";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 11,
  name: "Case Studies V — More OOD", slug: "case-studies-5",
  description: "Eight more object-oriented designs: a Music Player, Ride-Sharing, a Cricket Scoreboard, the Snake Game, an LFU Cache, Bowling scoring, a Trie-based Autocomplete, and a multi-threaded File Download Manager.",
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
  T("lld_m11_t1", 1, "Design a Music Player", "design-music-player",
    ["case-study", "state", "strategy", "queue"],
    "Model a Spotify-style player: play/pause/next/previous, a playback queue, and shuffle & repeat modes. What patterns capture playback control and the play-order modes?",
    "Playback is a State machine (PLAYING/PAUSED/STOPPED) defining what controls do; the play queue is a list with a cursor; shuffle and repeat-one/repeat-all are pluggable play-ORDER Strategies that decide 'what plays next'. Entities: Song, Playlist, Queue, Player.",
    [
      { kind: "concept", heading: "Entities",
        body: "Song (metadata + source), Playlist (ordered Songs), and a play QUEUE (the runtime sequence with a current-index cursor) feeding a Player. Library/search sit on top. Keep Song immutable data; the Player holds runtime state." },
      { kind: "concept", heading: "Playback as a State machine",
        body: "The Player is a State machine: STOPPED, PLAYING, PAUSED. The same control behaves differently per state (play() from PAUSED resumes; from STOPPED starts; pause() only valid while PLAYING). The State pattern routes each control to the current state's behaviour instead of a tangle of if/else flags." },
      { kind: "concept", heading: "Shuffle/repeat as Strategy",
        body: "'What plays next?' depends on the mode: sequential, shuffle, repeat-one, repeat-all. Model these as an interchangeable play-order Strategy the queue consults for next()/previous() — swap modes at runtime without touching the player. Shuffle should be a real permutation (so you don't repeat until the list is exhausted), not random-each-time." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Add to queue / play next' (queue ops), 'crossfade/gapless' (player detail), 'Observer for now-playing UI + scrobbling' (notify listeners on track change), 'offline downloads'. Signal: Player State machine + play-order Strategy (shuffle/repeat) + a queue with a cursor; Song is immutable data." },
    ],
    "A music player tests State (playback) + Strategy (shuffle/repeat play-order) + a queue. The signal is routing controls through playback state and making play-order a swappable strategy, not flags.",
    ["Boolean flags (isPlaying/isShuffle) and nested if/else instead of State + Strategy.",
     "Re-randomising each next() instead of a real shuffle permutation.",
     "Baking shuffle/repeat logic into the Player rather than a pluggable strategy."],
    0.4, { type: "Player state", description: "Player State: STOPPED ⇄ PLAYING ⇄ PAUSED; controls route through current state. Play-order Strategy (sequential/shuffle/repeat) picks next track from the queue.", alt: "Music player state machine with a swappable play-order strategy." }),

  T("lld_m11_t2", 2, "Design Ride-Sharing (Uber OOD)", "design-ride-sharing-ood",
    ["case-study", "state", "strategy", "observer"],
    "Model Uber's objects: a rider requests a ride, a nearby driver is matched, and the trip moves through states with fare calculated at the end. What's the object model and which patterns?",
    "A Trip State machine (REQUESTED→DRIVER_ASSIGNED→IN_PROGRESS→COMPLETED, + CANCELLED) drives the lifecycle; a matching Strategy picks the driver (nearest/highest-rated); Observer pushes status to rider & driver; a pricing Strategy computes fare (base + distance + time + surge). Entities: Rider, Driver, Trip, Location.",
    [
      { kind: "concept", heading: "Entities",
        body: "Rider and Driver (a Driver has a Vehicle, current Location, and availability), a Trip linking them with pickup/dropoff, and Location (lat/lng). A DriverMatchingService finds candidates near the rider (a geospatial lookup — the proximity idea). Keep the Trip the aggregate that owns the ride's lifecycle." },
      { kind: "concept", heading: "Trip as a State machine",
        body: "Trip status: REQUESTED → DRIVER_ASSIGNED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED; CANCELLED from early states (by rider or driver, with policy). Each state allows specific actions (you can't start a trip before a driver is assigned). State pattern enforces legal transitions — the recurring lifecycle theme." },
      { kind: "concept", heading: "Matching & pricing as Strategy",
        body: "Driver matching is a pluggable Strategy (nearest, least-idle, highest-rated, ETA-optimised) so the algorithm evolves independently. Fare is a pricing Strategy: base fare + per-km + per-min + a surge multiplier (dynamic by demand/supply) + tolls. Both are swappable without touching the trip flow (Open–Closed)." },
      { kind: "concept", heading: "Notifications & follow-ups",
        body: "Observer/pub-sub pushes trip status + live driver location to the rider and driver apps. Follow-ups: 'driver declines / no driver' (re-match — Chain of Responsibility or retry/expand radius), 'pool/shared rides', 'cancellation fees', 'ratings', 'ETA'. Signal: Trip State machine + matching & pricing Strategies + Observer for updates + a geospatial driver lookup." },
    ],
    "Ride-sharing OOD composes a Trip State machine, matching + pricing Strategies, and Observer notifications, over a geospatial driver lookup. The signal is legal-transition enforcement and swappable matching/pricing.",
    ["Hardcoding matching/pricing instead of pluggable Strategies.",
     "Allowing illegal transitions (start a trip with no assigned driver).",
     "Polling for status instead of Observer/event updates."],
    0.5, { type: "Trip state", description: "Trip: REQUESTED → DRIVER_ASSIGNED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED; CANCELLED from early states. Matching + pricing Strategies; Observer updates rider & driver.", alt: "Ride-sharing trip state machine with matching and pricing strategies." }),

  T("lld_m11_t3", 3, "Design a Cricket Scoreboard (Cricbuzz)", "design-cricket-scoreboard",
    ["case-study", "observer", "state", "composite"],
    "Model live cricket scoring: balls accumulate into overs, overs into innings, with running totals, player stats, and live updates pushed to viewers. What patterns structure the hierarchy and the live feed?",
    "A Composite-like hierarchy (Match → Innings → Over → Ball) where each ball updates aggregated totals upward; Observer pushes every scoring event to viewers/commentary/UI; match progression (innings, powerplay, result) is a State machine. Entities: Match, Team, Player, Innings, Over, Ball.",
    [
      { kind: "concept", heading: "The scoring hierarchy",
        body: "A Ball is the atomic event (runs, extras: wide/no-ball/bye, wicket type, batsman/bowler). Balls compose into an Over (6 legal deliveries), Overs into an Innings, Innings into a Match — a part-whole hierarchy. Totals (score, wickets, run-rate) AGGREGATE upward: recording a ball updates the over, innings, match, and the involved players' stats. Model the aggregation explicitly rather than recomputing from scratch each ball." },
      { kind: "concept", heading: "Player & team stats",
        body: "Each Ball updates the striker's runs/balls-faced, the bowler's runs-conceded/wickets, and team totals. Derived metrics (strike rate, economy, run rate, required run rate) are computed from these accumulators. Keep stat objects per player updated incrementally as balls are recorded." },
      { kind: "concept", heading: "Live updates via Observer",
        body: "Thousands of viewers, scorecards, and commentary feeds need every scoring event. The scoreboard PUBLISHES a ball/score event; Observers (live UI, push notifications, commentary, stats widgets) subscribe — the board doesn't know who's listening. This is the same Observer/pub-sub used for notifications elsewhere, applied to a live feed." },
      { kind: "concept", heading: "Match flow & follow-ups",
        body: "Match progression is a State machine: NOT_STARTED → INNINGS_1 → INNINGS_BREAK → INNINGS_2 → COMPLETED (plus powerplay/DLS states), with end-of-innings and result logic. Follow-ups: 'rain/DLS', 'super over', 'multiple formats (T20/ODI/Test)' (Strategy for rules), 'undo a mis-scored ball' (Command/Memento). Signal: Composite scoring hierarchy with upward aggregation + Observer live feed + match State machine." },
    ],
    "A cricket scoreboard tests a Composite part-whole hierarchy (ball→over→innings→match) with upward aggregation, Observer for the live feed, and a match State machine. Undo-a-ball (Command/Memento) is a nice follow-up.",
    ["Recomputing all totals from scratch each ball instead of incremental upward aggregation.",
     "Polling for the score instead of Observer/event push to viewers.",
     "No match State machine, so innings/powerplay/result transitions are ad-hoc flags."],
    0.5),

  T("lld_m11_t4", 4, "Design the Snake Game", "design-snake-game",
    ["case-study", "queue", "state", "grid"],
    "Model the classic Snake game: a snake moves on a grid, grows on eating food, and dies on hitting a wall or itself. What data structure makes move/grow O(1) and how is collision checked fast?",
    "Represent the snake's body as a DEQUE of cells: each move adds a head and (unless it just ate) removes the tail — O(1). A HashSet of occupied body cells gives O(1) self-collision checks. Game progression is a State machine (RUNNING/PAUSED/GAME_OVER); direction is the current move vector.",
    [
      { kind: "concept", heading: "Body as a deque",
        body: "Store the snake body as a double-ended queue (deque) of (row,col) cells, head at one end, tail at the other. Each tick: compute the new head from the current direction, push it to the front; if the snake didn't eat, pop the tail. Eating food skips the tail-pop (the snake grows). Both ends mutate in O(1) — far better than shifting an array." },
      { kind: "concept", heading: "O(1) collision via a set",
        body: "Self-collision = does the new head land on an existing body cell? Scanning the body each tick is O(length); instead keep a HashSet of occupied cells in sync with the deque (add on push-head, remove on pop-tail) so the check is O(1). Wall collision is a bounds check on the head. This deque + set pairing is the crux of an efficient design." },
      { kind: "concept", heading: "Game state & input",
        body: "Game is a State machine: RUNNING, PAUSED, GAME_OVER. Direction is a current vector; reject a 180° reversal (can't turn directly back into the body). Food is placed on a random EMPTY cell (use the occupied-set to pick a free one). A fixed-tick game loop (see the Game Loop pattern) advances the world." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Multiple food / power-ups', 'increasing speed', 'multiplayer snakes' (more bodies + cross-collision), 'wrap-around walls'. Edge cases: eating food on the tail cell that's about to move (it's fine — tail vacates), filling the whole board (win). Signal: deque body for O(1) move/grow + occupied-set for O(1) collision + State machine + tick loop." },
    ],
    "Snake tests choosing the right structure: a deque for O(1) head-add/tail-remove (move/grow) plus a HashSet for O(1) collision, a direction vector (no instant reversal), and a RUNNING/PAUSED/GAME_OVER State machine on a tick loop.",
    ["Using an array and shifting all cells each move (O(length)) instead of a deque.",
     "Scanning the whole body for self-collision instead of a HashSet (O(1)).",
     "Allowing a direct 180° reversal into the snake's own neck."],
    0.4, { type: "Snake structure", description: "Body = deque of cells (push head, pop tail unless eating) + HashSet of occupied cells for O(1) collision. Direction vector; State: RUNNING/PAUSED/GAME_OVER on a tick loop.", alt: "Snake body as a deque plus an occupied-cells set for O(1) move and collision." }),

  T("lld_m11_t5", 5, "Design an LFU Cache", "design-lfu-cache",
    ["case-study", "cache", "data-structure", "eviction"],
    "Build a cache that evicts the LEAST-FREQUENTLY-used item (ties broken by least-recently-used), with O(1) get and put. LRU is one list — what structure gives O(1) LFU?",
    "Track a frequency count per key and group keys by frequency into buckets, each bucket an LRU list. A 'minFrequency' pointer finds the eviction bucket in O(1). get/put bump a key to the next frequency bucket in O(1). It's the frequency-aware cousin of the LRU cache.",
    [
      { kind: "concept", heading: "LFU vs LRU",
        body: "LRU evicts the item untouched longest; LFU evicts the item ACCESSED FEWEST TIMES (a one-time spike shouldn't evict a steadily-popular item). LFU needs per-key frequency counts and must, on eviction, find the minimum-frequency key fast — and among equal frequencies, evict the least-recently-used. Doing this in O(1) is the challenge." },
      { kind: "concept", heading: "The O(1) structure",
        body: "Three pieces: (1) keyToNode — key → its node (value + frequency); (2) freqToList — frequency → a doubly-linked list (an LRU order) of all keys at that frequency; (3) a minFreq integer. get/put increments a key's frequency: remove it from its current freq list, add to the (freq+1) list (at the MRU end). Eviction removes the LRU node from the freqToList[minFreq] list. All O(1)." },
      { kind: "concept", heading: "Maintaining minFreq",
        body: "On access, if the just-bumped key was the only one at minFreq, increment minFreq. On insert of a NEW key, set its frequency to 1 and reset minFreq=1 (a brand-new item is the new least-frequent). This pointer avoids scanning for the minimum, keeping eviction O(1)." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Tie-breaking' (LRU within a frequency bucket — that's why each bucket is an ordered list). 'Aging' (so old-but-once-hot items eventually decay — windowed/decayed LFU). 'Concurrency' (see the concurrent-cache design). 'LFU vs LRU choice' (workload-dependent; real caches like Caffeine use TinyLFU hybrids). Signal: keyToNode + freqToList(LRU per freq) + minFreq for O(1) get/put/evict." },
    ],
    "LFU cache tests a composite O(1) structure: per-key frequency + frequency-bucketed LRU lists + a minFreq pointer. The signal is bucketing by frequency (each bucket an LRU list) and maintaining minFreq for O(1) eviction.",
    ["Scanning for the minimum-frequency key on eviction (not O(1)).",
     "Ignoring the LRU tie-break within a frequency bucket.",
     "Forgetting to reset minFreq=1 when inserting a brand-new key."],
    0.6, { type: "LFU structure", description: "keyToNode (key→value,freq) + freqToList (freq→ LRU list of keys) + minFreq pointer. Access bumps a key to freq+1's list; evict the LRU of freqToList[minFreq]. All O(1).", alt: "LFU cache: frequency-bucketed LRU lists with a minFreq pointer for O(1) eviction." }),

  T("lld_m11_t6", 6, "Design Bowling Game Scoring", "design-bowling-scoring",
    ["case-study", "rules", "state", "strategy"],
    "Score a game of ten-pin bowling: 10 frames, with strikes and spares that add the NEXT one or two rolls as bonus, and a special 10th frame. How do you model frames and the look-ahead bonus cleanly?",
    "Model the game as a list of 10 Frames, each holding its rolls; scoring a frame is a rule: strike = 10 + next two rolls, spare = 10 + next roll, open = pin sum. Compute by walking the roll sequence with look-ahead. The 10th frame (up to 3 rolls) is the special case. Keep scoring rules separate from frame state.",
    [
      { kind: "concept", heading: "Model frames and rolls",
        body: "A Game has 10 Frames; each Frame records its roll(s). The cleanest representation for scoring is the linear sequence of rolls plus knowing where each frame starts, because strike/spare bonuses look FORWARD into the next frame's rolls. Track per-frame state (open / spare / strike / in-progress)." },
      { kind: "concept", heading: "The bonus rules",
        body: "Open frame (knocks < 10 in two rolls) = sum of its two rolls. SPARE (10 across two rolls) = 10 + the NEXT one roll. STRIKE (10 on the first roll) = 10 + the NEXT two rolls. So a frame's score can't be finalised until the needed future rolls exist — the defining subtlety. Total = sum of all ten frame scores." },
      { kind: "concept", heading: "Computing with look-ahead",
        body: "Walk the rolls frame by frame with an index: if the roll is a strike, add 10 + rolls[i+1] + rolls[i+2] and advance 1 roll; if a spare, add 10 + rolls[i+2] and advance 2; else add the two rolls and advance 2. The look-ahead into subsequent rolls is what encodes the bonus — no need to mutate earlier frames retroactively." },
      { kind: "concept", heading: "The 10th frame & follow-ups",
        body: "The 10th frame is special: a strike or spare there grants 1–2 BONUS rolls within the same frame (up to 3 rolls total) so the bonus has something to consume — handle it explicitly rather than reading past the array. Keep the scoring RULE separate from frame data (a strategy/rule object) so variants (no-tap, low-ball) plug in. Signal: frames + roll sequence + forward-looking strike/spare bonus + special 10th frame." },
    ],
    "Bowling scoring is the classic kata testing clean rule modelling: frames over a roll sequence, forward-looking strike (+next 2) / spare (+next 1) bonuses, and the special 3-roll 10th frame. Keep rules separate from frame state.",
    ["Mutating earlier frames retroactively instead of forward look-ahead on the roll sequence.",
     "Mishandling the special 10th frame (reading past the array for the bonus).",
     "Tangling scoring rules into the Frame instead of a separate rule/strategy."],
    0.5),

  T("lld_m11_t7", 7, "Design a Trie Autocomplete", "design-trie-autocomplete",
    ["case-study", "trie", "data-structure", "ranking"],
    "Build typeahead: as the user types a prefix, return the top suggestions instantly. Scanning all terms per keystroke is too slow. What structure indexes by prefix, and how do you rank?",
    "A TRIE (prefix tree): each node is a character, a path is a prefix, and terminal nodes mark complete words. Navigate to the prefix node, then collect completions in its subtree — ranked by frequency (cache the top-K per node for O(1) suggestions). It's the canonical prefix-search structure.",
    [
      { kind: "concept", heading: "Why a trie",
        body: "Autocomplete is prefix matching: 'find all terms starting with cat'. A hashmap can't do prefixes; scanning all terms per keystroke is O(N·len). A TRIE stores characters along paths so a shared prefix is stored once and reaching a prefix is O(len of prefix) — independent of how many terms exist. This is the structure for typeahead, spell-check, and IP routing." },
      { kind: "concept", heading: "Structure & operations",
        body: "Each TrieNode has children keyed by character and an isWord flag (and often a stored term/frequency). insert(word) walks/creates a node per character, marking the last isWord. To autocomplete a prefix: walk to the prefix's node (or return empty if the path breaks), then DFS its subtree collecting all isWord descendants — those are the completions." },
      { kind: "concept", heading: "Ranking the suggestions",
        body: "You want the most useful completions, not all. Attach a frequency/score to each term and return the top-K. Collecting the whole subtree then sorting is wasteful for hot prefixes — instead CACHE the top-K completions at each node (precomputed) so a query is O(1) after locating the prefix. This is how production typeahead serves suggestions in single-digit ms." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Memory' (a trie can be large → compress with a radix/PATRICIA tree merging single-child chains). 'Personalised/recent' (blend a user's history). 'Typos' (fuzzy match — edit distance over the trie). 'Update frequencies' (from search logs — the streaming-aggregation idea). 'Distributed' (shard by first letters; see the system-design typeahead). Signal: trie for O(len) prefix lookup + top-K cached per node for ranking." },
    ],
    "Trie autocomplete tests the prefix-tree structure: O(len) prefix navigation then subtree collection, with top-K cached per node for fast ranked suggestions. Radix compression and fuzzy matching are common follow-ups.",
    ["Scanning all terms per keystroke instead of a trie (O(len) prefix lookup).",
     "Collecting and sorting the whole subtree per query instead of caching top-K per node.",
     "Using a plain hashmap (can't do prefix queries)."],
    0.5, { type: "Trie", description: "Prefix tree: each node = a char, path = a prefix, terminal node = a complete word. Navigate to the prefix node, collect/rank completions in its subtree (top-K cached).", alt: "A trie where paths spell prefixes and terminal nodes mark complete words." }),

  T("lld_m11_t8", 8, "Design a File Download Manager", "design-download-manager",
    ["case-study", "concurrency", "state", "observer"],
    "Build a download manager: download big files in parallel CHUNKS, show progress, and pause/resume/cancel — even resuming after the app restarts. What patterns model a download and its concurrency?",
    "Split a file into byte-range CHUNKS downloaded in parallel by a worker/thread pool (HTTP Range requests), tracking each chunk's completion so a resume only refetches missing chunks. A download is a State machine (QUEUED/DOWNLOADING/PAUSED/COMPLETED/FAILED); Observer reports progress; persist chunk state for restart-resume.",
    [
      { kind: "concept", heading: "Parallel chunked download",
        body: "A large file downloads faster as parallel CHUNKS: split into byte ranges and fetch each with an HTTP Range request (bytes=start-end), writing each into the right file offset. A thread/worker POOL (the Producer-Consumer / Thread Pool patterns) bounds concurrency. Track which chunks are done so progress = completed bytes / total." },
      { kind: "concept", heading: "Download as a State machine",
        body: "Each download is a State machine: QUEUED → DOWNLOADING → (PAUSED ⇄ DOWNLOADING) → COMPLETED, or → FAILED (→ retry). Controls (pause/resume/cancel) are only valid in certain states; State routes them correctly. Pause stops issuing new chunk requests; resume re-dispatches only the not-yet-completed chunks." },
      { kind: "concept", heading: "Resume = persisted chunk state",
        body: "True resume (even after a crash/restart) requires PERSISTING per-chunk completion (a metadata file alongside the partial download). On resume, re-request only the missing ranges — never restart from zero. Requires the server to support Range requests; otherwise fall back to a single stream. Verify integrity (checksum) on completion." },
      { kind: "concept", heading: "Progress & follow-ups",
        body: "Observer/listeners report progress, speed, and ETA to the UI without the download knowing the UI. A scheduler/queue manages many downloads with a max-concurrent limit (and priorities). Follow-ups: 'bandwidth throttling', 'retry with backoff per chunk', 'integrity check', 'mirror/multi-source'. Signal: chunked Range downloads on a thread pool + per-download State machine + persisted chunk state for resume + Observer progress." },
    ],
    "A download manager tests concurrency + lifecycle: parallel byte-range chunks on a thread pool, a per-download State machine for pause/resume/cancel, persisted chunk state for crash-safe resume, and Observer progress reporting.",
    ["Restarting downloads from zero instead of resuming missing chunks (no persisted chunk state).",
     "Unbounded threads instead of a bounded worker pool.",
     "Tangling pause/resume/cancel as flags rather than a State machine; assuming the server supports Range without a fallback."],
    0.6, { type: "Download state", description: "File → byte-range chunks on a thread pool (HTTP Range). Download State: QUEUED → DOWNLOADING ⇄ PAUSED → COMPLETED / FAILED. Chunk state persisted for resume; Observer reports progress.", alt: "Download manager: parallel chunks on a thread pool with a pause/resume state machine." }),
];

const EXERCISES = [
  // Music player
  pm({ topicId: "lld_m11_t1", exerciseId: "lld_m11_t1_pm_1", position: 1, level: "medium", title: "Controls",
    scenario: "play()/pause()/stop() behaving differently depending on current playback status is best modelled with…",
    options: ["The State pattern (PLAYING/PAUSED/STOPPED)", "Boolean flags and nested if/else", "A Singleton", "A Visitor"], correct: "The State pattern (PLAYING/PAUSED/STOPPED)",
    explanation: "State routes each control to the current state's behaviour, avoiding a tangle of flags." }),
  pm({ topicId: "lld_m11_t1", exerciseId: "lld_m11_t1_pm_2", position: 2, level: "medium", title: "Shuffle/repeat",
    scenario: "Shuffle and repeat-one/repeat-all (deciding what plays next) are best modelled as…",
    options: ["A pluggable play-order Strategy", "Hardcoded in the Player", "A Decorator on Song", "A Memento"], correct: "A pluggable play-order Strategy",
    explanation: "A play-order Strategy lets you swap sequential/shuffle/repeat at runtime without changing the player." }),
  pm({ topicId: "lld_m11_t1", exerciseId: "lld_m11_t1_pm_3", position: 3, level: "easy", title: "Good shuffle",
    scenario: "Shuffle should…",
    options: ["Produce a permutation (no repeats until the list is exhausted)", "Pick a random track each time (may repeat immediately)", "Always play track 1", "Reverse the list"], correct: "Produce a permutation (no repeats until the list is exhausted)",
    explanation: "A real shuffle is a permutation so songs don't repeat until all have played." }),
  // Ride-sharing
  pm({ topicId: "lld_m11_t2", exerciseId: "lld_m11_t2_pm_1", position: 1, level: "medium", title: "Trip lifecycle",
    scenario: "Ensuring a trip can't start IN_PROGRESS before a driver is assigned uses…",
    options: ["A Trip State machine with legal transitions", "A status string with no checks", "A boolean isStarted", "Sorting trips by time"], correct: "A Trip State machine with legal transitions",
    explanation: "The State pattern enforces REQUESTED→ASSIGNED→IN_PROGRESS→COMPLETED, rejecting illegal jumps." }),
  pm({ topicId: "lld_m11_t2", exerciseId: "lld_m11_t2_pm_2", position: 2, level: "medium", title: "Surge fare",
    scenario: "Computing fare = base + distance + time + surge, with the formula swappable, is a…",
    options: ["Pricing Strategy", "Singleton", "Adapter", "Composite"], correct: "Pricing Strategy",
    explanation: "A pricing Strategy isolates the fare formula so surge/promo variants plug in without touching the trip." }),
  pm({ topicId: "lld_m11_t2", exerciseId: "lld_m11_t2_pm_3", position: 3, level: "medium", title: "Find a driver",
    scenario: "Matching the nearest available driver to a rider relies on…",
    options: ["A geospatial lookup + a pluggable matching Strategy", "Scanning every driver globally each request", "A random driver", "A Singleton dispatcher with fixed logic"], correct: "A geospatial lookup + a pluggable matching Strategy",
    explanation: "A geo index finds nearby drivers; a matching Strategy (nearest/rated/ETA) picks one and can evolve independently." }),
  // Cricket scoreboard
  pm({ topicId: "lld_m11_t3", exerciseId: "lld_m11_t3_pm_1", position: 1, level: "medium", title: "Hierarchy",
    scenario: "Ball → Over → Innings → Match with totals rolling upward is a…",
    options: ["Composite-style part-whole hierarchy with upward aggregation", "Flat list of balls only", "A single counter", "A queue"], correct: "Composite-style part-whole hierarchy with upward aggregation",
    explanation: "Recording a ball aggregates into over/innings/match totals — a part-whole hierarchy, updated incrementally." }),
  pm({ topicId: "lld_m11_t3", exerciseId: "lld_m11_t3_pm_2", position: 2, level: "medium", title: "Live feed",
    scenario: "Pushing every scoring event to thousands of viewers/commentary/UI uses…",
    options: ["Observer / pub-sub", "Each viewer polling a DB", "A Singleton", "A Visitor"], correct: "Observer / pub-sub",
    explanation: "The scoreboard publishes ball/score events; viewers subscribe — decoupled live updates." }),
  pm({ topicId: "lld_m11_t3", exerciseId: "lld_m11_t3_pm_3", position: 3, level: "medium", title: "Efficient totals",
    scenario: "How should running totals (score, run-rate, player stats) be maintained?",
    options: ["Incrementally as each ball is recorded", "Recomputed from all balls every update", "Only at innings end", "Estimated"], correct: "Incrementally as each ball is recorded",
    explanation: "Update accumulators per ball; recomputing from scratch each ball is wasteful." }),
  // Snake
  pm({ topicId: "lld_m11_t4", exerciseId: "lld_m11_t4_pm_1", position: 1, level: "hard", title: "Body structure",
    scenario: "For O(1) move and grow, the snake body should be a…",
    options: ["Deque (push head, pop tail unless eating)", "Array shifted each move", "Sorted set", "Linked list scanned each tick"], correct: "Deque (push head, pop tail unless eating)",
    explanation: "A deque adds a head and removes a tail in O(1); eating skips the tail-pop to grow." }),
  pm({ topicId: "lld_m11_t4", exerciseId: "lld_m11_t4_pm_2", position: 2, level: "hard", title: "Collision check",
    scenario: "Checking self-collision in O(1) per tick uses…",
    options: ["A HashSet of occupied body cells kept in sync with the deque", "Scanning the whole body each tick", "Sorting the cells", "Nothing — collisions are rare"], correct: "A HashSet of occupied body cells kept in sync with the deque",
    explanation: "An occupied-cells set gives O(1) 'is the new head on the body?'; scanning is O(length)." }),
  pm({ topicId: "lld_m11_t4", exerciseId: "lld_m11_t4_pm_3", position: 3, level: "medium", title: "Direction rule",
    scenario: "Which input must be rejected?",
    options: ["A direct 180° reversal into the snake's neck", "Turning left", "Turning right", "Continuing straight"], correct: "A direct 180° reversal into the snake's neck",
    explanation: "Reversing directly back would collide with the body immediately, so it's disallowed." }),
  // LFU
  pm({ topicId: "lld_m11_t5", exerciseId: "lld_m11_t5_pm_1", position: 1, level: "hard", title: "O(1) eviction",
    scenario: "To evict the least-frequently-used key in O(1), the structure is…",
    options: ["Frequency-bucketed LRU lists + a minFreq pointer", "A sorted list of keys by frequency", "A single LRU list", "A max-heap of frequencies"], correct: "Frequency-bucketed LRU lists + a minFreq pointer",
    explanation: "Bucket keys by frequency (each bucket an LRU list); minFreq locates the eviction bucket in O(1)." }),
  pm({ topicId: "lld_m11_t5", exerciseId: "lld_m11_t5_pm_2", position: 2, level: "medium", title: "Tie-break",
    scenario: "Among keys with the same (minimum) frequency, which is evicted?",
    options: ["The least-recently-used (LRU within the bucket)", "The most-recently-used", "A random one", "The largest value"], correct: "The least-recently-used (LRU within the bucket)",
    explanation: "Each frequency bucket is an LRU list, so ties break by least-recently-used." }),
  pm({ topicId: "lld_m11_t5", exerciseId: "lld_m11_t5_pm_3", position: 3, level: "medium", title: "New key",
    scenario: "When a brand-new key is inserted, minFreq should be…",
    options: ["Reset to 1 (the new key is the least frequent)", "Left unchanged", "Set to the max frequency", "Incremented"], correct: "Reset to 1 (the new key is the least frequent)",
    explanation: "A new key has frequency 1, so it's now the least frequent — minFreq becomes 1." }),
  // Bowling
  pm({ topicId: "lld_m11_t6", exerciseId: "lld_m11_t6_pm_1", position: 1, level: "hard", title: "Strike bonus",
    scenario: "A strike's frame score is…",
    options: ["10 + the next two rolls", "10 only", "10 + the next one roll", "The pins in that frame only"], correct: "10 + the next two rolls",
    explanation: "A strike scores 10 plus the next two rolls; a spare scores 10 plus the next one roll." }),
  pm({ topicId: "lld_m11_t6", exerciseId: "lld_m11_t6_pm_2", position: 2, level: "medium", title: "Computing it",
    scenario: "Strike/spare bonuses are computed by…",
    options: ["Forward look-ahead into subsequent rolls", "Mutating earlier frames retroactively", "Guessing the bonus", "Ignoring them"], correct: "Forward look-ahead into subsequent rolls",
    explanation: "Walk the roll sequence and look ahead 1–2 rolls for the bonus; no retroactive frame mutation needed." }),
  pm({ topicId: "lld_m11_t6", exerciseId: "lld_m11_t6_pm_3", position: 3, level: "medium", title: "10th frame",
    scenario: "Why is the 10th frame special?",
    options: ["A strike/spare there grants 1–2 bonus rolls within the frame (up to 3 rolls)", "It's worth double", "It can't be a strike", "It has no scoring"], correct: "A strike/spare there grants 1–2 bonus rolls within the frame (up to 3 rolls)",
    explanation: "The 10th frame gives extra rolls so the strike/spare bonus has rolls to consume — handle it explicitly." }),
  // Trie autocomplete
  pm({ topicId: "lld_m11_t7", exerciseId: "lld_m11_t7_pm_1", position: 1, level: "medium", title: "Prefix structure",
    scenario: "The structure for 'all terms starting with this prefix' is a…",
    options: ["Trie (prefix tree)", "HashMap", "Sorted array scanned per keystroke", "Binary heap"], correct: "Trie (prefix tree)",
    explanation: "A trie reaches a prefix in O(len) regardless of term count; a hashmap can't do prefix queries." }),
  pm({ topicId: "lld_m11_t7", exerciseId: "lld_m11_t7_pm_2", position: 2, level: "hard", title: "Fast ranking",
    scenario: "Returning the top-K suggestions for a hot prefix in O(1) (after locating it) uses…",
    options: ["Top-K completions cached at each node", "Sorting the whole subtree per query", "A random sample", "Scanning all words"], correct: "Top-K completions cached at each node",
    explanation: "Precomputing/caching top-K per node avoids collecting and sorting the subtree on every keystroke." }),
  pm({ topicId: "lld_m11_t7", exerciseId: "lld_m11_t7_pm_3", position: 3, level: "medium", title: "Shrink memory",
    scenario: "To reduce a large trie's memory, you can…",
    options: ["Compress single-child chains (radix/PATRICIA tree)", "Delete rare words only", "Use a hashmap instead", "Store everything twice"], correct: "Compress single-child chains (radix/PATRICIA tree)",
    explanation: "A radix tree merges single-child chains into one edge, cutting node count for sparse prefixes." }),
  // Download manager
  pm({ topicId: "lld_m11_t8", exerciseId: "lld_m11_t8_pm_1", position: 1, level: "hard", title: "Parallel download",
    scenario: "Downloading a large file faster in parallel uses…",
    options: ["Byte-range chunks (HTTP Range) on a bounded thread pool", "One giant request on the main thread", "Unbounded threads, one per byte", "Downloading sequentially"], correct: "Byte-range chunks (HTTP Range) on a bounded thread pool",
    explanation: "Range requests fetch chunks in parallel; a bounded thread pool caps concurrency (Thread Pool/Producer-Consumer)." }),
  pm({ topicId: "lld_m11_t8", exerciseId: "lld_m11_t8_pm_2", position: 2, level: "hard", title: "Resume after restart",
    scenario: "Resuming a download after the app crashes — without restarting from zero — requires…",
    options: ["Persisting per-chunk completion and refetching only missing ranges", "Keeping the partial file only", "Restarting the whole download", "Caching the URL"], correct: "Persisting per-chunk completion and refetching only missing ranges",
    explanation: "Persisted chunk state lets resume re-request just the missing byte ranges (server must support Range)." }),
  pm({ topicId: "lld_m11_t8", exerciseId: "lld_m11_t8_pm_3", position: 3, level: "medium", title: "Pause/resume",
    scenario: "Pause/resume/cancel being valid only in certain states is modelled with…",
    options: ["A per-download State machine", "Three booleans", "A Singleton", "A Decorator"], correct: "A per-download State machine",
    explanation: "A State machine (QUEUED/DOWNLOADING/PAUSED/COMPLETED/FAILED) makes each control valid only where it should be." }),
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
  console.log(`\nDone — M11 Case Studies V seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
