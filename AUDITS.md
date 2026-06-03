# Audit Scripts — ground-truth verification

> Rule (CLAUDE.md §5): any build of more than a few items ships a runnable audit
> that recomputes done/total + integrity **from the DB/files**, enumerating every
> unit (incl. untagged). Run after every batch and before claiming "done". The
> audit output — not a hand-written tally — is the source of truth.

| Audit | Verifies | Run |
|---|---|---|
| `ai-learning-backend/backend/config/auditAnimations.mjs` | DSA animation coverage: done/total per pattern (incl. untagged) + 0 broken kinds/steps | `node config/auditAnimations.mjs` |
| `ai-learning-backend/backend/config/auditVisualAids.mjs` | pro_java visual aids: real-diagram vs text-panel; flags panels whose brief describes a diagram; topics with no visual_aid | `node config/auditVisualAids.mjs` |

Prod: `docker exec ailearningpath-api-1 node config/<audit>.mjs`

When starting a new multi-item build, add its audit here.
