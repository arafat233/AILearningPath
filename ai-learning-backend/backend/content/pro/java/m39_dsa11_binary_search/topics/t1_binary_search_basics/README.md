# Topic 1: Binary Search Basics — Classic, First/Last, Insert Position

**Module**: M39 | **Difficulty**: ⭐⭐⭐⭐

## Key Concepts
- Template: `while(lo<=hi)` then `m=lo+(hi-lo)/2`
- Not found: return lo (insert position) or -1
- First occurrence: when found, `hi=m-1` (go left for earlier)
- Last occurrence: when found, `lo=m+1` (go right for later)
- `lo+(hi-lo)/2` prevents integer overflow vs `(lo+hi)/2`
- All O(log n): each iteration halves the search space

## Files: topic.json, exercises.json, project.json, README.md
