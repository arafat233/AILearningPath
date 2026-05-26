# Topic 23.5: Rate Limiting & API Security

**Module**: M23 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 23 Progress**: 5/5 ✅ | **Course Progress**: 115 topics (67.6%)

## Key Concepts
- **Token bucket**: bucket fills at N tokens/min; each request costs 1 token; empty → 429
- `Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)))`: 100 req/min, evenly distributed
- `bucket.tryConsume(1)`: non-blocking; returns `false` if no tokens (return 429 immediately)
- **Per-merchant buckets**: one attacker's exhausted bucket doesn't affect other merchants
- `LoadingCache<String, Bucket>`: Caffeine cache — creates bucket lazily per merchant key
- **429 Too Many Requests**: standard HTTP rate limit response (RFC 6585)
- `Retry-After: 60`: tells client when to retry (RFC 7231) — always include
- `X-RateLimit-Limit / X-RateLimit-Remaining / X-RateLimit-Reset`: inform client of quota state
- **In-memory vs Redis**: per-pod buckets × pod count = actual limit; Redis-backed = shared exact limit
- `X-API-Key` filter: 401 (missing) vs 403 (invalid); sets merchantId attribute for downstream
- **Idempotency key**: `X-Idempotency-Key` header — prevents duplicate payments on client retry
- Cache idempotency keys 24h in Redis (or Caffeine for single-instance)
- Micrometer `rate.limit.exceeded` counter with merchant tag → PromQL alert on abuse

## Files: topic.json (~11KB), exercises.json (~28KB), project.json (~2KB), README.md
