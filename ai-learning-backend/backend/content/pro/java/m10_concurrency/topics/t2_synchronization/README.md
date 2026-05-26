# Topic 10.2: Synchronization

**Module**: M10 - Concurrency and Threads
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T10.1 (Thread Basics)

---

## What This Topic Teaches

1. Race condition — what it is, why it happens, how to demonstrate it
2. `counter++` is not atomic — READ-ADD-WRITE, three operations
3. `synchronized` method — acquires the object's intrinsic lock
4. `synchronized` block — finer-grained locking on any object
5. Intrinsic locks — per-object, reentrant
6. `volatile` keyword — visibility guarantee (not atomicity)
7. Atomicity vs visibility — two separate problems
8. Deadlock — circular lock acquisition; prevention via lock ordering
9. Thread-safe design patterns: safe counter, safe bank account, safe cache

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~7KB | Layered Banking System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
10 threads × 1000 increments = expected 10,000. Actual: ~8,700 (different every run). `counter++` is three operations. Race condition explained step-by-step.

### 📚 Teaching (6 Sub-sections)
1. **Race condition demo**: thread interleaving causing lost updates
2. **synchronized method**: lock on object, one thread at a time
3. **synchronized block**: minimum critical section, dedicated lock objects
4. **Intrinsic locks**: per-object, reentrant
5. **volatile**: visibility vs atomicity — two different problems
6. **Deadlock**: circular waiting; consistent lock ordering as prevention

### 🛠️ Worked Example: Thread-Safe BankAccount
Unsafe version (lost deposits/withdrawals), fixed with synchronized. withdraw() returns boolean (not exception) for concurrent-safe check-then-act.

### 🏢 3 Industry Examples
- Flipkart inventory — overselling prevention with synchronized checkout
- Razorpay — atomic debit/credit with synchronized ledger updates
- Web server session state — mutable singleton state needs synchronization

### ⚠️ 3 Critical Gaps
1. **volatile for compound ops** — `volatile counter++` still races!
2. **synchronizing different objects** — mutual exclusion requires SAME object
3. **partial synchronization** — must protect BOTH reads AND writes

### 💪 15 Exercises (760 XP)
- **Ex 3**: Show unsafe then fixed — side-by-side comparison
- **Ex 8 (55 XP)**: volatile vs synchronized — explicit demonstration
- **Ex 10 (55 XP)**: Deadlock with join(timeout) detection
- **Ex 11 (65 XP)**: Inventory — synchronized check-then-decrement
- **Ex 13 (80 XP)**: BoundedQueue with wait/notifyAll
- **Ex 14 (70 XP)**: Fix existing race conditions (code audit)
- **Ex 15 (95 XP)**: Thread-safe LRU cache

### 🚀 Mini-Project: Layered Banking System
Concurrent deposits, withdrawals, and transfers. atomic transfer() — deduct AND credit in one synchronized operation. volatile systemOpen flag. TransactionLog. Money conservation invariant.

---

## The Core Mental Model

```
Without sync:                    With synchronized:
─────────────────────────────    ────────────────────────────────
Thread A: READ count=5           Thread A: acquire lock
Thread B: READ count=5           Thread A: READ count=5
Thread A: ADD → 6               Thread A: ADD → 6
Thread A: WRITE count=6          Thread A: WRITE count=6
Thread B: ADD → 6               Thread A: release lock
Thread B: WRITE count=6          Thread B: acquire lock (was waiting)
Result: 6 (lost one!)            Thread B: READ count=6
                                 Thread B: ADD → 7
                                 Thread B: WRITE count=7
                                 Thread B: release lock
                                 Result: 7 (correct!)
```

---

## Review Checklist

- [ ] Race condition demonstrated with actual wrong output
- [ ] volatile for flags (correct), volatile for counters (wrong) — both shown
- [ ] Deadlock section: both threads named clearly in the circular wait
- [ ] Ex 9 (predict_output): clarify that A/B stay adjacent but pair order varies
- [ ] Ex 13 BoundedQueue: `while` not `if` for wait() — spurious wakeups
- [ ] Project: transfer() atomic deduct+credit without deadlock risk

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T10.1 | T10.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~70 min | Stable |
| Word count | ~13K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 675 | 760 | Up (harder topic) |

**Module 10 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 49 topics complete (28.8% of 170)

**Next**: Topic 10.3 — ExecutorService (thread pools, Future<T>)
