/**
 * ProExerciseRunner — /pro/exercise/:exerciseId
 *
 * Pilot version uses a plain <textarea> for code. Monaco editor will
 * replace it in a follow-up (PRO_TRACK_PLAN.md §10 Phase 6 — kept out of
 * this commit to avoid the ~2MB Monaco bundle on every page load until
 * we lazy-load it properly).
 *
 * Flow:
 *   1. Fetch exercise via /pro/exercises/:id (NO expectedSolution / testCases
 *      leaked — server strips them).
 *   2. Pre-fill the textarea with starterCode.
 *   3. POST /pro/exercises/:id/submit on "Run". Backend runs against Judge0
 *      and grades the testCases server-side.
 *   4. Show the sandbox stdout/stderr + per-test pass/fail.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetExercise, proSubmitExercise } from "../../services/api";
import CodeEditor from "../../components/pro/CodeEditor";
import FillBlankEditor from "../../components/pro/FillBlankEditor";

export default function ProExerciseRunner() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [ex, setEx] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(0); // 0 = none, 1..N = which hint

  useEffect(() => {
    proGetExercise(exerciseId)
      .then((r) => {
        const e = r.data?.data;
        setEx(e);
        setCode(e?.starterCode || "");
      })
      .catch((err) => setError(err?.response?.data?.error || "Could not load exercise."));
  }, [exerciseId]);

  const handleSubmit = async () => {
    if (!code || !code.trim()) {
      setError(ex?.type === "predict_output" ? "Type your predicted output first." : "Write some code first.");
      return;
    }
    if (ex?.type === "fill_blank" && code.includes("______")) {
      const remaining = (code.match(/______/g) || []).length;
      setError(`Fill in ${remaining} more blank${remaining === 1 ? "" : "s"} before submitting.`);
      return;
    }
    setError("");
    setRunning(true);
    setResult(null);
    try {
      const r = await proSubmitExercise(exerciseId, code);
      setResult(r.data?.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Submission failed.");
    } finally {
      setRunning(false);
    }
  };

  if (error && !ex) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-[15px] font-semibold text-apple-red">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary text-[13px] mt-4">← Back</button>
      </div>
    );
  }
  if (!ex) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  const passedCount = result?.testResults?.filter((t) => t.passed).length || 0;
  const totalCount  = result?.testResults?.length || 0;

  return (
    <div className="grid lg:grid-cols-2 gap-5 max-w-7xl">
      {/* ── Left: instructions ── */}
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
          ← Back
        </button>

        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray">
            {ex.level} · {ex.type}
          </span>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--label)] mt-2">{ex.title}</h1>
        </div>

        {ex.scenario && (
          <div className="card p-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1.5">Scenario</p>
            <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{ex.scenario}</p>
          </div>
        )}
        {ex.instructions && (
          <div className="card p-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1.5">Instructions</p>
            <p className="text-[14px] text-[var(--label)] leading-relaxed whitespace-pre-wrap">{ex.instructions}</p>
          </div>
        )}

        {Array.isArray(ex.hints) && ex.hints.length > 0 && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Hints</p>
              <button
                onClick={() => setShowHint((n) => Math.min(n + 1, ex.hints.length))}
                disabled={showHint >= ex.hints.length}
                className="text-[11px] text-apple-blue font-semibold hover:opacity-70 disabled:opacity-30"
              >
                Show next hint ({showHint}/{ex.hints.length})
              </button>
            </div>
            {showHint === 0
              ? <p className="text-[12px] text-apple-gray italic">Try the exercise yourself first; reveal hints if you get stuck.</p>
              : (
                <ol className="space-y-1.5 list-decimal pl-5">
                  {ex.hints.slice(0, showHint).map((h, i) => (
                    <li key={i} className="text-[13px] text-[var(--label)]">{h}</li>
                  ))}
                </ol>
              )}
          </div>
        )}
      </div>

      {/* ── Right: editor + result ── */}
      <div className="space-y-4">
        <div className="card overflow-hidden">
          <div className="px-4 py-2 border-b border-apple-gray5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-apple-gray">
              {ex.type === "predict_output"
                ? "Predicted output"
                : ex.type === "fill_blank"
                  ? "Fill in the blanks"
                  : "Your solution"}
            </span>
            <span className="text-[10px] text-apple-gray3">
              {ex.type === "predict_output"
                ? "Plain text · matched literally"
                : ex.type === "fill_blank"
                  ? "Fill the inline blanks · Java sandboxed"
                  : "Java · sandboxed"}
            </span>
          </div>
          {ex.type === "predict_output" ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={"Type the exact output you expect from running the code above.\n\nInclude every character — spaces, line breaks, punctuation.\nDo NOT add a trailing blank line unless the program prints one."}
              spellCheck={false}
              className="w-full h-[420px] p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] leading-[1.6] resize-none outline-none whitespace-pre"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}
            />
          ) : ex.type === "fill_blank" ? (
            <FillBlankEditor
              skeleton={ex.starterCode || ""}
              blanks={ex.blanks || []}
              onChange={setCode}
              height="420px"
            />
          ) : (
            <CodeEditor value={code} onChange={setCode} language="java" height="420px" />
          )}
        </div>

        {error && (
          <div className="card p-3 border-l-4 border-apple-red">
            <p className="text-[12px] text-apple-red font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={running}
          className="btn-primary w-full text-[14px] font-semibold disabled:opacity-50"
        >
          {running
            ? (ex.type === "predict_output" ? "Checking…" : "Running in sandbox…")
            : (ex.type === "predict_output" ? "Submit answer →" : "Run & submit →")}
        </button>

        {result && (
          <div className="space-y-3">
            <div className={`card p-4 border-l-4 ${result.passed ? "border-apple-green" : "border-apple-red"}`}>
              <div className="flex items-baseline justify-between">
                <p className={`text-[15px] font-bold ${result.passed ? "text-apple-green" : "text-apple-red"}`}>
                  {result.passed ? "✓ Passed" : "✗ Not yet"}
                </p>
                <p className="text-[12px] text-apple-gray">
                  {passedCount} / {totalCount} tests passed
                </p>
              </div>
              {result.xpAwarded > 0 && (
                <p className="text-[12px] text-apple-green mt-1">+{result.xpAwarded} XP</p>
              )}
            </div>

            {result.testResults?.length > 0 && (
              <div className="card p-4 space-y-2">
                <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1">Test cases</p>
                {result.testResults.map((t) => (
                  <div key={t.caseId} className="flex items-start gap-2 text-[13px]">
                    <span className={t.passed ? "text-apple-green" : "text-apple-red"}>{t.passed ? "✓" : "✗"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--label)] font-medium">{t.caseId}</p>
                      {t.message && <p className="text-[11px] text-apple-gray mt-0.5 line-clamp-2">{t.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(result.sandboxResult?.stdout || result.sandboxResult?.stderr) && (
              <div className="card p-4">
                <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1.5">Sandbox output</p>
                {result.sandboxResult.stdout && (
                  <div className="mb-2">
                    <p className="text-[10px] font-bold text-apple-gray mb-1">stdout</p>
                    <pre className="text-[12px] bg-[var(--fill)] rounded p-2 overflow-x-auto whitespace-pre-wrap">{result.sandboxResult.stdout}</pre>
                  </div>
                )}
                {result.sandboxResult.stderr && (
                  <div>
                    <p className="text-[10px] font-bold text-apple-red mb-1">stderr</p>
                    <pre className="text-[12px] bg-apple-red/8 rounded p-2 overflow-x-auto whitespace-pre-wrap text-apple-red">{result.sandboxResult.stderr}</pre>
                  </div>
                )}
                <p className="text-[10px] text-apple-gray3 mt-2">
                  {result.sandboxResult.status} · {result.sandboxResult.timeMs ?? "—"} ms · {result.sandboxResult.memoryKb ?? "—"} KB
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
