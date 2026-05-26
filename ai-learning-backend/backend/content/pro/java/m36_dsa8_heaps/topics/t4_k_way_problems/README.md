# Topic 4: K-Way Merge — K Sorted Lists, K Closest Points

**Module**: M36 (DSA8) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)

## Key Concepts
- Merge K sorted: PriorityQueue<ListNode> by val. Push heads; extract min; push next.
- K Closest: max-heap of size k on distance²; evict farthest
- Kth smallest in sorted matrix: min-heap starting from (0,0); push right and down
- Smallest range: push first element from each list; track max; range=[min,max]
- K-way merge complexity: O(N log K) — N total elements, K lists

## Files: topic.json, exercises.json, project.json, README.md
