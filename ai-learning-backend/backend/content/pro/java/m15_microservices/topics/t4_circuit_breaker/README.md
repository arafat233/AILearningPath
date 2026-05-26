# Topic 15.4: Resilience4j Circuit Breaker

**Module**: M15 - Microservices Architecture
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T15.3 (Eureka Service Discovery)

---

## What This Topic Teaches

1. Cascade failure problem — how one failing service takes down everything
2. Circuit breaker pattern: CLOSED → OPEN → HALF-OPEN → CLOSED
3. `@CircuitBreaker(name="key", fallbackMethod="method")` — wraps the call
4. Fallback signature: same return type + same params + `Exception` at end
5. `CallNotPermittedException` — thrown when circuit is OPEN
6. `failure-rate-threshold` — percentage of failures to open circuit (e.g. 50%)
7. `sliding-window-size` — last N calls evaluated for failure rate
8. `minimum-number-of-calls` — minimum calls before evaluating
9. `wait-duration-in-open-state` — how long circuit stays OPEN
10. `permitted-number-of-calls-in-half-open-state` — test calls in HALF-OPEN
11. `register-health-indicator=true` — show circuit state in /actuator/health
12. `@Retry(name="key")` — retry transient failures before CB counts it
13. `@Retry` + `@CircuitBreaker` order: retry inner, CB outer → N retries = 1 CB failure
14. `@RateLimiter(name="key")` — limit calls per time period
15. `RequestNotPermitted` — thrown when rate limit exceeded
16. `CircuitBreakerRegistry.circuitBreaker("name").reset()` — reset in tests
17. `cb.transitionToHalfOpenState()` — force HALF-OPEN in tests (no Thread.sleep)
18. `management.health.circuitbreakers.enabled=true` — Actuator integration

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Resilient Trading Platform |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
market-service goes DOWN → 30s timeouts → thread pool fills → order-service goes DOWN → cascade. With Resilience4j: circuit opens after 5 failures → fallback in microseconds → order-service stays UP → graceful degradation.

### 📚 Teaching (4 Sub-sections)
1. **Circuit states**: CLOSED/OPEN/HALF-OPEN state machine with timing
2. **Setup**: dependency, application.properties, @CircuitBreaker + fallback
3. **@Retry + @RateLimiter**: when to use each, ordering with @CircuitBreaker
4. **Testing + Monitoring**: registry.reset(), transitionToHalfOpenState(), Actuator

### 🛠️ Worked Example: Trading Platform Resilience
TradeService wraps Feign call. Price cache as fallback. 3 failures → circuit opens. /actuator/health shows OPEN state.

### ⚠️ 3 Common Gaps
1. **fallback_signature_wrong** — wrong return type or missing Exception → startup error
2. **circuit_breaker_on_interface** — @CB on Feign interface silently ignored
3. **not_resetting_circuit_in_tests** — state bleeds between tests → intermittent failures

### 💪 15 Exercises (740 XP)
Key exercises:
- **Ex 8 (60 XP)**: Verify circuit OPENS after threshold failures
- **Ex 11 (65 XP)**: Circuit state in /actuator/health
- **Ex 13 (75 XP)**: Full resilience stack — 3 CBs + 3 tests
- **Ex 14 (70 XP)**: HALF-OPEN → CLOSED recovery test
- **Ex 15 (95 XP)**: Complete trading platform resilience — 3 tests all pass

### 🚀 Mini-Project: Zerodha Resilient Trading Platform
@CircuitBreaker on market and payment calls. Price cache fallback. PaymentUnavailableException fallback. 5 @SpringBootTest tests including Actuator health.

---

## The Circuit Breaker Pattern

```java
// ❌ Without: 30s timeout × N concurrent requests = thread pool exhausted = cascade
public StockQuote getQuote(String symbol) { return marketClient.getQuote(symbol); }

// ✅ With: fallback in microseconds when circuit is OPEN
@CircuitBreaker(name = "market-service", fallbackMethod = "getQuoteFallback")
@Retry(name = "market-service")
public StockQuote getQuote(String symbol) {
    StockQuote q = marketClient.getQuote(symbol);
    cache.put(symbol, q.price());  // update cache on success
    return q;
}

// Fallback: same return type + same params + Exception
public StockQuote getQuoteFallback(String symbol, Exception ex) {
    double cached = cache.getOrDefault(symbol, 0.0);
    return new StockQuote(symbol, cached, false);  // tradeable=false signals degraded
}
```

## The Three States

```
                 failure rate > 50%
  CLOSED ──────────────────────────→ OPEN
    ↑          (normal)               │ fallback returned instantly
    │                                 │
    │      test calls succeed         ↓
    └──────────────────── HALF-OPEN (after 60s)
                           └─────→ OPEN (if test calls fail)
```

## Test Essentials

```java
@BeforeEach void reset() {
    registry.circuitBreaker("market-service").reset();  // CRITICAL: test isolation
}

// Force HALF-OPEN (no Thread.sleep):
cb.transitionToHalfOpenState();

// Verify circuit is OPEN:
assertEquals(CircuitBreaker.State.OPEN, cb.getState());

// Verify fallback was used, not the Feign client:
verify(marketClient, never()).getQuote(any());
```

---

## Review Checklist

- [ ] Fallback must be on @Service method, NOT on @FeignClient interface
- [ ] Fallback signature: same return type + same params + Exception
- [ ] @BeforeEach registry.reset() — test isolation essential
- [ ] Ex 10: CallNotPermittedException from OPEN state — correct
- [ ] cb.transitionToHalfOpenState(): avoids Thread.sleep in tests

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T15.3 | T15.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~70 min | Slightly more (complex topic) |
| Word count | ~13K | ~15K | Higher |
| Exercises | 15 | 15 | Consistent |
| XP available | 735 | 740 | Stable |

**Module 15 Progress**: 4/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 74 topics complete (43.5% of 170)

**Next**: Topic 15.5 — Distributed Tracing (Module 15 Final)
