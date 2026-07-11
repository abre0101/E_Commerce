import { useState } from "react";
import { categories } from "../data/mockData";
import useProductStore from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const getProducts = useProductStore((s) => s.getProducts);
  const [activeCategory, setActiveCategory] = useState("All");

  const products = getProducts();
  const filtered =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto px-5 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#C9A961" }}>
            Handpicked for you
          </p>
          <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#fff" }}>
            Our Collection
          </h1>
          <p className="text-sm" style={{ color: "#888" }}>
            Premium human hair — zero shedding, long-lasting.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-3 flex-wrap mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-5 py-2 text-sm font-medium border transition-all uppercase tracking-wider"
              style={
                activeCategory === c
                  ? { background: "#C9A961", color: "#111", borderColor: "#C9A961" }
                  : { background: "transparent", color: "#888", borderColor: "#333" }
              }
              onMouseEnter={(e) => {
                if (activeCategory !== c) {
                  e.currentTarget.style.borderColor = "#C9A961";
                  e.currentTarget.style.color = "#C9A961";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== c) {
                  e.currentTarget.style.borderColor = "#333";
                  e.currentTarget.style.color = "#888";
                }
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: "#555" }}>
            <p className="text-lg font-medium">No products in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
