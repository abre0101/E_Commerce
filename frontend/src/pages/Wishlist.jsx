import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { products as allProducts } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import useAuthStore from "../store/useAuthStore";

const WL_KEY = (userId) => `yada_wishlist_${userId}`;

export function useWishlist() {
  const user = useAuthStore((s) => s.user);
  const key = user ? WL_KEY(user.id) : null;

  const [ids, setIds] = useState(() => {
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  });

  const toggle = (productId) => {
    if (!key) return;
    setIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const has = (productId) => ids.includes(productId);

  return { ids, toggle, has };
}

export default function Wishlist() {
  const user = useAuthStore((s) => s.user);
  const { ids, toggle } = useWishlist();

  const wishlistProducts = allProducts.filter((p) => ids.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="text-center px-5 py-20">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(239,68,68,0.1)" }}>
            <svg className="w-10 h-10" style={{ color: "#f87171" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#fff" }}>Your wishlist is empty</h2>
          <p className="text-sm mb-8" style={{ color: "#888" }}>Save items you love and come back later.</p>
          <Link to="/shop"
            className="inline-block px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
            style={{ background: "#C9A961", color: "#111" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto px-5 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>Account</p>
        <h1 className="font-serif text-3xl font-bold mb-8" style={{ color: "#fff" }}>
          Wishlist <span className="text-base font-normal" style={{ color: "#888" }}>({wishlistProducts.length})</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlistProducts.map((p) => (
            <div key={p.id} className="relative group">
              <ProductCard product={p} />
              <button
                onClick={() => toggle(p.id)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all z-10"
                style={{ background: "rgba(239,68,68,0.9)" }}
                title="Remove from wishlist"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
