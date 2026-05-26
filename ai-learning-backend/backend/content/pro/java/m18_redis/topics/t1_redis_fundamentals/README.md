# Topic 18.1: Redis Fundamentals & Spring Cache

**Module**: M18 - Redis Caching & Rate Limiting
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T17.3 (Connection Pooling & Query Optimization)

---

## 🆕 Module 18 Begins — Caching & Performance at Scale

Module 17 built production-safe databases. Module 18 adds the layer in front: Redis. When you've optimized your PostgreSQL queries with indexes and fixed N+1 — but the same data is still queried thousands of times per second — Redis provides the answer.

---

## What This Topic Teaches

1. Redis: in-memory data store, microsecond reads, TTL on every key
2. Redis use cases: cache, session, rate limiting, distributed lock, pub/sub
3. `docker compose up` with `redis:7-alpine`, `maxmemory`, `allkeys-lru`
4. `spring-boot-starter-data-redis` + `spring-boot-starter-cache` dependencies
5. `spring.data.redis.host=localhost`, `spring.data.redis.port=6379`
6. `spring.cache.type=redis` — tells Spring Boot to use Redis as cache provider
7. `@EnableCaching` — required on `@SpringBootApplication` or `@Configuration`
8. `@Cacheable(value, key)` — cache miss: call method; cache hit: skip method
9. `@CachePut(value, key)` — always call method + always update cache
10. `@CacheEvict(value, key)` — remove from cache after mutation
11. `@CacheEvict(allEntries=true)` — clear entire cache by name
12. `@Caching(evict={...})` — group multiple cache operations (no duplicate annotations)
13. SpEL cache keys: `#param`, `#result.field`, `'literal'`, `#a + ':' + #b`
14. `unless="#result.isEmpty()"` — don't cache empty results
15. `condition="#id.length() > 0"` — skip cache for certain inputs
16. `RedisCacheManager` with `withInitialCacheConfigurations` per-cache TTL
17. `GenericJackson2JsonRedisSerializer` — stores values as human-readable JSON
18. `disableCachingNullValues()` — never cache null returns
19. Self-invocation bypass: `this.method()` skips AOP proxy — cache doesn't work
20. `CacheManager.getCache(name).put/evict/clear` — programmatic cache access

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~7KB | Swiggy Restaurant Discovery Cache |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
5,000 restaurant list requests/second. Same data. Each hitting PostgreSQL. Redis caches the list for 5 minutes → 99% cache hit rate → DB goes from 5,000 req/s to ~3 req/s (one per city per 5 min).

### 📚 Teaching (4 Sub-sections)
1. **Redis overview**: what it is, data structures, Docker setup
2. **Spring Cache configuration**: dependencies, @EnableCaching, RedisCacheManager
3. **Cache annotations**: @Cacheable, @CachePut, @CacheEvict, @Caching
4. **TTL and key patterns**: per-cache TTLs, SpEL keys, Redis CLI verification

### 🛠️ Worked Example: Flipkart Product Caching
Products cached by ID (10min), categories (1hr), search (2min). @CacheEvict on update. `redis-cli KEYS` verification showing entries appear and disappear.

### ⚠️ 3 Common Gaps
1. **self_invocation_bypasses_cache** — `this.method()` skips AOP proxy silently
2. **missing_enable_caching** — annotations silently ignored without @EnableCaching
3. **caching_mutable_objects** — in-memory cache vs Redis deserialization behavior

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 8 (55 XP)**: Conditional caching with `unless` and `condition`
- **Ex 10 (40 XP)**: Self-invocation bypass — predict why cache doesn't work
- **Ex 11 (60 XP)**: Composite SpEL keys for multi-parameter searches
- **Ex 13 (70 XP)**: Direct RedisTemplate for session management
- **Ex 15 (95 XP)**: Complete Zerodha instrument cache system

### 🚀 Mini-Project: Swiggy Restaurant Discovery Cache
Redis Docker + CacheConfig (3 TTLs) + RestaurantService (@Cacheable + @CacheEvict) + CacheWarmup + 3 @SpringBootTest tests with @SpyBean.

---

## The Core Pattern

```java
@SpringBootApplication
@EnableCaching  // ← required!
public class Application { ... }

@Configuration
public class CacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config().entryTtl(Duration.ofMinutes(5)))
            .withInitialCacheConfigurations(Map.of(
                "products", config().entryTtl(Duration.ofMinutes(10)),
                "prices",   config().entryTtl(Duration.ofSeconds(30))
            )).build();
    }
}

@Service
public class ProductService {
    @Cacheable(value="products", key="#id")       // read cache
    public Product findById(String id) { ... }

    @CacheEvict(value="products", key="#product.id")  // invalidate on write
    public Product update(Product product) { ... }
}
```

---

## TTL Reference

| Data type | TTL | Rationale |
|-----------|-----|-----------|
| Stock prices | 5-30 seconds | Changes every tick |
| Cart/session | 15-30 minutes | Short user session |
| Product details | 10-30 minutes | Changes occasionally |
| Restaurant menu | 5-15 minutes | Updated regularly |
| City/category list | 1-24 hours | Almost static |
| Instrument metadata | 6-24 hours | Regulatory changes only |

---

## Review Checklist

- [ ] Self-invocation bypass: Ex 10 must clearly explain the AOP proxy mechanism
- [ ] @EnableCaching: emphasized as "must have" — easy to forget, no error message
- [ ] TTL advice: "never use no-expiry (Duration.ZERO) for application data"
- [ ] Ex 8: `condition` vs `unless` difference explained — timing matters
- [ ] SpEL string literals: `key="'all'"` (single quotes inside double) explained

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M17 avg | T18.1 | Trend |
|--------|---------|-------|-------|
| Generation time | ~74 min | ~75 min | Stable |
| Word count | ~15K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 737 | 720 | Stable |

**Module 18 Progress**: 1/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 86 topics complete (50.6% of 170)

**Next**: Topic 18.2 — Cache-Aside Pattern & Advanced Redis Strategies
