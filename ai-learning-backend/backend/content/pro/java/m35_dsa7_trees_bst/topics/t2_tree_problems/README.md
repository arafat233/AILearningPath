# Topic 35.2: Binary Tree Problems

**Module**: M35 | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY
**Topic**: 2/5 | **Course Progress**: 171 topics

## Key Concepts
- **LCA**: if `root==p||root==q` return root; both subtrees non-null → current root is LCA
- **Balanced check**: return `-1` from height when `|l-r|>1` — propagates upward O(n) not O(n²)
- **Path Sum**: subtract node.val each level; at leaf check `target==0`
- **Max Path Sum**: `max(0, child)` ignores negative branches; update global with `l + node + r`
- **Invert**: `tmp=left; left=invert(right); right=invert(tmp); return root`
- **Serialize**: preorder with `"null"` for empty. Deserialize: queue of tokens, consume front
- **All paths**: pass path string down; add to list at leaf
- **Count complete tree**: if `leftH==rightH`: perfect subtree = `2^h - 1` → O(log²n)

## Files: topic.json, exercises.json, project.json, README.md
