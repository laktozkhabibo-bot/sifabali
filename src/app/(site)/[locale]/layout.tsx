import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { fontVariables } from "@/lib/fonts";
import { dir, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCategories, getSiteContent } from "@/lib/data";
import { LocaleProvider } from "@/components/layout/LocaleProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Preloader } from "@/components/motion/Preloader";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { alternates } from "@/lib/seo";
import { siteUrl, t } from "@/lib/utils";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#1B1814",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const content = await getSiteContent();
  const title = t(content.seo.title, locale);
  const description = t(content.seo.description, locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s | Şifa Balı" },
    description,
    applicationName: "Şifa Balı",
    alternates: alternates(locale, "/"),
    openGraph: { type: "website", siteName: "Şifa Balı", title, description, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Şifa Balı" }] },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);
  const [content, categories] = await Promise.all([getSiteContent(), getCategories()]);

  return (
    <html lang={locale} dir={dir(locale)} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-clip">
        <Preloader />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-cream">
          {dict.a11y.skip}
        </a>
        <LocaleProvider value={{ locale, dict, contact: content.contact, media: content.media }}>
          {content.announcement.enabled && <AnnouncementBar text={t(content.announcement.text, locale)} link={content.announcement.link} />}
          <Header />
          <main id="main" className="relative -mt-[var(--header-h)]">{children}</main>
          <Footer locale={locale} content={content} categories={categories} />
          <SiteChrome />
        </LocaleProvider>
        <OrganizationJsonLd content={content} />
      </body>
    </html>
  );
}
