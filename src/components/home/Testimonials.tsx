"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon, StarIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import type { SiteContent } from "@/lib/types";
import { cn, t } from "@/lib/utils";

/** Auto-advancing testimonial carousel (pauses on hover / focus) */
export function Testimonials({ testimonials }: { testimonials: SiteContent["testimonials"] }) {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const items = testimonials.items.filter((i) => t(i.text, locale));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduce || items.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => window.clearInterval(id);
  }, [paused, reduce, items.length]);

  if (!items.length) return null;
  const current = items[index % items.length];
  const go = (d: number) => setIndex((i) => (i + d + items.length) % items.length);

  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="testimonials-title">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">★★★★★</p>
          <h2 id="testimonials-title" className="h-section mt-4">{t(testimonials.title, locale)}</h2>
        </Reveal>

        <div
          className="relative mx-auto mt-14 max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <span aria-hidden className="absolute -top-16 start-0 font-serif text-[12rem] leading-none text-honey-300/40 rtl:start-auto rtl:end-0">“</span>
          <div className="relative min-h-[260px] rounded-[36px] bg-white/70 p-8 shadow-card ring-1 ring-charcoal/5 md:p-14" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex gap-1 text-honey-500" aria-label={`${current.rating}/5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} width={20} className={i < current.rating ? "" : "opacity-20"} />
                  ))}
                </div>
                <blockquote className="mt-6 font-serif text-2xl leading-snug text-charcoal md:text-3xl">{t(current.text, locale)}</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-honey-gradient font-serif text-lg font-bold text-charcoal">
                    {current.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold">{current.name}</span>
                    <span className="block text-sm text-charcoal-400">{current.city}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2" role="tablist">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn("h-2 rounded-full transition-all duration-500", i === index ? "w-10 bg-honey-500" : "w-2 bg-charcoal/20 hover:bg-charcoal/40")}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} aria-label="Önceki" className="grid h-12 w-12 place-items-center rounded-full border border-charcoal/10 transition hover:bg-charcoal hover:text-cream">
                <ArrowIcon width={18} className="rotate-180" />
              </button>
              <button onClick={() => go(1)} aria-label="Sonraki" className="grid h-12 w-12 place-items-center rounded-full border border-charcoal/10 transition hover:bg-charcoal hover:text-cream">
                <ArrowIcon width={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
