# Topic 32.4: Cycle Detection — Floyd's Algorithm

**Module**: M32 (DSA4) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW
**Module 32 Progress**: 4/5 | **Course Progress**: 158 topics (92.9%)

## Key Concepts
- **Phase 1 (detect)**: slow=fast=head; loop fast.next.next & slow.next; if slow==fast → cycle
- **Phase 2 (find entry)**: reset slow=head; both advance speed 1; meet = cycle entry
- **Phase 3 (length)**: from entry, count steps back to entry
- **Meeting point ≠ cycle entry** — Phase 2 is required to find entry
- **findDuplicate (LeetCode #287)**: treat array as LL (i→nums[i]); duplicate = cycle entry
- **Happy Number (LeetCode #202)**: apply cycle detection to digit-square-sum sequence
- **getIntersection**: redirect to other head on null; meet at intersection or both null
- **Floyd proof**: L ≡ C-M (mod C) → resetting slow finds entry simultaneously with fast

## Files: topic.json, exercises.json, project.json, README.md
