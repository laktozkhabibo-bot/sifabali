/**
 * Host-panel session tokens (JWT, HS256) — Edge-compatible so the middleware can verify them.
 * The token is only ever stored in an httpOnly + secure + sameSite=strict cookie.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sb_host_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or shorter than 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  role: "host";
  /** Must match AdminCredential.tokenVersion — bumping it logs out every session */
  v: number;
}

export async function createSessionToken(version: number): Promise<string> {
  return new SignJWT({ role: "host", v: version } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setSubject("host")
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (payload.role !== "host" || typeof payload.v !== "number") return null;
    return { role: "host", v: payload.v };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
