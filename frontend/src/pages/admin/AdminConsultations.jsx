import { useState } from "react";

const SS = s => ({
  Confirmed: { bg: "rgba(52,211,153,0.15)", color: "#059669" },
  Completed: { bg: "rgba(96,165,250,0.15)", color: "#2563eb" },
  Pending:   { bg: "rgba(251,191,36,0.15)", color: "#d97706" },
  Canceled:  { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
}[s] || { bg: "#f3f4f6", color: "#4b5563" });

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState([
    { id: 1, name: "Amina Hassan", email: "amina@example.com", phone: "+251911000001", date: "2025-02-15", time: "10:30 AM", status: "Confirmed", type: "Hair Extension Consultation" },
    { id: 2, name: "Zainab Ali", email: "zainab@example.com", phone: "+251911000002", date: "2025-02-16", time: "2:00 PM", status: "Pending", type: "Color Treatment" },
    { id: 3, name: "Fatima Mohamed", email: "fatima@example.com", phone: "+251911000003", date: "2025-02-17", time: "11:00 AM", status: "Completed", type: "Hair Care Advice" },
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
    setDeleteTarget(null);
    setViewItem(null);
  };

  const filtered = filter === "All" ? consultations : consultations.filter(c => c.status === filter);

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-green-200 transition-all";
  const inputStyle = { borderColor: "#d1d5db", color: "#111827" };

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: "#6b7280" }}>{consultations.length} total appointments</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
          + Add Appointment
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["All", "Pending", "Confirmed", "Completed", "Canceled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: filter === s ? "#16a34a" : "rgba(22,163,74,0.08)", color: filter === s ? "#fff" : "#16a34a" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["Customer", "Type", "Date & Time", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const s = SS(c.status);
              return (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f3f4f6" }}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold" style={{ color: "#111827" }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{c.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "#4b5563" }}>{c.type}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm" style={{ color: "#111827" }}>{c.date}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{c.time}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={s}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => setViewItem(c)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                        style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
                        View
                      </button>
                      <button onClick={() => setDeleteTarget(c)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-sm" style={{ color: "#6b7280" }}>No appointments found.</div>}
      </div>

      {/* Add modal */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#f3f4f6" }}>
              <p className="font-bold text-lg" style={{ color: "#111827" }}>New Appointment</p>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg font-bold" style={{ color: "#6b7280" }}>×</button>
            </div>
            <div className="p-6 space-y-3">
              {[["Customer Name", "name", "text"], ["Email", "email", "email"], ["Phone", "phone", "text"]].map(([ph, f, t]) => (
                <input key={f} type={t} placeholder={ph} value={form[f]}
                  onChange={e => setForm({ ...form, [f]: e.target.value })}
                  className={inputCls} style={inputStyle} />
              ))}
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} style={inputStyle} />
                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inputCls} style={inputStyle} />
              </div>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls} style={inputStyle}>
                <option value="">Select Type</option>
                <option>Hair Extension Consultation</option>
                <option>Color Treatment</option>
                <option>Hair Care Advice</option>
                <option>Walk-in Appointment</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>Save</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>Cancel</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* View modal */}
      {viewItem && (
        <Modal onClose={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#f3f4f6" }}>
              <p className="font-bold text-lg" style={{ color: "#111827" }}>Appointment Details</p>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg font-bold" style={{ color: "#6b7280" }}>×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[["Name", viewItem.name], ["Phone", viewItem.phone], ["Email", viewItem.email], ["Type", viewItem.type], ["Date", viewItem.date], ["Time", viewItem.time]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>{l}</p>
                  <p className="text-sm font-semibold" style={{ color: "#111827" }}>{v || "—"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Status</p>
                <select value={viewItem.status} onChange={e => updateStatus(viewItem.id, e.target.value)} className={inputCls} style={inputStyle}>
                  <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Canceled</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setViewItem(null)} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>Close</button>
              <button onClick={() => { setDeleteTarget(viewItem); setViewItem(null); }} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
              <svg className="w-7 h-7" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: "#111827" }}>Delete Appointment?</p>
            <p className="text-sm mb-6" style={{ color: "#4b5563" }}>This will permanently remove <span className="font-semibold" style={{ color: "#111827" }}>{deleteTarget.name}</span>'s appointment.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
