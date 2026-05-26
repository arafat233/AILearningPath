# Topic 18.2: Cache-Aside Pattern & Advanced Strategies

**Module**: M18 - Redis Caching & Rate Limiting
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T18.1 (Redis Fundamentals & Spring Cache)

---

## What This Topic Teaches

1. Cache-aside pattern: check cache → miss → query DB → store → return
2. Write-through: update DB AND cache simultaneously (always fresh)
3. Null-object pattern: cache `__NULL__` sentinel for 'not found' (SHORT TTL!)
4. `redisTemplate.opsForValue().get(key)` — GET
5. `redisTemplate.opsForValue().set(key, value, duration)` — SET key EX seconds
6. `redisTemplate.opsForValue().setIfAbsent(key, value, duration)` — SETNX + EX (atomic)
7. Cache stampede / thundering herd: all concurrent requests miss simultaneously
8. Mutex fix: `setIfAbsent` acquires a lock; only one thread rebuilds the cache
9. Double-check after acquiring lock: another thread may have filled cache while waiting
10. `try-finally` for lock release: ALWAYS release, even on exception
11. Redis Hash: `opsForHash().putAll(key, map)` → HSET multiple fields
12. `opsForHash().put(key, field, value)` → HSET single field (partial update)
13. `opsForHash().get(key, field)` → HGET single field
14. `opsForHash().entries(key)` → HGETALL all fields
15. Redis Sorted Set: `opsForZSet().incrementScore(key, member, delta)` → ZINCRBY
16. `opsForZSet().reverseRank(key, member)` → ZREVRANK (0 = highest scorer)
17. `opsForZSet().reverseRange(key, 0, n-1)` → ZREVRANGE top N
18. `opsForZSet().reverseRangeWithScores(key, 0, n-1)` → ZREVRANGE WITHSCORES
19. Redis List: `opsForList().leftPush(key, value)` + `.trim(key, 0, MAX-1)` → O(1) bounded queue
20. Multi-level cache: Caffeine L1 (JVM, 1ms) → Redis L2 (0.3ms) → DB (15ms)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Trader Hub |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Flipkart midnight sale: 50,000 users hit an expired cache key simultaneously. All 50,000 query PostgreSQL. Pool of 20 connections → 49,980 queue → 503 errors. One SETNX mutex: only 1 DB query.

### 📚 Teaching (4 Sub-sections)
1. **Cache-aside manual**: RedisTemplate get/set, write-through, null-object pattern
2. **Redis Hash**: structured data, partial field updates — HSET/HGET
3. **Redis Sorted Set**: leaderboard operations — ZINCRBY/ZREVRANK/ZREVRANGE
4. **Cache stampede**: problem explanation + SETNX mutex + double-check pattern

### 🛠️ Worked Example: Zerodha Trader Leaderboard
Real-time P&L leaderboard with Sorted Set. InstrumentCache with null-sentinel. Stampede-safe using setIfAbsent mutex with try-finally lock release.

### ⚠️ 3 Common Gaps
1. **stampede_without_double_check** — acquiring lock but not re-checking cache (wastes DB queries)
2. **sorted_set_wrong_direction** — ZRANK returns lowest scorer as #1; need ZREVRANK
3. **null_sentinel_wrong_ttl** — null sentinel with same long TTL as real data

### 💪 15 Exercises (740 XP)
Key exercises:
- **Ex 7 (55 XP)**: Mutex stampede prevention — full implementation
- **Ex 9 (60 XP)**: Leaderboard with daily reset and rank retrieval
- **Ex 11 (60 XP)**: Background cache refresh before TTL expires
- **Ex 13 (65 XP)**: Redis List bounded activity feed
- **Ex 15 (95 XP)**: Complete Zerodha cache hub — all patterns combined

### 🚀 Mini-Project: Zerodha Trader Hub
Leaderboard + instrument cache + session Hash + stampede-safe market status. 4 integration tests all passing.

---

## The Pattern Reference

```java
// CACHE-ASIDE (manual):
Object cached = redis.opsForValue().get(key);
if (cached != null) return cached;           // HIT
Object fresh = db.findById(id);
redis.opsForValue().set(key, fresh, TTL);    // store
return fresh;                                 // MISS → now cached

// NULL-OBJECT PATTERN:
if ("__NONE__".equals(cached)) return empty; // cached miss (SHORT TTL!)
if (cached != null) return cached;           // real hit
// ...query DB → if empty: set __NONE__ with 1-5 min TTL

// STAMPEDE MUTEX:
Boolean lock = redis.opsForValue().setIfAbsent(lockKey, "1", 10s);
if (lock) {
    try {
        Object recheck = redis.opsForValue().get(key);  // double-check!
        if (recheck != null) return recheck;
        // ...build cache...
    } finally {
        redis.delete(lockKey);  // ALWAYS release
    }
}

// SORTED SET LEADERBOARD:
redis.opsForZSet().incrementScore(board, traderId, pnl);  // ZINCRBY
redis.opsForZSet().reverseRank(board, traderId);           // ZREVRANK (0=best)
redis.opsForZSet().reverseRange(board, 0, n-1);            // ZREVRANGE top N

// REDIS HASH:
redis.opsForHash().putAll(key, fields);          // HSET all fields
redis.opsForHash().put(key, "city", "Mumbai");   // HSET single field
redis.opsForHash().get(key, "plan");             // HGET single field
```

---

## Review Checklist

- [ ] Double-check after mutex: explained why it's necessary with example
- [ ] reverseRank + 1: 0-indexed → 1-indexed for display, clear in exercises
- [ ] Null sentinel TTL: prominently shorter than real TTL with explanation
- [ ] Ex 7: try-finally lock release — critical safety explained
- [ ] Multi-level cache note: L1 per-instance invalidation problem + pub/sub solution teaser

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T18.1 | T18.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~75 min | ~76 min | Stable |
| Word count | ~15K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 720 | 740 | Stable |

**Module 18 Progress**: 2/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 87 topics complete (51.2% of 170)

**Next**: Topic 18.3 — Redis Rate Limiting
