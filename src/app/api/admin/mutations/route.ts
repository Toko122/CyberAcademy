import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deleteCloudinaryImage, uploadImage } from "@/lib/Cloudinary";
import {
  currentImage,
  isContentEntity,
  parseContentInput,
  removeContent,
  reorderGroups,
  saveContent,
  UUID_PATTERN,
  type ContentAction,
} from "@/lib/admin/content-mutations";
import { AppError, ValidationError, logServerError } from "@/lib/errors";
import type { MemberType } from "@/lib/types";

export const runtime = "nodejs";

const contentPaths = {
  courses: "/features/courses",
  gallery: "/features/gallery",
  groups: "/features/group",
  partners: "/features/partners",
} as const;

function revalidateContent(entity: keyof typeof contentPaths, id?: string) {
  revalidatePath(contentPaths[entity]);
  if (entity === "courses" && id) revalidatePath(`/features/courses/${id}`);
}

function errorResponse(error: unknown) {
  logServerError("Admin content mutation failed", error);
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message, code: error.code },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { success: false, message: "Unable to save the item. Please try again.", code: "CONTENT_SAVE_FAILED" },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ success: false, message: "Cross-site request rejected" }, { status: 403 });
    }
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 });

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await request.json() as Record<string, unknown>;
      const entity = String(body.entity ?? "");
      const action = String(body.action ?? "") as ContentAction;
      const id = String(body.id ?? "");
      if (entity === "groups" && action === "reorder") {
        const memberType = String(body.memberType ?? "") as MemberType;
        const orderedIds = Array.isArray(body.orderedIds)
          ? body.orderedIds.map((value) => String(value))
          : [];
        if (memberType !== "administration" && memberType !== "teacher") {
          throw new ValidationError("Invalid member type");
        }
        const data = await reorderGroups(memberType, orderedIds);
        revalidateContent("groups");
        return NextResponse.json({ success: true, data });
      }
      if (!isContentEntity(entity) || action !== "delete" || !UUID_PATTERN.test(id)) {
        throw new ValidationError("Invalid mutation payload");
      }

      const oldImage = await currentImage(entity, id);
      if (oldImage === null) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      const deleted = await removeContent(entity, id);
      if (!deleted.rows[0]) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      await deleteCloudinaryImage(oldImage);
      revalidateContent(entity, id);
      return NextResponse.json({ success: true, data: deleted.rows[0] });
    }

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ success: false, message: "Unsupported content type" }, { status: 415 });
    }

    const form = await request.formData();
    const entity = String(form.get("entity") ?? "");
    const action = String(form.get("action") ?? "") as ContentAction;
    const id = String(form.get("id") ?? "");
    if (!isContentEntity(entity) || (action !== "create" && action !== "update")) {
      throw new ValidationError("Invalid mutation payload");
    }
    if (action === "update" && !UUID_PATTERN.test(id)) throw new ValidationError("Invalid id");

    // Validate all text and numeric fields before performing a remote upload.
    const input = parseContentInput(form, entity);
    const oldImage = action === "update" ? await currentImage(entity, id) : null;
    if (action === "update" && oldImage === null) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    const file = form.get("file");
    let imageUrl = oldImage || String(form.get("existingImage") ?? "").trim();
    let uploadedUrl = "";

    // Avoid `instanceof File`: some supported server runtimes do not expose File globally.
    if (file !== null && typeof file !== "string" && file.size > 0) {
      uploadedUrl = await uploadImage(file);
      imageUrl = uploadedUrl;
    }
    if (!imageUrl) throw new ValidationError("An image is required");

    try {
      const result = await saveContent(input, action, id, imageUrl);
      if (!result.rows[0]) {
        if (uploadedUrl) await deleteCloudinaryImage(uploadedUrl);
        return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      }
      if (uploadedUrl && oldImage && oldImage !== uploadedUrl) await deleteCloudinaryImage(oldImage);
      revalidateContent(entity, result.rows[0].id);
      return NextResponse.json({ success: true, data: result.rows[0] });
    } catch (error) {
      if (uploadedUrl) await deleteCloudinaryImage(uploadedUrl);
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}
