import { useState } from "react";
import { products as initialProducts } from "../../data/mockData";
import useAdminStore from "../../store/useAdminStore";

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem("yada_product_overrides") || "{}"); }
  catch { return {}; }
}
function saveOverrides(o) { localStorage.setItem("yada_product_overrides", JSON.stringify(o)); }

function Toggle({ on, onChange, color = "#22c55e", disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ background: on ? color : "#e5e7eb" }}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function AdminProducts() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";
  const [overrides, setOverrides] = useState(loadOverrides);

  const products = initialProducts.map((p) => ({ ...p, ...(overrides[p.id] || {}) }));

  const toggle = (id, field) => {
    const current = products.find((p) => p.id === id);
    const updated = { ...overrides, [id]: { ...(overrides[id] || {}), [field]: !current[field] } };
    setOverrides(updated);
    saveOverrides(updated);
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-400 text-sm mt-1">
            {isAdmin ? "Full control — toggle stock and featured status." : "Staff view — stock toggle only."}
          </p>
        </div>
        {!isAdmin && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>
            Staff Access
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: "#faf7f2" }}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Category</th>
              {isAdmin && <th className="px-6 py-4 text-right text-xs font-semibold text-stone-400 uppercase tracking-wider">Price</th>}
              <th className="px-6 py-4 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">In Stock</th>
              {isAdmin && <th className="px-6 py-4 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">Featured</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={p.images[0]} alt={p.name}
                      className="w-12 h-14 object-cover object-top rounded-xl shrink-0 shadow-sm" />
                    <div>
                      <p className="font-semibold text-stone-800">{p.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{p.lengths?.length} lengths available</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#faf7f2", color: "#7d6040" }}>
                    {p.category}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right font-bold text-stone-800">
                    ETB {p.price.toLocaleString()}
                    {p.originalPrice && (
                      <p className="text-xs text-stone-300 line-through font-normal">ETB {p.originalPrice.toLocaleString()}</p>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 text-center">
                  <Toggle on={p.inStock} color="#22c55e" onChange={() => toggle(p.id, "inStock")} />
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <Toggle on={p.featured} color="#d4952a" onChange={() => toggle(p.id, "featured")} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
