import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>
          Our Story
        </p>
        <h1 className="font-serif text-4xl font-bold mb-6" style={{ color: "#fff" }}>
          About Yada Hair
        </h1>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
          <img
            src="/asset/yadeshi pic.jfif"
            alt="Yadeshi Demisse"
            className="w-full object-cover object-top"
            style={{ maxHeight: 420 }}
          />
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#aaa" }}>
            <p>
              Yada Hair was founded by{" "}
              <strong style={{ color: "#fff" }}>Yadeshi Demisse</strong> with one goal: to give every
              woman access to premium quality human hair that looks natural, feels luxurious, and lasts.
            </p>
            <p>
              Every bundle and wig in our collection is hand-selected by Yadeshi herself — sourced from
              the finest raw human hair and inspected to meet her zero-shedding standard.
            </p>
            <p>
              Based in Ethiopia and serving customers across the country, Yada Hair is more than a shop
              — it's a commitment to quality, confidence, and care.
            </p>
            <div className="pt-4 space-y-1">
              <p className="font-bold" style={{ color: "#fff" }}>Yadeshi Demisse</p>
              <p style={{ color: "#C9A961" }}>Founder & Curator, Yada Hair</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          {[
            { value: "500+", label: "Happy Customers" },
            { value: "100%", label: "Human Hair" },
            { value: "2–3 yrs", label: "Lifespan Guaranteed" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-6 border"
              style={{ background: "#1a1a1a", borderColor: "rgba(201,169,97,0.15)" }}
            >
              <p className="font-serif font-bold text-3xl mb-1" style={{ color: "#C9A961" }}>
                {s.value}
              </p>
              <p className="text-xs uppercase tracking-wider" style={{ color: "#888" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 transition-all hover:opacity-90"
            style={{ background: "#C9A961", color: "#111" }}
          >
            Shop the Collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
