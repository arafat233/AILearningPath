# Topic 19.2: Retry & Rate Limiter

**Module**: M19 - Microservice Resilience  
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T19.1 (Resilience4j Circuit Breaker)

---

## What This Topic Teaches

1. Retry handles **transient** failures; Circuit Breaker handles **sustained** failures
2. `@Retry(name, fallbackMethod)` — transparent retry with configurable backoff
3. `maxAttempts`: total attempts including the first (maxAttempts=3 → 1 original + 2 retries)
4. `enableExponentialBackoff: true` + `exponentialBackoffMultiplier: 2.0`
5. `retryExceptions`: whitelist — ONLY retry these exception types
6. `ignoreExceptions`: blacklist — NEVER retry these (business errors)
7. `@RateLimiter(name, fallbackMethod)` — limits outgoing call rate
8. `limitForPeriod` + `limitRefreshPeriod`: 100 calls per 1 second
9. `timeoutDuration`: how long to wait for a permit before fallback
10. `RequestNotPermittedException`: thrown when rate limit exceeded
11. **Annotation order**: `@RateLimiter` (outer) → `@CircuitBreaker` → `@Retry` (inner)
12. Wrong order (`@Retry` outer): CB records each retry as separate failure → opens 3× faster
13. `@CircuitBreaker` OUTSIDE `@Retry`: CB records 1 failure per retry sequence
14. `RetryRegistry`: Spring bean for programmatic retry inspection and events
15. Jitter/randomized backoff: prevents thundering herd on mass retry

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~14KB | Main content |
| `exercises.json` | ~32KB | 15 exercises |
| `project.json` | ~4KB | Zerodha Order Router |
| `README.md` | This file |

---

## The Annotation Stack

```java
@RateLimiter(name="svc", fallbackMethod="rateLimited")    // ← outermost
@CircuitBreaker(name="svc", fallbackMethod="cbOpen")       // ← middle
@Retry(name="svc")                                         // ← innermost
public Result callService(Request req) { ... }

// Execution flow:
// 1. RateLimiter checks quota (fail fast if exceeded → rateLimited())
// 2. CircuitBreaker checks state (fail fast if OPEN → cbOpen())
// 3. Retry attempts the call up to maxAttempts times
// 4. If all retries fail: exception propagates to CircuitBreaker (1 failure recorded)
// 5. If CB threshold exceeded: circuit opens, future calls → cbOpen()
```

---

## Review Checklist

- [ ] Annotation order: explained WHY with concrete numbers (Ex 10)
- [ ] ignoreExceptions: emphasized — business errors MUST be in this list
- [ ] maxAttempts=3 semantics: 1 original + 2 retries (not 3 retries!)
- [ ] retryExceptions vs ignoreExceptions: both options explained with examples

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 19 Progress**: 2/5 topics complete  
**Course Progress**: 92 topics complete (54.1% of 170)
