import { IconPackage } from "../../components/Icons";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  pending:   "badge-orange",
  confirmed: "badge-purple",
  shipped:   "badge-blue",
  delivered: "badge-green",
  cancelled: "badge-red",
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/sellers/dashboard")
      .then((r) => setOrders(r.data.recent_orders))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success("Status updated");
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {[1,2,3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="skeleton h-5 w-40" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          {orders.length > 0 && <p className="text-sm text-gray-500 mt-0.5">{orders.length} orders</p>}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-16 text-center text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconPackage size={28} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-700 mb-1">No orders yet</h3>
          <p className="text-sm">Orders from customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              {/* Order header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <span className="font-bold text-gray-800">#{o.id.slice(-8).toUpperCase()}</span>
                <span className={`badge ${STATUS_STYLES[o.status] || "badge-gray"}`}>{o.status}</span>
                <span className="ml-auto font-bold text-accent-500">
                  ETB {Number(o.total).toLocaleString()}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                {o.items?.map((item, i) => (
                  <span key={i}>{item.title} <span className="text-gray-400">× {item.qty}</span></span>
                ))}
              </div>

              {/* Status actions */}
              {o.status !== "cancelled" && o.status !== "delivered" && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Move to:</span>
                  {STATUSES
                    .filter((s) => s !== o.status && s !== "cancelled")
                    .map((s) => (
                      <button key={s} onClick={() => updateStatus(o.id, s)}
                        className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium capitalize">
                        → {s}
                      </button>
                    ))}
                  <button onClick={() => updateStatus(o.id, "cancelled")}
                    className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium ml-auto">
                    Cancel order
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
