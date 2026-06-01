/**
 * ProProjectView — /pro/:trackSlug/:moduleId/:topicId/project/:projectId
 *
 * Shows the project brief, requirements checklist, and Monaco editor.
 * Submission is self-assessed: the learner checks off which requirements
 * they met; XP is the sum of those requirements' weights.
 * No Judge0 — projects are open-ended, not auto-graded.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetProject, proSubmitProject, proToggleProjectBookmark, proListBookmarks } from "../../services/api";
import CodeEditor from "../../components/pro/CodeEditor";

const CORE_RE   = /^core_/;
const BONUS_RE  = /^bonus_/;

export default function ProProjectView() {
  const { trackSlug, moduleId, topicId, projectId } = useParams();
  const navigate = useNavigate();

  const [project,    setProject]    = useState(null);
  const [code,       setCode]       = useState("");
  const [checked,    setChecked]    = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bkBusy,     setBkBusy]     = useState(false);

  useEffect(() => {
    proGetProject(projectId)
      .then(r => {
        const p = r.data?.data;
        setProject(p);
        setCode(p?.starterCode || `public class Solution {\n    public static void main(String[] args) {\n        // Your solution here\n    }\n}`);
      })
      .catch(err => setError(err?.response?.data?.error || "Could not load project."));

    proListBookmarks().then(r => {
      const list = r.data?.data || [];
      setBookmarked(list.some(b => b.kind === "project" && b.refId === projectId));
    }).catch(() => {});
  }, [projectId]);

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!code.trim()) { setError("Write some code first."); return; }
    setError("");
    setSubmitting(true);
    try {
      const r = await proSubmitProject(projectId, code, [...checked]);
      setResult(r.data?.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    setBkBusy(true);
    try {
      const r = await proToggleProjectBookmark(projectId);
      setBookmarked(!!r.data?.data?.bookmarked);
    } catch {}
    finally { setBkBusy(false); }
  };

  if (error && !project) return (
    <div className="card p-8 text-center max-w-md mx-auto">
      <p className="text-[15px] font-semibold text-apple-red">{error}</p>
      <button onClick={() => navigate(-1)} className="btn-secondary text-[13px] mt-4">← Back</button>
    </div>
  );
  if (!project) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  const coreReqs  = (project.requirements || []).filter(r => CORE_RE.test(r.id));
  const bonusReqs = (project.requirements || []).filter(r => BONUS_RE.test(r.id));
  const otherReqs = (project.requirements || []).filter(r => !CORE_RE.test(r.id) && !BONUS_RE.test(r.id));

  const earnableXp   = (project.requirements || []).filter(r => checked.has(r.id)).reduce((s, r) => s + (r.weight || 0), 0);
  const totalXp      = (project.requirements || []).reduce((s, r) => s + (r.weight || 0), 0);

  return (
    <div className="grid lg:grid-cols-2 gap-5 max-w-7xl">
      {/* ── Left: brief + requirements ── */}
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
          ← Back
        </button>

        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple">
            Project · {Math.round((project.difficulty ?? 0.3) * 10) / 10 >= 0.7 ? "hard" : project.difficulty >= 0.4 ? "medium" : "easy"} · ~{project.estimatedMinutes ?? 30} min
          </span>
          <div className="flex items-start justify-between gap-3 mt-2">
            <h1 className="text-[24px] font-bold tracking-tight text-[var(--label)]">{project.name}</h1>
            <button onClick={handleBookmark} disabled={bkBusy}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-apple-gray6 transition-colors disabled:opacity-50">
              <svg viewBox="0 0 16 16" fill={bookmarked ? "currentColor" : "none"}
                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                   className={`w-5 h-5 ${bookmarked ? "text-apple-blue" : "text-apple-gray"}`}>
                <path d="M4.5 1.5h7a1 1 0 011 1v12l-4.5-2.8-4.5 2.8v-12a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>
        </div>

        {project.scenario && (
          <div className="card p-4 border-l-4 border-apple-purple">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1.5">Scenario</p>
            <p className="text-[14px] text-[var(--label)] leading-relaxed">{project.scenario}</p>
          </div>
        )}

        {project.description && (
          <div className="card p-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1.5">What to build</p>
            <p className="text-[14px] text-[var(--label)] leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* Requirements */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Requirements</p>
            <p className="text-[11px] text-apple-gray font-semibold">
              {earnableXp} / {totalXp} XP selected
            </p>
          </div>

          {[["Core", coreReqs], ["Bonus", bonusReqs], ["Other", otherReqs]].map(([label, reqs]) =>
            reqs.length > 0 ? (
              <div key={label} className="space-y-1.5">
                <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray3">{label}</p>
                {reqs.map(req => (
                  <label key={req.id}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                      checked.has(req.id) ? "bg-apple-green/8 border border-apple-green/30" : "hover:bg-[var(--fill)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked.has(req.id)}
                      onChange={() => toggle(req.id)}
                      disabled={!!result}
                      className="mt-0.5 accent-apple-green shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[var(--label)] leading-snug">{req.description}</p>
                    </div>
                    <span className="text-[11px] font-bold text-apple-gray shrink-0">{req.weight} XP</span>
                  </label>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* ── Right: editor + submit ── */}
      <div className="space-y-4">
        <div className="card overflow-hidden">
          <div className="px-4 py-2 border-b border-apple-gray5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-apple-gray">Your solution</span>
            <span className="text-[10px] text-apple-gray3">Java · not sandboxed</span>
          </div>
          <CodeEditor value={code} onChange={setCode} language="java" height="480px" />
        </div>

        {error && (
          <div className="card p-3 border-l-4 border-apple-red">
            <p className="text-[12px] text-apple-red font-medium">{error}</p>
          </div>
        )}

        {!result ? (
          <div className="space-y-2">
            <p className="text-[11px] text-apple-gray">
              Check off the requirements you completed, then submit. XP is awarded immediately.
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting || checked.size === 0}
              className="btn-primary w-full text-[14px] font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting…" : `Submit project (+${earnableXp} XP) →`}
            </button>
          </div>
        ) : (
          <div className="card p-5 border-l-4 border-apple-green space-y-2">
            <p className="text-[16px] font-bold text-apple-green">✓ Project submitted</p>
            <p className="text-[13px] text-[var(--label)]">
              +{result.xpAwarded} XP earned · {result.checkedCount}/{result.totalReqs} requirements met
            </p>
            <button onClick={() => navigate(-1)} className="btn-secondary text-[12px] mt-2">
              ← Back to topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
