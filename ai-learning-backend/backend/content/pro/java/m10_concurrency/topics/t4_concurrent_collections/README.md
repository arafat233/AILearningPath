# Topic 10.4: Concurrent Collections and Atomic Types

**Module**: M10 - Concurrency and Threads
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T10.2 (Synchronization), T10.3 (ExecutorService), T6.2 (HashMap)

---

## What This Topic Teaches

1. Why regular HashMap/ArrayList fail under concurrency
2. `ConcurrentHashMap` — fine-grained bucket locking vs global lock
3. `map.merge(key, 1, Integer::sum)` — the atomic increment pattern
4. `computeIfAbsent` — atomic lazy initialization in a map
5. `CopyOnWriteArrayList` — lock-free reads, copy-on-write for rare writes
6. `LinkedBlockingQueue` — bounded, blocking queue for producer-consumer
7. `put()` blocks if full; `take()` blocks if empty; poison-pill shutdown
8. `AtomicInteger` / `AtomicLong` — lock-free counters via CPU CAS
9. `AtomicBoolean.compareAndSet(false, true)` — one-time initialization
10. `AtomicReference<T>` — atomic object reference swap
11. When to use atomic vs synchronized
12. `LongAdder` preview for highest-contention counters

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Market Data Processor |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
HashMap + concurrent threads → corruption, infinite loops, wrong counts. ConcurrentHashMap + atomic operations → correct results, much faster than global lock.

### 📚 Teaching (6 Sub-sections)
1. **Why concurrent collections**: corruption table — HashMap vs ConcurrentHashMap vs synchronizedMap
2. **ConcurrentHashMap**: bucket-level locking; merge, computeIfAbsent, putIfAbsent, replace
3. **Compound operations**: why get+put is still a race even on ConcurrentHashMap; merge/compute fix
4. **CopyOnWriteArrayList**: copy-on-write for read-heavy lists; when to use vs when not to
5. **LinkedBlockingQueue**: put/take blocking; producer-consumer pattern; poison-pill shutdown
6. **Atomic types**: CAS instruction, AtomicInt/Long/Boolean/Reference; compareAndSet; vs synchronized

### 🛠️ Worked Example: Web Server Request Analytics
ConcurrentHashMap<String, AtomicLong> per-endpoint counters. 1000 concurrent requests, always correct total. AtomicLong.computeIfAbsent + incrementAndGet combination. getTopEndpoints using stream.

### 🏢 3 Industry Examples
- Spring Boot Micrometer metrics (CHM + AtomicLong)
- Kafka producer queue (LinkedBlockingQueue with backpressure)
- Guava / Caffeine caches (built on CHM)

### ⚠️ 3 Common Gaps
1. **concurrent_hashmap_non_atomic_compound** — get+put is still a race; use merge/compute
2. **blocking_queue_interrupted_exception** — always restore interrupt flag
3. **cow_list_write_overhead** — COWAL is read-optimized; slow for write-heavy

### 💪 15 Exercises (705 XP)
Key exercises:
- **Ex 3 (20 XP)**: Race condition demo — int++ vs AtomicInteger
- **Ex 8 (55 XP)**: computeIfAbsent cache — one computation despite 3 concurrent threads
- **Ex 9 (50 XP)**: AtomicBoolean.compareAndSet for one-time init
- **Ex 11 (65 XP)**: Multi-producer, multi-consumer with poison-pill shutdown
- **Ex 13 (75 XP)**: Thread-safe LRU cache using CHM + deque
- **Ex 14 (75 XP)**: Analytics dashboard — BlockingQueue + CHM + AtomicLong
- **Ex 15 (95 XP)**: Connection pool using BlockingQueue — natural backpressure

### 🚀 Mini-Project: Zerodha Market Data Processor
200 price ticks through a bounded BlockingQueue, processed by 3 consumer threads, stats in ConcurrentHashMap + AtomicLong. Total always equals 200. This is a real-time data pipeline.

---

## The Decision Table

| Need | Solution |
|------|----------|
| Thread-safe map, high concurrency | `ConcurrentHashMap` |
| Atomic increment in CHM | `map.merge(key, 1, fn)` |
| Lazy init in CHM | `map.computeIfAbsent(key, factory)` |
| Read-heavy list (listeners) | `CopyOnWriteArrayList` |
| Producer-consumer queue | `LinkedBlockingQueue` |
| Atomic single-var counter | `AtomicInteger` / `AtomicLong` |
| One-time init flag | `AtomicBoolean.compareAndSet(false, true)` |
| Atomic object reference | `AtomicReference<T>` |
| Highest-throughput sum | `LongAdder` |

---

## Review Checklist

- [ ] merge() vs get+put clearly differentiated
- [ ] COWAL read-is-snapshot — no CME during iteration
- [ ] BlockingQueue.take() vs poll() — blocking vs non-blocking
- [ ] Ex 3: int result must be < 10000 to show the race
- [ ] Ex 9: exactly ONE thread gets true from compareAndSet
- [ ] Ex 15: connection pool reuses only 3 connections for 5 threads

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T10.3 | T10.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~65 min | Stable |
| Word count | ~13K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 715 | 705 | Stable |

**Module 10 Progress**: 4/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 49 topics complete (28.8% of 170)

**Next**: Topic 10.5 — CompletableFuture (Module 10 final topic)
