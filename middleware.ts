import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("auth")?.value;
  const isAuthenticated = auth === "true";
  const isLoginPage = request.nextUrl.pathname === "/";
  const isSchedulePage = request.nextUrl.pathname.startsWith("/schedule");

  if (!isAuthenticated && isSchedulePage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/schedule", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};