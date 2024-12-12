import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from '@/lib/config/auth';

export function redirectToSchedule(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(AUTH_CONFIG.DEFAULT_REDIRECT, request.url)
    );
  }
  return NextResponse.next();
}