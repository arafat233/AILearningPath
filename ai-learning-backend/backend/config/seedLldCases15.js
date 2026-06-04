/**
 * Seed — LLD module M21: Classic Games II:
 * Blackjack, Wordle, Mastermind, Yahtzee, Boggle, Hangman,
 * Memory/Concentration, Lights Out.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldCases15.js   ·   npm: npm run seed:lld-cases15
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m21";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 21,
  name: "Classic Games II", slug: "classic-games-2",
  description: "Design eight more classic games: Blackjack, Wordle, Mastermind, Yahtzee, Boggle, Hangman, Memory/Concentration, and Lights Out.",
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
  T("lld_m21_t1", 1, "Design Blackjack", "design-blackjack",
    ["case-study", "card-game", "state", "strategy"],
    "Model Blackjack: players bet, are dealt cards, hit/stand against a dealer who plays by fixed rules, and hand values must handle the Ace being 1 OR 11. What carries the round, and what's the Ace subtlety?",
    "Reuse the Deck/Card; each Player and the Dealer have a Hand whose value handles SOFT ACES (count an Ace as 11 unless that busts, then 1). A round is a State machine (BETTING → DEALING → PLAYER_TURNS → DEALER_TURN → SETTLE). The DEALER follows fixed rules (hit until ≥17 — a Strategy/rule, not a choice). Settle bets by comparing totals (bust, blackjack pays 3:2).",
    [
      { kind: "concept", heading: "Entities (reuse the deck)",
        body: "Build on the deck-of-cards design (Card = Suit×Rank, Deck with shuffle/deal — often a multi-deck SHOE in Blackjack). Each Player has a Hand and a BET; the Dealer has a Hand (one card face-down). The Game/Round orchestrates dealing and resolution. Keep card scoring OUT of Card (it's game-specific) — a Hand computes its own value." },
      { kind: "concept", heading: "Hand value with soft Aces",
        body: "The defining subtlety: an ACE counts as 11 OR 1. Compute a hand's value by summing cards with Aces as 11, then while the total > 21 and there's an Ace counted as 11, demote one Ace to 1 (subtract 10). This gives the best (highest non-busting) total — a 'soft' hand has an Ace still counted as 11. Getting this Ace logic right is the classic Blackjack gotcha (and ties to the poker-evaluator's game-specific scoring point)." },
      { kind: "concept", heading: "Round as a State machine",
        body: "A round progresses through states: BETTING (players bet) → DEALING (two cards each, dealer one up one down) → PLAYER_TURNS (each player HITs/STANDs/doubles/splits until they stand or bust) → DEALER_TURN → SETTLE. The State pattern enforces legal actions per phase (you can't hit during settlement). Busting (>21) ends that player's turn immediately." },
      { kind: "concept", heading: "Dealer rules & settlement — follow-ups",
        body: "The DEALER has NO choice — it follows fixed RULES (hit until reaching ≥17, stand otherwise; 'hit soft 17' is a variant) — model as a Strategy/rule object, not player input. SETTLE: compare each player's total to the dealer's — player busts → lose; dealer busts → remaining players win; else higher total wins; a natural BLACKJACK (21 on two cards) typically pays 3:2. Follow-ups: 'split/double-down', 'insurance', 'card counting / multi-deck shoe', 'AI basic-strategy player'. Signal: reuse Deck + Hand value with soft-Ace handling + round State machine + fixed dealer-rule Strategy + bet settlement (blackjack 3:2).",
      },
    ],
    "Blackjack tests reusing the deck with a Hand value that handles SOFT ACES (Ace = 11 unless it busts, then 1 — the classic gotcha), a round State machine (betting→deal→player turns→dealer→settle), a fixed dealer-rule Strategy (hit until ≥17, not a choice), and bet settlement (blackjack pays 3:2). Game-specific scoring stays out of Card.",
    ["Mishandling the soft Ace (1 vs 11) when computing the best non-busting hand value.",
     "Letting the dealer 'choose' instead of following fixed rules (hit until ≥17).",
     "Putting card values on Card instead of computing them per-hand (game-specific)."],
    0.5, { type: "Blackjack round", description: "Reuse Deck/Shoe. Round states: BETTING → DEALING → PLAYER_TURNS (hit/stand/double/split, bust >21) → DEALER_TURN (fixed rule: hit until ≥17) → SETTLE (compare totals; blackjack pays 3:2). Hand value: Aces 11→1 to avoid bust.", alt: "Blackjack: a round state machine with soft-Ace hand values and fixed dealer rules." }),

  T("lld_m21_t2", 2, "Design Wordle", "design-wordle",
    ["case-study", "feedback", "duplicate-handling", "validation"],
    "Model Wordle: guess a 5-letter word in 6 tries; each guess returns per-letter feedback — GREEN (right letter, right spot), YELLOW (in the word, wrong spot), GRAY (not in the word). The duplicate-letter case is the famous bug. How do you compute feedback correctly?",
    "Feedback is computed in TWO PASSES with letter COUNTS: first mark all GREENs (exact position) and decrement those letters from a count of the answer's letters; THEN for non-greens, mark YELLOW only if that letter still has remaining count (else GRAY). This count-based two-pass is what handles DUPLICATE letters correctly. Validate the guess (length, real word). Game is a small State (guesses, win/lose).",
    [
      { kind: "concept", heading: "The model",
        body: "A target WORD (5 letters), up to 6 GUESSES, each producing per-letter FEEDBACK of GREEN/YELLOW/GRAY. Validate each guess: correct length and is a real dictionary word (a set/trie membership — the spell-check/autocomplete idea). Track guesses and game status (IN_PROGRESS → WON on an all-green guess → LOST after 6). The interesting part is computing the feedback exactly." },
      { kind: "concept", heading: "Why naive feedback is wrong",
        body: "Naive per-letter logic ('is this letter in the word?') breaks on DUPLICATES. If the answer is 'ABBEY' and you guess 'BABES', how many B's get colored? Or guessing 'SPEED' against 'ERASE' — the extra E shouldn't all be yellow. A letter's color depends on how many of it remain UNMATCHED in the answer. This duplicate-letter handling is the famous Wordle implementation bug." },
      { kind: "concept", heading: "The correct two-pass algorithm",
        body: "Use letter COUNTS and TWO passes. Build a count of each letter in the answer. PASS 1: for each position, if guess[i] == answer[i], mark GREEN and DECREMENT that letter's count (it's consumed). PASS 2: for each remaining (non-green) position, if the guessed letter still has a positive remaining count, mark YELLOW and decrement; otherwise GRAY. Doing greens first (they have priority) and consuming counts is what makes duplicates correct." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Hard mode' (revealed hints must be reused in subsequent guesses — extra validation). 'Daily word' (deterministic per date — same for everyone). 'A solver' (filter the candidate word list by accumulated constraints each guess — entropy-maximizing first guess). 'Share grid' (the emoji feedback). Signal: two-pass count-based feedback (greens first, then yellows by remaining count) for correct DUPLICATE handling + guess validation (real word, length) + simple win/lose State.",
      },
    ],
    "Wordle tests correct feedback computation: a two-pass, count-based algorithm — mark greens first (consuming letters from the answer's counts), then yellows only if the letter still has remaining count, else gray — which is what handles DUPLICATE letters correctly (the famous bug). Plus guess validation (real word/length) and a simple win/lose state.",
    ["Naive single-pass 'is letter in word' feedback — wrong on duplicate letters.",
     "Not prioritizing greens / not consuming letter counts (over-coloring yellows).",
     "Skipping guess validation (length + real dictionary word)."],
    0.5, { type: "Wordle feedback", description: "Count answer letters. Pass 1: guess[i]==answer[i] → GREEN, decrement that letter's count. Pass 2: non-green letter with remaining count > 0 → YELLOW (decrement), else GRAY. Greens-first + count-consuming = correct duplicate handling.", alt: "Wordle feedback: two-pass count-based coloring (greens first, then yellows by remaining count)." }),

  T("lld_m21_t3", 3, "Design Mastermind", "design-mastermind",
    ["case-study", "feedback", "counting", "code-breaking"],
    "Model Mastermind: the codemaker sets a secret of N colored pegs (repeats allowed); the codebreaker guesses, getting feedback of BLACK pegs (right color, right position) and WHITE pegs (right color, wrong position). With repeats, how do you count black/white without double-counting?",
    "Count BLACK pegs first (exact position+color matches), removing those from consideration. For WHITE, count remaining color overlaps using COLOR FREQUENCY: for each color, add min(remaining-in-secret, remaining-in-guess); whites = that total. This frequency-based counting (after removing blacks) handles REPEATED colors correctly — the same two-pass discipline as Wordle. Game tracks guesses/attempts and win.",
    [
      { kind: "concept", heading: "The model",
        body: "A SECRET code of N pegs (e.g. 4), each one of K colors, REPEATS allowed. The codebreaker submits guesses (same shape); each guess returns feedback: BLACK pegs = positions where color AND position match; WHITE pegs = correct colors in the WRONG position. The game ends when the breaker gets all blacks (win) or runs out of attempts. Computing black/white correctly with repeats is the crux." },
      { kind: "concept", heading: "Blacks first",
        body: "PASS 1 — BLACKS: count positions where guess[i] == secret[i] (exact match). These pegs are 'used up' and must NOT also contribute to whites. Set them aside (or track which secret/guess positions are consumed by blacks) before computing whites. Just like Wordle's greens-first." },
      { kind: "concept", heading: "Whites via frequency (the repeat trap)",
        body: "PASS 2 — WHITES: among the NON-black positions, count color overlaps using FREQUENCY. Tally remaining colors in the secret and in the guess (excluding black-matched pegs); for each color, the matches are min(count in remaining secret, count in remaining guess); sum over colors = total whites. This min-of-counts per color is what prevents double-counting when colors REPEAT (the classic Mastermind bug — naive 'is this color somewhere' over-counts)." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Solver' (Knuth's five-guess algorithm: maintain the set of still-possible codes, pick the guess minimizing the worst-case remaining set — minimax). 'Variants' (more pegs/colors, no-repeat mode). 'AI codebreaker'. Note blacks + whites ≤ N. Signal: black pegs first (exact), then white pegs by per-color min-of-remaining-counts (handles repeats) — the same blacks/greens-first, count-based discipline as Wordle.",
      },
    ],
    "Mastermind tests black/white feedback with repeats: count blacks (exact matches) first and remove them, then count whites by summing per-color min(remaining-in-secret, remaining-in-guess) — the frequency method that avoids double-counting repeated colors. It's the same blacks-first, count-based discipline as Wordle; Knuth's minimax is the solver.",
    ["Counting whites without first removing blacks (double-counting matched pegs).",
     "Naive 'is this color present' for whites — over-counts when colors repeat (use min-of-counts per color).",
     "Forgetting blacks + whites ≤ N (the peg count)."],
    0.5),

  T("lld_m21_t4", 4, "Design Yahtzee", "design-yahtzee",
    ["case-study", "dice", "scoring", "strategy"],
    "Model Yahtzee: roll 5 dice (up to 3 rolls, keeping any subset), then score the roll into one of 13 unused CATEGORIES (three-of-a-kind, full house, straights, Yahtzee, etc.). How do you model the turn and the category scoring?",
    "A turn = up to 3 rolls of 5 dice, keeping a chosen subset between rolls; then the player assigns the result to ONE unused CATEGORY on their scorecard. Each category is a SCORING RULE (Strategy) that computes a score from the dice (or 0 if it doesn't qualify). The scorecard tracks which of the 13 categories are filled. Game ends when all categories are used; highest total wins.",
    [
      { kind: "concept", heading: "The turn: roll, keep, re-roll",
        body: "A turn allows up to THREE rolls of 5 dice: roll all, then KEEP any subset and re-roll the rest, up to two more times (you can stop early). Model the dice (values + a 'kept' flag) and the roll count. After the final roll (or early stop), the player must SCORE the dice into one category. The keep/re-roll mechanic is the interactive part." },
      { kind: "concept", heading: "Categories as scoring rules",
        body: "There are 13 CATEGORIES split into an upper section (Ones..Sixes — sum of that face) and a lower section (Three/Four of a Kind, Full House, Small/Large Straight, Yahtzee, Chance). Each category is a SCORING RULE (Strategy): given the 5 dice, return the score IF the dice qualify, else 0 (e.g. Full House = 25 if three-of-one + two-of-another, else 0). Modeling each as a rule object keeps scoring clean and extensible — the same Strategy approach as Bowling/Poker scoring." },
      { kind: "concept", heading: "Scorecard & the assignment choice",
        body: "Each player's SCORECARD tracks which of the 13 categories are still UNUSED. After rolling, the player ASSIGNS the dice to exactly ONE unused category (scoring it, possibly 0 — a 'sacrifice' when nothing fits). Once used, a category is locked. The strategic depth is choosing WHICH category to use a roll for. The upper-section bonus (+35 if upper sum ≥ 63) and the Yahtzee bonus are extra rules." },
      { kind: "concept", heading: "Game flow & follow-ups",
        body: "Game state: players take turns until ALL 13 categories are filled for everyone; total = sum of category scores + bonuses; highest wins. Follow-ups: 'AI player (expected-value strategy for keep decisions)', 'Yahtzee bonus / joker rules', 'multiplayer'. Signal: turn = up to 3 rolls with keep/re-roll + 13 categories as scoring Strategy rules (qualify→score else 0) + scorecard tracking used categories + assign-to-one-category-per-turn choice.",
      },
    ],
    "Yahtzee tests a roll-keep-reroll turn (up to 3 rolls) plus 13 categories modeled as scoring-rule Strategies (qualify → score, else 0), a scorecard tracking used categories, and the assign-to-one-unused-category choice (the strategic depth). Category-as-Strategy mirrors Bowling/Poker scoring.",
    ["A giant if/else for the 13 categories instead of a scoring-rule Strategy per category.",
     "Forgetting categories can be scored as 0 (a forced sacrifice) and lock once used.",
     "Mishandling the keep/re-roll (up to 3 rolls) turn mechanic or the upper-section bonus."],
    0.4),

  T("lld_m21_t5", 5, "Design Boggle", "design-boggle",
    ["case-study", "grid", "trie", "dfs"],
    "Model Boggle: a grid of letter dice; find all valid dictionary words formable by chains of ADJACENT cells (8-directional), no cell reused within a word. Checking every path against a dictionary is huge — what prunes the search?",
    "DFS from each cell, extending to unvisited ADJACENT (8-dir) cells, building a path. The key optimization: store the dictionary in a TRIE and prune any DFS branch whose accumulated prefix isn't in the trie — killing the vast majority of dead-end paths. Mark cells visited along the current path (un-mark on backtrack); collect paths that hit a complete word. Trie + DFS-with-pruning is the design.",
    [
      { kind: "concept", heading: "The search space",
        body: "A word in Boggle is a chain of ADJACENT cells (8 directions: orthogonal + diagonal), each cell used at most ONCE per word. Finding all valid words means exploring paths through the grid — a DFS from each starting cell, extending to unvisited neighbors. But the number of paths is enormous (exponential), so naively generating every path and checking the dictionary is far too slow. You must PRUNE." },
      { kind: "concept", heading: "Trie for prefix pruning (the key)",
        body: "Store the dictionary in a TRIE (the autocomplete structure). As DFS extends a path, it accumulates a PREFIX; check the trie: if no dictionary word starts with the current prefix, PRUNE this branch immediately (stop extending — every deeper path is a dead end). This trie-based prefix pruning eliminates the overwhelming majority of paths, turning an intractable search into a fast one. The trie also tells you when the current path IS a complete word (mark to collect)." },
      { kind: "concept", heading: "DFS with visited tracking",
        body: "From each cell, recurse to its unvisited 8-directional neighbors, appending the letter; MARK the cell visited for the current path and UN-MARK on backtrack (a cell can be reused across DIFFERENT words, just not within one). When the accumulated prefix is a complete word in the trie, add it to the results (dedupe — the same word may be found via multiple paths). Continue while the prefix remains a valid trie prefix." },
      { kind: "concept", heading: "Optimizations & follow-ups",
        body: "Extra speedups: delete found words from the trie (avoid re-finding), or prune trie branches with no remaining words. Handle multi-letter dice faces ('Qu'). Follow-ups: 'scoring by word length', 'Boggle vs Word Search (Word Search = find given words; Boggle = find ALL words)', 'very large boards/dictionaries'. Signal: dictionary in a TRIE + DFS from each cell over 8-dir neighbors with visited-on-path + prune branches whose prefix isn't in the trie + collect complete-word paths (dedupe). The trie pruning is the whole win.",
      },
    ],
    "Boggle tests trie + DFS-with-pruning: DFS from each cell over 8-directional unvisited neighbors building a path, and crucially prune any branch whose accumulated prefix isn't in the dictionary TRIE — eliminating exponential dead-end paths. Mark cells visited per path (un-mark on backtrack); collect complete-word paths. The trie pruning makes it tractable.",
    ["Generating all paths and checking the dictionary per path instead of trie prefix-pruning.",
     "Reusing a cell within one word, or not un-marking visited cells on backtrack (blocks other words).",
     "Using a hash set instead of a trie (can't prune by prefix — the key optimization)."],
    0.6, { type: "Boggle search", description: "Dictionary → trie. DFS from each cell over 8-dir unvisited neighbors, accumulating a prefix. Prune if the prefix isn't a trie path. If the prefix is a complete word → collect (dedupe). Mark visited on the current path; un-mark on backtrack.", alt: "Boggle: DFS over grid neighbors pruned by a dictionary trie's prefixes." }),

  T("lld_m21_t6", 6, "Design Hangman", "design-hangman",
    ["case-study", "state", "guessing", "reveal"],
    "Model Hangman: a hidden word shown as blanks; the player guesses letters, correct guesses reveal positions, wrong guesses cost a life (limited attempts). How do you model the masked word and the guess flow?",
    "Track the SECRET word, the set of GUESSED letters, and remaining WRONG-guess attempts. The DISPLAYED word is derived (reveal letters in guessed, blanks otherwise). A guess: reject repeats; if the letter is in the word, reveal all its positions (no life lost); else decrement lives. Game State: IN_PROGRESS → WON (all letters revealed) / LOST (out of lives). Simple state + derived display.",
    [
      { kind: "concept", heading: "State to track",
        body: "Hangman is a small, clean state design. Track: the SECRET word, the SET of letters GUESSED so far, and the number of remaining WRONG-guess ATTEMPTS (lives). The masked DISPLAY shown to the player is DERIVED from the secret + guessed set — don't store it separately (single source of truth). Deriving the display avoids inconsistency bugs." },
      { kind: "concept", heading: "Processing a guess",
        body: "On a letter guess: first reject REPEAT guesses (already in the guessed set — no penalty, just re-prompt). Add it to the guessed set. If the letter is IN the secret word, the display now reveals ALL its positions (no life lost). If NOT, decrement remaining attempts (a wrong guess). Optionally support whole-word guesses. Keep correct vs wrong handling distinct." },
      { kind: "concept", heading: "Win / lose state machine",
        body: "Game status is a simple State machine: IN_PROGRESS → WON when every letter of the secret has been guessed (the display has no blanks) → LOST when remaining attempts hit 0. Check the win/lose condition after each guess. The 'hangman drawing' is just a view of remaining attempts. This is a great warm-up for clean state modeling + derived views." },
      { kind: "concept", heading: "Follow-ups",
        body: "'Evil Hangman' (the game adaptively picks the hardest consistent word each guess to avoid losing — a fun twist using word-pattern bucketing). 'Categories/hints', 'difficulty (word length / attempts)', 'multiplayer'. Signal: track secret + guessed set + remaining attempts; derive the masked display; correct guess reveals positions (no penalty), wrong decrements lives, repeats rejected; win/lose State machine.",
      },
    ],
    "Hangman tests clean state modeling: track the secret + guessed-letter set + remaining attempts, and DERIVE the masked display (single source of truth). A correct guess reveals positions (no penalty), wrong decrements lives, repeats are rejected, and a simple win/lose state machine ends it. 'Evil Hangman' (adaptive word) is the twist.",
    ["Storing the masked display separately instead of deriving it from secret + guessed (inconsistency).",
     "Penalizing/rewarding repeated guesses instead of rejecting them.",
     "Not checking the win condition (all letters revealed) vs lose (out of attempts) after each guess."],
    0.3),

  T("lld_m21_t7", 7, "Design Memory / Concentration", "design-memory-game",
    ["case-study", "state", "matching", "grid"],
    "Model the Memory (Concentration) card game: a grid of face-down cards in matching pairs; flip two per turn — if they match they stay up, else they flip back. What's the per-turn state, and the tricky timing?",
    "A grid of Cards each with a value and a state (FACE_DOWN / FACE_UP / MATCHED). A turn flips TWO cards: if values match → both MATCHED (stay up, player continues/scores); else both flip back to FACE_DOWN (after a brief reveal). The subtlety is the TWO-CARD turn state (track the first flipped card, then resolve on the second) and preventing flipping a matched/already-flipped card. Win when all matched.",
    [
      { kind: "concept", heading: "Board & card states",
        body: "Create a grid of Cards in matching PAIRS (each value appears twice), shuffled into positions. Each Card has a value and a STATE: FACE_DOWN (hidden), FACE_UP (currently revealed this turn), or MATCHED (permanently revealed). The board tracks all cards; a player sees only matched + currently-flipped cards. Pairs + shuffle is the setup." },
      { kind: "concept", heading: "The two-card turn",
        body: "The crux: a turn involves flipping TWO cards, so you need turn STATE. Flip the FIRST card (FACE_UP); record it. On the SECOND flip, RESOLVE: if the two values MATCH → set both to MATCHED (they stay up; typically the player scores and goes again); if they DON'T match → both flip BACK to FACE_DOWN. You must reject flipping an already-FACE_UP or MATCHED card. Tracking 'the first card of the current turn' is the key state." },
      { kind: "concept", heading: "Timing / reveal",
        body: "On a non-match, the two cards should be briefly SHOWN before flipping back (so the player can memorize) — a short reveal delay, then reset. In a turn-based model this is a transient state (REVEALING) between the second flip and the flip-back. Input must be blocked during the reveal (you can't flip a third card mid-resolution). This timing/locking is the main interactive subtlety." },
      { kind: "concept", heading: "Scoring & follow-ups",
        body: "Win when ALL pairs are MATCHED. Score by pairs found (and/or fewest turns); multiplayer alternates turns, a match grants another turn. Follow-ups: 'AI player with memory (remembers seen cards)', 'larger boards / more matches per set', 'timing in a real-time UI'. Signal: grid of paired cards with FACE_DOWN/FACE_UP/MATCHED states + two-card turn (track first, resolve on second: match→stay, else flip back after a reveal) + input lock during reveal + win when all matched.",
      },
    ],
    "Memory tests two-card turn state: a grid of paired cards (FACE_DOWN/FACE_UP/MATCHED), flip two per turn tracking the first card, resolve on the second (match → stay MATCHED, else flip back after a brief reveal), with input locked during the reveal and a win when all matched. The two-card turn + reveal timing is the subtlety.",
    ["Not tracking the first-flipped card / resolving on the second (the two-card turn state).",
     "Allowing a third flip or flipping a matched/already-up card during resolution.",
     "Flipping a non-match back instantly with no reveal window (can't memorize)."],
    0.3),

  T("lld_m21_t8", 8, "Design Lights Out", "design-lights-out",
    ["case-study", "grid", "toggle", "solver"],
    "Model Lights Out: a grid of lights; pressing a cell TOGGLES it AND its orthogonal neighbors; goal is to turn all lights off. What's the move's effect, and how would you SOLVE any solvable board?",
    "Pressing cell (r,c) TOGGLES (r,c) and its 4 orthogonal neighbors. Game state is the grid of on/off lights; win = all off. Key properties: pressing the same cell TWICE cancels out, and order doesn't matter — so a solution is a SUBSET of cells to press. Solve via LINEAR ALGEBRA over GF(2) (each light = an equation mod 2) or BFS for small boards; not all boards are solvable.",
    [
      { kind: "concept", heading: "The board & the toggle move",
        body: "A grid of LIGHTS, each ON or OFF. The defining move: pressing a cell TOGGLES that cell AND its orthogonal (up/down/left/right) NEIGHBORS (edge cells toggle fewer). The goal is to turn ALL lights OFF (or reach a target pattern). Model the grid as a boolean matrix; a press applies an XOR over the affected cells. This 'press affects a plus-shape' is the core mechanic." },
      { kind: "concept", heading: "Two key properties",
        body: "Two facts make solving tractable: (1) pressing a cell TWICE returns it to the original (toggle is its own inverse), so each cell is pressed either 0 or 1 times in a solution; (2) ORDER doesn't matter (toggles commute — XOR). Therefore a SOLUTION is just a SUBSET of cells to press. This reduces 'find a sequence of moves' to 'find which cells to press' — a combinatorial/algebraic problem, not a search over move orderings." },
      { kind: "concept", heading: "Solving over GF(2)",
        body: "Because presses are independent toggles, the puzzle is a system of LINEAR EQUATIONS over GF(2) (binary field): each light's final state = its initial state XOR the sum (mod 2) of presses that affect it; set all finals to 0 and solve for the press variables via GAUSSIAN ELIMINATION mod 2. This finds a solution (or proves NONE exists — not all boards are solvable) and is far better than brute force. For small boards, BFS over states also works." },
      { kind: "concept", heading: "Solvability & follow-ups",
        body: "Not every starting configuration is solvable — solvability depends on the board (the linear system may be inconsistent). The 'chase the lights' heuristic (press to clear each row using the row below) reduces the problem to the bottom row. Follow-ups: 'count/enumerate solutions (null space)', 'minimum-press solution', 'variant neighborhoods / toroidal boards'. Signal: press toggles a plus-shape (XOR); press-twice-cancels + order-independent ⇒ solution is a subset of cells; solve as a GF(2) linear system (Gaussian elimination) — not all boards solvable.",
      },
    ],
    "Lights Out tests modeling toggles + an algebraic solver: pressing a cell XOR-toggles it and its orthogonal neighbors, and because press-twice-cancels and order doesn't matter, a solution is a SUBSET of cells found by solving a GF(2) linear system (Gaussian elimination) — which also detects unsolvable boards. Brute-force/BFS works only for tiny grids.",
    ["Modeling moves as an ordered sequence — presses commute and press-twice cancels (solution = a subset).",
     "Brute-forcing all move sequences instead of solving the GF(2) linear system.",
     "Assuming every board is solvable (the linear system can be inconsistent)."],
    0.5, { type: "Lights Out", description: "Press (r,c) → XOR-toggle (r,c) + 4 orthogonal neighbors. Press-twice cancels + order-independent ⇒ solution = subset of cells to press. Solve: GF(2) linear system (each light an equation mod 2) via Gaussian elimination → solution or 'unsolvable'.", alt: "Lights Out: plus-shape toggles solved as a GF(2) linear system." }),
];

const EXERCISES = [
  // Blackjack
  pm({ topicId: "lld_m21_t1", exerciseId: "lld_m21_t1_pm_1", position: 1, level: "hard", title: "Soft Ace",
    scenario: "How do you compute a Blackjack hand's value with Aces?",
    options: ["Count Aces as 11, then demote to 1 while the total > 21", "Always 11", "Always 1", "Ask the player each time"], correct: "Count Aces as 11, then demote to 1 while the total > 21",
    explanation: "Maximize without busting: start Aces at 11 and drop to 1 as needed — the soft-Ace rule." }),
  pm({ topicId: "lld_m21_t1", exerciseId: "lld_m21_t1_pm_2", position: 2, level: "medium", title: "Dealer",
    scenario: "The dealer's play is modelled as…",
    options: ["A fixed rule (hit until ≥17), not a choice", "Player input", "Random", "A Singleton"], correct: "A fixed rule (hit until ≥17), not a choice",
    explanation: "The dealer follows mandatory rules; model as a Strategy/rule object, not a decision." }),
  pm({ topicId: "lld_m21_t1", exerciseId: "lld_m21_t1_pm_3", position: 3, level: "medium", title: "Round flow",
    scenario: "A round is best modelled as…",
    options: ["A State machine: BETTING → DEALING → PLAYER_TURNS → DEALER_TURN → SETTLE", "One big function", "A loop with flags", "A queue"], correct: "A State machine: BETTING → DEALING → PLAYER_TURNS → DEALER_TURN → SETTLE",
    explanation: "State enforces legal actions per phase; settlement compares totals (blackjack pays 3:2)." }),
  // Wordle
  pm({ topicId: "lld_m21_t2", exerciseId: "lld_m21_t2_pm_1", position: 1, level: "hard", title: "The famous bug",
    scenario: "Correct Wordle feedback with duplicate letters requires…",
    options: ["A two-pass, count-based algorithm (greens first, then yellows by remaining count)", "Checking 'is letter in word' per position", "Sorting the letters", "Only marking greens"], correct: "A two-pass, count-based algorithm (greens first, then yellows by remaining count)",
    explanation: "Greens consume letters from the answer's counts; yellows use what's left — handling duplicates correctly." }),
  pm({ topicId: "lld_m21_t2", exerciseId: "lld_m21_t2_pm_2", position: 2, level: "medium", title: "Order of passes",
    scenario: "Why mark greens before yellows?",
    options: ["Greens have priority and consume letters, so yellows don't over-count", "Yellows are rarer", "It's faster", "Greens are easier"], correct: "Greens have priority and consume letters, so yellows don't over-count",
    explanation: "Exact matches claim their letters first; remaining counts then drive yellow vs gray." }),
  pm({ topicId: "lld_m21_t2", exerciseId: "lld_m21_t2_pm_3", position: 3, level: "easy", title: "Validation",
    scenario: "Each guess must be validated as…",
    options: ["Correct length AND a real dictionary word", "Any 5 characters", "Only length", "Not validated"], correct: "Correct length AND a real dictionary word",
    explanation: "Use a set/trie to confirm the guess is a valid word of the right length." }),
  // Mastermind
  pm({ topicId: "lld_m21_t3", exerciseId: "lld_m21_t3_pm_1", position: 1, level: "hard", title: "Whites with repeats",
    scenario: "After counting blacks, white pegs are counted by…",
    options: ["Summing per-color min(remaining-in-secret, remaining-in-guess)", "Counting any matching color anywhere", "Subtracting blacks from N", "Random"], correct: "Summing per-color min(remaining-in-secret, remaining-in-guess)",
    explanation: "Min-of-remaining-counts per color avoids double-counting repeated colors." }),
  pm({ topicId: "lld_m21_t3", exerciseId: "lld_m21_t3_pm_2", position: 2, level: "medium", title: "Order",
    scenario: "Blacks must be counted…",
    options: ["First, removing those pegs before counting whites", "After whites", "Together with whites", "Last"], correct: "First, removing those pegs before counting whites",
    explanation: "Exact matches are consumed first so they don't also count as whites (like Wordle greens)." }),
  pm({ topicId: "lld_m21_t3", exerciseId: "lld_m21_t3_pm_3", position: 3, level: "easy", title: "Constraint",
    scenario: "For an N-peg code, blacks + whites is…",
    options: ["At most N", "Always N", "At most 2N", "Unbounded"], correct: "At most N",
    explanation: "Each peg contributes to at most one of black/white, so their sum can't exceed N." }),
  // Yahtzee
  pm({ topicId: "lld_m21_t4", exerciseId: "lld_m21_t4_pm_1", position: 1, level: "medium", title: "Categories",
    scenario: "The 13 scoring categories are best modelled as…",
    options: ["A scoring Strategy per category (qualify → score, else 0)", "A giant if/else", "One formula", "Random scores"], correct: "A scoring Strategy per category (qualify → score, else 0)",
    explanation: "Each category is a rule computing a score from the dice — extensible, like Bowling/Poker scoring." }),
  pm({ topicId: "lld_m21_t4", exerciseId: "lld_m21_t4_pm_2", position: 2, level: "medium", title: "The turn",
    scenario: "A Yahtzee turn is…",
    options: ["Up to 3 rolls, keeping any subset between rolls, then assign to one category", "One roll only", "Unlimited rolls", "Roll until you get a Yahtzee"], correct: "Up to 3 rolls, keeping any subset between rolls, then assign to one category",
    explanation: "Roll, keep/re-roll up to twice more, then score the result into one unused category." }),
  pm({ topicId: "lld_m21_t4", exerciseId: "lld_m21_t4_pm_3", position: 3, level: "medium", title: "Assignment",
    scenario: "After rolling, the player must…",
    options: ["Assign the dice to exactly one UNUSED category (possibly scoring 0)", "Score all categories", "Skip if nothing fits", "Re-roll forever"], correct: "Assign the dice to exactly one UNUSED category (possibly scoring 0)",
    explanation: "Each turn fills one category (locked after); a non-fitting roll may be sacrificed for 0." }),
  // Boggle
  pm({ topicId: "lld_m21_t5", exerciseId: "lld_m21_t5_pm_1", position: 1, level: "hard", title: "The key optimization",
    scenario: "What makes finding all Boggle words tractable?",
    options: ["A dictionary trie pruning any DFS branch whose prefix isn't a word-prefix", "Checking each path against a hash set", "Sorting the grid", "Limiting word length to 3"], correct: "A dictionary trie pruning any DFS branch whose prefix isn't a word-prefix",
    explanation: "Trie prefix-pruning kills the exponential dead-end paths a hash set can't prune." }),
  pm({ topicId: "lld_m21_t5", exerciseId: "lld_m21_t5_pm_2", position: 2, level: "medium", title: "Adjacency",
    scenario: "A Boggle word is a chain of cells that are…",
    options: ["8-directionally adjacent, each used once per word", "Anywhere in the grid", "In the same row only", "Reusable within a word"], correct: "8-directionally adjacent, each used once per word",
    explanation: "DFS extends to unvisited 8-dir neighbors; a cell can't repeat within one word." }),
  pm({ topicId: "lld_m21_t5", exerciseId: "lld_m21_t5_pm_3", position: 3, level: "medium", title: "Backtrack",
    scenario: "Visited cells must be…",
    options: ["Marked on the current path, then un-marked on backtrack (reusable across words)", "Marked permanently", "Never marked", "Sorted"], correct: "Marked on the current path, then un-marked on backtrack (reusable across words)",
    explanation: "Mark to prevent reuse within a word; un-mark on backtrack so other words can use the cell." }),
  // Hangman
  pm({ topicId: "lld_m21_t6", exerciseId: "lld_m21_t6_pm_1", position: 1, level: "easy", title: "The display",
    scenario: "The masked word shown to the player should be…",
    options: ["Derived from secret + guessed set (not stored separately)", "Stored and edited directly", "Random", "The full word"], correct: "Derived from secret + guessed set (not stored separately)",
    explanation: "Deriving the display from the source of truth avoids inconsistency bugs." }),
  pm({ topicId: "lld_m21_t6", exerciseId: "lld_m21_t6_pm_2", position: 2, level: "medium", title: "Wrong guess",
    scenario: "A guessed letter NOT in the word should…",
    options: ["Decrement remaining attempts (lives)", "Reveal a random letter", "End the game", "Be ignored"], correct: "Decrement remaining attempts (lives)",
    explanation: "Wrong guesses cost a life; correct ones reveal positions with no penalty; repeats are rejected." }),
  pm({ topicId: "lld_m21_t6", exerciseId: "lld_m21_t6_pm_3", position: 3, level: "easy", title: "Win",
    scenario: "The player wins when…",
    options: ["Every letter of the secret has been guessed (no blanks left)", "They guess any letter", "Attempts reach 0", "After 6 guesses"], correct: "Every letter of the secret has been guessed (no blanks left)",
    explanation: "Win when the display is fully revealed; lose when attempts hit 0." }),
  // Memory
  pm({ topicId: "lld_m21_t7", exerciseId: "lld_m21_t7_pm_1", position: 1, level: "medium", title: "Turn state",
    scenario: "The key state in a Memory turn is…",
    options: ["Tracking the first flipped card, then resolving on the second", "Just the score", "The whole board only", "Nothing"], correct: "Tracking the first flipped card, then resolving on the second",
    explanation: "A turn flips two cards; remember the first to compare/resolve when the second flips." }),
  pm({ topicId: "lld_m21_t7", exerciseId: "lld_m21_t7_pm_2", position: 2, level: "medium", title: "No match",
    scenario: "When two flipped cards don't match, they…",
    options: ["Flip back to face-down after a brief reveal", "Stay up", "Are removed", "Swap positions"], correct: "Flip back to face-down after a brief reveal",
    explanation: "Show them briefly (to memorize), then reset to face-down; a match stays MATCHED." }),
  pm({ topicId: "lld_m21_t7", exerciseId: "lld_m21_t7_pm_3", position: 3, level: "medium", title: "Locking",
    scenario: "During the reveal/resolution you must…",
    options: ["Block flipping a third card (and matched/already-up cards)", "Allow any flips", "Shuffle the board", "End the turn"], correct: "Block flipping a third card (and matched/already-up cards)",
    explanation: "Input must be locked mid-resolution; you can't flip a matched or already-face-up card." }),
  // Lights Out
  pm({ topicId: "lld_m21_t8", exerciseId: "lld_m21_t8_pm_1", position: 1, level: "medium", title: "The move",
    scenario: "Pressing a cell in Lights Out…",
    options: ["Toggles that cell AND its orthogonal neighbors (XOR a plus-shape)", "Toggles only that cell", "Toggles the whole row", "Toggles diagonals"], correct: "Toggles that cell AND its orthogonal neighbors (XOR a plus-shape)",
    explanation: "A press flips the pressed cell and its up/down/left/right neighbors." }),
  pm({ topicId: "lld_m21_t8", exerciseId: "lld_m21_t8_pm_2", position: 2, level: "hard", title: "Solution shape",
    scenario: "Because press-twice cancels and order doesn't matter, a solution is…",
    options: ["A subset of cells to press (each pressed 0 or 1 times)", "A long ordered sequence of presses", "Always pressing every cell", "Impossible to find"], correct: "A subset of cells to press (each pressed 0 or 1 times)",
    explanation: "Toggles commute and self-cancel, so only WHICH cells to press matters — a subset." }),
  pm({ topicId: "lld_m21_t8", exerciseId: "lld_m21_t8_pm_3", position: 3, level: "hard", title: "Solver",
    scenario: "The efficient way to solve any board is…",
    options: ["Gaussian elimination over GF(2) (a linear system; detects unsolvable)", "Brute-force all move sequences", "Random presses", "Always solvable, just press all"], correct: "Gaussian elimination over GF(2) (a linear system; detects unsolvable)",
    explanation: "Each light is an equation mod 2; solving the linear system finds a solution or proves none exists." }),
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
  console.log(`\nDone — M21 Classic Games II seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
