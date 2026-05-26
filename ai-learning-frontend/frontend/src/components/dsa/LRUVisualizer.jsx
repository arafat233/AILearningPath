/**
 * LRUVisualizer — paired HashMap + Doubly-Linked List view.
 *
 * Built for M34-T5. Renders the map keys as a column on the left with
 * arrows pointing to nodes in the horizontal DLL on the right. The
 * "head" (most-recent) and "tail" (LRU) labels make eviction direction
 * obvious.
 *
 * Props:
 *   { capacity, order: [{key, value, state}], mapKeys: (string|number)[],
 *     evicted?: {key, value}|null }
 */
import { motion, AnimatePresence } from "framer-motion";

const NODE_STYLE = {
  default: "bg-[#1a1a1a] border-[#2a2a2a] text-[#ccc]",
  compare: "bg-amber-500/15 border-amber-500 text-amber-300",
};

export default function LRUVisualizer({
  capacity = 0,
  order = [],
  mapKeys = [],
  evicted = null,
}) {
  return (
    <div className="w-full p-5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
      <div className="flex gap-6">
        {/* Map side */}
        <div className="shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">HashMap (keys)</div>
          <div className="flex flex-col gap-1 min-h-[160px]">
            <AnimatePresence>
              {mapKeys.length === 0 ? (
                <div className="text-[#444] italic text-[12px]">empty</div>
              ) : mapKeys.map((k) => (
                <motion.div
                  key={`m-${k}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-12 px-2 py-1 rounded border border-zinc-700 bg-zinc-800 text-[12px] font-mono text-zinc-200 text-center">{k}</div>
                  <span className="text-[#555] text-xs">→</span>
                  <span className="text-[#666] text-[11px] font-mono italic">node</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-3 text-[10px] text-zinc-500 font-mono">size = {order.length} / {capacity}</div>
        </div>

        {/* DLL side */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">Doubly-Linked List · head (MRU) → tail (LRU)</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 min-h-[80px]">
            <div className="text-[10px] text-blue-400 font-bold font-mono mr-2 shrink-0">head ↓</div>
            <AnimatePresence mode="popLayout">
              {order.length === 0 ? (
                <div className="text-[#444] italic text-[12px]">empty</div>
              ) : order.map((e, i) => (
                <motion.div
                  key={`n-${e.key}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, x: 60 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center"
                >
                  <div className={`flex items-center px-2.5 py-1.5 border-2 rounded-lg text-[12px] font-mono ${NODE_STYLE[e.state] || NODE_STYLE.default}`}>
                    <span className="font-bold">{e.key}</span>
                    <span className="text-[#666] mx-1.5">:</span>
                    <span>{typeof e.value === "string" ? `"${e.value}"` : String(e.value)}</span>
                  </div>
                  {i < order.length - 1 && <span className="text-[#444] text-xs mx-1">⇄</span>}
                </motion.div>
              ))}
            </AnimatePresence>
            {order.length > 0 && <div className="text-[10px] text-red-400 font-bold font-mono ml-2 shrink-0">↑ tail</div>}
          </div>
        </div>
      </div>

      {evicted && (
        <div className="mt-3 inline-block px-3 py-1.5 rounded border border-red-500/40 bg-red-500/10 text-[11px] font-mono text-red-300">
          evicted: {evicted.key} : {typeof evicted.value === "string" ? `"${evicted.value}"` : String(evicted.value)}
        </div>
      )}
    </div>
  );
}
