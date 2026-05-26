# Topic 20.1: Spring Boot Actuator & Micrometer

**Module**: M20 - Observability  
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T19.1 (Resilience4j Circuit Breaker)

---

## 🆕 Module 20 Begins — Observability

After building resilient services (M19), Module 20 covers **knowing what your service is doing in production**. The three pillars: Metrics (Micrometer → Prometheus → Grafana), Traces (T20.2), and Logs (T20.3).

---

## What This Topic Teaches

1. Three pillars of observability: **Metrics** (what), **Traces** (where), **Logs** (what exactly)
2. `spring-boot-starter-actuator` + `micrometer-registry-prometheus`: required deps
3. `management.endpoints.web.exposure.include: health,metrics,prometheus`
4. `/actuator/health` — service + component health; `/actuator/prometheus` — Prometheus scrape
5. `MeterRegistry`: injected via constructor; used to create all meters
6. `Counter`: monotonically increasing; use for counting events (`payments.total`)
7. `Timer`: duration distribution; records count + sum + percentiles (`payments.duration`)
8. `Gauge`: current value, up/down (`queue.size`, `active.connections`)
9. `DistributionSummary`: arbitrary value distribution (`payment.amount`)
10. `Counter.builder(name).tag(k,v).register(registry)`: standard creation pattern
11. `timer.record(Supplier<T>)`: measures duration, returns the supplied value
12. `publishPercentiles(0.5, 0.95, 0.99)`: pre-compute p50/p95/p99 in-app
13. **Tags must be LOW cardinality** — `status`, `gateway`, `type` are fine; IDs are NOT
14. Global tags: `management.metrics.tags.application=my-service` → added to ALL metrics
15. `@Timed(value="name")`: AOP-based Timer shortcut (requires AOP starter)
16. Create meters **once in constructor**, call `.increment()`/`.record()` in hot path
17. `Gauge.builder(name, obj, fn)`: lazy — fn called each time gauge is sampled
18. `HealthIndicator`: custom component health in `/actuator/health`
19. `MeterRegistryCustomizer`: apply `MeterFilter.commonTags()` or deny filters globally
20. Prometheus scrapes `/actuator/prometheus` every 15s; counter names get `_total` suffix

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~20KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~5KB | Razorpay Payment Observability |
| `README.md` | This file |

---

## The Four Meter Types

```java
// COUNTER — events that happen (always increases):
Counter.builder("payments.total")
    .tag("status", "success").tag("gateway", "visa")
    .register(registry).increment();

// TIMER — duration distribution (latency):
Timer.builder("payments.duration")
    .tag("gateway", "visa")
    .publishPercentiles(0.5, 0.95, 0.99)
    .register(registry)
    .record(() -> callVisaGateway());

// GAUGE — current value (can go up and down):
Gauge.builder("payments.queue.size", retryQueue, Queue::size)
    .register(registry);

// DISTRIBUTION SUMMARY — value distribution (amounts, sizes):
DistributionSummary.builder("payment.amount")
    .baseUnit("rupees")
    .publishPercentiles(0.5, 0.95, 0.99)
    .register(registry)
    .record(amount);
```

---

## High Cardinality — The Critical Rule

```
✅ SAFE tags (low cardinality):
   status = success | failure          (2 values)
   gateway = visa | mastercard | upi   (3-5 values)
   merchant_type = ecomm | travel      (5-10 values)
   region = india | us                 (2-3 values)

❌ DANGER tags (high cardinality):
   paymentId = PAY-001, PAY-002, ...   (millions!)
   userId = USR-12345                  (millions!)
   orderId = ORD-...                   (millions!)
   → Use LOGS for these, not metric tags
```

---

## Review Checklist

- [ ] Create meters in constructor, not in hot path: emphasized with example
- [ ] High cardinality tags: Ex 10 (predict_output) covers the disaster scenario  
- [ ] All 4 meter types: Counter, Timer, Gauge, DistributionSummary — all distinct
- [ ] Global tags: application.yml approach shown as primary method
- [ ] HealthIndicator: component name via `@Component("name")`

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 20 Progress**: 1/5 topics complete  
**Course Progress**: 96 topics complete (56.5% of 170)
