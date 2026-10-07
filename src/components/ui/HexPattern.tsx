import { cn } from "@/lib/utils";

/** Subtle, elegant honeycomb pattern used as a decorative background layer */
export function HexPattern({ className, opacity = 0.07, color = "#9A5A12", id = "hexp" }: { className?: string; opacity?: number; color?: string; id?: string }) {
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      <defs>
        <pattern id={id} width="56" height="97" patternUnits="userSpaceOnUse">
          <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L28 97" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A single hexagon shape (for badges, icons, decorations) */
export function Hexagon({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M50 3 L91 26.5 L91 73.5 L50 97 L9 73.5 L9 26.5 Z" fill="currentColor" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
