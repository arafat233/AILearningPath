/**
 * graph — BFS / DFS step generators on a fixed-layout undirected graph.
 *
 * Used by M37-T1 (Graph Representation — Adjacency List, BFS, DFS).
 * Force-directed dynamic layout is out of scope for this iteration;
 * nodes have precomputed positions for SVG rendering.
 *
 * Frame shape:
 *   {
 *     nodeStates: Record<id, 'default'|'queued'|'visiting'|'visited'>,
 *     edgeStates: Record<edgeKey, 'default'|'tree'|'rejected'>,
 *     container:  string[],     // queue for BFS, stack for DFS
 *     containerLabel: 'queue'|'stack',
 *     order:      string[],     // visit order so far
 *     step: { description, detail }
 *   }
 */

export const DEFAULT_GRAPH = {
  nodes: [
    { id: "A", x:  80, y:  60 },
    { id: "B", x: 240, y:  60 },
    { id: "C", x: 400, y:  60 },
    { id: "D", x:  80, y: 200 },
    { id: "E", x: 240, y: 200 },
    { id: "F", x: 400, y: 200 },
    { id: "G", x: 320, y: 320 },
  ],
  edges: [
    ["A", "B"], ["A", "D"],
    ["B", "C"], ["B", "E"],
    ["C", "F"],
    ["D", "E"],
    ["E", "F"], ["E", "G"],
    ["F", "G"],
  ],
};

export const BFS_CODE = `// BFS on adjacency list
List<String> bfs(Map<String, List<String>> adj, String start) {
  List<String> order = new ArrayList<>();
  Set<String> visited = new HashSet<>();
  Deque<String> queue = new ArrayDeque<>();
  queue.add(start);
  visited.add(start);
  while (!queue.isEmpty()) {
    String u = queue.poll();      // FIFO
    order.add(u);
    for (String v : adj.get(u)) {
      if (visited.add(v)) {       // .add() returns false if already present
        queue.add(v);
      }
    }
  }
  return order;
}`;

export const DFS_CODE = `// DFS (iterative) on adjacency list
List<String> dfs(Map<String, List<String>> adj, String start) {
  List<String> order = new ArrayList<>();
  Set<String> visited = new HashSet<>();
  Deque<String> stack = new ArrayDeque<>();
  stack.push(start);
  while (!stack.isEmpty()) {
    String u = stack.pop();       // LIFO
    if (!visited.add(u)) continue;
    order.add(u);
    // push neighbours in reverse so they pop in adjacency order
    List<String> nbrs = adj.get(u);
    for (int i = nbrs.size() - 1; i >= 0; i--) {
      String v = nbrs.get(i);
      if (!visited.contains(v)) stack.push(v);
    }
  }
  return order;
}`;

export function edgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export function adjacencyMap(graph) {
  const adj = {};
  for (const n of graph.nodes) adj[n.id] = [];
  for (const [u, v] of graph.edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  for (const k of Object.keys(adj)) adj[k].sort();
  return adj;
}

const initialEdgeStates = (graph) => {
  const e = {};
  for (const [u, v] of graph.edges) e[edgeKey(u, v)] = "default";
  return e;
};
const initialNodeStates = (graph) => {
  const n = {};
  for (const node of graph.nodes) n[node.id] = "default";
  return n;
};

export function generateBFSSteps(graph, start) {
  const adj = adjacencyMap(graph);
  if (!adj[start]) return [];

  const frames = [];
  const ns = initialNodeStates(graph);
  const es = initialEdgeStates(graph);
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  ns[start] = "queued";
  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    container: [...queue],
    containerLabel: "queue",
    order: [...order],
    step: { description: `BFS from ${start}.`, detail: `Enqueue ${start}, mark visited.` },
  });

  while (queue.length > 0) {
    const u = queue.shift();
    ns[u] = "visiting";
    order.push(u);
    frames.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      container: [...queue],
      containerLabel: "queue",
      order: [...order],
      step: { description: `Dequeue ${u}. Process neighbors: [${adj[u].join(", ")}].`, detail: `Visit order so far: ${order.join(" → ")}` },
    });

    for (const v of adj[u]) {
      const ek = edgeKey(u, v);
      if (visited.has(v)) {
        const prev = es[ek];
        es[ek] = "rejected";
        frames.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          container: [...queue],
          containerLabel: "queue",
          order: [...order],
          step: { description: `Edge ${u}–${v}: ${v} already visited — skip.`, detail: "" },
        });
        // restore prior so unrelated future steps don't keep red
        es[ek] = prev === "tree" ? "tree" : "default";
      } else {
        visited.add(v);
        queue.push(v);
        ns[v] = "queued";
        es[ek] = "tree";
        frames.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          container: [...queue],
          containerLabel: "queue",
          order: [...order],
          step: { description: `Discover ${v} — mark visited, enqueue.`, detail: `Queue: [${queue.join(", ")}]` },
        });
      }
    }

    ns[u] = "visited";
  }

  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    container: [],
    containerLabel: "queue",
    order: [...order],
    step: { description: "BFS complete.", detail: `Visit order: ${order.join(" → ")}` },
  });

  return frames;
}

export function generateDFSSteps(graph, start) {
  const adj = adjacencyMap(graph);
  if (!adj[start]) return [];

  const frames = [];
  const ns = initialNodeStates(graph);
  const es = initialEdgeStates(graph);
  const visited = new Set();
  const stack = [start];
  const order = [];
  // Track which edge a node was pushed from, so we can light it as 'tree'
  // when the node is actually popped + visited (matches BFS visualisation).
  const pushedFrom = { [start]: null };

  ns[start] = "queued";
  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    container: [...stack],
    containerLabel: "stack",
    order: [...order],
    step: { description: `DFS from ${start}.`, detail: `Push ${start} onto the stack.` },
  });

  while (stack.length > 0) {
    const u = stack.pop();
    if (visited.has(u)) {
      ns[u] = "visited";
      frames.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        container: [...stack],
        containerLabel: "stack",
        order: [...order],
        step: { description: `Pop ${u} — already visited, skip.`, detail: "" },
      });
      continue;
    }

    visited.add(u);
    if (pushedFrom[u]) {
      es[edgeKey(pushedFrom[u], u)] = "tree";
    }
    ns[u] = "visiting";
    order.push(u);
    frames.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      container: [...stack],
      containerLabel: "stack",
      order: [...order],
      step: { description: `Pop ${u}, mark visiting. Order: ${order.join(" → ")}.`, detail: `Push unvisited neighbours in reverse adjacency order.` },
    });

    // Push neighbours in reverse so they pop in adjacency order
    const nbrs = [...adj[u]];
    for (let i = nbrs.length - 1; i >= 0; i--) {
      const v = nbrs[i];
      if (visited.has(v)) continue;
      stack.push(v);
      pushedFrom[v] = u;
      if (ns[v] === "default") ns[v] = "queued";
      frames.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        container: [...stack],
        containerLabel: "stack",
        order: [...order],
        step: { description: `Push ${v} (neighbour of ${u}).`, detail: `Stack: [${stack.join(", ")}]` },
      });
    }

    ns[u] = "visited";
  }

  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    container: [],
    containerLabel: "stack",
    order: [...order],
    step: { description: "DFS complete.", detail: `Visit order: ${order.join(" → ")}` },
  });

  return frames;
}
