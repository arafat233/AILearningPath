# Topic 9.5: Generic Interfaces & Design Patterns

**Module**: M9 - Generics
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T9.1-T9.4 (full Module 9 prerequisite)

---

## What This Topic Teaches

1. Generic interface syntax and definition
2. Three implementation styles: concrete, generic, partial
3. Default methods on generic interfaces — build on abstract methods
4. Repository<T, ID> pattern — Spring Data's foundation
5. Mapper<S, T> pattern — MapStruct's foundation
6. Validator<T> pattern — pluggable validation with composition
7. Builder<T> pattern — type-safe construction
8. How frameworks (Spring Data, MapStruct) use generic interfaces
9. Composing multiple generic interfaces in a service layer

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~26KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | E-commerce Framework capstone |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Three separate DAO classes vs one generic Repository<T,ID> interface. This IS what Spring Data does — you're not using a magic framework, you're implementing a known pattern.

### 📚 Teaching (6 Sub-sections)
1. **Generic interface syntax**: definition, bounds, default methods
2. **Three implementation styles**: concrete, generic, partial
3. **Repository<T, ID>**: CRUD contract with default exists() and saveAll()
4. **Mapper<S, T>**: bidirectional conversion with default mapAllTo()
5. **Strategy pattern**: pluggable algorithm via generic interface
6. **Builder<T>**: fluent construction contract
7. **Combining all four**: a complete backend in one example

### 🛠️ Worked Example: E-Commerce Backend
All four patterns together: Repository, Mapper, Validator, Builder. OrderBuilder creates orders, Validator filters invalid ones, Repository saves valid ones, Mapper converts to DTOs. The full flow in one example.

### 🏢 3 Industry Examples
- Spring Data JpaRepository (Repository pattern)
- MapStruct (Mapper pattern, compile-time generated)
- Flipkart/Razorpay internal validation frameworks

### ⚠️ 3 Common Gaps
1. **generic_interface_vs_raw** — always provide type arguments when implementing
2. **forgetting_all_methods** — must implement all abstract methods
3. **default_method_confusion** — default methods can call abstract interface methods

### 💪 15 Exercises (730 XP)
Progression:
- **Ex 1-3**: Warmups — trace, fill-blank, Validator as functional interface
- **Ex 4-6**: Mapper, Builder, StudentRepository
- **Ex 7-9**: Bounded Ranked<T>, Strategy pricing, multi-validator composition
- **Ex 11**: Full Mapper<Employee, EmployeeDto>
- **Ex 12**: ProductRepository with domain queries
- **Ex 13 (75 XP)**: Pipeline<T> with composable then()
- **Ex 14 (85 XP)**: UserService composing Repository + Mapper
- **Ex 15 (95 XP)**: Module 9 synthesis — Entity<ID>, InMemoryRepository<T,ID>, all four interfaces

### 🚀 Module 9 Capstone Project: Spring-Style E-Commerce Framework
**No AI allowed.** Build Repository, Mapper, Validator, Builder from scratch. InMemoryRepository is generic. OrderService composes all four. Full Build→Validate→Save→Fetch→Map pipeline. This is portfolio-quality code demonstrating senior-level generic API design.

---

## Module 9 Complete

---

## 📊 Module 9 Statistics

| Topic | Title | XP |
|-------|-------|----|
| 9.1 | Generic Classes | 710 |
| 9.2 | Generic Methods | 700 |
| 9.3 | Bounded Type Parameters | 745 |
| 9.4 | Wildcards | 720 |
| 9.5 | Generic Interfaces & Patterns | 730 |
| **TOTAL** | | **3,605** |

**5 topics · 75 exercises · 5 mini-projects (1 is a capstone) · ~68,000 words**

---

## 🎓 Module 9 — What Students Can Now Do

```java
// CONSUMING generics (Modules 1-8):
List<String> names = new ArrayList<>();
Optional<User> user = repo.findById(id);

// PRODUCING generics (Module 9):

// Generic class
class Box<T> { T value; T get() { return value; } }

// Generic method
static <T extends Comparable<T>> T max(List<T> list) { ... }

// Bounded type parameter
class Statistics<T extends Number & Comparable<T>> { ... }

// Wildcard
void process(Collection<? extends Shape> shapes) { ... }

// Generic interface
interface Repository<T, ID> {
    Optional<T> findById(ID id);
    default boolean exists(ID id) { return findById(id).isPresent(); }
}
```

Students can now read, understand, and WRITE any generic code they encounter in production Java — including Spring Data, Stream API signatures, and MapStruct.

---

## 🔜 Module 10: Concurrency and Threads

After 9 modules of sequential Java, Module 10 introduces concurrent execution:

```java
// Two threads running simultaneously:
Thread t1 = new Thread(() -> System.out.println("Thread 1 running"));
Thread t2 = new Thread(() -> System.out.println("Thread 2 running"));
t1.start();
t2.start();
```

Planned topics:
- **10.1** Thread basics — creating, starting, lifecycle
- **10.2** Synchronization — race conditions, synchronized keyword
- **10.3** java.util.concurrent — ExecutorService, Future
- **10.4** Atomic types and concurrent collections
- **10.5** CompletableFuture — async programming

---

## Review Checklist

- [ ] All four design patterns clearly explained
- [ ] default method calling abstract method — clearly shown
- [ ] Ex 13 Pipeline<T>.then() — lambda creates a new Pipeline combining two
- [ ] Ex 15 synthesis — Entity<ID> interface for the Repository bound
- [ ] Capstone: no AI policy stated clearly
- [ ] Module 9 complete stats correct

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T9.4 | T9.5 | Trend |
|--------|------|------|-------|
| Generation time | ~65 min | ~70 min | Stable |
| Word count | ~13K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 720 | 730 | Stable |

**Module 9 Progress**: 5/5 topics ✅ COMPLETE

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 47 topics complete (27.6% of 170)
