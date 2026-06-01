import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import ArrayBars from "../ArrayBars.jsx";
import Controls from "../Controls.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import StatsPanel from "../StatsPanel.jsx";
import DSACodeEditor from "../DSACodeEditor.jsx";
import { sortAlgorithms } from "../algorithms/registry.js";
import { generateRandomArray } from "../utils/generateArray.js";
import { runStudentCode, STUDENT_TEMPLATE } from "../runners/studentRunner.js";

// Lazy — the complexity plot + its op-counters only download when the
// learner expands the panel, keeping the sorting sandbox lean by default.
const ComplexityPlot = lazy(() => import("../ComplexityPlot.jsx"));
const SORT_ALGO_KEYS = ["bubble", "insertion", "selection", "merge", "quick"];

export default function SortingSandbox({ config = {} }) {
  const initialAlgoId = config?.defaultAlgo || "bubble";
  const initialSize   = config?.defaultSize || 16;

  const [selectedAlgoId, setSelectedAlgoId] = useState(initialAlgoId);
  const algo = sortAlgorithms.find((a) => a.id === selectedAlgoId) || sortAlgorithms[0];

  const [array, setArray]                 = useState([]);
  const [arraySize, setArraySize]         = useState(initialSize);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex]       = useState(undefined);

  const [isSorting, setIsSorting]   = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const stepsRef     = useRef([]);
  const stepIdxRef   = useRef(0);

  const [speed, setSpeed]                 = useState(200);
  const [currentCodeLine, setCurrentLine] = useState(-1);
  const [explanation, setExplanation]     = useState("");
  const [stats, setStats]                 = useState({ comparisons: 0, swaps: 0 });

  const [studentMode, setStudentMode]     = useState(false);
  const [studentCode, setStudentCode]     = useState(STUDENT_TEMPLATE);
  const [studentError, setStudentError]   = useState("");
  const [showComplexity, setShowComplexity] = useState(false);

  useEffect(() => {
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("");
    setStats({ comparisons: 0, swaps: 0 });
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  useEffect(() => {
    if (!isSorting) {
      setCurrentLine(-1);
      setExplanation("");
      setStats({ comparisons: 0, swaps: 0 });
    }
  }, [selectedAlgoId, isSorting]);

  const applyStep = useCallback((step) => {
    if (step.array) setArray(step.array);
    setActiveIndices(step.indices || []);
    setExplanation(step.explanation || "");
    setCurrentLine(step.codeLine);
    setStats({ comparisons: step.comparisons ?? 0, swaps: step.swaps ?? 0 });
    if (step.type === "pivot") {
      setPivotIndex((step.indices || [])[0]);
    } else {
      setPivotIndex(undefined);
    }
    if (step.type === "sorted") {
      setSortedIndices((prev) => Array.from(new Set([...prev, ...(step.indices || [])])));
    }
  }, []);

  const finishSorting = useCallback(() => {
    setIsSorting(false);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
  }, []);

  const handleGenerate = useCallback(() => {
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("");
    setStats({ comparisons: 0, swaps: 0 });
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleNextStep = useCallback(() => {
    if (!isSorting || !isStepMode) return;
    const step = stepsRef.current[stepIdxRef.current];
    if (!step) { setExplanation("Sorting complete!"); finishSorting(); return; }
    applyStep(step);
    stepIdxRef.current++;
  }, [isSorting, isStepMode, applyStep, finishSorting]);

  const handleStart = useCallback(async () => {
    const steps = algo.generate(array);
    stepsRef.current = steps;
    stepIdxRef.current = 0;
    setIsSorting(true);
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setStats({ comparisons: 0, swaps: 0 });
    isStoppedRef.current = false;
    isPausedRef.current  = false;
    if (isStepMode) return;
    for (const step of steps) {
      if (isStoppedRef.current) break;
      while (isPausedRef.current) { await new Promise((r) => setTimeout(r, 50)); } // eslint-disable-line no-await-in-loop
      if (isStoppedRef.current) break;
      applyStep(step);
      await new Promise((r) => setTimeout(r, speed)); // eslint-disable-line no-await-in-loop
    }
    if (!isStoppedRef.current) setExplanation("Sorting complete!");
    finishSorting();
  }, [algo, array, isStepMode, speed, applyStep, finishSorting]);

  const handlePause = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused((p) => !p);
  }, []);

  const handleStop = useCallback(() => {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(false);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("Stopped.");
  }, []);

  const handleAlgoChange = useCallback((id) => {
    if (isSorting) return;
    setSelectedAlgoId(id);
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("");
    setStats({ comparisons: 0, swaps: 0 });
    setStudentMode(false);
  }, [isSorting]);

  const handleRunStudentCode = useCallback(async () => {
    setStudentError("");
    const result = runStudentCode(studentCode, array);
    if ("error" in result) { setStudentError(result.error); return; }
    stepsRef.current = result.steps;
    stepIdxRef.current = 0;
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setStats({ comparisons: 0, swaps: 0 });
    setExplanation("Running student code…");
    setIsSorting(true);
    isStoppedRef.current = false;
    isPausedRef.current  = false;
    for (const step of result.steps) {
      if (isStoppedRef.current) break;
      while (isPausedRef.current) { await new Promise((r) => setTimeout(r, 50)); } // eslint-disable-line no-await-in-loop
      if (isStoppedRef.current) break;
      applyStep(step);
      await new Promise((r) => setTimeout(r, speed)); // eslint-disable-line no-await-in-loop
    }
    if (!isStoppedRef.current) setExplanation("Done! Check if the array is sorted.");
    finishSorting();
  }, [studentCode, array, speed, applyStep, finishSorting]);

  const handleToggleStudentMode = useCallback(() => {
    if (isSorting) return;
    setStudentMode((m) => !m);
    setStudentError("");
    setCurrentLine(-1);
    setExplanation("");
  }, [isSorting]);

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <Controls
        isSorting={isSorting} isPaused={isPaused} isStepMode={isStepMode}
        arraySize={arraySize} speed={speed} selectedAlgoId={selectedAlgoId}
        algoOptions={sortAlgorithms.map((a) => ({ id: a.id, name: a.name }))}
        onAlgoChange={handleAlgoChange} onSizeChange={setArraySize} onSpeedChange={setSpeed}
        onGenerate={handleGenerate} onStart={handleStart} onPause={handlePause}
        onStop={handleStop} onNextStep={handleNextStep}
        onToggleStepMode={() => !isSorting && setIsStepMode((m) => !m)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <ArrayBars array={array} activeIndices={activeIndices} sortedIndices={sortedIndices} pivotIndex={pivotIndex} />
        <div className="h-[340px]">
          <DSACodeEditor
            code={algo.code} currentLine={currentCodeLine}
            studentMode={studentMode} studentCode={studentCode}
            onStudentCodeChange={setStudentCode} onRunStudentCode={handleRunStudentCode}
            studentError={studentError} onToggleStudentMode={handleToggleStudentMode}
          />
        </div>
      </div>
      <ExplanationPanel text={explanation} />
      <StatsPanel comparisons={stats.comparisons} swaps={stats.swaps}
        timeComplexity={algo.timeComplexity} spaceComplexity={algo.spaceComplexity}
        description={algo.description} />

      {/* Complexity Derivation panel — collapsed by default; the op-counters
          + SVG plot only download when expanded. */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <button
          onClick={() => setShowComplexity((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left"
        >
          <span className="text-[13px] font-semibold text-white">
            📈 Complexity plot — see why this is {algo.timeComplexity?.worst || ""}
          </span>
          <span className="text-zinc-400 text-[13px]">{showComplexity ? "Hide ▲" : "Show ▼"}</span>
        </button>
        {showComplexity && (
          <Suspense fallback={
            <div className="p-6 text-center text-[13px] text-zinc-400">Loading complexity plot…</div>
          }>
            <ComplexityPlot config={{ defaultAlgo: selectedAlgoId, algos: SORT_ALGO_KEYS }} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
