# Open-Notebook-Inspired Features — Gap Checklist

> What we have vs. what's missing for the four features borrowed from
> [open-notebook](https://github.com/lfnovo/open-notebook): Transformations,
> Citations, Dialogue Podcast v0, Chat-with-Uploads.
> Status legend matches ROADMAP.md: `[ ]` not started · `[~]` in progress · `[x]` done (SHA + date inline) · `[-]` dropped.
>
> **Created:** 2026-08-24. Verified against the codebase on this date — every
> "HAVE" line below was confirmed by reading the named file, not from memory.

---

## What we already HAVE (verified — do not rebuild)

| Capability | Where | Reused by |
|---|---|---|
| Cross-user AI cache (Redis + Mongo, MD5 keying) | `services/aiService.js`, `utils/cache.js` | T, P |
| 7-layer cost pipeline + token budget + failover | `services/aiService.js`, `utils/tokenBudget.js` | T, P, C |
| RAG store with provenance (`chapterNumber`, `chapterTitle`, `conceptName`, `source`) | `utils/ragStore.js`, `models/index.js` (NcertChunk) | C, U |
| Pro-track RAG builder | `scripts/buildRagFromProTrack.js` | C |
| Browser TTS with chunked playback, pause/rate controls | `components/ListenButton.jsx` | P |
| Voice tutor page (mic + TTS) | `pages/VoiceTutor.jsx` | P |
| Notes + anchored highlights, tags, notebook search | `routes/noteRoutes.js`, `services/noteService.js` | U |
| Image upload pipeline (doubt photos → Claude vision) | `routes/imageDoubtRoutes.js`, `solveImageDoubt()` | U |
| Output guardrails + PASS/FAIL verification call | `utils/outputGuard.js` | T, P |
| Feature flags with % rollout | `utils/featureFlags.js` | all |
| Spaced-revision scheduler (due-topic list) | `services/revisionService.js` | P (weekly episode, later) |
| Audit registry + audit script pattern | `docs/AUDITS.md`, `config/audit*.mjs` | all |

---

## T — Transformations (topic → flashcards / exam questions / ELI5 / revision sheet)

**Priority 1. Rides the existing cache; near-zero marginal cost after first generation per topic.**

- [x] **T1.** Prompt templates — done 2026-08-24. As `TRANSFORMS` map inside `aiService.js` (follows the file's own `TEACHER_DOC_PROMPTS` convention instead of a separate `transformPrompts.js`; keeps them next to the private `callClaude`). 5 kinds incl. podcast (P1 folded in). All JSON-shaped.
- [x] **T2.** Service — done 2026-08-24. `generateTransformation()` in `aiService.js` (not a separate file — `callClaude` is module-private, and mirroring `generateLesson` in place was the smaller diff). Cache key `transform::MD5(topic::kind::subject::grade)`, no userId. Redis → Mongo → Claude with failover + budgets + outputGuard.
- [x] **T3.** Decision made 2026-08-24: `AIResponseCache` shape fits exactly (cacheKey + response string + hitCount + 90-day TTL). No new model.
- [x] **T4.** Route — done 2026-08-24. `POST /api/ai/transform` on the existing aiRoutes group (an endpoint on an existing group, not a new `/v1` group — matches `/ai/hint` precedent). auth + Joi (kind enum from `TRANSFORM_KINDS`) + inputGuard + 50/hr per-user AI limiter + token budgets inside `callClaude`.
- [x] **T5.** Chips row — done 2026-08-24. `components/TransformChips.jsx` mounted on `NcertTopicView` under the Listen button. K-12 only; Pro deferred as planned.
- [x] **T6.** Flashcard flip-card renderer — done 2026-08-24, inside `TransformChips.jsx`. No card-level SRS (as decided).
- [x] **T7.** Feature flag `transformations` — done 2026-08-24, default true; `FLAG_TRANSFORMATIONS=false` is the kill switch (backend 404s; simple on/off, not % rollout — the cost story doesn't need a gradual ramp).
- [x] **T8.** Jest — done 2026-08-24. `__tests__/transform.service.test.js`, 10/10 PASS (kinds registry, unknown kind, JSON parse + fences, malformed → null, API error → null, cache hit = one Claude call, citation attach). Full backend suite 560/560.
- [x] **T9. AUDIT:** `config/auditTransformations.mjs` — **PASSED against local DB 2026-08-24** (local MongoDB service, db `ai_learning`): 1077 topics × 5 kinds = 5385 units enumerated, 0 malformed, 0 unnamed, exit 0. Coverage 0% cached as expected (cache fills lazily per student click; audit doesn't fail on that by design). First run also caught a real data bug: **176 ICSE Math 9/10 topics had no `name`/`chapterNumber`** (seed scripts never set them — chips/podcast silently hidden there). Fixed by `config/backfillIcseTopicNames.mjs` (derives both from topicId; 176/176 updated, re-run 0/0 idempotent).
- [x] **T10.** BLUEPRINT.md §4.1 updated — 2026-08-24.

## C — Citations (AI answers cite "NCERT Ch. N — concept")

**Priority 1 (do alongside T — it's a prompt + formatting change, not a system).**

- [x] **C1.** Done 2026-08-24. `retrieveContext()` now returns `{ context, sources }` (or null). Both aiService call sites updated; existing test mocks unaffected (optional chaining tolerates the old mock shapes).
- [x] **C2.** Done 2026-08-24 — lazier than planned: instead of a `citations` array through every cache layer + API contract, `getAIExplanation` appends a server-built "📖 From NCERT: …" footer INSIDE the text (from the injected chunks' provenance, never model-echoed). It flows through all 7 cache layers, the API, and the frontend with zero contract changes, and cached entries carry their citations.
- [x] **C3.** Done by construction — the footer is part of the explanation text, so every surface that shows explanations shows citations. No frontend change. (Transformations additionally get a structured `citation` field, rendered by TransformChips.)
- [x] **C4.** ANSWERED 2026-08-24 — provenance coverage is complete: 6266/6266 chunks labeled (100% across Social Science 210, English 156, Mathematics 4989, Java 911); chapterNumber 93% on Math, 100% elsewhere. No builder fix needed. (Note: chunk subjects are SocSci/English/Math/Java — no Science/Hindi chunks exist yet; those subjects' explanations simply get no RAG context, unchanged behavior.)
- [x] **C5. AUDIT:** `config/auditCitations.mjs` — **PASSED against local DB 2026-08-24**: 0 unlabeled chunks, exit 0. Footer logic covered by 2 Jest tests in `transform.service.test.js`.
- [x] **C6.** BLUEPRINT.md updated — 2026-08-24.

## P — Dialogue Podcast v0 (chapter → teacher/student conversation, browser TTS)

**Priority 2. Zero TTS cost: generate the script once (shared cache), play with two speechSynthesis voices.**

- [x] **P1.** Done 2026-08-24 — shipped with T1 as `kind: "podcast"` in the `TRANSFORMS` map (same service, same cache, RAG-grounded, ≥2-speaker shape enforced by the audit). Backend-complete; the player (P2) is what remains to surface it.
- [x] **P2.** Done 2026-08-24. `components/PodcastPlayer.jsx` — two distinct English voices from `getVoices()` (teacher prefers en-IN; pitch 0.9/1.2 fallback when the device has one voice), line-by-line playback, transcript with current-line highlight, pause/resume/stop/speed.
- [x] **P3.** Done 2026-08-24 — "🎧 Listen as conversation" next to ListenButton on `NcertTopicView`; expands to a full-width card.
- [x] **P4.** Done 2026-08-24. New `POST /api/ai/podcast-listened` (auth + Joi) → `trackEvent("podcast_listened", {linesPlayed, totalLines, pct})` into AnalyticsEvent (no client-events endpoint existed; this is the one metric route). Player reports furthest-line-played once per session — on finish, stop, or unmount.
- [x] **P5.** Done 2026-08-24 — flag `dialogue_podcast` (backend FLAGS + served by `GET /api/flags`); button gated via `useFeatureFlags` on NcertTopicView. `FLAG_DIALOGUE_PODCAST=false` hides it without a deploy.
- [x] **P6. AUDIT:** script shape (valid JSON, ≥2 speakers, all lines non-empty) enforced in `auditTransformations.mjs` (pending live-DB run, same as T9). Player behavior: `src/__tests__/PodcastPlayer.test.jsx` (Vitest render, matching the ListenButton audit precedent — pure-client, no Playwright needed): 6/6 PASS incl. distinct-voice assignment, listen-through reported exactly once, error state.
- [x] **P7.** BLUEPRINT.md updated — 2026-08-24.
- [-] **P8.** Server-side TTS → mp3 pipeline, storage, CDN. **Deliberately dropped for v0.** Revisit only if P4 shows strong listen-through and users complain about robotic voices.
- [-] **P9.** Personalized weekly episode from mistake history (`mistakeService` + `revisionService` feed it). Dropped for v0 — this is the O(users) cost case; gate behind Pro tier when built.

## U — Chat with own uploads (coaching notes / PDFs → blended RAG)

**Priority 3 — DEFERRED until T/C/P prove out. Multi-sprint; listed so scope is honest.**

- [ ] **U1.** Decision first: PDF text extraction approach (Claude vision on page images reuses `solveImageDoubt` plumbing vs. a text-extraction lib — new dependency). Decide when we get here, not now.
- [ ] **U2.** `UserChunk` model mirroring NcertChunk + `userId`, per-user text index or filtered search; storage quota per tier.
- [ ] **U3.** Upload route (size/type limits, page cap) → chunker → store.
- [ ] **U4.** Blended retrieval: user chunks + NCERT chunks in one context block, labeled by origin (feeds Citations).
- [ ] **U5.** Safety: uploaded content is untrusted — prompt-injection filtering before injection into prompts (`inputGuard.js` extension).
- [ ] **U6.** UI: upload in Notebook page; source picker in DoubtChat.
- [ ] **U7. AUDIT:** per-user chunk integrity + retrieval round-trip.

---

## Cross-cutting (applies to whatever we build first)

- [ ] **X1.** All new routes under `/api/v1/`, Joi-validated, controller → service split per architecture rules.
- [ ] **X2.** Every Claude call goes through failover + outputGuard + tokenBudget (no raw Anthropic client calls in new services).
- [ ] **X3.** New route groups get Jest tests; new pages get the Playwright render audit.
- [ ] **X4.** `AUDITS.md` registry updated per audit added.

## Recommended build order

1. **T + C together** (T2's service consumes C1's structured sources) — one sprint.
2. **P** — rides T's cache + prompt file; frontend-heavy, one component.
3. **U** — separate decision point after T/C/P metrics land.
