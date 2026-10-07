import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1320px" } },
    extend: {
      colors: {
        honey: {
          50: "#FFF8E8",
          100: "#FDEBC0",
          200: "#FAD98A",
          300: "#F6C453",
          400: "#EFAE2A",
          500: "#E0961A", // primary amber
          600: "#C27612",
          700: "#9A5A12",
          800: "#7A4716",
          900: "#5E3715",
        },
        charcoal: {
          DEFAULT: "#1B1814",
          50: "#F4F2EF",
          100: "#E6E2DC",
          200: "#C9C2B8",
          300: "#9E958A",
          400: "#6F675D",
          500: "#4A443C",
          600: "#35302A",
          700: "#27231E",
          800: "#1B1814",
          900: "#120F0C",
        },
        cream: {
          DEFAULT: "#FBF6EC",
          50: "#FFFDF8",
          100: "#FBF6EC",
          200: "#F5ECDA",
          300: "#EDDFC3",
        },
        olive: {
          300: "#B5B98A",
          400: "#959A63",
          500: "#6F7543",
          600: "#565C33",
          700: "#434828",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(224,150,26,0.45)",
        card: "0 1px 2px rgba(27,24,20,.04), 0 12px 40px -12px rgba(27,24,20,.18)",
        lift: "0 30px 60px -20px rgba(94,55,21,.35)",
      },
      backgroundImage: {
        "honey-gradient": "linear-gradient(135deg,#F6C453 0%,#E0961A 45%,#9A5A12 100%)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "none" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "char-in": { from: { opacity: "0", transform: "translateY(0.6em)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up .7s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .5s ease-out both",
        "char-in": "char-in .6s cubic-bezier(.22,1,.36,1) both",
        "page-in": "fade-in .25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
