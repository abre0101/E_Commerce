import { useState, useRef } from "react";
import useAdminStore from "../../store/useAdminStore";
import useProductStore from "../../store/useProductStore";

const GOLD = "#C9A961";
const inputCls = "w-full px-4 py-3 text-sm border outline-none transition";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

function Toggle({ on, onChange, disabled = false }) {
  return (
    <button onClick={disabled ? undefined : onChange} disabled={disabled}
      className={`relative w-11 h-6 transition-all duration-200 ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ background: on ? GOLD : "#333" }}>
      <span className={`absolute top-1 w-4 h-4 bg-black transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

const CATEGORIES = ["Bundles", "Wigs", "Closures", "Other"];
const EMPTY_FORM = { name: "", category: "Bundles", price: "", originalPrice: "", description: "", lengths: "", inStock: true, featured: false, rating: "4.8", reviewCount: "0", imagePreview: "", imageFile: null };

function ProductModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = f => e => setForm(s => ({ ...s, [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(s => ({ ...s, imagePreview: ev.target.result, imageFile: file }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.price || isNaN(Number(form.price))) return setError("Enter a valid price.");
    if (!form.imagePreview) return setError("Please upload a product image.");
    setError("");
    onSave({ ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, rating: Number(form.rating) || 0, reviewCount: Number(form.reviewCount) || 0, lengths: form.lengths ? form.lengths.split(",").map(l => l.trim()).filter(Boolean) : [], images: [form.imagePreview] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto" style={{ background: "#111", border: "1px solid rgba(201,169,97,0.2)" }}>
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <h2 className="font-serif font-bold text-lg" style={{ color: "#fff" }}>{initial ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} style={{ color: "#888" }} className="text-xl font-bold hover:text-white transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {error && <p className="text-xs px-4 py-2.5" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}

          {/* Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Product Image *</label>
            <div onClick={() => fileRef.current.click()}
              className="relative border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
              style={{ borderColor: form.imagePreview ? GOLD : "#333", height: 180, background: "#0d0d0d" }}
              onMouseEnter={e => { if (!form.imagePreview) e.currentTarget.style.borderColor = GOLD; }}
              onMouseLeave={e => { if (!form.imagePreview) e.currentTarget.style.borderColor = "#333"; }}>
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="text-center">
                  <p className="text-3xl mb-1">📷</p>
                  <p className="text-xs font-semibold" style={{ color: "#888" }}>Click to upload image</p>
                </div>
              )}
              {form.imagePreview && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-all flex items-center justify-center">
                  <p className="text-xs font-semibold" style={{ color: "#fff" }}>Change Image</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Product Name *</label>
            <input type="text" className={inputCls} style={inputStyle} placeholder="e.g. Raw Cambodian Body Wave"
              value={form.name} onChange={set("name")} onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Category *</label>
              <select className={inputCls} style={{ ...inputStyle, background: "#111" }} value={form.category} onChange={set("category")}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Price (ETB) *</label>
              <input type="number" min="0" className={inputCls} style={inputStyle} placeholder="e.g. 4500"
                value={form.price} onChange={set("price")} onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Original Price (ETB)</label>
              <input type="number" min="0" className={inputCls} style={inputStyle} placeholder="Leave blank if no discount"
                value={form.originalPrice} onChange={set("originalPrice")} onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Available Lengths</label>
              <input type="text" className={inputCls} style={inputStyle} placeholder='e.g. 12", 14", 16"'
                value={form.lengths} onChange={set("lengths")} onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#888" }}>Description</label>
            <textarea rows={3} className={`${inputCls} resize-none`} style={inputStyle} placeholder="Product details…"
              value={form.description} onChange={set("description")} onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <Toggle on={form.inStock} onChange={() => setForm(s => ({ ...s, inStock: !s.inStock }))} />
              <span className="text-sm font-semibold" style={{ color: "#ccc" }}>In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Toggle on={form.featured} onChange={() => setForm(s => ({ ...s, featured: !s.featured }))} />
              <span className="text-sm font-semibold" style={{ color: "#ccc" }}>Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold border transition-all"
              style={{ borderColor: "#333", color: "#888", background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#ccc"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#888"; }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ background: GOLD, color: "#111" }}>
              {initial ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ product, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <div className="w-full max-w-sm p-8 text-center" style={{ background: "#111", border: "1px solid rgba(239,68,68,0.2)" }}>
        <p className="text-3xl mb-4">🗑️</p>
        <h3 className="font-bold text-lg mb-2" style={{ color: "#fff" }}>Delete Product?</h3>
        <p className="text-sm mb-6" style={{ color: "#888" }}>
          "<span className="font-semibold" style={{ color: "#fff" }}>{product.name}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold border transition-all"
            style={{ borderColor: "#333", color: "#888" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "#dc2626", color: "#fff" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { session } = useAdminStore();
  const isAdmin = session?.role === "admin";
  const {
    getProducts, toggleField, addProduct, editProduct, deleteProduct,
  } = useProductStore();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const allProducts = getProducts();
  const visible = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id, field) => toggleField(id, field);

  const handleAdd = data => {
    addProduct(data);
    setModal(null);
  };

  const handleEdit = data => {
    const id = modal.product.id;
    const isCustom = !!modal.product._custom;
    editProduct(id, data, isCustom);
    setModal(null);
  };

  const handleDelete = () => {
    const id = modal.product.id;
    const isCustom = !!modal.product._custom;
    deleteProduct(id, isCustom);
    setModal(null);
  };

  const openEdit = product => setModal({
    type: "edit", product,
    initial: {
      name: product.name, category: product.category, price: product.price,
      originalPrice: product.originalPrice || "", description: product.description || "",
      lengths: (product.lengths || []).join(", "), inStock: product.inStock,
      featured: product.featured, rating: product.rating, reviewCount: product.reviewCount,
      imagePreview: product.images?.[0] || "", imageFile: null,
    },
  });

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: visible.length, color: "#fff" },
          { label: "In Stock",       value: visible.filter(p => p.inStock).length, color: GOLD },
          isAdmin && { label: "Featured", value: visible.filter(p => p.featured).length, color: GOLD },
        ].filter(Boolean).map(s => (
          <div key={s.label} className="p-5 border" style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border overflow-hidden" style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}>
        <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
          <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 text-sm border outline-none transition"
            style={{ borderColor: "#333", color: "#fff", background: "transparent", maxWidth: 260 }}
            onFocus={e => { e.currentTarget.style.borderColor = GOLD; }} onBlur={e => { e.currentTarget.style.borderColor = "#333"; }} />
          {isAdmin ? (
            <button onClick={() => setModal({ type: "add" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ background: GOLD, color: "#111" }}>
              + Add Product
            </button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5"
              style={{ background: "rgba(201,169,97,0.1)", color: GOLD, border: "1px solid rgba(201,169,97,0.2)" }}>
              Staff — stock toggle only
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#0d0d0d" }}>
              <tr>
                {["Product", "Category", isAdmin && "Price", "Rating", "In Stock", isAdmin && "Featured", isAdmin && "Actions"].filter(Boolean).map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p.id} className="border-t transition-colors" style={{ borderColor: "#1a1a1a" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.name} className="object-cover object-top shrink-0" style={{ width: 44, height: 52 }} />
                      <div>
                        <p className="font-semibold" style={{ color: "#fff" }}>{p.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#888" }}>{p.lengths?.length} lengths</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(201,169,97,0.1)", color: GOLD }}>{p.category}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <p className="font-bold" style={{ color: GOLD }}>ETB {p.price.toLocaleString()}</p>
                      {p.originalPrice && <p className="text-xs line-through" style={{ color: "#666" }}>ETB {p.originalPrice.toLocaleString()}</p>}
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: GOLD }}>⭐ {p.rating}</span>
                    <span className="text-xs ml-1" style={{ color: "#888" }}>({p.reviewCount})</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Toggle on={p.inStock} onChange={() => toggle(p.id, "inStock")} />
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-center">
                      <Toggle on={p.featured} onChange={() => toggle(p.id, "featured")} />
                    </td>
                  )}
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="px-3 py-1.5 text-xs font-semibold border transition-all"
                          style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD, background: "transparent" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                          Edit
                        </button>
                        <button onClick={() => setModal({ type: "delete", product: p })}
                          className="px-3 py-1.5 text-xs font-semibold transition-all"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="py-12 text-center text-sm" style={{ color: "#888" }}>
              {search ? "No products match your search." : "No products yet."}
            </div>
          )}
        </div>
      </div>

      {modal?.type === "add"    && <ProductModal onSave={handleAdd}  onClose={() => setModal(null)} />}
      {modal?.type === "edit"   && <ProductModal initial={modal.initial} onSave={handleEdit} onClose={() => setModal(null)} />}
      {modal?.type === "delete" && <DeleteModal product={modal.product} onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </div>
  );
}
