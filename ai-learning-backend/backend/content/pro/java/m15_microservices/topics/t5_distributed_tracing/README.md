# Topic 15.5: Distributed Tracing

**Module**: M15 - Microservices Architecture  
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)  
**Estimated Time**: 50 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T15.4 (Resilience4j Circuit Breaker)

---

## 🎉 Module 15 Final Topic

Distributed tracing is the observability capability that ties everything together. It's how you diagnose production issues in a distributed system in minutes instead of hours.

---

## What This Topic Teaches

1. Distributed tracing: one traceId across all services for one request
2. TraceId, SpanId, Parent SpanId — the trace tree structure
3. `micrometer-tracing-bridge-brave` — core tracing dependency
4. `zipkin-reporter-brave` — sends spans to Zipkin
5. `feign-micrometer` — propagates B3 headers through Feign calls (critical!)
6. `management.tracing.sampling.probability=1.0` — 100% in dev; 0.05 in prod
7. `management.zipkin.tracing.endpoint=http://localhost:9411/api/v2/spans`
8. `logging.pattern.console=...%X{traceId}...` — traceId in every log line
9. `Tracer.nextSpan().name("name").tag("k","v").start()` — custom span
10. `Tracer.SpanInScope` — sets span as current for this thread
11. `span.end()` in finally — always! Prevents span leaks
12. `span.error(exception)` — marks span as failed (red in Zipkin)
13. `span.event("name")` — point-in-time annotation
14. `tracer.currentSpan().context().traceId()` — read current traceId
15. MDC and `%X{key}` in Logback patterns
16. `sampling.probability=0.01-0.1` for production (statistical sampling)
17. Zipkin UI: search by traceId, read waterfall, identify bottleneck span

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~21KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Full Observability Stack |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Without tracing: 45 minutes to find the slow service (SSH, grep, correlate). With tracing: 2 minutes in Zipkin. One traceId, complete story.

### 📚 Teaching (4 Sub-sections)
1. **Concepts**: traceId/spanId hierarchy, propagation via B3 headers
2. **Setup**: 3 dependencies, 4 properties, Zipkin start command
3. **Custom spans + logs**: Tracer API, MDC, logging patterns
4. **Sampling + baggage**: production rates, MDC for business context

### 🛠️ Worked Example: Trading Platform Tracing
market-service + order-service with Micrometer Tracing. custom 'stock-db-query' span. Logs show traceId. Zipkin waterfall reveals 2800ms DB bottleneck.

### ⚠️ 3 Common Gaps
1. **forgetting_span_end** — open spans corrupt Zipkin; use finally
2. **high_sampling_in_production** — 1.0 overwhelming; use 0.01-0.1
3. **tracing_log_pattern_missing** — Zipkin works but logs don't show traceId

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 8 (60 XP)**: DB query span with cache-hit/miss events and elapsed_ms tag
- **Ex 11 (65 XP)**: MDC baggage — userId propagated via filter + Feign interceptor
- **Ex 12 (65 XP)**: Error marking — span.error() for failed payments
- **Ex 13 (75 XP)**: Full trading platform tracing — 3 services, 2 tests
- **Ex 15 (95 XP)**: Complete observability — all components, 3 tests passing

### 🚀 Module 15 Capstone: Zerodha Full Observability Stack
3 services, 3 custom spans, UserContextFilter, AuditFilter, traceId in logs, Zipkin waterfall, 3 @SpringBootTest tests.

---

## The Tracing Setup

```java
// 1. Three pom.xml dependencies:
//    micrometer-tracing-bridge-brave (core)
//    zipkin-reporter-brave (sender)
//    feign-micrometer (Feign propagation — CRITICAL)

// 2. application.properties:
management.tracing.sampling.probability=1.0  // dev: all traces
management.zipkin.tracing.endpoint=http://localhost:9411/api/v2/spans
logging.pattern.console=%d{HH:mm:ss} [%X{traceId}] %-5level %msg%n

// 3. Custom span:
Span span = tracer.nextSpan().name("trade-execution")
    .tag("userId", userId).start();
try (Tracer.SpanInScope s = tracer.withSpan(span)) {
    // operations here are children of this span
} catch (Exception e) { span.error(e); throw e; }
finally { span.end(); }  // ALWAYS
```

---

## Reading the Zipkin Waterfall

```
order-service  POST /api/trades     [███████████████████████████] 3050ms
  market-service  GET /api/stocks/TCS [████████████████████] 2850ms
    stock-db-query (CUSTOM)           [███████████████████] 2800ms ← SLOW!
  payment-service POST /api/payments  [████] 150ms

→ stock-db-query is the bottleneck: add index on symbol column
```

---

## Review Checklist

- [ ] feign-micrometer: emphasized as required for cross-service propagation
- [ ] span.end() in finally: non-negotiable, always required
- [ ] sampling=1.0 dev, 0.01-0.1 prod: production warning clear
- [ ] Ex 10: waterfall reading correctly identifies payment-gateway-call as bottleneck
- [ ] MDC.remove() in filter finally: thread pool cleanup

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

---

# 🎉 MODULE 15: MICROSERVICES ARCHITECTURE — COMPLETE!

---

## Module 15 Statistics

| Topic | Title | XP |
|-------|-------|----|
| 15.1 | Introduction to Microservices | 745 |
| 15.2 | Feign Client | 745 |
| 15.3 | Eureka Service Discovery | 735 |
| 15.4 | Resilience4j Circuit Breaker | 740 |
| 15.5 | Distributed Tracing | 735 |
| **TOTAL** | | **~3,700** |

**5 topics · 75 exercises · 5 mini-projects · ~70,000 words**

---

## Module 15 Master Reference

```
15.1: RestTemplate → basic inter-service HTTP, MockRestServiceServer
15.2: Feign → @FeignClient interface, ErrorDecoder, WireMock
15.3: Eureka → @EnableEurekaServer, @EnableDiscoveryClient, no url= in Feign
15.4: Resilience4j → @CircuitBreaker + fallback, @Retry, CLOSED/OPEN/HALF-OPEN
15.5: Tracing → micrometer-tracing-bridge-brave, traceId in logs, Zipkin
```

---

## Cumulative Course Progress After Module 15

| Metric | After M14 | After M15 |
|--------|-----------|-----------|
| Topics | 70/170 | **75/170 (44.1%)** |
| Total XP | ~50,920 | **~54,620** |
| Exercises | 1,050 | **1,125** |
| Projects | 72 | **77** |
| Files | ~326 | **330** |

---

## ✅ Module 15 Approval Status

All 5 topics: 🟡 PENDING REVIEW

---

## Pipeline Performance (Module 15)

| Metric | Value |
|--------|-------|
| Avg time/topic | ~66 min |
| Total words | ~70,000 |
| XP/topic average | ~740 |

Pipeline healthy. Module 16 proceeds.
