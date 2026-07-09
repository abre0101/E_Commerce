import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconDollar, IconEdit, IconEye, IconPackage, IconPlus, IconShoppingBag } from "../../components/Icons";
import api from "../../services/api";

const STATUS_STYLES = {
  pending:   "badge-orange",
  confirmed: "badge-purple",
  delivered: "badge-green",
  cancelled: "badge-red",
  shipped:   "badge-blue",
};

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
    </div>
  );
}

export default function SellerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/sellers/dashboard").then((r) => setData(r.data));
  }, []);

  if (!data) return <Spinner />;

  const stats = [
    { label: "Products",       value: data.stats.total_products,              icon: <IconPackage size={20} />,    color: "text-purple-600 bg-purple-50" },
    { label: "Orders",         value: data.stats.total_orders,                icon: <IconShoppingBag size={20} />, color: "text-blue-600 bg-blue-50" },
    { label: "Revenue (ETB)",  value: data.stats.total_revenue.toLocaleString(), icon: <IconDollar size={20} />, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Views",    value: data.stats.total_views,                 icon: <IconEye size={20} />,         color: "text-accent-600 bg-accent-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/seller/listings/add" className="btn-accent">
          <IconPlus size={16} /> Add Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings panel */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">My Listings</h2>
            <Link to="/seller/listings" className="text-sm text-accent-500 hover:text-accent-600 font-semibold flex items-center gap-1">
              View all <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            {data.products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <img src={p.images?.[0] || "https://placehold.co/48x40"} alt={p.title}
                  className="w-12 h-10 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">ETB {Number(p.price).toLocaleString()}</p>
                </div>
                <span className={`badge ${p.is_approved ? "badge-green" : "badge-orange"} shrink-0`}>
                  {p.is_approved ? "Live" : "Pending"}
                </span>
                <Link to={`/seller/listings/edit/${p.id}`}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                  <IconEdit size={14} />
                </Link>
              </div>
            ))}
            {!data.products.length && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📦</p>
                <p className="text-sm mb-3">No listings yet</p>
                <Link to="/seller/listings/add" className="btn-accent text-xs py-2 px-4">Add First Listing</Link>
              </div>
            )}
          </div>
        </div>

        {/* Orders panel */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to="/seller/orders" className="text-sm text-accent-500 hover:text-accent-600 font-semibold flex items-center gap-1">
              View all <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            {data.recent_orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">#{o.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">ETB {Number(o.total).toLocaleString()}</p>
                </div>
                <span className={`badge ${STATUS_STYLES[o.status] || "badge-gray"}`}>{o.status}</span>
              </div>
            ))}
            {!data.recent_orders.length && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
