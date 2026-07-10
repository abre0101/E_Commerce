import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B4F6D" }}>Legal</p>
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#2a2220" }}>Terms & Conditions</h1>
      <p className="text-xs mb-12" style={{ color: "#6b6361" }}>Last updated: January 2025</p>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#4a4240" }}>
        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>1. Acceptance of Terms</h2>
          <p>By accessing or purchasing from Yada Hair, you agree to be bound by these terms and conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>2. Products</h2>
          <p>All products sold by Yada Hair are 100% raw human hair. Product descriptions, images, and prices are subject to change without notice. We reserve the right to limit quantities.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>3. Orders & Payment</h2>
          <p>Orders are confirmed only upon receipt of payment. We accept bank transfers and approved mobile payment methods. Yada Hair is not liable for payment delays caused by third-party providers.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>4. Delivery</h2>
          <p>Free delivery is offered within Addis Ababa. Delivery timelines are estimates and may vary. Yada Hair is not responsible for delays caused by external factors.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>5. Returns & Exchanges</h2>
          <p>Exchanges are accepted within 7 days of delivery for unused, unaltered products in original packaging. We do not accept returns on used or altered hair products for hygiene reasons.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>6. Intellectual Property</h2>
          <p>All content on this website, including images, text, and branding, is the property of Yada Hair and may not be reproduced without written permission.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>7. Contact</h2>
          <p>For any questions regarding these terms, contact us at <a href="mailto:yadeshidemisse@gmail.com" className="underline" style={{ color: "#8B4F6D" }}>yadeshidemisse@gmail.com</a>.</p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="text-sm font-semibold underline underline-offset-4" style={{ color: "#8B4F6D" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
