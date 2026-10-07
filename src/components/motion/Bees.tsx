"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small swarm of photoreal bees crossing the hero. Each pass goes one way only
 * (left→right or right→left, chosen at random) — no stopping, hovering or turning back —
 * with smooth steering, natural sideways wander and bobbing. Every bee has its own
 * size (depth), speed, height and personality, re-rolled on each new pass.
 * The body pitches with climb/descent; the wings flutter
 * by swapping two motion-blurred render frames. Direct DOM updates (no React re-renders),
 * paused when off-screen or the tab is hidden, disabled with reduced motion.
 */

const BEE_W = 64; // px at scale 1

type Mode = "fly";
interface BeeState {
  x: number; y: number; vx: number; vy: number;
  tx: number; ty: number;
  mode: Mode; timer: number;
  face: 1 | -1; angle: number;
  scale: number; speed: number;
  seed: number; t: number;
  /** flight direction for the current pass: 1 = left→right, -1 = right→left */
  dir: 1 | -1;
  /** how much this bee drifts sideways / bobs (personality) */
  wander: number; bob: number;
}

/** number of bees on screen (desktop) */
const COUNT = 7;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
/** smooth pseudo-noise from a few incommensurate sines (cheap Perlin substitute) */
const noise = (t: number, s: number) => Math.sin(t * 1.7 + s) * 0.5 + Math.sin(t * 3.1 + s * 2.3) * 0.3 + Math.sin(t * 7.3 + s * 5.1) * 0.2;

export function Bees({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const beeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(!reduce && wide);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    if (!box) return;

    let W = box.clientWidth;
    let H = box.clientHeight;
    // flight lane: below the honey drips; a bee never stops or turns back during a pass
    const yMin = () => H * 0.4;
    const yMax = () => H * 0.9;
    const nextWaypoint = (b: BeeState) => {
      b.tx = b.x + b.dir * rand(200, 380);
      b.ty = Math.min(yMax(), Math.max(yMin(), b.y + rand(-110, 110)));
    };
    /** start a new pass from a random side, at a random height, with a fresh personality */
    const respawn = (b: BeeState, delayPx = 0) => {
      b.dir = Math.random() < 0.5 ? 1 : -1;
      const depth = Math.random(); // 0 = far, 1 = near
      b.scale = 0.42 + depth * 0.6;
      b.speed = (70 + depth * 110) * rand(0.85, 1.2);
      b.wander = rand(140, 320);
      b.bob = rand(30, 80);
      b.x = b.dir === 1 ? -90 - delayPx : W + 90 + delayPx;
      b.y = rand(yMin(), yMax());
      b.vx = b.dir * b.speed * 0.8; b.vy = 0; b.angle = 0; b.face = b.dir;
      nextWaypoint(b);
    };

    const bees: BeeState[] = Array.from({ length: COUNT }, (_, i) => {
      const b: BeeState = {
        x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, mode: "fly", timer: 0, face: 1, angle: 0,
        scale: 1, speed: 120, seed: rand(0, 100), t: rand(0, 10), dir: 1, wander: 200, bob: 50,
      };
      respawn(b, i === 0 ? 0 : rand(100, 1400)); // staggered entries
      if (i < 3) b.x = rand(80, W - 80);           // a few already on screen at load
      return b;
    });

    let raf = 0;
    let last = performance.now();
    let visible = true;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      bees.forEach((b, i) => {
        b.t += dt;
        // steer toward the next waypoint ahead in this pass's direction
        if ((b.tx - b.x) * b.dir < 60) nextWaypoint(b);
        const dx = b.tx - b.x, dy = b.ty - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        let ax = ((dx / dist) * b.speed - b.vx) * 2.4;
        let ay = ((dy / dist) * b.speed - b.vy) * 2.4;
        // natural wander perpendicular to the heading + bobbing (different for every bee)
        const n = noise(b.t * 1.3, b.seed) * b.wander;
        ax += (-dy / dist) * n;
        ay += (dx / dist) * n + Math.sin(b.t * 11 + b.seed) * b.bob;

        b.vx += ax * dt; b.vy += ay * dt;
        // never fly backwards during a pass
        if (b.dir === 1) b.vx = Math.max(b.vx, b.speed * 0.45);
        else b.vx = Math.min(b.vx, -b.speed * 0.45);
        b.x += b.vx * dt; b.y += b.vy * dt;

        // stay inside the lane (soft walls)
        if (b.y < yMin()) b.vy += (yMin() - b.y) * 6 * dt;
        if (b.y > yMax()) b.vy -= (b.y - yMax()) * 6 * dt;

        // left the screen → a new pass (random side, height, size, speed)
        // (only the side it is flying toward counts — bees waiting off-screen to enter are fine)
        if ((b.dir === 1 && b.x > W + 100) || (b.dir === -1 && b.x < -100)) respawn(b, rand(60, 700));

        b.face = b.dir;
        const pitch = Math.atan2(b.vy, Math.abs(b.vx) + 60) * (180 / Math.PI);
        const target = Math.max(-28, Math.min(28, pitch));
        b.angle += (target - b.angle) * Math.min(1, dt * 8);

        const el = beeRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${b.x - (BEE_W * b.scale) / 2}px, ${b.y - (BEE_W * b.scale) / 2}px, 0) rotate(${b.angle * b.face}deg) scale(${b.face * b.scale}, ${b.scale})`;
          // distant (small) bees are slightly softer and lighter → depth
          el.style.opacity = String(0.7 + 0.3 * Math.min(1, (b.scale - 0.42) / 0.6));
          el.style.filter = b.scale < 0.6 ? "blur(0.6px)" : "";
        }
      });

      if (visible && !document.hidden) raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(box);
    const onVis = () => { if (!document.hidden && visible) start(); };
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => { W = box.clientWidth; H = box.clientHeight; };
    window.addEventListener("resize", onResize);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={boxRef} aria-hidden className={className ?? "pointer-events-none absolute inset-0"}>
      {Array.from({ length: COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { beeRefs.current[i] = el; }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: BEE_W, transform: "translate3d(-200px,-200px,0)" }}
        >
          {/* two wing-beat frames swapped ~22×/s → realistic flutter */}
          <div className="relative drop-shadow-[0_6px_6px_rgba(60,35,10,.18)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative sprite, animated via transforms */}
            <img src="/images/bee.webp" alt="" width={BEE_W} height={Math.round((BEE_W * 195) / 240)} className="block" draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/bee-2.webp" alt="" width={BEE_W} height={Math.round((BEE_W * 195) / 240)} className="bee-flutter absolute inset-0 block" style={{ animationDelay: `${-(i * 0.013).toFixed(3)}s`, animationDuration: `${(0.08 + (i % 3) * 0.008).toFixed(3)}s` }} draggable={false} />
          </div>
        </div>
      ))}
    </div>
  );
}
