"use client";

import { Toaster } from "sonner";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { useLocale } from "./LocaleProvider";
import { dir } from "@/lib/i18n/config";

/** Global client-side pieces of the storefront */
export function SiteChrome() {
  const { locale } = useLocale();
  return (
    <>
      <SmoothScroll />
      <CartDrawer />
      <WhatsAppFloat />
      <Toaster
        position={dir(locale) === "rtl" ? "bottom-left" : "bottom-right"}
        dir={dir(locale)}
        toastOptions={{ className: "!rounded-2xl !bg-charcoal !text-cream !border-honey-700/40 !font-sans", duration: 2500 }}
      />
    </>
  );
}
