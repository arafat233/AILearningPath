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
| 1 | **Animation coverage → ALL DSA problems** | DSA Animator | High (scale) | 🔄 IN PROGRESS |
| 2 | Deep System Design track (cases, 20+ patterns) | AlgoMaster | High | ⬜ not started |
| 3 | Highlights + notes + searchable notebook | AlgoMaster | Low–Med | ⬜ not started |
| 4 | Low-Level Design (UML, OOD) track | AlgoMaster | High | ⬜ not started |
| 5 | Listen / audio narration mode | AlgoMaster | Med | ⬜ not started |
| 6 | Edge-case catalog (per problem) | DSA Animator | Low | ⬜ not started |
| 7 | Code-tricks / idioms library | DSA Animator | Low | ⬜ not started |
| 8 | Newsletter / content / community engine | AlgoMaster | Ongoing | ⬜ not started |
| 9 | Resume tool / Jobs board | both | Low | ⬜ not started |

---

## 5. GAP #1 — Animation coverage (DETAILED)

**Goal:** every animatable DSA code problem has a step-by-step animation (not capped at 100).

**Scope:** 763 code problems. ~48 `complexity-analysis` are Big-O reasoning (not step-animatable) → out of scope. Target ≈ **700**.

**Approach:** per-pattern **stage generators** in the seed (one generator animates every problem of that pattern from its example input) + new `StepPlayer` renderers as needed. Renderers existing: `array-pointers`, `stack`, `grid`, `monotonic`.

| Pattern | Renderer | Total | Animated | Status |
|---|---|--:|--:|---|
| two-pointers | array-pointers ✅ | 25 | 6 | 🔄 |
| sliding-window | array-pointers ✅ | 14 | 10 | 🔄 (4 left: window+set, prefix, circular, synthesis) |
| arrays | array-pointers ✅ | 18 | — | ⬜ |
| prefix-sum | array-pointers ✅ | 13 | — | ⬜ |
| stack | stack ✅ | 18 | — | ⬜ |
| monotonic-stack | stack ✅ | 13 | — | ⬜ |
| stack-queue | stack/queue | 11 | — | ⬜ |
| matrix | grid ✅ | 30 | — | ⬜ |
| graph-traversal | grid ✅ | 14 | — | ⬜ |
| hashing | **NEW table** | 78 | — | ⬜ |
| linked-list | **NEW linked-list** | 65 | — | ⬜ |
| heap | **NEW heap-tree** | 33 | — | ⬜ |
| dynamic-programming | **NEW dp-table** | 30 | — | ⬜ |
| queue | **NEW queue** | 30 | — | ⬜ |
| tree-dfs | **NEW tree** | 15 | — | ⬜ |
| tree-traversal | **NEW tree** | 15 | — | ⬜ |
| bst | **NEW tree** | 12 | — | ⬜ |
| sorting | **NEW sort** | 23 | — | ⬜ |
| backtracking | **NEW backtrack-tree** | 16 | — | ⬜ |
| bit-manipulation | **NEW bits** | 15 | — | ⬜ |
| binary-search | **NEW bsearch** | 13 | — | ⬜ |
| binary-search-on-answer | bsearch | 7 | — | ⬜ |
| strings | **NEW string** | 13 | — | ⬜ |
| palindrome | string | 12 | — | ⬜ |
| pattern-matching | string | 12 | — | ⬜ |
| trie | tree | 11 | — | ⬜ |
| recursion | backtrack-tree | 9 | — | ⬜ |
| topological-sort | grid/graph | 5 | — | ⬜ |
| shortest-path | grid/graph | 5 | — | ⬜ |
| intervals | array-pointers | 5 | — | ⬜ |
| union-find | **NEW unionfind** | 4 | — | ⬜ |
| greedy | array-pointers | 4 | — | ⬜ |
| (untagged) | triage | 117 | — | ⬜ |
| complexity-analysis | n/a (out of scope) | 48 | — | ⏭️ |

**Renderers to build:** table (hashing), linked-list, heap-tree, dp-table, queue, tree, sort, backtrack-tree, bits, bsearch, string, unionfind.

**Animated so far: 27 / ~700.**
- Original 21 pilots: two-pointers ×6, sliding-window ×4, monotonic-stack ×3, grid ×3, batch2 ×5.
- `seedAnimationCoverage1.js` (2026-06-04): +6 sliding-window (Max-Sum-K, Find Anagrams, ≤2 Distinct, Char Replacement, Fruit Baskets, Longest-1s-after-deletion).

**Progress log:**
- [x] 2026-06-04 — sliding-window batch 1 (6) via existing renderer.
- [ ] next — two-pointers remaining (~19), then arrays/prefix-sum/intervals/greedy (array-pointers renderer).
- [ ] then — stack family (stack/monotonic/stack-queue), grid family (matrix/graph).
- [ ] then — NEW renderers: linked-list, tree, heap, dp-table, queue, sort, backtrack, bits, bsearch, string, hashing-table, union-find.
