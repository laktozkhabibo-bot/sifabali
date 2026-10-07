"use client";

/**
 * Form primitives for the host panel — large, clear and friendly for non-technical users.
 */
import { createContext, useContext, useId, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { L10n, L10nList } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Editing language (TR / EN / AR) shared by every translatable field ───
export const EditLangContext = createContext<Locale>("tr");
export const useEditLang = () => useContext(EditLangContext);

const LANG_LABEL: Record<Locale, string> = { tr: "TR", en: "EN", ar: "AR" };

export function Card({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-charcoal/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.03)] md:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-charcoal">{title}</h2>
          {description && <p className="mt-1 text-sm text-charcoal-400">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-charcoal-600">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-charcoal-300">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-charcoal/10 bg-[#FBFAF7] px-3.5 py-2.5 text-[15px] text-charcoal placeholder:text-charcoal-300 transition focus:border-honey-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-honey-500/15";

export function TextField({ label, value, onChange, hint, type = "text", placeholder, dir, required }: { label: string; value: string; onChange: (v: string) => void; hint?: string; type?: string; placeholder?: string; dir?: "ltr" | "rtl"; required?: boolean }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}{required && <span className="text-red-500"> *</span>}</Label>
      <input id={id} type={type} value={value} placeholder={placeholder} dir={dir} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}

export function NumberField({ label, value, onChange, hint, min = 0, step = 1, suffix, allowEmpty }: { label: string; value: number | null; onChange: (v: number | null) => void; hint?: string; min?: number; step?: number; suffix?: string; allowEmpty?: boolean }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return onChange(allowEmpty ? null : 0);
            const n = Number(raw);
            if (!Number.isNaN(n)) onChange(n);
          }}
          className={cn(inputCls, suffix && "pe-10")}
        />
        {suffix && <span className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-sm text-charcoal-400">{suffix}</span>}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] px-4 py-3">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-charcoal-400">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-olive-500" : "bg-charcoal/20")}
      >
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-6" : "left-1")} />
      </button>
    </label>
  );
}

/** Shows which languages are filled for a translatable value */
function LangDots({ value }: { value: Partial<Record<Locale, string | string[]>> }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {(Object.keys(LANG_LABEL) as Locale[]).map((l) => {
        const v = value[l];
        const filled = Array.isArray(v) ? v.length > 0 : !!v?.trim();
        return (
          <span key={l} title={`${LANG_LABEL[l]}: ${filled ? "dolu" : "boş"}`} className={cn("rounded px-1 text-[9px] font-bold", filled ? "bg-olive-500/15 text-olive-600" : "bg-red-500/10 text-red-500")}>
            {LANG_LABEL[l]}
          </span>
        );
      })}
    </span>
  );
}

/** Text input for the currently selected editing language */
export function L10nField({ label, value, onChange, multiline = false, rows = 3, hint }: { label: string; value: L10n; onChange: (v: L10n) => void; multiline?: boolean; rows?: number; hint?: string }) {
  const lang = useEditLang();
  const id = useId();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const set = (text: string) => onChange({ ...value, [lang]: text });
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-charcoal-600">
          {label} <span className="ms-1 rounded-md bg-honey-100 px-1.5 py-0.5 text-[10px] font-bold text-honey-800">{LANG_LABEL[lang]}</span>
        </label>
        <LangDots value={value} />
      </div>
      {multiline ? (
        <textarea id={id} dir={dir} rows={rows} value={value[lang] ?? ""} onChange={(e) => set(e.target.value)} className={cn(inputCls, "resize-y leading-relaxed", lang === "ar" && "font-arabic")} />
      ) : (
        <input id={id} dir={dir} value={value[lang] ?? ""} onChange={(e) => set(e.target.value)} className={cn(inputCls, lang === "ar" && "font-arabic")} />
      )}
      {hint && <p className="mt-1 text-xs text-charcoal-400">{hint}</p>}
      {lang !== "tr" && !value[lang]?.trim() && value.tr && (
        <p className="mt-1 text-xs text-charcoal-400">Boş bırakılırsa Türkçe metin gösterilir: “{value.tr.slice(0, 60)}{value.tr.length > 60 ? "…" : ""}”</p>
      )}
    </div>
  );
}

/** One item per line (e.g. product benefits) for the selected language */
export function L10nListField({ label, value, onChange, hint }: { label: string; value: L10nList; onChange: (v: L10nList) => void; hint?: string }) {
  const lang = useEditLang();
  const id = useId();
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-charcoal-600">
          {label} <span className="ms-1 rounded-md bg-honey-100 px-1.5 py-0.5 text-[10px] font-bold text-honey-800">{LANG_LABEL[lang]}</span>
        </label>
        <LangDots value={value} />
      </div>
      <textarea
        id={id}
        dir={lang === "ar" ? "rtl" : "ltr"}
        rows={4}
        value={(value[lang] ?? []).join("\n")}
        onChange={(e) => onChange({ ...value, [lang]: e.target.value.split("\n").map((s) => s.replace(/^\s+/, "")).filter((s, i, arr) => s !== "" || i === arr.length - 1) })}
        className={cn(inputCls, "resize-y leading-relaxed")}
      />
      <p className="mt-1 text-xs text-charcoal-400">{hint ?? "Her satıra bir madde yazın."}</p>
    </div>
  );
}
