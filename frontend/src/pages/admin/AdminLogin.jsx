import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";

export default function AdminLogin() {
  const login = useAdminStore((s) => s.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(form.username, form.password);
      if (ok) navigate("/admin");
      else setError("Invalid username or password.");
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f0a06" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #1c0a00 0%, #2a1200 60%, #1c0a00 100%)" }}>
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-2xl text-white">Yada</span>
          <span className="font-serif font-bold text-2xl" style={{ color: "#d4952a" }}>Hair</span>
        </div>
        <div>
          <p className="font-serif text-4xl font-bold text-white leading-tight mb-4">
            Manage your<br />business with ease.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#9a7a50" }}>
            View orders, manage your product catalog, and track your store performance — all in one place.
          </p>
        </div>
        <p className="text-xs" style={{ color: "#5c4028" }}>
          © {new Date().getFullYear()} Yada Hair · Admin Portal
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-1 mb-10 lg:hidden">
            <span className="font-serif font-bold text-2xl text-white">Yada</span>
            <span className="font-serif font-bold text-2xl" style={{ color: "#d4952a" }}>Hair</span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: "#7d6040" }}>Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#9a7a50" }}>
                Username
              </label>
              <input
                required
                autoComplete="username"
                placeholder="yadeshi"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-all"
                style={{ background: "#1c1209", border: "1px solid #3d2c1e" }}
                onFocus={(e) => e.target.style.borderColor = "#d4952a"}
                onBlur={(e) => e.target.style.borderColor = "#3d2c1e"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#9a7a50" }}>
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition-all"
                  style={{ background: "#1c1209", border: "1px solid #3d2c1e" }}
                  onFocus={(e) => e.target.style.borderColor = "#d4952a"}
                  onBlur={(e) => e.target.style.borderColor = "#3d2c1e"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#7d6040" }}>
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs text-red-400"
                style={{ background: "rgb(239 68 68 / 0.08)", border: "1px solid rgb(239 68 68 / 0.2)" }}>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 mt-2"
              style={{ background: "linear-gradient(135deg, #2a1200, #3d2c1e)" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs mt-8" style={{ color: "#3d2c1e" }}>
            Restricted to Yada Hair administration only.
          </p>
        </div>
      </div>
    </div>
  );
}
