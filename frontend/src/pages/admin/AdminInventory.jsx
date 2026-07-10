import { useState } from "react";

const stockStatus = item => {
  if (item.stock === 0) return { label: "Out of Stock", bg: "rgba(107,96,112,0.15)", color: "#6b6070" };
  if (item.stock <= 2) return { label: "Critical", bg: "rgba(239,68,68,0.12)", color: "#dc2626" };
  if (item.stock <= item.reorderLevel) return { label: "Low Stock", bg: "rgba(251,191,36,0.15)", color: "#d97706" };
  return { label: "In Stock", bg: "rgba(52,211,153,0.15)", color: "#059669" };
};

export default function AdminInventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Raw Cambodian Body Wave", sku: "RAW-CB-BW", stock: 2, reorderLevel: 5, price: "ETB 5,200" },
    { id: 2, name: "Kinky Curly Premium", sku: "KIN-CUR-P", stock: 12, reorderLevel: 5, price: "ETB 4,800" },
    { id: 3, name: "Loose Deep Wave", sku: "LOO-DW", stock: 8, reorderLevel: 5, price: "ETB 4,500" },
    { id: 4, name: "Straight Human Hair", sku: "STR-HH", stock: 1, reorderLevel: 5, price: "ETB 5,500" },
    { id: 5, name: "Deep Hair Closure", sku: "DEEP-CL", stock: 0, reorderLevel: 3, price: "ETB 3,200" },
  ]);

  const [target, setTarget] = useState(null);
  const [qty, setQty] = useState("");

  const handleAdd = () => {
    if (!qty || isNaN(qty) || parseInt(qty) <= 0) return;
    setInventory(inv => inv.map(i => i.id === target.id ? { ...i, stock: i.stock + parseInt(qty) } : i));
    setTarget(null);
    setQty("");
  };

  const low = inventory.filter(i => i.stock <= i.reorderLevel).length;

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-purple-200";
  const inputStyle = { borderColor: "#e5e0eb", color: "#1a1825" };

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Products", value: inventory.length, color: "#a855f7", bg: "rgba(168,85,247,0.08)" },
          { label: "Low Stock", value: low, color: "#d97706", bg: "rgba(251,191,36,0.08)" },
          { label: "Catalog Value", value: "ETB 127,700", color: "#059669", bg: "rgba(52,211,153,0.08)" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#ede9f0" }}>
            <p className="text-2xl font-bold" style={{ color: "#1a1825" }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#9c8fa0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#ede9f0" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#f3f0f6" }}>
          <p className="font-bold" style={{ color: "#1a1825" }}>All Products</p>
          {low > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
              ⚠ {low} items need restocking
            </span>
          )}
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: "#faf8fc" }}>
            <tr>
              {["Product", "SKU", "Stock", "Price", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#9c8fa0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const s = stockStatus(item);
              return (
                <tr key={item.id} className="border-t hover:bg-purple-50/30 transition-colors" style={{ borderColor: "#f3f0f6" }}>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "#1a1825" }}>{item.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#9c8fa0" }}>{item.sku}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold" style={{ color: "#1a1825" }}>{item.stock}</span>
                    <span className="text-xs ml-1.5" style={{ color: "#9c8fa0" }}>/ min {item.reorderLevel}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "#a855f7" }}>{item.price}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setTarget(item); setQty(""); }}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#34d399,#10b981)" }}>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#f3f0f6" }}>
              <p className="font-bold text-lg" style={{ color: "#1a1825" }}>Add Stock</p>
              <button onClick={() => setTarget(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg font-bold" style={{ color: "#9c8fa0" }}>×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9c8fa0" }}>Product</p>
                <p className="font-semibold" style={{ color: "#1a1825" }}>{target.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9c8fa0" }}>Current Stock</p>
                <p className="font-semibold" style={{ color: "#1a1825" }}>{target.stock} units</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: "#9c8fa0" }}>Quantity to Add</label>
                <input type="number" placeholder="e.g. 10" value={qty} onChange={e => setQty(e.target.value)}
                  className={inputCls} style={inputStyle} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg,#34d399,#10b981)" }}>Confirm</button>
                <button onClick={() => setTarget(null)} className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
