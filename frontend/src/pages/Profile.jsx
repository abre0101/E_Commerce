import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconEdit, IconMapPin, IconPhone, IconUser } from "../components/Icons";
import toast from "react-hot-toast";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", form);
      updateUser(res.data);
      toast.success("Profile updated");
    } catch { toast.error("Update failed"); }
    finally { setLoading(false); }
  };

  const becomeSeller = async () => {
    try {
      await api.post("/sellers/become-seller", {
        shop_name: `${user.name}'s Shop`,
        shop_location: form.location,
      });
      updateUser({ role: "seller" });
      toast.success("You're now a seller!");
      navigate("/seller/dashboard");
    } catch { toast.error("Failed"); }
  };

  const ROLE_BADGE = {
    admin:  "badge-purple",
    seller: "badge-orange",
    buyer:  "badge-gray",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-2xl font-black text-white shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg text-white">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className={`badge mt-1.5 ${ROLE_BADGE[user?.role] || "badge-gray"}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <IconEdit size={16} className="text-gray-500" />
            <h2 className="font-semibold text-gray-800">Edit Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <IconUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input pl-10" placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <IconPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-input pl-10" placeholder="+251 9xx xxx xxx" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <IconMapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="form-input pl-10" placeholder="e.g. Addis Ababa" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {user?.role === "buyer" && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-accent-50 to-orange-50 rounded-xl p-4">
                <p className="font-semibold text-gray-800 mb-1">Become a Seller</p>
                <p className="text-sm text-gray-500 mb-3">Start selling on Vibey World Market and reach thousands of buyers.</p>
                <button onClick={becomeSeller} className="btn-accent py-2 px-5">
                  Start Selling →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
