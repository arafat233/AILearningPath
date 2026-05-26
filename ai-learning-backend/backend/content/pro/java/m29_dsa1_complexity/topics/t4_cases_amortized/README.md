# Topic 29.4: Best/Worst/Average Case & Amortized Analysis

**Module**: M29 (DSA1) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 29 Progress**: 4/4 ✅ | **Course Progress**: 144 topics (84.7%)

## Key Concepts
- **Big-O = worst case** (usually); always clarify which case in interviews
- **Three cases**: Best (Ω Omega), Average (Θ Theta), Worst (O Big-O)
- **Linear search**: O(1) best (first element), O(n) worst (last or absent), O(n) average
- **Quicksort**: O(n log n) best/average, **O(n²) worst** (sorted input + last-element pivot)
  - Fix: random pivot or median-of-three → O(n log n) expected
- **Merge sort**: O(n log n) ALL cases — no worst-case divergence; costs O(n) space
- **Insertion sort**: **O(n) best case** (already sorted), O(n²) worst/average
  - TimSort exploits this: uses insertion sort for small/nearly-sorted subarrays
- **Binary search**: O(1) best (target at midpoint), O(log n) worst/average; never degrades
- **HashMap.get()**: O(1) average, O(n) worst (all keys same bucket); Java 8+ → O(log n) practical worst
- **Amortized O(1)**: cost averaged over a SEQUENCE of operations (≠ average case over random inputs)
- **ArrayList.add()**: individual call O(n) on resize, but amortized O(1) — resizes at n=1,2,4,8...
  - Total resize cost = 1+2+4+...+n = 2n → amortized = 2n/n = O(1)
- **Union-Find**: amortized O(α(n)) ≈ O(1) with path compression + union by rank
- **Interview format**: `'O(n log n) average, O(n²) worst (sorted input + naive pivot). Fix: random pivot. Space: O(log n).'`

## Critical Gotchas
| Algorithm | Common Mistake | Correct |
|-----------|---------------|---------|
| Quicksort | 'O(n log n)' | 'O(n log n) average, O(n²) worst' |
| ArrayList.add | 'O(1)' | 'O(1) **amortized**' |
| HashMap.get | 'O(1)' | 'O(1) **average**' |
| Insertion sort | 'O(n²)' only | 'O(n) best (sorted input)' |
| Bubble sort | 'O(n²) always' | 'O(n) best with early-exit flag' |

## Files: topic.json (~12KB), exercises.json (~30KB), project.json, README.md
