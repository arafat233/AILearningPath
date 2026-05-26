# Topic 18.4: Redis Distributed Locks

**Module**: M18 - Redis Caching & Rate Limiting
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T18.3 (Redis Rate Limiting)

---

## What This Topic Teaches

1. Distributed lock problem: @Scheduled runs on ALL instances simultaneously
2. `setIfAbsent(key, value, duration)` → atomic `SET NX EX` (one winner)
3. **Always use 3-argument version** — no-TTL version creates permanent lock on crash
4. UUID lock value: proves ownership; prevents wrong instance releasing the lock
5. `release(key, uuid)`: GET → compare → DEL — only delete if value matches
6. `try-finally` for release: **always** releases even on exception
7. Date/period in lock key: `"lock:settlement:" + LocalDate.now()` — natural single-use
8. Lock TTL = 3× expected duration — buffer for slow operations
9. `runOnce(key, ttl, Runnable)`: convenience wrapper for the acquire→run→release pattern
10. @Scheduled deduplication: check lock, skip if held by another instance
11. Idempotency key: client-provided unique key for at-most-once processing
12. 3-state idempotency: CACHED (return), IN_PROGRESS (409), NOT_STARTED (process)
13. Cache result with LONG TTL (24h); DON'T cache failures (allow clean retry)
14. Double-check after acquiring idempotency lock (another thread may have completed)
15. Leader election: single instance holds 'lock:leader' and renews before TTL expires
16. Lua script: atomic `if GET==value then DEL end` — no race between GET and DEL
17. `DefaultRedisScript<Long>`: Spring wrapper for Lua scripts
18. Lock key without TTL → permanent deadlock on crash (`TTL lock:key → -1` in redis-cli)
19. Value check before release: prevents deleting another instance's lock after TTL expiry
20. `log.info` on skip: visibility for debugging which instance ran vs skipped

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~20KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Settlement Engine |
| `README.md` | This file |

---

## The Complete Lock Pattern

```java
// Acquire:
String lockValue = UUID.randomUUID().toString();
Boolean acquired = redis.opsForValue()
    .setIfAbsent(lockKey, lockValue, Duration.ofMinutes(15));  // 3-arg: atomic!

if (!Boolean.TRUE.equals(acquired)) {
    log.info("Skipped — already running elsewhere");
    return;
}

// Execute:
try {
    runCriticalTask();
} finally {
    // Release with ownership check:
    String current = redis.opsForValue().get(lockKey);
    if (lockValue.equals(current)) {
        redis.delete(lockKey);
    }
}
```

### TTL design rule

```
TTL = 3× expected duration, within recovery window

Settlement takes 5 min → TTL = 15 min  ✓
Report takes 45 min → TTL = 2 hours    ✓
Too short (TTL=4min, job=5min): lock expires → duplicate run!
Too long (TTL=24h, crash): no retry until next day!
```

---

## Review Checklist

- [ ] 3-argument setIfAbsent: emphasized over 2-argument (TTL is mandatory)
- [ ] UUID vs static value: Ex 10 (no-TTL bug) + Ex 1 (race condition) both cover
- [ ] try-finally: shown in every implementation — non-negotiable pattern
- [ ] Idempotency 3 states: CACHED/IN_PROGRESS/NOT_STARTED all tested
- [ ] Failure doesn't cache: on exception, delete lock NOT result — allow retry

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

**Module 18 Progress**: 4/5 topics complete

**Course Progress**: 89 topics complete (52.4% of 170)

**Next**: Topic 18.5 — Redis Pub/Sub (Module 18 Final)
