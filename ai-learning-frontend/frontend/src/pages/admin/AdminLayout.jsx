import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/admin",           label: "Overview",  exact: true },
  { to: "/admin/questions", label: "Questions" },
  { to: "/admin/topics",    label: "Topics"    },
  { to: "/admin/users",     label: "Users"     },
  { to: "/admin/cache",     label: "AI Cache"  },
];

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex bg-apple-gray6">
      {/* Sidebar */}
      <nav className="w-52 bg-white border-r border-apple-gray5 flex flex-col py-6 px-4 gap-1 shrink-0">
        <p className="text-[11px] font-semibold text-apple-gray uppercase tracking-wider mb-3 px-2">Admin</p>
        {links.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `px-3 py-2 rounded-apple text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-apple-blue/10 text-apple-blue"
                  : "text-[var(--label2)] hover:bg-apple-gray6"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        <div className="mt-auto">
          <NavLink to="/" className="text-[12px] text-apple-gray hover:text-apple-blue px-2">
            ← Back to App
          </NavLink>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
