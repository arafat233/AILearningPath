# Topic 18.5: Redis Pub/Sub & Cache Invalidation

**Module**: M18 - Redis Caching & Rate Limiting  
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T18.4 (Redis Distributed Locks)

---

## What This Topic Teaches

1. Redis Pub/Sub: PUBLISH → delivered to all current SUBSCRIBE subscribers simultaneously
2. Fan-out: one message → all N subscribers receive it
3. At-most-once: no persistence, no retry — offline subscribers miss messages
4. `redis.convertAndSend(channel, message)` — Spring PUBLISH
5. `RedisMessageListenerContainer` — the Spring infrastructure for Pub/Sub subscriptions
6. `MessageListenerAdapter(handler, "methodName")` — bytes → String → Java method
7. `ChannelTopic("name")` — exact channel subscription
8. `PatternTopic("prefix.*")` — wildcard subscription (one sub, many channels)
9. Handler method: `(String message)` or `(String message, String channel)`
10. Channel naming: `"cache.invalidate.{cacheName}"` — encode context in channel name
11. Cluster-wide L1 cache invalidation: local evict + publish = all instances evicted
12. **Local evict BEFORE publish** — this instance is immediately consistent
13. `cache.evict(key)` — remove specific entry; `cache.clear()` — remove all entries
14. `"*"` as broadcast message — convention for "clear all entries in this cache"
15. Extract cache name from channel suffix: `channel.lastIndexOf('.') + 1`
16. Test async Pub/Sub: `Thread.sleep(50-100ms)` after publish before asserting
17. At-most-once staleness: TTL provides fallback consistency for missed messages
18. Shorter TTL = smaller staleness window after missed Pub/Sub message
19. Reconnect-triggered clear: conservative L1 clear on Redis reconnect to avoid stale data
20. Use case vs Kafka: Pub/Sub = broadcast/fanout; Kafka = durable ordered streaming

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~18KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~6KB | Flipkart Cluster Consistency |
| `README.md` | This file |

---

## The Complete Pub/Sub Pattern

```java
// CONFIG:
@Bean RedisMessageListenerContainer container(
        RedisConnectionFactory f, MessageListenerAdapter adapter) {
    var c = new RedisMessageListenerContainer();
    c.setConnectionFactory(f);
    c.addMessageListener(adapter, new PatternTopic("cache.invalidate.*"));
    return c;
}
@Bean MessageListenerAdapter adapter(CacheEvictionHandler h) {
    return new MessageListenerAdapter(h, "onEvict");
}

// PUBLISHER (on write):
cache.evict(productId);                               // local first
redis.convertAndSend("cache.invalidate.products", productId);  // then broadcast

// SUBSCRIBER (on ALL instances):
public void onEvict(String message, String channel) {
    String cacheName = channel.substring(channel.lastIndexOf('.') + 1);
    cacheManager.getCache(cacheName).evict(message);
}
```

---

## TTL vs Pub/Sub Comparison

| Scenario | TTL only | TTL + Pub/Sub |
|----------|----------|---------------|
| Product price update | Stale for 30-60s | Consistent in <10ms |
| Restaurant closes | Stale for 30s | Consistent in <10ms |
| Subscriber offline | N/A | Miss + TTL fallback |
| Instance restart | Clean (empty cache) | Clean (empty cache) |

---

## Review Checklist

- [ ] Three beans required: container + adapter + handler — all needed, clearly explained
- [ ] Local evict first: emphasized before publish
- [ ] At-most-once: clearly explained, TTL as fallback
- [ ] Thread.sleep in tests: explained why needed (async delivery)
- [ ] Ex 10: offline subscriber scenario — staleness window analysis complete

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

**Module 18 Progress**: 5/5 topics complete ✅  
**Course Progress**: 90 topics complete (52.9% of 170)
