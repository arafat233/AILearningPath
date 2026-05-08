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

---

## Phase 1 — Curriculum Skeleton

**What:** Seed the chapter/subchapter/concept/topic outline into `NcertChapter`.

**File:** `backend/config/seed{Subject}Curriculum.js`

**How to write it:**
1. Open the NCERT PDF for the subject
2. Map out every chapter → subchapter → concept → topic (bullet points)
3. Write the seed as a `CHAPTERS` array upserted on `chapterId`
4. `chapterId` format: `{subj_code}_ch{N}` (e.g. `sst_ch1`)

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

**Verify:** `db.ncerttopiccontents.countDocuments({subject:"Science"})`

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

**Verify:** Admin → Questions → filter by subject

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

**Science DIAGRAM_MAP coverage (as of 2026-05-08): 56/56 topics covered.**

**Naming convention:**
- Science: `sci_{descriptor}` key → `{Descriptor}` component name
- Future: `sst_{descriptor}` → `{Descriptor}Sst` (add suffix if name clashes)

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

**Verify:** `db.ncertchunks.countDocuments({subject:"Science"})`

---

## Phase 7 — Admin Panel Verification

After running all seeds, verify in the admin panel:

| Admin Page | What to check |
|-----------|---------------|
| `/admin/questions` | Filter by subject → should see all topics with ≥5 questions each |
| `/admin/topics` | Should show basic topic entries |
| Student NCERT page | `/ncert/chapters/sci_ch1` → teaching content loads |
| Diagram check | Topic page → Diagram tab → SVG renders, not placeholder text |
| Practice | `/practice?subject=Science` → questions appear |

---

## Cross-Verification Checklist (run before committing)

Run this audit script to catch gaps:
```js
// backend/config/_auditTopics.mjs (re-create as needed)
const all = await NcertTopicContent.find({}, {topicId:1,name:1,subject:1}).lean();
// Check: every topicId has ≥1 question, has a diagram in DIAGRAM_MAP
```

**Minimum standards per topic:**
- [ ] Teaching content (NcertTopicContent document) ✅
- [ ] At least 5 MCQ questions ✅
- [ ] SVG diagram in DIAGRAM_MAP ✅
- [ ] Entry in topic DAG ✅
- [ ] Covers CBSE textbook chapter structure ✅

---

## What Was Done for Class 10 Science (Reference)

### Source
- NCERT Class 10 Science PDF (shared by user)
- CBSE 2023-24 rationalized syllabus

### Chapters covered
| Chapter | Unit | Topics | Questions | Diagram |
|---------|------|--------|-----------|---------|
| Ch1 Chemical Reactions | Chemistry | 4 | ~15 | ✅ |
| Ch2 Acids Bases Salts | Chemistry | 4 | ~18 | ✅ |
| Ch3 Metals Non-metals | Chemistry | 4 | ~15 | ✅ |
| Ch4 Carbon Compounds | Chemistry | 5 | ~16 | ✅ |
| Ch5 Life Processes | Biology | 6 | ~14 | ✅ |
| Ch6 Control Coordination | Biology | 5 | ~18 | ✅ |
| Ch7 Reproduction | Biology | 4 | ~20 | ✅ |
| Ch8 Heredity | Biology | 4 | ~18 | ✅ |
| Ch9 Light | Physics | 4 | ~18 | ✅ |
| Ch10 Human Eye | Physics | 3 | ~12 | ✅ |
| Ch11 Electricity | Physics | 4 | ~19 | ✅ |
| Ch12 Magnetic Effects | Physics | 5 | ~14 | ✅ |
| Ch13 Our Environment | Biology | 4 | ~15 | ✅ |
| **Total** | | **56 topics** | **~212 questions** | **56/56** |

### Seed files created
```
backend/config/
  seedScienceCurriculum.js          ← Phase 1
  seedScienceChemistryContent.js    ← Phase 2
  seedScienceBiologyContent.js      ← Phase 2
  seedSciencePhysicsContent.js      ← Phase 2
  seedScienceChemistryQuestions.js  ← Phase 3
  seedScienceBiologyQuestions.js    ← Phase 3
  seedSciencePhysicsQuestions.js    ← Phase 3
  seedScienceMissingQuestions.js    ← Phase 3 (gap fill)
  seedScienceTopicDAG.js            ← Phase 5
  seedScienceAll.js                 ← convenience runner (runs all above)
```

### DiagramLibrary.jsx additions
- 56 SVG components for all Science topics
- DIAGRAM_MAP: 56 Science entries

### Key decisions made
1. Topic IDs: `sci_ch{N}_{descriptor}` (never change after seeding — breaks question links)
2. Content format: flat strings for Science (different from Math's nested objects)
3. Chapters excluded: Ch14 Sources of Energy (deleted from CBSE 2023-24 syllabus)
4. Evolution (sci_ch8_evolution): kept in DB though 2023-24 reduced it — kept for completeness

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
[ ] 1. Get NCERT PDF for the subject
[ ] 2. Map chapters → subchapters in seed{Subject}Curriculum.js
[ ] 3. Run Phase 1 seed — verify chapter count in DB
[ ] 4. For each unit (split into 2-3 files):
        - Write teaching content → Phase 2 seed
        - Write 5 questions per topic → Phase 3 seed
        - Add SVG diagram to DiagramLibrary.jsx → Phase 4
[ ] 5. Run Phase 5 DAG seed
[ ] 6. Run Phase 6 RAG build
[ ] 7. Run full audit (_auditTopics.mjs)
[ ] 8. Verify admin panel + student pages
[ ] 9. Update BLUEPRINT.md with new seed file counts
[10] Commit + push
```

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

*Last updated: 2026-05-08 — Class 10 Science complete (56 topics, 56 diagrams, ~212 questions)*
