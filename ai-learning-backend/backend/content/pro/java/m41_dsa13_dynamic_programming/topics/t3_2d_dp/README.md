# Topic 3: 2D DP — Grid Paths, Edit Distance, Knapsack

**Module**: M41 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐

## Key Concepts
- Unique Paths: dp[j]+=dp[j-1]; O(n) rolling row
- Edit Distance: match→dp[i-1][j-1]; mismatch→1+min(3 neighbors)
- 0/1 Knapsack: iterate j BACKWARDS; dp[j]=max(dp[j], dp[j-w]+v)
- Unbounded Knapsack: iterate j FORWARDS; allows reuse
- Partition Equal Subset: knapsack variant; boolean dp[target+1]
- Longest Common Subsequence: review from M31 T5

## Files: topic.json, exercises.json, project.json, README.md
