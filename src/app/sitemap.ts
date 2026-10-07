import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { locales, localePath } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const paths = ["/", "/magaza", "/hakkimizda", "/iletisim", ...products.map((p) => `/urun/${p.slug}`)];
  const now = new Date();

  return paths.map((path) => ({
    url: `${siteUrl}${localePath("tr", path)}`,
    lastModified: now,
    changeFrequency: path.startsWith("/urun") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/magaza" ? 0.9 : path.startsWith("/urun") ? 0.8 : 0.6,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localePath(l, path)}`])) },
  }));
}
