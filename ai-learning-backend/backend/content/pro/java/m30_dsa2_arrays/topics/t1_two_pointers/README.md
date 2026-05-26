# Topic 30.1: Two Pointers — O(n) Pair Problems

**Module**: M30 (DSA2) | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 30 Progress**: 1/5 | **Course Progress**: 145 topics (85.3%)

## Key Concepts
- **Two pointers**: O(n) on sorted arrays — replace O(n²) brute force pair search
- **Inward pattern**: `lo=0, hi=n-1`, converge toward each other (pair problems)
- **Same-direction pattern**: `slow` writes, `fast` reads (remove duplicates, move zeros)
- **Sort first**: unsorted array → sort O(n log n) → two pointers O(n) = O(n log n) total
- **Pair sum**: `sum < target → lo++`; `sum > target → hi--`; `sum == target → found`
- **Container water**: always move SHORTER pointer — moving taller can only reduce volume
- **Remove duplicates**: `slow=1`; advance slow only when `nums[fast] != nums[fast-1]`
- **Move zeros**: slow tracks write pos for non-zeros; after loop fill rest with 0
- **Three Sum**: sort + fix `i` + TP on `[i+1..n-1]` → O(n²). Skip all duplicate i/lo/hi
- **Four Sum**: two outer loops + TP → O(n³). Use `long` sum to avoid overflow
- **isPalindrome**: `lo` from left, `hi` from right, skip non-alphanumeric, compare lowercase
- **Trapping rain water**: process from shorter side; track maxLeft, maxRight → O(n) O(1)
- **Sorted squares**: fill from BACK; largest squares always at array ends

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
