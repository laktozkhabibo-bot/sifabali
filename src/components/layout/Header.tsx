"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "./LocaleProvider";
import { localePath, stripLocale } from "@/lib/i18n/config";
import { cartCount, useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export function Header() {
  const { locale, dict, media } = useLocale();
  const pathname = usePathname();
  const current = stripLocale(pathname || "/");
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  // Glass background after scrolling; hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > 300 && y > prev && !menuOpen);
  });

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/magaza", label: dict.nav.shop },
    { href: "/hakkimizda", label: dict.nav.about },
    { href: "/iletisim", label: dict.nav.contact },
  ];
  const count = mounted ? cartCount(items) : 0;
  const isActive = (href: string) => (href === "/" ? current === "/" : current.startsWith(href));

  return (
    <>
      <motion.header
        className="sticky top-0 z-40"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "transition-[background-color,box-shadow,backdrop-filter] duration-500",
            scrolled && !menuOpen ? "bg-cream/80 shadow-[0_1px_0_rgba(27,24,20,.06)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <div className="container flex h-[var(--header-h)] items-center justify-between gap-4">
            <Link href={localePath(locale, "/")} aria-label="Şifa Balı — Ana Sayfa" className="shrink-0">
              <Logo tone={menuOpen ? "light" : "dark"} emblem={media.logo} className="h-10 md:h-[54px]" />
            </Link>

            <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={localePath(locale, l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="group relative px-4 py-2 text-[15px] font-medium text-charcoal/80 transition-colors hover:text-charcoal"
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-honey-500",
                      isActive(l.href) ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <LanguageSwitcher className="hidden sm:flex" />
                              <button
                  onClick={() => setOpen(true)}
                  aria-label={`${dict.a11y.openCart} (${count})`}
                  className={cn(
                    "relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-honey-600",
                    menuOpen ? "bg-honey-500 text-charcoal" : "bg-charcoal text-cream",
                  )}
                >
                  <CartIcon width={20} height={20} />
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        key={count}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-honey-500 px-1 text-[11px] font-bold text-charcoal"
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border transition-colors lg:hidden",
                  menuOpen ? "border-cream/20 text-cream" : "border-charcoal/10 text-charcoal",
                )}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col bg-charcoal pt-[calc(var(--header-h)+56px)] text-cream lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <nav className="container flex flex-col gap-2" aria-label="Mobil menü">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <Link
                    href={localePath(locale, l.href)}
                    className={cn("block py-2 font-serif text-5xl", isActive(l.href) ? "text-honey-400" : "text-cream")}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container mt-auto pb-10">
              <LanguageSwitcher tone="light" className="w-fit" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
