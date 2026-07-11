import { useState } from "react";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2.5 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const pStyle = p => p === "High"
  ? { bg: "rgba(239,68,68,0.12)",  color: "#f87171" }
  : p === "Medium"
  ? { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" }
  : { bg: "rgba(201,169,97,0.12)", color: GOLD };

const stStyle = s => s === "New"
  ? { bg: "rgba(201,169,97,0.15)", color: GOLD }
  : s === "In Progress"
  ? { bg: "rgba(96,165,250,0.12)", color: "#60a5fa" }
  : { bg: "rgba(52,211,153,0.12)", color: "#34d399" };

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([
    { id: 1, name: "Amina Hassan",   email: "amina@example.com",  subject: "Hair Quality Question", message: "Hi, I want to know about the durability of your raw Cambodian hair. How long does it last with daily use?",                         date: "2025-02-15", status: "New",         priority: "Medium" },
    { id: 2, name: "Zainab Ali",     email: "zainab@example.com", subject: "Bulk Order Inquiry",    message: "I'm interested in wholesale pricing for hair extensions. Can you send me a price list for 20+ bundles?",                         date: "2025-02-14", status: "In Progress", priority: "High" },
    { id: 3, name: "Fatima Mohamed", email: "fatima@example.com", subject: "Shipping Delay",        message: "My order hasn't arrived yet. It's been 5 days. Can you provide an update on the delivery status?",                              date: "2025-02-13", status: "In Progress", priority: "High" },
    { id: 4, name: "Noor Ibrahim",   email: "noor@example.com",   subject: "Product Feedback",      message: "Absolutely love the quality! The hair is so soft and natural looking. Will definitely order again.",                            date: "2025-02-10", status: "Resolved",    priority: "Low" },
  ]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const updateStatus = (id, s) => {
    setInquiries(i => i.map(x => x.id === id ? { ...x, status: s } : x));
    if (selected?.id === id) setSelected(p => ({ ...p, status: s }));
  };

  const handleReply = () => { updateStatus(selected.id, "Resolved"); setReply(""); setSelected(null); };

  const handleDelete = () => {
    setInquiries(i => i.filter(x => x.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (selected?.id === deleteTarget.id) setSelected(null);
  };

  const filtered = filter === "All" ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total",       value: inquiries.length },
          { label: "New",         value: inquiries.filter(i => i.status === "New").length },
          { label: "In Progress", value: inquiries.filter(i => i.status === "In Progress").length },
          { label: "Resolved",    value: inquiries.filter(i => i.status === "Resolved").length },
        ].map(s => (
          <div key={s.label} className="p-5 border" style={CARD}>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* List */}
        <div className="col-span-2 border overflow-hidden" style={CARD}>
          <div className="px-5 py-4 border-b flex gap-2 flex-wrap" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
            {["All", "New", "In Progress", "Resolved"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 text-xs font-semibold border transition-all"
                style={{ background: filter === s ? GOLD : "transparent", color: filter === s ? "#111" : GOLD, borderColor: "rgba(201,169,97,0.3)" }}>
                {s}
              </button>
            ))}
          </div>
          <div className="divide-y" style={{ borderColor: "#1a1a1a" }}>
            {filtered.map(item => {
              const ps = pStyle(item.priority);
              const ss = stStyle(item.status);
              const isActive = selected?.id === item.id;
              return (
                <div key={item.id} onClick={() => setSelected(item)} className="p-4 cursor-pointer transition-all"
                  style={{ background: isActive ? "rgba(201,169,97,0.06)" : "transparent", borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#fff" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "#888" }}>{item.email}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-semibold" style={{ background: ps.bg, color: ps.color }}>{item.priority}</span>
                  </div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#fff" }}>{item.subject}</p>
                  <p className="text-xs line-clamp-1 mb-2" style={{ color: "#888" }}>{item.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#666" }}>{item.date}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold" style={{ background: ss.bg, color: ss.color }}>{item.status}</span>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div className="py-12 text-center text-sm" style={{ color: "#888" }}>No inquiries found.</div>}
          </div>
        </div>

        {/* Detail panel */}
        <div className="border" style={CARD}>
          {selected ? (
            <div className="flex flex-col h-full">
              <div className="p-5 border-b" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center text-black text-sm font-bold"
                    style={{ background: GOLD }}>
                    {selected.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#fff" }}>{selected.name}</p>
                    <p className="text-xs" style={{ color: "#888" }}>{selected.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 space-y-4 overflow-y-auto">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Subject</p>
                  <p className="font-semibold text-sm" style={{ color: "#fff" }}>{selected.subject}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Message</p>
                  <p className="text-sm p-3" style={{ color: "#ccc", background: "#0d0d0d", border: "1px solid #1a1a1a" }}>{selected.message}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Status</p>
                  <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                    className={inputCls} style={{ ...inputStyle, background: "#0d0d0d" }}>
                    <option>New</option><option>In Progress</option><option>Resolved</option>
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Reply</p>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your response…"
                    rows={4} className={`${inputCls} resize-none`} style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
                </div>
              </div>
              <div className="p-5 pt-0 flex gap-2">
                <button onClick={handleReply}
                  className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                  style={{ background: GOLD, color: "#111" }}>Send Reply</button>
                <button onClick={() => setDeleteTarget(selected)}
                  className="px-4 py-2.5 text-sm font-semibold"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <svg className="w-10 h-10 mb-3" style={{ color: GOLD, opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm font-semibold" style={{ color: "#fff" }}>No inquiry selected</p>
              <p className="text-xs mt-1" style={{ color: "#888" }}>Click an inquiry to view and respond</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-sm p-6 text-center" style={{ background: "#111", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="font-bold text-lg mb-2" style={{ color: "#fff" }}>Delete Inquiry?</p>
            <p className="text-sm mb-6" style={{ color: "#aaa" }}>Remove inquiry from <span className="font-semibold" style={{ color: "#fff" }}>{deleteTarget.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-semibold border" style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-bold hover:opacity-90" style={{ background: "#dc2626", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
