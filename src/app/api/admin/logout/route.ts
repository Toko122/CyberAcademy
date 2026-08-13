import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { ADMIN_LOGIN_PATH } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, redirectTo: ADMIN_LOGIN_PATH });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: serverEnv.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
