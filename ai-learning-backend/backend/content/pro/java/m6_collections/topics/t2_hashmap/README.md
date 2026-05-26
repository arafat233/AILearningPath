# Topic 6.2: HashMap

**Module**: M6 - Collections Framework
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T6.1 (ArrayList), T4.4 (equals/hashCode)

---

## What This Topic Teaches

Students will:
1. Declare and use HashMap with two generic parameters `<K,V>`
2. Use put/get/remove/containsKey/size/isEmpty
3. Handle missing keys (null from get, getOrDefault)
4. Iterate using keySet(), values(), entrySet()
5. Apply frequency counting pattern (`getOrDefault(key, 0) + 1`)
6. Apply grouping pattern (`computeIfAbsent(key, k -> new ArrayList<>())`)
7. Apply lookup table pattern (build once, query O(1))
8. Understand why equals/hashCode matters for custom keys
9. Know HashMap doesn't preserve order

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~31KB | Main content |
| `exercises.json` | ~33KB | 15 progressive exercises |
| `project.json` | ~7KB | Student Grade Book project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Product catalog: ArrayList.contains() scans 100,000 items on each barcode scan. HashMap.get() takes ONE operation. Performance argument is concrete and memorable.

### 📚 Teaching (7 Sub-sections)
1. **Intro**: Key-value pairs, declaration, core operations
2. **Map vs List**: decision guide table
3. **Iterating**: keySet, values, entrySet patterns
4. **Pattern 1 — Frequency counting**: getOrDefault accumulation
5. **Pattern 2 — Grouping**: computeIfAbsent with ArrayList
6. **Pattern 3 — Lookup table**: build once, query O(1)
7. **HashMap mechanics**: why hashCode matters for keys

### 🛠️ Worked Example: Product Inventory System
Three patterns demonstrated in one system:
- ProductCatalog: lookup by SKU (O(1))
- stockByCategory(): accumulate totals by category (frequency)
- groupByCategory(): products into category lists (grouping)

### 🏢 4 Industry Examples
- Spring ApplicationContext (bean registry as HashMap)
- Zerodha real-time ticks (symbol → quote lookup)
- Flipkart search facets (grouping for filter sidebar)
- Razorpay URL shortener (short code → payment link)

### 🎤 Interview Section
Top interview topics: how HashMap works, getOrDefault, frequency counting (live coding!), grouping. Two-sum problem (ex 10) is a classic FAANG interview question.

### ⚠️ 6 Common Gaps Tracked
1. **null_key_from_get** — always handle potential null
2. **duplicate_key_overwrites** — keys are unique
3. **iteration_order_dependency** — HashMap has no guaranteed order
4. **modifying_during_entrySet_iteration** — ConcurrentModificationException
5. **using_mutable_object_as_key** — hash changes → lost key
6. **forgetting_hashcode_for_custom_key** — Topic 4.4 application

### 💪 15 Exercises (720 XP)
Signature exercises:
- **Ex 4**: Word frequency counter — foundational pattern
- **Ex 8**: Group students by grade — computeIfAbsent pattern  
- **Ex 10**: Two-sum with HashMap — O(n) FAANG interview problem
- **Ex 13**: Anagram detector — Map.equals() elegance
- **Ex 14**: Order management with HashMap lookup + filtering
- **Ex 15 (95 XP)**: Inventory tracker — all three patterns in one system

### 🚀 Mini-Project: Student Grade Book
Map inside map (`Student.courseGrades: Map<String, Integer>`). GradeBook lookups, course averages, at-risk filtering, grade distributions. Real university system architecture.

---

## Key Design Notes

**Ex 10 (Two-sum)**: First algorithmic HashMap exercise. Students may not have seen this pattern before. Hints guide them to the O(n) insight. This is a genuine FAANG-level problem reduced to a topic-level exercise.

**Ex 15 (Inventory Tracker)**: Two separate HashMaps (`skuToStock` and `skuToCategory`) used together. Neither alone is sufficient — this models real multi-map design patterns seen in production systems.

**Project (Grade Book)**: Map-within-map design (`GradeBook: Map<String, Student>` where `Student` contains `Map<String, Integer>`). This nested structure is common in real systems (e.g., Spring's `Map<String, Map<String, Bean>>` context hierarchies).

---

## Connections

- **T4.4 (equals/hashCode)**: Custom keys MUST implement both — direct, real-world application
- **T6.1 (ArrayList)**: computeIfAbsent creates ArrayLists as map values
- **T6.3 (next)**: HashSet = HashMap without values — O(1) existence check
- **T6.5**: Collections utility class — sort map keys

---

## Review Checklist

- [ ] Three patterns (frequency, grouping, lookup) clearly distinct
- [ ] Null from get() prominently warned
- [ ] Order uncertainty addressed (sort keySet when needed)
- [ ] hashCode connection to T4.4 explicitly made
- [ ] Ex 10 two-sum is correct and hints are sufficient
- [ ] Ex 15 inventory tracker output matches data setup
- [ ] Project grade distribution logic is correct

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T6.1 | T6.2 | Trend |
|--------|------|------|-------|
| Generation time | ~70 min | ~70 min | Stable |
| Word count | ~16K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 705 | 720 | Stable |

**Module 6 Progress**: 2/6 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes  
- **Word count**: ~15,000 words
- **Files**: 4

**Course Progress**: 28 topics complete (16.5% of 170)

**Next**: Topic 6.3 — HashSet
