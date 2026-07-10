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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl font-bold text-brown-900">Yada Hair</Link>
          <p className="text-brown-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-brown-100 p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-brown-600 mb-1.5">Email</label>
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brown-600 mb-1.5">Password</label>
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="form-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-brown-400 mt-5">
          Don't have an account?{" "}
          <Link to="/register" state={{ from }} className="text-brown-800 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
