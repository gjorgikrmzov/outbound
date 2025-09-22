// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC = ["/sign-in", "/unauthorized", "/api/auth", "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public + static
  if (
    PUBLIC.some((p) => pathname === p || pathname.startsWith(p)) ||
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|map|txt|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If not authed → send to sign-in with callbackUrl
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
