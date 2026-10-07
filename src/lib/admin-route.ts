import "server-only";
import { NextResponse } from "next/server";
import { requireHost, UnauthorizedError } from "./auth";

/** Wraps an admin API handler: full session check + uniform error responses */
export function adminRoute<A extends unknown[]>(handler: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      await requireHost();
      return await handler(...args);
    } catch (err) {
      if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Oturum süresi doldu. Lütfen tekrar giriş yapın." }, { status: 401 });
      console.error("[admin]", err);
      return NextResponse.json({ error: "Sunucu hatası: işlem tamamlanamadı." }, { status: 500 });
    }
  };
}
