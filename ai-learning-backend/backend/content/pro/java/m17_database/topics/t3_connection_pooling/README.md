# Topic 17.3: Connection Pooling & Query Optimization

**Module**: M17 - Advanced Database Engineering
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T17.2 (N+1 Query Problem)

---

## What This Topic Teaches

1. HikariCP — Spring Boot's default connection pool
2. Pool size formula: `(core_count × 2) + effective_spindle_count`
3. `spring.datasource.hikari.maximum-pool-size=17` — max connections to DB
4. `spring.datasource.hikari.minimum-idle=4` — keep-warm connections
5. `spring.datasource.hikari.connection-timeout=2000` — fail fast (not 30s default!)
6. `spring.datasource.hikari.idle-timeout=300000` — close idle connections after 5min
7. `spring.datasource.hikari.max-lifetime=1200000` — must be < DB server wait_timeout
8. `spring.datasource.hikari.leak-detection-threshold=5000` — detect held connections
9. Pool exhaustion symptoms: `HikariPool - Connection is not available, timed out after Xms`
10. Actuator: `hikaricp.connections.pending > 0` → pool exhaustion alert
11. `EXPLAIN ANALYZE` — runs query + shows actual execution plan + timing
12. `Seq Scan` + `Rows Removed by Filter` → missing index on filter columns
13. `Index Scan using idx_name` → index being used, heap access still needed
14. `Index Only Scan` + `Heap Fetches: 0` → covering index, fastest possible
15. Composite index column order: highest cardinality (most selective) FIRST
16. Leftmost prefix rule: index(a,b,c) — query must include `a` to use the index
17. `INCLUDE(col1, col2)` — covering index: adds columns for Index Only Scan
18. `CREATE INDEX … WHERE condition` — partial index: smaller, faster for specific subset
19. `CREATE INDEX CONCURRENTLY` — zero-downtime index creation (no exclusive lock)
20. `log_min_duration_statement=100` — PostgreSQL slow query logging

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~7KB | Razorpay Pool Tuning & Optimization |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
100 req/s: fine. Diwali 800 req/s: 47 requests waiting for a connection, HTTP 504 errors. Plus the orders table full scan taking 10 seconds. Two lines of configuration + one index migration: back to 150ms.

### 📚 Teaching (4 Sub-sections)
1. **HikariCP configuration**: all key properties, pool sizing formula
2. **EXPLAIN ANALYZE**: reading output, Seq Scan vs Index Scan vs Index Only Scan
3. **Index strategies**: composite, covering, partial, expression, CONCURRENTLY
4. **Monitoring**: Actuator metrics, slow query logging, leak detection

### 🛠️ Worked Example: Razorpay Payment Service Optimization
HikariCP sized for 8-core SSD. 4 Flyway index migrations. EXPLAIN ANALYZE before/after showing 25,000× improvement.

### ⚠️ 3 Common Gaps
1. **pool_too_large** — 200 connections on 4-core DB = context switching hell
2. **wrong_index_column_order** — low-cardinality column first kills selectivity
3. **creating_index_without_concurrent** — exclusive lock blocks all writes for minutes

### 💪 15 Exercises (745 XP)
Key exercises:
- **Ex 5 (40 XP)**: Leftmost prefix rule — classify 7 queries against composite index
- **Ex 8 (60 XP)**: Design indexes for 5 trading platform query patterns
- **Ex 11 (65 XP)**: Covering index with INCLUDE for Index Only Scan
- **Ex 13 (75 XP)**: Full EXPLAIN ANALYZE cycle — before, migration, after, test
- **Ex 15 (95 XP)**: Complete Swiggy order search — pool + indexes + monitoring

### 🚀 Mini-Project: Razorpay Payment Pool Tuning
HikariCP prod config + 3 index migrations + EXPLAIN analysis doc + pool monitor + 4 @DataJpaTest tests.

---

## The Two Dials

```
PROBLEM: requests timing out under load
  hikaricp.connections.pending > 0?
  → Pool exhausted: increase maximum-pool-size (up to server formula)
  → Or fix slow queries so connections are held for less time

PROBLEM: individual query takes seconds
  EXPLAIN ANALYZE shows Seq Scan?
  → Missing index: identify filter columns → CREATE INDEX CONCURRENTLY

BOTH problems together (common):
  Slow query holds connection longer → other requests can't get connections
  Fix slow query first → pool exhaustion often resolves itself
```

---

## Pool Sizing Reference

| Server | Formula | Recommended |
|--------|---------|-------------|
| 4-core, SSD | (4×2)+1 | 9 |
| 8-core, SSD | (8×2)+1 | 17 |
| 16-core, SSD | (16×2)+1 | 33 |
| 8-core, 4-disk RAID | (8×2)+4 | 20 |

---

## EXPLAIN ANALYZE Quick Reference

```
Seq Scan + Rows Removed > N-1000    → missing index, add CREATE INDEX
Index Scan                           → index used, good
Index Only Scan + Heap Fetches: 0   → covering index, best possible
Execution Time > 100ms (indexed)    → index column order issue or stats outdated
Sort (expensive)                    → add index with ORDER BY direction matching
```

---

## Review Checklist

- [ ] Pool sizing formula: clearly derived (not just "set to 20")
- [ ] connection-timeout=2000: emphasized over the 30000ms default
- [ ] CONCURRENTLY: must be outside transaction; Flyway mixed=true note
- [ ] Ex 5: leftmost prefix analysis covers all 7 query patterns correctly
- [ ] Ex 11: INCLUDE vs key columns distinction — clearly explained

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T17.2 | T17.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~72 min | ~72 min | Stable |
| Word count | ~15K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 740 | 745 | Stable |

**Module 17 Progress**: 3/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 83 topics complete (48.8% of 170)

**Next**: Topic 17.4 — JPA Advanced Relationships
