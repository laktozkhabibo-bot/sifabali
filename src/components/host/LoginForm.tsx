"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";

/** /hostpagepass — a calm, minimal password-only login. Verification happens on the server. */
export function LoginForm({ logo }: { logo?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/host/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Giriş başarısız.");
        setPassword("");
        return;
      }
      router.replace("/hostpage");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo emblem={logo} className="h-14" />
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-[0_10px_40px_-12px_rgba(27,24,20,.15)] ring-1 ring-charcoal/5">
          <label htmlFor="host-password" className="mb-2 block text-sm font-medium text-charcoal-600">
            Şifre
          </label>
          <div className="relative">
            <input
              id="host-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-xl border border-charcoal/10 bg-cream/60 px-4 py-3 pe-12 text-base focus:border-honey-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-honey-500/15"
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
              className="absolute end-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-charcoal-300 hover:text-charcoal"
            >
              {show ? <EyeOffIcon width={19} /> : <EyeIcon width={19} />}
            </button>
          </div>

          {error && (
            <p id="login-error" role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-charcoal py-3 text-[15px] font-semibold text-cream transition-colors hover:bg-honey-600 disabled:opacity-40"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
