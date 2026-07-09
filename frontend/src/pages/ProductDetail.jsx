import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IconCart, IconChevronRight, IconEye, IconHeart, IconMapPin, IconMessage, IconShare, IconStar } from "../components/Icons";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";
import toast from "react-hot-toast";

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data));
  }, [id]);

  if (!product) return <Spinner />;

  const inWishlist = user?.wishlist?.includes(id);

  const addToCart = () => {
    addItem({ id: product.id, title: product.title, price: product.price, images: product.images, seller_id: product.seller_id }, qty);
    toast.success("Added to cart");
  };

  const toggleWishlist = async () => {
    if (!user) { toast.error("Login to save items"); return; }
    await api.post(`/auth/wishlist/${id}`);
    toast.success(inWishlist ? "Removed from wishlist" : "Saved to wishlist");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Login to review"); return; }
    try {
      await api.post(`/products/${id}/review`, review);
      toast.success("Review submitted");
      const r = await api.get(`/products/${id}`);
      setProduct(r.data);
      setReview({ rating: 5, comment: "" });
    } catch { toast.error("Could not submit review"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-accent-500 transition-colors">Home</Link>
        <IconChevronRight size={12} />
        <Link to="/products" className="hover:text-accent-500 transition-colors">Products</Link>
        <IconChevronRight size={12} />
        <Link to={`/products?category=${product.category}`} className="hover:text-accent-500 transition-colors">{product.category}</Link>
        <IconChevronRight size={12} />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Image gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] relative group">
            <img
              src={product.images?.[imgIdx] || "https://placehold.co/600x450?text=No+Image"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button onClick={toggleWishlist}
              className={`absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-150 active:scale-90
                ${inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:text-red-400"}`}>
              {inWishlist ? <IconHeart size={16} /> : <IconHeart size={16} />}
            </button>
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-accent-500 shadow-sm" : "border-gray-200 opacity-70 hover:opacity-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${product.condition === "new" ? "badge-green" : "badge-orange"}`}>
              {product.condition?.toUpperCase()}
            </span>
            <span className="badge badge-purple">{product.category}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">{product.title}</h1>

          {/* Price */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 inline-block">
            <p className="text-3xl font-black text-gray-900">
              <span className="text-sm font-semibold text-gray-500 mr-1">ETB</span>
              {Number(product.price).toLocaleString()}
            </p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <IconMapPin size={14} className="text-gray-400" />{product.location}
            </span>
            {product.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <IconStar size={13} className="text-accent-400" />
                <span className="font-semibold text-gray-700">{product.rating}</span>
                <span className="text-gray-400">({product.review_count} reviews)</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <IconEye size={14} className="text-gray-400" />{product.views} views
            </span>
          </div>

          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(product.attributes).map(([k, v]) => (
                <span key={k} className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm">
                  <span className="text-gray-400">{k}:</span>{" "}
                  <span className="font-semibold text-gray-800">{v}</span>
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5 border-l-2 border-gray-200 pl-3">{product.description}</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition-colors">−</button>
              <span className="w-10 text-center font-bold text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                className="w-10 h-10 hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition-colors">+</button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={addToCart}
              className="btn-primary flex-1 sm:flex-none py-3 px-6">
              <IconCart size={16} /> Add to Cart
            </button>
            <button
              onClick={() => { if (!user) navigate("/login"); else navigate(`/messages/${product.seller_id}`); }}
              className="btn-accent flex-1 sm:flex-none py-3 px-6">
              <IconMessage size={16} /> Contact Seller
            </button>
          </div>

          {/* Seller card */}
          <Link to={`/sellers/${product.seller_id}`}
            className="mt-5 flex items-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-card rounded-2xl p-4 transition-all duration-200">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-brand text-white flex items-center justify-center font-bold text-base shrink-0">
              {product.seller_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">{product.seller_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Verified Seller</p>
            </div>
            <span className="text-xs text-accent-500 font-semibold flex items-center gap-1">
              View store <IconChevronRight size={12} />
            </span>
          </Link>
        </div>
      </div>

      {/* Reviews section */}
      <div className="border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Reviews
            <span className="text-sm font-normal text-gray-500 ml-2">({product.review_count || 0})</span>
          </h2>
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 bg-accent-50 px-3 py-1.5 rounded-xl">
              <IconStar size={14} className="text-accent-400" />
              <span className="font-bold text-accent-600 text-sm">{product.rating}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {product.reviews?.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                    {r.buyer_name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{r.buyer_name}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <IconStar key={n} size={12} className={n <= r.rating ? "text-accent-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
          {!product.reviews?.length && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm">No reviews yet. Be the first!</p>
            </div>
          )}
        </div>

        {user && (
          <form onSubmit={submitReview} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map((n) => (
                <button type="button" key={n} onClick={() => setReview({ ...review, rating: n })}
                  className={`text-3xl transition-all hover:scale-110 ${n <= review.rating ? "text-accent-400" : "text-gray-200"}`}>
                  ★
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience with this product..."
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              rows={3}
              className="form-input resize-none mb-4"
            />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
}
