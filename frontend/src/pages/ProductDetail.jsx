import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/mockData";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLength, setSelectedLength] = useState(null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center text-brown-400">
        <p className="text-lg">Product not found.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedLength) return;
    if (!user) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    addItem(product, selectedLength);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-brown-400 mb-8 flex gap-2">
        <Link to="/" className="hover:text-brown-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brown-700">Shop</Link>
        <span>/</span>
        <span className="text-brown-700">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-[4/5] bg-brown-50 mb-3 overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-brown-700" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs text-brown-400 mb-2 uppercase tracking-wider">{product.category}</p>
          <h1 className="font-serif text-3xl font-bold text-brown-900 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-brown-800">ETB {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-brown-300 text-base line-through">ETB {product.originalPrice.toLocaleString()}</span>
            )}
            {product.originalPrice && (
              <span className="text-xs bg-brown-100 text-brown-600 font-semibold px-2 py-1">
                SALE
              </span>
            )}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-yellow-500" : "text-brown-200"}`}
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-brown-500">({product.reviewCount} reviews)</span>
          </div>

          <p className="text-brown-600 text-sm leading-relaxed mb-7">{product.description}</p>

          {/* Length selector */}
          <div className="mb-7">
            <p className="text-sm font-semibold text-brown-800 mb-3">Select Length</p>
            <div className="flex flex-wrap gap-2">
              {product.lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLength(l)}
                  className={`px-4 py-2 text-xs font-medium border transition-colors ${
                    selectedLength === l
                      ? "bg-brown-800 text-white border-brown-800"
                      : "bg-white text-brown-700 border-brown-200 hover:border-brown-600"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {!selectedLength && (
              <p className="text-xs text-brown-400 mt-2">Please select a length to add to cart.</p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedLength}
            className="btn-primary w-full text-base py-4"
          >
            {added ? "✓ Added to Cart" : user ? "Add to Cart" : "Sign In to Buy"}
          </button>

          {!user && (
            <p className="text-xs text-brown-400 text-center mt-3">
              <Link to="/login" state={{ from: `/products/${id}` }} className="underline hover:text-brown-700">Sign in</Link> or{" "}
              <Link to="/register" state={{ from: `/products/${id}` }} className="underline hover:text-brown-700">create an account</Link> to purchase.
            </p>
          )}
        </div>
      </div>

      {/* Related */}
      <div className="mt-20">
        <h2 className="font-serif text-2xl font-bold text-brown-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.filter((p) => p.id !== id).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
