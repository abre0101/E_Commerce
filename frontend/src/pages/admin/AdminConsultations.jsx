import { useState } from "react";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2.5 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const SS = s => ({
  Confirmed: { bg: "rgba(201,169,97,0.15)", color: GOLD },
  Completed: { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
  Pending:   { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  Canceled:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
}[s] || { bg: "rgba(255,255,255,0.05)", color: "#aaa" });

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState([
    { id: 1, name: "Amina Hassan",   email: "amina@example.com",  phone: "+251911000001", date: "2025-02-15", time: "10:30 AM", status: "Confirmed", type: "Hair Extension Consultation" },
    { id: 2, name: "Zainab Ali",     email: "zainab@example.com", phone: "+251911000002", date: "2025-02-16", time: "2:00 PM",  status: "Pending",   type: "Color Treatment" },
    { id: 3, name: "Fatima Mohamed", email: "fatima@example.com", phone: "+251911000003", date: "2025-02-17", time: "11:00 AM", status: "Completed",  type: "Hair Care Advice" },
  ]);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", type: "" });

  const updateStatus = (id, s) => {
    setConsultations(p => p.map(c => c.id === id ? { ...c, status: s } : c));
    if (viewItem?.id === id) setViewItem(v => ({ ...v, status: s }));
  };

  const handleAdd = () => {
    if (!form.name || !form.email || !form.date || !form.time) return;
    setConsultations(p => [...p, { id: Date.now(), ...form, status: "Pending" }]);
    setForm({ name: "", email: "", phone: "", date: "", time: "", type: "" });
    setShowAdd(false);
  };

  const handleDelete = () => {
    setConsultations(p => p.filter(c => c.id !== deleteTarget.id));
    setDeleteTarget(null); setViewItem(null);
  };

  const filtered = filter === "All" ? consultations : consultations.filter(c => c.status === filter);
  const fi = f => e => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#888" }}>{consultations.length} total appointments</p>
        <button onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90"
          style={{ background: GOLD, color: "#111" }}>
          + Add Appointment
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Confirmed", "Completed", "Canceled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 text-xs font-semibold border transition-all"
            style={{ background: filter === s ? GOLD : "transparent", color: filter === s ? "#111" : GOLD, borderColor: "rgba(201,169,97,0.3)" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border overflow-hidden" style={CARD}>
        <table className="w-full text-sm">
          <thead style={{ background: "#0d0d0d" }}>
            <tr>
              {["Customer", "Type", "Date & Time", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const s = SS(c.status);
              return (
                <tr key={c.id} className="border-t transition-colors" style={{ borderColor: "#1a1a1a" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold" style={{ color: "#fff" }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#888" }}>{c.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "#aaa" }}>{c.type}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm" style={{ color: "#fff" }}>{c.date}</p>
                    <p className="text-xs" style={{ color: "#888" }}>{c.time}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 text-xs font-semibold" style={s}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => setViewItem(c)}
                        className="px-3 py-1.5 text-xs font-semibold border transition-all"
                        style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        View
                      </button>
                      <button onClick={() => setDeleteTarget(c)}
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-sm" style={{ color: "#888" }}>No appointments found.</div>}
      </div>

      {/* Add modal */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <div className="w-full max-w-md" style={{ background: "#111", border: "1px solid rgba(201,169,97,0.2)" }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
              <p className="font-serif font-bold text-lg" style={{ color: "#fff" }}>New Appointment</p>
              <button onClick={() => setShowAdd(false)} className="text-xl font-bold" style={{ color: "#888" }}>×</button>
            </div>
            <div className="p-6 space-y-3">
              {[["Customer Name","name","text"],["Email","email","email"],["Phone","phone","text"]].map(([ph,f,t]) => (
                <input key={f} type={t} placeholder={ph} value={form[f]} onChange={fi(f)}
                  className={inputCls} style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
              ))}
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={fi("date")} className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }}
                  onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
                <input type="time" value={form.time} onChange={fi("time")} className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }}
                  onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
              </div>
              <select value={form.type} onChange={fi("type")} className={inputCls} style={{ ...inputStyle, background: "#111" }}
                onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }}>
                <option value="">Select Type</option>
                <option>Hair Extension Consultation</option><option>Color Treatment</option>
                <option>Hair Care Advice</option><option>Walk-in Appointment</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all" style={{ background: GOLD, color: "#111" }}>Save</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-semibold border transition-all" style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* View modal */}
      {viewItem && (
        <Modal onClose={() => setViewItem(null)}>
          <div className="w-full max-w-md" style={{ background: "#111", border: "1px solid rgba(201,169,97,0.2)" }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
              <p className="font-serif font-bold text-lg" style={{ color: "#fff" }}>Appointment Details</p>
              <button onClick={() => setViewItem(null)} className="text-xl font-bold" style={{ color: "#888" }}>×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[["Name",viewItem.name],["Phone",viewItem.phone],["Email",viewItem.email],["Type",viewItem.type],["Date",viewItem.date],["Time",viewItem.time]].map(([l,v]) => (
                <div key={l}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>{l}</p>
                  <p className="text-sm font-semibold" style={{ color: "#fff" }}>{v || "—"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Status</p>
                <select value={viewItem.status} onChange={e => updateStatus(viewItem.id, e.target.value)}
                  className={inputCls} style={{ ...inputStyle, background: "#0d0d0d" }}>
                  <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Canceled</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setViewItem(null)} className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider hover:opacity-90" style={{ background: GOLD, color: "#111" }}>Close</button>
              <button onClick={() => { setDeleteTarget(viewItem); setViewItem(null); }} className="flex-1 py-2.5 text-sm font-semibold" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm p-6 text-center" style={{ background: "#111", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="font-bold text-lg mb-2" style={{ color: "#fff" }}>Delete Appointment?</p>
            <p className="text-sm mb-6" style={{ color: "#aaa" }}>Remove <span className="font-semibold" style={{ color: "#fff" }}>{deleteTarget.name}</span>'s appointment?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-semibold border" style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-bold hover:opacity-90" style={{ background: "#dc2626", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
