# Topic 33.2: Monotonic Stack

**Module**: M33 (DSA5) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY
**Module 33 Progress**: 2/5 | **Course Progress**: 161 topics

## Key Concepts
- **Monotonic decreasing**: pop when `current > top` → finds **next greater element**
- **Monotonic increasing**: pop when `current < top` → finds **next smaller / largest area**
- **Store INDICES not values** when you need position/width calculations
- **O(n) amortized**: each element pushed/popped at most once across all iterations
- **Histogram width**: `stack.isEmpty() ? i : i - stack.peek() - 1`
- **Virtual 0 sentinel**: append 0 to heights array to flush all remaining bars
- **Trapping Rain Water** (two-pointer): process smaller side; O(n) O(1) — no stack needed
- **Next Greater circular**: traverse array TWICE with `i % n`
- **Daily Temperatures**: `result[popped_idx] = current_i - popped_idx`
- **Maximal Rectangle**: histogram per row + largestRectangleArea

## Files: topic.json, exercises.json, project.json, README.md
