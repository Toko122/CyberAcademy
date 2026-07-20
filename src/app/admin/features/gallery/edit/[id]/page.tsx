import EditGalleryComponent from "../../components/EditGalleryComponent";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getGalleryItem } from "@/lib/repositories/content";

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await requireAdmin())) redirect("/admin/login");
  const image = await getGalleryItem(id).catch(() => null);
  if (!image) notFound();
  return <EditGalleryComponent image={{
    id: image.id, title: image.title, description: image.description ?? "",
    image: image.image, category: image.category ?? "ზოგადი",
  }} />;
}
