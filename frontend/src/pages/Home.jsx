import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconShield, IconTrendingUp, IconZap } from "../components/Icons";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";

const FEATURES = [
  { icon: <IconZap size={18} />,         title: "Fast & Easy",     desc: "List your item in minutes",           color: "text-accent-500 bg-accent-50" },
  { icon: <IconShield size={18} />,      title: "Secure Payments", desc: "Multiple trusted methods",            color: "text-emerald-600 bg-emerald-50" },
  { icon: <IconTrendingUp size={18} />,  title: "Wide Reach",      desc: "Connect with buyers across Ethiopia", color: "text-blue-600 bg-blue-50" },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
        <div className="skeleton h-4 w-2/5" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  );
}

function FeaturedProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 transition-all duration-200 group"
    >
      <img
        src={product.images?.[0] || "https://placehold.co/56x56?text=+"}
        alt={product.title}
        className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-200"
      />
      <div className="min-w-0">
        <p className="text-white text-sm font-semibold truncate">{product.title}</p>
        <p className="text-gray-300 text-xs mt-0.5 truncate">{product.category}</p>
        <p className="text-accent-400 font-black text-sm mt-0.5">
          ETB {Number(product.price).toLocaleString()}
        </p>
      </div>
      <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center shrink-0 ml-auto group-hover:bg-accent-400 transition-colors">
        <IconArrowRight size={13} className="text-white" />
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/?limit=20&sort=created_at")
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 3);
  const heroProduct = products[0];

  return (
    <div>
      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)" }}
      >
        {/* Watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-black text-white/[0.04] leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
          >
            VIBEY
          </span>
        </div>

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)", transform: "translate(20%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", transform: "translate(-30%, 40%)" }} />

        <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

            {/* Left — copy */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                Ethiopia's #1 Online Marketplace
              </div>

              <h1 className="font-black text-white leading-[1.05] mb-5"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                Discover &amp; Buy<br />
                <span style={{
                  background: "linear-gradient(90deg, #fb923c, #f97316, #fdba74)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Anything
                </span>{" "}
                You Want
              </h1>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                Connect with thousands of sellers across Ethiopia. Electronics, fashion, handcrafts and more — all in one place.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/products"
                  className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all duration-150 active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #f97316, #ea6c0a)" }}>
                  Shop Now <IconArrowRight size={15} />
                </Link>
                <Link to="/register?role=seller"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl text-sm transition-all border border-white/20 backdrop-blur-sm">
                  Start Selling
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-6">
                {[
                  { value: "10K+", label: "Products" },
                  { value: "2K+",  label: "Sellers" },
                  { value: "50K+", label: "Buyers" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-white font-black text-xl leading-none">{s.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating hero product */}
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-sm lg:max-w-md">
                {/* Ring decoration */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-white/5" />
                  <div className="absolute w-56 h-56 lg:w-72 lg:h-72 rounded-full border border-white/5" />
                </div>

                {heroProduct ? (
                  <Link to={`/products/${heroProduct.id}`} className="block relative z-10">
                    <img
                      src={heroProduct.images?.[0] || "https://placehold.co/480x400?text=Featured"}
                      alt={heroProduct.title}
                      className="w-full max-h-80 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                      style={{ filter: "drop-shadow(0 30px 60px rgba(249,115,22,0.3))" }}
                    />
                  </Link>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center">
                    <span className="text-8xl opacity-20 select-none">🛍️</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured product cards */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pb-6">
              {featured.map((p) => (
                <FeaturedProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Features strip ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center sm:justify-start">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{f.title}</p>
                  <p className="text-[11px] text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main listings ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-5 items-start">
          <CategorySidebar />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900 text-base">Latest Listings</h2>
                <p className="text-xs text-gray-500 mt-0.5">Fresh products added daily</p>
              </div>
              <Link to="/products"
                className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-accent-600 font-semibold transition-colors">
                View all <IconArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-3">🛍️</p>
                <p className="font-medium text-gray-600 mb-1">No listings yet</p>
                <p className="text-sm mb-5">Be the first to sell something!</p>
                <Link to="/register?role=seller"
                  className="inline-flex items-center gap-2 bg-accent-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors">
                  Start Selling
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
