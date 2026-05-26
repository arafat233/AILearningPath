# Topic 10.1: Thread Basics

**Module**: M10 - Concurrency and Threads
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T4.1 (OOP), T5.4 (Interfaces), T8.1 (Lambdas)

---

## 🚀 Module 10 Begins — Writing Concurrent Java

Modules 1-9 wrote sequential code. Module 10 introduces concurrent execution — code that does multiple things simultaneously.

---

## What This Topic Teaches

1. Thread vs Process — what each is, what they share
2. Three thread creation methods: extend Thread, implement Runnable, lambda
3. `start()` vs `run()` — **the most critical threading distinction**
4. Non-deterministic execution — thread order is unpredictable
5. `Thread.sleep(ms)` — pause current thread; InterruptedException handling
6. `thread.join()` — wait for a thread to complete
7. Start-all-then-join-all pattern for true concurrency
8. Thread naming, priority, and daemon threads
9. Thread lifecycle states: NEW → RUNNABLE → WAITING → TERMINATED

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~36KB | 15 exercises |
| `project.json` | ~7KB | Restaurant Kitchen concurrent simulation |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Sequential restaurant order: 600ms. Concurrent: 300ms (limited by slowest task). Threads are how every production system handles load.

### 📚 Teaching (7 Sub-sections)
1. **Thread vs Process**: shared heap, own stack
2. **Three creation methods**: extend, Runnable, lambda
3. **start() vs run()**: THE critical distinction — run() is not a thread
4. **Non-determinism**: scheduler decides order; runs differ each time
5. **sleep() and join()**: controlling time and coordination
6. **Thread lifecycle**: NEW, RUNNABLE, TIMED_WAITING, TERMINATED states
7. **Naming, priority, daemon**: metadata and background threads

### 🛠️ Worked Example: Restaurant Kitchen
Three kitchen stations (Appetizer/Main/Dessert) as threads. All start simultaneously. join() waits for all. ~1000ms not ~1800ms sequential.

### 🏢 3 Industry Examples
- Tomcat/Spring Boot — every HTTP request on its own thread
- Android — background threads for network/DB, results back to UI thread
- Zerodha — market data on one thread, processing on others

### ⚠️ 3 Critical Gaps
1. **run() instead of start()** — the #1 beginner mistake; no thread created
2. **Swallowing InterruptedException** — must restore interrupt flag
3. **start/join/start/join pattern** — sequential, not concurrent; start all THEN join all

### 💪 15 Exercises (675 XP)
- **Ex 1**: start() vs run() — the critical distinction traced
- **Ex 5**: sleep + timing — B always finishes before A
- **Ex 7 (50 XP)**: Sequential vs parallel timing measurement
- **Ex 11 (60 XP)**: Parallel file processor with 5 threads
- **Ex 13 (75 XP)**: Thread pool simulation — 3 workers, 8 tasks
- **Ex 15 (95 XP)**: Parallel search with `volatile boolean` early termination

### 🚀 Mini-Project: Restaurant Kitchen
4 concurrent cooking stations per order, 3 orders total. Named threads, join() synchronization, timing verification. Bonus: daemon head-chef thread, bottleneck tracking, concurrent orders.

---

## The Two Rules of Basic Threading

```
Rule 1: ALWAYS call start() — never run()
Rule 2: Start ALL threads THEN join ALL
         ✓  t1.start(); t2.start(); t3.start(); t1.join(); t2.join(); t3.join();
         ✗  t1.start(); t1.join(); t2.start(); t2.join();  ← sequential!
```

---

## Review Checklist

- [ ] start() vs run() — explicitly shown with thread name output
- [ ] InterruptedException handling — Thread.currentThread().interrupt() pattern
- [ ] Non-determinism explicitly demonstrated (Ex 9)
- [ ] join() timeout (Ex 12) — shows TIMED_WAITING state
- [ ] Ex 15 uses `volatile` (preview of Topic 10.2) — note as preview

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M9 avg | T10.1 | Note |
|--------|--------|-------|------|
| Generation time | ~67 min | ~65 min | Stable |
| Word count | ~13.6K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 721 | 675 | Slightly lower — foundational topic |

**Module 10 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 48 topics complete (28.2% of 170)

**Next**: Topic 10.2 — Synchronization (race conditions, synchronized, volatile)
