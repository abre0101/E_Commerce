import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";

const S = {
  sidebar: { background: "#0f0a06", borderRight: "1px solid #1c1209" },
  active:  { background: "rgba(212,149,42,0.12)", color: "#d4952a" },
  inactive:{ color: "#7d6040" },
  label:   { color: "#3d2c1e", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 },
};

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to}
      style={active ? S.active : S.inactive}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:text-white group">
      <span className={`transition-colors ${active ? "text-gold-400" : "text-stone-600 group-hover:text-stone-400"}`}
        style={active ? { color: "#d4952a" } : {}}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

export default function AdminLayout() {
  const { session, logout } = useAdminStore();
  const location = useLocation();

  if (!session) return <Navigate to="/admin/login" replace />;

  const isAdmin = session.role === "admin";
  const is = (path) => path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen" style={{ background: "#0f0a06" }}>
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 flex flex-col" style={S.sidebar}>

        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "#1c1209" }}>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-serif font-bold text-xl text-white">Yada</span>
            <span className="font-serif font-bold text-xl" style={{ color: "#d4952a" }}>Hair</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: isAdmin ? "#d4952a" : "#3d2c1e" }}>
              {session.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-none">{session.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide mt-0.5 inline-block"
                style={isAdmin
                  ? { background: "rgba(212,149,42,0.15)", color: "#d4952a" }
                  : { background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                {session.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p style={S.label} className="px-4 pb-2">Main</p>

          <NavItem to="/admin" label="Dashboard" active={is("/admin")} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          } />

          <NavItem to="/admin/orders" label="Orders" active={is("/admin/orders")} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          } />

          <NavItem to="/admin/products" label="Products" active={is("/admin/products")} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          } />

          {/* Admin-only */}
          {isAdmin && (
            <>
              <p style={S.label} className="px-4 pt-4 pb-2">Administration</p>
              <NavItem to="/admin/staff" label="Staff" active={is("/admin/staff")} icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              } />
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-0.5 border-t" style={{ borderColor: "#1c1209" }}>
          <Link to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-white"
            style={{ color: "#5c4028" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-red-500 hover:bg-red-500/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto" style={{ background: "#f9f6f1" }}>
        <Outlet />
      </main>
    </div>
  );
}
