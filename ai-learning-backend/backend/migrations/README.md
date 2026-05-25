# Migrations

One-off scripts that backfill / re-key / clean up data after a schema change.
Each migration is **idempotent** (re-running is a no-op once the data is at
the target state), supports a `--dry` flag where applicable, and writes a
short summary on completion.

Every destructive migration assumes a `mongodump` backup was taken first.

## Registry

| Date | File | Purpose | Status |
|------|------|---------|--------|
| 2026-05-03 | `20260503000000-add-indexes-and-soft-delete.js` | Indexes + soft-delete fields on legacy collections | run via `npm run migrate` (migrate-mongo) |
| 2026-05-25 | `2026-05-25_users_add_tracks.mjs` | Backfill `User.tracks: [{ key: "school", role: "learner", enrolledAt }]` so legacy users have a multi-track row. Pro-track Java pilot prerequisite. | written, NOT YET RUN — needs Mongo backup first |

## Pre-flight (every migration)

1. Take a backup: `npm run backup` (mongodump → gzip → optional S3) OR run
   `mongodump --uri="$MONGO_URI" --out=backups/pre-<migration-name>-$(Get-Date -Format 'yyyy-MM-dd-HHmm')` directly.
2. Confirm `MONGO_URI` in `.env` points at the right database.
3. Dry-run if supported: `node migrations/<file> --dry`.
4. Run for real: `node migrations/<file>`.
5. Re-run with `--dry` to confirm it's a no-op (idempotency check).
6. Tick the row above as "✅ run on <env> <date>".

## Conventions

- File name: `YYYY-MM-DD_short_name.mjs` (newer style) — sortable by date.
  The older `YYYYMMDDHHMMSS-name.js` files use migrate-mongo's runner; both
  conventions live side-by-side until we standardise.
- Add a `## Registry` row to THIS file in the same commit as the script.
- Migrations are NOT auto-run on deploy. Operator runs them explicitly.
