import { jwtVerify } from "jose/jwt/verify";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_AUDIENCE, SESSION_COOKIE, SESSION_ISSUER } from "@/lib/session";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

  const jwtSecret = process.env.JWT;
  if (!jwtSecret || jwtSecret.length < 32) {
    console.error("Admin middleware unavailable: JWT is missing or too short");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (payload.role !== "admin") return NextResponse.redirect(new URL("/admin/login", request.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
