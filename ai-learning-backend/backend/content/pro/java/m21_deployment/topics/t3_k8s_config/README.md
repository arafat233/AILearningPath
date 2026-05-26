# Topic 21.3: Kubernetes ConfigMaps, Secrets & Probes

**Module**: M21 | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 21 Progress**: 3/5 | **Course Progress**: 103 topics (60.6%)

## Key Concepts
- `ConfigMap`: non-sensitive config (URLs, log levels, sampling rates)
- `Secret`: sensitive values (passwords, API keys); base64 encoded (NOT encrypted by default!)
- Volume mount at `/app/config/`: Spring Boot auto-reads `application.yml` from there
- `secretKeyRef`: inject specific Secret key as env var
- `server.shutdown: graceful`: finish in-flight requests before JVM exits
- `preStop: sleep 5s`: gives load balancer time to stop routing before app shutdown
- `terminationGracePeriodSeconds: 60`: k8s hard timeout after SIGTERM
- `management.health.probes.enabled: true`: enables separate `/readiness` and `/liveness`
- Env vars from ConfigMap/Secret: never update while pod is running (requires restart)
- Volume-mounted ConfigMap: file updates within ~2 min but Spring doesn't auto-reload

## Files: topic.json (~14KB), exercises.json (~28KB), project.json (~3KB), README.md
