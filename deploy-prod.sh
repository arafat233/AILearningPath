#!/bin/bash
# Stellar — Production Deploy Script
# Run on Oracle Cloud server: bash deploy-prod.sh
set -e

REPO_DIR="/home/ubuntu/AILearningPath"
FRONTEND_DIR="$REPO_DIR/ai-learning-frontend/frontend"
NGINX_ROOT="/var/www/stellar"

echo "=== [1/6] Pulling latest code ==="
cd "$REPO_DIR"
git pull origin main

echo "=== [2/6] Rebuilding Docker containers ==="
docker-compose down
docker-compose build --no-cache api
docker-compose up -d

echo "=== [3/6] Waiting for API to be healthy ==="
for i in $(seq 1 20); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/public/stats || true)
  if [ "$STATUS" = "200" ]; then
    echo "  API is up (attempt $i)"
    break
  fi
  echo "  Waiting... attempt $i/20"
  sleep 3
done

echo "=== [4/6] Building frontend ==="
cd "$FRONTEND_DIR"
npm ci --prefer-offline
npm run build

echo "=== [5/6] Deploying frontend to Nginx ==="
sudo rm -rf "$NGINX_ROOT"/*
sudo cp -r dist/* "$NGINX_ROOT/"
sudo chown -R www-data:www-data "$NGINX_ROOT"

echo "=== [6/6] Smoke tests ==="
echo -n "  Public stats:  "; curl -s http://localhost:5001/api/public/stats | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'totalUsers={d[\"totalUsers\"]} avgGrade={d[\"avgGrade\"]} OK')" 2>/dev/null || echo "FAIL"
echo -n "  Health check:  "; curl -s http://localhost:5001/api/health | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['checks'])" 2>/dev/null || echo "FAIL"
echo -n "  Frontend:      "; curl -s -o /dev/null -w "%{http_code}" https://stellaredu.in && echo " OK" || echo " FAIL"

echo ""
echo "=== Deploy complete ==="
echo "  Site:    https://stellaredu.in"
echo "  API:     https://stellaredu.in/api/public/stats"
echo "  Admin:   https://stellaredu.in/admin"
