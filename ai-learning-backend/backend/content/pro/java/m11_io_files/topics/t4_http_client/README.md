# Topic 11.4: Java HttpClient

**Module**: M11 - I/O, Files, and Networking
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T11.3 (CSV/JSON), T8.5 (Optional)

---

## What This Topic Teaches

1. `HttpClient` — Java 11+ built-in HTTP client
2. `HttpClient.newBuilder()` — configure timeout, redirects, HTTP version
3. `HttpClient` as a singleton (thread-safe, manages connection pool)
4. `HttpRequest.newBuilder()` fluent chain
5. `.GET()`, `.POST(body)`, `.PUT(body)`, `.DELETE()` — four HTTP methods
6. `HttpRequest.BodyPublishers.ofString(json)` — POST/PUT body
7. `.header(key, value)` — setting request headers
8. `.timeout(Duration)` — per-request timeout
9. `client.send(request, BodyHandlers.ofString())` → `HttpResponse<String>`
10. `response.statusCode()`, `response.body()`, `response.headers()`
11. Auth patterns: Bearer token, Basic auth (Base64), API key header
12. Status code handling: 200/201/204, 4xx, 5xx
13. `IOException` + `InterruptedException` — the two checked exceptions
14. Jackson integration: readTree/readValue on response.body()

**Note on exercises**: Java HttpClient requires live network access. All exercises use simulated responses — the identical patterns used with real HTTP calls.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Multi-API Data Aggregator |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Old URLConnection required 10+ lines of boilerplate. Java 11+ HttpClient: 4 lines — build client, build request, send, read body. Clean, composable, HTTP/2 capable.

### 📚 Teaching (6 Sub-sections)
1. **Creating HttpClient**: builder, singleton pattern, timeouts
2. **Building requests**: fluent builder for all 4 HTTP methods, headers, body
3. **Reading responses**: statusCode, body, headers, BodyHandlers
4. **Auth headers**: Bearer (JWT), Basic (Base64), API key
5. **Error handling**: switch on statusCode, IOException, InterruptedException
6. **POST with Jackson**: serialize request body, parse response body

### 🛠️ Worked Example: Stock Dashboard
Simulated GET requests for stock quotes, parsed with Jackson JsonNode. POST to create a watchlist with Jackson-built body. Demonstrates singleton pattern and all response handling.

### ⚠️ 3 Common Gaps
1. **httpclient_per_request** — singleton! never create per call
2. **not_checking_status_code** — always check before parsing body
3. **forgetting_content_type_on_post** — HTTP 415 without Content-Type header

### 💪 15 Exercises (690 XP)
Key exercises:
- **Ex 5 (35 XP)**: Status code switch — 200/201/404/429/500
- **Ex 6 (35 XP)**: Basic auth Base64 encoding
- **Ex 13 (70 XP)**: 429 retry logic with backoff
- **Ex 14 (70 XP)**: Nested JSON parsing (weather API style)
- **Ex 15 (95 XP)**: Full POST → GET payment flow

### 🚀 Mini-Project: Multi-API Data Aggregator
5 products fetched from 3 simulated APIs each. P003 simulates 404 (graceful degradation). Results aggregated, written to product_report.json. POST search demonstrated.

---

## The Pattern to Memorise

```java
// Singletons — create ONCE:
private static final HttpClient HTTP = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(10))
    .build();
private static final ObjectMapper MAPPER = new ObjectMapper();

// GET request:
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .GET()
    .header("Authorization", "Bearer " + token)
    .header("Accept", "application/json")
    .timeout(Duration.ofSeconds(5))
    .build();

// Send and handle:
try {
    HttpResponse<String> response = HTTP.send(request, BodyHandlers.ofString());
    switch (response.statusCode()) {
        case 200 -> { JsonNode data = MAPPER.readTree(response.body()); /* use data */ }
        case 404 -> System.out.println("Not found");
        default  -> System.err.println("Error: " + response.statusCode());
    }
} catch (IOException e)          { System.err.println("Network: " + e.getMessage()); }
  catch (InterruptedException e) { Thread.currentThread().interrupt(); }

// POST:
String body = MAPPER.writeValueAsString(requestObject);
HttpRequest post = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .header("Content-Type", "application/json")
    .build();
```

---

## Review Checklist

- [ ] HttpClient singleton clearly emphasized
- [ ] Both checked exceptions (IOException + InterruptedException) covered
- [ ] Content-Type required on POST highlighted
- [ ] All exercises use simulated responses (noted in ex descriptions)
- [ ] Ex 6 Base64 encoding verified: "razorpay:secret123" → cmF6b3JwYXk6c2VjcmV0MTIz
- [ ] Ex 13 retry logic: simulate returns 429 twice then 200

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T11.3 | T11.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~14K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 710 | 690 | Slightly lower (simpler topic) |

**Module 11 Progress**: 4/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Files**: 4

**Course Progress**: 54 topics complete (31.8% of 170)

**Next**: Topic 11.5 — Async I/O with HttpClient + CompletableFuture (Module 11 Final)
