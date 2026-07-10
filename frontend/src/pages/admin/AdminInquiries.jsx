import { useState } from "react";

const pStyle = p => p === "High"
  ? { bg: "rgba(239,68,68,0.12)", color: "#dc2626" }
  : p === "Medium"
  ? { bg: "rgba(251,191,36,0.15)", color: "#d97706" }
  : { bg: "rgba(52,211,153,0.15)", color: "#059669" };

const stStyle = s => s === "New"
  ? { bg: "rgba(251,191,36,0.15)", color: "#d97706" }
  : s === "In Progress"
  ? { bg: "rgba(96,165,250,0.15)", color: "#2563eb" }
  : { bg: "rgba(52,211,153,0.15)", color: "#059669" };

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([
    { id: 1, name: "Amina Hassan", email: "amina@example.com", subject: "Hair Quality Question", message: "Hi, I want to know about the durability of your raw Cambodian hair. How long does it last with daily use?", date: "2025-02-15", status: "New", priority: "Medium" },
    { id: 2, name: "Zainab Ali", email: "zainab@example.com", subject: "Bulk Order Inquiry", message: "I'm interested in wholesale pricing for hair extensions. Can you send me a price list for 20+ bundles?", date: "2025-02-14", status: "In Progress", priority: "High" },
    { id: 3, name: "Fatima Mohamed", email: "fatima@example.com", subject: "Shipping Delay", message: "My order hasn't arrived yet. It's been 5 days. Can you provide an update on the delivery status?", date: "2025-02-13", status: "In Progress", priority: "High" },
    { id: 4, name: "Noor Ibrahim", email: "noor@example.com", subject: "Product Feedback", message: "Absolutely love the quality! The hair is so soft and natural looking. Will definitely order again.", date: "2025-02-10", status: "Resolved", priority: "Low" },
  ]);

  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const updateStatus = (id, s) => {
    setInquiries(i => i.map(x => x.id === id ? { ...x, status: s } : x));
    if (selected?.id === id) setSelected(p => ({ ...p, status: s }));
  };

  const handleReply = () => {
    updateStatus(selected.id, "Resolved");
    setReply("");
    setSelected(null);
  };

  const handleDelete = () => {
    setInquiries(i => i.filter(x => x.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (selected?.id === deleteTarget.id) setSelected(null);
  };

  const filtered = filter === "All" ? inquiries : inquiries.filter(i => i.status === filter);

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-purple-200";
  const inputStyle = { borderColor: "#e5e0eb", color: "#1a1825" };

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: inquiries.length },
          { label: "New", value: inquiries.filter(i => i.status === "New").length },
          { label: "In Progress", value: inquiries.filter(i => i.status === "In Progress").length },
          { label: "Resolved", value: inquiries.filter(i => i.status === "Resolved").length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#ede9f0" }}>
            <p className="text-2xl font-bold" style={{ color: "#1a1825" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#9c8fa0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* List */}
        <div className="col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#ede9f0" }}>
          <div className="px-5 py-4 border-b flex gap-2" style={{ borderColor: "#f3f0f6" }}>
            {["All", "New", "In Progress", "Resolved"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: filter === s ? "#a855f7" : "rgba(168,85,247,0.08)", color: filter === s ? "#fff" : "#a855f7" }}>
                {s}
              </button>
            ))}
          </div>

          <div className="divide-y" style={{ borderColor: "#f3f0f6" }}>
            {filtered.map(item => {
              const ps = pStyle(item.priority);
              const ss = stStyle(item.status);
              const isActive = selected?.id === item.id;
              return (
                <div key={item.id} onClick={() => setSelected(item)} className="p-4 cursor-pointer transition-all"
                  style={{ background: isActive ? "rgba(168,85,247,0.04)" : "transparent", borderLeft: isActive ? "3px solid #a855f7" : "3px solid transparent" }}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#1a1825" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "#9c8fa0" }}>{item.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={ps}>{item.priority}</span>
                  </div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#2d2438" }}>{item.subject}</p>
                  <p className="text-xs line-clamp-1 mb-2" style={{ color: "#9c8fa0" }}>{item.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#9c8fa0" }}>{item.date}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={ss}>{item.status}</span>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div className="py-12 text-center text-sm" style={{ color: "#9c8fa0" }}>No inquiries found.</div>}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl border" style={{ borderColor: "#ede9f0" }}>
          {selected ? (
            <div className="flex flex-col h-full">
              <div className="p-5 border-b" style={{ borderColor: "#f3f0f6" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,#f472b6,#a855f7)" }}>
                    {selected.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1a1825" }}>{selected.name}</p>
                    <p className="text-xs" style={{ color: "#9c8fa0" }}>{selected.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-4 overflow-y-auto">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9c8fa0" }}>Subject</p>
                  <p className="font-semibold text-sm" style={{ color: "#1a1825" }}>{selected.subject}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9c8fa0" }}>Message</p>
                  <p className="text-sm p-3 rounded-xl" style={{ color: "#2d2438", background: "#faf8fc" }}>{selected.message}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9c8fa0" }}>Status</p>
                  <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)} className={inputCls} style={inputStyle}>
                    <option>New</option><option>In Progress</option><option>Resolved</option>
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9c8fa0" }}>Reply</p>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your response…"
                    rows={4} className={inputCls} style={{ ...inputStyle, resize: "none" }} />
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button onClick={handleReply} className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm"
                  style={{ background: "linear-gradient(135deg,#f472b6,#a855f7)" }}>Send Reply</button>
                <button onClick={() => setDeleteTarget(selected)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(168,85,247,0.08)" }}>
                <svg className="w-7 h-7" style={{ color: "#c084fc" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#2d2438" }}>No inquiry selected</p>
              <p className="text-xs mt-1" style={{ color: "#9c8fa0" }}>Click an inquiry to view and respond</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
              <svg className="w-7 h-7" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: "#1a1825" }}>Delete Inquiry?</p>
            <p className="text-sm mb-6" style={{ color: "#6b6070" }}>Remove inquiry from <span className="font-semibold" style={{ color: "#1a1825" }}>{deleteTarget.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
