import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n/config";

/** Resolves & validates the [locale] route param (Next 15 passes params as a Promise) */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
