import EditCourseComponent from "../../components/EditCourseComponent";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCourse } from "@/lib/repositories/content";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await requireAdmin())) redirect("/admin/login");
  const courseDoc = await getCourse(id).catch(() => null);
  if (!courseDoc) notFound();
  return <EditCourseComponent course={{
    id: courseDoc.id, title: courseDoc.title, description: courseDoc.description,
    image: courseDoc.image, price: String(courseDoc.price ?? ""),
    duration: courseDoc.duration ?? "", category: courseDoc.category ?? "",
  }} />;
}
