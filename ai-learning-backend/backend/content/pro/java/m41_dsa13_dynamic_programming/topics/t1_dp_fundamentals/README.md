# Topic 1: DP Fundamentals — Memoization, Tabulation, Optimal Substructure

**Module**: M41 | **Difficulty**: ⭐⭐⭐⭐⭐

## Key Concepts
- DP requires: optimal substructure + overlapping subproblems
- Memoization (top-down): recursion + HashMap/array cache
- Tabulation (bottom-up): fill table iteratively from base cases
- Space optimization: when dp[i] only needs dp[i-1] → use two variables
- Fibonacci: O(2^n) naive → O(n) memo → O(n) O(1) rolling
- Coin Change: dp[amount]=min(dp[amount-coin]+1) for each coin

## Files: topic.json, exercises.json, project.json, README.md
