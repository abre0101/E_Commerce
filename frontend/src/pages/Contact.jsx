import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const f = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B4F6D" }}>Get in Touch</p>
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#2a2220" }}>Contact Us</h1>
      <p className="text-sm mb-12" style={{ color: "#6b6361" }}>We'd love to hear from you. Send us a message and we'll get back to you shortly.</p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          {[
            { label: "Email", value: "yadeshidemisse@gmail.com", href: "mailto:yadeshidemisse@gmail.com" },
            { label: "Phone", value: "+251 91 123 4567", href: "tel:+251911234567" },
            { label: "Location", value: "Addis Ababa, Ethiopia", href: null },
          ].map((c) => (
            <div key={c.label}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#8B4F6D" }}>{c.label}</p>
              {c.href ? (
                <a href={c.href} className="text-sm font-medium hover:underline" style={{ color: "#2a2220" }}>{c.value}</a>
              ) : (
                <p className="text-sm font-medium" style={{ color: "#2a2220" }}>{c.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-serif text-xl font-bold mb-2" style={{ color: "#2a2220" }}>Message Sent!</p>
            <p className="text-sm" style={{ color: "#6b6361" }}>We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#6b6361" }}>Name</label>
              <input type="text" required placeholder="Your name" className="form-input" value={form.name} onChange={f("name")} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#6b6361" }}>Phone</label>
              <input type="tel" placeholder="+251 ..." className="form-input" value={form.phone} onChange={f("phone")} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#6b6361" }}>Email</label>
              <input type="email" placeholder="you@email.com" className="form-input" value={form.email} onChange={f("email")} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#6b6361" }}>Message</label>
              <textarea required rows={4} placeholder="How can we help?" className="form-input resize-none" value={form.message} onChange={f("message")} />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: "#8B4F6D" }}>
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="text-sm font-semibold underline underline-offset-4" style={{ color: "#8B4F6D" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
