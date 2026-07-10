import { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/mockData";
import useAdminStore, { PERMISSIONS } from "../../store/useAdminStore";

function getOrders() {
  try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); }
  catch { return []; }
}

const STATUS_STYLE = {
  success: { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  pending: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  failed:  { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent + "18" }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900 mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";
  const perms = PERMISSIONS[session?.role] || {};

  const orders = useMemo(getOrders, []);
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
          {session?.name} 👋
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          {isAdmin ? "You have full admin access." : "You have staff access — orders and inventory only."}
        </p>
      </div>

      {/* Stats */}
      <div className={`grid gap-4 mb-8 ${isAdmin ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"}`}>
        <StatCard label="Total Orders" value={orders.length} sub="All time"
          accent="#d4952a"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatCard label="Products" value={products.length} sub="In catalog"
          accent="#7c3aed"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />

        {/* Admin-only stats */}
        {perms.viewRevenue && (
          <>
            <StatCard label="Total Revenue" value={`ETB ${revenue.toLocaleString()}`} sub="All time"
              accent="#059669"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Avg. Order Value"
              value={orders.length ? `ETB ${Math.round(revenue / orders.length).toLocaleString()}` : "—"}
              accent="#0891b2"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
          </>
        )}
      </div>

      {/* Recent Orders table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-stone-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-stone-400 text-sm">No orders yet.</p>
            <p className="text-stone-300 text-xs mt-1">Completed Chapa payments will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "#faf7f2" }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Customer</th>
                  {perms.viewCustomerData && <th className="px-6 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Phone</th>}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                  {perms.viewRevenue && <th className="px-6 py-3 text-right text-xs font-semibold text-stone-400 uppercase tracking-wider">Total</th>}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentOrders.map((o) => {
                  const st = STATUS_STYLE[o.status] || STATUS_STYLE.success;
                  return (
                    <tr key={o.txRef} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-stone-400 max-w-[130px] truncate">{o.txRef}</td>
                      <td className="px-6 py-4 font-medium text-stone-800">{o.customer?.firstName} {o.customer?.lastName}</td>
                      {perms.viewCustomerData && <td className="px-6 py-4 text-stone-500">{o.customer?.phone || "—"}</td>}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: st.bg, color: st.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                          {o.status || "success"}
                        </span>
                      </td>
                      {perms.viewRevenue && <td className="px-6 py-4 text-right font-bold text-stone-800">ETB {o.total?.toLocaleString()}</td>}
                      <td className="px-6 py-4 text-stone-400 text-xs">{o.date ? new Date(o.date).toLocaleDateString() : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
