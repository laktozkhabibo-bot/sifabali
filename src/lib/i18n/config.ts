export const locales = ["tr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = { tr: "Türkçe", en: "English", ar: "العربية" };
export const localeShort: Record<Locale, string> = { tr: "TR", en: "EN", ar: "AR" };
export const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US", ar: "ar_SA" };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Builds a locale-aware URL. Turkish (default) lives at the root without prefix:
 *   localePath("tr", "/magaza") → "/magaza"
 *   localePath("en", "/magaza") → "/en/magaza"
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Removes a locale prefix from a pathname: "/en/magaza" → "/magaza" */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname;
}
