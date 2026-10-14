/**
 * Server-only authentication helpers for the host panel.
 * Password verification happens exclusively here (bcrypt hash stored in the database).
 */
import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { SESSION_COOKIE, verifySessionToken } from "./session";

const BCRYPT_ROUNDS = 12;

/** First password when HOST_INITIAL_PASSWORD is not set. Change it from the panel after the first login. */
export const DEFAULT_HOST_PASSWORD = "123456789";

export const hashPassword = (plain: string) => bcrypt.hash(plain, BCRYPT_ROUNDS);

/**
 * Returns the stored credential. On the very first run (empty table) it bootstraps the hash
 * from HOST_INITIAL_PASSWORD (default: "123456789") so the owner can log in without running the seed.
 * The owner should change it right away from /hostpage → Şifre.
 */
export async function getCredential() {
  const existing = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  const initial = process.env.HOST_INITIAL_PASSWORD || DEFAULT_HOST_PASSWORD;
  return prisma.adminCredential.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, passwordHash: await hashPassword(initial), tokenVersion: 1 },
  });
}

/** Constant-time bcrypt comparison. Returns the token version on success. */
export async function verifyPassword(plain: string): Promise<number | null> {
  const cred = await getCredential();
  if (!cred) {
    // Still spend time hashing to avoid leaking whether a password is configured
    await bcrypt.compare(plain, "$2a$12$abcdefghijklmnopqrstuuM8eQ8Vd0M3cFJ7r7xH0v1Vn1bV0o3K.");
    return null;
  }
  return (await bcrypt.compare(plain, cred.passwordHash)) ? cred.tokenVersion : null;
}

/** Full session check (signature + expiry + token version against DB). */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return false;
  try {
    const cred = await prisma.adminCredential.findUnique({ where: { id: 1 }, select: { tokenVersion: true } });
    return !!cred && cred.tokenVersion === session.v;
  } catch {
    return false;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

/** Throws if the request is not from a logged-in host. Use in every admin API route. */
export async function requireHost(): Promise<void> {
  if (!(await isAuthenticated())) throw new UnauthorizedError();
}
