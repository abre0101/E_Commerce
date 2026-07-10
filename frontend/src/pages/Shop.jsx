import { useState } from "react";
import { products, categories } from "../data/mockData";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12" style={{ background: "#f7f3f0" }}>
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2a2220" }}>Our Collection</h1>
      <p className="text-sm mb-8" style={{ color: "#6b6361" }}>Premium human hair — zero shedding, long-lasting.</p>

      {/* Category filter */}
      <div className="flex gap-3 flex-wrap mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-5 py-2 text-sm font-medium border transition-all rounded-lg`}
            style={
              activeCategory === c
                ? { background: "#8B4F6D", color: "#ffffff", borderColor: "#8B4F6D" }
                : { background: "transparent", color: "#6b6361", borderColor: "rgba(139,79,109,0.2)" }
            }
            onMouseEnter={(e) => {
              if (activeCategory !== c) {
                e.currentTarget.style.borderColor = "#8B4F6D";
                e.currentTarget.style.color = "#8B4F6D";
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== c) {
                e.currentTarget.style.borderColor = "rgba(139,79,109,0.2)";
                e.currentTarget.style.color = "#6b6361";
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
        <div className="text-center py-20" style={{ color: "#b8b8b8" }}>
          <p className="text-lg font-medium">No products in this category yet.</p>
        </div>
      )}
    </div>
  );
}
