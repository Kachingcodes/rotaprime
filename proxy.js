import { NextResponse } from "next/server";
import { verifySession } from "./lib/session";

export async function proxy(request) {
  const token = request.cookies.get("session")?.value;

  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await verifySession(token);

  // Invalid or expired session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const pathname = request.nextUrl.pathname;

  // Super Admin area
  if (
    pathname.startsWith("/superadmin") &&
    session.accountType !== "Super Admin"
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/welfare/:path*",
    "/superadmin/:path*",
  ],
};