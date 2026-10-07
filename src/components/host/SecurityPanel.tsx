"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LogoutIcon } from "@/components/ui/Icons";
import { Card, TextField } from "./fields";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 10) s++;
  if (pw.length >= 14) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
const LABELS = ["Çok zayıf", "Zayıf", "Orta", "İyi", "Güçlü"];
const COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-olive-500"];

export function SecurityPanel({ onLogout }: { onLogout: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const s = strength(next);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 10) return toast.error("Yeni şifre en az 10 karakter olmalı.");
    if (next !== confirmPw) return toast.error("Yeni şifreler eşleşmiyor.");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current, next }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Şifre değiştirilemedi.");
      toast.success("Şifreniz güncellendi. Diğer tüm oturumlar kapatıldı.");
      setCurrent("");
      setNext("");
      setConfirmPw("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card title="Şifre Değiştir" description="Şifreniz sunucuda bcrypt ile şifrelenmiş olarak saklanır. Değiştirdiğinizde diğer cihazlardaki oturumlar kapanır.">
        <form onSubmit={submit} className="space-y-4">
          <TextField label="Mevcut şifre" type="password" value={current} onChange={setCurrent} />
          <TextField label="Yeni şifre" type="password" value={next} onChange={setNext} hint="En az 10 karakter" />
          {next && (
            <div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i < s ? COLORS[s] : "bg-charcoal/10"}`} />
                ))}
              </div>
              <p className="mt-1 text-xs text-charcoal-400">Güç: {LABELS[s]}</p>
            </div>
          )}
          <TextField label="Yeni şifre (tekrar)" type="password" value={confirmPw} onChange={setConfirmPw} />
          <button type="submit" disabled={loading || !current || !next} className="rounded-xl bg-charcoal px-5 py-3 text-sm font-semibold text-cream hover:bg-honey-600 disabled:opacity-40">
            {loading ? "Güncelleniyor…" : "Şifreyi Güncelle"}
          </button>
        </form>
      </Card>
      <Card title="Oturum" description="Ortak bir bilgisayar kullanıyorsanız işiniz bitince çıkış yapın.">
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
          <LogoutIcon width={18} /> Çıkış Yap
        </button>
      </Card>
    </div>
  );
}
