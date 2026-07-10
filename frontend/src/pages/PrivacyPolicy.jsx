import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8B4F6D" }}>Legal</p>
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#2a2220" }}>Privacy Policy</h1>
      <p className="text-xs mb-12" style={{ color: "#6b6361" }}>Last updated: January 2025</p>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#4a4240" }}>
        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>1. Information We Collect</h2>
          <p>We collect personal information you provide when placing an order or booking a consultation — including your name, phone number, and email address. We do not collect payment card details.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>2. How We Use Your Information</h2>
          <p>Your information is used solely to process orders, confirm bookings, and communicate with you about your purchase. We do not sell or share your data with third parties.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>3. Data Storage</h2>
          <p>Your data is stored securely and retained only as long as necessary to fulfill your order or consultation. You may request deletion of your data at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>4. Cookies</h2>
          <p>Our website may use essential cookies to improve your browsing experience. We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete personal information we hold about you. To exercise these rights, contact us at the email below.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "#2a2220" }}>6. Contact</h2>
          <p>Privacy-related inquiries: <a href="mailto:yadeshidemisse@gmail.com" className="underline" style={{ color: "#8B4F6D" }}>yadeshidemisse@gmail.com</a></p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="text-sm font-semibold underline underline-offset-4" style={{ color: "#8B4F6D" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
