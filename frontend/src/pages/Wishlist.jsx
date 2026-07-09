import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconHeart } from "../components/Icons";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import ProductCard from "../components/ProductCard";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-4 w-2/5" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function Wishlist() {
  const { user, fetchMe } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    setLoading(true);
    await fetchMe();
    const ids = user?.wishlist || [];
    if (!ids.length) { setProducts([]); setLoading(false); return; }
    const results = await Promise.all(ids.map((id) => api.get(`/products/${id}`).then((r) => r.data).catch(() => null)));
    setProducts(results.filter(Boolean));
    setLoading(false);
  };

  useEffect(() => { loadWishlist(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <IconHeart size={20} className="text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist
          {!loading && products.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">({products.length} items)</span>
          )}
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <IconHeart size={32} className="text-red-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Save items you love and come back later.</p>
          <Link to="/products" className="btn-primary inline-flex py-3 px-8">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map((p) => <ProductCard key={p.id} product={p} onWishlistChange={loadWishlist} />)}
        </div>
      )}
    </div>
  );
}
