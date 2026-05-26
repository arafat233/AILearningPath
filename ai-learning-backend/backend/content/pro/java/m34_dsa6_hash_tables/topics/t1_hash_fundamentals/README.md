# Topic 34.1: Hash Fundamentals

**Module**: M34 (DSA6) | **Difficulty**: ⭐⭐⭐⭐ (4/10) | **Status**: 🟡 READY
**Module 34 Progress**: 1/5 | **Course Progress**: 165 topics

## Key Concepts
- **HashMap internals**: key→hash→bucket. Default capacity=16, loadFactor=0.75
- **O(1) avg, O(n) worst**: when all keys collide into one bucket
- **ALWAYS check `containsKey` before `get`** — or use `getOrDefault`
- **`merge(k, 1, Integer::sum)`**: elegant frequency counting idiom
- **`computeIfAbsent(k, f)`**: create-if-missing for nested structures
- **Two Sum pattern**: complement = target-num; look up complement before inserting
- **Prefix sum + HashMap**: `prefixCount.put(0,1)` handles subarrays from index 0
- **Contiguous Array**: balance (+1 for 1, -1 for 0); same balance → equal 0s and 1s
- **Longest Consecutive**: only start from `n` where `n-1` not in set → O(n) total
- **HashMap vs TreeMap vs LinkedHashMap**: O(1)/O(log n)/O(1)+order
- **Pre-size**: `new HashMap<>(n*4/3+1)` to avoid rehashing

## Files: topic.json, exercises.json, project.json, README.md
