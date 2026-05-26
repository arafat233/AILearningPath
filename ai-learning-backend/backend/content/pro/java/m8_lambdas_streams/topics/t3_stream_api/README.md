# Topic 8.3: Stream API Fundamentals

**Module**: M8 - Lambda Expressions & Streams
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T8.1 (Lambdas), T8.2 (Functional Interfaces), T6.1 (ArrayList)

---

## What This Topic Teaches

1. What a Stream is — a pipeline, not a data structure
2. Stream creation: from collection, array, Stream.of, IntStream.range
3. Intermediate operations: filter, map, sorted, distinct, limit, skip
4. Terminal operations: collect, count, forEach, findFirst, anyMatch, allMatch, noneMatch
5. mapToDouble / mapToInt → DoubleStream / IntStream → sum, average, min, max
6. Lazy evaluation model — nothing runs until terminal op
7. Single-use streams — IllegalStateException after terminal op
8. Optional<T> — orElse, ifPresent, orElseThrow (not naked get())
9. Collectors: toList, toSet, joining with delimiter

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~28KB | Main content |
| `exercises.json` | ~36KB | 15 exercises |
| `project.json` | ~7KB | Zomato Search V2 |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Side-by-side: 15-line Module 6 loop to get filtered+sorted+joined product names vs 4-line stream pipeline. Same exact result.

### 📚 Teaching (9 Sub-sections)
1. **What is a Stream**: not a collection, lazy, single-use, declarative
2. **Stream creation**: collection.stream(), arrays, Stream.of, IntStream.range, infinite streams
3. **filter**: Predicate, chained filters = AND
4. **map**: Function, transform type, extract fields, mapToDouble
5. **sorted + distinct + limit + skip**: ordering, deduplication, pagination
6. **collect**: toList, toSet, joining
7. **count, findFirst, anyMatch, allMatch, noneMatch**: scalar terminals
8. **reduce**: combining elements
9. **Lazy evaluation**: nothing runs until terminal; short-circuit optimization

### 🛠️ Worked Example: Zerodha Watchlist Analysis
Five real stock queries — gainers sorted, IT sector average, big mover check, unique sectors, top 3 expensive. Each is a clean 2-3 line stream pipeline.

### 🏢 3 Industry Examples
- Spring Data JPA entity-to-DTO transformation
- Flipkart search results filtering and pagination
- Zerodha portfolio analytics

### 🎤 Interview Section
Five classic stream interview questions all answered as one-liners.

### ⚠️ 4 Common Gaps
1. **stream_reuse** — single-use; IllegalStateException
2. **no_terminal_operation** — nothing executes without terminal op
3. **optional_get_without_check** — use orElse/ifPresent not naked get()
4. **modifying_source_in_stream** — ConcurrentModificationException

### 💪 15 Exercises (740 XP)
Progression:
- **Ex 1-3**: Trace, fill-blank, count/anyMatch basics
- **Ex 4-6**: Objects with filter+map, distinct+limit, mapToDouble
- **Ex 7-9**: Joining, findFirst, allMatch/anyMatch/noneMatch
- **Ex 10-11**: Pagination with skip+limit, top-N analysis
- **Ex 12**: Trace lazy evaluation — how many times does filter run?
- **Ex 13**: IntStream range operations
- **Ex 14 (80 XP)**: 5 queries on product list
- **Ex 15 (95 XP)**: Portfolio analytics — 5 stream queries

### 🚀 Mini-Project: Zomato Search V2
Exact same restaurant data as Topic 6.5, completely rewritten as streams. Zero for-loops allowed. Demonstrates the before/after refactoring arc across two modules.

---

## The Refactoring Arc Completes

The progression across Module 8:

| Topic | Code style |
|-------|-----------|
| M6.5 | `for (Restaurant r : list) { if (...) results.add(r); }` |
| T8.1 | `list.removeIf(r -> ...)`, `list.forEach(r -> ...)` |
| T8.3 | `list.stream().filter(...).sorted(...).collect(...)` |

Topic 6.5 project → Topic 8.3 project is the definitive "before and after" of modern Java style.

---

## Review Checklist

- [ ] Lazy evaluation explained with concrete example (print inside lambda)
- [ ] Single-use stream emphasized — common exam and interview question
- [ ] Optional handling — orElse/ifPresent/map NOT naked get()
- [ ] IntStream.rangeClosed vs range (inclusive vs exclusive)
- [ ] Ex 12 trace: count() is NOT short-circuit — all 5 elements pass through filter
- [ ] Ex 14 inventory value: verify sum (Mouse+Keyboard+Books+Monitor = 7794)
- [ ] Project: verify "zero for-loops" requirement is testable

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T8.2 | T8.3 | Trend |
|--------|------|------|-------|
| Generation time | ~65 min | ~70 min | Stable |
| Word count | ~13K | ~15K | Up (rich examples) |
| Exercises | 15 | 15 | Consistent |
| XP available | 700 | 740 | Slightly up |

**Module 8 Progress**: 3/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~15,000 words
- **Files**: 4

**Course Progress**: 40 topics complete (23.5% of 170)

**Next**: Topic 8.4 — Stream Collectors (groupingBy, counting, toMap, partitioningBy)
