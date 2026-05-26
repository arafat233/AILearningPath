# Topic 15.1: Introduction to Microservices Architecture

**Module**: M15 - Microservices Architecture
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T14.5 (Actuator and Production Observability)

---

## 🚀 Module 15 Begins — The Architecture of Scale

After two modules of Spring Boot mastery (M13-M14), Module 15 graduates students from building one application to building systems of applications. This is how every large Indian tech company is built.

---

## What This Topic Teaches

1. Monolith vs microservices — tradeoffs, when to use each
2. Domain-driven decomposition — how to identify service boundaries
3. Data isolation — each service owns its own database (most important rule)
4. Synchronous vs asynchronous communication — when to use each
5. `RestTemplate` — Spring's HTTP client for calling other services
6. `getForObject(url, Class)` — GET and deserialize
7. `postForObject(url, body, Class)` — POST with body and deserialize
8. `getForEntity` / `postForEntity` — returns `ResponseEntity<T>` with status code
9. `exchange(url, method, HttpEntity, Class)` — any method + custom headers
10. `rt.delete(url)` — DELETE inter-service call
11. `HttpClientErrorException.NotFound` — handling 404 from downstream
12. `HttpClientErrorException.Conflict` — handling 409 from downstream
13. `ResourceAccessException` — connection refused / service down
14. `MockRestServiceServer` — test inter-service calls without real HTTP
15. `withSuccess(json, mediaType)` — mock 200 response
16. `withException(new IOException())` — simulate connection failure
17. Inter-service DTOs — expose minimal, stable interface
18. `ClientHttpRequestInterceptor` — intercept all RestTemplate calls (token forwarding)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Trading Two-Service Architecture |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Flipkart monolith (2010): one deploy, everything coupled. Flipkart microservices (2015): hundreds of independent services. Same transformation at Swiggy, Zerodha, Razorpay — and the pattern starts right here.

### 📚 Teaching (4 Sub-sections)
1. **Monolith vs microservices**: tradeoff table, when to use, decomposition by domain
2. **Inter-service communication**: sync vs async, choosing the right pattern
3. **RestTemplate**: getForObject, postForObject, exchange, error handling
4. **Data isolation**: the most important rule, the shared-DB antipattern

### 🛠️ Worked Example: product-service + order-service
Two separate Spring Boot apps. order-service calls product-service's availability endpoint before placing an order. Each with its own H2 database. No shared code.

### ⚠️ 3 Common Gaps
1. **shared_database** — the #1 microservices antipattern
2. **too_fine_grained** — more services than developers
3. **synchronous_for_everything** — async for notifications, logging, analytics

### 💪 15 Exercises (745 XP)
Key exercises:
- **Ex 8 (65 XP)**: MockRestServiceServer — 3 scenarios (success, out of stock, service down)
- **Ex 12 (65 XP)**: exchange() with custom headers (API key, idempotency key)
- **Ex 13 (75 XP)**: Full two-service integration with 3 MockRestServiceServer tests
- **Ex 14 (70 XP)**: JWT propagation across services with ClientHttpRequestInterceptor
- **Ex 15 (95 XP)**: Swiggy-style 3-service orchestration with 4 test scenarios

### 🚀 Mini-Project: Zerodha Trading Two-Service Architecture
market-service + order-service. RestTemplate integration. 5 MockRestServiceServer tests. Independent databases. Trade validation (stock tradeable, shares available).

---

## The Core Pattern

```java
// Two separate Spring Boot apps:
// market-service (port 8081), order-service (port 8082)

// In order-service — call market-service:
@Bean RestTemplate restTemplate() { return new RestTemplate(); }

@Service class TradeService {
    private final RestTemplate rt;
    
    public TradeOrder executeTrade(String symbol, int qty) {
        // Call market-service synchronously:
        StockQuote quote = rt.getForObject(
            "http://localhost:8081/api/stocks/" + symbol + "/quote",
            StockQuote.class);
        
        if (!quote.tradeable()) throw new IllegalStateException(symbol + " not tradeable");
        return orderRepo.save(new TradeOrder(symbol, qty, quote.price()));
    }
}

// Test without real HTTP:
@SpringBootTest(webEnvironment=NONE)
class TradeServiceTest {
    @Autowired TradeService svc; @Autowired RestTemplate rt;
    MockRestServiceServer server;
    @BeforeEach void setup() { server = MockRestServiceServer.createServer(rt); }
    
    @Test void success() {
        server.expect(requestTo("http://localhost:8081/api/stocks/TCS/quote"))
              .andRespond(withSuccess("{tradeable:true, price:3890}", APPLICATION_JSON));
        assertNotNull(svc.executeTrade("TCS", 10));
    }
}
```

---

## Module 15 Arc (5 Topics)

```
15.1: RestTemplate — basic service-to-service HTTP calls       ← YOU ARE HERE
15.2: Feign Client — declarative HTTP (cleaner than RestTemplate)
15.3: Eureka Service Discovery — services find each other by name
15.4: Resilience4j Circuit Breaker — fail gracefully when services are down
15.5: Distributed Tracing — follow a request across services
```

---

## Review Checklist

- [ ] Data isolation: each service owns its own DB — emphasized as #1 rule
- [ ] Ex 10: shared DB antipattern — correctly identified all 3 problems
- [ ] MockRestServiceServer: setup in @BeforeEach, not @BeforeAll
- [ ] withException(): simulates network failure (not HTTP error)
- [ ] Sync vs async: correct mapping for all 6 scenarios in Ex 1

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M14 avg | T15.1 | Trend |
|--------|---------|-------|-------|
| Generation time | ~63 min | ~70 min | Slightly more (complex topic) |
| Word count | ~13,800 | ~15K | Higher (conceptual + code) |
| Exercises | 15 | 15 | Consistent |
| XP available | ~727 | 745 | Stable |

**Module 15 Progress**: 1/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 71 topics complete (41.8% of 170)
- **Total output files**: 314

**Next**: Topic 15.2 — Feign Client
