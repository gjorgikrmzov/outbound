// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC = ["/sign-in", "/unauthorized", "/api/auth", "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // TEMP: prove middleware executes for "/"
  if (pathname === "/") {
    const u = req.nextUrl.clone();
    u.pathname = "/sign-in";
    return NextResponse.redirect(u);
  }

  // Allow public + static
  if (
    PUBLIC.some((p) => pathname === p || pathname.startsWith(p)) ||
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|map|txt|woff2?)$/.test(pathname)
  ) {
    const res = NextResponse.next();
    res.headers.set("x-aa-mw", "public");
    return res;
  }

  // Check auth (token + cookie fallback)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const hasCookie =
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token");

  const authed = Boolean(token || hasCookie);

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("x-aa-mw", "protected");
  res.headers.set("x-aa-token", token ? "1" : "0");
  res.headers.set("x-aa-cookie", hasCookie ? "1" : "0");
  return res;
}

export const config = { matcher: ["/:path*"] };
