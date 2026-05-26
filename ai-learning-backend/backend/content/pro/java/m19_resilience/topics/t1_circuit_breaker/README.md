# Topic 19.1: Resilience4j Circuit Breaker

**Module**: M19 - Microservice Resilience
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T17.5 (Database Transactions & Locking)

---

## 🆕 Module 19 Begins — Microservice Resilience

After caching (M18) and database optimization (M17), Module 19 covers the safety nets: what happens when the services you CALL fail. Circuit breakers, retries, bulkheads, and timeouts are the patterns that separate production-grade microservices from fragile ones.

---

## What This Topic Teaches

1. Cascading failure: one slow dependency blocks all threads → entire service fails
2. Circuit breaker: stops the cascade by fast-failing calls to struggling dependencies
3. CLOSED state: normal, all calls pass through, failures tracked
4. OPEN state: all calls → fallback immediately (0ms), no real service calls
5. HALF-OPEN state: limited test calls to probe recovery
6. `@CircuitBreaker(name, fallbackMethod)` — one annotation wraps the call
7. Fallback signature: **same return type + same params + Exception as LAST parameter**
8. `resilience4j-spring-boot3` dependency + `spring-boot-starter-aop` (both required!)
9. `application.yml`: `slidingWindowSize`, `minimumNumberOfCalls`, `failureRateThreshold`
10. `waitDurationInOpenState`: recovery window (30-60s typical)
11. `permittedNumberOfCallsInHalfOpenState`: test calls before full recovery
12. `slowCallDurationThreshold` + `slowCallRateThreshold`: open on slow calls too
13. `minimumNumberOfCalls`: prevents false open on low traffic — set to 5-10
14. `CircuitBreakerRegistry`: programmatic state inspection and metrics
15. `cb.getState()`: CLOSED, OPEN, HALF_OPEN
16. `cb.getMetrics()`: getFailureRate(), getSlowCallRate(), getNumberOfBufferedCalls()
17. Event listener: `cb.getEventPublisher().onStateTransition(...)` for alerting
18. Actuator `/health/circuitBreakers`: operational visibility
19. Self-invocation: @CircuitBreaker bypassed if called from same class (AOP proxy)
20. COUNT_BASED vs TIME_BASED sliding window: count last N calls vs calls in last N seconds

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~7KB | Razorpay Payment Flow |
| `README.md` | This file |

---

## The Circuit Breaker Pattern

```java
// Add dependency (pom.xml):
// resilience4j-spring-boot3  ← the library
// spring-boot-starter-aop   ← required for @CircuitBreaker to work!

// Configure (application.yml):
resilience4j.circuitbreaker.instances.notification:
  slidingWindowSize: 10
  minimumNumberOfCalls: 5
  failureRateThreshold: 50      # open at 50% failures
  waitDurationInOpenState: 30s  # recovery window
  permittedNumberOfCallsInHalfOpenState: 3

// Use (Java):
@CircuitBreaker(name = "notification", fallbackMethod = "notifFallback")
public void sendNotification(String userId, String message) {
    notifClient.send(userId, message);  // real call
}

// Fallback (same return type + same params + Exception last):
private void notifFallback(String userId, String message, Exception e) {
    retryQueue.add(userId + ":" + message);  // safe degradation
}
```

---

## State Transition Summary

```
CLOSED ──────[50%+ failures]──────→ OPEN
  ↑                                    │
  │                                  30s wait
[3/3 test calls succeed]               │
  │                                    ↓
HALF-OPEN ←──[30s elapsed]─────── OPEN
  │
  └──[any test call fails]──→ OPEN (again)
```

---

## Review Checklist

- [ ] AOP dependency: prominently flagged — most common mistake
- [ ] Fallback signature: exact rules with examples
- [ ] minimumNumberOfCalls: explained why needed (Ex 1 trace)
- [ ] Slow call threshold: separate from failure threshold (Ex 8)
- [ ] Ex 10: void/wrong-type fallback bug — runtime not compile time

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

**Module 19 Progress**: 1/5 topics complete

**Course Progress**: 91 topics complete (53.5% of 170)
