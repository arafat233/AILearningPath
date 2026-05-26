# Topic 2: Non-Comparison Sorts — Counting, Radix, Bucket

**Module**: M38 | **Difficulty**: ⭐⭐⭐⭐

## Key Concepts
- Counting sort: O(n+k) — integers in [0,k]; count array of size k+1; prefix sum for stability
- Radix sort: O(d*(n+k)) — sort by each digit LSD to MSD using stable counting sort
- Bucket sort: O(n) avg — distribute into buckets, sort each, concatenate
- Sort colors (DNF): O(n) O(1) — 3-way partition with lo/mid/hi pointers
- Counting sort stable: iterate backwards when placing elements
- When to use: known range → counting; large n small k → radix; uniform distribution → bucket

## Files: topic.json, exercises.json, project.json, README.md
