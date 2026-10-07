"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/motion/Reveal";
import { HexPattern } from "@/components/ui/HexPattern";
import { CheckIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";

export function Newsletter({ title, text }: { title: string; text: string }) {
  const { locale, dict } = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, website: form.get("website") }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      toast.success(dict.home.newsletterSuccess);
    } catch {
      setState("idle");
      toast.error(dict.home.newsletterError);
    }
  };

  return (
    <section className="container pb-24 md:pb-32" aria-labelledby="newsletter-title">
      <Reveal>
        <div className="relative overflow-hidden rounded-[40px] bg-honey-gradient px-6 py-16 text-charcoal md:px-16 md:py-20">
          <HexPattern color="#1B1814" opacity={0.08} id="nl-hex" />
          <div className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-honey-200/60 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="newsletter-title" className="font-serif text-4xl font-semibold leading-tight md:text-5xl">{title}</h2>
              <p className="mt-4 max-w-md text-charcoal/75">{text}</p>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">{dict.home.newsletterPlaceholder}</label>
              {/* Honeypot field (hidden from humans) to stop spam bots */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <input
                id="nl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.home.newsletterPlaceholder}
                disabled={state === "done"}
                className="min-w-0 flex-1 rounded-full border border-charcoal/10 bg-cream/90 px-6 py-4 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-4 focus:ring-charcoal/10"
              />
                              <button type="submit" disabled={state !== "idle"} className="btn-primary w-full py-4 sm:w-auto">
                  {state === "done" ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <CheckIcon width={20} />
                    </motion.span>
                  ) : state === "loading" ? (
                    dict.common.loading
                  ) : (
                    dict.home.newsletterButton
                  )}
                </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
