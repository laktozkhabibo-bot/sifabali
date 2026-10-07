"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCart, cartCount, cartTotal } from "@/store/cart";
import { useLocale } from "@/components/layout/LocaleProvider";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, CartIcon } from "@/components/ui/Icons";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice, t } from "@/lib/utils";
import { dir, localePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/dictionaries";
import { getLenis } from "@/components/motion/SmoothScroll";

/** Slide-in cart panel (from the end side — right in LTR, left in RTL) */
export function CartDrawer() {
  const { locale, dict } = useLocale();
  const { items, open, setOpen, setQty, remove } = useCart();
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const rtl = dir(locale) === "rtl";

  useEffect(() => setMounted(true), []);

  // Lock scroll, focus the panel, close with Escape
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  if (!mounted) return null;
  const count = cartCount(items);
  const total = cartTotal(items);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={dict.cart.title}>
          <motion.button
            aria-label={dict.a11y.closeCart}
            className="absolute inset-0 h-full w-full cursor-default bg-charcoal/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: rtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            data-lenis-prevent
          >
            <header className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
              <div>
                <h2 className="font-serif text-2xl">{dict.cart.title}</h2>
                <p className="text-sm text-charcoal-400">{fmt(dict.cart.items, { n: count })}</p>
              </div>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label={dict.a11y.closeCart} className="grid h-10 w-10 place-items-center rounded-full hover:bg-charcoal/5">
                <CloseIcon />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  className="grid h-24 w-24 place-items-center rounded-full bg-honey-100 text-honey-700"
                >
                  <CartIcon width={40} height={40} />
                </motion.div>
                <p className="text-charcoal-400">{dict.cart.empty}</p>
                <Link href={localePath(locale, "/magaza")} onClick={() => setOpen(false)} className="btn-primary">
                  {dict.cart.emptyCta}
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: rtl ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.05 } }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="flex gap-4 rounded-2xl bg-white/70 p-3 shadow-sm"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-honey-50">
                          <ProductImage src={item.image} alt={t(item.name, locale)} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link href={localePath(locale, `/urun/${item.slug}`)} onClick={() => setOpen(false)} className="line-clamp-2 font-serif text-lg leading-tight hover:text-honey-700">
                                {t(item.name, locale)}
                              </Link>
                              <p className="text-xs text-charcoal-400">{item.weight}</p>
                            </div>
                            <button onClick={() => remove(item.id)} aria-label={dict.cart.remove} className="rounded-full p-1.5 text-charcoal-300 hover:bg-red-50 hover:text-red-600">
                              <TrashIcon width={16} height={16} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-charcoal/10 bg-white">
                              <button onClick={() => (item.qty > 1 ? setQty(item.id, item.qty - 1) : remove(item.id))} aria-label={dict.product.decrease} className="grid h-8 w-8 place-items-center">
                                <MinusIcon width={14} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.qty}</span>
                              <button onClick={() => setQty(item.id, item.qty + 1)} aria-label={dict.product.increase} className="grid h-8 w-8 place-items-center" disabled={item.stock > 0 && item.qty >= item.stock}>
                                <PlusIcon width={14} />
                              </button>
                            </div>
                            <p className="font-semibold">{formatPrice(item.price * item.qty, locale)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t border-charcoal/10 bg-white/60 px-6 py-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-charcoal-500">{dict.cart.subtotal}</span>
                    <span className="font-serif text-2xl font-semibold">{formatPrice(total, locale)}</span>
                  </div>
                  <p className="mt-1 text-xs text-charcoal-400">{dict.cart.shippingNote}</p>
                  <Link href={localePath(locale, "/siparis")} onClick={() => setOpen(false)} className="btn-honey mt-5 w-full">
                    {dict.cart.checkout}
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
