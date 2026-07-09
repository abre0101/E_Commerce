import { Link } from "react-router-dom";
import { IconHeart, IconMapPin } from "./Icons";
import useAuthStore from "../store/useAuthStore";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ProductCard({ product, onWishlistChange }) {
  const { user } = useAuthStore();
  const inWishlist = user?.wishlist?.includes(product.id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Login to save items"); return; }
    try {
      await api.post(`/auth/wishlist/${product.id}`);
      if (onWishlistChange) onWishlistChange();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || "https://placehold.co/300x225?text=No+Image"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-150 active:scale-90
            ${inWishlist ? "bg-red-500 text-white" : "bg-white/90 hover:bg-white text-gray-500 hover:text-red-400"}`}
          aria-label={inWishlist ? "Remove from wishlist" : "Save"}
        >
          {inWishlist ? <IconHeart filled size={13} /> : <IconHeart size={13} />}
        </button>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.condition === "new" && (
            <span className="badge-green text-[10px] px-2 py-0.5">NEW</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 min-h-[40px] mb-auto">
          {product.title}
        </p>
        <div className="mt-2">
          <p className="text-base font-bold text-gray-900">
            <span className="text-xs font-semibold text-gray-400 mr-0.5">ETB</span>
            {Number(product.price).toLocaleString()}
          </p>
          <span className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
            <IconMapPin size={11} />
            <span className="truncate">{product.location || "Addis Ababa"}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
