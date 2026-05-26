# Topic 16.4: Kafka Streams

**Module**: M16 - Apache Kafka & Event-Driven Architecture
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T16.3 (Spring Kafka Consumer)

---

## What This Topic Teaches

1. Kafka Streams vs @KafkaListener — when stateful stream processing beats simple consuming
2. `@EnableKafkaStreams` — activates topology auto-configuration
3. `spring.kafka.streams.application-id` — unique Streams app identifier
4. `StreamsBuilder @Bean` — defines the processing topology (DAG)
5. `builder.stream(topic)` — source KStream from a Kafka topic
6. `builder.table(topic)` — source KTable (latest value per key)
7. `.filter((k, v) -> condition)` — keep matching events
8. `.mapValues(v -> transform)` — transform value type
9. `.selectKey((k, v) -> newKey)` — re-key (causes repartition)
10. `.peek((k, v) -> log)` — log without modifying the stream
11. `.groupByKey()` — group by current key for aggregation
12. `.groupBy((k, v) -> newKey)` — selectKey + groupByKey in one step
13. `.count(Materialized.as('store'))` — running count per key
14. `.aggregate(init, accumulator, Materialized)` — custom stateful aggregation
15. `.windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))` — tumbling window
16. `.advanceBy(Duration.ofMinutes(1))` — convert tumbling to hopping window
17. `.toStream()` — convert KTable/windowed result back to KStream
18. `.map((windowed, v) -> KeyValue.pair(windowed.key(), v))` — extract plain key from windowed key
19. `.to('output-topic')` — sink to Kafka topic
20. `.split().branch()` — route events to different streams
21. `KStream.join(KTable, valueJoiner)` — enrich events with table lookup
22. `TopologyTestDriver` — in-process test without Kafka broker
23. `driver.createInputTopic` / `driver.createOutputTopic` — test data piping
24. `inputTopic.pipeInput(key, value, Instant)` — simulate events with timestamps

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Real-Time Analytics |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
@KafkaListener + DB query on every dashboard refresh = stale + slow. Kafka Streams maintains the answer continuously → dashboard reads pre-computed result instantly.

### 📚 Teaching (4 Sub-sections)
1. **Streams vs Consumer**: when to use each; stateful vs stateless
2. **KStream operations**: filter, map, selectKey, peek, split/branch
3. **Aggregations**: count, aggregate, Materialized state stores
4. **Windowed aggregations**: tumbling vs hopping windows, KStream-KTable join

### 🛠️ Worked Example: Zerodha Trade Analytics
Three-branch topology: large trade filter, running count per symbol, 5-min windowed volume. TopologyTestDriver test validates all three branches.

### ⚠️ 3 Common Gaps
1. **missing_enable_kafka_streams** — StreamsBuilder @Bean without @EnableKafkaStreams
2. **serde_mismatch** — StringSerde for TradeEvent objects → SerializationException
3. **forgetting_selectkey_before_groupby** — aggregation by tradeId (unique) instead of symbol

### 💪 15 Exercises (740 XP)
Key exercises:
- **Ex 7 (55 XP)**: TopologyTestDriver — verify filter topology
- **Ex 8 (60 XP)**: TopologyTestDriver — count aggregation test
- **Ex 9 (60 XP)**: Fraud detection stream (windowed count > threshold)
- **Ex 13 (75 XP)**: Full windowed count test with event timestamps
- **Ex 14 (70 XP)**: KStream-KTable join for trade enrichment
- **Ex 15 (95 XP)**: Complete Zerodha analytics — 4 branches, 2 tests

### 🚀 Mini-Project: Zerodha Real-Time Trade Analytics
4 output streams. TopologyTestDriver tests. Real-time trade counts, volume, large trade alerts, and high-frequency detection.

---

## The Kafka Streams Pattern

```java
// 1. Activate:
@Configuration @EnableKafkaStreams

// 2. Configure:
// spring.kafka.streams.application-id=my-streams-app
// spring.kafka.streams.bootstrap-servers=localhost:9092

// 3. Build topology:
@Bean
KStream<String, TradeEvent> topology(StreamsBuilder builder) {
    KStream<String, TradeEvent> trades = builder.stream("trade-executed");
    KStream<String, TradeEvent> bySymbol = trades
        .selectKey((k, e) -> e.symbol());     // re-key by symbol
    
    // Branch 1: filter
    bySymbol.filter((sym, e) -> e.totalValue() > 100_000).to("large-trades");
    
    // Branch 2: count
    bySymbol.groupByKey()
        .count(Materialized.as("sym-count"))
        .toStream().to("symbol-count", Produced.with(Serdes.String(), Serdes.Long()));
    
    // Branch 3: windowed aggregate
    bySymbol.groupByKey()
        .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
        .aggregate(() -> 0.0, (sym, e, vol) -> vol + e.totalValue(),
            Materialized.as("vol-store"))
        .toStream()
        .map((w, vol) -> KeyValue.pair(w.key(), vol))
        .to("symbol-volume");
    
    return trades;
}

// 4. Test (no Kafka needed):
StreamsBuilder builder = new StreamsBuilder();
// build topology on builder...
TopologyTestDriver driver = new TopologyTestDriver(builder.build(), props);
inputTopic.pipeInput("TRD-1", trade("TCS", 10, 38900));
assertEquals(3L, symbolCountOutput.readKeyValuesToMap().get("TCS"));
driver.close();
```

---

## Tumbling vs Hopping Windows

| Type | Use for | Overlapping? | 
|------|---------|-------------|
| Tumbling | Period totals ("March 1st volume") | No |
| Hopping | Rolling window ("last 5 minutes") | Yes |

```java
// Tumbling 5-min:
TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5))

// Hopping 5-min window, 1-min advance:
TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)).advanceBy(Duration.ofMinutes(1))
```

---

## Review Checklist

- [ ] @EnableKafkaStreams: required on @Configuration class
- [ ] selectKey() before groupBy: aggregation by symbol (not tradeId)
- [ ] TopologyTestDriver: APPLICATION_ID + BOOTSTRAP_SERVERS props required
- [ ] Windowed key: windowed.key() extracts String from Windowed<String>
- [ ] Ex 10: tumbling vs hopping — correct output timing explanation

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T16.3 | T16.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~68 min | ~72 min | Slightly higher (complex) |
| Word count | ~14K | ~15K | Higher |
| Exercises | 15 | 15 | Consistent |
| XP available | 735 | 740 | Stable |

**Module 16 Progress**: 4/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 79 topics complete (46.5% of 170)

**Next**: Topic 16.5 — Kafka Schema Registry with Avro (Module 16 Final)
