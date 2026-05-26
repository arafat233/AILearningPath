# Topic 3: Sudoku and N-Queens — Constraint Satisfaction

**Module**: M40 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐

## Key Concepts
- N-Queens conflict: same column OR diagonal (|r1-r2|==|c1-c2|)
- Sudoku valid: check row, column, and 3x3 box
- Sudoku box index: `b[3*(r/3)+i/3][3*(c/3)+i%3]`
- Both: try all choices, recurse, undo on failure
- Return true as soon as solution found (don't explore all)
- 3-col sets (seen_cols, seen_rows, seen_boxes) can optimize N-Queens to O(n)

## Files: topic.json, exercises.json, project.json, README.md
