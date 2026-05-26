# Topic 17.2: The N+1 Query Problem

**Module**: M17 - Advanced Database Engineering
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T17.1 (PostgreSQL & Flyway), T13.3 (Spring Data JPA)

---

## What This Topic Teaches

1. The N+1 query problem — what it is and why it happens
2. `FetchType.LAZY` (correct default) vs `FetchType.EAGER` (almost always wrong)
3. Detecting N+1 in logs via `spring.jpa.show-sql=true`
4. Detecting N+1 in tests: `SessionFactory.getStatistics().getPreparedStatementCount()`
5. **Fix 1**: `@Query("SELECT o FROM Order o JOIN FETCH o.user")` — JPQL JOIN FETCH
6. **Fix 2**: `@EntityGraph(attributePaths={"user", "restaurant"})` — no JPQL needed
7. **Fix 3**: `@BatchSize(size=N)` on `@OneToMany` collections
8. **Fix 4**: DTO projection — `SELECT new Dto(t.field, t.user.name) FROM Trade t`
9. `SELECT DISTINCT r FROM Restaurant r JOIN FETCH r.orders` — for `@OneToMany` deduplication
10. NEVER: `JOIN FETCH` on `@OneToMany` + `Pageable` → HHH90003004 (in-memory pagination)
11. `testEm.clear()` — evicts L1 cache before query count assertion
12. `sf.getStatistics().setStatisticsEnabled(true)` + `.clear()` before test query
13. `@NamedEntityGraph` + `@NamedAttributeNode` on `@Entity` for reusable graphs
14. `@EntityGraph("Order.withDetails")` in repository referencing named graph
15. `@BatchSize` + `Pageable`: safe combination (no in-memory pagination warning)
16. 2-step pagination: find IDs paginated → `JOIN FETCH WHERE id IN :ids`
17. Interface projection: `interface TradeView { String getSymbol(); }`
18. Class-based DTO JPQL: `new com.pkg.Dto(t.field, t.user.name)`
19. Rule: read-only API → DTO projection; modify entities → JOIN FETCH
20. N+1 test must call `testEm.clear()` or L1 cache hides the bug

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Flipkart Order Dashboard N+1 Fix |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
10 orders in dev → 30ms. 50,000 orders in production → 30 seconds. 100,001 database round trips for one HTTP request. Three lines of JPQL fix it → 120ms.

### 📚 Teaching (4 Sub-sections)
1. **Why N+1 happens**: lazy loading + association access in loop
2. **Detection**: show-sql=true + Hibernate statistics
3. **Fix 1**: JOIN FETCH — the most reliable, JPQL-based
4. **Fix 2**: @EntityGraph — annotation-based, no JPQL
5. **Fix 3 & 4**: @BatchSize for collections + DTO projections

### 🛠️ Worked Example: Swiggy Order Dashboard N+1
Order → lazy User + lazy Restaurant. N+1 demonstrated in logs. JOIN FETCH fix applied. @DataJpaTest with Hibernate statistics verifies query count == 1.

### ⚠️ 3 Common Gaps
1. **using_eager_as_fix** — EAGER doesn't prevent N+1; makes every query slower
2. **join_fetch_with_pagination** — @OneToMany + JOIN FETCH + Pageable → in-memory load
3. **forgetting_cache_clear_in_tests** — L1 cache hides N+1; testEm.clear() is mandatory

### 💪 15 Exercises (740 XP)
Key exercises:
- **Ex 10 (40 XP)**: L1 cache hides N+1 — predict why test passes incorrectly
- **Ex 11 (65 XP)**: @NamedEntityGraph on entity, reused in repository
- **Ex 12 (65 XP)**: Interface and class-based DTO projections
- **Ex 13 (75 XP)**: Full Swiggy order service — N+1 fix + 3 tests all passing
- **Ex 14 (70 XP)**: JOIN FETCH + pagination problem + 2 fix approaches
- **Ex 15 (95 XP)**: Full Zerodha portfolio service — multiple association types

### 🚀 Mini-Project: Flipkart Order Dashboard N+1 Fix
N+1 documented → 3 fix approaches implemented → 4 @DataJpaTest query count assertions all passing.

---

## The Decision Matrix

| Association type | Load when | Fix |
|-----------------|-----------|-----|
| @ManyToOne, always needed | Loading parent | JOIN FETCH |
| @ManyToOne, sometimes needed | Specific endpoints | @EntityGraph |
| @OneToMany, small, always | Loading parent | JOIN FETCH DISTINCT (no Pageable!) |
| @OneToMany, large, sometimes | Specific access | @BatchSize |
| @OneToMany + Pageable | Paged parent | @BatchSize OR 2-step query |
| Read-only response | Any | DTO projection |

---

## The Test Pattern

```java
@DataJpaTest @Import(OrderService.class)
class OrderServiceTest {
    @Autowired OrderService service;
    @Autowired TestEntityManager testEm;
    @Autowired EntityManager em;
    
    @BeforeEach void seed() {
        // ... save entities ...
        testEm.clear();  // ← MANDATORY: evict L1 cache
    }
    
    @Test void exactlyOneQuery() {
        SessionFactory sf = em.getEntityManagerFactory().unwrap(SessionFactory.class);
        sf.getStatistics().setStatisticsEnabled(true);
        sf.getStatistics().clear();  // ← reset counter
        
        service.getAllOrders();      // ← action under test
        
        assertEquals(1, sf.getStatistics().getPreparedStatementCount());
    }
}
```

---

## Review Checklist

- [ ] testEm.clear() mandatory: explicitly emphasized with explanation
- [ ] EAGER vs JOIN FETCH: clearly contrasted (EAGER = global, JOIN FETCH = per-query)
- [ ] JOIN FETCH + Pageable @OneToMany: HHH90003004 warning covered
- [ ] Ex 10: L1 cache hiding N+1 — the most subtle and important concept
- [ ] DTO projection JPQL: fully qualified class name in `new Dto(...)`

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T17.1 | T17.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~72 min | Stable |
| Word count | ~14K | ~15K | Higher (complex) |
| Exercises | 15 | 15 | Consistent |
| XP available | 730 | 740 | Stable |

**Module 17 Progress**: 2/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 82 topics complete (48.2% of 170)

**Next**: Topic 17.3 — Connection Pooling & Query Optimization
