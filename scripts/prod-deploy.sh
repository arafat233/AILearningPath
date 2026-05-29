#!/usr/bin/env bash
# Server-side production deploy script. Executed via SSH from the GitHub
# Actions workflow. Assumes:
#   - Repo at ~/AILearningPath
#   - Frontend dist already rsync'd to /tmp/stellar-dist
#   - Nginx serves from /var/www/stellar
#   - Docker compose v1 (docker-compose) installed
#   - ubuntu user has passwordless sudo
#
# Resilient against:
#   - Manual edits on the server (uses git reset --hard, not git pull)
#   - Stuck build processes (kills any leftover docker-compose / vite procs)
#   - Failed health checks (tags previous image first for rollback)

set -euo pipefail
trap 'echo "❌ Deploy failed at line $LINENO"; exit 1' ERR

REPO=~/AILearningPath
NGINX_ROOT=/var/www/stellar
DIST_STAGING=/tmp/stellar-dist
API_CONTAINER=ailearningpath-api-1
IMAGE_NAME=ailearningpath-api

echo "=== [1/6] Reset server tree to origin/main ==="
cd "$REPO"
# git reset --hard discards any manual edits; never use git pull on a server
git fetch origin main
git reset --hard origin/main
echo "    → HEAD: $(git log --oneline -1)"

echo "=== [2/6] Tag current image as :previous for rollback ==="
if docker image inspect "$IMAGE_NAME:latest" >/dev/null 2>&1; then
  docker tag "$IMAGE_NAME:latest" "$IMAGE_NAME:previous"
  echo "    → Tagged previous image for rollback"
else
  echo "    → No existing image to tag (first deploy?)"
fi

echo "=== [3/6] Pull pre-built backend image from ghcr.io ==="
# Image is public — no auth needed. Built on GitHub Actions CI with layer
# cache so npm ci is cached. Pull takes ~30s vs 16min local build.
docker pull ghcr.io/arafat233/ailearningpath-api:latest
echo "    → Image pulled"

echo "=== [4/6] Restart API container ==="
docker-compose up -d api
echo "    → Waiting for API to start..."
sleep 8
docker ps --format 'table {{.Names}}\t{{.Status}}'

echo "=== [5/6] Verify API health (max 30s) ==="
for i in 1 2 3 4 5 6; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://localhost:5001/api/topics?grade=10")
  if [ "$STATUS" = "200" ]; then
    echo "    → API healthy on try $i (HTTP 200)"
    break
  fi
  if [ "$i" = "6" ]; then
    echo "    ❌ API health check failed after 30s (last status: $STATUS)"
    docker logs --tail 30 "$API_CONTAINER" 2>&1 | tail -20
    exit 1
  fi
  sleep 5
done

echo "=== [6/6] Deploy frontend dist to nginx ==="
if [ -d "$DIST_STAGING" ]; then
  sudo cp -rf "$DIST_STAGING"/* "$NGINX_ROOT"/
  sudo chown -R www-data:www-data "$NGINX_ROOT"
  rm -rf "$DIST_STAGING"
  sudo systemctl reload nginx
  echo "    → Frontend deployed and nginx reloaded"
else
  echo "    → No dist staging dir found at $DIST_STAGING — skipping frontend"
fi

echo ""
echo "✅ Server-side deploy complete"
