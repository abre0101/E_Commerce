import { useState } from "react";
import { products, categories } from "../data/mockData";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-serif text-3xl font-bold text-brown-900 mb-2">Our Collection</h1>
      <p className="text-brown-500 text-sm mb-8">Premium human hair — zero shedding, long-lasting.</p>

      {/* Category filter */}
      <div className="flex gap-3 flex-wrap mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-5 py-2 text-sm font-medium border transition-colors ${
              activeCategory === c
                ? "bg-brown-800 text-white border-brown-800"
                : "bg-white text-brown-700 border-brown-200 hover:border-brown-500"
            }`}
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
        <div className="text-center py-20 text-brown-400">
          <p className="text-lg font-medium">No products in this category yet.</p>
        </div>
      )}
    </div>
  );
}
