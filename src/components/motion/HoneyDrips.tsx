"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Realistic honey dripping from the top edge.
 * Technique: an SVG "goo" filter (blur + alpha threshold) merges the static top layer
 * with slowly stretching drops, so they look like viscous liquid peeling off.
 * Everything runs with SMIL/CSS on the compositor — no per-frame JavaScript.
 */
const DRIPS = [
  { x: 6, len: 120, dur: 7.5, delay: 0, r: 13 },
  { x: 15, len: 70, dur: 9, delay: 2.2, r: 10 },
  { x: 24, len: 170, dur: 11, delay: 4.1, r: 16 },
  { x: 37, len: 95, dur: 8.2, delay: 1.1, r: 12 },
  { x: 48, len: 140, dur: 10, delay: 5.4, r: 14 },
  { x: 58, len: 60, dur: 7, delay: 3.2, r: 9 },
  { x: 67, len: 190, dur: 12, delay: 0.6, r: 17 },
  { x: 78, len: 110, dur: 9.5, delay: 6.3, r: 12 },
  { x: 88, len: 150, dur: 10.5, delay: 2.8, r: 15 },
  { x: 96, len: 80, dur: 8, delay: 4.8, r: 11 },
];

export function HoneyDrips({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg aria-hidden className={className ?? "pointer-events-none absolute inset-x-0 top-0 h-[340px] w-full"} viewBox="0 0 1000 340" preserveAspectRatio="none">
      <defs>
        <filter id="goo" x="-10%" y="-10%" width="120%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <linearGradient id="drip-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C27612" />
          <stop offset=".35" stopColor="#E0961A" />
          <stop offset="1" stopColor="#F6C453" />
        </linearGradient>
        <linearGradient id="drip-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g filter="url(#goo)" fill="url(#drip-g)">
        {/* The honey "ceiling" with an organic lower edge */}
        <path d="M0 0 H1000 V26 C 940 40, 900 22, 850 34 S 760 52, 700 30 S 600 44, 540 32 S 430 54, 370 30 S 260 44, 200 34 S 90 50, 0 30 Z" />
        {DRIPS.map((d, i) => {
          const cx = d.x * 10;
          return (
            <g key={i}>
              {/* stretching neck */}
              <rect x={cx - d.r * 0.45} y="20" width={d.r * 0.9} height={reduce ? d.len * 0.5 : 10} rx={d.r * 0.45}>
                {!reduce && (
                  <animate
                    attributeName="height"
                    values={`10;${d.len};${d.len * 0.35};10`}
                    keyTimes="0;0.62;0.7;1"
                    dur={`${d.dur}s`}
                    begin={`${-d.delay}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.45 0 0.55 1; 0.2 0 0.2 1; 0.4 0 0.2 1"
                  />
                )}
              </rect>
              {/* bulb at the tip that eventually falls */}
              <circle cx={cx} cy={reduce ? 20 + d.len * 0.5 : 30} r={d.r}>
                {!reduce && (
                  <>
                    <animate
                      attributeName="cy"
                      values={`30;${20 + d.len};${20 + d.len + 260};30`}
                      keyTimes="0;0.62;0.8;1"
                      dur={`${d.dur}s`}
                      begin={`${-d.delay}s`}
                      repeatCount="indefinite"
                      calcMode="spline"
                      keySplines="0.45 0 0.55 1; 0.55 0 1 0.45; 0 0 1 1"
                    />
                    <animate
                      attributeName="r"
                      values={`${d.r * 0.6};${d.r};${d.r * 0.85};${d.r * 0.6}`}
                      keyTimes="0;0.62;0.8;1"
                      dur={`${d.dur}s`}
                      begin={`${-d.delay}s`}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>
            </g>
          );
        })}
      </g>
      {/* soft highlight across the honey surface */}
      <path d="M0 6 H1000 V12 H0 Z" fill="url(#drip-shine)" opacity=".6" />
    </svg>
  );
}
