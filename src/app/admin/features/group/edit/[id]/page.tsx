import EditGroupComponent from "../../components/EditGroupComponent";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getGroup } from "@/lib/repositories/content";

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await requireAdmin())) redirect("/admin/login");
  const member = await getGroup(id).catch(() => null);
  if (!member) notFound();
  return <EditGroupComponent member={{
    id: member.id, name: member.name, description: member.description ?? "",
    image: member.image, position: member.position ?? "",
  }} />;
}
