"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

/** Stacked, parallax-shifting imagery for the brand story */
export function ParallaxImage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 80]);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-lg">
      <motion.div style={{ y: y1 }} className="absolute inset-y-0 start-0 w-[72%] overflow-hidden rounded-[36px] bg-gradient-to-b from-honey-100 to-honey-200 shadow-lift">
        <ProductImage src="/products/kestane-bali.webp" alt="" fill sizes="(min-width:1024px) 30vw, 70vw" className="object-contain p-6" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-[-6%] end-0 w-[48%] overflow-hidden rounded-[28px] border-8 border-cream bg-cream-200 shadow-lift">
        <div className="relative aspect-[4/5]">
          <ProductImage src="/products/cicek-bali.webp" alt="" fill sizes="25vw" className="object-contain p-3" />
        </div>
      </motion.div>
    </div>
  );
}
