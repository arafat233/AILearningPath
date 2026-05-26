# Topic 12.1: JUnit 5 Basics

**Module**: M12 - Unit Testing with JUnit 5
**Difficulty**: ⭐⭐⭐ (3/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T5.1 (Classes), T7.5 (try-with-resources)

---

## 🚀 Module 12 Begins — Code That Tests Your Code

After 11 modules of writing programs, Module 12 teaches you to verify they work. Professional Java development requires tests. No tests = no merge at any serious company.

---

## What This Topic Teaches

1. What unit testing is and why it matters
2. `@Test` — mark a method as a test case
3. `assertEquals(expected, actual)` — most common assertion; expected FIRST
4. `assertTrue(condition)`, `assertFalse(condition)`
5. `assertNull(x)`, `assertNotNull(x)`
6. `assertThrows(ExType.class, () -> call())` — test exceptions; returns exception
7. `assertAll(() -> ..., () -> ...)` — grouped assertions; all run even on failure
8. `@BeforeEach` — fresh test fixture before EACH test
9. `@AfterEach` — cleanup after each test
10. `@BeforeAll` / `@AfterAll` — once per class (static)
11. `@DisplayName("human readable description")` — test reports
12. `@Disabled("reason")` — skip a test; never silently ignore
13. Arrange-Act-Assert (AAA) pattern
14. Test naming: `methodName_scenario_expectedResult`

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Banking System Test Suite |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
CSV parser bug found weeks after shipping — would have been caught in seconds with a test. Three test methods = three seconds of feedback vs three weeks of production bug.

### 📚 Teaching (5 Sub-sections)
1. **What is unit testing**: isolation, fast, repeatable, no external deps
2. **JUnit 5 setup**: Maven dependency, test class structure, naming
3. **Assertions**: assertEquals, assertTrue, assertThrows, assertAll
4. **Lifecycle**: @BeforeEach, @AfterEach, @BeforeAll, @AfterAll
5. **AAA + naming**: Arrange-Act-Assert, test name convention

### 🛠️ Worked Example: BankAccountTest
6 tests for BankAccount covering all methods, exception paths, and closed account state. Uses @BeforeEach, assertThrows, assertAll, @Disabled.

### ⚠️ 3 Common Gaps
1. **shared_mutable_state** — always create fresh objects in @BeforeEach
2. **assertEquals_argument_order** — expected first, actual second
3. **testing_too_much_in_one_test** — one test = one behaviour

### 💪 15 Exercises (695 XP)
Key exercises:
- **Ex 8 (55 XP)**: Stock P&L calculator with delta for doubles
- **Ex 11 (65 XP)**: Order pricing engine — 5 rules, 5 tests
- **Ex 13 (70 XP)**: Complete BankAccount suite with transfer
- **Ex 14 (70 XP)**: CSV parser edge case coverage
- **Ex 15 (95 XP)**: OrderService full suite — 8+ tests

### 🚀 Mini-Project: Banking System Test Suite
Write tests for provided BankAccount, Transaction, AccountService. No production code to write — pure testing exercise. Tests all lifecycle annotations, assertions, and patterns.

---

## The Template

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class ProductTest {
    Product product;  // test fixture

    @BeforeEach
    void setUp() {
        product = new Product("P001", "Mouse", 799);  // fresh for each test
    }

    @Test
    @DisplayName("Product name is correctly set")
    void getName_returnsCorrectName() {
        // Arrange: done in setUp
        // Act:
        String name = product.getName();
        // Assert:
        assertEquals("Mouse", name);
    }

    @Test
    void setPrice_negativePrice_throwsIllegalArgument() {
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> product.setPrice(-100));
        assertTrue(ex.getMessage().contains("positive"));
    }
}
```

---

## Review Checklist

- [ ] assertEquals argument order: expected FIRST, actual SECOND — consistently
- [ ] @BeforeEach clearly needed for all exercises with mutable fixtures
- [ ] Ex 10: predicted output for assertEquals wrong-order is confirmed
- [ ] Ex 15: OrderService orders map package-private for SHIPPED test
- [ ] assertDoesNotThrow mentioned in Ex 7 (happy path assertion)

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M12 T1 |
|--------|--------|
| Generation time | ~65 min |
| Word count | ~13K |
| Exercises | 15 |
| XP available | 695 |

**Module 12 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Files**: 4

**Course Progress**: 56 topics complete (32.9% of 170)

**Next**: Topic 12.2 — Parameterized Tests and Edge Cases
