import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IconCalendar, IconMapPin, IconPackage, IconStar } from "../components/Icons";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
    </div>
  );
}

export default function SellerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/sellers/${id}/profile`).then((r) => setData(r.data));
  }, [id]);

  if (!data) return <Spinner />;

  const { seller, products } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Seller header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center text-3xl font-black ring-4 ring-white shrink-0">
              {seller.name?.[0]?.toUpperCase()}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-gray-900">{seller.shop_name || seller.name}</h1>
              {seller.shop_description && (
                <p className="text-sm text-gray-500 mt-0.5 max-w-lg">{seller.shop_description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {seller.location && (
              <span className="flex items-center gap-1.5">
                <IconMapPin size={14} className="text-gray-400" /> {seller.location}
              </span>
            )}
            {seller.avg_rating > 0 && (
              <span className="flex items-center gap-1.5">
                <IconStar size={14} className="text-accent-400" />
                <span className="font-semibold text-gray-700">{seller.avg_rating}</span>
                <span>({seller.review_count} reviews)</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <IconCalendar size={14} className="text-gray-400" /> Since {new Date(seller.member_since).getFullYear()}
            </span>
            <span className="flex items-center gap-1.5">
              <IconPackage size={14} className="text-gray-400" /> {products.length} listings
            </span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="font-bold text-gray-900 text-base mb-4">Listings by this seller</h2>
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm">No products listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
