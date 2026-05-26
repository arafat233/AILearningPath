# Topic 16.2: Spring Kafka Producer

**Module**: M16 - Apache Kafka & Event-Driven Architecture
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T16.1 (Introduction to Apache Kafka)

---

## What This Topic Teaches

1. `spring-kafka` dependency — single JAR enables Spring Kafka
2. `spring.kafka.bootstrap-servers=localhost:9092` — broker address
3. `spring.kafka.producer.key-serializer=StringSerializer` — for String keys
4. `spring.kafka.producer.value-serializer=JsonSerializer` — spring-kafka's JSON serializer
5. `spring.kafka.producer.acks=all` — all replicas must acknowledge
6. `spring.kafka.producer.retries=3` — retry transient failures
7. `KafkaTemplate<String, EventType>` — injected via constructor
8. `kafkaTemplate.send(topic, value)` — send without key (random partition)
9. `kafkaTemplate.send(topic, key, value)` — send with key (consistent partition)
10. Returns `CompletableFuture<SendResult<K,V>>` — non-blocking
11. `.whenComplete((result, ex) -> ...)` — async success/failure callback
12. `result.getRecordMetadata().topic/partition/offset()` — metadata on success
13. Message key = entity ID → ordering guarantee per entity
14. `ProducerFactory<K,V>` @Bean → `KafkaTemplate<K,V>` @Bean (programmatic config)
15. `ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG=true` — exactly-once producer
16. `@EmbeddedKafka(partitions=N, topics={...})` — in-process Kafka for tests
17. `spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}` — test override
18. `KafkaTestUtils.consumerProps(...)` — test consumer configuration
19. DB-first pattern: save to DB before publishing to Kafka

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Kafka Producer |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Synchronous calls to 4 services = 500ms response, any service down = order fails. kafkaTemplate.send() one line = 50ms response, services decoupled.

### 📚 Teaching (4 Sub-sections)
1. **Setup**: dependency, application.properties, serializers
2. **KafkaTemplate basics**: send variants, CompletableFuture, whenComplete
3. **Producer configuration**: @Bean approach, acks/retries/idempotence
4. **Testing**: @EmbeddedKafka, KafkaTestUtils, test consumer

### 🛠️ Worked Example: Zerodha Trade Event Publisher
TradeEventPublisher injects KafkaTemplate. Sends to 'trade-events' with symbol as key. Callback logs partition + offset. TradeService calls publisher after DB save.

### ⚠️ 3 Common Gaps
1. **wrong_serializer** — StringSerializer for objects; must be JsonSerializer (spring-kafka)
2. **fire_and_forget_exceptions** — no .whenComplete() = silent losses
3. **publishing_before_db_save** — ghost events for non-existent entities

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 7 (55 XP)**: @EmbeddedKafka test for producer
- **Ex 11 (65 XP)**: Transactional Kafka producer (DB + Kafka atomicity)
- **Ex 12 (65 XP)**: Dead-letter fallback for failed sends
- **Ex 13 (75 XP)**: Full integration test with @EmbeddedKafka
- **Ex 14 (70 XP)**: Batch publish with CompletableFuture.allOf()
- **Ex 15 (95 XP)**: Complete Zerodha producer — 2 tests passing

### 🚀 Mini-Project: Zerodha Trade Publisher
TradeExecutedEvent + KafkaProducerConfig + TradeEventPublisher + TradeService integration + 3 @EmbeddedKafka tests.

---

## The KafkaTemplate Pattern

```java
// 1. Configure (application.properties):
// spring.kafka.bootstrap-servers=localhost:9092
// spring.kafka.producer.key-serializer=StringSerializer
// spring.kafka.producer.value-serializer=JsonSerializer  ← spring-kafka's!
// spring.kafka.producer.acks=all

// 2. Inject and use:
@Service class TradeEventPublisher {
    private final KafkaTemplate<String, TradeExecutedEvent> kafkaTemplate;
    TradeEventPublisher(KafkaTemplate<String, TradeExecutedEvent> kt) { kafkaTemplate=kt; }
    
    public void publish(TradeExecutedEvent event) {
        kafkaTemplate.send(
            "trade-executed",  // topic
            event.symbol(),    // key → all TCS trades in same partition
            event              // value → JSON serialized
        ).whenComplete((result, ex) -> {
            if (ex != null) System.err.println("FAILED: " + ex.getMessage());
            else System.out.printf("offset=%d%n", result.getRecordMetadata().offset());
        });
    }
}

// 3. Test:
@SpringBootTest @EmbeddedKafka(topics={"trade-executed"})
@TestPropertySource(properties="spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}")
class Test {
    @Autowired TradeEventPublisher publisher;
    @Autowired EmbeddedKafkaBroker eb;
    @Test void test() {
        publisher.publish(event);
        Thread.sleep(500);
        // consume + assert
    }
}
```

---

## Review Checklist

- [ ] spring-kafka's JsonSerializer (not Kafka's): `org.springframework.kafka.support.serializer.JsonSerializer`
- [ ] DB-first pattern: save before publish — emphasized clearly
- [ ] Ex 10: null key → round-robin (not consistent partition)
- [ ] .whenComplete not .thenApply: correct API for success+failure in one callback
- [ ] @EmbeddedKafka test: Thread.sleep explained (async send needs time)

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T16.1 | T16.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~68 min | ~68 min | Stable |
| Word count | ~13K | ~13.5K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | ~745 | 720 | Slightly lower (narrower topic) |

**Module 16 Progress**: 2/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 77 topics complete (45.3% of 170)

**Next**: Topic 16.3 — Spring Kafka Consumer
