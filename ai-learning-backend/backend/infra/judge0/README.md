# Judge0 — Local Sandbox Runbook

Local-only Judge0 instance for the pro-track Java pilot. Production hosting
decision is deferred to Phase 14 (`PRO_TRACK_PLAN.md`).

## One-time setup

1. **Install Docker Desktop** (Windows) — https://docs.docker.com/desktop/install/windows-install/
   - Enable WSL2 backend during install.
   - Allocate ≥ 2 GB RAM to Docker (Settings → Resources).
2. **Generate auth token** (used by both Judge0 and the backend):
   ```powershell
   # PowerShell
   [System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object { [byte]$_ }))
   ```
   Or with OpenSSL: `openssl rand -hex 32`.
3. **Create `judge0.conf` from the example**:
   ```powershell
   Copy-Item judge0.conf.example judge0.conf
   ```
   Then edit `judge0.conf` and replace every `__CHANGE_ME__`:
   - `AUTHN_TOKEN` = the token from step 2
   - `AUTHZ_TOKEN` = same token
   - `POSTGRES_PASSWORD` = any strong random password
4. **Mirror the auth token into the backend** `.env`:
   ```
   JUDGE0_URL=http://localhost:2358
   JUDGE0_AUTH_TOKEN=<same token>
   ```

`judge0.conf` is gitignored — never commit real secrets.

## Daily commands

```powershell
# Start (detached)
docker compose -f docker-compose.judge0.yml up -d

# Status
docker compose -f docker-compose.judge0.yml ps

# Tail logs
docker compose -f docker-compose.judge0.yml logs -f server

# Stop
docker compose -f docker-compose.judge0.yml down

# Stop AND wipe Postgres + Redis volumes (destructive — only when needed)
docker compose -f docker-compose.judge0.yml down -v
```

## Smoke test

```powershell
# 1. Should return 200 + JSON about Judge0 version
curl http://localhost:2358/about

# 2. Submit a tiny Java program (replace TOKEN with your AUTHN_TOKEN)
curl -X POST "http://localhost:2358/submissions?wait=true" `
  -H "Content-Type: application/json" `
  -H "X-Auth-Token: TOKEN" `
  -d '{"language_id":62,"source_code":"public class Main { public static void main(String[] a) { System.out.println(\"Hello, World!\"); } }"}'

# Expected: { "stdout": "Hello, World!\n", "status": { "id": 3, "description": "Accepted" }, ... }
```

`language_id: 62` = Java (OpenJDK 13.0.1). Full list at `GET /languages`.

## Sandbox limits

Set in `judge0.conf`. Defaults:

| Limit | Value | Why |
|---|---|---|
| CPU time | 5 s | Most exercise submissions run in well under 1 s |
| Wall-clock time | 10 s | Catches infinite loops in compile + run |
| Memory | 256 MB | Plenty for educational Java |
| Stack | 128 MB | Defensive against unbounded recursion |
| Max processes | 64 | Prevents fork-bombing |
| Max output | 4 KB | Backend re-truncates to 8 KB before sending to client |
| Network access | **disabled** | Sandboxes cannot phone home |

## Security checklist

- [ ] `judge0.conf` is in `.gitignore` (never commit secrets)
- [ ] Server port bound to `127.0.0.1` only (never `0.0.0.0`)
- [ ] AUTHN_TOKEN set + mirrored to backend `.env`
- [ ] `ENABLE_NETWORK=false` in `judge0.conf`
- [ ] Docker Desktop's resource cap matches host RAM (won't starve Mongo/backend)

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `Error response from daemon: cgroups: cannot find cgroup mount destination` | Docker Desktop needs cgroups v1 — enable in Settings → General → "Use legacy cgroup mounts" |
| `/about` returns 401 | AUTHN_TOKEN mismatch between request and `judge0.conf` |
| Submissions stuck in "In Queue" | Workers container not running — `docker compose logs workers` |
| Slow cold-start (~30 s on first submission) | Normal — sandbox image warm-up. Subsequent submissions are <1 s. |

## Stopping for the day

```powershell
docker compose -f docker-compose.judge0.yml stop
```

(Use `stop` not `down` if you want to preserve the Postgres + Redis state.)

## Production move (Phase 14)

When ready to expose Judge0 beyond local:
1. Pick a host (Oracle Cloud has been our default; verify ≥5 GB disk + ≥1 GB RAM free first)
2. Move `judge0.conf` and `docker-compose.judge0.yml` to that host
3. Front Judge0 with Nginx on the host (Judge0 itself stays on `127.0.0.1`)
4. Rotate AUTHN_TOKEN before the cutover
