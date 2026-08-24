# Pending Work Checklist (2026-08-24)

> Auto-resume: on session start, work the first unchecked item. Every item ships
> with its audit per CLAUDE.md §5. Update this file in the same commit as the work.

## Quick infra / hygiene

- [x] **1. Fix red CI workflows** — `ci.yml` (`npm ci` missing `--legacy-peer-deps`,
      rate-limit-redis@5 peer conflict) + `audit.yml` "Content Audit" (red since June —
      diagnose root cause). ci.yml: npm ci --legacy-peer-deps ×4 + integration tests --runInBand (parallel suites were clobbering the shared test DB — 62/62 now). audit.yml: rewritten to SSH into prod and run audits inside the api container (runners have no content DB — root cause of 3 months of red).
- [x] **2. express-rate-limit IPv6 warnings** — 8× `ERR_ERL_KEY_GEN_IPV6` per boot;
      wrap custom keyGenerators with the `ipKeyGenerator` helper. Done = clean boot log.
- [x] **3. fill_blank grader** — `fill_blank` testCase type has no grader case
      (default→fail). Added graders for ALL 5 unknown types (fill_blank, expected_stdout, expected_output, conceptual, tests_pass — 550 formerly ungradeable exercises) + 3 Jest tests. tests_pass is structural (@Test+asserts; JUnit not runnable in Judge0 — ponytail comment marks upgrade path).
- [ ] **4. Rotate server secrets** (post-miner-compromise hygiene) — JWT_SECRET +
      COMPANY_JWT_SECRET rotatable by us (logs users out); ANTHROPIC/RAZORPAY/RESEND/
      GOOGLE keys + SSH keypair need the user (external consoles). Do ours, list theirs.
- [ ] **5. graphos-site leftovers** — `/opt/graphos-site` + `graphos-site_pgdata` volume
      still on the box. NEEDS USER DECISION: delete permanently or keep as backup.

## Content

- [ ] **6. ICSE Class 10 Math — Ph5 DAG** — topic-level DAG (1 node/sub-topic per
      project standard). Done = seeded + audit PASS local & prod.
- [ ] **7. ICSE Class 10 Math — Ph6 RAG** — RAG chunks for all 100 topics.
      Done = chunk count audit PASS local & prod.
- [ ] **8. LLD depth standard** — apply an SD_DEPTH-style standard to the LLD track
      (172 topics; case studies first). Large grind: standard doc + audit script first,
      then batches. Done = audit:lld-depth exists and coverage grows batch by batch.

## Features

- [ ] **9. Notes on Practice questions** — extend Notes/Highlights (GAP #3) to the
      Practice-Q surface (the planned fast-follow). Done = highlight+note on a practice
      question round-trips; render audit PASS.
- [ ] **10. Chat with own uploads (Open-Notebook "U", 0/7 + X1–X4)** — UserChunk model,
      PDF upload→chunk route, blended user+NCERT retrieval with origin labels,
      prompt-injection guard for untrusted uploads, Notebook UI + DoubtChat source
      picker, per-user audit (U7). Follow OPEN_NOTEBOOK_GAP_CHECKLIST.md §U.

## Blocked on user decisions (not workable)

- **Math 1–10 standardization** — 4 decisions pending (see project_math_standardization).
- **Judge0 JDK 21 upgrade** — runbook at infra/judge0/JDK_UPGRADE.md; needs Hetzner box
  session to install language 90; env var `JUDGE0_JAVA_LANGUAGE_ID` already wired.
