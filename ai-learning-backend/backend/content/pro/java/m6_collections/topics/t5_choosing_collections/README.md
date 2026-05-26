# Topic 6.5: Choosing the Right Collection

**Module**: M6 - Collections Framework
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T6.1–T6.4

---

## 🏆 Module 6 Synthesis — The Career Reference Card

This topic crystallizes everything from Module 6 into a decision framework students will use their entire career.

---

## What This Topic Teaches

1. The Three-Question decision framework (keys? uniqueness? sequence?)
2. Variant comparison: ArrayList vs LinkedList, HashMap vs TreeMap vs LinkedHashMap, HashSet vs TreeSet vs LinkedHashSet
3. Performance big-O table for all six collection types
4. Five common antipatterns with before/after fixes
5. Nested collection patterns (Map of Lists, Map of Sets, Map of TreeSets)
6. When to combine multiple collections for different access patterns

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content + decision framework |
| `exercises.json` | ~33KB | 15 exercises |
| `project.json` | ~7KB | Zomato-style restaurant search |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Five real problems → five collection choices, each immediately justified. Students see the decision reflex in action before theory.

### 📚 Teaching (7 Sub-sections)
1. **The Three Questions**: Need keys? → Map. Need uniqueness? → Set. Otherwise → List.
2. **List variants**: ArrayList (default) vs LinkedList (rare)
3. **Map variants**: HashMap (default) vs LinkedHashMap (order) vs TreeMap (sorted)
4. **Set variants**: HashSet (default) vs LinkedHashSet (order) vs TreeSet (sorted)
5. **Five antipatterns**: List for membership, List for lookup, manual dedup, missing hashCode key, ArrayList declared as ArrayList
6. **Nested collections**: Map<K, List<V>>, Map<K, Set<V>>, Map<K, TreeSet<V>>
7. **Performance table**: O(1) vs O(log n) vs O(n) across all six types

### 🛠️ Worked Example: Student Registration Portal
Six requirements, six collection choices, each justified. One domain, demonstrates how real systems use multiple collection types simultaneously. Also shows: a class holding both a Set (for intersection) AND a List (for order) of the same data — valid and common.

### 🏢 3 Industry Examples
- Hibernate: Map for metadata, Set for dirty fields, List for results
- Flipkart: Map<String, List<Product>>, Set for dedup, sorted List for results
- Zerodha: HashSet for active symbols, HashMap for ticks, TreeMap for order book

### 🎤 Interview Section
System design questions: cache design, leaderboard, session tracker, frequency system. "Which is faster: list.contains() or set.contains()?"

### ⚠️ 3 Common Gaps
1. **list_for_membership** — use Set
2. **list_for_lookup** — use Map
3. **not_knowing_linkedhashmap** — when order + fast lookup both matter

### 💪 15 Exercises (730 XP)
Design-focused exercises:
- **Ex 1**: Identify correct collection for 4 scenarios
- **Ex 3, 4**: Fix antipatterns
- **Ex 7**: Map of Lists grouping
- **Ex 8**: Map of TreeSets (sorted unique groups)
- **Ex 9**: LinkedHashSet for ordered dedup
- **Ex 10**: Four structures for library catalog
- **Ex 12**: Three structures for product inventory
- **Ex 13 (80 XP)**: Refactor class with three antipatterns
- **Ex 14 (80 XP)**: Hospital system with 5 structures from requirements
- **Ex 15 (100 XP)**: E-commerce search engine — ALL collection types

### 🚀 Mini-Project: Zomato-Style Restaurant Search
All collection types in one system. TreeMap.subMap() for range queries. Students must comment every collection field explaining their choice. The justification practice is the real learning.

---

## Key Design Notes

**Ex 15 (100 XP)** is the Module 6 capstone exercise — uses every collection type (List, HashMap, Map<String,List>, TreeMap, Set) in one system. The TreeMap.subMap() for price-range is a highlight: no loop needed, the collection does the filtering.

**Project comment requirement** — students MUST comment each structure with a justification. This forces them to articulate the choice, which is exactly what code reviews and interviews require.

---

## Connections

- **All Module 6 topics**: synthesis and decision framework
- **Topic 4.4**: Custom keys need equals/hashCode — still applies
- **Topic 5.5**: Comparator used in collection sorting (searchByCuisine)
- **Module 7**: Exception handling — defensive programming around null returns from Map.get()

---

## Review Checklist

- [ ] Three-Question framework is clear and memorable
- [ ] Performance table is accurate
- [ ] Five antipatterns cover most common mistakes
- [ ] Ex 15 e-commerce engine output matches expected
- [ ] Project TreeMap.subMap() usage is correct
- [ ] Module 6 summary table is complete and accurate

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T6.3 | T6.4 | T6.5 | Trend |
|--------|------|------|------|-------|
| Generation time | ~65 min | ~65 min | ~60 min | Stable |
| Word count | ~13K | ~14K | ~12K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 685 | 740 | 730 | Stable |

**Module 6 Progress**: 5/6 topics complete (T6.6 = capstone project only)

---

## Production Stats

- **Generation time**: ~60 minutes
- **Word count**: ~12,000 words
- **Files**: 4

**Course Progress**: 31 topics complete (18.2% of 170)

**Next**: Topic 6.6 — Module 6 Capstone (Collections Mastery Project)
