-- Non-destructive migration for an existing database that already contains
-- courses, gallery, groups, and partners. Run database/schema.sql first.
-- Existing content IDs and URLs remain valid; no content rows are copied.
--
-- Supabase Auth password hashes are platform-managed and cannot be migrated
-- into the application's scrypt format. Provision each administrator with
-- scripts/create-admin.mjs after setting DB_URL, ADMIN_EMAIL, and
-- ADMIN_PASSWORD. Confirm login before retiring the Supabase project.

BEGIN;

-- Normalize numeric course prices that may have been created as a narrower
-- numeric type. This is widening-only and preserves values.
ALTER TABLE public.courses
  ALTER COLUMN price TYPE numeric(12,2)
  USING price::numeric(12,2);

COMMIT;
