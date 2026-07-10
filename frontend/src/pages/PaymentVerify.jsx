import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyPayment } from "../services/chapa";
import useCartStore from "../store/useCartStore";

const STATUS = { loading: "loading", success: "success", failed: "failed" };

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState(STATUS.loading);
  const [order, setOrder] = useState(null);
  const [txData, setTxData] = useState(null);

  useEffect(() => {
    if (!txRef) {
      setStatus(STATUS.failed);
      return;
    }

    // Retrieve the pending order we saved before redirecting
    const pending = sessionStorage.getItem("pendingOrder");
    if (pending) setOrder(JSON.parse(pending));

    verifyPayment(txRef)
      .then((data) => {
        if (data.status === "success") {
          setTxData(data);
          setStatus(STATUS.success);
          clearCart();

          // Persist order to localStorage so admin can see it
          if (pending) {
            const order = JSON.parse(pending);
            const existing = JSON.parse(localStorage.getItem("yada_orders") || "[]");
            existing.push({ ...order, txRef, status: "success", date: new Date().toISOString() });
            localStorage.setItem("yada_orders", JSON.stringify(existing));
          }

          sessionStorage.removeItem("pendingOrder");
        } else {
          setStatus(STATUS.failed);
        }
      })
      .catch(() => setStatus(STATUS.failed));
  }, [txRef]);

  if (status === STATUS.loading) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <svg className="w-10 h-10 animate-spin text-brown-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-brown-600 font-medium">Verifying your payment...</p>
      </div>
    );
  }

  if (status === STATUS.failed) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <p className="text-5xl mb-5">❌</p>
        <h2 className="font-serif text-2xl font-bold text-brown-900 mb-3">Payment Failed</h2>
        <p className="text-brown-500 text-sm mb-8">
          We couldn't verify your payment. If money was deducted, please contact us with reference:{" "}
          <span className="font-mono text-brown-700">{txRef}</span>
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/cart" className="btn-outline">Try Again</Link>
          <a href="/#contact" className="btn-primary">Contact Us</a>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="max-w-xl mx-auto px-5 py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl font-bold text-brown-900 mb-2">Payment Successful!</h2>
        <p className="text-brown-500 text-sm">
          Thank you for your order. Yadeshi will contact you shortly to confirm delivery.
        </p>
      </div>

      {/* Receipt */}
      <div className="bg-white border border-brown-100 p-6 mb-6">
        <h3 className="font-semibold text-brown-900 mb-4 text-sm uppercase tracking-wide">Order Receipt</h3>

        {order?.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-brown-50 last:border-0">
            <span className="text-brown-700">
              {item.name} <span className="text-brown-400">({item.length})</span> × {item.qty}
            </span>
            <span className="font-medium text-brown-800">ETB {(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold text-brown-900 pt-4 mt-2 border-t border-brown-200">
          <span>Total Paid</span>
          <span>ETB {(txData?.amount || order?.total || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Tx reference */}
      <div className="bg-brown-50 border border-brown-100 px-4 py-3 mb-8 text-center">
        <p className="text-xs text-brown-400 mb-1">Transaction Reference</p>
        <p className="font-mono text-xs text-brown-700 break-all">{txRef}</p>
      </div>

      <div className="text-center">
        <Link to="/shop" className="btn-primary px-10">Continue Shopping</Link>
      </div>
    </div>
  );
}
