"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/components/layout/LocaleProvider";
import { localePath } from "@/lib/i18n/config";

export default function NotFound() {
  const { locale, dict } = useLocale();
  return (
    <section className="container flex min-h-[80vh] flex-col items-center justify-center pt-[var(--header-h)] text-center">
      <motion.svg viewBox="0 0 200 200" className="h-40 w-40" initial={{ rotate: -20, scale: 0.6, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ type: "spring" }} aria-hidden>
        <path d="M100 8 L180 54 L180 146 L100 192 L20 146 L20 54 Z" fill="none" stroke="#E0961A" strokeWidth="5" strokeDasharray="12 10" />
        <text x="100" y="118" textAnchor="middle" fontSize="54" fontWeight="700" fill="#1B1814" style={{ fontFamily: "var(--font-serif)" }}>404</text>
      </motion.svg>
      <h1 className="mt-8 font-serif text-4xl md:text-5xl">{dict.notFound.title}</h1>
      <p className="mt-4 text-charcoal-400">{dict.notFound.text}</p>
      <Link href={localePath(locale, "/")} className="btn-primary mt-8">{dict.notFound.cta}</Link>
    </section>
  );
}
