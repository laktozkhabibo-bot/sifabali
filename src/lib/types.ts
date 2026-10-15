import type { Locale } from "./i18n/config";

/** A string translated into every site language */
export type L10n = Record<Locale, string>;
export type L10nList = Record<Locale, string[]>;

export interface CategoryDTO {
  id: string;
  slug: string;
  name: L10n;
  sortOrder: number;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: L10n;
  description: L10n;
  benefits: L10nList;
  weight: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string[];
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  categoryId: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: L10n;
}

export interface FeatureItem {
  title: L10n;
  text: L10n;
}

/** Icons the host can pick for a "Neden Şifa Balı?" card (see components/ui/FeatureIcons.tsx) */
export const FEATURE_ICONS = [
  "leaf", "sprout", "flower", "tree", "mountain", "sun", "droplet", "bee", "honeycomb", "hive",
  "jar", "dipper", "harvest", "flask", "microscope", "shield", "badge", "award", "star", "crown",
  "heart", "hand-heart", "smile", "users", "truck", "package", "gift", "clock", "globe", "pin",
  "sparkle", "recycle", "no-heat", "thumbs-up",
] as const;
export type FeatureIconName = (typeof FEATURE_ICONS)[number];

/** A "Neden Şifa Balı?" card with its chosen icon */
export interface WhyItem extends FeatureItem {
  icon: FeatureIconName;
}

/** Every replaceable picture of the site. An empty string removes the picture from the site. */
export interface SiteMedia {
  logo: string;
  heroImage: string;
  heroComb: string;
  bees: boolean;
  aboutMain: string;
  aboutSecond: string;
}

/** A step of the "Çiçekten Kavanoza" story, with its picture */
export interface JourneyStep extends FeatureItem {
  image: string;
  /** "cover" fills the frame (photos) · "contain" shows the whole image (transparent PNG cut-outs) */
  fit: "cover" | "contain";
}

export interface SiteContent {
  announcement: { enabled: boolean; text: L10n; link: string };
  hero: { eyebrow: L10n; title: L10n; subtitle: L10n; ctaPrimary: L10n; ctaSecondary: L10n };
  stats: { customers: number; hives: number; years: number };
  why: { title: L10n; subtitle: L10n; items: WhyItem[] };
  journey: { title: L10n; subtitle: L10n; steps: JourneyStep[] };
  about: { title: L10n; intro: L10n; story: L10n; mission: L10n; quote: L10n };
  testimonials: { title: L10n; items: Testimonial[] };
  newsletter: { title: L10n; text: L10n };
  brand: { tagline: L10n; footerText: L10n };
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    address: L10n;
    hours: L10n;
    mapUrl: string;
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
  seo: { title: L10n; description: L10n };
  media: SiteMedia;
}

export type SiteContentKey = keyof SiteContent;
