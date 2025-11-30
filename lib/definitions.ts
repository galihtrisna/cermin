export type Role = "superadmin" | "admin" | "staff" | null;

export interface Users {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_verified: boolean;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}
