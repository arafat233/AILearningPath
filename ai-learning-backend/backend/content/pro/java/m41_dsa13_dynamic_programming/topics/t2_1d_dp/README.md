# Topic 2: 1D DP — House Robber, Coin Change, LIS, Jump Game

**Module**: M41 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- House Robber: dp[i]=max(dp[i-1], dp[i-2]+nums[i]) → O(n) O(1)
- Coin Change: dp[0]=0; dp[i]=min(dp[i-c]+1); init dp[amt+1]
- LIS: O(n²) DP; O(n log n) patience sort (tails array)
- Jump Game: greedy — track max_reach; if i>max_reach: stuck
- Jump Game II: BFS layers — currEnd + farthest
- Best Time to Buy/Sell Stock: min_so_far + max_profit

## Files: topic.json, exercises.json, project.json, README.md
