import { jwtVerify } from "jose/jwt/verify";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_DASHBOARD_PATH, ADMIN_LOGIN_PATH, SESSION_AUDIENCE, SESSION_COOKIE, SESSION_ISSUER } from "@/lib/session";

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoginPage = request.nextUrl.pathname === ADMIN_LOGIN_PATH;
  if (!token) return isLoginPage ? NextResponse.next() : redirectToLogin(request);

  const jwtSecret = process.env.JWT;
  if (!jwtSecret || jwtSecret.length < 32) {
    console.error("Admin middleware unavailable: JWT is missing or too short");
    return isLoginPage ? NextResponse.next() : redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (payload.role !== "admin") return redirectToLogin(request);
  } catch {
    return redirectToLogin(request);
  }

  return isLoginPage ? NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url)) : NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
