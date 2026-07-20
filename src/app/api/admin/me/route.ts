import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    logServerError("Admin session check failed", error);
    return NextResponse.json({ authenticated: false }, { status: 503 });
  }
}
