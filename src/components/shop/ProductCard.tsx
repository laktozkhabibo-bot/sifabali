"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ProductImage } from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import { useCart } from "@/store/cart";
import { localePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/dictionaries";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { cn, effectivePrice, formatPrice, t } from "@/lib/utils";

/** Calm, static product card — no hover movement; only colours react to the pointer */
export function ProductCard({ product, category, priority = false }: { product: ProductDTO; category?: CategoryDTO; priority?: boolean }) {
  const { locale, dict } = useLocale();
  const add = useCart((s) => s.add);
  const name = t(product.name, locale);
  const price = effectivePrice(product);
  const onSale = price < product.price;
  const soldOut = product.stock <= 0;
  const href = localePath(locale, `/urun/${product.slug}`);

  const addToCart = () => {
    if (soldOut) return;
    add({ id: product.id, slug: product.slug, name: product.name, image: product.images[0] ?? "", weight: product.weight, price, stock: product.stock });
    toast.success(dict.common.added, { description: name });
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-charcoal/5 transition-shadow duration-300 hover:shadow-lift">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-honey-50" aria-label={name}>
        <ProductImage
          src={product.images[0] ?? ""}
          alt={name}
          fill
          priority={priority}
          sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
          className="object-cover"
        />
        <div className="absolute start-3 top-3 z-10 flex flex-col gap-2">
          {onSale && <span className="rounded-full bg-honey-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-charcoal">{dict.common.sale}</span>}
          {soldOut && <span className="rounded-full bg-charcoal px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream">{dict.common.outOfStock}</span>}
          {!soldOut && product.stock <= 5 && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-honey-800">{fmt(dict.common.lowStock, { n: product.stock })}</span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4 md:p-5">
        {category && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-olive-500 rtl:tracking-normal">{t(category.name, locale)}</p>}
        <h3 className="font-serif text-lg leading-snug md:text-xl">
          <Link href={href} className="transition-colors hover:text-honey-700">{name}</Link>
        </h3>
        <p className="text-sm text-charcoal-400">{product.weight}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-semibold text-charcoal">{formatPrice(price, locale)}</span>
          {onSale && <span className="text-sm text-charcoal-300 line-through">{formatPrice(product.price, locale)}</span>}
        </div>
        <button
          onClick={addToCart}
          disabled={soldOut}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors",
            soldOut ? "cursor-not-allowed bg-charcoal/10 text-charcoal-400" : "bg-charcoal text-cream hover:bg-honey-500 hover:text-charcoal",
          )}
        >
          <CartIcon width={17} height={17} />
          {soldOut ? dict.common.outOfStock : dict.common.addToCart}
        </button>
      </div>
    </article>
  );
}
