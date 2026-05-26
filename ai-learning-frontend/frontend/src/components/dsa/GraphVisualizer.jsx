/**
 * GraphVisualizer — SVG renderer for the fixed-layout graph used by
 * the BFS/DFS animations.
 *
 * Built for M37-T1. Force-directed dynamic layout is a future
 * upgrade; nodes carry precomputed (x, y) for now.
 *
 * Props:
 *   { graph, nodeStates, edgeStates, width?, height? }
 *   graph = { nodes: [{id, x, y}], edges: [[u, v]] }
 *   nodeStates: { id: 'default'|'queued'|'visiting'|'visited' }
 *   edgeStates: { 'u-v': 'default'|'tree'|'rejected' }   (key = sorted edgeKey)
 */
import { motion } from "framer-motion";
import { edgeKey } from "./algorithms/graph.js";

const NODE_COLOR = {
  default:  { fill: "#1a1a1a",   stroke: "#2a2a2a", text: "#ccc"    },
  queued:   { fill: "#3b82f618", stroke: "#3b82f6", text: "#60a5fa" },
  visiting: { fill: "#f59e0b18", stroke: "#f59e0b", text: "#fbbf24" },
  visited:  { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
};

const EDGE_COLOR = {
  default:  { stroke: "#2a2a2a", width: 1.5, dash: "" },
  tree:     { stroke: "#00c896", width: 2.5, dash: "" },
  rejected: { stroke: "#ef4444", width: 1.5, dash: "4 3" },
};

export default function GraphVisualizer({ graph, nodeStates = {}, edgeStates = {}, width = 500, height = 380 }) {
  const posOf = Object.fromEntries(graph.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Edges first so nodes draw on top */}
        {graph.edges.map(([u, v], i) => {
          const a = posOf[u]; const b = posOf[v];
          if (!a || !b) return null;
          const st = edgeStates[edgeKey(u, v)] || "default";
          const c  = EDGE_COLOR[st] || EDGE_COLOR.default;
          return (
            <line
              key={`e-${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={c.stroke}
              strokeWidth={c.width}
              strokeDasharray={c.dash}
            />
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((n, i) => {
          const st = nodeStates[n.id] || "default";
          const c  = NODE_COLOR[st] || NODE_COLOR.default;
          return (
            <motion.g
              key={`n-${n.id}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            >
              <circle cx={n.x} cy={n.y} r={22} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text
                x={n.x} y={n.y + 5}
                textAnchor="middle"
                fill={c.text}
                fontSize={14}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {n.id}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
