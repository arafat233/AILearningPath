# Topic 35.3: BST Operations

**Module**: M35 | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY
**Topic**: 3/5 | **Course Progress**: 172 topics

## Key Concepts
- **Validate BST**: `valid(r, Long.MIN_VALUE, Long.MAX_VALUE)` — pass bounds not just check parent
- **Use `Long` not `Integer`**: `Integer.MIN_VALUE` as node value would fail with Integer bounds
- **Kth Smallest**: inorder traversal, decrement counter, save when `k==0`
- **Delete 2-children**: find inorder successor = leftmost of right subtree; replace val; delete successor
- **BST LCA**: both < root → go left; both > root → go right; else current root is LCA. O(h) not O(n)
- **BST Iterator**: stack + pushLeft. `next()`: pop + push left of right subtree. O(h) space, O(1) amortized
- **Greater Sum Tree**: reverse inorder (R-N-L), accumulate suffix sum from largest to smallest
- **Recover BST**: inorder finds two wrong nodes — first violation gives `first`, second gives `second`

## Files: topic.json, exercises.json, project.json, README.md
