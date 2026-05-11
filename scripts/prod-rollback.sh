#!/usr/bin/env bash
# Auto-rollback triggered when smoke tests fail post-deploy.
# Restores the docker image tagged :previous as :latest and restarts the API.
# Frontend dist isn't rolled back here — re-deploy main if needed.

set -euo pipefail

IMAGE_NAME=ailearningpath-api
API_CONTAINER=ailearningpath-api-1

echo "=== ROLLBACK INITIATED ==="

if ! docker image inspect "$IMAGE_NAME:previous" >/dev/null 2>&1; then
  echo "❌ No :previous image to roll back to — manual intervention required"
  exit 1
fi

echo "Re-tagging previous image as latest..."
docker tag "$IMAGE_NAME:previous" "$IMAGE_NAME:latest"

echo "Restarting API container with rolled-back image..."
cd ~/AILearningPath/ai-learning-backend
docker-compose up -d --force-recreate api

sleep 8
docker ps --format 'table {{.Names}}\t{{.Status}}'

echo ""
echo "✅ Rolled back to previous image. Investigate the failure before redeploying."
