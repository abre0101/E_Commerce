/**
 * Chapa Payment Gateway integration
 * Docs: https://developer.chapa.co/docs
 *
 * In dev: calls go through the Vite proxy (/chapa → https://api.chapa.co)
 * In production: you need a backend to hold your secret key securely.
 * For now the key is stored in VITE_CHAPA_SECRET_KEY (env var).
 */

const SECRET_KEY = import.meta.env.VITE_CHAPA_SECRET_KEY;

// In dev use the Vite proxy path; in prod point to your backend relay
const BASE = import.meta.env.DEV ? "/chapa/v1" : "https://api.chapa.co/v1";

/**
 * Initialize a Chapa transaction.
 * Returns { checkout_url, tx_ref } on success.
 */
export async function initializePayment({ amount, email, firstName, lastName, phone, txRef }) {
  if (!SECRET_KEY) {
    throw new Error(
      "VITE_CHAPA_SECRET_KEY is not set. Copy .env.example to .env and add your Chapa key."
    );
  }

  const returnUrl = `${window.location.origin}/payment/verify?tx_ref=${txRef}`;

  // Normalize phone — Chapa expects +251XXXXXXXXX format
  const normalizedPhone = phone
    ? phone.replace(/\s+/g, "").replace(/^0/, "+251")
    : undefined;

  const payload = {
    amount: Number(amount),
    currency: "ETB",
    email,
    first_name: firstName || "Customer",
    last_name: lastName || ".",
    phone_number: normalizedPhone,
    tx_ref: txRef,
    return_url: returnUrl,
    customization: {
      title: "Yada Hair",
      description: "Premium human hair. Secure checkout.",
    },
  };

  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  // Log full response for debugging
  console.log("Chapa response:", JSON.stringify(data, null, 2));

  if (!res.ok || data.status !== "success") {
    const msg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(", ") : "Payment initialization failed.");
    throw new Error(msg);
  }

  return { checkoutUrl: data.data.checkout_url, txRef };
}

/**
 * Verify a Chapa transaction by tx_ref.
 * Returns the full transaction data on success.
 */
export async function verifyPayment(txRef) {
  if (!SECRET_KEY) throw new Error("VITE_CHAPA_SECRET_KEY is not set.");

  const res = await fetch(`${BASE}/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
  });

  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(data?.message || "Payment verification failed.");
  }

  return data.data;
}

/** Generate a unique transaction reference */
export function generateTxRef() {
  return `YADAHAIR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
