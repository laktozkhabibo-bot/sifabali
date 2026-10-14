"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, LogoutIcon } from "@/components/ui/Icons";
import { Card } from "./fields";

const MIN = 8;

function PasswordInput({ id, label, value, onChange, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-charcoal-600">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-charcoal/10 bg-[#FBFAF7] px-3.5 py-2.5 pe-11 text-[15px] focus:border-honey-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-honey-500/15"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
          className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-charcoal-300 hover:text-charcoal"
        >
          {show ? <EyeOffIcon width={18} /> : <EyeIcon width={18} />}
        </button>
      </div>
    </div>
  );
}

/** Change the host password (verified on the server, stored as a bcrypt hash) + log out */
export function SecurityPanel({ onLogout }: { onLogout: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);

  const tooShort = next.length > 0 && next.length < MIN;
  const mismatch = repeat.length > 0 && next !== repeat;
  const canSubmit = !!current && next.length >= MIN && next === repeat && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Şifre değiştirilemedi.");
      toast.success("Şifreniz değiştirildi.", { description: "Bir sonraki girişte yeni şifrenizi kullanın." });
      setCurrent("");
      setNext("");
      setRepeat("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card title="Şifre Değiştir" description="Yönetim paneline giriş şifrenizi buradan değiştirebilirsiniz. Diğer cihazlardaki oturumlar otomatik kapanır.">
        <form onSubmit={submit} className="max-w-md space-y-4">
          <PasswordInput id="pw-current" label="Mevcut şifre" value={current} onChange={setCurrent} autoComplete="current-password" />
          <div>
            <PasswordInput id="pw-next" label="Yeni şifre" value={next} onChange={setNext} autoComplete="new-password" />
            <p className={`mt-1 text-xs ${tooShort ? "text-red-500" : "text-charcoal-400"}`}>En az {MIN} karakter.</p>
          </div>
          <div>
            <PasswordInput id="pw-repeat" label="Yeni şifre (tekrar)" value={repeat} onChange={setRepeat} autoComplete="new-password" />
            {mismatch && <p className="mt-1 text-xs text-red-500">Şifreler eşleşmiyor.</p>}
          </div>
          <button type="submit" disabled={!canSubmit} className="w-full rounded-xl bg-charcoal px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-honey-600 disabled:opacity-40 sm:w-auto">
            {loading ? "Kaydediliyor…" : "Şifreyi Değiştir"}
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
