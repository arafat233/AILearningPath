/**
 * ProReview — /pro/review (ROADMAP F4/F5)
 *
 * Spaced-repetition review queue. Lists topics whose SM-2 interval has
 * elapsed (GET /v1/pro/review/due). Each topic offers a quick review:
 *   - If the topic has pattern_match exercises, run up to 3 of them via the
 *     existing PatternDrill (sandbox-free, instant grade), then rate.
 *   - Otherwise, self-rate directly (Got it / Rusty).
 * The rating drives SM-2 (POST /v1/pro/review/:topicId): "got_it" advances
 * the interval, "rusty" resets to 1 day.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proGetDueReviews, proListExercises, proRecordReview } from "../../services/api";
import PatternDrill from "../../components/pro/PatternDrill";

const TRACK = "pro_java";

export default function ProReview() {
  const navigate = useNavigate();
  const [due, setDue]         = useState(null);   // null = loading
  const [error, setError]     = useState("");
  const [drill, setDrill]     = useState(null);   // { topicId, name, exercises }
  const [rating, setRating]   = useState(null);   // { topicId, name, score, total }
  const [busy, setBusy]       = useState(false);
  const finishedRef = useRef({ finished: false, score: 0, total: 0 });

  const load = () => {
    setError("");
    proGetDueReviews(TRACK)
      .then((r) => setDue(r.data?.data || []))
      .catch((err) => setError(err?.response?.data?.error || "Could not load your review queue."));
  };
  useEffect(load, []);

  // Start a review: fetch the topic's pattern_match exercises; drill if any, else self-rate.
  const startReview = async (topic) => {
    setBusy(true);
    try {
      const r = await proListExercises(topic.topicId);
      const pm = (r.data?.data || []).filter((e) => e.type === "pattern_match").slice(0, 3);
      if (pm.length > 0) {
        finishedRef.current = { finished: false, score: 0, total: pm.length };
        setDrill({ topicId: topic.topicId, name: topic.name, exercises: pm });
      } else {
        setRating({ topicId: topic.topicId, name: topic.name, score: null, total: 0 });
      }
    } catch {
      // No exercises reachable — fall back to self-rate so the topic can still cycle.
      setRating({ topicId: topic.topicId, name: topic.name, score: null, total: 0 });
    } finally {
      setBusy(false);
    }
  };

  const closeDrill = () => {
    const d = drill;
    setDrill(null);
    const { finished, score, total } = finishedRef.current;
    // Only prompt for a rating if they actually completed the drill (not if
    // they bailed via the × button).
    if (finished && d) setRating({ topicId: d.topicId, name: d.name, score, total });
  };

  const submitRating = async (topicId, ratingValue) => {
    setBusy(true);
    try {
      await proRecordReview(topicId, TRACK, ratingValue);
      // Drop the reviewed topic from the queue.
      setDue((prev) => (prev || []).filter((t) => t.topicId !== topicId));
      setRating(null);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not record your review.");
      setRating(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate("/")} className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors">
        ← Back to dashboard
      </button>

      <div>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-apple-gray">Spaced repetition</p>
        <h1 className="text-[26px] font-bold text-[var(--label)] tracking-tight mt-1">Review queue</h1>
        <p className="text-[14px] text-[var(--label2)] mt-1">
          Topics resurface on a 1 → 3 → 7 → 14 → 30 → 90 day schedule. A quick
          review locks them into long-term memory.
        </p>
      </div>

      {error && (
        <div className="card p-4 border-l-4 border-apple-red">
          <p className="text-[13px] text-apple-red font-medium">{error}</p>
        </div>
      )}

      {/* Loading */}
      {due === null && !error && (
        <div className="card p-8 text-center text-[13px] text-apple-gray">Loading your review queue…</div>
      )}

      {/* Empty */}
      {due !== null && due.length === 0 && (
        <div className="card p-10 text-center space-y-2">
          <div className="text-[40px]">✅</div>
          <p className="text-[16px] font-bold text-[var(--label)]">Nothing due right now</p>
          <p className="text-[13px] text-apple-gray">
            Complete more topics and they'll show up here for review tomorrow.
          </p>
          <button onClick={() => navigate(`/pro/java`)} className="btn-secondary text-[13px] mt-2">
            Browse modules →
          </button>
        </div>
      )}

      {/* Due list */}
      {due !== null && due.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[13px] font-semibold text-[var(--label)]">
            {due.length} topic{due.length === 1 ? "" : "s"} due for review
          </p>
          {due.map((t) => (
            <div key={t.topicId} className="card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--label)] truncate">{t.name}</p>
                <p className="text-[11px] text-apple-gray mt-0.5">
                  {t.moduleId} · reviewed {t.reps} time{t.reps === 1 ? "" : "s"}
                  {t.overdueDays > 0 ? ` · ${t.overdueDays}d overdue` : " · due today"}
                </p>
              </div>
              {t.overdueDays > 7 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-apple-red/10 text-apple-red shrink-0">
                  overdue
                </span>
              )}
              <button
                onClick={() => startReview(t)}
                disabled={busy}
                className="btn-primary text-[13px] shrink-0 disabled:opacity-50"
              >
                Review now →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick-review drill (pattern_match) */}
      {drill && (
        <PatternDrill
          exercises={drill.exercises}
          title={`Review: ${drill.name}`}
          onComplete={({ score, total }) => { finishedRef.current = { finished: true, score, total }; }}
          onClose={closeDrill}
        />
      )}

      {/* Rating prompt */}
      {rating && (
        <RatingModal
          rating={rating}
          busy={busy}
          onRate={(val) => submitRating(rating.topicId, val)}
          onClose={() => setRating(null)}
        />
      )}
    </div>
  );
}

function RatingModal({ rating, busy, onRate, onClose }) {
  const hasScore = rating.score !== null;
  const suggestGotIt = hasScore && rating.total > 0 && rating.score * 2 >= rating.total;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg)] rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-[var(--label)]">How did that feel?</p>
          <button onClick={onClose} className="text-apple-gray hover:text-[var(--label)] text-[20px] leading-none">×</button>
        </div>

        <p className="text-[14px] text-[var(--label)]">
          <span className="font-semibold">{rating.name}</span>
          {hasScore && (
            <span className="text-apple-gray"> — you scored {rating.score}/{rating.total}</span>
          )}
        </p>

        <p className="text-[12px] text-apple-gray">
          {suggestGotIt
            ? "Looks solid. \"Got it\" pushes this further out; \"Rusty\" brings it back tomorrow."
            : "\"Rusty\" resets to a 1-day interval so it comes back soon. \"Got it\" advances it."}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onRate("rusty")}
            disabled={busy}
            className={`px-4 py-3 rounded-xl border-2 text-[14px] font-semibold transition-all disabled:opacity-50 ${
              !suggestGotIt ? "border-apple-orange bg-apple-orange/10 text-apple-orange" : "border-[#E5E5EA] text-[var(--label)] hover:border-apple-orange/40"
            }`}
          >
            😬 Rusty
          </button>
          <button
            onClick={() => onRate("got_it")}
            disabled={busy}
            className={`px-4 py-3 rounded-xl border-2 text-[14px] font-semibold transition-all disabled:opacity-50 ${
              suggestGotIt ? "border-apple-green bg-apple-green/10 text-apple-green" : "border-[#E5E5EA] text-[var(--label)] hover:border-apple-green/40"
            }`}
          >
            ✅ Got it
          </button>
        </div>
      </div>
    </div>
  );
}
