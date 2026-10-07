/**
 * Server-side data access for the storefront.
 * Queries are cached with tags; the host panel calls `revalidateTag(...)` after saving,
 * so changes show up on the live site instantly — no rebuild or redeploy needed.
 */
import "server-only";
import { unstable_cache } from "next/cache";
import type { Category, Product } from "@prisma/client";
import { prisma } from "./prisma";
import { defaultCategories, defaultContent, fallbackProducts } from "./defaults";
import type { CategoryDTO, L10n, L10nList, ProductDTO, SiteContent } from "./types";

export const TAGS = { catalog: "catalog", content: "content" } as const;

const hasDb = () => Boolean(process.env.DATABASE_URL);

// ─── Serialization helpers ──────────────────────────────────────────────────

const emptyL10n = (): L10n => ({ tr: "", en: "", ar: "" });

function asL10n(value: unknown): L10n {
  const v = (value ?? {}) as Partial<L10n>;
  return { tr: v.tr ?? "", en: v.en ?? "", ar: v.ar ?? "" };
}

function asL10nList(value: unknown): L10nList {
  const v = (value ?? {}) as Partial<L10nList>;
  const arr = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === "string") : []);
  return { tr: arr(v.tr), en: arr(v.en), ar: arr(v.ar) };
}

export function toCategoryDTO(c: Category): CategoryDTO {
  return { id: c.id, slug: c.slug, name: asL10n(c.name), sortOrder: c.sortOrder };
}

export function toProductDTO(p: Product): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: asL10n(p.name),
    description: asL10n(p.description),
    benefits: asL10nList(p.benefits),
    weight: p.weight,
    price: Number(p.price),
    salePrice: p.salePrice == null ? null : Number(p.salePrice),
    stock: p.stock,
    images: p.images,
    visible: p.visible,
    featured: p.featured,
    sortOrder: p.sortOrder,
    categoryId: p.categoryId,
  };
}

/** Deep-merges stored settings over defaults, so new fields always have a value */
function mergeDeep<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    // keep the stored list (length & order), but fill fields added later from the default item at the same index
    return override.map((item, i) => (i < base.length && typeof base[i] === "object" && base[i] !== null ? mergeDeep(base[i], item) : item)) as T;
  }
  if (typeof base === "object" && base !== null) {
    if (typeof override !== "object" || Array.isArray(override)) return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
      out[k] = k in out ? mergeDeep(out[k], v) : v;
    }
    return out as T;
  }
  return (typeof override === typeof base ? override : base) as T;
}

// ─── Queries ────────────────────────────────────────────────────────────────

async function loadCatalog(): Promise<{ products: ProductDTO[]; categories: CategoryDTO[] }> {
  if (!hasDb()) return { products: fallbackProducts(), categories: defaultCategories };
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    ]);
    return { products: products.map(toProductDTO), categories: categories.map(toCategoryDTO) };
  } catch (err) {
    console.error("[data] catalog query failed, using fallback data:", err);
    return { products: fallbackProducts(), categories: defaultCategories };
  }
}

async function loadContent(): Promise<SiteContent> {
  if (!hasDb()) return defaultContent;
  try {
    const rows = await prisma.siteSetting.findMany();
    const stored: Record<string, unknown> = {};
    for (const r of rows) stored[r.key] = r.value;
    return mergeDeep(defaultContent, stored);
  } catch (err) {
    console.error("[data] settings query failed, using defaults:", err);
    return defaultContent;
  }
}

const cachedCatalog = unstable_cache(loadCatalog, ["catalog-v1"], { tags: [TAGS.catalog], revalidate: 3600 });
const cachedContent = unstable_cache(loadContent, ["content-v1"], { tags: [TAGS.content], revalidate: 3600 });

/** Every editable text & setting of the site */
export const getSiteContent = () => cachedContent();

/** All categories, ordered */
export async function getCategories() {
  return (await cachedCatalog()).categories;
}

/** Products visible on the storefront */
export async function getProducts(): Promise<ProductDTO[]> {
  return (await cachedCatalog()).products.filter((p) => p.visible);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: ProductDTO, limit = 4): Promise<ProductDTO[]> {
  const products = await getProducts();
  const others = products.filter((p) => p.id !== product.id);
  const same = others.filter((p) => p.categoryId && p.categoryId === product.categoryId);
  const rest = others.filter((p) => !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}

/** Admin: everything including hidden products (never cached) */
export async function getAdminSnapshot() {
  const [catalog, content] = await Promise.all([loadCatalog(), loadContent()]);
  return { ...catalog, content };
}

export { emptyL10n };
