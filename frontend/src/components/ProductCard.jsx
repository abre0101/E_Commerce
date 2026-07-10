import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-[3/4] bg-sand-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-espresso text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
            Sale
          </span>
        )}

        {/* Quick view hint */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/95 backdrop-blur-sm text-espresso text-xs font-semibold text-center py-2 rounded-xl">
            View Details
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="section-label text-[10px] mb-1">{product.category}</p>
        <p className="text-sm font-semibold text-espresso leading-snug line-clamp-2 mb-3 group-hover:text-sand-700 transition-colors">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-espresso">ETB {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sand-300 text-xs line-through">ETB {product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
