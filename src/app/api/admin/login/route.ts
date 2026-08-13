import { NextResponse } from "next/server";
import { authenticateAdmin, createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { ADMIN_DASHBOARD_PATH } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const email = typeof input.email === "string" ? input.email : "";
    const password = typeof input.password === "string" ? input.password : "";
    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }
    const user = await authenticateAdmin(email, password);
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }
    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true, redirectTo: ADMIN_DASHBOARD_PATH });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: serverEnv.isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const details = error instanceof Error
      ? { name: error.name, code: "code" in error ? String(error.code) : undefined }
      : { name: "UnknownError" };
    console.error("Admin login unavailable", details);
    return NextResponse.json({ success: false, message: "Authentication unavailable" }, { status: 500 });
  }
}
