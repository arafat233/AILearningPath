/**
 * ComplexityPlot — Complexity Derivation System (ROADMAP D2–D4).
 *
 * Plots ACTUAL operation counts (from algorithms/complexity.js) vs n for a
 * focus algorithm, overlaid with faint reference curves (log n, n, n log n,
 * n²) each anchored to the actual curve's right endpoint so the matching
 * shape overlaps and the others visibly diverge. A "Guess the curve" mode
 * hides the theoretical label and asks the learner to pick the class first.
 *
 * Dark theme (zinc-950 / white) to match the other DSA sandboxes.
 *
 * Props:
 *   config.defaultAlgo  — initial focus algorithm key (default "bubble")
 *   config.algos        — optional subset of algorithm keys to offer in the
 *                         dropdown (default: all)
 */
import { useMemo, useState } from "react";
import { COMPLEXITY_ALGORITHMS, COMPLEXITY_ALGO_ORDER, REF_CURVES } from "./algorithms/complexity.js";

const PAD = { l: 56, r: 16, t: 16, b: 40 };
const W = 560, H = 340;
const SAMPLES = 28;     // points along the x-axis
const TRIALS = 5;       // averaged runs (smooths random-input jiggle)

// Average op count over a few trials so random-input curves don't jiggle.
function avgComparisons(algo, n) {
  if (n < 1) return 0;
  let sum = 0;
  for (let t = 0; t < TRIALS; t++) sum += algo.count(n).comparisons;
  return sum / TRIALS;
}

export default function ComplexityPlot({ config = {} }) {
  const algoKeys = config.algos?.length ? config.algos : COMPLEXITY_ALGO_ORDER;
  const [focusKey, setFocusKey] = useState(config.defaultAlgo && algoKeys.includes(config.defaultAlgo) ? config.defaultAlgo : algoKeys[0]);
  const [nMax, setNMax]         = useState(80);
  const [showRefs, setShowRefs] = useState(true);
  const [guessMode, setGuessMode] = useState(false);
  const [guess, setGuess]       = useState(null);     // ref curve key the user picked
  const [revealed, setRevealed] = useState(false);

  const algo = COMPLEXITY_ALGORITHMS[focusKey];

  // Sample the actual curve across n = 1..nMax.
  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i < SAMPLES; i++) {
      const n = Math.max(1, Math.round((nMax * (i + 1)) / SAMPLES));
      pts.push({ n, ops: avgComparisons(algo, n) });
    }
    return pts;
  }, [algo, nMax]);

  const maxOps   = Math.max(1, ...data.map((d) => d.ops));
  const endOps   = data[data.length - 1]?.ops || 1;

  // Scale helpers — n on x, ops on y (y grows downward in SVG so invert).
  const xOf = (n)   => PAD.l + (n / nMax) * (W - PAD.l - PAD.r);
  const yOf = (ops) => H - PAD.b - (ops / maxOps) * (H - PAD.t - PAD.b);

  const actualPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(d.n).toFixed(1)},${yOf(d.ops).toFixed(1)}`).join(" ");

  // Reference curves: each anchored so ref(nMax) == endOps (actual right edge).
  // The class that genuinely matches overlaps the actual curve everywhere.
  const refPaths = REF_CURVES.map((rc) => {
    const refEnd = rc.fn(nMax) || 1;
    const scale  = endOps / refEnd;
    const path = data.map((d, i) => {
      const y = yOf(rc.fn(d.n) * scale);
      return `${i === 0 ? "M" : "L"}${xOf(d.n).toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return { ...rc, path };
  });

  // Y-axis gridlines (4 ticks)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: yOf(maxOps * f),
    label: Math.round(maxOps * f).toLocaleString(),
  }));

  const correctRef = algo.curveClass;

  const startGuess = () => { setGuessMode(true); setGuess(null); setRevealed(false); };
  const submitGuess = () => { if (guess) setRevealed(true); };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-zinc-400 font-medium">Algorithm</label>
          <select
            value={focusKey}
            onChange={(e) => { setFocusKey(e.target.value); setRevealed(false); setGuess(null); }}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white focus:outline-none focus:border-zinc-500"
          >
            {algoKeys.map((k) => (
              <option key={k} value={k}>{COMPLEXITY_ALGORITHMS[k].label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <label className="text-[12px] text-zinc-400 font-medium whitespace-nowrap">n = {nMax}</label>
          <input
            type="range" min={8} max={200} step={2} value={nMax}
            onChange={(e) => setNMax(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
        </div>

        <button
          onClick={() => setShowRefs((s) => !s)}
          className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
            showRefs ? "bg-zinc-800 border-zinc-600 text-white" : "border-zinc-700 text-zinc-400 hover:text-white"
          }`}
        >
          {showRefs ? "Hide" : "Show"} reference curves
        </button>
      </div>

      {/* Plot */}
      <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
          {/* Y gridlines + labels */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={PAD.l - 8} y={t.y + 3} textAnchor="end" fontSize="9" fill="#71717a">{t.label}</text>
            </g>
          ))}
          {/* Axes */}
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#3f3f46" strokeWidth="1" />
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#3f3f46" strokeWidth="1" />
          {/* X labels */}
          <text x={PAD.l} y={H - PAD.b + 16} textAnchor="start" fontSize="9" fill="#71717a">1</text>
          <text x={W - PAD.r} y={H - PAD.b + 16} textAnchor="end" fontSize="9" fill="#71717a">{nMax}</text>
          <text x={(PAD.l + W - PAD.r) / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#a1a1aa">input size (n)</text>
          <text x={14} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" fontSize="10" fill="#a1a1aa"
            transform={`rotate(-90 14 ${(PAD.t + H - PAD.b) / 2})`}>operations</text>

          {/* Reference curves (faint, dashed). In guess mode hide labels until reveal. */}
          {showRefs && refPaths.map((rc) => {
            const isCorrect = rc.key === correctRef;
            const highlight = revealed && isCorrect;
            return (
              <path key={rc.key} d={rc.path} fill="none"
                stroke={highlight ? algo.color : "rgba(255,255,255,0.22)"}
                strokeWidth={highlight ? 2 : 1}
                strokeDasharray={rc.dash} />
            );
          })}

          {/* Actual measured curve */}
          <path d={actualPath} fill="none" stroke={algo.color} strokeWidth="2.5" />
          {data.map((d, i) => (i % 4 === 0 ? (
            <circle key={i} cx={xOf(d.n)} cy={yOf(d.ops)} r="2.5" fill={algo.color} />
          ) : null))}
        </svg>
      </div>

      {/* Legend + reference labels */}
      {showRefs && !guessMode && (
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 rounded" style={{ background: algo.color }} />
            <span className="text-zinc-200 font-medium">{algo.label} (measured)</span>
          </span>
          {REF_CURVES.map((rc) => (
            <span key={rc.key} className="flex items-center gap-1.5">
              <span className="w-4 h-0 border-t border-dashed border-zinc-500" />
              <span className={rc.key === correctRef ? "text-zinc-200 font-semibold" : "text-zinc-500"}>{rc.label}</span>
            </span>
          ))}
        </div>
      )}

      {/* Guess-the-curve widget (D4) */}
      <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-3">
        {!guessMode ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-white">Which complexity class does {algo.label} match?</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Test your eye before peeking at the theoretical answer.</p>
            </div>
            <button onClick={startGuess}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0">
              Guess the curve →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-white">
              {revealed ? "Result" : `Which curve does ${algo.label} follow?`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REF_CURVES.map((rc) => {
                const picked  = guess === rc.key;
                const isRight = rc.key === correctRef;
                let cls = "border-zinc-700 text-zinc-300 hover:border-zinc-500";
                if (revealed) {
                  if (isRight) cls = "border-green-500 bg-green-500/10 text-green-400";
                  else if (picked) cls = "border-red-500 bg-red-500/10 text-red-400";
                  else cls = "border-zinc-800 text-zinc-500";
                } else if (picked) {
                  cls = "border-blue-500 bg-blue-500/10 text-blue-400";
                }
                return (
                  <button key={rc.key} disabled={revealed}
                    onClick={() => setGuess(rc.key)}
                    className={`px-3 py-2 rounded-lg border-2 text-[13px] font-medium transition-colors ${cls}`}>
                    {rc.label}
                  </button>
                );
              })}
            </div>
            {!revealed ? (
              <div className="flex gap-2">
                <button onClick={submitGuess} disabled={!guess}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors">
                  Check
                </button>
                <button onClick={() => setGuessMode(false)}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] text-zinc-300">
                  {guess === correctRef ? "✓ Correct — " : "✗ Not quite — "}
                  <span className="text-white font-semibold">{algo.label}</span> is{" "}
                  <span className="font-semibold" style={{ color: algo.color }}>{algo.theoretical}</span>.
                  The matching reference curve is now highlighted on the plot.
                </p>
                <button onClick={() => { setGuessMode(false); }}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-600 text-white hover:bg-zinc-700 transition-colors shrink-0">
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Insight strip */}
      <p className="text-[12px] text-zinc-400 leading-relaxed">
        At n = {nMax}, {algo.label} does <span className="text-white font-semibold tabular-nums">{Math.round(endOps).toLocaleString()}</span> comparisons.
        {" "}Drag n to watch the curve grow — an {algo.theoretical} algorithm grows far steeper than O(n log n) as n climbs.
      </p>
    </div>
  );
}
