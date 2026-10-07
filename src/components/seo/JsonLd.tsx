import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { ProductDTO, SiteContent } from "@/lib/types";
import { effectivePrice, siteUrl, t } from "@/lib/utils";

function Script({ data }: { data: unknown }) {
  // JSON-LD structured data for search engines (escaped to be safe inside <script>)
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function OrganizationJsonLd({ content }: { content: SiteContent }) {
  const c = content.contact;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Store",
        name: "Şifa Balı",
        url: siteUrl,
        logo: `${siteUrl}/images/logo-emblem.webp`,
        image: `${siteUrl}/og.png`,
        telephone: c.phone || undefined,
        email: c.email || undefined,
        address: t(c.address, "tr") ? { "@type": "PostalAddress", streetAddress: t(c.address, "tr"), addressCountry: "TR" } : undefined,
        sameAs: [c.instagram, c.facebook, c.youtube, c.tiktok].filter(Boolean),
        priceRange: "₺₺",
      }}
    />
  );
}

export function ProductJsonLd({ product, locale }: { product: ProductDTO; locale: Locale }) {
  const url = `${siteUrl}${localePath(locale, `/urun/${product.slug}`)}`;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: t(product.name, locale),
        description: t(product.description, locale),
        sku: product.slug,
        brand: { "@type": "Brand", name: "Şifa Balı" },
        image: product.images.map((i) => (i.startsWith("http") ? i : `${siteUrl}${i}`)),
        weight: product.weight || undefined,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "TRY",
          price: effectivePrice(product).toFixed(2),
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: "Şifa Balı" },
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
      }}
    />
  );
}
