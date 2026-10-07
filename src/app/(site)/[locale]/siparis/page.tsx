import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckoutClient } from "@/components/cart/CheckoutClient";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/page-locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return { ...pageMetadata({ locale, path: "/siparis", title: dict.checkout.title, description: dict.checkout.subtitle }), robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow="Şifa Balı" title={dict.checkout.title} subtitle={dict.checkout.subtitle} />
      <CheckoutClient />
    </>
  );
}
