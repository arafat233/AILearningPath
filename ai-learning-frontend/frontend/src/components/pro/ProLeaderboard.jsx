import { useEffect, useState } from "react";
import { proGetLeaderboard } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export default function ProLeaderboard({ trackKey, limit = 20, compact = false }) {
  const { user } = useAuthStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    if (!trackKey) return;
    setLoading(true);
    setError("");
    proGetLeaderboard(trackKey, limit)
      .then((r) => {
        const lb = r.data?.data || [];
        setData(lb);
        // Find user's rank
        const rank = lb.find((row) => row.userId === user?.id);
        if (rank) {
          setUserRank(rank);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.error || "Could not load leaderboard");
      })
      .finally(() => setLoading(false));
  }, [trackKey, limit, user?.id]);

  if (error) {
    return <div className="text-[13px] text-apple-red p-4">{error}</div>;
  }

  if (loading) {
    return <div className="text-[13px] text-apple-gray p-4">Loading leaderboard…</div>;
  }

  if (data.length === 0) {
    return <div className="text-[13px] text-apple-gray p-4">No participants yet</div>;
  }

  return (
    <div className="space-y-3">
      {/* Leaderboard table */}
      <div className="space-y-2">
        {data.map((row) => {
          const isCurrentUser = row.userId === user?.id;
          return (
            <div
              key={row.userId}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isCurrentUser
                  ? "bg-[#7c3aed]/10 border border-[#7c3aed]/30"
                  : "bg-[#f5f5f7] hover:bg-[#efefef]"
              }`}
            >
              {/* Rank badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                  row.rank === 1
                    ? "bg-[#fbbf24] text-[#78350f]"
                    : row.rank === 2
                      ? "bg-[#c0c0c0] text-[#374151]"
                      : row.rank === 3
                        ? "bg-[#f97316] text-[#ffffff]"
                        : "bg-[#e5e5ea] text-[#8e8e93]"
                }`}
              >
                {row.rank}
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {row.avatar ? (
                  <img
                    src={row.avatar}
                    alt={row.name}
                    className="w-6 h-6 rounded-full shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[10px] font-semibold text-[#7c3aed] shrink-0">
                    {row.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <span className={`text-[13px] font-semibold truncate ${isCurrentUser ? "text-[#7c3aed]" : "text-[var(--label)]"}`}>
                  {row.name}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[12px] font-bold text-[var(--label)]">{row.totalXp.toLocaleString()}</span>
                  <span className="text-[10px] text-apple-gray">XP</span>
                </div>
                {row.currentStreak > 0 && (
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] font-bold text-[#7c3aed]">🔥 {row.currentStreak}d</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* User's rank (if not in top N) */}
      {userRank && !data.find((row) => row.userId === user?.id) && (
        <div className="mt-4 pt-4 border-t border-[#e5e5ea]">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#7c3aed]/8 border border-[#7c3aed]/20">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold bg-[#7c3aed]/30 text-[#7c3aed]">
              {userRank.rank}
            </div>
            <div className="flex-1">
              <span className="text-[13px] font-semibold text-[#7c3aed]">Your Rank</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#7c3aed]">{userRank.totalXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
