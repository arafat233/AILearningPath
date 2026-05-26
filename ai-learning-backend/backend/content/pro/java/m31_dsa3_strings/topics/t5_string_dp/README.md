# Topic 31.5: String DP — LCS, Edit Distance, Palindromic Subsequence

**Module**: M31 (DSA3) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW
**Module 31 Progress**: 5/5 ✅ | **Course Progress**: 154 topics (90.6%)

## Key Concepts
- **LCS (Subsequence)**: `dp[i][j] = dp[i-1][j-1]+1` if match; `max(dp[i-1][j], dp[i][j-1])` if mismatch
- **LCS (Substring)**: `dp[i][j] = dp[i-1][j-1]+1` if match; `0` if mismatch (must be contiguous)
- **Edit Distance**: match→`dp[i-1][j-1]` (free); mismatch→`1+min(replace, delete, insert)`
- **Edit Distance base**: `dp[i][0]=i` (delete i), `dp[0][j]=j` (insert j)
- **LPS (Palindromic Subsequence)**: `LCS(s, reverse(s))` — elegant reduction!
- **Min insertions to palindrome**: `n - LPS(s)` — insert chars symmetrically for non-LPS chars
- **SCS length**: `len1 + len2 - LCS` — include LCS chars once, rest from both
- **Rolling array**: LCS and Edit Distance only need prev row → O(n) space vs O(m×n)
- **Wildcard matching**: `'*'`: `dp[i][j-1]` (match empty) OR `dp[i-1][j]` (match one more)
- **Distinct subsequences**: `dp[i][j] = dp[i-1][j] + (match ? dp[i-1][j-1] : 0)`
- **Min ASCII delete**: delete cost = ASCII value; `min(del s1[i], del s2[j])` on mismatch

## DP Pattern Summary
```
LCS:         match → dp[i-1][j-1]+1  | mismatch → max(dp[i-1][j], dp[i][j-1])
Substring:   match → dp[i-1][j-1]+1  | mismatch → 0
EditDist:    match → dp[i-1][j-1]    | mismatch → 1+min(3 neighbors)
LPS          = LCS(s, reverse(s))
minInsert    = n - LPS(s)
SCS len      = m + n - LCS(s1, s2)
```

## Files: topic.json, exercises.json, project.json, README.md
