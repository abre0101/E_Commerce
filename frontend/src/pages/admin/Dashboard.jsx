import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconAlert, IconArrowRight, IconPackage, IconShoppingBag, IconUser, IconUsers } from "../../components/Icons";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
    </div>
  );

  const cards = [
    { label: "Total Users",      value: stats.total_users,     icon: <IconUsers size={22} />,      color: "text-purple-600 bg-purple-50",  link: "/admin/users" },
    { label: "Sellers",          value: stats.total_sellers,   icon: <IconUsers size={22} />,      color: "text-blue-600 bg-blue-50",      link: "/admin/users" },
    { label: "Live Products",    value: stats.total_products,  icon: <IconPackage size={22} />,    color: "text-emerald-600 bg-emerald-50", link: "/admin/products" },
    { label: "Pending Approval", value: stats.pending_products, icon: <IconAlert size={22} />, color: "text-orange-600 bg-orange-50", link: "/admin/products" },
    { label: "Total Orders",     value: stats.total_orders,    icon: <IconShoppingBag size={22} />, color: "text-pink-600 bg-pink-50",     link: "#" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform overview and management</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link to={c.link} key={c.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${c.color}`}>
              {c.icon}
            </div>
            <p className="text-2xl font-black text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/products"
          className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <IconAlert size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Review Products</p>
              <p className="text-xs text-gray-500">{stats.pending_products} pending approval</p>
            </div>
          </div>
          <IconArrowRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
        </Link>

        <Link to="/admin/users"
          className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <IconUsers size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500">{stats.total_users} total users</p>
            </div>
          </div>
          <IconArrowRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
