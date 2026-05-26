# Topic 31.1: String Fundamentals — Immutability, Operations, Complexity

**Module**: M31 (DSA3) | **Difficulty**: ⭐⭐⭐⭐ (4/10) | **Status**: 🟡 READY FOR REVIEW
**Module 31 Progress**: 1/5 | **Course Progress**: 150 topics (88.2%)

## Key Concepts
- **String is immutable**: every `+=` creates a NEW object on the heap → O(n²) in loops
- **StringBuilder**: mutable buffer, `append()` amortized O(1) → use for all loop string building
- **String pool**: literals share pool (`"a"=="a"` is true); `new String("a")` always new object
- **Always `.equals()`** for content comparison — NEVER `==` (reference comparison)
- **`charAt(i)`**: O(1). **`substring(l,r)`**: O(r-l) — copies chars, avoid in loops
- **`int[26]` for frequency**: O(1) per char, O(1) space (not HashMap)
- **`s.length()`**: O(1) — stored field. **`s.equals(t)`**: O(n). **`s.contains(t)`**: O(n×m)
- **`toCharArray()`**: O(n) — do once at start, then use array
- **`String.join()`** and **`split()`**: O(total chars) — fine to use
- **`StringBuilder.reverse()`**: O(n) — elegant, prefer over manual reversal
- **`sb.toString()`**: O(n) — one final copy; pay once at the end

## Files: topic.json, exercises.json, project.json, README.md
