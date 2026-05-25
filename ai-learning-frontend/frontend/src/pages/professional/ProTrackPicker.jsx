/**
 * ProTrackPicker — /pro
 *
 * Lists every live pro track returned by GET /api/v1/pro/tracks. During the
 * pilot only one track ("pro_java") is live, but the page is laid out so
 * adding Python / C++ / JS later needs no UI change.
 *
 * Visual baseline matches Dashboard.jsx (per memory feedback_dashboard_ui_style):
 * same card radius, typography, spacing.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proListTracks, proEnroll } from "../../services/api";

export default function ProTrackPicker() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState(null);
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(null);

  useEffect(() => {
    proListTracks()
      .then((r) => setTracks(r.data?.data || []))
      .catch((err) => setError(err?.response?.data?.error || "Could not load tracks."));
  }, []);

  const handleOpen = async (track) => {
    if (track.enrolled) {
      navigate(`/pro/${track.slug}`);
      return;
    }
    setBusy(track.key);
    try {
      await proEnroll(track.key);
      navigate(`/pro/${track.slug}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not enroll.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93]">Professional tracks</p>
        <h1 className="text-[32px] font-bold tracking-tight text-[var(--label)] mt-1">Pick a learning track</h1>
        <p className="text-[14px] text-apple-gray mt-1.5 max-w-xl">
          Industrial-strength curriculum for first jobs, internships and interviews.
          Code runs in a sandboxed JVM — no setup on your machine.
        </p>
      </div>

      {error && (
        <div className="card p-4 border-l-4 border-apple-red">
          <p className="text-[13px] text-apple-red font-medium">{error}</p>
        </div>
      )}

      {tracks === null && (
        <div className="text-[13px] text-apple-gray">Loading tracks…</div>
      )}

      {tracks?.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-[15px] font-semibold text-[var(--label)]">No live tracks yet</p>
          <p className="text-[13px] text-apple-gray mt-1">Check back soon.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks?.map((t) => (
          <button
            key={t.key}
            onClick={() => handleOpen(t)}
            disabled={busy === t.key}
            className="card p-6 text-left hover:shadow-apple-md hover:border-apple-blue transition-all group disabled:opacity-60"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[18px] font-bold text-white"
                   style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
                {t.name?.[0] || "?"}
              </div>
              {t.enrolled && (
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green">
                  Enrolled
                </span>
              )}
            </div>
            <h3 className="text-[16px] font-bold text-[var(--label)] mb-1 group-hover:text-apple-blue transition-colors">
              {t.name}
            </h3>
            <p className="text-[12px] text-apple-gray line-clamp-2 min-h-[32px]">{t.description}</p>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-apple-gray font-medium">
              <span>{t.totalModules || 0} modules</span>
              <span>·</span>
              <span>{t.totalTopics || 0} topics</span>
              <span>·</span>
              <span>{t.totalExercises || 0} exercises</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
