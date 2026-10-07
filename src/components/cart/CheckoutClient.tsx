"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart, cartTotal } from "@/store/cart";
import { useLocale } from "@/components/layout/LocaleProvider";
import { ProductImage } from "@/components/ui/ProductImage";
import { MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { localePath } from "@/lib/i18n/config";
import { formatPrice, t, whatsappLink } from "@/lib/utils";

/**
 * Preliminary checkout: collects delivery details and sends the complete order
 * to the shop's WhatsApp number as a pre-filled message.
 */
export function CheckoutClient() {
  const { locale, dict, contact } = useLocale();
  const { items, setQty, remove, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container py-24 text-center text-charcoal-400">{dict.common.loading}</div>;

  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-6 py-24 text-center">
        <span className="text-6xl">🍯</span>
        <p className="text-lg text-charcoal-500">{dict.cart.empty}</p>
        <Link href={localePath(locale, "/magaza")} className="btn-primary">{dict.cart.emptyCta}</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    if (!get("name") || !get("phone") || !get("address")) {
      toast.error(dict.checkout.required);
      return;
    }
    // Order message is always composed in Turkish for the shop owner, with the customer's language noted
    const lines = [
      dict.checkout.messageHeader,
      "",
      ...items.map((i, n) => `${n + 1}) ${t(i.name, "tr")} ${i.weight} × ${i.qty} = ${formatPrice(i.price * i.qty, "tr")}`),
      "",
      `*${dict.checkout.total}: ${formatPrice(total, "tr")}*`,
      "",
      `👤 ${get("name")}`,
      `📞 ${get("phone")}`,
      `📍 ${get("address")}${get("city") ? `, ${get("city")}` : ""}`,
      get("note") ? `📝 ${get("note")}` : "",
      `🌐 ${locale.toUpperCase()}`,
    ].filter((l, i, arr) => !(l === "" && arr[i - 1] === ""));
    window.open(whatsappLink(contact.whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
    clear();
  };

  return (
    <section className="container grid gap-10 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr]">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 p-8 md:p-10" id="checkout-form">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input name="name" label={dict.checkout.name} required autoComplete="name" />
          <Input name="phone" label={dict.checkout.phone} required type="tel" autoComplete="tel" />
        </div>
        <Input name="city" label={dict.checkout.city} autoComplete="address-level2" />
        <div>
          <label htmlFor="co-address" className="mb-2 block text-sm font-medium text-charcoal-500">{dict.checkout.address} *</label>
          <textarea id="co-address" name="address" required rows={3} autoComplete="street-address" className="input resize-none" />
        </div>
        <div>
          <label htmlFor="co-note" className="mb-2 block text-sm font-medium text-charcoal-500">{dict.checkout.note}</label>
          <textarea id="co-note" name="note" rows={2} className="input resize-none" />
        </div>
        <p className="rounded-2xl bg-honey-50 p-4 text-sm leading-relaxed text-honey-900">{dict.checkout.info}</p>
        <button type="submit" className="btn w-full bg-[#25D366] py-4 text-base text-white hover:bg-[#1ebe5b]">
          <WhatsAppIcon width={22} /> {dict.checkout.send}
        </button>
      </motion.form>

      <motion.aside initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
        <div className="card p-8">
          <h2 className="font-serif text-2xl">{dict.checkout.summary}</h2>
          <ul className="mt-6 divide-y divide-charcoal/10">
            {items.map((i) => (
              <li key={i.id} className="flex gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-honey-50">
                  <ProductImage src={i.image} alt={t(i.name, locale)} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium leading-tight">{t(i.name, locale)}</p>
                    <button onClick={() => remove(i.id)} aria-label={dict.cart.remove} className="text-charcoal-300 hover:text-red-600"><TrashIcon width={16} /></button>
                  </div>
                  <p className="text-xs text-charcoal-400">{i.weight}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => (i.qty > 1 ? setQty(i.id, i.qty - 1) : remove(i.id))} aria-label={dict.product.decrease} className="grid h-7 w-7 place-items-center rounded-full border border-charcoal/10"><MinusIcon width={12} /></button>
                      <span className="w-6 text-center text-sm tabular-nums">{i.qty}</span>
                      <button type="button" onClick={() => setQty(i.id, i.qty + 1)} aria-label={dict.product.increase} className="grid h-7 w-7 place-items-center rounded-full border border-charcoal/10"><PlusIcon width={12} /></button>
                    </div>
                    <span className="font-semibold">{formatPrice(i.price * i.qty, locale)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-5">
            <span className="text-charcoal-500">{dict.checkout.total}</span>
            <span className="font-serif text-3xl font-semibold">{formatPrice(total, locale)}</span>
          </div>
          <p className="mt-2 text-xs text-charcoal-400">{dict.cart.shippingNote}</p>
        </div>
      </motion.aside>
    </section>
  );
}

function Input({ name, label, ...rest }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={`co-${name}`} className="mb-2 block text-sm font-medium text-charcoal-500">{label} {rest.required && "*"}</label>
      <input id={`co-${name}`} name={name} className="input" {...rest} />
    </div>
  );
}
