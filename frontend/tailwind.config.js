/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#1C0A00",
        gold: {
          50:  "#fdf8ee",
          100: "#f9edcc",
          200: "#f0d08a",
          300: "#e6b34a",
          400: "#d4952a",
          500: "#b87d1a",
        },
        sand: {
          50:  "#faf7f2",
          100: "#f3ece0",
          200: "#e8d9c4",
          300: "#d4bc99",
          400: "#b89970",
          500: "#9a7a50",
          600: "#7d6040",
          700: "#5e4530",
          800: "#3d2c1e",
          900: "#1c1209",
        },
        champagne: "#f7f0e6",
      },
      fontFamily: {
        sans:  ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        "sm":         "0 1px 3px 0 rgb(0 0 0 / 0.06)",
        "card":       "0 4px 20px 0 rgb(0 0 0 / 0.07)",
        "card-hover": "0 12px 40px 0 rgb(0 0 0 / 0.14)",
        "float":      "0 8px 32px -4px rgb(28 10 0 / 0.18)",
        "glow":       "0 0 40px 0 rgb(212 149 42 / 0.15)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "scale-in":   "scaleIn 0.2s ease-out",
        "shimmer":    "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        scaleIn:  { from: { opacity: 0, transform: "scale(0.96)" }, to: { opacity: 1, transform: "scale(1)" } },
        shimmer:  { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
