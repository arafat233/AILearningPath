import { useEffect, useState } from "react";

const BADGE_ICONS = {
  streak_7:           "🔥",
  streak_30:          "🔥",
  streak_100:         "🏅",
  first_perfect_exam: "💯",
  questions_100:      "💪",
  questions_500:      "🏆",
  top10_leaderboard:  "⭐",
};
const defaultIcon = (type) => type.startsWith("concept_master") ? "🎓" : "🏅";

const BADGE_LABELS = {
  streak_7:           "7-Day Streak!",
  streak_30:          "30-Day Streak!",
  streak_100:         "100-Day Streak!",
  first_perfect_exam: "Perfect Exam!",
  questions_100:      "100 Questions!",
  questions_500:      "500 Questions!",
  top10_leaderboard:  "Top 10 This Week!",
};
const labelFor = (type) =>
  BADGE_LABELS[type] || (type.startsWith("concept_master_") ? `Concept Master: ${type.replace("concept_master_", "")}!` : type);

export default function BadgeToast({ badges = [], onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!badges.length) return;
    const t = setTimeout(() => { setVisible(false); onDone?.(); }, 4000);
    return () => clearTimeout(t);
  }, [badges]);

  if (!visible || !badges.length) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
      {badges.map((b, i) => (
        <div
          key={b}
          className="flex items-center gap-3 bg-white border border-apple-yellow/30 shadow-apple
                     px-4 py-3 rounded-apple-xl animate-slide-in"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <span className="text-2xl">{BADGE_ICONS[b] || defaultIcon(b)}</span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--label)]">Achievement Unlocked!</p>
            <p className="text-[12px] text-apple-gray">{labelFor(b)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
