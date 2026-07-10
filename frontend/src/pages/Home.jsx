import { Link } from "react-router-dom";
import { useState } from "react";
import { products, reviews } from "../data/mockData";
import ProductCard from "../components/ProductCard";

const featured = products.filter((p) => p.featured);

const FEATURES = [
  { icon: "✦", title: "Premium Quality", desc: "100% raw human hair, zero shedding guaranteed." },
  { icon: "✦", title: "Long-Lasting", desc: "Lasts 2–3 years with proper care." },
  { icon: "✦", title: "Satisfaction Guaranteed", desc: "Every product selected with you in mind." },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= count ? "text-gold-400" : "text-sand-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", treatment: "", date: "", reminder: false });
  const [submitted, setSubmitted] = useState(false);
  const f = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-champagne overflow-hidden min-h-[600px]">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #e8d9c4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f0d08a22 0%, transparent 50%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center min-h-[600px]">
          {/* Text */}
          <div className="flex-1 py-20 md:py-0 max-w-[520px]">
            <div className="inline-flex items-center gap-2 bg-espresso/8 border border-espresso/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-xs font-semibold text-sand-600 tracking-wide">Premium Human Hair · Ethiopia</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-[4rem] font-bold text-espresso leading-[1.08] mb-6">
              Enhance Your<br />
              <span className="italic text-sand-500">Natural</span> Beauty<br />
              With Exquisite Hair
            </h1>

            <p className="text-sand-500 text-base leading-relaxed mb-10 max-w-sm">
              Zero shedding. Softness that lasts. Premium wigs and bundles crafted for your confidence.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/shop"
                className="btn-primary px-8 py-4 text-sm rounded-2xl">
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
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {[
                  "/asset/astu.jpg",
                  "/asset/akla.png",
                  "/asset/yadeshi pic.jfif",
                  "/asset/contactyada.png",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Happy customer"
                    className="w-8 h-8 rounded-full object-cover object-top border-2 border-champagne"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5"><Stars /><span className="text-xs font-bold text-espresso ml-1">4.9</span></div>
                <p className="text-xs text-sand-400">Loved by 500+ customers</p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-end items-end self-end relative">
            {/* Decorative ring */}
            <div className="absolute right-8 bottom-8 w-72 h-72 rounded-full border border-sand-200/60 hidden md:block" />
            <div className="absolute right-14 bottom-14 w-52 h-52 rounded-full border border-sand-200/40 hidden md:block" />
            <img
              src="/asset/yadeshi pic.jfif"
              alt="Yadeshi Demisse showcasing Yada Hair"
              className="relative z-10 w-full max-w-[420px] object-cover object-top"
              style={{ maxHeight: 560 }}
            />
          </div>
        </div>
      </section>

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
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Handpicked for you</p>
            <h2 className="font-serif text-4xl font-bold text-espresso">Our Collection</h2>
          </div>
          <Link to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-sand-500 hover:text-espresso transition-colors group">
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="md:hidden text-center mt-8">
          <Link to="/shop" className="btn-outline rounded-2xl px-8 text-sm">View All Products</Link>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="bg-sand-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-stretch">
          <div className="md:w-[45%] relative overflow-hidden">
            <img src="/asset/shopping.webp" alt="Yada Hair quality"
              className="w-full h-80 md:h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-sand-50/20" />
          </div>

          <div className="md:w-[55%] px-8 md:px-14 py-16 flex flex-col justify-center">
            <p className="section-label mb-3">Why Us</p>
            <h2 className="font-serif text-4xl font-bold text-espresso mb-4 leading-tight">
              Why Choose<br />Yada Hair?
            </h2>
            <p className="text-sand-500 text-sm leading-relaxed mb-8">
              Every strand is sourced, inspected, and curated by Yadeshi herself — ensuring you receive only the finest quality hair.
            </p>
            <ul className="space-y-5 mb-10">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <span className="text-gold-400 font-bold text-lg mt-0.5 leading-none">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-espresso text-sm">{f.title}</p>
                    <p className="text-sand-400 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/shop" className="btn-primary self-start rounded-2xl">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Real Reviews</p>
          <h2 className="font-serif text-4xl font-bold text-espresso">Don't Take Our Word For It</h2>
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
                  <p className="text-sand-600 text-sm leading-relaxed mt-3 mb-4 italic">"{r.text}"</p>
                </div>
                <div>
                  <p className="font-bold text-espresso text-sm">{r.name}</p>
                  <p className="text-sand-400 text-xs">{r.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking ── */}
      <section id="contact" className="bg-champagne scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-stretch">
          <div className="md:w-[45%] overflow-hidden">
            <img src="/asset/contactyada.png" alt="Book with Yadeshi"
              className="w-full h-72 md:h-full object-cover object-top" />
          </div>

          <div className="md:w-[55%] px-8 md:px-12 py-14">
            <p className="section-label mb-3">Get in Touch</p>
            <h2 className="font-serif text-3xl font-bold text-espresso mb-2">Book a Consultation</h2>
            <p className="text-sand-400 text-sm mb-8">Get personalised advice directly from Yadeshi.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-serif text-xl font-bold text-espresso mb-2">Booking Received!</p>
                <p className="text-sand-400 text-sm">We'll reach out to confirm your appointment.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-sand-500 mb-2 uppercase tracking-wide">Name</label>
                    <input type="text" placeholder="Your name" required className="form-input" value={form.name} onChange={f("name")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sand-500 mb-2 uppercase tracking-wide">Treatment</label>
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
                    <label className="block text-xs font-semibold text-sand-500 mb-2 uppercase tracking-wide">Phone</label>
                    <input type="tel" placeholder="+251" required className="form-input" value={form.phone} onChange={f("phone")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sand-500 mb-2 uppercase tracking-wide">Date</label>
                    <input type="date" required className="form-input" value={form.date} onChange={f("date")} />
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-0.5 w-4 h-4 accent-espresso shrink-0"
                    checked={form.reminder}
                    onChange={(e) => setForm((s) => ({ ...s, reminder: e.target.checked }))} />
                  <span className="text-xs text-sand-400 group-hover:text-sand-600 transition-colors">
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
