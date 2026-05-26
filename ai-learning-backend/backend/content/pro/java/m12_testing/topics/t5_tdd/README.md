# Topic 12.5: Test-Driven Development (TDD)

**Module**: M12 - Unit Testing with JUnit 5
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T12.1 (JUnit 5 Basics), T12.2 (Parameterized Tests)

---

## What This Topic Teaches

1. The Red-Green-Refactor cycle — the heartbeat of TDD
2. Write ONE failing test before writing ANY production code
3. Green phase: minimum code — hardcoded if necessary
4. Triangulation — force real logic with a second test
5. Refactor safely inside the Green zone
6. TDD drives class design — hard tests signal bad design
7. Baby steps — each cycle 2-5 minutes
8. Exception paths are first-class TDD citizens
9. When TDD is less useful (exploratory, UI, migrations)
10. The courage to refactor comes from test coverage

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Payment Rules Engine (no_ai) |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Manual testing cycle → bug found 3 weeks later. TDD cycle → bug found 3 seconds later. The test you write first catches the bug before it exists.

### 📚 Teaching (6 Sub-sections)
1. **Red-Green-Refactor**: the three phases, one at a time
2. **Baby steps**: each cycle 2-5 min, one behaviour per test
3. **Triangulation**: second test forces real logic
4. **TDD with exceptions**: exception paths first-class
5. **TDD drives design**: hard test → bad design signal
6. **When not to TDD**: exploratory, UI, migrations

### 🛠️ Worked Example: ShoppingCart
6 TDD cycles from blank file to full ShoppingCart. Cycle 4 refactors List → Map inside Green — tests stay green throughout. Clean API emerges from caller's perspective.

### ⚠️ 3 Common Gaps
1. **writing_all_tests_first** — TDD is ONE test at a time
2. **too_much_code_in_green** — hardcode if it passes; triangulate later
3. **skipping_refactor_step** — refactor every Green before next Red

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 7 (50 XP)**: Word frequency counter — 4 TDD cycles
- **Ex 11 (65 XP)**: Multi-rule pricing engine — 5 cycles with triangulation
- **Ex 13 (75 XP)**: Roman numeral converter — classic TDD kata
- **Ex 14 (75 XP)**: Order processing pipeline — 5 complex cycles
- **Ex 15 (95 XP)**: InventoryManager — 8 cycles, full TDD from nothing

### 🚀 Module 12 Capstone: Payment Rules Engine
**No AI.** Build from nothing using strict TDD. 6+ cycles documented. Triangulation at boundaries. One refactor step. 10+ tests all GREEN. This is what professional TDD looks like.

---

## The TDD Discipline in One Picture

```
Write one failing test (RED)
         ↓
Write minimum code to pass (GREEN)
  - Can be hardcoded!
  - Just enough for this ONE test
         ↓
Improve code quality (REFACTOR)
  - Rename, extract, remove duplication
  - Tests must stay GREEN
         ↓
Write the NEXT failing test (back to RED)
         ↓
    (repeat every 2-5 minutes)
```

## Triangulation in Practice

```java
// Test 1 — could be faked:
@Test void of_3_returns6() { assertEquals(6, Doubler.of(3)); }
// Fake GREEN: static int of(int n) { return 6; }

// Test 2 — forces real logic:
@Test void of_5_returns10() { assertEquals(10, Doubler.of(5)); }
// Now 'return 6' fails → FORCED: static int of(int n) { return n * 2; }
```

---

## Module 12 Complete

---

## 📊 Module 12 Statistics

| Topic | Title | XP |
|-------|-------|----|
| 12.1 | JUnit 5 Basics | 695 |
| 12.2 | Parameterized Tests | 700 |
| 12.3 | Mocking with Mockito | 720 |
| 12.4 | Testing I/O and HTTP | 720 |
| 12.5 | Test-Driven Development | 720 |
| **TOTAL** | | **~3,555** |

**5 topics · 75 exercises · 5 mini-projects · ~65,000 words**

---

## 🎓 Module 12 — The Complete Testing Toolkit

```
12.1: @Test, assertEquals, assertThrows, @BeforeEach
       ↓
12.2: @ParameterizedTest, @CsvSource, boundary values
       ↓
12.3: @Mock, @InjectMocks, when().thenReturn(), verify()
       ↓
12.4: @TempDir, mocked HttpClient, StringReader/Writer
       ↓
12.5: Test first → minimum code → refactor → repeat
```

---

## 📊 Cumulative Course Progress After Module 12

| Metric | After M11 | After M12 |
|--------|-----------|-----------|
| Topics complete | 55/170 | **60/170** |
| Percent | 32.4% | **35.3%** |
| Total XP | ~40,165 | **~43,720** |
| Total exercises | 825 | **900** |
| Mini-projects | 57 | **62** |

**60 topics milestone — over one-third of the course complete!**

---

## ✅ Module 12 Approval Status

| Topic | Status |
|-------|--------|
| 12.1 JUnit 5 Basics | 🟡 Pending |
| 12.2 Parameterized Tests | 🟡 Pending |
| 12.3 Mockito | 🟡 Pending |
| 12.4 Testing I/O and HTTP | 🟡 Pending |
| 12.5 TDD | 🟡 Pending |

---

## 🔜 Module 13: Spring Boot Fundamentals

After 12 modules of core Java and testing, Module 13 introduces the industry's most-used Java framework:

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id) {
        return productService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
```

After Module 13, students build production REST APIs with Spring Boot, Spring Data JPA, and Spring Security.

---

## Pipeline Health

Module 12 generation stats:
- Time per topic: ~67 min (consistent)
- Words per topic: ~13,200
- Exercises per topic: 15
- XP per topic: ~711
- Quality: consistent throughout

The pipeline is healthy. Module 13 proceeds.

---

## Review Checklist

- [ ] TDD discipline: ONE test per cycle — not batch
- [ ] Green = minimum code (hardcode is acceptable)
- [ ] Triangulation examples in all exercises
- [ ] Refactor step demonstrated in worked example
- [ ] Ex 15: 8 cycles, each test written before code
- [ ] Capstone no_ai policy + TDD comment format

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED
