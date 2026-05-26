/**
 * ArrayPointersSandbox — two-pointer technique demo.
 *
 * Used by M30-T1 (Two Pointers — O(n) Pair Problems). Demo: 2-sum on a
 * sorted array — left starts at 0, right at n-1; sum < target → L++,
 * sum > target → R--, sum === target → found.
 *
 * Step generator is local — different shape than binary search (no mid
 * pointer, different decision rule), so a small inline generator is
 * cleaner than overloading binarySearch.js.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";

const TWO_POINTERS_CODE = `int[] twoSumSorted(int[] arr, int target) {
  int L = 0, R = arr.length - 1;
  while (L < R) {
    int sum = arr[L] + arr[R];
    if (sum == target) return new int[]{L, R};
    if (sum < target)  L++;       // need bigger → move L right
    else               R--;       // need smaller → move R left
  }
  return new int[]{-1, -1};       // no pair found
}`;

function generateTwoSumSteps(arr, target) {
  const sorted = [...arr].sort((a, b) => a - b);
  const frames = [];

  const cells = (Larg, Rarg, state) =>
    sorted.map((v, i) => {
      if (i === Larg || i === Rarg) return { value: v, state };
      return { value: v, state: "default" };
    });

  frames.push({
    cells: cells(-1, -1, "default"),
    pointers: { L: 0, R: sorted.length - 1 },
    step: {
      description: `Two-pointer 2-sum for target = ${target}.`,
      detail: "Array must be sorted. L starts at 0, R at n-1.",
    },
  });

  let L = 0;
  let R = sorted.length - 1;
  while (L < R) {
    const sum = sorted[L] + sorted[R];
    frames.push({
      cells: cells(L, R, "compare"),
      pointers: { L, R },
      step: {
        description: `arr[${L}] + arr[${R}] = ${sorted[L]} + ${sorted[R]} = ${sum}`,
        detail: sum === target ? "Match!" : sum < target ? `${sum} < ${target} → need bigger, L++` : `${sum} > ${target} → need smaller, R--`,
      },
    });
    if (sum === target) {
      frames.push({
        cells: cells(L, R, "found"),
        pointers: { L, R },
        step: { description: `Found pair at indices [${L}, ${R}].`, detail: `Returns [${L}, ${R}]. Total ${frames.length} steps.` },
      });
      return frames;
    }
    if (sum < target) L++;
    else              R--;
  }
  frames.push({
    cells: sorted.map((v) => ({ value: v, state: "not-found" })),
    pointers: {},
    step: { description: `No pair sums to ${target}.`, detail: "L crossed R, search exhausted. Returns [-1, -1]." },
  });
  return frames;
}

const DEFAULT_ARRAY  = [1, 4, 6, 8, 11, 15, 20, 25, 30];
const DEFAULT_TARGET = 19;

export default function ArrayPointersSandbox() {
  const [arrayInput, setArrayInput]   = useState(DEFAULT_ARRAY.join(", "));
  const [targetInput, setTargetInput] = useState(String(DEFAULT_TARGET));
  const [speed, setSpeed]             = useState(700);
  const [frames, setFrames]           = useState(() => generateTwoSumSteps(DEFAULT_ARRAY, DEFAULT_TARGET));
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
    if (arr.length < 2 || !Number.isFinite(tgt)) return;
    setFrames(generateTwoSumSteps(arr, tgt));
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
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{TWO_POINTERS_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
