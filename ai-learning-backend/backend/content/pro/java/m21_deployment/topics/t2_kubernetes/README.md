# Topic 21.2: Kubernetes Deployments & Services

**Module**: M21 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 21 Progress**: 2/5 | **Course Progress**: 102 topics (60%)

## Key Concepts
- `Deployment`: manages desired state — replicas, image, strategy
- `ReplicaSet`: owned by Deployment; ensures N pods always running
- `Service` (ClusterIP): stable DNS + IP routing to pods via label selector
- Resources: `requests` = scheduling guarantee; `limits` = OOMKill/CPU throttle ceiling
- CPU: `250m` = 0.25 cores; Memory: `512Mi` = 512 mebibytes
- `readinessProbe`: traffic gate — fails → pod removed from Service endpoints
- `livenessProbe`: restart trigger — fails → pod RESTARTED
- **Never include DB in liveness** — DB down → restart → DB still down → CrashLoopBackOff
- `maxUnavailable: 0` + `maxSurge: 1`: zero-downtime rolling update
- `management.health.probes.enabled: true`: separate /readiness and /liveness endpoints
- `HPA`: scales replicas based on CPU/memory; `PDB`: prevents too many evictions at once

## Files: topic.json (~16KB), exercises.json (~32KB), project.json (~3KB), README.md
