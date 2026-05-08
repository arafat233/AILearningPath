#!/bin/bash
# chmod +x scripts/staging-reset.sh
#
# Wipes staging MongoDB and Redis — use when you want a clean staging slate.
# Does NOT touch production containers or volumes.
#
# Usage:
#   bash scripts/staging-reset.sh

set -euo pipefail

echo ""
echo "WARNING: This will wipe the staging database and Redis cache."
echo "  MongoDB:  stellar-mongo-staging / stellar_staging"
echo "  Redis:    stellar-redis-staging"
echo "  Production is NOT affected."
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

echo "Dropping staging MongoDB database..."
docker exec stellar-mongo-staging mongosh stellar_staging --eval "db.dropDatabase()" --quiet

echo "Flushing staging Redis cache..."
docker exec stellar-redis-staging redis-cli FLUSHALL

echo ""
echo "Staging data cleared. Run the following to reseed if needed:"
echo "  docker exec stellar-api-staging node config/seed.js"
