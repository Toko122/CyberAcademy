import EditCourseComponent from "../../components/EditCourseComponent";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCourse, listTeachers } from "@/lib/repositories/content";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await requireAdmin())) redirect("/admin/login");
  const [courseDoc, teachers] = await Promise.all([getCourse(id), listTeachers()]);
  if (!courseDoc) notFound();
  return <EditCourseComponent teachers={teachers} course={{
    id: courseDoc.id, title: courseDoc.title, description: courseDoc.description,
    image: courseDoc.image,
    totalPrice: String(courseDoc.total_price ?? courseDoc.price ?? ""),
    monthlyPrice: String(courseDoc.monthly_price ?? ""),
    duration: courseDoc.duration ?? "", category: courseDoc.category ?? "",
    teacherId: courseDoc.teacher_id ?? "",
  }} />;
}
