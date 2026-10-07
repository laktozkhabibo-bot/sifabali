import type { Metadata } from "next";
import { locales, localePath, ogLocale, type Locale } from "./i18n/config";
import { siteUrl } from "./utils";

/** Canonical + hreflang alternates for a storefront path */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteUrl}${localePath(l, path)}`;
  languages["x-default"] = `${siteUrl}${localePath("tr", path)}`;
  return { canonical: `${siteUrl}${localePath(locale, path)}`, languages };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  images,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "Şifa Balı",
      title,
      description,
      url: `${siteUrl}${localePath(locale, path)}`,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: (images?.length ? images : ["/og.png"]).map((u) => ({ url: u.startsWith("http") ? u : `${siteUrl}${u}` })),
    },
    twitter: { card: "summary_large_image", title, description, images: [images?.[0] ?? "/og.png"] },
  };
}
