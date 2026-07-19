-- Cyber Academy: standard PostgreSQL schema (PostgreSQL 15+)
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_email_nonblank CHECK (btrim(email::text) <> ''),
  CONSTRAINT users_password_nonblank CHECK (btrim(password) <> ''),
  CONSTRAINT users_role_allowed CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  price numeric(12,2) NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'პროგრამირება',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT courses_title_nonblank CHECK (btrim(title) <> ''),
  CONSTRAINT courses_price_nonnegative CHECK (price >= 0),
  CONSTRAINT courses_category_allowed CHECK (
    category IN ('პროგრამირება', 'დიზაინი', 'მარკეტინგი', 'IT სპეციალისტი')
  )
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gallery_title_nonblank CHECK (btrim(title) <> '')
);

CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT groups_name_nonblank CHECK (btrim(name) <> ''),
  CONSTRAINT groups_position_nonblank CHECK (btrim(position) <> '')
);

CREATE TABLE IF NOT EXISTS public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'bg-cyan-500/10',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partners_name_nonblank CHECK (btrim(name) <> ''),
  CONSTRAINT partners_color_allowed CHECK (
    color IN (
      'bg-cyan-500/10', 'bg-blue-500/10', 'bg-indigo-500/10',
      'bg-purple-500/10', 'bg-emerald-500/10', 'bg-amber-500/10',
      'bg-rose-500/10', 'bg-white/5'
    )
  )
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_set_updated_at ON public.users;
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS courses_set_updated_at ON public.courses;
CREATE TRIGGER courses_set_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS gallery_set_updated_at ON public.gallery;
CREATE TRIGGER gallery_set_updated_at BEFORE UPDATE ON public.gallery
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS groups_set_updated_at ON public.groups;
CREATE TRIGGER groups_set_updated_at BEFORE UPDATE ON public.groups
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS partners_set_updated_at ON public.partners;
CREATE TRIGGER partners_set_updated_at BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS courses_created_at_desc_idx ON public.courses (created_at DESC);
CREATE INDEX IF NOT EXISTS gallery_created_at_desc_idx ON public.gallery (created_at DESC);
CREATE INDEX IF NOT EXISTS groups_created_at_desc_idx ON public.groups (created_at DESC);
CREATE INDEX IF NOT EXISTS partners_created_at_desc_idx ON public.partners (created_at DESC);
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);

COMMENT ON COLUMN public.users.password IS 'bcrypt or Node.js scrypt hash; never expose through application responses.';
COMMENT ON COLUMN public.courses.image IS 'Public image URL, normally hosted by Cloudinary.';
COMMENT ON COLUMN public.gallery.image IS 'Public image URL, normally hosted by Cloudinary.';
COMMENT ON COLUMN public.groups.image IS 'Public image URL, normally hosted by Cloudinary.';
COMMENT ON COLUMN public.partners.logo IS 'Public logo URL, normally hosted by Cloudinary.';

COMMIT;
