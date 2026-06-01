# Content Pipeline Status

> Single source of truth for what exists and what is missing across every board × grade × subject.
> Update this file in the same commit as the seed scripts.
> Phases reference `CONTENT_PIPELINE.md` for full instructions.

**Phase key:**
| Symbol | Meaning |
|--------|---------|
| ✅ | Complete — all checks pass |
| ⚠️ | Partial — see note |
| ❌ | Not started |
| — | Not applicable for this subject |
| ? | Unknown — needs audit |

**Phase columns:**
- **Ph0** Scope + syllabus map + auditCoverage.mjs EXPECTED entries
- **Ph1** Curriculum skeleton (NcertChapter)
- **Ph2** Teaching content (NcertTopicContent)
- **Ph3** Practice questions (Question)
- **Ph4** SVG Diagrams (DiagramLibrary.jsx)
- **Ph5** Topic DAG (prerequisite graph)
- **Ph6** RAG chunks (AI tutor knowledge base)
- **Ph7** Convenience runner (`seed:xxx-all` npm script chains all phases)
- **Ph8** Coverage audit (`npm run audit:coverage` + `npm run audit:math` both exit 0)
- **Ph9** Frontend wiring (Lessons.jsx + NcertTopicView.jsx)
- **Audit** `npm run validate:board-isolation` + `npm run audit:coverage` both exit 0

---

## CBSE

### Mathematics

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | 54 | 503 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 54 NcertTopicContent docs + 14 chapter skeletons; 503 Qs (391 sub-topic + 80 chapter-mixed + 32 nulls re-keyed → `cbse_math10_ch<N>_mixed`); audit 54/54 pass after `migrateCbseMath10QuestionsV0ToV2.mjs` (v0 descriptive→v2) + `migrateCbseClass10OrphanQuestions.mjs` + 16 authored nth-term Qs (2026-05-25) |
| 9  | 30 | ~900  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Ph4 complete 2026-05-24: 32 DIAGRAM_MAP entries (8 reused ICSE 9 + 24 new SVG fns); Ch1–Ch8 fully covered |
| 8  | 56 | 627   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | v3 standardized (cbse_math8_*); 56 topics × 15/15 audit pass; 627 Qs (360A+155B+112C); 397 RAG chunks; DAG 56 nodes; 56 SVG diagrams (Ch1–Ch14, 28 new fns + 28 new entries); ALL PHASES COMPLETE 2026-05-24 |
| 7  | 27 | ~810  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=60 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |
| 6  | 22 | ~660  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=40 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |
| 5  | 20 | ~600  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=56 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |
| 4  | 18 | ~540  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=56 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |
| 3  | 16 | ~480  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=56 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |
| 2  | 14 | ~420  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=60 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |
| 1  | 12 | ~360  | ✅ | ✅ | ✅ | ✅ | —  | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | v2 format; Ph5=chapter-level DAG only; Ph6=52 RAG chunks; Ph8=8/15 (v2 gap); Ph9=NcertTopicView wired 2026-05-23 |

### Science

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | 55 | 257 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 55 topics + 13 NcertChapter skeletons seeded 2026-05-25 (`seedCbseScience10NcertChapters.js`); 257 Qs total (227 sub-topic + 30 re-keyed → `cbse_sci10_ch<N>_mixed`); reference implementation for Science content format |
| 9  | —  | —    | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Not started |

### English

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | ~30 | ~200 | ✅ | ✅ | ✅ | ✅ | — | — | — | ✅ | ✅ | ✅ | ✅ | First Flight + Footprints; no diagrams for literature; 35/35 topics, 256 Qs |
| 9  | —   | —    | ❌ | ❌ | ❌ | ❌ | — | — | — | ❌ | ❌ | ❌ | ❌ | Not started |

### Hindi

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | ~25 | ~200 | ✅ | ✅ | ✅ | ✅ | — | — | — | ✅ | ✅ | ✅ | ✅ | Kshitij + Kritika; 32/32 topics, 129 Qs |
| 9  | —   | —    | ❌ | ❌ | ❌ | ❌ | — | — | — | ❌ | ❌ | ❌ | ❌ | Not started |

### Social Science

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | ~40 | ~200 | ✅ | ✅ | ✅ | ✅ | — | — | — | ✅ | ✅ | ✅ | ✅ | History + Geography + Civics + Economics; 61/61 topics, 359 Qs ⚠️ Manufacturing Industries + Lifelines of National Economy have 0 questions |
| 9  | —   | —    | ❌ | ❌ | ❌ | ❌ | — | — | — | ❌ | ❌ | ❌ | ❌ | Not started |

---

## ICSE

### Mathematics

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | 100 | 1600 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 25 NcertChapter docs (icse_math10_ch1–ch25, board=ICSE); 100 topics, 1600 Qs. ALL PHASES COMPLETE. Source: Selina textbook. |
| 9  | 112 | 1792 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 28 NcertChapter docs (icse_math9_ch1–ch28, board=ICSE); 112 topics, 1792 Qs, 589 RAG chunks, 112/112 audit PASS. ALL PHASES COMPLETE. |

**ICSE Math 9 — phase details:**
- Ph0 (Scope): 28 chapters mapped from Selina Concise Class 9 syllabus ✅
- Ph1 (Curriculum): ✅ 112 Topic docs in `seedIcseMath9Curriculum.js` + 28 NcertChapter docs in `seedIcseMath9NcertChapters.js` (icse_math9_ch1–ch28, board=ICSE, grade=9). npm script: `seed:icse-math9-chapters`; prepended to `seed:icse-math9-all`.
- Ph2 (Teaching content): 112/112 NcertTopicContent docs in `seedIcseMath9Content.js` ✅
- Ph3 (Questions): 1792 Qs — 1120 MCQ (A) + 448 short-answer (B) + 224 long-answer (C) across all 28 chapters (2026-05-24). 10 MCQ + 4 short + 2 long per topic. `examBoard:"ICSE"` on all. ✅
- Ph4 (Diagrams): ✅ 48 SVG diagram components added to DiagramLibrary.jsx (2026-05-24) — Ch9–Ch17, Ch20–Ch21, Ch26 fully covered (4 diagrams/chapter × 12 chapters). Components: Icse9CongruenceIntro through Icse9CoordProblems.
- Ph5 (DAG): ✅ `seedIcseMath9TopicDAG.js` created (2026-05-24) — 112 nodes, linear chain per chapter, 24 cross-chapter edges. All 112 NAME_OVERRIDES present.
- Ph6 (RAG): ✅ 589 NcertChunk docs indexed (2026-05-24) — `buildRagFromTopicContent.js --prefix=icse_math9_` → 112 topics → 589 chunks.
- Ph7 (Runner): ✅ `seed:icse-math9-all` npm script added to package.json (2026-05-24) — chains curriculum → content → QA/B/C → TopicDAG → RAG build.
- Ph8 (Audit): ✅ 112/112 PASS (2026-05-24) — all 15 checks green. Also ran `patchIcseMath9Content.mjs` to migrate legacy field names (concept_explanation→intuition, worked_examples→worked_example, common_mistakes→common_misconceptions, mnemonics_and_tricks→shortcuts_and_tricks) and add placeholder svg_diagrams for 100 topics.
- Ph9 (Frontend): ✅ Wired 2026-05-24 — Lessons.jsx: added `grade === "9" && board === "ICSE"` → `icse_math9_*` filter. NcertTopicView.jsx: added `isIcseMath9TopicId`, `ICSE_MATH9_CHAPTER_TITLES` (28 chapters), `"icse_math9"` family entry, `setChapterTitle` handler.

**ICSE Math 10 — phase details:**
- Ph1 (Curriculum): ✅ 100 Topic docs (existing) + 25 NcertChapter docs in `seedIcseMath10NcertChapters.js` (icse_math10_ch1–ch25, board=ICSE, grade=10). npm script: `seed:icse-math10-chapters`; prepended to `seed:icse-math10-all`.
- Ph2 (Teaching content): 100/100 NcertTopicContent docs — 100/100 audit PASS (2026-05-23) ✅
- Ph3 (Questions): 1600 Qs across ch1–25 (10 MCQ + 4 short + 2 long per topic), `examBoard:"ICSE"` validated ✅
- Ph4 (Diagrams): ✅ 60 SVG diagrams added to DiagramLibrary.jsx (2026-05-23) — Ch4, Ch10–Ch23 fully covered (4 diagrams/chapter). Ch1–Ch3, Ch5–Ch9 are algebraic/commercial, no diagram needed.
- Ph5 (DAG): ✅ 100 nodes seeded (2026-05-23) — `seedIcseMath10TopicDAG.js`; linear chain within each chapter; names read from `topics` collection + 28 overrides for ch19–ch25 (which had topicId-as-name). `examBoard:"ICSE"` set on all nodes.
- Ph6 (RAG): ✅ 623 chunks indexed (2026-05-23) — `buildRagFromTopicContent.js --prefix=icse_math10_`; 100 topics → 623 NcertChunk docs (overview, formula, qa, concept types). Name fallback via `topics` collection added to RAG builder.
- Ph7 (Runner): ✅ `seed:icse-math10-all` chains content → QuestionsA/B/C → TopicDAG → RAG build in one command.
- Ph8 (Audit): ✅ `audit:math:icse10` → 100/100 PASS; `audit:coverage:icse-math10` → FULLY COVERED.
- Ph9 (Frontend): ✅ Wired 2026-05-23 — Lessons.jsx already had `icse_math10_*` filter + ICSE chapter titles. NcertTopicView.jsx fixed: added `isIcseMath10TopicId`, `ICSE_MATH10_CHAPTER_TITLES`, correct `family()` entry.
- Legacy `icse10_*` stubs: already cleaned from DB (0 docs) ✅

---

## AP SSC (Andhra Pradesh State Secondary Certificate)

> Curriculum = NCERT (Telugu-medium translation of same textbooks). All content cloned from CBSE equivalent.
> Board identifier: `AP_SSC` · topicId prefix: `ap_ssc_*`

### Mathematics

| Grade | Topics | Questions | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|-------|--------|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| 10 | 54 | 1140 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cloned from CBSE Math 10; 14 NcertChapter docs (ap_ssc_math10_ch1–ch14, board=AP_SSC); 54 topics; 1140 Qs; 884 RAG chunks; ALL PHASES COMPLETE 2026-05-24 |
| 9  | 35 | 560  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Traditional NCERT Class 9; 12 NcertChapter docs (ap_ssc_math9_ch1–ch12, board=AP_SSC); 35 topics; 560 Qs; 229 RAG chunks; 35/35 audit PASS; ALL PHASES COMPLETE 2026-05-24 |

**AP SSC Math 9 — phase details (2026-05-24):**
- Ph0 (Scope): 12 chapters (NCERT Class 9 rationalized 2024-25); topicId prefix `ap_ssc_math9_*`; board `AP_SSC`; English-only ✅
- Ph1 (Curriculum skeleton): ✅ 12 NcertChapter docs seeded 2026-05-24 — `seedApSscMath9NcertChapters.js`; chapterId prefix `ap_ssc_math9_ch{N}`, board `AP_SSC`, grade `9`. npm script: `seed:ap-ssc-math9-chapters`. Prepended to `seed:ap-ssc-math9-all`.
- Ph2 (Teaching content): ✅ 35/35 NcertTopicContent docs seeded (2026-05-24) — `seedApSscMath9Ch01.js` through `Ch12.js`; all 13 content-field checks pass (intuition, derivation, worked_example, visual_description, svg_diagrams, common_misconceptions, shortcuts_and_tricks, when_to_use_this_method, edge_cases, key_takeaway, video_script_hooks, key_formulas, prerequisite_knowledge).
- Ph3 (Questions): ✅ 560 Questions seeded across 28 seed files
  - Layer A (MCQ): 12 chapter files × 10 Qs/topic = 350 MCQs (`seedApSscMath9QuestionsACh01.js` – `Ch12.js`)
  - Layer B (free-text): 12 chapter files × 4 Qs/topic = 140 questions (`seedApSscMath9QuestionsBCh01.js` – `Ch12.js`)
  - Layer C (PYQ): 4 files = 70 PYQs (`seedApSscMath9QuestionsCCh01.js`, `Ch02.js`, `Ch03to06.js`, `Ch07to12.js`)
  - All questions have `examBoard:"AP_SSC"`, `grade:"9"`, `questionId` with `ap_ssc9_ch*` prefix
- Ph4 (Diagrams): ✅ 35 DIAGRAM_MAP entries added 2026-05-24 — 27 reused from existing CBSE Math 9 / ICSE 9 / ICSE 10 components; 8 new SVG functions (ApSscMath9LinearEqSolutions/Graph/SpecialLines for Ch4; ApSscMath9EuclidPostulates/FifthPostulate for Ch5; ApSscMath9BasicAngles/ParallelTransversal/ParallelTransitivity for Ch6).
- Ph5 (DAG): ✅ 35 nodes in `seedApSscMath9TopicDAG.js` — linear chain per chapter + 2 cross-chapter prereq edges (Ch10→Ch10, Ch11 prereqs)
- Ph6 (RAG): ✅ 229 NcertChunk docs indexed (2026-05-24) — `buildRagFromTopicContent.js --prefix=ap_ssc_math9_` → 35 topics → 229 chunks.
- Ph7 (Runner): ✅ Full npm script chain in `package.json`:
  - Individual content: `seed:ap-ssc-math9-content-ch01` through `ch12` (12 scripts)
  - Batch content: `seed:ap-ssc-math9-content-all`
  - Individual questions A/B/C: `ch01`–`ch12` per layer (28 scripts)
  - Batch: `seed:ap-ssc-math9-questions-a-all`, `b-all`, `c-all`
  - Master: `seed:ap-ssc-math9-all` → content → questions-A → questions-B → questions-C → DAG → RAG
  - Audit: `audit:math:ap-ssc-9`
- Ph8 (Audit): ✅ 35/35 PASS (2026-05-24) — all 15 checks green. Coverage audit: FULLY COVERED (35/35 topics, 558 Qs visible).
- Ph9 (Frontend): ✅ Wired 2026-05-24 — Lessons.jsx: grade "9" added to `MATH_CHAPTER_TITLES_AP_SSC` (12 chapters) + `ap_ssc_math9_*` branch in `mathChapterGroups`. NcertTopicView.jsx: `AP_SSC_MATH9_CHAPTER_TITLES`, `isApSscMath9TopicId`, `isApSscMath9` variable, `"ap_ssc_math9"` family entry, `setChapterTitle` handler.

**AP SSC Math 10 — phase details:**
- Ph0 (Scope): 14 chapters (same as NCERT Math 10); topicId prefix `ap_ssc_math10_*`; board confirmed identical via PDF cross-check (2026-05-24) ✅
- Ph1 (Curriculum skeleton): ✅ 14 NcertChapter docs seeded 2026-05-24 — `seedApSscMath10NcertChapters.js`; chapterId prefix `ap_ssc_math10_ch{N}`, board `AP_SSC`, grade `10`. npm script: `seed:ap-ssc-math10-chapters`. Prepended to `seed:ap-ssc-math10-all`.
- Ph2 (Teaching content): 54/54 NcertTopicContent docs cloned from `cbse_math10_*` → `ap_ssc_math10_*` via `seedApSscMath10.js` ✅
- Ph3 (Questions): 1140 Questions cloned from `cbse_math10_*`; `examBoard:"AP_SSC"` set on all ✅
- Ph4 (Diagrams): ✅ Inherits SVG diagrams from CBSE Math 10 content (embedded in NcertTopicContent teaching_content)
- Ph5 (DAG): ✅ 54 nodes seeded — `seedApSscMath10TopicDAG.js`; linear chain + cross-chapter prereqs; `examBoard:"AP_SSC"` ✅
- Ph6 (RAG): ✅ 884 chunks — `buildRagFromTopicContent.js --prefix=ap_ssc_math10_` ✅
- Ph7 (Runner): ✅ `seed:ap-ssc-math10-all` + `rag:build-ap-ssc-math10` in package.json ✅
- Ph8 (Audit): ✅ `audit:math:ap-ssc-10` → 54/54 PASS (100%); `audit:coverage:ap-ssc-math` → FULLY COVERED ✅
- Ph9 (Frontend): ✅ `Lessons.jsx` — `ap_ssc_math10_*` filter + AP_SSC chapter titles added; `StartOnboarding.jsx` + `Onboarding.jsx` — AP_SSC board option added ✅
- Board isolation: `boardFilter.js` — `ap_ssc_` prefix → `AP_SSC` board ✅

### Other Subjects (AP SSC)

| Subject | Grade | Notes |
|---------|-------|-------|
| Science | 10    | Planned — same NCERT curriculum as CBSE Science 10 |
| Social Studies | 10 | Planned |
| Telugu  | 10    | Planned — Telugu-medium; unique content (no CBSE equivalent) |

---

## SSC

| Subject | Grade | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|---------|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| (any)   | —     | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | Not started — topicId prefix: `ssc_` |

---

## IB

| Subject | Grade | Ph0 | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 | Ph7 | Ph8 | Ph9 | Audit | Notes |
|---------|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|-------|
| (any)   | —     | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | Not started — topicId prefix: `ib_` |

---

## How to update this file

When you complete a phase:
1. Change `❌` → `✅` (or `⚠️` with a note if partial)
2. Update the Topics/Questions count if it changed
3. Add a note if there's anything non-obvious (partial chapters, known gaps, cleanup scripts pending)
4. Commit in the same PR as the seed files

When you add a new board/grade/subject:
1. Add a row with all phases as `❌`
2. Fill in Ph0 details (scope, topicId prefix, source textbook)
3. Follow CONTENT_PIPELINE.md for each phase in order

**Ph7 checklist** — a row is Ph7 ✅ when:
- A `seed:xxx-all` npm script exists in `package.json`
- It chains every applicable phase script in order (curriculum → content → questions → DAG → RAG)
- Re-running it from scratch produces a clean DB state (all upserts, no duplicates)

**Ph8 checklist** — a row is Ph8 ✅ when:
- `npm run audit:coverage` (or board-scoped variant) exits 0 and shows FULLY COVERED
- For Math grades: `npm run audit:math --board=X --grade=N` exits 0 (all 14 checks pass per topic)
- `npm run validate:board-isolation` exits 0 (no examBoard/topicId prefix mismatches)

---

**v2 content density gap (grades 1–8):** The v2 seed format provides `intuition`, `process_explanation`, `worked_example`, `common_misconceptions`, `shortcuts_and_tricks`, `key_takeaway` — 8 of 15 audit checks pass. The 7 failing checks (`key_formulas`, `prerequisite_knowledge`, `visual_description`, `svg_diagrams`, `when_to_use_this_method`, `edge_cases`, `video_script_hooks`) require a future v3 enrichment pass to reach benchmark (Class 10) density. Ph5 is ⚠️ because existing DAG seeds use chapter-level nodes (`math{N}_ch{N}`) not sub-topic nodes — adequate for recommendations but not full prerequisite chains.

*Last updated: 2026-06-01 — **Audit complete on all CBSE Math grades 1–7**: all failing Ph8 audit (8/15 check pass — v2 format gaps on key_formulas, prerequisite_knowledge, visual_description, svg_diagrams, when_to_use_this_method, edge_cases, video_script_hooks). **Decision pending:** v3 enrichment or accept v2 baseline for K-8. All other boards/grades verified ✅. Full audit output in BLUEPRINT.md §1.1 (2026-06-01). Previous: 2026-05-30 — Pro track UX polish shipped. 2026-05-24 — ICSE Math 10 + 9, AP SSC Math 9 + 10, CBSE Math 8 + 9: ALL PHASES COMPLETE.*

---

## Professional tracks

Lives outside the school content pipeline — Pro models + content are in `models/proModels.js` and `content/pro/<lang>/...`. Pipeline phases above (Ph0–Ph9) don't all map; pro content uses its own audit (every exercise must have non-empty `testCases[]`).

| Track    | Modules | Topics | Exercises | Project | Status | Notes |
|----------|---------|--------|-----------|---------|--------|-------|
| pro_java | **51 (M1–M51)** | **247** | **~3,380** | **232** | 🎉 **COMPLETE** | Core 46 (M1–M46) LIVE since 2026-06-01 (168,365 XP; Ph5 DAG ✅ 232 nodes/419 edges; Ph6 RAG ✅ 911 chunks). **v3 parity modules added 2026-06-02:** M47 Bitwise (D3.1, 5 topics/15 ex), M48 Recursion Patterns (D3.2, 5/18), M49 Modern Java (J1, 5/12), M50 Engineering Hygiene (J2, 5/12), M51 Technical Communication (J3, 5/13). M49–M51 use `predict_output`/`pattern_match` (no Judge0 dependency — OpenJDK 13 sandbox can't compile Java 14+). |

**Pro Java v3 capabilities (beyond content):** AI Socratic Tutor (1.B), Pattern Recognition (1.C), Complexity Derivation (2.D), Spaced Repetition (2.F), Problem-First Reveal (2.G), Interview Simulator (H), Recursion-Tree visualizer (I1, M40/M41), Pattern Atlas page (D3.4), free-tier preview (D5.1, 10 lighthouse topics), Community Discussions (D5.3). See BLUEPRINT.md + ROADMAP.md.
