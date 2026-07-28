import { query, withTransaction } from "@/lib/db";
import { ValidationError } from "@/lib/errors";
import type { MemberType } from "@/lib/types";

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const COURSE_CATEGORIES = new Set(["პროგრამირება", "დიზაინი", "მარკეტინგი", "IT სპეციალისტი"]);
const PARTNER_COLORS = new Set([
  "bg-cyan-500/10", "bg-blue-500/10", "bg-indigo-500/10", "bg-purple-500/10",
  "bg-emerald-500/10", "bg-amber-500/10", "bg-rose-500/10", "bg-white/5",
]);

export const CONTENT_ENTITIES = ["courses", "gallery", "groups", "partners"] as const;
export type ContentEntity = typeof CONTENT_ENTITIES[number];
export type ContentAction = "create" | "update" | "delete" | "reorder";

type CourseInput = {
  entity: "courses";
  title: string;
  description: string;
  totalPrice: number;
  monthlyPrice: number;
  duration: string;
  category: string;
  teacherId: string | null;
};
type GalleryInput = { entity: "gallery"; title: string; description: string; category: string };
type GroupInput = { entity: "groups"; name: string; description: string; memberType: MemberType };
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

function memberType(value: string): MemberType {
  if (value !== "administration" && value !== "teacher") {
    throw new ValidationError("memberType must be administration or teacher");
  }
  return value;
}

function optionalUuid(form: FormData, key: string) {
  const value = text(form, key, 36);
  if (!value) return null;
  if (!UUID_PATTERN.test(value)) throw new ValidationError(`${key} is invalid`);
  return value;
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
      teacherId: optionalUuid(form, "teacherId"),
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
      memberType: memberType(text(form, "memberType", 32, true)),
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
  if (entity === "groups") {
    return withTransaction(async (client) => {
      const deleted = await client.query<{ id: string; member_type: MemberType }>(
        "DELETE FROM public.groups WHERE id = $1 RETURNING id, member_type", [id]
      );
      if (deleted.rows[0]) {
        await normalizeGroupOrder(client, [deleted.rows[0].member_type]);
      }
      return deleted;
    });
  }
  const statements: Record<ContentEntity, string> = {
    courses: "DELETE FROM public.courses WHERE id = $1 RETURNING id",
    gallery: "DELETE FROM public.gallery WHERE id = $1 RETURNING id",
    groups: "DELETE FROM public.groups WHERE id = $1 RETURNING id",
    partners: "DELETE FROM public.partners WHERE id = $1 RETURNING id",
  };
  return query<{ id: string }>(statements[entity], [id]);
}

export async function saveContent(input: ContentInput, action: "create" | "update", id: string, imageUrl: string) {
  if (input.entity === "courses") {
    const values = [
      input.title, input.description, imageUrl, input.totalPrice, input.totalPrice,
      input.monthlyPrice, input.duration, input.category, input.teacherId,
    ];
    return withTransaction(async (client) => {
      if (input.teacherId) {
        const teacher = await client.query(
          "SELECT 1 FROM public.groups WHERE id = $1 AND member_type = 'teacher'", [input.teacherId]
        );
        if (!teacher.rows[0]) throw new ValidationError("Selected teacher is invalid");
      }
      return action === "create"
        ? client.query<{ id: string }>(`INSERT INTO public.courses
          (title, description, image, price, total_price, monthly_price, duration, category, teacher_id)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, values)
        : client.query<{ id: string }>(`UPDATE public.courses
          SET title=$1, description=$2, image=$3, price=$4, total_price=$5,
              monthly_price=$6, duration=$7, category=$8, teacher_id=$9
          WHERE id=$10 RETURNING id`, [...values, id]);
    });
  }

  if (input.entity === "gallery") {
    const values = [input.title, input.description, imageUrl, input.category];
    return action === "create"
      ? query<{ id: string }>("INSERT INTO public.gallery (title, description, image, category) VALUES ($1,$2,$3,$4) RETURNING id", values)
      : query<{ id: string }>("UPDATE public.gallery SET title=$1, description=$2, image=$3, category=$4 WHERE id=$5 RETURNING id", [...values, id]);
  }

  if (input.entity === "groups") {
    return withTransaction(async (client) => {
      if (action === "create") {
        return client.query<{ id: string }>(
          `INSERT INTO public.groups (name, description, image, member_type, sort_order)
           SELECT $1, $2, $3, $4, COALESCE(MAX(sort_order) + 1, 0)
           FROM public.groups WHERE member_type = $4 RETURNING id`,
          [input.name, input.description, imageUrl, input.memberType]
        );
      }
      const existing = await client.query<{ member_type: MemberType }>(
        "SELECT member_type FROM public.groups WHERE id = $1 FOR UPDATE", [id]
      );
      if (!existing.rows[0]) return client.query<{ id: string }>("SELECT NULL::uuid AS id WHERE false");
      const changedType = existing.rows[0].member_type !== input.memberType;
      const result = changedType
        ? await client.query<{ id: string }>(
            `UPDATE public.groups SET name=$1, description=$2, image=$3, member_type=$4,
             sort_order=(SELECT COALESCE(MAX(sort_order) + 1, 0) FROM public.groups WHERE member_type=$4)
             WHERE id=$5 RETURNING id`,
            [input.name, input.description, imageUrl, input.memberType, id]
          )
        : await client.query<{ id: string }>(
            "UPDATE public.groups SET name=$1, description=$2, image=$3 WHERE id=$4 RETURNING id",
            [input.name, input.description, imageUrl, id]
          );
      if (changedType) await normalizeGroupOrder(client, [existing.rows[0].member_type, input.memberType]);
      return result;
    });
  }

  const values = [input.name, imageUrl, input.color];
  return action === "create"
    ? query<{ id: string }>("INSERT INTO public.partners (name, logo, color) VALUES ($1,$2,$3) RETURNING id", values)
    : query<{ id: string }>("UPDATE public.partners SET name=$1, logo=$2, color=$3 WHERE id=$4 RETURNING id", [...values, id]);
}

type TransactionClient = Parameters<Parameters<typeof withTransaction>[0]>[0];

async function normalizeGroupOrder(client: TransactionClient, types: MemberType[]) {
  const uniqueTypes = [...new Set(types)];
  await client.query("SET CONSTRAINTS groups_member_type_sort_order_key DEFERRED");
  await client.query(
    `WITH ordered AS (
       SELECT id, row_number() OVER (PARTITION BY member_type ORDER BY sort_order, id) - 1 AS next_order
       FROM public.groups WHERE member_type = ANY($1::text[])
     )
     UPDATE public.groups AS member SET sort_order = ordered.next_order
     FROM ordered WHERE member.id = ordered.id`,
    [uniqueTypes]
  );
}

export async function reorderGroups(memberTypeValue: MemberType, orderedIds: string[]) {
  if (!orderedIds.length || orderedIds.some((id) => !UUID_PATTERN.test(id))) {
    throw new ValidationError("Invalid reorder payload");
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    throw new ValidationError("Duplicate member ids are not allowed");
  }
  return withTransaction(async (client) => {
    await client.query("SET CONSTRAINTS groups_member_type_sort_order_key DEFERRED");
    const current = await client.query<{ id: string }>(
      `SELECT id FROM public.groups WHERE member_type = $1 ORDER BY sort_order, id FOR UPDATE`,
      [memberTypeValue]
    );
    const currentIds = current.rows.map((row) => row.id);
    if (currentIds.length !== orderedIds.length || currentIds.some((id) => !orderedIds.includes(id))) {
      throw new ValidationError("Reorder list must contain every member in the selected group");
    }
    await client.query(
      `UPDATE public.groups AS member
       SET sort_order = ordering.sort_order - 1
       FROM unnest($1::uuid[]) WITH ORDINALITY AS ordering(id, sort_order)
       WHERE member.id = ordering.id AND member.member_type = $2`,
      [orderedIds, memberTypeValue]
    );
    return { memberType: memberTypeValue, orderedIds };
  });
}
