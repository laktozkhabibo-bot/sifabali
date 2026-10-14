"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/layout/LocaleProvider";
import { BeeIcon, FlowerIcon, HarvestIcon, HoneycombIcon, JarIcon } from "@/components/ui/Icons";
import type { SiteContent } from "@/lib/types";
import { cn, t } from "@/lib/utils";

const ICONS = [FlowerIcon, BeeIcon, HoneycombIcon, HarvestIcon, JarIcon];
const EASE = [0.22, 1, 0.36, 1] as const;

type Step = SiteContent["journey"]["steps"][number];

/** One step picture: photos fill the frame, transparent PNG cut-outs float on a warm backdrop */
function StepPicture({ step, alt, sizes, priority = false }: { step: Step; alt: string; sizes: string; priority?: boolean }) {
  if (!step.image) return null;
  const contain = step.fit === "contain";
  return (
    <Image
      src={step.image}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={contain ? "object-contain p-[9%] drop-shadow-[0_24px_30px_rgba(94,55,21,.22)]" : "object-cover"}
    />
  );
}

/**
 * "Çiçekten Kavanoza" — sticky storytelling.
 * Desktop: a large sticky picture on one side cross-fades (with a gentle zoom) as the story
 * scrolls on the other side; a golden progress line fills and each step's dot lights up.
 * Mobile: an elegant vertical timeline, each step revealing its picture and text.
 */
export function JourneySection({ journey }: { journey: SiteContent["journey"] }) {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const steps = journey.steps;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Golden progress line follows the scroll through the steps
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // The step crossing the middle of the screen becomes active
  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  const current = steps[active] ?? steps[0];
  const lightStage = current?.fit === "contain"; // transparent cut-out on the cream backdrop

  return (
    <section className="relative bg-cream-200 py-24 md:py-32" aria-labelledby="journey-title">
      <div className="container">
        {/* Heading */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="eyebrow justify-center">{dict.home.step}</p>
          <h2 id="journey-title" className="h-section mt-4">{t(journey.title, locale)}</h2>
          <p className="mt-5 text-lg text-charcoal-500">{t(journey.subtitle, locale)}</p>
        </motion.div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* ── Sticky picture stage (desktop) ── */}
          <div className="hidden lg:block">
            {/* sticky area = the visible screen below the header; the picture is centred in it
                and sized by the screen height, so it is always shown complete */}
            <div className="sticky top-[var(--header-h)] flex h-[calc(100svh-var(--header-h))] items-center justify-center">
              <div className="relative aspect-[4/5] h-[min(calc(100svh-var(--header-h)-80px),780px)] max-w-full overflow-hidden rounded-[36px] bg-[radial-gradient(ellipse_at_50%_40%,#FFFDF8,#F3E6CC)] shadow-lift ring-1 ring-charcoal/5">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    aria-hidden={i !== active}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] will-change-transform",
                      i === active ? "scale-100 opacity-100 blur-0" : "scale-[1.08] opacity-0 blur-[2px]",
                    )}
                  >
                    <StepPicture step={step} alt={t(step.title, locale)} sizes="(min-width:1024px) 46vw, 1px" priority={i === 0} />
                  </div>
                ))}
                {/* soft vignette for depth */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent transition-opacity duration-700",
                    lightStage ? "opacity-0" : "opacity-100",
                  )}
                />

                {/* caption: big number + title, animated per step */}
                <div className={cn("absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 transition-colors duration-700", lightStage ? "text-charcoal" : "text-cream")}>
                  <div className="overflow-hidden">
                    <motion.p
                      key={active}
                      initial={reduce ? false : { y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE }}
                      className={cn("font-serif text-4xl", !lightStage && "drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]")}
                    >
                      {t(current?.title, locale)}
                    </motion.p>
                  </div>
                  <p className="shrink-0 font-sans text-sm font-semibold tabular-nums tracking-[0.3em] opacity-90">
                    {String(active + 1).padStart(2, "0")} <span className="opacity-50">/ {String(steps.length).padStart(2, "0")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Steps with progress line ── */}
          <ol ref={listRef} className="relative">
            {/* track + golden fill */}
            <span aria-hidden className="absolute bottom-6 start-[19px] top-6 w-[2px] rounded-full bg-charcoal/10 lg:start-[23px]" />
            <motion.span
              aria-hidden
              className="absolute start-[19px] top-6 w-[2px] origin-top rounded-full bg-gradient-to-b from-honey-400 to-honey-600 lg:start-[23px]"
              style={{ bottom: 24, scaleY: reduce ? 1 : progress }}
            />

            {steps.map((step, i) => {
              const Icon = ICONS[i % ICONS.length];
              const on = i === active;
              const passed = i <= active;
              return (
                <li
                  key={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-index={i}
                  className="relative flex gap-6 pb-16 last:pb-0 lg:min-h-[62vh] lg:items-center lg:gap-10 lg:pb-0"
                >
                  {/* dot */}
                  <span
                    className={cn(
                      "relative z-10 mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-500 lg:mt-0 lg:h-12 lg:w-12",
                      passed ? "border-honey-500 bg-honey-500 text-charcoal shadow-glow" : "border-charcoal/15 bg-cream text-charcoal-300",
                    )}
                  >
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </span>

                  {/* outer: dims inactive steps (desktop) · inner: one-time reveal on scroll */}
                  <div className={cn("min-w-0 flex-1 transition-opacity duration-700", on ? "lg:opacity-100" : "lg:opacity-35")}>
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-honey-700 rtl:tracking-normal">
                      {dict.home.step} · {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">{t(step.title, locale)}</h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-charcoal-500">{t(step.text, locale)}</p>

                    {/* picture inline on mobile / tablet */}
                    {step.image && (
                      <div
                        className={cn(
                          "relative mt-7 aspect-[4/3] overflow-hidden rounded-[28px] shadow-card ring-1 ring-charcoal/5 lg:hidden",
                          step.fit === "contain" ? "bg-[radial-gradient(ellipse_at_50%_40%,#FFFDF8,#F3E6CC)]" : "bg-honey-50",
                        )}
                      >
                        <StepPicture step={step} alt={t(step.title, locale)} sizes="(min-width:768px) 80vw, 92vw" />
                      </div>
                    )}
                  </motion.div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}