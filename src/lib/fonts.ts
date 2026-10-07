import { Great_Vibes, IBM_Plex_Sans_Arabic, Inter, Playfair_Display } from "next/font/google";

// Self-hosted at build time by next/font (no layout shift, no external requests at runtime)
export const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: false, // only needed on /ar pages — don't make TR/EN visitors download it
});

// Calligraphic script used only in the "Şifa" wordmark of the logo
export const script = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const fontVariables = `${serif.variable} ${sans.variable} ${arabic.variable} ${script.variable}`;
