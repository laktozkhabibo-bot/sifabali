import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhySection } from "@/components/home/WhySection";
import { JourneySection } from "@/components/home/JourneySection";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { getCategories, getFeaturedProducts, getSiteContent } from "@/lib/data";
import { resolveLocale } from "@/lib/page-locale";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = await getSiteContent();
  return {
    ...pageMetadata({ locale, path: "/", title: t(content.seo.title, locale), description: t(content.seo.description, locale) }),
    title: { absolute: t(content.seo.title, locale) },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const [content, featured, categories] = await Promise.all([getSiteContent(), getFeaturedProducts(8), getCategories()]);
  const h = content.hero;

  return (
    <>
      <Hero
        eyebrow={t(h.eyebrow, locale)}
        title={t(h.title, locale)}
        subtitle={t(h.subtitle, locale)}
        ctaPrimary={t(h.ctaPrimary, locale)}
        ctaSecondary={t(h.ctaSecondary, locale)}
      />
      <FeaturedProducts products={featured} categories={categories} />
      <WhySection why={content.why} stats={content.stats} />
      <JourneySection journey={content.journey} />
      <Testimonials testimonials={content.testimonials} />
      <Newsletter title={t(content.newsletter.title, locale)} text={t(content.newsletter.text, locale)} />
    </>
  );
}
