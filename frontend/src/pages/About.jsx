import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B4F6D" }}>Our Story</p>
      <h1 className="font-serif text-4xl font-bold mb-6" style={{ color: "#2a2220" }}>About Yada Hair</h1>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        <img
          src="/asset/yadeshi pic.jfif"
          alt="Yadeshi Demisse"
          className="w-full rounded-3xl object-cover object-top"
          style={{ maxHeight: 420 }}
        />
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#4a4240" }}>
          <p>
            Yada Hair was founded by <strong style={{ color: "#2a2220" }}>Yadeshi Demisse</strong> with one goal: to give every woman access to premium quality human hair that looks natural, feels luxurious, and lasts.
          </p>
          <p>
            Every bundle and wig in our collection is hand-selected by Yadeshi herself — sourced from the finest raw human hair and inspected to meet her zero-shedding standard.
          </p>
          <p>
            Based in Ethiopia and serving customers across the country, Yada Hair is more than a shop — it's a commitment to quality, confidence, and care.
          </p>
          <div className="pt-4 space-y-1">
            <p className="font-bold" style={{ color: "#2a2220" }}>Yadeshi Demisse</p>
            <p style={{ color: "#8B4F6D" }}>Founder & Curator, Yada Hair</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-14">
        {[
          { value: "500+", label: "Happy Customers" },
          { value: "100%", label: "Human Hair" },
          { value: "2–3 yrs", label: "Lifespan Guaranteed" },
        ].map((s) => (
          <div key={s.label} className="text-center p-6 rounded-2xl" style={{ background: "#f5f0f0" }}>
            <p className="font-serif font-bold text-3xl mb-1" style={{ color: "#8B4F6D" }}>{s.value}</p>
            <p className="text-xs uppercase tracking-wider" style={{ color: "#6b6361" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-2xl text-white"
          style={{ background: "#8B4F6D" }}>
          Shop the Collection →
        </Link>
      </div>
    </div>
  );
}
