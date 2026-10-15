import { cn } from "@/lib/utils";

/**
 * Şifa Balı logo: the "SB" emblem (bee, honeycomb & blossoms) + the "Şifa BALI" wordmark.
 * The emblem is an image (its background is the site cream, edges feathered); the wordmark is
 * vector text (calligraphic bronze "Şifa" + bold dark-brown serif "BALI", gold rule & hexagon),
 * so it stays razor-sharp.
 * The whole logo scales with the height given in `className` (e.g. "h-11").
 *  - tone="light": for dark backgrounds (emblem sits on a cream badge, lighter gold text)
 *  - compact: emblem only
 *  - emblem: picture set in the host panel ("" hides it, the wordmark stays)
 */
export function Logo({
  className,
  tone = "dark",
  compact = false,
  emblem = "/images/logo-emblem.webp",
}: {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
  emblem?: string;
}) {
  const light = tone === "light";
  const gid = light ? "logo-gold-light" : "logo-gold";
  return (
    <span className={cn("inline-flex h-10 items-center gap-[0.18em]", className)} role="img" aria-label="Şifa Balı">
      {emblem && (
        <span className={cn("relative block h-full shrink-0", light && "rounded-xl bg-cream px-1 py-0.5")}>
          {/* eslint-disable-next-line @next/next/no-img-element -- small brand mark, needs to scale with the text */}
          <img src={emblem} alt="" width={487} height={340} className="block h-full w-auto" draggable={false} />
        </span>
      )}
      {(!compact || !emblem) && (
        <svg viewBox="0 0 260 100" className="block h-full w-auto overflow-visible" aria-hidden style={{ direction: "ltr" }}>
          <defs>
            {/* "Şifa": deep bronze fading to antique gold, like the printed card */}
            <linearGradient id={`${gid}-s`} x1="0" y1="0" x2="1" y2="1">
              {light ? (
                <>
                  <stop offset="0" stopColor="#F3D58E" />
                  <stop offset="1" stopColor="#C68A2E" />
                </>
              ) : (
                <>
                  <stop offset="0" stopColor="#5A3412" />
                  <stop offset=".55" stopColor="#7E4E1C" />
                  <stop offset="1" stopColor="#A87A34" />
                </>
              )}
            </linearGradient>
            <linearGradient id={`${gid}-r`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={light ? "#E3B25A" : "#B88A3A"} stopOpacity="0" />
              <stop offset=".25" stopColor={light ? "#E3B25A" : "#B88A3A"} />
              <stop offset=".75" stopColor={light ? "#E3B25A" : "#B88A3A"} />
              <stop offset="1" stopColor={light ? "#E3B25A" : "#B88A3A"} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* "Şifa" — calligraphic script */}
          <text x="0" y="64" fontSize="68" fill={`url(#${gid}-s)`} style={{ fontFamily: "var(--font-script), 'Great Vibes', cursive" }}>
            Şifa
          </text>
          {/* "BALI" — bold classic serif capitals in dark brown */}
          <text x="124" y="56" fontSize="34" fontWeight={700} letterSpacing="3" fill={light ? "#F3E3C0" : "#4A2C12"} style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>
            BALI
          </text>
          {/* fine gold rule with a hexagon in the middle */}
          <rect x="104" y="73" width="70" height="1.8" fill={`url(#${gid}-r)`} />
          <rect x="196" y="73" width="62" height="1.8" fill={`url(#${gid}-r)`} />
          <path d="M185 64 l8.5 4.9 v9.8 l-8.5 4.9 l-8.5 -4.9 v-9.8 z" fill={light ? "#E3B25A" : "#B5852F"} stroke={light ? "#C68A2E" : "#8A5E1C"} strokeWidth="1" />
        </svg>
      )}
    </span>
  );
}
