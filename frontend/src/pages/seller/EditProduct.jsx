import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IconArrowLeft } from "../../components/Icons";
import toast from "react-hot-toast";
import api from "../../services/api";

const CATEGORIES = [
  "Electronics", "Fashion", "Health And Beauty", "Car", "House",
  "Furniture", "Commercial equipment and tools", "General",
  "Art And Craft", "Services", "Food And Beverages",
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setForm(r.data));
  }, [id]);

  if (!form) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
    </div>
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/products/${id}`, form);
      toast.success("Listing updated!");
      navigate("/seller/listings");
    } catch { toast.error("Update failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/seller/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <IconArrowLeft size={14} /> Back to Listings
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
            <input value={form.title} onChange={set("title")} className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea rows={4} value={form.description} onChange={set("description")} className="form-input resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (ETB)</label>
              <input type="number" value={form.price} onChange={set("price")} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
              <input type="number" value={form.stock} onChange={set("stock")} className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={set("category")} className="form-input bg-white">
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
            <input value={form.location} onChange={set("location")} className="form-input" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link to="/seller/listings" className="btn-outline py-3 px-5">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
