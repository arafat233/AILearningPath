# Topic 32.5: Merge and Sort Linked Lists

**Module**: M32 (DSA4) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW
**Module 32 Progress**: 5/5 ✅ | **Course Progress**: 159 topics (93.5%)

## Key Concepts
- **mergeTwoSorted**: dummy + while(l1&&l2) compare; attach remainder; O(n+m) O(1)
- **mergeKSorted**: `PriorityQueue<ListNode> pq=(a,b)->a.val-b.val`; push all heads; extract-push loop; O(N log K)
- **sortList (merge sort)**: find middle `fast=head.next`; `slow.next=null` to split; recurse + merge; O(n log n) O(log n)
- **split trick**: `fast=head.next` (not `head`) — ensures correct split for even-length lists
- **Why merge sort not quicksort**: LL has no O(1) random access → quicksort pivot partition O(n) per level → O(n²)
- **Bottom-up merge sort**: O(1) space — merge 1-by-1, 2-by-2, 4-by-4... iteratively
- **reorderList**: (1) find middle, (2) reverse second half, (3) interleave: L0→Ln→L1→Ln-1
- **Merge K complexity**: N total nodes, K lists → O(N log K) with heap vs O(NK) pairwise

## Files: topic.json, exercises.json, project.json, README.md
