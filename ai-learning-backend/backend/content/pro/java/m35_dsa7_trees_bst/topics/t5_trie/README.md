# Topic 35.5: Trie — Prefix Tree

**Module**: M35 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY
**Topic**: 5/5 ✅ | **Course Progress**: 174 topics (M35 Complete)

## Key Concepts
- **Trie Node**: `Trie[] ch = new Trie[26]; boolean end;`
- **Insert**: O(m) — traverse creating nodes for each char; mark `end=true` at last
- **Search**: O(m) — traverse; return `cur.end` (full word must be inserted)
- **startsWith**: O(m) — traverse; return `true` if path exists (no end check)
- **Autocomplete**: traverse to prefix end → DFS collecting all `end=true` words
- **Word Search II**: build Trie of target words; DFS on grid traversing Trie simultaneously; prune when no matching prefix
- **Replace Words**: stop early in Trie when first complete word found
- **MapSum**: store cumulative value at each Trie node; insert adds `diff = new_val - old_val`
- **Trie vs HashMap for prefix**: HashMap O(n) scan all keys; Trie O(m+k) per query

## Files: topic.json, exercises.json, project.json, README.md
