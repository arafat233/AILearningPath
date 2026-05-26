# Topic 2: Search on Answer — Koko, Split Array, Median of Arrays

**Module**: M39 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐

## Key Concepts
- Pattern: binary search on the ANSWER SPACE not the array
- Condition: find minimum X such that f(X) is feasible
- f(X) must be monotonic: feasible for X implies feasible for X+1
- Koko: speed X feasible if sum(ceil(piles[i]/X)) <= h
- Split Array: size X feasible if split into k parts all <= X
- Median of two sorted arrays: O(log(min(m,n))) binary search on shorter
- Template: lo=min_answer, hi=max_answer; while(lo<hi) check mid feasibility

## Files: topic.json, exercises.json, project.json, README.md
