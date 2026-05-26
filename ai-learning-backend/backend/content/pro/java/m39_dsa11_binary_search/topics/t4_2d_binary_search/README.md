# Topic 4: 2D Binary Search — Matrix Search, Search Space

**Module**: M39 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- Row-column sorted matrix: start from top-right; go left if too big, down if too small
- Row sorted, rows ascending: treat as 1D with index/cols row, index%cols col
- Kth smallest in sorted matrix: binary search on value range
- Find K-th smallest: count elements <= mid; if count>=k: hi=mid else lo=mid+1
- Sparse matrix search: binary search on row then column

## Files: topic.json, exercises.json, project.json, README.md
