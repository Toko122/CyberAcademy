import { query } from "@/lib/db";
import { ValidationError } from "@/lib/errors";

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const COURSE_CATEGORIES = new Set(["პროგრამირება", "დიზაინი", "მარკეტინგი", "IT სპეციალისტი"]);
const PARTNER_COLORS = new Set([
  "bg-cyan-500/10", "bg-blue-500/10", "bg-indigo-500/10", "bg-purple-500/10",
  "bg-emerald-500/10", "bg-amber-500/10", "bg-rose-500/10", "bg-white/5",
]);

export const CONTENT_ENTITIES = ["courses", "gallery", "groups", "partners"] as const;
export type ContentEntity = typeof CONTENT_ENTITIES[number];
export type ContentAction = "create" | "update" | "delete";

type CourseInput = {
  entity: "courses";
  title: string;
  description: string;
  totalPrice: number;
  monthlyPrice: number;
  duration: string;
  category: string;
};
type GalleryInput = { entity: "gallery"; title: string; description: string; category: string };
type GroupInput = { entity: "groups"; name: string; description: string; position: string };
type PartnerInput = { entity: "partners"; name: string; color: string };
export type ContentInput = CourseInput | GalleryInput | GroupInput | PartnerInput;

export function isContentEntity(value: string): value is ContentEntity {
  return CONTENT_ENTITIES.some((entity) => entity === value);
}

function text(form: FormData, key: string, max: number, required = false) {
  const value = String(form.get(key) ?? "").trim();
  if (required && !value) throw new ValidationError(`${key} is required`);
  if (value.length > max) throw new ValidationError(`${key} is too long`);
  return value;
}

function price(form: FormData, key: string, label: string) {
  const value = text(form, key, 32, true).replace(",", ".");
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(value)) {
    throw new ValidationError(`${label} უნდა იყოს არაუარყოფითი რიცხვი, მაქსიმუმ 2 ათწილადი ნიშნით`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 9_999_999_999.99) {
    throw new ValidationError(`${label} არასწორია`);
  }
  return parsed;
}

export function parseContentInput(form: FormData, entity: ContentEntity): ContentInput {
  if (entity === "courses") {
    const category = text(form, "category", 100, true);
    if (!COURSE_CATEGORIES.has(category)) throw new ValidationError("კურსის კატეგორია არასწორია");
    return {
      entity,
      title: text(form, "title", 200, true),
      description: text(form, "description", 10_000),
      totalPrice: price(form, "totalPrice", "მთლიანი ღირებულება"),
      monthlyPrice: price(form, "monthlyPrice", "თვიური ღირებულება"),
      duration: text(form, "duration", 100, true),
      category,
    };
  }

  if (entity === "gallery") {
    return {
      entity,
      title: text(form, "title", 200, true),
      description: text(form, "description", 10_000),
      category: text(form, "category", 100),
    };
  }

  if (entity === "groups") {
    return {
      entity,
      name: text(form, "name", 200, true),
      description: text(form, "description", 10_000),
      position: text(form, "position", 200, true),
    };
  }

  const color = text(form, "color", 64, true);
  if (!PARTNER_COLORS.has(color)) throw new ValidationError("color is invalid");
  return { entity, name: text(form, "name", 200, true), color };
}

export async function currentImage(entity: ContentEntity, id: string): Promise<string | null> {
  const statements: Record<ContentEntity, string> = {
    courses: "SELECT image FROM public.courses WHERE id = $1",
    gallery: "SELECT image FROM public.gallery WHERE id = $1",
    groups: "SELECT image FROM public.groups WHERE id = $1",
    partners: "SELECT logo AS image FROM public.partners WHERE id = $1",
  };
  const result = await query<{ image: string }>(statements[entity], [id]);
  return result.rows[0]?.image ?? null;
}

export async function removeContent(entity: ContentEntity, id: string) {
  const statements: Record<ContentEntity, string> = {
    courses: "DELETE FROM public.courses WHERE id = $1 RETURNING id",
    gallery: "DELETE FROM public.gallery WHERE id = $1 RETURNING id",
    groups: "DELETE FROM public.groups WHERE id = $1 RETURNING id",
    partners: "DELETE FROM public.partners WHERE id = $1 RETURNING id",
  };
  return query<{ id: string }>(statements[entity], [id]);
}

export async function saveContent(input: ContentInput, action: Exclude<ContentAction, "delete">, id: string, imageUrl: string) {
  if (input.entity === "courses") {
    const values = [
      input.title, input.description, imageUrl, input.totalPrice, input.totalPrice,
      input.monthlyPrice, input.duration, input.category,
    ];
    return action === "create"
      ? query<{ id: string }>(`INSERT INTO public.courses
          (title, description, image, price, total_price, monthly_price, duration, category)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`, values)
      : query<{ id: string }>(`UPDATE public.courses
          SET title=$1, description=$2, image=$3, price=$4, total_price=$5,
              monthly_price=$6, duration=$7, category=$8
          WHERE id=$9 RETURNING id`, [...values, id]);
  }

  if (input.entity === "gallery") {
    const values = [input.title, input.description, imageUrl, input.category];
    return action === "create"
      ? query<{ id: string }>("INSERT INTO public.gallery (title, description, image, category) VALUES ($1,$2,$3,$4) RETURNING id", values)
      : query<{ id: string }>("UPDATE public.gallery SET title=$1, description=$2, image=$3, category=$4 WHERE id=$5 RETURNING id", [...values, id]);
  }

  if (input.entity === "groups") {
    const values = [input.name, input.description, imageUrl, input.position];
    return action === "create"
      ? query<{ id: string }>("INSERT INTO public.groups (name, description, image, position) VALUES ($1,$2,$3,$4) RETURNING id", values)
      : query<{ id: string }>("UPDATE public.groups SET name=$1, description=$2, image=$3, position=$4 WHERE id=$5 RETURNING id", [...values, id]);
  }

  const values = [input.name, imageUrl, input.color];
  return action === "create"
    ? query<{ id: string }>("INSERT INTO public.partners (name, logo, color) VALUES ($1,$2,$3) RETURNING id", values)
    : query<{ id: string }>("UPDATE public.partners SET name=$1, logo=$2, color=$3 WHERE id=$4 RETURNING id", [...values, id]);
}
