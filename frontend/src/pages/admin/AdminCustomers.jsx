import { useState, useEffect } from "react";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const statusStyle = s => s === "VIP"
  ? { bg: "rgba(201,169,97,0.15)", color: GOLD }
  : s === "Active"
  ? { bg: "rgba(52,211,153,0.12)", color: "#34d399" }
  : { bg: "rgba(255,255,255,0.06)", color: "#888" };

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
          { id: 1, name: "Amina Hassan",   email: "amina@example.com",  phone: "+251911000001", totalOrders: 5, totalSpent: "ETB 24,500", lastOrder: "2025-02-10", status: "Active" },
          { id: 2, name: "Zainab Ali",     email: "zainab@example.com", phone: "+251911000002", totalOrders: 3, totalSpent: "ETB 12,300", lastOrder: "2025-01-28", status: "Active" },
          { id: 3, name: "Fatima Mohamed", email: "fatima@example.com", phone: "+251911000003", totalOrders: 8, totalSpent: "ETB 48,900", lastOrder: "2025-02-05", status: "VIP" },
          { id: 4, name: "Noor Ibrahim",   email: "noor@example.com",   phone: "+251911000004", totalOrders: 1, totalSpent: "ETB 4,500",  lastOrder: "2024-12-15", status: "Inactive" },
        ]);
      }
    } catch { /**/ }
  }, []);

  const handleDelete = id => { setCustomers(c => c.filter(x => x.id !== id)); setDeleteTarget(null); setSelected(null); };
  const updateStatus = (id, s) => { setCustomers(c => c.map(x => x.id === id ? { ...x, status: s } : x)); if (selected?.id === id) setSelected(p => ({ ...p, status: s })); };

  const filtered = customers.filter(c =>
    (filter === "All" || c.status === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",    value: customers.length },
          { label: "Active",   value: customers.filter(c => c.status === "Active").length },
          { label: "VIP",      value: customers.filter(c => c.status === "VIP").length },
        ].map(s => (
          <div key={s.label} className="p-5 border" style={CARD}>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border overflow-hidden" style={CARD}>
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <input type="text" placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)}
            className={inputCls} style={{ ...inputStyle, maxWidth: 280 }}
            onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
          <div className="flex gap-2 ml-auto flex-wrap">
            {["All", "Active", "VIP", "Inactive"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 text-xs font-semibold border transition-all"
                style={{ background: filter === s ? GOLD : "transparent", color: filter === s ? "#111" : GOLD, borderColor: "rgba(201,169,97,0.3)" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#0d0d0d" }}>
              <tr>
                {["Customer", "Orders", "Total Spent", "Last Order", "Status", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const ss = statusStyle(c.status);
                return (
                  <tr key={c.id} className="border-t transition-colors" style={{ borderColor: "#1a1a1a" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold" style={{ color: "#fff" }}>{c.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#888" }}>{c.email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium" style={{ color: "#aaa" }}>{c.totalOrders}</td>
                    <td className="px-5 py-3.5 font-bold" style={{ color: GOLD }}>{c.totalSpent}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#888" }}>{c.lastOrder}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 text-xs font-semibold" style={{ background: ss.bg, color: ss.color }}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(c)}
                        className="px-4 py-1.5 text-xs font-semibold border transition-all"
                        style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-14 text-center text-sm" style={{ color: "#888" }}>No customers found.</div>}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-md" style={{ background: "#111", border: "1px solid rgba(201,169,97,0.2)" }}>
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-black font-bold" style={{ background: GOLD }}>
                  {selected.name[0]}
                </div>
                <div>
                  <p className="font-bold" style={{ color: "#fff" }}>{selected.name}</p>
                  <p className="text-xs" style={{ color: "#888" }}>{selected.email}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl font-bold" style={{ color: "#888" }}>×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[["Phone",selected.phone],["Total Orders",selected.totalOrders],["Total Spent",selected.totalSpent],["Last Order",selected.lastOrder]].map(([l,v]) => (
                <div key={l}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>{l}</p>
                  <p className="text-sm font-semibold" style={{ color: "#fff" }}>{v}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Status</p>
                <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                  className={inputCls} style={{ ...inputStyle, background: "#0d0d0d" }}>
                  <option>Active</option><option>VIP</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider hover:opacity-90" style={{ background: GOLD, color: "#111" }}>Close</button>
              <button onClick={() => { setDeleteTarget(selected); setSelected(null); }} className="flex-1 py-2.5 text-sm font-semibold" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-sm p-6 text-center" style={{ background: "#111", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="font-bold text-lg mb-2" style={{ color: "#fff" }}>Delete Customer?</p>
            <p className="text-sm mb-6" style={{ color: "#aaa" }}>Remove <span className="font-semibold" style={{ color: "#fff" }}>{deleteTarget.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-semibold border" style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteTarget.id)} className="flex-1 py-2.5 text-sm font-bold hover:opacity-90" style={{ background: "#dc2626", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
