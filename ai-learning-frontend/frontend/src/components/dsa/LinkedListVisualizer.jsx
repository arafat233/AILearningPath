/**
 * LinkedListVisualizer — animated node-chain renderer.
 *
 * Ported from dsalearn/components/visualizers/LinkedListVisualizer.tsx:
 *   - Dropped `'use client'`
 *   - Stripped TS `ListNode` / `Props` interfaces (kept as JSDoc)
 *   - Renamed `.tsx` → `.jsx`
 *
 * @typedef {object} ListNode
 * @property {string} id
 * @property {number|string} value
 * @property {'default'|'active'|'found'|'new'|'delete'|'head'|'tail'} state
 */
import { motion, AnimatePresence } from "framer-motion";

const NODE_STYLE = {
  default: { border: "#2a2a2a", text: "#ccc",    bg: "#1a1a1a"    },
  active:  { border: "#f59e0b", text: "#fbbf24", bg: "#f59e0b18" },
  found:   { border: "#00c896", text: "#00c896", bg: "#00c89618" },
  new:     { border: "#00c896", text: "#00c896", bg: "#00c89618" },
  delete:  { border: "#ef4444", text: "#f87171", bg: "#ef444418" },
  head:    { border: "#3b82f6", text: "#60a5fa", bg: "#3b82f618" },
  tail:    { border: "#a78bfa", text: "#c4b5fd", bg: "#a78bfa18" },
};

/**
 * @param {{ nodes: ListNode[], headLabel?: string }} props
 */
export default function LinkedListVisualizer({ nodes = [], headLabel = "head" }) {
  return (
    <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max mx-auto w-fit">
        {/* HEAD label */}
        <div className="flex flex-col items-center mr-2">
          <span className="text-[10px] text-blue-400 font-bold font-mono">{headLabel}</span>
          <span className="text-blue-400 text-xs">→</span>
        </div>

        <AnimatePresence mode="popLayout">
          {nodes.map((node, i) => {
            const style = NODE_STYLE[node.state] || NODE_STYLE.default;
            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center"
              >
                {/* Node box: [data | next] */}
                <div
                  className="flex rounded-lg overflow-hidden border-2 h-12"
                  style={{ borderColor: style.border, background: style.bg }}
                >
                  <div
                    className="w-12 flex items-center justify-center font-bold font-mono text-base border-r"
                    style={{ color: style.text, borderColor: style.border }}
                  >
                    {node.value}
                  </div>
                  <div
                    className="w-8 flex items-center justify-center text-xs"
                    style={{ color: "#444" }}
                  >
                    {i === nodes.length - 1
                      ? <span className="text-[10px] text-[#444]">∅</span>
                      : <span className="text-[10px] text-[#555]">→</span>}
                  </div>
                </div>

                {/* Arrow to next */}
                {i < nodes.length - 1 && (
                  <div className="flex items-center mx-1">
                    <div className="w-6 h-px bg-[#333]" />
                    <span className="text-[#333] text-xs">→</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* NULL tail marker */}
        <div className="flex items-center ml-2">
          <span className="text-[#333] text-xs mr-1">→</span>
          <span className="text-xs font-mono text-[#555] px-2 py-1 border border-[#2a2a2a] rounded">NULL</span>
        </div>
      </div>
    </div>
  );
}
