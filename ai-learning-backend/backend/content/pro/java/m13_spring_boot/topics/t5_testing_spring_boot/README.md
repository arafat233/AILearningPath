# Topic 13.5: Testing Spring Boot

**Module**: M13 - Spring Boot Fundamentals
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.4 (Validation + Exceptions), T12.3 (Mockito)

---

## What This Topic Teaches

1. `@WebMvcTest(Controller.class)` — loads HTTP layer only
2. `@MockBean ServiceClass` — Mockito mock in Spring context
3. `MockMvc` — the HTTP test DSL injected by @WebMvcTest
4. `mvc.perform(get/post/put/delete(url))` — build HTTP request
5. `.andExpect(status().isOk()/isCreated()/isNotFound()...)` — assert status
6. `.andExpect(jsonPath("$.field").value(x))` — assert JSON body
7. `jsonPath("$").isArray()` / `jsonPath("$.length()").value(n)` — array assertions
8. `.param("key","value")` — add query parameter
9. `@DataJpaTest` — JPA + H2 slice; auto-rollback per test
10. `@Import(ServiceClass.class)` — add service to @DataJpaTest context
11. `@SpringBootTest(webEnvironment=RANDOM_PORT)` — full stack test
12. `TestRestTemplate` — HTTP client for @SpringBootTest; no throw on 4xx
13. `@BeforeEach repo.deleteAll()` — manual cleanup in @SpringBootTest
14. `@SpringBootTest(webEnvironment=NONE)` — Spring context without HTTP
15. Test pyramid: 70% Mockito/@WebMvcTest, 20% @DataJpaTest, 10% @SpringBootTest

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Payment Rules Engine — Test Suite Capstone |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
15 minutes of manual Postman testing per change vs automated tests in 500ms. The second you press run and see green, you know everything works.

### 📚 Teaching (5 Sub-sections)
1. **@WebMvcTest**: what it loads, @MockBean for deps, MockMvc DSL
2. **MockMvc**: perform(), andExpect(), jsonPath(), param(), content()
3. **@DataJpaTest**: H2, rollback, @BeforeEach seed, @Import for services
4. **@SpringBootTest**: RANDOM_PORT, TestRestTemplate, cleanup, NONE
5. **Which slice when**: decision table, 70/20/10 rule

### 🛠️ Worked Example: Three-slice Product Test Suite
5 @WebMvcTest tests + 4 @DataJpaTest tests + 1 @SpringBootTest integration test. All pass in ~6 seconds. Demonstrates clean slice separation.

### ⚠️ 3 Common Gaps
1. **missing_mock_bean** — every controller dependency needs @MockBean in @WebMvcTest
2. **not_cleaning_db_in_springboottest** — @BeforeEach repo.deleteAll() is mandatory
3. **springboottest_without_port** — RANDOM_PORT → TestRestTemplate; MOCK → MockMvc

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 7 (55 XP)**: @DataJpaTest with @Import for service testing
- **Ex 11 (65 XP)**: @SpringBootTest RANDOM_PORT full CRUD lifecycle
- **Ex 12 (65 XP)**: Complete controller test suite — 6 scenarios
- **Ex 13 (70 XP)**: All three slices for the same API
- **Ex 15 (95 XP)**: Complete test pyramid — 7+ tests across all layers

### 🚀 Module 13 Capstone: Payment Rules Engine Test Suite
**No AI.** Write only tests — no production code. 13 test methods across three slices. All must pass. Slice separation enforced: @WebMvcTest never hits DB, @DataJpaTest never uses HTTP.

---

## The Test Pyramid

```
         ┌─────────────┐
         │ @SpringBoot │   1 test — full lifecycle
         │ RANDOM_PORT │   slowest (5-10s), fewest
         └──────┬──────┘
        ┌───────┴───────┐
        │  @DataJpaTest │  4 tests — all repository methods
        │               │  medium (2s), for DB queries
        └───────┬───────┘
   ┌────────────┴────────────┐
   │       @WebMvcTest        │   8 tests — all HTTP scenarios
   │   + plain Mockito        │   fastest (<1s), most tests
   └──────────────────────────┘
```

---

## The MockMvc Recipe

```java
// Setup:
@WebMvcTest(MyController.class)
class MyControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @MockBean MyService service;  // ONE per controller dependency

    // GET:
    mvc.perform(get("/api/items/{id}", "I001"))
       .andExpect(status().isOk())
       .andExpect(jsonPath("$.name").value("Widget"));

    // POST with body:
    mvc.perform(post("/api/items")
            .contentType(APPLICATION_JSON)
            .content(mapper.writeValueAsString(requestBody)))
       .andExpect(status().isCreated())
       .andExpect(jsonPath("$.id").exists());

    // DELETE → 204:
    mvc.perform(delete("/api/items/{id}", "I001"))
       .andExpect(status().isNoContent());

    // void method that throws:
    doThrow(new NotFoundException()).when(service).delete("X");
}
```

---

## Module 13 Complete

---

## 📊 Module 13 Statistics

| Topic | Title | XP |
|-------|-------|----|
| 13.1 | Spring Boot Introduction | 685 |
| 13.2 | REST Controllers | ~710 |
| 13.3 | Spring Data JPA | 735 |
| 13.4 | Validation and Exception Handling | 715 |
| 13.5 | Testing Spring Boot | 720 |
| **TOTAL** | | **~3,565** |

**5 topics · 75 exercises · 5 mini-projects · ~65,000 words**

---

## 🎓 Module 13 — The Spring Boot Arc

```
13.1: @SpringBootApplication + DI + @Value = running Spring Boot app
       ↓
13.2: @RestController + @GetMapping/@PostMapping + ResponseEntity = REST API
       ↓
13.3: @Entity + JpaRepository + derived queries = database persistence
       ↓
13.4: @Valid + @RestControllerAdvice + custom exceptions = production-ready
       ↓
13.5: @WebMvcTest + @DataJpaTest + @SpringBootTest = fully tested stack
```

---

## 📊 Cumulative Course Progress After Module 13

| Metric | After M12 | After M13 |
|--------|-----------|-----------|
| Topics | 60/170 | **65/170 (38.2%)** |
| Total XP | ~43,720 | **~47,285** |
| Exercises | 900 | **975** |
| Projects | 62 | **67** |

---

## Review Checklist

- [ ] @WebMvcTest: @MockBean for every service dependency
- [ ] @DataJpaTest: rollback per test documented
- [ ] @SpringBootTest: repo.deleteAll() in @BeforeEach required
- [ ] Ex 10: rollback prediction correct (count=0)
- [ ] Capstone: no_ai, 3 separate test files

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T13.4 | T13.5 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~70 min | Stable |
| Word count | ~14K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 715 | 720 | Stable |
