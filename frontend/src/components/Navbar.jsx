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
      {/* Promo bar with social media */}
      <div className="bg-espresso text-sand-200 py-3 px-6" style={{ background: "#2a2220", borderBottom: "1px solid rgba(201,169,97,0.2)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-[12px] tracking-widest font-semibold uppercase" style={{ color: "#C9A961" }}>
            Premium Human Hair Shop
          </div>
          {/* Social media links */}
          <div className="flex items-center gap-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-110" style={{ color: "#C9A961" }} aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-110" style={{ color: "#C9A961" }} aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.635.247 1.175.475 1.695.995.52.52.748 1.06.996 1.695.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427-.247.636-.476 1.175-.996 1.695-.52.52-1.06.748-1.695.996-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465-.636-.247-1.175-.476-1.695-.996-.52-.52-.748-1.06-.996-1.695-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.247-.636.475-1.175.995-1.695.52-.52 1.06-.748 1.695-.996.636-.247 1.363-.416 2.427-.465 1.024-.048 1.379-.06 3.808-.06zm0 5.838c-2.338 0-4.238 1.9-4.238 4.238 0 2.338 1.9 4.238 4.238 4.238 2.338 0 4.238-1.9 4.238-4.238 0-2.338-1.9-4.238-4.238-4.238zm0 6.954c-1.466 0-2.657-1.191-2.657-2.657 0-1.466 1.191-2.657 2.657-2.657 1.466 0 2.657 1.191 2.657 2.657 0 1.466-1.191 2.657-2.657 2.657zm5.209-7.26c-.55 0-.995.445-.995.99s.445.995.99.995c.55 0 .995-.445.995-.99s-.445-.995-.99-.995z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-110" style={{ color: "#C9A961" }} aria-label="TikTok">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a5.85 5.85 0 0 0-1-.1A5.7 5.7 0 0 0 4.95 11.9a5.7 5.7 0 0 0 8.45 5.09 5.65 5.65 0 0 0 1.19-4.05h-3.45V9.71a4.83 4.83 0 0 0 7.45-4.02z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-110" style={{ color: "#C9A961" }} aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-110" style={{ color: "#C9A961" }} aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`transition-all duration-300 ${scrolled ? "shadow-md border-b" : "border-b"}`} style={{
        background: "#7B2D5E",
        borderColor: "rgba(201,169,97,0.35)"
      }}>
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0 group">
            <span className="font-serif font-bold text-2xl tracking-tight transition-colors" style={{ color: "#ffffff", marginRight: "2px" }}>
              Yada
            </span>
            <span className="font-serif font-bold text-2xl tracking-tight" style={{ color: "#F5C842" }}>Hair</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((n) => {
              const isActive = n.to && location.pathname === n.to;
              return (
                <li key={n.label}>
                  {n.scrollTo ? (
                    <a href="#contact" onClick={handleContact}
                      className="relative px-4 py-2 text-sm font-medium transition-colors rounded-xl cursor-pointer" style={{
                        color: "#ffffff",
                        backgroundColor: "transparent"
                      }} onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#F5C842";
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}>
                      {n.label}
                    </a>
                  ) : (
                    <Link to={n.to}
                      className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all`}
                      style={{
                        color: isActive ? "#F5C842" : "#ffffff",
                        backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                        fontWeight: isActive ? "600" : "500"
                      }} onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#F5C842";
                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                        }
                      }} onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}>
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
              className="relative p-2.5 rounded-xl transition-all"
              style={{ color: "#ffffff" }} onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F5C842";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }} onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.backgroundColor = "transparent";
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: "#8B4F6D" }}>
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Auth desktop */}
            {user ? (
              <div className="relative hidden md:block" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-2xl transition-all"
                  style={{ backgroundColor: "rgba(139,79,109,0.08)" }} onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(139,79,109,0.12)";
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(139,79,109,0.08)";
                  }}>
                  <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#8B4F6D" }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[90px] truncate" style={{ color: "#8B4F6D" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                    style={{ color: "#C9A961" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-float border overflow-hidden animate-scale-in" style={{ background: "#f5f0f0", borderColor: "rgba(201,169,97,0.2)" }}>
                    <div className="px-4 py-4 border-b" style={{ background: "#ede8e5", borderColor: "rgba(201,169,97,0.15)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm" style={{ background: "#8B4F6D" }}>
                          {user.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "#2a2220" }}>{user.name}</p>
                          <p className="text-xs truncate" style={{ color: "#6b6361" }}>{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm transition-colors font-medium" style={{ color: "#d9534f" }} onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(217,83,79,0.08)";
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}>
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
                <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-xl transition-all" 
                  style={{ color: "#ffffff", backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#F5C842";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2.5 px-5 text-xs rounded-xl shadow-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="md:hidden p-2.5 rounded-xl transition-all"
              style={{ color: "#ffffff" }} onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F5C842";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }} onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <div className="w-5 flex flex-col gap-[5px]">
                <span className={`block h-0.5 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} style={{ background: "#C9A961" }} />
                <span className={`block h-0.5 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "#C9A961" }} />
                <span className={`block h-0.5 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} style={{ background: "#C9A961" }} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-b shadow-float animate-slide-up" style={{ background: "#7B2D5E", borderColor: "rgba(201,169,97,0.35)" }}>
          <div className="max-w-6xl mx-auto px-6 py-5 space-y-1">
            {NAV_LINKS.map((n) =>
              n.scrollTo ? (
                <a key={n.label} href="#contact" onClick={handleContact}
                  className="block py-3 px-4 text-sm font-medium rounded-xl transition-all"
                  style={{ color: "#ffffff", backgroundColor: "transparent" }} onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#F5C842";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}>
                  {n.label}
                </a>
              ) : (
                <Link key={n.label} to={n.to} onClick={() => setMenuOpen(false)}
                  className={`block py-3 px-4 text-sm font-medium rounded-xl transition-all`}
                  style={{
                    color: location.pathname === n.to ? "#F5C842" : "#ffffff",
                    backgroundColor: location.pathname === n.to ? "rgba(255,255,255,0.15)" : "transparent",
                    fontWeight: location.pathname === n.to ? "600" : "500"
                  }} onMouseEnter={(e) => {
                    if (location.pathname !== n.to) {
                      e.currentTarget.style.color = "#F5C842";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                    }
                  }} onMouseLeave={(e) => {
                    if (location.pathname !== n.to) {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}>
                  {n.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t mt-2" style={{ borderColor: "rgba(201,169,97,0.15)" }}>
              {user ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(201,169,97,0.12)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center text-xs font-bold" style={{ background: "#8B4F6D" }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#ffffff" }}>{user.name}</span>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="text-xs font-semibold" style={{ color: "#fca5a5" }}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm rounded-xl border transition-all font-semibold"
                    style={{ borderColor: "rgba(201,169,97,0.4)", color: "#C9A961", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(201,169,97,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center btn-primary py-2.5 text-sm rounded-xl font-semibold">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
