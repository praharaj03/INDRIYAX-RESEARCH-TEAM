import { NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  
  // Allow auth API routes without session check
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }
  
  // Already logged in → skip login page
  if (pathname === LOGIN_PATH) {
    const session = req.cookies.get("admin_session")?.value;
    if (session === "authenticated") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const session = req.cookies.get("admin_session")?.value;

  if (!session || session !== "authenticated") {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
