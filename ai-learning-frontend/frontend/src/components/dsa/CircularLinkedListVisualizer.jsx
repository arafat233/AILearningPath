/**
 * CircularLinkedListVisualizer — horizontal nodes + curved arc back from
 * tail to head.
 *
 * Built for D2. Distinct from LinkedListVisualizer because the tail's
 * next points back to head — there's no null terminator. Visually
 * communicates the "circle" via an arc beneath the row.
 *
 * Props:
 *   { nodes: [{id, value, state}], currentIdx?: number }
 */
import { motion } from "framer-motion";

const NODE_W = 56;
const GAP = 16;
const NODE_H = 44;
const ROW_Y = 28;

const NODE_STYLE = {
  default: { stroke: "#2a2a2a",   fill: "#1a1a1a",   text: "#ccc"    },
  active:  { stroke: "#f59e0b",   fill: "#f59e0b18", text: "#fbbf24" },
  new:     { stroke: "#00c896",   fill: "#00c89618", text: "#00c896" },
  delete:  { stroke: "#ef4444",   fill: "#ef444418", text: "#f87171" },
};

export default function CircularLinkedListVisualizer({ nodes = [], currentIdx = -1 }) {
  const n = nodes.length;
  if (n === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-[#444] text-sm">
        Empty CLL
      </div>
    );
  }

  const totalW = NODE_W * n + GAP * (n - 1) + 80;
  const totalH = ROW_Y + NODE_H + 100;
  const xOf = (i) => 40 + i * (NODE_W + GAP);
  const firstX = xOf(0) + NODE_W / 2;
  const lastX  = xOf(n - 1) + NODE_W / 2;
  const arcY1 = ROW_Y + NODE_H;
  const arcY2 = ROW_Y + NODE_H + 70;

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto p-3">
      <svg width="100%" viewBox={`0 0 ${totalW} ${totalH}`}>
        <defs>
          <marker id="cll-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
          </marker>
        </defs>

        {/* Head label */}
        <g>
          <text x={firstX} y={14} textAnchor="middle" fontSize={11} fontWeight="bold" fontFamily="monospace" fill="#60a5fa">head</text>
          <text x={firstX} y={24} textAnchor="middle" fontSize={11} fill="#60a5fa">▼</text>
        </g>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isActive = i === currentIdx;
          const colorKey = isActive ? "active" : (node.state || "default");
          const c = NODE_STYLE[colorKey] || NODE_STYLE.default;
          const x = xOf(i);
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              style={{ transformOrigin: `${x + NODE_W / 2}px ${ROW_Y + NODE_H / 2}px` }}
            >
              <rect x={x} y={ROW_Y} width={NODE_W} height={NODE_H} rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text x={x + NODE_W / 2} y={ROW_Y + NODE_H / 2 + 5} textAnchor="middle" fill={c.text} fontSize={14} fontWeight="bold" fontFamily="monospace">{node.value}</text>

              {/* Forward arrow to next adjacent node */}
              {i < n - 1 && (
                <g>
                  <line x1={x + NODE_W} y1={ROW_Y + NODE_H / 2} x2={x + NODE_W + GAP - 4} y2={ROW_Y + NODE_H / 2} stroke="#444" strokeWidth={1.5} />
                  <polygon points={`${x + NODE_W + GAP - 4},${ROW_Y + NODE_H / 2 - 4} ${x + NODE_W + GAP},${ROW_Y + NODE_H / 2} ${x + NODE_W + GAP - 4},${ROW_Y + NODE_H / 2 + 4}`} fill="#444" />
                </g>
              )}
            </motion.g>
          );
        })}

        {/* Cycle arc from tail back to head */}
        {n > 1 && (
          <g>
            <path
              d={`M ${lastX} ${arcY1} C ${lastX} ${arcY2}, ${firstX} ${arcY2}, ${firstX} ${arcY1}`}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={2}
              markerEnd="url(#cll-arrow)"
            />
            <text x={(firstX + lastX) / 2} y={arcY2 + 14} textAnchor="middle" fill="#a78bfa" fontSize={11} fontFamily="monospace">
              tail.next → head (circular)
            </text>
          </g>
        )}
        {n === 1 && (
          <g>
            <text x={firstX} y={arcY2 + 14} textAnchor="middle" fill="#a78bfa" fontSize={11} fontFamily="monospace">
              single-node CLL: node.next → itself
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
