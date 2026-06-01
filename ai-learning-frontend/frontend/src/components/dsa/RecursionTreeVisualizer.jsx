/**
 * RecursionTreeVisualizer — N-ary call-tree renderer for recursion-tree kind.
 *
 * Distinct from TreeVisualizer (binary BST, value circles) and CallStackVisualizer
 * (vertical stack of frames). This draws the recursion as a branching tree of
 * pill-shaped call nodes, revealed incrementally, with memo-hit and pruned states.
 *
 * Props: { frame } where frame = { nodes:[{id,parentId,label,sublabel,x,y,state}],
 *          extent:{maxX,maxY}, activeId }
 */
import { motion, AnimatePresence } from "framer-motion";

const STATE_STYLE = {
  default:    { fill: "#1a1a1a",   stroke: "#2a2a2a", text: "#bbb",     edge: "#2a2a2a" },
  active:     { fill: "#f59e0b22", stroke: "#f59e0b", text: "#fbbf24",  edge: "#f59e0b" },
  returning:  { fill: "#00c89622", stroke: "#00c896", text: "#34d399",  edge: "#00c896" },
  "memo-hit": { fill: "#06b6d422", stroke: "#22d3ee", text: "#67e8f9",  edge: "#22d3ee" },
  pruned:     { fill: "#7f1d1d22", stroke: "#ef4444", text: "#fca5a5",  edge: "#ef4444" },
};

const PILL_W = 86;
const PILL_H = 30;
const PAD_X  = 60;
const LEVEL_H = 78;
const TOP_PAD = 30;

export default function RecursionTreeVisualizer({ frame }) {
  if (!frame || !frame.nodes?.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
        <span className="text-[#444] text-sm">Press Play to grow the recursion tree</span>
      </div>
    );
  }

  const { nodes, extent } = frame;
  const maxX = extent?.maxX ?? Math.max(...nodes.map((n) => n.x), 0);
  const maxY = extent?.maxY ?? Math.max(...nodes.map((n) => n.y), 0);

  // Pixel canvas sized from the full extent so nodes never shift between frames.
  const width  = Math.max(360, (maxX + 1) * (PILL_W + 18) + PAD_X * 2);
  const height = TOP_PAD * 2 + (maxY + 1) * LEVEL_H;

  const slotW = maxX > 0 ? (width - PAD_X * 2) / maxX : 0;
  const px = (x) => (maxX === 0 ? width / 2 : PAD_X + x * slotW);
  const py = (y) => TOP_PAD + y * LEVEL_H + PILL_H / 2;

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ minWidth: "100%" }}>
        {/* Edges */}
        {nodes.map((n) => {
          if (!n.parentId || !byId[n.parentId]) return null;
          const p = byId[n.parentId];
          const st = STATE_STYLE[n.state] || STATE_STYLE.default;
          return (
            <motion.line
              key={`e-${n.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={px(p.x)} y1={py(p.y) + PILL_H / 2}
              x2={px(n.x)} y2={py(n.y) - PILL_H / 2}
              stroke={st.edge}
              strokeWidth={1.5}
              strokeDasharray={n.state === "memo-hit" ? "4 3" : "0"}
            />
          );
        })}

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((n) => {
            const st = STATE_STYLE[n.state] || STATE_STYLE.default;
            const cx = px(n.x), cy = py(n.y);
            const isActive = n.id === frame.activeId;
            return (
              <motion.g
                key={`n-${n.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.18 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <rect
                  x={cx - PILL_W / 2} y={cy - PILL_H / 2}
                  width={PILL_W} height={PILL_H} rx={8}
                  fill={st.fill} stroke={st.stroke}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={n.state === "memo-hit" ? "5 3" : "0"}
                />
                <text x={cx} y={cy - 1} textAnchor="middle" fill={st.text}
                      fontSize={11} fontWeight="bold" fontFamily="monospace">
                  {n.label}
                </text>
                {n.sublabel && (
                  <text x={cx} y={cy + 11} textAnchor="middle" fill={st.text}
                        fontSize={9} fontFamily="monospace" opacity={0.8}>
                    {n.sublabel}
                  </text>
                )}
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}
