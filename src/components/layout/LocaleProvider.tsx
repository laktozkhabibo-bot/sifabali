"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SiteContent } from "@/lib/types";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  contact: SiteContent["contact"];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ value, children }: { value: LocaleContextValue; children: React.ReactNode }) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
