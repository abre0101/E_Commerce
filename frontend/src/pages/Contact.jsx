import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const f = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));

  const inputStyle = {
    borderColor: "#333",
    color: "#fff",
    background: "transparent",
  };

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>
          Get in Touch
        </p>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#fff" }}>
          Contact Us
        </h1>
        <p className="text-sm mb-12" style={{ color: "#888" }}>
          We'd love to hear from you. Send us a message and we'll get back to you shortly.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { label: "Email", value: "yadeshidemisse@gmail.com", href: "mailto:yadeshidemisse@gmail.com" },
              { label: "Phone", value: "+251 91 123 4567", href: "tel:+251911234567" },
              { label: "Location", value: "Addis Ababa, Ethiopia", href: null },
            ].map((c) => (
              <div key={c.label}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#C9A961" }}>
                  {c.label}
                </p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#ddd" }}
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="text-sm font-medium" style={{ color: "#ddd" }}>
                    {c.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div
                className="w-14 h-14 flex items-center justify-center mb-4"
                style={{ background: "rgba(34,197,94,0.15)" }}
              >
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-serif text-xl font-bold mb-2" style={{ color: "#fff" }}>
                Message Sent!
              </p>
              <p className="text-sm" style={{ color: "#888" }}>We'll get back to you soon.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="space-y-4"
            >
              {[
                { field: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
                { field: "phone", label: "Phone", type: "tel", placeholder: "+251 ...", required: false },
                { field: "email", label: "Email", type: "email", placeholder: "you@email.com", required: false },
              ].map(({ field, label, type, placeholder, required }) => (
                <div key={field}>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "#888" }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 text-sm border outline-none transition focus:border-yellow-500"
                    style={inputStyle}
                    value={form[field]}
                    onChange={f(field)}
                  />
                </div>
              ))}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: "#888" }}
                >
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 text-sm border outline-none transition resize-none focus:border-yellow-500"
                  style={inputStyle}
                  value={form.message}
                  onChange={f("message")}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
                style={{ background: "#C9A961", color: "#111" }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-sm font-semibold underline underline-offset-4"
            style={{ color: "#C9A961" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
