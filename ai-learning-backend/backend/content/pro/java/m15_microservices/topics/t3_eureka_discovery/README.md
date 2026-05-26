# Topic 15.3: Eureka Service Discovery

**Module**: M15 - Microservices Architecture
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T15.2 (Feign Client)

---

## What This Topic Teaches

1. Service discovery problem — why hardcoded URLs fail in production
2. Eureka Server — `@EnableEurekaServer` + port 8761
3. `eureka.client.register-with-eureka=false` — server doesn't join its own registry
4. `eureka.client.fetch-registry=false` — server doesn't fetch from itself
5. `eureka.server.enable-self-preservation=false` — disable in dev
6. `@EnableDiscoveryClient` — register service with Eureka on startup
7. `spring.application.name=market-service` — the service's identity in the registry
8. `eureka.client.service-url.defaultZone=http://localhost:8761/eureka/` — where is Eureka?
9. `eureka.instance.lease-renewal-interval-in-seconds=10` — heartbeat frequency
10. `eureka.instance.lease-expiration-duration-in-seconds=30` — time to deregister dead instance
11. `eureka.instance.prefer-ip-address=true` — show IP not hostname in dashboard
12. `eureka.instance.instance-id=${name}:${port}` — unique ID per instance
13. Remove `url=` from `@FeignClient` — Feign uses Eureka for discovery
14. `spring-cloud-starter-loadbalancer` — required for url-less Feign
15. Round-robin load balancing — automatic across multiple instances
16. `DiscoveryClient` — programmatic registry access
17. `eureka.client.healthcheck.enabled=true` — Actuator health → Eureka status
18. `eureka.instance.metadata-map.KEY=VALUE` — custom metadata per instance
19. Testing: `eureka.client.enabled=false` + `@MockBean FeignClient`

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Platform — Eureka Integrated |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
3 market-service instances with dynamic IPs in Kubernetes. Hardcoded URLs fail. Eureka: each instance registers itself. Feign clients ask Eureka by name. No IP anywhere in code.

### 📚 Teaching (4 Sub-sections)
1. **Eureka Server**: @EnableEurekaServer, properties, dashboard
2. **Client registration**: @EnableDiscoveryClient, spring.application.name, heartbeat
3. **Feign + Eureka**: remove url=, spring-cloud-starter-loadbalancer, round-robin
4. **Config details**: instance ID, metadata, health integration, dev vs prod

### 🛠️ Worked Example: Three-service discovery
eureka-server + market-service + order-service. Remove url= from Feign. Two market-service instances → round-robin demonstrated in logs.

### ⚠️ 3 Common Gaps
1. **name_mismatch** — @FeignClient name must equal spring.application.name
2. **missing_loadbalancer_dependency** — url-less Feign needs spring-cloud-starter-loadbalancer
3. **startup_order** — Eureka must be fully started before services register

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 8 (60 XP)**: Complete three-service setup — all configs
- **Ex 11 (65 XP)**: Eureka + Actuator health integration
- **Ex 13 (70 XP)**: RegistryController using DiscoveryClient
- **Ex 14 (70 XP)**: Instance metadata for blue-green deployment
- **Ex 15 (95 XP)**: Full Zerodha platform — eureka-server + 2 services + 2 tests

### 🚀 Mini-Project: Zerodha Platform — Eureka Integrated
Three separate Spring Boot apps. No hardcoded URLs. Load balancing with two market-service instances. Tests with Eureka disabled and @MockBean.

---

## The Discovery Pattern

```
BEFORE (hardcoded):
@FeignClient(name="market-service", url="http://localhost:8081")  ← fragile!

AFTER (discovery):
# eureka-server: @EnableEurekaServer, port=8761

# market-service:
spring.application.name=market-service
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# order-service:
@FeignClient(name="market-service")  ← no url=!
# spring-cloud-starter-loadbalancer in pom.xml

# Runtime:
# 1. market-service-1 (8081) registers as "MARKET-SERVICE"
# 2. market-service-2 (8082) registers as "MARKET-SERVICE"
# 3. marketClient.getQuote("TCS") → Eureka: [{8081}, {8082}] → load balanced
```

---

## The Four Must-Have Properties Per Service

```properties
# Every microservice with Eureka client:
spring.application.name=my-service               # identity in registry
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.lease-renewal-interval-in-seconds=10
eureka.instance.instance-id=${spring.application.name}:${server.port}

# Eureka Server only:
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

---

## Review Checklist

- [ ] Three separate Spring Boot projects — not modules in one project
- [ ] spring-cloud-starter-loadbalancer in order-service pom
- [ ] @FeignClient(name=) matches spring.application.name exactly
- [ ] Ex 10: lease expiration → NoInstanceAvailableException → circuit breaker needed
- [ ] Test: eureka.client.enabled=false prevents test from connecting to Eureka

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T15.2 | T15.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~65 min | Stable |
| Word count | ~14K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 745 | 735 | Stable |

**Module 15 Progress**: 3/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 73 topics complete (42.9% of 170)

**Next**: Topic 15.4 — Resilience4j Circuit Breaker
