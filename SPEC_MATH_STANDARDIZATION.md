# Math Standardization Spec

> One source of truth for unifying Math content across all classes and boards.
> Benchmark = current CBSE Class 10 Math (54/54 passing 14-point checklist).
> Scope = ~568 sub-topics across CBSE 1–9, CBSE 10 (re-keyed only), ICSE 10.
> Written 2026-05-21. Pending: user sign-off → Class 9 pilot → plow.

---

## 1. Locked decisions (from 2026-05-21 session)

| # | Decision | Choice |
|---|---|---|
| 1 | **Density target** | Full Class 10 benchmark: MCQ + board-style + PYQ |
| 2 | **topicId format** | Board-prefixed: `{board}_{subj}{grade}_ch{N}_{descriptor}` |
| 3 | **Diagrams** | ≥1 SVG required on **every** sub-topic across the gap |
| 4 | **Execution** | This spec → pilot Class 9 → user sign-off → plow remaining |

These four are non-negotiable for the remainder of the standardization work. Any deviation must come back to the user, not be made inline.

---

## 2. topicId convention

### 2.1 Canonical pattern

```
{board}_{subj}{grade}_ch{N}_{descriptor}
```

| Token | Spec | Examples |
|---|---|---|
| `board` | lowercase board code | `cbse`, `icse`, `ssc`, `ib` |
| `subj` | lowercase 4-letter subject code | `math` (this spec); future: `sci`, `sst`, `engl`, `hndi` |
| `grade` | numeric grade, no padding | `1` … `12` |
| `N` | numeric chapter number, no padding | `1` … `25` |
| `descriptor` | lower_snake_case, ≤30 chars, no abbreviations a student wouldn't know | `real_numbers`, `pair_of_linear_equations`, `cylinder_cone_sphere` |

### 2.2 Examples

| Before | After |
|---|---|
| `ch1_s1_c1_t1` *(CBSE 10 today)* | `cbse_math10_ch1_real_numbers_intro` |
| `math9_ch1_cartesian_plane` *(CBSE 9 v2 today)* | `cbse_math9_ch1_cartesian_plane` |
| `icse10_ch5_quadratic_equations` *(ICSE 10 today)* | `icse_math10_ch5_quadratic_equations` *(no change in semantics, only prefix)* |
| *(new)* | `cbse_math1_ch1_shapes_and_space` |

### 2.3 What changes vs. today

- **CBSE 10** — every existing topicId renames (54 docs in `NcertTopicContent`, ~895 in `Question`). Migration is **mandatory** because the new convention demands a `cbse_math10_` prefix the current IDs don't have.
- **CBSE 1–9** — drop the v1 `math{G}_ch{N}` form entirely; v2 IDs gain the `cbse_` prefix.
- **ICSE 10** — `icse10_` becomes `icse_math10_`.
- **DAG, audit, lessons, NcertTopicView** all key off topicId prefix — every place that branches on prefix needs updating in lockstep.

### 2.4 Migration plan for CBSE 10 (the only renamed set)

1. Author `migrateCbseMath10TopicIds.mjs` — pure remap script:
   - Build a map `OLD_ID → NEW_ID` for all 54 topics (hand-written; descriptors come from CONTENT_PIPELINE.md mapping table or live NcertTopicContent.name).
   - In a single transaction: `bulkWrite` updates against `NcertTopicContent`, `Question`, `NcertChunk`, `Topic` (where applicable).
   - Dry-run mode (`--dry`) prints the map and counts without writing.
2. Update `auditMathChecklist.mjs` regex: `CBSE+10 → /^cbse_math10_/`.
3. Update `auditCoverage.mjs` `EXPECTED` array: replace 54 `ch{N}_s{N}_c{N}_t{N}` IDs with `cbse_math10_*`.
4. Update `seedTopicDAG.js` edges: same remap.
5. Update `frontend/src/pages/Lessons.jsx` grade-10 filter (today: "everything NOT math1_…math9_") → `t.topicId.startsWith("cbse_math10_")`.
6. Update `frontend/src/pages/NcertTopicView.jsx` `isSciLike` and the Math nested-intuition branch to handle `cbse_math10_*`.
7. Re-run `npm run audit:math --board=CBSE --grade=10` — must still return 54/54.

**No fallbacks, no aliases.** The user has previously instructed: don't keep deprecated identifiers around as shims. The migration replaces in place; if anything outside the listed surfaces references an old ID, that's a bug to find and fix, not paper over.

---

## 3. Content schema — the 14-point gate

Every sub-topic's `NcertTopicContent` document must satisfy all 14 below. The audit is binary (each item is non-empty or empty); this spec sets the **quality bar** above the audit's mechanical pass.

### 3.1 Top-level fields (2)

| # | Field | Type | Quality bar |
|---|---|---|---|
| 1 | `key_formulas` | `[{formula, explanation}]` | ≥2 entries for any topic that has formulas; for topics that are purely visual (e.g. constructions) use a single entry restating the geometric fact. Never empty. |
| 2 | `prerequisite_knowledge` | `string[]` | ≥3 concept names, each matching the **name** of another topic in the DB if applicable (so the planner can resolve a prereq chain). |

### 3.2 `teaching_content` fields (11)

| # | Field | Shape | Quality bar |
|---|---|---|---|
| 3 | `intuition` | object: `{elevator_pitch, hook, real_world_anchors[], the_pivot_idea, wrong_intuitions_to_replace[]}` | All 5 sub-fields populated (Deep mode renders all 5). `elevator_pitch` ≤2 sentences. |
| 4 | `derivation` | string or `{claim, proof, example}` | Must answer "why is this true." For primary grades (1–5), substitute a concrete-example walkthrough. |
| 5 | `worked_example` | `[{problem, steps[], answer}]` | ≥2 problems for grades 6+; ≥1 for grades 1–5. Steps numbered, no shorthand. |
| 6 | `visual_description` | string | Plain-prose description of what the SVG depicts. Used by screen readers + AI tutor. |
| 7 | `svg_diagrams` | `[{id, title, svg}]` | ≥1 entry. SVG is **inline string** (the existing schema) — but new diagrams may also be registered in `frontend/src/components/DiagramLibrary.jsx` via `DIAGRAM_MAP` for the topic view. Spec §5 defines the rules. |
| 8 | `common_misconceptions` | `[{wrong_idea, correction}]` | ≥2 entries. Sourced from actual student errors where possible. |
| 9 | `shortcuts_and_tricks` | `[{shortcut, rule, example, when_to_use}]` | ≥1 entry. If a topic has no genuine shortcut, the entry is a mnemonic for remembering the core rule. |
| 10 | `when_to_use_this_method` | `{use_this_when[], use_other_when[]}` | Decision-tree text. Both arrays ≥2 entries. |
| 11 | `edge_cases` | `[{case, value, reasoning, where_it_appears}]` | ≥2 entries. Boundary inputs, zero, negatives, equality cases. |
| 12 | `key_takeaway` | string | 1–2 sentences. Re-stable across the topic — the thing a student must walk away knowing. |
| 13 | `video_script_hooks` | object | Shape used by AI video generator (existing convention — match Class 10 sample exactly). |

### 3.3 Practice — Question density (the new bar)

This is the **biggest delta** vs. v2 today (which is 8 MCQ-only per sub-topic).

Per sub-topic, the spec mandates **three layers**:

| Layer | Qs/sub-topic | Style | DB marker |
|---|---|---|---|
| **A. Standard MCQs** | 10 | conceptual + procedural | `questionType: "mcq"`, no special flag |
| **B. Board-style** | 4 | matches the board's actual exam style (short/long-answer presented as MCQ; HOTS for CBSE; multi-part for ICSE) | `questionType: "mcq"`, `tags: ["board_style"]` |
| **C. PYQ** | 2 | previous-year question from that board | `questionType: "mcq"`, `tags: ["pyq"]`, `pyqYear: <YYYY>` |
| **Total** | **16/sub-topic** | | |

**Why 16 and not 16+:** Class 10's *average* is ~16 (range 11–44, total 895 across 54). Anchoring on the average gives a uniform bar without inflating low-density topics. Topics that warrant more get more (still tagged correctly); the floor is 16.

**Totals across the gap:**

| Surface | Sub-topics | Qs (at 16/topic) |
|---|---|---|
| CBSE 10 (re-key only — already at avg 16) | 54 | 895 (existing) |
| CBSE 9 | 32 | 512 |
| CBSE 8 | 56 | 896 |
| CBSE 7 | 60 | 960 |
| CBSE 6 | 40 | 640 |
| CBSE 5 | 56 | 896 |
| CBSE 4 | 56 | 896 |
| CBSE 3 | 56 | 896 |
| CBSE 2 | 60 | 960 |
| CBSE 1 | 52 | 832 |
| ICSE 10 | 100 | 1,600 |
| **Total new** | **568** | **~9,088 new questions** |

PYQ availability for primary grades (1–5) is realistically zero — CBSE does not set board exams below Class 10. Layer C is **skipped for grades 1–5** and replaced with 2 extra Layer B questions, keeping per-topic count at 16. ICSE has board exams only at 10 and 12, same rule: PYQ for ICSE 10, not below.

---

## 4. Question schema

```js
{
  topicId:        "cbse_math9_ch1_cartesian_plane",
  topic:          "Cartesian Coordinate Plane",
  subtopic:       "Cartesian Coordinate Plane",
  subject:        "Mathematics",
  grade:          "9",                 // numeric only, board lives below
  examBoard:      "CBSE",              // mandatory — see board_isolation feedback
  questionText:   "…",
  questionType:   "mcq",
  difficulty:     "easy" | "medium" | "hard",
  difficultyScore: 0.2 | 0.5 | 0.8,
  marks:          1,
  tags:           [],                  // [] | ["board_style"] | ["pyq"]
  pyqYear:        2023,                // only when tags includes "pyq"
  isAIGenerated:  true,
  options: [
    { text: "…", type: "correct",           logicTag: "" },
    { text: "…", type: "concept_error",     logicTag: "<short-tag>" },
    { text: "…", type: "calculation_error", logicTag: "<short-tag>" },
    { text: "…", type: "partial_logic",     logicTag: "<short-tag>" },
  ],
  solutionSteps: ["Step 1…", "Step 2…", "Step 3…"],
  shortcut:      "…",
}
```

Difficulty mix per sub-topic (16 total):
- 5 easy (`difficultyScore: 0.2`)
- 7 medium (`0.5`)
- 4 hard (`0.8`)

---

## 5. SVG diagrams

Two storage paths exist today and the spec keeps both:

1. **Inline string** inside `teaching_content.svg_diagrams[].svg` — satisfies checklist item 7 (this is what the audit grep'es for).
2. **DIAGRAM_MAP** entry in `frontend/src/components/DiagramLibrary.jsx` — used by `NcertTopicView` to render the visual. Required for the diagram to actually show on screen.

Both must exist for every sub-topic across the 568 gap. The seed populates path 1; the frontend file gets path 2 added in the same PR.

**SVG authoring rules** (carried from CONTENT_PIPELINE.md Phase 4):
- `viewBox="0 0 560 320"` (or 400/480 for simpler diagrams).
- `fill="currentColor"` on text so dark-mode works.
- No external imports. Pure SVG primitives.
- Labels over decoration — the SVG teaches, it doesn't ornament.

For primary grades (1–5), diagrams lean visual (objects, groupings, number lines) over symbolic. For 6–10, diagrams lean geometric/algebraic (figures, graphs, coordinate planes).

---

## 6. File organization

For each grade × board, the seeds follow this exact layout:

```
backend/config/
  seed{Board}Math{Grade}Cleanup.js       ← wipes old topicIds (only if migrating from existing data)
  seed{Board}Math{Grade}Content.js       ← all NcertTopicContent docs, one per sub-topic, all 13 content fields populated
  seed{Board}Math{Grade}QuestionsA.js    ← Layer A: standard MCQs (10/topic)
  seed{Board}Math{Grade}QuestionsB.js    ← Layer B: board-style (4/topic)  [or 6/topic for grades 1-5]
  seed{Board}Math{Grade}QuestionsC.js    ← Layer C: PYQs (2/topic)         [grades 10 only, plus ICSE 12 when added]
  seed{Board}Math{Grade}TopicDAG.js      ← prerequisite edges
  seed{Board}Math{Grade}All.js           ← convenience runner: cleanup → content → A → B → C → DAG
```

Each grade's content is a single file (not split by unit) because the file is the unit of replay — re-running it must always result in the same DB state. Splitting raises drift risk.

`package.json` aliases per grade:

```
"seed:cbse-math9-all":      "node config/seedCbseMath9All.js",
"seed:cbse-math9-content":  "node config/seedCbseMath9Content.js",
"audit:math:cbse-9":        "node config/auditMathChecklist.mjs --board=CBSE --grade=9",
```

---

## 7. Per-grade execution checklist

For each grade × board (used as the gate before claiming a grade "done"):

```
[ ] 1. Author seed{Board}Math{Grade}Content.js with all 13 content fields
        per sub-topic (no placeholders, no TODOs).
[ ] 2. Author SVG entries in DiagramLibrary.jsx (DIAGRAM_MAP) for all sub-topics.
[ ] 3. Author Layer A questions (10/topic).
[ ] 4. Author Layer B questions (4/topic, or 6 for grades 1-5).
[ ] 5. Author Layer C questions (2/topic — grade 10 only, skip otherwise).
[ ] 6. Author seed{Board}Math{Grade}TopicDAG.js with prerequisite edges.
[ ] 7. Update auditMathChecklist.mjs regex resolver for {board}+{grade}.
[ ] 8. Update auditCoverage.mjs EXPECTED array.
[ ] 9. Update Lessons.jsx topic-grouped filter for {board} + {grade}.
[ ] 10. Update NcertTopicView.jsx prefix detection.
[ ] 11. Rebuild RAG chunks for Mathematics.
[ ] 12. Run: npm run audit:math:<board>-<grade>  →  must show 54/54 (or N/N) PASS.
[ ] 13. Run: npm run audit:coverage Mathematics →  must show grade as FULLY COVERED.
[ ] 14. Update BLUEPRINT.md.
[ ] 15. Visual smoke test in browser: pick 2 random sub-topics, verify Study page
        renders all sections (Quick + Deep), diagram shows, Practice opens with
        Layer A/B/C questions tagged correctly.
[ ] 16. Commit (one commit per grade × board): "Feat: standardize {board} Math
        Class {N} to 14-point bar — {N} sub-topics, {N} Qs."
```

The grade is **not done** until step 15 visually passes. The audit only checks structural completeness, not whether the page renders correctly — UI regression has bitten this project before (English wasn't wired through Lessons.jsx).

---

## 8. Pilot — CBSE Class 9

**Why Class 9:** smallest pre-existing v2 footprint (32 sub-topics, 8 chapters), already has skeleton content + 200 MCQs, well-known textbook (Ganita Manjari Grade 9 Part I). Smallest risk of pipeline rework.

**Pilot scope:**
- 32 sub-topics (no growth; same chapter/sub-topic decomposition as today's v2).
- 512 new questions (32 × 16) — replaces today's 200 v2 MCQs entirely.
- 32 SVG diagrams (32 new DiagramLibrary entries).
- ~32 × ~5KB rich content per topic = ~160KB of seed content (rough estimate).
- topicId remap: `math9_*` → `cbse_math9_*`.

**Pilot acceptance criteria:**
- `npm run audit:math --board=CBSE --grade=9` returns 32/32 PASS.
- 4 sub-topics randomly sampled in the browser show: no blank sections in Quick or Deep mode, working diagram, 16 questions across A/B/C in Practice.
- BLUEPRINT.md updated.
- One commit, no force-push, user reviews.

**After the pilot passes:** user signs off, then the plow phase begins. If the pilot reveals a flaw in this spec, the spec is updated before plowing.

---

## 9. Plow order after pilot

Recommended order, smallest-risk first:

1. **CBSE 10 re-key** (no content rewrite, just migration; validates the migration script before any rich content depends on it).
2. **ICSE 10** (100 sub-topics; same shape as CBSE 10 but separate audit lane).
3. **CBSE 6 → 7 → 8** (middle school; high student volume, content density most like CBSE 10).
4. **CBSE 1 → 2 → 3 → 4 → 5** (primary; different content tone, but smaller per-topic content blocks).

Each grade is its own commit. Each grade gates on its own audit + smoke test. No bundled "all primary in one commit" — that's how regressions creep in unreviewed.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| CBSE 10 migration drops a Question due to silent topicId mismatch | Migration script logs Old→New counts per collection; abort if any source ID has no target. Dry-run mandatory before write. |
| 9,088 new questions × 5 quality bar = long write sessions, model output truncation mid-file | Every grade's questions are split across files A/B/C; each file is independently re-runnable (`findOne + upsert`). If a session truncates, the next session re-runs the file and dedupe handles repeats. Use `full-output-enforcement` skill when drafting any seed file over 1k lines. |
| Frontend wiring missed (English bug repeats) | Step 15 of the per-grade checklist is mandatory visual smoke test. No "I'll wire it later." |
| RAG drift (new content seeded, AI tutor still cites old IDs) | RAG rebuild is step 11 of the checklist — runs per-grade, not at the end. |
| Board contamination (CBSE topic leaking into ICSE response) | Every endpoint must use `utils/boardFilter.js`. Spec assumes that's already in place (per `feedback_board_isolation`); flag as a separate concern if violated during pilot. |
| Density target proves wrong mid-plow | Density is locked in this spec but revisitable **after** the pilot. Update the spec before plowing; don't carry contradictions. |

---

## 11. What this spec does NOT cover

- Adding new boards (SSC, IB, State Boards) — same template applies, but each is a separate sign-off.
- Adding Classes 11–12 (CBSE Maths or any board) — separate scope; the syllabus split (Maths Standard vs. Maths Basic at 10, then Applied vs. Core at 11/12) needs its own decision pass.
- Subjects other than Maths — Science, English, Hindi, SST already have their own pipeline conventions in CONTENT_PIPELINE.md; aligning them with this board-prefixed convention is a separate spec.
- Refactoring the inline SVG storage out of the document — the spec assumes the current schema. If we ever move SVGs to a CDN or component-only storage, that's a migration of its own.

---

## 12. Sign-off

User must explicitly approve this spec before any code is written for the pilot (Task #2). On approval, the next concrete action is:

> Author `seedCbseMath9Content.js` end-to-end for Chapter 1 (Cartesian plane, 4 sub-topics, full 13-field content + 16 questions/topic + SVGs), validate the audit passes on that one chapter, then complete the remaining 7 chapters of the pilot.

If the spec is rejected or partially modified, this file is the place to update — not the seed files, not the audit, not the memory.

---

*Source: 2026-05-21 session. Memory anchor: `project_math_standardization.md`. Benchmark: CBSE Class 10 Math (54/54 passing). Author: Claude + user co-design.*
