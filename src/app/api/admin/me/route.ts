import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 503 });
  }
}
