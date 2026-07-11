import { Link } from "react-router-dom";

const sections = [
  { title: "1. Acceptance of Terms", body: "By accessing or purchasing from Yada Hair, you agree to be bound by these terms and conditions. If you do not agree, please do not use our services." },
  { title: "2. Products", body: "All products sold by Yada Hair are 100% raw human hair. Product descriptions, images, and prices are subject to change without notice. We reserve the right to limit quantities." },
  { title: "3. Orders & Payment", body: "Orders are confirmed only upon receipt of payment. We accept bank transfers and approved mobile payment methods. Yada Hair is not liable for payment delays caused by third-party providers." },
  { title: "4. Delivery", body: "Free delivery is offered within Addis Ababa. Delivery timelines are estimates and may vary. Yada Hair is not responsible for delays caused by external factors." },
  { title: "5. Returns & Exchanges", body: "Exchanges are accepted within 7 days of delivery for unused, unaltered products in original packaging. We do not accept returns on used or altered hair products for hygiene reasons." },
  { title: "6. Intellectual Property", body: "All content on this website, including images, text, and branding, is the property of Yada Hair and may not be reproduced without written permission." },
  { title: "7. Contact", body: null },
];

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#C9A961" }}>
          Legal
        </p>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#fff" }}>
          Terms & Conditions
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
                  For any questions regarding these terms, contact us at{" "}
                  <a
                    href="mailto:yadeshidemisse@gmail.com"
                    className="underline"
                    style={{ color: "#C9A961" }}
                  >
                    yadeshidemisse@gmail.com
                  </a>
                  .
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
