"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { CartIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import { useCart } from "@/store/cart";
import type { ProductDTO } from "@/lib/types";
import { effectivePrice, t, whatsappLink } from "@/lib/utils";

export function AddToCartPanel({ product }: { product: ProductDTO }) {
  const { locale, dict, contact } = useLocale();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const max = Math.max(1, product.stock);
  const name = t(product.name, locale);

  const onAdd = () => {
    add({ id: product.id, slug: product.slug, name: product.name, image: product.images[0] ?? "", weight: product.weight, price: effectivePrice(product), stock: product.stock }, qty);
    toast.success(dict.common.added, { description: `${qty} × ${name}` });
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-charcoal/15 bg-white" role="group" aria-label={dict.product.quantity}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={dict.product.decrease} className="grid h-14 w-14 place-items-center rounded-full hover:bg-charcoal/5" disabled={soldOut}>
            <MinusIcon width={18} />
          </button>
          <motion.span key={qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-10 text-center text-lg font-semibold tabular-nums" aria-live="polite">
            {qty}
          </motion.span>
          <button onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label={dict.product.increase} className="grid h-14 w-14 place-items-center rounded-full hover:bg-charcoal/5" disabled={soldOut || qty >= max}>
            <PlusIcon width={18} />
          </button>
        </div>
        <div className="flex-1">
          <button onClick={onAdd} disabled={soldOut} className="btn-honey h-14 w-full text-base">
            <CartIcon width={20} />
            {soldOut ? dict.common.outOfStock : dict.common.addToCart}
          </button>
        </div>
      </div>
      {contact.whatsapp && (
        <a
          href={whatsappLink(contact.whatsapp, `${name} (${product.weight})`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366] hover:text-white"
        >
          <WhatsAppIcon width={18} /> {dict.product.askWhatsapp}
        </a>
      )}
    </div>
  );
}
