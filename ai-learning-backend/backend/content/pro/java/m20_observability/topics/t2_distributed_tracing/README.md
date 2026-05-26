# Topic 20.2: Distributed Tracing

**Module**: M20 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 20 Progress**: 2/5 | **Course Progress**: 97 topics (57.1%)

## Key Concepts
- Trace = one request's journey (same `traceId` across all services)
- Span = one operation (startTime, endTime, tags, errors)
- `micrometer-tracing-bridge-brave` + `zipkin-reporter-brave`
- Custom span: `nextSpan().name()` → `withSpan(span.start())` → `tag/error` → `end()` in finally
- `span.end()` in finally: mandatory — missing end = span never exported
- B3 propagation: auto-added to RestTemplate/WebClient outgoing calls
- `%X{traceId}` in Logback: MDC key set by Micrometer Tracing
- Three pillars working together: metrics (WHAT slow) → traces (WHERE slow) → logs (WHY slow)

## Files: topic.json (~14KB), exercises.json (~32KB), project.json (~3KB), README.md
