# Topic 30.3: Prefix Sums — O(1) Range Queries

**Module**: M30 (DSA2) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW
**Module 30 Progress**: 3/5 | **Course Progress**: 147 topics (86.5%)

## Key Concepts
- **Prefix sum**: `prefix[i] = prefix[i-1] + nums[i-1]`; prefix[0]=0 (n+1 array)
- **Range query**: `rangeSum(l,r) = prefix[r+1] - prefix[l]` → O(1)
- **Subarray sum == k**: HashMap counts prefix sums; `count += map.get(sum-k)`. Init: `map.put(0,1)`
- **Works with negatives**: prefix sums don't require monotonicity (unlike sliding window)
- **Sliding window fails for negatives**: use prefix sums instead
- **Product except self**: left prefix products × right suffix products in 2 passes O(n) O(1)
- **Pivot index**: `leftSum == total - leftSum - nums[i]` → O(1) extra space
- **2D prefix**: `prefix[i][j] = matrix + above + left - above-left`; query in O(1)
- **Prefix mod k**: `prefix[j]%k == prefix[i]%k` → subarray[i+1..j] divisible by k
- **Subarray sum div k**: use `(sum%k+k)%k` to handle Java negative mod
- **Kadane as prefix**: `maxSum = max(prefix[j] - minPrefix_before_j)`

## Files: topic.json, exercises.json, project.json, README.md
