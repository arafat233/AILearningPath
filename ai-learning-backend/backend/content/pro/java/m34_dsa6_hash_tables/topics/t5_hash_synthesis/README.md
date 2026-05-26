# Topic 34.5: Hash Table Synthesis — LRU, Random Set, SnapshotArray

**Module**: M34 (DSA6) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY
**Module 34 Progress**: 5/5 | **Course Progress**: 170 topics

## Key Concepts
- **LRU Cache**: HashMap<key→node> + DLL. O(1) get+put.
- **LFU Cache**: HashMap<key→val> + HashMap<key→freq> + HashMap<freq→LinkedHashSet>
- **RandomizedSet**: HashMap<val→index> + ArrayList<val>. O(1) insert/remove/random
- **SnapshotArray**: List<TreeMap<snap_id,val>> per index. Binary search for snap.
- **All O(1)**: the hallmark of HashMap-based designs
- **RandomizedSet remove**: swap with last element in ArrayList → O(1) remove
- **Insert-delete-getrand O(1)**: standard FAANG design question
- **Design patterns**: HashMap for O(1) lookup; ArrayList for O(1) random access; DLL for O(1) reorder

## Files: topic.json, exercises.json, project.json, README.md
