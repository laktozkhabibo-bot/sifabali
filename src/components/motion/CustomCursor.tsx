"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Honey-drop cursor for desktop (fine pointer) only.
 * Grows over links/buttons; elements can set data-cursor="view" to show a label.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState<"none" | "link" | "view">("none");
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>("a, button, [role=button], input, textarea, select, label, [data-cursor]");
      if (!el) setHover("none");
      else setHover(el.dataset.cursor === "view" ? "view" : "link");
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => { x.set(-100); y.set(-100); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const scale = hover === "view" ? 2.6 : hover === "link" ? 1.6 : 1;

  return (
    <>
      {/* Exact pointer dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-charcoal mix-blend-difference"
        style={{ x, y }}
      />
      {/* Trailing honey drop */}
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[199]" style={{ x: sx, y: sy }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-[62%]"
          animate={{ scale: pressed ? scale * 0.8 : scale }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <svg width="26" height="34" viewBox="0 0 26 34" className="drop-shadow-[0_4px_10px_rgba(224,150,26,.45)]">
            <defs>
              <linearGradient id="cur-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F6C453" stopOpacity=".95" />
                <stop offset="1" stopColor="#C27612" stopOpacity=".95" />
              </linearGradient>
            </defs>
            <path d="M13 1 C13 1 25 16 25 22 A12 12 0 0 1 1 22 C1 16 13 1 13 1 Z" fill="url(#cur-g)" opacity={hover === "none" ? 0.85 : 0.55} />
            <path d="M7 22 a6 6 0 0 0 4 5.5" fill="none" stroke="#FFF8E8" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}
