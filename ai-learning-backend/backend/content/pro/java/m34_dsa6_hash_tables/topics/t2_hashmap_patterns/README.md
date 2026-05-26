# Topic 34.2: HashMap Patterns — Grouping, Frequency, Sliding Window

**Module**: M34 (DSA6) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY
**Module 34 Progress**: 2/5 | **Course Progress**: 166 topics

## Key Concepts
- **Group Anagrams**: sorted chars as key `O(m log m)`; freq-encoded key `O(m)` faster
- **Top K Frequent**: freq map + min-heap size k → O(n log k); bucket sort → O(n)
- **Word Pattern bijection**: TWO maps (char→word AND word→char) — one map misses flip case
- **Isomorphic**: `int[128]` with `i+1` to distinguish "unmapped" (0) from index 0
- **Min Window**: `required` counter — decrement only when `window[c]<=need[c]`
- **Brick Wall**: count interior edge positions; answer = `rows - maxEdges`
- **Max Points on Line**: slope as GCD-reduced fraction string; O(n²) per pair
- **computeIfAbsent**: cleaner than if(containsKey)/put for nested structures


## Files: topic.json, exercises.json, project.json, README.md
