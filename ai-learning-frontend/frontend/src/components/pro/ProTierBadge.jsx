export function getTierMeta(xp) {
  if (xp >= 15000) return { label: "Expert", color: "#dc2626", icon: "👑" };
  if (xp >= 5001) return { label: "Advanced", color: "#ea580c", icon: "⭐" };
  if (xp >= 1001) return { label: "Intermediate", color: "#2563eb", icon: "🚀" };
  return { label: "Beginner", color: "#16a34a", icon: "🌱" };
}

export default function ProTierBadge({ xp = 0 }) {
  const tier = getTierMeta(xp);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
      style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
    >
      <span>{tier.icon}</span>
      <span>{tier.label}</span>
    </div>
  );
}
