import localFont from "next/font/local";

/**
 * Fonts are bundled with the project (src/fonts/*.woff2) — nothing is downloaded from
 * Google Fonts at build or dev time, so the site works and builds even without access
 * to fonts.googleapis.com. Files are subset to Latin + Turkish (+ ₺) / Arabic.
 */

export const serif = localFont({
  src: [
    { path: "../fonts/PlayfairDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/PlayfairDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/PlayfairDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const sans = localFont({
  src: [
    { path: "../fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const arabic = localFont({
  src: [
    { path: "../fonts/IBMPlexSansArabic-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexSansArabic-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/IBMPlexSansArabic-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: false, // only needed on /ar pages — don't make TR/EN visitors download it
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

// Calligraphic script used only in the "Şifa" wordmark of the logo
export const script = localFont({
  src: [{ path: "../fonts/GreatVibes-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-script",
  display: "swap",
  fallback: ["cursive"],
});

export const fontVariables = `${serif.variable} ${sans.variable} ${arabic.variable} ${script.variable}`;
