import { useState } from "react";
import useAdminStore from "../../store/useAdminStore";

const STATUSES = ["success", "processing", "shipped", "delivered", "failed"];
const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };

const ST = {
  success:    { bg: "rgba(201,169,97,0.15)", color: "#C9A961" },
  processing: { bg: "rgba(96,165,250,0.12)", color: "#60a5fa" },
  shipped:    { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  delivered:  { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
  failed:     { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
  pending:    { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
};

function getOrders() { try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); } catch { return []; } }
function saveOrders(o) { localStorage.setItem("yada_orders", JSON.stringify(o)); }

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
      o.txRef === txRef ? { ...o, status: newStatus, updatedBy: session.username, updatedAt: new Date().toISOString() } : o
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

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => (o.status || "success") === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Status chips */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map(s => {
          const style = ST[s];
          const active = filterStatus === s;
          return (
            <button key={s} onClick={() => setFilterStatus(active ? "All" : s)}
              className="p-4 text-left border transition-all"
              style={{ background: active ? style.bg : "#111", borderColor: active ? style.color : "rgba(201,169,97,0.15)" }}>
              <p className="text-xl font-bold" style={{ color: active ? style.color : "#fff" }}>{counts[s]}</p>
              <p className="text-xs font-semibold capitalize mt-0.5" style={{ color: active ? style.color : "#888" }}>{s}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="border overflow-hidden" style={CARD}>
        <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <input type="text" placeholder="Search by name or reference…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 text-sm border outline-none flex-1 transition-all"
            style={{ borderColor: "#333", color: "#fff", background: "transparent", maxWidth: 320 }}
            onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
          <span className="text-xs font-semibold ml-auto" style={{ color: "#888" }}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-semibold" style={{ color: "#fff" }}>No orders yet</p>
            <p className="text-sm mt-1" style={{ color: "#888" }}>Completed payments will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "#0d0d0d" }}>
                <tr>
                  {["Reference", "Customer", isAdmin && "Phone", "Status", isAdmin && "Total", "Date", ""].filter(Boolean).map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const st = ST[o.status] || ST.success;
                  const isExp = expanded === o.txRef;
                  return (
                    <>
                      <tr key={o.txRef} className="border-t transition-colors"
                        style={{ borderColor: "#1a1a1a", background: isExp ? "rgba(201,169,97,0.04)" : "transparent" }}
                        onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                        onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = "transparent"; }}>
                        <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#666" }}>{o.txRef}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold" style={{ color: "#fff" }}>{o.customer?.firstName} {o.customer?.lastName}</p>
                          {isAdmin && <p className="text-xs mt-0.5" style={{ color: "#888" }}>{o.customer?.email}</p>}
                        </td>
                        {isAdmin && <td className="px-5 py-3.5 text-sm" style={{ color: "#aaa" }}>{o.customer?.phone || "—"}</td>}
                        <td className="px-5 py-3.5">
                          <select value={o.status || "success"} onChange={e => updateStatus(o.txRef, e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 border-0 outline-none cursor-pointer appearance-none"
                            style={{ background: st.bg, color: st.color }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                        {isAdmin && <td className="px-5 py-3.5 font-bold" style={{ color: GOLD }}>ETB {o.total?.toLocaleString()}</td>}
                        <td className="px-5 py-3.5">
                          <p className="text-xs" style={{ color: "#aaa" }}>{o.date ? new Date(o.date).toLocaleDateString() : "—"}</p>
                          {o.updatedBy && <p className="text-[10px] mt-0.5" style={{ color: "#666" }}>by {o.updatedBy}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button onClick={() => setExpanded(isExp ? null : o.txRef)}
                            className="px-3 py-1.5 text-xs font-semibold border transition-all"
                            style={isExp
                              ? { background: GOLD, color: "#111", borderColor: GOLD }
                              : { background: "transparent", color: GOLD, borderColor: "rgba(201,169,97,0.4)" }}
                            onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                            onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = "transparent"; }}>
                            {isExp ? "Close" : "Details"}
                          </button>
                        </td>
                      </tr>
                      {isExp && (
                        <tr key={`${o.txRef}-exp`}>
                          <td colSpan={isAdmin ? 7 : 5} className="px-5 pb-5" style={{ background: "rgba(201,169,97,0.03)" }}>
                            <div className="grid md:grid-cols-3 gap-4 pt-3">
                              <div className="md:col-span-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Items Ordered</p>
                                <div className="space-y-2">
                                  {o.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center px-4 py-3 border"
                                      style={{ background: "#111", borderColor: "#222" }}>
                                      <div>
                                        <p className="text-sm font-semibold" style={{ color: "#fff" }}>{item.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "#888" }}>Length: {item.length} · Qty: {item.qty}</p>
                                      </div>
                                      {isAdmin && <p className="font-bold text-sm" style={{ color: GOLD }}>ETB {(item.price * item.qty).toLocaleString()}</p>}
                                    </div>
                                  ))}
                                  {(!o.items || !o.items.length) && <p className="text-xs" style={{ color: "#888" }}>No item details.</p>}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Delivery Info</p>
                                <div className="px-4 py-3 border space-y-2" style={{ background: "#111", borderColor: "#222" }}>
                                  <p className="font-semibold text-sm" style={{ color: "#fff" }}>{o.customer?.firstName} {o.customer?.lastName}</p>
                                  {isAdmin ? (
                                    <>
                                      <p className="text-xs" style={{ color: "#aaa" }}>{o.customer?.email}</p>
                                      <p className="text-xs" style={{ color: "#aaa" }}>{o.customer?.phone}</p>
                                    </>
                                  ) : <p className="text-xs italic" style={{ color: "#666" }}>Contact details — admin only</p>}
                                  {o.customer?.address && <p className="text-xs pt-2 border-t" style={{ color: "#aaa", borderColor: "#222" }}>{o.customer.address}</p>}
                                  {isAdmin && o.total && (
                                    <div className="pt-2 border-t flex justify-between" style={{ borderColor: "#222" }}>
                                      <span className="text-xs" style={{ color: "#888" }}>Total</span>
                                      <span className="text-sm font-bold" style={{ color: GOLD }}>ETB {o.total.toLocaleString()}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
