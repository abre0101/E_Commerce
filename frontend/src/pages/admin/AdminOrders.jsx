import { useState } from "react";
import useAdminStore from "../../store/useAdminStore";

const ORDER_STATUSES = ["success", "processing", "shipped", "delivered", "failed"];

const STATUS_STYLE = {
  success:    { bg: "#f0fdf4", color: "#16a34a" },
  processing: { bg: "#eff6ff", color: "#2563eb" },
  shipped:    { bg: "#f5f3ff", color: "#7c3aed" },
  delivered:  { bg: "#ecfdf5", color: "#059669" },
  failed:     { bg: "#fef2f2", color: "#dc2626" },
  pending:    { bg: "#fffbeb", color: "#d97706" },
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

  const updateStatus = (txRef, newStatus) => {
    const all = getOrders();
    const updated = all.map((o) =>
      o.txRef === txRef
        ? { ...o, status: newStatus, updatedBy: session.username, updatedAt: new Date().toISOString() }
        : o
    );
    saveOrders(updated);
    setOrders([...updated].reverse());
  };

  const colSpan = isAdmin ? 7 : 5;

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Orders</h1>
        <p className="text-stone-400 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 py-20 text-center">
          <p className="text-stone-400 font-medium">No orders yet</p>
          <p className="text-stone-300 text-sm mt-1">Completed Chapa payments appear here automatically.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ background: "#faf7f2" }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Customer</th>
                {isAdmin && <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Phone</th>}
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-6 py-4 text-right text-xs font-semibold text-stone-400 uppercase tracking-wider">Total</th>}
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders.map((o) => {
                const st = STATUS_STYLE[o.status] || STATUS_STYLE.success;
                const isExp = expanded === o.txRef;
                return (
                  <>
                    <tr key={o.txRef} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-stone-400 max-w-[130px] truncate">{o.txRef}</td>
                      <td className="px-6 py-4 font-medium text-stone-800">{o.customer?.firstName} {o.customer?.lastName}</td>
                      {isAdmin && <td className="px-6 py-4 text-stone-500">{o.customer?.phone || "—"}</td>}
                      <td className="px-6 py-4">
                        <select
                          value={o.status || "success"}
                          onChange={(e) => updateStatus(o.txRef, e.target.value)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border-0 outline-none cursor-pointer"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      {isAdmin && <td className="px-6 py-4 text-right font-bold text-stone-800">ETB {o.total?.toLocaleString()}</td>}
                      <td className="px-6 py-4 text-stone-400 text-xs">
                        {o.date ? new Date(o.date).toLocaleDateString() : "—"}
                        {o.updatedBy && <p className="text-[10px] text-stone-300 mt-0.5">by {o.updatedBy}</p>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setExpanded(isExp ? null : o.txRef)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                          style={isExp ? { background: "#1c1209", color: "#fff" } : { background: "#f3ece0", color: "#7d6040" }}>
                          {isExp ? "Close" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {isExp && (
                      <tr key={`${o.txRef}-d`} style={{ background: "#faf7f2" }}>
                        <td colSpan={colSpan} className="px-6 py-5">
                          <div className="grid md:grid-cols-3 gap-5">
                            <div className="md:col-span-2">
                              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Items Ordered</p>
                              <div className="space-y-2">
                                {o.items?.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center bg-white rounded-xl px-4 py-2.5 border border-stone-100">
                                    <div>
                                      <p className="text-sm font-medium text-stone-800">{item.name}</p>
                                      <p className="text-xs text-stone-400">Length: {item.length} · Qty: {item.qty}</p>
                                    </div>
                                    {isAdmin && <p className="font-bold text-stone-800 text-sm">ETB {(item.price * item.qty).toLocaleString()}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Delivery</p>
                              <div className="bg-white rounded-xl px-4 py-3 border border-stone-100 space-y-1.5 text-sm">
                                <p className="font-semibold text-stone-800">{o.customer?.firstName} {o.customer?.lastName}</p>
                                {isAdmin ? (
                                  <>
                                    <p className="text-xs text-stone-500">{o.customer?.email}</p>
                                    <p className="text-xs text-stone-500">{o.customer?.phone}</p>
                                  </>
                                ) : (
                                  <p className="text-xs text-stone-300 italic">Contact details — admin only</p>
                                )}
                                <p className="text-xs text-stone-500 pt-1 border-t border-stone-50">{o.customer?.address}</p>
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
  );
}
