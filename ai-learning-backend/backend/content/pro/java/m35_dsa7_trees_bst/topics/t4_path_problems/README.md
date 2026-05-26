# Topic 35.4: Tree Path Problems

**Module**: M35 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY
**Topic**: 4/5 | **Course Progress**: 173 topics

## Key Concepts
- **Path Sum I**: `target -= node.val`; at leaf check `target==0`
- **Path Sum II**: DFS backtrack — add to path → recurse → `path.remove(last)`
- **Max Path Sum**: `max(0, dfs(child))` ignores negative branches; update global with `l + node + r`
- **Path Sum III** (any downward path): prefix sum + HashMap in DFS; `pm.put(0L, 1)`; backtrack map after each subtree
- **Sum Root-to-Leaf Numbers**: `cur = cur*10 + node.val`; add to total at leaf
- **Good Nodes**: pass `maxSoFar` down; node is good if `node.val >= maxSoFar`
- **Pseudo-Palindromic paths**: bitmask XOR of digit frequencies; palindrome iff at most 1 bit set: `(mask & (mask-1)) == 0`

## Files: topic.json, exercises.json, project.json, README.md
