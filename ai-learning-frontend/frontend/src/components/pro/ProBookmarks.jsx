/**
 * ProBookmarks — "/bookmarks" view for pro_* learners.
 *
 * Polymorphic list: groups saved items by kind (exercise / topic / project).
 * Each group has its own card list with kind-appropriate metadata + link.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proListBookmarks, proToggleExerciseBookmark, proToggleTopicBookmark } from "../../services/api";

const LEVEL_STYLE = {
  warmup: { bg: "bg-apple-blue/10",   text: "text-apple-blue",   label: "Warmup" },
  easy:   { bg: "bg-apple-green/10",  text: "text-apple-green",  label: "Easy"   },
  medium: { bg: "bg-apple-orange/10", text: "text-apple-orange", label: "Medium" },
  hard:   { bg: "bg-apple-red/10",    text: "text-apple-red",    label: "Hard"   },
};

// Mapping from refId → slug for the URL path. Pro IDs follow
// "<lang>_m<n>_t<n>_ex_<n>" — the first segment before "_" is the language slug.
function trackSlugFromRef(refId, fallback = "java") {
  if (typeof refId !== "string") return fallback;
  const seg = refId.split("_")[0];
  return seg || fallback;
}

function ExerciseRow({ r, onRemove, navigate }) {
  const lvl = LEVEL_STYLE[r.level] || { bg: "bg-[var(--fill)]", text: "text-apple-gray", label: r.level || "—" };
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${lvl.bg} ${lvl.text}`}>
            {lvl.label}
          </span>
          {r.xpReward > 0 && <span className="text-[10px] text-apple-gray font-semibold">+{r.xpReward} XP</span>}
        </div>
        <h3 className="text-[14px] font-bold text-[var(--label)] truncate">{r.title}</h3>
        <p className="text-[11px] text-apple-gray mt-0.5 truncate">{r.moduleId} · {r.topicId}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate(`/pro/exercise/${r.refId}`)}
          className="btn-primary text-[12px] px-3 py-1.5"
        >
          Re-run
        </button>
        <button
          onClick={() => onRemove(r)}
          className="text-apple-gray hover:text-apple-red transition-colors text-[12px] px-2"
          aria-label="Remove bookmark"
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function TopicRow({ r, onRemove, navigate }) {
  const slug = trackSlugFromRef(r.refId);
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple">
            Topic
          </span>
        </div>
        <h3 className="text-[14px] font-bold text-[var(--label)] truncate">{r.title}</h3>
        <p className="text-[11px] text-apple-gray mt-0.5 truncate">{r.moduleId}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate(`/pro/${slug}/${r.moduleId}/${r.refId}`)}
          className="btn-primary text-[12px] px-3 py-1.5"
        >
          Open
        </button>
        <button
          onClick={() => onRemove(r)}
          className="text-apple-gray hover:text-apple-red transition-colors text-[12px] px-2"
          aria-label="Remove bookmark"
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function ProjectRow({ r }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-apple-orange/10 text-apple-orange">
            Project
          </span>
        </div>
        <h3 className="text-[14px] font-bold text-[var(--label)] truncate">{r.title}</h3>
        <p className="text-[11px] text-apple-gray mt-0.5 truncate">{r.moduleId} · {r.topicId}</p>
      </div>
      <span className="text-[11px] text-apple-gray shrink-0">Project view coming soon</span>
    </div>
  );
}

export default function ProBookmarks({ trackKey = "pro_java" }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await proListBookmarks(trackKey);
      setRows(r.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || "Couldn't load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [trackKey]);

  const handleRemove = async (r) => {
    try {
      if (r.kind === "exercise") await proToggleExerciseBookmark(r.refId);
      else if (r.kind === "topic") await proToggleTopicBookmark(r.refId);
      else return; // project removal will exist once the route ships
      setRows((rs) => rs.filter((x) => !(x.kind === r.kind && x.refId === r.refId)));
    } catch {}
  };

  const exercises = rows.filter((r) => r.kind === "exercise");
  const topics    = rows.filter((r) => r.kind === "topic");
  const projects  = rows.filter((r) => r.kind === "project");

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-apple-gray">Bookmarks</p>
        <h1 className="text-[24px] font-bold text-[var(--label)] tracking-tight mt-1">Saved items</h1>
        <p className="text-[13px] text-[var(--label2)] mt-1">
          Tap the bookmark icon on any topic or exercise to save it here for later.
        </p>
      </header>

      {error && (
        <div className="card p-4 border border-apple-red/20 bg-apple-red/5">
          <p className="text-[13px] text-apple-red">{error}</p>
        </div>
      )}

      {loading && (
        <div className="card p-6 text-center">
          <p className="text-[13px] text-apple-gray">Loading…</p>
        </div>
      )}

      {!loading && rows.length === 0 && !error && (
        <div className="card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-apple-blue">
              <path d="M4.5 1.5h7a1 1 0 011 1v12l-4.5-2.8-4.5 2.8v-12a1 1 0 011-1z"/>
            </svg>
          </div>
          <h2 className="text-[15px] font-bold text-[var(--label)] mb-1">Nothing saved yet</h2>
          <p className="text-[12px] text-apple-gray max-w-sm mx-auto leading-relaxed">
            Open any topic or exercise from your track and tap the bookmark icon to add it here.
          </p>
          <button onClick={() => navigate("/pro")} className="btn-primary text-[13px] mt-5">
            Browse pro tracks →
          </button>
        </div>
      )}

      {!loading && exercises.length > 0 && (
        <section>
          <h2 className="text-[14px] font-bold text-[var(--label)] mb-2">Saved exercises ({exercises.length})</h2>
          <div className="space-y-2">
            {exercises.map((r) => <ExerciseRow key={r.refId} r={r} onRemove={handleRemove} navigate={navigate} />)}
          </div>
        </section>
      )}

      {!loading && topics.length > 0 && (
        <section>
          <h2 className="text-[14px] font-bold text-[var(--label)] mb-2">Saved topics ({topics.length})</h2>
          <div className="space-y-2">
            {topics.map((r) => <TopicRow key={r.refId} r={r} onRemove={handleRemove} navigate={navigate} />)}
          </div>
        </section>
      )}

      {!loading && projects.length > 0 && (
        <section>
          <h2 className="text-[14px] font-bold text-[var(--label)] mb-2">Saved projects ({projects.length})</h2>
          <div className="space-y-2">
            {projects.map((r) => <ProjectRow key={r.refId} r={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
