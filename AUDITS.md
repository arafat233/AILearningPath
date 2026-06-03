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
| Pro visual aids | `config/auditVisualAids.mjs` | real-diagram vs text-panel; flags panels whose brief describes a diagram; topics with no visual_aid |

## Adding a new build → add its audit here
Pick the method by type (see CLAUDE.md §5):
- **content / seeds / migrations** → DB-count audit (per-unit counts, 0 malformed, idempotent re-run)
- **backend route / service** → live HTTP round-trip (enrolled-user token) asserting status + shape, + Jest test
- **frontend page / component** → Playwright render asserting the change is visible; for data-driven UI, a DB-derived per-record render check
- **schema / model change** → collection-wide conformance scan (required fields, valid enums)

Write the audit FIRST, register it above, gate "done" on a clean run.
