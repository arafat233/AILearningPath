# Staging Environment

Staging runs on the **same Oracle Cloud server** as production but uses separate ports, container names, and Docker volumes so the two environments never collide.

| Resource   | Production        | Staging                  |
|------------|-------------------|--------------------------|
| API port   | 5001              | **5002**                 |
| MongoDB    | 27017 (internal)  | **27018** (host-exposed) |
| Redis      | 6379 (internal)   | **6380** (host-exposed)  |
| DB name    | ai_learning       | stellar_staging          |
| Volumes    | mongo_data, redis_data | staging_mongo_data, staging_redis_data |
| Containers | stellar-mongo, stellar-redis, stellar-api | stellar-mongo-staging, stellar-redis-staging, stellar-api-staging |

## First-time setup

```bash
# 1. Create the staging env file on the server
cp .env.staging.example .env.staging
nano .env.staging          # fill in all CHANGE_ME values

# 2. Start staging
docker compose -f docker-compose.staging.yml up -d
```

`.env.staging` is git-ignored. Never commit real secrets.

## Start / stop

```bash
# Start (or rebuild after code changes)
docker compose -f docker-compose.staging.yml up -d --build

# Stop (keeps volumes / data)
docker compose -f docker-compose.staging.yml down

# Stop and wipe volumes
docker compose -f docker-compose.staging.yml down -v
```

## Deploy via GitHub Actions

Push to the `staging` branch — the workflow runs tests then deploys automatically:

```bash
git push origin your-branch:staging
```

To trigger a deploy manually without a push: go to **Actions → Staging Deploy → Run workflow**.

## Reset staging data

```bash
bash scripts/staging-reset.sh
```

Drops the `stellar_staging` MongoDB database and flushes Redis. Production is not touched.

## GitHub secrets required

The staging workflow reuses the same secrets as production — no new secrets needed:

| Secret        | Description                          |
|---------------|--------------------------------------|
| `DEPLOY_HOST` | Oracle Cloud server IP (144.24.x.x)  |
| `DEPLOY_USER` | SSH username (e.g. `deploy`)         |
| `DEPLOY_KEY`  | SSH private key (PEM)                |

Configure at: **GitHub → Settings → Secrets and variables → Actions**.
