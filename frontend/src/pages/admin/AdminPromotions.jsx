import { useState } from "react";

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([
    { id: 1, code: "NEWYEAR10", discount: "10%", type: "Percentage", startDate: "2025-01-01", endDate: "2025-02-28", uses: 124, status: "Active" },
    { id: 2, code: "FIRST50", discount: "ETB 50", type: "Fixed", startDate: "2025-02-01", endDate: "2025-02-28", uses: 45, status: "Active" },
    { id: 3, code: "WEEKEND20", discount: "20%", type: "Percentage", startDate: "2025-01-15", endDate: "2025-01-31", uses: 89, status: "Expired" },
    { id: 4, code: "VIPMEMBER", discount: "15%", type: "Percentage", startDate: "2024-12-01", endDate: "2025-03-31", uses: 203, status: "Active" },
  ]);

  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ code: "", discount: "", type: "Percentage", startDate: "", endDate: "", limit: "" });

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-green-200";
  const inputStyle = { borderColor: "#d1d5db", color: "#111827" };

  const handleAdd = () => {
    if (!form.code || !form.discount || !form.startDate || !form.endDate) return;
    setPromotions(p => [...p, { id: Date.now(), ...form, uses: 0, status: "Active" }]);
    setForm({ code: "", discount: "", type: "Percentage", startDate: "", endDate: "", limit: "" });
    setShowForm(false);
  };

  const filtered = filter === "All" ? promotions : promotions.filter(p => p.status === filter);

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: promotions.filter(p => p.status === "Active").length, color: "#059669" },
          { label: "Total Uses", value: promotions.reduce((s, p) => s + p.uses, 0), color: "#16a34a" },
          { label: "Discounts Given", value: "~ETB 15,200", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-2xl font-bold" style={{ color: "#111827" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#6b7280" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e5e7eb" }}>
          <p className="font-bold text-lg mb-4" style={{ color: "#111827" }}>New Promotion</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Promo Code (e.g. NEWYEAR10)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputCls} style={inputStyle} />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls} style={inputStyle}>
              <option>Percentage</option><option>Fixed Amount</option>
            </select>
            <input type="text" placeholder="Discount Value (e.g. 10% or ETB 50)" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className={inputCls} style={inputStyle} />
            <input type="number" placeholder="Usage Limit (optional)" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} className={inputCls} style={inputStyle} />
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inputCls} style={inputStyle} />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className={inputCls} style={inputStyle} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>Save</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#f3f4f6" }}>
          <div className="flex gap-2">
            {["All", "Active", "Expired"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: filter === s ? "#16a34a" : "rgba(22,163,74,0.08)", color: filter === s ? "#fff" : "#16a34a" }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
            + New Promotion
          </button>
        </div>

        <table className="w-full text-sm">
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["Code", "Discount", "Type", "Period", "Uses", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f3f4f6" }}>
                <td className="px-5 py-3.5">
                  <span className="font-bold font-mono px-2.5 py-1 rounded-lg text-sm" style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>{p.code}</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-lg" style={{ color: "#22c55e" }}>{p.discount}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#4b5563" }}>{p.type}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#6b7280" }}>
                  <div>{p.startDate}</div><div>{p.endDate}</div>
                </td>
                <td className="px-5 py-3.5 font-bold" style={{ color: "#111827" }}>{p.uses}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: p.status === "Active" ? "rgba(52,211,153,0.15)" : "rgba(107,96,112,0.15)", color: p.status === "Active" ? "#059669" : "#4b5563" }}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setDeleteTarget(p)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
              <svg className="w-7 h-7" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: "#111827" }}>Delete Promotion?</p>
            <p className="text-sm mb-6" style={{ color: "#4b5563" }}>Remove <span className="font-mono font-bold" style={{ color: "#16a34a" }}>{deleteTarget.code}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>Cancel</button>
              <button onClick={() => { setPromotions(p => p.filter(x => x.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
