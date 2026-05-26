# Topic 14.3: Spring Cache with @Cacheable

**Module**: M14 - Advanced Spring Boot
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.3 (Spring Data JPA)

---

## What This Topic Teaches

1. `@EnableCaching` — activates Spring's caching abstraction
2. `@Cacheable("cacheName")` — cache return value; skip method on hit
3. `@Cacheable(value="name", key="#paramName")` — explicit cache key
4. SpEL key expressions: `#id`, `"'prefix:' + #category"`, `#result.id`
5. Default key: `SimpleKey.EMPTY` (no args), argument value (one arg)
6. `@CacheEvict(value, key)` — remove a specific entry
7. `@CacheEvict(value, allEntries=true)` — clear entire cache
8. `@CachePut(value, key)` — always run method AND update cache
9. `@Caching` — combine multiple @Cacheable/@CachePut/@CacheEvict
10. `condition` — only cache if SpEL condition is true (evaluated before)
11. `unless` — don't cache if SpEL condition is true (evaluated after, can use #result)
12. `CaffeineCacheManager` — production-grade cache with TTL, maxSize, stats
13. `Caffeine.newBuilder().maximumSize(N).expireAfterWrite(Duration)` — Caffeine config
14. `registerCustomCache(name, cache)` — per-cache configuration
15. `recordStats()` — enable hit/miss rate tracking
16. `cacheManager.getCache(name).get(key)` — verify cache in tests
17. `SimpleKey.EMPTY` — the default key for no-argument @Cacheable methods
18. Self-invocation trap — same as @Async and @Transactional

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Data Pipeline Caching Layer |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
500 req/s without cache = 500 DB queries/s. With @Cacheable = 1 query/5min. One annotation, 10× the throughput.

### 📚 Teaching (5 Sub-sections)
1. **@EnableCaching + @Cacheable**: activation, hit/miss flow, key expressions
2. **@CacheEvict + @CachePut**: when to use each, @Caching combination
3. **condition + unless**: conditional caching, #result access
4. **Caffeine config**: CaffeineCacheManager, TTL, maxSize, recordStats, per-cache
5. **Testing**: @BeforeEach clear, SimpleKey.EMPTY, assertNull/assertNotNull

### 🛠️ Worked Example: Flipkart Product Catalog Cache
Three @Cacheable methods (findAll, findById, findByCategory). @CachePut + @CacheEvict on save. @Caching on delete. 5-min TTL. @SpringBootTest verification.

### ⚠️ 3 Common Gaps
1. **cache_key_collision** — prefix keys per method to avoid cross-method collision
2. **caching_self_invocation** — same AOP proxy trap as @Async
3. **no_cache_evict_on_writes** — stale data served if writes don't evict

### 💪 15 Exercises (730 XP)
Key exercises:
- **Ex 9 (55 XP)**: @Caching combining put + evict
- **Ex 11 (65 XP)**: Zerodha-style stock price cache with dual TTLs
- **Ex 12 (65 XP)**: Verify cache with spy on repository
- **Ex 13 (75 XP)**: Full product CRUD with cache + 4 tests
- **Ex 15 (95 XP)**: Razorpay merchant config cache — production pattern

### 🚀 Mini-Project: Data Pipeline Caching Layer
Add Caffeine caching to the M13 product service. @Caching on save/delete. 5 @SpringBootTest tests. Performance assertion: 1000 calls < 1 second.

---

## The Caching Pattern

```java
// Read — cache by key:
@Cacheable(value = "products", key = "'id:' + #id")
public Optional<Product> findById(String id) { return repo.findById(id); }

// Write — update cache AND evict lists:
@Caching(
    put  = @CachePut(value = "products", key = "'id:' + #result.id"),
    evict = @CacheEvict(value = "products", allEntries = true)
)
public Product save(Product p) { return repo.save(p); }

// Delete — evict individual and list:
@Caching(evict = {
    @CacheEvict(value = "products", key = "'id:' + #id"),
    @CacheEvict(value = "products", allEntries = true)
})
public void delete(String id) { repo.deleteById(id); }
```

## Annotation Quick Reference

| Annotation | When to use | DB called? | Cache updated? |
|------------|-------------|------------|----------------|
| `@Cacheable` | Reads | Only on miss | On miss |
| `@CachePut` | Writes (update) | Always | Always |
| `@CacheEvict` | Deletes | Always | Removed |

---

## Review Checklist

- [ ] Self-invocation trap mentioned (same as @Async)
- [ ] Key collision anti-pattern shown — prefixes needed
- [ ] @CacheEvict(allEntries=true) after writes — stale data prevention
- [ ] Ex 10: CachePut = HIT next; CacheEvict = MISS next — correct
- [ ] Caffeine recordStats() — for production monitoring

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T14.2 | T14.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~65 min | Stable |
| Word count | ~14K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 720 | 730 | Stable |

**Module 14 Progress**: 3/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 68 topics complete (40.0% of 170)

**Next**: Topic 14.4 — @ConfigurationProperties and Profiles
