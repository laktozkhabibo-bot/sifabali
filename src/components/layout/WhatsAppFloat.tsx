"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/lib/utils";
import { useLocale } from "./LocaleProvider";

/** Floating WhatsApp shortcut (bottom corner) */
export function WhatsAppFloat() {
  const { contact, dict } = useLocale();
  if (!contact.whatsapp) return null;
  return (
    <motion.a
      href={whatsappLink(contact.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.contact.whatsappCta}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="fixed bottom-5 end-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,.55)]"
    >
      <WhatsAppIcon width={28} height={28} />
    </motion.a>
  );
}
