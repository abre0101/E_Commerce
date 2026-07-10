import { useState } from "react";
import { Navigate } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";

export default function AdminStaff() {
  const { session, getStaff, addStaff, removeStaff } = useAdminStore();
  if (session?.role !== "admin") return <Navigate to="/admin" replace />;

  const [staff, setStaff] = useState(getStaff);
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refresh = () => setStaff(getStaff());

  const handleAdd = (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      addStaff(form.name, form.username, form.password);
      setForm({ name: "", username: "", password: "" });
      setSuccess(`Staff account "${form.username}" created.`);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = (id, username) => {
    if (!confirm(`Remove staff member "${username}"?`)) return;
    removeStaff(id);
    refresh();
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Staff Management</h1>
        <p className="text-stone-400 text-sm mt-1">
          Create staff accounts with limited access. Staff can manage orders and stock — not revenue or customer data.
        </p>
      </div>

      {/* Permission comparison */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-stone-800 mb-4">Permission Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#faf7f2" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider rounded-l-xl">Action</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#d4952a" }}>Admin (You)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-500 uppercase tracking-wider rounded-r-xl">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {[
                ["View all orders",               true,  true ],
                ["Update order status",           true,  true ],
                ["Toggle product stock",          true,  true ],
                ["View revenue & totals",         true,  false],
                ["View customer email & phone",   true,  false],
                ["Toggle featured products",      true,  false],
                ["Manage staff accounts",         true,  false],
              ].map(([action, admin, staff]) => (
                <tr key={action} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 text-stone-600">{action}</td>
                  <td className="px-4 py-3 text-center">{admin ? "✅" : "❌"}</td>
                  <td className="px-4 py-3 text-center">{staff ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add staff form */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Create Staff Account</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input required placeholder="e.g. Abebe Kebede" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-stone-200 outline-none focus:border-stone-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Username</label>
              <input required placeholder="e.g. abebe" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-stone-200 outline-none focus:border-stone-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Password</label>
              <input required type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-stone-200 outline-none focus:border-stone-400 transition-colors" />
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
            {success && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-xl">{success}</p>}

            <button type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: "#1c0a00" }}>
              Create Account
            </button>
          </form>
        </div>

        {/* Staff list */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-stone-800 mb-4">
            Current Staff
            <span className="ml-2 text-xs font-normal text-stone-400">({staff.length})</span>
          </h2>
          {staff.length === 0 ? (
            <div className="py-10 text-center text-stone-300">
              <svg className="w-10 h-10 mx-auto mb-3 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm">No staff accounts yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "#4f46e5" }}>
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{s.name}</p>
                      <p className="text-xs text-stone-400">@{s.username}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(s.id, s.username)}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
