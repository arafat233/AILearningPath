# Topic 14.2: @Async and @Scheduled

**Module**: M14 - Advanced Spring Boot
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.1 (Spring Boot Intro), T10.5 (CompletableFuture)

---

## What This Topic Teaches

1. `@EnableAsync` — activates @Async support (required!)
2. `@Async` — runs method in thread pool, caller returns immediately
3. `@Async void` — fire-and-forget, no return value
4. `@Async CompletableFuture<T>` — fire and optionally await result
5. Self-invocation anti-pattern — `this.method()` bypasses @Async
6. `ThreadPoolTaskExecutor` — custom thread pool (core, max, queue, prefix)
7. `@Async("executorName")` — use a specific named executor
8. `AsyncUncaughtExceptionHandler` — catch exceptions from void @Async
9. `@EnableScheduling` — activates @Scheduled support
10. `@Scheduled(fixedRate=ms)` — every N ms from previous START
11. `@Scheduled(fixedDelay=ms)` — every N ms after previous COMPLETION
12. `@Scheduled(cron="s m h d M dow")` — precise 6-field cron schedule
13. `@Scheduled(initialDelay=ms)` — wait N ms before first run
14. Testing @Async: `future.get(timeout, unit)` or `Thread.sleep()` in test
15. Testing @Scheduled: inject component, call method directly

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~8KB | Razorpay Payment Notification Pipeline |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Order endpoint: 2.5 seconds with blocking notifications vs 60ms with @Async. Same work done — different when.

### 📚 Teaching (5 Sub-sections)
1. **@EnableAsync + @Async**: activation, void vs CF return, self-invocation trap
2. **Custom executor**: ThreadPoolTaskExecutor, named executors, @Async("name")
3. **@EnableScheduling + @Scheduled**: fixedRate, fixedDelay, cron, initialDelay
4. **Cron syntax**: 6 fields, special chars, examples
5. **Testing**: CF.get() for @Async, direct method call for @Scheduled

### 🛠️ Worked Example: Trading Order System
OrderService places order in ~50ms. NotificationService.sendConfirmation() is @Async — email happens later. TradingJobs: price refresh every 30s, EOD settlement at 5:30 PM.

### ⚠️ 3 Common Gaps
1. **missing_enable_async** — @Async silently ignored without @EnableAsync
2. **self_invocation** — `this.method()` bypasses proxy → @Async ignored
3. **fixed_rate_vs_delay** — fixedRate can overlap; fixedDelay guarantees gap

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 8 (55 XP)**: Self-invocation anti-pattern vs correct fix
- **Ex 11 (65 XP)**: Parallel @Async fan-out with allOf (portfolio aggregation)
- **Ex 13 (70 XP)**: AsyncUncaughtExceptionHandler
- **Ex 14 (70 XP)**: Zerodha trading schedule — 5 real-world cron expressions
- **Ex 15 (95 XP)**: Complete async order system with performance test

### 🚀 Mini-Project: Razorpay Payment Notification Pipeline
3 @Async notification methods. PaymentService responds in <200ms. RetryJob with fixedDelay. DailyReconciliation with cron. Performance assertion test.

---

## The Three-Line Pattern

```java
// 1. Enable:
@SpringBootApplication @EnableAsync @EnableScheduling

// 2. Async service method:
@Async public CompletableFuture<Void> sendEmail(Order o) { ... }

// 3. Scheduled job:
@Scheduled(cron = "0 30 17 * * MON-FRI") // 5:30 PM weekdays
public void eodSettlement() { ... }
```

## The Self-Invocation Trap

```java
// WRONG — @Async ignored:
@Service class OrderService {
    @Async void sendEmail() { ... }
    void placeOrder() { this.sendEmail(); }  // ← bypasses proxy!
}

// RIGHT — @Async works:
@Service class EmailService { @Async void send() { ... } }
@Service class OrderService {
    private final EmailService emailSvc;
    void placeOrder() { emailSvc.send(); }  // ← via proxy = async!
}
```

## Cron Quick Reference

| Cron | Meaning |
|------|---------|
| `0 0 * * * *` | Every hour |
| `0 0/30 * * * *` | Every 30 minutes |
| `0 0 8 * * MON-FRI` | 8:00 AM weekdays |
| `0 30 15 * * MON-FRI` | 3:30 PM weekdays |
| `0 0 0 1 * *` | Midnight on 1st of month |
| `0 0 18 * * FRI` | 6:00 PM Fridays |

---

## Review Checklist

- [ ] @EnableAsync: must be present or @Async silently ignored
- [ ] Self-invocation clearly demonstrated as anti-pattern
- [ ] fixedRate vs fixedDelay timing difference shown numerically
- [ ] Ex 10: thread names correct (http-nio vs async thread)
- [ ] Cron: 6-field format (includes seconds) vs standard 5-field

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T14.1 | T14.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~15K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 740 | 720 | Stable |

**Module 14 Progress**: 2/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 67 topics complete (39.4% of 170)

**Next**: Topic 14.3 — Spring Cache with @Cacheable
