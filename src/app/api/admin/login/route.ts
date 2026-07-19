import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authenticateAdmin, createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { serverEnv } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const email = typeof input.email === "string" ? input.email : "";
    const password = typeof input.password === "string" ? input.password : "";
    const user = await authenticateAdmin(email, password);
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }
    const token = await createSessionToken(user);
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: serverEnv.isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return NextResponse.json({ success: true, user: { id: user.id, role: user.role } });
  } catch (error) {
    const details = error instanceof Error
      ? { name: error.name, code: "code" in error ? String(error.code) : undefined }
      : { name: "UnknownError" };
    console.error("Admin login unavailable", details);
    return NextResponse.json({ success: false, message: "Authentication unavailable" }, { status: 500 });
  }
}
