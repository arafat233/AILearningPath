# Topic 27.4: GraphQL Subscriptions — Real-Time Data

**Module**: M27 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 27 Progress**: 4/5 | **Course Progress**: 134 topics (78.8%)

## Key Concepts
- **GraphQL subscriptions**: real-time server push over WebSocket (not HTTP)
- **`@SubscriptionMapping`**: like `@QueryMapping` but returns `Flux<T>` — each emission = one message
- `spring.graphql.websocket.path=/graphql-ws` + `spring-boot-starter-websocket` dependency
- **graphql-ws protocol**: handshake over WebSocket (different from graphql-transport-ws)
- **`Flux.interval(Duration.ofSeconds(1))`**: periodic emissions (live prices, heartbeats)
- **`Sinks.many().multicast().onBackpressureBuffer()`**: push-based event bus (Kafka events → subscribers)
- **`.filter(event -> event.id().equals(clientId))`**: route events to the right subscriber
- **`.takeUntil(status::isFinal)`**: inclusive — emits terminal event, then Flux completes
- **`doOnSubscribe` + `doOnCancel`**: lifecycle hooks for registry and cleanup (prevent memory leaks)
- **Backpressure**:
  - `.onBackpressureDrop()` — drop overflow (OK for prices: miss a tick, get the next one)
  - `.onBackpressureBuffer(N)` — buffer N events (payments: can't miss a status change)
- **`StepVerifier`**: Reactor's test tool; `.then()` triggers events after subscription setup
- WebSocket vs polling: 5000 users × 0.5 price changes/s = 2500 pushes/s (vs 10,000 poll/s)
- **Auth in subscriptions**: validate before returning Flux; `Flux.error(SecurityException)` for unauthorized

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
