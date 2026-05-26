# Topic 20.5: Alerting & SLO Monitoring

**Module**: M20 - Observability  
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T20.4 (Prometheus & Grafana)

---

## What This Topic Teaches

1. SLA: contract with customers. SLO: internal target (stricter). SLI: measured metric.
2. Error budget = 1 - SLO. Quantifies allowed unreliability.
3. When budget > 50% consumed: reliability team alerted. When exhausted: freeze features.
4. Burn rate = current error rate / SLO error rate. How fast budget is consumed.
5. Fast burn alert: 14.4× over 1h+5m windows → page immediately
6. Slow burn alert: 6× over 6h+30m windows → ticket within 1 hour
7. Multi-window: both windows must fire — confirms issue is ongoing, not a fluke
8. Alert on **symptoms** (error rate, p99) not **causes** (CPU, heap, pool%)
9. Every alert needs `for: duration` (prevents flapping) and `runbook_url` (reduces MTTR)
10. Dead man switch: `absent()` fires when metrics STOP — most important alert
11. Alert fatigue: too many alerts → on-call ignores them → real incidents missed
12. Alertmanager routing: critical → PagerDuty (wake up), warning → Slack (check tomorrow)
13. Alertmanager inhibition: suppress symptom alerts when root cause alert fires
14. Silences: temporary suppression during maintenance windows
15. Error budget review: weekly meeting to assess reliability trends

---

## The SLO Framework

```
SLI = sum(good_requests) / sum(total_requests)
Error rate = 1 - SLI
Error budget = 1 - SLO (e.g., 0.001 for 99.9% SLO)
Budget remaining = (1 - error_rate/error_budget) × 100

Fast burn: error_rate > 14.4 × error_budget  → page in < 15 minutes
Slow burn: error_rate > 6 × error_budget     → ticket within 1 hour

Freeze deployments when: budget_remaining < 20%
```

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~12KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~3KB | Razorpay SLO system |
| `README.md` | This file |

---

## Review Checklist

- [ ] Ex 10: all 4 scenarios correctly analyzed (gateway down, pool full, crash, brief spike)
- [ ] Ex 13: Zerodha SLO with correct math (99.95% SLO = 0.0005 budget)
- [ ] Ex 14: all 5 anti-patterns identified and fixed
- [ ] Ex 15: all three tests pass — complete synthesis
- [ ] Dead man switch: `absent()` pattern clearly explained as most important alert

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 20 Progress**: 5/5 topics complete — **MODULE 20 COMPLETE** ✅  
**Course Progress**: 100 topics complete (58.8% of 170)
