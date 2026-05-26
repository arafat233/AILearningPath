# Topic 14.5: Actuator and Production Observability

**Module**: M14 - Advanced Spring Boot  
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T14.4 (@ConfigurationProperties and Profiles)

---

## 🎉 Module 14 Final Topic

This is the last piece of the Advanced Spring Boot puzzle. After this, students have the full production Spring Boot skillset.

---

## What This Topic Teaches

1. `spring-boot-starter-actuator` — one dependency, full observability
2. `management.endpoints.web.exposure.include=health,info,metrics` — explicit exposure
3. `management.endpoint.health.show-details=always` — full component breakdown
4. `/actuator/health` — UP/DOWN with component details
5. `HealthIndicator` interface — `health()` returns `Health.up()/down()/unknown()`
6. `.withDetail("key", value)` — add diagnostic info to health response
7. Overall health: UP only if ALL components are UP
8. Slow check → cache with `AtomicReference<Health>` + `@Scheduled`
9. `MeterRegistry` — auto-configured; inject via constructor
10. `Counter.builder("name").tag("k","v").register(registry)` — count events
11. `registry.gauge("name", atomicInteger)` — track current value
12. `Timer.builder("name").register(registry)` — measure durations
13. `Timer.record(Callable<T>)` — wrap operation, record time, return result
14. `timer.count()`, `timer.totalTime(MILLISECONDS)` — read timer stats
15. `management.server.port=8090` — separate actuator from app port
16. `/actuator/health/liveness` and `/health/readiness` — Kubernetes probes
17. `management.endpoint.health.probes.enabled=true` — activate probe paths
18. `/actuator/loggers/{name}` — change log level at runtime (POST)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Razorpay Payment Observability |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Without Actuator: ops team can't answer "is it UP?" or "how many payments?". With Actuator: /health, /info, /metrics answer everything — without SSH access or log diving.

### 📚 Teaching (4 Sub-sections)
1. **Actuator setup**: dependency, exposure config, built-in endpoints
2. **Custom HealthIndicator**: Health.up/down/unknown, withDetail, caching pattern
3. **Micrometer metrics**: Counter, Gauge, Timer — when to use each
4. **Security + Kubernetes**: separate port, liveness/readiness probes, log level change

### 🛠️ Worked Example: Payment Service Observability
PaymentGatewayHealthIndicator (latency-aware). PaymentService with Counter(processed+failed), AtomicInteger gauge(pending), Timer(processing duration). @SpringBootTest verifying /health UP and /info.

### ⚠️ 3 Common Gaps
1. **endpoints_not_exposed** — only /health + /info exposed by default
2. **slow_health_indicator** — cache health result for external service checks
3. **exposing_env_in_prod** — /env leaks config; use management.server.port to isolate

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 8 (55 XP)**: HealthIndicator with DOWN/UNKNOWN states + test with Mockito
- **Ex 11 (65 XP)**: Cached HealthIndicator — @Scheduled updates AtomicReference
- **Ex 13 (75 XP)**: Full observability stack — health + 4 metrics + properties + 3 tests
- **Ex 14 (70 XP)**: Kubernetes probes — liveness/readiness with custom readiness indicator
- **Ex 15 (95 XP)**: Complete trading service observability — all concepts

### 🚀 Mini-Project: Razorpay Payment API — Full Observability
Cached HealthIndicator. 4 Micrometer metrics with tags. Separate management port. Kubernetes probes. 5 @SpringBootTest tests.

---

## The Observability Quick Reference

```java
// 1. Add dependency: spring-boot-starter-actuator

// 2. Configure:
// management.endpoints.web.exposure.include=health,info,metrics
// management.endpoint.health.show-details=always
// management.endpoint.health.probes.enabled=true

// 3. Custom health:
@Component class GatewayHealthIndicator implements HealthIndicator {
    @Override public Health health() {
        return ping() ? Health.up().withDetail("latencyMs", latency).build()
                      : Health.down().withDetail("reason","unreachable").build();
    }
}

// 4. Business metrics:
Counter.builder("payments.processed").tag("currency","INR").register(registry);
registry.gauge("payments.pending", atomicInteger);
Timer.builder("payment.duration").register(registry).record(() -> processPayment(req));

// 5. Test:
GET /actuator/health    → {"status":"UP","components":{...}}
GET /actuator/info      → {"app":{"name":"...","version":"..."}}
GET /actuator/metrics/payments.processed → {"COUNT":15234}
POST /actuator/loggers/com.example {"configuredLevel":"DEBUG"}
```

---

## The Three Micrometer Instruments

| Instrument | Use case | Direction |
|------------|----------|-----------|
| `Counter` | Events (orders placed, errors) | Up only |
| `Gauge` | Current state (queue depth, active) | Up and down |
| `Timer` | Operation duration (DB query, API call) | Records stats |

---

## Review Checklist

- [ ] Default exposure: only health + info — need explicit include
- [ ] Slow health check: cache in AtomicReference, refresh @Scheduled
- [ ] Ex 10: uncaught exception in health() → component DOWN (caught by Actuator)
- [ ] Kubernetes probes: probes.enabled=true, separate liveness/readiness
- [ ] management.server.port: separate port for security isolation

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

---

# 🎉 MODULE 14: ADVANCED SPRING BOOT — COMPLETE!

---

## Module 14 Statistics

| Topic | Title | XP |
|-------|-------|----|
| 14.1 | Spring Security and JWT | 740 |
| 14.2 | @Async and @Scheduled | 720 |
| 14.3 | Spring Cache with @Cacheable | 730 |
| 14.4 | @ConfigurationProperties and Profiles | 710 |
| 14.5 | Actuator and Production Observability | 735 |
| **TOTAL** | | **~3,635** |

**5 topics · 75 exercises · 5 mini-projects · ~67,000 words**

---

## Module 14 Master Reference

```
JWT Security:     @EnableWebSecurity + SecurityFilterChain + JwtAuthFilter
Async:            @EnableAsync + @Async(void|CF<T>) + ThreadPoolTaskExecutor
Scheduling:       @EnableScheduling + @Scheduled(fixedRate|fixedDelay|cron)
Caching:          @EnableCaching + @Cacheable + @CacheEvict + CaffeineCacheManager
Configuration:    @ConfigurationProperties + @Validated + Spring Profiles
Observability:    spring-boot-starter-actuator + HealthIndicator + MeterRegistry
```

---

## Cumulative Course Progress After Module 14

| Metric | After M13 | After M14 |
|--------|-----------|-----------|
| Topics | 65/170 | **70/170 (41.2%)** |
| Total XP | ~47,285 | **~50,920** |
| Exercises | 975 | **1,050** |
| Projects | 67 | **72** |

**50K XP milestone crossed!**

---

## Pipeline Performance

| Metric | M13 avg | M14 avg | Trend |
|--------|---------|---------|-------|
| Time/topic | ~68 min | ~63 min | Faster |
| Words/topic | ~14,200 | ~13,800 | Stable |
| XP/topic | ~713 | ~727 | Slightly higher (harder topics) |

---

## Next Module Options

**Path A (recommended): Module 15 — Microservices Architecture**
- Service decomposition and domain design
- Spring Cloud / Feign for inter-service HTTP
- Service discovery with Eureka
- API gateway patterns
- Distributed tracing

**Path B: Module 16 — Full-Stack with React**
- React basics for Java developers
- Axios + REST API integration
- JWT token handling in the browser
- CORS configuration in Spring Boot

**Path C: Module 17 — Data Engineering**
- Spring Batch for large-scale data processing
- Kafka for event streaming
- Spring Data Redis for distributed caching
- Database migration with Flyway

The course continues with Module 15 — Microservices Architecture.
