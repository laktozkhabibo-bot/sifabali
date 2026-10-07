"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MailIcon, TrashIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { Card } from "./fields";

interface Message { id: string; name: string; email: string; phone: string; message: string; read: boolean; createdAt: string }
interface Subscriber { id: string; email: string; locale: string; createdAt: string }

const date = (s: string) => new Date(s).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });

/** Contact-form messages & newsletter subscribers (actions apply immediately) */
export function InboxPanel({ onUnread }: { onUnread?: (n: number) => void }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/inbox", { cache: "no-store" });
    if (!res.ok) return toast.error("Gelen kutusu yüklenemedi.");
    const data = await res.json();
    setMessages(data.messages);
    setSubscribers(data.subscribers);
    onUnread?.(data.messages.filter((m: Message) => !m.read).length);
  }, [onUnread]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (action: string, id: string) => {
    const res = await fetch("/api/admin/inbox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id }) });
    if (!res.ok) return toast.error("İşlem başarısız.");
    if (action !== "read") toast.success("Silindi");
    load();
  };

  const exportCsv = () => {
    const csv = ["email,dil,tarih", ...subscribers.map((s) => `${s.email},${s.locale},${s.createdAt}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "sifabali-aboneler.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <Card title="Mesajlar" description="İletişim formundan gelen mesajlar.">
        {messages === null ? (
          <p className="text-sm text-charcoal-400">Yükleniyor…</p>
        ) : messages.length === 0 ? (
          <p className="rounded-2xl bg-[#FBFAF7] p-8 text-center text-sm text-charcoal-400">Henüz mesaj yok.</p>
        ) : (
          <ul className="divide-y divide-charcoal/[0.06] overflow-hidden rounded-2xl border border-charcoal/[0.07]">
            {messages.map((m) => (
              <li key={m.id} className={cn("bg-white", !m.read && "bg-honey-50/60")}>
                <button
                  className="flex w-full items-start gap-3 p-4 text-start"
                  onClick={() => {
                    setOpen(open === m.id ? null : m.id);
                    if (!m.read) act("read", m.id);
                  }}
                  aria-expanded={open === m.id}
                >
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-honey-500")} />
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-2">
                      <span className="truncate font-semibold">{m.name}</span>
                      <span className="shrink-0 text-xs text-charcoal-400">{date(m.createdAt)}</span>
                    </span>
                    <span className={cn("block text-sm text-charcoal-500", open === m.id ? "whitespace-pre-wrap" : "truncate")}>{m.message}</span>
                  </span>
                </button>
                {open === m.id && (
                  <div className="flex flex-wrap items-center gap-2 px-9 pb-4 text-sm">
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-1.5 text-cream"><MailIcon width={14} /> {m.email}</a>
                    {m.phone && <a href={`tel:${m.phone}`} className="rounded-lg border border-charcoal/10 px-3 py-1.5">{m.phone}</a>}
                    <button onClick={() => confirm("Mesaj silinsin mi?") && act("delete-message", m.id)} className="ms-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50">
                      <TrashIcon width={14} /> Sil
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card
        title={`Bülten Aboneleri (${subscribers.length})`}
        actions={subscribers.length > 0 ? <button onClick={exportCsv} className="rounded-xl border border-charcoal/10 px-4 py-2 text-sm font-medium hover:bg-charcoal hover:text-cream">CSV indir</button> : undefined}
      >
        {subscribers.length === 0 ? (
          <p className="rounded-2xl bg-[#FBFAF7] p-8 text-center text-sm text-charcoal-400">Henüz abone yok.</p>
        ) : (
          <ul className="max-h-96 divide-y divide-charcoal/[0.06] overflow-y-auto rounded-2xl border border-charcoal/[0.07]">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 bg-white px-4 py-3 text-sm">
                <span className="truncate">{s.email}</span>
                <span className="flex shrink-0 items-center gap-3 text-xs text-charcoal-400">
                  {s.locale.toUpperCase()} · {date(s.createdAt)}
                  <button onClick={() => confirm("Abone silinsin mi?") && act("delete-subscriber", s.id)} aria-label="Sil" className="rounded p-1 hover:bg-red-50 hover:text-red-600"><TrashIcon width={14} /></button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
