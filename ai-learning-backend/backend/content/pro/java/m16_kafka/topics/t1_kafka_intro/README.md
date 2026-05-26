# Topic 16.1: Introduction to Apache Kafka

**Module**: M16 - Apache Kafka & Event-Driven Architecture
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T15.1 (Introduction to Microservices)

---

## 🚀 Module 16 Begins — The Async Half of Microservices

Module 15 covered synchronous communication (HTTP/Feign). Module 16 covers asynchronous communication — how services talk without waiting for each other. Kafka is the engine behind event-driven architecture at every major Indian tech company.

---

## What This Topic Teaches

1. Event-driven architecture vs request-response — when to use each
2. Apache Kafka overview: why it exists, what problems it solves
3. **Topic**: named stream of messages (like a channel)
4. **Partition**: ordered log within a topic; enables parallelism
5. **Offset**: message position within a partition (0, 1, 2... monotonic)
6. **Broker**: Kafka server that stores messages
7. **Producer**: writes messages to a topic
8. **Consumer**: reads messages from a topic
9. **Consumer Group**: consumers sharing partitions of a topic
10. One partition = one consumer (in a group) at most
11. Multiple consumer groups read the same topic independently
12. Message key → same partition (ordering per key)
13. Messages retained after consumption (default 7 days, replay possible)
14. KRaft mode: Kafka without Zookeeper (modern Kafka 3.x)
15. Docker Compose for local Kafka dev setup
16. `kafka-topics --create`, `kafka-console-producer`, `kafka-console-consumer` CLI
17. Throughput calculation: consumers needed = throughput ÷ (1000ms/processingMs × 3600s)
18. Hybrid architecture: REST for critical path, Kafka for side effects

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Zerodha EDA Design |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Order placed → 5 synchronous service calls → 630ms response time. If SMS service down → order fails. With Kafka: REST for restaurant check + payment (critical), Kafka for everything else → 25ms response. SMS down? Others still work.

### 📚 Teaching (4 Sub-sections)
1. **Kafka architecture**: broker, topic, partition, offset, producer, consumer
2. **Topics + partitions**: ordering within partition, key-based routing
3. **Consumer groups**: partition assignment, parallelism, rebalancing
4. **Kafka vs REST**: decision framework + when to use each

### 🛠️ Worked Example: Zerodha Kafka Topology
Identify sync vs async calls. Design topic structure (trade-events, market-ticks, notification-events, audit-log). Docker Compose setup. CLI produce + consume.

### ⚠️ 3 Common Gaps
1. **too_many_topics** — one topic per event type proliferates; use status field instead
2. **wrong_partition_count** — 1 partition = no parallelism; size for peak consumer count
3. **no_key_ordering_assumption** — Kafka is ordered PER PARTITION, not globally

### 💪 15 Exercises (745 XP)
Key exercises:
- **Ex 7 (55 XP)**: Full Zerodha Kafka architecture with 4 topics and REST/Kafka split
- **Ex 11 (65 XP)**: Throughput calculation — consumers and partitions for 100K trades/hour
- **Ex 13 (70 XP)**: Complete PhonePe UPI Kafka topology
- **Ex 14 (70 XP)**: Kafka vs RabbitMQ recommendation system
- **Ex 15 (95 XP)**: Full Zerodha synthesis — records + topology + throughput + hybrid

### 🚀 Mini-Project: Zerodha EDA Design
4 topics, full event records, Docker Kafka, CLI produce/consume, architecture documentation.

---

## The Core Mental Model

```
BEFORE (synchronous):
order-service → restaurant-svc (150ms wait)
             → payment-svc    (200ms wait)
             → sms-svc        (180ms wait) ← SMS down = ORDER FAILS
             → analytics-svc  (100ms wait)
Total: 630ms. Any service down = order fails.

AFTER (event-driven):
order-service → restaurant-svc (150ms, SYNC - need answer)
             → payment-svc    (200ms, SYNC - need answer)
             → Kafka [order-events] (5ms, ASYNC)
                 ← sms-svc        reads independently
                 ← analytics-svc  reads independently
                 ← portfolio-svc  reads independently
Total: 355ms. SMS down = messages buffered, delivered when recovered.
```

## Kafka Architecture

```
Producer (order-service)
        │
        ▼  publish to topic
┌─────────────────────────────────────────┐
│  Topic: order-events (3 partitions)     │
│  P0: [offset 0][offset 1][offset 2]...  │
│  P1: [offset 0][offset 1]...            │
│  P2: [offset 0][offset 1][offset 2]...  │
└─────────────────────────────────────────┘
        │                    │
        ▼                    ▼
Consumer Group A         Consumer Group B
notification-svc          analytics-svc
  C1 → P0                  C4 → P0, P1, P2
  C2 → P1
  C3 → P2
```

---

## Review Checklist

- [ ] KRaft mode (no Zookeeper) covered — modern approach
- [ ] Partition count from throughput calculation (not arbitrary)
- [ ] Ex 3: consumer/partition math correct (4 partitions, 6 consumers = 2 idle)
- [ ] Ordering clarified: per-partition only, not globally
- [ ] Docker setup: KRaft with CLUSTER_ID — tested

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Module 16 Progress: 1/5 topics complete

**Next**: Topic 16.2 — Spring Kafka Producer

---

## Production Stats

- **Files**: 4
- **Course Progress**: 76 topics complete (44.7% of 170)

**Next**: Topic 16.2 — Spring Kafka Producer (KafkaTemplate)
