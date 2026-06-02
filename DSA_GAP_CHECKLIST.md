# DSA Gap Checklist — staying.fun cross-verification (2026-06-02)

> Missing DSA algorithms found by comparing our Pro Java track (M29–M48) against
> staying.fun's coverage. **22 missing items.** Split across two Claude CLI
> sessions below. Each session owns whole MODULES so the two never edit the same
> seed file or DB module concurrently.

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
- [ ] **First non-repeating character in a stream** — queue of chars + freq map; emit first non-repeating after each char. `code_scratch` + a `predict_output` trace.
- [ ] **Reverse first K characters/elements of a queue** — dequeue K → stack → re-enqueue → rotate rest. `code_scratch`.
- [ ] **Generate binary numbers 1..n** — BFS with a queue ("1" → "10","11" → …). `code_scratch` + trace.
- [ ] **Generate number pattern (queue BFS)** — e.g. numbers whose digits are only {1,2} up to n, or staying.fun's "number pattern" generator. `code_scratch`.
- [ ] **Interleave first half and second half of a queue** — split, use a stack/aux queue to interleave. `code_scratch` + trace.
- [ ] **Reverse K elements of a queue (rearrangement variant)** — same primitive as the string one but generic ints; can share helper, distinct exercise. `code_scratch`.
- [ ] **Rotate a queue by K** — dequeue+enqueue K times. `code_scratch` + warmup trace.
- [ ] **Rotate a queue by blocks** — rotate in chunks of size B. `code_scratch`.

### Stack (5)
- [ ] **String reversal using a stack** — push all chars, pop to rebuild. `code_scratch` (we only have non-stack "reverse a string — 3 ways" in M31).
- [ ] **Sort a stack** — using recursion or a temp stack (insert-in-sorted-order). `code_scratch` + trace.
- [ ] **Reverse a stack** — using recursion (insertAtBottom). `code_scratch`.
- [ ] **132 Pattern (LeetCode #456)** — monotonic stack. `code_scratch`.
- [ ] **Valid Stack Sequences (LeetCode #946)** — simulate push/pop. `code_scratch` + trace.

**Target: ~13 exercises + brief teaching notes if a topic lacks the concept.**

---

## 🅱️ SESSION B — Modules M34, M35, M37, M38 — 9 items

> Four small additive seeds (or one `config/seedDsaGapsB.js` that touches only
> these four modules). Never touch M33.

### M34 — HashMap (2)
- [ ] **Two Sum — all pairs** — return ALL index/value pairs summing to target (not just the first). `code_scratch`. Append to M34 T1.
- [ ] **Simple cache (HashMap-backed)** — get/put with no eviction (the pre-LRU teaching step). `code_scratch`. Append to M34 T5 (before LRU).

### M35 — Binary Tree (2)
- [ ] **Preorder traversal — dedicated exercise** — recursive + iterative (stack). `code_scratch` + trace. (Currently only inside "All traversals comparison".) Append to M35 T1.
- [ ] **Postorder traversal — dedicated exercise** — recursive + iterative (two-stack or reverse-preorder). `code_scratch` + trace. Append to M35 T1.

### M37 — Graph (1)
- [ ] **Bellman-Ford** — single-source shortest path WITH negative edges + negative-cycle detection. `code_scratch` + a `predict_output` trace contrasting with Dijkstra. Append to M37.

### M38 — Sorting Algorithms (4)
> M38 currently has merge/quick/counting/3-way but NOT the elementary O(n²) sorts.
- [ ] **Bubble sort** — implementation + why O(n²), early-exit optimisation. `code_scratch` + trace.
- [ ] **Selection sort** — implementation, O(n²), min-selection invariant. `code_scratch`.
- [ ] **Insertion sort** — implementation (M29 only analyses complexity; no impl exercise). `code_scratch` + best-case O(n) note.
- [ ] **Shell sort** — gap-sequence insertion sort. `code_scratch` + trace showing gap shrink.

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
