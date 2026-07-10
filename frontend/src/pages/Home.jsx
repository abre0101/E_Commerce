import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { products, reviews } from "../data/mockData";
import ProductCard from "../components/ProductCard";

const featured = products.filter((p) => p.featured);

const SLIDES = [
  {
    image: null, // placeholder — replace with real image path
    tag: "Premium Human Hair · Ethiopia",
    heading: ["Enhance Your", "Natural Beauty", ""],
    sub: "Premium quality human hair extensions and wigs for every style.",
  },
  {
    image: "/asset/yada2.png",
    tag: "100% Raw Human Hair",
    heading: ["Discover Your", "Perfect Look", "Every Day"],
    sub: "Hand-selected bundles and wigs by Yadeshi Demisse. Crafted to feel natural and last for years.",
  },
  {
    image: "/asset/yada3.png",
    tag: "Zero Shedding · Guaranteed",
    heading: ["Confidence", "Starts With", "Great Hair"],
    sub: "From lace fronts to kinky curls — find your signature style with Yada Hair.",
  },
];

const FEATURES = [
  { icon: "✦", title: "Premium Quality", desc: "100% raw human hair, zero shedding guaranteed." },
  { icon: "✦", title: "Long-Lasting", desc: "Lasts 2–3 years with proper care." },
  { icon: "✦", title: "Satisfaction Guaranteed", desc: "Every product selected with you in mind." },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= count ? "text-gold-400" : "text-slate-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 350);
  };

  const next = () => manualGoTo((current + 1) % SLIDES.length);
  const prev = () => manualGoTo((current - 1 + SLIDES.length) % SLIDES.length);

  // Auto-advance every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Reset timer on manual nav
  const manualGoTo = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
  };

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden min-h-[600px]" style={{ background: "#2a2220" }}>
      {/* Full-bleed image background on mobile / right panel on desktop */}
      <div className="absolute inset-0 md:left-1/2 overflow-hidden">
        {SLIDES.map((s, i) =>
          s.image ? (
            <img key={i} src={s.image} alt=""
              className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            />
          ) : (
            <div key={i}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, background: "#3d2e2b" }}>
              <svg className="w-20 h-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                style={{ color: "rgba(201,169,97,0.4)" }} strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(201,169,97,0.5)" }}>
                Image Placeholder
              </p>
            </div>
          )
        )}
        {/* Overlay for text legibility on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a2220] via-[#2a2220]/70 to-transparent md:hidden" />
        {/* Desktop left edge fade */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-24"
          style={{ background: "linear-gradient(to right, #2a2220, transparent)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[600px] flex items-center">
        <div className="w-full md:w-[55%] py-20 md:py-0">

          {/* Tag */}
          <div
            key={`tag-${current}`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 animate-fade-in"
            style={{ background: "#8B4F6D", border: "1px solid #8B4F6D" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#C9A961" }} />
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#ffffff" }}>{slide.tag}</span>
          </div>

          {/* Heading */}
          <h1
            key={`h-${current}`}
            className="font-serif font-bold leading-[1.08] mb-6 animate-slide-up"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#f5f3f0" }}
          >
            {slide.heading[0]}<br />
            <em style={{ color: "#C9A961", fontStyle: "italic" }}>{slide.heading[1]}</em>
            {slide.heading[2] && <><br />{slide.heading[2]}</>}
          </h1>

          {/* Sub */}
          <p
            key={`sub-${current}`}
            className="text-base leading-relaxed mb-10 max-w-sm animate-fade-in"
            style={{ color: "#ede8e5" }}
          >
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link to="/shop" className="btn-primary px-8 py-4 text-sm rounded-2xl">
              Shop Collection
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-outline px-8 py-4 text-sm rounded-2xl">
              Book Consultation
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["/asset/astu.jpg", "/asset/akla.png", "/asset/yadeshi pic.jfif", "/asset/contactyada.png"].map((src, i) => (
                <img key={i} src={src} alt="Customer"
                  className="w-8 h-8 rounded-full object-cover object-top border-2"
                  style={{ borderColor: "#2a2220" }} />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <Stars />
                <span className="text-xs font-bold ml-1" style={{ color: "#1a1d23" }}>4.9</span>
              </div>
              <p className="text-xs" style={{ color: "#ede8e5" }}>Loved by 500+ customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 flex items-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => manualGoTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? "#8B4F6D" : "#555",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button onClick={() => manualGoTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "rgba(201,169,97,0.2)", color: "#C9A961" }}
        aria-label="Previous">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={() => manualGoTo((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "rgba(201,169,97,0.2)", color: "#C9A961" }}
        aria-label="Next">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 font-mono text-xs font-semibold hidden md:block"
        style={{ color: "#C9A961" }}>
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}

export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", treatment: "", date: "", reminder: false });
  const [submitted, setSubmitted] = useState(false);
  const f = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));

  return (
    <div>
      <HeroCarousel />

      {/* ── Stats bar ── */}
      <section className="bg-espresso text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-3 divide-x divide-white/10">
          {[
            { value: "500+", label: "Happy Customers" },
            { value: "100%", label: "Human Hair" },
            { value: "2–3 yrs", label: "Lifespan" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4">
              <p className="font-serif font-bold text-xl md:text-2xl text-gold-300">{s.value}</p>
              <p className="text-[11px] text-white/50 mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-6xl mx-auto px-6 py-20" style={{ background: "#f7f3f0" }}>
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label mb-2">Handpicked for you</p>
            <h2 className="font-serif text-4xl font-bold" style={{ color: "#2a2220" }}>
              Our Collection
            </h2>
            <p className="text-sm mt-2" style={{ color: "#6b6361" }}>
              Premium human hair — sourced, inspected, and curated by Yadeshi.
            </p>
          </div>
          <Link to="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-2xl border-2 transition-all"
            style={{ borderColor: "#8B4F6D", color: "#8B4F6D" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#8B4F6D"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B4F6D"; }}>
            Browse All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Hero product + grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Large featured card — first product */}
          {featured[0] && (
            <Link to={`/products/${featured[0].id}`}
              className="lg:col-span-5 group relative overflow-hidden rounded-3xl"
              style={{ minHeight: 480 }}>
              <img src={featured[0].images[0]} alt={featured[0].name}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              {/* Gradient */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(26,29,35,0.85) 0%, rgba(26,29,35,0.2) 50%, transparent 100%)" }} />
              {/* Sale badge */}
              {featured[0].originalPrice && (
                <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                  style={{ background: "#8B4F6D" }}>
                  Sale
                </span>
              )}
              {/* Category badge */}
              <div className="absolute top-4 right-4 z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ color: "#ffffff", background: "#8B4F6D" }}>
                  {featured[0].category}
                </p>
              </div>
              {/* Content */}
              <div className="absolute bottom-0 inset-x-0 p-6">
                <h3 className="font-serif text-2xl font-bold text-white mb-2 leading-tight">
                  {featured[0].name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold text-lg">ETB {featured[0].price.toLocaleString()}</span>
                    {featured[0].originalPrice && (
                      <span className="text-white/50 text-sm line-through ml-2">ETB {featured[0].originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    style={{ background: "#8B4F6D" }}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Right — 2×2 smaller cards */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-5">
            {featured.slice(1, 5).map((p) => (
              <Link key={p.id} to={`/products/${p.id}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-100"
                style={{ minHeight: 220 }}>
                <img src={p.images[0]} alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(26,29,35,0.75) 0%, transparent 55%)" }} />
                {p.originalPrice && (
                  <span className="absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                    style={{ background: "#8B4F6D" }}>
                    Sale
                  </span>
                )}
                {/* Category badge */}
                <div className="absolute top-3 right-3 z-10">
                  <p className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ color: "#ffffff", background: "#8B4F6D" }}>
                    {p.category}
                  </p>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-white/80 text-xs font-bold">ETB {p.price.toLocaleString()}</p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  style={{ background: "rgba(26,29,35,0.15)" }}>
                  <span className="text-white text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    View Details
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="md:hidden text-center mt-8">
          <Link to="/shop" className="btn-outline rounded-2xl px-8 text-sm">View All Products</Link>
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { icon: "✦", label: "100% Human Hair", sub: "Raw & unprocessed" },
            { icon: "↻", label: "Zero Shedding", sub: "Guaranteed quality" },
            { icon: "◎", label: "Free Delivery", sub: "On all orders" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "#ede8e5", border: "1px solid #ddd6d3" }}>
              <span className="text-lg shrink-0" style={{ color: "#8B4F6D" }}>{t.icon}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: "#2a2220" }}>{t.label}</p>
                <p className="text-[10px]" style={{ color: "#6b6361" }}>{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="overflow-hidden" style={{ background: "#f5f0f0" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 min-h-[620px]">

            {/* Left — large image with overlay details */}
            <div className="relative overflow-hidden min-h-[420px] md:min-h-0 flex items-end">
              <img src="/asset/choose.png" alt="Yada Hair premium quality"
                className="absolute inset-0 w-full h-full object-cover object-center" />
              {/* Gradient scrim - darker and more refined */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(45,45,45,0.75) 0%, rgba(45,45,45,0.3) 40%, transparent 70%)" }} />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />

              {/* Floating badge */}
              <div className="absolute top-8 left-8 px-4 py-3 rounded-2xl backdrop-blur-sm z-10"
                style={{ background: "rgba(139,79,109,0.95)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <p className="text-white font-serif font-bold text-2xl leading-none">4.9★</p>
                <p className="text-white/80 text-[11px] mt-0.5 uppercase tracking-wider">Avg. Rating</p>
              </div>

              {/* Bottom floating card */}
              <div className="absolute bottom-8 left-8 right-8 p-4 rounded-2xl backdrop-blur-sm z-10"
                style={{ background: "rgba(139,79,109,0.9)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 shrink-0">
                    {["/asset/astu.jpg", "/asset/akla.png", "/asset/contactyada.png"].map((src, i) => (
                      <img key={i} src={src} alt=""
                        className="w-8 h-8 rounded-full object-cover object-top border-2"
                        style={{ borderColor: "rgba(255,255,255,0.4)" }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">500+ happy customers</p>
                    <p className="text-white/70 text-[11px]">and growing every day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — content */}
            <div className="px-10 md:px-14 py-16 flex flex-col justify-center" style={{ background: "#f5f0f0" }}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
                style={{ color: "#8B4F6D" }}>Why Us</p>

              <h2 className="font-serif font-bold leading-[1.1] mb-4"
                style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#2a2220" }}>
                Why Choose<br />
                <span style={{ color: "#8B4F6D", fontStyle: "italic" }}>Yada Hair?</span>
              </h2>

              <p className="text-sm leading-relaxed mb-10" style={{ color: "#6b6361" }}>
                Every strand is sourced, inspected, and curated by Yadeshi herself — so you only receive the finest quality human hair, guaranteed.
              </p>

              {/* Feature list */}
              <div className="space-y-6 mb-10">
                {[
                  {
                    num: "01",
                    title: "100% Raw Human Hair",
                    desc: "Unprocessed, directly sourced. Soft, natural, and built to last 2–3 years with proper care.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    ),
                  },
                  {
                    num: "02",
                    title: "Zero Shedding Guarantee",
                    desc: "Tangle-free, shed-free bundles and wigs that maintain their luster through every wash and style.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                  },
                  {
                    num: "03",
                    title: "Satisfaction Guaranteed",
                    desc: "Every product is selected with your performance and care in mind. We stand behind our quality.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ),
                  },
                ].map((f) => (
                  <div key={f.num} className="flex items-start gap-4 group">
                    {/* Icon circle */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background: "rgba(139,79,109,0.12)", color: "#8B4F6D" }}>
                      {f.icon}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold tabular-nums" style={{ color: "#8B4F6D" }}>{f.num}</span>
                        <h3 className="text-sm font-bold" style={{ color: "#2a2220" }}>{f.title}</h3>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#6b6361" }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <Link to="/shop" className="btn-primary rounded-2xl px-8 py-4 text-sm">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="text-sm font-semibold transition-colors hover:underline underline-offset-4"
                  style={{ color: "#8B4F6D" }}>
                  Book a consultation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-6xl mx-auto px-6 py-20" style={{ background: "#f7f3f0" }}>
        <div className="text-center mb-12">
          <p className="section-label mb-3">Real Reviews</p>
          <h2 className="font-serif text-4xl font-bold" style={{ color: "#2a2220" }}>Don't Take Our Word For It</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.id}
              className="bg-white rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex gap-6">
              <img src={r.photo} alt={r.name}
                className="w-24 h-28 md:w-28 md:h-36 object-cover object-top rounded-2xl shrink-0" />
              <div className="flex flex-col justify-between">
                <div>
                  <Stars />
                  <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-4 italic">"{r.text}"</p>
                </div>
                <div>
                  <p className="font-bold text-espresso text-sm">{r.name}</p>
                  <p className="text-slate-400 text-xs">{r.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking ── */}
      <section id="contact" className="bg-champagne scroll-mt-20" style={{ background: "#ede8e5" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-stretch">
          <div className="md:w-[45%] overflow-hidden">
            <img src="/asset/contactyada.png" alt="Book with Yadeshi"
              className="w-full h-72 md:h-full object-cover object-top" />
          </div>
          <div className="md:w-[55%] px-8 md:px-12 py-14">
            <p className="section-label mb-3">Get in Touch</p>
            <h2 className="font-serif text-3xl font-bold" style={{ color: "#2a2220" }}>Book a Consultation</h2>
            <p className="text-sm mb-8" style={{ color: "#6b6361" }}>Get personalised advice directly from Yadeshi.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-serif text-xl font-bold text-espresso mb-2">Booking Received!</p>
                <p className="text-slate-400 text-sm">We'll reach out to confirm your appointment.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Name</label>
                    <input type="text" placeholder="Your name" required className="form-input" value={form.name} onChange={f("name")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Treatment</label>
                    <select required className="form-input" value={form.treatment} onChange={f("treatment")}>
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
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Phone</label>
                    <input type="tel" placeholder="+251" required className="form-input" value={form.phone} onChange={f("phone")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Date</label>
                    <input type="date" required className="form-input" value={form.date} onChange={f("date")} />
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-rose-500 shrink-0 cursor-pointer"
                    checked={form.reminder}
                    onChange={(e) => setForm((s) => ({ ...s, reminder: e.target.checked }))} />
                  <span className="text-xs font-medium" style={{ color: "#2a2220" }}>
                    Send me booking reminders via SMS/Email
                  </span>
                </label>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn-primary px-10 rounded-2xl">Book Now</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
