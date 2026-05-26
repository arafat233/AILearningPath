# Topic 16.3: Spring Kafka Consumer

**Module**: M16 - Apache Kafka & Event-Driven Architecture
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T16.2 (Spring Kafka Producer)

---

## What This Topic Teaches

1. `@KafkaListener(topics="name", groupId="group")` — subscribe to a topic
2. Method parameter = deserialized event (JsonDeserializer converts JSON → Java object)
3. `ConsumerRecord<K,V>` parameter — access topic, partition, offset, key
4. `spring.kafka.consumer.value-deserializer=JsonDeserializer` (spring-kafka)
5. `spring.kafka.consumer.properties.spring.json.trusted.packages=...` — MANDATORY
6. `spring.kafka.consumer.auto-offset-reset=earliest` — start from beginning
7. Different `groupId` = independent consumption of the same messages
8. Same messages → all consumer groups receive them independently
9. `@RetryableTopic(attempts="3", backoff=@Backoff(delay=500, multiplier=2.0))` — retry policy
10. `@DltHandler` — processes messages after all retries exhausted
11. DLT flow: fail → retry → retry → retry → dead-letter topic → @DltHandler
12. `concurrency="3"` on @KafkaListener — N consumer threads (N ≤ partitions)
13. `batch="true"` — receive `List<Event>` instead of single event
14. `spring.kafka.listener.ack-mode=manual` — commit offset only on acknowledge()
15. `Acknowledgment.acknowledge()` — commit offset manually (method parameter)
16. `@EmbeddedKafka(topics={"topic","topic-retry-0","topic-dlt"})` — include all retry topics
17. `CountDownLatch` — precise async test synchronization (no Thread.sleep)
18. Never `catch(Exception e) { log.error(e); }` inside listener — commits offset on failure

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Consumer Pipeline |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Notification-service, portfolio-service, analytics-service all reading the same 'order-events' topic with different groupIds — completely decoupled, independent, zero code changes needed to add a new consumer.

### 📚 Teaching (4 Sub-sections)
1. **@KafkaListener basics**: annotation, groupId, ConsumerRecord, multi-topic
2. **Consumer configuration**: deserializer, trusted.packages (critical!), auto-offset-reset
3. **Error handling**: @RetryableTopic, @DltHandler, exception behavior
4. **Advanced patterns**: concurrency, batch listener, manual acknowledgment

### 🛠️ Worked Example: Zerodha Trade Notification Consumer
TradeNotificationConsumer @KafkaListener + @RetryableTopic (3 attempts, 500ms backoff) + @DltHandler for permanent failures. @EmbeddedKafka test verifies SMS called.

### ⚠️ 3 Common Gaps
1. **missing_trusted_packages** — JsonDeserializer rejects all messages; IllegalArgumentException
2. **exception_swallowing** — catch-all inside listener commits offset; message lost silently
3. **wrong_auto_offset_reset** — 'latest' in tests misses messages published before subscription

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 7 (55 XP)**: @EmbeddedKafka test — verify @MockBean service called
- **Ex 11 (65 XP)**: CountDownLatch-based test synchronization
- **Ex 12 (65 XP)**: Manual acknowledgment — exactly-once processing
- **Ex 13 (75 XP)**: Full roundtrip integration test (publish + consume + verify)
- **Ex 14 (70 XP)**: DLT retry exhaustion test
- **Ex 15 (95 XP)**: Complete Zerodha pipeline — 2 consumers, 2 tests

### 🚀 Mini-Project: Zerodha Trading — Full Kafka Pipeline
TradeNotificationConsumer (retry + DLT) + PortfolioUpdateConsumer (concurrency=3) + 4 @EmbeddedKafka integration tests.

---

## The Consumer Pattern

```java
// 1. Configure (application.properties):
spring.kafka.consumer.key-deserializer=StringDeserializer
spring.kafka.consumer.value-deserializer=JsonDeserializer   ← spring-kafka's!
spring.kafka.consumer.properties.spring.json.trusted.packages=com.example.events  ← MANDATORY!
spring.kafka.consumer.auto-offset-reset=earliest

// 2. Listen with retry:
@Service class TradeNotificationConsumer {
    @RetryableTopic(attempts="3", backoff=@Backoff(delay=500, multiplier=2.0))
    @KafkaListener(topics="trade-executed", groupId="notification-group")
    public void handle(TradeExecutedEvent event) {
        smsService.send(event.userId(), "Trade: " + event.qty() + " " + event.symbol());
        // If this throws: retried 3 times → then @DltHandler
    }
    @DltHandler
    public void handleDlt(TradeExecutedEvent event) {
        log.error("PERMANENT FAILURE: " + event.tradeId());
    }
}

// 3. Test with CountDownLatch:
@EmbeddedKafka(topics={"trade-executed","trade-executed-retry-0","trade-executed-dlt"})
@TestPropertySource(properties={
    "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}",
    "spring.kafka.consumer.auto-offset-reset=earliest",
    "spring.kafka.consumer.properties.spring.json.trusted.packages=*"
})
class Test {
    @Test void test() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        consumer.setLatch(latch);
        kafkaTemplate.send("trade-executed", event);
        assertTrue(latch.await(5, SECONDS));
        verify(smsService).send(eq("U01"), contains("TCS"));
    }
}
```

---

## The Two Consumer Groups Rule

```
'trade-executed' → notification-group: [SMS sent for EACH message]
                → portfolio-group:    [Holding updated for EACH message]
                → analytics-group:    [Analytics recorded for EACH message]

All three groups receive ALL the same messages INDEPENDENTLY.
Adding a 4th consumer group: zero changes to producer or other consumers.
```

---

## Review Checklist

- [ ] trusted.packages: the most-forgotten config — given strong emphasis
- [ ] @EmbeddedKafka: retry and DLT topics must be listed in topics= attribute
- [ ] CountDownLatch preferred over Thread.sleep — demonstrated in Ex 11
- [ ] Ex 10: default behavior without @RetryableTopic — offset committed on exception
- [ ] concurrency ≤ partition count: idle threads waste resources

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T16.2 | T16.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~68 min | ~68 min | Stable |
| Word count | ~13.5K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 720 | 735 | Stable |

**Module 16 Progress**: 3/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 78 topics complete (45.9% of 170)

**Next**: Topic 16.4 — Kafka Streams
