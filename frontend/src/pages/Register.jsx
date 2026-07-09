import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IconArrowRight, IconLock, IconMail, IconPhone, IconUser } from "../components/Icons";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import logo from "../../assets/logo.jfif";

export default function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    role: urlParams.get("role") || "buyer",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === "seller" ? "/seller/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-modal border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-8 py-8 text-center">
            <img src={logo} alt="Vibey World Market"
              className="h-16 w-16 mx-auto rounded-full object-cover ring-4 ring-white/20 mb-4" />
            <h1 className="text-xl font-black text-white">Create your account</h1>
            <p className="text-gray-400 text-sm mt-1">Join Vibey World Market today</p>
          </div>

          <div className="px-8 py-7">
            {/* Role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6 p-1 bg-gray-50 gap-1">
              {["buyer", "seller"].map((r) => (
                <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                    form.role === r
                      ? "bg-[#1a1a2e] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  {r === "buyer" ? "🛍️ Buy" : "🏪 Sell"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="form-input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="form-input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+251 9xx xxx xxx"
                    className="form-input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" required minLength={6} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="form-input pl-10" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-accent w-full py-3 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    Create Account <IconArrowRight size={15} />
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-accent-500 font-semibold hover:text-accent-600">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
