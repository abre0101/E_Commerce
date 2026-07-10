import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import AddressPicker from "../components/AddressPicker";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCartStore();
  const user = useAuthStore((s) => s.user);
  
  // Initialize form with user data if available, otherwise empty
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center" style={{ background: "#f7f3f0" }}>
        <p className="text-5xl mb-5">🎉</p>
        <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#2a2220" }}>Payment Successful!</h2>
        <p className="text-sm mb-2" style={{ color: "#6b6361" }}>Thank you for your order. Your payment via</p>
        <p className="font-bold text-base mb-6" style={{ color: "#8B4F6D" }}>Chapa</p>
        <p className="text-sm mb-8" style={{ color: "#6b6361" }}>was processed successfully. We'll be in touch soon!</p>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center" style={{ background: "#f7f3f0" }}>
        <p className="text-5xl mb-5">🛍️</p>
        <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#2a2220" }}>Your cart is empty</h2>
        <p className="text-sm mb-8" style={{ color: "#6b6361" }}>Add some beautiful hair to your cart!</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-12" style={{ background: "#f7f3f0" }}>
      <h1 className="font-serif text-3xl font-bold mb-8" style={{ color: "#2a2220" }}>Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 p-4 border" style={{ background: "#ede8e5", borderColor: "rgba(139,79,109,0.15)" }}>
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-28 object-cover object-top shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: "#2a2220" }}>{item.product.name}</p>
                <p className="text-xs mb-3" style={{ color: "#6b6361" }}>Length: {item.length}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border" style={{ borderColor: "rgba(139,79,109,0.2)" }}>
                    <button
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center transition-colors text-lg leading-none"
                      style={{ color: "#8B4F6D" }} onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(139,79,109,0.08)";
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}>−</button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center transition-colors text-lg leading-none"
                      style={{ color: "#8B4F6D" }} onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(139,79,109,0.08)";
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}>+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-xs hover:text-red-700 transition-colors"
                    style={{ color: "#d9534f" }}
                  >Remove</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold" style={{ color: "#2a2220" }}>ETB {(item.product.price * item.qty).toLocaleString()}</p>
                <p className="text-xs" style={{ color: "#6b6361" }}>ETB {item.product.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + checkout */}
        <div className="lg:w-80 shrink-0">
          {/* Order summary */}
          <div className="p-6 mb-4" style={{ background: "#ede8e5", border: "1px solid rgba(139,79,109,0.15)" }}>
            <h3 className="font-semibold mb-4" style={{ color: "#2a2220" }}>Order Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "#6b6361" }}>Subtotal</span>
              <span className="font-medium" style={{ color: "#2a2220" }}>ETB {total().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: "#6b6361" }}>Delivery</span>
              <span className="font-medium" style={{ color: "#8B4F6D" }}>Free</span>
            </div>
            <div className="pt-4 flex justify-between font-bold" style={{ borderTop: "1px solid rgba(139,79,109,0.15)", color: "#2a2220" }}>
              <span>Total</span>
              <span>ETB {total().toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout form */}
          <form onSubmit={handleCheckout} className="p-6 space-y-4" style={{ background: "rgba(139,79,109,0.06)", border: "1px solid rgba(139,79,109,0.15)" }}>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: "#2a2220" }}>Your Details</h3>
              <p className="text-xs mb-4" style={{ color: "#6b6361" }}>✓ Pre-filled from your profile. Edit as needed.</p>
            </div>

            {/* Personal Info */}
            <div className="pb-3 border-b" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B4F6D" }}>Personal Information</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#6b6361" }}>First Name</label>
                  <input
                    required
                    placeholder="First Name"
                    className="form-input text-sm"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#6b6361" }}>Last Name</label>
                  <input
                    required
                    placeholder="Last Name"
                    className="form-input text-sm"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pb-3 border-b" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B4F6D" }}>Contact Information</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#6b6361" }}>Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="your@email.com"
                    className="form-input text-sm w-full"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#6b6361" }}>Phone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    placeholder="+251..."
                    className="form-input text-sm w-full"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="pb-3 border-b" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B4F6D" }}>Delivery Address</label>
              <AddressPicker
                required
                value={form.address}
                onChange={(address) => setForm((f) => ({ ...f, address }))}
              />
            </div>

            {error && (
              <p className="text-xs bg-red-50 border border-red-100 px-3 py-2" style={{ color: "#d9534f", background: "rgba(217,83,79,0.08)", borderColor: "rgba(217,83,79,0.2)" }}>
                {error}
              </p>
            )}

            {/* Chapa badge */}
            <div className="flex items-center justify-center gap-2 py-2 border" style={{ borderColor: "rgba(139,79,109,0.15)", background: "#ede8e5" }}>
              <svg className="w-4 h-4" style={{ color: "#8B4F6D" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-medium" style={{ color: "#6b6361" }}>Secured by <span style={{ color: "#8B4F6D", fontWeight: "bold" }}>Chapa</span></span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Redirecting to Chapa...
                </span>
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
