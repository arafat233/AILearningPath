# Topic 29.2: Analyzing Code Complexity — Step by Step

**Module**: M29 (DSA1) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 29 Progress**: 2/4 | **Course Progress**: 142 topics (83.5%)

## Key Concepts
- **5-step framework**: identify loops/recursion → count iterations → combine → drop constants → state
- **Method calls inside loops**: check EACH call's complexity — `ArrayList.contains` inside loop = O(n²) not O(n)
- **Recurrence T(n) = T(n/2) + O(1)** → O(log n) — binary search
- **Recurrence T(n) = 2T(n/2) + O(n)** → O(n log n) — merge sort
- **Recurrence T(n) = T(n-1) + T(n-2) + O(1)** → O(2ⁿ) — naive Fibonacci
- **String concatenation in loop**: O(n²) — String is immutable, creates new object each `+=`; use `StringBuilder`
- **Sort is often dominant**: `Collections.sort()` → O(n log n), often the most expensive call
- **Amortized O(1)**: `ArrayList.add()`, `StringBuilder.append()` — occasional resize, average O(1)
- Label each line with its cost in code reviews; total = dominant term
- Two-pointer after sort: O(n) pointer pass + O(n log n) sort = O(n log n) total
- `HashMap.computeIfAbsent` inside a loop: O(n) total (one pass, O(1) per HashMap op)

## Files: topic.json (~11KB), exercises.json (~27KB), project.json, README.md
