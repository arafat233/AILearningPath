# Topic 35.1: Tree Traversals

**Module**: M35 (DSA7) | **Difficulty**: ⭐⭐⭐⭐ (4/10) | **Status**: 🟡 READY
**Topic**: 1/5 | **Course Progress**: 170 topics

## Key Concepts
- **Inorder (L-N-R)**: BST inorder = sorted ascending
- **Preorder (N-L-R)**: root first — used to clone tree
- **Postorder (L-R-N)**: leaves first — used to delete tree
- **Iterative inorder**: push-left loop → pop → visit → go right
- **Level order BFS**: `int size=q.size()` before inner loop — freezes level count
- **Right side view**: last node (`i==sz-1`) of each BFS level
- **Zigzag**: `addFirst`/`addLast` toggle with `boolean lr` flag
- **Symmetric**: `mirror(l.left, r.right) && mirror(l.right, r.left)`
- **Diameter**: `max(leftH + rightH)` at each node; return height upward
- **Flatten to list**: Morris-style O(1) space — find rightmost of left, connect right subtree

## Files: topic.json, exercises.json, project.json, README.md
