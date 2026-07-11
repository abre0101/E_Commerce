import { Link } from "react-router-dom";

const sections = [
  { title: "1. Information We Collect", body: "We collect personal information you provide when placing an order or booking a consultation — including your name, phone number, and email address. We do not collect payment card details." },
  { title: "2. How We Use Your Information", body: "Your information is used solely to process orders, confirm bookings, and communicate with you about your purchase. We do not sell or share your data with third parties." },
  { title: "3. Data Storage", body: "Your data is stored securely and retained only as long as necessary to fulfill your order or consultation. You may request deletion of your data at any time by contacting us." },
  { title: "4. Cookies", body: "Our website may use essential cookies to improve your browsing experience. We do not use tracking or advertising cookies." },
  { title: "5. Your Rights", body: "You have the right to access, correct, or delete personal information we hold about you. To exercise these rights, contact us at the email below." },
  { title: "6. Contact", body: null },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>
          Legal
        </p>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#fff" }}>
          Privacy Policy
        </h1>
        <p className="text-xs mb-12" style={{ color: "#666" }}>Last updated: January 2025</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#aaa" }}>
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-bold text-base mb-2" style={{ color: "#fff" }}>{s.title}</h2>
              {s.body ? (
                <p>{s.body}</p>
              ) : (
                <p>
                  Privacy-related inquiries:{" "}
                  <a
                    href="mailto:yadeshidemisse@gmail.com"
                    className="underline"
                    style={{ color: "#C9A961" }}
                  >
                    yadeshidemisse@gmail.com
                  </a>
                </p>
              )}
            </section>
          ))}
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
