import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "What type of hair do you sell?",
    a: "We sell 100% raw human hair — unprocessed and directly sourced. All bundles and wigs are zero-shedding guaranteed.",
  },
  {
    q: "How long does the hair last?",
    a: "With proper care, our hair lasts 2–3 years. We recommend gentle washing, moisturizing, and avoiding excessive heat.",
  },
  {
    q: "Do you offer free delivery?",
    a: "Yes! We offer free delivery on all orders within Addis Ababa. For other regions, delivery fees may apply.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "We accept exchanges within 7 days of delivery if the product is unused and in its original packaging. Contact us to initiate an exchange.",
  },
  {
    q: "How do I book a consultation?",
    a: "You can book a consultation directly from our homepage or by contacting us via email or phone. Yadeshi will personally guide you to the best hair for your style.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers and mobile payment options. Payment details are provided at checkout.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Once your order is confirmed and shipped, you will receive updates via phone or email.",
  },
];

function Item({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "#e8e0dc" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center justify-between py-5 gap-4"
      >
        <span className="font-semibold text-sm" style={{ color: "#2a2220" }}>{q}</span>
        <span className="shrink-0 text-lg font-bold" style={{ color: "#8B4F6D" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="text-sm leading-relaxed pb-5" style={{ color: "#6b6361" }}>{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B4F6D" }}>Help Center</p>
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#2a2220" }}>Frequently Asked Questions</h1>
      <p className="text-sm mb-12" style={{ color: "#6b6361" }}>
        Can't find your answer? <a href="mailto:yadeshidemisse@gmail.com" className="underline" style={{ color: "#8B4F6D" }}>Email us</a>.
      </p>
      <div>
        {faqs.map((f) => <Item key={f.q} {...f} />)}
      </div>
      <div className="mt-12 text-center">
        <Link to="/" className="text-sm font-semibold underline underline-offset-4" style={{ color: "#8B4F6D" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
