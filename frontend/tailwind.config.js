/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      boxShadow: {
        card:       "0 4px 6px -1px rgba(0,0,0,0.06), 0 24px 48px -8px rgba(0,0,0,0.08)",
        "card-dark":"0 4px 6px -1px rgba(0,0,0,0.4),  0 24px 48px -8px rgba(0,0,0,0.5)",
        glow:       "0 0 0 3px rgba(139,92,246,0.25)",
        "glow-red": "0 0 24px rgba(239,68,68,0.3)",
        "glow-grn": "0 0 24px rgba(16,185,129,0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-light":
          "radial-gradient(ellipse 80% 60% at 50% -20%, #ede9fe 0%, #f0f4f8 60%)",
        "hero-dark":
          "radial-gradient(ellipse 80% 60% at 50% -20%, #1e1040 0%, #080d14 60%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-up":  "fade-up  0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-in":  "fade-in  0.3s ease both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [],
};
