import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { deleteCloudinaryImage } from "@/lib/Cloudinary";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: "Invalid group member id" }, { status: 400 });
  const result = await query<{ id: string; image: string }>(
    "DELETE FROM public.groups WHERE id = $1 RETURNING id, image", [id]
  );
  const deleted = result.rows[0];
  if (!deleted) return NextResponse.json({ error: "Group member not found" }, { status: 404 });
  await deleteCloudinaryImage(deleted.image);
  return NextResponse.json({ success: true, id: deleted.id });
}
