import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import AddressPicker from "../components/AddressPicker";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        register(form);
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl font-bold text-brown-900">Yada Hair</Link>
          <p className="text-brown-400 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-brown-100 p-8 space-y-6">

          {/* ── Your Details ── */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-0.5">Your Details</h3>
            <p className="text-xs text-brown-400 mb-4">Required for payment and delivery.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brown-600 mb-1.5">First Name</label>
                  <input required autoComplete="given-name" placeholder="First name"
                    className="form-input" value={form.firstName} onChange={set("firstName")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-600 mb-1.5">Last Name</label>
                  <input required autoComplete="family-name" placeholder="Last name"
                    className="form-input" value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Email</label>
                <input required type="email" autoComplete="email" placeholder="your@email.com"
                  className="form-input" value={form.email} onChange={set("email")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Phone / WhatsApp</label>
                <input required type="tel" autoComplete="tel" placeholder="+251..."
                  className="form-input" value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Delivery Address</label>
                <AddressPicker
                  required
                  value={form.address}
                  onChange={(address) => setForm((f) => ({ ...f, address }))}
                />
              </div>
            </div>
          </div>

          {/* ── Password ── */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-4">Security</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Password</label>
                <input required type="password" autoComplete="new-password" placeholder="Min. 6 characters"
                  className="form-input" value={form.password} onChange={set("password")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Confirm Password</label>
                <input required type="password" autoComplete="new-password" placeholder="Repeat password"
                  className="form-input" value={form.confirm} onChange={set("confirm")} />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-brown-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" state={{ from }} className="text-brown-800 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
