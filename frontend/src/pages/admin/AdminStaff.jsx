import { useState } from "react";
import { Navigate } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";

const PERMS = [
  ["View all orders",             true,  true ],
  ["Update order status",         true,  true ],
  ["Toggle product stock",        true,  true ],
  ["View revenue & totals",       true,  false],
  ["View customer email & phone", true,  false],
  ["Toggle featured products",    true,  false],
  ["Manage staff accounts",       true,  false],
];

export default function AdminStaff() {
  const { session, getStaff, addStaff, removeStaff } = useAdminStore();
  if (session?.role !== "admin") return <Navigate to="/admin" replace />;

  const [staff, setStaff] = useState(getStaff);
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = () => setStaff(getStaff());

  const handleAdd = (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      addStaff(form.name, form.username, form.password);
      setForm({ name: "", username: "", password: "" });
      setSuccess(`Staff account "@${form.username}" created successfully.`);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = () => {
    removeStaff(deleteTarget.id);
    setDeleteTarget(null);
    refresh();
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-purple-200 transition-all";
  const inputStyle = { borderColor: "#e5e0eb", color: "#1a1825" };

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#ede9f0" }}>
          <p className="text-2xl font-bold" style={{ color: "#1a1825" }}>{staff.length}</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#9c8fa0" }}>Staff Members</p>
        </div>
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#f472b6,#a855f7)" }}>
          <p className="text-2xl font-bold">Admin</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-75">Your Role</p>
        </div>
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#ede9f0" }}>
          <p className="text-2xl font-bold" style={{ color: "#1a1825" }}>Limited</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#9c8fa0" }}>Staff Access</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* Create form */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#ede9f0" }}>
          <p className="font-bold text-lg mb-1" style={{ color: "#1a1825" }}>Create Staff Account</p>
          <p className="text-xs mb-5" style={{ color: "#9c8fa0" }}>Staff can manage orders and stock, but not revenue or customer data.</p>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#9c8fa0" }}>Full Name</label>
              <input required placeholder="e.g. Abebe Kebede" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#9c8fa0" }}>Username</label>
              <input required placeholder="e.g. abebe" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#9c8fa0" }}>Password</label>
              <input required type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={inputCls} style={inputStyle} />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(52,211,153,0.1)", color: "#059669" }}>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {success}
              </div>
            )}

            <button type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white mt-1 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#f472b6,#a855f7)" }}>
              Create Account
            </button>
          </form>
        </div>

        {/* Staff list */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#ede9f0" }}>
          <p className="font-bold text-lg mb-1" style={{ color: "#1a1825" }}>Current Staff</p>
          <p className="text-xs mb-5" style={{ color: "#9c8fa0" }}>{staff.length} member{staff.length !== 1 ? "s" : ""}</p>

          {staff.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(168,85,247,0.08)" }}>
                <svg className="w-7 h-7" style={{ color: "#c084fc" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#2d2438" }}>No staff yet</p>
              <p className="text-xs mt-1" style={{ color: "#9c8fa0" }}>Create an account to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map(s => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border hover:border-purple-200 transition-all"
                  style={{ borderColor: "#f3f0f6" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#c084fc,#a855f7)" }}>
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1825" }}>{s.name}</p>
                      <p className="text-xs" style={{ color: "#9c8fa0" }}>@{s.username}</p>
                    </div>
                  </div>
                  <button onClick={() => setDeleteTarget(s)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Permissions table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#ede9f0" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f3f0f6" }}>
          <p className="font-bold" style={{ color: "#1a1825" }}>Permission Overview</p>
          <p className="text-xs mt-0.5" style={{ color: "#9c8fa0" }}>What each role can access</p>
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: "#faf8fc" }}>
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#9c8fa0" }}>Action</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#f472b6" }}>Admin</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#a855f7" }}>Staff</th>
            </tr>
          </thead>
          <tbody>
            {PERMS.map(([action, admin, staffPerm]) => (
              <tr key={action} className="border-t hover:bg-purple-50/20 transition-colors" style={{ borderColor: "#f3f0f6" }}>
                <td className="px-5 py-3" style={{ color: "#2d2438" }}>{action}</td>
                <td className="px-5 py-3 text-center">
                  {admin
                    ? <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: "rgba(244,114,182,0.15)" }}>
                        <svg className="w-3.5 h-3.5" style={{ color: "#ec4899" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    : <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: "rgba(156,143,160,0.1)" }}>
                        <svg className="w-3 h-3" style={{ color: "#c4bbc8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                  }
                </td>
                <td className="px-5 py-3 text-center">
                  {staffPerm
                    ? <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: "rgba(168,85,247,0.12)" }}>
                        <svg className="w-3.5 h-3.5" style={{ color: "#a855f7" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    : <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: "rgba(156,143,160,0.1)" }}>
                        <svg className="w-3 h-3" style={{ color: "#c4bbc8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
              <svg className="w-7 h-7" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: "#1a1825" }}>Remove Staff Member?</p>
            <p className="text-sm mb-6" style={{ color: "#6b6070" }}>
              Remove <span className="font-semibold" style={{ color: "#1a1825" }}>{deleteTarget.name}</span> (@{deleteTarget.username})? They will lose all admin access immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold"
                style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>
                Cancel
              </button>
              <button onClick={handleRemove}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white"
                style={{ background: "#dc2626" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
