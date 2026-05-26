# Topic 21.1: Dockerfile & Docker Compose for Spring Boot

**Module**: M21 - Production Deployment  
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T20.1 (Spring Boot Actuator)

---

## 🆕 Module 21 Begins — Production Deployment

After building observable services (M20), Module 21 covers **running them in production**. Containerization, Kubernetes, CI/CD, blue-green deployments.

---

## What This Topic Teaches

1. Docker image = immutable, portable artifact. Same in dev, CI, staging, production.
2. Multi-stage Dockerfile: JDK builder (compile) → JRE runtime (smaller, more secure)
3. Layered Spring Boot jar: 4 Docker layers (dependencies/loader/snapshot/application) → faster rebuilds
4. `eclipse-temurin:21-jre-alpine`: official OpenJDK distribution, Alpine-based (~190MB)
5. Non-root user: `adduser` + `USER` — security best practice, limits blast radius
6. `-XX:MaxRAMPercentage=75.0`: heap = 75% of container memory limit (not host RAM!)
7. `-XX:+UseContainerSupport`: enables container-aware resource detection
8. `-Djava.security.egd=file:/dev/./urandom`: non-blocking entropy for Docker containers
9. `.dockerignore`: excludes `target/`, `.git/` — prevents bloated build context
10. `pom.xml → dependency:go-offline → src → package`: optimized layer order for cache
11. `docker-compose.yml`: defines multi-service local dev stack
12. `condition: service_healthy`: waits for healthcheck before starting dependent services
13. `pg_isready` / `redis-cli ping`: healthcheck commands for Postgres and Redis
14. `SPRING_PROFILES_ACTIVE: docker`: activates `application-docker.yml` with service URLs
15. Service names = hostnames: `postgres`, `redis`, `zipkin` resolve via Docker DNS
16. Named volumes: `pgdata:` persists Postgres data across `compose down`
17. `${VAR:-default}`: env var with fallback — never hardcode passwords in compose
18. `start_period: 60s`: wait before first healthcheck — Spring Boot needs ~30s to start
19. Container memory limit: heap must fit within container memory (OOMKill if exceeded)
20. `docker compose up --build`: build image and start all services with one command

---

## The Production Dockerfile Pattern

```dockerfile
# Stage 1: Builder (JDK)
FROM eclipse-temurin:21-jdk-alpine AS builder
COPY pom.xml . && RUN ./mvnw dependency:go-offline  # cache deps
COPY src ./src && RUN ./mvnw package -DskipTests
RUN java -Djarmode=layertools -jar target/*.jar extract

# Stage 2: Runtime (JRE)
FROM eclipse-temurin:21-jre-alpine
RUN addgroup --system app && adduser --system --ingroup app app
USER app
COPY --from=builder /build/dependencies/ ./      # rarely changes
COPY --from=builder /build/spring-boot-loader/ ./ 
COPY --from=builder /build/snapshot-dependencies/ ./
COPY --from=builder /build/application/ ./       # changes every build
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseContainerSupport", ...]
```

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~18KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~4KB | Razorpay production container |
| `README.md` | This file |

---

## Review Checklist

- [ ] Ex 8: Docker cache optimization — layer order explanation clear
- [ ] Ex 10: depends_on without service_healthy failure scenario — concrete error message shown
- [ ] Ex 14: OOMKilled diagnosis with concrete steps
- [ ] Ex 15: All 3 tests pass — synthesis complete
- [ ] JVM flags: all three explained (MaxRAMPercentage, UseContainerSupport, urandom)

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 21 Progress**: 1/5 topics complete  
**Course Progress**: 101 topics complete (59.4% of 170)
