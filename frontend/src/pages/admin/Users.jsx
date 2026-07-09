import { IconSearch, IconUsers } from "../../components/Icons";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const ROLE_STYLES = {
  admin:  "badge-purple",
  seller: "badge-orange",
  buyer:  "badge-gray",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users")
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id) => {
    await api.put(`/admin/users/${id}/toggle`);
    toast.success("User status updated");
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{users.length} total users</p>}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <IconSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-10 max-w-sm"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
              <div className="skeleton w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-32" />
                <div className="skeleton h-3 w-44" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_80px_80px_90px] gap-4 px-5 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <IconUsers size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            filtered.map((u) => (
              <div key={u.id}
                className="grid grid-cols-[1fr_1fr_80px_80px_90px] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-xs text-gray-600 shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-sm text-gray-800 truncate">{u.name}</span>
                </div>
                <span className="text-sm text-gray-500 truncate">{u.email}</span>
                <span className={`badge ${ROLE_STYLES[u.role] || "badge-gray"} w-fit`}>{u.role}</span>
                <span className={`badge w-fit ${u.is_active ? "badge-green" : "badge-red"}`}>
                  {u.is_active ? "Active" : "Disabled"}
                </span>
                <button onClick={() => toggle(u.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                    u.is_active
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  }`}>
                  {u.is_active ? "Disable" : "Enable"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
