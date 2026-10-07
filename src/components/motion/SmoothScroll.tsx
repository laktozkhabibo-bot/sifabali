"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays perfectly in sync.
 * Disabled when the user prefers reduced motion (native scrolling is used instead).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Jump to top on route change & recalculate triggers
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
