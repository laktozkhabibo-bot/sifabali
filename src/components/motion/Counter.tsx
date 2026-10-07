"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Number that counts up from 0 when it scrolls into view */
export function Counter({ value, suffix = "", duration = 2.2, locale = "tr-TR" }: { value: number; suffix?: string; duration?: number; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(locale).format(display)}
      {suffix}
    </span>
  );
}
