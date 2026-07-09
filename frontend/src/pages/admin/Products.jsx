import { IconAlert, IconCheck, IconPackage, IconX } from "../../components/Icons";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [pending, setPending] = useState([]);
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const loadPending = () => api.get("/admin/products/pending").then((r) => setPending(r.data));
  const loadAll = () => api.get("/products/").then((r) => setAll(r.data.products));

  useEffect(() => {
    Promise.all([loadPending(), loadAll()]).finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/products/${id}/approve`);
    toast.success("Product approved");
    loadPending(); loadAll();
  };

  const reject = async (id) => {
    await api.delete(`/admin/products/${id}/reject`);
    toast.success("Product rejected");
    loadPending();
  };

  const list = tab === "pending" ? pending : all;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Management</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { key: "pending", label: `Pending (${pending.length})`, icon: <IconAlert size={14} /> },
          { key: "all",     label: `Live (${all.length})`,       icon: <IconPackage size={14} /> },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
              <div className="skeleton w-16 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-16 text-center text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-semibold text-gray-600 mb-1">All clear!</p>
          <p className="text-sm">No {tab === "pending" ? "pending" : "live"} products.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((p) => (
            <div key={p.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow">
              <img src={p.images?.[0] || "https://placehold.co/64x50"} alt={p.title}
                className="w-16 h-12 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ETB {Number(p.price).toLocaleString()} · {p.category} · by {p.seller_name}
                </p>
              </div>
              {tab === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => approve(p.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold">
                    <IconCheck size={14} /> Approve
                  </button>
                  <button onClick={() => reject(p.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold">
                    <IconX size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
