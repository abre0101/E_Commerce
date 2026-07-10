import { useState, useRef } from "react";
import { products as seedProducts } from "../../data/mockData";
import useAdminStore from "../../store/useAdminStore";

// ── persistence helpers ─────────────────────────────────────────────────────
const LS_KEY = "yada_custom_products";
const OV_KEY = "yada_product_overrides";

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveCustom(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(OV_KEY) || "{}"); } catch { return {}; }
}
function saveOverrides(o) { localStorage.setItem(OV_KEY, JSON.stringify(o)); }

// ── small components ────────────────────────────────────────────────────────
function Toggle({ on, onChange, disabled = false, color = "#34d399" }) {
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

const CATEGORIES = ["Bundles", "Wigs", "Closures", "Other"];
const catColor = (cat) => ({
  Bundles:  { bg: "rgba(22,163,74,0.1)",   color: "#16a34a" },
  Wigs:     { bg: "rgba(22,163,74,0.12)",  color: "#16a34a" },
  Closures: { bg: "rgba(96,165,250,0.12)", color: "#3b82f6" },
}[cat] || { bg: "rgba(156,143,160,0.12)", color: "#6b7280" });

const EMPTY_FORM = {
  name: "", category: "Bundles", price: "", originalPrice: "",
  description: "", lengths: "", inStock: true, featured: false,
  rating: "4.8", reviewCount: "0", imagePreview: "", imageFile: null,
};

// ── product form modal ──────────────────────────────────────────────────────
function ProductModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((s) => ({ ...s, imagePreview: ev.target.result, imageFile: file }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.price || isNaN(Number(form.price))) return setError("Enter a valid price.");
    if (!form.imagePreview) return setError("Please upload a product image.");
    setError("");
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
      lengths: form.lengths ? form.lengths.split(",").map((l) => l.trim()).filter(Boolean) : [],
      images: [form.imagePreview],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "#f3f4f6" }}>
          <h2 className="font-bold text-lg" style={{ color: "#111827" }}>
            {initial ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {error && (
            <p className="text-xs font-semibold px-4 py-2.5 rounded-xl" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</p>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Product Image *</label>
            <div
              onClick={() => fileRef.current.click()}
              className="relative border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors overflow-hidden"
              style={{ borderColor: form.imagePreview ? "#8B4F6D" : "#d1d5db", height: 180, background: "#fafafa" }}
            >
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="text-center">
                  <p className="text-3xl mb-1">📷</p>
                  <p className="text-xs font-semibold" style={{ color: "#6b7280" }}>Click to upload image</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>JPG, PNG, AVIF, WEBP</p>
                </div>
              )}
              {form.imagePreview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center">
                  <p className="text-white text-xs font-semibold">Change Image</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Product Name *</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
              style={{ borderColor: "#d1d5db" }} placeholder="e.g. Raw Cambodian Body Wave"
              value={form.name} onChange={set("name")} />
          </div>

          {/* Category + Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Category *</label>
              <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: "#d1d5db" }} value={form.category} onChange={set("category")}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Price (ETB) *</label>
              <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: "#d1d5db" }} placeholder="e.g. 4500"
                value={form.price} onChange={set("price")} />
            </div>
          </div>

          {/* Original price + lengths */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Original Price (ETB)</label>
              <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: "#d1d5db" }} placeholder="Leave blank if no discount"
                value={form.originalPrice} onChange={set("originalPrice")} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Available Lengths</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: "#d1d5db" }} placeholder='e.g. 12", 14", 16"'
                value={form.lengths} onChange={set("lengths")} />
            </div>
          </div>

          {/* Rating + reviews */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Rating (0–5)</label>
              <input type="number" min="0" max="5" step="0.1" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: "#d1d5db" }} value={form.rating} onChange={set("rating")} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Review Count</label>
              <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
                style={{ borderColor: "#d1d5db" }} value={form.reviewCount} onChange={set("reviewCount")} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b7280" }}>Description</label>
            <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all resize-none"
              style={{ borderColor: "#d1d5db" }} placeholder="Product details, texture, care instructions…"
              value={form.description} onChange={set("description")} />
          </div>

          {/* Toggles */}
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="hidden" checked={form.inStock} onChange={set("inStock")} />
              <Toggle on={form.inStock} onChange={() => setForm((s) => ({ ...s, inStock: !s.inStock }))} color="#34d399" />
              <span className="text-sm font-semibold" style={{ color: "#111827" }}>In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="hidden" checked={form.featured} onChange={set("featured")} />
              <Toggle on={form.featured} onChange={() => setForm((s) => ({ ...s, featured: !s.featured }))} color="#22c55e" />
              <span className="text-sm font-semibold" style={{ color: "#111827" }}>Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: "#d1d5db", color: "#6b7280" }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#8B4F6D" }}>
              {initial ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── delete confirm modal ────────────────────────────────────────────────────
function DeleteModal({ product, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fef2f2" }}>
          <span className="text-2xl">🗑️</span>
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: "#111827" }}>Delete Product?</h3>
        <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
          "<span className="font-semibold">{product.name}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold border hover:bg-gray-50 transition-all"
            style={{ borderColor: "#d1d5db", color: "#6b7280" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#dc2626" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main page ───────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";

  const [overrides, setOverrides] = useState(loadOverrides);
  const [custom, setCustom] = useState(loadCustom);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { type: "add" | "edit" | "delete", product? }

  // Merge seed + custom, apply overrides
  const allProducts = [...seedProducts, ...custom]
    .map((p) => ({ ...p, ...(overrides[p.id] || {}) }))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id, field) => {
    const current = allProducts.find((p) => p.id === id);
    const updated = { ...overrides, [id]: { ...(overrides[id] || {}), [field]: !current[field] } };
    setOverrides(updated);
    saveOverrides(updated);
  };

  const handleAdd = (data) => {
    const newProduct = { ...data, id: `custom_${Date.now()}`, _custom: true };
    const updated = [...custom, newProduct];
    setCustom(updated);
    saveCustom(updated);
    setModal(null);
  };

  const handleEdit = (data) => {
    const id = modal.product.id;
    const isCustom = modal.product._custom;
    if (isCustom) {
      const updated = custom.map((p) => (p.id === id ? { ...p, ...data } : p));
      setCustom(updated);
      saveCustom(updated);
    } else {
      // For seed products, save all editable fields as overrides
      const updated = { ...overrides, [id]: { ...data, id } };
      setOverrides(updated);
      saveOverrides(updated);
    }
    setModal(null);
  };

  const handleDelete = () => {
    const id = modal.product.id;
    const isCustom = modal.product._custom;
    if (isCustom) {
      const updated = custom.filter((p) => p.id !== id);
      setCustom(updated);
      saveCustom(updated);
    } else {
      // Mark seed product as deleted via overrides
      const updated = { ...overrides, [id]: { ...(overrides[id] || {}), _deleted: true } };
      setOverrides(updated);
      saveOverrides(updated);
    }
    setModal(null);
  };

  const openEdit = (product) => {
    setModal({
      type: "edit",
      product,
      initial: {
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || "",
        description: product.description || "",
        lengths: (product.lengths || []).join(", "),
        inStock: product.inStock,
        featured: product.featured,
        rating: product.rating,
        reviewCount: product.reviewCount,
        imagePreview: product.images?.[0] || "",
        imageFile: null,
      },
    });
  };

  const visible = allProducts.filter((p) => !overrides[p.id]?._deleted);
  const inStockCount = visible.filter((p) => p.inStock).length;
  const featuredCount = visible.filter((p) => p.featured).length;

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-2xl font-bold" style={{ color: "#111827" }}>{visible.length}</p>
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
            type="text" placeholder="Search products…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            style={{ borderColor: "#d1d5db", color: "#111827", maxWidth: 260 }}
          />
          {isAdmin && (
            <button
              onClick={() => setModal({ type: "add" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#8B4F6D" }}>
              <span className="text-base leading-none">+</span> Add Product
            </button>
          )}
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
                {isAdmin && <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const cc = catColor(p.category);
                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f3f4f6" }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name}
                          className="object-cover object-top rounded-xl shrink-0"
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
                    {isAdmin && (
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                            style={{ background: "rgba(139,79,109,0.1)", color: "#8B4F6D" }}>
                            Edit
                          </button>
                          <button onClick={() => setModal({ type: "delete", product: p })}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                            style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 && (
            <div className="py-12 text-center text-sm" style={{ color: "#6b7280" }}>
              {search ? "No products match your search." : "No products yet. Add your first product!"}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <ProductModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (
        <ProductModal initial={modal.initial} onSave={handleEdit} onClose={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal product={modal.product} onConfirm={handleDelete} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
