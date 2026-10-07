"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { useLocale } from "@/components/layout/LocaleProvider";
import { cn } from "@/lib/utils";

/** Main image with a soft cross-fade between photos, and a thumbnail rail */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const { dict } = useLocale();
  const list = images.length ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row" aria-label={dict.product.gallery}>
      {list.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:flex-col" role="tablist">
          {list.map((src, i) => (
            <button
              key={src + i}
              role="tab"
              aria-selected={i === active}
              aria-label={`${name} ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-honey-50 ring-2 transition",
                i === active ? "ring-honey-500" : "ring-transparent opacity-60 hover:opacity-100",
              )}
            >
              <ProductImage src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div
        className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[32px] bg-honey-50 shadow-card"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductImage
              src={list[active]}
              alt={`${name} — ${active + 1}`}
              fill
              priority
              sizes="(min-width:1024px) 45vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
