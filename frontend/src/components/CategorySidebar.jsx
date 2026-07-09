import { Link, useSearchParams } from "react-router-dom";
import { IconChevronRight } from "./Icons";

const CATEGORIES = [
  { name: "All listings",                       icon: "🏠" },
  { name: "Electronics",                        icon: "📱" },
  { name: "Car",                                icon: "🚗" },
  { name: "Fashion",                            icon: "👗" },
  { name: "House",                              icon: "🏡" },
  { name: "Furniture",                          icon: "🛋️" },
  { name: "Commercial equipment and tools",     icon: "🔧" },
  { name: "Health And Beauty",                  icon: "💄" },
  { name: "General",                            icon: "📦" },
  { name: "Art And Craft",                      icon: "🎨" },
  { name: "Services",                           icon: "🛠️" },
  { name: "Food And Beverages",                 icon: "🍎" },
];

export default function CategorySidebar() {
  const [params] = useSearchParams();
  const active = params.get("category") || "All listings";

  return (
    <aside className="w-52 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden self-start sticky top-[76px]">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Categories</p>
      </div>
      <nav>
        {CATEGORIES.map((cat) => {
          const isAll = cat.name === "All listings";
          const href = isAll ? "/products" : `/products?category=${encodeURIComponent(cat.name)}`;
          const isActive = isAll ? active === "All listings" : active === cat.name;

          return (
            <Link
              key={cat.name}
              to={href}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 border-b border-gray-50 last:border-0
                ${isActive
                  ? "bg-[#1a1a2e] text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="flex-1 leading-snug">{cat.name}</span>
              {isActive && <IconChevronRight size={13} className="text-white/60 shrink-0" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
