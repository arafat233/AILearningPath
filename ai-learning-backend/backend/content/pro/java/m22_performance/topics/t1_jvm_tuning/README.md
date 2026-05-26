# Topic 22.1: JVM Tuning & Garbage Collection

**Module**: M22 - Performance & Optimization  
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T21.1 (Dockerfile — JVM container flags)

---

## 🆕 Module 22 Begins — Performance & Optimization

After deploying reliably (M21), Module 22 covers **making services fast**. JVM tuning, database optimization, connection pooling, caching, and load testing.

---

## What This Topic Teaches

1. Young Gen (Eden + Survivor): new objects; Minor GC (1-10ms), frequent
2. Old Gen: long-lived objects; Major/Full GC (100ms-10s), the problem to solve
3. G1GC (default Java 11+): `-XX:+UseG1GC`, `MaxGCPauseMillis=100` (target, not guarantee)
4. ZGC (Java 15+): sub-millisecond pauses; for latency-critical services (trading, payments)
5. `-XX:MaxRAMPercentage=75.0`: heap = 75% of container memory (NOT `-Xmx` in containers!)
6. `-XX:+HeapDumpOnOutOfMemoryError`: mandatory — only forensic evidence on OOM
7. `-Xms = -Xmx` (same value): avoid heap resize pauses; in containers use `MaxRAMPercentage`
8. `MaxGCPauseMillis=100`: G1GC adjusts collection size to meet target pause time
9. `G1HeapRegionSize=16m`: increase for large heaps (> 1GB) for better utilization
10. `MetaspaceSize` + `MaxMetaspaceSize`: cap class metadata growth
11. GC log: `-Xlog:gc*:stdout:time,uptime,level,tags`
12. `jvm.gc.pause` Timer: auto-registered by Spring Boot Actuator + Micrometer
13. `jvm.memory.used` Gauge: current heap usage, queryable in Prometheus
14. `ManagementFactory.getMemoryMXBean()`: JMX API for heap stats in code
15. Caffeine cache: bounded, time-expiring — replace unbounded `static HashMap`
16. `ThreadLocal.remove()` in finally: prevents thread-pool memory leaks
17. `jmap -dump:format=b,file=heap.hprof <PID>`: get heap dump from running JVM
18. MAT / VisualVM: heap dump analysis tools; Dominator Tree shows memory holders
19. JIT tiers: C1 (fast, less optimized) → C2 (slow to compile, heavily optimized, hot paths)
20. Warm-up strategy: `@EventListener(ApplicationStartedEvent)` → make synthetic requests

---

## Production JVM Flags Checklist

```bash
# Required for every containerized Spring Boot service:
-XX:+UseG1GC                      # default GC (G1 is good for most services)
-XX:MaxGCPauseMillis=100          # target pause < 100ms
-XX:MaxRAMPercentage=75.0         # heap = 75% of container memory
-XX:+UseContainerSupport          # enable cgroup-aware resource detection
-XX:+HeapDumpOnOutOfMemoryError   # MANDATORY for production diagnosis
-XX:HeapDumpPath=/tmp/            # where to write dump

# Optional but recommended:
-XX:G1HeapRegionSize=16m          # for heaps > 1GB
-XX:MaxMetaspaceSize=256m         # cap Metaspace growth
-XX:ConcGCThreads=4               # background GC threads
-Xlog:gc*:stdout:time,uptime,level,tags  # GC logging to stdout

# For ultra-low latency (trading, real-time payments):
-XX:+UseZGC                       # Java 17+ only; sub-ms pauses
```

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~18KB | Main content |
| `exercises.json` | ~36KB | 15 exercises |
| `project.json` | ~3KB | Razorpay JVM tuning project |
| `README.md` | This file |

---

## Review Checklist

- [ ] Ex 1: GC log reading — identifies Full GC as p99 spike cause
- [ ] Ex 10: 5 flag review — all identified correctly (A wrong, B wrong, C usually correct, D wrong, E critical omission)
- [ ] Ex 13: memory leak test — leaky (100 entries) vs fixed (≤ 600 entries for 1000 puts)
- [ ] Ex 15: synthesis — all 3 tests pass

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 22 Progress**: 1/5 topics complete  
**Course Progress**: 106 topics complete (62.4% of 170)
