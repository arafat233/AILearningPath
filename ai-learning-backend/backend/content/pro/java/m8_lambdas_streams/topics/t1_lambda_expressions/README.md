# Topic 8.1: Lambda Expressions

**Module**: M8 - Lambda Expressions & Streams  
**Difficulty**: ⭐⭐⭐⭐ (4/10)  
**Estimated Time**: 60 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T5.4 (interfaces/functional), T5.5 (Comparators), T6.1 (ArrayList)

---

## 🚀 Module 8 Begins — Functions as Values

This is the syntax shift that unlocks the Stream API and modern Java style.

---

## What This Topic Teaches

1. Lambda = anonymous function passed as a value
2. Functional interface = interface with exactly one abstract method
3. Three syntax forms: expression, block, no-params
4. Type inference — Java figures out parameter types from context
5. Lambda vs anonymous class — equivalent, lambda is cleaner
6. Variable capture — effectively final requirement
7. `list.sort(lambda)` — replacing Comparator anonymous classes
8. `list.forEach(lambda)` — replacing for-each loops
9. `map.forEach((k,v) -> ...)` — iterating maps
10. `list.removeIf(lambda)` — conditional removal
11. Method references `::` preview

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~34KB | 15 exercises |
| `project.json` | ~7KB | Product Catalog V3 |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Same Comparator: 5-line anonymous class (Topic 5.5) vs 1-line lambda. Same logic, zero boilerplate. Immediate motivation.

### 📚 Teaching (9 Sub-sections)
1. **What are lambdas**: anonymous function, passed as value
2. **Functional interface**: one abstract method, @FunctionalInterface
3. **Syntax forms**: expression, block, no-params, type inference, single-param parens optional
4. **Lambda vs anonymous class**: equivalent but cleaner
5. **Sort with lambda**: Comparator as lambda, single and multi-criteria
6. **forEach with lambda**: Consumer as lambda
7. **Variable capture**: effectively final rule and why
8. **Method references preview**: `::` syntax

### 🛠️ Worked Example: Product Catalog Sort Upgrade
Every anonymous Comparator from Topic 5.5 becomes a 1-line lambda. Three sort orders, forEach for printing. The before vs after side-by-side makes the improvement concrete.

### 🏢 3 Industry Examples
- Spring Boot functional routing and security config
- Android click handlers and adapters
- Flipkart search result sorting

### 🎤 Interview Section
Lambda vs anonymous class, functional interface definition, effectively final, sort-by-salary lambda, method reference.

### ⚠️ 4 Common Gaps
1. **not_effectively_final** — reassigned variable can't be captured
2. **block_lambda_missing_return** — explicit return required in blocks
3. **lambda_without_functional_interface** — target type must be functional interface
4. **parentheses_confusion** — 0 or 2+ params need parens; 1 param optional

### 💪 15 Exercises (685 XP)
Key exercises:
- **Ex 3**: Replace anonymous class with lambda (the core refactoring)
- **Ex 10**: Predict which capture patterns compile — effectively-final test
- **Ex 11**: Lambda returned from factory method
- **Ex 12**: Custom @FunctionalInterface + lambda usage
- **Ex 14**: Pipeline simulation (filter → sort → print) — previews streams
- **Ex 15 (95 XP)**: Complete product dashboard — all lambda patterns

### 🚀 Mini-Project: Product Catalog V3
The refactoring arc completes: Module 4 OOP → Module 5 Comparators → Module 6 Collections → Module 8 Lambdas. Same product catalog, dramatically shorter code. Bonus: `Predicate<Product>` for filtered printing.

---

## Connections

- **T5.5 (Comparators)**: every anonymous Comparator becomes a 1-line lambda
- **T6.1 (forEach, removeIf)**: these take lambdas — now students understand WHY
- **T8.2 (next)**: Functional Interfaces (Predicate, Function, Consumer, Supplier)
- **T8.3**: Stream API — lambdas ARE the stream operations

---

## Review Checklist

- [ ] Three syntax forms clearly differentiated
- [ ] Effectively final rule explained with WHY (not just the rule)
- [ ] Ex 10 effectively-final trace — verify D compiles (array reference is final, contents can change)
- [ ] Ex 15 complex lambda — Monitor (₹18999) most expensive before removeIf
- [ ] Project has ZERO anonymous class syntax requirement — verify in tips

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M7 avg | T8.1 | Note |
|--------|--------|------|------|
| Generation time | ~64 min | ~70 min | Stable |
| Word count | ~13.6K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 733 | 685 | Slightly lower — topic is accessible |

**Module 8 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes  
- **Word count**: ~14,000 words  
- **Files**: 4

**Course Progress**: 38 topics complete (22.4% of 170)

**Next**: Topic 8.2 — Functional Interfaces (Predicate, Function, Consumer, Supplier)
