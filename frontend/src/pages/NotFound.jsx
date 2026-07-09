import { Link } from "react-router-dom";
import { IconHome, IconSearch } from "../components/Icons";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 select-none">🌍</div>
        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Page not found</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Looks like this page wandered off the market. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary py-3 px-6">
            <IconHome size={16} /> Go Home
          </Link>
          <Link to="/products" className="btn-outline py-3 px-6">
            <IconSearch size={16} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
