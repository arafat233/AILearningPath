# Stellar — Content Addition Pipeline

> **Reference doc for adding any new CBSE subject or class.**
> Covers the exact process used to build Class 10 Science from scratch.
> Follow these phases in order for every new subject/class.

---

## 0. How Content Is Stored (Data Models)

| Model | Collection | What it holds | File |
|-------|-----------|---------------|------|
| `NcertChapter` | `ncertchapters` | Chapter structure — subchapters, concept stubs, question shells | `ncertChapterModel.js` |
| `NcertTopicContent` | `ncerttopiccontents` | **Full teaching content** — intuition, explanation, worked examples, misconceptions, formulas, key takeaway | `ncertTopicContentModel.js` |
| `Question` | `questions` | MCQ practice questions with options, solution steps, shortcut | `questionModel.js` (via `models/index.js`) |
| `Topic` | `topics` | Lightweight topic record (name, subject, examFrequency) — shown in Admin → Topics | `topicModel.js` |
| `NcertChunk` | `ncertchunks` | RAG vector chunks for AI tutor — built from teaching content | `ncertChunkModel.js` |

**Key IDs:**
- **Math** topic IDs: `ch{N}_s{N}_c{N}_t{N}` — e.g. `ch5_s2_c1_t1`
- **Science** topic IDs: `sci_ch{N}_{descriptor}` — e.g. `sci_ch9_reflection_mirrors`
- **Future subjects**: use `{subj_code}_ch{N}_{descriptor}` — e.g. `sst_ch1_french_revolution`, `eng_ch1_letter_to_god`

**WARNING:** Never change a topicId after seeding — Questions link to them and renaming breaks all practice data.

---

## Phase 0 — NCERT Textbook Mapping (Specification)

**What:** Before writing a single line of seed code, map the full NCERT syllabus for the subject. This is your specification. Everything downstream is built from this map.

**Steps:**

1. Open the NCERT PDF for the subject (CBSE 2023-24 rationalized syllabus)
2. List every chapter → subchapter → topic
3. Cross-check against the CBSE 2023-24 rationalized syllabus — some chapters are deleted or reduced
4. Assign a `topicId` for every topic using the naming convention above
5. **Add all expected topicIds to the `EXPECTED` array in `backend/config/auditCoverage.mjs`** — this becomes your ground truth

**Why this step first:** The `EXPECTED` array in `auditCoverage.mjs` is the single source of truth for coverage. If you add it early, every subsequent phase can be verified against it with `npm run audit:coverage`.

**Example entry to add to `EXPECTED`:**
```js
{
  chapterId: "sst_ch1", chapterName: "The Rise of Nationalism in Europe",
  subject: "Social Science", grade: "10",
  expectedTopicIds: [
    "sst_ch1_french_revolution",
    "sst_ch1_nationalism_europe",
    "sst_ch1_making_of_germany",
    "sst_ch1_ireland_italy",
  ],
},
```

**Verify:** `npm run audit:coverage Social Science` — should show all topics as MISSING (not yet seeded). That's the correct starting state.

---

## Phase 1 — Curriculum Skeleton

**What:** Seed the chapter/subchapter/concept/topic outline into `NcertChapter`.

**File:** `backend/config/seed{Subject}Curriculum.js`

**How to write it:**
1. Use the topic map from Phase 0
2. Write the seed as a `CHAPTERS` array upserted on `chapterId`
3. `chapterId` format: `{subj_code}_ch{N}` (e.g. `sst_ch1`)

**Reference file:** `backend/config/seedScienceCurriculum.js`

**Run:** `node config/seed{Subject}Curriculum.js`

**Verify:** Admin → Topics page, or `db.ncertchapters.countDocuments({subject:"..."})`

---

## Phase 2 — Teaching Content (NcertTopicContent)

**What:** Full rich teaching content for every topic — one document per topic.

**Files (split by unit for maintainability):**
```
backend/config/seed{Subject}{Unit}Content.js
```
Example breakdown used for Science:
| File | Chapters | Topics |
|------|----------|--------|
| `seedScienceChemistryContent.js` | Ch 1–4 | 17 topics |
| `seedScienceBiologyContent.js` | Ch 5–8, 13 | 23 topics |
| `seedSciencePhysicsContent.js` | Ch 9–12 | 16 topics |

**Each topic document must have these fields:**
```js
{
  topicId:               "sci_ch5_photosynthesis",   // unique, never change after seeding
  subject:               "Science",
  chapterNumber:         5,
  name:                  "Photosynthesis",
  prerequisite_knowledge: [ "..." ],
  key_formulas:          [ "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" ],
  teaching_content: {
    intuition:               "...",   // relatable analogy first
    process_explanation:     "...",   // step-by-step, include equations
    worked_example:          "...",   // at least 2 CBSE-style exam Q&A
    common_misconceptions:   [ "..." ],
    shortcuts_and_tricks:    [ "..." ],
    diagram_description:     "...",   // what the diagram should show
    key_takeaway:            "...",   // 1–2 sentence summary
  },
}
```

**Important:** Science uses flat strings in `key_formulas`/`common_misconceptions`. Math uses nested objects `{formula, explanation}`. Keep consistent with subject convention.

**Run:** `node config/seed{Subject}{Unit}Content.js`

**Verify:** `npm run audit:coverage {Subject}` — "In DB" column should increment

---

## Phase 3 — Practice Questions

**What:** MCQ questions for every topic, minimum 4–5 per topic.

**Files:**
```
backend/config/seed{Subject}{Unit}Questions.js
```
Example: `seedScienceBiologyQuestions.js`, `seedScienceChemistryQuestions.js`, `seedSciencePhysicsQuestions.js`

**Each question document must have:**
```js
{
  topic:           "Life Processes",
  subtopic:        "Photosynthesis",
  topicId:         "sci_ch5_photosynthesis",       // must match NcertTopicContent
  subject:         "Science",
  grade:           "10",
  examBoard:       "CBSE",
  questionText:    "Which pigment absorbs sunlight?",
  questionType:    "mcq",
  difficulty:      "easy",          // "easy" | "medium" | "hard"
  difficultyScore: 0.2,             // easy=0.2, medium=0.5, hard=0.8
  marks:           1,
  isAIGenerated:   true,
  options: [
    { text: "Chlorophyll", type: "correct",       logicTag: "" },
    { text: "Carotene",    type: "concept_error", logicTag: "accessory_pigment" },
    { text: "Haemoglobin", type: "concept_error", logicTag: "animal_protein" },
    { text: "Xanthophyll", type: "concept_error", logicTag: "yellow_accessory" },
  ],
  solutionSteps: [ "Step 1...", "Step 2..." ],
  shortcut:       "Chloro = green = chlorophyll drives photosynthesis.",
}
```

**Distribution target per topic:** 2 easy + 2 medium + 1 hard = **5 questions minimum**

**Deduplication:** The seed uses `findOne({ questionText, subject })` — safe to re-run.

**Run:** `node config/seed{Subject}{Unit}Questions.js`

**Verify:** `npm run audit:coverage {Subject}` — "Qs" column should show ≥20 per chapter (green)

---

## Phase 4 — SVG Diagrams

**What:** Visual SVG components shown on the topic page below teaching content.

**File:** `frontend/src/components/DiagramLibrary.jsx`

**How to add:**

1. Write a new React function component returning an `<svg>` element:
```jsx
function PhotosynthesisDiagram() {
  return (
    <svg viewBox="0 0 560 320" width="100%" height="auto">
      {/* shapes, text, arrows */}
    </svg>
  );
}
```

2. Add an entry to `DIAGRAM_MAP` near the bottom of the file:
```js
sci_ch5_photosynthesis: { label: "Photosynthesis — Inputs & Outputs", Component: PhotosynthesisDiagram },
```

**SVG rules:**
- `viewBox="0 0 560 320"` (or 400/480 for simpler diagrams)
- `fill="currentColor"` on all text elements for dark-mode compatibility
- No external imports — pure SVG primitives only
- Keep it educational, not decorative — labels > art

**Verify:** `npm run audit:coverage {Subject}` — "Diagrams" column should go green

**Naming convention:**
- Science: `sci_{descriptor}` key → `{Descriptor}` component name
- Future: `sst_{descriptor}` → `{Descriptor}Sst` (add suffix if name clashes with existing component)

---

## Phase 5 — Topic DAG (Prerequisite Graph)

**What:** Defines which topics depend on which (prerequisite chain). Used by the AI planner.

**File:** `backend/config/seed{Subject}TopicDAG.js`

**Reference:** `backend/config/seedScienceTopicDAG.js` (Science) or `backend/config/seedTopicDAG.js` (Math)

**Format:**
```js
{ from: "sci_ch5_photosynthesis", to: "sci_ch5_respiration", weight: 0.8 }
```

**Run:** `node config/seed{Subject}TopicDAG.js`

---

## Phase 6 — RAG Chunks (AI Tutor Knowledge Base)

**What:** Splits teaching content into vector chunks for the RAG-based AI tutor.

**Run:**
```bash
npm run rag:build-science     # Science only
npm run rag:build-curriculum  # All subjects
```

Or directly: `node config/buildRagChunks.js --subject=Science`

**Re-run this phase every time teaching content changes.** Adding or editing topics without rebuilding RAG means the AI tutor won't know about the new content.

**Verify:** `db.ncertchunks.countDocuments({subject:"Science"})`

---

## Phase 7 — Convenience Runner

**What:** Create a single script that runs all phases for the subject in order.

**File:** `backend/config/seed{Subject}All.js`

**Reference:** `backend/config/seedScienceAll.js`

**Pattern:**
```js
import { execSync } from "child_process";

const scripts = [
  "config/seedSstCurriculum.js",
  "config/seedSstHistory Content.js",
  "config/seedSstGeographyContent.js",
  "config/seedSstHistoryQuestions.js",
  "config/seedSstGeographyQuestions.js",
  "config/seedSstTopicDAG.js",
];

for (const s of scripts) {
  console.log(`\n▶ ${s}`);
  execSync(`node ${s}`, { stdio: "inherit" });
}
```

**Also add npm script aliases to `package.json`:**
```json
"seed:sst-all": "node config/seedSstAll.js",
"seed:sst-curriculum": "node config/seedSstCurriculum.js",
"seed:sst-history-content": "node config/seedSstHistoryContent.js"
```

---

## Phase 8 — Coverage Audit

**What:** Run the automated audit to verify everything is in place before committing.

**Run:**
```bash
npm run audit:coverage {Subject}           # overview table
npm run audit:coverage:detail {Subject}    # per-topic breakdown with question counts
node config/auditCoverage.mjs {Subject} --missing-only   # gaps only
```

**What the audit checks:**
| Column | Pass condition |
|--------|---------------|
| In DB | Equals NCERT expected count |
| Missing | 0 |
| Qs | ≥ 4 per topic (green) |
| Diagrams | count/expected ratio = 1 |

**When you add a new subject:** Append to the `EXPECTED` array in `backend/config/auditCoverage.mjs` during Phase 0.

**Minimum standards per topic before committing:**
- [ ] Teaching content (NcertTopicContent document) ✅
- [ ] At least 5 MCQ questions ✅
- [ ] SVG diagram in DIAGRAM_MAP ✅
- [ ] Entry in topic DAG ✅
- [ ] `npm run audit:coverage {Subject}` shows ✅ FULLY COVERED

---

## Phase 9 — Frontend Navigation

**What:** Make the new subject accessible to students from the navigation.

**Check these places:**

1. **Subject selector** on the NCERT chapters page — does the new subject appear in the dropdown?
2. **Practice page** subject filter — does the new subject appear?
3. **Dashboard** subject tiles — add the subject if it should appear on the student dashboard
4. **Admin → Topics** — verify the topic list shows entries for the new subject

**Where to look:**
- Subject list: check any `SUBJECTS` or `subjects` constant in `frontend/src/`
- Nav: check `frontend/src/components/` for subject dropdowns
- Practice filter: `frontend/src/pages/Practice.jsx` or similar

---

## Phase 10 — Update BLUEPRINT.md

Update `BLUEPRINT.md` in the same commit as the seed files. Every new seed file, route change, or schema addition must be reflected there. This is how future Claude sessions know what exists.

**What to update in BLUEPRINT.md:**
- Add seed file descriptions with topic counts
- Add npm script aliases
- Update "Content" section with new subject stats

---

## Phase 11 — Admin Panel Verification

After running all seeds, verify in the admin panel:

| Admin Page | What to check |
|-----------|--------------|
| `/admin/questions` | Filter by subject → should see all topics with ≥5 questions each |
| `/admin/topics` | Should show basic topic entries |
| Student NCERT page | `/ncert/chapters/{subj}_ch1` → teaching content loads |
| Diagram check | Topic page → Diagram tab → SVG renders, not placeholder text |
| Practice | `/practice?subject={Subject}` → questions appear |

---

## What Was Done for Class 10 Science (Reference)

### Source
- NCERT Class 10 Science PDF (shared by user)
- CBSE 2023-24 rationalized syllabus

### Chapters covered
| Chapter | Unit | Topics | Questions | Diagram |
|---------|------|--------|-----------|---------|
| Ch1 Chemical Reactions | Chemistry | 4 | ~19 | ✅ |
| Ch2 Acids Bases Salts | Chemistry | 4 | ~18 | ✅ |
| Ch3 Metals Non-metals | Chemistry | 4 | ~15 | ✅ |
| Ch4 Carbon Compounds | Chemistry | 5 | ~17 | ✅ |
| Ch5 Life Processes | Biology | 6 | ~18 | ✅ |
| Ch6 Control Coordination | Biology | 5 | ~20 | ✅ |
| Ch7 Reproduction | Biology | 4 | ~20 | ✅ |
| Ch8 Heredity | Biology | 3 | ~15 | ✅ |
| Ch9 Light | Physics | 4 | ~18 | ✅ |
| Ch10 Human Eye | Physics | 3 | ~12 | ✅ |
| Ch11 Electricity | Physics | 4 | ~19 | ✅ |
| Ch12 Magnetic Effects | Physics | 5 | ~16 | ✅ |
| Ch13 Our Environment | Biology | 4 | ~15 | ✅ |
| **Total** | | **55 topics** | **222 questions** | **55/55** |

*Note: Ch8 has 3 topics in CBSE 2023-24 syllabus. sci_ch8_evolution is kept in DB but excluded from the EXPECTED audit array as it was removed from the 2023-24 rationalized syllabus.*

### Seed files created
```
backend/config/
  seedScienceCurriculum.js          ← Phase 1
  seedScienceChemistryContent.js    ← Phase 2 (17 topics)
  seedScienceBiologyContent.js      ← Phase 2 (23 topics incl. endocrine, reproductive health, variation)
  seedSciencePhysicsContent.js      ← Phase 2 (16 topics incl. domestic circuits)
  seedScienceChemistryQuestions.js  ← Phase 3
  seedScienceBiologyQuestions.js    ← Phase 3
  seedSciencePhysicsQuestions.js    ← Phase 3
  seedScienceMissingQuestions.js    ← Phase 3 (gap fill for 7 under-covered topics)
  seedScienceTopicDAG.js            ← Phase 5
  seedScienceAll.js                 ← Phase 7 convenience runner
```

### DiagramLibrary.jsx additions
- 55 SVG components for all Science topics
- DIAGRAM_MAP: 55 Science entries

### Key decisions made
1. Topic IDs: `sci_ch{N}_{descriptor}` (never change after seeding — breaks question links)
2. Content format: flat strings for Science (different from Math's nested objects)
3. Chapters excluded: Ch14 Sources of Energy (deleted from CBSE 2023-24 syllabus)
4. Evolution (sci_ch8_evolution): kept in DB though 2023-24 reduced it — kept for completeness but excluded from EXPECTED audit array

---

## Pipeline for Future Subjects

### CBSE Class 10 — Remaining subjects

| Subject | Code | Chapters | Estimated topics |
|---------|------|----------|-----------------|
| Social Science | `sst` | 10 (History 3, Geography 3, Civics 2, Economics 2) | ~40 |
| English (First Flight + Footprints) | `eng` | 11 prose + 10 poems + 10 supplementary | ~30 |
| Hindi (Kshitij + Kritika) | `hin` | 17 prose/poetry + 5 supplementary | ~25 |

### CBSE Class 9 — All subjects

| Subject | Code | Chapters |
|---------|------|----------|
| Mathematics | `ch9_math` | 15 chapters |
| Science | `sci9` | 15 chapters |
| Social Science | `sst9` | 12 chapters |
| English | `eng9` | 11 chapters |
| Hindi | `hin9` | 17 chapters |

### Grade prefix convention for Class 9
- Topic IDs: `sci9_ch{N}_{descriptor}`, `sst9_ch{N}_{descriptor}`
- Chapter IDs: `sci9_ch{N}`, `sst9_ch{N}`
- Curriculum seed: `seedClass9ScienceCurriculum.js`

### Recommended order to tackle new subjects
1. **High-impact first:** Class 10 Social Science (most content-dense, board exam heavy)
2. **Then:** Class 9 Math + Science (largest student base)
3. **Then:** Class 10 English, Hindi
4. **Then:** Class 9 remaining subjects

---

## Quick Start Checklist for a New Subject

```
[ ] 0. Get NCERT PDF + map all chapters → topic IDs
[ ] 0b. Add expected topicIds to EXPECTED array in auditCoverage.mjs
[ ] 0c. Run: npm run audit:coverage {Subject} → confirm all show as MISSING (starting state)
[ ] 1. Write seed{Subject}Curriculum.js → run it → verify chapter count in DB
[ ] 2. For each unit (split into 2-3 files):
        - Write teaching content → Phase 2 seed → run it
        - Write 5 questions per topic → Phase 3 seed → run it
        - Add SVG diagram to DiagramLibrary.jsx → Phase 4
[ ] 3. Run Phase 5 DAG seed
[ ] 4. Run Phase 6 RAG build
[ ] 5. Create seed{Subject}All.js convenience runner + add npm scripts to package.json
[ ] 6. Run: npm run audit:coverage {Subject} → must show ✅ FULLY COVERED
[ ] 7. Check frontend navigation — subject appears in selectors
[ ] 8. Verify admin panel + student topic pages
[ ] 9. Update BLUEPRINT.md with new seed file counts and npm scripts
[10] Commit: "Feat: add {Subject} Class {N} — {N} topics, {N} diagrams, {N} questions"
[11] Push + smoke test on production
```

---

## Audit Script Reference

```bash
# Full audit of all subjects
npm run audit:coverage

# Single subject
npm run audit:coverage Science
npm run audit:coverage Mathematics

# Per-topic breakdown (shows individual topicId question counts)
npm run audit:coverage:detail Science

# Gaps only (suppress fully-covered chapters)
node config/auditCoverage.mjs Science --missing-only

# What the audit checks:
#   ✅ FULLY COVERED — all topics present, all diagrams, ≥4 questions per topic
#   ⚠  GAPS FOUND   — lists missing topicIds, diagram count, question shortfall
```

**To add a new subject to the audit**, append to the `EXPECTED` array in `backend/config/auditCoverage.mjs`. The template is at the bottom of that file.

---

## Admin Panel — What Shows Where

| Data | Where visible |
|------|--------------|
| Teaching content (NcertTopicContent) | Student: `/ncert/topics/{topicId}` |
| Questions | Admin: `/admin/questions` → filter by Subject |
| Chapter structure | Student: `/ncert/chapters/{chapterId}` |
| Diagrams | Student: topic page → Diagram tab |
| Topic list | Admin: `/admin/topics` (basic Topic model only) |
| Question stats | Admin: `/admin/analytics` |

**Note:** The Admin panel does not have a dedicated CRUD view for NcertTopicContent (teaching content). Teaching content is managed entirely via seed scripts. This is intentional — the content is version-controlled in seed files, not free-form edited in the admin panel.

---

*Last updated: 2026-05-08 — Class 10 Science complete (55 topics, 55 diagrams, 222 questions). auditCoverage.mjs added.*
