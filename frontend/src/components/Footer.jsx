import { Link } from "react-router-dom";
import { IconFacebook, IconInstagram, IconTwitter } from "./Icons";
import logo from "../../assets/logo.jfif";

const CATEGORIES = ["Electronics", "Fashion", "Health And Beauty", "Food And Beverages", "Furniture"];
const PAYMENTS = [
  { icon: "📱", label: "Telebirr" },
  { icon: "🏦", label: "CBE Birr" },
  { icon: "🏛️", label: "Bank Transfer" },
  { icon: "💵", label: "Cash on Delivery" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111122] text-gray-400 mt-20">
      {/* CTA strip */}
      <div className="bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-white font-bold text-base">Ready to start selling?</p>
            <p className="text-white/80 text-sm">Join thousands of sellers on Vibey World Market</p>
          </div>
          <Link
            to="/register?role=seller"
            className="shrink-0 bg-white text-accent-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Become a Seller →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={logo} alt="Vibey World Market" className="h-9 w-9 rounded-full object-cover" />
              <div className="leading-none">
                <p className="font-black text-white text-[15px]">Vibey<span className="text-accent-400">World</span></p>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-0.5">Market</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Ethiopia's most vibrant marketplace for authentic products and local sellers.
            </p>
            <div className="flex gap-2">
              {[IconTwitter, IconInstagram, IconFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-sm hover:text-accent-400 transition-colors">All Listings</Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`}
                    className="text-sm hover:text-accent-400 transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Sell</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register?role=seller" className="text-sm hover:text-accent-400 transition-colors">Become a Seller</Link></li>
              <li><Link to="/seller/dashboard" className="text-sm hover:text-accent-400 transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/seller/listings/add" className="text-sm hover:text-accent-400 transition-colors">Add Listing</Link></li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Payment Methods</h4>
            <ul className="space-y-2.5">
              {PAYMENTS.map((p) => (
                <li key={p.label} className="flex items-center gap-2 text-sm">
                  <span>{p.icon}</span> {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Vibey World Market. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
