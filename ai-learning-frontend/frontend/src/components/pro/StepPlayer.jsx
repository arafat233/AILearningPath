/**
 * StepPlayer — exercise-level step-by-step algorithm animation (DSA Animator
 * parity, Track-2). Renders deterministic, hand-authored step data attached to a
 * ProExercise as `animation` (see config/seedAnimation*.js).
 *
 * Shared shell (header + note + play/step/scrub controls) with a per-`kind`
 * stage. Built one pattern at a time:
 *   - "array-pointers" — array row + named pointers (L/R, slow/fast…) + window
 *   - "stack"          — input row + cursor, a stack row, an optional output row
 *   (next kinds: "grid", "tree")
 */
import { useEffect, useRef, useState } from "react";

const PALETTE = ["#0a84ff", "#30d158", "#ff9f0a", "#bf5af2", "#ff375f"];
const NAMED = { L: "#0a84ff", R: "#bf5af2", lo: "#0a84ff", hi: "#bf5af2", mid: "#ff9f0a", slow: "#0a84ff", fast: "#30d158", write: "#30d158", i: "#0a84ff", j: "#30d158", k: "#ff9f0a" };
const colorFor = (name, k) => NAMED[name] || PALETTE[k % PALETTE.length];

function markStyle(m) {
  if (m === "match") return { background: "rgba(48,209,88,0.18)", borderColor: "#30d158" };
  if (m === "kept") return { background: "rgba(10,132,255,0.12)", borderColor: "rgba(10,132,255,0.4)" };
  if (m === "dropped") return { opacity: 0.35, textDecoration: "line-through" };
  return {};
}

// A single value cell (shared by stages).
function Cell({ value, sub, highlight, style }) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
      <div
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[14px] font-semibold border transition-all duration-300 text-[var(--label)]"
        style={{
          borderColor: highlight ? "rgba(10,132,255,0.45)" : "var(--separator, #d2d2d7)",
          background: highlight ? "rgba(10,132,255,0.06)" : "transparent",
          ...style,
        }}
      >
        {value}
      </div>
      {sub !== undefined && <span className="text-[9px] text-apple-gray3 mt-0.5">{sub}</span>}
    </div>
  );
}

// ── kind: array-pointers ──────────────────────────────────────────────────────
function ArrayPointersStage({ animation, step }) {
  const arr = step.array || animation.array || [];
  const ptrs = step.pointers || {};
  const byIndex = {};
  Object.entries(ptrs).forEach(([name, idx], k) => { (byIndex[idx] ||= []).push({ name, color: colorFor(name, k) }); });
  const win = step.window;
  const inWindow = (idx) => Array.isArray(win) && idx >= win[0] && idx <= win[1];

  return (
    <div className="flex gap-1.5 flex-wrap justify-center py-1">
      {arr.map((v, idx) => (
        <div key={idx} className="flex flex-col items-center" style={{ minWidth: 32 }}>
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[14px] font-semibold border transition-all duration-300 text-[var(--label)]"
            style={{
              borderColor: inWindow(idx) ? "rgba(10,132,255,0.45)" : "var(--separator, #d2d2d7)",
              background: inWindow(idx) ? "rgba(10,132,255,0.06)" : "transparent",
              ...markStyle(step.mark?.[idx]),
            }}
          >
            {v}
          </div>
          <span className="text-[9px] text-apple-gray3 mt-0.5">{idx}</span>
          <div className="h-4 flex gap-0.5 mt-0.5 items-center">
            {(byIndex[idx] || []).map(({ name, color }) => (
              <span key={name} className="text-[9px] font-bold px-1 rounded leading-tight" style={{ color, border: `1px solid ${color}` }}>{name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── kind: stack ───────────────────────────────────────────────────────────────
const stackVal = (e) => (e && typeof e === "object" ? e.v : e);
const stackSub = (e) => (e && typeof e === "object" ? e.i : undefined);

function StackStage({ animation, step }) {
  const input = animation.array || [];
  const stack = step.stack || [];
  const output = step.output;
  const outLabel = animation.outLabel || "answer";
  return (
    <div className="space-y-3 py-1">
      {input.length > 0 && (
        <div>
          <p className="text-[9px] uppercase tracking-wider text-apple-gray3 mb-1 text-center">input</p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {input.map((v, idx) => (
              <Cell key={idx} value={v} sub={idx} highlight={idx === step.cursor}
                style={idx === step.cursor ? { borderColor: "#0a84ff", background: "rgba(10,132,255,0.10)" } : {}} />
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-[9px] uppercase tracking-wider text-apple-gray3 mb-1 text-center">stack (bottom → top)</p>
        <div className="flex gap-1.5 justify-center items-end min-h-[44px]">
          {stack.length === 0
            ? <span className="text-[12px] text-apple-gray3 italic">empty</span>
            : stack.map((e, k) => (
                <Cell key={k} value={stackVal(e)} sub={stackSub(e)} highlight={k === stack.length - 1}
                  style={k === stack.length - 1 ? { borderColor: "#bf5af2", background: "rgba(191,90,242,0.10)" } : {}} />
              ))}
        </div>
      </div>
      {Array.isArray(output) && (
        <div>
          <p className="text-[9px] uppercase tracking-wider text-apple-gray3 mb-1 text-center">{outLabel}</p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {output.map((v, idx) => (
              <Cell key={idx} value={v === null || v === undefined ? "·" : v} sub={idx}
                style={v === null || v === undefined ? { color: "var(--separator,#d2d2d7)" } : { background: "rgba(48,209,88,0.12)", borderColor: "rgba(48,209,88,0.4)" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── kind: grid ────────────────────────────────────────────────────────────────
const CLS_COLORS = {
  visited:  { background: "rgba(10,132,255,0.16)", borderColor: "rgba(10,132,255,0.45)" },
  frontier: { background: "rgba(255,159,10,0.22)", borderColor: "rgba(255,159,10,0.5)" },
  source:   { background: "rgba(191,90,242,0.20)", borderColor: "rgba(191,90,242,0.5)" },
  path:     { background: "rgba(48,209,88,0.18)", borderColor: "rgba(48,209,88,0.5)" },
  wall:     { background: "rgba(120,120,128,0.28)", borderColor: "rgba(120,120,128,0.4)" },
};

function GridStage({ animation, step }) {
  const grid = step.grid || animation.grid || [];
  const cls = step.cls || {};
  const palette = animation.palette || {};
  const cur = step.cursor; // [r, c]
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      {grid.map((row, r) => (
        <div key={r} className="flex gap-1">
          {row.map((val, c) => {
            const isCur = Array.isArray(cur) && cur[0] === r && cur[1] === c;
            const base = cls[`${r},${c}`] ? CLS_COLORS[cls[`${r},${c}`]] : (palette[String(val)] ? { background: palette[String(val)] } : {});
            return (
              <div key={c}
                className="w-9 h-9 flex items-center justify-center rounded-md text-[13px] font-semibold transition-all duration-300 text-[var(--label)]"
                style={{
                  border: `${isCur ? 2 : 1}px solid ${isCur ? "#0a84ff" : "var(--separator,#d2d2d7)"}`,
                  ...base,
                }}>
                {String(val)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── kind: linked-list ─────────────────────────────────────────────────────────
function LLRow({ list, links = [], pointers = {}, mark = {} }) {
  const byIndex = {};
  Object.entries(pointers).forEach(([name, idx], k) => { if (idx !== null && idx >= 0) (byIndex[idx] ||= []).push({ name, color: colorFor(name, k) }); });
  return (
    <div className="flex items-start justify-center flex-wrap gap-0 py-1">
      {list.map((val, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center" style={{ minWidth: 38 }}>
            <div className="w-10 h-9 flex items-center justify-center rounded-lg text-[13px] font-semibold border transition-all duration-300 text-[var(--label)]"
              style={{ borderColor: "var(--separator,#d2d2d7)", ...markStyle(mark[idx]) }}>{val}</div>
            <div className="h-4 flex gap-0.5 mt-0.5 items-center">
              {(byIndex[idx] || []).map(({ name, color }) => (
                <span key={name} className="text-[9px] font-bold px-1 rounded leading-tight" style={{ color, border: `1px solid ${color}` }}>{name}</span>
              ))}
            </div>
          </div>
          {idx < list.length - 1
            ? <span className="text-apple-gray text-[16px] px-0.5 self-start mt-2" style={{ color: links[idx] === "←" ? "#ff375f" : undefined }}>{links[idx] === "←" ? "←" : links[idx] === "↺" ? "↺" : "→"}</span>
            : <span className="text-apple-gray3 text-[10px] px-1 self-start mt-3">{links[idx] === "↺" ? "↺ cycle" : "→ ∅"}</span>}
        </div>
      ))}
    </div>
  );
}
function LinkedListStage({ animation, step }) {
  return (
    <div className="space-y-2 py-1">
      <LLRow list={step.list || animation.list || []} links={step.links} pointers={step.pointers} mark={step.mark} />
      {(step.list2 || animation.list2) && (
        <LLRow list={step.list2 || animation.list2} links={step.links2} pointers={step.pointers2} mark={step.mark2} />
      )}
    </div>
  );
}

// ── kind: tree ────────────────────────────────────────────────────────────────
const TREE_CLS = {
  current: ["rgba(10,132,255,0.18)", "#0a84ff"],
  visited: ["rgba(48,209,88,0.18)", "#30d158"],
  path: ["rgba(255,159,10,0.22)", "#ff9f0a"],
  match: ["rgba(191,90,242,0.2)", "#bf5af2"],
  dropped: ["rgba(255,55,95,0.15)", "#ff375f"],
};
function TreeStage({ animation, step }) {
  const nodes = step.nodes || animation.nodes || [];
  const edges = step.edges || animation.edges || [];
  const W = animation.W || 380, H = animation.H || 200;
  const cls = step.cls || {};
  const pos = {}; nodes.forEach((n) => { pos[n.id] = n; });
  return (
    <div className="flex flex-col items-center py-1">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }} fill="currentColor">
        {edges.map(([a, b], i) => { const p = pos[a], q = pos[b]; return p && q ? <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="var(--separator,#d2d2d7)" /> : null; })}
        {nodes.map((n) => { const c = TREE_CLS[cls[n.id]]; return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="15" fill={c ? c[0] : "transparent"} stroke={c ? c[1] : "var(--separator,#d2d2d7)"} strokeWidth={c ? 2 : 1} style={{ transition: "all .3s" }} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" className="text-[var(--label)]">{n.v}</text>
          </g>); })}
      </svg>
      {Array.isArray(step.output) && (
        <div className="flex gap-1.5 flex-wrap justify-center items-center mt-1">
          <span className="text-[9px] uppercase tracking-wider text-apple-gray3 mr-1">{animation.outLabel || "visit"}</span>
          {step.output.map((v, i) => (
            <div key={i} className="w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-semibold border text-[var(--label)]" style={{ background: "rgba(48,209,88,0.12)", borderColor: "rgba(48,209,88,0.4)" }}>{v}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const STAGES = { "array-pointers": ArrayPointersStage, stack: StackStage, grid: GridStage, "linked-list": LinkedListStage, tree: TreeStage };

export default function StepPlayer({ animation }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);
  const steps = animation?.steps || [];
  const n = steps.length;

  useEffect(() => {
    if (!playing) return undefined;
    if (i >= n - 1) { setPlaying(false); return undefined; }
    timer.current = setTimeout(() => setI((x) => Math.min(x + 1, n - 1)), 1150);
    return () => clearTimeout(timer.current);
  }, [playing, i, n]);

  const Stage = STAGES[animation?.kind];
  if (!animation || !Stage || n === 0) return null;
  const step = steps[i] || {};

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">
          Visualize{animation.label ? ` · ${animation.label}` : ""}
        </p>
        {animation.meta && (
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(animation.meta).map(([k, v]) => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray font-medium">{k}: {String(v)}</span>
            ))}
          </div>
        )}
      </div>

      <Stage animation={animation} step={step} />

      <div className="min-h-[44px] mt-2 text-center px-2">
        {step.note && <p className="text-[13px] text-[var(--label)] leading-snug whitespace-pre-wrap">{step.note}</p>}
        {step.caption && <p className="text-[12px] text-apple-gray mt-0.5 font-mono">{step.caption}</p>}
        {step.result && <p className="text-[13px] font-semibold mt-1" style={{ color: "#30d158" }}>→ {step.result}</p>}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button onClick={() => { setPlaying(false); setI(0); }} title="Restart"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-apple-gray6 text-apple-gray text-[15px]">↺</button>
        <button onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)); }} disabled={i === 0} title="Previous step"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-apple-gray6 disabled:opacity-30 text-apple-gray text-[18px]">‹</button>
        <button onClick={() => { if (i >= n - 1) setI(0); setPlaying((p) => !p); }} title={playing ? "Pause" : "Play"}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-apple-blue text-white hover:opacity-90 text-[13px]">{playing ? "❚❚" : "▶"}</button>
        <button onClick={() => { setPlaying(false); setI((x) => Math.min(n - 1, x + 1)); }} disabled={i === n - 1} title="Next step"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-apple-gray6 disabled:opacity-30 text-apple-gray text-[18px]">›</button>
        <input type="range" min="0" max={n - 1} value={i} onChange={(e) => { setPlaying(false); setI(Number(e.target.value)); }}
          className="flex-1 accent-apple-blue" aria-label="Step" />
        <span className="text-[11px] text-apple-gray font-mono shrink-0">{i + 1}/{n}</span>
      </div>
    </div>
  );
}
