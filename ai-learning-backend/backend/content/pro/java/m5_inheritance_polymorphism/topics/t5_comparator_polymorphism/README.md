# Topic 5.5: Comparator & Polymorphism in Practice

**Module**: M5 - Inheritance & Polymorphism
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topics 5.1–5.4

---

## What This Topic Teaches

Students will:
1. Understand `Comparator<T>` (external, flexible sorting)
2. Write anonymous class Comparators
3. Sort with multiple criteria (primary + secondary key)
4. Use `Comparator.comparing()` factory method
5. Reverse sort order (swap arguments)
6. Choose between Comparable and Comparator correctly
7. Use instanceof safely (type-specific extras)
8. Recognize and refactor bad instanceof chains into polymorphism
9. Synthesize all Module 5 OOP tools

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~26KB | Main content |
| `exercises.json` | ~36KB | 15 progressive exercises |
| `project.json` | ~7KB | Zerodha-Style Stock Watchlist project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Users want to sort products by price, name, discount, category — but Comparable gives ONE order. Comparator is the answer: unlimited sort orders, external to the class.

### 📚 Teaching (7 Sub-sections)
1. **Intro**: Comparable vs Comparator comparison table
2. **Writing Comparators**: named class, anonymous class, lambda preview
3. **Chained comparators**: multi-criteria, `.thenComparing()`, `.reversed()`
4. **Null-safe sorting**: `Comparator.nullsFirst/Last`
5. **instanceof patterns**: when it's appropriate vs when it isn't
6. **Module 5 synthesis**: OOP tool selector — when to use which

### 🛠️ Worked Example: Product Catalog Multi-Sort
Same 5 products, 4 sort orders (natural/name/discount/category+price). Demonstrates static Comparator constants, `printSorted(copy, cmp, label)` pattern, and why copying matters.

### 🏢 4 Industry Examples
- Flipkart/Amazon search sort (user-selectable Comparator)
- Zerodha watchlist (sort by price/change/cap)
- Java Collections.sort / TreeMap internals
- Spring Data JPA sort mapping

### 🎤 Interview Section
Frequent topics: Comparable vs Comparator, multi-criteria sort, functional interface/lambda, live coding sort problems.

### ⚠️ 4 Common Gaps Tracked
1. **wrong_compare_return_logic** — ascending vs descending confusion
2. **modifying_original_array** — forget to copy before sort
3. **comparable_and_comparator_confused** — signature mix-up
4. **overusing_instanceof_chains** — should be polymorphism

### 💪 15 Exercises (755 XP)
Signature exercises:
- **Ex 7**: Multi-criteria Comparator (dept + salary) — real-world
- **Ex 9**: Sort selector by string key — REST API pattern
- **Ex 11**: Comparable + Comparators on same class (Movie)
- **Ex 14**: Refactor instanceof chain into polymorphism — design refactoring
- **Ex 15 (100 XP)**: Full synthesis — interface + Comparable + Comparators + filter

### 🚀 Mini-Project: Zerodha-Style Stock Watchlist
HighMover interface, Stock with Comparable + 4 Comparators, Watchlist with sortedBy/getHighMovers/filterBySector. Real trading app architecture.

---

## Module 5 Complete — Summary

All 5 topics done. Module 5 covers the full inheritance and polymorphism toolkit:

| Topic | Core Concept | XP |
|-------|-------------|-----|
| 5.1 | Inheritance basics, extends, super | 715 |
| 5.2 | Polymorphism, dynamic dispatch | 735 |
| 5.3 | Abstract classes, Template Method | 760 |
| 5.4 | Interfaces, Comparable | 755 |
| 5.5 | Comparator, synthesis | 755 |
| **Total** | | **3,720** |

**Topics**: 5 × 15 = 75 exercises, 5 mini-projects

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T5.3 | T5.4 | T5.5 | Trend |
|--------|------|------|------|-------|
| Generation time | ~65 min | ~70 min | ~70 min | Stable |
| Word count | ~14K | ~16K | ~14K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 760 | 755 | 755 | Stable |

**Module 5 Progress**: 5/5 topics COMPLETE ✅

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 26 topics complete (15.3% of 170)

**Next**: Module 6 — Collections Framework (ArrayList, HashMap, HashSet)
