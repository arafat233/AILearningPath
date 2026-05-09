import { useState, useEffect } from "react";
import { getAIUsage } from "../services/api";

/**
 * Shows a user's daily AI credit budget.
 * Pass `usage` prop to skip an extra API fetch (e.g. Dashboard already has it).
 * compact=true → pill style (for tight spaces like header rows)
 * compact=false → full bar style (for card footers)
 */
export default function AICreditsIndicator({ usage: usageProp, compact = false }) {
  const [usage, setUsage] = useState(usageProp ?? null);

  useEffect(() => {
    if (usageProp !== undefined) { setUsage(usageProp); return; }
    getAIUsage().then((r) => setUsage(r.data)).catch(() => {});
  }, [usageProp]);

  if (!usage) return null;

  const { used = 0, limit = 10, remaining = 0 } = usage;
  const pct     = limit > 0 ? (used / limit) * 100 : 100;
  const accent  = pct >= 90 ? "#FF3B30" : pct >= 65 ? "#FF9500" : "#34C759";
  const isEmpty = remaining === 0;
  const label   = isEmpty ? "Limit reached" : `${remaining} left`;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#f0f0f5] bg-white shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
        <span className="text-[11px] font-medium text-[#3a3a3c]">
          {isEmpty ? "AI limit reached" : `${remaining}/${limit} AI credits`}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#f0f0f5]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8e8e93]">Daily AI Credits</span>
        <span className="text-[12px] font-semibold" style={{ color: accent }}>{label}</span>
      </div>
      <div className="h-1.5 bg-[#f0f0f5] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: accent }}
        />
      </div>
      <p className="text-[11px] text-[#8e8e93] mt-1">{used} of {limit} used today</p>
    </div>
  );
}
