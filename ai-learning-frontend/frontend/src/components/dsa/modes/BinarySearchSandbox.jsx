/**
 * BinarySearchSandbox — replays the frames from generateBinarySearchSteps().
 *
 * Used by M39-T1 (Binary Search Basics). Plays through L/R/mid pointer
 * movement so the learner watches the search space halve each iteration.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { BINARY_SEARCH_CODE, generateBinarySearchSteps } from "../algorithms/binarySearch.js";

const DEFAULT_ARRAY = [3, 8, 12, 17, 21, 26, 34, 42, 55, 67, 78, 89, 92, 95, 99];
const DEFAULT_TARGET = 42;

export default function BinarySearchSandbox() {
  const [arrayInput, setArrayInput]   = useState(DEFAULT_ARRAY.join(", "));
  const [targetInput, setTargetInput] = useState(String(DEFAULT_TARGET));
  const [speed, setSpeed]             = useState(600);
  const [frames, setFrames]           = useState(() => generateBinarySearchSteps(DEFAULT_ARRAY, DEFAULT_TARGET));
  const [idx, setIdx]                 = useState(0);
  const [playing, setPlaying]         = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const arr = arrayInput
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
    const tgt = Number(targetInput);
    if (arr.length === 0 || !Number.isFinite(tgt)) return;
    setFrames(generateBinarySearchSteps(arr, tgt));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [arrayInput, targetInput]);

  useEffect(() => { stoppedRef.current = false; }, [idx]);

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

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">array</label>
        <input
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-72"
        />
        <label className="text-xs text-zinc-400">target</label>
        <input
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-20"
        />
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>

        <div className="w-px h-6 bg-zinc-700" />

        {!playing ? (
          <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
        ) : (
          <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>
        )}
        <button onClick={back}   disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}   disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                        className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset</button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input
            type="range" min={150} max={1500} step={50}
            value={1500 - speed + 150}
            onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)}
            className="w-24 accent-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <ArrayVisualizer cells={frame.cells} pointers={frame.pointers} />
        <HighlightedCode code={BINARY_SEARCH_CODE} activeLine={frame.step.codeLine} height="340px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
