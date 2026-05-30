import { useEffect, useState } from "react";
import { proGetLeaderboard } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export default function ProWhereYouStand({ trackKey, xp }) {
  const { user } = useAuthStore();
  const [userRank, setUserRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackKey || !user?.id) return;
    setLoading(true);
    proGetLeaderboard(trackKey, 1000) // Fetch enough to find percentile
      .then((r) => {
        const lb = r.data?.data || [];
        setTotalUsers(lb.length);
        const rank = lb.find((row) => row.userId === user.id);
        if (rank) {
          setUserRank(rank);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [trackKey, user?.id]);

  if (loading || !userRank) {
    return null;
  }

  const percentile = Math.round(((totalUsers - userRank.rank) / totalUsers) * 100);

  return (
    <div className="card p-4">
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">Where you stand</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[24px] font-bold text-[#7c3aed]">#{userRank.rank}</div>
          <p className="text-[11px] text-apple-gray mt-1">of {totalUsers} learners</p>
        </div>
        <div className="text-right">
          <div className="text-[24px] font-bold text-[#7c3aed]">{percentile}%</div>
          <p className="text-[11px] text-apple-gray mt-1">percentile</p>
        </div>
      </div>
    </div>
  );
}
