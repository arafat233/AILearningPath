# DSA Animator Gap Checklist — dsaanimator.com cross-verification (2026-06-03)

> Missing problems found by comparing our Pro Java DSA track (M29–M48, ~900
> exercises) against dsaanimator.com's ~170 animated LeetCode problems.
> **35 content items** (30 high-value + 5 to seed a new Greedy/Intervals module)
> split across two Claude CLI sessions. Each session owns WHOLE MODULES so the
> two never edit the same seed file or DB module concurrently.
>
> A second, non-parallel **Track 2 (platform features)** is listed at the bottom
> — those are architectural and are NOT part of the two-CLI content split.

## ⚠️ Coordination rules (read first)

1. **Stay in your lane (disjoint modules):**
   - **Session A** touches ONLY `java_m30`, `java_m30_5`, `java_m35`, `java_m39`, `java_m47`.
   - **Session B** touches ONLY `java_m31`, `java_m37`, `java_m40`, `java_m41`, and the NEW module `java_m41_5`.
   - Never cross over. Never touch `java_m33` (owned by the other checklist).
2. **Additive idempotent seeds only.** One new seed file per session:
   `config/seedDsaAnimatorGapsA.js` / `config/seedDsaAnimatorGapsB.js`.
   `updateOne({exerciseId}, {$set:...}, {upsert:true})`. Do NOT edit the original
   big module seeds. **Template to copy: `config/seedDsaGapsB.js`** (built last session — same `mk()` helper, same shape).
3. **exerciseId convention (validator-enforced):**
   `^[a-z][a-z0-9_]*_m\d+_t\d+_(ex|pm)_\d+$` → e.g. `java_m30_t1_ex_14`.
   Use `_ex_` for everything; `_pm_` ONLY for `pattern_match` type. Wrong → 422 on
   the live API.
4. **Exercise doc shape** (collection `proexercises`): `exerciseId, topicId, moduleId,
   trackKey:"pro_java", position, level (warmup|easy|medium|hard), type, title,
   instructions, expectedSolution, hints[], testCases[], starterCode, scenario,
   blanks[], difficulty, xpReward`. The `mk()` helper in `seedDsaGapsB.js` fills
   moduleId/topicId/difficulty/xp automatically.
5. **THIS MODULE FAMILY'S grading convention** (verified — differs from the 2D template!):
   - `code_scratch` → `expectedSolution` is a COMPLETE runnable program that PRINTS
     its result; `testCases: [{ type:"execution", expected_stdout_contains:[ "<result in Arrays.toString / List.toString '[a, b, c]' format>", "<a complexity tagline the program prints>" ] }]`.
   - `predict_output` (traces) → `testCases: [{ type:"text_match", expected:"..." }]`, no compiler.
   - `starterCode` is usually `""`.
6. **Positions:** query `max(position)` for the target topic and append after the
   real exercises. NOTE: `m30`, `m37`, `m41` topics contain a stray `pm_1@99` —
   ignore it; the real max is ~12, so use positions **13, 14, …**. Just keep each
   `_ex_N` unique within the topic.
7. **Verify before commit** (per the proven Session-B flow):
   1. Run your seed twice → byte-identical output (idempotent), `0 missing`, `0 invalid level/type`.
   2. Confirm per-topic counts went up by the expected amount.
   3. **Live HTTP round-trip** against the running dev server on `:5001`:
      - mint a token for an *enrolled* user: pull `proprogresses.findOne({trackKey:"pro_java"}).userId`, then `jwt.sign({id}, process.env.JWT_SECRET)`.
      - `GET /api/v1/pro/exercises/<id>` → **200** (validator passes = no 422); the API intentionally HIDES `expectedSolution`/`testCases` (anti-cheat) — that's correct.
      - `GET /api/v1/pro/topics/<topicId>/exercises` → count increased.
   4. **No prod release.** Local DB only.
8. Pro modules are NOT in `CONTENT_STATUS.md` / `BLUEPRINT.md` (those are the
   school side) — no status-doc update needed. **Exception:** Session B's NEW
   module `java_m41_5` should bump `ProTrack.totalModules` (or just leave it for a
   later recount) and be reflected in any frontend module-list map if one is hardcoded.
9. Each problem = **one `code_scratch` exercise** unless a `+trace` is noted (then
   also add one `predict_output`). Keep each program correct & hand-verified; set
   `expected_stdout_contains` to the EXACT printed strings.

---

## 🅰️ SESSION A — Modules M30, M30.5, M35, M39, M47 — 19 items

> ✅ **COMPLETE + JUDGE0-VERIFIED 2026-06-03** — `config/seedDsaAnimatorGapsA.js`
> (23 docs incl. 4 traces). Idempotent, 0 invalid, 0 missing. All 23 verified
> HTTP 200 as an enrolled user, **AND all 19 `code_scratch` programs executed on
> Judge0 (JDK 21) → compile + run + correct output (18/19 first pass; the 1 miss
> was a testcase typo, fixed below → 19/19). (4 predict_output traces verified by
> shape, not executed.)**
>
> **Bug found by Judge0 execution & FIXED 2026-06-03 (smoke-test session):**
> `java_m47_t4_ex_3` (Single Number II #137) — program correct (prints 3, 99) but
> its `expected_stdout_contains` had `"every 3rd occurrence"` while the program
> prints `"...on its 3rd occurrence"` → a CORRECT student answer would have been
> graded wrong. Fixed to `"3rd occurrence"` in the seed (line ~586) + DB; re-verified
> 7/7 PASS on Judge0. (The HTTP-200 check can't catch this — the API hides
> testCases, so only real execution surfaces output mismatches. Recommend adding
> `npm run smoke:dsa` to the verify flow.)
>
> **Bonus fix applied (approved 2026-06-03):** the validator regex in
> `validators/proValidator.js` was broadened from `_m\d+_t\d+` to
> `_m\d+(_\d+)?_t\d+` (module/topic/exercise/project patterns). This was a
> PRE-EXISTING bug — the `m30_5` module id (the `_5`) was rejected, making the
> ENTIRE M30.5 module (all 37 exercises) unreachable via `/exercises/:id` &
> `/topics/:id`. Now M30.5 (mine #36/#59 + the existing 37) all return 200; normal
> ids and the track/module route still 200 (no regression). Not committed.

### M30 — Array Patterns (4)  — ✅ all live + Judge0-verified
- [x] **#121 Best Time to Buy and Sell Stock** — `java_m30_t5_ex_16` — `code_scratch` — single pass, track min-so-far + max profit.
- [x] **#88 Merge Sorted Array** — `java_m30_t1_ex_16` (Two Pointers) — `code_scratch` — merge in-place from the back, two pointers.
- [x] **#643 Maximum Average Subarray I** — `java_m30_t2_ex_16` (Sliding Window) — `code_scratch` — fixed-size window sum.
- [x] **#1004 Max Consecutive Ones III** — `java_m30_t2_ex_17` (+trace `ex_18`) — `code_scratch` — variable window, at most k zeros.

### M30.5 — 2D Array / Matrix (2)  — ✅ all live + Judge0-verified
- [x] **#36 Valid Sudoku** — `java_m30_5_t1_ex_13` — `code_scratch` — 3 HashSets (row/col/box), box key = (r/3)*3+c/3.
- [x] **#59 Spiral Matrix II** — `java_m30_5_t1_ex_14` — `code_scratch` — generate n×n spiral with 4 shrinking boundaries.

### M35 — Trees & BST (2)  — ✅ all live + Judge0-verified
- [x] **#105 Construct Binary Tree from Preorder & Inorder** — `java_m35_t2_ex_13` (+trace `ex_14`) — `code_scratch` — recurse: preorder[0]=root, split inorder by root index; HashMap for inorder indices.
- [x] **#637 Average of Levels in Binary Tree** — `java_m35_t1_ex_17` — `code_scratch` — level-order BFS, average per level (use long to avoid overflow).

### M39 — Binary Search (4)  *(topics t1/t2 are literally named for these — fills their promise)*  — ✅ all live + Judge0-verified
- [x] **#34 Find First and Last Position** — `java_m39_t1_ex_6` — `code_scratch` — two binary searches (leftmost / rightmost).
- [x] **#4 Median of Two Sorted Arrays** — `java_m39_t2_ex_6` (+trace `ex_7`) — `code_scratch` — binary search partition on the smaller array, O(log min(m,n)).
- [x] **#410 Split Array Largest Sum** — `java_m39_t2_ex_8` — `code_scratch` — binary search on the answer (max subarray sum), greedy feasibility check.
- [x] **#1011 Capacity to Ship Packages Within D Days** — `java_m39_t2_ex_9` — `code_scratch` — binary search on capacity, greedy day count.

### M47 — Bit Manipulation (7)  — ✅ all live + Judge0-verified
- [x] **#191 Number of 1 Bits (Hamming weight)** — `java_m47_t3_ex_4` (+trace `ex_5`) — `code_scratch` — `n &= (n-1)` clears lowest set bit; count iterations.
- [x] **#231 Power of Two** — `java_m47_t3_ex_6` — `code_scratch` — `n>0 && (n&(n-1))==0`.
- [x] **#338 Counting Bits** — `java_m47_t3_ex_7` — `code_scratch` — DP `bits[i]=bits[i>>1]+(i&1)`.
- [x] **#137 Single Number II** — `java_m47_t4_ex_3` — `code_scratch` — two-state (ones/twos) bitmask. *(testcase tagline fixed 2026-06-03)*
- [x] **#260 Single Number III** — `java_m47_t4_ex_4` — `code_scratch` — XOR all, split by a differing bit.
- [x] **#371 Sum of Two Integers** — `java_m47_t2_ex_4` — `code_scratch` — add without `+`: XOR (sum) + carry `(a&b)<<1` loop.
- [x] **#389 Find the Difference** — `java_m47_t2_ex_5` — `code_scratch` — XOR all chars of both strings.

**Session A target: ~19 exercises (+3 traces).**

---

## 🅱️ SESSION B — Modules M31, M37, M40, M41 + NEW M41.5 — 16 items

> ✅ **COMPLETE 2026-06-03** — `config/seedDsaAnimatorGapsB.js` (17 docs incl. 1
> trace) + NEW module `java_m41_5` "DSA: Greedy & Intervals" (moduleNumber 41.5)
> with 2 fully-authored topics (Greedy T1, Intervals T2). Idempotent, 0 invalid,
> 0 missing. ProTrack totals recomputed (modules 52→53, topics 264, exercises
> 3298). All 17 verified HTTP 200 as an enrolled user; the new module route +
> both topics reachable (T1 serves 2, T2 serves 3) — the m30_5 validator fix also
> covers `m41_5`. **AND all 16 `code_scratch` programs executed on Judge0
> (JDK 21) → 16/16 compile + run + correct output, including the 5 new
> Greedy/Intervals problems** (1 predict_output trace verified by shape).
> Not committed.

### M31 — String Algorithms (3)  — ✅ all live + Judge0-verified
- [x] **#567 Permutation in String** — `java_m31_t4_ex_16` (Anagram & Frequency) — `code_scratch` — fixed sliding window + freq array match.
- [x] **#271 Encode and Decode Strings** — `java_m31_t1_ex_16` — `code_scratch` — length-prefix encoding (`len#str`), parse on decode.
- [x] **#1189 Maximum Number of Balloons** — `java_m31_t4_ex_17` — `code_scratch` — char freq, min over "balloon" letters (l,o halved).

### M37 — Graphs (3)  — ✅ all live + Judge0-verified
- [x] **#399 Evaluate Division** — `java_m37_t2_ex_7` — `code_scratch` — weighted graph, DFS product along path (or weighted Union-Find).
- [x] **#417 Pacific Atlantic Water Flow** — `java_m37_t2_ex_8` — `code_scratch` — DFS/BFS from BOTH oceans' borders inward, intersect reachable sets.
- [x] **#1971 Find if Path Exists in Graph** — `java_m37_t1_ex_8` — `code_scratch` — Union-Find or BFS/DFS connectivity.

### M40 — Backtracking (2)  — ✅ all live + Judge0-verified
- [x] **#22 Generate Parentheses** — `java_m40_t1_ex_4` (+trace `ex_5`) — `code_scratch` — backtrack with open/close counts (open<n, close<open).
- [x] **#90 Subsets II** — `java_m40_t2_ex_5` — `code_scratch` — sort, skip duplicate at same depth (`i>start && a[i]==a[i-1]`).

### M41 — Dynamic Programming (3)  — ✅ all live + Judge0-verified
- [x] **#746 Min Cost Climbing Stairs** — `java_m41_t2_ex_5` — `code_scratch` — `dp[i]=cost[i]+min(dp[i-1],dp[i-2])`.
- [x] **#213 House Robber II** — `java_m41_t2_ex_6` — `code_scratch` — circular: max(rob 0..n-2, rob 1..n-1).
- [x] **#120 Triangle** — `java_m41_t3_ex_5` — `code_scratch` — bottom-up DP, in-place from the second-last row.

### 🆕 M41.5 — NEW MODULE "DSA: Greedy & Intervals" (5)  *(closes the structural gap)*  — ✅ all live + Judge0-verified
> Module + 2 topics created (mirrors `seedM30_5_2dArrayModule.js`):
> - [x] module `java_m41_5` "DSA: Greedy & Intervals", `moduleNumber:41.5`, `prerequisites:["java_m41"]`, `status:"live"`
> - [x] topic `java_m41_5_t1` "Greedy — Locally Optimal Choices"
> - [x] topic `java_m41_5_t2` "Intervals — Merge, Insert, Sweep Line"
>
> **Greedy (t1):**
> - [x] **#134 Gas Station** — `java_m41_5_t1_ex_1` — `code_scratch` — total≥0 feasibility + reset start when running tank<0.
> - [x] **#135 Candy** — `java_m41_5_t1_ex_2` — `code_scratch` — two passes (L→R then R→L), max of both.
>
> **Intervals (t2):**
> - [x] **#57 Insert Interval** — `java_m41_5_t2_ex_1` — `code_scratch` — 3 phases: before / merge-overlap / after.
> - [x] **#435 Non-overlapping Intervals** — `java_m41_5_t2_ex_2` — `code_scratch` — sort by end, greedy keep, count removals.
> - [x] **#452 Minimum Arrows to Burst Balloons** — `java_m41_5_t2_ex_3` — `code_scratch` — sort by end, count non-overlapping groups.
>
> *(Optional, for a fuller module later: relocate/duplicate #56 Merge Intervals & #253 Meeting Rooms II here from M38; add #455 Assign Cookies / #860 Lemonade Change to round out Greedy.)*

**Session B target: ~16 exercises + 1 new module + 2 topics (+1 trace).**

---

## Already covered — do NOT rebuild ✅
These dsaanimator problems exist in our track (sometimes untagged):
#344 Reverse String (M31), #102 Level Order (M33/M35), #509 Fibonacci (M29),
#875 Koko (M39), #268 Missing Number (M47), #787 Cheapest Flights (M37),
#876 Middle of List (M32), #45/#55 Jump Game, #56 Merge Intervals & #253 Meeting
Rooms II (M38), plus all of Heap, Stack, and most Arrays/Strings/Tree/LinkedList/DP.

**Low-value easies — ✅ ADDED 2026-06-03 (`seedDsaAnimatorEasies.js`, M30):**
#832 Flipping Image, #1470 Shuffle Array, #1480 Running Sum, #1672 Richest Customer,
#1929 Concat of Array, #2239 Closest to Zero.

**Optional polish — ✅ ALL DONE 2026-06-03:**
- Animation player expanded to **21 problems** (`seedAnimationBatch2.js`: +Sort Colors, Trapping Rain Water, Search Insert, Valid Parens, Eval RPN, Min Stack, 01 Matrix, Surrounded Regions).
- Template library expanded to **26 patterns** (+queue, matrix, palindrome, pattern-matching).
- M41.5 rounded out (`seedM415Extras.js`: Merge Intervals #56, Meeting Rooms II #253, Assign Cookies #455, Lemonade Change #860).

## Score
| Category | dsaanimator | we're adding | after |
|---|--:|--:|--:|
| Arrays | 28 | 4 | full (high-value) |
| Matrix | 9 | 2 | full |
| Trees | 20 | 2 | full |
| Binary Search | 11 | 4 | full |
| Bit Manipulation | 8 | 7 | full |
| Strings | 17 | 3 | full |
| Graph | 10 | 3 | full |
| Backtracking | 9 | 2 | full |
| DP | 14 | 3 | full |
| Greedy | 4 | 2 (new module) | first-class |
| Intervals | 5 | 3 (new module) | first-class |
| **Total content** | | **35** | |

---

## 🧩 TRACK 2 — Platform feature parity (NOT for the two-CLI content split)
> These are where dsaanimator genuinely beats us. Architectural — schedule
> separately, one owner each. Listed for completeness so nothing is forgotten.

- [x] **Step-by-step animation player** ✅ (2026-06-03) — their core USP. Exercise-level,
      step-array-driven player on `ProExercise.animation`; 3 renderers, **all 4 pilot
      patterns done, 13 flagship problems animated**. (Remaining acceptance: browser
      pixel QA at localhost:5173 — build + API verified, not yet eyeballed.) Built
      one pattern at a time:
  - [x] `animation` schema (Mixed) on `proexercises` + auto-exposed by `getExercise` (2026-06-03)
  - [x] frontend `<StepPlayer>` component — array-pointers renderer, play/pause/step/scrub, window shading, per-cell marks (`components/pro/StepPlayer.jsx`); wired into `ProExerciseRunner` left column
  - [x] **Pattern 1 — two-pointers** ✅ (`seedAnimationTwoPointers.js`): #167 Two Sum II (converging), #11 Container With Most Water (move-shorter), #26 Remove Duplicates (slow/fast). API + build verified; browser eyeball pending.
  - [x] **Pattern 2 — sliding-window** ✅ (`seedAnimationSlidingWindow.js`): #643 Max Avg (fixed window), #209 Min Size Subarray Sum, #3 Longest Substring w/o Repeat, #1004 Max Consecutive Ones III. Reused renderer (no frontend change); API verified.
  - [x] **Pattern 3 — monotonic-stack** ✅ (`seedAnimationMonotonicStack.js` + new `stack` renderer): #496 Next Greater Element, #739 Daily Temperatures, #84 Largest Rectangle. StepPlayer refactored into shared-shell + per-kind stages (input row + cursor / stack row / output row). Build + API verified.
  - [x] **Pattern 4 — grid BFS/DFS** ✅ (`seedAnimationGrid.js` + new `grid` renderer): #200 Number of Islands (DFS sink), #733 Flood Fill (DFS recolor), #994 Rotting Oranges (multi-source BFS). Build + API verified.
- [x] **Pattern layer + Pattern Quiz.** ✅ DONE (2026-06-03): `pattern` tag on 767
      DSA exercises (33 patterns), filterable via `/practice?pattern=`. **Pattern Quiz**
      "which pattern fits?" — `GET /v1/pro/tracks/:slug/pattern-quiz?n=` (`getPatternQuiz`
      svc, 4-choice MCQ from real LC problems, unit-tested 3/3) + `ProPatternQuiz` page at
      `/pro/:trackSlug/pattern-quiz` (instant feedback + score), linked from the Pattern
      Atlas. Build + API verified.
- [x] **P1/P2/P3 interview-priority tags** ✅ DONE (2026-06-03): `priority` field
      (P1=193/P2=151/P3=423) + Must-Do path `GET /v1/pro/tracks/:slug/practice?priority=P1`
      (`getPracticeList`, validated, unit-tested); badges on exercise rows.
- [x] **Canonical LeetCode identity pass** ✅ DONE (2026-06-03): `leetcodeId` backfilled
      from titles (344 exercises) + shown as "LC #N" badge on exercise rows.
- [x] **Reusable code-template library** ✅ DONE (2026-06-03): `data/proCodeTemplates.js`
      — Java skeletons for 22 patterns (~30 templates) keyed by the `pattern` tag;
      `TemplatePanel` (collapsible, Copy + Insert-into-editor) in `ProExerciseRunner`,
      auto-shown for the exercise's pattern. Build verified.
- [x] **Focus mode** + status states ✅ DONE (2026-06-03): Focus toggle in
      `ProExerciseRunner` (hides the problem column, widens the editor for a
      distraction-free view); **Solved ✓** badges per exercise + "(x/N solved)" in
      the Exercises heading on `ProTopicView`, driven by `proGetProgress`
      (`completedExercises`). Build + API verified. ("Needs revision" already
      surfaced via the existing spaced-repetition `/pro/review` flow.)

**✅ ALL Track-2 items complete (2026-06-03).**

## Notes
- Built on the proven `seedDsaGapsB.js` additive pattern (Session B, 2026-06-02):
  idempotent, lane-isolated, verified by live HTTP round-trip as an enrolled user.
- Full comparison rationale: see the DSA Animator report (chat, 2026-06-03).
- Source: https://dsaanimator.com/ (sitemap = 259 URLs; ~170 animated problems).
