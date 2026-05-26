# Stellar Pro-Track — v3 Roadmap

> Living document. Update after every completed task. Phase exits are gated
> by acceptance criteria, not by ticking boxes.

**Last updated:** 2026-05-26 (A9-A53 wired — 41 visualizer kinds live on 44 topics; awaiting browser acceptance)
**Current release:** `pilot-pro-java-v2.1` (content + acceptance verified)
**Author of this plan:** session 2026-05-26, Najeeb + Claude

---

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done — note the commit SHA + date inline
- `[-]` deferred / dropped (record why)

---

## Where we are (v2.1 baseline)

- 46 modules / 232 topics / 3,311 exercises / 232 projects / 168,365 XP
- Backend models: ProTrack / ProModule / ProTopic / ProExercise / ProProject / ProSubmission / ProProgress
- Test-case shapes verified end-to-end: `expected_stdout` (exact + whitespace-tolerant) · `expected_stdout_contains` · `text_match` · `code_analysis` · `must_compile` aliases · `stdin` per case · `expected_output_pattern`
- Frontend: tiered ProCourseLanding · ProModuleView with difficulty pips + completion · ProTopicView · ProExerciseRunner (Judge0-backed)
- Acceptance test: `scripts/acceptanceTestV2.mjs` — 4/4 PASS against live stack

**Known gaps not addressed in this roadmap (filed for later):** modern Java features in M4-M8 content; ArrayList gated by 17 OOP topics before M6; M4-T1 difficulty cliff (10 concepts in one topic). These are content rewrites, not features.

---

## Phase 1 — Foundation Polish (target: 1 week)

Goal: ship the visualizer + tutor + pattern-recognition trinity that defines Stellar's pedagogical moat against ChatGPT + LeetCode.

**Phase exit criteria:**
- A learner on M39 Binary Search can see the algorithm animate
- A learner stuck on an exercise can ask the in-app tutor for a hint and receive a Socratic question (not the answer)
- A new "Pattern Drill" mode exists on at least 3 modules with 5+ questions each

---

### A. Visualizer Port (1–2 days)

Source projects: `~/Downloads/dsalearn/` + `~/Downloads/dsa-visualizer 2/`. See architecture note in [PROJECT decisions / 2026-05-26 visualizer architecture].

- [x] **A1.** Create `ai-learning-frontend/frontend/src/components/dsa/` directory — done 2026-05-26. Also added `framer-motion ^12.40.0` to frontend deps (was missing; both source projects depend on it).
- [x] **A2.** Port `ArrayBars` component from `dsa-visualizer 2/src/components/ArrayBars.tsx` — done 2026-05-26. Also ported `types/animation.ts` → `types.js` (JSDoc, unified with dsalearn's StepType: 15 step kinds) and `utils/generateArray.ts` → `utils/generateArray.js`.
- [x] **A3.** Port `LinkedListVisualizer.tsx` from `dsalearn/components/visualizers/` — done 2026-05-26. JSX with framer-motion `AnimatePresence` for node insertion/deletion.
- [x] **A4.** Port `StackVisualizer.tsx` from `dsalearn/components/visualizers/` — done 2026-05-26. Push slides in from top, pop exits to the right.
- [x] **A5.** Port `TreeVisualizer.tsx` from `dsalearn/components/visualizers/` — done 2026-05-26. SVG-based, recursive position layout with x-coord normalisation so deep trees stay in viewport.
- [x] **A6.** Port step-generators: 8 of them — done 2026-05-26. All 5 sorts (bubble/insertion/selection/merge/quick) under unified `AlgorithmDef` shape in `algorithms/registry.js`. Plus binarySearch, linearSearch (BinarySearchFrame/LinearSearchFrame shape for L/R/mid pointers), linkedList (3 ops: intro/insert/delete). Smoke-tested all 8 — each produces correct step counts on [5,2,8,1,9,3]. Also ported `ArrayVisualizer.jsx` (originally marked "skip" but search algos need pointer labels which ArrayBars doesn't support).
- [x] **A7.** Port `studentRunner.ts` AS-IS — done 2026-05-26. Smoke-tested 4 cases (bubble template sorts correctly; empty mySort; missing mySort errors cleanly; infinite-loop guard at 50k steps fires).
- [x] **A8.** Build reusable `VisualizerShell.jsx` — done 2026-05-26. Dispatcher on `kind` (only `sorting-sandbox` implemented for the proof; other kinds show a "coming soon" placeholder). Also ported Controls.jsx, ExplanationPanel.jsx, StatsPanel.jsx, DSACodeEditor.jsx (Monaco wrapper — dropped Next.js dynamic() since Vite doesn't need SSR guards).
- [x] **A9.** Add `visualizer` field to `ProTopic` schema — done 2026-05-26. `Schema.Types.Mixed`, default `null`, comment explains the integration-vs-content split. `proService.getTopic()` uses `.lean()` with no `.select()` filter so the new field propagates without service changes.
- [x] **A10.** Update `ProTopicView.jsx` to render the matching visualizer component under the teaching block when `topic.visualizer` is set — done 2026-05-26. Lazy-loaded `VisualizerShell` (keeps framer-motion + Monaco out of bundles for non-DSA topics). Section appears between Visual Aid and Common Gaps with its own nav entry ("Visualize").
- [x] **A11.** Wire M38-T1 (Sorting) as the proof topic — done 2026-05-26. Added `TOPIC_VISUALIZERS` map to `seedJavaPilot.js` (integration concern; not in topic.json). Re-ran seed, verified `java_m38_t1.visualizer = {kind:"sorting-sandbox", config:{}}` persisted.
- [~] **A12.** **Acceptance:** visit `/pro/java/java_m38/java_m38_t1`, see the sort visualizer, click play, see bars animate. Toggle student mode, paste a custom sort, see it run. — backend + DB confirmed; awaiting browser confirmation from user at http://localhost:5173/pro/java/java_m38/java_m38_t1.

**Wire-up topics:**
- [x] **A13.** M30-T1 (two pointers) → `array-pointers` visualizer — done 2026-05-26. New `modes/ArrayPointersSandbox.jsx` with inline 2-sum step generator (different shape from binary search — no mid pointer, different decision rule). Uses ArrayVisualizer with L/R pointers.
- [x] **A14.** M32-T1, T3 (linked lists, reversal) → `linked-list` — done 2026-05-26. New `modes/LinkedListSandbox.jsx` with op selector (intro/insert/delete) replaying the existing linkedList.js frame generators. T3 reuses the same widget; dedicated reversal mode can be added later by extending the op selector.
- [x] **A15.** M33-T1 (stacks) → `stack` — done 2026-05-26. New `modes/StackSandbox.jsx` — fully interactive (push/pop/peek/reset) since direct manipulation reads better than a pre-recorded replay for LIFO.
- [x] **A16.** M35-T1 (tree traversal) → `tree` — done 2026-05-26. New `modes/TreeSandbox.jsx` — interactive BST insert + animated search (left/right comparison highlighted node-by-node, terminates at found or not-found).
- [x] **A17.** M39-T1 (binary search) → `binary-search` — done 2026-05-26. New `modes/BinarySearchSandbox.jsx` replaying `generateBinarySearchSteps()` frames with play/pause/step/back controls.

After A17: VisualizerShell dispatches all 6 kinds (sorting-sandbox + 5 new). Seeder map covers M30/M32/M33/M35/M38/M39. Browser acceptance pending — open each topic URL listed above.

**Net-new visualizer builds (no source-project port — built from scratch):**

- [x] **A18.** M36-T1 Heap Fundamentals → `heap` — done 2026-05-26. New `algorithms/heap.js` (sift-up insert + sift-down extract step generators) + `modes/HeapSandbox.jsx`. Renders array AND tree views from the same data via `arrayToTree()` — the "this array IS the tree" insight is the lesson, so both views update in lockstep on every frame. Commit-to-heap button lets the learner chain ops.
- [x] **A19.** M34-T1 Hash Fundamentals → `hash-table` — done 2026-05-26. New `algorithms/hashTable.js` (Java-style String.hashCode + put/get with separate chaining) + `HashTableVisualizer.jsx` (vertical bucket rows with chained entries — collisions render as horizontal chains so they're visually obvious) + `modes/HashTableSandbox.jsx`. Default capacity 8 forces real collisions after a handful of inserts.
- [x] **A20.** M31-T2 Pattern Matching → `string-matching` — done 2026-05-26. New `algorithms/kmp.js` (failure table builder + KMP search step generator) + `StringMatchVisualizer.jsx` (text + aligned pattern + failure table view; pattern row uses CSS padding-left to slide under text without re-layout) + `modes/StringMatchSandbox.jsx`. Default `"abcabc"` in `"ababcababcabcabc"` produces a real fallback and 2 overlapping matches.
- [x] **A21.** M37-T1 Graph Representation → `graph` — done 2026-05-26. New `algorithms/graph.js` (BFS via queue, DFS via explicit stack; both on adjacency-list converted from edge list) + `GraphVisualizer.jsx` (SVG with precomputed positions — force-directed layout deliberately deferred to a future iteration) + `modes/GraphSandbox.jsx`. Fixed 7-node graph with a cycle (A-B-E-D-A) and a bridge (E-G-F) so BFS vs DFS produce visibly different traversal orders.

After A21: 10 visualizer kinds live across 11 topics (M30/M31-T2/M32-T1+T3/M33/M34/M35/M36/M37/M38/M39). Remaining DSA gaps that *could* get visualizers later (none planned for now): M29 (DSA1 intro), M40 (DSA12), M41 (DSA13).

**Phase 1.A extended — T2–T5 coverage across DSA modules:**

- [x] **A22.** M30-T2 Sliding Window → `sliding-window` — done 2026-05-26. Fixed-size window with incremental sum update (sub leaving + add entering). Default [2,1,5,1,3,2,7,4,6,1] k=3 makes the increment visible.
- [x] **A23.** M30-T4 Dutch National Flag → `dutch-flag` — done 2026-05-26. 3-way partition with low/mid/high pointers; cells flip between sorted/default/compare states as the three regions grow.
- [x] **A24.** M31-T3 Palindromes → `palindrome` — done 2026-05-26. Expand-around-center, handles both odd- and even-length centres. Default "babad" → "bab" or "aba".
- [x] **A25.** M31-T5 LCS DP → `dp-grid` — done 2026-05-26. New `DPGridVisualizer.jsx` shows 2D table filling with dependency arrows + traceback path. Default "abcbdab" × "bdcaba" → "bcba" or "bdab".
- [x] **A26.** M32-T2 + T4 Floyd's Cycle → `linked-list-cycle` — done 2026-05-26. New `CycleListVisualizer.jsx` renders the cycle as an arc back to entry index with slow/fast pointer labels above nodes.
- [x] **A27.** M33-T2 Monotonic Stack → `monotonic-stack` — done 2026-05-26. Next-Greater-Element demo with stack + array + result row side-by-side. Reuses StackVisualizer + ArrayVisualizer.
- [x] **A28.** M35-T1 **rewire** → `tree-traversal` — done 2026-05-26. The old BST sandbox was on a topic actually titled "Tree Traversals" — content mismatch. New `TreeTraversalSandbox.jsx` supports inorder / preorder / postorder / level-order / zigzag with code per mode.
- [x] **A29.** M35-T3 BST Operations → `tree` — done 2026-05-26. Moved the existing TreeSandbox (BST insert + search) to this topic where it actually belongs.
- [x] **A30.** M35-T5 Trie → `trie` — done 2026-05-26. New `TrieVisualizer.jsx` (N-ary children, edge labels). Demo seeded with cat/car/card/care/dog/do/dot so shared prefixes are visible from frame 0.
- [x] **A31.** M36-T2 K-Largest → `k-largest` — done 2026-05-26. Min-heap of size K maintained while streaming; shows stream + heap-array + heap-tree in lockstep.
- [x] **A32.** M37-T3 Topological Sort → `graph-topo` — done 2026-05-26. Kahn's algorithm on a course-prerequisite DAG. Extended `GraphVisualizer` to support `directed` (arrowheads), `nodeLabels` (in-degree).
- [x] **A33.** M37-T4 Dijkstra → `graph-dijkstra` — done 2026-05-26. Weighted directed graph; `GraphVisualizer` now renders edge weights and node distance labels. PQ + visited shown below.

**After A33:** 21 visualizer kinds live across 24 topics.

**Final algorithmic coverage sweep (A34–A42):**

- [x] **A34.** M30-T3 Prefix Sums → `prefix-sums` — done 2026-05-26. Two-phase animation: build prefix array (n frames), then any range query is `prefix[R+1] − prefix[L]` in O(1). Reuses ArrayVisualizer.
- [x] **A35.** M33-T3 Queue Fundamentals → `queue` — done 2026-05-26. Interactive FIFO enqueue/dequeue/peek with FRONT and BACK labels (the entire teaching moment vs Stack). Inline horizontal renderer.
- [x] **A36.** M33-T4 Sliding Window Max → `sliding-window-max` — done 2026-05-26. Monotonic deque (distinct from monotonic stack in M33-T2): both pollFirst (out-of-window) and pollLast (smaller-than-current) animated separately.
- [x] **A37.** M35-T2 LCA → `lca` — done 2026-05-26. Recursive LCA with enter/match/recurse-L/recurse-R/return frames showing the recursion descent and bottom-up split detection. Distinct demo tree from TreeTraversal.
- [x] **A38.** M38-T2 Counting Sort → `counting-sort` — done 2026-05-26. Three phases (count, cumulative, place) each emit separate frames — the "no comparisons" insight is the lesson.
- [x] **A39.** M39-T3 Rotated Array Search → `rotated-search` — done 2026-05-26. Modified binary search that decides which half is sorted each iteration; visualizer shows the "sorted half" highlight.
- [x] **A40.** M37-T5 Union-Find → `union-find` — done 2026-05-26. New `UnionFindVisualizer.jsx` renders the parent forest; path compression and union-by-rank both animated. User can edit ops as text.
- [x] **A41.** M36-T4 K-Way Merge → `k-way-merge` — done 2026-05-26. Per-list cursor markers + min-heap of `{value, listIdx, posInList}` + output. Each pop emits its source list visually.
- [x] **A42.** M34-T5 LRU Cache → `lru` — done 2026-05-26. New `LRUVisualizer.jsx` — paired HashMap key column + horizontal DLL with head (MRU) and tail (LRU) labels; eviction badge appears when capacity exceeded.

**After A42: 30 visualizer kinds live across 33 topics.**

**A43–A50 — explicit user request to cover the previously-deferred-as-"duplicates" topics:**

- [x] **A43.** M31-T4 Anagram & Frequency → `anagram` — done 2026-05-26. Char-by-char freq increment from s1, decrement from s2; any cell going negative = mismatch. Bar chart with state per character.
- [x] **A44.** M32-T5 Merge Sorted LL → `merge-ll` — done 2026-05-26. Two pointers walking sorted lists A and B; pick smaller head each step, flush remainder when one exhausts. Distinct from LinkedListSandbox in that the comparison pointer pair is the lesson.
- [x] **A45.** M34-T4 Custom Hash Keys → `custom-hash` — done 2026-05-26. Side-by-side mode toggle: naive `row % cap` (collides badly) vs composite `(31·row + col) % cap` (spreads). Reuses HashTableVisualizer.
- [x] **A46.** M35-T4 Tree Path Problems → `tree-path` — done 2026-05-26. Root-to-leaf DFS with current-path stack visible; valid paths accumulate as green. Distinct from M35-T2 LCA (which animates bottom-up split detection vs this one's top-down sum accumulation).
- [x] **A47.** M36-T3 PQ Design → `pq-lazy` — done 2026-05-26. Min-heap with lazy deletion: tombstoned values rendered in red but physically present; pop() lazily discards them when they bubble to the root. User-editable op list.
- [x] **A48.** M37-T2 BFS/DFS Applications (Islands) → `islands` — done 2026-05-26. New `GridVisualizer.jsx` (shared with M39-T4). BFS sweep across a 5×5 grid; each connected component lights up in turn.
- [x] **A49.** M39-T2 Search on Answer → `search-on-answer` — done 2026-05-26. Koko-eating-bananas: BS on the ANSWER SPACE (eating speeds 1..max) rather than on the input array. Predicate shown explicitly per frame.
- [x] **A50.** M39-T4 2D Binary Search → `matrix-search` — done 2026-05-26. Staircase walk from top-right on a row+col-sorted matrix. Reuses GridVisualizer.

**After A50: 38 visualizer kinds live across 41 topics.**

**A51–A53 — final 3 (user-requested) "pattern application" visualizers:**

- [x] **A51.** M34-T2 HashMap Patterns → `hash-grouping` — done 2026-05-26. Group Anagrams demo. Distinct from M34-T1 because the KEY is a derived value (sorted chars), not the literal input — that derivation step is the lesson.
- [x] **A52.** M34-T3 HashSet Applications → `hash-dedup` — done 2026-05-26. Dedup-with-order-preserved. Distinct from M34-T1 because it's about membership testing (no value), and the set-growing-monotonically property is the visual.
- [x] **A53.** M38-T3 Sorting Applications → `interval-merge` — done 2026-05-26. Merge overlapping intervals — new `IntervalVisualizer.jsx` renders intervals as bars on a time axis. Two-phase: sort by start, then linear scan extending or pushing.

**After A53: 41 visualizer kinds live across 44 topics.** Coverage is now 44/50 = 88% of M30-M39. The remaining 6 are all genuinely text-only: synthesis topics (M30-T5, M33-T5, M36-T5, M38-T5, M39-T5) and string fundamentals (M31-T1).

---

### B. AI Socratic Tutor (3–5 days)

The single highest-ROI feature. Justifies a paid tier on its own.

- [ ] **B1.** Add `ANTHROPIC_API_KEY` to backend env config (`.env`, `.env.example`, deployment notes)
- [ ] **B2.** Create `ProTutorSession` Mongoose model: `{ userId, exerciseId, messages: [{ role, content, ts }], createdAt }` with 30-day TTL (same pattern as `ProSubmission`)
- [ ] **B3.** New `services/tutorService.js` with Claude API integration. System prompt baked here. Sonnet for the first iteration (better at Socratic teaching than Haiku); revisit cost after first 100 sessions.
- [ ] **B4.** System prompt + few-shot examples in `services/tutorPrompts.js`. Rules: never give the answer, ask one question at a time, reference the student's actual code, escalate hint specificity if they ask 3+ times.
- [ ] **B5.** Route `POST /api/v1/pro/tutor/ask` — body `{ exerciseId, studentCode, question }`. Auth + email allowlist + rate limit (10 questions/hour per user via Redis).
- [ ] **B6.** Build `TutorPanel.jsx` — collapsible chat sidebar in `ProExerciseRunner`. Shows conversation history for the current exercise.
- [ ] **B7.** Add 👍/👎 feedback buttons after each tutor message → write to `ProTutorSession.messages[i].rating`. Use to tune prompts.
- [ ] **B8.** Telemetry: `pro.tutor.message_sent` event with `{ exerciseId, messageLength, durationMs, model }` for later analysis.
- [ ] **B9.** Cost guardrail: refuse to send if `studentCode.length > 8000` (Claude context cost) — show "your code is too long for the tutor; please share a specific snippet".
- [ ] **B10.** **Acceptance:** open `java_m1_t6_ex_4` Scanner exercise, leave the code half-written, click "Ask tutor". Tutor responds with a question like "What does `sc.nextInt()` return when the buffer is empty?" — NOT "you need to call sc.close()". Send second message, get follow-up. Submit thumbs-up.

---

### C. Pattern Recognition Module (2–3 days)

Trains the "I smell sliding-window" instinct that wins FAANG screens.

- [ ] **C1.** Extend `ProExercise.type` enum: add `pattern_match` (currently has `code_scratch`, `fill_blank`, `predict_output`, `debug`, `refactor`, `algorithm`, `tests_pass`, `written_response`, `conceptual`).
- [ ] **C2.** Define `pattern_match` test_case shape: `{ type: "pattern_match", options: ["two_pointer", "sliding_window", ...], correct: "sliding_window", explanation: "..." }`. The "exercise" itself contains just the problem statement + options. No code execution.
- [ ] **C3.** Update `runTestCases` in `codeExecutionService.js` to handle `pattern_match` (just string compare, no sandbox call).
- [ ] **C4.** New frontend variant `PatternMatchRunner.jsx` — shows problem statement, radio buttons for pattern options, submit button. After submit: reveal correct answer + explanation, mark right/wrong.
- [ ] **C5.** Dispatcher: `ProExerciseRunner.jsx` reads `exercise.type` and routes to `CodeRunner` (existing) or `PatternMatchRunner` (new) or `PredictOutputRunner` (existing).
- [ ] **C6.** Author 20 starter pattern-match problems split across M30 (arrays — 5), M33 (stacks/queues — 5), M37 (graphs — 5), M41 (DP — 5). Use existing topic content for the problem statements (just hide the algorithm name).
- [ ] **C7.** Pattern catalog (the canonical option list): `two_pointer`, `sliding_window`, `prefix_sum`, `binary_search`, `hash_map`, `monotonic_stack`, `dfs`, `bfs`, `topological_sort`, `dynamic_programming`, `greedy`, `backtracking`, `divide_and_conquer`, `union_find`.
- [ ] **C8.** "Pattern Drill" mode: a topic-level "Practice patterns" button that loops through that topic's pattern_match exercises in a quick-fire sequence (no individual page transitions).
- [ ] **C9.** **Acceptance:** visit M30's "Pattern Drills" → answer 5 multiple-choice problems → see score (e.g. 4/5) + explanations on the misses.

---

### Phase 1 wrap-up

- [ ] **P1-wrap.** Commit + push the Phase 1 work in logical chunks (visualizer in one commit, tutor in another, pattern in a third)
- [ ] **P1-tag.** Tag `pilot-pro-java-v3.0-phase1` at HEAD
- [ ] **P1-docs.** Update `BLUEPRINT.md` track table with the three new capabilities
- [ ] **P1-test.** Extend `acceptanceTestV3.mjs` (new file) — verify pattern_match endpoint + tutor route work end-to-end

---

## Phase 2 — Differentiator Features (target: 2–3 weeks)

Goal: features that turn Stellar from "good learning platform" into "the obvious choice for Java interview prep in India."

**Phase exit criteria:**
- A learner can complete a 45-minute mock interview and receive a structured rubric
- Topics surface relevant job market data
- Completed topics resurface for review on a schedule

---

### D. Complexity Derivation System (2–3 days)

Reuses the step-trace plumbing from Phase 1.A.

- [ ] **D1.** Op-counter wrapper for step generators. Each call to `compare()` / `swap()` / `traverse()` increments a counter passed in the closure.
- [ ] **D2.** `ComplexityPlot.jsx` — line chart (using existing chart lib if any, otherwise SVG) plotting ops-executed vs `n` for the currently selected algorithm. Updates live as the user changes `n` via slider.
- [ ] **D3.** Complexity curve overlays: linear `n`, log `log n`, `n log n`, quadratic `n²`, etc. — drawn faintly behind the actual curve so the user can see which one matches.
- [ ] **D4.** "Guess the curve" widget — picks one of 5 curves, asks the user which class the actual data matches before revealing.
- [ ] **D5.** Embed under M29-T1 (Big-O notation) AND on every algorithm topic that has a visualizer.
- [ ] **D6.** **Acceptance:** visit M38 sorting, see the ops plot. Switch from bubble (n²) to merge sort (n log n), see the curve flatten dramatically. Slide n from 10 → 100, watch the bubble curve grow 100× while merge grows ~150×.

---

### E. Job Market Intelligence MVP (3–5 days)

Motivation layer — biggest retention lever per industry data.

- [ ] **E1.** One-time scrape: ~500 Java job postings from Naukri / Cutshort / LinkedIn (NOT scraping LinkedIn — TOS issue; use their public Jobs API if affordable, or paste exports manually for MVP).
- [ ] **E2.** Tag each posting with skills present. Format: `{ company, role, city, ctc_range, posted_at, skills: ["spring-boot", "kafka", ...], jd_excerpt }`. Store as `data/jobs/jobs.json` in repo (no scraper infra yet — manual is fine for MVP).
- [ ] **E3.** Skill catalog mapping: pro-track module slugs → job-skill tags. E.g. `m13_spring_boot` ↔ `spring-boot`, `spring`, `spring-mvc`.
- [ ] **E4.** Backend service `jobMarketService.js`: `getSkillStats(skill) → { count, sampleListings, avgCtcRange, topCompanies, citiesInDemand }`.
- [ ] **E5.** Backend route `GET /api/v1/jobs/skill/:skill` and `GET /api/v1/jobs/skills/summary` (track-level).
- [ ] **E6.** Frontend widget `SkillJobsCard.jsx` — shows on ProModuleView ("247 jobs need this skill in Hyderabad · ₹6-18L range · top hirers: Razorpay, Flipkart").
- [ ] **E7.** Dashboard widget `JobMarketSnapshot.jsx` — "Complete M14 to unlock 247 jobs" calls-to-action driven by user's progress vs the data.
- [ ] **E8.** **Acceptance:** visit M13 Spring Boot module, see job count + sample listings + CTC range. Click into one, see the JD excerpt.

**Phase E v2 (deferred):** automate the scrape + a weekly cron. Not required for MVP.

---

### F. Spaced Repetition (3 days)

Filed as an addition to the original 10. Per retention research, this is the single biggest learning ROI lever after the tutor.

- [ ] **F1.** Add `lastReviewedAt`, `reviewIntervalDays` to each entry in `ProProgress.completedTopics` (currently a flat string array → migrate to `[{ topicId, completedAt, lastReviewedAt, intervalDays }]`).
- [ ] **F2.** Implement SM-2 lite: intervals `1d → 3d → 7d → 14d → 30d → 90d`. On review:  if rated "got it" → next interval; if "rusty" → reset to 1d.
- [ ] **F3.** Backend route `GET /api/v1/pro/review/due` — returns topics whose `lastReviewedAt + intervalDays <= now`.
- [ ] **F4.** Frontend page `/pro/review` — list of due topics with a quick-review button each.
- [ ] **F5.** Quick-review mode: 3 multiple-choice questions per topic, 5-minute cap. Pulls questions from existing `predict_output` / `pattern_match` exercises for that topic.
- [ ] **F6.** Dashboard widget: "3 topics due for review today" prompt.
- [ ] **F7.** **Acceptance:** complete a topic, advance system clock 1 day (or wait), see topic appear in review queue. Review it. Repeat over multiple intervals.

---

### G. Problem-First Reveal Toggle (1 day — quick win)

- [ ] **G1.** Add `revealStrategy: "always" | "first_attempt"` field to `ProTopic` (default `"always"` preserves current behavior).
- [ ] **G2.** Update `ProTopicView.jsx` to hide the algorithm name and "key takeaways" behind a "Reveal" button when `revealStrategy === "first_attempt"`. Track reveal click via telemetry event.
- [ ] **G3.** Audit ~10 topics where the algorithm name in the title is the answer (e.g. M39-T1 "Binary Search basics" — flip to "Searching in sorted data" with `revealStrategy: "first_attempt"`).
- [ ] **G4.** **Acceptance:** visit M39-T1, see only the problem (search 5 million items quickly). Try to solve. Click reveal → see "this is binary search" + the full topic content.

---

### H. Interview Simulator (1–2 weeks)

The premium-tier feature. Reuses Phase 1.B tutor infrastructure.

- [ ] **H1.** New route `/pro/interview` + page `InterviewSimulator.jsx`
- [ ] **H2.** Session model `ProInterviewSession`: `{ userId, problemId, startedAt, endedAt, transcript, code, rubricScore, feedback }`
- [ ] **H3.** Pre-session: pick problem from a curated 100-problem bank (cross-cutting from M30-M41 + select interview prep modules)
- [ ] **H4.** UI: 45-minute countdown timer (top bar), code editor (Monaco), scratchpad (markdown for explanations + bullet points), AI interviewer chat (right panel)
- [ ] **H5.** Mock interviewer (Claude API, different system prompt from B): starts with the problem, accepts clarifying questions, probes after silence > 60s ("what are you thinking?"), asks complexity questions, throws curveballs ("what if input is 10 GB?")
- [ ] **H6.** Mid-session timeout warnings: 30/15/5 min remaining
- [ ] **H7.** Post-session rubric — 5 dimensions scored 1-5: clarifying questions asked, communication of approach, code quality, complexity awareness, curveball handling. Generated by Claude reading the transcript.
- [ ] **H8.** Session history page `/pro/interview/history` — past sessions with scores + transcripts
- [ ] **H9.** **Acceptance:** complete a full 45-min mock, receive a written rubric with scores and 3 specific improvement areas. Replay the transcript.

---

### Phase 2 wrap-up

- [ ] **P2-wrap.** Commits + push
- [ ] **P2-tag.** Tag `pilot-pro-java-v3.0-phase2`
- [ ] **P2-docs.** Update `BLUEPRINT.md` + `CONTENT_STATUS.md`

---

## Phase 3 — Rolling Improvements

No deadline. Ship one per week as bandwidth allows.

### I. Deep Visualizations

Each = ~1 day of work. Ranked by impact.

- [ ] **I1.** Recursion tree visualizer — used by M40 Backtracking, M41 DP. Shows the call tree with memoization hits highlighted.
- [ ] **I2.** Graph BFS/DFS animation — used by M37. Animated traversal with frontier + visited highlighting.
- [ ] **I3.** Heap sift-up/sift-down — used by M36. Bubble visualization of heap rebalancing.
- [ ] **I4.** Hash collision walk — used by M34. Shows separate-chaining or open-addressing in motion.
- [ ] **I5.** Trie character path — used by M35-T5. Highlights the path through the trie for a search/insert.

### J. Missing Content Lessons (beta-driven)

Don't bulk-add. Let beta feedback drive what's most missing.

- [ ] **J1.** New module M47 "Modern Java Features" (records, var, text blocks, sealed classes, pattern matching) — content authoring
- [ ] **J2.** New module M48 "Engineering Hygiene" (Maven/Gradle deep dive, Git collab, IntelliJ tooling)
- [ ] **J3.** New module M49 "Technical Communication" (PR descriptions, code review, design docs)

Mark these `[ ]` only when a beta user has explicitly asked for them. Otherwise they stay listed as candidates.

---

## Deferred (revisit on signal)

- [-] **K. "Build From Scratch" Deep Track** — niche audience; not justified vs Phase 1-2 ROI. Revisit if 5+ users request it.
- [-] **L. Other Languages (Python / JS / Go)** — schema supports it but no content. Revisit after the Java track has 100+ paying users.

---

## Decision log

### 2026-05-26 · Visualizer architecture
- Decided: port both `dsalearn` + `dsa-visualizer 2` as components into the existing Vite frontend; do NOT keep them as separate Next.js apps. Cleanest integration with auth/layout/progress; avoids iframe and TOS-of-Next.js-16 issues.
- Decided: do NOT try to drive visualizers from Judge0 output. Judge0 returns stdout; visualizers need typed step events. Two parallel teaching modalities on the same page (visualizer = intuition, Judge0 = correctness).
- Source: this session's exploration of both folders.

### 2026-05-26 · Phase ordering
- Phase 1 trio (Visualizer + Tutor + Pattern Recognition) chosen because they're independent of each other (low risk of one blocking another) AND together they form the moat: visualization is what LeetCode lacks, tutor is what ChatGPT can't do without curriculum context, pattern drills are what FAANG candidates pay for.
- AI Socratic Tutor (B) chosen as the single highest-ROI feature on the list. Cost: <$1/user/month with rate limits. Value: the only feature ChatGPT can't easily replicate.

### 2026-05-26 · Out of scope for this roadmap
- Production deployment (Oracle Cloud per `project_deployment_process` memory) — separate workstream, blocks beta launch but not v3 feature work
- Mobile / PWA — no demand signal yet
- Multi-language UI (Hindi / Telugu) — defer until 1000+ users
- Group / cohort features — defer to Phase 4
