# Pending Work Checklist (2026-08-24)

> Auto-resume: on session start, work the first unchecked item. Every item ships
> with its audit per CLAUDE.md §5. Update this file in the same commit as the work.
>
> **Reconciled 2026-08-25.** #10 (Chat with own uploads) was shipped 2026-08-24 but left
> unchecked. Two items remain and neither is ordinary feature work: **#5** is blocked on
> a user decision, and **#8** is a long content grind whose tooling is already shipped.
> Sibling files reconciled in the same pass: DSA_GAP_CHECKLIST (22 stale boxes) and
> OPEN_NOTEBOOK_GAP_CHECKLIST (11). PRO_EXERCISE_TYPE_CHECKLIST is a template — its
> boxes stay unchecked by design.

## Quick infra / hygiene

- [x] **1. Fix red CI workflows** — `ci.yml` (`npm ci` missing `--legacy-peer-deps`,
      rate-limit-redis@5 peer conflict) + `audit.yml` "Content Audit" (red since June —
      diagnose root cause). ci.yml: npm ci --legacy-peer-deps ×4 + integration tests --runInBand (parallel suites were clobbering the shared test DB — 62/62 now). audit.yml: rewritten to SSH into prod and run audits inside the api container (runners have no content DB — root cause of 3 months of red).
- [x] **2. express-rate-limit IPv6 warnings** — 8× `ERR_ERL_KEY_GEN_IPV6` per boot;
      wrap custom keyGenerators with the `ipKeyGenerator` helper. Done = clean boot log.
- [x] **3. fill_blank grader** — `fill_blank` testCase type has no grader case
      (default→fail). Added graders for ALL 5 unknown types (fill_blank, expected_stdout, expected_output, conceptual, tests_pass — 550 formerly ungradeable exercises) + 3 Jest tests. tests_pass is structural (@Test+asserts; JUnit not runnable in Judge0 — ponytail comment marks upgrade path).
- [x] **4. Rotate server secrets** (post-miner-compromise hygiene) — JWT_SECRET +
      COMPANY_JWT_SECRET rotatable by us (logs users out); ANTHROPIC/RAZORPAY/RESEND/
      GOOGLE keys + SSH keypair need the user (external consoles). DONE 2026-08-24: JWT_SECRET + COMPANY_JWT_SECRET rotated on box + local .env.production (all sessions invalidated). STILL ON USER: Anthropic/Razorpay/Resend/Google console keys + a new SSH keypair.
- [ ] **5. graphos-site leftovers** — `/opt/graphos-site` + `graphos-site_pgdata` volume
      still on the box. NEEDS USER DECISION: delete permanently or keep as backup.

## Content

- [x] **6. ICSE Class 10 Math — Ph5 DAG** — topic-level DAG (1 node/sub-topic per
      project standard). VERIFIED ALREADY DONE (memory was stale): 100 topics, 25 roots, 0 dangling, 0 cycles — local AND prod.
- [x] **7. ICSE Class 10 Math — Ph6 RAG** — RAG chunks for all 100 topics.
      VERIFIED ALREADY DONE: 623 chunks, 100/100 topics covered — local AND prod.
- [x] **8. LLD depth standard** — DONE. Completed in `1112f417` (2026-08-25):
      **129/129 case studies DEEP, 0 PARTIAL, 0 SHALLOW** per `npm run audit:lld-depth`.
      Authored in 21 batches (`config/seedLldDepthBatch1..21.js`), each gated with
      `auditLldDepth.mjs --require <ids>` before the next started. Track now
      22 modules / 172 topics / 907 exercises / 27,665 XP. The note above ("baseline
      0/129 … next: batches of ~6") was written mid-flight and never updated.

      **Follow-up shipped 2026-08-25:** only batches 1–8 had npm scripts, so 13 of the
      21 batch files were unreachable via `npm run` — **81 of the 129 deepened topics**
      would have silently stayed shallow on any fresh reseed. Registered 9–21, added
      `seed:lld-depth-all`, and chained it onto `seed:lld-all` so the DEEP track is
      actually reproducible from the seed pipeline. (System Design has all 23 of its
      depth batches registered — that is the pattern LLD now matches — but
      `seed:sysd-all` likewise does not chain its depth batches: same latent gap,
      untouched here.)

## Features

- [x] **9. Notes on Practice questions** — extend Notes/Highlights (GAP #3) to the
      Practice-Q surface (the planned fast-follow). Done = highlight+note on a practice
      question round-trips; render audit PASS.
- [x] **10. Chat with own uploads (Open-Notebook "U", 7/7 + X1–X4)** — DONE (shipped
      2026-08-24, verified + boxes reconciled 2026-08-25). `UserSource`/`UserChunk`
      models, `POST/GET/DELETE /api/v1/uploads` (Joi; 8MB / 60 pages / 20 sources /
      400 chunks), `pdf-parse` text extraction (U1 decided: extraction, not vision —
      the dep already existed), `sanitizeUploadText()` injection guard,
      `retrieveUserContext()` blended into `aiService` at both call sites with
      origin labels, Notebook upload UI + DoubtChat "use my notes" toggle
      (`useMyNotes` → `doubtRoutes.js:22`), `auditUserChunks.mjs` in AUDITS.md
      (per-user isolation asserted), `upload.service.test.js` 9/9.

## Blocked on user decisions (not workable)

- **Math 1–10 standardization** — **1 decision open, not 4** (verified 2026-08-27 against
  CONTENT_STATUS.md; see SPEC_MATH_STANDARDIZATION.md §Status). Decisions 1, 3 and 4
  (density, diagrams, execution order) are satisfied in shipped content — CBSE Math 1–10
  are all ✅ on every phase, as are ICSE 9/10 and AP SSC 8/9/10. The open one is #2 for
  **CBSE grades 1–7 only**: they kept legacy `math{G}_*` topicIds instead of the
  board-prefixed `cbse_math{G}_*`. Harmless today (audit accepts both; no other board has
  a grade below 8, so nothing can collide) but ambiguous the moment one does. Renaming
  costs ~380 topics + questions + DAG + RAG across four collections, plus every
  prefix-branching code path.
- **Judge0 JDK 21 upgrade** — runbook at infra/judge0/JDK_UPGRADE.md; needs Hetzner box
  session to install language 90; env var `JUDGE0_JAVA_LANGUAGE_ID` already wired.
