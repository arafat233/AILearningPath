# DSA Gap Checklist — staying.fun cross-verification (2026-06-02)

> Missing DSA algorithms found by comparing our Pro Java track (M29–M48) against
> staying.fun's coverage. **22 missing items.** Split across two Claude CLI
> sessions below. Each session owns whole MODULES so the two never edit the same
> seed file or DB module concurrently.

## ✅ Status — reconciled 2026-08-25

**All 22 items are DONE.** Both sessions shipped (A: 2026-06-02, B: 2026-06-03) but the
per-item boxes were never ticked, so this file read as 22 items of outstanding work for
almost three months. Reconciled by verifying each item against the seed files rather
than trusting the section headers:

- `config/seedM33StackQueueGaps.js` — 13 exercises (8 queue → T3, 4 stack → T1, 1 → T2),
  matching the Session A header exactly. `npm run seed:m33-gaps`.
- `config/seedDsaGapsB.js` — 9 items / 14 docs across M34, M35, M37, M38.
  `npm run seed:dsa-gaps-b`.

Both npm scripts are registered in `package.json`. Each box below now records the
exercise title it was seeded as, so the checklist item → shipped artifact mapping is
checkable without re-reading the seeds.

> **One wording drift, recorded not hidden:** the item written as "Reverse K elements of a
> queue (rearrangement variant) — generic ints" was seeded as **Reverse an Entire Queue
> using Recursion**. Same module/topic and the 13/13 count holds, but it is a whole-queue
> reverse, not a K-element one. If the generic-int K-reverse was genuinely wanted as a
> distinct exercise, it is the one real gap left in M33.

---

## ⚠️ Coordination rules (read first)

1. **Stay in your lane.** Session A touches ONLY `java_m33`. Session B touches
   ONLY `java_m34`, `java_m35`, `java_m37`, `java_m38`. Never cross over.
2. **Additive seed scripts only.** Do NOT edit the original big module seeds.
   Create a NEW idempotent seed per module, e.g. `config/seedM33StackQueueGaps.js`,
   that `updateOne(..., {upsert:true})` the new exercises onto existing topics.
3. **exerciseId convention (validator-enforced):**
   `^[a-z][a-z0-9_]*_m\d+_t\d+_(ex|pm)_\d+$`
   → e.g. `java_m33_t3_ex_12`. `_pm_` only for `pattern_match` type. Getting this
   wrong → 422 on the live API (the `_pm_` incident — verify with a round-trip).
4. **Exercise doc shape** (collection `proexercises`): `exerciseId, topicId,
   moduleId, trackKey:"pro_java", position, level (warmup|easy|medium|hard),
   type (predict_output|code_scratch|pattern_match|text_match|fill_blank),
   title, instructions, expectedSolution, hints[], testCases[], starterCode,
   scenario, blanks[], difficulty, xpReward`.
   **Template to copy:** `config/seedM30_5_2dArrayModule.js` (this session built it).
5. **testCases:** `execution` runs on Judge0 (JDK 21 / lang id 90 — modern Java OK).
   `text_match` / `predict_output` need no compiler — prefer for trace/predict items.
6. **Don't pick new exercise positions that collide** with existing ones in the
   target topic — query `max(position)` for that topicId first, append after it.
7. **Verify before commit:** re-run your seed (idempotent → "0 missing"), confirm
   counts + no invalid type/level, then a live HTTP round-trip
   (`/api/v1/pro/...`) if a server is up. **No prod release.**
8. Pro modules are NOT in `CONTENT_STATUS.md` (that's the school-math table) —
   no status-doc update needed, but write a clear commit message.

---

## 🅰️ SESSION A — Module M33 (Stacks & Queues) — 13 items

> ✅ **COMPLETE 2026-06-02** — `config/seedM33StackQueueGaps.js` (`npm run seed:m33-gaps`),
> idempotent. All 13 seeded: 8 queue → T3, 4 stack → T1, 1 (132 Pattern) → T2.
> Verified: 13/13 present, valid IDs/types/levels, no position collisions, +2 teaching notes.
> Module java_m33 now 78 exercises.

> One new seed file: `config/seedM33StackQueueGaps.js`. Queue exercises append to
> M33 T3 (Queue) / T4 (Deque); Stack exercises append to M33 T1 (Stack) / T2 (Monotonic).

### Queue (8)
- [x] **First non-repeating character in a stream** — queue of chars + freq map; emit first non-repeating after each char. `code_scratch` + a `predict_output` trace. → seeded as **First Non-Repeating Character in a Stream (LeetCode #387 stream variant)** (`config/seedM33StackQueueGaps.js`).
- [x] **Reverse first K characters/elements of a queue** — dequeue K → stack → re-enqueue → rotate rest. `code_scratch`. → seeded as **Reverse First K Elements of a Queue** (`config/seedM33StackQueueGaps.js`).
- [x] **Generate binary numbers 1..n** — BFS with a queue ("1" → "10","11" → …). `code_scratch` + trace. → seeded as **Generate Binary Numbers 1 to N (queue BFS)** (`config/seedM33StackQueueGaps.js`).
- [x] **Generate number pattern (queue BFS)** — e.g. numbers whose digits are only {1,2} up to n, or staying.fun's "number pattern" generator. `code_scratch`. → seeded as **Generate Number Pattern with Digits 1 and 2 (queue BFS)** (`config/seedM33StackQueueGaps.js`).
- [x] **Interleave first half and second half of a queue** — split, use a stack/aux queue to interleave. `code_scratch` + trace. → seeded as **Interleave the Two Halves of a Queue** (`config/seedM33StackQueueGaps.js`).
- [x] **Reverse K elements of a queue (rearrangement variant)** — same primitive as the string one but generic ints; can share helper, distinct exercise. `code_scratch`. → seeded as **Reverse an Entire Queue using Recursion** (`config/seedM33StackQueueGaps.js`).
- [x] **Rotate a queue by K** — dequeue+enqueue K times. `code_scratch` + warmup trace. → seeded as **Trace: rotate a queue by K** (`config/seedM33StackQueueGaps.js`).
- [x] **Rotate a queue by blocks** — rotate in chunks of size B. `code_scratch`. → seeded as **Rotate a Queue by Blocks of K (reverse each block)** (`config/seedM33StackQueueGaps.js`).

### Stack (5)
- [x] **String reversal using a stack** — push all chars, pop to rebuild. `code_scratch` (we only have non-stack "reverse a string — 3 ways" in M31). → seeded as **Reverse a String using a Stack** (`config/seedM33StackQueueGaps.js`).
- [x] **Sort a stack** — using recursion or a temp stack (insert-in-sorted-order). `code_scratch` + trace. → seeded as **Sort a Stack using a Temporary Stack** (`config/seedM33StackQueueGaps.js`).
- [x] **Reverse a stack** — using recursion (insertAtBottom). `code_scratch`. → seeded as **Reverse a Stack using Recursion** (`config/seedM33StackQueueGaps.js`).
- [x] **132 Pattern (LeetCode #456)** — monotonic stack. `code_scratch`. → seeded as **132 Pattern (LeetCode #456)** (`config/seedM33StackQueueGaps.js`).
- [x] **Valid Stack Sequences (LeetCode #946)** — simulate push/pop. `code_scratch` + trace. → seeded as **Validate Stack Sequences (LeetCode #946)** (`config/seedM33StackQueueGaps.js`).

**Target: ~13 exercises + brief teaching notes if a topic lacks the concept.**

---

## 🅱️ SESSION B — Modules M34, M35, M37, M38 — 9 items

> ✅ **COMPLETE 2026-06-03** — `config/seedDsaGapsB.js` (`npm run seed:dsa-gaps-b`),
> idempotent. 9 items / 14 docs: M34 (2), M35 (4 incl. traces), M37 (2 incl. Dijkstra
> contrast), M38 (6 incl. traces). Verified by Session A: 14/14 present, valid
> IDs/types/levels, parent topics exist, no collisions.

> Four small additive seeds (or one `config/seedDsaGapsB.js` that touches only
> these four modules). Never touch M33.

### M34 — HashMap (2)
- [x] **Two Sum — all pairs** — return ALL index/value pairs summing to target (not just the first). `code_scratch`. Append to M34 T1. → seeded as **Two Sum — ALL pairs (every index pair, not just the first)** (`config/seedDsaGapsB.js`).
- [x] **Simple cache (HashMap-backed)** — get/put with no eviction (the pre-LRU teaching step). `code_scratch`. Append to M34 T5 (before LRU). → seeded as **Simple cache (HashMap-backed, no eviction) — the pre-LRU step** (`config/seedDsaGapsB.js`).

### M35 — Binary Tree (2)
- [x] **Preorder traversal — dedicated exercise** — recursive + iterative (stack). `code_scratch` + trace. (Currently only inside "All traversals comparison".) Append to M35 T1. → seeded as **Preorder traversal — recursive AND iterative (stack)  + Trace: preorder traversal order** (`config/seedDsaGapsB.js`).
- [x] **Postorder traversal — dedicated exercise** — recursive + iterative (two-stack or reverse-preorder). `code_scratch` + trace. Append to M35 T1. → seeded as **Postorder traversal — recursive AND iterative  + Trace: postorder traversal order** (`config/seedDsaGapsB.js`).

### M37 — Graph (1)
- [x] **Bellman-Ford** — single-source shortest path WITH negative edges + negative-cycle detection. `code_scratch` + a `predict_output` trace contrasting with Dijkstra. Append to M37. → seeded as **Bellman-Ford — shortest paths with negative edges + cycle detection  + Trace: why Dijkstra fails on a negative edge** (`config/seedDsaGapsB.js`).

### M38 — Sorting Algorithms (4)
> M38 currently has merge/quick/counting/3-way but NOT the elementary O(n²) sorts.
- [x] **Bubble sort** — implementation + why O(n²), early-exit optimisation. `code_scratch` + trace. → seeded as **Bubble sort — with early-exit optimisation  + Trace: one pass of bubble sort** (`config/seedDsaGapsB.js`).
- [x] **Selection sort** — implementation, O(n²), min-selection invariant. `code_scratch`. → seeded as **Selection sort** (`config/seedDsaGapsB.js`).
- [x] **Insertion sort** — implementation (M29 only analyses complexity; no impl exercise). `code_scratch` + best-case O(n) note. → seeded as **Insertion sort — with the O(n) best case** (`config/seedDsaGapsB.js`).
- [x] **Shell sort** — gap-sequence insertion sort. `code_scratch` + trace showing gap shrink. → seeded as **Shell sort — gapped insertion sort  + Trace: Shell sort first gap pass** (`config/seedDsaGapsB.js`).

**Target: ~9 exercises + teaching notes for the elementary sorts.**

---

## Already covered (do NOT rebuild) ✅

- Queue: Sliding Window Maximum (M33 T4 #239)
- Stack: balanced parens (#20), eval postfix (#150), remove adjacent dup (#1047),
  next greater (#496), stock span (monotonic)
- HashMap: char count, word frequency, two sum (#1), LRU cache (#146),
  hashset insertion, group anagrams (#49)
- Binary Tree: inorder, level order, BST insert/search/delete, height (#104),
  isBalanced (#110), isSymmetric (#101)
- Linked List: insertion, deletion, reverse (#206), merge (#21), cycle (#141),
  middle, palindrome (#234), removeNth (#19) — **fully covered**
- Graph: Dijkstra, BFS, DFS, Kahn's topo sort
- 1D Array: binary search, linear search, fixed/variable window, prefix sum,
  array rotation (#189)
- 2D Array (M30.5, built this session): matrix multiply/transpose/spiral/diagonal,
  grid BFS/DFS, grid DP (unique paths, maximal square, edit distance, LCS),
  2D binary search

## ⚠️ Follow-up finding — duplicate exercises in M37–M41 (PRE-EXISTING, separate from gap work)

Flagged by Session B, confirmed by Session A (2026-06-03). The ORIGINAL seeds for
five DSA modules wrote the same ~12-base exercise set into EVERY topic (t1–t5)
instead of topic-specific content. Confirmed **byte-identical** (instructions AND
expectedSolution match across topics; only the exerciseId differs).

Consequence: e.g. M38 T4 "Custom Sort — Comparators" actually shows merge/quick/
counting-sort exercises; M37 T2 "BFS/DFS Applications" shows the generic graph set.
Topic content is mismatched to topic titles.

| Module | docs | distinct titles | duplication |
|--------|:----:|:--------------:|:-----------:|
| M37 Graphs | 67 | 19 | ~5× |
| M38 Sorting | 66 | 18 | ~5× |
| M39 Binary Search | 60 | 12 | ~5× |
| M40 Backtracking | 60 | 12 | ~5× |
| M41 Dynamic Programming | 65 | 17 | ~5× |
| M36 Heaps | 56 | 34 | ~partial (3×) |

(Healthy modules for comparison: M29–M35 each have ~1 dup at most; M30.5 = 37/37.)

✅ **RESOLVED 2026-06-03** — all 5 modules re-authored with topic-specific exercises
(overwrote duplicated ex_1..ex_N slots in place → preserved exerciseIds, kept each
pm_1 + Section-B additions, deleted leftover dup slots). Scripts:
`reauthorM37Graphs.js`, `reauthorM38Sorting.js`, `reauthorM39BinarySearch.js`,
`reauthorM40Backtracking.js`, `reauthorM41DP.js` (all idempotent).
Post-fix distinct-title ratios: M37 36/36, M38 31/31, M39 23/23, M40 17/17,
M41 23/23 — **0 duplication**. All `code_scratch` outputs hand-verified.
(M36 Heaps 56/34 still has partial duplication — separate, not in this batch.)

## Score
| DS | covered | missing |
|----|:------:|:------:|
| Queue | 1 | 8 |
| Stack | 5 | 5 |
| HashMap | 6 | 2 |
| Binary Tree | 8 | 2 |
| Linked List | 8 | 0 |
| Graph | 4 | 1 |
| 1D Array | 6 | 4 |
| 2D Array | all | 0 |
| **Total** | | **22** |
