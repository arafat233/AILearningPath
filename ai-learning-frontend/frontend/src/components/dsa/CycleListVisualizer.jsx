/**
 * CycleListVisualizer — horizontal linked list with optional cycle arc
 * and slow/fast pointer markers above nodes.
 *
 * Built for M32-T4 (Floyd's cycle detection). LinkedListVisualizer
 * couldn't grow this without bloating its props for an unrelated
 * concern, so it's a sibling primitive.
 */
import { motion } from "framer-motion";

const NODE_W = 56;   // total node width (data + arrow stub)
const GAP    = 16;   // gap between nodes
const NODE_H = 44;
const ROW_Y  = 80;   // y of the node row in the SVG

export default function CycleListVisualizer({
  nodes = [],
  cycleEntryIdx = null,
  slow = -1,
  fast = -1,
}) {
  const n = nodes.length;
  if (n === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-[#444] text-sm">
        Empty list
      </div>
    );
  }

  const totalW = NODE_W * n + GAP * (n - 1) + 80;
  const totalH = cycleEntryIdx == null ? 130 : 200;
  const xOf = (i) => 40 + i * (NODE_W + GAP);

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto p-3">
      <svg width="100%" viewBox={`0 0 ${totalW} ${totalH}`}>
        {/* Slow/Fast labels above */}
        {nodes.map((node, i) => {
          const x  = xOf(i) + NODE_W / 2;
          const labels = [];
          if (slow === i) labels.push({ name: "slow", color: "#60a5fa" });
          if (fast === i) labels.push({ name: "fast", color: "#fbbf24" });
          return labels.map((l, k) => (
            <g key={`p-${i}-${k}`}>
              <text x={x} y={26 - k * 14} textAnchor="middle" fill={l.color} fontSize={11} fontWeight="bold" fontFamily="monospace">{l.name}</text>
              <text x={x} y={38 - k * 14} textAnchor="middle" fill={l.color} fontSize={12}>▼</text>
            </g>
          ));
        })}

        {/* Node row */}
        {nodes.map((node, i) => {
          const x = xOf(i);
          const isMet = slow === i && fast === i;
          const isSlow = slow === i;
          const isFast = fast === i;
          const stroke = isMet ? "#00c896" : isFast ? "#f59e0b" : isSlow ? "#3b82f6" : "#2a2a2a";
          const fill   = isMet ? "#00c89618" : isFast ? "#f59e0b18" : isSlow ? "#3b82f618" : "#1a1a1a";
          const text   = isMet ? "#00c896" : isFast ? "#fbbf24" : isSlow ? "#60a5fa" : "#ccc";
          return (
            <motion.g
              key={`n-${node.id}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              style={{ transformOrigin: `${x + NODE_W / 2}px ${ROW_Y + NODE_H / 2}px` }}
            >
              <rect x={x} y={ROW_Y} width={NODE_W} height={NODE_H} rx={6} fill={fill} stroke={stroke} strokeWidth={2} />
              <text x={x + NODE_W / 2} y={ROW_Y + NODE_H / 2 + 5} textAnchor="middle" fill={text} fontSize={14} fontWeight="bold" fontFamily="monospace">{node.value}</text>
              {/* Forward arrow to next node (or NULL) */}
              {i < n - 1 ? (
                <g>
                  <line x1={x + NODE_W} y1={ROW_Y + NODE_H / 2} x2={x + NODE_W + GAP - 4} y2={ROW_Y + NODE_H / 2} stroke="#444" strokeWidth={1.5} />
                  <polygon points={`${x + NODE_W + GAP - 4},${ROW_Y + NODE_H / 2 - 4} ${x + NODE_W + GAP},${ROW_Y + NODE_H / 2} ${x + NODE_W + GAP - 4},${ROW_Y + NODE_H / 2 + 4}`} fill="#444" />
                </g>
              ) : cycleEntryIdx == null && (
                <text x={x + NODE_W + 20} y={ROW_Y + NODE_H / 2 + 5} fontSize={11} fontFamily="monospace" fill="#555">→ NULL</text>
              )}
            </motion.g>
          );
        })}

        {/* Cycle arc — last node back to cycleEntryIdx */}
        {cycleEntryIdx != null && (
          <g>
            <path
              d={`M ${xOf(n - 1) + NODE_W / 2} ${ROW_Y + NODE_H}
                  C ${xOf(n - 1) + NODE_W / 2} ${ROW_Y + NODE_H + 80},
                    ${xOf(cycleEntryIdx) + NODE_W / 2} ${ROW_Y + NODE_H + 80},
                    ${xOf(cycleEntryIdx) + NODE_W / 2} ${ROW_Y + NODE_H + 4}`}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={2}
              markerEnd="url(#cycle-arrow)"
            />
            <defs>
              <marker id="cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
              </marker>
            </defs>
            <text x={(xOf(n - 1) + xOf(cycleEntryIdx)) / 2 + NODE_W / 2} y={ROW_Y + NODE_H + 95} textAnchor="middle" fill="#a78bfa" fontSize={11} fontFamily="monospace">
              cycle (tail → node {cycleEntryIdx})
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
