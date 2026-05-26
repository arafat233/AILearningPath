# Topic 17.5: Database Transactions & Locking

**Module**: M17 - Advanced Database Engineering
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T17.4 (JPA Advanced Relationships)

---

## What This Topic Teaches

1. Lost update: concurrent transactions overwrite each other's changes
2. `@Version int version` — Hibernate adds `AND version=?` to every UPDATE
3. Optimistic lock conflict: 0 rows updated → `ObjectOptimisticLockingFailureException`
4. `@Retryable(value=ObjectOptimisticLockingFailureException.class, maxAttempts=3)` — Spring Retry
5. `@Backoff(delay=50, multiplier=2.0)` — exponential backoff to reduce thundering herd
6. `@Recover` — called after all retries exhausted
7. `@Lock(LockModeType.PESSIMISTIC_WRITE)` → `SELECT ... FOR UPDATE` in SQL
8. `@Lock(LockModeType.PESSIMISTIC_READ)` → `SELECT ... FOR SHARE`
9. Pessimistic lock scope: held until `@Transactional` method commits
10. `@QueryHint(name="jakarta.persistence.lock.timeout", value="3000")` — fail after 3s
11. `LockTimeoutException` — thrown when pessimistic lock wait exceeds timeout
12. Optimistic: no blocking, retry on conflict — best for low contention
13. Pessimistic: blocks concurrent writers — best for high contention
14. Deadlock: circular lock wait; prevention: always acquire locks in consistent order
15. Isolation levels: READ_COMMITTED (PostgreSQL default), REPEATABLE_READ, SERIALIZABLE
16. Dirty read (prevented by READ_COMMITTED), non-repeatable read, phantom read
17. `Propagation.REQUIRED` (default): join existing or create new transaction
18. `Propagation.REQUIRES_NEW`: always new transaction, commits independently
19. `@Transactional(rollbackFor = Exception.class)` — rollback on checked exceptions too
20. Default: `@Transactional` only rolls back `RuntimeException` and `Error`

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~44KB | 15 exercises |
| `project.json` | ~7KB | BookMyShow Ticket Booking |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
1,000 concert tickets. 5,000 users click simultaneously. Without locking: 2,000 bookings for 1,000 seats. With @Version: conflict detected → retry or sold-out. With pessimistic lock: serialized queue.

### 📚 Teaching (4 Sub-sections)
1. **Isolation levels**: dirty read, non-repeatable read, phantom read — what each level prevents
2. **Optimistic locking**: @Version, conflict detection, @Retryable
3. **Pessimistic locking**: @Lock, SELECT FOR UPDATE, timeout
4. **Transaction propagation**: REQUIRED vs REQUIRES_NEW, rollbackFor

### 🛠️ Worked Example: Zerodha Trade Position
PortfolioPosition with @Version. Two concurrent trades update same position. @Retryable catches conflict, re-reads fresh version, retries successfully. Test verifies version increments.

### ⚠️ 3 Common Gaps
1. **optimistic_lock_not_retried** — returning 'error' on conflict instead of retrying
2. **pessimistic_lock_without_transaction** — lock acquired and immediately released
3. **transactional_no_rollback_for_checked** — IOException saves to DB, no rollback

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 8 (60 XP)**: REQUIRES_NEW audit that survives outer transaction rollback — 2 tests
- **Ex 9 (55 XP)**: rollbackFor gap — 2 tests proving the default behavior
- **Ex 12 (65 XP)**: Zerodha position service — weighted avg price + version increment test
- **Ex 13 (75 XP)**: BookMyShow pessimistic seat booking — 3 tests all passing
- **Ex 14 (70 XP)**: Deadlock-safe transfer with consistent lock ordering
- **Ex 15 (95 XP)**: Complete Razorpay payment processor — 3 tests

### 🚀 Mini-Project: BookMyShow Ticket Booking
Event @Version + pessimistic lock option + AuditService REQUIRES_NEW + @Retryable + 5 @DataJpaTest tests.

---

## The Decision Framework

```
Is contention HIGH?
  HIGH (same hot row, many simultaneous writers)
    → Pessimistic: @Lock(PESSIMISTIC_WRITE)
    → Guaranteed serial execution, no wasted retries
    → Add timeout: @QueryHint lock.timeout=3000ms

  LOW (different rows, occasional conflict)
    → Optimistic: @Version
    → No blocking, occasional retry
    → @Retryable(maxAttempts=3, backoff=50ms)
```

```
Need audit/notification even if main transaction fails?
  → Propagation.REQUIRES_NEW
  → Independent commit, not affected by outer rollback

Method throws checked exceptions (IOException, etc.)?
  → @Transactional(rollbackFor=Exception.class)
  → Without it: checked exception = no rollback = partial commit!
```

---

## The @Version SQL

```sql
-- Hibernate generates this for every save on @Version entity:
UPDATE tickets
SET available = 9, version = 2
WHERE id = 1 AND version = 1;  ← optimistic check

-- If another thread already committed:
-- → version is now 2 in DB
-- → WHERE version=1 matches 0 rows
-- → ObjectOptimisticLockingFailureException → @Retryable
```

---

## Review Checklist

- [ ] @Retryable: catch BOTH ObjectOptimisticLockingFailureException AND OptimisticLockException
- [ ] Pessimistic lock must be in @Transactional method — emphasized with diagram
- [ ] rollbackFor gap: @DataJpaTest Ex 9 demonstrates default (no rollback on checked) vs fix
- [ ] Deadlock: Ex 14 consistent lock ordering — Math.min/max pattern explained
- [ ] @Recover: called after all retries exhausted — method signature matters

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T17.4 | T17.5 | Trend |
|--------|-------|-------|-------|
| Generation time | ~75 min | ~76 min | Stable |
| Word count | ~16K | ~16K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 735 | 735 | Stable |

**Module 17 Progress**: 5/5 topics complete ✅

---

## Production Stats

- **Files**: 4 (T17.5) → 20 total for M17
- **Course Progress**: 85 topics complete (50.0% of 170) 🎯

**Next**: MODULE_17_COMPLETE.md → Module 18: Redis Caching & Rate Limiting
