# Topic 18.3: Redis Rate Limiting

**Module**: M18 - Redis Caching & Rate Limiting
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T18.2 (Cache-Aside Pattern & Advanced Strategies)

---

## What This Topic Teaches

1. Rate limiting problem: one bot exhausts your connection pool, real users get 503s
2. Redis INCR: atomic counter — no two callers get the same value (Redis is single-threaded)
3. Fixed window counter: `increment(key)` + `expire(key, 2min)` only when `count == 1`
4. Window key: `"rate:" + identifier + ":" + (millis / 60_000)` — unique per minute
5. Second-granularity: `millis / 1_000` for per-second limits (Zerodha orders)
6. `count == 1` condition for TTL: CRITICAL — setting TTL on every request prevents window reset
7. HTTP 429 Too Many Requests: correct status code for rate limit exceeded
8. `Retry-After` header: seconds until window resets — standard HTTP header
9. `X-RateLimit-Limit`, `X-RateLimit-Remaining`: help clients self-throttle
10. Spring Filter `@Order(1)`: earliest interception point — before DB, before auth
11. `return` after 429: `chain.doFilter` MUST NOT be called after writing 429 response
12. Per-endpoint keys: include method+path in key — separate counters per endpoint
13. Per-user: `"rate:user:U001:window"` — individual quota
14. Per-IP: `"rate:ip:192.168.1.1:window"` — anonymous user protection
15. Global: `"rate:global:window"` — total system capacity protection
16. Whitelist: Redis Set `SISMEMBER` for O(1) bypass check
17. Tiered limits: enum with `requestsPerMinute` field
18. Sliding window: ZSet-based, removes old entries, no boundary spike — higher memory
19. Fixed window tradeoff: O(1) memory, occasional boundary spike — sufficient for most APIs
20. `getRemainingRequests`: read current count, subtract from limit (no increment!)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Razorpay API Protection |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Competitor scraper fires 5,000 req/s. PostgreSQL pool exhausted. Real merchant payments fail. One Redis INCR filter: 100 legitimate requests pass, 4,900 get 429. DB protected. Zero performance impact on legitimate traffic.

### 📚 Teaching (4 Sub-sections)
1. **Fixed window counter**: INCR + EXPIRE pattern, key anatomy, atomicity
2. **Spring Filter**: @Order(1), 429 with headers, chain.doFilter semantics
3. **Per-endpoint limits**: different keys for different paths
4. **Sliding window**: ZSet alternative, tradeoff with fixed window

### 🛠️ Worked Example: Razorpay Payment API
FixedWindowRateLimiter + RateLimitResult record + Filter with 429 + Retry-After. Per-endpoint limits: payments=100/min, status=500/min.

### ⚠️ 3 Common Gaps
1. **expire_on_every_increment** — TTL reset on every request means window never resets
2. **filter_not_returning_early** — chain.doFilter called after 429 → double processing
3. **per_user_key_collision** — missing endpoint or window in key causes wrong limiting

### 💪 15 Exercises (730 XP)
Key exercises:
- **Ex 10 (40 XP)**: Diagnose why rate limiter with expire-on-every-request never resets
- **Ex 11 (60 XP)**: Tiered rate limiting — FREE/PRO/ENTERPRISE with enum
- **Ex 12 (65 XP)**: Global + per-user dual rate limiting
- **Ex 14 (65 XP)**: Rate limit status dashboard endpoint
- **Ex 15 (95 XP)**: Complete Razorpay gateway rate limiter

### 🚀 Mini-Project: Razorpay API Protection
FixedWindowRateLimiter + per-endpoint limits + whitelist + Filter + 4 MockMvc tests.

---

## The Complete Rate Limiter Pattern

```java
// 1. Atomic counter with window:
public boolean isAllowed(String id, int limit) {
    long window = System.currentTimeMillis() / 60_000;  // minute bucket
    String key = "rate:" + id + ":" + window;
    Long count = redis.opsForValue().increment(key);
    if (count == 1) redis.expire(key, Duration.ofMinutes(2));  // ← ONCE only!
    return count <= limit;
}

// 2. Spring Filter:
@Override
public void doFilter(...) {
    if (!limiter.isAllowed(id, 100)) {
        response.setStatus(429);
        response.setHeader("Retry-After", secondsUntilReset);
        response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
        return;  // ← CRITICAL: stop here!
    }
    chain.doFilter(req, res);  // ← only reached if not rate-limited
}
```

---

## Key Structure Reference

```
rate : user   : U001          : 28543210   → user-level per minute
rate : ip     : 203.0.113.1  : 28543210   → IP-level per minute
rate : merchant: M001          : 28543210   → merchant per minute
rate : order  : U001          : 1718476842 → per-second order throttle
rate : global :                : 28543210   → total system per minute
sw   : U001                                → sliding window ZSet
```

---

## Review Checklist

- [ ] count==1 TTL: emphasized as CRITICAL — Ex 10 exposes the bug explicitly
- [ ] return after 429: called out in lesson, in exercises, in project tips
- [ ] Per-endpoint key anatomy: method + path for separate counters clearly shown
- [ ] Sliding window tradeoff: O(N) memory vs O(1) — both documented
- [ ] Retry-After: standard HTTP header — standard-compliant behavior tested

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T18.2 | T18.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~76 min | ~74 min | Stable |
| Word count | ~15K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 740 | 730 | Stable |

**Module 18 Progress**: 3/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 88 topics complete (51.8% of 170)

**Next**: Topic 18.4 — Redis Distributed Locks
