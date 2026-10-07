"use client";

import type { SiteContent } from "@/lib/types";
import { Card, L10nField, TextField } from "./fields";

export function ContactPanel({ contact, onChange }: { contact: SiteContent["contact"]; onChange: (c: SiteContent["contact"]) => void }) {
  const set = <K extends keyof SiteContent["contact"]>(k: K, v: SiteContent["contact"][K]) => onChange({ ...contact, [k]: v });
  return (
    <div className="space-y-5">
      <Card title="İletişim Bilgileri" description="İletişim sayfası, alt bilgi, WhatsApp butonu ve sipariş mesajlarında kullanılır.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="WhatsApp numarası" value={contact.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="+90 555 123 45 67" hint="Siparişler bu numaraya gelir" dir="ltr" />
          <TextField label="Telefon" value={contact.phone} onChange={(v) => set("phone", v)} placeholder="+90 …" dir="ltr" />
        </div>
        <TextField label="E-posta" type="email" value={contact.email} onChange={(v) => set("email", v)} dir="ltr" />
        <L10nField label="Adres" value={contact.address} onChange={(v) => set("address", v)} multiline rows={2} />
        <L10nField label="Çalışma saatleri" value={contact.hours} onChange={(v) => set("hours", v)} />
        <TextField label="Harita bağlantısı (Google Maps)" value={contact.mapUrl} onChange={(v) => set("mapUrl", v)} placeholder="https://maps.google.com/…" dir="ltr" />
      </Card>
      <Card title="Sosyal Medya" description="Boş bırakılan hesaplar sitede gösterilmez.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Instagram" value={contact.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/…" dir="ltr" />
          <TextField label="Facebook" value={contact.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/…" dir="ltr" />
          <TextField label="YouTube" value={contact.youtube} onChange={(v) => set("youtube", v)} placeholder="https://youtube.com/…" dir="ltr" />
          <TextField label="TikTok" value={contact.tiktok} onChange={(v) => set("tiktok", v)} placeholder="https://tiktok.com/@…" dir="ltr" />
        </div>
      </Card>
    </div>
  );
}
