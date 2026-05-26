# Topic 2: Scalability Patterns — Caching, Queues, CDN

**Module**: M43 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- Cache-aside: app checks cache first; on miss: DB → cache. Simple and flexible
- Write-through: write to cache AND DB synchronously. Consistent but slower writes
- Message queues: decouple services, absorb traffic spikes, enable async processing
- CDN: static assets from edge servers; reduces origin load; global latency
- Database replication: master for writes, replicas for reads; lag is trade-off
- Sharding: split data by key; consistent hashing avoids resharding pain

## Files: topic.json, exercises.json, project.json, README.md
