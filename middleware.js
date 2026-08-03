import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { hasAccess, PROTECTED_PAGES } from "@/lib/permissions";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const pageName = pathname.replace(/^\//, "").split("/")[0];

  if (!Object.prototype.hasOwnProperty.call(PROTECTED_PAGES, pageName)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-login";
    return NextResponse.redirect(url);
  }

  if (!hasAccess(session, pageName)) {
    const url = request.nextUrl.clone();
    url.pathname = "/no-permission";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-home",
    "/admin-dashboard",
    "/admin-clients",
    "/admin-companies",
    "/admin-users",
    "/attendance",
    "/attendance-report",
    "/e-invoice",
    "/admin-services",
    "/admin-blog",
    "/admin-faq",
  ],
};
