import { query } from "@/lib/db";
import type { CourseRecord, GalleryRecord, GroupRecord, PartnerRecord } from "@/lib/types";

const COURSE_SELECT = `SELECT c.id, c.title, c.description, c.image, c.price::text AS price,
  COALESCE(c.total_price, c.price)::text AS total_price,
  c.monthly_price::text AS monthly_price, c.duration, c.category, c.teacher_id,
  teacher.name AS teacher_name, teacher.image AS teacher_image, c.created_at
  FROM public.courses c
  LEFT JOIN public.groups teacher
    ON teacher.id = c.teacher_id AND teacher.member_type = 'teacher'`;

export async function listCourses(limit = 50) {
  const result = await query<CourseRecord>(
    `${COURSE_SELECT} ORDER BY c.created_at DESC, c.id DESC LIMIT $1`, [limit]
  );
  return result.rows;
}

export async function getCourse(id: string) {
  const result = await query<CourseRecord>(
    `${COURSE_SELECT} WHERE c.id = $1 LIMIT 1`, [id]
  );
  return result.rows[0] ?? null;
}

export async function listGallery(limit = 100) {
  const result = await query<GalleryRecord>(
    `SELECT id, title, description, image, category, created_at
     FROM public.gallery ORDER BY created_at DESC, id DESC LIMIT $1`, [limit]
  );
  return result.rows;
}

export async function getGalleryItem(id: string) {
  const result = await query<GalleryRecord>(
    `SELECT id, title, description, image, category, created_at
     FROM public.gallery WHERE id = $1 LIMIT 1`, [id]
  );
  return result.rows[0] ?? null;
}

export async function listGroups(limit = 30) {
  const result = await query<GroupRecord>(
    `SELECT id, name, description, image, member_type, sort_order, created_at
     FROM public.groups
     ORDER BY member_type ASC, sort_order ASC, id ASC LIMIT $1`, [limit]
  );
  return result.rows;
}

export async function getGroup(id: string) {
  const result = await query<GroupRecord>(
    `SELECT id, name, description, image, member_type, sort_order, created_at
     FROM public.groups WHERE id = $1 LIMIT 1`, [id]
  );
  return result.rows[0] ?? null;
}

export async function listTeachers() {
  const result = await query<Pick<GroupRecord, "id" | "name" | "image">>(
    `SELECT id, name, image FROM public.groups
     WHERE member_type = 'teacher'
     ORDER BY sort_order ASC, id ASC`
  );
  return result.rows;
}

export async function listPartners(limit = 50) {
  const result = await query<PartnerRecord>(
    `SELECT id, name, logo, color, created_at
     FROM public.partners ORDER BY created_at DESC, id DESC LIMIT $1`, [limit]
  );
  return result.rows;
}
