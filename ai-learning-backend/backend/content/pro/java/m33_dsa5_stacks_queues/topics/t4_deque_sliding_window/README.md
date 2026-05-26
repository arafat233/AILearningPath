# Topic 33.4: Deque & Sliding Window Maximum

**Module**: M33 (DSA5) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY
**Module 33 Progress**: 4/5 | **Course Progress**: 163 topics

## Key Concepts
- **Deque**: O(1) at BOTH ends — `offerFirst/offerLast`, `pollFirst/pollLast`, `peekFirst/peekLast`
- **Sliding Window Max**: monotonic DECREASING deque of indices
  1. Remove out-of-window from front: `dq.peekFirst() <= i-k`
  2. Remove smaller from back: `nums[dq.peekLast()] <= nums[i]`
  3. Record when window full: `i >= k-1`
- **Sliding Window Min**: monotonic INCREASING deque (remove `>=` from back)
- **O(n)**: each element pushed/popped at most once — amortized O(1) per step
- **Jump Game I**: `maxReach = max(maxReach, i+nums[i])`; if `i > maxReach` → false
- **Jump Game II**: greedy; when `i==currEnd`: jump, extend to farthest
- **Longest subarray abs diff ≤ limit**: two deques (max + min) simultaneously
- **Shortest subarray sum ≥ K**: prefix sums + monotonic deque (handles negatives)

## Files: topic.json, exercises.json, project.json, README.md
