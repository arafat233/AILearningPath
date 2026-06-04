/**
 * Seed — LLD module M22: Games & Puzzles III:
 * Uno, Checkers, Chess Clock, Word Ladder Solver, Trivia/Quiz Engine,
 * Mancala, Sudoku Generator, Crossword Generator/Solver.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases16.js   ·   npm: npm run seed:lld-cases16
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m22";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 22,
  name: "Games & Puzzles III", slug: "games-puzzles-3",
  description: "Design eight more games and puzzles: Uno, Checkers, a chess clock, a word-ladder solver, a trivia/quiz engine, Mancala, a Sudoku generator, and a crossword generator/solver.",
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
  T("lld_m22_t1", 1, "Design Uno", "design-uno",
    ["case-study", "card-game", "state", "rules"],
    "Model Uno: players match the top discard by color or number, with action cards (Skip, Reverse, Draw Two, Wild, Wild Draw Four) that change turn flow. What carries turn order, and how do special cards fit cleanly?",
    "A draw pile + discard pile; each Card has a color + type. A play is valid if it matches the top card's color/number or is a Wild. Turn order is a DIRECTION (+1/−1) that Reverse flips and Skip advances; Draw cards force the next player to draw (and lose their turn). Model card EFFECTS polymorphically (each card type applies its effect) instead of a giant switch. Game is a State machine; first to empty their hand wins.",
    [
      { kind: "concept", heading: "Cards, piles, and a valid play",
        body: "Each Card has a COLOR (red/yellow/green/blue, or wild) and a TYPE (number 0–9, Skip, Reverse, Draw Two, Wild, Wild Draw Four). There's a DRAW pile and a DISCARD pile (top card is what you match). A play is VALID if the card matches the top card's COLOR or NUMBER/symbol, or is a WILD (always playable; the player then chooses the new color). If you can't play, you draw. Keep the deck composition correct (counts per card type)." },
      { kind: "concept", heading: "Turn order: direction + skip",
        body: "Turn flow is the interesting part: maintain a current player index and a DIRECTION (+1 or −1). REVERSE flips the direction; SKIP advances an extra step (next player loses their turn). Compute 'next player' from index + direction (mod player count). In 2-player games Reverse acts like Skip. This direction/skip model handles turn changes cleanly instead of ad-hoc index juggling." },
      { kind: "concept", heading: "Action cards as polymorphic effects",
        body: "Don't write a giant switch on card type in the turn loop. Model each ACTION card's effect polymorphically (a card knows how to apply its effect to the game): Skip advances turn, Reverse flips direction, Draw Two makes the next player draw 2 + lose turn, Wild sets color, Wild Draw Four sets color + next draws 4. This Strategy/polymorphism keeps adding card types Open–Closed (the deck/Monopoly lesson)." },
      { kind: "concept", heading: "Game flow & follow-ups",
        body: "Game State: deal 7 cards each; players take turns playing/drawing; when the draw pile empties, reshuffle the discard. A player with one card must call 'UNO'. First to empty their hand WINS (score the round). Follow-ups: 'Draw-Two/Draw-Four stacking (a house rule)', 'challenge a Wild Draw Four', 'AI player'. Signal: color/number/wild match rules + turn DIRECTION + Skip + polymorphic action-card effects (not a switch) + reshuffle discard + win on empty hand.",
      },
    ],
    "Uno tests turn-flow + polymorphic rules: match by color/number/wild, a turn DIRECTION (+1/−1) that Reverse flips and Skip advances, and action-card EFFECTS modeled polymorphically (not a giant switch — Open–Closed), with discard reshuffle and win-on-empty-hand. It's the deck/Monopoly polymorphism lesson applied to turn manipulation.",
    ["A giant switch on card type instead of polymorphic action-card effects.",
     "Ad-hoc next-player logic instead of an index + direction (+1/−1) with Skip handling.",
     "Forgetting wild-color selection or reshuffling the discard pile when the draw pile empties."],
    0.5, { type: "Uno flow", description: "Play matches top card's color/number, or Wild (choose color). Turn = index + DIRECTION (±1); Reverse flips direction, Skip advances extra, Draw Two/Four force next to draw + lose turn. Action cards apply their own effect (polymorphic). Win: empty hand.", alt: "Uno: color/number/wild matching with a turn-direction model and polymorphic action cards." }),

  T("lld_m22_t2", 2, "Design Checkers (Draughts)", "design-checkers",
    ["case-study", "board", "rules", "move-generation"],
    "Model Checkers: pieces move diagonally, CAPTURE by jumping an opponent, can chain MULTIPLE jumps in one turn, and become KINGS at the far row. What's tricky about move generation, and the forced-capture rule?",
    "An 8×8 board with men (move/capture diagonally forward) and KINGS (both directions). Move generation must find simple diagonal moves AND captures (jump over an adjacent opponent to an empty square), and crucially handle MULTI-JUMP chains (a capture that can continue must, recursively). Many variants enforce FORCED CAPTURE (if any capture exists, you must take one). Promote to king at the last row. State machine for turns/win.",
    [
      { kind: "concept", heading: "Board & pieces",
        body: "An 8×8 board, pieces on dark squares. A MAN moves one square DIAGONALLY forward; a KING moves diagonally in BOTH directions. CAPTURE: jump diagonally OVER an adjacent opponent piece to the empty square beyond, removing the jumped piece. Track each piece's color + king status. Movement is diagonal-only, which simplifies the geometry but the capture rules are where the complexity lives." },
      { kind: "concept", heading: "Multi-jump chains (the tricky part)",
        body: "The defining subtlety: after a capture, if the SAME piece can capture AGAIN from its new position, it MUST continue jumping in the same turn (a multi-jump chain). So generating a capture move is RECURSIVE — explore all continuation jumps to build complete capture sequences. A turn may remove several opponent pieces. Getting this recursion (and the 'a king can change direction mid-chain') right is the main challenge." },
      { kind: "concept", heading: "Forced capture & move generation",
        body: "Most rule sets enforce FORCED CAPTURE: if any capture is available to the player, they MUST make a capturing move (you can't play a simple move instead). So move generation first finds all captures; if any exist, only captures are legal; otherwise simple diagonal moves are legal. This 'captures take precedence' rule shapes legal-move generation — a common point candidates miss." },
      { kind: "concept", heading: "Promotion, win & follow-ups",
        body: "A man reaching the opponent's FAR row is PROMOTED to a KING (gaining backward movement). The game is a State machine (turns alternate); a player LOSES when they have no pieces or no legal moves. Follow-ups: 'AI (minimax/alpha-beta — diagonal board)', 'variant rules (flying kings, must-capture-max)', 'draw detection'. Signal: diagonal moves (men forward, kings both) + recursive multi-jump capture chains + forced-capture move generation + promotion at the far row + win on no-pieces/no-moves.",
      },
    ],
    "Checkers tests move generation with recursive multi-jump capture chains (a piece that can keep jumping must), forced-capture rules (captures take precedence over simple moves), diagonal movement (men forward, kings both ways), and promotion at the far row. The recursive capture chains + forced-capture are the tricky parts; AI uses minimax.",
    ["Not handling multi-jump chains (a capture that can continue must) — the recursive capture rule.",
     "Ignoring forced capture (a player must capture if able) in legal-move generation.",
     "Forgetting king promotion / kings moving both diagonal directions."],
    0.5),

  T("lld_m22_t3", 3, "Design a Chess Clock", "design-chess-clock",
    ["case-study", "timer", "state", "time-control"],
    "Model a two-player chess clock: each player has their own countdown that runs only on their turn; pressing your side stops your clock and starts the opponent's. Add increment/delay time controls. What state, and the timing subtlety?",
    "Two per-player time BUDGETS; exactly ONE clock runs at a time (the active player's), counting down. PRESSING your button stops your clock and switches the active clock to the opponent. A player LOSES (flag falls) when their time hits 0. Add time-control STRATEGIES: increment (Fibonacci/Bronstein — add time per move) or delay. Compute remaining time from a start timestamp (don't busy-tick); State: which clock is active / game over.",
    [
      { kind: "concept", heading: "Two clocks, one active",
        body: "A chess clock is two independent COUNTDOWN timers (one per player) where EXACTLY ONE runs at any moment — the active player's. The other is paused. When a player completes their move and PRESSES their side, their clock STOPS and the opponent's STARTS. So the core state is: each player's remaining time + which clock is currently ACTIVE (or none, if paused/over). Only the active player's time decreases." },
      { kind: "concept", heading: "Measuring time correctly",
        body: "Don't implement it as a busy-loop ticking down every millisecond. Instead, when a clock becomes active, record a START TIMESTAMP; remaining time = stored budget − (now − start). On press, compute elapsed, deduct it from the active player's budget, and start the other clock's timestamp. This timestamp-based approach (the same lazy-time technique as the token-bucket and cron designs) is accurate and avoids drift/busy-waiting. A UI may poll to display." },
      { kind: "concept", heading: "Flag fall (losing on time)",
        body: "A player LOSES on time ('flag falls') when their remaining time reaches 0 WHILE their clock is active. The system must detect this promptly (on press, or via a check while active) and end the game. Edge cases: pressing exactly at zero, and (in real chess) you only lose on time if the opponent has mating material. The clock enforces the time limit independent of the board." },
      { kind: "concept", heading: "Time controls & follow-ups",
        body: "Support TIME-CONTROL variants as a Strategy: SUDDEN DEATH (fixed time), INCREMENT (Fischer — add N seconds after each move), DELAY (Bronstein/simple delay — a grace period before the clock starts deducting), and multi-stage (X moves in Y minutes, then more). Model the per-move time adjustment as a pluggable rule applied on press. Follow-ups: 'pausing', 'spectator display', 'multi-player game clocks (Go/Shogi byo-yomi)'. Signal: two budgets + exactly-one-active clock + timestamp-based remaining-time computation (no busy tick) + flag-fall loss detection + pluggable time-control Strategy (increment/delay).",
      },
    ],
    "A chess clock tests two per-player budgets with exactly one active clock, timestamp-based remaining-time computation (not busy-ticking — the token-bucket/cron lazy-time technique), flag-fall loss detection, and pluggable time-control Strategies (increment/delay). Pressing stops your clock and starts the opponent's.",
    ["Busy-looping to tick down instead of computing remaining time from a start timestamp.",
     "Letting both clocks run / not switching active clock on press.",
     "Not detecting flag-fall (time hitting 0 while active) or hardcoding one time control instead of a Strategy."],
    0.4),

  T("lld_m22_t4", 4, "Design a Word Ladder Solver", "design-word-ladder",
    ["case-study", "graph", "bfs", "shortest-path"],
    "Model a Word Ladder: transform a start word into an end word by changing ONE letter at a time, each intermediate a valid dictionary word, in the FEWEST steps. Why is this a graph problem, and which search finds the shortest ladder?",
    "Model words as GRAPH nodes with an EDGE between two words that differ by exactly ONE letter (and are both in the dictionary). The shortest ladder is the SHORTEST PATH from start to end → use BFS (unweighted graph, level order). Build neighbors efficiently with wildcard PATTERNS (c*t groups cat/cot/cut) instead of comparing all word pairs. Track parents to reconstruct the path.",
    [
      { kind: "concept", heading: "It's a graph shortest-path",
        body: "The key reframing: each valid WORD is a NODE; there's an EDGE between two words if they differ by exactly ONE letter (and both are in the dictionary). A word ladder is then a PATH through this graph, and the shortest ladder is the SHORTEST PATH from start to end. Recognizing 'one-letter-change transforms' as graph edges turns a word puzzle into a standard graph problem — the central insight." },
      { kind: "concept", heading: "BFS for the shortest ladder",
        body: "Since the graph is UNWEIGHTED (each step costs 1), BFS finds the shortest path: explore level by level from the start word; the first time you reach the end word, you've found the minimum number of steps (the graph-ADT lesson — BFS = shortest unweighted path). DFS would find A ladder but not the shortest. Mark visited words to avoid cycles/re-expansion." },
      { kind: "concept", heading: "Building neighbors efficiently",
        body: "Naively finding a word's neighbors by comparing it to EVERY dictionary word is O(N·L) per word — slow. Instead use WILDCARD PATTERNS: for a word like 'cat', generate patterns *at, c*t, ca* and pre-index dictionary words by these patterns (a map pattern → words). Words sharing a pattern differ by one letter — so a word's neighbors are the union of words under its patterns. This precomputed adjacency makes BFS fast." },
      { kind: "concept", heading: "Path reconstruction & follow-ups",
        body: "To return the actual ladder (not just its length), track each visited word's PARENT during BFS, then backtrack from end to start. Follow-ups: 'all shortest ladders (BFS building a DAG of parents)', 'bidirectional BFS (search from both ends — much faster)', 'A* with a letter-difference heuristic'. Signal: words as graph nodes, one-letter-change edges (built via wildcard patterns), BFS for the shortest path + parent tracking for the ladder; bidirectional BFS optimizes.",
      },
    ],
    "A word ladder is a graph shortest-path: words are nodes, one-letter-change edges (built efficiently via wildcard patterns, not all-pairs), and BFS finds the fewest-step ladder (unweighted), with parent tracking to reconstruct it. Bidirectional BFS is the big optimization; recognizing it as a graph problem is the key.",
    ["Not modeling it as a graph (words=nodes, one-letter-change=edges) shortest-path.",
     "Using DFS (finds A ladder, not the shortest) instead of BFS on the unweighted graph.",
     "Finding neighbors by comparing all word pairs instead of wildcard-pattern indexing."],
    0.5, { type: "Word ladder", description: "Words = nodes; edge between words differing by ONE letter (built via wildcard patterns c*t). Shortest ladder = shortest path → BFS (level order, mark visited). Track parents to reconstruct the ladder. Bidirectional BFS = faster.", alt: "Word ladder as a graph: one-letter-change edges searched with BFS for the shortest path." }),

  T("lld_m22_t5", 5, "Design a Trivia / Quiz Game Engine", "design-quiz-engine",
    ["case-study", "state", "real-time", "scoring"],
    "Model a multiplayer trivia game (Kahoot-style): a host runs rounds of questions, players answer within a time limit, and scores reward correctness AND speed. What's the round lifecycle, and how is scoring fair under simultaneous answers?",
    "A game is a State machine of ROUNDS: SHOW_QUESTION → ACCEPTING_ANSWERS (timed) → REVEAL → SCOREBOARD → next. Each question has options + the correct answer; players submit answers tied to a SERVER timestamp. SCORING rewards correctness + SPEED (faster correct = more points). Answers are recorded server-side (don't trust client timing); real-time push (the realtime-fanout idea) syncs all players. Leaderboard tracks cumulative scores.",
    [
      { kind: "concept", heading: "Question & game model",
        body: "A Quiz is an ordered set of QUESTIONS, each with the prompt, ANSWER OPTIONS, the correct answer, a time limit, and point value. A Game instance runs a quiz for a set of PLAYERS, tracking each player's cumulative SCORE and their per-question answers. Separate the question content (reusable quiz) from the live game session (players + scores + current state)." },
      { kind: "concept", heading: "Round lifecycle (State machine)",
        body: "Each question is a ROUND progressing through states: SHOW_QUESTION (display, maybe a countdown) → ACCEPTING_ANSWERS (a timed window — players submit) → LOCKED/REVEAL (show the correct answer + who got it) → SCOREBOARD (updated standings) → advance to the next question. The State machine enforces that answers are only accepted during the window (late answers rejected). The host (or a timer) drives transitions." },
      { kind: "concept", heading: "Fair scoring & server authority",
        body: "Scoring rewards CORRECTNESS and often SPEED (faster correct answers earn more — a decay from the question start). The crux: timing must be SERVER-authoritative — record each answer with a SERVER-side receipt time, not a client-reported time (clients lie / have variable latency). Compute speed bonus from server time. Ties broken consistently. Recording answers server-side also prevents changing an answer after seeing others." },
      { kind: "concept", heading: "Real-time & follow-ups",
        body: "Many players answer SIMULTANEOUSLY and all need synchronized state (question appears together, results revealed together) → real-time PUSH to all players (the Slack/realtime-fanout pattern over WebSocket). Handle disconnects/reconnects (resync to current round). Follow-ups: 'huge games (thousands of players — fan-out)', 'question banks/randomization', 'cheating prevention', 'streaks/power-ups'. Signal: quiz/question model + round State machine (show→accept→reveal→score) + server-authoritative timed answers + speed-aware scoring + real-time fan-out + cumulative leaderboard.",
      },
    ],
    "A quiz engine tests a round State machine (show→accept-timed→reveal→score), server-authoritative answer timing (record server-side receipt — don't trust client timing) feeding speed-aware scoring, and real-time fan-out to synchronize many simultaneous players, over a cumulative leaderboard. Server authority on timing is the fairness crux.",
    ["Trusting client-reported answer times instead of server-side timing (cheatable, unfair).",
     "No round State machine (accepting answers outside the window / changing answers after reveal).",
     "Ignoring real-time synchronization of many simultaneous players (fan-out)."],
    0.5, { type: "Quiz rounds", description: "Per question: SHOW_QUESTION → ACCEPTING_ANSWERS (timed window) → REVEAL → SCOREBOARD → next. Answers recorded with SERVER timestamp (authoritative); score = correctness + speed bonus. Real-time push syncs all players; cumulative leaderboard.", alt: "Quiz engine: a timed round state machine with server-authoritative scoring and real-time sync." }),

  T("lld_m22_t6", 6, "Design Mancala", "design-mancala",
    ["case-study", "board", "rules", "sowing"],
    "Model Mancala (Kalah): pits holding stones; on your turn you pick up a pit's stones and SOW them one-per-pit counterclockwise. Special rules: landing in your store grants an extra turn; landing in your own empty pit CAPTURES. How do you model sowing and these rules?",
    "A board of PITS (6 per player + each player's STORE), tracked as an array. A move: empty a chosen pit and SOW its stones one-by-one into successive pits counterclockwise, SKIPPING the opponent's store. Apply end-of-sow rules: last stone in YOUR store → extra turn; last stone in YOUR empty pit → CAPTURE (that stone + the opposite pit's stones go to your store). Game ends when a side is empty; most stones win.",
    [
      { kind: "concept", heading: "Board representation",
        body: "Represent the board as an ARRAY: 6 PITS per player plus each player's STORE (kalah), arranged in a loop. A pit holds a count of stones. Indexing the array in counterclockwise order makes sowing a simple index walk. Track whose turn it is. The array layout (with known store indices) keeps the geometry simple." },
      { kind: "concept", heading: "Sowing",
        body: "A move: choose one of YOUR non-empty pits, pick up ALL its stones (set it to 0), and SOW them one-per-pit into successive pits going counterclockwise — INCLUDING your own store but SKIPPING the OPPONENT's store. So distributing N stones advances N pits (skipping one specific index). Getting the skip-opponent-store rule and the wrap-around right is the core mechanic." },
      { kind: "concept", heading: "End-of-sow special rules",
        body: "Where the LAST stone lands triggers special rules: (1) if it lands in YOUR STORE → you get an EXTRA TURN (play again); (2) if it lands in one of YOUR OWN previously-EMPTY pits → CAPTURE: take that last stone plus all stones in the OPPOSITE pit (opponent's) into your store. Otherwise the turn passes. These two rules (extra turn, capture) are what give Mancala its strategy and must be checked on the final stone's position." },
      { kind: "concept", heading: "Game end & follow-ups",
        body: "The game ends when ALL pits on one player's side are EMPTY; the other player sweeps their remaining stones into their store. The player with the most stones in their store WINS. Follow-ups: 'variant rules (different capture/sowing rules across Mancala variants)', 'AI (minimax — Kalah is solved for small sizes)'. Signal: pit/store array + counterclockwise sowing (skip opponent's store) + last-stone rules (extra turn in store, capture on own empty pit) + game-end sweep + most-stones-wins.",
      },
    ],
    "Mancala tests sowing mechanics on a pit/store array: distribute a pit's stones counterclockwise (skipping the opponent's store) and apply last-stone rules — extra turn if it lands in your store, capture (last stone + opposite pit) if it lands in your own empty pit — ending when a side empties (most stones win). The skip-opponent-store and last-stone rules are the crux.",
    ["Forgetting to skip the opponent's store while sowing (or mishandling wrap-around).",
     "Missing the last-stone rules (extra turn in your store; capture on your own empty pit).",
     "Not handling game end (a side empties → opponent sweeps remaining stones)."],
    0.4),

  T("lld_m22_t7", 7, "Design a Sudoku Generator", "design-sudoku-generator",
    ["case-study", "backtracking", "uniqueness", "puzzle-generation"],
    "Generate a Sudoku PUZZLE (not just solve one): produce a board with a UNIQUE solution at a target difficulty. A solver finds answers — how do you create a good, uniquely-solvable puzzle?",
    "Generate a full valid SOLVED grid (randomized backtracking fill), then REMOVE clues one by one — but only remove a cell if the puzzle still has a UNIQUE solution (verify by running the solver and checking it can't find a second solution). Stop at the target clue count / difficulty. Uniqueness checking (solver that counts solutions, short-circuiting at 2) is the crux that separates generation from solving.",
    [
      { kind: "concept", heading: "Generation = solve + remove",
        body: "Generating differs from solving. The standard approach: (1) CREATE a complete, valid SOLVED grid — fill an empty board using randomized BACKTRACKING (the Sudoku solver, but trying digits in random order so each run yields a different grid); (2) REMOVE clues from this full grid to create the puzzle. The removal step, gated by uniqueness, is what makes a real puzzle." },
      { kind: "concept", heading: "Uniqueness is the crux",
        body: "A proper Sudoku must have EXACTLY ONE solution. So when removing a clue, you must VERIFY the puzzle still has a unique solution — otherwise removing it created ambiguity. Check uniqueness by running a SOLVER that COUNTS solutions but short-circuits once it finds a SECOND (you don't need the full count — just 'is there more than one?'). If removing a cell would allow ≥2 solutions, KEEP that cell. This uniqueness check is the defining difference from a plain solver." },
      { kind: "concept", heading: "Difficulty control",
        body: "DIFFICULTY correlates with how many clues remain and which solving TECHNIQUES are required (more empties + needing advanced techniques = harder). Control it by: target clue count (fewer = generally harder, down to the 17-clue minimum for a unique 9×9), removal order/symmetry, and optionally rating the puzzle by which logical techniques a human-style solver needs to crack it (naked singles vs advanced). Pure clue-count is a rough proxy; technique-based rating is better." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Symmetric puzzles' (remove cells in symmetric pairs for aesthetics). 'Why 17 clues' (proven minimum for unique 9×9). 'Generate at exact difficulty' (rate via solving techniques). 'Performance' (uniqueness checks are the expensive part). Signal: randomized backtracking to build a full grid → remove clues gated by a UNIQUENESS check (solver counting up to 2 solutions) → stop at target difficulty/clue-count; uniqueness verification distinguishes generation from solving.",
      },
    ],
    "A Sudoku generator tests puzzle creation vs solving: fill a full valid grid via randomized backtracking, then remove clues only while the puzzle keeps a UNIQUE solution (verified by a solver that short-circuits on finding a second solution), stopping at a target difficulty. The uniqueness check is the crux that distinguishes generation from solving.",
    ["Just removing random clues without verifying the solution stays unique (ambiguous puzzle).",
     "Treating it as the solver problem — generation adds the uniqueness-gated removal step.",
     "Using clue count alone as difficulty without considering required solving techniques."],
    0.6, { type: "Sudoku generation", description: "1) Fill an empty grid via randomized backtracking → a full valid solution. 2) Remove clues one by one; after each, run a solver that counts up to 2 solutions — keep the clue if removing it allows ≥2 (loses uniqueness). Stop at target clue-count/difficulty.", alt: "Sudoku generator: build a full grid, then remove clues while a uniqueness check holds." }),

  T("lld_m22_t8", 8, "Design a Crossword Generator / Solver", "design-crossword",
    ["case-study", "constraint-satisfaction", "backtracking", "grid"],
    "Model a crossword: fit words into a grid so intersecting across/down entries share letters, given a word list. Why is filling the grid hard, and what technique places words consistently?",
    "Filling a crossword grid is a CONSTRAINT-SATISFACTION problem: each SLOT (across/down run) is a variable, words are domain values, and CROSSING cells constrain that intersecting slots share the same letter. Solve with BACKTRACKING — place a word in a slot, propagate constraints to crossing slots (filter words that fit the now-fixed letters), recurse, backtrack on dead ends. Use most-constrained-slot ordering to prune; it's the same CSP discipline as Sudoku.",
    [
      { kind: "concept", heading: "Grid, slots, and constraints",
        body: "A crossword grid has black/white cells; the white cells form SLOTS — maximal horizontal (across) and vertical (down) runs of length ≥2. Each slot must hold a word of its length. The constraint: where an across slot and a down slot CROSS, the shared cell must have the SAME letter in both words. So filling the grid means choosing words for all slots that agree at every intersection — a system of overlapping letter constraints." },
      { kind: "concept", heading: "It's constraint satisfaction",
        body: "Model it as a CSP: VARIABLES = slots, DOMAINS = candidate words of the right length (from the word list), CONSTRAINTS = crossing cells must match letters. This is the same family as Sudoku — fill variables respecting constraints. Brute-forcing all word assignments is astronomically large; you need backtracking with constraint propagation (the CSP toolkit) to make it tractable." },
      { kind: "concept", heading: "Backtracking + propagation",
        body: "Solve by BACKTRACKING: pick a slot, try a candidate word that fits the already-fixed crossing letters, place it, PROPAGATE — for each crossing slot, the now-fixed letter restricts which words still fit (filter their candidate lists); if any crossing slot's candidates become empty, this placement fails → BACKTRACK and try another word. Recurse until all slots filled. Constraint propagation prunes the search dramatically (vs blind backtracking)." },
      { kind: "concept", heading: "Heuristics, generation vs solving & follow-ups",
        body: "Heuristics speed it up: fill the MOST-CONSTRAINED slot first (fewest candidate words / most crossings — the MRV heuristic, like Sudoku), and prefer words that leave crossings most flexible. GENERATION (build a grid + fill with words, then assign clues) vs SOLVING (given clues, fill the grid — also CSP, with clue-answer candidates). Follow-ups: 'word-list indexing by length + letter position (fast candidate lookup)', 'symmetric grids', 'unsolvable grids'. Signal: slots as CSP variables + crossing-letter constraints + backtracking with constraint propagation + MRV ordering; same CSP discipline as Sudoku.",
      },
    ],
    "A crossword tests constraint satisfaction: slots are variables, words are domain values, and crossing cells must share letters; solve by backtracking with constraint propagation (placing a word filters crossing slots' candidates) and MRV (most-constrained-slot-first) ordering. It's the same CSP discipline as Sudoku; word-list indexing by length/letter speeds candidate lookup.",
    ["Brute-forcing word assignments instead of backtracking with constraint propagation (CSP).",
     "Ignoring crossing-letter constraints / not propagating a placement to crossing slots' candidates.",
     "Not ordering by most-constrained slot (MRV) — far slower search."],
    0.6, { type: "Crossword CSP", description: "Slots (across/down runs) = variables; candidate words = domain; crossing cells must match letters = constraints. Backtrack: place a word in the most-constrained slot → propagate (filter crossing slots' candidates) → recurse; empty candidates → backtrack. (Same CSP family as Sudoku.)", alt: "Crossword as a CSP: slots filled by backtracking with crossing-letter constraint propagation." }),
];

const EXERCISES = [
  // Uno
  pm({ topicId: "lld_m22_t1", exerciseId: "lld_m22_t1_pm_1", position: 1, level: "medium", title: "Valid play",
    scenario: "A card may be played if it…",
    options: ["Matches the top card's color or number, or is a Wild", "Matches only the color", "Is any card in hand", "Is a number card only"], correct: "Matches the top card's color or number, or is a Wild",
    explanation: "Match by color or number/symbol; Wilds are always playable (player then picks the color)." }),
  pm({ topicId: "lld_m22_t1", exerciseId: "lld_m22_t1_pm_2", position: 2, level: "medium", title: "Turn order",
    scenario: "Reverse and Skip are handled by…",
    options: ["A turn DIRECTION (±1) that Reverse flips and Skip advances", "Shuffling players", "Restarting the round", "A random next player"], correct: "A turn DIRECTION (±1) that Reverse flips and Skip advances",
    explanation: "Track index + direction; Reverse flips direction, Skip steps an extra player." }),
  pm({ topicId: "lld_m22_t1", exerciseId: "lld_m22_t1_pm_3", position: 3, level: "medium", title: "Action cards",
    scenario: "Skip/Reverse/Draw/Wild effects are best modeled as…",
    options: ["Polymorphic per-card effects (not a giant switch)", "A big switch in the turn loop", "Hardcoded constants", "A Singleton"], correct: "Polymorphic per-card effects (not a giant switch)",
    explanation: "Each card applies its own effect — Open–Closed, easy to add card types (the deck/Monopoly lesson)." }),
  // Checkers
  pm({ topicId: "lld_m22_t2", exerciseId: "lld_m22_t2_pm_1", position: 1, level: "hard", title: "Multi-jump",
    scenario: "After a capture, if the same piece can capture again, it…",
    options: ["Must continue jumping in the same turn (recursive multi-jump)", "Stops", "Becomes a king immediately", "Passes the turn"], correct: "Must continue jumping in the same turn (recursive multi-jump)",
    explanation: "Capture generation is recursive — chain all continuation jumps in one turn." }),
  pm({ topicId: "lld_m22_t2", exerciseId: "lld_m22_t2_pm_2", position: 2, level: "medium", title: "Forced capture",
    scenario: "In most rules, if a capture is available you…",
    options: ["Must make a capturing move (captures take precedence)", "May ignore it", "Lose your turn", "Become a king"], correct: "Must make a capturing move (captures take precedence)",
    explanation: "Move generation: if any capture exists, only captures are legal." }),
  pm({ topicId: "lld_m22_t2", exerciseId: "lld_m22_t2_pm_3", position: 3, level: "easy", title: "Promotion",
    scenario: "A man reaching the far row…",
    options: ["Is promoted to a king (moves both diagonal directions)", "Is removed", "Wins instantly", "Moves twice"], correct: "Is promoted to a king (moves both diagonal directions)",
    explanation: "Kings gain backward diagonal movement; men move only forward diagonally." }),
  // Chess clock
  pm({ topicId: "lld_m22_t3", exerciseId: "lld_m22_t3_pm_1", position: 1, level: "medium", title: "Measure time",
    scenario: "Remaining time should be computed by…",
    options: ["Start timestamp: budget − (now − start), not a busy tick loop", "Decrementing every millisecond in a loop", "Random", "A fixed countdown only"], correct: "Start timestamp: budget − (now − start), not a busy tick loop",
    explanation: "Timestamp-based remaining time is accurate and avoids busy-waiting (the token-bucket/cron technique)." }),
  pm({ topicId: "lld_m22_t3", exerciseId: "lld_m22_t3_pm_2", position: 2, level: "medium", title: "On press",
    scenario: "Pressing your button…",
    options: ["Stops your clock and starts the opponent's", "Stops both clocks", "Resets your time", "Adds time to both"], correct: "Stops your clock and starts the opponent's",
    explanation: "Exactly one clock runs (the active player's); pressing switches the active clock." }),
  pm({ topicId: "lld_m22_t3", exerciseId: "lld_m22_t3_pm_3", position: 3, level: "medium", title: "Time controls",
    scenario: "Increment and delay time controls are best modeled as…",
    options: ["A pluggable time-control Strategy applied on press", "Hardcoded in the clock", "Random additions", "Ignored"], correct: "A pluggable time-control Strategy applied on press",
    explanation: "A Strategy applies per-move time adjustments (Fischer increment, Bronstein delay) flexibly." }),
  // Word ladder
  pm({ topicId: "lld_m22_t4", exerciseId: "lld_m22_t4_pm_1", position: 1, level: "medium", title: "Model it",
    scenario: "A word ladder is best modeled as…",
    options: ["A graph: words=nodes, one-letter-change=edges; shortest path", "A sorted list of words", "A hash table", "A stack"], correct: "A graph: words=nodes, one-letter-change=edges; shortest path",
    explanation: "One-letter transforms are edges; the shortest ladder is a graph shortest path." }),
  pm({ topicId: "lld_m22_t4", exerciseId: "lld_m22_t4_pm_2", position: 2, level: "medium", title: "Which search",
    scenario: "The fewest-step ladder is found with…",
    options: ["BFS (unweighted shortest path)", "DFS", "Sorting", "Random walk"], correct: "BFS (unweighted shortest path)",
    explanation: "BFS explores level by level, so the first time it reaches the end word is the shortest ladder." }),
  pm({ topicId: "lld_m22_t4", exerciseId: "lld_m22_t4_pm_3", position: 3, level: "hard", title: "Neighbors fast",
    scenario: "Finding a word's one-letter-different neighbors efficiently uses…",
    options: ["Wildcard patterns (c*t) indexing words", "Comparing it to every dictionary word", "Sorting the dictionary", "A bloom filter"], correct: "Wildcard patterns (c*t) indexing words",
    explanation: "Index words by patterns like *at/c*t/ca*; words sharing a pattern differ by one letter." }),
  // Quiz engine
  pm({ topicId: "lld_m22_t5", exerciseId: "lld_m22_t5_pm_1", position: 1, level: "hard", title: "Fair timing",
    scenario: "To score speed fairly, answer times must be…",
    options: ["Server-authoritative (recorded server-side, not client-reported)", "Reported by the client", "Ignored", "Estimated"], correct: "Server-authoritative (recorded server-side, not client-reported)",
    explanation: "Clients lie/have variable latency; record server-side receipt time for fair speed scoring." }),
  pm({ topicId: "lld_m22_t5", exerciseId: "lld_m22_t5_pm_2", position: 2, level: "medium", title: "Round flow",
    scenario: "A question round progresses through…",
    options: ["SHOW → ACCEPTING_ANSWERS (timed) → REVEAL → SCOREBOARD", "One step", "Random order", "Answers anytime"], correct: "SHOW → ACCEPTING_ANSWERS (timed) → REVEAL → SCOREBOARD",
    explanation: "A State machine accepts answers only during the timed window, then reveals and scores." }),
  pm({ topicId: "lld_m22_t5", exerciseId: "lld_m22_t5_pm_3", position: 3, level: "medium", title: "Sync players",
    scenario: "Many simultaneous players stay in sync via…",
    options: ["Real-time push (WebSocket fan-out)", "Polling once a minute", "Email", "Page refresh"], correct: "Real-time push (WebSocket fan-out)",
    explanation: "Questions/results appear together via real-time fan-out (the Slack/realtime pattern)." }),
  // Mancala
  pm({ topicId: "lld_m22_t6", exerciseId: "lld_m22_t6_pm_1", position: 1, level: "medium", title: "Sowing",
    scenario: "When sowing stones counterclockwise, you…",
    options: ["Include your own store but skip the opponent's store", "Skip both stores", "Include both stores", "Skip your own store"], correct: "Include your own store but skip the opponent's store",
    explanation: "Distribute one per pit, dropping into your store but never the opponent's." }),
  pm({ topicId: "lld_m22_t6", exerciseId: "lld_m22_t6_pm_2", position: 2, level: "hard", title: "Last stone",
    scenario: "If your last sown stone lands in your own EMPTY pit, you…",
    options: ["Capture it + the opposite pit's stones into your store", "Get an extra turn", "Lose your turn", "Nothing special"], correct: "Capture it + the opposite pit's stones into your store",
    explanation: "Landing in your own empty pit captures that stone plus the opposite pit (extra turn is landing in your store)." }),
  pm({ topicId: "lld_m22_t6", exerciseId: "lld_m22_t6_pm_3", position: 3, level: "medium", title: "Extra turn",
    scenario: "Landing your last stone in your STORE grants…",
    options: ["An extra turn", "A capture", "Game over", "Nothing"], correct: "An extra turn",
    explanation: "Last stone in your own store = play again; the game ends when a side empties (most stones wins)." }),
  // Sudoku generator
  pm({ topicId: "lld_m22_t7", exerciseId: "lld_m22_t7_pm_1", position: 1, level: "hard", title: "The crux",
    scenario: "What distinguishes generating a Sudoku from solving one?",
    options: ["Removing clues only while the puzzle keeps a UNIQUE solution", "Solving it faster", "Using a bigger grid", "Random numbers"], correct: "Removing clues only while the puzzle keeps a UNIQUE solution",
    explanation: "Generation = full grid then clue removal gated by a uniqueness check — the defining step." }),
  pm({ topicId: "lld_m22_t7", exerciseId: "lld_m22_t7_pm_2", position: 2, level: "medium", title: "Check uniqueness",
    scenario: "To verify a unique solution efficiently, the solver should…",
    options: ["Count solutions but short-circuit on finding a SECOND", "Find all solutions fully", "Only find one and stop", "Guess"], correct: "Count solutions but short-circuit on finding a SECOND",
    explanation: "You only need 'is there more than one?' — stop as soon as a second solution appears." }),
  pm({ topicId: "lld_m22_t7", exerciseId: "lld_m22_t7_pm_3", position: 3, level: "medium", title: "Full grid",
    scenario: "The initial full solved grid is created by…",
    options: ["Randomized backtracking fill", "Copying a fixed grid", "Random digits with no checks", "Sorting"], correct: "Randomized backtracking fill",
    explanation: "Backtracking with randomized digit order yields a different valid complete grid each run." }),
  // Crossword
  pm({ topicId: "lld_m22_t8", exerciseId: "lld_m22_t8_pm_1", position: 1, level: "hard", title: "The technique",
    scenario: "Filling a crossword grid is fundamentally…",
    options: ["A constraint-satisfaction problem solved by backtracking + propagation", "A sorting problem", "A hashing problem", "Trivially greedy"], correct: "A constraint-satisfaction problem solved by backtracking + propagation",
    explanation: "Slots are variables, words are values, crossings are constraints — backtracking with propagation (like Sudoku)." }),
  pm({ topicId: "lld_m22_t8", exerciseId: "lld_m22_t8_pm_2", position: 2, level: "hard", title: "Propagation",
    scenario: "After placing a word, you should…",
    options: ["Propagate: filter crossing slots' candidate words by the now-fixed letters", "Place all words randomly", "Ignore crossings", "Restart"], correct: "Propagate: filter crossing slots' candidate words by the now-fixed letters",
    explanation: "Constraint propagation prunes crossing slots; empty candidates → backtrack." }),
  pm({ topicId: "lld_m22_t8", exerciseId: "lld_m22_t8_pm_3", position: 3, level: "medium", title: "Ordering",
    scenario: "To prune the search, fill which slot first?",
    options: ["The most-constrained slot (fewest candidates / most crossings — MRV)", "The first slot", "A random slot", "The longest slot always"], correct: "The most-constrained slot (fewest candidates / most crossings — MRV)",
    explanation: "MRV (most-constrained-variable) ordering fails fast and prunes the search — same as Sudoku." }),
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
  console.log(`\nDone — M22 Games & Puzzles III seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
