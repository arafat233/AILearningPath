# Topic 4: Shortest Path — Dijkstra, Bellman-Ford, Floyd-Warshall

**Module**: M37 (DSA9) | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)

## Key Concepts
- Dijkstra: min-heap; dist[u]+w < dist[v] → relax; O((V+E) log V); no negative edges
- Bellman-Ford: relax all edges V-1 times; O(VE); handles negative edges
- Floyd-Warshall: dp[i][j]=min(dp[i][j], dp[i][k]+dp[k][j]); O(V³); all-pairs
- Network Delay: single-source Dijkstra from source k
- Cheapest Flights K Stops: Bellman-Ford K+1 iterations
- Word Ladder: BFS on implicit graph; level = steps
- 0-1 BFS: edges weight 0 or 1; use deque; O(V+E)

## Files: topic.json, exercises.json, project.json, README.md
