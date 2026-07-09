import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconCheckCircle, IconCreditCard, IconMapPin } from "../components/Icons";
import toast from "react-hot-toast";
import api from "../services/api";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";

const PAYMENT_METHODS = [
  { value: "telebirr",         label: "Telebirr",         icon: "📱" },
  { value: "cbe_birr",         label: "CBE Birr",          icon: "🏦" },
  { value: "bank_transfer",    label: "Bank Transfer",     icon: "🏛️" },
  { value: "cash_on_delivery", label: "Cash on Delivery",  icon: "💵" },
];

export default function Checkout() {
  const { items, total, clear } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name:      user?.name  || "",
    phone:          user?.phone || "",
    city:           "",
    address:        "",
    notes:          "",
    payment_method: "cash_on_delivery",
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bySeller = items.reduce((acc, item) => {
        (acc[item.seller_id] = acc[item.seller_id] || []).push(item);
        return acc;
      }, {});
      for (const [seller_id, sellerItems] of Object.entries(bySeller)) {
        await api.post("/orders/", {
          seller_id,
          items: sellerItems.map((i) => ({ product_id: i.id, title: i.title, price: i.price, qty: i.qty, image: i.images?.[0] })),
          total: sellerItems.reduce((s, i) => s + i.price * i.qty, 0),
          payment_method: form.payment_method,
          shipping_address: { full_name: form.full_name, phone: form.phone, city: form.city, address: form.address },
          notes: form.notes,
        });
      }
      clear();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          {/* Shipping info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <IconMapPin size={18} className="text-accent-500" />
              <h2 className="font-bold text-gray-900">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input required value={form.full_name} onChange={set("full_name")} className="form-input" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <input required value={form.phone} onChange={set("phone")} className="form-input" placeholder="+251 9xx xxx xxx" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input required value={form.city} onChange={set("city")} placeholder="e.g. Addis Ababa" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                <input required value={form.address} onChange={set("address")} placeholder="Street, Kebele, etc." className="form-input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea rows={2} value={form.notes} onChange={set("notes")}
                  placeholder="Any special instructions for delivery..."
                  className="form-input resize-none" />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <IconCreditCard size={18} className="text-accent-500" />
              <h2 className="font-bold text-gray-900">Payment Method</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.value}
                  className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all duration-150 ${
                    form.payment_method === m.value
                      ? "border-[#1a1a2e] bg-[#1a1a2e]/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <input type="radio" name="pay" className="hidden"
                    checked={form.payment_method === m.value}
                    onChange={() => setForm((f) => ({ ...f, payment_method: m.value }))} />
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{m.label}</span>
                  {form.payment_method === m.value && (
                    <IconCheckCircle size={15} className="ml-auto text-[#1a1a2e]" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-accent w-full py-4 text-base">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing Order...
              </span>
            ) : (
              `Place Order — ETB ${total().toLocaleString()}`
            )}
          </button>
        </form>

        {/* Order summary sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card h-fit sticky top-[76px]">
          <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.images?.[0] || "https://placehold.co/48x48"}
                  alt={item.title} className="w-12 h-10 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-400">× {item.qty}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 shrink-0">
                  ETB {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-black text-accent-500">ETB {total().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
