# Topic 9.2: Generic Methods

**Module**: M9 - Generics
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T9.1 (Generic Classes)

---

## What This Topic Teaches

1. Generic method syntax — `<T>` before return type
2. Type inference at call site — compiler deduces T from arguments
3. Generic static utility methods — most common pattern
4. Generic instance methods — for non-generic classes
5. Multiple type parameters on a method — `<T, R>`, `<A, B>`
6. Class `<T>` vs method `<T>` — when each belongs
7. Hybrid: generic class + method with own type param — `map(Function<T,R>)`
8. Java library generic methods — Arrays.asList, Collections.sort, Optional.of

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~20KB | Main content |
| `exercises.json` | ~36KB | 15 exercises |
| `project.json` | ~7KB | Generic CSV Import Pipeline |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Without generics: separate method for every type. With generic method: one method, every type. Type inferred automatically.

### 📚 Teaching (6 Sub-sections)
1. **Syntax**: `<T>` before return type — anatomy diagram
2. **Type inference**: compiler deduces T from arguments
3. **Static utility methods**: the bread-and-butter pattern
4. **Generic instance methods**: on non-generic classes
5. **Class vs method `<T>`**: when each belongs
6. **Java library examples**: every generic method students already use

### 🛠️ Worked Example: GenericUtils
Six generic static methods: firstOrDefault, repeat, zip, requireNonNull, transform, findFirst. Each is a real utility used in production.

### 🏢 3 Industry Examples
- Apache Commons / Google Guava utility pattern
- Spring Framework utility classes
- Internal company utility classes (universal pattern)

### ⚠️ 3 Common Gaps
1. **forgetting_method_level_T** — static methods can't use class T; must declare own
2. **wrong_type_parameter_position** — `<T>` goes before return type
3. **inference_failure_on_empty_collection** — `Collections.emptyList()` needs declaration context

### 💪 15 Exercises (700 XP)
Progression:
- **Ex 1-3**: Trace, fill-blank, swap
- **Ex 4-6**: repeat, transform, findFirst
- **Ex 7**: zip with two type params
- **Ex 8**: batch splitter (real bulk processing pattern)
- **Ex 9**: safeCast with Class<T>
- **Ex 11**: flatten nested lists
- **Ex 12**: partition returning Pair<List<T>, List<T>>
- **Ex 13 (70 XP)**: groupBy — generic groupingBy implementation
- **Ex 14 (75 XP)**: Container<T>.map() — generic class + method type param
- **Ex 15 (95 XP)**: ListUtils — 7 complete generic utility methods

### 🚀 Mini-Project: Generic CSV Import Pipeline
Topic 7.5 Inventory import upgraded with generic methods. ParseResult<T>, RecordProcessor with generic parseAll/successValues/failures/transform. Demonstrates: same RecordProcessor works for InventoryRow and (bonus) any other record type.

---

## The Key Mental Model

```java
// Generic CLASS — all methods share the class's T
class Box<T> {
    T get() { ... }         // uses class T
    void set(T v) { ... }  // uses class T
}

// Generic METHOD — T is declared and used per call
class Utils {
    static <T> T first(List<T> list) { ... }  // T per call site
    static <T> T last(List<T> list)  { ... }  // different T same call
}

// Hybrid — class has T, method adds R
class Container<T> {
    T get() { ... }
    <R> Container<R> map(Function<T, R> fn) { ... }  // T from class, R from method
}
```

---

## Review Checklist

- [ ] Static method `<T>` placement clearly explained
- [ ] Type inference explanation — how compiler sees arguments
- [ ] Hybrid case (Container.map): both T and R in scope clearly shown
- [ ] Ex 13 groupBy — verify output format matches expected
- [ ] Ex 15 ListUtils — verify all 7 methods have correct signatures

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T9.1 | T9.2 | Trend |
|--------|------|------|-------|
| Generation time | ~65 min | ~60 min | Stable |
| Word count | ~14K | ~12K | Slightly down (focused topic) |
| Exercises | 15 | 15 | Consistent |
| XP available | 710 | 700 | Stable |

**Module 9 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~60 minutes
- **Word count**: ~12,000 words
- **Files**: 4

**Course Progress**: 44 topics complete (25.9% of 170)

**Next**: Topic 9.3 — Bounded Type Parameters
