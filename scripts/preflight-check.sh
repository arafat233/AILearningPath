#!/usr/bin/env bash
# Pre-deploy guardrail. Fail if any critical file is uncommitted or untracked
# at the time of deploy — would have caught the 30+ uncommitted v2 routes that
# crashed prod in the May 2026 deploy.
#
# Runs in GitHub Actions before the build job. Also safe to run locally with:
#   bash scripts/preflight-check.sh

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Glob of paths where any drift will crash production
CRITICAL_REGEX='ai-learning-backend/backend/(routes|controllers|services|models|middleware|utils)/|ai-learning-frontend/frontend/src/(components|pages|services|store|hooks)/|ai-learning-frontend/frontend/src/[^/]+\.(jsx?|tsx?|css)$|ai-learning-backend/backend/(server|index)\.(js|mjs)$|ai-learning-backend/Dockerfile$|ai-learning-backend/docker-compose.*\.ya?ml$|ai-learning-frontend/frontend/(vite\.config|index)\.|package\.json$|package-lock\.json$'

fail=0

uncommitted=$(git status --porcelain | grep -E "^.M ($CRITICAL_REGEX)" || true)
if [ -n "$uncommitted" ]; then
  echo "::error::Uncommitted modifications to critical paths — would crash prod:"
  echo "$uncommitted"
  fail=1
fi

untracked=$(git status --porcelain | grep -E "^\?\? ($CRITICAL_REGEX)" || true)
if [ -n "$untracked" ]; then
  echo "::error::Untracked critical files (imports will fail at runtime):"
  echo "$untracked"
  fail=1
fi

# Also block if the working tree has un-pushed commits ahead of origin/main
ahead=$(git rev-list --count "@{u}..HEAD" 2>/dev/null || echo 0)
if [ "$ahead" != "0" ]; then
  echo "::warning::Branch is $ahead commit(s) ahead of origin — push before deploy:"
  git log "@{u}..HEAD" --oneline
fi

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "::error::Preflight failed. Run 'git add' + commit + push the listed files before retrying."
  exit 1
fi

echo "✅ Preflight passed — no critical-path drift detected"
