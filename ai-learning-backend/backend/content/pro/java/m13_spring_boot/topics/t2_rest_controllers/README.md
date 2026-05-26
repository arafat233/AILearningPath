# Topic 13.2: REST Controllers

**Module**: M13 - Spring Boot Fundamentals
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.1 (Spring Boot Intro), T11.3 (JSON with Jackson)

---

## What This Topic Teaches

1. `@RestController` = `@Controller` + `@ResponseBody` — return values become JSON
2. `@RequestMapping("/base")` on class — URL prefix for all methods
3. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` — HTTP method mapping
4. `@PathVariable` — extract `{segment}` from URL path
5. `@RequestParam` — query string parameters (`?key=value`)
6. `@RequestParam(required=false)` — optional query param (null if absent)
7. `@RequestParam(defaultValue="20")` — optional with default
8. `@RequestBody` — deserialize JSON body to Java object (Jackson)
9. `ResponseEntity<T>` — full control over status code + body + headers
10. `ResponseEntity.ok(body)` — 200 + body
11. `ResponseEntity.status(CREATED).body(b)` — 201 + body
12. `ResponseEntity.noContent().build()` — 204, no body
13. `ResponseEntity.notFound().build()` — 404, no body
14. `Optional → ResponseEntity` pattern: `.map(ok).orElse(notFound)`
15. Request/response DTOs — separate input from output records
16. `@WebMvcTest` + `@MockBean` + `MockMvc` — test HTTP layer without server

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Stock Portfolio API |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Spring Boot is running (T13.1) but nothing can call it. @RestController exposes the service layer over HTTP in minutes — GET, POST, PUT, DELETE, all with correct status codes and JSON in/out.

### 📚 Teaching (6 Sub-sections)
1. **@RestController basics**: @Controller + @ResponseBody, JSON auto-serialization
2. **Mapping annotations**: @GetMapping through @DeleteMapping, produces/consumes
3. **@PathVariable and @RequestParam**: URL segments vs query strings, optional/default
4. **@RequestBody and ResponseEntity**: JSON deserialization, status code control
5. **HTTP status codes**: 200/201/204/404/409 — when to use each
6. **Request/response DTOs**: separation of input from output, over-posting prevention

### 🛠️ Worked Example: Product CRUD API
Full five-operation CRUD with in-memory service. Uses Optional → ResponseEntity pattern throughout. curl examples show all endpoints working.

### ⚠️ 3 Common Gaps
1. **returning_200_for_missing_resource** — null → 200 empty body. Use Optional → 404
2. **missing_content_type_header** — POST without Content-Type: application/json → 415
3. **wrong_status_code_for_post** — POST should return 201, not 200

### 💪 15 Exercises (705 XP)
Key exercises:
- **Ex 8 (60 XP)**: Complete 5-endpoint StockController
- **Ex 12 (65 XP)**: @WebMvcTest for GET found/not-found
- **Ex 13 (70 XP)**: BookController + 4 WebMvcTest tests
- **Ex 14 (75 XP)**: Flipkart-style search with pagination
- **Ex 15 (95 XP)**: Razorpay PaymentController + 6 WebMvcTest tests

### 🚀 Mini-Project: Zerodha Stock Portfolio API
6 endpoints, in-memory service, request/response records, query param filters, 5+ @WebMvcTest tests. Portfolio-ready REST API.

---

## The CRUD REST Pattern

```java
@RestController
@RequestMapping("/api/products")
class ProductController {
    private final ProductService service;
    ProductController(ProductService s) { service = s; }

    @GetMapping                        // GET /api/products
    List<Product> getAll() { return service.findAll(); }

    @GetMapping("/{id}")               // GET /api/products/P001
    ResponseEntity<Product> getById(@PathVariable String id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping                       // POST /api/products → 201
    ResponseEntity<Product> create(@RequestBody ProductRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(req));
    }

    @PutMapping("/{id}")               // PUT /api/products/P001 → 200 or 404
    ResponseEntity<Product> update(@PathVariable String id, @RequestBody ProductRequest req) {
        return service.update(id, req).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")            // DELETE /api/products/P001 → 204 or 404
    ResponseEntity<Void> delete(@PathVariable String id) {
        return service.delete(id) ? ResponseEntity.noContent().build()
                                  : ResponseEntity.notFound().build();
    }
}
```

---

## Status Code Quick Reference

| Operation | Success | Not Found |
|-----------|---------|-----------|
| GET all   | 200 OK  | n/a (empty list) |
| GET by ID | 200 OK  | 404 Not Found |
| POST      | 201 Created | n/a |
| PUT       | 200 OK  | 404 Not Found |
| DELETE    | 204 No Content | 404 Not Found |

---

## Review Checklist

- [ ] @RestController = @Controller + @ResponseBody explained
- [ ] Optional → ResponseEntity pattern used in all GET by ID examples
- [ ] POST returns 201 (not 200) — emphasized in common gaps
- [ ] DELETE returns 204 Void (not 200 with body)
- [ ] @WebMvcTest: @MockBean for service, content type on POST
- [ ] Ex 10 status code quiz answers verified

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T13.1 | T13.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~70 min | Stable |
| Word count | ~14K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 685 | 705 | Stable |

**Module 13 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Files**: 4

**Course Progress**: 62 topics complete (36.5% of 170)

**Next**: Topic 13.3 — Spring Data JPA
