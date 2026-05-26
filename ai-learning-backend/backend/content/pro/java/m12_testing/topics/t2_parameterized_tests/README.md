# Topic 12.2: Parameterized Tests and Edge Cases

**Module**: M12 - Unit Testing with JUnit 5
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T12.1 (JUnit 5 Basics)

---

## What This Topic Teaches

1. `@ParameterizedTest` — one test method, N executions
2. `@ValueSource(ints/strings/doubles...)` — single parameter per row
3. `@CsvSource({"a, b, expected", ...})` — multiple parameters per row
4. Single quotes in CsvSource: `'Smith, John'` wraps comma-containing values
5. Empty strings in CsvSource: `''` (two single quotes) → empty String
6. Null in CsvSource: nothing before/after comma → null
7. `@MethodSource("methodName")` — static method returning `Stream<Arguments>`
8. `Arguments.of(val1, val2, ...)` — maps to test method parameters
9. `@NullAndEmptySource` — two executions: null and empty string
10. `@NullAndEmptySource` + `@ValueSource` combined — null, empty, blank
11. `@EnumSource(Enum.class)` — one execution per enum value
12. Boundary value analysis: test n-1, n, n+1 at every rule boundary
13. Equivalence partitioning: group inputs, test one from each group
14. Custom test name: `@ParameterizedTest(name = "Case {index}: {0}")`

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Order Validator Tests |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Four near-identical test methods for a discount calculator → one @CsvSource test with 8 boundary cases. Same coverage, 80% less code, clearer test report.

### 📚 Teaching (5 Sub-sections)
1. **@ValueSource**: single type, multiple values, clear use cases
2. **@CsvSource**: multi-parameter, single quote syntax for commas/empty
3. **@MethodSource**: complex objects via Stream<Arguments>
4. **@NullAndEmptySource + @EnumSource**: edge case coverage
5. **Boundary value analysis**: systematic approach to off-by-one bugs

### 🛠️ Worked Example: OrderValidator
@CsvSource for valid/invalid combinations, @CsvSource for quantity boundaries, @NullAndEmptySource for blank names. 16 total executions. Every validation rule boundary covered.

### ⚠️ 3 Common Gaps
1. **csvSource_comma_in_field** — single quotes required for comma-containing values
2. **missing_null_in_valueSource** — always test null explicitly
3. **too_few_boundary_values** — test n-1, n, n+1 at every boundary

### 💪 15 Exercises (700 XP)
Key exercises:
- **Ex 7 (50 XP)**: Quantity limit boundaries — 0,1,2,998,999,1000
- **Ex 11 (60 XP)**: GST rate calculator — 4 slabs, all boundaries
- **Ex 13 (70 XP)**: Email validator — all four @Source annotations
- **Ex 14 (75 XP)**: Multi-rule pricing engine — 10 boundary cases
- **Ex 15 (95 XP)**: CSV parser complete parameterized suite

### 🚀 Mini-Project: Zerodha Order Validator
All four @Source annotations in one test class. 26+ test executions across @CsvSource, @MethodSource, @EnumSource, @NullAndEmptySource. Boundary coverage for qty (0-1001) and price (0-10M).

---

## The Four Sources

```java
// @ValueSource — single type, one value per execution:
@ParameterizedTest
@ValueSource(strings = {"a@b.com", "raj@flipkart.in"})
void isValid_validEmails(String email) { assertTrue(v.isValid(email)); }

// @CsvSource — multiple columns, one row per execution:
@ParameterizedTest
@CsvSource({"'Smith, John', 95000, true", "Mouse, -1, false"})
void validate(String name, int price, boolean expected) { ... }

// @MethodSource — complex objects:
static Stream<Arguments> products() {
    return Stream.of(
        Arguments.of(new Product("Mouse", 799), true),
        Arguments.of(new Product("", 0), false));
}
@ParameterizedTest @MethodSource("products")
void isValid_products(Product p, boolean expected) { ... }

// @NullAndEmptySource + @ValueSource — null/empty/blank:
@ParameterizedTest
@NullAndEmptySource
@ValueSource(strings = {" ", "  "})
void invalidNames_returnFalse(String name) {
    assertFalse(v.isValid(name));
}
```

---

## Boundary Value Cheat Sheet

| Rule | Test values |
|------|-------------|
| qty >= 1 | 0 (fail), 1 (pass), 2 (pass) |
| qty <= 999 | 998 (pass), 999 (pass), 1000 (fail) |
| price > 0 | -1 (fail), 0 (fail), 0.01 (pass) |
| price < 10M | 9999999.99 (pass), 10000000 (fail) |

---

## Review Checklist

- [ ] @CsvSource single-quote syntax demonstrated with comma-in-field
- [ ] Empty string `''` vs null `,` syntax in CsvSource
- [ ] @MethodSource method must be static — emphasized
- [ ] Ex 10 predicted output: confirmed ` ` row gives null (not empty)
- [ ] Ex 14 calculations verified: 10*100*0.90*0.95=855, min charge cases

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T12.1 | T12.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~65 min | Stable |
| Word count | ~13K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 695 | 700 | Stable |

**Module 12 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Files**: 4

**Course Progress**: 57 topics complete (33.5% of 170)

**Next**: Topic 12.3 — Mocking with Mockito
