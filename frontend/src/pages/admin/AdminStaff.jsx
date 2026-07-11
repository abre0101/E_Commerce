import { useState } from "react";
import { Navigate } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2.5 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const PERMS = [
  ["View all orders",             true,  true ],
  ["Update order status",         true,  true ],
  ["Toggle product stock",        true,  true ],
  ["View revenue & totals",       true,  false],
  ["View customer email & phone", true,  false],
  ["Toggle featured products",    true,  false],
  ["Manage staff accounts",       true,  false],
];

const fo = e => { e.currentTarget.style.borderColor = GOLD; };
const fb = e => { e.currentTarget.style.borderColor = "#333"; };

export default function AdminStaff() {
  const { session, getStaff, addStaff, removeStaff } = useAdminStore();
  if (session?.role !== "admin") return <Navigate to="/admin" replace />;

  const [staff, setStaff] = useState(getStaff);
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = () => setStaff(getStaff());

  const handleAdd = e => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      addStaff(form.name, form.username, form.password);
      setSuccess(`Staff account "@${form.username}" created.`);
      setForm({ name: "", username: "", password: "" });
      refresh();
    } catch (err) { setError(err.message); }
  };

  const handleRemove = () => { removeStaff(deleteTarget.id); setDeleteTarget(null); refresh(); };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 border" style={CARD}>
          <p className="text-2xl font-bold" style={{ color: "#fff" }}>{staff.length}</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>Staff Members</p>
        </div>
        <div className="p-5 border" style={{ background: "rgba(201,169,97,0.08)", border: `1px solid rgba(201,169,97,0.3)` }}>
          <p className="font-serif text-2xl font-bold" style={{ color: GOLD }}>Admin</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>Your Role</p>
        </div>
        <div className="p-5 border" style={CARD}>
          <p className="text-2xl font-bold" style={{ color: "#fff" }}>Limited</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>Staff Access</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Create form */}
        <div className="p-6 border" style={CARD}>
          <p className="font-serif font-bold text-lg mb-1" style={{ color: "#fff" }}>Create Staff Account</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>Staff can manage orders and stock, but not revenue or customer data.</p>
          <form onSubmit={handleAdd} className="space-y-3">
            {[["Full Name","name","text","e.g. Abebe Kebede"],["Username","username","text","e.g. abebe"],["Password","password","password","Min. 6 characters"]].map(([label,field,type,ph]) => (
              <div key={field}>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>{label}</label>
                <input required type={type} placeholder={ph} value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className={inputCls} style={inputStyle} onFocus={fo} onBlur={fb} />
              </div>
            ))}
            {error && (
              <div className="px-3 py-2 text-xs" style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>
            )}
            {success && (
              <div className="px-3 py-2 text-xs" style={{ background: "rgba(201,169,97,0.08)", color: GOLD, border: "1px solid rgba(201,169,97,0.2)" }}>{success}</div>
            )}
            <button type="submit"
              className="w-full py-2.5 text-sm font-bold uppercase tracking-wider mt-1 hover:opacity-90 transition-all"
              style={{ background: GOLD, color: "#111" }}>
              Create Account
            </button>
          </form>
        </div>

        {/* Staff list */}
        <div className="p-6 border" style={CARD}>
          <p className="font-serif font-bold text-lg mb-1" style={{ color: "#fff" }}>Current Staff</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>{staff.length} member{staff.length !== 1 ? "s" : ""}</p>
          {staff.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold" style={{ color: "#fff" }}>No staff yet</p>
              <p className="text-xs mt-1" style={{ color: "#888" }}>Create an account to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 border transition-all"
                  style={{ borderColor: "#222" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,169,97,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center text-black text-sm font-bold"
                      style={{ background: GOLD }}>
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#fff" }}>{s.name}</p>
                      <p className="text-xs" style={{ color: "#888" }}>@{s.username}</p>
                    </div>
                  </div>
                  <button onClick={() => setDeleteTarget(s)}
                    className="px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Permissions table */}
      <div className="border overflow-hidden" style={CARD}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <p className="font-bold" style={{ color: "#fff" }}>Permission Overview</p>
          <p className="text-xs mt-0.5" style={{ color: "#888" }}>What each role can access</p>
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: "#0d0d0d" }}>
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>Action</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD }}>Admin</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#888" }}>Staff</th>
            </tr>
          </thead>
          <tbody>
            {PERMS.map(([action, admin, staffPerm]) => (
              <tr key={action} className="border-t" style={{ borderColor: "#1a1a1a" }}>
                <td className="px-5 py-3" style={{ color: "#ccc" }}>{action}</td>
                <td className="px-5 py-3 text-center">
                  {admin
                    ? <span className="inline-flex w-5 h-5 items-center justify-center" style={{ background: "rgba(201,169,97,0.15)" }}>
                        <svg className="w-3 h-3" style={{ color: GOLD }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    : <span className="inline-flex w-5 h-5 items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <svg className="w-3 h-3" style={{ color: "#555" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                  }
                </td>
                <td className="px-5 py-3 text-center">
                  {staffPerm
                    ? <span className="inline-flex w-5 h-5 items-center justify-center" style={{ background: "rgba(201,169,97,0.15)" }}>
                        <svg className="w-3 h-3" style={{ color: GOLD }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    : <span className="inline-flex w-5 h-5 items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <svg className="w-3 h-3" style={{ color: "#555" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                  }
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
            <p className="font-bold text-lg mb-2" style={{ color: "#fff" }}>Remove Staff Member?</p>
            <p className="text-sm mb-6" style={{ color: "#aaa" }}>
              Remove <span className="font-semibold" style={{ color: "#fff" }}>{deleteTarget.name}</span> (@{deleteTarget.username})? They will lose all access immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-semibold border" style={{ borderColor: "#333", color: "#888" }}>Cancel</button>
              <button onClick={handleRemove} className="flex-1 py-2.5 text-sm font-bold hover:opacity-90" style={{ background: "#dc2626", color: "#fff" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
