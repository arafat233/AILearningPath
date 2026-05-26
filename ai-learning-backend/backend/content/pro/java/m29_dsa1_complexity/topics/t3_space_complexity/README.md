# Topic 29.3: Space Complexity — Memory Matters

**Module**: M29 (DSA1) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 29 Progress**: 3/4 | **Course Progress**: 143 topics (84.1%)

## Key Concepts
- **Space complexity = auxiliary space** — extra memory beyond the input itself
- **O(1) space**: scalar variables only — no arrays, no recursion stack growth
- **O(log n) space**: recursive call stack for algorithms that halve the problem (recursive binary search)
- **O(n) space**: HashMap with n entries, copy of array, memoization table of size n
- **O(n²) space**: 2D DP table — LCS, edit distance full table
- **Recursion stack = implicit space cost** — recursive binary search is O(log n) space; iterative is O(1)
- **In-place algorithm**: modifies input directly, O(1) extra space (array reversal, zero-removal)
- **Time-space trade-off**: memoization converts O(2ⁿ) time → O(n) time, costs O(n) space
- **Iterative > recursive** for space when order is predictable: fibIterative O(1) vs fibMemo O(n)
- **Rolling DP**: LCS needs only 2 rows → O(n) space vs O(m×n) for full table
- **Always state BOTH**: `'O(n log n) time and O(1) space'` — never just time in interviews
- **Heapsort**: O(n log n) time, **O(1) space** — the only common O(1) space in-place sort
- **Merge sort**: O(n log n) time, **O(n) space** — temporary merge arrays
- **QuickSelect**: O(n) avg time, **O(1) space** — for kth largest/smallest

## Files: topic.json (~11KB), exercises.json (~28KB), project.json, README.md
