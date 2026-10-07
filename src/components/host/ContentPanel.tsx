"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon, StarIcon } from "@/components/ui/Icons";
import type { SiteContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, L10nField, NumberField, TextField, Toggle } from "./fields";
import { ImageUploader } from "./ImageUploader";

type Setter = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;

const SECTIONS = [
  { id: "hero", label: "Ana Sayfa Girişi (Hero)" },
  { id: "why", label: "Neden Şifa Balı" },
  { id: "stats", label: "Rakamlar" },
  { id: "journey", label: "Çiçekten Kavanoza" },
  { id: "about", label: "Hakkımızda" },
  { id: "testimonials", label: "Müşteri Yorumları" },
  { id: "newsletter", label: "Bülten" },
  { id: "brand", label: "Slogan & Alt Bilgi" },
  { id: "seo", label: "SEO (Google)" },
] as const;

/** Every text on the website, grouped by page section */
export function ContentPanel({ content, set }: { content: SiteContent; set: Setter }) {
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("hero");

  return (
    <div className="space-y-5">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium transition", section === s.id ? "bg-charcoal text-cream" : "bg-white text-charcoal-500 ring-1 ring-charcoal/10 hover:text-charcoal")}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "hero" && (
        <Card title="Ana Sayfa Girişi" description="Sitenin en üstündeki büyük başlık alanı.">
          <L10nField label="Üst küçük başlık" value={content.hero.eyebrow} onChange={(eyebrow) => set("hero", { ...content.hero, eyebrow })} />
          <L10nField label="Ana başlık" value={content.hero.title} onChange={(title) => set("hero", { ...content.hero, title })} hint="Harf harf animasyonla görünür. Kısa ve etkileyici tutun." />
          <L10nField label="Açıklama" value={content.hero.subtitle} onChange={(subtitle) => set("hero", { ...content.hero, subtitle })} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <L10nField label="1. buton yazısı" value={content.hero.ctaPrimary} onChange={(ctaPrimary) => set("hero", { ...content.hero, ctaPrimary })} />
            <L10nField label="2. buton yazısı" value={content.hero.ctaSecondary} onChange={(ctaSecondary) => set("hero", { ...content.hero, ctaSecondary })} />
          </div>
        </Card>
      )}

      {section === "why" && (
        <Card title="Neden Şifa Balı?" description="Ana sayfadaki koyu renkli özellik bölümü (4 kart).">
          <L10nField label="Başlık" value={content.why.title} onChange={(title) => set("why", { ...content.why, title })} />
          <L10nField label="Alt başlık" value={content.why.subtitle} onChange={(subtitle) => set("why", { ...content.why, subtitle })} multiline rows={2} />
          {content.why.items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-charcoal-400">Kart {i + 1}</p>
              <div className="space-y-4">
                <L10nField label="Başlık" value={item.title} onChange={(title) => set("why", { ...content.why, items: content.why.items.map((x, j) => (j === i ? { ...x, title } : x)) })} />
                <L10nField label="Metin" value={item.text} onChange={(text) => set("why", { ...content.why, items: content.why.items.map((x, j) => (j === i ? { ...x, text } : x)) })} multiline rows={2} />
              </div>
            </div>
          ))}
        </Card>
      )}

      {section === "stats" && (
        <Card title="Rakamlar" description="Sayfada kayarken sayarak artan sayaçlar.">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Mutlu müşteri" value={content.stats.customers} onChange={(v) => set("stats", { ...content.stats, customers: Math.round(v ?? 0) })} />
            <NumberField label="Kovan sayısı" value={content.stats.hives} onChange={(v) => set("stats", { ...content.stats, hives: Math.round(v ?? 0) })} />
            <NumberField label="Yıllık tecrübe" value={content.stats.years} onChange={(v) => set("stats", { ...content.stats, years: Math.round(v ?? 0) })} />
          </div>
        </Card>
      )}

      {section === "journey" && (
        <Card title="Çiçekten Kavanoza" description="Yatay kayan hikâye bölümü (5 adım).">
          <L10nField label="Başlık" value={content.journey.title} onChange={(title) => set("journey", { ...content.journey, title })} />
          <L10nField label="Alt başlık" value={content.journey.subtitle} onChange={(subtitle) => set("journey", { ...content.journey, subtitle })} />
          {content.journey.steps.map((step, i) => (
            <div key={i} className="rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-charcoal-400">Adım {i + 1}</p>
              <div className="space-y-4">
                <L10nField label="Başlık" value={step.title} onChange={(title) => set("journey", { ...content.journey, steps: content.journey.steps.map((x, j) => (j === i ? { ...x, title } : x)) })} />
                <L10nField label="Metin" value={step.text} onChange={(text) => set("journey", { ...content.journey, steps: content.journey.steps.map((x, j) => (j === i ? { ...x, text } : x)) })} multiline rows={2} />
                <ImageUploader
                  images={step.image ? [step.image] : []}
                  onChange={(imgs) => set("journey", { ...content.journey, steps: content.journey.steps.map((x, j) => (j === i ? { ...x, image: imgs[imgs.length - 1] ?? "" } : x)) })}
                />
                <Toggle
                  label="Şeffaf arka planlı görsel (PNG)"
                  description="Açık: görsel kırpılmadan tamamı gösterilir. Kapalı: fotoğraf çerçeveyi doldurur."
                  checked={step.fit === "contain"}
                  onChange={(on) => set("journey", { ...content.journey, steps: content.journey.steps.map((x, j) => (j === i ? { ...x, fit: on ? "contain" : "cover" } : x)) })}
                />
              </div>
            </div>
          ))}
        </Card>
      )}

      {section === "about" && (
        <Card title="Hakkımızda" description="Hakkımızda sayfasındaki marka hikâyesi.">
          <L10nField label="Sayfa başlığı" value={content.about.title} onChange={(title) => set("about", { ...content.about, title })} />
          <L10nField label="Giriş cümlesi" value={content.about.intro} onChange={(intro) => set("about", { ...content.about, intro })} multiline rows={2} />
          <L10nField label="Hikâyemiz" value={content.about.story} onChange={(story) => set("about", { ...content.about, story })} multiline rows={10} hint="Paragrafları ayırmak için arada bir boş satır bırakın." />
          <L10nField label="Alıntı / Söz" value={content.about.quote} onChange={(quote) => set("about", { ...content.about, quote })} multiline rows={2} />
          <L10nField label="Misyon" value={content.about.mission} onChange={(mission) => set("about", { ...content.about, mission })} multiline rows={2} />
        </Card>
      )}

      {section === "testimonials" && (
        <Card
          title="Müşteri Yorumları"
          description="Ana sayfada otomatik dönen yorumlar."
          actions={
            <button
              onClick={() =>
                set("testimonials", {
                  ...content.testimonials,
                  items: [...content.testimonials.items, { id: `t-${Date.now()}`, name: "", city: "", rating: 5, text: { tr: "", en: "", ar: "" } }],
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-cream hover:bg-honey-600"
            >
              <PlusIcon width={18} /> Yorum Ekle
            </button>
          }
        >
          <L10nField label="Bölüm başlığı" value={content.testimonials.title} onChange={(title) => set("testimonials", { ...content.testimonials, title })} />
          {content.testimonials.items.map((item, i) => {
            const patch = (p: Partial<typeof item>) =>
              set("testimonials", { ...content.testimonials, items: content.testimonials.items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <div key={item.id} className="rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-charcoal-400">Yorum {i + 1}</p>
                  <button
                    onClick={() => confirm("Bu yorum silinsin mi?") && set("testimonials", { ...content.testimonials, items: content.testimonials.items.filter((_, j) => j !== i) })}
                    aria-label="Yorumu sil"
                    className="grid h-8 w-8 place-items-center rounded-lg text-charcoal-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon width={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                    <TextField label="İsim" value={item.name} onChange={(name) => patch({ name })} />
                    <TextField label="Şehir" value={item.city} onChange={(city) => patch({ city })} />
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-charcoal-600">Puan</span>
                      <div className="flex h-[46px] items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => patch({ rating: n })} aria-label={`${n} yıldız`} className={n <= item.rating ? "text-honey-500" : "text-charcoal-200"}>
                            <StarIcon width={22} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <L10nField label="Yorum" value={item.text} onChange={(text) => patch({ text })} multiline rows={3} />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {section === "newsletter" && (
        <Card title="Bülten" description="Ana sayfanın altındaki e-posta abonelik alanı.">
          <L10nField label="Başlık" value={content.newsletter.title} onChange={(title) => set("newsletter", { ...content.newsletter, title })} />
          <L10nField label="Metin" value={content.newsletter.text} onChange={(text) => set("newsletter", { ...content.newsletter, text })} multiline rows={2} />
        </Card>
      )}

      {section === "brand" && (
        <Card title="Slogan & Alt Bilgi">
          <L10nField label="Slogan" value={content.brand.tagline} onChange={(tagline) => set("brand", { ...content.brand, tagline })} />
          <L10nField label="Alt bilgi (footer) metni" value={content.brand.footerText} onChange={(footerText) => set("brand", { ...content.brand, footerText })} multiline rows={2} />
        </Card>
      )}

      {section === "seo" && (
        <Card title="SEO — Google'da Görünüm" description="Arama sonuçlarında ve paylaşımlarda görünen başlık ve açıklama.">
          <L10nField label="Site başlığı" value={content.seo.title} onChange={(title) => set("seo", { ...content.seo, title })} hint="Önerilen: 50–60 karakter" />
          <L10nField label="Site açıklaması" value={content.seo.description} onChange={(description) => set("seo", { ...content.seo, description })} multiline rows={3} hint="Önerilen: 140–160 karakter" />
          <div className="rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Google önizleme</p>
            <p className="mt-3 truncate text-lg text-[#1a0dab]">{content.seo.title.tr}</p>
            <p className="text-sm text-[#006621]">sifabali.com</p>
            <p className="line-clamp-2 text-sm text-charcoal-500">{content.seo.description.tr}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
