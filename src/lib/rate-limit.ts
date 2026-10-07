/**
 * Database-backed rate limiting for the host login.
 * Stored in Postgres so limits hold across all serverless instances.
 * Policy: 5 failed attempts per 15 minutes → locked for 15 minutes.
 */
import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { prisma } from "./prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

export async function clientKey(scope: string): Promise<string> {
  const h = await headers();
  const ip = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  // Store only a hash of the IP address (privacy)
  return createHash("sha256").update(`${scope}:${ip}:${process.env.SESSION_SECRET ?? ""}`).digest("hex");
}

/** Returns seconds until unlocked, or 0 if the client may try. */
export async function checkLocked(key: string): Promise<number> {
  const row = await prisma.loginAttempt.findUnique({ where: { key } });
  if (row?.lockedUntil && row.lockedUntil > new Date()) {
    return Math.ceil((row.lockedUntil.getTime() - Date.now()) / 1000);
  }
  return 0;
}

/** Records a failed attempt; returns remaining attempts (0 = now locked). */
export async function registerFailure(key: string): Promise<number> {
  const now = new Date();
  const row = await prisma.loginAttempt.findUnique({ where: { key } });
  const windowExpired = !row || now.getTime() - row.windowStart.getTime() > WINDOW_MS;
  const count = windowExpired ? 1 : row.count + 1;
  const locked = count >= MAX_ATTEMPTS;
  await prisma.loginAttempt.upsert({
    where: { key },
    create: { key, count, windowStart: now, lockedUntil: locked ? new Date(now.getTime() + LOCK_MS) : null },
    update: {
      count: locked ? 0 : count,
      windowStart: windowExpired ? now : undefined,
      lockedUntil: locked ? new Date(now.getTime() + LOCK_MS) : null,
    },
  });
  return locked ? 0 : MAX_ATTEMPTS - count;
}

export async function clearFailures(key: string) {
  await prisma.loginAttempt.deleteMany({ where: { key } });
}

/** Simple generic limiter for public forms (contact, newsletter): N requests per window. */
export async function allowRequest(scope: string, max = 5, windowMs = 10 * 60 * 1000): Promise<boolean> {
  const key = await clientKey(scope);
  const now = new Date();
  const row = await prisma.loginAttempt.findUnique({ where: { key } });
  if (!row || now.getTime() - row.windowStart.getTime() > windowMs) {
    await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now, lockedUntil: null },
    });
    return true;
  }
  if (row.count >= max) return false;
  await prisma.loginAttempt.update({ where: { key }, data: { count: { increment: 1 } } });
  return true;
}
