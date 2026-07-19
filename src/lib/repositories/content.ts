import { query } from "@/lib/db";
import type { CourseRecord, GalleryRecord, GroupRecord, PartnerRecord } from "@/lib/types";

export async function listCourses(limit = 50) {
  const result = await query<CourseRecord>(
    `SELECT id, title, description, image, price::text AS price, duration, category, created_at
     FROM public.courses ORDER BY created_at DESC LIMIT $1`, [limit]
  );
  return result.rows;
}

export async function getCourse(id: string) {
  const result = await query<CourseRecord>(
    `SELECT id, title, description, image, price::text AS price, duration, category, created_at
     FROM public.courses WHERE id = $1 LIMIT 1`, [id]
  );
  return result.rows[0] ?? null;
}

export async function listGallery(limit = 100) {
  const result = await query<GalleryRecord>(
    `SELECT id, title, description, image, category, created_at
     FROM public.gallery ORDER BY created_at DESC LIMIT $1`, [limit]
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
    `SELECT id, name, description, image, position, created_at
     FROM public.groups ORDER BY created_at DESC LIMIT $1`, [limit]
  );
  return result.rows;
}

export async function getGroup(id: string) {
  const result = await query<GroupRecord>(
    `SELECT id, name, description, image, position, created_at
     FROM public.groups WHERE id = $1 LIMIT 1`, [id]
  );
  return result.rows[0] ?? null;
}

export async function listPartners(limit = 50) {
  const result = await query<PartnerRecord>(
    `SELECT id, name, logo, color, created_at
     FROM public.partners ORDER BY created_at DESC LIMIT $1`, [limit]
  );
  return result.rows;
}
