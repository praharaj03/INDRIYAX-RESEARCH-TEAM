import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;

  // Already on login page
  if (pathname === LOGIN_PATH) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "fallback");
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } catch {
        // invalid/expired token — show login
      }
    }
    return NextResponse.next();
  }

  // Protect all other /admin/* routes
  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "fallback");
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set("from", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("admin_session");
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
