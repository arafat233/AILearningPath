# Topic 2: Heap Patterns — K Largest, Median Stream, Task Scheduling

**Module**: M36 (DSA8) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10)

## Key Concepts
- K Largest: min-heap of size k. When size>k: poll(). Answer: heap top.
- K Closest to origin: max-heap size k on distance. Or sort O(n log n).
- Kth Largest Stream: maintain min-heap size k; add each element; return peek()
- Median Stream: two heaps — max-heap (lower half) + min-heap (upper half). Balance after each insert.
- Top K Frequent: freq map + min-heap size k sorted by frequency
- Meeting Rooms II: sort by start; min-heap of end times; rooms = max heap size

## Files: topic.json, exercises.json, project.json, README.md
