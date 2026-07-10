import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import PaymentVerify from "./pages/PaymentVerify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RequireAuth from "./components/RequireAuth";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminContent from "./pages/admin/AdminContent";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminReports from "./pages/admin/AdminReports";

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto px-5 py-24 text-center">
        <p className="text-6xl mb-4">404</p>
        <p className="font-serif text-2xl font-bold text-brown-800 mb-6">Page not found</p>
        <a href="/" className="btn-primary inline-flex">Go Home</a>
      </div>
    </StoreLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ── Public store (with Navbar + Footer) ── */}
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
      <Route path="/products/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
      <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
      <Route path="/register" element={<StoreLayout><Register /></StoreLayout>} />
      <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
      <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
      <Route path="/faq" element={<StoreLayout><FAQ /></StoreLayout>} />
      <Route path="/terms" element={<StoreLayout><Terms /></StoreLayout>} />
      <Route path="/privacy" element={<StoreLayout><PrivacyPolicy /></StoreLayout>} />

      {/* ── Protected (must be logged in) ── */}
      <Route path="/cart" element={<StoreLayout><RequireAuth><Cart /></RequireAuth></StoreLayout>} />
      <Route path="/payment/verify" element={<StoreLayout><RequireAuth><PaymentVerify /></RequireAuth></StoreLayout>} />

      {/* ── Admin (own sidebar layout, no store chrome) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="consultations" element={<AdminConsultations />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="staff" element={<AdminStaff />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
