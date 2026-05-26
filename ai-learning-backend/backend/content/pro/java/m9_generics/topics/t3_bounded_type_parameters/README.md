# Topic 9.3: Bounded Type Parameters

**Module**: M9 - Generics
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T9.1 (Generic Classes), T9.2 (Generic Methods), T5.1 (Inheritance)

---

## What This Topic Teaches

1. Upper bound syntax: `<T extends SomeType>` — restricts which types can substitute
2. In generics, `extends` = both extends (class) AND implements (interface)
3. Bound grants access to SomeType's methods inside the generic scope
4. `<T extends Comparable<T>>` — the most common bound; enables compareTo()
5. `<T extends Number>` — numeric bound; enables doubleValue(), intValue()
6. Multiple bounds: `<T extends Number & Comparable<T>>` — both sets of methods
7. Multiple bounds rule: class FIRST, then interfaces, separated by `&`
8. Bounded class type parameters: `class SortedBox<T extends Comparable<T>>`
9. Prevents wrong types at COMPILE TIME (not runtime)
10. Reading Java library signatures: Collections.sort, TreeMap, Collections.max

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Generic Statistics Batch Processor |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
max(List<T>) fails without a bound — can't call compareTo() on unknown T. Adding `<T extends Comparable<T>>` grants the method AND prevents calling with non-comparable types.

### 📚 Teaching (6 Sub-sections)
1. **Upper bound syntax**: `<T extends SomeType>` on class vs method
2. **Comparable bound**: most common, enables compareTo(), sort/min/max methods
3. **Number bound**: numeric types only, enables doubleValue()/intValue()
4. **Multiple bounds**: `&`, class first rule, `Number & Comparable<T>` pattern
5. **Practical patterns**: clamp, isBetween, SortedBox
6. **Reading Java signatures**: Collections.sort, TreeMap, understanding `? super T` preview

### 🛠️ Worked Example: Statistics<T extends Number & Comparable<T>>
The archetypal dual-bound class. sum/average use Number.doubleValue(); min/max use Comparable.compareTo(); range() uses both. Same class for Integer scores and Double prices.

### 🏢 3 Industry Examples
- Java Collections.sort / TreeMap / TreeSet (Comparable bound)
- Spring Data JPA (key bound on CrudRepository)
- Financial libraries (dual bound for numeric analytics)

### ⚠️ 3 Common Gaps
1. **extends_vs_implements_confusion** — always `extends` in generics
2. **class_bound_after_interface** — class FIRST, then interfaces
3. **forgetting_bound_means_methods_available** — the point IS to use the bound's methods

### 💪 15 Exercises (745 XP)
Progression:
- **Ex 1-3**: Identify which types satisfy bounds, fill-blank, min()
- **Ex 4-6**: sum with Number, clamp, SortedBox class
- **Ex 7-9**: isBetween, average with OptionalDouble, dual-bound median
- **Ex 10**: compile/error analysis for Comparable bound
- **Ex 11**: NumberBox<T extends Number> with arithmetic
- **Ex 12**: RangeUtils — overlaps and sorted methods
- **Ex 13 (75 XP)**: Full Statistics<T extends Number & Comparable<T>>
- **Ex 14 (75 XP)**: Generic binary search
- **Ex 15 (95 XP)**: ComparableUtils — 6 bounded generic methods

### 🚀 Mini-Project: Batch Data Processor V2
DataBatch<T extends Number & Comparable<T>> with 8 methods. BatchProcessor with merge, outliers, maxAcrossBatches. Integer exam scores AND Double stock prices — same generic class.

---

## The Three Bounds to Know

```java
// 1. Comparable — for sorting and comparison:
<T extends Comparable<T>>
// Unlocks: compareTo(), use with Collections.sort()

// 2. Number — for numeric operations:
<T extends Number>
// Unlocks: doubleValue(), intValue(), longValue()

// 3. Both — for numeric + sortable:
<T extends Number & Comparable<T>>
// Unlocks: everything from both
// Satisfied by: Integer, Long, Double, Float (not BigDecimal's raw form)
```

---

## Review Checklist

- [ ] `extends` vs `implements` distinction explicitly covered
- [ ] Class bound before interface bounds rule — with example of violation
- [ ] multiple bounds `&` — verify correct order in all examples
- [ ] Statistics class uses BOTH doubleValue() and compareTo() — showing WHY dual bound
- [ ] Ex 9 median: sort uses Comparable, return middle element
- [ ] Ex 15 ComparableUtils — verify all 6 method signatures are correct

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T9.2 | T9.3 | Trend |
|--------|------|------|-------|
| Generation time | ~60 min | ~65 min | Stable |
| Word count | ~12K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 700 | 745 | Slightly up |

**Module 9 Progress**: 3/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 45 topics complete (26.5% of 170)

**Next**: Topic 9.4 — Wildcards (? extends T, ? super T)
