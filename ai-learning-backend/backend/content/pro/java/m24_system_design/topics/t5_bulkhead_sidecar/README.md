# Topic 24.5: Bulkhead & Sidecar Patterns

**Module**: M24 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 24 Progress**: 5/5 ✅ | **Course Progress**: 120 topics (70.6%)

## Key Concepts

### Bulkhead Pattern
- **Problem**: one slow downstream (HDFC 10s timeout) consumes all threads → VISA also fails
- **Solution**: isolated thread pool / semaphore per dependency
- `BulkheadConfig.custom().maxConcurrentCalls(N).maxWaitDuration(0ms)`: 0ms = immediate rejection
- `bulkhead.tryAcquirePermission()`: non-blocking acquire; `false` = full → return fallback
- `bulkhead.onComplete()` in **finally**: ALWAYS release the permit (even on exception)
- **Semaphore bulkhead**: limits concurrency, same Tomcat threads — for non-blocking I/O
- **ThreadPool bulkhead**: HDFC gets its own threads — for blocking I/O (RestTemplate, JDBC)
- `@Bulkhead(name=..., fallbackMethod=...)`: annotation-based (AOP); fallback gets `BulkheadFullException`
- **Little's Law sizing**: `concurrent_calls = throughput/s × latency_s`; add 20% buffer
- **Micrometer**: `bulkhead.available_calls` Gauge + `bulkhead.rejected_calls` Counter per gateway
- **With @CircuitBreaker**: CB is outer (stops dead services), Bulkhead is inner (limits concurrency)

### Sidecar Pattern
- **Definition**: auxiliary container in same k8s Pod (shared localhost network + volumes)
- **Fluent Bit sidecar**: reads log files from shared volume → ships to Elasticsearch (no SDK in app)
- **Envoy proxy sidecar**: intercepts all traffic → adds mTLS, circuit breaker, retries, tracing
- **Vault Agent sidecar**: fetches secrets from Vault → writes to file → app reads via `@Value`
- **Service mesh** (Istio/Linkerd): auto-injects Envoy into every pod — zero app code changes
- **Why sidecar vs library**: language-agnostic; one change affects all services; app stays clean

## Files: topic.json (~13KB), exercises.json (~28KB), project.json (~2KB), README.md
