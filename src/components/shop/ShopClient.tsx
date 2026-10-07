"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { SearchIcon, CloseIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import { fmt } from "@/lib/i18n/dictionaries";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { cn, effectivePrice, t } from "@/lib/utils";

type Sort = "default" | "price-asc" | "price-desc" | "name";

/** Normalises text for accent/case-insensitive search (Turkish-aware) */
const norm = (s: string) =>
  s.toLocaleLowerCase("tr").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

export function ShopClient({ products, categories }: { products: ProductDTO[]; categories: CategoryDTO[] }) {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("kategori") ?? "all";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const deferredQuery = useDeferredValue(query);

  const setCategory = (slug: string) => {
    const sp = new URLSearchParams(params.toString());
    if (slug === "all") sp.delete("kategori");
    else sp.set("kategori", slug);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const cat = categories.find((c) => c.slug === active);
    const q = norm(deferredQuery.trim());
    let list = products.filter((p) => (cat ? p.categoryId === cat.id : true));
    if (q) {
      list = list.filter((p) =>
        norm([p.name.tr, p.name.en, p.name.ar, t(p.description, locale), p.weight].join(" ")).includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (sort === "price-desc") sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    if (sort === "name") sorted.sort((a, b) => t(a.name, locale).localeCompare(t(b.name, locale), locale));
    return sorted;
  }, [products, categories, active, deferredQuery, sort, locale]);

  const tabs = [{ slug: "all", label: dict.shop.all }, ...categories.map((c) => ({ slug: c.slug, label: t(c.name, locale) }))];

  return (
    <section className="container py-12 md:py-16">
      {/* Toolbar */}
      <div className="sticky top-3 z-20 -mx-2 mb-10 flex flex-col gap-4 rounded-[28px] bg-cream/85 p-2 shadow-card ring-1 ring-charcoal/5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="cat-tabs">
          <div className="no-scrollbar flex gap-1 overflow-x-auto" role="tablist" aria-label="Kategoriler">
            {tabs.map((tab) => {
              const on = active === tab.slug || (tab.slug === "all" && !categories.some((c) => c.slug === active));
              return (
                <button
                  key={tab.slug}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCategory(tab.slug)}
                  className={cn("relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors", on ? "text-cream" : "text-charcoal-500 hover:text-charcoal")}
                >
                  {on && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-charcoal" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <div className="flex gap-2">
          <label className="relative flex-1 lg:w-72 lg:flex-none">
            <span className="sr-only">{dict.shop.search}</span>
            <SearchIcon width={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.shop.search}
              className="w-full rounded-full border border-charcoal/10 bg-white py-2.5 pe-4 ps-11 text-sm focus:border-honey-500 focus:outline-none focus:ring-4 focus:ring-honey-500/15"
            />
          </label>
          <label className="relative">
            <span className="sr-only">{dict.shop.sort}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-full appearance-none rounded-full border border-charcoal/10 bg-white py-2.5 pe-9 ps-4 text-sm font-medium focus:border-honey-500 focus:outline-none"
            >
              <option value="default">{dict.shop.sortDefault}</option>
              <option value="price-asc">{dict.shop.sortPriceAsc}</option>
              <option value="price-desc">{dict.shop.sortPriceDesc}</option>
              <option value="name">{dict.shop.sortName}</option>
            </select>
            <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs">▾</span>
          </label>
        </div>
      </div>

      <p className="mb-6 text-sm text-charcoal-400" aria-live="polite">{fmt(dict.shop.results, { n: results.length })}</p>

      {results.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 rounded-[32px] bg-white/60 py-24 text-center">
          <span className="text-5xl">🍯</span>
          <p className="text-charcoal-500">{dict.shop.empty}</p>
          <button onClick={() => { setQuery(""); setCategory("all"); }} className="btn-ghost">
            <CloseIcon width={16} /> {dict.shop.clear}
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              >
                <ProductCard product={p} category={categories.find((c) => c.id === p.categoryId)} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
