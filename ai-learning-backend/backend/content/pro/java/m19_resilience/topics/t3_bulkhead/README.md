# Topic 19.3: Bulkhead Isolation

**Module**: M19 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 19 Progress**: 3/5 | **Course Progress**: 93 topics (54.7%)

## Key Concepts
- `@Bulkhead(name, fallbackMethod)`: limits max concurrent calls
- `maxConcurrentCalls`: semaphore count; `maxWaitDuration`: wait before BulkheadFullException
- `type=THREADPOOL`: dedicated thread pool; requires `CompletableFuture` return
- `BulkheadFullException`: fallback receives this when slots are exhausted
- **Annotation order**: `@Bulkhead` (outer) → `@CircuitBreaker` → `@Retry` (inner)
- Isolation: separate bulkheads = independent counters; tracking full ≠ payment blocked

## Files: topic.json (~12KB), exercises.json (~30KB), project.json (~3KB), README.md
