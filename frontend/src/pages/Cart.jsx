import { Link, useNavigate } from "react-router-dom";
import { IconArrowRight, IconShoppingBag, IconTrash } from "../components/Icons";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
        <IconShoppingBag size={32} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn-primary inline-flex py-3 px-8">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Shopping Cart
        <span className="text-sm font-normal text-gray-500 ml-2">({items.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center shadow-card hover:shadow-card-hover transition-shadow">
              <Link to={`/products/${item.id}`}>
                <img src={item.images?.[0] || "https://placehold.co/80x80"}
                  alt={item.title}
                  className="w-[72px] h-[60px] rounded-xl object-cover shrink-0 hover:opacity-90 transition-opacity" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`}
                  className="font-semibold text-sm text-gray-800 line-clamp-2 hover:text-accent-500 transition-colors">
                  {item.title}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">ETB {Number(item.price).toLocaleString()} each</p>
              </div>

              {/* Qty control */}
              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                  className="w-8 h-8 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors">−</button>
                <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-8 h-8 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors">+</button>
              </div>

              <p className="font-bold text-sm text-gray-900 w-24 text-right shrink-0">
                ETB {(item.price * item.qty).toLocaleString()}
              </p>
              <button onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg shrink-0">
                <IconTrash size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card h-fit sticky top-[76px]">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span className="font-semibold">ETB {total().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery fee</span>
              <span className="text-emerald-600 font-semibold">Negotiable</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-5 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-black text-accent-500 text-lg">ETB {total().toLocaleString()}</span>
          </div>

          <button onClick={() => navigate(user ? "/checkout" : "/login")}
            className="btn-accent w-full py-3">
            Checkout <IconArrowRight size={15} />
          </button>

          <Link to="/products"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
