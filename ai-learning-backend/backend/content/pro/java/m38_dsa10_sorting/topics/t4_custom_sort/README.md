# Topic 4: Custom Sort — Comparators, Stable Sort, Sort by Multiple Keys

**Module**: M38 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- Custom comparator: (a,b)->a[0]-b[0] for int[] by first element
- Multi-key sort: .thenComparingInt().thenComparingInt()
- Comparator.comparing(f).thenComparing(g): fluent API
- Stable sort guarantees: Arrays.sort(objects) is TimSort (stable)
- Negative comparator warning: a-b can overflow for large negatives — use Integer.compare(a,b)
- Sort with lambda: Arrays.sort(arr, (a,b)->Integer.compare(a,b))

## Files: topic.json, exercises.json, project.json, README.md
