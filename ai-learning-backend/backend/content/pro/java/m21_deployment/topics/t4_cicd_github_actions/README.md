# Topic 21.4: CI/CD with GitHub Actions

**Module**: M21 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 21 Progress**: 4/5 | **Course Progress**: 104 topics (61.2%)

## Key Concepts
- `on: push/pull_request/schedule`: trigger events
- `jobs run in parallel` by default; `needs:` creates sequential dependency
- `cache: maven` in `setup-java`: skip 150MB re-download per run (~90s savings)
- `cache-from/cache-to: type=gha`: Docker layer cache across runs
- `github.sha`: immutable image tag — SHA tag = traceable, rollback-friendly
- **Never use `:latest` in production** — mutable, rollbacks impossible
- `GITHUB_TOKEN`: auto-provided; `permissions: packages: write` for GHCR push
- `environment: production`: requires manual approval gate + per-env secrets
- `if: failure()`: only runs when previous job fails (rollback, notification)
- `services:` block: spin up postgres/redis containers for integration tests
- `if: always()`: upload test artifacts even when tests fail

## Files: topic.json (~16KB), exercises.json (~32KB), project.json (~3KB), README.md
