# Topic 34.3: HashSet Applications — Dedup, Intersection, Sliding Window

**Module**: M34 (DSA6) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY
**Module 34 Progress**: 3/5 | **Course Progress**: 168 topics

## Key Concepts
- **HashSet**: backed by HashMap with dummy values; O(1) add/remove/contains
- **`add()` returns false if already present**: elegant duplicate detection
- **Contains Duplicate**: `!seen.add(n)` → already exists → duplicate
- **Sliding HashSet window**: add new, remove old when `window.size() > k`
- **Intersection**: add array A to set, scan array B for membership
- **Longest Consecutive**: only start from `n` where `n-1` not in set
- **LinkedHashSet**: O(1) + insertion order preserved
- **TreeSet**: O(log n) + sorted; `first()`, `last()`, `floor()`, `ceiling()`
- **HashSet vs Floyd's**: both detect cycles; Floyd's O(1) space wins

## Files: topic.json, exercises.json, project.json, README.md
