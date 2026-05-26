# Topic 21.5: Blue-Green & Canary Deployments

**Module**: M21 - Production Deployment  
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T21.4 (CI/CD with GitHub Actions)

---

## What This Topic Teaches

1. Rolling update: default, good for backward-compatible changes
2. Blue-green: two full environments; instant Service selector switch (~1 second); 2× resources
3. Canary: partial traffic split; gradual exposure; least risky for high-impact changes
4. Service selector switch: `kubectl patch service -p '{"spec":{"selector":{"version":"green"}}}'`
5. Nginx Ingress canary annotations: `canary: 'true'` + `canary-weight: '5'`
6. `canary-by-header`: route test traffic to canary without exposing real users (dark launch)
7. Dark launch: `canary-weight: 0` + header routing — validate without real user exposure
8. Canary rollback: patch weight to `'0'` — instant, ~5-10 seconds
9. Blue-green rollback: patch service selector back — ~1-2 seconds
10. Feature flags: application-layer canary; `userId.hashCode() % 100 < rolloutPct`
11. Argo Rollouts: automated progressive delivery with Prometheus-based analysis gates
12. Expand-contract: 4-phase DB migration pattern for zero-downtime schema changes
13. Canary success criteria: error rate < 2× stable, p99 < 1.5× stable
14. Automatic rollback: Prometheus alert + webhook or scheduled Kubernetes job
15. Strategy selection: rolling (low-risk) → canary (medium-risk) → blue-green (breaking changes)

---

## Quick Reference: Which Strategy When?

| Scenario | Strategy | Why |
|----------|----------|-----|
| Algorithm improvement | Canary 5% → 100% | Measure impact, easy rollback |
| DB column rename | Blue-Green + Expand-contract | Breaking change, instant rollback |
| API response format change | Blue-Green | Coordinated cutover with clients |
| Log format update | Rolling Update | Low risk, no user impact |
| A/B test new UI | Feature flag | User-level control |
| Major framework upgrade | Blue-Green | Unknown risks, instant rollback |

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~16KB | Main content |
| `exercises.json` | ~34KB | 15 exercises |
| `project.json` | ~3KB | Razorpay progressive delivery |
| `README.md` | This file |

---

## Review Checklist

- [ ] Ex 1: strategy selection reasoning is sound (blue-green for DB migration, canary for algorithms)
- [ ] Ex 10: rollback timing comparison — blue-green (1-2s) vs canary (5-10s) vs rolling (5-10min)
- [ ] Ex 13: expand-contract pattern — all 4 phases explained
- [ ] Ex 15: M21 synthesis — all 3 tests pass

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 21 Progress**: 5/5 topics complete — **MODULE 21 COMPLETE** ✅  
**Course Progress**: 105 topics complete (61.8% of 170)
