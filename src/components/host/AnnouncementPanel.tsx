"use client";

import type { SiteContent } from "@/lib/types";
import { Card, L10nField, TextField, Toggle, useEditLang } from "./fields";

export function AnnouncementPanel({ value, onChange }: { value: SiteContent["announcement"]; onChange: (v: SiteContent["announcement"]) => void }) {
  const lang = useEditLang();
  const text = value.text[lang] || value.text.tr;
  return (
    <Card title="Duyuru Çubuğu" description="Sitenin en üstünde kayan kısa duyuru (ör. “Kargo bedava!”).">
      <Toggle label="Duyuru çubuğunu göster" checked={value.enabled} onChange={(enabled) => onChange({ ...value, enabled })} />
      <L10nField label="Duyuru metni" value={value.text} onChange={(t) => onChange({ ...value, text: t })} />
      <TextField label="Tıklanınca gidilecek sayfa" value={value.link} onChange={(link) => onChange({ ...value, link })} placeholder="/magaza" hint="Boş bırakılabilir" dir="ltr" />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Önizleme</p>
        <div className={`overflow-hidden rounded-xl bg-charcoal py-2.5 text-center text-sm text-honey-100 transition-opacity ${value.enabled ? "" : "opacity-40"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
          {text || "—"} <span className="text-honey-500">⬡</span>
        </div>
        {!value.enabled && <p className="mt-2 text-xs text-charcoal-400">Şu anda gizli.</p>}
      </div>
    </Card>
  );
}
