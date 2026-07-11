import { useState } from "react";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2.5 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([
    { id: 1, code: "NEWYEAR10",  discount: "10%",      type: "Percentage", startDate: "2025-01-01", endDate: "2025-02-28", uses: 124, status: "Active" },
    { id: 2, code: "FIRST50",    discount: "ETB 50",   type: "Fixed",      startDate: "2025-02-01", endDate: "2025-02-28", uses: 45,  status: "Active" },
    { id: 3, code: "WEEKEND20",  discount: "20%",      type: "Percentage", startDate: "2025-01-15", endDate: "2025-01-31", uses: 89,  status: "Expired" },
    { id: 4, code: "VIPMEMBER",  discount: "15%",      type: "Percentage", startDate: "2024-12-01", endDate: "2025-03-31", uses: 203, status: "Active" },
  ]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ code: "", discount: "", type: "Percentage", startDate: "", endDate: "", limit: "" });

  const fi = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleAdd = () => {
    if (!form.code || !form.discount || !form.startDate || !form.endDate) return;
    setPromotions(p => [...p, { id: Date.now(), ...form, uses: 0, status: "Active" }]);
    setForm({ code: "", discount: "", type: "Percentage", startDate: "", endDate: "", limit: "" });
    setShowForm(false);
  };

  const filtered = filter === "All" ? promotions : promotions.filter(p => p.status === filter);
  const fo = e => { e.currentTarget.style.borderColor = GOLD; };
  const fb = e => { e.currentTarget.style.borderColor = "#333"; };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active",         value: promotions.filter(p => p.status === "Active").length },
          { label: "Total Uses",     value: promotions.reduce((s, p) => s + p.uses, 0) },
          { label: "Discounts Given",value: "~ETB 15,200" },
        ].map(s => (
          <div key={s.label} className="p-5 border" style={CARD}>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="p-6 border" style={CARD}>
          <p className="font-serif font-bold text-lg mb-4" style={{ color: "#fff" }}>New Promotion</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Promo Code (e.g. NEWYEAR10)" value={form.code}
              onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              className={inputCls} style={inputStyle} onFocus={fo} onBlur={fb} />
            <select value={form.type} onChange={fi("type")} className={inputCls} style={{ ...inputStyle, background: "#0d0d0d" }}>
              <option>Percentage</option><option>Fixed Amount</option>
            </select>
            <input type="text" placeholder="Discount Value (e.g. 10% or ETB 50)" value={form.discount}
              onChange={fi("discount")} className={inputCls} style={inputStyle} onFocus={fo} onBlur={fb} />
            <input type="number" placeholder="Usage Limit (optional)" value={form.limit}
              onChange={fi("limit")} className={inputCls} style={inputStyle} onFocus={fo} onBlur={fb} />
            <input type="date" value={form.startDate} onChange={fi("startDate")}
              className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }} onFocus={fo} onBlur={fb} />
            <input type="date" value={form.endDate} onChange={fi("endDate")}
              className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }} onFocus={fo} onBlur={fb} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
              style={{ background: GOLD, color: "#111" }}>Save</button>
            <button onClick={() => setShowForm(false)}
              className="px-6 py-2.5 text-sm font-semibold border transition-all"
              style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border overflow-hidden" style={CARD}>
        <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <div className="flex gap-2">
            {["All", "Active", "Expired"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 text-xs font-semibold border transition-all"
                style={{ background: filter === s ? GOLD : "transparent", color: filter === s ? "#111" : GOLD, borderColor: "rgba(201,169,97,0.3)" }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-all"
            style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            + New Promotion
          </button>
        </div>

        <table className="w-full text-sm">
          <thead style={{ background: "#0d0d0d" }}>
            <tr>
              {["Code", "Discount", "Type", "Period", "Uses", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t transition-colors" style={{ borderColor: "#1a1a1a" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                <td className="px-5 py-3.5">
                  <span className="font-bold font-mono px-2.5 py-1 text-sm" style={{ background: "rgba(201,169,97,0.1)", color: GOLD }}>{p.code}</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-lg" style={{ color: GOLD }}>{p.discount}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#aaa" }}>{p.type}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#888" }}>
                  <div>{p.startDate}</div><div>{p.endDate}</div>
                </td>
                <td className="px-5 py-3.5 font-bold" style={{ color: "#fff" }}>{p.uses}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 text-xs font-semibold"
                    style={p.status === "Active"
                      ? { background: "rgba(201,169,97,0.15)", color: GOLD }
                      : { background: "rgba(255,255,255,0.06)", color: "#888" }}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setDeleteTarget(p)}
                    className="px-3 py-1.5 text-xs font-semibold"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-sm p-6 text-center" style={{ background: "#111", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="font-bold text-lg mb-2" style={{ color: "#fff" }}>Delete Promotion?</p>
            <p className="text-sm mb-6" style={{ color: "#aaa" }}>Remove <span className="font-mono font-bold" style={{ color: GOLD }}>{deleteTarget.code}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-semibold border" style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
              <button onClick={() => { setPromotions(p => p.filter(x => x.id !== deleteTarget.id)); setDeleteTarget(null); }}
                className="flex-1 py-2.5 text-sm font-bold hover:opacity-90" style={{ background: "#dc2626", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
