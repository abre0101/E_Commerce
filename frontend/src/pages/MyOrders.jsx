import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconPackage } from "../components/Icons";
import api from "../services/api";

const STATUS_STYLES = {
  pending:   "badge-orange",
  confirmed: "badge-purple",
  shipped:   "badge-blue",
  delivered: "badge-green",
  cancelled: "badge-red",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {[1,2,3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton h-5 w-32 rounded" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );

  if (!orders.length) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
        <IconPackage size={32} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
      <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here.</p>
      <Link to="/products" className="btn-primary inline-flex py-3 px-8">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        My Orders
        <span className="text-sm font-normal text-gray-500 ml-2">({orders.length})</span>
      </h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-5">
            {/* Order header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-800 text-sm">#{o.id.slice(-8).toUpperCase()}</span>
              <span className={`badge ${STATUS_STYLES[o.status] || "badge-gray"}`}>{o.status}</span>
              <span className="ml-auto text-xs text-gray-400">
                {new Date(o.created_at?.$date || o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2.5 mb-4">
              {o.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image || "https://placehold.co/40x40"} alt={item.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  <span className="flex-1 text-sm font-medium text-gray-700">{item.title}</span>
                  <span className="text-xs text-gray-400">× {item.qty}</span>
                  <span className="font-bold text-sm text-gray-900 shrink-0">
                    ETB {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Payment: <span className="font-semibold text-gray-700">{o.payment_method?.replace(/_/g, " ")}</span>
              </span>
              <span className="font-black text-accent-500 text-base">
                ETB {Number(o.total).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
