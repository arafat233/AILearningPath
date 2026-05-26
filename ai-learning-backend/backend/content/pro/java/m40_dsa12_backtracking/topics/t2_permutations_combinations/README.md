# Topic 2: Permutations, Combinations, Subsets

**Module**: M40 | **Difficulty**: ⭐⭐⭐⭐⭐

## Key Concepts
- Permutations: `used[]` array; O(n!)
- Combinations: `start` index; i+1 prevents duplicates; O(C(n,k))
- Subsets: add at every call; O(2^n)
- Permutations with duplicates: sort + skip if `i>0 && nums[i]==nums[i-1] && !used[i-1]`
- Combination Sum II (no reuse): i+1; skip duplicates with `i>start && c[i]==c[i-1]`

## Files: topic.json, exercises.json, project.json, README.md
