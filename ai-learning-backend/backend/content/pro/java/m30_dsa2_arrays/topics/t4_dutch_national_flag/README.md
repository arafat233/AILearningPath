# Topic 30.4: Dutch National Flag — 3-Way Partition

**Module**: M30 (DSA2) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW
**Module 30 Progress**: 4/5 | **Course Progress**: 148 topics (87.1%)

## Key Concepts
- **DNF 3 pointers**: low=0, mid=0, high=n-1
- **Case nums[mid]==0**: swap(low,mid), low++, mid++ — element confirmed as 0
- **Case nums[mid]==1**: mid++ only — element already in correct region
- **Case nums[mid]==2**: swap(mid,high), high-- ONLY — don't advance mid (swapped element unexamined)
- **Loop**: `while (mid <= high)` — stop when mid passes high
- **4 invariant regions**: `[0..low-1]=0s`, `[low..mid-1]=1s`, `[mid..high]=unknown`, `[high+1..n-1]=2s`
- **O(n) time, O(1) space** — one pass
- **Key insight**: when swapping mid↔high, the incoming element from high is unknown → must check it
- **3-way quicksort**: apply DNF with any pivot value → handles duplicates efficiently
- **Sort Colors** (LeetCode #75): canonical DNF problem — asked in 20%+ of first DSA rounds

## Files: topic.json, exercises.json, project.json, README.md
