"use client";

import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { HexPattern } from "@/components/ui/HexPattern";
import { FlaskIcon, LeafIcon, MountainIcon, TruckIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import type { SiteContent } from "@/lib/types";
import { t } from "@/lib/utils";

const ICONS = [LeafIcon, FlaskIcon, MountainIcon, TruckIcon];

/** "Neden Şifa Balı?" feature grid + animated counters */
export function WhySection({ why, stats }: { why: SiteContent["why"]; stats: SiteContent["stats"] }) {
  const { locale, dict } = useLocale();
  const numberLocale = locale === "tr" ? "tr-TR" : locale === "ar" ? "ar-u-nu-latn" : "en-US";

  return (
    <section className="relative overflow-hidden bg-charcoal py-24 text-cream md:py-32" aria-labelledby="why-title">
      <HexPattern color="#E0961A" opacity={0.07} id="why-hex" />
      <div className="pointer-events-none absolute -end-40 top-20 h-[30rem] w-[30rem] rounded-full bg-honey-500/15 blur-3xl" />
      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center text-honey-300 before:bg-honey-400">Şifa Balı</p>
          <h2 id="why-title" className="h-section mt-4 text-cream">{t(why.title, locale)}</h2>
          <p className="mt-5 text-lg text-cream/60">{t(why.subtitle, locale)}</p>
        </Reveal>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {why.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem key={i}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-cream/10 bg-cream/[0.03] p-8 transition-colors duration-500 hover:border-honey-500/40 hover:bg-cream/[0.06]">
                  <div className="relative mb-8 grid h-16 w-16 place-items-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-honey-500/15 transition-all duration-700 group-hover:rotate-90 group-hover:text-honey-500" aria-hidden>
                      <path d="M50 3 L91 26.5 L91 73.5 L50 97 L9 73.5 L9 26.5 Z" fill="currentColor" />
                    </svg>
                    <Icon className="relative h-7 w-7 text-honey-300 transition-colors duration-500 group-hover:text-charcoal" />
                  </div>
                  <h3 className="font-serif text-2xl text-cream">{t(item.title, locale)}</h3>
                  <p className="mt-3 leading-relaxed text-cream/60">{t(item.text, locale)}</p>
                  <span className="absolute end-6 top-6 font-serif text-5xl text-cream/[0.06]">0{i + 1}</span>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Animated counters */}
        <div className="mt-20 grid gap-10 border-t border-cream/10 pt-16 text-center sm:grid-cols-3">
          {[
            { v: stats.customers, s: "+", label: dict.home.stats.customers },
            { v: stats.hives, s: "", label: dict.home.stats.hives },
            { v: stats.years, s: "", label: dict.home.stats.years },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <p className="font-serif text-6xl font-semibold text-gradient md:text-7xl">
                <Counter value={s.v} suffix={s.s} locale={numberLocale} />
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-cream/50 rtl:tracking-normal">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
