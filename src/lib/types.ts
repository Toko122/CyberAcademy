export interface AppUserProfile {
  role: string | null;
}

export interface CourseRecord {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number | string | null;
  total_price: number | string | null;
  monthly_price: number | string | null;
  duration: string | null;
  category?: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  teacher_image: string | null;
  created_at?: string;
}

export interface GalleryRecord {
  id: string;
  title: string;
  description: string | null;
  image: string;
  category: string | null;
  created_at?: string;
}

export interface GroupRecord {
  id: string;
  name: string;
  description: string | null;
  image: string;
  member_type: MemberType;
  sort_order: number;
  created_at?: string;
}

export type MemberType = "administration" | "teacher";

export interface PartnerRecord {
  id: string;
  name: string;
  logo: string;
  color: string | null;
  created_at?: string;
}
