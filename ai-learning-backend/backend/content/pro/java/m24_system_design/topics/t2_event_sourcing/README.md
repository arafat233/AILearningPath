# Topic 24.2: Event Sourcing

**Module**: M24 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 24 Progress**: 2/5 | **Course Progress**: 117 topics (68.8%)

## Key Concepts
- **Events as source of truth**: store events (PaymentInitiated) not state (status=FAILED)
- Events are **past tense**, immutable, **append-only** — never updated or deleted
- `aggregate.reconstruct(events)`: fold events into current state
- Separate `apply(XxxEvent)` per event type: single responsibility state transitions
- **Temporal query**: `stream().limit(N)` → state at event N (audit/dispute resolution)
- **Snapshot**: store state at event N → replay only events after N (performance)
- **Event versioning**: upcasting converts old schema → new schema on read (never modify stored events)
- **Replay**: process all historical events to build new projections added after go-live
- **When to use**: regulatory audit trail, complex state machines, temporal queries needed
- **When not to use**: simple CRUD, ephemeral data (carts), current-state-only requirements
- Optimistic concurrency: `unique(aggregate_id, seq)` → `ConcurrentModificationException` on conflict
- With CQRS: event store = write truth; projections = read models derived from events

## Files: topic.json (~13KB), exercises.json (~28KB), project.json (~2KB), README.md
