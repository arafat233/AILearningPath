/**
 * JVMMemoryVisualizer — stack vs heap regions with reference arrows.
 *
 * Built for D1.1 (log2base2 parity — Java memory model). Shows the
 * "this primitive lives on the stack, this object lives on the heap"
 * insight, with arrows from stack variables to heap objects.
 *
 * Props:
 *   {
 *     stackFrames: [{ name, vars: [{name, type, value, heapId?, state?}] }],
 *     heap: { [heapId]: { type, fields?: {...}, value?, state? } },
 *     highlight?: { stackKey?: string, heapId?: string },
 *   }
 */
import { motion, AnimatePresence } from "framer-motion";

const STACK_VAR_STYLE = {
  default:   "bg-zinc-800 border-zinc-700 text-zinc-200",
  active:    "bg-amber-500/15 border-amber-500 text-amber-200",
  "just-set": "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
};

const HEAP_OBJ_STYLE = {
  default:   "border-purple-500/40 bg-purple-500/5",
  active:    "border-amber-500 bg-amber-500/10",
  "just-set": "border-[#00c896] bg-[#00c896]/10",
};

export default function JVMMemoryVisualizer({
  stackFrames = [],
  heap = {},
  highlight = null,
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* STACK */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono mb-2">STACK (frames grow downward)</div>
          <div className="space-y-2">
            <AnimatePresence>
              {stackFrames.length === 0 ? (
                <div className="text-zinc-600 italic text-[12px]">empty</div>
              ) : stackFrames.map((frame, fi) => (
                <motion.div
                  key={frame.name + fi}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded border border-blue-500/30 bg-blue-500/5 px-2 py-1.5"
                >
                  <div className="text-[10px] font-mono text-blue-300 mb-1">{frame.name}</div>
                  <div className="space-y-1">
                    {frame.vars.length === 0 ? (
                      <div className="text-[11px] text-zinc-600 italic">no locals</div>
                    ) : frame.vars.map((v) => {
                      const stackKey = `${frame.name}.${v.name}`;
                      const isHighlight = highlight?.stackKey === stackKey;
                      const isRef = v.type !== undefined && v.heapId != null;
                      return (
                        <div
                          key={v.name}
                          data-stack-key={stackKey}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-mono ${STACK_VAR_STYLE[isHighlight ? "active" : (v.state || "default")] || STACK_VAR_STYLE.default}`}
                        >
                          {v.type && <span className="text-[10px] text-zinc-500 shrink-0">{v.type}</span>}
                          <span className="font-bold">{v.name}</span>
                          <span className="text-zinc-500">=</span>
                          {isRef ? (
                            <span className="flex items-center gap-1 text-purple-300">
                              <span>→</span>
                              <span className="text-[10px] px-1 rounded bg-purple-500/20 border border-purple-500/40">heap#{v.heapId}</span>
                            </span>
                          ) : (
                            <span>{formatValue(v.value)}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* HEAP */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-purple-400 font-mono mb-2">HEAP (objects, anywhere)</div>
          <div className="grid grid-cols-1 gap-2">
            <AnimatePresence>
              {Object.keys(heap).length === 0 ? (
                <div className="text-zinc-600 italic text-[12px]">empty</div>
              ) : Object.entries(heap).map(([id, obj]) => {
                const isHighlight = highlight?.heapId === id;
                const cls = HEAP_OBJ_STYLE[isHighlight ? "active" : (obj.state || "default")] || HEAP_OBJ_STYLE.default;
                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded border-2 px-3 py-2 ${cls}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300">heap#{id}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{obj.type}</span>
                    </div>
                    {obj.value !== undefined && (
                      <div className="text-[12px] font-mono text-zinc-200 mb-1">{formatValue(obj.value)}</div>
                    )}
                    {obj.fields && Object.keys(obj.fields).length > 0 && (
                      <div className="space-y-0.5">
                        {Object.entries(obj.fields).map(([k, v]) => (
                          <div key={k} className="text-[11px] font-mono">
                            <span className="text-zinc-500">{k}: </span>
                            <span className="text-zinc-200">{formatValue(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="mt-3 text-[10px] text-zinc-600 font-mono">primitives live on the stack · objects live on the heap · references on the stack point to heap addresses</div>
    </div>
  );
}

function formatValue(v) {
  if (v == null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (Array.isArray(v)) return `[${v.map(formatValue).join(", ")}]`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
