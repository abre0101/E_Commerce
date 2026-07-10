import { useState } from "react";
import useAdminStore from "../../store/useAdminStore";

const STATUSES = ["success", "processing", "shipped", "delivered", "failed"];

const ST = {
  success:    { bg: "rgba(52,211,153,0.15)",  color: "#059669", dot: "#34d399" },
  processing: { bg: "rgba(96,165,250,0.15)",  color: "#2563eb", dot: "#60a5fa" },
  shipped:    { bg: "rgba(201,147,90,0.18)",  color: "#16a34a", dot: "#4ade80" },
  delivered:  { bg: "rgba(52,211,153,0.15)",  color: "#059669", dot: "#34d399" },
  failed:     { bg: "rgba(239,68,68,0.12)",   color: "#dc2626", dot: "#f87171" },
  pending:    { bg: "rgba(251,191,36,0.15)",  color: "#d97706", dot: "#fbbf24" },
};

function getOrders() {
  try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem("yada_orders", JSON.stringify(orders));
}

export default function AdminOrders() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";
  const [orders, setOrders] = useState(() => [...getOrders()].reverse());
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  const updateStatus = (txRef, newStatus) => {
    const all = getOrders();
    const updated = all.map(o =>
      o.txRef === txRef
        ? { ...o, status: newStatus, updatedBy: session.username, updatedAt: new Date().toISOString() }
        : o
    );
    saveOrders(updated);
    setOrders([...updated].reverse());
  };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === "All" || (o.status || "success") === filterStatus;
    const name = `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || o.txRef?.includes(search);
    return matchStatus && matchSearch;
  });

  // summary counts
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => (o.status || "success") === s).length;
    return acc;
  }, {});

  const colSpan = isAdmin ? 7 : 5;

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Summary chips */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map(s => {
          const style = ST[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
              className="rounded-2xl p-4 text-left border transition-all hover:shadow-sm"
              style={{
                background: filterStatus === s ? style.bg : "#fff",
                borderColor: filterStatus === s ? style.dot : "#e5e7eb",
              }}>
              <p className="text-xl font-bold" style={{ color: filterStatus === s ? style.color : "#111827" }}>
                {counts[s]}
              </p>
              <p className="text-xs font-semibold capitalize mt-0.5" style={{ color: filterStatus === s ? style.color : "#6b7280" }}>
                {s}
              </p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>

        {/* Toolbar */}
        <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: "#f3f4f6" }}>
          <input
            type="text"
            placeholder="Search by name or reference…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-green-200 transition-all flex-1"
            style={{ borderColor: "#d1d5db", color: "#111827", maxWidth: 320 }}
          />
          <span className="text-xs font-semibold ml-auto" style={{ color: "#6b7280" }}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(22,163,74,0.08)" }}>
              <svg className="w-8 h-8" style={{ color: "#4ade80" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: "#111827" }}>No orders yet</p>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Completed Chapa payments will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                {[
                  "Reference",
                  "Customer",
                  isAdmin && "Phone",
                  "Status",
                  isAdmin && "Total",
                  "Date",
                  "",
                ].filter(Boolean).map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const st = ST[o.status] || ST.success;
                const isExp = expanded === o.txRef;
                return (
                  <>
                    <tr key={o.txRef}
                      className="border-t transition-colors"
                      style={{
                        borderColor: "#f3f4f6",
                        background: isExp ? "#f9fafb" : "transparent",
                      }}
                      onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "rgba(22,163,74,0.04)"; }}
                      onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = "transparent"; }}>

                      <td className="px-5 py-3.5 font-mono text-xs max-w-[120px] truncate" style={{ color: "#6b7280" }}>
                        {o.txRef}
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-semibold" style={{ color: "#111827" }}>
                          {o.customer?.firstName} {o.customer?.lastName}
                        </p>
                        {isAdmin && (
                          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{o.customer?.email}</p>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-5 py-3.5 text-sm" style={{ color: "#4b5563" }}>
                          {o.customer?.phone || "—"}
                        </td>
                      )}

                      <td className="px-5 py-3.5">
                        <select
                          value={o.status || "success"}
                          onChange={e => updateStatus(o.txRef, e.target.value)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer appearance-none"
                          style={{ background: st.bg, color: st.color }}>
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>

                      {isAdmin && (
                        <td className="px-5 py-3.5 font-bold" style={{ color: "#16a34a" }}>
                          ETB {o.total?.toLocaleString()}
                        </td>
                      )}

                      <td className="px-5 py-3.5">
                        <p className="text-xs" style={{ color: "#4b5563" }}>
                          {o.date ? new Date(o.date).toLocaleDateString() : "—"}
                        </p>
                        {o.updatedBy && (
                          <p className="text-[10px] mt-0.5" style={{ color: "#9ca3af" }}>by {o.updatedBy}</p>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setExpanded(isExp ? null : o.txRef)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            background: isExp ? "linear-gradient(135deg,#15803d,#22c55e)" : "rgba(22,163,74,0.08)",
                            color: isExp ? "#fff" : "#16a34a",
                          }}>
                          {isExp ? "Close" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {isExp && (
                      <tr key={`${o.txRef}-exp`}>
                        <td colSpan={colSpan} className="px-5 pb-5" style={{ background: "#f9fafb" }}>
                          <div className="grid md:grid-cols-3 gap-4 pt-1">

                            {/* Items */}
                            <div className="md:col-span-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "#6b7280" }}>
                                Items Ordered
                              </p>
                              <div className="space-y-2">
                                {o.items?.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center bg-white rounded-xl px-4 py-3 border"
                                    style={{ borderColor: "#e5e7eb" }}>
                                    <div>
                                      <p className="text-sm font-semibold" style={{ color: "#111827" }}>{item.name}</p>
                                      <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                                        Length: {item.length} · Qty: {item.qty}
                                      </p>
                                    </div>
                                    {isAdmin && (
                                      <p className="font-bold text-sm" style={{ color: "#16a34a" }}>
                                        ETB {(item.price * item.qty).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                ))}
                                {(!o.items || o.items.length === 0) && (
                                  <p className="text-xs px-4 py-3" style={{ color: "#6b7280" }}>No item details available.</p>
                                )}
                              </div>
                            </div>

                            {/* Delivery */}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "#6b7280" }}>
                                Delivery Info
                              </p>
                              <div className="bg-white rounded-xl px-4 py-3 border space-y-2" style={{ borderColor: "#e5e7eb" }}>
                                <p className="font-semibold text-sm" style={{ color: "#111827" }}>
                                  {o.customer?.firstName} {o.customer?.lastName}
                                </p>
                                {isAdmin ? (
                                  <>
                                    <p className="text-xs" style={{ color: "#4b5563" }}>{o.customer?.email}</p>
                                    <p className="text-xs" style={{ color: "#4b5563" }}>{o.customer?.phone}</p>
                                  </>
                                ) : (
                                  <p className="text-xs italic" style={{ color: "#9ca3af" }}>Contact details — admin only</p>
                                )}
                                {o.customer?.address && (
                                  <p className="text-xs pt-2 border-t" style={{ color: "#4b5563", borderColor: "#f3f4f6" }}>
                                    {o.customer.address}
                                  </p>
                                )}
                                {isAdmin && o.total && (
                                  <div className="pt-2 border-t flex justify-between" style={{ borderColor: "#f3f4f6" }}>
                                    <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>Order Total</span>
                                    <span className="text-sm font-bold" style={{ color: "#16a34a" }}>ETB {o.total.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
