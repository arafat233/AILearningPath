# Topic 10.3: ExecutorService and Thread Pools

**Module**: M10 - Concurrency and Threads
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T10.1 (Thread Basics), T10.2 (Synchronization), T8.1 (Lambdas)

---

## What This Topic Teaches

1. Why thread pools beat raw threads (overhead, resource bounds, reuse)
2. `Executors.newFixedThreadPool(n)` — bounded pool for predictable load
3. `Executors.newCachedThreadPool()` — elastic pool for bursty I/O work
4. `Executors.newSingleThreadExecutor()` — serialization, ordered execution
5. `ExecutorService.submit(Callable<T>)` → `Future<T>`
6. `Future.get()` — blocking result retrieval
7. `Future.get(timeout, unit)` — timeout with `TimeoutException`
8. `Future.cancel(true)` — cancellation with interrupt
9. `ExecutionException` — catching task exceptions through Future
10. `invokeAll` — wait for all tasks; `invokeAny` — fastest wins
11. `ScheduledExecutorService` — delays and periodic tasks
12. Proper shutdown: `shutdown()` + `awaitTermination()` + `shutdownNow()`

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Flipkart Parallel Search Engine |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Creating 50,000 threads (one per request) vs a 50-thread pool. Memory: 50GB vs ~50MB. Thread pool math: 50 threads × 1000 task/thread/min = 50,000 requests/min handled.

### 📚 Teaching (7 Sub-sections)
1. **Why thread pools**: comparison table — raw threads vs pools
2. **ExecutorService basics**: factory methods, submit, shutdown
3. **Callable and Future**: Callable<T> vs Runnable; Future<T> API
4. **Exception handling**: ExecutionException wrapping; getCause()
5. **Shutdown correctly**: graceful vs immediate; resource leak warning
6. **invokeAll and invokeAny**: fan-out patterns
7. **ScheduledExecutorService**: delays, fixed-rate, fixed-delay

### 🛠️ Worked Example: Zerodha Stock Fetcher
Fetch 10 stock quotes in parallel with 4-thread pool. invokeAll waits for all. Results sorted by change%. ExecutionException handled per-symbol. Total time ~200ms vs 1500ms sequential.

### 🏢 3 Industry Examples
- Spring Boot / Tomcat: 200-thread pool serves HTTP requests
- Razorpay: parallel payment validation + ScheduledExecutorService retries
- Flipkart: fan-out to 5 services, invokeAll, page assembled from all results

### ⚠️ 3 Common Gaps
1. **not_shutting_down_pool** — JVM hangs; always shutdown in finally
2. **ignoring_execution_exception** — task failures silently swallowed
3. **submit_runnable_ignoring_future** — can't detect failures without Future.get()

### 💪 15 Exercises (715 XP)
Key exercises:
- **Ex 8 (50 XP)**: invokeAny — fastest-wins pattern
- **Ex 9 (55 XP)**: get() with timeout + cancel
- **Ex 10 (60 XP)**: ScheduledExecutorService with fixed rate
- **Ex 11 (65 XP)**: Parallel stock fetcher with sorting
- **Ex 13 (70 XP)**: Parallel order validation — all must pass
- **Ex 14 (75 XP)**: Batch processing with pool
- **Ex 15 (95 XP)**: Full async payment system with timeout + graceful degradation

### 🚀 Mini-Project: Flipkart Parallel Search Engine
15 parallel calls (5 products × 3 services), invokeAll, timeout per call, graceful degradation, speedup measurement. This is the production fan-out pattern.

---

## The Professional Pattern

```java
// Startup (once):
ExecutorService pool = Executors.newFixedThreadPool(N);

// Per request:
List<Future<Result>> futures = pool.invokeAll(tasks);
for (Future<Result> f : futures) {
    try { process(f.get(timeout, UNIT)); }
    catch (TimeoutException e) { handleTimeout(); f.cancel(true); }
    catch (ExecutionException e) { handleFailure(e.getCause()); }
}

// Shutdown (once, on app close):
pool.shutdown();
pool.awaitTermination(30, SECONDS);
```

---

## Review Checklist

- [ ] shutdown vs shutdownNow distinction clear
- [ ] ExecutionException → getCause() pattern
- [ ] invokeAll vs invokeAny use cases differentiated
- [ ] Ex 9: TimeoutException catch + future.cancel(true)
- [ ] Ex 15: 3 separate try-catch branches (Timeout, Execution, Interrupted)

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T10.2 | T10.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~60 min | ~65 min | Stable |
| Word count | ~12K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | — | 715 | — |

**Module 10 Progress**: 3/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 48 topics complete (28.2% of 170)

**Next**: Topic 10.4 — Concurrent Collections and Atomic Types
