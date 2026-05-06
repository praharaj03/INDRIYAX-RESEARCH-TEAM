import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("admin_session")?.value === "authenticated";

  // Already logged in → skip the login page, go straight to dashboard
  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Not logged in → redirect to login, preserving the intended destination
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
