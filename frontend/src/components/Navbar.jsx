import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", scrollTo: "contact" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const count = useCartStore((s) => s.count());
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleContact = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const scroll = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname !== "/") { navigate("/"); setTimeout(scroll, 120); }
    else scroll();
  };

  const handleLogout = () => { logout(); setDropOpen(false); navigate("/"); };

  return (
    <header className="sticky top-0 z-50">
      {/* Promo bar */}
      <div className="bg-espresso text-sand-200 text-center text-[11px] py-2 tracking-widest font-medium uppercase">
        Limited Time — 10% Off All Orders &nbsp;·&nbsp; Code <span className="text-gold-300 font-bold">YADA10</span>
      </div>

      {/* Main nav */}
      <nav className={`transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-sand-100"
          : "bg-white border-b border-sand-100"
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0 group">
            <span className="font-serif font-bold text-2xl text-espresso tracking-tight group-hover:text-sand-700 transition-colors">
              Yada
            </span>
            <span className="font-serif font-bold text-2xl text-sand-400 tracking-tight">Hair</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((n) => {
              const isActive = n.to && location.pathname === n.to;
              return (
                <li key={n.label}>
                  {n.scrollTo ? (
                    <a href="#contact" onClick={handleContact}
                      className="relative px-4 py-2 text-sm font-medium text-sand-500 hover:text-espresso transition-colors rounded-xl hover:bg-sand-50 cursor-pointer">
                      {n.label}
                    </a>
                  ) : (
                    <Link to={n.to}
                      className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? "text-espresso bg-sand-100 font-semibold"
                          : "text-sand-500 hover:text-espresso hover:bg-sand-50"
                      }`}>
                      {n.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" aria-label="Cart"
              className="relative p-2.5 rounded-xl text-sand-600 hover:text-espresso hover:bg-sand-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-espresso text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Auth desktop */}
            {user ? (
              <div className="relative hidden md:block" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-2xl hover:bg-sand-100 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-espresso text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-espresso max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-sand-400 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-float border border-sand-100 overflow-hidden animate-scale-in">
                    <div className="px-4 py-4 bg-gradient-to-br from-sand-50 to-champagne border-b border-sand-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-espresso text-white flex items-center justify-center font-bold text-sm">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-espresso truncate">{user.name}</p>
                          <p className="text-xs text-sand-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-sand-600 hover:text-espresso px-4 py-2 rounded-xl hover:bg-sand-100 transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2.5 px-5 text-xs rounded-xl shadow-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="md:hidden p-2.5 rounded-xl text-sand-600 hover:bg-sand-100 transition-all"
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <div className="w-5 flex flex-col gap-[5px]">
                <span className={`block h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 bg-espresso rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-sand-100 shadow-float animate-slide-up">
          <div className="max-w-6xl mx-auto px-6 py-5 space-y-1">
            {NAV_LINKS.map((n) =>
              n.scrollTo ? (
                <a key={n.label} href="#contact" onClick={handleContact}
                  className="block py-3 px-4 text-sm font-medium text-sand-600 hover:text-espresso rounded-xl hover:bg-sand-50 transition-all">
                  {n.label}
                </a>
              ) : (
                <Link key={n.label} to={n.to} onClick={() => setMenuOpen(false)}
                  className={`block py-3 px-4 text-sm font-medium rounded-xl transition-all ${
                    location.pathname === n.to ? "bg-sand-100 text-espresso font-semibold" : "text-sand-600 hover:text-espresso hover:bg-sand-50"
                  }`}>
                  {n.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-sand-100 mt-2">
              {user ? (
                <div className="flex items-center justify-between px-4 py-3 bg-sand-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-espresso text-white flex items-center justify-center text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-espresso">{user.name}</span>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="text-xs text-red-500 font-semibold hover:text-red-700">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center btn-outline py-2.5 text-sm rounded-xl">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center btn-primary py-2.5 text-sm rounded-xl">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
