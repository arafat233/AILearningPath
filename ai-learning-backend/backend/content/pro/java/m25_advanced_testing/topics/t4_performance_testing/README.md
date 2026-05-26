# Topic 25.4: Performance Testing (Gatling & k6)

**Module**: M25 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 25 Progress**: 4/5 | **Course Progress**: 124 topics (72.9%)

## Key Concepts
- **Load test**: normal expected traffic, verify SLA (p99 < threshold)
- **Stress test**: ramp until failure — find the breaking point, verify graceful degradation
- **Soak test**: normal load for hours — detect memory leaks and gradual degradation
- **Spike test**: sudden massive burst — verify auto-scaling and recovery
- **p99 for SLA** — never use average (averages hide tail latency)
- **Gatling `percentile3` = p99** (not percentile99 — counterintuitive naming!)
- `atOnceUsers(N)`: N users all at once (spike); `rampUsers(N).during(30)`: gradual
- `constantUsersPerSec(N)`: sustained throughput scenario
- `global().responseTime().percentile3().lt(500)`: p99 < 500ms assertion
- `global().successfulRequests().percent().gt(99.0)`: >99% success rate
- **Gatling exit code 1** if assertions fail → CI pipeline blocked
- **k6 thresholds**: `p(99)<500`, `http_req_failed: rate<0.01` — fail run on breach
- `check()` in k6: informational only; `thresholds` actually fail the run
- **Feeder** (`csv().circular()`): different data per VU — prevents artificial caching
- **Baseline + 10% regression**: CI performance gate between releases
- **Never load test production databases** — always staging with production-like data
- **Gatling vs k6**: Gatling = Java/Scala + rich HTML reports; k6 = JS + great CI integration
- Memory leak detection: heap snapshots every minute, alert if growing > 50MB/interval

## Files: topic.json (~12KB), exercises.json (~27KB), project.json, README.md
