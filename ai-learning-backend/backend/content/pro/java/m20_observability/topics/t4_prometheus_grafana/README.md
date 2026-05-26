# Topic 20.4: Prometheus & Grafana Dashboards

**Module**: M20 | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 20 Progress**: 4/5 | **Course Progress**: 99 topics (58.2%)

## Key Concepts
- `rate(counter[5m])`: average rate per second over 5-minute window
- Error rate%: `sum(rate({status='failure'}[5m])) / sum(rate([5m])) * 100`
- `histogram_quantile(0.99, sum(rate(_bucket[5m])) by (le))`: correct multi-instance p99
- Pre-computed percentiles (`publishPercentiles`): easy setup, per-instance only
- `publishPercentileHistogram()`: enables `histogram_quantile`, needs more Prometheus storage
- **Cannot average percentiles**: `avg(p99_instance1, p99_instance2)` is statistically wrong
- Recording rules: pre-compute expensive PromQL for fast dashboards
- SLI (Service Level Indicator): the measured metric; SLO: the target; Error budget: 1 - SLO
- Grafana alert `for: 5m`: prevents alerting on brief spikes
- Alertmanager routing: critical → PagerDuty, warning → Slack only

## Files: topic.json (~10KB), exercises.json (~30KB), project.json (~3KB), README.md
