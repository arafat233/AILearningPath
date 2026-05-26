# Topic 1: Backtracking Template — Choose, Explore, Undo

**Module**: M40 | **Difficulty**: ⭐⭐⭐⭐⭐

## Key Concepts
- Template: choose → recurse → undo (3 steps, always)
- State restoration: remove last added element after recursive call
- Base case: when condition met, add copy of current to results
- Pruning: skip invalid choices early (sort + break)
- Combination Sum: i not i+1 to allow element reuse
- Subsets: add current at EVERY call, not just at leaf

## Files: topic.json, exercises.json, project.json, README.md
