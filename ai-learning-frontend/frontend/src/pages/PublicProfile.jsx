import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { profileGetPublic } from "../services/api";

const BADGE_ICON = {
  streak_7: "🔥", streak_30: "🔥", streak_100: "🏅",
  first_perfect_exam: "💯", questions_100: "🤿", questions_500: "🏆",
  top10_leaderboard: "⭐", concept_master_any: "🎓",
};
function getInitials(n = "") { return n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?"; }

export default function PublicProfile() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileGetPublic(slug).then((r) => setData(r.data?.data || r.data))
      .catch((err) => setError(err.response?.data?.error || "Profile not found or private"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
      <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[#007AFF] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB] px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4 text-[26px]">👤</div>
      <p className="text-[18px] font-semibold text-[#1C1C1E] mb-2">{error}</p>
      <p className="text-[13px] text-[#8E8E93] mb-6">This profile may be set to private or never existed.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#007AFF] text-white text-[13px] font-semibold">Go to Stellar →</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/" className="text-[12px] text-[#8E8E93] hover:text-[#007AFF]">← Back to Stellar</Link>

        <div className="mt-6 mb-8 flex items-start gap-5">
          <div className="rounded-full bg-[#1c1c1e] flex items-center justify-center shrink-0 overflow-hidden" style={{ width: 96, height: 96 }}>
            {data.avatarDataUrl ? <img src={data.avatarDataUrl} alt={data.name} className="w-full h-full object-cover" /> :
              <span className="text-white font-bold text-[36px]">{getInitials(data.name)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[34px] font-bold text-[#1C1C1E] leading-tight" style={{ fontFamily: "Georgia,serif", fontStyle: "italic" }}>
              {data.name}
            </h1>
            <p className="text-[13px] text-[#8E8E93] mt-1">Class {data.grade} · {data.subject} · {data.thinkingProfile || "Learner"}</p>
            {data.manifesto && (
              <p className="text-[14px] italic text-[#3A3A3C] mt-3 max-w-md">"{data.manifesto}"</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5] text-center">
            <p className="text-[28px] font-bold text-[#7c3aed]">L{data.level}</p>
            <p className="text-[10px] text-[#8E8E93] tracking-wider uppercase mt-1">Level</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5] text-center">
            <p className="text-[28px] font-bold text-[#34C759]">{data.accuracy}%</p>
            <p className="text-[10px] text-[#8E8E93] tracking-wider uppercase mt-1">Accuracy</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5] text-center">
            <p className="text-[28px] font-bold text-[#007AFF]">{data.totalAttempts.toLocaleString()}</p>
            <p className="text-[10px] text-[#8E8E93] tracking-wider uppercase mt-1">Questions</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5] text-center">
            <p className="text-[28px] font-bold text-[#FF9500]">{data.badgeCount}</p>
            <p className="text-[10px] text-[#8E8E93] tracking-wider uppercase mt-1">Badges</p>
          </div>
        </div>

        {/* Badges */}
        {data.badges?.length > 0 && (
          <div className="mb-8">
            <p className="text-[11px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase mb-3">Achievements</p>
            <div className="flex flex-wrap gap-3">
              {data.badges.map((b, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-[#f0f0f5] flex flex-col items-center gap-1 w-24">
                  <div className="w-10 h-10 rounded-full bg-[#FF9500]/10 flex items-center justify-center text-[20px]">{BADGE_ICON[b.type] || "🏅"}</div>
                  <p className="text-[10px] text-[#8E8E93] text-center leading-tight">{b.type.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-[#E5E5EA] text-center">
          <Link to="/register" className="px-6 py-3 rounded-xl bg-[#1C1C1E] text-white text-[13px] font-semibold hover:bg-[#3A3A3C] transition-colors">
            Build your own profile on Stellar →
          </Link>
        </div>
      </div>
    </div>
  );
}
