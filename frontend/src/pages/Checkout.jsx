// Checkout is handled directly in Cart.jsx for this app.
// This file is kept as a redirect fallback.
import { Navigate } from "react-router-dom";
export default function Checkout() {
  return <Navigate to="/cart" replace />;
}
