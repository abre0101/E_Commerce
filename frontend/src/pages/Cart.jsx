import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import { initializePayment, generateTxRef } from "../services/chapa";
import AddressPicker from "../components/AddressPicker";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const txRef = generateTxRef();

      // Persist order info so we can show it on the verify page
      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          txRef,
          items: items.map((i) => ({
            name: i.product.name,
            length: i.length,
            qty: i.qty,
            price: i.product.price,
          })),
          total: total(),
          customer: form,
        })
      );

      const { checkoutUrl } = await initializePayment({
        amount: total(),
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        txRef,
      });

      // Redirect to Chapa hosted checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <p className="text-5xl mb-5">🛍️</p>
        <h2 className="font-serif text-2xl font-bold text-brown-900 mb-3">Your cart is empty</h2>
        <p className="text-brown-500 text-sm mb-8">Add some beautiful hair to your cart!</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-serif text-3xl font-bold text-brown-900 mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 bg-white p-4 border border-brown-100">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-28 object-cover object-top shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brown-900 text-sm mb-1">{item.product.name}</p>
                <p className="text-xs text-brown-400 mb-3">Length: {item.length}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-brown-200">
                    <button
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center text-brown-600 hover:bg-brown-50 transition-colors text-lg leading-none"
                    >−</button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-brown-600 hover:bg-brown-50 transition-colors text-lg leading-none"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >Remove</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-brown-800">ETB {(item.product.price * item.qty).toLocaleString()}</p>
                <p className="text-xs text-brown-400">ETB {item.product.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + checkout */}
        <div className="lg:w-80 shrink-0">
          {/* Order summary */}
          <div className="bg-white border border-brown-100 p-6 mb-4">
            <h3 className="font-semibold text-brown-900 mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-brown-500">Subtotal</span>
              <span className="font-medium">ETB {total().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-brown-500">Delivery</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-brown-100 pt-4 flex justify-between font-bold text-brown-900">
              <span>Total</span>
              <span>ETB {total().toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout form */}
          <form onSubmit={handleCheckout} className="bg-brown-50 border border-brown-100 p-6 space-y-3">
            <h3 className="font-semibold text-brown-900 mb-1">Your Details</h3>
            <p className="text-xs text-brown-400 mb-3">Required for payment and delivery.</p>

            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="First Name"
                className="form-input"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                required
                placeholder="Last Name"
                className="form-input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <input
              required
              type="email"
              placeholder="Email address"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              type="tel"
              placeholder="Phone / WhatsApp (+251...)"
              className="form-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <label className="block text-xs font-medium text-brown-600 mb-1.5">Delivery Address</label>
            <AddressPicker
              required
              value={form.address}
              onChange={(address) => setForm((f) => ({ ...f, address }))}
            />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">
                {error}
              </p>
            )}

            {/* Chapa badge */}
            <div className="flex items-center justify-center gap-2 py-2 border border-brown-200 bg-white">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-brown-500 font-medium">Secured by <span className="text-green-600 font-bold">Chapa</span></span>
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
