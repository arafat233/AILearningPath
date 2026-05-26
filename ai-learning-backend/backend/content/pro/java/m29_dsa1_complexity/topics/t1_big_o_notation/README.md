# Topic 29.1: Big-O Notation — The Language of Efficiency

**Module**: M29 (DSA1) | **Difficulty**: ⭐⭐⭐⭐ (4/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 29 Progress**: 1/4 | **Course Progress**: 141 topics (82.9%)

## Key Concepts
- **Big-O**: describes how runtime *grows* as input grows — not the absolute time
- **Complexity order** (fastest → slowest): `O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)`
- **4 Rules**:
  1. Drop constants: `O(3n) = O(n)`, `O(100) = O(1)`
  2. Drop non-dominant terms: `O(n² + n) = O(n²)`
  3. Different inputs → different variables: `O(a + b)`, not `O(n)`
  4. Nested loops → multiply; sequential loops → add (then simplify)
- **O(1)**: array index, HashMap.get(), ArrayList.size() — independent of input
- **O(log n)**: binary search, `i /= 2` or `i *= 2` loop patterns, TreeMap operations
- **O(n)**: single loop over n elements, linear scan, HashSet/HashMap pass
- **O(n log n)**: `Collections.sort()` (TimSort), merge sort — optimal comparison sort
- **O(n²)**: nested loops both depending on n, checking every pair
- **Triangular nested loop** (`j = i+1..n`): still O(n²) — n(n+1)/2 ≈ n²/2
- **Inner loop constant bound**: `for j in 0..10` inside outer loop → O(n), NOT O(n²)
- **log n is almost constant**: log₂(1,000,000,000) ≈ 30 — binary search on 1B items = 30 steps
- **HashMap** O(1) avg; **TreeMap** O(log n); use HashMap unless sorted order needed
- Always state Big-O with 1-sentence justification in interviews

## Files: topic.json (~13KB), exercises.json (~28KB), project.json, README.md
