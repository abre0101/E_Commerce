import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useWishlist } from "../pages/Wishlist";

export default function ProductCard({ product }) {
  const user = useAuthStore((s) => s.user);
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <div className="group relative" style={{ background: "#1a1a1a" }}>
      <Link to={`/products/${product.id}`} className="block overflow-hidden transition-all duration-300 hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[3/4]" style={{ background: "#111" }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {product.originalPrice && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider"
              style={{ background: "#C9A961", color: "#111" }}>
              Sale
            </span>
          )}

          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="text-xs font-semibold text-center py-2"
              style={{ background: "rgba(201,169,97,0.9)", color: "#111" }}>
              View Details
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A961" }}>
            {product.category}
          </p>
          <p className="text-sm font-semibold leading-snug line-clamp-2 mb-3" style={{ color: "#fff" }}>
            {product.name}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold" style={{ color: "#fff" }}>
              ETB {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color: "#555" }}>
                ETB {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button — only shown when logged in */}
      {user && (
        <button
          onClick={() => toggle(product.id)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all"
          style={{
            background: wished ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.5)",
            opacity: wished ? 1 : 0,
          }}
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { if (!wished) e.currentTarget.style.opacity = "0"; }}
        >
          <svg className="w-4 h-4" fill={wished ? "white" : "none"} viewBox="0 0 24 24"
            stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
