import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopClient } from "@/components/shop/ShopClient";
import { getCategories, getProducts } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/page-locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/magaza", title: dict.shop.title, description: dict.shop.subtitle });
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHeader eyebrow="Şifa Balı" title={dict.shop.title} subtitle={dict.shop.subtitle} />
      {/* Suspense is required because the filters read ?kategori= from the URL on the client */}
      <Suspense fallback={<div className="container py-24 text-center text-charcoal-400">{dict.common.loading}</div>}>
        <ShopClient products={products} categories={categories} />
      </Suspense>
    </>
  );
}
