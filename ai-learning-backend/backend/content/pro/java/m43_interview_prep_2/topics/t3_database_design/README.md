# Topic 3: Database Design — Schema, Indexing, Pagination

**Module**: M43 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- 3NF normalization: no transitive dependencies; denormalize intentionally for reads
- Index selectivity: high selectivity (unique) → B-tree; range queries → covering index
- N+1 problem: use JOINs or batch loading; never loop queries in ORM
- Cursor-based pagination: stable under concurrent inserts; offset breaks when rows added
- Connection pooling: HikariCP max-pool-size = (CPU cores × 2) + disk spindles
- EXPLAIN ANALYZE: always check query plan before adding index

## Files: topic.json, exercises.json, project.json, README.md
