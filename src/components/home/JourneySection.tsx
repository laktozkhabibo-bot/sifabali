"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/layout/LocaleProvider";
import { BeeIcon, FlowerIcon, HarvestIcon, HoneycombIcon, JarIcon } from "@/components/ui/Icons";
import { HexPattern } from "@/components/ui/HexPattern";
import type { SiteContent } from "@/lib/types";
import { cn, t } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [FlowerIcon, BeeIcon, HoneycombIcon, HarvestIcon, JarIcon];

/**
 * "Çiçekten Kavanoza" — pinned horizontal scroll story.
 * Vertical scrolling drives the horizontal track (GSAP ScrollTrigger + pin).
 * Falls back to a vertical list with reduced motion.
 */
export function JourneySection({ journey }: { journey: SiteContent["journey"] }) {
  const { locale, dict } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const rtl = locale === "ar";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => (rtl ? distance() : -distance()),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Each card's picture grows in gently as it scrolls into view (scroll-driven, never on hover)
      gsap.utils.toArray<HTMLElement>(track.querySelectorAll("[data-step-art]")).forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.88, opacity: 0.35 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, containerAnimation: tween, start: rtl ? "right 95%" : "left 95%", end: rtl ? "right 55%" : "left 55%", scrub: true, horizontal: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, [rtl, journey.steps.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream-200" aria-labelledby="journey-title">
      <HexPattern opacity={0.06} id="journey-hex" />
      <div className="flex min-h-[100svh] flex-col justify-center py-20 motion-reduce:min-h-0">
        <div className="container relative mb-10 flex flex-col justify-between gap-4 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{dict.home.step}</p>
            <h2 id="journey-title" className="h-section mt-4">{t(journey.title, locale)}</h2>
          </div>
          <p className="max-w-sm text-charcoal-400">{t(journey.subtitle, locale)}</p>
        </div>

        <div
          ref={trackRef}
          className="flex w-max gap-6 px-5 will-change-transform md:gap-8 md:px-[max(2rem,calc((100vw-1320px)/2+2rem))] motion-reduce:w-full motion-reduce:flex-col"
        >
          {journey.steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <article
                key={i}
                className="relative flex h-[70svh] min-h-[520px] w-[82vw] shrink-0 flex-col overflow-hidden rounded-[32px] bg-white p-6 shadow-card ring-1 ring-charcoal/5 sm:w-[60vw] md:p-10 lg:w-[38vw] motion-reduce:h-auto motion-reduce:w-full"
              >

                {/* Step picture — photos fill the frame, transparent PNG cut-outs are shown whole */}
                <div
                  data-step-art
                  className={cn(
                    "relative min-h-[180px] flex-1 motion-reduce:h-64 motion-reduce:flex-none",
                    step.fit === "contain" ? "" : "overflow-hidden rounded-3xl bg-honey-50",
                  )}
                >
                  {step.image ? (
                    <Image
                      src={step.image}
                      alt={t(step.title, locale)}
                      fill
                      sizes="(min-width:1024px) 34vw, 80vw"
                      className={step.fit === "contain" ? "object-contain drop-shadow-[0_18px_24px_rgba(94,55,21,.18)]" : "object-cover"}
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <Icon className="h-16 w-16 text-honey-400" />
                    </div>
                  )}
                </div>

                <div className="relative mt-6 flex items-end gap-5">
                  <span className="font-serif text-6xl font-semibold leading-none text-honey-500/25 md:text-7xl">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl">{t(step.title, locale)}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-charcoal-500 md:text-lg">{t(step.text, locale)}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="container mt-10 motion-reduce:hidden">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-charcoal/10">
            <div ref={progressRef} className="h-full origin-left bg-honey-500 rtl:origin-right" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}