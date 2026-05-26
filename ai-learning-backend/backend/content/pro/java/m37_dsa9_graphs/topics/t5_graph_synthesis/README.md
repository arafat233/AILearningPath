# Topic 5: Graph Synthesis — MST, Kruskal, Union-Find Applications

**Module**: M37 (DSA9) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)

## Key Concepts
- Kruskal MST: sort edges by weight; union-find to avoid cycles; O(E log E)
- Prim MST: min-heap of (cost, node); O((V+E) log V)
- Redundant Connection: union-find; first edge where both endpoints already connected
- Number of Operations to Make Network Connected: union-find + count extra edges
- Critical Connections: Tarjan's bridge finding with disc/low arrays
- Swim in Rising Water: Dijkstra on grid (level = max cell value on path)
- Accounts Merge: union-find on emails; group by root

## Files: topic.json, exercises.json, project.json, README.md
