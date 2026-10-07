import { HexPattern } from "./HexPattern";
import { Reveal } from "@/components/motion/Reveal";

/** Shared intro band for inner pages (shop, about, contact…) */
export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-cream-200 pb-16 pt-[calc(var(--header-h)+64px)] md:pb-20 md:pt-[calc(var(--header-h)+96px)]">
      <HexPattern opacity={0.08} id="ph-hex" />
      <div className="pointer-events-none absolute -end-24 -top-24 h-96 w-96 rounded-full bg-honey-300/40 blur-3xl" />
      <div className="container relative">
        <Reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h-section mt-4 max-w-3xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-xl text-lg text-charcoal-500">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}
