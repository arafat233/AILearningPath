#!/usr/bin/env bash
# install-on-vm.sh — one-shot Judge0 installer for a fresh Ubuntu/Debian VM.
#
# What it does:
#   1. Installs Docker Engine + Compose plugin (idempotent — skips if present)
#   2. Drops docker-compose.judge0.yml + judge0.conf into ~/stellar-judge0/
#   3. Generates a 64-char hex AUTHN_TOKEN + 32-char POSTGRES_PASSWORD
#   4. docker compose up -d
#   5. Waits for /about to return 200
#   6. Submits a Java Hello World as a smoke test
#   7. Prints the auth token + the line to drop into the BACKEND's .env
#
# Run on the VM:
#   ssh ubuntu@<vm-ip>
#   curl -fsSL https://raw.githubusercontent.com/arafat233/AILearningPath/main/ai-learning-backend/backend/infra/judge0/install-on-vm.sh | bash
#
# Or copy + run manually:
#   scp -r ai-learning-backend/backend/infra/judge0 ubuntu@<vm-ip>:~/
#   ssh ubuntu@<vm-ip> 'bash ~/judge0/install-on-vm.sh'
#
# Requirements: a fresh Ubuntu 22.04 / Debian 12 / Oracle Linux 9 x86_64
# VM with ≥ 2 vCPU + 4 GB RAM + 20 GB free disk (see PRO_TRACK_PLAN.md
# §14 sizing notes). Root or passwordless sudo.

set -euo pipefail

# Default install location (relative to the invoking user's home).
INSTALL_DIR="${INSTALL_DIR:-$HOME/stellar-judge0}"
IMAGE_TAG="${JUDGE0_IMAGE_TAG:-1.13.0}"

bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*"; }
log()   { printf '\033[2m[%s]\033[0m %s\n' "$(date +%H:%M:%S)" "$*"; }

# ── 1. Install Docker if not already present ──────────────────────────────────
if ! command -v docker >/dev/null 2>&1; then
  bold "Installing Docker Engine + Compose plugin"
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER" || true
  # User needs to re-login to pick up the group; for now use sudo for compose
  COMPOSE="sudo docker compose"
else
  log "Docker already installed: $(docker --version)"
  COMPOSE="docker compose"
fi

if ! docker compose version >/dev/null 2>&1 && ! sudo docker compose version >/dev/null 2>&1; then
  red "Docker Compose plugin missing — install required."
  exit 1
fi

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# ── 2. Write the compose + conf files ─────────────────────────────────────────
cat > docker-compose.judge0.yml <<EOF
# Stellar Judge0 — production VM deployment
name: stellar-judge0

services:
  server:
    image: judge0/judge0:${IMAGE_TAG}
    container_name: stellar-judge0-server
    restart: unless-stopped
    ports:
      # Bound to all interfaces on the VM — firewall it externally.
      - "2358:2358"
    env_file: judge0.conf
    privileged: true
    depends_on: [db, redis]
    networks: [judge0net]

  workers:
    image: judge0/judge0:${IMAGE_TAG}
    container_name: stellar-judge0-workers
    restart: unless-stopped
    command: ["./scripts/workers"]
    env_file: judge0.conf
    privileged: true
    depends_on: [db, redis]
    networks: [judge0net]

  db:
    image: postgres:13.10
    container_name: stellar-judge0-db
    restart: unless-stopped
    env_file: judge0.conf
    volumes: ["judge0-pg:/var/lib/postgresql/data"]
    networks: [judge0net]

  redis:
    image: redis:7.2-alpine
    container_name: stellar-judge0-redis
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    volumes: ["judge0-redis:/data"]
    networks: [judge0net]

volumes:
  judge0-pg:
  judge0-redis:

networks:
  judge0net:
    driver: bridge
EOF

# ── 3. Generate secrets (reuse existing if already present) ───────────────────
if [ ! -f judge0.conf ]; then
  AUTHN_TOKEN="$(openssl rand -hex 32)"
  PG_PASS="$(openssl rand -hex 16)"
  cat > judge0.conf <<EOF
# Auth (X-Auth-Token header required on every request)
AUTHN_TOKEN=${AUTHN_TOKEN}
AUTHZ_TOKEN=${AUTHN_TOKEN}

ENABLE_WAIT_RESULT=true

# Sandbox limits — must clear Judge0 1.13.x validators (≤ 128000 for stack)
CPU_TIME_LIMIT=5
CPU_EXTRA_TIME=1
WALL_TIME_LIMIT=10
MEMORY_LIMIT=262144
STACK_LIMIT=128000
MAX_PROCESSES_AND_OR_THREADS=64
ENABLE_PER_PROCESS_AND_THREAD_TIME_LIMIT=false
ENABLE_PER_PROCESS_AND_THREAD_MEMORY_LIMIT=true
MAX_FILE_SIZE=4096
MAX_QUEUE_SIZE=200
MAX_SUBMISSION_BATCH_SIZE=20

ENABLE_COMPILER_OPTIONS=true
ALLOWED_LANGUAGES_FOR_COMPILE_OPTIONS=
ENABLE_COMMAND_LINE_ARGUMENTS=true
USE_DOCS_AS_SUBMISSION_BODY=false

# Sandboxes cannot reach the internet
ENABLE_NETWORK=false

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=judge0
POSTGRES_USER=judge0
POSTGRES_PASSWORD=${PG_PASS}

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
EOF
  chmod 600 judge0.conf
else
  log "Re-using existing judge0.conf (auth token preserved)"
fi

AUTHN_TOKEN="$(grep '^AUTHN_TOKEN=' judge0.conf | cut -d= -f2)"

# ── 4. Pull + start ───────────────────────────────────────────────────────────
bold "Starting Judge0 stack (first run pulls ~3.3 GB)"
$COMPOSE -f docker-compose.judge0.yml up -d

# ── 5. Wait for /about ────────────────────────────────────────────────────────
bold "Waiting for Judge0 to finish booting"
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w "%{http_code}" -H "X-Auth-Token: ${AUTHN_TOKEN}" http://localhost:2358/about | grep -q 200; then
    green "Judge0 is up after ~${i}0 s"
    break
  fi
  sleep 10
  [ "$i" -eq 60 ] && { red "Timed out waiting for /about"; exit 1; }
done

# ── 6. Smoke: Java Hello World ────────────────────────────────────────────────
bold "Submitting Java Hello World"
RESPONSE="$(curl -s -X POST "http://localhost:2358/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: ${AUTHN_TOKEN}" \
  -d '{"source_code":"public class Main { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }","language_id":62}')"
echo "$RESPONSE"

if echo "$RESPONSE" | grep -q '"stdout":"Hello, World!\\n"'; then
  green ""
  green "✓ END-TO-END WORKING. Sandbox compiled + ran Java code successfully."
else
  red "✗ Sandbox did NOT return expected output."
  red "Inspect: docker logs stellar-judge0-server --tail 50"
  exit 1
fi

# ── 7. Print backend env block ────────────────────────────────────────────────
bold ""
bold "Add to ai-learning-backend/backend/.env on your local/Stellar app machine:"
echo
echo "JUDGE0_URL=http://$(curl -s ifconfig.me):2358"
echo "JUDGE0_AUTH_TOKEN=${AUTHN_TOKEN}"
echo "PRO_TRACKS_ENABLED_FOR_EMAILS=najeebarafat@gmail.com,pilot_acceptance@stellar.dev"
echo "SANDBOX_MAX_RUNS_PER_HOUR=30"
echo "SANDBOX_MAX_RUNS_PER_DAY=100"
echo
bold "Open port 2358 in your VM's firewall to YOUR backend's IP only."
bold "For Oracle: Security List → Add Ingress Rule  source <stellar-app-ip>/32"
bold "For Hetzner: Firewall → Inbound rule  source <stellar-app-ip>/32"
bold ""
bold "Done."
