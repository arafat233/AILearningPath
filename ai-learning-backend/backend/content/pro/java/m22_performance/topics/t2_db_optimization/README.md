# Topic 22.2: Database Query Optimization

**Module**: M22 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 22 Progress**: 2/5 | **Course Progress**: 107 topics (62.9%)

## Key Concepts
- `EXPLAIN ANALYZE`: `Seq Scan` + high `Rows Removed by Filter` = missing index
- Composite index column order: **equality first, range last** — always
- `CREATE INDEX CONCURRENTLY`: no table lock; mandatory in production
- `PARTIAL INDEX` (`WHERE status='PENDING'`): only index the subset you query
- `COVERING INDEX` (`INCLUDE (col1, col2)`): enables Index Only Scan
- `@QueryHint(HINT_READONLY, "true")`: skip Hibernate dirty checking for reads
- `JOIN FETCH` in JPQL: 1 SQL query instead of N+1 lazy loads
- `Statistics.getQueryExecutionCount()`: verify no N+1 in tests
- Keyset pagination: `WHERE id > :lastId ORDER BY id`: O(log n) vs OFFSET O(n)
- `pg_stat_statements`: find slowest queries automatically by `mean_exec_time`
- `hibernate.jdbc.batch_size: 50`: batch INSERTs for bulk operations
- Read replica routing: `AbstractRoutingDataSource` + `@Transactional(readOnly=true)`

## Files: topic.json (~16KB), exercises.json (~32KB), project.json (~3KB), README.md
