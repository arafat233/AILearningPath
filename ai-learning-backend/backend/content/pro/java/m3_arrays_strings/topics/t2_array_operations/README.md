# Topic 3.2: Array Operations & Algorithms

**Module**: M3 - Arrays & Strings
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topic 3.1 (Introduction to Arrays), Module 2 methods

---

## What This Topic Teaches

Students will:
1. Use Java's `Arrays` utility class (toString, sort, copyOf, fill, equals)
2. Write methods that take arrays as parameters and return arrays
3. Choose between in-place modification vs returning new arrays
4. Implement linear search with the -1 sentinel convention
5. Implement binary search and understand its O(log n) advantage
6. Apply the two-pointer technique (THE most important interview pattern)
7. Reverse arrays in-place and check for palindromes
8. Merge two sorted arrays (foundation of merge sort)

---

## Why This Topic Matters

This is where students go from "I can iterate an array" to "I can manipulate arrays the way professional Java developers do." The Arrays utility class methods are used DAILY by every Java developer. The two-pointer technique appears in 60%+ of array interviews.

Plus this topic introduces algorithmic thinking: time complexity (O(n) vs O(log n)), in-place vs new-array trade-offs, and clean method design for array utilities.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~33KB | Main content |
| `exercises.json` | ~35KB | 15 progressive exercises |
| `project.json` | ~10KB | Inventory Manager project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Opens with: "When you wanted to sort an array, you... couldn't." Sets up Arrays utility class as the solution. Honest that sorting from scratch is a whole DSA course.

### 📚 Comprehensive Teaching (10 Sub-sections)
1. **Intro**: java.util.Arrays import
2. **Arrays.toString**: THE most-used method, debugging essential
3. **Arrays.sort**: In-place, ascending, modifies original
4. **Arrays.copyOf**: True copying + truncate/extend
5. **Arrays.fill**: Initialize to non-default values
6. **Arrays.equals**: Why `==` doesn't work for arrays
7. **Passing/returning arrays in methods**: In-place vs new-array design decision
8. **Linear search**: -1 sentinel convention, O(n)
9. **Binary search**: O(log n), requires sorted, full implementation
10. **Array reversal**: Two-pointer technique introduction

### 🛠️ Worked Example: Leaderboard
Student score ranking system that exercises EVERY pattern:
- Arrays.toString for output
- Arrays.copyOf to preserve originals
- Arrays.sort + custom reverse for descending
- Custom binary search on descending array (flipped comparisons)
- Arrays.copyOf for slicing (top N)

Shows real engineering: when to use library, when to write custom logic.

### 🏢 4 Industry Examples
- Search engines (sort + binary search)
- Database query engines (indexes use binary search)
- E-commerce (sort/filter operations)
- Trading platforms (order books are sorted arrays)

### 🎤 Interview Section
**Strong emphasis** — this topic is THE heart of array interviews:
- Linear vs binary search expectations
- Two-pointer technique patterns
- In-place modification questions
- Time complexity follow-ups ("can you do better?")

### ⚠️ 7 Common Gaps Tracked
1. printing_array_directly (garbage memory addresses)
2. using_equals_for_arrays (== fails)
3. binary_search_on_unsorted (undefined behavior)
4. expecting_arrays_sort_to_return (it's void)
5. modifying_unintentionally (caller's array changed)
6. off_by_one_in_binary_search
7. forgetting_to_return_minus_one

### 💪 15 Exercises (775 XP)
Strong progression with multiple INTERVIEW CLASSICS:
- **Warmup**: Arrays.toString, predict sorted output, sort & display
- **Easy**: Fix `==` comparison bug, copy & modify, fill array
- **Medium**: Linear search method, returning new array, fix sort assignment, **two-pointer reverse**, **palindrome check**, **binary search implementation**
- **Hard**: **Merge sorted arrays** (foundation of mergesort), **remove duplicates in-place**, **rotate array right by K**

The hard section has THREE classic interview problems.

### 🚀 Mini-Project: Inventory Manager
Parallel arrays (productIds, stocks, prices) — a deliberate pre-OOP pattern. Students:
- Use all 5 Arrays utility methods
- Implement findById (linear search)
- Track index for cheapest product
- Build sorted copies without modifying originals

The parallel-arrays approach is intentionally clunky — sets up motivation for Module 4 (OOP). Students will viscerally understand why classes exist.

---

## Tone Calibration

Strong examples:
- ✅ "When you print an array directly, you get garbage." (honest about Java quirk)
- ✅ "Two-pointer technique is one of THE most important interview patterns."
- ✅ "Java's library does the heavy lifting." (acknowledges good tool use is engineering)

Honest, practical, interview-aware.

---

## Connections to Other Topics

- **Topic 3.1**: Reference semantics now applied to `copyOf` vs assignment
- **Module 2 Topic 2.2**: Methods returning arrays = parameters/returns at scale
- **Module 4 (OOP)**: Parallel arrays project motivates classes
- **Future DSA module**: Merge step, binary search, two-pointer all recur

---

## Diversity & Inclusion

- Indian names: Aisha, Raj, Priya, Vikram
- ₹ currency in project
- Globally-applicable: e-commerce, leaderboards, search

---

## What I'm Uncertain About

1. **Binary search depth** — Full implementation given, including edge cases. Some courses defer to DSA module. Decision: include here because interviews expect it.

2. **Merge two sorted arrays (ex 13)** — This is mergesort's merge step. Could be confusing without mergesort context. Decision: included because pattern is reusable beyond mergesort.

3. **Rotate by K (ex 15)** — Modulo arithmetic for wrap-around may confuse some. Decision: kept as last hard exercise with clear hints.

4. **Parallel arrays project** — Deliberately pre-OOP pattern. Risk: feels outdated. Decision: project explicitly addresses this in "what you'll learn by doing this" — sets up OOP motivation.

5. **Two-pointer emphasis** — Mentioned multiple times. Decision: yes, because it's so important for interviews.

---

## Review Checklist

### Technical Accuracy
- [ ] All Arrays utility methods correctly described
- [ ] Binary search implementation correct (no infinite loop)
- [ ] Two-pointer pattern correct
- [ ] Time complexity claims accurate

### Content Quality
- [ ] Hook compelling (sorting hook)
- [ ] Worked example mixes library + custom logic
- [ ] Industry examples concrete
- [ ] Two-pointer technique emphasized

### Exercises
- [ ] Multiple debug exercises (ex 4, 9)
- [ ] Linear search method (ex 7)
- [ ] Two-pointer reverse (ex 10)
- [ ] Binary search self-implementation (ex 12)
- [ ] Classic interview problems (ex 13, 14, 15)

### Project
- [ ] Realistic inventory scenario
- [ ] Multiple operations exercised
- [ ] Parallel arrays explicitly motivates OOP

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance Tracking

| Metric | M2 avg | T3.1 | T3.2 | Trend |
|--------|--------|------|------|-------|
| Generation time | ~55 min | ~55 min | ~60 min | Stable |
| Word count | ~13K | ~14K | ~14.5K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | ~675 | 605 | 775 | Higher (more hard exercises) |
| Tone match | ✓ | ✓ | ✓ | Stable |

**Module 3 Progress**: 2/? topics complete

---

## Production Stats

- **Generation time**: ~60 minutes
- **Word count**: ~14,500 words
- **Files**: 4

**Course Progress**: 12 topics complete (7% of 170 total)

**Next**: Topic 3.3 — Multi-Dimensional Arrays
