BEGIN;

ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS sort_order integer;

-- Preserve the legacy visual order for records that have not been ordered yet.
WITH ordered AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY member_type
      ORDER BY created_at DESC, id DESC
    ) - 1 AS initial_order
  FROM public.groups
)
UPDATE public.groups AS member
SET sort_order = ordered.initial_order
FROM ordered
WHERE member.id = ordered.id
  AND member.sort_order IS NULL;

ALTER TABLE public.groups
  ALTER COLUMN sort_order SET DEFAULT 0,
  ALTER COLUMN sort_order SET NOT NULL;

DROP INDEX IF EXISTS public.groups_member_type_sort_order_key;
ALTER TABLE public.groups
  DROP CONSTRAINT IF EXISTS groups_member_type_sort_order_key;
ALTER TABLE public.groups
  ADD CONSTRAINT groups_member_type_sort_order_key
  UNIQUE (member_type, sort_order)
  DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS groups_member_type_order_idx
  ON public.groups (member_type, sort_order, created_at, id);

COMMIT;
