import { NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  if (pathname === LOGIN_PATH) return NextResponse.next();

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
