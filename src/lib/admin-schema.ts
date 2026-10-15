/** Validation schemas for data sent by the host panel */
import { z } from "zod";
import { FEATURE_ICONS } from "./types";

const l10n = z.object({ tr: z.string().max(5000), en: z.string().max(5000), ar: z.string().max(5000) });
const l10nList = z.object({ tr: z.array(z.string().max(300)).max(30), en: z.array(z.string().max(300)).max(30), ar: z.array(z.string().max(300)).max(30) });
const feature = z.object({ title: l10n, text: l10n });
const url = z.string().trim().max(500);

export const categorySchema = z.object({
  id: z.string().min(1).max(60),
  slug: z.string().trim().max(80), // empty → generated from the name
  name: l10n,
  sortOrder: z.number().int(),
});

export const productSchema = z.object({
  id: z.string().min(1).max(60),
  slug: z.string().trim().max(100), // empty → generated from the name
  name: l10n,
  description: l10n,
  benefits: l10nList,
  weight: z.string().max(60),
  price: z.number().min(0).max(10_000_000),
  salePrice: z.number().min(0).max(10_000_000).nullable(),
  stock: z.number().int().min(0).max(1_000_000),
  images: z.array(z.string().max(1000)).max(12),
  visible: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int(),
  categoryId: z.string().max(60).nullable(),
});

export const contentSchema = z.object({
  announcement: z.object({ enabled: z.boolean(), text: l10n, link: url }),
  hero: z.object({ eyebrow: l10n, title: l10n, subtitle: l10n, ctaPrimary: l10n, ctaSecondary: l10n }),
  stats: z.object({ customers: z.number().int().min(0), hives: z.number().int().min(0), years: z.number().int().min(0) }),
  why: z.object({ title: l10n, subtitle: l10n, items: z.array(feature.extend({ icon: z.enum(FEATURE_ICONS) })).max(8) }),
  journey: z.object({
    title: l10n,
    subtitle: l10n,
    steps: z.array(feature.extend({ image: z.string().max(1000), fit: z.enum(["cover", "contain"]) })).max(10),
  }),
  about: z.object({ title: l10n, intro: l10n, story: l10n, mission: l10n, quote: l10n }),
  testimonials: z.object({
    title: l10n,
    items: z.array(z.object({ id: z.string().max(60), name: z.string().max(120), city: z.string().max(120), rating: z.number().int().min(1).max(5), text: l10n })).max(30),
  }),
  newsletter: z.object({ title: l10n, text: l10n }),
  brand: z.object({ tagline: l10n, footerText: l10n }),
  contact: z.object({
    whatsapp: z.string().max(40),
    phone: z.string().max(40),
    email: z.string().max(200),
    address: l10n,
    hours: l10n,
    mapUrl: url,
    instagram: url,
    facebook: url,
    youtube: url,
    tiktok: url,
  }),
  seo: z.object({ title: l10n, description: l10n }),
  media: z.object({
    logo: z.string().max(1000),
    heroImage: z.string().max(1000),
    heroComb: z.string().max(1000),
    bees: z.boolean(),
    aboutMain: z.string().max(1000),
    aboutSecond: z.string().max(1000),
  }),
});

export const saveSchema = z.object({
  categories: z.array(categorySchema).max(100),
  products: z.array(productSchema).max(1000),
  content: contentSchema,
});

export type SavePayload = z.infer<typeof saveSchema>;
