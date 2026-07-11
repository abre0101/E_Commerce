import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      try {
        login(form.email, form.password);
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
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl font-bold" style={{ color: "#fff" }}>
            Yada<span style={{ color: "#C9A961" }}>Hair</span>
          </Link>
          <p className="text-sm mt-1" style={{ color: "#888" }}>Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-4 border"
          style={{ background: "#111", borderColor: "rgba(201,169,97,0.15)" }}
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>
              Email
            </label>
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              className={inputCls}
              style={inputStyle}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>
              Password
            </label>
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputCls}
              style={inputStyle}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <p
              className="text-xs px-3 py-2 border"
              style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#C9A961", color: "#111" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "#666" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            state={{ from }}
            className="font-semibold hover:underline"
            style={{ color: "#C9A961" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
