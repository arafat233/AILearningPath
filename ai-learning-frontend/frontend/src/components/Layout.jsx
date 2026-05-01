import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { logoutApi } from "../services/api";
import SearchOverlay from "./SearchOverlay";

function Icon({ id }) {
  const paths = {
    dashboard:   <><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></>,
    lessons:     <><path d="M3 2h9a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M8 2v12M5 6h3M5 9h3"/></>,
    practice:    <><path d="M11 3l2 2L5 13H3v-2L11 3z"/><path d="M9 5l2 2"/></>,
    analytics:   <><path d="M3 13V9M7 13V5M11 13V2M13 13V7"/><path d="M1 13h14"/></>,
    competition: <><path d="M5 2h6l-1 5H6L5 2z"/><path d="M3 2v2.5c0 1.5 1 2.5 2.5 2.5M13 2v2.5c0 1.5-1 2.5-2.5 2.5"/><path d="M8 7v4M5.5 11h5"/></>,
    live:        <><rect x="5.5" y="1.5" width="5" height="7" rx="2.5"/><path d="M3.5 8a4.5 4.5 0 009 0M8 12.5v2M5.5 14.5h5"/></>,
    bookmarks:   <><path d="M4 2h8a1 1 0 011 1v11l-5-3-5 3V3a1 1 0 011-1z"/></>,
    planner:     <><rect x="2" y="3.5" width="12" height="11" rx="1.5"/><path d="M2 7.5h12M5.5 2v3M10.5 2v3"/></>,
    voiceTutor:  <><path d="M3 8.5a5 5 0 0010 0"/><rect x="1.5" y="8" width="3" height="4.5" rx="1.5"/><rect x="11.5" y="8" width="3" height="4.5" rx="1.5"/></>,
    pyq:         <><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5 5h6M5 8h4M5 11h3"/><path d="M11 9l2 2-2 2"/></>,
    parent:      <><circle cx="5.5" cy="5" r="2.5"/><path d="M1 13.5a4.5 4.5 0 019 0"/><circle cx="12" cy="6" r="2"/><path d="M10 13.5a3 3 0 016 0"/></>,
    profile:     <><circle cx="8" cy="5.5" r="3"/><path d="M2.5 14.5a5.5 5.5 0 0111 0"/></>,
    upgrade:     <><path d="M10 2L6 8.5h4L8 14l6-7.5h-4L10 2z"/></>,
    settings:    <><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.6 3.6l1.5 1.5M10.9 10.9l1.5 1.5M3.6 12.4l1.5-1.5M10.9 5.1l1.5-1.5"/></>,
  };
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round"
         className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}

const NAV = [
  { to: "/",            label: "Dashboard",    icon: "dashboard",   end: true },
  { to: "/lessons",     label: "Learn",        icon: "lessons"               },
  { to: "/practice",    label: "Practice",     icon: "practice"              },
  { to: "/bookmarks",   label: "Bookmarks",    icon: "bookmarks"             },
  { to: "/analytics",   label: "Analytics",    icon: "analytics"             },
  { to: "/competition", label: "Competition",  icon: "competition"           },
  { to: "/live",        label: "Live Room",    icon: "live"                  },
  { to: "/planner",     label: "Study Planner",icon: "planner"               },
  { to: "/pyq",         label: "PYQ Bank",     icon: "pyq"                   },
  { to: "/parent",      label: "Parent View",  icon: "parent"                },
  { to: "/voice-tutor", label: "Voice Tutor",  icon: "voiceTutor"            },
  { to: "/profile",     label: "Profile",      icon: "profile"               },
];

const PARENT_NAV = [
  { to: "/parent",  label: "My Children",   icon: "parent",   end: true },
  { to: "/portal",  label: "Link Student",  icon: "profile"             },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { dark, toggle: toggleDark } = useThemeStore();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isParent = user?.role === "parent" || user?.role === "teacher";

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div className="flex h-screen overflow-hidden bg-apple-gray6">
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0 backdrop-blur-apple border-r border-apple-gray5 dark:border-apple-gray/20 transition-colors"
             style={{ background: "var(--sidebar-bg)" }}>
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
          {isParent ? (
            <>
              <p className="section-label px-2 mb-2">Parent Portal</p>
              {PARENT_NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon id={n.icon} />
                  {n.label}
                </NavLink>
              ))}
              <div className="divider mx-1 my-2" />
              <p className="section-label px-2 mb-2">Student View</p>
              {NAV.filter((n) => ["/", "/analytics", "/planner", "/pyq"].includes(n.to)).map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon id={n.icon} />
                  {n.label}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              <p className="section-label px-2 mb-2">Menu</p>
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon id={n.icon} />
                  {n.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Search + dark mode toggle */}
        <div className="px-3 mb-2 flex flex-col gap-1.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-apple text-[13px] text-apple-gray bg-apple-gray6 hover:bg-apple-gray5 transition-colors"
            style={{ background: "var(--fill)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" className="w-3.5 h-3.5 shrink-0">
              <circle cx="6.5" cy="6.5" r="4.5"/>
              <path d="M10 10l3 3"/>
            </svg>
            <span className="flex-1 text-left">Search topics…</span>
            <kbd className="text-[10px] border border-apple-gray5 rounded px-1 py-0.5">⌘K</kbd>
          </button>
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-apple text-[13px] text-apple-gray hover:bg-apple-gray5 transition-colors"
            style={{ background: "var(--fill)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" className="w-3.5 h-3.5 shrink-0">
              {dark
                ? <><circle cx="8" cy="8" r="4"/><path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.2 3.2l.7.7M12.1 12.1l.7.7M3.2 12.8l.7-.7M12.1 3.9l.7-.7"/></>
                : <path d="M14 9.5A6 6 0 019.5 2a6 6 0 100 12 6 6 0 004.5-4.5z"/>
              }
            </svg>
            <span className="flex-1 text-left">{dark ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>

        <div className="divider mx-4 mb-3" />

        {/* Bottom links */}
        <div className="px-3 mb-2 flex flex-col gap-0.5">
          <NavLink
            to="/pricing"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon id="upgrade" />
            Upgrade
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon id="settings" />
            Settings
          </NavLink>
        </div>

        {/* Legal links */}
        <div className="px-4 pb-2 flex items-center gap-3">
          <a href="/terms"   className="text-[10px] text-apple-gray hover:text-apple-blue transition-colors">Terms</a>
          <span className="text-apple-gray5 text-[10px]">·</span>
          <a href="/privacy" className="text-[10px] text-apple-gray hover:text-apple-blue transition-colors">Privacy</a>
        </div>

        {/* User footer */}
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[var(--label)] truncate">{user?.name}</p>
            <button
              onClick={async () => { await logoutApi().catch(() => {}); logout(); navigate("/login"); }}
              className="btn-destructive text-[11px]"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto transition-colors" style={{ background: "var(--gray6)" }}>
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
