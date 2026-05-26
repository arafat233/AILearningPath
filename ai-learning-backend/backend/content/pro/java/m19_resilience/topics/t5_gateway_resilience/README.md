# Topic 19.5: Spring Cloud Gateway with Resilience

**Module**: M19 - Microservice Resilience  
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T19.4 (Timeout & Fallback Strategies)

---

## What This Topic Teaches

1. API Gateway: single entry point that applies resilience to ALL microservices centrally
2. `spring-cloud-starter-gateway` — reactive (WebFlux), NOT compatible with `spring-boot-starter-web`
3. Route config: `id`, `uri: lb://service-name`, `predicates: [Path=...]`, `filters: [...]`
4. `CircuitBreaker` filter: `name`, `fallbackUri: forward:/fallback/xxx`
5. `Retry` filter: `retries`, `statuses: SERVICE_UNAVAILABLE`, **`methods: GET`** (NEVER retry POST/PUT/DELETE)
6. `RequestRateLimiter` filter: `redis-rate-limiter.replenishRate`, `burstCapacity`, `key-resolver`
7. `KeyResolver` @Bean: determines rate limit key — API key, user ID, or IP
8. `#{@beanName}`: SpEL expression to reference a bean in YAML
9. `GatewayFallbackController`: in the gateway app itself at `/fallback/*`
10. `spring-boot-starter-data-redis-reactive`: reactive Redis for rate limiter (not regular redis starter)
11. Filter execution order: rate limiter first → CB → retry
12. `forward:/fallback/xxx`: forward to local controller, not redirect
13. Gateway-level resilience: protects incoming requests to your services
14. Service-level resilience (`@CircuitBreaker`): protects outgoing calls FROM your service
15. `RewritePath`, `AddRequestHeader`, `StripPrefix`: path and header manipulation filters
16. `management.endpoints.web.exposure.include: gateway`: exposes `/actuator/gateway/routes`
17. `POST /actuator/gateway/refresh`: hot-reload routes without restart
18. `RouteDefinitionRepository` + `RefreshRoutesEvent`: dynamic route management
19. `lb://service-name`: Spring Cloud LoadBalancer for load-balanced routing
20. CB + LoadBalancer: circuit opens when ALL instances of a service are failing

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~15KB | Main content |
| `exercises.json` | ~34KB | 15 exercises |
| `project.json` | ~3KB | Razorpay API Gateway |
| `README.md` | This file |

---

## The Complete Gateway Pattern

```yaml
# application.yml
spring.cloud.gateway.routes:
  - id: payment-service
    uri: lb://payment-service
    predicates:
      - Path=/api/payments/**
    filters:
      - name: RequestRateLimiter          # 1st: cheapest rejection
        args:
          redis-rate-limiter.replenishRate: 100
          redis-rate-limiter.burstCapacity: 150
          key-resolver: '#{@apiKeyResolver}'   # SpEL bean reference
      - name: CircuitBreaker              # 2nd: fast-fail if service struggling
        args:
          name: payment-cb
          fallbackUri: forward:/fallback/payments
      - name: Retry                       # 3rd: retry transient failures
        args:
          retries: 2
          statuses: SERVICE_UNAVAILABLE
          methods: GET                    # ← CRITICAL: never retry POST!
```

---

## Gateway vs Service-Level Resilience

| Concern | Gateway Level | Service Level |
|---------|--------------|---------------|
| Rate limit incoming external traffic | ✅ | ✗ |
| CB for external API called by service | ✗ | ✅ `@CircuitBreaker` |
| CB for DB calls | ✗ | ✅ |
| Retry POST/PUT | Never | With idempotency key only |
| Retry GET | ✅ Gateway Retry filter | ✅ `@Retry` |

---

## Review Checklist

- [ ] `methods: GET` on Retry: prominently called out — common dangerous mistake
- [ ] Reactive stack: `spring-boot-starter-data-redis-reactive` emphasized
- [ ] `forward:/fallback/xxx`: fallback routes to SAME gateway app
- [ ] Ex 10: gateway vs service-level analysis complete
- [ ] Ex 15: M19 full synthesis — all 4 patterns combined

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] NEEDS REVISION

**Module 19 Progress**: 5/5 topics complete — **MODULE 19 COMPLETE** ✅  
**Course Progress**: 95 topics complete (55.9% of 170)
