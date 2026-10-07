"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/**
 * 3D tilt that follows the pointer, with a soft glare highlight.
 * Only reacts to a mouse; touch devices get a static card.
 */
export function TiltCard({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, [0, 1], ["0%", "100%"]);
  const gy = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,248,232,.45), transparent 55%)`;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className="perspective">
      <motion.div
        className={`preserve-3d group/tilt relative ${className ?? ""}`}
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
}
