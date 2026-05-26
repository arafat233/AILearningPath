# Topic 8.2: Functional Interfaces

**Module**: M8 - Lambda Expressions & Streams  
**Difficulty**: ⭐⭐⭐⭐ (4/10)  
**Estimated Time**: 55 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T8.1 (Lambda Expressions)

---

## What This Topic Teaches

1. `Predicate<T>` — boolean test. `test()`. `and()/or()/negate()` for composition.
2. `Function<T,R>` — transform T to R. `apply()`. `andThen()/compose()` for chaining.
3. `Consumer<T>` — take T, return void. `accept()`. `andThen()` for sequencing.
4. `Supplier<T>` — produce T with no input. `get()`. For lazy evaluation.
5. `BiFunction<T,U,R>`, `BiConsumer<T,U>` — two-parameter variants.
6. `UnaryOperator<T>` (Function<T,T>), `BinaryOperator<T>` (BiFunction<T,T,T>).
7. Method references — all four types (static, bound instance, unbound instance, constructor).
8. `list.replaceAll(UnaryOperator<E>)` — in-place list transformation.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~36KB | 15 exercises |
| `project.json` | ~7KB | Flipkart Product Search Engine |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Stream API operations shown with their functional interface types — filter=Predicate, map=Function, forEach=Consumer. After this topic, streams are just applying what you already know.

### 📚 Teaching (7 Sub-sections)
1. **Predicate<T>**: test(), and/or/negate composition
2. **Function<T,R>**: apply(), andThen()/compose()
3. **Consumer<T>**: accept(), andThen()
4. **Supplier<T>**: get(), lazy evaluation
5. **BiFunction, UnaryOperator, BinaryOperator**: variants
6. **Method references**: all four types with examples
7. **Quick reference table**: all 7 interfaces in one place

### 🛠️ Worked Example: DataPipeline<T>
Generic pipeline storing all four functional interfaces as fields. Filter (Predicate) → transform (UnaryOperator) → output (Consumer) — with Supplier providing the data. This IS a mini-stream. Fluent builder pattern. Method references for output.

### 🏢 3 Industry Examples
- Stream API internals (filter=Predicate, map=Function, forEach=Consumer)
- Spring Security (Predicate-like authorization rules)
- CompletableFuture (Function for thenApply, Consumer for thenAccept)

### 🎤 Interview Section
What each interface does, how to compose Predicates, method reference types, Supplier for lazy defaults.

### ⚠️ 3 Common Gaps
1. **function_vs_consumer_confusion** — Consumer has void return, Function has a return value
2. **method_reference_type_confusion** — bound vs unbound instance
3. **composition_order** — andThen vs compose direction

### 💪 15 Exercises (700 XP)
Progression:
- **Ex 4**: Predicate composition (and/or/negate)
- **Ex 5**: Function andThen chaining
- **Ex 6**: All four method reference types
- **Ex 7-8**: Functions and Predicates as method parameters
- **Ex 11**: Predicate composition for username validation
- **Ex 12**: Trace andThen vs compose direction
- **Ex 13 (80 XP)**: ReportPrinter — all four interfaces in one class
- **Ex 14**: replaceAll with UnaryOperator
- **Ex 15 (95 XP)**: ScoringEngine — all four + BiConsumer in configurable engine

### 🚀 Mini-Project: Flipkart Product Search Engine
SearchCriteria factory methods return Predicates. ProductFormatter factory methods return Functions. SearchEngine.search() takes Supplier + Predicate + Function + Consumer. Multi-criteria search via Predicate composition.

---

## Key Teaching Insight

**This topic makes Topics 8.3-8.5 (Stream API) intuitive.** Every Stream operation maps to one of these:
- `stream.filter(p -> ...)` → `Predicate<T>`
- `stream.map(e -> ...)` → `Function<T, R>`
- `stream.forEach(e -> ...)` → `Consumer<T>`
- `Collectors.toList()`, `findFirst()` → `Supplier`-like behavior

Students who understand Topic 8.2 will find stream operations obvious rather than mysterious.

---

## Review Checklist

- [ ] Predicate.and/or/negate clearly distinguishable
- [ ] andThen vs compose direction made explicit
- [ ] All four method reference types with examples
- [ ] Ex 15 ScoringEngine — verify bonus formula gives expected output
- [ ] Project SearchCriteria returns Predicate<Product> from each factory method

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T8.1 | T8.2 | Trend |
|--------|------|------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~14K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 685 | 700 | Stable |

**Module 8 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes  
- **Word count**: ~13,000 words  
- **Files**: 4

**Course Progress**: 39 topics complete (22.9% of 170)

**Next**: Topic 8.3 — Stream API Fundamentals
