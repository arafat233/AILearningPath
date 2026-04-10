import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NAV = [
  { to: "/",           label: "Dashboard",    end: true },
  { to: "/lessons",    label: "Learn" },
  { to: "/practice",   label: "Practice" },
  { to: "/analytics",  label: "Analytics" },
  { to: "/competition",label: "Competition" },
  { to: "/live",       label: "Live Room" },
  { to: "/planner",    label: "Study Planner" },
  { to: "/voice-tutor",label: "Voice Tutor" },
  { to: "/settings",   label: "Settings" },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <aside className="w-52 bg-white border-r border-surface-border flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-surface-border">
          <p className="text-sm font-semibold text-gray-900">AI Learning Coach</p>
          <p className="text-xs text-gray-400">CBSE Class 10</p>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `nav-link text-xs ${isActive ? "active" : ""}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-surface-border">
          <p className="text-xs font-medium text-gray-700 truncate">{user?.name}</p>
          <button onClick={() => { logout(); navigate("/login"); }}
            className="mt-1.5 text-xs text-red-500 hover:text-red-700">Sign out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-7"><Outlet /></main>
    </div>
  );
}
