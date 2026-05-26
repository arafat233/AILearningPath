# Topic 24.4: Strangler Fig Pattern — Legacy Migration

**Module**: M24 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 24 Progress**: 4/5 | **Course Progress**: 119 topics (70.0%)

## Key Concepts
- **Strangler Fig**: incrementally replace legacy — never big-bang rewrite (too risky)
- **Proxy layer**: `OncePerRequestFilter` or Nginx routes to old or new based on feature flag
- **Feature flag**: `Math.abs(merchantId.hashCode()) % 100 < rolloutPercent` — deterministic
  - Same merchant ALWAYS goes to same service (consistency — hash-based, not random)
  - Beta merchants: `Set.contains(merchantId)` → always new service
  - Rollback: set `rolloutPercent = 0` → instant, no deployment needed
- **Dark launch**: run both systems, compare outputs, user ALWAYS sees legacy result
  - Catches bugs before users see them
  - Side effects in new service must be suppressed (dry-run mode)
- **Migration phases**: Dark Launch → 1% → 5% → 10% → 25% → 50% → 100% → retire legacy
- **Health-gated rollout**: advance only if error rate < 1%; auto-rollback if error > 2%
- **Dual-write DB**: write to both old and new DBs during migration; old = source of truth
- **Contract test**: verify new service returns same schema as legacy
- **Rollback**: feature flag flip → instant back to legacy (no deployment needed)
- **Anti-pattern**: big-bang rewrite, 1-year feature branch, random routing

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
