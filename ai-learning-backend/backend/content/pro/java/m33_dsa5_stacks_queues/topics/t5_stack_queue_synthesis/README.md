# Topic 33.5: Stack & Queue Synthesis

**Module**: M33 (DSA5) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY
**Module 33 Progress**: 5/5 ✅ | **Course Progress**: 164 topics (96.5%)

## Key Concepts
- **LRU Cache**: HashMap (O(1) lookup) + Doubly Linked List (O(1) reorder) = O(1) total
  - Sentinel head/tail: head.next=most recent, tail.prev=LRU to evict
  - `addFront`: after head. `evict`: remove `tail.prev`
- **LFU Cache**: HashMap + frequency map + LinkedHashSet per frequency
- **Calculator I** (with parens): stack saves `result+sign` on `(`, restores on `)`
- **Calculator II** (no parens): previous op applied to current num; * / immediate
- **Task Scheduler**: `max(slots, tasks.length)` where `slots=(maxCount-1)*(n+1)+maxCountTasks`
- **Decode String**: count stack + StringBuilder stack; pop on `]`, repeat `count` times
- **Browser History**: two stacks (back + forward); visit clears forward
- **Min Stack space trick**: store `val-min` as delta; negative delta = new min was set

## Files: topic.json, exercises.json, project.json, README.md

## Files: topic.json, exercises.json, project.json, README.md
