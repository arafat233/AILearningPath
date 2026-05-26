# Topic 1: Heap Fundamentals — Min/Max Heap, PriorityQueue API

**Module**: M36 (DSA8) | **Difficulty**: ⭐⭐⭐⭐ (4/10)

## Key Concepts
- PriorityQueue: min-heap by default. Max-heap: Collections.reverseOrder() or (a,b)->b-a
- offer(x): O(log n). poll(): O(log n) — removes minimum. peek(): O(1)
- Heap sort: heapify O(n) + n extractions O(n log n) = O(n log n) O(1) space
- PriorityQueue with custom comparator: PriorityQueue<int[]>((a,b)->a[0]-b[0])
- Java PriorityQueue does NOT support O(1) contains or arbitrary removal
- For max-heap of integers: new PriorityQueue<>(Collections.reverseOrder())
- Initialization from collection: new PriorityQueue<>(list) — O(n) heapify

## Files: topic.json, exercises.json, project.json, README.md
