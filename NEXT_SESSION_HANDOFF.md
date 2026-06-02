# Next Session Handoff — updated 2026-06-02

**Status:** Pro-track v3 fully built, deployed to production, and verified healthy.
The previous handoff's tasks (fix 19 VoiceTutor/Practice tests, Phase-2 perf) are
**done** — those tests now pass (31/31; full unit suite 91/91).

---

## ✅ Shipped + live in production (`stellaredu.in`)

- Pro-track **v3**: AI Socratic Tutor (1.B), Pattern Recognition (1.C), Complexity
  Derivation (2.D), Spaced Repetition (2.F), Problem-First Reveal (2.G), Interview
  Simulator (H), Recursion-Tree visualizer (I1), Community Discussions (D5.3),
  Pattern Atlas (D3.4), Free-tier preview (D5.1)
- Content modules **M47–M51** (Bitwise, Recursion Patterns, Modern Java, Engineering
  Hygiene, Technical Communication) → 51 modules / 247 topics
- Deployed: GHCR backend image, 8 idempotent content seeds, rebuilt frontend.
  Tags `pilot-pro-java-v3.0-phase1` + `-phase2`.
- Prod hardening: CI build pipeline fixed, **swap enabled on Oracle** (was the OOM
  cause), **Judge0 wired into prod** (code-exec was silently unconfigured — now works).
- Tests: backend **467/467**, frontend unit **91/91**.

---

## 📋 What actually remains (priority order)

### Blocked on external input
- **B10 / H9 acceptance** — Tutor + Interview need the prod `ANTHROPIC_API_KEY`
  confirmed *valid* (it's set; one in-app click on "Ask tutor" settles it).
- **E1–E8 Job Market Intelligence** — entirely unbuilt; needs ~500 Java job postings
  (data). The only unstarted *feature* on the roadmap.

### Real engineering items (unblocked)
- **JDK upgrade on Judge0** (`infra/judge0/JDK_UPGRADE.md`) — sandbox runs OpenJDK 13,
  can't compile Java 14+ (records/sealed classes), so M49–M51 use a `predict_output`
  workaround. Upgrading unlocks runnable modern-Java exercises. **Production sandbox
  change — do in a maintenance window; keep JDK 13 as fallback.**
- **CI auto-deploy** — build half green; the `Setup SSH → Upload` step needs the
  runner's key authorized on the Oracle box (+ runner IP allowed). Until then,
  deploys are manual (runbook in memory `project_deployment_process`).

### Optional / deferred
- Perf polish: `OPTIMIZATION_PLAN.md` Phases 2–5, `OPTIMIZATION_POLISH.md`, `CDN_SETUP.md` (AWS CloudFront).
- School content: CBSE Class 9 Science/English/Hindi/SST (not started), CBSE Math 1–7 v3 enrichment (decision pending) — see `CONTENT_STATUS.md`.
- Post-pilot product calls: pricing, certificate PDF export, mentor roles — see `PRO_TRACK_PLAN.md §8`.

---

## ⚠️ Operational notes for whoever deploys next

- **Oracle box is 1 GB RAM** — swap is now on, but **never run `vite build` or the full
  `seedJavaPilot.js` on the box**; build locally + scp, run standalone seeds via `docker exec`.
- **Deploy = pull GHCR image, don't build on box.** Frontend: build local with
  `.env.production` (`VITE_API_URL=https://stellaredu.in/api`), scp `dist`, `sudo cp`
  assets-first (never `cp -r dist/` — preserves `/var/www/stellar/audio`).
- Judge0 lives on **Hetzner 178.105.219.13** (4 GB) — separate box; code-exec depends on it.

---

## 📁 Reference
- `ROADMAP.md` — full v3 status (127 done / ~10 open)
- `BLUEPRINT.md`, `PROFESSIONAL_TRACKS_BLUEPRINT.md` — architecture + capabilities
- `CONTENT_STATUS.md` — content coverage matrix
- `infra/judge0/JDK_UPGRADE.md` — the one real capability gap
