import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#2a2220" }}>
      {/* CTA band */}
      <div style={{ borderBottom: "1px solid rgba(201,169,97,0.2)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-1" style={{ color: "#f5f3f0" }}>Ready to elevate your look?</h3>
            <p style={{ color: "#c8c8c8" }} className="text-sm">Shop Yada Hair today and experience premium quality human hair.</p>
          </div>
          <Link to="/shop"
            className="shrink-0 inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-lg"
            style={{ background: "#8B4F6D", color: "#ffffff" }}>
            Shop Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-1 mb-4">
            <span className="font-serif font-bold text-2xl" style={{ color: "#f5f3f0" }}>Yada</span>
            <span className="font-serif font-bold text-2xl" style={{ color: "#C9A961" }}>Hair</span>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#b8b8b8" }}>
            Premium human hair by Yadeshi Demisse. Zero shedding, softness that lasts — guaranteed.
          </p>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(201,169,97,0.15)", color: "#C9A961" }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(201,169,97,0.15)", color: "#C9A961" }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.635.247 1.175.475 1.695.995.52.52.748 1.06.996 1.695.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427-.247.636-.476 1.175-.996 1.695-.52.52-1.06.748-1.695.996-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465-.636-.247-1.175-.476-1.695-.996-.52-.52-.748-1.06-.996-1.695-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.247-.636.475-1.175.995-1.695.52-.52 1.06-.748 1.695-.996.636-.247 1.363-.416 2.427-.465 1.024-.048 1.379-.06 3.808-.06z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(201,169,97,0.15)", color: "#C9A961" }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider" style={{ color: "#C9A961" }}>Information</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="transition-colors hover:text-white" style={{ color: "#b8b8b8" }}>About</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-white" style={{ color: "#b8b8b8" }}>Contact</Link></li>
            <li><Link to="/shop" className="transition-colors hover:text-white" style={{ color: "#b8b8b8" }}>Shop</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider" style={{ color: "#C9A961" }}>Help Center</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/faq" className="transition-colors hover:text-white" style={{ color: "#b8b8b8" }}>FAQ</Link></li>
            <li><Link to="/terms" className="transition-colors hover:text-white" style={{ color: "#b8b8b8" }}>Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="transition-colors hover:text-white" style={{ color: "#b8b8b8" }}>Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-sm mb-2 uppercase tracking-wider" style={{ color: "#C9A961" }}>Newsletter</h4>
          <p className="text-xs mb-4" style={{ color: "#b8b8b8" }}>Exclusive offers straight to your inbox.</p>
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "rgba(201,169,97,0.2)" }}>
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-3 py-2.5 text-xs outline-none transition-colors"
              style={{ background: "rgba(201,169,97,0.08)", color: "#f5f3f0" }} />
            <button className="text-white text-xs px-4 font-semibold transition-all hover:scale-105"
              style={{ background: "#8B4F6D" }}>
              Go
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: "#C9A961" }}>yadeshidemisse@gmail.com</p>
          <p className="text-xs mt-1" style={{ color: "#C9A961" }}>+251 91 123 4567</p>
        </div>
      </div>

      <div className="border-t py-5 text-center text-xs" style={{ borderColor: "rgba(201,169,97,0.2)", color: "#6b6361" }}>
        © {new Date().getFullYear()} Yada Hair by Yadeshi Demisse · All rights reserved
      </div>
    </footer>
  );
}
