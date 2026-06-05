# AUDITS — project-wide cross-verification registry

> **Compulsory (CLAUDE.md §5):** everything built, in any layer, ships a runnable
> audit that recomputes `done/total` + an integrity check from ground truth
> (DB / live HTTP / real render), enumerating EVERY unit incl. untagged. No task
> is "done", and nothing is committed/deployed, until its audit passes — local
> **and** prod where applicable. The audit's output, not a hand tally, is truth.

## How to run
- Local: `node config/<audit>.mjs` (from `ai-learning-backend/backend`)
- Prod:  `docker exec ailearningpath-api-1 node config/<audit>.mjs`

## Registered audits

| Area | Audit | Verifies |
|---|---|---|
| DSA animations | `config/auditAnimations.mjs` | done/total per pattern (incl. untagged) + 0 broken kinds/steps |
| DSA edge-case catalog | `config/auditEdgeCases.mjs` | done/total per pattern (same 598-problem scope as animations) + 0 malformed (well-formed array ≥2, each entry has non-empty case+handling) |
| Notes / Notebook (GAP #3) | `config/auditNotes.mjs` | conformance scan of every Note doc: required fields, valid enums (scope/kind/type), note→non-empty body, highlight→non-empty quote; 0 malformed. (Backend route also covered by the `note.service` Jest suite + a live HTTP round-trip; frontend by `Notes.test.jsx` render tests.) |
| Pro visual aids | `config/auditVisualAids.mjs` | real-diagram vs text-panel; flags panels whose brief describes a diagram; topics with no visual_aid |
| Java idioms catalog (GAP #7) | `ai-learning-frontend/frontend/scripts/auditIdioms.mjs` (run `node scripts/auditIdioms.mjs` from `ai-learning-frontend/frontend`) | total + done/total per category over the live `src/data/javaIdioms.js`; 0 malformed (every required field non-empty, ≥1 tag, explanation ≥20 chars) + 0 duplicate ids. Frontend render covered by `AudioIdioms.test.jsx`. |
| LLD track (GAP #4) | `config/auditLldTrack.mjs` (`npm run audit:lld`) | enumerates every topic + exercise of `pro_lld` (now **22 modules, 172 topics, 520 exercises** — at AlgoMaster parity): 1 live track, live modules, topics well-formed (hook/teaching.blocks/interviewRelevance/commonGaps), exercises well-formed per type (pattern_match options+correct, predict_output text_match, code_scratch execution+stdout), 0 orphans/dupes, every topic ≥1 exercise, track totals match counts, and every `teaching.visual_aid.svg` (22 pattern topics) is well-formed (balanced tags, `<svg>`-wrapped — 0 malformed). Idempotent (upsert-by-id). **Two further gates:** `npm run acceptance:lld` (live HTTP — all 5 modules reachable, every type 200 not 422, grading correct) and `npm run verify:lld-code` (submits all 10 code_scratch REFERENCE SOLUTIONS through real Judge0 → must all compile + match expected_stdout). |
| Community engine (GAP #8) | `config/auditCommunity.mjs` (`npm run audit:community`) | conformance scan of EVERY `CommunityPost` (user-generated, no fixed denominator): userId+authorName present, valid kind/status, non-empty title+body, well-formed comments, denormalized counts in sync (upvoteCount==upvoters.length, commentCount==comments.length), reports well-formed; malformed must be 0. Full lifecycle via `npm run acceptance:community` (create→list→read→upvote→comment→report→delete, answer-key not leaked). Backend `community.service` Jest (17) + frontend `Community.test.jsx` (6). Seed starters: `npm run seed:community`. |
| System Design track (GAP #2) | `config/auditSysdTrack.mjs` (`npm run audit:sysd`) | enumerates every topic + exercise of `pro_sysd` (now **23 modules, 179 topics, 539 exercises** — exceeds AlgoMaster's 177): live track (slug system-design), topics well-formed (hook/teaching.blocks/interviewRelevance/commonGaps + any visual_aid), exercises well-formed per type (pattern_match options+correct), 0 orphans/dupes, every topic ≥1 exercise, totals match. Live HTTP gate: `npm run acceptance:sysd` (enroll → module → types 200 → flow visual_aid reaches client → grading). Idempotent (upsert-by-id). |
| Pro exercise grading (LLD+SD) | `config/auditProGrading.mjs` (`npm run audit:pro-grading`) | verifies every `pattern_match` exercise across `pro_lld`+`pro_sysd` actually GRADES CORRECTLY (beyond structure): testCase type=pattern_match, `testCase.correct === expectedSolution`, the correct answer IS one of the options, ≥2 non-empty unique options, explanation present. 1026/1026 PASS. Catches grader-breaking data bugs the structural track audits don't (per [[project_pro_exercise_grading]]). |
| Listen / audio mode (GAP #5) | `ai-learning-frontend/frontend/src/__tests__/AudioIdioms.test.jsx` (run `npx vitest run src/__tests__/AudioIdioms.test.jsx`) | ListenButton renders, speaks first chunk + shows transport, stop cancels + returns to idle, gathers semantic text from a contentRef (skips button chrome). Pure-client (Web Speech API) so no DB/HTTP layer to audit. |

## Adding a new build → add its audit here
Pick the method by type (see CLAUDE.md §5):
- **content / seeds / migrations** → DB-count audit (per-unit counts, 0 malformed, idempotent re-run)
- **backend route / service** → live HTTP round-trip (enrolled-user token) asserting status + shape, + Jest test
- **frontend page / component** → Playwright render asserting the change is visible; for data-driven UI, a DB-derived per-record render check
- **schema / model change** → collection-wide conformance scan (required fields, valid enums)

Write the audit FIRST, register it above, gate "done" on a clean run.
