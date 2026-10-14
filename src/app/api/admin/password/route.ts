import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { adminRoute } from "@/lib/admin-route";
import { getCredential, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export const dynamic = "force-dynamic";

const schema = z.object({
  current: z.string().min(1),
  next: z.string().min(8, "Yeni şifre en az 8 karakter olmalı.").max(200),
});

/** Changes the host password. All other sessions are logged out (token version bump). */
export const POST = adminRoute(async (req: Request) => {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz veri." }, { status: 400 });

  const cred = await getCredential();
  if (!cred || !(await bcrypt.compare(parsed.data.current, cred.passwordHash))) {
    return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 400 });
  }
  const updated = await prisma.adminCredential.update({
    where: { id: 1 },
    data: { passwordHash: await hashPassword(parsed.data.next), tokenVersion: { increment: 1 } },
  });
  const res = NextResponse.json({ ok: true });
  // Keep the current browser logged in with a fresh token
  res.cookies.set(SESSION_COOKIE, await createSessionToken(updated.tokenVersion), sessionCookieOptions);
  return res;
});
