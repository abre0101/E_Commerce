import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import AddressPicker from "../components/AddressPicker";

const inputCls = "w-full px-4 py-3 text-sm border outline-none transition focus:border-yellow-500";
const inputStyle = { borderColor: "#333", color: "#fff", background: "transparent" };

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    phone:     user?.phone     || "",
    address:   user?.address   || "",
  });
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateUser({
        firstName: form.firstName,
        lastName:  form.lastName,
        name:      `${form.firstName} ${form.lastName}`,
        phone:     form.phone,
        address:   form.address,
      });
      toast.success("Profile updated");
      setLoading(false);
    }, 300);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.next.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    const hash = btoa(unescape(encodeURIComponent(pwForm.current + "_yada_salt")));
    const users = JSON.parse(localStorage.getItem("yada_users") || "[]");
    const me = users.find((u) => u.id === user?.id);
    if (!me || me.passwordHash !== hash) { setPwError("Current password is incorrect."); return; }
    updateUser({ passwordHash: btoa(unescape(encodeURIComponent(pwForm.next + "_yada_salt"))) });
    setPwForm({ current: "", next: "", confirm: "" });
    toast.success("Password changed");
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-2xl mx-auto px-5 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>
          Account
        </p>
        <h1 className="font-serif text-3xl font-bold mb-8" style={{ color: "#fff" }}>My Profile</h1>

        {/* Avatar + meta */}
        <div className="flex items-center gap-5 mb-10 p-6 border" style={{ background: "#111", borderColor: "#222" }}>
          <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-black rounded-full shrink-0"
            style={{ background: "#C9A961" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg" style={{ color: "#fff" }}>{user?.name}</p>
            <p className="text-sm" style={{ color: "#888" }}>{user?.email}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Link to="/cart"
              className="text-xs font-semibold px-4 py-2 border transition-all"
              style={{ borderColor: "#C9A961", color: "#C9A961" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#C9A961"; e.currentTarget.style.color = "#111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9A961"; }}>
              View Cart
            </Link>
            <button onClick={handleLogout}
              className="text-xs font-semibold px-4 py-2 border transition-all"
              style={{ borderColor: "#f87171", color: "#f87171" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f87171"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#f87171"; }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 border mb-6" style={{ background: "#111", borderColor: "#222" }}>
          <h2 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#C9A961" }}>
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>First Name</label>
              <input required placeholder="First name" className={inputCls} style={inputStyle}
                value={form.firstName} onChange={set("firstName")} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Last Name</label>
              <input required placeholder="Last name" className={inputCls} style={inputStyle}
                value={form.lastName} onChange={set("lastName")} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Phone / WhatsApp</label>
            <input type="tel" placeholder="+251..." className={inputCls} style={inputStyle}
              value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>Delivery Address</label>
            <AddressPicker value={form.address}
              onChange={(address) => setForm((f) => ({ ...f, address }))} />
          </div>
          <button type="submit" disabled={loading}
            className="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#C9A961", color: "#111" }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handlePassword} className="p-6 space-y-4 border" style={{ background: "#111", borderColor: "#222" }}>
          <h2 className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#C9A961" }}>
            Change Password
          </h2>
          {[
            ["current", "Current Password"],
            ["next",    "New Password"],
            ["confirm", "Confirm New Password"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#888" }}>{label}</label>
              <input required type="password" placeholder="••••••••" className={inputCls} style={inputStyle}
                value={pwForm[field]}
                onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))} />
            </div>
          ))}
          {pwError && (
            <p className="text-xs px-3 py-2 border"
              style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
              {pwError}
            </p>
          )}
          <button type="submit"
            className="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
            style={{ background: "#C9A961", color: "#111" }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
