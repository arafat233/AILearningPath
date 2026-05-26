# Topic 8.4: Stream Collectors

**Module**: M8 - Lambda Expressions & Streams
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T8.3 (Stream API), T6.2 (HashMap patterns)

---

## What This Topic Teaches

1. `Collectors.groupingBy(classifier)` → Map<K, List<T>> — replaces computeIfAbsent loops
2. `groupingBy(classifier, downstream)` — process each group further
3. Downstream collectors: `counting()`, `averagingDouble()`, `summingDouble()`, `maxBy()`, `minBy()`
4. `Collectors.summarizingDouble()` → DoubleSummaryStatistics (all stats at once)
5. `Collectors.toMap(keyFn, valueFn)` + merge function for duplicate keys
6. `Collectors.partitioningBy(predicate)` → Map<Boolean, T> — exactly two groups
7. `Collectors.mapping(fn, downstream)` — transform before collecting
8. `Collectors.joining(delim, prefix, suffix)` — all three forms
9. Multi-level grouping: nested groupingBy
10. When groupingBy vs partitioningBy

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Stock Watchlist Analytics |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Module 6 computeIfAbsent loop (7 lines) vs groupingBy (1 line). Same result, dramatically cleaner.

### 📚 Teaching (7 Sub-sections)
1. **groupingBy basic**: classifier → Map<K, List<T>>
2. **Downstream collectors**: counting, averagingDouble, mapping, maxBy/minBy, joining
3. **summarizingDouble**: all five statistics in one pass
4. **toMap**: key+value functions, merge function for duplicates
5. **partitioningBy**: exactly two groups (true/false)
6. **joining variants**: delimiter, prefix, suffix
7. **groupingBy + filtering**: pre-filter vs Collectors.filtering, multi-level nesting

### 🛠️ Worked Example: HR Analytics
Five queries on employee data — all Collectors. groupingBy count, avgSalary per dept, top earner per dept (maxBy), partition performance review, dept summaries.

### 🏢 3 Industry Examples
- Flipkart analytics dashboard (sales by category, top products)
- HR payroll systems (groupBy dept for budget, partition permanent/contract)
- Zerodha trade reporting (group by symbol, partition winning/losing)

### ⚠️ 3 Common Gaps
1. **groupingby_result_map_type** — HashMap, no guaranteed order; wrap in TreeMap
2. **tomap_duplicate_keys** — must provide merge function when keys can repeat
3. **optional_in_maxby_minby** — maxBy/minBy return Optional<T>

### 💪 15 Exercises (755 XP)
Key exercises:
- **Ex 7**: groupingBy + averagingDouble
- **Ex 9**: toMap with merge function (duplicate departments)
- **Ex 10**: groupingBy + maxBy per group
- **Ex 11**: groupingBy + mapping + joining
- **Ex 13 (75 XP)**: Multi-level nested groupingBy
- **Ex 14 (85 XP)**: Full sales report — multiple collectors
- **Ex 15 (95 XP)**: Order analytics — all collector types

### 🚀 Mini-Project: Stock Watchlist Analytics
6 analytics methods, all using Collectors. Zero loops. Real financial analytics patterns.

---

## The Module 6 → Module 8 Arc Completes

| Pattern | Module 6 (loops) | Module 8 (collectors) |
|---------|-----------------|----------------------|
| Group by key | `computeIfAbsent` loop | `groupingBy(classifier)` |
| Count per group | `map.put(k, count+1)` | `groupingBy(k, counting())` |
| Sum per group | `map.put(k, sum + val)` | `groupingBy(k, summingDouble(fn))` |
| Two-group split | `if(pred) list1 else list2` | `partitioningBy(predicate)` |
| ID lookup map | `for (e) map.put(e.getId(), e)` | `toMap(getId, e->e)` |

---

## Review Checklist

- [ ] groupingBy HashMap ordering caveat mentioned and TreeMap workaround shown
- [ ] toMap duplicate key behavior + merge function clearly explained
- [ ] maxBy/minBy Optional<T> return type — ifPresent usage
- [ ] Ex 14 revenue values verified: Electronics=9992, Books=12980, Accessories=7485
- [ ] Ex 15 customer averages verified: C001=1550, C002=3800, C003=800

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T8.3 | T8.4 | Trend |
|--------|------|------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~15K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 740 | 755 | Stable |

**Module 8 Progress**: 4/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 41 topics complete (24.1% of 170)

**Next**: Topic 8.5 — Optional (null-safe chaining, orElse, map, flatMap, filter)
