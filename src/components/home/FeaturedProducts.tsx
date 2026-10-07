"use client";

import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";
import { localePath } from "@/lib/i18n/config";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

export function FeaturedProducts({ products, categories }: { products: ProductDTO[]; categories: CategoryDTO[] }) {
  const { locale, dict } = useLocale();
  if (!products.length) return null;
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="featured-title">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">{dict.common.featured}</p>
            <h2 id="featured-title" className="h-section mt-4">{dict.home.featuredTitle}</h2>
            <p className="mt-4 max-w-lg text-charcoal-400">{dict.home.featuredSubtitle}</p>
          </Reveal>
          <Reveal delay={0.1}>
                          <Link href={localePath(locale, "/magaza")} className="btn-ghost group">
                {dict.common.viewAll}
                <ArrowIcon width={18} />
              </Link>
          </Reveal>
        </div>
        <Stagger className="mt-14 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4" stagger={0.08}>
          {products.map((p, i) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} category={categories.find((c) => c.id === p.categoryId)} priority={i < 2} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
