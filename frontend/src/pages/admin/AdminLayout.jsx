import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";
import { useState } from "react";

const Icon = ({ d, size = 17 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const I = {
  dashboard:  "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  calendar:   "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  customers:  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  orders:     "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  products:   "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  stock:      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  promotions: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  reports:    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  content:    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  inquiries:  "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  staff:      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  home:       "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  logout:     "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  chevL:      "M15 19l-7-7 7-7",
  chevR:      "M9 5l7 7-7 7",
};

const NAV = [
  {
    group: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", exact: true, icon: "dashboard" },
    ],
  },
  {
    group: "Business",
    items: [
      { to: "/admin/consultations", label: "Consultations", icon: "calendar" },
      { to: "/admin/customers",     label: "Customers",     icon: "customers" },
      { to: "/admin/orders",        label: "Orders",        icon: "orders" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { to: "/admin/products",  label: "Products", icon: "products" },
      { to: "/admin/inventory", label: "Stock",    icon: "stock" },
    ],
  },
  {
    group: "Growth",
    items: [
      { to: "/admin/promotions", label: "Promotions", icon: "promotions" },
      { to: "/admin/reports",    label: "Reports",    icon: "reports" },
    ],
  },
  {
    group: "Content",
    items: [
      { to: "/admin/content",   label: "Site Content", icon: "content" },
      { to: "/admin/inquiries", label: "Inquiries",    icon: "inquiries" },
    ],
  },
];

const ADMIN_GROUP = {
  group: "Team",
  items: [{ to: "/admin/staff", label: "Staff", icon: "staff" }],
};

const PAGE_TITLES = {
  "/admin":               "Dashboard",
  "/admin/orders":        "Orders",
  "/admin/products":      "Products",
  "/admin/consultations": "Consultations",
  "/admin/customers":     "Customers",
  "/admin/inventory":     "Stock",
  "/admin/promotions":    "Promotions",
  "/admin/content":       "Site Content",
  "/admin/inquiries":     "Inquiries",
  "/admin/reports":       "Reports",
  "/admin/staff":         "Staff",
};

// Clean white sidebar theme (matching reference)
const ACTIVE_BG   = "#16a34a";
const ACTIVE_TEXT = "#ffffff";
const ACTIVE_ICON = "#ffffff";
const IDLE_TEXT   = "#374151";
const IDLE_ICON   = "#6b7280";
const HOVER_BG    = "#f0fdf4";
const HOVER_TEXT  = "#15803d";
const GROUP_LABEL = "#9ca3af";

function NavItem({ to, iconKey, label, active, collapsed }) {
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      className="flex items-center rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        padding: collapsed ? "9px 0" : "8px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 10,
        background: active ? ACTIVE_BG : "transparent",
        color: active ? ACTIVE_TEXT : IDLE_TEXT,
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = HOVER_BG;
          e.currentTarget.style.color = HOVER_TEXT;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = IDLE_TEXT;
        }
      }}
    >
      <span style={{ color: active ? ACTIVE_ICON : IDLE_ICON, flexShrink: 0 }}>
        <Icon d={I[iconKey]} />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export default function AdminLayout() {
  const { session, logout } = useAdminStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!session) return <Navigate to="/admin/login" replace />;

  const isAdmin = session.role === "admin";
  const is = (path, exact) =>
    exact ? location.pathname === path
          : location.pathname === path || location.pathname.startsWith(path + "/");

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([p]) =>
      p === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(p)
    )?.[1] ?? "Admin";

  const allGroups = [...NAV, ...(isAdmin ? [ADMIN_GROUP] : [])];

  return (
    <div className="flex min-h-screen" style={{ background: "#f3f4f6" }}>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        {/* ── Logo ── */}
        <div
          className="flex items-center h-[60px] shrink-0"
          style={{
            padding: collapsed ? "0 16px" : "0 16px",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#16a34a,#4ade80)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 2C8 2 5 5 5 9c0 2.5 1 4.5 2.5 6L12 22l4.5-7C18 13.5 19 11.5 19 9c0-4-3-7-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-none truncate" style={{ color: "#111827" }}>YadaHair</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "#6b7280" }}>Hair Management</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all shrink-0"
            style={{ color: "#9ca3af" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <Icon d={collapsed ? I.chevR : I.chevL} size={15} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: "12px 8px" }}>
          {allGroups.map(({ group, items }, gi) => (
            <div key={group} style={{ marginBottom: gi < allGroups.length - 1 ? 16 : 0 }}>
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: GROUP_LABEL }}>
                  {group}
                </p>
              )}
              {collapsed && gi > 0 && (
                <div className="mx-auto mb-2 mt-1" style={{ width: 24, height: 1, background: "#e5e7eb" }} />
              )}
              <div className="space-y-0.5">
                {items.map(item => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    iconKey={item.icon}
                    label={item.label}
                    active={is(item.to, item.exact)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div style={{ borderTop: "1px solid #e5e7eb", padding: "8px 8px" }}>
          <Link
            to="/"
            className="flex items-center rounded-lg text-sm transition-all mb-0.5"
            style={{
              padding: collapsed ? "8px 0" : "8px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              color: IDLE_TEXT,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ color: IDLE_ICON, flexShrink: 0 }}><Icon d={I.home} /></span>
            {!collapsed && <span className="font-medium">View Store</span>}
          </Link>

          {/* User chip */}
          <div
            className="flex items-center rounded-lg mt-1"
            style={{
              padding: collapsed ? "7px 0" : "7px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 8,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#16a34a,#4ade80)" }}>
              {session.name[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate leading-none" style={{ color: "#111827" }}>{session.name}</p>
                  <p className="text-[10px] mt-0.5 capitalize" style={{ color: "#6b7280" }}>{session.role}</p>
                </div>
                <button onClick={logout} title="Sign out"
                  className="p-1 rounded transition-all ml-1 shrink-0"
                  style={{ color: "#9ca3af" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <Icon d={I.logout} size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ═══════════════ MAIN ═══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Topbar ── */}
        <header
          className="h-[60px] shrink-0 flex items-center justify-between"
          style={{
            padding: "0 24px",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Left — breadcrumb */}
          <div className="flex items-center gap-2 text-sm" style={{ color: "#6b7280" }}>
            <span>YadaHair Admin</span>
            <span>›</span>
            <span className="font-semibold" style={{ color: "#111827" }}>{pageTitle}</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "#f3f4f6", color: "#374151" }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
            <div className="w-px h-5" style={{ background: "#e5e7eb" }} />
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold leading-none" style={{ color: "#111827" }}>{session.name}</p>
                <p className="text-[10px] mt-0.5 capitalize" style={{ color: "#6b7280" }}>{session.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg,#16a34a,#4ade80)" }}>
                {session.name[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 overflow-auto" style={{ padding: 24, background: "#f3f4f6" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
