import type { ReactNode } from "react";

/**
 * Used from app/[locale]/template.tsx — re-mounts on every navigation.
 * A very short CSS fade (250ms) that starts at first paint: it never waits for JavaScript,
 * so pages appear immediately.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
