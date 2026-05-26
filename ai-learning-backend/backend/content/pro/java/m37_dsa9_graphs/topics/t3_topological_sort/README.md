# Topic 3: Topological Sort — Kahn's BFS, DFS Post-Order, Course Schedule

**Module**: M37 (DSA9) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)

## Key Concepts
- Kahn's BFS: start from 0-indegree nodes; process + decrement neighbors; cycle if count<n
- DFS topo: post-order DFS, push to stack on return; reverse stack = order
- Course Schedule: canFinish = Kahn's processed count == n
- Course Schedule II: return order array from Kahn's
- Alien Dictionary: build graph from adjacent word pairs
- Task ordering: any valid topological order is a valid schedule

## Files: topic.json, exercises.json, project.json, README.md
