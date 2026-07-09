import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconCart, IconChevronDown, IconGrid, IconHeart, IconLogOut, IconMenu, IconMessage, IconPackage, IconSearch, IconSettings, IconUser, IconX } from "./Icons";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";
import logo from "../../assets/logo.jfif";

const ROLE_COLOR = {
  admin:  "bg-purple-500",
  seller: "bg-accent-500",
  buyer:  "bg-emerald-500",
};

function DropItem({ to, icon, label, badge, onClick, active }) {
  return (
    <Link to={to} onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 group ${
        active
          ? "bg-[#1a1a2e] text-white"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}>
      <span className={`shrink-0 transition-colors ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
        {icon}
      </span>
      <span className="flex-1 font-medium">{label}</span>
      {badge != null && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
          active ? "bg-white/20 text-white" : "bg-accent-100 text-accent-700"
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

function MobileItem({ to, label }) {
  return (
    <Link to={to}
      className="block text-sm text-gray-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const count = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-[#1a1a2e] shadow-nav">
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src={logo} alt="Vibey World Market"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-accent-400/50 transition-all" />
            <div className="leading-none hidden sm:block">
              <p className="font-black text-white text-[15px] tracking-tight">
                Vibey<span className="text-accent-400">World</span>
              </p>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">Market</p>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-gray-900 placeholder:text-gray-400 focus:placeholder:text-gray-400 rounded-l-xl px-4 py-2 text-sm outline-none transition-all duration-200"
              aria-label="Search products"
            />
            <button type="submit"
              className="bg-accent-500 hover:bg-accent-600 transition-colors px-4 rounded-r-xl flex items-center gap-1.5 text-white text-sm font-semibold shrink-0"
              aria-label="Search">
              <IconSearch size={16} />
              <span className="hidden lg:inline">Search</span>
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link to={user ? "/seller/listings/add" : "/register?role=seller"}
              className="hidden md:flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all duration-150 active:scale-95">
              <span className="text-base leading-none">+</span> Sell
            </Link>

            <Link to="/cart"
              className="relative p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label={`Cart (${count} items)`}>
              <IconCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/messages"
                  className="hidden md:flex p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Messages">
                  <IconMessage size={20} />
                </Link>
                <Link to="/wishlist"
                  className="hidden md:flex p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Wishlist">
                  <IconHeart size={20} />
                </Link>

                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-white/10 rounded-xl transition-colors"
                    aria-expanded={dropOpen}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <IconChevronDown size={14} className={`text-gray-300 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal overflow-hidden border border-gray-100 animate-scale-in">
                      {/* User header */}
                      <div className="px-4 py-4 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10"
                          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #f97316 0%, transparent 60%)" }} />
                        <div className="flex items-center gap-3 relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center font-black text-white text-base shrink-0 shadow-lg">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-white truncate leading-tight">{user.name}</p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                            <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${ROLE_COLOR[user.role] || "bg-gray-500"}`}>
                              <span className="w-1 h-1 rounded-full bg-white/70" />
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <DropItem to="/profile"   icon={<IconUser size={15} />}    label="My Profile"   onClick={() => setDropOpen(false)} active={location.pathname === "/profile"} />
                        <DropItem to="/orders"    icon={<IconPackage size={15} />} label="My Orders"    onClick={() => setDropOpen(false)} active={location.pathname === "/orders"} />
                        <DropItem to="/wishlist"  icon={<IconHeart size={15} />}   label="Wishlist"     onClick={() => setDropOpen(false)} active={location.pathname === "/wishlist"} />
                        <DropItem to="/messages"  icon={<IconMessage size={15} />} label="Messages"     onClick={() => setDropOpen(false)} active={location.pathname === "/messages"} />
                      </div>

                      {(user.role === "seller" || user.role === "admin") && (
                        <div className="border-t border-gray-100 py-1.5">
                          {(user.role === "seller" || user.role === "admin") && (
                            <DropItem to="/seller/dashboard" icon={<IconGrid size={15} />}     label="Seller Dashboard" onClick={() => setDropOpen(false)} active={location.pathname.startsWith("/seller")} />
                          )}
                          {user.role === "admin" && (
                            <DropItem to="/admin" icon={<IconSettings size={15} />} label="Admin Panel" onClick={() => setDropOpen(false)} active={location.pathname.startsWith("/admin")} />
                          )}
                        </div>
                      )}

                      {/* Sign out */}
                      <div className="border-t border-gray-100 p-2">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium group">
                          <IconLogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-xl transition-colors font-medium">
                  Sign In
                </Link>
                <Link to="/register"
                  className="text-sm bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Menu">
              {mobileOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#16213e] border-t border-white/10 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                  </div>
                </div>
                <MobileItem to="/profile" label="My Profile" />
                <MobileItem to="/orders" label="My Orders" />
                <MobileItem to="/messages" label="Messages" />
                <MobileItem to="/wishlist" label="Wishlist" />
                {(user.role === "seller" || user.role === "admin") && (
                  <MobileItem to="/seller/dashboard" label="Seller Dashboard" />
                )}
                {user.role === "admin" && <MobileItem to="/admin" label="Admin Panel" />}
                <button onClick={handleLogout}
                  className="w-full text-left text-sm text-red-400 hover:text-red-300 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors mt-1">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MobileItem to="/login" label="Sign In" />
                <MobileItem to="/register" label="Sign Up" />
              </>
            )}
            <Link to={user ? "/seller/listings/add" : "/register?role=seller"}
              className="block mt-2 bg-accent-500 hover:bg-accent-600 text-white text-center font-bold py-3 rounded-xl text-sm transition-colors">
              + Start Selling
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
