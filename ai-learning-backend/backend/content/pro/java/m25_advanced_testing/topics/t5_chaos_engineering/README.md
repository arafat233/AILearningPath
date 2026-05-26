# Topic 25.5: Chaos Engineering

**Module**: M25 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 25 Progress**: 5/5 ✅ | **Course Progress**: 125 topics (73.5%)

## Key Concepts
- **Chaos engineering**: deliberately inject failures to verify resilience mechanisms work
- **`@EnableChaosMonkey`** on `@SpringBootApplication` — enables Chaos Monkey
- **Assault types** (safest → most dangerous): Latency → Exception → Memory → KillApp
- **Watcher**: `chaos.monkey.watcher.service: true` — targets `@Service` beans
- **Level 1–10**: level=5 means 1 in 5 calls assaulted; level=1 = every call
- **Steady-state hypothesis**: define normal metrics BEFORE chaos; explicit "When X, then Y" format
- **Three required chaos test assertions**: CB state ≠ CLOSED, fallback counter > 0, p99 within threshold
- Asserting only "no exception thrown" MISSES resilience bugs (fallback may be hiding the broken CB)
- **Recovery**: after chaos stops, CB transitions HALF_OPEN → CLOSED; verify normal behavior resumes
- **Game days**: scheduled chaos experiments; `GameDayExperiment` with name, hypothesis, blast radius, rollback
- **Blast radius control**: start at pod level → service level → region level (never start region-level)
- **Chaos REST API**: `POST /actuator/chaosmonkey/assaults` — configure programmatically
- **Chaos in CI**: nightly chaos suite in staging; fail CI if hypothesis violated
- **Chaos-driven TDD**: gap discovered from chaos → fix → re-run chaos as regression test
- `DiscoveredGap` record: experiment, observation, root cause, fix — tracks chaos findings

## Files: topic.json (~12KB), exercises.json (~27KB), project.json, README.md
