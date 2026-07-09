import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconEdit, IconEye, IconPlus, IconTrash } from "../../components/Icons";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function SellerListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/sellers/dashboard")
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    await api.delete(`/products/${id}`);
    toast.success("Listing deleted");
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{products.length} total listings</p>}
        </div>
        <Link to="/seller/listings/add" className="btn-accent">
          <IconPlus size={16} /> Add Listing
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card divide-y divide-gray-50">
          {[1,2,3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="skeleton w-14 h-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-16 text-center text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <h3 className="font-bold text-gray-700 mb-1">No listings yet</h3>
          <p className="text-sm mb-5">Start selling by adding your first product.</p>
          <Link to="/seller/listings/add" className="btn-accent inline-flex">
            <IconPlus size={15} /> Add First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          {products.map((p) => (
            <div key={p.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <img src={p.images?.[0] || "https://placehold.co/60x48"} alt={p.title}
                className="w-14 h-11 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{p.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                  <span>ETB {Number(p.price).toLocaleString()}</span>
                  <span>·</span>
                  <span>{p.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><IconEye size={11} /> {p.views || 0} views</span>
                </div>
              </div>
              <span className={`badge ${p.is_approved ? "badge-green" : "badge-orange"} shrink-0`}>
                {p.is_approved ? "Live" : "Pending Approval"}
              </span>
              <div className="flex gap-1 shrink-0">
                <Link to={`/seller/listings/edit/${p.id}`}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Edit">
                  <IconEdit size={15} />
                </Link>
                <button onClick={() => deleteProduct(p.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete">
                  <IconTrash size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
