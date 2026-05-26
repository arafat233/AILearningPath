# Topic 22.3: Connection Pool Tuning (HikariCP)

**Module**: M22 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 22 Progress**: 3/5 | **Course Progress**: 108 topics (63.5%)

## Key Concepts
- Pool formula: `(DB_cores × 2) + spindles` — counterintuitively small!
- `connectionTimeout: 3000` — 3s fail fast, NOT 30s (which queues threads and causes outages)
- `max-lifetime: 1800000` — 30 min; must be < DB's connection timeout (8h for PostgreSQL)
- `minimum-idle: 3` — keep warm connections; reduce latency on burst traffic
- `keepalive-time: 60000` — ping DB every 60s to prevent firewall from killing idle connections
- `hikaricp.connections.pending` — **the** pool health metric; rising = exhaustion approaching
- `hikaricp.connections.acquire` Timer — p99 wait time for a connection from pool
- Pool name in config → `pool` label in Prometheus → filter alerts per pool
- PgBouncer: multiplexes N app connections → M DB connections (N >> M)

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
