import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-espresso text-sand-400 mt-0">
      {/* CTA band */}
      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-1">Ready to elevate your look?</h3>
            <p className="text-sand-400 text-sm">Shop Yada Hair today and experience the difference.</p>
          </div>
          <Link to="/shop"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-espresso font-bold text-sm px-7 py-3.5 rounded-2xl hover:bg-sand-100 transition-all shadow-glow">
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
            <span className="font-serif font-bold text-2xl text-white">Yada</span>
            <span className="font-serif font-bold text-2xl text-sand-500">Hair</span>
          </div>
          <p className="text-sm text-sand-500 leading-relaxed mb-6">
            Premium human hair by Yadeshi Demisse. Zero shedding, softness that lasts — guaranteed.
          </p>
          <div className="flex gap-2">
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Information</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">About</Link></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Help Center</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-2 uppercase tracking-wider">Newsletter</h4>
          <p className="text-xs text-sand-500 mb-4">Exclusive offers straight to your inbox.</p>
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-3 py-2.5 text-xs bg-white/5 text-white placeholder:text-sand-600 outline-none focus:bg-white/10 transition-colors" />
            <button className="bg-sand-600 hover:bg-sand-500 text-white text-xs px-4 font-semibold transition-colors shrink-0">
              Go
            </button>
          </div>
          <p className="text-xs text-sand-600 mt-4">yadeshidemisse@gmail.com</p>
          <p className="text-xs text-sand-600 mt-1">+251 91 123 4567</p>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-sand-700">
        © {new Date().getFullYear()} Yada Hair by Yadeshi Demisse · All rights reserved
      </div>
    </footer>
  );
}
