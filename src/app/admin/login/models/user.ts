export interface IUser {
  id: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}