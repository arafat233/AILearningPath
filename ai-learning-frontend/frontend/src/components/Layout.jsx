import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NAV = [
  { to: "/",            label: "Dashboard",    icon: "⊞",  end: true },
  { to: "/lessons",     label: "Learn",        icon: "📖" },
  { to: "/practice",    label: "Practice",     icon: "✏️" },
  { to: "/analytics",   label: "Analytics",    icon: "📊" },
  { to: "/competition", label: "Competition",  icon: "🏆" },
  { to: "/live",        label: "Live Room",    icon: "🎙" },
  { to: "/planner",     label: "Study Planner",icon: "📅" },
  { to: "/voice-tutor", label: "Voice Tutor",  icon: "🎧" },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div className="flex h-screen overflow-hidden bg-apple-gray6">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0 bg-white/80 backdrop-blur-apple border-r border-apple-gray5">
        {/* App header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg bg-apple-blue flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-[13px] font-semibold text-[var(--label)]">AI Learning</span>
          </div>
          <p className="text-[11px] text-apple-gray ml-9">CBSE · Class 10</p>
        </div>

        <div className="divider mx-4 mb-3" />

        {/* Navigation */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          <p className="section-label px-2 mb-2">Menu</p>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="w-4 text-center text-sm leading-none">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="divider mx-4 mb-3" />

        {/* Settings link */}
        <div className="px-3 mb-2">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="w-4 text-center text-sm leading-none">⚙️</span>
            Settings
          </NavLink>
        </div>

        {/* User footer */}
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[var(--label)] truncate">{user?.name}</p>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="btn-destructive text-[11px]"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
