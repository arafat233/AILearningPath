# Topic 4: Word Search — Grid Backtracking

**Module**: M40 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- Mark visited: set board[r][c]='#'; restore after DFS
- 4-directional DFS from each starting cell
- Base case: index == word.length() → return true
- Prune: if out of bounds or mismatch → return false
- Word Search II: Trie + backtrack; prune Trie when word found
- O(m*n*4^L) — m*n starting cells, 4^L paths of length L

## Files: topic.json, exercises.json, project.json, README.md
