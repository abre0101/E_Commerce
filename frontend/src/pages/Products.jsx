import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { IconChevronDown, IconFilter, IconSearch, IconX, IconCheck } from "../components/Icons";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";

const SORT_OPTIONS = [
  { value: "created_at", label: "Newest first",        icon: "🕐" },
  { value: "views",      label: "Most popular",         icon: "🔥" },
  { value: "price_asc",  label: "Price: Low to High",   icon: "↑" },
  { value: "price_desc", label: "Price: High to Low",   icon: "↓" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative ml-auto" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
          open ? "border-[#1a1a2e] bg-[#1a1a2e] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
        }`}
      >
        <span>{active.icon}</span>
        <span>{active.label}</span>
        <IconChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-modal border border-gray-100 overflow-hidden z-30 animate-scale-in">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort by</p>
          </div>
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                value === o.value
                  ? "bg-[#1a1a2e] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-base w-5 text-center">{o.icon}</span>
              <span className="flex-1 text-left font-medium">{o.label}</span>
              {value === o.value && <IconCheck size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const page      = parseInt(params.get("page") || "1");
  const q         = params.get("q") || "";
  const category  = params.get("category") || "";
  const condition = params.get("condition") || "";
  const sort      = params.get("sort") || "created_at";
  const minPrice  = params.get("min_price") || "";
  const maxPrice  = params.get("max_price") || "";

  useEffect(() => {
    setLoading(true);
    const endpoint = q ? "/products/search" : "/products/";
    const p = {
      page, sort,
      ...(q && { q }), ...(category && { category }),
      ...(condition && { condition }),
      ...(minPrice && { min_price: minPrice }),
      ...(maxPrice && { max_price: maxPrice }),
    };
    api.get(endpoint, { params: p })
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total || 0); setPages(r.data.pages || 1); })
      .finally(() => setLoading(false));
  }, [params]);

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    next.delete("page");
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search context banner */}
      {q && (
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 mb-4 shadow-card">
          <IconSearch size={15} className="text-gray-400" />
          <p className="text-sm text-gray-600">
            Results for <span className="font-semibold text-gray-900">"{q}"</span>
          </p>
          <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full ml-1">
            {total} found
          </span>
          <button onClick={() => setParams({})} className="ml-auto text-gray-400 hover:text-gray-600 p-1">
            <IconX size={15} />
          </button>
        </div>
      )}

      <div className="flex gap-5 items-start">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <CategorySidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {filterOpen && (
          <div className="IconXed inset-0 z-50 flex md:hidden">
            <div className="bg-white w-64 h-full overflow-y-auto shadow-modal">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold">Categories</span>
                <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <IconX size={20} />
                </button>
              </div>
              <CategorySidebar />
            </div>
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 flex-wrap bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-card">
            <button onClick={() => setFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors">
              <IconFilter size={14} /> Filters
            </button>

            {/* Condition pills */}
            <div className="flex gap-1.5">
              {["", "new", "used"].map((c) => (
                <button key={c} onClick={() => set("condition", c)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    condition === c
                      ? "bg-[#1a1a2e] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  {c === "" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-gray-200 hidden sm:block" />

            {/* Price range */}
            <div className="flex items-center gap-1.5">
              <input type="number" placeholder="Min ETB" value={minPrice}
                onChange={(e) => set("min_price", e.target.value)}
                className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-gray-400 transition-colors" />
              <span className="text-gray-400 text-xs">—</span>
              <input type="number" placeholder="Max ETB" value={maxPrice}
                onChange={(e) => set("max_price", e.target.value)}
                className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-gray-400 transition-colors" />
            </div>

            {/* Sort */}
            <SortDropdown value={sort} onChange={(v) => set("sort", v)} />

            <span className="text-xs text-gray-400 font-medium">{total} items</span>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-medium text-gray-600 mb-1">No listings found</p>
              <p className="text-sm mb-4">Try adjusting your filters</p>
              <button onClick={() => setParams({})}
                className="inline-flex items-center gap-1.5 text-accent-500 hover:text-accent-600 text-sm font-semibold border border-accent-200 px-4 py-2 rounded-xl hover:bg-accent-50 transition-colors">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => set("page", n)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                    n === page
                      ? "bg-[#1a1a2e] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
