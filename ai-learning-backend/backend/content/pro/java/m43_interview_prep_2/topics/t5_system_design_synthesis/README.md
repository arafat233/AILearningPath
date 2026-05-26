# Topic 5: System Design Synthesis — Full Practice Designs

**Module**: M43 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐

## Key Concepts
- 35-minute SD round: 5 clarify + 5 estimate + 5 API + 10 data+core + 10 scale
- Always draw a diagram: client→LB→app servers→cache→DB→queue
- Trade-off language: 'We chose X over Y because Z, accepting trade-off W'
- Common systems to know cold: URL shortener, chat, feed, payment, search
- Zerodha focus: order matching (in-memory PQ), real-time prices (Kafka+WebSocket)
- Razorpay focus: idempotency, saga pattern, reconciliation, ACID guarantees

## Files: topic.json, exercises.json, project.json, README.md
