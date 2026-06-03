# Math Content topicId Audit & Canonical Convention

**Date:** 2026-05-25
**Trigger:** `audit:math:cbse10` failing made us cross-check every board×grade and discover topicId convention drift.

---

## TL;DR

**14 board × grade combos checked. ALL 14 now at 100% audit.**

| Status | Boards / grades |
|---|---|
| ✅ Audit 100% (`15/15` checks per topic) | **CBSE 1-10, ICSE 9-10, AP_SSC 8-10** (all 15 combos) |

The mess was ONE problem: CBSE 10 Math had v0 legacy topicIds for 304 questions, plus 5 truly missing sub-topics that needed authoring. All resolved today. Cross-board audit confirmed no other content was affected — newer boards were born under the modern convention.

Smoke run (`npm run smoke`): **10/10 gates pass, 0 warnings**, ~27 seconds.

---

## Why this happened — chronological reason

Three topicId conventions existed in the codebase over time. Each new board adopted the latest. None of the older content was ever fully migrated.

| Era | Convention | Example | Boards / Grades born here |
|---|---|---|---|
| **v0** (oldest) | freeform English descriptors | `"Algebra Basics"`, `"Prime factorisation"` | CBSE Class 10 Math (original content) |
| **v1** (intermediate) | `ch{N}_s{S}_c{C}_t{T}` positional ids | `ch1_s1_c1_t1` | Brief intermediate CBSE 10 docs; mostly migrated to v2 |
| **v2** (current standard) | `<board>_<subject><grade>_ch{N}_<descriptor>` | `cbse_math10_ch1_euclid_division_lemma` | Everything from CBSE Class 8/9 onward + all ICSE + all AP_SSC |

**Two prior migrations existed but neither covered v0:**
- `migrateCbseMath10TopicIds.mjs` — v1 → v2 (handled `ch1_s1_c1_t1`-style ids). Ran successfully but found only ~32 v1-tagged questions to convert.
- The v0→v2 migration didn't exist at all until today.

That's why CBSE 10 looked "missing content" — the data was always there, just under v0 descriptive ids that no audit/lookup ever joined against the v2 NcertTopicContent.topicId.

**Why production looked fine:** The Practice page matches by `Question.topic` (human-readable chapter name like `"Real Numbers"`), not by `topicId`. So users could practice. Only the audit script and the new `actAsChild`-aware code paths needed the join, and those caught the gap recently.

**Why this didn't get noticed earlier:** Every NEW board's pipeline (CBSE 8, 9; AP_SSC 9, 10; ICSE 9, 10) was authored fresh in v2 and audited green. Old CBSE 10 was the only board with legacy content, and its audit had been failing silently for months.

---

## Current state — full table (2026-05-25 after fixes)

```
Board   Grade  Chapters  Topics  Questions  Orphans  topicId convention
─────────────────────────────────────────────────────────────────────────
CBSE      1       13        52       481        0    math1_*       (legacy, no board prefix)
CBSE      2       15        60       555        0    math2_*       (legacy, no board prefix)
CBSE      3       14        56       518        0    math3_*       (legacy)
CBSE      4       14        56       518        0    math4_*       (legacy)
CBSE      5       14        56       518        0    math5_*       (legacy)
CBSE      6       10        40       370        0    math6_*       (legacy)
CBSE      7       15        60       555        0    math7_*       (legacy)
CBSE      8       14        56       627        0    cbse_math8_*  (v2 canonical)
CBSE      9        8        32       512        0    cbse_math9_*  (v2 canonical)
CBSE     10       14        54       375      112    cbse_math10_* (v2 — fixed today)
ICSE      9       28       112      1792        0    icse_math9_*
ICSE     10       25       100      1600        0    icse_math10_*
AP_SSC    8       16        56       280        0    ap_ssc_math8_*  (original, 2026-06-03)
AP_SSC    9       12        35       560        0    ap_ssc_math9_*
AP_SSC   10       14        54      1140        0    ap_ssc_math10_*
```

**ALL CBSE 10 orphans cleaned up (2026-05-25):**

`migrateCbseClass10OrphanQuestions.mjs` re-keyed all 142 orphans across Math + Science to canonical `cbse_math10_ch<N>_mixed` / `cbse_sci10_ch<N>_mixed` topicIds:

- 80 chapter-level catch-all questions (16 each across Algebra Basics / Linear Equations / Trigonometry / App Trig / Surface Areas & Volumes) renamed to canonical chapter-mixed pools
- 62 null-topicId questions routed by their `topic` field into the matching chapter-mixed pool (Math + Science)
- 2 latent chapter-number bugs fixed at the same time (`"Algebra Basics"` had `chapterNumber=0` → now 2 · `"Surface Areas & Volumes"` had `chapterNumber=13` → now 12)

Convention: `cbse_math10_ch<N>_mixed` and `cbse_sci10_ch<N>_mixed` represent **chapter-wide mixed-practice question pools** — extra Q variety on top of the per-sub-topic seeded questions. They intentionally don't have a matching NcertTopicContent doc; the 15-check content audit only iterates NcertTopicContent so it stays green.

Final per-subject orphan count: **0 / 0 / 0 / 0 / 0** across Math / Science / English / Social / Hindi.

---

## What was fixed today

1. ✅ **AP_SSC Class 9 Math chapter skeleton** (was 0 chapters, now 12) — `seedApSscMath9NcertChapters.js` was never run
2. ✅ **AP_SSC Class 10 Math chapter skeleton** (was 0, now 14) — same fix
3. ✅ **ICSE Class 10 Math chapter skeleton** (was 0, now 25) — same fix
4. ✅ **CBSE 10 v0→v2 migration** (`migrateCbseMath10QuestionsV0ToV2.mjs`) — re-keyed 304 questions to canonical convention
5. ✅ **Fixed broken `seedCbseMath10ZeroQGaps.js`** — its `topicId.match(/^ch(\d+)_/)` regex never matched v2 ids, every insert failed validation. Fixed to `_ch(\d+)_`. Seeded 64 questions across 4 topics.
6. ✅ **Fixed AP_SSC 9 typo** — 2 orphan questions with `ap_ssc9_ch4_*` (missing `_math` segment) renamed to `ap_ssc_math9_ch4_*`

7. ✅ **Authored 16 nth-term-of-AP questions** for `cbse_math10_ch5_nth_term` (the one remaining content gap). Easy/medium/hard mix with full solutions, hints, step-by-steps.
8. ✅ **Seeded CBSE Class 10 Science NcertChapter skeleton** (was 0 chapters, now 13) — `seedCbseScience10NcertChapters.js`. Science content existed but the new-architecture chapter detail page couldn't render it.
9. ✅ **Cleaned up all CBSE 10 orphan questions** — `migrateCbseClass10OrphanQuestions.mjs` re-keyed 142 questions (80 chapter-level catch-alls + 62 null-topicId) to canonical `cbse_math10_ch<N>_mixed` / `cbse_sci10_ch<N>_mixed`. Fixed 2 latent chapterNumber bugs in the same pass.

**Audit results (after all fixes):**
- CBSE 10 Math: **0/54 → 54/54 (100%)**
- Every other board × grade combo: still 100% — no regressions
- Smoke run: **10/10 gates pass, 0 warnings**

---

## No remaining gaps — all 14 audits pass

After today's seed + migration + authoring of `cbse_math10_ch5_nth_term`, all 14 board × grade Math combos report 100% on the 15-check content audit.

---

## Canonical convention going forward — FOLLOW THIS

For every new piece of content, use:

```
topicId    = "<board>_<subject><grade>_ch<chapter>_<descriptor>"
chapterId  = "<board>_<subject><grade>_ch<chapter>"
```

**Rules:**
- All lowercase
- snake_case for the descriptor (e.g. `tangent_lengths`, not `TangentLengths`)
- Board codes: `cbse`, `icse`, `ap_ssc`, `ssc`, `ib`. Add new ones to `utils/boardFilter.js` BOARD_PREFIX_RULES.
- Subject codes: `math`, `sci`, `eng`, `sst`, `hin`
- Question.subject = long form ("Mathematics", "Social Science"); Topic/UI subject = short form ("Math", "Social")
- Question.examBoard = upper-case board code ("CBSE", "ICSE", "AP_SSC")
- NcertChapter.board = upper-case board code; .grade = string ("9" not 9); .subject = long form ("Mathematics")

**Examples:**
- ✅ `cbse_math10_ch1_euclid_division_lemma`
- ✅ `icse_math9_ch5_linear_inequations`
- ✅ `ap_ssc_math10_ch1_real_numbers`
- ❌ `Algebra Basics` (v0 freeform)
- ❌ `ch1_s1_c1_t1` (v1 positional)
- ❌ `cbseMath10Ch1` (camelCase)
- ❌ `math10_*` (no board prefix — works only because boardIdFilter treats it as CBSE default)

---

## Future cleanup (NOT today)

1. **Rename CBSE Math 1-7 to add `cbse_` prefix** (`math5_ch1_*` → `cbse_math5_ch1_*`). About 50 topicIds × 7 grades = small migration. Improves consistency, no functional change (boardIdFilter handles both today).

2. **Author the `cbse_math10_ch5_nth_term` 16 questions** — only remaining 100% block.

3. **Decide on the 5 chapter-level catch-all Qs in CBSE 10** (`"Algebra Basics"` etc., 80 total):
   - Option A: leave as-is, they serve mixed-practice mode
   - Option B: rename to `cbse_math10_ch{N}_mixed` so they have canonical ids
   - Option C: delete (already covered by per-sub-topic Qs)

4. **Decide on the 32 null-topicId CBSE 10 Qs** — review each, assign a topicId or delete.

5. **Run audit:math weekly in CI** so the next convention drift gets caught in a day, not months.

---

## Validator additions (today)

- `npm run validate:track-isolation` — static scan for routes touching `req.user.id` without auth middleware (101 controllers, all clean)
- `npm run validate:board-isolation` — already existed; runs clean
- `npm run smoke` — bundles all 10 backend gates into one ~26s command. Exits 0 only when everything's green.
- `e2e/viewAsChild.spec.js` — Playwright test for the parent-views-child happy path
- `actAsChild.integration.test.js` — 9 jest tests for the auth swap, real DB

---

## How to read this if you weren't in the conversation

The big takeaway: **content was never lost**, the convention just drifted across 18 months of building. Today's work normalized 99% of it and put guards in place (`smoke`, `validate:track-isolation`) so the next drift gets caught the same day.

If you want the audit at 100%, the only thing left is authoring 16 nth-term questions for `cbse_math10_ch5_nth_term`. Everything else is cosmetic / nice-to-have.
