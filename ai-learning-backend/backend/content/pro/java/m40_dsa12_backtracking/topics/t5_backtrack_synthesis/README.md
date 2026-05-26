# Topic 5: Backtracking Synthesis — Patterns and Optimizations

**Module**: M40 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐

## Key Concepts
- All backtracking: choose→recurse→undo
- Subsets: add at every call (not just leaves)
- Permutations: used[] for selection
- Combination Sum: allow reuse (i not i+1); prune with sort+break
- N-Queens: valid() check; queens[] array tracks column per row
- Pruning is the key optimization: sort + early break can cut O(2^n) dramatically

## Files: topic.json, exercises.json, project.json, README.md
