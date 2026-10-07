"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon } from "@/components/ui/Icons";
import { useLocale } from "@/components/layout/LocaleProvider";

export function ContactForm() {
  const { dict } = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setState("sent");
      form.reset();
    } catch {
      setState("idle");
      toast.error(dict.contact.error);
    }
  };

  return (
    <div className="card relative overflow-hidden p-8 md:p-10">
      <AnimatePresence mode="wait">
        {state === "sent" ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center" role="status">
            <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.1 }} className="grid h-20 w-20 place-items-center rounded-full bg-olive-500 text-cream">
              <CheckIcon width={36} />
            </motion.span>
            <p className="max-w-sm text-lg">{dict.contact.success}</p>
            <button onClick={() => setState("idle")} className="btn-ghost">{dict.contact.formTitle}</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="font-serif text-3xl">{dict.contact.formTitle}</h2>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={dict.contact.name} name="name" required autoComplete="name" minLength={2} />
              <Field label={dict.contact.email} name="email" type="email" required autoComplete="email" />
            </div>
            <Field label={dict.contact.phone} name="phone" type="tel" autoComplete="tel" />
            <div>
              <label htmlFor="cf-message" className="mb-2 block text-sm font-medium text-charcoal-500">{dict.contact.message} *</label>
              <textarea id="cf-message" name="message" required minLength={5} rows={6} className="input resize-none" />
            </div>
            <button type="submit" disabled={state === "sending"} className="btn-primary w-full py-4">
              {state === "sending" ? dict.contact.sending : dict.contact.send}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `cf-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-charcoal-500">
        {label} {rest.required && "*"}
      </label>
      <input id={id} name={name} className="input" {...rest} />
    </div>
  );
}
