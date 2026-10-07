import { clsx, type ClassValue } from "clsx";
import type { Locale } from "./i18n/config";
import type { L10n } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Picks the text for a locale, falling back to Turkish then any non-empty value */
export function t(value: Partial<L10n> | undefined | null, locale: Locale): string {
  if (!value) return "";
  return value[locale]?.trim() || value.tr?.trim() || value.en?.trim() || value.ar?.trim() || "";
}

const priceFormatters = new Map<string, Intl.NumberFormat>();
/** Formats a Turkish Lira price: 1400 → "1.400 ₺" (tr/en) */
export function formatPrice(value: number, locale: Locale = "tr"): string {
  const key = locale;
  let f = priceFormatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale === "ar" ? "ar-u-nu-latn" : "tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    priceFormatters.set(key, f);
  }
  return `${f.format(value)} ₺`;
}

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
export function slugify(input: string): string {
  return input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Digits only — for wa.me links */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function whatsappLink(phone: string, text?: string): string {
  const base = `https://wa.me/${phoneDigits(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function effectivePrice(p: { price: number; salePrice: number | null }): number {
  return p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
