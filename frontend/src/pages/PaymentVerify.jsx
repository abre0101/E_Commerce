import { Link } from "react-router-dom";

export default function PaymentVerify() {
  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
      <p className="text-gray-500 text-sm mb-8">
        Thank you for your order. Yadeshi will contact you shortly to confirm delivery.
      </p>
      <Link to="/shop" className="btn-primary px-10">Continue Shopping</Link>
    </div>
  );
}
