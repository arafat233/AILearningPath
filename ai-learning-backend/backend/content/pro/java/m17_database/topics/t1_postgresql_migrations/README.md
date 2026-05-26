# Topic 17.1: PostgreSQL & Flyway Migrations

**Module**: M17 - Advanced Database Engineering
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.3 (Spring Data JPA)

---

## 🆕 Module 17 Begins — Production Database Engineering

Modules 13-16 built the complete Spring Boot + Kafka stack. Module 17 goes deeper into the database layer — the foundation of every production service. Every real application uses PostgreSQL (not H2) with schema migrations (not ddl-auto=create-drop).

---

## What This Topic Teaches

1. H2 vs PostgreSQL — why H2 is only for development/testing
2. PostgreSQL via Docker Compose — local development setup
3. `docker-compose.yml` with named volumes for data persistence
4. `spring-kafka`, `postgresql` and `flyway-core` Maven dependencies
5. `spring.datasource.url=jdbc:postgresql://localhost:5432/dbname`
6. `spring.datasource.driver-class-name=org.postgresql.Driver`
7. `spring.jpa.hibernate.ddl-auto=validate` — with Flyway in production
8. `spring.flyway.enabled=true` — activates Flyway on startup
9. Flyway migration file naming: `V{version}__{description}.sql`
10. Versioned migrations (V): run once in order, tracked by checksum
11. Repeatable migrations (R): re-run when file content changes
12. `flyway_schema_history` — Flyway's tracking table
13. Never edit an applied migration — checksum mismatch → startup failure
14. `CREATE TABLE` with PRIMARY KEY, FOREIGN KEY, CHECK, UNIQUE, DEFAULT
15. `ALTER TABLE ... ADD COLUMN` — safe for existing data (use nullable or with DEFAULT)
16. Multi-step safe column rename: add new → backfill → drop old
17. Environment profiles: `application-local.properties`, `application-prod.properties`
18. `src/test/resources/application.properties` — H2, flyway=false for @DataJpaTest
19. `docker compose down` vs `docker compose down -v` — volume behavior
20. `gen_random_uuid()` — PostgreSQL built-in UUID generation

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Zerodha PostgreSQL Migration Setup |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
H2 + create-drop in production = all data deleted on every restart. PostgreSQL + Flyway = schema versioned in git, applied automatically on deploy, tracked in flyway_schema_history.

### 📚 Teaching (4 Sub-sections)
1. **PostgreSQL setup**: Docker Compose, dependencies, application.properties
2. **Flyway migrations**: naming, versioning, history table, checksum enforcement
3. **SQL migration examples**: CREATE TABLE, ALTER TABLE, indexes, constraints
4. **Environment configuration**: profiles, dev vs prod vs test

### 🛠️ Worked Example: Zerodha Trading Database
3 migration files (orders, trades, indexes) with Docker Compose PostgreSQL setup. Profile-based config shows local H2 vs prod PostgreSQL.

### ⚠️ 3 Common Gaps
1. **editing_applied_migration** — checksum mismatch blocks startup
2. **wrong_ddl_auto_in_prod** — create-drop deletes production data
3. **flyway_in_tests** — Connection refused to PostgreSQL during @DataJpaTest

### 💪 15 Exercises (730 XP)
Key exercises:
- **Ex 7 (55 XP)**: Multi-table migration set with FK dependencies
- **Ex 9 (60 XP)**: Data migration — backfill existing rows
- **Ex 12 (65 XP)**: Safe column rename (3-step zero-downtime)
- **Ex 13 (75 XP)**: @DataJpaTest with H2, PostgreSQL not needed
- **Ex 14 (70 XP)**: CI/CD migration verification test
- **Ex 15 (95 XP)**: Complete Zerodha trading database migration

### 🚀 Mini-Project: Zerodha PostgreSQL Migration Setup
4 Flyway migrations + Docker Compose + profile-based config + 3 @DataJpaTest tests passing with H2.

---

## The Core Pattern

```
Development:         Tests:              Production:
H2 in-memory         H2 in-memory        PostgreSQL
flyway.enabled=false flyway.enabled=false flyway.enabled=true
ddl-auto=create-drop ddl-auto=create-drop ddl-auto=validate

src/main/resources/application-local.properties
src/test/resources/application.properties
src/main/resources/application-prod.properties
```

```sql
-- Migration files in src/main/resources/db/migration/:
V1__create_orders_table.sql    ← runs on first deploy
V2__add_discount_column.sql    ← runs on second deploy
V3__create_items_table.sql     ← runs on third deploy

-- flyway_schema_history after deploy 3:
-- version=1, success=true
-- version=2, success=true
-- version=3, success=true
```

---

## Review Checklist

- [ ] gen_random_uuid() — PostgreSQL 13+ built-in, no uuid-ossp extension needed
- [ ] flyway-database-postgresql dependency: Spring Boot 3+ needs this alongside flyway-core
- [ ] Never edit applied migration: checksum mismatch → app won't start
- [ ] Test config: src/test/resources, NOT src/main/resources
- [ ] Ex 10: predict Flyway's exact behavior on edited migration — accurate and detailed

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T17.1 | Trend vs M16 avg |
|--------|-------|-----------------|
| Generation time | ~70 min | Stable |
| Word count | ~14K | Stable |
| Exercises | 15 | Consistent |
| XP available | 730 | Stable |

**Module 17 Progress**: 1/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 81 topics complete (47.6% of 170)

**Next**: Topic 17.2 — The N+1 Query Problem
