"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bees } from "@/components/motion/Bees";
import { SplitText } from "@/components/motion/SplitText";
import { HoneyEdge } from "@/components/ui/HoneyEdge";
import { HexPattern } from "@/components/ui/HexPattern";
import { ProductImage } from "@/components/ui/ProductImage";
import { ArrowIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import { localePath } from "@/lib/i18n/config";
import type { SiteMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** jar picture, honeycomb strip & bees — each can be replaced or removed in the host panel */
  media: SiteMedia;
}

/**
 * Full-screen hero: a static band of real honey along the top edge, a photoreal honey jar,
 * a letter-by-letter headline (pure CSS → visible at first paint), gentle scroll parallax
 * and a few realistic bees drifting by.
 */
export function Hero({ eyebrow, title, subtitle, ctaPrimary, ctaSecondary, media }: HeroProps) {
  const { locale, dict } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax layers move at different speeds while scrolling (never on hover)
  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "25%"]);
  const yJar = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-cream pb-16 pt-[calc(var(--header-h)+120px)] md:pt-[calc(var(--header-h)+150px)]">
      <motion.div aria-hidden className="absolute inset-0" style={{ y: yBack }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(246,196,83,.32),transparent_60%),radial-gradient(ellipse_at_10%_90%,rgba(111,117,67,.14),transparent_55%)]" />
        <HexPattern opacity={0.08} id="hero-hex" />
      </motion.div>

      {/* Real honeycomb dripping honey, stretched across the full page width — static */}
      {media.heroComb && <HoneyEdge variant="comb" src={media.heroComb} className="absolute inset-x-0 top-[calc(var(--header-h)-2px)] z-[1]" />}
      {media.bees && <Bees className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full md:block" />}

      <div className={cn("container relative z-10 grid items-center gap-10", media.heroImage && "lg:grid-cols-[1.1fr_.9fr]")}>
        <div>
          <p className="eyebrow animate-fade-up" style={{ animationDelay: "0.05s" }}>{eyebrow}</p>
          <h1 className="h-display mt-6 text-charcoal">
            <SplitText text={title} delay={0.1} byWord={locale === "ar"} />
          </h1>
          <p className="mt-8 max-w-xl animate-fade-up text-lg leading-relaxed text-charcoal-500 md:text-xl" style={{ animationDelay: "0.45s" }}>
            {subtitle}
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4" style={{ animationDelay: "0.6s" }}>
            <Link href={localePath(locale, "/magaza")} className="btn-primary">
              {ctaPrimary}
              <ArrowIcon width={18} />
            </Link>
            <Link href={localePath(locale, "/hakkimizda")} className="btn-ghost">
              {ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Photoreal jar (transparent WebP) with a warm glow and soft contact shadow */}
        {media.heroImage && (
        <motion.div data-bee-spot className="relative mx-auto w-full max-w-[340px] animate-fade-in lg:max-w-[370px]" style={{ y: yJar, animationDelay: "0.2s" }}>
          <div aria-hidden className="absolute inset-[6%_4%_14%] rounded-full bg-honey-300/45 blur-3xl" />
          <div aria-hidden className="absolute inset-x-[16%] bottom-[2.5%] h-[5%] rounded-[50%] bg-charcoal/30 blur-xl" />
          <div className="relative aspect-[792/1196]">
            <ProductImage
              src={media.heroImage}
              alt="Şifa Balı — cam kavanozda doğal çiçek balı"
              fill
              priority
              sizes="(min-width:1024px) 370px, 70vw"
              className="object-contain drop-shadow-[0_30px_40px_rgba(94,55,21,.18)]"
            />
          </div>
        </motion.div>
        )}
      </div>

      <div
        className="absolute bottom-6 start-1/2 z-10 hidden -translate-x-1/2 animate-fade-in flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal-400 md:flex rtl:translate-x-1/2"
        style={{ animationDelay: "1s" }}
      >
        {dict.home.scroll}
        <span className="h-10 w-[1.5px] rounded-full bg-gradient-to-b from-honey-500 to-charcoal/10" />
      </div>
    </section>
  );
}
