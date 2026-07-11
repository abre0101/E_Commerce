import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useProductStore from "../store/useProductStore";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const getProducts = useProductStore((s) => s.getProducts);
  const product = getProducts().find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLength, setSelectedLength] = useState(null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: "#888" }}>Product not found.</p>
          <Link to="/shop" className="inline-block px-8 py-3.5 text-sm font-bold uppercase tracking-widest"
            style={{ background: "#C9A961", color: "#111" }}>Back to Shop</Link>
        </div>
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
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs mb-8 flex gap-2" style={{ color: "#666" }}>
        <Link to="/" className="hover:underline" style={{ color: "#C9A961" }}>Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:underline" style={{ color: "#C9A961" }}>Shop</Link>
        <span>/</span>
        <span style={{ color: "#aaa" }}>{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-[4/5] mb-3 overflow-hidden" style={{ background: "#1a1a1a" }}>
            <img src={product.images[selectedImage]} alt={product.name}
              className="w-full h-full object-cover object-top" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className="w-16 h-20 overflow-hidden border-2 transition-colors"
                  style={{ borderColor: selectedImage === i ? "#C9A961" : "transparent" }}>
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: "#C9A961" }}>{product.category}</p>
          <h1 className="font-serif text-3xl font-bold mb-4" style={{ color: "#fff" }}>{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold" style={{ color: "#fff" }}>ETB {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-base line-through" style={{ color: "#555" }}>ETB {product.originalPrice.toLocaleString()}</span>
            )}
            {product.originalPrice && (
              <span className="text-xs font-semibold px-2 py-1" style={{ background: "rgba(201,169,97,0.15)", color: "#C9A961" }}>
                SALE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-4 h-4"
                  style={{ color: s <= Math.round(product.rating) ? "#C9A961" : "#333" }}
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs" style={{ color: "#888" }}>({product.reviewCount} reviews)</span>
          </div>

          <p className="text-sm leading-relaxed mb-7" style={{ color: "#aaa" }}>{product.description}</p>

          <div className="mb-7">
            <p className="text-sm font-semibold mb-3" style={{ color: "#fff" }}>Select Length</p>
            <div className="flex flex-wrap gap-2">
              {product.lengths.map((l) => (
                <button key={l} onClick={() => setSelectedLength(l)}
                  className="px-4 py-2 text-xs font-medium border transition-all"
                  style={
                    selectedLength === l
                      ? { background: "#C9A961", color: "#111", borderColor: "#C9A961" }
                      : { background: "transparent", color: "#aaa", borderColor: "#333" }
                  }
                  onMouseEnter={(e) => { if (selectedLength !== l) { e.currentTarget.style.borderColor = "#C9A961"; e.currentTarget.style.color = "#C9A961"; } }}
                  onMouseLeave={(e) => { if (selectedLength !== l) { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa"; } }}>
                  {l}
                </button>
              ))}
            </div>
            {!selectedLength && (
              <p className="text-xs mt-2" style={{ color: "#666" }}>Please select a length to add to cart.</p>
            )}
          </div>

          <button onClick={handleAddToCart} disabled={!selectedLength}
            className="w-full py-4 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: "#C9A961", color: "#111" }}>
            {added ? "✓ Added to Cart" : user ? "Add to Cart" : "Sign In to Buy"}
          </button>

          {!user && (
            <p className="text-xs text-center mt-3" style={{ color: "#666" }}>
              <Link to="/login" state={{ from: `/products/${id}` }} className="underline" style={{ color: "#C9A961" }}>Sign in</Link>{" "}
              or{" "}
              <Link to="/register" state={{ from: `/products/${id}` }} className="underline" style={{ color: "#C9A961" }}>create an account</Link> to purchase.
            </p>
          )}
        </div>
      </div>

      {/* Related */}
      <div className="mt-20">
        <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: "#fff" }}>You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {getProducts().filter((p) => p.id !== id).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
