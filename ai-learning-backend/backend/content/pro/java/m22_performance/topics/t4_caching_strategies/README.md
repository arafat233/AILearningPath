# Topic 22.4: Caching Strategies (L1 + L2)

**Module**: M22 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 22 Progress**: 4/5 | **Course Progress**: 109 topics (64.1%)

## Key Concepts
- L1 (Caffeine): in-process, ~0.1ms, bounded (maximumSize), per-JVM instance
- L2 (Redis): distributed, ~1ms, shared across all instances
- Cache-aside: check L1 → L2 → DB; populate on miss
- L1 TTL < L2 TTL: L1 is a local buffer — re-fetches from L2 when expired
- `recordStats()`: enables `cache.stats().hitRate()` — REQUIRED for monitoring
- Hit rate metric: Counter by `level` tag (l1/l2/db) — drives capacity decisions
- Cache invalidation: delete L1 + L2 **before** writing to DB
- Write-through: update DB AND cache simultaneously (no gap, higher consistency)
- Stampede: SETNX lock on hot-key miss — only 1 thread fetches from DB
- Warm-up `@EventListener(ApplicationStartedEvent)`: pre-load frequently accessed data
- TTL strategy: immutable data (payment finalized) → long/infinite; volatile (exchange rate) → don't cache

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
