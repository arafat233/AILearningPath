# Topic 15.2: Feign Client

**Module**: M15 - Microservices Architecture
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T15.1 (Introduction to Microservices)

---

## What This Topic Teaches

1. `@EnableFeignClients` on @SpringBootApplication — activates proxy generation
2. `@FeignClient(name="svc", url="${url}")` — declares an HTTP client interface
3. Same Spring MVC annotations: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
4. `@PathVariable` — substituted into the URL path
5. `@RequestParam` — builds the query string automatically
6. `@RequestBody` — serialized as JSON request body
7. `@RequestHeader("X-Key")` — adds custom header to this call
8. Spring generates proxy implementing the interface — inject by type
9. `ErrorDecoder` interface — maps HTTP status to domain exceptions (write once)
10. `@FeignClient(configuration=Config.class)` — per-client config
11. `RequestInterceptor` — adds headers/params to ALL calls from a client
12. Timeout: `spring.cloud.openfeign.client.config.{name}.connect-timeout`
13. Logger: `spring.cloud.openfeign.client.config.{name}.logger-level=FULL`
14. `WireMock` — HTTP stub server for testing Feign clients
15. `wireMock.stubFor(get(url).willReturn(okJson(body)))` — stub a response
16. `withHeader("key", matching(".+"))` — assert header was sent
17. `@TestPropertySource(properties="url=http://localhost:PORT")` — point Feign to WireMock
18. `@MockBean FeignClient` — replace Feign with Mockito mock in @WebMvcTest

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Feign Client Upgrade |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
RestTemplate: 20 lines with URL building, try-catch, manual response handling per method. Feign: one interface declaration, Spring writes the rest.

### 📚 Teaching (4 Sub-sections)
1. **Setup**: spring-cloud-starter-openfeign, @EnableFeignClients
2. **Interface declaration**: @FeignClient, all HTTP method annotations, @RequestHeader
3. **Error handling**: ErrorDecoder — one class for all errors
4. **Config + testing**: timeouts, FULL logging, WireMock vs @MockBean

### 🛠️ Worked Example: RestTemplate → Feign Refactor
Order-service market client replaced. TradeService injects interface. ErrorDecoder handles 404/503. WireMock tests all scenarios.

### ⚠️ 3 Common Gaps
1. **missing_enable_feign_clients** — proxy not generated, injection fails
2. **feign_interface_not_public** — can't generate proxy for package-private interface
3. **no_error_decoder** — FeignException becomes 500 without mapping

### 💪 15 Exercises (745 XP)
Key exercises:
- **Ex 8 (65 XP)**: WireMock @SpringBootTest — tests the Feign client itself
- **Ex 12 (70 XP)**: RequestInterceptor (JWT) + WireMock header assertion
- **Ex 13 (75 XP)**: Full Razorpay payment Feign client with 4 error tests
- **Ex 14 (75 XP)**: 3 Feign clients in one orchestration service
- **Ex 15 (95 XP)**: Portfolio Feign service — 2 clients, error decoder, 4 tests

### 🚀 Mini-Project: Zerodha Trading — Feign Client Upgrade
Replace RestTemplate with Feign. ErrorDecoder (3 exceptions). CorrelationIdInterceptor. Per-client timeouts. 5 WireMock tests.

---

## The Feign Pattern

```java
// 1. Enable:
@SpringBootApplication @EnableFeignClients

// 2. Declare (same annotations as @RestController):
@FeignClient(name="market-service", url="${market.url}", configuration=MarketConfig.class)
public interface MarketServiceClient {
    @GetMapping("/api/stocks/{symbol}/quote")
    StockQuote getQuote(@PathVariable String symbol, @RequestParam String currency);
    
    @PostMapping("/api/stocks/{symbol}/reserve")
    void reserveShares(@PathVariable String symbol, @RequestParam int qty);
}

// 3. Configure (error decoder + interceptor):
@Configuration class MarketConfig {
    @Bean ErrorDecoder errorDecoder() {
        return (m, r) -> switch(r.status()) {
            case 404 -> new SymbolNotFoundException("not found");
            case 503 -> new ServiceDownException("down");
            default  -> new RuntimeException("error: " + r.status());
        };
    }
    @Bean RequestInterceptor correlationId() {
        return t -> t.header("X-Correlation-Id", UUID.randomUUID().toString());
    }
}

// 4. Inject and use (looks local, makes HTTP):
StockQuote quote = marketClient.getQuote("TCS", "INR");

// 5. Test with WireMock:
wireMock.stubFor(get("/api/stocks/TCS/quote?currency=INR")
    .willReturn(okJson("{\"symbol\":\"TCS\",\"price\":3890}")));
```

---

## RestTemplate vs Feign

| Aspect | RestTemplate | Feign Client |
|--------|-------------|-------------|
| Style | Imperative (write the call) | Declarative (declare the contract) |
| URL | Manual string concat | @PathVariable / @RequestParam auto |
| Errors | try-catch per method | ErrorDecoder (once per client) |
| Eureka | Manual URL | name= → auto discovery |
| Testing | MockRestServiceServer | WireMock or @MockBean |

---

## Review Checklist

- [ ] @EnableFeignClients: must be present or interface not detected
- [ ] public interface: Feign can't proxy package-private interfaces
- [ ] Ex 10: FeignException propagates as 500 without ErrorDecoder — correct
- [ ] WireMock port: different from service ports to avoid conflicts
- [ ] @RequestHeader vs RequestInterceptor: per-method vs all-calls

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T15.1 | T15.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~15K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 745 | 745 | Same |

**Module 15 Progress**: 2/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 72 topics complete (42.4% of 170)

**Next**: Topic 15.3 — Eureka Service Discovery
