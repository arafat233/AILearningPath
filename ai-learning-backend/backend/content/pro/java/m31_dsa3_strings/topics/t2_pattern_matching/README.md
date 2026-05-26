# Topic 31.2: Pattern Matching — KMP Algorithm

**Module**: M31 (DSA3) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW
**Module 31 Progress**: 2/5 | **Course Progress**: 151 topics (88.8%)

## Key Concepts
- **Naive pattern matching**: O(nm) — fails on adversarial inputs (all-same chars + long pattern)
- **KMP**: O(n+m) — text pointer `i` NEVER moves backward
- **LPS (Longest Proper Prefix = Suffix)**: `lps[i]` = how far to jump `j` on mismatch at `j`
- **Build LPS O(m)**: `len=0, i=1`; match→`lps[i]=len+1, len++, i++`; mismatch→`len=lps[len-1]` (or `lps[i]=0, i++`)
- **KMP search O(n)**: mismatch at j>0 → `j=lps[j-1]`; match completes → record `i-m`, `j=lps[m-1]`
- **Overlapping matches**: after match `j=lps[m-1]` — continues searching. Non-overlapping: `j=0`
- **Total O(n+m)**: LPS build O(m) + KMP scan O(n)
- **LPS all-same 'AAAA'**: `[0,1,2,3]`. All-diff 'ABCD': `[0,0,0,0]` — KMP = naive in this case
- **String rotation**: s2 is rotation of s1 ↔ s2 found in s1+s1
- **Repeated substring**: `lps[n-1]>0 && n%(n-lps[n-1])==0`
- **Shortest palindrome**: LPS of `s+"#"+reverse(s)` gives longest palindromic prefix

## Files: topic.json, exercises.json, project.json, README.md
