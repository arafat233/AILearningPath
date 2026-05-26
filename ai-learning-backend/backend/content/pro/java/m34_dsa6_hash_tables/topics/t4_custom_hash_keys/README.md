# Topic 34.4: Custom Hash Keys — Composite Keys, 2D Grid, Tuple Hashing

**Module**: M34 (DSA6) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY
**Module 34 Progress**: 4/5 | **Course Progress**: 169 topics

## Key Concepts
- **String key**: `row+","+col` for 2D grid coordinates → O(1) HashMap lookup
- **Sorted string key**: group anagrams `Arrays.sort(chars)` + `new String(chars)`
- **Frequency string key**: `int[26]` → `"1#0#0..."` → O(m) vs O(m log m) sort key
- **Pair key**: `x + "," + y` or use `long key = (long)x << 32 | y` (no separator needed)
- **`hashCode()` contract**: equal objects MUST have same hashCode
- **`equals()` contract**: hashCode same → check equals (collision); equals true → same bucket chain
- **Record as key**: Java 16+ `record Point(int x, int y){}` — auto hashCode/equals
- **Mutable keys BREAK HashMap**: never use mutable objects as HashMap keys

## Files: topic.json, exercises.json, project.json, README.md
