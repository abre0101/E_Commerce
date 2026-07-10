import { useState } from "react";
import { products as initialProducts } from "../../data/mockData";
import useAdminStore from "../../store/useAdminStore";

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem("yada_product_overrides") || "{}"); }
  catch { return {}; }
}
function saveOverrides(o) { localStorage.setItem("yada_product_overrides", JSON.stringify(o)); }

function Toggle({ on, onChange, disabled = false, color }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ background: on ? color : "#e2dde8" }}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

const catColor = cat => ({
  Bundles:   { bg: "rgba(22,163,74,0.1)", color: "#16a34a" },
  Wigs:      { bg: "rgba(22,163,74,0.12)",  color: "#16a34a" },
  Closures:  { bg: "rgba(96,165,250,0.12)",  color: "#3b82f6" },
}[cat] || { bg: "rgba(156,143,160,0.12)", color: "#6b7280" });

export default function AdminProducts() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";
  const [overrides, setOverrides] = useState(loadOverrides);
  const [search, setSearch] = useState("");

  const products = initialProducts
    .map(p => ({ ...p, ...(overrides[p.id] || {}) }))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id, field) => {
    const current = products.find(p => p.id === id);
    const updated = { ...overrides, [id]: { ...(overrides[id] || {}), [field]: !current[field] } };
    setOverrides(updated);
    saveOverrides(updated);
  };

  const inStockCount = products.filter(p => p.inStock).length;
  const featuredCount = products.filter(p => p.featured).length;

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-2xl font-bold" style={{ color: "#111827" }}>{initialProducts.length}</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#6b7280" }}>Total Products</p>
        </div>
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-2xl font-bold" style={{ color: "#059669" }}>{inStockCount}</p>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#6b7280" }}>In Stock</p>
        </div>
        {isAdmin && (
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{featuredCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#6b7280" }}>Featured</p>
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        {/* Toolbar */}
        <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: "#f3f4f6" }}>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-green-200 transition-all"
            style={{ borderColor: "#d1d5db", color: "#111827", maxWidth: 260 }}
          />
          {!isAdmin && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(96,165,250,0.12)", color: "#3b82f6" }}>
              Staff Access — stock toggle only
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Product</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Category</th>
              {isAdmin && <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Price</th>}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Rating</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>In Stock</th>
              {isAdmin && <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Featured</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const cc = catColor(p.category);
              return (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f3f4f6" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name}
                        className="w-11 h-13 object-cover object-top rounded-xl shrink-0"
                        style={{ width: 44, height: 52, borderRadius: 12 }} />
                      <div>
                        <p className="font-semibold" style={{ color: "#111827" }}>{p.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{p.lengths?.length} lengths</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={cc}>{p.category}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <p className="font-bold" style={{ color: "#16a34a" }}>ETB {p.price.toLocaleString()}</p>
                      {p.originalPrice && (
                        <p className="text-xs line-through" style={{ color: "#9ca3af" }}>ETB {p.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>⭐ {p.rating}</span>
                    <span className="text-xs ml-1" style={{ color: "#6b7280" }}>({p.reviewCount})</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Toggle on={p.inStock} color="#34d399" onChange={() => toggle(p.id, "inStock")} />
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-center">
                      <Toggle on={p.featured} color="#22c55e" onChange={() => toggle(p.id, "featured")} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "#6b7280" }}>No products match your search.</div>
        )}
        </div>
      </div>
    </div>
  );
}
