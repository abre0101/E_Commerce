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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save order to localStorage
    const order = {
      txRef:    `YADA-${Date.now()}`,
      date:     new Date().toISOString(),
      status:   "success",
      total:    total(),
      customer: {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     form.phone,
        address:   form.address,
      },
      items: items.map((item) => ({
        name:  item.product.name,
        length: item.length,
        qty:   item.qty,
        price: item.product.price,
      })),
    };
    const existing = JSON.parse(localStorage.getItem("yada_orders") || "[]");
    localStorage.setItem("yada_orders", JSON.stringify([...existing, order]));

    useCartStore.getState().clearCart();
    setLoading(false);
    setSuccess(true);
  };

  const inputCls = "w-full px-4 py-3 text-sm border outline-none transition focus:border-yellow-500";
  const inputStyle = { borderColor: "#2a2a2a", color: "#fff", background: "transparent" };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="max-w-lg mx-auto px-5 py-24 text-center">
          <p className="text-5xl mb-5">🎉</p>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#fff" }}>Payment Successful!</h2>
          <p className="text-sm mb-2" style={{ color: "#888" }}>Thank you for your order. Your payment via</p>
          <p className="font-bold text-base mb-6" style={{ color: "#C9A961" }}>Chapa</p>
          <p className="text-sm mb-8" style={{ color: "#888" }}>was processed successfully. We'll be in touch soon!</p>
          <Link to="/shop" className="inline-block px-8 py-3.5 text-sm font-bold uppercase tracking-widest"
            style={{ background: "#C9A961", color: "#111" }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="max-w-lg mx-auto px-5 py-24 text-center">
          <p className="text-5xl mb-5">🛍️</p>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#fff" }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color: "#888" }}>Add some beautiful hair to your cart!</p>
          <Link to="/shop" className="inline-block px-8 py-3.5 text-sm font-bold uppercase tracking-widest"
            style={{ background: "#C9A961", color: "#111" }}>Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto px-5 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#C9A961" }}>Your Bag</p>
        <h1 className="font-serif text-3xl font-bold mb-8" style={{ color: "#fff" }}>Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 p-4 border" style={{ background: "#111", borderColor: "#222" }}>
              <img src={item.product.images[0]} alt={item.product.name}
                className="w-24 h-28 object-cover object-top shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: "#fff" }}>{item.product.name}</p>
                <p className="text-xs mb-3" style={{ color: "#888" }}>Length: {item.length}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border" style={{ borderColor: "#333" }}>
                    <button onClick={() => updateQty(item.key, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors"
                      style={{ color: "#C9A961" }}>−</button>
                    <span className="w-8 text-center text-sm font-medium" style={{ color: "#fff" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors"
                      style={{ color: "#C9A961" }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.key)}
                    className="text-xs transition-colors" style={{ color: "#f87171" }}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold" style={{ color: "#fff" }}>ETB {(item.product.price * item.qty).toLocaleString()}</p>
                <p className="text-xs" style={{ color: "#888" }}>ETB {item.product.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + checkout */}
        <div className="lg:w-80 shrink-0">
          <div className="p-6 mb-4 border" style={{ background: "#111", borderColor: "#222" }}>
            <h3 className="font-semibold mb-4" style={{ color: "#fff" }}>Order Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "#888" }}>Subtotal</span>
              <span className="font-medium" style={{ color: "#fff" }}>ETB {total().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: "#888" }}>Delivery</span>
              <span className="font-medium" style={{ color: "#C9A961" }}>Free</span>
            </div>
            <div className="pt-4 flex justify-between font-bold" style={{ borderTop: "1px solid #222", color: "#fff" }}>
              <span>Total</span>
              <span>ETB {total().toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="p-6 space-y-4 border" style={{ background: "#111", borderColor: "#222" }}>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: "#fff" }}>Your Details</h3>
              <p className="text-xs mb-4" style={{ color: "#666" }}>✓ Pre-filled from your profile. Edit as needed.</p>
            </div>

            <div className="pb-3 border-b" style={{ borderColor: "#222" }}>
              <label className="text-xs font-semibold mb-2 block uppercase tracking-wide" style={{ color: "#C9A961" }}>Personal Information</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#888" }}>First Name</label>
                  <input required placeholder="First Name" className={inputCls} style={inputStyle}
                    value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#888" }}>Last Name</label>
                  <input required placeholder="Last Name" className={inputCls} style={inputStyle}
                    value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="pb-3 border-b" style={{ borderColor: "#222" }}>
              <label className="text-xs font-semibold mb-2 block uppercase tracking-wide" style={{ color: "#C9A961" }}>Contact</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#888" }}>Email</label>
                  <input required type="email" placeholder="your@email.com" className={inputCls} style={inputStyle}
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#888" }}>Phone / WhatsApp</label>
                  <input required type="tel" placeholder="+251..." className={inputCls} style={inputStyle}
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="pb-3 border-b" style={{ borderColor: "#222" }}>
              <label className="text-xs font-semibold mb-2 block uppercase tracking-wide" style={{ color: "#C9A961" }}>Delivery Address</label>
              <AddressPicker required value={form.address}
                onChange={(address) => setForm((f) => ({ ...f, address }))} />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 border"
                style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
                {error}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 py-2 border" style={{ borderColor: "#222", background: "#0d0d0d" }}>
              <svg className="w-4 h-4" style={{ color: "#C9A961" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-medium" style={{ color: "#888" }}>
                Secured by <span style={{ color: "#C9A961", fontWeight: "bold" }}>Chapa</span>
              </span>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#C9A961", color: "#111" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Redirecting to Chapa...
                </span>
              ) : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
