# Topic 31.3: Palindromes — Detection and Expansion

**Module**: M31 (DSA3) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW
**Module 31 Progress**: 3/5 | **Course Progress**: 152 topics (89.4%)

## Key Concepts
- **Palindrome check**: two-pointer `lo=0, hi=n-1` — O(n) time O(1) space
- **2n-1 centers**: n odd (single char) + n-1 even (between pairs) — ALWAYS check both
- **Expand around center**: `while(lo>=0&&hi<n&&s[lo]==s[hi]){lo--;hi++;}` → O(n²) total
- **Result after expand**: `s.substring(lo+1, hi)` — lo+1 and hi-1 form the palindrome
- **Valid Palindrome II**: on mismatch at (lo,hi), try removing either → check two substrings
- **Count palindromes**: increment count for each successful expansion
- **Palindrome rearrangement**: at most 1 char with odd frequency
- **Longest Palindromic Subsequence**: `LCS(s, reverse(s))` — O(n²) DP
- **Min insertions for palindrome**: `n - LPS(s)` — chars not in LPS need a mirror
- **Min cuts for palindrome partition**: precompute `isPalin[i][j]` + 1D DP cuts array
- **Manacher's O(n)**: use previously computed palindrome to skip expansion — advanced

## Files: topic.json, exercises.json, project.json, README.md
