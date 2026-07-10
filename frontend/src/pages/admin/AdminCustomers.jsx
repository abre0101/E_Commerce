import { useState, useEffect } from "react";

const statusStyle = s => s === "VIP"
  ? { bg: "rgba(22,163,74,0.12)", color: "#16a34a" }
  : s === "Active"
  ? { bg: "rgba(52,211,153,0.15)", color: "#059669" }
  : { bg: "rgba(156,143,160,0.15)", color: "#4b5563" };

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem("yada_users") || "[]");
      if (users.length > 0) {
        setCustomers(users.map((u, i) => ({
          id: u.id, name: u.name, email: u.email, phone: u.phone || "—",
          totalOrders: Math.floor(Math.random() * 10),
          totalSpent: `ETB ${(Math.random() * 50000 + 1000).toFixed(0)}`,
          lastOrder: "2025-02-10",
          status: i % 5 === 0 ? "VIP" : i % 4 === 0 ? "Inactive" : "Active",
        })));
      } else {
        setCustomers([
          { id: 1, name: "Amina Hassan", email: "amina@example.com", phone: "+251911000001", totalOrders: 5, totalSpent: "ETB 24,500", lastOrder: "2025-02-10", status: "Active" },
          { id: 2, name: "Zainab Ali", email: "zainab@example.com", phone: "+251911000002", totalOrders: 3, totalSpent: "ETB 12,300", lastOrder: "2025-01-28", status: "Active" },
          { id: 3, name: "Fatima Mohamed", email: "fatima@example.com", phone: "+251911000003", totalOrders: 8, totalSpent: "ETB 48,900", lastOrder: "2025-02-05", status: "VIP" },
          { id: 4, name: "Noor Ibrahim", email: "noor@example.com", phone: "+251911000004", totalOrders: 1, totalSpent: "ETB 4,500", lastOrder: "2024-12-15", status: "Inactive" },
        ]);
      }
    } catch { /* empty */ }
  }, []);

  const handleDelete = id => {
    setCustomers(c => c.filter(x => x.id !== id));
    setDeleteTarget(null);
    setSelected(null);
  };

  const updateStatus = (id, s) => {
    setCustomers(c => c.map(x => x.id === id ? { ...x, status: s } : x));
    if (selected?.id === id) setSelected(p => ({ ...p, status: s }));
  };

  const filtered = customers.filter(c =>
    (filter === "All" || c.status === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const statCounts = { total: customers.length, active: customers.filter(c => c.status === "Active").length, vip: customers.filter(c => c.status === "VIP").length };

  const inputCls = "w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-green-200 transition-all";
  const inputStyle = { borderColor: "#d1d5db", color: "#111827" };

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: statCounts.total, color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
          { label: "Active", value: statCounts.active, color: "#059669", bg: "rgba(52,211,153,0.08)" },
          { label: "VIP", value: statCounts.vip, color: "#22c55e", bg: "rgba(22,163,74,0.08)" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 bg-white border" style={{ borderColor: "#e5e7eb" }}>
            <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg }}>
              <svg className="w-4 h-4" style={{ color: s.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#111827" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: "#6b7280" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "#f3f4f6" }}>
          <input type="text" placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)}
            className={inputCls} style={{ ...inputStyle, maxWidth: 280 }} />
          <div className="flex gap-2 ml-auto">
            {["All", "Active", "VIP", "Inactive"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: filter === s ? "#16a34a" : "rgba(22,163,74,0.08)", color: filter === s ? "#fff" : "#16a34a" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["Customer", "Orders", "Total Spent", "Last Order", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const ss = statusStyle(c.status);
              return (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f3f4f6" }}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold" style={{ color: "#111827" }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{c.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium" style={{ color: "#4b5563" }}>{c.totalOrders}</td>
                  <td className="px-5 py-3.5 font-bold" style={{ color: "#16a34a" }}>{c.totalSpent}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#6b7280" }}>{c.lastOrder}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={ss}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelected(c)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-14 text-center" style={{ color: "#6b7280" }}>No customers found.</div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "#f3f4f6" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
                  {selected.name[0]}
                </div>
                <div>
                  <p className="font-bold" style={{ color: "#111827" }}>{selected.name}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{selected.email}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-100" style={{ color: "#6b7280" }}>×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[["Phone", selected.phone], ["Total Orders", selected.totalOrders], ["Total Spent", selected.totalSpent], ["Last Order", selected.lastOrder]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>{l}</p>
                  <p className="text-sm font-semibold" style={{ color: "#111827" }}>{v}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Status</p>
                <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option>Active</option><option>VIP</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
                Close
              </button>
              <button onClick={() => { setDeleteTarget(selected); setSelected(null); }}
                className="flex-1 py-2.5 rounded-xl font-semibold"
                style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
              <svg className="w-7 h-7" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: "#111827" }}>Delete Customer?</p>
            <p className="text-sm mb-6" style={{ color: "#4b5563" }}>Are you sure you want to remove <span className="font-semibold" style={{ color: "#111827" }}>{deleteTarget.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteTarget.id)} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
