# Topic 32.3: Linked List Reversal

**Module**: M32 (DSA4) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW
**Module 32 Progress**: 3/5 | **Course Progress**: 157 topics (92.4%)

## Key Concepts
- **3-pointer reversal**: `prev=null; while(curr): next=curr.next; curr.next=prev; prev=curr; curr=next`
- **Return `prev`** (new head) — `curr` is null at end of loop
- **head becomes tail** after reversal — connect it to the next segment
- **reverseBetween**: advance to left-1; save prevLeft; reverse left..right; reconnect
- **reverseKGroup**: count k nodes (return head if <k); reverse k; head.next=reverseKGroup(rest,k); return prev
- **Palindrome**: find middle + reverse second half + compare; optional: restore
- **Swap pairs**: dummy+prev; while 2 nodes remain: rewire first/second; prev=first (now 2nd position)
- **Reorder list**: find middle + reverse second half + interleave

## Files: topic.json, exercises.json, project.json, README.md
