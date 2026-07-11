import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products, reviews } from "../data/mockData";
import ProductCard from "../components/ProductCard";

const featured = products.filter((p) => p.featured);

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= count ? "" : "opacity-20"}`}
          fill={s <= count ? "#C9A961" : "#999"} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const HERO_IMAGES = ["/asset/hero4.png", "/asset/hero5.png"];

// ── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full" style={{ height: "100vh", minHeight: 640, background: "#0d0d0d" }}>
      {/* Background images — crossfade */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
          }}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.15) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d0d0d 0%, transparent 25%)" }} />

      {/* Content */}
      <div className="absolute inset-0 flex items-center pb-24">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="max-w-xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 40, height: 1, background: "#C9A961" }} />
              <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "#C9A961" }}>
                Premium Human Hair
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-serif font-black uppercase leading-none mb-2"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", color: "#fff", letterSpacing: "-0.02em" }}
            >
              Luxury
            </h1>
            <h1
              className="font-serif font-black uppercase leading-none mb-6"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", color: "#C9A961", letterSpacing: "-0.02em" }}
            >
              Redefined.
            </h1>

            {/* Subtext */}
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 340 }}>
              Handpicked raw human hair — sourced and curated by Yadeshi for women who demand the finest.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
                style={{ background: "#C9A961", color: "#111" }}
              >
                Shop Now
              </Link>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
                style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 animate-pulse" style={{ background: "rgba(201,169,97,0.5)" }} />
      </div>
    </section>
  );
}

// ── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", treatment: "", date: "", reminder: false });
  const [submitted, setSubmitted] = useState(false);
  const f = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));

  return (
    <div style={{ background: "#0d0d0d" }}>
      <Hero />

      {/* ── Featured Products ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#C9A961" }}>
              Handpicked for you
            </p>
            <h2 className="font-serif text-4xl font-bold" style={{ color: "#fff" }}>
              Our Collection
            </h2>
            <p className="text-sm mt-2" style={{ color: "#aaa" }}>
              Premium human hair — sourced, inspected, and curated by Yadeshi.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 border transition-all"
            style={{ borderColor: "#C9A961", color: "#C9A961" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C9A961"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9A961"; }}
          >
            Browse All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {featured[0] && (
            <Link to={`/products/${featured[0].id}`}
              className="lg:col-span-5 group relative overflow-hidden"
              style={{ minHeight: 480 }}>
              <img src={featured[0].images[0]} alt={featured[0].name}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
              {featured[0].originalPrice && (
                <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 uppercase tracking-wider text-black"
                  style={{ background: "#C9A961" }}>Sale</span>
              )}
              <div className="absolute bottom-0 inset-x-0 p-6">
                <h3 className="font-serif text-2xl font-bold text-white mb-2 leading-tight">{featured[0].name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold text-lg">ETB {featured[0].price.toLocaleString()}</span>
                    {featured[0].originalPrice && (
                      <span className="text-white/50 text-sm line-through ml-2">ETB {featured[0].originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="lg:col-span-7 grid grid-cols-2 gap-5">
            {featured.slice(1, 5).map((p) => (
              <Link key={p.id} to={`/products/${p.id}`}
                className="group relative overflow-hidden"
                style={{ minHeight: 220, background: "#1a1a1a" }}>
                <img src={p.images[0]} alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)" }} />
                {p.originalPrice && (
                  <span className="absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider text-black"
                    style={{ background: "#C9A961" }}>Sale</span>
                )}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-white/80 text-xs font-bold">ETB {p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:hidden text-center mt-8">
          <Link to="/shop"
            className="inline-block text-sm font-bold uppercase tracking-widest px-8 py-3 border"
            style={{ borderColor: "#C9A961", color: "#C9A961" }}>
            View All Products
          </Link>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section style={{ background: "#0a0a0a" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 min-h-[540px]">
            <div className="relative overflow-hidden min-h-[380px] md:min-h-0">
              <img src="/asset/choose.png" alt="Yada Hair premium quality"
                className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              <div className="absolute top-8 left-8 px-4 py-3"
                style={{ background: "rgba(201,169,97,0.95)" }}>
                <p className="font-serif font-bold text-2xl leading-none text-black">4.9★</p>
                <p className="text-black/70 text-[11px] mt-0.5 uppercase tracking-wider">Avg. Rating</p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 p-4"
                style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(201,169,97,0.3)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 shrink-0">
                    {["/asset/astu.jpg", "/asset/akla.png", "/asset/contactyada.png"].map((src, i) => (
                      <img key={i} src={src} alt=""
                        className="w-8 h-8 rounded-full object-cover object-top border-2"
                        style={{ borderColor: "rgba(201,169,97,0.5)" }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">500+ happy customers</p>
                    <p className="text-white/60 text-[11px]">and growing every day</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-14 py-10 md:py-16 flex flex-col justify-center" style={{ background: "#111" }}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: "#C9A961" }}>Why Us</p>
              <h2 className="font-serif font-bold leading-[1.1] mb-4"
                style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#fff" }}>
                Why Choose<br />
                <span style={{ color: "#C9A961", fontStyle: "italic" }}>Yada Hair?</span>
              </h2>
              <p className="text-sm leading-relaxed mb-10" style={{ color: "#999" }}>
                Every strand is sourced, inspected, and curated by Yadeshi herself — so you only receive the finest quality human hair, guaranteed.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { num: "01", title: "100% Raw Human Hair", desc: "Unprocessed, directly sourced. Soft, natural, and built to last 2–3 years with proper care." },
                  { num: "02", title: "Zero Shedding Guarantee", desc: "Tangle-free, shed-free bundles and wigs that maintain their luster through every wash and style." },
                  { num: "03", title: "Satisfaction Guaranteed", desc: "Every product is selected with your performance and care in mind. We stand behind our quality." },
                ].map((f) => (
                  <div key={f.num} className="flex items-start gap-4">
                    <span className="text-xs font-bold tabular-nums shrink-0 mt-1" style={{ color: "#C9A961" }}>{f.num}</span>
                    <div>
                      <h3 className="text-sm font-bold mb-1" style={{ color: "#fff" }}>{f.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link to="/shop"
                  className="px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
                  style={{ background: "#C9A961", color: "#111" }}>
                  Shop Now
                </Link>
                <a href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="text-sm font-semibold hover:underline underline-offset-4 transition-colors"
                  style={{ color: "#C9A961" }}>
                  Book a consultation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>Real Reviews</p>
          <h2 className="font-serif text-4xl font-bold" style={{ color: "#fff" }}>Don't Take Our Word For It</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.id}
              className="flex gap-6 p-7"
              style={{ background: "#1a1a1a", border: "1px solid rgba(201,169,97,0.15)" }}>
              <img src={r.photo} alt={r.name}
                className="w-24 h-28 md:w-28 md:h-36 object-cover object-top shrink-0" />
              <div className="flex flex-col justify-between">
                <div>
                  <Stars />
                  <p className="text-sm leading-relaxed mt-3 mb-4 italic" style={{ color: "#bbb" }}>"{r.text}"</p>
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#fff" }}>{r.name}</p>
                  <p className="text-xs" style={{ color: "#666" }}>{r.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking ── */}
      <section id="contact" className="scroll-mt-20" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(201,169,97,0.15)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-stretch">
          <div className="md:w-[45%] overflow-hidden">
            <img src="/asset/contactyada.png" alt="Book with Yadeshi"
              className="w-full h-56 md:h-full object-cover object-top" />
          </div>
          <div className="md:w-[55%] px-6 md:px-12 py-10 md:py-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>Get in Touch</p>
            <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: "#fff" }}>Book a Consultation</h2>
            <p className="text-sm mb-8" style={{ color: "#999" }}>Get personalised advice directly from Yadeshi.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-900/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-serif text-xl font-bold mb-2" style={{ color: "#fff" }}>Booking Received!</p>
                <p className="text-sm" style={{ color: "#999" }}>We'll reach out to confirm your appointment.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#888" }}>Name</label>
                    <input type="text" placeholder="Your name" required
                      className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition focus:border-yellow-500"
                      style={{ borderColor: "#333", color: "#fff" }}
                      value={form.name} onChange={f("name")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#888" }}>Treatment</label>
                    <select required
                      className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition focus:border-yellow-500"
                      style={{ borderColor: "#333", color: form.treatment ? "#fff" : "#666", background: "#111" }}
                      value={form.treatment} onChange={f("treatment")}>
                      <option value="">Select</option>
                      <option>Wig Installation</option>
                      <option>Hair Styling</option>
                      <option>Consultation</option>
                      <option>Bundle Selection</option>
                      <option>Custom Wig Order</option>
                      <option>Hair Treatment</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#888" }}>Phone</label>
                    <input type="tel" placeholder="+251" required
                      className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition focus:border-yellow-500"
                      style={{ borderColor: "#333", color: "#fff" }}
                      value={form.phone} onChange={f("phone")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#888" }}>Date</label>
                    <input type="date" required
                      className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition focus:border-yellow-500"
                      style={{ borderColor: "#333", color: "#fff", colorScheme: "dark" }}
                      value={form.date} onChange={f("date")} />
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group p-3 transition-colors"
                  style={{ border: "1px solid #222" }}>
                  <input type="checkbox" className="mt-1 w-4 h-4 shrink-0 cursor-pointer accent-yellow-500"
                    checked={form.reminder}
                    onChange={(e) => setForm((s) => ({ ...s, reminder: e.target.checked }))} />
                  <span className="text-xs font-medium" style={{ color: "#aaa" }}>
                    Send me booking reminders via SMS/Email
                  </span>
                </label>
                <div className="flex justify-end pt-2">
                  <button type="submit"
                    className="px-10 py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
                    style={{ background: "#C9A961", color: "#111" }}>
                    Book Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
