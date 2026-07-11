import { useMemo } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const STATUS = {
  success:    { bg: "rgba(52,211,153,0.15)",  color: "#059669", label: "Paid" },
  processing: { bg: "rgba(96,165,250,0.15)",  color: "#2563eb", label: "Processing" },
  shipped:    { bg: "rgba(201,169,97,0.18)",  color: "#b45309", label: "Shipped" },
  delivered:  { bg: "rgba(52,211,153,0.15)",  color: "#059669", label: "Delivered" },
  failed:     { bg: "rgba(239,68,68,0.12)",   color: "#dc2626", label: "Failed" },
  pending:    { bg: "rgba(251,191,36,0.15)",  color: "#d97706", label: "Pending" },
};

function getOrders() {
  try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); }
  catch { return []; }
}

export default function MyOrders() {
  const user = useAuthStore((s) => s.user);

  // filter orders that belong to this user by email
  const orders = useMemo(() => {
    const all = getOrders();
    return [...all]
      .reverse()
      .filter((o) => o.customer?.email === user?.email);
  }, [user]);

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="text-center px-5 py-20">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(201,169,97,0.1)" }}>
            <svg className="w-10 h-10" style={{ color: "#C9A961" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#fff" }}>No orders yet</h2>
          <p className="text-sm mb-8" style={{ color: "#888" }}>Your completed orders will appear here.</p>
          <Link to="/shop"
            className="inline-block px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
            style={{ background: "#C9A961", color: "#111" }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-3xl mx-auto px-5 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>Account</p>
        <h1 className="font-serif text-3xl font-bold mb-8" style={{ color: "#fff" }}>
          My Orders <span className="text-base font-normal" style={{ color: "#888" }}>({orders.length})</span>
        </h1>

        <div className="space-y-5">
          {orders.map((o) => {
            const st = STATUS[o.status] || STATUS.success;
            return (
              <div key={o.txRef} className="p-5 border" style={{ background: "#111", borderColor: "#222" }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: "#1e1e1e" }}>
                  <div>
                    <p className="text-xs font-mono" style={{ color: "#666" }}>{o.txRef}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#888" }}>
                      {o.date ? new Date(o.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {o.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#fff" }}>{item.name}</p>
                        <p className="text-xs" style={{ color: "#666" }}>Length: {item.length} · Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold shrink-0" style={{ color: "#C9A961" }}>
                        ETB {(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {(!o.items || o.items.length === 0) && (
                    <p className="text-xs" style={{ color: "#666" }}>No item details available.</p>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 flex items-center justify-between border-t" style={{ borderColor: "#1e1e1e" }}>
                  <span className="text-xs" style={{ color: "#888" }}>Total</span>
                  <span className="font-bold text-base" style={{ color: "#fff" }}>ETB {o.total?.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
