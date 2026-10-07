import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { HexPattern } from "@/components/ui/HexPattern";
import { ArrowIcon, FlaskIcon, LeafIcon, MountainIcon, TruckIcon } from "@/components/ui/Icons";
import { ParallaxImage } from "@/components/about/ParallaxImage";
import { getSiteContent } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/page-locale";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = await getSiteContent();
  return pageMetadata({ locale, path: "/hakkimizda", title: getDictionary(locale).about.title, description: t(content.about.intro, locale) });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const content = await getSiteContent();
  const a = content.about;
  const paragraphs = t(a.story, locale).split(/\n\s*\n/).filter(Boolean);
  const icons = [LeafIcon, FlaskIcon, MountainIcon, TruckIcon];
  const numberLocale = locale === "tr" ? "tr-TR" : locale === "ar" ? "ar-u-nu-latn" : "en-US";

  return (
    <>
      <PageHeader eyebrow={dict.about.title} title={t(a.title, locale)} subtitle={t(a.intro, locale)} />

      <section className="container grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2">
        <ParallaxImage />
        <div>
          <Reveal>
            <div className="prose-honey space-y-0 text-lg leading-relaxed text-charcoal-600">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "first-letter:float-left first-letter:me-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[.8] first-letter:text-honey-600 rtl:first-letter:float-right" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-charcoal/10 pt-8">
              {[
                { v: content.stats.years, l: dict.home.stats.years },
                { v: content.stats.hives, l: dict.home.stats.hives },
                { v: content.stats.customers, l: dict.home.stats.customers, s: "+" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif text-4xl font-semibold text-honey-700"><Counter value={s.v} suffix={s.s} locale={numberLocale} /></p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-charcoal-400 rtl:tracking-normal">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-24 text-cream md:py-32">
        <HexPattern color="#E0961A" opacity={0.07} id="about-hex" />
        <div className="container relative max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow justify-center text-honey-300">{dict.about.mission}</p>
            <blockquote className="mt-8 font-serif text-3xl leading-snug md:text-5xl">{t(a.quote, locale)}</blockquote>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-cream/60">{t(a.mission, locale)}</p>
          </Reveal>
        </div>
      </section>

      <section className="container py-24 md:py-32">
        <Reveal>
          <p className="eyebrow">{dict.about.values}</p>
          <h2 className="h-section mt-4">{t(content.why.title, locale)}</h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.why.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={i}>
                <div className="card h-full p-8">
                  <Icon className="h-9 w-9 text-honey-600" />
                  <h3 className="mt-6 font-serif text-2xl">{t(item.title, locale)}</h3>
                  <p className="mt-3 text-charcoal-500">{t(item.text, locale)}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-16 text-center">
          <Link href={localePath(locale, "/magaza")} className="btn-primary group">
            {t(content.hero.ctaPrimary, locale)}
            <ArrowIcon width={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
