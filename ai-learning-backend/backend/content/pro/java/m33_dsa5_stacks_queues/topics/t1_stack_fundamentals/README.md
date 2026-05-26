# Topic 33.1: Stack Fundamentals

**Module**: M33 (DSA5) | **Difficulty**: ⭐⭐⭐⭐ (4/10) | **Status**: 🟡 READY
**Module 33 Progress**: 1/5 | **Course Progress**: 160 topics

## Key Concepts
- **Use `ArrayDeque` not `Stack`**: faster, not synchronized, recommended by Java docs
- **Stack as Deque**: `push=addFirst`, `pop=removeFirst`, `peek=peekFirst`
- **Valid Parens**: push opens, pop+verify closes, empty at end = valid
- **Min Stack**: two-stack trick — minStack grows only when val ≤ current min
- **Integer ==**: boxes for values >127 → use `(int)stack.pop()` cast or `.equals()`
- **RPN Evaluation**: stack, pop two operands on operator, push result
- **Daily Temperatures**: monotonic decreasing stack of indices; `result[idx]=i-idx`
- **Decode String**: push count+StringBuilder on `[`, pop and repeat on `]`
- **Calculator II**: previous operator applied to current num; +push, -push negative, */ compute immediately
- **Histogram**: increasing stack, virtual 0 sentinel at end; `width = stack.isEmpty()?i:i-stack.peek()-1`

## Files: topic.json, exercises.json, project.json, README.md
