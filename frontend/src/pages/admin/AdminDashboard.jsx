import { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/mockData";
import useAdminStore, { PERMISSIONS } from "../../store/useAdminStore";

function getOrders() { try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); } catch { return []; } }
function getCustomers() { try { return JSON.parse(localStorage.getItem("yada_users") || "[]"); } catch { return []; } }

const ST = {
  success: { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  pending: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  failed:  { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

function Stat({ label, value, sub, icon, grad, to }) {
  const inner = (
    <div className="rounded-2xl p-5 text-white relative overflow-hidden transition-all hover:scale-[1.02]" style={{ background: grad }}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 bg-white" />
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-75 mt-0.5">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function Action({ to, label, icon, bg }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-4 rounded-2xl bg-white border hover:shadow-md transition-all group"
      style={{ borderColor: "#ede9f0" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: bg }}>{icon}</div>
      <span className="text-sm font-semibold" style={{ color: "#2d2438" }}>{label}</span>
      <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#9c8fa0" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
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
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bars = [3, 7, 5, 9, 6, 12, 8];
  const maxBar = Math.max(...bars);
  const cats = products.reduce((a, p) => { a[p.category] = (a[p.category] || 0) + 1; return a; }, {});
  const catColors = ["#f472b6", "#c084fc", "#818cf8"];

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Banner */}
      <div className="rounded-2xl p-6 flex items-center justify-between relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a1825 0%,#2d1f3d 50%,#1f1a2e 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #f472b6 0%, transparent 60%)" }} />
        <div className="relative">
          <p className="text-xs mb-1 font-medium" style={{ color: "rgba(249,168,212,0.7)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold text-white">{greet}, {session?.name} 👋</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {isAdmin ? "Full admin access — all systems go." : "Staff access — orders and inventory."}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 relative">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(249,168,212,0.6)" }}>Role</p>
            <p className="text-sm font-bold capitalize" style={{ color: "#f9a8d4" }}>{session?.role}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "linear-gradient(135deg,#f472b6,#c084fc)" }}>
            {session?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Orders" value={orders.length} sub="All time" to="/admin/orders"
          grad="linear-gradient(135deg,#f472b6,#ec4899)"
          icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <Stat label="Products" value={products.length} sub={`${products.filter(p => p.inStock).length} in stock`} to="/admin/products"
          grad="linear-gradient(135deg,#c084fc,#a855f7)"
          icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        {perms.viewRevenue ? (
          <Stat label="Revenue" value={`ETB ${revenue.toLocaleString()}`} sub="All time"
            grad="linear-gradient(135deg,#34d399,#10b981)"
            icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        ) : <div />}
        {perms.viewRevenue ? (
          <Stat label="Customers" value={customers.length} sub="Registered" to="/admin/customers"
            grad="linear-gradient(135deg,#60a5fa,#3b82f6)"
            icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
        ) : <div />}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: "#ede9f0" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold text-base" style={{ color: "#1a1825" }}>Orders This Week</p>
              <p className="text-xs mt-0.5" style={{ color: "#9c8fa0" }}>Daily volume</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "#a855f7", background: "rgba(168,85,247,0.08)" }}>View Report →</Link>
          </div>
          <div className="flex items-end gap-2 h-32">
            {days.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold" style={{ color: "#f472b6" }}>{bars[i]}</span>
                <div className="w-full rounded-t-lg"
                  style={{ height: `${(bars[i] / maxBar) * 88}px`, background: i === 5 ? "linear-gradient(180deg,#f472b6,#c084fc)" : "rgba(196,132,252,0.18)" }} />
                <span className="text-[11px]" style={{ color: "#9c8fa0" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog */}
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#ede9f0" }}>
          <p className="font-bold text-base mb-0.5" style={{ color: "#1a1825" }}>Catalog</p>
          <p className="text-xs mb-5" style={{ color: "#9c8fa0" }}>By category</p>
          <div className="space-y-4">
            {Object.entries(cats).map(([cat, n], i) => (
              <div key={cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: "#2d2438" }}>{cat}</span>
                  <span className="text-sm font-bold" style={{ color: catColors[i % 3] }}>{n}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#f3f0f6" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${(n / products.length) * 100}%`, background: catColors[i % 3] }} />
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/products" className="mt-5 w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>
            Manage Products
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="font-bold text-base mb-3" style={{ color: "#1a1825" }}>Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Action to="/admin/consultations" label="Consultations" bg="linear-gradient(135deg,#f472b6,#ec4899)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <Action to="/admin/orders" label="Orders" bg="linear-gradient(135deg,#fb923c,#f97316)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
          />
          <Action to="/admin/inventory" label="Stock" bg="linear-gradient(135deg,#34d399,#10b981)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <Action to="/admin/promotions" label="Promotions" bg="linear-gradient(135deg,#f59e0b,#d97706)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>}
          />
          <Action to="/admin/customers" label="Customers" bg="linear-gradient(135deg,#60a5fa,#3b82f6)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <Action to="/admin/inquiries" label="Inquiries" bg="linear-gradient(135deg,#c084fc,#a855f7)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <Action to="/admin/content" label="Site Content" bg="linear-gradient(135deg,#fb7185,#f43f5e)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
          />
          <Action to="/admin/reports" label="Reports" bg="linear-gradient(135deg,#2dd4bf,#14b8a6)"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#ede9f0" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#f3f0f6" }}>
          <div>
            <p className="font-bold" style={{ color: "#1a1825" }}>Recent Orders</p>
            <p className="text-xs mt-0.5" style={{ color: "#9c8fa0" }}>Last {recent.length} transactions</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "#a855f7", background: "rgba(168,85,247,0.08)" }}>View All →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(168,85,247,0.08)" }}>
              <svg className="w-7 h-7" style={{ color: "#c084fc" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p className="font-semibold" style={{ color: "#2d2438" }}>No orders yet</p>
            <p className="text-sm mt-1" style={{ color: "#9c8fa0" }}>Completed payments will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "#faf8fc" }}>
              <tr>
                {["Reference", "Customer", perms.viewCustomerData && "Phone", "Status", perms.viewRevenue && "Total", "Date"].filter(Boolean).map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#9c8fa0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(o => {
                const s = ST[o.status] || ST.success;
                return (
                  <tr key={o.txRef} className="border-t hover:bg-purple-50/30 transition-colors" style={{ borderColor: "#f3f0f6" }}>
                    <td className="px-5 py-3.5 font-mono text-xs max-w-[120px] truncate" style={{ color: "#9c8fa0" }}>{o.txRef}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: "#1a1825" }}>{o.customer?.firstName} {o.customer?.lastName}</td>
                    {perms.viewCustomerData && <td className="px-5 py-3.5" style={{ color: "#6b6070" }}>{o.customer?.phone || "—"}</td>}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />{o.status || "success"}
                      </span>
                    </td>
                    {perms.viewRevenue && <td className="px-5 py-3.5 font-bold" style={{ color: "#a855f7" }}>ETB {o.total?.toLocaleString()}</td>}
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#9c8fa0" }}>{o.date ? new Date(o.date).toLocaleDateString() : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#ede9f0" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold" style={{ color: "#1a1825" }}>Top Products</p>
            <p className="text-xs mt-0.5" style={{ color: "#9c8fa0" }}>By reviews</p>
          </div>
          <Link to="/admin/products" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "#a855f7", background: "rgba(168,85,247,0.08)" }}>All Products →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#f3f0f6" }}>
              <div className="w-12 h-12 rounded-xl shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]})`, background: "#f3f0f6" }} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#1a1825" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#9c8fa0" }}>⭐ {p.rating} · {p.reviewCount} reviews</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: catColors[i] }}>ETB {p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
