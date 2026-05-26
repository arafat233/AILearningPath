# Topic 30.2: Sliding Window — Contiguous Subarray Problems

**Module**: M30 (DSA2) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW
**Module 30 Progress**: 2/5 | **Course Progress**: 146 topics (85.9%)

## Key Concepts
- **Sliding window**: O(n) for contiguous subarray/substring problems
- **Fixed window (size k)**: `windowSum += nums[i] - nums[i-k]` as you slide
- **Variable window**: expand right (hi++), shrink left (lo++) when INVALID
- **Why O(n)**: lo never moves backward — total lo++ across all iterations ≤ n
- **Window invariant**: what must be TRUE for the window to be valid
- **Shrink when**: condition violated (no-repeat: when duplicate found), or met (min subarray: shrink when sum >= target)
- **Longest no-repeat**: HashSet tracks current chars; while contains(hi): remove lo, lo++
- **Anagram detection**: fixed window int[26] freq comparison; O(26) = O(1) per step
- **Min window containing t**: `required` counter; shrink when required==0
- **At most k distinct**: HashMap char→count; shrink when map.size() > k
- **Subarray sum == k with negatives**: sliding window fails! Use prefix sum + HashMap
- **Char replacement (k swaps)**: valid if (windowSize - maxFreqChar) <= k
- **Contains duplicate within k**: fixed HashSet window of size k

## Files: topic.json, exercises.json, project.json, README.md
