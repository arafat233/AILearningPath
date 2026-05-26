# Topic 33.3: Queue Fundamentals

**Module**: M33 (DSA5) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY
**Module 33 Progress**: 3/5 | **Course Progress**: 162 topics

## Key Concepts
- **Queue FIFO**: `offer(tail)`, `poll(head)`, `peek(head)`
- **`offer/poll`** (null-safe) > `add/remove` (throws exception)
- **BFS template**: `while(!q.isEmpty()){ int size=q.size(); for(int i=0;i<size;i++){...} }`
- **size snapshot**: freeze current-level count before inner loop
- **Implement Queue with 2 Stacks**: lazy pour inbox→outbox; amortized O(1)
- **Implement Stack with Queue**: rotate all existing elements after each push; O(n) push O(1) pop
- **Multi-source BFS**: offer all sources first, then BFS simultaneously (Walls & Gates)
- **Islands**: BFS flooding — mark visited by setting to '0'
- **Rotting Oranges**: multi-source BFS with time = BFS levels
- **PriorityQueue**: min-heap by default; `Collections.reverseOrder()` for max-heap

## Files: topic.json, exercises.json, project.json, README.md
