/**
 * CircularLLSandbox — traverse + insert-head for a circular singly-linked list.
 *
 * D2.2 from the log2base2 parity checklist. Distinct from regular LL because
 * the tail's next points back to head — no null terminator. Traversing stops
 * when curr === head (returned to start), not when curr == null.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import CircularLinkedListVisualizer from "../CircularLinkedListVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import {
  CLL_TRAVERSE_CODE, CLL_INSERT_HEAD_CODE,
  LINE_BY_PHASE_TRAVERSE, LINE_BY_PHASE_INSERT_HEAD,
  generateCLLTraverseSteps, generateCLLInsertHeadSteps,
} from "../algorithms/circularLinkedList.js";

const DEFAULT_VALUES = [10, 20, 30, 40];
const OPS = [
  { id: "traverse",    label: "Traverse with termination check", code: CLL_TRAVERSE_CODE,    lines: LINE_BY_PHASE_TRAVERSE },
  { id: "insert-head", label: "Insert at head (find tail, re-wire)", code: CLL_INSERT_HEAD_CODE, lines: LINE_BY_PHASE_INSERT_HEAD },
];

function buildFrames(opId, values, insertVal) {
  return opId === "traverse"
    ? generateCLLTraverseSteps(values)
    : generateCLLInsertHeadSteps(values, insertVal ?? 99);
}

export default function CircularLLSandbox() {
  const [opId, setOpId]               = useState("traverse");
  const [valuesInput, setValuesInput] = useState(DEFAULT_VALUES.join(", "));
  const [insertVal, setInsertRef]     = useState("99");
  const [speed, setSpeed]             = useState(700);
  const [frames, setFrames]         = useState(() => generateCLLTraverseSteps(DEFAULT_VALUES));
  const [idx, setIdx]               = useState(0);
  const [playing, setPlaying]       = useState(false);
  const stoppedRef = useRef(false);

  const op    = OPS.find((o) => o.id === opId) || OPS[0];
  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const vals = valuesInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    if (vals.length === 0) return;
    setFrames(buildFrames(opId, vals, Number(insertVal) || 99));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [opId, valuesInput, insertVal]);

  useEffect(() => { rebuild(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [opId]);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    stoppedRef.current = false;
    for (let i = idx; i < frames.length; i++) {
      if (stoppedRef.current) break;
      setIdx(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, speed));
    }
    setPlaying(false);
  }, [playing, idx, frames, speed]);

  const stop  = () => { stoppedRef.current = true; setPlaying(false); };
  const step  = () => { if (idx < frames.length - 1) setIdx(idx + 1); };
  const back  = () => { if (idx > 0) setIdx(idx - 1); };
  const reset = () => { stoppedRef.current = true; setPlaying(false); setIdx(0); };

  const activeLine = op.lines[frame.phase] ?? 1;

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={opId} onChange={(e) => setOpId(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
          {OPS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        <label className="text-xs text-zinc-400">values</label>
        <input value={valuesInput} onChange={(e) => setValuesInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-44" />

        {opId === "insert-head" && (
          <>
            <label className="text-xs text-zinc-400">value</label>
            <input value={insertVal} onChange={(e) => setInsertRef(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-20" />
          </>
        )}

        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>

        <div className="w-px h-6 bg-zinc-700" />

        {!playing
          ? <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
          : <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>}
        <button onClick={back}  disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}  disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                       className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset</button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={150} max={1500} step={50} value={1500 - speed + 150} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <CircularLinkedListVisualizer nodes={frame.nodes} currentIdx={frame.currentIdx ?? -1} />
        <HighlightedCode code={op.code} activeLine={activeLine} height="340px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
