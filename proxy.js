import { NextResponse } from "next/server";

import { getSession } from "./lib/get-session";

export async function proxy(request) {
  const session = await getSession();

  // Not logged in, expired session,
  // or account has been deactivated.
  if (!session) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const pathname = request.nextUrl.pathname;

  // Super Admin area
  if (
    pathname.startsWith("/superadmin") &&
    session.accountType !== "Super Admin"
  ) {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
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
