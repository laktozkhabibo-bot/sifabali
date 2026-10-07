import type { CSSProperties } from "react";

/**
 * Reveals a heading letter by letter with pure CSS (starts at first paint, no JavaScript needed).
 * Arabic is revealed word by word — splitting Arabic letters would break their joined shapes.
 * prefers-reduced-motion is handled globally in globals.css.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  byWord = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  byWord?: boolean;
}) {
  const words = text.split(" ");
  let index = 0;

  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wi) => {
        const units = byWord ? [word] : Array.from(word);
        return (
          <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
            {units.map((ch, ci) => {
              const i = index++;
              const style: CSSProperties = { animationDelay: `${delay + i * (byWord ? stagger * 3 : stagger)}s` };
              return (
                <span key={ci} className="inline-block animate-char-in" style={style}>
                  {ch}
                </span>
              );
            })}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </span>
  );
}
