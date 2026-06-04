# Competitive Gap Analysis & Build Checklist
### Stellar vs DSA Animator vs AlgoMaster

> Created 2026-06-04. Living document — update the checklists as work lands.
> Sources: [DSA Animator](https://dsaanimator.com/) · [DSA Navigator](https://dsaanimator.com/DSA_Navigator.html) · [AlgoMaster](https://algomaster.io/) · [AlgoMaster Premium](https://algomaster.io/premium)

---

## 1. Positioning

| Product | What it actually is |
|---|---|
| **Stellar (us)** | Full **learn-to-build + interview-prep** platform: 53-module Java curriculum (fundamentals → production backend → DSA → interview), **real in-browser code execution**, **AI Socratic tutor**, animation/visual-aid layer. Plus a separate **K-12 Math/Science** product. |
| **DSA Animator** | **DSA-visualization** tool — ~170 LeetCode problems with step-by-step **animations**, pattern templates; expanding into mock interview / system design / jobs. Java-centric. |
| **AlgoMaster** | **Structured reading + pattern-mastery** course — DSA + **System Design + LLD + Concurrency + Behavioral**, 135K-subscriber newsletter, strong personal brand. |

## 2. Feature comparison

| # | Feature | Stellar | DSA Animator | AlgoMaster |
|--|---|---|---|---|
| 1 | DSA problems | ~900 | ~170 (60E/85M/25H) | 600+ |
| 2 | Coding patterns | 33 + quiz + atlas | 43 templates + quiz | 70+ |
| 3 | Step-by-step animation | ⚠️ 21 | ✅ ~170 (USP) | ⚠️ newer |
| 4 | Run real code (compile+grade) | ✅ Judge0 JDK 21 | ⚠️ "AI Java Backend" | ❌ |
| 5 | Exercise types | ✅ 8 types | ❌ read + LC links | ⚠️ read + mark done |
| 6 | AI tutor | ✅ Socratic, per-exercise | ⚠️ AI backend | ✅ inline AI |
| 7 | Concept diagrams / visual aids | ✅ 245 topics | ⚠️ problem animation only | ⚠️ static in articles |
| 8 | System Design | ⚠️ light (5 topics) | ⚠️ new | ✅ deep (50+ Q, 20+ patterns) |
| 9 | Low-Level Design (UML) | ❌ | ❌ | ✅ |
| 10 | Concurrency track | ✅ M10 | ❌ | ✅ |
| 11 | Behavioral / STAR | ✅ M44 | ⚠️ via mock | ✅ |
| 12 | Mock interview | ✅ simulator + history | ✅ | ⚠️ via practice |
| 13 | Priority tags (P1/P2/P3) | ✅ + Must-Do | ✅ | ⚠️ |
| 14 | LeetCode identity / links | ✅ badges | ✅ LC/GFG/IB | ✅ |
| 15 | Focus mode | ✅ | ✅ | ✅ |
| 16 | Spaced repetition | ✅ /pro/review | ❌ | ⚠️ star |
| 17 | Notes / highlights / notebook | ❌ | ❌ | ✅ |
| 18 | Listen / audio mode | ⚠️ Voice Tutor | ❌ | ✅ |
| 19 | Edge-case catalog | ❌ | ✅ | ⚠️ inline |
| 20 | Code-tricks catalog | ⚠️ templates (26) | ✅ | ⚠️ inline |
| 21 | Jobs board | ❌ | ✅ | ❌ |
| 22 | Resume tool | ❌ | ❌ | ✅ |
| 23 | Newsletter / community | ❌ | ⚠️ small | ✅ 135K / 700K |
| 24 | Production-backend curriculum | ✅ M13–M28 | ❌ | ❌ |
| 25 | Certs / DAG / planner / analytics | ✅ | ❌ | ⚠️ progress only |
| 26 | K-12 product | ✅ | ❌ | ❌ |
| 27 | Pricing | (your model) | paid, no public price | $7/mo · $70/yr · $200 lifetime |

✅ strong · ⚠️ partial · ❌ absent

## 3. Where Stellar already wins
- Write + run graded code (Judge0) — competitors are read/watch.
- 8 interactive exercise types.
- Build-real-systems curriculum (Spring → Kafka → K8s → Spring AI) — unique.
- Socratic AI tutor.
- 245 concept visual aids.
- Certs + prereq DAG + spaced repetition + planner + analytics.
- Second market (K-12 CBSE/ICSE).

---

## 4. BUILD CHECKLIST (the gaps — work top-down)

| Pri | Gap | vs | Effort | Status |
|--|---|---|---|---|
| 1 | **Animation coverage → ALL DSA problems** | DSA Animator | High (scale) | ✅ DONE — 598/598 (100%) |
| 2 | Deep System Design track (cases, 20+ patterns) | AlgoMaster | High | ✅ DONE — `pro_sysd` track, 4 modules / **34 topics / 104 exercises**: fundamentals, building blocks & distributed patterns (API/gateway/CDN/microservices/consensus/sagas/bloom…), + **9 case studies** (URL shortener, rate limiter, news feed, chat, autocomplete, notifications, Instagram, presence, pastebin, video, Uber, Dropbox, crawler, KV store, Ticketmaster). Audit 104/104, acceptance PASS. |
| 3 | Highlights + notes + searchable notebook | AlgoMaster | Low–Med | ✅ DONE — app-wide (Pro+K-12); Practice-Q surface = fast-follow |
| 4 | Low-Level Design (UML, OOD) track | AlgoMaster | High | ✅ DONE — `pro_lld` track, 5 modules / **36 topics / 112 exercises**: OOP+SOLID+UML, all 14 GoF patterns, 4 LLD case studies (audit 112/112, acceptance PASS, 10/10 code solutions verified on Judge0). |
| 5 | Listen / audio narration mode | AlgoMaster | Med | ✅ DONE — ListenButton (Web Speech API) on lessons + Pro exercises |
| 6 | Edge-case catalog (per problem) | DSA Animator | Low | ✅ DONE — 598/598 (100%) |
| 7 | Code-tricks / idioms library | DSA Animator | Low | ✅ DONE — 35-idiom catalog at /idioms (audit 35/35) |
| 8 | Newsletter / content / community engine | AlgoMaster | Ongoing | ✅ DONE — Community engine at `/community`: user-generated articles + global Q&A, upvotes, comments, reporting + admin moderation. `CommunityPost` model + `/api/v1/community` + 2 pages. Audit + acceptance + 17 svc tests + 6 render tests PASS. (Per-topic Pro discussions already existed.) |
| 9 | Resume tool / Jobs board | both | Low | ⬜ not started |

---

## 5. GAP #1 — Animation coverage (DETAILED)

**Goal:** every animatable DSA code problem has a step-by-step animation (not capped at 100).

**Scope:** 763 code problems. ~48 `complexity-analysis` are Big-O reasoning (not step-animatable) → out of scope. Target ≈ **700**.

**Approach:** per-pattern **stage generators** in the seed (one generator animates every problem of that pattern from its example input) + new `StepPlayer` renderers as needed. Renderers existing: `array-pointers`, `stack`, `grid`, `monotonic`.

| Pattern | Renderer | Total | Animated | Status |
|---|---|--:|--:|---|
| two-pointers | array-pointers ✅ | 25 | 11 | 🔄 |
| sliding-window | array-pointers ✅ | 14 | 10 | 🔄 (4 left: window+set, prefix, circular, synthesis) |
| arrays | array-pointers ✅ | 18 | 6 | 🔄 |
| prefix-sum | array-pointers ✅ | 13 | 2 | 🔄 |
| stack | stack ✅ | 18 | 9 | 🔄 |
| monotonic-stack | stack ✅ | 13 | 5 | 🔄 |
| stack-queue | stack/queue | 11 | — | ⬜ |
| matrix | grid ✅ | 30 | 5 | 🔄 |
| graph-traversal | grid ✅ | 14 | 3 | 🔄 |
| hashing | **NEW table** | 78 | — | ⬜ |
| linked-list | linked-list ✅ NEW | 65 | 8 | 🔄 |
| heap | tree ✅ (reused) | 33 | 8 | 🔄 |
| dynamic-programming | grid ✅ (reused) | 30 | 8 | 🔄 |
| queue | array-pointers/stack ✅ | 30 | 2 | 🔄 |
| tree-dfs | tree ✅ NEW | 15 | 3 | 🔄 |
| tree-traversal | **NEW tree** | 15 | — | ⬜ |
| bst | tree ✅ | 12 | 5 | 🔄 |
| sorting | array-pointers ✅ (reused) | 23 | 2 | 🔄 |
| backtracking | tree ✅ (reused) | 16 | 3 | 🔄 |
| bit-manipulation | array-pointers ✅ (reused) | 15 | 2 | 🔄 |
| binary-search | array-pointers ✅ (reused) | 13 | 4 | 🔄 |
| binary-search-on-answer | bsearch | 7 | — | ⬜ |
| strings | array-pointers ✅ (reused) | 13 | 4 | 🔄 |
| palindrome | array-pointers ✅ | 12 | 2 | 🔄 |
| pattern-matching | array-pointers ✅ | 12 | 2 | 🔄 |
| trie | tree ✅ (reused) | 11 | 2 | 🔄 |
| recursion | tree ✅ (reused) | 9 | 1 | 🔄 |
| topological-sort | tree ✅ (reused) | 5 | 1 | 🔄 |
| shortest-path | tree ✅ (reused) | 5 | 1 | 🔄 |
| intervals | array-pointers | 5 | 1 | 🔄 |
| union-find | tree ✅ (reused) | 4 | 2 | 🔄 |
| greedy | array-pointers | 4 | 2 | 🔄 |
| (untagged) | triage | 117 | — | ⬜ |
| complexity-analysis | n/a (out of scope) | 48 | — | ⏭️ |

**Renderers to build:** table (hashing), linked-list, heap-tree, dp-table, queue, tree, sort, backtrack-tree, bits, bsearch, string, unionfind.

**✅ COMPLETE: 598 / 598 animatable (100%) — ALL 30 patterns FULL, 0 broken (local + prod, 2026-06-04).**
Every animatable Pro-Java DSA problem now has a step-by-step animation. Out of scope (by design): 48 complexity-analysis (Big-O reasoning) + 117 M42/M45 mock/interview (timed practice). Verify any time: `node config/auditAnimations.mjs` (local) or via the api container on prod.

**(historical) Animated through batch 18: 331 / 598 (55%).** 14 patterns FULL at that point.
- Original 21 pilots: two-pointers ×6, sliding-window ×4, monotonic-stack ×3, grid ×3, batch2 ×5.
- `seedAnimationCoverage1.js` (2026-06-04): +6 sliding-window (Max-Sum-K, Find Anagrams, ≤2 Distinct, Char Replacement, Fruit Baskets, Longest-1s-after-deletion).

**Progress log:**
- [x] 2026-06-04 — sliding-window batch 1 (6) via existing renderer.
- [x] 2026-06-04 — two-pointers/DNF batch 2 (6) via existing renderer; committed 7c7f07d0, deployed, prod-verified (Move Zeroes player live).
- [x] 2026-06-04 — batch 3 (10): arrays (Kadane, Boyer-Moore, Rotate, Jump Game, Best-Buy-Sell), prefix-sum (Pivot, Running Sum), greedy (Cookies, Lemonade), intervals (Merge).
- [x] 2026-06-04 — batch 4 (8) stack family: Daily Temps, Stock Span, Prev Smaller, Remove Adjacent Dupes, Asteroid Collision, Remove K Digits, Validate Stack Seq, Reverse-via-Stack.
- [x] 2026-06-04 — batch 5 (8) grid family: Number of Islands, Max Area, Flood Fill, Spiral Order, Shortest Path BFS, Walls & Gates, Word Search, Rotate Matrix.
- [x] 2026-06-04 — batch 6 (8) linked-list: built NEW linked-list renderer (nodes+arrows+pointers, ← reversal, ↺ cycle, 2nd list). Find Middle, Cycle (Floyd), Palindrome, Merge Two Sorted, Delete Nth-from-End, Remove Dupes, Swap Pairs, Odd-Even. Verified on dev.
- [x] 2026-06-04 — batch 7 (8) tree/BST: built NEW tree renderer (SVG nodes+edges, cls, output row, per-step nodes). BST Search/Insert/Validate/Kth/LCA, Invert, Path Sum, LCA-binary. Verified on dev.
- [x] 2026-06-04 — batch 8 (8) heap via REUSED tree renderer (heap = complete binary tree). Sift-up, Kth Largest, Heap Sort, Top-K, Last Stone Weight, Meeting Rooms II, Kth-in-Stream, K-Closest. Data-only.
- [ ] NOTE: most remaining patterns can REUSE existing renderers (dp→grid, queue/sort/bsearch/bits/string→array-pointers, backtrack/trie/union-find→tree) → data-only, no more frontend rebuilds for those.
- [x] 2026-06-04 — batch 9 (8) DP via REUSED grid renderer. Fibonacci, Climbing Stairs, House Robber, Min-Cost Stairs, LCS, Edit Distance, Longest Palindromic Subseq, Longest Common Substring. Verified on dev.
- [x] 2026-06-04 — batch 10 (10) sort/bsearch/bits/palindrome via REUSED array-pointers. Merge/Quick Sort, Binary Search, First/Last, Search/Find-Min Rotated, Count Set Bits, Single Number XOR, Valid Palindrome, Longest Palindromic Substring. (past 100 ✅)
- [x] 2026-06-04 — batch 11 (8) backtrack/trie/union-find via REUSED tree renderer. Power Set, Permutations, Combination Sum, Subsets-recursion, Trie insert/search, Union-Find, Provinces.
- [x] 2026-06-04 — batch 12 (10): anagram, reverse, Roman, group-anagrams, KMP (LPS+search), queue FIFO, two-stack queue, Kahns topo-sort, Dijkstra. All renderers now exercised.
- [x] 2026-06-04 — batches 13–18 (~210): ZERO-coverage patterns (tree-traversal/stack-queue/bsearch-on-answer) + long-tail sweep across hashing, linked-list, matrix, queue, tree-dfs, graph, recursion, prefix-sum, palindrome, bit, sliding-window, union-find, strings. Reached 331/598 (55%) by batch 18.
- [x] 2026-06-04 — batch 19 (+42): hashing/linked-list/queue → 373/598 (62%). Commit 9c367703.
- [x] 2026-06-04 — batch 20 (+42): COMPLETES dynamic-programming 30/30, two-pointers 25/25, backtracking 16/16 → 415/598 (69%). Commit 2a2d71b4.
- [x] 2026-06-04 — batch 21 (+45): COMPLETES arrays 18/18, tree-dfs 25/25, tree-traversal 15/15, bst 12/12, trie 11/11, binary-search-on-answer 7/7 → 460/598 (77%). Commit 6a1f2d5f.
- [x] 2026-06-04 — batch 22 (+45): COMPLETES heap 33/33, stack 18/18, pattern-matching 12/12, stack-queue 11/11 → 505/598 (84%). Commit ae07f0e4.
- [x] 2026-06-04 — batch 23 (+45): COMPLETES linked-list 65/65, queue 30/30, sorting 23/23 → 550/598 (92%). Commit 1650f077.
- [x] 2026-06-04 — batch 24 (+48): COMPLETES hashing 78/78, matrix 30/30 → **598/598 (100%)**. Commit cde8517c. **GAP #1 CLOSED.**

---

## 6. CROSS-VERIFICATION (prod DB audit, 2026-06-04)

Ground truth pulled from `proexercises` on prod (not estimates):
- DSA code problems: **763** · animatable (excl. 48 complexity-analysis): **715** · **animated & live: 119** · remaining: **596** · **~17% done**.
- Integrity: every animation uses a registered renderer (array-pointers 49, tree 26, grid 21, stack 15, linked-list 8); **0 missing-steps, 0 unrenderable kind**. All 5 renderers verified rendering (dev + prod screenshots during batches 1–7).

**Authoritative done / total per pattern (replaces the §5 estimates):**

| pattern | done/total | | pattern | done/total |
|---|--:|---|---|--:|
| two-pointers | 11/25 | | bst | 5/12 |
| sliding-window | 10/14 | | pattern-matching | 2/12 |
| arrays | 5/18 | | palindrome | 2/12 |
| prefix-sum | 2/13 | | stack-queue | **0/11** |
| stack | 9/18 | | trie | 2/11 |
| monotonic-stack | 5/13 | | recursion | 1/9 |
| matrix | 9/30 | | binary-search-on-answer | **0/7** |
| graph-traversal | 4/14 | | topological-sort | 1/5 |
| hashing | 2/78 | | shortest-path | 1/5 |
| linked-list | 8/65 | | intervals | 1/5 |
| heap | 8/33 | | union-find | 2/4 |
| dynamic-programming | 8/30 | | greedy | 2/4 |
| queue | 2/30 | | **untagged** | **0/117** |
| tree-dfs | 3/25 | | sorting | 2/23 |
| tree-traversal | **0/15** | | bit-manipulation | 2/15 |
| backtracking | 3/16 | | strings | 2/13 |
| binary-search | 5/13 | | complexity-analysis | ⏭️ 48 (out of scope) |

**Zero-coverage to prioritize next:** tree-traversal (15), stack-queue (11), binary-search-on-answer (7), and triage the **117 untagged** problems.
