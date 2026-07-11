import { Link } from "react-router-dom";

export default function PaymentVerify() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(34,197,94,0.15)" }}>
          <svg className="w-10 h-10" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: "#fff" }}>Payment Successful!</h2>
        <p className="text-sm mb-8" style={{ color: "#888" }}>
          Thank you for your order. Yadeshi will contact you shortly to confirm delivery.
        </p>
        <Link
          to="/shop"
          className="inline-block px-10 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
          style={{ background: "#C9A961", color: "#111" }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
