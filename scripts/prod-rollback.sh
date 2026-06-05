#!/usr/bin/env bash
# Auto-rollback triggered when smoke tests fail post-deploy.
# Restores the docker image tagged :previous as :latest and restarts the API.
# Frontend dist isn't rolled back here — re-deploy main if needed.

set -euo pipefail

# Full ghcr ref — MUST match docker-compose.yml's api service image. The old
# bare tag (ailearningpath-api) is NOT what compose runs, so re-tagging it did
# nothing and rollback silently kept the broken image live.
IMAGE_NAME=ghcr.io/arafat233/ailearningpath-api
API_CONTAINER=ailearningpath-api-1

echo "=== ROLLBACK INITIATED ==="

if ! docker image inspect "$IMAGE_NAME:previous" >/dev/null 2>&1; then
  echo "❌ No :previous image to roll back to — manual intervention required"
  exit 1
fi

echo "Re-tagging previous image as latest..."
docker tag "$IMAGE_NAME:previous" "$IMAGE_NAME:latest"

echo "Restarting API container with rolled-back image..."
# Compose file lives at the repo root, not in ai-learning-backend/.
cd ~/AILearningPath
docker-compose up -d --force-recreate api

sleep 8
docker ps --format 'table {{.Names}}\t{{.Status}}'

echo ""
echo "✅ Rolled back to previous image. Investigate the failure before redeploying."
