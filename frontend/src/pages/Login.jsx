import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconArrowRight, IconLock, IconMail } from "../components/Icons";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import logo from "../../assets/logo.jfif";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : user.role === "seller" ? "/seller/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-modal border border-gray-100 overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-8 py-8 text-center">
            <img src={logo} alt="Vibey World Market"
              className="h-16 w-16 mx-auto rounded-full object-cover ring-4 ring-white/20 mb-4" />
            <h1 className="text-xl font-black text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to Vibey World Market</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="form-input pl-10"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-accent-500 hover:text-accent-600 font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password" required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    Sign In <IconArrowRight size={15} />
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-accent-500 font-semibold hover:text-accent-600">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
