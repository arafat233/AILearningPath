# Topic 24.1: CQRS — Command Query Responsibility Segregation

**Module**: M24 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 24 Progress**: 1/5 | **Course Progress**: 116 topics (68.2%)

## Key Concepts
- **Command**: intent to change state — returns ID only, has side effects (persist + emit event)
- **Query**: read-only — no side effects, returns PortfolioView (denormalized read model)
- **Never return entity from command handler** — return ID; use query to get state
- Write model: normalized, ACID, transactional; Read model: denormalized, pre-aggregated
- `ApplicationEventPublisher.publishEvent()`: Spring event bus (same JVM)
- `@EventListener` on projection: updates read model when command events fire
- `@Async`: projection runs in separate thread (non-blocking for command handler)
- **Eventual consistency**: read model may lag briefly — acceptable for dashboards
- **202 Accepted** (not 200 OK) for command endpoints — async intent pattern
- Multiple projections: one event → many independent read model updates
- **Use CQRS when**: read/write ratio > 10:1 OR optimizations conflict
- **Don't use when**: simple CRUD, small apps, strong read-after-write consistency required
- Kafka: for cross-service CQRS; Spring Events: for same-service CQRS

## Files: topic.json (~13KB), exercises.json (~30KB), project.json (~2KB), README.md
