"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import { useLocale } from "./LocaleProvider";
import { localePath } from "@/lib/i18n/config";

/** Top announcement strip ("Kargo bedava!") — text, link & visibility are managed from the host panel */
export function AnnouncementBar({ text, link }: { text: string; link: string }) {
  const { locale, dict } = useLocale();
  const [open, setOpen] = useState(true);
  const storageKey = `sb-ann-${text.length}-${text.slice(0, 16)}`;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "0") setOpen(false);
    } catch {}
  }, [storageKey]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(storageKey, "0");
    } catch {}
  };

  const href = link ? (link.startsWith("/") ? localePath(locale, link) : link) : null;
  const content = <span className="px-8 text-[12.5px] font-medium tracking-wide">{text}</span>;

  return (
    <AnimatePresence initial={false}>
      {open && text && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-50 overflow-hidden bg-charcoal text-honey-100"
          role="region"
          aria-label="Duyuru"
        >
          <div className="relative flex h-10 items-center overflow-hidden">
            {/* Marquee (duplicated content for a seamless loop) */}
            <div dir="ltr" className="flex min-w-full shrink-0 animate-marquee whitespace-nowrap motion-reduce:animate-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center" dir="auto" aria-hidden={i > 0}>
                  {href ? (
                    <Link href={href} className="hover:text-honey-300" tabIndex={i > 0 ? -1 : 0}>
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                  <span className="text-honey-500">⬡</span>
                </span>
              ))}
            </div>
            <button
              onClick={close}
              aria-label={dict.a11y.announcementClose}
              className="absolute end-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-charcoal text-honey-100/70 hover:text-honey-100"
            >
              <CloseIcon width={14} height={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
