"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { HexPattern } from "@/components/ui/HexPattern";
import { EyeIcon, EyeOffIcon, LockIcon } from "@/components/ui/Icons";

/** /hostpagepass — elegant password-only login. Verification happens on the server. */
export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
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
        setShake((s) => s + 1);
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
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-charcoal px-5">
      <HexPattern color="#E0961A" opacity={0.08} id="login-hex" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="mb-10 flex justify-center">
          <Logo tone="light" className="h-20" />
        </div>
        <motion.form
          key={shake}
          onSubmit={submit}
          animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : undefined}
          transition={{ duration: 0.45 }}
          className="rounded-[32px] border border-cream/10 bg-cream/[0.04] p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-honey-500/15 text-honey-400">
            <LockIcon width={26} />
          </div>
          <h1 className="text-center font-serif text-3xl text-cream">Yönetim Paneli</h1>
          <p className="mt-2 text-center text-sm text-cream/50">Devam etmek için şifrenizi girin.</p>

          <label htmlFor="host-password" className="sr-only">Şifre</label>
          <div className="relative mt-8">
            <input
              id="host-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••••"
              className="w-full rounded-2xl border border-cream/10 bg-charcoal/60 px-5 py-4 pe-14 text-lg tracking-wider text-cream placeholder:text-cream/25 focus:border-honey-500 focus:outline-none focus:ring-4 focus:ring-honey-500/20"
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
              className="absolute end-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-cream/50 hover:text-cream"
            >
              {show ? <EyeOffIcon width={20} /> : <EyeIcon width={20} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                id="login-error"
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-sm text-red-300"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading || !password} className="btn-honey mt-6 w-full py-4 text-base">
            {loading ? "Kontrol ediliyor…" : "Giriş Yap"}
          </button>
        </motion.form>
        <p className="mt-6 text-center text-xs text-cream/30">Güvenli bağlantı · Şifre sunucuda doğrulanır</p>
      </motion.div>
    </main>
  );
}
