# Topic 6.1: ArrayList

**Module**: M6 - Collections Framework
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: M3 (arrays), M4 (classes/encapsulation), M5.4 (interfaces/generics intro)

---

## 🚀 Module 6 Begins — Goodbye manual arrays!

This is the payoff topic. Every `Type[] arr; int count` pattern from Modules 3-5 disappears today.

---

## What This Topic Teaches

Students will:
1. Declare and use ArrayList with generics
2. Use core methods: add, get, set, remove, contains, size, isEmpty
3. Store objects in ArrayList
4. Iterate with for-each and indexed loop
5. Understand autoboxing (int → Integer)
6. Use `List<T>` as the reference type (not ArrayList<T>)
7. Sort with Comparator
8. Filter into new list
9. Use removeIf for safe removal during modification
10. Understand when ArrayList beats raw arrays

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~30KB | Main content |
| `exercises.json` | ~32KB | 15 progressive exercises |
| `project.json` | ~8KB | Restaurant Order System V2 (refactor from M4.6) |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Side-by-side comparison: Module 4.6 Library with `Book[] books; int count` (5 pain points) vs ArrayList version (3 lines, no pain). Immediate visceral motivation.

### 📚 Teaching (9 Sub-sections)
1. **Intro**: Declaration, import, basic operations
2. **ArrayList vs Array**: comparison table, when to use each
3. **Generics basics**: `<Type>` parameter, compile-time enforcement
4. **Core methods**: all essential ArrayList methods
5. **Iterating**: for-each, indexed loop, removeIf
6. **Autoboxing**: int → Integer, wrapper classes
7. **List interface**: always `List<T>` not `ArrayList<T>`
8. **Sorting**: list.sort(comparator), Collections.sort
9. **ArrayList of objects**: how contains/remove use equals()

### 🛠️ Worked Example: Library Refactored
Complete before/after: Library from Topic 5.3 upgraded to ArrayList. New features added (findByTitle, getBooksInStock, sortByTitle) that would have been painful before — now trivial. Demonstrates also why proper equals() on Book matters.

### 🏢 4 Industry Examples
- Spring Boot REST APIs (every endpoint returns List<T>)
- Zerodha portfolio (dynamic stock list)
- Android RecyclerView (always ArrayList-backed)
- Search systems (unknown result count → ArrayList)

### 🎤 Interview Section
Core questions: Array vs ArrayList, declare as List not ArrayList, remove ambiguity (index vs value), ConcurrentModificationException.

### ⚠️ 6 Common Gaps Tracked
1. **declaring_as_arraylist_not_list** — use List<T>
2. **using_list_int_not_integer** — can't use primitives
3. **index_out_of_bounds** — off-by-one errors
4. **modifying_during_iteration** — ConcurrentModificationException
5. **confusing_remove_by_index_vs_value** — Integer list ambiguity
6. **contains_without_equals** — equals() must be overridden

### 💪 15 Exercises (705 XP)
Strong progression:
- **Warmup**: Trace basics, fill blank syntax, number list stats
- **Easy**: Fix List<int> error (debug), filter to new list, ArrayList of Points
- **Medium**: Refactor array→ArrayList (ex 7), fix ConcurrentModificationException (ex 8), sort by GPA, deduplication, shopping cart, trace remove overloads
- **Hard**: Contact list manager, grade histogram analysis, **polymorphic notification queue** (Module 5 × Module 6 synthesis, 95 XP)

Ex 15 (95 XP) bridges Module 5 and Module 6: `List<Notification>` holds abstract parent type polymorphically — ArrayList + inheritance working together.

### 🚀 Mini-Project: Restaurant Order System V2
Refactor the Topic 4.6 Restaurant project from arrays to ArrayList. Adds Menu class with search. Students compare old and new versions — dramatic code quality improvement.

---

## Connections

- **Module 3 (Arrays)**: ArrayList replaces everything students hated about manual arrays
- **Topic 4.4 (equals/hashCode)**: ArrayList.contains/remove uses equals() — direct application
- **Topic 5.4 (interfaces)**: `List<T>` reference type, programming to interface
- **Topic 5.5 (Comparator)**: `list.sort(comparator)` connects sorting to ArrayList
- **Topic 6.2 (next)**: HashMap — when key-value lookup is needed
- **Topic 6.3**: HashSet — ArrayList.contains() is O(n); HashSet.contains() is O(1)

---

## Review Checklist

- [ ] List<T> vs ArrayList<T> distinction clearly made
- [ ] Generics explained simply (no deep generics required here)
- [ ] Autoboxing explained correctly
- [ ] removeIf shown as the safe removal alternative
- [ ] Remove ambiguity (index vs value) for Integer lists
- [ ] equals() connection to contains/remove emphasized
- [ ] Ex 15 (polymorphic notification) — verify output

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M5 avg | T6.1 | Note |
|--------|--------|------|------|
| Generation time | ~68 min | ~70 min | Stable |
| Word count | ~14.8K | ~16K | Slightly up (rich examples) |
| Exercises | 15 | 15 | Consistent |
| XP available | 744 | 705 | Slightly lower (concepts more accessible) |

**Module 6 Progress**: 1/? topics (estimated 6 topics)

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~16,000 words
- **Files**: 4

**Course Progress**: 27 topics complete (15.9% of 170)

**Next**: Topic 6.2 — HashMap
