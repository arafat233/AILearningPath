import { useEffect, useState } from "react";

export default function ProStreakStrip({ currentStreak, lastActivityAt }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const today = new Date();
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysArray = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const dayLabel = dayLabels[d.getDay()];

      daysArray.push({
        label: dayLabel,
        date: dateStr,
        isActive: false,
      });
    }

    // Mark activity days
    if (lastActivityAt) {
      const lastActivityDate = new Date(lastActivityAt).toISOString().slice(0, 10);
      const idx = daysArray.findIndex((d) => d.date === lastActivityDate);
      if (idx >= 0) {
        daysArray[idx].isActive = true;
      }

      // If streak > 0 and not today, yesterday is active
      const todayStr = today.toISOString().slice(0, 10);
      if (currentStreak > 0 && lastActivityDate !== todayStr) {
        const yestIdx = daysArray.findIndex((d) => d.date === new Date(Date.now() - 86400000).toISOString().slice(0, 10));
        if (yestIdx >= 0) {
          daysArray[yestIdx].isActive = true;
        }
      }
    }

    setDays(daysArray);
  }, [currentStreak, lastActivityAt]);

  return (
    <div className="flex gap-1.5">
      {days.map((d) => (
        <div key={d.date} className="flex flex-col items-center gap-1">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-semibold transition-colors ${
              d.isActive
                ? "bg-[#16a34a] text-white"
                : "bg-[#e5e5ea] text-[#8e8e93]"
            }`}
          >
            {d.isActive ? "✓" : ""}
          </div>
          <span className="text-[9px] text-apple-gray font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
