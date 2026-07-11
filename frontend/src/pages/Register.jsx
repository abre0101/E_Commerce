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

  const inputCls = "w-full px-4 py-3 text-sm border outline-none transition focus:border-yellow-500";
  const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "#0d0d0d" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl font-bold" style={{ color: "#fff" }}>
            Yada<span style={{ color: "#C9A961" }}>Hair</span>
          </Link>
          <p className="text-sm mt-1" style={{ color: "#888" }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 border"
          style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}>
          <div>
            <h3 className="font-semibold mb-0.5" style={{ color: "#fff" }}>Your Details</h3>
            <p className="text-xs mb-4" style={{ color: "#666" }}>Required for payment and delivery.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>First Name</label>
                  <input required autoComplete="given-name" placeholder="First name"
                    className={inputCls} style={inputStyle} value={form.firstName} onChange={set("firstName")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Last Name</label>
                  <input required autoComplete="family-name" placeholder="Last name"
                    className={inputCls} style={inputStyle} value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Email</label>
                <input required type="email" autoComplete="email" placeholder="your@email.com"
                  className={inputCls} style={inputStyle} value={form.email} onChange={set("email")} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Phone / WhatsApp</label>
                <input required type="tel" autoComplete="tel" placeholder="+251..."
                  className={inputCls} style={inputStyle} value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Delivery Address</label>
                <AddressPicker required value={form.address}
                  onChange={(address) => setForm((f) => ({ ...f, address }))} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: "#222" }}>
            <h3 className="font-semibold mb-4" style={{ color: "#fff" }}>Security</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Password</label>
                <input required type="password" autoComplete="new-password" placeholder="Min. 6 characters"
                  className={inputCls} style={inputStyle} value={form.password} onChange={set("password")} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Confirm Password</label>
                <input required type="password" autoComplete="new-password" placeholder="Repeat password"
                  className={inputCls} style={inputStyle} value={form.confirm} onChange={set("confirm")} />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 border"
              style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#C9A961", color: "#111" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "#666" }}>
          Already have an account?{" "}
          <Link to="/login" state={{ from }} className="font-semibold hover:underline" style={{ color: "#C9A961" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
