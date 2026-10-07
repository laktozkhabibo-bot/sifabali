import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A static band of real-looking honey flowing over a top edge (photoreal render, transparent WebP).
 * `wide` → full-width band; `card` → narrower cards; `comb` → honeycomb with drips across the whole page (home hero).
 * The band keeps a pleasant thickness on every screen size (object-cover, anchored to the top).
 */
export function HoneyEdge({ variant = "wide", className, priority = false }: { variant?: "wide" | "card" | "comb"; className?: string; priority?: boolean }) {
  if (variant === "comb") {
    // Real honeycomb with honey dripping from it, repeated seamlessly across the full width
    // (the tile is the photo + its mirror image, so neighbouring tiles always line up).
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none h-[clamp(130px,15.5vw,230px)] bg-repeat-x", className)}
        style={{ backgroundImage: "url(/images/honey-comb-edge.webp)", backgroundSize: "auto 100%", backgroundPosition: "left top" }}
      />
    );
  }
  const wide = variant === "wide";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden",
        wide ? "h-[clamp(64px,8.2vw,150px)]" : "aspect-[1152/189] w-full",
        className,
      )}
    >
      <Image
        src={wide ? "/images/honey-edge.webp" : "/images/honey-edge-card.webp"}
        alt=""
        fill
        priority={priority}
        sizes={wide ? "100vw" : "(min-width:1024px) 40vw, 85vw"}
        className="object-cover object-top"
      />
    </div>
  );
}
