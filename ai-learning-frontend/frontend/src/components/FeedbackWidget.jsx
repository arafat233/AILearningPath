import { useState } from "react";
import { submitFeedback } from "../services/api";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
const COLORS = ["", "#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF"];

export default function FeedbackWidget({ context = "practice", onDismiss }) {
  const [score,     setScore]     = useState(0);
  const [comment,   setComment]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!score) return;
    setLoading(true);
    try {
      await submitFeedback({ score, comment, context });
      setSubmitted(true);
      setTimeout(() => onDismiss?.(), 1500);
    } catch {
      onDismiss?.();
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card p-5 text-center border border-apple-green/30 bg-apple-green/5">
        <p className="text-[15px] font-semibold text-apple-green">Thanks for your feedback! 🙌</p>
      </div>
    );
  }

  return (
    <div className="card p-5 border border-apple-blue/20 bg-apple-blue/4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[14px] font-semibold text-[var(--label)]">How's your experience so far?</p>
        <button
          onClick={onDismiss}
          className="text-apple-gray hover:text-[var(--label)] transition-colors text-[18px] leading-none -mt-0.5"
        >
          ×
        </button>
      </div>

      {/* Star rating */}
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setScore(n)}
            className="flex-1 py-2 rounded-apple-lg text-[13px] font-semibold transition-all border"
            style={{
              background:   score >= n ? COLORS[n] + "18" : "transparent",
              borderColor:  score === n ? COLORS[n] : "#E5E5EA",
              color:        score >= n ? COLORS[n] : "#8E8E93",
            }}
          >
            {n === 1 ? "😞" : n === 2 ? "😐" : n === 3 ? "🙂" : n === 4 ? "😊" : "🤩"}
          </button>
        ))}
      </div>
      {score > 0 && (
        <p className="text-[12px] font-medium mb-3" style={{ color: COLORS[score] }}>
          {LABELS[score]}
        </p>
      )}

      <textarea
        className="input w-full text-[13px] resize-none"
        rows={2}
        placeholder="Any comments? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          disabled={!score || loading}
          className="btn-primary flex-1 py-2 text-[13px]"
        >
          {loading ? "Sending…" : "Send feedback"}
        </button>
        <button onClick={onDismiss} className="btn-secondary px-4 py-2 text-[13px]">
          Skip
        </button>
      </div>
    </div>
  );
}
