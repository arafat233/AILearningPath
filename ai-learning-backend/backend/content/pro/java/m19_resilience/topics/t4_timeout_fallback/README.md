# Topic 19.4: Timeout & Fallback Strategies

**Module**: M19 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 19 Progress**: 4/5 | **Course Progress**: 94 topics (55.3%)

## Key Concepts
- `@TimeLimiter(name, fallbackMethod)`: bounds max duration; requires `CompletableFuture` return
- `timeoutDuration: 2s` + `cancelRunningFuture: true`: interrupts async thread on timeout
- 5 fallback strategies: static default, cached data, degraded mode, fail-fast, queue-for-retry
- Parallel calls: start all futures BEFORE `.get()` → total time = max(individual), not sum
- HTTP client timeouts: `setConnectTimeout()` + `setReadTimeout()` — separate layer from `@TimeLimiter`
- Stacking: `@TimeLimiter` (outer) → `@CircuitBreaker` (inner): timeout = 1 CB failure

## Files: topic.json (~14KB), exercises.json (~34KB), project.json (~3KB), README.md
