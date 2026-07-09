import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconArrowLeft, IconPlus, IconX } from "../../components/Icons";
import toast from "react-hot-toast";
import api from "../../services/api";

const CATEGORIES = [
  "Electronics", "Fashion", "Health And Beauty", "Car", "House",
  "Furniture", "Commercial equipment and tools", "General",
  "Art And Craft", "Services", "Food And Beverages",
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "",
    condition: "new", location: "Addis Ababa", stock: 1,
    images: [], attributes: {},
  });
  const [attrKey, setAttrKey] = useState("");
  const [attrVal, setAttrVal] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addAttr = () => {
    if (attrKey.trim() && attrVal.trim()) {
      setForm((f) => ({ ...f, attributes: { ...f.attributes, [attrKey.trim()]: attrVal.trim() } }));
      setAttrKey(""); setAttrVal("");
    }
  };
  const removeAttr = (k) => {
    const a = { ...form.attributes };
    delete a[k];
    setForm((f) => ({ ...f, attributes: a }));
  };
  const addImage = () => {
    if (imgUrl.trim()) {
      setForm((f) => ({ ...f, images: [...f.images, imgUrl.trim()] }));
      setImgUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { toast.error("Please select a category"); return; }
    setLoading(true);
    try {
      await api.post("/products/", { ...form, price: parseFloat(form.price) });
      toast.success("Listing submitted for approval!");
      navigate("/seller/listings");
    } catch { toast.error("Failed to submit listing"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/seller/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <IconArrowLeft size={14} /> Back to Listings
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-gray-500">Basic Information</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input required value={form.title} onChange={set("title")} placeholder="e.g. iPhone 15 Pro Max 256GB" className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea rows={4} value={form.description} onChange={set("description")}
              placeholder="Describe your product in detail — condition, features, what's included..."
              className="form-input resize-none" />
          </div>
        </div>

        {/* Pricing & details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Pricing & Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (ETB) *</label>
              <input required type="number" min="0" value={form.price} onChange={set("price")} placeholder="0" className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
              <input type="number" min="1" value={form.stock} onChange={set("stock")} className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
              <select value={form.category} onChange={set("category")} className="form-input bg-white">
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
              <select value={form.condition} onChange={set("condition")} className="form-input bg-white">
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
            <input value={form.location} onChange={set("location")} placeholder="e.g. Addis Ababa" className="form-input" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Product Images</h2>
          <div className="flex gap-2">
            <input type="url" placeholder="Paste image URL — https://..." value={imgUrl} onChange={(e) => setImgUrl(e.target.value)}
              className="form-input flex-1" />
            <button type="button" onClick={addImage} className="btn-outline shrink-0">
              <IconPlus size={15} /> Add
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-16 group">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attributes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Product Attributes <span className="text-gray-400 font-normal normal-case">(optional)</span></h2>
          <div className="flex gap-2">
            <input placeholder="Key (e.g. Brand)" value={attrKey} onChange={(e) => setAttrKey(e.target.value)}
              className="form-input flex-1" />
            <input placeholder="Value (e.g. Samsung)" value={attrVal} onChange={(e) => setAttrVal(e.target.value)}
              className="form-input flex-1" />
            <button type="button" onClick={addAttr} className="btn-outline shrink-0">
              <IconPlus size={15} /> Add
            </button>
          </div>
          {Object.keys(form.attributes).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(form.attributes).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                  {k}: {v}
                  <button type="button" onClick={() => removeAttr(k)}
                    className="text-purple-400 hover:text-purple-700 transition-colors ml-0.5">
                    <IconX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : "Submit for Approval"}
          </button>
          <Link to="/seller/listings" className="btn-outline py-3 px-5">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
