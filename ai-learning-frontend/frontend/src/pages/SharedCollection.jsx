import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { bmGetSharedCollection } from "../services/api";

export default function SharedCollection() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bmGetSharedCollection(token)
      .then((r) => setData(r.data?.data || r.data))
      .catch((err) => setError(err.response?.data?.error || "Collection not found"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
      <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[#007AFF] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB] px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4 text-[26px]">🔗</div>
      <p className="text-[18px] font-semibold text-[#1C1C1E] mb-2">{error}</p>
      <p className="text-[13px] text-[#8E8E93] mb-6">This share link may have been revoked or never existed.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#007AFF] text-white text-[13px] font-semibold">Go to Stellar →</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/" className="text-[12px] text-[#8E8E93] hover:text-[#007AFF] transition-colors">← Back to Stellar</Link>

        <div className="mt-4 mb-8">
          <p className="text-[11px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase mb-2">Shared collection · by {data.ownerName}</p>
          <h1 className="text-[34px] font-bold text-[#1C1C1E] leading-tight" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
            {data.emoji} {data.name}
          </h1>
          <p className="text-[13px] text-[#8E8E93] mt-2">
            {data.questions.length} question{data.questions.length !== 1 ? "s" : ""} · {data.topics.length} topic{data.topics.length !== 1 ? "s" : ""}
          </p>
        </div>

        {data.topics.length > 0 && (
          <div className="mb-10">
            <p className="text-[11px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase mb-3">Topics</p>
            <div className="space-y-2">
              {data.topics.map((t) => (
                <div key={t.topicId} className="bg-white rounded-xl border border-[#f0f0f5] px-4 py-3 shadow-sm">
                  <p className="text-[14px] font-semibold text-[#1C1C1E]">{t.name}</p>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5">{t.subject} · <code className="text-[10px]">{t.topicId}</code></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.questions.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase mb-3">Questions</p>
            <div className="space-y-3">
              {data.questions.map((q) => (
                <div key={q._id} className="bg-white rounded-2xl border border-[#f0f0f5] p-5 shadow-sm">
                  <p className="text-[16px] font-semibold leading-snug text-[#1C1C1E] mb-2"
                    style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
                    {q.questionText}
                  </p>
                  {q.conceptTested && (
                    <p className="text-[12px] text-[#8E8E93] mb-2">{q.conceptTested}</p>
                  )}
                  <p className="text-[11px] text-[#C7C7CC]">{q.subject} · grade {q.grade}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-[#E5E5EA] text-center">
          <Link to="/register" className="px-6 py-3 rounded-xl bg-[#1C1C1E] text-white text-[13px] font-semibold hover:bg-[#3A3A3C] transition-colors">
            Build your own collection on Stellar →
          </Link>
        </div>
      </div>
    </div>
  );
}
