import { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/mockData";
import useAdminStore, { PERMISSIONS } from "../../store/useAdminStore";

function getOrders() { try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); } catch { return []; } }
function getCustomers() { try { return JSON.parse(localStorage.getItem("yada_users") || "[]"); } catch { return []; } }

// ── shared tokens ──────────────────────────────────────────────────────────
const CARD  = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const GOLD  = "#C9A961";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const ST = {
  success: { bg: "rgba(201,169,97,0.15)", color: "#C9A961" },
  pending: { bg: "rgba(251,191,36,0.12)", color: "#d97706" },
  failed:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
};

function StatCard({ label, value, sub, icon, to }) {
  const inner = (
    <div className="p-5 border transition-all hover:border-yellow-600/40"
      style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}>
      <div className="w-9 h-9 flex items-center justify-center mb-4"
        style={{ background: "rgba(201,169,97,0.1)", color: GOLD }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: "#fff" }}>{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#666" }}>{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function QuickAction({ to, label, icon }) {
  return (
    <Link to={to}
      className="flex items-center gap-3 p-4 border transition-all group"
      style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A961"; e.currentTarget.style.background = "rgba(201,169,97,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,169,97,0.15)"; e.currentTarget.style.background = "#111"; }}>
      <span style={{ color: GOLD }}>{icon}</span>
      <span className="text-sm font-semibold" style={{ color: "#ccc" }}>{label}</span>
      <svg className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: GOLD }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function AdminDashboard() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";
  const perms = PERMISSIONS[session?.role] || {};
  const orders = useMemo(getOrders, []);
  const customers = useMemo(getCustomers, []);
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const recent = [...orders].reverse().slice(0, 5);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bars = [3, 7, 5, 9, 6, 12, 8];
  const maxBar = Math.max(...bars);
  const cats = products.reduce((a, p) => { a[p.category] = (a[p.category] || 0) + 1; return a; }, {});

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Welcome banner */}
      <div className="p-6 md:p-8 flex items-center justify-between relative overflow-hidden border"
        style={{ background: "#111", borderColor: "rgba(201,169,97,0.2)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 90% 50%, rgba(201,169,97,0.06) 0%, transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-px h-5" style={{ background: GOLD }} />
            <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Welcome back</p>
          </div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#fff" }}>{session?.name}</h1>
          <p className="text-sm mt-1" style={{ color: "#888" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 relative">
          <div className="text-right">
            <p className="text-xs" style={{ color: "#666" }}>
              {isAdmin ? "Full admin access" : "Staff access"}
            </p>
            <p className="text-sm font-bold capitalize mt-0.5" style={{ color: GOLD }}>{session?.role}</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center text-black font-bold text-lg"
            style={{ background: GOLD }}>
            {session?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={orders.length} sub="All time" to="/admin/orders"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatCard label="Products" value={products.length} sub={`${products.filter(p => p.inStock).length} in stock`} to="/admin/products"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        {perms.viewRevenue ? (
          <StatCard label="Revenue" value={`ETB ${revenue.toLocaleString()}`} sub="All time"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        ) : <div />}
        {perms.viewRevenue ? (
          <StatCard label="Customers" value={customers.length} sub="Registered" to="/admin/customers"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
        ) : <div />}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="md:col-span-2 p-6 border" style={CARD}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold" style={{ color: "#fff" }}>Orders This Week</p>
              <p className="text-xs mt-0.5" style={{ color: "#888" }}>Daily volume</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-semibold px-3 py-1.5 border transition-all"
              style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              View Report →
            </Link>
          </div>
          <div className="flex items-end gap-2 h-32">
            {days.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold" style={{ color: GOLD }}>{bars[i]}</span>
                <div className="w-full transition-all"
                  style={{ height: `${(bars[i] / maxBar) * 88}px`, background: i === 5 ? GOLD : "rgba(201,169,97,0.15)" }} />
                <span className="text-[11px]" style={{ color: "#666" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog */}
        <div className="p-6 border" style={CARD}>
          <p className="font-bold mb-0.5" style={{ color: "#fff" }}>Catalog</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>By category</p>
          <div className="space-y-4">
            {Object.entries(cats).map(([cat, n]) => (
              <div key={cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: "#ccc" }}>{cat}</span>
                  <span className="text-sm font-bold" style={{ color: GOLD }}>{n}</span>
                </div>
                <div className="h-1.5" style={{ background: "#1a1a1a" }}>
                  <div className="h-1.5 transition-all" style={{ width: `${(n / products.length) * 100}%`, background: GOLD }} />
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/products"
            className="mt-5 w-full flex items-center justify-center py-2.5 text-sm font-semibold border transition-all"
            style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            Manage Products
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GOLD }}>Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/admin/consultations", label: "Consultations", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { to: "/admin/orders",        label: "Orders",        d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
            { to: "/admin/inventory",     label: "Stock",         d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { to: "/admin/promotions",    label: "Promotions",    d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
            { to: "/admin/customers",     label: "Customers",     d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { to: "/admin/inquiries",     label: "Inquiries",     d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
            { to: "/admin/content",       label: "Site Content",  d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
            { to: "/admin/reports",       label: "Reports",       d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          ].map(a => (
            <QuickAction key={a.to} to={a.to} label={a.label}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={a.d} /></svg>}
            />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border overflow-hidden" style={CARD}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <div>
            <p className="font-bold" style={{ color: "#fff" }}>Recent Orders</p>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>Last {recent.length} transactions</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-semibold px-3 py-1.5 border transition-all"
            style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            View All →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-semibold" style={{ color: "#fff" }}>No orders yet</p>
            <p className="text-sm mt-1" style={{ color: "#888" }}>Completed payments will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "#0d0d0d" }}>
                <tr>
                  {["Reference", "Customer", "Status", perms.viewRevenue && "Total", "Date"].filter(Boolean).map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(o => {
                  const s = ST[o.status] || ST.success;
                  return (
                    <tr key={o.txRef} className="border-t" style={{ borderColor: "#1a1a1a" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#666" }}>{o.txRef}</td>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: "#fff" }}>{o.customer?.firstName} {o.customer?.lastName}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1" style={{ background: s.bg, color: s.color }}>
                          {o.status || "success"}
                        </span>
                      </td>
                      {perms.viewRevenue && <td className="px-5 py-3.5 font-bold" style={{ color: GOLD }}>ETB {o.total?.toLocaleString()}</td>}
                      <td className="px-5 py-3.5 text-xs" style={{ color: "#666" }}>{o.date ? new Date(o.date).toLocaleDateString() : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="p-6 border" style={CARD}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold" style={{ color: "#fff" }}>Top Products</p>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>By reviews</p>
          </div>
          <Link to="/admin/products" className="text-xs font-semibold px-3 py-1.5 border transition-all"
            style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            All Products →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 border" style={{ borderColor: "#222" }}>
              <img src={p.images[0]} alt={p.name} className="shrink-0 object-cover object-top" style={{ width: 48, height: 56 }} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#fff" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#888" }}>⭐ {p.rating} · {p.reviewCount} reviews</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: GOLD }}>ETB {p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
