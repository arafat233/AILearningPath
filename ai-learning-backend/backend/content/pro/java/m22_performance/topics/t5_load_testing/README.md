# Topic 22.5: Load Testing with Gatling

**Module**: M22 - Performance & Optimization  
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 22 Progress**: 5/5 | **Course Progress**: 110 topics (64.7%)

## Key Concepts
- `injectOpen`: models internet-style traffic (arrival rate, not concurrency)
- `atOnceUsers(N)`: JIT warm-up phase before measuring
- `rampUsers(N).during(T)`: gradual ramp (realistic traffic growth)
- `constantUsersPerSec(N).during(T)`: sustained load for measurement window
- `global().responseTime().percentile(99).lt(200)`: SLO assertion — fails build if violated
- `global().successfulRequests().percent().gt(99.9)`: error budget assertion
- `details("requestName")`: per-request assertions (not global)
- CSV feeder + `.random()`: realistic cache-miss distribution across test data
- `jsonPath("$.id").saveAs("orderId")`: correlation — capture + reuse response values
- `responseTimeInMillis().lt(500)`: per-request check (individual request level)
- Spike test: `rampUsersPerSec(50).to(500).during(10)` — market-open surge scenario
- Soak test: 30+ minutes at moderate load — reveals memory leaks and connection leaks
- `mvn gatling:test`: exits non-zero on assertion failure → blocks CI deployment
- Capacity planning: `safe = (req/s / cpuPct) × 100 × 0.80` → pods = `ceil(target/safe × 1.4)`

## Run Commands
```bash
# Local run against staging:
mvn gatling:test -DsimulationClass=com.razorpay.PaymentLoadSimulation

# Report:
open target/gatling/results/*/index.html
```

## Files: topic.json (~14KB), exercises.json (~34KB), project.json (~2KB), README.md
