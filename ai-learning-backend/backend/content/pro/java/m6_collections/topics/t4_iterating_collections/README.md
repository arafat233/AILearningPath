# Topic 6.4: Iterating Collections & the Collections Utility Class

**Module**: M6 - Collections Framework
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T6.1, T6.2, T6.3

---

## What This Topic Teaches

Two complementary toolsets:

**Part 1 — Iteration patterns:**
1. Iterator interface (hasNext, next, remove)
2. Safe removal during iteration — when to prefer over removeIf
3. ListIterator — bidirectional, set() for in-place transformation
4. entrySet() for efficient Map key+value iteration

**Part 2 — Collections utility class:**
5. sort, reverse, shuffle
6. min, max
7. frequency, disjoint
8. unmodifiableList/Map/Set
9. nCopies, fill, copy, swap, binarySearch

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~25KB | Main content |
| `exercises.json` | ~35KB | 15 progressive exercises |
| `project.json` | ~7KB | Batch Data Processor project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Two real pain points: ConcurrentModificationException from iterating+removing, and repetitive boilerplate for min/max/sort/reverse. Both solved today.

### 📚 Teaching (10 Sub-sections)
1. **Topic overview**: two-part structure
2. **Iterator basics**: hasNext, next, remove
3. **Iterator vs removeIf**: when each is appropriate
4. **ListIterator**: bidirectional, set(), add()
5. **entrySet iteration**: O(1) key+value access vs keySet+get
6. **Collections.sort/reverse/shuffle**: ordering utilities
7. **Collections.min/max/frequency/disjoint**: query utilities
8. **Collections.unmodifiable***: defensive API design
9. **Collections.fill/copy/nCopies/binarySearch**: misc utilities
10. **Streams preview**: declarative alternative

### 🛠️ Worked Example: StudentManager
- `removeInactive()` — Iterator with parallel log-building
- `awardBonus()` — ListIterator.set() for in-place GPA update
- `topStudents()` — Collections.sort on copy + subList
- `classStats()` — Collections.min/max
- `getReadOnlyRoster()` — Collections.unmodifiableList
- All in one cohesive class

### 🏢 4 Industry Examples
- Spring Batch (Iterator removal + error tracking)
- API design (unmodifiableList defensive getter)
- Leaderboards (sort + slice top N)
- Test setup (shuffle, nCopies)

### 🎤 Interview Section
Core questions: safe removal, sort in-place vs copy, unmodifiable vs immutable.

### ⚠️ 4 Common Gaps
1. **calling_remove_without_next** — IllegalStateException
2. **sorting_original_when_copy_needed** — unexpected mutation
3. **unmodifiable_vs_immutable** — not a snapshot
4. **collections_min_max_on_empty_list** — NoSuchElementException

### 💪 15 Exercises (740 XP)
Strong coverage:
- **Ex 4**: Iterator removal with side-effect list building
- **Ex 8**: ListIterator.set() for capitalization
- **Ex 10**: Complex Iterator with multiple conditions and state tracking
- **Ex 11**: Multiple Collections utilities in one workflow
- **Ex 13**: entrySet setValue() for price discount
- **Ex 14**: Full Leaderboard using all Collections utilities
- **Ex 15 (95 XP)**: InventoryCleaner — Iterator + ListIterator + HashSet dedup

### 🚀 Mini-Project: Batch Data Processor
Payment pipeline: Iterator for audit-log removal, ListIterator for fee adjustment, Collections.sort on copy for ranking, unmodifiableList for safe return, Collections.min/max for report. Real FinTech backend code.

---

## Design Notes

**Ex 15 is deliberately complex** — it combines Iterator, ListIterator, AND Set (seen pattern for consolidation). This is a "three collections working together" exercise that previews how real code combines tools.

**unmodifiable vs immutable distinction** (gap 3) is critical for API design. Java 9's List.of() is mentioned but kept brief — students should know it exists; deep coverage is in a later module if needed.

**Streams preview** kept intentionally short — just enough to recognize the pattern. Full coverage in Module 9.

---

## Review Checklist

- [ ] Iterator must-call-next-before-remove rule clearly stated
- [ ] Collections.sort() in-place mutation warning prominent
- [ ] unmodifiable vs immutable clearly distinguished
- [ ] entrySet vs keySet+get efficiency explained
- [ ] Ex 15 uses Iterator + ListIterator + HashSet — verify all three needed
- [ ] Project applyFees needs ListIterator.set() — confirm helper method or constructor approach is clear

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T6.2 | T6.3 | T6.4 | Trend |
|--------|------|------|------|-------|
| Generation time | ~70 min | ~65 min | ~65 min | Stable |
| Word count | ~15K | ~13K | ~14K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 720 | 685 | 740 | Stable |

**Module 6 Progress**: 4/6 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 30 topics complete (17.6% of 170)

**Next**: Topic 6.5 — Choosing the Right Collection (Module 6 synthesis)
