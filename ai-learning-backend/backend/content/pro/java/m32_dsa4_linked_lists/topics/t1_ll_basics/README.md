# Topic 32.1: Linked List Basics — Node, Traversal, Dummy Head

**Module**: M32 (DSA4) | **Difficulty**: ⭐⭐⭐⭐ (4/10) | **Status**: 🟡 READY FOR REVIEW
**Module 32 Progress**: 1/5 | **Course Progress**: 155 topics (91.2%)

## Key Concepts
- **ListNode**: `int val; ListNode next; ListNode(int val) {this.val=val;}`
- **Dummy head**: `ListNode dummy=new ListNode(0); dummy.next=head;` — eliminates all head-special-cases
- **Always return `dummy.next`** not `head` — head may have changed
- **Traversal**: `while(curr!=null)` — advance with `curr=curr.next`
- **Delete**: `prev.next=curr.next` — need prev pointer (dummy provides it)
- **Insert after curr**: `newNode.next=curr.next; curr.next=newNode`
- **Array vs LL**: Array O(1) access/search, O(n) insert. LL O(1) insert/delete (given ptr), O(n) access
- **removeNthFromEnd**: dummy + fast gap n+1 ahead of slow; when fast=null: slow.next is target
- **mergeTwoSorted**: dummy + while(l1&&l2) compare; attach remainder; O(n+m) O(1)
- **addTwoNumbers**: while(l1||l2||carry≠0); carry=sum/10; digit=sum%10
- **deleteDuplicates**: same val → curr.next=curr.next.next; else advance curr

## Files: topic.json, exercises.json, project.json, README.md
