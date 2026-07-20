import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { deleteCloudinaryImage, uploadImage } from "@/lib/Cloudinary";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const COURSE_CATEGORIES = new Set(["პროგრამირება", "დიზაინი", "მარკეტინგი", "IT სპეციალისტი"]);
const PARTNER_COLORS = new Set([
  "bg-cyan-500/10", "bg-blue-500/10", "bg-indigo-500/10", "bg-purple-500/10",
  "bg-emerald-500/10", "bg-amber-500/10", "bg-rose-500/10", "bg-white/5",
]);

type Entity = "courses" | "gallery" | "groups" | "partners";
type Action = "create" | "update" | "delete";

function text(form: FormData, key: string, max: number, required = false) {
  const value = String(form.get(key) ?? "").trim();
  if ((required && !value) || value.length > max) throw new Error(`Invalid ${key}`);
  return value;
}

async function currentImage(entity: Entity, id: string): Promise<string> {
  const statements: Record<Entity, string> = {
    courses: "SELECT image FROM public.courses WHERE id = $1",
    gallery: "SELECT image FROM public.gallery WHERE id = $1",
    groups: "SELECT image FROM public.groups WHERE id = $1",
    partners: "SELECT logo AS image FROM public.partners WHERE id = $1",
  };
  const result = await query<{ image: string }>(statements[entity], [id]);
  return result.rows[0]?.image ?? "";
}

async function removeEntity(entity: Entity, id: string) {
  const statements: Record<Entity, string> = {
    courses: "DELETE FROM public.courses WHERE id = $1 RETURNING id",
    gallery: "DELETE FROM public.gallery WHERE id = $1 RETURNING id",
    groups: "DELETE FROM public.groups WHERE id = $1 RETURNING id",
    partners: "DELETE FROM public.partners WHERE id = $1 RETURNING id",
  };
  return query<{ id: string }>(statements[entity], [id]);
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ success: false, message: "Authorization required" }, { status: 401 });

    const contentType = request.headers.get("content-type") ?? "";
    let entity: Entity;
    let action: Action;
    let id = "";

    if (contentType.includes("application/json")) {
      const body = await request.json() as Record<string, unknown>;
      entity = String(body.entity) as Entity;
      action = String(body.action) as Action;
      id = String(body.id ?? "");
      if (!["courses", "gallery", "groups", "partners"].includes(entity) || action !== "delete" || !UUID_PATTERN.test(id)) {
        return NextResponse.json({ success: false, message: "Invalid mutation payload" }, { status: 400 });
      }
      const oldImage = await currentImage(entity, id);
      const deleted = await removeEntity(entity, id);
      if (!deleted.rows[0]) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      await deleteCloudinaryImage(oldImage);
      return NextResponse.json({ success: true, data: deleted.rows[0] });
    }

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ success: false, message: "Unsupported content type" }, { status: 415 });
    }
    const form = await request.formData();
    entity = String(form.get("entity") ?? "") as Entity;
    action = String(form.get("action") ?? "") as Action;
    id = String(form.get("id") ?? "");
    if (!["courses", "gallery", "groups", "partners"].includes(entity) || !["create", "update"].includes(action)) {
      return NextResponse.json({ success: false, message: "Invalid mutation payload" }, { status: 400 });
    }
    if (action === "update" && !UUID_PATTERN.test(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const file = form.get("file");
    const oldImage = action === "update" ? await currentImage(entity, id) : "";
    let imageUrl = oldImage || text(form, "existingImage", 2048);
    let uploadedUrl = "";
    // Server runtimes do not always expose `File` as a global constructor.
    // FormData already guarantees that a non-string entry is file-like.
    if (file !== null && typeof file !== "string" && file.size > 0) {
      uploadedUrl = await uploadImage(file);
      imageUrl = uploadedUrl;
    }

    try {
      let result;
      if (entity === "courses") {
        const title = text(form, "title", 200, true);
        const description = text(form, "description", 10_000);
        const priceText = text(form, "price", 32, true).replace(/[^0-9.,-]/g, "").replace(",", ".");
        const price = Number(priceText);
        const duration = text(form, "duration", 100, true);
        const category = text(form, "category", 100, true);
        if (!Number.isFinite(price) || price < 0 || !COURSE_CATEGORIES.has(category)) throw new Error("Invalid course values");
        result = action === "create"
          ? await query(`INSERT INTO public.courses (title, description, image, price, duration, category)
                         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`, [title, description, imageUrl, price, duration, category])
          : await query(`UPDATE public.courses SET title=$1, description=$2, image=$3, price=$4, duration=$5, category=$6
                         WHERE id=$7 RETURNING id`, [title, description, imageUrl, price, duration, category, id]);
      } else if (entity === "gallery") {
        const title = text(form, "title", 200, true);
        const description = text(form, "description", 10_000);
        const category = text(form, "category", 100);
        result = action === "create"
          ? await query(`INSERT INTO public.gallery (title, description, image, category) VALUES ($1,$2,$3,$4) RETURNING id`, [title, description, imageUrl, category])
          : await query(`UPDATE public.gallery SET title=$1, description=$2, image=$3, category=$4 WHERE id=$5 RETURNING id`, [title, description, imageUrl, category, id]);
      } else if (entity === "groups") {
        const name = text(form, "name", 200, true);
        const description = text(form, "description", 10_000);
        const position = text(form, "position", 200, true);
        result = action === "create"
          ? await query(`INSERT INTO public.groups (name, description, image, position) VALUES ($1,$2,$3,$4) RETURNING id`, [name, description, imageUrl, position])
          : await query(`UPDATE public.groups SET name=$1, description=$2, image=$3, position=$4 WHERE id=$5 RETURNING id`, [name, description, imageUrl, position, id]);
      } else {
        const name = text(form, "name", 200, true);
        const color = text(form, "color", 64, true);
        if (!PARTNER_COLORS.has(color)) throw new Error("Invalid partner color");
        result = action === "create"
          ? await query(`INSERT INTO public.partners (name, logo, color) VALUES ($1,$2,$3) RETURNING id`, [name, imageUrl, color])
          : await query(`UPDATE public.partners SET name=$1, logo=$2, color=$3 WHERE id=$4 RETURNING id`, [name, imageUrl, color, id]);
      }
      if (!result.rows[0]) {
        if (uploadedUrl) await deleteCloudinaryImage(uploadedUrl);
        return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      }
      if (uploadedUrl && oldImage && oldImage !== uploadedUrl) await deleteCloudinaryImage(oldImage);
      return NextResponse.json({ success: true, data: result.rows[0] });
    } catch (error) {
      if (uploadedUrl) await deleteCloudinaryImage(uploadedUrl);
      throw error;
    }
  } catch (error) {
    console.error("Admin mutation failed", error);

    const errorMessage = error instanceof Error ? error.message : "";
    const isValidationError = errorMessage.startsWith("Invalid")
      || errorMessage === "Unsupported image type"
      || errorMessage === "Image must be between 1 byte and 5 MB";
    const isCloudinaryConfigError = errorMessage.startsWith("CLOUDY_");
    const message = isValidationError
      ? errorMessage
      : isCloudinaryConfigError
        ? "Image storage is not configured"
        : "Unable to upload or save the item";

    return NextResponse.json(
      { success: false, message },
      { status: isValidationError ? 400 : isCloudinaryConfigError ? 503 : 500 },
    );
  }
}
