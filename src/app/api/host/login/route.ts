import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth";
import { checkLocked, clearFailures, clientKey, registerFailure } from "@/lib/rate-limit";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

const schema = z.object({ password: z.string().min(1).max(200) });

/** Server-side password check → sets an httpOnly session cookie */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });

  try {
    const key = await clientKey("host-login");
    const lockedFor = await checkLocked(key);
    if (lockedFor > 0) {
      return NextResponse.json(
        { error: `Çok fazla hatalı deneme. Lütfen ${Math.ceil(lockedFor / 60)} dakika sonra tekrar deneyin.`, retryAfter: lockedFor },
        { status: 429, headers: { "Retry-After": String(lockedFor) } },
      );
    }

    const version = await verifyPassword(parsed.data.password);
    if (version === null) {
      const remaining = await registerFailure(key);
      return NextResponse.json(
        { error: remaining > 0 ? `Şifre hatalı. Kalan deneme hakkı: ${remaining}` : "Çok fazla hatalı deneme. 15 dakika boyunca giriş engellendi.", remaining },
        { status: remaining > 0 ? 401 : 429 },
      );
    }

    await clearFailures(key);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, await createSessionToken(version), sessionCookieOptions);
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Sunucu hatası. Veritabanı ve ortam değişkenlerini kontrol edin." }, { status: 500 });
  }
}
