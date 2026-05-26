# Topic 6.3: HashSet

**Module**: M6 - Collections Framework
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T6.1 (ArrayList), T6.2 (HashMap), T4.4 (equals/hashCode)

---

## 🎯 The Collections Triangle is Complete

After this topic, students have all three foundational collection types:
- **List**: ordered sequence, allows duplicates, index access
- **Map**: keyed lookup, O(1) by key
- **Set**: unique membership, O(1) contains

Together these cover ~90% of all data structure decisions in professional Java.

---

## What This Topic Teaches

Students will:
1. Declare and use HashSet (unique elements, O(1) operations)
2. Use add/contains/remove efficiently
3. Understand that duplicates are silently ignored
4. Deduplicate a collection with `new HashSet<>(collection)`
5. Perform set operations: union, intersection, difference
6. Apply the "seen/visited" tracking pattern
7. Use `containsAll()` for subset checking
8. Know when Set beats List (and vice versa)
9. Understand LinkedHashSet and TreeSet briefly

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~25KB | Main content |
| `exercises.json` | ~32KB | 15 progressive exercises |
| `project.json` | ~7KB | Event Deduplication System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Recommendation engine: ArrayList.contains() is O(n) per check. HashSet.contains() is O(1). At scale this is the difference between 'works' and 'lags.' Plus: HashSet auto-deduplicates — no manual if-not-contains-then-add.

### 📚 Teaching (8 Sub-sections)
1. **Intro**: Unique elements, O(1) operations
2. **Set vs List**: comparison table, decision guide
3. **Deduplication**: `new HashSet<>(list)` instant dedup
4. **Set operations**: union (addAll), intersection (retainAll), difference (removeAll)
5. **Visited pattern**: track-what's-been-processed with add() return value
6. **hashCode requirement**: custom objects need overrides (Topic 4.4)
7. **LinkedHashSet/TreeSet**: when order matters

### 🛠️ Worked Example: Article Tag System
Set<String> tags per article, Set operations for filtering, HashMap+HashSet in popularTags(). Shows how Map and Set work together.

### 🏢 4 Industry Examples
- Google web crawler (visitedUrls HashSet)
- LinkedIn social graph (Set operations for mutual friends, suggestions)
- Razorpay fraud detection (blocked card/IP HashSets)
- Email marketing (duplicate send prevention)

### 🎤 Interview Section
Key questions: deduplication approach, O(n) vs O(1) contains, set operations (union/intersection/difference), web crawler design.

### ⚠️ 4 Common Gaps Tracked
1. **expecting_set_order** — HashSet has no guaranteed order
2. **set_contains_with_new_object** — needs equals/hashCode
3. **mutating_original_on_set_operation** — always copy first
4. **using_list_when_set_is_right** — recognizing when Set is appropriate

### 💪 15 Exercises (685 XP)
Highlights:
- **Ex 5**: Find duplicate elements — uses add() return value elegantly
- **Ex 6, 7**: Set operations (intersection, all three)
- **Ex 8**: Visited URL tracker — classic web crawler pattern
- **Ex 9**: Permission check with containsAll()
- **Ex 12**: Social network mutual friends + suggestions
- **Ex 13**: Recommendation engine via Set difference
- **Ex 14 (85 XP)**: Social graph — Map<String, Set<String>> + set operations

### 🚀 Mini-Project: Event Deduplication System
Real payment/order event pipeline using HashSet. `add()` return value drives deduplication logic. Connects to Topic 4.4 (equals/hashCode on Event class) and Topic 6.2 (groupByType uses computeIfAbsent).

---

## Connections

- **T4.4**: Custom objects in HashSet MUST override equals/hashCode — direct, tested in project
- **T6.2**: popularTags combines HashMap (counting) + HashSet (result), used in worked example and project bonus
- **T6.4 (next)**: Iterating Collections — Iterator, ListIterator, entrySet patterns
- **T6.5**: Collections utility class with sort, min, max

---

## Review Checklist

- [ ] "Copy before set operations" rule clearly stated
- [ ] add() return value (true=new, false=duplicate) explained
- [ ] no-index-access limitation stated
- [ ] LinkedHashSet/TreeSet briefly introduced
- [ ] Ex 14 social graph — verify expected output correct
- [ ] Project bonus reset() with LinkedHashSet is feasible

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T6.1 | T6.2 | T6.3 | Trend |
|--------|------|------|------|-------|
| Generation time | ~70 min | ~70 min | ~65 min | Stable |
| Word count | ~16K | ~15K | ~13K | Slightly down (topic simpler) |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 705 | 720 | 685 | Stable |

**Module 6 Progress**: 3/6 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 29 topics complete (17.1% of 170)

**Next**: Topic 6.4 — Iterating Collections
