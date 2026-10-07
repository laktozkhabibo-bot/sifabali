/**
 * 1) Protects the host panel: /hostpage/** and /api/admin/** require a valid session cookie.
 * 2) Locale routing: Turkish is served at the root ("/magaza"), English & Arabic under "/en", "/ar".
 *    Internally every storefront URL is rewritten to /[locale]/…
 */
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Host panel protection ───
  const isHostPage = pathname === "/hostpage" || pathname.startsWith("/hostpage/");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/hostpagepass";

  if (isHostPage || isAdminApi || isLoginPage) {
    const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    // The login page itself redirects already-authenticated hosts (full DB check there),
    // so a stale token (e.g. after a password change) can never cause a redirect loop.
    if (isLoginPage) return withNoIndex(NextResponse.next());
    if (!session) {
      if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const res = NextResponse.redirect(new URL("/hostpagepass", req.url));
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
    return withNoIndex(NextResponse.next());
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  // ─── Locale routing ───
  const first = pathname.split("/")[1];
  if (first === defaultLocale) {
    // "/tr/magaza" → "/magaza" (canonical Turkish URLs have no prefix)
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  // Skip Next internals, metadata routes and any file with an extension (images, fonts, svg…)
  matcher: ["/((?!_next/|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.[\\w]+$).*)"],
};
