# Topic 3: Rotated Arrays — Search, Find Min, Find Peak

**Module**: M39 | **Difficulty**: ⭐⭐⭐⭐⭐

## Key Concepts
- Rotated sorted array: one half is always sorted
- Find sorted half: if a[lo]<=a[m]: left half sorted; else right half sorted
- Search in rotated: check which half target is in
- Find minimum: if a[m]>a[hi]: min is in right (lo=m+1); else hi=m
- Find peak: if a[m]>a[m+1]: peak in left (hi=m); else lo=m+1
- Loop condition: `lo<hi` (not `lo<=hi`) when finding min/peak

## Files: topic.json, exercises.json, project.json, README.md
