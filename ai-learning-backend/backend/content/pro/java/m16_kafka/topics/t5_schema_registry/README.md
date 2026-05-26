# Topic 16.5: Kafka Schema Registry & Avro

**Module**: M16 - Apache Kafka & Event-Driven Architecture
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T16.4 (Kafka Streams)

---

## 🎉 Module 16 Final Topic

Schema governance is the capstone of a mature Kafka pipeline. JSON works until it doesn't — then silent data corruption costs hours of debugging. Avro + Schema Registry prevents that entirely.

---

## What This Topic Teaches

1. The schema drift problem — JSON silently accepts broken schemas
2. Avro binary format: compact, typed, schema-governed
3. `.avsc` file: Avro schema definition (type, name, namespace, fields)
4. Avro primitive types: null, boolean, int, long, float, double, string, bytes
5. Avro complex types: record, enum, array, map, union
6. Nullable field: `["null", "string"]` union with `"default": null`
7. `avro-maven-plugin`: generates Java class from `.avsc` at `mvn generate-sources`
8. Generated class: builder pattern — `MyEvent.newBuilder().setX().build()`
9. Generated class: `getX()` accessors (not record `x()`)
10. `KafkaAvroSerializer` (io.confluent): serializes Avro → binary + registers schema
11. `KafkaAvroDeserializer` (io.confluent): fetches schema from Registry → deserializes
12. `spring.kafka.producer.properties.schema.registry.url=http://localhost:8081`
13. `spring.kafka.consumer.properties.specific.avro.reader=true` — MANDATORY
14. Schema Registry: central schema store; assigns numeric schema IDs
15. Wire format: `[0x00][4-byte schema ID][Avro binary]` — 5 bytes overhead
16. **Backward compatible**: add field WITH default → old consumers see default
17. **Breaking**: rename field, remove required field, change type → Registry REJECTS
18. Compatibility check: `POST /compatibility/subjects/{name}/versions/latest`
19. Safe rename: 2-step migration (add new + keep old → remove old)
20. Enum in Avro: `{"type": "enum", "name": "TradeType", "symbols": ["BUY", "SELL"]}`

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~21KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Avro Schema Governance |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
JSON field rename → silent null in production → incorrect portfolio calculations for hours. Avro rename attempt → Schema Registry REJECTS → Deploy BLOCKED at CI → zero-incident.

### 📚 Teaching (4 Sub-sections)
1. **Avro schema**: .avsc format, primitive types, record/enum/array, nullable fields
2. **Schema Registry + setup**: Docker Compose, pom.xml, application.properties
3. **Compatibility rules**: backward/forward/full/breaking — what changes are safe
4. **Safe evolution**: 2-step rename, nullable field addition, what Registry rejects

### 🛠️ Worked Example: Zerodha Avro Migration
TradeExecutedEvent.avsc → generated Java class → KafkaAvroSerializer producer → KafkaAvroDeserializer consumer → schema v2 (add exchange, backward compatible) → v3 attempt (rename, rejected).

### ⚠️ 3 Common Gaps
1. **missing_specific_avro_reader** — GenericRecord instead of generated class; ClassCastException
2. **breaking_schema_change** — rename in one step; old consumers break silently
3. **wrong_schema_registry_url** — URL not under .properties; SerializationException

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 3 (25 XP)**: Classify 5 schema changes as compatible or breaking
- **Ex 8 (55 XP)**: Safe schema evolution — add nullable fields
- **Ex 12 (65 XP)**: 2-step rename migration strategy
- **Ex 13 (70 XP)**: Nested Avro records (Customer, OrderItem[], Address)
- **Ex 14 (70 XP)**: pom.xml Maven plugin configuration
- **Ex 15 (95 XP)**: Complete Zerodha Avro pipeline — schema + config + evolution

### 🚀 Mini-Project: Zerodha Avro Schema Governance
TradeExecutedEvent.avsc with enum → avro-maven-plugin → Avro producer/consumer → schema v2 compatible → v3 rejected. README documents evolution story.

---

## The Avro Pattern

```json
// 1. Define schema (src/main/avro/TradeExecutedEvent.avsc):
{
  "type": "record",
  "name": "TradeExecutedEvent",
  "namespace": "com.codequest.events.avro",
  "fields": [
    {"name": "tradeId",    "type": "string"},
    {"name": "symbol",     "type": "string"},
    {"name": "qty",        "type": "int"},
    {"name": "price",      "type": "double"},
    {"name": "tradeType",  "type": {"type": "enum", "name": "TradeType",
                                    "symbols": ["BUY", "SELL"]}},
    {"name": "exchange",   "type": ["null", "string"], "default": null}
  ]
}
```

```java
// 2. Generate + use:
// mvn generate-sources → TradeExecutedEvent.java
TradeExecutedEvent event = TradeExecutedEvent.newBuilder()
    .setTradeId("TRD-001").setSymbol("TCS").setQty(10)
    .setPrice(3890.0).setTradeType(TradeType.BUY).build();

// 3. Produce:
// spring.kafka.producer.value-serializer=KafkaAvroSerializer
// spring.kafka.producer.properties.schema.registry.url=http://localhost:8081
kafkaTemplate.send("trade-executed", "TCS", event);

// 4. Consume:
// spring.kafka.consumer.value-deserializer=KafkaAvroDeserializer
// spring.kafka.consumer.properties.specific.avro.reader=true  ← MANDATORY
@KafkaListener(topics="trade-executed") void handle(TradeExecutedEvent e) { ... }
```

---

## Schema Compatibility Quick Reference

| Change | Backward? | Breaking? |
|--------|-----------|-----------|
| Add field WITH default | ✅ Safe | No |
| Add field WITHOUT default | ❌ | Yes |
| Rename field | ❌ | Yes |
| Remove field WITH default | ✅ (forward) | Depends |
| Change field type | ❌ | Yes |

---

## Review Checklist

- [ ] specific.avro.reader=true: emphasized as the most-forgotten property
- [ ] schema.registry.url under .properties not top-level — clear example shown
- [ ] Ex 1: JSON silent failure vs Avro deploy-time catch — compelling contrast
- [ ] Ex 12: 2-step rename — correctly shows the intermediate schema
- [ ] Wire format: [0x00][4 bytes schema ID][Avro binary] — explains why SR URL needed

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

---

# 🎉 MODULE 16: APACHE KAFKA & EVENT-DRIVEN ARCHITECTURE — COMPLETE!

---

## Module 16 Statistics

| Topic | Title | XP |
|-------|-------|----|
| 16.1 | Introduction to Apache Kafka | 745 |
| 16.2 | Spring Kafka Producer | 720 |
| 16.3 | Spring Kafka Consumer | 735 |
| 16.4 | Kafka Streams | 740 |
| 16.5 | Schema Registry & Avro | 720 |
| **TOTAL** | | **~3,660** |

**5 topics · 75 exercises · 5 mini-projects · ~71,000 words**

---

## Module 16 Master Reference

```
16.1: Kafka concepts → topic, partition, offset, producer, consumer group
16.2: KafkaTemplate → kafkaTemplate.send(topic, key, value).whenComplete(...)
16.3: @KafkaListener → @RetryableTopic + @DltHandler + @EmbeddedKafka tests
16.4: Kafka Streams → filter, aggregate, windowed, TopologyTestDriver
16.5: Avro + Schema Registry → .avsc → generated class → compatibility check
```

---

## Cumulative Course Progress After Module 16

| Metric | After M15 | After M16 |
|--------|-----------|-----------|
| Topics | 75/170 | **80/170 (47.1%)** |
| Total XP | ~54,620 | **~58,280** |
| Exercises | 1,125 | **1,200** |
| Projects | 77 | **82** |
| Files | ~351 | **~355** |

**80 topics complete — approaching the halfway mark of 170!**

---

## ✅ Module 16 Approval Status

All 5 topics: 🟡 PENDING REVIEW

---

## Pipeline Performance (Module 16)

| Metric | Value |
|--------|-------|
| Avg time/topic | ~68 min |
| Total words | ~71,000 |
| XP/topic average | ~732 |

---

## Next Modules

The course continues building on M15 (Microservices) + M16 (Kafka) foundations. Possible next modules depend on course plan — database engineering, cloud-native Spring, advanced JPA, or security patterns.
