# Topic 32.2: Two-Pointer Techniques on Linked Lists

**Module**: M32 (DSA4) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW
**Module 32 Progress**: 2/5 | **Course Progress**: 156 topics (91.8%)

## Key Concepts
- **Fast/slow pattern**: slow=1 step, fast=2 steps
- **Find middle**: `fast=head.next` start; when fast=null/fast.next=null → slow is at END of first half
- **Detect cycle**: `while(fast!=null&&fast.next!=null)`: slow==fast → cycle
- **Cycle entry (Phase 2)**: after detection, reset slow=head; both advance speed 1; meet at cycle entry
- **Cycle length**: from entry, count steps until return to entry
- **Palindrome LL**: (1) find middle, (2) reverse second half in-place, (3) compare both halves
- **nth from end**: fast n steps ahead of slow; when fast=null → slow.next is target
- **Intersection**: redirect to other list's head on reaching null; meet at intersection (or both null)
- **Reorder list**: find middle + reverse second half + interleave two halves

## Files: topic.json, exercises.json, project.json, README.md
