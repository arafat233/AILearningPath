# Topic 30.5: Array Patterns Synthesis

**Module**: M30 (DSA2) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW
**Module 30 Progress**: 5/5 ✅ | **Course Progress**: 149 topics (87.6%)

## Key Concepts
- **Pattern recognition**: contiguous→SW, pairs→TP, range→PS, 3-cat→DNF, max-sum→Kadane
- **Kadane's**: `curr = max(num, curr+num)`; restart when prev sum negative. O(n) O(1)
- **Boyer-Moore majority**: candidate/count; same→count++, diff→count--; reset on 0. O(n) O(1)
- **Next permutation**: rightmost ascending pair → swap with next larger → reverse suffix. O(n) O(1)
- **Longest consecutive sequence**: HashSet; only start counting from n where n-1 not in set. O(n) O(n)
- **Rotate array**: 3 reversals: all, [0,k-1], [k,n-1]. O(n) O(1)
- **Jump game**: greedy — track max reachable index. O(n) O(1)
- **Find duplicate (Floyd's)**: treat array as linked list, cycle detection. O(n) O(1)
- **Negatives → prefix sums NOT sliding window**
- **Multi-pattern**: identify all constraints, map to patterns, combine in one pass where possible

## Files: topic.json, exercises.json, project.json, README.md
