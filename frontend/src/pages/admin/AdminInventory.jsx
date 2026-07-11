import { useState } from "react";
import useProductStore from "../../store/useProductStore";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const inputCls = "w-full px-3 py-2.5 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

const stockStatus = (stock, reorderLevel) => {
  if (stock === 0)              return { label: "Out of Stock", bg: "rgba(255,255,255,0.06)", color: "#888" };
  if (stock <= 2)               return { label: "Critical",     bg: "rgba(239,68,68,0.12)",   color: "#f87171" };
  if (stock <= reorderLevel)    return { label: "Low Stock",    bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" };
  return                               { label: "In Stock",     bg: "rgba(201,169,97,0.15)",  color: GOLD };
};

const REORDER_LEVEL = 5;

export default function AdminInventory() {
  const { getProducts, getStock, addStock } = useProductStore();
  const products = getProducts();

  const [target, setTarget] = useState(null);
  const [qty, setQty] = useState("");

  const rows = products.map(p => ({
    id: p.id,
    name: p.name,
    sku: String(p.id).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8),
    stock: getStock(p.id),
    reorderLevel: REORDER_LEVEL,
    price: `ETB ${p.price.toLocaleString()}`,
  }));

  const low = rows.filter(r => r.stock <= r.reorderLevel).length;
  const catalogValue = rows.reduce((sum, r) => {
    const p = products.find(x => x.id === r.id);
    return sum + (p ? p.price * r.stock : 0);
  }, 0);

  const handleAdd = () => {
    const n = parseInt(qty);
    if (!qty || isNaN(n) || n <= 0) return;
    addStock(target.id, n);
    setTarget(null);
    setQty("");
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Products",      value: rows.length },
          { label: "Low Stock",     value: low },
          { label: "Catalog Value", value: `ETB ${catalogValue.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="p-5 border" style={CARD}>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border overflow-hidden" style={CARD}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <p className="font-bold" style={{ color: "#fff" }}>All Products</p>
          {low > 0 && (
            <span className="px-3 py-1 text-xs font-semibold" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              ⚠ {low} items need restocking
            </span>
          )}
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: "#0d0d0d" }}>
            <tr>
              {["Product", "SKU", "Stock", "Price", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(item => {
              const s = stockStatus(item.stock, item.reorderLevel);
              return (
                <tr key={item.id} className="border-t transition-colors" style={{ borderColor: "#1a1a1a" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "#fff" }}>{item.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#888" }}>{item.sku}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold" style={{ color: "#fff" }}>{item.stock}</span>
                    <span className="text-xs ml-1.5" style={{ color: "#666" }}>/ min {item.reorderLevel}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: GOLD }}>{item.price}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 text-xs font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setTarget(item); setQty(""); }}
                      className="px-4 py-1.5 text-xs font-semibold border transition-all"
                      style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      Add Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add stock modal */}
      {target && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-sm" style={{ background: "#111", border: "1px solid rgba(201,169,97,0.2)" }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
              <p className="font-serif font-bold text-lg" style={{ color: "#fff" }}>Add Stock</p>
              <button onClick={() => setTarget(null)} className="text-xl font-bold" style={{ color: "#888" }}>×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Product</p>
                <p className="font-semibold" style={{ color: "#fff" }}>{target.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>Current Stock</p>
                <p className="font-semibold" style={{ color: "#fff" }}>{target.stock} units</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: GOLD }}>Quantity to Add</label>
                <input type="number" placeholder="e.g. 10" value={qty} onChange={e => setQty(e.target.value)}
                  className={inputCls} style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd}
                  className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                  style={{ background: GOLD, color: "#111" }}>
                  Confirm
                </button>
                <button onClick={() => setTarget(null)}
                  className="flex-1 py-2.5 text-sm font-semibold border transition-all"
                  style={{ borderColor: "#333", color: "#888" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
