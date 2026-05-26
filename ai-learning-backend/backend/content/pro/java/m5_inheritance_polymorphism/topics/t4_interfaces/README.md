# Topic 5.4: Interfaces

**Module**: M5 - Inheritance & Polymorphism
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 70 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topics 5.1, 5.2, 5.3

---

## What This Topic Teaches

Students will:
1. Define interfaces (pure contracts, no state)
2. Use the `implements` keyword
3. Implement multiple interfaces on one class
4. Use interface types as references (polymorphism)
5. Write and use `default` methods (Java 8+)
6. Implement `Comparable<T>` for natural ordering
7. Apply `Double.compare()` vs subtraction in `compareTo`
8. Program to interfaces (List not ArrayList)
9. Extend interfaces with interface inheritance
10. Use common standard library interfaces

---

## Why This Topic Matters

Interfaces are the foundation of Java's most important APIs — Collections (List, Set, Map), JDBC (Connection, Statement), Spring DI, Android event handling. "Program to interfaces" is the most-cited Java best practice. After this topic, students understand why Java code is designed the way it is and design better themselves.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~33KB | Main content |
| `exercises.json` | ~34KB | 15 progressive exercises |
| `project.json` | ~9KB | Sortable Product Catalog project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
`Comparable<Product>` enabling `Arrays.sort(products)` — concrete, immediate, real e-commerce use. Zerodha/Flipkart sorts use this.

### 📚 Teaching (10 Sub-sections)
1. **Intro**: Interface = pure contract, no state, no constructors
2. **implements keyword**: syntax, multiple interfaces, interface as type
3. **Multiple interfaces**: how Java allows this (no diamond problem), class + many interfaces
4. **Interface vs Abstract Class**: complete comparison table — THE interview question answered
5. **Interface constants**: public static final, anti-pattern note
6. **Default methods**: Java 8+, backward compatibility, can call other interface methods
7. **Comparable<T>**: compareTo contract, Double.compare vs subtraction
8. **Common standard library interfaces**: Comparable, Runnable, Iterable, AutoCloseable, Serializable
9. **Programming to interface**: List not ArrayList — daily practice
10. **Interface inheritance**: interface extending interface

### 🛠️ Worked Example: Multi-interface Product
Product implementing Comparable + custom Printable + Validatable:
- Three @Override methods satisfying three contracts
- `Arrays.sort(catalog)` just works
- `countValid(Validatable[] items)` is Product-agnostic
- Default methods `print()` and `checkValidity()` free

### 🏢 4 Industry Examples
- Java Collections (List, Set, Map hierarchy)
- Spring DI (interface-based injection)
- JDBC (database-agnostic Connection)
- Sorting (Comparable — every product list)

### 🎤 Interview Section
Most-asked OOP questions:
- Interface vs abstract class (THE question — fully answered)
- Multiple interface implementation
- Default methods
- Comparable implementation
- Programming to interfaces

### ⚠️ 6 Common Gaps Tracked
1. **interface_with_fields** — no instance fields
2. **interface_with_constructor** — no constructors
3. **forgetting_to_implement_interface_method** — all abstract methods required
4. **compareto_subtraction_for_doubles** — use Double.compare
5. **programming_to_implementation** — use List not ArrayList
6. **using_abstract_when_interface_needed** — missed flexibility

### 💪 15 Exercises (755 XP)
Strong coverage of all interface patterns:
- **Warmup**: implements syntax, default method trace, simple Printable
- **Easy**: Comparable by length, **fix double subtraction** (debug), multiple interfaces (Duck)
- **Medium**: Scorable with default grade(), Employee sort descending, three interfaces on Student, interface type trace, interface extending interface, polymorphic printBestDeal()
- **Hard**: Leaderboard with tie-break Comparable, pluggable `Validator<T>` (generic interface!), **complete sortable catalog** (100 XP capstone)

Exercise 14 introduces **generic interfaces** (`Validator<T>`) — a peek at generics coming later.
Exercise 15 (100 XP): full catalog with Comparable + 2 custom interfaces + 4 concrete products.

### 🚀 Mini-Project: Sortable Product Catalog with Multiple Roles
Three role interfaces (Displayable, Filterable, Discountable) + Comparable on Product:
- CatalogManager methods programmed to interface types
- findCheapest() respects inStock() via Filterable
- Demonstrates why interface-per-concern beats one fat interface
Real Flipkart/Meesho catalog architecture.

---

## Key Design Decisions

**Why does ex 15 use Categorizable.isCategory() with a downcast to get getName?**
Because printElectronics accepts Categorizable[] — it only KNOWS the category. Getting the name requires knowing it's also Discountable. Demonstrates why interface segmentation forces explicit type knowledge. Shows real design tension in interface-per-concern design.

**Ex 5 (fix double subtraction)**: edge case: 299.99 - 599.0 = -299.01, truncated to -299. Correct! But 0.001 - 0.002 = -0.001, truncated to 0 — WRONG. The exercise makes the risk concrete.

---

## Connections

- **Topic 5.3**: Interface fills the 'pure contract' role that abstract class's abstract methods hinted at
- **Topic 5.5 (next)**: Comparator (the other sorting interface) and polymorphism in practice
- **Future Generics**: `Comparable<T>` and `Validator<T>` preview generic types
- **Future Collections**: List, Set, Map are ALL interfaces
- **Future Lambda/Streams**: functional interfaces (Runnable, Comparator) enable lambdas

---

## Review Checklist

- [ ] Interface vs abstract class table is accurate
- [ ] Double.compare vs subtraction explained with concrete failure case
- [ ] Default methods explained clearly (backward compatibility motivation)
- [ ] Exercise 14 generic interface `Validator<T>` — confirm generics intro is gentle
- [ ] Exercise 15 (100 XP) — verify output matches (sort order especially)
- [ ] Project findCheapest() correctly handles out-of-stock items

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T5.2 | T5.3 | T5.4 | Trend |
|--------|------|------|------|-------|
| Generation time | ~65 min | ~65 min | ~70 min | Stable |
| Word count | ~14K | ~14K | ~16K | Up (rich topic) |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 735 | 760 | 755 | Stable high |

**Module 5 Progress**: 4/~6 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~16,000 words
- **Files**: 4

**Course Progress**: 25 topics complete (14.7% of 170)

**Next**: Topics 5.5 & 5.6 complete Module 5
