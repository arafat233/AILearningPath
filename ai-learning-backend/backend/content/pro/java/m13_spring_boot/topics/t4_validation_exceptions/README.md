# Topic 13.4: Validation and Exception Handling

**Module**: M13 - Spring Boot Fundamentals
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.3 (Spring Data JPA)

---

## What This Topic Teaches

1. `@NotBlank` — String not null/empty/whitespace
2. `@NotNull` — any type not null
3. `@Positive` — number strictly > 0
4. `@Min(n)` / `@Max(n)` — numeric bounds
5. `@Size(min, max)` — String/collection length
6. `@Pattern(regexp)` — regex constraint
7. `@Email` — valid email format
8. `@Valid` on `@RequestBody` — the trigger for validation
9. `MethodArgumentNotValidException` — thrown when @Valid fails
10. `ex.getBindingResult().getFieldErrors()` — list of field failures
11. `@RestControllerAdvice` — global JSON exception handler
12. `@ExceptionHandler(ExType.class)` — catches that type from any controller
13. Custom exceptions: `ResourceNotFoundException` → 404, `DuplicateResourceException` → 409
14. Catch-all `@ExceptionHandler(Exception.class)` — log internally, generic response
15. `ErrorResponse` record — structured error format
16. `@Validated` on controller class — enables @PathVariable/@RequestParam validation
17. `@WebMvcTest` — test HTTP layer (validation + exceptions) without database

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Order API |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Without validation: garbage data silently accepted. Without error handling: stack traces leak implementation details. With both: clean 400s with field errors, clean 404s/409s, zero internal detail exposure.

### 📚 Teaching (5 Sub-sections)
1. **Bean Validation**: all constraint annotations with examples
2. **@Valid trigger**: on @RequestBody — without it, constraints are ignored
3. **@RestControllerAdvice**: global handler, @ExceptionHandler specificity
4. **Custom exceptions**: class hierarchy → HTTP status mapping
5. **ErrorResponse**: structured format, HttpServletRequest for path

### 🛠️ Worked Example: Product API Validation
ProductRequest with 4 constrained fields. @Valid on POST. ResourceNotFoundException → 404, DuplicateResourceException → 409. GlobalExceptionHandler with 4 handlers. Clean JSON error responses.

### ⚠️ 3 Common Gaps
1. **missing_valid_annotation** — constraints defined but @Valid not on parameter = no validation
2. **using_controller_advice_not_rest** — @ControllerAdvice without @ResponseBody = 500
3. **exposing_exception_details** — catch-all must return generic message, never ex.getMessage()

### 💪 15 Exercises (715 XP)
Key exercises:
- **Ex 7 (55 XP)**: @WebMvcTest — POST invalid body → 400 with field errors
- **Ex 8 (55 XP)**: @WebMvcTest — not-found 404 and duplicate 409
- **Ex 12 (65 XP)**: Razorpay-style PaymentRequest with @Pattern + @WebMvcTest
- **Ex 13 (75 XP)**: Full UserController integration — 4 @WebMvcTest scenarios
- **Ex 15 (95 XP)**: Complete product API — 6 tests all scenarios

### 🚀 Mini-Project: Zerodha Order API
@Pattern for symbol format. @Min/@Max for quantity. All 3 custom exceptions. GlobalExceptionHandler. ErrorResponse record. 6 @WebMvcTest tests.

---

## The Validation + Error Pattern

```java
// 1. Constrain the DTO:
record OrderRequest(
    @NotBlank @Pattern(regexp="^[A-Z]{2,10}$") String symbol,
    @Min(1) @Max(1000) int quantity,
    @Positive double price
) {}

// 2. Trigger in controller:
@PostMapping
ResponseEntity<Order> create(@Valid @RequestBody OrderRequest req) { ... }

// 3. Handle globally:
@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String,String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
    // + specific exceptions → specific status codes
    // + catch-all → 500 generic message (never expose details)
}

// 4. Test with @WebMvcTest:
mvc.perform(post("/api/orders").contentType(APPLICATION_JSON)
        .content("{\"symbol\":\"\",\"quantity\":0}"))
    .andExpect(status().isBadRequest())
    .andExpect(jsonPath("$.symbol").exists())
    .andExpect(jsonPath("$.quantity").exists());
```

---

## Exception → Status Code Map

| Exception | Status | When |
|-----------|--------|------|
| MethodArgumentNotValidException | 400 | @Valid fails |
| ResourceNotFoundException | 404 | Entity not found |
| DuplicateResourceException | 409 | Duplicate key/name |
| InsufficientFundsException | 422 | Business rule violation |
| Exception (catch-all) | 500 | Unexpected |

---

## Review Checklist

- [ ] @Valid placement — on @RequestBody parameter, not just DTO class
- [ ] @RestControllerAdvice (not @ControllerAdvice) for JSON responses
- [ ] Catch-all never exposes ex.getMessage() to clients
- [ ] Ex 10: handler specificity prediction correct (422)
- [ ] Ex 7: @MockBean ProductService in @WebMvcTest

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T13.3 | T13.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~15K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 735 | 715 | Stable |

**Module 13 Progress**: 4/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 64 topics complete (37.6% of 170)

**Next**: Topic 13.5 — Testing Spring Boot (Module 13 Final)
