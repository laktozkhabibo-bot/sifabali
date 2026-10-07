import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Reveal } from "@/components/motion/Reveal";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CheckIcon, LeafIcon, FlaskIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";
import { getCategories, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath, locales } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/page-locale";
import { pageMetadata } from "@/lib/seo";
import { effectivePrice, formatPrice, siteUrl, t } from "@/lib/utils";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const name = t(product.name, locale);
  return pageMetadata({
    locale,
    path: `/urun/${product.slug}`,
    title: `${name} ${product.weight}`.trim(),
    description: `${t(product.description, locale)} — ${formatPrice(effectivePrice(product), locale)}`,
    // Social networks do not render SVG — fall back to the default share image for illustrations
    images: product.images.filter((i) => !i.endsWith(".svg")).slice(0, 1),
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const [categories, related] = await Promise.all([getCategories(), getRelatedProducts(product, 4)]);
  const category = categories.find((c) => c.id === product.categoryId);
  const name = t(product.name, locale);
  const benefits = product.benefits[locale]?.length ? product.benefits[locale] : product.benefits.tr;
  const guaranteeIcons = [LeafIcon, FlaskIcon, ShieldIcon, TruckIcon];

  return (
    <>
      <ProductJsonLd product={product} locale={locale} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.nav.home, url: `${siteUrl}${localePath(locale, "/")}` },
          { name: dict.nav.shop, url: `${siteUrl}${localePath(locale, "/magaza")}` },
          { name, url: `${siteUrl}${localePath(locale, `/urun/${product.slug}`)}` },
        ]}
      />
      <section className="container pb-20 pt-[calc(var(--header-h)+32px)] md:pt-[calc(var(--header-h)+48px)]">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-charcoal-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={localePath(locale, "/")} className="hover:text-charcoal">{dict.nav.home}</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={localePath(locale, "/magaza")} className="hover:text-charcoal">{dict.nav.shop}</Link></li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li><Link href={`${localePath(locale, "/magaza")}?kategori=${category.slug}`} className="hover:text-charcoal">{t(category.name, locale)}</Link></li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-charcoal">{name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={name} />

          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <Reveal>
              {category && <p className="eyebrow">{t(category.name, locale)}</p>}
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">{name}</h1>
              <p className="mt-2 text-charcoal-400">{product.weight}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <AnimatedPrice price={effectivePrice(product)} original={product.price} locale={locale} saleLabel={dict.common.sale} />
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 text-lg leading-relaxed text-charcoal-500">{t(product.description, locale)}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-8 grid grid-cols-2 gap-4 rounded-3xl bg-white/60 p-5 ring-1 ring-charcoal/5">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-charcoal-400 rtl:tracking-normal">{dict.product.weight}</dt>
                  <dd className="mt-1 font-semibold">{product.weight || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-charcoal-400 rtl:tracking-normal">{dict.product.inStock}</dt>
                  <dd className="mt-1 font-semibold">{product.stock > 0 ? product.stock : dict.common.outOfStock}</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.25}>
              <AddToCartPanel product={product} />
            </Reveal>

            {benefits.length > 0 && (
              <Reveal delay={0.3}>
                <div className="mt-10">
                  <h2 className="font-serif text-2xl">{dict.product.benefits}</h2>
                  <ul className="mt-4 space-y-3">
                    {benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-500 text-cream">
                          <CheckIcon width={14} />
                        </span>
                        <span className="text-charcoal-600">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.35}>
              <ul className="mt-10 grid grid-cols-2 gap-3 border-t border-charcoal/10 pt-8">
                {dict.product.guarantee.map((g, i) => {
                  const Icon = guaranteeIcons[i];
                  return (
                    <li key={g} className="flex items-center gap-3 text-sm text-charcoal-500">
                      <Icon width={20} className="shrink-0 text-honey-600" /> {g}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <RelatedProducts products={related} categories={categories} title={dict.product.related} />
    </>
  );
}

function AnimatedPrice({ price, original, locale, saleLabel }: { price: number; original: number; locale: "tr" | "en" | "ar"; saleLabel: string }) {
  const onSale = price < original;
  return (
    <div className="mt-6 flex items-center gap-4">
      <span className="font-serif text-4xl font-semibold text-honey-700">{formatPrice(price, locale)}</span>
      {onSale && (
        <>
          <span className="text-xl text-charcoal-300 line-through">{formatPrice(original, locale)}</span>
          <span className="rounded-full bg-honey-500 px-3 py-1 text-xs font-bold uppercase text-charcoal">
            {saleLabel} −{Math.round((1 - price / original) * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
