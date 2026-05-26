# Topic 24.3: Saga Pattern — Distributed Transactions

**Module**: M24 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 24 Progress**: 3/5 | **Course Progress**: 118 topics (69.4%)

## Key Concepts
- **Saga**: long-running distributed transaction split into local transactions + compensating transactions
- **Orchestration**: central coordinator drives steps (easy to follow, single point of failure)
- **Choreography**: services react to events (decoupled, hard to visualize complete flow)
- **Compensate only COMPLETED steps** — never compensate the failing step itself (nothing was done)
- **Compensate in REVERSE order**: Step 3 → Step 2 → Step 1 (respects dependencies)
- **Idempotent compensations**: calling twice = same result (safe if orchestrator restarts)
  - Pattern: `Set<String> processedIds` — check before acting
- **Saga log**: persist STARTED before each step; COMPLETED after — enables crash recovery
- **2PC alternative**: impossible for cross-system sagas (payment gateways don't support distributed locks)
- **Irreversible steps**: email/SMS — put LAST in saga; compensate with follow-up message
- **SagaStateMachine**: `Map<SagaStatus, Set<SagaStatus>>` — prevent invalid state transitions
- Micrometer `saga.completed` counter (outcome tag) + `saga.duration` timer
- **At-least-once + idempotency key**: retry safe; gateway deduplicates on same key

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
