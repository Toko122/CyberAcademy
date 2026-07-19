import { NextResponse } from "next/server";
import { getCourse } from "@/lib/repositories/content";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!UUID_PATTERN.test(params.id)) return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
  const course = await getCourse(params.id);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}
